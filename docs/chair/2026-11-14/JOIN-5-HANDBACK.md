# JOIN-5 — the hand-back (2026-11-14): THE THIRD LANDING

Seat JOIN-5 (session `session_01ACmDYazSdYC8v2Fj1WVnzT`), brief `docs/chair/2026-11-14/briefs/BRIEF-JOIN-5.md` on `lane/chair-2026-11-08`. Kept current after every landing. Started from **e5b421802** (origin's tip read back at 15:47 UTC; the tip the brief named). Full history fetched (`is-shallow-repository` false). Worktree `/home/user/j5wt` (local branch `join5`), its own `npm ci`, `rerere.enabled true`. Instruments in `/home/user/j5out/` (outside every tree): `merge.sh`, `verify.sh`, `commit.sh`, `push.sh` (§8). Every push plain by `git push origin join5:refs/heads/lane/join-2026-11-14` after a fetch (tripwire: origin must equal the last tip this seat pushed) and a non-empty rev-list; refs and local config of the shared repository snapshotted before and after every push.

## 1. The laws worked to

JOIN-4's (a) to (f), copied from its hand-back §1, stand; the chair's rulings of 2026-11-14 15:35 UTC (the brief; each vetoable by the owner) change them by (a'), (c') and add (g), (h), (i):

(a) ONE MERGE COMMIT A LANE (`git merge --no-ff --no-commit <the full hash read back>`), in the order r3-code-c, r3-tabs, r2-code-a, powers-follow-up, w2-fix-data, w2-write, w2-c-leaves, r2-code-b, coherence-upkeep; the tip read at the merge IS the point; what a lane pushes afterwards lands later. NOT MERGED, whoever asks: lane/upkeep-monotone-2026-11-14, lane/coherence-veil-2026-11-11, any review branch.
(b) A CODE CONFLICT: the file read whole; BOTH LANES' CURES STAND. A hunk that needs a CHOICE between two behaviours is a STOP FOR THAT LANE: `git merge --abort`, one message to the chair (file, function, both sides' intent), go on with the next lane.
(c) A REGISTER, A BASELINE, A GENERATED FILE OR AN EDGE BUNDLE that conflicts: THE JOINED SIDE IS KEPT (`git checkout --ours`, `git add`) and the file LISTED with the lane, for the close. One that merges clean though both sides moved it is LISTED too. No door in a writing mode: after these merges the registers are NAMED REDS until the close's one refreeze.
(d) A PINNED FIGURE in a test BOTH sides moved: the joined side kept INSIDE the hunk, every change outside the hunk standing, the pin LISTED (file, title, both figures): MEASURED at the close, never summed. A pin ONLY THE LANE moved merges clean and stands.
(e) AFTER EACH MERGE, BEFORE ITS COMMIT: every file the merge changed equals the lane's blob wherever the joined line had not moved it; lint-staged changes nothing. Then the commit; the hook's three gates at the push. A gate RED after a merge: which side's change by `git diff`; a ceiling never raised, no error suppressed; a COMPOSED RED cured only if one line keeps both behaviours (its own commit), else STOP FOR THAT LANE.
(f) EVERY PUSH PLAIN, explicit refspec, after a fetch and a merge of whatever JOIN-3 pushed (docs); a rejected push fetched, merged and pushed again; never a force.

The changes (copied from the brief):

(a') THE ORDER, each at the tip you read back at its merge (BUILDERS ARE PUSHING ON MOST: the tip you read IS the point; a lane whose tip equals the tip JOIN-4's table shows landed is skipped and said so): lane/r2-code-a-2026-11-13; lane/w2-fix-data-2026-11-13; lane/w2-write-2026-11-13 (the corpus); lane/w2-write-side-13-2026-11-14 (the corpus's side branch: the same source document, other sections); THEN THE CORPUS'S DOOR (g); lane/w2-c-leaves-2026-11-13; lane/r2-code-b-2026-11-13; lane/join-surfaces-2026-11-14; lane/exports-b1-2026-11-14; lane/exports-b3-2026-11-14 (skip it if origin does not hold it yet); lane/exports-b24-2026-11-14; lane/join-nolane-2-2026-11-14. NOT MERGED, whoever asks: lane/coherence-veil-2026-11-11, any review branch, any `lane/read-all-…` branch, the chair's lane.
(c') A CORPUS LEAF IS NOT A REGISTER: IT IS THE PRODUCT. A conflict in src/data/dossierStateProse/*.generated.js or in a manifest the generator writes takes the joined side inside the merge commit like any generated file, AND IS THEN MADE GOOD BY (g) before the next lane: a stale leaf silently drops a cure.
(g) THE CORPUS'S DOOR, after the two corpus merges: `node scripts/generate-dossier-state-prose.mjs --check` at the landed tree. If it refuses because the wiring census is stale: that register is re-taken THROUGH ITS OWN DOOR (`node scripts/wiring-census.mjs`), in its own commit, its body saying what moved (A REGISTER THAT A DOOR NEEDS IN ORDER TO OPEN IS RE-TAKEN THROUGH ITS OWN DOOR: the one exception to "you re-derive no register"). If it then reports a leaf stale against the source document: the leaves are rebuilt through the door (`node scripts/generate-dossier-state-prose.mjs`), their own commit, its body naming each leaf that moved; then `--check` exits 0. Nothing by hand.
(h) ONE LINE CURED TWICE, the chair's own fault: the Foundry journal's provenance tag on an armed force was cured on lane/r2-code-b-2026-11-13 (a48cf4126) AND on lane/exports-b24-2026-11-14 (2779a3d6d). The lane lands first. If the builder's branch then conflicts in those lines: THE LANE'S LINES STAND and the builder's hunk yields (that is not a choice between behaviours: both remove the tag); the builder's guard test is kept if it is green on the merged tree, else left out of the merge and NAMED. Any other conflict among the three exports branches and the surfaces lane (all four edit src/pdf/ and src/foundry/): law (b): the file read whole, BOTH CURES STAND, or a stop for that branch.
(i) A LANE THAT HOLDS A MERGE OF THE JOINED LINE (most now do) merges as any other; its re-taken wiring census, if both sides moved the register, is the joined side's by (c) and (g) decides whether the door still opens.

THE CHAIR'S RULINGS SENT AFTER THE BRIEF: none so far.

## 2. The landings

| # | lane | tip merged (read at the merge, UTC) | tip last landed (JOIN-4) | merge commit | conflicts | listed for the close |
|---|---|---|---|---|---|---|
| 1 | r2-code-a-2026-11-13 | e5064e855 (15:48) | bc9194bf7 (JOIN-4 merge 3) | 1a039553d | none | — |
| 2 | w2-fix-data-2026-11-13 | e6e1893f4 (15:52) | 8e814883c (JOIN-4 merge 5) | e9601b6b3 | none | `.lighting-census-baseline.json` (the lane's re-take 6f86693a5 yielded in its own merge 81df6fb80) |
| 3 | w2-write-2026-11-13 (the corpus) | 9b08e5b69 (15:55) | 525541b42 (JOIN-4 merge 6) | 88bfa6885 | none | lane-only, taken from the lane: `wiring-census.json` (re-take e28e1305f), `presumedThings.widened.register.json` (b159401a1), `defense.generated.js` (leaf; (g) below) |
| 4 | w2-write-side-13-2026-11-14 (the corpus's side branch) | f2bf55f1e (16:00) | — (base 525541b42) | b4dad83e4 | none | clean-both: `RECEIPT_POOLS_DOSSIER_STATE.md`, `corpusCureGuards.test.js`, `proseComposed.walker.test.js`, `proseWiringCensus.walker.test.js`; lane-only leaf `general.generated.js` |
| (g) | THE CORPUS'S DOOR at b4dad83e4 | `node scripts/generate-dossier-state-prose.mjs --check` | — | — | — | **exit 0**: 69 state blocks / 2951 variants verified; the census not stale, no leaf stale; nothing re-taken, nothing rebuilt |
| 5 | w2-c-leaves-2026-11-13 | 5f95bf473 (16:04) | 9ac076d5e (JOIN-4 merge 7) | 770e20190 | none | — ((g) `--check` re-run after it: exit 0) |
| 6 | r2-code-b-2026-11-13 | 2d418c67f (16:07) | a86646b84 (JOIN-4 point 1) | f7288399f | none | — (5 files staged: M10 the journal force tag, M12 the faith contender; law (h): the lane lands first) |

## 3. Every code resolution

No code conflict so far. Merged clean though both sides moved them (each read in both sides' diffs from the merge base; independent lines; both stand):
- Merge 4: `tests/lint/proseComposed.walker.test.js` (joined: relations 165 -> 169; lane: corpus 2950 -> 2951); `tests/lint/proseWiringCensus.walker.test.js` (joined: resolved 492 / unresolved 364, relations 169, the draft 19 · 5 · 83 · 43, SOURCE-UNRESOLVED 857; lane: variants 2951 and the histogram 4: 147, 5: 45); `tests/domain/corpusCureGuards.test.js`; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Each pin moved by one side at its own line: stands by (d); the close measures.

## 4. THE LIST FOR THE CLOSE

JOIN-4's §4 carried forward WHOLE below; JOIN-5's additions marked **[J5]**.


| file | lanes whose side was not taken (merge #) |
|---|---|
| `tests/lint/.lighting-census-baseline.json` | r3-code-c (1), r3-tabs (2), r2-code-a (3), powers (4), w2-fix-data (5), upkeep-monotone (P2) |
| `docs/content/wiring-census.json` | r3-tabs (2), w2-write (6) |
| `scripts/.writer-reach-baseline.json` | r2-code-a (3) (a door: banked once at the close, record 440) |
| `supabase/functions/_shared/engineBundle.js`, `engineBundle.meta.json` | r2-code-a (3) |
| `tests/lint/.tuning-inventory.json` | r2-code-a (3), upkeep-monotone (P2) |
| `scripts/census/page-census.register.json` | powers (4) |
| `scripts/census/pool-dominance.register.json` | w2-fix-data (5) |
| `tests/lint/presumedThings.register.json` | w2-fix-data (5) (and clean-both at 3, 6) |
| `scripts/.prose-byte-baseline.json` | w2-write (6) |

Pins (joined side kept inside the hunk): `tests/lint/proseWiringCensus.walker.test.js` `draft.docblockReports.length`: joined 43, r3-tabs 42 (merge 2; the lane's only change in the file).

Merged clean though both sides moved them (for the close to re-derive or measure by its door): `tests/lint/presumedThings.register.json` (3, 6); `tests/lint/presumedThings.widened.register.json` (5, 6); `tests/generators/generationForkCensus.test.js` (4, the mint bound A1); `src/data/dossierStateProse/defense.generated.js` (6, generated); `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (6); the pins of merge 6's four tests (§3). `docs/content/prose-shift-register.json` moved by w2-write alone (6): taken from the lane. `tests/lint/.tuning-register.json` moved by upkeep-monotone alone (P2): taken from the lane. `src/domain/summary/tonightSheet.js` (P1, clean-both with item 4). The goldens the rebuild's declared moves shift (P2): `tests/property/generatorGoldenMaster.test.js`, `tests/property/espionageDormancyFence.test.js` (red and named by that lane), with its re-keyed pins (its `UPKEEP-MONOTONE-BUILD.md` step 3); the edge bundles are stale against every src change since JOIN-3's rebuild (128ab68c7): rebuilt once at the close.


**[J5] additions:**

| file | lanes whose side was not taken (JOIN-5 merge #) |
|---|---|
| merged clean though both sides moved (4) | `RECEIPT_POOLS_DOSSIER_STATE.md`, `corpusCureGuards.test.js`, `proseComposed.walker.test.js`, `proseWiringCensus.walker.test.js` (pins, §3) |
| lane-only registers taken from the lane | `wiring-census.json` (w2-write 3, e28e1305f), `presumedThings.widened.register.json` (3, b159401a1); leaves `defense.generated.js` (3), `general.generated.js` (4): (g) exit 0 at merge 4 |
| `tests/lint/.lighting-census-baseline.json` | w2-fix-data (2): its re-take for one new test title (6f86693a5, the R3C-REVOLTNOTE guard) yielded inside the lane's own merge of the joined line (81df6fb80) |


## 5. Item 2 at the landed tip

Not yet run.

## 6. Stops

None so far.

## 7. Hazards

- `npm ci` wrote `core.hookspath=.husky/_` and `rerere.enabled=true` into the shared config (expected, as JOIN-4 saw).

## 8. How the instruments are re-made

A worktree at origin's tip (`git worktree add /home/user/j5wt -b join5 <tip>`, `npm ci`, `git config rerere.enabled true`). `merge.sh <n> <lane-branch>` (fetch full depth, read the tip into `tip.<n>` with the minute, `git merge --no-ff --no-commit <full hash>`, list unmerged paths); a register `git checkout --ours` then `git add`; `verify.sh <hash>` (each file the lane moved since the merge base that the joined side had not moved equals the lane's blob in the index; any staged change the lane did not make is a mismatch; the both-moved files named); `commit.sh <abs msg file>` (the tree before the hook equals the commit's); `push.sh` (fetch, tripwire, non-empty rev-list, plain push, refs and config compared). The remerge patches: `docs/chair/2026-11-14/probes/JOIN-5/NN-<lane>.remerge.patch` by `git show --remerge-diff <merge> -- .` (excluding each listed register, baseline and bundle).

## 9. WHAT IS LEFT

Merges 2 to 11 in the brief's order, (g) after merge 4, item 2, the item-3 message, the chair's points.
