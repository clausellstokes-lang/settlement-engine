const {leaves,lines,rec}=require("./lib");
const strip=p=>p.replace(/ \((transit|naval route only|taxed by occupation)\)/g,"").trim();
const out={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);const side=L.trade.local.join("")===l.line?"local":L.trade.exports.join("")===l.line?"exports":null;if(!side)continue;const r=rec(l.seed);
 for(const p of L.trade[side]){if(/\(transit\)/.test(p))continue;const g=strip(p);const ch=r.economicState.activeChains.filter(c=>(c.outputs||[]).some(o=>o.toLowerCase()===g.toLowerCase())&&!c.entrepot);
  if(!ch.length)continue;
  const ok=ch.some(c=>!c.resourceKey||c.resourceInputAvailable!==false&&!(c.resourceCondition!=="available"&&!c.substituteActive));
  const info=ch.map(c=>c.chainId+":"+c.status+" res="+c.resourceKey+":"+c.resourceCondition+" in="+c.resourceInputKey+":"+c.resourceInputCondition+"/"+c.resourceInputAvailable+" sub="+c.substituteActive).join(" ; ");
  if(!ok){(out[g]=out[g]||[]).push(side+" "+l.seed+" "+info)}}}
for(const g in out){console.log(out[g].length,g);console.log("   "+out[g].slice(0,3).join("\n   "))}
