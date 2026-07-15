/**
 * tests/build/vendorManifestNonEmpty.test.js — supply-chain fail-CLOSED contract.
 *
 * The bug: validate-map-fork.mjs gated the ENTIRE supply-chain block behind
 * `if (manifest?.libs)`. A manifest with a MISSING `libs` key — or an empty
 * `libs: []` after a bad re-pin/merge — skipped every integrity check and the
 * gate exited GREEN, while ~5.7 MB of vendored blobs ship un-verified to the
 * payment+auth origin. That is fail-OPEN: a vacuous manifest passed.
 *
 * We run the REAL script against an ISOLATED temp tree (a copy of the script
 * plus a forged public/map/libs/VENDOR-MANIFEST.json) so the assertion never
 * touches — or races — the live manifest the other gate tests scan. The script
 * resolves public/map/ relative to its own location, so mirroring that layout in
 * a tmp dir reproduces a real invocation exactly.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REAL_SCRIPT = join(ROOT, 'scripts/validate-map-fork.mjs');

// Build a self-contained tree: <tmp>/scripts/validate-map-fork.mjs +
// <tmp>/public/map/libs/VENDOR-MANIFEST.json, with libs/ otherwise empty so the
// only thing the gate can complain about is the manifest itself. The temp dir
// lives UNDER the project root so the copied script still resolves its `acorn`
// import up the node_modules chain — and so it never races the live manifest the
// other gate tests scan.
function runGateWithManifest(manifestObj) {
  const dir = mkdtempSync(join(ROOT, '.tmp-map-fork-'));
  mkdirSync(join(dir, 'scripts'), { recursive: true });
  mkdirSync(join(dir, 'public/map/libs'), { recursive: true });
  copyFileSync(REAL_SCRIPT, join(dir, 'scripts/validate-map-fork.mjs'));
  writeFileSync(
    join(dir, 'public/map/libs/VENDOR-MANIFEST.json'),
    JSON.stringify(manifestObj, null, 2) + '\n',
  );
  try {
    const stdout = execFileSync('node', [join(dir, 'scripts/validate-map-fork.mjs')], {
      encoding: 'utf8',
    });
    return { code: 0, output: stdout, dir };
  } catch (err) {
    return { code: err.status ?? 1, output: `${err.stdout ?? ''}${err.stderr ?? ''}`, dir };
  }
}

describe('validate-map-fork.mjs fails closed on a vacuous manifest', () => {
  let lastDir;
  afterEach(() => lastDir && rmSync(lastDir, { recursive: true, force: true }));

  it('FAILS when `libs` is an empty array (bad re-pin / merge wiped the set)', () => {
    const { code, output, dir } = runGateWithManifest({ libs: [] });
    lastDir = dir;
    expect(code, 'an empty libs array must fail the gate, not skip it').not.toBe(0);
    expect(output).toMatch(/no `libs` to verify|vacuous/i);
  });

  it('FAILS when the `libs` key is missing entirely', () => {
    const { code, output, dir } = runGateWithManifest({ '//': 'no libs here' });
    lastDir = dir;
    expect(code, 'a missing libs key must fail the gate, not skip it').not.toBe(0);
    expect(output).toMatch(/no `libs` to verify|vacuous/i);
  });
});
