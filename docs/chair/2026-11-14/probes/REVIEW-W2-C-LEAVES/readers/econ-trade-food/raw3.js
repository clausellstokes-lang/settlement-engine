const {leaves,lines,rec}=require("./lib");const {parents}=require("./raw2.js");
const RAW=new Set(["honey","medicinal herbs","peat","grain","livestock","wool","dairy","animal hides","iron","metalwork","salt","fish","dates","coal","stone","game meat","timber","flour","processed textiles","water","furs","clay","pottery","gems","glass"]);
const res={};const ex={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.local.join("")!==l.line)continue;const r=rec(l.seed);const P=parents(r);
 for(const p of L.trade.local){if(!RAW.has(p))continue;const par=P[p]||[];
  const ch=r.economicState.activeChains.filter(c=>par.includes(c.resourceInputKey)||par.includes(c.resourceKey));
  const k=ch.length?ch.map(c=>c.status).sort().join(","):"NOCHAIN";
  res[p]=res[p]||{};res[p][k]=(res[p][k]||0)+1; if(k=="NOCHAIN"){(ex[p]=ex[p]||[]).push(l.seed+" par="+par.join(","))}}}
for(const p in res)console.log(p,JSON.stringify(res[p]));
for(const p in ex)console.log(p,ex[p].slice(0,4));
