# R2 · IMPORT MEASURE: what the importer's app does when the withhold-always fields are missing (VR16 condition (2))

Tree under test: `/var/tmp/v18/base` (bedd5a392). Read-only seat. No tracked file was changed. No database was used.
Every run was prefixed with the chair's `env -u GIT_*` strip. `git config core.bare` read `false` and no "Fixture" user
appeared.

## Verdict

**Some withheld fields are NOT recomputed and do not fall back cleanly. They are listed below (outcome (c)).**

Nothing threw. No `NaN` appeared, and no `undefined` or `null` string, when the fields were withheld the way the census
rows name them (B arm, 24/24 towns, 19 readers). The (c) fields are WRONG VALUES. Either the importer's own pages draw a
false or wrong-band sentence or figure, or a campaign kernel computes from a substitute number.

**The (c) list:**
1. `activeConditions[].severity`
2. `defenseProfile.readiness.score`
3. `economicState.compound.{criminalEffective, magicInfluence, religionInfluence, militaryEffective}`
4. `economicState.compound.raw` together with `compound.militaryEffective` (guard on paper)
5. `economicState.safetyProfile.compound` (the `.criminalEffective` leaf)
6. `economicState.safetyProfile.safetyRatio`
7. `economicState.foodSecurity.storageMonths` (direct kernel readers only)
8. `powerStructure.publicLegitimacy.breakdown.{prosperity, safety}`
9. `spatialLayout.quarters`
10. `stressors.cast.roles[].{role, reason}`

There are also two CONDITIONAL (c) cases, which apply only if a leaf is withheld while its array row stays:
`stressors.cast.stakes[].stake` and `stress.cast.stakes[].reason`.

## Method

**What the import does (read).** `src/store/galleryImportSettlement.js :: importGallerySettlementImpl`:
1. `fetchDossierForImport`, then the RPC `import_gallery_dossier`, then `stripImportConfidential` and `veilPublicPayload`.
2. `normalizeSettlement`, then `scrubImportedTreasury`, `scrubGalleryImportLivingContent` and `scrubImportedEditState`.
   It also strips `_seed`, cross-town references and `config`.
3. `saves.save(entry)`.

At the save, `src/lib/saves.js :: publicProseForRow` recomposes `data.publicProse = composePublicProse(settlement)`.
The in-memory `savedSettlements` push keeps the unrecomposed record. None of these steps recomputes any economic,
legitimacy, history, cast or spatial field.

**Executed.** The probe is `import.probe.jsx`, run with vitest and `vitest.config.mjs` (`RV6_SRC=/var/tmp/v18/base`).

- **Towns:** 24 births by the tree's own pipeline: thorp to metropolis, 5 calm and 19 under a forced crisis (dials
  random). All 24 were born.
- **The import path:** each town was composed and JSON'd, then run through the tree's own `galleryPayloadFor` (default
  share). The supabase `rpc` was mocked to answer that payload to the tree's own `fetchDossierForImport`. The tree's own
  `importGallerySettlementImpl` then ran, with `saves.save` mocked only to capture the entry. The probe then applied the
  save's recompose (`composePublicProse` plus `withPublicProse`) and a JSON round trip.
- **Arms:**
  - A: the import as today.
  - B: every withheld path deleted from the payload the RPC answers.
  - F: one field deleted at a time, for attribution (80 paths × 24 towns).
- **Readers on the importer's side** (each compared A against B and A against F; throws, NaN, and new
  `undefined`/`null`/`NaN` strings recorded):
  - `composePublicProse` (the save's recompose; the same desk functions the owner tabs call)
  - `pdf/lib/viewModel.js :: buildViewModel` (the raw-record copies are excluded from the diff)
  - `pdf/lib/viewModelBodySlices.js :: normalizeIncomeSources`
  - `foundry/journalPages.js :: buildJournalPages`
  - `domain/crisis/crisisPage.js :: composeCrisisPage`
  - `domain/summary/tonightSheet.js :: composeTonightSheet`
  - `components/new/dailyLifeLogic.js :: extractSettlementContext`
  - `threatAssessment :: buildThreatAssessment`
  - `defenseDisplay.*` (seven derivations)
  - `corruption.js :: readCorruptionClimate`
  - `undercity/colonization.js :: deriveUndercity`
  - `worldPulse/factionDensityKernel.js :: densityCandidatePowersFrom`
  - `espionage/espionageMath.js :: covertCompetence01` and `operativeNotoriety01`
  - `districtProfile.js :: deriveAllDistricts`
  - `townMap/townLayoutV2.js :: buildTownLayoutV2`
  - `townMap/townMapModel.js :: buildTownMapModel`
  - `causalViews.js :: deriveCausalView` (all views)
  - `explanation.js :: entityCatalog`
  - `spatialSubstrateDerive.js :: substrateSignatureOf`
  - `facts/storesMonths.js :: storesMonthsOf`
  - `foodLedger`
  - `defenseLedger`
  - `worldPulse/treatyTransfer.js :: computeTreatyGrainDraw`
- **Rendered:** the real `OutputContainer` as the OWNER, walked by `tests/components/pageCensusWalk.shared.mjs ::
  walkDossier` (every group, sub-tab and disclosure).
  - A against B: 8 towns (`render-summary.txt`).
  - A against each of 17 field groups: 6 towns (`render-groups.txt`).

**Read only (not executed).**
- The pulse callers of `readCorruptionClimate`: factionCapture, npcAgency, religionLegitimacy and corruptionImpair.
- `generosityKernel`, `demographicsPushPull`, `conquestDoctrineStage` and `warCosts` (on `storageMonths`).
- `foodStockpile`'s writer.
- `crisisCast` stakes (generation-only).
- `historyData :: legitimacyHeldTensions` (generation-only).
- `timeProgression`'s legitimacy flags (rewritten on a tick).
- `mergeConsequence :: recomputeReceipts` (fingerprint).
- `DailyLifeTab`'s order line. The walk did not reach this line. `ctx.safetyScore` was executed.
- The PDF sections `DefenseSecurity` and `Overview` (on `safetyRatio`).
- `aiLayer`/`aiGrounding` (AI prompt only).

**Measured set (80 paths).**
- The 77 "drawn, non-owner = no" rows of VR7-MEASURE M3: `fields77.txt`, extracted from the table, including the 23
  `publicProse` rows.
- Plus `economicState.compound.raw`, `economicState.safetyProfile.compound` (the whole object, i.e. `.*`) and
  `economicState.safetyProfile.safetyRatio`.
- The other VR14 (i) names were already in the 77: `compound.criminalEffective`, `compound.criminalPreStress`,
  `compound.militaryEffective`, `incomeSources[].weight` and `spatialLayout.quarters`.
- Every one of the 80 is present in today's served import payload (counts in `raw-full3.json :: presence`; 8 to 24 of
  24 towns).
- How paths were deleted:
  - An array row (`x[]`) deletes the whole array.
  - A leaf under an array (`x[].y`) deletes `y` in every element and keeps the element.

## Outcome per field

Notation: n/24 = the towns where the reader's output changed (F arm, one field withheld). "R k/6" = the rendered owner
page changed in k of 6 towns.

### (c): break or wrong value

| field | importer-side reader (`path :: symbol`) | evidence |
|---|---|---|
| `activeConditions[].severity` | `domain/activeConditions.js :: deriveActiveCondition` (absent → the archetype template's `defaultSeverity`, else 0.25); every desk, the causal substrate and the map read it through this | Wrong band: the conditions sentence changes from "The thorp is at its limit…" (critical) to the "high" sentence (6/24). Causal substrate scores move (17/24). Town-layout output changes (8/24). Campaign severity dynamics would start from the default (read) |
| `defenseProfile.readiness.score` | `domain/defenseLedger.js :: defenseLedger` (absent → 50); `causalState.js` `defense_readiness`; `defenseStateProse :: posturePoolKey` (absent → null) | Foundations tab "Defense readiness **Critical**" → "**Adequate**" (R 2/6); causal `defense_readiness` 25 critical → 50 adequate (24/24); the Defense posture line is silent (R 5/6) |
| `economicState.compound.{criminalEffective, magicInfluence, religionInfluence, militaryEffective}` | `worldPulse/factionDensityKernel.js :: densityCandidatePowersFrom` (`num(compound[field], 50)`) | Candidate power `influence01` becomes 0.5 instead of the town's own value: 0.945 → 0.5 and 0.126 → 0.5 (10, 10, 15 and 4 of 24). A later density step differs |
| `economicState.compound.raw` + `.militaryEffective` | `stateProse/postureLineDisqualifiers.js :: guardOnPaper` (absent → false) | A posture line the town's facts strike comes back: "Danger has come to Ardleigh, and the city meets it strongly defended" on a guard-on-paper town (1/24, the live Defense desk). The `dailyLifeLogic` `militaryScore` moves 9 → 28 (23/24); no tab consumes it |
| `economicState.safetyProfile.compound` (`.criminalEffective`) | `corruption.js :: readCorruptionClimate` (falls back to `blackMarketCapture/80`); its consumers `undercity/colonization.js :: deriveUndercity`, `espionageMath :: covertCompetence01`, and the pulse kernels corruptionImpair, factionCapture, npcAgency and religionLegitimacy (read) | `climate.crime` 0.298 → 0.05 (24/24); undercity `colonizationShare` 0.139 → 0.04 (24/24); covert competence 0.340 → 0.308 (24/24). The leaves `.magicInfluence` and `.religionInfluence` also silence the Economics income-weight sentence (see (b)) |
| `economicState.safetyProfile.safetyRatio` | `readCorruptionClimate` (absent → 1); `dailyLifeLogic :: extractSettlementContext` (absent → 1.0) | `security` 0.12 → 0.40 (24/24), feeding the onset, capture and exposure kernels; daily-life `safetyScore` 8 → 50 (22/24), which chooses DailyLifeTab's order line band (read; not reached by the walk). PDF: "Watch to population" prints "–" and the Overview enforcement line is omitted (b) |
| `economicState.foodSecurity.storageMonths` | (a) for the one reader `facts/storesMonths.js :: storesMonthsOf`, which falls back to `foodRecord.storageMonths` (`foodLedger`: 0 diffs). (c) for the direct readers: `treatyTransfer :: computeTreatyGrainDraw` (absent → null), `generosityKernel :: storageMonthsOf` (→ 0), `demographicsPushPull` (→ 0), `conquestDoctrineStage` (→ 'unknown') | A treaty grain draw of 1.2 months becomes NO draw (13/24, executed). The others were read. `foodStockpile`'s tick writes both homes again, so the gap lasts until that writer runs (read) |
| `powerStructure.publicLegitimacy.breakdown.{prosperity, safety}` | `display/governanceAccount.js :: legitimacyCausesOf` (absent → 0, filtered out); the Power desk; pdf `viewModel.js` `legitimacyBreakdown` | Wrong cause words on the importer's Power tab (R 6/6): "**Poverty and insecurity** have cost the Elder Council its standing" → "**Weak defences** have cost…". A false line: "Nothing at Plavipol is moving the city's view of its rulers: not the harvest, not the watch, not the walls." The importer's PDF breakdown loses the two rows, so its bars no longer account for the score (24/24). "Crime and the hall" disappears (b) |
| `spatialLayout.quarters` | `districtProfile.js :: deriveAllDistricts` (absent → []); `townLayoutV2 :: buildTownLayoutV2`; `townMapModel :: buildTownMapModel`; `causalViews`; `entityCatalog`; `spatialSubstrateDerive :: substrateSignatureOf`; pdf `identity.quarters` | The importer's town map (v1 and v2) replaces every real district with the synthetic hamlet floor: `district.religious_quarter` "Religious Quarter" becomes `district.hamlet-cluster` "Settlement Cluster" (22/24, cities and metropolises included). Districts leave the causal district view, the entity catalog and the PDF. The substrate signature changes (22/24) |
| `stressors.cast.roles[].role`, `.reason` (the leaves are withheld, the rows stay) | `crisis/crisisPage.js :: composeCrisisPage` (`roleLabel: CRISIS_ROLE_LABEL[undefined] \|\| undefined`); CrisisTab; `foundry/journalPages.js` crisis section | The Crisis tab draws "**: Umar al-Malik ·**", with no role and no reason (R 5/6; 18/24). The journal prints "- **: Name · ". Rendered A: "target: Umar al-Malik · holds the seat, and the right to it is already in dispute" |
| CONDITIONAL: `stressors.cast.stakes[].stake` (leaf withheld, row kept) | `journalPages.js` (`CRISIS_PAGE_COPY.stake[k.stake]`) | Journal: "- **Elder Council** undefined: its own people feel the crisis…" (21/21). Moot if `stakes[]` is withheld whole, as its census row says |
| CONDITIONAL: `stress.cast.stakes[].reason` (leaf withheld, row kept) | `crisis/crisisHooks.js`, through the pdf view model hooks, the journal and the tonight sheet | "…if it gives way, Merchant oligarchy loses most, because **undefined**." (10/24). Moot if `stakes[]` is withheld whole |

### (b): falls back to "not known" or silence (no false value)

| field | reader | how it falls back (evidence) |
|---|---|---|
| `activeConditions[].severityBand` | `deriveActiveCondition` recomputes the band from severity: (a) | 0 diffs. It becomes wrong only through `.severity` (above) |
| `economicState.compound.criminalPreStress`, `safetyProfile.compound.{criminalPreStress, economyOutput, militaryEffective}` | none on the importer's side | 0 diffs (24/24) |
| `safetyProfile.compound.{magicInfluence, religionInfluence}` | `economyStateProse.js :: incomeWeightPoolKey(eco.safetyProfile.compound)` | The Economics income-weight sentence is silent ("Faith carries real weight at Megaanthi…" is gone; 9/24 and 2/24; R 1/6) |
| `safetyProfile.flags.religiousFraud` | `warFaithStateProse` temple-fraud pool | The Faith line "Folk in Megaanthi pay for blessings and relics they half suspect are a fraud…" is gone (2/24, R 1/6) |
| `safetyProfile.flags.{anyActive, arcaneBlackMarket, merchantArmy}` | economy and power desk flag pools | 0 diffs in 24 towns (no town drew those pools) |
| `economicState.foodSecurity.storageNote`, `economicState.situationDesc` | `settlementQuickGuide.js:999` (situationDesc is used only when prosperity, food and exports are all absent) | 0 diffs |
| `economicState.incomeSources[].weight` | `normalizeIncomeSources` (spreads the row; reads `percentage`/`value`) | The only diff is the absent key itself; bars are unchanged |
| `history.eventsTimeline[].{anchored, year}`, `history.historicalEvents[].anchored` | general desk | 0 diffs |
| `history.legacyAnnotations[]` (and `.eventName`, `.yearsAgo`; `.eventType` and `.severity` show 0 diffs) | `generalStateProse :: legacyPoolKey`; `causalViews` timeline; `entityCatalog` | The History legacy lines vanish (R 6/6; 23/24), as do the causal "Institutional legacy" beat and catalog entries. Silent: nothing false is drawn |
| `powerStructure.economyInputFingerprint` | `edit/mergeConsequence.js :: recomputeReceipts` | Recomputed on the first merge: (a). 0 diffs |
| `powerStructure.factionRelationships[].ratio`, `.factions[].contestsNiche` | `roles/roleClass.js` (contestsNiche) | 0 diffs (present in 15 and 8 towns) |
| `powerStructure.factions[].rawPower` | pdf viewModel carries it; no section prints it | vm `rawPower` becomes null; nothing is drawn |
| `publicLegitimacy.crimMultiplier`, `.is{Approved, Contested, Endorsed, Tolerated}` | `crisisCast` and `historyData` (generation only); `timeProgression` rewrites them on a tick | 0 diffs; (a) at the first tick (read) |
| `publicLegitimacy.govMultiplier` | `composePublicProse` `power:desk.successionHold` | That block is no longer composed (24/24). No owner tab draws it (rendered 0/6) |
| `stressors.cast.stakes[]`, `.stakes[].{factionId, reason}`, `stressors.cast.absent[]` | `composeCrisisPage`, journal | The Stakes section and the absence rows vanish (21/24, 13/24). The row is dropped; nothing false is drawn |
| `stress.cast.*` (all 8 rows) | `crisis/crisisHooks.js`, through the Plot Hooks tab, the pdf hooks, `composeTonightSheet` | The crisis-anchored hooks vanish. The Plot Hooks tab disappears in 4 of 6 rendered towns. The Tonight crisis person becomes null (18/24). Nothing false, except the conditional `.stakes[].reason` above |

### (a): recomputed

| field | how |
|---|---|
| all 23 `publicProse.blocks.*` rows | `lib/saves.js :: publicProseForRow` recomposes them at the save. Present again in B: prize 12/12, terrain 15/15, the others 24/24 (21 to 23 where the block exists). Owner tabs never read `publicProse`: 0 rendered diffs when the 23 are withheld (6 towns). **Exception:** `defense:posture.posture.field` is recomposed only while `defenseProfile.readiness.score` is present. With the score withheld too it is 0/22, because `posturePoolKey(undefined)` returns null |
| `economicState.foodSecurity.storageMonths` | Recomputed only for `storesMonthsOf`, `foodLedger` and `causalState` (see (c) for the direct readers) |

## Files (all in `/var/tmp/v18/out/r2imp/`)

- `import.probe.jsx`: the probe.
- `vitest.config.mjs`: a copy of rv9's config.
- `fields77.txt`: the 77 census paths.
- `raw-full.json`: run 1. A, B and F, plus an 8-town A/B render. The PDF diff in this run includes raw-record copies;
  superseded by run 3 for the PDF.
- `raw-full2.json`: run 2. Adds the 17 field groups rendered on 6 towns.
- `raw-full3.json`: run 3. The PDF diff without record copies, plus `storesMonthsOf`, `foodLedger`, `defenseLedger`
  and the treaty draw.
- `perfield3.txt`: the per-field reader matrix (run 3).
- `summaryB.txt`: presence, recompute and B-arm reader counts.
- `render-summary.txt`, `render-groups.txt`: the rendered owner-page diffs.
- `full*.log`, `smoke.log`: vitest logs (each 1 passed).
