import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('report.json','utf8'));
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const byReg={}; for (const r of corpus) (byReg[r.register] ||= []).push(r);
const esc=(s)=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
let totalRows=0, totalArtifact=0, totalDup=0, totalBadEx=0;
const lines=[];
for (const [reg, tics] of Object.entries(R.tics)) {
  if (reg==='BIBLE') continue;
  const rows = byReg[reg]||[];
  const flags=[];
  for (let i=0;i<tics.length;i++) {
    const t=tics[i]; totalRows++;
    const re=new RegExp(esc(t.gram),'i');
    const literal = rows.filter(r=>re.test(r.text)).length;
    const artifact = literal===0;
    if (artifact) totalArtifact++;
    // duplicate family: token-level containment with another gram in the SAME ten
    const dup = tics.some((o,j)=>{
      if (j===i) return false;
      const a=rows.filter(r=>new RegExp(esc(t.gram),'i').test(r.text)||true);
      // measure row-set subset via gram membership
      return false;
    });
    const exOk = t.example && new RegExp(esc(t.gram),'i').test(t.example);
    if (!exOk) totalBadEx++;
    if (artifact || !exOk) flags.push({gram:t.gram, count:t.count, literal, exOk});
  }
  if (flags.length) lines.push(reg+': '+flags.map(f=>`"${f.gram}" n=${f.count} literal=${f.literal}${f.exOk?'':' EXAMPLE-MISSING-GRAM'}`).join(' | '));
}
console.log('tic rows audited:', totalRows);
console.log('grams with ZERO literal occurrence in their own register (punctuation artifacts):', totalArtifact);
console.log('printed examples that do NOT contain the printed gram:', totalBadEx);
console.log();
lines.forEach(l=>console.log(l));
