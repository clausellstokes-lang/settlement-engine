/**
 * mutationCoverage.shared.mjs — the E-A enumeration rule + sweep-label parser,
 * shared between tests/lint/mutationCoverageManifest.test.js (the meta-test) and
 * any tooling that regenerates scripts/mutation-coverage-manifest.json.
 *
 * THE ENUMERATION RULE (what counts as a "correctness-asserting invariant"):
 *   1. EVERY *.test.js / *.test.jsx under the EIGHT ENFORCER DIRS — those trees
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

/**
 * Trees whose every test file is part of the enforcement spine by construction.
 *
 * `tests/generators` joined 2026-08-30 under ODQ 764.2, on the 759.4 finding that
 * 97 of its 108 files were invisible to the guard-of-guards — not by any judgment
 * that they need no coverage, but because their basenames carry none of the
 * NAME_PATTERN tokens. The tree is not a walker tree; what its members share is a
 * weaker but CHECKABLE property, `subjectCouplingOf` below, and the manifest rows
 * that admitted them cite it rather than asserting a promise in prose.
 */
export const ENFORCER_DIRS = [
  'tests/lint',
  'tests/design',
  'tests/docs',
  'tests/data',
  'tests/copy',
  'tests/security',
  'tests/edgeFunctions',
  'tests/generators',
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
 * The rationale id every `tests/generators` file admitted by the ODQ 764.2 widening
 * carries. Named here rather than in the test so the register and the arm that
 * checks it cannot drift apart by a spelling.
 */
export const ADMITTED_TREE_REF = 'generators-tree-admitted-subject-coupled-2026-08-30';

/**
 * THE ADMITTED-TREE CLASS, AS A PREDICATE RATHER THAN A PROMISE.
 *
 * A `rationale` row says mutation-testing is redundant here. For the 97 files the
 * ODQ 764.2 widening admitted, the reason is that each one already SCANS OR
 * EXECUTES PRODUCTION MATERIAL AND ASSERTS ON WHAT CAME BACK — so a planted
 * regression in production code would prove only that a test tests its own
 * subject. That reason is worth exactly as much as its truth, and prose cannot
 * keep it true: a member gutted to a smoke check would go on citing a paragraph
 * that had stopped describing it.
 *
 * So the claim is re-derived from disk, per member, on every gate run. Two ways to
 * reach production material are recognised because the tree really does use both:
 * an IMPORT of a module in a production tree (95 of the 97 — 94 under src/, and
 * generationCertificationSoak, whose subject is the shipped audit driver under
 * scripts/audit/), or a readFileSync-shaped SCAN of a production path (the
 * remaining two, powerStructure and servicesStructure, which assert over generator
 * source text rather than generator output).
 *
 * ⚠ The scripts/ arm is here because the first execution of this predicate REFUSED
 * generationCertificationSoak — the paragraph said "under src/" and the file's
 * subject does not live there. That is the arm working, on its first run, against
 * its own author: the class is PRODUCTION MATERIAL, not one directory name.
 *
 * @param {string} source the test file's text
 * @returns {{ importsSubject: boolean, scansSubject: boolean, asserts: boolean, coupled: boolean }}
 */
const PRODUCTION_TREES = 'src|api|scripts';

export function subjectCouplingOf(source) {
  const importsSubject =
    new RegExp(`from\\s+'(?:\\.\\./)+(?:${PRODUCTION_TREES})/`).test(source)
    || new RegExp(`import\\(\\s*'(?:\\.\\./)+(?:${PRODUCTION_TREES})/`).test(source);
  const scansSubject =
    /readFileSync\s*\(/.test(source) && new RegExp(`['"\`][^'"\`]*\\b(?:${PRODUCTION_TREES})/`).test(source);
  const asserts = /\bexpect\s*\(/.test(source);
  return { importsSubject, scansSubject, asserts, coupled: (importsSubject || scansSubject) && asserts };
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

/**
 * Parse the files the sweep MUTATES IN PLACE — the second argument of every
 * check_caught (git-revert variant) and check_caught_missing (mv-aside variant)
 * call. check_caught_planted is excluded on purpose: it writes a path that must
 * not already exist and refuses otherwise, so it can never touch real content.
 * @param {string} shText the sweep script source
 * @returns {{ label: string, file: string }[]} in script order
 */
export function parseSweepMutationTargets(shText) {
  const targets = [];
  for (const m of shText.matchAll(/^\s*check_caught(?:_missing)?\s+"([^"]+)"\s+(\S+)/gm)) {
    targets.push({ label: m[1], file: m[2] });
  }
  return targets;
}

/**
 * Parse the MUTATED_FILES=( … ) dirty-tree refusal guard out of the sweep script.
 * @param {string} shText the sweep script source
 * @returns {string[]} the listed paths, in script order
 */
export function parseGuardedMutatedFiles(shText) {
  const block = shText.match(/^MUTATED_FILES=\(\n([\s\S]*?)^\)$/m);
  if (!block) return [];
  return block[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}
