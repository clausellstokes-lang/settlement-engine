import fs from 'node:fs'; import zlib from 'node:zlib';
const lits=fs.readFileSync('lit49.tsv','utf8').trim().split('\n').map(l=>{const [h,thing,t]=l.split('\t'); return {h,thing,t:JSON.parse(t).replace(/\{[a-z_]+\}/g,'@@').slice(0,70)};});
const uniq=new Map(); for(const l of lits){ if(!uniq.has(l.h)) uniq.set(l.h,{...l,things:[]}); uniq.get(l.h).things.push(l.thing); }
const recs=zlib.gunzipSync(fs.readFileSync('corpus-tip.ndjson.gz')).toString().trim().split('\n').map(l=>JSON.parse(l));
const prints=[];
for(const {seed,s} of recs){ const j=JSON.stringify(s);
  for(const u of uniq.values()){ const parts=u.t.split('@@').filter(p=>p.length>12); if(!parts.length) continue; const re=new RegExp(parts.map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/"/g,'\\\\"')).join('.{0,80}?'));
    const m=j.match(re); if(m) prints.push({seed,h:u.h,things:u.things,tier:s.tier,stress:(s.stress?[].concat(s.stress):[]).map(x=>x.type),
      stone:JSON.stringify(s.config?.nearbyResources||[]).includes('stone')||JSON.stringify(s.resourceAnalysis?.availableResources||[]).includes('stone'),
      names:(s.institutions||[]).map(i=>i.name).filter(n=>/church|temple|shrine|chapel|tavern|inn|ale|fish|mercen|quarr|granar|druid|grove|smith|forge|bak/i.test(n)).join('|'), pop:s.population}); } }
const byH={}; for(const p of prints)(byH[p.h]??=[]).push(p);
console.log('literals printing', Object.keys(byH).length, 'of', uniq.size, '; prints', prints.length);
for(const [h,v] of Object.entries(byH)) console.log(h, v.length, uniq.get(h).things.join(','), '|', uniq.get(h).t.slice(0,50));
// sample 30: round-robin over literals
const out=[]; let i=0; const keys=Object.keys(byH); while(out.length<30 && i<200){ for(const k of keys){ const v=byH[k]; const idx=Math.floor(i*7919)%v.length; if(i<v.length && out.length<30) out.push(v[(i*37)%v.length]); } i++; }
fs.writeFileSync('lits-sample30.json', JSON.stringify(out,null,0)); fs.writeFileSync('lits-prints.json', JSON.stringify(byH));
