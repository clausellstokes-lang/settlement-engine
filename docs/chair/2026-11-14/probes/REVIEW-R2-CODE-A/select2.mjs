import fs from 'node:fs';
const [hf, fdn, outf] = process.argv.slice(2); const H=JSON.parse(fs.readFileSync(hf)); const SZ=['thorp','hamlet','village','town','city','metropolis'];
// derived lines from the neutralised diff: L25 reason, L32 settlementReason, L49 npc plotHooks
const D={L25:[],L32:[],L49:[]}; const seen={L25:new Set(),L32:new Set(),L49:new Set()};
for(const l of fs.readFileSync(fdn,'utf8').trim().split('\n')){ const r=JSON.parse(l); const id=r.path.startsWith('.history.founding.reason')?'L25':r.path.startsWith('.settlementReason')?'L32':r.path.startsWith('.npcs')?'L49':null; if(!id) continue; if(seen[id].has(r.seed)) continue; seen[id].add(r.seed); D[id].push(r); }
const meta=(seed)=>{ const m=seed.match(/(thorp|hamlet|village|town|city|metropolis)/); return m?m[1]:'?'; };
const out={};
for(const [id,v] of Object.entries(H)){ const h=v.hits; const pick=[]; const add=x=>{ if(x&&!pick.includes(x.seed)) pick.push(x.seed); };
  for(const c of ['under_siege','famine','occupied']) add(h.find(x=>x.st.includes(c)));
  const by=[...h].sort((a,b)=>SZ.indexOf(a.tier)-SZ.indexOf(b.tier)||a.pop-b.pop); add(by[0]); add(by[by.length-1]);
  for(let i=0;i<h.length&&pick.length<5;i+=Math.max(1,Math.floor(h.length/7))) add(h[i]);
  out[id]={n:h.length,pick}; }
for(const [id,rows] of Object.entries(D)){ const pick=[]; const sz={}; for(const r of rows){ const t=meta(r.seed); if((sz[t]||0)<2 && pick.length<10){ pick.push(r.seed); sz[t]=(sz[t]||0)+1; } } for(const r of rows){ if(pick.length>=10) break; if(!pick.includes(r.seed)) pick.push(r.seed);} out[id]={n:rows.length,pick}; }
fs.writeFileSync(outf, JSON.stringify(out,null,1)); const all=new Set(Object.values(out).flatMap(x=>x.pick)); fs.writeFileSync(outf.replace('.json','.seeds.txt'), [...all].join('\n')+'\n'); console.log('towns to render', all.size);
