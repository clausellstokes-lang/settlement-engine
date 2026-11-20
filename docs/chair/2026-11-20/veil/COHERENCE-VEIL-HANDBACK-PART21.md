# COHERENCE-VEIL — hand-back, part 21: the twentieth seat (R1 merged; VR25's derivers; then R2 to R7 and E)

Seat: VEIL-20, branch `lane/veil-20-2026-11-20`. Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-20.txt` (the seventh chair is session_019yED1SUxGVHyjQnoqoFvQ8). Every
database is a scratch native PostgreSQL 16.15 cluster in this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth,
unix socket `/var/tmp/rv7` only, `listen_addresses = ''`) or in-process. No hosted database, no production credential,
no `supabase` command, no deploy, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

PART 20 section 0, PART 19 section 0 and PART 18 sections 0 and 4 stand whole (VR1 to VR17, THE CLEARANCE STANDARD,
SV1). The laws and the push paragraph of `prompts/VEIL-17.txt` and the split, staff, hand-back and push paragraphs of
`prompts/VEIL-19.txt` bind word for word. The seventh chair's rulings VR18 to VR27, SV7 and SV8 as written in
`CHAIR-HANDOFF-SEVENTH.md` section 5 (read at the seat's start). This seat's mark is 450,000 used tokens (SV8).

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at the cut) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at the cut) |
| 212 at the cut | `dae0ae6c344daab243af4136a6932ebd7da8cfceabce6df3d95bddf75e19e247` / down `45da09eb5c8ab2e134d613d56afa0cbc700f14a66233f77520e6cd67cf30a1c9` |

212 is NOT final. This seat has not opened 212, its rollback or the twin's rule files (VEIL-19 holds them until it
hands back "B/C/D <commit>").

## 2. The cut, measured first (01:24 to 01:32 UTC)

THE CUT: the checkout held origin/lane/veil-19-2026-11-20 at dd20c0f08, two commits above 72e8a855d (9cbc2fa9f,
dd20c0f08); `git diff --stat 72e8a855d HEAD` touches only `docs/chair/` (PART 20 and a receipt), and `git diff --stat
bedd5a392 HEAD -- . ':!docs'` is empty: the code is bedd5a392's. So the branch is cut from dd20c0f08, as the chair's
note allows. All three readings of the base REPRODUCED on `git archive` of the cut (`/var/tmp/v18/base`):
- THE ACCEPTANCE RUN (REVIEW-VEIL-7 `run-all.sh`): exit 1; checks 37 | PASS 35 | FAIL 2; a07 and d06 the only FAIL rows;
  server against twin "(all 15 equal)" (the library's hand rows, not born towns: VR15 (c)). `out/v20/acceptance-at-cut.txt`.
- THE READER'S DIFFER, the twin (N=2, four shards): towns 140, with a hideable house 91, B kept a hideable house 0, threw
  0; every eye shut: 235 differ A/B in two towns or more, **IN THE CLASS 130** (CRIME-WORDED 28, OTHER 40, NUMBER/BOOLEAN
  49, HISTORY RE-DRAW 13), re-roll 94; the default veil 138 (29, 43, 49, 17). `out/v20/differ-twin-*-at-cut.txt`.
- THE SAME DIFFER THROUGH THE SERVER (a chain 001..212 of the cut, the gallery read): the reader's gate (empty registry,
  the VR13 rng ruling) **`registered 0 | diffuse 0 | rng-only 20 | UNREGISTERED 124`**. `out/v20/differS-gate-at-cut.txt`.

## 3. R1 MERGED AND READ (item 2)

`git merge --no-ff` of origin/lane/veil-r1-2026-11-20 at 8943ce807 (three commits, new files only, no conflict): merge
commit 3c3e458b6. READ LINE BY LINE: the module (651 lines, 147 rows), the export (`--check`, `--all` refused inside the
tree), the walker (arms A to F and the census's own control), the manifest row. At the merged tree, executed:
`--check` exit 0 (`out/v20/r1-check-at-merge.txt`); the walker and the manifest test 2 files, 21 of 21
(`out/v20/r1-walker-at-merge.txt`). THE GATE on the cut's server shards (R1 changes no behaviour, so the shards stand):
committed export `registered 0 | diffuse 0 | rng-only 13 | UNREGISTERED 131` (R1's 131 and 13, exactly); every row
exported (`--all`, outside the tree) `registered 108 | diffuse 23 | rng-only 13 | UNREGISTERED 0` (R1's figures,
exactly). `out/v20/r1-gate-new-gallery-{committed,all}.txt`. The link and master's shape: running.

WHAT THE READ FOUND FOR THE STAGES (no row is changed here; each is the stage's to build):
1. `economy.prosperity` is a `diffuse` row in R1's module; the chair's ruling of 01:20 UTC (PART 20 section 0 (5))
   withholds it on every non-owner read under VR19 and `history.founding.overcoming` follows it: R2 re-classes both
   (and `tile.prosperity`, a copy, follows by construction).
2. The hosts `_gallery_veil_tile_columns` and `_gallery_veil_chronicle` (rows `tile.*`, `chronicle`) are VEIL-DOORS's by
   SV7; this seat builds neither and will re-point those rows to DOORS's symbols at its merge.

## 4. The list (the assignment's, in order), as it stands

| Item | State |
|---|---|
| 1. First act, measured | DONE (section 2) |
| 2. Merge R1, read it, its gate | DONE (section 3): all four runs reproduced |
| 3a. VR25, the import's derivers | BUILT (section 5); two walker rows wait on the chair |
| 3b. R2's render-twice harness | not started |
| 3c. VR26's inversion harness | not started |
| 4. "B/C/D <commit>" | waiting on the chair |
| 5. R2 to R7 | not started |
| 6. VR17, DOORS | waiting on the chair |
| 7. E | not started |

## 5. VR25, the import (02:08 UTC)

MEASURED FIRST (`measure/vr25/derivers.probe.jsx`; `out/v20/vr25/derivers-72-default-veil.json`, 72 born towns, 27
with a hideable house, the default veil, every withhold-always path and prosperity deleted; and
`derivers-36-magic-off.json`). Per field: a recorder notes every read of a withheld path; FIDELITY is the deriver on the
full stored town against the stored value; SERVED-TOWN is the deriver on the served document of a town with nothing
hidden against the stored value.

| Field | Deriver (the engine's own) | Withheld reads | Fidelity | Served-town |
|---|---|---|---|---|
| compound (both copies) | `getInstFlags(config, institutions)` | 0 | 72/72 | 45/45 |
| safetyRatio | `generateSafetyProfile`'s rule over that compound | 0 | 72/72 | 45/45 |
| storageMonths | `foodSecurity.foodRecord.storageMonths` | 0 | 72/72 | 45/45 |
| prosperity (VR19) | `computeBaseProsperity` + `deriveProsperityLabel` | 0 | 59/72 | 32/45: the 13 Subsistence bases take a birth draw (Struggling or Poor) |
| readiness.score | `defenceExactOf` (the probe read it through `generateDefenseProfile`, whose economic cap reads prosperity) | 0 in the build | 72/72 | 45/45 |
| conditions' severity | `promoteStressorsToConditions` | through prosperity only | 72/72 | 35/45: the 10 are Subsistence towns, and both outcomes give the same modifier |
| legitimacy breakdown | `computePublicLegitimacy` | through prosperity only | 72/72 | 32/45 (prosperity's cause in the 13) |
| quarters | `generateSpatialLayout` (draw-free) | 0 | 72/72 | 45/45 |
| the cast's role and reason | none: the occasional roles take the seed | — | — | — |

THE BUILD: `src/domain/veil/importRederive.js :: rederiveServed` (and `rederiveInPlace`), called by
`src/store/galleryImportSettlement.js :: importGallerySettlementImpl` on the served document before the save. Each field
re-derived from the served document; an input the document cannot give (a Subsistence town's prosperity) is tried at
every value it can take and a field derived from it is kept only where all agree; else the field is left out: prosperity
and its legitimacy cause in Subsistence towns; the crisis cast's roles, absences and stakes on every import (a name with
no role would draw ": Name ·"). No config: every field left out.
THE TEST `tests/store/galleryImportRederive.test.js` (nine born towns through the tree's own import, the share withheld
by the registry's own withhold-always rows plus the chair's prosperity ruling): RED at the unwired import, 3 of 5 (the
ten absent on the importer's record; `out/v20/vr25/test-red.txt`); GREEN 5 of 5 (`test-green.txt`); arm 2's power by a
planted read of `blackMarketCapture`, red on every town, the file restored byte-identical (`test-plant-arm2.txt`).
GATES: eslint 0; `typecheck:domain:strict` 1113 of 1113; `typecheck:ratchet` 167 of 167 (`typecheck.txt`); the registry
walker 11 of 11; the import's neighbours 6 files, 46 of 46. THE `tests/lint` DIRECTORY (`lint-dir-summary.txt`): the
base's ten reds as R1 named them, and five of mine: three cured (`deepCloneHotPath`: the clone seam; the any-cast
baseline: zero `any` holes; `seedLoopTotality`: one loop asserting inline), TWO LEFT FOR THE CHAIR (`lint5-after-cures.txt`):
1. `ruinFilterRoster`: the module reads the served `.institutions` raw, as the birth derivers read it (the stamped
   roster, ruins included: `economicState.js`'s own note); proposed a `RUIN_AGNOSTIC_EXEMPT` row ("the import's
   re-derivation hands the engine's birth derivers the roster they read at birth") and the pin 116 -> 117, VR2's form.
2. `observedShapeReaders`: violations 1 at the cut (`osr-at-cut.txt`, criminalVeilSwitch's, not mine) -> 4
   (`osr-at-vr25.txt`): "magicExists on config" in `prosperity.js`, `foodGenerator.js`, `priorityHelpers.js`, because the
   scanner now grounds their `config` parameter from the import's call through the served document's config, which its
   corpus never saw carry `magicExists`. MEASURED: born and served configs carry `magicExists` (true, and false with magic
   off), and fidelity holds with magic off (36 of 36). A false finding of the heuristic; the inventory is never raised by a
   seat: for the chair (an explained-writer row, or another ruling).
THE SURPRISE SENT (02:0x UTC, before the build): the served `publicLegitimacy.score` gives back the withheld prosperity
(one contribution class fits the score in 72 of 72 towns, always the stored label's; 9 towns where the hidden house moved
prosperity told). Proposed: the score, label and colours re-classed under VR19 with prosperity. Awaiting the chair.

## 6. How the instruments are re-made

PART 20 section 4, at the same paths: the cluster `/var/tmp/v18pg` (socket `/var/tmp/rv7`, `fsync = off`); `pg@8.13.1`
in `/var/tmp/v18/pgmod`; the readers' library `git archive 72a3bb24f …REVIEW-VEIL-6 …-7 …-8` (fetch
`lane/review-veil-3-2026-11-12` first) and `git archive origin/lane/review-veil-9-2026-11-19 …REVIEW-VEIL-9`, both into
`/var/tmp/v18/lib`; the reader's probes copied flat into `/var/tmp/v18/rv9` with the three `/var/tmp/v16/rv9/` imports
re-pointed; the base `/var/tmp/v18/base` = `git archive` of the cut, `node_modules` linked; master
`/home/user/wt/master` (a detached worktree at db832c892, `node_modules` by `cp -al`); R1's runner
`run-differ-server2.sh` copied to `/var/tmp/v18/`. Outputs under `/var/tmp/v18/out/v20/`.
