import zlib from 'node:zlib'; import fs from 'node:fs';
const txt = zlib.gunzipSync(fs.readFileSync(process.argv[2]+'/corpus.ndjson.gz')).toString();
const lc=(x)=>String(x?.name??x?.good??x).toLowerCase();
let n=0; const ex=[]; const by={};
for (const line of txt.split('\n')) { if(!line) continue; const {seed,s}=JSON.parse(line);
  const e=s.economicState||{}; const prod=new Set((e.localProduction||[]).map(lc));
  const hit=(e.necessityImports||[]).filter(g=>prod.has(lc(g)));
  if(hit.length){n++; by[hit.join(',')]=(by[hit.join(',')]||0)+1; if(ex.length<4) ex.push({seed,nec:e.necessityImports,prod:[...prod].slice(0,12),route:s.config?.tradeRouteAccess});}
}
console.log(n,by); console.log(JSON.stringify(ex,null,1));
