// #452: the Unexploited card's "Needs:" line, before (raw list) and after (housesStillNeeded); and the gap lines, base tree vs lane tree.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, A, B, outf] = process.argv.slice(2);
const a = await import(A+'/src/domain/display/validationOnPage.js'); const b = await import(B+'/src/domain/display/validationOnPage.js');
const { liveInstitutions } = await import(B+'/src/domain/institutions/institutionRoster.js');
let towns=0, cards=0, cardsChanged=0, namesOut=0, linesGone=0; const tch=new Set(); const ex=[]; const gapDiff=[]; const byName={};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const un = s.resourceAnalysis?.exploitation?.unexploited || [];
  for (const c of un) { const raw=(c.processingInstitutions||[]); if(!raw.length) continue; cards++; const now=b.housesStillNeeded(s, raw);
    if (now.length!==raw.length) { cardsChanged++; tch.add(seed); if(!now.length) linesGone++; const out=raw.filter(n=>!now.includes(n)); namesOut+=out.length; for(const n of out) byName[n]=(byName[n]||0)+1;
      ex.push({seed, res:c.rawResource, raw, now, roster: liveInstitutions(s).map(i=>i.name).filter(n=>/tann|leather|cobbl|furr|saddl|carpent|joiner|cooper|wheel|saw|lumber|apothec|alchem|herbal|smith|smelt|forge|jewel|gold|mason|stone|weav|dye|full|glass|potter|brick|mill|vint|butch|dairy|fish|salt|charcoal/i.test(n))}); } }
  const ga=a.resourceGapLines(s).map(g=>g.impact), gb=b.resourceGapLines(s).map(g=>g.impact);
  const gone=ga.filter(x=>!gb.includes(x)), added=gb.filter(x=>!ga.includes(x)); if(gone.length||added.length) gapDiff.push({seed,gone,added});
}
console.log(`unexploited cards with a Needs line ${cards}; changed ${cardsChanged} in ${tch.size} towns; names out ${namesOut}; lines gone whole ${linesGone}`);
console.log('names out:', JSON.stringify(byName));
console.log('gap-line diffs:', gapDiff.length, 'towns; gone', gapDiff.reduce((n,d)=>n+d.gone.length,0), 'added', gapDiff.reduce((n,d)=>n+d.added.length,0));
fs.writeFileSync(outf, JSON.stringify({ex,gapDiff},null,1));
