/**
 * clampPrimitiveBaseline.test.js — code-quality-4 source-scan ratchet.
 *
 * There is now ONE clamp primitive: src/kernel/math.js (clamp, clamp01) with an
 * explicit non-finite policy. clamp/clamp01 had been hand-rolled ~70 times across
 * the engine with THREE divergent non-finite behaviours, and the copies were still
 * propagating (four movers copied the passthrough variant in the 48h before the
 * review). This ratchet halts that: it baselines every file that STILL defines a
 * local clamp/clamp01 and forbids any NEW one — new engine code must import the
 * kernel primitive.
 *
 * Like the forked-color / raw-button ratchets, the baseline is HONEST and MONOTONE:
 *   - it must EXACTLY equal the set of files that still define a local clamp copy
 *     (a NEW definition not in the baseline fails; a STALE entry whose copy was
 *     migrated to the kernel import must be removed — shrink the baseline);
 *   - it can never grow past its committed ceiling.
 *
 * Migrating a baselined copy → delete its entry here (and lower the ceiling). Only
 * migrate a copy the parity test (tests/kernel/clampPrimitive.parity.test.js)
 * proves byte-identical to the kernel over ALL inputs; copies with divergent
 * non-finite semantics (passthrough NaN-ride-through, Number()||0 coercion) stay
 * frozen here until their migration is separately proven byte-neutral.
 *
 * CANNOT-CATCH (documented evasion gaps): this scan matches a `function|const|let|
 * var clamp[01]` DEFINITION only. It does NOT catch a clamp implemented under a
 * different name (e.g. a local `finiteNumber` + inline Math.max/min), an object-
 * method `clamp01(){}`, or a clamp built by destructuring/assignment without a
 * declaration keyword. Those residuals are covered by code review + the eslint
 * import convention, not this guard.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KERNEL_HOME = 'src/kernel/math.js'; // the sanctioned definition site — exempt
const BASELINE_CEILING = 61; // committed max — lower it as copies migrate; never raise it

// A local clamp/clamp01 DEFINITION: a declaration keyword immediately followed by
// the name `clamp` or `clamp01` (word-bounded, so `clampedValue` / `clamp01Helper`
// do not match). Re-exports (`export { clamp01 }`) and imports/usages have no
// declaration keyword and are correctly ignored.
const DEF_RE = /(?:export\s+)?(?:function|const|let|var)\s+clamp(?:01)?\b/;

/** Strip comments so a clamp mention inside a doc comment never false-matches. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?)$/.test(e)) out.push(p);
  }
  return out;
}

const currentDefFiles = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((rel) => rel !== KERNEL_HOME)
  .filter((rel) => DEF_RE.test(stripComments(readFileSync(join(ROOT, rel), 'utf8'))))
  .sort();

const baseline = JSON.parse(
  readFileSync(join(ROOT, 'scripts/.clamp-primitive-baseline.json'), 'utf8'),
).sort();

describe('clamp primitive baseline ratchet (code-quality-4)', () => {
  test('baseline exactly matches the files that still define a local clamp/clamp01', () => {
    // A NEW definition missing from the baseline, or a STALE entry whose copy was
    // migrated to the kernel import — either direction fails here.
    expect(baseline).toEqual(currentDefFiles);
  });

  test('baseline never grows past its committed ceiling', () => {
    expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
  });
});
