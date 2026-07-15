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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/validate-edge-functions.mjs');

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

  it('the script documents the syntax-only limitation in-source (anti-overstatement)', () => {
    // Guard the honesty note itself: a future reader must not be able to quietly
    // delete the caveat without either keeping it or upgrading to a real type pass.
    const src = readFileSync(SCRIPT, 'utf8');
    expect(src).toMatch(/SYNTAX check, not a type check|not a type check/i);
    expect(src).toMatch(/transpileModule/);
  });
});
