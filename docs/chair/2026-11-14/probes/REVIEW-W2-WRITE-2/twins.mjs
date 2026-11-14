// twins.mjs <tipTree> <items.json>: for each listed line, every mark that ALL its pool siblings with the same crisis
// scope carry and it lacks (a twin that lacks a condition its siblings carry). Crisis scope: lines with a 'crisis: X'
// mark are compared with siblings carrying the same mark; lines without, with siblings without any 'crisis:' mark.
import fs from 'node:fs';
const [T,I]=process.argv.slice(2); const items=JSON.parse(fs.readFileSync(I,'utf8'));
const pools=new Map(); const dir=`${T}/src/data/dossierStateProse`;
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){ const m=await import(`${dir}/${f}`);
  for(const obj of Object.values(m)) if(obj&&typeof obj==='object') for(const [block,b] of Object.entries(obj)) if(b&&b.pools) for(const [pool,vs] of Object.entries(b.pools)) pools.set(`${block}::${pool}`,vs); }
const scope=ms=>ms.filter(x=>/^crisis(:|$)/.test(x)).sort().join('|');
for(const it of items){ const vs=pools.get(`${it.block}::${it.pool}`)||[]; const me=vs.find(v=>v.vid===it.vid); if(!me) continue;
  const sib=vs.filter(v=>v.vid!==it.vid && scope(v.marks||[])===scope(me.marks||[]) && (v.audience||'')===(me.audience||''));
  if(sib.length<2) continue; const cnt={}; for(const v of sib) for(const m of new Set(v.marks||[])) cnt[m]=(cnt[m]||0)+1;
  const lack=Object.entries(cnt).filter(([m,n])=>n===sib.length && !(me.marks||[]).includes(m) && !/^(colour|angle)/.test(m)).map(([m])=>m);
  if(lack.length) console.log(`${it.id} [${(me.marks||[]).join(' · ')}] lacks ${lack.join(', ')} (all ${sib.length} same-scope siblings carry it)`); }
