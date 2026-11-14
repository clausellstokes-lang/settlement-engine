// facts.mjs <births.gz> <regex> <js expr over s and v>: for every town where a string leaf matches regex, print the expr's value
// (a fact of the town's record), tallied. e.g. "JSON.stringify(s.economicState.foodSecurity.foodRecord.foodSources)"
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [file, re, expr, show='0'] = process.argv.slice(2); const RX=new RegExp(re); const F=new Function('s','v','seed',`return (${expr});`);
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity}); const t=new Map(); let n=0;
for await (const line of rl){ const {seed,s}=JSON.parse(line); let hit=null; (function w(x){ if(hit) return; if(typeof x==='string'){ if(RX.test(x)) hit=x; } else if(Array.isArray(x)) x.forEach(w); else if(x&&typeof x==='object') for(const k in x) w(x[k]); })(s);
  if(!hit) continue; n++; let val; try{ val=String(F(s,hit,seed)); }catch(e){ val='ERR '+e.message; } const e=t.get(val)||[]; e.push(seed); t.set(val,e); }
console.log('towns',n); for(const [k,v] of [...t].sort((a,b)=>b[1].length-a[1].length)) console.log(v.length+'\t'+k+'\t'+(+show?v.slice(0,+show).join(' '):v[0]));
