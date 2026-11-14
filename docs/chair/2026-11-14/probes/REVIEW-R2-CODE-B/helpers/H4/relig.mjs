import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const t=new Map();
for await (const line of rl){ const {seed,s}=JSON.parse(line);
 for (const i of s.institutions||[]) { const k=`${i.catalogId}|${i.name}`; if(!/church|cathedral|monaster|friary|abbey|priory|convent|temple|chapel|shrine|worship/i.test(k)) continue; t.set(k,(t.get(k)||0)+1);} }
for (const [k,v] of [...t].sort((a,b)=>b[1]-a[1])) console.log(v+'\t'+k);
