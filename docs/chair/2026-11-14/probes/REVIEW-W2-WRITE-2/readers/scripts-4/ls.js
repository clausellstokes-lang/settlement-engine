// usage: node ls.js <lineIndex> [n]  -> summary of prints by tier/stress
const {lines,rec}=require("./lib");
const i=+process.argv[2];const l=lines[i];
const order=["thorp","hamlet","village","town","city","metropolis"];
const byT={};for(const p of l.prints){(byT[p.tier]=byT[p.tier]||[]).push(p)}
console.log(l.id,"prints",l.prints.length);
for(const t of order){if(!byT[t])continue;const ps=byT[t];console.log(t,ps.length,"stress:",JSON.stringify([...new Set(ps.flatMap(p=>p.stress))]));}
const crisisy=l.prints.filter(p=>p.stress.some(s=>/siege|famine|occup/.test(s)));
console.log("crisis towns:",crisisy.slice(0,8).map(p=>p.town+"["+p.stress+"]").join(" "));
const sm=l.prints.slice().sort((a,b)=>a.pop-b.pop);console.log("smallest:",sm.slice(0,3).map(p=>p.town+":"+p.pop).join(" "),"largest:",sm.slice(-3).map(p=>p.town+":"+p.pop).join(" "));
const views={};for(const p of l.prints)for(const v of (p.page||[]))views[v.view]=(views[v.view]||0)+1;console.log("views",JSON.stringify(views));
const pr=l.prints.map(p=>(p.page||[])[0]?.printed||(p.pdf||[])[0]||"").filter(Boolean);console.log("sample printed:",[...new Set(pr)].slice(0,4).join(" || "));
