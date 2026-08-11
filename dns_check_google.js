(async ()=>{
  try{
    const dns = require('dns');
    dns.setServers(['8.8.8.8','8.8.4.4']);
    const r = await dns.promises.resolveSrv('_mongodb._tcp.cluster0.dbqbnnl.mongodb.net');
    console.log(JSON.stringify(r,null,2));
  }catch(e){
    console.error('DNS SRV resolve failed (google):', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
