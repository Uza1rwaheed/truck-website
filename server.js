require('dotenv').config();
const express = require('express');
const dns = require('dns');
// Use public DNS to avoid local resolver SRV failures (fixes querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8','8.8.4.4']);
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ironroute';

let quotesCollection;
let useFileFallback = false;
const QUOTES_FILE = path.join(__dirname, 'quotes.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/quote', async (req, res) => {
  const { name, email, service, details } = req.body;

  if (!name || !email || !service || !details) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  const quote = {
    name,
    email,
    service,
    details,
    createdAt: new Date()
  };

  try {
    if (quotesCollection) {
      await quotesCollection.insertOne(quote);
    } else if (useFileFallback) {
      const existing = fs.existsSync(QUOTES_FILE) ? JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8') || '[]') : [];
      existing.push(quote);
      fs.writeFileSync(QUOTES_FILE, JSON.stringify(existing, null, 2));
    } else {
      throw new Error('No storage available');
    }
    return res.json({ message: 'Your request has been received. We will contact you shortly.' });
  } catch (error) {
    console.error('Failed to save quote request:', error);
    return res.status(500).json({ message: 'Unable to save quote request at this time.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index (1).html'));
});

async function startServer() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    quotesCollection = db.collection('quotes');
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.warn('Falling back to local JSON storage at', QUOTES_FILE);
    useFileFallback = true;
    // Ensure the file exists
    try {
      if (!fs.existsSync(QUOTES_FILE)) fs.writeFileSync(QUOTES_FILE, '[]');
    } catch (fsErr) {
      console.error('Failed to initialize local quotes file:', fsErr);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (using local fallback storage)`);
    });
  }
}

startServer();
