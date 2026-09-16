/**
 * tests/helpers/anchoredNegatives.js — the liveness anchor for negative assertions
 * (epistemic prevention, wave EP-1).
 *
 * THE CLASS: a bare `expect(collection).not.toContain(member)` is TRUE for two very
 * different reasons — the subject was correctly EXCLUDED, or the collection drifted
 * out from under the test entirely (renamed, re-shaped, emptied, or never built at
 * all). The second reading is a VACUOUS green: the assertion survives the exact
 * regression it exists to catch, and it does so silently, forever. The `re-rt-1`
 * roster case was caught by hand once; without machinery the class is unenforced.
 *
 * THE CURE: never assert absence alone. Pair every negative with a POSITIVE that can
 * only hold while the collection is live and correctly shaped. Two shapes cover the
 * estate:
 *
 *   expectPresentThenAbsent(before, after, member)  — a TRANSITION. The member was
 *     there and is now gone. The `before` assertion proves the pipeline can produce
 *     the member at all, so the `after` assertion measures removal rather than
 *     absence-of-everything.
 *
 *   expectAbsentWithAnchor(collection, member, anchor) — a SELECTION. Some sibling
 *     (`anchor`) IS in the collection, proving the collection is live, correctly
 *     keyed, and populated; `member` is the one thing correctly kept out.
 *
 * WHICH ANCHOR: pick a sibling that travels the SAME code path as the member and
 * would vanish under the same drift. A hardcoded constant that the pipeline never
 * touches is not an anchor — it re-introduces the vacuity one level up.
 *
 * ESCAPE HATCH: some negatives are structurally anchored by their surroundings (the
 * same `it()` already asserts the collection's exact length, or the subject is a
 * literal built in the test body). Those sites carry the inline annotation
 *   // anchored: <why this negative cannot go vacuous>
 * on the assertion line or the line immediately above it. The annotation is a
 * REASON, not a mute button — tests/lint/negativeAssertionAnchor.walker.test.js
 * accepts it and the reviewer reads it.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { expect } from 'vitest';

/**
 * Fail loudly and specifically when the subject cannot hold a `toContain` question
 * at all. `expect(undefined).toContain(x)` reports a matcher-type error whose text
 * hides the real problem (the producer returned nothing), so name it here.
 * @param {unknown} subject
 * @param {string} role which argument this is, for the message
 * @param {string} where caller-supplied context suffix
 */
function assertContainable(subject, role, where) {
  const containable = typeof subject === 'string' || Array.isArray(subject)
    || subject instanceof Set || subject instanceof Map;
  expect(
    containable,
    `anchored-negative misuse${where}: the ${role} is ${subject === null ? 'null' : typeof subject}`
    + `, which cannot answer a toContain question. A negative assertion against a subject`
    + ` that does not exist is the vacuity this helper exists to prevent — fix the producer`
    + ` or the accessor, never the assertion.`,
  ).toBe(true);
}

/** @param {string} [context] @returns {string} a bracketed suffix, or empty */
function suffix(context) {
  return context ? ` [${context}]` : '';
}

/**
 * A REMOVAL, anchored by its own before-state.
 *
 * Asserts `member` IS in `before` (the liveness anchor — the pipeline demonstrably
 * produces it) and then that it is NOT in `after`. A drift that empties or re-shapes
 * the collection now reds on the FIRST assertion instead of passing the second.
 *
 * @param {string|unknown[]|Set<unknown>|Map<unknown, unknown>} before the collection before the operation
 * @param {string|unknown[]|Set<unknown>|Map<unknown, unknown>} after the collection after the operation
 * @param {unknown} member the thing the operation is supposed to remove
 * @param {string} [context] short label naming the operation under test
 * @returns {void}
 */
export function expectPresentThenAbsent(before, after, member, context) {
  const where = suffix(context);
  assertContainable(before, 'before-collection', where);
  assertContainable(after, 'after-collection', where);
  expect(
    before,
    `LIVENESS ANCHOR${where}: the before-collection must already contain the member the`
    + ` operation is supposed to remove. It does not — so the "it is gone afterwards"`
    + ` assertion below would pass vacuously. Either the producer stopped emitting this`
    + ` member (a real regression) or the fixture no longer exercises the path.`,
  ).toContain(member);
  expect(
    after,
    `REMOVAL${where}: the member survived the operation (it was present before, and it is`
    + ` still present after).`,
  ).not.toContain(member);
}

/**
 * A SELECTION, anchored by a live sibling.
 *
 * Asserts `anchor` IS in `collection` (proving the collection is populated and
 * correctly keyed) and then that `member` is NOT. The anchor must travel the same
 * code path as the member, or the negative is still vacuous one level up.
 *
 * @param {string|unknown[]|Set<unknown>|Map<unknown, unknown>} collection the live collection under test
 * @param {unknown} member the thing that must be excluded
 * @param {unknown} anchor a sibling that must be present, proving the collection is live
 * @param {string} [context] short label naming the selection rule under test
 * @returns {void}
 */
export function expectAbsentWithAnchor(collection, member, anchor, context) {
  const where = suffix(context);
  assertContainable(collection, 'collection', where);
  // An anchor equal to the member asserts presence and absence of the same thing;
  // it can never both hold, so it is misuse rather than a weak anchor.
  expect(
    Object.is(member, anchor),
    `anchored-negative misuse${where}: the anchor and the excluded member are the same`
    + ` value. The anchor must be a DIFFERENT sibling that travels the same code path.`,
  ).toBe(false);
  expect(
    collection,
    `LIVENESS ANCHOR${where}: the anchor sibling is missing from the collection, so the`
    + ` exclusion assertion below cannot distinguish "correctly excluded" from "the whole`
    + ` collection drifted away". Fix the collection or choose an anchor that still`
    + ` travels this path — do not delete the anchor to get green.`,
  ).toContain(anchor);
  expect(
    collection,
    `EXCLUSION${where}: the member is present in a collection that is supposed to exclude`
    + ` it (the anchor sibling proves the collection is live).`,
  ).not.toContain(member);
}
