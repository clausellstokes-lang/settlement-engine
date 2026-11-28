# SURVEY-FINAL: THE MEASURE BEFORE THE BUILD (S-A "THE FINAL RECORD"; tree 777733a2a; 2026-11-28)

Every count is a script's (CONFIRMED) unless marked PLAUSIBLE. Corpora: `plan-C.json`, `plan-V.json` (900 births each),
born exactly as the page battery births them (`birthConfig(row.config)`, `{ seed, customContent: {} }`). Tools: `tools/`
(an esbuild bundle of the tree's own code; three files transformed IN THE BUNDLE ONLY, nothing written to the tree:
`drawDeclared.js :: note` and the kernel's `noteDrawnVariant` add the line's text and its WHOLE declaration to each ledger
note; `factVocabulary.js :: declarationAdmits` is wrapped to log its direct callers during the birth).

METHOD. (1) Each birth runs inside `withPresumptionLedger`; then every declared note is re-asked against the FINAL
record (the stamped town, as the page reads it: `factsOf(withPublicProse(town, …))`) by the line's own declaration;
every direct `declarationAdmits` call admitted at birth is re-asked the same way (`A-refused.txt`). (2) The 453 births
with any refusal were rendered as the app renders them (OutputContainer, every tab and disclosure walked; the share as
PublicDossierView renders it; the PDF view model `buildViewModel`; the Tonight sheet `composeTonightSheet`), and each
refused line was looked for by its text (`B-printed.txt`). (3) A 300-birth census (every sixth row of C and V) lists every
home that draws a declared line at birth and where its text is stored (`A-homes.txt`). Baseline record hashes of all 1,800
births: `record-hashes-777733a2a.tsv`.

A FINDING ABOUT THE REPLAY ITSELF (CONFIRMED). `presumptionCheck.js :: presumptionFindings` rebuilds each note's
declaration from its atom strings through `declarationOfTags`, which drops a `no <band>` atom (it keeps a negation only
for a presence atom). So the replay cannot see a band exclusion: of the 402 purse-line notes below it sees 40 and misses
362. This measure replays the line's own declaration.

## (A) EVERY HOME THAT DRAWS A DECLARED LINE AT BIRTH AND STORES IT

The full census (about 60 families) is `A-homes.txt`. The homes the FINAL record refuses anywhere in 1,800 births:

| home (`path :: symbol`) | field written | where it prints (the leaf) |
|---|---|---|
| `generators/safetyProfile.js :: keptGuardLine` (SAFETY_LINE_SIBLINGS, the purse clauses) | `economicState.safetyProfile.guardEffectivenessDesc` (a sentence inside it) | `display/defenseDisplay.js :: guardLineAsPrinted` (Defense tab, PDF); the share's stamped `publicProse` defense:posture |
| `generators/steps/institutionDescDraw.js :: drawInstitutionDesc` (institutionDescVariants pools) | `institutions[].desc` | `InstitutionsTab.jsx :: institutionDescription`; PDF `pdf/lib/viewModelBodySlices.js:257` |
| `generators/historyGenerator.js` (HISTORICAL_EVENTS_DATA plotHooks; `trueToRecord` admits the event type) | `history.historicalEvents[].plotHooks[]` | `dossier/plotHooks.js :: collectPlotHooks` (Plot Hooks tab, PDF, Tonight, session) |
| `generators/npcGenerator.js` (npcData NPC_FACTION_LOYALTY) | `npcs[].plotHooks[]` | `collectPlotHooks` |
| `data/stressTypes.js` STRESS_TYPE_SIBLINGS (resolved `kept`) | `stress.crisisHook` | `crisis/crisisHooks.js :: crisisHookFor` (Crisis, Overview) |
| HISTORY_DESC_SIBLINGS (past guild lines) | `history.historicalEvents[].description` / `lastingEffects[]` | History tab |

Every other home is admitted by the final record on all 1,800 (troubleHooks, safetyDesc slots, faction labels and
descriptions, foodways, NPC structure, the outlook hooks, the stress summary, the origin prose, …). Many homes store no
text the ledger can see (templates, slotted lines: `NO TEXT` / `NOT STORED` in `A-homes.txt`); those were re-asked by
their declarations and none is refused.

## (B) ON C AND V: REFUSED BY THE FINAL RECORD, PRINTED, AND WHAT THE DOOR WOULD PRINT

| home | refused | print (owner / share) | the door on the final record prints | worked town |
|---|---:|---:|---|---|
| purse: "…the coin for bounties runs short" | 29 (C 23, V 6) | 29 / 29 | **its own reader admits it** (see below); on the rung: "…as far as the purse runs." 24, "…coordinates emergency response to threats." 5 | C:dp-hamlet-33 |
| purse: "…as far as the purse runs." | 11 (C 4, V 7) | 11 / 11 | own reader: itself; rung: "…coordinates emergency response to threats." 11 | C:dp-village-62 |
| purse twin: "Hired swords back the garrison." | 362 (C 256, V 106) | 362 / 362 | own reader: itself; rung: "…when the purse allows." | C:dp-city-1 |
| charcoal burner, twin `no terrain: forest` | 27 (V) | 26 / 26 | its original ("Kiln crews in the surrounding woodland…") | V:dp-hamlet-12 |
| customs house, twin `no institution: docks` | 20 (V) | 16 / 16 | its original ("…by road or harbour…") | V:dp-metropolis-4 |
| toll bridge, `no crisis: under_siege` | 4 (C) | 4 / 4 | its siege twin | C:dp-town-36 |
| guild_conflict hooks, `guild` | 8 (C 5, V 3) | 2 / 0 | nothing: every hook of the pool needs `guild` | C:dp-hamlet-26 |
| NPC loyalty hooks (`population ≥ middling`; `no route: isolated`) | 2 (V) | 2 / 0 | the next admitted hook of the pool | V:dp-town-107 |
| crisis hook (religious gap), `institution: temple`, `kept` | 4 | 4 / 0 | nothing (kept at birth too: not a late write) | C:dp-thorp-147 |
| past guild descriptions (HISTORY_DESC_SIBLINGS) | 3 | 1 / 1 | the guild-less twin | V:dp-hamlet-84 |
| annual fair, burial ground (siege) | 4 | 0 / 0 | already cured at the source (`assembleSettlement.js :: readHouseDescsLate`) | |

**THE PURSE LINES ARE NOT LATE WRITES (CONFIRMED on all 402).** `keptGuardLine` is handed the purse word of the Economic
Survival BAND (`purseWordOfBand`, COHERENCE-UPKEEP-6, the chair's ruling A: "the guard's purse clause reads the Economic
Survival band"), at the last assembly step. Every "coin runs short" line stands on a band of Weak or Critical; every plain
"Hired swords" twin on Strong; every "as far as the purse runs" on Adequate. Re-asked by ITS OWN reader on the final record,
0 of 402 move. Re-asked on the prosperity RUNG, 402 move (and 362 of them turn "Hired swords back the garrison." into
"…when the purse allows." in a town whose band is Strong).

## (C) WHAT MOVES AFTER THE DRAW (the step order, `generators/steps/index.js`)
1. `assembleInstitutions`: the house descriptions are drawn; terrain is not yet on the record; docks may not stand yet.
2. `cascadePass`: ADDS houses (docks in V:dp-metropolis-4) after their neighbours' descriptions were drawn.
3. `generateEconomy`: prosperity written. 4. `generatePower`: a guild POWER named ("Merchant Guilds").
5. `generatePopulation`: NPC hooks drawn. 6. `generateNarratives`: history drawn (a guild stands: the power); terrain is
   on the record from here.
7. `assembleSettlement`: the purse clauses (the band); then `resolveFactionLabelsAtClose` RENAMES the guild power where no
   guild house stands, so `guild` is false at the end (C:dp-hamlet-26); then `readHouseDescsLate` re-reads the draw-time
   description siblings on the settled record (why the fair and the burial ground are right).
8. A siege in force at the end that the description draw did not read (`settledStressTypes`: forced crises only) (PLAUSIBLE).
A CURE AT THE SOURCE WOULD BE SMALLER for the descriptions (the pool's declarations re-read in `readHouseDescsLate`) and the
hooks (re-resolved at the close, as the faction labels are); it moves about 50 records: not mine to build.

## (D) THE PROPOSAL
ONE helper, `src/domain/facts/lineOnFinal.js :: lineOnFinal(stored, home, record)`: `home` = the line's pool or sibling
table, the site's OWN reader on the final record (default `factsOf(record)`; the purse lines' is the band's word), and the
door's key. It finds the stored line by id where the record stores one (none of these homes does), else by exact text
(sentence by sentence inside a longer field, the tier noun spoken); admitted: as stored; refused: its twin, else the next
admitted line of its pool by the door's rule (`hashKey(key::lineId)`), else nothing; NOT FOUND: the stored text as it is,
counted. An edited field prints as written (`guardLineAsPrinted`'s rule).
Print sites and the pages they move (owner; share): `collectPlotHooks` 4; 0 · a description leaf in `domain/display/`
called by `InstitutionsTab` and the PDF slice 46; 46 · `guardLineAsPrinted` 0 on the band (402 on the rung: THE CHAIR's
RULING) · `crisisHookFor` and the past-guild lines: left out (not late writes: a missing twin, and a past fact on a present
atom, F's rule), named.
