// REVIEW-UPKEEP-CAPACITY: every scaled part's ladder at the tip: each catalogue house that opens it, its rung/of and factor.
import fs from 'node:fs'; const T=process.env.TREE;
const { getInstFlags } = await import(T+'/src/generators/priorityHelpers.js');
const { defenseTraditionNamesOf } = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
const { isFabricInstitution, institutionalCatalog } = await import(T+'/src/data/institutionalCatalog.js');
const { houseRungsOf } = await import(T+'/src/domain/institutions/houseScale.js');
const SCALED_PARTS = { garrison:(i)=>i.hasGarrison, militia:(i)=>i.hasMilitia, watch:(i)=>i.hasWatch, court:(i)=>i.hasCourtSystem, prison:(i)=>i.hasPrison, wardens:(_,n)=>n.wardens, company:(i)=>i.hasMercenary, charter:(i)=>i.hasCharterHall, clergy:(_,n)=>n.divine, druids:(_,n)=>n.druid, market:(i)=>i.hasMarket, hospital:(i)=>i.hasHospital, alchemists:(_,n)=>n.alchemy };
const jobsOf=(h)=>{ const one=[h]; const {inst}=getInstFlags({},one); const n=defenseTraditionNamesOf(one.filter(i=>!isFabricInstitution(i))); return Object.keys(SCALED_PARTS).filter(id=>SCALED_PARTS[id](inst,n)); };
const tiersOf={}; for(const t of Object.keys(institutionalCatalog)) for(const rows of Object.values(institutionalCatalog[t]||{})) for(const n of Object.keys(rows||{})) (tiersOf[n] ||= []).push(t[0]+t[1]);
const names=Object.keys(tiersOf).filter(n=>jobsOf({name:n}).length);
for(const job of Object.keys(SCALED_PARTS)){ const rows=names.filter(n=>jobsOf({name:n}).includes(job)).map(n=>{ const r=houseRungsOf([{name:n}],jobsOf)[job][0]; const f=r.of>1?0.8+0.4*(r.rung-1)/(r.of-1):1; return `${n} [${tiersOf[n].join(',')}] ${r.rung}/${r.of}=${f.toFixed(2)}`; });
  console.log(`## ${job}\n  `+rows.join('\n  ')); }
