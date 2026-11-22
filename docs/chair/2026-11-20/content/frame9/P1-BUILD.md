# FRAME-9 · brief P1 — the occupier's local face (a STORED unit, on SR1's tip)

Written 2026-11-22 by FRAME-9 on `lane/frame-9-2026-11-22`. You are a BUILDER: you change only the files named below, commit on your own worktree branch by explicit paths, never push. Each point vetoable by the owner.

## Read whole first (and no wider)
1. `docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt` on `origin/lane/chair-2026-11-08` (`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt`): all of it binds you, chiefly 1, 2, 4, 5, 9, 10, 11, 14 (c).
2. `docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-STORED.md` WHOLE: the law for a STORED unit (no new draw; the THREE PROOFS; stored figures named, signed by nobody; who stands in the role before and after; the security reader; a person is never "it") and its P1 line. Its pointers bind you: `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` COMMON section; `frame2/B8-CF10-BUILDS.md` (its chair's law and U3 = P1); `frame2/B7-CF10-PROPOSAL-RESULTS.md` § P1 (the measure and its scripts); `FRAME-3-HANDBACK.md` rulings 10, 11, 14, 16.
3. WHOLE, every source file you change: at least `src/domain/crisis/crisisCast.js`, and `src/data/crisis/stakeReasonLines.js` if a reason wording lives there.

## What SR1 changed under the old brief (read it in the tree, not in the old files)
SR1 (merged at `4de9873a4`, one-home cure `7e86f4d8c`) moved every stake-reason wording into `src/data/crisis/stakeReasonLines.js`; `crisisCast.js :: STAKE_REASONS` stays an exported name. P1's rung is chosen exactly as today, by `crisisCast.js :: castHash` (plain FNV-1a): do NOT switch it to the kernel's mixed pick (that is a later commit of FRAME-9's own, ruling 69 (2)).

## Your unit
P1 = B8's U3: the `face` rung order office → outsider (a lodging keeper; the officer is never named; the reason in the house's wording) → trade (a records trade's master); rates 1/2 then 1/3, as ROWS of a NEW table `CRISIS_COUNTERPART_TUNING` beside `CRISIS_CAST_TUNING` (frozen; one comment line per rate saying what it does). Only `faceCandidates` and its closed reasons. A new reason wording: in a data file (rule 1: every new pool in its own data file, or in `stakeReasonLines.js` if it is a stake reason), through the declared door, and BEFORE you build it, write it with its needs to `docs/chair/2026-11-20/content/frame9/P1-LINES.txt` (at most 60 lines, each new line beside a line of its pool) and STOP: FRAME-9 takes it to the chair and resumes you with the ruled words. If B7's design needs no new wording (the reasons exist), say so and go on.

## The ceilings (rule 9, rule 10)
`crisisCast.js` stands at its layer's `max-lines` ceiling (eslint, `tests/lint/sizeBaseline.test.js`; 800, shrink-only). No ceiling is raised and no statement is packed onto a shared line: put the new candidate rung in a LEAF file under `src/domain/crisis/` if the lines do not fit. The tuning table is registered as a DRAFT row in `tests/lint/.tuning-register.json` (status draft, signedAt null, its values, one line per rate); the inventory (`tests/lint/.tuning-inventory.json`) is re-frozen ONLY by its door with your seat's name and the reason: `TUNING_INVENTORY_REFREEZE='FRAME-9 P1' TUNING_INVENTORY_NOTE='P1: CRISIS_COUNTERPART_TUNING added (draft, unsigned)' npx vitest run tests/lint/tuningRegister.walker.test.js`, then an ordinary run green. Any other register a new file or test file moves (the lighting census, the presumption registers, the hideable hand list): say which and why; do NOT re-take them: FRAME-9 does at the merge.

## Your files
`src/domain/crisis/crisisCast.js`; a leaf under `src/domain/crisis/` if needed; a data file under `src/data/crisis/` if a wording is new; the tests that pin the face (`tests/domain/crisis/**` as needed; a new `tests/domain/crisis/crisisFaceCounterpart.test.js` for the red first); `tests/lint/.tuning-register.json` and `.tuning-inventory.json` by the door above; `docs/chair/2026-11-20/content/frame4/P1-RESULTS.md`; proof scripts under `docs/chair/2026-11-20/content/frame9/tools/P1/`. Anything else that moves: name it; a calm sheet, a stranger's sheet, a shared read, or another kind's role that moves: STOP and report.

## Proofs (all three, base `ea7d49a8a` (or the commit your worktree starts on, said in your report) against your tip; in your results file with the commands)
(a), (b), (c) exactly as FRAME4-BRIEFS-STORED's law 2, plus CF12's five W4 towns in (a). (c) is heavy: run it ALONE through the gate mutex (`sh scripts/gate-mutex.sh --run -- node <tool> ...`), and delete `<scratch>/trees` after the results are written. Red first: name each failing title on the tree without your `src/` change. Who stands in the role before and after (law 4), by kind, and two named towns' face lines as the owner reads them.

## Gates (each `sh scripts/gate-mutex.sh --run -- <cmd> > <log> 2>&1`; never through a pipe; read the count lines)
`tests/domain/crisis` whole; every test file that imports `crisisCast.js` or `crisisPage.js`; `tests/security/frameShareVeil.test.jsx`; `tests/lint` WHOLE at your last commit (after `git fetch -q origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD`); `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npx eslint` on touched files. Never `npm run check`, `npm run test:ratchet`, `--no-verify`, or a push. Never a test with `GIT_DIR`, `GIT_WORK_TREE` or `GIT_INDEX_FILE` set.

## Your report (at most 300 words + one table)
The commit; the red-first titles; the three proofs' counts; the stored figures moved with before and after; `tests/lint` whole's count line; FOR THE OWNER'S SIGNING: the table's values and what each number does; the security reader's list.
