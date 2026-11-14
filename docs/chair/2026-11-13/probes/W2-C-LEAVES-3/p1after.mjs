// P1 after: classes as printed (tab reader) + PDF rows; disagreement with the sentence; ruling 7.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T, outf] = process.argv.slice(2);
const v = await import(T+'/src/domain/display/validationOnPage.js');
const vm = await import(T+'/src/pdf/lib/viewModelBodySlices.js');
const { RESOURCE_DATA } = await import(T+'/src/data/goods/identity.js');
let moved=0, movedT=new Set(), emptyBody=0, pdfMismatch=0, disagree=0, unexWorked=0; const samp=[]; const r7=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const g=v.exploitationGroupsShown(s); const rows=vm.resourcesSlice(s).chainRows;
  for (const st of ['unexploited','partial','full']) { const pdf=rows.filter(r=>r.status===st).length; if(pdf!==g[st].length) pdfMismatch++; }
  for (const x of g.partial) if (x.filed==='unexploited') { moved++; movedT.add(seed); samp.push({seed,res:x.card.rawResource}); }
  for (const x of g.unexploited) if (v.resourceWorkReading(s,x.card.rawResource).worked) unexWorked++;
  const sent=v.resourceGapLines(s).map(q=>q.impact).filter(t=>/^No one here works/.test(t));
  for (const x of [...g.partial,...g.full]) { const n=String(x.card.rawResource).replace(/_/g,' ').toLowerCase(); if (sent.some(t=>t.includes(`works the ${n} near`))) disagree++; }
  // ruling 7: an export of the raw good beside a not-worked line or an Unexploited card
  const ex=(s.economicState?.primaryExports||[]).join(' | ').toLowerCase();
  for (const x of g.unexploited) { const r=v.resourceWorkReading(s,x.card.rawResource); const words=[String(x.card.rawResource).replace(/_/g,' '), ...r.keys.flatMap(k=>RESOURCE_DATA[k]?.commodities||[])].map(w=>String(w).toLowerCase()).filter(w=>w.length>3);
    const hit=words.find(w=>ex.includes(w)); if(hit) r7.push({seed,card:x.card.rawResource,hit,exports:ex.slice(0,200)}); }
}
console.log(`moved Unexploited->Partial ${moved} in ${movedT.size} towns; empty body ${emptyBody}; Unexploited still beside a working chain ${unexWorked}; PDF group counts differing from the tab ${pdfMismatch}; card Partial/Full beside "No one here works" ${disagree}`);
console.log(`ruling 7: an export of the raw good beside an Unexploited card: ${r7.length} cards in ${new Set(r7.map(x=>x.seed)).size} towns`);
fs.writeFileSync(outf, JSON.stringify({samp,r7},null,1));
