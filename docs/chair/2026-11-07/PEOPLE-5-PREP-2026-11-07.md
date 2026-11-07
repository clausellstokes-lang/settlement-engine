# PEOPLE-5-PREP — the measurement for the surfaces lane (2026-11-07)

> A measure-only seat (an Opus 5.5 child of the cloud chair, Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`) under the owner's full delegation of 2026-11-06, per `docs/chair/2026-11-07/BRIEF-PEOPLE-5-PREP-2026-11-07.md`. Base `origin/lane/integration-2026-11-07` at `1031233a4`; branch `lane/people-5-prep-2026-11-07`. No product byte, no test byte under `tests/` except the dated roster's count (99 → 100). The instruments and their outputs are in `docs/chair/2026-11-07/people-5-prep/`.

**The instruments.** `ast-sites.mjs` — the syntax-tree pass (espree, the parser `scripts/wiring-census.mjs :: astTokens` uses, with JSX on): every member read, destructure, assignment/literal write, `delete`, string-literal key and key-path string (`'npcs[].factionAffiliation'`) of the grouping keys, the six fields and the three helpers; a file that fails to parse is named (0 of 2,386 src and 0 of 3,024 test files failed). `census.mjs` — the classification below, written to `census.json`. The grep cross-check (`grep -rnw` over `src/`, every grep line that the tree pass does not cover printed): the only uncovered lines are comments, prose strings (`npcVerdictApply.js:106–111`'s `why:` sentences, `subsystemRowsCompact.js:70`) and `computeNetworkEcho.js`'s local variable `dominantCategory` — the tree pass misses no code site. A first pass missed four key-path strings (`institutionRename.js:222, 237`, `generationReceiptJudgments.js:161`, `foundingSeeds.js:104`); the cross-check caught them and the pass now reads key-path strings.

## 1. The reader census (src, non-test)

**What counts as the grouping.** `.factions` is read 347 times in `src/`; a receiver that is the powers (`powerStructure`, `ps`, a `power`/`structure`/`politics` alias) is set aside by rule, and every other receiver was READ at its site. Set aside after reading (each with its shape in `census.mjs :: EXCLUDED`): a tension's own `factions` name list (`HistoryTab.jsx`, `OverviewTab.jsx`, `historyGenerator.js`, `readerBattery.js:391`, `viewModel.js:331/492/666`), the FPZ ladder ledger keyed by fkey (`npcLadderKernel.js`, `npcLadderState.js`, `warSeatBooks.js:184`, `warPeaceDecision.js`, `gratitudeBonds.js`, `regenIdentityFold.js`, `ladderRead.js`, `NpcTrailSection.jsx`), the search index's own entries (`dossierSearch.js:328`, `realmEntityWeb.js:163, 233`), the powers under another name (`PowerTab.jsx`'s `r`, `SummaryTab.jsx:36`'s `w`, `vm.power` in `journalPages.js`/`PowerStructure.jsx`, `aiLayer.js`, `aiGrounding.js`'s profiles, `governanceNarrative.js`, `economyReconciliation.js`, `defenseDisplay.js`'s crime signal, `recordInvariants.js`'s power card), bands and plans (`densityBands.js`, `densityRoll.js`, `applyDensityLaw.js:269, 375, 476`), and a palette and a static sample. `.members` is the grouping's in 10 files only (an allowlist after reading: every other `.members` is a coalition, bloc, route network, sub-faction, ownership or the density plan's roster). `dominantCategory` is the grouping's in 3 files. Two INDIRECT readers read a count of the grouping computed elsewhere (`CascadePreviewPanel.jsx:288`, `editFingerprint.js:63` ← `pendingEditsPreview.js:422`).

**Totals (CONFIRMED by the tree pass at `1031233a4`).** 247 read sites in 106 files (reads, destructures, string keys, key-path strings, helper imports and calls); 34 field writes beside them. By subject: the grouping `factions` 90 · `members` 17 · `dominantCategory` 9 · `factionAffiliation` 63 · `secondaryAffiliation` 9 · `linkedFactionIds` 18 · `factionGoal` 2 · `densityRungRole` 1 · `structuralRank` 6 · `npcInFaction` 18 · `factionRosterOf` 7 · `npcHomeInstitution` 7. Files touching the grouping: 63 (23 FPZ); touching the fields or helpers: 59 (21 FPZ) — beside PEOPLE-0's sweep (~62 with ~24 simulation; ~58 + ~6 with ~21 simulation), the sweep holds.

| class | sites | files | owner (sites) |
|---|---|---|---|
| FPZ (the simulation, M-6) | 90 | 35 | FPZ |
| BIRTH | 53 | 21 | PEOPLE-2 14 · PEOPLE-3 8 · PEOPLE-5 31 |
| RETIRED (a birth path PEOPLE-1 retires) | 7 | 4 | PEOPLE-1 |
| DISPLAY | 54 | 29 | PEOPLE-5 53 · PEOPLE-3 1 |
| EDIT | 43 | 17 | PEOPLE-5 |
| **all** | **247** | **106** | PEOPLE-5 owns 127 sites in 57 files |

**FPZ: PEOPLE-0 §5's list stands, with no addition.** Every site under the simulation's directories is in a file PEOPLE-0 named (0 additions). Four of its 39 files carry no site of the grouping or the six fields at this base (`npcLadderKernel.js` and `causeVocabulary.js` read only the ladder ledger or neither; `factionCapture.js` none; `densityAscension.js` reads the density plan's own `members`), so the walker's list (`fpz-list.json`) is 35 files. One site PEOPLE-0 did not cite: `store/settlementSlice.js:1326–1327` (`stripImpairmentsForEvent` over the grouping, the same event path as its `:1469`).

**Not in PEOPLE-0 §5's table (non-FPZ files the sweep missed — PEOPLE-5's):** `domain/factions/factionCatalog.js:57`, `domain/content/contentSampleCategoryFixtures.js:268`, `domain/content/settlementContentProvenance.js:216`, `domain/regenerationMode.js:189`, `domain/coherence/hookTruthRecord.js:187–197` (named only as a coherence row), `components/new/SummaryTab.jsx:122` (destructures the grouping as `_factionGroups` and never reads it: a dead read), `data/foundingSeeds.js:104` (a causal row citing `npcs[].structuralRank` as its effect field), `lib/structuralFingerprint.js:103`, `lib/editFingerprint.js:63`, `domain/coherence/readerBattery.js:320`.

**Replacement reads (the non-FPZ 157 sites).** The powers 26 + the powers by deleting a `|| s.factions` fallback 12 · rank-1 membership 12 (+ 17 in compound rows: the card line with the rank list, the PDF label, the governing power's seat, the rank distribution) · any membership 13 (+ 33 compound: by rank in the cast, each ∈ powers in the receipt, shared power in the battery, the search) · the institution 3 (+1 `corruptionPass`) · memberships + institution as seat fields 7 · veil `memberships` + `institution` 10 · delete 19 (+ 9 the rename's second home, + 2 the grouping write). Per file:

| file (src/) | lines | reads | sites | replacement read | owner |
|---|---|---|---|---|---|
| **BIRTH** | | | | | |
| `data/foundingSeeds.js` | 104 | structuralRank | 1 | rank-1 membership (its rank) | PEOPLE-2 |
| `domain/coherence/crisisCastFindings.js` | 61 | factionAffiliation | 1 | any membership | PEOPLE-2 |
| `domain/coherence/hookTruthRecord.js` | 51, 53, 187, 189, 191, 192, 193 | factions, members | 7 | the powers / any membership | PEOPLE-3 |
| `domain/coherence/readerBattery.js` | 320 | factionAffiliation | 2 | any membership (shared power) | PEOPLE-5 |
| `domain/coherence/seatHolderFindings.js` | 24, 53 | npcInFaction | 2 | rank-1 membership | PEOPLE-2 |
| `domain/crisis/crisisCast.js` | 403, 665, 684, 746, 879 | factionAffiliation | 5 | any membership, by rank | PEOPLE-2 |
| `domain/crisis/crisisHooks.js` | 101 | factionAffiliation | 1 | rank-1 membership | PEOPLE-2 |
| `domain/dossier/seatHolder.js` | 31, 116 | npcInFaction | 2 | rank-1 membership (of the governing power) | PEOPLE-2 |
| `generators/crossSettlementConflicts.js` | 180, 268, 270, 284, 285, 291, 292 | factions, dominantCategory | 7 | the powers | PEOPLE-5 |
| `generators/generateSettlementPipeline.js` | 449 | factions | 1 | delete | PEOPLE-5 |
| `generators/generationCoherence.js` | 70, 71, 75 | factions | 3 | delete | PEOPLE-5 |
| `generators/generationReceiptJudgments.js` | 157, 158, 161, 163, 168, 177 | factionAffiliation, factions, members | 6 | any membership (each ∈ powers) | PEOPLE-5 |
| `generators/narrativeGenerator.js` | 939, 940, 1034, 1035 | members, factions | 4 | delete | PEOPLE-5 |
| `generators/neighbourGenerator.js` | 123, 186 | factions | 2 | the powers (delete the fallback) | PEOPLE-5 |
| `generators/npcStructure.js` | 39, 398 | factionAffiliation | 2 | rank-1 membership | PEOPLE-2 |
| `generators/power/conflicts.js` | 68 | members | 1 | the powers | PEOPLE-3 |
| `generators/power/factionGrouping.js` | 37 | factionAffiliation | 1 | delete | PEOPLE-5 |
| `generators/recordBatteryFindings.js` | 78 | factions | 1 | the powers | PEOPLE-5 |
| `generators/steps/assembleSettlement.js` | 139, 351 | factions | 2 | delete (grouping) · the powers (generateConflicts, PEOPLE-3) | PEOPLE-5 |
| `generators/steps/corruptionPass.js` | 78 | secondaryAffiliation | 1 | the institution (corruptTies already carries the house) / delete | PEOPLE-5 |
| `lib/structuralFingerprint.js` | 103 | structuralRank | 1 | rank-1 membership (rank distribution) | PEOPLE-5 |
| **RETIRED** | | | | | |
| `domain/density/densityRungs.js` | 92 | densityRungRole | 1 | delete | PEOPLE-1 |
| `generators/density/applyDensityLaw.js` | 490 | factionAffiliation | 1 | delete | PEOPLE-1 |
| `generators/density/titularSuccession.js` | 86, 189, 243 | factionRosterOf | 3 | any membership | PEOPLE-1 |
| `generators/factionRoles.js` | 323, 342 | factions, factionAffiliation | 2 | delete | PEOPLE-1 |
| **DISPLAY** | | | | | |
| `components/OutputContainer.jsx` | 561 | factions | 1 | the powers | PEOPLE-5 |
| `components/dossier/CascadePreviewPanel.jsx` | 288 | factions | 1 | the powers | PEOPLE-5 |
| `components/dossier/SettlementWorkbench.jsx` | 109 | factionAffiliation | 1 | rank-1 membership | PEOPLE-5 |
| `components/library/LibraryToolbar.jsx` | 105, 106 | factions | 2 | the powers | PEOPLE-5 |
| `components/new/SummaryTab.jsx` | 122 | factions | 1 | delete | PEOPLE-5 |
| `components/new/npcComponents.jsx` | 85, 337 | factionAffiliation | 2 | rank-1 membership (+ the rank list, the institution) | PEOPLE-5 |
| `components/new/tabs/NPCsTab.jsx` | 74 | factionAffiliation | 1 | rank-1 membership | PEOPLE-5 |
| `components/new/tabs/power/PowerStrata.jsx` | 298 | factionAffiliation | 1 | any membership | PEOPLE-5 |
| `domain/ai/personaSlicer.js` | 159, 161 | factionAffiliation, factions | 2 | rank-1 membership · the powers | PEOPLE-5 |
| `domain/ai/suggestedQuestions.js` | 40 | factions | 1 | the powers | PEOPLE-5 |
| `domain/content/contentSampleCategoryFixtures.js` | 268 | factions | 1 | the powers | PEOPLE-5 |
| `domain/content/settlementContentProvenance.js` | 216 | factions | 1 | the powers | PEOPLE-5 |
| `domain/display/dossierViewModel.js` | 510 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/display/galleryVeil.js` | 151, 155, 159, 729 | factionAffiliation, secondaryAffiliation, factionGoal, linkedFactionIds | 6 | veil `memberships` + `institution` | PEOPLE-5 |
| `domain/display/publicSafe.js` | 124, 222, 223 | factionAffiliation, secondaryAffiliation | 4 | veil `memberships` + `institution` | PEOPLE-5 |
| `domain/districtProfile.js` | 260 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/dossier/dossierSearch.js` | 275, 327 | factionAffiliation, factions | 2 | any membership · the powers | PEOPLE-5 |
| `domain/dossier/entityLinks.js` | 408 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/dossier/plotHooks.js` | 407 | factionAffiliation | 1 | rank-1 membership | PEOPLE-3 |
| `domain/dossier/realmEntityWeb.js` | 42, 234 | npcInFaction | 2 | any membership | PEOPLE-5 |
| `domain/factionProfile.js` | 351 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/factions/factionCatalog.js` | 57 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/npcProfile.js` | 558, 572 | structuralRank, factionAffiliation | 2 | rank-1 membership | PEOPLE-5 |
| `domain/state/deriveSystemState.js` | 199 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/tableLedger.js` | 308 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `lib/editFingerprint.js` | 63 | factions | 1 | the powers | PEOPLE-5 |
| `lib/instantWorld/factionDedup.js` | 202, 213, 217 | factions, dominantCategory | 3 | the powers | PEOPLE-5 |
| `pdf/lib/viewModel.js` | 186, 201, 249, 397, 454, 724, 733, 734, 750, 840 | factions, factionAffiliation | 10 | rank-1 membership (label) · the powers (fallbacks) | PEOPLE-5 |
| `pdf/lib/viewModelBodySlices.js` | 156 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| **EDIT** | | | | | |
| `components/settlement/EventComposer.jsx` | 215 | factionAffiliation | 1 | rank-1 membership | PEOPLE-5 |
| `components/settlementDetail/SettlementDetailEditNames.jsx` | 32, 37, 38 | factions, dominantCategory | 3 | the powers | PEOPLE-5 |
| `domain/customContent.js` | 388 | factionAffiliation | 1 | rank-1 membership | PEOPLE-5 |
| `domain/edit/mergeConsequence.js` | 88, 96, 97 | factions, members | 3 | delete | PEOPLE-5 |
| `domain/entities/npcs.js` | 170, 179, 240, 302, 303 | linkedFactionIds | 5 | any membership | PEOPLE-5 |
| `domain/entities/successors.js` | 58, 59, 110 | factions, linkedFactionIds | 3 | any membership · the powers | PEOPLE-5 |
| `domain/factionRefs.js` | 104 | linkedFactionIds | 1 | any membership | PEOPLE-5 |
| `domain/factionRename.js` | 227, 229, 231, 249, 738, 913, 922, 1125, 1127 | factionAffiliation, secondaryAffiliation, linkedFactionIds, factionGoal, factions, members | 9 | delete (the second home) · the powers | PEOPLE-5 |
| `domain/institutionRename.js` | 116, 222, 237 | secondaryAffiliation, factionAffiliation | 3 | the institution | PEOPLE-5 |
| `domain/intent/opVocabulary.js` | 182 | factions | 1 | the powers | PEOPLE-5 |
| `domain/normalizeSettlement.js` | 103 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/npc/npcOps.js` | 72, 73 | factionAffiliation, linkedFactionIds | 2 | memberships + institution (seat fields) | PEOPLE-5 |
| `domain/pendingEditIntents.js` | 84, 88, 90 | factionAffiliation, linkedFactionIds | 3 | memberships + institution (seat fields) | PEOPLE-5 |
| `domain/pendingEditsPreview.js` | 422, 423 | factions | 2 | the powers | PEOPLE-5 |
| `domain/regenerationMode.js` | 189 | factions | 1 | the powers (delete the fallback) | PEOPLE-5 |
| `domain/relationships/neighbourBackLink.js` | 200, 203 | factions | 2 | delete | PEOPLE-5 |
| `store/settlementPendingEditWriters.js` | 38, 42 | factionAffiliation, linkedFactionIds | 2 | memberships + institution (seat fields) | PEOPLE-5 |
| **FPZ** | | | | | |
| `domain/corruption.js` | 649, 685 | factionAffiliation, npcHomeInstitution | 2 | rank-1 membership | FPZ |
| `domain/density/factionLifecycle.js` | 117, 130, 174 | factionAffiliation, factionRosterOf | 3 | rank-1 membership | FPZ |
| `domain/entities/propagate.js` | 350, 460, 461, 483 | linkedFactionIds, factions | 4 | any membership | FPZ |
| `domain/events/affordanceManifest.js` | 206, 211 | factions, factionAffiliation | 2 | the powers | FPZ |
| `domain/events/batch.js` | 150, 396 | linkedFactionIds, factions | 2 | any membership | FPZ |
| `domain/events/factionResponses.js` | 35 | factions | 1 | the powers | FPZ |
| `domain/events/mutateEntities.js` | 43, 382, 504, 750, 827, 848, 879, 880, 902 | npcHomeInstitution, factions, linkedFactionIds, factionAffiliation, structuralRank | 12 | the institution | FPZ |
| `domain/events/mutateHelpers.js` | 52, 167, 168, 170 | factions | 4 | the powers | FPZ |
| `domain/events/registry.js` | 805, 820 | factionAffiliation | 2 | rank-1 membership | FPZ |
| `domain/events/undoEvent.js` | 487, 488 | factions | 2 | the powers | FPZ |
| `domain/worldPulse/assizeKernel.js` | 48, 145, 149, 173 | npcInFaction | 4 | any membership | FPZ |
| `domain/worldPulse/beliefMap.js` | 828 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/brokeragePatronage.js` | 123 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/causeLifecycle.js` | 172 | secondaryAffiliation | 1 | any membership (rank 2) | FPZ |
| `domain/worldPulse/corruptionImpair.js` | 14, 54, 80, 81, 153 | npcHomeInstitution, factions | 5 | the institution | FPZ |
| `domain/worldPulse/factionCompetition.js` | 149 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/factionDensityKernel.js` | 93, 262, 640 | factionRosterOf, factionAffiliation | 3 | any membership | FPZ |
| `domain/worldPulse/houseLedger.js` | 283, 324 | factions, factionAffiliation | 2 | the powers | FPZ |
| `domain/worldPulse/npcAgency.js` | 7, 301, 303, 777, 821 | npcHomeInstitution, factionAffiliation, factions | 5 | the institution | FPZ |
| `domain/worldPulse/npcCirculationTable.js` | 198, 282 | members, factions | 2 | any membership | FPZ |
| `domain/worldPulse/npcLadderFactionMembership.js` | 54 | factionAffiliation | 1 | rank-1 membership | FPZ |
| `domain/worldPulse/npcLadderState.js` | 18, 122, 158 | npcInFaction, structuralRank | 3 | any membership | FPZ |
| `domain/worldPulse/npcLedger.js` | 1051, 1054 | factions, members | 2 | the powers | FPZ |
| `domain/worldPulse/npcVerdictApply.js` | 95, 104, 105, 111, 212, 214, 260 | structuralRank, factionAffiliation, secondaryAffiliation, linkedFactionIds, members, factions | 7 | rank-1 membership (its rank) | FPZ |
| `domain/worldPulse/npcVerdictTable.js` | 273, 702, 709 | factions, members, factionAffiliation | 3 | the powers | FPZ |
| `domain/worldPulse/oathHolder.js` | 88, 156 | npcInFaction | 2 | any membership | FPZ |
| `domain/worldPulse/religionLegitimacy.js` | 51, 279 | npcInFaction | 2 | any membership | FPZ |
| `domain/worldPulse/settlementPolitics.js` | 197 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/successorNpc.js` | 37 | factionAffiliation | 1 | rank-1 membership | FPZ |
| `domain/worldPulse/supplyKernel.js` | 772, 805 | factions | 2 | the powers | FPZ |
| `domain/worldPulse/thievesGuild.js` | 57 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/warPoliticalLoop.js` | 60 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/warRulingsNews.js` | 176 | factions | 1 | the powers | FPZ |
| `domain/worldPulse/warSeatBooks.js` | 41, 215 | npcInFaction | 2 | any membership | FPZ |
| `store/settlementSlice.js` | 1326, 1327 | factions | 2 | the powers | FPZ |

**Writers beside the readers (the record of what PEOPLE-1 and PEOPLE-5 retire).** Field writers (34 sites, the tree pass): `npcGenerator.js:1148, 1294, 1310` (affiliation, secondary, `factionGoal`), `corruptionPass.js:78`, `npcStructure.js:449`, `resolveCrisisCast.js:83`, `applyDensityLaw.js:526`, `factionRoles.js:257, 262`, `publicSafe.js:222–223`, `viewModel.js:733`, `entities/npcs.js:179, 301`, and FPZ's `mutateEntities.js:476–504`, `factionDensityKernel.js:487–642`, `successorNpc.js:37`, `npcVerdictApply.js`. Grouping writers (by hand over the 115 `factions` literal/assignment writes): `factionGrouping.js:39` (builds), `assembleSettlement.js:347` (writes) and `:139, :155` (the neighbour copy, the empty seed), `generateSettlementPipeline.js:449, 579–584`, `narrativeGenerator.js:1035`, `neighbourGenerator.js:186`, `neighbourBackLink.js:200, 203`, `hookTruthRecord.js:197`, `mergeConsequence.js:97` (members), `factionDedup.js:213`, `generationCoherence.js:93`, and FPZ's `mutateHelpers.js:170`, `mutateEntities.js:426`, `undoEvent.js:488`, `propagate.js:464`, `corruptionImpair.js:58`, `npcVerdictApply.js:271`, `settlementSlice.js:1327`.

**Ownership read from the sibling briefs.** PEOPLE-1: the writers in `npcGenerator.js`, the density roster (`applyDensityLaw.js`, `densityRungs.js`, `titularSuccession.js`), `factionRoles.js`, the shim. PEOPLE-2: `crisisCast.js`, `resolveCrisisCast.js`, `crisisCastFindings.js`, `seatHolder.js`, `seatHolderFindings.js`, `crisisHooks.js`'s party, `npcStructure.js` (and with it `foundingSeeds.js:104`'s cited field), `npcInFaction`'s input. PEOPLE-3: `plotHooks.js`, `power/conflicts.js` (re-paired over powers), `assembleSettlement.js:351`'s `generateConflicts` input, `hookTruthRecord.js`. PEOPLE-4: the relationship records and `recordRegister.js`'s relationship key. Everything else non-FPZ is PEOPLE-5's.

## 2. The test census

145 test files read the grouping or the six fields (or a helper): 127 read a field or helper (CONFIRMED by the tree pass) and 18 read only the grouping (PLAUSIBLE: in tests the grouping is recognised by a receiver rule — `s`, `settlement`, `held`, `record` … — not by a read of each site; the 34 `patch.factions` sites in world-pulse tests are the pulse's patch shape and are excluded). PEOPLE-0 counted 153 by sweep; the gap is the receiver rule's narrowness on grouping-only files. Classified by `census.mjs :: classifyTest` (a path-and-import rule, PLAUSIBLE per file; the list is `people-5-prep/test-census.md`):

| class | files | of which read a field |
|---|---|---|
| pins a field by identity → re-key with its cause | 34 | 23 |
| asserts a surface → rewire | 21 | 20 |
| FPZ's → list (not PEOPLE-5's to change; red by design where a field leaves) | 63 | 59 |
| golden door's → bank (M-3; reference a golden or a dormancy golden) | 27 | 25 |

The save museum (`tests/lib/saveMuseum.test.js`) pins `expectSchemaVersion: 1` on three exhibits (`tests/fixtures/save-museum/manifest.js`): those three move to 2 with the migration, cause M-7; `tests/domain/settlementMigrations.test.js` gains the v1 → v2 step (the file's own header says so).

## 3. The save migration (M-7)

**3.1 The v1 fixtures in the repository.** Four committed save files, all on the real load path (`lib/saves.js :: migrateSettlementShape` → `normalizeSettlement` → `settlementMigrations.js :: migrateSettlementToLatest`): `tests/fixtures/legacy-saves/april-2026-v1.json` (3 entries, the only fully real artifact), `save-museum/02-v2-draft-2026-06.json`, `03-campaign-canon-2026-07.json`, `04-forward-version-vNext.json` (schemaVersion 99: passes through unchanged). **None carries a faction field**: 6 NPCs, each `{name, role, goal, secret}`; no `settlement.factions`, no relationships. The repository therefore holds NO v1 fixture that exercises a single M-7 move. The dry run supplies the missing shapes: 60 soak births at this base (every save written today is one — schemaVersion 1, JSON round-tripped so the grouping's aliases split as they do on reload) and 6 copies with the DM layer planted by the real writers.

**3.2 The exact field moves (the proposal the dry run executes).**

| v1 | v2 | rule |
|---|---|---|
| `npcs[].factionAffiliation` | `npcs[].memberships[] { power, rank: null, share: null }` | when it resolves to a power (`factionRefs.js :: resolveFactionRef`, then `factionIdFromName`) |
| `npcs[].secondaryAffiliation` | a second membership | only when it names a power; else REPORTED (it is also an institution handle — `institutionRename.js:116` — and `corruptionPass.js:78` writes a criminal house's name into it) |
| `npcs[].linkedFactionIds[]` | memberships | each id resolved against the powers |
| `npcs[].factionGoal`, `densityRungRole` | deleted | no reader after PEOPLE-5 |
| `npcs[].structuralRank` | carried | PEOPLE-2 keeps a writer (§4.2's chair point) |
| `npcs[].institution` (string) | `{ kind: 'house', name }` for a generated card whose v1 string names a roster house; `null` for a DM card and every other card | M-7 |
| `settlement.factions` | dropped | a grouping entry naming no power is reported (it would be lost) |
| `relationships[] { npc1Id, npc2Id }` | `{ from: npc1Id, to: npc2Id }`, every other field kept | PEOPLE-4's key; a card's out-degree > 1 is KEPT (DM content is never dropped) |
| `schemaVersion` 1 | 2 | `settlement.schema.js:47` |

**3.3 How a DM-authored or locked NPC is recognised.** `canonStatus.js :: tagEntityCanon` (source `user` from `_authored`/`userAuthored`/`source`; `event` from `createdByEventId`/`appliedAt`/`causeEventId` — what `mutateEntities.js :: addNpc` stamps; `locked`/`pinned` flags); `userEdits.js :: applyUserEdit` stamps `_authored` + `_userEdits`; the envelope's `campaignState.locks.npcs` (an id array or `true`) — read by NOTHING today (`locksPreservation.js :: normalizeLocks` returns empty since the owner's 2026-09-17 orders) and outside the settlement object, so `migrateSettlementToLatest` cannot touch it: locks are intact by construction. `recordRegister.js`: `npcs` HELD keyed `id` (the card survives a merge by id), `factions` HELD keyed `name`, `factions[].members` keyed `id`, `factions[].members[]` MIRROR. Custom content: `customContent.js:64` (typedef) and `:388` map a custom NPC's `factionAffiliation` → `controlledBy`. Measured: `userEdits.js :: isEditablePath('npc', 'factionAffiliation')` is **false** — a DM never edits the affiliation through `_userEdits`; it moves only through the seat fields (`reassign-npc`, §4).

**3.4 The dry run** (`people-5-prep/migrate-dry-run.mjs`, output banked in `migrate-dry-run.out.txt`; exit 0). 72 fixtures (6 committed entries, 60 births, 6 planted), 670 cards: **every card kept** (670/670 non-faction fields byte-equal), 0 old fields left; moved `factionAffiliation` 655, `secondaryAffiliation` 28, `linkedFactionIds` 6 (the event-born cards); memberships per card 0: 9 · 1: 633 · 2: 28; deleted `densityRungRole` 655, `factionGoal` 4; `structuralRank` carried 209; house-linked 33; grouping entries dropped 238; ties 1,486 → from/to, cards with out-degree > 1: 581 (kept). DM cards found 24 of 24 planted (authored, entity-locked, lock-map id, event-born), each → `institution: null`, card kept. **What it cannot map: 73 `secondaryAffiliation` values** — 59 name neither a power nor a roster house (e.g. `"criminal network"`, soak1k-4 ×4) and 14 name a roster house (the corruption tie) — and **1 planted grouping-only faction** (an `ADD_FACTION` on a pre-pipeline save, `mutateEntities.js:426`) that dropping the grouping would lose; **12 diverged member copies** (the DM edited a card; the grouping's copy on a reloaded save kept the old one — the MIRROR is stale, the `npcs[]` copy is the truth, nothing lost). Points for PEOPLE-5 (not rulings): the rank of a migrated membership is `null` (a migration cannot re-draw a roll); a non-power `secondaryAffiliation` has no v2 home unless the corruption tie is read from `corruptTies`; a grouping-only faction must move into `powerStructure.factions` before the drop.

## 4. The edit layer (per site: what moves, in the register's terms)

`GENERATION_CONTRACTS.md` today says nothing about the edit layer (no HELD/MIRROR term, no NPC card contract); the HELD/MIRROR declarations live in `src/domain/edit/recordRegister.js` and its walkers (`recordRegisterTotality.walker`, `heldKeyWriterCensus.walker`).

- **`recordRegister.js`** — `RECORD_CLASSES.factions: 'HELD'` (:16) leaves; `GENERATED_KEYS` loses `'factions'` (41 → 40, arm A1); `KEYED_COLLECTIONS.factions: 'name'` and `'factions[].members': 'id'` (:212 and the row after) leave; `CLASS_EXCEPTIONS['factions[].members[]']: 'MIRROR'` leaves (the only MIRROR on an entity path); `relationships: ['npc1Id','npc2Id','type']` → `['from','to','type']` (PEOPLE-4); `npcs: 'id'` stays (the card is keyed by id; `memberships` and `institution` merge inside the HELD card). The register's walkers are re-derived through their doors with cause "PEOPLE-5: the grouping leaves".
- **`edit/mergeConsequence.js :: recomputeMirrors`** (:80–101) — its only job is the `factions[].members[]` MIRROR; it returns 0 once the row leaves and is deleted with it.
- **`factionRename.js`** — `NPC_HOMES` (:217) loses `'factions[].members[]'` (the second home); `NPC_FACTION_FIELDS` (:227–259) replaces `factionAffiliation`, `secondaryAffiliation`, `linkedFactionIds`, `factionGoal` with ONE key row `memberships[].power` (a `list` of power names, exact-key rewrite); `FACTION_RENAME_SURFACES` loses `factions[].name`, `factions[].powerFactionName` and every `factions[].members[].*` row; the walks at :738 (the legacy list fallback), :913–923 and :1125–1128 are deleted; `NPC_HANDLE_KEYS_NOT_CASCADED` (:281) loses its `factionAffiliation` wording.
- **`institutionRename.js`** — `INSTITUTION_HANDLE_FIELDS` (:112–121) loses `secondaryAffiliation` and gains `institution.name` (the card's house; an institution rename now renames a card's title source — PEOPLE-0 §7 risk 5); the faction-ledger label rows `factions[].members[].factionAffiliation` (:222), `npcs[].factionAffiliation` (:237), `factions[].name`, `factions[].powerFactionName` leave; a `npcs[].memberships[].power` label row joins (owned by the faction ledger).
- **The seat fields — three mirrors of one list.** `npc/npcOps.js :: SEAT_HELD_FIELDS` (:71), `pendingEditIntents.js :: SEAT_FIELDS/SEAT_ARRAY_FIELDS` (:81–90, used :638) and `store/settlementPendingEditWriters.js :: SEAT_FIELDS` (:35, used :111): `factionAffiliation` and `linkedFactionIds` → `memberships` (array, in `SEAT_ARRAY_FIELDS`) and `institution`; the intent is `reassign-npc` (op `REASSIGN_NPC`). The three must move in ONE commit (the admission wall, the writer and the op).
- **`entities/npcs.js`** — `createNpc` (:170 id seed, :179) writes `memberships` in place of `linkedFactionIds`; the death impairment loop (:240) reads memberships; the role assignment (:301–303) appends a membership. **`entities/successors.js`** (:58–59, :110) — candidate overlap over memberships; the powers without the grouping fallback. **`factionRefs.js :: entityLinksFaction`** (:103–108) — reads memberships. **`customContent.js`** (:64, :388) — `controlledBy` from the rank-1 membership (a custom NPC's v1 `factionAffiliation` is read once by the migration). **`intent/opVocabulary.js :: buildProtectedContext`** (:182) — protected faction ids from `powerStructure.factions`. **`pendingEditsPreview.js`** (:422–423) and its two indirect readers — count the powers. **`relationships/neighbourBackLink.js`** (:200, 203) — stops copying the grouping onto the partner save. **`components/settlementDetail/SettlementDetailEditNames.jsx`** (:32–38) — the rename list over the powers.
- **4.1 What GENERATION_CONTRACTS.md must say afterwards** (a new section, "The NPC card and the powers"): the powers (`powerStructure.factions`) are the ONLY faction roster; an NPC card carries `institution` (`{kind:'house'|'power', …}` or `null` for the DM's) and ranked `memberships[{power, rank, share}]`, every membership ∈ the powers (a coherence-receipt check: "broken NPC/faction references" now means a membership naming no power); `settlement.factions` and the six fields are gone from a v2 record and survive only in FPZ's simulation reads (named, walker-proved); the edit layer's HELD/MIRROR declarations for the card (`npcs` keyed `id`, relationships keyed `from,to,type`, no MIRROR on an entity path); a v1 save is migrated once by `settlementMigrations.js` (`schemaVersion` 2) with DM cards kept as faces of no house — and the Evolution rules gain "a removed persisted field bumps `SCHEMA_VERSION` with a registered migration".
- **4.2 Chair point (a ruling, not a measurement).** M-2 lists `structuralRank` among the six fields the walker refuses; PEOPLE-2's brief (step 3) keeps a REAL writer of it (`npcStructure.js`, from the first-rank power) and `npcProfile.js:558`, `npcLadderState.js:122`, `structuralFingerprint.js:103`, `foundingSeeds.js:104` read it. Either `structuralRank` leaves the refused list (a derived field of memberships, kept), or PEOPLE-5 re-points its four readers and PEOPLE-2's writer is temporary. The walker draft refuses all six until the chair rules; the change is one line (`REFUSED_FIELDS`).

## 5. The FPZ walker's fixture and draft

`people-5-prep/fpz-list.json`: the 35 files that may still read after PEOPLE-5, each with what it reads, its lines and its reason (M-6; `npcLadderFactionMembership.js` marked SHARED: PEOPLE-2 changes `npcInFaction`'s input to memberships, so a non-FPZ CALL of it is a membership read and is not refused; `factionRosterOf` and `npcHomeInstitution` calls outside FPZ are). `people-5-prep/noLegacyFactionReaders.core.mjs` (the pure walk) + `noLegacyFactionReaders.walker.draft.js` (the vitest draft; `.draft.js` matches no include glob). Run once from a temporary `.test.js` copy (deleted after): **the positive control PASSES** (8 planted reads — a field read, an optional chain, a destructure, a dynamic key list, a key-path string, the grouping, a refused helper call, `structuralRank` — each caught; the powers, a `ps` alias and a tension's `factions` not caught); **the walk is RED: 150 sites in 68 files** (banked: `walker-draft-at-base.txt`), which reconciles exactly with §1 — 157 non-FPZ sites less the 6 `npcInFaction` sites PEOPLE-2 re-points and 1 helper import. It turns green the commit PEOPLE-5's last surface is rewired; RETIRED sites leave with PEOPLE-1's lane.

## CONFIRMED vs PLAUSIBLE

CONFIRMED (the tree pass at `1031233a4`, re-runnable: `node docs/chair/2026-11-07/people-5-prep/census.mjs <out>`): every src site, its file:line and subject; the class of every src FILE (read by hand per file, each row in `census.mjs :: SRC_CLASS`); the FPZ list; the dry run's figures (`migrate-dry-run.mjs`, exit 0); the walker's 150 and its positive control. PLAUSIBLE: the 18 grouping-only test files (a receiver rule in tests, not a per-site read); the four test classes (a path-and-import rule per file); the replacement read and owner where a file holds several kinds of site (one row per file — PEOPLE-5 decides per site); the ±1 of a line where a multi-line expression starts.

**Tip:** the commit that adds this record (its sha in the hand-back message), pushed to `origin/lane/people-5-prep-2026-11-07`.
