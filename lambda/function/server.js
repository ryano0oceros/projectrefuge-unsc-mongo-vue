const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const port = 3000;

// Replace the uri string with your MongoDB Atlas connection string.
const uri = "mongodb+srv://admin:ScVuXOQydQ7gpgLo@unsc-mongo-demo.sppir.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=unsc-mongo-demo";

const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: false
});

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10 if not provided
    if (!searchQuery) {
        return res.status(400).send('Query parameter "q" is required');
    }

    try {
        await client.connect();
        const database = client.db('unsc-mongo-demo');
        const embeddings = database.collection('embeddings');

        // Define the aggregation pipeline
        const pipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query: searchQuery,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            },
            {
                $limit: limit
            }
        ];

        // Execute aggregation
        const cursor = embeddings.aggregate(pipeline);

        // Convert cursor to array
        const results = await cursor.toArray();

        // Print a message if no documents were found
        if (results.length === 0) {
            console.log("No documents found!");
        } else {
            results.forEach(doc => console.log(doc));
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error connecting to the database: ${error.message}`);
    } finally {
        await client.close();
    }
});

module.exports.handler = serverless(app);
