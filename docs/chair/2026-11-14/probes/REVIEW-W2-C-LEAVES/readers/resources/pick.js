const fs=require("fs");const {L,leaves}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const ORD=["thorp","hamlet","village","town","city","metropolis"];
function pick(seeds){seeds=[...new Set(seeds)];const s=seeds.slice().sort((a,b)=>ORD.indexOf(leaves[a].tier)-ORD.indexOf(leaves[b].tier)||leaves[a].pop-leaves[b].pop);
 const cr=s.find(x=>leaves[x].crisis.some(c=>/siege|famine|occup/.test(c)));return [...new Set([s[0],s[s.length-1],cr].filter(Boolean))]}
const P={};
for(const k in fam)P["prose "+k]=pick(fam[k].map(r=>r.seed));
const cardFams={};for(const r of L.filter(r=>r.line.length<=80)){(cardFams[r.fam]=cardFams[r.fam]||[]).push(r.seed)}
for(const k in cardFams)P[k]=pick(cardFams[k]);
fs.writeFileSync("picks.json",JSON.stringify(P,null,1));
for(const k in P)console.log(k,"=>",P[k].join(" "));
