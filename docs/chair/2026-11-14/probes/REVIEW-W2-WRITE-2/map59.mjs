// map59.mjs <prev59.json> <prev where-all.json> <tipTree> <out.json>: each of the last read's 59 false lines, its text there,
// and what the tip holds at the same block/pool/vid (same text / reworded / marks moved / gone).
import fs from 'node:fs';
const [F,W,T,O]=process.argv.slice(2); const f=JSON.parse(fs.readFileSync(F)); const w=JSON.parse(fs.readFileSync(W));
const tip=[]; const dir=`${T}/src/data/dossierStateProse`;
for(const g of fs.readdirSync(dir).filter(x=>x.endsWith('.generated.js'))){ const m=await import(`${dir}/${g}`);
  for(const obj of Object.values(m)) if(obj&&typeof obj==='object') for(const [block,b] of Object.entries(obj)) if(b&&b.pools) for(const [pool,vs] of Object.entries(b.pools)) for(const v of vs) tip.push({block,pool,vid:v.vid,marks:v.marks||[],text:v.text}); }
const out=f.map(x=>{ const [block,pool,v]=x.id.split('::'); const vid=+v.replace(/^v/,''); const old=w.find(y=>y.block===block&&y.pool===pool&&y.vid===vid);
  const now=tip.find(y=>y.block===block&&y.pool===pool&&y.vid===vid);
  let state='GONE'; if(now){ if(old&&now.text===old.text) state=JSON.stringify(now.marks)===JSON.stringify(old.marks)?'SAME':'MARKS'; else state='REWORDED'; }
  return {id:x.id,state,oldText:old?.text,oldMarks:old?.marks,nowText:now?.text,nowMarks:now?.marks,falseReads:x.reads.filter(r=>r.true===false&&(r.severity==='HIGH'||r.severity==='MED')).map(r=>({town:r.town,sev:r.severity,why:r.why}))}; });
fs.writeFileSync(O,JSON.stringify(out,null,1)); const c={}; for(const o of out) c[o.state]=(c[o.state]||0)+1; console.log(c);
