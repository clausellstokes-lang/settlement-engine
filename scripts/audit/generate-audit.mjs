/**
 * generate-audit.mjs — large-scale settlement generation audit harness.
 *
 * Runs the REAL headless generator (generateSettlementPipeline, customContent:{})
 * over a stratified + randomized + edge-case config sweep, runs per-settlement
 * invariant checks, and aggregates distributions incrementally (never holds the
 * full sample in memory). Deterministic + reproducible: config sampling uses its
 * own seeded PRNG, and every generation seed is recorded so any flagged
 * settlement re-generates byte-identically.
 *
 * Usage:
 *   npx vite-node scripts/audit/generate-audit.mjs -- --count 5000 --out <path.json> [--shard i/N] [--harnessSeed 1]
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { TIER_ORDER } from '../../src/domain/customContentSchema.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';
import { CULTURES } from '../../src/generators/steps/resolveConfig.js';
import { writeFileSync } from 'node:fs';

// ── args ────────────────────────────────────────────────────────────────────
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const COUNT = parseInt(arg('count', '5000'), 10);
const OUT = arg('out', 'scratchpad/audit-pilot.json');
const HARNESS_SEED = parseInt(arg('harnessSeed', '1'), 10);
const [shardI, shardN] = arg('shard', '0/1').split('/').map(Number);

// Harness PRNG (NOT the generator's) — varies configs reproducibly.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rng = mulberry32(HARNESS_SEED * 2654435761);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const chance = (p) => rng() < p;

const TERRAINS = ['auto', 'coastal', 'mountain', 'forest', 'plains', 'desert', 'river', 'hills', 'swamp'];

// ── config sampling ───────────────────────────────────────────────────────
// 50% stratified factorial, 40% fully randomized, 10% edge/adversarial.
function makeConfig(i) {
  const bucket = rng();
  if (bucket < 0.10) return edgeConfig(i);
  if (bucket < 0.50) return randomConfig(i);
  return stratifiedConfig(i);
}
function stratifiedConfig(i) {
  const tier = TIER_ORDER[i % TIER_ORDER.length];
  return { settType: tier, culture: pick(CULTURES), terrainOverride: pick(TERRAINS),
    magicExists: chance(0.75), _randomizePriorities: true, _bucket: 'stratified' };
}
function randomConfig() {
  return { settType: pick(TIER_ORDER), culture: pick(CULTURES), terrainOverride: pick(TERRAINS),
    magicExists: chance(0.7), priorityMagic: Math.floor(rng() * 100), _randomizePriorities: true, _bucket: 'random' };
}
function edgeConfig() {
  const variants = [
    () => ({ settType: 'random', _randomizePriorities: true }),
    () => ({ settType: 'custom', population: pick([1, 2, 15, 999999]) }),
    () => ({ settType: 'metropolis', magicExists: false, priorityMagic: 0 }),
    () => ({ settType: 'thorp', terrainOverride: 'desert', magicExists: true, priorityMagic: 95 }),
    () => ({ settType: pick(TIER_ORDER), culture: 'germanic', terrainOverride: 'isolated' }),
    () => ({ settType: 'village', population: 0 }),
  ];
  return { ...pick(variants)(), _bucket: 'edge' };
}

// ── per-settlement invariants ───────────────────────────────────────────────
// Returns array of anomaly codes (high-signal; severity in REPORT map below).
function checkInvariants(s, cfg) {
  const a = [];
  if (!s || typeof s !== 'object') { a.push('NULL_OUTPUT'); return a; }
  if (!s.name) a.push('MISSING_NAME');
  if (!s.tier || !TIER_ORDER.includes(s.tier)) a.push('BAD_TIER');
  if (!Number.isFinite(s.population) || s.population < 1) a.push('BAD_POPULATION');
  if (!Array.isArray(s.institutions) || s.institutions.length === 0) a.push('NO_INSTITUTIONS');
  // Population must sit in the tier's real range — EXCEPT custom-population/edge
  // configs, which set population directly and are legitimately out-of-tier (we
  // test those for graceful handling, not range conformance).
  const band = POPULATION_RANGES[s.tier];
  const customPop = cfg.population != null || cfg.settType === 'custom';
  if (band && !customPop && Number.isFinite(s.population) && (s.population < band.min || s.population > band.max)) a.push('POP_OUT_OF_BAND');
  // faction power should sum ≈100 (town+ have factions)
  const facs = s.powerStructure?.factions || s.factions || [];
  if (Array.isArray(facs) && facs.length) {
    const sum = facs.reduce((t, f) => t + (Number(f.power) || 0), 0);
    if (sum < 90 || sum > 110) a.push('FACTION_SUM_OFF');
  }
  const townPlus = ['town', 'city', 'metropolis'].includes(s.tier);
  if (townPlus && (!facs || facs.length === 0)) a.push('TOWNPLUS_NO_FACTIONS');
  if (townPlus && (!Array.isArray(s.npcs) || s.npcs.length === 0)) a.push('TOWNPLUS_NO_NPCS');
  // structural validator's own output. Exclude deliberate by-design overrides AND
  // severity:'warning' entries (those are INTENDED DM-facing tension flags, e.g.
  // survival_crisis on an unfortified frontier town — the validator working, not a
  // generation failure). Only error/critical-severity violations are real anomalies.
  const sv = Array.isArray(s.structuralViolations) ? s.structuralViolations : [];
  const realSv = sv.filter(v => v && !(v.byDesign || v.by_design || v.deliberate) && String(v.severity) !== 'warning');
  if (realSv.length) a.push('STRUCTURAL_VIOLATION');
  // conditions must carry a cause
  for (const c of (s.activeConditions || [])) {
    if (!c || !Array.isArray(c.causes) || c.causes.length === 0) { a.push('CONDITION_NO_CAUSE'); break; }
  }
  // duplicate npc ids
  const ids = (s.npcs || []).map(n => n?.id).filter(Boolean);
  if (new Set(ids).size !== ids.length) a.push('DUP_NPC_ID');
  return a;
}

// ── metrics capture (incremental) ───────────────────────────────────────────
function inc(map, key) { map[key] = (map[key] || 0) + 1; }
function pushStat(arr, v) { if (Number.isFinite(v)) arr.push(v); }

const agg = {
  meta: { count: 0, throws: 0, harnessSeed: HARNESS_SEED, shard: `${shardI}/${shardN}`, startedTier: null },
  byBucket: {}, byTier: {},
  anomalies: {},                 // code -> count
  // distributions
  instCount: {},                 // tier -> [counts]
  facCount: {}, npcCount: {}, condCount: {},
  instCategories: {},            // category -> count
  facArchetypes: {},             // faction archetype -> count
  condArchetypes: {}, condSeverityBand: {},
  stressorTypes: {},
  corruptNpc: { corrupt: 0, total: 0 },
  legitimacy: [],                // numeric publicLegitimacy.score where present
  legitimacyBand: {},            // publicLegitimacy.label distribution
  stability: {},
  hookCount: {},                 // tier -> [plotHook totals]
  govTypes: {},
  failures: [],                  // capped sample of {config, seed, anomalies}
};
for (const t of TIER_ORDER) { agg.instCount[t] = []; agg.facCount[t] = []; agg.npcCount[t] = []; agg.condCount[t] = []; agg.hookCount[t] = []; }

function capture(s, cfg, seed, anomalies) {
  const tier = s?.tier || 'unknown';
  inc(agg.byTier, tier);
  inc(agg.byBucket, cfg._bucket || 'stratified');
  for (const code of anomalies) inc(agg.anomalies, code);
  if (anomalies.length && agg.failures.length < 300) agg.failures.push({ config: cfg, seed, anomalies });
  if (!s || typeof s !== 'object') return;
  if (agg.instCount[tier]) pushStat(agg.instCount[tier], (s.institutions || []).length);
  const facs = s.powerStructure?.factions || s.factions || [];
  if (agg.facCount[tier]) pushStat(agg.facCount[tier], facs.length);
  if (agg.npcCount[tier]) pushStat(agg.npcCount[tier], (s.npcs || []).length);
  if (agg.condCount[tier]) pushStat(agg.condCount[tier], (s.activeConditions || []).length);
  for (const inst of (s.institutions || [])) inc(agg.instCategories, inst.category || inst.priorityCategory || 'unknown');
  for (const f of facs) inc(agg.facArchetypes, f.category || f.faction || 'unknown');
  for (const c of (s.activeConditions || [])) { inc(agg.condArchetypes, c.archetype || 'unknown'); inc(agg.condSeverityBand, c.severityBand || 'unknown'); }
  const stressorType = s.stressors?.type || s.stress?.type;
  if (stressorType) inc(agg.stressorTypes, stressorType); else inc(agg.stressorTypes, '(none)');
  const npcs = s.npcs || [];
  agg.corruptNpc.total += npcs.length;
  agg.corruptNpc.corrupt += npcs.filter(n => n?.corrupt).length;
  let hooks = 0; for (const n of npcs) hooks += Array.isArray(n?.plotHooks) ? n.plotHooks.length : 0;
  if (agg.hookCount[tier]) pushStat(agg.hookCount[tier], hooks);
  const legit = s.powerStructure?.publicLegitimacy;
  if (legit && Number.isFinite(legit.score)) agg.legitimacy.push(legit.score);
  if (legit?.label) inc(agg.legitimacyBand, legit.label);
  inc(agg.stability, s.powerStructure?.stability || 'unknown');
  inc(agg.govTypes, s.powerStructure?.government || 'unknown');
}

// ── main loop ───────────────────────────────────────────────────────────────
let i = 0;
for (let n = 0; n < COUNT; n++) {
  // shard filter
  if (shardN > 1 && (n % shardN) !== shardI) continue;
  const cfg = makeConfig(n);
  const seed = `audit-h${HARNESS_SEED}-${n}`;
  agg.meta.count++;
  try {
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    const anomalies = checkInvariants(s, cfg);
    capture(s, cfg, seed, anomalies);
  } catch (e) {
    agg.meta.throws++;
    inc(agg.anomalies, 'THROW');
    if (agg.failures.length < 300) agg.failures.push({ config: cfg, seed, anomalies: ['THROW'], error: String(e?.message || e).slice(0, 300) });
  }
  i++;
  if (i % 1000 === 0) process.stderr.write(`  …${i} generated\n`);
}

// summarize numeric arrays → {n,min,p50,mean,max}
function summ(arr) {
  if (!arr.length) return { n: 0 };
  const s = arr.slice().sort((a, b) => a - b);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return { n: arr.length, min: s[0], p50: s[Math.floor(s.length / 2)], mean: Math.round(mean * 100) / 100, max: s[s.length - 1] };
}
const out = {
  meta: agg.meta, byBucket: agg.byBucket, byTier: agg.byTier, anomalies: agg.anomalies,
  instCount: Object.fromEntries(TIER_ORDER.map(t => [t, summ(agg.instCount[t])])),
  facCount: Object.fromEntries(TIER_ORDER.map(t => [t, summ(agg.facCount[t])])),
  npcCount: Object.fromEntries(TIER_ORDER.map(t => [t, summ(agg.npcCount[t])])),
  condCount: Object.fromEntries(TIER_ORDER.map(t => [t, summ(agg.condCount[t])])),
  hookCount: Object.fromEntries(TIER_ORDER.map(t => [t, summ(agg.hookCount[t])])),
  instCategories: agg.instCategories, facArchetypes: agg.facArchetypes,
  condArchetypes: agg.condArchetypes, condSeverityBand: agg.condSeverityBand,
  stressorTypes: agg.stressorTypes, stability: agg.stability, govTypes: agg.govTypes,
  corruptNpcRate: agg.corruptNpc.total ? Math.round(agg.corruptNpc.corrupt / agg.corruptNpc.total * 1000) / 1000 : 0,
  legitimacy: summ(agg.legitimacy), legitimacyBand: agg.legitimacyBand,
  failures: agg.failures,
};
writeFileSync(OUT, JSON.stringify(out, null, 2));
process.stderr.write(`DONE: ${agg.meta.count} generated, ${agg.meta.throws} throws, ${Object.values(agg.anomalies).reduce((a,b)=>a+b,0)} anomaly-hits → ${OUT}\n`);
