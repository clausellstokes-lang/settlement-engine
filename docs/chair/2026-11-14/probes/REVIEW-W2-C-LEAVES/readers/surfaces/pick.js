const fs=require("fs");const P=new Map(fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(l=>{const x=JSON.parse(l);return [x.seed,{pop:x.facts.pop,kinds:x.L.kinds}]}));
const files={pdf:"pdf.jsonl",econ:"other-Economics & Trade.jsonl",res:"other-Resources & Production.jsonl"};
const out={};
for(const [k,f] of Object.entries(files)){const L=fs.readFileSync("/tmp/claude-0/rw2c/run/fam-surf/"+f,"utf8").split("\n").filter(Boolean).map(JSON.parse);
 const fam={};for(const r of L){let key=r.fam.replace("(no section): ","");if(k==="econ"&&/Exports/.test(key))key="- **Exports:** <row>";if(k==="res")key="| <exploitation row> | "+key.split("|")[2].trim()+" |";(fam[key]=fam[key]||new Set()).add(r.seed)}
 for(const [fk,S] of Object.entries(fam)){const s=[...S].sort((a,b)=>P.get(a).pop-P.get(b).pop);const cr=s.find(z=>P.get(z).kinds.some(q=>/under_siege/.test(q)))||s.find(z=>P.get(z).kinds.includes("famine"))||s.find(z=>P.get(z).kinds.includes("occupied"));
  out[k+"::"+fk]={towns:S.size,read:[...new Set([s[0],s[s.length-1],cr].filter(Boolean))]};}}
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/picks.json",JSON.stringify(out,null,1));for(const[k,v]of Object.entries(out))console.log(v.towns,k.slice(0,90),v.read.join(" "));
