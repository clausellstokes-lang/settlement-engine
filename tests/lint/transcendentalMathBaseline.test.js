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
 *
 * ⭐⭐ RETIRED AT ZERO — T13 Car 5, 2026-09-02. The trees carry NO transcendental site at
 * all: CEILING is 0, the baseline is `{ total: 0, files: {} }`, and the declared-overrun
 * ledger that used to widen this guard for `bandedStock.js` is DELETED, on the instruction
 * the ledger wrote for its own removal. From here this file is a REGROWTH guard rather than
 * a burn-down: the eslint transcendental ban (eslint.config.js, all eight determinism blocks,
 * roster imported from this counter) refuses the SPELLINGS at edit time, and the arms below
 * refuse the COUNT. Both are needed — the ban cannot see an eslint-ignored file, and the
 * counter cannot see a spelling it does not lex.
 *
 * ⚠⚠ NO SHELL-OUT AND NO DIRECTORY SCAN MAY EVER BE WRITTEN INTO THIS FILE. It is one of
 * the estate's two NAMED COUNTEREXAMPLES for the walker-census law's DELEGATED arm
 * (tests/lint/testRatchet.test.js, "NO SINGLE ARM CLASSIFIES THEM ALL"): that pin asserts the
 * NAME, TITLE and STRUCTURE arms all MISS this file and only A4 — the walk delegated to
 * scripts/count-transcendental-math.mjs — reaches it. A3's predicate matches both a directory
 * read and a shell-out, so writing either here flips the structure arm true and destroys the
 * counterexample. That was MEASURED, not feared, when the attribution leg's first cut did it.
 * The law outlived the ledger it was written for, so it is kept here, in the header.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { countText, countTrees, TREES } from '../../scripts/count-transcendental-math.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Committed transcendental-site ceiling — lower as sites are reformulated; NEVER
// raise. (2026-07-21 landing measurement: 49 sites / 32 files, the grandfathered
// stock — all covered by same-engine goldens + the worker byte-identity pin.)
// 49 → 48 on 2026-08-30: the legacy settlement-map age-overlay leaf was RETIRED whole
// with its draw stack (ODQ §725/§772), taking its one site with it. Banked here rather
// than left as headroom, so the freed slot cannot be silently re-occupied — a deletion
// earns the same monotone-down treatment a reformulation does.
//
// ⭐⭐ 48 → 0 on 2026-09-02 (T13 Car 5, family (i)). THE RETIREMENT, and it is banked at
// ZERO rather than at "one, declared". The last site was `bandedStock.js`'s `halfLifeFactor`
// — the estate's ONE spelling of `Math.pow(0.5, age / halfLife)`, which T13 Car 3 had already
// made canonical by routing twelve hand-spelled copies onto it. Car 5 routed that one
// expression onto the kernel's `halfLifeKeep`, so the census fell 1 → 0 and this ceiling
// follows it down in the SAME act, exactly as the declared-overrun row it replaces demanded
// ("clearing it means reformulating the half-life itself … and deletes this row and the
// ceiling with it"). MEASURED at the tip, not predicted: `node
// scripts/count-transcendental-math.mjs` → `0 sites across 0 files`.
//
// ⛔ A CEILING OF ZERO IS A DIFFERENT KIND OF PROMISE, so read it as one. Every arm below
// that compares the tree to the baseline is now comparing an empty set to an empty set, and
// an empty-set comparison is the classic vacuous green. That is why the tree arm was
// REDESIGNED rather than left alone: `current.total` is asserted to be EXACTLY 0 (a positive
// claim about a live walk, not the absence of a complaint), and the detector's own countText
// fixtures — synthetic text no cure can ever retire — carry the proof that the counter can
// still count. Those two together are what a zero baseline needs and a shrinking one did not.
const CEILING = 0;

const baseline = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.transcendental-math-baseline.json'), 'utf8'));
const current = countTrees();

// ── THE DECLARED-OVERRUN LEDGER IS GONE (T13 Car 5, 2026-09-02) ──────────────
// It held exactly one row — `bandedStock.js`, 1 site, introduced at 59df13a97d3e — plus a
// DECLARED_OVERRUN_CEILING of 1 and four governance arms of its own. It is deleted whole,
// on the instruction it wrote for itself: "the ledger emptied — if both sites are genuinely
// routed or reformulated, DELETE this ledger and this describe together and let the plain
// baseline do the work again." The row was CURED, never laundered: the site was reformulated
// onto the kernel, the census fell to zero, and the widening path was removed rather than
// re-frozen. `--update` was never run, and never needed to be — the baseline was already
// `{ total: 0, files: {} }` and stays byte-identical through this act.

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
      if (count > base) regressions.push(`${file}: ${count} transcendental sites (allowance ${base})`);
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
    // THE TOTALITY ARM. It used to compare against the baseline OVERLAID with the declared
    // overruns, because an exclusion would have blinded it to the declared files entirely.
    // With the ledger cured away there is nothing to overlay: every file in the scanned trees
    // is under a plain exact-equality check again, which is the state this ratchet was always
    // burning down toward. Both sides are `{}` today — see the ZERO-BASELINE note above the
    // ceiling for why that is not left as the only claim.
    expect(current.files).toEqual(baseline.files);
    expect(current.total).toBe(baseline.total);
  });

  test('the committed ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });

  test('THE TREE IS AT ZERO — a positive claim on a live walk, not an absent complaint', () => {
    // ⚠ THIS ARM WAS NAMED FOR A WALKER IT NEVER ASKED. Until T13 it read
    // `baseline.files[...]` — the FROZEN JSON on disk — so it proved a key existed in a
    // file, never that the scan reached the trees; a walker that returned {} would have
    // left it green. It also anchored on contestMath.js by NAME, and T13 TRANS cured that
    // file to zero, so the rotted anchor red on a site that had simply been FIXED. A
    // liveness anchor must never name a file the program exists to retire.
    //
    // At CEILING = 0 the arm inverts, exactly as the charter's §5 specifies. While sites
    // remained, non-vacuity meant "the walk must FIND one". With none left, that form would
    // red forever, and its negation — "the walk finds none" — is satisfied just as well by a
    // walk that reached nothing at all. So this arm asserts the ZERO as a measured quantity
    // and proves the walk was REAL the only way left: by checking that the tree it walked is
    // the tree that exists. The detector's own countText fixtures above carry the other half
    // — that the counter can still count — on synthetic text no cure can retire.
    expect(current.total).toBe(0);
    expect(Object.keys(current.files)).toEqual([]);
    // THE WALK REACHED SOMETHING: the six trees are real directories with real code in them.
    // Without this, `countTrees()` returning `{}` because every path was wrong would satisfy
    // the two assertions above perfectly.
    expect(TREES.length).toBe(6);
    for (const tree of TREES) {
      expect(existsSync(join(ROOT, tree)), `${tree} is not a directory — the walk cannot have reached it`).toBe(true);
    }
  });
});
