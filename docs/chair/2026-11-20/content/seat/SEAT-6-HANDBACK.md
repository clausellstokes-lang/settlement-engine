# SEAT-6 — HAND-BACK (kept current at every push; last written 2026-11-20T17:36:44Z, read from `date -u`)

**For the next owner of this lane: this file, `SEAT-5-HANDBACK.md` §1 to §3 (every ruling 1 to 52, the units' table, the instruments) and `briefs/` are all you need.** This file adds only what changed since SEAT-5's hand-over.

Branch `lane/seat-6-2026-11-20` (origin), fast-forwarded to `8bfabc080`: the chair said "THE LANE IS YOURS at 8bfabc080" (16:43Z; SEAT-5's final tip; its last green code tip `0702dc894`, U4). SEAT-6 is session_019yED1R4mTVRuHKRPWJPt3f.

## 0. THE STATE (2026-11-20T16:44:59Z)

- **Reproduced at the seating (16:32Z, at `6e697f5db`, scratch worktree):** `node docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs --force-law _seatLawVersion=2`: `u4-contest.md` and `.json` identical but `seconds` (570 → 549); both pools 0 errors, draft diffs 0, forced-field diffs 0; forced-birth diffs 2/900 and 2/960 (U4-REPORT (b), PLAUSIBLE path `castPowers.js :: contendersOf`).
- **U5 (B5) is SEAT-5's builder**, running in SEAT-5's container on `lane/seat-2026-11-20-u5` from `6e697f5db`; SEAT-6's three cures (below, item 53) relayed to it by SEAT-5. It returns to SEAT-5, which pushes `lane/seat-2026-11-20-u5-wip` unread and relays one line through the chair. THEN SEAT-6: read U5 whole, once; check each cure is in it (what is missing goes to a builder of SEAT-6's own); re-run red and green; merge; censuses by their doors; `tests/lint` whole; push; "U5 merged <commit>".
- **Until U5 returns:** brief nothing that touches U5's files (`rulingPower.js`, `holderOfSeat.js`, the two coup call sites, `tests/domain/seat/seatTransfer.test.js`).
- **SEAT-5's last unit, MEASURE-LIT (item 52)**, runs on SEAT-5's own branch, docs and scripts only; its result reaches SEAT-6 through the chair.
- **NEXT after U5:** UK (item 42) as measure and propose, one message with the table; U6 waits on "factionDynamics released at <commit>".

## 1. RULINGS SINCE SEAT-5's HAND-BACK (each the chair's, each vetoable by the owner)

53. **U5's THREE CURES (the chair, 16:34Z, approved as SEAT-6 wrote them; `briefs/U5-TRANSFER.md` last section):** (1) the retired edge's narrative is ONE fixed wording in a class of its own (`'retired'`), never an `'edge'` wording; an arm, red first, proves it matches no `'edge'` wording for any form; the kept form's `recentConflict` line joins as `'conflict'`; (2) after U5, both pools: the fail-closed rule fires in 0 towns after every transfer; (3) the brief's stale names read "the lane's owner".
54. **U8's born-pin census names the four towns whose forced birth differs from the dark birth** (default seat-measure-town-22, -113; presets lawless_frontier-8, city-theocracy-6).
55. **THE OWNER'S ORDER ON SAMENESS (15:44Z):** PEOPLE-1 re-words the smallest places' power description in `power/rulingStructure.js` and `power/claimStanding.js`, building there only on a commit the chair names: a unit of this lane about to change either file is said in one line to the chair first.
56. **THE FORTUNE LANE'S "MERITS OF RULE" (approved 15:30Z, dark, not built):** two merits lift a ruler's standing, only upward, at Tolerated or better, the capture rung a condition; no contest figure moves by its own measure. This lane builds nothing for it; the joint measure reads both.
57. **THE MARK:** 450,000 used tokens by the chair's read (own estimate plus a half in each message); the chair seats a successor at 360,000.

## 2. THE UNITS (changes to SEAT-5's §2 only)

| unit | builder branch | state |
|---|---|---|
| U5 THE TRANSFER | `lane/seat-2026-11-20-u5` (B5, SEAT-5's, from `6e697f5db`) | OUT; cures relayed; returns as `-wip` through SEAT-5 |
| MEASURE-LIT | SEAT-5's own branch | SEAT-5's; result through the chair |

## 3. SINCE THE FIRST WRITING (2026-11-20T17:36:44Z)

**State.** U5 (B5, `origin/lane/seat-2026-11-20-u5-wip` at `9a05215bc`) READ WHOLE by SEAT-6: red re-run 21 failed/62 passed at the base code (= B5's table), green 83/83 at the tip; `statusUnionTotality.walker` A3 the one red. U5's pool measure re-run by SEAT-6 (`u5/measure-u5.mjs --force-law _seatLawVersion=2`, scratch). SEAT-5's final tip `6ccdc1b2d` (MEASURE-LIT, docs only) merged at `4467161a0`. OUT: **B5b, U5-CURE** (`briefs/U5-CURE.md`, branch `lane/seat-2026-11-20-u5-cure` from `9a05215bc`); **BMV, MEASURE-VISITOR** (`briefs/MEASURE-VISITOR.md`, branch `lane/seat-6-2026-11-20-visitor` from `213ec7cbb`). NEXT: merge U5 + U5-CURE together (censuses by their doors, `tests/lint` whole, push, "U5 merged <commit>"); then UK (item 42) measure and propose; U6 (`factionDynamics.js` released, item 58).

58. **`factionDynamics.js` RELEASED to this lane at `1cd2e6d93`** (FORTUNE-3, `lane/fortune-3-2026-11-20`; its safety hunk merged, `sizeRelativeSafetyContrib` added below U3's block; it never touches the file again). One more line there from the people lane (a stored variant for the regen's vote matcher), named by the chair first.
59. **U5's WIRING (the chair, 17:32Z: yes):** every caller of `transferRulingPower` (`applyWorldPulse.js`, `applyWorldPulseFactionRoster.js`, `mutateWorld.js :: changeRulingPower`) passes `seatCircumstances` as a thunk; an arm proves every play-time digest byte-identical with the law dark. Measured by SEAT-6 at 17:4xZ: no other lane's tip on origin touches the three files or `holderOfSeat.js`. **Law dark, NOTHING MOVES at play time** (`seatsByHolder` gates every new branch; U5 arm (7)).
60. **THE HOMONYM (the chair, 17:32Z, withdrawing "never by renaming"):** the sentence class `'retired'` names a retired EDGE, not a person: it is renamed `'retiredEdge'`; `statusUnionTotality.walker` keeps its full trigger `['dead', 'exiled', 'retired']` and A3's pin does not move. (SEAT-6 had measured the declaration's cost: `holderOfSeat.js` the only file flagged by `'retired'` alone.)
61. **THE POOLS (the chair, 17:32Z):** pool A (`measure-holder.mjs`: `birthConfig({ settType })`, no `DEFAULT_CONFIG`: every route `'road'`, every threat `'frontier'`) is NOT a visitor's world and goes into no table for the owner. The owner's headline is a VISITOR pool born as `settlementGenerateAction.js` births (`{ ...DEFAULT_CONFIG, settType }` through `birthConfig` with `_randomizePriorities: true`); the chair's 600 (`hxd-<size>-<i>`) beside it; MEASURE-VISITOR also tests the cause (pool A with route and threat rolled). MEASURE-LIT (`u4/measure-lit.md`, `e2a9a31cf`) is the measure of record until MEASURE-VISITOR lands.
62. **U5's JUDGMENT, carried (B5, vetoable):** a kept form under a demotion appends no house row and `transfer.incumbent.demoted` reads false (the body was not reshaped; a second row of the form's name would be two rows of one name); an explicit `demoteIncumbent: true` is overridden by a kept form. **For U12:** `officeWordInfo('the monarch')` is null (the bare read misses the article): CS22's guard must drop the article, and then reads "the lord"/"the lady" (noble-house keepers) as crown words: 5 of 5 kept-crown towns flag them before and after the transfer, none the person. A NOTE: U5's retirement matches the edge wording by its own literal in `rulingPower.js` (first paint cannot import `holderOfSeat.js`); arm (4) guards the pair.
