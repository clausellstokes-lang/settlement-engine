# ENTAILMENT REFUTATION — THE STRESSOR + CONDITION DESK (`stressors`)

Refuter seat: Fable 5.1. Surveyor packet: `stressors.survey.md` (same directory).

Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee` (verified `git log -1`). READ-ONLY: nothing written, staged or committed in the dock; no vitest, no npm test, no build; no node script executed (every reading below is a file read).

Every `file:line` is a path in the dock. Verdict vocabulary per the chair's brief: **HOLDS** (true for every member and consistent with the engine), **CONDITIONAL** (true only for named members or where a named field resolves; the condition is stated exactly), **REFUTED** (false for some member, or contradicted by the engine). Where uncertain I defaulted to CONDITIONAL or REFUTED.

---

## 0. THE SIX ENGINE FACTS THE SURVEY GOT WRONG OR MISSED, AND WHICH MOVE VERDICTS

These were found by reading the desk's producers past the point the survey stopped. Each is cited; each changes at least one verdict below.

| # | fact | where | what it moves |
|---|---|---|---|
| F1 | **The rolled stress types ARE threaded into config.** `resolveStress` writes the rolled types to `effectiveConfig.stressType` / `.stressTypes` (`src/generators/steps/resolveStress.js:37-40`; re-threaded after the editor overlay `:189-191`). So every downstream generator that keys off `config.stressTypes` sees a probabilistically rolled stress too: the faction rewrite (`src/generators/power/rulingStructure.js:693-696`), the safety profile (`src/generators/safetyProfile.js:38-41`), the economy/military multipliers (`src/generators/priorityHelpers.js:286-289`). The survey never opened these. | resolveStress.js:37-40 | The GENERATION record of a stress type is not the banner entry alone: it is the entry PLUS the crisis-specific factions PLUS the safety and defense consequences, all keyed on the same token. Several "NOT ENTAILED" items in the survey are in fact ON THE RECORD for generation-built towns (R3 resistance, R8 quarantine and healers, R5 the collector, R9 the death, R14 conscription). |
| F2 | **A play-time `APPLY_STRESSOR` stress entry carries no `summary`, `viabilityNote`, `crisisHook`, `summaryRoll` or `historyColour`** — its shape is `{type, name, label, severity, description, source: 'event', addedByEventId, isCustom?}` (`src/domain/crisisLifecycle.js:272-281`). It carries a `severity` that generation entries lack (`src/generators/stressGenerator.js:46-59`). | crisisLifecycle.js:272-281 | Any entailment the survey grounded on "the record's own summary" is CONDITIONAL on the entry being generation-built. The TYPE'S definition (`STRESS_TYPE_MAP[type].viabilityNote`, static data keyed by type) survives for both; the per-entry `summary` does not. |
| F3 | **The stress-faction generator's economy/military branches are LIVE.** `src/generators/power/stressFactions.js:7` imports `getInstFlags`, so its `typeof getInstFlags == 'function'` guards are TRUE there (the survey applied stressNarrative's "always false under ESM" note, which is true only in that file). Consequences: `mass_migration` mints a **'Departure Committee'** and an "emigration crisis" when `economyOutput < 50` (`stressFactions.js:209-241`); `wartime` has a SECOND, independent profit coin `ye = militaryEffective >= 55 && economyOutput >= 45` (`:250-251`) beside the rng coin; `insurgency` picks a commons movement or an elite non-cooperation faction (`:169-170`, `:188-204`). | stressFactions.js:7, :209-241, :250-251 | R15 inflow is CONDITIONAL, not merely "asserted by the renderer"; R14's coin is doubled; R11's "armed" is refuted by the engine's own faction model. |
| F4 | **A world stressor's `lifecycleStage`, `age` and `severity` are ORIGIN-relative; the settlement the desk describes may be a spread target that feels an attenuated, never-re-aged stamp.** `stressors.js:770-776` ("The record's own severity — and its whole lifecycle — stays origin-driven"); the felt value is `effectiveStressorSeverity` = min(record, `severityBySettlement[id]`) (`src/domain/worldPulse/stressorSeverity.js:28-32`); the stamp is "never re-aged" (`stressorsCore.js:285-290`). The desk's caller selects ANY stressor whose `affectedSettlementIds` includes the town (`OverviewTab.jsx:126-134`), which includes spread targets. | stressors.js:770-776 | R16: `peaking`/`emerging`/`active` at a spread target describe the ORIGIN's clock and height. |
| F5 | **`unattributed` survives the DM naming the attacker, and is written onto ANY type.** `setStressorAttacker` keeps the existing variant and only sets `attackerSettlementId`/`attackerLabel` (`src/domain/worldPulse/stressors.js:616-623`); when `originContext` was null it defaults the variant to `'unattributed'` (`:619`) for whatever type the stressor is. | stressors.js:616-623 | R17: "unattributed entails the record holds no attacker" is REFUTED; the siege/wartime/occupation binding is REFUTED. |
| F6 | **`palace_coup` is the FALLBACK, not "noble-led".** `interpretOriginContext` uses `(leading && COUP_VARIANT_BY_ARCHETYPE[leading.archetype]) || 'palace_coup'` (`src/domain/worldPulse/stressorDynamics.js:877`); `leading` is null when no challenger has power ≥ 5 (`src/domain/rulingPowerCoup.js:51`, `:104`), and the archetype table maps only seven of the thirteen faction archetypes (`:911-919` vs `src/domain/factionArchetypes.js:34-48`: `craft`, `labor`, `outsider`, `occupation`, `other` are unmapped, `criminal` is filtered out at `rulingPowerCoup.js:104`). | stressorDynamics.js:877 | R17 `palace_coup` REFUTED as a courtly conspiracy. |

Two further corrections of scope:

- **R19's E-3 defeat is narrower than the survey says.** `withActiveCondition` persists the CANONICAL condition, i.e. the `deriveActiveCondition` output with the template `defaultStatus` already substituted (`src/domain/activeConditions.js:721-728`, `:644-646`). So every generation-promoted and every event-promoted condition is PERSISTED with a written status, and the drift honours it (`:882`, `:902` "for a valid input status canonical.status === c.status"). The substitution hazard bites only raw/legacy partials that reach `deriveAllActiveConditions` without having passed through `withActiveCondition`. The history claim ("each season costs a little more than the one before") stays REFUTED at `elapsedTicks: 0` regardless.
- **R8's quarantine contradiction is wrong.** `safetyProfile.js:134-143` writes a quarantine sentence for EVERY `plague_onset` town, with an informal-enforcement fallback below town tier (`:138`), and the summary asserts "Quarantine measures are being resisted" (`stressNarrative.js:99`). A quarantine, unevenly observed, IS on the generation record at every tier.

---

## 1. VERDICTS, ROW BY ROW

Format: one table per survey row; every ENTAILS item, plus the survey's NOT-ENTAILED and ENGINE-CONTRADICTS items where I graded them differently or the grade matters to the chair.

### R1 · `under_siege` / world `siege`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| a besieger exists | **HOLDS** | the siege gate allows a birth with no declared enemy at ×0.4 with the reason "only an unnamed host could press a siege" (`src/domain/worldPulse/stressorGates.js:442-443`); `normalizeStressor` says "a siege's attacker may be a goblin warband with no settlement at all" (`stressorsCore.js:358-359`); the annex rules the same (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4066`) | none; identity never (E-1) |
| land supply is cut or contested | **CONDITIONAL** | generation-built entries carry it in `summary` (`src/generators/stressNarrative.js:77-78`) and the export computation collapses exports to none under siege (`src/generators/computeActiveChains.js:755-761`); an `APPLY_STRESSOR` entry carries no summary (F2); the world `siege` catalog carries only `affectedSystems: ['defense_readiness','trade_connectivity','public_legitimacy']` (`stressorsCore.js:62`) | the entry is generation-built (has `summary`), or the claim is worded as trade connectivity, which every record class carries |
| a port is a partial lifeline | **CONDITIONAL** | `computeActiveChains.js:756-761`: under siege, exports survive only when `worldLaw.supportsMaritime()` or `route === 'port'`, labelled "(naval route only)"; the viabilityNote hedges "Port access (if present)" (`src/data/stressTypes.js:19`) | `tradeRouteAccess === 'port'` (or the world law says maritime) |
| "Nothing moves through the gates" (variant 1) | **REFUTED** | the port lifeline above; and "gates" is a roster row, `Gates (if walled)` at town tier with `baseChance: 0.5` (`src/data/institutionalCatalog.js:1356-1358`), `inst.hasGates` is a separate list from `hasWalls` (`src/generators/priorityHelpers.js:52-53`) | — |
| walls / "people on them" | **REFUTED** | walls are a probability modifier only (`stressGenerator.js:107`, `:123`) and a causal-score reason (`stressorGates.js:446-447`); the thorp fortification row `Palisade` is `required: false, baseChance: 0.3` (`institutionalCatalog.js:97-99`) so most thorps hold none; `requiresTier: null` (`stressTypes.js:15`) | `inst.hasWalls` resolves (`priorityHelpers.js:52`); material follows the row (survey §6 A1) |
| rationing exists (variant 5 "issued against a list") | **CONDITIONAL** | the siege faction block always mints a 'War Council' "with authority over rationing, conscription, and defence spending" (`stressFactions.js:20-24`) for generation-built towns (F1) | `powerStructure.factions` carries 'War Council' |
| "the fields beyond them have not been worked" (variant 2) | **CONDITIONAL** | fields exist only where the resource flags say so: `hasGrain` reads grain/fertile/farm/grazing resources, `hasFish` is separate (`stressGenerator.js:99-101`) | a farm-class resource is present; else "the country beyond" |

### R2 · `famine`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| food scarcity is public, not private | **HOLDS** | every record class carries it: viabilityNote "Short-term economic viability is critically compromised" (`stressTypes.js:29`); summary "Rationing has begun" (`stressNarrative.js:80-81`); the promoted condition's description is the exact phrase (`activeConditions.js:68-69`, promotion at `src/domain/conditionPromotion.js:30`); world famine `affectedSystems: ['food_security', ...]` (`stressorsCore.js:71`); economy ×0.60 (`priorityHelpers.js:295`) | none |
| harvest failure is the cause | **REFUTED** | the world famine × siege synergy is a blockade famine, "the blockade stands. No relief can arrive" (`stressorDynamics.js:469`); the famine gate reads `foodLedger.deficitPct` and `storageMonths`, never a harvest (`stressorGates.js:459-468`); a fishing town has `hasFish` and no `hasGrain` (`stressGenerator.js:99-101`). The generation summary asserts "second failed harvest season" for EVERY famine (`stressNarrative.js:80-81`) — an engine-internal contradiction the corpus rightly does not repeat | — |
| rationing "by rule rather than by price" (variant 5) | **REFUTED** | the famine faction block mints 'Grain Holders': "Whoever controls the remaining food reserves holds more real power than any formal authority" (`stressFactions.js:137-142`) — the engine's own famine power model is PRIVATE control; the summary says "The wealthy are hoarding" (`stressNarrative.js:81`). Rationing exists (summary) but "by rule" contradicts the record | — |
| the granary | **CONDITIONAL** | `hasGranary` is a probability input only (`stressGenerator.js:109`, `:134`); the storehouse class is `granary, silo, storehouse, warehouse` (`src/domain/prose/wiringCensus.js:1322`) | a storehouse roster row resolves |
| stores / reserves as STOCK | **CONDITIONAL** | the stock is modelled on `economicState.foodSecurity` (`src/domain/foodLedger.js:55-70`: `storageMonths`, `deficitPct`) and read by the famine gate; a settlement without that block reads NEUTRAL (`:58`) | `foodLedger(settlement).present` |
| the market has grain / price politics (variant 3) | **CONDITIONAL** | `hasMarket` = market or fair rows (`stressGenerator.js:110`), a probability input; "The wealthy are hoarding" is on the summary | a market-class roster row; and the record is generation-built |
| "the thinness is not seasonal" (variant 6) | **REFUTED** | the generation record carries no clock; the world clock (`src/domain/worldPulse/seasons.js:41`) is not read by any pool on this desk (survey §2) | — |

### R3 · `occupied` / world `occupation`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| another authority's writ runs here; revenue flows to it; institutions continue under oversight | **HOLDS** | viabilityNote (`stressTypes.js:39`); the 'Occupation Authority' faction: "all significant decisions require approval or reversal" (`stressFactions.js:42-45`); governing faction ×0.6 with modifier `'occupied'` (`:27`); exports "(taxed by occupation)" (`computeActiveChains.js:762-763`); world `affectedSystems` public_legitimacy (`stressorsCore.js:80`); promoted archetype `vassal_extraction` "drawing wealth, troops, or legal authority" (`activeConditions.js:91-93`) | none |
| a garrison / soldiers quartered (variant 3) | **REFUTED** | the engine's own occupier row: "Their actual power depends on how many soldiers they have here, **which varies**" (`stressFactions.js:45`); the model treats occupation as a REMOVAL of the town's own force (military ×0.40 `priorityHelpers.js:324`; −35 `defenseGenerator.js:387-389`; military factions ×0.3 `stressFactions.js:28-29`), not an added one; `Garrison` is a city-tier `required: true` row (`institutionalCatalog.js:1925-1926`) | — |
| a resistance exists | **CONDITIONAL** (survey said NOT ENTAILED) | generation-built: summary "Resistance exists, distributed and careful" (`stressNarrative.js:84`) and the always-minted 'Resistance Network' "Currently cautious" (`stressFactions.js:47-50`). World `occupation`: NO resistance on the record; `resistance_cells` is a residual effect at resolution (`stressorsCore.js:79`), and an actual resistance is a separate `insurgency` birth with the `resistance` variant (`stressorDynamics.js:800-815`) | DS-STR-1 generation-built only; never on DS-STR-2 `occupation` without an active insurgency listing the town |
| walls | **REFUTED** | as R1; `requiresTier: null` (`stressTypes.js:36`) | — |
| "the town's own hall now advises" (variant 4) | **CONDITIONAL** | hall class (`wiringCensus.js:1314`); thorp governance rows are consensus rows, no hall (`institutionalCatalog.js:8`, `:16`, `:32`); the engine's own occupied text says "The offices are the same offices" only in the corpus, the record says the governing faction persists at ×0.6 | an admin-class row resolves (`INSTITUTION_CLASSES.admin`, `stressorDynamics.js:49`) |
| noble accommodation with the occupier | **CONDITIONAL** | on record only where a noble faction exists: "several noble families have made private accommodations" is appended to Noble Families/Houses/Landed Gentry (`stressFactions.js:36-40`) | the faction row exists |

### R4 · `politically_fractured`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| no stable authority; paralysed; maintenance neglected | **HOLDS** | viabilityNote (`stressTypes.js:50`); governing ×0.4 with `'contested'` (`stressFactions.js:54-55`); internal −20 (`defenseGenerator.js:416-418`); world `political_fracture` affectedSystems (`stressorsCore.js:89`) | none |
| a count of factions | **CONDITIONAL** | the generation record mints two blocs beside the governing faction (`stressFactions.js:59-74`), so at least three exist on `powerStructure`; the summary says "Two or three" (`stressNarrative.js:87`); the card refuses a count in prose anyway | the count is read from `powerStructure.factions`, and only DM-facing |
| "the clerks have quietly decided which to obey" (variant 5) | **REFUTED** | no clerk model; a standpoint over persons (the card's own may-NOT) | — |
| "controls a distinct district or institution" | **CONDITIONAL** | 'Rival Faction B' desc asserts it (`stressFactions.js:65`) only in the non-royal branch | `P` does not include 'Royal Authority' |

### R5 · `indebted`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the creditor is OUTSIDE | **CONDITIONAL** (survey said ENTAILS) | label and viabilityNote say outside (`stressTypes.js:54`, `:61`); the faction block's default mints "Resident agent of the external creditor" (`stressFactions.js:78-83`). BUT under `P.includes('Royal Authority') && hasNobleInst` it mints 'Crown Creditors (Noble Coalition)' — "A coalition of noble houses that hold the crown's debt" — and appends "Several of these houses hold crown debt" to the LOCAL Noble Families (`stressFactions.js:88-92`): the creditors then include resident houses | `powerStructure.factions` carries "Creditor's Representative" and not 'Crown Creditors (Noble Coalition)' |
| revenue extracted; capital investment stopped | **HOLDS** | viabilityNote (`stressTypes.js:61`); economy ×0.85 (`priorityHelpers.js:298`); economic −15 (`defenseGenerator.js:423-425`); world `indebtedness` affectedSystems tax_revenue (`stressorsCore.js:98`) | none |
| a collector is present (variant 3 "goes to the collector") | **CONDITIONAL** | crisisHook "The creditor has sent a representative to collect" (`stressTypes.js:59`) and the "Creditor's Representative" faction (`stressFactions.js:76-83`) — generation-built | the faction row exists |
| the creditor's kind | **REFUTED** | the summary lists four and settles none (`stressNarrative.js:89-90`) | — |
| "beyond the walls" | **REFUTED** | as R1 | — |

### R6 · `recently_betrayed` / world `betrayal`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the betrayal was from within | **CONDITIONAL** | DS-STR-1: summary "betrayed from within" (`stressNarrative.js:92-93`). DS-STR-2: all three variants place the ACTOR inside — `foreign_sponsored`'s hooks say "Someone local is living slightly too well" (`stressorDynamics.js:661`) — but the SPONSOR may be a hostile neighbour (`:742-752`). The survey's "flatly deny" overstates: the act is local in every variant; the motive is not | "the act was local" holds on both records; "locally motivated / unsponsored" only where `originContext.variant === 'internal_conspiracy'` |
| trust low; systems at partial capacity | **HOLDS** | viabilityNote (`stressTypes.js:71`); governing ×0.7 (`stressFactions.js:100-101`); internal −10 / military −10 (`defenseGenerator.js:419-421`); world betrayal affectedSystems social_trust (`stressorsCore.js:107`) | none |
| short-lived by policy | **CONDITIONAL** | world only: `transient` maxAge 2 (`stressorsCore.js:28`, `:102`); the generation record has no clock and "Recently" in the label is not a duration | DS-STR-2 only |
| "The betrayal is over" (variant 2) | **REFUTED** | summary: "recently enough that the wound hasn't closed ... the full picture is not yet known" (`stressNarrative.js:93`); the 'Investigation Faction' is "demanding answers ... growing" (`stressFactions.js:95-98`); crisisHook "The betrayer may still be here" (`stressTypes.js:70`) — the ACT is past, the record says the matter is open | — |
| "agreements written longer" (variant 5) | **REFUTED** | no contract model; a second fact | — |

### R7 · `infiltrated` / world `infiltration`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| an outside interest has penetrated; no economic impact yet | **HOLDS** | viabilityNote (`stressTypes.js:81`); 'Unknown Faction (hidden)': "An external interest with embedded assets in at least two factions" (`stressFactions.js:103-107`); internal −15 / military −8 (`defenseGenerator.js:427-429`); note economy is NOT multiplied for `infiltrated` (`priorityHelpers.js:293-304` has no row for it) — consistent with "no economic impact" | none |
| the town knows (variant 4) | **REFUTED** | summary "The settlement does not know" (`stressNarrative.js:96`); faction desc "Its presence is not known to the settlement" (`stressFactions.js:107`) | — |
| embedded in at least two factions | **CONDITIONAL** | faction desc (`stressFactions.js:107`), generation-built | `powerStructure.factions` carries 'Unknown Faction (hidden)' |
| the hall / its records (variant 5) | **CONDITIONAL** | hall class alias (survey A7); the engine's record says "Key decisions are being subtly shaped" (`stressNarrative.js:96`), no records model | an admin-class row resolves; "the town's decisions" is the safe spelling |

### R8 · `plague_onset` → "DISEASE OUTBREAK" / world `disease_outbreak` / condition `plague`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| an illness is spreading; market reduced; travel discouraged | **HOLDS** | viabilityNote (`stressTypes.js:91`); summary (`stressNarrative.js:99`); economy ×0.75 (`priorityHelpers.js:297`); merchants ×0.7 (`stressFactions.js:154-155`); world `disease_outbreak` affectedSystems (`stressorsCore.js:125`) | none |
| it IS a plague | **REFUTED** | summary "It is not yet a plague" (`stressNarrative.js:99`); label "Disease Outbreak" (`stressTypes.js:85`) | — |
| it is NOT a plague | **REFUTED** | the same settlement's promoted condition is archetype `plague`, label 'Plague', "A virulent illness spreads" (`activeConditions.js:59-61`; promotion rule `conditionPromotion.js:29`). The two records contradict each other. Neither "plague" nor "not yet a plague" is safe; "illness", "sickness", "disease" are | — |
| a quarantine exists, unevenly observed (variant 2) | **CONDITIONAL** (survey said ENGINE CONTRADICTS) | summary "Quarantine measures are being resisted" (`stressNarrative.js:99`); 'Quarantine Council' with emergency health powers (`stressFactions.js:146-151`); the safety profile writes a quarantine sentence at EVERY tier with "Informal community enforcement maintains quarantine" as the no-watch fallback and "with mixed compliance" (`safetyProfile.js:134-143`, fallback `:138`). The survey's tier objection is wrong | generation-built (F1); `DEFENSE_STRESS_STATUS` 'QUARANTINE ACTIVE' is display only (`src/domain/display/defenseDisplay.js:33`) |
| healers are present and busy (variant 3) | **CONDITIONAL** (survey said NOT ENTAILED) | summary "Healers are overwhelmed" (`stressNarrative.js:99`); Quarantine Council "Healers, clerics, and pragmatists" (`stressFactions.js:150`); `hasHealer` (healer/physician/hospital rows) is a probability input only (`stressGenerator.js:113`, `:174`); world `healing_capacity` is an affected system (`stressorsCore.js:125`) | generation-built, or a care-class roster row (`wiringCensus.js:1315`) |
| "The sick outnumber the hands" (variant 2) | **REFUTED** | a count over persons; no census of the sick exists | — |
| marked doors; two lists (variants 5, 6) | **REFUTED** | second facts off a token | — |
| the origin | **REFUTED** | summary "The origin is disputed" (`stressNarrative.js:99`) | — |

### R9 · `succession_void`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the seat is empty; no claim settled; decisions deferred; institutions autonomous | **HOLDS** | viabilityNote (`stressTypes.js:101`); governing faction ×0.5 with modifier `'vacant'` (`stressFactions.js:111`); two Claimant blocs minted (`:121-136`); military ×0.75 (`priorityHelpers.js:326`); world `succession_void` affectedSystems law_order, criminal_opportunity (`stressorsCore.js:138`); the promoted archetype is labelled 'Leadership void' (`activeConditions.js:306-307`) | none. Note the governing faction still EXISTS on `powerStructure` carrying `'vacant'` — "the seat is empty" is the modifier's meaning, and `SummaryTab.jsx:32` will still print "Power rests with <that faction>" beside it |
| a death | **CONDITIONAL** (survey said NOT ENTAILED) | the generation summary asserts "The last strong leader ... died recently" (`stressNarrative.js:101-102`); the world record and an `APPLY_STRESSOR` entry carry none (F2); the archetype name is `dominant_npc_removed` — removed, not died (`conditionPromotion.js:62`) | DS-STR-1 generation-built only |
| "{settlement}'s hall" (variant 5) | **CONDITIONAL** | hall alias; the record says "No one has consolidated authority" | admin-class row |
| claimants exist | **CONDITIONAL** | 'Claimant Bloc A/B' or the noble-claimant pair (`stressFactions.js:121-136`) — generation-built | the faction rows exist |

### R10 · `monster_pressure` → "BEAST & RAIDER THREAT" / world `monster_raider_pressure`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| something in the country has grown bolder; trade disrupted; defensive spending up | **HOLDS** | viabilityNote (`stressTypes.js:111-112`); summary (`stressNarrative.js:105`); military factions ×1.6 (`stressFactions.js:158-160`); world affectedSystems trade_connectivity, defense_readiness (`stressorsCore.js:147`) | none |
| monsters | **REFUTED** | "Whether wolves, raiders, or worse" (`stressNarrative.js:105`); label "Beast & Raider Threat" (`stressTypes.js:105`) | — |
| "keeps more watch than it can afford" (variant 3) | **CONDITIONAL** | as an ACTIVITY it is the type's "Defensive expenditure is increasing"; as the INSTITUTION, `inst.hasWatch` is town-and-up (`priorityHelpers.js:48`) while the type fires at thorp (`stressTypes.js:108`). The engine's own generic below town is 'local watch' (`safetyProfile.js:30-35`) | "keeps watch" (verb) always; "the watch" only where `inst.hasWatch` |
| "the roads outside" (variant 1) | **CONDITIONAL** | `tradeRouteAccess` is one of port/river/crossroads/road/isolated (`src/components/new/SummaryTab.jsx:35`); world spreadChannels include `wilderness_frontier` (`stressorsCore.js:145`) | route is road/crossroads (or the claim is "the country outside") |
| outside hunters are present | **CONDITIONAL** | 'Monster Hunters / Adventurers' "Outside professionals brought in or passing through" always minted (`stressFactions.js:162-166`) | generation-built |
| "defences are adequate for normal times" (summary) | **REFUTED** as an entailment | the summary asserts it unconditionally (`stressNarrative.js:105`) while the defense profile is computed elsewhere and not consulted; a face must not repeat it | — |
| "the ground it has given up is on the rolls as abandoned" (variant 5) | **REFUTED** | no land-roll model at generation; `abandoned_roads` is a world RESIDUAL effect only (`stressorsCore.js:146`) | — |

### R11 · `insurgency`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| a movement contests legitimacy; tax contested; institutions stop forwarding revenue | **HOLDS** | viabilityNote (`stressTypes.js:122-123`); governing ×0.72 with `'contested legitimacy'` (`stressFactions.js:177-179`); world affectedSystems public_legitimacy (`stressorsCore.js:156`) | none |
| armed / fighting (variants 1, 4) | **REFUTED on DS-STR-1; CONDITIONAL on DS-STR-2** | summary "not street fighting but the systematic withdrawal of cooperation" (`stressNarrative.js:115`); the minted opposition is EITHER an "Organised common-population movement" OR an "Elite faction ... strategic non-cooperation, coalition-building, and selective pressure" (`stressFactions.js:188-204`), neither armed. The world `insurgency` carries `pressureKinds: ['legitimacy','conflict']` and `defense_readiness` (`stressorsCore.js:152-156`), so the world record admits a conflict kind | DS-STR-2 only, and then "contested by force" at most |
| "The watch's patrols" (variant 5) | **REFUTED** | `requiresTier: null` (`stressTypes.js:119`); `inst.hasWatch` town+ (`priorityHelpers.js:48`) | `inst.hasWatch` |
| "governed by the consent of people who hold no office" (variant 3) | **CONDITIONAL** | true only under the commons branch (`ye`, `stressFactions.js:170`, `:203`); under the elite branch the challengers are elites, and in the royal case a 'Loyalist Noble Opposition' (`:195`) | the minted faction is "People's Council" / "Journeymen's League" / "Commons' Reform Assembly" |

### R12 · `religious_conversion` → "RELIGIOUS CRISIS"

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the religious settlement is in question; tithing splits; properties ambiguous | **HOLDS** | viabilityNote (`stressTypes.js:133-134`); religious factions get `'contested legitimacy'` (`stressFactions.js:307-308`); world `religious_conversion_fracture` affectedSystems (`stressorsCore.js:165`) | none |
| contested from WITHIN (variants 1, 2) | **REFUTED** | branch 2 is "An outside authority is requiring ... to convert" (`stressNarrative.js:130-132`) with a 'Conversion Enforcement Office' "External or crown-appointed" (`stressFactions.js:336-340`). AND the two record fields choose branches INDEPENDENTLY: the summary by `settlementName.length % 3` (`stressNarrative.js:121`), the factions by `governingFactionName.length % 3` (`stressFactions.js:301`) — one record can carry a branch-0 summary and branch-2 factions | any branch-specific claim must read BOTH the summary text and the minted faction name ('New Faith Community' / 'Reform Congregation' / 'Conversion Enforcement Office'); where they disagree, say nothing branch-specific |
| separate calendars / parallel services (variant 1) | **CONDITIONAL** | branch 1 only: 'Reform Congregation' "holds parallel services" (`stressFactions.js:334`) | branch 1 on both selectors |
| altars, stonework, clerks (variants 5, 6) | **REFUTED** | roster alias (temple class `wiringCensus.js:1312`; thorp rows are a wayside shrine and parish access, `institutionalCatalog.js:42`, `:50`); the deity doctrine on top | — |

### R13 · `slave_revolt`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| an enslaved population has organised; slave market suspended; security focused on containment | **CONDITIONAL** | DS-STR-1 asserts all of it: viabilityNote (`stressTypes.js:144-145`), summary (`stressNarrative.js:136-138`), 'Revolt Leadership' "Organised leadership of the enslaved population ... holding territory" (`stressFactions.js:379-382`), military "Fully deployed for containment" (`:364-367`). The world `slave_revolt` is `deprecated: true` — "the sim has no slavery substrate to make the claim honestly" (`stressorsCore.js:175-180`) | DS-STR-1 only; never on the world record or the `servile_uprising` variant |
| a slave market exists | **CONDITIONAL** | roster rows 'Slave market' exist (`institutionalCatalog.js:1033`, `:1684`, `:1691`) with the desc "Where slavery is legally sanctioned" (`:1036`), and one city row excludes them (`:2050`); the stress gate never checks for them — it reads priorities "not an institution-name match" (`stressGenerator.js:249-255`) | the roster row resolves |
| the settlement is town-tier or larger | **REFUTED** | `requiresTier` is checked only in the probabilistic Mode 3 (`stressGenerator.js:343`); Modes 0, 1 and 2 build the entry for any tier (`:300-325`); an `APPLY_STRESSOR` entry has no tier gate (`crisisLifecycle.js:235-290`) | `stress[].source !== 'forced'` and not event-authored |
| built on bound labour / extractive economy (variant 1) | **REFUTED** | a probability tilt only, ×2.0 or ×0.4 (`stressGenerator.js:251-254`); the entry fires in a non-extractive economy | — |
| "two populations" (variant 6) | **REFUTED** | no demographic split is recorded; a totality over persons (refused column) | — |

### R14 · `wartime`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| inside a war; military expenditure dominates | **HOLDS** | viabilityNote (`stressTypes.js:155-156`); a 'War Council' is minted in BOTH faction branches (`stressFactions.js:278-285`); military ×1.35 (`priorityHelpers.js:330`); world `wartime` affectedSystems defense_readiness, tax_revenue (`stressorsCore.js:198`) | none |
| a KINGDOM / the crown | **CONDITIONAL** | the engine has no polity entity: "realm" appears only as prose (`src/domain/worldPulse/conquestIntent.js:4-7`); the world-layer war variants are born off hostile NEIGHBOUR-SETTLEMENT edges (`stressorDynamics.js:776-799`). The generation summary and the War Council desc use "kingdom"/"Crown" as their own vocabulary (`stressNarrative.js:147-149`; `stressFactions.js:283-284`) | DS-STR-1 generation-built only, as the record's own word; never on DS-STR-2 |
| conscription; labour shortage; men absent (variants 4, 6) | **HOLDS** (survey said NOT ENTAILED) | the TYPE definition asserts it: "Labour shortage from conscription affects agricultural and craft output" (`stressTypes.js:156`); the War Council has conscription powers in both branches (`stressFactions.js:283-284`); world `labor_capacity` affected (`stressorsCore.js:198`). The survey's "conscription appears only in the loss branch" is wrong: it is in the viabilityNote for every wartime town | none for DS-STR-1; DS-STR-2 as labour capacity |
| hardship / the town is losing / short of coin | **REFUTED** | 45 % of generation summaries say "positioned to profit ... merchants ... getting richer" (`stressNarrative.js:42`, `:145-147`); AND a second independent coin in the faction block, `ye = militaryEffective >= 55 && economyOutput >= 45` (`stressFactions.js:250-251`), splits merchants into "War contracts have made the well-connected wealthy" or "hurting the bottom line" (`:261-269`) and the War Council into "functioning smoothly" or "Unpopular" (`:282-284`) — the two coins can disagree on one record | the `summary` text (the only persisted trace: `summaryRoll` is deleted at assembly, `src/generators/steps/assembleSettlement.js:176-188`) and the merchant faction desc agree |
| levies and requisitions (variant 5) | **CONDITIONAL** | War Council "requisition" powers in both branches (`stressFactions.js:283-284`); crisisHook "requisition orders" (`stressTypes.js:154`); "the largest single line in the year" is a magnitude no field carries | drop the magnitude |
| "the garrison is reinforced" (profit summary) | **REFUTED** | the summary asserts a garrison at any tier (`stressNarrative.js:147`); `Garrison` is city-tier (`institutionalCatalog.js:1925`) — a LABEL TRAP inside the record itself | — |

### R15 · `mass_migration`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| a population movement beyond the infrastructure | **HOLDS** | viabilityNote (`stressTypes.js:166-167`); world affectedSystems housing_pressure (`stressorsCore.js:207`) | none |
| INFLOW (all five speaking variants) | **CONDITIONAL** (the survey's "only the renderer is inflow-shaped" understates) | the summary always says arrivals (`stressNarrative.js:158-164`, the dead branch removed). But the faction block is LIVE (F3) and mints a **'Departure Committee'** ("coordinating group departures, selling assets") and appends "Managing the emigration crisis" to the governing faction when `economyOutput < 50` (`stressFactions.js:230-241`); otherwise "Newcomers' Settlement" (`:211-215`). A poor town's record says inflow (summary) and emigration (factions) at once | `powerStructure.factions` carries "Newcomers' Settlement" and not 'Departure Committee'; otherwise "people are moving" with no direction |
| camps outside the wall (variant 1) | **REFUTED** | no camp model; walls as R1 | — |
| "came from somewhere worse" (variant 3) | **REFUTED** | no origin field on either record | — |
| housing has not grown (variant 5) | **REFUTED** | `housing_pressure` is a world affected system and residual (`stressorsCore.js:206-207`); no housing count at generation | — |
| religious institutions gain standing; guilds threatened | **CONDITIONAL** | inflow branch only (`stressFactions.js:216-229`) | as inflow |

### R16 · `lifecycleStage`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| `resolved` / `residual` / `dormant` ⇐ `status` | **HOLDS** | `lifecycleStageFor` (`stressorsCore.js:315-317`) | none |
| `peaking` ⇐ severity ≥ 0.72 | **HOLDS at the origin only** | derivation `:318`; the stage is recomputed from the aged ORIGIN severity each tick (`stressors.js:376-379`) and filled at normalize (`stressorsCore.js:387`); a spread target feels min(record, stamp × 0.72) (F4) | `settlementId === originSettlementId` |
| "as bad as it has been" / "the worst of it" (peaking 1, 2) | **REFUTED** | `peakSeverity` tracks the worst (`stressorsCore.js:364-367`); `peaking` is a threshold, so a 0.95 → 0.75 decline is still `peaking` while past its worst; at a spread target the felt severity is a stamp (F4) | `severity >= peakSeverity` at the origin |
| "stopped compounding" (peaking 2) | **REFUTED** | escalation candidates keep raising severity from any stage (`stressors.js:740-759`) | — |
| `easing` ⇐ severity ≤ 0.24 and age > 0 | **HOLDS** | `:319` | none |
| "the worst has passed" (easing 1) | **CONDITIONAL** | births carry `severity: pressure.score` at or above the catalog `birthThreshold` (0.56 to 0.78) (`src/domain/worldPulse/candidateEvents.js:256`, `stressorsCore.js:59` etc.) and an authored twin defaults to 0.6 (`crisisLifecycle.js:239`), so an `easing` stressor at the origin has fallen; the wind-down also forces ≤ 0.2 (`stressorDynamics.js:945-950`); "has begun to plan past the trouble" is REFUTED (no town-action model) | origin; and "receding" not "planning" |
| `emerging` ⇐ age ≤ 1 | **HOLDS at the origin only** | `:320`; `age` is the ORIGIN's tick count (F4) | origin; at a spread target "new here" is REFUTED when the record is old |
| `residual` = an echo weighted by memoryStrength | **HOLDS** | `echoOf` (`stressorsCore.js:468-500`); the footprint collapses to the origin (`:489`), so a spread target never reads `residual` | none |
| "the people worst placed for it have not worked that out" (emerging 2) | **REFUTED** | a standpoint over persons | — |

### R17 · `originContext.variant`

| entailment | verdict | evidence | condition |
|---|---|---|---|
| each variant fires only on its bound type | **HOLDS for 16 of 17; REFUTED for `unattributed`** | the interpreter (`stressorDynamics.js:741-908`) is the only writer of the 16; `setStressorAttacker` writes `variant: 'unattributed'` onto ANY stressor whose `originContext` was null (`stressors.js:619`) — e.g. a DM-named `monster_raider_pressure` | — |
| `unattributed` ⇒ the record holds no attacker | **REFUTED** | `setStressorAttacker` keeps the variant and sets `attackerLabel` / `attackerSettlementId` (`stressors.js:616-623`); the corpus's "The attacker is unnamed" (`RECEIPT_POOLS_DOSSIER_STATE.md:4325-4326`) then prints beside a named one | `originContext.attackerLabel == null && attackerSettlementId == null` |
| `declared_war` ⇒ a named, openly hostile neighbour | **CONDITIONAL** | at birth the strongest neighbour edge is `'hostile'` (`stressorDynamics.js:776-786`); the edge can de-escalate later — `windDownSponsoredStressors` drops severity and stamps `originContext.windDown` but keeps the variant (`:929-955`). "Declared" is an edge-label rank (`HOSTILE_RANK`, `:600`); no declaration event exists; "banners shown, intentions stated" is hook prose (`:672-675`) | the edge is still `'hostile'` and `originContext.windDown` is absent |
| `foreign_sponsored` ⇒ a foreign hand across a border; naming it "an act of war" | **CONDITIONAL** | the sponsor is a hostile NEIGHBOUR SETTLEMENT (`:742-752`); the engine has no polity or border (see R14); "casus belli" is the hook's own word (`:660`) | "another settlement's coin" holds; "border", "act of war", "foreign" as a polity are REFUTED |
| `abandoned_agent` ⇒ the handler stopped paying | **CONDITIONAL** | the fact is a hostile → non-hostile edge transition within 12 ticks (`:754-765`, `MEMORY_LOOKBACK_TICKS` `:601`); "payment" is hook prose (`:664`) | word it as "the hostility that planted this has ended" |
| `internal_conspiracy` ⇒ no foreign sponsor, no recent feud | **HOLDS at birth; CONDITIONAL after** | else-branch (`:766-773`); a birth-time stamp (`:888-890`); a neighbour can turn hostile afterwards | at birth |
| `resistance` ⇒ born under an occupation | **HOLDS** as birth fact | an ACTIVE occupation listing the town at birth (`:800-815`) | — |
| `resistance` ⇒ "IS occupied" (present tense, variant 3) | **REFUTED** | birth-time stamp never re-interpreted (`:888-890`; `normalizeStressor` passes `originContext` through, `stressorsCore.js:360`); the occupation may have resolved | an active `occupation` still lists the town |
| `resistance` ⇒ "a foreign garrison" (variant 2) | **REFUTED** | garrison alias (R3); the occupation record fixes no soldiers | — |
| `servile_uprising` ⇒ bound labour | **REFUTED** | gate is `labor_capacity < 35 && public_legitimacy < 40` (`:828-833`); "the sim has no slavery substrate" (`stressorsCore.js:175-180`). Note the interpreter's own `reason` string asserts "Bound and broken labor rises against the masters" (`:837`) — narrative on a record that cannot carry it; if `originContext.reason` is ever surfaced it prints the false claim | — |
| `tax_revolt` ⇒ "the levies of a drowning treasury" | **CONDITIONAL** | gate is an active `indebtedness` OR `market_shock` here (`:840`); under `market_shock` alone there is no levy or treasury fact (the crash is `trade_connectivity`, `stressorsCore.js:216`) | an active `indebtedness` lists the town |
| `popular_revolt` ⇒ leaderless | **CONDITIONAL** | else-branch; the engine's own reason is "No faction owns this yet" (`:850`) — about factions, not leaders | "no faction owns it" |
| `popular_revolt` ⇒ the courthouse door, the market square | **CONDITIONAL** | hook prose (`:709-710`); `hasCourtSystem` and `hasMarket` are roster flags (`priorityHelpers.js:55-56`) | the rows resolve |
| `palace_coup` ⇒ a courtly conspiracy, "people nearest the seat" | **REFUTED** | F6: the FALLBACK when no challenger has power ≥ 5 (`rulingPowerCoup.js:51`, `:104`, `stressorDynamics.js:876-877`) or the leading archetype is `craft`/`labor`/`outsider`/`occupation`/`other` (`factionArchetypes.js:42-47`, unmapped at `stressorDynamics.js:911-919`); the engine's own reason then says "The conspiracy is still choosing its champion" (`:898`) | `originContext.contenders[0].archetype === 'noble'` |
| `barracks_coup` ⇒ "the garrison" | **CONDITIONAL** | the leading challenger's archetype is `military`, and `CATEGORY_MAP` folds `watch` and `law` factions into `military` (`factionArchetypes.js:55`): a town-watch faction or a law faction reads as `barracks_coup`; "garrison" follows the roster row (city+, `institutionalCatalog.js:1925`) | the contender's name resolves; "the armed" / "the soldiers" is the safe class word |
| `merchant_cabal` ⇒ a warehouse | **CONDITIONAL** | archetype `merchant` (also `economy`, `trade` categories, `factionArchetypes.js:56`); `hasWarehouse` is a roster flag (`priorityHelpers.js:60`) unread here | the row resolves |
| `temple_putsch` ⇒ pulpit, sermons, sanctuary | **CONDITIONAL** | archetype `religious`; building alias (temple class); the card refuses a theological claim on every pool | a temple-class row; no doctrine |
| `arcane_ascendancy` ⇒ wards around the council hall; workrooms | **CONDITIONAL** | archetype `arcane`; `INSTITUTION_CLASSES.arcane` regex (`stressorDynamics.js:53`); hall alias | an arcane row and an admin row |
| `council_schism` ⇒ a chamber, a rump session, a seal | **CONDITIONAL** | archetype `government` or `civic`; thorp governance rows are consensus rows (`institutionalCatalog.js:8`, `:16`, `:32`) | an admin-class row |
| `arcane_burnout` ⇒ the magic was spent by a surge | **HOLDS** | a RESIDUAL `magical_instability` with `memoryStrength > 0.15` listing the town (`:854-860`) is a real prior record; and `magic_deadzone` births are "hard-gated to settlements where magic is load-bearing" (`stressorsCore.js:264`), so "mages", "wards" hold here | none |
| `leyline_silence` ⇒ nobody knows why; nothing failed | **HOLDS** | else-branch; reason "No one yet knows why" (`:869`); the absence of a burnout echo is the fact | none |
| every variant is a birth-time stamp | **HOLDS** | `:888-890`; `stressorsCore.js:360` | none |

### R18 · `severityBand` on a condition

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the severity float sits in the band | **HOLDS** | `severityBand` (`activeConditions.js:541-547`); the display path recomputes the band from the float (`:664`), so a stale declared band cannot disagree | none |
| `critical` = "at its limit", "no capacity left" | **REFUTED for lifts and benefits** | `UPSWING_LIFT_CONDITIONS = reconstruction, boom, flourishing` "RAISE the systems they declare" (`src/domain/worldPulse/archetypeCatalog.js:28-31`); `war_spoils` is "the OCCUPIER-side BENEFIT" (`activeConditions.js:451-461`); `siege_lifted` / `occupation_lifted` are recovery conditions (`archetypeCatalog.js:25`). Severity there is a magnitude of relief or gain | `archetype` is not in lifts, recovery, or `war_spoils` |
| `conditions[0]` is "one of the defining facts about the town" | **REFUTED** | no sort (`activeConditions.js:680-684`); `withActiveCondition` appends (`:728`); the desk reads `[0]` (`stressorsStateProse.js:462`) | — |
| unknown archetype → `medium` | **HOLDS as a hazard** | `severity = 0.25` fallback (`:627`) | — |

### R19 · `status` on a condition

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the record carries that direction and the drift follows it | **CONDITIONAL** | for every condition that passed through `withActiveCondition` the persisted status is the canonical one (`:721-728`), so the desk's read and the drift agree (`:882`, `:902`); only a raw/legacy partial reaching `deriveAllActiveConditions` directly is defaulted at display (`:644-646`) without the drift honouring it (`:894-901`) | the condition was persisted through `withActiveCondition` (every generation and event promotion is) |
| "each season costs a little more than the one before" (worsening 1) | **REFUTED** | a history; every generated condition sits at `elapsedTicks: 0` at birth (`stressorsStateProse.js:329-331`); `worsening` at birth is a DECLARED direction with no elapsed drift | `duration.elapsedTicks > 0` |
| `easing` = "spending on repair rather than on holding" (easing 3) | **REFUTED** | the wind-down forces `easing` within 2 ticks of expiry regardless (`:859`, `:879-882`, written `:902`); no town-action model | — |
| `stable` = "Nothing here is moving ... only the absence of change" (flat 3) | **REFUTED for boom / flourishing** | both default `stable` (`:480`, `:488`) and are lifts | `archetype` not a lift |
| `easing` = "It is lifting" for `reconstruction` | **REFUTED** | `reconstruction` defaults `easing` (`:472`) and is a lift: its severity falling is the REBUILD winding down, not relief | — |

### R20 · provenance split

| entailment | verdict | evidence | condition |
|---|---|---|---|
| traced ⇒ a known in-world cause; "The town knows exactly what did this" | **REFUTED** | every birth promotion stamps `sourceEventType: 'GENERATION'` and `causes: [{source: 'generation', detail: 'Settlement generated under stressor "…"'}]` (`conditionPromotion.js:203-208`); the desk routes all of them to the traced pool (`stressorsStateProse.js:243-251`) | `causes.some(c => c.source === 'event')` — the question `isEventSourcedCondition` answers, which the desk deliberately does not use (`:226-238`) |
| untraced ⇒ "before anyone was writing things down" | **REFUTED** | the desk's own three-measurement refusal (`:298-336`); caps 5..18 ticks | — |

### R21 · duration wind-down

| entailment | verdict | evidence | condition |
|---|---|---|---|
| "It is nearly over" | **CONDITIONAL** | the desk's 25 % cut (`stressorsStateProse.js:259-278`) versus the engine's fixed 2 ticks (`activeConditions.js:859`); the two disagree for any `expiresAtTicks > 8` | `expiresAtTicks - elapsedTicks <= 2` |
| "without anything in particular being fixed" (duration 2) | **HOLDS** | expiry is a clock (`:927-940`); no cause of expiry is modelled | none |

### R22 · archetype (three of 46)

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the template descriptions | **HOLDS** | `activeConditions.js:469`, `:477`, `:485` | none |
| scaffolding, ruins, warehouses, wages, workshops, schools | **REFUTED** | roster aliases; no wage or school model | — |
| reachable at all | **CONDITIONAL** | "gated behind virtual `upswingArcsEnabled`; a dark world never carries them" (`activeConditions.js:463-466`; the flag `src/lib/spatialUsage.js:80`) | the arc flag is lit |

### R23 · ARITY

| entailment | verdict | evidence | condition |
|---|---|---|---|
| more than one banner | **HOLDS** | `crisisArityPoolKey` (`stressorsStateProse.js:161-163`) | none |
| "several" is always two at birth | **REFUTED** | the cap of two is Mode 3 only (`stressGenerator.js:353-356`); Mode 0 maps every `config.stressTypes` entry and Mode 2 every selected entry (`:300-306`, `:315-325`); `APPLY_STRESSOR` appends at play time (`crisisLifecycle.js:286-288`) | — |
| the crises interact / "each makes the others harder to end" | **REFUTED** | Mode 3 rolls are independent (`:339-346`); the interaction model lives on the WORLD record (`STRESSOR_SYNERGIES`, `stressorDynamics.js:466-523`) and there "Everything not listed keeps today's behavior (no interaction)" (`:458-460`) — most pairs have none | a listed synergy pair, on DS-STR-2, at active stages (`:524-529`) |

### R24 · `{settlement}` — the only filled slot

| entailment | verdict | evidence | condition |
|---|---|---|---|
| the town's own name | **HOLDS** | `properFill` (`stressorsStateProse.js:133-140`, `:458`) | none |

---

## 2. ADDED LABEL TRAPS (the survey's §5 missed these)

| label / value | field | ENGINE MEANING | file:line |
|---|---|---|---|
| `foreign_sponsored`, `declared_war` | `originContext.variant` | "foreign" = a hostile NEIGHBOUR SETTLEMENT edge; "declared" = the edge's rank label is `'hostile'`. No polity, border, or declaration event exists. | `stressorDynamics.js:742-752`, `:776-786`, `:600` |
| `unattributed` | `originContext.variant` | (a) persists after the DM names the attacker; (b) is written onto ANY type whose `originContext` was null by `setStressorAttacker`. It is not "siege/wartime/occupation with no attacker". | `stressors.js:616-623`, `:619` |
| `palace_coup` | `originContext.variant` | the FALLBACK: no qualifying challenger, or an unmapped leading archetype. Not "noble-led". | `stressorDynamics.js:877`; `rulingPowerCoup.js:51`, `:104`; `factionArchetypes.js:42-47` |
| `military` (faction archetype) | `contenders[].archetype` | `CATEGORY_MAP` folds `watch` and `law` categories into `military`, so a `barracks_coup` may be led by a town-watch or a law faction. | `factionArchetypes.js:55` |
| `lifecycleStage`, `age`, `severity` | world stressor | ORIGIN-relative; the settlement's felt severity is `severityBySettlement[id]`, stamped at spread and never re-aged. `emerging` at a spread target is the origin's age. | `stressors.js:770-776`; `stressorSeverity.js:28-32`; `stressorsCore.js:285-290` |
| `'Wartime pressure'` | `condition.label` for `war_pressure` | the label a `monster_pressure`, siege or blockade town's condition prints — the word "war" reaches the Overview's condition list with no war. | `activeConditions.js:75-76`; `conditionPromotion.js:31`, `:63` |
| `'Regional revenue disruption'`, `'Regional criminal pressure'`, `'Regional religious pressure'`, `'Regional authority instability'`, `'Regional migration pressure'` | `condition.label` | the LABELS (not just archetypes) that purely local `indebted` / `infiltrated` / `religious_conversion` / `politically_fractured` / `mass_migration` towns print. | `activeConditions.js:203-204`, `:211-212`, `:254-255`, `:274-275`, `:282-283`; `conditionPromotion.js:47`, `:54-55`, `:60-61` |
| `'Leadership void'` | `condition.label` for `dominant_npc_removed` | the archetype says "removed", the label says "void", the stress summary says "died". Three words, one fact of unknown shape. | `activeConditions.js:306-307`; `stressNarrative.js:101-102` |
| `summary` (wartime) | `stress[].summary` | the ONLY persisted trace of the profit coin; `summaryRoll` is deleted at assembly. A desk cannot read the coin except by matching the text. | `assembleSettlement.js:176-188` |
| `source: 'event'` + `severity` present, `summary` absent | `stress[]` entry shape | an `APPLY_STRESSOR` entry. No summary, viabilityNote, crisisHook, historyColour. Every summary-grounded claim is off. | `crisisLifecycle.js:272-281` |
| `source: 'forced'`, `forcedByConfig: true` | `stress[]` | user-selected; such an entry bypassed `requiresTier`. | `resolveStress.js:61-69`; `stressGenerator.js:300-325` |
| `config.stressType`, `config.stressTypes` (post-pipeline) | effectiveConfig | the ROLLED types, threaded by `resolveStress`; `intendedStressTypes` is what the user asked for. "config" does not mean "user intent" here. | `resolveStress.js:37-47` |
| `'Grain Holders'` | faction row under famine | the famine's power model is PRIVATE control of reserves, which contradicts "issued by rule". | `stressFactions.js:137-142` |
| `religious_conversion` branch | two independent selectors | summary branch by settlement-name length; faction branch by governing-faction-name length. One record, possibly two stories. | `stressNarrative.js:121`; `stressFactions.js:301` |
| `'Departure Committee'` | faction row under `mass_migration` | emigration, minted when `economyOutput < 50`, beside a summary that always says arrivals. | `stressFactions.js:230-241`; `stressNarrative.js:158-164` |
| `ye` (wartime factions) | a second profit coin | `militaryEffective >= 55 && economyOutput >= 45`, independent of the rng coin. | `stressFactions.js:250-251` |
| `'local watch'` | `safetyProfile` `watchLabel` | the engine's own generic force word below town tier; `inst.hasWatch` is a different, town-and-up fact. | `safetyProfile.js:30-35`; `priorityHelpers.js:48` |
| `'Occupation Authority'` desc | faction row | "how many soldiers they have here, which varies" — the engine explicitly declines to fix a garrison. | `stressFactions.js:45` |
| the insurgency opposition faction | faction row | an elite non-cooperation faction or an unarmed commons movement; never armed. | `stressFactions.js:188-204` |
| `'Monster Hunters / Adventurers'` | faction row under `monster_pressure` | "Outside professionals brought in or passing through" — always minted; the town has hunters regardless of tier or roster. | `stressFactions.js:162-166` |
| `originContext.reason` | world stressor | free prose stamped at birth; for `servile_uprising` it asserts bound labour the model lacks. | `stressorDynamics.js:837` vs `stressorsCore.js:175-180` |
| `stressor.counterforce`, `stressor.synergy` | world stressor | PERSISTED diagnostic snapshots ({score, floorsMet, ...}, {companions, blocksResolution, ...}) rewritten every aging tick. The desk's reason for leaving COUNTERFORCE and SYNERGY dark ("needs a world snapshot", "602 KB drag", `stressorsStateProse.js:384-394`) does not apply to these persisted fields; `sourceBreakdown` is NOT persisted, so `{reason}` still cannot fill. | `stressorsCore.js:351-355`; `stressors.js:380-395` |

---

## 3. ADDED ALIAS TRAPS (the survey's §6 missed these)

| word | the split the engine makes | file:line | safe spelling |
|---|---|---|---|
| "the levy" | (a) the thorp roster ROW `Household levy` (a muster of one adult per household); (b) wartime conscription (viabilityNote); (c) a tax levy (`tax_revolt` "levies", `tax_revenue`). WARTIME #2 "scheduled around the levy" is three-way ambiguous. | `institutionalCatalog.js:104-107`; `stressTypes.js:156`; `stressorDynamics.js:843-844` | "the muster" for (a), "conscription" for (b), "the tax" for (c) |
| "the fields" / "the harvest" | resource flags: `hasGrain` (grain, fertile, farm, grazing) vs `hasFish`; the `store` class includes `harvest`. A port or fishing town may hold no field. | `stressGenerator.js:99-101`; `wiringCensus.js:1309` | "the land", "the country" |
| "the healers" | care class (hospital, infirmary, healer, medical, physician, ward); `hasHealer` = healer/physician/hospital rows; the Quarantine Council names healers regardless of roster. | `wiringCensus.js:1315`; `stressGenerator.js:113`; `stressFactions.js:150` | "those tending the sick" |
| "the roads" | road class; `tradeRouteAccess` is port/river/crossroads/road/isolated. | `wiringCensus.js:1313`; `SummaryTab.jsx:35` | "the approaches", "the country outside" |
| "the crown" / "the kingdom" / "the realm" | no polity entity; `P.includes('Royal Authority')` is a governance-type string that switches faction names; world hostility is a neighbour-settlement edge. | `stressFactions.js:60`, `:78`, `:122`; `stressorDynamics.js:776-799` | "the war", "the authority above the town" |
| "the border" / "foreign" | a hostile neighbour settlement; regions exist (`originRegion`) but no border. | `stressorDynamics.js:742-752`; `stressorsCore.js:296` | "another town's hand" |
| "the garrison" (occupied, resistance, barracks_coup, the war families) | roster rows `Barracks` (town), `Garrison` (city, required), `Multiple garrisons` (metropolis); the OCCUPIER's soldiers are not a roster row at all and their number "varies". | `institutionalCatalog.js:1363`, `:1925`, `:2355`; `stressFactions.js:45` | "the soldiers", "the occupier's men" |
| "the creditor" / "the collector" | `Creditor's Representative` (resident agent) vs `Crown Creditors (Noble Coalition)` (local noble houses). | `stressFactions.js:76-92` | "whoever is owed" |
| "the treasury" | `tax_revenue` is a causal score; no treasury entity. | `stressorsCore.js:98`, `:198` | "the town's revenue" |
| "the clerks" / "the offices" / "the rolls" | admin class; thorp governance rows are consensus rows. | `stressorDynamics.js:49`; `institutionalCatalog.js:8`, `:16`, `:32` | "whoever keeps the town's affairs" |
| "the warehouse" / "the courthouse" / "the market square" | roster flags `hasWarehouse`, `hasCourtSystem`, `hasMarket`, unread by any pool on this desk. | `priorityHelpers.js:55-56`, `:60` | the class word or none |
| "the camps" / "the newcomers" | no camp model; the newcomers exist on the record only as the "Newcomers' Settlement" faction under the inflow branch. | `stressFactions.js:211-215` | "the arrivals" only where that faction resolves |
| "the overseers" | no overseer model; the generation `slave_revolt` record has 'Revolt Leadership' and military "deployed for containment". | `stressFactions.js:361-367`, `:379-382` | "the town's force" |
| "mages" / "hedge wizards" / "casters" / "wards" | `INSTITUTION_CLASSES.arcane`; `magic_deadzone` births are hard-gated to load-bearing magic, so these HOLD for `arcane_burnout` and `leyline_silence`; they do NOT hold for `arcane_ascendancy` at a town whose arcane faction is the leading coup contender by power alone. | `stressorDynamics.js:53`; `stressorsCore.js:264` | as stated |
| "the men" (wartime 4) | the summary's own gendered word ("working-age men"); no sex-ratio field is read. | `stressNarrative.js:149` | "the people of working age" |
| "the crisis" / "the trouble" (DS-STR-2 anaphora) | the survey's A3, and sharper: the world stressor the desk narrates is the FIRST in array order that lists the town (`OverviewTab.jsx:129-132`), including an ECHO (`status: 'residual'`), while the banner above is a DIFFERENT record class. Two crises narrated as one. | `OverviewTab.jsx:126-134` | a naming clause, or a same-type guard |

---

## 4. MISSED NOUNS — slot nouns or name classes of the desk the survey did not row

1. **The stress-minted FACTION name class** — the engine's richest per-type model, never rowed: `War Council`, `Occupation Authority`, `Resistance Network`, `Rival Faction B` / `Loyalist Noble Bloc`, `Third Bloc (Neutrals)` / `Reform Noble Bloc`, `Creditor's Representative` / `Crown Creditors (Noble Coalition)`, `Investigation Faction`, `Unknown Faction (hidden)`, `Claimant Bloc A/B` / `Noble Claimant (Senior Line / Reform Faction)`, `Grain Holders`, `Quarantine Council`, `Monster Hunters / Adventurers`, `People's Council` / `Journeymen's League` / `Commons' Reform Assembly` / `Loyalist Noble Opposition` / `Reform Stewards' Coalition` / `Reformist Faction`, `Newcomers' Settlement` / `Departure Committee`, `Peace Faction`, `New Faith Community` / `Reform Congregation` / `Conversion Enforcement Office` / `Underground Old Faith`, `Revolt Leadership`, `Abolitionist Network` (`src/generators/power/stressFactions.js:11-390`). These are the licences for most of the "second facts" the survey marked ENGINE-CONTRADICTS, and the refutations of several it marked ENTAILS.
2. **`powerStructure.factions[].modifiers`** — `'occupied'`, `'vacant'`, `'contested'`, `'contested legitimacy'`, `'authority contested'` (`stressFactions.js:27`, `:55`, `:111`, `:178`, `:308`, `:357`) — the engine's own one-word rulings on the seat, which "the seat is empty" and "authority is divided" could be licensed from directly.
3. **`stress[].source` / `forcedByConfig` / `addedByEventId` / `isCustom`** (`resolveStress.js:61-69`; `crisisLifecycle.js:272-281`) — the provenance of a banner, which decides whether a summary exists and whether a tier gate applied.
4. **`stress[].severity`** — present on event-authored entries only; read by promotion (`conditionPromotion.js:167-171`).
5. **`stress[].description`** — event-authored free text (`crisisLifecycle.js:277`).
6. **`originContext.reason`, `originContext.hooks[]`, `originContext.contenders[]`, `originContext.incumbent`, `originContext.windDown`, `originContext.attackerLabel`, `sponsorSettlementId`, `formerSponsorSettlementId`** (`stressorDynamics.js:741-908`, `:945-950`; `stressors.js:616-623`) — the origin record's other fields; the corpus paraphrases `hooks[]` and must not contradict `windDown` or `attackerLabel`.
7. **`stressor.counterforce` and `stressor.synergy`** persisted snapshots (`stressorsCore.js:351-355`; `stressors.js:380-395`) — see the label-trap row; ten dark pools have a persisted reading the desk did not row.
8. **`stressor.resolutionContext`** (`stressorsCore.js:374-377`) — the resolution receipt on a `resolved`/`residual` record: the licensed source for "why it ended".
9. **`stressor.peakSeverity`** (`stressorsCore.js:364-367`) — the only field that licenses "as bad as it has been".
10. **`stressor.severityBySettlement`** (`stressorsCore.js:285-290`, `:339`) — the felt severity at a spread target.
11. **`stressor.originSettlementId` vs the described settlement** — origin or spread target decides R16 entirely.
12. **`condition.label`** — the words the Overview's condition list actually prints ('Wartime pressure', 'Regional …', 'Plague', 'Leadership void').
13. **`config.monsterThreat` 'heartland'** — `prob *= 0.3` on siege/monster, ×0.4 on occupation (`stressGenerator.js:121`, `:168`): "heartland" means low raider/monster exposure, not "the centre of a realm".
14. **`tradeRouteAccess`** and the resource flags (`hasGrain`, `hasFish`, `hasTimber`) — the geography nouns (fields, roads, forests: "forests hide monsters", `stressGenerator.js:188-192`) that several variants assert.
15. **The world `STRESSOR_CATALOG` types with no banner** — `rebellion`, `market_shock`, `criminal_corridor`, `magical_instability`, `coup_detat`, `magic_deadzone` (survey A3 lists them but rows none): each is a name class DS-STR-2's lifecycle and origin lines describe anaphorically with no type word at all.

---

## 5. THE CONTRADICTION CLASS — real-world entailments the engine contradicts, found on this desk

| real-world entailment | the engine's rule | file:line |
|---|---|---|
| a famine is a harvest failure | a famine may be a blockade ("This famine is not a failure of harvest") and the gate reads stock and deficit, not harvests | `stressorDynamics.js:469`; `stressorGates.js:459-468` |
| a siege presupposes walls | walls are a probability modifier; the thorp row is optional at 0.3 | `stressGenerator.js:123`; `institutionalCatalog.js:97-99` |
| an occupation brings a garrison | the occupier's soldier count "varies"; the town's own force is REDUCED by the model | `stressFactions.js:45`; `priorityHelpers.js:324` |
| a rebellion of "bound labour" implies slavery | the sim has no slavery substrate; the variant is two scores | `stressorsCore.js:175-180`; `stressorDynamics.js:828-833` |
| "peaking" means the peak | a threshold; the peak is `peakSeverity` and may be past | `stressorsCore.js:318`, `:364-367` |
| "emerging" means new to this town | new at the ORIGIN; a spread target inherits the origin's age | `stressors.js:773-775` |
| "the attacker is unnamed" follows from `unattributed` | the DM can name it and the variant stays | `stressors.js:616-623` |
| a palace coup is led by courtiers | the fallback variant | `stressorDynamics.js:877` |
| a condition can be old | 18 ticks is the oldest possible | `activeConditions.js:58-540`, `:927-940` |
| "worsening" implies it has worsened | a declared drift direction at `elapsedTicks: 0` | `activeConditions.js:846-849`; `stressorsStateProse.js:329-331` |
| "easing" implies recovery | forced by a 2-tick expiry window regardless of direction | `activeConditions.js:859`, `:879-882` |
| "critical" is bad | for a lift it is the magnitude of a boom | `archetypeCatalog.js:28-31` |
| a traced cause is an event | at birth it is the sentinel `'GENERATION'` | `conditionPromotion.js:203-208` |
| "not yet a plague" and a condition called "Plague" cannot both be true | they are, on one settlement | `stressNarrative.js:99`; `activeConditions.js:59-61` |
| a town under mass migration is filling OR emptying | a poor town's record says both | `stressNarrative.js:158-164`; `stressFactions.js:230-241` |
| wartime is hardship | 45 % of summaries say profit; the faction coin is independent | `stressNarrative.js:42`; `stressFactions.js:250-251` |
| a slave revolt needs a town | only the probabilistic roll checks the tier | `stressGenerator.js:343` vs `:300-325` |
| several crises compound | Mode 3 rolls are independent; world pairs default to no interaction | `stressGenerator.js:339-346`; `stressorDynamics.js:458-460` |

---

## 6. RULES THE CHAIR CAN GENERALISE FROM THIS DESK (offered, not decided)

1. **A type token licenses its STATIC definition (`STRESS_TYPE_MAP[type]`: label, viabilityNote, crisisHook) on every record that carries the token; it licenses the per-entry `summary` only on entries that carry one.** The desk keys on the token (`stressorsStateProse.js:148-153`) and never checks for a summary; an `APPLY_STRESSOR` entry has none (F2). Rule: definitional = the static row; record-conditional = the rendered strings.
2. **A generation-built stress token licenses the crisis FACTIONS, the safety sentence, and the defense/economy deltas the same token minted** (F1). The survey's "a bare token licenses only the type" is too narrow for generation-built towns and exactly right for event-authored ones. The condition is `stress[].source`.
3. **A world stressor's stage, age and severity are facts about the ORIGIN; a face on a spread target must read `severityBySettlement` and must not speak the origin's clock** (F4).
4. **Where two fields of ONE record choose their story independently (two mod-3 selectors, two profit coins, summary-vs-faction direction), a face may assert only their intersection.** Found three times on this desk (R12, R14, R15).
5. **A variant that is also a fallback licenses nothing beyond the type** (`palace_coup`, `unattributed`).
6. **A birth-time stamp licenses past tense only.** Every `originContext` variant, every `resolution`/`residual` claim.
7. **A minted faction row is the strongest licence on the record for a civic object the roster does not hold** (the War Council's rationing, the Quarantine Council's healers, the Occupation Authority's "varies") — and the strongest refutation when it names the opposite (Grain Holders, Departure Committee).

END OF PACKET.
