/**
 * domain/worldPulse/fidelityNoise.js — the ALIGNMENT-CONDITIONED FIDELITY term
 * (Phase 4 W-F4b, item 2, the owner's risk-calculator + development-fidelity
 * addenda, 2026-07-10).
 *
 * The engine's deterministic calculators — the war feasibility gate (the "risk
 * calculator") and the development planner's value ranking — are the LAWFUL pole's
 * behavior exactly: follow the verdict to the letter, expand the strongest viable
 * chain. Toward the CHAOTIC pole an actor instead decides on a NOISY ESTIMATE of the
 * true inputs, its margin of error rising SUPERLINEARLY toward chaos. So:
 *   • a chaotic besieger fights past exhaustion, quits winnable wars, and SOMETIMES
 *     wins a calculator-refused war (the owner's balance caution — variance with an
 *     occasional payoff, because the calculator has blind spots and only high-error
 *     actors ever probe them);
 *   • a chaotic economy mis-ranks its value chains — suboptimal expansions, late
 *     pivots, lingering on saturated chains — for lower peaks but fatter survival tails.
 *
 * DETERMINISM: the error is a SEEDED draw from the actor's per-decision rng fork
 * `fidelity::${site}::${tick}::${cid}::${decisionKey}` — replay-identical; chaos in
 * the fiction, never in the engine. The estimate perturbs only the DECISION inputs;
 * the actual resolution (siege roll, applied outcome) reads the TRUE values, so a
 * chaotic actor is delivered INTO fights it misjudged, then faces real odds.
 *
 * NEUTRALITY THEOREM (the acceptance test): the pull is
 *   chaosPull = pos(2·chaos01(patron) − 1) × pietyLocalMultOf × pietyLawMegaphoneOf
 * and is EXACTLY 0 — hence the factor is EXACTLY 1 and no rng is even forked — when
 * the settlement has NO piety record, OR a lawful/neutral patron. Every existing
 * fixture (deity-free, or faith without a chaotic devout patron) is byte-identical.
 *
 * PURE: no wall-clock, no mutation, no Math.random. Imports only the axis leaf and
 * the piety readers (both leaves reached without a religion-engine cycle).
 */

import { chaos01 } from './deityAxes.js';
import { pietyLocalMultOf, pietyLawMegaphoneOf } from './piety.js';

export const FIDELITY_TUNING = Object.freeze({
  BASE_ERROR: 0.35,      // signed margin of error at full chaos pull (chaosPull = 1)
  SUPERLINEAR_EXP: 1.6,  // >1 ⇒ error grows superlinearly toward the chaotic pole
  MAX_ERROR: 0.6,        // hard cap on |signed error| (the playable-but-dramatic bound)
  CHAOS_PULL_MAX: 2.0,   // clamp on chaosPull (pietyLocalMult can reach ~1.65)
  // W-F8 STRATEGIC RUST — the SECOND fidelity term. total error = chaos (temperamental
  // indiscipline) + rust (institutional inexperience), the two INDEPENDENT and summed, so
  // experience never CURES the chaos term (its own floor stands) and a lawful realm still
  // blunders its first war after a long peace (the 1914 problem). The rust magnitude is
  // supplied by the caller (rustMagnitude in martialReadiness), already capped; here we only
  // cap the COMBINED error. rust defaults 0 ⇒ every existing call site is byte-identical.
  TOTAL_MAX: 0.75,       // hard cap on |chaos + rust| combined signed error
});

/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

/**
 * The 0..CHAOS_PULL_MAX fidelity PULL of a settlement — how far its decisions drift
 * from the calculator: `pos(2·chaos01(patron) − 1) × pietyLocalMultOf × pietyLawMegaphoneOf`.
 * EXACTLY 0 (⇒ zero noise ⇒ byte-identical) when the settlement carries NO projected
 * piety record, or a lawful/neutral patron (chaos-side 0). Pure.
 * @param {{ config?: { faithProfile?: { piety?: unknown }, primaryDeitySnapshot?: { lawAxis?: string } } }|null|undefined} settlement
 * @returns {number}
 */
export function chaosPullOf(settlement) {
  // The identity short-circuit: no projected piety record ⇒ zero noise (the
  // acceptance test — deity-free / tick-0 / zero-span fixtures are byte-identical).
  if (!settlement?.config?.faithProfile?.piety) return 0;
  const chaosSide = pos(2 * chaos01(settlement?.config?.primaryDeitySnapshot) - 1);   // 0 lawful/neutral … 1 chaotic
  if (chaosSide <= 0) return 0;                                                        // lawful/neutral patron ⇒ zero noise
  return clamp(chaosSide * pietyLocalMultOf(settlement) * pietyLawMegaphoneOf(settlement), 0, FIDELITY_TUNING.CHAOS_PULL_MAX);
}

/**
 * The signed-error MAGNITUDE for a given chaos pull: `BASE_ERROR × chaosPull^SUPERLINEAR_EXP`,
 * capped at MAX_ERROR. 0 when chaosPull ≤ 0. Pure.
 * @param {number} chaosPull @returns {number}
 */
export function fidelityErrorMagnitude(chaosPull) {
  const T = FIDELITY_TUNING;
  const cp = clamp(chaosPull, 0, T.CHAOS_PULL_MAX);
  if (cp <= 0) return 0;
  return Math.min(T.MAX_ERROR, T.BASE_ERROR * Math.pow(cp, T.SUPERLINEAR_EXP));
}

/**
 * The multiplicative FIDELITY FACTOR (1 + signed error) an actor applies to a true
 * input to get its ESTIMATE, seeded per decision. Returns EXACTLY 1 — and forks NO
 * rng — when chaosPull ≤ 0 or the rng is absent, so a lawful/neutral/no-piety actor's
 * estimate equals the truth and the rng stream is untouched (byte-identical). Pure
 * given the injected rng.
 * W-F8: an optional `rust` magnitude (0..) is ADDED to the chaos magnitude before the cap —
 * the second, INDEPENDENT fidelity term (institutional inexperience). rust 0 (default) ⇒
 * mag = the chaos magnitude ⇒ byte-identical to the pre-W-F8 factor at every existing site;
 * a lawful/neutral patron (chaosPull 0) with rust > 0 still forks and errs (the 1914 problem).
 * @param {{ rng: { fork?: (key: string) => { random: () => number } }|null, site: string, tick: number|string, cid: string, decisionKey: string, chaosPull: number, rust?: number }} args
 * @returns {number}
 */
export function fidelityFactor({ rng, site, tick, cid, decisionKey, chaosPull, rust = 0 }) {
  const chaosMag = fidelityErrorMagnitude(chaosPull);
  const rustMag = Math.max(0, Number(rust) || 0);
  const mag = Math.min(FIDELITY_TUNING.TOTAL_MAX, chaosMag + rustMag);   // independent floors, capped sum
  if (mag <= 0 || !rng?.fork) return 1;
  const u = rng.fork(`fidelity::${site}::${tick}::${cid}::${decisionKey}`).random();
  return 1 + (2 * u - 1) * mag;   // signed error in [−mag, +mag]
}
