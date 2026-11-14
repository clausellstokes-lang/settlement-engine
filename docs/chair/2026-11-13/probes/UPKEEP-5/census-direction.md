# Census: which way defence flows (read-only, tree at 70c6ef6c6)

Paths are relative to the lane worktree. Nothing in the repo was edited.

**Verdict: no loop.** No writer of any defence input reads `defenseProfile`, or anything computed from it, when the profile is written at birth. Defence has one computing writer, `assembleSettlement.js:233`. After it there is no recompute. There are only (a) one write that keeps the snapshot in step, from the world pulse, and (b) two rename passes that rewrite label strings inside it (Q4). Over the life of a saved town some readers of defence do drive simulation that later changes defence inputs, but nothing feeds that back into `defenseProfile`, so the stored profile goes stale instead of looping.

---

## Q1. Readers of `defenseProfile`

### 1a. Readers whose output feeds generation (at birth, all are downstream of `assembleSettlement.js:233`)

| Reader (file:line) | Reads | Computes | Is it an input of defence? |
|---|---|---|---|
| `generators/steps/assembleSettlement.js:244-249` -> `power/economyReconciliation.js:196-208` -> `power/rulingStructure.js:728-733` -> `factionDynamics.js:128-145` | `readiness.label` | `computePublicLegitimacy`: `dContrib = DEFENSE_CONTRIB[defenseLabel] * defScale` (factionDynamics.js:145). That drives `applyLegitimacyMultipliers`, which sets faction power, and `factionRelationships` (rulingStructure.js:737-753). Writes `powerStructure.{factions,publicLegitimacy,...}` only (economyReconciliation.js:328-334). | **No.** Defence reads no power fact. Before this point rulingStructure uses a *provisional* label built from institution names (`_provDefLabel`, rulingStructure.js:701-726), not the profile. |
| `domain/conditionPromotion.js:112-116` (called at assembleSettlement.js:463) | `scores.{military,internal,economic}` avg | Severity modifier of ±0.10 for generated `activeConditions` | **No.** Defence reads `settlement.stress`, not `activeConditions`. |
| `domain/coherence/hookTruth.js:163-165` (via `storeTrueHooksOnly` at assembleSettlement.js:391 and `people/personHooks.js:22`) | presence of `defenseProfile.institutions` only (`defenseKnown`) | Drops hooks that are false. Live forces come from `defenseFactsOf(institutions)`. | **No.** It writes only hooks. Its `economicState` copy changes only `safetyProfile.plotHooks` (hookTruthRecord.js:57-61). |
| `generators/generationCoherence.js:113` | whole profile | Stored `generationCoherenceReceipt` | No (it is a receipt) |
| `generators/aiLayer.js:82` | whole profile | AI-overlay prompt context | No (prose) |
| `lib/structuralFingerprint.js:264-270` | scores and readiness label | Fingerprint used by regeneration delta and telemetry | No |
| `lib/spatialSubstrateDerive.js:59` | `defenseProfile != null` | Map cache key (`w1`). It flags existence, not walls. | No |
| `store/settlementGenerateAction.js:891` | `readiness.label` | Telemetry | No |

The mentions at `steps/resolveConfig.js:321` and `steps/generateNarratives.js:118` are only `downstreamEffects` trace strings (`{ target: 'defenseProfile', ... }`). They are not reads.

### 1b. Readers used by simulation and derived state (saved towns, never at birth)

| Reader | Reads | Feeds |
|---|---|---|
| `domain/defenseLedger.js:58-69` (the conserved accessor) | scores, `readiness.score`, magicDependency | causalState, capacityModel, militaryStrength, armyTransitKernel |
| `domain/causalState.js:634-640` publicLegitimacy | `readinessScore < 40` (only when `monsterThreat==='plagued'`) | -6 to public_legitimacy |
| `causalState.js:912-918` lawOrder | `scores.internal` | `(internal-50)*0.4` |
| `causalState.js:1059-1073` defense_readiness | `readiness.score`, walls (`defenseProfileHasWalls`, :384) | `(score-50)*0.6`, plus 6 for walls |
| `causalState.js:1239-1245` infrastructure | `(military+economic)/2` | `(x-50)*0.6` |
| `domain/capacityModel.js:442-446` | `scores.military` | supply term |
| `worldPulse/militaryStrength.js:192-197` | `scores.military` | institutions strength `led.military*0.7` (war layer) |
| `worldPulse/armyTransitKernel.js:290,309` | `scores.military` | observed and own strength |
| `worldPulse/stressorGates.js:368` | `magicDependency === true` | magic-dependence stressor signal |
| `worldPulse/foodStockpile.js:402-403` | `scores.disaster`, `economicGates.disaster` | writes back `scores.disaster` (see Q4) |
| `domain/threatProfile.js:387-428` | scores, `threats` | threat rows (qualitativeBands, capacityModel, mapProfile, dailyLife, aiGrounding) |
| `mapProfile.js:180`, `townMap/townMapModel.js:372`, `townMap/townLayoutV2.js:263`, `undercity/colonization.js:388`, `undercity/monotoneComponents.js:435` | walls through `defenseProfileHasWalls` | Map, layout and undercity geometry |
| `hookEscalation.js:76`, `simulationSpine.js:544`, `townScene/sceneLiving.js:228` | `plotHooks`, `threats` | **Dead reads.** The generator never writes these fields (defenseGenerator.js:670-687 return shape). |

`deriveCausalState` is imported by `events/eventPipeline.js`, `worldPulse/worldSnapshot.js`, espionage and `region/deriveRegionalState.js`. These are simulation-time consumers. None of them calls `generateDefenseProfile`.

### 1c. Display-only readers (prose, components, PDF, editor metadata)

- **Components:** `components/new/tabs/DefenseTab.jsx:179-182,262-268` (stored `scores`, `readiness`, `institutions`, `economicGates`), `OverviewTab.jsx:184,391`, `SummaryTab.jsx:133,154,233`, `dailyLifeLogic.js:47,148,197`, `generalDeskRead.js:237,250`, and `dossier/EngineSections.jsx:156-159`. EngineSections shows live causal `defense_readiness` next to the frozen scores.
- **Display domain:** `display/defenseDisplay.js:299,488-489,533,548`, `threatAssessment.js:71,107`, `institutionProfile.js:175`, `stateProse/defenseStateProse.js:691,741,748`, `stateProse/generalStateProse.js:280-282`, `dossierViewModel.js:747-751`. The last one is a view-only overlay that replaces `magicDependency` with the live reliance reading. It does not store anything.
- **PDF:** `pdf/lib/viewModel.js:216,248,274,324`, `viewModelBodySlices.js:133,169,181`, `pdf/lib/headlines.js:243,266`.
- **Editor metadata:** `edit/recordInvariants.js:91-94` and `recordInvariantMeta.js:68-92` validate it. `edit/recordRegister.js:28` marks it `READING`, and `publicSafe.js:61` handles the veil.

Imports that only reach a defence reader statically: `facts/factsOf.js:34` imports `deriveCriminalStructure` from defenseDisplay.js, which reads institution names only (defenseDisplay.js:190-196). Through `facts/warState.js` -> `display/warStatus.js` -> `worldPulse/warFrontReads.js` -> `region/graph.js`, the import closure also contains causalState and defenseLedger. The functions actually called (`isLiveWarFront`, `settlementWarStatus`) read graph channels only. Measured with an import-closure scan over every step up to economyReconcilePass, plus priorityHelpers, magicReliance and prosperity (219 files). The only defence-mentioning files in that closure are those four modules and the trace string in resolveConfig.js:321. None of them is reached through a call that reads the profile.

---

## Q2. One direction: who writes each defence input

| Input (read at) | Writer (file::export) | Reads defence? |
|---|---|---|
| `settlement.institutions` (defenseGenerator.js:567) | `steps/assembleInstitutions`, then `subsumptionPass`, `cascadePass`, `isolationPass`, `factionCorrelationPass`, `coherenceRepairPass` (mutates `institutions`). Placed at assembleSettlement.js:~145 as `fishTradeTwinned(institutions, economicState)`. | No |
| `getInstFlags(config, institutions)` (:573) | `priorityHelpers.js::getInstFlags` (:286) | No. Reads config and names. It uses `defenseFactsOf({institutions})`, the live roster, not the snapshot (defenseFacts.js:12). |
| config dials and `getPriorities` (:584-587, :665-667) | `resolveConfig`, `resolveResources`, `resolveStress`, `resolveNeighbour`, `isolationPass`, `stressConfirmPass`, `generateEconomy`, `coherenceRepairPass` (mutate `effectiveConfig`). Copied as `config: {...effectiveConfig}` in the assembleSettlement literal. | No |
| `settlement.stress` types (:568-570) | `resolveStress`, `isolationPass`, `stressConfirmPass` (`provides: stress`) | No |
| `economicState.foodSecurity` (:575) | `foodGenerator.js::generateFoodSecurity`, called at `economy/economicState.js:839-841` (kept months) | No |
| `economicState.activeChains` (:596) | `computeActiveChains.js::computeActiveChains` (economicState.js:699) | No |
| `economicState.prosperity` (keepOf at :233) | `economy/prosperity.js::computeBaseProsperity` (:230) then `deriveProsperityLabel` (:176), called at economicState.js:823-832 | No (details below) |
| `computeEffectiveMagicPresence` (:349) | priorityHelpers.js:114 | No. Reads institutions, `priorityMagic`, `magicExists`, `nearbyResources`. |
| `deriveMagicReliance(settlement)` (:576) | `domain/magicReliance.js:184`. Reads `magicLedger(config)`, live arcane institutions, NPC role, title and status, and `activeChains`. | No |
| `resolveGenerationWorldLaw` (:88) | `generationContext.js:491`. Built from config. | No |

**Prosperity in detail.** `computeBaseProsperity` reads `tier`, `tradeRoute`, `institutions`, `config.{priorityEconomy,priorityMagic,magicExists,monsterThreat,priorityMilitary,stressTypes}`, `incomeNormalized` (length only), and `foodSecurity` (`prosperityMod`).
- **`_milDrain`** (prosperity.js:268) reads **only the slider**: `_priMil > 75 ? -0.3 : 0`. It does not check for a garrison.
- **`_defPremium`** (:269-275) reads institution names: `/wall|palisade|citadel/i` and `/garrison|barracks/i` through `institutionMatchesRegex`, AND requires a crossroads or port route, for +0.3.

Both read the raw institution roster, not `defenseProfile`. `deriveProsperityLabel` reads `getInstFlags(...).economyOutput` and `criminalEffective`, and `config.stressTypes`, `tier` and `tradeRouteAccess`. It draws `_rng()` for Subsistence (prosperity.js:184). `situationDescOf` (:85) uses getInstFlags too. No defence fact appears anywhere in this chain.

**Loops:** none. The single generation reader of defence, the legitimacy and power reconcile, writes only `powerStructure`, and defence reads nothing from `powerStructure`.

---

## Q3. Order of writes in the birth pipeline

Order comes from `steps/index.js` and the `deps` lists.

1. `generateEconomy` (generateEconomy.js:487-494) **writes `economicState`**: prosperity, foodSecurity, activeChains (economicState.js:823-867).
2. `generatePower` (provisional economy) -> `neighbourFactions` -> `factionCorrelationPass` (mutates institutions) -> `coherenceRepairPass` (mutates institutions and effectiveConfig).
3. `economyReconcilePass` (economyReconcilePass.js:145-160) **re-writes `economicState`** through `computeEconomyState` when `_rosterChangedAfterEconomy` is set. Otherwise it changes only the import and export lists.
4. `powerEconomyReconcilePass`, `structuralValidationPass`, `generatePopulation`, `generateNarratives`. None of these mutates institutions, economicState, stress or config.
5. `assembleSettlement` builds the record literal, then **writes `defenseProfile` at :233**.

**After :233** (assembleSettlement.js unless noted):

| Step | What it writes | Changes a defence input? |
|---|---|---|
| :244-249 reconcilePowerStructure | powerStructure | no |
| :270-285 resizePoliticalRoster | powerStructure | no |
| :295-299 settleCrimeLinesToSignal | new `economicState` object, but only `safetyProfile.crimeTypes[].desc` (safetyProfile.js:805) | no (prosperity, foodSecurity and activeChains are the same references) |
| :303-308 generateCoherence | npcs, relationships, history, notes (narrativeGenerator.js:1091-1103) | no |
| :331-357 ensureFactionStructuralNpcs, late ties | npcs, relationships | no |
| :374-380 conflicts | conflicts, `powerStructure.conflicts` | no |
| :391 storeTrueHooksOnly | hooks. May copy `economicState` with only `safetyProfile.plotHooks` changed. | no |
| :398 truePersonHooks; :400 resolveFactionLabelsAtClose -> `factionRename.js:945-950` | npcs. Faction renames also rewrite `institutions[].factionSource` **and `defenseProfile.institutions.*[].factionSource`** | no (factionSource is not a defence input) |
| :463 normalize, promoteStressorsToConditions, reapplyEventConditions | stamps, id, activeConditions | no |
| `steps/resolveCrisisCast.js:117-127` (deps: assembleSettlement) | `stress` and `stressors` become **new copies with `cast`** (types unchanged). It may append one temporary NPC (Healer, Grain Steward or Warden). | no. Defence reads only the stress `type`s. NPCs reach defence only through `deriveMagicReliance`, and defence uses only `relied-upon \|\| integral`, which is `dependents.length > 0`. Practitioner count cannot flip it (magicReliance.js:194-198). |
| generateSettlementPipeline.js:147-185 | `_seed`, `customContentProvenance`, `customContentRoster` | no |
| store: `reconcileSettlementChange` (settlementReconciliation.js:31-65) and `activateFaithIfEntitled` -> `latentPantheon.js:97-107` | activeConditions, parentRef, log; `config.primaryDeityRef/Snapshot`, `cultDeitySnapshots` | no. Defence reads none of these config keys. |

So at birth, recomputing from the stored record should reproduce the stored profile. Two notes: `config.stressTypes` (read by getInstFlags) and `settlement.stress` (read by defence's own `stressTypes`) are separate fields. And recomputing must pass `keepOf(economicState.prosperity)` as the upkeep argument.

---

## Q4. Saved towns

**Every place in `src/` that writes into `defenseProfile`:**
1. `generators/steps/assembleSettlement.js:233`. This is the only computing writer and the only caller of `generateDefenseProfile`, as `defenseInstitutionBuckets.js:37-40` also says.
2. `domain/worldPulse/foodStockpile.js:473-480` rewrites **only `scores.disaster`** as `round(resilience × economicGates.disaster)` on a world-pulse tick. In the same tick it rewrites `foodSecurity.storageMonths` and `resilienceScore` (:405-470). Those are defence inputs, but `scores.economic` (from storageMonths, defenseGenerator.js:304-325) and `readiness` are **not** updated. This is real drift.
3. `domain/factionRename.js:945-950` rewrites the `factionSource` strings, and `domain/institutionRename.js:163-165` rewrites or drops `defenseProfile.institutions.*[].name`. Both only relabel.
4. `display/dossierViewModel.js:745-752` builds a view copy with `magicDependency` overridden. It is not stored.

**Loading a save:** `store/settlementSlice.js:1496-1500` `hydrateFromSave` stores `save.settlement` as it is, after faith activation. No migration, normalize or hydrate path mentions `defenseProfile`; `settlementMigrations.js` does not touch it. **The stored profile is read unchanged.** `DefenseTab.jsx:179-182` reads stored scores, readiness, institutions and economicGates, and `causalState` reads it through `defenseLedger.js:58-69`.

**Edit and regenerate:** a regeneration or `rederive` (`store/settlementRederiveAction.js:87`, `domain/edit/dmLayer.js:911`) reruns the pipeline, so the profile is computed fresh at :233. `edit/mergeConsequence.js:305` / `recordMergeTree.js` treats `defenseProfile` as `READING` ("merged three-way, never recomputed", recordRegister.js:25-28). It takes R1's value only where R0 and R1 differ; otherwise the record keeps its value.

**Drift in saved towns:** events and the world pulse change institutions (for example `institutionLifecycle.js`, `calamityKernel.js`), stress, foodSecurity, prosperity and chains. `defenseProfile` stays frozen. The snapshot is known to be stale (defenseInstitutionBuckets.js:38, hookTruth.js:124, defenseFacts.js:12), which is why live readers use `defenseFactsOf(institutions)` for forces. Feedback over time: militaryStrength (scores.military) drives war, which writes stress and institution ruin, which are defence inputs. Since defence is never recomputed, this does not close into a computational loop.

---

## Q5. getInstFlags (priorityHelpers.js)

- `getPriorities` (:18-24): the `priority{Economy,Military,Religion,Magic,Criminal}` sliders, default 50.
- `inst` = `getInstitutionNames` (:45-90): name keyword flags. It takes `hasMercenary`, `hasGates`, `hasPrison`, `hasCourtSystem` and `hasHospital` from `defenseFactsOf({institutions})`, the live roster, and `hasMarket` from `hasMarketInstitution`.
- Shared modifiers: `threatMult` from `config.monsterThreat` (:291-292). Stresses come from **`config.stressTypes` or `config.stressType`** (:295-298), not `settlement.stress`. The stress-multiplier tables are at :302 (economy), :317 (crime), :332 (military) and :345 (religion). The neighbour type comes from `config.neighborRelationship.relationshipType` (:382).
- **criminalEffective** (:357-371): criminal slider × military suppression × economy × religion suppression × (`hasCriminalInst ? 1 : 0.55`) × crimeStressMult, minimum 2.
- **militaryEffective** (:375-399): military slider × garrisonBase (`hasGarrison` and the economy slider) × crime degradation (criminalEffective) × (`hasMilitaryInst ? 1 : 0.4`) × threatMult × militaryStressMult × neighbour multiplier.
- **economyOutput** (:402-419): economy slider × crime degradation × magic boost (magic slider) × (`hasMarket ? 1 : 0.75`) × economyStressMult × neighbour multiplier.
- **religionInfluence** (:422-433): religion slider × crime degradation × economy modifier × (`hasChurch ? 1 : 0.5`) × religionStressMult.
- **magicInfluence** (:437-443): `computeEffectiveMagicPresence(institutions, config).score` × economy base (economy slider) × crime degradation.

**Randomness:** none. The only import is `clamp`, plus the two fact leaves at :7. `computeEffectiveMagicPresence` (:114-197) is also draw-free: slider×0.55 + institution weights (capped at 40) + resource bonus, capped at `slider+30`. `getStressFlags` (:518+) uses a deterministic hash mod 97, not an RNG. `keepOf` and `fundedGate` are pure (keep.js:29). The only draw anywhere in defence's upstream chain is `deriveProsperityLabel`'s `_rng()` for Subsistence (prosperity.js:184), and it runs at the economy step.
