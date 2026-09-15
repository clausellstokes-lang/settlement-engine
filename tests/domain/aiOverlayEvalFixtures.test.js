/**
 * tests/domain/aiOverlayEvalFixtures.test.js — Track J part 1: the AI overlay
 * OUTPUT EVAL.
 *
 * Track I built the simulation a frozen corpus scored on meaning
 * (tests/simulation/semanticFixtures.test.js). This is the same instrument for
 * the AI layer: tests/fixtures/ai-overlay-eval-corpus.json holds one base
 * settlement plus eight (original, refined) overlay pairs expressed as deltas,
 * and each pair is scored against the EXACT verdict
 * src/domain/aiOverlayVerifier.js must return.
 *
 * ⚠ WHAT THIS ADDS OVER tests/domain/aiOverlayVerifier.test.js, MEASURED RATHER
 * THAN ASSUMED. That suite is 63 tests and it is thorough — the brief's premise
 * that "a regression that makes the verifier blind passes every existing AI
 * test" is REFUTED: stub verifyAiOverlay to always-clean and dozens of its
 * assertions red. What it does NOT do is score PRECISION. Its per-case shape is
 * `expect(result.summary.invented).toBe(1)` — one counter, the one the mutation
 * targets — so the other six are unasserted, and a verifier that grew a FALSE
 * POSITIVE on an unrelated class passes it untouched. An eval scores both
 * directions at once. Every case here pins the WHOLE seven-counter vector, the
 * `ok` verdict, AND the exact kind:field list, so over-reporting is as loud as
 * under-reporting.
 *
 * THE CONTROL IS THE CLEAN CASE, and it makes the corpus two-sided by
 * construction: a verifier stubbed always-clean fails the seven violation cases,
 * a verifier stubbed always-dirty fails the clean one. Neither constant survives.
 *
 * NO SRC CHANGE. The verifier is the subject of this eval, never its patient.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyAiOverlay, VIOLATION_KINDS } from '../../src/domain/aiOverlayVerifier.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_REL = '../fixtures/ai-overlay-eval-corpus.json';
/** @type {{ base: Record<string, unknown>, cases: Array<Record<string, any>> }} */
const corpus = JSON.parse(readFileSync(resolve(HERE, CORPUS_REL), 'utf8'));

/** The seven counters summariseViolations returns, in the order the emitter sends them. */
const COUNTERS = Object.freeze([
  'invented', 'removed', 'renamed', 'contradicted', 'canonChanged', 'historyDropped', 'userFieldChanged',
]);

/**
 * `a.b[0].c` to `['a','b',0,'c']`. The corpus keeps its edits as data, so the
 * ONE piece of code the grammar needs lives here rather than in the JSON.
 * @param {string} path
 */
function parsePath(path) {
  return path.split('.').flatMap((seg) => {
    const m = seg.match(/^([^[\]]+)((?:\[\d+\])*)$/);
    if (!m) throw new Error(`corpus: unparseable path segment '${seg}'`);
    const keys = [m[1]];
    for (const idx of m[2].matchAll(/\[(\d+)\]/g)) keys.push(Number(idx[1]));
    return keys;
  });
}

/**
 * Apply a case's edits to a deep clone of the base. `set` writes a value,
 * `push` appends to the array the path names, `remove` splices out the element
 * the path's trailing index names.
 * @param {unknown} base
 * @param {Array<{op:string, path:string, value?:unknown}>} edits
 */
function applyEdits(base, edits) {
  const doc = structuredClone(base);
  for (const edit of edits) {
    const keys = parsePath(edit.path);
    const last = keys.pop();
    let node = /** @type {any} */ (doc);
    for (const k of keys) {
      node = node[k];
      if (node == null) throw new Error(`corpus: path '${edit.path}' does not resolve in the base`);
    }
    if (edit.op === 'set') node[last] = edit.value;
    else if (edit.op === 'push') node[last].push(edit.value);
    else if (edit.op === 'remove') node.splice(last, 1);
    else throw new Error(`corpus: unknown op '${edit.op}'`);
  }
  return doc;
}

const kindFieldList = (violations) => violations.map((v) => `${v.kind}:${v.field}`).sort();

describe('AI overlay output eval — the corpus itself cannot go vacuous', () => {
  test('the corpus is loaded, non-trivial, and every case is distinct and documented', () => {
    expect(Array.isArray(corpus.cases)).toBe(true);
    // One clean control plus one case per violation class is the floor. Deleting
    // cases is the silent way to make an eval pass, so the floor is asserted.
    expect(corpus.cases.length).toBeGreaterThanOrEqual(1 + VIOLATION_KINDS.length);
    const ids = corpus.cases.map((c) => c.id);
    expect(new Set(ids).size, 'duplicate case ids').toBe(ids.length);
    for (const c of corpus.cases) {
      expect(typeof c.why, `${c.id}: every case states why it exists`).toBe('string');
      expect(c.why.length, `${c.id}: the reason is a sentence, not a label`).toBeGreaterThan(40);
      expect(Array.isArray(c.edits), `${c.id}: edits must be a list`).toBe(true);
      expect(c.expect, `${c.id}: every case carries a frozen expected verdict`).toBeTruthy();
      for (const counter of COUNTERS) {
        expect(typeof c.expect.summary[counter], `${c.id}: counter '${counter}' unpinned`).toBe('number');
      }
    }
  });

  test('every case actually moves the document (a typo\'d path cannot fake a violation)', () => {
    const baseJson = JSON.stringify(corpus.base);
    for (const c of corpus.cases) {
      const refined = applyEdits(corpus.base, c.edits);
      expect(
        JSON.stringify(refined),
        `${c.id}: the edits produced a document identical to the base, so this case scores nothing`,
      ).not.toBe(baseJson);
    }
  });

  test('every violation class the verifier declares is exercised by at least one case', () => {
    const exercised = new Set();
    for (const c of corpus.cases) {
      for (const entry of c.expect.violations) exercised.add(entry.split(':')[0]);
    }
    for (const kind of VIOLATION_KINDS) {
      expect(exercised.has(kind), `no corpus case scores '${kind}' — the class is unmeasured`).toBe(true);
    }
  });

  test('the corpus is TWO-SIDED: no constant verdict can satisfy it', () => {
    // At least one case expects ok:true and at least one expects ok:false, and
    // every counter is non-zero somewhere. An always-clean verifier fails the
    // second set; an always-dirty one fails the first.
    const verdicts = corpus.cases.map((c) => c.expect.ok);
    expect(verdicts, 'no clean case: an always-dirty verifier would pass').toContain(true);
    expect(verdicts, 'no violation case: an always-clean verifier would pass').toContain(false);
    for (const counter of COUNTERS) {
      const anyNonZero = corpus.cases.some((c) => c.expect.summary[counter] > 0);
      expect(anyNonZero, `counter '${counter}' is zero in every case — it is pinned to nothing`).toBe(true);
    }
  });
});

describe('AI overlay output eval — scored verdicts (exact vectors, frozen)', () => {
  // ⛔ ONE PARAMETERLESS TEST LOOPING OVER THE ROWS, NOT `test.each`. The estate's
  // each-family park debt (tests/lint/sovereigntyLightingContract.walker.test.js)
  // is shrink-only, and its message names the cure in exactly these words: "a
  // plain parameterless test looping over the rows in its body, never a new
  // `each` call". Every assertion below still names its case, so a red says which
  // pair moved.
  test('every pinned pair scores its frozen verdict exactly', () => {
    for (const testCase of corpus.cases) {
      const refined = applyEdits(corpus.base, testCase.edits);
      const result = verifyAiOverlay(corpus.base, refined);

      expect(result.ok, `${testCase.id}: ok verdict moved. ${testCase.why}`).toBe(testCase.expect.ok);
      // THE WHOLE VECTOR, not the one counter this case targets — that is the
      // difference between a unit assertion and an eval.
      const actual = Object.fromEntries(COUNTERS.map((k) => [k, result.summary[k]]));
      expect(actual, `${testCase.id}: the verdict vector moved. ${testCase.why}`)
        .toEqual(testCase.expect.summary);
      expect(kindFieldList(result.violations), `${testCase.id}: the violation addresses moved`)
        .toEqual([...testCase.expect.violations].sort());
    }
  });
});
