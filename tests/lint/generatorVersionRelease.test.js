/**
 * generatorVersionRelease.test.js — GUARD (CLOSE-7; the chair's ruling R24j, point 6): THE VERSION IS TIED TO
 * THE BIRTHS, SO A LATER RELEASE CANNOT FORGET TO MOVE IT.
 *
 * WHY. A stored place is re-derived only by the engine that bore it (`editSlice.js ::
 * applyRosterDecreesAtTick`), and the engine a record names is its `generatorVersion`. An engine whose
 * births moved while the constant stood still would re-derive another engine's places as its own: the
 * defect this unit exists to close (MASTER-REDERIVE: every master-born place moved; LIVE-PATH: 132 people
 * left in powers the place no longer holds). The golden manifest is the estate's own record of what the
 * engine bears, so its bytes are the witness.
 *
 * THE RULE. The released rows below are committed, one per release: the version the release carried and
 * the sha256 of `tests/fixtures/generator-golden-master.json` at that release. Where the manifest's digest
 * differs from the LAST released one, the births have moved since that release, so `GENERATOR_VERSION`
 * must differ from the last released version. A release's own signing step appends its row.
 *
 * THE FIRST ROW is master's at db832c892 (the release the live site runs): '0.9.0', and the manifest's
 * digest there (`git show db832c892:tests/fixtures/generator-golden-master.json | sha256sum`).
 *
 * @enforced-by this test
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { GENERATOR_VERSION } from '../../src/domain/settlement.schema.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(REPO_ROOT, 'tests/fixtures/generator-golden-master.json');

/** One row per release, oldest first. A release's signing step appends the next. */
const RELEASED = Object.freeze([
  Object.freeze({
    version: '0.9.0',
    manifestDigest: 'e7e8a6ff2cec9ab63bf363335c2ea3563c9f984dfaddd32a643dcc1bda60b457',
    at: 'master db832c892 (2026-11-24)',
  }),
]);

/**
 * THE PREDICATE, pure, so the mutants below drive the code the live arm drives.
 * @param {readonly {version: string, manifestDigest: string}[]} released
 * @param {string} digest the manifest's digest now @param {string} version the constant now
 * @returns {string|null} the violation, or null
 */
function releaseViolation(released, digest, version) {
  if (released.length === 0) return 'no released row: the register is empty';
  const last = released[released.length - 1];
  if (digest !== last.manifestDigest && version === last.version) {
    return `the golden manifest moved since the ${last.version} release (${last.manifestDigest.slice(0, 12)} -> `
      + `${digest.slice(0, 12)}) and GENERATOR_VERSION is still ${version}: a moved engine must carry a new version`;
  }
  return null;
}

describe('GUARD (R24j 6) — the version is tied to the births', () => {
  it('the live tree: a manifest that moved since the last release carries a new GENERATOR_VERSION', () => {
    const digest = createHash('sha256').update(readFileSync(MANIFEST)).digest('hex');
    expect(digest, 'the manifest was read').toMatch(/^[0-9a-f]{64}$/);
    expect(releaseViolation(RELEASED, digest, GENERATOR_VERSION)).toBeNull();
  });

  it('MUTANTS: a moved manifest under the released version reds; an unmoved one, or a new version, passes', () => {
    const last = RELEASED[RELEASED.length - 1];
    expect(releaseViolation(RELEASED, 'f'.repeat(64), last.version)).toMatch(/must carry a new version/);
    expect(releaseViolation(RELEASED, last.manifestDigest, last.version)).toBeNull();
    expect(releaseViolation(RELEASED, 'f'.repeat(64), `${last.version}-next`)).toBeNull();
    expect(releaseViolation([], last.manifestDigest, last.version)).toMatch(/register is empty/);
  });

  it('the released rows are well formed, oldest first, each version once', () => {
    expect(RELEASED.length).toBeGreaterThan(0);
    expect(RELEASED.every((row) => /^\d+\.\d+\.\d+$/.test(row.version) && /^[0-9a-f]{64}$/.test(row.manifestDigest))).toBe(true);
    expect(new Set(RELEASED.map((row) => row.version)).size).toBe(RELEASED.length);
  });
});
