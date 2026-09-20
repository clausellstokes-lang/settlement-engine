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
const BASE='cnocby-033a';
const suffixes=['anon','a1b2c3d4','ffffffff','00000000','9e8d7c6b','user-xyz','deadbeef','01234567','abcdefab','5f5f5f5f','zzzzzzzz','mock-e2e'];
let ok=0; const rows=[];
for (const suf of suffixes) {
  const seed=`${BASE}-${suf}`;
  const cfg={...DEFAULT_CONFIG,...migrateSettlementConfig({...SAMPLE})};
  const s=generateSettlementPipeline(cfg,null,{seed,customContent:{}});
  const c=s.config||{};
  const names=(s.institutions||[]).map(i=>String(i.name||i.id));
  const inn=names.some(n=>/inn/i.test(n));
  const market=names.some(n=>/market/i.test(n));
  const timberDep=(c.nearbyResourcesDepleted||[]).includes('mountain_timber');
  const pass = s.name==='Cnocby' && s.tier==='village' && c.terrainType==='mountain' && c.tradeRouteAccess==='road' && timberDep;
  if(pass) ok++;
  rows.push(`${seed.padEnd(24)} pop=${String(s.population).padStart(4)} timberDepleted=${timberDep?'y':'n'} inn=${inn?'y':'n'} market=${market?'y':'n'} conflicts=${(s.conflicts||[]).length} ${pass?'':'<<< FAIL'}`);
}
console.log(rows.join('\n'));
console.log(`\nINVARIANTS HELD: ${ok}/${suffixes.length} (name Cnocby, village, mountain, road, mountain timber depleted)`);
