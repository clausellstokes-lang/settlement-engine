# VR7 MEASURE FIRST — VR9, VR10, the drawn census, master's shape (VEIL-18 list item 3)

Read-only measurement seat, 2026-11-19. Base tree `/var/tmp/v18/base` (`git archive 1f501779b`). Nothing tracked was
changed in any tree. The one write outside this folder: the worktree `/home/user/wt/master` (detached at origin/master
`db832c892`, after `git fetch origin master`, since `origin/master` was not in the local refs) and its `npm ci`
(rc 0). Every probe, runner and output is in `/var/tmp/v18/out/vr7m/`.

## M1 · VR9: the role-less base rate

**Method (executed).** `m1m2.probe.jsx` births 180 towns on the base pipeline: thorp, hamlet, village, town, city and
metropolis × 10 crisis settings (the differ's list) × 3 seeds. Each town is built in both stored shapes: the new shape
(with `withPublicProse(composePublicProse)`), and master's old person shape (`r5-born.probe.jsx`'s
`oldPerson`/`oldTie`, `schemaVersion 1`). Each is read four ways: `galleryPayloadFor(rec, {shareDm})` with Reveal DM
off and on, then `projectShareVeil(pub, {})`. With no veil record the share is unmarked and is returned unchanged.
As an aside, each is also read under the default veil (`writeShareVeil({}, [])`). Outputs are `m1m2b.json` (the
refined run, used below) and `m1m2.json` (the first run, which has the same counts). 0 towns threw.

**Numbers (5244 people in `npcs[]`, the same in every read; stored role-less: 0 of 5244)**

| read | role absent/empty | title absent/empty | both | towns with ≥1 role-less | role-less that are NOT a veiled face |
|---|---|---|---|---|---|
| new, DM off, no veil | 278 (5.3%) | 280 | 278 | 76 / 180 | **0** |
| new, DM on, no veil | 0 | 2 | 0 | 0 | 0 |
| old, DM off, no veil | 0 | 2 | 0 | 0 | 0 |
| old, DM on, no veil | 0 | 2 | 0 | 0 | 0 |
| (aside) new, DM off, default veil | 278 | 280 | 278 | 76 | 0 |
| (aside) new / old, DM on, default veil; old DM off, default veil | 16 | 18 | 16 | 15 | 0 |

Role-less people per tier (new shape, DM off, no veil): thorp 2/48, hamlet 0/91, village 4/235, town 27/796,
city 80/1610, metropolis 165/2464.

The 278 role-less people are exactly the 278 `npc_veiled_` faces. `publicSafe.js :: publicCard` drops `title` and
`role` on a card whose `institution.veiled` is true (NPC_HOUSE_NAMED_KEYS). The old shape keeps the role because
`oldPerson` turns `institution` into a string, so the veil bit is never read. Outside the veiled faces, no person is
shown role-less: 0 of 4966, in every read and in both shapes. The 2 people with no title are a crisis stand-in
(`npc_temp_grain`, role "Rations the food").

**What it means.** A served person without a role is always a veiled face: 278 of 278, and 0 of 4966 otherwise. A
blank role is itself the tell. **VR9 falls to withholding: the holder's card is withheld WHOLE, with its ties.
Blanking does not stand.**

## M2 · VR10: does any non-owner view need a person id that is stable across reads?

**Method.** The surfaces were read. The in-payload references and the id forms were executed (in the same
probe, on the served payload, no veil). For the references, the probe walked every string of the payload and kept
each one that equals a served `npcs[].id`, or contains one that is 8 or more characters long.

| surface (`path :: symbol`) | reads a person id? | needs it stable across reads? |
|---|---|---|
| `components/gallery/GalleryDetail.jsx :: GalleryDetail` (votes, reactions, report, comments, more-by) | no; keyed by the dossier id and slug | no |
| `components/gallery/GalleryComments.jsx` | no; per dossier | no |
| `components/PartyLinkView.jsx :: PartyLinkView` | only through PublicDossierView | no. There is no refresh, poll or diff (`hooks/useGalleryPageState.js` refetches by slug, and the page is a whole new payload) |
| `components/PublicDossierView.jsx` → `OutputContainer` (readOnly, no saveId) and its tabs (NPCs, Relationships, Power, …) | yes, within one payload (cards, ties, entity links `useDossierEntityNav`, search) | no |
| `OutputContainer.jsx :: onTogglePin` → `aiData.pinnedNpcs` (the only stored list keyed by person id) | yes | no: it is null unless `!readOnly && !playerView && saveId` (owner only) |
| `dossier/useCrossSettlementFocus.js` (the Realm Inspector `focusedEntity`) | yes | no: owner campaign only. An imported record's ids are its stored ids |
| URL routes and fragments (`lib/routes.js`, `/gallery/:slug`, `?slug`) | no | no |
| localStorage / sessionStorage (every file grepped: `useFloatingCard`, `useRealmInspector`, `persistProjection`, …) | none keyed by a person id on a non-owner page | no |
| Maps: `gallery/CampaignWorldView.jsx` pins, `GalleryMaps*`, `CampaignStatePanel` | settlement ids only | no |
| Public chronicle (migration 032 allowlist) | no person id | no |
| Import: `store/galleryImportSettlement.js :: importGallerySettlementImpl` | keeps the served ids as the new record's ids | no: every import is a NEW save. It does not merge with or diff against an earlier import |
| Importer's PDF (`pdf/sections/NotableNPCs.jsx :: anchorTarget(index, npc.id)`), Foundry journal (`foundry/*`: no ids) | the PDF uses ids within one record | no |

**Verdict.** No non-owner surface needs an id that is stable across reads. What every surface needs is ids that are
consistent within one payload. VR10's per-read re-key raises no owner question.

**References inside one payload (executed, born towns)** that the re-key must reach:
- `npcs[].id`.
- `relationships[].from` / `.to`, or `npc1Id` / `npc2Id` in the old shape.
- `relationships[].id`, which CONTAINS both person ids (4926 of 4926 ties on DM off).
- `stress.cast.roles[].id`, `stressors.cast.roles[].id`, `stress[].cast.roles[].id`, `stressors[].cast.roles[].id`.
- `stress(ors).cast.levers[].holderId`.
- With Reveal DM on, also: `npcs[].goal.intent.short.target.id`, `npcs[].goal.intent.long.target.id`,
  `npcs[].allegiance.handler` (new shape), `simulationTrace[].targetId` and
  `simulationTrace[].downstreamEffects[].target`.
- Read only, not found on born towns: `npcId` (event log, pins), `holderId`, `castId`, `personId`, `handlerId`,
  `incumbentId` and `rulerId` (succession and the world pulse) appear in the source and may carry person ids on
  campaign-played or AI-refined records. They are unsettled for the served payload.

**Id forms (5244 born ids)**

| form | count | what it spells |
|---|---|---|
| `npc_<slug>` | 4875 | 3922 equal the person's own house key slug (`npc_shepherd_collective`). The rest are role slugs (`npc_household_elder`, `npc_temp_grain`) |
| `npc_power_<faction slug>` | 91 | the power (`npc_power_the_independent_bloc`) |
| `npc_veiled_<16 hex>` | 278 | the veiled class itself |

There is no `npc.<firstname>` form: 1 id contains its first name, by coincidence. The ids spell the house or power
for 4013 of 5244 people (3922 house slugs and 91 powers). The prefix marks the remaining hidden 278.

## M3 · The drawn census (VR14 (iii)/(iv), VR8)

**Method (read only; nothing in this table was executed).** The leaf keys of each path were grepped in
`src/components`, `src/pdf`, `src/foundry`, `src/domain/display`, `src/domain/dossier` and `src/domain/summary`, then
followed into the public page. The public page is `PublicDossierView` → `OutputContainer readOnly`, with
`publicDossier = true` and the player view unless shareDm. These rules settle most rows:
- On a public page every desk prints `publicProse` (`publicProseOf`) and never draws live data.
- `drawnAtMount` keeps `.sentence` only at a SENTENCE mount (`dossierMounts.js`).
- A rung's `.glance` is rendered at one place only (`WarFaithDesk.jsx:384`, the patron seat).
- `.detail` is never rendered.
- The Crisis tab is off on every player-view or public page (`OutputContainer.jsx:534`).
- There is no PDF or journal on a non-owner page (VR4 §2b).
- The importer's record renders in owner mode: the desks draw live, and its `publicProse` is recomposed at the save
  (`lib/saves.js`).

"plausible" marks a row followed to a consumer but not to the pixel. "unread" marks a row that was not settled.

**Count (the 130):** drawn on a non-owner page **52**, undrawn **77**, unread **1**. Of the 49 the differ's
classifier groups as NUMBER/BOOLEAN, 12 are drawn and 37 undrawn.

Corrections to VR4 §2b:
- `compound.militaryEffective` is NOT drawn on a non-owner page. `dailyLifeLogic`'s `militaryScore` is returned and
  no tab consumes it.
- `safetyRatio` reaches the page only as words, but the importer's PDF prints it raw ("Watch to population").

| path | drawn, non-owner | where | drawn, importer | where | form |
|---|---|---|---|---|---|
| `activeConditions[].severity` | no | only via publicProse stressors:overview.conditionSeverity | yes | stressorsStateProse desk (deriveActiveCondition); pdf printProse | sentence/band |
| `activeConditions[].severityBand` | no | - | yes(plausible) | stressors desk reads the condition via deriveActiveCondition | band word in sentence |
| `defenseProfile.readiness.score` | no | only via publicProse defense:posture (pool choice) | yes | defenseStateProse :: posturePoolKey (DefenseTab owner) | sentence (pool chosen by score) |
| `defenseProfile.scores.disaster` | yes | DefenseTab :: threatScores via threatAssessment.js :: disasterReadinessScore (bar width %, scoreBand word) | yes | same + pdf DefenseSecurity | drawn score (bar) + band |
| `defenseProfile.scores.economic` | yes | DefenseTab :: threatScores; OverviewTab :: ScoreRow (SYSTEMS_HEALTH_ROWS) | yes | same + pdf | drawn score (bar) + band |
| `defenseProfile.scores.internal` | yes | DefenseTab :: threatScores (bar + band) | yes | same + pdf | drawn score (bar) + band |
| `economicState.compound.criminalEffective` | no | - | no (kernels only) | world pulse factionDensityKernel/espionageMath/colonization, corruption.js (VR4 2b) | raw, undrawn |
| `economicState.compound.criminalPreStress` | no | - | no (kernels only) | as above | raw, undrawn |
| `economicState.compound.economyOutput` | yes | EconomicsGlance :: outputChipBesideWord ("NN/100") | yes | same + pdf EconomicsTrade "Output" | raw score |
| `economicState.compound.magicInfluence` | no | only via publicProse economy:economics.incomeWeight | yes | economyStateProse :: incomeWeightPoolKey | sentence |
| `economicState.compound.militaryEffective` | no | dailyLifeLogic ctx.militaryScore is unconsumed by DailyLifeTab; postureLineDisqualifiers is desk-only | yes | defense desk (postureLineDisqualifiers) | sentence choice |
| `economicState.compound.religionInfluence` | no | only via publicProse incomeWeight | yes | economyStateProse :: incomeWeightPoolKey | sentence |
| `economicState.economicComplexity` | yes | EconomicsGlance (complexityLabelShown) | yes | same + pdf, journal kv Complexity | label |
| `economicState.foodSecurity.foodRecord.storageMonths` | yes | EconomicsTab :: storesLine (tonightSheet.js :: foodStoresWords span words) and the food line's >=3 clause | yes | same + pdf | words/sentence |
| `economicState.foodSecurity.resilienceScore` | yes | OverviewTab food bar width (value shown = band label) | yes | same + pdf viewModelBodySlices | drawn score (bar) |
| `economicState.foodSecurity.storageMonths` | no (born towns) | dossierViewModel.js :: deriveGranaryOutlook is campaign-season only | campaign only | Season tile, map WarResolveSection, kernels | words |
| `economicState.foodSecurity.storageNote` | no | no reader | no | no reader | undrawn |
| `economicState.incomeSources[] (only in B)` | yes | EconomicsTab Income Sources bars (percentage, label) | yes | same + journal, pdf | share % + label |
| `economicState.incomeSources[].weight` | no | no reader (VR4 2b) | no | no reader | undrawn |
| `economicState.prosperity` | yes | EconomicsGlance prosperity word | yes | same + pdf, journal | label |
| `economicState.prosperityStanding` | yes | EconomicsGlance :: prosperityInCrisisLine (crisis towns) | yes | same | word in sentence |
| `economicState.safetyProfile.compound.criminalEffective` | no | no reader | no | no reader | undrawn |
| `economicState.safetyProfile.compound.criminalPreStress` | no | no reader | no | no reader | undrawn |
| `economicState.safetyProfile.compound.economyOutput` | no | no reader of safetyProfile.compound.economyOutput | no | no reader | undrawn |
| `economicState.safetyProfile.compound.magicInfluence` | no | only via publicProse incomeWeight | yes | economyStateProse.js:1268 incomeWeightPoolKey(eco.safetyProfile.compound) | sentence |
| `economicState.safetyProfile.compound.militaryEffective` | no | no reader | no | no reader | undrawn |
| `economicState.safetyProfile.compound.religionInfluence` | no | only via publicProse incomeWeight | yes | economyStateProse.js:1268 | sentence |
| `economicState.safetyProfile.economicDragDesc` | yes | EconomicsTab shadow-economy section (only where blackMarketCapture is served >0) | yes | same + pdf | sentence |
| `economicState.safetyProfile.flags.anyActive` | no | no reader | no | no reader | undrawn |
| `economicState.safetyProfile.flags.arcaneBlackMarket` | no | only via publicProse economy desk | yes | economyStateProse flag pool | sentence |
| `economicState.safetyProfile.flags.merchantArmy` | no | only via publicProse power desk | yes | powerStateProse flag pool | sentence |
| `economicState.safetyProfile.flags.religiousFraud` | no | only via publicProse warFaith:faith.templeFraud | yes | warFaithStateProse flag pool | sentence |
| `economicState.safetyProfile.guardEffectivenessDesc` | yes | DefenseTab :: deriveGuardAssessment (defenseDisplay.js:107) | yes | same | sentence |
| `economicState.safetyProfile.safetyDesc` | yes | DefenseTab public-order paragraph (defenseDisplay.js :: deriveSafetyLine) | yes | same + pdf | sentence |
| `economicState.safetyProfile.safetyLabel` | yes | DefenseTab public-order banner; Overview StatusTag | yes | same + pdf | label |
| `economicState.safetyProfile.safetyRatio` | yes (as words) | DailyLifeTab order line via dailyLifeLogic safetyScore bands; raw display retired (DefenseTab:305, OverviewTab:426) | yes | same + pdf DefenseSecurity "Watch to population" prints the RAW figure; pdf Overview enforcementWords | band words (raw on importer's PDF) |
| `economicState.situationDesc` | no (fallback only) | settlementQuickGuide.js:999 material_life fallback when prosperity, food and exports are all absent (never on born towns) | no (fallback only) | same | sentence |
| `history.currentTensions[] (only in A)` | yes | HistoryTab :: TensionRow | yes | same + pdf, journal | sentence |
| `history.currentTensions[] (only in B)` | yes | HistoryTab :: TensionRow | yes | same | sentence |
| `history.currentTensions[].factions[] (only in A)` | unread | TensionRow renders description/severity; factions[] not settled | unread | - | - |
| `history.eventsTimeline[] (only in A)` | yes | HistoryTab timeline | yes | same | label + raw years |
| `history.eventsTimeline[] (only in B)` | yes | HistoryTab timeline | yes | same | label + raw years |
| `history.eventsTimeline[].anchored` | no | timeline reads te.open, not anchored; general desk only | yes(plausible) | generalStateProse anchored rows | sentence choice |
| `history.eventsTimeline[].year` | no | no reader found | no | no reader found | undrawn |
| `history.eventsTimeline[].yearsAgo` | yes | HistoryTab timeline "Ny" and dot position | yes | same | raw figure |
| `history.founding.overcoming` | yes | HistoryTab "How survived" | yes | same + pdf HistoryFounding | sentence |
| `history.historicalCharacter` | yes | HistoryTab quote | yes | same | sentence |
| `history.historicalEvents[] (only in A)` | yes | HistoryTab event cards | yes | same + pdf | sentence |
| `history.historicalEvents[] (only in B)` | yes | HistoryTab event cards | yes | same | sentence |
| `history.historicalEvents[].anchored` | no | plot hooks are stripped on non-owner reads; general desk only | yes(plausible) | general desk; plotHooks.js (hooks stripped on import too) | sentence choice |
| `history.historicalEvents[].severity` | yes | HistoryTab event card word | yes | same | label |
| `history.historicalEvents[].yearsAgo` | yes | HistoryTab "Ny ago" | yes | same + plot hooks owner | raw figure |
| `history.legacyAnnotations[]` | no | only via publicProse general:history.legacyLines | yes | generalStateProse :: legacyPoolKey | sentence |
| `history.legacyAnnotations[].eventName` | no | as above | yes(plausible) | general desk | sentence |
| `history.legacyAnnotations[].eventType` | no | as above | yes(plausible) | general desk | sentence |
| `history.legacyAnnotations[].severity` | no | as above | yes(plausible) | general desk | sentence |
| `history.legacyAnnotations[].yearsAgo` | no | as above | yes(plausible) | general desk | sentence |
| `powerStructure.economyInputFingerprint` | no | no reader | no | no reader | undrawn |
| `powerStructure.factionRelationships[] (only in B)` | yes | PowerStrata :: groupRelationships | yes | same | label |
| `powerStructure.factionRelationships[].ratio` | no | no reader | no | no reader | undrawn |
| `powerStructure.factions[] (only in A)` | yes | PowerStrata | yes | same + pdf, journal | row |
| `powerStructure.factions[] (only in B)` | yes | PowerStrata | yes | same | row |
| `powerStructure.factions[].contestsNiche` | no | no reader | no | no reader | undrawn |
| `powerStructure.factions[].power` | yes | PowerStrata ({r.power}, bar %) | yes | same + pdf, journal table | raw figure |
| `powerStructure.factions[].powerLabel` | yes | PowerStrata badge; PowerTab chain | yes | same + pdf | label |
| `powerStructure.factions[].rawPower` | no | pdf viewModel carries it, no section prints it | no | same | undrawn |
| `powerStructure.publicLegitimacy.bg` | yes | PowerTab legitimacy banner background | yes | same | colour |
| `powerStructure.publicLegitimacy.breakdown.prosperity` | no | "breakdown in points left the page"; public governance reads publicProse power:governance | yes | governanceAccount.js :: legitimacyCausesOf (cause words); pdf Visuals breakdown | words (importer PDF: figure) |
| `powerStructure.publicLegitimacy.breakdown.safety` | no | as above | yes | as above | words (importer PDF: figure) |
| `powerStructure.publicLegitimacy.color` | yes | PowerTab banner; SubstrateTab tone | yes | same | colour |
| `powerStructure.publicLegitimacy.crimMultiplier` | no | no reader | no | no reader | undrawn |
| `powerStructure.publicLegitimacy.govMultiplier` | no | legitimacy-hold lens cut (T2-18); EngineSections.jsx is imported by nothing | no | same | undrawn |
| `powerStructure.publicLegitimacy.isApproved` | no | no reader | no | no reader | undrawn |
| `powerStructure.publicLegitimacy.isContested` | no | no reader | no | no reader | undrawn |
| `powerStructure.publicLegitimacy.isEndorsed` | no | no reader | no | no reader | undrawn |
| `powerStructure.publicLegitimacy.isTolerated` | no | no reader | no | no reader | undrawn |
| `powerStructure.publicLegitimacy.label` | yes | PowerTab banner | yes | same + pdf, journal | label |
| `powerStructure.publicLegitimacy.score` | yes | PowerTab banner (the number, FS 28) | yes | same + pdf | raw figure |
| `powerStructure.recentConflict` | yes (presence) | RelationshipsTab :: conflictsElsewhere (a boolean drives a line); the PowerTab vignette left | yes | same + pdf viewModel | presence / sentence |
| `powerStructure.stability` | yes | PowerTab stability header {m} | yes | same + pdf, journal | label |
| `publicProse.blocks.defense:posture.posture.field` | no | DefenseTab draws .beside; the same text is drawn from safetyProfile.guardEffectivenessDesc | no | owner desks draw live; publicProse recomposed at the importer's save (lib/saves.js) | copy, undrawn |
| `publicProse.blocks.defense:posture.prize.field` | no | prize lens cut (T2-21) | no | as above | undrawn |
| `publicProse.blocks.defense:posture.terrain.field` | no | terrain lens cut (T2-21) | no | as above | undrawn |
| `publicProse.blocks.defense:state.firstSurvey.field` | no | first-survey line not drawn (T2-22) | no | as above | undrawn |
| `publicProse.blocks.defense:state.publicOrder.beside` | yes | DefenseTab :: orderBeside (defense.publicOrder, sentence) | no | as above | sentence |
| `publicProse.blocks.defense:state.publicOrder.field` | no | copy; DefenseTab draws safetyDesc from the payload itself | no | as above | copy, undrawn |
| `publicProse.blocks.defense:state.publicOrder.rung.glance` | no | glance rungs are rendered only at WarFaithDesk patron seat | no | as above | undrawn |
| `publicProse.blocks.defense:state.publicOrder.rung.sentence` | yes (gate) | DefenseTab gate for orderBeside; the identical text prints as .beside | no | as above | sentence |
| `publicProse.blocks.defense:threat.economic.sentence` | yes | DefenseTab :: threatSentenceFor('Economic Survival') | no | as above | sentence |
| `publicProse.blocks.defense:wall.rationale.sentence` | yes | DefenseTab :: wallLine | no | as above | sentence |
| `publicProse.blocks.economy:daily_life.incomeWeight` | no | DailyLifeTab draws prosperityRung, foodOnProsperity only | no | as above | undrawn |
| `publicProse.blocks.economy:daily_life.shadowEconomy` | no | as above | no | as above | undrawn |
| `publicProse.blocks.economy:economics.incomeMix.sentence` | yes | EconomicsTab DeskLines economics.commercialProfile | no | as above | sentence |
| `publicProse.blocks.economy:economics.incomeWeight` | yes | EconomicsTab DeskLines economics.commercialProfile | no | as above | sentence |
| `publicProse.blocks.economy:economics.prosperityHeader.detail[].value` | no | no reader of rung .detail | no | as above | undrawn |
| `publicProse.blocks.economy:economics.prosperityHeader.glance` | no | glance not rendered | no | as above | undrawn |
| `publicProse.blocks.economy:economics.prosperityHeader.sentence` | yes | EconomicsGlance headerProse (sentence mount) | no | as above | sentence |
| `publicProse.blocks.economy:economics.prosperityRung.glance` | no | glance not rendered | no | as above | undrawn |
| `publicProse.blocks.economy:economics.prosperityRung.sentence` | yes (via alias) | EconomicsGlance's economyTile is a glance mount (silent); DailyLifeTab DeskLines daily_life.standingOfLiving draws it through economy:daily_life's alias | no | as above | sentence |
| `publicProse.blocks.economy:economics.shadowEconomy` | yes | EconomicsTab economics-shadow-economy-line (where the section renders) | no | as above | sentence |
| `publicProse.blocks.economy:economics.shadowEconomy.sentence` | yes | as above | no | as above | sentence |
| `publicProse.blocks.economy:resources.incomeWeight` | no | ResourcesTab draws exploitation/resourceCondition/strategicValue only | no | as above | undrawn |
| `publicProse.blocks.economy:resources.shadowEconomy` | no | as above | no | as above | undrawn |
| `publicProse.blocks.economy:services.incomeWeight` | no | ServicesTab draws catalogStanding/impairedService only | no | as above | undrawn |
| `publicProse.blocks.economy:services.shadowEconomy` | no | as above | no | as above | undrawn |
| `publicProse.blocks.general:history.legacyLines[] (only in A)` | yes | HistoryTab legacyLines (history.legacy, sentence) | no | as above | sentence |
| `publicProse.blocks.general:history.legacyLines[] (only in B)` | yes | as above | no | as above | sentence |
| `publicProse.blocks.power:desk.legitimacyBanner.glance` | no | glance mount; only .sentence rendered | no | as above | undrawn |
| `publicProse.blocks.power:desk.legitimacyLens` | no | power.legitimacyBanner is a glance mount: drawnAtMount nulls the sentence | no | as above | undrawn |
| `publicProse.blocks.power:desk.stabilityHeader.glance` | no | glance not rendered (the same words print from powerStructure.stability) | no | as above | undrawn |
| `publicProse.blocks.power:desk.structureFlag` | yes | PowerTab structureLines (power.rulingStructure, sentence) | no | as above | sentence |
| `publicProse.blocks.power:desk.successionRisk.glance` | no | only .sentence rendered | no | as above | undrawn |
| `publicProse.blocks.stressors:overview.conditionSeverity.glance` | no | glance not rendered | no | as above | undrawn |
| `publicProse.blocks.stressors:overview.conditionSeverity.sentence` | yes | OverviewTab CONDITIONS_MOUNT (sentence) | no | as above | sentence |
| `publicProse.blocks.warFaith:faith.templeFraud` | yes | WarFaithDesk temple rungs (faith.templeGround, sentence) | no | as above | sentence |
| `spatialLayout.quarters[] (only in A)` | no | nothing draws it (VR4 2b) | no (kernels only) | campaign kernels | undrawn |
| `stress.cast.absent[]` | no | CrisisTab is off on every playerView/publicDossier page (OutputContainer.jsx:534) | yes(fallback) | crisisPage.js reads stressors first, stress as fallback | role label + reason |
| `stress.cast.roles[].reason` | no | as above | yes(fallback) | as above | sentence |
| `stress.cast.roles[].role` | no | as above | yes(fallback) | as above | role label |
| `stress.cast.stakes[]` | no | as above | yes(fallback) | as above | stake word + reason |
| `stress.cast.stakes[].factionId` | no | as above | yes(fallback) | door link only | not text |
| `stress.cast.stakes[].reason` | no | as above | yes(fallback) | as above | sentence |
| `stress.cast.stakes[].stake` | no | as above | yes(fallback) | as above | word |
| `stressors.cast.absent[]` | no | as above | yes | CrisisTab; pdf CrisisSections; journal crisis section | role label + reason |
| `stressors.cast.roles[].reason` | no | as above | yes | as above | sentence |
| `stressors.cast.roles[].role` | no | as above | yes | as above | role label |
| `stressors.cast.stakes[]` | no | as above | yes | as above | stake word + reason |
| `stressors.cast.stakes[].factionId` | no | as above | yes | CrisisTab door (castDoorId) | not text |
| `stressors.cast.stakes[].reason` | no | as above | yes | as above | sentence |
| `stressors.cast.stakes[].stake` | no | as above | yes | as above | word |
| **default-veil extras (8)** | | | | | |
| `history.currentTensions[].description` | yes | HistoryTab :: TensionRow | yes | same | sentence |
| `history.historicalEvents[].description` | yes | HistoryTab event card | yes | same | sentence |
| `history.historicalEvents[].lastingEffects[] (only in A)` | yes | HistoryTab expanded card | yes | same | sentence |
| `history.historicalEvents[].lastingEffects[] (only in B)` | yes | HistoryTab expanded card | yes | same | sentence |
| `history.legacyAnnotations[].annotation` | no | general desk only (publicProse) | yes(plausible) | general desk | sentence |
| `history.siegeNarrative` | no | generalStateProse.js:717 desk only | yes | general desk | sentence |
| `institutions[].desc` | yes(plausible) | institution cards (not settled to a symbol) | yes(plausible) | same | sentence |
| `powerStructure.factions[].desc` | yes(plausible) | PowerStrata faction card (not settled to a symbol) | yes(plausible) | same | sentence |

**What it means for the registry.** VR14 (iii) applies to the 77 undrawn paths: "not sent" costs no shared page
anything. They include all 12 compound and safetyProfile.compound figures, flags, ratio, rawPower, the multipliers and
booleans, `incomeSources[].weight`, and the 23 publicProse rungs and copies no tab renders (`.glance`, `.detail`,
`.field`, and the economy rungs at the services, resources and daily_life sites). The 52 drawn paths go to VR14 (iv),
VR8 or VR12 under their drawn form. Four of them are drawn as a RAW figure and need the differ's (iv) test:
`factions[].power`, `publicLegitimacy.score`, `compound.economyOutput` and the `yearsAgo` rows.

## M4 · Master's shape (the reader's 113)

**Method (executed).** `run-differ-master.sh` is `run-differ.sh` with one change: it sets
`RV9_GEN=/home/user/wt/master RV9_VEIL=$SRC`, with `RV6_SRC = /var/tmp/v18/base`. Master has no composer, so its
births carry no `publicProse`.

**N=2** (`differ-master/`, 140 towns, 91 with a hideable house, B kept 0, 0 threw; 4 shards rc 0):
- **Every eye shut: IN THE CLASS 131.** 182 paths differ in ≥2 towns; 32 are re-roll; 19 are between. By group:
  NUMBER/BOOLEAN 54, OTHER text/label 54, CRIME-WORDED 12, HISTORY RE-DRAW 11.
- Default veil: 151 in the class.

**N=1** (`differ-master-n1/`, 70 towns) reproduces the reader's figure: **113** in the class with every eye shut
(48 / 44 / 10 / 11); 131 on the default veil. So the reader's 113 is the 70-birth bound. At N=2 the bound is 131.

The full lists are the merge and classify outputs: `differ-master/merge-{all,default}.txt` and
`classes-{all,default}.txt`, and the same for `differ-master-n1/`.

**Master's 131 that are NOT among the new shape's 130 (46; `m4-master-not-in-new.txt`):**
`conflicts[]`; `conflicts[].intensity`; `conflicts[].issue`; `defenseProfile.economicGates.disaster`; `defenseProfile.economicGates.economic`; `defenseProfile.economicGates.internal`; `defenseProfile.economicGates.military`; `defenseProfile.economicGates.monster`; `defenseProfile.readiness.background`; `defenseProfile.readiness.border`; `defenseProfile.readiness.color`; `defenseProfile.readiness.label`; `defenseProfile.scores.magical`; `defenseProfile.scores.military`; `economicState.incomeSources[].desc`; `npcs[] (only in B)`; `npcs[].category`; `npcs[].influence`; `npcs[].name`; `npcs[].presentation.behaviour`; `npcs[].presentation.disposition`; `npcs[].presentation.impression`; `powerStructure.conflicts[]`; `powerStructure.conflicts[].intensity`; `powerStructure.conflicts[].issue`; `powerStructure.factionRelationships[].direction`; `powerStructure.factions[].legitimacyCrisis`; `powerStructure.publicLegitimacy.breakdown.defense`; `powerStructure.publicLegitimacy.governanceFractured`; `powerStructure.publicLegitimacy.isLegitimacyCrisis`; `pressureSentence`; `prominentRelationship.npc1`; `prominentRelationship.npc2`; `prominentRelationship.type`; `relationships[] (only in A)`; `relationships[] (only in B)`; `stress.cast.levers[].holderId`; `stress.cast.levers[].holderName`; `stress.cast.roles[] (only in A)`; `stress.cast.roles[] (only in B)`; `stress.cast.roles[].name`; `stressors.cast.levers[].holderId`; `stressors.cast.levers[].holderName`; `stressors.cast.roles[] (only in A)`; `stressors.cast.roles[] (only in B)`; `stressors.cast.roles[].name`

The other way round, 45 of the new shape's 130 are not in master's 131 (`m4-new-not-in-master.txt`). Of these, 35
are publicProse rows, which master never stores. The other 10 are `compound.criminalPreStress`,
`safetyProfile.compound.criminalPreStress`, `economicComplexity`, `prosperityStanding`, the four food (`foodRecord.storageMonths`,
`storageMonths`, `resilienceScore`, `storageNote`) rows, `guardEffectivenessDesc` and `currentTensions[].factions[]`.

**What it means.** The registry is the union of both bounds. Master's shape adds the person, tie and cast-name rows
(`npcs[].name`, `relationships[]`, `prominentRelationship.*`, `pressureSentence`, `stress(ors).cast.roles[].name`,
`levers[].holderId`), plus `conflicts[]` and the `defenseProfile.economicGates`, `readiness` colour and label, and
`scores.magical`/`military` rows.
