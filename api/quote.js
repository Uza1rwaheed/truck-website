const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;

async function getClient() {
  if (!cachedClient) {
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    cachedClient = client;
  }
  return cachedClient;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service, details } = req.body || {};

  if (!name || !email || !service || !details) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  const quote = {
    name: name.toString().trim(),
    email: email.toString().trim(),
    service: service.toString().trim(),
    details: details.toString().trim(),
    createdAt: new Date(),
  };

  try {
    const client = await getClient();
    const db = client.db();
    const collection = db.collection('quotes');
    await collection.insertOne(quote);
    return res.status(200).json({ message: 'Your request has been received. We will contact you shortly.' });
  } catch (error) {
    console.error('Quote API error:', error.message || error);
    return res.status(500).json({ message: 'Unable to save quote request at this time.' });
  }
};