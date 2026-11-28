// P1-c: DS-ECO-11's exploitation line (economyDeskRead → economyStateProse) beside the card it speaks of; tree A vs B.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B,n20]=process.argv.slice(2);
const ea=await import(A+'/src/domain/display/stateProse/economyStateProse.js'); const eb=await import(B+'/src/domain/display/stateProse/economyStateProse.js');
const v=await import(B+'/src/domain/display/validationOnPage.js');
const vb=await import(B+'/src/domain/display/validationOnPage.js');
let disA=0, disB=0, spokeA=0, spokeB=0, changed=0; const read=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const la=ea.leadingExploitation(s.resourceAnalysis); const lb=eb.leadingExploitation(vb.exploitationForDesk(s));
  const shownOf=(row)=>{ const g=v.exploitationGroupsShown(s); for (const k of ['unexploited','partial','full']) { const x=g[k].find(x=>x.card===row||x.card.rawResource===row.rawResource); if(x) return {k,moved:x.moved}; } return null; };
  const B2={unexploited:'unexploited',partiallyExploited:'partial',fullyExploited:'full'};
  if(la){ spokeA++; const sh=shownOf(la.row); if(sh && sh.k!==B2[la.bucket]) disA++; }
  if(lb){ spokeB++; const sh=shownOf(lb.row); if(!sh || sh.k!==B2[lb.bucket]) disB++; }
  if((la&&la.row.rawResource+la.bucket)!==(lb&&lb.row.rawResource+lb.bucket)) changed++;
  if(n20) read.push(`${seed}: ${lb?`${lb.bucket} ${lb.row.rawResource} (card: ${shownOf(lb.row)?.k})`:'silent'} | before: ${la?`${la.bucket} ${la.row.rawResource}`:'silent'}`);
}
console.log(`desk speaks: before ${spokeA}, after ${spokeB}; of a card the page prints at another grade: before ${disA}, after ${disB}; towns whose lens row changes ${changed}`);
if(n20) console.log(read.join('\n'));
