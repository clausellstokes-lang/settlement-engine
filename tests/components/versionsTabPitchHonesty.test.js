/**
 * versionsTabPitchHonesty.test.js — Wave R-1 Lane D: paid-surface pitch
 * honesty pins (SETTLEMENT_CAPABILITY_ATLAS queue #18).
 *
 * THE ORIGINAL DEFECT. The Cartographer-locked Versions tab pitch sold "manual
 * snapshot on demand" and "Side-by-side diff for any two points" — neither
 * existed: `recordSnapshot` had no UI caller anywhere (its only callers were
 * the commitPendingEdits checkpoint at settlementPendingEdits.js and the
 * pre-revert auto-snapshot in settlementSlice.js), and no diff component
 * existed. "Auto-snapshot on canonize" was false too: canonize() stamps
 * `canonizedAt` and records NO snapshot.
 *
 * R-1 un-promised all three rather than fake them, and left the build-vs-copy
 * call to the owner. THE OWNER RULED BUILD (Wave R-5, queue #18) and the two
 * features shipped: VersionsTab now mounts a Take-a-snapshot control (the first
 * user-facing `recordSnapshot` caller) and a lazy side-by-side comparison leaf
 * (VersionDiffView.jsx). The pitch re-promises exactly those two.
 *
 * THE PIN IS BIDIRECTIONAL, and that is the whole point. A claim in the pitch
 * must have a lever in the tab, and a lever in the tab must be reachable from
 * the copy that sells it:
 *
 *   - POSITIVE + WIRED: for each re-promised feature, the pitch must claim it
 *     AND the component must contain the mechanism that makes it true. Deleting
 *     the button while keeping the copy reds; deleting the copy while keeping
 *     the button reds. This is what the interim copy-only repair could not do.
 *   - STILL NEGATIVE: canonize snapshots remain unbuilt, so that claim stays
 *     dead. If someone builds it, they flip this pin in the same change.
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
const DIFF_VIEW = 'src/components/settlement/VersionDiffView.jsx';
const SETTLEMENT_SLICE = 'src/store/settlementSlice.js';

describe('VersionsTab locked pitch — sells only what ships (atlas queue #18)', () => {
  test('the pitch describes the real snapshot cadence (commit checkpoint + pre-revert)', () => {
    const src = read(VERSIONS_TAB);
    expect(src).toMatch(/Auto-snapshot before every committed change and every revert/);
    // The true, still-promised half stays promised: non-destructive revert.
    expect(src).toMatch(/Revert creates a new snapshot from the old state/);
  });

  test('the manual-snapshot promise is backed by a real recordSnapshot lever', () => {
    const src = read(VERSIONS_TAB);
    // The claim.
    expect(src).toMatch(/Take a snapshot whenever you want/);
    // The mechanism: the store action is selected, called with the manual kind,
    // and there is a control whose label pulls the lever.
    expect(src).toMatch(/useStore\(s => s\.recordSnapshot\)/);
    expect(src).toMatch(/recordSnapshot\(\{/);
    expect(src).toMatch(/kind: 'manual'/);
    expect(src).toMatch(/>\s*Take a snapshot\s*</);
  });

  test('the side-by-side promise is backed by a real comparison view', () => {
    const src = read(VERSIONS_TAB);
    // The claim.
    expect(src).toMatch(/put any two of them side by side/);
    // The mechanism: the lazy leaf exists, the tab lazy-imports it, and a
    // control exists to pick the two entries it compares.
    expect(fs.existsSync(path.join(ROOT, DIFF_VIEW))).toBe(true);
    expect(src).toMatch(/lazy\(\(\) => import\('\.\/VersionDiffView\.jsx'\)\)/);
    expect(src).toMatch(/<VersionDiffView\b/);
    expect(src).toMatch(/toggleCompare\(/);
    expect(src).toMatch(/'Compare'/);
  });

  test('the comparison view is read-only (a diff must never write)', () => {
    const src = read(DIFF_VIEW);
    // No store access at all: the view is handed two payloads and renders them.
    expect(src).not.toMatch(/useStore/);
    expect(src).not.toMatch(/recordSnapshot|revertToSnapshot|persistSaveUpdate/);
  });

  test('the nonexistent-feature claim stays dead: canonize records no snapshot', () => {
    const src = read(VERSIONS_TAB);
    expect(src).not.toMatch(/Auto-snapshot on canonize/i);
    // Non-vacuity: prove the feature really is still unbuilt, so this negative
    // is an invariant rather than a stale sentence. canonize() stamps
    // canonizedAt and calls no snapshot recorder.
    const slice = read(SETTLEMENT_SLICE);
    // Anchor on the line start so the substring does not resolve inside
    // `uncanonize: () => {` if the two actions are ever reordered.
    const canonizeAt = slice.indexOf('\n  canonize: () => {');
    const uncanonizeAt = slice.indexOf('\n  uncanonize: () => {');
    expect(canonizeAt).toBeGreaterThan(-1);
    expect(uncanonizeAt).toBeGreaterThan(canonizeAt);
    const canonizeBody = slice.slice(canonizeAt, uncanonizeAt);
    expect(canonizeBody.length).toBeGreaterThan(0);
    expect(canonizeBody).toMatch(/canonizedAt/);
    expect(canonizeBody).not.toMatch(/recordSnapshot/);
  });
});
