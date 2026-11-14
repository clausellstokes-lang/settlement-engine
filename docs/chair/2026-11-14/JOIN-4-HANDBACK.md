# JOIN-4 — the hand-back (2026-11-14): THE SECOND LANDING

Seat JOIN-4 (session `session_01ACmDYZUoeEdTG4RGs1hdRD`), brief `docs/chair/2026-11-14/briefs/BRIEF-JOIN-4.md` on `lane/chair-2026-11-08`. Kept current after every item. Started from **b6a5f97ab** (origin's tip read back at 12:55 UTC; the tip the brief named; no JOIN-3 commit after it at the start). Full history fetched (`is-shallow-repository` false). Worktree `/home/user/j4wt` (local branch `join4`), its own `npm ci`, `rerere.enabled true`. A frozen detached tree `/home/user/j4base` at b6a5f97ab (its own `npm ci`) for the count before the merges. Instruments in `/home/user/j4out/` (outside every tree): `merge.sh`, `verify.sh`, `commit.sh`, `push.sh`. Every push plain by `git push origin join4:refs/heads/lane/join-2026-11-14` after a fetch (a JOIN-3 commit outside `docs/chair/2026-11-14/` is the tripwire) and a non-empty rev-list; refs and local config of the shared repository snapshotted before and after every push: unchanged every time.

## 1. The laws worked to (the chair's rulings of 2026-11-14 12:49 UTC, copied from the brief; each vetoable by the owner)

(a) ONE MERGE COMMIT A LANE (`git merge --no-ff --no-commit <the full hash read back>`), in the order r3-code-c, r3-tabs, r2-code-a, powers-follow-up, w2-fix-data, w2-write, w2-c-leaves, r2-code-b, coherence-upkeep; the tip read at the merge IS the point; what a lane pushes afterwards lands later. NOT MERGED, whoever asks: lane/upkeep-monotone-2026-11-14, lane/coherence-veil-2026-11-11, any review branch.
(b) A CODE CONFLICT: the file read whole; BOTH LANES' CURES STAND. A hunk that needs a CHOICE between two behaviours is a STOP FOR THAT LANE: `git merge --abort`, one message to the chair (file, function, both sides' intent), go on with the next lane.
(c) A REGISTER, A BASELINE, A GENERATED FILE OR AN EDGE BUNDLE that conflicts: THE JOINED SIDE IS KEPT (`git checkout --ours`, `git add`) and the file LISTED with the lane, for the close. One that merges clean though both sides moved it is LISTED too. No door in a writing mode: after these merges the registers are NAMED REDS until the close's one refreeze.
(d) A PINNED FIGURE in a test BOTH sides moved: the joined side kept INSIDE the hunk, every change outside the hunk standing, the pin LISTED (file, title, both figures): MEASURED at the close, never summed. A pin ONLY THE LANE moved merges clean and stands.
(e) AFTER EACH MERGE, BEFORE ITS COMMIT: every file the merge changed equals the lane's blob wherever the joined line had not moved it; lint-staged changes nothing. Then the commit; the hook's three gates at the push. A gate RED after a merge: which side's change by `git diff`; a ceiling never raised, no error suppressed; a COMPOSED RED cured only if one line keeps both behaviours (its own commit), else STOP FOR THAT LANE.
(f) EVERY PUSH PLAIN, explicit refspec, after a fetch and a merge of whatever JOIN-3 pushed (docs); a rejected push fetched, merged and pushed again; never a force.

## 2. The landings

| # | lane | tip merged (read at the merge, UTC) | JOIN-2's tip | merge commit | conflicts | listed for the close |
|---|---|---|---|---|---|---|
| 1 | r3-code-c-2026-11-13 | da0f201e6 (12:57) | 70d92ed06 | c2c12792e | register only | `tests/lint/.lighting-census-baseline.json` |
| 2 | r3-tabs-2026-11-13 | 68e9e97b5 (13:02) | 6b74eb2aa | 4ebe3d6cb | 2 registers, 1 pin hunk | `docs/content/wiring-census.json`, `tests/lint/.lighting-census-baseline.json`; pin `proseWiringCensus.walker` docblockReports |
| 3 | r2-code-a-2026-11-13 | bc9194bf7 (13:06) | 52932a0c2 | 0bab56f3b | 5 registers/baselines/bundles | `scripts/.writer-reach-baseline.json`, `engineBundle.js`, `engineBundle.meta.json`, `.lighting-census-baseline.json`, `.tuning-inventory.json`; clean-both: `presumedThings.register.json` |
| 4 | powers-follow-up-2026-11-13 | 30b03024f (13:11) | 77d7bcace | 2cc812f4c | 2 registers | `page-census.register.json`, `.lighting-census-baseline.json`; clean-both: `SummaryTab.jsx`, `restoredSubsections.test.js`, `generationForkCensus.test.js` |
| 5 | w2-fix-data-2026-11-13 | 8e814883c (13:20) | 8d2aa98b1 | e7e1c2e8c | 3 registers | `pool-dominance.register.json`, `.lighting-census-baseline.json`, `presumedThings.register.json`; clean-both: `institutionalCatalog.js`, `presumedThings.widened.register.json` |
| 6 | w2-write-2026-11-13 | 525541b42 (13:24) | fdae163f3 | 1c01bdda0 | 2 registers/baselines | `wiring-census.json`, `.prose-byte-baseline.json`; clean-both: `RECEIPT_POOLS_DOSSIER_STATE.md`, `defense.generated.js`, `dossierStateProseProjection.contract.test.js`, both presumedThings registers, `proseComposed.walker.test.js`, `proseWiringCensus.walker.test.js`, `economicsTabFlow.test.js` |
| 7 | w2-c-leaves-2026-11-13 | 9ac076d5e (13:32) | da7a567f4 | fe6386f83 | none | clean-both: `src/domain/display/defenseDisplay.js` |
| 8 | r2-code-b-2026-11-13 | b23b48613 (13:36) | 30ed925ee (JOIN-1; JOIN-2 skipped it) | **ABORTED: STOP** (§6) | 9 bundles/metas + lighting (text kept ours, then aborted) | — (nothing landed) |
| 9 | coherence-upkeep-2026-11-12 | 660cb0893 (13:38) | 26474cda9 | 0537f92f3 | none | clean-both: `src/pdf/lib/viewModelBodySlices.js` |

Every merge: `verify.sh` no mismatch; lint-staged changed nothing; the hook's gates green at every push (type ratchet 167/167, strict-domain 1113/1113, eslint 0 errors).

## 3. Every code resolution

No code conflict met so far. Merged clean though both sides moved them (each read in both sides' diffs from the merge base; independent lines; both stand):
- `src/components/new/SummaryTab.jsx` (merge 4): the joined side's `prosperityInCrisisLine` (the Economy row and its tile sentence); the lane's `governingModifierWordsOf` passed to `FactionBar` (the governing chip in the Power tab's words).
- `tests/pdf/restoredSubsections.test.js` (merge 4): the joined side's `institutionHouseLabel` arm; the lane's governing-modifier arm.
- `src/data/institutionalCatalog.js` (merge 5): the joined side's Elder Grove successor (UPKEEP-CAPACITY C5); the lane's Sawmill `timber` tag and the Smelter's default desc (W2-FIX-DATA-13).
- Tests merged clean at merge 6, each pin moved by ONE side at its own line (so each stands by (d); the close measures): `proseComposed.walker` (joined: relations 165 -> 169; lane: corpus 2948 -> 2950); `proseWiringCensus.walker` (joined: resolved 492, unresolved 364 and their kin; lane: variants 2950, mean 3.45, the histogram); `dossierStateProseProjection.contract` (joined: relations 169, present/absent 492/364; lane: one DS-DEF-2 key in two lists); `economicsTabFlow` (joined: the W2-C-LEAVES and R2-CODE-B re-keys; lane: the export posture anchor in the record's noun).
- `src/domain/display/defenseDisplay.js` (merge 7): the joined side's UPKEEP-8 `monthsInWords` and `foodEnduranceLine`; the lane's W2-C-LEAVES-11 `oneOrganisationRules` in `rivalRingsHere`.
- `src/pdf/lib/viewModelBodySlices.js` (merge 9): the joined side's W2-C-LEAVES `resourcesSlice` rows; the lane's UPKEEP-14 `chainPrintName` in `economicsSlice`.
- `tests/generators/generationForkCensus.test.js` (merge 4): the joined side's A6 re-keys (FNV_EXTERNAL_CALLS 23, drawingSteps 13, STORES_SEED); the lane's mint bound `toBeLessThanOrEqual(138 -> 139)` (a pin only the lane moved: stands by (d); JOIN-3 measured 141 at the join).

## 4. THE LIST FOR THE CLOSE (registers, baselines, generated files, bundles, pins; each with the lanes whose side was not taken)

| file | lanes whose side was not taken (merge #) |
|---|---|
| `tests/lint/.lighting-census-baseline.json` | r3-code-c (1), r3-tabs (2), r2-code-a (3), powers (4), w2-fix-data (5) |
| `docs/content/wiring-census.json` | r3-tabs (2), w2-write (6) |
| `scripts/.writer-reach-baseline.json` | r2-code-a (3) (a door: banked once at the close, record 440) |
| `supabase/functions/_shared/engineBundle.js`, `engineBundle.meta.json` | r2-code-a (3) |
| `tests/lint/.tuning-inventory.json` | r2-code-a (3) |
| `scripts/census/page-census.register.json` | powers (4) |
| `scripts/census/pool-dominance.register.json` | w2-fix-data (5) |
| `tests/lint/presumedThings.register.json` | w2-fix-data (5) (and clean-both at 3, 6) |
| `scripts/.prose-byte-baseline.json` | w2-write (6) |

Pins (joined side kept inside the hunk): `tests/lint/proseWiringCensus.walker.test.js` `draft.docblockReports.length`: joined 43, r3-tabs 42 (merge 2; the lane's only change in the file).

Merged clean though both sides moved them (for the close to re-derive or measure by its door): `tests/lint/presumedThings.register.json` (3, 6); `tests/lint/presumedThings.widened.register.json` (5, 6); `tests/generators/generationForkCensus.test.js` (4, the mint bound A1); `src/data/dossierStateProse/defense.generated.js` (6, generated); `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (6); the pins of merge 6's four tests (§3). `docs/content/prose-shift-register.json` moved by w2-write alone (6): taken from the lane.

## 5. The count (CENSUS-2, `census2.sh <tree> <out> 4`, 720 seeds)

| kind | b6a5f97ab (before the merges; `/home/user/j4base`) | the landed tip |
|---|---|---|
| a | towns 516 · hits 1037 · lines 211 | — |
| b | towns 46 · hits 86 · lines 42 | — |
| c | towns 43 · hits 46 · lines 21 | — |
| d | towns 22 · hits 24 · lines 8 | — |
| e | towns 15 · hits 15 · lines 14 | — |
| f | towns 309 · hits 2280 · lines 53 | — |
| g | towns 0 · hits 0 | — |
| h | towns 2 · hits 2 · lines 2 | — |

## 6. Stops

- **r2-code-b at b23b48613 (merge 8, 13:36): STOPPED, `git merge --abort`, message to the chair 13:37.** The text merged clean (nine edge bundles/metas and the lighting census conflicted, kept ours), but A COMPOSED RED, EXECUTED: `tests/domain/crisisHooks.test.js` ×2 ("r2r-town-37: the dean holds the lever…", "r2s-plague_onset-thorp-0 and r2r-city-19: a lever who is a healer is still named") and `tests/generators/resolveCrisisCast.test.js` ×1 ("a DM's cast edit renames the holder…") red in the staged merge (31/34); 34/34 green at the lane's tip (in `/home/user/j4base`). File `src/domain/crisis/crisisHooks.js` :: `CRISIS_HOOK_SLOTS` / `slotCrisisHook`. The lane (R2-CODE-B-9/-12): the plague slot fills only a holder whose roster role is a healer; a stand-in is named without "healer". The joined side (W2-FIX-DATA-7 row 2, 745c05a1f): the stored plague hook resolves through its declared set (`needs: ['healer']`, `src/data/stressTypes.js`), so a town with no healer stores the slot-less twin "The first person to name the outbreak has gone quiet…"; the lane's pins expect the template on those towns. Both cure the same false healer from two ends; no one line keeps both; nothing re-keyed. RECOMMENDATION: the r2-code-b seat merges the joined line (or 745c05a1f) and re-keys its three pins by identity to towns that keep a healer (its own arm for a healer-less town then reads the twin), then lands as a point. Its other cures (incl. `src/domain/summary/tonightSheet.js`) wait with it.

## 7. Hazards

- The lanes moved between the brief's reading and the merges (r3-code-c 58242f2f5 at 12:56 -> da0f201e6 at 12:57): expected; each tip read back at its merge.
- `npm ci` wrote `core.hookspath=.husky/_` and `rerere.enabled=true` into the shared config (expected); nothing else moved it.

## 8. How the instruments are re-made

A worktree at origin's tip (`git worktree add /home/user/j4wt -b join4 <tip>`, `npm ci`, `git config rerere.enabled true`). `merge.sh <n> <lane-branch>` (fetch full depth, read the tip into `tip.<n>`, `git merge --no-ff --no-commit <full hash>`, list unmerged paths); a register `git checkout --ours` then `git add`; a pinned hunk kept by dropping the incoming side inside the markers only; `verify.sh <hash>` (each staged-changed file the joined side had not moved since the merge base equals the lane's blob; the both-moved files named); `commit.sh <msg>` (the tree before the hook equals the commit's); `push.sh` (fetch, tripwire, non-empty rev-list, plain push, refs and config compared).

## 9. WHAT IS LEFT (line by line)

r2-code-b (stopped, §6) waits on the chair; join-nolane at 3ccdc0711; join-surfaces at its tip; the build, the grid, the conflict files' tests and the count at the landed tip; item 4 (the Tonight sheet's famine line) if both halves are in; the remerge patches; the message to the chair.
