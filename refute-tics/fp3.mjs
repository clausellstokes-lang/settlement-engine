import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('report.json','utf8'));
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const byReg={}; for (const r of corpus) (byReg[r.register] ||= []).push(r);
const esc=(s)=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
const tokRe=(t)=>t.split('{}').map(esc).join('\\{[a-z_0-9]+\\}');
const litRe=(g)=>new RegExp(g.split(' ').map(tokRe).join('\\s+'),'i');
let nArt=0,nBadEx=0; const art=[],badEx=[];
for (const [reg,tics] of Object.entries(R.tics)) {
  if (reg==='BIBLE') continue;
  const rows=byReg[reg]||[];
  for (const t of tics) {
    const re=litRe(t.gram);
    const lit=rows.filter(r=>re.test(r.text)).length;
    if (lit===0) { nArt++; art.push(`${reg}  "${t.gram}" n=${t.count} literal=0`); }
    if (!re.test(t.example||'')) { nBadEx++; badEx.push(`${reg}  "${t.gram}"  ex: ${(t.example||'').slice(0,90)}`); }
  }
}
console.log('A. grams that NEVER appear literally (whitespace-only between tokens) in their register:', nArt);
art.forEach(l=>console.log('   '+l));
console.log('C. printed examples not containing their gram literally:', nBadEx);
badEx.forEach(l=>console.log('   '+l));
