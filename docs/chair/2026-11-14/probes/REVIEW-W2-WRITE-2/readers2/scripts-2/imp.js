const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const split=s=>s?s.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g).map(x=>x.trim()):[];
for(const i of process.argv.slice(2).map(Number))for(const t of L[i].read){const r=rec(t.town);const ra=r.resourceAnalysis||{};
const b=split(t.baseParagraph),p=split(t.tipParagraph);const added=p.filter(x=>!b.includes(x));
if(!added.length)continue;
console.log('--',i,t.town,r.tier,'terrain='+ra.terrain,'stress='+[].concat(r.stress||[]).map(s=>s&&s.type));
console.log('   NEW:',added.join(' | '));
console.log('   crit='+JSON.stringify((ra.imports||{}).critical),'avail='+(ra.availableResources||[]).join(','));
console.log('   reasons='+JSON.stringify((ra.imports||{}).reasons).slice(0,400));
console.log('   pImp='+(r.economicState.primaryImports||[]).join(';'));
}
