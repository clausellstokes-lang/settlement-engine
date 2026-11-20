# TAIL-CLOSE-WORKER-1 — hand-back: the generation worker's size ceiling re-recorded once (the chair's ruling WB1)

**For the owner, in plain words:**
1. The part of the app that generates towns in the browser (the generation worker) grew from about 2.0 to about 2.3 megabytes with this round's content. It loads only when a town is generated, not on the first paint.
2. Its size limit was raised to the measured size by the chair's ruling WB1, the same way the engine's was raised this morning.
3. If you veto this, the bytes have to be bought back before any merge.

## The seat

- Checkout: the doors' branch `lane/tail-close-doors-2026-11-15` at **73090ee9e**, the tip named in the brief, not a descendant.
- Branch: `lane/tail-close-worker-2026-11-15`, made from 73090ee9e.
- One file touched: `tests/build/generationWorkerLazy.test.js`, plus this hand-back.
- What was red: the arm "the generation worker bundle stays under its measured ceiling". The rehearsal measured 2,303,076 B against a ceiling of 2,008,268 B. 2,303,076 B is exactly the joined line's tip f8042b61a (stage 12 below). The doors' tip reads 202 B more.

## How it was measured

- Every stage got a fresh `npm run build` in its own scratch worktree (`git worktree add --detach`), outside the main checkout.
- `package-lock.json` is identical across all fifteen trees (checked with `git diff --quiet` pair by pair). So there was one `npm ci`, in the main checkout at the tip, and every scratch tree symlinks to its `node_modules`.
- Each figure is the byte size of `dist/assets/generation.worker-*.js`, the same file this test's arm reads.
- Every build exited 0, and every build's log went to its own file in the seat's scratchpad (not in the repository).

Each stage ends at the first-parent commit that closes one merge seat of `origin/lane/join-2026-11-14`. That is the commit just before the next seat's first `join(JOIN-n+1 · 1)` or `JOIN-n+1 point 1` merge. For JOIN-3 and JOIN-6 this is earlier than the last commit whose subject mentions them: later docs-only merges inside JOIN-5 and JOIN-7 cite them.

The range from the base to JOIN-1 also carries STYLE-2-MERGE points 42 to 49. That stage was +206,734 B, so it was split with one extra build at 976db5b19, the last commit before JOIN-1. That makes fifteen builds in all: the fourteen asked for, plus that split.

## The table

| # | stage (first-parent commit) | worker bundle (B) | rise (B) |
|---|---|---:|---:|
| 0 | base 7dc7757fa, the last re-record (STYLE-2-MERGE closing act 7) | 2,008,268 | — (reads the ceiling exactly) |
| 1a | 976db5b19, STYLE-2-MERGE points 42–49 (extra build, the split) | 2,079,131 | +70,863 |
| 1 | 216eeb41f, end of JOIN-1 | 2,215,002 | +135,871 (stage 1 in all: +206,734) |
| 2 | 7d12b40cb, end of JOIN-2 | 2,214,991 | −11 |
| 3 | b6a5f97ab, end of JOIN-3 | 2,214,991 | 0 |
| 4 | e5b421802, end of JOIN-4 | 2,226,673 | +11,682 |
| 5 | 48fedbe98, end of JOIN-5 | 2,230,882 | +4,209 |
| 6 | eb054d53f, end of JOIN-6 | 2,248,284 | +17,402 |
| 7 | 72c37436d, end of JOIN-7 | 2,300,337 | +52,053 |
| 8 | 1b5db4a77, end of JOIN-8 | 2,321,294 | +20,957 |
| 9 | ae50369d4, end of JOIN-9 | 2,304,615 | −16,679 |
| 10 | dc4bae117, end of JOIN-10 | 2,304,645 | +30 |
| 11 | ffdd541a0, end of JOIN-11 | 2,302,435 | −2,210 |
| 12 | f8042b61a, end of JOIN-12 (the joined line's tip) | 2,303,076 | +641 |
| 13 | 73090ee9e, the doors' tip (this seat's tip) | **2,303,278** | +202 |

**The sum closes exactly:**
2,008,268 + 70,863 + 135,871 − 11 + 0 + 11,682 + 4,209 + 17,402 + 52,053 + 20,957 − 16,679 + 30 − 2,210 + 641 + 202 = **2,303,278**.
The total rise is **+295,010 B**.

## The attribution

The lanes in each stage are named from that stage's merge subjects. Second and third landings of the same lane repeat across stages.

- **1a. STYLE-2-MERGE 42–49: +70,863.** COHERENCE-QUARREL, COHERENCE-PRESUME, VISIBLE-BUGS, POOL-GUARD, COHERENCE-POWERS, COHERENCE-AGREE, W2-A-LEAVES (with the agree-follow-up rider), W2-B-DECLARE, and the instrument lane.
- **1. JOIN-1: +135,871.** r2-code-a, r2-code-b, r3-code-c, r3-tabs, w2-write, w2-c-leaves, w2-fix-data, powers-follow-up, coherence-upkeep, agree-follow-up, and merge-15-point-49-wip.
- **2. JOIN-2: −11.** The second landings of those lanes.
- **3. JOIN-3: 0.** Tests and docs only.
- **4. JOIN-4: +11,682.** r3-code-c's second landing, join-surfaces, upkeep-monotone, join-nolane, and the r2 and w2 lanes again.
- **5. JOIN-5: +4,209.** r2-code-a's third landing, w2-write-side-13, exports-b1, exports-b3 and exports-b24, and join-nolane-2.
- **6. JOIN-6: +17,402.** The tail wave's first points: tail-services, tail-corpus-def, tail-corpus-eco, tail-crisis, tail-defecon, tail-defecon-c, tail-powers, tail-narrative, tail-ties, tail-houses, tail-display-econ and tail-display-civic.
- **7. JOIN-7: +52,053.** The tail lanes' second points, plus tail-titles, tail-exports-pdf, tail-exports-journal, tail-defecon-r, tail-defecon-d, tail-powers-b and tail-history.
- **8. JOIN-8: +20,957.** The tail lanes' further points.
- **9. JOIN-9: −16,679.** tail-close-tests-a and tail-close-tests-b, tail-close-src, and the tail lanes' last points. The source diff does not single out the file that fell. The largest source falls are `tonightSheet.js` −2,245 and `powerSentenceName.js` (display) −2,225, which together do not account for 16.7 KB. No build was run to locate it.
- **10. JOIN-10: +30.** close-trim-first-paint, tail-close-pools, tail-close-pools-2, tail-close-people, tail-close-display and tail-close-tests-c.
- **11. JOIN-11: −2,210.** tail-close-sweep-a, tail-record, tail-close-heap, close-layer-cycle-attempt, and the first point of tail-close-reach.
- **12. JOIN-12: +641.** tail-close-sweep-b, tail-close-sweep-c, tail-content-close, tail-close-presumed and tail-close-reach.
- **13. The doors' close: +202.** tail-close-secret (the cure of the repeated secret), tail-close-presumed and tail-close-prose. In source this is mostly `intentAtlas.distillate.json`, `generationForkRegistry.js` and `castPowers.js`.

**The largest stages' candidate files.** These come from each file's net source-byte change across the stage (`git diff` over `src/data src/generators src/domain`). They were ranked by the diff's size, not by a build. Source bytes are not minified worker bytes, and display modules may sit outside the worker.

- **JOIN-1 (+135,871):**
  - `src/data/institutionDescVariants.js` +38,619
  - `src/domain/display/tradeListDisplay.js` +30,673
  - `src/data/dossierStateProse/defense.generated.js` +28,088
  - `src/data/historyData.js` +19,305
  - `src/data/dossierStateProse/general.generated.js` +17,714
- **STYLE-2-MERGE 42–49 (+70,863):**
  - `src/domain/facts/registeredWords.js` +57,579
  - `src/domain/coherence/pageCensusFindings.js` +23,017
  - `src/generators/power/conflictIssues.js` +22,150
  - `src/generators/generationCoherence.js` +21,304
  - `src/domain/facts/factLayers.js` +14,406
- **JOIN-7 (+52,053):**
  - `src/data/historyData.js` +9,880
  - `src/generators/computeActiveChains.js` +5,833
  - `src/domain/display/crisisStoppedRow.js` +5,610
  - `src/data/crisisDependence.js` +5,009
  - `src/domain/display/defenseDisplay.js` +5,001
- **JOIN-8 (+20,957):**
  - `src/data/historyData.js` +11,780
  - `src/generators/safetyLineTruth.js` +6,953
  - `src/generators/computeActiveChains.js` +5,988
  - `src/generators/narrative/foundingRowAdmits.js` +5,318
- **JOIN-6 (+17,402):**
  - `src/data/crisisDependence.js` +45,760
  - `src/domain/display/crisisStoppedRow.js` +12,600
  - `src/generators/narrativeText.js` +5,242

## The commit

The constant goes from **2,008,268 to 2,303,278**, the tip's measured figure. The new entry is appended to the constant's comment block in the W0-CLOSE idiom: the old figure, the new figure, the rise, how it was measured, the bytes attributed by stage, and "Recorded AT the measured figure; MONOTONE-DOWN from here".

The arm's message now reads "(re-recorded at the measured figure by the chair's ruling WB1, 2026-11-15, the close of the tail round, ODQ §934.105)".

No bytes were bought back tonight. A later tidy may buy them back, and the stage table above shows where to look first: JOIN-1 and STYLE-2-MERGE 42–49 hold about 70% of the rise.

## The receipt

At the tip, after a fresh `npm run build`, the worker reads 2,303,278 B (`generation.worker-7zwuD1bz.js`).

- **This file alone** (`VERIFY_DIST=1 npx vitest run tests/build/generationWorkerLazy.test.js`): GREEN, 11 of 11.
- **The whole build-test arm** (`sh scripts/gate-tail.sh npm run verify:dist`): **exit 1**. The only failing file is `tests/build/vendorPdfLazy.test.js`, which is not this seat's file. Its three failing assertions:
  - the engine chunk: `expected 867294 to be less than 867093` (+201 B over the ceiling re-recorded at dfd45489c);
  - first-paint gzip: 360,063 B against a budget of 360,052;
  - first-paint Brotli: 302,239 B against a budget of 302,161.

  Those budgets were re-recorded at TAIL-CLOSE-DOORS-2's dfd45489c, before the later doors commits up to 73090ee9e. This has been reported to the chair in one line.

## Note for the seat that merges this branch

Two repairs still land beside this branch: format and types in two source files, and the landing copy. If the worker's bytes at the final tree differ from 2,303,278, that seat re-measures and sets the constant to the final figure, citing this table as the attribution up to 73090ee9e.
