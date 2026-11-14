const fs=require("fs");
const {L,leaves,rec,tab,splitS,norm}=require("./lib.js");
const P=L.filter(r=>r.line.length>80&&r.sec==="Resource Exploitation");
const rows=[];
for(const r of P){const lv=leaves[r.seed];const R=rec(r.seed);
 const conds=R.resourceAnalysis.resourceConditions||[];
 const ss=splitS(r.line);
 for(const s of ss){rows.push({seed:r.seed,tier:lv.tier,crisis:lv.crisis,s,t:norm(s,r.seed),para:r.line})}}
fs.writeFileSync("prose-rows.json",JSON.stringify(rows));
console.log(rows.length);
