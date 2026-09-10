/**
 * domain/worldPulse/occupation.js — the occupation STATE machine + the
 * CAPPED/DELAYED/CONDITIONAL occupier-benefit loop + burden/resistance/overextension.
 *
 * A successful conquest (warDeployment.js → cause:'conquest') becomes a STATEFUL
 * relationship recorded in `worldState.occupations`, keyed by the OCCUPIED settlement:
 *
 *     worldState.occupations[occupiedId] = {
 *       occupierId, state, sinceTick, stateHeld, resistance, benefitYield, lastTick
 *     }
 *
 * THE STATE MACHINE (pantheon hysteresis + bounded-transition idiom):
 *   contested → unstable → extractive → stabilized → vassalized       (advance)
 *   stabilized/extractive → unstable → contested → liberated          (slide back)
 * A fresh conquest STARTS at `contested`. It advances toward `stabilized` over ticks
 * ONLY when the occupier suppresses resistance / installs a compliant regime / secures
 * supply; under live resistance it stalls or slides back. NO 1-tick flips: a transition
 * requires a sustained suitability margin held for STATE_HOLD_TICKS (the dwell), and at
 * most ONE rung of movement per occupation per tick.
 *
 * ── THE SNOWBALL IS THE DANGER ZONE (sacred). ────────────────────────────────────
 * The occupier-benefit loop is a CROSS-SETTLEMENT feedback loop — the exact pathology
 * the pantheon containment cap exists to prevent. It is:
 *   - CAPPED: a per-occupation cap (PER_OCCUPATION_BENEFIT_CAP) AND a per-occupier total
 *     containment cap (OCCUPIER_BENEFIT_CONTAINMENT) bound how much war support ALL of an
 *     occupier's occupations can ever yield. Multiple occupations CANNOT compound into
 *     unbounded strength.
 *   - DELAYED: benefit ∝ the occupation STATE (contested ≈ 0; it rises only as the
 *     occupation STABILIZES over ticks). A just-conquered settlement yields ~0.
 *   - CONDITIONAL: benefit ∝ the occupied settlement's actual USEFULNESS (the military-
 *     capacity facets: manpower/institutions/materiel/logistics/economy/will + tier/pop)
 *     MINUS active resistance, AND scaled by the state.
 * Benefit is surfaced as a war_spoils condition on the OCCUPIER that EASES war_exhaustion
 * (extends supply endurance / sustains more fronts) — but the containment cap means the
 * relief is bounded no matter how many settlements an occupier holds. A soak test pins
 * this bound across a long run (occupation does not produce unbounded compounding strength).
 *
 * ── BURDEN + RESISTANCE (must be able to OUTWEIGH benefit). ───────────────────────
 * Each occupation imposes a garrison/admin burden on the OCCUPIER (occupation_burden →
 * economic_capacity + defense_readiness), and an `occupation_resistance` condition on the
 * OCCUPIED that GROWS when the occupied is intact/loyalist/populous/undevastated and
 * SHRINKS when devastated/compliant. OVEREXTENSION: each additional occupation an occupier
 * holds raises its per-occupation burden (too many occupations degrade the occupier). A
 * contested/resisted/distant occupation's burden is designed to outweigh its (near-zero)
 * benefit — only a STABILIZED, low-resistance occupation is net-positive.
 *
 * DETERMINISM (sacred): no Date.now/Math.random/argless new Date; pure (no rng — the
 * state machine is deterministic, like the pantheon). The ledger is deep-cloned + read-
 * last/write-next by the caller. PRE-TICK aggregation only (usefulness/resistance read
 * from the pre-tick snapshot). Codepoint-sorted iteration everywhere output order matters.
 *
 * CONDITIONAL MATERIALIZATION (byte-identity, sacred): the occupations ledger is ABSENT
 * from worldState while no occupation exists (it materializes ONLY on the first conquest),
 * so a legacy / war-off campaign carries no `occupations` key and stays byte-identical
 * under the dormancy oracle. (worldState.js deep-clones a PRESENT occupations ledger and
 * leaves an ABSENT one absent — never materializes it unconditionally, like pantheon/
 * warPosture.) GATED behind warLayerEnabled at the call site.
 */

import { clamp01 } from '../region/contestMath.js';
import { detIntPow } from '../../kernel/detMathDecay.js';
import { detLog10 } from '../../kernel/detMath.js';
import { stablePart } from './worldState.js';
// W-PEACE-2 occupation_hold: a peace that CEDES the occupation ("the garrison stays at
// the walls") must actually keep it standing after the army marches home. Read from the
// dependency-free treatyEnforcement leaf so this module never pulls the peace mover.
import { occupationHoldFor } from './treatyEnforcement.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';
import { isLiveWarFront } from './warFrontReads.js';
// W-SEAT D7 (SEAT-5): the liberation un-install. The seat leaf is already a static import
// of the sibling war kernels (deploymentReturn.js) and this module is never in the
// first-paint closure, so no chunk boundary moves; the AUTHORITY leaf below imports
// nothing at all, which is why the lift can live there and be called from both sides.
import { legitimateRemnantOf } from '../rulingPowerSeat.js';
import { OCCUPATION_LIFT_KIND, liftOccupationAuthority } from './applyWorldPulseOccupationAuthority.js';
import {
  occupationBurdenClearanceOutcome,
  occupationContext,
  recurringOccupationConditionRecordMode,
  storedOccupierBenefit,
  warSpoilsEndedOutcome,
} from './occupationRecordMode.js';
// `normalizeRelationshipEdge` / `ensureRelationshipState` / `relationshipRoles`
// were dropped from this import when SEAT-1 deleted the dead `vassalOverlordOf`
// (see the note at the foot of this file) — that function was their only reader.
import {
  relationshipKeyFromEdge,
  getRelationshipSettlements,
} from './relationshipEvolution.js';
// WR-8 amendment N — CONQUEST EXECUTION. `conquestDoctrineActive` is the flag
// chain (dark by default, and WR-8 lights LAST of the whole WR chain); the
// execution leaf is import-free and prices margins and famines from numbers this
// module has already read. DARK ⇒ neither is ever called and every expression
// below is the pre-wire one, which is what keeps the occupation ledger and its
// conditions byte-identical for every campaign that never lit it.
import { conquestDoctrineActive } from './conquestDoctrineStage.js';
import {
  conquestCeilingRank,
  conquestMarginVerdict,
  inheritanceBenefitFactor,
  inheritanceBurdenAddend,
  inheritedHunger,
} from './conquestExecution.js';
import { storageCapacityMonths } from './foodStockpile.js';

/**
 * Shared war/trade/occupation sim-shape typedefs (see ./pulseShapes.js).
 * @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot
 * @typedef {import('./pulseShapes.js').WorldState} WorldState
 * @typedef {import('./pulseShapes.js').RegionGraph} RegionGraph
 * @typedef {import('./pulseShapes.js').DeploymentRecord} DeploymentRecord
 * @typedef {import('./pulseShapes.js').OccupationRecord} OccupationRecord
 * @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome
 * @typedef {import('./pulseShapes.js').SettlementItem} SettlementItem
 */

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

// ── State machine rungs ──────────────────────────────────────────────────────────
// An ordered ladder. A conquest enters at `contested`; it climbs toward `stabilized`
// (and can convert to `vassalized`) as resistance is suppressed and a compliant regime
// is installed, and slides back down under resistance. `liberated` is the exit rung —
// a liberated occupation is removed from the ledger (it has no entry).
const STATE_LADDER = Object.freeze(['contested', 'unstable', 'extractive', 'stabilized', 'vassalized']);
/** @type {Record<string, number>} */
const STATE_RANK = Object.freeze({ contested: 0, unstable: 1, extractive: 2, stabilized: 3, vassalized: 4 });

/**
 * The benefit SCALE per state (0..1) — the DELAY term. contested yields ~0; the yield
 * rises only as the occupation stabilizes. vassalized is the steady-state max (a willing
 * client pays more reliably than a freshly-occupied town). This is what makes a just-
 * conquered settlement yield nothing — the snowball cannot start from a fresh conquest.
 */
const STATE_BENEFIT_SCALE = Object.freeze({
  contested: 0.0,
  unstable: 0.12,
  extractive: 0.45,
  stabilized: 0.85,
  vassalized: 1.0,
});

/**
 * The burden SCALE per state (0..1). A contested/unstable occupation is the HEAVIEST to
 * hold (the garrison is fighting, not extracting); a stabilized/vassalized one is cheap
 * to administer. So a contested occupation is doubly bad for the occupier — near-zero
 * benefit AND maximum burden (the burden-outweighs-benefit guarantee for a fresh/resisted
 * conquest).
 */
const STATE_BURDEN_SCALE = Object.freeze({
  contested: 1.0,
  unstable: 0.85,
  extractive: 0.55,
  stabilized: 0.30,
  vassalized: 0.18,
});

/** Typed benefit-scale lookup (0 for an unknown state). Strict-clean string indexing.
 * @param {any} state @returns {number} */
const benefitScaleFor = (state) => /** @type {Record<string, number>} */ (STATE_BENEFIT_SCALE)[String(state)] ?? 0;
/** Typed burden-scale lookup (1 — heaviest — for an unknown state). Strict-clean.
 * @param {any} state @returns {number} */
const burdenScaleFor = (state) => /** @type {Record<string, number>} */ (STATE_BURDEN_SCALE)[String(state)] ?? 1;

// ── Hysteresis + containment tunables (calibration is load-bearing). ──────────────
// STATE_HOLD_TICKS — the dwell: a state transition only lands once the suitability has
// argued for the SAME direction for this many consecutive ticks (no 1-tick flips).
const STATE_HOLD_TICKS = 2;
// The suitability margin band: advance requires suitability ≥ ADVANCE_THRESHOLD; slide
// back requires it ≤ REGRESS_THRESHOLD. The gap between them is the sticky hysteresis
// band — inside it the state holds (a small wobble changes nothing).
const ADVANCE_THRESHOLD = 0.58;
const REGRESS_THRESHOLD = 0.34;
// Below this suitability a CONTESTED occupation collapses outright → liberated (the
// occupier never established control and the settlement throws it off).
const COLLAPSE_THRESHOLD = 0.12;
// Max-dwell safety valve. A `contested` occupation whose suitability sits inside the
// hysteresis band (REGRESS_THRESHOLD < s < ADVANCE_THRESHOLD) argues NEITHER direction,
// so without this it can hold at `contested` forever — grinding out a fresh resistance
// condition every tick in an insurgency that never resolves. Once an occupation has been
// contested this many ticks it is force-resolved (see advanceOccupationState). The
// threshold sits well beyond normal campaign lengths (the 40-tick soak horizon), so
// ordinary occupations are untouched — this only closes the pathological infinite-grind.
const MAX_CONTESTED_DWELL = 48;

// ── Resistance dynamics (the occupied-side condition). ────────────────────────────
// Resistance is a 0..1 scalar on the occupation record, ratcheted each tick: it GROWS
// (toward a target ∝ the occupied's intactness/loyalty/population) and SHRINKS as the
// occupation stabilizes / the population is devastated / a compliant regime is installed.
const RESISTANCE_GROW_PER_TICK = 0.18;  // pull toward the intactness-driven target
const RESISTANCE_DECAY_PER_TICK = 0.14; // suppression/compliance erodes it
// A resistance condition is only surfaced once it clears this floor (a quiescent
// occupation does not stamp a resistance condition — byte-light).
const RESISTANCE_CONDITION_FLOOR = 0.20;

/**
 * RESISTANCE IN A WORD, quietest first (TE-HERALD-1). The reader is told what the
 * occupied town is doing, never the scalar — the scalar itself stays where a consumer
 * reads it (the record's `resistance`, and the resistance condition's own `severity`,
 * which IS this number).
 *
 * ⚠ THE CUTS ARE DECLARED AS A READING CONVENTION, NOT AS A CLAIM ABOUT THE MODEL, and
 * saying so is the point. This axis has exactly ONE engine-named landmark —
 * RESISTANCE_CONDITION_FLOOR, below which nothing is surfaced at all — so the three cuts
 * are whole multiples of that single floor rather than three new numbers invented to look
 * calibrated. Nothing branches on them; they choose a word. If the floor moves, the words
 * move with it.
 * @type {ReadonlyArray<string>}
 */
const RESISTANCE_WORDS = Object.freeze(['sullen', 'simmering', 'organized', 'in open revolt']);

/**
 * The three cuts, COMPUTED ONCE. ⚠ They are a frozen array rather than three inline
 * `FLOOR * n` expressions for a reason the band arm found: `0.2 * 3` is
 * 0.6000000000000001 in IEEE-754, so a reader naming the round value 0.6 fell on the
 * WRONG side of an inline third cut. Computing them once means the source and any proof
 * of it compare against the SAME numbers, and a consumer can derive the cuts from here
 * instead of transcribing them.
 * @type {ReadonlyArray<number>}
 */
export const OCCUPATION_RESISTANCE_CUTS = Object.freeze([
  RESISTANCE_CONDITION_FLOOR,
  RESISTANCE_CONDITION_FLOOR * 2,
  RESISTANCE_CONDITION_FLOOR * 3,
]);

/**
 * How hard the occupied town is resisting, as a word.
 * @param {number} resistance 0..1
 * @returns {string} a member of RESISTANCE_WORDS.
 */
export function resistanceWordFor(resistance) {
  const r = clamp01(resistance);
  if (r < OCCUPATION_RESISTANCE_CUTS[0]) return RESISTANCE_WORDS[0];
  if (r < OCCUPATION_RESISTANCE_CUTS[1]) return RESISTANCE_WORDS[1];
  if (r < OCCUPATION_RESISTANCE_CUTS[2]) return RESISTANCE_WORDS[2];
  return RESISTANCE_WORDS[3];
}

/** The resistance vocabulary, exported so a coverage proof reads it from source. */
export const OCCUPATION_RESISTANCE_WORDS = RESISTANCE_WORDS;

/**
 * WHAT THE CONQUESTS COST, lightest first (TE-HERALD-1). Three rungs on TWO cuts, and
 * both cuts are `PER_OCCUPATION_BURDEN_CAP` — half of it and all of it — because that
 * constant is the one meaningful UNIT on this axis: it is what a single occupation can
 * cost at its worst. So the word says how many occupations' worth of cost the occupier
 * is carrying, which is the fact the number encoded.
 * @type {ReadonlyArray<string>}
 */
export const OCCUPATION_BURDEN_WORDS = Object.freeze(['lightly', 'heavily', 'crushingly']);

/** How hard the conquests weigh, as a word. @param {number} burden 0..1 @returns {string} */
export function occupationBurdenWordFor(burden) {
  const b = clamp01(burden);
  if (b < PER_OCCUPATION_BURDEN_CAP / 2) return OCCUPATION_BURDEN_WORDS[0];
  if (b < PER_OCCUPATION_BURDEN_CAP) return OCCUPATION_BURDEN_WORDS[1];
  return OCCUPATION_BURDEN_WORDS[2];
}

/**
 * WHAT THE CONQUESTS RETURN, thinnest first (TE-HERALD-1). The two cuts are the file's
 * own two caps: `PER_OCCUPATION_BENEFIT_CAP` (all one occupation can ever yield) and
 * `OCCUPIER_BENEFIT_CONTAINMENT` (all every occupation together can ever yield). The top
 * rung therefore names the anti-snowball ceiling in words, which is exactly what the
 * retired sentence was trying to say with "HARD-CAPPED at 0.9".
 * @type {ReadonlyArray<string>}
 */
export const OCCUPATION_YIELD_WORDS = Object.freeze([
  'a thin tribute', 'a real tribute', 'everything conquest can ever return',
]);

/** What the occupations yield, as a word. @param {number} yield01 0..1 @returns {string} */
export function occupationYieldWordFor(yield01) {
  const y = clamp01(yield01);
  if (y < PER_OCCUPATION_BENEFIT_CAP) return OCCUPATION_YIELD_WORDS[0];
  if (y < OCCUPIER_BENEFIT_CONTAINMENT) return OCCUPATION_YIELD_WORDS[1];
  return OCCUPATION_YIELD_WORDS[2];
}

// ── Benefit caps (THE ANTI-SNOWBALL). ─────────────────────────────────────────────
// PER_OCCUPATION_BENEFIT_CAP — the most one occupation can EVER yield (0..1 war-support
// units), before the per-occupier containment. OCCUPIER_BENEFIT_CONTAINMENT — the HARD
// CAP on the SUM of all of an occupier's occupations' yields. This is the pantheon
// containment idiom: no matter how many settlements an occupier holds, its TOTAL benefit
// is bounded by OCCUPIER_BENEFIT_CONTAINMENT, so occupations cannot compound into
// unbounded strength. (Diminishing returns are applied BEFORE the cap so the cap is a
// hard ceiling, not just an asymptote.)
const PER_OCCUPATION_BENEFIT_CAP = 0.45;
const OCCUPIER_BENEFIT_CONTAINMENT = 0.9;
// Diminishing returns: each additional occupation contributes LESS to the total benefit
// (the occupier's administrative bandwidth is finite). The Nth occupation (sorted by
// yield, richest first) is discounted by DIMINISHING_BASE^(rank). Combined with the
// containment cap this guarantees a strictly bounded, converging total.
const DIMINISHING_BASE = 0.62;

// ── Burden caps + overextension. ──────────────────────────────────────────────────
// PER_OCCUPATION_BURDEN_CAP — the most one occupation can cost the occupier (0..1).
// OVEREXTENSION_PER_OCCUPATION — each occupation an occupier holds raises the per-
// occupation burden by this much (so the 4th occupation is costlier to hold than the
// 1st). UNLIKE the benefit (which is hard-capped at the occupier total), the burden is
// NOT total-capped — it scales with the count, so a greedy occupier degrades itself.
const PER_OCCUPATION_BURDEN_CAP = 0.6;
const OVEREXTENSION_PER_OCCUPATION = 0.12;

// The benefit→exhaustion-relief conversion. A unit of benefit eases this much
// war_exhaustion-equivalent severity on the occupier (the war_spoils condition is the
// inverse of war_exhaustion: it EXTENDS supply endurance). Bounded by the cap above.
const BENEFIT_RELIEF_SCALE = 0.55;

// ── THE POSTURE (W-SEAT D3 / SEAT-3) ──────────────────────────────────────────────
/**
 * ⭐ WHAT THE POSTURE IS FOR, IN ONE SENTENCE: the ladder conflates how much CONTROL an
 * occupier has with how it TREATS the town, and the owner's directive (§735.2) asks for
 * "a mixed responsibility to cultivate and exploit" — a CHOICE. `extractive` is a rung the
 * machine climbs through, not a policy anyone picked; this axis is the policy.
 *
 * ⛔ IT TILTS THE CLASSIFIER'S INPUTS AND NEVER FORKS A SECOND STATE MACHINE (volume §3-D3).
 * There is exactly one ladder, one hysteresis and one set of rungs; posture moves the
 * SUITABILITY and the RESISTANCE KINETICS that feed them, which is why exploit is a wasting
 * asset (more now, a town that fights harder and stabilizes slower) and cultivate is the
 * honest road to `vassalized` (less now, resistance that decays, suitability that climbs).
 *
 * ⚠ THE VOLUME SAID "MODULATE THE EXISTING CONSTANTS" AND THAT WAS NOT ACHIEVABLE AS
 * WRITTEN — measured. The coefficients this axis has to tilt are INLINE UNNAMED LITERALS:
 * `stabilizationSuitability`'s `0.7 / 0.22 / 0.12` and `advanceResistance`'s `1.4 / 0.5`
 * are spelled in the expressions themselves, so there was nothing named to modulate. The
 * tables below are therefore MINTED rather than reused, and each is a multiplier or an
 * addend ON an existing term rather than a replacement FOR one — the distinction that keeps
 * `administer` an exact identity.
 * @type {ReadonlyArray<string>}
 */
export const OCCUPATION_POSTURES = Object.freeze(['exploit', 'administer', 'cultivate']);

/**
 * ⛔ THE DEFAULT IS THE CONSTANT `administer`, AND IT IS A CONSTANT BY RULING (A1.2.11) —
 * NEVER DERIVED FROM THE OCCUPIER'S DISPOSITION. A disposition-derived default oscillates
 * with a score that moves for unrelated reasons, so a court that chose nothing would appear
 * to keep changing its mind; worse, it FABRICATES a policy nobody adopted and then narrates
 * it. A non-default band exists only after that court's own receipted decision.
 */
export const OCCUPATION_POSTURE_DEFAULT = 'administer';

/**
 * The ADDEND on `stabilizationSuitability`. Exploit makes a town harder to hold; cultivate
 * makes it easier. Sized well under the hysteresis band's own width
 * (ADVANCE 0.58 − REGRESS 0.34 = 0.24) so a posture BIASES the ladder rather than
 * overriding it — the rung must still be earned through the dwell.
 * @type {Readonly<Record<string, number>>}
 */
const POSTURE_SUITABILITY_ADJ = Object.freeze({ exploit: -0.08, administer: 0, cultivate: 0.08 });

/**
 * The multipliers on the two resistance kinetics. These are deliberately RECIPROCAL-ISH
 * rather than independent: an exploiting occupier both breeds grievance faster and suppresses
 * it more slowly, which is the same fact seen from two sides, and letting them drift apart
 * would let a tuning pass build a posture that is somehow good at both.
 * @type {Readonly<Record<string, number>>}
 */
const POSTURE_RESISTANCE_GROW_MULT = Object.freeze({ exploit: 1.3, administer: 1, cultivate: 0.7 });
/** @type {Readonly<Record<string, number>>} */
const POSTURE_RESISTANCE_DECAY_MULT = Object.freeze({ exploit: 0.7, administer: 1, cultivate: 1.3 });

/**
 * Resolve the posture a record is under, for ONE tick's arithmetic.
 *
 * ⛔ THE GATE LIVES HERE AND NOWHERE ELSE. `evaluateOccupations` is the single caller that
 * has `rules` in scope, so the flag is read ONCE per record and the modulated functions
 * below take the RESOLVED posture rather than the record's raw field. That is what makes
 * A1.2.11's dark clause literally true rather than approximately true: with the key dark
 * the field is NEVER READ AT ALL — not read-and-ignored — so a world that was lit, chose a
 * posture, and was unlit again behaves exactly like a world that never chose one, and the
 * `present-field-dark` fixture proves it rather than asserting it.
 *
 * ⛔ The positive `=== true` spelling is what the engine-gated-key census can see; a
 * negative-polarity early return is invisible to it (SEAT-1 paid a red for that).
 *
 * @param {{ posture?: unknown } | null | undefined} record
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {string} a member of OCCUPATION_POSTURES; the default for absent/garbage/dark
 */
export function occupationPostureOf(record, rules) {
  if (!rules || typeof rules !== 'object') return OCCUPATION_POSTURE_DEFAULT;
  if (/** @type {Record<string, unknown>} */ (rules).foreignSeatEnabled !== true) return OCCUPATION_POSTURE_DEFAULT;
  const raw = record && typeof record === 'object' ? String(record.posture ?? '') : '';
  return OCCUPATION_POSTURES.includes(raw) ? raw : OCCUPATION_POSTURE_DEFAULT;
}

/**
 * Reader-facing prose for each posture. SCALAR-FREE by the estate's reader-text law — no
 * digits, no percentages, no tuning vocabulary — because this rides a receipt a player
 * reads, not a debug line.
 * @type {Readonly<Record<string, string>>}
 */
const POSTURE_PROSE = Object.freeze({
  exploit: 'take what it can while it can, and let the town resent it.',
  administer: 'hold it steadily, taking neither more nor less than the occupation costs.',
  cultivate: 'spend on the place and win it over, in the hope of keeping it for good.',
});

/**
 * The two thresholds the occupier's court weighs when it sets a policy. Both are read off
 * the OCCUPATION's own measured state — the town's usefulness and how hard it is fighting —
 * rather than off any score that moves for unrelated reasons.
 *
 * ⛔⛔ BOTH NUMBERS ARE SET FROM A MEASURED DISTRIBUTION, NOT CHOSEN, AND THE FIRST DRAFT OF
 * ONE OF THEM WAS DEAD ON ARRIVAL. `POSTURE_RICH_AT` was first written as a round `0.6`.
 * Swept over the whole tier × prosperity × legitimacy grid the corpus produces (320 cells),
 * `occupiedUsefulness` spans **0.3177 → 0.6060** with p50 0.4649 and p75 0.5114 — so a 0.6
 * gate was above the ninety-ninth percentile and the `exploit` arm would have fired for
 * essentially nothing while passing every existence census that asked only whether the
 * branch was reachable. That is the recorded hazard verbatim: A SHAPE THE CORPUS NEVER
 * PRODUCES LOOKS CLEAN. The value below is the measured p75 — the genuinely large-and-rich
 * quarter of the ladder — and it was caught by a probe before a single test was written.
 *
 * `resistanceTarget` over the same grid spans 0.1170 → 0.7730 (p50 0.3223, p75 0.5298), and
 * a fresh conquest starts at 0.35, so 0.45 sits between the median and the upper quartile:
 * a town has to be genuinely fighting, not merely sullen, and roughly the top third can get
 * there. Both are re-measurable by the same sweep; neither may be rounded to a nicer number
 * without re-running it.
 */
const POSTURE_RESTIVE_AT = 0.45;   // above this the town is fighting, not merely sullen
const POSTURE_RICH_AT = 0.51;      // above this the town is worth stripping (measured p75)

/**
 * THE DECISION — what an occupier's court chooses when it is actually presented with the
 * question. Pure; returns a member of OCCUPATION_POSTURES.
 *
 * ⛔ THIS IS THE **CHOICE**, NOT THE **DEFAULT**, AND A1.2.11 BANS ONLY THE SECOND. The
 * amendment forbids a disposition-DERIVED default because a court that chose nothing would
 * otherwise appear to keep changing its mind as an unrelated score drifted, and because it
 * fabricates a policy nobody adopted. Absent a decision the answer stays the CONSTANT
 * `administer`. But a decision a court actually takes is allowed to be reasoned — that is
 * what every autonomous decision in this engine is, `occupation_vassalized` included.
 *
 * ⚠ THE OSCILLATION THE AMENDMENT FEARED IS CLOSED STRUCTURALLY, NOT BY TUNING: the mint
 * fires only when the occupation ARRIVES at a new rung of `extractive` or better, so a
 * court is asked at most three times in an occupation's whole life and never on a quiet
 * tick. The rung change IS the occasion — before `extractive` the occupier is still
 * fighting for control and has no yield to have a policy about (the benefit scale is 0.12
 * and below), and each climb materially changes the question.
 *
 * @param {number} usefulness01  the occupied town's economic worth to a holder
 * @param {number} resistance01  the occupied town's resistance AFTER this tick's advance
 * @returns {string}
 */
export function occupationPostureChoice(usefulness01, resistance01) {
  const restive = clamp01(num(resistance01));
  const useful = clamp01(num(usefulness01));
  // A town that is fighting must be won over or lost; stripping it feeds the fight.
  if (restive >= POSTURE_RESTIVE_AT) return 'cultivate';
  // A rich, quiet town is what an occupier came for.
  if (useful >= POSTURE_RICH_AT) return 'exploit';
  return OCCUPATION_POSTURE_DEFAULT;
}

/** @param {any} v @param {number} [d] @returns {number} */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/**
 * A fresh occupation record at the `contested` rung. `resistance` starts moderate (a
 * just-conquered population has not yet organized, but the conquest itself breeds it).
 * @param {string} occupierId
 * @param {number} tick
 * @returns {{ occupierId: string, state: string, sinceTick: number, stateHeld: number, resistance: number, benefitYield: number, lastTick: number }}
 */
export function createOccupationRecord(occupierId, tick) {
  return {
    occupierId: String(occupierId),
    state: 'contested',
    sinceTick: Math.max(0, Math.floor(num(tick))),
    stateHeld: 0,
    resistance: 0.35,
    benefitYield: 0,
    lastTick: Math.max(0, Math.floor(num(tick))),
  };
}

/**
 * THE CONVEYANCE REWRITE (WR-10 amendment S) — one overlord replaces another on an
 * EXISTING vassalage, and the rung survives the sale.
 *
 * This is deliberately NOT createOccupationRecord. That path mints a FRESH conquest at
 * `contested` with resistance 0.35, and routing a sale through it would silently undo
 * every tick of stabilization the seller paid for — the buyer would receive a fight
 * instead of the holding it bought, and `readSovereigntyAsset` would stop calling the
 * settlement conveyable the instant the ink dried. Only `vassalized` is conveyable
 * (sovereigntyAssets.js), so `state` is carried across UNCHANGED and the ladder's own
 * machinery keeps running from where the seller left it.
 *
 * WHAT DOES change is the clock and the consent. `sinceTick` restarts because the new
 * overlordship is a new tenure; `stateHeld` returns to zero so the buyer must re-earn
 * any transition through the ordinary hysteresis dwell; and `resistance` is RAISED to a
 * floor — a town that learns it was sold is less governable than one that merely lost a
 * war, and that fragility is the durable half of the sale (the score echo on
 * publicLegitimacy is generated and declared regen-volatile; this field is campaign
 * state and survives). The floor is a FLOOR, never a set: an already-restive vassal is
 * left where it is rather than calmed by being sold. Pulling the value the rest of the
 * way toward the occupied settlement's own `resistanceTarget` is deliberately left to
 * `advanceResistance`, which already owns that law — a second pull here would be a
 * second spelling of one rule.
 *
 * PURE: returns a new record; no rng, no wall-clock, no mutation of the input.
 *
 * @param {{ occupierId?: unknown, state?: unknown, resistance?: unknown }} record the LIVE occupation
 * @param {string} buyerId the acquiring overlord
 * @param {number} tick
 * @param {number} resistanceStart the fragility FLOOR (0..1) — an unsoaked §7 band
 * @returns {Record<string, unknown>}
 */
export function conveyOccupationRecord(record, buyerId, tick, resistanceStart) {
  const t = Math.max(0, Math.floor(num(tick)));
  // ⛔ W-SEAT D3 (SEAT-3): THE POSTURE DOES **NOT** RIDE ACROSS A SALE, and this is a
  // deliberate divergence from the "unrelated fields ride across untouched" precedent
  // (`sovereigntyTransferWr10w.test.js` asserts it for `benefitYield`). Posture is not an
  // unrelated field — it is the ONE field on this record that encodes a DECISION, and
  // A1.2.11's whole ruling is that a non-default band exists only after a court's own
  // receipted decision. A buyer inheriting the seller's policy is precisely the fabricated
  // un-chosen policy the amendment forbids, arriving through a door the amendment did not
  // think to close. The docstring above already says what a sale changes: "the clock and
  // the consent" — and a posture IS consent. Dropping it returns the holding to the derived
  // default until the buyer's own court is asked, which the ladder will do the next time
  // the occupation climbs a rung. Absent ⇒ `administer`, so this costs no byte either way.
  const { posture: _soldPosture, ...carried } = /** @type {Record<string, unknown>} */ (record ?? {});
  return {
    ...carried,
    occupierId: String(buyerId),
    state: String(record?.state ?? ''),
    sinceTick: t,
    stateHeld: 0,
    resistance: Math.max(clamp01(num(record?.resistance)), clamp01(num(resistanceStart))),
    lastTick: t,
  };
}

/**
 * The numeric rung of a state label. Unknown labels resolve to the `contested` floor.
 * @param {string} state
 * @returns {number}
 */
function stateRank(state) {
  const r = STATE_RANK[state];
  return Number.isFinite(r) ? r : 0;
}

/**
 * The 0..1 USEFULNESS of an occupied settlement — the CONDITIONAL term of the benefit
 * loop. Reads the military-capacity facets (manpower/institutions/materiel/logistics/
 * economy/will) which already fold in tier/pop/economic_capacity/food/military &
 * defensive institutions/war-materiel/trade — exactly the proposal's usefulness list.
 * DEVASTATION (a heavy war_pressure / population collapse on the occupied) lowers it. A
 * pure read of the pre-tick snapshot item. The benefit a stabilized occupation yields is
 * proportional to THIS — a rich, intact city is worth occupying; a devastated thorpe is not.
 *
 * @param {any} item  the occupied settlement's pre-tick snapshot item.
 * @returns {number} 0..1
 */
export function occupiedUsefulness(item) {
  if (!item) return 0;
  const economicCapacityScore = item?.causal?.scores?.economic_capacity;
  const model = deriveMilitaryCapacity(item, {
    economicCapacityScore: Number.isFinite(economicCapacityScore) ? economicCapacityScore : undefined,
  });
  // theoreticalCapacity already weighs tier/pop/institutions/materiel/logistics/economy/
  // will into one 0..100 number — the latent worth of holding this settlement. Normalize.
  let usefulness = clamp01(num(model.theoreticalCapacity) / 100);
  // Devastation discount: a settlement ground down by the conquest (heavy war_pressure)
  // is worth less to extract from — scorched earth lowers the prize.
  const conditions = Array.isArray(item?.activeConditions) ? item.activeConditions : [];
  let devastation = 0;
  for (const c of conditions) {
    if (c?.archetype === 'war_pressure') devastation = Math.max(devastation, num(c.severity));
  }
  usefulness = clamp01(usefulness * (1 - 0.4 * clamp01(devastation)));
  return usefulness;
}

/**
 * The 0..1 RESISTANCE TARGET for an occupied settlement — what resistance trends toward.
 * Resistance GROWS when the occupied is INTACT (high usefulness/population, not
 * devastated) and LOYALIST (strong governing legitimacy — a populace that backed its old
 * rulers resents the occupier). It is LOW when the settlement is devastated/compliant.
 * Pure read of the pre-tick item.
 *
 * @param {any} item
 * @returns {number} 0..1
 */
export function resistanceTarget(item) {
  if (!item) return 0;
  const usefulness = occupiedUsefulness(item);
  // Loyalty: public legitimacy of the (pre-occupation) order — a legitimate prior regime
  // leaves a populace more willing to resist. Read the settlement's legitimacy score.
  const legit = num(item?.settlement?.powerStructure?.publicLegitimacy?.score, 50) / 100;
  // Population mass: a populous town can field a resistance; a hamlet cannot sustain one.
  const popRaw = item?.settlement?.population;
  const pop = typeof popRaw === 'number' ? popRaw : num(popRaw?.total, 0);
  const popMass = pop > 0 ? clamp01(detLog10(Math.max(10, pop)) / 5) : 0;
  // Intact, loyalist, populous → high resistance target. Weighted blend, 0..1.
  let target = clamp01(0.5 * usefulness + 0.3 * clamp01(legit) + 0.2 * popMass);
  // A COMPLIANT (installed-puppet) regime dampens the will to resist — the occupier has a
  // local government doing its bidding, so even a populous loyalist town's resistance
  // trends LOWER. This is what lets a compliant occupation break out of `contested` and
  // stabilize (vs an intact, un-co-opted population that resists indefinitely).
  if (hasCompliantRegime(item)) target = clamp01(target * 0.45);
  return target;
}

/**
 * Does the occupied settlement carry a COMPLIANT (installed/puppet) regime? An occupation
 * authority faction with the 'occupier' modifier present AND governing-side factions
 * already disarmed signals a compliant regime is in place — which SUPPRESSES resistance
 * and SPEEDS stabilization. Pure read of the pre-tick item's powerStructure.
 * @param {any} item
 * @returns {boolean}
 */
function hasCompliantRegime(item) {
  const factions = item?.settlement?.powerStructure?.factions;
  if (!Array.isArray(factions)) return false;
  const hasOccupier = factions.some((/** @type {any} */ f) => Array.isArray(f?.modifiers) && f.modifiers.includes('occupier'));
  const localsSubdued = factions.some((/** @type {any} */ f) => Array.isArray(f?.modifiers) && (f.modifiers.includes('occupied') || f.modifiers.includes('disarmed')));
  return hasOccupier && localsSubdued;
}

/**
 * The 0..1 SUITABILITY for ADVANCING an occupation toward stabilization this tick — the
 * input to the state-machine hysteresis. HIGH when resistance is low, a compliant regime
 * is installed, and the occupier still physically holds it (an army still there or the
 * occupation freshly secured); LOW when resistance is high. The state machine advances
 * when suitability ≥ ADVANCE_THRESHOLD, regresses when ≤ REGRESS_THRESHOLD, holds inside
 * the band. Pure.
 *
 * ⭐ W-SEAT D3: the POSTURE biases this, and the `administer` branch is the pre-posture
 * expression VERBATIM rather than the same expression plus a zero. `x + 0 === x` is exact
 * for every finite double, so the arithmetic would have been safe either way — but a
 * literal early return is bit-identity BY CONSTRUCTION, and this value feeds a hysteresis
 * whose thresholds decide a persisted rung on every existing save.
 *
 * @param {{ resistance: number }} record
 * @param {any} occupiedItem
 * @param {boolean} occupierStillPresent  is the occupier's army still committed here?
 * @param {string} [posture]  the RESOLVED posture (see `occupationPostureOf`); the default
 *   is the identity, so every pre-SEAT-3 3-arg caller is unchanged.
 * @returns {number} 0..1
 */
export function stabilizationSuitability(record, occupiedItem, occupierStillPresent, posture = OCCUPATION_POSTURE_DEFAULT) {
  const resistance = clamp01(num(record?.resistance));
  const compliant = hasCompliantRegime(occupiedItem) ? 0.22 : 0;
  // Garrison presence helps hold the ground while stabilizing.
  const garrison = occupierStillPresent ? 0.12 : 0;
  // Suitability falls ~1:1 with resistance; compliance + garrison lift it.
  if (posture === OCCUPATION_POSTURE_DEFAULT) return clamp01(0.7 - resistance + compliant + garrison);
  return clamp01(0.7 - resistance + compliant + garrison + (POSTURE_SUITABILITY_ADJ[posture] ?? 0));
}

/**
 * Advance ONE occupation's RESISTANCE for the tick (read-last/write-next). Resistance
 * grows toward its target (intact/loyalist/populous) and decays with suppression
 * (compliant regime) and state (a stabilized occupation has broken the resistance). The
 * net move is bounded per tick. Pure; returns the next resistance 0..1.
 *
 * ⭐ W-SEAT D3: the POSTURE scales BOTH kinetics, and it is the sharper half of the axis —
 * §736's own words are that an occupied town's rebellion risk reads resistance, and
 * "extractive raises it, cultivate dampens". The `administer` branch is the pre-posture
 * expression VERBATIM: multiplying by an exact 1.0 is bit-safe, but this value is PERSISTED
 * on the record and compounds tick over tick, so a literal branch is the honest instrument.
 *
 * ⚠ THE GROW TERM KEEPS ITS `Math.min(…, target − prev)` CEILING **OUTSIDE** THE POSTURE
 * MULTIPLIER, so an exploiting occupier can approach the resistance target FASTER but can
 * never OVERSHOOT it. Scaling after the clamp would have let a posture push resistance past
 * the town's own intactness-driven target — inventing grievance the settlement's inputs do
 * not support, and quietly making the target stop being a target.
 *
 * @param {{ resistance: number, state: string }} record
 * @param {any} occupiedItem
 * @param {string} [posture]  the RESOLVED posture; the default is the identity.
 * @returns {number} 0..1
 */
export function advanceResistance(record, occupiedItem, posture = OCCUPATION_POSTURE_DEFAULT) {
  const prev = clamp01(num(record?.resistance));
  const target = resistanceTarget(occupiedItem);
  const compliant = hasCompliantRegime(occupiedItem);
  // The state itself suppresses resistance as the occupation matures (a vassalized client
  // resists least). The benefit scale (0 at contested → 1 at vassalized) is the maturity
  // proxy; (1 − scale) is how much the occupation is "still fighting" rather than holding.
  const stateSuppress = clamp01(1 - benefitScaleFor(record?.state));
  // Grow toward target; decay from suppression. A compliant regime accelerates the decay.
  if (posture === OCCUPATION_POSTURE_DEFAULT) {
    const grow = prev < target ? Math.min(RESISTANCE_GROW_PER_TICK, target - prev) * clamp01(stateSuppress) : 0;
    const decay = RESISTANCE_DECAY_PER_TICK * (compliant ? 1.4 : 1) * (1 - clamp01(stateSuppress) * 0.5);
    return clamp01(prev + grow - decay);
  }
  const growMult = POSTURE_RESISTANCE_GROW_MULT[posture] ?? 1;
  const decayMult = POSTURE_RESISTANCE_DECAY_MULT[posture] ?? 1;
  const grow = prev < target
    ? Math.min(RESISTANCE_GROW_PER_TICK * growMult, target - prev) * clamp01(stateSuppress)
    : 0;
  const decay = RESISTANCE_DECAY_PER_TICK * decayMult * (compliant ? 1.4 : 1) * (1 - clamp01(stateSuppress) * 0.5);
  return clamp01(prev + grow - decay);
}

/**
 * Advance ONE occupation's STATE for the tick, applying the hysteresis dwell + a single-
 * rung-per-tick bound + the collapse→liberated exit. Pure. Returns the next state, the
 * next dwell counter, and whether the occupation was LIBERATED (it should exit the ledger).
 *
 * - suitability ≥ ADVANCE_THRESHOLD argues UP one rung; ≤ REGRESS_THRESHOLD argues DOWN
 *   one rung; inside the band the state holds (dwell resets).
 * - A transition only LANDS once the same direction has been argued for STATE_HOLD_TICKS
 *   consecutive ticks (the dwell). At most ONE rung of movement per tick.
 * - A `contested` occupation whose suitability collapses below COLLAPSE_THRESHOLD is
 *   LIBERATED outright (the occupier never took hold). A regression BELOW `contested`
 *   (rank 0) is likewise a liberation.
 * - A `contested` occupation stuck in the hysteresis dead-band for MAX_CONTESTED_DWELL
 *   ticks is force-resolved (max-dwell valve): it breaks through one rung if it leans
 *   toward control (suitability ≥ the band midpoint), else it is liberated. Requires
 *   `tick` (the current tick) + the record's `sinceTick`; omit `tick` and the valve is
 *   inert (pure unit calls stay 2-arg).
 *
 * @param {{ state: string, stateHeld: number, sinceTick?: number }} record
 * @param {number} suitability  0..1 from stabilizationSuitability.
 * @param {number|null} [tick]  current tick; enables the max-dwell valve.
 * @returns {{ state: string, stateHeld: number, liberated: boolean }}
 */
export function advanceOccupationState(record, suitability, tick = null) {
  const curRank = stateRank(record?.state);
  const curTier = STATE_LADDER[curRank];
  const s = clamp01(suitability);

  // Collapse: a contested occupation with no control left is thrown off entirely.
  if (curTier === 'contested' && s <= COLLAPSE_THRESHOLD) {
    return { state: 'contested', stateHeld: 0, liberated: true };
  }

  // Which direction does suitability argue for this tick?
  let dir = 0;
  if (s >= ADVANCE_THRESHOLD && curRank < STATE_LADDER.length - 1) dir = +1;
  else if (s <= REGRESS_THRESHOLD) dir = -1;

  if (dir === 0) {
    // Max-dwell valve: a contested occupation that has argued neither direction for
    // MAX_CONTESTED_DWELL ticks is force-resolved so the insurgency can't grind forever.
    // Lean on the band: above the midpoint the occupier is (barely) prevailing, so it
    // breaks through one rung; at or below, the settlement throws the occupation off.
    if (curTier === 'contested' && tick != null) {
      const sinceTick = num(record?.sinceTick);
      if (Number.isFinite(sinceTick) && tick - sinceTick >= MAX_CONTESTED_DWELL) {
        const midpoint = (REGRESS_THRESHOLD + ADVANCE_THRESHOLD) / 2;
        if (s >= midpoint && curRank < STATE_LADDER.length - 1) {
          return { state: STATE_LADDER[curRank + 1], stateHeld: 0, liberated: false };
        }
        return { state: 'contested', stateHeld: 0, liberated: true };
      }
    }
    // Inside the sticky band — hold, reset the dwell.
    return { state: curTier, stateHeld: 0, liberated: false };
  }

  // A direction is argued. The dwell counts CONSECUTIVE same-direction ticks. We store a
  // SIGNED dwell: positive for advance-pressure, negative for regress-pressure, so a
  // flip of direction resets it (belt-and-suspenders against oscillation).
  const prevHeld = num(record?.stateHeld);
  const sameDir = Math.sign(prevHeld) === dir;
  const nextHeld = (sameDir ? prevHeld : 0) + dir;
  if (Math.abs(nextHeld) < STATE_HOLD_TICKS) {
    // Not matured yet — hold the state, carry the dwell.
    return { state: curTier, stateHeld: nextHeld, liberated: false };
  }

  // Matured — move ONE rung in the argued direction; reset the dwell.
  const nextRank = curRank + dir;
  if (nextRank < 0) {
    // Regressed below contested → liberated.
    return { state: 'contested', stateHeld: 0, liberated: true };
  }
  return { state: STATE_LADDER[Math.min(STATE_LADDER.length - 1, nextRank)], stateHeld: 0, liberated: false };
}

/**
 * Compute the CAPPED/DELAYED/CONDITIONAL benefit each occupier draws this tick, from the
 * NEXT-tick occupation ledger (states + resistance already advanced) and the pre-tick
 * snapshot (usefulness). THE ANTI-SNOWBALL lives here:
 *
 *   rawYield(occ) = usefulness(occupied) × STATE_BENEFIT_SCALE[state] × (1 − resistance)
 *   per-occupation cap  → min(rawYield, PER_OCCUPATION_BENEFIT_CAP)
 *   per occupier: sort its occupations richest-first, apply DIMINISHING_BASE^rank, SUM,
 *                 then HARD-CAP the sum at OCCUPIER_BENEFIT_CONTAINMENT.
 *
 * The containment cap is the keystone: an occupier's TOTAL benefit is bounded regardless
 * of how many settlements it holds, so occupations cannot compound into unbounded strength.
 *
 * @param {Record<string, OccupationRecord>} occupations  the NEXT-tick ledger (post state/resistance advance).
 * @param {(id:string)=>any} occupiedItemFor  pre-tick snapshot item for an occupied id.
 * @returns {{ perOccupier: Record<string, number>, perOccupation: Record<string, number> }}
 *   perOccupier: occupierId → total capped benefit (0..OCCUPIER_BENEFIT_CONTAINMENT).
 *   perOccupation: occupiedId → that occupation's (pre-diminishing, per-occupation-capped) yield.
 */
export function computeOccupierBenefit(occupations, occupiedItemFor) {
  /** @type {Record<string, number>} */
  const perOccupation = {};
  /** @type {Record<string, Array<{ occupiedId: string, yield: number }>>} */
  const byOccupier = {};
  // Codepoint-sorted occupied ids → deterministic aggregation.
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    const scale = benefitScaleFor(rec.state);
    if (scale <= 0) { perOccupation[occupiedId] = 0; continue; }
    const usefulness = occupiedUsefulness(occupiedItemFor(occupiedId));
    const resistance = clamp01(num(rec.resistance));
    // CONDITIONAL: ∝ usefulness × (1 − resistance); DELAYED: × state scale.
    const raw = usefulness * scale * (1 - resistance);
    const capped = Math.min(PER_OCCUPATION_BENEFIT_CAP, clamp01(raw));
    perOccupation[occupiedId] = capped;
    const occId = String(rec.occupierId);
    (byOccupier[occId] = byOccupier[occId] || []).push({ occupiedId, yield: capped });
  }

  /** @type {Record<string, number>} */
  const perOccupier = {};
  for (const occupierId of Object.keys(byOccupier).sort(codepoint)) {
    // Richest occupation first (so the diminishing discount hits the marginal ones),
    // codepoint tie-break for determinism.
    const list = byOccupier[occupierId].sort((a, b) => (b.yield - a.yield) || codepoint(a.occupiedId, b.occupiedId));
    let total = 0;
    for (let rank = 0; rank < list.length; rank += 1) {
      total += list[rank].yield * detIntPow(DIMINISHING_BASE, rank);
    }
    // HARD CONTAINMENT CAP — the anti-snowball ceiling.
    perOccupier[occupierId] = Math.min(OCCUPIER_BENEFIT_CONTAINMENT, total);
  }
  return { perOccupier, perOccupation };
}

/**
 * Compute the BURDEN each occupier pays this tick — garrison + admin cost per occupation,
 * scaled by the occupation STATE (a contested occupation is the heaviest) and by
 * OVEREXTENSION (each occupation an occupier holds raises the per-occupation burden). The
 * burden is NOT total-capped: it scales with the count, so a greedy occupier degrades
 * itself (the overextension property). Returns occupierId → total burden severity.
 *
 * @param {Record<string, OccupationRecord>} occupations  the NEXT-tick ledger.
 * @returns {Record<string, number>}
 */
export function computeOccupierBurden(occupations) {
  /** @type {Record<string, Array<any>>} */
  const byOccupier = {};
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    (byOccupier[String(rec.occupierId)] = byOccupier[String(rec.occupierId)] || []).push(rec);
  }
  /** @type {Record<string, number>} */
  const out = {};
  for (const occupierId of Object.keys(byOccupier).sort(codepoint)) {
    const list = byOccupier[occupierId];
    const count = list.length;
    // Overextension: holding N occupations raises EACH occupation's burden.
    const overextension = OVEREXTENSION_PER_OCCUPATION * Math.max(0, count - 1);
    let total = 0;
    for (const rec of list) {
      const stateBurden = burdenScaleFor(rec.state);
      const resistance = clamp01(num(rec.resistance));
      // A resisted occupation is heavier (suppression ties down more force).
      const per = Math.min(PER_OCCUPATION_BURDEN_CAP, clamp01(0.18 * stateBurden + 0.5 * stateBurden * resistance + overextension));
      total += per;
    }
    out[occupierId] = total;
  }
  return out;
}

/**
 * Is `occupiedId` still physically occupied by `occupierId`'s army (a war_front / committed
 * deployment from the occupier onto it)? A liberated/relieved occupation loses this. Used to
 * tilt the stabilization suitability (a garrison helps hold the ground). Pure read of the
 * post-mint graph + deployments.
 * @param {RegionGraph} graph
 * @param {Record<string, DeploymentRecord>} deployments
 * @param {string} occupierId
 * @param {string} occupiedId
 * @returns {boolean}
 */
function occupierStillPresent(graph, deployments, occupierId, occupiedId) {
  const dep = deployments?.[occupierId];
  if (dep?.targetId && String(dep.targetId) === String(occupiedId)) return true;
  for (const channel of graph?.channels || []) {
    // Provenance-gated (warFrontReads): a pure hostile-RELATIONSHIP front between the
    // occupier and occupied is not a garrison presence. Reading it as one faked a
    // permanent occupier-present garrison bonus with no army committed.
    if (!isLiveWarFront(channel)) continue;
    if (String(channel.from) === String(occupierId) && String(channel.to) === String(occupiedId)) return true;
  }
  return false;
}

/**
 * A condition outcome (the coup-verdict / war-layer shape). Flows through
 * applyWorldPulseOutcomes UNCHANGED.
 * @param {{ id: string, archetype: string, targetSaveId: string, severity: number, headline: string, summary: string, reasons: string[], tick: number, sourceEventTargetId: string, causes: any[], recordMode?: string }} args
 */
function conditionOutcome({ id, archetype, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, causes, recordMode }) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `occupation_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity: clamp01(severity),
    headline,
    summary,
    reasons,
    ...(recordMode ? { recordMode } : {}),
    condition: {
      archetype,
      severity: clamp01(severity),
      triggeredAt: { tick, sourceEventType: 'OCCUPATION_LAYER', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * The set of occupied settlement ids that this tick's conquests just created — each
 * conquest power_transfer (cause:'conquest') from the war layer seeds a fresh `contested`
 * occupation keyed by the conquered target, occupied by the toPower's occupier. Read from
 * the war layer's outcomes. Returns [{ occupiedId, occupierId }].
 *
 * @param {any[]} warOutcomes  evaluateWarLayer().outcomes
 * @returns {Array<{ occupiedId: string, occupierId: string }>}
 */
export function freshConquestsFrom(warOutcomes = []) {
  /** @type {Array<{ occupiedId: string, occupierId: string }>} */
  const out = [];
  for (const o of warOutcomes) {
    if (o?.type !== 'power_transfer' || o?.powerTransfer?.cause !== 'conquest') continue;
    const occupiedId = o.targetSaveId != null ? String(o.targetSaveId) : null;
    // The occupier id is stamped on the conquest's condition cause source (the occupier's
    // save id) — warDeployment emits `causes:[{ source: occupierId, ... }]`.
    const occupierId = o?.condition?.causes?.[0]?.source != null ? String(o.condition.causes[0].source) : null;
    if (occupiedId && occupierId) out.push({ occupiedId, occupierId });
  }
  return out.sort((a, b) => codepoint(a.occupiedId, b.occupiedId));
}

/**
 * THE LIBERATION TRANSFER (W-SEAT D7 / SEAT-5) — the payload that turns a liberation from
 * a six-tick condition into a roster the town can live in. ONE derivation, consumed by
 * BOTH `occupation_lifted` producers (this module's resistance collapse and
 * `deploymentReturn`'s returning host), so the two paths can never drift apart.
 *
 * ⭐ THE ORDER IS LOAD-BEARING AND IT IS THE OPPOSITE OF THE OBVIOUS ONE. The remnant is
 * resolved on the roster AS IT WILL BE AFTER THE LIFT, never on the cut one. On the
 * measured conquest fixture the cut roster ranks Merchant Guilds (16) above The Garrison
 * (8) — but the garrison is at 8 only because the occupier disarmed it, and restoring it
 * puts it at 27. Choosing on the cut roster would let the occupier pick the town's next
 * government from beyond the grave, which is precisely the authority D7 exists to give
 * back. The lift is therefore run twice on identical inputs (once here to choose, once at
 * the applier to apply) rather than cached — it is a pure fold over a frozen roster.
 *
 * ⛔ THE RECEIPT NEVER CLAIMS A FORMER STANDING (A1.1.4b). Nothing in the estate records
 * pre-cut powers, the cut is lossy, and one marker covers two factors — so this is a
 * declared ESTIMATE and the prose says "restoring", never "restored to what it was".
 * A1.1.4(a)'s per-faction pre-cut snapshot is OWNER-GATED (Q-S8) and deliberately NOT
 * taken here; when it is granted it rides THIS payload — it cannot be looked up later,
 * because the ledger row is deleted inside the same pass that emits the outcome, and
 * `conditionOutcome`/`deriveActiveCondition` are closed shapes that drop unknown keys.
 *
 * `null` when the seat key is dark, when the roster has no legitimate remnant to seat, or
 * when there is nothing to lift — so a dark world emits no payload, the applier's lift is
 * never reached with a marker, and every liberated settlement serializes byte-identically.
 *
 * @param {unknown} worldState  the live pulse world state (its typedef declares no
 *   `simulationRules`, which is why a virtual key is read through a narrowing cast rather
 *   than off the declared shape — the `brokerageEffectsActive` idiom)
 * @param {{ settlement?: unknown }|null|undefined} item  the occupied settlement's snapshot
 *   item (or the settlement itself — both shapes are handled, snapshot-first)
 * @param {number} tick
 * @returns {{ toPowerName: string, cause: 'appointment', tick: number, occupationLift: string }|null}
 */
export function occupationLiftTransfer(worldState, item, tick) {
  // ⛔ The strict positive `=== true` spelling is the engine-gated-key census's only
  // discoverable form, read off worldState.simulationRules because a virtual key has no
  // DEFAULT_SIMULATION_RULES entry to normalize (the foreignSeatCoupAdj idiom verbatim).
  const rules = /** @type {{ simulationRules?: { foreignSeatEnabled?: unknown } }|null|undefined} */ (worldState)?.simulationRules;
  if (rules?.foreignSeatEnabled !== true) return null;
  const settlement = item?.settlement || item;
  const lifted = liftOccupationAuthority(settlement, { occupationLift: OCCUPATION_LIFT_KIND });
  if (lifted === settlement) return null;
  const remnant = legitimateRemnantOf(lifted);
  const toPowerName = String(remnant?.faction || remnant?.name || '').trim();
  if (!toPowerName) return null;
  // `appointment` is ALREADY in the frozen RULING_POWER_CAUSES vocabulary and carries its
  // own LEGITIMACY_SEEDS and STABILITY_BY_CAUSE rows, so A1.1.5's primary ruling costs no
  // vocabulary growth (law §2.6). The honest `liberation` spelling stays Q-S7, owner's.
  return { toPowerName, cause: 'appointment', tick, occupationLift: OCCUPATION_LIFT_KIND };
}

/**
 * Settlements liberated/relieved this tick (occupation broken). Read from the deployment-
 * return + occupation outcomes: an `occupation_lifted` or `siege_lifted` condition on a
 * settlement means it threw off / relieved its occupation. Those occupations exit the
 * ledger. Returns a Set of occupied ids.
 * @param {any[]} returnOutcomes  deploymentReturnOutcomes() results
 * @returns {Set<string>}
 */
export function liberatedIdsFrom(returnOutcomes = []) {
  const ids = new Set();
  for (const o of returnOutcomes) {
    const arche = o?.condition?.archetype || o?.candidateType;
    if ((arche === 'occupation_lifted' || arche === 'siege_lifted') && o?.targetSaveId != null) {
      ids.add(String(o.targetSaveId));
    }
  }
  return ids;
}

/**
 * Find the regional-graph edge between two settlements (either orientation), returning
 * its canonical relationship key + the raw edge. Null when no edge exists. Pure read.
 * @param {PulseSnapshot} snapshot
 * @param {string} a
 * @param {string} b
 * @returns {{ key: string, edge: any }|null}
 */
function edgeBetween(snapshot, a, b) {
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const { from: rawFrom, to: rawTo } = getRelationshipSettlements(rawEdge);
    const from = String(rawFrom ?? '');
    const to = String(rawTo ?? '');
    if ((from === String(a) && to === String(b)) || (from === String(b) && to === String(a))) {
      return { key: relationshipKeyFromEdge(rawEdge), edge: rawEdge };
    }
  }
  return null;
}

/**
 * Vassalization integration: a STABILIZED occupation the state machine advanced to the
 * `vassalized` rung CONVERTS to a formal vassal relationship — the occupation matures
 * into a vassalage EDGE. Emitted as the canonical `relationship_label_change` outcome (the
 * SAME shape a subjugation contest emits, the labelProposal idiom) so the vassal edge
 * forms through relationshipEvolution's existing vassal-label apply path (state-first
 * seniority, channel bundle, hierarchy cascade) — NOT a parallel model. Keyed on the REAL occupier↔
 * occupied edge so applyRelationshipLabelToGraph can relabel it; skipped if no edge exists
 * (the apply path needs an edge to relabel). Codepoint-sorted; emits once on arrival.
 *
 * @param {Record<string, OccupationRecord>} occupations  the NEXT-tick ledger.
 * @param {PulseSnapshot} snapshot   the pre-tick snapshot (for the occupier↔occupied edge).
 * @param {(id:string)=>any} nameFor
 * @param {number} tick
 * @param {Set<string>|null} [arrivedThisTick]  occupied ids that FIRST reached `vassalized`
 *   this tick (prevState !== 'vassalized'). Only these emit — a stable vassalized occupation,
 *   which also holds at stateHeld 0 / lastTick = tick, must NOT re-emit (finding 3).
 * @returns {any[]}
 */
export function vassalizationOutcomes(occupations, snapshot, nameFor, tick, arrivedThisTick = null) {
  const out = [];
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    if (rec.state !== 'vassalized') continue;
    // Emit ONCE, on the tick the occupation first ARRIVES at vassalized. A stable
    // vassalized occupation that merely HELD this tick also carries stateHeld 0 +
    // lastTick = tick (advanceOccupationState returns stateHeld 0 when the top rung
    // holds), so the old stateHeld/lastTick gate re-fired the relationship_label_change
    // + 'bends the knee' chronicle every tick. The arrived-this-tick signal is the
    // authoritative one-shot edge; fall back to the old gate only when it is not provided
    // (direct callers/tests that do not thread the prev-state transition).
    if (arrivedThisTick) {
      if (!arrivedThisTick.has(String(occupiedId))) continue;
    } else if (num(rec.stateHeld) !== 0 || num(rec.lastTick) !== num(tick)) {
      continue;
    }
    // The apply path RELABELS an existing edge — locate the real occupier↔occupied edge.
    const found = edgeBetween(snapshot, rec.occupierId, occupiedId);
    if (!found) continue;
    const occupierName = nameFor(rec.occupierId);
    const occupiedName = nameFor(occupiedId);
    const fromType = String(found.edge?.relationshipType || found.edge?.type || 'hostile');
    out.push({
      id: `world_outcome.occupation_vassalized.${stablePart(occupiedId)}.${tick}`,
      type: 'relationship',
      candidateType: 'occupation_vassalized',
      ruleId: 'occupation_vassalized',
      ruleFamily: 'relationship',
      applyMode: 'auto',
      probability: 1,
      relationshipKey: found.key,
      // The ACTOR is the occupier (targetSaveId), but the RESIDUE this outcome
      // banks lives on the OCCUPIED settlement's ledger row (promoted to the
      // 'vassalized' rung). Name the occupied id explicitly so the pause-path
      // residue guard — and any other consumer — can locate the affected ledger
      // row without reverse-engineering it from the outcome id or the edge key.
      targetSaveId: String(rec.occupierId),
      occupiedSaveId: String(occupiedId),
      severity: 0.5,
      headline: `${occupiedName} bends the knee to ${occupierName}`,
      summary: `${occupierName}'s occupation of ${occupiedName} has stabilized into formal vassalage. The occupied settlement now serves as a client state.`,
      reasons: [`The occupation held long enough to become a compact; what resistance is left is ${resistanceWordFor(num(rec.resistance))}.`],
      relationshipPatch: { proposedRelationshipType: 'vassal', trajectory: 'transitioning' },
      proposalPayload: {
        kind: 'relationship_label_change',
        relationshipKey: found.key,
        fromType,
        toType: 'vassal',
        reason: `${occupierName}'s occupation of ${occupiedName} stabilized into vassalage.`,
      },
      metadata: { fromType, toType: 'vassal' },
    });
  }
  return out;
}

/**
 * Evaluate the occupation layer for one tick — THE state machine + benefit/burden/
 * resistance. GATED + byte-identical when OFF (a pure no-op returning the existing
 * ledger untouched + empty outcomes).
 *
 * Sequencing (read-last/write-next, deterministic):
 *  1. SEED fresh conquests as `contested` occupations (keyed by occupied id).
 *  2. DROP liberated occupations (exit the ledger).
 *  3. For each surviving occupation (codepoint-sorted): advance RESISTANCE, then advance
 *     STATE (hysteresis dwell + single-rung + collapse→liberated), all from the PRE-TICK
 *     snapshot. A collapse drops the entry.
 *  4. Compute the CAPPED/DELAYED/CONDITIONAL per-occupier BENEFIT and the BURDEN.
 *  5. Emit: occupation_resistance (on the occupied), occupation_burden (on the occupier),
 *     war_spoils (the capped benefit relief, on the occupier), and vassalization
 *     relationship outcomes for occupations that reached `vassalized`.
 *
 * @param {Object} args
 * @param {PulseSnapshot} args.snapshot        the SINGLE pre-tick snapshot (byId carries settlement + causal).
 * @param {WorldState} args.worldState      carries the pre-tick occupations ledger.
 * @param {RegionGraph} args.graph           the POST-mint regional graph (for garrison-presence reads).
 * @param {Record<string, DeploymentRecord>} args.deployments  the live one-army ledger (post war-layer).
 * @param {any[]} [args.warOutcomes]  this tick's war-layer outcomes (fresh conquests).
 * @param {any[]} [args.returnOutcomes]  this tick's deployment-return outcomes (liberations).
 * @param {number} [args.tick]
 * @param {{ warLayerEnabled?: boolean }} [args.rules]
 * @param {ReadonlySet<string>|null} [args.dismissedOutcomeIds]  RESUME dismissal: outcome
 *   ids the DM dismissed. An `occupation_vassalized` outcome the DM dismissed is keyed
 *   `world_outcome.occupation_vassalized.<occupiedId>.<tick>`; when its id is dismissed,
 *   the state machine does NOT promote that occupation to `vassalized` — it HOLDS at its
 *   prior rung (stabilized) so the occupation is never stranded at the top with the
 *   vassal edge never forming. Parity with conquest-dismiss. Inert (null) otherwise.
 * @returns {{ outcomes: any[], occupations: Record<string, any>, dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number}> }}
 */
export function evaluateOccupations({ snapshot, worldState, graph, deployments = {}, warOutcomes = [], returnOutcomes = [], tick = 0, rules = {}, dismissedOutcomeIds = null }) {
  const existing = (worldState?.occupations && typeof worldState.occupations === 'object') ? worldState.occupations : {};
  if (!rules?.warLayerEnabled) {
    // OFF: pure no-op. Return the existing ledger untouched (absent stays absent).
    return { outcomes: [], occupations: existing, dispositionDeltas: [] };
  }

  const t = Math.max(0, Math.floor(num(tick)));
  // RESUME dismissal predicate (parity with conquest-dismiss): is THIS occupation's
  // vassalization the DM dismissed? Keyed by the outcome id vassalizationOutcomes mints.
  const vassalizationDismissed = dismissedOutcomeIds && typeof dismissedOutcomeIds.has === 'function' && dismissedOutcomeIds.size > 0
    ? (/** @type {string} */ occupiedId) => dismissedOutcomeIds.has(`world_outcome.occupation_vassalized.${stablePart(occupiedId)}.${t}`)
    : null;
  const nameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };
  const itemFor = (/** @type {any} */ id) => snapshot?.byId?.get?.(String(id));

  // ── WR-8 amendment N: CONQUEST EXECUTION. Read ONCE per pass. Dark (and it is
  // dark by default, behind the whole WR chain) ⇒ every expression below this
  // point is the pre-wire one and this layer is byte-identical. ──────────────
  const conquestLit = conquestDoctrineActive(worldState);
  // W-SEAT D3 (SEAT-3): the posture axis's ONE gate read, hoisted out of the per-record
  // loop. Dark ⇒ no posture candidate is ever minted, so no posture byte can ever reach a
  // ledger, so `occupationPostureOf` below never has a field to not-read. The two halves
  // of the dormancy claim (nothing written, nothing read) therefore share one condition.
  const postureLit = /** @type {Record<string, unknown>} */ (rules)?.foreignSeatEnabled === true;
  /** Theoretical military capacity, cached per id — the truth read the EXECUTION
   *  half is entitled to (belief decides the march; the world decides whether it
   *  worked). Reuses the same model `occupiedUsefulness` already runs on. */
  const capacityCache = new Map();
  const capacityOf = (/** @type {string} */ id) => {
    const key = String(id);
    if (capacityCache.has(key)) return capacityCache.get(key);
    const item = itemFor(key);
    const economicCapacityScore = item?.causal?.scores?.economic_capacity;
    const value = item
      ? num(deriveMilitaryCapacity(item, {
        economicCapacityScore: Number.isFinite(economicCapacityScore) ? economicCapacityScore : undefined,
      }).theoreticalCapacity)
      : NaN;
    capacityCache.set(key, value);
    return value;
  };
  /** THE OVERWHELMING GATE for one hold. Null while dark. */
  const marginFor = (/** @type {string} */ occupierId, /** @type {string} */ occupiedId) => (conquestLit
    ? conquestMarginVerdict({
      occupierCapacity: capacityOf(occupierId),
      occupiedCapacity: capacityOf(occupiedId),
      occupierName: nameFor(occupierId),
      occupiedName: nameFor(occupiedId),
    })
    : null);

  // ── Step 1+2: seed fresh conquests, drop liberated ones. Work on a COPY (read-last/
  // write-next — never mutate worldState's ledger). ────────────────────────────────
  /** @type {Record<string, any>} */
  const occupations = {};
  for (const id of Object.keys(existing).sort(codepoint)) {
    occupations[id] = { ...existing[id] };
  }
  const liberatedIds = liberatedIdsFrom(returnOutcomes);
  for (const { occupiedId, occupierId } of freshConquestsFrom(warOutcomes)) {
    // A fresh conquest seeds a contested occupation. IDEMPOTENCY (finding 2): if the SAME
    // occupier already holds this settlement, treat the re-conquest as a NO-OP — do not
    // reset it to `contested`/0.35 resistance, which would rewind all stabilization
    // progress every tick a stale war_front re-fires the conquest. Only a DIFFERENT
    // occupier (a genuine re-conquest) overwrites the record (one occupier per settlement).
    const prior = occupations[occupiedId];
    if (prior?.occupierId && String(prior.occupierId) === String(occupierId)) continue;
    occupations[occupiedId] = createOccupationRecord(occupierId, t);
  }
  // Liberated settlements exit the ledger (a returning army broke the occupation).
  for (const occupiedId of [...liberatedIds].sort(codepoint)) {
    if (occupations[occupiedId]) delete occupations[occupiedId];
  }

  /** @type {any[]} */
  const outcomes = [];
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = [];
  // Occupied ids that FIRST reached `vassalized` this tick (prevState !== 'vassalized').
  // The vassalization relationship outcome fires ONCE on arrival, not every tick the
  // occupation holds at vassalized (finding 3).
  /** @type {Set<string>} */
  const arrivedAtVassalized = new Set();

  // ── Step 3: advance resistance + state for each surviving occupation. ─────────────
  for (const occupiedId of Object.keys(occupations).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) { delete occupations[occupiedId]; continue; }
    // A vanished occupied/occupier (no longer a canon member) → drop the entry.
    if (!snapshot?.byId?.has?.(occupiedId) || !snapshot?.byId?.has?.(String(rec.occupierId))) {
      delete occupations[occupiedId];
      continue;
    }
    const occupiedItem = itemFor(occupiedId);
    // W-PEACE-2 occupation_hold: a live occupation_continuation term is a CEDED garrison.
    // It stands in for physical presence (the treaty is why the army could go home without
    // the occupation evaporating) and it forbids the collapse exit while it runs. Resistance
    // still climbs underneath — the hold suppresses the OUTCOME, not the grievance — so the
    // day the term expires the occupation faces whatever it has become. false ⇒ every
    // expression below is the pre-wire one, so an untreatied occupation is byte-identical.
    const treatyHold = occupationHoldFor(worldState, occupiedId, rec.occupierId, t);
    const present = treatyHold || occupierStillPresent(graph, deployments, rec.occupierId, occupiedId);

    // W-SEAT D3 (SEAT-3): the occupier's CHOSEN posture, resolved ONCE per record. This is
    // the ONE place the flag is read for this axis, so with the key dark the field below is
    // never touched at all and A1.2.11's "the dark path NEVER reads the field" is literal.
    const posture = occupationPostureOf(rec, rules);
    // Resistance first (from the pre-tick state), then suitability, then state.
    const nextResistance = advanceResistance(rec, occupiedItem, posture);
    const suitability = stabilizationSuitability({ ...rec, resistance: nextResistance }, occupiedItem, present, posture);
    // Pass the current tick so a contested occupation stuck in the hysteresis dead-band
    // is force-resolved after MAX_CONTESTED_DWELL ticks instead of grinding forever.
    const advanced = advanceOccupationState(rec, suitability, t);

    if (advanced.liberated && !treatyHold) {
      // The occupation collapsed (the occupier lost control). Exit the ledger; the
      // occupied settlement banks a (re)liberation; the occupier banks a disposition loss.
      delete occupations[occupiedId];
      const dispositionSourceEventId = `world_outcome.occupation_collapsed.${stablePart(occupiedId)}.${t}`;
      dispositionDeltas.push({
        id: String(rec.occupierId), outcome: 'loss', magnitude: 0.6,
        sourceEventId: dispositionSourceEventId,
      });
      // worldpulse-war-8: the occupied town banks the WIN — throwing off an occupier
      // through resistance is one of the strongest confidence signals in the fiction
      // ('we reclaimed our own authority'). Bounded; folds through applyDispositionDeltas
      // with the ±SCORE_MAX clamp. Behind warLayerEnabled (this whole pass).
      dispositionDeltas.push({
        id: String(occupiedId), outcome: 'win', magnitude: 0.5,
        sourceEventId: dispositionSourceEventId,
      });
      const occupiedName = nameFor(occupiedId);
      const occupierName = nameFor(rec.occupierId);
      // W-SEAT D7 (SEAT-5): the roster half of "the settlement reclaims its own
      // authority". Null when dark ⇒ the pushed object is the pre-SEAT-5 one, key for key.
      const liftTransfer = occupationLiftTransfer(worldState, occupiedItem, t);
      const liftedOutcome = conditionOutcome({
        id: dispositionSourceEventId,
        archetype: 'occupation_lifted',
        targetSaveId: occupiedId,
        severity: 0.3,
        headline: `${occupiedName} throws off ${occupierName}`,
        summary: `The occupation of ${occupiedName} collapsed under resistance. ${occupierName} could never hold it, and the settlement reclaims its own authority.`,
        reasons: [`The occupation became unholdable against a town ${resistanceWordFor(nextResistance)}.`],
        tick: t,
        sourceEventTargetId: String(rec.occupierId),
        causes: [{ source: occupiedId, effect: 'occupation_lifted', reason: `${occupiedName}'s resistance broke ${occupierName}'s occupation.` }],
      });
      // Dark ⇒ the SAME OBJECT is pushed, not an equal one: the dormancy claim is by
      // reference rather than by arithmetic, the standard this family already holds itself to.
      outcomes.push(liftTransfer ? { ...liftedOutcome, powerTransfer: liftTransfer } : liftedOutcome);
      continue;
    }

    const prevState = rec.state;
    // RESUME dismissal: a DM-dismissed `occupation_vassalized` must NOT promote the
    // occupation to the terminal `vassalized` rung — otherwise the apply filter drops
    // the vassal-edge relabel while the occupation is stranded at vassalized forever
    // (the arrived-this-tick one-shot already fired, so it never re-emits). Roll the
    // promotion back: HOLD at the prior rung (stabilized) with a reset dwell, so the
    // occupation can re-argue the vassalization on a later tick if the DM permits. The
    // resistance/disposition advance is kept (the occupation otherwise progressed
    // normally) — only the terminal promotion is undone. Inert without dismissals.
    let nextState = advanced.state;
    let nextStateHeld = advanced.stateHeld;
    // ── WR-8 (N) THE OVERWHELMING GATE, and it is the whole amendment's hardest
    // pin sitting in four lines. A hold whose victor is merely CLEARLY WINNING —
    // or whose margin cannot be measured — may climb the ladder in the ordinary
    // way up to `extractive` and NO FURTHER, so `stabilized` and the client-state
    // rung `vassalized` are unreachable to it and its war can only end at a
    // table. Only an OVERWHELMING margin opens the top of the ladder. The dwell
    // is reset with the cap so a capped occupation does not bank pressure it can
    // never spend. Dark ⇒ `margin` is null ⇒ `nextState` is untouched. ────────
    const margin = marginFor(String(rec.occupierId), occupiedId);
    if (margin && stateRank(nextState) > conquestCeilingRank(margin)) {
      nextState = STATE_LADDER[conquestCeilingRank(margin)];
      nextStateHeld = 0;
    }
    if (vassalizationDismissed
        && advanced.state === 'vassalized' && prevState !== 'vassalized'
        && vassalizationDismissed(occupiedId)) {
      nextState = prevState;
      nextStateHeld = 0;
    }
    // ── W-SEAT D3 (SEAT-3) — THE POSTURE DECISION. ────────────────────────────────
    // The occupier's court is asked what it wants from this town, and it is asked ONLY on
    // the tick the occupation CLIMBS to a rung where the question is real. Below
    // `extractive` the occupier is still fighting for control and has no yield to have a
    // policy about (the benefit scale is 0.12 and under); each climb from there materially
    // changes the question, so a court is asked at most three times in an occupation's
    // whole life and never on a quiet tick. That bound is what closes A1.2.11's oscillation
    // worry STRUCTURALLY rather than by tuning a hysteresis onto a second axis.
    //
    // ⛔ THE FIELD IS WRITTEN HERE, WHERE EVERY OTHER FIELD OF THIS RECORD IS WRITTEN, and
    // that is a correction to this car's own first draft. The write was first put in
    // `applyWorldPulseOutcomes` as a payload-keyed arm — which would have made `posture`
    // the ONLY field of the occupation record written from outside the occupation layer,
    // and it was refused by a harder fact: `applyWorldPulse.js` is size-baselined at
    // EXACTLY 941 effective lines with zero tolerance in both directions, and the arm took
    // it to 954. The ceiling forced a re-read, and the re-read said the ledger's own layer
    // was always the right home. The outcome below is the RECEIPT of the decision, exactly
    // as `occupation_transition` outcomes receipt the state machine's own moves.
    let nextPosture = rec.posture;
    if (postureLit
      && stateRank(nextState) > stateRank(prevState)
      && stateRank(nextState) >= stateRank('extractive')) {
      const wasPosture = occupationPostureOf(rec, rules);
      const chosen = occupationPostureChoice(occupiedUsefulness(occupiedItem), nextResistance);
      // Nothing to write and nothing to receipt when the court re-affirms what it already had.
      if (chosen !== wasPosture) {
        nextPosture = chosen;
        const occupiedName = nameFor(occupiedId);
        const occupierName = nameFor(rec.occupierId);
        outcomes.push({
          id: `world_outcome.occupation_posture.${stablePart(occupiedId)}.${t}`,
          type: 'occupation_posture',
          candidateType: 'occupation_posture',
          ruleId: 'occupation_posture',
          ruleFamily: 'occupation',
          applyMode: 'auto',
          probability: 1,
          // ⚠ THE ACTOR IS THE OCCUPIER AND THE LEDGER ROW IS KEYED BY THE OCCUPIED.
          // `vassalizationOutcomes` carries the same explicit second id for the same
          // reason: a consumer that reverse-engineered the affected row from
          // `targetSaveId` would find the OCCUPIER's row, which is usually absent.
          targetSaveId: String(rec.occupierId),
          occupiedSaveId: String(occupiedId),
          severity: 0.35,
          headline: `${occupierName} settles its policy for ${occupiedName}`,
          summary: `${occupierName}'s council has decided how it means to hold ${occupiedName}: ${POSTURE_PROSE[chosen]}`,
          reasons: [
            `The occupation has reached ${nextState}, and the question of what to do with the town is now a real one.`,
            `The town is ${resistanceWordFor(nextResistance)}.`,
          ],
          metadata: { fromPosture: wasPosture, toPosture: chosen },
        });
      }
    }
    occupations[occupiedId] = {
      ...rec,
      state: nextState,
      stateHeld: nextStateHeld,
      resistance: nextResistance,
      lastTick: t,
      // ⛔ SPREAD CONDITIONALLY, NEVER `posture: nextPosture`. A dark world's record has no
      // `posture` key, and writing `posture: undefined` would put the KEY on the object —
      // `JSON.stringify` drops an undefined VALUE but the raw-byte dormancy comparator is
      // not the only reader, and a key that exists-with-undefined is a different object.
      ...(nextPosture ? { posture: String(nextPosture) } : {}),
    };
    // A stabilization advance banks a small disposition WIN for the occupier (a
    // consolidating empire grows more confident); a regression a small loss.
    if (stateRank(nextState) > stateRank(prevState)) {
      dispositionDeltas.push({ id: String(rec.occupierId), outcome: 'win', magnitude: 0.3 });
    } else if (stateRank(nextState) < stateRank(prevState)) {
      dispositionDeltas.push({ id: String(rec.occupierId), outcome: 'loss', magnitude: 0.3 });
    }
    // Record the one-shot arrival edge for the vassalization outcome (finding 3): the
    // occupation just CLIMBED to vassalized from a lower rung this tick. A dismissed
    // vassalization (rolled back above) never arrives, so it is correctly omitted.
    if (nextState === 'vassalized' && prevState !== 'vassalized') {
      arrivedAtVassalized.add(String(occupiedId));
    }


    // ── Resistance condition on the OCCUPIED (grows on intact/loyalist, shrinks on
    // devastated/compliant). Only surfaced once it clears the floor (byte-light). ────
    if (nextResistance >= RESISTANCE_CONDITION_FLOOR) {
      const occupiedName = nameFor(occupiedId);
      const occupierName = nameFor(rec.occupierId);
      outcomes.push(conditionOutcome({
        id: `world_outcome.occupation_resistance.${stablePart(occupiedId)}.${t}`,
        archetype: 'occupation_resistance',
        targetSaveId: occupiedId,
        severity: nextResistance,
        headline: `${occupiedName} resists its occupiers`,
        summary: `Sabotage, noncompliance, and an organizing resistance harry ${occupierName}'s grip on ${occupiedName}.`,
        reasons: [`The town is ${resistanceWordFor(nextResistance)}, and the occupation stands at ${advanced.state}.`],
        tick: t,
        sourceEventTargetId: String(rec.occupierId),
        causes: [{ source: occupiedId, effect: 'occupation_resistance', reason: `${occupiedName} resists ${occupierName}'s occupation.` }],
      }));
    }
  }

  // ── Step 4: the CAPPED/DELAYED/CONDITIONAL benefit + the burden. ──────────────────
  const { perOccupier: benefit } = computeOccupierBenefit(occupations, itemFor);
  const burden = computeOccupierBurden(occupations);
  const previousBurden = computeOccupierBurden(existing);

  // ── WR-8 (N) THE INHERITANCE COUNTERFORCE. "A realm that conquers a dying
  // neighbour has annexed a famine." The victor's food deficit is SUMMED over
  // what it now holds, through the two readers the food engine already exposes,
  // and it bites twice: it nets the tribute DOWN (an empty granary pays nothing)
  // and it raises the garrison bill (you are feeding them now). Uncapped by
  // count on purpose — the brake must be able to outgrow the prize. Dark ⇒ the
  // map is empty ⇒ factor 1 and addend 0 everywhere ⇒ byte-identical. ─────────
  /** @type {Record<string, ReturnType<typeof inheritedHunger>>} */
  const inherited = {};
  if (conquestLit) {
    /** @type {Record<string, Array<{ storageMonths: unknown, capacityMonths: unknown }>>} */
    const heldByOccupier = {};
    for (const occupiedId of Object.keys(occupations).sort(codepoint)) {
      const occupierId = String(occupations[occupiedId]?.occupierId || '');
      if (!occupierId) continue;
      const settlement = itemFor(occupiedId)?.settlement;
      (heldByOccupier[occupierId] = heldByOccupier[occupierId] || []).push({
        storageMonths: settlement?.economicState?.foodSecurity?.storageMonths,
        capacityMonths: storageCapacityMonths(settlement),
      });
    }
    for (const occupierId of Object.keys(heldByOccupier).sort(codepoint)) {
      inherited[occupierId] = inheritedHunger(heldByOccupier[occupierId]);
    }
  }
  const hungerOf = (/** @type {string} */ id) => num(inherited[id]?.hunger);

  // A producer that falls silent still owns one real transition: its renewal ended.
  // Emit one aggregate public receipt per occupier on that edge, without changing the
  // bounded expiry tail already carried by the active condition.
  const previousOccupierIds = [...new Set(Object.values(existing)
    .map(rec => rec?.occupierId)
    .filter(id => id != null)
    .map(String))].sort(codepoint);
  for (const occupierId of previousOccupierIds) {
    if (!snapshot?.byId?.has?.(occupierId)) continue;
    const occupierName = nameFor(occupierId);
    const previousCount = occupationContext(existing, occupierId).length;
    const nextCount = occupationContext(occupations, occupierId).length;
    const previousBenefit = storedOccupierBenefit(existing, occupierId);
    const nextBenefit = clamp01(num(benefit[occupierId]));

    const burdenClearance = occupationBurdenClearanceOutcome({
      occupierId,
      occupierName,
      previousCount,
      nextCount,
      previousSeverity: clamp01(num(previousBurden[occupierId])),
      tick: t,
    });
    if (burdenClearance) outcomes.push(burdenClearance);

    const spoilsEnded = warSpoilsEndedOutcome({
      occupierId,
      occupierName,
      previousBenefit,
      nextBenefit,
      previousSeverity: clamp01(previousBenefit * BENEFIT_RELIEF_SCALE),
      tick: t,
    });
    if (spoilsEnded) outcomes.push(spoilsEnded);
  }

  // ── Step 5: emit per-occupier burden + war_spoils (capped benefit relief). ────────
  // Iterate the union of occupiers (codepoint-sorted) so each occupier gets one of each.
  const occupierIds = [...new Set([...Object.keys(benefit), ...Object.keys(burden)])].sort(codepoint);
  for (const occupierId of occupierIds) {
    if (!snapshot?.byId?.has?.(occupierId)) continue;
    const occupierName = nameFor(occupierId);
    const occCount = Object.keys(occupations).filter(id => String(occupations[id]?.occupierId) === occupierId).length;

    // WR-8 (N): the inherited famine is part of the garrison bill. Addend 0 while
    // dark or while nothing held is hungry ⇒ the pre-wire severity exactly.
    const inheritedHere = inherited[occupierId] || null;
    const burdenSeverity = clamp01(num(burden[occupierId]) + inheritanceBurdenAddend(hungerOf(occupierId)));
    if (burdenSeverity > 0) {
      outcomes.push(conditionOutcome({
        id: `world_outcome.occupation_burden.${stablePart(occupierId)}.${t}`,
        archetype: 'occupation_burden',
        targetSaveId: occupierId,
        severity: burdenSeverity,
        headline: `${occupierName} is stretched thin holding its conquests`,
        summary: `Garrisons, administrators, and suppression tie down ${occupierName}'s strength across ${occCount} occupation${occCount === 1 ? '' : 's'}.`,
        reasons: [
          `${occCount} occupation${occCount === 1 ? '' : 's'} weigh ${occupationBurdenWordFor(burdenSeverity)} on the occupier, and each one held makes the next dearer.`,
          // The counterforce is NAMED, not buried in a float. Absent while dark.
          ...(inheritedHere && inheritedHere.hunger > 0 ? [`The famine it annexed is part of the garrison bill: ${inheritedHere.receipt}`] : []),
        ],
        tick: t,
        sourceEventTargetId: occupierId,
        causes: [
          { source: occupierId, effect: 'occupation_burden', reason: `${occupierName} garrisons and administers ${occCount} occupied settlement${occCount === 1 ? '' : 's'}.` },
          ...(inheritedHere && inheritedHere.hunger > 0
            ? [{ source: occupierId, effect: 'occupation_burden', reason: `${occupierName} has annexed a famine: ${inheritedHere.receipt}` }]
            : []),
        ],
        recordMode: recurringOccupationConditionRecordMode({
          snapshot,
          archetype: 'occupation_burden',
          targetSaveId: occupierId,
          severity: burdenSeverity,
          previousOccupations: existing,
          nextOccupations: occupations,
          previousProducerActive: occupationContext(existing, occupierId).length > 0,
        }),
      }));
    }

    // war_spoils: the CAPPED benefit relief. It EASES war_exhaustion (extends supply
    // endurance), modelled as an easing condition whose severity is the capped benefit.
    // WR-8 (N): you cannot draw tribute from an empty granary. Factor is exactly
    // 1 while dark or while nothing held is hungry ⇒ the pre-wire yield exactly.
    const benefitYield = clamp01(num(benefit[occupierId]) * inheritanceBenefitFactor(hungerOf(occupierId)));
    if (benefitYield > 0) {
      const relief = clamp01(benefitYield * BENEFIT_RELIEF_SCALE);
      const recordMode = recurringOccupationConditionRecordMode({
        snapshot,
        archetype: 'war_spoils',
        targetSaveId: occupierId,
        severity: relief,
        previousOccupations: existing,
        nextOccupations: occupations,
        previousProducerActive: storedOccupierBenefit(existing, occupierId) > 0,
      });
      outcomes.push({
        id: `world_outcome.war_spoils.${stablePart(occupierId)}.${t}`,
        type: 'condition',
        candidateType: 'war_spoils',
        ruleId: 'occupation_war_spoils',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: occupierId,
        severity: relief,
        headline: `${occupierName} draws strength from its occupations`,
        summary: `Tribute, levies, and materiel from stabilized occupations sustain ${occupierName}'s war effort.`,
        reasons: [
          `The occupations return ${occupationYieldWordFor(benefitYield)}, and what comes in eases the weariness of the war at home.`,
          ...(inheritedHere && inheritedHere.hunger > 0
            ? [`Netted down by the famine it annexed: ${inheritedHere.receipt}`]
            : []),
        ],
        ...(recordMode ? { recordMode } : {}),
        // war_spoils is the INVERSE of war_exhaustion — it RELIEVES economic_capacity. The
        // apply path treats it as an easing condition (status 'easing'); it feeds the
        // homeostasis dial the OTHER way (extending endurance), bounded by the cap.
        condition: {
          archetype: 'war_spoils',
          severity: relief,
          status: 'easing',
          triggeredAt: { tick: t, sourceEventType: 'OCCUPATION_LAYER', sourceEventTargetId: occupierId },
          causes: [{ source: occupierId, effect: 'war_spoils', reason: `${occupierName} extracts war support from its stabilized occupations (capped).` }],
        },
      });
    }
    // Stamp the benefit yield onto the record for surfacing/debug (read-last/write-next).
    for (const occupiedId of Object.keys(occupations)) {
      if (String(occupations[occupiedId]?.occupierId) === occupierId) {
        occupations[occupiedId] = { ...occupations[occupiedId], benefitYield };
      }
    }
  }

  // ── Vassalization: a stabilized occupation converts to a vassal edge. Fires ONCE on
  // the tick the occupation first reaches vassalized (arrivedAtVassalized), never again
  // while it holds there (finding 3). ──────────────────────────────────────────────────
  for (const v of vassalizationOutcomes(occupations, snapshot, nameFor, t, arrivedAtVassalized)) outcomes.push(v);

  return { outcomes, occupations, dispositionDeltas };
}

export const OCCUPATION_TUNING = Object.freeze({
  STATE_LADDER,
  STATE_RANK,
  STATE_BENEFIT_SCALE,
  STATE_BURDEN_SCALE,
  STATE_HOLD_TICKS,
  ADVANCE_THRESHOLD,
  REGRESS_THRESHOLD,
  COLLAPSE_THRESHOLD,
  RESISTANCE_GROW_PER_TICK,
  RESISTANCE_DECAY_PER_TICK,
  RESISTANCE_CONDITION_FLOOR,
  PER_OCCUPATION_BENEFIT_CAP,
  OCCUPIER_BENEFIT_CONTAINMENT,
  DIMINISHING_BASE,
  PER_OCCUPATION_BURDEN_CAP,
  OVEREXTENSION_PER_OCCUPATION,
  BENEFIT_RELIEF_SCALE,
});

// ⛔ `vassalOverlordOf` WAS HERE AND IS DELETED BY W-SEAT SEAT-1 (law §2.1's
// resolver collapse). It took a SNAPSHOT and walked the relationship edges,
// while `traditions/relations.js` carried a module-private function of the SAME
// NAME that took a WORLDSTATE and read the OCCUPATIONS LEDGER — one name, two
// questions, two substrates, which is §711.6's shape exactly. This one was a
// DEAD EXPORT (measured: zero callers in src/, tests/, scripts/, api/,
// mcp-server/, tools/ — its own docstring claimed it existed "for
// tests/integration" and no test imported it either), so deleting it moves no
// behaviour. The ledger question now has ONE home, `rulingPowerSeat.vassalOverlordOf`;
// the edge question was never a separate public quantity and lives as one arm of
// `rulingPowerSeat.foreignSeatOf`. Recorded rather than silently removed so the
// next reader does not re-mint it here.
