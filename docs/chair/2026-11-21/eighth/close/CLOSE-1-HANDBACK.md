# CLOSE-1 — HAND-BACK (kept current at every push; last written 2026-11-22 16:10 UTC, read from `date -u`)

The seat that rehearses THE CLOSE on scratch refs (prompt: `docs/chair/2026-11-21/eighth/prompts/CLOSE-1.txt` on
`lane/chair-2026-11-08`, from e75a95c6b). The chair: session_01ACmDYY29VRchM87v1yhL9Q (send_message).

## 0. WHERE THE SEAT STANDS (2026-11-22 16:10 UTC; the seat's count about 540,000; at 600,000 it hands over to CLOSE-2, E101)

A SUCCESSOR'S WHOLE READ-IN: this section; `CLOSE-RECIPE.md` (THE FLIP, step by step: 0 before it; 1 the dials, 1a
the texts of darkness, 1b the one fact-layer row; 2 the census's re-run recipe; 2b the flip's commits in order and the
146 pins by door; 5b the lit golden corpus; 5c the home page's sample town); `FLIP-CENSUS.md` (the rehearsal's reading:
six parts, the totals, two faults, the veil's counts, the Summary bar, the power order); `census/` (the tools:
`run-parts.sh`, `match.mjs`, `dump.mjs`, `CLASSIFY-BRIEF.md` the classifier's rules, `diff-classed.mjs`, the probes,
the per-part `lit-<part>-match.tsv` and `-classed.tsv`, `pins-by-door.tsv`); the briefs `briefs/JOIN-LAWS.md`,
`briefs/CLOSE-FIXTURE.md`, `briefs/GOLDEN-LIT.md`.

| ref | tip | state |
|---|---|---|
| `lane/close-1-2026-11-22` (this lane) | this push | the line 1ec3e81d1 merged; CLOSE-FIXTURE merged and ACCEPTED for landing ("CLOSE-FIXTURE 6f579f0e7", the next stack); then docs only |
| `lane/close-1-lit-scratch-2026-11-22` | 217b628f3 | THE LIT REF the chair names: the line at point 98 (c110dd85b) plus the three dials, exactly (`git diff c110dd85b 217b628f3 -- . ':!docs'`: 3 lines). Beneath: e987c3e36, 5c4419815 (VEIL-33 read it), 4bba8781d |
| `lane/close-1-join-scratch-2026-11-22` | a349917e7 | the trial join with its doors (history; superseded by the line at point 98) |
| `lane/close-1-2026-11-22-join-wip` | 8b935be05 (+ E101's unit in flight) | JOIN (unit 3) on c110dd85b: built by a builder, its diff READ WHOLE by CLOSE-1; NOT YET re-run by CLOSE-1 (red, dark green, lit green, rule 8: queued in `scratchpad/joinlaws/verify/verify.sh`, to be re-launched on the builder's E101 tip) |
| `lane/close-1-2026-11-22-golden-wip` | builder's (worktree `/home/user/wt/golden`, from 217b628f3) | GOLDEN-LIT (E99): a builder is OUT on `briefs/GOLDEN-LIT.md` (the lit twin of the golden master, prepared, NEVER recorded; `close/OWNER-GOLDEN-LIT.md` the owner's draft). Lands only in the flip's own stack, step 4 |

HANDED OVER (2026-11-22 16:30 UTC, at about 590,000 by this seat's own count; E101's mark 600,000). FOR CLOSE-2, IN THIS ORDER:
(1) JOIN: its builder was resumed on E101 (the living-content duplicate's roster-key check into arm (a), red first, then the
duplicate cut or kept with a header note): read its report (the builder is a subagent of CLOSE-1's session: if it cannot
be reached, read `lane/close-1-2026-11-22-join-wip`'s log and diff); then CLOSE-1's own re-run, written and NOT yet
run: `scratchpad/joinlaws/verify/verify.sh` (dark green over the six files, the seat-clamp plant red, the lit copy's
green, one build, `tests/build` and `tests/lint` whole), re-launched on the builder's final tip; then "JOIN <commit>".
(2) GOLDEN-LIT: its builder is OUT (subagent of CLOSE-1's session, worktree `/home/user/wt/golden`); read its diff whole
and `close/OWNER-GOLDEN-LIT.md`; push `lane/close-1-2026-11-22-golden-wip`.
(3) UNIT 6: `measures/joint-lit/JOINT-MEASURE-LIT.md` (stop condition 1 OWED: read the trouble cause slots by shareAll in
its `SAME-CENSUS.md`; 2 PLAUSIBLY passed; 3 saturates; STORY at one position by size).
(4) UNIT 7: `FOR-THE-OWNER-DRAFT.md`, re-cut from the final census.
BOTH BUILDERS ENDED AND PUSHED (diffs NOT read by CLOSE-1; each report PLAUSIBLE): JOIN `lane/close-1-2026-11-22-join-wip` at a1319f388 (E101 done: the roster check in arm (a), red by its own plant, the duplicate cut; `tests/lint` 3 red, the line's). GOLDEN-LIT `lane/close-1-2026-11-22-golden-wip` at ba0e1c288 (four commits, no manifest, no shift record; TWO FINDINGS FOR CLOSE-2: the dark golden master reproduces 0 of 525 of its own manifest on the lit ref, PLAUSIBLY line drift since its 2026-11-19 record; the door needs a `.golden-freeze-register.json` row that belongs to the owner's signing act; its scratch capture `lit-manifest.json`, `capture-report.json`, `summaries.json` sit in CLOSE-1's scratch `golden/` only).
DONE AND ACCEPTED: unit 1 (the trial join), unit 2 (the lit ref), CLOSE-FIXTURE (a true fault found and cured; lands
in the next stack), unit 4's REHEARSAL (the lit half only, by E90: 3,765 files, 43,183 tests, 204 red, 54 listed, 150
new: 146 pins, 1 re-cut, 2 faults: U8 to fortune; the powers leaf ruled E91 a step of the flip, proven 15/15), the
recipe's items (E91, E99's order, pins by door, the lit golden corpus), unit 7's DRAFT (`FOR-THE-OWNER-DRAFT.md`).
IN THE AIR: (1) JOIN's builder on E101 (the duplicate's roster-key check carried into arm (a), red first, then the
duplicate cut, or kept with a header note); (2) GOLDEN-LIT's builder; (3) unit 6's render: `scripts/sameness-census.mjs
--measure --plan=scratchpad/u6/plan900.json --text --workers=3 --out=scratchpad/u6/run1` on the lit ref, through the
mutex; the stop-condition script `scratchpad/u6/stop2.mjs` reads its text files after.
NEXT, IN THE CHAIR'S ORDER (E101): "JOIN <commit>" after CLOSE-1's own re-run (the exact commit, three plants red and
green, `tests/lint` whole, nothing outside `tests/` moved); GOLDEN-LIT's diff read and `close/OWNER-GOLDEN-LIT.md`;
then unit 6 (the three stop conditions, STORY at one position by size from the census's table (c), twelve places'
texts for the chair) and unit 7 re-cut from the final census.

## 1. RULINGS IN FORCE (numbered; the chair's)
1. The troubles law is not in this deploy (E28): every item of it struck.
2. The finish line (E30): an item "whichever of two lanes lands second" is done by the lane that HAS landed, or named owed.
3. Fortune ships with two merits (E32: LASTING by FORTUNE-7, "FORTUNE-B"); who rules gains U6 and U7 later ("SEAT-B", E42): the rehearsal runs again on them.
4. Full pace (E45, COMMON-EIGHTH 12): up to two builders where manifests do not touch; a stack ref is read-only.

5. E53/E61: the nine trial-join conflicts classed (the union for `densityCreateBoundary.js`, its walker and `.tuning-register.json`; `HAND_CEILING` 75; observed-shape: the LANE's side, then its plain `--write`, stopping if bank or identities read higher than 2215/1553/445, 79/53).
6. E55: CLOSE-FIXTURE is this seat's unit that lands (the sample town born on the button's road); `--emit` is the chair's at the close.
7. E61: JOIN's plan approved (one file over GENERATION_LAWS; each lane keeps its own arms; arm (g) the one `birthConfig(null)` pin); the atom `seat contested` is SEAT-TOWN's (PROSE-5), not JOIN's.
8. E86: fault 1 (fortune cuts a crisis's own power in a thorp) is fortune's U8, cured before the flip.
9. E90: the flip's census is the close's alone, run ONCE on the final tree from this seat's recipe; the lanes send paper flip lists; a move no list expected is a SURPRISE.
10. E91: fault 2 (the seat contest reads the cast in `powersList`) is cured by ONE factLayers row moved IN THE FLIP'S OWN COMMIT (recipe step 1b).
11. E96: the stored power order's tail is out of order dark as well: not the flip's; for the display lane after the first deploy.
12. E99: GOLDEN-LIT is this seat's unit: prepared and shown, never recorded; it lands only at the flip's step 4.
13. E101: the living-content duplicate's check carried into JOIN's arm (a) red-first, then cut (or kept with a note); the order: JOIN, the hand-back, GOLDEN-LIT, then units 6 and 7; hand over at 600,000.

## 2. OPEN QUESTIONS PUT TO THE CHAIR
- The class of `tests/lint/.tuning-register.json` in a merge (unit 1).
- (answered by the chair: SAME-3.txt and the seventh handoff's two entries)
