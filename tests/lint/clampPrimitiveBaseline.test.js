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
 * ⚠⚠ THE NAMED EXCEPTION — a live instance of the first gap, found by lane CLAMP-W2
 * (receipt §6.3) one module from its own migration work:
 *
 *     src/domain/townCartography/cartographyMorphology.js:62
 *     function unit(value) { return value < 0 ? 0 : value > 1 ? 1 : value; }
 *
 * That is a passthrough `clamp01` wearing the name `unit`. `DEF_RE` cannot see it, so
 * it is not one of the files this baseline counts, and it must NOT be added as a row —
 * the row set is defined by what the regex matches, and hand-adding one would make the
 * exact-equality arm above unmaintainable.
 *
 * ⛔ IT IS ALSO NOT SOMETHING TO MIGRATE. It is what bounds `fabricAccumulation01`
 * (`cartographyMorphology.js:137` returns `unit(sum/n)`), and the wave-2 byte-neutrality
 * proof for `cartographyBuildings` depends on its `+Infinity ⇒ 1` reading — the kernel
 * primitive reads `+Infinity` as the LOW bound instead. Migrating it would change a
 * number the migration proof rests on.
 *
 * ⭐ SO THE DETECTOR'S REACH IS STATED HERE AND PINNED BELOW (third arm). The pin is
 * what makes the exception safe: a future rename of `unit` back to `clamp01`, or a
 * rewrite of its body, reds — so the gap cannot silently mint an INVISIBLE copy, which
 * is the only way a documented gap turns into a real one. ⚠ Extending `DEF_RE` itself
 * is deliberately NOT the cure: the regex defines the row set, so widening it would
 * move the baseline, the ceiling and the census row all at once.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KERNEL_HOME = 'src/kernel/math.js'; // the sanctioned definition site — exempt
// THE ONE RAISE THIS CEILING HAS EVER TAKEN, and it is a ruling rather than a slip:
// chair ruling CR-WR10-A(b) (2026-08-04) widened 61 → 62 for
// `src/domain/worldPulse/sovereigntyAppraisal.js`, which is pinned at ZERO IMPORTS in
// `tests/domain/envoyK3BeliefSeam.test.js` (WR-10 amendment S names the appraisal among
// the paths that may never read true world state) and therefore CANNOT import the kernel
// primitive without deleting the belief pin. Its sibling `sovereigntyBundle.js`, which
// carries no such pin, migrated to the kernel clamp under CR-WR10-A(a) instead of taking
// a row — so the wave's net effect on this ratchet is ONE justified, documented row.
// The shrink-only rule is otherwise untouched: lower this as copies migrate, and never
// raise it again without a ruling of the same kind recorded in the file that needs it.
// ⭐⭐ THE SECOND RAISE THIS CEILING HAS EVER TAKEN, 62 → 69 on 2026-09-05 (chair ruling RULING-CLAMP-FINAL, Fable 5.1;
// refs/preserve/chair-tools-2026-09-05) — by EXACTLY the measured residual, after three waves migrated nine copies onto
// src/kernel/math.js and the mechanical work was exhausted. The seven that enter each carry a recorded doctrinal reason:
//   warAllianceRisk.js, conquestFeasibility.js — excluded by name at wave 0 (clamp-wave0-ruling-2026-09-04, fence 3);
//   conquestIntent.js — an import pin (envoyK3BeliefSeam.test.js:356 pins [] imports): a belief pin outranks this ratchet;
//   conquestExecution.js — a "NO IMPORTS AT ALL" header that warSeatBooksPartition.test.js:313 rules WINS (wave 1);
//   razing.js, razingWitness.js — the same header AND executed pins (razingWr8:616, razingWitnessWr8:494) (wave 2);
//   razingExecution.js — wave-0 FENCE 1: its local clamp01 IS the num()-style screen at nine unknown-typed reads, and
//     typecheck:domain:strict (+9) refuted a migration that had passed a 1,155-row value differential (a differential
//     proves VALUES, not TYPES).
// A file can be provably safe and still not free to move. ⚠ cartographyMorphology.js:62 defines a passthrough clamp01
// under the name `unit`, invisible to DEF_RE and load-bearing for the cartographyBuildings proof — NOT a copy to migrate
// and NOT a baseline row (DOCKET item 6). MONOTONE DOWN from here: lower it as copies migrate; never raise it again
// without a ruling of this kind, named file by file.
const BASELINE_CEILING = 69; // committed max — lower it as copies migrate; never raise it without a named ruling

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

/**
 * THE DETECTOR'S REACH, STATED. Clamps this scan structurally CANNOT see, pinned at
 * their address so the documented gap can never quietly become an invisible copy.
 * `$` in `body` stands for whatever the parameter is named, so a rename of the
 * PARAMETER is not a false red while a rewrite of the EXPRESSION is a real one.
 * ⛔ These are NOT baseline rows and must never be added as such — the row set is
 * exactly what `DEF_RE` matches. See the header for why neither the regex nor the
 * definition itself may be changed to close this.
 */
const KNOWN_ALIAS_CLAMPS = Object.freeze([Object.freeze({
  file: 'src/domain/townCartography/cartographyMorphology.js',
  name: 'unit',
  body: 'return $ < 0 ? 0 : $ > 1 ? 1 : $;',
})]);

describe('clamp primitive baseline ratchet (code-quality-4)', () => {
  test('baseline exactly matches the files that still define a local clamp/clamp01', () => {
    // A NEW definition missing from the baseline, or a STALE entry whose copy was
    // migrated to the kernel import — either direction fails here.
    expect(baseline).toEqual(currentDefFiles);
  });

  test('baseline never grows past its committed ceiling', () => {
    expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
  });

  test('the NAMED CANNOT-CATCH alias is still at its address, with its passthrough body', () => {
    for (const alias of KNOWN_ALIAS_CLAMPS) {
      const aliasSource = readFileSync(join(ROOT, alias.file), 'utf8');
      // LIVENESS FIRST: a renamed or emptied file must red here, not pass the checks below.
      expect(aliasSource.length, `${alias.file} read empty`).toBeGreaterThan(0);
      const found = new RegExp(
        `function\\s+${alias.name}\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*\\{([^}]*)\\}`,
      ).exec(aliasSource);
      expect(
        found,
        `${alias.file}: the aliased clamp \`${alias.name}\` is gone from its address. If it `
        + 'was RENAMED to clamp/clamp01 it is now a baseline row and this entry must go; if it '
        + 'was migrated to the kernel primitive, delete this entry AND re-check the '
        + 'cartographyBuildings byte-neutrality proof, which rests on its +Infinity ⇒ 1 reading.',
      ).toBeTruthy();
      expect(found[2].trim().replace(/\s+/g, ' '), `${alias.file}: \`${alias.name}\` body moved`)
        .toBe(alias.body.replaceAll('$', found[1]));
      // AND IT IS STILL INVISIBLE TO THE DETECTOR — the whole reason this arm exists.
      // Anchored on a file the detector DOES see and that can never leave its output:
      // razing.js is pinned at zero imports by tests/domain/razingWr8.test.js, so it can
      // never migrate to the kernel primitive (CLAMP-W2 refusal 1, executed pin).
      expectAbsentWithAnchor(
        currentDefFiles,
        alias.file,
        'src/domain/worldPulse/razing.js',
        `DEF_RE cannot see the aliased clamp \`${alias.name}\``,
      );
    }
  });
});
