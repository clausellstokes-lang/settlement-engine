/**
 * tests/build/vendorManifestExactSet.test.js — supply-chain exact-set contract.
 *
 * The original validate-map-fork.mjs only iterated manifest.libs, so any .js
 * file present under public/map/libs/ but ABSENT from VENDOR-MANIFEST.json
 * shipped to the payment+auth origin completely un-verified (97 of 98 tinymce
 * scripts were in exactly this blind spot). These tests pin the fix: the gate
 * is now an EXACT-SET contract — a new un-pinned .js under libs/ FAILS, and a
 * manifest entry whose file is gone from disk FAILS.
 *
 * Each test runs the REAL script and asserts the failure path, then restores
 * the tree it touched in a finally so the gate stays green for the next run.
 *
 * CRASH-SAFETY (2026-07-19): the mutations that stage each failure condition
 * live INSIDE the try, use atomic fs.renameSync (no `mv` subprocess), and every
 * test SELF-HEALS a tree stranded by a prior hard-killed run (SIGKILL skips the
 * finally, so try/finally alone cannot recover it — the next run must). Two lanes
 * were bitten by a stranded flatqueue.js + .bak before this.
 */
import { describe, it, expect } from 'vitest';
import { writeFileSync, rmSync, renameSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/validate-map-fork.mjs');
const LIBS = join(ROOT, 'public/map/libs');

// Run the gate; return { code, output } instead of throwing so we can assert on
// the non-zero exit + message that an un-pinned/missing file is supposed to emit.
function runGate() {
  try {
    const stdout = execFileSync('node', [SCRIPT], { cwd: ROOT, encoding: 'utf8' });
    return { code: 0, output: stdout };
  } catch (err) {
    return { code: err.status ?? 1, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

describe('validate-map-fork.mjs is an exact-set supply-chain contract', () => {
  it('FAILS when a new .js ships under libs/ but is not pinned in the manifest', () => {
    // A fresh, parseable .js file no manifest entry could possibly cover.
    const intruder = join(LIBS, 'tinymce/plugins/__exact_set_probe__.js');
    // Self-heal: a prior hard-killed run may have stranded the probe file.
    rmSync(intruder, { force: true });
    try {
      writeFileSync(intruder, 'window.__probe__ = function () { return 1; };\n');
      const { code, output } = runGate();
      expect(code, 'an un-pinned shipped .js must fail the gate').not.toBe(0);
      expect(output).toMatch(/__exact_set_probe__\.js/);
      expect(output).toMatch(/NOT pinned|un-verified/i);
    } finally {
      rmSync(intruder, { force: true });
    }
  });

  it('FAILS when a manifest-pinned file is missing on disk', () => {
    // Temporarily move a real pinned lib aside so the manifest entry has no file.
    const pinned = join(LIBS, 'flatqueue.js');
    const moved = join(LIBS, 'flatqueue.js.bak');
    // Self-heal a tree stranded by a prior hard-killed run (SIGKILL skips the
    // finally below): if the backup survived and the real file is gone, restore
    // it before proceeding so the gate — and this test — start from a clean tree.
    if (existsSync(moved) && !existsSync(pinned)) renameSync(moved, pinned);
    try {
      renameSync(pinned, moved); // atomic same-dir rename, inside the try
      const { code, output } = runGate();
      expect(code, 'a pinned-but-missing file must fail the gate').not.toBe(0);
      expect(output).toMatch(/flatqueue\.js/);
      expect(output).toMatch(/missing/i);
    } finally {
      // Tolerant restore: only move back if we actually staged the missing state.
      if (existsSync(moved) && !existsSync(pinned)) renameSync(moved, pinned);
    }
  });
});
