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
 * Pure: no imports, no side effects, deterministic. Do NOT add a describe/test to
 * this file — that would re-introduce the re-registration coupling this fix removed.
 */

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
