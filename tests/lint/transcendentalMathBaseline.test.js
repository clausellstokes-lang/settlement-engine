/**
 * transcendentalMathBaseline.test.js — the cross-engine transcendental-float ratchet
 * (C5 bar-11: the determinism suite's last unguarded class).
 *
 * The determinism machinery (fail-closed rngContext, the eslint Math.random / Date /
 * locale bans, the source-scan pins) is structural everywhere EXCEPT transcendental
 * floats: Math.sin/cos/exp/log/pow/… and the `**` operator are implementation-
 * approximated per the ECMAScript spec, so a new transcendental feeding a threshold
 * in seeded code can fork same-seed worlds ACROSS engines while lint, goldens, and
 * the worker byte-identity pin (all same-engine) stay green. Until now the caveat
 * lived as prose in ONE file (contestMath.js) — a rung-3 convention where a rung-1
 * mechanical check was available.
 *
 * This is that check (the domainAnyCastBaseline idiom): scripts/
 * count-transcendental-math.mjs counts transcendental sites OUTSIDE comments and
 * strings across the localeCompareGuard TREES; tests/lint/
 * .transcendental-math-baseline.json freezes them per file.
 *   - a file ABOVE its baseline (or a new file with any site) FAILS — prefer the
 *     correctly-rounded forms (+, -, *, /, Math.sqrt) or an integer/rational
 *     reformulation; a genuinely-needed transcendental must be same-engine-golden
 *     covered and carry contestMath.js's cross-engine caveat, and the baseline edit
 *     makes that a visible, reviewed act;
 *   - a file BELOW its baseline FAILS with the ratchet-down instruction
 *     (`node scripts/count-transcendental-math.mjs --update`) so slack never
 *     accumulates;
 *   - the committed total can never rise past the pinned CEILING, even via
 *     `--update`.
 *
 * Math.sqrt is exempt BY SPEC (required correctly rounded — cross-engine exact).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { countText, countTrees, TREES } from '../../scripts/count-transcendental-math.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Committed transcendental-site ceiling — lower as sites are reformulated; NEVER
// raise. (2026-07-21 landing measurement: 49 sites / 32 files, the grandfathered
// stock — all covered by same-engine goldens + the worker byte-identity pin.)
const CEILING = 49;

const baseline = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.transcendental-math-baseline.json'), 'utf8'));
const current = countTrees();

describe('transcendental-math ratchet — the detector is honest', () => {
  test('counts real transcendental calls and ** operators', () => {
    expect(countText('const a = Math.pow(base, ratio);')).toBe(1);
    expect(countText('const a = base ** ratio;')).toBe(1);
    expect(countText('x **= 2;')).toBe(1);
    expect(countText('Math.exp(-x) + Math.log(y) + Math.tanh(z)')).toBe(3);
    expect(countText('Math . pow(a, b)')).toBe(1); // whitespace-tolerant
  });

  test('never counts exact math, comments, strings, or non-operators', () => {
    expect(countText('Math.sqrt(x)')).toBe(0); // correctly rounded by spec
    expect(countText('Math.abs(x) + Math.floor(y) + Math.max(a, b)')).toBe(0);
    expect(countText('// Math.pow(a, b) would drift cross-engine')).toBe(0);
    expect(countText('/** uses Math.exp under the hood */')).toBe(0);
    expect(countText("const s = 'Math.pow(2, 3)';")).toBe(0);
    expect(countText('const s = "a ** b";')).toBe(0);
    expect(countText('const t = `exp: ${"**"}`;')).toBe(0);
    expect(countText('a * b * c')).toBe(0); // plain multiplication chains
    expect(countText('const re = /\\*\\*/;')).toBe(0); // escaped regex stars
    expect(countText('/* block */ a * b')).toBe(0);
  });

  test('a string containing // does not hide following code (the URL trap)', () => {
    expect(countText("const u = 'https://x.test'; const p = Math.pow(a, b);")).toBe(1);
  });
});

describe('transcendental-math ratchet — frozen baseline governance', () => {
  test('baseline total equals the sum of its per-file counts (no stale drift)', () => {
    const sum = Object.values(baseline.files).reduce((a, n) => a + n, 0);
    expect(baseline.total).toBe(sum);
  });

  test('every baselined file is inside the scanned trees and carries real sites', () => {
    for (const [file, count] of Object.entries(baseline.files)) {
      expect(TREES.some((t) => file.startsWith(`${t}/`)), `${file} is outside the scanned trees`).toBe(true);
      expect(Number.isInteger(count) && count > 0, `${file} has a malformed count`).toBe(true);
    }
  });

  test('no file exceeds its baseline (new files get 0) — reformulate, do not widen', () => {
    const regressions = [];
    for (const [file, count] of Object.entries(current.files)) {
      const base = baseline.files[file] ?? 0;
      if (count > base) regressions.push(`${file}: ${count} transcendental sites (baseline ${base})`);
    }
    expect(
      regressions,
      `transcendental-float sites grew — cross-engine same-seed replay is at risk. Prefer correctly-rounded forms (+,-,*,/,Math.sqrt) or an integer/rational reformulation; a genuinely-needed transcendental must be same-engine-golden covered, carry the contestMath.js cross-engine caveat, and land as a visible baseline edit:\n  ${regressions.join('\n  ')}`,
    ).toEqual([]);
  });

  test('no file is below its baseline — ratchet down instead of leaving slack', () => {
    const stale = [];
    for (const [file, base] of Object.entries(baseline.files)) {
      const cur = current.files[file] ?? 0;
      if (cur < base) stale.push(`${file}: now ${cur} (baseline ${base})`);
    }
    expect(stale, `sites shrank below the baseline — lock it in with \`node scripts/count-transcendental-math.mjs --update\`:\n  ${stale.join('\n  ')}`).toEqual([]);
  });

  test('baseline exactly matches the tree (airtight against any drift mode)', () => {
    expect(current.files).toEqual(baseline.files);
    expect(current.total).toBe(baseline.total);
  });

  test('the committed ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });

  test('non-vacuity: the known caveat-carrier (contestMath.js) is seen by the walker', () => {
    // contestMath.js documents the cross-engine caveat and holds real sites — if
    // the walker ever stops seeing it, the scan silently broke.
    expect(baseline.files['src/domain/region/contestMath.js']).toBeGreaterThanOrEqual(1);
    expect(Object.keys(baseline.files).length).toBeGreaterThanOrEqual(10);
  });
});
