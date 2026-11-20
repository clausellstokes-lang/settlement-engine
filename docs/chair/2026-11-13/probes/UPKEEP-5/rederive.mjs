// The proof of "derived": birth, store (a JSON round trip, as a save stores it), strip the defence
// profile, recompute it from what is left, compare field by field.
//   node rederive.mjs <tree> <out.json> <shard> <shards>
import { writeFileSync } from 'node:fs';
const [root, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile } = await imp('src/generators/defenseGenerator.js');
const { keepOf } = await imp('src/domain/facts/keep.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
for (const tier of TIERS) for (let i = 0; i < 40; i++) rows.push({ key: `derive5-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime', 'occupied']) for (const tier of TIERS) for (let i = 0; i < 8; i++) rows.push({ key: `derive5-${stress}-${tier}-${i}`, tier, stress });
const diffs = {}; let n = 0, equal = 0; const examples = [];
const walk = (a, b, path, acc) => {
  if (typeof a !== typeof b || (a && b && typeof a === 'object') !== true) { if (JSON.stringify(a) !== JSON.stringify(b)) acc.push(path); return; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], path ? `${path}.${k}` : k, acc);
};
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const stored = JSON.parse(JSON.stringify(s));
  const was = stored.defenseProfile; delete stored.defenseProfile;
  const again = JSON.parse(JSON.stringify(generateDefenseProfile(stored, keepOf(stored.economicState?.prosperity))));
  const acc = []; walk(was, again, '', acc); n++;
  if (!acc.length) equal++; else { for (const p of acc) diffs[p] = (diffs[p] || 0) + 1; if (examples.length < 8) examples.push({ key: row.key, paths: acc.slice(0, 6), stored: was.readiness, again: again.readiness }); }
}
writeFileSync(out, JSON.stringify({ n, equal, diffs, examples }, null, 1));
