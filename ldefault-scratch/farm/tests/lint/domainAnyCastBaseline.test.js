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
 *     instruction so the baseline can never go stale — the raw-button exact-set
 *     idiom. ⚠ THAT INSTRUCTION IS COMPUTED, NEVER A LITERAL (`ratchetDownAdvice`
 *     below): `--update` re-freezes the WHOLE TREE, so while the declared-overrun
 *     ledger is non-empty the lawful path is a HAND-LOWERED SINGLE ROW;
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
import {
  DECLARED_OVERRUNS,
  countDomain,
  countText,
  updatePlan,
} from '../../scripts/count-domain-any.mjs';

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
//     ⚠ THAT LAST CLAUSE IS SUPERSEDED and is left standing only as the record of
//     what this ruling assumed. The 2026-08-07 declared-overrun ledger below makes
//     `--update` a LAUNDERING path, not a ratchet-down path, for as long as the
//     ledger is non-empty; `ratchetDownAdvice()` is the live answer.
//     ⭐ SUPERSEDED AGAIN 2026-08-31, and this time in the TOOL rather than in prose:
//     TE-INSTR-2's R1 moved `DECLARED_OVERRUNS` into scripts/count-domain-any.mjs and
//     taught the writer to REFUSE its own ledger — `--update` now copies every declared
//     row through at its committed value, names each refusal on stderr and exits
//     non-zero. So `--update` is no longer a laundering path at all; it is merely
//     INERT against a declared row. The advice and the tool now switch together off
//     ONE ledger: the derived chokepoint above is the advice half, the writer's
//     refusal is the tool half, and neither can drift from the other.
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
//
// ── AND THAT PROHIBITION IS NOW THE TOOL'S, BECAUSE A COMMENT STOPPED NOBODY ──
// THREE LANES OBEYED THE SHRINK ARM'S INSTRUCTION AND RAN `--update` IN ONE DAY
// (2026-08-31: TE-CEIL step 6, W-FAITH F3c act 3, and TE-INSTR-1's own R1 docket
// row), each producing a diff that created commercialReasons/envoyPulse rows and
// RAISED warDeployment 16 -> 17. All three caught it by reading the diff; the
// tool helped none of them. The prohibition sat 150 lines above the instruction
// and nothing joined them.
//
// It is joined now, in the only place that can enforce it: `--update` REFUSES to
// create or raise a row for any file in this ledger, names every refusal, and
// exits non-zero. That is why `DECLARED_OVERRUNS` MOVED INTO
// scripts/count-domain-any.mjs and is IMPORTED here — the writer has to own the
// list it may not write, and a second copy of the file keys living in this file
// would have been the hardcoded-twin class instead of a cure. Every governance
// arm below still lives here, over the imported object; the ONE ledger now drives
// both the tool's refusal and the shrink arm's advice, so they can never disagree
// and they switch together the day the ledger is emptied.

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
// ⭐ THE OBJECT ITSELF NOW LIVES IN scripts/count-domain-any.mjs AND IS IMPORTED ABOVE.
// Not a relocation for tidiness: the WRITER has to own the list it may not write, or
// `--update` re-freezes rows this ledger exists to keep out of the baseline. Every arm
// that AUDITS the ledger stayed here, and there is still exactly one copy of every figure.

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

// ── ⛔ THE RATCHET-DOWN INSTRUCTION, DERIVED — AND WHY IT MAY NOT BE A LITERAL ──
//
// THIS FILE USED TO PRESCRIBE, IN A FAILING TEST, THE ONE COMMAND IT FORBIDS 190
// LINES HIGHER. The `no file is below its baseline` arm failed with "lock it in with
// `node scripts/count-domain-any.mjs --update`", while the ⛔ block above rules that
// `--update` re-freezes the WHOLE TREE and would bank every declared overrun as
// permanent baseline. So the guard's own remediation path DISABLED the guard: a
// reader who obeys the red launders exactly the debt this ledger exists to keep
// visible, and the test that told them to goes green. That is worse than an
// unhelpful message — it is a ratchet that argues for its own release.
//
// ⚠ IT WAS OBEYED. A whole-tree re-freeze banked 33 holes across two files that were
// on NO list, and moved warDeployment 16 -> 17 — all of it foreign, base-owned debt
// laundered into the frozen baseline by a lane following the instrument's own advice.
//
// THE CURE IS NOT BETTER WORDING, BECAUSE WORDING DRIFTS FROM THE LEDGER IT
// DESCRIBES — which is precisely how the contradiction arose. The advice is DERIVED
// from `DECLARED_OVERRUNS`, so there is no string in this file that can fall out of
// sync with it, and the forbidden command is UNREACHABLE while a declared overrun
// exists. When the ledger genuinely empties, `--update` becomes lawful again and this
// function starts printing it again, in the same act, with no wording to remember.
/** The lawful way to bank a shrink, computed from the ledger rather than transcribed. */
const ratchetDownAdvice = () => {
  const declared = Object.keys(DECLARED_OVERRUNS);
  if (declared.length === 0) {
    // Ledger empty: a whole-tree re-freeze banks nothing foreign, so the raw button
    // is the cure again — the idiom the header describes.
    return 'bank it with `node scripts/count-domain-any.mjs --update` (lawful here ONLY'
      + ' because the declared-overrun ledger is currently EMPTY, so a whole-tree'
      + ' re-freeze can bank no foreign debt)';
  }
  return 'HAND-LOWER ONLY THE ROW THAT MOVED, to its measured figure —'
    + ' tests/lint/.domain-any-baseline.json for a baselined file, or its DECLARED_OVERRUNS'
    + ' entry in scripts/count-domain-any.mjs for one of the declared'
    + ` ${declared.length} (${declared.join(', ')}), lowering DECLARED_OVERRUN_CEILING by the`
    + ' same amount when a declared row shrinks.'
    + ' ⚠ `node scripts/count-domain-any.mjs --update` will NOT do this for you and is no'
    + ' longer forbidden for trying: the writer now owns the ledger it may not write, so it'
    + ' copies every declared row through at its committed value, names each refusal on'
    + ' stderr and exits non-zero. Running it is mechanically SAFE against a declared row and'
    + ' simply leaves that row where it was; the hand-lowering above is still the only path'
    + ' that moves one, because a declared row moves only by the LEDGER\'s governed act.';
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
      expect(
        any + suppress,
        `${file} is a zero-debt entry — delete its row: ${ratchetDownAdvice()}`,
      ).toBeGreaterThan(0);
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
    // ⚠ THIS INSTRUCTION USED TO BE A TRAP AND IS NOW SAFE TO OBEY, which is why it still
    // stands. `--update` re-freezes the whole tree, so obeying it while the declared-overrun
    // ledger was non-empty banked 34 holes of declared debt as permanent baseline (three lanes
    // did exactly that on 2026-08-31). The counter now REFUSES to create or raise a declared
    // row, copies each one's committed value through untouched, names every refusal and exits
    // non-zero — so the worst this command can now do to a declared file is nothing at all.
    const stale = [];
    for (const [file, base] of Object.entries(baseline.files)) {
      const cur = current.files[file] ?? { any: 0, suppress: 0 };
      if (cur.any < base.any || cur.suppress < base.suppress) {
        stale.push(`${file}: now ${cur.any} any / ${cur.suppress} suppress (baseline ${base.any}/${base.suppress})`);
      }
    }
    const declaredStale = stale.filter((row) => row.split(':')[0] in DECLARED_OVERRUNS);
    expect(
      stale,
      'debt shrank below the baseline — lock it in with `node scripts/count-domain-any.mjs'
      + ' --update`. It re-freezes every file EXCEPT the declared overruns, whose committed rows'
      + ' it copies through untouched and names on stderr (it exits non-zero when it does, which'
      + ' is not a failure — re-read the register to see what it wrote).'
      + (declaredStale.length
        ? '\n  ⛔ A DECLARED-OVERRUN FILE IS IN THIS LIST, and `--update` will NOT move it: a'
          + " declared row's movement is the LEDGER's governed path. Lower that row's declared"
          + ' figure to bank the win, or delete the row once the baseline covers the file, and'
          + ' only then does an ordinary --update take it over.'
        : '')
      + `:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
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

// ── ⛔ THE `--update` GUARD ITSELF, CONVICTED RATHER THAN DESCRIBED ───────────
// The ledger above is a bill; this describe is the reason the bill cannot be paid by
// accident. `--update` re-freezes the WHOLE TREE, and for a whole day the ratchet's own
// shrink arm prescribed it while the header three screens up forbade it — so three
// separate lanes ran it, and all three caught the laundering by READING THE DIFF. The
// tool now refuses, and a refusal nobody executes is the same kind of claim the ledger
// itself replaced: a comment. These arms drive `updatePlan` — the pure function the CLI
// writes through — with synthetic trees, so the refusal is proven without touching the
// register, and then once more against the LIVE ledger so the synthetic cannot be the
// only population it works on.
describe('domain any-cast ratchet — `--update` refuses to bank a declared overrun', () => {
  const LEDGER = Object.freeze({
    'src/domain/a.js': { any: 9, suppress: 0, introducedAt: 'a'.repeat(40), cause: 'x'.repeat(70) },
    'src/domain/b.js': { any: 4, suppress: 1, introducedAt: 'b'.repeat(40), cause: 'y'.repeat(70) },
  });
  /** A synthetic tree in countDomain()'s exact output shape. */
  const treeOf = (files) => {
    let totalAny = 0;
    let totalSuppress = 0;
    for (const f of Object.values(files)) { totalAny += f.any; totalSuppress += f.suppress; }
    return { total: totalAny + totalSuppress, totalAny, totalSuppress, files };
  };

  test('⛔ a declared file ABSENT from the baseline is NEVER created — the commercialReasons shape', () => {
    // The 31-hole row: absent by design, allowance ZERO, and a blanket re-freeze would have
    // written it in as permanent debt. This is the largest of the three real rows and the one
    // whose cause names `--update` in terms.
    const tree = treeOf({ 'src/domain/a.js': { any: 9, suppress: 0 }, 'src/domain/keep.js': { any: 2, suppress: 0 } });
    const committed = { files: { 'src/domain/keep.js': { any: 2, suppress: 0 } } };
    const { next, refusals } = updatePlan(tree, committed, LEDGER);
    expect(Object.keys(next.files), 'the declared file was banked into the baseline').toEqual(['src/domain/keep.js']);
    expect(next.total, 'the total absorbed the declared holes even though the row was refused').toBe(2);
    expect(refusals.map((r) => r.file), 'the refusal did not NAME the file it refused').toEqual(['src/domain/a.js']);
    expect(refusals[0].kept, 'a file with no committed row was reported as if it had one').toBe(null);
    expect(refusals[0].measured).toEqual({ any: 9, suppress: 0 });
  });

  test('⛔ a declared file is never RAISED — the warDeployment shape, the raise the ratchet forbids', () => {
    // 16 -> 17 is the whole of that row, and it is the half that makes the trap a regression
    // rather than merely a widening: the `no file exceeds its baseline` arm forbids a raise
    // outright, so `--update` writing one put the register into a state the gate refuses.
    const tree = treeOf({ 'src/domain/b.js': { any: 4, suppress: 1 } });
    const committed = { files: { 'src/domain/b.js': { any: 3, suppress: 1 } } };
    const { next, refusals } = updatePlan(tree, committed, LEDGER);
    expect(next.files['src/domain/b.js'], 'the declared row was raised to the measurement').toEqual({ any: 3, suppress: 1 });
    expect(next.total).toBe(4);
    expect(refusals).toEqual([{ file: 'src/domain/b.js', measured: { any: 4, suppress: 1 }, kept: { any: 3, suppress: 1 } }]);
  });

  test('⛔ a declared file is never LOWERED either, and that direction is deliberate', () => {
    // Banking a declared shrink here would silently empty the ledger's excess while the row
    // still claims its old figure — the ledger's exactness arm would then be comparing a
    // declared number against a baseline that had already absorbed the win. The shrink is
    // banked by LOWERING THE LEDGER ROW; only then does the file stop being declared.
    const tree = treeOf({ 'src/domain/b.js': { any: 1, suppress: 0 } });
    const committed = { files: { 'src/domain/b.js': { any: 3, suppress: 1 } } };
    const { next, refusals } = updatePlan(tree, committed, LEDGER);
    expect(next.files['src/domain/b.js']).toEqual({ any: 3, suppress: 1 });
    expect(refusals.map((r) => r.file)).toEqual(['src/domain/b.js']);
    // …and the same holds when the file drops out of the tree entirely.
    const gone = updatePlan(treeOf({}), committed, LEDGER);
    expect(gone.next.files['src/domain/b.js'], 'a declared row vanished from the register').toEqual({ any: 3, suppress: 1 });
    expect(gone.refusals).toEqual([{ file: 'src/domain/b.js', measured: null, kept: { any: 3, suppress: 1 } }]);
  });

  test('a LAWFUL update still works — undeclared rows are re-frozen, stale ones dropped', () => {
    // The accuracy half. Without it the refusal is indistinguishable from a tool that has
    // simply stopped writing, which is the way a guard becomes a disabled guard.
    const tree = treeOf({ 'src/domain/shrank.js': { any: 2, suppress: 0 }, 'src/domain/grew.js': { any: 7, suppress: 1 } });
    const committed = {
      files: {
        'src/domain/shrank.js': { any: 5, suppress: 0 },
        'src/domain/grew.js': { any: 6, suppress: 1 },
        'src/domain/vanished.js': { any: 4, suppress: 0 },
      },
    };
    const { next, refusals } = updatePlan(tree, committed, LEDGER);
    expect(refusals, 'an undeclared file was refused').toEqual([]);
    expect(next.files).toEqual({ 'src/domain/grew.js': { any: 7, suppress: 1 }, 'src/domain/shrank.js': { any: 2, suppress: 0 } });
    expect(next.totalAny).toBe(9);
    expect(next.totalSuppress).toBe(1);
    expect(next.total).toBe(10);
  });

  test('⛔ THE GUARD-THE-GUARD ARM: an EMPTY ledger re-freezes the WHOLE tree, live', () => {
    // Everything above is satisfied by a planner that refuses too much, and the estate has
    // been bitten by exactly that shape (a guard whose accuracy half was never written). Run
    // the LIVE tally through the LIVE baseline with the ledger emptied: the plan must be the
    // measurement itself, key for key, so the refusal is proven to come from the ledger and
    // from nothing else — and the day the ledger empties, `--update` is whole again.
    const { next, refusals } = updatePlan(current, baseline, {});
    expect(refusals, 'rows were refused with an EMPTY ledger — the guard is refusing on its own').toEqual([]);
    expect(next.files).toEqual(current.files);
    expect(next.total).toBe(current.total);
    expect(next.totalAny).toBe(current.totalAny);
    expect(next.totalSuppress).toBe(current.totalSuppress);
    expect(Object.keys(next.files).length, 'the live tally is empty — this arm proved nothing').toBeGreaterThan(100);
  });

  test('⛔ every LIVE declared row is refused against the LIVE register', () => {
    // The synthetic arms above prove the RULE; this one proves it reaches the three files the
    // ledger actually names, on the register actually committed. A refusal that works only on
    // a two-row fixture is the vacuity this whole file exists to refuse.
    const { next, refusals } = updatePlan(current, baseline);
    expect(refusals.map((r) => r.file).sort(), 'the live ledger and the live refusal set disagree')
      .toEqual(Object.keys(DECLARED_OVERRUNS).sort());
    for (const file of Object.keys(DECLARED_OVERRUNS)) {
      const committed = baseline.files[file];
      expect(next.files[file], `${file}: --update would have moved a declared row`)
        .toEqual(committed ? { any: committed.any, suppress: committed.suppress } : undefined);
    }
    // …and what it WOULD write is exactly the register that is committed, so running
    // `--update` on a clean tip today is a no-op rather than a 12-insertion laundering diff.
    expect(next.files, 'a clean-tip --update would still move the committed register').toEqual(baseline.files);
    expect(next.total).toBe(baseline.total);
  });
});
