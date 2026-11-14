const {leaves,lines,rec}=require("./lib");const {parents}=require("./raw2.js");
const RAW=new Set(["honey","medicinal herbs","peat","grain","livestock","wool","dairy","animal hides","iron","metalwork","salt","fish","dates","coal","stone","game meat","timber","flour","processed textiles","water","furs","clay","pottery","gems","glass"]);
const W={honey:/bee|apiar|honey|forag|herb|druid|grove|chandl/i,"medicinal herbs":/herb|apothec|alchem|forag|druid|grove|healer|physic|hospital|midwife/i,salt:/salt/i,timber:/wood|timber|saw|lumber|forest|carpent|charcoal/i,livestock:/graz|herd|pastur|shepherd|dairy|stock|cattle|butcher/i,wool:/graz|shepherd|sheep|wool|herd|pastur/i,dairy:/dairy|cheese|graz|herd|pastur/i,"animal hides":/tann|hunt|leather|graz|herd|butcher|furrier/i,dates:/date|palm|oasis/i};
const res=[];
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.local.join("")!==l.line)continue;const r=rec(l.seed);const P=parents(r);
 for(const p of L.trade.local){if(!RAW.has(p))continue;const par=P[p]||[];
  const ach=r.economicState.activeChains.filter(c=>par.includes(c.resourceInputKey)||par.includes(c.resourceKey));
  const st=ach.map(c=>{const lc=L.chains.find(x=>x.id===c.chainId);return lc&&lc.shown?lc.shown:c.status});
  if(st.some(s=>/running|vulnerable|magically|operational/.test(s)))continue;
  const houses=L.roster.filter(n=>W[p]&&W[p].test(n)&&!/^access to/i.test(n));
  const ex=[...L.exploit.unexploited,...L.exploit.partial,...L.exploit.full].filter(e=>par.map(x=>x.replace(/_/g," ")).includes(e.r.toLowerCase())||e.r.toLowerCase()===p);
  res.push({seed:l.seed,tier:L.tier,crisis:L.crisis.join("+"),p,par:par.join(","),chains:st.join(","),houses:houses.join("|"),exploit:JSON.stringify(ex.map(e=>e.r+":"+e.filed))});
 }}
require("fs").writeFileSync("nochain.json",JSON.stringify(res,null,1));
const g={};for(const o of res){const k=o.p+" <- "+o.par+(o.houses?" HOUSE":" nohouse")+(o.chains?" ch="+o.chains:"");(g[k]=g[k]||[]).push(o.seed)}
for(const k in g)console.log(g[k].length,k,g[k].slice(0,6).join(" "));
