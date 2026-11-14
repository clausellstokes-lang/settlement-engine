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
- **09:09 UTC (on JOIN-2's byte-baseline stop):** AS PROPOSED. Each leaf's rise over the line is the declared growth of named lanes; at the join the figure is MEASURED, never summed. `scripts/.prose-byte-baseline.json` through the corpus lane's own `bytes.mjs`, ONE JOIN ROW A LEAF naming each lane's cause (for `dossierRelations.generated.js` the defence lane's fundedGate and upkeep relations in `defenseGenerator.js`, 28,249 -> 28,926, named as that lane's undeclared growth); each leaf's `raw` equal to the bytes on disk and under its ceiling; no ceiling moved. Its own commit; proseCorpusBytes green after.
- **09:16 UTC (DS-ECO-12):** the pool is the corpus lane's file: take its pool whole; the data lane's three lines NOT merged in, copied verbatim under FOR THE CORPUS LANE; a guard row keyed to them named, not re-keyed. (Passed another way: P2.4.)
- **10:22 UTC, record 440 (BOTH DOORS: writer reach, observed shapes):** NOTHING IS BANKED AT THIS REFREEZE. Each is banked ONCE, AT THE CLOSE, on the final tree: one `--rebank` under the closing record's charter, one migration rung, every identity classed. This replaces (d2)'s "run once at the join" for the powers lane's sixteen and the data lane's three reads too. Until then both are NAMED DOOR REDS (class C); the lists below are their ledger. WHY (the chair, by content at 26474cda9): of the defence lane's eighteen dark keys, seventeen are named by no src file that lane changed, and none of the stale keys is; its rating moves change which wars the corpus's worlds fight, so writers the line already had enter the sample and others leave it (the same for the six reads on outcome/stressors and the GONE recallTargetId). THE LANE'S OWN, for the defence lane's closing seat: `criminalPreStress on compound` (a new stored key no surface reads). The 23 reads in defenseGenerator.js and incomeLineSiblings.js (the local `chains`, the tuning table `W.arcane`, the parameter `f.chains`): names mis-grounded, NO dead arm: explained-writer rows of the one rung. No seat runs either door's writing mode before the close.
- **09:49 UTC, record 440 (the two stops):** (1) PAGE CENSUS NEW1, 12 against 11, is EXPOSURE, not origin: the defence lane's declared rating move puts three more towns (r2r-city-9, r2r-town-59, r2r-village-8) under a carried false line whose writer is the powers lane's `governanceNarrative.js` (a second ladder for the defence word); its cure is assigned to the powers lane's seat. NEW1 re-based 11 -> 12 BY HAND in the book's 48c form, its own commit; then `--shrink` lowers every fall. F4 202 -> 0 IS explained: the defence lane's cures (its statement names F4 and P14). Nothing else re-based. (2) THE POOL GUARD: accepted as run (61 lowered, none raised); the 11 rows registered at no lane's tip listed with pool and lane (P2.3); the two rows OVER (plotHooks:resource_scarcity, plotHooks:succession_crisis) stay RED, the data lane's: its seat cures them.

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

## P2.3 Step 1, THE REFREEZE, row by row (each door's exit; the commit)

| step | row | door and exit | commit |
|---|---|---|---|
| 2 | `src/data/dossierStateProse/*.generated.js`, `dossierRelations.generated.js` | wiring census `--check` 1 (stale), generator `--check` 1 → `wiring-census.mjs` 0 → `generate-dossier-state-prose.mjs` 0 (69 blocks / 2,948 variants) → census 0 → both `--check` 0. Only `dossierRelations.generated.js` moved (165 -> 169 pairs: the defence lane's `defenseGenerator.js`, never regenerated on that lane; byte-identical to the rehearsal's) | a80825e8c |
| 4 | `docs/content/wiring-census.json` | `wiring-census.mjs --check` 0 (856 pools / 2,948 variants / 169 relation rows; producerIndexFiles 1346 -> 1359) | c62f814de |
| 3 | `scripts/.prose-byte-baseline.json` | STOP (book 2n: a rise to the chair) → ruled 09:09 → `bytes.mjs`, seven JOIN rows; proseCorpusBytes 18/18 | 2ab29a214 (measure), 3949fe371 |
| 5 | `tests/lint/presumedThings*.register.json` | `--check` 1: fresh 153, stale 27 + 4, strips fresh 1 → `--shrink` 0 → `--check` 1 (fresh 153, stale 0). Law (b): the fresh list is the declaration pass's | a7dd38ee7 |
| 5 | `scripts/census/pool-dominance.register.json` | 1 (2 over, 43 unregistered, 15 stale, 35 loose) → `--tighten` 0 (ruling d3) → 1 (2 over, 0, 0, 0): no ceiling raised, 61 lowered, 43 banked, 15 dropped | e8327afe7 |
| 5 | `scripts/census/page-census.register.json` | 720 `--workers=2` 1 (ROSE on NEW1 11 -> 12) → STOP → ruled 09:49 (record 440) → NEW1 re-based by hand (48c) → `--from` 0 → `--shrink` 0 (12 rows lowered) → `--grid` 0 (39 falls) → `--grid --shrink` → `--grid` 0 (0 falls) | 08eb27b7d (measure), 3a21eda7f, d73215f1c, 93595e6cb |
| 5 | `tests/lint/factLayers.register.json` | `fact-layers-door.mjs` 1: 11 rises, 15 falls, every one a lane's own (the same at its tip: r2-code-a 5 rises; powers 2; defence 3 rises, 14 falls; r2-code-b 1 and 1); none new at the join. `--shrink` refuses while a rise stands: NOT shrunk. Law (b) | (probe in e0fdd7162's parent chain: j2-40-*) |
| 6 | `scripts/.writer-reach-baseline.json` | `check-writer-reach.mjs` 1: 34 dark, 25 stale. Powers' 16 + 8 as ruled; beyond them the defence lane's 18 dark and 17 stale, and 2 stale only at the join (lastTargetedBy/Tick on osr001:npc_merchant_guilds_3_8, where the powers tip has osr000:npc_barracks). STOP (d2): nothing written | e0fdd7162 |
| 6 | `scripts/.observed-shape-readers-baseline.json` | gate 1 ("execution INPUT changed": seven regenerated leaves). `--scan-only --scan-mode=legacy-leaf` against the register: NEW 32, GONE 3: the three ruled `config` reads (data) and 29 more, all the defence lane's own (the same scan at its tip). STOP (d2): nothing written. The explained-writer bank's growth form is a governed migration rung (`migrate-observed-shape-readers.mjs` + the sentinel pin), not a list edit | e0fdd7162 |

**THE POOL GUARD'S 11 ROWS REGISTERED AT NO LANE'S TIP** (banked by `--tighten` at the joined measure): `ledger:cultureProfiles:<culture>.foodways` for arabic, celtic, east_asian, germanic, greek, latin, mesoamerican, norse, slavic, south_asian, steppe: added by the DEFENCE lane (4ff5b11e3, UPKEEP-9 step 2(a): the culture's foodways lines read through `filterDeclared` with `poolId: cultureProfiles:<key>.foodways` in `src/generators/foodGenerator.js`, the only lane that changed the file). The other 32: the data lane's 26 and the powers lane's 6 own rows (j2-21-*).

**THE PRESUMED-THINGS FRESH LIST, COMPARED BY SCRIPT** (`j2-13-*`): at each merged tip, the line 0, r3-code-c 0, r3-tabs 0, r2-code-a 18, powers 10, data 49, corpus 23, leaves 2, r2-code-b 18, defence 28 + 1 strip; union 148, every one fresh here. Named in its lane's hand-back by text: 119; fresh at its lane's own tip but not matched by text in its hand-back: 29 (r2-code-a 10, defence 10, corpus 9, r2-code-b 1). **NEW AT THE JOIN, 6** (fresh at no lane's tip): five `occupation` lines and one `war` line of `RECEIPT_POOLS_DOSSIER_STATE.md` (general: "is quiet under occupation", "the streets are quiet because soldiers hold them"; stressors: "The occupiers are quartered inside the town", "the occupier's officers sit in on its business", "taxes go to the occupier before the town sees them", "the war has reached the town as absence"). THE TWO LANES THAT MEET IN THEM: the corpus lane's d8727e3ee took their `crisis: occupied` / `crisis: wartime` tags off (the pool's key declares it) and kept their register rows; the data lane carries the earlier corpus (the shared base 31f57e8eb) with the tags and shrank the rows as stale (338479f68). The joined text is the corpus lane's, the joined register the data lane's shrink. The composed corpus was checked line by line against the true merge base 31f57e8eb: every data-lane and corpus-lane line stands (one line carries both lanes' tags).

## P2.4 FOR THE CORPUS LANE (the chair's ruling of 09:16; DS-ECO-12 "INCOME WEIGHT: the religious houses")

Step 0 merged the corpus lane at fdae163f3 with no conflict: the joined pool is already the corpus lane's (rows 1-2 `sacredHouse`, its rows 3-4 `no sacredHouse · no crisis: under_siege`; its later `tier: ≥ village` re-key, 3ae4b5ab1, is past the merged tip). The data lane's three lines (at 8d2aa98b1), NOT merged in, verbatim:

```
3. `[ledger · no sacredHouse]` Faith carries real weight in {settlement}'s money, though the place keeps no house for it: what its people give for their faith leaves with them on the feast days.
4. `[street · no sacredHouse]` At {settlement} the feast days set the calendar of buying and selling, and the offerings leave the place with the people who carry them.
5. `[threshold · no sacredHouse]` {settlement} spends on its faith without keeping a house for it, so a quarrel over the rites would be felt in its money first.
```

Guard rows keyed to that pool: `tests/domain/corpusCureGuards.test.js` lines 52-53 (`w5-thorp-under_siege-3`, DS-ECO-12 vid 4 and vid 3; written by the corpus lane's 13c6618e0, their `why` quoting the earlier text of rows 3-4). Named, not re-keyed.

## P2.6 THE TWO DOORS' LEDGER (NAMED DOOR REDS, class C, to the close; record 440 of 10:22)

**Writer reach** (`node scripts/check-writer-reach.mjs` at the joined tree, exit 1; 59 identities; powers = its P6.8 sixteen and eight, the rest the defence lane's except the two marked):
dark `criminalPreStress on compound`; dark `deployedQuality on osr006`; dark `endsTick on osr007`; dark `logisticsBurden on osr006`; dark `osr008:npc_mill on npcs`; dark `proud on osr003:npc_power_landed_gentry`; dark `proud on osr004:npc_power_noble_families`; dark `proud on osr005:npc_power_noble_families`; dark `proud on osr007:npc_power_noble_families`; dark `ransoms on roads`; dark `recallTargetId on autoApplied`; dark `recallTargetId on metadata`; dark `recallTargetId on selected`; dark `reinforcementFlow on osr006`; dark `returnCondition on osr006`; dark `rivalTriumphBand on metadata`; dark `rivalTriumphBand on pulseHistory`; dark `rivalTriumphBand on warTerminationReads`; dark `sizingBias on osr006`; dark `survivors on autoApplied`; dark `survivors on metadata`; dark `survivors on selected`; dark `warReturnedSettlementIds on pulseHistory`; dark `weakness on osr001:npc_power_landed_gentry`; dark `weakness on osr002:npc_power_landed_gentry`; dark `weakness on osr003:npc_power_landed_gentry`; dark `weakness on osr004:npc_power_noble_families`; dark `weakness on osr005:npc_power_noble_families`; dark `weakness on osr006:npc_power_noble_families`; dark `weakness on osr007:npc_power_noble_families`; dark `weakness on osr008:npc_mill`; dark `weakness on osr013:npc_power_landed_gentry`; dark `weakness on osr014:npc_power_landed_gentry`; dark `weakness on osr015:npc_power_landed_gentry`; stale `authoritySignature on selected`; stale `authoritySignature on warRulingRead`; stale `booksDirection on selected`; stale `booksDirection on warRulingRead`; stale `booksReason on selected`; stale `booksReason on warRulingRead`; stale `causeState on selected`; stale `causeState on warRulingRead`; stale `lastTargetedBy on osr001:npc_merchant_guilds_3_8`; stale `lastTargetedBy on osr013:npc_blacksmiths_3_10`; stale `lastTargetedTick on osr001:npc_merchant_guilds_3_8`; stale `lastTargetedTick on osr013:npc_blacksmiths_3_10`; stale `momentumBroken on selected`; stale `momentumBroken on warRulingRead`; stale `proud on osr004:npc_mills_2_5`; stale `proud on osr005:npc_vintner`; stale `proud on osr007:npc_theaters`; stale `rulerLawfulnessBand on selected`; stale `rulerLawfulnessBand on warRulingRead`; stale `rulerMoralityBand on selected`; stale `rulerMoralityBand on warRulingRead`; stale `warRulingRead on selected`; stale `weakness on osr004:npc_vintner`; stale `weakness on osr005:npc_mills_2_5`; stale `weakness on osr006:npc_mills_2_5`. (Join-only: the stale pair on `osr001:npc_merchant_guilds_3_8`.)

**Observed shapes** (`--scan-only --scan-mode=legacy-leaf` against the committed register; file, identity, register → scan):
NEW `components/map/WorldPulseData.js` factionName on stressors 0→4; NEW `components/map/WorldPulseData.js` settlementIds on stressors 0→1; NEW `domain/display/newsBody.js` settlementIds on outcome 0→1; GONE `domain/worldPulse/applyWorldPulse.js` recallTargetId on metadata 2→0; NEW `domain/worldPulse/proposalAdmission.js` targetId on outcome 0→1; NEW `domain/worldPulse/warCoalitionEvidence.js` attackerId on outcome 0→1; NEW `domain/worldPulse/warCoalitionEvidence.js` targetId on outcome 0→1; NEW `generators/defenseGenerator.js` contract on chains 0→1; NEW `generators/defenseGenerator.js` food on chains 0→1; NEW `generators/defenseGenerator.js` foodBroken on chains 0→1; NEW `generators/defenseGenerator.js` foodWorking on chains 0→1; NEW `generators/defenseGenerator.js` fortification on chains 0→1; NEW `generators/defenseGenerator.js` garrison on chains 0→1; NEW `generators/defenseGenerator.js` guild on arcane 0→1; NEW `generators/defenseGenerator.js` intFrom on arcane 0→2; NEW `generators/defenseGenerator.js` intMax on arcane 0→1; NEW `generators/defenseGenerator.js` intPerDial on arcane 0→1; NEW `generators/defenseGenerator.js` masons on chains 0→1; NEW `generators/defenseGenerator.js` mil on arcane 0→1; NEW `generators/defenseGenerator.js` milMax on arcane 0→1; NEW `generators/defenseGenerator.js` milPerDial on arcane 0→1; NEW `generators/defenseGenerator.js` mon on arcane 0→1; NEW `generators/defenseGenerator.js` monMax on arcane 0→1; NEW `generators/defenseGenerator.js` monPerDial on arcane 0→1; NEW `generators/defenseGenerator.js` provisioned on chains 0→1; NEW `generators/defenseGenerator.js` tower on arcane 0→1; NEW `generators/defenseGenerator.js` unmended on chains 0→1; NEW `generators/defenseGenerator.js` unprovisioned on chains 0→1; GONE `generators/defenseGenerator.js` _foodSecurity on config 1→0; GONE `generators/defenseGenerator.js` _institutions on config 1→0; NEW `generators/economy/incomeLineSiblings.js` chainId on chains 0→1; NEW `generators/economy/incomeLineSiblings.js` status on chains 0→1; NEW `generators/steps/assembleInstitutions.js` selectedStresses on config 0→1; NEW `generators/steps/assembleInstitutions.js` selectedStressesRandom on config 0→1; NEW `generators/steps/assembleInstitutions.js` stressorEdits on config 0→1.

## P2.5 WHAT IS LEFT (kept current; line by line)

**Step 7 done so far** (each its own commit, the cause in the note): `tests/domain/facts/textOf.test.js` 105 -> 115 (487e77b1c); `tests/lint/rawColorLiteral.test.js` BUDGET 1216 -> 1206, a shrink by its walk (653678e77); `tests/data/dossierStateProseProjection.contract.test.js` relations 165 -> 169 and half-joined 10 -> 11, the defence lane's re-projected relations (991bbb259).

**Step 7 LEFT: the pinned tests red at the joined tree** (one run of 2n's step-7 files, 19 red in 11 files before the three above; each re-keyed by ITS OWN instrument, by identity, every lane's cause in the note, never a sum; a figure the causes do not explain is a stop for that pin):
1. `tests/generators/generationForkCensus.test.js` A1 (the control row's hash), A4, A5 (seeds minted more than once), A6 (fnv1a32 external; the defence lane's `fnv1a32External: 24`; the rehearsal measured 23): 2n step 7 (c): a FALL with its caller named is the seat's (both constants, one commit, BEFORE step 9); a RISE goes back to the lane (Appendix B `stagepins.py --control`).
2. `tests/generators/institutionBudgetPromise.test.js` "every one of sixty seeds is byte-identical": re-key BY IDENTITY from a probe run (Appendix G `rekey.py`), each seed moved by a declared cause only.
3. `tests/components/phoneChromeFloor.census.test.js` (floored /create · /settlements · /gallery; JOIN-1 3b: branch 622 · 865 · 667; powers −2, leaves −3, r2-code-b −1 −2): "re-measure by the census, re-key by cause".
4. `tests/components/dossierPhoneFloorAllViews.test.jsx` ×2 (DESKTOP_BASELINE; every line clears its floor): a line-level compose by cause.
5. `tests/lint/proseComposed.walker.test.js` GUARD THE GUARD: re-key by identity, a dated note (the corpus lane's `pins.py` via `iterate.sh`, docs/chair/2026-11-13/probes/W2-WRITE-5).
6. `tests/lint/proseWiringCensus.walker.test.js` car 0f ALIAS DRAFT (JOIN-1 3b: 14 · 4 · 85 · 39 against r2-code-a 19 · 5 · 84 · 37 and the defence lane's 84 · 39): re-key by measurement (after step 4, done); `pins.py`.
7. `tests/lint/proseNumerics.test.js` "debt exactly matches the committed baseline" (`tests/lint/.prose-numerics-baseline.json`, keyed BY LINE; JOIN-1 3b: REVIEWED_TOTAL_CEILING 186 leaves against 193 defence): re-key each moved line by its text, never a count.
8. `tests/domain/corpusCureGuards.test.js` ×4 (DS-DEF-11 WALLED-STRAINED v3 at w5-city-under_siege-1; DS-DEF-2 Beasts v6 at w5-town-monster_pressure; DS-DEF-2 Invasion v4 at rww-town-occupied-1 and v6 at w5-town-under_siege-1: "no longer reads …: re-key the row to a town of the case"): the corpus lane's guard rows; to CLASS at step 2, not re-keyed by this seat.

**Then:** step 8 the tuning ritual (`TUNING_INVENTORY_REFREEZE='JOIN-2' TUNING_INVENTORY_NOTE='<why>' npx vitest run tests/lint/tuningRegister.walker.test.js`, non-zero by design, then plain green; clean COMMITTED tree); step 9 the edge bundles (`npm run build:edge-shared` in a checkout with its OWN node_modules, `/home/user/j2wt`, after every src change; keep only bundles whose sourceHash moved); step 10 the lighting census LAST (`LIGHTING_CENSUS_REFREEZE='JOIN-2' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`, then plain until green); the refreeze message to the chair. Step 2: the three gates; `node scripts/implementation-packets.mjs validate`; the ledger ref (`git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`); the six shards (`npx vitest run --exclude='tests/build/**' --shard=<i>/6 --reporter=json`, each to its own file outside the tree; refs and config snapshotted around each); every red classed A–E on the frozen trees. Step 3: CENSUS-2 (the brief's command). Step 4: this hand-back's last parts (the classes table, the census table, WHAT A LANE DOES TO LAND).

**Known reds so far, for the classing:** `mutationCoverageManifest` TOTALITY (dozens of lanes' new invariant files with no entry; the book's step-1 form: break, see red, restore, `cmp`, a `kind: 'rationale'` entry; the lanes'); the two doors (class C, record 440); presumed-things ARM 1 fresh 153 and fact-layers 11 rises (class C, law b); the pool guard's two OVER (the data lane's).

**How the instruments are re-made:** worktree `/home/user/j2wt` (branch `join`), its own `npm ci`; frozen trees `/home/user/j2ft/<lane>` at the merged tips (`git worktree add --detach`, node_modules symlinked to j2wt's; never for edge bundles); helpers in `/home/user/j2out/` (`push.sh`: fetch, tripwire, non-empty rev-list, snapshots, explicit refspec; `mc.sh`/`verify.sh` for merges; `py/fresh.py`, `py/ptcmp.py`, `py/rp.py` for the door comparisons; `new1/run.sh` renders a seed plan by the census's own render at any tree). All outside the repository: re-make them from these descriptions if the container restarts.
