// COHERENCE-UPKEEP-6: the measuring births. MEASURES ONLY; writes nothing in any tree.
//   node births6.mjs <tree-root> <out.ndjson> <shard> <shards> [corpus=all|u5|fresh6]
// Corpus `u5` is the fifth seat's 3,036 (births.mjs, the same keys and configs); `fresh6` is this seat's own
// unseen seeds (no seat tuned on them): calm `fresh6-<size>-0..59` and forced
// `fresh6-<famine|under_siege|wartime>-<size>-0..19`; `keys:<k1,k2,...>` names births. Born as the reviewer bore them.
// Per birth: the readiness and its band, the band of the rounded figure, the parts, the walls (names, the two
// homes' kinds), the food record's held flag and months, the guard assessment, the hired houses.
import { createWriteStream } from 'node:fs';
const [root, out, shardArg = '0', shardsArg = '1', corpus = 'all'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { readinessBandOf } = await imp('src/data/bandLadders.js');
const buckets = await imp('src/domain/institutions/defenseInstitutionBuckets.js');
const { defenseFactsOf } = await imp('src/domain/defense/defenseFacts.js');
await loadGenerationLawPayloads();

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
if (corpus === 'all' || corpus === 'u5') {
  for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
  for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) {
    const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40;
    for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress });
  }
  for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
  for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });
}
if (corpus === 'all' || corpus === 'fresh6') {
  for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier, stress: null });
  for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) for (let i = 0; i < 20; i++) rows.push({ key: `fresh6-${stress}-${tier}-${i}`, tier, stress });
}

if (corpus.startsWith('keys:')) {
  // named births: `<lane>-<tier>-<i>` calm, `<lane>-force-<crisis>-<tier>-<i>` forced (the 660's recipe)
  for (const key of corpus.slice(5).split(',')) {
    const m = /^[a-z0-9]+-force-([a-z_]+)-([a-z]+)-\d+$/.exec(key) || /^r2s-([a-z_]+)-([a-z]+)-\d+$/.exec(key); // r2s-: the census corpus
    rows.push(m ? { key, tier: m[2], stress: m[1] } : { key, tier: key.split('-')[1], stress: null });
  }
}

const o = createWriteStream(out);
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const es = s.economicState || {};
  const dp = s.defenseProfile || {};
  const rd = dp.readiness || {};
  const fr = es.foodSecurity?.foodRecord || {};
  const part = buckets.partitionDefenseInstitutions(s.institutions || []);
  const nm = (x) => x?.name ?? null;
  const facts = defenseFactsOf(s);
  const line = {
    key: row.key, tier: s.tier, forced: row.stress,
    stresses: (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean),
    shown: typeof es.prosperity === 'string' ? es.prosperity : es.prosperity?.label ?? null,
    standing: es.prosperityStanding ?? null,
    score: rd.score ?? null, label: rd.label ?? null,
    roundLabel: Number.isFinite(rd.score) ? readinessBandOf(Math.round(rd.score)).label : null,
    scores: dp.scores && Object.fromEntries(['military', 'monster', 'internal', 'economic', 'magical', 'disaster'].map((k) => [k, dp.scores[k]])),
    parts: (dp.parts || []).map((p) => [p.id, p.points, p.full ?? null, p.crisis ?? null]),
    walls: part.walls.map(nm), wallOf: buckets.defenseWallOf ? buckets.defenseWallOf(s.institutions || []).kind : null, factsWallKind: facts.wallKind ?? null,
    held: fr.storesHeld ?? null, months: fr.storageMonths ?? es.foodSecurity?.storageMonths ?? null, granary: fr.hasGranary ?? null, foodBand: fr.band ?? null,
    foodLabel: es.foodSecurity?.label ?? es.foodSecurity?.status ?? null,
    guard: es.safetyProfile?.guardEffectivenessDesc ?? null,
    hired: { company: part.mercenary.length > 0, charter: part.charter.length > 0, garrison: part.garrison.length > 0, watch: part.watch.length > 0, militia: part.militia.length > 0 },
  };
  o.write(`${JSON.stringify(line)}\n`);
}
o.end();
console.error(`shard ${shard}/${shards}: ${Math.ceil((rows.length - shard) / shards)} of ${rows.length}`);
