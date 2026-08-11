(async ()=>{
  try{
    const r = await require('dns').promises.resolveSrv('_mongodb._tcp.cluster0.dbqbnnl.mongodb.net');
    console.log(JSON.stringify(r,null,2));
  }catch(e){
    console.error('DNS SRV resolve failed:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
