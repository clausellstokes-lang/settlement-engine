// sample-rm.mjs <baseDir> <tipDir> <which> [n=30]: a fixed-stride sample of the cards whose position was REMOVED, with the facts a reader needs.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A,B,W,N]=process.argv.slice(2);
const load=(d)=>{ const m=new Map(); for(const f of fs.readdirSync(d).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(d+'/'+f)).toString().split('\n')) if(l){const r=JSON.parse(l); m.set(r.key,r);} return m; };
const a=load(A), b=load(B); const rm=[];
for(const [k,ra] of [...a].sort()){ const rb=b.get(k); const bm=new Map(rb.npcs.map(c=>[c.id,c]));
  for(const c of ra.npcs){ const d=bm.get(c.id); if(d && c.sp && !d.sp) rm.push({k,ra,c}); } }
const n=Number(N||30), step=Math.max(1,Math.floor(rm.length/n));
console.log('removed',rm.length);
for(let i=0;i<rm.length&&i/step<n;i+=step){ const {k,ra,c}=rm[i]; const f=ra.factions; const fr=c.mem.slice().sort((x,y)=>(x[1]??99)-(y[1]??99))[0];
  const fp=fr?f.find(x=>x.n===fr[0]):null;
  console.log(`${k} [${ra.tier}${ra.stress.length?' '+ra.stress.join('+'):''}] ${c.title} (${c.cat}, ${c.sr}) first=${fr?fr[0]+'#'+fr[1]+'('+(fp?.c)+(fp?.g?',G':'')+')':'none'} | ${c.sp.slice(0,70)} | nobles:${f.filter(x=>x.c==='noble').map(x=>x.n).join('/')||'-'}`); }
