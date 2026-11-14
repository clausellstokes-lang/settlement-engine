const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");const picks=require("./picks.json");
const done=new Set();
for(const[f,ss]of Object.entries(picks)){if(!/Criminal/.test(f))continue;for(const s of ss){if(done.has(s))continue;done.add(s);const t=o[s];
 const page=fs.readFileSync(B+"tip/dumps/"+s+".txt","utf8").split("\n");const a=page.indexOf("== Systems/Power ==");
 const rul=page.slice(a,a+30).filter(l=>/^(Ruler|Contender)/.test(l)).map(l=>l.replace(/[▼▲]/g,"")).join("|");
 console.log("##",s,t.tier,t.pop,t.crisis.join("+"),"|",rul,"|crimF:",t.crimF.map(x=>x.n+":"+x.p+(x.g?"*":"")+(x.c?"~":"")).join(","),"|ops:",t.ci.join(","));
 const pr=t.lines.filter(l=>!/^Criminal structure|^Criminal activity is coord/.test(l));console.log("   ",pr.join(" ")); }}
