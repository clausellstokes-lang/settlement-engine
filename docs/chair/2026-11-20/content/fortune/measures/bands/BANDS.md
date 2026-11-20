# BANDS: public legitimacy by size, the visitor's births, four states (FORTUNE-4 measure, read-only, 2026-11-20)

The owner's words this measures: "No ruler is born beloved at untouched settings once fortune is switched on."

**Band** = `settlement.powerStructure.publicLegitimacy.label`. Read: `src/data/bandLadders.js :: LEGITIMACY_CUTS = { endorsed: 75, approved: 60, tolerated: 45, contested: 30 }`, labels Endorsed / Approved / Tolerated / Contested / Legitimacy Crisis (score >= cut); `factionDynamics.js :: legitimacyBandFor` delegates to `legitimacyBandOf`.

**Pool** = `measure-lit.mjs :: visitorJob` (origin/lane/seat-6-2026-11-20), copied verbatim: `{ ...DEFAULT_CONFIG, settType, four toggle bags {}, _randomizePriorities: true }`, the content runtime at rest; birth `generateSettlementPipeline({ ...birthConfig(config), ...FORCE }, null, { seed, ...runtime })`. Seeds `visitor-<size>-0..149`, six sizes, 900 births a state, 0 errors in every state; every record carried `_randomizePriorities: true`, `tier === size`, and the fortune marker as forced (A null, B/C/D 2).

**Calm** = `!t.stress` (the definition in measure-lit.mjs line 198 and the fortune instruments `measure.mjs` / `u5-measure.mjs`).

**States.** A = tree 6011487af, no marker. B = tree 6011487af, `_fortuneLawVersion: 2` after birthConfig. C = tree d70401690 (lane/fortune-3-2026-11-20-u5a-wip), marker 2; one merit "weathered" (`fortuneMerits.js`: a catastrophe-grade `historicalEvents[]` entry within `weatheredWithinYears: 40`, its kind naming no tension of today, no unresolved legacy note; gates: base score >= Tolerated (45), no ruler-trouble tension; `meritPoints: 10` per merit, upward only; Endorsed needs `endorsedMinReasons: 2` reasons). D = PLANT in a scratch copy of tree C (never committed): `MERIT_NAMES = ['weathered', 'lasting']`, `lasting` = `history.age >= p90(size)`, counted by the same `meritsOf` (same gates), same `meritedLegitimacy` (same points, two-reason guard as built: two merits count as two reasons). Plant diff: 14 lines in `tD/src/domain/fortune/fortuneMerits.js` (`plant.diff`). Quick and clean, so D was run.

**p90 of `history.age`** (nearest rank, index ceil(0.9·150)−1, state B's own 150 births a size; B's ages are identical to C's): thorp 269 · hamlet 108 · village 225 · town 276 · city 441 · metropolis 731 (16 or 17 places a size at or above).

**EXECUTED**
- All four tables below (900 births each), plus tree C under law 1: **identical to state A on all 900 places** (0 label, score, calm or age differences), so state C's law-1 path gives exactly state A's bands.
- C and D versus B: 0 of 900 places differ in base score (score − merit points), calm or age; the merits move only the standing.
- The two-reason guard held no merited place below Endorsed in C or D (0); places newly Endorsed versus B: C 11, D 26; newly Approved: C 16, D 28.
- `history.age` on a shared read: `toPublicSafe(record)` (default, not full) on visitor-thorp-0 kept `history.age` (183 = owner's 183, and `history.founding.age` 183), in each tree run. By READ: `history` is in `PUBLIC_TOPLEVEL_KEYS`; `age` matches nothing in `PRIVATE_KEY_RE`; the veil (`galleryVeil.js`) projects history only as event/tension cards (`historicalEvents`, `eventsTimeline`, `currentTensions`) and names no `age`/`founding` field. So the LASTING input is served on every shared read, EXECUTED for the default share on one record; that no veil setting can hide it is PLAUSIBLE (read only, not exercised with veiled cards).

**PLAUSIBLE (not executed)**
- That this pool equals the live store's birth for a visitor: inherited from measure-lit.mjs's own mirroring of `generateSettlementAction`; not re-derived here.
- That the plant matches how the lane would build LASTING (size read from `settlement.tier ?? config.settType`; p90 hard-coded from B).

Files (scratch): `run.mjs` (the runner), `plant.mjs`, `plant.diff`, `report.mjs`, `A.jsonl` `B.jsonl` `C.jsonl` `C1.jsonl` (C under law 1) `D.jsonl`, `p90.txt`, `extra.txt`.

## State A: TODAY'S LAW (tree 6011487af, no marker)

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

## State B: FORTUNE LIT, NO MERITS (tree 6011487af, `_fortuneLawVersion: 2`)

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

## State C: FORTUNE LIT, U5a's ONE MERIT (tree d70401690, `_fortuneLawVersion: 2`)

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

## State D: PLANT: C + LASTING (scratch copy of tree C, `_fortuneLawVersion: 2`)

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

## Merits received, state C (of 150; "received" = `breakdown.merits > 0`; "counted" = `meritsOf` non-empty)

| size | counted | received (points added) | counted weathered | band moved vs B | calm: received / calm n |
|---|---|---|---|---|---|
| thorp | 1 | 1 | 1 | 1 | 1 / 102 |
| hamlet | 8 | 8 | 8 | 7 | 8 / 99 |
| village | 8 | 8 | 8 | 6 | 8 / 97 |
| town | 6 | 6 | 6 | 4 | 6 / 109 |
| city | 6 | 6 | 6 | 6 | 5 / 110 |
| metropolis | 4 | 4 | 4 | 3 | 4 / 105 |

## Merits received, state D (of 150; "received" = `breakdown.merits > 0`; "counted" = `meritsOf` non-empty)

| size | counted | received (points added) | counted weathered | counted lasting | counted both | band moved vs B | calm: received / calm n |
|---|---|---|---|---|---|---|---|
| thorp | 9 | 9 | 1 | 8 | 0 | 8 | 9 / 102 |
| hamlet | 14 | 14 | 8 | 7 | 1 | 12 | 14 / 99 |
| village | 14 | 14 | 8 | 7 | 1 | 10 | 13 / 97 |
| town | 14 | 14 | 6 | 8 | 0 | 7 | 13 / 109 |
| city | 13 | 13 | 6 | 8 | 1 | 11 | 12 / 110 |
| metropolis | 12 | 12 | 4 | 8 | 0 | 6 | 12 / 105 |

Check C vs B: places whose base score (score − merit points), calm or age differ from B: 0 of 900.
Check D vs B: places whose base score (score − merit points), calm or age differ from B: 0 of 900.

## Top band by size

- **A** (all): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 1.3% / 6.7% · hamlet 1.3% / 10.7% · village 2% / 6.7% · town 15.3% / 44% · city 42% / 74% · metropolis 38.7% / 74.7%
- **A** (calm): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 2% / 9.8% · hamlet 2% / 16.2% · village 3.1% / 10.3% · town 21.1% / 57.8% · city 57.3% / 92.7% · metropolis 53.3% / 99%
- **B** (all): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 2% / 21.3% · hamlet 6.7% / 34.7% · village 4.7% / 26% · town 13.3% / 38.7% · city 12.7% / 44% · metropolis 13.3% / 30%
- **B** (calm): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 2.9% / 31.4% · hamlet 10.1% / 49.5% · village 7.2% / 38.1% · town 18.3% / 51.4% · city 17.3% / 60% · metropolis 17.1% / 41%
- **C** (all): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 2.7% / 21.3% · hamlet 8.7% / 37.3% · village 5.3% / 29.3% · town 14% / 40.7% · city 14.7% / 46% · metropolis 14.7% / 30.7%
- **C** (calm): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 3.9% / 31.4% · hamlet 13.1% / 53.5% · village 8.2% / 43.3% · town 19.3% / 54.1% · city 20% / 61.8% · metropolis 19% / 41.9%
- **D** (all): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 5.3% / 23.3% · hamlet 10.7% / 38.7% · village 6.7% / 31.3% · town 14.7% / 42% · city 17.3% / 46.7% · metropolis 15.3% / 32%
- **D** (calm): top band (Endorsed) / top two (Endorsed+Approved) by size: thorp 7.8% / 34.3% · hamlet 16.2% / 55.6% · village 10.3% / 46.4% · town 20.2% / 56% · city 23.6% / 62.7% · metropolis 20% / 43.8%
