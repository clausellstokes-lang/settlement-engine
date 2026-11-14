// Field diff of two corpora (same seeds): which families of the record moved, in how many towns.
//   A=<base corpus> B=<tip corpus> node fielddiff.mjs > out
import fs from 'node:fs'; import zlib from 'node:zlib';
const load=(f)=>new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map(l=>{const o=JSON.parse(l);return [o.seed,o.s];}));
const A=load(process.env.A), B=load(process.env.B);
const fam=new Map(); const keysNew=new Map(); const keysGone=new Map(); const ex=new Map();
const famOf=(p)=>p.replace(/\[\d+\]/g,'[]').split('.').slice(0,3).join('.');
function walk(a,b,p,seed,acc){
  if(a===b) return; const ta=Array.isArray(a)?'arr':typeof a, tb=Array.isArray(b)?'arr':typeof b;
  if(ta!==tb||a===null||b===null||ta!=='object'&&ta!=='arr'){ acc.add(famOf(p)); if(!ex.has(famOf(p))) ex.set(famOf(p),`${seed} ${p}: ${JSON.stringify(a)?.slice(0,90)} -> ${JSON.stringify(b)?.slice(0,90)}`); return; }
  if(ta==='arr'){ const n=Math.max(a.length,b.length); for(let i=0;i<n;i++) walk(a[i],b[i],`${p}[${i}]`,seed,acc); return; }
  for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
    if(!(k in a)) { const f=famOf(`${p}.${k}`); keysNew.set(f,(keysNew.get(f)||0)+1); }
    if(!(k in b)) { const f=famOf(`${p}.${k}`); keysGone.set(f,(keysGone.get(f)||0)+1); }
    walk(a[k],b[k],p?`${p}.${k}`:k,seed,acc);
  }
}
for(const [seed,a] of A){ const b=B.get(seed); if(!b) continue; const acc=new Set(); walk(a,b,'',seed,acc); for(const f of acc) fam.set(f,(fam.get(f)||0)+1); }
console.log('## families moved (towns of', A.size, ')'); for(const [f,n] of [...fam].sort((x,y)=>y[1]-x[1])) console.log(String(n).padStart(4), f, '|', ex.get(f));
console.log('## keys new at B'); for(const [f,n] of [...keysNew].sort((x,y)=>y[1]-x[1])) console.log(String(n).padStart(5), f);
console.log('## keys gone at B'); for(const [f,n] of [...keysGone].sort((x,y)=>y[1]-x[1])) console.log(String(n).padStart(5), f);
