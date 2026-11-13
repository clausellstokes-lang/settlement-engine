// REVIEW-W2-FIX-DATA: where each new or reworded line prints in a corpus (towns), with the first town's key facts.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [C,W]=process.argv.slice(2); const words=fs.readFileSync(W,'utf8').trim().split('\n').filter(w=>w.length>25);
const L=zlib.gunzipSync(fs.readFileSync(C)).toString().trim().split('\n').map(l=>JSON.parse(l));
const norm=s=>s.replace(/\s+/g,' ').toLowerCase();
const res=[];
for(const w of words){ const k=norm(w).slice(0,60); const hits=[];
  for(const {seed,s} of L){ const txt=norm(JSON.stringify(s)); if(txt.includes(k)) hits.push({seed,s}); }
  const ex=hits.slice(0,3).map(({seed,s})=>{ const ins=s.institutions.map(i=>i.name); return `${seed} pop=${s.population} terr=${s.config.terrainType} trade=${s.config.tradeRouteAccess} stress=${s.stress?.type||'-'} cult=${s.config.culture}`; });
  res.push({w,n:hits.length,ex,seeds:hits.map(h=>h.seed)});
}
fs.writeFileSync(W.replace('.txt','.where.json'),JSON.stringify(res,null,1));
for(const r of res) console.log(String(r.n).padStart(4),'|',r.w.slice(0,95),'|',r.ex[0]||'');
