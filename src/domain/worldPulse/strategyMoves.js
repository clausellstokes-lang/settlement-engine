/**
 * strategyMoves.js — HB-1. THE ESTATE'S ONE CLOSED STRATEGY-MOVE VOCABULARY.
 *
 * ⛔ DEPENDENCY-FREE BY CONTRACT, NOT BY HABIT: this file has ZERO imports and a source
 * scan pins that it stays that way. The cross-volume collision contract (the war-circulation
 * volume's §4.1.1) rules that exactly ONE module exports the closed move vocabulary, that
 * whichever volume BUILDS ITS STRATEGY WAVE FIRST mints it as a dependency-free leaf, and
 * that the second volume AMENDS the same leaf rather than minting a second. MEASURED at the
 * code of record: that volume's own wave has not landed — its four named modules are absent,
 * its single-exporter fences do not exist, and its two flags are unminted — so HABIT builds
 * first and HABIT mints, which is also the contract's own recommendation.
 *
 * ⛔ THAT CONTRACT OVERRIDES THIS WAVE'S OWN CHARTER CLAUSE. The charter asked for the
 * totality to be a DERIVED export off the scoring objective's implicit lever set. Deriving
 * it would give the shared leaf a dependency and break the contract on its first day, so the
 * direction reverses: the leaf stays frozen and zero-import, and the objective's lever keys
 * are pinned INSIDE this totality from the TEST side instead.
 *
 * ── WHY THERE ARE TWO EXPORTS, AND WHY THE SECOND ONE MATTERS TODAY ─────────────
 *
 * ⚠⚠ THE HAZARD NEITHER VOLUME NAMES. This wave's totality pin makes `STRATEGY_MOVES`
 * EXACTLY the emitter's set — the enumeration on generated worlds is the denominator, never
 * a hand list. The other volume's later wave adds three AUXILIARY moves that are DISPATCHED
 * and never emitted by the enumerator, so a naive additive widening of `STRATEGY_MOVES`
 * would red this wave's own emitter pin on the day it landed.
 *
 * The cure costs nothing now and is expensive later, so it ships today: `STRATEGY_MOVES` is
 * the chooser's EMITTED totality, pinned against the emitter, and `ALL_MOVE_TOKENS` is the
 * union every fence and every outside-the-export scan keys on. They are asserted EQUAL
 * today. An amending volume adds its dispatched-but-unemitted moves to the UNION and not to
 * the emitted set, and neither pin moves.
 *
 * ── THE MARTIAL-HISTORY SUBSET IS A PREDICATE, NOT A COPY ───────────────────────
 *
 * The chooser carried a local eight-member set and the wave charter called it "a THIRD
 * hand-maintained copy of the move vocabulary" to be retired into the totality. MEASURED:
 * it is a PROPER SUBSET that deliberately excludes three moves which ARE emitted, and its
 * single consumer is a semantic guard — it records that martial history already entered a
 * move through the aggressiveness read, so the bar is never multiplied by it twice.
 * Retiring an eight-member predicate into an eleven-member totality would add a disposition
 * reason to three moves that deliberately carry none: live behaviour on the estate's most
 * contended chooser.
 *
 * So it is not retired; it becomes a NAMED DERIVED SUBSET with its exclusions pinned BY
 * NAME. Drift prevention is fully preserved — membership now derives from the frozen
 * totality — and behaviour is untouched.
 *
 * PURE. No world state, no store, no PRNG, no imports.
 *
 * @enforced-by tests/domain/strategyMoves.test.js
 * @enforced-by tests/lint/strategyMoveVocabulary.walker.test.js
 */

/**
 * THE CHOOSER'S EMITTED TOTALITY, codepoint-sorted — the four base moves every seat
 * scores, plus the seven archetype levers. ⛔ PINNED AGAINST THE EMITTER on generated
 * candidates: the enumeration is the denominator and this array is checked against it in
 * both directions, never the other way round.
 * @type {readonly string[]}
 */
export const STRATEGY_MOVES = Object.freeze([
  'credit',
  'defend',
  'deploy',
  'embargo',
  'hold',
  'legitimacy',
  'missionize',
  'opportunity',
  'prestige',
  'reroute',
  'sue_for_peace',
]);

/**
 * EVERY TOKEN ANY VOLUME MAY BRANCH ON. Equal to the emitted totality today, and asserted
 * so. An amending volume's dispatched-but-unemitted moves join HERE, not above: widening
 * the emitted set would red its own emitter pin, because the enumerator never emits them.
 * The single-exporter fence and the outside-the-export scan both key on THIS union.
 * @type {readonly string[]}
 */
export const ALL_MOVE_TOKENS = Object.freeze([...STRATEGY_MOVES]);

/**
 * THE THREE MOVES THAT DELIBERATELY CARRY NO MARTIAL REASON, named so the exclusion is a
 * decision rather than an omission. All three ARE emitted moves; none of them is a martial
 * act, so martial history never entered them through the aggressiveness read and there is
 * nothing for the chooser to record a single consumption of.
 * @type {readonly string[]}
 */
export const NON_MARTIAL_HISTORY_MOVES = Object.freeze([
  'embargo',
  'legitimacy',
  'reroute',
]);

/**
 * THE MOVES WHOSE BAR ALREADY CONSUMED MARTIAL HISTORY — DERIVED from the frozen totality
 * minus the named exclusions, so the membership can never drift from the vocabulary while
 * the behaviour stays exactly what it was.
 *
 * ⚠ AN ARRAY, DELIBERATELY, AND THE SHAPE IS LOAD-BEARING. The consumer tests membership
 * with `includes`. Re-wrapping this in a `Set` at the call site would keep a declaration
 * line AND add an import line to a file whose size ratchet has tolerance ZERO in both
 * directions — a measured +1, which is a hard stop.
 * @type {readonly string[]}
 */
export const MARTIAL_HISTORY_MOVES = Object.freeze(
  STRATEGY_MOVES.filter((move) => !NON_MARTIAL_HISTORY_MOVES.includes(move)),
);
