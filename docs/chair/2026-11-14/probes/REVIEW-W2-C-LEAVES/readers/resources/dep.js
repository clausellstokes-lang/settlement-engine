const fs=require("fs");const {leaves,rec}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const res={};
function cond(seed,label){const R=rec(seed);return (R.resourceAnalysis.resourceConditions||[]).find(c=>c.label.toLowerCase()===label.toLowerCase())}
for(const k of ["dep:nothingMore","dep:workedOutExh","dep:workedOut","dep:bothers"]){
 const out=res[k]={n:0,f:[]};
 for(const r of fam[k]){out.n++;const c=cond(r.seed,r.m[0]);
  const want=(k==="dep:nothingMore"||k==="dep:workedOutExh")?"exhaustible":"renewable";
  if(!c)out.f.push([r.seed,r.s,"no such resource"]);
  else if(c.condition!=="depleted")out.f.push([r.seed,r.s,"condition "+c.condition]);
  else if(c.type!==want)out.f.push([r.seed,r.s,"type "+c.type+" "+c.recoveryMode]);
 }}
// leftAlone/untilPays: pair with the preceding sentence's type
for(const k of ["dep:leftAlone","dep:untilPays"]){const out=res[k]={n:0,f:[]};
 for(const r of fam[k]){out.n++;const R=rec(r.seed);}}
for(const k in res)console.log(k,res[k].n,res[k].f.length,JSON.stringify(res[k].f.slice(0,8)));
