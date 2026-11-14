const {leaves,lines}=require("./lib");
const ORDER=["thorp","hamlet","village","town","city","metropolis"];
const byF={};for(const l of lines)(byF[l.fam]=byF[l.fam]||[]).push(l);
const picks={};
for(const f in byF){const a=byF[f].slice().sort((x,y)=>ORDER.indexOf(leaves.get(x.seed).tier)-ORDER.indexOf(leaves.get(y.seed).tier)||leaves.get(x.seed).pop-leaves.get(y.seed).pop);
 const s=new Set([a[0].seed,a[a.length-1].seed]);const c=a.find(x=>leaves.get(x.seed).crisis.some(k=>/siege|famine|occupied/.test(k)));if(c)s.add(c.seed);for(const x of a){if(s.size>=3)break;s.add(x.seed)}
 picks[f]=[...s];}
require("fs").writeFileSync("picks.json",JSON.stringify(picks,null,1));
module.exports={byF,picks};
