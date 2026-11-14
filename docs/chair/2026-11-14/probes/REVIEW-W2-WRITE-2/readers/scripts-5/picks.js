const {L,rec,crises,page}=require("./lib");const order=["thorp","hamlet","village","town","city","metropolis"];
module.exports=i=>{const l=L[i];const s=[...l.prints].sort((a,b)=>order.indexOf(a.tier)-order.indexOf(b.tier)||a.pop-b.pop);const pick=[s[0],s[s.length-1]];
for(const c of ["under_siege","famine","occupied"]){const f=s.find(p=>crises(rec(p.town)).includes(c)&&!pick.includes(p));if(f){pick.push(f);break;}}
if(pick.length<3&&s.length>2)pick.push(s[Math.floor(s.length/2)]);return [...new Set(pick)];};
if(require.main===module){for(const i of process.argv.slice(2).map(Number)){console.log("=====",i,L[i].id);for(const p of module.exports(i)){const pr=(p.page[0]||{}).printed;const ls=page(p.town).split("\n");const k=ls.findIndex(x=>x.includes(pr));
console.log("--",p.town,p.tier,p.pop,crises(rec(p.town)).join("+"));console.log("   ",(ls[k]||"").slice(0,420));}}}
