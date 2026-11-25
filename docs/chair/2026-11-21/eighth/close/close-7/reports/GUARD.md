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
