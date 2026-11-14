const {leaves,lines,rec}=require("./lib");const {parents}=require("./raw2.js");
const RAW=new Set(["honey","medicinal herbs","peat","grain","livestock","wool","dairy","animal hides","iron","metalwork","salt","fish","dates","coal","stone","game meat","timber","flour","processed textiles","water","furs","clay","pottery","gems","glass"]);
const out=[];const shownStates={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.local.join("")!==l.line)continue;const r=rec(l.seed);const P=parents(r);
 const fr=r.economicState.foodSecurity.foodRecord||{};
 for(const p of L.trade.local){if(!RAW.has(p))continue;const par=P[p]||[];
  const ach=r.economicState.activeChains.filter(c=>par.includes(c.resourceInputKey)||par.includes(c.resourceKey));
  const sh=ach.map(c=>{const lc=L.chains.find(x=>x.id===c.chainId);return c.chainId+":"+(lc?lc.shown:"?")});
  for(const s of sh){const st=s.split(":")[1];shownStates[st]=(shownStates[st]||0)+1}
  const working=sh.some(s=>/:(running|vulnerable|magically_sustained|operational)$/.test(s));
  if(!working)out.push({seed:l.seed,tier:L.tier,crisis:L.crisis.join("+"),p,par:par.join(","),sh:sh.join(","),failed:fr.failedSource||null});
  else if(fr.failedSource&&JSON.stringify(fr.failedSource).toLowerCase().includes(p))out.push({seed:l.seed,p,FAILED:fr.failedSource});
 }}
console.log(shownStates);console.log(out.length);for(const o of out)console.log(JSON.stringify(o));
