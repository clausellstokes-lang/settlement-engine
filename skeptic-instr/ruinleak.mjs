import { pathToFileURL } from 'node:url'; import path from 'node:path';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const P=async r=>import(pathToFileURL(path.join(DOCK,r)).href);
const {generateSettlementPipeline}=await P('src/generators/generateSettlementPipeline.js');
const {liveInstitutions}=await P('src/domain/institutions/institutionRoster.js');
const {instantiatedServices,institutionTableOf,DUTY_SERVICE_KINDS}=await P('src/domain/institutions/institutionTable.js');
const {quantityWords}=await P('src/domain/worldPulse/demographicsHerald.js');
const W={bandOf:quantityWords};
const town=(t,s)=>generateSettlementPipeline({settType:t,culture:'germanic',terrain:'grassland',tradeRouteAccess:'road'},null,{seed:s,customContent:{}});
const tiers=['thorp','hamlet','village','town','city','metropolis'];
let leakRows=0,leakDuty=0,scanned=0; const leakNames=new Set(), leakInst=new Set();
for(const t of tiers) for(let i=0;i<5;i++){ const s=town(t,`estate-${t}-${i}`); scanned++;
  const live=new Set(liveInstitutions(s).map(x=>String(x?.name||'')));
  const all=new Set((s.institutions||[]).map(x=>String(x?.name||'')));
  for(const r of instantiatedServices(s)){
    if(r.institution && !live.has(r.institution)){ leakRows++; leakNames.add(r.name); leakInst.add(r.institution);
      if(DUTY_SERVICE_KINDS.test(r.name)) leakDuty++; } } }
console.log(`over ${scanned} settlements: service rows whose institution is NOT on the live roster: ${leakRows} (of which duty-kind: ${leakDuty})`);
console.log('  distinct non-live institutions named:', [...leakInst].slice(0,12).join(' · '));
console.log('  distinct service names leaked:', [...leakNames].slice(0,12).join(' · '));
// does the COLUMN carry them?
const s=town('city','census-city'); const live=new Set(liveInstitutions(s).map(x=>String(x?.name||'')));
const tbl=institutionTableOf(s,W);
const rowNames=new Set(tbl.rows.flatMap(r=>r.whatItDoes));
const colOnly=tbl.columns.whatItDoes.values.filter(v=>!rowNames.has(v));
console.log(`census-city: whatItDoes column ${tbl.columns.whatItDoes.values.length} values; values in the COLUMN but on NO live row: ${colOnly.length}`, colOnly.slice(0,8).join(' · '));
console.log('whatItDoesNotDo column:', JSON.stringify(tbl.columns.whatItDoesNotDo.values), 'closed=',tbl.columns.whatItDoesNotDo.closed);
console.log('holderRole column:', JSON.stringify(tbl.columns.holderRole));
