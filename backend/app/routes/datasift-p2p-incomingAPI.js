const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const crypto = require("crypto");
const zlib = require("zlib");

const mongoDB = require("../public/mongodb/mongodb.js");
const { categorizeWebsite } = require("../public/NLP/NLP.js")
const { errorCounter } = require("../public/prometheus/prometheus.js");
const { HTMLToMarkdown } = require("../public/HTMLToMarkdown/HTMLToMarkdown.js"); // Written by Alex, github.com/Alexflamer11/HtmlToAst, ported from C++ to JS

const requiredParamaters = ["url_to_scrape", "token"];

// The version of chrome puppeteer is using
const chromeVersion = "127.0.0.0";

// Retrieve a query parameter's value or return a default value
const getParameter = (query, parameter, defaultValue = null) => query[parameter] !== undefined ? query[parameter] : defaultValue;

// Delay function that returns a promise that resolves after a specified number of milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique DatasetId
function generateDatasetId(extraData = "")
{
    const randomString = crypto.randomBytes(8).toString("hex");
    const hash = crypto.createHash("sha256").update(randomString + extraData).digest("hex");

    return `dataset_${hash}`;
}

// Define platforms with sec-ch-ua-platform, navigator.platform, and WebGL information.
const platforms = 
[
    // Linux
    { platform: "(X11; Linux x86_64)", secChUaPlatform: "Linux", navigatorPlatform: "Linux x86_64", webglVendor: "Google Inc. (NVIDIA Corporation)", webglRenderer: "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 3060/PCIe/SSE2, OpenGL 4.6.0)" },
    { platform: "(X11; Ubuntu; Linux x86_64)", secChUaPlatform: "Linux", navigatorPlatform: "Linux x86_64", webglVendor: "Google Inc. (NVIDIA Corporation)", webglRenderer: "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 3070/PCIe/SSE2, OpenGL 4.6.0)" },
    { platform: "(X11; Fedora; Linux x86_64)", secChUaPlatform: "Linux", navigatorPlatform: "Linux x86_64", webglVendor: "Google Inc. (NVIDIA Corporation)", webglRenderer: "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 3080/PCIe/SSE2, OpenGL 4.6.0)" },

    // Windows
    // AMD doesn't provide specific information on the GPU model.
    { platform: "(Windows NT 10.0; Win64; x64)", secChUaPlatform: "Windows", navigatorPlatform: "Win64", webglVendor: "Google Inc. (Intel)", webglRenderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)", cpuCoreCount: 6 },
    { platform: "(Windows NT 10.0; Win64; x64)", secChUaPlatform: "Windows", navigatorPlatform: "Win64", webglVendor: "Google Inc. (AMD)", webglRenderer: "ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0), or similar" },
    { platform: "(Windows NT 10.0; Win64; x64)", secChUaPlatform: "Windows", navigatorPlatform: "Win64", webglVendor: "Google Inc. (NVIDIA Corporation)", webglRenderer: "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 3050/PCIe/SSE2, OpenGL 4.6.0)" },

    // macOS
    // Apple doesn't provide information about it's OS version. It is defaulted to 10.15.7. Also, Arm macs show up as intel.
    { platform: "(Macintosh; Intel Mac OS X 10_15_7)", secChUaPlatform: "macOS", navigatorPlatform: "MacIntel", webglVendor: "Google Inc. (Apple)", webglRenderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Max, Unspecified Version)", cpuCoreCount: 14 },
    { platform: "(Macintosh; Intel Mac OS X 10_15_7)", secChUaPlatform: "macOS", navigatorPlatform: "MacIntel", webglVendor: "Google Inc. (Apple)", webglRenderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Max, Unspecified Version)", cpuCoreCount: 16 },
    { platform: "(Macintosh; Intel Mac OS X 10_15_7)", secChUaPlatform: "macOS", navigatorPlatform: "MacIntel", webglVendor: "Google Inc. (Apple)", webglRenderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro, Unspecified Version)", cpuCoreCount: 11 },
    { platform: "(Macintosh; Intel Mac OS X 10_15_7)", secChUaPlatform: "macOS", navigatorPlatform: "MacIntel", webglVendor: "Google Inc. (Apple)", webglRenderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Max, Unspecified Version)", cpuCoreCount: 12 },
    { platform: "(Macintosh; Intel Mac OS X 10_15_7)", secChUaPlatform: "macOS", navigatorPlatform: "MacIntel", webglVendor: "Google Inc. (Apple)", webglRenderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)", cpuCoreCount: 12 },
];

router.get("/", async function(req, res)
{
    const query = req.query;

    // Validate parameters
    const missingParams = requiredParamaters.filter(param => !req.query[param]);
    if (missingParams.length > 0) 
        return res.status(400).json({ error: `Missing parameter(s): ${missingParams.join(", ")}` });

    const url_to_scrape = query["url_to_scrape"];
    const token = query["token"];

    try
    {
        if (!await mongoDB.tokenExists(token))
            return res.status(400).json({ error: "Invalid token." });
    }
    catch(error)
    {
        errorCounter.inc({ error_name: error.toString(), route: "/datasift-p2p-incomingAPI" });

        return res.status(500).json({ error: "Internal server error" });
    }

    const timeout = getParameter(query, "timeout", 10) * 1000; // Default is 10 seconds
    const waitBeforeScraping = getParameter(query, "waitBeforeScraping", 0) * 1000; // Default is 0 second
    const shouldCategorize = getParameter(query, "shouldCategorize", false); // Default is false

    // Set randomized User-Agent and platform
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const userAgent = `Mozilla/5.0 ${randomPlatform.platform} AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;

    if(randomPlatform.cpuCoreCount === undefined)
        randomPlatform.cpuCoreCount = [4, 6, 8, 16, 32][Math.floor(Math.random() * 5)];
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: 
        [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--user-agent=${userAgent}`,
            `--window-size=1920,1080`,
        ]
    });
    
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 }); // Size
    await page.setUserAgent(userAgent); // Set spoofed useragent

    // Intercept and modify network requests
    await page.setRequestInterception(true);
    page.on("request", request => 
    {
        const headers = { ...request.headers() };

        headers["sec-ch-ua-platform"] = randomPlatform.secChUaPlatform;

        request.continue({ headers });
    });

    await page.evaluateOnNewDocument((randomPlatform) => 
    {
        // Spoof navigator.webdriver
        Object.defineProperty(navigator, "webdriver", { get: () => false });

        // Spoof navigator.platform
        Object.defineProperty(navigator, "platform", { get: () => randomPlatform.navigatorPlatform });

        // Spoof CPU core count
        Object.defineProperty(navigator, "hardwareConcurrency", { get: () => randomPlatform.cpuCoreCount });

        // Spoof WebGL information
        const originalWebGLRenderingContextGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(param) 
        {
            const dbgRenderInfo = this.getExtension("WEBGL_debug_renderer_info");
            if(dbgRenderInfo)
            {
                switch(param)
                {
                    case dbgRenderInfo.UNMASKED_VENDOR_WEBGL:
                        return randomPlatform.webglVendor;
                    case dbgRenderInfo.UNMASKED_RENDERER_WEBGL:
                        return randomPlatform.webglRenderer;
                }
            }
            
            return originalWebGLRenderingContextGetParameter.call(this, param);
        };

        // Spoof WebGL2 information
        const originalWebGL2RenderingContextGetParameter = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(param) 
        {
            const dbgRenderInfo = this.getExtension("WEBGL_debug_renderer_info");
            if(dbgRenderInfo)
            {
                switch(param)
                {
                    case dbgRenderInfo.UNMASKED_VENDOR_WEBGL:
                        return randomPlatform.webglVendor;
                    case dbgRenderInfo.UNMASKED_RENDERER_WEBGL:
                        return randomPlatform.webglRenderer;
                }
            }
            
            return originalWebGL2RenderingContextGetParameter.call(this, param);
        };
    }, randomPlatform);

    try
    {
        // Go to the page
        await page.goto(url_to_scrape, { waitUntil: "domcontentloaded" });

        // Delay before scraping
        await delay(waitBeforeScraping);

        // Wait for the page to load
        await page.waitForFunction("document.readyState === \"complete\"", { timeout });

        // Grab the HTML after it's finished loading
        const pageSource = await page.content();
        const pageMarkdown = HTMLToMarkdown(pageSource);

        // Extract text content
        const textContent = await page.evaluate(() => 
        {
            return document.body.innerText || "";
        });

        // Create a uniqueId for this query
        const defaultDatasetId = generateDatasetId(pageSource);

        // Use NLP to categorize website text
        let category = null;
        if(shouldCategorize)
            category = await categorizeWebsite(textContent);

        // Insert into mongodb
        await mongoDB.insertDataset(token, defaultDatasetId, 
        {
            url: url_to_scrape,
            html_content: zlib.gzipSync(pageSource).toString("base64"),
            markdown_content: zlib.gzipSync(pageMarkdown).toString("base64"),
            text_content: zlib.gzipSync(textContent).toString("base64"),
            category: category,
            timestamp: new Date()
        });

        res.json({
            defaultDatasetId: defaultDatasetId,
            html_content: pageSource,
            markdown_content: pageMarkdown,
            text_content: textContent,
            category: category
        });
    }
    catch(error)
    {
        errorCounter.inc({ error_name: error.toString(), route: "/datasift-p2p-incomingAPI" });

        return res.status(500).json({ error: "Internal server error" });
    }
    finally
    {
        await browser.close();
    }
});

module.exports = router;