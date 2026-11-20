# Brief: BUILD-CONFLICT (DEPTH-2's builder; written 2026-11-20T16:09Z by `date -u`; the chair's word of 16:08 UTC: "BUILD NOW")

ONE UNIT: the stored "recent conflict" sentence (`powerStructure.recentConflict`) chooses, BY KEYED HASH WITH NO NEW DRAW, among
everyday quarrels each needing a house or fact the record holds. Branch `lane/depth-2-2026-11-20-conflict`, cut from `106a104b4`,
in your own worktree. Commit there by explicit paths with the receipts in each message; never push, never `--no-verify`, never
`git stash`, no census, never the whole suite, no GIT_* variable in any test run's environment, every run to a file read by its
count line through `sh scripts/gate-tail.sh <command...>`, one test process at a time (other jobs share the machine).
Read `CLAUDE.md` first. Read WHOLE: `src/generators/power/governanceNarrative.js`, `src/data/powerSiblings.js`,
`src/domain/facts/factVocabulary.js`, `src/domain/facts/drawDeclared.js`, `src/domain/safetyProfile.js :: voiceOf` (the no-roll
seed idiom), and `docs/chair/2026-11-20/content/depth/conflict/CONFLICT-MEASURE.md` (the measure, the 31 readers, the probe).
The probe `docs/chair/2026-11-20/content/depth/conflict/probe-conflict.patch` is a REFERENCE, not code to paste: write it cleanly.

THE LINES (byte-exact; `docs/chair/2026-11-20/content/depth/lines/CONFLICT-LINES.md` "THE LINES AS SENT", with the chair's three
rewordings, which GOVERN):
- g5: "The households nearest the river and those further off disagree over who may draw water first when the river runs low."
- l3: "How much grain the granary should hold back in reserve has been argued all season, and nothing is agreed."
- l4: "Who should pay to mend the walls has been argued for months, and every street says the next one should pay more."
Index 0 of each pool is today's line byte for byte (the thorp twin, the no-grazing twin `noGrazingQuarrelOf`, and the boycott
rewrite `factionDynamics.js :: boycottReadsRelation` must still fire exactly as today where index 0 is picked).

THE PICK (approved): argmax of `hashKey(<seed>::governanceNarrative:<POOL>::<id>)` over the lines whose needs hold; the seed read
from the active stream WITHOUT a roll; no seed -> index 0. The pools live beside `BASELINE_CONFLICT_SIBLINGS` in
`src/data/powerSiblings.js`, needs as vocabulary atoms read through `factsOf`. The site passes the `config` that
`buildGovernanceLabels` already receives into its `factsOf` call (ONE argument; the chair's word). ⛔ NO EDIT to
`src/generators/power/rulingStructure.js` (another lane holds it).

THREE VOCABULARY ATOMS (the chair's leave): "Water source", "Access to external mill", "Common grazing land": each answered by its
own home (the institution row the roster already holds), each APPENDED at the end of its list in `factVocabulary.js`, nothing else
in that file touched. No line uses them yet (two or three lines on them come later, after the chair's read; leave room, wire
nothing speculative). If the vocabulary's walkers demand a consumer or a register row, add exactly what they demand and name it.

TESTS. One new file `tests/generators/power/conflictQuarrelPick.test.js` that COMPUTES, never quotes a quarrel (the law in
`tests/helpers/drawnProse.js`): (a) THE PICK DRAWS NOTHING: a birth's random stream ends at the same position with the pick as
without it (or: the pick's code path calls no rng; prove it by execution); (b) every printed quarrel's needs hold on the record;
(c) no active seed -> index 0; (d) over `hxd-town-0..19` and `hxd-village-0..19` more than four distinct quarrels print and none in
more than eight of twenty. RED FIRST at the base for (b)/(d) (one sentence prints), green after; record titles and counts.
THE QUOTING TESTS (red on the probe): `tests/generators/power/conflictLadderReadsRoster.test.js` (2), `tests/generators/
bar3PowersLines.test.js` (2), `tests/generators/power/tailPowers3Conflict.test.js` (1), `tests/generators/bar8Powers.test.js` (15b):
cure by RE-PICKING seeds so each test watches the same line under the same condition, the same number of cases or more, nothing
weakened or skipped; each cure its own commit naming seeds out and in. If one cannot be kept at full strength, STOP on it and say so.
THE LINTS: `tests/lint/presumedThings.walker.test.js` (the tavern line) and `tests/lint/presumptionClasses.walker.test.js` (the
watch line; the field-rotation copy): the lines DECLARE their needs; make the walkers read the declaration if that is their designed
door, else add the register row the walker's own instructions prescribe, with the reason. Name every register row added.

RENDER MEASURE: `src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf` (and `tests/helpers/pageLaws/lowFamiliesI.mjs`)
match the WORD "families" over JSON including the field. Measure, by render, over hxd-<size>-0..99, the displays that move (count,
and three before/after pairs); change nothing there; report.

GREEN AT YOUR LAST COMMIT (each to a file, its count line): your test; the six quoting tests; `tests/generators/
governanceNarrative.test.js`; `tests/generators/power/tailPowers4Batch1.test.js`; the two walkers; every test file under `tests/`
naming `factVocabulary` or `powerSiblings`; `npx eslint` on every touched file. A golden that moves
(`tests/property/generatorGoldenMaster.test.js` and its manifest readers) is NAMED with before and after, never re-recorded;
`tests/property/espionageDormancyFence.test.js` is red at base (1 of 142): name its state.
ANSWER (at most 250 words): commit shas; red-first receipts; every count line; seeds out/in; register rows added; the render measure.
