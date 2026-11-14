// q.mjs <births.gz> <js filter returning value or null> : prints seed<TAB>value for each non-null
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [file, expr] = process.argv.slice(2); const F=new Function('s','seed',`return (${expr});`);
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); let v; try{ v=F(s,seed);}catch(e){ v='ERR '+e.message; } if(v!==null&&v!==undefined&&v!==false) console.log(seed+'\t'+(typeof v==='string'?v:JSON.stringify(v))); }
