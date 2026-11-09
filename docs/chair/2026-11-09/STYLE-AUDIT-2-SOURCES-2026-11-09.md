# STYLE-2-SOURCES — THE STYLE AUDIT OF THE COMPLEMENT AND THE WAVE'S REMAINDERS (2026-11-09)

**The owner, 2026-11-09, verbatim:** *"Check everywhere in the dossier that you created to see if the style law exists or not and correct"*. The law is the owner's, in `docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md` §5–§8. The chair's rulings on the first audit are in `STYLE-RULINGS-2026-11-07.md`. The brief is `docs/chair/2026-11-09/BRIEF-STYLE-2-AUDIT-2026-11-09.md` §2 (Seat A), on `lane/chair-2026-11-08`.

Seat: STYLE-2-SOURCES (Opus 5.5), a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`). The seat is READ-ONLY on the product. This file and the roster bump it needs are the only bytes the lane writes.

## §0 Method and base

- **Base.** `lane/style-2-sources-2026-11-09` was cut at `b7e32deed`, which is `origin/lane/integration-2026-11-07`; `a74715dda` is an ancestor.
- **Evidence.** `node scripts/audit/soak-review.mjs --count 12 --workers 2` ran at the tip into scratch: exit 0, 12 settlements, 0 errors, 6 findings, CLIMB. The seeds are `soak1k-0 … soak1k-11`. Each `sample/*.txt` holds the screen tabs, the PDF text and the Foundry journal, so `lit` covers all three surfaces.
- **The census.** The chair's script from brief §2 was run verbatim at the tip, in scratch and never committed. It found **258 files with 9,868 sentence-shaped literals**; the chair's own run found 257 files and 9,645 literals.
  - 42 of the 258 are STYLE-0's files. They are the 59 paths that `grep -o … STYLE-AUDIT-2026-11-07.md` extracts, less the generated projections and the files with no literal; together they hold 2,155 literals.
  - The **complement is 216 files with 7,713 literals.**
- **Exclusions.** 109 files with 1,363 literals were excluded by reading (§4). That leaves the **MANIFEST: 107 files with 6,350 literals, 822 of them lit** in the 12.
- **`lit`.** A literal is `lit` when every fixed fragment of 12 or more characters between its slots occurs in one sample dossier. It is a LOWER bound, as in STYLE-0 §0.
- **The judgment.** Eight section auditors judged every manifest literal under one brief. They were Opus subagents of this seat. The brief carried the owner's law verbatim, the struck tics, the §4 models, the eight codes, the census law and the output shape.
  - **The eight codes:** `aphorism · mannered · mechanism-first · machinery-leak · no-evidence · duplicate-surface · retired-word · disconnected`.
  - **The census law:** never add a slot, and never state a fact the writer does not read.
  - **The output shape:** `loc · lit · verdict · codes · FS · needs · NEW · OLD`.
  - **What each auditor did:** opened every file whole, traced where it prints, and confirmed or reversed this seat's file-level exclusions.
- **The remainders.** The seven lane records' "what stays" sections were read at the tip, together with their LAST state sections. Every deferred row's OLD text was then grepped in `src/` at the tip. A row whose OLD text is gone was taken by some lane; a row whose OLD text still prints is untaken (§2-R).
- **The walker baseline (§3).** It was measured by one scratch script over every prose-shaped string literal (two or more words, comments blanked). The scope is the census roots plus the generated annex projections plus `src/domain/worldPulse` and `src/components/map`, less §4's exclusions.
- **Census limit (for Seat B).** The matcher sees string literals only. JSX text nodes are invisible to it, so the tabs and PDF sections that STYLE-0 did not open barely register; of the PDF sections, only `FaithWar.jsx` appears. The surfaces seat covers them.

## §1 The counts

*(§1's verdict counts are filled in from the auditors' rows when they land; see "What stays".)*

### §1-R The remainders, totaled by lane (each deferred row's OLD text grepped at the tip)

| lane record (section read) | rows deferred there | taken since (OLD gone from `src/`) | **untaken at the tip** |
|---|---|---|---|
| W1 §5 + §S7 | 26 code-side + 4 bound copies | all W1-owned rows (§S1, §S7). 333 went to W7 (headlines, done). 334–338 went to W2: `threatAssessment` econA ×4 and the viability foodClause are both absent at the tip | **0** |
| W2 §F6 + the chair's 22:16 rulings | 13 | 58, 77, 352, 353 struck as labels. 374, 59, 343 and 344 done by W4. 88, 373 and 76 done by W1. 89 and 375 done by W7 (the headlines' old frames are absent from the 12) | **0** |
| W3 §6.7 → §8.9 → §8.10 → **§8.11.9** | the generator rows (factionDynamics 27, governanceNarrative 25, rulingStructure 11, stressFactions 3, settlementNarrative 22, npcStructure T, §2a #24) | ALL, per §8.11. Commits `36117799`, `8cfcd8cd0`, `9eb66107d`, `a81f1b437`, `f03484a8e`, `f8f200eb7` and `a4eb47d11` are all ancestors of the tip | **0** (see the STOP below) |
| W4 §S11 → §S12 | 261–273, item 13, item 15, #39, #40, 199 | 261, 263, 264, 268, 269, 270, 272, 273 (§S12). 262, 266 and 267 (W7 §6e: "local face is", "the players can push on" and "whoever moves it moves the crisis" are all absent). #40 (CAST_WANTS rewritten). Item 15 (W7 §6c) | **5** (R1–R5) + item 13's fixture (R6, outside the dossier) |
| W5 §S6 | — | "nothing of the 46" | **0** |
| W7 §5b → §6g → §6h | the record-carried rows | history, food, conflict and safety hooks and the receipt (§6h). Rows 258–261 were struck to W4, and `ECHO_PREFIXES` to W5 (rewritten at the tip) | **0** of its own. `instigatorRival`, struck to W4 and never taken there, is counted in W4's row as R3 |
| **total** | | | **5 printing rows (all lit) + 1 fixture** |

**STOP 1 (reported to the chair 00:3x UTC):** brief §1 item 1 says W3's generator-side rows are NOT TAKEN. The record's last state (§8.11.9: "What stays: nothing of §8.10") and the tip both say they were taken. **Default carried out:** W3 has 0 untaken rows. The owner's finding on the Power tab's governance block is a BLOCK-level `disconnected`: three writers abut without a join. It is in hand with OWNER-WORDS-DOSSIER and Seat B, and is not a line remainder.

## §2 The rewrite tables

### §2-R THE REMAINDERS (all lit; STYLE-0's proposal carried over, then re-read against the writer's READS)

| # | file · key | OLD (as it prints) | code | F/S | STYLE-0 proposal (audit line) | re-read (census law) | NEW (proposed) | needs |
|---|---|---|---|---|---|---|---|---|
| R1 | `src/domain/crisis/crisisCast.js` :: `CAST_REASONS.bruntLeast` (via `crisisHooks.js` castSentence; Tonight Hooks, Crisis page, Plot Hooks, PDF, Foundry) | "In the migration, Hortensia Denter of Religious Authorities takes the worst of it: the least powerful of the house the crisis hits." | mechanism-first, machinery-leak | F (a fragment inside a slotted sentence) | "Incitatus Varro has the least say on the Elder Council, and the migration is landing on him first." (L1900) | **Struck:** "him", because no gender is read, and the restructure, because the fragment is record-carried and has `CAST_REASON_SIBLINGS` keys and the crisis-cast-sense check. The fragment stays a clause. | `bruntLeast: 'the one with the least say in the house the crisis hits hardest'` | what the crisis costs this person (the house's base stake) |
| R2 | `crisisCast.js` :: `CAST_REASONS.leverRuns` (lit 8 times in the 12) | "… (holds the lever): holds the office the crisis turns on." | mannered, duplicate-surface (it repeats its own label) | F | (in the leverSentence rows, L1902) "The famine turns on the Fish market: …" | The composition is already rewritten (W7 §6e). Only the fragment stays, and it repeats the label "holds the lever" beside it | `leverRuns: 'runs the office that decides how the crisis goes'` (the same voice as W4's `leverInstitution`) | the office's own name (on the cast row) |
| R3 | `crisisCast.js` :: `CAST_REASONS.instigatorRival` | "… is stirring it: outranks the seat while it weakens." | machinery-leak, mannered | F | "Masao Li … is stirring the split: as the council weakens, he already carries more weight than its head." (L2127) | **Struck:** "he" and "the council" (neither is read by the fragment) | `instigatorRival: 'already carries more weight than whoever holds the seat, and gains as the seat weakens'` | the seat-holder's name |
| R4 | `src/domain/summary/tonightSheet.js` :: the crisis head's cast list (Tonight, PDF Tonight, Foundry) | "Beast & Raider Threat and Mass Migration. Those who answer for Portaminus's safety … Macrina Denter (bears the brunt); Hortensia Denter (bears the brunt)." | machinery-leak (a role tag printed as prose), duplicate-surface | S | "Portaminus faces raiders and a flood of newcomers at once. The raids fall hardest on Laelia Cicero; the newcomers on Ca…" (§2a #38, approved) | The lead sentence is now W4's #29 official vantage, so only the cast tail remains. Per-crisis attribution needs `stress[].cast` read per crisis | "The worst of it falls on Macrina Denter and Hortensia Denter." (a per-crisis split only where the head reads each crisis's cast) | which crisis each brunt belongs to |
| R5 | `src/domain/dossier/faithReading.js` :: `FAITH_YOURS_LINE` (12 of 12) | "The faith's god and the church's name are yours to set." | machinery-leak | F | print as a hint under the paragraph, not a sentence of it (L1344) | Holds: a layout move on the Faith tab, the PDF and the Foundry page (W4 §S11 row 199), not a wording change | (no new words; the line leaves the paragraph and becomes a hint) | — |
| R6 | `src/components/home/landingFixture.js` (seed lf-033; WAVE-RULINGS item 13) | "… are bound by something neither speaks of, and they are about to stand on opposite sides of a decision that matters" | aphorism | — | rewrite the pool line (the pool line is GONE from `src/`) | Only the fixture's stored narration keeps the old line. It is the home page, outside the dossier | re-record the fixture through PEOPLE-LAND-2's door | — |

*(§2's family tables are filled in from the auditors' rows; see "What stays".)*

## §3 THE STYLE WALKER's word list, with its baseline at the tip

**The proposal.** Land `tests/lint/styleLaw.walker.test.js` as an only-shrinks ratchet.

- **What it scans:** every string literal of two or more words, with comments blanked.
- **Where it scans:** the census roots, the generated annex projections (`src/data/dossierStateProse/*.generated.js`, `src/data/dossierCausalProse.generated.js`), `src/domain/worldPulse` and `src/components/map`, less §4's exclusions.
- **What it holds:** a per-file, per-phrase count that may only fall.
- **What it refuses:** a phrase whose baseline is 0 is refused outright, so the struck tics cannot come back.
- **Its allow-list:** the app-chrome keys of `src/copy/en.js` (the "simulation" and "engine" words of the landing and settings strings), once the A8 rows name them.

**Measured by this seat's scratch script at `b7e32deed`.** Two columns: the literals in the source, and the hits in the 12 printed dossiers (screen + PDF + Foundry).

| phrase (case-insensitive, word-bounded) | class | source hits | files | printed hits in the 12 (towns) | STYLE-0 printed figure, 2026-11-07 |
|---|---|---|---|---|---|
| `faction`, `factions`, `factional`, `factionalism` | retired word | **605** | (in 200 files with any hit) | **298 (12 of 12)** | — (the word was retired after STYLE-0) |
| `rather than` | struck tic | 318 | | **61 (11)** | 61 (12) — **unchanged by the wave** |
| `the record` | struck tic | 99 | | 0 | 9 (6) |
| `the ledger` | machinery | 41 | | 0 | — |
| `the engine` / `the simulator` / `the simulation` | machinery | 34 | | 0 | — |
| `a stranger` | struck tic | 31 | | 1 (1) | 64 (12) |
| `arithmetic` | struck tic | 27 | | 0 | 18 (11) |
| `per cent` / `percent` | machinery | 12 | | 0 | — |
| `on the roster` / `from the roster` / `in the roster` | machinery | 9 | | 0 | — |
| `not merely` | struck tic | 3 | | 7 (2) | 6 (6) |
| `legitimacy score` | machinery | 1 | | 0 | — |
| `the gap widens` | machinery (named in the brief) | 1 (`src/domain/worldPulse/warReceiptPools.js` only) | 1 | 0 | — |
| `the space its authority does not occupy` | machinery (named in the brief) | **0** (absent from the tip) | 0 | 0 | — |
| `two different things` / `do not contradict` | struck tic | 0 | 0 | 0 | 6 (5) |
| `a separate question` | struck tic | 0 | 0 | 0 | 5 (5) |
| `nothing has broken yet` | struck tic | 0 | 0 | 0 | 6 (5) |
| `which is the kind of` | struck tic | 0 | 0 | 0 | 3 (3) |

**Reading (CONFIRMED on the 12).**

- **The wave cured most of the struck tics where they print.** "A stranger" fell from 64 to 1, "arithmetic" from 18 to 0 and "the record" from 9 to 0, and four tics are gone from the source altogether.
- **"Rather than" did not move:** 61 printed balances, the same figure as before the wave. They come mostly from four places:
  - the NPC personality text: "asks questions that seem like interest rather than interrogation" ×10, "attach riders to deals rather than fight directly" ×8;
  - the criminal-structure line: "keeps the criminal operation suppressed rather than eliminated" ×6;
  - the faith and defence annex lines ×3 each.
- **The retired word prints about 25 times in every dossier.** That is 298 in 12. It sits in headings ("The Factions (3)"), in the annex ("How the powers and factions stand to one another") and in hooks ("Both factions have received the offer"). The largest source counts are:
  - `power.generated.js` 71, `npcGenerator.js` 71, `factionDynamics.js` 63, `general.generated.js` 37;
  - `stressInstitutionEffects.js` 19, `narrativeText.js` 18, `causalProse` 18, `stressFactions.js` 16.
- **A heading such as "Factions" is a label (law §4).** Renaming it is a word change on a label, so it is the owner's call or the chair's, not a style rewrite. The walker counts it all the same.

### §3a The per-file baseline (every file with a hit; the ratchet's starting row)

| file | total | hits by phrase |
|---|---|---|
| `src/data/dossierStateProse/power.generated.js` | 86 | faction 71 · rather-than 15 |
| `src/generators/npcGenerator.js` | 72 | faction 71 · rather-than 1 |
| `src/domain/worldPulse/habitForkRegistry.js` | 69 | rather-than 64 · faction 3 · arithmetic 1 · the-record 1 |
| `src/data/dossierStateProse/general.generated.js` | 64 | faction 37 · rather-than 17 · arithmetic 4 · a-stranger 3 · the-record 3 |
| `src/generators/factionDynamics.js` | 63 | faction 63 |
| `src/data/dossierCausalProse.generated.js` | 49 | rather-than 19 · faction 18 · the-record 6 · the-ledger 3 · a-stranger 3 |
| `src/data/dossierStateProse/economy.generated.js` | 33 | rather-than 18 · a-stranger 10 · faction 3 · on-the-roster 2 |
| `src/data/dossierStateProse/warFaith.generated.js` | 30 | rather-than 26 · faction 3 · the-record 1 |
| `src/copy/en.js` | 29 | the-engine 23 · faction 5 · the-record 1 |
| `src/domain/worldPulse/warReceiptPools.js` | 29 | the-record 8 · the-ledger 6 · arithmetic 5 · faction 5 · rather-than 3 · a-stranger 1 · the-gap-widens 1 |
| `src/data/dossierStateProse/defense.generated.js` | 28 | rather-than 23 · faction 4 · a-stranger 1 |
| `src/generators/narrativeText.js` | 24 | faction 18 · rather-than 5 · the-ledger 1 |
| `src/domain/display/rumorFallbackPhrasePools.js` | 23 | rather-than 8 · the-record 7 · faction 5 · arithmetic 2 · the-ledger 1 |
| `src/data/dossierStateProse/stressors.generated.js` | 20 | faction 12 · rather-than 8 |
| `src/data/stressInstitutionEffects.js` | 19 | faction 19 |
| `src/domain/display/rumorFallbackPhrasePoolsEvents.js` | 17 | rather-than 9 · faction 5 · the-record 3 |
| `src/generators/power/stressFactions.js` | 16 | faction 16 |
| `src/generators/npcStructure.js` | 15 | faction 8 · rather-than 7 |
| `src/domain/hookEscalation.js` | 12 | faction 12 |
| `src/data/institutionDescVariants.js` | 11 | rather-than 8 · faction 2 · not-merely 1 |
| `src/data/npcData.js` | 11 | rather-than 6 · faction 4 · a-stranger 1 |
| `src/domain/display/rumorPhrasePools.js` | 11 | the-record 7 · rather-than 2 · arithmetic 1 · the-ledger 1 |
| `src/generators/power/governanceNarrative.js` | 11 | faction 10 · rather-than 1 |
| `src/generators/power/rulingStructure.js` | 10 | faction 6 · rather-than 3 · not-merely 1 |
| `src/domain/crisis/crisisCast.js` | 9 | faction 7 · on-the-roster 2 |
| `src/domain/display/institutionVocabulary.js` | 9 | rather-than 7 · faction 2 |
| `src/domain/display/newsVoice.js` | 9 | faction 5 · the-ledger 4 |
| `src/generators/safetyProfile.js` | 9 | faction 6 · rather-than 3 |
| `src/domain/display/stateProse/decreeProsePools.js` | 8 | the-record 4 · faction 4 |
| `src/domain/display/warRemembrance.js` | 8 | the-record 7 · the-ledger 1 |
| `src/domain/causalState.js` | 7 | faction 6 · legitimacy-score 1 |
| `src/domain/display/heraldIntegrity.js` | 7 | the-record 6 · the-ledger 1 |
| `src/domain/display/stateProse/generalStateProse.js` | 7 | faction 4 · arithmetic 2 · the-record 1 |
| `src/domain/worldPulse/factionCompetition.js` | 7 | faction 7 |
| `src/data/institutionalCatalog.js` | 6 | rather-than 5 · faction 1 |
| `src/data/institutionServices.js` | 6 | faction 5 · arithmetic 1 |
| `src/domain/crisis/crisisSummaryVantage.js` | 6 | faction 6 |
| `src/domain/worldPulse/sovereigntyReceiptPools.js` | 6 | the-record 5 · the-ledger 1 |
| `src/domain/worldPulse/warRulingsNews.js` | 6 | faction 5 · rather-than 1 |
| `src/generators/power/factionStanding.js` | 6 | faction 3 · rather-than 3 |
| `src/generators/power/settlementNarrative.js` | 6 | faction 6 |
| `src/components/map/RelationshipChronicleSection.jsx` | 5 | the-record 5 |
| `src/data/stressTypes.js` | 5 | faction 5 |
| `src/domain/worldPulse/informationReceiptPools.js` | 5 | faction 3 · a-stranger 1 · the-record 1 |
| `src/domain/worldPulse/settlementStrategy.js` | 5 | rather-than 5 |
| `src/generators/economy/prosperity.js` | 5 | faction 3 · arithmetic 1 · rather-than 1 |
| `src/generators/narrativeGenerator.js` | 5 | faction 4 · a-stranger 1 |
| `src/data/historyData.js` | 4 | faction 4 |
| `src/data/narrativeData.js` | 4 | a-stranger 2 · faction 2 |
| `src/data/proseNorms.generated.js` | 4 | arithmetic 2 · the-record 1 · faction 1 |
| `src/domain/content/customContentManifest.generated.js` | 4 | faction 4 |
| `src/domain/display/chroniclersLetter.js` | 4 | the-record 3 · the-ledger 1 |
| `src/domain/display/galleryVeil.js` | 4 | faction 4 |
| `src/domain/worldPulse/demographicsHerald.js` | 4 | rather-than 4 |
| `src/domain/worldPulse/demographicsRates.js` | 4 | rather-than 3 · per-cent 1 |
| `src/domain/worldPulse/npcVerdictApply.js` | 4 | faction 4 |
| `src/domain/worldPulse/partyImpactKinds.js` | 4 | faction 4 |
| `src/domain/worldPulse/realmEvents.js` | 4 | faction 3 · rather-than 1 |
| `src/foundry/journalPages.js` | 4 | faction 4 |
| `src/generators/legacyGenerator.js` | 4 | rather-than 3 · faction 1 |
| `src/generators/people/mintTitles.js` | 4 | faction 4 |
| `src/generators/power/conflicts.js` | 4 | faction 4 |
| `src/generators/stressNarrative.js` | 4 | faction 4 |
| `src/components/map/WorldPulsePanel.jsx` | 3 | per-cent 3 |
| `src/components/new/tabs/power/PowerStrata.jsx` | 3 | faction 2 · per-cent 1 |
| `src/domain/activeConditions.js` | 3 | faction 2 · rather-than 1 |
| `src/domain/display/causeConjunctionRole/merchant.js` | 3 | arithmetic 2 · the-ledger 1 |
| `src/domain/display/causeConjunctionRole/ruler.js` | 3 | arithmetic 2 · the-record 1 |
| `src/domain/display/heraldCausalGrammar.js` | 3 | the-record 3 |
| `src/domain/display/politicsRead.js` | 3 | faction 3 |
| `src/domain/display/settlementRumors.js` | 3 | faction 3 |
| `src/domain/display/stateProse/powerStateProse.js` | 3 | faction 3 |
| `src/domain/worldPulse/changeAuthorityPolicy.js` | 3 | faction 3 |
| `src/domain/worldPulse/envoyTaskCatalog.js` | 3 | rather-than 2 · the-ledger 1 |
| `src/domain/worldPulse/grammarReceiptPools.js` | 3 | the-ledger 2 · the-record 1 |
| `src/domain/worldPulse/npcCirculation.js` | 3 | a-stranger 2 · the-engine 1 |
| `src/domain/worldPulse/pulseKernel.js` | 3 | faction 3 |
| `src/domain/worldPulse/relationshipRulesCore.js` | 3 | faction 2 · rather-than 1 |
| `src/generators/narrative/settlementOriginProse.js` | 3 | rather-than 3 |
| `src/generators/steps/cascadePass.js` | 3 | on-the-roster 3 |
| `src/pdf/lib/headlines.js` | 3 | faction 3 |
| `src/components/map/HeraldWanderers.jsx` | 2 | the-record 2 |
| `src/components/map/WorldMapToolbar.jsx` | 2 | the-engine 2 |
| `src/components/new/tabs/DailyLifeTab.jsx` | 2 | the-engine 2 |
| `src/components/new/tabs/NPCsTab.jsx` | 2 | faction 2 |
| `src/components/settlementDetail/SettlementDetailEditNames.jsx` | 2 | faction 2 |
| `src/data/arrivalProse.js` | 2 | rather-than 1 · a-stranger 1 |
| `src/data/cultureProfiles.js` | 2 | rather-than 2 |
| `src/data/traditionProse.js` | 2 | the-record 1 · faction 1 |
| `src/domain/dailyLife.js` | 2 | faction 2 |
| `src/domain/display/causeConjunctionRole/civic.js` | 2 | arithmetic 1 · the-record 1 |
| `src/domain/display/causeConjunctionRole/healer.js` | 2 | the-ledger 2 |
| `src/domain/display/causeConjunctionRole/laborResource.js` | 2 | the-ledger 2 |
| `src/domain/display/causeConjunctionRole/military.js` | 2 | on-the-roster 2 |
| `src/domain/display/causeConjunctionRole/religious.js` | 2 | the-record 2 |
| `src/domain/display/causeLifecycleVocabulary.js` | 2 | the-ledger 2 |
| `src/domain/display/causeWalk.js` | 2 | the-ledger 2 |
| `src/domain/display/humanizeEngineTokens.js` | 2 | the-record 2 |
| `src/domain/dossier/powerStrata.js` | 2 | the-record 1 · faction 1 |
| `src/domain/explanation.js` | 2 | faction 2 |
| `src/domain/magicProfile.js` | 2 | faction 2 |
| `src/domain/npcProfile.js` | 2 | faction 2 |
| `src/domain/summary/tonightSheet.js` | 2 | rather-than 1 · faction 1 |
| `src/domain/worldPulse/commercialReasonsNews.js` | 2 | the-record 2 |
| `src/domain/worldPulse/conquestFeasibility.js` | 2 | the-record 2 |
| `src/domain/worldPulse/deityFlaws.js` | 2 | rather-than 2 |
| `src/domain/worldPulse/demographicsPlans.js` | 2 | per-cent 2 |
| `src/domain/worldPulse/espionage/infiltrationDepth.js` | 2 | faction 1 · rather-than 1 |
| `src/domain/worldPulse/espionage/infiltrationDrift.js` | 2 | arithmetic 1 · rather-than 1 |
| `src/domain/worldPulse/espionage/operationsVoice.js` | 2 | the-record 1 · rather-than 1 |
| `src/domain/worldPulse/faithTuningSurface.js` | 2 | rather-than 1 · per-cent 1 |
| `src/domain/worldPulse/heraldDeeds.js` | 2 | faction 2 |
| `src/domain/worldPulse/moralInstitutionPressure.js` | 2 | rather-than 2 |
| `src/domain/worldPulse/relationshipMemory.js` | 2 | rather-than 1 · arithmetic 1 |
| `src/domain/worldPulse/relationshipRulesAdversarial.js` | 2 | faction 1 · rather-than 1 |
| `src/domain/worldPulse/treatyLifecycleVoice.js` | 2 | the-record 1 · rather-than 1 |
| `src/domain/worldPulse/warTermination.js` | 2 | the-record 2 |
| `src/generators/economy/viability.js` | 2 | rather-than 2 |
| `src/generators/neighbourGenerator.js` | 2 | faction 2 |
| `src/generators/services/serviceCategoryTables.js` | 2 | faction 2 |
| `src/generators/steps/neighbourFactions.js` | 2 | faction 2 |
| `src/components/map/AdvanceReport.jsx` | 1 | the-engine 1 |
| `src/components/map/heraldRegister.js` | 1 | the-record 1 |
| `src/components/map/heraldWanderers.js` | 1 | a-stranger 1 |
| `src/components/map/NpcTrailSection.jsx` | 1 | the-record 1 |
| `src/components/map/PantheonPanel.jsx` | 1 | per-cent 1 |
| `src/components/map/PerspectiveStandings.jsx` | 1 | the-ledger 1 |
| `src/components/map/RealmIntrigue.jsx` | 1 | faction 1 |
| `src/components/map/SimulationRulesAxes.jsx` | 1 | the-engine 1 |
| `src/components/map/WorldMapTourSteps.js` | 1 | the-engine 1 |
| `src/components/map/WorldPulseData.js` | 1 | per-cent 1 |
| `src/components/new/tabs/PowerTab.jsx` | 1 | faction 1 |
| `src/components/new/tabs/SubstrateTab.jsx` | 1 | faction 1 |
| `src/components/new/tabs/WatchPanel.jsx` | 1 | the-record 1 |
| `src/components/settlementDetail/CharterRoadCard.jsx` | 1 | rather-than 1 |
| `src/data/institutionBacking.js` | 1 | faction 1 |
| `src/data/institutionLadders.js` | 1 | faction 1 |
| `src/data/institutionServiceKeys.generated.js` | 1 | faction 1 |
| `src/data/personHooksByTitle.js` | 1 | a-stranger 1 |
| `src/data/powerData.js` | 1 | the-ledger 1 |
| `src/data/spatialData.js` | 1 | faction 1 |
| `src/data/stressorSpinePhrases.js` | 1 | faction 1 |
| `src/domain/crisis/crisisHooks.js` | 1 | faction 1 |
| `src/domain/crisis/crisisPage.js` | 1 | the-engine 1 |
| `src/domain/display/causeConjunctionContent.js` | 1 | the-record 1 |
| `src/domain/display/causeConjunctionRole/criminal.js` | 1 | the-ledger 1 |
| `src/domain/display/causeConjunctionRole/diplomatOutsider.js` | 1 | the-record 1 |
| `src/domain/display/causeConjunctionRole/dissident.js` | 1 | a-stranger 1 |
| `src/domain/display/defenseDisplay.js` | 1 | faction 1 |
| `src/domain/display/heraldIndex.js` | 1 | faction 1 |
| `src/domain/display/stateProse/printProse.js` | 1 | faction 1 |
| `src/domain/display/tracePresentation.js` | 1 | faction 1 |
| `src/domain/display/warAndRoadNames.js` | 1 | the-ledger 1 |
| `src/domain/display/warResolve.js` | 1 | rather-than 1 |
| `src/domain/dossier/hookLines.js` | 1 | faction 1 |
| `src/domain/npc/characterReadModel.js` | 1 | a-stranger 1 |
| `src/domain/worldPulse/applyWorldPulseFactionRoster.js` | 1 | faction 1 |
| `src/domain/worldPulse/bandFamilies.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/calamityKernel.js` | 1 | faction 1 |
| `src/domain/worldPulse/causeLifecycle.js` | 1 | the-ledger 1 |
| `src/domain/worldPulse/commercialReceiptPools.js` | 1 | the-ledger 1 |
| `src/domain/worldPulse/commonsVoiceKernel.js` | 1 | faction 1 |
| `src/domain/worldPulse/counterIntelSweep.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/decisionTier.js` | 1 | faction 1 |
| `src/domain/worldPulse/demographicsKernel.js` | 1 | per-cent 1 |
| `src/domain/worldPulse/envoyChanceMeeting.js` | 1 | arithmetic 1 |
| `src/domain/worldPulse/envoyChanceMeetingStage.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/envoyInbound.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/envoyNews.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/factionDensityKernel.js` | 1 | faction 1 |
| `src/domain/worldPulse/generosityNews.js` | 1 | the-ledger 1 |
| `src/domain/worldPulse/houseActs.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/infoLure.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/institutionStatusLifecycle.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/magicSubstitution.js` | 1 | per-cent 1 |
| `src/domain/worldPulse/npcDmVerbRecords.js` | 1 | a-stranger 1 |
| `src/domain/worldPulse/npcGoalBranches.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/operations/operationGrammar.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/pactProposals.js` | 1 | the-ledger 1 |
| `src/domain/worldPulse/pulseStageManifest.js` | 1 | faction 1 |
| `src/domain/worldPulse/realmVerbExecution.js` | 1 | the-ledger 1 |
| `src/domain/worldPulse/routeNetworkDecay.js` | 1 | the-record 1 |
| `src/domain/worldPulse/settlementLifecycleFirstClass.js` | 1 | the-engine 1 |
| `src/domain/worldPulse/simulationProfile.js` | 1 | faction 1 |
| `src/domain/worldPulse/stressorDynamics.js` | 1 | faction 1 |
| `src/domain/worldPulse/stressorGates.js` | 1 | faction 1 |
| `src/domain/worldPulse/stressors.js` | 1 | faction 1 |
| `src/domain/worldPulse/temperamentPresets.js` | 1 | the-engine 1 |
| `src/domain/worldPulse/thievesGuild.js` | 1 | faction 1 |
| `src/domain/worldPulse/tradeWar.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/warCoalitionRefusal.js` | 1 | rather-than 1 |
| `src/domain/worldPulse/warSiegeVerdict.js` | 1 | rather-than 1 |
| `src/generators/crossSettlementConflicts.js` | 1 | faction 1 |
| `src/generators/factionRoles.js` | 1 | faction 1 |
| `src/generators/isolationGenerator.js` | 1 | not-merely 1 |
| `src/generators/priorityHelpers.js` | 1 | faction 1 |
| `src/generators/recordBatteryFindings.js` | 1 | faction 1 |
| `src/generators/services/serviceRollMaterialization.js` | 1 | faction 1 |
| `src/generators/servicesGenerator.js` | 1 | faction 1 |
| `src/pdf/primitives/StateProse.jsx` | 1 | the-record 1 |

## §4 The exclusions, with reasons (109 files, 1,363 literals; each opened, and each confirmed or reversed by its auditor — see §5)

Classes:
- **N1** — a diagnostic or generation-trace line that never reaches the dossier's prose. Three of these files the brief names; the 15 step files' `recordTrace` reasons feed the PipelineRail and AI grounding, the same class as `stepMetadata`.
- **N2** — code, regex, doc or comment fragments the matcher caught.
- **N3** — marketing, account, home or generate-screen copy outside any dossier.
- **N4** — the AI prompt.
- **N5** — a key table whose texts are byte copies of another file's.
- **N6** — thrown developer, validation or invariant errors.
- **N7** — Compendium-authoring and admin status lines.
- **N8** — editor, AI-overlay, export-menu and Foundry-install chrome.

| file | literals | class and reason |
|---|---|---|
| `src/generators/generationReceiptJudgments.js` | 46 | N1 brief-named diagnostic: generation receipt judgments, never in the dossier's prose |
| `src/generators/generationCoherence.js` | 27 | N1 brief-named diagnostic: coherence violations |
| `src/generators/steps/stepMetadata.js` | 23 | N1 brief-named diagnostic: pipeline step descriptions |
| `src/domain/prose/wiringCensus.js` | 38 | N2 brief-named code/regex fragments |
| `src/domain/prose/entryWalker.js` | 22 | N2 brief-named code fragments (walker) |
| `src/domain/prose/grammarWalker.js` | 15 | N2 brief-named code fragments (walker) |
| `src/domain/prose/moveGrammar.js` | 20 | N2 brief-named code/doc fragments |
| `src/domain/display/stateProse/stateProseKernel.js` | 21 | N2 brief-named regex/doc fragments |
| `src/generators/isolationSupport.js` | 19 | N2 brief-named regex fragments |
| `src/copy/landing.js` | 26 | N3 brief-named marketing copy outside the dossier |
| `src/copy/pricingPage.js` | 29 | N3 brief-named pricing copy |
| `src/copy/deityAuthoring.js` | 28 | N3 brief-named compendium authoring copy |
| `src/generators/aiLayer.js` | 20 | N4 brief-named AI prompt text |
| `src/data/institutionDescColour.js` | 494 | N5 declaration column: its keys are byte copies of institutionDescVariants.js texts (judged there); prints nothing itself |
| `src/domain/hookThemes.js` | 25 | N5 key table: exact-text keys of npcData.js hooks (STYLE-0's file); prints nothing itself |
| `src/domain/institutions/institutionTable.js` | 30 | N2 doc/comment fragments the matcher caught |
| `src/domain/prose/holderTable.js` | 15 | N2 doc fragments |
| `src/domain/prose/proseFingerprint.js` | 12 | N2 regex/code fragments |
| `src/domain/display/institutionProfile.js` | 14 | N2 code fragments |
| `src/generators/structuralValidator.js` | 15 | N2 code fragments (validator) |
| `src/generators/generationContext.js` | 9 | N2 code fragments |
| `src/domain/display/stateProse/dossierMounts.js` | 9 | N2 doc fragments |
| `src/domain/prose/plantLedger.js` | 6 | N2 doc fragments |
| `src/domain/npc/livedExperienceSources.js` | 6 | N2 doc fragments |
| `src/domain/npc/livedExperienceCatalog.js` | 10 | N2 doc fragments |
| `src/domain/npc/characterConsumers.js` | 8 | N2 doc fragments |
| `src/domain/npc/characterEdit.js` | 4 | N2 doc fragments |
| `src/domain/npc/acceptanceCharacterReads.js` | 4 | N2 doc fragments |
| `src/domain/display/stateProse/weaveBlock.js` | 6 | N2 code fragments |
| `src/generators/services/institutionServices.js` | 6 | N2 code fragments |
| `src/components/new/tabs/WarFaithDesk.jsx` | 4 | N2 developer error message + doc |
| `src/domain/display/parityContract.js` | 7 | N2 parity-contract doc strings |
| `src/domain/prose/presenceMeasure.js` | 1 | N2 regex fragment |
| `src/domain/prose/fieldSynonyms.js` | 1 | N2 doc fragment |
| `src/domain/npc/paradigmAxisCatalog.js` | 1 | N2 doc citation |
| `src/domain/npc/npcFacets.js` | 1 | N2 doc fragment |
| `src/domain/npc/characterDrift.js` | 1 | N2 doc fragment |
| `src/domain/npc/knownCharacter.js` | 2 | N2 doc fragments |
| `src/domain/display/heraldJoinMolds.js` | 1 | N2 doc fragment |
| `src/domain/prose/composedWalker.js` | 2 | N2 walker finding text |
| `src/domain/prose/passageShapes.js` | 2 | N2 walker/doc text |
| `src/domain/prose/wiringBranch.js` | 1 | N6 thrown developer error |
| `src/domain/prose/entryGround.js` | 2 | N6 thrown developer errors |
| `src/domain/npc/livedExperienceFunnel.js` | 3 | N6 thrown developer errors |
| `src/domain/townScene/compileTownSceneManifest.js` | 1 | N6 thrown developer error |
| `src/domain/townScene/cartographyContract.js` | 10 | N6 validation errors |
| `src/domain/townScene/manifestRecordValidation.js` | 8 | N6 validation errors |
| `src/domain/townScene/manifestContract.js` | 8 | N6 validation errors |
| `src/domain/townScene/sceneCompileInput.js` | 4 | N6 validation errors |
| `src/domain/townScene/customDefinitionReferenceValidation.js` | 2 | N6 validation errors |
| `src/generators/pipeline.js` | 5 | N6 thrown developer errors |
| `src/generators/generateSettlementPipeline.js` | 7 | N6 developer warnings |
| `src/generators/power/economyReconciliation.js` | 5 | N6 thrown invariant errors |
| `src/domain/dossier/entityLinks.js` | 1 | N6 invariant error |
| `src/domain/content/reviewedSupplyChainPersistence.js` | 20 | N6 content-pack validation errors |
| `src/domain/content/customContentCommands.js` | 20 | N6 content-pack validation errors |
| `src/domain/content/contentFingerprint.js` | 11 | N6 validation errors |
| `src/domain/content/contentEnvironmentRevision.js` | 6 | N6 validation errors |
| `src/domain/content/contentEnvironmentResolution.js` | 6 | N6 validation errors |
| `src/domain/content/settlementContentProvenance.js` | 5 | N6 validation errors |
| `src/domain/content/customContentVersioning.js` | 5 | N6 validation errors |
| `src/domain/content/customSupplyChainReview.js` | 2 | N6 review errors |
| `src/domain/content/contentDraftSession.js` | 2 | N6 compendium errors |
| `src/domain/content/contentEffectProjection.js` | 3 | N6 vocabulary errors |
| `src/domain/content/userContentTunables.js` | 1 | N6 validation error |
| `src/domain/content/contentEnvironmentLibrary.js` | 1 | N6 validation error |
| `src/domain/content/campaignContentLifecycle.js` | 1 | N6 validation error |
| `src/domain/content/customSupplyChainPresentation.js` | 15 | N7 Compendium authoring status lines, outside the dossier |
| `src/domain/content/contentSamplePreview.js` | 5 | N7 Compendium sample-preview status lines |
| `src/domain/content/contentSampleCategoryFixtures.js` | 5 | N7 Compendium fixture notes |
| `src/components/dossier/SettlementWorkbench.jsx` | 3 | N8 editor chrome (workbench) |
| `src/components/dossier/DossierAiConfirms.jsx` | 3 | N8 AI-overlay confirm dialogs (app chrome) |
| `src/components/dossier/DossierNarrativeButtons.jsx` | 4 | N8 AI-overlay button tooltips |
| `src/components/dossier/WorkbenchProseEditor.jsx` | 2 | N8 editor status lines |
| `src/components/dossier/WorkbenchFactionRename.jsx` | 2 | N8 editor status lines |
| `src/components/dossier/PendingChangesBar.jsx` | 6 | N8 editor change-dock status |
| `src/components/dossier/CascadePreviewPanel.jsx` | 14 | N8 editor cascade preview status |
| `src/components/settlementDetail/SettlementDetailActions.jsx` | 6 | N8 edit-mode button tooltips |
| `src/components/OutputContainer.jsx` | 2 | N8 regenerate confirm dialog |
| `src/components/dossier/DossierSessionNotices.jsx` | 1 | N8 AI-refinement failure notice |
| `src/components/dossier/WelcomeCreditCard.jsx` | 1 | N8 account/credits welcome card |
| `src/components/settlementDetail/SettlementDossierHero.jsx` | 1 | N8 canonize-mode notice |
| `src/components/settlementDetail/SettlementDetailNetworkEffectsPanel.jsx` | 1 | N8 panel disclaimer chrome |
| `src/components/dossier/DossierSearchResults.jsx` | 1 | N8 search empty state |
| `src/components/new/tabs/NotesTab.jsx` | 2 | N8 the DM's notes placeholders |
| `src/components/new/npcComponents.jsx` | 2 | N8 pin tooltips (AI overlay) |
| `src/pdf/variants.js` | 4 | N8 export-menu variant descriptions |
| `src/foundry/moduleBuilder.js` | 8 | N8 Foundry module install README and loader code |
| `src/data/securityQuestions.js` | 9 | N3 account security questions |
| `src/data/roadmapLedger.js` | 7 | N3 public roadmap copy |
| `src/data/sampleSettlements.js` | 3 | N3 sample-picker blurbs before generation |
| `src/data/foundingSeeds.js` | 16 | N3 the generate screen's founding-world chooser (before a dossier exists) |
| `src/domain/display/regionWakeReplay.js` | 8 | N3 home-page demo replay |
| `src/domain/display/visibilityAudit.js` | 2 | N7 admin tuning examples |
| `src/generators/steps/isolationPass.js` | 6 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/factionCorrelationPass.js` | 4 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/subsumptionPass.js` | 1 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/coherenceRepairPass.js` | 5 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/generateEconomy.js` | 5 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/assembleInstitutions.js` | 7 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/resolveResources.js` | 7 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/resolveStress.js` | 7 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/stressConfirmPass.js` | 2 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/resolveNeighbour.js` | 1 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/generatePopulation.js` | 1 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/generatePower.js` | 3 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/generateNarratives.js` | 3 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/steps/resolveConfig.js` | 6 | N1 generation trace (recordTrace reason → PipelineRail / AI grounding): the engine's why-trace, same class as the brief's stepMetadata |
| `src/generators/threatDefensePolicy.js` | 2 | N1 generation trace reasons (recordTrace) |

### §4a Outside the census roots, so not in this manifest (STOP 2, reported to the chair 00:4x UTC; default: listed here for a second seat, and inside the walker's scope)

The same matcher over `src/domain/worldPulse`, `src/components/map`, `src/domain/edit`, `src/domain/relationships`, `src/domain/briefs` and `src/utils/generateWorldBook.js` finds **3,291 literals in 259 files**. Of these, `src/domain/worldPulse` holds 2,923 literals in 205 files and `src/components/map` holds 305 in 42. The receipt and event-prose pools write the realm's chronicle, news and event lines; they are the same reader family as `newsVoice.js`. The forty largest files:

| file | literals |
|---|---|
| `src/domain/worldPulse/warReceiptPools.js` | 471 |
| `src/domain/worldPulse/commercialReceiptPools.js` | 151 |
| `src/domain/worldPulse/grammarReceiptPools.js` | 115 |
| `src/domain/worldPulse/eventProse.js` | 108 |
| `src/domain/worldPulse/habitForkRegistry.js` | 98 |
| `src/domain/worldPulse/sovereigntyReceiptPools.js` | 92 |
| `src/domain/worldPulse/stressorGates.js` | 80 |
| `src/domain/worldPulse/informationReceiptPools.js` | 57 |
| `src/domain/worldPulse/stressorDynamics.js` | 56 |
| `src/components/map/SimulationRulesAxes.jsx` | 48 |
| `src/domain/worldPulse/relationshipRulesCore.js` | 45 |
| `src/domain/worldPulse/stressors.js` | 44 |
| `src/domain/worldPulse/relationshipMemory.js` | 41 |
| `src/components/map/heraldWanderers.js` | 41 |
| `src/domain/worldPulse/settlementLifecycleFirstClass.js` | 35 |
| `src/domain/worldPulse/changeAuthorityPolicy.js` | 31 |
| `src/domain/worldPulse/decisionTier.js` | 30 |
| `src/domain/worldPulse/demographicsRates.js` | 30 |
| `src/domain/worldPulse/realmEvents.js` | 29 |
| `src/domain/worldPulse/relationshipRulesAdversarial.js` | 29 |
| `src/domain/worldPulse/settlementStrategy.js` | 28 |
| `src/domain/worldPulse/demographicsHerald.js` | 27 |
| `src/domain/worldPulse/envoyTaskCatalog.js` | 27 |
| `src/domain/worldPulse/convergence.js` | 24 |
| `src/domain/worldPulse/razing.js` | 24 |
| `src/domain/worldPulse/npcDmVerbRecords.js` | 22 |
| `src/domain/worldPulse/settlementLifecycleKernel.js` | 22 |
| `src/domain/worldPulse/warDeployment.js` | 22 |
| `src/domain/worldPulse/espionage/infiltrationDrift.js` | 21 |
| `src/domain/worldPulse/warTermination.js` | 21 |
| `src/domain/worldPulse/warHomeCosts.js` | 20 |
| `src/domain/worldPulse/deploymentReturn.js` | 19 |
| `src/domain/worldPulse/espionage/operationsVoice.js` | 19 |
| `src/domain/worldPulse/realmVerbExecution.js` | 19 |
| `src/domain/worldPulse/warTerminationCauseTables.js` | 19 |
| `src/components/map/WandererVerbControls.jsx` | 19 |
| `src/domain/worldPulse/causeLifecycle.js` | 18 |
| `src/domain/worldPulse/faithTuningSurface.js` | 18 |
| `src/domain/worldPulse/supplyWebWarfare.js` | 18 |
| `src/domain/worldPulse/warCoalitionNews.js` | 18 |

## §5 CONFIRMED against PLAUSIBLE

- **CONFIRMED** (each measured at `b7e32deed` by this seat):
  - the census figures, the complement and the manifest counts;
  - the 12-town soak (exit 0) and the `lit` flags, which are a lower bound;
  - §1-R: every deferred row's OLD text grepped in `src/`, and the seven W3 commits' ancestry;
  - R1–R5 printing in the 12;
  - §3's source and printed counts;
  - §4a's figures.
- **PLAUSIBLE:**
  - that the 15 step files' `recordTrace` reasons never print beyond the PipelineRail and AI grounding (class N1, ruled by analogy to the brief's `stepMetadata`);
  - R1–R4's proposed fragments, as proposals: each is re-read against its READS, but each is record-carried, so it moves the generator golden master and the cast's sibling keys;
  - every §2 family row, until this seat's two-way check is recorded here.

## What stays (if the budget ends here)

- **§1 verdict counts and the §2 family tables**, BY FILE, from the eight section auditors' rows, which live in scratch (`rows/A1.tsv` … `rows/A8.tsv`):
  - A1, `src/data/institutionServices.js`: **DONE in scratch** (780 rows: 768 PASS · 9 REWRITE · 3 EXCL), not yet tabled here;
  - A2, the institution catalogue: 15 files, 1,466 literals;
  - A3, news, chronicle and the realm: 18 files, 599;
  - A4, arrival, roads, traditions, hooks and conflicts: 17 files, 801;
  - A5 and A6, the cause-conjunction content: 15 files, 1,683;
  - A7, NPC and condition lines: 30 files, 534;
  - A8, `src/copy/en.js` and the tabs and PDF: 11 files, 487.
- **§4a's 259 files** for a second seat.
