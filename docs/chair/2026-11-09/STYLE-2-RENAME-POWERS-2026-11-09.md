# STYLE-2-RENAME-POWERS — SW-8's record, first seat (2026-11-09): the owner's map applied C1–C8, handed back at the context ceiling

Seat SW-8 RENAME-POWERS (session `session_01FbPLbbaKV7YuaHy2mo9ouG`), a child of the chair `session_01FbPLbejcfwX5nii12VM673`. Lane `lane/style-2-rename-powers-2026-11-09`, cut from MERGE-TRAIN's final tip **`bd07005b9`**. The map is `docs/chair/2026-11-09/RENAME-POWERS-MAP-2026-11-09.md` on `lane/style-2-rename-powers-map-2026-11-09` (`da257fc21`). It was approved by the owner (05:4x, "I leave everything else to your judgement now") with the chair's rulings: no save migration; land last; `lib/seo.js` keeps "factions", with `searchIndex.js` adding "powers" beside it; "Peace Movement"; "Member of"; "Rival gangs" through the institution display seam; mintTitles' old keys kept as silent aliases.

**Handed back BY FILE under rule 14** (the chair, 16:1x). C1–C8 are pushed. C9, C10 and the record's gates remain for a second seat on this lane, from the tip.

## §1 Step 0 — the re-scan at the base (`bd07005b9`)

A Babel scan of `src/` (comments excluded) reads **1,212 string literals holding 1,276 words** that match "faction(s)/factional/FACTION(S)". **Correction:** the scanner also counted the `{faction}` NAME slot in plain-string annex lines as a word. That slot prints a power's name, not the word, and 86 annex lines carry only the slot. So the "printing" figures are true *lines touched by the scan*, not words a reader sees. The reader-facing measure is the style walker (§4).

Diffed against the map (taken at `2053a809c`): 576 map rows, of which 575 were unchanged at the base, 11 gone (rewritten by the train: npcGenerator ×7, economyReconciliation, governanceNarrative ×2, foundingSeeds) and 1 new (foundingSeeds :94, the same line moved).

**The NOT-TOUCH test, by line.** For every file another style lane touches, I read that lane's tip and asked whether the row's old text still stands there. **58 rows are skipped as that lane's** (it rewrote them):

| lane | rows |
|---|---|
| crisis-vantages (SW-5) | crisisSummaryVantage ×6, causalState :732 :736 :1153, politicsRead ×3, stressInstitutionEffects :175 |
| realm-prose (SW-3) | newsVoice ×5, decreeProsePools ×4, traditionProse :81 |
| hooks-connective (SW-4) | hookEscalation ×10 (all but the :477 label) |
| pulse-lines (SW-12) | factionCompetition :811 :812 :985 :1010 |
| pulse-card (SW-11) | heraldDeeds ×2, relationshipRulesAdversarial :164, relationshipRulesCore :539 :820 |
| power-side (SW-7) | power.generated DS-POW ×6, prosperity :79, legacyGenerator :192, factionStanding ×3 |
| eco-def-blocks (SW-B6) | defense.generated :6103, economy.generated :5595 |
| institutions (SW-2) | institutionServices :1215 :1223 :1658 |

The lanes' own new lines print no bare "faction" (only `{faction}` slots and one id). SW-6, SW-10, SW-B1 and SW-B7b had no lane on the remote at the base. Their files took the swaps here, and the merge seat resolves any word-only overlap. `powerSiblings.js` :85/:89 carry no printed word at the base, so nothing was done there. `rulingStructure.js` :409 is applied in C9 (SW-B1 has no lane).

## §2 The causes (UNSIGNED deltas, for STYLE-2-MERGE)

Each delta was measured against its parent. For gm and the fence, each corpus is re-driven row by row with the test's own generator call (scratch tools `gm.test.js` and `fence.test.js`, not committed; 0/525 and the base hashes match the committed fixtures at `bd07005b9`). Prose uses `node scripts/prose-manifest-cells.mjs --out` and then `prose-manifest-diff.mjs`.

| commit | cause | gm /525 | fence /360 | prose cells | other |
|---|---|---|---|---|---|
| `a1b63f95e` + `3a69fcd9b` | C1 the names (Part A) | **96** (city 72, metropolis 24) | **76** (thorp 6, hamlet 7, village 2, town 4, city 27, metropolis 30) | 0 | herald desk moved (refile hash `12bfd85c…`); statecraft band re-keyed (§3) |
| `4a2b80bbe` | C1 pins | 0 | 0 | 0 | — |
| `a46d1ba8b` | C2 dossier screen labels | 0 | **7** (thorp 3, hamlet 2, town 2) | 0 | **witness 8/8 rows (worldStateSha256 only)**, bisected: green at `4a2b80bbe`, red at `a46d1ba8b` |
| `26a30d911` | C3 PDF labels | 0 | 0 | 0 | PDF snapshot 0 |
| `417ca5cbe` | C4 Foundry labels | 0 | 0 | 0 | — |
| `e1a550158` | C5 pulse and map | 0 | 0 | 0 | herald hash unchanged from C1 |
| `1e15a3c10` | C6 editing tools | 0 | 0 | — | — |
| `0da9265f9` + `60442334a` | C7 help, compendium, site (+ the wiring census re-stamped at `0da9265f9` through its door) | 0 | 0 | — | census customReachableRows 28 → 36 |
| `e63c6aae6` | C8 annexes (28 lines) | 0 | 0 | **1,038 WORDING-ONLY in 519 towns** | — |

> **CORRECTION, DATED 2026-11-09 (the second seat, under the chair's ruling (B) of 17:2x; the row above left as written):** the C7 row's "census customReachableRows 28 → 36" was not the census's honest reading of the renamed manifest. It was **eight false reaches**. `wiringCensus.js :: customReachable` read the display singular as a bucket token, so C7's "Faction" → "Power" made the power desk's own `power.*` root count as custom-content reach (DS-POW-2 ×2, DS-POW-6 ×6). The instrument was cured by stored identity at `8aa770d93` and re-stamped at `d66a0be24`. The count is back to 28, equal to the base's rows by identity (§13).

**The gm-stride pins** red with the golden master from C1 on: generationForkCensus A1, nameHeldThroughAssembly, pipelinePinnedChoosers, pipelinePinnedMode ×3, powerEconomyFreshness A4, rosterFinalUnderHeldRoster, dmLayerGoldenIsolation A7, worldFactRederive A7. **The base's own reds** (identical at `bd07005b9`, not this lane's): 11 in the generator/property suites, including the densityLaw arms, regenNpcEnrichment, editCorpusRatchet, x46NpcBand and institutionBudgetPromise.

## §3 The statecraft band, re-keyed (the chair's ruling 13:4x)

C1 renamed the stress-born powers. A power's name is its identity, so this realm's same-seed draws re-key (bisected to `stressFactions.js` alone). The probe is the test's own seeded run, as a scratch test with `BAND_MODE`, the mutant made by planting `EXPOSE_BASE: 0.06` at `informationStatecraft.js:822` for the run and restoring it after. At C1's tip:
- 0.01 gives scandals 38 and mobilizations 338.
- Head dark gives mobilizations 82.
- 0.06 gives scandals 59 and mobilizations 581.

Re-keyed by the recorded relations: ceiling 57 (mutant − 2), floor 27 (5:7 of live), mobilization floor 72 (twin − 10). The mutant is still caught. The dated note is in the test.

## §4 The referee and the walker

- **The style walker's "faction" count** (SW-0's scanner `scripts/lib/style-law-scan.mjs` from `lane/style-2-walker-2026-11-09`, run over this tree because the walker is not in the base): **336 in 106 files at the base, 223 in 71 files at `e63c6aae6`.** The target is 0 printed at the lane's tip; the remainder is C9, C10 and the base's keys the walker counts. The walker's baseline file is not in this lane's tree, so its door is the merge seat's after SW-0 lands.
- **The 1,000 at the base:** `node scripts/audit/soak-review.mjs --count 1000 --workers 4` gives exit 0, 1,000 settlements, 657 findings, 0 errors. The twelve: exit 0. **Not yet run at the tip** (What stays).

## §5 Pins re-keyed by identity (negative arms included)

recordBatteryUnnamed (red-first: the new arm failed before the detector learned "Unnamed power"); stressFactionNames; statecraftExposureBand (§3); institutionDisplayName; defenseCriminalNoteOnce (the anti-vacuity case PLANTED, seed 11 plus a street gang: the base's only shared note was "Multiple Criminal Factions" + "Red Light District" on the catch-all, 17 of 240 seeds; 0 after the rename); powerSeatRender; powerTabSupport T2-19; hookEscalation (both arms); chronicleSnapshotShape ×4; defenseTabFlow (T2-20, CRIME_RE); dossierPhoneFloorAllViews MOBILE_BASELINE Systems/Defense (prose 23 → 24 PLAUSIBLY C1's gang note, chrome 2 → 1, sub14 2 → 1, sub12 0); foundryManifest (presence and absence); editNamesFactionRoster; eventComposerApplyFlow; workbenchFactionRename; editGuardFulfilOps U65-2; editGuardRules A5; customContentSavedCard; handbookClaimsParity; howToUseLivingWorld; libraryShelfCounts; libraryShelfFaces ×4; compendiumCatDeepLink. The census declaration `CONDITION_ARCHETYPE_TEMPLATES.json` follows the live `faction_challenge` cell.

## §6 Remainders and open reds at the tip `e63c6aae6`, BY FILE (What stays)

**Open reds this lane owes** (each confirmed red at the tip and green at the base):
- `tests/domain/rumorFallbackPhrasePools.test.js` (×11) and `tests/domain/rumorPhrasePools.test.js` (×6): C5 swapped `rumorFallbackPhrasePools.js` :906–910, `rumorFallbackPhrasePoolsEvents.js` :188–220 and `settlementRumors.js` :315/:318/:407 in the .js, but those pools JOIN `docs/content/RECEIPT_POOLS_LEGACY.md` §3/§4. **Cure:** give the annex variants the same words (variant 1 is the live string), or revert the .js and route the change through the annex. Rows: faction_institution_capture/suppression, faction_law_preference_push, faction_power_shift, faction_service_bolster, faction_capture, faction_exhaustion, npc_ladder.
- `tests/domain/modeSpeedsWy1.test.js` A5 (four pulse records hash to the base): PLAUSIBLY C5's pulse strings in the records. Measure, then record the delta, unsigned, or cure.
- `tests/domain/surveyorShell.test.js` PIN 2: C7's suggested question ("Which powers hold sway in …") is pinned. Re-key by identity.
- `tests/lint/proseCorpusBytes.test.js` (RAW is EXACT): C8 lowered the annex bytes, so the row must be LOWERED through its door.
- `tests/lint/faithTeaserLicence.test.js` DS-FTH-2: read it. PLAUSIBLY C8's war/faith :5120 line.
- `tests/lint/proseWiringCensus.walker.test.js` (custom-content reachability per kind): C7's manifest rename or the census re-stamp. Read the expected list.
- `tests/lint/observedShapeReaders.walker.test.js` (the live estate classifier): to read.
- `tests/property/dossierProseManifest.test.js` THE DRIFT ARM: the 1,038 cells of C8, unsigned, for the merge seat.

**C9, not started** (generator and data prose). 114 rows from the base re-scan, of which about 30 are `{faction}`-slot-only and do not change. Files:
- foundingSeeds :94 :99 :138
- historyData :1200 ("the war party") :1255 ("the old guard and the young") :1433
- narrativeData :213 :217
- npcData :490 :688 :737 :1761 (SW-7's file: the swap only where its lane left the line)
- stressInstitutionEffects :150 :160 :165 :166 :520 (bare word; the slots stay)
- stressTypes :61–170; stressorSpinePhrases :137
- crisisCast :165–201 (:173 "the strongest figure in a power that gains"); defenseDisplay :173 ("Several gangs may be competing."); hookLines :214; powerStrata :371; hookEscalation :564; tonightSheet :130
- crossSettlementConflicts :95; narrativeGenerator :146
- narrativeText ×17 (:226 "Both sides hold services")
- npcGenerator :426 :433 :458; npcStructure ×8
- power/conflicts ×4
- power/rulingStructure :350 ("the council is always split into camps") :392 :394 ("camps within it compete for control of policy") :409 ("Rule is shared among several powers with no clear leader.") :516 :522
- power/settlementNarrative ×6
- power/stressFactions :154 :247 ("A group of the well-off who have concluded …") :309 :315 :319 :364 ("One of two rival sides …") :370 ("both sides of the faith") :384 ("The breakaway side …") :389 :394 :422
- safetyProfile :207 :340 ("another gang") :592 :594 ("Both sides pay …")
- stressNarrative :146 :172 ("A strong power in") :250 ("Both sides claim") :251

The hand wordings are the map's Appendix X; the rest is the plain swap. Measure gm, fence and prose per cause; generator files move gm.

**C10, not started** (the "why" panels): the reader trace first, for the 41 strings the map marked "reader not traced": capacityModel ×6, causalState :722, contradictions ×2, customContent :367, galleryVeil :483, explanation ×2, factionRelationshipUpdate ×7, magicProfile ×2, npcProfile ×2, rulingPowerCoup :154, deriveSystemState ×3, threatProfile :167, steps/factionCorrelationPass :84, generatePower :119, neighbourFactions :102 :140 (routed by SW-7), resolveStress :93, factionCompetition :848 (done in C5). Swap only the strings that have a reader.

**The record's gates, owed:** the walker's count to 0 printed (SW-0's door at the merge, or the scanner over this tree); the twelve and the 1,000 at the tip (the twenty frames not raised; `coh:tier-noun` 0); eslint (run per cause, clean); `tsc --noEmit` at the tip against the base (NOT RUN); the three record walkers (green at every push).

**One map row not applied:** "Faction information", a dormant criminal service name. It has no per-name display seam (`servicesDisplay.js` labels categories only), so its key stays.

## §7 Process notes (honest)

- `a1b63f95e` staged `recordBatteryFindings.js` while a scratch bisect had it reverted, so the C1 commit carried the red-first test without its cure. `3a69fcd9b` lands the cure, and the two together are C1. Lesson: never stage while a background job mutates the tree.
- `60442334a` was committed and pushed in one chained call, against the three-call form. Every other push used the form.
- C3 and C4 were pushed before the three record walkers ran. They were green when run after.

## §8 CONFIRMED against PLAUSIBLE

**CONFIRMED:**
- the base, the per-cause gm, fence and prose figures (re-driven row by row);
- the witness bisection to C2;
- the statecraft probe and its re-key;
- the base re-scan and the 58 skipped rows (each read at its lane's tip);
- the walker's 336 → 223;
- every re-keyed pin green at its commit;
- the open reds listed in §6 (red at the tip, green at the base).

**PLAUSIBLE:**
- the phone floor's extra Defense prose line as C1's gang note;
- modeSpeedsWy1 as C5;
- faithTeaserLicence as C8;
- the 86 slot-only annex rows reading as names everywhere they print.

---

# Part 2 — the second seat (2026-11-09): the open reds, C9, C10 and the gates

Seat SW-8 RENAME-POWERS, second seat (session `session_01FbPLbfriarzNt6WB5KmjMR`), a child of the chair `session_01FbPLbejcfwX5nii12VM673`. Same lane, same record. Base **`00c9eaba5`** (the first seat's tip, confirmed by `rev-parse` before the first edit). Every golden figure below was measured in a clean worktree at the cause's parent with the cause's patch applied, by the estate's own measuring tools: `scripts/audit/golden-master-stage.mjs` (gm /525), `scripts/audit/refence.mjs` (fence /360) and `scripts/prose-manifest-cells.mjs` with `scripts/prose-manifest-diff.mjs` (prose /1,050). All are UNSIGNED, for STYLE-2-MERGE.

## §9 The causes, continued

| # | commit | cause | gm /525 | fence /360 | prose | other |
|---|---|---|---|---|---|---|
| R1 | `14d613055` | the rumour pools' join: the legacy annex's 13 variants by id follow C5's live strings (+1 pin) | 0 | 0 | 0 | — |
| R2 | `61b1ff2ec` | modeSpeedsWy1 A5 re-keyed `5b6a1e51` → `bce07bf5` | 0 | 0 | 0 | bisected to C5 alone; 15 string leaves |
| R3 | `ac6e69a64` | surveyorShell PIN 2 re-keyed | 0 | 0 | 0 | — |
| R4 | `8bd6c2a7a` | the prose byte baseline through its declared-row door for C8 | 0 | 0 | 0 | five leaves lowered, stressors +7 declared |
| R5 | `91186994d` | faithTeaserLicence: the licensed word "factions" → "powers" | 0 | 0 | 0 | C8 CONFIRMED as the cause |
| R6 | `efe5d087c` | the observed-shape register's governed `--write` (inputs only) | 0 | 0 | 0 | findings 2,190 / 1,531 / 431 unmoved |
| C9-1 | `bfbaeaf2b` | the history and arrival pools (historyData, narrativeData) | **24** (village 12, city 12) | **96** (13/14/19/12/14/24) | 0 | ledger STRESS_DESCS ×2 |
| C9-2 | `64377b197` | the NPC pools (npcData, the four lines SW-7 left) | 0 | 0 | 0 | ledgers ×4 |
| C9-3 | `a898387af` | the stress data (stressInstitutionEffects, stressTypes, stressorSpinePhrases) | 0 | **40** (8/8/5/4/6/9) | 0 | ledgers ×11 |
| C9-4 | `53d7f8a68` | the crisis cast, the defence note, the ruling chain, the want register | **515** (84/84/84/95/84/84) | **48** (13/12/7/7/3/6) | 0 | ledgers ×14; leaf-diff: "no faction gains" → "no power gains" |
| C9-5 | `c85fd3f85` | the narrative generators (narrativeText, narrativeGenerator, settlementNarrative, stressNarrative) | 0 | **27** (3/5/4/5/2/8) | 0 | ledgers ×11 |
| C9-6 | `d12e20112` | the power generators (conflicts, rulingStructure, stressFactions) | **512** (72/84/84/104/84/84) | **260** (11/32/38/59/60/60) | 0 | leaf-diff: the infiltrator's desc |
| C9-7 | `b29b7e06c` | the NPC generators (npcGenerator, npcStructure ×2) | 0 | **1** (metropolis) | 0 | ledger ×3 |
| C9-8 | `503fc64dd` | the safety profile | 0 | **19** (3/3/3/2/2/6) | 0 | — |
| C9-9 | `a74b9d45d` | the founding seeds | 0 | 0 | 0 | — |
| C10 | `65a21239f` | the "why" panels: the 11 traced strings a reader prints | **525** (all) | **360** (all) | 0 | **FENCE 4 `f80ebc32` → `89a770ab`** (below) |
| R7 | `2017aa4b6` | the lighting census refrozen through its ritual for C1's one new test title | 0 | 0 | 0 | titles 28,822 → 28,823 |
| C11 | `8aa770d93` | the census cure, the chair's ruling (B): bucket tokens keyed to the stored `root`, never the display singular | 0 | 0 | 0 | probe arm red-first; runtime manifest artifacts byte-identical |
| C11r | `d66a0be24` | the wiring census re-stamped through its door | 0 | 0 | 0 | customReachableRows 36 → 28, equal to the base's 28 by row identity |
| C10b | `3f67a2f8c` | causalState's faction_power condition tail, the chair's ruling (18:4x) | 0 | 0 | 0 | FENCE 4 unmoved (`89a770ab`) |
| R8 | `f699a8f7c` | the lighting census refrozen for the probe arm's one new title | 0 | 0 | 0 | titles 28,823 → 28,824 (C10b's pin moved no counted title) |

Fence tiers read thorp/hamlet/village/town/city/metropolis. Herald and witness: their failure output is byte-identical at `efe5d087c` and at `65a21239f`, so C9 and C10 moved neither (CONFIRMED). The PDF's `goldenViewModel` is green at the tip.

**FENCE 4** (`tests/property/faithFieldDormancyFence.test.js`, `DORMANT_GOLDEN`, signed door only): moved by C10's `causalState.js` "No factions to evaluate." → "No powers to weigh.". The four corpus towns hold no power, so each carries that contributor. At C10, the corpus JSON holds the new reason 4 times; with the old reason substituted back, the digest is `f80ebc3290869df9` exactly. CONFIRMED text only. It is left red for the merge seat's signing.

**The declaration ledgers.** `docs/census/declarations/*.json` hold some pools verbatim. They followed the live cells by id (the first seat's C2 precedent). The oracle is `census2dTables` / `census2eTables` "every ledger line is at its path, verbatim": red without the ledger move, green with it (C9-1). One row, `STRESS_NARRATIVE_RENDERERS.json` :104 ("Two or three factions each control part of the settlement …"), already differed from its live line at the parent. It is left as found.

## §10 Every line, old → new (for the owner's veto)

The commit bodies carry every line in full. The hand wordings are Appendix X's; the rest are the map table's plain swaps.

- **R1** `docs/content/RECEIPT_POOLS_LEGACY.md`: faction_capture 1 "a faction seizing control" → "a power seizing control"; faction_exhaustion 1 "a faction spent and failing" → "a power spent and failing"; npc_ladder 1 "… rank within a faction" → "… within a power"; faction_institution_capture 1, 7; faction_institution_suppression 1, 3, 8; faction_law_preference_push 1, 8; faction_power_shift 1 "a shift of power between factions" → "a shift in who is strong among the powers", 3 "… on the faction rolls" → "… on the rolls of the powers"; faction_service_bolster 1. All are word for word with C5's live strings.
- **C9-1** historyData: "the war faction is suppressing" → "the war party is suppressing" · "split between the old and young factions" → "split between the old guard and the young" · "the houses one faction wanted cleared" → "… one power …". narrativeData: "controlled by one faction, the western by another" → "… one power …" · "belonging to one faction or another" → "… one power or another".
- **C9-2** npcData: "Root out the faction leaking tax figures to rivals" → "Root out whoever is leaking tax figures to rivals" · "… with a new criminal faction moving into their territory" → "… with a new gang …" · "between two factions of the mages' guild" → "between two camps within the mages' guild" · "A faction on the council wants the debt repudiated" → "One camp on the council wants …".
- **C9-3** stressInstitutionEffects: "both factions" → "both powers"; "whichever faction wins" → "whichever power wins"; "the other faction" → "the other power"; "the faction they framed" → "the power they framed"; "the governing faction has refused" → "the governing power …". stressTypes: "between factions" → "between the powers"; "Three different factions" → "Three different powers"; "The governing faction" → "The governing power" ×3. stressorSpinePhrases: "factions that each hold part of the place" → "powers that each …".
- **C9-4** crisisCast: "its faction gains from the crisis" → "its power gains …"; "in a faction that gains" → "in a power that gains"; "the most powerful of a faction that gains" → "the strongest figure in a power that gains" (X); "the most ambitious of a faction that gains" → "… of a power that gains"; "its faction could go either way" → "its power …"; "no faction gains" → "no power gains"; "no faction could go either way" → "no power …". defenseDisplay: "Multiple factions may be competing." → "Several gangs may be competing." (X). powerStrata: "… at the faction." → "… at the power.". tonightSheet's want-register detector entry: "the faction's position" → "the power's position" (not printed).
- **C9-5** narrativeText ×17 (plain; :226 "Both sides hold services" X; :167 "the first power leader" from the map's table); narrativeGenerator and settlementNarrative fallbacks "the dominant/leading faction" → "… power"; settlementNarrative "at least one power is using the fear", "both powers resent it equally", "the power with the most to gain"; stressNarrative "Two or three powers each run part of", "A strong power in" (X), "Both sides claim the legitimate succession" (X), "The governing power has formally complied".
- **C9-6** conflicts ×4 "both/one faction(s)" → "both/one power(s)". rulingStructure: "internal factions are constant" → "the council is always split into camps" (X); "factions lobby" → "the powers lobby"; "internal factions compete" → "camps within it compete" (X); "other factions" → "other powers" ×2. stressFactions: "at least two powers"; "Elite faction that has concluded" → "A group of the well-off who have concluded" (X); "this power"; "The power is divided" ×2; "The power is lobbying"; "One of two rival sides claiming" (X); "both sides of the faith" (X); "The breakaway side" (X); "the governing power"; "Not officially a power: … several other powers".
- **C9-7** npcGenerator: "the governing faction" → "the governing power" ×3. npcStructure: "Stop any power buying their squad away", "Keep selling to every power".
- **C9-8** safetyProfile: "which power controls a district"; "another criminal faction" → "another gang" (X); "Both the governing power and the insurgency"; "Both factions pay" → "Both sides pay" (X).
- **C9-9** foundingSeeds: "sits among its factions" → "sits among its powers" ×2; "between the governing faction and the insurgency" → "… the governing power …".
- **C10** causalState: "No factions to evaluate." → "No powers to weigh." (X). rulingPowerCoup: "No faction holds enough power to move against the seat." → "No power is strong enough to move against the seat." (X). deriveSystemState: "N active factions competing" → "N powers competing"; "Few factions: concentrated power" → "Few powers: rule is concentrated"; "N active faction conflict(s)" → "N quarrel(s) between powers" (X). factionCorrelationPass: "A dominant faction" → "A dominant power". generatePower and economyReconciliation: "As the governing faction, …" → "As the governing power, …". neighbourFactions: "… a mirror {type} faction here." / "… an opposition {type} faction." → "… power …".

- **C10b, a row ADDED to the owner's map under the chair's ruling (18:4x).** causalState :740, the faction_power condition tail: `${cond.label} destabilizes the faction system.` → `${cond.label} unsettles the balance between the powers.` (the seat's proposed words, granted; the plain swap "the power system" was refused as machinery). It sits in the owner's veto list with the others.

No line was struck under the census law. Every rewording states the same facts or fewer ("whoever is leaking" names no group).

## §11 Pins re-keyed by identity (this seat)

rumorFallbackPhrasePools "the 107 are byte-identical" (R1); modeSpeedsWy1 A5 `BASE_PULSE_HASH` (R2, dated note in the test); surveyorShell PIN 2 (R3, the retired word's absence asserted beside it); faithTeaserLicence LICENSED / CASE_BOUND (R5, the old word not kept, so the vocabulary does not widen); powerTabSupport "renders the chain as far as the data goes" (C9-4); sentenceSlotFallback "genSuccessionNarr … capital" (C9-5); stressFactionNames "the infiltrator takes the other pool's first unused name" (C9-6). Two tests feed the old conflict-hook text in as an input (plotHookParties, conflictHookDraw). They stay valid as written and were not touched. factionRename's stored-receipt fixture is also left alone, by design.

## §12 The reader trace (C10): what prints and what is dead

The trace followed the import graph to a render call and was spot-checked by hand.

**PRINTS** (swapped in C10):
- causalState :722, through `SystemStateSnapshot.jsx :: CausalSubstrate` (the Campaign State PDF).
- rulingPowerCoup :154, through `coup.js` reasons → `WorldPulsePanel.jsx :: OutcomeCard` pills. The wiring is CONFIRMED; firing is PLAUSIBLE, because the gate refuses a coup with no challenger.
- deriveSystemState :202/:205/:212, through `SystemStateBar.jsx`, the PDF `SystemStateSnapshot` and the Foundry `statePage` (drivers).
- The build-trail reasons factionCorrelationPass :84, generatePower :119, economyReconciliation :393 and neighbourFactions :102/:140, through `PipelineRail.jsx :: StepRow`. These show only for a town generated in the session, with the step expanded.

**NO READER** — dead rows, left untouched and named for the post-deploy dead-code census:
- capacityModel ×6: `supplyContributors[].reason`. Its only reader is `explanation.js :: explainCapacity`.
- contradictions ×2: `consequences[]`. Read only into the AI grounding payload, whose prompt (`supabase/functions/generate-narrative/prompts.ts`) keeps only `constraints.lockedEntities` and `userEdits`.
- customContent :367: `classifyCustomEntity` has no importer.
- galleryVeil :483: `VeilDefault.reason`. `resolveVeil` reads the address only.
- explanation ×2: `explain*` is reached only through `counterfactual.js`, and nothing in `src/` imports that file (regenerationDelta and regenerationMode import only `entityCatalog`; checked).
- factionRelationshipUpdate ×7: `factionRelationshipDeltas` is copied into the event log and never rendered.
- magicProfile ×2: its readers copy bands and facets only.
- npcProfile ×2: `consequenceIfRemoved.consequences` has no rendering reader.
- threatProfile :167: `beneficiaries` is read only by explanation.js.
- resolveStress :93: `downstreamEffects[].reason`. StepRow prints the target and the effect, not the reason.

factionCompetition :848 was done in C5.

## §13 The open reds and the STOPs, by file

- `tests/lint/proseWiringCensus.walker.test.js` "custom-content reachability" (28 → 36; factions 2 → 10). **RULED (B) by the chair at 17:2x and CURED: C11 `8aa770d93` + C11r `d66a0be24`.** The bucket tokens are the category key and a STORED `root` added to each category of `schema/custom-content.manifest.json`, never the display singular. Key-only tokens would have lost the base's two institutions rows, which were reached through "institution". The generator requires `root` and strips it from every runtime artifact (`validate:custom-content-manifest` exit 0; a deleted root is refused). The probe arm was red-first. The re-stamped census's 28 rows equal `bd07005b9`'s 28 field for field and in order; the walker's pin is untouched. The STOP as first sent: CONFIRMED cause: C7 renamed the custom-content manifest's display singular "Faction" → "Power". `wiringCensus.js :: customReachable` uses that singular as a bucket token, so "power" now matches the power desk's own root. The 8 new rows are DS-POW-2 ×2 and DS-POW-6 ×6, reading `power.stability`, `power.recentConflict` and `power.criminalCaptureState`; they are false reaches. Probe: the same census rows with the singular set back to "Faction" give factions 2. Options put to the chair: (A) re-key to 36 and name the 8 as false hits; (B, recommended) key the bucket token to the category's stored identity, as its own cause, and re-stamp the census back to 28.
- `src/domain/causalState.js` :740 `${cond.label} destabilizes the faction system.` (a printed contributor reason, in neither the map nor X). **GRANTED by the chair at 18:4x with the proposed words and APPLIED: C10b `3f67a2f8c`**, with a red-first pin in causalStateConditionScan.
- `tests/property/dossierProseManifest.test.js` DRIFT ARM: C8's 1,038 cells, left UNSIGNED as told. C9 and C10 move no prose cell.
- The unsigned goldens red at the tip: generatorGoldenMaster, espionageDormancyFence, faithFieldDormancyFence FENCE 4 (C10), the herald desk (C1) and the witness (C2). The gm-stride pins are red with them, as listed in the first seat's §2 (worldFactRederive A7, pipelinePinnedChoosers A1, powerEconomyFreshness A4, rosterFinalUnderHeldRoster A1, editWorldFactResources A2/A6, generationForkCensus A1, …).
- **Inherited base reds**, each run at `bd07005b9` and red there: religionLegitimacyFactionKey "rulerLens reads the weak elected seat"; worldPulseFactionSeating ×2; layerBoundaries "dependency-cycle set"; densityLaw ×4; editCorpusRatchet ×4; institutionBudgetPromise. These are among the 28 base reds the train record lists as "the base's own, unchanged and line for line" at `2053a809c` (`docs/INTEGRATION_MERGE_TRAIN_2026-11-09.md` on the integration line, the list under the final run's table; the chair's attribution, 18:3x and 18:4x). They are not findings.
- `tests/lint/sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION": red at `00c9eaba5` and missing from the first seat's §6. Bisected: green at `bd07005b9`, red from C1 `a1b63f95e` on. C1's red-first arm added one live test title (28,822 → 28,823). **Cured** through the LIGHTING_CENSUS_REFREEZE ritual (R7 `2017aa4b6`).

## §14 The gates, at the tip

- **The style walker** (SW-0's `scripts/lib/style-law-scan.mjs` from `lane/style-2-walker-2026-11-09`, run over this tree): **223 in 71 files → 130 in 54 files** (131 after C10; C10b one less). C9 accounts for 89 of the drop. C10's strings mostly sit outside the walker's roots, as do foundingSeeds and deriveSystemState. The remainder is by file under §15.
- **The 1,000** (`soak-review --count 1000 --workers 4`, at `bd07005b9` and at `65a21239f`): both exit 0, 1,000 settlements, 657 findings, 0 errors; the finding classes are identical. The twenty most-repeated frames are identical in skeleton and town count; the top forty have nothing new and nothing gone. `coh:tier-noun` is 0 at both. Hooks repetition 0.299 / 0.355 → 0.301 / 0.357 (all / same tier), PLAUSIBLY the reworded conflict and stress hook lines.
- **The twelve** (`--count 12`): exit 0, 12 settlements, 6 findings, 0 errors.
- **The typecheck ratchet** (`npm run typecheck:ratchet`, per file against tsconfig.full.json; the chair's gate, 17:4x): OK at `3f67a2f8c`, "no type regressions (167 error(s), ceiling 167)". A raw `tsc --noEmit` also reads 167 at `bd07005b9` and 167 at `65a21239f`, text-equal modulo positions.
- **eslint**: clean on every cause's files.
- **tests/lint whole** at `efe5d087c` and at `65a21239f`: the same 2 of 3,061 red, proseWiringCensus and sovereigntyLightingContract. Both are now cured (C11/C11r and R7). The re-run at the final tip is in §18.
- **The three record walkers**: green before every push.

## §15 What stays, BY FILE, at the hand-back

**Other lanes' lines** (NOT-TOUCH: each lane's tip no longer holds the line, so the swap rides that lane's rewrite or the merge seat's composition):
- SW-5 CRISIS-VANTAGES: crisisSummaryVantage ×6, causalState :732 :736 :1153, politicsRead ×3, stressInstitutionEffects :175.
- SW-4 HOOKS-CONNECTIVE: hookEscalation ×11 (including :564), crossSettlementConflicts :95.
- SW-3 REALM-PROSE: newsVoice ×5, decreeProsePools ×4, traditionProse :81.
- SW-6 CRISIS-SURFACES: npcStructure ×6.
- SW-12 PULSE-LINES: factionCompetition ×4.
- SW-11 PULSE-CARD: heraldDeeds ×2, relationshipRulesAdversarial :164, relationshipRulesCore ×2.
- SW-7 POWER-SIDE: factionStanding ×3, prosperity :79, legacyGenerator :192.
- SW-2 INSTITUTIONS: institutionServices ×3.
- SW-10 HOOKS: hookLines :214.
- SW-B6 ECO-DEF-BLOCKS: defense.generated :6103.
- SW-B1 CONTRADICTIONS: rulingStructure :409.
- safetyProfile :638 (three lanes).

**Keys and metadata the walker counts but no reader prints** (they stay; the walker's baseline door is the merge seat's):
- the annex pool and block predicate names in general.generated ×7, power.generated ×8, proseNorms.generated, generalStateProse ×2, powerStateProse ×3 and printProse (e.g. "governing faction holds a DOMINANT share", "capture reached an AGENT of a faction");
- the institution key "Multiple criminal factions" (institutionBacking, institutionDescVariants ×2, institutionLadders, institutionServiceKeys.generated, institutionServices, institutionalCatalog, spatialData, institutionDisplayName, institutionVocabulary ×2, calamityKernel, priorityHelpers, serviceCategoryTables). It prints through C1's display seam as "Rival Gangs";
- **"Faction information"** (institutionServices :1156, serviceCategoryTables :788), a dormant criminal service key with no per-name display seam (the first seat's row, carried);
- mintTitles' old names ×3, kept as silent aliases by the ruling;
- recordBatteryFindings :85 (a detector label);
- the registry and policy rationales in changeAuthorityPolicy ×3, decisionTier, habitForkRegistry ×3, npcVerdictApply ×4, pulseStageManifest and infiltrationDepth;
- dailyLife ×2 (fact descriptors);
- serviceRollMaterialization and servicesGenerator ("criminal faction" category keys).

**The C10 dead rows** (§12; no reader; for the post-deploy dead-code census): capacityModel ×6, contradictions ×2, customContent :367, galleryVeil :483, explanation ×2, factionRelationshipUpdate ×7, magicProfile ×2, npcProfile ×2, threatProfile :167, resolveStress :93.

**STOPs:** none open. Both were ruled and applied (C11/C11r; C10b).

**For STYLE-2-MERGE's signing:**
- the gm, fence, prose and FENCE 4 deltas per cause (§9 and the first seat's §2);
- the dossierProseManifest drift arm (C8's 1,038 cells);
- the herald (C1) and the witness (C2);
- the walker's `faction` baseline, down through its door at the merge.

## §16 CONFIRMED against PLAUSIBLE (the second seat)

**CONFIRMED** (executed):
- every open red, red at its parent and green after;
- R2's bisection and leaf diff;
- R5's cause;
- R6's unmoved findings;
- R7's bisection;
- every per-cause gm, fence and prose figure (re-driven in a clean worktree);
- the three leaf diffs (C9-4, C9-6, C10) and FENCE 4's text-only proof;
- the herald and witness unmoved by C9/C10;
- the NOT-TOUCH test over every lane tip;
- the reader trace's key claims (explanation.js unreachable; the SystemStateBar and PDF readers);
- the base's own reds, each run at `bd07005b9`;
- the walker 223 → 131;
- tsc 167 = 167;
- the 1,000 and the twelve.

**PLAUSIBLE:**
- rulingPowerCoup :154 actually firing;
- the hooks repetition's +0.002 attributed to the reworded hook lines;
- the trace's per-field chains I did not re-walk myself (factionRelationshipUpdate, magicProfile, npcProfile, galleryVeil), which rest on the trace's greps.

## §17 Process notes (the second seat, honest)

- I read the chair's rulings late. Six messages (17:2x–18:4x) sat unread in the notification queue while I worked and handed back, so I twice reported the census STOP as "on its default" after it had been ruled. Both rulings were applied before the re-hand-back (C11/C11r, C10b), and so was the chair's typecheck-ratchet correction.
- I misreported the reader-trace split to the chair ("17 print, 24 none") and corrected it in the next message: 11 print, 24 none.
- A comment edit in rumorFallbackPhrasePoolsEvents.js was made and reverted before R1. It could have moved a bundle input hash for no reader gain.
- The lighting refreeze ran in a clean worktree at the tip's own commit, because the main tree held this record uncommitted. Its bytes were carried over unchanged.

## §18 The re-hand-back (after the chair's rulings)

- **tests/lint whole at `3f67a2f8c`:** 1 of 3,062 red, the lighting census's title count, from the census probe arm's new title. It was cured by R8 `f699a8f7c` through the ritual (34/34 after). proseWiringCensus is green: 28 rows by identity, the pin untouched.
- **The typecheck ratchet at `3f67a2f8c`:** OK, 167 against the ceiling of 167.
- **C10b, measured** (clean worktree at its parent `d66a0be24`): gm 0/525 · fence 0/360 · prose 0/1,050.
- **C11, C11r, R7 and R8: 0 by construction, not measured.** They change instruments, registers and tests. The manifest's runtime artifacts are byte-identical (`validate:custom-content-manifest`), so no generator input moved.
