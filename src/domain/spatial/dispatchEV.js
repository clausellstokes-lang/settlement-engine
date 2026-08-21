/**
 * dispatchEV.js — Phase 5.5 mover wave M6c: THE DISPATCH EV — GREED vs DANGER
 * (round 22.4). The caravan GO/NO-GO stops being "dispatch whenever cur < target"
 * and becomes an EXPECTED-VALUE decision under FOG: an origin weighs the ATTRACTION
 * of a needy destination's premium against the DETERRENT of that destination's
 * BELIEVED danger. This is the ORIGIN side of the trade decision; M1's route
 * re-score (chooseRoute/scoreRoute) stays the ROUTE side — the two compose (a
 * caravan that decides to go still routes cheap-vs-safe).
 *
 * THE DECISION (a REFUSAL framed so a zero-danger link is BYTE-IDENTICAL to M6a):
 *
 *     netDanger = believedDanger · caution − needPremium · appetite
 *     REFUSE  when netDanger  > REFUSE_ENTER   (danger clearly wins)
 *     RESUME  when netDanger  < REFUSE_EXIT    (attraction wins) AND dwelled
 *     else HOLD the prior willingness (the M1 hysteresis deadband + exit dwell)
 *     dispatch iff  cur < target  AND  willing
 *
 *   The spec's "dispatch iff (need-premium × appetite) beats (believed-danger ×
 *   caution) + a threshold" rearranged with the threshold as a REFUSE deadband on
 *   the danger side. THE POINT: with believedDanger = 0 (a peaceful destination, or
 *   an UNHEARD danger, or dormancy) netDanger = −needPremium·appetite ≤ 0 < EXIT ⇒
 *   NEVER refuse ⇒ dispatch whenever cur < target ⇒ the M6a dispatch UNCHANGED,
 *   byte-identical. Only real, PERCEIVED danger can move a link into refusal. This
 *   is the constitutional gate: off/absent (no ev context threaded) ⇒ M6a verbatim.
 *
 * THE DETERRENT reads BELIEF, never ground truth (§4g / round 22.4):
 *   - dormant / omniscient / self  → GROUND-TRUTH stressor danger (the caller acts
 *     on truth, as it does everywhere beliefs are off — byte-exact);
 *   - the origin HOLDS a belief about the destination → the BELIEVED danger:
 *     max(danger-from-believed-readiness · confidence, the destination's occupation
 *     term). A STALE rumor of a siege (high believed readiness, still confident)
 *     DETERS a caravan from a town that has since RECOVERED (ground truth safe);
 *   - the origin has heard NOTHING (source 'unknown') → 0: an UNHEARD danger SLIPS
 *     THROUGH (the caravan walks into a fresh siege it never got word of — the
 *     route's M1 banditry/interception then nicks or cuts it, but the origin did not
 *     REFUSE).
 *   PER-STRESSOR SHAPES (`stressorDanger`, the ground-truth magnitude + the M11a
 *   plug-in seam): SIEGE ≈ near-absolute; OCCUPATION = confiscation/extraction risk,
 *   an EXTRACTIVE occupier DAMPENS (it wants the tax, never severs); war/embattlement
 *   ON THE ROUTE is already M1's route danger, not re-added here (destination-side).
 *   ⚠️ M11a plugs PLAGUE into `stressorDanger` + a plague-specific believed-refusal
 *   through THIS SAME seam — the shape function and the belief gate are built so
 *   plague is a value change, not a schema break. This module does NOT depend on
 *   M11a (unbuilt).
 *
 * DYNAMIC APPETITE (the novel core — "the greed must be DYNAMIC"): a BOUNDED
 * per-ORIGIN scalar in a new `merchantAppetite` sub-ledger (nested under
 * spatialLedgers — ZERO eager bytes). It RISES when a risky delivery PAYS OFF (a
 * caravan that ran real danger and ARRIVED → "emboldened by the <dest> run"), FALLS
 * on LOSSES (a risky caravan CUT — banditry/confiscation events M2/M6a already
 * emit), and DECAYS toward a BASELINE derived from merchant-faction strength +
 * settlement alignment (a strong merchant guild keeps the floor HIGH; a lawful/temple
 * town stays CAUTIOUS). It reads ACTUAL prior outcomes — a deterministic accumulator
 * over events already rolled, NO new rng. Bounded [FLOOR, CEILING]; a scalar within
 * epsilon of its baseline (no risky history) is PRUNED (the embattlement sparsity
 * idiom) so a peaceful world materializes no appetite ledger.
 *
 * EMERGENT: the deepest-shortage towns (highest premium) beat even a siege's danger
 * for a bold merchant — quarantines/blockades CREATE their own blockade-runners.
 * When netDanger wins the caravan does NOT dispatch and the shortage PERSISTS: that
 * persistent unmet-demand-under-danger (`evRefused` + believedDanger on the outcome)
 * is the CLEAN SEAM M7 (smuggling) harvests — smuggling is the tail of the greed
 * curve, built later; this module exposes the signal, never the criminal channel.
 *
 * OVERRIDES ride existing edges (dispatch REGARDLESS of EV): vassal TRIBUTE coercion
 * (a vassal must ship to its occupier — must-go) and strong-ally RELIEF (trade-as-
 * peace, send into danger). Wired as an `override` hook the kernel feeds from what is
 * readily available (occupations for must-go); relief is a documented seam.
 *
 * PURE + lazy: no Date, no Math.random, no mutation of inputs, no tier/auth read. A
 * spatial leaf; deterministic (a total-order accumulator, codepoint-sorted by the
 * caller). Time is tick-time only.
 */

import { belief } from '../worldPulse/beliefMap.js';

// ── Tuning (documented; retuned in the M6c + checkpoint soaks) ────────────────
export const DISPATCH_TUNING = Object.freeze({
  // ── The REFUSE deadband (the M1 hysteresis discipline on the dispatch decision).
  // netDanger = believedDanger·caution − needPremium·appetite. A willing link enters
  // REFUSING only when danger clearly wins (> ENTER); a refusing link RESUMES only
  // when attraction clearly wins (< EXIT) AND it has dwelled — so an origin's
  // willingness to trade a destination does NOT flip-flop on tick-to-tick jitter.
  // ENTER > EXIT is the whole deadband; DWELL is the exit-side minimum (≈4 weeks).
  REFUSE_ENTER: 0.2,
  REFUSE_EXIT: 0.05,
  REFUSE_DWELL: 4,

  // ── Believed danger from believed war-readiness. A merely-alert town (readiness ≤
  // IDLE) reads SAFE; danger ramps to 1 at full deployment (a besieged/deployed town
  // reads near-absolute). The belief record's readiness is the STALE-able channel:
  // a rumor of a siege keeps readiness high after the town recovers (the deterrent
  // that lingers), scaled by the belief's confidence (a faded rumor deters less).
  READINESS_IDLE: 0.3,

  // ── Per-stressor ground-truth danger shapes (`stressorDanger`; the M11a seam).
  // SIEGE is near-absolute; OCCUPATION is a confiscation/extraction risk shaped by
  // the occupation ladder — an EXTRACTIVE occupier DAMPENS (it wants the tax).
  DANGER_SIEGE: 0.95,

  // ── Appetite dynamics (the dynamic greed). Bounded [FLOOR, CEIL]; a risky paid-off
  // run EMBOLDENS by GAIN, a risky loss COWS by LOSS (loss aversion: LOSS > GAIN),
  // and every tick the scalar DECAYS toward its disposition baseline. A scalar within
  // EPS of baseline with no fresh event is pruned (sparse ledger).
  APPETITE_FLOOR: 0.3,
  APPETITE_CEIL: 2.0,
  APPETITE_GAIN: 0.25,
  APPETITE_LOSS: 0.3,
  APPETITE_DECAY: 0.1,
  APPETITE_EPS: 0.02,

  // The disposition BASELINE (merchant-faction strength raises it; lawfulness lowers
  // it): baseline = clamp(MID + MERCHANT_W·merchantStrength01 − LAWFUL_W·(law−0.5)·2).
  BASELINE_MID: 1.0,
  BASELINE_MERCHANT_W: 0.6,
  BASELINE_LAWFUL_W: 0.4,

  // A dispatch whose believed danger is at/above this is a RISKY run — only risky
  // runs move the appetite (a peaceful delivery is unremarkable). Also the floor for
  // stamping `ranDanger` on a shipment (so a peaceful record is byte-identical to M6a).
  RISKY_DANGER_FLOOR: 0.25,
});

// The occupation STATE → confiscation/extraction danger term (0..1). Mirrors the
// occupation ladder (embattlement.OCCUPATION_TERM) but DAMPENED for trade: an
// EXTRACTIVE occupier wants the caravan's tax, so it deters far LESS than a siege —
// it dampens, never severs. A contested/unstable conquest is more dangerous (looting
// soldiers); a settled vassal barely deters at all.
export const OCCUPATION_DANGER = Object.freeze({
  contested: 0.6, unstable: 0.5, extractive: 0.35, stabilized: 0.2, vassalized: 0.1,
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

// ── PER-STRESSOR GROUND-TRUTH DANGER (the shape magnitude + the M11a plug-in seam) ─
/**
 * The occupation-state confiscation/extraction danger term (0 for none / unknown /
 * liberated). Dampened relative to a siege — an extractive occupier wants the tax.
 * @param {string|null|undefined} state @returns {number}
 */
export function occupationDangerTerm(state) {
  const t = /** @type {Record<string, number>} */ (OCCUPATION_DANGER)[String(state)];
  return Number.isFinite(t) ? t : 0;
}

/**
 * The GROUND-TRUTH per-stressor danger a destination poses to an arriving caravan,
 * from the stressors that EXIST there today. SIEGE ≈ near-absolute; OCCUPATION is a
 * dampened confiscation risk (extractive dampens, never severs). The WORST stressor
 * dominates (max) — a besieged AND occupied town reads as besieged. Embattlement on
 * the ROUTE is M1's route danger, deliberately NOT folded here (this is the
 * DESTINATION deterrent, origin-side). This is the function M11a extends with a
 * PLAGUE term (build-the-seam mandate): a new stressor is a new max() argument.
 * @param {{ occupationState?: string|null, besieged?: boolean }} [stressor]
 * @returns {number} danger in [0, 1]
 */
export function stressorDanger(stressor = {}) {
  const T = DISPATCH_TUNING;
  const siege = stressor.besieged ? T.DANGER_SIEGE : 0;
  const occ = occupationDangerTerm(stressor.occupationState);
  return clamp01(Math.max(siege, occ));
}

/** Danger implied by a believed war-readiness: a merely-alert town (≤ IDLE) reads
 *  safe; danger ramps to 1 at full deployment (a besieged/deployed town). Pure.
 *  @param {number} readiness01 @returns {number} */
export function dangerFromReadiness(readiness01) {
  const idle = DISPATCH_TUNING.READINESS_IDLE;
  const r = clamp01(finiteNumber(readiness01, 0));
  return r <= idle ? 0 : clamp01((r - idle) / (1 - idle));
}

// ── THE DETERRENT — believed destination danger (reads BELIEF, never truth) ────
/**
 * The danger an ORIGIN believes its DESTINATION poses, read through the belief map:
 *
 *   - source 'truth' (dormant / omniscient / self) → the GROUND-TRUTH stressor
 *     danger (`stressorDanger(gt)`): with beliefs off the origin acts on truth, as
 *     everywhere else — byte-exact;
 *   - source 'belief' (the origin HOLDS a belief) → the BELIEVED danger:
 *     max( dangerFromReadiness(believed readiness)·confidence , occupation term ).
 *     The believed-readiness channel is what goes STALE — a confident rumor of a
 *     siege keeps deterring after the town recovers; occupation (a persistent, public
 *     martial state) is read from ground truth as a mild dampened floor;
 *   - source 'unknown' (the origin has heard NOTHING) → 0: an UNHEARD danger slips
 *     through (the caravan walks in; the route's M1 banditry still bites).
 *
 * @param {string} observerId  the ORIGIN (the merchant deciding to dispatch)
 * @param {string} destId      the DESTINATION (the consumer the caravan is bound for)
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown } | null | undefined} worldState
 * @param {{ occupationState?: string|null, besieged?: boolean }} groundTruthStressor  the destination's stressors TODAY
 * @returns {number} believed danger in [0, 1]
 */
export function believedDestinationDanger(observerId, destId, worldState, groundTruthStressor = {}) {
  const b = belief(String(observerId), String(destId), worldState);
  if (b.source === 'truth') return stressorDanger(groundTruthStressor);   // omniscient / dormant / self
  if (b.source === 'unknown') return 0;                                   // unheard ⇒ slips through
  // source 'belief': the origin acts on what it BELIEVES (possibly STALE).
  const rec = b.record;
  const believedReadinessDanger = dangerFromReadiness(rec.readiness) * clamp01(finiteNumber(rec.confidence01, 0));
  const occ = occupationDangerTerm(groundTruthStressor.occupationState);
  return clamp01(Math.max(believedReadinessDanger, occ));
}

// ── ATTRACTION — the need-premium (M6a's shortage, no numeric prices) ──────────
/**
 * The need-premium a destination's shortage exerts on the carried good: 0 at/above
 * target, rising to 1 as the stockpile empties (a deep shortage pays a high premium
 * — the continuous form of M6a's shortage band). Pure, total.
 * @param {number} stock @param {number} target @returns {number} premium in [0, 1]
 */
export function needPremium(stock, target) {
  const tgt = Math.max(1, finiteNumber(target, 0));
  const s = Math.max(0, finiteNumber(stock, 0));
  return clamp01((tgt - s) / tgt);
}

// ── DYNAMIC APPETITE — the disposition baseline + the bounded accumulator ──────
/**
 * The disposition baseline an origin's appetite decays toward: a strong merchant
 * faction raises it (bold, greedy trade); a lawful/temple town lowers it (cautious).
 * Bounded within the appetite envelope. Pure.
 * @param {{ merchantStrength01?: number, lawfulness01?: number }} [inputs]
 * @returns {number}
 */
export function merchantBaseline({ merchantStrength01 = 0, lawfulness01 = 0.5 } = {}) {
  const T = DISPATCH_TUNING;
  const merch = clamp01(finiteNumber(merchantStrength01, 0));
  const law = clamp01(finiteNumber(lawfulness01, 0.5));
  const raw = T.BASELINE_MID + T.BASELINE_MERCHANT_W * merch - T.BASELINE_LAWFUL_W * (law - 0.5) * 2;
  return round4(clamp(raw, T.APPETITE_FLOOR, T.APPETITE_CEIL));
}

/**
 * @typedef {Object} AppetiteRecord
 * @property {number} level     the current 0.3..2.0 boldness scalar
 * @property {number} lastTick  the tick this record last advanced
 */

/**
 * Read an origin's appetite from the (sparse) ledger, or its BASELINE when absent
 * (an origin with no risky history sits exactly at its disposition baseline). Total.
 * @param {Record<string, unknown> | null | undefined} appetiteLedger
 * @param {string} originId @param {number} baseline
 * @returns {number}
 */
export function appetiteOf(appetiteLedger, originId, baseline) {
  const ns = appetiteLedger && typeof appetiteLedger === 'object' && !Array.isArray(appetiteLedger)
    ? /** @type {Record<string, unknown>} */ (appetiteLedger) : null;
  const rec = ns ? ns[String(originId)] : null;
  const level = rec && typeof rec === 'object' && !Array.isArray(rec)
    ? finiteNumber(/** @type {Record<string, unknown>} */ (rec).level, NaN) : NaN;
  return Number.isFinite(level) ? clamp(level, DISPATCH_TUNING.APPETITE_FLOOR, DISPATCH_TUNING.APPETITE_CEIL) : baseline;
}

/**
 * Advance ONE origin's appetite: decay toward baseline, then EMBOLDEN by each risky
 * paid-off run and COW by each risky loss (a deterministic accumulator over outcomes
 * already rolled — no rng), bounded. Returns null when the scalar has settled within
 * EPS of its baseline and there is no fresh event — the record is PRUNED (the ledger
 * stays sparse; the reader then falls back to baseline). Pure.
 * @param {AppetiteRecord | null} prior
 * @param {{ baseline: number, paid?: number, lost?: number, now: number }} args
 * @returns {AppetiteRecord | null}
 */
export function stepAppetite(prior, { baseline, paid = 0, lost = 0, now }) {
  const T = DISPATCH_TUNING;
  const base = clamp(finiteNumber(baseline, T.BASELINE_MID), T.APPETITE_FLOOR, T.APPETITE_CEIL);
  const priorLevel = prior && typeof prior === 'object' ? finiteNumber(prior.level, base) : base;
  const p = Math.max(0, Math.floor(finiteNumber(paid, 0)));
  const l = Math.max(0, Math.floor(finiteNumber(lost, 0)));
  const decayed = priorLevel + T.APPETITE_DECAY * (base - priorLevel);
  const next = clamp(decayed + T.APPETITE_GAIN * p - T.APPETITE_LOSS * l, T.APPETITE_FLOOR, T.APPETITE_CEIL);
  if (p === 0 && l === 0 && Math.abs(next - base) < T.APPETITE_EPS) return null; // settled ⇒ prune
  return { level: round4(next), lastTick: Math.max(0, Math.floor(finiteNumber(now, 0))) };
}

/** The receipt a risky paid-off run stamps ("emboldened by the <dest> run"). Pure.
 *  @param {string} destName @returns {string} */
export function emboldenedReceipt(destName) {
  return `The merchants are emboldened by the ${destName || 'far'} run — a risky delivery paid off.`;
}

// ── THE DISPATCH DECISION — EV + the willingness hysteresis latch ──────────────
/**
 * @typedef {Object} WillingnessRecord
 * @property {'refusing'} phase   only the REFUSING phase is materialized (willing = absent/default)
 * @property {number} sinceTick   the tick refusal began (the dwell clock)
 * @property {number} lastTick    the tick this record last advanced
 */

/**
 * @typedef {Object} DispatchDecision
 * @property {boolean} dispatch          go/no-go (cur < target AND willing, OR an override)
 * @property {boolean} refuse            the EV refused (danger beat attraction, no override)
 * @property {number} believedDanger     the deterrent read (belief-gated) — the M7 signal
 * @property {number} needPremium        the attraction read
 * @property {number} netDanger          believedDanger·caution − needPremium·appetite
 * @property {WillingnessRecord | null} willingness  the next latch (null ⇒ willing ⇒ prune)
 * @property {'must-go'|'relief'|null} override        the edge that overrode the EV, if any
 */

/**
 * The origin's GO/NO-GO for one link this tick, with the M1 hysteresis discipline.
 * Peaceful (believedDanger 0) ⇒ netDanger ≤ 0 ⇒ willing ⇒ dispatch when short ⇒ M6a
 * verbatim. An OVERRIDE (vassal tribute must-go / ally relief) dispatches regardless
 * of EV. Pure; the caller supplies the belief-gated danger, the ONE W0 caution read,
 * and the appetite.
 * @param {Object} args
 * @param {boolean} args.short          cur < target (the M6a precondition)
 * @param {number} args.needPremium     attraction (0..1)
 * @param {number} args.appetite        the origin's dynamic greed
 * @param {number} args.believedDanger  the deterrent (0..1, belief-gated)
 * @param {number} args.caution         the ONE W0 risk-tolerance read (0..1)
 * @param {WillingnessRecord | null} args.priorWillingness
 * @param {number} args.now
 * @param {'must-go'|'relief'|null} [args.override]
 * @returns {DispatchDecision}
 */
export function dispatchDecision({ short, needPremium: needPrem, appetite, believedDanger, caution, priorWillingness, now, override = null }) {
  const T = DISPATCH_TUNING;
  const danger = clamp01(finiteNumber(believedDanger, 0));
  const prem = clamp01(finiteNumber(needPrem, 0));
  const app = clamp(finiteNumber(appetite, T.BASELINE_MID), T.APPETITE_FLOOR, T.APPETITE_CEIL);
  const caut = clamp01(finiteNumber(caution, 1));
  const netDanger = danger * caut - prem * app;
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));

  // ── The willingness hysteresis latch (enter > ENTER, exit < EXIT, exit dwell). ──
  const priorRefusing = !!(priorWillingness && priorWillingness.phase === 'refusing');
  const priorSince = priorRefusing ? Math.floor(finiteNumber(priorWillingness.sinceTick, tick)) : tick;
  let refusing = priorRefusing;
  let sinceTick = priorSince;
  if (!priorRefusing) {
    if (netDanger > T.REFUSE_ENTER) { refusing = true; sinceTick = tick; }
  } else if (netDanger < T.REFUSE_EXIT && (tick - priorSince) >= T.REFUSE_DWELL) {
    refusing = false;
  }

  // Overrides ride existing edges: dispatch regardless of the EV (but the willingness
  // latch still evolves, so the refusal resumes correctly once the override lifts).
  const overridden = override === 'must-go' || override === 'relief';
  const willing = !refusing;
  const dispatch = !!short && (willing || overridden);
  const refuse = !!short && refusing && !overridden;

  return {
    dispatch,
    refuse,
    believedDanger: round4(danger),
    needPremium: round4(prem),
    netDanger: round4(netDanger),
    willingness: refusing ? { phase: 'refusing', sinceTick, lastTick: tick } : null,
    override: overridden ? override : null,
  };
}
