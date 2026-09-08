/**
 * tests/helpers/dormancyOracle.js — the load-bearing dormancy normalizer.
 *
 * `normalizeForDormancy` is the STRUCTURAL normalized deep-equal that the entire
 * same-seed byte-identity estate compares through: it treats an ABSENT key as its
 * default (an empty object/array), so `absent === {} === []`. It drops empty-{}/[]
 * keys, recurses into nested containers, and sorts object keys, yielding a canonical
 * form for deep-equal comparison. A later phase bolting on an additive EMPTY ledger
 * (dispositionStats:{}, deployments:{}, a conditional pantheon, …) is byte-neutral
 * under this oracle even though a raw JSON.stringify would flag it as churn.
 *
 * WHY IT LIVES HERE (tests-estate-2): this oracle used to be `export`ed from inside
 * tests/domain/religionDormancy.byteIdentity.test.js. Importing a symbol from a
 * .test.js file RE-EVALUATES that module — so religionDormancy's two pulse-driving
 * tests re-registered once per importer (22× across the estate), and every "byte-
 * identical" gate was coupled to that one test file's NAME: renaming or refactoring
 * it would break 21 sibling suites. Extracting the pure oracle to a plain helper
 * (no describe/test) breaks both couplings — the two proofs stay in the original
 * file (which now imports the oracle from here like everyone else), and the golden
 * hashes are unchanged because the normalizer logic is byte-identical to its former
 * in-test definition.
 *
 * Pure and deterministic: no side effects, no I/O, no clock, no randomness; its only
 * import is node:crypto's hasher, used by the bit arms below. Do NOT add a describe/test
 * to this file — that would re-introduce the re-registration coupling this fix removed.
 *
 * ── THE BIT ARM (ODQ §713.2, TE-GOLDEN-1 charter arm 2) ──────────────────────────
 * §713.2's standard is "bit-identical or it is not dormant", and the paragraph above
 * admits in its own words that this oracle cannot deliver it: a phase that bolts on an
 * additive EMPTY ledger is "byte-neutral under this oracle even though a raw
 * JSON.stringify would flag it as churn". So the canonical form is a comparator with a
 * KNOWN blindness, and until now the committed dormancy estate had no arm that could see
 * through it. The two exports below are that arm.
 *
 * `rawBitFormOf` IS THE STANDING CLAIM. Insertion order is deterministic within one
 * build, so when it moves, that movement is real byte churn — the kind that shows up in
 * every persisted artifact of that world. `stableBitFormOf` is DIAGNOSTIC, not the claim:
 * it is the sorted-key form the cross-build probes chose so that refactored insertion
 * order could not fake a difference, and it stays the right tool for base-versus-tip
 * comparison. Pinning both costs one extra hash per fixture and buys instant
 * localisation — a red `raw` beside a green `stable` says "pure key-order movement" in
 * one read, with no bisection.
 *
 * ⚠ A CLAIM DELIBERATELY NOT MADE. It is tempting to say `rawBitFormOf` equals what a
 * saved game hashes to, and the design draft did say it. It is left OFF because it is
 * unverified: saves may serialize through an envelope, in which case the equality is
 * false in exactly the cases that would matter. Assert the guarantee, not the algorithm.
 * The settling command, if the claim is ever wanted: hash a real persisted save's world
 * payload against `rawBitFormOf` of the world it was made from, and record the result.
 * Until then these are comparators over dormant projections and nothing more.
 */

import { createHash } from 'node:crypto';

// Recursive structural normalizer. Drops keys whose value normalizes to an empty
// object or empty array (absent === {} === []), recurses into nested containers,
// and is order-stable for object keys (keys sorted). Returns a canonical form
// suitable for deep-equal comparison.
export function normalizeForDormancy(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForDormancy);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const normalized = normalizeForDormancy(value[key]);
      // Absent === empty-object === empty-array: skip empty containers.
      const isEmptyObject = normalized
        && typeof normalized === 'object'
        && !Array.isArray(normalized)
        && Object.keys(normalized).length === 0;
      const isEmptyArray = Array.isArray(normalized) && normalized.length === 0;
      if (isEmptyObject || isEmptyArray) continue;
      out[key] = normalized;
    }
    return out;
  }
  return value;
}

/**
 * The sorted-key stable stringify the cross-build probes standardised on. Recurses into
 * containers so nesting cannot hide an unsorted level; arrays keep their order because
 * their order is data, not layout.
 */
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const parts = Object.keys(value).sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${parts.join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

/**
 * THE STANDING BIT CLAIM: sha256 of the RAW serialization of a dormant projection.
 * Key-order churn and additive-empty-ledger churn both convict here — exactly the two
 * classes the canonical form blesses.
 */
export function rawBitFormOf(value) {
  return createHash('sha256').update(JSON.stringify(value) ?? 'null').digest('hex');
}

/**
 * THE DIAGNOSTIC ARM: sha256 of the sorted-key stable form. Insensitive to key order by
 * design, so a red raw beside a green stable localises the drift to key order alone.
 */
export function stableBitFormOf(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}
