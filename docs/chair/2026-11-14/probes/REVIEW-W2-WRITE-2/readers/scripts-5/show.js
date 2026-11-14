const {L}=require("./lib");
const order=["thorp","hamlet","village","town","city","metropolis"];
const idx=+process.argv[2];const l=L[idx];
console.log(l.id,"prints",l.prints.length);
const byTier={};for(const p of l.prints){(byTier[p.tier]=byTier[p.tier]||[]).push(p);}
for(const t of order)if(byTier[t])console.log(t,byTier[t].length);
const views={};for(const p of l.prints)for(const v of p.page||[]){views[v.view]=(views[v.view]||0)+1;}
console.log("views",JSON.stringify(views));
const surf={page:0,pdf:0,pp:0};for(const p of l.prints){if(p.page&&p.page.length)surf.page++;if(p.pdf&&p.pdf.length)surf.pdf++;if(p.pp&&p.pp.length)surf.pp++;}
console.log("surf",JSON.stringify(surf));
const crises={};for(const p of l.prints)for(const s of p.stress||[])crises[s]=(crises[s]||0)+1;console.log("crises",JSON.stringify(crises));
const n=+(process.argv[3]||6);
const pick=[];const sorted=[...l.prints].sort((a,b)=>order.indexOf(a.tier)-order.indexOf(b.tier)||a.pop-b.pop);
pick.push(sorted[0],sorted[sorted.length-1]);
for(const c of ["under_siege","famine","occupation"]){const f=l.prints.find(p=>(p.stress||[]).includes(c));if(f)pick.push(f);}
for(const p of [...new Set(pick)].slice(0,n)){console.log("--",p.town,p.tier,p.pop,JSON.stringify(p.stress));for(const v of p.page||[])console.log("   ",v.view,"|",v.printed);if(!(p.page||[]).length)console.log("   pdf/pp:",JSON.stringify(p.pdf||p.pp).slice(0,300));}
