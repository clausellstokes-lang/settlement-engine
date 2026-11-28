// arcsup.mjs <tree> <keys> : for each birth, the stored profile's arcane fact beside the Defense display's Arcane
// Support row (defenseDisplay.js :: deriveSupportingCapabilities, which reads magicReliance.js :: magicPractitioners)
import fs from 'node:fs';
const [T, K] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { deriveSupportingCapabilities } = await import(T + '/src/domain/display/defenseDisplay.js');
const { magicPractitioners } = await import(T + '/src/domain/magicReliance.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const key of fs.readFileSync(K, 'utf8').trim().split('\n')) {
  const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
  const cfg = m[1] ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
  const s = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
  const row = deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');
  const d = s.defenseProfile;
  console.log(JSON.stringify({ key, hasArcane: d.traditions.hasArcane, magicDef: d.institutions.magicDef.map((i) => i.name), row: row ? `${row.status}: ${row.note}` : null, practitioners: magicPractitioners(s) }));
}
