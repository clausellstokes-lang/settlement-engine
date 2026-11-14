// node cnt.js <regex> [field-filter regex on "type|field"] : towns/lines matching at Q and tip
const fs=require("fs"); const r=f=>fs.readFileSync(f,"utf8").trim().split("\n").map(JSON.parse);
const [re, ff='.', show='3']=process.argv.slice(2); const RX=new RegExp(re), FF=new RegExp(ff);
for (const f of ["all-q.ct.jsonl","all-tip.ct.jsonl"]) { let t=0,n=0; const ex=[]; for (const x of r(f)) { const h=x.L.filter(l=>{const [a,b]=l.split("|"); return FF.test(a+"|"+b)&&RX.test(l);}); if(h.length){t++; n+=h.length; if(ex.length<+show) ex.push(x.seed+" :: "+h[0].slice(0,220));} } console.log(f, "towns",t,"lines",n); ex.forEach(e=>console.log("   ",e)); }
