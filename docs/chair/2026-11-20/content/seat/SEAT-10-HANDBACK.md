# SEAT-10 — HAND-BACK (kept current at every push; first written 2026-11-21T23:21:00Z, read from `date -u`)

**For the next owner of this lane:** you need this file, `SEAT-9-HANDBACK.md` (items 80 to 85), `SEAT-7-HANDBACK.md` (items 69 to 79, §2 to §7), `SEAT-6-TO-LIGHT.md` and `briefs/`.

The rulings in force are SEAT-5's 1 to 52, SEAT-6's 53 to 68, SEAT-7's 69 to 79, SEAT-9's 80 to 85, and this file's 86 on.

SEAT-10's assignment is `docs/chair/2026-11-21/eighth/prompts/SEAT-10.txt` on `origin/lane/chair-2026-11-08`, from `12efb6f5f` on.

The chair is the eighth chair, session_01ACmDYY29VRchM87v1yhL9Q.

## 0. WHERE THE LANE STANDS (brought up at 2026-11-22T14:13:35Z, read from `date -u`)

- **Lane tip:** `lane/seat-10-2026-11-21`, pushed with this file.
  - **The base:** fast-forwarded at 23:41:11Z (from the reflog) to the chair's base `3e6894120`, which is `3e8e2e37d` (SEAT-9's tip) plus the line `a64619510` (point 86) plus this seat's `f82c2a183` (item 88).
  - **The lane's own commits since:** `18530fc0d` (unit 2's docs, the re-cut script); `5e26f4062` (wiring census); `ef5abf4da` (lighting census); `9fa2612b1` (KEY-PROBE's play addendum); `70e4e1945` (writer-reach, item 89); `5c9fa5b81` (unit 2's play-time answer, item 90); `18e291616` (UK-LEGACY's brief); `a4b3fff4a` (UK-LEGACY merged, BUL `d9133148d`, item 91). The others are hand-back commits.
- **The working line:** `lane/join-2026-11-14` has moved to `89ab44e34` (point 87, the sameness door: no `src/`, two new `tests/lint` walkers). By the chair's word of 23:41Z the lane stays on `a64619510` for the census; the chair joins the newer line at the landing.
- **UNIT 1 (the line): DONE except its proofs in flight.**
  - **The doors:** each re-taken by its own door, red before and green after: the wiring census, the lighting census, writer-reach (on the chair's three-way condition, item 89). The `npcGenerator.js` size baseline needed nothing: `sizeBaseline.test.js` is green at 930. The mutation manifest, the chair's union, is green.
  - **`tests/lint` whole** at `ef5abf4da`: 219/220 files and 3,270/3,271 tests. The one red is writerReach's round-trip, taken before its door; that walker was re-run 52/52 green at `70e4e1945`.
  - **THE LANE'S DARK PROOF OVER THE LINE:** `confine-two.sh a64619510 4ab09fd6a` is **EQUAL** (`all 49459c04…bc8ebc`, 1245 places; 00:22:53Z).
  - `confine-two.sh 3e8e2e37d 4ab09fd6a` is DIFFER (00:28:12Z), as expected: it differs by the line's own births and proves nothing of the lane's (the chair, 00:10Z).
  - Both ran in the exclusive slot: the shared tier refuses a command that declares no worker cap.
  - The typechecks and eslint are the chair's, at the base, and green. The lane's commits since touch only docs and registers.
- **UNIT 2: DONE.**
  - **At birth (item 87):** accepted by the chair at 23:42Z.
  - **Over play time (item 90):** accepted by the chair at 00:10Z (the pulse's own road not exercised; the coup road stands in for it).
- **UNIT 3 (the flip's census, re-cut): DONE (item 92; the four lists in `recut/CENSUS-LISTS.md`).**
  - Flipped: 46 reds in 26 files. Control: 24 in 16. The lists are (1) 10, all ten pins red; (2) 12 rows in 7 files; (3) 0; (4) 24, 23 of them in RED-AT-LINE by name.
  - The 24th known red is `seatLawSavedTown` arm 4. It is a lane red and is **cured by UK-LEGACY** (item 91).
- **UK-LEGACY (the chair's order of 02:52Z, before "SEAT <commit>"): MERGED at `a4b3fff4a`.**
  - At the merged tip: `seatLawSavedTown`, `seatBandFold` and `roleCategory` pass 60/60 (03:46:04Z).
  - **THE DARK PROOF** `confine-two.sh a64619510 a4b3fff4a` is **EQUAL** (`all 49459c04…bc8ebc`, 1245 places; 03:52:31Z).
  - **Accepted by the chair at 03:54Z** with unit 3. The sweep's five: (a) the bundle is the close's (the owner's rebuild); (b) and (c) go into U6's brief; (d) see item 91; (e) fixed in the tip's commit (comments only, `seatLaw.js` header and `npcGenerator.js :: generateNPCPowerLevel`'s call; no effective line moves; sizeBaseline, seatLawWiring and the densityCreateBoundary walker 26/26, eslint clean).
- **THE LINE AGAIN: DONE (item 93).** The chair merged the line `f5295e425` (points 87 to 93) into this seat's `bb4c3e874` as `e8bc160f8` (`lane/seat-10-base-2026-11-21`). That merge had five register or table conflicts and no code conflict. The lane fast-forwarded to it at 04:06:18Z.
  - **The registers, each by its own door, each its own commit with its proof:**
    - the wiring census `0ac91da7c`: `producerIndexFiles` 1441 → 1446, 0 rows moved; `proseWiringCensus.walker` 79/79 after, the alias-draft pins 25 and 22 re-measured and holding;
    - writer-reach `1d551fd54` (COMMON-RULES 9): the three-way proof gives 12,701 rows on all three, 21 the line's, 4 the lane's (the four rows of item 89), 0 neither, 0 new, 0 missing; the walker 51/52 before, 52/52 after;
    - the tuning inventory `99011ef51`: the lane's `SEAT_CIRCUMSTANCE_TUNING` row, which the merge's line side had dropped, restored byte-equal to `bb4c3e874`'s; no value moved; the walker 75/76 before, 76/76 after;
    - the lighting census `1bd8a1148`: 3741 → 3748 files; the walker 33/34 before, 34/34 after.
  - **Unchanged and green:** the sameness door's hand list (the lane adds no pool table: `samenessHideable.walker` green), the size baseline and the mutation manifest (121/121 with the two walkers).
- **THE OWED ARM: MERGED at `b7a373480` (item 94; BSR `8328ba467`).** The lighting census was re-taken by its door at `a94f7d097` (titles 31664 → 31665).
- **CONTEXT:** this seat's context was compacted once, between 00:30Z and 02:04Z. Before the next merge it re-read whole SEAT-10.txt, COMMON-EIGHTH, this file's §1 and COMMON-RULES 8 and 9 (told to the chair 04:28Z).
- **UNIT 4 (rule 8): DONE (item 95; `rule8/RULE8.md`). "SEAT <commit>" is sent to the chair with this push.**
  - **(a)** The build is clean at `08b0ba7d2`. VERIFY_DIST 61/66; the five reds are the five build rows, red on the line. The five figures are in `LANDING-LISTS.md` §5.
  - **(b)** 1,387 files, 13,913 tests, 61 failed, **every one on RED-AT-LINE by name** (fresh at `0ac15c2e0`). One title has drifted: `landingFixtureFreshness`, stale at the line itself, and unmoved by the lane (CONFIRMED).
  - **`tests/lint` whole:** 223 files, 3,362 tests, 3 red (the line's own three: `proseCorpusBytes` RAW and GZIP, `proseComposed` A0b).
  - **The line tip the run stood on:** `f5295e425`.
- **"SEAT 46339e5c7" ACCEPTED FOR LANDING (the chair, 07:20Z).** It is stacked after points 94 to 96 with the fortune lane. NO COMMIT under `src/` or `tests/` on this lane until the chair says it is landed.
- **SINCE (docs only), each committed and pushed:**
  - the worker's +15,961 itemized exactly (`rule8/WORKER-ITEMIZED.md`, accepted: `cultureOfficeTitles.js` +9,369 through `isSovereignSeat`; the five seat modules +8,126);
  - U7's probe (`u7probe/U7-PROBE.md`: 6 of 11 kept-form transfers name the old house's person; U7 is ruled before the first deploy, after U6);
  - U6's probe (`u6probe/`).
- **THE FINISH LINE (the chair, 07:21Z):** before the first deploy, U6 then U7. U9 to U14 and CS21/22 are second-deploy work: no brief. U8, the flip, is the chair's.
- **U6 THE PROSE (CS12): OUT to builder BU6.**
  - **Brief:** `briefs/U6-PROSE.md` at `2786f0178`, carrying the chair's ruled wordings verbatim: W1 six, W2 one, W3 five, by `pickVariantMixed`. Plus the gate `!isVeiledRow(holder)`, the hand list, the council-access clause as a gate only, and faults (b) and (c) red first.
  - **Where:** scratch clone `bu6`, branch `u6` cut at `46339e5c7`. Its work goes up as `lane/seat-10-2026-11-21-u6-wip`.
  - **Merge:** into the lane ONLY on the chair's word after "SEAT" lands, once its diff is read whole and its red and green re-run.
  - **Then the integrator:** the dark proof; the doors; `tests/lint` whole; the commonest W1 and W3 sentence by size on the 150 lit births (bar about 15%), one line to the chair; "SEAT-B <commit>".
- **U6 RETURNED (BU6 `98d998287`), PUSHED as `lane/seat-10-2026-11-21-u6-wip` (09:13Z); its diff read whole.**
  - **Done:** W1/W2/W3 by `pickVariantMixed`; the gate; the clause gate; fault (c) red first (`u6f-town-18`); hand list 74; the new test 9/9; flipped, only the census's list-1 pins red.
  - **Asked of the chair (09:13Z):**
    - (1) the R2 holders are not reached at the power step (28 of 63 rows): widen the manifest to a final-record pass in `generateSettlementPipeline.js`?
    - (2) W3 at any rank?
    - (3) fault (b): no witness in 600 births (0 of 526 calls differ); close it?
  - **At the merge, the integrator owes:** the mutation-manifest row for `tests/generators/seat/seatHolderLines.test.js`, and the wiring and lighting doors.
- **POINT 97 IS THE LINE (the chair, 10:49Z): `lane/join-2026-11-14` = `1ec3e81d1`, holding this lane's `46339e5c7`.** The word to merge is given.
  - **The line's merge:** `1ec3e81d1` merged into the lane as `4e9e58f8f` (11:04Z; clean, no conflict, pushed).
  - **The registers:** at the line's side; the seven walkers 285/285 and wiring `--dry` delta 0.
- **U7 MERGED into the lane as `553b27368` (BU7 `8abd0eeb1`, read whole: E76's measure, E77's one fact and U5-STALE; the chair's E81 accepts both points).**
  - **The doors, each its own commit:** the prose numerics `ea9f5c449` (four rows re-addressed +8, no new debt); phoneChromeFloor `4be9bccd7` (floored +1 on /create, /gallery and /settlements, bare unmoved); the lighting census `a20eaddef` (3759 → 3760). Writer-reach, the size baseline, the manifest and wiring were unchanged, green.
  - **THE DARK PROOF:** `confine-two.sh 1ec3e81d1 a20eaddef` is **EQUAL** (`all 07873739…`, 1245; 14:08:27Z).
- **THE BAR (E79):** it reads SENTENCES as printed. W1 and W3 pass (at most 10.0%); the templates are named, not barred (`bar/BAR.md`). No new wordings.
- **OUT: BU7 on E81** (branch `u7b` from `a20eaddef`): both sides of the hat rule pinned by name; the tonight sheet prints no office word for the old person; first paint measured, with a leaf for U5-STALE if a few lines do it.
- **NEXT:** merge E81's follow-up; then rule 8 as widened (the build and its five figures; the directories, the governing suites, `tests/copy`, `tests/store`, `tests/architecture`, `tests/docs`, `tests/domain` flat, `tests/lint`, `tests/build`); the flip's census at the final tip; then "SEAT-B".
- **U6 MERGED into the lane as `674148b9c` (BU6 `e2a221ac6`, read whole; the chair's word of 10:49Z).**
  - **The one conflict:** the hand list's ceiling, resolved as the union (`HAND_CEILING` 75 = the line's 74 + U6's row; 75 rows).
  - **The doors:** the mutation-manifest row `3113d621b` (TOTALITY red before, 10/10 after); the lighting census `21edae3ae` (3758 → 3759, 34/34 after). Wiring `--dry` and writer-reach were unchanged, green.
  - **THE DARK PROOF:** `confine-two.sh 1ec3e81d1 21edae3ae` is **EQUAL** (`all 07873739…`, 1245 places; 12:10:50Z).
- **E76's MEASURE (BU7):** all 24 R3 births are bucket (i). The office person belongs to no other house, so the chain keeps the record's person, and the four "nobody" cases go away. Sent to the chair 12:01Z, with the proposed build: one fact, the fall-back removed, and U5-STALE.
- **E70 (the chair, 10:26Z):**
  - **U7:** DONE at `lane/seat-10-2026-11-21-u7-wip` `fb0c732f9`, diff read whole. Covered: the person rule, `seatHolderFindings.js` widened (red first 6/6), the caption "Holds the seat of {form}.", `U7-OWNER-VIEW.md`. Two rulings asked at 11:2xZ:
    - (A) 3 lit births now name nobody;
    - (B) the old person survives on three surfaces after a kept-form transfer; a unit U5-STALE in `transferRulingPower` is proposed.
  - **U7's doors at the merge:** lighting, `.prose-numerics-baseline.json`, and `phoneChromeFloor` ROUTE_BASELINE (floored +1 ×3; bare unmoved).
  - **U6:** BU6 on ADDENDUM 2 (the totality test; the measure of `regenSection('npcs')`).
- **U6 FINISHED (E65 applied): `lane/seat-10-2026-11-21-u6-wip` at `c1ffee696`, diff read whole.**
  - **The pass:** `factionStanding.js :: settleSeatHolderToRecord` in `generateSettlementPipeline.js`.
  - **Coverage:** W1 63/63, W3 78/78, W2 0 (no licensed pair born); the bar is at most 16%.
  - **Fault (b):** closed, with a guard.
  - **NAMED:** a regex copy of the standing ladder's lines; regen does not re-run the pass.
  - **At the merge:** the lighting door and the mutation-manifest row; confine-two.
- **U7 BUILT: `lane/seat-10-2026-11-21-u7-wip` at `0b3ed8802`, diff read whole (`powerStrata.js` only).** Four rulings asked of the chair at 10:25Z:
  - (1) the faction and the ruler move to the holder in 112 of 160 lit births at birth;
  - (2) the person reading;
  - (3) `seatHolderFindings.js` raises a false finding on the six (outside the manifest);
  - (4) two wording drafts.
- **U7 (earlier):** OUT to builder BU7 beside U6. The chair's E45 of 07:46Z allows two builders when their files are disjoint.
  - **Brief:** `briefs/U7-PAGE.md` at `daaaddb96`. Red first on U7-PROBE's six seeds; no wording without a ruling; the audience `reader` on served reads.
  - **Where:** scratch clone `bu7`, branch `u7` cut at `46339e5c7`. Its work goes up as `lane/seat-10-2026-11-21-u7-wip`.
- **THE PACE:** the owner's word (07:46Z) withdrew "spend little"; pushing at every unit and a current hand-back stay. "SEAT 46339e5c7" is being landed as point 97.
- **NEXT:** the chair's rulings on U7. Then, on the chair's word after point 97 is the line: merge U6 and U7, run the dark proof and the doors, run `tests/lint` whole, and send "SEAT-B <commit>".
- **OUT:** none (BU6 and BU7 returned; either may be resumed). BKP, BUL and BSR are finished.
- **The wip branch** `lane/seat-10-2026-11-21-wip` (`2b3489eef`) is superseded: everything on it is on the lane.

## 1. RULINGS AND FINDINGS SINCE SEAT-9's HAND-BACK

86. **THE LINE'S MERGE WAS REFUSED BY THIS SEAT'S PERMISSION CHECK (23:20Z).** By COMMON-EIGHTH 8 the refusal stands. It went to the chair in one line, and the chair's word decides the route.

87. **THE KEY QUESTION, ANSWERED BY MEASURE (BKP, `briefs/KEY-PROBE.md` → `keyprobe/keyprobe.md`; CONFIRMED by run at `f82c2a183`). No key path is new under law 2 at birth.**
   - **Pairs:** 166 birth pairs (the corpus's `CONFIGS × SEEDS` 16, plus 6 sizes × 25 germanic seeds), each born with `_seatLawVersion` 1 and 2 through `generateSettlementPipeline`.
   - **Result:** law 2 writes no key path that law 1 lacks, and the reverse holds too. There are 1,028 paths under each law with the corpus's fold and 1,068 with no fold.
   - **Both contest dials:** the result is the same with the contest dark and lit (a scratch clone, one edit). Arm B's law-1 births equal arm A's on 10 of 10 hashed pairs.
   - **Law 2 acts:** law 2 moves values on 10 of 10 hashed pairs.
   - **Caveat:** the marker `_seatLawVersion` on `config` and `_config` is absent from the corpus. Its one reader, `seatLaw.js :: resolveSeatLawVersion`, uses computed access, which the scan cannot see, so it is no finding and there is no baseline row.
   - **So:** no explained-writer row is owed.
   - **Not measured:** play-time writes (the pulse and the coup, where the contest dial is read).
   - **Seen in passing, PLAUSIBLE:** on the 10 hashed pairs the lit contest leaves the law-2 birth byte-equal. TO-LIGHT §2 expected `factionStanding.js`'s "contestedBy" to move at birth when lit. The census re-cut will show whether it does.

88. **THE LINE CAME IN BY THE CHAIR'S HAND, AND THE LANE TOOK IT BY A FAST-FORWARD.**
   - **The rule:** by the chair's ruling of 23:24Z, a merge of the line into a seat's branch is asked of a seat, never required of it.
   - **The merge:** the chair built `66585d96a`, the line `a64619510` merged into `3e8e2e37d`:
     - `npcGenerator.js :: generateSingleNPC` keeps both sides (read by SEAT-10: correct);
     - the mutation manifest is the union of both sides;
     - the wiring census, writer-reach and lighting registers are byte-equal to the line's;
     - nothing was re-pinned.
   - **The base:** the chair then merged `f82c2a183` into that, giving `3e6894120`. The chair's lane gates at the base were type ratchet 167/167, strict 1113/1113 and eslint 0. The fast-forward was at 23:41:11Z.
   - **The doors, at the base:**
     - (a) **the wiring census:** `5e26f4062`, `producerIndexFiles` 1439 → 1444, 0 rows and 0 bytes moved.
     - (b) **the lighting census:** `ef5abf4da`, files 3723 → 3730, parked 476 → 478, credited 3247 → 3252, titles 31318 → 31412, suiteTitles 8680 → 8706.
     - (c) **the size baseline:** `npcGenerator.js` stays at 930, unchanged and green.
     - (d) **writer-reach:** item 89.
   - **A correction of the chair's (COMMON-EIGHTH 7):** the cloud machine always sets eleven `GIT_*` variables (certificates, credentials and config). Only git's REPOSITORY variables are the hazard: the list that `.husky/pre-push` unsets.
89. **WRITER-REACH, RE-TAKEN BY ITS DOOR ON THE CHAIR'S THREE-WAY CONDITION (`70e4e1945`; the chair's ruling, 23:54Z).**
   - **The question:** the door's `--report` was not identical at the two trees (LIT 701 at the tip and the lane, 700 at the line), so under COMMON-RULES 9 it came to the chair.
   - **The ruling:** the door may write if every `surfaceReach` row at the tip equals the line's frozen row or the lane's frozen row.
   - **The proof:** a scratch script, `scratchpad/wr-threeway.mjs`, compared the two frozen baselines with the tip's live measure. Of 12,726 rows, 12,720 are equal at all three, 4 equal the lane's, 2 equal the line's, 0 equal neither; 0 rows are new and 0 are missing.
   - **Identities:** none is new. Judged 12,726 and DARK 1,425 at all three trees.
   - **The door:** `--write` gave cohort 1385 → 1385, with 0 stale and 0 rows now lit.
   - **The walker:** red before (1, `priorityMilitary on config`), green after (52/52).
   - **The security reader's table** is §5.
90. **THE KEY QUESTION OVER PLAY TIME (the chair's addendum, 23:42Z; BKP play mode; CONFIRMED by run at `ef5abf4da` with the contest LIT): no key path is new under law 2.**
   - **What ran:** 30 pairs, 5 a size, both laws. Each pair had six one-month pulse intervals, one DM change and one coup-road transfer. The DM change went through `mutateSettlementChecked` with `CHANGE_RULING_POWER`. The coup-road transfer was a hand-built `power_transfer` outcome in `coup.js`'s shape, applied by `applyWorldPulse.js :: applyWorldPulseOutcomes`.
   - **Result:** law 2 writes no key path that law 1 never writes, at any step. The one raw difference is a runtime-id-keyed `worldState.spatialLedgers.provenance` entry; each law writes 98 entries of that shape, so it is fold noise.
   - **Transfers (law 1 / law 2):**
     - pulse 0 / 0, **so the pulse's own road was NOT measured**;
     - DM 27 / 14 (in 13 pairs the target already held the seat under law 2);
     - coup 27 / 27.
   - **Cost:** 28 s.

91. **UK-LEGACY: a town that reads law 1 takes law 1's band whoever regenerates it (the chair's order of 02:52Z; brief `briefs/UK-LEGACY.md`, report `briefs/UK-LEGACY-REPORT.md`).**
   - **The red (CONFIRMED by single-file runs in a scratch clone):** `tests/domain/seat/seatLawSavedTown.test.js` arm 4, "THE LEGACY EDGE". It was green 5/5 at `b2845bafc` and red at the UK merge `9624a7ac4`. It stayed red at `3e8e2e37d` and at this seat's `47d4e959f`, dark and flipped. It was not in RED-AT-LINE, because the file is the lane's.
   - **The mechanism (CONFIRMED by the cure):** `npc/powerBand.js :: powerBandOfRole` reads `seatsByHolder(config)` off the config it is handed. On the regen road that is `settlement.config || config`, the FORM config for a legacy save, and the form holds a lit marker once a lit town was Library-loaded. So a law-1 town's regenerated people took law 2's band fold.
   - **The cure (BUL `d9133148d`, merged `a4b3fff4a`):**
     - `seatLaw.js :: withRecordSeatLaw(config, record)`, one export through the one resolver. It returns the same reference when the record's law and the handed config's already agree.
     - `generateSettlementPipeline.js :: regenNPCsPipeline` and `regenHistoryPipeline` hand down `withRecordSeatLaw(handedConfig, settlement)`. This one seam covers the store and the engine service's passes.
     - Nothing in `tests/` changed.
   - **GREEN (BUL, CONFIRMED):**
     - `seatLawSavedTown` passes 5/5 unflipped and 5/5 flipped (in a second scratch copy with exactly the two dials). A pre-cure copy reproduces the red.
     - Unmoved: seatBandFold 13, roleCategory 42, holderOfSeat 51, seatContest 25, seatTable 45, seatTransfer 39, seatLawWiring 6.
     - The doors are green with nothing moved: sizeBaseline (`generateSettlementPipeline.js` 740 → 747, under 800), densityCreateBoundary 17, writerReach 52, the lighting census 34, wiring-census `--dry` delta 0. eslint and domain-strict (1113 at its ceiling) pass too.
   - **THE SWEEP:** the regen, re-derive, clone and load roads are in the report's table. **Named to the chair, not cured (outside the manifest):**
     - (a) The hosted `engine-generate` runs the committed bundle `supabase/functions/_shared/engineBundle.js`, built from `d989d32` before the seat train; it holds no seat-law code at all. The cure reaches it only when the bundle is rebuilt, and that rebuild is the owner's. `tests/build/engineBundleReplay.test.js` is already red at the line, in RED-AT-LINE.
     - (b) `castPowers.js :: raiseToOfficeBand` calls `powerBandOfRole(officeRole)` with no config, so it always reads law 1, by its comment.
     - (c) `power/factionStanding.js :: annotateFactionStanding` is handed a partial seat with no `config` by `rulingStructure.js` at birth, so it reads law 1 (fail closed).
     - (d) The re-derive road (`editSlice.js :: storedConfigFor`) reads the save row's stored config, never the form. **The saved-place test does NOT execute that road:** none of its five arms drives `regenerateWithLayer` or `dmLayer.js :: rederive`. The row's `config` is the save caller's argument: `SaveToLibraryButton.jsx` passes `minted._config || null`, `SettlementsPanel.jsx` passes `minted._config || forkedConfig`, and `ConstructionPanel.jsx` passes `result.config`. On the shipped save paths that is the record's own echo (PLAUSIBLE, read). An arm that executes the road is owed.
     - (e) Comment drift in `seatLaw.js`'s header and `npcGenerator.js:128`.

92. **THE FLIP'S CENSUS, RE-CUT (unit 3; CONFIRMED by run; the lists in `recut/CENSUS-LISTS.md`, the record in `recut/out/census.json`).**
   - **The set:** 810 files: 518 birth-reaching files plus `tests/generators`, `tests/data` and `tests/domain/seat`.
   - **The runs:** the flipped copy, made by `recut.sh prep` at `ef5abf4da` with exactly the two dials, ran 00:28:26Z to 02:04:28Z. The control, on the checkout at `47d4e959f`, ran 02:04:44Z to 03:44:34Z. Two shards a side, `--maxWorkers=2`.
   - **(1) The dial's own pins: 10.** All ten of SEAT-6-TO-LIGHT §2 are red. Neither conditional is red.
   - **(2) Born fixtures that move: 12 rows in 7 files**, against SEAT-6-TO-LIGHT's "the largest unknown, 516 files":
     - prose anchors on born towns: bar3PeopleTies, bar4PeopleKinds, bar5PowersStanding, powersReadTheRosterP31;
     - a count gate over born towns: goalSentencesOnceInTown, six tiers;
     - a pinned rank on one forced town: seatKeeperContender arm 2 (the rule's two census arms stay green flipped);
     - a pinned card goal: tonightOwnGoal.
     Each is re-pinned AT the flip, by the flip's unit.
   - **(3) Anything else: 0.**
   - **(4) Red without the flip: 24.** 23 are named in RED-AT-LINE (`recut/out/list4-vs-line.tsv`). The 24th is `seatLawSavedTown` arm 4, red unflipped and cured by UK-LEGACY (item 91).
   - **Neither way:** no flipped red falls outside the control's files, and the flip cures no red.
   - **Against SEAT-6-TO-LIGHT:** §2's worklist stands as written. Its "born fixtures" unknown is now 7 files. Its §3 legacy-edge PLAUSIBLE became a real lane red, now cured (item 91).

93. **THE CHAIR'S SECOND BASE (04:06Z): the line `f5295e425` (points 87 to 93) merged into `bb4c3e874` as `e8bc160f8`.** Five register or table conflicts, no code conflict; nothing re-pinned. The lane fast-forwarded to it at 04:06:18Z. The four doors, each in its own commit with its proof: the wiring census `0ac91da7c`, writer-reach `1d551fd54` (three-way: 0 neither, 0 new), the tuning inventory `99011ef51` (the lane's row restored byte-equal, no value moved) and the lighting census `1bd8a1148`. The sameness hand list needed no row (the lane adds no pool).

94. **SAVED-SEAT-REDERIVE: the re-derive road EXECUTED (the chair's order of 04:06Z; brief `briefs/SAVED-SEAT-REDERIVE.md`, report `briefs/SAVED-SEAT-REDERIVE-REPORT.md`; BSR `8328ba467`, merged `b7a373480`; CONFIRMED by run).**
   - **The arm:** `seatLawSavedTown.test.js` arm 6 drives `editSlice.js :: applyRosterDecreesAtTick` on a dark-born saved row while the form config is lit (`state.config._seatLawVersion === 2`). It guards that the road ran (`rederived` true, one newcomer minted, present on the derived record).
   - **What it shows:** (a) the law reads 1 on the live view and the library row, with no marker; (b) the people's `powerLevel` and band equal a second run of the same road with the marker stripped (one tree, no digest); (c) `coupContenders` reads as on the dark dial, and a control shows it is a live discriminator.
   - **Red first:** under the plant (`storedConfigFor` returns `state.config`) the file goes 1 failed / 5 passed: "(a) the live view: the re-derived town reads the seat law LIT — a FINDING: expected 2 to be 1". With (a) cut out, (b) reds too.
   - **Green:** clean 6/6, flipped 6/6. `rosterOpsAtTick` 6/6, the negative-assertion walker 9/9.
   - **So the sweep's (d) is closed:** the road reads the record's own stored config, and a law-1 place stays law 1 on it.

95. **RULE 8 AT THE TIP (unit 4; CONFIRMED by run; `rule8/RULE8.md`, `rule8/reds-by-name.tsv`, `rule8/files.txt`, `rule8/figures.txt`).**
   - **(a) The build (`08b0ba7d2`), beside LINE-NOW's `2fe514628`:**
     - first paint 1,183,329 raw / 376,540 gzip / 316,004 br, against the line's 1,179,511 / 375,172 / 315,169 (+3,818 / +1,368 / +835): the seat train's ruled exception, about 4,500;
     - the worker 2,686,966 (+15,961): NOT under a ruled exception; PLAUSIBLY the four new seat modules, 12,541 of an esbuild-per-file +13,904;
     - the engine chunk 926,808 (+200).

     All are named for the owner's size sign-off.
   - **(b) The tests:** the chair's (A), 1,387 files in two shards: 61 failed, all on RED-AT-LINE. The landing fixture row's title has drifted on the list; the fixture is stale at the line, and line and lane emit byte-equal fixtures.
   - **`tests/lint` whole:** 223 files, 3,362 tests, 3 red, all on the list.

## 2. THE UNITS

| unit | branch | state |
|---|---|---|
| 1 THE LINE | `lane/seat-10-2026-11-21` (base `3e6894120`) | merged by the chair, fast-forwarded; doors done (items 88, 89); `tests/lint` whole 219/220 (the red taken by its door); confine-two EQUAL |
| 2 THE KEY QUESTION | BKP (subagent; `keyprobe/`) | DONE at birth (87) and over play time (90) |
| 3 FLIP CENSUS (re-cut) | `recut/recut.sh`; scratch clone `census-flip` at `ef5abf4da` | DONE (item 92; `recut/CENSUS-LISTS.md`) |
| UK-LEGACY (the chair's order) | BUL (subagent; scratch clone `bul`, `d9133148d`) | MERGED `a4b3fff4a` (item 91); confine-two EQUAL; accepted 03:54Z |
| SAVED-SEAT-REDERIVE (the chair's order) | BSR (subagent; scratch clone `bsr`, `8328ba467`) | MERGED `b7a373480` (item 94) |
| 4 RULE 8 | `rule8/` | DONE (item 95); "SEAT <commit>" sent |

## 3. STORED FIGURES THIS SEAT MOVED

- `docs/content/wiring-census.json`: the stamp `producerIndexFiles` 1439 → 1444, the line's and the lane's new files joined (`5e26f4062`).
- `tests/lint/.lighting-census-baseline.json`: 3723 → 3730 files and the rest as in item 88 (`ef5abf4da`).
- `scripts/.writer-reach-baseline.json`: the four lane rows of §5, `verdictDigest`, `closureSizes`, `population`, `scanStats` and `frozenAtSha` (`70e4e1945`).
- Not moved: `scripts/.size-baseline.json` (`npcGenerator.js` 930) and `scripts/mutation-coverage-manifest.json` (the chair's union).

## 4. HOUSES AND CLASS-TABLE ROWS FOR THE JOIN

None added by SEAT-10.

## 5. FOR THE SECURITY READER: THE SIX WRITER-REACH ROWS THE LINE'S MERGE JOINED (item 89)

Each row's value at the tip was already frozen on one side under that side's own proof. The merge made no reach that neither side held.

| identity | the tip's reach | the side | the unit that moved it, and why |
|---|---|---|---|
| `hidden on factions` | +campaign-pdf (now every surface) | lane | U4-CURE cure 2 (`040221723`): `seatTable.js :: isVeiledRow` reads `hidden` (a hidden or criminal power is VEILED); the holder leaf and the contest take veiled rows OUT of the open field. **On the campaign PDF the reach is FILE-GRAINED, and nothing is read FOR it there: see the traced chain below (CONFIRMED).** |
| `narrative on factionRelationships` | N everywhere → R on campaign-pdf, dossier-pdf, foundry, web-transitive, world-book | lane | U3/U4-CURE2 (`6fa7063fb`): R1, the holder read, reads the seat edge's sentence (`holderOfSeat.js :: transferTakerOf` → `transferSentenceSays`). U5: `rulingPower.js :: transferRulingPower` writes and reads the retired edge's narrative. Hidden names are masked in both slots (TO-LIGHT §4f). It reaches every surface that renders the contest or the holder. |
| `priorityMilitary on config` | +foundry | lane | U4 (`28d85cbd5`): `seatCircumstances.js` reads the town's military priority for the `martial_pressure` circumstance (a figure the owner set in the wizard; not hideable). It reaches the Foundry export through the contest the export renders. |
| `recentConflict on powerStructure` | +web-transitive | lane | U3/U4-CURE2: the holder read's tie-break reads the transfer's own sentence (`holderOfSeat.js :: transferTakerOf`). U5 writes it in kept-form wordings, with hidden takers masked (TO-LIGHT §4e). |
| `raw on compound` | foundry=R | line | The line's own (page round, point 86); this lane did not move it. |
| `economy on raw` | foundry=R | line | The line's own (page round, point 86); this lane did not move it. |

**THE CAMPAIGN PDF'S `hidden on factions`, TRACED (CONFIRMED at `21a0b3e72`, 00:12:36Z, by the scanner's own import edges, `writer-reach-scan.mjs :: edgeMapOf`, and a grep of every call):**

1. **The import chain:** the entry `src/utils/generateCampaignPDF.js` imports `dossier/plotHooks.js`, which imports `crisis/crisisCast.js`, which imports `dossier/powerStrata.js`. That file imports `rulingPowerCoup.js`, which imports `seat/holderOfSeat.js`, `seat/seatCircumstances.js` and `seat/seatTable.js` (the last also through `rulingPower.js`). All of these are in the PDF's 214-file closure.
2. **The calls:** `isVeiledRow` is called only by `seatTable.js :: contestKindOf`, `holderOfSeat.js :: holderOf` and `seatCircumstances.js`. Those are reached only from `rulingPowerCoup.js :: coupContenders` and `rulingPower.js :: transferRulingPower` (through `keepsForm`). Inside the closure, `coupContenders` is called only by `powerStrata.js :: derivePowerStrata`, and NO file in the closure calls `derivePowerStrata` or `transferRulingPower`. What the PDF does call stops at `collectPlotHooks` → `effectiveCastOf` → `outrankingRivalOf`, `rulingChainOf` and `governingFactionOf`, and none of those reads a veil.
3. **What it withholds:** nothing on the campaign PDF. The PDF prints nothing computed from `hidden` through this lane's code, and hides nothing by it. The register's `campaign-pdf=R` is the scanner's file-grained closure (seatTable.js is imported), not a live read. This corrects SEAT-10's earlier line, which was PLAUSIBLE and wrong in its path: "through the contest lines, `printProse.js :: buildPrintProse` → `coupContenders`". That `printProse.js` (`src/domain/display/stateProse/printProse.js`) belongs to the settlement (dossier) PDF, not the campaign PDF.

