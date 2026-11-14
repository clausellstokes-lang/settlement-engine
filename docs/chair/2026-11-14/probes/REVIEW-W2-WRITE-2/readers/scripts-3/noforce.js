const {L,page,rec}=require("./lib.js");const f=require("./facts.js");
const out={};
for(const i of [24,25,26,27,28]){const res={T:0,MED:[],LOW:[]};for(const p of L[i].prints){const x=f(p.town);const pg=page(p.town);
 const forces=x.garrison.concat(x.militia,x.watch,x.merc).length>0;
 const keepSafe=/Those who keep [^\n]{1,30} safe/.test(pg); const attacked=x.st.includes("monster_pressure")&&/no rest between attacks|Whatever is attacking|the attackers|lost to fire|beasts take|creatures take/.test(pg);
 let sev=null;
 if(forces) sev="MED";
 if(i===24&&keepSafe) sev=sev||"LOW";
 if(i===25){ if(attacked||x.st.includes("monster_pressure")) sev="MED"; else if(keepSafe) sev=sev||"LOW";}
 if(i===26&&keepSafe) sev="MED";
 if(i===26&&!sev&&/its defenders will not act as one/.test(pg)) sev="LOW";
 if(sev) res[sev].push(p.town); else res.T++;}
 out[L[i].id]=res; console.log(L[i].id,"T",res.T,"MED",res.MED.length,JSON.stringify(res.MED),"LOW",JSON.stringify(res.LOW));}
