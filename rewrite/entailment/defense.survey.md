# THE DEFENSE DESK — ENTAILMENT SURVEY (research packet, no ruling)

Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee`. READ-ONLY; nothing staged, no suite run.
Every `file:line` below is that tree. Prepared for the chair's question of 2026-09-09 23:5x: what a recorded fact's NOUN licenses by definition, and what it does not.

---

## 0. SCOPE — the desk, its blocks, its pools

**The desk boundary is measured, not guessed.** `scripts/prose-wave-gate.mjs` carries no `--section` handling at this tip (grepped: no `section` / `desk` token in the file). The block-prefix-to-desk map lives instead in the projector, `scripts/generate-dossier-state-prose.mjs:111`:

```
{ file: 'defense', constant: 'DOSSIER_STATE_PROSE_DEFENSE', prefixes: ['DS-DEF-'], title: 'THE DEFENSE DESK' },
```

and `scripts/prose-licence-card.mjs:57` routes `'DS-DEF'` to `src/domain/display/stateProse/defenseStateProseCandidates.js`. So the desk is exactly the `DS-DEF-*` blocks: **eleven blocks, 126 census rows, 80 RESOLVED and 46 WIRING-UNRESOLVED**.

| Block | Annex line | Subject | Census rows (RESOLVED / total) |
|---|---|---|---|
| DS-DEF-1 | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500` | Defensive posture header | 8 / 8 |
| DS-DEF-2 | `:2568` | Threat assessment, the five readiness rows | 26 / 26 |
| DS-DEF-3 | `:2727` | Public order banner | 7 / 7 |
| DS-DEF-4 | `:2790` | Criminal structure + capture consequence | 9 / 9 |
| DS-DEF-5 | `:2862` | Armed forces and fortifications | 11 / 11 |
| DS-DEF-6 | `:2939` | Supporting capabilities | 8 / 21 (13 C3-blocked) |
| DS-DEF-7 | `:3069` | Live defense readiness + war front | 0 / 11 (block DARK) |
| DS-DEF-8 | `:3149` | Active military status | 3 / 4 |
| DS-DEF-9 | `:3191` | Viability › magic dependency | 3 / 3 |
| DS-DEF-10 | `:3228` | The five arms, badges, fifteen postures | 0 / 22 (block DARK) |
| DS-DEF-11 | `:5963` | Why the wall, and why not | 5 / 5 |

DS-DEF-7 and DS-DEF-10 are declared dark by measurement at `src/domain/display/stateProse/defenseStateProse.js:28-34`; DS-DEF-6's four blocked lens families are listed at `defenseStateProse.js:1496-1503` (`DEF6_C3_BLOCKED_POOLS`). **A dark pool still carries an entailment risk the day it lights**, so every row below covers dark pools too and marks them.

### 0.1 Licence cards executed (12, across 8 blocks)

`node scripts/prose-licence-card.mjs <block> '<pool>'`, run in the dock. Verbatim grammar of the card's two closing lines, which is what a writer sees:

| Block :: pool | `source` line | `may claim` | `may NOT` |
|---|---|---|---|
| DS-DEF-1 :: `readiness STRONG` | `(none) · standing SOURCE-UNRESOLVED` | that the reader `scoreBand(readinessScore)` selects the row `STRONG` of `READINESS_ROW_POOL`, as a STANDING fact of the record | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-DEF-2 :: `Beasts & Monsters: plagued, perimeter AND organized force` | `muster · standing LICENSED` | selects the row `plagued country, perimeter and force` of `BEASTS_ROW_POOL` | …, another civic object of the class `wall` |
| DS-DEF-2 :: `Disasters & Famine: granary AND parish care only` | `(none) · SOURCE-UNRESOLVED` | selects the row `granary, parish care` of `DISASTER_ROW_POOL` | …, another civic object of the class `temple` |
| DS-DEF-3 :: `Dangerous` | `(none) · SOURCE-UNRESOLVED` | selects the row `Dangerous` of `PUBLIC_ORDER_ROW_POOL` | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-DEF-4 :: `structure organized` | `(none) · SOURCE-UNRESOLVED` | that the key `key` selects the row `organized` of `CRIMINAL_STRUCTURE_POOL` | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-DEF-5 :: `watch PRESENT` | `muster + watch · LICENSED · two-source row · a STATE ORGAN (interested where the town is captured)` | that `present` (truthy (no literal)) holds, as a STANDING fact | …, another civic object of the class `force` |
| DS-DEF-5 :: `charter hall PRESENT (specialist monster response)` | `muster · LICENSED` | that `present` (truthy) holds | …, another civic object of the class `hall` |
| DS-DEF-6 :: `Logistics & Supply: Granary + port` | `(none) · SOURCE-UNRESOLVED` | selects the row `granary, port` of `SUPPLY_LOGISTICS_ROW_POOL` | …, another civic object of the class `road` |
| DS-DEF-6 :: `Naval Defense: Under blockade` | `toll-bar · LICENSED` | that `blockaded` (truthy) holds | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-DEF-9 :: `magicDependency true` | `muster · LICENSED` | that `magicDependency` holds | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-DEF-11 :: `WALLED-THREATENED` | `muster + road · LICENSED · two-source row` | that `present` holds | …, another civic object of the class `wall` |
| DS-DEF-11 :: `WALLED-STRAINED` | `muster · LICENSED` | that `military` (< 1) holds, as a STANDING fact | …, another civic object of the class `wall` |
| DS-DEF-11 :: `UNWALLED-LARGE` | `muster · LICENSED` | that `present` holds | …, another civic object of the class `wall` |

**What the card grammar already says, and what it does not.** The card's `may NOT` line is a list of ILLOCUTION classes (count, cause, season, future, standpoint, second fact) plus a CIVIC-OBJECT-CLASS exclusion (`wall`, `force`, `hall`, `road`, `temple`, `law`, `care`, `store`, `storehouse` — the closed list at `src/domain/prose/wiringCensus.js:1301-1315`). It says nothing about the **definitional content of the noun the pool renders**. The owner's question lives exactly in that gap: the card forbids "a count", so `two hundred on the walls` is already refused; it does not forbid "the palisade is timber", because that is not a count, a cause, a season, a future, a standpoint or a second fact — it is a property of the word. That is the space the rows below map.

---

## 1. SLOT NOUNS OF THE DESK — every slot any DS-DEF variant names

Union of every `**SLOTS:**` line across the eleven blocks. Shapes from `defenseStateProse.js:122-124` (`SLOT_FILL_SHAPES`) and from each licence card's `bag:` line.

| Slot | Shape | Blocks naming it | Actually filled? | Fill source (file:line) | What the fill IS, exactly |
|---|---|---|---|---|---|
| `{settlement}` | proper | all 11 | YES, every block | `settlement.name` via `properFill` — `defenseStateProse.js:623`, `:960`, `:1084`, `:1371` | the town's generated proper name |
| `{defwork}` | bare-common | DS-DEF-11 | YES | `defworkFill(forces)` — `defenseStateProse.js:1027-1036`; gate list `DEFWORK_WORDS` at `:1003` | the town's FIRST STANDING wall-bucket institution NAME, lowercased, only if the name contains `wall`/`citadel`/`palisade`/`earthwork`; otherwise `undefined` and the variant is dropped |
| `{seat}` | proper | DS-DEF-4 | YES | `properFill(text(power.government))` — `defenseStateProse.js:961` | `powerStructure.government`, e.g. *Town Council*, *Headman's Authority*, *Grand Merchant Oligarchy* |
| `{good}` | bare-common | DS-DEF-4, DS-DEF-9, DS-DEF-10 | YES on DS-DEF-9 only | `namedMagicChainGood(activeChains)` — `defenseStateProse.js:1715-1728` | `activeChains[i].outputs[0]` of the FIRST chain carrying a `magicNote`, lowercased; refused if it has an interior capital or a parenthetical. **Never the chain `label`** (the trade), always the commodity |
| `{band}` | RESERVED | all 11 | NO — reserved by the contract | every licence card's `bag:` line | never filled anywhere on this desk |
| `{route}` | proper | DS-DEF-1, DS-DEF-2, DS-DEF-6 | NO — measured absence | `defenseStateProse.js:1619-1626` | "the estate has no PROPER-shaped route name anywhere on a settlement… `tradeAccess` is the common noun `road` / `port` / `isolated`". The one variant naming it is dropped by anchored liveness |
| `{counterpart}` | proper | DS-DEF-1, 5, 6, 7, 8, 10 | NO at this tip | census rows for DS-DEF-7/10 are WIRING-UNRESOLVED | the besieger / occupier / creditor name; lives in `warStatus.besiegedBy[]` (`src/domain/display/warStatus.js:283-298`) and `occupiedSettlements(...).occupier` (`src/domain/display/occupationStatus.js:74-76`) |
| `{faction}` | proper | DS-DEF-3, DS-DEF-4, DS-DEF-5 | NO | no fill in any desk entry point | — |
| `{npc}` | proper | DS-DEF-4 | NO | no fill; and the block's own fence forbids naming the compromised person (`RECEIPT_POOLS_DOSSIER_STATE.md:2805`) | — |
| `{institution}` | proper | DS-DEF-6, DS-DEF-9 | NO | no fill in `defenseSupportingProse` / the DS-DEF-9 desk | — |
| `{reason}` | (dark) | DS-DEF-7, DS-DEF-8, DS-DEF-10 | NO (blocks dark) | would be `causalState` contributor `.reason` — `src/domain/causalState.js:486-488`, produced at `:1044-1053`, `:359-364` | **a whole English SENTENCE ending in a period**, e.g. `Defense readiness score: 62.` / `Defensive walls in place.` / `<Condition label> taxes defense readiness.` — see §5 row L-13 |
| `{timeband_since}` | (dark) | DS-DEF-7, DS-DEF-10 | NO (blocks dark) | — | — |

---

## 2. RECORDED NAME CLASSES A FACE OF THIS DESK CAN RENDER — members enumerated from the engine

The desk classifies institutions **twice, through two different tables that do not agree**. Both are enumerated. Membership below was produced by importing `src/data/institutionalCatalog.js` (280 distinct names across six tiers) and applying each table's own keyword list, in the dock.

### 2.1 The DEFENCE BUCKET table — `src/domain/institutions/defenseInstitutionBuckets.js:83-109`

This is what `standingDefenseForces()` (`:169-182`) partitions, and it is what **DS-DEF-2, DS-DEF-5 and DS-DEF-11 read** (`defenseStateProse.js:623-626`, `:1370`, `:1083`). Substring match over `nativeSemanticName` lowercased (`:137-138`).

| Bucket | Keywords (file:line) | Catalogue members (name @ tier/category, catalog line) |
|---|---|---|
| `walls` | `wall`, `citadel`, `palisade`, `earthwork`, `inner citadel`, `massive walls` — `:84-87` | **Palisade** @ thorp/Infrastructure `institutionalCatalog.js:97` · **Palisade or earthworks** @ hamlet+village/Defense `:342`, `:874` · **Town walls** @ town/Defense `:1332` · **Gates (if walled)** @ town/Defense `:1356` (matched on `wall` inside "walled") · **City walls and gates** @ city/Defense `:1910` · **Citadel** @ city/Defense `:1931` · **Massive walls and fortifications** @ metropolis/Defense `:2347` |
| `garrison` | `garrison`, `barracks`, `professional guard`, `professional city watch`, `multiple garrison` — `:88-91` | **Barracks** @ town/Defense `:1363` · **Garrison** @ city/Defense `:1925` · **Professional city watch** @ city/Defense `:1918` · **Multiple garrisons** @ metropolis/Defense `:2355` |
| `militia` | `citizen militia`, `militia` — `:92-94` | **Citizen militia** @ hamlet `:335`, village `:867`, town `:1340` |
| `watch` | `town watch`, `city watch`, `professional city watch` — `:95-97` | **Town watch** @ town/Defense `:1348` · **Professional city watch** @ city/Defense `:1918` |
| `mercenary` | `mercenary company`, `mercenary quarter`, `hired muscle` — `:98-100` | **Mercenary quarter** @ city/Adventuring `:2182` — *and nothing else in the shipped roster* |
| `charter` | `adventurers' charter hall`, `adventurers' guild hall`, `multiple adventurers'` — `:101-104` | **Adventurers' charter hall** @ hamlet `:325`, village `:837`, town `:1443` · **Multiple adventurers' guilds** @ city/Adventuring `:2175` |
| `magicDef` | `wizard`, `mages' guild`, `mage`, `academy of magic`, `golem workforce`, `alchemist` — `:105-108` | **Hedge wizard** @ village · **Traveling hedge wizard** @ hamlet · **Wizard's tower** @ town+city · **Mages' guild** @ city · **Mages' district** @ metropolis · **Academy of magic** @ metropolis · **Alchemist shop** @ town · **Alchemist quarter** @ city · **Golem workforce** @ city/Exotic |

The keywords `inner citadel`, `massive walls`, `professional guard`, `hired muscle` and `adventurers' guild hall` match **no shipped catalogue row**; the module's own comment says they "document the catalogue rows the bucket was written for" (`:76-80`).

### 2.2 The INST-FLAG table — `src/generators/priorityHelpers.js:41-81`

This is what `computeDefenseScores` reads for every score (`defenseGenerator.js:540`, `:160-165`), what `safetyProfile.js` reads for every safety sentence, and — crucially — what the desk reads through `economicState.compound.inst` for **DS-DEF-2's Internal Security and Disasters rows and DS-DEF-6's Logistics and Naval rows** (`defenseStateProse.js:657-666`, `:1648-1655`; `compound` is `getInstFlags(...)` at `src/generators/economy/economicState.js:51`, `:872`).

| Flag | Keywords (file:line) | Catalogue members |
|---|---|---|
| `hasWalls` | `walls`, `citadel`, `gates (if walled)`, `inner citadel`, `massive walls`, `palisade`, `earthwork` — `:52` | same seven as the bucket, reached by different keys (note: **`walls` PLURAL**, not the bucket's singular `wall`) |
| `hasGarrison` | `garrison`, `barracks`, `professional guard`, `professional city watch`, `multiple garrison` — `:46` | Barracks · Garrison · Professional city watch · Multiple garrisons |
| `hasMilitia` | `citizen militia`, `militia` — `:47` | Citizen militia |
| `hasWatch` | `town watch`, `city watch`, `professional city watch` — `:48` | Town watch · Professional city watch |
| `hasMercenary` | `mercenary company`, `mercenary quarter`, `hired muscle`, **`hireling hall`**, **`free company hall`**, **`veteran's lodge`** — `:49` | Mercenary quarter `:2182` · **Free company hall** @ town/Defense `:1370` · **Veteran's lodge** @ village/Defense `:881` · **Hireling hall** @ town/Adventuring `:1436` |
| `hasCharterHall` | `adventurers' charter hall`, `adventurers' guild hall`, `multiple adventurers'`, `adventurers' guild`, **`hireling hall`** — `:51` | Adventurers' charter hall · Multiple adventurers' guilds · **Hireling hall** |
| `hasMilitaryInst` | `garrison`, `barracks`, `guard`, `watch`, `citadel`, `walls`, `militia`, `mercenary`, `navy`, `charter hall` — `:45` | 12 rows; **does NOT include Palisade, Palisade or earthworks, or Gates (if walled)** |
| `hasCourtSystem` | `courthouse`, `court buildings`, `democratic assembly`, `city hall`, `town hall` — `:55` | Courthouse @ town `:1557` · **Town hall @ town `:1550` (`required:true, baseChance:1`)** · Multiple courthouses @ city `:2275` · **City hall @ city `:2268` (`required:true, baseChance:1`)** · Democratic assembly @ city `:1884` · Multiple court buildings @ metropolis `:2338` |
| `hasPrison` | `prison`, `stocks`, `large prison`, `massive prison` — `:54` | **Small prison/stocks** @ town `:1564` (desc: *Holding cells and public punishment*) · Large prison @ city `:2282` · Massive prison @ metropolis `:2514` |
| `hasGranary` | `granar` — `:63` | Town granary @ town `:925` (`required:true, baseChance:1`) · City granaries @ city `:1590` · State granary complex @ metropolis `:2505` |
| `hasHospital` | `hospital`, **`monastery`**, **`healer`**, **`friary`** — `:64` | Small hospital @ town `:1275` · Major hospital @ city `:1814` · Hospital network @ metropolis · **Monastery or friary** @ town `:1267` · **Healer (divine, 1st level)** @ village `:845` |
| `hasChurch` | `church`, `cathedral`, `temple`, `monastery`, `friary`, **`shrine`**, `priest`, `abbey` — `:65` | **Wayside shrine** @ thorp `:42`, hamlet `:292` · **Access to parish church** @ thorp `:50`, hamlet `:300` · Parish church @ village · Priest (resident) @ village · Parish churches (2-5)/(10-30)/(50-100+) · Monastery or friary · Cathedral (10,000+ only) · Great cathedral |
| `hasPort` | regex `\b(?:port|docks?|harbou?r|shipyard|navy)\b` — `:32`, `:61` | Docks/port facilities @ town `:987`, city `:1652` · Shipyard @ town `:1025`, city `:1676` · Harbour master's office @ city `:1726` |
| `hasNavy` | `navy`, `major port` — `:62` | **NONE. Zero shipped catalogue rows match.** |
| `hasMagicInst` | `wizard`, `mage`, `alchemist`, `enchant`, `arcane`, `academy of magic`, `scroll scribe`, `spellcasting`, `hedge wizard` — `:68` | the nine `magicDef` rows PLUS **Enchanter's shop** @ city and **Scroll scribe** @ city |

### 2.3 The CRIMINAL-STRUCTURE classifier — `src/domain/display/defenseDisplay.js:183-195`

Reads `(i?.name || '')` — the **raw** name, not `nativeSemanticName`, so unlike §2.1 it does reach custom content.

| Key | Predicate (file:line) | Catalogue members it catches |
|---|---|---|
| `organized` | `thieves' guild` / `thieves guild` OR `multiple criminal` / `underground city` / `front business` — `:186-187` | Thieves' guild chapter @ city · Thieves' guild (powerful) @ metropolis · Multiple criminal factions @ city · Underground city @ metropolis · Front businesses @ town+city |
| `semi-organized` | `smuggling` / `black market` / `gambling` — `:188` | Smuggling waypoint @ hamlet · Smuggling network @ village+city · Smuggling operation @ town · Black market @ city · Black market bazaar @ metropolis (+ the gambling rows) |
| `diffuse` | `fence` / `bandit` / `outlaw` — `:189` | Local fence @ thorp · Outlaw shelter @ thorp · Fence (word of mouth) @ hamlet+village · Bandit affiliate @ hamlet |
| `null` | none of the above — `:190-193` | **Underground network** @ village/town/city `:912`,`:1489`,`:2024` · **Street gang** @ town `:1466` · **Rookery** @ town `:1503`, city `:2075` · **Contract killer** @ city · **Kidnapping ring** @ city · **Human trafficking network** @ city · **Whisper market** @ city · **Assassins' guild** @ metropolis `:2459` |

### 2.4 Ladder / band / posture vocabularies (the "tier words", "posture words", "status labels")

| Vocabulary | Members | Definition (file:line) |
|---|---|---|
| Settlement tier | `thorp` · `hamlet` · `village` · `town` · `city` · `metropolis` | `src/data/constants.js:3`; small/large cut `SMALL_TIERS` `:5` / `TOWN_PLUS_TIERS` `:4` |
| Per-arm badge (frozen four, never extend) | `STRONG` ≥65 · `ADEQUATE` ≥40 · `WEAK` ≥20 · `CRITICAL` <20 | `src/domain/display/defenseScoreBands.js:38-39`; readings `src/domain/compendium/bandLadders.js:202-207` |
| Overall readiness label (six rungs) | `Fortress` ≥76 · `Well-Defended` ≥55 · `Defensible` ≥38 · `Lightly Defended` ≥24 · `Vulnerable` ≥12 · `Undefended` <12 | `src/generators/defenseGenerator.js:515-521` |
| Safety label (base five) | `Very Safe` ≥3.5 · `Safe` ≥2.0 · `Moderate` ≥1.2 · `Unsafe` ≥0.6 · `Dangerous` <0.6 | `src/generators/safetyProfile.js:253-305`; readings `bandLadders.js:188-195` |
| Safety label (crisis overrides) | `Controlled — Authoritarian` · `Dangerous — Criminal Governance` · compound `<strain> — <condition>[ + <condition>…]` | `safetyProfile.js:227-249`; strain words `Tense`/`Strained`/`Desperate`/`Volatile`/`Suspicious`/`Quarantined`/`Restricted`/`Critical` at `:112-218` |
| Safety display severity | `dangerous` · `unsafe` · `controlled` · `stable`, plus a LOUD `unknown` | `src/domain/display/safetySeverity.js:29`, `:45`, `:54-59` |
| Monster-threat tier (canonical) | `heartland` · `frontier` · `plagued` | `src/data/monsterThreat.js:28` |
| Terrain | `Coastal` · `Riverside` · `Mountain` · `Forest` · `Plains` · `Hills` · `Desert/Arid` | `src/data/geographyData.js:50-720` |
| Live defense-readiness band (DS-DEF-7, dark) | `surplus` ≥75 · `adequate` ≥50 · `strained` ≥30 · `critical` ≥15 · `collapsed` <15 | `src/domain/causalState.js:423-427`, `:444-449` |
| Military posture (fifteen, DS-DEF-8/10) | ACTIVE SIEGE · INTERNAL PRESSURE · UNDER OCCUPATION · COMMAND SPLIT · UNDER TRIBUTE · SECURITY COMPROMISED · INFILTRATION ACTIVE · QUARANTINE ACTIVE · SUCCESSION CONTESTED · BEAST PRESSURE · INSURGENCY ACTIVE · RELIGIOUS UPHEAVAL · REVOLT ACTIVE · WAR FOOTING · MIGRATION SURGE | `src/domain/display/defenseDisplay.js:25-41`; derived total over `STRESS_TYPE_MAP` at `:61-68` |
| Criminal capture rung | `none` · `adversarial` · `equilibrium` · `corrupted` · `capture` | `defenseStateProse.js:908-915` bound to `src/generators/power/rulingStructure.js:797` |
| Supporting-capability status labels | `Well-funded`/`Adequate`/`Underfunded`/`Critical` · `Arcane support`/`None` · `Court + Prison`/`Court only`/`Prison only`/`None` · `Hospital present`/`Clergy care`/`None` · `Granary present`/`No reserves` · `Under blockade`/`Naval force`/`Port only` | `src/domain/display/defenseDisplay.js:219`, `:225`, `:231`, `:237`, `:243`, `:259` |
| Holder kinds this desk's facts resolve to | `muster` (12 fields) · `watch` (4) · `toll-bar` (3) · `road` (2) | `src/domain/prose/holderTable.js:188-199`, `:202-212`, `:183-185`, and the road rows at `:207`+ (`monsterThreat`, `terrainType`) |
| Civic object classes (the card's exclusion list) | `wall` · `force` · `store` · `market` · `law` · `temple` · `road` · `hall` · `care` · `craft` · `storehouse` | `src/domain/prose/wiringCensus.js:1301-1315` |

---

## 3. ENTAILMENT CANDIDATES — the rows

Format per the chair's ask: NOUN · NAME CLASS (members + file:line) · ENTAILS (definitional, rides with the word) · NOT ENTAILED (typical association the word does not carry) · ENGINE CONTRADICTS (a real-world entailment the engine's own rules refuse).

Where a member's own `desc` states a property, that property is **recorded** and the entailment is not merely definitional — it is a fact of the record and needs no new law. Those are marked **[RECORDED]**. Where the noun alone would carry it, it is marked **[DEFINITIONAL]** and is the class the owner's question is about.

---

### E-1 · `palisade` — the wall class, timber member

- **Name class**: `walls` bucket, `defenseInstitutionBuckets.js:84-87`. Member: **Palisade**, `institutionalCatalog.js:97` (thorp/Infrastructure), desc *"Sharpened stakes encircling the settlement. Offers minimal protection but enough to deter casual raiders."*
- **ENTAILS**
  - timber / wood **[RECORDED]** — "sharpened stakes"; also `Palisade or earthworks` desc `:345` "Basic **wooden** palisade or earthwork berm".
  - a continuous enclosure of the settlement **[RECORDED]** — "encircling the settlement".
  - a chokepoint / control of approach **[RECORDED]** — village row `:877` "Controls approach, slows attackers".
  - low protective value against a determined force **[RECORDED]** — "minimal protection… deter casual raiders".
- **NOT ENTAILED**: height; a gate (the row names none); a walkway or fighting platform; anyone standing on it; age; condition; who built it; whether it has ever been attacked; a count of stakes or of gates; whether it encloses fields as well as houses.
- **ENGINE CONTRADICTS**
  - **timber rots / needs replacing.** The engine's upkeep law is explicit that built work does not degrade: `defenseGenerator.js:186-187` — *"Floor 0.6: **built walls keep standing** and unpaid soldiers desert slowly, never instantly."* The upkeep gate multiplies the MILITARY SCORE, never the wall's existence. A face on timber decaying is more knowledgeable than the simulation, and in the direction the simulation refuses.
  - **stone would be better here / they could not afford stone.** The engine has no build-cost model tying material to wealth; the only material fact is the ROW's own desc and the terrain's `timberAvailability` / `stoneAvailability` (`geographyData.js:70-71`, `:146-147`, `:229-230`, `:331-332`, `:439-440`, `:544-545`, `:640-641`), which gate resources and institution weights, not wall material.

---

### E-2 · `earthwork` / `earthworks` — the wall class, earth member

- **Name class**: same bucket. Member: **Palisade or earthworks**, `institutionalCatalog.js:342` (hamlet), `:874` (village).
- **⛔ THE DISJUNCTION IS THE RECORD.** The row's NAME is *"Palisade **or** earthworks"* and its desc is *"Basic wooden palisade **or** earthwork berm"* (`:345`) / *"Perimeter palisade **or** earthwork berm"* (`:877`). **The engine has not decided which one this town has.**
- **ENTAILS**: an enclosure that controls approach and slows attackers **[RECORDED]**; that the work is one of {timber palisade, earth berm} **[RECORDED]**.
- **NOT ENTAILED**: **that it is timber**; **that it is earth**; height; a ditch (a berm implies spoil but the row does not name a ditch); revetment; a gate; manning; age.
- **ENGINE CONTRADICTS**: any face that resolves the disjunction. "The bank around {settlement} was thrown up in a season" and "{settlement}'s stakes were cut from its own woods" are both *more knowledgeable than the simulation*, and each is false of half the towns that draw the pool.
- **⚠ AND THIS NOUN REACHES THE READER.** `{defwork}` fills from the recorded name lowercased (`defenseStateProse.js:1027-1036`), and `bareCommonFill` (`:1010-1018`) accepts `"palisade or earthworks"` — no leading determiner, no dash, no digit, no sentence punctuation. So DS-DEF-11 can render *"{settlement} keeps its **palisade or earthworks** because the country requires it"*. Whatever the chair rules about material, the rendered noun itself is a disjunction.

---

### E-3 · `wall` / `walls` (the stone members)

- **Name class**: `walls` bucket. Members with a recorded material:
  - **Town walls**, `institutionalCatalog.js:1332`, desc *"**Stone** fortifications with gates. Expensive to build and maintain."*
  - **City walls and gates**, `:1910`, desc *"**Masonry** walls with towers. Multiple gatehouses."*
  - **Massive walls and fortifications**, `:2347`, desc *"Layered wall systems: outer wall, inner wall, citadel ring. Multiple garrison zones and gatehouses."*
- **ENTAILS**
  - Town walls: stone; gates **[RECORDED, both]**.
  - City walls and gates: masonry; **towers**; **more than one gatehouse** **[RECORDED]**.
  - Massive walls: **more than one circuit** (outer, inner, citadel ring); more than one gatehouse; more than one garrison zone **[RECORDED]**.
  - All three: a controlled entry point, therefore control of who enters — this is the desk's own licensed reading (`DS-DEF-5 walls PRESENT` variant 2: *"{settlement} controls its own entry points. That is what a perimeter buys"*, `RECEIPT_POOLS_DOSSIER_STATE.md:2884`).
- **NOT ENTAILED**: height; thickness; a moat or ditch; a curtain-and-tower plan for `Town walls` (only `City walls and gates` records towers); age; who paid; whether they have held; **manning** — the corpus and the engine both treat walls-without-people as a live and common state (`DS-DEF-2 Invasion & War: walls with NO force`); condition; whether the circuit is complete.
- **ENGINE CONTRADICTS**
  - **stone endures / walls outlast the men.** This is *half* refused. `defenseGenerator.js:186-187` says built walls keep standing — so "stone endures" is CONSISTENT with the model as a statement of persistence. What the engine refuses is the CONTRAST as a discovery, because the model applies the same non-decay to timber: a palisade also keeps standing. The corpus already leans on the contrast (`DS-DEF-11 WALLED-STRAINED`: *"stone keeps itself, and wages do not"*, annex `:5982`), and the engine's asymmetry there is **built work vs paid work**, not **stone vs timber**. See §6, C-1.
  - **"expensive to maintain" (Town walls' own desc) implies decay if unmaintained.** The score model has a fortification supply chain that can be `impaired` for −4 military (`defenseGenerator.js:594-597`) and an upkeep multiplier floored at 0.6 — but no path removes a wall from the roster for want of money. Only a calamity/lifecycle ruin stamp does that (`defenseInstitutionBuckets.js:37-45`).

---

### E-4 · `citadel`

- **Name class**: `walls` bucket. Member: **Citadel**, `institutionalCatalog.js:1931` (city/Defense), desc *"**Inner fortress. Last refuge in siege.**"* Keyword `inner citadel` matches no row.
- **ENTAILS**: a stronghold **[RECORDED]**; that it is INNER — inside something else **[RECORDED]**; that it is a refuge of last resort in a siege **[RECORDED]**.
- **NOT ENTAILED**: **stone.** The engine never says so. The only place masonry and a citadel meet is `Massive walls and fortifications`' desc (`:2351`, "citadel ring") inside a metropolis wall system. A `Citadel` row on a city with no walls row records an inner fortress of unstated material.
- **NOT ENTAILED (further)**: a keep or donjon; a garrison of its own (the engine's garrison bucket is separate); height; age; that the town has ever retreated into it; a well or stores inside it.
- **ENGINE CONTRADICTS**
  - **a citadel is a perimeter.** It is not: its own desc says INNER. But the bucket puts it in `walls`, and `standingDefenseForces(...).walls.present` is then true, and `DS-DEF-5 walls PRESENT` renders *"There is a line around {settlement} and it is kept: the gates shut, the works are repaired, and a stranger enters where the town intends him to"* (annex `:2883`). For a city holding **only** a Citadel that sentence is false against the engine's own row text. See §6, C-2 and §7 A-2.

---

### E-5 · `gate`

- **Name class**: `walls` bucket, via the substring `wall` inside the name. Member: **Gates (if walled)**, `institutionalCatalog.js:1356` (town/Defense), desc *"Controlled entry points with gatekeepers."*
- **ENTAILS**: a controlled entry point **[RECORDED]**; **gatekeepers — people** **[RECORDED]**; and, in the engine's holder model, a **toll bar**: `holderTable.js:304-308` names `Gates (if walled)` as a roster backing for the `toll-bar` kind with the service *Toll collection*.
- **NOT ENTAILED**: a wall (the row's own name hedges — *if* walled); that they close at night; a portcullis; a barbican; how many; whether the gatekeepers are the watch.
- **ENGINE CONTRADICTS**: **a gate implies a wall.** The row is explicitly conditional, and nothing in generation requires `Town walls` to be present when `Gates (if walled)` is (both are `baseChance: 0.5` at town; `Town walls` carries `exclusiveGroup: 'defenseLevel'` `:1332`, `Gates (if walled)` carries none `:1356`). Yet BOTH classifiers set the walls fact from it: `defenseInstitutionBuckets.js:85` matches `wall` inside "walled"; `priorityHelpers.js:52` lists `gates (if walled)` outright. A face reading `walls PRESENT` and writing about the circuit may be writing about a town whose only wall-class row is a gate. See §7 A-3.

---

### E-6 · `perimeter` / `line` / `circuit` (the generic wall-class word)

- **Name class**: not an institution — it is the corpus's own generic for the `wall` civic object class (`wiringCensus.js:1302`: `wall: ['wall','walled','unwalled','perimeter','rampart','palisade','gate']`).
- **ENTAILS**: that at least one member of the `walls` bucket stands (`standingDefenseForces(settlement).walls.present`, `defenseInstitutionBuckets.js:175-176`).
- **NOT ENTAILED**: that the enclosure is continuous; that it is a wall rather than a gate or a citadel; material; height; manning.
- **SAFE-SPELLING NOTE**: `perimeter` is the class word and is true of every member of the bucket **except** `Citadel` (inner) and `Gates (if walled)` (a point, not a line). There is therefore **no** always-safe generic for this class the way `the muster` is safe for the force class. The safest available generic is **"the works"** or **"what the town has built"**, both of which the corpus already uses (annex `:2883` *"the works are repaired"*; `:2548` *"what the town has built"*).

---

### E-7 · `garrison`

- **Name class**: `garrison` bucket, `defenseInstitutionBuckets.js:88-91`. Members and their own texts:
  - **Garrison**, `institutionalCatalog.js:1925`, desc *"**Professional soldiers. Noble or royal.**"*
  - **Multiple garrisons**, `:2355`, desc *"Garrison forces distributed across quarters. No single barracks can secure a metropolis."*
  - **Barracks**, `:1363`, desc *"**Housing** for guards or small garrison."*
  - **Professional city watch**, `:1918`, desc *"Full-time law enforcement. ~1% of population."*
- **ENTAILS (of `Garrison` only)**: professional soldiers **[RECORDED]**; that they answer to a noble or royal authority rather than to the town **[RECORDED]**; being paid, therefore exposed to the upkeep gate (`defenseGenerator.js:182-192`).
- **ENTAILS (of `Multiple garrisons`)**: more than one; distributed **[RECORDED]**.
- **NOT ENTAILED**: numbers; whether they are local men; whether they are currently paid (that is `economicGates.military`, a separate fact); barracks (the housing is its own row); a commander; loyalty; how long they have been here; whether they have ever fought.
- **ENGINE CONTRADICTS**
  - **a Barracks is a garrison.** Its own desc is *housing*. The bucket and the flag both make it one (`:88`, `priorityHelpers.js:46`), so a town whose only garrison-class row is `Barracks` renders `DS-DEF-5 garrison PRESENT` — *"{settlement} keeps a standing force: people whose work is the defense of this town"* (annex `:2893`) — from a building. The engine's own ladder confirms they are different things: `institutionLadders.js:23` `["Barracks", "Garrison"]` is an UPGRADE PAIR, i.e. the same function at two scales, with the greater replacing the lesser.
  - **a garrison is the town's own.** `Garrison`'s desc says *noble or royal*, and the occupation posture inverts it entirely: `DS-DEF-10 UNDER OCCUPATION` (annex `:3297`) is exactly a garrison that answers elsewhere.

---

### E-8 · `militia` / `muster`

- **Name class**: `militia` bucket, `defenseInstitutionBuckets.js:92-94`. Sole member: **Citizen militia** @ hamlet `:335`, village `:867`, town `:1340`. Descs: *"Able-bodied residents drill and muster against local threats. Part-time service."* / *"Organised community defense. Musters for raids and monster incursions. More reliable than hamlet levies."* / *"All able-bodied citizens obligated to defend town. Part-time service. **Present only when no professional watch exists.**"*
- **ENTAILS**: townspeople, not soldiers **[RECORDED]**; part-time **[RECORDED]**; that raising them takes them off other work **[RECORDED, by "part-time"; the corpus already states it: annex `:2898`]**; an obligation at town tier **[RECORDED]**; drilling at hamlet/village **[RECORDED]**; **a roll** — this is the one institution in the shipped roster that keeps a muster (`holderTable.js:280-288`: *"ONE institution in the whole shipped roster keeps a muster: the Citizen militia. A town with a Garrison and no militia has men under arms and no roll of them"*).
- **NOT ENTAILED**: numbers; arms or their quality; that they have ever mustered; competence; who calls them out; whether the obligation is enforced.
- **ENGINE CONTRADICTS**
  - **a militia and a watch coexist.** At town tier they cannot: `Citizen militia` carries `exclusiveGroup: 'civilianDefense'` (`:1340`) and so does `Town watch` (`:1348`), and the militia desc says outright *"Present only when no professional watch exists."* A face pairing them at town tier states an impossible roster.
  - **the muster is the town's roll of everyone under arms.** It is not: a garrison town has men under arms and no muster (holder note above).

---

### E-9 · `watch`

- **Name class**: `watch` bucket, `defenseInstitutionBuckets.js:95-97`. Members: **Town watch** @ town `:1348`, desc *"Part-time guards. Night patrol and gate duty."*; **Professional city watch** @ city `:1918`, desc *"Full-time law enforcement. ~1% of population."*
- **ENTAILS**: keeping watch — the definitional case the owner names. Specifically: **night patrol and gate duty** (Town watch) **[RECORDED]**; **full-time law enforcement** (Professional city watch) **[RECORDED]**; that the office is about ORDER inside the settlement rather than war outside it — the corpus already licenses this (annex `:2903`) and the engine agrees by scoring the watch into `internal` (+18, `defenseGenerator.js:235`) far above `military` (+7, `:163`).
- **NOT ENTAILED**: numbers (except that `Professional city watch` records ~1% of population — a RECORDED proportion, still not a count the card permits); honesty; effectiveness; that they are armed; that they answer to the town rather than a lord; hours beyond "night" for the town watch.
- **ENGINE CONTRADICTS**
  - **"the watch" names one thing.** `Professional city watch` is in the `garrison` bucket AND the `watch` bucket (both `:89` and `:96` list it). `deriveArmedForces` has to de-duplicate the three standing buckets by name precisely because of this (`defenseDisplay.js:334-335`, `:350`).
  - **the watch is the enforcement the safety label measures.** The label measures `militaryEffective / criminalEffective` (`safetyProfile.js:44`), a ratio over every military institution, floored by a community bonus and a court floor (`:56-74`). See §5 L-6.
- **⚠ INTERESTED-FACT NOTE**: the DS-DEF-5 `watch PRESENT` licence card is the only card on this desk that prints **"a STATE ORGAN (interested where the town is captured)"**, and the row is two-source (`muster + watch`). The `watch` holder kind also holds `criminalCaptureState` and `blackMarketCapture` (`holderTable.js:210-211`).

---

### E-10 · `mercenary company` / `contracted force`

- **Name class**: `mercenary` bucket, `defenseInstitutionBuckets.js:98-100`. Sole shipped member: **Mercenary quarter** @ city/Adventuring `:2182`, desc *"Organized sellsword companies. Major forces (hundreds to thousands)."*
- **ENTAILS**: that they are paid, and that the relationship is a contract — the annex already licenses exactly this and no more (`RECEIPT_POOLS_DOSSIER_STATE.md:2874-2880`: *"they are paid, and the state carries the payment relationship, so a variant may say the contract is a contract; it may not say the contract is failing unless the economic arm supplies that"*); organized companies **[RECORDED]**; a scale of hundreds to thousands **[RECORDED — and this is the ONE place the engine records a magnitude for a defence institution]**.
- **NOT ENTAILED**: an end date or term length (the corpus's `DS-DEF-5` variant 3 says *"the engagement has an end written into it"*, annex `:2913` — the engine records no term); loyalty or its absence; who pays; whether they are foreign; whether the contract is being honoured.
- **ENGINE CONTRADICTS**
  - **the contracted force can be described from the mercenary flag.** Two different rosters exist. `inst.hasMercenary` also fires on **Free company hall** (`:1370`, *"a band of professional soldiers available between campaigns… day-wage rates… These men fight in formation on salary, not for treasure"*), **Veteran's lodge** (`:881`, *"a drinking hall where retired soldiers and mercenaries gather. **Informal** security"*) and **Hireling hall** (`:1436`, *"Job board for torchbearers… porters"*). The DEFENCE BUCKET catches **none of the three**. So a town holding a Free company hall scores +14 military as a mercenary (`defenseGenerator.js:164`) while `DS-DEF-5`'s contracted lens is SILENT (`defenseStateProse.js:1283-1285` reads `forces.mercenary.present`). See §7 A-5.

---

### E-11 · `charter hall`

- **Name class**: `charter` bucket, `defenseInstitutionBuckets.js:101-104`. Members: **Adventurers' charter hall** @ hamlet `:325`, village `:837`, town `:1443`; **Multiple adventurers' guilds** @ city `:2175`, desc *"Competing organizations."*
- **ENTAILS**: operating under a charter — a granted licence **[RECORDED at every tier: "under a regional adventurers' charter", "a licensed charter hall", "a chartered hall"]**; **posting bounties** **[RECORDED]**; **coordinating monster response** **[RECORDED]**; that the work it takes is work a garrison is the wrong instrument for **[RECORDED at town: "coordinates large-scale operations that militia cannot handle"; at hamlet: "when the garrison cannot"]**.
- **NOT ENTAILED**: numbers of hands; whether the retained specialists are here now; the charter's grantor; fees; that it is busy (the corpus asserts *"and finds it busy"*, annex `:2920` — unrecorded); how long it has held the charter.
- **ENGINE CONTRADICTS**
  - **"Multiple adventurers' guilds" is a charter hall.** Its own desc is *"Competing organizations"* and carries no charter word; the bucket catches it on `multiple adventurers'` (`:103`). A face that says *"{settlement} keeps a charter for specialist work"* (annex `:2918`) is asserting a licence the city row does not record.
  - **the absence of a charter hall is a finding.** Only where the country warrants one: `countryWarrantsCharter` is true for `frontier` and `plagued` only (`defenseStateProse.js:1241-1243`).

---

### E-12 · `granary` / `the stores`

- **Name class**: `hasGranary` keyword `granar`, `priorityHelpers.js:63`. Members: **Town granary** `:925` (`required: true`, `baseChance: 1`), desc *"Communal grain storage. Buffers harvests, prevents famine."*; **City granaries** `:1590`; **State granary complex** `:2505`.
- **ENTAILS**: that grain is stored **[RECORDED]**; that the store buffers a harvest **[RECORDED]**; communal ownership at town **[RECORDED]**.
- **NOT ENTAILED**: how full it is; how many months it holds (that is `foodSecurity.storageMonths`, a separate fact — `defenseGenerator.js:263-269`); who controls the key; whether it has been drawn on; a count of buildings.
- **ENGINE CONTRADICTS**: **a granary means the town can eat through a bad year.** The economic score gates the granary's value on the purse: `econHealthMult` down to ×0.45 (`defenseGenerator.js:281-290`), and the disaster arm is gated again at floor 0.55 (`:608-618`). The corpus's own `granary, NO medical provision` cell already says *"{settlement} can feed itself through a failed harvest"* (annex `:2711`) — which the engine's gates can make false.
- **⚠ CLASS NOTE**: `granary` LEFT the `store` civic class at REWRITE 8a-8 and now sits in `storehouse` (`wiringCensus.js:1307-1322`). The building and the stock are two different civic objects; a lone `granary` key still reads as `store` (`:1319-1322`).

---

### E-13 · `hospital` / `infirmary`

- **Name class**: `hasHospital`, `priorityHelpers.js:64`. Members: **Small hospital** `:1275`, **Major hospital** `:1814`, **Hospital network** (metropolis), **Monastery or friary** `:1267`, **Healer (divine, 1st level)** `:845` (desc: *"Basic healing spells. A closed wound costs 10 in gold."*).
- **ENTAILS (of a hospital row)**: somewhere to put the sick; casualty treatment and outbreak containment — the engine's own note, `defenseDisplay.js:239`.
- **NOT ENTAILED**: beds; physicians; a count; that it can contain the outbreak it faces; funding.
- **ENGINE CONTRADICTS**: **the "Hospital present" reading means a hospital.** Two of the five members are not one: a **Monastery** and a **single first-level divine Healer** both set the flag. A village whose only medical row is `Healer (divine, 1st level)` draws `DS-DEF-2 Disasters & Famine: granary AND hospital` — *"has somewhere to put the sick"* (annex `:2701`). See §5 L-8.

---

### E-14 · `church` / `parish` / `clergy`

- **Name class**: `hasChurch`, `priorityHelpers.js:65`. Ten members, including **Wayside shrine** `:42`/`:292` (desc: *"**Simple prayer marker. No resident clergy.**"* / *"Simple prayer location. **No clergy.**"*) and **Access to parish church** `:50`/`:300` (desc: *"**Walk 2-5km to village church** for services."*).
- **ENTAILS (of an actual church row)**: consecrated ground; a place of observance.
- **NOT ENTAILED**: resident clergy; a priest; medical capability; wealth; age; a bell.
- **ENGINE CONTRADICTS**: **`Clergy care` / "clergy who tend the sick" from `hasChurch`.** The two thorp/hamlet members of the class are a **marker with no clergy** and a **church in another settlement**. `DS-DEF-2 Disasters & Famine: granary AND parish care only` renders *"there are clergy who tend the sick"* (annex `:2706`) — flatly contradicted by both rows' own desc text. This is the sharpest engine-contradiction on the desk. See §5 L-9, §6 C-4.
- **⚠ DEITY DOCTRINE**: the licence card's standing refusal covers *a theological claim about a deity*. Faith-class nouns on this desk carry no theology at all.

---

### E-15 · `court` / `courthouse` / `the law`

- **Name class**: `hasCourtSystem`, `priorityHelpers.js:55`. Six members: **Courthouse** `:1557`, **Multiple courthouses** `:2275`, **Multiple court buildings** `:2338`, **Democratic assembly** `:1884` (desc: *"A citizen assembly holds formal authority; eligible voters debate and vote on major ordinances and appointments."*), **Town hall** `:1550` (desc: *"Meeting place and administrative center."*, `required: true`, `baseChance: 1`), **City hall** `:2268` (desc: *"Impressive civic building."*, `required: true`, `baseChance: 1`).
- **ENTAILS (of a courthouse row)**: a process, a procedure that runs — the corpus's licensed reading (annex `:2661`).
- **NOT ENTAILED**: judges; a code of law; sentencing powers; that judgments are enforced (the corpus already splits enforcement off into the prison branch); impartiality.
- **ENGINE CONTRADICTS**: **`hasCourtSystem` means a court.** `Town hall` and `City hall` are `required: true, baseChance: 1` at their tiers, so **every generated town and city sets the flag**, and `DS-DEF-2 Internal Security: no legal infrastructure` and `detention without process` are effectively unreachable at town+. A face writing *"{settlement} can arrest, try and hold"* (annex `:2660`) may be describing a meeting hall. See §5 L-10.

---

### E-16 · `prison` / `gaol` / `detention`

- **Name class**: `hasPrison`, `priorityHelpers.js:54`. Members: **Small prison/stocks** `:1564` (desc: *"Holding cells and **public punishment**."*), **Large prison** `:2282`, **Massive prison** `:2514`. The engine's own ladder pairs them: `institutionLadders.js:51` `["Small prison/stocks", "Large prison"]`.
- **ENTAILS**: that people can be held **[RECORDED, "holding cells"]**; at town, that punishment is public as well **[RECORDED]**.
- **NOT ENTAILED**: capacity; conditions; sentences; a gaoler; that anyone is currently held.
- **ENGINE CONTRADICTS**: **"detention" from `stocks`.** The town row is one row spanning cells and a pillory; the keyword `stocks` (`:54`) would set the flag from a pillory alone were a stocks-only row ever added.

---

### E-17 · `port` / `docks` / `harbour`

- **Name class**: `hasPort` regex `\b(?:port|docks?|harbou?r|shipyard|navy)\b`, `priorityHelpers.js:32`, `:61`. Members: **Docks/port facilities** `:987`, `:1652`; **Shipyard** `:1025`, `:1676`; **Harbour master's office** `:1726`.
- **ENTAILS**: water access for bulk trade **[RECORDED: "Essential for bulk water trade and river transport"]**; that supply can arrive by water — the engine models this directly (`defenseGenerator.js:273-275`: *"sea supply cannot be cut by a land siege"*, +10 economic when `route === 'port'` and the world supports maritime).
- **NOT ENTAILED**: the SEA. The regex and the row both cover **river** ports (`:987` *"River or coastal dock"*); the `Harbour master's office` desc says *"Navigable-water cities only."* A face writing "the sea approaches" from `hasPort` may be describing a river quay.
- **ENGINE CONTRADICTS**: **a shipyard is a port.** The regex says yes; the row is a building yard. And the DS-DEF-6 producer's own naval note speaks of *"sea approaches"* (`defenseDisplay.js:268-269`) off a flag a river shipyard sets.

---

### E-18 · `navy` / `fleet`

- **Name class**: `hasNavy`, keywords `navy`, `major port` — `priorityHelpers.js:62`.
- **MEMBERS: NONE.** Measured over the whole shipped catalogue (280 names): **zero rows match**. The regex comment at `:29-32` says as much in passing — *"(and Major port/Navy if ever cataloged)"*.
- **CONSEQUENCE**: `DS-DEF-6 Naval Defense: Naval force` is **unreachable from a native roster** at this tip. `navalDefensePoolKey(navy, port, blockaded)` (`defenseStateProse.js:1608-1612`) can only return `Port only` or `Under blockade`. The census confirms the pool is RESOLVED but the producing flag has no producer.
- **NOT ENTAILED**: everything — there is no member to carry an entailment.

---

### E-19 · `arcane defense` / `wards`

- **Name class**: `magicDef` bucket, `defenseInstitutionBuckets.js:105-108`. Nine members (§2.1).
- **ENTAILS**: the presence of practitioners of the named kind (a wizard's tower entails a wizard; an alchemist quarter entails alchemists) **[DEFINITIONAL, and the engine agrees: `defenseGenerator.js:93-119` gates each tradition on the name]**.
- **NOT ENTAILED**: **wards, detection, or counterspells.** The corpus asserts all three (`DS-DEF-5 arcane defense PRESENT`: *"detection, wards, and an answer to things that conventional arrangements cannot see coming"*, annex `:2928`), and the engine records none of them — the bucket is a name match and the score is a presence number (`defenseGenerator.js:292-331`). Also NOT entailed: that the practitioners work for the town; that the defence is standing rather than for hire; a count.
- **ENGINE CONTRADICTS**: **an alchemist is an arcane defence.** `alchemist` is a `magicDef` keyword (`:107`), so an `Alchemist shop` renders *"{settlement} keeps arcane provision in its defenses"*. The generator itself treats alchemy as an *amplifier* tradition with the lowest magic threshold (`defenseGenerator.js:117-119`) and gives it **no** military or monster deterrence term.
- **⚠ WORLD-SETTING GATE**: the lens is silent, not false, where `magicWorksAt(settlement) === false` (`defenseStateProse.js:1319-1322`, `src/domain/worldPulse/magicWorksAt.js:49-53`).

---

### E-20 · `terrain` (the ground the town stands on)

- **Name class**: `TERRAIN_DATA[k].name`, `src/data/geographyData.js:50`. Seven members with their `strategicValue` strings:

| Terrain | `strategicValue` (file:line) | stone / timber availability |
|---|---|---|
| Coastal | *High - controls sea routes and naval access* `:126` | medium / medium `:70-71` |
| Riverside | *Medium - controls river crossing and inland trade* `:208` | low / high `:146-147` |
| Mountain | *High - **defensible position**, controls mountain passes, mineral wealth* `:310` | very high / medium `:229-230` |
| Forest | *Low-Medium - provides timber and game, **difficult to besiege*** `:418` | low / very high `:331-332` |
| Plains | *Medium - agricultural heartland, but **exposed to raids*** `:523` | very low / low `:439-440` |
| Hills | *Medium-High - **defensible terrain, good visibility*** `:621` | high / medium `:544-545` |
| Desert/Arid | *Medium - controls caravan routes, water sources are strategic* `:720` | medium / very low `:640-641` |

- **ENTAILS**: exactly what the `strategicValue` sentence says, and only for the terrains the desk maps. `TERRAIN_DEFENCE_OF` (`defenseStateProse.js:693-703`) maps Mountain/Hills/Forest → FAVOURABLE, Plains/Desert → EXPOSED, and **deliberately leaves Coastal and Riverside in neither pool** (a water flank is neither narrows nor nothing, `:686-691`). `TERRAIN_PRIZE_OF` (`:719-723`) maps Coastal and Mountain → HIGH, Forest → LOW, and leaves Medium and Medium-High out because *"Hills' Medium-High value is DEFENSIVE… rather than a prize"* (`:713-717`).
- **NOT ENTAILED**: elevation figures; a named feature; weather; that anyone chose the site for its ground; that the terrain has ever been used defensively; **a cause of the town's location** (the annex fences this in terms: *"Terrain and strategic value are STANDING facts of the site with no recorded history; they never license a causal clause about how the town came to be there"*, `RECEIPT_POOLS_DOSSIER_STATE.md:2513-2515`).
- **ENGINE CONTRADICTS**: **the ground decides the wall's material.** `stoneAvailability` and `timberAvailability` are institution/resource weights, not wall inputs; `Town walls` is *"Stone fortifications"* on Plains (`stoneAvailability: 'very low'`) exactly as on Mountain.

---

### E-21 · `terrain multiplier` (the defensive value of the ground, as the engine actually computes it)

- **Name class**: not a noun class — a tuning table, `defenseGenerator.js:129-135`: mountain ×1.28, hills ×1.18, forest ×1.12, riverside ×1.06, coastal ×1.02, plains/desert ×1.00.
- **ENTAILS**: that the same works are worth more on a mountain than on a plain — this is the corpus's licensed reading at `DS-DEF-1 terrain FAVOURABLE` variant 2 (annex `:2548`).
- **NOT ENTAILED**: that riverside or coastal ground is *neutral* (both carry a small positive multiplier here while the desk's terrain lens is silent about them — two different readings of the same terrain in one product).

---

### E-22 · the readiness band word (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`)

- **Name class**: `scoreBand`, `src/domain/display/defenseScoreBands.js:38-39`; readings `bandLadders.js:202-207`.
- **ENTAILS**: exactly the reading the ladder prints and nothing beyond it — *"Readiness at or above 65. This pressure is well covered."*
- **NOT ENTAILED**: a fifth gradation (the annex forbids prose implying one, `RECEIPT_POOLS_DOSSIER_STATE.md:3246-3248`); a trend; a cause; a comparison to other towns; what the score is made of.
- **ENGINE CONTRADICTS**: **a badge on one arm says anything about another.** The annex states it (`:2510-2513`): *"a STRONG header over a CRITICAL food arm is a real and common state"*.

---

### E-23 · the overall readiness label (`Fortress` … `Undefended`)

- **Name class**: `defenseGenerator.js:515-521`, six rungs over `readiness.score`.
- **ENTAILS**: the mean of the five arms, **plus a tier bonus, minus a threat penalty** (`:490-499`, `:506-510`). Small tiers get up to +12; a plagued country costs −15.
- **NOT ENTAILED**: that a `Fortress` town has walls; that an `Undefended` town has nothing. And **not** that the label bands the same number as the badges: `posturePoolKey` reads `readiness.score` and NOT `avgScore` deliberately (`defenseStateProse.js:759-771`).
- **ENGINE CONTRADICTS**: **a thorp reading well-defended is well defended.** A thorp gets +12 for being cheap to defend (`:491`), which is a statement about scale, not about works.

---

### E-24 · the live band (`surplus` … `collapsed`) — DS-DEF-7, DARK

- **Name class**: `src/domain/causalState.js:423-427`, thresholds `:444-449`.
- **ENTAILS**: a position on a 0-100 causal score whose neutral value is 50.
- **NOT ENTAILED**: **that `collapsed` means nobody is left.** The corpus's cell says *"There is nobody left at {settlement} to be called out"* (annex `:3114`). `collapsed` is `score < 15` on a score that STARTS at 50 (`causalState.js:1034`) and is moved by a readiness term, a walls bonus and condition deltas. And `adequate` is **the no-information reading**: `:436` — *"50 is the neutral / no-information score and lands in 'adequate'"*.

---

### E-25 · the safety label (`Very Safe` … `Dangerous`)

- **Name class**: `safetyProfile.js:253-305`; readings `bandLadders.js:188-195`.
- **ENTAILS**: a RATIO of enforcement to criminal presence, floored two ways — `effectiveSafety = max(militaryEffective/criminalEffective, communityOrderBonus, courtOrderFloor)` (`safetyProfile.js:44`, `:56-74`).
- **NOT ENTAILED**: absolute crime levels; that anyone is content; freedom.
- **ENGINE CONTRADICTS**: **`Very Safe` means a happy town.** The ladder's own reading is *"Fortress towns **and occupations** sit here"* (`bandLadders.js:189`). See §5 L-6.

---

### E-26 · the military posture words (fifteen) — DS-DEF-8 / DS-DEF-10

Covered as label traps in §5 (L-14 through L-18), because for these the English word and the engine meaning are the whole issue.

---

### E-27 · the criminal-structure words (`organized` / `semi-organized` / `diffuse` / `null`)

- **Name class**: `CRIM_STRUCTURE_DATA`, `defenseDisplay.js:160-173`; classifier `:183-195`. Members per class enumerated in §2.3.
- **ENTAILS (of `organized`)**: a hierarchy; that what is permitted is permitted by somebody; suppression of what draws enforcement — all three are in the engine's own note (`:163`).
- **NOT ENTAILED**: numbers; a named boss; territory boundaries; how long it has run; that it has reached the seat — capture is a **separate ladder and never inferred from structure** (annex `:2805-2807`).
- **ENGINE CONTRADICTS**: **`null` means no organized crime.** Eight catalogue rows fall to `null`, including **Assassins' guild** (`:2459`, *"Professional contract killing. Operates through cutouts"*), **Rookery** (`:1503`, whose own desc says *"**Only a standing criminal organization can protect a loft like this**, so one never appears without that backing"*), **Street gang** (`:1466`, *"Organized pickpockets and thugs. 10-30 members"*) and **Underground network**. `DS-DEF-4 structure null` renders *"No criminal infrastructure has been identified at {settlement}. Whatever wrongdoing the town has does not run through anything that could be called an organization"* (annex `:2831`) — the Rookery row's own text says the opposite. See §6 C-5.
- **⚠ INTERNAL DIVERGENCE**: `criminalOpNote` in the SAME FILE (`defenseDisplay.js:142-149`) does recognise `gang`, `street`, `underground` and `assassin`. The structure classifier is narrower than its neighbour.

---

### E-28 · the capture rungs (`none` … `capture`)

- **Name class**: `defenseStateProse.js:908-915`, producer `src/generators/power/rulingStructure.js:797`.
- **ENTAILS**: exactly the rung. `none` entails that nothing criminal has reached the seat, **not** that no criminal interest exists (annex `:2805-2807`).
- **NOT ENTAILED**: who was bought; a price; a date; that the town knows.
- **ENGINE CONTRADICTS**: **an absent capture state is `none`.** `DefenseTab` reads `criminalCaptureState || 'none'` for styling; the desk refuses that for a sentence (`defenseStateProse.js:860-866`).
- **AUDIENCE**: `corrupted` and `capture` are `dm-only` on every variant (annex `:2851`, `:2857`).

---

### E-29 · `magic dependency`

- **Name class**: `defenseProfile.magicDependency`, `defenseGenerator.js:449-454`.
- **ENTAILS**: **a qualifying STRESS is active** — the flag is `magicOn && ((under_siege && (arcane||druid||divine)) || (famine && (druid||divine)) || (plague_onset && (divine||alchemy)) || (arcaneGuild && (under_siege||famine)))`. The binding term is the stress, not the magic (`defenseStateProse.js:1668-1686` records the measurement: TRUE on 0 of 200 default worlds; 24 of 600 high-magic worlds, all 24 carrying one of the three stresses).
- **NOT ENTAILED**: **that the town's ordinary living runs on magic.** The corpus's `magicDependency true` cell says *"{settlement} runs on arcane work. What the town produces, and in some measure what the town eats, depends on practitioners"* (annex `:3211`) — a standing structural claim off a flag that only fires during a crisis. This is the widest gap between a corpus noun and its producer on the desk.
- **NOT ENTAILED (further)**: a count of practitioners; who they are; that they would leave.

---

### E-30 · `blockade`

- **Name class**: `stockpile.blockaded` / `blockadeBypass`, written by `src/domain/worldPulse/foodStockpile.js:417-418`; holder kind `toll-bar` (`holderTable.js:184-185`).
- **ENTAILS**: a hostile fleet on the sea approaches, and that the port is choked **[RECORDED: `defenseDisplay.js:266`]**; that the bypass, if any, is `teleport` or `airship` **[RECORDED: `:262-265`]**.
- **NOT ENTAILED**: a besieger by name at this tip; duration; a cause beyond the stamped one. The annex names this as **the one genuinely historical cell on DS-DEF-6** (`RECEIPT_POOLS_DOSSIER_STATE.md:2955-2958`).
- **⚠ LIVENESS**: dormant over a generated-only corpus, live only in a campaign world (`defenseStateProse.js:1638-1648`).

---

### E-31 · `the economic-upkeep gate` (`economicGates.*`)

- **Name class**: `defenseGenerator.js:467-472`, `:647-650`. Five keys with different floors:

| Gate key | Floor | What it funds | file:line |
|---|---|---|---|
| `military` | 0.6 | garrison wages, wall maintenance | `:182-192` |
| `monster` | 0.7 | patrol provisioning, bounty purses, charter-hall retainers | `:212-226` |
| `internal` | 0.65 | watch wages, court and gaol funding | `:246-254` |
| `economic` | 0.45 | crisis logistics | `:281-290` |
| `disaster` | 0.55 | relief funding | `:608-618` |

  and `military` / `internal` are **recorded only when there is a paid stack to bite** (`:467-470`): *"a hamlet with no paid defenses reports no military gate at all"*.
- **ENTAILS**: that the funded portion of the defence is under-funded, in the exact proportion the number states; that the **unpaid community baseline is exempt** (`:187-188`, `:216-218`, `:248`).
- **NOT ENTAILED**: that anyone has deserted; arrears; a season; that pay is late rather than low; that the town chose this.
- **ENGINE CONTRADICTS**: **an under-funded defence is a decaying defence.** The gate's own comment refuses it twice: *"built walls keep standing and unpaid soldiers desert slowly, never instantly"* (`:186-187`).
- **⚠ THE DESK'S ONLY THRESHOLD READ**: `wallRationalePoolKey` fires `WALLED-STRAINED` on `militaryGate < 1` (`defenseStateProse.js:1056-1058`) — any shortfall at all, not a large one.

---

### E-32 · `stress` / `crisis` (the override framing, DS-DEF-8)

- **Name class**: `STRESS_TYPE_MAP`, `src/data/stressTypes.js:10-174`, fifteen types with a `label`, a `crisisHook`, a `viabilityNote` and a `historyColour`.
- **ENTAILS**: that the type's own recorded consequences hold — the `viabilityNote` is the engine's own statement of what the crisis does.
- **NOT ENTAILED**: duration; who caused it; whether it will end.
- **⚠ TIER GATE**: `slave_revolt` carries `requiresTier: "town"` (`:139`) and is the only tier-gated stress.
- **THE POSTURE WORD IS NOT THE PROSE**: the annex fences this (`RECEIPT_POOLS_DOSSIER_STATE.md:3159-3162`) — the uppercase posture words are military-telegram chrome and remain a badge.

---

## 4. WHAT THE ENGINE HAS NO FIELD FOR AT ALL (the "NOT ENTAILED" floor)

Measured: the institution catalogue row carries exactly these keys, across all 280 rows —

```
baseChance | desc | exclusionConditions | exclusiveGroup | exclusiveGroupCoexists | facets |
forbiddenResources | forbiddenTradeRoutes | magicLicense | minTier | priorityCategory |
required | serviceKeys | tags | terrainAccess | terrainRequired | tradeRouteRequired
```

(enumerated by importing `src/data/institutionalCatalog.js` in the dock; every Defense-category row returns `facets: undefined` and `serviceKeys: undefined`.)

**There is therefore no engine field anywhere for:** an institution's **age**, **condition**, **material** (beyond what a `desc` sentence happens to say), **height**, **size or count of members**, **manning**, **commander**, **founding date**, **builder**, **funding source**, **repair state**, or **history**. Every such claim on this desk is unlicensed by construction, not by a rule anyone needs to write.

The two exceptions are recorded and narrow: **`Mercenary quarter`** records a magnitude (*"hundreds to thousands"*, `:2182`) and **`Professional city watch`** records a proportion (*"~1% of population"*, `:1918`). Both are counts, and a count is on every licence card's `may NOT` line.

---

## 5. LABEL TRAPS — an engine value or label whose English meaning is not its engine meaning

Every row: the LABEL as a reader meets it · the FIELD · the ENGINE MEANING quoted from code · file:line.

| # | Label | Field | Engine meaning (quoted) | file:line |
|---|---|---|---|---|
| **L-1** | **`plagued`** | `config.monsterThreat` | *"The surrounding region is **plagued by monster activity**."* — never disease. The corpus's own family word for it is `plagued`, and the engine's third tier is `heartland`, which the corpus calls `settled`. | `src/components/new/SummaryTab.jsx:36`; tiers `src/data/monsterThreat.js:28`; map `defenseStateProse.js:279-284` |
| **L-2** | **`heartland`** ⇄ **`settled`** | `config.monsterThreat` | The producer says `heartland`; the corpus says `settled`. The desk keys on the producer token and maps: *"KEY ON THE CANONICAL PRODUCER TOKEN, NEVER ON THE CORPUS WORD"*. | `defenseStateProse.js:254-284` |
| **L-3** | **`frontier`** (the DEFAULT) | `config.monsterThreat` | `normalizeMonsterThreat(undefined) === 'frontier'` — *"an ABSENT tier silently becomes the frontier"*. A face reading `frontier` off an unmeasured town is describing a default. The desk refuses it (`measuredMonsterFamily` requires the raw value present). | `src/data/monsterThreat.js:55-56`; `defenseStateProse.js:316-334` |
| **L-4** | **`civilized`** | `config.monsterThreat` | *"`normalizeMonsterThreat` forwards `'civilized'` UNCHANGED even though it is not a canonical tier."* Raised, not cured. | `defenseStateProse.js:271-276` |
| **L-5** | **`Very Safe`** | `safetyProfile.safetyLabel` | *"Enforcement is at least 3.5 times the criminal presence. **Fortress towns and occupations** sit here."* A RATIO, and an occupied town reaches it. | `bandLadders.js:189`; thresholds `safetyProfile.js:253-262` |
| **L-6** | **any base safety label** | `safetyProfile.safetyLabel` | `effectiveSafety = max(militaryEffective/criminalEffective, communityOrderBonus, courtOrderFloor)`. A thorp with no criminal roster gets a flat 1.25 bonus and reads `Moderate` with zero enforcement; a town with a court gets a 1.20 floor. The label is not a measurement of the watch. | `safetyProfile.js:44`, `:56-74` |
| **L-7** | **`Controlled — Authoritarian`** | `safetyProfile.safetyLabel` | *"Residents face little risk from common thieves and **considerably more from the authorities themselves**. Unofficial disappearances are not discussed openly."* The English word `Controlled` reads calm. | `safetyProfile.js:241-246` |
| **L-8** | **`Hospital present`** | `compound.inst.hasHospital` | Keywords are `hospital`, **`monastery`**, **`healer`**, **`friary`**. A village's `Healer (divine, 1st level)` (*"Basic healing spells. A closed wound costs 10 in gold."*) sets it. | `priorityHelpers.js:64`; row `institutionalCatalog.js:845` |
| **L-9** | **`Clergy care`** / *"clergy who tend the sick"* | `compound.inst.hasChurch` | Keywords include **`shrine`**. `Wayside shrine` desc: *"Simple prayer marker. **No resident clergy.**"* `Access to parish church` desc: *"Walk 2-5km to village church for services."* | `priorityHelpers.js:65`; rows `institutionalCatalog.js:42`, `:50`, `:292`, `:300` |
| **L-10** | **`Court only`** / **`Court + Prison`** / *"can arrest, try and hold"* | `compound.inst.hasCourtSystem` | Keywords include **`town hall`** and **`city hall`**, and both rows are `required: true, baseChance: 1`. Every generated town and city sets the flag from a `Meeting place and administrative center` / `Impressive civic building`. | `priorityHelpers.js:55`; rows `institutionalCatalog.js:1550`, `:2268` |
| **L-11** | **`Prison only`** / *"detention"* | `compound.inst.hasPrison` | Keyword **`stocks`**; the town row is `Small prison/stocks` — *"Holding cells **and public punishment**"*. | `priorityHelpers.js:54`; row `institutionalCatalog.js:1564` |
| **L-12** | **`Naval force`** | `compound.inst.hasNavy` | Keywords `navy`, `major port` — **no shipped catalogue row matches either**. The status is unreachable on a generated world. | `priorityHelpers.js:62`; measured over `institutionalCatalog.js` |
| **L-13** | **`{reason}`** (DS-DEF-7/10, dark) | `causalState` contributor `.reason` | Not a cause phrase — a full SENTENCE: `` `Defense readiness score: ${led.readinessScore}.` ``, `'Defensive walls in place.'`, `` `${cond.label} taxes defense readiness.` ``. Slotting it into *"…has lost to {reason}"* would print *"…has lost to Defense readiness score: 62."* | `src/domain/causalState.js:486-488`, `:1044-1053`, `:359-364` |
| **L-14** | **`QUARANTINE ACTIVE`** | `stress.type === 'plague_onset'` | The stress's own label is **`Disease Outbreak`**, and its texts say *"a quarantine that is **not being enforced consistently**"* and *"Travel is being **discouraged**"*. The corpus's cell says *"the gates are held"* / *"Nobody comes in and nobody goes out"*. | `src/data/stressTypes.js:85-92`; posture `defenseDisplay.js:33`; corpus `RECEIPT_POOLS_DOSSIER_STATE.md:3322-3323` |
| **L-15** | **`MIGRATION SURGE`** | `stress.type === 'mass_migration'` | The label is **`Mass Migration`** and the viabilityNote covers BOTH directions: *"**Immigration**: food balance stressed… **Emigration**: tax base shrinking, institutions hollowing"*. The corpus's cell asserts arrival only: *"More people are arriving at {settlement}"*. | `src/data/stressTypes.js:159-168`; corpus `RECEIPT_POOLS_DOSSIER_STATE.md:3357` |
| **L-16** | **`UNDER TRIBUTE`** | `stress.type === 'indebted'` | The label is **`Indebted to Outside Power`** and the model is a **creditor**: *"The **creditor** has sent a representative to collect"*, *"A significant portion of revenue is being extracted by the creditor."* Tribute (a conqueror's due) is not debt service. | `src/data/stressTypes.js:53-62`; posture `defenseDisplay.js:30` |
| **L-17** | **`BEAST PRESSURE`** | `stress.type === 'monster_pressure'` | The label is **`Beast & Raider Threat`** and the hook says *"Someone is **directing** this (whether a rival lord, a beast of unusual cunning, or something stranger)"*. Not only creatures, and not necessarily unthinking. | `src/data/stressTypes.js:104-113` |
| **L-18** | **`SECURITY COMPROMISED`** | `stress.type === 'recently_betrayed'` | The label is **`Recently Betrayed`**; the record is *"The betrayal had consequences that are still unfolding. **The betrayer may still be here.**"* The corpus's cell infers WHAT was given away (*"the town's defensive arrangements are being reworked on the assumption that what was given away is known"*) — the engine records a betrayal, not a leak of arrangements. | `src/data/stressTypes.js:64-72`; corpus `RECEIPT_POOLS_DOSSIER_STATE.md:3312` |
| **L-19** | **`ADEQUATE`** (live band, DS-DEF-7) | `causalState` band | *"50 is the neutral / **no-information** score and lands in 'adequate'"*. | `src/domain/causalState.js:436`, `:444-446` |
| **L-20** | **`unknown`** (safety severity) | `safetySeverityOf(...).key` | The LOUD fallback, deliberately not a quiet neutral. The annex says it **draws no prose**: *"an unclassifiable safety reading is a defect to surface, not a state to narrate"*. | `src/domain/display/safetySeverity.js:39-45`; annex `RECEIPT_POOLS_DOSSIER_STATE.md:2745-2747` |
| **L-21** | **`Granary present`** | `compound.inst.hasGranary` | Keyword is the STEM `granar`, so the flag is about the BUILDING and never about the stock. The stock is `foodSecurity.storageMonths`, a different fact, and the civic-object split was made for exactly this (`granary` moved from `store` to `storehouse`). | `priorityHelpers.js:63`; `src/domain/prose/wiringCensus.js:1307-1322` |
| **L-22** | **`Arcane support`** | `compound.inst.hasMagicInst` | Keywords include `alchemist`, `scroll scribe`, `enchant`. The generator's own note fills the status text from `magicDef.slice(0,2)` names — a different bucket again. | `priorityHelpers.js:68`; note `defenseDisplay.js:227` |
| **L-23** | **`economicGates.military` absent** | `defenseProfile.economicGates` | Absent means **no paid stack to gate**, not "fully funded": *"a hamlet with no paid defenses reports no military gate at all"*. `wallRationalePoolKey` reads `< 1` and treats absence as not-strained (`typeof … === 'number'` guard) — correct, but the reader must not read absence as ×1.0. | `defenseGenerator.js:462-470`; `defenseStateProse.js:1056-1058` |
| **L-24** | **`Under blockade`** | `stockpile.blockaded` | Written only by the world pulse, never at generation: *"the live `blockaded` flag is written each pulse and is only set while the naval layer is lit"*. `economicState.foodSecurity.stockpile` is `null` on every settlement the pipeline builds. | `defenseDisplay.js:250-256`; `defenseStateProse.js:1638-1648` |
| **L-25** | **`no reserves, port open`** vs **`granary, port`** | mixed | The producer's own asymmetry, mirrored on purpose: the reserve branch reads the INSTITUTION flag `hasPort`; the empty branch reads the CONFIG value `tradeRouteAccess === 'port'`. Two different questions behind one row. | `defenseDisplay.js:245`; `defenseStateProse.js:1555-1588` |

---

## 6. ENGINE CONTRADICTS — real-world entailments the engine's own rules refuse

| # | The real-world entailment | What the engine says | file:line |
|---|---|---|---|
| **C-1** | **Walls decay; timber rots; unmaintained stone falls.** | *"Floor 0.6: **built walls keep standing** and unpaid soldiers desert slowly, never instantly."* No path in the model removes or degrades a wall for want of money; only a calamity/lifecycle **ruin stamp** removes an institution, and that stamp cannot reach `defenseProfile.institutions` at all (the buckets hold pre-ruin objects by reference). | `defenseGenerator.js:182-192`; `defenseInstitutionBuckets.js:33-45` |
| **C-2** | **A citadel is stone; a citadel is a perimeter.** | The row records *"Inner fortress. Last refuge in siege."* — no material, and explicitly INNER. But it is a `walls` bucket member, so `walls.present` is true and `DS-DEF-5 walls PRESENT` can say *"There is a line around {settlement}"*. | `institutionalCatalog.js:1931`; bucket `defenseInstitutionBuckets.js:85` |
| **C-3** | **A gate implies a wall.** | `Gates (if walled)` is conditional in its own NAME, carries no `exclusiveGroup`, and its recorded services make it a **toll bar**. Nothing requires `Town walls` beside it. | `institutionalCatalog.js:1356`; `holderTable.js:304-308` |
| **C-4** | **A church means clergy; a shrine means a priest.** | `Wayside shrine`: *"No resident clergy."* `Access to parish church`: the church is 2-5 km away. Both set `hasChurch`, which is the desk's `parish care` reading. | `institutionalCatalog.js:42`, `:50`; `priorityHelpers.js:65` |
| **C-5** | **An assassins' guild / a gang / a rookery is organized crime.** | `deriveCriminalStructure` classifies all three `null` — and the `Rookery` row's own desc says *"Only a standing criminal organization can protect a loft like this, so one never appears without that backing."* The classifier contradicts the row it is classifying. | `defenseDisplay.js:183-195`; `institutionalCatalog.js:1503`, `:2459`, `:1466` |
| **C-6** | **A militia and a watch can both exist.** | At town tier they are the same `exclusiveGroup: 'civilianDefense'`, and the militia's desc says *"Present only when no professional watch exists."* | `institutionalCatalog.js:1340`, `:1348` |
| **C-7** | **A palisade at a hamlet is timber.** | The row is a DISJUNCTION the engine never resolves: *"Basic **wooden palisade or earthwork berm**"*. | `institutionalCatalog.js:342-345`, `:874-877` |
| **C-8** | **A well-built town is a well-defended one.** | The readiness label adds a **tier bonus** (thorp +12) and subtracts a **threat penalty** (plagued −15) on top of the mean, so scale and country move the word without any works moving. | `defenseGenerator.js:487-521` |
| **C-9** | **The town's defence is the town's.** | `Garrison`'s own desc is *"Professional soldiers. **Noble or royal.**"*, and the `occupied` stress subtracts 35 military while the safety label may still read `Very Safe`. | `institutionalCatalog.js:1925`; `defenseGenerator.js:387-390`; `bandLadders.js:189` |
| **C-10** | **What the dossier says about the walls is what the town has today.** | Two rosters, and they disagree by design. `threatAssessment.js:40-43` reads `defenseProfile.institutions` — the **generation-time snapshot, ruin-blind**. The state-prose desk reads `standingDefenseForces` — the **live, ruin-filtered** roster. So a flattened citadel is still walls to the threat-assessment prose and is not walls to the corpus prose, on the same tab. | `threatAssessment.js:40-43` vs `defenseStateProse.js:604-609`, `:1370` |
| **C-11** | **The engine's own defence prose describes the town's actual works.** | `buildThreatAssessment` calls whatever is in the walls bucket a **palisade** at every tier: *"Palisade and citizen militia provide a viable but demanding posture"*, *"The palisade creates a chokepoint"* — printed for a metropolis with `Massive walls and fortifications`. Evidence that the ENGINE does not bind material to the wall row, and a live inconsistency the corpus must not inherit. | `threatAssessment.js:59`, `:66` |
| **C-12** | **A custom-content wall is a wall.** | It is not, to this desk. `nativeSemanticName` returns `''` for materialized custom content, so **no custom institution ever reaches a defence bucket**. A DM's custom rampart reads as `walls ABSENT`. (The criminal classifier, reading raw `.name`, does NOT have this property — a divergence in the other direction.) | `customContentSemanticAuthority.js:22-32`, `:41-48`; `defenseInstitutionBuckets.js:137-138` vs `defenseDisplay.js:185` |
| **C-13** | **The magic-dependency flag is about magic.** | *"the binding term is the STRESS, not the magic"* — TRUE on 0 of 200 default-priority worlds. | `defenseStateProse.js:1668-1686`; `defenseGenerator.js:449-454` |

---

## 7. ALIAS TRAPS — a generic English word naming a class the engine splits into distinct rows

| # | English word | Rows / flags it spans | Why the spelling matters | file:line |
|---|---|---|---|---|
| **A-1** | **"the wall" / "the walls"** | seven catalogue rows spanning **four physically different things**: a stake fence (`Palisade`), a disjunctive fence-or-berm (`Palisade or earthworks`), a stone circuit (`Town walls`, `City walls and gates`, `Massive walls…`), an **inner fortress** (`Citadel`) and a **gate** (`Gates (if walled)`). | `{defwork}` fills with the town's OWN recorded name, so the specific noun is available and should be used; the generic must be a word true of all seven, and `perimeter` is not (Citadel, Gates). Safest generics: **"the works"**, **"what the town has built"**. | `defenseInstitutionBuckets.js:84-87`; catalog `:97`, `:342`, `:874`, `:1332`, `:1356`, `:1910`, `:1931`, `:2347` |
| **A-2** | **"a citadel" used as a perimeter word** | `Citadel` in the `walls` bucket. | A city holding only a `Citadel` reads `walls PRESENT` and draws the gate-and-line prose. | `defenseInstitutionBuckets.js:85`; `institutionalCatalog.js:1931` |
| **A-3** | **"a gate" used as a wall word** | `Gates (if walled)` in the `walls` bucket via substring `wall`, AND in `hasWalls` explicitly. | `{defwork}` will accept `"gates (if walled)"` as a bare-common fill: `bareCommonFill` rejects only a leading determiner, a dash, sentence punctuation, a digit or a snake_case token — parentheses pass. DS-DEF-11 can render *"{settlement} keeps its gates (if walled)…"*. | `defenseInstitutionBuckets.js:85`; `priorityHelpers.js:52`; `defenseStateProse.js:1003`, `:1010-1018`, `:1027-1036` |
| **A-4** | **"the watch"** | `Professional city watch` is in **both** the `garrison` bucket and the `watch` bucket. `forceCorePoolKey` reads garrison FIRST, so a city whose only force is the watch renders **`garrison PRESENT`** and `invasionRowPoolKey` renders **`walls AND professional garrison`**. The `watch PRESENT` pool never fires for it. | The pay-gate fact must follow the row the town actually resolves. `deriveArmedForces` de-duplicates the three buckets by name for exactly this reason. Generic-safe: **"the guard"**, **"the muster"**. | `defenseInstitutionBuckets.js:89`, `:96`; `defenseStateProse.js:1269-1276`, `:476-491`; `defenseDisplay.js:334-335`, `:350` |
| **A-5** | **"a mercenary company" / "hired swords"** | The DEFENCE bucket holds **one** row (`Mercenary quarter`). `inst.hasMercenary` holds **four** (`Mercenary quarter`, `Free company hall`, `Veteran's lodge`, `Hireling hall`). A `Free company hall` town scores +14 military as a mercenary while `DS-DEF-5`'s contracted lens is silent. | The score and the sentence read different rosters. | `defenseInstitutionBuckets.js:98-100` vs `priorityHelpers.js:49`; `defenseGenerator.js:164`; `defenseStateProse.js:1283-1285` |
| **A-6** | **"a charter hall"** | `hasCharterHall` also matches **`hireling hall`** — a `Job board for torchbearers… porters`. And `Hireling hall` therefore sets **both** `hasMercenary` and `hasCharterHall`. | One job board becomes both a contracted force and a monster-response charter for scoring; the bucket catches neither. | `priorityHelpers.js:49`, `:51`; `institutionalCatalog.js:1436` |
| **A-7** | **"the militia"** | `Citizen militia` is the sole row, but the WORD spans the corpus's *"armed citizens"*, the holder table's **muster**, and (at hamlet) *levies*. The muster is the ROLL, and only this institution keeps one. | *"the muster"* is the safe generic for the force class; *"the militia"* is safe only where `forces.militia.present`. A garrison town has *"men under arms and no roll of them"*. | `defenseInstitutionBuckets.js:92-94`; `holderTable.js:280-288` |
| **A-8** | **"the garrison"** | `garrison` bucket spans `Garrison` (professional soldiers, noble or royal), `Multiple garrisons`, `Barracks` (**housing**) and `Professional city watch` (**law enforcement**). | *"a standing force: people whose work is the defense of this town"* is false of a Barracks and misdescribes a city watch. | `defenseInstitutionBuckets.js:88-91`; catalog `:1363`, `:1918`, `:1925`, `:2355` |
| **A-9** | **"the law" / "the court"** | `law` civic class = `court, prison, gaol, law, justice, magistrate, assize`; the FLAG behind it spans courthouses, **town halls**, **city halls** and a citizen assembly. | The class word and the flag disagree about what a court is. | `wiringCensus.js:1306`; `priorityHelpers.js:55` |
| **A-10** | **"the port" / "the harbour" / "the sea"** | `road` civic class = `road, route, approach, port, harbour, bridge, pass, ford`; `hasPort` spans docks, **river** docks, shipyards and a harbour-master's office; `tradeRouteAccess` is a separate enum (`port · river · crossroads · road · isolated · mountain_pass · mountain_road · desert_road`). DS-DEF-6's five logistics pools read the INSTITUTION flag on one branch and the CONFIG enum on the other. | *"sea"* is unlicensed off `hasPort`; the road class swallows sea and land alike. | `wiringCensus.js:1307`; `priorityHelpers.js:32`, `:61`; `defenseStateProse.js:1555-1588` |
| **A-11** | **"the hall"** | `hall` civic class = `hall, council, charter, seat, office, chamber, moot`. This puts **`charter hall`** (a defence institution), **`town hall`** (the court flag) and **`{seat}`** (the governing body) in ONE class. The DS-DEF-5 charter card prints `may NOT … another civic object of the class 'hall'`. | A charter-hall sentence and a seat sentence collide on the class guard even though they are different institutions. | `wiringCensus.js:1308`; licence card DS-DEF-5 `charter hall PRESENT` |
| **A-12** | **"medical" / "the healer"** | `care` civic class = `hospital, infirmary, healer, medical, physician, ward`; the flag spans hospitals, a monastery and one first-level healer. | See L-8. | `wiringCensus.js:1309`; `priorityHelpers.js:64` |
| **A-13** | **"the stores" / "the granary"** | Two classes on purpose: `store` (`stores, reserve, reserves, stock, larder, harvest`) is the STOCK; `storehouse` (`granary, silo, storehouse, warehouse`) is the BUILDING. A key naming `granary` ALONE still reads as `store`. | The split was made because *"`GRANARY: thin` is about the STOCK, and `Disasters & Famine: granary AND hospital` is about WHICH BUILDINGS EXIST"*. | `wiringCensus.js:1305`, `:1315-1322` |
| **A-14** | **"the temple" / "the parish"** | `temple` civic class = `temple, shrine, church, parish, clergy, faith, patron`; the flag spans a wayside marker with no clergy up to a great cathedral. | See L-9 / C-4. The DS-DEF-2 `granary AND parish care only` card prints the `temple` class exclusion. | `wiringCensus.js:1306`; `priorityHelpers.js:65` |
| **A-15** | **"the muster"** (the holder kind) | `muster` holder kind holds **twelve** fields — `walls, garrison, militia, mercenary, charter, force, magicDependency, economicGates, besiegedBy, besiegingTargets, ticksToDeploy, stretchedThin` — while exactly **one institution** in the shipped roster keeps a muster. | A citation of "the muster roll" is licensed for all twelve fields but is backed by a roster row only where a Citizen militia stands. | `holderTable.js:188-199`, `:280-288` |
| **A-16** | **"the watch"** (the holder kind) | `watch` holder kind holds `watch, safetyProfile, criminalCaptureState, blackMarketCapture` — i.e. the crime and capture facts, not only the patrol. It is also the desk's one **STATE ORGAN** row, *interested where the town is captured*. | Citing "the watch" for a capture fact cites the organ the capture compromises. | `holderTable.js:202-212`; licence card DS-DEF-5 `watch PRESENT` |
| **A-17** | **"walls" singular vs plural** | The bucket matches `wall` (singular); the flag matches `walls` (plural). They agree on today's roster only by accident of naming. | A future row named "Sea wall" or "Ward wall" would enter the bucket and NOT the flag; a row named "Curtain walls" would enter both. | `defenseInstitutionBuckets.js:85` vs `priorityHelpers.js:52` |
| **A-18** | **"military institution"** | `hasMilitaryInst` (which gates `guardEffectivenessDesc` entirely) matches `garrison, barracks, guard, watch, citadel, walls, militia, mercenary, navy, charter hall` — and therefore **does not match `Palisade`, `Palisade or earthworks`, or `Gates (if walled)`**. A village whose only defence is a palisade has `hasWalls: true` and `hasMilitaryInst: false`, and gets no guard sentence at all. | | `priorityHelpers.js:45`; `safetyProfile.js:317` |

---

## 8. THE DESK'S OWN EXISTING FENCES (what the annex already forbids, so the chair is not re-ruling it)

| Fence | Text | file:line |
|---|---|---|
| The band is a summary, not a per-arm claim | *"a STRONG header over a CRITICAL food arm is a real and common state"* | `RECEIPT_POOLS_DOSSIER_STATE.md:2510-2513` |
| Terrain and strategic value are standing, historyless | *"they never license a causal clause about how the town came to be there"* | `:2513-2515` |
| Institution presence licenses CAPABILITY, never HISTORY | *"walls without people cannot be held… never *historical* ones (walls built after a siege)"* | `:2588-2592` |
| Walls ride the predicate, never a presence check | *"an empty `walls: []` array still contains the key"* | `:2584-2590`, `:3243-3247` |
| The badge ladder is frozen at four rungs | *"prose that implies a fifth gradation is prose that will not survive the next tuning"* | `:3246-3248` |
| Contracted forces carry the payment entailment and no more | *"may not say the contract is failing unless the economic arm supplies that"* | `:2874-2880` |
| Structure ≠ capture | *"an `organized` town at `none` capture is common"* | `:2805-2807` |
| Structure `null` ≠ no crime | *"NOT the same as *no crime*"* | `:2803-2806` |
| The magic-loss cause must stay generic | *"the state carries no specific threat to the practitioners"* | `:3203-3206` |
| The `unknown` safety tier draws no prose | *"a defect to surface, not a state to narrate"* | `:2745-2747` |
| DS-DEF-11's WHEN is deliberately absent | *"The one historical clause this block might want — WHEN the wall was raised — has NO backing fact at this tip"* | `:5969` |
| The posture word is chrome, not prose | *"the corpus supplies the sentence and the posture word remains a badge"* | `:3159-3162` |

**The gap the owner named sits underneath all twelve.** Every fence above is about CAUSE, HISTORY, PROVENANCE or GRADATION. None of them speaks to what the noun itself means: nothing in the annex tells a writer that `palisade` carries timber, that `mill` carries grinding, or that `watch` carries watching — nor that `citadel` does not carry stone and `Palisade or earthworks` does not carry either.

---

## 9. RESIDUALS AND OPEN QUESTIONS FOR THE CHAIR (not decided here)

1. **The annex cites a file that no longer holds the table.** `DS-DEF-11`'s RECEIPT (`RECEIPT_POOLS_DOSSIER_STATE.md:5965`) says *"the engine's wall name class is `'wall'`, `'citadel'`, `'palisade'`, `'earthwork'`, `'inner citadel'`, `'massive walls'` (`src/generators/defenseGenerator.js`)"*. The table moved to `src/domain/institutions/defenseInstitutionBuckets.js:83-109`; `defenseGenerator.js:47-48` is now a one-line delegation. The keyword list is correct; the citation is stale.
2. **`Palisade or earthworks` renders as a `{defwork}` fill.** Whatever the chair rules about material entailment, this one recorded NAME is a disjunction and reaches the page.
3. **`Gates (if walled)` renders as a `{defwork}` fill.** `bareCommonFill` does not exclude parentheses.
4. **`DS-DEF-6 Naval Defense: Naval force` is unreachable** at this tip (§5 L-12). A pool with no producer.
5. **Two rosters on one tab** (§6 C-10): `threatAssessment` prose and corpus prose read the snapshot and the live roster respectively.
6. **`deriveCriminalStructure` is narrower than `criminalOpNote` in the same file** (§2.3, E-27).
7. **The corpus's `magicDependency true` cell states a standing structural dependency off a stress-gated flag** (§3 E-29, §6 C-13). This is the largest corpus-vs-producer gap the survey found on this desk, and it is in a LIVE, RESOLVED pool.
8. **DS-DEF-7 and DS-DEF-10 carry 33 dark pools** whose nouns are surveyed above; every entailment risk in them is latent, not shipped.

---

*Prepared for the Fable chair. No law proposed; the chair rules. Dock `f2da5a3ee`, nothing written into the dock, no suite run.*
