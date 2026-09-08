import { pathToFileURL } from 'node:url'; import path from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const P=async r=>import(pathToFileURL(path.join(DOCK,r)).href);
const {generateSettlementPipeline}=await P('src/generators/generateSettlementPipeline.js');
const {instantiatedServices,DUTY_SERVICE_KINDS}=await P('src/domain/institutions/institutionTable.js');
const OLD=/\b(tithe|dues|tax|taxation|toll|customs|custom|custom commissions?|record keeping|records?|register|registration|census|levy|muster|rolls?)\b/i;
const town=(t,s)=>generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'},null,{seed:s,customContent:{}});
const tiers=['thorp','hamlet','village','town','city','metropolis'];
const now=new Set(), old=new Set();
for(const t of tiers) for(let i=0;i<5;i++){ const s=town(t,`estate-${t}-${i}`);
  for(const r of instantiatedServices(s)){ if(DUTY_SERVICE_KINDS.test(r.name)) now.add(r.name); if(OLD.test(r.name)) old.add(r.name); } }
console.log('estate scan (30 settlements, the test\'s own seeds)');
console.log(` NARROWED regex distinct duty names: ${now.size} -> ${[...now].sort().join(' · ')}`);
console.log(` WITH bare \`custom\`      distinct: ${old.size} -> ${[...old].sort().join(' · ')}`);
console.log(` removed by the narrowing: ${[...old].filter(x=>!now.has(x)).sort().join(' · ')||'(none)'}`);
// also the three census seeds
const c=new Set(); for(const t of ['hamlet','town','city']){ const s=town(t,`census-${t}`);
  for(const r of instantiatedServices(s)) if(DUTY_SERVICE_KINDS.test(r.name)) c.add(`${t}:${r.name}`); }
console.log(' census seeds duty rows:', [...c].sort().join(' · '));
