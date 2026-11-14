const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const norm=a=>(a||[]).filter(z=>!/^None (recorded|significant)$/.test(z));
const res={};const ex={};
function tally(key,ok,x,e){res[key]=res[key]||{};const c=cls(x);res[key][c]=res[key][c]||{agree:0,disagree:0};if(ok)res[key][c].agree++;else{res[key][c].disagree++;(ex[key]=ex[key]||[]).push(Object.assign({seed:x.seed,cls:c},e))}}
const lc=a=>a.map(z=>z.toLowerCase());
for(const x of P){
 const pe=norm(x.pdf.exports),je=x.jr.exportsRaw||"",te=x.L.trade.exports||[];
 tally("exports pdf=journal",pe.join(", ")===je,x,{pdf:pe,journal:je});
 tally("exports pdf=tab",JSON.stringify(pe)===JSON.stringify(te),x,{pdf:pe,tab:te});
 const pi=norm(x.pdf.imports),ji=x.jr.importsRaw||"",ti=x.L.trade.imports||[];
 tally("imports pdf=journal",pi.join(", ")===ji,x,{pdf:pi,journal:ji});
 tally("imports pdf=tab",JSON.stringify(pi)===JSON.stringify(ti),x,{pdf:pi,tab:ti});
 const pl=norm(x.pdf.local),tl=x.L.trade.local||[];
 tally("local pdf=tab (case-insens.)",JSON.stringify(lc(pl))===JSON.stringify(lc(tl)),x,{pdf:pl,tab:tl});
}
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/trade-agree.json",JSON.stringify({res,ex},null,1));
console.log(JSON.stringify(res));for(const k in ex){console.log("##",k,ex[k].length);for(const e of ex[k].slice(0,5))console.log(JSON.stringify(e).slice(0,500))}
