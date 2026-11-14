const {L,page,rec}=require("./lib.js");let T=0,F=[],LOW=[];
for(const p of L[32].prints){const r=rec(p.town);const pg=page(p.town);const rel=(pg.match(/Reliance on magic: ([^\n]*supplied by[^\n]*)/)||[])[1]||"";const er=(pg.match(/Economic role: ([a-z]+)/)||[])[1];
 const pros=r.economicState.prosperity;const sup=(rel.split("supplied by ")[1]||"");
 const arcaneSup=/mage|wizard|academy|scroll|enchant|alchem|arcane|teleport|sorcer|golem|hedge/i.test(sup);
 const econ=pg.split("\n").find(l=>/keeps it that way|is well off|well off/.test(l)&&l.length<160)||"";
 const reasons=[];
 if(/Poor|Struggling/.test(pros)) reasons.push("prosperity "+pros);
 if(er==="absent") reasons.push("Economic role absent");
 if(!arcaneSup) reasons.push("supplied by "+sup.slice(0,60));
 if(/road keeps|river keeps|harbour keeps/.test(econ)) reasons.push("econ: "+econ.slice(0,80));
 if(reasons.length) F.push(p.town); else T++;
 console.log(reasons.length?"FALSE":"ok   ",p.town,r.tier,(r.config.stressTypes||[]).join("+"),"|",pros,"|er",er,"|sup:",sup.slice(0,70),"|",reasons.join("; "));}
console.log("T",T,"F",F.length,JSON.stringify(F));
