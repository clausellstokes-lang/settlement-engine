// COHERENCE-UPKEEP-5, stage one: birth the cold corpus in one tree; per birth, readiness and (with
// `parts`) the itemised V1 and V2.
//   node births.mjs <tree-root> <out.ndjson> <shard> <shards> [parts]
// The tree for `parts` is the lane tip with the two MEASURE-ONLY lines (prosperity.js, economicState.js:
// the label before any crisis, and the stores' months at that label's share). Births as the reviewer's:
// birthConfig({...DEFAULT_CONFIG, ...census dials, settType[, selectedStresses]}), { seed, customContent: {} }.
import { createWriteStream } from 'node:fs';
import { loadParts } from './parts.mjs';
const [root, out, shardArg = '0', shardsArg = '1', mode = ''] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { keepOf } = await imp('src/domain/facts/keep.js').catch(() => ({ keepOf: null }));
await loadGenerationLawPayloads();
const P = mode === 'parts' ? await loadParts(root) : null;

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
// the reviewer's calm births
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
// the reviewer's forced births: famine, siege and war, every size
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) {
  const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40;
  for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress });
}
// fresh seeds no seat has seen: calm, and the other crises
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });

const o = createWriteStream(out);
const r2 = (v) => Math.round(v * 100) / 100;
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = row.stress
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
  globalThis.__U5_log = [];
  const s = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  const es = s.economicState || {};
  const label = typeof es.prosperity === 'string' ? es.prosperity : es.prosperity?.label ?? null;
  const rd = s.defenseProfile?.readiness;
  const line = { key: row.key, tier: s.tier, forced: row.stress, stresses: (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean),
    prosperity: label, readiness: rd?.label ?? null, score: rd?.score ?? null, scores: s.defenseProfile?.scores && Object.fromEntries(['military', 'monster', 'internal', 'economic', 'magical'].map((k) => [k, s.defenseProfile.scores[k]])),
    months: es.foodSecurity?.storageMonths ?? null };
  if (P) {
    const log = globalThis.__U5_log.filter((e) => e.prosperity === label);
    const m = log[log.length - 1] || null;
    line.logCount = globalThis.__U5_log.length; line.pre = m?.pre ?? null; line.monthsPre = m?.monthsPre ?? null; line.monthsFull = m?.monthsFull ?? null;
    const t = P.today(s, keepOf(es.prosperity));
    line.todayCheck = t.score === rd?.score && ['military', 'monster', 'internal', 'economic', 'magical'].every((k) => t[k] === s.defenseProfile.scores[k]);
    if (!line.todayCheck) line.todayGot = t;
    const keepPre = keepOf(m?.pre);
    line.todayAtPre = P.today(s, keepPre).score; // today's formula, read at the label before any crisis
    for (const v of ['V1', 'V2']) {
      const it = P.itemise(s, keepPre, v, m?.monthsPre);
      line[v] = { score: it.score, total: r2(it.total), band: it.band, ceilinged: r2(it.ceilinged), overflow: it.overflow, groups: Object.fromEntries(Object.entries(it.groups).map(([k, x]) => [k, r2(x)])), size: it.size, danger: it.danger, n: it.n,
        sustainsLimited: it.sustainsLimited && { from: r2(it.sustainsLimited.from), to: r2(it.sustainsLimited.to) },
        crises: it.crises.map((c) => ({ name: c.name, took: Object.fromEntries(Object.entries(c.took).map(([d, x]) => [d, r2(x)])) })),
        parts: it.parts.map((p) => ({ g: p.group, n: p.name, pts: r2(p.points), raw: p.raw, scale: p.scale, share: p.share === null ? null : r2(p.share), crisis: p.crisis && Object.fromEntries(Object.entries(p.crisis).map(([k, x]) => [k, r2(x)])), note: p.note || undefined })) };
    }
    line.inst = (s.institutions || []).map((i) => i.name);
    line.route = s.config?.tradeRouteAccess; line.terrain = s.config?.terrainType; line.threat = s.config?.monsterThreat;
  }
  o.write(`${JSON.stringify(line)}\n`);
}
o.end();
console.error(`shard ${shard}/${shards}: ${Math.ceil((rows.length - shard) / shards)} of ${rows.length}`);
