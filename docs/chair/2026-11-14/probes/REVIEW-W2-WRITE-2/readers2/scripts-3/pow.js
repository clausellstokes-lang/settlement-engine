const L=require("../removals-3.json");const {facts,diff,rec}=require("./lib.js");
const i=+process.argv[2];const are=new RegExp(process.argv[3]||'.','i');
console.log('###',L[i].id);
for(const e of L[i].read){const f=facts(e.town);const d=diff(e.baseParagraph,e.tipParagraph);const p=rec(e.town).powerStructure;
console.log(e.town,f.tier,f.pop,f.stress,'| gov:',f.gov,'| legit:',f.legit,'| stab:',(p.stability||'').slice(0,70));
console.log('   fac:',f.factions);
console.log('   RM:',e.removedSentence,'| mount',e.mount);console.log('   ADD:',JSON.stringify(d.added.filter(s=>are.test(s))));}
