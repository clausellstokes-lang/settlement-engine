const z=require('zlib'),fs=require('fs');
module.exports=(p)=>z.gunzipSync(fs.readFileSync(p)).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l));
