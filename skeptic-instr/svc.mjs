import { pathToFileURL } from 'node:url'; import path from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const P=async r=>import(pathToFileURL(path.join(DOCK,r)).href);
const {generateSettlementPipeline}=await P('src/generators/generateSettlementPipeline.js');
const {liveInstitutions}=await P('src/domain/institutions/institutionRoster.js');
const {instantiatedServices,DUTY_SERVICE_KINDS,institutionTableOf}=await P('src/domain/institutions/institutionTable.js');
const town=(t,s)=>generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'},null,{seed:s,customContent:{}});
const tiers=['thorp','hamlet','village','town','city','metropolis'];
let svcRows=0,onLive=0,duty=0,rawServices=0,n=0;
const dutyNames=new Set();
for(const t of tiers) for(let i=0;i<5;i++){ const s=town(t,`estate-${t}-${i}`); n++;
  rawServices += Array.isArray(s.services)?s.services.length:0;
  const rows=instantiatedServices(s); svcRows+=rows.length;
  const live=new Set(liveInstitutions(s).map(x=>String(x?.name||'')));
  for(const r of rows){ if(live.has(r.institution)) onLive++;
    if(DUTY_SERVICE_KINDS.test(r.name)) { duty++; dutyNames.add(r.name); } } }
console.log(`over ${n} settlements (6 tiers x 5 seeds): availableServices rows ${svcRows}, on a live roster row ${onLive}, of duty kind ${duty}`);
console.log(`schema \`services\` rows across all ${n}: ${rawServices}`);
console.log(`distinct duty names (${dutyNames.size}): ${[...dutyNames].sort().join(' · ')}`);
// The 12-settlement figure the receipt quotes: try the first twelve of the same roster
let s2=0,l2=0,d2=0,m=0; const dn2=new Set();
outer: for(const t of tiers) for(let i=0;i<5;i++){ if(m>=12) break outer; const s=town(t,`estate-${t}-${i}`); m++;
  const rows=instantiatedServices(s); s2+=rows.length;
  const live=new Set(liveInstitutions(s).map(x=>String(x?.name||'')));
  for(const r of rows){ if(live.has(r.institution)) l2++; if(DUTY_SERVICE_KINDS.test(r.name)){d2++;dn2.add(r.name);} } }
console.log(`first ${m}: rows ${s2}, on live ${l2}, duty ${d2}, distinct duty ${dn2.size}`);
