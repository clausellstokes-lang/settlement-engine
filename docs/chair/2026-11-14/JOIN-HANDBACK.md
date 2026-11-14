# JOIN-1 — the hand-back (2026-11-14)

Seat JOIN-1 (session `session_01ACmDYYeSYjFDzrtLtszt3J`), brief `docs/chair/2026-11-14/briefs/BRIEF-JOIN-1.md` on `lane/chair-2026-11-08`. THE TRUE JOIN: the nine builder lanes merged into `lane/join-2026-11-14`, started at the line's tip **976db5b19** (read back from origin at 07:16 UTC, unchanged; the line did not move). Nothing reached the line or any lane; nothing re-derived, re-keyed, rebuilt, cured or signed; no pull request; the whole suite not run.

## 1. Phase A: the order, the tips merged, the times

Full history first (`git fetch --depth=2147483647` of the line, the merge book's branch and the nine lanes; `is-shallow-repository` false, 18 s). A scratch worktree at the line's tip, `npm ci`, `rerere.enabled true`. One merge commit a lane, `git merge --no-ff --no-commit <full hash>`, each tip read back from origin at its merge; every merge pushed by a plain refspec push, the lane hook's three gates green at each (type ratchet 167/167, strict-domain 1113/1113, eslint 0 errors). Refs and local config of the shared repository snapshotted before and after every push and every test run: unchanged every time.

| # | branch merged | tip merged (read at the merge, UTC) | the chair's 07:10 map tip | merge commit |
|---|---|---|---|---|
| 0 | merge-15-point-49-wip-2026-11-14 (the book's 2m, 2n; diff names one file) | b5a783c61 (07:19) | — | 2df565cf2 |
| 1 | r3-code-c-2026-11-13 | 5eba19f9b (07:23) | 0ccf3ff24 | 77e480ac3 |
| 2 | r3-tabs-2026-11-13 | 5efbfde7e (07:28) | 5f8602371 | 64fe60ead |
| 3 | r2-code-a-2026-11-13 | c77bd5d57 (07:32) | 2d6d605be | e20a60e0d |
| 4 | powers-follow-up-2026-11-13 | 3909655c3 (07:36) | b655ef4f7 | bea2a1298 |
| 5 | w2-fix-data-2026-11-13 (data-history 864948c8b inside it) | 166d8b789 (07:41) | 166d8b789 | 8f222ff87 |
| 6 | w2-write-2026-11-13 (side-eco 4134b0882, side-rest ddb7453e9 inside it) | 6fdff4abd (07:47) | f2eb7950a | ba4cc210b |
| 7 | w2-c-leaves-2026-11-13 | 5853eaeef (07:51) | 7efa2e094 | 081d5a884 |
| 8 | r2-code-b-2026-11-13 | 30ed925ee (07:56) | 364a69a58 | 9e3880dd1 |
| 9 | coherence-upkeep-2026-11-12 (defence, last) | c56fd565e (08:11) | c56fd565e | 33b12cbef |

The map re-run at the tips of 07:16 (`joinmap2.py`): 29 of 36 pairs meet; still only the two code files; one file new to the map, `scripts/.observed-shape-readers-baseline.json` (r3-tabs + corpus), a baseline. Remerge diffs: `docs/chair/2026-11-14/probes/JOIN/NN-<lane>.remerge.patch` (`git show --remerge-diff`, every register, baseline and edge bundle of §3 left out).

## 2. Every code resolution (each file read whole; both lanes' cures stand; no choice between behaviours was met)

- **`scripts/lib/table-pools.mjs`** (merge 5, powers with data; 127 lines read whole), one hunk in `NOT_TABLE_CHANNELS`: powers' `TITLE_LINE_DECLARATIONS`, then data's `HISTORY_TEMPLATE_RECORD_DECLARATIONS` and `HISTORY_DESC_SIBLINGS` with their comment: three distinct keys. The rehearsal's resolution replayed (both hunks the same text); the file is byte-identical to the rehearsal's 2845c5fc5.
- **`src/components/new/tabs/EconomicsTab.jsx`** (merge 8, leaves with r2-code-b; read whole), two hunks, the rehearsal's 5a7b5d2d8 replayed (both sides' hunks the same text): imports `institutionDisplayName, institutionHouseLabel` (r2b; the service row's Via, auto-merged, reads it) with `tradeListsAsPrinted, tradeMarksOnPage, revenuesOffTheLists, chainOutputsShown` (leaves; `displayTradeList` has no use left); the chain card `chainFlowFacts(chain, instNames, shown)` (R2-CODE-B-7, which replaced the line's `{ ...chain, ...shown }`) with `outs = chainOutputsShown(chain, town)` (#555). Line count kept (866). eslint exit 0.
- Merged CLEAN in this order where the rehearsal met conflicts: `src/domain/goods.schema.js` (both roster rows, path order), `src/domain/display/defenseDisplay.js`, `src/domain/display/dossierViewModel.js`, `src/domain/generation/generationForkRegistry.js` (the defence lane's `fnv1a32External: 24` and r2-code-b's two `resolveCrisisCast` rows, independent lines; see §3c), `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `tests/domain/corpusCureGuards.test.js`, `tests/domain/foodEnduranceHeldStores.test.js`, `tests/lint/heldKeyWriterCensus.walker.test.js`.
- Appended rows (kind iv): `scripts/mutation-coverage-manifest.json` met once (merge 8): both rows stand (`invariants`: the branch had added 23 since the line, r2-code-b 1, no key in both; the file parses). The other three append files merged clean.

## 3. THE REFREEZE'S WORKLIST

### 3a. Files taken whole from the branch side (19), with the lanes whose side was NOT taken

| file | lanes not taken (merge #) |
|---|---|
| `tests/lint/.lighting-census-baseline.json` | r3-tabs (2), r2-code-a (3), powers (4), data (5), r2-code-b (8), defence (9) |
| `docs/content/wiring-census.json` | data (5), corpus (6), leaves (7), defence (9) |
| `scripts/census/page-census.register.json` | data (5), corpus (6), r2-code-b (8) |
| `scripts/census/pool-dominance.register.json` | powers (4), data (5) |
| `scripts/.prose-byte-baseline.json` | data (5), corpus (6) |
| `tests/lint/.tuning-inventory.json` | r2-code-b (8), defence (9) |
| `scripts/.observed-shape-readers-baseline.json` | corpus (6) |
| `tests/lint/presumedThings.register.json` | corpus (6) |
| `tests/lint/presumedThings.widened.register.json` | corpus (6) |
| `scripts/.writer-reach-baseline.json` | r2-code-b (8) |
| `tests/lint/.prose-numerics-baseline.json` | defence (9) |
| `supabase/functions/_shared/aiCharterBundle.meta.json` | powers (4) |
| `supabase/functions/_shared/aiGroundingBundle.js` | powers (4) |
| `supabase/functions/_shared/aiGroundingBundle.meta.json` | powers (4) |
| `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | powers (4) |
| `supabase/functions/_shared/analyticsEventsBundle.meta.json` | powers (4) |
| `supabase/functions/_shared/engineBundle.js` | powers (4) |
| `supabase/functions/_shared/engineBundle.meta.json` | powers (4) |
| `supabase/functions/_shared/intentAtlasBundle.meta.json` | powers (4) |

### 3b. Pins kept from the branch side inside a conflicted hunk (5 files; every change outside the hunks stands)

| file | pin | branch side (its lane) | the lane not taken | merge |
|---|---|---|---|---|
| `tests/lint/proseWiringCensus.walker.test.js` | `draft.rows.length` · `endpointsWithCandidate` · `noCandidate.length` · `docblockReports.length` | 14 · 4 · 85 · 39 (r3-tabs and earlier) | r2-code-a: 19 · 5 · 84 · 37 | 3 |
| same | `noCandidate.length` · `docblockReports.length` | 85 · 39 | coherence-upkeep: 84 · 39 (its comment) | 9 |
| `tests/components/phoneChromeFloor.census.test.js` | `floored` /create · /settlements · /gallery | 622 · 865 · 667 (r3-tabs, b1: −1 from 623/866/668) | powers-follow-up: 621 · 864 · 666 (−2) | 4 |
| same | same | 622 · 865 · 667 | w2-c-leaves: 620 · 863 · 665 (−3) | 7 |
| same | same | 622 · 865 · 667 | r2-code-b: 620 · 863 · 665 (−1 −2); its /compendium 205 → 203 stands | 8 |
| `tests/domain/facts/textOf.test.js` | object rows | 105 (r2-code-a) | w2-fix-data: 109 (the rehearsal measured 115 at its joined tree) | 5 |
| `tests/lint/rawColorLiteral.test.js` | `BUDGET` | 1216 (powers) | r2-code-b: 1221; **the walk at 9e3880dd1 measures 1212** | 8 |
| `tests/lint/proseNumerics.test.js` | `REVIEWED_TOTAL_CEILING` | 186 (w2-c-leaves) | coherence-upkeep: 193 | 9 |

### 3c. Merged CLEAN though both sides had moved them (git's three-way took the text; for the refreeze to re-derive or measure, each by its door)

- `docs/content/prose-shift-register.json` (merge 6: the corpus lane's figures taken: variant sum 2841 → 2948 and its digests).
- `src/data/dossierStateProse/defense.generated.js` (merges 5, 6), a generated file.
- `src/domain/generation/generationForkRegistry.js` `fnv1a32External: 24` (the defence lane's, measured on its own merge of the line; the rehearsal measured 23 at its joined tree): the fork census (`tests/generators/generationForkCensus.test.js`, also moved by both sides at merge 9) measures it (book §2n step 7).
- Registers merged clean as text where both sides had moved them (each in §2n): `tests/lint/presumedThings.register.json` (merges 3, 5, 9), `tests/lint/presumedThings.widened.register.json` (3, 4, 5, 7, 8, 9), `scripts/census/page-census.register.json` (3, 7, 9), `docs/content/wiring-census.json` (3, 4, 8), `tests/lint/.prose-numerics-baseline.json` (7, 8), `scripts/mutation-coverage-manifest.json` (5, 9).

The worklist: **24 files** (19 of §3a, 5 of §3b), plus §3c's.

## 4. Reds met (classed; none cured)

- Merge 5, the governing tests of `table-pools.mjs` (4 files, 59 tests): 1 red, `wiringCensusDeclared.walker` "every row carries the four columns, equal to a fresh annex reading" (26 rows): the wiring census of §3a, taken from the branch side by rule.
- Merge 8, the governing files of the EconomicsTab resolution (61 tests name the tab; 60 ran at the staged merge): 12 red in 7 files. The same 7 run at the branch before the merge (081d5a884) and at r2-code-b's tip 30ed925ee: **11 of the 12 are red at 081d5a884 already**: `dossierPhoneFloorAllViews` ×2, `phoneChromeFloor.census` (§3b's pins), `observedShapeReaders.walker` ×4 (§3a's baseline, corpus), `dossierProseManifest` ×3 (red at r2-code-b's own tip too), `economicsTabFlow` exportPosture and `generalDeskTabFlow` (the rehearsal's corpus-lane reds). **The one new red is `rawColorLiteral`'s pin** (§3b: 1212 measured). None is the tab's resolution.

## 5. Stops and rulings

None. No hunk needed a choice between two behaviours; no packet row refused (`implementation-packets.mjs validate` exit 0, 257 packets, at merge 9: the defence lane carries its EM-R0d cure); no lane moved under a merge; no message to or from the chair before phase A's report.

## 6. Hazards

- The lanes moved between the chair's 07:10 map and the merges (six of nine; §1): expected, each tip read back at its merge.
- Two merge bases at merge 6 (976db5b19 and the shared 31f57e8eb): git's virtual base takes the corpus lane's side of files both had moved (§3c).
- lint-staged ran eslint over each merge's staged files: every resolved file compared byte for byte with what was staged (unchanged), and each commit's tree differs from git's own merge only in the resolved files.
- `npm ci` wrote `core.hookspath=.husky/_` and `rerere.enabled=true` into the shared config (expected); nothing else moved it.

## 7. How the instruments are re-made

A worktree at `origin/lane/join-2026-11-14` (`git worktree add <scratch>/wt -b join <tip>`, `npm ci`, `git config rerere.enabled true`). The push refuses an empty rev-list (`test -n "$(git rev-list origin/lane/join-2026-11-14..join)"`) then `git push origin join:refs/heads/lane/join-2026-11-14`. A merge: `git fetch --depth=2147483647 origin <lane>`, `git merge --no-ff --no-commit $(git rev-parse origin/<lane>)`; a pinned test kept hunk by hunk by dropping the incoming side inside the markers only; a register `git checkout --ours` then `git add`. The remerge patches: `git show --remerge-diff <merge>` with §3a's files excluded.

## 8. Phase B

Waiting on the chair's "MERGE AGAIN: <lane> at <hash>" messages; none yet.

---

# PART 2 — JOIN-2 (session `session_01ACmDYaoDSWJQ9WgrQh7njn`), brief `docs/chair/2026-11-14/briefs/BRIEF-JOIN-2.md` on `lane/chair-2026-11-08`

Kept current after every item. Started from 216eeb41f (origin's tip, unchanged since JOIN-1). Full history fetched (`is-shallow-repository` false). Worktree `/home/user/j2wt` (local branch `join`), its own `npm ci`, `rerere.enabled true`. Every push plain by `git push origin join:refs/heads/lane/join-2026-11-14` after a fetch and a non-empty rev-list; refs and local config of the shared repository snapshotted before and after: unchanged every time.

## P2.1 The chair's rulings worked to (copied; the chair's messages are not on the branch)

- **(d3), 08:29 UTC:** THE POOL GUARD'S TIGHTEN IS RUN ONCE, BY JOIN-2: after step 0's merges and the wiring census, `node scripts/census/pool-dominance.mjs` first (its figures to a file), then its `--tighten` form: it LOWERS loose ceilings to their measures (round three's code lane measured one: OUTLOOK_HOOK_SIBLINGS 0.649 over a measure of 0.5449, cause 0b3ce25a3). It never raises: a row OVER its ceiling stays red and goes to the chair with its figures at the joined tree, the line's tip and the lane's tip (the data lane carries two such). Its own commit, the door's output in the body.
- **08:33 UTC:** JOIN-1's rerere cache is lost; in step 0 a pinned test re-meeting a hunk keeps the branch side inside it (JOIN-1 §3b). Snapshot refs and local config around every shard (the two git-running tests).

## P2.2 Step 0: each lane once more at its tip (read back at its merge)

| # | lane | JOIN-1's tip | merged now | merge commit | taken from the branch side (listed for the refreeze) |
|---|---|---|---|---|---|
| 0.1 | r3-code-c | 5eba19f9b | 70d92ed06 | 282ccd34f | `scripts/.writer-reach-baseline.json` (r3-code-c's f242b80be re-freeze) |
| 0.2 | r3-tabs | 5efbfde7e | 6b74eb2aa | e0f848db5 | `tests/lint/.lighting-census-baseline.json` (five R3-TABS-4 re-takes) |
| 0.3 | r2-code-a | c77bd5d57 | 52932a0c2 | b23ae4272 | `tests/lint/.lighting-census-baseline.json` (311573463) |
| 0.4 | powers-follow-up | 3909655c3 | 77d7bcace | e3aa23681 | none (clean) |
| 0.5 | w2-fix-data | 166d8b789 | 8d2aa98b1 | 35d474994 | eight edge bundles/metas (e22e1546e); `aiCharterBundle.js`, `aiOutputSchemaBundle.js` merged clean from the lane's side |
| 0.6 | w2-write | 6fdff4abd | fdae163f3 | 4f24025c2 | `docs/content/wiring-census.json`, `scripts/.prose-byte-baseline.json`; merged clean: `defense.generated.js`, `economy.generated.js`, `presumedThings.widened.register.json` (−6 lines, the lane's shrink) |
| 0.7 | w2-c-leaves | 5853eaeef | da7a567f4 | 66d29668d | ten edge bundles/metas (da7a567f4) |
| 0.8 | r2-code-b | 30ed925ee | — skipped, unmoved | — | — |
| 0.9 | coherence-upkeep | c56fd565e | 26474cda9 | 069c30e01 | none (docs only) |

The book's lane (merge-15-point-49-wip, b5a783c61) unmoved: skipped. No code conflict; no pinned-test hunk met. Every merge: each file the merge changed compared with the lane's blob where the branch had not moved it (`verify.sh`: no difference; lint-staged changed nothing); the hook's three gates green at every push.

**The lanes moved again during step 0** (read 08:53 UTC; NOT merged: they land later as points on the chair's word): r3-tabs 08acc23d4 (+1, docs), r2-code-a 8a8776dfc (+3), powers 609ff6472 (+5), data 4a3597e39 (+2), w2-write 1dfa83d89 (+3), leaves 180b5930a (+1), r2-code-b ef0b6208d (+1).
