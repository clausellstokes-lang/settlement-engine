const W = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-prose-weave';
const { generateSettlementPipeline } = await import(`${W}/src/generators/generateSettlementPipeline.js`);
const { DEFAULT_CONFIG } = await import(`${W}/src/store/configSlice.js`);
const { migrateSettlementConfig } = await import(`${W}/src/lib/settlementConfigMigration.js`);

const SAMPLE = {
  settType:'village', tradeRouteAccess:'road', terrainOverride:'mountain', monsterThreat:'heartland',
  culture:'celtic', customName:'Cnocby',
  priorityMilitary:47, priorityReligion:23, priorityEconomy:49, priorityCriminal:64, priorityMagic:21,
  nearbyResourcesRandom:false,
  nearbyResources:['mountain_timber','alpine_pasture','hunting_grounds','ancient_grove','stone_quarry'],
  nearbyResourcesState:{ mountain_timber:'depleted' },
};
const seeds = process.argv.slice(2);
for (const seed of seeds) {
  // the fork path: migrateConfig(forkConfigFor(sample)) into the store, then generate(seed)
  const cfg = { ...DEFAULT_CONFIG, ...migrateSettlementConfig({ ...SAMPLE }) };
  let s;
  try { s = generateSettlementPipeline(cfg, null, { seed, customContent: {} }); }
  catch(e){ console.log(seed, 'THREW', String(e).slice(0,120)); continue; }
  const c = s.config || {};
  const conf = (s.conflicts||[])[0];
  const dep = (c.nearbyResourcesDepleted||[]).join(',');
  const res = (c.nearbyResources||[]).join(',');
  const insts = (s.institutions||[]).map(i=>i.name||i.id).slice(0,8).join(' | ');
  console.log(`\n=== ${seed} ===`);
  console.log(`  name=${s.name} pop=${s.population} tier=${s.tier} terrain=${c.terrainType} route=${c.tradeRouteAccess} culture=${c.cultureProfileKey}`);
  console.log(`  resources: ${res}`);
  console.log(`  depleted : ${dep}`);
  console.log(`  conflict : ${conf ? conf.parties.join(' x ')+' :: '+conf.issue+' :: '+conf.stakes : '(none)'}`);
  console.log(`  arrival  : ${String(s.arrivalScene||'').slice(0,200)}`);
  console.log(`  pressure : ${s.pressureSentence||''}`);
  console.log(`  insts    : ${insts}`);
}
