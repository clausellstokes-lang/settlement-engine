const {rec,L,crises}=require("./lib");const st=require("./stall");
module.exports=i=>st(i).map(r=>{const t=rec(r.town);const names=t.institutions.map(x=>x.name);const ra=t.resourceAnalysis;
 const houseCrit=(ra.imports.critical||[]).filter(g=>{const m=/^Required by (.+?) but/.exec(ra.imports.reasons[g]||"");return m&&names.some(n=>n===m[1]||n.startsWith(m[1].split(" (")[0]));});
 const gapImp=(ra.gaps||[]).filter(g=>g.kind==="imported"||g.kind==="missing").map(g=>g.chain+":"+g.kind);
 r.houseCrit=houseCrit;r.gapImp=gapImp;r.ok=!!(houseCrit.length||gapImp.length||r.absent.length);return r;});
if(require.main===module){for(const i of process.argv.slice(2).map(Number)){const rows=module.exports(i);const f=rows.filter(r=>!r.ok);
console.log(L[i].id,"n",rows.length,"true",rows.length-f.length,"false",f.length);f.forEach(r=>console.log("  F",r.town,r.tier,r.cr.join("+"),r.route,"imp="+r.imp.length,JSON.stringify(r.toks.map(x=>x.chain+"<-"+x.u))));
rows.filter(r=>!r.imp.length).forEach(r=>console.log("  noimp",r.town,r.route,"ok="+r.ok,JSON.stringify(r.houseCrit),JSON.stringify(r.gapImp)));}}
