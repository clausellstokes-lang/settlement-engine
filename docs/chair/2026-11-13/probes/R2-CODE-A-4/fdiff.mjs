// node fdiff.mjs <base.gz> <tip.gz> [depth=2] : towns differing, by normalised path family; then the towns
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const A=read(process.argv[2]), B=read(process.argv[3]); const D=Number(process.argv[4]||2);
const fam=new Map(); const towns=new Set(); let leaves=0;
function walk(a,b,p,seed,acc){ if(a===b) return; if(typeof a!=='object'||typeof b!=='object'||a===null||b===null){ leaves++; acc.add(p.replace(/\[\d+\]/g,'[]').split('.').slice(0,D+1).join('.')); return; }
  const ks=new Set([...Object.keys(a),...Object.keys(b)]); for(const k of ks) walk(a[k],b[k],Array.isArray(a)?`${p}[${k}]`:`${p}.${k}`,seed,acc); }
for(const [seed,a] of A){ const b=B.get(seed); if(!b){console.log('MISSING',seed);continue;} const acc=new Set(); walk(a,b,'',seed,acc); if(acc.size){ towns.add(seed); for(const f of acc){ (fam.get(f)||fam.set(f,[]).get(f)).push(seed);} } }
console.log('towns differing', towns.size, 'of', A.size, 'leaves', leaves);
for(const [f,v] of [...fam].sort((x,y)=>y[1].length-x[1].length)) console.log(String(v.length).padStart(4), f, '|', v.slice(0,6).join(' '));
