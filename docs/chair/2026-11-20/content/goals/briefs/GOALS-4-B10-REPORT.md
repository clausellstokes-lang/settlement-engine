# GOALS-4 · builder 10 · report: STOPPED at two walkers. The lines, pins and measures are done; tests/lint is not green.

The branch is `lane/goals-4-2026-11-20-b10` (base d8b174237). Its tip is the commit that adds this file; the last code commit is ed62f9937. Commits: 8942933f2 (red arm), c1ca6e653 (the 380 lines and the cell pins), 32e010e1a ((t), (u) and the fixture), 568db465f (the goal-test pins), 81205eda8 (measures), 36215e511 (arm folded into one test), 96798b674 (lighting census), ed62f9937 (lint fix).

**Red at the base:** the arm finds 380 of 380 lines missing (4 failed, 26 passed). **Green at the tip:** goal suites 279 of 280. The one red is A1, which was already red at the base. typecheck 167/167, domain:strict 1113/1113, lint 0 errors, wiring census verified. **tests/lint WHOLE: 3 failed of 3,271.** Logs are in the session scratch `logs/`.

**Measure at 150 a size, base → build:** identical 0→0, refusal 0→0, mirror 180→0, template>2 72→42.

**Cross-town figure:** a second city repeats 12.0 · 11.9% (projection 12.0 · 12.1; base 37.0 · 36.2). A metropolis repeats 17.5 · 17.6% (projection 17.4 · 17.5; base 47.4 · 47.5).

**Cost:** 13,746 of 17,992 goals change text, the same as builder 9's figure. 16 of them are in cells with no new line.

**Two-tree proof:** goal changes only, and 0 differences outside `npcs[].goal`. Golden: 0 documents unchanged, 22,926 strings changed, 59 non-string. Census: 44 documents unchanged, 38,447 strings changed, 348 non-string. Every non-string difference is a goal intent target going null↔object.

**Pins moved:** EXPECTED_TOTALS 528→908; (t) 4→the new cell counts; (u) fixture d3937c3f8→d8b174237; goalsNoRepeatedWording (c)–(q); bar8 hamlet-8→48; the charter guard line; lighting census titles 31,257→31,260.

**Stored figures, not re-recorded (signed doors):** A1 7c466b88→3756a39f; golden master 525 of 525 rows change.

**Not done (STOP):** presumptionClasses names 6 new lines with no declaration: 2 ease, 1 office, 3 threat. Curing them needs a declaration or a rewording, and both are forbidden. writerReach's shapesDigest is 7350e7ff→fd3443e1, which fails 2 tests. Neither was re-recorded.
