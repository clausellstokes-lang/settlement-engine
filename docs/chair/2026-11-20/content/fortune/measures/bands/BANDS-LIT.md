# BANDS-LIT: the lit re-measure at the merged tip, the visitor's pool, three states (FORTUNE-6, read-only, 2026-11-22)

FORTUNE-6's unit 4 ("THE LIT RE-MEASURE on a visitor's pool at the merged tip (the bands' table, three states) for the
record"). The tree is `5341be785`: the lane tip a157bd930 plus U5b, which is prose only and changes no score. The method is
`BANDS.md` (FORTUNE-4) without its state D, because LASTING is not built.

- **Band:** `powerStructure.publicLegitimacy.label`, with the cuts in `src/data/bandLadders.js :: LEGITIMACY_CUTS`.
- **Calm:** `!t.stress`.
- **Pool:** `measure-lit.mjs :: visitorJob` (origin/lane/seat-6-2026-11-20), copied into `lit-run.mjs` here. Seeds are
  `visitor-<size>-0..149` across six sizes, 900 births a state, with the store's content runtime at rest. The birth is
  `generateSettlementPipeline({ ...birthConfig(config), ...FORCE }, null, { seed, ...runtime })`.

**States:**
- **A (dark, the control):** tree 5341be785, no marker.
- **B (lit, no merit):** a scratch copy of 5341be785, never committed, with the single plant
  `fortuneMerits.js :: meritsOf` returning `[]`. `diff -r` against the tree shows that one line only. Run with
  `_fortuneLawVersion: 2` after `birthConfig`.
- **C (lit as built, the headline):** tree 5341be785 with `_fortuneLawVersion: 2` after `birthConfig`.

**EXECUTED** (`lit-run.mjs` and `lit-report.mjs` beside this file, through `scripts/gate-mutex.sh`, 02:20 to 02:28 UTC):
- Each state had 900 births and 0 errors. Every record carried `tier === size` and `_randomizePriorities: true`. The
  stored law was as forced: A null, B 2, C 2.
- **The tables are byte-identical to `BANDS.md`'s states A, B and C** (FORTUNE-4, trees 6011487af and d70401690): an md5
  over each state's twelve size rows matches. Nothing landed since FORTUNE-4 has moved a band on this pool, and nothing
  since U5a's merit.
- By place:
  - A vs C: label differs on 482 of 900, score on 863, calm on 0.
  - B vs C: label differs on 27, score on 33, calm on 0.
  - In C, 33 places carry merits > 0. Their base score (C's score minus the merit points) equals B's score on all 900.
  - Newly Endorsed, C vs B: 11. Newly Approved: 16. Both are as BANDS.md recorded.

**PLAUSIBLE:**
- That this pool is the live store's birth for a visitor. This is inherited from measure-lit.mjs; it is not re-derived here.

## State A: DARK (no marker; the control)

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

## State B: LIT, NO MERIT (plant: `meritsOf` returns [])

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

## State C: LIT AS BUILT (`_fortuneLawVersion: 2`; the headline)

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
