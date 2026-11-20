# WIRING-0 — the dark-fact inventory for the construction-and-wiring wave (2026-11-07)

Seat: Opus 5.5, a child of the cloud chair. MEASURE and PROPOSE only: no product, annex or register byte changed. Lane branch `lane/wiring-inventory-2026-11-07`, cut from `origin/lane/landing-rung1-2026-11-04` @ `3c62e8ef5` (the remote tip was unchanged at writing).

**SCOPE (the owner, 2026-11-07, relayed by the chair at 00:36 UTC, verbatim):** "Regarding construction, I only meant for the facts from generation only. Nothing from advance time or simulation as that has to wait until after we build FPZ." So every row carries an ORIGIN, decided by reading the key's WRITER file. GENERATION rows (§2) are the wave's worklist and the only rows with proposals and lanes. SIMULATION rows (§3) are listed with their writer and marked **DEFERRED — after FPZ**.

## 1. The whole-estate figures

**`3c62e8ef5` · judged 6,681 · LIT 589 · LIT-NAME 4,819 · DARK 1,273 · reviewable 494 (`reviewableDark`, scripts/lib/writer-reach-scan.mjs:517) · convicted/unreviewable 779 · register rows 10 (engine-internal 7, pending-surface 3) · pending-surface debt: the three `isolationSupport` rows (§12 WRW-2).** The corpus: 4 seeds × 4 configs × 16 generations, 12 pulse intervals; settlement-level shapes carry 472 rows.

The reviewable 494, partitioned by origin:

| partition | families (shapes) | identities | status |
|---|---|---|---|
| GENERATION | 48 | **200** | the wave's worklist (§2): SAY 53 · SAY-VIA-SPINE 29 · INTERNAL 118 |
| SIMULATION | 56 | **294** | DEFERRED, after FPZ (§3), of which 90 are the war-pulse block (§3.1) |

Eight shapes appear in both partitions because different keys on them have different writers: `inst`, `npcs`, `members`, `traditions`, `reasons`, `flags`, `config`, `settlement`.

**How it was measured.** The door `node scripts/check-writer-reach.mjs --report-to=<path>` **crashes at this tip**: it throws "governed publication requires a plan returned by planExternalArtifactOutputs". `scripts/check-writer-reach.mjs:402-403` passes the array that `planExternalArtifactOutputs` returns (scripts/lib/governed-artifact-io.mjs:185) to `publishJsonExclusive`, which needs one plan, `plan[0]`. That is a one-token product defect, recorded here and not repaired. I measured through the script's own exports instead: `measure()` → `reportOf()` → `liveViewOf()` → `reviewableDark()`. The HOLD line printed by that route matches the brief's figures exactly. `node scripts/wiring-census.mjs --print` (exit 0): pools 709 · blocks 68 · variants 2,310 · RESOLVED 341 · WIRING-UNRESOLVED 368 · facts with k = 0 on 49 of the 341 RESOLVED rows.

**Who read what.** Four read-only research seats, one per section batch, each read every family's writer and filled the rows. I assembled, checked and partitioned their work. Each row's `conf` column says whether the seat read the writer (CONFIRMED) or inferred it (PLAUSIBLE).

## 2. THE FAMILY TABLE — GENERATION (the worklist)

The "facts to author" column counts SAY and SAY-VIA-SPINE rows. Sibling keys that carry one fact are one row, so 82 identities collapse to 43 facts.

### 2.0 Roll-up

| section | families | identities | SAY | SAY-VIA-SPINE | INTERNAL | facts to author |
|---|---|---|---|---|---|---|
| Economy & supply | 12 | 62 | 24 | 12 | 26 | 14 |
| Defence & viability | 12 | 36 | 5 | 16 | 15 | 10 |
| Power & people | 13 | 30 | 11 | 0 | 19 | 10 |
| Faith | 2 | 7 | 7 | 0 | 0 | 5 |
| History, relations & the map | 9 | 48 | 6 | 1 | 41 | 4 |
| Config & provenance | 6 | 17 | 0 | 0 | 17 | 0 |

### 2.1 The rows, by section (SAY first, then SAY-VIA-SPINE, then INTERNAL)

#### ECO — Economy & supply

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| flags | arcane black market | arcaneBlackMarket (1) | 472/472 | Magic and crime overlap in an underground market for arcane goods | DS-ECO-6 (economy) | SAY: only when true. READS safetyProfile.criminalInstitutions | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | theocratic economy | theocraticEconomy (1) | 472/472 | Tithes and church land dominate the economy | DS-ECO-6 (economy) · also faith | SAY: only when true. READS incomeSources (it already changes the tithe line) | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| foodRecord | what the famine broke | failedSource, famineCutPct (2) | 472/472 | Under famine, which food source failed (grain harvest, herds, fishing…) and how much of local production it took. | DS-ECO-9 | SAY — only when band = famine; READS foodRecord.band, stress famine. Note: already composed into a viability issue (foodBalance.js:199-202 → issues[] stress_consequence) — check whether DS-GEN-11 prints it. | none | GENERATION — `generators/economy/foodBalance.js (called from generators/foodGenerator.js)` | CONFIRMED |
| foodRecord | how the need is met | normalImportPct, magicPct (2) | 472/472 | Share of daily need brought in by ordinary carts and trade, and share closed by magic (beside grownPct). | DS-ECO-9 | SAY — "X% grown, Y% carted in, Z% by magic", only when normalImportPct ≥20 or magicPct >0; READS grownPct, band. | writer change — normalImportPct can disagree with foodSecurity.importPct | GENERATION — `generators/economy/foodBalance.js (called from generators/foodGenerator.js)` | CONFIRMED |
| foodSecurity | diet diversity | activeChainsCount, diversityNote (2) | 472/472 | How many independent food chains feed the town (grain, herds, fishing, hunting, trade). | DS-ECO-9 (food ledger) | SAY — only when count ≤1 ("a single food source") or ≥4; READS foodRecord.foodSources, foodRecord.band. | writer change — counts "Trade & imports" as a chain and uses looser tests than `foodRecord.foodSources` (FOOD-3); the two can disagree | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| reasons | why a resource must be imported | clay, desert_salt, gemstones, glass_sand, grain, grapes, hot_springs_mineral, livestock, metals, mountain_timber, salt, stone, timber (13) | 4408/4408 | For each critical import, why the town cannot supply it: "<terrain> cannot produce this locally" or "required by <workshop> but not available here" | DS-ECO-12 (economy) · also DS-ECO-11 | SAY: one clause per critical import, beside the LIT `imports.critical` list. Worth saying only when a reason exists, and lead with the institution-requires form. READS resourceAnalysis.imports.critical, config.terrainType, institutions | none | GENERATION (generators/resourceGenerator.js:265/285) | CONFIRMED |
| resourceAnalysis | exhausted resources | resourceConditions, conditionNotes (2) | 472/472 | Which nearby resources are depleted, with their description ("The fishing grounds are over-fished…"). | DS-ECO-11 (terrain identity, exploitation) | SAY — only when a condition is `depleted`; READS resourceConditions[].condition, label. | none | GENERATION — `generators/resourceGenerator.js` | CONFIRMED |
| resourceConditions | how a resource recovers | recoveryMode (1) | 2364/2364 | How a depleted resource can come back (naturally, by labour, by high magic, not applicable). | DS-ECO-11 | SAY — only when condition = depleted; READS condition, label. | none | GENERATION — `domain/resourceSemantics.js, called at birth by generators/resourceGenerator.js` | CONFIRMED |
| activeChains | impaired upstream | upstreamWeak (1) | 8017/8017 | Which feeding chains are themselves impaired, making this one vulnerable. | DS-SUP-2 (break-cause clauses) | SAY-VIA-SPINE — upstream impaired → chain vulnerable → `upstreamNote` (LIT). | none | GENERATION — `generators/computeActiveChains.js` | CONFIRMED |
| compound | religious and magical weight | religionInfluence, magicInfluence (2) | 944/944 | How strongly faith and magic shape the town after stresses act on them. | DS-ECO-12 (income sources) | SAY-VIA-SPINE — religionInfluence → pilgrim/tithe income sources (economicState.js:228-245) and service availability; magicInfluence → magic income and services. | writer change (stale on advance, as `inst`) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |
| foodRecord | the food sources | foodSources (1) | 472/472 | The food sources the place truly has, largest first. | DS-ECO-9 | SAY-VIA-SPINE — foodSources → `foodwaysLine` (LIT) and store months (preserved sources). | none | GENERATION — `generators/economy/foodBalance.js (called from generators/foodGenerator.js)` | CONFIRMED |
| foodSecurity | food's grip on prosperity | prosperityMod (1) | 472/472 | Whether food caps, penalises or lifts the town's prosperity, with the reason (e.g. "Severe structural food deficit caps prosperity at Poor"). | DS-ECO-8 (prosperity tier) | SAY-VIA-SPINE — food band → prosperity cap/penalty/bonus (economy/prosperity.js:228) → prosperity rung. Say only when type ≠ null. | none | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| inst | commercial institutions present | hasMarket, hasGuild, hasMerchantGuild, hasBank, hasWarehouse (5) | 944/944 | The town keeps the machinery of commerce: a market, craft guilds, a merchant guild, a bank or money-changer, warehouses. | DS-GEN-13 (market and roads) / DS-ECO-12 (income sources) | SAY-VIA-SPINE — market-class presence → income sources / market line (DS-GEN-13 already keys on market-class presence). hasWarehouse has no reader. | writer change (stale on advance) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |
| institutions | secret / underground facet | clandestine, subterranean (2) | 19773/19773 | The institution works in secret and/or below ground (the tunnel network, the underground bazaar). | DS-ECO-6 (shadow economy) / DS-WAR-5 (siege) | SAY-VIA-SPINE — clandestine facet → smuggling-reach bonus and siege food trickle (`domain/worldPulse/clandestineFacet.js`) → shadow-economy / siege-endurance lines. Nested under `facets`. | none | GENERATION — `generators/steps/assembleInstitutions.js, generators/cascadeGenerator.js, generators/steps/coherenceRepairPass.js` | CONFIRMED (writer); PLAUSIBLE that couplings are lit |
| activeChains | primary resource available | resourceActive (1) | 8017/8017 | The chain's own raw resource is present and workable. | — | INTERNAL `engine-internal` — boolean of `resourceCondition === 'available'` (LIT). | none | GENERATION — `generators/computeActiveChains.js` | CONFIRMED |
| economicState | raw priority sliders | priorities (1) | 472/472 | The DM's priority slider values. | — | INTERNAL `engine-internal` — config inputs; their outcomes are shown. | none | GENERATION — `generators/economy/economicState.js` | CONFIRMED |
| foodRecord | gap percent | gapPct (1) | 472/472 | The remaining food gap, %. | — | INTERNAL `engine-internal` — equals rounded deficitPct (LIT). | none | GENERATION — `generators/economy/foodBalance.js (called from generators/foodGenerator.js)` | CONFIRMED |
| foodRecord | grows more than it eats | growsMoreThanEats (1) | 472/472 | The place produces more food than it needs. | — | INTERNAL `engine-internal` — the gate for any "surplus"/food-export words (domain/foodSurplus.js:23); its outcome is shown. | none | GENERATION — `generators/economy/foodBalance.js (called from generators/foodGenerator.js)` | CONFIRMED |
| foodSecurity | food band flags | isDeficit, isPressured, isSecure, isSurplus (4) | 472/472 | Boolean restatement of the food band. | DS-ECO-9 | INTERNAL `engine-internal` — duplicate of `foodRecord.band` (data/bandLadders.js:91), which is shown. | none | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| foodSecurity | farming yield of the land | effectiveAgriculture (1) | 472/472 | The multiplier the land's farming capacity actually produced food at. | — | INTERNAL `engine-internal` — raw input to dailyProduction (shown); read by foodBalance.js:609. | none | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| foodSecurity | import share of need | importPct, importNote (2) | 472/472 | Percent of daily need imported, and its ready-made note. | DS-ECO-9 | INTERNAL `engine-internal` — percent restatement of `importDependency` (LIT). | writer change — a second import share (`foodRecord.normalImportPct`) is computed differently | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| foodSecurity | storage note | storageNote (1) | 472/472 | Prose form of months in store. | DS-ECO-9 | INTERNAL `engine-internal` — restatement of `storageMonths` (LIT). | none | GENERATION — `generators/foodGenerator.js` | CONFIRMED |
| institutions | arrived by cascade | cascadeAdded, cascadeBoost (2) | 19773/19773 | The institution was added on a second-chance cascade roll from a neighbouring tier, with its boost. | — | INTERNAL `engine-internal` — provenance trail (read by tierOutcomeApply to clear the borrowed seat). | none | GENERATION — `generators/steps/assembleInstitutions.js, generators/cascadeGenerator.js, generators/steps/coherenceRepairPass.js` | CONFIRMED |
| institutions | added by coherence repair | coherenceRepair (1) | 19773/19773 | The institution was inserted to repair a coherence requirement (e.g. a mill for a grain town). | DS-GEN-7 reads repairs via `generationRepairs` | INTERNAL `engine-internal` — provenance stamp; the repair itself is receipted separately. | none | GENERATION — `generators/steps/assembleInstitutions.js, generators/cascadeGenerator.js, generators/steps/coherenceRepairPass.js` | CONFIRMED |
| institutions | forced by DM toggle | forcedByToggle (1) | 19773/19773 | The DM's toggle demanded this institution. | — | INTERNAL `engine-internal` — provenance (generationOwnership.js:78,93). | none | GENERATION — `generators/steps/assembleInstitutions.js, generators/cascadeGenerator.js, generators/steps/coherenceRepairPass.js` | CONFIRMED |
| institutions | catalog placement rules | exclusiveGroupCoexists, forbiddenResources, forbiddenTradeRoutes, terrainAccess, terrainRequired, tradeRouteRequired (6) | 19773/19773 | Catalog eligibility constraints (allowed terrains/routes, forbidden resources, coexistence in an exclusive group) copied onto the row. | — | INTERNAL `engine-internal` — catalog rules consumed by the assembler/validator; the outcome (the roster) is shown. | none | GENERATION — `generators/steps/assembleInstitutions.js, generators/cascadeGenerator.js, generators/steps/coherenceRepairPass.js` | CONFIRMED |
| metrics | dependency/warning counts | dependencyCount, warningCount (2) | 472/472 | Number of dependencies and structural warnings. | DS-GEN-11 | INTERNAL `engine-internal` — counts of lists printed in their own right. | none | GENERATION — `generators/economy/viability.js` | CONFIRMED |
| resourceAnalysis | raw-resource activity | resourceChains (1) | 472/472 | Which raw-resource chains the terrain and resources support. | — | INTERNAL `engine-internal` — intermediate input to `exploitation` (LIT). | none | GENERATION — `generators/resourceGenerator.js` | CONFIRMED |
| resourceConditions | random-depletion eligibility | randomDepletionEligible (1) | 2364/2364 | Whether random depletion may strike it. | — | INTERNAL `engine-internal` — rng gate. | none | GENERATION — `domain/resourceSemantics.js, called at birth by generators/resourceGenerator.js` | CONFIRMED |

#### DEF — Defence & viability

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| flags | magic fills the void | magicFillsVoid (1) | 472/472 | Arcane power fills the gap left by absent faith and a weak economy | DS-DEF-9 (defense/viability) | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | magic militarized | magicMilitarized (1) | 472/472 | The military directs the town's arcane resources toward war | DS-DEF-9 (defense) · also DS-DEF-6 | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| isolationSupport | Magic-dependent | `magicDependent` (1) | 472/472 | Whether the settlement depends on magical transit to stay supplied. | new block in viability (nearest DS-DEF-9) | SAY: registered pending-surface §12 WRW-2 (ALREADY-REGISTERED). | none | GENERATION — `generators/isolationSupport.js:221-231` | CONFIRMED (register) |
| isolationSupport | Required capacity | `requiredCapacity` (1) | 472/472 | The support capacity the settlement would need to end its isolation. | new block in viability (nearest DS-DEF-9) | SAY: registered pending-surface §12 WRW-2 (ALREADY-REGISTERED). | none | GENERATION — `generators/isolationSupport.js:221-231` | CONFIRMED (register) |
| settlement | isolation support | isolationSupport (1) | 472/472 | How an isolated town is supplied (mundane or magical, redundant or load-bearing) | DS-DEF-9 (viability) · also overview | SAY (ALREADY-REGISTERED pending-surface) | none | GENERATION (generators/isolationGenerator.js / assembleSettlement.js) | PLAUSIBLE |
| defenseProfile | Supply-chain defence bonus | `chainModifiers` (1) | 472/472 | How much healthy military and economic supply chains add to the defence scores. | DS-DEF-2 (defense) | SAY-VIA-SPINE: healthy smithing/provisioning chains (DS-ECO-5) → `chainModifiers.{military,economic}` → `scores.military/economic` (shown). | none | GENERATION — `generators/defenseGenerator.js:646-649` | CONFIRMED |
| inst | criminal infrastructure present | hasThievesGuild, hasBlackMarket, hasSmuggling, hasGangInfra (4) | 944/944 | The town harbours an organised underworld: a thieves' guild chapter, a black market, a smuggling network or street gangs with front businesses. | DS-DEF-4 (criminal structure) / DS-ECO-6 (shadow economy) | SAY-VIA-SPINE — flag → `safetyProfile` crime descriptions / `criminalInstitutions[]` (safetyProfile.js reads hasThievesGuild/hasGangInfra/hasSmuggling) → DS-DEF-4. hasBlackMarket has no reader at all. | writer change (stale on advance) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |
| inst | arcane establishments present | hasAlchemist, hasMagesGuild, hasWizardTower (3) | 944/944 | The town has a working alchemist, a mages' guild or a wizard's tower. | DS-DEF-6 (supporting capabilities) / DS-DEF-9 | SAY-VIA-SPINE — flag → safetyProfile magical-defence/guard prose ("tower resources", "alchemical knowledge", safetyProfile.js:425,483) → DS-DEF-6. | writer change (stale on advance) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |
| inst | armed and fortified fixtures | hasFreeCompany, hasCharterHall, hasGates (3) | 944/944 | The town has a free-company hall, an adventurers' charter hall, or gated walls/palisade. | DS-DEF-5 (armed forces & fortifications) | SAY-VIA-SPINE — hasCharterHall → +10 military score (defenseGenerator.js:175) and the safety "charter hall handles threats" clause; hasGates → safetyProfile. hasFreeCompany has no reader. | writer change (stale on advance) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |
| traditions | Magical traditions under arms | `hasArcane`, `hasArcaneGuild`, `hasDivine`, `hasDruid`, `hasAlchemy` (5) | 2794/2794 | Which magical traditions (arcane, an arcane guild, divine, druidic, alchemical) contribute to the town's defence. | DS-DEF-6 (defense) | SAY-VIA-SPINE: institution presence → `traditions.has*` → `scores.magical` (shown). | none. The same object is written twice, on `defenseProfile.traditions` and on `defenseProfile.scores.traditions`. | GENERATION — `generators/defenseGenerator.js:467-470` | CONFIRMED |
| _isolationSupport | Config twin of the isolation finding | `magicDependent`, `requiredCapacity` (2) | 472/472 | The same two values as `isolationSupport`, stashed on the effective config for the validation and repair passes. | — | INTERNAL `engine-internal`: a pass-through copy. The customer fact is `settlement.isolationSupport` (registered pending-surface §12 WRW-2). If the owner wants it said there, this twin still stays internal. | none | GENERATION — `generators/isolationGenerator.js:41,140` | CONFIRMED |
| charter | Cascade provenance | `cascadeAdded`, `cascadeBoost` (2) | 205/205 | Whether the institution was a cascade second-chance addition, and the chance boost it used. | — | INTERNAL `engine-internal`: provenance, read by regen ownership (`domain/generationOwnership.js:119`). | none | GENERATION — `generators/cascadeGenerator.js:219` | CONFIRMED |
| garrison | Cascade provenance | `cascadeAdded`, `cascadeBoost` (2) | 353/353 | As on `charter`. | — | INTERNAL `engine-internal`: provenance. | none | GENERATION — `generators/cascadeGenerator.js:219` | CONFIRMED |
| gates | Gate cells | `cellA`, `cellB` (2) | 625/625 | The two map cells of the cheapest border crossing between two territories. | — | INTERNAL `engine-internal`: grid cell ids. | none | GENERATION — `domain/spatial/spatialDigest.js:814-817 (world build, not tick-keyed)` | CONFIRMED |
| magicDef | Cascade provenance | `cascadeAdded`, `cascadeBoost` (2) | 236/236 | As on `charter`. | — | INTERNAL `engine-internal`: provenance. | none | GENERATION — `generators/cascadeGenerator.js:219` | CONFIRMED |
| magicDef | Repair provenance | `coherenceRepair` (1) | 236/236 | The requirement type this institution was installed to repair. | — | INTERNAL `engine-internal`: a provenance trail. The repair is receipted in `generationRepairs` (DS-GEN-7). | none | GENERATION — `generators/steps/coherenceRepairPass.js:203` | CONFIRMED |
| magicDef | Catalog route ban | `forbiddenTradeRoutes` (1) | 236/236 | The trade-route kinds (isolated, port) where this institution may not appear. | — | INTERNAL `engine-internal`: a catalog eligibility rule copied onto the record by `...data`. | none | GENERATION — `generators/cascadeGenerator.js:211 (catalog spread)` | CONFIRMED |
| walls | Cascade provenance | `cascadeAdded`, `cascadeBoost` (2) | 471/471 | As on `charter`. | — | INTERNAL `engine-internal`: provenance. | none | GENERATION — `generators/cascadeGenerator.js:219` | CONFIRMED |
| walls | Repair provenance | `coherenceRepair` (1) | 471/471 | As on `magicDef`. | — | INTERNAL `engine-internal`: provenance. | none | GENERATION — `generators/steps/coherenceRepairPass.js:203` | CONFIRMED |

#### POW — Power & people

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| factionRelationships | GM advisory | `dmNote` (1) | 2554/2554 | A note to the DM. Either the garrison commander is a political actor who must be bought or worked around, or a prompt to decide which officials have arrangements with the criminal faction. | DS-POW-6 (power) | SAY: only when it is non-null (military competitive, or criminal capture not none/adversarial). READS `pair`, `type`, `captureState`. It is DM-private (`publicSafe` strips `dmNote`). | none | GENERATION — `generators/factionDynamics.js:319,400` | CONFIRMED |
| flags | the garrison as extraction apparatus | stateCrime, stateCrimeIntensity (2) | 472/472 | The garrison bleeds the town rather than protecting it, and how hard | DS-POW-5 (power) · also DS-DEF-4 | SAY: only when true. Intensity bands the verb. READS powerStructure.government, defenseProfile.institutions.garrison, compound.inst | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | crime is the government | crimeIsGovt (1) | 472/472 | The criminal network fills the authority vacuum left by a weak state | DS-POW-5 (power) · also DS-DEF-4 | SAY: only when true. READS deriveCriminalStructure, powerStructure | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | merchant army | merchantArmy (1) | 472/472 | Trade money pays for private security in place of a state military | DS-POW-5 (power) | SAY: only when true. READS compound.inst (guild/bank, mercenary) | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | merchant-criminal blur | merchantCriminalBlur (1) | 472/472 | The line between the merchant guild and the criminal network is academic | DS-POW-5 (power) | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | secular brutalism | secularBrutalism (1) | 472/472 | Rule by force with no moral counterweight | DS-POW-5 (power) | SAY: only when true. READS no church plus garrison | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| members | Charge to hold the seat | `factionGoal` (1) | 4339/4339 | For the top-ranked NPC under a constrained governing faction: "Maintain <faction>'s position against current pressure". | DS-POW-2 (power) | SAY: only when present. READS `governingName`, NPC `name`, `role`. | none | GENERATION — `generators/npcGenerator.js:1285` | CONFIRMED |
| npcs | Charge to hold the seat | `factionGoal` (1) | 7160/7160 | As on `members`. | DS-POW-2 (power) | SAY: same spec as `members.factionGoal`. | none | GENERATION — `generators/npcGenerator.js:1285` | CONFIRMED |
| presentation | First impression | `impression` (1) | 7732/7732 | How the NPC comes across ("Formally polite. Every sentence is measured before it leaves their mouth."). | power (the people) | SAY: on the NPC's line. The owner must first rule whether this falls under X-48 ("how an NPC looks or talks… is for the DM"). READS `name`, `role`. | none | GENERATION — `generators/npcGenerator.js:691-697` | CONFIRMED |
| presentation | How they deal | `behaviour` (1) | 7732/7732 | How the NPC treats strangers, as a sentence derived from `disposition` ("Answers questions without volunteering; watches who you talk to next."). | power (the people) | SAY: the dealing line, worth saying for every notable NPC. READS `disposition`. | none | GENERATION — `generators/npcGenerator.js:691-697` | CONFIRMED |
| campaignState | Regen locks | `locks` (1) | 208/208 | The user's "keep this" locks for regeneration. | — | INTERNAL `engine-internal`: editor and regen plumbing (`locksPreservation.js`). | none | GENERATION — `lib/saves.js:334 (save birth)` | CONFIRMED |
| corruptTies | Settlement guild name | `thievesGuild` (1) | 96/96 | The settlement's thieves'-guild name, copied onto each corrupt NPC. | — | INTERNAL `engine-internal`: a denormalized settlement label. `criminalInstitution` is the tie that gets printed (`npcComponents.jsx:399`), and the guild itself is in DS-DEF-4. | none | GENERATION — `generators/steps/corruptionPass.js:75` | CONFIRMED |
| currentTensions | Issue text | `specificIssue` (1) | 802/802 | The top viability issue behind a resource-scarcity tension. | — | INTERNAL `engine-internal`: the raw input that `description` (LIT, DS-GEN-1) already interpolates word for word. | none | GENERATION — `generators/historyGenerator.js:384` | CONFIRMED |
| members | Generation provenance | `generatedAs` (1) | 4339/4339 | Which generator path minted this NPC (faction_structural, instant, practitioner). | — | INTERNAL `engine-internal`: a provenance marker ("marker for migration / debugging"). | none | GENERATION — `generators/factionRoles.js:270` | CONFIRMED |
| members | Template selector | `settlementCondition` (1) | 4339/4339 | The settlement condition key (corruption, food crisis, stable…) that chose this NPC's structural template. | — | INTERNAL `engine-internal`: the selector index. The prose it selected (`structuralPosition`, `activeConstraint`) is what gets printed. | none | GENERATION — `generators/npcStructure.js:439` | CONFIRMED |
| members | Guild tie (artifact) | `thievesGuild` (1) | 4339/4339 | The settlement's thieves'-guild name copied onto a corrupt NPC's ties (from `corruptTies`, corpus path `.../members/element/dynamic`). | — | INTERNAL `engine-internal`: a denormalized copy of the settlement's criminal guild. The tie that gets printed is `corruptTies.criminalInstitution`. | none | GENERATION — `generators/steps/corruptionPass.js:75` | CONFIRMED |
| npcs | Generation provenance | `generatedAs` (1) | 7160/7160 | As on `members`. | — | INTERNAL `engine-internal`: provenance marker. | none | GENERATION — `generators/factionRoles.js:270` | CONFIRMED |
| npcs | Template selector | `settlementCondition` (1) | 7160/7160 | As on `members`. | — | INTERNAL `engine-internal`: selector index. | none | GENERATION — `generators/npcStructure.js:439` | CONFIRMED |
| npcs | Guild tie (artifact) | `thievesGuild` (1) | 7160/7160 | As on `members`. | — | INTERNAL `engine-internal`: denormalized copy. | none | GENERATION — `generators/steps/corruptionPass.js:75` | CONFIRMED |
| personality | Voice and tell | `speech`, `tell` (2) | 7732/7732 | How the NPC talks and their nervous habit. | — | INTERNAL `dark-by-construction`: owner ruling X-48 (no voice or tell anywhere; see `pdf/lib/viewModel.js:678`). | none | GENERATION — `generators/npcGenerator.js:137-143` | CONFIRMED |
| physical | Build and clothes | `build`, `clothes` (2) | 7732/7732 | The NPC's build and clothes. | — | INTERNAL `dark-by-construction`: owner ruling X-48 (2026-11-03): look, voice and tell are the DM's and are printed nowhere. Retiring the generator field is slotted to the roster car. | none | GENERATION — `generators/npcGenerator.js:144-149` | CONFIRMED |
| powerStructure | Projection stamps | `economyInputFingerprint`, `powerProjectionVersion` (2) | 472/472 | A fingerprint of the economy inputs and the projection version, used to decide re-projection. | — | INTERNAL `engine-internal`: cache and version stamps. | none | GENERATION — `generators/power/economyReconciliation.js:160-161` | CONFIRMED |
| publicLegitimacy | Band booleans | `isApproved`, `isTolerated` (2) | 472/472 | Whether the governing body's legitimacy is in the Approved or the Tolerated band. | — | INTERNAL `engine-internal`: boolean restatements of `label`, which is LIT in DS-POW-1. | none. The cuts are written three ways: `LEGITIMACY_CUTS` in one writer, hard-coded 60/45 in the other two. The values agree today. | GENERATION — `generators/factionDynamics.js:111-112 (birth; re-banded later by timeProgression.js:175)` | CONFIRMED |
| relationships | Prose selector | `archetypeKey`, `proseVariant` (2) | 8774/8774 | The archetype and variant index that chose the relationship's description and tension text. | — | INTERNAL `engine-internal`: ALREADY-REGISTERED. Kept as the register says. | none | GENERATION — `generators (register writer; NPC relationship generation)` | CONFIRMED (register) |

#### FTH — Faith

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| flags | crusader synthesis | crusaderSynthesis (1) | 472/472 | Garrison and church are one cause | DS-FTH-4 (faith) · also power | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | heresy suppression | heresySuppression, heresyIntensity (2) | 472/472 | The church actively suppresses arcane practice, and how hard | DS-FTH-4 (faith) | SAY: only when true. Intensity bands the verb | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | religious fraud | religiousFraud (1) | 472/472 | The church's moral authority is being worked for criminal profit | DS-FTH-4 (faith) | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| flags | mage theocracy | mageTheocracy (1) | 472/472 | Arcane institutions and the church are entwined as near-peers | DS-FTH-4 (faith) | SAY: only when true | writer change (see note) | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| inst | great religious houses present | hasCathedral, hasMonastery (2) | 944/944 | The town has a cathedral or a monastic house, not just a parish shrine. | DS-GEN-17 (company the town keeps) / DS-FTH-4 | SAY — extend DS-GEN-17: name the cathedral/monastery when present (hasChurch already read); READS compound.inst.hasChurch, the roster row's live status. | writer change (stale on advance) | GENERATION — `generators/priorityHelpers.js (via generators/economy/economicState.js, generators/safetyProfile.js)` | CONFIRMED |

#### HIS — History, relations & the map

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| byTerrain | what the road crosses | desert, grassland, mountain, wetland (4) | 1250/1250 | What kind of country the road to a neighbour mostly crosses, and so why it is hard or easy. | DS-REL-1 (neighbour network) | SAY — name the dominant class only when it carries >50% of the hop cost; READS route `between`, `cost`. | none | GENERATION — `domain/spatial/spatialDigest.js — built once at world canonize, not tick-keyed` | CONFIRMED |
| history | legacy annotations (container) | legacyAnnotations (1) | 472/472 | The list of past-to-present links | DS-GEN-16 (history) | SAY: the same fact as `annotation on legacyAnnotations`. Read only by tonightAtTheTable.js:159, which no customer surface wires | writer change (frozen at generation; see the legacyAnnotations row) | GENERATION (generators/steps/generateNarratives.js:77, narrativeGenerator.js:1017) | CONFIRMED |
| legacyAnnotations | past-to-present link prose | annotation (1) | 957/957 | A sentence tying a past event to the town today (for example, why legitimacy is still contested, or why arcane practice has an uneasy place in civic life) | DS-GEN-16 (history) | SAY: the top annotation (max 3), after the event it names. READS historicalEvents[].name/yearsAgo (LIT-NAME siblings), powerStructure.publicLegitimacy, economicState.prosperity/foodSecurity | writer change: it is frozen at generation against the step-14 economicState (historyCoherence.js:21-25) and never refreshed by the pulse, so its present-day half can contradict the live legitimacy/prosperity. Gate it on a live re-check, or re-derive | GENERATION (generators/legacyGenerator.js:242) | CONFIRMED |
| history | recent blow in living memory | siegeNarrative (1) | 472/472 | "The <recent political/disaster event> is still present in living memory: <first current tension>." Despite the name, it is not about sieges | DS-GEN-16 (history) · also DS-GEN-1 | SAY-VIA-SPINE: recent historicalEvent -> current tension. Both halves are already composed (DS-GEN-16, DS-GEN-1). The stored string is a frozen pairing of the two | none | GENERATION (generators/steps/generateNarratives.js:77, narrativeGenerator.js:1017) | CONFIRMED |
| distanceMatrix | route cost to each settlement | osr000 … osr015 (16) | 400/400 | Travel cost from this settlement to every other. | — | INTERNAL `engine-internal` — id-keyed digest; distances reach print through neighbour/route readers. | none | GENERATION — `domain/spatial/spatialDigest.js — built once at world canonize, not tick-keyed` | CONFIRMED |
| historicalEvents | event template id | templateType (1) | 2217/2217 | The id of the template that authored the event | — | INTERNAL `engine-internal`: a dedup key and arrival-scene memory key (historyGenerator.js:785, arrivalScene.js:185) | none | GENERATION (generators/historyGenerator.js:606) | CONFIRMED |
| segments | boundary cells | cellA, cellB (2) | 1250/1250 | Map cell ids on either side of a territorial crossing. | — | INTERNAL `engine-internal` — map ids. | none | GENERATION — `domain/spatial/spatialDigest.js — built once at world canonize (store/campaignSpatialCanonize.js), never recomputed, not tick-keyed` | CONFIRMED |
| segments | boundary terrain classes | terrainA, terrainB (2) | 1250/1250 | Terrain class of each boundary cell. | — | INTERNAL `engine-internal` — raw input to `byTerrain`. | none | GENERATION — `domain/spatial/spatialDigest.js — built once at world canonize (store/campaignSpatialCanonize.js), never recomputed, not tick-keyed` | CONFIRMED |
| stress | crisis chosen by the user | forcedByConfig (1) | 138/138 | The crisis was picked by the user, not rolled. | n/a | INTERNAL `engine-internal`: provenance stamp for ownership checks (sibling `source: 'forced'`); the user already knows they chose it. | none | GENERATION (generators/stressGenerator.js:57; generators/steps/resolveStress.js:66) | CONFIRMED |
| stress | history colour category | historyColour (1) | 138/138 | Catalog category (military/economic/demographic/political) copied from stressTypes. | n/a | INTERNAL `engine-internal`: classification tag copied verbatim from the catalog; history reads the catalog, not this copy. | none | GENERATION (generators/stressGenerator.js:57; generators/steps/resolveStress.js:66) | CONFIRMED |
| stressors | crisis chosen by the user | forcedByConfig (1) | 373/373 | As on stress. | n/a | INTERNAL `engine-internal`: provenance stamp. | none | GENERATION (key written only by generators/stressGenerator.js:57 / steps/resolveStress.js:66; carried onto the live stressor, no worldPulse writer sets it) | PLAUSIBLE (seed path not opened) |
| stressors | history colour category | historyColour (1) | 373/373 | As on stress. | n/a | INTERNAL `engine-internal`: catalog copy. | none | GENERATION (key written only by generators/stressGenerator.js:57 / steps/resolveStress.js:66; carried onto the live stressor, no worldPulse writer sets it) | PLAUSIBLE |
| tiers | neighbour depth | osr000 … osr015 (16) | 400/400 | How many hops away each other settlement is (1 = direct neighbour, capped at 3). | — | INTERNAL `engine-internal` — id-keyed digest. | none | GENERATION — `domain/spatial/spatialDigest.js — built once at world canonize, not tick-keyed` | CONFIRMED |

#### META — Config & provenance

| family (shape) | fact | keys (n) | rows | what it means | section / block | proposal | needs | origin (writer) | conf |
|---|---|---|---|---|---|---|---|---|---|
| config | isolation support receipt and magic-only flag | _isolationSupport, _magicTradeOnly (2) | 472/472 | How an isolated town keeps supplied, and whether its trade depends wholly on magic | — | INTERNAL `engine-internal`: the pipeline working copy, read by the validator/repair passes and stressorGates. Its customer twin is `isolationSupport on settlement`, which is already registered pending-surface | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| config | resolved population (copy) | _population (1) | 472/472 | The population at the stress step | — | INTERNAL `engine-internal`: a pipeline copy. settlement.population is LIT | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| config | route intent | _routeIntent (1) | 472/472 | Whether the trade route was rolled at random or chosen by the user | — | INTERNAL `engine-internal`: provenance of the user's choice | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| config | culture profile key | cultureProfileKey (1) | 472/472 | Resolved culture key | — | INTERNAL (ALREADY-REGISTERED engine-internal) | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| config | intended stress types | intendedStressTypes (1) | 472/472 | The stresses the user asked for, as against the ones applied | — | INTERNAL `engine-internal`: user-intent provenance for generation receipts and declined-stress traces. Not a world fact | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| config | custom resource definition identities | nearbyResourceDefinitions, nearbyResourceDefinitionsDepleted (2) | 472/472 | refId/localUid identity sidecars for custom nearby resources | — | INTERNAL `engine-internal`: content identity. The names are LIT via nearbyResources/nearbyResourcesCustom | none | GENERATION (generators/steps/* (resolveConfig, resolveStress, resolveResources), isolationGenerator.js) | CONFIRMED |
| contentBoundaries | content topic permissions | hard_drugs, human_trafficking, slavery, torture (4) | 472/472 | Whether the user allowed these topics in generated content | — | INTERNAL `engine-internal`: a generation content gate set in ConfigurationPanel. It is not a fact about the world | none | GENERATION (domain/generationContentProfile.js (birth config)) | CONFIRMED |
| facets | clandestine/subterranean facet | clandestine, subterranean (2) | 40/40 | A classification saying the institution is covert and/or underground | — | INTERNAL `engine-internal`: catalog classification read by the sim. The LIT desc/tags already say "tunnels beneath the city" | none | GENERATION (generators institution roll from data/institutionalCatalog.js) | CONFIRMED |
| flags | any compound situation | anyActive (1) | 472/472 | OR of the flags below | — | INTERNAL `engine-internal`: a derived gate (the DS-REL-2 flagDriven lens already reads it indirectly) | none | GENERATION (generators/safetyProfile.js:724 / priorityHelpers.js:513) | CONFIRMED |
| priorities | religion priority (copy) | religion (1) | 472/472 | Same slider value | — | INTERNAL `engine-internal`: a copy of the LIT config.priorityReligion | none | GENERATION (generators/economy/economicState.js:837) | CONFIRMED |
| raw | religion priority (copy) | religion (1) | 944/944 | The religion priority slider value | — | INTERNAL `engine-internal`: a raw intermediate copy of the LIT config.priorityReligion. The computed religionInfluence is what gets used | none | GENERATION (generators/priorityHelpers.js:446) | CONFIRMED |

### 2.2 The owner's three findings (all GENERATION, so in scope)

| finding | family · key | rows | what is wrong | proposal | needs |
|---|---|---|---|---|---|
| **Migration direction decided three ways** | `stress[]` (`mass_migration`) → new key `direction` | every world with a `mass_migration` crisis | The crisis summary (stressNarrative.js:162) and the pressure/Tonight line (narrativeText.js:176) say ARRIVALS. `buildMigrationNarrative` (power/governanceNarrative.js:592-602) says DEPARTURES when `economyOutput < 50`. The §934.101 ruling fixed narrativeText and missed this twin. | **SAY** as ONE declared fact: `stress[].direction ∈ {influx, exodus}`, written once in `buildStressEntry` (stressGenerator.js:46-58) and defaulting to `influx` under §934.101. Every surface reads it: the crisis summary, the pressure line, the Power vignette and its stability label, the spine strain phrase, the `mass_migration` secret pool (stressInstitutionEffects.js:398 is a departures line inside an arrivals pool, so Tonight can contradict itself), `viabilityNote`, the food multiplier, and DS-POP-1. Under the census law this homes atom 9, "migration direction", which has no reader today (DESIGN_POOL_CENSUS §1). | new record field + writer change + 8 reader sites |
| **"economy economy"** | `economicState.economicComplexity` → `src/pdf/lib/headlines.js:86` | every PDF whose complexity label ends in "economy" | `${prosperity}, ${complexity} economy`, where complexity can already be "Diversified market economy" or "Subsistence — survival economy" (economy/prosperity.js:322-334). The headline prints "…market economy economy." | Wording fix: drop the suffix when the label already ends in "economy", or read a noun-free complexity band. | PDF wording only, moves no record |
| **"(1 crisis chip)"** | `stress[]` count → `src/pdf/lib/headlines.js:27` | every PDF with a crisis | The name of an on-screen widget ("crisis chip") and a raw count printed in prose: "under active strain (1 crisis chip)". | Name the crisis instead: "under the strain of {stress[0].label}", plus "and N more" in words. | PDF wording only |


#### The migration direction (owner finding 1)

**The finding holds.** Three code sites decide which way a `mass_migration` crisis runs. **All three are GENERATION-origin:** each writer is under src/generators/** and runs in the birth pipeline, so this fix is not deferred by FPZ. None of them reads a stored fact. Two always say ARRIVALS, and one says DEPARTURES whenever the economy is weak.

| # | site (file:line) | surface | what decides the direction | says | origin |
|---|---|---|---|---|---|
| 1 | src/generators/stressNarrative.js:162-168 (`mass_migration: (name) =>`) -> `stress[].summary` | crisis text: the Overview crisis banner (DS-STR-1) | **nothing**. The text is fixed. An old `economyOutput >= 50` guard always evaluated true (the comment at :156-161 explains why) and data-schema.6 removed it. | ARRIVALS, always ("receiving more people than its infrastructure was built for") | GENERATION (src/generators/stressNarrative.js, rendered into stress[].summary at birth by stressGenerator/assembleSettlement) |
| 2 | src/generators/narrativeText.js:176-191 (`mass_migration: (r) =>`, the PRESSURE_SENTENCES closure) -> `settlement.pressureSentence` (assembleSettlement.js:223) | the pressure line. It is the Tonight sheet's `opening` when no crisis line exists (tonightSheet.js:135), and it also shows in the Overview/Summary header and QuickInspector. Its sibling is the spine strain phrase in src/data/stressorSpinePhrases.js:109-112 ("an arrival of people it was never built to hold"), read through simulationSpine.js:387 `strainedBy`. | it branches on `r.compound.economyOutput >= 50` (that is `economicState.compound.economyOutput`, narrativeGenerator.js:510), but **both** branches are arrivals. Chair ruling 2 (2026-10-30, ODQ §934.101, comment at :179-182) rewrote the weak-economy branch as "an influx it cannot carry". | ARRIVALS on both branches | GENERATION (src/generators/narrativeText.js via narrativeGenerator.generatePressureSentence, called at src/generators/steps/assembleSettlement.js:223) |
| 3 | src/generators/power/governanceNarrative.js:592-602 (`buildMigrationNarrative`). It is called at :683, selected at :785-787 as the primary stress, and becomes `powerStructure.recentConflict` through rulingStructure.js:702 | Power tab vignette (DS-POW-2 `recentConflict`). It also feeds `recentConflict` into the narrative context (narrativeGenerator.js:515). | `instFlags.economyOutput >= 50`: the institution-composite economy score at power-generation time, defaulting to 50 when absent. | >=50: ARRIVALS. **<50: DEPARTURES** ("Three families left this week…"). The §934.101 ruling fixed site 2 and missed this twin. | GENERATION (src/generators/power/governanceNarrative.js via rulingStructure.js:702 in the power step of generation) |

Other places that hedge or contradict (not among the three, but they would read the same fact):
- governanceNarrative.js:316, stability label "Strained (people arriving or leaving)": hedges between both directions.
- src/data/stressTypes.js:166 and src/data/stressTypesMeta.js:98, `viabilityNote` "Immigration: … Emigration: …": hedges between both directions.
- src/data/stressInstitutionEffects.js:384-399, the secret pool for `mass_migration`. Three entries are about arrivals (newcomer papers, newcomer camp, a newcomer with a false history). One, at :398, is about **departures** ("emptied properties of those who fled… some of the departed intend to return"). The Tonight sheet's people block draws from this pool (tonightSheet.js:237), so Tonight can contradict itself.
- src/generators/foodGenerator.js:293 (consumption x1.15) and src/generators/economy/foodBalance.js:230 build arrivals into the mechanics.

**The one source.** Declare a single record key, **`direction`** ∈ {`influx`, `exodus`}, on the `mass_migration` entry of `settlement.stress[]` and copy it to the live `worldState.stressors[]` row.
- **At generation:** write it once in `buildStressEntry` (src/generators/stressGenerator.js:46-58). There is no migration ledger at generation time, and the mechanics already assume influx. Under §934.101 the default is `influx`. A future `exodus` must be a declared draw at this one site, not a re-derivation from economyOutput at each surface.
- **In a campaign:** where the ledger is lit, re-derive the same key from the **sign of the settlement's net flow in `worldState.spatialLedgers.migration`** (arrivals into sid minus departures from sid over the window; demographicsMigration.js:28 keeps the conservation identity). Write it back onto the stressor row, so every surface still reads one key.

**Surfaces that should read it, and stop branching on their own:**
1. stressNarrative.js:162 (crisis summary)
2. narrativeText.js:176 (pressureSentence / Tonight opening)
3. governanceNarrative.js:592 (Power vignette) and :316 (stability label)
4. stressorSpinePhrases.js:109 (spine strain phrase)
5. stressInstitutionEffects.js:384 (filter the secret pool by direction)
6. stressTypes.js / stressTypesMeta.js `viabilityNote` (print one half)
7. foodGenerator.js:293 and foodBalance.js:230 (apply the multiplier only on influx)
8. DS-POP-1 (Population), which already names `spatialLedgers.migration` as its movement source: it should cite the same key, so the Population tab and the crisis banner cannot disagree.

**NEEDS:** a writer change (a new record field, `stress[].direction`) plus reader changes at the sites above. Confidence: CONFIRMED. I read all three writers and every hedge site listed.

## 3. THE FAMILY TABLE — SIMULATION (DEFERRED, after FPZ: the owner's word)

These are listed with origin and writer only. They have no proposal and no lane. The research seats' pre-scope verdicts are kept in the scratch tables (not committed) for the post-FPZ wave. Where a seat recorded its pre-scope verdict, it was SAY 42 · SPINE 46 · INTERNAL 39 identities; 167 identities carry none (the seat marked them DEFERRED before judging). They are not a ruling.

### 3.1 The war-pulse block (the brief's "41"), kept whole and DEFERRED

I measured **90 identities over 38 distinct keys**, not 41: `pulseRecord` and `pulseHistory` carry the same 30 keys, `warTerminationReads` carries 17 of them again, and `causeLifecycleEvents`, `homeFrontComponents`, `resolutionContext`, `counterforce` and `economyDrift` add the rest. Every writer is in the advance loop: worldPulse/pulseKernel.js, warTermination.js, warCosts.js, causeLifecycle.js. Two facts are worth carrying to the post-FPZ wave:
- The war-termination bands were meant to become story fields through WR-9, which was never built (subsystemRowsWar.js:546).
- `booksReason` is the unredacted twin of `booksPublicReason`: it can name a foreign patron, so it must stay dark.

| family (shape) | fact | keys (n) | rows | origin (writer) |
|---|---|---|---|---|
| pulseHistory | pulse committed flag | committed (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | per-settlement clock log | timeTicks (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | corruption exposed / reformed | corruptionEvents (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | faction captured by the underworld | factionCaptureEvents (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | crisis passes into memory | graduatedStressors (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | count of state-only outcomes | mechanicalOutcomeCount (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | rumor seeds from silent outcomes | mechanicalRumorSeeds (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | cause-lifecycle transition + the cause it replaced | causeLifecycleEvents, priorCause (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | cause conjunction key | conjunctionKey (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | home-front damage: hands, stores, markets | hands, markets, stores (3) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | why the war started, and whether that still holds | causeBand, causeState (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | price of fighting on vs price of stopping | costToContinueBand, costToStopBand (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | war momentum and whether a new ruler broke it | momentumBand, momentumBroken (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | attacker's believed vs true balance of force | believedBalanceBand, truthBalanceBand (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | defender's believed vs true balance of force | opponentBelievedBalanceBand, opponentTruthBalanceBand (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | how long the home front has borne it | homeFrontDurationBand (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | ruling-seat signatures | authoritySignature, opponentAuthoritySignature (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | ruler's lawfulness and morality as weighed in the war | rulerLawfulnessBand, rulerMoralityBand (2) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | which way the ruler's own interest leans | booksDirection (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseHistory | the ruler's private reason | booksReason (1) | 4863/4863 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | pulse committed flag | committed (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | per-settlement clock log | timeTicks (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | corruption exposed / reformed | corruptionEvents (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | faction captured by the underworld | factionCaptureEvents (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | crisis passes into memory | graduatedStressors (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | count of state-only outcomes | mechanicalOutcomeCount (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | rumor seeds from silent outcomes | mechanicalRumorSeeds (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | cause-lifecycle transition + the cause it replaced | causeLifecycleEvents, priorCause (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | cause conjunction key | conjunctionKey (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | home-front damage: hands, stores, markets | hands, markets, stores (3) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | why the war started, and whether that still holds | causeBand, causeState (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | price of fighting on vs price of stopping | costToContinueBand, costToStopBand (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | war momentum and whether a new ruler broke it | momentumBand, momentumBroken (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | attacker's believed vs true balance of force | believedBalanceBand, truthBalanceBand (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | defender's believed vs true balance of force | opponentBelievedBalanceBand, opponentTruthBalanceBand (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | how long the home front has borne it | homeFrontDurationBand (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | ruling-seat signatures | authoritySignature, opponentAuthoritySignature (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | ruler's lawfulness and morality as weighed in the war | rulerLawfulnessBand, rulerMoralityBand (2) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | which way the ruler's own interest leans | booksDirection (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| pulseRecord | the ruler's private reason | booksReason (1) | 276/276 | SIMULATION (pulseKernel.js:1897; war rows warTermination.js:883, warCosts.js:541; cause rows causeLifecycle.js:288) |
| warTerminationReads | why the war started, and whether that still holds | causeBand, causeState (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | price of fighting on vs price of stopping | costToContinueBand, costToStopBand (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | war momentum and whether a new ruler broke it | momentumBand, momentumBroken (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | attacker's believed vs true balance of force | believedBalanceBand, truthBalanceBand (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | defender's believed vs true balance of force | opponentBelievedBalanceBand, opponentTruthBalanceBand (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | how long the home front has borne it | homeFrontDurationBand (1) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | ruling-seat signatures | authoritySignature, opponentAuthoritySignature (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | ruler's lawfulness and morality as weighed in the war | rulerLawfulnessBand, rulerMoralityBand (2) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | which way the ruler's own interest leans | booksDirection (1) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| warTerminationReads | the ruler's private reason | booksReason (1) | 85/85 | SIMULATION (worldPulse/warTermination.js:883) |
| causeLifecycleEvents | the cause it replaced | priorCause (1) | 69/69 | SIMULATION (worldPulse/pulseKernel.js:1938 <- causeLifecycle.js:270) |
| causeLifecycleEvents | cause conjunction key | conjunctionKey (1) | 69/69 | SIMULATION (worldPulse/pulseKernel.js:1938 <- causeLifecycle.js:270) |
| homeFrontComponents | home-front damage: hands, stores, markets | hands, markets, stores (3) | 170/170 | SIMULATION (worldPulse/warCosts.js:495-541) |
| resolutionContext | counterforce score at resolution | counterforceScore (1) | 80/80 | SIMULATION (worldPulse/stressors.js:175 / stressorsCore.js:548) |
| resolutionContext | what led recovery, and what dragged | leadingSources, synergyCompanions (2) | 80/80 | SIMULATION (worldPulse/stressors.js:175 / stressorsCore.js:548) |
| counterforce | counterforce tuning terms | decayMultiplier, resolutionDelta (2) | 269/269 | SIMULATION (worldPulse/stressors.js:380) |
| economyDrift | how long the boom/slump has run | streak (1) | 164/164 | SIMULATION (worldPulse/institutionLifecycle.js:700-723) |
| economyDrift | evaluation ticks | lastCandidateTick, lastEvaluatedTick (2) | 164/164 | SIMULATION (worldPulse/institutionLifecycle.js:700-723) |

### 3.2 The rest of the SIMULATION partition (204 identities, DEFERRED)

| family (shape) | fact | keys (n) | rows | origin (writer) |
|---|---|---|---|---|
| _config | peak grade (mirror) | peakTier (1) | 512/512 | SIMULATION (domain/worldPulse/settlementLifecycleKernel.js:725) |
| _timePressure | a faction's drained wealth and public trust | wealth, publicTrust (2) | 528/528 | SIMULATION (domain/timeProgression.js:311-324, the per-tick advance) |
| autoApplied | applied headline | appliedHeadline (1) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| autoApplied | conflict tags | exclusiveTags (1) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| autoApplied | stressor evidence trail (twin) | gateEvidence, pressureEvidence, probabilityMult, sourceNotes, originVariant, originEvidence, sourceNote, interpretedAtTick (8) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| autoApplied | organic pressure (twin) | pressureKind, pressureScore (2) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| autoApplied | direction ids (twin) | fromSaveId, toSaveId (2) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| autoApplied | war home cost (twin) | warEconomy, sent (2) | 700/700 | SIMULATION (domain/worldPulse/applyWorldPulse.js / pulseKernel.js:2976) |
| candidates | applied headline | appliedHeadline (1) | 3618/3618 | SIMULATION (domain/worldPulse/pulseOutcomePartition.js:102) |
| candidates | institution-gap chain context | chainContext, downstreamOf, gapKind (3) | 3618/3618 | SIMULATION (domain/worldPulse/pulseOutcomePartition.js:102) |
| candidates | conflict tags | exclusiveTags (1) | 3618/3618 | SIMULATION (domain/worldPulse/pulseOutcomePartition.js:102) |
| candidates | un-rolled faction patch | factionPatch, legitimacyClaim, recentAction (3) | 3618/3618 | SIMULATION (domain/worldPulse/pulseOutcomePartition.js:102) |
| changes | route access after a cut or restore | routeAccess (1) | 103/103 | SIMULATION (domain/region/deriveRegionalState.js:385 (route-cut event diff)) |
| config | peak grade | peakTier (1) | 472/472 | SIMULATION (domain/worldPulse/settlementLifecycleKernel.js:717) |
| conflictResolution | Scheduler trail | `deterministic`, `exclusiveTags` (2) | 9325/9325 | SIMULATION — `domain/worldPulse/candidateEvents.js:459; pulseOutcomePartition.js:54` |
| contests | Open or one-sided rivalry | `knownToBoth` (1) | 432/432 | SIMULATION — `domain/worldPulse/npcLadderState.js:896` |
| corruptionProfile | Corrupted flag mirror | `corrupted` (1) | 7250/7250 | SIMULATION — `domain/worldPulse/npcAgency.js:539` |
| depletedSince | depletion tick per resource | coal_deposits, gemstone_deposits, iron_deposits (3) | 450/450 | SIMULATION — `domain/worldPulse/resourceDynamicsKernel.js` |
| deposits | deposit magnitude | mag (1) | 1250/1250 | SIMULATION — `domain/worldPulse/npcGrowthKernel.js` |
| entrepots | through-traffic | centrality (1) | 300/300 | SIMULATION — `domain/spatial/entrepots.js stepEntrepot — tick-keyed EWMA` |
| factionPairStates | Pair incidents | `incidents` (1) | 6303/6303 | SIMULATION — `domain/worldPulse/factionPairLedger.js:172` |
| factionStates | Claim to rule | `legitimacyClaim` (1) | 2400/2400 | SIMULATION — `domain/worldPulse/factionCompetition.js:296-317` |
| factionStates | Power bases | `powerBases` (1) | 2400/2400 | SIMULATION — `domain/worldPulse/factionCompetition.js:296-317` |
| factionStates | Laws it wants | `lawPreferences` (1) | 2400/2400 | SIMULATION — `domain/worldPulse/factionCompetition.js:296-317` |
| factionStates | Latest move | `recentAction` (1) | 2400/2400 | SIMULATION — `domain/worldPulse/factionCompetition.js:296-317` |
| factionStates | Institutions suppressed | `suppressedInstitutions` (1) | 2400/2400 | SIMULATION — `domain/worldPulse/factionCompetition.js:296-317` |
| factions | Time-pressure tally | `_timePressure`, `publicTrust`, `wealth` (3) | 8720/8720 | SIMULATION — `domain/timeProgression.js:324` |
| factions | Last pulse touch | `updatedByPulse` (1) | 8720/8720 | SIMULATION — `domain/worldPulse/factionCompetition.js:655` |
| flowProfile | intelligence flow | information (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js` |
| flowProfile | tribute flow | tribute (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js` |
| gateEvidence | spawn-gate multiplier and notes | probabilityMult, sourceNotes (2) | 1134/1134 | SIMULATION (domain/worldPulse/stressors.js:539) |
| internalSeats | Lieutenant and protégé | `lieutenant_operator`, `agent_protege` (2) | 4800/4800 | SIMULATION — `domain/worldPulse/factionCompetition.js:539-546` |
| leaderNpcIds | Bloc leader snapshot | `arcane_orders`, `craft_guilds`, `elder_council`, `elected_reeve`, `feudal_stewardship`, `landed_gentry`, `manor_household`, `merchant_guilds`, `military_guard`, `monster_hunters_adventurers`, `noble_families`, `religious_authorities`, `thieves_guild`, `town_council` (14) | 1210/1210 | SIMULATION — `domain/worldPulse/settlementPolitics.js:905` |
| majors | Done-form headline | `appliedHeadline` (1) | 56/56 | SIMULATION — `domain/worldPulse/candidateEvents.js (pulse majors)` |
| majors | Faction patch | `factionPatch`, `legitimacyClaim`, `recentAction` (3) | 56/56 | SIMULATION — `domain/worldPulse/candidateEvents.js (pulse majors)` |
| majors | Scheduler tags | `exclusiveTags` (1) | 56/56 | SIMULATION — `domain/worldPulse/candidateEvents.js (pulse majors)` |
| metadata | stressor-birth evidence trail | gateEvidence, pressureEvidence, probabilityMult, sourceNotes, originVariant, originEvidence, sourceNote, interpretedAtTick (8) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | organic-pressure kind and score | pressureKind, pressureScore (2) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | institution-build gap scoring | affinity, gapKind, priorBuilds, streak (4) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | resource state transition | fromState, toState (2) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | resource recovery nature | resourceTaxonomy, renewability, recoveryMode (3) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | depletion rng eligibility | randomDepletionEligible (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | event direction ids | fromSaveId, toSaveId (2) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | peace-suit ruling read (container) | warRulingRead (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | court's books direction | booksDirection (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | war cause state | causeState (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | momentum broken | momentumBroken (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | private books reason | booksReason (1) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | ruler signature and character bands | authoritySignature, rulerLawfulnessBand, rulerMoralityBand (3) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| metadata | war home cost | warEconomy, sent (2) | 12290/12290 | SIMULATION (domain/worldPulse/* (stressors.js, institutionLifecycle.js, tierResourceDynamics.js, candidateEvents.js, settlementStrategy.js, warHomeCosts.js)) |
| missions | Dispatch roll inputs | `escort01`, `riskTolerance01`, `knownDangerAtDispatch` (3) | 133/133 | SIMULATION — `domain/worldPulse/roadsKernel.js:1036-1043` |
| missions | Sea legs | `legModes` (1) | 133/133 | SIMULATION — `domain/worldPulse/roadsKernel.js:1036-1043` |
| missions | Trip bookkeeping | `startedYear`, `stayWeeks`, `waitReceipted` (3) | 133/133 | SIMULATION — `domain/worldPulse/roadsKernel.js:1036-1043` |
| missions | Trapped by siege | `trappedBySiege` (1) | 133/133 | SIMULATION — `domain/worldPulse/roadsKernel.js:1036-1043` |
| npcGrowth | Trait candidate "proud" | `proud` (1) | 454/454 | SIMULATION — `domain/worldPulse/npcGrowthKernel.js:492` |
| npcStates | Last struck by | `lastTargetedBy` (1) | 3625/3625 | SIMULATION — `domain/worldPulse/npcAgency.js:535,951` |
| npcStates | Last struck when | `lastTargetedTick` (1) | 3625/3625 | SIMULATION — `domain/worldPulse/npcAgency.js:535,951` |
| npcStates | Pressure point | `weakness` (1) | 3625/3625 | SIMULATION — `domain/worldPulse/npcAgency.js:535,951` |
| npcs | Compromise lifecycle ticks | `originTick`, `historicizedTick`, `exposedTick` (3) | 7160/7160 | SIMULATION — `domain/worldPulse/causeLifecycle.js:275-285` |
| npcs | Whereabouts place and errand (artifact) | `placeId`, `purposeKind` (2) | 7160/7160 | SIMULATION — `domain/worldPulse/roadsKernel.js:1075` |
| originContext | interpretation tick | interpretedAtTick (1) | 238/238 | SIMULATION (domain/worldPulse/stressors.js:493) |
| originEvidence | origin interpretation stamp and note | interpretedAtTick, sourceNote (2) | 184/184 | SIMULATION (domain/worldPulse/stressors.js:546) |
| outcome | applied headline | appliedHeadline (1) | 758/758 | SIMULATION (domain/worldPulse/applyWorldPulse.js:380) |
| outcome | pending faction patch | factionPatch, legitimacyClaim, recentAction (3) | 758/758 | SIMULATION (domain/worldPulse/applyWorldPulse.js:380) |
| plan | why this answer was chosen | because (1) | 800/800 | SIMULATION (domain/worldPulse/demographicsPlans.js) |
| plan | stores raised against the cost | provision, startupCost (2) | 800/800 | SIMULATION (domain/worldPulse/demographicsPlans.js) |
| plan | episode key | episode (1) | 800/800 | SIMULATION (domain/worldPulse/demographicsPlans.js) |
| plan | underway tick | underwayTick (1) | 800/800 | SIMULATION (domain/worldPulse/demographicsPlans.js) |
| pressureEvidence | pressure notes | sourceNotes (1) | 1134/1134 | SIMULATION (domain/worldPulse/stressors.js:533) |
| proud | What made them so | `deposits` (1) | 908/908 | SIMULATION — `domain/worldPulse/npcGrowthKernel.js:492-499` |
| proud | Decay anchor | `lastDepositTick` (1) | 908/908 | SIMULATION — `domain/worldPulse/npcGrowthKernel.js:492-499` |
| proud | Mint tick | `mintedAt` (1) | 908/908 | SIMULATION — `domain/worldPulse/npcGrowthKernel.js:492-499` |
| provenance | mechanical receipt class | receiptClass (1) | 3798/3798 | SIMULATION (domain/worldPulse/provenanceKernel.js) |
| reasons | casus belli on a pair | grievance, opportunism, resource_pressure (3) | 4408/4408 | SIMULATION (domain/worldPulse/warReasons.js:253) |
| reasons | casus pacis on a pair | belief_convergence, economic_strangulation, hopelessness (3) | 4408/4408 | SIMULATION (domain/worldPulse/warReasons.js:253) |
| relationshipMemory | Power gap | `asymmetry` (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js:453-470` |
| relationshipMemory | What flows | `flowProfile` (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js:453-470` |
| relationshipMemory | Remembered incidents | `recentMemory` (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js:453-470` |
| relationshipMemory | Refresh stamp | `updatedAtTick` (1) | 2480/2480 | SIMULATION — `domain/worldPulse/relationshipMemory.js:453-470` |
| resourceDynamics | depletion dwell timers | depletedSince (1) | 800/800 | SIMULATION — `domain/worldPulse/resourceDynamicsKernel.js` |
| resourceDynamics | discovery integrator | discoveryAcc (1) | 800/800 | SIMULATION — `domain/worldPulse/resourceDynamicsKernel.js` |
| resourceTaxonomy | can it come back | renewability, recoveryMode (2) | 168/168 | SIMULATION — `domain/worldPulse/resourceTaxonomy.js (via tierResourceDynamics.js / resourceDynamicsKernel.js)` |
| resourceTaxonomy | random-depletion eligibility | randomDepletionEligible (1) | 168/168 | SIMULATION — `domain/worldPulse/resourceTaxonomy.js (via tierResourceDynamics.js / resourceDynamicsKernel.js)` |
| rivalPatch | Target stamp in patch | `lastTargetedBy`, `lastTargetedTick` (2) | 176/176 | SIMULATION — `domain/worldPulse/npcAgency.js:945-951` |
| roads | per-NPC travel year | cadence (1) | 280/280 | SIMULATION — `domain/worldPulse/roadsKernel.js` |
| selected | applied headline | appliedHeadline (1) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | conflict-resolution tags | exclusiveTags (1) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | stressor evidence trail (twin) | gateEvidence, pressureEvidence, probabilityMult, sourceNotes, originVariant, originEvidence, sourceNote, interpretedAtTick (8) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | organic pressure (twin) | pressureKind, pressureScore (2) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | direction ids (twin) | fromSaveId, toSaveId (2) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | faction move and its new claim | factionPatch, legitimacyClaim, recentAction (3) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| selected | war home cost (twin) | warEconomy, sent (2) | 539/539 | SIMULATION (domain/worldPulse/pulseKernel.js:2974) |
| settlement | urban fabric mirror | urbanFabric (1) | 472/472 | SIMULATION (domain/worldPulse/urbanFabricKernel.js:52) |
| settlementTickStates | tick bookkeeping | clockStages, economyDrift, resourceDynamics, tierDrift (4) | 400/400 | SIMULATION — `domain/timeProgression.js, domain/worldPulse/pulseKernel.js, tierResourceDynamics.js, resourceDynamicsKernel.js — tick bookkeeping` |
| site | landform | landform (1) | 312/312 | SIMULATION — `domain/worldPulse/settlementLifecycleKernel.js` |
| steadings | parent's backing | backing01 (1) | 444/444 | SIMULATION — `domain/worldPulse/settlementLifecycleKernel.js` |
| steadings | founding date | foundedTick (1) | 444/444 | SIMULATION — `domain/worldPulse/settlementLifecycleKernel.js` |
| steadings | settlers drawn | inflow (1) | 444/444 | SIMULATION — `domain/worldPulse/settlementLifecycleKernel.js` |
| steadings | the chosen ground | site (1) | 444/444 | SIMULATION — `domain/worldPulse/settlementLifecycleKernel.js` |
| stockpile | seasonal swing | seasonalSwingPct (1) | 384/384 | none |
| stockpile | reserve tithe | tithed (1) | 384/384 | SIMULATION — `domain/worldPulse/foodStockpile.js` |
| stocks | district prominence in stone | craft, industrial, merchant, noble, religious, residential (6) | 6263/6263 | SIMULATION — `domain/worldPulse/urbanFabricKernel.js` |
| traditions | Last kept | `lastHeldYear` (1) | 2794/2794 | SIMULATION — `domain/worldPulse/traditionsKernel.js:801` |
| traditions | Fabric sensor | `fabricLed` (1) | 2794/2794 | SIMULATION — `domain/traditions/politics.js:401 (yearly advance)` |
| traditions | Keeper kind | `ownerKind` (1) | 2794/2794 | SIMULATION — `domain/traditions/politics.js:193 (yearly advance)` |
| urbanFabric | the leading quarter | led (1) | 592/592 | SIMULATION — `domain/worldPulse/urbanFabricKernel.js` |
| urbanFabric | ledger copies of mirrored facts | rebirths, scars, stocks (3) | 592/592 | SIMULATION — `domain/worldPulse/urbanFabricKernel.js` |
| urbanFabric | last seen tick | seenTick (1) | 592/592 | SIMULATION — `domain/worldPulse/urbanFabricKernel.js` |
| whereabouts | Where and why away | `placeId`, `purposeKind` (2) | 68/68 | SIMULATION — `domain/worldPulse/roadsKernel.js:1072-1084` |

## 4. THE LANE PLAN (GENERATION partition only)

Five authoring lanes cut by SECTION, plus one register lane. They run in parallel from the rung-2 landing tip; no two lanes author the same block. "Facts" are the SAY and SAY-VIA-SPINE rows of §2.

| lane | section | families | facts (ids) | blocks authored or extended | writer changes it owns |
|---|---|---|---|---|---|
| **W1 ECO** | economy & supply | inst (commercial), compound, foodSecurity, foodRecord, activeChains, resourceAnalysis, resourceConditions, reasons (imports), institutions (facet), flags (arcane black market, theocratic economy) | 14 (36) | extend DS-ECO-9 (diet, how the need is met, what the famine broke), DS-ECO-8 (spine: food → prosperity), DS-ECO-11 (exhausted resources), DS-ECO-12 (the 13 import-reason keys as one clause per critical import; spine: religion → income), DS-ECO-6 (facet, arcane black market, theocratic economy), DS-SUP-2 (spine: impaired upstream), DS-GEN-13 (spine: market-class presence) | `compound.inst` stale on advance (economicState.js:52-59) → re-derive from the live roster. `foodSecurity.importPct` vs `foodRecord.normalImportPct` use two formulas, and the food-source count is computed two ways (counts Trade) → one writer each. |
| **W2 DEF** | defence & viability | inst (criminal, armed, arcane), traditions, defenseProfile, isolationSupport ×2, settlement.isolationSupport, flags (magic fills the void, magic militarized) | 10 (21) | DS-DEF-4, DS-DEF-5, DS-DEF-6, DS-DEF-2 (all spine), DS-DEF-9. **New block in `viability`** for isolation support: it strikes the three pending-surface register rows and clears the HOLD debt. | the same `compound.inst` re-derive (shared with W1, so land W1's first). `safetyProfile.flags` is computed before the roster is final → move it after the roster. |
| **W3 POW** | power & people | factionRelationships (GM advisory), members/npcs (`factionGoal`), presentation (first impression, how they deal), flags (garrison as extraction, crime is the government, merchant army, merchant-criminal blur, secular brutalism) | 10 (11) | DS-POW-2 (charge to hold the seat), DS-POW-5 (the five structural flags, only when true), DS-POW-6 (GM advisory), the NPC line (presentation, **gated on the owner's X-48 ruling**) | the `safetyProfile.flags` re-order (shared with W2) |
| **W4 FTH** | faith | inst (cathedral/monastery), flags (crusader synthesis, heresy suppression, religious fraud, mage theocracy) | 5 (7) | DS-FTH-4 and DS-GEN-17 | the `safetyProfile.flags` re-order (shared) |
| **W5 HIS + the owner's three** | history, relations, PDF | legacyAnnotations, history (annotations container, recent blow), byTerrain; plus §2.1 | 4 (7) + 3 findings | DS-GEN-16 (top legacy annotation; spine: recent blow → tension), DS-REL-1 (what the road crosses); the migration `direction` fact and its 8 reader sites; the two `headlines.js` wordings | legacyAnnotations are frozen at birth and can contradict live state → re-derive or date them. The new field `stress[].direction`. |
| **W6 REG** | all | the 118 GENERATION INTERNAL identities | 0 | none: register rows only | none, but see risk R4 |

W3 and W4 are small and share the `flags` writer. Merge them into one seat if the chair wants five lanes.

**Registers each lane moves:**

| register | test file | W1 | W2 | W3 | W4 | W5 | W6 |
|---|---|---|---|---|---|---|---|
| writer reach: DARK → LIT shrinks the bank (`--write`, shrink-only), and struck register rows | tests/lint/writerReach.walker.test.js | ● | ● (strikes 3 rows) | ● | ● | ● | ● (adds rows) |
| the composed-prose manifest (525 configs × 2 audiences) | tests/property/dossierProseManifest.test.js | ● | ● | ● | ● | ● | |
| the wiring census (`docs/content/wiring-census.json` re-stamped by `scripts/wiring-census.mjs`) | tests/lint/proseWiringCensus.walker.test.js | ● | ● | ● | ● | ● | |
| the prose byte ratchet | tests/lint/proseCorpusBytes.test.js | ● | ● | ● | ● | ● | |
| the move grammar | tests/lint/proseMoveGrammar.walker.test.js | ● | ● | ● | ● | ● | |
| dossier mounts (new viability block; new NPC line) | tests/lint/dossierMountRegistry.walker.test.js | | ● | ● | | | |
| the generator golden master and its signed freeze record (only where a writer changes) | tests/property/generatorGoldenMaster.test.js · tests/lint/goldenFreeze.walker.test.js | ● | ● | ● | ● | ● | |
| the state-prose leaves `--check` (projector `scripts/generate-dossier-state-prose.mjs`) | tests/property/dossierProseManifest.test.js (rides the same corpus) | ● | ● | ● | ● | ● | |

## 5. THE RISKS (measured)

- **R1 — Golden rows.** Every SAY lands on a composed surface, so every authoring lane moves rows of the 525-config composed-prose manifest. The generator golden master hashes the record, not the sentence, so it moves only where a lane changes a WRITER. Writer-changing lanes: W1 (compound.inst re-derive, the two import formulas, the food-source count), W2/W3/W4 (the `safetyProfile.flags` re-order), and W5 (`stress[].direction`, the legacyAnnotations re-derive). Each needs a signed freeze record. The migration `direction` change also moves the food multiplier (foodGenerator.js:293, foodBalance.js:230) wherever an exodus is drawn: it changes mechanics, not only prose. With the default `influx` it moves nothing.
- **R2 — Facts that need a writer change before they are declarable.**
  - `compound.inst` and the influence scores are stamped once at birth and never recomputed, so a ruined court or bank still reads true.
  - `safetyProfile.flags` is computed before the roster is final.
  - legacyAnnotations are frozen at birth.
  - The import share is written two ways, and the food-source count is computed two ways.
  - `peakTier` is not stamped on demotion (ODQ §434, owner-docketed).
  - New record field: `stress[].direction`.
  
  A sentence over any of these before the writer change would presume a fact the record can contradict.
- **R3 — The census law (DESIGN_POOL_CENSUS §1, rung-2 branch).** "Migration direction" and "war state on the record" are atoms with NO reader. A line presuming either is refused until the fact has one home. W5's `direction` key IS that home (homing item 9). War state (item 10) is SIMULATION-side and deferred. Rows marked SAY-VIA-SPINE assume the spine composition prints the chain they name; where the census's attach set for that block has k = 0, the chain has no attachable fact yet. The census `--print` reports k = 0 on 49 RESOLVED rows; a lane checks its block's row before relying on SPINE.
- **R4 — The INTERNAL disposition cannot be convicted for unread keys.** `engine-internal` requires a `consumer` that reads the key in code outside every counting closure (clause E, writer-dark-register.mjs:501-510). Some INTERNAL rows have no reader at all (for example `hasBlackMarket`, `hasWarehouse`, `hasFreeCompany`, and `leaderNpcIds`, whose strip at settlementPolitics.js:990 is a comment, not code). Those cannot become register rows. The chair must rule one of: they stay in the shrink-only bank as "reviewed, internal", or their writers are retired. `dark-by-construction` needs a flag or dial door. Batch C used it for 4 look/voice keys that the owner's X-48 ruling took off the surfaces, and that does not fit the reason's door: it is a fourth reason in substance, which is a charter act.
- **R5 — The instrument's own errors, which change the counts.**
  - **False DARK.** `foodRecord.failedSource`/`famineCutPct` feed a viability-issue message (foodBalance.js:199-202). `whereabouts.placeId`/`purposeKind` print on the NPC card through a local alias (`whereaboutsDisplay.js:34-35`, SIMULATION).
  - **Shape collapse.** The corpus folds deeper keys up a level (observed-shape-corpus.mjs:453): `metadata`, `selected`, `autoApplied`, `candidates`, `outcome`, `reasons`, `corruptTies`, `majors` and `_timePressure` hold keys that belong one level down. The family names in §3 are the instrument's, not the record's.
  - **The `--report-to` door is broken** (§1).
- **R6 — Judgement calls the chair may overturn.**
  - The four spatial-digest families (`distanceMatrix`, `tiers`, `segments`, `byTerrain`; 40 identities, 36 of them INTERNAL) are written by `domain/spatial/spatialDigest.js` once, at the world's first canonize (store/campaignSpatialCanonize.js), never per tick. They are filed GENERATION; if the chair reads "generation" as the settlement birth pipeline only, they move to SIMULATION.
  - The 4 GENERATION `stress`/`stressors` keys (`forcedByConfig`, `historyColour`) are PLAUSIBLE: the copy onto the live stressor row was not found.
  - The `presentation` NPC lines need the owner's X-48 reading before W3 authors them.

## 6. Provenance

Measurement scripts and the four research tables are in the seat's scratchpad, not committed. Every figure above is reproducible: run `measure()`, `reportOf()` and `reviewableDark()` from scripts/check-writer-reach.mjs at `3c62e8ef5`, and `node scripts/wiring-census.mjs --print`.
