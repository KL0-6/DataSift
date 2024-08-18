const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

process.on("uncaughtException", (error) => 
{
    console.error(`[EXCEPTION]]: ${error}`);
});
  
process.on("unhandledRejection", (reason, promise) => 
{
    console.error(`[REJECTION]: Where: ${promise} Because: ${reason}`)
});
  
function loadRoutes(routePath, basePath = "")
{
    fs.readdirSync(routePath).forEach(file => 
    {
        const fullPath = path.join(routePath, file);

        // Load recursively
        if (fs.statSync(fullPath).isDirectory())
            return loadRoutes(fullPath, path.join(basePath, file));

        // Require the route file
        const route = require(fullPath);

        // Construct the route path
        const fixedName = path.join(basePath, file).replace('.js', '');

        console.log("Registered new route:", fixedName);

        // Register the route with the app
        app.use(`/${fixedName}`, route);
    });
}

// Import all files in /routes
loadRoutes(path.join(__dirname, "routes"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => 
{
    console.log(`Server is running on http(s)://localhost:${PORT}`);
});