# MATCHER-REPORT: the defence-words check counts a walls, soldier or garrison term only as a claim about this place

PROSE-2's builder, brief `docs/chair/2026-11-20/content/prose/briefs/MATCHER.md` (the chair's ruling of 18:19 UTC), 2026-11-20.
Branch `lane/prose-2-2026-11-20-matcher`, cut from `lane/prose-2-2026-11-20` at b9ab84760. Source commits: 3ce566984 (the rule
and the red-first tests) and 42d5f1ffb (the word patterns named, so the defence-fact-readers walker stays green; the fixtures
moved into two registered tests, so the sovereignty walker does not park the file). Behaviour of the two source commits is identical
(the second only names three regex literals). Files changed: `src/domain/coherence/defenseWordsFindings.js`,
`tests/domain/defenseWordsFindings.test.js`, and this report. No STOP fired.

## The rule (each excuse, quoted from the file)

Beside `DENIAL_BEFORE`, one table `NOT_A_CLAIM` keyed by term. A use of a term is excused only when a named reading reads it. Every
use in the sentence must be read, as before: one excused use beside one claiming use is still a finding. `defenseFactsOf`, the
facts and the `no food stored` term are untouched.

| term | rule | pattern | the measured sentence it answers |
|---|---|---|---|
| walls | WALLED THING | `walled` then `/^\s+(?:plots?\|compounds?\|holdings\|waystations?\|enclosures?\s+for)\b/i` | "A walled plot gated against livestock", "Stone-walled holdings climbing a south-facing hillside", "Walled compounds, tiled roofs…", "A walled waystation offering merchants…", "A stout walled enclosure for the desert merchant" |
| walls | WALLED APART | `walled` then `/^\s+apart\b/i` | "The merchant quarter and the labourers' quarter remain walled apart" |
| walls | LOW WALLS DIVIDE | `walls` after `/\blow\s+$/i`, then `/^[^.;:!?]{0,40}\bdivide\b[^.;:!?]{0,20}\bfrom\b/i` | "gates, low walls, and planted courtyards divide public from household space" |
| walls | A ROOM'S WALLS | `walls` then `/^\s+are\s+covered\s+with\s+(?:charts\|maps\|papers\|notes\|drawings)\b/i` | "The walls are covered with charts weighted down by stones." |
| soldiers | A SOLDIER'S PAST | before `/\b(?:discharged\|failed\|former\|retired)\s+$/i` | "a discharged soldier who liked the view…", "a failed soldier received a land grant…", "Where retired soldiers and sellswords do their drinking." |
| soldiers | A SOLDIER'S DRESS | `soldier` then `/^'s\s+(?:\w+\s+)?(?:dress\|clothes\|clothing\|garb)\b/i` | "soldier's practical dress with officer's insignia" |
| soldiers | CLOTHING FOR SOLDIERS | before `/\b(?:clothing\|clothes\|dress\|garb)\s+for\s+$/i` | "Practical clothing for soldiers and servants." |
| soldiers | A SOLDIER AMONG CUSTOMERS | before `/\bmerchants?,\s+$/i` and after `/^,?\s+(?:and\|or)\s+travell?ers?\b/i` | "for any merchant, soldier, or traveller needing a new mount", "serving merchants, soldiers, and travellers" |
| garrison | GARRISON DUTY HIRED OUT | after `/^\s+(?:duty\|contracts?)\b/i` and the sentence holds `/\bhire\b/i` | "Hire trained soldiers for military campaigns, garrison duty, and escorts.", "Offers caravan escort, garrison contracts, and short-term military hire…" |
| hospital | A HOSPITAL A HOUSE MAY KEEP | before `/\bmay\s+(?:operate\|keep)\s+(?:a\s+)?$/i` | "May operate hospital/school.", "It may keep a hospital or a school." |

**The hospital rule, as the brief asks.** It is touched for a measured false match: "May operate hospital/school." and "It may keep
a hospital or a school." (7 findings at 7 of the 97 places, field `institutions[].desc`). Each is the catalogue's hedge about one
house, not a hospital standing. The soak's reach reader already licensed the same hedge (`scripts/audit/soak-review/defenceReach.mjs ::
HOSPITAL_HEDGE_BEFORE`, F1 2026-11-04). The rule here is narrower: only "may operate" or "may keep" directly before the word.

Prior art read, not imported: `defenceReach.mjs` (the soak's reach rules). Its wider readings that no measured sentence needs were
left out: "old" and "veteran" soldiers, a lone "soldier" as a person, `walls of the <building>`, a building's possessive, and "within
its walls" in a building's own description.

## Red first, both halves (`tests/domain/defenseWordsFindings.test.js`, describe `MATCHER · …`)

**Export.** `export.census.mjs` (scratch) births the GEN11-FIELDS 300 the census's way, at base b9ab84760. It walks each place's
fields as `recordTextSurfaces` does, and re-runs `defenseWordsFindings` per field at every `needs_review` place. Its attributed
`defense-words` findings equal the receipts' own: 135 = 135. At the 97 count-0 places: 127 findings, 26 distinct sentences, 38
distinct (term, sentence, facts) rows. They are held as fixtures, with the place's name masked `#`, the field(s), the finding
count and the facts (rebuilt by a roster stub; the first test pins that each stub's `defenseFactsOf` equals the recorded facts and
lacks the term).

**(a) The false matches go quiet. Sentences excused / measured: 25 / 26 distinct sentences (37 / 38 rows; 126 / 127 findings).**
- **Red at the base, by title.** The base run copied this test file into an archive of 43ab0f5eb, whose `src/` equals b9ab84760's.
  - `(a) every measured row the rule excuses is quiet (37 rows, 25 distinct sentences, 126 findings)` was RED, listing all 37 rows.
  - The first cut, one `it` per row (3ce566984), was red on 37 titles `(a) quiet [<term> · <facts> · <field>]: …` and green on the
    unexcused row.
- **Green at the tip.**

**The unexcused measured sentence** stays a finding (pinned): "Takes in abandoned infants and small children and keeps them in
basic care until they are apprenticed, placed with families, or raised on within its walls." (walls; `institutions[].desc`; 1 place,
facts G+M).
- **Why.** "its walls" is the foundling home's own wall only because the sentence sits in the building's own description, and the
  sentence alone does not say so.
- **The same words of the place are a claim.** "Its walls are kept by the households in turn." is a control below.

At the count > 0 places the rule also quiets "They hire out by the day for escort, garrison duty, and brief campaigns…"
(GARRISON DUTY HIRED OUT).

**(b) Controls stay red. Controls held / controls written: 28 / 28**, green at the base AND at the tip.
- **The battery tests' own claims, 14.**
  - This file's "The garrison drills at dawn. The hall posts bounties."
  - The eight CLAIMS of `tests/generators/soakDefenceReach.test.js`.
  - Its four perimeter claims.
  - The reserve line ("…walls a little too strong.").
  - Not repeated here:
    - `tests/generators/defenceTwinLines.test.js` pins its own ten declared originals as findings on a bare roster. It passes at the tip.
    - This file's "No food reserves…" test passes too.
- **This lane's new controls, 14** (at least six were asked):
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
- **Other tests that name `defenseWordsFindings` or `defense-words`, all green at the tip.** Their assertions are quiet-side pins (a
  writer prints no claim) or vocabulary, not claims:
  - `tests/domain/coherenceBattery.test.js`
  - `tests/domain/wallsWordDossierProse.test.js`
  - `tests/domain/defenseRosterLines.test.js`
  - `tests/generators/defenceClaimWriters.test.js`
  - `tests/generators/placeNotTierDefence.test.js`
  - `tests/audit/soakReviewSmallGuildCheck.test.js`
  - `tests/domain/bar3CorpusGuards.test.js`
  - `tests/domain/crisis/crisisSummaryVantage.test.js`
  - `tests/domain/settlementQuickGuide.test.js`
  - `tests/generators/npcStructureSeatPlain.test.js`
  - `tests/generators/tailDefeconSafetyLines.test.js`

## Readers at birth (STOP 1: not met)

- **The judgment.**
  - It is written by `src/generators/recordBatteryFindings.js :: recordBatteryJudgment`.
  - It is appended by `src/generators/generationCoherence.js :: buildGenerationCoherenceReceipt` (l.814).
  - That builder is called at `src/generators/steps/assembleSettlement.js` (l.476) and `src/generators/steps/resolveCrisisCast.js` (l.138).
  - The receipt's own `status` reads only `checks` (hard findings), never the judgment.
- **No retry, repair, reroll or certification step at birth reads it.** In `src/generators`, `src/domain/generation` and
  `src/domain/density`, no reader of `.judgments` or `needs_review` exists beyond the builders.
- **The judgment's readers are all after birth.**
  - `src/components/new/generalDeskRead.js :: recordCleanOf`.
  - `src/domain/display/stateProse/generalStateProse.js :: criticalIssuePoolKey` (via recordClean).
  - `src/components/settlement/VersionsTab.jsx`.
  - The edit and rename registers (`recordRegister.js`, `factionRename.js`), which do not rewrite it.
- **The function (not the judgment) IS read at birth by three draw filters.** Each keeps a pool row only when it has no finding:
  - `src/generators/narrative/arrivalScene.js` l.280 (STRESS_DESCS).
  - `src/generators/narrativeGenerator.js :: licensedNotes` l.221 (STRESS_NOTES / MASS_MIGRATION_DEPARTURE_NOTES).
  - `src/generators/narrativeGenerator.js :: generatePressureSentence` l.858 (PRESSURE_SENTENCES).
- **The rule cannot widen those pools.** A grep of the pool files (`src/data/narrativeData.js`, `src/generators/narrativeText.js`) for
  every excused phrasing finds none (inferred by the grep). The two trees (below) confirm it on 1,245 births (executed).

## The two trees (STOP 2: not met)

- **The run.** `node <scratch>/confinement/trees.mjs 43ab0f5eb 42d5f1ffb <scratch>/trees --words=none`.
  - The tool is NAMES-3's, at `origin/lane/names-3-2026-11-20` 835fabd2d, copied to scratch.
  - It ran under the mutex and exited 0.
  - The first run, against 3ce566984, gave the same figures.
- **Uncapped count.** `confine.mjs` prints only 20 non-string lines, so a scratch copy of its diff counted every difference by field.
- **Result:** 0 differences outside `generationCoherenceReceipt` in either corpus.

| corpus | documents | identical | differing | outside the receipt | `judgments[].findings` length | `judgments[].status` | `findings[].evidence` | `findings[].detail` | `findings[].path` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| golden 525 | 525 | 273 | 252 | **0** | 252 | 132 | 862 | 252 | 120 |
| census 720 | 720 | 538 | 182 | **0** | 182 | 165 | 12 | 11 | 6 |

Every changed `findings` length shrinks (e.g. `judgments[7].findings: length 2 -> 0`).

## Moved fingerprints (STOP 3: reported. None re-recorded; none is the battery's own register with a door)

Tip run of the 50 test files the searches found, against the same 50 run in an archive of 43ab0f5eb:
- **Tip:** Test Files 15 failed | 35 passed (50); Tests 19 failed | 661 passed | 28 skipped (708).
- **Base:** Test Files 12 failed | 38 passed (50); Tests 16 failed | 623 passed | 28 skipped (667).

The +41 tests are this lane's (the first cut's per-row titles). Three files are newly red, all mine. Every other red is red at the base.

| fingerprint | before (base) | after (tip) | whose |
|---|---|---|---|
| `tests/generators/generationCertificationCorpus.test.js` "pins the advisory record_coherence_battery failures BY IDENTITY" (`ADVISORY_FAILING`, shrink-only, inline, no door) | 30 labels, green | 22. Gone: criminal-crossroads-town-ember, isolated-arcane-town-dun, magical-desert-village-bracken, magical-desert-village-cinder, mercantile-seaport-town-alder, mercantile-seaport-town-ember, population-350, population-87. RED | mine: the cure the list's comment asks for ("shrink it as it does"); an inline list, no door, not mine to edit |
| `tests/generators/selfVouchReceipt.test.js` "soak1k-7: the battery finds the contradictions…" | needs_review (2 defense-words), green | pass. RED (premise gone) | mine: the seed needs re-keying by its owner |
| `tests/pdf/recordBatteryReceiptOnly.test.jsx` (soak1k-3, soak1k-21 "needing review") | needs_review, green | soak1k-3 pass. RED (premise gone) | mine: the seed needs re-keying by its owner |
| `tests/lint/writerReach.walker.test.js` frozen `shapesDigest` (2 tests) | a6c67e26ca6a… (green) | 8fc818852bf8… RED | mine: a fingerprint of generated towns; signed by none |
| `tests/lint/sovereigntyLightingContract.walker.test.js` census (live TEST-title count) | 31,237 (green) | 31,242 RED | mine: +5 = this lane's five new test titles (one new suite title, inferred). Door `LIGHTING_CENSUS_REFREEZE`; NOT re-recorded (not the battery's register) |
| `tests/property/espionageDormancyFence.test.js` driven golden (constant 9829e655d0ac…) | bf6f92cd7dd2… (red at base) | 0c6fd70a3116… (red) | my change moves the hash; red at both |
| `tests/generators/generationForkCensus.test.js` control row (expected 71ea4d5f28843…) | 26932f67b19d… (red at base) | 0871a143e472… (red) | my change moves the hash; red at both |
| `tests/build/engineBundleReplay.test.js` espionage fence, bundle vs in-process | 325 of 360 differ (red at base) | 334 of 360 (red) | +9 mine (the stale bundle is not) |
| `tests/property/generatorGoldenMaster.test.js` (`tests/fixtures/generator-golden-master.json`) | 521 of 525 rows differ (red at base) | 521 (red) | stale at base. My change moves 252 of the 525 golden births (the trees), all inside the receipt |
| `tests/property/dossierProseManifest.test.js` drift arm | 1,050 rows (red at base) | 1,050 | unmoved: the receipt is not composed prose |
| manifest readers red at the base with the same counts at the tip | | | not mine |

The manifest readers in the last row are:
- `pipelinePinnedMode` (3)
- `pipelinePinnedChoosers`
- `nameHeldThroughAssembly`
- `rosterFinalUnderHeldRoster`
- `powerEconomyFreshness`
- `dmLayerGoldenIsolation`
- `worldFactRederive`

Most read "40 rows"; dmLayer reads 521.

## The gates

Each gate ran through `sh scripts/gate-tail.sh`, to a file, read by its count lines.

| gate | count line | exit |
|---|---|---|
| `tests/domain/defenseWordsFindings.test.js` (tip, with the two walkers below) | 17 passed (file); run: Tests 1 failed / 72 passed (73), the 1 = the sovereignty census above | 1 |
| the 50 files found (tip) | Test Files 15 failed / 35 passed (50); Tests 19 failed / 661 passed / 28 skipped (708) | 1 |
| the same 50 (base archive 43ab0f5eb) | Test Files 12 failed / 38 passed (50); Tests 16 failed / 623 passed / 28 skipped (667) | 1 |
| `npx vitest run tests/lint` WHOLE (tip 3ce566984, mutex) | Test Files 3 failed / 217 passed (220); Tests 4 failed / 3267 passed (3271) | 1 |
| the three red lint files at the base archive | Test Files 3 passed (3); Tests 108 passed (108) | 0 |
| the three red lint files at 42d5f1ffb's source | `defenceFactReaders` green (it was red at 3ce566984: the inline `/^walls$/i.test` lines; cured by naming them); `writerReach` 2 red, `sovereigntyLightingContract` 1 red (above) | 1 |
| `npm run typecheck:ratchet` (final) | 167 error(s), ceiling 167 | 0 |
| `npm run typecheck:domain:strict` (final) | 1113 errors, ceiling 1113 | 0 |
| `npm run lint` (final) | 38 problems (0 errors, 38 warnings), none in this lane's files | 0 |

The ledger branch fetch named by the brief (`git fetch … +refs/heads/review-fixes-2026-07-08:…`) was REFUSED by this session's
permission classifier, so `tests/lint` ran without that local ref. `ledgerCitationIntegrity` passed regardless.

## The re-take (the chair's step 3)

- **The run.** GEN11-FIELDS' own census and tally (`gen11-fields.census.mjs`, `tally-gen11-fields.mjs`) were re-run at the tip
  source under the mutex.
  - It covered the same 300 places, `hxd-<size>-0..49`, with the same birth.
  - The six processes exited 0.
- **Reconciliation.** walkMatches, countsMatch and detailsMatch are each 15/15.

| figure | base (GEN11-FIELDS) | tip |
|---|---:|---:|
| `needs_review` | 103 | **15** |
| in the Outlook verdict pool (`criticalIssuePoolKey`, live readings) | 108 | **25** |
| pool by route: count > 0 only | 5 | 10 |
| pool by route: battery only (count 0, `needs_review`) | 97 | **14** |
| pool by route: both | 6 | 1 |
| battery findings | 149 (135 defense-words, 14 tier-noun) | **15** (1 defense-words, 14 tier-noun) |

`needs_review` by size at the tip: thorp 3, hamlet 5, village 3, town 1, city 1, metropolis 2. At the base it was thorp 23, hamlet 33,
village 14, town 30, city 1, metropolis 2.

The remaining findings:

| check | word | field | places | findings | example |
|---|---|---|---:|---:|---|
| tier-noun | town | `culturalIdentity.defensePattern` | 14 | 14 | "Civic musters come first; paid guards are added only when a threat lasts and the town can pay." |
| defense-words | walls | `institutions[].desc` | 1 | 1 | the foundling home's "…raised on within its walls." |

## Executed vs inferred

**EXECUTED**
- The export and its 135 = 135 reconciliation.
- The red at the base (the first cut: 37 red titles; the final cut: one red title listing 37 rows) and the green at the tip.
- The 28 controls green at the base and the tip.
- Both two-tree runs, with the uncapped difference count.
- The 50-file run at the tip and at the base archive.
- `tests/lint` whole.
- The three lint files at the base.
- The typecheck and lint gates.
- The re-take.

**INFERRED**
- **The birth-reader list.** It comes from searches (`record_coherence_battery`, `.judgments`, `needs_review`, `defenseWordsFindings`
  in `src/`) and reading the sites.
- **The draw filters cannot change.** This rests on a grep of the pool files for each excused phrasing. The trees confirm it on
  1,245 births, not on every seed.
- **The sovereignty census's suite-title figure** (+1) was not read: the test stops at the first figure.
- **The golden master's 252.** Its own count of 521 includes the base's staleness, so the 252 rows my change moves are from the trees,
  not from the golden test.

## Scratch (not committed)

Everything below sits in this session's scratchpad: the export census, the confinement copy and its births (`trees/`), the full logs
(`gate.tip.log`, `gate.base.log`, `lint.tip.log`, `lint3.tip.log`, `red.base.log`, `red2.base.log`) and the re-take rows (`gen11tip/`).
