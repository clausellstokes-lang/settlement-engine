// SKEPTIC PROBE (read-only): can THE STOP arm's assertions distinguish a regen
// that read the LIT wizard config from one that read the world's own config?
const D = process.argv[2];
const { generateSettlementPipeline, regenNPCsPipeline } =
  await import(`${D}/src/generators/generateSettlementPipeline.js`);
const CONFIG = {
  settType: 'town', culture: 'germanic', terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads', monsterThreat: 'civilized',
};
const LIT = { ...CONFIG, _livingContentLawVersion: 2 };
const s = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'skeptic-stop' });
console.log('born markerless:', s.config._livingContentLawVersion === undefined);
console.log('born roster absent:', s.customContentRoster === undefined);
for (const [label, cfg] of [['settlement.config (product)', s.config], ['LIT wizard config (the defect)', LIT]]) {
  const parts = regenNPCsPipeline(s, cfg, { locks: {} });
  const { _preservation, ...rest } = parts;
  const after = { ...s };
  Object.assign(after, rest);            // exactly what foldRegeneratedRoster does
  console.log(`--- cfg = ${label}`);
  console.log('   returned part keys:', Object.keys(rest).sort().join(','));
  console.log('   after.config[_livingContentLawVersion] =', after.config._livingContentLawVersion);
  console.log('   after.customContentRoster =', after.customContentRoster);
}
