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
import {
  GIT_OBJECTS_REACHABLE,
  UNRESOLVABLE_WELL_FORMED_SHA,
  gitDirPresent,
  gitResolvesCommit,
} from '../helpers/gitObjectStore.js';
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

// ── ⛔ AND THAT LEDGER IS NOW MACHINERY, BECAUSE PROSE CHECKS NOTHING ────────
//
// Everything above this line was a COMMENT. It named three overrunning files, their
// causes and their introducing commits with real care — and it enforced none of it,
// because two rows of this file sat in scripts/.test-ratchet-baseline.json:
//
//   … :: frozen baseline governance baseline exactly matches the tree (airtight …)
//   … :: frozen baseline governance no file exceeds its baseline (new files get 0) …
//
// Each is ONE assertion over an OPEN, tree-derived population, so freezing it froze
// THE WHOLE POPULATION. A FOURTH overrunning file, or commercialReasons.js going from
// 31 holes to 60, produced the byte-identical failing verdict and reddened nothing.
// A failing TEST is debt; a failing WALKER is a DISABLED GUARD (CONTRIBUTING.md,
// "The gate"), and this ratchet is a walker: it enumerates src/domain through
// scripts/count-domain-any.mjs and compares the result against a frozen inventory.
//
// THE DEBT IS RELOCATED, NOT FORGIVEN AND NOT BURNED DOWN. The three overruns move
// into the exact-identity ledger below, which is audited in BOTH directions, and the
// two arms go back to being LIVE for every other file in src/domain.
//
// ⚠ WHY THIS AND NOT `--update`: the prohibition above is the reason this ledger has
// to exist at all. `--update` re-freezes the WHOLE TREE and would bank all 34 holes as
// permanent baseline, which is precisely the laundering the prohibition forbids. A
// declared overrun is a NAMED, ATTRIBUTED, CAPPED bill; a re-freeze is amnesia.
//
// MEASURED, NEVER TRANSCRIBED — `countDomain()` run inside an integrity-counted
// `git archive` of committed abc5a78b (6,196 tracked paths in, 6,196 files out,
// `git status` clean), never over the live shared tree, which holds an owner session's
// uncommitted edits to commercialReasons.js itself (THE ARCHIVE-CENSUS LAW).
//
// ⚠⚠ AND THAT OWNER SESSION IS EXPECTED TO RED THIS, BY DESIGN. The ledger is EXACT,
// not a ceiling: if commercialReasons.js's 31 holes become 20, the exactness arm reds
// with "declared 31, measured 20 — lower the declared figure (bank the win)", and if
// they become 0 it reds with "delete the row". That is the same law the baseline's own
// `no file is below its baseline` arm already enforces, and it is what stops a
// quarantine drifting upward in effect. A red here is a WIN being banked, not a break.
const DECLARED_OVERRUNS = Object.freeze({
  'src/domain/worldPulse/commercialReasons.js': {
    any: 31,
    suppress: 0,
    introducedAt: 'd7ea69a4baf64d8c4281650b5160103519f453ef',
    cause: 'TR-1 THE CASUS COMMERCII added the file already carrying 31 holes, and a file absent '
      + 'from the baseline has an allowance of ZERO, so it has been over since its first commit. '
      + 'THE LARGEST SINGLE DEBT ON THIS LIST, and the reason `--update` is forbidden here: a '
      + 'blanket re-freeze would bank all 31 as permanent baseline. Cleared only by typing the '
      + 'commercial-reason payload shapes, one at a time.',
  },
  'src/domain/worldPulse/warDeployment.js': {
    any: 17,
    suppress: 0,
    introducedAt: '172e5f2252fada7e297ff2355147e4e42979ad2d',
    cause: 'Lane WZ-2 piece 3 (the license ledger) took this file from 16 holes to 17 against a '
      + 'baseline of 16. The smallest row on the list and the cheapest to clear: ONE hole, in a '
      + 'file the wave-5b burn-down already gave named pulseShapes typedefs (89 -> 64).',
  },
  'src/domain/worldPulse/envoyPulse.js': {
    any: 2,
    suppress: 0,
    introducedAt: 'e0c8646ee36fdfc6a34f7e8d20dce8885b2dffa3',
    cause: 'The `= {}` destructure idiom sweep left `regionalGraph?:any, wizardNews?:any` in '
      + "advanceEnvoyDiplomacyPulse's @param. ⚠ TYPING THEM `unknown` WAS TRIED, RE-MEASURED AND "
      + 'IS BACKWARDS — it adds two domain-strict errors here and two more in pulseKernel under '
      + 'BOTH configs (the full re-measurement is in this file\'s header ledger above). The honest '
      + 'cure needs the real WizardNewsFeed / region-graph shapes threaded through both files.',
  },
});

// A LITERAL total EXCESS (measured occurrences minus baselined allowance, summed over the
// ledger), not a figure derived from the object it is supposed to cap — a ceiling read out
// of its own list proves list == list and rises silently with every row added.
// MONOTONE DOWN from here. You may burn it; you may never pad it.
const DECLARED_OVERRUN_CEILING = 34;

/** Baseline allowance, widened ONLY by an attributed declared overrun. */
const allowanceFor = (file) => {
  const declared = DECLARED_OVERRUNS[file];
  if (declared) return { any: declared.any, suppress: declared.suppress };
  return baseline.files[file] ?? { any: 0, suppress: 0 };
};

/** What the tree must look like: the frozen baseline OVERLAID with the declared overruns. */
const expectedFiles = () => {
  const out = { ...baseline.files };
  for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) out[file] = { any: d.any, suppress: d.suppress };
  return out;
};

/** The excess a declared row carries over its baseline allowance (0 if it has none). */
const excessOf = (file, d) => {
  const base = baseline.files[file] ?? { any: 0, suppress: 0 };
  return Math.max(0, d.any - base.any) + Math.max(0, d.suppress - base.suppress);
};

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
      const base = allowanceFor(file);
      if (any > base.any) regressions.push(`${file}: ${any} any-holes (allowance ${base.any})`);
      if (suppress > base.suppress) regressions.push(`${file}: ${suppress} ts-suppressions (allowance ${base.suppress})`);
    }
    expect(
      regressions,
      'any-cast debt grew — replace the any/* / ts-ignore with a real type. ⛔ Widening the'
      + ' baseline is not the cure and neither is adding a DECLARED_OVERRUN row: both ledger'
      + ' ceilings are MONOTONE-DOWN literals, so a new row (or a raised count on an existing'
      + ' one) only moves the red from this arm to the ceiling arm:\n  ' + regressions.join('\n  '),
    ).toEqual([]);
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
    // THE TOTALITY ARM, and the reason the declared overruns are OVERLAID rather than
    // skipped: an exclusion would blind this comparison to the three files entirely, so a
    // declared file could then drift to any value at all. Overlaying keeps every file in
    // src/domain under an exact-equality check — the declared three simply have a
    // different, attributed, capped expected value.
    expect(current.files).toEqual(expectedFiles());
    const declaredExcess = Object.entries(DECLARED_OVERRUNS).reduce((a, [f, d]) => a + excessOf(f, d), 0);
    expect(current.total).toBe(baseline.total + declaredExcess);
  });

  test('the committed ceiling never rises (ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });
});

// ── ⛔ THE DECLARED-OVERRUN LEDGER'S OWN GOVERNANCE ──────────────────────────
// The ledger widens two live guards, so it carries the same discipline the census it
// replaced carries: every row ATTRIBUTED, the set EXACT in both directions, and both
// sizes capped by literals that only ever go down. Without these three arms the ledger
// is just a softer baseline with no `--update` guard on it at all.
//
// ── THE ATTRIBUTION ARM'S EXISTENCE LEG (F-S1-J8) ────────────────────────────
// The arm below attested `introducedAt` BY 40-HEX SHAPE ALONE, and a shape check accepts
// any well-formed string — `f`×40 satisfies it exactly as well as a real commit does. A sha
// that LOOKS bisectable and is not is worse than a missing one, because the next lane plans
// against it: that is the same failure the envoyPulse row's corrected figures record in the
// header ledger above, one layer down. This leg RESOLVES each declared sha against the real
// object store, ONE `git cat-file -e <sha>^{commit}` PER ROW.
//
// ⚠ IT IS ENVIRONMENT-AWARE AND STILL FAIL-CLOSED, which are not in tension. The wave-end
// attribution method runs this suite inside `git archive` extractions, and an archive tree
// carries NO object store at all, so an unconditional shell-out would red this walker in
// exactly the trees it is read in most — a disabled guard bought with rigour. So the branch
// is ASSERTED, never trusted: where git answers, a well-formed FAKE sha must FAIL to resolve
// before any row is believed (the negative control that stops this leg passing vacuously),
// and where it does not, the tree must genuinely carry no `.git` entry — so "no git here"
// can never become a silent downgrade back to the shape check.
//
// ⚠⚠ THE SHELL-OUT LIVES IN tests/helpers/gitObjectStore.js AND MAY NOT MOVE BACK IN HERE.
// This file is one of the estate's two NAMED COUNTEREXAMPLES for the walker-census law's
// DELEGATED arm (tests/lint/testRatchet.test.js, "NO SINGLE ARM CLASSIFIES THEM ALL"): the
// pin asserts that the NAME, TITLE and STRUCTURE arms all MISS this file and only A4 reaches
// it. A3's predicate matches a shell-out to git, so writing `execFileSync` here flips the
// structure arm true and destroys the counterexample — MEASURED, not feared: the first cut of
// this leg did exactly that and reds testRatchet's pin by name.

describe('domain any-cast ratchet — the declared-overrun ledger is honest', () => {
  const declaredFiles = Object.keys(DECLARED_OVERRUNS);

  test('⛔ EVERY DECLARED OVERRUN IS ATTRIBUTED — an unattributed row is a defect laundered into debt', () => {
    // THE EXISTENCE LEG'S OWN HONESTY, TAKEN BEFORE ANY ROW IS TRUSTED BY IT.
    if (GIT_OBJECTS_REACHABLE) {
      expect(
        gitResolvesCommit(UNRESOLVABLE_WELL_FORMED_SHA),
        'the existence leg cannot discriminate — a 40-hex sha that is a commit in NO repository'
        + ' RESOLVED, so `git cat-file -e` is answering yes to everything and every row below'
        + ' would pass this arm vacuously',
      ).toBe(false);
    } else {
      expect(
        gitDirPresent(),
        'git could not read HEAD in a tree that HAS a `.git` entry — the existence leg was'
        + ' skipped for a reason that is NOT "this is a `git archive` extraction". Repair the'
        + ' environment; do not let the attribution arm quietly degrade back to a shape check.',
      ).toBe(false);
    }
    for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) {
      expect(file.startsWith('src/domain/'), `${file} is outside the domain`).toBe(true);
      expect(Number.isInteger(d.any) && d.any >= 0, `${file}: malformed any count`).toBe(true);
      expect(Number.isInteger(d.suppress) && d.suppress >= 0, `${file}: malformed suppress count`).toBe(true);
      expect(
        String(d.introducedAt),
        `${file}: introducedAt must be a 40-hex sha — an overrun nobody can bisect cannot be argued about`,
      ).toMatch(/^[0-9a-f]{40}$/);
      // ...AND THE SHAPE IS NOT THE CLAIM. One `git cat-file -e` per row, so an invented but
      // plausible sha reds HERE, named, instead of reading as an attribution forever.
      if (GIT_OBJECTS_REACHABLE) {
        expect(
          gitResolvesCommit(String(d.introducedAt)),
          `${file}: introducedAt ${d.introducedAt} resolves to NO commit in this repository — a`
          + ' well-formed sha nobody can check out is a fabricated attribution, not a bisect point',
        ).toBe(true);
      }
      expect(String(d.cause).length, `${file}: declared with a stub, not an argument`).toBeGreaterThan(60);
    }
  });

  test('⛔ the ledger is EXACT — a stale or padded row reds, and so does an un-banked shrink', () => {
    // Audited in BOTH directions, which is what stops the ledger becoming a second, softer
    // baseline. A row that is no longer over its baseline is a WIN and reds until it is
    // banked; a row whose measured count has MOVED (either way) reds with both figures.
    const problems = [];
    for (const [file, d] of Object.entries(DECLARED_OVERRUNS)) {
      const cur = current.files[file];
      const base = baseline.files[file] ?? { any: 0, suppress: 0 };
      if (!cur) {
        problems.push(`${file}: carries NO any/suppress debt at all any more — delete its declared row (bank the win)`);
        continue;
      }
      if (cur.any !== d.any || cur.suppress !== d.suppress) {
        problems.push(
          `${file}: declared ${d.any} any / ${d.suppress} suppress, MEASURED ${cur.any} / ${cur.suppress}`
          + ' — if it shrank, lower the declared figure (bank the win); if it grew, that is a REGRESSION,'
          + ' type the hole instead of raising the row',
        );
        continue;
      }
      if (cur.any <= base.any && cur.suppress <= base.suppress) {
        problems.push(`${file}: no longer exceeds its baseline (${base.any}/${base.suppress}) — delete its declared row, the baseline covers it`);
      }
    }
    expect(problems, `the declared-overrun ledger disagrees with the tree:\n  ${problems.join('\n  ')}`).toEqual([]);
    // anchored: the loop above walked every declared row against a LIVE countDomain(), so
    // the non-emptiness floor below is a floor on a real population, not on an empty object.
    expect(
      declaredFiles.length,
      'the ledger emptied — if every overrun is genuinely typed, DELETE this ledger and this describe'
      + ' together and let the plain baseline do the work again. Do not leave an empty hatch open.',
    ).toBeGreaterThan(0);
  });

  test('⛔ no UNDECLARED file exceeds its baseline (the ledger is the only widening path)', () => {
    // The mirror of the exactness arm: the regression arm above uses `allowanceFor`, so a
    // file over its baseline is silent there IF it is declared. This arm proves the
    // converse — that nothing is over baseline WITHOUT a declared row — so the two
    // together are a total partition of src/domain with no unnamed slack in it.
    const undeclared = [];
    for (const [file, { any, suppress }] of Object.entries(current.files)) {
      if (file in DECLARED_OVERRUNS) continue;
      const base = baseline.files[file] ?? { any: 0, suppress: 0 };
      if (any > base.any || suppress > base.suppress) {
        undeclared.push(`${file}: ${any} any / ${suppress} suppress against baseline ${base.any}/${base.suppress}`);
      }
    }
    expect(undeclared, `undeclared overruns:\n  ${undeclared.join('\n  ')}`).toEqual([]);
  });

  test('the ledger ceilings never rise (both are monotone-down literals)', () => {
    // THE ANTI-LAUNDERING CAP, and the arm that makes the ledger a bill rather than a
    // permission slip. The exactness arms above are satisfied by ANY set that matches the
    // tree — including a set that grew — so without a frozen ceiling the honest way to
    // absorb the next regression would be "add a row and write a nice cause". These two
    // literals close that: new debt cannot be declared, only typed.
    const declaredExcess = Object.entries(DECLARED_OVERRUNS).reduce((a, [f, d]) => a + excessOf(f, d), 0);
    expect(declaredExcess, 'the declared any-cast excess GREW — type the hole, do not widen the ledger')
      .toBeLessThanOrEqual(DECLARED_OVERRUN_CEILING);
    expect(declaredFiles.length, 'a FOURTH file was declared — the ledger is monotone-down in rows too')
      .toBeLessThanOrEqual(3);
  });
});
