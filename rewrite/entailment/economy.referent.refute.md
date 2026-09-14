# REFERENT REFUTE — THE ECONOMY DESK (`DS-ECO-*` + `DS-SUP-*`)

Refuter: Fable 5.1. Dock: `laneRW-DEFW` @ `f2da5a3ee` (HEAD re-derived: `f2da5a3ee5743e56b9073570bdd487e1ef1a460f`),
read-only; nothing modified, staged or committed; no vitest, npm or build run. Node used only to
print: `scripts/prose-licence-card.mjs` (two cards), pure `import` + `console.log` probes of the
committed census JSON, the generated economy leaf, `economicData.js`, `resourceChains.js`.
Surveyor packet: `rewrite/entailment/economy.referent.survey.md` (Opus). Status: **COMPLETE**.

Verdict vocabulary: **HOLDS** (true for every member and consistent with the engine) ·
**CONDITIONAL** (true only for named members or only where a named field resolves; the condition
is stated) · **REFUTED** (false for some member or contradicted by the engine; code quoted).
Default under doubt: CONDITIONAL or REFUTED.

**ONE-LINE VERDICT FOR THE CHAIR.** The surveyor's engine cites are almost all exact (the three
path/line slips are in §0), its slot chains and visibility probes reproduce, and its wiring debt
is real. Its LAYER column is the weak part: (1) it stamps **BODY** on twenty-odd reads that
carry no institution at all (`rank`, `foodBalance.*`, `granary.*`, the terrain token, the
absences) — under ADDENDUM 11 BODY is "an institution row", so those reads carry **no referent
layer** and a refuter told "BODY" would pass *the granary* on a stock band; (2) it stamps
**ORGAN-UNDER-POWER** on the two state-organ reads as if the power were always there, when the
engine makes it a **town-conditional standing** (`standingOf` … `capturedAtBirth`) that no
product path ever resolves, and the read's value (`blackMarketCapture`) is computed with no join
to the capture ladder at all; (3) it calls the market and toll-bar kinds "organs", which
`STATE_ORGAN_KINDS` refuses, while missing that ANY institution can be made INTERESTED world-run by
a corruption impairment written on an NPC's home house. Five overlaps the surveyor did not row are
in §4, and the desk's most-baked institution-adjacent word — *the road*, 31 occurrences, a holder
kind's name — is not in its noun table (§5).

---

## §0 THE SURVEYOR'S CITES, RE-DERIVED — three corrections, the rest exact

| Surveyor says | At `f2da5a3ee` | Verdict |
|---|---|---|
| `institutionTable.js:106`, `:129-138`, `:377-397` (no directory; §1.4 implies `prose/`) | `src/domain/institutions/institutionTable.js` — `DUTY_SERVICE_KINDS` `:106`, `COLUMN_SOURCES.holderRole` `:129-138`, `officesOf` `:377-397` (imported at `holderTable.js:48-50`) | **path correction**, lines exact |
| `ServicesTab.jsx:88`, `:95-99` | `src/components/new/tabs/ServicesTab.jsx:88` (`catOrder`), `:95-99` (`impairedInstitution … .sort(compareCodepoint)[0]`), `:100` (`economyDeskRead(...)`) | **path correction** (`tabs/`), lines exact |
| `serviceCategoryTables.js:40-44` | `src/generators/services/serviceCategoryTables.js:40-44` — `'Citizen militia'` · `'Town watch'` · `'Professional city watch'` · `Garrison` · `Barracks`, all `'employment'`; `:45` `'Multiple garrisons'`, `:46` `"Warden's Lodge"` | **path correction**, lines exact |
| `holderTable.js:203-209` the `watch` token row | `:202-209` (the `watch:` key is `:202`) | one line off; immaterial |
| "the census's own `fieldSynonyms` column" | the census carries ONE top-level table `fieldSynonyms` (`docs/content/wiring-census.json:47351`, 76 entries keyed by read path) plus `fieldSynonymsRuling` (`:47735`); it is not a per-row column (row keys: `block,pool,slotsFilled,…,source`) | **wording**: a document-level table, not a row column; the economy figures below still reproduce from it |
| `Merchants operating in the shadow economy…` is "`economicDragDesc` scaleNote" | the string is a component literal at `src/components/new/tabs/EconomicsTab.jsx:664` and the leaf's canonical row (`economy.generated.js:1595`); `economicDragDesc` (`safetyProfile.js:641-644`) is a different string ("The shadow economy captures an estimated N%…") | **attribution REFUTED**; the finding (frozen, unmarked, player-audible) stands |
| all other cites in §1–§7 (buckets `:83-111`; `HOLDER_KINDS` `:78-83`; `STATE_ORGAN_KINDS` `:115`; `capturedRulingStructure` `:129-143`; withdrawn rows `:157-161`; `HOLDER_SOURCES` `:164-240`; `HOLDER_RECORDS` `:271-366`; `holderKindOfField` `:446-455`; `stateOrgan` emit `:557-560`; `holdersOf` `:599`; `standingOf` `:642-713`; `fieldSynonyms.js:42-45`, `:77-90`, `:96-102`, `:115-128`; `corruption.js:630`, `:662-692`, `:675-681`; `brokeragePatronage.js:60`, `:304-311`; `factionCapture.js:136`; `rulingStructure.js:457/:506/:565/:596/:638/:647/:671/:682/:787/:792/:797`, `:590-593`; `rulingPower.js:224-230`; `wiringCensus.js:518-519`, `:1252-1259`, `:1301-1322`, `:1681`; `economyStateProse.js:173-179`, `:320-332`, `:888`, `:910-921`, `:976`, `:991`, `:999`; `economyDeskRead.js:101`, `:109`, `:113`; `tabHelpers.js:4-57`; `economicData.js:9`; `economicState.js:712-720`; `priorityHelpers.js:45/:48/:56/:57/:58/:63`; `foodStockpile.js:185-195`; `safetyProfile.js:684`; `dossierViewModel.js:336`; `stateProseKernel.js:133/:135/:138/:161-166/:174-178`; `composeStateProse.js:370`; `composedWalker.js:1011`, `:1018-1020`, `:1045-1080`; `prose-licence-card.mjs:329-338`; `marketPrices.js:228-239`; `generate-dossier-state-prose.mjs:108-109`, `:223-226`, `:251`, `:318`; `prose-wave-gate.mjs:294-301`, `:309`, `:346-375` (binary-detected: `file` reports "binary data"; `grep -an` needed — reproduced); annex `RECEIPT_POOLS_DOSSIER_STATE.md:120-128`, `:136`, `:455-465`, every quoted line in §7) | **exact** |

Census figures reproduced from the committed JSON: 105 rows · 55 RESOLVED / 50 WIRING-UNRESOLVED ·
`stateOrgan` on 8 rows (DS-ECO-6 ×3 `watch`, DS-ECO-12 ×5 `treasury`) · `covert` true on 0 ·
five blocks with an empty `sites` list (DS-ECO-4, -5, -7, DS-SUP-1, DS-SUP-2) · 31 distinct reads,
none matching `/npc/` · `fieldSynonyms` entries for 16 of the 31 (the sixteenth is the bare,
`not-produced` `eco` on DS-ECO-12's trade-profile rows, which inherits the row's market nouns by
`fieldSynonymsFor`'s "the holder nouns apply to every field of the row" rule, `fieldSynonyms.js:112-114`).

---

## §1 THE FOUR LAYERS AS THE SURVEYOR TYPED THEM — verdicts

| # | Surveyor's claim | Verdict | Evidence |
|---|---|---|---|
| 1.1 | Seven defense buckets, not six; `magicDef` reaches this desk through `Alchemist shop` | **HOLDS** | `defenseInstitutionBuckets.js:105-111` `magicDef: ['wizard', "mages' guild", 'mage', 'academy of magic', 'golem workforce', 'alchemist']`, substring matches over the native semantic name (`:76-80`); `resourceChains.js` `mineralHot.processingInstitutions = ["Alchemist shop","Apothecary","Public bathhouse"]` (probed), so `[0]` is the `{institution}` fill at `economyStateProse.js:991` |
| 1.2 | `professional city watch` in garrison `:90` AND watch `:96` | **HOLDS** | quoted above; note it ALSO matches the watch bucket's `'city watch'` entry by substring — one name, two buckets, three keyword hits |
| 1.3 | The twelve `HOLDER_KINDS`, the four `STATE_ORGAN_KINDS`, the muster members `:188-192`, the watch order records `:210-212` | **HOLDS** | `holderTable.js:78-83`, `:115`, `:188-192` (walls/garrison/militia/mercenary/charter → `muster`), `:202-212` (`watch` token → `watch`, `blackMarketCapture`, `criminalCaptureState`, `safetyProfile` → `watch`) |
| 1.4 | `HOLDER_KIND_NOUN_ROWS` is the engine's own "which word may name the organ" table and "licenses nothing on its own" | **HOLDS** | `fieldSynonyms.js:77-90`; `:42-45` "it widens what arm Q, F25 and A0b can SEE; it licenses nothing on its own"; load-time throw on a mute kind `:96-102` |
| 1.5 | `granary`, `church`, `ledger` drafted and WITHDRAWN as holder rows | **HOLDS** | `holderTable.js:157-161` |
| 1.6 | `holdersOf` / `standingOf` / `sourceOfForTown` have NO product caller | **HOLDS** | `grep -rn` over `src/`: the only non-`holderTable.js` hits are the `wiringCensus.js:518-519` docblock and two `DailyLifeTab.jsx` lines that match the substring `standingOfLiving` (a mount name, not a call) |
| 1.7 | POWER rows: the capture ladder, per-faction `captureState`, INTERESTED on four organs, the SECURITY corruption impairment, the brokerage patron | **HOLDS** as rows; **CONDITIONAL** as a mapping — see §4 O-R2/O-R3/O-R4: the ladder is computed from faction POWER + `safetyRatio` with the institution flags UNUSED (`factionDynamics.js:220` `_instFlags`), a corruption impairment can land on ANY home institution, and the captor is never a typed slot | `rulingStructure.js:755`, `:764-766`, `:797`; `factionCapture.js:136`; `holderTable.js:674-694`; `corruption.js:630`, `:675-681`; `corruptionImpair.js:111`; `mutateEntities.js:831`; `brokeragePatronage.js:60` |
| 1.8 | ROLE: no typed NPC→institution edge; `officesOf` is `npc.role`/`npc.title`/the governing seat; the `Military/Guard` desc separates soldiers from officers | **HOLDS** | `institutionTable.js:129-138` (`read: false`, "none exists"); `:377-397`; `npcProfile.js:341-353` (`inferInstitutionLink` by `CATEGORY_INSTITUTION_HINTS` regex); `rulingStructure.js:590-593` |
| 1.9 | No economy read touches `npcs`; the ROLE layer is unreached by this desk | **HOLDS** | census reads (31) — zero match `/npc/i`; the `officesOf` caller is `institutionTable.js`, which the desk never imports |
| 1.10 | ADDENDUM 11's cites re-derived: seven buckets, `corruption.js` path, `:675-681` loop, `holderRole` data at `institutionTable.js:129-138` | **HOLDS** (all four corrections are right) | as above |

---

## §2 THE 31 READS BY LAYER — the surveyor's LAYER column refuted where it over-reaches

The law's BODY is "an institution row (`settlement.institutions[]` by recorded name)"
(ADDENDUM 11). A read that carries no institution cannot be a body read; tagging it BODY
licenses a body noun on it. The census resolves each of the reads below to `kind: ''`.

| # | Read(s) | Surveyor's LAYER | Verdict | Evidence / the correct layer |
|---|---|---|---|---|
| 2.1 | `rank` (DS-ECO-1 ×5) | BODY ("a standing condition of the town") | **REFUTED** | `rank` is the prosperity rung (`economyStateProse.js:961` `prosperityHeaderPoolKey(rank, access)`); no institution row, no holder kind (census `source.kind ''`). Layer: **NONE** — a town-condition read; any institution-class noun on it (*the halls* `:815`, *the books* `:811`) has no referent licence |
| 2.2 | `foodBalance`, `.available`, `.deficit`, `.surplus` (DS-ECO-2) | BODY | **REFUTED** | a balance, not a body; `granary` was withdrawn as a holder (`holderTable.js:157-159`); the BUILDING flag `hasGranary` (`priorityHelpers.js:63`) is never read by the desk. Layer: **NONE** — which is exactly why F6's "granary doors" fails |
| 2.3 | `granary`, `.available`, `.band` (DS-ECO-2) | BODY "(a STOCK, not the house)" | **REFUTED** as labelled (the parenthesis contradicts the tag) | `dossierViewModel.js:336` band over `storageMonths / capacityMonths`; civic class `store`, not `storehouse` (`wiringCensus.js:1309`, `:1317-1322` "a lone `granary` keeps `store`"). Layer: **NONE** (a stock band) |
| 2.4 | `readings.flowDrift.band` (DS-ECO-3) | BODY | **REFUTED** | a drift band; no row. Layer: **NONE** |
| 2.5 | `text(terrainKey)` (DS-ECO-11 ×7) | BODY "(the ground)" | **REFUTED** as BODY; **CONDITIONAL** as HOLDER | `terrainKey` is a local const at `economyStateProse.js:976` from `settlement.config.terrainType`; the register's `terrainType` row is kind `road` (`holderTable.js:233`), lost by the alias (surveyor's O12, HOLDS). Layer today: **NONE**; after a one-token repair: **HOLDER (road)**, resolving to `Listening post` / `Waystation` (`:350-356`) — never a body |
| 2.6 | `leading.bucket` · `leading.row` (DS-ECO-11 ×4) | BODY | **CONDITIONAL** | `leading.row` is a RESOURCE_CHAINS chain object (`resourceGenerator.js:175-177` push `chain`), whose `processingInstitutions[0]` fills `{institution}` (`economyStateProse.js:991`) — a body NAME, so BODY holds for the `{institution}` fill only, conditional on `leadingExploitation(analysis)` returning a row (`:746-767`); the bucket word itself carries no institution |
| 2.7 | `readings.notableAbsences` (DS-SUP-3 ×6) | BODY "(an absence against a tier)" | **REFUTED** | `deriveNotableAbsences(settlement.tier, settlement.availableServices)` (`economyDeskRead.js:108`) over `EXPECTED_SERVICES_BY_TIER` (`servicesDisplay.js:15-21`) — CATEGORY keys (`food · healing · equipment …`), never an institution row. Layer: **NONE** |
| 2.8 | `readings.impairedInstitution` (DS-SUP-3 ×1) | BODY | **CONDITIONAL** | it IS an institution name (a body) — but only when `ServicesTab.jsx:95-99` produces one (an `impaired` house in a rendered category); the census reads it `not-produced`. BODY conditional on production; and for the twelve force names the body is ALSO a bucket member / holder / regex match (§3.2 below) |
| 2.9 | `eco.safetyProfile.blackMarketCapture` (DS-ECO-6 ×3) | ORGAN-UNDER-POWER | **CONDITIONAL** | HOLDER = `watch`, a STATE ORGAN (`holderTable.js:210`, `:115`) — HOLDS. UNDER-POWER holds ONLY where `standingOf(inst, settlement, world, 'watch').interested` is true: `capturedRulingStructure(settlement).captured` (`:129-143`), i.e. `criminalCaptureState !== 'none'` or a faction `captureState !== 'none'` — and `standingOf` has no product caller (§1.6), so no rendered face ever resolves it. On the corpus the docblock records `none` on 495 of 768 towns (`:99-102`). The read's VALUE is a shadow estimate `min(80, round(max(0,(criminalEffective-25)/3)) + stress bonuses)` (`safetyProfile.js:619-638`) with no join to the ladder (`factionDynamics.js:220-245` reads faction powers + `safetyRatio`). Correct layer: **HOLDER (watch, state organ); ORGAN-UNDER-POWER where the town is captured** |
| 2.10 | `eco.incomeSources` ×4 (DS-ECO-12 ×5) | ORGAN-UNDER-POWER | **CONDITIONAL** | same shape: HOLDER = `treasury` (`holderTable.js:166`), a state organ; the power is the same birth capture, town-conditional, unresolved in product. The criminal LINE inside the mix (`isCriminal`) is a treasury record fact, not a standing over the treasury |
| 2.11 | `eco.foodSecurity.stockpile.blockaded` · `.blockadeBypass` (DS-ECO-9) | "BODY, cited to an organ" | **REFUTED** on both words | not a body (no institution row; `foodStockpile.js:417-418` writes the flags from the active blockade stressor); not an organ (`toll-bar` ∉ `STATE_ORGAN_KINDS`, `:115`; `standingOf` prints "toll-bar is not one of the state's own organs" `:685`). Layer: **HOLDER (toll-bar)** — `Gates (if walled)` / `Major Port` / `Town council` by `holdersOf` (`:304-310`), nouns `book · books · toll` |
| 2.12 | `readings.exportPosture.status` (DS-ECO-10 ×6); `analysis.economicStrengths` · `.strategicValue`; `eco.isEntrepot` · `.localProduction` · `.primaryExports` · `.primaryImports` (DS-ECO-12) | "BODY, cited to an organ" / BODY | **REFUTED** on "body" and "organ" | all are `market` kind (`holderTable.js:170-180`); the market kind is a HOLDER resolving to `Market square` by its `Weekly market` / `Public auctions` service rows (`:311-317`), not a state organ, and none of the reads is an institution row. Layer: **HOLDER (market)**. **CONDITIONAL rider**: a market holder CAN be INTERESTED world-run — `standingOf` marks any live row carrying `impairments[].type === 'corruption'` (`:660-661`, `:671`), and that impairment is written on an NPC's HOME institution of any kind (`corruptionImpair.js:111` public on ousting; `mutateEntities.js:831` covert on an individual-institution capture) — so "never under a power" is false; "never a state organ" is true |
| 2.13 | `eco` (bare, DS-ECO-12 trade profile) | "market (`eco` itself unresolved)" | **HOLDS** | census `absent: not-produced`, `source.kind market` from the sibling fields; `fieldSynonyms['eco'] = book/books/stall` by the row rule |
| 2.14 | "Exactly one read on this desk carries `watch` as a ratified noun" | **HOLDS** | census `fieldSynonyms`: only `eco.safetyProfile.blackMarketCapture => ["roll","rolls","watch"]` |
| 2.15 | "16 of 31 reads carry a ratified organ noun; 15 carry none" | **HOLDS** (with the `eco` note in §0) | reproduced from `wiring-census.json` `fieldSynonyms` |
| 2.16 | `terrainKey` vs `terrainType` loses the `road` holder on seven RESOLVED pools | **HOLDS** | `economyStateProse.js:976`; `holderTable.js:233`; census `fields: {"terrainKey": ""}`, `standing SOURCE-UNRESOLVED` on all seven TERRAIN pools |

**The correction the chair should carry into rule 2's skeleton tag:** on this desk the honest
column has FOUR values, not three — BODY (only the two `{institution}` fills) · HOLDER (market ×14,
toll-bar ×2, watch ×1, treasury ×4 — a record's keeper, citable, not under a power) ·
ORGAN-UNDER-POWER (the watch and treasury rows, only where the town is captured) · **NONE**
(the other 21 reads: bands, balances, statuses, a terrain token, absences). A tag vocabulary with
no NONE will be filled with BODY, which is what the surveyor did.

---

## §3 EVERY INSTITUTION-CLASS NOUN — verdicts on the surveyor's rows

### §3.1 Slot-borne

| # | Claim | Verdict | Evidence / condition |
|---|---|---|---|
| 3.1a | `{institution}` on DS-ECO-11 has 16 members, from `processingInstitutions[0]` | **CONDITIONAL** | 16 distinct `[0]` values reproduced from `RESOURCE_CHAINS`; the exploitation rows ARE the chain objects (`resourceGenerator.js:175-177`), so `[0]` is the chain's own. Condition: `leadingExploitation` returns a row (`economyStateProse.js:746-767`) and `properFill` accepts it (`:320-332`). The surveyor's "1 of 25 refused: `Bakers (5-15)`" quotes `properFill`'s measurement over ALL positions — `Bakers (5-15)` is `[2]` of the grain chain (`resourceChains.js:58`) and never fills this slot |
| 3.1b | those 16 are BODY only; `Alchemist shop` is a `magicDef` keyword; `Weavers' guild` fires `hasGuild`; `Market` collides with the market kind and class | **HOLDS** | `defenseInstitutionBuckets.js:110`; `priorityHelpers.js:57` (`'guild'` substring); `holderTable.js:311-317`; `wiringCensus.js:1310` |
| 3.1c | `{institution}` on DS-SUP-3 can be any of the 65 `TRADE_DEPENDENCY_NEEDS` keys with a rendered service row, including the twelve force names | **CONDITIONAL** (the chain HOLDS; the condition is the impairment) | 65 keys and the twelve names reproduced (`economicData.js`); `economicState.js:712-720` pushes `institution: instName`; `tabHelpers.js:38-45` adds the house to `impaired` only when `severity === 'critical' || hasSiege || isIsolated` (a `high` severity is `degraded`, not impaired); `ServicesTab.jsx:88` `catOrder` over rendered categories, `:95-99` first impaired house by codepoint, `:100` → `economyDeskRead.js:109` → `economyStateProse.js:999`; `serviceCategoryTables.js:40-44` files the five force houses under `employment`, a category `EXPECTED_SERVICES_BY_TIER` never expects (`servicesDisplay.js:15-21`) — so the absences lens can never name a force body and the impaired lens can |
| 3.1d | "BODY + HOLDER-ORGAN + POWER-ELIGIBLE at once for the watch rows" | **CONDITIONAL on the member** | `Town watch` and `Professional city watch`: watch bucket (`:95-97`), the watch kind's two roster holders (`holderTable.js:318-324`), inside `SECURITY_INSTITUTION_RE` (`corruption.js:630`) — all three. `Garrison` / `Barracks` / `Multiple garrisons`: garrison bucket + regex, but a HOLDER of NO kind (the muster kind's only roster holder is `Citizen militia`, `:281-288`). `Citizen militia`: militia bucket + muster HOLDER, not in the regex. `Town walls` / `City walls and gates` / `Massive walls…` / `Citadel`: walls bucket only — no holder, no regex. `Free company hall` / `Mercenary quarter`: mercenary bucket only |
| 3.1e | "there is no safe class word: the slot renders a proper name and the writer cannot substitute" | **HOLDS** | `properFill(text(readings.impairedInstitution))` `:999`; the variant names `{institution}` (leaf DS-SUP-3 vids 0 and 2, `slots ["institution","settlement"]`) |
| 3.1f | `{faction}` is deliberately unfilled; anchored liveness drops the variant; three faces name it | **HOLDS** | `economyStateProse.js:910-921`; `stateProseKernel.js:161-166`; census `slotsWithoutProvider: ["faction"]` on DS-ECO-6 ≥30, DS-ECO-12 criminal-present, DS-SUP-2 CAPTURED; leaf DS-ECO-6 ≥30 vid 2 `slots ["faction"]`, DS-ECO-12 criminal-present vid 2 `slots ["settlement","faction"]` |
| 3.1g | "would be `powerStructure.factions[].faction`" — the typed slot that names the POWER | **CONDITIONAL, and sharper than the surveyor says** | the roster names factions, but the CAPTOR is nowhere typed: `capturedRulingStructure` returns `faction: String(captured[0])` where `captured` is a list of `captureState` STRINGS, not names (`holderTable.js:133-137`); the governing entry's `captureState` is the settlement ladder MIRRORED onto it at `rulingStructure.js:764-766` (`if (govEntry && !govEntry.captureState) govEntry.captureState = criminalCaptureState`), so the faction "under capture" is the government, not the criminal power; the criminal power is identified only by `category === 'criminal'` or a name containing `thiev` (`factionDynamics.js:221`). A `{faction}` fill would need a selection rule the engine does not record as a slot |
| 3.1h | `{access}`: `road` is also a HOLDER KIND (Listening post / Waystation) and a civic class | **HOLDS**, plus §4 O-R1 | `ACCESS_NOUN` `:173-179`; `holderTable.js:233-234`, `:350-356`; `wiringCensus.js:1313` |

### §3.2 Baked common nouns

| # | Noun · claim | Verdict | Evidence |
|---|---|---|---|
| 3.2a | the granary: band / building flag / capacity rows / chain house / storehouse class; the BUILDING is never read; withdrawn holder | **HOLDS** | `dossierViewModel.js:336`; `priorityHelpers.js:63`; `foodStockpile.js:185-195` (`has('state granary')` … `has('granary')`); `wiringCensus.js:1322`; `holderTable.js:157-159` |
| 3.2b | the market: `Market square` market kind; `Weekly market` INSTITUTION a treasury holder by `Tax collection`; `hasMarket`; class; chain house | **HOLDS**, plus §4 O-R5 | `holderTable.js:311-317`; `institutionServices.js:524-526` (`"Weekly market": { "General trade", "Tax collection": {on: true} …}`); `priorityHelpers.js:56`; `wiringCensus.js:1310` |
| 3.2c | its mill: `has('mill')` substring raises capacity 1.25; `river_mills` typed `infrastructure`; terrain `Mill` | **HOLDS** | `foodStockpile.js:194`; `resourceSemantics.js:71-72` `river_mills: { type: 'infrastructure' …}`; `geographyData.js:170` |
| 3.2d | the guilds: `hasGuild` on the bare token fires on `Thieves' guild`; factions `Craft Guilds` / `Merchant Guilds` | **HOLDS** | `priorityHelpers.js:57`; `rulingStructure.js:647`, `:506` |
| 3.2e | the hall: `hall` class; court holders; `Town hall` treasury AND office | **HOLDS** | `wiringCensus.js:1314`; `holderTable.js:325-331`, `:272-279`, `:357-364` |
| 3.2f | the gates: `Gates (if walled)` a toll-bar holder; `gate` in the `wall` class; `gate control` a Town watch service | **HOLDS** | `holderTable.js:304-310`; `wiringCensus.js:1302`; `economicData.js` `'Town watch'.svcs = ['law enforcement','patrol','gate control']` |
| 3.2g | the walls: walls bucket, muster token, wall class; no economy read is a walls read | **HOLDS** | `:84-87`; `holderTable.js:188`; `:1302`; census reads |
| 3.2h | its watch: BODY + HOLDER + STATE ORGAN, on a terrain read with an empty noun set | **HOLDS** | bucket `:95-97`; kind `:202-212`; organ `:115`; `hasWatch` `:48`; `hasMilitaryInst` `:45`; `force` class `:1303`; census DS-ECO-11 Forest `source.kind ''`; leaf vid 1 `marks null`, mounted `resources.groundAndWorkings` |
| 3.2i | warehouses / workshops / yard / stalls / house / quarter / workings / stores rows | **HOLDS** | classes `:1309`, `:1315`, `:1316`, `:1322`; `stall` ∈ market nouns `:83`; `healing` a category key `servicesDisplay.js:16-21` |

### §3.3 Record words

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| 3.3a | *the rolls* on DS-ECO-6 ≥15 v1 is ON-ORGAN (`roll · rolls · watch`) | **HOLDS** | `fieldSynonyms.js:84`; census entry |
| 3.3b | *the duties* is "the toll-bar/treasury duty vocabulary (`DUTY_SERVICE_KINDS`)" | **REFUTED** on the vocabulary claim; the conclusion stands | `institutionTable.js:106` `/\b(tithes?\|dues\|tax(?:es)?\|taxation\|tolls?\|customs\|…\|rolls?)\b/i` — "duties"/"duty" is NOT in it. The only catalog "Duties" is `Customs house`'s `"Duties and tariffs"` (`institutionServices.js:530-531`), and `Customs house` is in no `HOLDER_RECORDS` cite (`holderTable.js:304-310` names Gates / Major Port / Town council). So *duties* is licensed by NO holder row on any desk — and the watch kind's `dutyNamed` is 0 (`:318-324`) as the surveyor says |
| 3.3c | *accounts*, *ledgers*, *returns* ratified for no kind | **HOLDS** | `fieldSynonyms.js:77-90`; `ledger` withdrawn `holderTable.js:160-161` |
| 3.3d | *the survey* → the office kind, a citation is a finding, arm A13's OFFICE limb | **HOLDS** | `holderTable.js:84`, `:357-364`; `composedWalker.js:1011` `UNLICENSED_SOURCE = ['SOURCE-UNRESOLVED','OFFICE']`, `:1066-1069` |
| 3.3e | *the counts* → census kind; no economy read is census-kind | **HOLDS** | `:80`; census |
| 3.3f | *purse* / *chest* unused on the desk; *accounts* carries 8 rows | **HOLDS** (counts: purse/chest 0; accounts 9 lines, books 9 lines over `:792-1760`) | grep over the annex range |
| 3.3g | the `[ledger]` angle and the source column are two authorities over the same nouns; A13 counts a PROVENANCE move without asking which | **HOLDS** as a description; a chair question (Q1), not a claim | annex `:122`; `fieldSynonyms.js:42-45`; `composedWalker.js:1018-1020`, `:1045-1051` |

### §3.4 Role words

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| 3.4a | *a stranger* ×42, every `[visitor]` variant; a narrative standpoint, not a role | **HOLDS** (count reproduced: 42) | annex `:124` |
| 3.4b | *the crier* ×5 (DS-ECO-4): `CRIER_FRAMES` is a copy table, not an office | **HOLDS** | `marketPrices.js:228-239` |
| 3.4c | *a clerk / the clerks* ×3 at "DS-SUP-1 v2, DS-ECO-6 ≥30 v1 & ≥3 v1" | **CONDITIONAL — count right, one location wrong** | `:1080` (DS-SUP-1 ENTREPÔT v2), `:1122` (DS-ECO-6 ≥3 v1 "the clerks"), `:1649` (DS-ECO-12 criminal-present v1 "to a clerk"); DS-ECO-6 ≥30 v1 (`:1109`) names no clerk |
| 3.4d | *the men* (DS-ECO-6 ≥15 v1) a force-register idiom on ratepayers | **HOLDS** | `:1116` |
| 3.4e | *Merchants* a frozen engine string | **HOLDS** on "frozen"; **REFUTED** on its home (§0: `EconomicsTab.jsx:664`, not `economicDragDesc`) | |
| 3.4f | `[elder]` is an angle; `elders` a holder kind | **HOLDS** | annex `:125`; `holderTable.js:78`; `fieldSynonyms.js:86` |
| 3.4g | none of ADDENDUM 11's example role words appears in the desk's 355 lines | **HOLDS** for variants | grep: `healer` appears once, in a fence note (`:1699`), never in a variant; `captain · reeve · priest · factor · steward · lord · magistrate · officer · smith` 0 |

---

## §4 THE OVERLAPS — the surveyor's O1–O13 and five it missed

O1–O13: **all HOLD** (each re-derived; O13's `tabHelpers.js:36-45` is the `impaired` branch at `:38-45`).

**ADDED OVERLAPS (wiring facts for the register car, rule 5):**

| # | The overlap | Rows (file:line) | How it reaches the desk |
|---|---|---|---|
| **O-R1** | `{access}` is filled from **`eco.tradeAccess`**, an unmapped alias of the toll-bar-kind field `tradeRouteAccess` | `economyStateProse.js:888` `const access = text(eco.tradeAccess)`; `economicState.js:870` `tradeAccess: tradeRoute`; `holderTable.js:182` `tradeRouteAccess: { kind: 'toll-bar' }` | the same O12 shape as `terrainKey`: DS-ECO-1's five RESOLVED pools resolve to no kind, and the word *road* on them is at once a toll-bar-kind VALUE one hop upstream, the ROAD holder kind's name (`:233-234`), and the `road` civic class (`:1313`). Three rows, one word, no licence |
| **O-R2** | The capture ladder that makes the WATCH ORGAN interested is computed from the **`Military/Guard` FACTION's power** and the criminal faction's power against `safetyRatio`; the watch BODY's presence does NOT feed it (`_instFlags` unused) | `factionDynamics.js:220` `computeCriminalCaptureState(factions, safetyRatio, _instFlags)`; `:221` `isCrim`; `:233` `mil = factions.find(f => f.faction.includes('military') \|\| includes('guard'))`; `:244` the capture rung | a body word (*guard*) inside a POWER name drives a standing on an ORGAN; the body word *watch* (`hasWatch`) drives nothing on that organ. The referent law's "same word, same referent" has an engine-side counter-example |
| **O-R3** | The governing faction's per-faction `captureState` is the settlement ladder MIRRORED, not an independent fact; `capturedRulingStructure().faction` is a ladder STRING, not a name | `rulingStructure.js:764-766`; `holderTable.js:133-137` `captured = factions.map(entry => entry.captureState)…; faction = String(captured[0])` | there is no typed slot naming the CAPTOR anywhere the desk can reach; a `{faction}` fill from the roster would name the GOVERNMENT (pushed first, `:457`) as "the faction under capture" |
| **O-R4** | A `corruption` impairment is written on ANY NPC home institution, not only on `SECURITY_INSTITUTION_RE` matches; `standingOf` reads it on any live row | `corruptionImpair.js:111` (public, on ousting, `e.homeInstitution`); `mutateEntities.js:831` (covert, `scope === 'individual_institution'`, `npcHomeInstitution(corrupted)`); `holderTable.js:660-661`, `:671`, `:709` | a MARKET holder (`Market square`) or a TOLL-BAR holder (`Gates`, `Major Port`, `Town council`) can be INTERESTED world-run — invisible to `compromisedSecurityInstitutions` (`corruption.js:664-665`, security-scoped) and to the census's `COVERT_SOURCES` (`:1252-1259`, which lists `impairment.covert` but no economy read carries it) |
| **O-R5** | `Weekly market` is BOTH an INSTITUTION name (a treasury holder by `Tax collection`) AND a SERVICE name of `Market square` (the market kind's own record service) | `institutionServices.js:524-526`; `:1064-1065`; `holderTable.js:311-317` `services: ['Weekly market','Public auctions']` | the string that licenses the market KIND's holder is the name of a different holder of the TREASURY kind; *the market* on a market-kind read can name either row |
| **O-R6** | `blackMarketCapture` (the watch organ's one licensed economy read) and `criminalCaptureState` (the ladder that makes that organ interested) are two computations with no join | `safetyProfile.js:619` `baseShadowPercent = round(max(0,(flags.criminalEffective-25)/3))`, `:624-638` stress bonuses, `:638` `min(80, …)`; `factionDynamics.js:220-245` | a face that reads the off-book share as evidence of capture ("bought", "under a hand") asserts a relation no field computes (rule 3's fused agent, one layer up) |

---

## §5 MISSED NOUNS — institution-class nouns and role words the surveyor did not row

| Noun | Occurrences (annex `:792-1760`) | Engine rows | Why it belongs in the table |
|---|---|---|---|
| **the road / the roads** | **31** (`road` 19, `roads` 12 — e.g. `:815`, `:826`, `:830`, `:858`, `:915`, `:917`, `:922`, `:928`, `:932`, `:938`, `:1022`, `:1084`, `:1086`, `:1254`, `:1259`, `:1272`, `:1436`, `:1443`, `:1521`, `:1681`) | the ROAD holder kind (`holderTable.js:233-234` → `Listening post` / `Waystation` `:350-356`, nouns `book · books` `:88`); the `road` civic class (`:1313`); the `{access}` value (`:173-179`) via `eco.tradeAccess` (O-R1) | the desk's most-baked institution-adjacent word and absent from §3.2. As a PLACE word it carries no layer; but it is a holder kind's NAME, and on the seven TERRAIN pools (whose read would be road-kind after O12) and DS-ECO-1 (toll-bar one hop up) a refuter needs a ruling: is *the road* the route (safe) or the road-kind record (a citation)? |
| **the hands** (as a POWER) | DS-SUP-2 `CAPTURED` v2 `:1337` "goes through the same hands now, and those hands are paid before anyone else is" (plus workers' hands at `:810`, `:1061`, `:1182`) | none typed; the pool has NO PRODUCER (`:1335`) | a POWER named through a body-part idiom to dodge the dark `{faction}` — the same class as the surveyor's F13 ("one name") and unlisted |
| **a clerk** at DS-ECO-12 | `:1649` criminal-present v1 | the `[ledger]` persona (`:122`) | mislocated by the surveyor (§3.4c) — a role word on a TREASURY organ read, dm-only |
| **Customs house / duties** | the word *duties* ×3 in DS-ECO-6; the HOUSE is a catalog institution | `institutionServices.js:529-532` `"Customs house": { "Duties and tariffs", "Cargo inspection" …}`; not in any `HOLDER_RECORDS` cite | the one place the engine's own vocabulary carries *duties*, and it is a house that keeps no ratified record — the F4 correction (§3.3b) |
| **the market** on DS-ECO-9 `BLOCKADE BYPASSED` v3 | leaf vid 2 "the market is not empty" (player) | toll-bar read; market nouns are not the toll-bar's | listed by the surveyor under "the market" occurrences but not as a wrong-organ instance |
| **Warden's Lodge · Workhouse · Hunter's lodge · Adventurers' charter hall** | `{institution}` on DS-SUP-3 | `serviceCategoryTables.js:45-50` (`employment`); charter hall = charter bucket `:101-104` and the muster token `charter` (`holderTable.js:192`) | more `employment` houses the impaired lens can name; the charter hall is a muster-kind TOKEN with no roster holder |

Not institution-class, recorded so nobody rows them later: *the carts*, *the caravans*, *the
fields*, *the line* (a chain), *the yard* (rowed), *the crown/lord/manor/keep* (0 occurrences).

---

## §6 FINDINGS F1–F20 — verdicts

| # | Verdict | Note |
|---|---|---|
| F1 (*its watch*, Forest v2) | **HOLDS** | quote at `:1521`; leaf vid 1, `marks null`, mounted at `resources.groundAndWorkings`; read `source.kind ''` |
| F2 (`{institution}` = a force body on DS-SUP-3) | **HOLDS** | chain reproduced §3.1c; leaf vids 0 and 2 name the slot; player-audible; card prints `source: (none) · SOURCE-UNRESOLVED` |
| F3 (*the guilds* on a watch-organ read) | **HOLDS** | `:1112`; body flag `:57` + faction name `:647` |
| F4 (*duties*) | **HOLDS** as a wrong-word finding; the surveyor's route is REFUTED (§3.3b) — *duties* is nobody's ratified noun, not the toll-bar's |
| F5 (*dictate to the hall*) | **HOLDS** | `:1641`; treasury read; `hall` class `:1314` |
| F6, F7 (the granary building on stock/balance reads) | **HOLDS** | `:860`, `:889` |
| F8 (*the gate returns* on a pool with no reads) | **HOLDS** | `:916`; DS-ECO-3 4 of 5 rows WIRING-UNRESOLVED |
| F9 (*the rolls* licensed on ≥15 v1) | **HOLDS** | `:1116`; `:84` |
| F10 (*rolls* on unwired SUP-1 pools) | **HOLDS** | `:1074`, `:1084` |
| F11, F12 (`{faction}` never renders) | **HOLDS** | `:1111`, `:1651`; `:910-921` |
| F13 (*one name*) | **HOLDS**, and v2 *the same hands* (`:1337`) is the same defect unlisted |
| F14, F15 (fused agents on unwired DS-ECO-5) | **HOLDS** | `:1027`, `:1035` |
| F16 (*a licence*) | **HOLDS** | `:1123`; `Market charter and tolls` is toll-bar `:304-310` |
| F17 (*nobody guarding the region's roads*) | **HOLDS** | `:1388` |
| F18 (canonical rows unmarked in a "wholly dm-only" block) | **HOLDS** | leaf DS-ECO-6 ≥15 vid 0 and ≥3 vid 0 `marks null`; annex `:1095-1097`; the string's home corrected (§0) |
| F19 (*its mill* on a terrain read) | **HOLDS** | `:1535`; `resourceSemantics.js:71-72` |
| F20 (*the books* on no-holder pools) | **OPEN** as the surveyor says (Q1) | `:811`, `:1187` |

Wiring debt W1–W8: **all HOLD** (W5: `prose-licence-card.mjs:329-338` prints kind + standing +
organ, no layer; W7: purse/chest 0, accounts 9). Add **W9** (O-R1, the `tradeAccess` alias) and
**W10** (O-R3, no typed captor slot; a `{faction}` fill needs a selection rule the engine does
not record).

---

## §7 WHAT THE CHAIR SHOULD TAKE FROM THIS REFUTE

1. **Rule 2's tag needs a fourth value, NONE.** Twenty-one of this desk's 31 reads carry no
   institution; a three-valued tag forces BODY onto them and licenses body nouns on stock bands.
2. **HOLDER ≠ ORGAN-UNDER-POWER.** The market, toll-bar, treasury and watch reads are HOLDER
   reads (citable by their ratified nouns, `fieldSynonyms.js:77-90`); the standing over the
   holder is a town-conditional fact (`standingOf`, no product caller) — so on THIS desk every
   "under a power" sentence is unlicensed at draw time, on captured and uncaptured towns alike,
   until a caller resolves it. The surveyor's Q3 is right and the answer today is (a): the desk
   stays on the organ's own record.
3. **Rule 1's "names the power only through the typed slot the engine records" has no object
   here**: the captor is not a slot (O-R3); the `{faction}` fill is dark; and the ladder is fed by
   a faction whose NAME contains a body word (O-R2). Rule 5 should list O-R1…O-R6 beside O1–O13.
4. **Rule 4 (visibility follows the power layer) stays an author's mark on this desk** — the
   surveyor's §6 finding HOLDS; O-R4 adds that the engine's covert channel can reach a market or
   toll-bar holder the census never marks covert.
5. **The surveyor's Q2 (*a stranger*) should be answered in the law's text**: rule 2 targets an
   institution-role word standing in for an institution; a narrative observer is an angle.
