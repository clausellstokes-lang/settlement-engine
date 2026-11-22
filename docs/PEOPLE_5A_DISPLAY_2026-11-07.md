# PEOPLE-5A DISPLAY — every birth and display reader of the old faction fields re-wired to the memberships, the institution and the powers (2026-11-07)

Seat: PEOPLE-5A DISPLAY, lane 5a of the people car, an Opus 5.5 child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06. Branch `lane/people-5a-display-2026-11-07`, cut from `origin/lane/people-234-merge-2026-11-07` at `c7d552370` (lanes 1–4 merged). Brief: `docs/chair/2026-11-07/BRIEF-PEOPLE-5A-DISPLAY-2026-11-07.md` with the common part, the rulings (§0, M-1b, M-2, M-3, M-4, M-6) and PEOPLE-5-PREP's §1 table, §2 census and walker draft (all read on the integration branch with `git show`; nothing merged). Every commit pushed with the bypass.

## 1. What was built, by ruling, with the file manifest

One new pure reader, `src/domain/people/cardPowers.js` (M-1b, M-2): the card's power line ("first of X · second of Y · member of Z"), its house (`institution` kind `house`), its first-rank power, every power it holds, the NPC tab's grouping and the powers list (`powerStructure.factions`, no grouping fallback). It builds on lane 2's `membership.js`. No reader re-wired here reads `factionAffiliation`, `secondaryAffiliation`, `linkedFactionIds`, `factionGoal`, `densityRungRole` or `settlement.factions`. `structuralRank` is KEPT by the chair's ruling (lane 2 writes it), so `npcProfile.js`, `structuralFingerprint.js` and `foundingSeeds.js` keep reading it.

| group · commit | sites re-wired (file · old read → new read) | tests re-keyed / re-wired (cause in the commit) |
|---|---|---|
| (a) `fd8d94f5e` | `npcComponents.jsx` (filter, card line) · `factionAffiliation` → the power names + the house; the line reads "house · first of X · second of Y". `NPCsTab.jsx` · groups by `factionAffiliation` → by FIRST-RANK power; the "Unranked members" and "In no power" groups last | `npcRowLockToggle` (the roster holds memberships), `nameListColumns` (RULED subject `presentFactions` → `groups`) |
| (b) `89afced64` | `PowerStrata.jsx:298` · count of `factionAffiliation === power` → the faces holding a membership in the power (`membersByRank`), the first, second and third named with links | — |
| (c) `dba2a7b9e` | `pdf/lib/viewModel.js` (10 sites) · the label from `factionAffiliation` → first-rank membership; `house` = the house's name; `powerLine` added; six `\|\| s.factions` fallbacks deleted. `viewModelBodySlices.js:156` fallback deleted. `NotableNPCs.jsx` prints the house and the power line. `foundry/journalPages.js` prints `House` and `Standing` | — |
| (d) `c39dae9f6` | `dossierViewModel.js:510`, `districtProfile.js:260`, `entityLinks.js:408`, `factionProfile.js:351`, `factionCatalog.js:57`, `normalizeSettlement.js:103`, `regenerationMode.js:189`, `deriveSystemState.js:199`, `tableLedger.js:308`, `suggestedQuestions.js:40` · grouping fallback → the powers. `dossierSearch.js:275, 327` · `factionAffiliation` → the power names + the house; the grouping fallback deleted. `npcProfile.js:579` · `factionLink` from the first-rank membership; `inferInstitutionLink` reads the card's own house first. `personaSlicer.js:159, 161` · affiliation from the first-rank membership; roster from the powers only. `galleryVeil.js` · floor `factionAffiliation`/`secondaryAffiliation` → `memberships`; `factionGoal`/`linkedFactionIds` leave the eyes; a hidden house removes the card's house (object or legacy string) and every string field naming it | `factionCatalog`, `factionProfile`, `npcProfile`, `distribution`, `personaSlicerFactionRoster` (shapes 2 and 3 retired), `surveyorShell` |
| (e) `554e9df91` | `generationReceiptJudgments.js:157–179` · `factionAffiliation` ∈ powers and the grouping's member and identity checks → each MEMBERSHIP ∈ the powers, ONE face per face-bearing house, conflict parties ∈ the powers. `generationCoherence.js:70–75`, `recordBatteryFindings.js:78` · the grouping branch dropped. `readerBattery.js:320` · same `factionAffiliation` → any shared membership. `hookTruthRecord.js:51–53, 187–197` · the grouping's member copies are not read or kept. `plotHooks.js:400` and `power/conflicts.js:65` (lane 3's fallbacks to the shim's field) → the memberships only | `generationReceiptJudgments` (the broken join is a membership naming no power), `readerBattery` |
| (f) `bf4d0c9f8` | `neighbourGenerator.js:123, 186`, `assembleSettlement.js:142`, `neighbourBackLink.js:200, 203` · the partner's grouping → its powers, carried under `powerStructure.factions`. `crossSettlementConflicts.js:180–292` · engagement over the powers only (`category`, not the grouping's `dominantCategory`). `lib/instantWorld/factionDedup.js:202–217` · THE DEDUP DELETED (it renamed only the grouping's minted names, a no-op since GS-2), with its composer step and contract row; the de-clunk guard stays | `crossSettlementCovertVassal`, `composerPipeline`, `factionDedup` |
| (g) `55d8086f0` | `OutputContainer.jsx:561`, `LibraryToolbar.jsx:105`, `SettlementDetailEditNames.jsx:32–38` (the grouping arm deleted), `SettlementWorkbench.jsx:109`, `EventComposer.jsx:215` (first-rank power), `CascadePreviewPanel.jsx:288` + `editFingerprint.js:63` + `pendingEditsPreview.js:422` (`downstreamCounts.powers`, which counts the powers), `contentSampleCategoryFixtures.js:268`, `settlementContentProvenance.js:216`, `SummaryTab.jsx:122` (a dead read, deleted), `corruptionPass.js:78` (it no longer writes a criminal house into `secondaryAffiliation`; `corruptTies` carries it) | `editNamesFactionRoster`, `libraryToolbar`, `settlementWorkbench`, `pendingEdits`, `editFingerprint`, `cascadePreviewLinkedSaves`; the prose-numerics baseline's line numbers (205 rows, same path/category/snippet) |
| registers `783a59398`, `535f5f3e0`; lint `b5264de36` | §3 | `arcaneClassifierCensus` (two recorded lines moved), `negativeAssertionAnchor` (the dedup row leaves; the new negative anchored), `dossierMountRegistry` (a citation into NPCsTab past its end) |

**STOP 1, `publicSafe.js` (4 sites), written up and not built.** The brief puts the veil's memberships and institution on `publicSafe.js`. Its `NPC_PUBLIC_KEYS` / `publicNpc()` allowlist is pinned character-for-character to the server's SQL twin `npc_allowed` in `_gallery_sanitize_public_json` (migration 189, by `gallerySanitizer.pglite` and `factionMemberPublicParity.pglite`). Swapping `factionAffiliation`/`secondaryAffiliation` for `memberships` therefore needs a new Supabase migration. `docs/OPERATING_STANDARD.md` §6 rule 17 reserves migrations and security posture for the owner. Until that lands, the public projection keeps the shim's two names, and a player-view card shows no power line (its memberships are stripped). The chair or the owner rules; the landing is the natural point.

**Sites PEOPLE-5-PREP gave to PEOPLE-5 that are NOT this lane's:**
- 5b's files: `customContent.js`, `edit/mergeConsequence.js`, `entities/npcs.js`, `successors.js`, `factionRefs.js`, `intent/opVocabulary.js`, `store/settlementPendingEditWriters.js`.
- The seat-field trio: `npc/npcOps.js`, `pendingEditIntents.js` and the store writer move together in one commit with 5b.
- The rename ledgers `factionRename.js` and `institutionRename.js` (PREP §4, the edit layer).
- The grouping's upkeep, kept until the landing deletes `factionGrouping.js` (M-2: the grouping keeps being projected): `narrativeGenerator.js :: relinkFactionMembers` (4 sites) and `generateSettlementPipeline.js:452`.
- PEOPLE-1's RETIRED paths: `densityRungs.js`, `applyDensityLaw.js`, `titularSuccession.js`, `factionRoles.js`.

**The pendingEditsPreview count:** this lane took `pendingEditsPreview.js:422`, an EDIT-class site that is in no lane's file list, because the two display readers in group (g) read its key. 5b should know the key is now `downstreamCounts.powers`.

## 2. The measurement (the lane's instrument, `docs/chair/2026-11-07/people-5a/prove.mjs` + `aggregate.mjs`)

This lane moves no card; PEOPLE-0's per-tier card and power figures stand as lanes 1–4 left them. The lane's figure is the surfaces. On soak 300 (0–299) and the golden 525, for every settlement the instrument builds: every `derive*` of the dossier view model, the entity index, the search (DM and player), the plot hooks, the faction and NPC profiles, the PDF view model, the Foundry journal pages, and the gallery payload under its default veil.

| tier | soak (settlements · throws · cards · cards with a power line · lines naming a missing power) | golden 525 (same) | NPC tab groups every card once · Power tab counts = memberships |
|---|---|---|---|
| thorp | 50 · 0 · 87 · 76 · 0 | 84 · 0 · 199 · 175 · 0 | all · all |
| hamlet | 50 · 0 · 183 · 163 · 0 | 84 · 0 · 386 · 206 · 0 | all · all |
| village | 50 · 0 · 432 · 356 · 0 | 84 · 0 · 639 · 444 · 0 | all · all |
| town | 50 · 0 · 1,299 · 1,173 · 0 | 105 · 0 · 2,124 · 1,963 · 0 | all · all |
| city | 50 · 0 · 2,839 · 2,606 · 0 | 84 · 0 · 4,823 · 4,775 · 0 | all · all |
| metropolis | 50 · 0 · 3,947 · 3,525 · 0 | 84 · 0 · 6,483 · 6,399 · 0 | all · all |

The PDF rows carry the same power-line counts with 0 naming a missing power. The receipt's new checks (every membership ∈ the powers, one face per house, conflict parties ∈ the powers) fire on 0 of soak 0–59. The veil: `toPublicSafe`'s NPC keys are unchanged (STOP 1). The default-eye veil keeps every card's house unless a hidden criminal house removes it. `publicSafe.test`'s X-21e arm proves the pre-car corruption tie is still removed.

**The walker draft** (PEOPLE-5-PREP's `noLegacyFactionReaders`, run from a temporary copy that was deleted afterwards). `structuralRank` is dropped from the refused list by the chair's ruling. The draft's line-keyed "other shape" exemptions (a tension's names, the custom powers, the search index) are matched by reading at both ends. Result: **138 sites in 62 files before → 50 in 19 after**. All 50 are listed in §1's "not this lane's" and STOP 1: 5b 21, the rename ledgers 13, PEOPLE-1's retired paths 6, the landing's grouping upkeep 6, `publicSafe` 4. Zero are left in this lane's groups.

## 3. The registers re-derived

| register | door | result | commit |
|---|---|---|---|
| writer reach | `--rebank --charter='§934.105'` (the door lane 1 and MERGE-234 used; `--write` refused growth) | cohort 1400 → 1399, 7 stale folded out, then the plain check exits 0. Causes: `dominantCategory on factions` goes DARK (the grouping's field; this lane retired every reader, and the landing deletes its writer); five rows were already red at the base (the FPZ per-NPC ledgers, M-6) | `783a59398` |
| wiring census | `node scripts/wiring-census.mjs` | 709 pools, 165 relation rows unmoved (M-4); `producerIndexFiles` 1267 → 1271 (the base's own re-derivation already differs; +1 is `cardPowers.js`) | `783a59398` |
| lighting census | `LIGHTING_CENSUS_REFREEZE='PEOPLE-5A DISPLAY'` + note, on a clean tree; then the plain run 34/34 | files 2970 → 2971 | `535f5f3e0` |
| observed-shape register | **STOP 2 — not re-derivable at this base.** `check-observed-shape-readers.mjs` walks every committed baseline on the ancestry path (`validateBaselineHistory`). The base commit `c7d552370`'s baseline (MERGE-234's lane-4 merge, a textual merge of two baselines that was never re-derived) is internally inconsistent: its `executionTree`, `scanTree` and `sourceTree` manifests' digests do not reconstruct from their entries (CONFIRMED by recomputing `digestOf(entries)` at `8dd30106b` true/true/true and at `c7d552370` false/false/false). Every descendant is red, `--write` included. A re-derive from the last valid baseline was tried and refused for the same reason. The cure is the chair's: a commit restoring a consistent baseline at the merge, then `--write` | — |
| fork census, tuning register, held-key census | no keyed fork, dial or held writer moved (the dedup was rng-free) | their reds are the base's (§4) | — |
| dated roster | `tests/lint/.source-citation-baseline.json` | 96 → 99: `PEOPLE_3_HOOKS`, `PEOPLE_4_TIES` (merged at the base, never counted) and this record | this record's commit |

## 4. The red list

**Attribution.** Each red was attributed by running the same file at a plain worktree of the base `c7d552370`.

**The goldens (M-3), banked by suite and never re-recorded.** One run at the tip: `npx vitest run tests/property tests/simulation/presetLightingWitness.test.js`, 331 files / 711 tests, **6 files / 10 tests red**. That is the same set and count lane 1 banked:
- `generatorGoldenMaster` 1 (the 525)
- `espionageDormancyFence` 1 (the driven 360)
- `dossierProseManifest` 2
- `dmLayerGoldenIsolation` 1 (A7)
- `editCorpusRatchet` 4 (A3/A5/A7/A8; the consistency group for `memberships` + `importance` + the shim's two fields is the migration's, 5b/M-7)
- `heraldKnowledgeDeskGolden` 1
- `presetLightingWitness`: green.

The roster-hashing arms outside `tests/property` are red at the base too: `pdf/goldenViewModel`, `worldFactRederive` A7, `nameHeldThroughAssembly` A1, `pipelinePinnedChoosers` A1, `rosterFinalUnderHeldRoster` A1, `generationForkCensus` A1.

**The soak 1,000, once at the tip** (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`): 1,000 settlements, **0 errors**, 2,349 findings, verdict STOP on `repetition: X-50:boilerplate-twice at 0.131`. The same command at the base worktree gives the same result: 2,349 findings, STOP for the same reason, and **every finding kind's count identical**, by a diff of the per-kind tallies. No `cert:*` or `coh:*` kind fires at either end, beside rung 2F's figures. The STOP and the median band breaks (`npcs.#` at village/town/city) are the cast lanes' and the writing wave's: this lane moves no prose and no card.

**`tests/lint` + `tests/scripts`, whole at the tip** (`b5264de36`'s parent run; 756 files, 3,192 tests): 14 files red. After the lane's cures, the files still red are:
- Red at the base with the same or more arms: `heldKeyWriterCensus` 1, `institutionTable` 2, `mutationCoverageManifest` 1, `negativeAssertionAnchor` 2 (five base files' unanchored negatives), `newsHeadlineContract` / `newsVoiceContract` (suite-level), `proseFamilyContract` 5, `proseWiringCensus` 1 (3 at the base), `tuningRegister` 4, `writerReach.walker` 2 (9 at the base: its remaining two compare against the observed-shape register's `corpusMeta`, which is STOP 2), `sourceCitationIntegrity`'s archival arm (cured by this record's roster step).
- `observedShapeReaders.walker` 5: 2 at the base, and +3 on the same broken baseline. This lane's moved reads (the grouping reads retired) cannot be banked until STOP 2 is cured.

**The lane's other suites:** 253 test files import the files this lane changed. At the tip, 31 of them went red. Every red that is this lane's was re-keyed (§1). The 13 left are red at the base itself: `dossierPhoneFloorAllViews` 2, `phoneChromeFloor.census` 1, `repeatOnceTonightTraditions` 1, `plotHooks.test` 2 (lane 2's crisis party), `worldFactRederive`, `generationForkCensus` A1, `nameHeldThroughAssembly`, `pipelinePinnedChoosers`, `rosterFinalUnderHeldRoster`, `heldKeyWriterCensus`, `writerReach.walker`, `goldenViewModel`, `mundaneRealmAcceptance`. `generationForkCensus` A3e was red under the loaded parallel run and passes alone (85.8 s of its work). That is a timeout under load, not a cost this lane added: the dedup's removal draws nothing.

## 5. FPZ's, broken by design at birth (M-6)

Nothing under `worldPulse/`, `events/`, `factionLifecycle.js`, `densityAscension.js` or the store's advance loop was touched.
- The dedup's deletion and the neighbour summary's new `powerStructure` key reach no FPZ file.
- `corruptionPass` no longer writes `secondaryAffiliation`. FPZ's `causeLifecycle.js:172` (any membership, rank 2) and `npcVerdictApply.js` read the field. They now see the shim's rank-2 power where a corrupt card used to carry a criminal house name. The house is on `corruptTies.criminalInstitution`.

## 6. What the writing wave must author (M-4)

Nothing new. The surfaces print names, ranks and titles; no pool is drawn.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED:
- Every site in §1, by the walker's syntax-tree pass before and after.
- The surfaces' proofs (no throws; every line names a power that exists; the groups; the counts) over soak 300 and the golden 525, re-runnable with `prove.mjs`.
- Each red's attribution, by the same file run at the base worktree.
- STOP 2's broken baseline, by recomputed digests at three commits.
- The writer-reach and lighting doors' own exits.

PLAUSIBLE:
- That a hidden criminal house's FACE card should stay on a public share with only its house removed (the old roster had no per-house face). The veil now removes the reference, not the person; the chair may rule that the face goes with the house.
- That `prove.mjs`'s veil digest has the same meaning base → tip (the people car's keys are excluded from it).
- That `generationForkCensus` A3e is load-only (one green run alone).

## 8. The tip

`lane/people-5a-display-2026-11-07`, pushed with `--no-verify`. The tip is the commit that carries this record.
