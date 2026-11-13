// select.mjs <lines.json> <stage A2|C1> <tip births.gz> <tip derived.jsonl.diff.jsonl|-> <out.json>: for each line, every town
// (of the 1,536) where it prints at the stage's tip (record lines: any string leaf matching rx; derived lines: the
// slot's value moved base→tip and matches rx), then the reading towns: a siege, a famine and an occupation where the
// line prints under one, the smallest and the largest size it reaches, filled to four.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [lf, stage, births, dd, outf] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(lf)).filter(l=>l.stage===stage); const SZ=['thorp','hamlet','village','town','city','metropolis'];
const hits = Object.fromEntries(L.map(l=>[l.id, new Map()]));
const meta = new Map();
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line); meta.set(seed,{tier:s.tier,pop:s.population,st:(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type)});
  const strs=[]; (function w(v,p){ if(typeof v==='string') strs.push([p,v]); else if(Array.isArray(v)) v.forEach((x,i)=>w(x,p+'['+i+']')); else if(v&&typeof v==='object') for(const k in v) w(v[k],p+'.'+k); })(s,'');
  for(const l of L){ if(l.src!=='rec') continue; const rx=new RegExp(l.rx); for(const [p,v] of strs) if(rx.test(v)){ if(!hits[l.id].has(seed)) hits[l.id].set(seed,{path:p,v}); } } }
if(dd!=='-'){ for(const r of fs.readFileSync(dd,'utf8').trim().split('\n').map(JSON.parse)){ for(const l of L){ if(l.src==='der'&&r.k==='vantage'&&new RegExp(l.rx).test(r.tip||'')&&!hits[l.id].has(r.seed)) hits[l.id].set(r.seed,{path:r.k,v:r.tip,base:r.base});
  if(l.src.startsWith('der:')&&r.k===l.src.slice(4)&&new RegExp(l.rx).test(r.tip||'')&&!hits[l.id].has(r.seed)) hits[l.id].set(r.seed,{path:r.k,v:r.tip,base:r.base}); } } }
const out={};
for(const l of L){ const H=[...hits[l.id]].map(([seed,h])=>({seed,...meta.get(seed),...h}));
  const pick=[]; const add=(x)=>{ if(x&&!pick.includes(x.seed)) pick.push(x.seed); };
  for(const c of ['under_siege','famine','occupied']) add(H.find(h=>h.st.includes(c)));
  const bySize=[...H].sort((a,b)=>SZ.indexOf(a.tier)-SZ.indexOf(b.tier)||a.pop-b.pop); add(bySize[0]); add(bySize[bySize.length-1]);
  for(const h of H){ if(pick.length>=4) break; add(h); }
  const sizes=[...new Set(H.map(h=>h.tier))]; const crises={}; for(const h of H) for(const c of (h.st.length?h.st:['calm'])) crises[c]=(crises[c]||0)+1;
  out[l.id]={n:H.length,sizes,crises,pick,all:H.map(h=>h.seed)};
  console.log(`${l.id}\t${H.length} towns\t${sizes.join(',')}\tpick ${pick.join(' ')}`); }
fs.writeFileSync(outf, JSON.stringify(out,null,1));
