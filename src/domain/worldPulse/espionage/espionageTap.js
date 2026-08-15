/**
 * espionageTap.js — ES-3: THE TAP LADDER AND THE STANDOFF. How deep a spy gets, and
 * whether he goes in at all.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.4 (the standoff, addition D), §3.7 (the tap order and the
 * confidence gradient, addition H). Two questions about ACCESS, answered in one leaf
 * because they are the same trade seen from either side of a gate: the standoff read
 * decides whether to enter, and the tap ladder prices what you can hear once you have.
 *
 * ── THE LAW THIS FILE EXISTS TO MAKE ARITHMETIC ─────────────────────────────────────────
 * A SPY CAN NEVER REPORT PURER THAN HIS ACCESS (owner addition H, J-ES-16). The tap at a
 * stop is DERIVED from how the agent is present and is never chosen:
 *
 *   performance — an open visitor, or a standoff that never entered. He hears the host's
 *                 OUTBOUND TELLING: its belief rows overlaid by its own live statecraft.
 *                 Where the host carries an active lie about the subject, the told version
 *                 carries the ASSERTED band, and `perfPoison01` prices how willing that
 *                 host is to mutate its telling toward a court it does not like.
 *   beliefs     — an EMBEDDED agent at a covert-face stop. He reads what the host actually
 *                 believes, post-drift, pre-performance. Nobody sees past the host's own
 *                 errors: a host with no belief about the subject yields NOTHING, and that
 *                 honesty negative is the epistemic constitution holding.
 *   delta       — embedded WITH a live inside asset. Both layers PLUS the lie itself, which
 *                 is what makes a delta-tapped REFUTE counter-disinformation by access
 *                 depth rather than by a coupling.
 *
 * ⚠ THE DEPTH ORDER IS NOT THE SORT ORDER, AND THE TWO CAPS THAT PROVE THE LAW ARE NAMED.
 * `TAP_LEVELS` is codepoint-sorted (`beliefs`, `delta`, `performance`) and `TAP_DEPTH` is
 * the ranking. Numerically, `accuracyCapFor` puts performance STRICTLY below the deeper
 * taps in exactly two ways, and a matrix pin that used any other input pair would be
 * asserting an equality and calling it a law:
 *   1. AT THE TARGET a declared-face visit reads the target's SELF-performance and caps at
 *      `PERF_SELF_CAP`, while an entered agent caps at 1.0. Paraded granaries.
 *   2. AT A POISONED WAYPOINT the performance cap is discounted by the host's willingness
 *      to lie toward home; the entered taps are not, because a lie told outward is not a
 *      lie the teller believes.
 * With an honest host at a non-target stop the three taps DO agree numerically, and that
 * is the design rather than a hole: what a truthful court tells you is what it believes.
 * The delta tap's advantage there is QUALITATIVE — it hands the agent the lie itself.
 *
 * ── THE WORLD TERMS ARE ARGUMENTS, EXACTLY AS ES-0 MADE THEM ────────────────────────────
 * Nothing here gathers its own inputs. A function that gathered them could not have any
 * single factor mutated out, which is how a term that looks live turns out to be dead —
 * the ES-0 header states this at length and this leaf is held to it: every factor below is
 * individually droppable and the battery drops each one.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation, no rng.
 *
 * @enforced-by tests/domain/espionageProducts.test.js,
 *   tests/property/espionageProductsDormancyFence.test.js
 */
import { decayedConfidence } from '../beliefMap.js';
import { lieWillingness } from '../disinformationPlant.js';
import { riskAppetiteOf } from '../npcLadderGoals.js';
import { ROADS_TUNING, riskToleranceOf } from '../../roads/state.js';
import { ESPIONAGE_TUNING, TAP_DEPTH, TAP_LEVELS } from './espionageMath.js';

/** @param {unknown} value @returns {number} */
function n01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return number < 0 ? 0 : number > 1 ? 1 : number;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * ES-3's own constants, kept OUT of `ESPIONAGE_TUNING` for the reason ES-2's
 * `GAUNTLET_TUNING` records: that export is ES-0's frozen arithmetic surface and its key
 * set is pinned as a totality, so a wave that appended to it would move a pinned totality
 * for numbers that belong to a stage rather than to a formula. Raw-authored proposals
 * until the owner signs them (L5, THE PROMISE) — none of this is ratified.
 */
export const TAP_TUNING = Object.freeze({
  /** §3.4 — how far a desperate court's appetite for risk stretches past its temperament. */
  DESPERATION_W: 0.5,
  /**
   * §3.4's THIRD AXIS (addition H). A satellite hostile to home is physically safe and
   * informationally POISONED, so poison RAISES the bar for standing off there: the
   * reach-vs-standoff choice is risk vs confidence vs INTEGRITY, and without this term the
   * safest waypoint would also look like the wisest one.
   */
  INTEGRITY_W: 0.5,
  /**
   * §3.4's `flawDistortion` — a closed table over the flaw classes `riskAppetiteOf`
   * already interprets, EXTENDED rather than forked. Pride under-reads the gate it is
   * about to walk through; cravenness over-reads it. It distorts the ASSESSMENT, not the
   * appetite: a proud man does not want more risk, he sees less of it.
   */
  FLAW_DISTORTION: Object.freeze({ high: 0.7, low: 1.4, mid: 1 }),
});

/**
 * The three house-voice registers, verbatim the owner's own words for them (§3.7). These
 * are the RECEIPT the tap earns — fidelity metadata a reader can hear rather than a number
 * only the engine can see. ES-7's pools carry them as fidelity clauses on the confirmation
 * and refute rows; until then they ride the product receipt.
 * @type {Readonly<Record<string, string>>}
 */
export const TAP_RECEIPTS = Object.freeze({
  beliefs: 'as X itself believes',
  delta: 'X speaks one thing and believes another',
  performance: 'as told in X\'s markets',
});

/**
 * The receipt for one tap with the host's name substituted. Kept beside the frozen phrase
 * set rather than at the call site so the three registers have ONE spelling — the phrase
 * set is pinned as a totality and this is the only reader of it.
 * @param {unknown} tap @param {unknown} hostName @returns {string}
 */
export function tapReceiptFor(tap, hostName) {
  const phrase = TAP_RECEIPTS[String(tap)];
  if (!phrase) return '';
  return phrase.replace('X', text(hostName) || 'the host');
}

/**
 * The T4 hostility rung, normalized to [0,1] against the ladder's own top rung. A
 * non-hostile relationship is 0 — which is the friend rule expressed as arithmetic, the
 * same way `catchChance01` expresses it, so neither can be forgotten at a call site.
 * @param {unknown} relationship a relationship-type word @returns {number} 0..1
 */
export function hostileRung01(relationship) {
  const rungs = /** @type {Readonly<Record<string, number>>} */ (ROADS_TUNING.T4_RUNG);
  const rung = rungs[String(relationship)];
  if (!Number.isFinite(rung)) return 0;
  const top = Math.max(...Object.values(rungs));
  return top > 0 ? round4(rung / top) : 0;
}

/**
 * §3.7 — HOW POISONED A HOST'S OUTBOUND TELLING IS, toward one particular home.
 *
 * `lieWillingness` is IMPORTED, never respelled (J-WR-10): it is the estate's one statement
 * of how willing a court is to seed a falsehood, and it already composes malice, lawful-good
 * restraint and desperation. The espionage half is the second factor — a court willing to
 * lie only poisons the wells of a court it has reason to lie TO. An ally's markets are
 * honest even when its council is malicious.
 *
 * @param {{malice01?: unknown, lawfulness01?: unknown, desperation01?: unknown,
 *   relationship?: unknown}} args
 * @returns {number} 0..1
 */
export function perfPoison01({ malice01, lawfulness01, desperation01, relationship } = {}) {
  const willingness = lieWillingness({
    malice01: n01(malice01),
    lawfulness01: n01(lawfulness01),
    desperation01: n01(desperation01),
  });
  return round4(n01(willingness) * hostileRung01(relationship));
}

/**
 * J-ES-16 — THE TAP AT ONE STOP, DERIVED FROM HOW THE AGENT IS PRESENT.
 *
 * FAIL-CLOSED TO THE SHALLOWEST. Anything that is not a recognised covert-face entry reads
 * as `performance`, so a malformed stop, an unknown face word and a standoff all land on
 * the tap that can hear the least. The opposite default would let a shape error buy an
 * agent access he never had, which is the one direction this ladder must never fail.
 *
 * @param {{face?: unknown, standoff?: unknown, hasInsideAsset?: unknown}} args
 * @returns {'beliefs'|'delta'|'performance'}
 */
export function tapLevelFor({ face, standoff, hasInsideAsset } = {}) {
  // The standoff NEVER enters, so it never taps deeper — addition H's own ruling, and the
  // reason a plateaued mission's gradient stops climbing (§3.4).
  if (standoff === true) return 'performance';
  if (text(face) !== 'covert') return 'performance';
  return hasInsideAsset === true ? 'delta' : 'beliefs';
}

/**
 * §3.7 — THE STALENESS OF A HOST'S OWN RECORD, through the estate's ONE decay law.
 *
 * `decayedConfidence` is imported rather than approximated: a second decay curve anywhere
 * in this estate is a design defect (the bandFamilies rule), and the quantity wanted here
 * is exactly what that function computes — how much of a unit of certainty survives N ticks
 * of silence. Passing 1 makes the answer a pure multiplier.
 *
 * @param {unknown} lastUpdateTick @param {unknown} now @returns {number} 0..1
 */
export function recordStaleness01(lastUpdateTick, now) {
  const then = Number(lastUpdateTick);
  const at = Number(now);
  if (!Number.isFinite(then) || !Number.isFinite(at)) return 0;
  return n01(decayedConfidence(1, Math.max(0, at - then)));
}

/**
 * §3.7 — THE ACCURACY CEILING OF ONE READ, composed from the tap.
 *
 * The two strict inequalities that make the never-purer-than-access law measurable are
 * named in this file's header; both live in the `performance` arm below.
 *
 * ⚠ THE HOP-DISTANCE TERM IS DELIBERATELY ABSENT AND THAT IS NOT AN OMISSION. The
 * directive's "hop distance" rides INSIDE `hostConfidence01`: the rumour substrate already
 * prices content intactness down with relay hops, so the host's own record quality carries
 * the distance. A second distance term here would charge the same journey twice.
 *
 * @param {{tap?: unknown, isTarget?: unknown, hostConfidence01?: unknown,
 *   staleness01?: unknown, poison01?: unknown}} args
 * @returns {number} 0..1
 */
export function accuracyCapFor({ tap, isTarget, hostConfidence01, staleness01, poison01 } = {}) {
  const T = ESPIONAGE_TUNING;
  const word = String(tap);
  if (!TAP_LEVELS.includes(word)) return 0;
  const secondhand = T.SECONDHAND_CAP * n01(hostConfidence01) * n01(staleness01);
  const entered = TAP_DEPTH[/** @type {'beliefs'|'delta'|'performance'} */ (word)] > TAP_DEPTH.performance;
  if (entered) return round4(isTarget === true ? 1 : secondhand);
  const base = isTarget === true ? T.PERF_SELF_CAP : secondhand;
  return round4(n01(base * (1 - T.PERF_POISON_W * n01(poison01))));
}

/**
 * §3.4 — HOW BADLY A PERSON MISREADS THE GATE IN FRONT OF HIM.
 *
 * A closed table over `riskAppetiteOf`'s three flaw classes — EXTENDED, not forked, which
 * is why this imports the ladder's own reader instead of re-parsing personality words. It
 * multiplies the ASSESSED RISK rather than the appetite, because the design's sentence is
 * that pride under-READS danger, not that it enjoys danger.
 *
 * @param {unknown} npc @returns {number} > 0
 */
export function flawDistortion(npc) {
  const appetite = riskAppetiteOf(
    /** @type {Parameters<typeof riskAppetiteOf>[0]} */ (npc && typeof npc === 'object' ? npc : {}),
  );
  const table = /** @type {Readonly<Record<string, number>>} */ (TAP_TUNING.FLAW_DISTORTION);
  const factor = table[appetite];
  return Number.isFinite(factor) ? factor : 1;
}

/**
 * §3.4 — REACH OR STAND OFF, decided at the last safe stop.
 *
 * A DETERMINISTIC risk assessment, not a roll: the whole layer's stochastic surface is the
 * gauntlet's keyed hash (L1), and a choice that a temperament is supposed to explain must
 * be explicable, which a draw would not be.
 *
 * THE THREE AXES ARE ALL PRESENT AND ALL DROPPABLE. Risk is the catch chance at the gate
 * times the approach's own hostility; confidence is what standing off costs (the caller
 * plateaus the gradient at the performance cap); integrity is `poison01`, which RAISES the
 * bar because a hostile-to-home satellite is a safe place to hear a lie.
 *
 * @param {{catch01?: unknown, clusterHostility01?: unknown, npc?: unknown,
 *   homeDesperation01?: unknown, poison01?: unknown}} args
 * ⚠ NEITHER RETURNED NUMBER CARRIES AN `01` SUFFIX AND THAT IS DELIBERATE. Both are
 * COMPARABLE MAGNITUDES, not probabilities: the flaw distortion can lift an assessment past
 * 1 and desperation plus poison can lift the bar past 1 too. The estate's `01` suffix means
 * "clamped to [0,1]", so wearing it here would be a false promise about a quantity whose
 * whole job is to be compared with its sibling.
 *
 * @returns {{standoff: boolean, assessedRisk: number, bar: number, receipt: string}}
 */
export function standoffRead({
  catch01, clusterHostility01, npc, homeDesperation01, poison01,
} = {}) {
  const T = TAP_TUNING;
  const distortion = flawDistortion(npc);
  const assessedRisk = round4(n01(catch01) * n01(clusterHostility01) * distortion);
  const appetite = Number(riskToleranceOf(npc));
  const stretched = (Number.isFinite(appetite) ? appetite : 0)
    * (1 + T.DESPERATION_W * n01(homeDesperation01));
  const bar = round4(stretched * (1 + T.INTEGRITY_W * n01(poison01)));
  const standoff = assessedRisk > bar;
  return {
    standoff,
    assessedRisk,
    bar,
    receipt: standoff
      ? 'He watched from the river town instead: the approach read worse than his nerve, and what he could hear from outside was worth more than what the gate would cost.'
      : 'Pride carried him through the gate: the approach read no worse than his nerve, and only an entered man hears what a court believes.',
  };
}
