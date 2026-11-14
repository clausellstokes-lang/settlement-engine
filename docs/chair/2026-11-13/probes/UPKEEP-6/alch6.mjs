// COHERENCE-UPKEEP-6, the chair's ruling E, MEASURE ONLY (for the next seat): the alchemist shop and the alchemist
// quarter keep their own kind (alchemists) and LEAVE arcane: the arcane gate reads the magic-house flag over the
// roster without them; nothing else changes. Needs alch-measure.patch on a SCRATCH copy of the tree (never the
// product). Births: magic6.mjs's corpus (the fifth seat's 3,036 and this seat's 720 fresh6), on reading A (E's tip).
//   node alch6.mjs <scratch-root> <out.ndjson> <shard> <shards>
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
const HOUSES = ['alchemist shop', 'alchemist quarter'];
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
const run = (s, k, on) => { if (on) globalThis.__U6_alchNoArcane = HOUSES; try { return { parts: partsMap(s, k), score: generateDefenseProfile(s, k).readiness.score }; } finally { delete globalThis.__U6_alchNoArcane; } };
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const names = (s.institutions || []).map((i) => String(i.name || '').toLowerCase());
  const held = HOUSES.filter((h) => names.some((n) => n.includes(h)));
  if (!held.length) continue;
  const k = keepOfRecord(s.economicState);
  const base = run(s, k, false), M = run(s, k, true);
  const diff = Object.fromEntries([...new Set([...Object.keys(base.parts), ...Object.keys(M.parts)])].map((id) => [id, Math.round(((M.parts[id] || 0) - (base.parts[id] || 0)) * 10) / 10]).filter(([, v]) => v));
  o.write(`${JSON.stringify({ key: row.key, tier: s.tier, held, base: base.score, M: M.score, band: readinessBandOf(base.score).label, bandM: readinessBandOf(M.score).label, arcane: !!base.parts.arcane, arcaneM: !!M.parts.arcane, alch: !!base.parts.alchemists, alchM: !!M.parts.alchemists, diff })}\n`);
}
o.end();
