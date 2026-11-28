// alchsize.mjs <tree> <keys> <out>: each alchemist's house swapped for the other size in its own record (the one writer,
// the record's own keep): readiness, band and the five printed scores with their bands, both ways
import fs from 'node:fs';
const [T, K, out] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
const { scoreBand } = await import(T + '/src/domain/display/defenseScoreBands.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SK = ['military', 'monster', 'internal', 'economic', 'magical'];
const view = (d) => ({ score: d.readiness.score, band: d.readiness.label, scores: SK.map((x) => d.scores[x]), sbands: SK.map((x) => scoreBand(d.scores[x])) });
const o = fs.createWriteStream(out);
for (const key of fs.readFileSync(K, 'utf8').trim().split('\n')) {
  const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
  const cfg = m[1] ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
  const s = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
  const k = keepOfRecord(s.economicState);
  const has = s.institutions.find((i) => i.name === 'Alchemist shop' || i.name === 'Alchemist quarter').name;
  const other = has === 'Alchemist shop' ? 'Alchemist quarter' : 'Alchemist shop';
  const sw = { ...s, institutions: s.institutions.map((i) => (i.name === has ? { ...i, name: other } : i)) };
  o.write(JSON.stringify({ key, has, other, self: view(generateDefenseProfile(s, k)), swapped: view(generateDefenseProfile(sw, k)) }) + '\n');
}
o.end();
