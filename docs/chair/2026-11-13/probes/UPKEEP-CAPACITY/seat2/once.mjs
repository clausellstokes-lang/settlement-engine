// UPKEEP-CAPACITY seat 2: THE LAW OF THE COUNT on the corpus, both arms (C4). MEASURES ONLY.
//   node once.mjs <tree> <out.ndjson> <shard> <shards>
// STATIC ARM: for each house, the parts it opens ALONE in the place's own record (config, tier, economy), minus the
// parts an empty roster opens; of those standing in the birth, the pairs that share a score (by the line's `feeds`).
// DROP ARM: each house dropped alone; the parts that move, by score; a tradition part (arcane, clergy, druids) that
// stays open and moves only because another tradition opened or closed (R2's shared cap against beasts) is classed
// apart as the cap, not as a feed of the dropped house.
import { createWriteStream } from 'node:fs';
const [R, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${R}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { defencePartsOf } = await imp('src/generators/defenseGenerator.js');
const { nativeSemanticName } = await imp('src/domain/content/customContentSemanticAuthority.js');
await loadGenerationLawPayloads();
const RULE = new Set(['terrain', 'size', 'danger', 'wallsUnmanned', 'sustainsHeld', 'scaleTop', 'scaleBottom', 'will', 'rounding']);
const isRule = (id) => RULE.has(id) || id.startsWith('full:') || id.startsWith('floor:');
const TRAD = new Set(['arcane', 'clergy', 'druids']);
const partsOf = (s) => defencePartsOf(s).filter((p) => !isRule(p.id));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const rows = [];
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) { const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40; for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress }); }
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) for (let i = 0; i < 20; i++) rows.push({ key: `fresh6-${stress}-${tier}-${i}`, tier, stress });
const o = createWriteStream(out);
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const all = partsOf(s); const ids = new Set(all.map((p) => p.id)); const feeds = Object.fromEntries(all.map((p) => [p.id, p.feeds]));
  const full = Object.fromEntries(all.map((p) => [p.id, p.full]));
  const empty = new Set(partsOf({ ...s, institutions: [] }).map((p) => p.id));
  const stat = []; const drop = []; const cap = [];
  s.institutions.forEach((h, i) => {
    const name = nativeSemanticName(h);
    const opens = partsOf({ ...s, institutions: [h] }).map((p) => p.id).filter((id) => !empty.has(id) && ids.has(id));
    const byScore = {};
    for (const id of opens) for (const sc of feeds[id] || []) (byScore[sc] ||= []).push(id);
    const shared = Object.entries(byScore).filter(([, v]) => v.length > 1);
    if (shared.length) stat.push([name, [...opens].sort(), shared.map(([sc, v]) => `${sc}:${v.sort().join('+')}`).sort()]);
    const now = partsOf({ ...s, institutions: s.institutions.filter((_, j) => j !== i) });
    const was = Object.fromEntries(now.map((p) => [p.id, p.full]));
    const moved = [...new Set([...Object.keys(full), ...Object.keys(was)])].filter((k) => Math.abs((full[k] ?? 0) - (was[k] ?? 0)) > 1e-9);
    const tradToggled = [...TRAD].some((id) => (id in full) !== (id in was));
    const capOnly = moved.filter((id) => TRAD.has(id) && id in full && id in was && !opens.includes(id) && tradToggled);
    const fed = moved.filter((id) => !capOnly.includes(id));
    const dby = {};
    for (const id of fed) for (const sc of feeds[id] || now.find((p) => p.id === id)?.feeds || []) (dby[sc] ||= []).push(id);
    const twice = Object.entries(dby).filter(([, v]) => v.length > 1);
    if (twice.length) drop.push([name, twice.map(([sc, v]) => `${sc}:${v.sort().join('+')}`).sort()]);
    if (capOnly.length) cap.push([name, capOnly]);
  });
  o.write(JSON.stringify({ key: row.key, tier: row.tier, stat, drop, cap }) + '\n');
}
o.end();
