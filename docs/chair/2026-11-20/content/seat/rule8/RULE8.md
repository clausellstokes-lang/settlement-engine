# RULE 8 AT THE LANE'S TIP (SEAT-10, unit 4)

Written 2026-11-22T07:15:09Z (`date -u`). The lane stands on the line `f5295e425` (the chair's second base `e8bc160f8`). The RED-AT-LINE list was read fresh at the chair's `0ac15c2e0` (86 rows).

## (a) THE BUILD (at `08b0ba7d2`; `src/` is unchanged since, except tests)

See `figures.txt`.
- **The build:** clean (04:27:23Z).
- **VERIFY_DIST** on `vendorPdfLazy` and `generationWorkerLazy`: 61 of 66. The 5 reds are the five build rows, which are red on the line itself (LINE-NOW).

## (b) THE TESTS (the chair's ruling (A) of 04:29Z)

- **The set:** 1,387 files (`files.txt`):
  - `tests/generators`, `tests/data`, `tests/domain/seat`, `tests/domain/facts`, `tests/domain/worldPulse`, `tests/lint` and `tests/build`, each whole;
  - plus every test file anywhere under `tests/` that names one of the 16 `src` files the lane changed (`git diff --name-only f5295e425...HEAD -- src`).
- **The runs:** two shards, `--maxWorkers=2`, one at a time through the mutex, JSON reporter.
  - Shard 1 ran at `a94f7d097`, 04:34:08Z to 05:36:42Z.
  - Shard 2 ran at `b6bb6bdcd`, 05:36:51Z to 07:14:28Z. The two commits' `src/` and `tests/` are identical (docs only between them).
- **The result:** 13,913 tests; **61 failed, every one on RED-AT-LINE by name** (`reds-by-name.tsv`).
  - One title has drifted: the list's `landingFixtureFreshness` "the script's own --check arm agrees" now runs as "…agrees, and is wired to say how to fix it".
  - That fixture is stale AT THE LINE `f5295e425` too. A fresh `--emit` at the line and at the lane are byte-equal, so the lane does not move the landing town (CONFIRMED).
- **`tests/lint` whole (COMMON-EIGHTH 11):** 223 files, 3,362 tests, 3 red, all on the list. They are `proseCorpusBytes` RAW and GZIP, and `proseComposed` A0b: the owner's size signings from the state sentences, the line's own three.
- **The lane's own files, green:** `tests/domain/seat` whole, `seatLawSavedTown` 6/6, `seatBandFold`, `roleCategory`, and `densityCreateBoundary.walker` and `writerReach.walker` in `tests/lint`.

| dir | files | tests | failed (files) |
|---|---|---|---|
| tests/build | 68 | 612 | 11 (5) |
| tests/data | 86 | 628 | 1 (1) |
| tests/domain | 347 | 4,440 | 26 (5) |
| tests/generators | 444 | 3,204 | 14 (11) |
| tests/lint | 223 | 3,362 | 3 (2) |
| tests/property | 6 | 65 | 5 (4) |
| tests/ui | 18 | 202 | 1 (1) |
| other (components, pdf, joins, lib, store, security, foundry, simulation, architecture, copy, generation) | 195 | 1,400 | 0 |
