| id | recorded verdict | noun | VALIDATION | note (label · evidence) |
|---|---|---|---|---|
| RT2.1-01 | SPLIT | wall · walls | **OK** | CONFIRMED kept half: forces.walls.present / hasWalls priorityHelpers.js:52; struck half (muster-holder layer, "the line") safe with the stated unwalled qualifier. |
| RT2.1-02 | SPLIT | citadel · palisade · earthwork · massive walls | **OK** | CONFIRMED R-7: institutionVocabulary.js fixes material; struck half (blanket material bar) safe. |
| RT2.1-03 | CONTRADICTION | gate · gates | **OK** | CONFIRMED hasGates :53 includes palisade; DS-DEF-5 walls ABSENT on the same desk. Permission safe. |
| RT2.1-04 | STRUCK | `{defwork}` (the slot) | **OK** | CONFIRMED a slot mechanic; nothing false licensed. |
| RT2.1-05 | CONTRADICTION | garrison | **OK** | CONFIRMED :46 and defenseStateProse.js:655 read garrison; R-3. |
| RT2.1-06 | STRUCK | barracks | **OK** | CONFIRMED :46 "barracks" in hasGarrison; buckets :89; safetyProfile.js:281 prints "The garrison" off the flag. Worst sentence ("the garrison drills") is the engine's own word. |
| RT2.1-07 | STRUCK | professional guard | **REVERSE** | CONFIRMED should be SPLIT ¦ institutionalCatalog.js:1352 (Town watch = "Part-time guards"), safetyProfile.js:300, priorityHelpers.js:46 ¦ floor 1. "use the phrase as flavour; it asserts no row" is false: "professional guard" asserts a professional body. Worst: "a professional guard keeps the gate" on a Town-watch-only town (F1-27) or a bodiless thorp (F1-04). |
| RT2.1-08 | CONTRADICTION | militia · citizen militia | **OK** | CONFIRMED holderTable.js:279-288 (muster kind = Citizen militia only). |
| RT2.1-09 | CONTRADICTION | mercenary company · mercenary quarter · hired muscle | **OK** | CONFIRMED defenseStateProse.js:1284. |
| RT2.1-10 | CONTRADICTION | adventurers' charter hall | **OK** | CONFIRMED :51. |
| RT2.1-11 | STRUCK | magicDef bodies (wizard · mages' guild · academy · alchemist · golem w | **CHALLENGE** | CONFIRMED the strike is right (bucket read in code); the permission "on DS-DEF-5's arcane pools" must be the PRESENT pool only: the ABSENT pool and defenseDisplay.js:225 "Magical Capability: None" deny arcane provision (F1-17). |
| RT2.1-12 | STRUCK | `force` (the token) | **OK** | CONFIRMED token fact; label traps carried by body rows. |
| RT2.1-13 | SPLIT | watch | **OK** | CONFIRMED kept: :48 + safetyProfile.js:300; struck pay-gate bar: defenseGenerator.js:177-178 counts hasWatch; fieldSynonyms.js:51. Permission qualified. |
| RT2.1-14 | STRUCK | court · courthouse | **CHALLENGE** | CONFIRMED should be SPLIT: the noun row is "court · courthouse" and RT2.5-11/F1-12 keep the courthouse BUILDING; the WORD is rightly free — and the closing essay's premise ("a hall and no court") is defeated by defenseDisplay.js:231 printing "Court only"/"Courts without detention" off hasCourtSystem, safetyProfile.js:330 "A court exists", and the engine's own DS-DEF-6 face "{settlement} tries and cannot hold" (defense.generated.js:2858). The permission cell as written licenses no false sentence. |
| RT2.1-15 | CONTRADICTION | prison · gaol · stocks | **OK** | CONFIRMED :54; defenseDisplay.js:231 prints "Legal Infrastructure: None". |
| RT2.1-16 | STRUCK | treasury | **OK** | CONFIRMED W24 struck; F2-01 bars any sum; F1-24 keeps only the unresolved-holder citation. No field denies "the purse". |
| RT2.1-17 | STRUCK | office | **OK** | CONFIRMED provenance rule. |
| RT2.1-18 | SPLIT | granary · the stores | **OK** | CONFIRMED :63 kept. |
| RT2.1-19 | STRUCK | hospital · infirmary | **OK** | CONFIRMED :64 catches "healer"; AND defenseDisplay.js:237 prints "Medical Readiness: Hospital present" off the same flag — the engine's own word (rule 3), which the closing essay §5 omits. NOTE the CT's F1-14 keeps "a HOSPITAL or infirmary BUILDING" on the same evidence: the fold contradicts itself; see CHALLENGE list. |
| RT2.1-20 | CONTRADICTION | church · parish · clergy | **OK** | CONFIRMED :65 fires on "priest","shrine", and on Access to parish church (institutionalCatalog.js:50-54 "Walk 2-5km to village church"). |
| RT2.1-21 | CONTRADICTION | port · docks · harbour | **OK** | CONFIRMED PORT_INFRA_RE :32, :61. |
| RT2.1-22 | STRUCK | navy · fleet | **OK** | CONFIRMED conditional on a naval row; safe. |
| RT2.1-23 | STRUCK | road | **OK** | CONFIRMED holder-layer bar. |
| RT2.1-24 | CONTRADICTION | `{seat}` (the slot) | **OK** | CONFIRMED rulingStructure.js:284, :452. |
| RT2.1-25 | STRUCK | the ruling structure | **OK** | CONFIRMED class word. |
| RT2.1-26 | MODEL | `criminalCaptureState` (the ladder) | **OK** | CONFIRMED rulingStructure.js:762-767; holderTable.js:661. |
| RT2.1-27 | STRUCK | per-faction `captureState` | **OK** | CONFIRMED no defense pool reads per-faction captureState (holderTable.js:136-141 reads it for capture only); template harmless. |
| RT2.1-28 | STRUCK | `{faction}` (the slot) | **OK** | CONFIRMED wiring; nothing handed back. |
| RT2.1-29 | SCOPE | `{npc}` (the slot) | **OK** | CONFIRMED floor 3. |
| RT2.1-30 | CONTRADICTION | the criminal interest · the operators · the syndicate | **OK** | CONFIRMED defenseDisplay.js:183-195; label "Organized Syndicate" at :162. |
| RT2.1-31 | STRUCK | a corruption impairment | **OK** | PLAUSIBLE no landed pool; VIS-01 governs. |
| RT2.1-32 | STRUCK | a brokerage PATRON | **OK** | PLAUSIBLE not a defense read. |
| RT2.1-33 | STRUCK | practitioner(s) | **OK** | CONFIRMED person rule relaxed; DS-DEF-9 reads magicDependency so a practitioner exists where it fires. |
| RT2.1-34 | STRUCK | `Town Mayor` · `Elected Reeve` · `Feudal Appointee` | **OK** | CONFIRMED engine string; RT2.1-24 keeps the label. |
| RT2.1-35 | SPLIT | soldiers (missed noun) | **CHALLENGE** | CONFIRMED "put men on the wall of a walled town" on a walls-only town sits beside the "NO organized force at all" pool (defenseStateProse.js:1273-1274); the permission should carry the force label trap. |
| RT2.1-36 | STRUCK | army (the enemy's; the town's abroad) | **CHALLENGE** | CONFIRMED "the column on the road" asserted as PRESENT contradicts an empty besiegedBy (holderTable.js:196 → warStatus.js:297); the threat pools are hypothetical (F1-34). Qualify to the hypothetical frame. |
| RT2.1-37 | STRUCK | the line | **CHALLENGE** | PLAUSIBLE "use the line for either" must carry F1-07's qualifier ("a line around the town" is a wall claim) on unwalled towns; the closing essay's join argument is a page-grain finding of NF-10's class, not a per-face one. Strike stands; permission under-qualified. |
| RT2.1-38 | CONTRADICTION | specialists · specialist recourse | **OK** | CONFIRMED forces.charter.present. |
| RT2.1-39 | CONTRADICTION | `Household levy` | **OK** | CONFIRMED institutionalCatalog.js:104; defenseStateProse.js:1273-1274; and threatDefensePolicy.js:13 lists Household levy as a force the buckets miss. Engine contradiction; nothing handed back. |
| RT2.1-40 | STRUCK | `{counterpart}` (the slot) | **OK** | CONFIRMED wiring. |
| RT2.1-41 | STRUCK | `{institution}` (the slot) | **OK** | CONFIRMED wiring. |
| RT2.1-42 | SPLIT | the occupier · the people who put them here | **OK** | CONFIRMED occupationStatus.js:95-103 has no garrison field; permission split correctly. |
| RT2.1-43 | STRUCK | the purse | **OK** | CONFIRMED organ word. |
| RT2.1-44 | STRUCK | the town's law · the law | **OK** | CONFIRMED safetyProfile.js:281 bakes the function word. |
| RT2.1-45 | CONTRADICTION | fences · bandits · small operators | **OK** | CONFIRMED defenseDisplay.js:189. |
| RT2.1-46 | STRUCK | the sick-house · infirmary · the parish | **OK** | CONFIRMED corrected cell hands back nothing; the nouns are governed by RT2.1-19/-20. Verdict as a restatement is fine. |
| RT2.1-47 | SPLIT | per-arm badge · overall readiness · safety label · criminal structure  | **OK** | CONFIRMED safetyProfile.js:56-62 community bonus; permission qualified "where the town has them". |
| RT2.1R-01 | STRUCK | **assignment tried (survey):** "the wall family has NO organ, NO power | **OK** | CONFIRMED research. |
| RT2.1R-02 | MODEL | **assignment tried (survey):** `hasWatch` "consumed by safetyProfile,  | **OK** | CONFIRMED defenseGenerator.js:177-178. |
| RT2.1R-03 | STRUCK | **assignment tried (survey):** "the engine's own prose never bakes 'th | **OK** | CONFIRMED safetyProfile.js:281/:288/:297/:307 bake "The watch". |
| RT2.1R-04 | STRUCK | **assignment tried (survey):** DS-DEF-5 arcane pools "read `magicWorks | **OK** | CONFIRMED wiring. |
| RT2.1R-05 | CONTRADICTION | **assignment tried (survey):** `NO organized force at all` reads "the  | **OK** | CONFIRMED :1273. |
| RT2.1R-06 | MODEL | **assignment tried (survey):** O-2 "a pay/upkeep read does not reach t | **OK** | CONFIRMED fieldSynonyms.js:51. |
| RT2.1R-07 | STRUCK | **assignment tried (survey):** O-12 "four bucket keywords match no shi | **OK** | CONFIRMED count. |
| RT2.1R-08 | STRUCK | **assignment tried (survey):** "a law expensive at the ROLE layer cost | **OK** | CONFIRMED role bar; slot label binds via RT2.1-24. |
| RT2.1R-09 | STRUCK | **assignment tried (survey):** §0 "`--section` handling does not exist | **OK** | CONFIRMED tooling. |
| RT2.1R-10 | CONTRADICTION | **assignment tried (survey):** "the guard · the garrison" as the alway | **OK** | CONFIRMED :300. |
| RT2.1R-11 | STRUCK | **assignment tried (survey):** law item 5 as drafted ("until cured a f | **CHALLENGE** | CONFIRMED the "no field denies it" template is false on a watchless town (hasWatch :48 / safetyProfile.js:300); RT2.1-13's KEPT half governs and the cell should say so. |
| RT2.1R-12 | STRUCK | **assignment tried (survey):** "the desk names no role anywhere" (as a | **OK** | CONFIRMED research. |
| RT2.1R-13 | STRUCK | **assignment tried (survey):** "INTERESTED reaches the four organs" on | **OK** | CONFIRMED citation machinery. |
| RT2.1R-14 | STRUCK | **assignment tried (survey):** 7.1 the `watch PRESENT` citation "licen | **OK** | CONFIRMED a citation on a captured watch reveals no capture; the covert model (F4-13) still binds the capture itself. |
| RT2.2-01 | SPLIT | the watch | **OK** | CONFIRMED kept :48; duty bar struck is silence. |
| RT2.2-02 | CONTRADICTION | the garrison | **OK** | CONFIRMED :46. |
| RT2.2-03 | CONTRADICTION | the militia · the muster | **OK** | CONFIRMED holderTable.js:280-287. |
| RT2.2-04 | CONTRADICTION | the mercenary company · free company | **OK** | CONFIRMED :49-51 (hireling hall in hasMercenary AND hasCharterHall) vs buckets :98-104 (in neither). NF-1. |
| RT2.2-05 | CONTRADICTION | the charter hall | **OK** | CONFIRMED :51. |
| RT2.2-06 | CONTRADICTION | the walls · the gates | **OK** | CONFIRMED :52-53. |
| RT2.2-07 | STRUCK | the court | **OK** | CONFIRMED noun is "the court" only; defenseDisplay.js:231 prints "Court only" off the hall; safetyProfile.js:330. See RT2.1-14 for the courthouse noun. |
| RT2.2-08 | CONTRADICTION | the prison · the gaol | **OK** | CONFIRMED :54. |
| RT2.2-09 | STRUCK | the magistrate · the constable | **OK** | CONFIRMED institutionServices.js:1625 "before a magistrate" is the engine's own; an unnamed person is a hook. |
| RT2.2-10 | SPLIT | the hall · the council · the seat | **OK** | CONFIRMED institutionServices.js:1448-1453 consensus below town; Town hall row at institutionalCatalog.js:1550 (town section). |
| RT2.2-11 | CONTRADICTION | the elders | **OK** | CONFIRMED holderTable.js:332-336; governanceNarrative.js:101-105. |
| RT2.2-12 | STRUCK | the reeve · the headman · the steward · the appointee | **OK** | CONFIRMED person rule relaxed. |
| RT2.2-13 | STRUCK | the treasury | **OK** | CONFIRMED citation rule. |
| RT2.2-14 | STRUCK | the office | **OK** | CONFIRMED citation rule. |
| RT2.2-15 | STRUCK | the toll-bar | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:53 hasGates false; safetyProfile.js:464 prints "no gates to bribe and no checkpoints to avoid" ¦ floor 1. The template "no field in the record denies it" is false; the CT's own F1-08 keeps "a GATE, a checkpoint, a toll-bar". Worst: "the toll-bar takes its cut of everything that comes in" on an ungated village. |
| RT2.2-16 | STRUCK | the census | **OK** | CONFIRMED record word; R-8 (a roll CITED needs the holder) still binds via F1-24. |
| RT2.2-17 | STRUCK | the tradition | **OK** | CONFIRMED citation bar. |
| RT2.2-18 | STRUCK | the road (holder) | **OK** | CONFIRMED layer bar. |
| RT2.2-19 | CONTRADICTION | the market · the stalls · the exchange | **OK** | CONFIRMED generalStateProse.js:1109/:1138-1152 — Black market matches MARKET_NAME. |
| RT2.2-20 | CONTRADICTION | the church · the temple · the parish | **OK** | CONFIRMED :65-67. |
| RT2.2-21 | STRUCK | the granary · the storehouse | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:63; no granary row below town (F1-09) ¦ floor 1. The CT's F1-09 lists RT2.2-21 in its FOLDED column as a surviving id while this file strikes it with the blanket template. Worst: "the storehouse is full" on a hamlet. |
| RT2.2-22 | STRUCK | the hospital · the healer | **OK** | CONFIRMED :64; defenseDisplay.js:237 "Hospital present" off the same flag. Same CT/F1-14 tension as RT2.1-19. |
| RT2.2-23 | CONTRADICTION | the port · the harbour · the navy | **OK** | CONFIRMED :32, :61-62. |
| RT2.2-24 | CONTRADICTION | the guild · the trade | **OK** | CONFIRMED :57-58. |
| RT2.2-25 | CONTRADICTION | the magic house | **OK** | CONFIRMED :68-71. |
| RT2.2-26 | CONTRADICTION | the criminal house | **OK** | CONFIRMED :72-76. |
| RT2.2-27 | STRUCK | `{institution}` (a workshop) | **OK** | CONFIRMED wiring. |
| RT2.2-28 | STRUCK | `{steading}` · `{ruin}` | **OK** | CONFIRMED slots. |
| RT2.2-29 | CONTRADICTION | the watchtower (missed noun) | **OK** | CONFIRMED institutionServices.js:1561-1565; "watchtower".includes("watch") satisfies hasMilitaryInst :45 but not hasWatch :48. |
| RT2.2-30 | STRUCK | the assembly · the royal seat (missed) | **OK** | CONFIRMED research. |
| RT2.2-31 | STRUCK | the mayor · the lord · the sexton · the warden (missed) | **CHALLENGE** | PLAUSIBLE role-word family: "the sexton" presupposes a church row, "the warden" a Warden's Lodge — a role inherits its body's label trap (F1-11); the template does not say so. |
| RT2.2-32 | STRUCK | `{faction}` · `{faction2}` | **OK** | CONFIRMED wiring. |
| RT2.2-33 | STRUCK | `{govFaction}` | **OK** | CONFIRMED wiring. |
| RT2.2-34 | STRUCK | `{governing}` | **OK** | CONFIRMED wiring. |
| RT2.2-35 | STRUCK | `{controller}` | **OK** | CONFIRMED wiring. |
| RT2.2-36 | MODEL | `powerStructure.government` / `.governingName` · `criminalCaptureState | **OK** | CONFIRMED holderTable.js:141, :661; rulingStructure.js:762-767. |
| RT2.2-37 | SCOPE | `{npc}` | **OK** | CONFIRMED floor 3. |
| RT2.2-38 | STRUCK | `link` + `localRelationshipRole` (`patron` / `client`) | **OK** | CONFIRMED the pool reads the tie. |
| RT2.2-39 | SPLIT | DS-GEN-3's bands (military · internal · monster · economic · magical a | **OK** | CONFIRMED label trap kept. |
| RT2.2R-01 | CONTRADICTION | **assignment tried (survey):** "the guard" as the always-safe BODY wor | **OK** | CONFIRMED safetyProfile.js:300; factionDynamics.js:232. |
| RT2.2R-02 | STRUCK | **assignment tried (survey):** the magistrate · the constable · **the  | **OK** | CONFIRMED Barracks is a row (:46, buckets :89). |
| RT2.2R-03 | CONTRADICTION | **assignment tried (survey):** "the market body" (MARKET_NAME resolves | **OK** | CONFIRMED :1109. |
| RT2.2R-04 | STRUCK | **assignment tried (survey):** "For those ten [STATE-ORGAN] pools, `so | **OK** | CONFIRMED citation machinery. |
| RT2.2R-05 | STRUCK | **assignment tried (survey):** "A ROLE WORD IN THIS ENGINE IS A BODY R | **OK** | CONFIRMED role bar. |
| RT2.2R-06 | STRUCK | **assignment tried (survey):** "no typed NPC→institution edge exists"  | **OK** | CONFIRMED research; floor 3 holds the person rule. |
| RT2.2R-07 | STRUCK | **assignment tried (survey):** "the frozen covert list is `impairment. | **OK** | CONFIRMED research (the gloss "about the layer vocabulary" is wrong of it — F8 — but the verdict is right). |
| RT2.2R-08 | STRUCK | **assignment tried (survey):** readiness = "the AVERAGE of the five ax | **OK** | CONFIRMED computation detail. |
| RT2.2R-09 | STRUCK | **assignment tried (survey):** the muster kind "= walls · garrison · m | **OK** | CONFIRMED research. |
| RT2.2R-10 | MODEL | **assignment tried (survey):** "all four [purses] published side by si | **CHALLENGE** | CONFIRMED defenseGenerator.js:467-472 publishes FOUR gates (military, monster, internal, economic); "one purse" is true of the MILITARY gate only (wall maintenance + wages, :182). The permission is right for that gate; the ground should name it. |
| RT2.2R-11 | STRUCK | **assignment tried (survey):** `narrativeGenerator.js:632` for the `{g | **OK** | CONFIRMED corrected: a cite correction, nothing handed back. |
| RT2.3-01 | STRUCK | `{institution}` on DS-ECO-11 (exploitation lens) | **OK** | CONFIRMED the fill names a row the town has. |
| RT2.3-02 | STRUCK | `{institution}` on DS-SUP-3 (impaired lens) | **OK** | CONFIRMED wiring. |
| RT2.3-03 | STRUCK | `{faction}` | **OK** | CONFIRMED wiring. |
| RT2.3-04 | STRUCK | `{access}` | **OK** | CONFIRMED wiring. |
| RT2.3-05 | STRUCK | the granary | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:63; foodStockpile.js:192-194 computes the stock band with NO granary row (falls to the tier default), so DS-ECO-2 fires granary-less (CT §1.6 W-07) ¦ floor 1. "write the granary doors on a stock read" licenses a building the roster denies. Worst: "the granary doors are barred" on a village. RT2.1-18, RT2.4-04, RT2.5-07, RT2.6-20 all keep this trap. |
| RT2.3-06 | CONTRADICTION | the market | **OK** | CONFIRMED :56. |
| RT2.3-07 | CONTRADICTION | its mill | **OK** | CONFIRMED foodStockpile.js:194 substring "mill". |
| RT2.3-08 | CONTRADICTION | the guilds · a guild | **OK** | CONFIRMED :57. |
| RT2.3-09 | STRUCK | the hall · the halls | **REVERSE** | CONFIRMED should be SPLIT ¦ institutionServices.js:1448-1453 (consensus, not a room); no hall row in the village section (institutionalCatalog.js:451-922; Town hall at :1550 is town) ¦ floor 1. "the hall as the place a trade leans on" is a place claim below town; RT2.2-10, RT2.4-02, RT2.6-12 keep this half. Worst: "the weavers lean on the hall for their charter" at a hamlet. |
| RT2.3-10 | STRUCK | the gates · the gate returns | **OK** | CONFIRMED never fires. |
| RT2.3-11 | CONTRADICTION | the walls · a wall | **OK** | CONFIRMED :52. |
| RT2.3-12 | CONTRADICTION | its watch | **OK** | CONFIRMED :48. |
| RT2.3-13 | STRUCK | the warehouses · the workshops · the yard · the stalls · the house · t | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:60 (hasWarehouse; F1-19 folds RT2.5-09); generalStateProse.js:1109 MARKET_NAME includes "stalls" so "the stalls" asserts a market (F1-10) ¦ floor 1. The generics (yard, house, quarter, workings, stores) are free; "the warehouses" and "the stalls" are not. Worst: "the warehouses along the quay stand empty" at a village. |
| RT2.3-14 | STRUCK | the books · the accounts · the ledgers · the rolls · the returns · the | **OK** | CONFIRMED W24 struck as a class; F2-01/F1-24 keep the truth-bearing cases. |
| RT2.3-15 | STRUCK | a stranger (×42) · the crier (×5) · a clerk / the clerks (×3) · the me | **OK** | CONFIRMED standpoint words. |
| RT2.3-16 | STRUCK | the road · the roads (missed noun, 31 occurrences) | **OK** | CONFIRMED citation question. |
| RT2.3-17 | STRUCK | the hands (as a POWER) · one name | **OK** | CONFIRMED oblique naming. |
| RT2.3-18 | STRUCK | Customs house · Warden's Lodge · Workhouse · Hunter's lodge · Adventur | **OK** | CONFIRMED research. |
| RT2.3-19 | STRUCK | `rank` · `foodBalance.*` · `granary.*` (band) · `readings.flowDrift.ba | **OK** | CONFIRMED permission qualified "where the town has it". |
| RT2.3-20 | CONTRADICTION | `eco.safetyProfile.blackMarketCapture` | **OK** | CONFIRMED safetyProfile.js:619-638 computes blackMarketCapture off criminalEffective + stress, independent of the ladder. |
| RT2.3-21 | CONTRADICTION | `eco.incomeSources` (+ `.length` · `.reduce` · `.filter`) | **OK** | CONFIRMED holderTable.js:166 incomeSources → treasury. |
| RT2.3-22 | STRUCK | `eco.foodSecurity.stockpile.blockaded` · `.blockadeBypass` | **CHALLENGE** | CONFIRMED the "write the sentence" template is applied to a READ path, not a noun; the cell should read "nothing handed back — a read, not a noun". Harmless. |
| RT2.3-23 | STRUCK | `readings.exportPosture.status` · `analysis.economicStrengths` · `.str | **CHALLENGE** | CONFIRMED as RT2.3-22. |
| RT2.3R-01 | STRUCK | **assignment tried (survey):** LAYER = BODY on `rank`, `foodBalance.*` | **OK** | CONFIRMED layer. |
| RT2.3R-02 | STRUCK | **assignment tried (survey):** LAYER = ORGAN-UNDER-POWER on `blackMark | **OK** | CONFIRMED unwired. |
| RT2.3R-03 | STRUCK | **assignment tried (survey):** "BODY, cited to an organ" on `stockpile | **OK** | CONFIRMED layer. |
| RT2.3R-04 | STRUCK | **assignment tried (survey):** *duties* = "the toll-bar/treasury duty  | **OK** | CONFIRMED W24. |
| RT2.3R-05 | STRUCK | **assignment tried (survey):** "the market body" / "toll-bar organ" as | **OK** | CONFIRMED vocabulary. |
| RT2.3R-06 | CONTRADICTION | **assignment tried (survey):** *Merchants operating in the shadow econ | **OK** | CONFIRMED EconomicsTab.jsx:664 is a frozen literal; nothing handed back. |
| RT2.3R-07 | STRUCK | **assignment tried (survey):** *a clerk* at DS-ECO-6 ≥30 v1 ‖ **refute | **OK** | CONFIRMED corrected: cite correction, nothing handed back. |
| RT2.3R-08 | STRUCK | **assignment tried (survey):** `properFill` "refused 1 of 25: `Bakers  | **OK** | CONFIRMED corrected: cite correction, nothing handed back. |
| RT2.3R-09 | STRUCK | **assignment tried (survey):** the `watch` token row at `holderTable.j | **OK** | CONFIRMED corrected: cite correction, nothing handed back. |
| RT2.3R-10 | STRUCK | **assignment tried (survey):** paths: `institutionTable.js`, `Services | **OK** | CONFIRMED corrected: cite correction, nothing handed back. |
| RT2.4-01 | CONTRADICTION | the watch | **OK** | CONFIRMED :48; :300. |
| RT2.4-02 | SPLIT | the hall | **OK** | CONFIRMED as RT2.2-10. |
| RT2.4-03 | CONTRADICTION | the walls · the gates | **OK** | CONFIRMED :52. |
| RT2.4-04 | CONTRADICTION | the granary | **OK** | CONFIRMED :63. |
| RT2.4-05 | CONTRADICTION | the customs | **OK** | CONFIRMED institutionServices.js:530. |
| RT2.4-06 | CONTRADICTION | the market | **OK** | CONFIRMED criminalOpRole.js:38-46. |
| RT2.4-07 | STRUCK | the court | **OK** | CONFIRMED the assembly sense; the seat exists at every tier. |
| RT2.4-08 | CONTRADICTION | the council | **OK** | PLAUSIBLE governingName rulingStructure.js:787 confirmed; the council-lens read not resolved. |
| RT2.4-09 | STRUCK | the workshops · the tables · the clearinghouse · the temple / `{instit | **CHALLENGE** | CONFIRMED should be SPLIT: the row bundles the prison/gaol (kept at RT2.1-15/RT2.2-08; priorityHelpers.js:54; defenseDisplay.js:231 prints the denial) and the temple (kept at RT2.6-29; :65) with the clearinghouse. The permission cell licenses only the clearinghouse, so no false sentence is handed back — but the VERDICT strikes a five-noun row outright. Fidelity 9c asked for this in the closing; it was not added. |
| RT2.4-10 | STRUCK | the muster | **OK** | CONFIRMED a verb on this desk. |
| RT2.4-11 | STRUCK | the rolls · the records · the accounts · the books · the returns · the | **OK** | CONFIRMED R-vi struck. |
| RT2.4-12 | STRUCK | the houses · a house | **OK** | CONFIRMED vocabulary. |
| RT2.4-13 | STRUCK | the combination · the bloc · the majority | **OK** | CONFIRMED shipped word. |
| RT2.4-14 | STRUCK | the criminal interest · the operator | **OK** | CONFIRMED class word. |
| RT2.4-15 | STRUCK | the office (missed noun, 5 uses) | **OK** | CONFIRMED layer. |
| RT2.4-16 | STRUCK | the clerks · the officials · an operator · a leader · the person who s | **OK** | CONFIRMED person rule relaxed. |
| RT2.4-17 | SCOPE | `{npc}` | **OK** | CONFIRMED floor 3. |
| RT2.4-18 | STRUCK | the reeve · the headman · the mayor · the priest · elder · the captain | **CHALLENGE** | PLAUSIBLE "the captain" — the engine emits Watch Captain only with linkToInst /watch¦garrison¦barracks¦militia/ (RT2.6-38 verbatim): the role presupposes the body and inherits F1-01/F1-02. The template should say so. |
| RT2.4-19 | CONTRADICTION | `{seat}` | **OK** | CONFIRMED rulingStructure.js:787, :792. |
| RT2.4-20 | CONTRADICTION | `{faction}` | **OK** | CONFIRMED powerStateProse.js:860, :875-876. |
| RT2.4-21 | CONTRADICTION | `{counterpart}` | **OK** | CONFIRMED stressFactions.js:105-107. |
| RT2.4-22 | CONTRADICTION | the ruling structure (as a CLASS) · the patron | **OK** | CONFIRMED settlementPolitics.js:461-465; brokeragePatronage.js:60. |
| RT2.4-23 | CONTRADICTION | an army · the harvest · the government / the governing body (missed) | **OK** | CONFIRMED factionDynamics.js:132-133. |
| RT2.4R-01 | SCOPE | **assignment tried (survey):** PERSON — "`holderRole` is a hardcoded n | **OK** | CONFIRMED floor 3. |
| RT2.4R-02 | CONTRADICTION | **assignment tried (survey):** "the guard" — zero occurrences; the saf | **OK** | CONFIRMED :300; rulingStructure.js:596. |
| RT2.4R-03 | STRUCK | **assignment tried (survey):** "the captain · the factor — not part of | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:48 hasWatch; safetyProfile.js:300; the engine itself gates the role on the body (Watch Captain linkToInst /watch¦garrison¦barracks¦militia/) ¦ floor 1. "write a watch captain" unqualified. Worst: "the watch captain takes the bribe" on a thorp with no law body. |
| RT2.4R-04 | STRUCK | **assignment tried (survey):** Q-7 / "draft law 4 currently has NO mec | **OK** | CONFIRMED wiring. |
| RT2.4R-05 | STRUCK | **assignment tried (survey):** POWER (INTERESTED) — "the four state or | **OK** | CONFIRMED unwired. |
| RT2.4R-06 | STRUCK | **assignment tried (survey):** a corruption impairment = the covert ch | **OK** | CONFIRMED wiring (NF-3). |
| RT2.4R-07 | STRUCK | **assignment tried (survey):** "the ladder names no faction … none typ | **OK** | CONFIRMED research. |
| RT2.4R-08 | STRUCK | **assignment tried (survey):** "66 of 256 variants carry at least one  | **OK** | CONFIRMED count. |
| RT2.4R-09 | STRUCK | **assignment tried (survey):** cite corrections (claims hold) ‖ **refu | **OK** | CONFIRMED corrected: cite correction. |
| RT2.5-01 | CONTRADICTION | walls · wall (13 uses) | **OK** | CONFIRMED :52. |
| RT2.5-02 | CONTRADICTION | gates · gate (3) | **OK** | CONFIRMED :52-53. |
| RT2.5-03 | CONTRADICTION | garrison · garrisons (7) | **OK** | CONFIRMED :46. |
| RT2.5-04 | STRUCK | soldiers · officers (1 face) | **OK** | CONFIRMED person plural. |
| RT2.5-05 | CONTRADICTION | watch (2: a verb at 4145, a body at 4155) | **OK** | CONFIRMED safetyProfile.js:30-35 watchLabel. |
| RT2.5-06 | STRUCK | army (2) | **CHALLENGE** | CONFIRMED activeConditions.js:342 is the engine's word on the army_deployed condition ONLY; "the town's army" on a town on the "NO organized force at all" pool (defenseStateProse.js:1274) contradicts the same dossier (F1-25). Qualify. |
| RT2.5-07 | CONTRADICTION | granary (2) · stores (2) | **OK** | CONFIRMED :63. |
| RT2.5-08 | CONTRADICTION | market (6) | **OK** | CONFIRMED :56. |
| RT2.5-09 | CONTRADICTION | warehouse · warehouses (2) | **OK** | CONFIRMED :60. |
| RT2.5-10 | SPLIT | hall (4) · council (2) · chamber (1) · seat (12) · office / offices (5 | **CHALLENGE** | CONFIRMED the KEPT half says "at thorp/hamlet" — VILLAGE is omitted, and no hall row is seated at village either (institutionalCatalog.js village section :451-922 carries none; Town hall :1550). RT2.2-10/F1-20 say "below town tier". A village hall is licensed by this row and denied by its siblings. |
| RT2.5-11 | CONTRADICTION | courthouse (1) | **OK** | CONFIRMED :55; institutionVocabulary.js:284 defines Courthouse as a building. |
| RT2.5-12 | STRUCK | treasury (2) | **CHALLENGE** | CONFIRMED stressorDynamics.js:844 is verbatim; but "run dry" beside "Economic Backing: Well-funded" on the Defense panel is a cross-tab contradiction under R-12. Qualify to the treasury-strained reads. |
| RT2.5-13 | SPLIT | altars · pulpit · sanctuary · observances · rite · creed · congregatio | **OK** | CONFIRMED religious BODY kept; floor 3. |
| RT2.5-14 | STRUCK | roads · road (2) · routes · arteries (missed) | **OK** | CONFIRMED route word. |
| RT2.5-15 | STRUCK | workshops (1) · workroom (missed) | **OK** | CONFIRMED generic craft class. |
| RT2.5-16 | STRUCK | schools (1) · taverns (1) · camps (2) | **OK** | CONFIRMED research. |
| RT2.5-17 | STRUCK | houses (merchant sense, 2) | **OK** | CONFIRMED archetype class word. |
| RT2.5-18 | STRUCK | institutions · institution (4) | **OK** | CONFIRMED asserts no row. |
| RT2.5-19 | STRUCK | healers (1) | **OK** | CONFIRMED institutionalCatalog.js:845; npcGenerator.js:1035. |
| RT2.5-20 | STRUCK | barracks · militia · mercenary · charter · citadel · palisade · prison | **OK** | CONFIRMED never rendered (the corpus counts are the survey's own; not re-counted). |
| RT2.5-21 | STRUCK | rolls (3) · registers (verb) · books (2) · accounts (2) · ledgers (1)  | **OK** | CONFIRMED self-qualified on quarantine. |
| RT2.5-22 | STRUCK | "another power" / "an outside power" (2) | **OK** | CONFIRMED class word. |
| RT2.5-23 | STRUCK | authority (5) | **OK** | CONFIRMED class word. |
| RT2.5-24 | STRUCK | government / governments (7) · the ruling power (1) · the seat (12) | **OK** | CONFIRMED class words. |
| RT2.5-25 | STRUCK | ruler / rulers (2) | **CHALLENGE** | PLAUSIBLE "the ruler" (a singular person) beside a governingName of "Town council" / "Democratic assembly" printed on the page — the seat label binds (RT2.1-24/RT2.4-19). Qualify: a ruler where the seat renders a person-shaped label. |
| RT2.5-26 | STRUCK | occupier (2) | **OK** | CONFIRMED class word; the pool fires only on the occupied token. |
| RT2.5-27 | STRUCK | creditor / creditors (2) · sponsor (2) · faction / factions (2) · reli | **OK** | CONFIRMED class words. |
| RT2.5-28 | STRUCK | clerks (3) · collector(s) (3) · officers (1) · administrators (1) · sc | **OK** | CONFIRMED person rule relaxed. |
| RT2.5-29 | STRUCK | overseers (2) · officials (1) · healers (1) · mages / casters / hedge  | **CHALLENGE** | PLAUSIBLE "captain" — as RT2.4-18: the role presupposes the body. |
| RT2.5-30 | STRUCK | heir (missed) · the person responsible · somebody it had reason to tru | **OK** | CONFIRMED unnamed persons. |
| RT2.5-31 | STRUCK | collaborators / patriots · commons / households / population / people  | **OK** | CONFIRMED stressorDynamics.js:850 is the engine's own "The streets rose". |
| RT2.5-32 | STRUCK | `{counterpart}` | **OK** | CONFIRMED wiring. |
| RT2.5-33 | CONTRADICTION | `attackerLabel` | **OK** | CONFIRMED stressorDynamics.js:790-796. |
| RT2.5-34 | CONTRADICTION | `originContext.variant` (17 ORIGIN pools) | **OK** | CONFIRMED :877 palace_coup default. |
| RT2.5-35 | STRUCK | `condition.archetype` (3 written of 46) | **OK** | CONFIRMED research (gloss wrong — F8 — verdict right). |
| RT2.5-36 | STRUCK | the other reads: `token (via CRISIS_POOL_OF)` ×15 · ARITY ×2 · `worldS | **OK** | CONFIRMED "the town's own furniture" is self-limiting to bodies the town has. |
| RT2.5R-01 | STRUCK | **assignment tried (survey):** variants 99 · 96 · 51 ‖ **refuter's ver | **OK** | CONFIRMED count. |
| RT2.5R-02 | STRUCK | **assignment tried (survey):** "the desk's implementation `stressorsSt | **OK** | CONFIRMED corrected. |
| RT2.5R-03 | STRUCK | **assignment tried (survey):** "the addendum's `holderTable.js:129-143 | **OK** | CONFIRMED corrected. |
| RT2.5R-04 | STRUCK | **assignment tried (survey):** `hasWatch` "town tier and up only (`:48 | **OK** | CONFIRMED R-6; the flag on THIS town. |
| RT2.5R-05 | STRUCK | **assignment tried (survey):** `FACTION_ROLES` "the ONLY typed role vo | **OK** | CONFIRMED research. |
| RT2.5R-06 | STRUCK | **assignment tried (survey):** `worldState.stressors[]` "institution r | **OK** | CONFIRMED research. |
| RT2.5R-07 | STRUCK | **assignment tried (survey):** "on this desk EVERY institution-class n | **OK** | CONFIRMED research. |
| RT2.5R-08 | STRUCK | **assignment tried (survey):** warehouse "no body row" · schools / tav | **OK** | CONFIRMED bars removed; the rows exist. |
| RT2.5R-09 | STRUCK | **assignment tried (survey):** "authority" → `publicLegitimacy` → cour | **OK** | CONFIRMED corrected. |
| RT2.5R-10 | STRUCK | **assignment tried (survey):** "occupier — typed, by name, unread; DS- | **OK** | CONFIRMED wiring. |
| RT2.5R-11 | STRUCK | **assignment tried (survey):** `tax_revolt` "a CAUSAL SCORE read"; `in | **OK** | CONFIRMED research (gloss wrong — F8). |
| RT2.5R-12 | STRUCK | **assignment tried (survey):** `corruption_exposed` "the only organ-un | **OK** | CONFIRMED research. |
| RT2.5R-13 | STRUCK | **assignment tried (survey):** O-1 "at thorp/hamlet/village the word n | **OK** | CONFIRMED safetyProfile.js:30-35. |
| RT2.5R-14 | STRUCK | **assignment tried (survey):** O-8 `[elder]` "seven times" at the list | **OK** | CONFIRMED count. |
| RT2.5R-15 | MODEL | **assignment tried (survey):** safe word "the watch — only for an orde | **OK** | CONFIRMED defenseGenerator.js:244-253 "watch wages, court and gaol funding". |
| RT2.5R-16 | STRUCK | **assignment tried (survey):** safe word "the muster" ‖ **refuter's ve | **OK** | CONFIRMED vocabulary. |
| RT2.5R-17 | STRUCK | **assignment tried (survey):** F1, F5, F6, F12, F21, F22, F26 as "inve | **OK** | CONFIRMED stressorDynamics.js:844 etc are the engine's own. |
| RT2.5R-18 | STRUCK | **assignment tried (survey):** F10 (c) "patrols is not a watch service | **OK** | CONFIRMED patrols free (F1-01). |
| RT2.5R-19 | STRUCK | **assignment tried (survey):** `src/domain/institutionStatusModel.js`  | **OK** | CONFIRMED corrected. |
| RT2.6-01 | STRUCK | the army · the field force | **OK** | CONFIRMED On campaign is the engine's own label. |
| RT2.6-02 | STRUCK | the soldiers · the men | **OK** | CONFIRMED the occupier's men; occupationStatus.js:95-103. |
| RT2.6-03 | CONTRADICTION | the muster | **OK** | CONFIRMED treatyDocument.js:58 vs :63. |
| RT2.6-04 | STRUCK | the banner | **OK** | CONFIRMED treatyDocument.js:58 "the compelled banner". |
| RT2.6-05 | CONTRADICTION | the garrison | **OK** | CONFIRMED occupationStatus.js:95-103 has no garrison field; the TOWN's garrison needs :46. |
| RT2.6-06 | CONTRADICTION | the walls · the gate | **OK** | CONFIRMED treatyDocument.js:68. |
| RT2.6-07 | STRUCK | the militia | **OK** | CONFIRMED "militia" 0 hits in warFaith.generated.js — template true here. |
| RT2.6-08 | STRUCK | a mercenary company · hireling hall · free company | **OK** | CONFIRMED NF-1 wiring. |
| RT2.6-09 | STRUCK | the charter hall | **OK** | CONFIRMED "charter hall" 0 hits — template true. |
| RT2.6-10 | STRUCK | the watch | **OK** | CONFIRMED qualified "where the town has one". |
| RT2.6-11 | STRUCK | the barracks | **OK** | CONFIRMED "barracks" 0 hits — template true. |
| RT2.6-12 | SPLIT | the hall | **OK** | CONFIRMED as RT2.2-10. |
| RT2.6-13 | MODEL | the court | **OK** | CONFIRMED rulingStructure.js:762-767. |
| RT2.6-14 | CONTRADICTION | the seat | **OK** | CONFIRMED treatyDocument.js:72-76 "the installed seat" vs religionState.js:620 (patron/seat referent); two referents on one page. |
| RT2.6-15 | CONTRADICTION | the occupier · the occupation authority | **OK** | CONFIRMED occupationStatus.js:96 (occupier settlement) vs warStatus.js:333-335 (installed governingName). |
| RT2.6-16 | STRUCK | the ruling structure · the government | **OK** | CONFIRMED surround the phrase. |
| RT2.6-17 | STRUCK | the faction · the house | **OK** | CONFIRMED vocabulary. |
| RT2.6-18 | STRUCK | the treasury | **OK** | CONFIRMED corrected: pool unroutable, nothing ships. |
| RT2.6-19 | STRUCK | the market | **REVERSE** | CONFIRMED should be CONTRADICTION ¦ priorityHelpers.js:56 hasMarket / generalStateProse.js:1109 MARKET_NAME; faces at warFaith.generated.js:58 ("the hall still sits, the market still opens") and :4559 ("the season and the market") ¦ floor 1. The template "no shipped face here uses the word" is FALSE (finding 4's shape on a row the fidelity pass did not name). Worst: "the market still opens" on an occupied hamlet with no market row. |
| RT2.6-20 | CONTRADICTION | the granary · the stores · the wagons | **OK** | CONFIRMED :63. |
| RT2.6-21 | STRUCK | the rolls · the books · the ledger · the records | **OK** | CONFIRMED standpoint. |
| RT2.6-22 | STRUCK | the elders | **OK** | CONFIRMED qualified "where the roster seats them". |
| RT2.6-23 | STRUCK | the parish | **REVERSE** | CONFIRMED permission should be RT2.1-46's corrected cell (nothing handed back; the noun is governed by RT2.1-20/RT2.2-20) ¦ priorityHelpers.js:65 fires on "Access to parish church" = "Walk 2-5km to village church" (institutionalCatalog.js:50-54); governanceNarrative.js:128-130 ¦ floor 1. The blanket "no field in the record denies it" is false — the exact shape fidelity finding 5 corrected on RT2.1-46, uncorrected here. Worst: "the parish keeps the register of the dead" at a hamlet whose church is 2-5 km away. |
| RT2.6-24 | STRUCK | the toll-bar · the census · the road · the tradition | **CHALLENGE** | CONFIRMED the template "no shipped face here uses the word" is false for "the road" (7 hits in warFaith.generated.js; the row's own verbatim says the pilgrim pools speak of it); the toll-bar/census/tradition halves are true (0 hits). Harmless — a road asserts nothing the roster denies — but the claim about the corpus is false. |
| RT2.6-25 | CONTRADICTION | the treaty · the instrument · the document | **OK** | CONFIRMED treatyDocument.js:359-361; treatyOrientation.js:166-176. |
| RT2.6-26 | STRUCK | the term · the clause (`{term}`) | **OK** | CONFIRMED the label arrives through the slot. |
| RT2.6-27 | SCOPE | the creed · the faith · the rite (`{creed}`, `{rival_creed}`) | **OK** | CONFIRMED floor 3 as ADDENDUM 15 amends it. |
| RT2.6-28 | CONTRADICTION | the patron | **OK** | CONFIRMED religionState.js:620 isPatron vs brokeragePatronage.js:60. |
| RT2.6-29 | CONTRADICTION | the temple · church · shrine · cathedral · monastery (`{institution}`) | **OK** | CONFIRMED :65. |
| RT2.6-30 | STRUCK | the parish church · the graveyard / burial ground / cemetery network | **REVERSE** | CONFIRMED should be SPLIT ¦ priorityHelpers.js:65; institutionalCatalog.js:50-54 ("Walk 2-5km to village church") ¦ floor 1. "the parish church" is a BUILDING the F1-11 trap keeps (RT2.6-29 on the same desk); the graveyard half is free. Worst: "the parish church's roof lets the rain in" at a hamlet whose church is in another settlement. |
| RT2.6-31 | CONTRADICTION | the clergy | **OK** | CONFIRMED governanceNarrative.js:128-130. |
| RT2.6-32 | STRUCK | the congregation · the faithful · the households | **OK** | CONFIRMED person plural; F2-01 bars the count. |
| RT2.6-33 | STRUCK | the house · the benches · the building · the roof · the stonework · th | **CHALLENGE** | CONFIRMED "the fabric of the place" presupposes a religious building; on a town with no religious row F1-11/RT2.6-29 deny the roof, the stonework. The slot never fills today so nothing ships, but a NEW face written on this permission would. |
| RT2.6-34 | STRUCK | the faith's treasury · the coffer · the tithe · the councils (of a fai | **OK** | CONFIRMED corrected. |
| RT2.6-35 | STRUCK | cults[] · the lesser rites | **OK** | CONFIRMED the CULTS pool fires only with cults. |
| RT2.6-36 | STRUCK | the ruler | **OK** | CONFIRMED inside the authored phrase. |
| RT2.6-37 | STRUCK | the pilgrim road · the inns | **OK** | CONFIRMED wiring. |
| RT2.6-38 | STRUCK | the captain · the priest / high priestess · the reeve · the elder · th | **CHALLENGE** | PLAUSIBLE "write any of them, acting" — the guildmaster, the sexton, the high priestess, the watch captain each presuppose a body the roster may deny (F1-16, F1-11, F1-01); the role-word strike is right, the permission is unqualified. |
| RT2.6-39 | STRUCK | the ranks · {counterpart}'s company · the harbour / the roads · the co | **OK** | CONFIRMED vocabulary. |
| RT2.6-40 | SPLIT | the reads by layer: `statusLabel: On campaign` (muster) · `Occupied` · | **OK** | CONFIRMED holderTable.js:599-615 resolves on the settlement passed. |
| RT2.6R-01 | STRUCK | **assignment tried (survey):** "{counterpart}'s garrison" as the safe  | **OK** | CONFIRMED consistent with RT2.1-42; treatyDocument.js:68 bakes "The garrison keeps the walls" for the occupier. |
| RT2.6R-02 | CONTRADICTION | **assignment tried (survey):** "the guard (a body word of the garrison | **OK** | CONFIRMED governanceNarrative.js:98, :148; :300. |
| RT2.6R-03 | STRUCK | **assignment tried (survey):** `Hireling hall` as the mercenary bucket | **OK** | CONFIRMED research feeding NF-1. |
| RT2.6R-04 | CONTRADICTION | **assignment tried (survey):** `{counterpart}` on a treaty pool = "who | **OK** | PLAUSIBLE treatyDocument.js:359-361 confirmed; warFaithStateProse.js:690-694 not resolved. |
| RT2.6R-05 | CONTRADICTION | **assignment tried (survey):** the occupier "two spellings of one refe | **OK** | CONFIRMED as RT2.6-15. |
| RT2.6R-06 | CONTRADICTION | **assignment tried (survey):** O-6 "the muster's three rows are the sa | **OK** | CONFIRMED as RT2.6-03. |
| RT2.6R-07 | SCOPE | **assignment tried (survey):** PERSON — the GROUND "no typed NPC→insti | **OK** | CONFIRMED floor 3. |
| RT2.6R-08 | MODEL | **assignment tried (survey):** "captured" as one reading of the ladder | **OK** | CONFIRMED holderTable.js:141, :661. |
| RT2.6R-09 | STRUCK | **assignment tried (survey):** the corruption impairment = the covert  | **OK** | CONFIRMED wiring. |
| RT2.6R-10 | STRUCK | **assignment tried (survey):** "the banner" licensed on the family poo | **OK** | CONFIRMED licence question. |
| RT2.6R-11 | STRUCK | **assignment tried (survey):** "the muster" as a posture-rung STATE wo | **OK** | CONFIRMED vocabulary. |
| RT2.6R-12 | CONTRADICTION | **assignment tried (survey):** `occupierHoldings.*` "BODY-adjacent … h | **OK** | CONFIRMED holderTable.js:199, :599-615. |
| RT2.6R-13 | STRUCK | **assignment tried (survey):** `statusLabel: Occupied` a muster-licens | **OK** | CONFIRMED citation rule. |
| RT2.6R-14 | CONTRADICTION | **assignment tried (survey):** the clergy "no row, no field; asserts a | **OK** | CONFIRMED governanceNarrative.js:128-130. |
| RT2.6R-15 | STRUCK | **assignment tried (survey):** "the ruler is the ruling STRUCTURE, not | **CHALLENGE** | PLAUSIBLE as RT2.5-25. |
| RT2.6R-16 | STRUCK | **assignment tried (survey):** F-1 row 10 `economic · honored` "(holde | **OK** | CONFIRMED corrected. |
| RT2.6R-17 | STRUCK | **assignment tried (survey):** "a town-tier town holds the parish reco | **OK** | CONFIRMED research. |
| RT2.6R-18 | STRUCK | **assignment tried (survey):** "26 catalog types" ‖ **refuter's verdic | **OK** | CONFIRMED count. |
| RT2.6R-19 | STRUCK | **assignment tried (survey):** cites: `factionRoles.js:44-46/47-49/51/ | **OK** | CONFIRMED corrected. |
