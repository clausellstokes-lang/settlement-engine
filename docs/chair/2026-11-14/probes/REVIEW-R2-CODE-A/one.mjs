import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [file, seeds, expr] = process.argv.slice(2); const W=new Set(seeds.split(',')); const F=new Function('s',`return (${expr});`);
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const seed=line.slice(9,line.indexOf('","s"')); if(!W.has(seed)) continue; const {s}=JSON.parse(line); let v; try{ v=F(s);}catch(e){v='ERR '+e.message;} console.log(seed+'\t'+(typeof v==='string'?v:JSON.stringify(v))); }
