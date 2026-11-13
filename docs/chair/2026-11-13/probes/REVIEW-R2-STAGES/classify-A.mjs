// node classify-A.mjs <base gz> <tip gz>: each moved string field of stage A, the same row reworded or another row drawn.
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const A=read(process.argv[2]), B=read(process.argv[3]);
const words=(s)=>String(s).split(/\s+/);
function wdiff(a,b){ const x=words(a), y=words(b); const n=x.length,m=y.length; const d=Array.from({length:n+1},()=>new Array(m+1).fill(0)); for(let i=0;i<=n;i++)d[i][0]=i; for(let j=0;j<=m;j++)d[0][j]=j; for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(x[i-1]===y[j-1]?0:1)); return d[n][m]/Math.max(n,m); }
const rows=[];
function cmp(seed,path,a,b){ if(a===b) return; rows.push({seed,path,a,b,r:wdiff(a,b)}); }
for(const [seed,a] of A){ const b=B.get(seed);
  cmp(seed,'pressureSentence',a.pressureSentence,b.pressureSentence); cmp(seed,'arrivalScene',a.arrivalScene,b.arrivalScene); cmp(seed,'recentConflict',JSON.stringify(a.powerStructure?.recentConflict),JSON.stringify(b.powerStructure?.recentConflict));
  (a.npcs||[]).forEach((n,i)=>{ const m=b.npcs[i]; cmp(seed,`npc${i}.secret.what`,n.secret?.what,m?.secret?.what); cmp(seed,`npc${i}.secret.stakes`,n.secret?.stakes,m?.secret?.stakes); cmp(seed,`npc${i}.goal.short`,n.goal?.short,m?.goal?.short); });
  (a.economicViability?.plotHooks||[]).forEach((h,i)=>{ cmp(seed,`plotHook${i}`,JSON.stringify(h),JSON.stringify(b.economicViability.plotHooks[i])); });
}
const fam=(p)=>p.replace(/npc\d+/,'npc').replace(/plotHook\d+/,'plotHook');
const by=new Map(); for(const r of rows){ const k=fam(r.path)+(r.r<=0.25?' REWORD':' REDEAL'); (by.get(k)||by.set(k,[]).get(k)).push(r); }
for(const [k,v] of [...by].sort()) { console.log(`${k}: ${v.length} fields, ${new Set(v.map(r=>r.seed)).size} towns`); }
const out=process.argv[4]; if(out) fs.writeFileSync(out, JSON.stringify(rows,null,1));
