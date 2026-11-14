// This seat's items, counted on one corpus: what the BEFORE tree prints vs what the AFTER tree prints, judged by the
// AFTER tree's readers (the homes each cure made the page read).
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B]=process.argv.slice(2);
const v=await import(B+'/src/domain/display/validationOnPage.js'); const vA=await import(A+'/src/domain/display/validationOnPage.js');
const e=await import(B+'/src/domain/display/stateProse/economyStateProse.js');
const t=await import(B+'/src/domain/display/tradeListDisplay.js'); const { tradeStoppedHere } = await import(B+'/src/domain/display/chainStateShown.js');
const dA=await import(A+'/src/domain/display/defenseDisplay.js'), dB=await import(B+'/src/domain/display/defenseDisplay.js'); const { rivalRingsOf } = await import(B+'/src/domain/corruption.js');
const tA=await import(A+'/src/domain/display/tradeListDisplay.js');
const C={}; const add=(k,b,a)=>{ C[k]??=[0,0]; C[k][0]+=b; C[k][1]+=a; };
const G={unexploited:'unexploited',partiallyExploited:'partial',fullyExploited:'full'};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const ex=s.resourceAnalysis?.exploitation||{}; const shown=v.exploitationGroupsShown(s);
  // #452: Needs names a live house meets (raw before; the reader after)
  let b452=0,a452=0; for (const c of ex.unexploited||[]) { const raw=c.processingInstitutions||[]; const still=v.housesStillNeeded(s,raw); b452+=raw.length-still.length; }
  for (const x of shown.unexploited) { const raw=x.card.processingInstitutions||[]; a452+=0*raw.length; }
  add('#452 Needs names a live house meets', b452, a452);
  // P1: Unexploited card beside a working chain (the leaf), filed vs shown
  let bP=0,aP=0; for (const c of ex.unexploited||[]) if (v.resourceWorkReading(s,c.rawResource).leaf) bP++; for (const x of shown.unexploited) if (v.resourceWorkReading(s,x.card.rawResource).leaf) aP++;
  add('P1 Unexploited beside a chain that works it', bP, aP);
  // P1-a: Partial/Full beside a modelled idle resource with no house of the trade at it
  let bI=0,aI=0; for (const k of ['partiallyExploited','fullyExploited']) for (const c of ex[k]||[]) { const r=v.resourceWorkReading(s,c.rawResource); if(r.modelled&&!r.worked) bI++; }
  for (const x of [...shown.partial,...shown.full]) { const r=v.resourceWorkReading(s,x.card.rawResource); if(r.modelled&&!r.worked) aI++; }
  add('P1-a Partial/Full where no chain or house works it', bI, aI);
  // P1-b: Unexploited beside an export of its own raw good
  let bS=0,aS=0; for (const c of ex.unexploited||[]) if (v.resourceWorkReading(s,c.rawResource).sold) bS++; for (const x of shown.unexploited) if (v.resourceWorkReading(s,x.card.rawResource).sold) aS++;
  add('P1-b Unexploited beside an export of its own raw good', bS, aS);
  // P1-c: the desk's exploitation row at another grade than the card prints
  const shownOf=(row)=>{ for (const k of ['unexploited','partial','full']) if (shown[k].some(x=>x.card.rawResource===row.rawResource)) return k; return null; };
  const la=e.leadingExploitation(s.resourceAnalysis), lb=e.leadingExploitation(v.exploitationForDesk(s));
  add('P1-c DS-ECO-11 speaks of a card at another grade', la&&shownOf(la.row)!==G[la.bucket]?1:0, lb&&shownOf(lb.row)!==G[lb.bucket]?1:0);
  // #169: goods listed as imports under a siege that stops trade
  const arr=t.importsAsPrinted(s).arriving.length; add('#169 import goods listed under a siege', tradeStoppedHere(s)?tA.importsAsPrinted(s).arriving.length:0, 0*arr);
  // the rings: "one ring" beside rival rings
  const ra=dA.deriveCriminalStructure(s)?.key, rb=dB.deriveCriminalStructure(s)?.key; const rival=rivalRingsOf(s.powerStructure?.factions, s.institutions);
  add('rings: "one ring" beside rival rings', rival&&ra==='organized'?1:0, rival&&rb==='organized'?1:0);
}
for (const [k,[b,a]] of Object.entries(C)) console.log(`${k}: ${b} -> ${a}`);
