/**
 * domain/worldPulse/mobilization.js — Phase B1 WAR-ECONOMY MOBILIZATION POSTURE.
 *
 * A per-settlement posture STATE MACHINE that a settlement must RAMP THROUGH
 * before it can launch a serious siege. A settlement at `peace` cannot deploy an
 * army — it must climb `peace → alert → war_preparation → mobilized` over several
 * ticks first (then `deployed` once a front is actually committed, `war_exhaustion`
 * if the war drags, `demobilizing` and back to `peace` on the way down). The ramp
 * RATE is gated by the settlement's disposition / economy / deity / legitimacy: a
 * warlike, prosperous, legitimate, war-blessed settlement ramps FAST; a pacific,
 * broke, fragile one ramps SLOWLY (or never reaches the top).
 *
 * The posture can COOL / FAIL — economic strain, low legitimacy, a food shortage,
 * a leadership change, or player intervention drops it back toward peace. During
 * PEACE it DRIFTS back toward civilian.
 *
 * War-preparation shifts the settlement toward a WAR ECONOMY: it stamps a
 * `war_mobilization` active-condition (economic priorities → war footing) that the
 * existing war_drain / economic_capacity machinery carries the cost of.
 *
 * DETERMINISM CONTRACT (sacred):
 *   - PURE evolution of the PRE-TICK posture ledger from the PRE-TICK snapshot. No
 *     Date.now / Math.random / argless new Date. The ramp/cool decision is a
 *     DETERMINISTIC classifier (NOT an rng step) — the same settlement state always
 *     produces the same posture transition. (The only rng in the war layer is the
 *     siege roll downstream.)
 *   - Read-last / write-next: reads the pre-tick `worldState.warPosture` value and
 *     the pre-tick snapshot, returns the NEXT-tick ledger. Never an intra-tick
 *     read-after-write.
 *   - Every output iteration is over a CODEPOINT-SORTED settlement-id list — never a
 *     Map/Set/Object insertion order. Reversing the saves array yields the identical
 *     next ledger.
 *   - GATED + byte-neutral when OFF: the caller runs this ONLY inside the
 *     `warLayerEnabled` block, and an empty/absent ledger produces an empty ledger
 *     (no posture key materializes) ⇒ byte-identical for a no-war campaign.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { computeAggressiveness } from './disposition.js';
import { foodLedger } from '../foodLedger.js';
import { clamp01 } from '../region/contestMath.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The posture state machine. Linear ramp up, linear cool down. `deployed` is the
 * only state an army can actually be committed from (warDeployment reads it).
 *
 * @typedef {'peace'|'alert'|'war_preparation'|'mobilized'|'deployed'|'war_exhaustion'|'demobilizing'} PostureState
 */

// The ordered RAMP. Index = readiness rung. peace(0) → alert(1) → war_preparation(2)
// → mobilized(3). `deployed` / `war_exhaustion` / `demobilizing` are off the linear
// rung (entered by the war layer / cool path), handled explicitly below.
const RAMP = Object.freeze(['peace', 'alert', 'war_preparation', 'mobilized']);
const RAMP_INDEX = Object.freeze(
  /** @type {Record<string, number>} */ (RAMP.reduce((acc, s, i) => ({ ...acc, [s]: i }), {})),
);

// The rung at/above which a settlement is "war-ready" — it may open a siege. A
// settlement must reach `mobilized` (the top of the linear ramp) before the
// warDeployment deploy gate will let it commit its army. `deployed` is also ready
// (it already has an army out). This is THE keystone: a `peace` settlement cannot
// siege.
const READY_STATES = new Set(['mobilized', 'deployed']);

// ── Ramp / cool tunables (calibration is load-bearing). ──────────────────────────
// `progress` is a 0..1 accumulator WITHIN the current rung; it crosses 1.0 to step
// up a rung (and resets), or below 0 to step down. The per-tick delta is the base
// rate scaled by a readiness multiplier (disposition / economy / legitimacy / deity).
const RAMP_BASE_RATE = 0.34;       // a neutral settlement crosses a rung in ~3 ticks
const COOL_BASE_RATE = 0.28;       // cooling is a touch slower than ramping
const RAMP_RATE_MIN = 0.12;        // even a reluctant settlement makes SOME progress when pushed
const RAMP_RATE_MAX = 0.85;        // a fervent, prepared settlement can cross a rung in ~1-2 ticks

// The readiness multiplier blends these signals (each centered so a neutral
// settlement multiplies the base rate by ~1.0):
//  - disposition (aggressiveness, centered on 1.0) — a warlike settlement ramps faster.
//  - economy (economic_capacity 0..100) — a settlement that can AFFORD a war economy
//    ramps faster; a broke one stalls.
//  - legitimacy (0..100) — a legitimate government can mobilize its people; a fragile
//    one cannot sustain a war footing.
const DISPOSITION_RAMP_WEIGHT = 0.9;   // (aggr-1) ∈ ~[-0.5,0.5] → ±0.45 on the multiplier
const ECONOMY_RAMP_WEIGHT = 0.5;       // (econ/100 - 0.5) ∈ [-0.5,0.5] → ±0.25
const LEGITIMACY_RAMP_WEIGHT = 0.4;    // (legit/100 - 0.5) → ±0.2

// COOL/FAIL triggers — if ANY holds, the posture cools (progress moves DOWN). These
// are the proposal's "economic strain, low legitimacy, food shortage, leadership
// change, player intervention" list, read off the pre-tick snapshot.
const COOL_ECONOMY_FLOOR = 30;     // economic_capacity below this → can't sustain the war economy
const COOL_LEGITIMACY_FLOOR = 30;  // legitimacy below this → the home front fractures
const COOL_FOOD_MONTHS_FLOOR = 1.5; // less than ~6 weeks of stored food → a war footing is untenable

// `war_mobilization` condition severity by rung (war_preparation onward). The
// existing war_drain / economic_capacity machinery carries the cost; this condition
// is the VISIBLE "this settlement is on a war footing" marker + the economic-priority
// shift. peace/alert carry NO condition (byte-light until the settlement actually
// shifts its economy).
const MOBILIZATION_SEVERITY = Object.freeze({
  war_preparation: 0.32,
  mobilized: 0.5,
  deployed: 0.5,
});

/**
 * @typedef {Object} PostureRecord
 * @property {PostureState} state   the current posture.
 * @property {number} progress      0..1 accumulator within the current rung.
 * @property {number} sinceTick     the tick the current state was entered.
 * @property {boolean} [covert]     true ⇒ preparation is hidden from neighbours (gm-only).
 */

/**
 * Normalize a raw posture record (legacy-safe: an absent/garbage record reads as
 * `peace`). Pure.
 * @param {any} raw
 * @param {number} tick
 * @returns {PostureRecord}
 */
function normalizePosture(raw, tick) {
  const state = typeof raw?.state === 'string' && (RAMP_INDEX[raw.state] != null
    || raw.state === 'deployed' || raw.state === 'war_exhaustion' || raw.state === 'demobilizing')
    ? raw.state
    : 'peace';
  return {
    state: /** @type {PostureState} */ (state),
    progress: Number.isFinite(raw?.progress) ? clamp01(raw.progress) : 0,
    sinceTick: Number.isFinite(raw?.sinceTick) ? raw.sinceTick : tick,
    covert: raw?.covert === true,
  };
}

/**
 * The legitimacy score (0..100) of a settlement item, defaulting to a neutral 50.
 * @param {any} item @returns {number}
 */
function legitimacyOf(item) {
  const s = item?.settlement || item || {};
  const score = s?.powerStructure?.publicLegitimacy?.score;
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 50;
}

/**
 * The live economic_capacity score (0..100) from the snapshot's causal state,
 * defaulting to a neutral 50. This is the Phase-0 homeostasis dial.
 * @param {any} item @returns {number}
 */
function economicCapacityOf(item) {
  const cap = item?.causal?.scores?.economic_capacity;
  return Number.isFinite(cap) ? Math.max(0, Math.min(100, cap)) : 50;
}

/**
 * Months of stored food (logistics) — a war footing needs reserves. Returns a
 * NEUTRAL 3 months when the settlement carries no real food-security profile
 * (`present: false`) — an ABSENT food model is NOT a famine; only a settlement with
 * actual food data showing thin reserves (or a famine condition) counts as a
 * shortage. This keeps a bare/minimal settlement from reading as perpetually
 * starving (which would freeze its posture at peace).
 * @param {any} item @returns {number}
 */
function foodMonthsOf(item) {
  const s = item?.settlement || item || {};
  try {
    const led = foodLedger(s);
    if (!led?.present) return 3; // no food data ⇒ neutral (not a shortage)
    return Number.isFinite(led.storageMonths) ? led.storageMonths : 3;
  } catch {
    return 3;
  }
}

/**
 * The readiness multiplier on the ramp rate for a settlement — how FAST it climbs
 * the war-readiness ramp. Blends disposition (aggressiveness), economy, and
 * legitimacy; centered so a neutral settlement is ~1.0. Clamped to [MIN/BASE,
 * MAX/BASE] indirectly via the rate clamp in `step`. Pure, order-independent.
 *
 * @param {any} item
 * @param {any} worldState   carries dispositionStats (aggressiveness history).
 * @returns {number} a positive multiplier (≈ 0.3 reluctant … ≈ 2.5 fervent).
 */
export function rampReadiness(item, worldState) {
  const aggr = computeAggressiveness(item, worldState); // centered on 1.0
  const economy = economicCapacityOf(item);
  const legit = legitimacyOf(item);
  const drive =
    DISPOSITION_RAMP_WEIGHT * (aggr - 1)
    + ECONOMY_RAMP_WEIGHT * (economy / 100 - 0.5)
    + LEGITIMACY_RAMP_WEIGHT * (legit / 100 - 0.5);
  // A neutral settlement (drive 0) multiplies by 1.0; +0.5 drive → ~1.5×; −0.5 → ~0.5×.
  return Math.max(0.25, 1 + drive);
}

/**
 * Should this settlement's posture COOL (move down the ramp) this tick? True under
 * economic strain, low legitimacy, or a food shortage. (A leadership change / player
 * intervention is surfaced to the caller via the same read — a coup/rebellion
 * condition trips the legitimacy floor; an explicit `forcePeace` intent is honored
 * by the caller before this runs.) Pure read of the pre-tick snapshot.
 *
 * @param {any} item
 * @returns {{ cool: boolean, reasons: string[] }}
 */
export function shouldCool(item) {
  const reasons = [];
  if (economicCapacityOf(item) < COOL_ECONOMY_FLOOR) reasons.push('economic strain — the treasury cannot sustain a war economy');
  if (legitimacyOf(item) < COOL_LEGITIMACY_FLOOR) reasons.push('low legitimacy — the home front will not hold a war footing');
  if (foodMonthsOf(item) < COOL_FOOD_MONTHS_FLOOR) reasons.push('food shortage — a mobilized army cannot be fed');
  return { cool: reasons.length > 0, reasons };
}

/**
 * Whether a settlement at this posture is WAR-READY (may open a siege). The
 * warDeployment deploy gate reads this — a `peace`/`alert`/`war_preparation`
 * settlement CANNOT deploy; it must reach `mobilized` first.
 * @param {PostureState | string | undefined} state
 * @returns {boolean}
 */
export function isWarReady(state) {
  return READY_STATES.has(String(state));
}

/**
 * The `war_mobilization` condition severity for a posture state (0 ⇒ no condition).
 * @param {PostureState | string} state @returns {number}
 */
export function mobilizationSeverity(state) {
  return /** @type {Record<string, number>} */ (MOBILIZATION_SEVERITY)[String(state)] || 0;
}

/**
 * Advance ONE settlement's posture by one tick. A pure, deterministic transition:
 *
 *   - If the war layer wants this settlement DEPLOYED (it has a committed army),
 *     the posture is pinned to `deployed` (or `war_exhaustion` if the home is scarred).
 *   - Else if a COOL trigger holds (strain / fragility / famine), `progress` moves
 *     DOWN at the cool rate (stepping the state down a rung at 0, → `demobilizing`
 *     → `peace`).
 *   - Else `progress` moves UP at the ramp rate × readiness (stepping the state up
 *     a rung at 1.0, capped at `mobilized`).
 *   - At `peace` with no upward pressure, the settlement DRIFTS to civilian (stays
 *     peace, progress decays to 0).
 *
 * @param {Object} args
 * @param {PostureRecord} args.prev          the pre-tick posture.
 * @param {any} args.item                    the pre-tick snapshot item.
 * @param {any} args.worldState              carries dispositionStats.
 * @param {number} args.tick
 * @param {boolean} args.hasArmyDeployed     the war layer reports a committed army.
 * @param {number} args.warExhaustion        the 0..1 scar (pins war_exhaustion when deep).
 * @param {boolean} args.wantsWar            an upward pressure exists (a hostile target /
 *                                           a warlike disposition) — the reason to ramp at all.
 * @param {boolean} [args.forcePeace]        player intervention / explicit stand-down.
 * @returns {{ next: PostureRecord, transitioned: boolean, cooled: boolean, reasons: string[] }}
 */
export function stepPosture({ prev, item, worldState, tick, hasArmyDeployed, warExhaustion, wantsWar, forcePeace = false }) {
  const reasons = [];

  // ── DEPLOYED override: an army in the field pins the posture. A deep war scar
  // surfaces as `war_exhaustion`; otherwise `deployed`. ────────────────────────────
  if (hasArmyDeployed) {
    const state = warExhaustion >= 0.45 ? 'war_exhaustion' : 'deployed';
    const transitioned = prev.state !== state;
    return {
      next: { state: /** @type {PostureState} */ (state), progress: 1, sinceTick: transitioned ? tick : prev.sinceTick, covert: false },
      transitioned,
      cooled: false,
      reasons: [state === 'war_exhaustion' ? 'army committed; the long war has left a lasting scar' : 'army committed in the field'],
    };
  }

  const cool = forcePeace ? { cool: true, reasons: ['player intervention — stand down'] } : shouldCool(item);
  const idx = RAMP_INDEX[prev.state];

  // ── A non-ramp state ('deployed'/'war_exhaustion'/'demobilizing') with no army:
  // route into the cool path. The army came home → begin demobilizing back to peace. ─
  if (idx == null) {
    // From deployed/war_exhaustion/demobilizing → demobilize toward peace.
    const nextProgress = prev.progress - COOL_BASE_RATE;
    if (nextProgress <= 0) {
      const transitioned = prev.state !== 'peace';
      return {
        next: { state: 'peace', progress: 0, sinceTick: transitioned ? tick : prev.sinceTick, covert: false },
        transitioned, cooled: true, reasons: ['the army is home; the settlement returns to a peace footing'],
      };
    }
    const transitioned = prev.state !== 'demobilizing';
    return {
      next: { state: 'demobilizing', progress: clamp01(nextProgress), sinceTick: transitioned ? tick : prev.sinceTick, covert: false },
      transitioned, cooled: true, reasons: ['demobilizing — winding the war economy down'],
    };
  }

  // ── COOL path: strain / fragility / famine / intervention → ramp DOWN. ───────────
  if (cool.cool) {
    reasons.push(...cool.reasons);
    let nextIdx = idx;
    let nextProgress = prev.progress - COOL_BASE_RATE;
    if (nextProgress < 0) {
      nextIdx = Math.max(0, idx - 1);
      nextProgress = nextIdx === idx ? 0 : clamp01(1 + nextProgress); // carry the overflow down a rung
    }
    const nextState = RAMP[nextIdx];
    const transitioned = nextState !== prev.state;
    return {
      next: { state: /** @type {PostureState} */ (nextState), progress: nextProgress, sinceTick: transitioned ? tick : prev.sinceTick, covert: prev.covert && nextIdx >= RAMP_INDEX.war_preparation },
      transitioned, cooled: true, reasons,
    };
  }

  // ── No upward pressure at peace → DRIFT to civilian (progress decays to 0). ───────
  if (!wantsWar && idx === 0) {
    const nextProgress = Math.max(0, prev.progress - COOL_BASE_RATE);
    return {
      next: { state: 'peace', progress: nextProgress, sinceTick: prev.sinceTick, covert: false },
      transitioned: false, cooled: nextProgress < prev.progress, reasons: ['no threat — drifting back to a civilian footing'],
    };
  }

  // ── No upward pressure above peace → also cool back down (the threat passed). ─────
  if (!wantsWar && idx > 0) {
    let nextIdx = idx;
    let nextProgress = prev.progress - COOL_BASE_RATE;
    if (nextProgress < 0) {
      nextIdx = idx - 1;
      nextProgress = clamp01(1 + nextProgress);
    }
    const nextState = RAMP[nextIdx];
    const transitioned = nextState !== prev.state;
    return {
      next: { state: /** @type {PostureState} */ (nextState), progress: nextProgress, sinceTick: transitioned ? tick : prev.sinceTick, covert: prev.covert && nextIdx >= RAMP_INDEX.war_preparation },
      transitioned, cooled: true, reasons: ['the threat eased — winding the war footing down'],
    };
  }

  // ── RAMP UP: wantsWar holds and no cool trigger. progress += base × readiness. ────
  const readiness = rampReadiness(item, worldState);
  const rate = Math.max(RAMP_RATE_MIN, Math.min(RAMP_RATE_MAX, RAMP_BASE_RATE * readiness));
  let nextIdx = idx;
  let nextProgress = prev.progress + rate;
  if (nextProgress >= 1 && idx < RAMP.length - 1) {
    nextIdx = idx + 1;
    nextProgress = nextProgress - 1; // carry the overflow into the next rung
  } else if (nextProgress >= 1) {
    nextProgress = 1; // capped at the top of the linear ramp (mobilized)
  }
  const nextState = RAMP[nextIdx];
  const transitioned = nextState !== prev.state;
  reasons.push(`ramping toward war (readiness ${readiness.toFixed(2)}× base)`);
  return {
    next: { state: /** @type {PostureState} */ (nextState), progress: clamp01(nextProgress), sinceTick: transitioned ? tick : prev.sinceTick, covert: prev.covert },
    transitioned, cooled: false, reasons,
  };
}

/**
 * Evaluate the mobilization layer for ONE tick over the whole snapshot. Returns the
 * NEXT-tick `warPosture` ledger plus the per-settlement transition events the caller
 * surfaces (the `war_mobilization` conditions + the visible-mobilization signals +
 * the neighbour-reaction candidates).
 *
 * DETERMINISM: iterates settlements CODEPOINT-SORTED; reads only the pre-tick
 * snapshot + the pre-tick ledger; never forks rng (the only war rng is the siege
 * roll). GATED by the caller (warLayerEnabled); an empty result for a no-war
 * campaign keeps the ledger byte-neutral.
 *
 * @param {Object} args
 * @param {any} args.snapshot       the SINGLE pre-tick snapshot.
 * @param {any} args.worldState     carries the pre-tick warPosture + dispositionStats + deployments + warExhaustion.
 * @param {number} args.tick
 * @param {(id:string)=>boolean} args.wantsWarFor   does this settlement face a hostile target (the reason to ramp)?
 * @param {Record<string, boolean>} [args.forcePeaceBy]  optional per-id player stand-down.
 * @returns {{
 *   warPosture: Record<string, PostureRecord>,
 *   events: Array<{ id: string, prev: PostureState, next: PostureState, transitioned: boolean, cooled: boolean, covert: boolean, severity: number, reasons: string[] }>,
 * }}
 */
export function evaluateMobilization({ snapshot, worldState, tick, wantsWarFor, forcePeaceBy = {} }) {
  const prevLedger = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {};
  const exhaustion = worldState?.warExhaustion && typeof worldState.warExhaustion === 'object' ? worldState.warExhaustion : {};

  /** @type {Record<string, PostureRecord>} */
  const nextLedger = {};
  /** @type {Array<{ id: string, prev: PostureState, next: PostureState, transitioned: boolean, cooled: boolean, covert: boolean, severity: number, reasons: string[] }>} */
  const events = [];

  const ids = (snapshot?.settlements || [])
    .map((/** @type {any} */ s) => String(s.id))
    .sort(codepoint);

  for (const id of ids) {
    const item = snapshot?.byId?.get?.(id);
    if (!item) continue;
    const prev = normalizePosture(prevLedger[id], tick);
    const hasArmyDeployed = !!deployments[id]?.targetId;
    const scar = clamp01(exhaustion[id] || 0);
    const wantsWar = !hasArmyDeployed && wantsWarFor(id) === true;

    const { next, transitioned, cooled, reasons } = stepPosture({
      prev,
      item,
      worldState,
      tick,
      hasArmyDeployed,
      warExhaustion: scar,
      wantsWar,
      forcePeace: forcePeaceBy[id] === true,
    });

    // Only PERSIST a non-default posture. A settlement that lands back at
    // `peace` with zero progress is DROPPED from the ledger so a quiet campaign
    // never accumulates posture keys (byte-neutrality / dead-key hygiene).
    if (next.state !== 'peace' || next.progress > 0) {
      nextLedger[id] = next;
    }

    events.push({
      id,
      prev: prev.state,
      next: next.state,
      transitioned,
      cooled,
      covert: next.covert === true,
      severity: mobilizationSeverity(next.state),
      reasons,
    });
  }

  return { warPosture: nextLedger, events };
}

export const MOBILIZATION_TUNING = Object.freeze({
  RAMP_BASE_RATE,
  COOL_BASE_RATE,
  RAMP_RATE_MIN,
  RAMP_RATE_MAX,
  DISPOSITION_RAMP_WEIGHT,
  ECONOMY_RAMP_WEIGHT,
  LEGITIMACY_RAMP_WEIGHT,
  COOL_ECONOMY_FLOOR,
  COOL_LEGITIMACY_FLOOR,
  COOL_FOOD_MONTHS_FLOOR,
  MOBILIZATION_SEVERITY,
});

export { RAMP, READY_STATES };
