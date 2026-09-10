import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('report.json','utf8'));
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const byReg={}; for (const r of corpus) (byReg[r.register] ||= []).push(r);
const esc=(s)=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
// slot-tolerant literal regex: {} -> {any_slot}, single space between tokens
const litRe=(g)=>new RegExp(g.split(' ').map(t=>t==='{}'?'\\{[a-z_0-9]+\\}':esc(t)).join('\\s+'),'i');
const gramsOf=(t)=>{const w=t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi,'{}').replace(/[^a-z0-9{}'\s]/g,' ').split(/\s+/).filter(Boolean);const s=new Set();for(let k=2;k<=4;k++)for(let i=0;i+k<=w.length;i++)s.add(w.slice(i,i+k).join(' '));return s;};
let nRows=0, nArt=0, nDup=0, nBadEx=0;
const art=[], dup=[], badEx=[];
for (const [reg, tics] of Object.entries(R.tics)) {
  if (reg==='BIBLE') continue;
  const rows = byReg[reg]||[];
  const setOf={}; for (const t of tics) setOf[t.gram]=new Set(rows.filter(r=>gramsOf(r.text).has(t.gram)).map(r=>r.text));
  for (let i=0;i<tics.length;i++) {
    const t=tics[i]; nRows++;
    const re=litRe(t.gram);
    const literal = rows.filter(r=>re.test(r.text)).length;
    if (literal===0) { nArt++; art.push(`${reg}  "${t.gram}" n=${t.count} literal=0`); }
    if (!re.test(t.example||'')) { nBadEx++; badEx.push(`${reg}  "${t.gram}" example lacks gram: ${(t.example||'').slice(0,80)}`); }
    // row-set containment against another row in the same ten
    for (let j=0;j<tics.length;j++) {
      if (i===j) continue;
      const A=setOf[t.gram], B=setOf[tics[j].gram];
      if (A.size && B.size && A.size<=B.size && [...A].every(x=>B.has(x))) { nDup++; dup.push(`${reg}  "${t.gram}" (n=${t.count}) rows are a SUBSET of "${tics[j].gram}" (n=${tics[j].count})`); break; }
    }
  }
}
console.log('tic rows audited:', nRows);
console.log('A. grams with ZERO slot-tolerant literal occurrence (punctuation artifacts):', nArt);
art.forEach(l=>console.log('   '+l));
console.log('B. tic rows whose row-set is a strict/equal SUBSET of another row in the same top-ten (one habit, two slots):', nDup);
dup.forEach(l=>console.log('   '+l));
console.log('C. printed examples not containing their own gram:', nBadEx);
badEx.forEach(l=>console.log('   '+l));
