const L=require("../removals-3.json");const {facts,diff}=require("./lib.js");
const i=+process.argv[2];const re=new RegExp(process.argv[3]||'.','i');const extra=(process.argv[4]||'').split(',').filter(Boolean);
console.log('###',L[i].id);
for(const e of L[i].read){const f=facts(e.town);const d=diff(e.baseParagraph,e.tipParagraph);
console.log(e.town,f.tier,f.pop,f.stress,f.trade,f.prosp,"| inst:",f.inst.split("; ").filter(x=>re.test(x)).join("/"));
for(const k of extra)console.log('   '+k+':',f[k]);
console.log("   RM:",e.removedSentence);console.log("   GONE:",JSON.stringify(d.gone));console.log("   ADD:",JSON.stringify(d.added));}
