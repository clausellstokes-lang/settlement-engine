import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [f,want,...paths]=process.argv.slice(2);
const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line.includes(`"seed":"${want}"`)) continue; const {s}=JSON.parse(line);
 for(const p of paths){ const v=p.split('.').reduce((o,k)=>o?.[k],s); console.log(p,'=',JSON.stringify(v)?.slice(0,1500)); } break; }
