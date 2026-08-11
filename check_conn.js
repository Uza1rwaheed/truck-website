require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://truck:truck123@cluster0.dbqbnnl.mongodb.net/ironroute?retryWrites=true&w=majority';

(async function(){
  try {
    console.log('Using URI:', uri.replace(/:\/\/.+@/, '://<user>:<pass>@'));
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully');
    await client.db().command({ ping: 1 });
    console.log('Ping OK');
    await client.close();
  } catch (err) {
    console.error('Connection failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
