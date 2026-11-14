const fs=require("fs");
const R="/tmp/claude-0/rw2c/run/";
const leaves=new Map(fs.readFileSync(R+"leaves-tip.jsonl","utf8").split("\n").filter(Boolean).map(l=>{const o=JSON.parse(l);return [o.seed,o]}));
const lines=fs.readFileSync(R+"fam-all/econ-trade-food.jsonl","utf8").trim().split("\n").map(JSON.parse);
const recCache=new Map();
function rec(s){if(!recCache.has(s))recCache.set(s,JSON.parse(fs.readFileSync(R+"tip/records/"+s+".json","utf8")));return recCache.get(s)}
function dump(s){return fs.readFileSync(R+"tip/dumps/"+s+".txt","utf8")}
module.exports={leaves,lines,rec,dump};
