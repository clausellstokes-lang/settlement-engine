// classify.mjs <facts.jsonl> <deskdiff.jsonl> <desk.tip.jsonl>: each moved desk line with the fact that moved it.
import fs from 'node:fs';
const rd=(f)=>fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse);
const F=new Map(rd(process.argv[2]).map(o=>[o.seed,o])); const rows=rd(process.argv[3]); const T=new Map(rd(process.argv[4]).map(o=>[o.seed,o]));
const watchOnly=f=>f.watch&&!f.garrison&&!f.militia&&!f.merc;
const why=(r,f)=>{ const w=[]; if(f.stress.includes('occupied')) w.push('occupied'); if(/exists on paper/.test(f.guard||'')) w.push('guardOnPaper');
  if((f.garrison||f.militia||f.merc)&&f.chainMil<0) w.push('supplyShort'); if(!f.walls) w.push('noWalls'); if(!f.watch&&!f.garrison) w.push('noWatchOrGarrison');
  if(watchOnly(f)) w.push(f.walls?'watchOnlyWalled':'watchOnlyUnwalled'); if(f.stress.includes('under_siege')) w.push('siege'); if(f.stress.includes('famine')) w.push('famine');
  if(/WEAK|CRITICAL/.test(f.mil)) w.push('barWeak'); return w; };
const groups={};
for(const r of rows){ const f=F.get(r.seed); const w=why(r,f); const key=r.k+' '+r.kind; (groups[key]??=[]).push({...r,why:w,f}); }
const mode=process.argv[5]||'summary';
for(const [k,g] of Object.entries(groups)){ const c={}; for(const x of g){ const t=x.why.filter(y=>!['noWalls','noWatchOrGarrison','siege','famine','barWeak'].includes(y)||k.startsWith('threat.invasion')).join('+')||'(none)'; c[t]=(c[t]||0)+1; }
  console.log(k, g.length, JSON.stringify(c)); }
if(mode!=='summary'){ const g=groups[mode]; for(const x of g) console.log(JSON.stringify({seed:x.seed,name:x.f.name,tier:x.f.tier,why:x.why,forces:x.f.forceNames,mil:x.f.mil,rd:x.f.readiness,stress:x.f.stress,base:x.line,tip:x.tip,tipOther:Object.fromEntries(Object.entries(T.get(x.seed).lines).filter(([kk])=>kk.split('.')[0]===x.k.split('.')[0]).map(([kk,v])=>[kk,v.sentence]))})); }
