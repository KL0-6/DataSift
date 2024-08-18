const { MongoClient, ObjectId } = require("mongodb");

class MongoDB 
{
    constructor() 
    {
        if (!MongoDB.instance)
        {
            this.client = new MongoClient("mongodb://localhost:27017");

            MongoDB.instance = this;
        }

        return MongoDB.instance;
    }

    async connect() 
    {
        if (!this.db) 
        { 
            await this.client.connect();

            this.db = this.client.db("DataSift");
        }

        return this.db;
    }

    async getTokenCollection()
    {
        const db = await this.connect();

        return db.collection("tokens");
    }

    async getDatasetCollection()
    {
        const db = await this.connect();

        return db.collection("datasets");
    }

    async tokenExists(token)
    {
        const collection = await this.getTokenCollection();

        const doc = await collection.findOne({ token: token });

        return doc !== null;
    }

    async datasetExists(token, defaultDatasetId) 
    {
        const collection = await this.getDatasetCollection();

        const doc = await collection.findOne({ token: token, datasetId: defaultDatasetId });

        return doc !== null;
    }

    async insertDataset(token, defaultDatasetId, document)
    {
        const datasetCollection = await this.getDatasetCollection();

        const result = await datasetCollection.updateOne(
            { token: token, datasetId: defaultDatasetId },
            { $set: { document: document, token: token } },
            { upsert: true }
        );

        return result;
    }

    async getDatasetById(token, defaultDatasetId) 
    {
        const datasetCollection = await this.getDatasetCollection();

        const doc = await datasetCollection.findOne(
            { datasetId: defaultDatasetId },
            { projection: { document: 1, token: 1 } }
        );

        if (!doc) 
            return null;

        return doc.document;
    }

    async deleteDocumentById(token, defaultDatasetId) 
    {
        const datasetCollection = await this.getDatasetCollection();

        // Check if the dataset exists and if the token matches
        const existingDataset = await datasetCollection.findOne({ datasetId: defaultDatasetId });
        if (existingDataset.token !== token)
            return null;

        return await datasetCollection.deleteOne({ token: token, datasetId: defaultDatasetId });    
    }

    async close() 
    {
        if (this.client) 
            await this.client.close();
    }
}

const mongoDBInstance = new MongoDB();
module.exports = mongoDBInstance;
