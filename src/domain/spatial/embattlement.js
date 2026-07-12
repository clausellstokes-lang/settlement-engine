/**
 * embattlement.js — Phase 5.5 mover wave M1: EMBATTLEMENT ROUTING.
 *
 * Embattlement is the design's UNIFYING region state (§6/§9): "a region's
 * embattled level IS its routes' danger term." This module makes it a first-class
 * CONTINUOUS region scalar — NOT a boolean flag — persisted in a new
 * conditionally-materialized worldState ledger:
 *
 *   worldState.embattlement = { [settlementId]:
 *     { level, phase, sinceTick, lastTick } }
 *
 *   • level    — the 0..1 CONTINUOUS danger scalar. THIS is what every consumer
 *                reads (routing re-score, banditry). A graded cost, never a gate.
 *   • phase    — the INTERNAL hysteresis latch ('calm' | 'embattled'). It shapes
 *                how `level` evolves (ramp toward the threat vs decay toward 0);
 *                NO consumer ever reads it. It exists only so the scalar can't
 *                flip-flop tick-to-tick (§II.3-3).
 *   • sinceTick — the tick the current phase began (the dwell clock).
 *   • lastTick  — the tick this record last advanced.
 *
 * THE RAMP (§6): the instantaneous threat T(0..1) a settlement is under, a
 * weighted sum of OCCUPATION + active SIEGE + war_exhaustion (the pyrrhic-war
 * aftermath) + high CRIME, MINUS a bounded SECURITY counterforce (the W-C3
 * institutional machinery; falling crime graduates a region back out as its
 * ramp term decays). The RAW READS of those ledgers live at the kernel call
 * site (worldPulse land, where occupations/warExhaustion/warFronts/pressures are
 * already in hand); this module takes the already-read primitives and owns the
 * pure COMBINATION formula (`rampThreat`) — so it stays a pure spatial leaf with
 * no worldPulse imports.
 *
 * HYSTERESIS — the co-built brake (§II.3-3, "enter>X, exit<Y, min dwell + a
 * continuous decaying scalar so it can't flip-flop"):
 *   calm → embattled   when T > ENTER_THRESHOLD (X)
 *   embattled → calm   when T < EXIT_THRESHOLD (Y < X) AND it has dwelled at
 *                      least MIN_DWELL_TICKS in the embattled phase.
 * The [Y, X] deadband + the exit dwell are the whole anti-flip-flop guarantee: a
 * threat oscillating inside the deadband never changes phase, and a real siege
 * that briefly dips does not instantly "un-embattle." While embattled the level
 * RAMPS toward the current threat; while calm it DECAYS toward 0 (the graduation).
 *
 * ROUTING = CHEAP vs SAFE (§6): a mover re-scores the k cached candidate routes
 * for an O-D pair against the current embattlement field, weighting danger by its
 * own RISK TOLERANCE (the W0 settlementAlignment rust/fidelity read: lawful/
 * seasoned reads danger true; chaotic/rusty under-weights it and takes the cheap
 * dangerous road). The candidate routes are a pure function of the FROZEN digest
 * (geometry never changes), derived + memoized once via distanceRead.candidateRoutes
 * (§II.4 "k-shortest cached at canonize") — per tick we only RE-SCORE them, never
 * re-pathfind.
 *
 * TRADE through embattled routes: a seeded, SPORADIC, BOUNDED, non-catastrophic
 * banditry loss on channel strength (`banditryLoss`), forked from a stable
 * composite key at the call site. v1 lands the mechanism + its determinism/
 * boundedness proof; real shipments ride it in M2 (caravans).
 *
 * DORMANCY (constitutional): the ledger is materialized ONLY under the
 * spatialCanonVersion marker AND only for settlements actually under threat
 * (sparse) — a peaceful or aspatial world carries no `embattlement` key and stays
 * byte-identical. The advance is a no-op off the marker.
 *
 * PURE + lazy: no Date, no Math.random, no mutation, no tier/auth. A spatial leaf
 * (the lazy engine chunk) — zero first-paint bytes; imported by the pulse kernel
 * (the advance) and the movers (the re-score / banditry), never a first-paint
 * module.
 */

import { candidateRoutes, calibration } from './distanceRead.js';

// ── Tuning (documented here; retuned in the M1 + checkpoint soaks) ────────────
export const EMBATTLEMENT_TUNING = Object.freeze({
  // Hysteresis (§II.3-3). ENTER > EXIT is the deadband; a threat oscillating
  // inside [EXIT, ENTER] never flips the phase. MIN_DWELL_TICKS is the exit-side
  // dwell (≈6 weeks at one-week ticks) — a latched region can't un-embattle on a
  // single quiet tick.
  ENTER_THRESHOLD: 0.55,
  EXIT_THRESHOLD: 0.3,
  MIN_DWELL_TICKS: 6,
  // The continuous scalar's dynamics. While embattled it approaches the current
  // threat at RAMP_RATE; while calm it decays toward 0 at RELAX_RATE (slower, so a
  // region "graduates" back out over weeks as its ramp inputs fade). Below
  // MIN_LEVEL a calm, threat-free record is pruned (the ledger stays sparse).
  RAMP_RATE: 0.34,
  RELAX_RATE: 0.12,
  MIN_LEVEL: 0.02,
  // Ramp weights (the §6 inputs). Siege + occupation are the ACUTE drivers (either
  // alone clears ENTER even against maximal security); war_exhaustion + high crime
  // SUSTAIN an already-embattled region without initiating one alone.
  W_SIEGE: 0.85,
  W_OCC: 0.75,
  W_EXH: 0.45,
  W_CRIME: 0.3,
  // Security counterforce (institutional order): subtracts from the ramp, but
  // CAPPED at SECURITY_MAX_RELIEF so a garrison can never nullify an active siege
  // (you don't garrison your way out of an occupation) — it graduates a
  // crime/disorder-driven region, not a besieged one.
  W_SEC: 0.4,
  SECURITY_MAX_RELIEF: 0.25,
  // Only crime ABOVE this floor counts as a ramp input ("high crime", §6).
  CRIME_FLOOR: 0.5,
  // Routing re-score: a unit of embattlement on a hop costs DANGER_PENALTY ×
  // (the median primary-hop cost) × the mover's risk tolerance — so a fully
  // embattled intermediary reads as ~1.5 extra hops to a danger-reading mover,
  // enough to make a one-hop-longer safe detour win.
  DANGER_PENALTY: 1.5,
  // Risk tolerance floor: even a chaotic/rusty mover weights danger a little; a
  // lawful/seasoned mover reads it near-full. tolerance = RISK_FLOOR + (1-floor)·law.
  RISK_FLOOR: 0.2,
  // Banditry (v1: on channel strength; shipments in M2). Sporadic (fires with
  // probability ≤ danger·BANDITRY_CHANCE), bounded (loss ≤ BANDITRY_MAX_LOSS —
  // non-catastrophic: a shipment through a war zone is nicked, never annihilated).
  BANDITRY_CHANCE: 0.25,
  BANDITRY_MIN_LOSS: 0.04,
  BANDITRY_MAX_LOSS: 0.2,
});

// The occupation STATE → ramp term (0..1). Mirrors occupation.js's ladder: a
// freshly-contested conquest is maximally embattled; a settled vassal barely so.
export const OCCUPATION_TERM = Object.freeze({
  contested: 1, unstable: 0.85, extractive: 0.5, stabilized: 0.3, vassalized: 0.15,
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

/** The occupation-state ramp term (0 for none / an unknown / a liberated state).
 *  @param {string|null|undefined} state @returns {number} */
export function occupationTermOf(state) {
  const t = /** @type {Record<string, number>} */ (OCCUPATION_TERM)[String(state)];
  return Number.isFinite(t) ? t : 0;
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * Embattlement is LIVE iff the spatial-canon marker is present. It is a PHYSICAL
 * region state (unlike the belief layer it is NOT info-mode gated). Absent ⇒ the
 * advance is a no-op and no `embattlement` key is ever materialized (byte-exact).
 * @param {{ spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function embattlementActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  return Number.isInteger(marker) && Number(marker) > 0;
}

// ── The ramp (pure combination of the already-read inputs) ────────────────────
/**
 * The instantaneous threat T(0..1) a settlement is under this tick — the ramp
 * inputs minus the (bounded) security counterforce. Pure; the caller supplies the
 * primitives read from the worldPulse ledgers (occupation state, siege flag,
 * war_exhaustion scar, crime pressure, security level).
 * @param {{ occupationState?: string|null, besieged?: boolean,
 *   warExhaustion01?: number, crime01?: number, security01?: number }} [inputs]
 * @returns {number} T in [0, 1]
 */
export function rampThreat(inputs = {}) {
  const T = EMBATTLEMENT_TUNING;
  const siegeTerm = inputs.besieged ? 1 : 0;
  const occTerm = occupationTermOf(inputs.occupationState);
  const exh = clamp01(finiteNumber(inputs.warExhaustion01, 0));
  const crime = clamp01(finiteNumber(inputs.crime01, 0));
  const highCrime = crime <= T.CRIME_FLOOR ? 0 : (crime - T.CRIME_FLOOR) / (1 - T.CRIME_FLOOR);
  const sec = clamp01(finiteNumber(inputs.security01, 0));
  const ramp = T.W_SIEGE * siegeTerm + T.W_OCC * occTerm + T.W_EXH * exh + T.W_CRIME * highCrime;
  const relief = Math.min(T.SECURITY_MAX_RELIEF, T.W_SEC * sec);
  return clamp01(ramp - relief);
}

// ── The scalar + hysteresis step (the co-built brake, one settlement) ─────────
/**
 * @typedef {Object} EmbattlementRecord
 * @property {number} level       0..1 CONTINUOUS danger scalar (the consumer read)
 * @property {'calm'|'embattled'} phase  INTERNAL hysteresis latch (never consumer-read)
 * @property {number} sinceTick   tick the current phase began (the dwell clock)
 * @property {number} lastTick    tick this record last advanced
 */

/**
 * Advance ONE settlement's embattlement record given the current threat. The
 * hysteresis latch (`phase`) governs whether `level` ramps toward the threat or
 * decays toward 0; `level` is the graded scalar consumers read. Returns null when
 * a calm, negligible, threat-free record should be pruned (keeps the ledger sparse).
 * @param {EmbattlementRecord|null} prior
 * @param {number} rawThreat   T in [0, 1]
 * @param {number} now         the current tick
 * @returns {EmbattlementRecord|null}
 */
export function stepEmbattlement(prior, rawThreat, now) {
  const T = EMBATTLEMENT_TUNING;
  const rawT = clamp01(finiteNumber(rawThreat, 0));
  const priorLevel = prior ? clamp01(finiteNumber(prior.level, 0)) : 0;
  const priorPhase = prior && prior.phase === 'embattled' ? 'embattled' : 'calm';
  const priorSince = prior ? Math.floor(finiteNumber(prior.sinceTick, now)) : now;

  // ── Hysteresis phase transition (enter > X, exit < Y, min dwell). ───────────
  /** @type {'calm'|'embattled'} */
  let phase = priorPhase;
  let sinceTick = priorSince;
  if (priorPhase === 'calm') {
    if (rawT > T.ENTER_THRESHOLD) { phase = 'embattled'; sinceTick = now; }
  } else if (rawT < T.EXIT_THRESHOLD && (now - priorSince) >= T.MIN_DWELL_TICKS) {
    phase = 'calm'; sinceTick = now;
  }

  // ── The continuous scalar: ramp toward the threat, or decay toward 0. ───────
  const level = clamp01(phase === 'embattled'
    ? priorLevel + T.RAMP_RATE * (rawT - priorLevel)
    : priorLevel * (1 - T.RELAX_RATE));

  // Prune a spent, calm, threat-free record so the conditional ledger stays sparse.
  if (phase === 'calm' && level < T.MIN_LEVEL && rawT < T.MIN_LEVEL) return null;
  return { level: round4(level), phase, sinceTick, lastTick: now };
}

// ── The advance (one pure step per pulse tick) ────────────────────────────────
/** @param {Record<string, unknown>|null} ledger @param {string} id @returns {EmbattlementRecord|null} */
function recordOf(ledger, id) {
  const rec = ledger ? ledger[String(id)] : null;
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {EmbattlementRecord} */ (rec) : null;
}

/**
 * Advance the embattlement ledger one tick. DORMANT (no spatial marker) ⇒
 * { next: prior, changed: false } — zero work, an existing ledger PRESERVED
 * untouched. Otherwise per settlement (the prior ledger ∪ the settlements with a
 * fresh threat, codepoint-sorted): step the scalar + hysteresis; drop the pruned.
 * Pure + deterministic.
 * @param {Object} args
 * @param {Record<string, number>|null|undefined} args.threats  settlementId → threat T(0..1)
 * @param {{ embattlement?: unknown, spatialCanonVersion?: unknown }} args.worldState
 * @param {number} args.tick
 * @returns {{ next: Record<string, EmbattlementRecord>|null, changed: boolean }}
 */
export function advanceEmbattlement({ threats, worldState, tick }) {
  const prior = worldState && typeof worldState === 'object' && 'embattlement' in worldState
    ? /** @type {Record<string, EmbattlementRecord>} */ (asObject(worldState.embattlement))
    : null;
  if (!embattlementActive(worldState)) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const threatMap = asObject(threats);
  const ids = new Set([...Object.keys(prior || {}), ...Object.keys(threatMap)].map(String));
  /** @type {Record<string, EmbattlementRecord>} */
  const next = {};
  for (const id of [...ids].sort()) {
    const record = stepEmbattlement(recordOf(prior, id), finiteNumber(threatMap[id], 0), now);
    if (record) next[id] = record;
  }
  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed };
}

// ── The scalar READ (the graded cost; never a boolean) ────────────────────────
/**
 * A settlement's current embattlement LEVEL (0..1), or 0 when absent/dormant. The
 * ONE read every consumer uses — always a graded scalar, never compared to a
 * threshold to gate behavior.
 * @param {{ embattlement?: unknown }|null|undefined} worldState @param {string|number} id
 * @returns {number}
 */
export function embattlementLevel(worldState, id) {
  const rec = recordOf(asObject(worldState?.embattlement), String(id));
  return rec ? clamp01(finiteNumber(rec.level, 0)) : 0;
}

// ── Risk tolerance (the W0 settlementAlignment rust/fidelity read) ────────────
/**
 * A mover's danger-reading fidelity in [RISK_FLOOR, 1], derived from its
 * settlementAlignment: lawful/seasoned (lawfulness01 → 1) reads danger true;
 * chaotic/rusty (→ 0) under-weights it and runs the cheap dangerous road. The
 * caller passes the settlementAlignment() output (no heavy import here).
 * @param {{ lawfulness01?: number }|null|undefined} alignment
 * @returns {number}
 */
export function riskToleranceFromAlignment(alignment) {
  const T = EMBATTLEMENT_TUNING;
  const law = clamp01(finiteNumber(alignment?.lawfulness01, 0.5));
  return clamp01(T.RISK_FLOOR + (1 - T.RISK_FLOOR) * law);
}

// ── Cheap-vs-safe routing: RE-SCORE the cached candidates (never re-pathfind) ─
/**
 * @typedef {Object} ScoredRoute
 * @property {string[]} path        the settlement-id route (from → … → to)
 * @property {number} baseCost      the frozen geometric cost (distanceRead)
 * @property {number} danger        Σ embattlement level over the traversed hops
 * @property {number} dangerCost    the risk-weighted danger surcharge (cost units)
 * @property {number} effectiveCost baseCost + dangerCost (what the mover minimizes)
 */

/**
 * Re-score ONE candidate route against the current embattlement field for a mover
 * of the given risk tolerance. Pure; danger is a GRADED read of the level scalar
 * over the traversed hops (path after the origin) — never a boolean gate.
 * @param {string[]} path @param {{ embattlement?: unknown }|null|undefined} worldState
 * @param {number} baseCost @param {number} riskTolerance @param {number} medianHopCost
 * @returns {ScoredRoute}
 */
export function scoreRoute(path, worldState, baseCost, riskTolerance, medianHopCost) {
  const T = EMBATTLEMENT_TUNING;
  const nodes = Array.isArray(path) ? path : [];
  const rt = clamp01(finiteNumber(riskTolerance, 1));
  const m = Math.max(1, finiteNumber(medianHopCost, 1));
  let danger = 0;
  for (let i = 1; i < nodes.length; i++) danger += embattlementLevel(worldState, nodes[i]);
  const dangerCost = rt * T.DANGER_PENALTY * m * danger;
  const base = Math.max(0, finiteNumber(baseCost, 0));
  return {
    path: nodes.slice(),
    baseCost: base,
    danger: round4(danger),
    dangerCost: round4(dangerCost),
    effectiveCost: round4(base + dangerCost),
  };
}

/**
 * Choose the cheapest-vs-safest route for a mover between two settlements: RE-SCORE
 * the k cached candidate routes (a pure function of the frozen digest, derived +
 * memoized once — never re-pathfound) against the live embattlement field, and
 * pick the minimum effective cost (deterministic codepoint tie-break on the path).
 * Returns null when the pair is unreachable / unmapped.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {{ embattlement?: unknown }|null|undefined} worldState
 * @param {string|number} fromId @param {string|number} toId @param {number} riskTolerance
 * @returns {ScoredRoute|null}
 */
export function chooseRoute(digest, worldState, fromId, toId, riskTolerance) {
  const candidates = candidateRoutes(digest, fromId, toId);
  if (!candidates.length) return null;
  const medianHopCost = calibration(digest).medianPrimaryHopCost;
  /** @type {ScoredRoute|null} */
  let best = null;
  for (const cand of candidates) {
    const scored = scoreRoute(cand.path, worldState, cand.cost, riskTolerance, medianHopCost);
    if (!best
      || scored.effectiveCost < best.effectiveCost
      || (scored.effectiveCost === best.effectiveCost && scored.path.join('>') < best.path.join('>'))) {
      best = scored;
    }
  }
  return best;
}

// ── Banditry on trade through embattled routes (v1: channel strength) ─────────
/**
 * A seeded, SPORADIC, BOUNDED banditry loss on a trade channel passing through
 * embattled ground. Fires with probability ≤ dangerLevel·BANDITRY_CHANCE (so most
 * shipments pass); when it fires the loss is bounded by BANDITRY_MAX_LOSS
 * (non-catastrophic). Deterministic given the forked rng (the caller forks a
 * stable composite key, e.g. `banditry:${edgeId}:${tick}`).
 * @param {{ channelStrength?: number, dangerLevel?: number,
 *   rng?: { random: () => number } }} [args]
 * @returns {{ fired: boolean, loss: number, delivered: number }}
 */
export function banditryLoss(args = {}) {
  const T = EMBATTLEMENT_TUNING;
  const strength = Math.max(0, finiteNumber(args.channelStrength, 0));
  const danger = clamp01(finiteNumber(args.dangerLevel, 0));
  const rng = args.rng && typeof args.rng.random === 'function' ? args.rng : null;
  const draw = rng ? clamp01(rng.random()) : 1;
  if (!(danger > 0) || draw >= danger * T.BANDITRY_CHANCE) {
    return { fired: false, loss: 0, delivered: round4(strength) };
  }
  const draw2 = rng ? clamp01(rng.random()) : 0;
  const frac = (T.BANDITRY_MIN_LOSS + draw2 * (T.BANDITRY_MAX_LOSS - T.BANDITRY_MIN_LOSS)) * danger;
  const loss = Math.min(T.BANDITRY_MAX_LOSS, Math.max(0, frac));
  return { fired: true, loss: round4(loss), delivered: round4(strength * (1 - loss)) };
}
