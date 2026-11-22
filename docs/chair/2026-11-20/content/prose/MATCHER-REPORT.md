# MATCHER-REPORT: the defence-words check counts a walls, soldier or garrison term only as a claim about this place

PROSE-2's builder, brief `docs/chair/2026-11-20/content/prose/briefs/MATCHER.md` (the chair's ruling of 18:19 UTC), 2026-11-20.
Branch `lane/prose-2-2026-11-20-matcher`, cut from `lane/prose-2-2026-11-20` at b9ab84760. No STOP fired.

## The commits

| commit | what it does |
|---|---|
| 3ce566984 | The rule and the red-first tests. |
| 42d5f1ffb | Names the word patterns, so the defence-fact-readers walker stays green, and moves the fixtures into two registered tests, so the sovereignty walker does not park the file. Behaviour is identical. |
| bd563f7c8 | **Cure 1, the merge read.** Drops the hospital reading (the chair's ruling of 18:46). |
| dc6d3fa5d | **Cure 3.** `selfVouchReceipt` is re-keyed soak1k-7 -> soak1k-8 by cause. |
| 1d790f419 | **Cure 4.** The writer-reach baseline is re-recorded by its `--write` door. |

**Files changed:**
- `src/domain/coherence/defenseWordsFindings.js`
- `tests/domain/defenseWordsFindings.test.js`
- `tests/generators/selfVouchReceipt.test.js`
- `scripts/.writer-reach-baseline.json`
- this report

## The rule (each excuse, quoted from the file)

Beside `DENIAL_BEFORE` stands one table, `NOT_A_CLAIM`, keyed by term. A use of a term is excused only when a named reading reads it.
Every use in the sentence must be read, as before: one excused use beside one claiming use is still a finding. These are untouched:
- `defenseFactsOf` and the facts;
- the `hospital` term (there is no hospital reading: see below);
- the `no food stored` term.

| term | rule | pattern | the measured sentence it answers |
|---|---|---|---|
| walls | WALLED THING | `walled` then `/^\s+(?:plots?\|compounds?\|holdings\|waystations?\|enclosures?\s+for)\b/i` | "A walled plot gated against livestock", "Stone-walled holdings climbing a south-facing hillside", "Walled compounds, tiled roofs…", "A walled waystation offering merchants…", "A stout walled enclosure for the desert merchant" |
| walls | WALLED APART | `walled` then `/^\s+apart\b/i` | "The merchant quarter and the labourers' quarter remain walled apart" (the Economic Divide's walls BETWEEN quarters) |
| walls | LOW WALLS DIVIDE | `walls` after `/\blow\s+$/i`, then `/^[^.;:!?]{0,40}\bdivide\b[^.;:!?]{0,20}\bfrom\b/i` | "gates, low walls, and planted courtyards divide public from household space" |
| walls | A ROOM'S WALLS | `walls` then `/^\s+are\s+covered\s+with\s+(?:charts\|maps\|papers\|notes\|drawings)\b/i` | "The walls are covered with charts weighted down by stones." |
| soldiers | A SOLDIER'S PAST | before `/\b(?:discharged\|failed\|former\|retired)\s+$/i` | "a discharged soldier who liked the view…", "a failed soldier received a land grant…", "Where retired soldiers and sellswords do their drinking." |
| soldiers | A SOLDIER'S DRESS | `soldier` then `/^'s\s+(?:\w+\s+)?(?:dress\|clothes\|clothing\|garb)\b/i` | "soldier's practical dress with officer's insignia" |
| soldiers | CLOTHING FOR SOLDIERS | before `/\b(?:clothing\|clothes\|dress\|garb)\s+for\s+$/i` | "Practical clothing for soldiers and servants." |
| soldiers | A SOLDIER AMONG CUSTOMERS | before `/\bmerchants?,\s+$/i` and after `/^,?\s+(?:and\|or)\s+travell?ers?\b/i` | "for any merchant, soldier, or traveller needing a new mount", "serving merchants, soldiers, and travellers" |
| garrison | GARRISON DUTY HIRED OUT | after `/^\s+(?:duty\|contracts?)\b/i` and the sentence holds `/\bhire\b/i` | "Hire trained soldiers for military campaigns, garrison duty, and escorts.", "Offers caravan escort, garrison contracts, and short-term military hire…" |

**No hospital reading (cure 1).** The first cut excused "May operate hospital/school." and "It may keep a hospital or a school."
as a hedge. The chair ruled at 18:46 that on the town monastery, where no hospital stands, they are a REAL fault. They are cured by
rewording the data rows in a later unit (WORDING-CURE), not excused by the checker. `HOSPITAL_HEDGE_BEFORE` and
`NOT_A_CLAIM.hospital` are removed, and the six hospital rows moved to the test's `UNEXCUSED`.

Prior art read, not imported: `scripts/audit/soak-review/defenceReach.mjs` (the soak's reach rules). Its wider readings, which no
measured sentence needs, were left out:
- "old" and "veteran" soldiers;
- a lone "soldier" read as a person;
- `walls of the <building>`;
- a building's possessive;
- "within its walls" in a building's own description;
- the hospital hedge.

## Red first, both halves (`tests/domain/defenseWordsFindings.test.js`, describe `MATCHER · …`)

**The export.** `export.census.mjs` (scratch) births the GEN11-FIELDS 300 the census's way, at base b9ab84760.
- **The walk.** It walks each place's fields as `recordTextSurfaces` does and re-runs `defenseWordsFindings` per field at every
  `needs_review` place.
- **It reconciles.** Its attributed `defense-words` findings equal the receipts' own: 135 = 135.
- **The 97 count-0 places hold:**
  - 127 findings;
  - 26 distinct sentences;
  - 38 distinct (term, sentence, facts) rows.
- **Each fixture holds:**
  - the place's name masked `#`;
  - the field(s);
  - the finding count;
  - the facts, rebuilt by a roster stub. The first test pins that each stub's `defenseFactsOf` equals the recorded facts and lacks
    the term.

**(a) The false matches go quiet. Sentences excused / measured: 23 / 26 distinct sentences (31 / 38 rows; 119 / 127 findings).**
These figures were verified by running the file at bd563f7c8 (17 passed of 17), not by arithmetic.

- **Red at the base, by title.** The base run copied the test file into an archive of 43ab0f5eb, whose `src/` equals b9ab84760's.
  - The rule's first cut was red on `(a) every measured row the rule excuses is quiet (…)`, and the failure listed every excused row.
  - The first cut's per-row titles were red on 37 rows.
  - Removing an excuse needs no new red-first proof, by PROSE-2's instruction. The run of the file is the receipt.
- **The unexcused measured rows stay findings: 7 rows, 3 distinct sentences, 8 findings (pinned).**
  - **"Takes in abandoned infants … raised on within its walls."** (walls; `institutions[].desc`; 1 finding.)
    - "its walls" is the foundling home's own wall only because the sentence stands in the building's own description, and the
      sentence alone does not say so.
    - The same words of the place are a claim: "Its walls are kept by the households in turn." is a control below.
  - **"May operate hospital/school."** (hospital; 3 rows, 4 findings.)
  - **"It may keep a hospital or a school."** (hospital; 3 rows, 3 findings.)
  - The two hospital lines are a real fault (the chair's 18:46 ruling), cured in the data by WORDING-CURE.
- **Beyond the count-0 places.** At the count > 0 places the rule also quiets "They hire out by the day for escort, garrison duty,
  and brief campaigns…".

**(b) Controls stay red. Controls held / controls written: 28 / 28**, green at the base and at every tip.

*The battery's own claims, 14:*
- this file's "The garrison drills at dawn. The hall posts bounties.";
- the eight CLAIMS of `tests/generators/soakDefenceReach.test.js`;
- its four perimeter claims;
- the reserve line ("…walls a little too strong.").

Pinned in their own files, and green there:
- `tests/generators/defenceTwinLines.test.js` pins its own ten declared originals as findings on a bare roster;
- this file's "No food reserves…".

*This lane's new controls, 14:*
- "Its walls are kept by the households in turn."
- "Soldiers stand at the gate."
- "The garrison drills in the square."
- "The village is walled against raiders."
- "A walled village of stone holdings climbs the hillside."
- "Low walls ring the village."
- "The walls are covered with moss and ivy."
- "The quarters were walled apart once, and the walls of the village still stand."
- "Garrison duty falls to the young men of the village."
- "Retired from the field, the soldiers still stand watch at the gate."
- "Soldiers keep order among the merchants and travellers."
- "The soldiers' barracks stand by the gate."
- "Discharged soldiers and the garrison share the square." (garrison)
- "The village keeps a hospital for the sick."

*The other tests that name `defenseWordsFindings` or `defense-words` are green.* Their pins are quiet-side or vocabulary, not claims:
- `coherenceBattery`
- `wallsWordDossierProse`
- `defenseRosterLines`
- `defenceClaimWriters`
- `placeNotTierDefence`
- `soakReviewSmallGuildCheck`
- `bar3CorpusGuards`
- `crisisSummaryVantage`
- `settlementQuickGuide`
- `npcStructureSeatPlain`
- `tailDefeconSafetyLines`

## Readers at birth (STOP 1: not met)

**Who writes the judgment.**
- `src/generators/recordBatteryFindings.js :: recordBatteryJudgment` writes it.
- `src/generators/generationCoherence.js :: buildGenerationCoherenceReceipt` appends it (l.814).
- That builder is called at `steps/assembleSettlement.js` l.476 and `steps/resolveCrisisCast.js` l.138.
- The receipt's own `status` reads only `checks`, never the judgment.

**Nothing at birth reads it.**
- No retry, repair, reroll or certification step reads it at birth. No reader of `.judgments` or `needs_review` exists in
  `src/generators`, `src/domain/generation` or `src/domain/density` beyond the builders.
- The readers come after birth:
  - `generalDeskRead.js :: recordCleanOf`
  - `generalStateProse.js :: criticalIssuePoolKey`
  - `VersionsTab.jsx`
  - the edit and rename registers, which do not rewrite it

**The function, not the judgment, IS read at birth by three draw filters:**
- `narrative/arrivalScene.js` l.280;
- `narrativeGenerator.js :: licensedNotes` l.221;
- `narrativeGenerator.js :: generatePressureSentence` l.858.

A grep of their pool files for every excused phrasing finds none (inferred). The two trees confirm it on 1,245 births (executed).

## The two trees (STOP 2: not met)

- **The command.** `node <scratch>/confinement/trees.mjs 43ab0f5eb 1d790f419 <scratch>/trees --words=none`, under the mutex, exit 0.
- **The tool.** NAMES-3's, at 835fabd2d, copied to scratch.
- **Uncapped.** Every difference was counted by field with a scratch copy of `confine.mjs`'s diff.
- **The result.** 0 differences outside `generationCoherenceReceipt`.
- **The earlier runs.** At 3ce566984 and 42d5f1ffb the golden figures were the same, and the census read 182 differing documents
  (165 status changes).

| corpus | documents | identical | differing | outside the receipt | `findings` length | `status` | `evidence` | `detail` | `path` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| golden 525 | 525 | 273 | 252 | **0** | 252 | 132 | 862 | 252 | 120 |
| census 720 | 720 | 548 | 172 | **0** | 172 | 153 | 13 | 12 | 6 |

## Moved fingerprints and the four cures

**The full runs.** The 50 test files the searches found were run at 3ce566984, the first cut with the hospital reading, and at the
base archive:
- **Tip:** Test Files 15 failed / 35 passed; Tests 19 failed / 661 passed / 28 skipped (708).
- **Base:** Test Files 12 failed / 38 passed; Tests 16 failed / 623 passed / 28 skipped (667).

**The three newly red files after the cures**, re-run together at dc6d3fa5d (Test Files 1 failed / 2 passed; Tests 1 failed / 16
passed (17)):

| fingerprint | before | after | state at 1d790f419 |
|---|---|---|---|
| `tests/generators/selfVouchReceipt.test.js` "soak1k-7: …" | needs_review on 2 defense-words false matches | **cure 3: re-keyed to soak1k-8**. Probed soak1k-0..119 at the tip: the first seed with no critical issue whose battery still finds a contradiction the rule keeps (`battery.tier-noun`, "town" for a village; verdict "cannot all be true"). The exact findings list is re-measured (`['battery.tier-noun']`) and no assertion is weakened. The cause is stated in the test. | green |
| `tests/pdf/recordBatteryReceiptOnly.test.jsx` (soak1k-3, soak1k-21) | needs_review | soak1k-3 passed under the first cut's hospital excuse. With cure 1 it fails the battery again on "hospital without a hospital", a real fault. soak1k-21 fails on a walls finding the rule keeps. **No change needed.** | green |
| `tests/generators/generationCertificationCorpus.test.js` `ADVISORY_FAILING` | 30 labels | **23**. Gone: criminal-crossroads-town-ember, isolated-arcane-town-dun, magical-desert-village-bracken, magical-desert-village-cinder, mercantile-seaport-town-alder, mercantile-seaport-town-ember, population-87. population-350 is back, by its hospital line. | **LEFT RED** (cure 4). It is the battery's own findings register, but its header documents no script or command: it is a hand-written inline list re-keyed by hand ("shrink it as it does"). By PROSE-2's rule it stays red and is named here. |
| `tests/lint/writerReach.walker.test.js` `shapesDigest` (2 tests) | a6c67e26ca6aa2b3a76daa5bd354809747c5c498c746797f3cf84892d9a9417c | **cure 4: re-recorded by its door** `node scripts/check-writer-reach.mjs --write` (shrink-only, no signature): 4d38659375e03c77c47dd71284c1221395e3690cfa767646abe64728d8c02cb6. Also moved: the cohort 1385 -> 1385 (0 stale); scanStats sites 44437 -> 44453, propRead 42171 -> 42187, nGrades 1880692 -> 1880807 (this file's new reads); frozenAtSha 3914d0b79 -> dc6d3fa5d | green, 52 / 52 |
| `tests/lint/sovereigntyLightingContract.walker.test.js` live TEST-title count | 31,237 | 31,242 (+5 = this lane's five new titles) | red. **Left to PROSE-2**, who takes the censuses at the merge |

**Moved fingerprints that were already red at the base** (measured at 3ce566984; not re-run after cure 1):

| fingerprint | at the base | at 3ce566984 |
|---|---|---|
| `espionageDormancyFence` driven golden | bf6f92cd7dd2… | 0c6fd70a3116… |
| `generationForkCensus` control row | 26932f67b19d… | 0871a143e472… |
| `engineBundleReplay` espionage fence | 325 / 360 differ | 334 / 360 differ |
| generator golden master | 521 / 525 (stale at the base) | 521 / 525; the trees show 252 golden births move, all inside the receipt |
| `dossierProseManifest` | 1,050 | 1,050 (unmoved) |

These manifest readers are red at the base, with the same counts at the tip:
- `pipelinePinnedMode`
- `pipelinePinnedChoosers`
- `nameHeldThroughAssembly`
- `rosterFinalUnderHeldRoster`
- `powerEconomyFreshness`
- `dmLayerGoldenIsolation`
- `worldFactRederive`

## The gates

Each gate ran through `sh scripts/gate-tail.sh`, to a file, read by its count lines.

| gate | count line | exit |
|---|---|---|
| `tests/domain/defenseWordsFindings.test.js` (bd563f7c8) | Tests 17 passed (17) | 0 |
| selfVouch + recordBatteryReceiptOnly + certification (dc6d3fa5d) | Test Files 1 failed / 2 passed (3); Tests 1 failed / 16 passed (17); the 1 is `ADVISORY_FAILING` | 1 |
| `tests/lint/writerReach.walker.test.js` (after the re-record) | Tests 52 passed (52) | 0 |
| the 50 files found (3ce566984) | Test Files 15 failed / 35 passed (50); Tests 19 failed / 661 passed / 28 skipped (708) | 1 |
| the same 50 (base archive) | Test Files 12 failed / 38 passed (50); Tests 16 failed / 623 passed / 28 skipped (667) | 1 |
| `npx vitest run tests/lint` WHOLE (3ce566984, mutex) | Test Files 3 failed / 217 passed (220); Tests 4 failed / 3267 passed (3271) | 1 |
| the three red lint files at the base archive | Tests 108 passed (108) | 0 |
| the same at 42d5f1ffb | `defenceFactReaders` green (cured by naming the patterns); `writerReach` 2 red (cured since by its door); sovereignty census 1 red (PROSE-2's) | 1 |
| `npm run typecheck:ratchet` (42d5f1ffb) | 167 error(s), ceiling 167 | 0 |
| `npm run typecheck:domain:strict` (1d790f419) | 1113 errors, ceiling 1113 | 0 |
| `npm run lint` (42d5f1ffb) | 38 problems (0 errors, 38 warnings), none in this lane's files | 0 |
| `npx eslint` on the three changed source and test files (1d790f419) | clean | 0 |

The ledger-branch fetch was refused by the permission check. It was left refused, as instructed. `tests/lint` ran without that ref,
and `ledgerCitationIntegrity` passed.

## The re-take (the chair's step 3), at bd563f7c8

GEN11-FIELDS' own census and tally ran at the tip source, under the mutex, over the same 300 places with the same birth. The six
processes exited 0. walkMatches, countsMatch and detailsMatch were each 21 / 21.

| figure | base (GEN11-FIELDS) | first cut (with the hospital excuse) | **tip** |
|---|---:|---:|---:|
| `needs_review` | 103 | 15 | **21** |
| in the Outlook verdict pool (`criticalIssuePoolKey`, live readings) | 108 | 25 | **31** |
| pool by route: count > 0 only | 5 | 10 | **10** |
| pool by route: battery only (count 0, `needs_review`) | 97 | 14 | **20** |
| pool by route: both | 6 | 1 | **1** |
| battery findings | 149 (135 defense-words, 14 tier-noun) | 15 | **22** (8 defense-words, 14 tier-noun) |

`needs_review` by size at the tip: thorp 3, hamlet 5, village 3, town 7, city 1, metropolis 2.

The remaining findings:

| check | word | field | places | findings | example |
|---|---|---|---:|---:|---|
| tier-noun | town | `culturalIdentity.defensePattern` | 14 | 14 | "Civic musters come first; paid guards are added only when a threat lasts and the town can pay." |
| defense-words | hospital | `institutions[].desc` | 7 | 7 | "May operate hospital/school." (WORDING-CURE's) |
| defense-words | walls | `institutions[].desc` | 1 | 1 | the foundling home's "…raised on within its walls." |

## Executed vs inferred

**EXECUTED**
- The export, and its 135 = 135 reconciliation.
- The red at the base and the green at every tip.
- The cure-1 counts, by running the file.
- The 28 controls.
- The three two-tree runs, with the uncapped count.
- The 50-file runs at the tip and the base.
- `tests/lint` whole.
- The soak1k-0..119 probe.
- The re-takes.
- The writer-reach `--write` and the walker after it.
- The typecheck and lint gates.

**INFERRED**
- **The birth-reader list:** from searches and from reading the sites.
- **That the draw filters cannot change:** from a grep of the pool files. The trees confirm it on 1,245 births.
- **The sovereignty suite-title figure (+1):** not read.
- **The golden 252:** from the trees, not from the golden test.
- **The already-red fingerprints:** their hashes were measured at 3ce566984 and not re-measured after cure 1. The golden figures in
  the trees are unchanged; the census moved 182 -> 172.
- **soak1k-8's field:** the finding is `battery.tier-noun`; its field was not traced.

## Scratch (not committed)

These stay in this session's scratchpad:
- the export and probe censuses (`mx/`);
- the confinement copy and its births (`trees/`);
- the full logs;
- the re-take rows (`gen11tip/`, `gen11tip2/`).
