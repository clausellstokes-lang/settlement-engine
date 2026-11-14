const fs=require("fs");
const R="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(R+"fam-all/resources.jsonl","utf8").trim().split("\n").map(JSON.parse);
const leaves={};for(const l of fs.readFileSync(R+"leaves-tip.jsonl","utf8").trim().split("\n")){const r=JSON.parse(l);leaves[r.seed]=r}
const rec=s=>JSON.parse(fs.readFileSync(R+"tip/records/"+s+".json","utf8"));
const dump=s=>fs.readFileSync(R+"tip/dumps/"+s+".txt","utf8").split("\n");
const tab=(s,t)=>{const d=dump(s);const out=[];let f=false;for(const x of d){if(x.startsWith("== ")){f=x==="== "+t+" =="; continue} if(f)out.push(x)}return out};
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
function splitS(t){return t.split(/(?<=[.!?])\s+/)}
function norm(s,seed){const n=leaves[seed].name;return s.split(n).join("{N}").replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g,"<T>")}
module.exports={L,leaves,rec,dump,tab,splitS,norm,esc};
