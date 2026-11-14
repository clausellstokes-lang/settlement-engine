const {L,rec,page}=require("./lib.js");
const i=+process.argv[2];let T=0,F=[];
for(const p of L[i].prints){const r=rec(p.town);const fs=r.economicState.foodSecurity;const pg=page(p.town).split("\n");
 const o=pg.findIndex(l=>/^. (Not v|V)iable$/.test(l));const outlook=o>=0?pg[o+1]:"";
 const short=/does not grow enough|grows less than it eats|food comes in|cannot feed itself|brought in/i.test(outlook)||fs.foodRatio<0.95||/Famine|Deficit/.test(fs.label);
 if(short)F.push(p.town);else T++;
 console.log(short?"FALSE":"ok   ",p.town,(r.config.stressTypes||[]).join("+"),fs.label,fs.foodRatio,"| outlook:",outlook.slice(0,140));}
console.log("T",T,"F",F.length,JSON.stringify(F));
