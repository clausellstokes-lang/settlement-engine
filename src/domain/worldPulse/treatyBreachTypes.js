/**
 * treatyBreachTypes.js — GR-4a: THE FROZEN BREACH VOCABULARY.
 *
 * WHY THIS LEAF EXISTS AT ALL. `breachType` shipped with WR-0c as a one-producer,
 * one-value field: `treatyBreach.js` wrote `'repudiation'` and nothing else ever
 * could. Two of its three consumers therefore compared a HARDCODED LITERAL rather
 * than the exported constant — `peaceTerms.js`'s shell-preservation guard and
 * `treatyDisposition.js`'s held-outcome guard. That was harmless while the
 * vocabulary had one member. The moment GR-4a mints a SECOND member, both literals
 * become silent defects: a `succession_repudiation` shell would miss the
 * preservation branch and fall through the ordinary advance as a live instrument
 * whose terms already expired, and the disposition adapter would mint `treaty_held`
 * "win" deltas for BOTH parties at the horizon — rewarding both courts for a treaty
 * one of them tore up.
 *
 * ⛔ THE SUPERSET RULE, AND IT IS THIS FILE'S WHOLE REASON FOR BEING FROZEN AND
 * ORDERED. `isRepudiationBreach` must be a STRICT SUPERSET of the `=== 'repudiation'`
 * test it replaces, so that for every record any CURRENT world can hold the answer
 * is bit-for-bit what it was. That is bought three ways and all three are load-bearing:
 *   1. `BREACH_TYPES[0] === 'repudiation'` — the incumbent value is a member, so
 *      every record that answered true still answers true.
 *   2. the SAME coercion the two literals use today — `String(x?.breachType || '')`
 *      — so a missing, null, false, empty or non-string field coerces identically.
 *   3. the only OTHER member is a value no landed producer can write, so no existing
 *      record can newly answer true.
 * A dark world is therefore byte-identical BY CONSTRUCTION rather than by testing,
 * and any measured dark-path motion is a premise refutation rather than a golden.
 *
 * ⛔ ZERO IMPORTS, BY CONSTRUCTION. A vocabulary leaf that imports nothing cannot
 * participate in an import cycle and cannot drag a graph into either consumer's
 * closure — and both consumers here (`peaceTerms.js`, `treatyDisposition.js`) sit
 * inside the treaty family's already-dense import web, where a new edge is exactly
 * the class of change that has produced boot-order defects in this estate before.
 *
 * ⛔ `TREATY_REPUDIATION_TYPE` STAYS WHERE IT IS. It remains exported from
 * `treatyBreach.js` with its landed spelling and value: it is a public symbol the
 * coupling registry may name, and "deduplicating" it into this leaf would be a
 * public-surface change wearing a tidiness costume. The duplication of the literal
 * between that constant and `BREACH_TYPES[0]` is deliberate — the producer keeps its
 * own constant, the vocabulary keeps the closed set — and the two are pinned equal.
 *
 * TOTAL BY CONTRACT: `null`, `undefined`, a number, a string, a missing field and a
 * foreign value all answer `false` without throwing. There is no shape this can be
 * handed that makes it a source of exceptions in a consumer's guard.
 *
 * @enforced-by tests/domain/successionQuestion.test.js
 */

/**
 * THE CLOSED BREACH VOCABULARY, in the order the superset rule requires: the
 * incumbent open repudiation FIRST (`BREACH_TYPES[0]`), then GR-4a's succession
 * disavowal. Both are ENDINGS of an instrument, not compliance verdicts — an
 * ordinary default is `complianceState`, and it never writes this field.
 * @type {readonly string[]}
 */
export const BREACH_TYPES = Object.freeze(['repudiation', 'succession_repudiation']);

/**
 * Is this record's breach a REPUDIATION of any kind — the question both cured
 * literals were really asking? Total on every shape.
 *
 * @param {unknown} treatyLike a treaty record, or anything at all
 * @returns {boolean}
 */
export function isRepudiationBreach(treatyLike) {
  const record = /** @type {{ breachType?: unknown }} */ (
    treatyLike && typeof treatyLike === 'object' ? treatyLike : {}
  );
  return BREACH_TYPES.includes(String(record.breachType || ''));
}
