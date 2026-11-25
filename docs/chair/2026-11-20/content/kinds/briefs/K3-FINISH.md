# K3-FINISH — K3's REMAINING DOORS, AT POINT 113 (lane KINDS-2, unit 2; COMMON-RULES rule 9)

Seat: KINDS-2 (integrator, chair session_019yED1SUxGVHyjQnoqoFvQ8). You are its builder for this unit. YOU DO NOT
PUSH, never touch the main checkout `/home/user/settlement-engine`, never `--no-verify`.

WORKTREE: `cd /home/user/settlement-engine && git worktree add -b lane/kinds-2-2026-11-24-k3f ../kinds2-k3f lane/kinds-2-2026-11-24`
then `ln -s /home/user/settlement-engine/node_modules ../kinds2-k3f/node_modules`. Work and commit ONLY there, by explicit
paths. Every gated run: `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh <command…>` redirected to a log
under your scratch dir; the full log's path is the tail's second-last line; read logs by grep/tail, never print one whole.
Never read a gate through a pipe.

## WHERE THE TREE STANDS
The lane's tip `lane/kinds-2-2026-11-24` holds: the working line at point 113 (f03e9a868, the seat and fortune laws LIT)
merged in (0177b281a), and K3's predecessor work merged (7661fa2e4): the crime row B50 in
`src/domain/trouble/troubleLaw.js :: TROUBLE_WEIGHT_TUNING`, and the tuning register's two DRAFT rows. The two GENERATED
registers are at the LINE'S bytes and must be re-taken by their doors HERE (the predecessor's door output was taken on
an older tree and is void). Measured by the seat at 7661fa2e4 (tests/domain/trouble + four lint walkers): 5 red, these:
- `tests/lint/tuningRegister.walker.test.js`: "no file carries fewer bare decimals than the inventory banked",
  "the measured tree matches the committed inventory exactly";
- `tests/lint/proseWiringCensus.walker.test.js`: "the committed census is byte-identical to a fresh build, and the stamp
  is live", "⭐ THE DRY READ: both modes, and the one that writes is not among them";
- `tests/domain/trouble/troubleLawWiring.test.js` "1. CREATE (dark)…": NOT YOURS (unit 3 re-shapes it); leave it red.

## THE DOORS, EACH ITS OWN COMMIT WITH ITS BEFORE -> AFTER FIGURES IN THE MESSAGE
1. THE TUNING INVENTORY (`tests/lint/.tuning-inventory.json`). DOOR: `TUNING_INVENTORY_REFREEZE='KINDS-2 K3' TUNING_INVENTORY_NOTE='<note>' npx vitest run tests/lint/tuningRegister.walker.test.js`
   (exits non-zero by design), then the ordinary run of that file GREEN is the receipt. The note names what moved: the
   trouble law's two tables (TROUBLE_WEIGHT_TUNING, DRAFT, the crime row B50; LAW_ONE_TROUBLE_BARS, law 1's 0.5 / 0.7
   moved from historyGenerator.js by K1, not changed) and historyGenerator.js's bare decimals banked lower. Check the
   register's `declaredGrowth` / DECLARED_GROWTH_CEILING (the LAW_ONE_TROUBLE_BARS homes[] note claims it is "held at
   14"): if the walker or the register disagrees with that figure on THIS tree, correct the NOTE's figure to the truth
   (a note, never a ceiling). A SHRINK-ONLY ceiling that would have to RISE is a STOP: report it, change nothing.
   Commit: `chore(registers): the tuning inventory re-taken by its own door at <sha> (KINDS-2 K3)`.
2. THE WIRING CENSUS (`docs/content/wiring-census.json`): its door is named in the header of
   `tests/lint/proseWiringCensus.walker.test.js` (read the header only). Run the door, then the walker's ordinary run
   GREEN. Say what moved (expect: the producer-index file count, and the stamp; ZERO rows). If any ROW moves, STOP and
   report it (the lane adds no prose).
3. THE LIGHTING CENSUS (`tests/lint/.lighting-census-baseline.json`): find its walker (`grep -l LIGHTING_CENSUS_REFREEZE tests/lint`);
   run it ordinarily first: if GREEN, nothing to do (say so); if red, run its door, then the ordinary run GREEN. Say
   files / titles before -> after.
4. THE MUTATION MANIFEST: run `tests/lint/mutationCoverageManifest.test.js` ordinarily. If a row cites
   `historyGenerator.js :: tensionByMemory`, re-address that citation to `src/generators/history/tensionByMemory.js` by
   the manifest's own rule (K1 moved the function verbatim). Likewise ONE comment in `src/data/historyData.js` if it
   cites the old home (a comment only). If green and no citation, say so.
4b. THE STALE COMMENT in `src/domain/density/densityCreateBoundary.js`'s HEADER ("four executed reads", item 4): it
   says the regeneration path takes `settlement.config || config`; the code (`src/store/settlementRegenAction.js`)
   reads `settlement.config || settlement._config || config`. Re-word that one sentence, keeping it true; nothing else in
   the file. Its own commit (`docs(kinds): ...`).
5. THE BOUNDARY WALKER `tests/lint/densityCreateBoundary.walker.test.js`: ordinary run, GREEN (it was green at 7661fa2e4).

## THEN THE SWEEP
`tests/lint` WHOLE (through the mutex, to a log) and `tests/domain/trouble/`. Every failing title by name, each matched
against `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv` (a row holds an `it`
title without its describe prefix: match by containment). Expected on the list: `proseCorpusBytes` RAW and GZIP,
`proseComposed` A0b. Any other red is reported (do not chase it); "1. CREATE (dark)" is expected and unit 3's.

## FILES YOU MAY READ
The four walkers' headers and the failing arms' bodies; the two registers by grep; `src/domain/trouble/troubleLaw.js`;
the boundary file's header; this brief. Nothing wider.

## REPORT (at most 250 words)
Your branch `lane/kinds-2-2026-11-24-k3f` and its commits; each register's before -> after; `tests/lint` whole
(files / tests, failing titles by name, on the list or not); any STOP.
