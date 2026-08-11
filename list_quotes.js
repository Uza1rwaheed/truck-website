require('dotenv').config();
const dns = require('dns');
// ensure DNS resolvers are set
dns.setServers(['8.8.8.8','8.8.4.4']);
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
(async()=>{
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try{
    await client.connect();
    const db = client.db('truck');
    const col = db.collection('quotes');
    const docs = await col.find().sort({createdAt:-1}).limit(5).toArray();
    console.log('Recent quotes:');
    console.log(docs);
    await client.close();
  }catch(e){
    console.error('Failed to read quotes:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
