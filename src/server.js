const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:ScVuXOQydQ7gpgLo@unsc-mongo-demo.sppir.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=unsc-mongo-demo";

const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
});

exports.handler = async (event, context) => {
    console.log('Incoming event:', JSON.stringify(event, null, 2));

    // Extract HTTP method, raw path, and raw query string
    const httpMethod = event.requestContext.http.method;
    const rawPath = event.rawPath;
    let rawQueryString = event.rawQueryString;

    console.log('Raw path:', rawPath);
    console.log('Raw query string:', rawQueryString);

    // Ensure the path matches the expected route
    if (httpMethod !== 'GET' || rawPath !== '/prod/search') {
        console.log(`Unexpected path: ${rawPath}`);
        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'text/html',
            },
            body: `<h1>Cannot GET ${rawPath || 'undefined'}</h1>`,
        };
    }

    // Clean the rawQueryString
    if (rawQueryString.startsWith('q=')) {
        rawQueryString = rawQueryString.slice(2); // Remove 'q='
    }
    rawQueryString = rawQueryString.replace(/%20/g, ' '); // Replace '%20' with spaces
    rawQueryString = rawQueryString.replace(/&limit=\d+/, ''); // Remove '&limit=10'

    const searchQuery = rawQueryString.trim();

    if (!searchQuery) {
        console.log('Cleaned query string is empty');
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Query parameter is required' }),
        };
    }

    console.log('Search query after cleaning:', searchQuery);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('unsc-mongo-demo');
        const embeddings = database.collection('embeddings');

        const pipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query: searchQuery,
                        path: { wildcard: "*" },
                    },
                },
            },
            { $limit: 50 },
        ];

        console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2));
        const results = await embeddings.aggregate(pipeline).toArray();
        console.log(`Number of documents found: ${results.length}`);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(results),
        };
    } catch (error) {
        console.error('Error during MongoDB operation:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Error connecting to the database: ${error.message}` }),
        };
    } finally {
        console.log('Closing MongoDB connection');
        await client.close();
    }
};
