// vantlines.mjs: every crisis-summary pool entry that differs base->tip; for each, the towns (tip births) whose surface prints it
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/wt/tip/src', B='/tmp/claude-0/wt/base/src';
const t=await import(T+'/domain/crisis/crisisSummaryVantage.js'), b=await import(B+'/domain/crisis/crisisSummaryVantage.js');
const flat=(P)=>{ const m={}; (function w(x,p){ if(typeof x==='string') m[p]=x; else if(x&&typeof x==='object') for(const k in x) w(x[k],p?p+'.'+k:k); })(P,''); return m; };
const ft=flat(t.CRISIS_SUMMARY_POOLS), fb=flat(b.CRISIS_SUMMARY_POOLS); const changed=Object.keys(ft).filter(k=>ft[k]!==fb[k]);
console.log('changed entries',changed.length, 'gone', Object.keys(fb).filter(k=>!(k in ft)).length);
const tmpl=(s)=>new RegExp('^'+s.replace(/[.*+?^$()|[\]\\]/g,'\\$&').replace(/\{name\}/g,'.+?')+'$');
const L=changed.map(k=>({k,text:ft[k],rx:tmpl(ft[k]),towns:[]}));
const rl=readline.createInterface({input:fs.createReadStream('/tmp/claude-0/runs/tip.ndjson.gz').pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); const st=[].concat(s.stress||[]);
  for(const e of st) for(const surf of ['cover','overview','defence','tonight']){ let v; try{ v=t.crisisSummaryForSurface(e,s.name,surf);}catch{continue;} for(const l of L) if(l.rx.test(v)&&l.k.includes('.'+surf+'.')) l.towns.push({seed,tier:s.tier,pop:s.population,kind:e.type,st:st.map(x=>x.type).join('+'),surf}); } }
const SZ=['thorp','hamlet','village','town','city','metropolis'];
const out=[];
for(const l of L){ const sz=[...new Set(l.towns.map(x=>x.tier))].sort((a,b)=>SZ.indexOf(a)-SZ.indexOf(b)); const sorted=[...l.towns].sort((a,b)=>SZ.indexOf(a.tier)-SZ.indexOf(b.tier)||a.pop-b.pop);
  out.push({k:l.k,text:l.text,n:l.towns.length,sizes:sz,smallest:sorted[0],largest:sorted[sorted.length-1],sample:l.towns.slice(0,6).map(x=>x.seed+':'+x.st),all:l.towns});
  console.log(`${l.k}\t${l.towns.length}\t${sz.join(',')}\t${sorted[0]?.seed}(${sorted[0]?.pop})\t${sorted[sorted.length-1]?.seed}(${sorted[sorted.length-1]?.pop})`); }
fs.writeFileSync('/tmp/claude-0/runs/vantlines.json', JSON.stringify(out,null,1));
