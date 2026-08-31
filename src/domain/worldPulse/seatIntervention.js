/**
 * seatIntervention.js — W-SEAT D9 (SEAT-2c): who may march to a contest, how long the
 * march takes, and what an unwelcome army costs the case it came to make.
 *
 * ── THE SCOPE IS A1.2.13's, NOT THE BODY'S ───────────────────────────────────────
 * The volume's §3-D9 sentence promised a PHYSICAL army act (armyTransit, upkeep, a coin
 * sink) plus a rebellion term in `successPressure` and an insurgency term in
 * `stabilizationSuitability`. AMENDMENT A1.2.13 struck the physical half — it contradicted
 * two recorded vetoable judgments (interventions ride a deliberately transit-ISOLATED
 * ledger; initiation is deliberately live-state, not belief-gated) — and re-specified wave
 * 1 as exactly four items: conserved columns · a hop-priced MARCH-DELAY term · an
 * eligibility rule (relationship edge OR a foreign seat) · derived presence/consequence
 * machinery for UNINVITED entry. A1 outranks the body, and this leaf is those four.
 *
 * ⛔ THE OTHER TWO LEGS ARE NOT MERELY DEFERRED — THEY HAVE NO SITE OF THE SHAPE THE BODY
 * ASSUMES, MEASURED. `successPressure` exists at exactly ONE place tree-wide
 * (`relationshipRulesCore.js:801`) and is a vassal-RELATIONSHIP candidate scorer emitting
 * severity+probability, not a rebellion verdict taking a signed adj; `stressorGates.js`
 * carries only a rebellion BIRTH gate. `stabilizationSuitability` (`occupation.js:471`) is
 * an OCCUPATION state-machine input whose garrison term is already a flat boolean 0.12 —
 * there is nothing there to "reinforce" without changing the term's type — and no
 * insurgency RESOLVER exists in `src/domain/worldPulse` at all. Recorded so a later car
 * re-specifies rather than re-discovers.
 *
 * ⛔ AND THERE IS NO SIXTH COUP ADJ HERE, BY CONSTRUCTION. `rulingPowerCoup.js:191` carries
 * five signed terms summing to 0.815 against a DECLARED budget of 0.82 that
 * `tests/domain/foreignSeatCoupAdj.test.js` asserts is within 0.05 of the worst case, and
 * the sixth slot is chartered to SEAT-7's `forceRatioAdj` on a file declared SERIAL
 * SEAT-2 → SEAT-7. D9 therefore rides the ALREADY-WIRED `interventionAdj` — it changes what
 * a column's SHARE is worth, never how many terms the clamp carries.
 *
 * ── THE GATE, AND WHY IT IS THE SEAT KEY AND NOT THE INTERVENTION KEY ────────────
 * `interventionEnabled` is a WAVES PRESET flag, LIT today in `dramatic_campaign`,
 * `living_realm` and `full_simulation`. Amendment A2/F6 forbids widening autonomous
 * minting behind it ("never behind `interventionEnabled` — it is preset-LIT … widening
 * autonomous minting is a DECLARED lit shift deferred until the owner sees it"). Every arm
 * here therefore AND-composes with the VIRTUAL `foreignSeatEnabled`, which is dark until
 * the owner's walk (§820 Q-S3). Dark ⇒ every function returns its IDENTITY value — the
 * same array reference, or exactly 1 — so a lit-intervention world is byte-identical to
 * what it was, and `tests/property/interventionDormancyGolden.test.js` (whose lit arm sets
 * `interventionEnabled` and never the seat key) does not move in either arm.
 *
 * PURE: no rng, no wall clock, no writes, no mutation of any input. Deterministic and
 * codepoint-ordered. Lazy: imported only by `convergence.js`, itself imported only by
 * `pulseKernel.js` and `coup.js`.
 */

import { activeSpatialDigest, hopWeeks } from '../spatial/distanceRead.js';
import { armyMarchWeeks } from '../spatial/armyTransit.js';
import { foreignSeatOf } from '../rulingPowerSeat.js';

export const SEAT_INTERVENTION_TUNING = Object.freeze({
  /**
   * The share an UNINVITED column keeps of the tilt its numbers would otherwise buy. An
   * army nobody asked for is a sovereignty act: the court it came to help must be seen not
   * to have called it, so its weight in the contest is discounted rather than free.
   *
   * ⛔ THIS IS A SHARE MULTIPLIER AND IT IS DELIBERATELY **NOT** DERIVED FROM
   * `CONVERGENCE_TUNING.LEGIT_COST_UNINVITED` (0.45), THOUGH `1 − 0.45` IS THIS NUMBER.
   * The coincidence is stated so nobody folds them, on `settlementPolitics.js:140-145`'s
   * own precedent (`DECISION_LOAD_SPAN` set equal to `DIRECTION_MAX`, with a comment saying
   * so). A legitimacy PRICE is a standing debit on the intervener's court; a tilt KEEP is a
   * dimensionless factor on a strength share. §711.6's law is that one number wearing two
   * units acquires a different meaning at every consumer and nothing ever reds — and a
   * tuning pass that moves the legitimacy price must be free to leave this one alone.
   */
  UNINVITED_TILT_KEEP01: 0.55,
});

/** An INVITED column keeps its whole share. Spelled as an exact 1 rather than a constant
 *  because `x * 1 === x` is bit-exact for every finite double, which is what lets the
 *  invited path reproduce the pre-D9 arithmetic to the last bit. */
const INVITED_TILT_KEEP01 = 1;

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * ⛔ THE POSITIVE `=== true` SPELLING IS LOAD-BEARING, NOT STYLE. The engine-gated key
 * census (`tests/lint/engineGatedRuleKeys.walker.test.js`) discovers virtual flags by
 * scanning for exactly this form; a negative-polarity early return reads identically at
 * runtime and is INVISIBLE to it, leaving the key manifested with no measured gate. SEAT-1
 * paid a red for that and the scar is carried at every seat-family read site.
 * @param {unknown} worldState @returns {boolean}
 */
export function seatInterventionLit(worldState) {
  return asObject(asObject(worldState).simulationRules).foreignSeatEnabled === true;
}

/**
 * THE ELIGIBILITY RULE (A1.2.13): a court may commit to a contest if it holds a
 * relationship EDGE with the contested settlement — as today — **OR** if it holds that
 * settlement's foreign SEAT.
 *
 * ⭐ THE LIVE POPULATION OF THIS ARM IS NARROW AND MEASURABLE, AND IT IS EXACTLY THE CELL
 * NOTHING ELSE CAN REACH. `foreignSeatOf` resolves four bases. `vassal_edge` and
 * `vassal_edge_treaty_floor` are edge-backed, so `neighborsOf` already sees them and this
 * function returns the caller's own array untouched. `occupations_ledger` is largely
 * unreachable because SEAT-1's own cure makes `coupSpawnGate` REFUSE a coup birth in a
 * ledger-occupied town while this flag is lit — force at spearpoint suppresses the plot
 * before it forms. What is left is precisely the two EDGE-LESS bases:
 * `occupation_rung_vassalized` (the ladder topped out but `vassalizationOutcomes` skipped
 * the relabel, so no edge carries the compact) and `treaty_subordinating_ties`. Those are
 * the overlords the mover is structurally blind to, and this arm adds exactly them.
 *
 * ⚠ THE ADMITTED SUITOR IS LABELLED `vassal`, AND THAT IS NOT A FABRICATED EDGE. The
 * scorer reads `relType` only through `FRIENDLY_REL` / `HOSTILE_REL` to answer "is there a
 * compact with the incumbent" (`treatyWithIncumbent`) and "was this column invited". Both
 * admitted bases ARE compacts — the `vassalized` rung is the estate's own name for one, and
 * a subordinating treaty tie is hegemony's — read from a substrate that carries the fact
 * without carrying an edge. Law §2.1's whole point is that those three substrates answer
 * one question; naming the compact in the vocabulary the scorer speaks is that law applied,
 * not a second truth. Labelling it with an invented type instead would have scored NO
 * motive at all (`scorePreserveOrder` needs either grip ≥ 0.25 or a treaty), and the arm
 * would have passed every existence census while admitting a suitor that can never act —
 * the recorded hazard that a shape the corpus never produces looks clean.
 *
 * @param {unknown} worldState
 * @param {unknown} snapshot
 * @param {string} targetId
 * @param {ReadonlyArray<{ otherId: string, relType: string }>} edgeCandidates
 * @returns {ReadonlyArray<{ otherId: string, relType: string }>} the SAME reference when
 *   dark, when no seat resolves, or when the seat's patron is already an edge neighbour
 */
export function seatSuitorsFor(worldState, snapshot, targetId, edgeCandidates) {
  if (!Array.isArray(edgeCandidates)) return edgeCandidates;
  if (!seatInterventionLit(worldState)) return edgeCandidates;
  const target = String(targetId || '');
  if (!target) return edgeCandidates;
  const seat = foreignSeatOf(worldState, snapshot, target);
  if (!seat) return edgeCandidates;
  const patronId = String(seat.patronSettlementId || '');
  if (!patronId || patronId === target) return edgeCandidates;
  for (const candidate of edgeCandidates) {
    if (String(asObject(candidate).otherId ?? '') === patronId) return edgeCandidates;
  }
  return [...edgeCandidates, { otherId: patronId, relType: 'vassal' }]
    .sort((a, b) => codepoint(a.otherId, b.otherId));
}

/**
 * THE MARCH, IN TICKS — hop-priced through the estate's OWN march math, never a second one.
 *
 * `armyMarchWeeks` is the one place that turns a courier hop-time into a marching army's
 * weeks (`ceil(hopWeeks × 1.5 / speedMult(readiness))`, floored at 1, capped at 52), and
 * ticks are weeks here. Reusing it is §711.6 discipline: a second march derivation under a
 * second name is how one quantity acquires two speeds.
 *
 * ⚠ READINESS IS THE NEUTRAL DEFAULT, STATED. The intervention record carries `strength`
 * but no readiness, and `advanceIntervention` does not stamp one; threading the patron's
 * martial readiness into the ledger is a recorded follow-on, not a silent omission. Until
 * then every column marches at `armyMarchWeeks`'s own documented neutral 0.5.
 *
 * ⚠ AN UNREACHABLE OR UNMAPPED PAIR YIELDS **0**, NOT INFINITY. That is
 * `hopDelayTicks`'s own discipline verbatim ("unreachable/unmapped ⇒ 0 — no path ⇒ no
 * surcharge"), and the alternative would silently delete an intervention the mover lawfully
 * committed. An aspatial world has no digest at all and takes the same 0.
 *
 * @param {unknown} worldState @param {string} fromId @param {string} toId
 * @returns {number} integer march ticks ≥ 0
 */
export function seatMarchTicks(worldState, fromId, toId) {
  const digest = activeSpatialDigest(/** @type {Parameters<typeof activeSpatialDigest>[0]} */ (asObject(worldState)));
  if (!digest) return 0;
  const from = String(fromId || '');
  const to = String(toId || '');
  if (!from || !to || from === to) return 0;
  const weeks = hopWeeks(digest, from, to);
  if (weeks == null || !(weeks > 0)) return 0;
  return armyMarchWeeks(weeks);
}

/**
 * THE SHARE-KEEP FACTOR a committed column carries into `interventionTilt` — the product of
 * the march delay and the welcome.
 *
 * ⭐ THE MARCH HALF IS A REPAIR, NOT A FEATURE, AND THE PROSE ALREADY PROMISED IT.
 * `pulseKernel.js` says of this very read, at `the arriving army tilts the verdict it reaches in time`:
 * *"…a column that arrives after the verdict marched to yesterday's coup."*
 * (A CONTENT ANCHOR, not a line number, and the distinction is enforced: RULE 1 of
 * `tests/lint/pulseKernelLineAddress.walker.test.js` freezes hand-keyed
 * `pulseKernel.js:<digits>` citations at ZERO across src/ and tests/, with no allowlist,
 * because a line number is text about source that no machine compares to source — every one
 * of the fifteen it replaced was measured stale, the worst by 107 lines. This car wrote one
 * anyway and the walker caught it.)
 * `interventionAdjFor` carried NO time term at all, so every committed column tilted at
 * full share the instant it committed, at any distance — the only thing making that
 * sentence partly true was the one-tick stage ordering, which is the same for a neighbour
 * and for an empire six weeks away. This makes the sentence true.
 *
 * ⚠ THE MARCH IS A STEP, NOT A RAMP, AND THAT IS THE HONEST SHAPE. An army is either at
 * the contest or on the road; there is no fractional column. A relief force that has not
 * arrived tilts NOTHING, and a coup that resolves before it lands is decided without it.
 *
 * THE WELCOME HALF is A1.2.13's "derived presence/consequence machinery for uninvited
 * entry", and it closes a measured hole: `interventionLegitimacy` computes, rounds and
 * documents a `legitimacyCost` whose ONLY consumer tree-wide is a news TAG that reads the
 * sibling `casusGenerative` flag. `LEGIT_COST_UNINVITED: 0.45` prices nothing — an army
 * that came uninvited pays exactly what an invited one pays. The consequence lands here, as
 * a SHARE keep rather than a legitimacy write, because a cross-court legitimacy debit is
 * A1.2.14's override-burn class (it must ride `applyLegitimacyDeltasToUpdates` with the
 * re-band, and SEAT-1's census already found EIGHT near-identical copies of that
 * applicator — a ninth is forbidden). The burn stays SEAT-2b's; the town's own resentment
 * blunting an unasked-for army is expressible here without a single persisted byte.
 *
 * DARK ⇒ EXACTLY 1, AND THE CALLER MULTIPLIES BY IT: `x * 1 === x` is bit-exact for every
 * finite double, so a dark run reproduces the previous share to the last bit. An INVITED,
 * ARRIVED column likewise keeps exactly 1.
 *
 * @param {unknown} worldState
 * @param {{ interId?: string, target?: string, side?: string, invited?: boolean, sinceTick?: number }} record
 * @param {number|null} [tick] the resolving tick; null/absent ⇒ no march term (every
 *   non-verdict caller keeps its pre-D9 answer)
 * @returns {number} a keep factor in [0,1]; exactly 1 when dark
 */
export function seatColumnKeep01(worldState, record, tick = null) {
  if (!seatInterventionLit(worldState)) return 1;
  const row = asObject(record);
  const arrived = seatColumnArrived(worldState, row, tick);
  if (!arrived) return 0;
  const invited = row.invited === true;
  return invited ? INVITED_TILT_KEEP01 : SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01;
}

/**
 * Has the column reached the contest? `true` whenever no tick is supplied (the caller has
 * no clock, so the march cannot be judged and the pre-D9 answer stands) and whenever the
 * march is instantaneous (adjacent, unmapped, or aspatial).
 * @param {unknown} worldState @param {Record<string, unknown>} row @param {number|null} tick
 * @returns {boolean}
 */
export function seatColumnArrived(worldState, row, tick) {
  if (tick == null || !Number.isFinite(Number(tick))) return true;
  const march = seatMarchTicks(worldState, String(row.interId ?? ''), String(row.target ?? ''));
  if (march <= 0) return true;
  const since = Number(row.sinceTick);
  const elapsed = Math.floor(Number(tick)) - (Number.isFinite(since) ? Math.floor(since) : 0);
  return elapsed >= march;
}

/**
 * ── CONSERVED COLUMNS (A1.2.13's first item), AND WHY THIS LEAF EXPORTS NOTHING FOR IT ──
 * The property is already true and the car's whole duty is to keep it true, so it is
 * PINNED rather than re-implemented: a court's committed strength is bounded by the one
 * column it may field, because the mover refuses a patron already holding a live
 * deployment (`busy.has(patronId)` — the one-army law honored at derivation) and refuses a
 * second record on a pair it already occupies (`if (next[key]) continue`). A widened
 * eligibility rule is exactly the change that could plausibly break that without anything
 * noticing — a seat-admitted suitor slipping past the busy check, or being admitted twice
 * because it is BOTH an edge neighbour and the seat. `seatSuitorsFor` returns the caller's
 * own array when the patron is already a neighbour, so the second failure cannot happen;
 * the first cannot happen because the widening feeds the same loop, before the same guards.
 * Both are asserted over a driven ledger in `tests/domain/seatIntervention.test.js`.
 * Exporting a counting helper with no production reader would have been dead code dressed
 * as machinery.
 */
