// REVIEW-R2-STAGES field diff: node fielddiff.mjs <base corpus.ndjson.gz> <tip corpus.ndjson.gz> [maxPaths]
// Every leaf path of every birth compared, base against tip; prints towns moved, and paths by top-level family.
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const A=read(process.argv[2]), B=read(process.argv[3]); const MAX=+(process.argv[4]||40);
const norm=(p)=>p.replace(/\[\d+\]/g,'[]');
const diffs=[]; // [seed, path]
function walk(a,b,p,seed){
  if(a===b) return; const ta=Array.isArray(a)?'arr':typeof a, tb=Array.isArray(b)?'arr':typeof b;
  if(ta!==tb||a===null||b===null||ta!=='object'&&ta!=='arr'){ if(!(Number.isNaN(a)&&Number.isNaN(b))) diffs.push([seed,p]); return; }
  if(ta==='arr'){ const n=Math.max(a.length,b.length); for(let i=0;i<n;i++) walk(a[i],b[i],`${p}[${i}]`,seed); return; }
  const ks=new Set([...Object.keys(a),...Object.keys(b)]); for(const k of ks){ if(!(k in a)||!(k in b)){ diffs.push([seed,`${p}.${k}${!(k in a)?' (NEW KEY)':' (GONE KEY)'}`]); continue;} walk(a[k],b[k],`${p}.${k}`,seed); }
}
let missing=0; for(const [seed,a] of A){ const b=B.get(seed); if(!b){missing++;continue;} walk(a,b,'',seed); }
const towns=new Set(diffs.map(d=>d[0])); const fam=new Map(), path=new Map();
for(const [seed,p] of diffs){ const f=p.split(/[.[]/)[1]||p; (fam.get(f)||fam.set(f,new Set()).get(f)).add(seed); const n=norm(p); (path.get(n)||path.set(n,new Set()).get(n)).add(seed); }
console.log(`births base ${A.size} tip ${B.size} missing ${missing}; leaf diffs ${diffs.length}; towns moved ${towns.size}`);
for(const [f,s] of [...fam].sort((x,y)=>y[1].size-x[1].size)) console.log(`family ${f}: ${s.size} towns`);
for(const [p,s] of [...path].sort((x,y)=>y[1].size-x[1].size).slice(0,MAX)) console.log(`  ${s.size}\t${p}\t e.g. ${[...s][0]}`);
