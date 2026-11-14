const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-3.json');
const {facts,diff}=require('./lib.js');
const idx=+process.argv[2];const keys=(process.argv[3]||'tier,pop,stress,inst').split(',');
const r=L[idx];console.log('###',r.id,r.kind,r.removedFrom);
for(const e of r.read){const f=facts(e.town);const d=diff(e.baseParagraph,e.tipParagraph);
 console.log(`-- ${e.town} [${e.mount}]`);console.log('  RM:',e.removedSentence);
 console.log('  GONE:',JSON.stringify(d.gone));console.log('  ADD:',JSON.stringify(d.added));
 for(const k of keys)console.log('  '+k+':',f[k]);}
