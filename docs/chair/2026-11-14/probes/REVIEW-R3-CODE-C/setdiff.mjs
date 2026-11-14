// setdiff.mjs <base.gz> <tip.gz> <js expr returning array of strings>: per town, strings added and removed (multiset), tallied
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [fa, fb, expr, show='0'] = process.argv.slice(2); const F=new Function('s',`return (${expr});`);
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); let v=[]; try{ v=F(s)||[]; }catch{} m.set(seed,v.map(String)); } return m; }
const A=await load(fa), B=await load(fb); const add=new Map(), rem=new Map(); let moved=0;
for(const [seed,b] of B){ const a=[...(A.get(seed)||[])]; const bb=[...b]; const ad=[]; for(const x of bb){ const i=a.indexOf(x); if(i>=0) a.splice(i,1); else ad.push(x);} if(ad.length||a.length) moved++;
  for(const x of ad) (add.get(x)||add.set(x,[]).get(x)).push(seed); for(const x of a) (rem.get(x)||rem.set(x,[]).get(x)).push(seed); }
console.log('towns moved',moved);
for(const [k,v] of [...add].sort((x,y)=>y[1].length-x[1].length)) console.log('+ '+v.length+'\t'+k.slice(0,260)+'\t'+v.slice(0,+show||3).join(' '));
for(const [k,v] of [...rem].sort((x,y)=>y[1].length-x[1].length)) console.log('- '+v.length+'\t'+k.slice(0,260)+'\t'+v.slice(0,+show||3).join(' '));
