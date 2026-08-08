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

// ── ⛔ THE DECLARED-OVERRUN LEDGER (2026-08-07 walker-census lane) ───────────
//
// TWO ROWS OF THIS FILE SAT IN scripts/.test-ratchet-baseline.json:
//
//   … :: frozen baseline governance baseline exactly matches the tree (airtight …)
//   … :: frozen baseline governance no file exceeds its baseline (new files get 0) …
//
// Each is ONE assertion over an OPEN, tree-derived population, so freezing it froze THE
// WHOLE POPULATION: a THIRD file growing a transcendental — or these two growing from
// one site to twenty — produced the byte-identical failing verdict and reddened nothing.
// A failing TEST is debt; a failing WALKER is a DISABLED GUARD (CONTRIBUTING.md, "The
// gate"), and this ratchet is a walker: it enumerates six source trees through
// scripts/count-transcendental-math.mjs and compares against a frozen inventory.
//
// AND THE INVENTORY HAD ALREADY GROWN UNSEEN — the recorded
// A-RED-RATCHET'S-CONTENTS-GROW-INVISIBLY hazard, measured rather than feared. The
// baseline was frozen at 7e77c680 (2026-07-21) at 49 sites across 32 files. The tree
// now measures 51 across 34, and BOTH new files landed AFTER the freeze while this
// ratchet's verdict was banked as debt:
//
//   src/domain/worldPulse/dispositionLedger.js   1 site / baseline 0   (+1)
//   src/domain/worldPulse/bandedStock.js         1 site / baseline 0   (+1)
//
// ⚠ THE TWO ARE ONE SHAPE AND THE SECOND IS THE CURE FOR THE FIRST, WHICH IS WHY NEITHER
// IS BURNED DOWN HERE. Both sites are the SAME expression — `Math.pow(0.5, age / halfLife)`,
// the exponential half-life decay. bandedStock.js exists precisely to be the one home for
// it (its own header records FIFTEEN hand-spelled call sites found on 2026-08-04), and
// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.
// Re-freezing here would bank a fork of a shared primitive; the honest cure is the routing
// wave, and the sound long-run answer for the primitive itself is a rational/integer
// reformulation, since `Math.pow` is implementation-approximated per the ECMAScript spec
// and a same-seed world can therefore fork ACROSS engines. DECLARED DEBT, owed to that wave.
//
// MEASURED, NEVER TRANSCRIBED — `countTrees()` run inside an integrity-counted `git archive`
// of committed abc5a78b (6,196 tracked paths in, 6,196 files out, `git status` clean), never
// over the live shared tree (THE ARCHIVE-CENSUS LAW).
//
// ⛔ DO NOT run `--update` to make this list go away — it re-freezes the WHOLE TREE and would
// bank both sites as permanent baseline, which is exactly the laundering this ledger exists
// to refuse. Each row is cleared by ROUTING or REFORMULATING the site, then deleting the row.
const DECLARED_OVERRUNS = Object.freeze({
  'src/domain/worldPulse/bandedStock.js': {
    sites: 1,
    introducedAt: '59df13a97d3e01de7ade2048ab4534be1c5f7cd0',
    cause: 'SP-A minted the shared band/decay shapes leaf, and `decayToward` at :125 carries the '
      + 'ONE canonical `Math.pow(0.5, age / weeks)`. This is the site the other fifteen are meant '
      + 'to collapse into, so it is the LAST one to remove, not the first — clearing it means '
      + 'reformulating the half-life itself (an integer/rational form), which is its own wave.',
  },
  'src/domain/worldPulse/dispositionLedger.js': {
    sites: 1,
    introducedAt: '7796954e7150c2d072e2ee217b9b41466a102a50',
    cause: 'WR-2 DISPOSITION added `decayChannel` at :468 with a hand-rolled '
      + '`Math.pow(0.5, age / CHANNEL_HALF_LIFE_TICKS)` — the sixteenth copy of the expression '
      + "bandedStock.js was later minted to own (this file's own header names that leaf). Cleared "
      + 'by routing the call through bandedStock, which is a behaviour-touching edit and belongs '
      + 'to the routing wave, not to a ratchet-repair lane.',
  },
});

// A LITERAL total EXCESS over the frozen baseline, not a figure derived from the object it
// is supposed to cap — a ceiling read out of its own list proves list == list and rises
// silently with every row. MONOTONE DOWN. You may burn it; you may never pad it.
const DECLARED_OVERRUN_CEILING = 2;

/** Baseline allowance, widened ONLY by an attributed declared overrun. */
const allowanceFor = (file) => DECLARED_OVERRUNS[file]?.sites ?? baseline.files[file] ?? 0;

/** What the trees must look like: the frozen baseline OVERLAID with the declared overruns. */
const expectedFiles = () => {
  const out = { ...baseline.files };
  for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) out[file] = d.sites;
  return out;
};

/** The excess a declared row carries over its baseline allowance (0 if it has none). */
const excessOf = (file, d) => Math.max(0, d.sites - (baseline.files[file] ?? 0));

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
      const base = allowanceFor(file);
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
    // THE TOTALITY ARM, and the reason the declared overruns are OVERLAID rather than
    // skipped: an exclusion would blind this comparison to the two files entirely, so a
    // declared file could then drift to any count at all. Overlaying keeps EVERY file in
    // the scanned trees under an exact-equality check — the declared two simply have a
    // different, attributed, capped expected value.
    expect(current.files).toEqual(expectedFiles());
    const declaredExcess = Object.entries(DECLARED_OVERRUNS).reduce((a, [f, d]) => a + excessOf(f, d), 0);
    expect(current.total).toBe(baseline.total + declaredExcess);
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

// ── ⛔ THE DECLARED-OVERRUN LEDGER'S OWN GOVERNANCE ──────────────────────────
// The ledger widens two live guards, so it carries the same discipline the test census it
// replaced carries: every row ATTRIBUTED, the set EXACT in both directions, and both sizes
// capped by literals that only ever go down. Without these arms the ledger is a softer
// baseline with no `--update` guard on it at all.
describe('transcendental-math ratchet — the declared-overrun ledger is honest', () => {
  const declaredFiles = Object.keys(DECLARED_OVERRUNS);

  test('⛔ EVERY DECLARED OVERRUN IS ATTRIBUTED — an unattributed row is a defect laundered into debt', () => {
    for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) {
      expect(TREES.some((t) => file.startsWith(`${t}/`)), `${file} is outside the scanned trees`).toBe(true);
      expect(Number.isInteger(d.sites) && d.sites > 0, `${file}: malformed site count`).toBe(true);
      expect(
        String(d.introducedAt),
        `${file}: introducedAt must be a 40-hex sha — an overrun nobody can bisect cannot be argued about`,
      ).toMatch(/^[0-9a-f]{40}$/);
      expect(String(d.cause).length, `${file}: declared with a stub, not an argument`).toBeGreaterThan(60);
    }
  });

  test('⛔ the ledger is EXACT — a stale or padded row reds, and so does an un-banked shrink', () => {
    const problems = [];
    for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) {
      const cur = current.files[file];
      const base = baseline.files[file] ?? 0;
      if (cur === undefined) {
        problems.push(`${file}: carries NO transcendental site any more — delete its declared row (bank the win)`);
        continue;
      }
      if (cur !== d.sites) {
        problems.push(
          `${file}: declared ${d.sites} site(s), MEASURED ${cur} — if it shrank, lower the declared`
          + ' figure (bank the win); if it grew, that is a REGRESSION, reformulate instead of raising the row',
        );
        continue;
      }
      if (cur <= base) problems.push(`${file}: no longer exceeds its baseline (${base}) — delete its declared row, the baseline covers it`);
    }
    expect(problems, `the declared-overrun ledger disagrees with the trees:\n  ${problems.join('\n  ')}`).toEqual([]);
    // anchored: the loop above walked every declared row against a LIVE countTrees(), so the
    // non-emptiness floor below is a floor on a real population, not on an empty object.
    expect(
      declaredFiles.length,
      'the ledger emptied — if both sites are genuinely routed or reformulated, DELETE this ledger'
      + ' and this describe together and let the plain baseline do the work again.',
    ).toBeGreaterThan(0);
  });

  test('⛔ no UNDECLARED file exceeds its baseline (the ledger is the only widening path)', () => {
    // The mirror of the exactness arm: the regression arm above reads `allowanceFor`, so a
    // file over baseline is silent there IF it is declared. This arm proves the converse —
    // nothing is over baseline WITHOUT a declared row — so the two together partition the
    // scanned trees with no unnamed slack in them.
    const undeclared = [];
    for (const [file, count] of Object.entries(current.files)) {
      if (file in DECLARED_OVERRUNS) continue;
      const base = baseline.files[file] ?? 0;
      if (count > base) undeclared.push(`${file}: ${count} site(s) against baseline ${base}`);
    }
    expect(undeclared, `undeclared overruns:\n  ${undeclared.join('\n  ')}`).toEqual([]);
  });

  test('the ledger ceilings never rise (both are monotone-down literals)', () => {
    // THE ANTI-LAUNDERING CAP. The exactness arms above are satisfied by ANY set that
    // matches the trees — including a set that GREW — so without a frozen ceiling the
    // cheapest way to absorb the next regression would be "add a row and write a nice
    // cause". These two literals close that: new debt cannot be declared, only cured.
    const declaredExcess = Object.entries(DECLARED_OVERRUNS).reduce((a, [f, d]) => a + excessOf(f, d), 0);
    expect(declaredExcess, 'the declared transcendental excess GREW — reformulate or route, do not widen the ledger')
      .toBeLessThanOrEqual(DECLARED_OVERRUN_CEILING);
    expect(declaredFiles.length, 'a THIRD file was declared — the ledger is monotone-down in rows too')
      .toBeLessThanOrEqual(2);
  });
});
