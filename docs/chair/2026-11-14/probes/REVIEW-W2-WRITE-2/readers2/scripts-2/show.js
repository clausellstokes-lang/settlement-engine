const rec=require('./rec.js');
const L=require(process.env.LIST||'/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const i=+process.argv[2];const mode=process.argv[3]||'';
const split=s=>s?s.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g).map(x=>x.trim()):[];
const r=L[i];console.log('##',r.id,'|',r.text);
for(const t of r.read){
 const R=rec(t.town);const e=R.economicState||{};
 const st=(Array.isArray(R.stress)?R.stress:[R.stress]).filter(Boolean).map(s=>s.type);
 const b=split(t.baseParagraph),p=split(t.tipParagraph);
 const added=p.filter(x=>!b.includes(x));
 console.log('--',t.town,R.name,R.tier,R.population,'pros='+e.prosperity,'stress='+st.join(','),'acc='+e.tradeAccess,'mount='+t.mount);
 console.log('   RM:',t.removedSentence);
 if(mode.includes('b'))console.log('   BASE:',t.baseParagraph);
 console.log('   NEW:',t.tipParagraph===null?'<null>':(added.length?added.join(' | '):'<none added>'));
 if(mode.includes('p'))console.log('   TIP:',t.tipParagraph);
}
