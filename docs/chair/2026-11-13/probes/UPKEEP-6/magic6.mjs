// COHERENCE-UPKEEP-6, ruling 4 (REVIEW-UPKEEP-2, C5: count once, every magic house): MEASURES ONLY.
//   node magic6.mjs <tree> <out.ndjson> <shard> <shards>
// <tree> carries probes/UPKEEP-6/magic-measure.patch (a house may leave the magic presence alone, or its named
// parts alone, through two globals). Per birth holding one of the review's houses: what each house feeds (the
// parts that move when it leaves the presence alone, and when it leaves its named part alone), and readiness
// under the two readings — A: every such house keeps its named part and leaves magic; B: keeps magic, leaves
// the named part. Births: the fifth seat's 3,036 and this seat's 720 fresh6 (births6.mjs's corpus).
import { createWriteStream } from 'node:fs';
const [root, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile, defencePartsOf } = await imp('src/generators/defenseGenerator.js');
const { keepOfRecord } = await imp('src/domain/facts/keep.js');
const { readinessBandOf } = await imp('src/data/bandLadders.js');
await loadGenerationLawPayloads();
const HOUSES = ['apothecary district', 'elder grove council', "wizard's tower", 'alchemist shop', "mages' guild", 'alchemist quarter', 'hedge wizard', 'healer (divine'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) { const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40; for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress }); }
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) for (let i = 0; i < 20; i++) rows.push({ key: `fresh6-${stress}-${tier}-${i}`, tier, stress });
const o = createWriteStream(out);
const partsMap = (s, k) => Object.fromEntries(defencePartsOf(s, k).map((p) => [p.id, p.points]));
const run = (s, k, set) => { Object.assign(globalThis, set); try { return { parts: partsMap(s, k), score: generateDefenseProfile(s, k).readiness.score }; } finally { delete globalThis.__U6_excludeNamed; delete globalThis.__U6_excludePresence; } };
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const names = (s.institutions || []).map((i) => String(i.name || '').toLowerCase());
  const held = HOUSES.filter((h) => names.some((n) => n.includes(h)));
  if (!held.length) continue;
  const k = keepOfRecord(s.economicState);
  const base = run(s, k, {});
  const diff = (a, b) => Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].map((id) => [id, Math.round(((b[id] || 0) - (a[id] || 0)) * 10) / 10]).filter(([, v]) => v));
  const each = Object.fromEntries(held.map((h) => [h, { presence: diff(base.parts, run(s, k, { __U6_excludePresence: [h] }).parts), named: diff(base.parts, run(s, k, { __U6_excludeNamed: [h] }).parts) }]));
  const A = run(s, k, { __U6_excludePresence: held }), B = run(s, k, { __U6_excludeNamed: held });
  o.write(`${JSON.stringify({ key: row.key, tier: s.tier, held, each, base: base.score, A: A.score, B: B.score, band: readinessBandOf(base.score).label, bandA: readinessBandOf(A.score).label, bandB: readinessBandOf(B.score).label, magicA: (A.parts.magic || 0), magicBase: (base.parts.magic || 0) })}\n`);
}
o.end();
