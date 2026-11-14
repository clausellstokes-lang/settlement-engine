const {leaves,lines,rec}=require("./lib");const {parents}=require("./raw2.js");
const strip=p=>p.replace(/ \((transit|naval route only|taxed by occupation)\)/g,"").trim();
const FAILG={fish:["fishing_grounds","river_fish"],livestock:["grazing_land","alpine_pasture","camel_herds","fertile_floodplain"],grain:["grain_fields","fertile_floodplain","river_mills","date_palms"],game:["hunting_grounds"]};
const FAILP={fish:/^(fish|salted fish|smoked seafood|freshwater catch|river fish|fish oil)$/i,livestock:/^(livestock|dairy|wool|raw wool|live sheep|aged cheese|cavalry mounts|draft horses)$/i,grain:/^(grain|flour|milled flour|flour and meal|grain surplus|grain export|desert grain)$/i,game:/^(game meat|furs|furs and pelts|hunting trophies)$/i};
const RAW=new Set(["honey","medicinal herbs","peat","grain","livestock","wool","dairy","animal hides","iron","metalwork","salt","fish","dates","coal","stone","game meat","timber","flour","processed textiles","water","furs","clay","pottery","gems","glass"]);
const out=[];
function flag(l,sev,kind,code,sentence,fact){out.push({fam:l.fam,seed:l.seed,sev,kind,code,sentence,fact})}
for(const l of lines){const L=leaves.get(l.seed);const r=rec(l.seed);
 if(l.fam.startsWith("TRADE-PILLS")){
  const side=L.trade.local.join("")===l.line?"local":L.trade.exports.join("")===l.line?"exports":null;if(!side)continue;
  const label=side==="local"?"Produced locally":"Exports";
  const fr=r.economicState.foodSecurity.foodRecord||{};const f=fr.failedSource;
  const P=parents(r);
  for(const p of L.trade[side]){const g=strip(p);if(/\(transit\)/.test(p))continue;
   // famine failed ground
   if(f&&FAILP[f]&&FAILP[f].test(g)){
     const ch=r.economicState.activeChains.filter(c=>(c.outputs||[]).some(o=>o.toLowerCase()===g.toLowerCase())&&!c.entrepot);
     const grounds=new Set([...ch.map(c=>c.resourceInputKey),...(P[g.toLowerCase()]||[])].filter(Boolean));
     const near=r.config.nearbyResources;
     const other=[...grounds].filter(k=>!FAILG[f].includes(k)&&near.includes(k));
     if(!other.length)flag(l,"MED","c","famine-failed",label+": "+p,"famine in force; record foodRecord.failedSource='"+f+"' (the "+f+" failed); grounds for this good: "+([...grounds].join(",")||"none other")+"; chain cards: "+L.chains.filter(c=>ch.some(x=>x.chainId===c.id)).map(c=>c.name+" "+(c.shown||c.raw)).join(", "));
   }
   // siege: raw good whose ground chains all impaired
   if(L.crisis.includes("under_siege")&&side==="local"&&RAW.has(p)){
     const par=P[p]||[];const ach=r.economicState.activeChains.filter(c=>par.includes(c.resourceInputKey)||par.includes(c.resourceKey));
     const st=ach.map(c=>{const lc=L.chains.find(x=>x.id===c.chainId);return lc?(lc.shown||lc.raw):c.status});
     if(ach.length&&st.every(s=>s==="impaired"))flag(l,"LOW","c","siege-impaired",label+": "+p,"under siege; every chain on its ground ("+ach.map(c=>c.label).join(", ")+") prints Impaired; record viability: '"+(r.stress&&r.stress.viabilityNote||(Array.isArray(r.stress)?r.stress[0].viabilityNote:""))+"'");
   }
   // seafood inland
   if(/^(Smoked seafood|Fish oil)$/.test(g)&&!r.config.nearbyResources.includes("fishing_grounds")&&r.economicState.tradeAccess!=="port")flag(l,"LOW","a","seafood-inland",label+": "+p,"no sea: route "+r.economicState.tradeAccess+", grounds "+r.config.nearbyResources.join(",")+" (river fish only)");
   // ship building without a yard
   const own=L.roster.filter(n=>!/^access to/i.test(n));
   if(/^(Ship construction|Ocean-going vessels)$/.test(g)&&!own.some(n=>/shipyard|shipwright/i.test(n))){
     const yard=own.filter(n=>/boatyard|dock|harbou?r/i.test(n));flag(l,"MED","a","no-shipyard",label+": "+p,"no shipyard or shipwright on the roster"+(yard.length?" (only "+yard.join(", ")+")":""));}
   if(/^(River craft|Cargo barges|River barges)$/.test(g)&&!own.some(n=>/boatyard|shipyard|shipwright|barge/i.test(n)))flag(l,"LOW","a","no-boatyard",label+": "+p,"no boatyard/shipyard on the roster (only "+own.filter(n=>/ferry|landing|dock/i.test(n)).join(", ")+")");
   if(/^(Medical treatment|Surgery)$/.test(g)&&!own.some(n=>/hospital|physic|surgeon|infirm/i.test(n)))flag(l,"LOW","a","no-hospital",label+": "+p,"no hospital, physician or surgeon on the roster; the chain runs through "+own.filter(n=>/alms|foundling/i.test(n)).join(", "));
   if(/^Maps and charts$/.test(g)&&!own.some(n=>/cartograph/i.test(n)))flag(l,"LOW","a","no-cartographer",label+": "+p,"no cartographer on the roster");
   if(/^(Raw gemstones|Precious metals|gems)$/.test(g)&&!own.some(n=>/mine|mining|assay|prospect/i.test(n)))flag(l,"LOW","a","no-mine",label+": "+p,"no mine on the roster (gems/metal worked via "+own.filter(n=>/jewel|metalwork|smith/i.test(n)).join(", ")+")");
  }
  // dup pills
  const a=L.trade[side].map(x=>x.toLowerCase());const d=a.filter((x,i)=>a.indexOf(x)!==i);if(d.length)flag(l,"MED","h","dup-pill",label+" row","repeated pill: "+d.join(","));
 }
 if(/^NEEDS/.test(l.fam)){
  const shown=l.line.replace(/^Needed, and not brought in: /,"").replace(/\.$/,"").split(", ");const d=shown.filter((x,i)=>shown.indexOf(x)!==i);
  if(d.length)flag(l,"MED","h","dup-need",l.line,"repeated item: "+[...new Set(d)].join(", "));
  if(shown.includes("mineral hot springs"))flag(l,"LOW","h","place-as-good",l.line,"'mineral hot springs' is a ground (record key hot_springs_mineral), not a good that can be brought in");
  if(shown.includes("timber")&&shown.includes("mountain timber"))flag(l,"LOW","h","near-dup-timber",l.line,"'timber' and 'mountain timber' (the record key mountain_timber) name the same need twice");
  const own=L.roster.filter(n=>!/^access to/i.test(n));
  if(L.trade.needed.includes("livestock")){const h=own.filter(n=>/graz|herd|shepherd|dairy|pastur|cattle/i.test(n));if(h.length)flag(l,"MED","b","need-kept",l.line,"the town keeps herds: "+h.join(", ")+" on its roster");}
  if(L.trade.needed.includes("fish")){const h=own.filter(n=>/fish/i.test(n));if(h.length)flag(l,"MED","b","need-kept",l.line,"the town has a fishery: "+h.join(", ")+" on its roster");}
 }
}
require("fs").writeFileSync("flags.json",JSON.stringify(out,null,1));
const c={};for(const o of out){const k=o.code+" "+o.sev;c[k]=c[k]||new Set();c[k].add(o.seed)}for(const k in c)console.log(k,c[k].size);
