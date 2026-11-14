const zlib=require('zlib'),fs=require('fs');
const R=process.argv[2],t=process.argv[3],path=process.argv[4];
const j=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`)));
let v=j;for(const p of path.split('.').filter(Boolean))v=v?.[p];
console.log(JSON.stringify(v,null,1).slice(0,+process.argv[5]||3000));
