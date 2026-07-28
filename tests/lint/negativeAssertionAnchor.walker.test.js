/**
 * negativeAssertionAnchor.walker.test.js — habitat removal for the DRIFT-NEUTERED
 * NEGATIVE ASSERTION class (epistemic prevention, wave EP-1).
 *
 * THE CLASS: `expect(collection).not.toContain(member)` is TRUE for two very different
 * reasons — the subject was correctly excluded, or the collection drifted out from
 * under the test entirely (renamed, re-shaped, emptied, never built). The second is a
 * VACUOUS green: the assertion outlives the regression it was written to catch, and it
 * does so silently. The `re-rt-1` roster case was caught by hand once; every other
 * instance in the estate is unenforced. `not.toMatch` and `not.toHaveProperty` carry
 * the same defect — a prose assertion that no longer sees prose passes forever.
 *
 * THE WALK: scan the four generation-facing test trees for
 * `not.toContain|not.toMatch|not.toHaveProperty` and count every site that is NOT
 * anchored, where anchored means one of:
 *   1. the assertion goes through tests/helpers/anchoredNegatives.js
 *      (`expectPresentThenAbsent` / `expectAbsentWithAnchor` on the same line), or
 *   2. the site carries `// anchored: <why this cannot go vacuous>` on the assertion
 *      line or the line immediately above it.
 * Surviving un-anchored sites are frozen below, SHRINK-ONLY, and swept by wave EP-2.
 *
 * WHY A PER-FILE COUNT rather than a per-line pin: line numbers churn under every
 * unrelated edit and would make the ratchet a nuisance gate. A per-file exact count is
 * stable under formatting, still catches a NEW un-anchored negative in an already-dirty
 * file, and — because the assertion is exact equality, not `<=` — forces the sweep to
 * bank each win by lowering the row.
 *
 * KNOWN EDGES (line-scan heuristic, accepted; the spatialLedgerCoverage idiom):
 *   - A negative split across lines (`expect(x)\n  .not.toContain(y)`) is counted at
 *     the `.not.` line, and an `// anchored:` comment must sit on that line or the one
 *     above it — not above the `expect(`. Rare in the estate and self-evident when it
 *     reds.
 *   - `not.toContain` inside a template literal or a comment counts as a site. There
 *     are none today, and a false positive costs one allowlist row, never a miss.
 *   - Other negative matchers (`not.toBe`, `not.toEqual`, `not.toBeDefined`) are OUT of
 *     scope: they compare against a value the test names, so drift changes the value
 *     rather than emptying the subject. The three scanned matchers are the ones whose
 *     subject is a COLLECTION that can vanish.
 *   - The helper-call exemption is a same-line source match, so a helper invoked
 *     through an alias or a wrapper is not recognised. Call them by name.
 *
 * REGENERATION: `UPDATE_EPISTEMIC_ALLOWLIST=1 npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js`
 * PRINTS a fresh literal and FAILS with instructions. It never writes a file — the
 * allowlist is a reviewed artifact, and a self-updating ratchet ratchets nothing.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The generation-facing trees. tests/property carries zero sites today; it is scanned
 *  so the first one that lands there reds rather than arriving unnoticed. */
const SCAN_ROOTS = ['tests/generators', 'tests/joins', 'tests/simulation', 'tests/property'];

/** The three matchers whose subject is a collection that can silently vanish. */
const BARE_NEGATIVE_RE = /not\.(?:toContain|toMatch|toHaveProperty)\(/g;

/** Same-line use of an anchoring helper from tests/helpers/anchoredNegatives.js. */
const HELPER_RE = /expectPresentThenAbsent|expectAbsentWithAnchor/;

/** The reviewed inline escape hatch: `// anchored: <reason>`. */
const ANNOTATION_RE = /\/\/\s*anchored:/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Count un-anchored negative-assertion sites per file.
 * @returns {Record<string, { count: number, lines: number[] }>}
 */
function scanUnanchoredNegatives() {
  /** @type {Record<string, { count: number, lines: number[] }>} */
  const found = {};
  for (const root of SCAN_ROOTS) {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) continue;
    for (const filePath of walk(abs)) {
      const rel = relative(ROOT, filePath).replace(/\\/g, '/');
      if (!/\.test\.(js|jsx)$/.test(rel)) continue;
      const lines = readFileSync(filePath, 'utf8').split(`\n`);
      const hits = [];
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        BARE_NEGATIVE_RE.lastIndex = 0;
        const occurrences = [...line.matchAll(BARE_NEGATIVE_RE)].length;
        if (!occurrences) continue;
        if (HELPER_RE.test(line)) continue;
        if (ANNOTATION_RE.test(line)) continue;
        if (i > 0 && ANNOTATION_RE.test(lines[i - 1])) continue;
        for (let k = 0; k < occurrences; k += 1) hits.push(i + 1);
      }
      if (hits.length) found[rel] = { count: hits.length, lines: hits };
    }
  }
  return found;
}

/** Render the current scan as a paste-ready FROZEN_UNANCHORED_NEGATIVES literal. */
function renderLiteral(found) {
  const rows = Object.keys(found)
    .sort()
    .map((file) => `  '${file}': ${found[file].count},`)
    .join(`\n`);
  return `const FROZEN_UNANCHORED_NEGATIVES = Object.freeze({\n${rows}\n});`;
}

/**
 * FROZEN 2026-07-27 from this walker's own scan at composite-r4 d0fdcf7c (55 files /
 * 181 sites), RE-FROZEN the same day after the EP-2 sweep banked the win: 2 files,
 * 2 sites. Both survivors are DELIBERATE honest-bare findings awaiting owner rulings
 * (tuningBatchE2 — the VS16 pin over all-empty icons, owner pick EP-e). The
 * subsumption tanner-guard site was RETIRED 2026-07-28 by the EP-6 fix wave: the
 * dead conditional became a live anchored invariant when the furrier→tannery
 * producer-eating rule was deleted. SHRINK-ONLY.
 *
 * To bank a win: anchor the site (prefer expectPresentThenAbsent /
 * expectAbsentWithAnchor; use `// anchored: <reason>` only where the anchor is
 * genuinely structural), then LOWER this file's number — delete the row at 0. Never
 * raise a number; never add a file. A new file needing a row means a new un-anchored
 * negative was authored, which is the thing this gate exists to stop.
 */
const FROZEN_UNANCHORED_NEGATIVES = Object.freeze({
  'tests/generators/tuningBatchE2.test.js': 1,
});

describe('negative-assertion anchor walker (habitat removal)', () => {
  const found = scanUnanchoredNegatives();

  if (process.env.UPDATE_EPISTEMIC_ALLOWLIST) {
    test('REGENERATION MODE: prints the fresh literal and fails on purpose', () => {
      // Printed, never written. The allowlist is a reviewed artifact: an auto-writing
      // ratchet silently absorbs the regressions it exists to surface.
      console.log(`\n${renderLiteral(found)}\n`);
      expect(
        false,
        `UPDATE_EPISTEMIC_ALLOWLIST is set: the fresh FROZEN_UNANCHORED_NEGATIVES literal was`
        + ` printed above. Review every changed row, paste it into this file by hand, and re-run`
        + ` WITHOUT the env var. This mode always fails so it can never be mistaken for a pass.`,
      ).toBe(true);
    });
    return;
  }

  test('no NEW un-anchored negative assertion in the generation-facing test trees', () => {
    const violations = [];
    for (const [file, { count, lines }] of Object.entries(found)) {
      const ceiling = FROZEN_UNANCHORED_NEGATIVES[file] ?? 0;
      if (count > ceiling) {
        violations.push(
          `${file}: ${count} un-anchored negative assertion(s) at line(s) ${lines.join(`, `)}`
          + ` (frozen ceiling ${ceiling}). A bare not.toContain/not.toMatch/not.toHaveProperty`
          + ` passes just as happily when the COLLECTION drifted away as when the member was`
          + ` correctly excluded — it outlives the regression it was written to catch. Pair it`
          + ` with a liveness anchor: expectPresentThenAbsent(before, after, member) for a`
          + ` removal, expectAbsentWithAnchor(collection, member, anchor) for a selection`
          + ` (tests/helpers/anchoredNegatives.js). If the anchor is genuinely structural, say`
          + ` why on the line: // anchored: <reason>.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  test('inventory honesty: every frozen row still exists and still offends at its count', () => {
    const stale = [];
    for (const [file, ceiling] of Object.entries(FROZEN_UNANCHORED_NEGATIVES)) {
      const actual = found[file]?.count ?? 0;
      if (!existsSync(join(ROOT, file))) {
        stale.push(`${file}: deleted or moved — remove its FROZEN_UNANCHORED_NEGATIVES row`);
      } else if (actual < ceiling) {
        stale.push(
          `${file}: ${actual} un-anchored site(s) found, ceiling ${ceiling} — a site was`
          + ` anchored; LOWER the row to ${actual} (delete it at 0) to bank the win`,
        );
      }
    }
    expect(stale).toEqual([]);
  });

  test('the scan is not vacuous (it sees the frozen population)', () => {
    // If the directory walk or the extension filter silently broke, `found` would
    // collapse and the honesty test above would demand mass-lowering. Name the real
    // problem first.
    const totalFound = Object.values(found).reduce((n, { count }) => n + count, 0);
    const totalFrozen = Object.values(FROZEN_UNANCHORED_NEGATIVES).reduce((a, b) => a + b, 0);
    expect(
      totalFound,
      'the scan found fewer un-anchored negatives than the frozen inventory — either sites were'
      + ' anchored (lower their rows) or the scanner broke',
    ).toBeGreaterThanOrEqual(totalFrozen);
    expect(Object.keys(FROZEN_UNANCHORED_NEGATIVES).length, 'frozen file roster').toBe(1);
    expect(totalFrozen, 'frozen site total').toBe(1);
  });

  // ── GUARD-THE-GUARD: the detector, on fixtures ─────────────────────────────
  // A scanner regression reads as "no offenders", which is indistinguishable from
  // success. Prove the detection rules directly. `countIn` mirrors the per-line logic
  // of scanUnanchoredNegatives exactly, so a change to one that is not made to the
  // other reds here.
  const countIn = (source) => {
    const lines = source.split(`\n`);
    let n = 0;
    for (let i = 0; i < lines.length; i += 1) {
      BARE_NEGATIVE_RE.lastIndex = 0;
      const occurrences = [...lines[i].matchAll(BARE_NEGATIVE_RE)].length;
      if (!occurrences) continue;
      if (HELPER_RE.test(lines[i])) continue;
      if (ANNOTATION_RE.test(lines[i])) continue;
      if (i > 0 && ANNOTATION_RE.test(lines[i - 1])) continue;
      n += occurrences;
    }
    return n;
  };

  test('the detector fires on every bare negative spelling', () => {
    expect(countIn(`expect(roster).not.toContain('re-rt-1');`), 'bare not.toContain').toBe(1);
    expect(countIn(`expect(prose).not.toMatch(/\\bstone\\b/i);`), 'bare not.toMatch').toBe(1);
    expect(countIn(`expect(world).not.toHaveProperty('deityPool');`), 'bare not.toHaveProperty').toBe(1);
    expect(countIn(`expect(a).not.toContain('x');\nexpect(b).not.toContain('y');`), 'two sites, two lines').toBe(2);
    expect(
      countIn(`expect(x).not.toContain('a') && expect(y).not.toContain('b');`),
      'two sites sharing one line are both counted',
    ).toBe(2);
  });

  test('the detector stays silent on anchored forms', () => {
    expect(
      countIn(`expectPresentThenAbsent(before, after, 're-rt-1');`),
      'helper call carries no bare matcher at all',
    ).toBe(0);
    expect(
      countIn(`expectAbsentWithAnchor(roster, 're-rt-1', 're-rt-2', 'roster selection');`),
      'anchor helper',
    ).toBe(0);
    expect(
      countIn(`expect(roster).not.toContain('re-rt-1'); // anchored: length pinned above`),
      'same-line annotation',
    ).toBe(0);
    expect(
      countIn(`// anchored: the roster length is pinned two lines up\nexpect(roster).not.toContain('re-rt-1');`),
      'preceding-line annotation',
    ).toBe(0);
  });

  test('the detector ignores out-of-scope matchers and positive assertions', () => {
    // These compare against a value the test names, so drift changes the value rather
    // than emptying the subject — a different (and much louder) failure mode.
    expect(countIn(`expect(x).not.toBe(3);`), 'not.toBe is out of scope').toBe(0);
    expect(countIn(`expect(x).not.toEqual([]);`), 'not.toEqual is out of scope').toBe(0);
    expect(countIn(`expect(roster).toContain('re-rt-1');`), 'a positive assertion').toBe(0);
  });

  test('an annotation two lines above does NOT exempt (the escape hatch stays tight)', () => {
    // A reason must sit where a reader of the assertion will see it. Widening the
    // lookback would let an unrelated comment mute a whole block.
    expect(
      countIn(`// anchored: too far away to count\nconst roster = build();\nexpect(roster).not.toContain('x');`),
    ).toBe(1);
  });
});
