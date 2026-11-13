// REVIEW-W2-FIX-DATA: does each cold-list sentence still print, at base and at tip? (normalised substring over the 20 tabs + Tonight)
//   node fxpresence.mjs <cold.json> <fx-base> <fx-tip> > presence.json
import fs from 'node:fs';
const [cold,B,T]=process.argv.slice(2); const j=JSON.parse(fs.readFileSync(cold,'utf8'));
const norm=s=>s.toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
const cache={}; const page=(d,id)=>{const k=d+id; if(!cache[k]){ const t=fs.readFileSync(`${d}/${id}.txt`,'utf8'); const i=t.indexOf('\n== pdf =='); cache[k]=norm(t.slice(0,i)); cache[k+'all']=norm(t);} return cache[k];};
const all=(d,id)=>{page(d,id); return cache[d+id+'all'];};
const LANE=/src\/data\/(arrivalProse|historyData|historyDescVariants|institutionDescColour|institutionDescVariants|institutionServices|institutionalCatalog)\.js/;
const out=j.lines.map(r=>{ const s=norm(r.sentence); return { n:r.n, town:r.town.id, lane: LANE.test(r.source?.file||''), file:r.source?.file||null, sev:r.severity, base: page(B,r.town.id).includes(s), tip: page(T,r.town.id).includes(s), tipAll: all(T,r.town.id).includes(s) };});
console.log(JSON.stringify(out));
const c=(f)=>out.filter(f).length;
console.error('rows',out.length,'lane',c(r=>r.lane),'| base printing',c(r=>r.base),'tip printing',c(r=>r.tip),'| lane base',c(r=>r.lane&&r.base),'lane tip',c(r=>r.lane&&r.tip),'lane tip any surface',c(r=>r.lane&&r.tipAll));
