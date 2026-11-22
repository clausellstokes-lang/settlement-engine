# BANDS-BOTH: the lit re-measure with BOTH merits (FORTUNE-7 unit 3; read-only; written 2026-11-22 12:36 UTC by `date -u`)

Tree 142749913 (U7, U7c and U7b merged; the writer-reach re-freeze). Method: `BANDS-LIT.md`'s (`lit-run.mjs`, `lit-report.mjs`; the
visitor's pool, seeds `visitor-<size>-0..149`, 900 births a state, through `scripts/gate-mutex.sh`), with FOUR states:
- **A** dark (the tree, no marker); **B** lit, no merits (a `git archive` copy, the one plant `meritsOf` returning `[]`);
- **C** lit, the first merit only (a copy, the one plant: the `hasLasted` push removed); **D** lit as built (the tree).
Each plant is one line by `diff -r`. Every state: 900 births, 0 errors.

**EXECUTED**
- **All four states' tables are IDENTICAL to BANDS.md's A, B, C and D** (FORTUNE-4's plant of LASTING): `lit-compare.mjs`,
  md5 over each state's twelve size rows: A d3f1ead4f480, B bbde1545b6d0, C 84f89860e73c, D 51897db01e3a. What was
  built is what FORTUNE-4 planted.
- Beside E32's figures, every one MET: the Endorsed count by size, C 4, 13, 8, 21, 22, 22 and D 8, 16, 10, 22, 26, 23;
  newly Endorsed against no merits 11 (C) and 26 (D); newly Approved 16 and 28; places merited 33 and 76; the base
  score (score less merits) equals B's on 900 of 900 in C and in D. Not one figure differs.
- By place: A vs B label 480, score 861; B vs C label 27, score 33; B vs D label 54, score 76; calm 0 in every pair.

**PLAUSIBLE:** that this pool is the live store's birth for a visitor (inherited from measure-lit.mjs).

## State A (force {}; 900 births, 0 errors)

**All places (of 150)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 150 | 2 (1.3%) | 8 (5.3%) | 46 (30.7%) | 39 (26%) | 55 (36.7%) |
| hamlet | 150 | 2 (1.3%) | 14 (9.3%) | 38 (25.3%) | 49 (32.7%) | 47 (31.3%) |
| village | 150 | 3 (2%) | 7 (4.7%) | 31 (20.7%) | 47 (31.3%) | 62 (41.3%) |
| town | 150 | 23 (15.3%) | 43 (28.7%) | 46 (30.7%) | 21 (14%) | 17 (11.3%) |
| city | 150 | 63 (42%) | 48 (32%) | 26 (17.3%) | 8 (5.3%) | 5 (3.3%) |
| metropolis | 150 | 58 (38.7%) | 54 (36%) | 26 (17.3%) | 8 (5.3%) | 4 (2.7%) |

**Calm places only (`!t.stress`)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 102 | 2 (2%) | 8 (7.8%) | 44 (43.1%) | 36 (35.3%) | 12 (11.8%) |
| hamlet | 99 | 2 (2%) | 14 (14.1%) | 34 (34.3%) | 45 (45.5%) | 4 (4%) |
| village | 97 | 3 (3.1%) | 7 (7.2%) | 29 (29.9%) | 42 (43.3%) | 16 (16.5%) |
| town | 109 | 23 (21.1%) | 40 (36.7%) | 35 (32.1%) | 9 (8.3%) | 2 (1.8%) |
| city | 110 | 63 (57.3%) | 39 (35.5%) | 8 (7.3%) | 0 (0%) | 0 (0%) |
| metropolis | 105 | 56 (53.3%) | 48 (45.7%) | 0 (0%) | 1 (1%) | 0 (0%) |

## State B (force {"_fortuneLawVersion":2}; 900 births, 0 errors)

**All places (of 150)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 150 | 3 (2%) | 29 (19.3%) | 32 (21.3%) | 42 (28%) | 44 (29.3%) |
| hamlet | 150 | 10 (6.7%) | 42 (28%) | 37 (24.7%) | 32 (21.3%) | 29 (19.3%) |
| village | 150 | 7 (4.7%) | 32 (21.3%) | 50 (33.3%) | 32 (21.3%) | 29 (19.3%) |
| town | 150 | 20 (13.3%) | 38 (25.3%) | 53 (35.3%) | 20 (13.3%) | 19 (12.7%) |
| city | 150 | 19 (12.7%) | 47 (31.3%) | 42 (28%) | 23 (15.3%) | 19 (12.7%) |
| metropolis | 150 | 20 (13.3%) | 25 (16.7%) | 50 (33.3%) | 36 (24%) | 19 (12.7%) |

**Calm places only (`!t.stress`)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 102 | 3 (2.9%) | 29 (28.4%) | 29 (28.4%) | 34 (33.3%) | 7 (6.9%) |
| hamlet | 99 | 10 (10.1%) | 39 (39.4%) | 30 (30.3%) | 20 (20.2%) | 0 (0%) |
| village | 97 | 7 (7.2%) | 30 (30.9%) | 39 (40.2%) | 20 (20.6%) | 1 (1%) |
| town | 109 | 20 (18.3%) | 36 (33%) | 43 (39.4%) | 9 (8.3%) | 1 (0.9%) |
| city | 110 | 19 (17.3%) | 47 (42.7%) | 33 (30%) | 11 (10%) | 0 (0%) |
| metropolis | 105 | 18 (17.1%) | 25 (23.8%) | 42 (40%) | 20 (19%) | 0 (0%) |

## State C (force {"_fortuneLawVersion":2}; 900 births, 0 errors)

**All places (of 150)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 150 | 4 (2.7%) | 28 (18.7%) | 32 (21.3%) | 42 (28%) | 44 (29.3%) |
| hamlet | 150 | 13 (8.7%) | 43 (28.7%) | 33 (22%) | 32 (21.3%) | 29 (19.3%) |
| village | 150 | 8 (5.3%) | 36 (24%) | 45 (30%) | 32 (21.3%) | 29 (19.3%) |
| town | 150 | 21 (14%) | 40 (26.7%) | 50 (33.3%) | 20 (13.3%) | 19 (12.7%) |
| city | 150 | 22 (14.7%) | 47 (31.3%) | 39 (26%) | 23 (15.3%) | 19 (12.7%) |
| metropolis | 150 | 22 (14.7%) | 24 (16%) | 49 (32.7%) | 36 (24%) | 19 (12.7%) |

**Calm places only (`!t.stress`)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 102 | 4 (3.9%) | 28 (27.5%) | 29 (28.4%) | 34 (33.3%) | 7 (6.9%) |
| hamlet | 99 | 13 (13.1%) | 40 (40.4%) | 26 (26.3%) | 20 (20.2%) | 0 (0%) |
| village | 97 | 8 (8.2%) | 34 (35.1%) | 34 (35.1%) | 20 (20.6%) | 1 (1%) |
| town | 109 | 21 (19.3%) | 38 (34.9%) | 40 (36.7%) | 9 (8.3%) | 1 (0.9%) |
| city | 110 | 22 (20%) | 46 (41.8%) | 31 (28.2%) | 11 (10%) | 0 (0%) |
| metropolis | 105 | 20 (19%) | 24 (22.9%) | 41 (39%) | 20 (19%) | 0 (0%) |

## Differences by place

- A vs B: label 480, score 861, calm 0
- B vs C: label 27, score 33, calm 0
- A vs C: label 482, score 863, calm 0
- C places with merits > 0: 33; base score (C score − merits) differs from B on 0
- newly Endorsed C vs B: 11; newly Approved: 16
## State D (force {"_fortuneLawVersion":2}; 900 births, 0 errors)

**All places (of 150)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 150 | 8 (5.3%) | 27 (18%) | 29 (19.3%) | 42 (28%) | 44 (29.3%) |
| hamlet | 150 | 16 (10.7%) | 42 (28%) | 31 (20.7%) | 32 (21.3%) | 29 (19.3%) |
| village | 150 | 10 (6.7%) | 37 (24.7%) | 42 (28%) | 32 (21.3%) | 29 (19.3%) |
| town | 150 | 22 (14.7%) | 41 (27.3%) | 48 (32%) | 20 (13.3%) | 19 (12.7%) |
| city | 150 | 26 (17.3%) | 44 (29.3%) | 38 (25.3%) | 23 (15.3%) | 19 (12.7%) |
| metropolis | 150 | 23 (15.3%) | 25 (16.7%) | 47 (31.3%) | 36 (24%) | 19 (12.7%) |

**Calm places only (`!t.stress`)**

| size | n | Endorsed | Approved | Tolerated | Contested | Legitimacy Crisis |
|---|---|---|---|---|---|---|
| thorp | 102 | 8 (7.8%) | 27 (26.5%) | 26 (25.5%) | 34 (33.3%) | 7 (6.9%) |
| hamlet | 99 | 16 (16.2%) | 39 (39.4%) | 24 (24.2%) | 20 (20.2%) | 0 (0%) |
| village | 97 | 10 (10.3%) | 35 (36.1%) | 31 (32%) | 20 (20.6%) | 1 (1%) |
| town | 109 | 22 (20.2%) | 39 (35.8%) | 38 (34.9%) | 9 (8.3%) | 1 (0.9%) |
| city | 110 | 26 (23.6%) | 43 (39.1%) | 30 (27.3%) | 11 (10%) | 0 (0%) |
| metropolis | 105 | 21 (20%) | 25 (23.8%) | 39 (37.1%) | 20 (19%) | 0 (0%) |

