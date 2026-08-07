/**
 * domainAnyCastBaseline.test.js — the domain any-cast + ts-suppression ratchet.
 *
 * The strict ratchet (domainStrictBaseline.test.js) holds src/domain to a
 * shrink-only per-file strict-error census — but part of the original zero was
 * bought with suppression: hundreds
 * of `@type {any}`-style JSDoc casts and a handful of `@ts-ignore` /
 * `@ts-expect-error` directives. A "strict-0" gate is blind to that debt: a
 * fresh `@type {any}` keeps the gate green while silently regrowing the holes
 * the burn-down closed. This ratchet makes the suppression debt itself a
 * frozen, MONOTONE-DOWN number (scripts/count-domain-any.mjs is the counter;
 * tests/lint/.domain-any-baseline.json is the frozen per-file baseline):
 *   - a file ABOVE its baseline (or a new file with any debt) FAILS — fix the
 *     types, do not widen the baseline;
 *   - a file BELOW its baseline (or a stale entry) FAILS with the ratchet-down
 *     instruction (`node scripts/count-domain-any.mjs --update`) so the
 *     baseline can never go stale — the raw-button exact-set idiom;
 *   - the committed total can never rise past the pinned CEILING, even via
 *     `--update` (the domain-strict CEILING idiom).
 *
 * Debt is counted per OCCURRENCE (each `any`/`*` type-token, each directive),
 * not per annotation or per file — occurrence count is split-invariant:
 * relocating annotations to a new sibling file cannot trip it; only replacing
 * a hole with a real type lowers it. The detector is pinned honest below by
 * unit fixtures (multi-line typedefs, prose "any", comment-gutter stars).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { countDomain, countText } from '../../scripts/count-domain-any.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// Committed any+suppress ceiling — lower it as holes are typed; NEVER raise.
// (2026-07-09 start: 1196. First burn-down — crisisLifecycle payload/entry/
// condition typing, 41 → 6 — landed the ratchet at 1161.)
//
// (2026-07-10 — ONE-TIME subsystem-adoption raise, 1161 → 1720. The worldPulse
// war/trade/religion reconciliation merge brings a new lineage of leaf modules
// (religionState, pantheon, relationshipState, subsystemActivation), the region
// contest primitives (contestMath/contestOverThirdParty), clone/resolveTerrain,
// display/pantheonDepth, and the dormant deity exports — all "loose by design"
// per the reference tree's own sim-shape typedef notes. W2a-prep lands the leaf
// substrate at total 1247; the ceiling is set at 1720 to absorb W2a-main's
// remaining war/trade modules (warDeployment, occupation, tradeWar, etc.) WITHOUT
// a second ceiling churn. Monotone-DOWN thereafter: burn holes as the sim types
// are enumerated — never raise past 1720.)
//
// (projection corrected to measurement at main-port landing, 2026-07-10 —
// 1720 → 2291. Same adoption event, not a second raise: 1720 was W2a-prep's
// PRE-MERGE projection of the main port's debt; the landed merge (pulseKernel +
// the full war/trade/religion module set + the 33 three-way both-file merges)
// measures 2291. Monotone-down hereafter; burn-down pass scheduled wave 5
// (worst: warDeployment, occupation, tradeWar).)
//
// (wave 5b burn-down, 2026-07-10 — 2291 → 2252. The war/trade/occupation modules
// get named, index-signature-backed sim-shape typedefs (src/domain/worldPulse/
// pulseShapes.js): warDeployment 89→64, occupation 40→28, tradeWar 39→19. JSDoc-
// only, zero runtime change (golden byte-identical), strict-0 preserved. The
// shared pulseShapes module carries an 18-hole fixed cost that amortizes as more
// war/pulse files adopt the shapes — the mechanism is now in place for the next
// wave to keep burning down factionCompetition/npcAgency/institutionLifecycle/
// etc. Ceiling lowered to the measured total. Monotone-down; never raise.)
//
// (2026-08-03 — CHAIR RULING R-BLD-9, ONE-TIME re-baseline to MEASURED TRUTH,
// 2252 → 2287. The banked-debt-ledger repair, identical in kind to the size
// ratchet (R-BLD-6) and the domain-strict ratchet re-freeze in this same
// commit. The war waves landed a new lineage of envoy/coalition/peace-terms
// modules on top of a baseline frozen before them, so 19 files read as
// permanent regressions against a census that no longer described the tree.
// A ratchet everyone has to ignore to commit is not a ratchet. Re-freeze at the
// measurement, keep the law, owe the burn-down.
//
// What survives unchanged — and is what makes this safe rather than a widening:
//   - per-file shrink-only (a file may never exceed its own entry);
//   - NEW files enter at ZERO (`baseline.files[file] ?? { any: 0, suppress: 0 }`
//     in the regression pin below), so nothing written from here on gets a free
//     allowance out of the banked total;
//   - the exact-set governance below (no file below its baseline, no stale
//     entries, baseline === tree) is untouched, so the banked number can only
//     ever be ratcheted DOWN by `--update`.
// Measured on a CLEAN worktree at HEAD 23d118eb (committed bytes only) —
// three untracked Lane-P files were live in the shared tree at measurement
// time and are deliberately NOT banked; in-flight work does not get banked.
//
// Burn-down owed at THE STRICT BURN-DOWN WAVE, queued first-class alongside the
// 1,329 strict errors. Monotone-DOWN hereafter; never raise past 2287.)
const CEILING = 2287;

// ── THE DECLARED-OVERRUN LEDGER (2026-08-07 gate-repair lane) ───────────────
// THIS RATCHET IS RED, AND IT HAS BEEN RED LONG ENOUGH THAT ITS FAILING ROW IS
// NO LONGER INFORMATION. A ratchet red at both ends of a wave prints a
// BYTE-IDENTICAL failing row in every report and an EMPTY row-diff while the
// INVENTORY INSIDE IT GROWS — so "the same 2 files / 3 tests fail at both ends"
// is true and says nothing. Between eca65c8a and 3800bcb6 the overrun SET went
// from 2 files to 4 and no report showed it. Hence this ledger: every file
// currently over its baseline is named here WITH THE COMMIT THAT PUT IT OVER, so
// a grown inventory cannot hide behind an unchanged failing row again. Measured
// with `node scripts/count-domain-any.mjs` against tests/lint/.domain-any-baseline.json;
// the reader-friendly diff tool is `sh scripts/ratchet-inventory.sh`.
//
//   src/domain/worldPulse/commercialReasons.js   31 any / baseline 0   (+31)
//     CAUSE: d7ea69a4 "TR-1 THE CASUS COMMERCII" — the file was ADDED carrying 31
//     holes, and a file absent from the baseline has an allowance of ZERO, so it
//     has been over since its first commit. THE LARGEST SINGLE DEBT ON THIS LIST.
//
//   src/domain/worldPulse/warDeployment.js       17 any / baseline 16  (+1)
//     CAUSE: 172e5f22 "Lane WZ-2 piece 3: the license ledger". 16 at 6f1bada6,
//     17 from 172e5f22 onward.
//
//   src/domain/worldPulse/envoyPulse.js           2 any / baseline 0   (+2)
//     CAUSE: e0c8646e "Idiom sweep: the `= {}` destructure typed at its source".
//     `regionalGraph?:any, wizardNews?:any` in advanceEnvoyDiplomacyPulse's args.
//     ⚠ TYPING THESE `unknown` WAS TRIED AND RE-MEASURED. ⚠⚠ THE FIGURE FIRST
//     RECORDED HERE — "improves envoyPulse itself (domain-strict 19 -> 16,
//     full-config held at 2)" — IS CORRECTED. A verifier could not reproduce the
//     19 at any sha in that lane's window, and an unreproducible number in a
//     declared-debt ledger is worse than none, because the next lane plans
//     against it. RE-MEASURED 2026-08-07 at HEAD e37f9495 on a clean tree by
//     actually applying the change (`regionalGraph?:any, wizardNews?:any` ->
//     `?:unknown`, one line, advanceEnvoyDiplomacyPulse's @param) and running
//     both checkers before and after, then restoring the file sha256-exact:
//
//                                 before   after
//       domain-strict envoyPulse.js    14      16   (+2 — it gets WORSE)
//       domain-strict pulseKernel.js    8      10   (+2)
//       full-config   envoyPulse.js     2       2   (held — this half was true)
//       full-config   pulseKernel.js    4       6   (+2 — this half was true)
//
//     `npx tsc --noEmit -p tsconfig.domain-strict.json` and `-p tsconfig.full.json`,
//     counting located `src/domain/.../<file>.js(` diagnostics — the two-typechecker
//     receipt law: neither figure is total, and each is named with its config.
//     THE DIRECTION WAS BACKWARDS. `unknown` does not improve envoyPulse; it adds
//     two domain-strict errors there (TS2345 at 258,36 and 387,38 — an `unknown`
//     is not assignable to `WizardNewsFeed | null | undefined`) on top of the two
//     it opens in pulseKernel under BOTH configs (TS2739/TS2740 at pulseKernel
//     2044,5 and 2045,5 — `{}` missing every WizardNewsFeed / region-graph field,
//     because the dark early-return path hands the raw inputs straight back).
//     The conclusion is unchanged and now rests on reproduced numbers: the honest
//     cure needs the real wizardNews / regionalGraph shapes threaded through both
//     files. DECLARED DEBT, not an oversight — owed to a burn lane.
//
// CLEARED by the same lane, recorded so the count is auditable rather than merely
// smaller: src/domain/worldPulse/npcLadderKernel.js was 3 any / baseline 2 (+1),
// minted at 9ecec2a2 as `ladderFactionKey(/** @type {any} */ (faction))`, and is
// re-spelled with the accessor's own parameter type (the idiom warSeatBooks.js
// already uses) — back to its baseline of 2.
//
// ⛔ DO NOT run `--update` to make this list go away. `--update` re-freezes the
// WHOLE TREE, which would bank commercialReasons.js's 31 holes as permanent debt.
// Each row above is cleared by TYPING the hole, one file at a time.

const baseline = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.domain-any-baseline.json'), 'utf8'));
const current = countDomain();

describe('domain any-cast ratchet — the detector is honest', () => {
  test('counts every any/star form this codebase actually writes', () => {
    expect(countText('/** @type {any} */').any).toBe(1);
    expect(countText('/** @type {any[]} */').any).toBe(1);
    expect(countText('/** @type {*} */').any).toBe(1);
    expect(countText('/** @param {Record<string, any>} x */').any).toBe(1);
    expect(countText('/** @returns {Map<string, any>} */').any).toBe(1);
    // Inline object types count each hole, not each annotation.
    expect(countText('/** @param {{ a: any, b: any[], c: * }} x */').any).toBe(3);
    // Multiple tags on one line.
    expect(countText('/** @param {any} a @returns {any} */').any).toBe(2);
    // Multi-line type expressions (wrapped @typedef / @returns).
    expect(countText([
      '/**',
      ' * @typedef {{ a: any,',
      ' *   b: Record<string, any>,',
      ' *   c: * }} Wrapped',
      ' */',
    ].join('\n')).any).toBe(3);
  });

  test('never counts prose, identifiers, or comment gutters as holes', () => {
    // "any" in a tag DESCRIPTION (outside the type braces) is prose.
    expect(countText('/** @param {unknown} items  candidate array (any shape tolerated) */').any).toBe(0);
    expect(countText('/** @property {boolean} ok  false if any violations were found */').any).toBe(0);
    // "any" inside a type as part of an identifier is not the any type.
    expect(countText('/** @type {Company} */').any).toBe(0);
    expect(countText('/** @param {anyThing} x */').any).toBe(0);
    // The JSDoc continuation gutter's `*` is not the star type.
    expect(countText([
      '/**',
      ' * @typedef {{ a: string,',
      ' *   b: number }} Clean',
      ' */',
    ].join('\n')).any).toBe(0);
    // `*/` closers and `**` are never star types; untyped @param has no braces.
    expect(countText('/** @param x plain doc, no type */').any).toBe(0);
  });

  test('counts suppression directives, not prose about them', () => {
    expect(countText('// @ts-ignore').suppress).toBe(1);
    expect(countText('// @ts-expect-error -- legacy shape').suppress).toBe(1);
    // canonicalAccessors.js prose: "The two @ts-expect-errors below" — plural,
    // not a directive.
    expect(countText('// (The two @ts-expect-errors below are narrowing workarounds)').suppress).toBe(0);
    expect(countText('// @ts-ignore\n// @ts-expect-error').suppress).toBe(2);
  });
});

describe('domain any-cast ratchet — frozen baseline governance', () => {
  test('baseline totals equal the sum of their per-file counts (no stale drift)', () => {
    const anySum = Object.values(baseline.files).reduce((a, f) => a + f.any, 0);
    const supSum = Object.values(baseline.files).reduce((a, f) => a + f.suppress, 0);
    expect(baseline.totalAny).toBe(anySum);
    expect(baseline.totalSuppress).toBe(supSum);
    expect(baseline.total).toBe(anySum + supSum);
  });

  test('every baselined file is a src/domain file carrying real debt', () => {
    for (const [file, { any, suppress }] of Object.entries(baseline.files)) {
      expect(file.startsWith('src/domain/'), `${file} is outside the domain`).toBe(true);
      expect(Number.isInteger(any) && any >= 0, `${file} has a malformed any count`).toBe(true);
      expect(Number.isInteger(suppress) && suppress >= 0, `${file} has a malformed suppress count`).toBe(true);
      expect(any + suppress, `${file} is a zero-debt entry — remove it (run --update)`).toBeGreaterThan(0);
    }
  });

  test('no file exceeds its baseline (new files get 0) — fix the types, do not widen', () => {
    const regressions = [];
    for (const [file, { any, suppress }] of Object.entries(current.files)) {
      const base = baseline.files[file] ?? { any: 0, suppress: 0 };
      if (any > base.any) regressions.push(`${file}: ${any} any-holes (baseline ${base.any})`);
      if (suppress > base.suppress) regressions.push(`${file}: ${suppress} ts-suppressions (baseline ${base.suppress})`);
    }
    expect(regressions, `any-cast debt grew — replace the any/* / ts-ignore with a real type:\n  ${regressions.join('\n  ')}`).toEqual([]);
  });

  test('no file is below its baseline — ratchet down instead of leaving slack', () => {
    // Slack in the baseline is headroom a future regression could hide in.
    // After a burn-down, freeze the win: node scripts/count-domain-any.mjs --update
    const stale = [];
    for (const [file, base] of Object.entries(baseline.files)) {
      const cur = current.files[file] ?? { any: 0, suppress: 0 };
      if (cur.any < base.any || cur.suppress < base.suppress) {
        stale.push(`${file}: now ${cur.any} any / ${cur.suppress} suppress (baseline ${base.any}/${base.suppress})`);
      }
    }
    expect(stale, `debt shrank below the baseline — lock it in with \`node scripts/count-domain-any.mjs --update\`:\n  ${stale.join('\n  ')}`).toEqual([]);
  });

  test('baseline exactly matches the tree (airtight against any drift mode)', () => {
    expect(current.files).toEqual(baseline.files);
    expect(current.total).toBe(baseline.total);
  });

  test('the committed ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });
});
