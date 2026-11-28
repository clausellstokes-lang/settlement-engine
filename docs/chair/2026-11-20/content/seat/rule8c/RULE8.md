# RULE 8 AT THE "SEAT-B" TIP (SEAT-10; the chair's E90 as amended)

Written 2026-11-22T16:16:44Z (`date -u`). The tip: `c61571627` (U6 + U7 + the line at point 98, `c110dd85b`). Shard 1 ran at `c9e9dad2a` and shard 2 at `31bf000aa`; both have the same `src/` and `tests/` as `c61571627` (docs only after it). RED-AT-LINE was read fresh at the chair's `be76b9be9` (63 rows).

- **(f) The build:** see `figures.txt`. It is clean; VERIFY_DIST is 61/66, and the five reds are the build rows, red on the line.
- **The set: 699 files** (`files.txt`; why each is in: `files-why.tsv`). The lane's changed files are `src.txt`.
  - (a) `tests/lint` whole: 223.
  - (b) the lane's own: 17.
  - (c) files naming one of the ten changed files or their exported symbols: 228 more. A file whose only hit is `generateSettlementPipeline` is out (824; the dark proof is equal).
  - (d) the walkers `dossierPhoneFloorAllViews`, `publicProseEquality`, `publicProseVeilInvariance`, plus eleven tonight-sheet and Power-tab tests.
  - (e) `tests/copy`, `tests/store`, `tests/architecture`, `tests/docs` whole: 218.
- **The run:** two shards, `--maxWorkers=2`, one at a time, from 15:11:27Z to 16:15:50Z.
- **The result:** 9,648 tests; **18 failed, all 18 on RED-AT-LINE by name** (`reds-by-name.tsv`).
- **`tests/lint` whole:** 223 files, 3,364 tests, 3 red: the line's own `proseCorpusBytes` RAW and GZIP, and `proseComposed` A0b.
