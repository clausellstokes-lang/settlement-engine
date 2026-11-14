// UPKEEP-CAPACITY, steps 2 to 4: THE CORPUS. MEASURES ONLY; writes nothing in any tree.
//   node corpus.mjs <scratch-root> <census.json> <out.ndjson> <shard> <shards>
// The scratch root carries capacity-measure.patch (ruling E's alchemist hook, as alch-measure.patch, and a factor
// hook on `add`/`paid`, both inert unless a global is set). Births: alch6.mjs's 3,756 (the fifth seat's 3,036 and
// the sixth seat's 720 fresh6), born exactly as there. Every run has ruling E on (the shop and the quarter leave
// arcane). Per birth: the houses on each part's ladder (chains.mjs), and the rating under
//   base  today (E on), no factor
//   A     the greatest rung keeps today's points: f = 0.6 + 0.4·x, x = (rung-1)/(of-1)  (a one-rung ladder: 1)
//   B     the middle rung keeps today's points:   f = 0.8 + 0.4·x                      (a one-rung ladder: 1)
//   R     A read against the place's tier: f = min(1, A(house) / A(the rung that ladder writes at this tier))
//   AW    A, and the walls by their ladder in place of their kind (palisade 0.6 … massive walls 1)
// A part reads the greatest factor among its houses present. Walls (AW apart) and arcane take no factor.
import { createWriteStream, readFileSync } from 'node:fs';
import { partLadders } from './chains.mjs';
const [root, cj, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const census = JSON.parse(readFileSync(cj, 'utf8'));
const L = await partLadders(root, census);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile, defencePartsOf } = await imp('src/generators/defenseGenerator.js');
const { keepOfRecord } = await imp('src/domain/facts/keep.js');
const { readinessBandOf } = await imp('src/data/bandLadders.js');
const { nativeSemanticName } = await imp('src/domain/content/customContentSemanticAuthority.js');
const { defenseWallOf } = await imp('src/domain/institutions/defenseInstitutionBuckets.js');
const { DEFENCE_TUNING } = await imp('src/data/defenceWeights.js');
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SCALED = ['garrison', 'militia', 'watch', 'court', 'prison', 'wardens', 'company', 'charter', 'clergy', 'druids', 'market', 'hospital', 'alchemists'];
const SEEN = [...SCALED, 'walls', 'arcane'];
const xOf = (h) => (h.of > 1 ? (h.rung - 1) / (h.of - 1) : null);
const FA = (h) => (h.of > 1 ? 0.6 + 0.4 * xOf(h) : 1);
const FB = (h) => (h.of > 1 ? 0.8 + 0.4 * xOf(h) : 1);
const atTier = (part, h, tier) => { // the rung this house's ladder writes at the place's tier (else the greatest below it)
  const ti = TIERS.indexOf(tier);
  const same = Object.values(L[part]).filter((v) => v.ladder === h.ladder && v.tiers.some((t) => TIERS.indexOf(t) <= ti));
  if (!same.length) return h;
  const exact = same.filter((v) => v.tiers.includes(tier));
  return (exact.length ? exact : same).sort((a, b) => b.rung - a.rung)[0];
};
const FR = (part, tier) => (h) => Math.min(1, FA(h) / FA(atTier(part, h, tier)));
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const rows = [];
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) { const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40; for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress }); }
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) for (let i = 0; i < 20; i++) rows.push({ key: `fresh6-${stress}-${tier}-${i}`, tier, stress });
const o = createWriteStream(out);
globalThis.__U6_alchNoArcane = ['alchemist shop', 'alchemist quarter'];
const SK = ['military', 'monster', 'internal', 'economic', 'magical'];
const run = (s, k, f) => {
  if (f) globalThis.__CAP_f = f; else delete globalThis.__CAP_f;
  try {
    const p = generateDefenseProfile(s, k);
    const parts = Object.fromEntries(defencePartsOf(s, k).map((x) => [x.id, x.points]));
    return { score: p.readiness.score, band: p.readiness.label, full: SK.filter((d) => p.scores[d] >= 100).length, scores: SK.map((d) => p.scores[d]), parts };
  } finally { delete globalThis.__CAP_f; }
};
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const tier = s.tier;
  const names = (s.institutions || []).map((i) => nativeSemanticName(i).toLowerCase());
  const houses = Object.fromEntries(SEEN.map((p) => [p, names.filter((n) => L[p] && L[p][n]).map((n) => L[p][n])]));
  const factorBy = (pick) => (id) => (SCALED.includes(id) && houses[id].length ? Math.max(...houses[id].map(pick(id))) : 1);
  const k = keepOfRecord(s.economicState);
  const base = run(s, k, null);
  const A = run(s, k, factorBy(() => FA));
  const B = run(s, k, factorBy(() => FB));
  const R = run(s, k, factorBy((id) => FR(id, tier)));
  const kindShare = (() => { const w = defenseWallOf(s.institutions || []).kind; return w && DEFENCE_TUNING.wallKind[w] ? DEFENCE_TUNING.wallKind[w] : 1; })();
  const AW = run(s, k, (id) => (id === 'walls' ? (houses.walls.length ? Math.max(...houses.walls.map(FA)) / kindShare : 1) : factorBy(() => FA)(id)));
  const gaps = SEEN.filter((p) => (base.parts[p] || base.parts[p] === 0) && Object.hasOwn(base.parts, p) && !houses[p].length);
  o.write(`${JSON.stringify({ key: row.key, tier, forced: row.stress, houses: Object.fromEntries(Object.entries(houses).filter(([, v]) => v.length).map(([p, v]) => [p, v.map((h) => [h.name, h.rung, h.of])])), gaps, gapNames: gaps.length ? names : undefined, base, A, B, R, AW })}\n`);
}
o.end();
console.error(`shard ${shard}/${shards} done`);
