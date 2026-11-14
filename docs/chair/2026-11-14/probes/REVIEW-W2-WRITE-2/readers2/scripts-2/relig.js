const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const split=s=>s?s.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g).map(x=>x.trim()):[];
for(const t of L[+process.argv[2]].read){const r=rec(t.town);const e=r.economicState;
const ri=r.institutions.filter(i=>i.category==='Religious').map(i=>i.name);
const inc=(e.incomeSources||[]).map(s=>s.source+':'+s.percentage).join(', ');
const b=split(t.baseParagraph),p=split(t.tipParagraph);const added=p.filter(x=>!b.includes(x));
console.log('--',t.town,r.tier,r.population,'pros='+e.prosperity,'stress='+[].concat(r.stress||[]).map(s=>s&&s.type));
console.log('   relInst=['+ri.join('; ')+']');console.log('   inc='+inc);
console.log('   RM:',t.removedSentence);console.log('   NEW:',t.tipParagraph===null?'<null>':(added.length?added.join(' | '):'<none added>'));}
