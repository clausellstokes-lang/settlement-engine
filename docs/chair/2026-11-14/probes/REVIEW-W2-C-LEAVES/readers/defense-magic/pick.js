const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
const leaves={};for(const l of fs.readFileSync(B+"leaves-tip.jsonl","utf8").trim().split("\n")){const r=JSON.parse(l);leaves[r.seed]=r}
const fams={};for(const r of L){(fams[r.fam]=fams[r.fam]||new Set()).add(r.seed)}
const pick={};
for(const[f,ss]of Object.entries(fams)){const a=[...ss].sort((x,y)=>leaves[x].pop-leaves[y].pop);const p=[a[0],a[a.length-1]];
 const cr=a.find(s=>!p.includes(s)&&(leaves[s].crisis||[]).some(k=>/siege|famine|occup/.test(k)))||a.find(s=>!p.includes(s));if(cr)p.push(cr);
 pick[f]=[...new Set(p)];}
fs.writeFileSync("picks.json",JSON.stringify(pick,null,1));
const all=new Set(Object.values(pick).flat());console.log(all.size);
