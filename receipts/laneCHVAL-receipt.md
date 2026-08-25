# Lane TE-CHVAL — receipt

Object: charters/draft-CATALOG-HYGIENE-PLAN.md at preserve ref 029268fe579b2cbd64e9941b66e77639133f072e
Slot: claude/composite-r4 = e4ed27f48424eb2d016128ee1b16753e6b1ad53d (verified by rev-parse)
Scope (ODQ §620.2, pulled forward by §623): CH-3 sections + CH-2B + whole-document coherence pass. READ-ONLY.

## RESUME POINT (2026-08-25, checkpoint 1)

State so far (all CONFIRMED by execution):
- Plan extracted from preserve ref to scratchpad/chval/plan-at-preserve.md (86,536 B, 1,165 lines); read in full.
- Packet family mapped at slot: MF-CH1/2A/4/5/6/7 LANDED; MF-CH3 DRAFT (manifest entry present, paths reserved, base 86794b5d2); MF-CH2B packet FILE exists at DRAFT but has NO PACKET_MANIFEST.json entry (checked: no id containing CH2B; the three 2B ids are SK-2B, MF-T2B, MF-T2Bf).
- Commit 86794b5d2 subject says "MF-CH2B LANDED" but its diff vs 79b78881c carries ONLY the packet .md + AIP-1 files — NO CH-2B production code. Verified at slot: generationContext.js:132-138 still unanchored ARCANE_INST_KW scan; magicFilter.js:37 still shelf test; institutionProbability.js still has hiMagicInsts (:176) + NON_MAGIC_EXOTICS (:187); tests/lint/magicShelfGateCensus.walker.test.js ABSENT. CH-2B section = still un-executed. CH-3 code IS merged (commits 308c7ee0d..da2c7085c in first-parent history; catalogTierGateParity.walker.test.js EXISTS at slot) but packet is DRAFT pending landing act.
- MF-CH2B's §0.0 STOP (three-row licence/tag conflict via ARCANE_INST_TAGS) may be decayed: MF-CH5 (SHAPE F, ODQ §541: "alchemy is a trade — leaves the magic-dependence list") and MF-CH6 ("faith leaves the magic-dependence vocabulary") landed AFTER CH2B's base b2852ccc3. TO VERIFY at slot.
- Both packet bases (b2852ccc3, 86794b5d2) are ancestors of the slot.

## NEXT

1. Build instrument tree: git archive slot src/ into scratchpad; plain-node imports of institutionalCatalog/cohesionWeave/arcaneInstitutionVocabulary/magicForms.
2. INST-A catalog census (minTier 36/26/10, the ten rows, exclusiveGroup 7, facets carriers, licence census, tags).
3. INST-B source-line re-derivation for every §3.x and §2(b) home.
4. INST-C behavior probes (ARCANE_INST_KW strike count 26 vs 28, classifyMagicForm conflict at slot).
5. Verdict table + coherence pass. Deliverables in scratchpad/chval/.

Deliverable-in-progress: none yet beyond extracted sources.

## RESUME POINT (checkpoint 2)

Instruments built and green in scratchpad/chval/ (run from chval/, imports ./tree/... which is `git archive` of slot + its own `npm ci` node_modules, 468 entries, legacy-peer-deps from slot .npmrc):
- inst-a-catalog-census.mjs — 311 rows; minTier 10/0/10/0 (26 redundant DELETED by merged CH-3); the TEN match plan table exactly; religiousCenter 7 carriers, city pair now exclusiveGroupCoexists:TRUE; facets carriers 5 (3 two-key UN rows + 2 one-key §3.6 rows); licence 28 carriers but NINE none (Druid Circle + Elder Grove Council moved post-CH2B-packet); priorityCategory five rows cured; Kidnapping desc rewritten (provenance preserved); tanner homes rewritten; Eberron 0. Controls fired.
- inst-b-source-scan.mjs — P1 :88 / P2 :176 (11 members incl 3 dead) / P3 :187 / P5 :132-138 ALL still unrouted at slot; magicFilter.js:37 shelf test intact, no licence read; P4 licence-routed via landed CH-2A (identity :215-236); coexist branch :336-349 with fork label; minTier read exactly ONCE (:256, probabilistic loop only) — C1 refutation's static half confirmed; CATEGORY_AFFINITY honest (economy→merchant.., criminal→criminal..); five tanner homes all in honest register; lookups reader fix live (institutionAvailableAtTier :67, getInstitutionalCatalog :142 — INST-B's fn-regex missed the const arrow form, corrected by follow-up).
- WORLD-LAW CALL-SITE CENSUS: FIVE allowsInstitution sites in assembleInstitutions at the charter's OWN base f1e4d515 (268/410/484/546/667) — plan named only three. Plus cascadeGenerator:180.
- inst-c-behavior.mjs — isArcane licence-routed (all none rows false, Healer true, 3 fallback controls right); LADDER_CONFLICTS 0 (CH2B §0.0 STOP cured at slot by CH-5/CH-6); world law strikes 35 in bare dead config = 28 Magic/Exotic + 7 other-law (maritime/content-profile); KW-arm-only 23 (was 26 at charter base; CH-6 trimmed faith keywords); reader fix live (city leaks 0, metro 9, 'all' 9).
- inst-d-corpus.mjs — REAL PIPELINE, 2,520 dead-magic settlements, 0 errors: Magic/Exotic-shelf instances 0; hall 94; Underground city 126; Alchemist shop/quarter, Great library, Dragon resident, Warden's Lodge, Druid Circle, Elder Grove 0. Control: default magic 33 Magic/Exotic instances in 20 settlements.
- inst-d2-hall-attribution.mjs — ALL dead-magic hall instances are town|Adventuring; UI dead-magic SHOWS town hall, hides hamlet/village Magic rows; world law refuses hamlet/village rows, allows town row. ⇒ H16/G4 "one measured generation-versus-UI divergence" REFUTED at slot — both surfaces AGREE at every hall tier; the surviving instances are the un-stripped Adventuring row.

## NEXT
- Diff magicFilter/generationContext/institutionProbability f1e4d515..slot (does the H16 refutation reach back to the charter base).
- Metropolis/city coexistence spot-check (C4/C5 corroboration) at default magic.
- ODQ §501.4/§503/§505/§507.3/§538.5/§541 ruling trail; INDEX.md rows MF-CH2B/MF-CH3; DESIGN_REALM_MAGIC_TOGGLE:514-519 at slot; DW-0 compile §B; metropolisCatalogReachable amended header.
- Serial-mint collision: MF-CH3 (DRAFT, manifest) reserves golden fixture + golden test + mutation manifest — MF-CH2B (no manifest entry) also needs those ⇒ CH-2B can only mint AFTER MF-CH3 lands. Plan §4.1 order (CH-2b before CH-3) INVERTED in execution.
- Then verdict tables into scratchpad/chval/ + final report.

## LANE COMPLETE (final checkpoint)

Deliverable: scratchpad/chval/laneCHVAL-verdicts.md — full verdict tables (CH-3 §§3.1-3.8; CH-2B §2(b)/(c)/(e)+stub), MF-CH2B packet coherence (STOP resolved by §541/CH-5+CH-6, manifest absence chair-directed §520.5, serial-mint after MF-CH3, EVERY packet figure stale at slot), corrected dispatch figures, the named cannot-verify list, whole-doc coherence, and the discharge recommendation (JUDGMENT: discharge to dated FABLE-VALIDATED with the REVERSED/DECAYED rows named; MF-CH2B's own marker NOT discharged).

Headline finds beyond the brief's known corrections:
1. H16/G4 REVERSED by real-pipeline execution (2,520 dead settlements): all surviving halls are town/Adventuring; UI and world law AGREE at every hall tier; gate files byte-identical to charter base so the refutation reaches back to f1e4d515. Converges independently with ODQ §520.4.
2. The plan's world-law call-site census was wrong at its own base: FIVE allowsInstitution sites in assembleInstitutions at f1e4d515, not three.
3. ⛔ The CH-2B build tree exists ONLY as dangling commits (zero refs): tip 2ccb20d598c93a263f9bd48a9c86a92264d1a81e (four CH2B commits atop pre-landing CH2A, merge-base b2852ccc3, licence reads present in all three gate files). Chair should pin before any gc. Found by sweeping all 481 dangling commits for the walker file.
4. Licence census at slot: NINE none rows (8 names) — MF-CH2B's A7 re-point figure (seven) is stale; ARCANE_INST_KW now 23 catalog hits (was 26).

Instruments (re-runnable, scratchpad/chval/): inst-a-catalog-census.mjs · inst-b-source-scan.mjs · inst-c-behavior.mjs · inst-d-corpus.mjs · inst-d2-hall-attribution.mjs · inst-e-coexistence.mjs, against tree/ = git archive of slot + own npm ci (468 entries). All controls fired. No repo writes, no refs, no gates, no memory writes; preserve ref untouched.
