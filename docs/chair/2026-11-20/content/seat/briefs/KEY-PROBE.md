# KEY-PROBE: which keys law 2 writes at birth that law 1 does not, and which of them a reader reads (measure only). Builder BKP.

Written 2026-11-21T23:26:18Z by SEAT-10, on the seventh chair's open question (SEAT-9 hand-back §0) and the eighth chair's word of 23:24Z (unit 2, at the present tip).

## THE QUESTION

Does law 2 write a key that a reader reads, and that `observedShapeReaders` cannot see written?

That walker's corpus (`scripts/lib/observed-shape-corpus.mjs :: buildObservedCorpus`) births through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })` directly, with configs that carry no `_seatLawVersion`. So it only ever sees law 1, and it will still see only law 1 after the flip (the dial is read in `densityCreateBoundary.js :: birthConfig`, which the corpus never calls).

The precedent: the fortune lane met the same question and was ruled route (B), one explained-writer row (`scripts/check-observed-shape-readers.mjs :: EXPLAINED_WRITER_EXEMPTIONS`) added by the migration door. YOU ADD NO ROW: you measure.

## WHERE AND WHAT YOU MAY TOUCH

- **Tree:** you work in `/home/user/settlement-engine`, read-only at HEAD `f82c2a183`. You write NOTHING under `src/`, `tests/`, `scripts/` or the repository root.
- **Git:** you make NO commit, NO stage, NO push and NO git write of any kind. The integrator commits your outputs later.
- **Files you own:** a new `docs/chair/2026-11-20/content/seat/keyprobe/` holding `probe.mjs` (the instrument), `keyprobe.md` (the report) and `keyprobe.json` (the per-path table). Nothing else.
- **What you may read:**
  - `src/domain/seat/seatLaw.js` (the key `_seatLawVersion`, `resolveSeatLawVersion`);
  - `src/domain/seat/seatCircumstances.js :: SEAT_CONTEST_LIT`;
  - `scripts/lib/observed-shape-corpus.mjs` (the corpus, `CONFIGS`, `SEEDS`, and how it walks paths: `collectPaths`, `shapeNameOf`);
  - `scripts/check-observed-shape-readers.mjs`, `scripts/lib/legacy-reader-shape-scan.mjs` and `tests/lint/observedShapeReaders.walker.test.js` (how the live heuristic scan is driven, and what a finding's identity `<key> on <shape>` is);
  - the observed-shape baseline file that walker reads.

  Read only what you need of each.

## THE MEASURE

- **(1) Births, in pairs.** Take the corpus's own 16 births (`CONFIGS × SEEDS`), plus 150 more: `{ settType, culture: 'germanic' }` for each of thorp, hamlet, village, town, city and metropolis, seeds `kp-<size>-0..24`.
  - For each pair, birth the same config and seed twice: once with `_seatLawVersion: 1` and once with `_seatLawVersion: 2`, through `generateSettlementPipeline` exactly as the corpus calls it.
- **(2) STREAMED.** For each birth, reduce it to its set of key paths: array indices become `[]`, and dynamic maps are folded as the corpus folds them, or say how you folded them. Diff the two sets, keep only the difference, and drop both records before the next pair.
  - Accumulate per path: in how many pairs it appears in law 2 only, or in law 1 only, with one example seed.
  - One node process. `--max-old-space-size=4096` or less. No vitest, no worker pool.
  - SEAT-9's probe held every path of every record and was killed for memory: do not repeat that.
- **(3) Arms.** Arm A uses the dial as it stands (`SEAT_CONTEST_LIT` false). Arm B uses the SHIPPED state: the contest lit.
  - For arm B, build a scratch copy outside the repository (`git archive HEAD | tar -x -C <scratch dir>`, `node_modules` symlinked) with exactly one edit, `SEAT_CONTEST_LIT = true`. Quote its diff. Never commit it.
  - Under law 1 the dial is not read (`lit = law && SEAT_CONTEST_LIT`), so arm B's law-1 side should equal arm A's: check it on 10 pairs and say so.
- **(4) The readers.** For every path that law 2 writes and law 1 never does (the leaf key and its shape name, as `shapeNameOf` would name it), answer three things:
  - (a) Does the live heuristic scan (`scanLegacyReaders`, driven as the walker drives it) report a READ of `<key> on <shape>` anywhere in `src`? Give the file and the symbol.
  - (b) Is that identity a current finding (reader with no writer) in the walker's baseline, or exempted?
  - (c) Does the law-1 corpus see that key written on that shape anywhere at all? Another writer under law 1 would make it visible.

  A path that is new under law 2, has a reader, and has no writer the corpus sees is THE ANSWER. List every one.
- **(5) The reverse.** Paths law 1 writes and law 2 never does: list them with their counts. No reader check is needed unless one has a reader.

## LIMITS

- **Wall time:** under 40 minutes.
- **Runs:** one heavy process at a time, through `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- node ...`, its output to a file, never read through a pipe.
- **Environment:** never with a `GIT_*` variable in the environment.
- **If the gate refuses or the probe OOMs:** stop and report. Do not widen the heap past 6 GB.
- **If your own permission check refuses any action:** that refusal stands. Report it in one line and try nothing else to the same end.

## OUTPUT

`keyprobe.md` holds:
- the totals: pairs run, by arm;
- the table of law-2-only paths: path, shape, pairs, reader (file :: symbol) yes or no, baseline finding yes or no, a corpus writer yes or no;
- the reverse list;
- THE ONE-LINE ANSWER: the paths law 2 writes that law 1 does not, and which of them a reader reads unseen.

Label each claim CONFIRMED (run) or PLAUSIBLE (read).

Your final message: at most 200 words, the one-line answer first.
