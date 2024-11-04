const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const serverless = require('serverless-http');
const util = require('util');

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
    // Log the incoming request
    console.log('Incoming request:', util.inspect({
        method: req.method,
        path: req.path,
        query: req.query,
        headers: req.headers
    }, { depth: null }));

    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10 if not provided

    if (!searchQuery) {
        console.log('Missing query parameter "q"');
        return res.status(400).send('Query parameter "q" is required');
    }

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB');

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

        // Log the aggregation pipeline
        console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2));

        // Execute aggregation
        const cursor = embeddings.aggregate(pipeline);

        // Convert cursor to array
        const results = await cursor.toArray();

        // Log the number of results
        console.log(`Number of documents found: ${results.length}`);

        // Print a message if no documents were found
        if (results.length === 0) {
            console.log("No documents found!");
        } else {
            results.forEach((doc, index) => console.log(`Document ${index + 1}:`, JSON.stringify(doc, null, 2)));
        }

        res.json(results);
    } catch (error) {
        console.error('Error during MongoDB operation:', error);
        res.status(500).send(`Error connecting to the database: ${error.message}`);
    } finally {
        console.log('Closing MongoDB connection');
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports.handler = serverless(app);
