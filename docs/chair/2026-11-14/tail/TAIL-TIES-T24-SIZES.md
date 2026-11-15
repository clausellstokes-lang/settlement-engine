# TAIL-TIES-6 · T24: the two red size budgets, measured (2026-11-15). Measure and name; nothing trimmed, no budget touched.

**Instrument.** A scratch Vite config: the shipped `vite.config.js` merged with one `generateBundle` plugin that dumps each chunk's code bytes, each module's `renderedLength` and the entry's static closure. It is not committed. The builds:
- the budget's own record point, `7dc7757f` (STYLE-2-MERGE closing act 7, 2026-11-11);
- `ea52c0805`;
- the tip, `d247d8a3`.

All three trees share the tip's `package-lock.json`. Module rows are rendered bytes before minification, so they RANK the growth; the chunk totals are the real file bytes.

**The finding that moves the question: the budget was already broken before tonight.**
- `7dc7757f` reproduces the budget to the byte: its eight eager chunks sum to exactly 1,121,260.
- `ea52c0805` reads about 1,159,115 with the SAME budget, so it was already 37,855 over. ea52 was the boot bisect's green point, not this arm's.
- The tip reads 1,164,844. Of the 43,584 over, about 5.7 kB came after ea52; the rest landed between 11-11 and ea52.

## (a) First paint: 43,584 B over (raw)
By chunk, 7dc7757f to the tip:
- `data` 150,145 to 174,165 (+24,020);
- `engine-core` 258,195 to 277,712 (+19,517);
- the entry `index` +47;
- the other five chunks unchanged.

The largest growth members (rendered bytes; the landing line it came by; the importers that put it in an eager chunk):
1. `src/data/faceHonorifics.js` (new, 21,284; STYLE-2-MERGE). Read by `domain/people/patronage.js`, `seatKeeper.js`, `generators/people/ties.js` and others.
2. `src/domain/display/labelBands.js` (new, 9,898; STYLE-2-MERGE). Read by `OverviewTab.jsx` and `SummaryTab.jsx`, which are true first-paint screens.
3. `src/data/stressPowerFaces.js` (new, 9,696; COHERENCE-POWERS). Read by `PowerStrata.jsx` and the generators.
4. `src/data/institutionLadders.js` (new, 9,529; STYLE-2-MERGE). Its importers are generators only (`structuralValidator`, `assembleInstitutions`, `subsumptionPass`, `coherenceRepairPass`).
5. `src/domain/institutions/houseScale.js` (new, 8,367; UPKEEP-CAPACITY C1). Its only importer is `generators/defenseGenerator.js`.

The next rows are `foodways` +7,836, `facts/keep` 5,885, `defenseInstitutionBuckets` +5,549, `seatKeeper` 5,247 and `institutionDisplayName` +4,984.

**What a safe trim could recover (a CANDIDATE, not measured to the byte).** Tables and leaves that reach first paint only because the derivation routes every generator-reached domain module into the eager `engine-core`, and every table an eager module reads into the eager `data` chunk. By the importers above:
- `institutionLadders` and `houseScale` (generator-only importers);
- possibly `faceHonorifics`, if its domain readers are themselves reached by no true first-paint module.

The cure is vite.config.js's own convention: excise and pin with the lazy chunk (`FIRSTPAINT2_LAZY_DOMAIN`), or the same leaf cut as tonight. Order of size: one to two thirds of the overage. The real figure needs a reachability walk from the true first-paint roots, which was not taken tonight.
`labelBands` and `stressPowerFaces` are read by first-paint screens: that is the product's own growth, and the remainder is the owner's re-record.

## (b) The engine chunk: 130,750 B over its strict ceiling (857,204 against 726,454)
7dc7757f reads 722,677, under its ceiling of the day, so all of the growth is since 11-11. It is all generation code in the LAZY engine chunk, none of it in first paint.

The top members (rendered bytes):
1. `generators/narrative/foundingRowAdmits.js` (new, 28,065);
2. `generators/economy/incomeLineSiblings.js` (new, 24,116; a sibling table);
3. `generators/people/castPowers.js` (+23,080);
4. `generators/power/conflictIssues.js` (new, 21,811);
5. `generators/safetyProfile.js` (+21,598).

The next rows are `generationCoherence` +20,332, `claimStanding` 19,071, `resourceGenerator` +16,512, `safetyLineTruth` 15,146 and `historyGenerator` +15,140.

The chair's guess is half right. The sibling and prose tables (`incomeLineSiblings`, `outlookHookSiblings` +4,909, `foundingRowAdmits`) are a part. Most of it is new generator logic across about seventy modules.

A trim inside a lazy chunk buys no first-paint byte. This ceiling guards the engine chunk's existence and size, so it is the owner's re-record, at the measured figure + 1 by the file's own idiom.

## The raw diff (7dc7757f to the tip; `ea52=` in the header lines means 7dc7757f here)
```
== FIRSTPAINT code bytes ea52=1105419 tip=1148963 delta=43544
 modules grown 42 (+147041), shrunk 0 (0)
  + 21284 src/data/faceHonorifics.js (0->21284)
  + 9898 src/domain/display/labelBands.js (0->9898)
  + 9696 src/data/stressPowerFaces.js (0->9696)
  + 9529 src/data/institutionLadders.js (0->9529)
  + 8367 src/domain/institutions/houseScale.js (0->8367)
  + 7836 src/domain/foodways.js (7225->15061)
  + 5885 src/domain/facts/keep.js (0->5885)
  + 5549 src/domain/institutions/defenseInstitutionBuckets.js (10237->15786)
  + 5247 src/domain/people/seatKeeper.js (0->5247)
  + 4984 src/domain/display/institutionDisplayName.js (8313->13297)
  + 4524 src/domain/people/cardPowers.js (8105->12629)
  + 3944 src/domain/people/stressPowerFaces.js (0->3944)
  + 3817 src/domain/summary/storesSpanWords.js (0->3817)
  + 3701 src/data/people/powerSentenceName.js (0->3701)
  + 3460 src/data/holderTitleForms.js (0->3460)
  + 3419 src/domain/facts/founder.js (0->3419)
  + 3304 src/domain/chainYield.js (0->3304)
  + 3205 src/domain/facts/factVocabulary.js (33760->36965)
  + 3069 src/domain/facts/sharedPower.js (0->3069)
  + 2545 src/domain/facts/rulingBody.js (0->2545)
  + 2545 src/domain/facts/rivalPower.js (0->2545)
  + 2528 src/domain/facts/rulerKindLabel.js (0->2528)
  + 2335 src/domain/display/chainPrintName.js (0->2335)
  + 2208 src/domain/resourceTerrainCompatibility.js (5446->7654)
  + 1868 src/data/stressTypes.js (12288->14156)
== ENGINE code bytes ea52=722677 tip=857204 delta=134527
 modules grown 70 (+401335), shrunk 1 (-323)
  + 28065 src/generators/narrative/foundingRowAdmits.js (0->28065)
  + 24116 src/generators/economy/incomeLineSiblings.js (0->24116)
  + 23080 src/generators/people/castPowers.js (20952->44032)
  + 21811 src/generators/power/conflictIssues.js (0->21811)
  + 21598 src/generators/safetyProfile.js (56588->78186)
  + 20332 src/generators/generationCoherence.js (17901->38233)
  + 19071 src/generators/power/claimStanding.js (0->19071)
  + 16512 src/generators/resourceGenerator.js (22216->38728)
  + 15146 src/generators/safetyLineTruth.js (0->15146)
  + 15140 src/generators/historyGenerator.js (53114->68254)
  + 12092 src/generators/narrativeText.js (48281->60373)
  + 10753 src/generators/economy/prosperity.js (18018->28771)
  + 10423 src/generators/npcStructure.js (36579->47002)
  + 10097 src/generators/narrative/settlementOriginProse.js (15741->25838)
  + 9758 src/generators/power/rosterText.js (0->9758)
  + 9573 src/generators/defenseGenerator.js (33980->43553)
  + 9232 src/generators/factionDynamics.js (31797->41029)
  + 9025 src/generators/people/representatives.js (24889->33914)
  + 8495 src/generators/economy/foodBalance.js (47775->56270)
  + 7076 src/generators/stressNarrative.js (15274->22350)
  + 7001 src/generators/power/rulerKin.js (0->7001)
  + 5744 src/generators/steps/assembleSettlement.js (24263->30007)
  + 5258 src/generators/economy/economicState.js (38764->44022)
  + 5097 src/generators/power/governanceNarrative.js (31898->36995)
  + 4909 src/generators/economy/outlookHookSiblings.js (4313->9222)
```
