const L=require("../removals-3.json");const {facts,diff,sents}=require("./lib.js");
const i=+process.argv[2];const re=new RegExp(process.argv[3],'i');const are=new RegExp(process.argv[4]||'.','i');
console.log('###',L[i].id);
for(const e of L[i].read){const f=facts(e.town);const d=diff(e.baseParagraph,e.tipParagraph);
console.log(e.town,f.tier,f.pop,f.stress,f.trade,"| inst:",f.inst.split("; ").filter(x=>re.test(x)).join("/"),"| RM:",(e.removedSentence||'NULL').slice(0,60),"| ADD:",JSON.stringify(d.added.filter(s=>are.test(s))));}
