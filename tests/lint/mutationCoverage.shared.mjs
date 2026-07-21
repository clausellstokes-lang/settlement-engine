/**
 * mutationCoverage.shared.mjs — the E-A enumeration rule + sweep-label parser,
 * shared between tests/lint/mutationCoverageManifest.test.js (the meta-test) and
 * any tooling that regenerates scripts/mutation-coverage-manifest.json.
 *
 * THE ENUMERATION RULE (what counts as a "correctness-asserting invariant"):
 *   1. EVERY *.test.js / *.test.jsx under the seven ENFORCER DIRS — those trees
 *      exist to hold ratchets/walkers/censuses/scans/pins, so membership alone
 *      makes a file part of the enforcement spine.
 *   2. Elsewhere under tests/, every test file whose BASENAME carries invariant
 *      nomenclature (census, scan, baseline, ratchet, walker, killlist, parity,
 *      coverage, governance, freshness, integrity, exhaustiveness, roundtrip,
 *      golden, contract, pin — case-insensitive substring).
 *
 * KNOWN EDGES (deliberate, reviewed):
 *   - The substring match over-includes a handful of behavior tests whose names
 *     merely contain a token (e.g. "…SpinKeyframe…" matches "pin"). Harmless:
 *     they take an `uncovered` manifest entry like any other file.
 *   - An enforcer OUTSIDE the seven dirs named without any of the tokens escapes
 *     enumeration. The convention (walkers/censuses say so in their names) makes
 *     this rare; prefer fixing the name over widening the pattern.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

/** Trees whose every test file is part of the enforcement spine by construction. */
export const ENFORCER_DIRS = [
  'tests/lint',
  'tests/design',
  'tests/docs',
  'tests/data',
  'tests/copy',
  'tests/security',
  'tests/edgeFunctions',
];

/** Invariant nomenclature matched against basenames outside the enforcer dirs. */
export const NAME_PATTERN =
  /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Enumerate the correctness-asserting invariant test files under <root>/tests.
 * @param {string} root repo root (absolute)
 * @returns {string[]} sorted repo-relative forward-slash paths
 */
export function enumerateInvariants(root) {
  const all = walk(join(root, 'tests'))
    .map((p) => relative(root, p).replace(/\\/g, '/'))
    .filter((rel) => /\.test\.(js|jsx)$/.test(rel));
  const picked = all.filter(
    (rel) =>
      ENFORCER_DIRS.some((d) => rel.startsWith(`${d}/`)) ||
      NAME_PATTERN.test(basename(rel)),
  );
  return picked.sort();
}

/**
 * Parse the planted-mutation labels out of scripts/mutation-sweep.sh. A label is
 * the first quoted argument of any check_caught / check_caught_missing /
 * check_caught_planted call line.
 * @param {string} shText the sweep script source
 * @returns {string[]} labels in script order (duplicates preserved for detection)
 */
export function parseSweepLabels(shText) {
  const labels = [];
  for (const m of shText.matchAll(/^\s*check_caught(?:_missing|_planted)?\s+"([^"]+)"/gm)) {
    labels.push(m[1]);
  }
  return labels;
}
