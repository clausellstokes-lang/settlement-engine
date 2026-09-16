/**
 * tests/build/validateEdgeFunctionsSyntaxOnly.test.js — pins what the edge-fn
 * pre-flight actually checks, so its guarantee can't be silently overstated.
 *
 * validate-edge-functions.mjs runs ts.transpileModule() per file, which compiles
 * each module in ISOLATION with no type-checker. The gate's diagnostics are
 * therefore SYNTACTIC only: a genuine TYPE error transpiles cleanly and passes.
 * That is a deliberate, documented limitation — full type checking is owned by
 * `deno task check:edge` in CI's deno-tests job — but it's the kind of thing a
 * future reader assumes is stronger than it is. These tests make the boundary an
 * executable fact by exercising the EXACT mechanism the script depends on
 * (ts.transpileModule with reportDiagnostics), with no mutation of the live
 * supabase/functions/ tree (which would race the other gate tests that scan it):
 *   - a SYNTAX error MUST surface a diagnostic (the real value), and
 *   - a TYPE error MUST surface NONE (the documented blind spot, kept honest).
 * If someone strengthens the script to a ts.createProgram() type-check pass, the
 * second expectation flips and must be consciously updated alongside the script
 * comment — which is exactly the review-theater this pins against.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import {
  blankLiterals,
  moduleTopEnvMutationOffenders,
} from '../../scripts/edgeEnvScopeGuard.mjs';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/validate-edge-functions.mjs');
const FUNCTIONS_DIR = join(ROOT, 'supabase/functions');

// Mirror the script's transpile call exactly so this test tracks its real behavior.
function diagnose(source) {
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
    fileName: 'probe.ts',
  });
  return result.diagnostics || [];
}

describe('validate-edge-functions.mjs is a SYNTAX pre-flight (documented limitation)', () => {
  it('surfaces a diagnostic for a genuine syntax error (the real value of the gate)', () => {
    // Malformed arrow — transpileModule cannot parse it.
    expect(diagnose('export const broken = (=> {\n').length).toBeGreaterThan(0);
  });

  it('surfaces NO diagnostic for a genuine TYPE error (no type-checker present)', () => {
    // Assigning a string to a number is a TYPE error a checker would reject;
    // transpileModule strips types and emits clean JS, so it reports nothing.
    expect(diagnose('const n: number = "not a number";\nexport const x = n;\n')).toEqual([]);
  });

  it('the script documents its syntax-only limitation and refuses module-top env mutation', () => {
    // Guard the honesty note itself: a future reader must not be able to quietly
    // delete the caveat without either keeping it or upgrading to a real type pass.
    const src = readFileSync(SCRIPT, 'utf8');
    expect(src).toMatch(/SYNTAX check, not a type check|not a type check/i);
    expect(src).toMatch(/transpileModule/);

    // ── THE MODULE-TOP ENV MUTATION GUARD (TE34 member 4) ────────────────────
    // ⛔ THE CLASS: `deno test` runs every edge suite in ONE process with ONE `Deno.env`,
    // so a module-top `Deno.env.set` is ambient for every other suite and is never
    // restored — it re-pointed `cors.ts`'s first allowed origin and red the deno-tests CI
    // job. The cure is the `_shared/scopedTestEnv.ts` seam; this is the guard that stops
    // the next one, and it is wired HERE because the scan is driven by the same script.
    expect(src).toMatch(/moduleTopEnvMutationOffenders/);
    expect(src).toMatch(/collectTests/);
    // The scan must be non-vacuous by construction: a walk that found no suites would
    // report clean. The floor is asserted in-source, not just believed.
    expect(src).toMatch(/TEST_SUITE_FLOOR/);

    // ⭐ THE CONTROLS RUN THE REAL DETECTOR OVER FIXTURES — never a re-implementation of
    // it — so this arm cannot pass while the shipped scan is broken.
    const positives = [
      "Deno.env.set('CLIENT_URL', 'https://x.example');",
      'Deno.env.set("SUPABASE_URL", "https://x");',
      "Deno.env.delete('OWNER_EMAIL');",
    ];
    for (const plant of positives) {
      expect(
        moduleTopEnvMutationOffenders(`import x from './y.ts';\n${plant}\n`, 'probe.test.ts'),
        `the detector missed a module-top mutation: ${plant}`,
      ).toHaveLength(1);
    }
    // DISCRIMINATION NEGATIVES — each is the SAME call at a depth the leak cannot reach,
    // or a shape that only mentions it. A detector that convicted these would make the
    // cure impossible to write.
    const negatives = {
      'inside a test body': "Deno.test('a', () => {\n  Deno.env.set('K', 'v');\n});",
      'inside a helper function': "function f() {\n  Deno.env.delete('K');\n}",
      'inside the scoped registrar call': "scopedEnv.test('a', () => {\n  Deno.env.set('K', 'v');\n});",
      'a read, which leaks nothing': "const k = Deno.env.get('CLIENT_URL');",
      'named only inside a string': "const doc = \"Deno.env.set('K', 'v')\";",
      'named only inside a comment': "// Deno.env.set('K', 'v') is what this replaces\n",
      'the scoped seam itself': "const scopedEnv = installScopedTestEnv({ K: 'v', J: null });",
    };
    for (const [why, plant] of Object.entries(negatives)) {
      expect(
        moduleTopEnvMutationOffenders(plant, 'probe.test.ts'),
        `the detector convicted a lawful shape (${why})`,
      ).toEqual([]);
    }
    // The literal blanker is what makes the two string/comment negatives real rather than
    // lucky: it must preserve length and line structure exactly, or every reported line
    // number would be wrong.
    const withLiterals = "const a = 'xx';\n// yy\nconst b = `zz`;\n";
    expect(blankLiterals(withLiterals)).toHaveLength(withLiterals.length);
    expect(blankLiterals(withLiterals).split('\n')).toHaveLength(withLiterals.split('\n').length);
    // ⛔ AS A TRANSITION, NOT A BARE ABSENCE. An unanchored absence assertion is true just
    // as happily when the blanker returned an empty string as when it correctly stripped
    // the literal, so it would outlive the regression it exists to catch. The before-half
    // is the liveness anchor: the probe demonstrably CARRIES what the blanker must remove.
    // ⚠ AND THE PROSE ABOVE MUST NOT SPELL THE FORBIDDEN MATCHER EITHER — the anchor
    // walker scans RAW TEXT with no comment blanking, so naming it in a comment convicts
    // the line. Cost me one gate cycle; described, never quoted.
    expectPresentThenAbsent(withLiterals, blankLiterals(withLiterals), 'xx', 'blankLiterals');
    expectPresentThenAbsent(withLiterals, blankLiterals(withLiterals), 'yy', 'blankLiterals (comment)');
    expectPresentThenAbsent(withLiterals, blankLiterals(withLiterals), 'zz', 'blankLiterals (template)');
    // …and the offender line NUMBER is real, not always 1.
    const [offender] = moduleTopEnvMutationOffenders(
      "// header\n// header\nconst a = 1;\nDeno.env.set('K', 'v');\n",
      'probe.test.ts',
    );
    expect(offender).toContain('probe.test.ts:4:');

    // THE LIVE ESTATE IS CLEAN, and that zero is evidence because the walk below is the
    // same one the gate runs and it is asserted to have found real suites.
    const suites = readdirSync(FUNCTIONS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => readdirSync(join(FUNCTIONS_DIR, entry.name))
        .filter((name) => name.endsWith('.test.ts'))
        .map((name) => join(FUNCTIONS_DIR, entry.name, name)));
    expect(suites.length).toBeGreaterThanOrEqual(30);
    const liveOffenders = suites.flatMap((file) => moduleTopEnvMutationOffenders(
      readFileSync(file, 'utf8'),
      file.slice(FUNCTIONS_DIR.length + 1),
    ));
    expect(liveOffenders).toEqual([]);
  });
});
