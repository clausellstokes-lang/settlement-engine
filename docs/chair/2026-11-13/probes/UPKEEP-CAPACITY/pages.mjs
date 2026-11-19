// UPKEEP-CAPACITY, the build's page reads: every rendered tab, the PDF and the Foundry journal of each named birth,
// through the repo's own harness (scripts/audit/soak-review/renderHarness.mjs), born as corpus2.mjs bears them.
//   TREE=<tree> node pages.mjs <keys-file> <out-dir>        (one text file per key, sections "== <surface> ==")
const T = process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const H = await import(T + '/scripts/audit/soak-review/renderHarness.mjs');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const cfgFor = (key) => {
  const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
  return m[1] ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
};
const h = await H.bootHarness();
fs.mkdirSync(process.argv[3], { recursive: true });
for (const key of fs.readFileSync(process.argv[2], 'utf8').trim().split('\n')) {
  const s = generateSettlementPipeline(cfgFor(key), null, { seed: key, customContent: {} });
  const r = H.renderSurfaces(h, s);
  const parts = [];
  for (const [k, v] of Object.entries(r.tabs)) parts.push(`== tab:${k} ==\n${v}`);
  parts.push(`== pdf ==\n${r.pdf}`);
  parts.push(`== foundry ==\n${r.foundry}`);
  if (Object.keys(r.errors || {}).length) parts.push(`== errors ==\n${JSON.stringify(r.errors)}`);
  fs.writeFileSync(`${process.argv[3]}/${key}.txt`, parts.join('\n') + '\n');
}
await h.server.close();
