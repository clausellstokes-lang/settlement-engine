/**
 * pestilence.js — Phase 5.5 mover wave M11a: PESTILENCE (the traveling plague).
 *
 * ONE PLAGUE TRUTH (§M11a). There is NO second plague system. The EXISTING
 * `disease_outbreak` stressor is the plague; this module adds only its SPATIAL
 * TRAVEL. The epidemic ledger (nested under `worldState.spatialLedgers.epidemic`,
 * marker-gated, ZERO eager bytes — it rides the FP-R namespace exactly as M1/M2/M4
 * do) tracks a traveling infection FRONT and, at each settlement the front takes
 * hold in, the kernel MATERIALIZES the ordinary `disease_outbreak` stressor (via
 * normalizeStressor, the same rails religiousContest uses to drive the conversion
 * stressor — "we drive that stressor, never a parallel one"). Aspatial / no-marker
 * worlds keep today's plague BYTE-IDENTICALLY; the marker gates only the TRAVEL, and
 * the aspatial one-hop channel spread of `disease_outbreak` is RECONCILED OUT under
 * the marker (M4's origin-loss rule: the spatial front REPLACES the aspatial spread,
 * never both — no double-count) by a gated filter at candidateEvents' lazy call site.
 *
 * This is a PURE SPATIAL LEAF (imports only distanceRead — no worldPulse, no Date, no
 * Math.random, no mutation, no tier/auth). It owns the pure DECISIONS (where the front
 * spreads, where it takes hold, where it clears, the level dynamics, the care law);
 * the kernel adapter (worldPulse/pestilenceKernel.js) supplies the live reads (the
 * seed stressors, the institution roster, the trade/shipment carriers, the trade
 * volume) and applies the decisions (the stressor materialization + the ledger write).
 * Same split as migration.js ⟷ migrationKernel.js.
 *
 * PROPAGATION — plague travels AS INFORMATION travels. From each ACTIVE front node,
 * hop-by-hop along active trade channels + M2 shipment arrivals (the same carriers
 * the rumor net rides), seeded per-edge forks `plague:spread:${edgeId}:${tick}`, at
 * hopWeeks LATENCY (the front lands `incubateUntil = tick + weeks` later). Import
 * pressure scales with inbound volume (ports run hotter — the `hot` carrier flag +
 * the importVolume01 read). Per-tick spread is BOUNDED (SPREAD_CASCADE_CAP new
 * seedings per tick; only nodes ACTIVE BEFORE this tick propagate — no same-tick
 * cascade), the co-built spread brake.
 *
 * ONSET — when an incubating front lands, a seeded draw `plague:onset:${id}:${tick}`
 * scaled by DENSITY/TIER (cities burn hot-and-short) + TRADE VOLUME (busy hubs) MINUS
 * the CARE COUNTERFORCE decides whether the plague takes hold. Fail ⇒ the front
 * fizzles (a brief refractory). Success ⇒ the kernel materializes the stressor.
 *
 * CARE COUNTERFORCE — reads the INSTITUTION ROSTER, never a magic toggle (a no-magic
 * world simply lacks druids/alchemists). Churches (+ derivatives), hospitals/healing
 * houses, druidic institutions, and alchemists each add care with DIMINISHING within-
 * category stacking, combined with DIMINISHING cross-category returns, CAPPED at
 * CARE_MAX_RELIEF (< 1) and floored so onset keeps a sliver (ONSET_FLOOR) — a temple
 * city RESISTS, it is NEVER immune (the SECURITY_MAX_RELIEF pattern). Care suppresses
 * EMERGENCE (onset) here and shortens the epidemic record's active phase (level
 * relaxes faster); the STRESSOR's own recovery stays governed by the existing
 * disease_outbreak counterforce (healing_capacity + healer redundancy) — ONE recovery
 * truth, no double-count.
 *
 * CO-BUILT BRAKES (mandatory, all here): (1) RECOVERY FLOOR — every epidemic record
 * force-recovers after RECOVERY_FLOOR_TICKS active and prunes; NO perma-front. (2) the
 * CARE CAP (CARE_MAX_RELIEF). (3) the per-tick SPREAD BOUND (SPREAD_CASCADE_CAP +
 * no-same-tick-cascade). The underlying stressor's own recovery floor is the existing
 * episodic maxAge + resolutionChance age bonus (unchanged) — NO perma-plague on either.
 *
 * RELIGIOUS INFLUENCE (both directions) rides EXISTING rails: the materialized
 * disease_outbreak stressor feeds religiousContest.crisisDisorder01 (the "crisis calls
 * the faithful home" revival seam) AND the realm-event `gods_abandonment` piety-crisis
 * seam — both automatically, because it IS the existing stressor (ONE PLAGUE TRUTH).
 * This module exposes a bounded, reverting `templePulse01` read for legibility/receipt.
 *
 * ARMIES (read primitive; the mutation is fenced — see pestilenceKernel): plague level
 * is a GRADED hazard scalar (never a boolean) armies read in route/engagement scoring,
 * weighted by W0 risk tolerance — `armyPlagueHazard`.
 */

import { hasSpatialLedger, getSpatialLedger } from './distanceRead.js';

// ── Tuning (documented here; retuned in the M11a + checkpoint soaks) ──────────
export const EPIDEMIC_TUNING = Object.freeze({
  // ONSET — the seeded takes-hold draw at a landed front. base + density + volume −
  // care, clamped to [ONSET_FLOOR, ONSET_CEIL]. The FLOOR keeps a temple city at a
  // sliver of risk (never immune); the CEIL keeps even a filthy port short of certain.
  ONSET_BASE: 0.34,
  W_DENSITY: 0.34, // city (density01→1) burns far hotter than a thorp
  W_TRADE_VOLUME: 0.2, // a busy hub is a tinderbox
  W_IMPORT_PRESSURE: 0.16, // heavy inbound shipment volume — the port premium
  ONSET_FLOOR: 0.04, // a temple city RESISTS, is never immune
  ONSET_CEIL: 0.92, // never a certainty
  // MATERIALIZATION SEVERITY — the front arrives ATTENUATED (like the aspatial spread,
  // stressors.SPREAD_ATTENUATION≈0.72): severity = clamp(source·ATTEN + density·W, floor).
  SEVERITY_ATTENUATION: 0.72,
  W_SEVERITY_DENSITY: 0.25,
  SEVERITY_FLOOR: 0.2,
  // CARE COUNTERFORCE — capped, diminishing. CARE_MAX_RELIEF < 1 (never immune).
  CARE_MAX_RELIEF: 0.6,
  CARE_DIMINISH_WITHIN: 0.55, // within a category: strength = 1 − 0.55^count (2nd healer worth less)
  // Per-category weights (church strongest cultural care lens; alchemist the sharpest
  // technical one). Each chips the remaining care gap (cross-category diminishing).
  CARE_W_CHURCH: 0.5,
  CARE_W_HEALING_HOUSE: 0.7,
  CARE_W_DRUID: 0.55,
  CARE_W_ALCHEMIST: 0.6,
  // PROPAGATION — per-edge seed draw from an ACTIVE node. base × source level, ×HOT for
  // the shipment/port carrier (import pressure). Bounded per tick by the cascade cap.
  SPREAD_BASE: 0.55,
  SPREAD_HOT_MULT: 1.5, // a shipment arrival carries the plague harder than a road rumor
  SPREAD_CASCADE_CAP: 6, // max NEW seedings materialized per tick (the spread bound)
  // LEVEL dynamics — the graded 0..1 intensity scalar (army hazard + religious pulse).
  LEVEL_RAMP: 0.34, // rises while active
  LEVEL_RELAX_BASE: 0.14, // decays while recovering
  LEVEL_RELAX_CARE: 0.3, // + care·this — care shortens survival (faster relax)
  MIN_LEVEL: 0.02, // prune floor
  // LIFECYCLE — the recovery floor + the refractory windows (co-built brakes).
  RECOVERY_FLOOR_TICKS: 26, // force-recover after this many active ticks (NO perma-front)
  REFRACTORY_TICKS: 8, // a FIZZLED front (onset never took hold) resists re-seeding this long
  // POST-CLEARANCE settlement REFRACTORY (FIX #3, the cluster-drain brake). neighboursOf is
  // BIDIRECTIONAL (tradeNeighbours reads both-way edges), so a dense care-poor cluster could
  // re-seed endlessly: a node's front clears + prunes, a still-active neighbour re-seeds it,
  // it re-onsets + re-mints — per-record clearance holds but the SYSTEM never drains. A node
  // that HELD the plague and cleared therefore resists re-seeding + re-onset (its recovering
  // record persists) for this bounded window — comfortably longer than RECOVERY_FLOOR_TICKS so
  // a bounded cluster's re-infection wave outruns its own refractory tail and the ledger drains.
  // Owner-retunable in the checkpoint soak (raise to localize an outbreak harder; never < the
  // recovery floor, or the drain guarantee weakens back toward the level-decay accident).
  CLEARED_REFRACTORY_TICKS: 40,
  // RELIGIOUS INFLUENCE — the bounded temple standing pulse (rises with level, reverts).
  TEMPLE_PULSE_MAX: 0.25,
  // ARMIES — the graded hazard penalty (read primitive; the coupling itself is fenced).
  ARMY_HAZARD_PENALTY: 1.4,
  ARMY_CONTRACT_CHANCE: 0.35,
  ARMY_STRENGTH_IMPAIR_MAX: 0.25,
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * Pestilence TRAVEL is LIVE iff the spatial-canon marker is present. A PHYSICAL region
 * layer (like embattlement, NOT info-mode gated). Absent ⇒ the advance is a no-op, no
 * `epidemic` key is ever materialized, and the aspatial disease spread runs verbatim.
 * @param {{ spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function epidemicActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  return Number.isInteger(marker) && Number(marker) > 0;
}

// ── The care counterforce (the INSTITUTION ROSTER read, never a toggle) ───────
/**
 * The care-institution classifiers. Four categories, each contributing care with
 * DIMINISHING within-category stacking. A no-magic world simply lacks druids/alchemists
 * (the patterns just don't match) — the roster IS the read, there is no magic flag.
 */
export const CARE_PATTERNS = Object.freeze({
  church: /(temple|chapel|shrine|cathedral|church|monaster|friary|abbey|almshouse)/i,
  healingHouse: /(hospital|infirmary|hospice|healer|healing house|sanatorium|leper)/i,
  druid: /(druid|grove|circle of|wardens of|nature shrine)/i,
  alchemist: /(alchem|apothecar|herbalist|apothecary)/i,
});

/**
 * @typedef {Object} CareRoster
 * @property {number} church
 * @property {number} healingHouse
 * @property {number} druid
 * @property {number} alchemist
 */

/**
 * Classify an institution roster into the four care-category counts. Each institution
 * counts for the FIRST category its name matches (a hospital run by monks reads as a
 * healing house, not double-counted). Pure string classification.
 * @param {Array<{ name?: unknown }>|null|undefined} institutions
 * @returns {CareRoster}
 */
export function classifyCareRoster(institutions) {
  const roster = { church: 0, healingHouse: 0, druid: 0, alchemist: 0 };
  const list = Array.isArray(institutions) ? institutions : [];
  for (const inst of list) {
    const name = String((inst && typeof inst === 'object' ? inst.name : '') || '');
    if (!name) continue;
    if (CARE_PATTERNS.healingHouse.test(name)) roster.healingHouse += 1;
    else if (CARE_PATTERNS.alchemist.test(name)) roster.alchemist += 1;
    else if (CARE_PATTERNS.druid.test(name)) roster.druid += 1;
    else if (CARE_PATTERNS.church.test(name)) roster.church += 1;
  }
  return roster;
}

/**
 * The care counterforce in [0, CARE_MAX_RELIEF): each category's within-diminishing
 * strength (1 − DIMINISH^count) chips the REMAINING care gap by its weight (cross-
 * category diminishing returns), scaled by the cap. Because every weight < 1 and every
 * strength < 1, the product is strictly > 0 ⇒ care is strictly < CARE_MAX_RELIEF ⇒
 * strictly < 1 ⇒ a temple city RESISTS, is NEVER immune. Pure.
 * @param {CareRoster} roster
 * @returns {number} 0..CARE_MAX_RELIEF
 */
export function careCapacity(roster) {
  const T = EPIDEMIC_TUNING;
  const r = roster || { church: 0, healingHouse: 0, druid: 0, alchemist: 0 };
  /** @param {number} n @returns {number} */
  const within = (n) => 1 - Math.pow(T.CARE_DIMINISH_WITHIN, Math.max(0, Math.floor(finiteNumber(n, 0))));
  const terms = [
    [T.CARE_W_CHURCH, within(r.church)],
    [T.CARE_W_HEALING_HOUSE, within(r.healingHouse)],
    [T.CARE_W_DRUID, within(r.druid)],
    [T.CARE_W_ALCHEMIST, within(r.alchemist)],
  ];
  let remaining = 1;
  for (const [w, s] of terms) remaining *= 1 - w * s;
  return round4(T.CARE_MAX_RELIEF * (1 - remaining));
}

// ── Onset (the seeded takes-hold pressure minus care) ─────────────────────────
/**
 * The takes-hold probability at a landed front, in [ONSET_FLOOR, ONSET_CEIL]: base +
 * density (cities burn hotter) + trade volume + import pressure (ports hotter) MINUS
 * care. The FLOOR guarantees no immunity; the CEIL no certainty. Pure.
 * @param {{ density01?: number, tradeVolume01?: number, importVolume01?: number, care01?: number }} [args]
 * @returns {number}
 */
export function onsetProbability(args = {}) {
  const T = EPIDEMIC_TUNING;
  const density = clamp01(finiteNumber(args.density01, 0));
  const volume = clamp01(finiteNumber(args.tradeVolume01, 0));
  const importV = clamp01(finiteNumber(args.importVolume01, 0));
  const care = Math.max(0, finiteNumber(args.care01, 0));
  const raw = T.ONSET_BASE + T.W_DENSITY * density + T.W_TRADE_VOLUME * volume + T.W_IMPORT_PRESSURE * importV - care;
  return round4(Math.min(T.ONSET_CEIL, Math.max(T.ONSET_FLOOR, raw)));
}

/**
 * The materialized stressor's arrival severity (attenuated, floored). Pure.
 * @param {{ sourceSeverity?: number, density01?: number }} [args]
 * @returns {number}
 */
export function materializationSeverity(args = {}) {
  const T = EPIDEMIC_TUNING;
  const src = clamp01(finiteNumber(args.sourceSeverity, 0.6));
  const density = clamp01(finiteNumber(args.density01, 0));
  return round4(clamp01(Math.max(T.SEVERITY_FLOOR, T.SEVERITY_ATTENUATION * src + T.W_SEVERITY_DENSITY * density)));
}

// ── The epidemic record + lifecycle ───────────────────────────────────────────
/**
 * @typedef {'incubating'|'active'|'recovering'} EpidemicPhase
 * @typedef {Object} EpidemicRecord
 * @property {EpidemicPhase} phase   incubating (front landed, onset pending) → active
 *   (plague took hold; the stressor is materialized; the node PROPAGATES) → recovering
 *   (stressor cleared or recovery floor hit; level relaxes; refractory; then pruned).
 * @property {number} level          0..1 graded intensity (army hazard + temple pulse)
 * @property {number} arrivedTick    the tick the front reached this node
 * @property {number} incubateUntil  the tick onset resolves (arrivedTick + hopWeeks)
 * @property {number} sinceTick      the tick the current phase began
 * @property {number} lastTick       the tick this record last advanced
 * @property {number} activeSince    the tick the ACTIVE phase began (recovery-floor clock)
 * @property {number} refractoryUntil the tick until which re-seeding is refused (0 when none)
 * @property {string} sourceId       the node the front arrived from ('' for a seed origin)
 */

/** @param {Record<string, unknown>|null} ledger @param {string} id @returns {EpidemicRecord|null} */
function recordOf(ledger, id) {
  const rec = ledger ? ledger[String(id)] : null;
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {EpidemicRecord} */ (rec) : null;
}

/** Normalize a persisted/loose record into a full EpidemicRecord (defensive read).
 *  @param {EpidemicRecord|null} rec @param {number} now @returns {EpidemicRecord|null} */
function normalizeRecord(rec, now) {
  if (!rec) return null;
  const phase = rec.phase === 'active' || rec.phase === 'recovering' ? rec.phase : 'incubating';
  return {
    phase,
    level: clamp01(finiteNumber(rec.level, 0)),
    arrivedTick: Math.floor(finiteNumber(rec.arrivedTick, now)),
    incubateUntil: Math.floor(finiteNumber(rec.incubateUntil, now)),
    sinceTick: Math.floor(finiteNumber(rec.sinceTick, now)),
    lastTick: Math.floor(finiteNumber(rec.lastTick, now)),
    activeSince: Math.floor(finiteNumber(rec.activeSince, now)),
    refractoryUntil: Math.max(0, Math.floor(finiteNumber(rec.refractoryUntil, 0))),
    sourceId: String(rec.sourceId ?? ''),
  };
}

// ── The graded scalar reads (the army hazard + temple pulse; never a boolean) ─
/**
 * A settlement's current plague LEVEL (0..1), or 0 when absent/dormant/incubating. The
 * graded scalar every consumer reads — never compared to a threshold to gate behavior.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string|number} id
 * @returns {number}
 */
export function pestilenceLevel(worldState, id) {
  const rec = recordOf(asObject(getSpatialLedger(worldState, 'epidemic')), String(id));
  return rec && rec.phase !== 'incubating' ? clamp01(finiteNumber(rec.level, 0)) : 0;
}

/**
 * The TEMPORARY religious standing pulse at a settlement (0..TEMPLE_PULSE_MAX) — rises
 * with the active plague level, reverts to 0 on clearance (level→0 ⇒ pulse→0). The
 * bounded legibility read for "the temple's hour"; the actual piety movement rides the
 * existing revival/abandonment seams via the materialized stressor.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string|number} id
 * @returns {number}
 */
export function pestilenceTemplePulse(worldState, id) {
  return round4(EPIDEMIC_TUNING.TEMPLE_PULSE_MAX * pestilenceLevel(worldState, id));
}

/**
 * The GRADED plague hazard a mover reads for a route/engagement touching settlement
 * `id`, weighted by the mover's W0 risk tolerance (a lawful commander reads it true and
 * waits it out; a rash one under-weights it). A scalar surcharge, never a boolean. The
 * read primitive for the (fenced) army coupling.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string|number} id
 * @param {number} riskTolerance
 * @returns {number}
 */
export function armyPlagueHazard(worldState, id, riskTolerance) {
  const rt = clamp01(finiteNumber(riskTolerance, 1));
  return round4(EPIDEMIC_TUNING.ARMY_HAZARD_PENALTY * rt * pestilenceLevel(worldState, id));
}

/**
 * Seeded army CONTRACTION roll at a plagued settlement — deterministic given the forked
 * rng (the caller forks `plague:army:${armyId}:${settlementId}:${tick}`). Returns whether
 * the army contracts and the bounded effective-strength impairment it takes (and, if it
 * contracts, it becomes a VECTOR — the caller seeds the next stop). Pure over the rng.
 * @param {{ level01?: number, rng?: { random: () => number } }} [args]
 * @returns {{ contracted: boolean, impairment: number }}
 */
export function armyContraction(args = {}) {
  const T = EPIDEMIC_TUNING;
  const level = clamp01(finiteNumber(args.level01, 0));
  const rng = args.rng && typeof args.rng.random === 'function' ? args.rng : null;
  if (!(level > 0) || !rng) return { contracted: false, impairment: 0 };
  if (rng.random() >= level * T.ARMY_CONTRACT_CHANCE) return { contracted: false, impairment: 0 };
  const impairment = round4(T.ARMY_STRENGTH_IMPAIR_MAX * level);
  return { contracted: true, impairment };
}

// ── The advance (one pure step per pulse tick) ────────────────────────────────
/**
 * @typedef {Object} PestilenceNeighbour
 * @property {string} to        the target settlement id
 * @property {string} edgeId    the carrier edge id (stable — seeds the spread fork)
 * @property {number} weeks     the hopWeeks latency to the target (≥ 1)
 * @property {boolean} hot       a shipment/port carrier (runs hotter — import pressure)
 */

/**
 * @typedef {Object} PestilenceInputs
 * @property {Record<string, unknown>} worldState  (spatialCanonVersion + spatialLedgers.epidemic)
 * @property {string[]} seedIds  settlements with an ACTIVE disease_outbreak stressor (the seeds)
 * @property {(id: string) => number} seedSeverityOf  the seed stressor's origin severity
 * @property {(id: string) => boolean} stressorActiveAt  is a disease_outbreak stressor still active here?
 * @property {(id: string) => PestilenceNeighbour[]} neighboursOf  the carrier fan-out from a node
 * @property {(id: string) => number} density01Of  the tier/density scalar (0 thorp … 1 metropolis)
 * @property {(id: string) => number} tradeVolume01Of  the trade-throughput scalar
 * @property {(id: string) => number} importVolume01Of  the inbound-volume scalar (port premium)
 * @property {(id: string) => number} care01Of  the care counterforce (careCapacity of the roster)
 * @property {{ fork?: (k: string) => { random: () => number } }|null} rng
 * @property {number} tick
 */

/**
 * @typedef {Object} PestilenceResult
 * @property {Record<string, EpidemicRecord>|null} next  the advanced ledger (null when empty)
 * @property {boolean} changed
 * @property {Array<{ id: string, severity: number, sourceId: string, level: number }>} materializations
 *   settlements where the plague TOOK HOLD this tick (the kernel mints the stressor here)
 * @property {Array<{ id: string }>} clearances  settlements whose front reached recovery this tick
 */

/**
 * Advance the epidemic ledger one tick. DORMANT (no marker) ⇒ { next: prior, changed:false,
 * materializations:[], clearances:[] } — the existing plague is byte-identical. Otherwise,
 * over the union of prior records ∪ seed settlements (codepoint-sorted):
 *   1. SEED — a seed settlement (active disease_outbreak) with no record enters ACTIVE at
 *      its origin (patient zero of the front); its level seeds from the seed severity.
 *   2. PROPAGATE — from each node ACTIVE BEFORE this tick, seed each carrier edge
 *      (`plague:spread:${edgeId}:${tick}`); a hit lands an INCUBATING front at the target
 *      (`incubateUntil = tick + weeks`) unless it is infected/refractory. Bounded by
 *      SPREAD_CASCADE_CAP (codepoint-ordered) — the per-tick spread brake.
 *   3. ONSET — an incubating record whose incubateUntil has come rolls
 *      `plague:onset:${id}:${tick}` vs onsetProbability; success ⇒ ACTIVE + a
 *      materialization; failure ⇒ pruned with a refractory window.
 *   4. LIFECYCLE — an ACTIVE record ramps its level; when its stressor has cleared OR it
 *      has been active ≥ RECOVERY_FLOOR_TICKS it enters RECOVERING (a clearance). A
 *      RECOVERING record relaxes (faster under care) and prunes below MIN_LEVEL, leaving a
 *      refractory window.
 * Pure + deterministic (codepoint-sorted mutation; forks from stable composite keys).
 * @param {PestilenceInputs} inputs
 * @returns {PestilenceResult}
 */
export function advancePestilence(inputs) {
  const T = EPIDEMIC_TUNING;
  const worldState = inputs && inputs.worldState;
  const prior = hasSpatialLedger(worldState, 'epidemic')
    ? /** @type {Record<string, EpidemicRecord>} */ (asObject(getSpatialLedger(worldState, 'epidemic')))
    : null;
  if (!epidemicActive(worldState)) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false, materializations: [], clearances: [] };
  }
  const now = Math.max(0, Math.floor(finiteNumber(inputs.tick, 0)));
  // Bind the fork fn to a definite reference (narrows the optional method for tsc).
  /** @type {((k: string) => { random: () => number }) | null} */
  const forkFn = inputs.rng && typeof inputs.rng.fork === 'function' ? inputs.rng.fork.bind(inputs.rng) : null;
  const seedIds = Array.isArray(inputs.seedIds) ? inputs.seedIds.map(String) : [];
  const seedSet = new Set(seedIds);

  /** @type {Record<string, EpidemicRecord>} */
  const next = {};
  /** @type {Array<{ id: string, severity: number, sourceId: string, level: number }>} */
  const materializations = [];
  /** @type {Array<{ id: string }>} */
  const clearances = [];

  // Carry every prior record forward (normalized) as the working set.
  const ids = new Set([...Object.keys(prior || {}), ...seedIds].map(String));
  /** @type {Map<string, EpidemicRecord>} */
  const work = new Map();
  for (const id of ids) {
    const rec = normalizeRecord(recordOf(prior, id), now);
    if (rec) work.set(id, rec);
  }

  // 1. SEED — a fresh seed with no record is patient zero of the FRONT (already ACTIVE
  //    aspatially; the front simply starts here). It propagates but is not re-materialized.
  for (const id of seedIds) {
    if (work.has(id)) continue;
    work.set(id, {
      phase: 'active', level: clamp01(finiteNumber(inputs.seedSeverityOf(id), 0.5)),
      arrivedTick: now, incubateUntil: now, sinceTick: now, lastTick: now,
      activeSince: now, refractoryUntil: 0, sourceId: '',
    });
  }

  // Snapshot the nodes ACTIVE BEFORE this tick — only these propagate (no same-tick
  // cascade: a node seeded THIS tick does not also spread THIS tick). The spread bound.
  const spreaders = [...work.entries()]
    .filter(([, r]) => r.phase === 'active' && r.lastTick < now)
    .map(([id]) => id)
    .sort();
  // Seed-origin nodes that entered active THIS tick (activeSince === now) still spread —
  // they were active aspatially before; include them but AFTER the cascade order.
  const seedSpreaders = [...work.entries()]
    .filter(([id, r]) => r.phase === 'active' && r.lastTick >= now && seedSet.has(id) && r.sourceId === '')
    .map(([id]) => id)
    .sort();

  // 2. PROPAGATE (bounded). Codepoint-ordered spreaders → codepoint-ordered edges; the
  //    first SPREAD_CASCADE_CAP successful NEW seedings land this tick.
  let seededThisTick = 0;
  for (const sourceId of [...spreaders, ...seedSpreaders]) {
    if (seededThisTick >= T.SPREAD_CASCADE_CAP) break;
    const source = work.get(sourceId);
    if (!source) continue;
    const level = clamp01(finiteNumber(source.level, 0));
    const neighbours = (inputs.neighboursOf(sourceId) || []).slice().sort(
      (a, b) => (String(a.edgeId) < String(b.edgeId) ? -1 : String(a.edgeId) > String(b.edgeId) ? 1 : 0));
    for (const nb of neighbours) {
      if (seededThisTick >= T.SPREAD_CASCADE_CAP) break;
      const to = String(nb.to);
      if (!to || to === sourceId) continue;
      // Skip any node already in the front. A recovering record PERSISTS through its
      // refractory window (it prunes only once now >= refractoryUntil, in the lifecycle
      // below), so a recovered/fizzled town naturally resists re-seeding until it has
      // FULLY cleared — the refractory brake, enforced by that persistence.
      if (work.get(to)) continue;
      const hotMult = nb.hot ? T.SPREAD_HOT_MULT : 1;
      const p = Math.min(0.95, T.SPREAD_BASE * level * hotMult);
      const fork = forkFn ? forkFn(`plague:spread:${nb.edgeId}:${now}`) : null;
      const draw = fork ? clamp01(fork.random()) : 1;
      if (draw >= p) continue;
      const weeks = Math.max(1, Math.floor(finiteNumber(nb.weeks, 1)));
      work.set(to, {
        phase: 'incubating', level: 0,
        arrivedTick: now, incubateUntil: now + weeks, sinceTick: now, lastTick: now,
        activeSince: now, refractoryUntil: 0, sourceId,
      });
      seededThisTick += 1;
    }
  }

  // 3 + 4. ONSET + LIFECYCLE over the working set (codepoint-sorted).
  for (const id of [...work.keys()].sort()) {
    const rec = work.get(id);
    if (!rec) continue;

    // 3. ONSET — an incubating front that has landed rolls takes-hold vs care.
    if (rec.phase === 'incubating') {
      if (now < rec.incubateUntil) { next[id] = { ...rec, lastTick: now }; continue; }
      const p = onsetProbability({
        density01: inputs.density01Of(id), tradeVolume01: inputs.tradeVolume01Of(id),
        importVolume01: inputs.importVolume01Of(id), care01: inputs.care01Of(id),
      });
      const fork = forkFn ? forkFn(`plague:onset:${id}:${now}`) : null;
      const draw = fork ? clamp01(fork.random()) : 1;
      if (draw >= p) {
        // The front fizzled — a brief refractory, then it is gone (pruned).
        next[id] = {
          phase: 'recovering', level: 0, arrivedTick: rec.arrivedTick, incubateUntil: rec.incubateUntil,
          sinceTick: now, lastTick: now, activeSince: now,
          refractoryUntil: now + T.REFRACTORY_TICKS, sourceId: rec.sourceId,
        };
        continue;
      }
      // Took hold — the stressor materializes (attenuated arrival severity).
      const severity = materializationSeverity({
        sourceSeverity: inputs.seedSeverityOf(rec.sourceId), density01: inputs.density01Of(id),
      });
      const level = clamp01(0.3 + 0.4 * clamp01(inputs.density01Of(id)));
      next[id] = {
        phase: 'active', level: round4(level), arrivedTick: rec.arrivedTick, incubateUntil: rec.incubateUntil,
        sinceTick: now, lastTick: now, activeSince: now, refractoryUntil: 0, sourceId: rec.sourceId,
      };
      materializations.push({ id, severity, sourceId: rec.sourceId, level: round4(level) });
      continue;
    }

    // 4. LIFECYCLE.
    if (rec.phase === 'active') {
      const stressorGone = !inputs.stressorActiveAt(id);
      const floorHit = (now - rec.activeSince) >= T.RECOVERY_FLOOR_TICKS;
      if (stressorGone || floorHit) {
        // Enter recovery (the RECOVERY FLOOR brake fires here at the latest). Stamp the LONGER
        // post-clearance settlement refractory (FIX #3): a node that HELD the plague resists
        // re-seeding/re-onset for CLEARED_REFRACTORY_TICKS — its recovering record persists that
        // whole window (the prune below waits on refractoryUntil), so a bidirectional neighbour
        // cannot immediately re-seed it and the cluster's re-infection loop drains. (The FIZZLE
        // path above never took hold, so it keeps the SHORT REFRACTORY_TICKS.)
        next[id] = { ...rec, phase: 'recovering', sinceTick: now, lastTick: now, refractoryUntil: now + T.CLEARED_REFRACTORY_TICKS };
        clearances.push({ id });
        continue;
      }
      const level = clamp01(rec.level + T.LEVEL_RAMP * (1 - rec.level));
      next[id] = { ...rec, level: round4(level), lastTick: now };
      continue;
    }

    // recovering — relax (faster under care), prune when spent AND past the refractory window.
    // ⚠️ ARMY-VECTOR CONSUMER NOTE (armyPlagueHazard, when wired): the level relaxes toward ~0
    // here while the settlement may STILL carry an active disease_outbreak stressor (recovery is
    // the FRONT winding down, not the stressor resolving) — so a level-only read would call a
    // still-plagued town SAFE mid-cycle. The army-vector pass must OR the graded level with the
    // stressor's own presence/severity (effectiveStressorSeverity), not gate on level alone.
    const relax = clamp01(T.LEVEL_RELAX_BASE + T.LEVEL_RELAX_CARE * Math.max(0, finiteNumber(inputs.care01Of(id), 0)));
    const level = clamp01(rec.level * (1 - relax));
    // Prune only once BOTH the level is spent AND the post-clearance refractory has elapsed — the
    // refractory (CLEARED_REFRACTORY_TICKS on a real clearance) is the binding term, so the
    // recovering record lingers as the settlement-level cooldown, then clears — NO perma-front.
    if (level < T.MIN_LEVEL && now >= rec.refractoryUntil) continue; // prune (clears — no perma-front)
    next[id] = { ...rec, level: round4(level), lastTick: now };
  }

  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull)
    || materializations.length > 0 || clearances.length > 0;
  return { next: changed ? nextOrNull : prior, changed, materializations, clearances };
}
