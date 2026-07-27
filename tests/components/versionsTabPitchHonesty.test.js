/**
 * versionsTabPitchHonesty.test.js — Wave R-1 Lane D: paid-surface pitch
 * honesty pins (SETTLEMENT_CAPABILITY_ATLAS queue #18).
 *
 * The Cartographer-locked Versions tab pitch used to sell "manual snapshot
 * on demand" and "Side-by-side diff for any two points" — neither exists:
 * `recordSnapshot` has no UI caller anywhere (its only callers are the
 * commitPendingEdits checkpoint at settlementPendingEdits.js and the
 * pre-revert auto-snapshot in settlementSlice.js), and no diff component
 * exists. "Auto-snapshot on canonize" was also false — canonize() stamps
 * `canonizedAt` and records NO snapshot.
 *
 * These pins hold the interim copy-only repair: the pitch sells only what
 * ships. The build-vs-copy decision (actually building manual snapshot +
 * diff) is an OPEN owner-queue item (Wave R-5, queue #18); when the owner
 * rules BUILD and the features land, update the positive pin in the same
 * change that re-promises them — the NEGATIVE pins are the invariant until
 * then (nonexistent features stay unsold).
 *
 * Copy is one-string vetoable. Idiom: comment-stripped source scans
 * (tests/components/frozenTenseDefenseCopy.test.js).
 */
import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}
const read = (file) => stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8'));

const VERSIONS_TAB = 'src/components/settlement/VersionsTab.jsx';

describe('VersionsTab locked pitch — sells only what ships (atlas queue #18)', () => {
  test('the pitch describes the real snapshot cadence (commit checkpoint + pre-revert)', () => {
    const src = read(VERSIONS_TAB);
    expect(src).toMatch(/Auto-snapshot before every committed change and every revert/);
    // The true, still-promised half stays promised: non-destructive revert.
    expect(src).toMatch(/Revert creates a new snapshot from the old state/);
  });

  test('the nonexistent-feature claims stay dead until the owner rules BUILD (queue #18)', () => {
    const src = read(VERSIONS_TAB);
    expect(src).not.toMatch(/manual snapshot on demand/i);
    expect(src).not.toMatch(/side-by-side diff/i);
    expect(src).not.toMatch(/Auto-snapshot on canonize/i);
  });
});
