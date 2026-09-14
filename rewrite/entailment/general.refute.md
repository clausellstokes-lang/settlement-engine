# ENTAILMENT REFUTATION — THE GENERAL DESK (overview / relations / population / hooks)

Refuter seat: Fable 5.1. Surveyor packet: `general.survey.md` (same directory). Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW`, detached at `f2da5a3ee` (verified `git rev-parse HEAD`). READ-ONLY: nothing modified, staged or committed; no vitest, no build, no node run at all (every finding below is a file read or a grep). Every path is dock-relative; every line is the dock's.

Default posture, as briefed: REFUTED or CONDITIONAL where uncertain. A verdict of HOLDS here means I looked for a member, a fill, a config value or a generator rule that breaks it and found none. Every REFUTED quotes the code.

Method. For each ENTAILS item in the survey's §1 and §3 I asked three questions: (a) is there a MEMBER of the name class for which the entailment is false; (b) is there a FILL or CONFIG under which the record carries the word but not the thing; (c) does the ENGINE'S OWN RULE deny or exceed it. Where the survey's phrasing is carefully generic and the CORPUS's shipped sentence over-claims, I say so in the row, because the chair is licensing faces and the face is what a reader gets.

Two corrections to the survey's own instrument reads are folded into the rows and repeated in §4: custom-content rows never reach the substring matchers at all (`nativeSemanticName` returns `''` for materialised custom content, `src/domain/content/customContentSemanticAuthority.js:46-60`), and 'Small prison/stocks' does hold cells (`src/data/institutionalCatalog.js:1567`), so the survey's "stocks are not a prison" is itself a label read.

---

## 1. VERDICTS — §1 slot nouns

| noun | ENTAILS (survey) | verdict | evidence | condition |
|---|---|---|---|---|
| `{settlement}` | this is the town whose page this is | HOLDS | `generalStateProse.js:1712` `slots = { settlement: properFill(text(settlement?.name)) }`; the slot is never overwritten in any bag below it | a name failing `properFill` (:157-165 — a digit, a dash, a sentence stop) yields `undefined` and every variant is dropped; the entailment cannot be false, only silent |
| `{counterpart}` | a DIRECTED relation exists to a second settlement | CONDITIONAL | fill `:1877` `neighbourName`; direction lives ONLY in `relationshipFrom/To` + `localRelationshipRole`, stamped by `applyWorldPulseRelationshipGraph.js:196-216` and `relationshipLinkMetadata` callers (`neighbourBackLink.js:120-127`, `genesisDiplomacy.js:166`, `SettlementsPanel.jsx:386-395`) | "directed" is licensed only where `localRelationshipRole` resolves; a legacy link carrying `relationshipType` alone is undirected, and for asymmetric types the desk withholds (`:1487-1492`). For symmetric types the word "directed" adds nothing the record holds |
| `{faction}` / `{faction2}` | a NAMED political actor is a party to this record | HOLDS (DS-GEN-2 only) | `src/generators/power/conflicts.js:240` `parties: [factionA.name, factionB.name]`; desk `:1755-1756` | DS-GEN-1 is DARK at this tip (`generalStateProse.js:388-420`: `severity` is an ARRAY on 100 percent of tensions), so the tension-side entailment has no surface |
| `{govFaction}` | this faction holds the seat on THIS note | CONDITIONAL | `narrativeGenerator.js:630-640` `govFaction = factions.find(f => f.isGoverning)`; desk `:1768` | the note is the temple-economy note, measured unreached in 384 configs (`generalStateProse.js:1020-1022`); true where it fires, never exercised |
| `{governing}` | the governing power as the clock names it | CONDITIONAL | `hookEscalation.js:495-506` `govName = settlement.powerStructure?.governingName \|\| ''`, stage fallback `'the governing faction'`; desk fills from `readings.governingName` (`:1993`) | an empty `governingName` gives `properFill('')` → `undefined` and the variant drops; the lowercase fallback string never reaches this desk |
| `{controller}` | the hook record names a holder | CONDITIONAL (vacuous on this desk) | `hookEscalation.js:466,479` `chain.controller`; `fillStage` (`:443-447`) leaves `{controller}` literal when absent. The general desk declares NO `controller` slot (`SLOT_FILL_SHAPES` `:102-137`) and fills none (`:1993`) | any DS-HK-1 variant naming `{controller}` is dropped by anchored liveness; the entailment is never rendered here |
| `{npc}` | a cast person named on a member receipt, THIS town's end | CONDITIONAL | desk `:1536` reads `npcConnections[].primaryNPCName`. `grep -rn primaryNPCName src` finds NO writer outside the desk and the components (receipt: only `generalStateProse.js:1529,1536` outside `src/components`) | the "this town's end" claim rests on `RelationshipsTab.jsx`'s read, not on a producer in `src/generators` or `src/domain` at this tip; true where the field exists as the tab assumes, unverifiable at the writer |
| `{issue}` | the record states a matter in dispute | HOLDS | `conflicts.js:237,241` `chosen = pick(applicableTemplates…)`, `issue: chosen.issue` | the issue is a TEMPLATE row picked from a table, gated by world law (`:222-235`); it is the record's stated matter, not one derived from this town's ledgers |
| `{stakes}` | something FORWARD stands to change hands | HOLDS | `conflicts.js:242` `stakes: chosen.stakes`; annex `:5266` "`stakes` is forward-facing" | same template provenance as `{issue}`; "forward" is the annex's ruling over template prose, not a field the engine ticks |
| `{steading}` | a satellite is on this town's ledger | HOLDS | `SteadingsSection.jsx:26-33` reads `campaign.worldState.spatialLedgers.satellites[sid].steadings` | — |
| `{ruin}` | a named fallen settlement stands nearby, with a duration | HOLDS | `historyGenerator.js:865-880`: name minted, `yearsAgo = age + randInt(120,400)`, the event row says "fell nearby" and `lastingEffects` "stands nearby" | opt-in only (`config.ancientRuinsEnabled === true`, `:865`) |
| `{event}` | the record names this event | HOLDS | `:1808` `event: properFill(text(marker.name))` | a name with a proper noun inside ("The Fall of Ecserys") passes `properFill` here (capitalised) but fails `calamityFill` — two different refusals over one name |
| `{founder}` | a lowercase descriptive phrase carrying its own determiner | HOLDS (unfilled) | annex `:236-259`; desk `:1780-1786` | never rendered at this tip (sentence-initial grammar reason) |
| `{challenge}` | the record names a first trial | CONDITIONAL (unfilled) | desk `:1787-1789`: fillable, deliberately not filled | vacuous on this desk |
| `{reason}` | the record TYPED a reason | REFUTED | desk `:1790-1795`: the only candidate, `history.founding.reason`, is a PREDICATE CLAUSE ("was founded by foresters managing the woodland under charter"), not a typed value; the desk refuses to fill it | no TYPED founding reason exists on this desk's record; the annex's `{reason}` row (`:182`) describes a field this desk does not have |
| `{calamity}` | a typed BLOW of that name is on the record | REFUTED | `calamityFill` (`:509-517`) accepts ANY `The` + Title Case event name. `recordCalamityEvent` (`:660-667`) selects any row with `lastingEffects`, anchored `true` or `false`. Resource events are `anchored: false` with `lastingEffects` (`historyGenerator.js:661-676`): **'The Great Harvest Compact'** → `great harvest compact`, 'The Iron Dispute' → `iron dispute`. `EVENT_TYPE_NAMES` (`historyData.js:1547-1582`) also yields 'The Pilgrimage' (`pilgrimage_surge`), 'The Return' (`exile_return`), 'The Influx' | the fill's class is EVENT, not BLOW. A DS-GEN-16 seam that treats `{calamity}` as a blow ("what the years left standing") speaks over a compact and a pilgrimage |
| `{timeband_since}` | an elapsed span as a BAND | HOLDS (≤60y) | `:466-469`; `heraldCausalGrammar.js:339` `since: null` on the sixth band | `undefined` beyond a generation; 89 of 108 events (`:454-465`) |
| `{timeband_age}` | an age as a band, total | HOLDS | `:476-479`; sixth band `predicate: 'older than its bearers'` | — |
| `{institution}` | the chain row names a processing house | CONDITIONAL | `:1259-1268` `craftInstitutionFill` over `processingInstitutions[]`; values are CATEGORY labels (`Merchant guilds (3-8)`, `Glassmakers`) | the word is the CHAIN's label for a category, matched (per `:1245-1248`) to some roster row whose own name is never used; "a named house" (annex `:172`) is not what is filled |
| `{resource}` | a raw input is named on the record | CONDITIONAL | `:1348-1354`; `:1281-1285` the exploitation column mixes prose labels and raw tokens (`mountain_timber`) | a snake_case token is refused by `bareCommonFill` (`:1212`) and the variant drops; on `STALLED` the slot is deliberately unfilled (`:1832-1843`) because the only feed-that-failed producer holds chain ids |
| `{good}` | a trade good is named | CONDITIONAL | `:1372-1379`; parenthetical rows (`Bulk grain (local fields depleted)`) refused (`:1213`) | true where a conforming import row exists; an entrepôt with none still resolves the key and speaks unslotted |
| `{season}` / `{access}` / `{band}` | — | not this desk's fills | `{season}`,`{access}` are economy's; `{band}` RESERVED (`:125-131`) | no entailment to test here |

## 2. VERDICTS — §3 rows

### 2.1 The ground and the approach

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `coastal` / `riverside` (WATER-EDGE) | standing water at the edge of the site | HOLDS | `resourceTerrainCompatibility.js:36` `WATER_TERRAIN = new Set(['coastal','riverside'])` gates water resources; `foodGenerator`/`defenseGenerator.js:133-134` treat both as water terrains | terrain is route-DERIVED where no override (`terrainHelpers.js:23-33`), but both water values arise only from a water route or an explicit override, so the water is consistent either way |
| `mountain` / `hills` (HIGH-GROUND) | relief; an approach that climbs | CONDITIONAL | relief: `defenseGenerator.js:130-131` `terrainMilMult` 1.28 / 1.18 ("natural chokepoints, elevation"); `foodGenerator.js:300` `_isLowAgriTerrain` includes hills | "an approach that climbs" is REFUTED as a terrain fact: the APPROACH is `tradeRouteAccess`, and `hills` with route `river` (an override, `terrainHelpers.js:24` `terrainOverride && terrainOverride !== 'auto'`) has a river approach. License relief only |
| `forest` (WOODLAND) | standing timber | HOLDS | `terrainMilMult` 1.12 (`:132`); DS-GEN-12 WOODLAND texts speak of "the wood" | on most towns `forest` is the DEFAULT for route `isolated` (`terrainHelpers.js:28`), an inference, not an observation — the survey's C-1 stands |
| `plains` (OPEN-GROUND) | open ground, no natural chokepoint | HOLDS | `defenseGenerator.js:135` `: 1.00; // plains / desert` — no terrain multiplier, the engine's own "no chokepoint" | `plains` is also `getTerrainType`'s catch-all for an UNKNOWN route (`terrainHelpers.js:32` `\|\| "plains"`) |
| `desert` (DRY-GROUND) | aridity | HOLDS | `foodGenerator.js:300` low-agriculture terrain; `terrainMilMult` 1.00 | — |
| `port` (route) | a water approach that carries cargo | CONDITIONAL | `foodGenerator.js:311` import rate 0.70; `tradeGoods.js:90-97` entrepôt arm; `defenseGenerator.js:270-272` the +10 is gated on `worldLaw.supportsMaritime()` | NOT the sea: `port` + `riverside` is a river port (`narrativeGenerator.js:908-912`; `resourceTerrainCompatibility.js:56-60`). And a port route with a NON-WATER terrain override (`hills`, `plains`) is not refused by `getTerrainType` (`terrainHelpers.js:24`), so DS-GEN-5's `port` scene ("runs on the tide", "wharves") can print over HIGH-GROUND. License "a water approach" only where terrain is a water value |
| `river` | a river | HOLDS | `terrainHelpers.js:26` `river: "riverside"`; `foodGenerator.js:313` | — |
| `crossroads` | more than one road meeting | HOLDS | `settlementOriginProse.js:161`; DS-GEN-5 `market (route crossroads)` (`:822`) | note the ENGINE adds a second entailment the survey did not: every crossroads town is `isEntrepot` (`tradeGoods.js:94`) |
| `road` | a road | CONDITIONAL | real value on DS-GEN-5/13/POP-3; on DS-GEN-6 the `road` pool is the ELSE-ARM: `:964-967` `ORIGIN_POOL_OF_ROUTE[…] \|\| 'road'` over a four-key table (`:887-892`), mirroring `settlementOriginProse.js:169-172` | REFUTED on DS-GEN-6: `mountain_pass`, `mountain_road`, `desert_road` and an ABSENT route all read "{settlement} is on a road and lives off the road" |
| `isolated` | no maintained through-route | CONDITIONAL | `foodGenerator.js:307-309` `disconnectedRoute ? Math.max(_magicTradeRate * _maintainerMult, _minorRouteRate)` | the engine gives an isolated town a `_minorRouteRate` trickle; "no trade road" holds, "no route at all" does not |
| `mountain_pass` / `mountain_road` | a route over relief | HOLDS | `terrainHelpers.js:29-30`; `foodGenerator.js:302-306` the pass carries a winter closure | — |
| `desert_road` | a route across dry ground | HOLDS | `terrainHelpers.js:31` | — |

### 2.2 The market

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| market-class work (`market·bazaar·exchange·shambles·stalls`) | a place where goods are bought and sold | REFUTED | `MARKET_NAME` (`generalStateProse.js:1109`) is a NAME test over `liveInstitutions` (`:1139-1140`). Catalog keys it credits: **'Whisper market'** (`institutionalCatalog.js:2086` "brokers who buy and sell knowledge by the piece"), **"Chroniclers' exchange"** (`:1759` "paid correspondents … an archive … a standing rate for a written answer"), **'Slave market'** (`:1036` "Public auction of enslaved persons"), 'Black market' / 'Black market bazaar' | a Whisper market and a Chroniclers' exchange are information houses; a slave market sells persons; a black market is the CRIMINAL roster's row (`priorityHelpers.js:76-77`). MARKET-OPEN's "Market day is {settlement} at its truest" over a town whose only match is a black market is a false face. Safe spelling: "exchange" or "trade" only where the row's own name is read |
| `shambles` | a meat market | CONDITIONAL (vacuous) | no catalog key contains `shambles` or `stalls` (grep over the 230 catalog keys) | no producer; the class member is dead on native rosters |
| entrepôt (`isEntrepot`) | goods pass through rather than originate here | CONDITIONAL | `tradeGoods.js:90-97` `route === 'crossroads' \|\| (route === 'port' && name includes 'international trade' or 'warehouse district')`; transit goods ARE modelled (`:162` `transit: isEntrepot ? imports.filter(…).slice(0,4) : []`) | engine-consistent, but `isEntrepot` is a ROUTE fact on every crossroads town including a thorp with a 'Periodic market'; the ENTREPOT face "Half of what changes hands is only pausing here" is a QUANTITY claim no field holds (`transit` is at most four goods) |
| ruin filter on DS-GEN-13 | a flattened bazaar credits no market | HOLDS | `:1139` `liveInstitutions(state)`; `institutionRoster.js:29-53` | `impaired` stays live (`:18-20`), so a corrupt market still credits |

### 2.3 The company the town keeps (DS-GEN-17)

| key | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `ADMINISTERED` | a civic seat AND a place of confinement | HOLDS (as phrased) / REFUTED (as "a court") | `hasCourtSystem` `priorityHelpers.js:55` matches 'City hall', 'Town hall', 'Democratic assembly' — all seats. `hasPrison` `:54` matches 'Small prison/stocks', whose row reads "Holding cells and public punishment" (`institutionalCatalog.js:1567`) — confinement HOLDS, correcting the survey's A-6 | the CORPUS says "keeps a court" (ADMINISTERED text 1) — REFUTED by a Town hall + stocks town. License "a seat and a place of confinement"; refuse "court" unless the row is 'Multiple courthouses' / 'Multiple court buildings' |
| `GARRISONED` | the roster carries a military-class row | CONDITIONAL | `:1183` `hasMilitaryInst \|\| hasNavy \|\| hasWatch`; `priorityHelpers.js:45` includes `'walls'`, `'citadel'`. Catalog members that fire it: 'Town walls', 'City walls and gates', 'Massive walls and fortifications', 'Citizen militia', 'Mercenary quarter', 'Multiple garrisons', 'Professional city watch', 'Town watch', "Adventurers' charter hall". **`hasNavy` is DEAD on native rosters**: no catalog key contains `navy` or `major port` (grep over the 230 keys; the only port-class keys are 'Docks/port facilities' and "Harbour master's office") | "military-class row" holds only if a wall counts as one. Both CORPUS faces are REFUTED by a walls-only town: "keeps professionals for its safety" and "pays for its own defense in wages, not only in stone" (`priorityHelpers.js:45` `'walls'`). Also "in stone" asserts a wall material the defence desk owns (`{defwork}` — palisade is a wall-class member, annex `:213`) |
| `LETTERED` | a practitioner-class row | HOLDS | `priorityHelpers.js:68`; catalog: 'Hedge wizard' (`:824` "A resident caster of modest reach"), 'Scroll scribe' (`:1982` "Spell scrolls for sale"), 'Alchemist shop', "Enchanter's shop", 'Academy of magic' | one hedge wizard is the whole licence; the face "people whose whole trade is knowing things" is stretched over a scroll shop |
| `PROVISIONED` | a store of grain OR a house of care | CONDITIONAL | grain arm HOLDS: `'granar'` (`:63`) matches 'Town granary', 'City granaries', 'State granary complex'. Care arm REFUTED: `hasHospital` (`:64`) matches **'Healer (divine, 1st level)'** (`institutionalCatalog.js:845-849`, a PERSON, licence held at `low` for the deity doctrine) and 'Monastery or friary' (`:1271` "May operate hospital/school" — MAY) | license "a store of grain" only where `hasGranary`; the key cannot tell which arm fired, so a face naming either is a guess |
| `BARE` | none of the four antecedents holds | HOLDS (of `compound.inst`) | `:1183-1187` pure else-arm | as a statement about the PRESENT roster it is CONDITIONAL: the booleans are minted at generation over the raw roster (`economicState.js:51,872`; `priorityHelpers.js:277-279`) and never re-read |

### 2.4 The record (history)

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `the great fire` / `the flood` / `the plague years` | fire / water / disease | HOLDS | `historyData.js:1570-1572` | — |
| `the siege` | a besieging force | REFUTED | 'The Siege' names `external_threat` (`historyData.js:1560`), whose template is **"News of approaching danger divided the community on how to respond"** with factions 'Prepare for war', 'Seek diplomacy', 'Flee/hide' (`historyData.js:1182-1184`) | the event is a DIVIDED RESPONSE to a threat, not a siege that happened; a face about walls held or a blockade endured is more knowledgeable than the record |
| `the crash` / `the trade collapse` | a market failure | HOLDS | `:1567-1568` | — |
| `the occupation` | an occupier who came and went | HOLDS | `occupation_legacy` (`:1556`); annex `:5184` | — |
| coarse `type` | the record classified the event | HOLDS | `historyGenerator.js:588` `event.type = cat` | L-7's one-to-one categories stand |
| `anchored: true` | the event still bears on the present | REFUTED | `historyGenerator.js:600-604` "Anchor events to settlement-appropriate narratives", `:630-640` `replacement.anchored = true` on a `_rng() < 0.6` coin; resource events `anchored: false` (`:672,691,710,741`); the ancient-ruin event `anchored: true` (`:877`) | a narrative-fit stamp. DS-GEN-16's "what remains" reading rides on `lastingEffects.length > 0` (`:646-648`), not on the flag |
| recency label | an elapsed span in years, banded | HOLDS | `:599-610` | two ladders on one desk (`TIME_BANDS` cuts at 10/25/60y; recency at 10/30/80/200y) — never pair a word from one with a cut from the other |
| `historicalCharacter` (five branches) | a COUNT over the timeline | HOLDS | `historyGenerator.js:843-853` | `newly founded` needs `age <= 0`, reachable via `settlementAgeMode: 'new'` or `'custom'` with 0 (`:44-49`) — the survey's "FOUNDED-YOUNG effectively unreached" measured `auto` mode only |
| `stable and prosperous` | (else-arm) | REFUTED as a prosperity reading | `:848` | L-5 stands |
| founding record | a founding row; an age as a band; no construction date | HOLDS | `:812,826`; annex `:127`; `AGE_BY_TIER` `historyData.js:1111-1118` | `settlementAgeMode: 'custom'` gives an exact `settlementAgeYears` (`:45-48`) and `SummaryTab.jsx:33` prints "Founded approximately {age} years ago" — an AGE figure exists, a DATE does not; the prose must still band it (§0d) |
| ancient ruin | a named fallen settlement nearby; a duration | HOLDS | `:865-880` | opt-in; absence is "flag off" |
| scar `burn_lots` / `plague_quarter` / `rubble_field` | fire / disease / collapse | HOLDS | `urbanFabricKernel.js:319-323` `CAL_SCAR_RULES` | DS-GEN-15 is WIRING-UNRESOLVED (unbuilt); vocabulary only |
| scar `flood_line` | water | CONDITIONAL | `:322` `/flood\|deluge\|storm\|tide/` | a STORM stamp mints a flood_line; "water" is over-strong for a wind storm |
| scar `siege_repairs` / `occupation_marks` / `lean_years` | a lifted siege / a lifted occupation / famine | HOLDS | `:672-676` `siege_lifted`, `occupation_lifted`, `famineFor` | — |
| scars decay | a real clock | HOLDS | `:644-647` half-lives `:305-314` | keyed on KIND, not material (C-6 stands) |

### 2.5 Population

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `QUANTITY_BANDS` word | a head count inside the rung's ceiling | CONDITIONAL | `demographicsHerald.js:72-80`, `quantityWords` `:126-134` `n <= ceiling` | the CEILING holds; the WORD's English does not: 41 souls reads 'a hundred or so' (ceiling 120), 1,201 reads 'thousands'. Not a fill of this desk (`{band}` RESERVED) |
| `nobody` | a nonpositive count | HOLDS | `:127-128` | — |
| `POP_READING` verb | a RETROSPECTIVE reading over the window | HOLDS (window ≥ 2) | `trendLens.js:24-30,44-56`; `AXIS_TUNING` `beliefAxes.js:49-52` (window 6, strong 0.15, mild 0.04) | "has held level" = net ratio inside ±4 percent over up to six readings; band 0 is also the empty-ring answer (`:47`) and only DS-POP-3's gate (`:1578-1586`) separates them (L-14 stands) |
| no forecast / no cause | — | HOLDS | annex `:4845,4953` | — |

### 2.6 Standing, verdicts and scores

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| score band word | the axis's number falls in that band | HOLDS | `defenseScoreBands.js:37-38` | absent score → null (`:291-296`) |
| `scores.monster` | monster DEFENCE | HOLDS (L-2) | `defenseGenerator.js:197-227`, penalty `:227` | — |
| `scores.economic` | economic RESILIENCE, food-storage-driven | HOLDS (L-2b) | `:257-290` | — |
| `scores.magical` | 0 when magic off / small tier without magic | HOLDS (L-2c) | `:296-307` | a cathedral or monastery lifts the small-tier gate (`:300-301`), so CRITICAL is not "no practitioners" either |
| readiness label | the composite in band | HOLDS | `:490-521` | includes a tier BONUS (thorp +12) and a threat PENALTY (plagued 15), so 'Fortress' on a thorp is partly its size |
| prosperity label | the measured rung; `Poverty` unreachable | HOLDS | `prosperityRank.js:62-92`; `generalStateProse.js:187-217` | — |
| food label thresholds | the deficit/surplus cuts | HOLDS | `foodGenerator.js:326-327,340-358` | EDGE: `deficitPct`/`surplusPct` are 0 when `dailyNeed` is 0 (`:326-327`), so a town with no need reads `Secure` by the else-arm |
| `Deficit — Active Famine` | the famine stress is live | HOLDS | `:236` `stressFamine = stresses.includes('famine')` | a CONFIG stress, not arithmetic: it can sit on a surplus town; "the fields failed" is unlicensed |
| safety head word | the strain/base rung the head word names | HOLDS (routed nine) | `SAFETY_POOL_OF` `:240-249`; producer `safetyProfile.js:103-142,240` | `Secure` never written (L-3c); `Controlled` = curfew/authoritarian (L-3) |
| `viable` | no CRITICAL issue at the first survey | HOLDS | `viability.js:557-558`; `ViabilityTab.jsx:142-143` | — |
| MARGINAL on absent | — | HOLDS | `:681-687` | — |

### 2.7 Ties

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `trade_partner` | goods move between the two | CONDITIONAL | `REL_DYNAMICS.trade_partner.economyMode: 'complement'` (`neighbourGenerator.js:61-66`) shapes the NEIGHBOUR's institution odds; `migrationKernel.js:197` weights it as a trade tie; `relationshipRulesCore.js:54-63` forms it from trust and "combinedTrade" | I found NO goods ledger between two settlements at this tip; "a trade tie is recorded" holds, "goods move" is consistent but unmodelled. The corpus's "prices move together" and "Half of what a household owns came up the road" are quantity claims nothing holds |
| `allied` | a standing alliance | HOLDS | `relationshipRulesCore.js:323-364` (pactStrength, obligation) | — |
| `patron` / `client` | THIS town is the senior / junior end | CONDITIONAL | `canonicalRelationship.js:339-345` `rolesForCanonicalEdge`; desk `:1487-1492` reads `localRelationshipRole` | only where the role resolves. At GENERATION `REL_DYNAMICS.patron` and `.client` BOTH carry `economyMode: 'dependent'` (`neighbourGenerator.js:66-75`) — the type's economic meaning is symmetric there; direction lives in the role alone |
| `rival` | competition | HOLDS | `economyMode: 'compete'` (`:76-80`) | — |
| `cold_war` | hostility short of war | HOLDS | `:82-86`; the corpus's own gloss | — |
| `hostile` | open hostility | CONDITIONAL | `economyMode: 'suppress'` (`:88-92`) | not WAR: a war is a separate condition/cost model (`warCosts.js`, `activeConditions`); "at war" is unlicensed by the label |
| `neutral` | a recorded tie with no charge | HOLDS | `:49-54` | — |
| STATELESS (no origin) | — | HOLDS | annex `:5546` | — |
| `overlord` / `vassal` render nothing | — | HOLDS | `:1477-1481` | — |
| `prominentRelationship` / `flagDriven` | — | HOLDS | `:757-798` | — |

### 2.8 Tensions, conflicts, warnings

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| tension `type` (10, closed) | — | REFUTED as "closed at 10" | `TENSION_LABELS` (`plotHooks.js:7-18`) is a DISPLAY list; the desk's own note: "`HISTORICAL_EVENTS_DATA` can write more than twenty tension types and the corpus writes ten pools, so fourteen of them would still reach no pool" (`generalStateProse.js:415-418`); `EVENT_TYPE_NAMES` has 30 (`historyData.js:1547-1582`) | the vocabulary is closed in the CORPUS, open in the PRODUCER; and DS-GEN-1 is dark (`:388-420`) |
| `occupation_legacy` / `outside_debt` | an occupation ended / an obligation outward | HOLDS (by the word) | annex `:5184,5237` | dark block |
| conflict `intensity` | how close the parties are to violence, as the record grades it | REFUTED | `conflicts.js:238` `intensity = rivalries.length > 1 ? 'high' : rivalries.length === 1 ? 'moderate' : 'low'` — a COUNT of recorded rivalry relationships between the two factions | the record grades nothing about violence; `high` means two-or-more rivalries on the books. License "the record's intensity word" and no more |
| coherence note | a STANDING relation between two live fields | HOLDS | `narrativeGenerator.js:575-670` | five of six unreached (`:1002-1030`) |
| `structuralViolations[]` | the record disagrees with itself | CONDITIONAL | `structuralValidator.js:416-423` `tier_violation` (a row above its tier) with `authoredSeverity(instName,'warning')`; severities include `by_design` (survey L-16) | a `by_design` row and a tier-gate breach are DESIGN-RULE findings, not self-contradictions; only `dependency_violation` (`:436-441`) is the record missing what it needs |
| `structuralSuggestions[]` | something is MISSING | HOLDS | `:428-434` | — |

### 2.9 Steadings and lifecycle

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `provenance: 'forced'` | a decree happened | CONDITIONAL | minted at `settlementLifecycleKernel.js:1207,1216` (`nameOverride`, `resourceKey`, `provenance: 'forced'`); branch `:458` | I read the mint site, not its caller; "a decree" holds if that path is the realm verb the annex (`:64`) names, which I could not confirm from the two lines |
| `charterPending` | the charter has not yet been granted | HOLDS | `satellitesLedger.js:79` "village scale reached; awaits the V2 charter"; `settlementLifecycleKernel.js:870-882` | ALSO entails village scale reached — a licensed extra |
| organic arm | close enough to be counted, far enough to be its own | CONDITIONAL | `:1436-1440` folds `growth`, `resource_strike`, `resettlement` | the fold hides two TYPED provenances: a `resource_strike` steading is "its own" because of ore, a `resettlement` because people were moved; the organic prose is the annex's over three unlike origins |
| `lifecycleStatus` | the town has DIED | HOLDS | `settlementLifecycleFirstClass.js:113-117` (`relic_ruin` iff peak tier ≥ city), `:612-624` | — |

### 2.10 Hooks

| noun | ENTAILS | verdict | evidence | condition |
|---|---|---|---|---|
| `clock bread_riot` | "Food supply chain is strained or worse", and only that | REFUTED (for "only that") | `hookEscalation.js:463-466` `if (chain.status === 'stable') continue;` then `needKey === 'food_security'` → clock. Statuses: `stable · strained · scarce · blocked · captured · substituted · collapsing` (`supplyChainState.js:22,186`); `magically_sustained → 'substituted'` (`:178`) | the clock fires on `substituted` (a magically sustained chain) and `captured`, which the description does not say. The id fires on a SUPERSET of its `triggerDescription` |
| `clock smuggling_rise` | "Trade chain is strained or worse" | REFUTED (same shape) | `:470-481` any non-stable `trade_entrepot` chain | — |
| `clock legitimacy_crisis` | Contested or worse | HOLDS | `:487-498` `/Contested\|Legitimacy Crisis/i` | — |
| `clock faction_split` | overlapping power and conflicting wants | CONDITIONAL | `:507-520` `powerDelta <= 8 && top.archetype !== second.archetype` | "conflicting wants" = differing archetype; "overlapping" = within 8 power |
| stages are a TEMPLATE | — | HOLDS | `:387-436` | — |
| label vs id | — | HOLDS | `:729-745` | — |
| hook `category` | — | HOLDS | `plotHooks.js:31-39` | — |

---

## 3. LABEL TRAPS THE SURVEYOR MISSED

| # | label | engine meaning | file:line |
|---|---|---|---|
| **R-L1** | `The Siege` | `external_threat`'s template: "News of approaching danger divided the community on how to respond" — a DIVIDED RESPONSE, not a siege. Three "sieges" now share the word on this desk's reads: this template, the live `under_siege` config stress (`safetyProfile.js:110`), and the fabric's `siege_repairs` scar minted from a `siege_lifted` condition (`urbanFabricKernel.js:672-673`) | `historyData.js:1560,1182-1184` |
| **R-L2** | `{calamity}` | the fill class is EVENT, not BLOW: 'The Great Harvest Compact', 'The Pilgrimage', 'The Return', 'The Influx' all pass `calamityFill` | `generalStateProse.js:509-517`; `historyGenerator.js:661-676`; `historyData.js:1573,1563,1581` |
| **R-L3** | market NAME class | credits 'Whisper market' (knowledge), "Chroniclers' exchange" (correspondents), 'Slave market' (persons), 'Black market' (the criminal roster) as "a market" | `generalStateProse.js:1109`; `institutionalCatalog.js:2086,1759,1036`; `priorityHelpers.js:76-77` |
| **R-L4** | `market (route crossroads)` (DS-GEN-5 pool key) | an ARRIVAL-SCENE label keyed on ROUTE alone (`SCENE_OF_ROUTE`), whose texts assert "all of them end in the same square" — while DS-GEN-13 can resolve `NO-MARKET` on the same town. Two blocks of one desk, one town, "a square" and "no market worth the name" | `generalStateProse.js:822,834`; DS-GEN-5 `market` texts; `:1139-1147` |
| **R-L5** | `intensity` (conflicts) | a COUNT of rivalry relationships (0/1/2+), not heat | `conflicts.js:238` |
| **R-L6** | `Deficit — Active Famine` | a CONFIG stress (`stresses.includes('famine')`), independent of the deficit arithmetic; can sit on a surplus town | `foodGenerator.js:236,341` |
| **R-L7** | `Small prison/stocks` | the SURVEY's own trap: the row is holding cells AND stocks ("Holding cells and public punishment"), so "stocks are not a prison" (survey A-6, L-12) is a label read of the key's tail | `institutionalCatalog.js:1567` |
| **R-L8** | `hasNavy` | DEAD on native rosters: no catalog key contains `navy` or `major port`; GARRISONED's `\|\| hasNavy` arm cannot fire; `hasNavy` also matches 'major port' which would make a PORT a NAVY if the row existed | `priorityHelpers.js:62`; catalog keys (230, grepped) |
| **R-L9** | `Healer (divine, 1st level)` → `hasHospital` | one PERSON sets the "house of care" arm of PROVISIONED and lifts the small-tier magic gate; the row's licence is held at `low` for the deity doctrine | `priorityHelpers.js:64`; `defenseGenerator.js:300-301`; `institutionalCatalog.js:845-849` |
| **R-L10** | `Access to external mill` / `Access to parish church` | ABSENCE rows named after the thing. 'Access to external mill' ("Must travel to manor/village mill", `:123`) matches the glyph class `wheelhouse` `/\b(windmill\|watermill\|mill)\b/` and the civic class `craft` (`mill`); 'Access to parish church' ("Walk 2-5km to village church") sets `hasChurch` (`'church'`). The owner's own example — "a mill grinds" — meets a roster row that is the town NOT having a mill | `institutionalCatalog.js:123,~50`; `glyphAssign.js:93`; `wiringCensus.js:1316`; `priorityHelpers.js:65` |
| **R-L11** | `bread_riot` / `smuggling_rise` trigger text | "strained or worse" is the description; the code fires on any non-`stable` status including `substituted` (magically sustained) and `captured` | `hookEscalation.js:463-481`; `supplyChainState.js:178,186` |
| **R-L12** | `Harbour master's office` → `hasPort` | an OFFICE, not a port; word-bounded `harbour` hits it. And 'Docks/port facilities' is "River or coastal dock", so `hasPort` never entails the sea | `priorityHelpers.js:32,61`; `institutionalCatalog.js:1730,991` |
| **R-L13** | `port` (route) with a non-water terrain | `getTerrainType` honours ANY override (`terrainOverride && terrainOverride !== 'auto'`), so `port` + `hills` is representable; DS-GEN-5 then prints the `port` scene ("runs on the tide", "wharves") beside DS-GEN-12's HIGH-GROUND | `terrainHelpers.js:24`; `generalStateProse.js:862-866` |
| **R-L14** | `settlementAgeMode: 'new'` | `age = 0` is REACHABLE by config, so `newly founded and still becoming itself` and `FOUNDED-YOUNG` are live arms, contra the survey's "effectively unreached" (which measured `auto`) | `historyGenerator.js:44-49`; `generalStateProse.js:620-621,631-634` |

## 4. ALIAS TRAPS THE SURVEYOR MISSED

| # | word | the rows the engine splits it into | always-safe spelling |
|---|---|---|---|
| **R-A1** | **custom-content rows** (the asymmetry, not a word) | `nativeSemanticName` returns `''` for materialised custom content (`customContentSemanticAuthority.js:46-60`), so NO `inst.*` flag ever fires on a custom institution: DS-GEN-17 is blind to a custom "Town watch". DS-GEN-13 reads `row.name` directly through `liveInstitutions` (`generalStateProse.js:1139-1140`), so a custom "Grand Market" DOES credit a market. One desk, two answers about one custom row (FOLD 59: custom-content prose parity) | a face on DS-GEN-17 may not deny what a custom row supplies; a face on DS-GEN-13 may not assert engine mechanics (`hasMarket`'s +10, `tradeGoods`) a custom row does not carry |
| **R-A2** | **the garrison** (the inverse of A-1) | `safetyProfile.js:97-100,128-130,238-240` prints "The garrison…" keyed on `inst.hasGarrison`, whose list includes `'professional city watch'` (`priorityHelpers.js:46`); the holder kind `watch` is roster-backed by that same row (`holderTable.js:318-324`) | the guard / the muster |
| **R-A3** | **the mill** | 'Access to external mill' (absence), 'Mills (2-5)' (plural, count-bearing), 'Sawmill (commercial)' (timber, not grain) — the glyph class draws a `wheelhouse` for all three, the civic class `craft` holds `mill`, and the owner's "a mill grinds" is false for the sawmill and the absent mill | the works / what it turns out, read from the row |
| **R-A4** | **the assembly** | 'Democratic assembly' is a `hasCourtSystem` member (`priorityHelpers.js:55`) AND the `census` holder's roster row (`holderTable.js:291-296`, "Citizen registration") | the seat |
| **R-A5** | **the council** (second split) | 'Town council' is an `elders` row (`holderTable.js:335`) AND a `toll-bar` row (`:303` "Market charter and tolls") — survey A-15 found elders + treasury for the headman; the council is elders + toll-bar | the seat |
| **R-A6** | **the charter** | four senses: the steading's village charter (`satellitesLedger.js:79`), the market charter (toll-bar service, `holderTable.js:302`), the adventurers' charter hall (`hasCharterHall`, a MILITARY score input, `priorityHelpers.js:50`, `defenseGenerator.js:176`), and the civic `hall` class token (`wiringCensus.js:1314`) | name the record: "the village charter", "the market charter"; never bare "the charter" |
| **R-A7** | **the siege** | see R-L1: a history template, a live config stress, a lifted condition | "the siege on the record" / "the siege now" / "the siege that was lifted", by source |
| **R-A8** | **the fair** | `hasMarket` includes `'fair'` (`priorityHelpers.js:56`): 'Annual fair', 'Major annual fairs' are PERIODIC (`institutionalCatalog.js:950` "Regional merchants. Luxury goods available.") and set the standing-market flag that feeds `scores.economic` +10 (`defenseGenerator.js:268`) | the fair, only where the row is a fair; never "the market" from `hasMarket` |
| **R-A9** | **the roll** (population) | DS-POP-3's faces say "{settlement}'s roll"; a ROLL implies a keeper, and the `census` holder is roster-backed only by 'Democratic assembly' and 'Royal seat' (`holderTable.js:291-296`) — a thorp has no roll | the head count / the town's numbers |
| **R-A10** | **the quarter / the district** | 'Mercenary quarter', 'Alchemist quarter', "Mages' district", 'Slave market district' are DISTRICT rows that set single-house flags (`hasMercenary`, `hasAlchemist`, `hasMagesGuild`) — a face naming "a hall" or "a shop" for a district row is wrong about the scale, and the reverse | the row's own head word |
| **R-A11** | **the square** (DS-GEN-5 `market` scene) | "the same square" is asserted from ROUTE; the annex rules the square the map engine's (`RECEIPT_POOLS_DOSSIER_STATE.md:120`); 'Market square' / 'Multiple market squares' are roster rows the scene never reads | where the roads meet |

## 5. MISSED NOUNS (slot nouns or name classes of the desk the survey did not row)

- **the mill** (three catalog rows; R-A3) — the owner's own example noun has no row in the survey.
- **the fair** (`hasMarket` member; R-A8).
- **the assembly** (R-A4) and **the council as a toll-bar row** (R-A5).
- **the healer** (a person read as a house; R-L9).
- **the harbour master / the office** (R-L12).
- **the charter** (four senses; R-A6).
- **the siege** (three senses; R-L1, R-A7).
- **the square** and **the quay / the wharf / the tide** — DS-GEN-5's `port` and `market` scene nouns, asserted from ROUTE alone and never from a roster row (`SCENE_OF_ROUTE` `:820-826`; `hasPort` is a separate read); the survey rows the route word but not the scene's nouns.
- **the harbour** in DS-GEN-6's `port` pool ("makes the harbour the whole of the argument") — same shape.
- **stone** in DS-GEN-17's GARRISONED face ("not only in stone") — a wall MATERIAL asserted by a block that reads no wall row; the defence desk's `{defwork}` owns it and `palisade` is a wall-class member (annex `:213`).
- **the roll / the books / the clerks** — the `[ledger]` angle's implied record-keeper across DS-POP-3, DS-GEN-2 ("the clerks have begun to mind") and DS-GEN-14; the holder table says most towns have no such holder (`tradition` has none anywhere, `holderTable.js:340-350`; `office` is city/town-only, `:355-364`).
- **the wagon / the carts** (MARKET-OPEN "where the carts already stopped") — a route-traffic image with no field; minor.
- **the quarter** as a district (R-A10).
- **the compact / the dispute / the pilgrimage** — the non-blow event names `{calamity}` can carry (R-L2).
- **custom-content rows as a class** (R-A1) — not a noun but the one class of member the survey's every roster row silently excludes.

## 6. NOTES FOR THE CHAIR

1. **The survey's generic phrasings mostly HOLD; the corpus's faces mostly do not.** Of the DS-GEN-17 keys, three are HOLDS or CONDITIONAL as the survey words them (a seat and confinement; a military-class row; a store of grain) and the SHIPPED sentences over-claim on each ("a court", "professionals … wages … not only in stone", "care for the bad year"). The licence question is about the face, so the useful column is the face's noun, not the key's gloss.
2. **Three refutations are new and hard:** `The Siege` is not a siege (`historyData.js:1182-1184`); `{calamity}` is an event fill, not a blow fill (`historyGenerator.js:661-676` resource events with `lastingEffects` and `anchored: false` reach `recordCalamityEvent`); conflict `intensity` is a rivalry COUNT (`conflicts.js:238`).
3. **`hasNavy` is dead and `hasHospital` fires on a person.** GARRISONED effectively reduces to `hasMilitaryInst || hasWatch`, and `hasMilitaryInst` carries `'walls'`; PROVISIONED's care arm can be one first-level healer.
4. **The custom-content asymmetry (R-A1) is a wiring fact the licence law will meet on every roster-reading block**, not only this desk's two: any block keyed on `compound.inst` denies custom rows; any block keyed on a NAME test over `liveInstitutions` credits them.
5. **Two survey measurements need their mode stated:** FOUNDED-YOUNG / `newly founded` are reachable by `settlementAgeMode` (`historyGenerator.js:44-49`); the "youngest town 81y" figure is the `auto` draw only.
6. **One survey trap is itself a trap** (R-L7): 'Small prison/stocks' holds cells. The chair should not license "stocks are not a prison" as a rule.
7. Nothing here was executed; every line is a read at `f2da5a3ee`. The catalog-key grep (230 keys) was over `src/data/institutionalCatalog.js` only; `institutionServices.js` and `institutionLadders.js` were grepped for `Major port` / `Navy` / `Citadel` as quoted keys and returned nothing, but their key shapes were not extracted the way the catalog's were, so R-L8's "dead" claim is CONFIRMED for the catalog and PLAUSIBLE for the other two files.
