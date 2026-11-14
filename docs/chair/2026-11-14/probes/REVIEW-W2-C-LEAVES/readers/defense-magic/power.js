const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");
const res={};
for(const s of Object.keys(o)){const page=fs.readFileSync(B+"tip/dumps/"+s+".txt","utf8").split("\n");
 const a=page.indexOf("== Systems/Power ==");const b=page.indexOf("== Systems/Defense ==");const P=page.slice(a,b);
 const names=[];for(let i=1;i<P.length;i++){if(/^(↑ Holds power|Contests the seat)?Criminal\d+[▼▲]$/.test(P[i])){names.push(P[i-1])}}
 const ctrl=P.filter(l=>/(controls vice|controls the black market|decisions that matter are made by (Thieves' Guild|the Thieves)|Criminal(?:Dominant|Significant))/i.test(l)).map(l=>l.slice(0,160));
 const ruler=P.filter(l=>/^Ruler.*Criminal/.test(l));
 const thievesRel=P.filter(l=>/^Thieves' Guild.*(rival|feud)|rival/i.test(l)).slice(0,3).map(l=>l.slice(0,160));
 res[s]={names:[...new Set(names)],ruler,ctrl,thievesRel};}
fs.writeFileSync("power-crime.json",JSON.stringify(res,null,1));
const t={};for(const r of Object.values(res)){const k=r.names.join("+");t[k]=(t[k]||0)+1}console.log(t);
const r2={};for(const r of Object.values(res))for(const c of r.ctrl){const k=c.slice(0,70);r2[k]=(r2[k]||0)+1}console.log(r2);
