/**
 * spatialConsequenceKernel.js — DOOR 1, THE SPATIAL CONSEQUENCE LAYER (owner ruling
 * #8; the map→engine coupling — the stone shapes events).
 *
 * The urban-fabric layer made the engine shape the stone (engine→map). This layer
 * closes the dialogue: the stone shapes events (map→engine). At generation/canonize
 * time a compact SPATIAL SUBSTRATE (district adjacency + per-district flammability/
 * density + a wall-segment polyline with per-segment strength + gates) is derived
 * from the settlement's ACTIVE town layout — OUTSIDE the engine, in the lazily-loaded
 * canonize body (src/lib/spatialSubstrateDerive.js), honouring the projection law
 * ("the engine NEVER reads the render or the layout model directly") — and stored
 * sidecar spatialLedgers.spatialSubstrate. THIS kernel is a pure engine CONSUMER: it
 * only READS the frozen substrate (via the layout-free spatialSubstrateRead.js) and
 * narrates, behind the virtual spatialConsequenceEnabled flag:
 *   (a) CALAMITY TOLL — the WHERE-not-HOW-MUCH law: a fresh calamity's toll TOTALS
 *       are untouched (the field never changes the total, only the distribution),
 *       but a district-scale intensity field (targets seeded, adjacency×flammability
 *       diffused) shapes WHERE it landed, narrated bucket-neutrally in a chronicle
 *       beat (which quarter bore the worst, which was spared — never a disaster kind).
 *   (b) SIEGE BREACH — a breach picks a wall segment deterministically from segment
 *       strength + attacker approach; the fabric scar gains wallSegmentId/districtId
 *       precision. (This consumer is SEAMED at the war layer + the fabric scar reader,
 *       not here — see deploymentReturn.js + urbanFabricKernel.js — because the breach
 *       is decided where the siege resolves. This kernel only PROVIDES the substrate
 *       they read.)
 *   (c) COVERT DIFFUSION — a freshly-exposed covert corruption's roots run through the
 *       shadow quarters and creep along real district adjacency (leash-bounded)
 *       instead of gripping the whole town uniformly — narrated in a chronicle beat.
 *       The settlement-level corruption MAGNITUDES are untouched (the WHERE swap, not
 *       a HOW-MUCH change), keeping the corruption/info balances intact.
 *
 * FIELDS, NOT ENTITIES: every consumer acts as an intensity FIELD over DISTRICTS —
 * per-building detail is render-side interpretation, never engine state. D5 memory is
 * untouched (district grief is not modelled — state-never-fate).
 *
 * THE DORMANCY GATE (constitutional): behind the VIRTUAL spatialConsequenceEnabled
 * flag (ABSENT from DEFAULT_SIMULATION_RULES — the urbanFabric/npcGrowth precedent).
 * Absent ⇒ an immediate no-op: zero read, zero beat, byte-identical (the spatial-
 * consequence dormancy golden proves it). The canonize body is ALSO flag-gated, so a
 * dark world carries no substrate sidecar at all. The flag is PRE-SIGNED to light at
 * THE ONE REGEN (ruling #8); this lane never lights it.
 *
 * THE SUBSTRATE (bounded compute): a pure projection of the layout, STABLE across
 * ticks — derived once at canonize (re-derived only on a structural-signature change)
 * and cached in the sidecar, so this kernel never pays the layout cost. The consumers
 * read the frozen substrate via the layout-free spatialSubstrateRead.js.
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf carrying NO layout import — imported ONLY
 * from the lazy pulse engine (pulseKernel, at a mover seam). Never from first paint.
 *
 * Pure, deterministic, side-effect-free, rng-free, clock-free. AGGREGATE of durable
 * state → per-town spatial narration; never a named soul's fate.
 *
 * @enforced-by tests/property/spatialConsequenceDormancyGolden.test.js (dormancy
 *   byte-identity + lit anti-vacuity), tests/domain/spatialSubstrate.test.js
 *   (derivation determinism, both-layout-version pins, breach determinism),
 *   tests/domain/spatialConsequenceKernel.test.js (WHERE-not-HOW-MUCH pins).
 */
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { spatialConsequenceActive, substrateOf, diffuseField, peakDistrict, districtOf } from '../spatial/spatialSubstrateRead.js';
import { districtClassOf, advanceNpcGrowthWithFabric } from './urbanFabricKernel.js';
import { compareCodepoint } from '../deterministicSort.js';

/** @typedef {import('../spatial/spatialSubstrateRead.js').SpatialSubstrate} SpatialSubstrate */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── Tuning (JUDGMENT — say "veto") ────────────────────────────────────────────
// THE DIFFUSION LEASH (RECORDED new dial): district adjacency is a NEW spread graph
// with no pre-existing corruption/info dial to reuse without coupling this leaf to
// those modules, so the diffusion carries its own documented leash. Per-hop
// attenuation, bounded 0..1; the field is normalised to a WHERE partition so the
// leash shapes REACH, never magnitude.
const CALAMITY_LEASH = 0.55;   // fire runs a little (adjacency × flammability)
const COVERT_LEASH = 0.5;      // the rot creeps slower through the quarters
const DIFFUSION_HOPS = 2;      // two rings of neighbours — a town-scale reach
// The shadow quarters a freshly-exposed covert corruption first roots in. JUDGMENT.
const COVERT_SEED_CATEGORIES = Object.freeze(['criminal', 'foreign', 'merchant']);

// ── THE ADVANCE ────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} SpatialConsequenceResult
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the spatial-consequence layer one pulse. A PURE READER — it never derives
 * or writes the substrate (that is the canonize body's job) and never mutates
 * worldState; it only reads the frozen substrate + the FRESHEST settlement state and
 * emits chronicle beats. DORMANT (flag absent) ⇒ a complete no-op (no read, no beat,
 * byte-identical). Lit ⇒ narrate consumer (a) — a fresh calamity's WHERE field — and
 * consumer (c) — a fresh covert exposure's district diffusion. Consumer (b) reads the
 * same substrate at the war-layer seam. Deterministic; NO rng. Codepoint-sorted.
 * @param {Object} args
 * @param {{ settlements?: Array<{ id?: (string|number), name?: string, settlement?: Record<string, unknown> }> }} args.snapshot
 * @param {Array<{ saveId?: (string|number), settlement?: Record<string, unknown> }>} [args.settlementUpdates]  the post-apply set (carries THIS tick's fresh calamity)
 * @param {Record<string, unknown>} args.worldState
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {SpatialConsequenceResult}
 */
export function advanceSpatialConsequence({ snapshot, settlementUpdates = [], worldState, tick, now }) {
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No read, no beat. ──
  if (!spatialConsequenceActive(worldState)) {
    return { changed: false, newsEntries: [] };
  }

  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // Read the FRESHEST settlement (post-apply settlementUpdates first, else the
  // snapshot) so a calamity STAMPED THIS tick (it lands in settlementUpdates, not the
  // pre-tick snapshot) is visible to consumer (a).
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u?.saveId), i));
  /** @type {Map<string, Record<string, unknown>>} */
  const snapById = new Map();
  /** @type {Map<string, string>} */
  const nameById = new Map();
  for (const it of items) {
    const sid = String(it?.id ?? '');
    if (sid === '') continue;
    snapById.set(sid, asObject(it.settlement));
    nameById.set(sid, String(it?.name || asObject(it.settlement).name || sid));
  }
  /** @type {Map<string, Record<string, unknown>>} */
  const settlementById = new Map();
  for (const sid of snapById.keys()) {
    const ui = updateIndex.get(sid);
    settlementById.set(sid, ui !== undefined ? asObject(updates[ui]?.settlement) : (snapById.get(sid) || {}));
  }
  const orderedIds = [...settlementById.keys()].sort(compareCodepoint);

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  // (a) CONSUMER (a) — calamity WHERE beat (totals untouched; bucket-neutral prose).
  for (const sid of orderedIds) {
    const s = settlementById.get(sid);
    const sub = substrateOf(worldState, sid);
    if (!s || !sub) continue;
    const fresh = freshCalamityStamps(s, now2);
    if (fresh.length === 0) continue;
    const beat = calamityWhereBeat(sub, fresh, sid, nameById.get(sid) || sid, now2, now);
    if (beat) newsEntries.push(beat);
  }

  // (c) CONSUMER (c) — covert district diffusion beat (magnitudes untouched).
  const exposed = asObject(getSpatialLedger(worldState, 'exposedCorruption'));
  /** @type {Set<string>} the settlements whose covert corruption was exposed THIS tick */
  const freshExposed = new Set();
  for (const key of Object.keys(exposed).sort(compareCodepoint)) {
    if (Math.floor(num(asObject(exposed[key]).tick, -1)) !== now2) continue;
    const corruptedId = String(key).split('>')[0]; // corruptionPairKey = `${corrupted}>${patron}`
    if (corruptedId && settlementById.has(corruptedId)) freshExposed.add(corruptedId);
  }
  for (const sid of [...freshExposed].sort(compareCodepoint)) {
    const sub = substrateOf(worldState, sid);
    if (!sub) continue;
    const beat = covertDiffusionBeat(sub, sid, nameById.get(sid) || sid, now2, now);
    if (beat) newsEntries.push(beat);
  }

  return { changed: newsEntries.length > 0, newsEntries };
}

// ── THE PULSE SEAM — fabric + spatial-consequence composed (ceiling-safe name swap) ──
/**
 * The growth+fabric mover composed with the spatial-consequence READER: fabric first
 * (stone), then the reader over fabric's fully-settled outputs (the fresh calamity
 * stamps + the current worldState), appending its beats. pulseKernel calls THIS in
 * place of advanceNpcGrowthWithFabric (a name swap on the existing import/call — zero
 * new effective lines in the ceiling'd file; the provenanceKernel idiom). The reader
 * mutates NO worldState, so the fabric result's worldState/settlementUpdates pass
 * through untouched; dark ⇒ zero beats ⇒ the fabric result is returned as-is
 * (byte-identical). No cycle: this leaf already imports urbanFabricKernel
 * (districtClassOf); urbanFabricKernel never imports back.
 * @param {Parameters<typeof advanceNpcGrowthWithFabric>[0]} args
 * @returns {import('./urbanFabricKernel.js').UrbanFabricAdvanceResult}
 */
export function advanceNpcGrowthWithFabricAndConsequence(args) {
  const fabric = advanceNpcGrowthWithFabric(args);
  const consequence = advanceSpatialConsequence({
    snapshot: /** @type {Parameters<typeof advanceSpatialConsequence>[0]['snapshot']} */ (/** @type {unknown} */ (args.snapshot)),
    settlementUpdates: /** @type {Parameters<typeof advanceSpatialConsequence>[0]['settlementUpdates']} */ (/** @type {unknown} */ (fabric.settlementUpdates)),
    worldState: fabric.worldState,
    tick: args.tick,
    now: args.now,
  });
  if (!consequence.newsEntries.length) return fabric;
  return {
    settlementUpdates: fabric.settlementUpdates,
    worldState: fabric.worldState,
    changed: fabric.changed || consequence.changed,
    newsEntries: [...fabric.newsEntries, ...consequence.newsEntries],
  };
}

// ── Consumer (a): the calamity WHERE field + beat ─────────────────────────────
/** Fresh calamity stamps minted THIS tick (calamity runs before this mover in the
 *  same advance, so tick === now2 is unambiguously fresh — no cursor needed).
 *  @param {Record<string, unknown>} s @param {number} now2
 *  @returns {Array<{ targets: string[], deaths: number, exodus: number }>} */
function freshCalamityStamps(s, now2) {
  const hist = Array.isArray(s.calamityHistory) ? s.calamityHistory : [];
  /** @type {Array<{ targets: string[], deaths: number, exodus: number }>} */
  const out = [];
  for (const st of hist) {
    const o = asObject(st);
    if (Math.floor(num(o.tick, -1)) !== now2) continue;
    const targets = Array.isArray(o.targets) ? o.targets.filter((t) => typeof t === 'string').map(String) : [];
    out.push({ targets, deaths: Math.max(0, num(o.deaths, 0)), exodus: Math.max(0, num(o.exodus, 0)) });
  }
  return out;
}

/** The WHERE beat: seed the struck districts (targets → category → matching
 *  districts; else the town's flammable stock), diffuse adjacency×flammability, and
 *  name the worst-hit + a spared quarter. NULL when the field is empty (honest-null).
 *  The TOLL (deaths/exodus) is read but NEVER modified — the field is WHERE, not
 *  HOW-MUCH. Bucket-neutral: names district categories, never the disaster kind.
 *  @param {SpatialSubstrate} sub @param {Array<{ targets: string[] }>} stamps
 *  @param {string} sid @param {string} town @param {number} tick @param {string|null} now */
function calamityWhereBeat(sub, stamps, sid, town, tick, now) {
  /** @type {Record<string, number>} */
  const seeds = {};
  const targetCats = new Set();
  for (const st of stamps) for (const t of st.targets) {
    const cat = districtClassOf(t);
    if (cat) targetCats.add(cat);
  }
  for (const dd of sub.d) {
    if (targetCats.size ? targetCats.has(dd.cat) : dd.flam > 0) {
      seeds[dd.id] = targetCats.size ? 1 : dd.flam; // no classifiable targets ⇒ the fire finds the timber
    }
  }
  const field = diffuseField(sub, seeds, { hops: DIFFUSION_HOPS, leash: CALAMITY_LEASH, flammable: true });
  const worstId = peakDistrict(field);
  if (!worstId) return null;
  const worst = districtOf(sub, worstId);
  // The spared quarter: the substrate district with the LOWEST field incidence
  // (untouched = 0), codepoint-stable, distinct from the worst-hit.
  let sparedId = null;
  let sparedV = Infinity;
  for (const dd of sub.d) {
    if (dd.id === worstId) continue;
    const v = num(field[dd.id], 0);
    if (v < sparedV || (v === sparedV && sparedId != null && compareCodepoint(dd.id, sparedId) < 0)) { sparedV = v; sparedId = dd.id; }
  }
  const spared = sparedId ? districtOf(sub, sparedId) : null;
  const worstCat = worst ? worst.cat : 'stricken';
  const sparedClause = spared ? ` the ${spared.cat} quarter was spared the worst of it.` : '';
  return spatialBeat(sid, 'calamity_where', {
    headline: `The calamity fell hardest on ${town}'s ${worstCat} quarter`,
    summary: `The disaster did not fall evenly on ${town}: the ${worstCat} quarter bore the worst of the toll, the harm running along the crowded, timber-close lots;${sparedClause}`,
    reason: 'The spatial substrate distributed the calamity toll by district adjacency and flammability — WHERE the harm fell, never HOW MUCH (the totals are unchanged); the disaster kind is never asserted (bucket-neutral).',
    tag: 'calamity_where',
  }, tick, now);
}

// ── Consumer (c): the covert diffusion field + beat ───────────────────────────
/** The covert diffusion beat: seed the shadow quarters, diffuse along adjacency
 *  (leash-bounded), and name where the rot concentrated + the quarter it crept
 *  toward. NULL when the field is empty (honest-null). Corruption MAGNITUDES are
 *  untouched — this is the WHERE swap, not a HOW-MUCH change.
 *  @param {SpatialSubstrate} sub @param {string} sid @param {string} town
 *  @param {number} tick @param {string|null} now */
function covertDiffusionBeat(sub, sid, town, tick, now) {
  /** @type {Record<string, number>} */
  const seeds = {};
  const shadow = new Set(COVERT_SEED_CATEGORIES);
  for (const dd of sub.d) if (shadow.has(dd.cat)) seeds[dd.id] = 1;
  // No shadow quarter present ⇒ the rot roots in the densest quarter instead.
  if (Object.keys(seeds).length === 0) {
    let dense = null;
    let denseV = -1;
    for (const dd of sub.d) if (dd.den > denseV || (dd.den === denseV && dense && compareCodepoint(dd.id, dense) < 0)) { denseV = dd.den; dense = dd.id; }
    if (dense) seeds[dense] = 1;
  }
  const field = diffuseField(sub, seeds, { hops: DIFFUSION_HOPS, leash: COVERT_LEASH, flammable: false });
  const rootId = peakDistrict(field);
  if (!rootId) return null;
  const root = districtOf(sub, rootId);
  // The quarter it crept toward: the strongest field district that was NOT a seed.
  let creptId = null;
  let creptV = 0;
  for (const dd of sub.d) {
    if (seeds[dd.id]) continue;
    const v = num(field[dd.id], 0);
    if (v > creptV || (v === creptV && creptId != null && compareCodepoint(dd.id, creptId) < 0)) { creptV = v; creptId = dd.id; }
  }
  const crept = creptId ? districtOf(sub, creptId) : null;
  const rootCat = root ? root.cat : 'shadow';
  const creptClause = crept && creptV > 0 ? ` and has crept toward the ${crept.cat} quarter along the adjoining streets.` : ' but has not yet spread beyond it.';
  return spatialBeat(sid, 'covert_diffusion', {
    headline: `The exposed corruption in ${town} runs through the ${rootCat} quarter`,
    summary: `The rot laid bare in ${town} is no town-wide miasma: its roots run through the ${rootCat} quarter${creptClause}`,
    reason: 'The spatial substrate diffused the exposed covert corruption along real district adjacency (leash-bounded) instead of a uniform town-wide spread — a WHERE swap; the settlement-level corruption magnitudes are unchanged.',
    tag: 'covert_diffusion',
  }, tick, now);
}

// ── The spatial-consequence beat (house voice) ────────────────────────────────
/** A spatial-consequence chronicle beat — an AGGREGATE district-scale narration of a
 *  durable outcome (a calamity's reach, a corruption's roots), never a named soul's
 *  fate. @param {string} sid @param {string} slug
 *  @param {{ headline: string, summary: string, reason: string, tag: string }} d
 *  @param {number} tick @param {string|null} now @returns {Record<string, unknown>} */
function spatialBeat(sid, slug, d, tick, now) {
  return {
    id: `wizard_news.${tick}.spatial_consequence.${sid}.${slug}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: 0.3, score: 45,
    headline: d.headline,
    summary: d.summary,
    kind: 'applied', impactKind: 'spatial_consequence', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [],
    sourceEventId: `spatial_consequence.${sid}.${slug}.${tick}`,
    tags: ['world_pulse', 'spatial_consequence', d.tag],
    reasons: [d.reason],
  };
}
