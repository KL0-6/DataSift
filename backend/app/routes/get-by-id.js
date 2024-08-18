const express = require("express");
const router = express.Router();
const zlib = require("zlib");
const mongoDB = require("../public/mongodb/mongodb.js");
const { errorCounter } = require("../public/prometheus/prometheus.js");

const requiredParamaters = ["defaultDatasetId", "token"];

router.get("/", async function(req, res)
{
    const query = req.query;

    // Validate parameters
    const missingParams = requiredParamaters.filter(param => !req.query[param]);
    if (missingParams.length > 0) 
        return res.status(400).json({ error: `Missing parameter(s): ${missingParams.join(", ")}` });

    const defaultDatasetId = query["defaultDatasetId"];
    const token = query["token"];

    try
    {
        if (!await mongoDB.tokenExists(token))
            return res.status(400).json({ error: "Invalid token." });
        else if(!await mongoDB.datasetExists(token, defaultDatasetId))
            return res.status(400).json({ error: "Invalid defaultDatasetId." });

        const document = await mongoDB.getDatasetById(token, defaultDatasetId);
    
        // Decompress and decode content
        const htmlContent = zlib.gunzipSync(Buffer.from(document.html_content, "base64")).toString();
        const markdownContent = zlib.gunzipSync(Buffer.from(document.markdown_content, "base64")).toString();
        const textContent = zlib.gunzipSync(Buffer.from(document.text_content, "base64")).toString();
        let summary = document.summary;
        if(summary)
            summary = zlib.gunzipSync(Buffer.from(summary, "base64")).toString();;

        // Respond with the document data
        res.json({
            defaultDatasetId: document.defaultDatasetId,
            url: document.url,
            html_content: htmlContent,
            markdown_content: markdownContent,
            text_content: textContent,
            summary: summary,
            category: document.category,
            timestamp: document.timestamp
        });
    }
    catch(error)
    {
        errorCounter.inc({ error_name: error.toString(), route: "/get-by-id" });

        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;