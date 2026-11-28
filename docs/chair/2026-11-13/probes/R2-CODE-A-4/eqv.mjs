import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src'; const { crisisOf } = await import(R+'/domain/facts/crisisKind.js');
let n=0, sd=0, id=0, ex=[];
for (const f of process.argv.slice(2)) { const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip())});
 for await (const l of rl){ const {seed,s}=JSON.parse(l); n++;
  const a=(s.config?.stressTypes||[]).includes('under_siege'), b=crisisOf(s).has('under_siege'); if(a!==b){sd++; ex.push(seed+':'+a+'/'+b);}
  if(JSON.stringify(s.config?._isolationSupport||null)!==JSON.stringify(s.isolationSupport||null)) id++; }}
console.log({n,siegeDisagree:sd,isoDisagree:id, ex:ex.slice(0,5)});
