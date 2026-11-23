# THE Q8 TRIAL (CLOSE-5; READ-ONLY, ITS VALUES PROVISIONAL; written 2026-11-23 05:09 UTC, read from `date -u`)

THE TREE: `lane/close-5-2026-11-23-lit-scratch` at b1628d34c = the stack's tip 5e63f2603 (the line 244fa84ef + points 106
2f3d614ac, 107 0fbb255f6, 108 e85971dcc, 109 4fa51f422, the lighting census twice) + `close-2/census/light.sh` (4 files, 5
lines). Lit: `birthConfig({settType:'town'})` mints `_seatLawVersion: 2`, `_fortuneLawVersion: 2`. A scratch ref, merged by
nobody. THE RUNNER: `close-5/trial.sh`, every part through `scripts/gate-mutex.sh` (`q8/progress.txt`). THE MATCHER:
`close-5/vs-census.mjs` against `ci/RED-AT-LINE.tsv` (the chair's branch at a989741e9, 61 rows) and the final census's 153
classed rows, ONE-TO-ONE (each red takes the unused census row of its file with the longest common title prefix: the first
cut, a 120-character prefix, folded two sibling titles onto one row and showed two false GONE rows; corrected before reading).

| part | files / tests | red | on the census | listed | SURPRISE | ended (UTC) |
|---|---|---|---|---|---|---|
| the 84 anchor files + 28 test files landed 244fa84ef..5e63f2603 (`q8/files-run.txt`: 110) | 110 / 1,250 | 151 | 151 | 0 | **0** | 04:45:23 |
| `tests/lint` whole | 225 / 3,374 | 3 | 0 | 3 (the line's three: `proseComposed` A0b, `proseCorpusBytes` RAW and GZIP) | **0** | 05:04:20 |
| `metropolisTailedRoll` alone (`--maxWorkers=1`) | 1 / 5 | 0 | | | | 05:07:42 |
| `espionageDormancyFence` FENCE 1 alone | 1 / 2 | 1 | 0 | 1 (row 30, "stored fingerprint": a wrong result, not a timeout) | 0 | 05:08:54 |

## NO SURPRISE. THE CENSUS ROWS NOW GONE: 2 (153 = 151 red + 2 gone)
- `tests/generators/seat/seatHolderLines.test.js` U6 (2) u6t-city-4 (BORN ANCHOR, JOIN): GONE AS PREDICTED (FLIP-PLAN section 5,
  Q3): VACANT's mock of `fortuneLaw.js` keeps fortune dark by default, so the arm is the seat law alone. NO DIFF IS OWED for it.
- `tests/domain/dailyLifeNoPeople.test.js` "every slot text equals the pre-change text …" (STORED PIN, JOIN; the door row of
  `tests/fixtures/daily-life-no-people-before.json`): GONE BY THE DAILY LIFE LANDING: DAILY-3 B3 E1 to E3 moved every slot by
  design and emptied the before/after arm (asserted: "no slot left unmoved"); its owner-versus-public parity arm (masked in
  the census) is now read, GREEN, lit. THAT DOOR IS NOT A COMMIT OF THE FLIP: the doors are the goal hashes (6) and the page
  census (1).
- Every one of the 28 landed test files is green lit but for census rows (none of them is new to the census's list).

## THE TWO LONE MEASURES (the chair's 04:17 ruling: raise if lone lit x 1.84 passes nine tenths of the budget)
| test | lone lit | x 1.84 | 9/10 of its budget | ruling's result |
|---|---|---|---|---|
| `metropolisTailedRoll` "400 metropolis seeds: p90 above 6…" | 189.4 s | 348.4 s | 270 s (300_000) | PASSES: RAISED in commit 0 (by the arithmetic, above its 300 s budget itself on a runner) |
| `espionageDormancyFence` FENCE 1 "THE DRIVEN GOLDEN: 360 settlements …" | 62.9 s (red, listed: its hash moved) | 115.8 s | 108 s (120_000) | PASSES: RAISED in commit 0; measured while it FAILS on its listed row (the corpus is hashed whole either way) |
The lone metropolis time (189 s) is ABOVE the census's three-worker figure (171 s): the census figures were not high for it.
The budgets proposed: `metropolisTailedRoll` 600_000, `espionageDormancyFence` FENCE 1 240_000 (twice the runner's figure,
rounded up), each with this measure in its comment. The other ten of section B: not measured alone (the chair's ruling: left
unless the trial shows one; none was in this trial's set).

## WHAT THIS CHANGES IN THE PLAN (provisional, re-read on the tip of "BUILD THE FLIP")
- The doors: TWO (goal hashes 6 rows; page census 1). The hand anchors: 131 less U6 (2) = 130 (JOIN 77 + 3).
- `close-5/CONFIGS.diff` stands for `seatChainHolder` and `dualHatPoliticalMass` (both still red lit here, as the census has them).
- Commit 0: 14 tests on the default + the two raised above = 16 budgets in 15 files.
