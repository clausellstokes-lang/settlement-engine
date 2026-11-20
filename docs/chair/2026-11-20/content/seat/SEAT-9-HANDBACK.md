# SEAT-9 — HAND-BACK (kept current at every push; first written 2026-11-20T22:14:55Z, read from `date -u`)

**For the next owner of this lane: this file, `SEAT-7-HANDBACK.md` (items 69 to 79, §2 to §7), `SEAT-6-HANDBACK.md` (items 53 to 68), `SEAT-6-TO-LIGHT.md`, `SEAT-5-HANDBACK.md` §1 (items 1 to 52) and `briefs/` are all you need.** Every ruling in force: SEAT-5's 1 to 52, SEAT-6's 53 to 68, SEAT-7's 69 to 79, this file's 80 on. SEAT-9's assignment: `docs/chair/2026-11-20/seventh/prompts/SEAT-9.txt` on `origin/lane/chair-2026-11-08` (where it differs from SEAT-8.txt, it governs).

Branch `lane/seat-9-2026-11-20`, cut at SEAT-7's handed-over tip `b2845bafc` (verified at seating). SEAT-9 is session_019yED1R6dpS2Dcy7bSasb2G.

## 0. THE STATE

- **Lane tip:** `lane/seat-9-2026-11-20`. Last code merge: UK + UK-CURE (`9624a7ac4`), its follow-up and doors (`333952f7d`, `c5f8d91d2`, `b939ed26b`).
- **OUT:** BFL (FLIP-CENSUS) in SEAT-7's container; its branch `lane/seat-7-2026-11-20-flip-wip` comes through the chair when it closes. If the container ends first: re-staff from `briefs/FLIP-CENSUS.md` + items 73, 76, 78, one shard at a time.
- **OWED (to the chair, before "SEAT <commit>"):** the flip census's size by file (item 83, partial so far); rule 8 as re-ruled (item 78). The owner's plain table is DONE (item 82).

## 1. RULINGS AND FINDINGS SINCE SEAT-7's HAND-BACK

80. **UK MERGED WITH UK-CURE (SEAT-9, 2026-11-20 ~22:00Z):** one merge `9624a7ac4` of `452e6f639` (which carries UK's `fad107fcc`). Both diffs were read whole: UK's `src` and its 177-line `tests/generators/seatBandFold.test.js`, and UK-CURE's leaf `src/generators/npc/powerBand.js`, `npcGenerator.js` and `scripts/.size-baseline.json`. UK-CURE is as BUC claimed: the band is verbatim in behaviour with one statement per line, it is re-exported, and the baseline went 941 → 930 with its reason row. Then:
   - (1) `roleCategory.test.js` re-pointed to `npc/powerBand.js` (`333952f7d`, red-first: 1 failed at the merge, green after);
   - (2) the wiring census `producerIndexFiles` 1439 → 1440 by `node scripts/wiring-census.mjs` (`c5f8d91d2`; 0 rows moved);
   - (3) the lighting census 3711 → 3712 by `LIGHTING_CENSUS_REFREEZE=SEAT-9` and the mutation manifest's `rationale` row for `seatBandFold.test.js` (`b939ed26b`; uncovered baseline 186 unchanged).

   **Dark confinement of the merge:** `confine-two.sh b2845bafc b939ed26b` is EQUAL (`36ee5bb0…ce89`, 1245 places; the same hash BUC recorded).
81. **TWO FINDINGS IN UK's TEST DIFF (SEAT-9's reading; for the chair):**
   - (a) **Arm 3 is a golden in effect.** It pins sha256 digests of six WHOLE births (`uk-town-17`, `uk-city-5`, each with the law absent, 1 or '2') RECORDED at `fb937f369`. Any change the working line makes to those births reds it at the landing. If it reds with the line merged, the cause is the line's, not this lane's: name it, and re-record it only by the chair's word.
   - (b) **It reds at the flip.** `birthConfig` will mint `_seatLawVersion: 2` once the dial flips, so arm 2's "uk-town-17 born dark" (`dark.config._seatLawVersion` undefined) and arm 3's `absent` rows (and arm 2's dark half of the "one `_rng()` call" pairing) assume a birth with nothing minted. Their "dark" must then pass `_seatLawVersion: 1` explicitly or use a mocked dark seam. This joins TO-LIGHT §2's worklist. BFL's cut `9cc5045f2` lacks this file, so the flip census cannot see it.

   **RULED BY THE CHAIR (22:01Z): CURE BOTH IN THE MERGE's FOLLOW-UP; neither goes to the landing.** Arm 3 becomes a differential in ONE tree with no stored digest: (a) the band of every role the lists and the fold can meet, under every old-law config, equals a local restatement of the old expression, and under law 2 it differs on exactly a declared set; (b) two births with the key absent deep-equal the same births with law 1 forced. Every "dark" arm forces law 1 itself, and exactly ONE test (`seatLawWiring`'s) pins what a new place is born with. SEAT-8 (the second reader) added length guards on the dark-side loops of arm 2 (thieves, city) and arm 4 (merchant). SEAT-9 added a third, on arm 2's town `.every`. The confine-two EQUAL stays in the merge message as the two-tree proof, not as a pin. Brief `briefs/UK-FOLLOW.md`, builder BUF (OUT).
82. **THE OWNER'S PLAIN TABLE IS DONE (the chair, 21:59Z):** `docs/chair/2026-11-20/content/seat/flip/plain-table.md` on `lane/seat-7-2026-11-20-flip-wip` at `5bbdc9b0a`, read by the chair. Calm places turning contested: 0; calm places stopping: 0. 30 of 600 list their challengers differently, and 3 change the risk word. It comes onto the lane with the flip's branch at its merge. It is no longer owed.
83. **THE FLIP CENSUS, PARTIAL (relayed by the chair 22:02Z from SEAT-7; BFL's flipped whole run stopped at its ceiling 22:00:52Z):** 1,203 of 3,710 files finished, 25,279 tests, **33 failed in 20 files**, 48 skipped.
   - (1) TO-LIGHT §2's TEN dark-default pins all red (seatLawWiring 3, livingContentLawWiring 4, seatContest 3), and neither conditional reds.
   - (2) **10 reds in files SEAT-5 item 24 lists as known:** golden master; generationForkCensus A1; pipelinePinnedChoosers A1; rosterFinalUnderHeldRoster A1; powerEconomyFreshness A4; worldFactRederive A7; espionageDormancyFence; dmLayerGoldenIsolation A7; engineBundleReplay ×3.
   - (3) **13 candidates** ("a born fixture moves" or "other"; unsorted until the unflipped control): x46NpcBand (dark digests); institutionBudgetPromise; nameHeldThroughAssembly A1; pipelinePinnedMode A1/A2/A5; editWorldFactResources A2/A6; factLayers.walker ×2; aiOutputSchemaBundle freshness; dossierProseManifest drift.
   - **`x46NpcBand` is OLDER than this lane** (SEAT-9's read): X-46 car 4 (iii)'s dark digests, first recorded at 8cc245db0 and re-keyed by LASTCLOSE-SIGN B4 at `4bd82db5d` (2026-11-19). They hash sixty places born at the DEFAULT config, so the flip's mint moves them. The same shape as item 81 (a stored digest as a dark control that leans on the default), but not this lane's file.
   - **`seatBandFold.test.js`:** BFL's cut `9cc5045f2` lacks it. After UK-FOLLOW it must not move at the flip (BUF's flip-proof arm).
   - NEXT in BFL's container: two flipped shards over the 793-file set, then the same 793 unflipped, then the four lists. SEAT-7 pushes `-wip` after each.

## 2. THE UNITS

| unit | branch | state |
|---|---|---|
| UK + UK-CURE | `lane/seat-2026-11-20-uk` `fad107fcc` + `lane/seat-7-2026-11-20-uk-cure-wip` `452e6f639` | MERGED `9624a7ac4`; follow-up and doors `333952f7d` `c5f8d91d2` `b939ed26b` (item 80) |
| UK-FOLLOW (BUF) | `lane/seat-9-2026-11-20-uk-follow` (worktree `scratchpad/wt-buf`) from `30e812c0e` (brief `briefs/UK-FOLLOW.md`) | OUT; then the lighting census and the manifest row re-taken by their doors if the title count moves |
| FLIP-CENSUS (BFL) | `lane/seat-7-2026-11-20-flip(-wip)` | OUT in SEAT-7's container |
| U6 … U12 | | not briefed (SEAT-7 §0 NEXT) |

## 3. STORED FIGURES THIS SEAT MOVED

- `docs/content/wiring-census.json` stamp `producerIndexFiles` 1439 → 1440 (UK-CURE's leaf).
- `tests/lint/.lighting-census-baseline.json`: files 3711 → 3712, credited 3237 → 3238, titles 31290 → 31303, suiteTitles 8659 → 8664 (UK's test file).
- `scripts/mutation-coverage-manifest.json`: one `rationale` row (`tests/generators/seatBandFold.test.js`).
- `scripts/.size-baseline.json`: `npcGenerator.js` 941 → 930 (UK-CURE's, by its door).

## 4. HOUSES AND CLASS-TABLE ROWS FOR THE JOIN

None added by UK or UK-CURE (no vocabulary, class table or house read).
