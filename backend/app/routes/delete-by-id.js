const express = require("express");
const router = express.Router();
const mongoDB = require("../public/mongodb/mongodb.js");
const { errorCounter } = require("../public/prometheus/prometheus.js");

const requiredParamaters = ["defaultDatasetId", "token"];

router.delete("/", async function(req, res)
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

        // Delete the document based on defaultDatasetId
        const result = await mongoDB.deleteDocumentById(token, defaultDatasetId);

        if(result === null)
            return res.status(400).json({ error: "Invalid permission." });

        if (result.modifiedCount === 0) 
            return res.status(404).json({ error: "defaultDatasetId not found" });
        
        res.json({ message: "Dataset deleted successfully" });
    }
    catch(error)
    {
        errorCounter.inc({ error_name: error.toString(), route: "/delete-by-id" });

        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
