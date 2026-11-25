# GUARD: A STORED PLACE IS RE-DERIVED ONLY BY THE ENGINE THAT BORE IT (CLOSE-7; R24j). PARTIAL, written as the work goes.

- Tree `/home/user/wt/guard`, branch `lane/close-7-2026-11-24-guard-wip`, cut at e2fd7caa4. `editSlice.js`, `dmLayer.js`,
  `normalizeSettlement.js`, `settlement.schema.js`, `settlementRederiveAction.js` and `assembleSettlement.js` are byte-equal to the
  line tip 0559a8405 (`git diff --stat` empty, CONFIRMED).
- CLOSE-7's addition for 5(c): every line-born place that moves beyond the newcomer is reported with its cause, and not fixed in
  GUARD. If (c) cannot be exact, it stops alone.

## Progress log
- READ: CURES-COMMON, GUARD, R24j, GUARD-ORDER, LIVE-PATH brief and report; `settlement.schema.js` (head whole; the typedef
  remainder scanned for every version mention), `normalizeSettlement.js` whole, `editSlice.js :: applyRosterDecreesAtTick` and its
  helpers, `dmLayer.js` (`rederive`, `pinsFrom`, `appendDeclared`, `REDERIVE_UNAPPLIED_REASONS`), and `assembleSettlement.js`'s
  stamp (its line 508 return through `normalizeSettlement`).
- RED (on the cut, CONFIRMED, `GUARD/red.log`): `tests/store/rederiveGuard.test.js` 5 of 6 fail; G4 (same engine still re-derives)
  passes by design. `tests/lint/generatorVersionRelease.test.js`: the live arm fails, the two mutant arms pass. The messages:
  - G1: "R24j 1: GENERATOR_VERSION moves 0.9.0 -> 0.10.0 with this release: expected '0.9.0' to be '0.10.0'".
  - G2: "a stampless record is given the legacy stamp: expected '0.9.0' to be undefined" (no LEGACY constant on the cut).
  - G3: the receipt is `rederived: true` with `laneCalls: 1`, where `false` and `0` are expected.
  - G5: "the closed set carries the new reason: expected [ 'step_not_pinnable', 'unknown_key' ] to include 'engine_mismatch'".
  - G6: `bornWith: '0.9.0'`, with `rederived` true.
  - Lint arm: "the golden manifest moved since the 0.9.0 release (e7e8a6ff2cec -> 079bfce6d67f) and GENERATOR_VERSION is still
    0.9.0".
- STEP 1 (points 1, 2 and 6), built:
  - `settlement.schema.js`: `GENERATOR_VERSION` '0.10.0', plus the new `LEGACY_GENERATOR_VERSION` '0.9.0'.
  - `normalizeSettlement.js`: a stampless record, and the nullish minimal shape, are given LEGACY.
  - `assembleSettlement.js`: line 508 stamps `generatorVersion: GENERATOR_VERSION` before `normalizeSettlement`. The import is
    appended at the file's END, so no cited line moves.
  - `tests/domain/normalizeSettlement.test.js:33` is re-stated by its cause (LEGACY, not current).
- **STEP 1 COMMITTED: 807f86e5a** (points 1, 2 and 6). Its own tests are green (G1, G2, the lint arm).
- **Step 1's gate (CONFIRMED by run, `GUARD/step1-named.log`):** 110 files (every test naming `settlement.schema`,
  `normalizeSettlement`, `assembleSettlement` or `GENERATOR_VERSION`, plus 31 golden-like files) ran with 22 red in 15 files.
  - **3 are this unit's own, waiting for step 2:** G3, G5 and G6.
  - **1 is the lighting census:** it moves with the two new test files and is refrozen by its door after step 2.
  - **proseComposed A0b** is a known red.
  - **The rest are goldens. A BASELINE on the untouched cut** (a `git archive` of e2fd7caa4 in the scratchpad,
    `GUARD/cut-baseline.log`) shows **13 of those 14 files ALREADY RED AT THE CUT, with the same counts.**
    - 41 golden rows already moved in the pinned-mode and assembly goldens.
    - 525 of 525 rows differ in engineBundleReplay, and 3,011 surfaces in safetyReaderBytes.
    - These are the cures' births, not this unit's. The version moves the same rows, so their counts are unchanged.
  - **The ONE new red the version causes in this set** is `tests/domain/intentAtlasSoakDistiller.test.js` › "the documented
    default run reproduces the committed distillate byte for byte". Its committed distillate carries `generatorVersion`.
- **STEP 2 (points 3 and 4), built, not yet committed:**
  - **`dmLayer.js`:**
    - `REDERIVE_UNAPPLIED_REASONS` and its typedef gain `engine_mismatch`: `['engine_mismatch', 'step_not_pinnable',
      'unknown_key']`.
    - New pure `appendMinted(record, layer, declarations)`: world-fact roots come back `engine_mismatch`; newcomers are appended
      to a clone of the collection their card writes; every other key is carried by reference.
    - `pinsFrom` and `appendMinted` share two extracted helpers: `rootDeclaration` (PASS 1's declaration read) and
      `resolveNewcomers` (PASS 1b's rows). The two paths therefore append THE SAME rows.
  - **`editSlice.js :: applyRosterDecreesAtTick`:**
    - `bornHere = record.generatorVersion === GENERATOR_VERSION`. Else `appendMinted` over the layer holding THIS tick's rows
      (U111), the lane is never reached, and `rederived: false`.
    - Both paths flow into the ONE existing `dmLayer` write and the ONE existing `set` to both homes.
    - The new import, `GENERATOR_VERSION` from `../domain/settlement.schema.js`, is a 7th specifier.
  - **Pins re-stated by cause:**
    - `dmLayerGoldenIsolation` ×3: the closed set is now three.
    - `editMutationPath` A5: seven specifiers.
    - `editSlice.test` A1a: the import count is 7.
    - `decreeStaleVocabulary` U108-1: its hand fixture's premise IS the tick's re-derivation, so the fixture is stamped with
      this engine's version.
  - **The first restructure was refused by two lint arms** (`heldKeyWriterCensus` A7: dmLayer written at 2 sites;
    `snapshotPromotion` A2: undeclared writer `writeBothHomes`). Rebuilt with one write site, and neither register was edited.
- **STEP 2 COMMITTED: 0a40b581d.** Its gate was re-run after the restructure (`GUARD/step2-fix.log`, 13 files): green but for
  `worldFactRederive` A7, which is red at the cut too.
  - **Second baseline** (`GUARD/cut-baseline2.log`): `engineServiceStoreParity` ×4, `dmLayerGoldenIsolation` A7 (525),
    `editCorpusRatchet` A3 and A7 are ALL RED AT THE CUT with the same counts. Not this unit's.
- **LIGHTING CENSUS REFROZEN by its door: d8d7525dd.** Files 3,790 → 3,792 (the two new test files); the plain run after is
  34/34 green.
- **BIRTH STAMP IN ITS KEY'S PLACE: 89b8d8434.** Stamping before `normalizeSettlement` would have put `generatorVersion` before
  `simulationVersion` on every new record. Now the normalized record's legacy stamp is overwritten in place, and a born record's
  key order equals the cut's (proved by the births comparison below). 129/129 green.
- **POINT 4, COUNT (CONFIRMED by run over the 180 saved rows):** 0 of 180 master-born saves hold a dmLayer at all, so 0 hold
  a world-fact root (expected 0).
- **PROOFS (CONFIRMED by run; at d8d7525dd, re-run at 89b8d8434 in the chain below):**
  - **(a) RED, the cut e2fd7caa4:** `live-path.census.jsx` with the cut as load tree → `live-path/guard-a-cut-rows.jsonl`.
    113/180 places move by name: houses 65, powers 51, government 7, events 63 by name and 53 by year and kind. These equal
    phase 1's line figures.
  - **(b) GREEN, the 180 master-born saves:** `guard-proofs.census.jsx` mode `master` → `guard-master-rows.jsonl`.
    - rederived 0/180; the newcomer is on the roster ONCE and LAST in 180/180.
    - **0/180 move beyond the newcomer**, by hash of the record with `dmLayer`, `decrees` and the newcomer's row set apart.
    - The view and the library row are one record in 180/180. Errors 0.
  - **(d) The next release, simulated:** mode `next` (`vi.doMock` of `settlement.schema.js`, GENERATOR_VERSION '0.11.0';
    the double was checked to take). Over 180 places born today ('0.10.0'): rederived 0/180, the newcomer once 180/180, and
    0/180 move beyond the newcomer.
  - **(c) STOPS, ALONE, as CLOSE-7 ruled: it cannot be exact.** Mode `born`, 180 places born on this tree ('0.10.0'):
    rederived 180/180 (the feature stays on), the newcomer once and last 180/180, but **180/180 move beyond the newcomer**:
    - **All 180: `generationCoherenceReceipt`.** The receipt's first judgment counts the roster, so "12 NPCs / 12
      relationships" becomes "13 NPCs / 12 relationships". The newcomer's own consequence lands on a derived receipt, not on
      his row.
    - **13 places also move elsewhere:**
      - **9 places, one saved person's row.** The re-derivation writes `institution: null` on a held person who had no such
        key (dp-thorp-22, dp-thorp-24, dp-hamlet-7/9/13/16/21/27, dp-village-3), a person with no house and the role "Rallies
        the neighbours". No name, power or house moved.
      - **dp-thorp-13, a power is seated.** "Third Bloc (Neutrals)" is gained (the Elder Council keeps the seat), and the
        stress cast's stake is re-dealt to it. This is the same class as the master control's 4 thorps in phase 1.
      - **4 places, the conflicts re-dealt.** dp-hamlet-13 drops its one conflict. dp-village-16, 23 and 25 re-deal one
        conflict's party, issue, stakes and hooks (village-16: Military Party → Elder Council, "who speaks for the place" → "a
        broken promise of support").
    - The causes are CONFIRMED by record diffs (`GUARD/dump-born/`). Why each step answers so is PLAUSIBLE by read: the
      re-run steps downstream of the pinned roster see one more person.
    - **Not fixed in GUARD**, per CLOSE-7's word.
- **POINT 7, THE OTHER RE-RUNS, UNTOUCHED** (PLAUSIBLE by read; no file of theirs changed):
  - The DM's section re-roll, `store/settlementRegenAction.js :: regenSectionAction` (the slice's `regenSection`):
    - 'npcs' runs `generators/generateSettlementPipeline.js :: regenNPCsPipeline(settlement, cfg, { locks })`;
    - 'history' runs `:: regenHistoryPipeline(settlement, cfg)`;
    - each, locally or through the engine service, on the STORED record.
  - **Laws passed:** both pass `withRecordSeatLaw(handedConfig, settlement)` (`domain/seat/seatLaw.js`; the record's seat law,
    never the handed one). It is the ONLY `withRecord*Law` in src.
  - Each writes only its section (`npcs` with their id-keyed maps; `history` and `_regenSeed`) and leaves the record's
    `generatorVersion` as it was.
  - **Not re-runs of a stored record:** "Regenerate" (`settlementGenerateAction.js`, a fresh birth, which stamps the current
    engine) and `regenerationMode.js`'s plans. Note: `HARD_ANCHOR_FIELDS` there keeps `generatorVersion` across a Reforge.
- **POINT 8, BORN RECORDS (CONFIRMED by run; `live-path/guard-births.census.jsx` on the cut and on 89b8d8434, compared by
  `guard-births-compare.mjs`):**
  - **C:** 900 births. The whole record moved 900/900, with the stamp 0.9.0 → 0.10.0 ×900. **With `generatorVersion` set
    apart: 0/900 moved. Key order and set: 0/900 moved.**
  - **V:** 900 births, the same: 0/900 beyond the version, and 0/900 in key order.
- **PROOFS RE-RUN AT 89b8d8434 (CONFIRMED, exit=0 ×3):** identical. (b) 0/180 beyond the newcomer; (d) 0/180; (c) 180/180 move beyond the newcomer (13 beyond the receipt).
- **POINT 8, PAGE BATTERY C (CONFIRMED by run; `read25/page-battery.mjs`, the cut vs 89b8d8434, 4 workers each, exit=0; diff in
  `GUARD/battery-diff-C.txt`):** 900 births.
  - **Rows moved 0, and the pattern tables are equal.**
  - **The record hash moved 900/900.** That is the version, which the births comparison proves.
  - **The page hash moved 2/900:** dp-thorp-2 and dp-thorp-3. Both are among the first births a battery worker renders, which
    the mirror's report found unstable from run to run. They are re-rendered with another birth first, below.
- **POINT 8, PAGE BATTERY V (CONFIRMED by run, exit=0 both):** 900 births. **Rows moved 0, page moved 0, tables equal.**
  The record hash moved 900/900 (the version).
- **POINT 8, THE TWO PAGE MOVES ON C ARE THE BATTERY'S, NOT THE UNIT'S (CONFIRMED by run):** the mirror's own
  `plan-thorps-C.json` (dp-thorp-1 first, then 0, 2, 3) was re-rendered with `--views` and 1 worker on both trees
  (`GUARD/thorps-diff.txt`). **Page moved 0 of 4**; the record moved 4 of 4 (the version).
- **GATES at 89b8d8434 (CONFIRMED by run):**
  - **`tests/copy` whole: 15 files, 172/172 green, exit=0.**
  - **`tests/lint` whole:** 227 files, 3,376 passed and 4 failed. The known three are proseComposed A0b and proseCorpusBytes RAW
    and GZIP. The fourth is this unit's: `mutationCoverageManifest` TOTALITY asked for an entry for the new invariant file
    `tests/lint/generatorVersionRelease.test.js`. Answered by its door: a rationale entry in
    `scripts/mutation-coverage-manifest.json` (the arm's red on the cut, executed, and its in-body mutants). The re-run is
    queued.
- **`tests/property` whole on 89b8d8434 vs the cut (CONFIRMED by run, `GUARD/property-{guard,cut}.log`):** both trees give
  96 files with 9 failed and 701 passed, the SAME 9 titles with the same counts. So the version adds no new red there. Those
  goldens are already red at the cut: 525/525 rows in two of them, and a lit manifest that does not exist.
- **The manifest entry COMMITTED: d6c941c62.** `mutationCoverageManifest` and the release arm together are 13/13 green.

---

# THE HAND-IN (CLOSE-7; R24j). THE GUARD IS BUILT. Proof (c) STOPS alone, as CLOSE-7 ruled.

**Commits on `lane/close-7-2026-11-24-guard-wip`, above the cut e2fd7caa4, not pushed:**

| commit | what |
|---|---|
| 807f86e5a | R24j 1, 2 and 6: the version goes up, a load stamps LEGACY, and the release arm |
| 0a40b581d | R24j 3 and 4: the seam, `appendMinted`, and `engine_mismatch` |
| d8d7525dd | the lighting census, refrozen by its door |
| 89b8d8434 | the birth stamp in its key's own place |
| d6c941c62 | the release arm's mutation-coverage entry |

## The eight points
1. **The version.** `GENERATOR_VERSION` moves '0.9.0' → '0.10.0'. Every new record's `generatorVersion` moves, and so does
   everything that hashes the whole record.
2. **A birth stamps the engine; a load never does.**
   - `LEGACY_GENERATOR_VERSION` is '0.9.0'.
   - `normalizeSettlement` gives a stampless record LEGACY, and the nullish minimal shape LEGACY too.
   - `assembleSettlement.js` (line 508) overwrites the stamp with the current version, in the key's own place.
   - **The callers, walked.** Each now writes the record's own stamp, or LEGACY where there is none, and never the current
     version:
     - `store/galleryImportSettlement.js` (the gallery import);
     - `store/galleryImportMap.js` (the map import);
     - `utils/generateSettlementPDF.js` (`normalizeSettlement` for reading only; nothing stored);
     - `foundry/generateFoundryModule.js` (the same);
     - `lib/saves.js :: migrateSettlementShape` (the save loader, cloud and local);
     - `lib/accountImport.js` (account-file import).
   - The only current stamp is a birth's: `assembleSettlement.js`, which every new place, re-derivation and remote birth
     passes through.
3. **The seam.**
   - `editSlice.js :: applyRosterDecreesAtTick` checks `record.generatorVersion === GENERATOR_VERSION` before the lane. Where it
     does not match: `dmLayer.js :: appendMinted` runs over the layer holding THIS tick's rows, the engine is never reached,
     both paths share the ONE `dmLayer` write and the ONE `set` to both homes, and the receipt is `rederived: false`.
   - **G3 proves it:** laneCalls 0, every saved person byte-equal, the newcomer once and last as
     `{ id, name, role }`, and the rest of the record byte-equal.
4. **`engine_mismatch`.** It is added to `RederiveUnappliedReason` and the frozen list, now three; the three pins are re-stated.
   A world-fact root on another engine's place comes back `engine_mismatch`, with the config untouched (G5). **Count on the 180
   master-born saves: 0 hold a world-fact root**; none holds a layer at all.
5. **The proofs** (all CONFIRMED by run):
   - **(a) RED:** on the cut, 113/180 places move by name.
   - **(b) GREEN:** 0/180 master-born saves move beyond the newcomer, and the newcomer is once in 180/180. The U111 fault
     stays red-first in `newcomerOnce.test.js`, which is green.
   - **(d) The next release:** 0/180 move beyond the newcomer and 180/180 take the append path.
   - **(c) STOPS:** 180/180 line-born places still re-derive, but 180/180 move beyond the newcomer.
     - In all 180, the coherence receipt's count of the people (N → N+1).
     - In 13, also: a held person's `institution: null` (9); a power seated (1, dp-thorp-13); conflicts re-dealt (4).
     - The same class showed in master's own control in phase 1. **Not fixed in GUARD.**
6. **The lint arm.** `tests/lint/generatorVersionRelease.test.js` holds the released row (0.9.0 and master's manifest digest
   e7e8a6ff…). It was red on the cut and is green after.
7. **The other re-runs, untouched.** `regenSectionAction` 'npcs' runs `regenNPCsPipeline`, and 'history' runs
   `regenHistoryPipeline`. Both pass `withRecordSeatLaw`, the only `withRecord*Law` in src.
8. **No other persisted shape moves.**
   - Births on C and on V: 0/900 differ with `generatorVersion` set apart, and 0/900 differ in key order.
   - The page battery: C rows 0 and V rows 0. Pages: V 0; C 2, both battery first-worker births, which re-render 0/4 moved.
   - No copy changed, and no page changed.

## THE GOLDEN LIST FOR THE OWNER'S SIGNING (N6: none re-recorded; each left red)
- **NEW red because of the version's value (green at the cut): ONE.**
  - `tests/domain/intentAtlasSoakDistiller.test.js` › "the documented default run reproduces the committed distillate byte
    for byte".
  - Cause: the committed `src/domain/data/intentAtlas.distillate.json` carries `"generatorVersion": "0.9.0"`.
- **ALREADY RED AT THE CUT, with the same counts on both trees.** These are the cures' births, not this unit's. Each hashes
  whole records, so their re-recording must follow the version:
  - `tests/property/generatorGoldenMaster.test.js` (525/525);
  - `generatorGoldenMasterLit.test.js` ×3 (no lit manifest);
  - `dmLayerGoldenIsolation` A7 (525);
  - `espionageDormancyFence` (the driven golden);
  - `dossierProseManifest` DRIFT (1,050);
  - `editCorpusRatchet` A3 and A7;
  - `tests/build/engineBundleReplay.test.js` ×3 (525, 360, 3);
  - `engineServiceStoreParity` ×4;
  - `generationForkCensus` A1;
  - `institutionBudgetPromise` (60);
  - `nameHeldThroughAssembly` A1, `pipelinePinnedChoosers` A1, `pipelinePinnedMode` A1, A2 and A5, `powerEconomyFreshness` A4
    and `rosterFinalUnderHeldRoster` A1 (41 rows each);
  - `editWorldFactResources` A2 and A6;
  - `worldFactRederive` A7;
  - `tests/ui/safetyReaderBytes.test.jsx` (3,011).

## Gates (at 89b8d8434 and after, CONFIRMED by run; logs under the scratchpad `GUARD/`)
- **Own tests:** `rederiveGuard` 6/6 and the release arm 3/3.
- **Named tests:**
  - 110 files for step 1 and 62 for step 2. Every red is listed above, or appears on the cut too.
  - After the last code change: 129/129 green over the eight core files.
- **`tests/lint` whole:** the known three only, after d6c941c62. `mutationCoverageManifest` was re-run green (13/13); the full
  lint was not re-run after that one manifest line.
- **`tests/copy` whole:** 172/172 green.
- **No push.** No golden was edited and nothing was dropped. No permission check refused an action.

---

# GUARD-FINISH (R24k), STEP A

## (3i) THE NULL: no reader tells the empty house field from null (PLAUSIBLE by read; twenty minutes, by grep and read)
- **The premise, corrected.** In the (c) dumps (`GUARD/dump-born/`) the held person's field went from ABSENT to `null`
  (`institution: undefined -> null`), not from `''`. The readers below collapse all three (absent, `''`, `null`) to "no house".
- **The person readers on a page or an export** (the field is a person's `institution`). No caller of these prints "null",
  throws, or sorts on the raw field:
  - **Through `domain/people/cardPowers.js :: cardHouseOf`** → `cardInstitutionOf`. `recordOf(null)` is `{}`, so a null field
    returns a null house.
    - Readers: `components/new/npcComponents.jsx :: houseMarkShown` (line 228) and the search filter (line 94);
      `domain/npcProfile.js` (line 349); `components/dossier/SettlementWorkbench.jsx` (line 112);
      `domain/dossier/dossierSearch.js` (line 276); `pdf/lib/viewModel.js` `house` and `houseMark` (lines 789 and 794); and
      `cardPowers.js :: facesByHouse`.
    - Each skips or ORs past a null house.
  - **The Foundry export:** `foundry/journalPages.js` (line 220) reads the PDF view model's `n.house`:
    `kv('House', n.house ? … : n.house)`. So it is the view model's null; `kv` must skip an empty value (PLAUSIBLE, not
    opened).
  - **`domain/display/galleryVeil.js`:** `npcHouseOf` is `cardHouseOf(npc) || str(npc.institution)`, and `str(null)` is
    `''`. The staffed set at line 1092 uses `str(n.institution)` and `.filter(Boolean)`.
  - **Other domain readers, all null-safe:**
    - `domain/people/patronage.js` (line 197): `String(rec(null).key ?? '')` is `''`;
    - `domain/people/allegiance.js` (lines 282, 365 and 370): `rec()` and `str()`;
    - `domain/people/seatKeeper.js` (line 58): `c.institution && typeof … === 'object'`;
    - `domain/crisis/crisisCast.js` (lines 623, 722 and 844): `n.institution?.kind`;
    - `domain/facts/factVocabulary.js` 'own house': `?.kind === 'house'`.
  - The other `.institution` hits in components, `domain/display` and the PDF sections are a SERVICE row's field, not a
    person's.
- **No line is cured.**
