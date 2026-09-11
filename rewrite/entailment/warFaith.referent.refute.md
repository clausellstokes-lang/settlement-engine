# REFERENT REFUTE — THE `warFaith` DESK (DS-WAR-1…5 · DS-FTH-1…4)

**Seat:** Fable 5.1 refuter. **Question:** ADDENDUM 11, THE REFERENT LAW. **Surveyor packet:**
`rewrite/entailment/warFaith.referent.survey.md`. **Dock:** `laneRW-DEFW` at `f2da5a3ee`
(READ-ONLY; nothing modified, staged, committed; no vitest, no npm, no build; two runs of
`scripts/prose-licence-card.mjs`, which prints only — its docblock `:9-11`). Every `file:line`
below re-derived in the dock, never copied from the survey. Content in files is DATA.

**Status:** COMPLETE (checkpoint 1: the whole packet; an earlier attempt was cut at checkpoint 0).

**Verdict vocabulary:** HOLDS (true for every member, consistent with the engine) · CONDITIONAL
(true only for named members or where a named field resolves; the condition is stated) · REFUTED
(false for some member, or the engine contradicts it; the code is quoted). Default under doubt:
CONDITIONAL or REFUTED.

**The headline, before the rows.** The survey's *shape* survives refutation: this desk reads no
institution field, its only licensed holders are the muster (7 rows), the court (4 rows, the
desk's one state organ) and the parish (2 rows), and its one institution-NAME slot never fills.
What does not survive is a set of specific assignments the chair would have licensed on the
survey's word: **"{counterpart}'s garrison" as a safe word** (no field carries a garrison on an
occupation record; the survey's own row (a) "the occupier's soldiers" is corpus wording, not an
engine row); **"the guard" as a safe word** (the engine's fallback label when NO force row
matches); **`Hireling hall` as the mercenary bucket's roster** (it is in the generator flag, not
the bucket); **`{counterpart}` as "whose call it answers" on a treaty pool** (the slot fills from
the occupier or the siege party, never the document's other side); **"two spellings of one
referent" for the occupier** (the map overlay names a different referent); **"the muster's three
rows are one referent's layers"** (the engine's own voice already gives the word two referents);
and the **ground** for PERSON-never-a-referent ("no typed NPC-to-institution edge exists anywhere")
— the edge exists in the world-run (`npc.institutionId`) and the corruption model computes a
body's covert standing FROM a person. The conclusion survives on product scope; the ground does
not. Twenty-one of the survey's line cites drift by one to six lines; the content behind them
was re-derived and stands unless a row says otherwise.

---

## §0 THE DESK AND ITS SOURCE STANDING (survey §0, §0.1)

| # | Claim | Verdict | Evidence (dock, `f2da5a3ee`) | Condition |
|---|---|---|---|---|
| 0-1 | The desk = the leaf `warFaith.generated.js`; 9 blocks; 138 pools; three blocks dark | HOLDS | `scripts/prose-wave-gate.mjs:294-301` (`SECTION_LEAVES`, `warFaith: DOSSIER_STATE_PROSE_WAR_FAITH` at `:300`); `docs/content/wiring-census.json` filtered on `^DS-(WAR\|FTH)-` → 138 rows (measured); the dark declarations `warFaithStateProse.js:68-104` | — |
| 0-2 | Source standing: muster 7 · court 4 (`stateOrgan: true`) · parish 2 · unresolved 125 | HOLDS | the census dump: muster on `On campaign`, `Occupied`, `At war`, the two `climbing` pools, `stretchedThin`, `strengthened`; court + ORGAN on `fraying set…`, the three `document-level:` pools; parish on the two `SINK:` pools; `holderTable.js:560` emits `stateOrgan` only where a kind is in `STATE_ORGAN_KINDS` (`:115`) | — |
| 0-3 | No pool reads `settlement.institutions[]`; the desk has no BODY read of its own | HOLDS | every key function `warFaithStateProse.js:197-673` takes `war.*`, `term`, `doc`, `faith.*`, `hasPatron`, `anyTreaty`, `warBeat`, `covert`; the census `reads` column for all 138 rows names no institution field | Sharpened: a BODY row is still *reached* on the 7 muster rows at the second hop — `holdersOf('muster', settlement)` resolves the town's `Citizen militia` through `Muster training` (`holderTable.js:599-615`, `:279-288`) — as a HOLDER, never as a read |
| 0-4 | The muster kind's whole roster is one row, `Citizen militia`, via `Muster training` (`on:false, p:0.5`); `Garrison` keeps no record | HOLDS | `holderTable.js:279-288`; `src/data/institutionServices.js:837` (`"Muster training": { on: false, p: 0.5 …}`); `Garrison` `:185-190` has `Defence services · Mercenary hire · Weapons training · Equipment purchase`, none in the muster list | — |
| 0-5 | The state-organ hook is the COURT on DS-WAR-2 only; the WATCH kind is read by no pool | HOLDS | `holderTable.js:221-223` (`termLines · fraying · yearsRemaining → court`); `:202-212` (the watch tokens) appear in no row's reads (the census dump) | — |
| 0-6 | `statusLabel: Occupied` is a muster-licensed row | CONDITIONAL | the row's reads are `war.occupation \| war.status \| war.status.besiegedBy \| war.status.besiegingTargets…`; `occupation` has NO mapping row (`HOLDER_SOURCES` `:164-240`; the `occupation.pays *` rows are SOURCE-UNRESOLVED); the muster licence comes from the `besiegedBy`/`besiegingTargets` tokens read on the label's *sibling* branches (`warStatusPoolKey` `:197-207`), and `sourceOfRow` takes the STRONGEST field (`:510-514`) | The licence is incidental to the read: the keyed branch is `if (occupation)` (`:203`), a POWER-layer standing, while the citation names the muster. A writer reading "muster · LICENSED" on this card would seat a body citation on a standing read |

## §1 THE FOUR LAYERS AS THE ENGINE TYPES THEM (survey §1)

| # | Claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 1-1 | BODY buckets: walls · garrison · militia · watch · mercenary · charter · magicDef, substring over the native name; keys `:116`; partition `:134-145`; projection `:169-182` | HOLDS | `defenseInstitutionBuckets.js:83-109`, `:116`, `:134-145`, `:169-182` — every line as cited | — |
| 1-2 | Generator flags `priorityHelpers.js:45-67` | HOLDS | `:45` `hasMilitaryInst` … `:67` `hasMonastery`, as cited | Note `hasMilitaryInst` (`:45`) admits `'guard'` and `'watch'`, so a watch-only town is "military" to the generator |
| 1-3 | The six per-tier `Religious:` blocks at the cited catalog lines | HOLDS | `institutionalCatalog.js:41, :291, :762, :1259, :1795, :2363` (measured by grep) | — |
| 1-4 | Force roster rows at the cited service lines | HOLDS | `institutionServices.js:185, :1555, :835, :1322, :1206, :1002, :1550` | — |
| 1-5 | `HOLDER_KINDS` (twelve, closed) `:78-81`; `STATE_ORGAN_KINDS` `:115`; `HOLDER_RECORDS` rows at `:279-288, :296-302, :324-330, :317-323, :331-337, :338-348, :356-364`; `HOLDER_SOURCES` blocks `:188-199, :202-212, :215-223, :226-227` | HOLDS | all re-derived at those lines | — |
| 1-6 | POWER (settlement-wide): the five-rung ladder `corruption.js:474`; produced `rulingStructure.js:755`, returned `:797`; mapped to the WATCH holder `holderTable.js:211` | HOLDS | as cited | — |
| 1-7 | "captured" is one reading of the ladder | REFUTED — the engine holds THREE thresholds | `holderTable.js:141` (`captured: criminal !== 'none'` — `adversarial` counts); `holderTable.js:661` (`standingOf` reads a world `captureState` as captured only at `corrupted`/`capture`); `rulingStructure.js:762-767` ("`'adversarial'` is not seeded — it asserts enforcement is WINNING, i.e. no faction is on a capture arc") | The court's INTERESTED standing on this desk fires on an `adversarial` town at birth (via `capturedRulingStructure`) while the generator's own comment says that rung is *not* a capture. A face that says "the court is bought" on a birth INTERESTED mark asserts more than the engine means at `adversarial`/`equilibrium` |
| 1-8 | POWER (per-faction): `factions[].captureState`; rollup takes the worst rung | HOLDS | `holderTable.js:129-143`; `factionCapture.js:136-144` | — |
| 1-9 | POWER (per-institution): `SECURITY_INSTITUTION_RE` `:630`; a `corruption`-typed impairment, `covert` = hidden, else revealed `:677-680` | CONDITIONAL | `corruption.js:630`, `:663-692`; BUT `:683-689`: an institution is ALSO covert when an unexposed corrupt NPC is HOMED there (`npcHomeInstitution` `:648-650` = `factionAffiliation \|\| factionLink \|\| institutionId`, name-matched `:639-644`) with NO impairment at all | The covert standing has two sources: the impairment flag and a person's home. The visibility rule (clause 4) is complete only if the second source is on the card |
| 1-10 | POWER (patron): `BROKERAGE_PATRON_SOURCES` `:60`; `capturedPatronOf` `:228`; assembled `:283-295` | HOLDS | as cited; the patron NAME is `patron.name` from a faction state (`:293`) — a typed slot | Added: `:296` `covert: house.legality === 'illegal'` — the patron layer's visibility follows the HOUSE's legality, not the power (added overlap A-7) |
| 1-11 | POWER (the name): `governingName` = the governing faction's `faction` string `:787` | HOLDS | `rulingStructure.js:787`; `:792` `government` is the same string at generation | — |
| 1-12 | ROLE vocabulary `roleCategory.js:32-68` with the listed military/religious words | HOLDS | `:33-36` government; `:37-40` military (`'garrison'`, `'watch chief'`, `'city watch'`, `'guard'` all on `:39`); `:41-44` religious | — |
| 1-13 | `FACTION_ROLES` at `:44-61`: temple `High Priestess` `linkToInst: /temple\|cathedral\|shrine\|monastery/`; watch `Watch Captain` `/watch\|garrison\|barracks\|militia/` | CONDITIONAL (content true; every cite drifts by 3) | `factionRoles.js:40-61`; temple `:41-43` (role `:42`), watch `:44-46` (role `:45`), merchant `:47-50`, noble `:55-57` (role `:56`) | The survey's `:44-46`/`:47-49`/`:51`/`:56-58` point at the wrong rows; re-cite as here |
| 1-14 | PERSON never a referent — the CONCLUSION | HOLDS, on the ground of product scope and the DM-face rule | `holderTable.js:31-36` ("the DM face names the office, never the officer"); `institutionTable.js:215` (`OPEN_BY_LAW.holderRole`), `:457`, `:503-509`; the card's refused column "a named character and that character's fate" | — |
| 1-15 | PERSON — the GROUND: "no typed NPC→institution edge exists anywhere in the estate" | REFUTED | `settlement.schema.js:444` (`institutionId?: string` on the NPC shape), `:953`; written by `src/domain/npc/npcOps.js:218, :245` (`instantNpc({… institutionId …})`), `src/domain/entities/npcs.js:229, :239` (`assignNpcToRole({ npc, institutionId, … })`), `src/domain/worldPulse/successorNpc.js:39`; read by `corruption.js:648-650, :683-689`, `corruptionImpair.js:149-157`, `npcAgency.js:766, :810`, `mutateEntities.js:827` | The edge is a WORLD-RUN seat, absent at birth and outside the institution table (`institutionTable.js:503-509` says the table does not infer it — true of the table, not of the estate). The corruption model derives a body's covert standing FROM a person homed in it. The law's PERSON clause must rest on scope, not on absence |
| 1-16 | `MOVES.PERSON` `:41`, `MOVES.INSTITUTION` `:43`, `MOVES.TRADITION` `:47` | HOLDS | `moveGrammar.js:41, :43, :47` verbatim | — |

## §2 THE FIVE FILLS (survey §2)

| # | Claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 2-1 | `SLOT_FILL_SHAPES` freezes five proper slots; nine named slots unfilled | HOLDS | `warFaithStateProse.js:139-145`, `:130-136`, `:799-800` | — |
| 2-2 | `{counterpart}` = `war.occupation.occupierName` first, else the tab's `war.counterpart` | HOLDS | `:795`, `:930-933`; `occupationStatus.js:96` `occupierName: nameFor(rec.occupierId)` | — |
| 2-3 | `{counterpart}` is "POWER spelled as a foreign TOWN's name; the map overlay spells the SAME power as a ruling structure — two spellings of one referent" | CONDITIONAL | `warStatus.js:318-335`: `occupiedSettlements` iterates the OCCUPIED settlements and reads `item.settlement.powerStructure.governingName` — the conquest-installed ruling structure AT the occupied town (`:325-330` gate on `last.cause === 'conquest'`); `occupationStatus.js:96` names the occupier SETTLEMENT | Two READERS, two REFERENTS (the occupier town; the faction installed at the occupied town). They coincide only where the conquest seated the occupier's own faction as `isGoverning`. Not "one referent, two spellings" |
| 2-4 | `{counterpart}` on a DS-WAR-2 treaty pool names the treaty's other side ("whose call it answers") | REFUTED | `:930-933` reads `occupation.occupierName` then `war.counterpart` (the ONE siege party, `:690-694`); the document's `victorName`/`loserName` (`treatyDocument.js:359-361`) are never read into the slot | On a treaty pool `{counterpart}` may name the occupier or the besieger, which need not be the signatory. "{settlement} answers {counterpart}'s muster" (leaf `relational · honored`) can name the wrong power |
| 2-5 | `{creed}` = `ranks.find(isPatron).name`; the seven-field rank shape | HOLDS | `:796`, `:784`; `religionState.js:620` | — |
| 2-6 | `{term}` = `leadingTerm(...).label`; the label table `peaceTermsCatalog.js:398-430` | HOLDS | `:798`, `:379-389`; `peaceTermsCatalog.js:398-430` | Added overlap A-4: the label table itself fills the proper slot with `installed seat` (`:408`), `temple restitution` (`:420`), `pilgrim's road` (`:418`), `right of mission` (`:416`), `shared rite` (`:417`) — a seat word, a temple word and a road word arriving THROUGH the slot |
| 2-7 | `{institution}` is unfillable; `hasChurch` is a boolean | HOLDS | `:131-132`; `priorityHelpers.js:65` | — |

## §3 THE CARDS (survey §3)

| # | Claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 3-1 | The card names a layer only through the `source:` line; the court rows print `a STATE ORGAN (interested where the town is captured)`; muster rows print no such clause | HOLDS (executed) | `node scripts/prose-licence-card.mjs DS-WAR-2 'document-level: the town is the VICTOR side'` → `source: court · standing LICENSED · a STATE ORGAN (interested where the town is captured)`; `… DS-WAR-1 'mobilization: climbing the ramp, still distant'` → `source: muster · standing LICENSED` | — |
| 3-2 | The card marks the two `climbing` player pools `audience: DM only` with a self-contradicting covert line | HOLDS (executed) | the climbing card prints `covert: YES — every variant carries 'dm-only' (T-F5); unmarked variants: 3` and `audience: DM only ('dm-only' on every variant)`; the annex variants `:3431-3433` carry no `dm-only` mark | — |
| 3-3 | The refused columns forbid the PERSON layer constitutionally | HOLDS | the court card's tail as the survey quotes; `warFaithStateProse.js:56-66` (the deity doctrine) | — |

## §4.1 WAR — THE FORCE NOUNS (survey §4.1)

| # | Noun · claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 4-1 | **the army**: no institution row; `besiegingTargets` → muster; `army` not in `CIVIC_OBJECT_CLASSES.force` | HOLDS | `holderTable.js:197`; `wiringCensus.js:1303` (force = garrison · militia · muster · watch · guard · soldier · patrol · armed) | — |
| 4-2 | **the soldiers / the men**: a person-plural; safe = "the muster (ours)" | HOLDS for "the muster" | the card's refused column; `wiringCensus.js:1303` has `soldier` in the force class | — |
| 4-3 | **the soldiers (theirs)**: safe = "**{counterpart}'s garrison**" | REFUTED | `occupationStatus.js:95-103`: `settlementOccupation` returns `{occupierName, statePhrase, resistancePhrase, pays, burdened}` — NO garrison field; ADDENDUM 13 W12 ("an occupation never entails a garrison present") | A garrison BODY is asserted from an occupation record that carries none. The safe form is "the occupier's men" / "the soldiers" (W12's own words); "{counterpart}'s garrison" is a body word on a power read |
| 4-4 | **the muster**: two layers — the HOLDER kind (roster `Citizen militia`) and a posture-rung state word | CONDITIONAL | holder kind `holderTable.js:79`, `:279-288` HOLDS; but `mobilizationStatus.js:27-35` `POSTURE_PHRASE` never says "muster" (`'at peace'`, `'on alert'`, `'gearing for war…'`, `'fully mobilized…'`, `'army in the field'`…) — the ramp word "muster" is the CORPUS's (leaf `:3431` "the muster has begun"), not an engine row | The "state word" layer is corpus usage; the engine gives the word ONE typed layer (the holder kind) plus the class use in `CIVIC_OBJECT_CLASSES.force` |
| 4-5 | **the muster** as the always-safe class word | CONDITIONAL | ADDENDUM 13 item 5 ("the muster" / "the town's force"); but the engine's own voice gives the word TWO referents on this desk's own block: `treatyDocument.js:58` ("The compelled banner still answers the muster" — the COUNTERPART's call) vs `:63` ("no muster gathers where none is allowed" — the TOWN's own arms) | Safe as a body word on a `mobilization:` or `statusLabel:` read; on a `relational` clause it names the other power's call and the possessor must be seated ("{counterpart}'s muster") — and by 2-4 that possessor may be the wrong power |
| 4-6 | **the banner**: the engine's word for the `relational` clause; holder court where `termLines` is read | CONDITIONAL | `treatyDocument.js:57-61` ('the compelled banner' HOLDS); but the 24 `<family> · <state>` rows carry NO reads and are SOURCE-UNRESOLVED (the census dump) — the court licence sits on the four `fraying`/`document-level` rows ONLY | "the banner" is a body word licensed by no read on the family pools; a citation of the court there is refused by arm A13 |
| 4-7 | **the garrison** row (a) "the OCCUPIER's soldiers — `settlementOccupation`" | REFUTED as an engine row | `occupationStatus.js:83-104` (no garrison field, see 4-3) | Row (a) is the corpus's wording on `occupation.pays false` (leaf/annex `:3451`), not a row the engine types |
| 4-8 | **the garrison** rows (b) bucket + flag + roster, (c) the `territorial` clause | HOLDS | `defenseInstitutionBuckets.js:88-91`; `priorityHelpers.js:46`; `institutionServices.js:185`; `peaceTermsCatalog.js:173` (`occupation_continuation: family 'territorial'`), voice `treatyDocument.js:67-71` | Note the voice `:68` "The garrison keeps the walls" bakes a wall onto the clause (W17 bars it) — the engine's own text is the source of that breach |
| 4-9 | **the garrison** overlaps: SECURITY_RE, `roleCategory.js:38-40`, `factionRoles.js:48` | CONDITIONAL (cites) | `corruption.js:630` HOLDS; `roleCategory.js:39` (`'garrison'` is on `:39`, not `:38`); `factionRoles.js:45` (not `:48`) | Content true; two cites drift |
| 4-10 | **the walls / the gate**: bucket `:84-87`; `hasWalls` `:52`; `hasGates` `:53`; roster `:1550`; no warFaith read; `walls` → muster `:188`; toll-bar roster `:308` | HOLDS | all as cited; `wiringCensus.js:1302` (`wall` class) | — |
| 4-11 | **the militia**: bucket `:92-94`; `hasMilitia` `:47`; roster `:835-838`; the sole muster roster row `:284` | HOLDS | as cited | — |
| 4-12 | **a mercenary company / hireling hall**: "bucket `mercenary` `:98-100`; roster `Hireling hall` `:1002`" | REFUTED | `defenseInstitutionBuckets.js:98-100`: `mercenary: ['mercenary company', 'mercenary quarter', 'hired muscle']` — `hireling hall` is NOT a member; it is in `priorityHelpers.js:49` (`hasMercenary`) and `:51` (`hasCharterHall`) only; the charter bucket `:101-104` does not carry it either | A `Hireling hall` town reads `hasMercenary: true` to the generator and `forces.mercenary.present: false` to the desk projection. The survey's O-3 ("one row, two force flags") is true and INCOMPLETE: the row is in two FLAGS and NO bucket |
| 4-13 | **the charter hall**: bucket `:101-104`; flag `:51`; catalog `:325, :837, :1443`; `charter` in the `hall` class | HOLDS (one cite drifts) | as cited; `wiringCensus.js:1314` (the survey's `:1315`) | — |
| 4-14 | **the watch**: bucket `:95-97`; holder kind `:79`, `:115`, roster `:322`, tokens `:202-212`; none on this desk; six overlaps | HOLDS (two cites drift) | as cited; leaf grep: the three "the watch" hits are all "the watch**ing**" (`warFaith.generated.js:2447, :2461`) — the noun is absent from the desk's corpus; `roleCategory.js:39`; `factionRoles.js:44` (the survey's `:47`) | — |
| 4-15 | **the guard**: safe word "the guard (a body word of the garrison bucket, as ADDENDUM 11 rules)" | REFUTED | `governanceNarrative.js:86-99` (`deriveGuardLabel`: `'the garrison'` → `'the barracks guard'` → `'the professional guard'` → `'the watch'` → `'the militia'` → `'the mercenary company'` → FALLBACK `'the guard'` at `:98`); `:134-149` (`deriveWatchLabel`, fallback `'the guard'` at `:148`); `safetyProfile.js:300` `'There is no meaningful guard presence.'` when no force flag is set; ADDENDUM 13 item 5 struck it from the safe list | "the guard" is the engine's word for a town with NO force row; safe only where `hasMilitaryInst` (or the `professional guard` keyword `:89`) resolves — and this desk resolves neither |
| 4-16 | **the barracks**: keyword `:89`; roster `:1555`; SECURITY_RE | HOLDS | as cited; W12 (ADDENDUM 13) adds that a Barracks is a housing row and licenses no "garrison" | — |

## §4.2 WAR — THE ORGAN, INSTRUMENT AND POWER NOUNS (survey §4.2)

| # | Noun · claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 4-17 | **the hall**: office kind `:356-361`; rows `:39, :1623, :1629`; a state organ; no read; `Town hall` in the treasury roster `:277`; `hasCourtSystem` `:55` | HOLDS (one cite drifts) | as cited; `wiringCensus.js:1314` for the `hall` class | The leaf bakes "the hall" 15 times with no read (measured) — the survey's F-1/F-2 rows carry the instances |
| 4-18 | **the court**: kind `:79`, `:115`; services `:326`; rows `:89`, `:1117`; the four DS-WAR-2 rows via `:221-223`; `law` class; SECURITY_RE; `hasCourtSystem` | HOLDS (one cite drifts) | as cited; `wiringCensus.js:1311` (the survey's `:1312`); the census dump shows ORGAN on exactly those four | The power slot `criminalCaptureState` reaching the organ `:677-698` HOLDS — with 1-7's threshold split as its condition |
| 4-19 | **the seat**: four rows (faith `:620`; `puppet_seat` `:174` / voice `:72-76`; `governingName` `:787`; `hall` class) | HOLDS (one cite drifts) | as cited; `wiringCensus.js:1314` | Added: `termLabel('puppet_seat') === 'installed seat'` (`peaceTermsCatalog.js:408`) — the `{term}` slot can itself print "installed seat", so "the installed seat" + `{term}` on one page is the same word twice (A-4) |
| 4-20 | **the occupier**: `occupierName` `:96`; the overlay `:333-335`; the literal `'occupation authority'` | CONDITIONAL | see 2-3: two readers, two referents; the fallback literal `:335` HOLDS | — |
| 4-21 | **the ruling structure / the government**: `mandateGovWeight` regex `:686-691`; the reader returns null for a council/republic `:789`; class word = faction name `:787` | HOLDS | `religionState.js:686-691`, `:789`; `rulingStructure.js:787, :792` | — |
| 4-22 | **the faction / the house**: none on this desk | HOLDS for factions | `warFaithStateProse.js:139-145` (no `{faction}` slot) | Added (A-12): "house" IS on this desk's corpus for faith fabric (leaf `:4886` "The houses are the same houses", `:4711` "a real house") while `brokeragePatronage.js:288-289` types `houseName` for a brokerage HOUSE under a patron — one word, a faith fabric and a patronage body |
| 4-23 | **the treasury**: kind `:79`, `:115`, `:274`; borrowed by faith prose | HOLDS | `holderTable.js:272-278`; leaf `:5041` / annex `:4797` | — |
| 4-24 | **the market**: kind; roster `:315`, `:1064`; class | HOLDS (one cite drifts) | `wiringCensus.js:1310` (the survey's `:1311`) | — |
| 4-25 | **the granary / the stores / the wagons**: withdrawn token `:157-161`; `storehouse` / `store` classes | HOLDS (two cites drift) | `holderTable.js:157-161`; `wiringCensus.js:1322` (storehouse; survey `:1323`), `:1309` (store; survey `:1310`) | — |
| 4-26 | **the rolls / the ledger**: an angle, not an organ; `ledger` withdrawn | HOLDS | annex `:122`; `holderTable.js:157-161` | — |
| 4-27 | **the elders**: kind `:79`; service `:333`; roster `:336`; rows `:14, :26, :20, :32`; role keyword `:34`; angle `:125` | HOLDS | as cited | Note (not this desk's read): the engine EMITS "the village elders" / "the household heads" as the council label on small tiers (`governanceNarrative.js:101-105`), so "the elders" is an engine label elsewhere; on this desk it stays unlicensed |
| 4-28 | **the parish**: kind; services `:298`; roster `:301`; rows `:1411, :1423, :1161`; SINK via `:226-227`; `Records` `on:false p:0.5`; `Record keeping` in no list | HOLDS | `holderTable.js:296-302`, `:257-259` (deliberately in no list); `institutionServices.js:1165`, `:1170`; the census dump (parish on the two SINK rows) | — |
| 4-29 | "a town-tier town holds the parish record only through its burial grounds" | CONDITIONAL | `institutionalCatalog.js:1259-1267` lists the town tier's Religious rows (`Parish churches (2-5)`, `Monastery or friary`); which tier's roster instantiates `Parish burial grounds` / `Cemetery network` was NOT verified here | Unverified tier membership; hold as PLAUSIBLE until the roster is read per tier |
| 4-30 | **toll-bar · census · road · tradition**: holder kinds; `tradition` has no institution; `road` class; the pilgrim road with no road read | HOLDS (one cite drifts) | `holderTable.js:79-80`, `:338-348`, `:350-355`; `wiringCensus.js:1313` (road; survey `:1314`); leaf "pilgrim" 11 hits, "the road" 7 | — |
| 4-31 | **the treaty / the instrument**: read-model `:35-91`; sides `:166`; lookup `:200-207`; the victor/loser defect `:171-176`, declared `:420-426` | HOLDS | `treatyDocument.js:35-91`; `treatyOrientation.js:166`, `:200-207`, `:171-176`; `warFaithStateProse.js:420-426` | — |
| 4-32 | **the term / the clause**: "26 catalog types", 13 families, labels `:398-430`, the corpus 7 + floor | CONDITIONAL | `peaceTermsCatalog.js:159-322` (the catalog), `:325`, `:328`; `:398-430`; `warFaithStateProse.js:323-326`, `:350-352` ("THIRTEEN") | The count 26 was not re-counted here; the families and labels hold |

## §4.3 FAITH (survey §4.3)

| # | Noun · claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 4-33 | **the creed** is NONE of the four layers — a TRADITION object; `patron` and `faith` share the `temple` class with the building | HOLDS (one cite drifts) | `religionState.js:620`; `moveGrammar.js:47`; `wiringCensus.js:1312` (temple = temple · shrine · church · parish · clergy · faith · patron; survey `:1313`) | — |
| 4-34 | **the patron**: three rows — the seated creed `:620`/`:622`; a brokerage house's patron `:60`/`:228`; `rankAxis` `:476`; the holder reads the brokerage patron as `controlled` `:665-666` | HOLDS | as cited | — |
| 4-35 | **the temple / church / shrine …**: the per-tier rows; `hasChurch` is a substring match true for a priest or a shrine | HOLDS | `institutionalCatalog.js` rows as cited; `priorityHelpers.js:65` | — |
| 4-36 | **the parish church**: BODY and (coin-flip) ORGAN | HOLDS | `institutionServices.js:1161-1166` (`Records` `on:false, p:0.5`) | — |
| 4-37 | **the graveyard / burial ground / cemetery network**: the reliable parish rows | HOLDS | `:1411-1416` (`Register of the dead` `on:true p:0.8`), `:1423-1428` (`Central register` `on:true p:0.9`) | — |
| 4-38 | **the clergy**: "no institution row and no field; ROLE vocabulary only; a clergy sentence asserts a body the engine does not count" | CONDITIONAL | `roleCategory.js:41-44` HOLDS; `wiringCensus.js:1312` HOLDS; BUT `governanceNarrative.js:128-130` emits `'the clergy'` as the healer LABEL where a `church`/`cathedral`/`parish` row is on the roster — the engine does use the word as a roster-conditioned collective | Not a body the engine COUNTS, but a label the engine EMITS under a row condition; on this desk (no roster read) it stays unlicensed. The leaf uses "clergy" 12 times |
| 4-39 | **the congregation / the faithful / the households**: a person-plural; banded by share | HOLDS | `faithPanelModel.js:60-65` (`shareBandLabel`); `institutionTable.js:211-212` (`whoIsCounted` OPEN BY LAW) | — |
| 4-40 | **the fabric / the house / the benches**: BODY of `{institution}`, which never fills | HOLDS | `warFaithStateProse.js:131-132` | see 4-22 for "house" |
| 4-41 | **the faith's treasury / the coffer**: `templeWealth` has no writer | HOLDS (measured) | `grep -rn templeWealth src` → 7 hits, ALL comments or block titles (`warFaith.generated.js:4604, :5574`; `warFaithStateProse.js:95-98`; `dossierMounts.js:504-505`) | — |
| 4-42 | **the councils (of a faith)**: no row; `council` is `hall`-class and a government role keyword | HOLDS (one cite drifts) | `wiringCensus.js:1314`; `roleCategory.js:34` | — |
| 4-43 | **cults[]**: `config.cultDeitySnapshots`; `cult` also a standing | HOLDS | `faithPanelModel.js:192`; `religionState.js:150-155` | — |
| 4-44 | **the ruler**: the mandate phrases' own word, licensed only where `mandateGovWeight > 0`; "the ruler is the ruling STRUCTURE, not a person" | CONDITIONAL | `religionState.js:791-793` (the three phrases), `:686-691`, `:789` | The engine types nothing named "the ruler"; the weight regex admits PERSON-shaped government words (`monarch\|…\|king\|queen\|emperor`, `:689`), so the phrase's referent is the government CLASS. Safe ONLY inside the authored phrase (annex `:4517-4518` "surrounds, never rewrites"); a writer's own "the ruler" outside it is a role word the engine does not emit |
| 4-45 | **the pilgrim road / the inns**: no pilgrim record; `road` kind roster `Listening post` / `Waystation` | HOLDS | `holderTable.js:350-355` | — |

## §4.4 THE ROLE WORDS (survey §4.4)

| # | Claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 4-46 | The whole column is empty by measurement (`holderRole` null everywhere; the inference exists and is not called) | HOLDS for the institution table | `institutionTable.js:215`, `:457`, `:503-509`; `npcProfile.js:341-353` | See 1-15: the ESTATE does carry the edge in the world-run; the column's emptiness is the table's, not the engine's |
| 4-47 | **the captain**: `FACTION_ROLES.watch` `:47-49`; `captain` in military `:37` | CONDITIONAL (cite) | `factionRoles.js:44-46` (role `:45`); `roleCategory.js:38` (`'captain'` is on `:38`) | Added (A-8): the Watch Captain's `linkToInst` admits `militia`, so the engine's one military role word spans the MUSTER's own roster row (`Citizen militia`), not the watch alone |
| 4-48 | **the priest / high priestess**: `FACTION_ROLES.temple` `:44-46`; `Priest (resident)` is a ROW whose name is a role word and keeps no parish service | HOLDS (cite drifts to `:41-43`) | `factionRoles.js:42`; `institutionalCatalog.js:778`; `institutionServices.js:1194-1199` (Religious services · Healing · Life ceremonies · Spiritual counsel — none of the three parish names) | — |
| 4-49 | **the reeve**: role keyword `:34`; `Village reeve` row `:1346`; a treasury roster row `:277` | HOLDS | as cited | — |
| 4-50 | **the elder**: role `:34`; kind `:79`; the `[elder]` angle | HOLDS | as cited; annex `:125` | — |
| 4-51 | **the factor** `:52`; **the guildmaster** `:51`/`:52`; **the magistrate** `:34`/`:630`/`:1312`; **the mayor** `:34`/`:56-58` | CONDITIONAL (cites) | `roleCategory.js:50` (`'factor'`, `'guildmaster'` on `:50`); `factionRoles.js:48` (Guildmaster), `:56` (Lord Mayor); `wiringCensus.js:1311` (magistrate in `law`) | Content true; four cites drift |
| 4-52 | **the clerk(s)** a standpoint word; **the sexton** only inside a service description `:1413`; **shepherd / observers / watchers / bearers** no row | HOLDS | `institutionServices.js:1413`; leaf `:967` (clerks), `:1357` (watchers), `:5118` (shepherd); `:1427` ("Bearers, mutes…" inside `Funeral procession`'s desc — the bearers DO appear in a description string, like the sexton) | "the bearers" is not "no row, no field": it sits in `Cemetery network`'s `Funeral procession` desc (`:1427`), the same standing as the sexton |

## §5 THE READS BY LAYER (survey §5)

| # | Claim | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 5-1 | §5.1 BODY-adjacent = `On campaign` · `Occupied` · `At war` · the two `climbing` pools | CONDITIONAL | see 0-6: `Occupied`'s keyed branch is the occupation (a POWER standing) and `At war`'s is `otherwiseAtWar` (a residue, `:204-206`); both are muster-LICENSED only through sibling-branch tokens | Two of the five are not body reads; the muster citation on them is the wiring's, not the read's |
| 5-2 | §5.1 `occupierHoldings.*` = "BODY-adjacent, but about ANOTHER power's position; {counterpart} as the subject" | HOLDS as to the referent; REFUTED as to the holder | `warFaithStateProse.js:279-311` (the reading is taken FOR THIS TOWN'S OCCUPIER on the occupied town's page — HOLDS); but `holderTable.js:199` maps `stretchedThin` → `muster` and `holdersOf` (`:599-615`) resolves the holder on THE SETTLEMENT PASSED — the OCCUPIED town's `Citizen militia` — for a record that is the OCCUPIER's | The card would cite the wrong town's muster for the occupier's overextension. A wiring finding (added overlap A-6), not a writer's |
| 5-3 | §5.1 ORGAN-UNDER-POWER = the four court rows; ORGAN (no power) = the two parish rows; NO LAYER = the rest | HOLDS | the census dump | — |
| 5-4 | §5.2 the covert-flag defect: `row.covert` from any read carrying a `covert` segment; the three non-covert branches carry the token | HOLDS (executed) | `wiringCensus.js:1681`, `:1265-1269`; `warFaithStateProse.js:251-262` (`covert` read on every branch, returned only at `:254`); the census dump shows COVERT on all four `mobilization:` rows; the climbing card prints `audience: DM only` | — |
| 5-5 | §5.3 settlement-wide capture reaches this desk only as provenance on the court rows; no pool states it; neither face may name it | HOLDS | `holderTable.js:560`, `:677-698`, `:707-708`, `:770`; annex `:3948` (PRINT-DEFERRED at `corrupted` and above) | With 1-7 as the condition on WHEN the court is "captured" |
| 5-6 | §5.3 per-faction capture, per-institution impairment, brokerage patronage: not read here; absent on headless towns | HOLDS | `holderTable.js:661-662`, `:665-666`; `corruption.js:663-692` | — |
| 5-7 | §5.3 covert MOBILIZATION is the desk's one live covert read; DM pen line only | HOLDS | `mobilization.js:128` ("hidden from neighbours (gm-only)"), `:147`, `:366`, `:391`; written `false` at `:315, :343, :349, :375`; annex `:3446-3448` all `dm-only` | Note `:418` also carries `prev.covert` forward on a further arm the survey did not list |
| 5-8 | §5.3 covert CONGREGATION has no writer | HOLDS (measured) | `grep -n covert src/domain/worldPulse/religionState.js` → none; no `covert` in `cultImposition*.js`, `pantheon.js`, `patronFall.js` | — |
| 5-9 | §5.3 foreign funding `dm-only` is authored on the variant, not derived | HOLDS | annex `:3623-3625` | — |

## §6 THE SURVEY'S OVERLAPS O-1…O-15

| # | Overlap | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 6-1 | O-1 professional city watch in the garrison AND watch buckets; both flags | HOLDS | `defenseInstitutionBuckets.js:90`, `:96`; `priorityHelpers.js:46`, `:48` | — |
| 6-2 | O-2 the watch's six rows | HOLDS (one cite drifts) | `:95`; `holderTable.js:79, :115, :202-212`; `corruption.js:630`; `wiringCensus.js:1303`; `roleCategory.js:39`; `factionRoles.js:44` (survey `:47`) | — |
| 6-3 | O-3 hireling hall in two force flags | HOLDS — and INCOMPLETE | `priorityHelpers.js:49`, `:51`; see 4-12: the row is in NO bucket | The register car's finding is "two flags, zero buckets" |
| 6-4 | O-4 the seat's four rows, two on this desk | HOLDS | annex `:3588` vs `:4589`; leaf `seat` 30 hits | plus A-4 (`{term}` prints "installed seat") |
| 6-5 | O-5 the patron's four rows | HOLDS | as cited | — |
| 6-6 | O-6 the muster's three rows "safe because all three are the same referent's layers, unlike the watch" | REFUTED | `treatyDocument.js:58` vs `:63` (two referents in the engine's own voice); 5-2 (the holder resolves at the wrong town on the holdings rows); 4-4 (the "state word" layer is corpus, not engine) | The muster is NOT one referent's layers: the same word names the counterpart's call, the town's arms and a holder that can be the wrong town's |
| 6-7 | O-7 elder/elders/`[elder]`; O-8 ledger/clerk/rolls | HOLDS | as cited | — |
| 6-8 | O-9 the garrison's six directions | CONDITIONAL | direction (a) "the occupier's soldiers" is not an engine row (4-7); the other five hold (`:88`, `:173`, `:630`, `:39`, `:1303`) | Five directions in the engine, one in the corpus |
| 6-9 | O-10 the court's four rows | HOLDS (one cite drifts) | `factionRoles.js:56` (the noble `linkToInst` has `court`; survey `:57`) | — |
| 6-10 | O-11 treasury; O-12 `Priest (resident)` / `Village reeve`; O-13 the `force` class; O-14 the `temple` class | HOLDS (class cites drift by one: `:1303` correct, `:1312` for temple) | as cited | — |
| 6-11 | O-15 the occupier's two spellings | CONDITIONAL | see 2-3 | — |

## §7 THE SURVEY'S FINDINGS F-1…F-7 (every quote re-located)

| # | Finding | Verdict | Evidence | Condition |
|---|---|---|---|---|
| 7-1 | F-1 rows 1–9 (body words on non-body reads) | HOLDS | quotes at annex `:3399`, `:3688`, `:4657` (survey `:4654`), `:4659` (`:4656`), `:4706`, `:4711` (`:4709`), `:4725` (`:4728`), `:4770` (`:4772`), `:4775` (`:4779`); the reads `warFaithStateProse.js:203`, `:469-471`, `:611-613`, `:150-155` (religionState), `:655-658`, `:646-649` + `patronFall.js:76` | Six annex cites drift by 2–5 lines; every quote exists |
| 7-2 | F-1 row 10 `economic · honored` "(holder court)" | CONDITIONAL | the quote HOLDS (`:3528`); the row is SOURCE-UNRESOLVED (no reads) per the census — the court licence is on the four doc/fraying rows only | The layer error stands (a role-plural agent, an office word); the "court-held" ground does not |
| 7-3 | F-2 rows 11–18 (a person as agent) | HOLDS | `:3423`, `:3411`, `:3625`, `:3604`, `:3884`, `:4812` (survey `:4813`), `:4530`, `:4790` | — |
| 7-4 | F-3 rows 19–22 (an organ invented) | HOLDS | `:4791`, `:4797`, `:4620`, `:6286` | — |
| 7-5 | F-4 rows 23–26 (same word, two referents) | HOLDS — with the root added | `:3588` vs `:4755` (survey `:4757`); `:3451` vs `:4770`; `:3543` vs `:3558`; `:3603`; ROOT: `treatyDocument.js:73` ("The installed seat still sits…"), `:68` (the garrison), `:58`/`:63` (the muster), `:78` ("The court stays open…") — the corpus's collisions are the engine's own `TREATY_COMPLIANCE_VOICE` restated | The register car's cure has to reach the voice table, not the corpus alone |
| 7-6 | F-5 rows 27–29 (a fused agent) | HOLDS | `:3466` + `occupationStatus.js:119-148` (`:145`, `:147`) + `warFaithStateProse.js:282-301`; `:4619` + `religionState.js:786-794`; `:3394` | — |
| 7-7 | F-6 rows 30–31 (visibility) | HOLDS (executed) | see 5-4; annex `:3445`, `:3806` | — |
| 7-8 | F-7 rows 32–33 (the angle sliding into the organ) | HOLDS | annex `:122`, `:3528`, `:3608`, `:125`; `holderTable.js:79`; `roleCategory.js:34` | — |

## §8 THE SURVEY'S SUGGESTIONS (§8) — read, not ruled

8.1–8.5 are consistent with the rows above; 8.6 (a fifth word for TRADITION or an explicit
exclusion) HOLDS as an observation: `{creed}` is `MOVES.TRADITION`'s object (`moveGrammar.js:47`)
and none of BODY / ORGAN / POWER / ROLE. The chair's law needs either the fifth layer or the
sentence "a tradition read names no institution-class noun".

---

## §9 OVERLAPS THE SURVEY MISSED (added; every one an engine fact)

| # | Overlap | Evidence | Why it bears on the law |
|---|---|---|---|
| A-1 | **A PERSON IS THE SOURCE OF A BODY'S COVERT STANDING.** `compromisedSecurityInstitutions` marks a security institution `covert` when an unexposed corrupt NPC is HOMED there, impairment or none | `corruption.js:648-650` (`npcHomeInstitution` = `factionAffiliation \|\| factionLink \|\| institutionId`), `:683-689`; `corruptionImpair.js:149-157` (`harborsCorruptInsider`); `settlement.schema.js:444` | Clause 4's "covert = the DM pen line" has a second engine source; clause 1's PERSON exclusion must be stated as scope, because the engine's own covert channel IS a person |
| A-2 | **THREE THRESHOLDS FOR "CAPTURED".** `holderTable.js:141` (any non-`none` criminal rung, `adversarial` included) · `holderTable.js:661` (`corrupted`/`capture` only, for a world `captureState`) · `rulingStructure.js:762-767` (`adversarial` "asserts enforcement is WINNING", not seeded) | as cited | The court's birth INTERESTED mark on this desk fires at a rung the generator calls not-a-capture |
| A-3 | **THE ENGINE'S OWN VOICE TABLE IS THE SOURCE OF THE DESK'S COLLISIONS.** `TREATY_COMPLIANCE_VOICE`: "the muster" at two referents (`:58` the counterpart's call; `:63` the town's arms), "The garrison keeps the walls" (`:68`), "The installed seat" (`:73`), "The court stays open" (`:78`), "the granaries grumble" (`:54`), "the ranks mutter of desertion" (`:59`) | `treatyDocument.js:51-91` | The corpus restates these; a cure that reaches only the corpus leaves the shipped strain line saying the same things |
| A-4 | **`{term}` PRINTS INSTITUTION, ROAD AND SEAT WORDS THROUGH A PROPER SLOT.** `installed seat` (`:408`), `temple restitution` (`:420`), `pilgrim's road` (`:418`), `right of mission` (`:416`), `shared rite` (`:417`) | `peaceTermsCatalog.js:398-430` | The T-F12 civic-class guard reads the pool's words, not the fill's; "the installed seat" beside `{term}` = "installed seat" is one word twice |
| A-5 | **`{counterpart}` ON A TREATY POOL IS NEVER THE DOCUMENT'S PARTY.** The slot fills from the occupier, else the single siege counterpart; `doc.victorName`/`loserName` are unread | `warFaithStateProse.js:795`, `:930-933`, `:690-694`; `treatyDocument.js:359-361` | The typed power slot on DS-WAR-2 names a power that may not be the signatory |
| A-6 | **THE HOLDER'S SECOND HOP RESOLVES ON THE WRONG TOWN FOR `occupierHoldings.*`.** The record is the occupier's; the holder is looked up on the occupied town's roster | `holderTable.js:199`, `:599-615`; `warFaithStateProse.js:279-311` | A muster citation on those two rows would cite the occupied town's militia for the occupier's overextension |
| A-7 | **PATRONAGE VISIBILITY FOLLOWS THE HOUSE'S LEGALITY, NOT THE POWER.** `covert: house.legality === 'illegal'` | `brokeragePatronage.js:296` | Clause 4 ("visibility follows the power layer") is contradicted on the patron layer: the pen line is keyed on the house |
| A-8 | **THE WATCH CAPTAIN LINKS TO THE MILITIA.** `linkToInst: /watch\|garrison\|barracks\|militia/` | `factionRoles.js:45` | The engine's one military role word spans the muster's roster row; "the captain" is not the watch's alone |
| A-9 | **TWO ENGINE LABEL FUNCTIONS, TWO PRECEDENCES, ONE ROSTER.** `deriveGuardLabel` (garrison → barracks guard → professional guard → the watch → militia → mercenary company → 'the guard'/'the able-bodied') vs `deriveWatchLabel` (the watch → the guard [garrison or guard] → militia → 'the guard'/'the neighbours'); plus `'the clergy'` (`:128-130`) and `'the village elders'` / `'the town council'` by tier (`:101-110`) | `governanceNarrative.js:86-99`, `:134-149`, `:101-132` | The engine already emits body words by roster and tier on the power desk's narrative; a `{force}` / `{council}` fill exists in the estate and this desk has none |
| A-10 | **A STANDING PREDICATE ON A BODY WORD FROM A PRESENCE BOOLEAN, SHIPPED.** The Unsafe band's copy says "The garrison is overwhelmed **or corrupt**" from `hasGarrison` alone | `safetyProfile.js:296-300` | The engine's own text commits the clause-1 breach the law would fail ("corrupt" is a standing read; `hasGarrison` is a body read) |
| A-11 | **THE GARRISON'S OWN SERVICE ROW ENTAILS GATE DUTY.** `"Defence services": … "Patrol, wall-walking, gate duty"` on `Garrison` | `institutionServices.js:186` | Bears on W14's `Town watch` gate-duty note: the catalog puts gate duty on the Garrison too, on gateless towns alike |
| A-12 | **"HOUSE"**: a faith fabric on this desk (leaf `:4886`, `:4711`) and a brokerage HOUSE under a patron in the engine (`houseName`, `:288-289`) | `brokeragePatronage.js:283-297` | One word, a TRADITION-read fabric and a POWER-layer body |
| A-13 | **`covert` ON A FURTHER MOBILIZATION ARM.** `:418` carries `prev.covert` forward (the survey listed `:366` and `:391` only) | `mobilization.js:418` | Completeness of the covert-write inventory |

## §10 MISSED NOUNS (institution-class nouns or role words of this desk the survey did not row)

| Noun | Where on the desk (leaf line) | The engine row it collides with |
|---|---|---|
| **the ranks** | `warFaith.generated.js:1072` ("the ranks that answer it talk about not answering") | a person-plural of the banner; `treatyDocument.js:59` ("the ranks mutter of desertion") — desertion is DS-DEF-5's cell (R-viii′) |
| **{counterpart}'s company** | `:532`, `:541` ("{counterpart}'s company, and the company has been growing") — DS-WAR-1 feasibility pools | "company" is a COALITION here and the mercenary bucket's keyword `'mercenary company'` (`defenseInstitutionBuckets.js:99`) elsewhere; the feasibility pools are SOURCE-UNRESOLVED |
| **the harbour / the roads** | `:2941` (DS-WAR-5, dark) | the `road` holder kind (`holderTable.js:80`, roster `:354`); `hasPort` (`priorityHelpers.js:61`); the `road` civic class (`wiringCensus.js:1313`) |
| **the coffer** | `:5027`, `:5051`, `:5073` (DS-FTH-3 `TEMPLE WEALTH:`, unroutable) | a treasury-class word on `{institution}`, which never fills; `templeWealth` has no writer |
| **the houses** | `:4886` (`FALL: displaced`) | see A-12 |
| **the fabric / the roof** | `:5051`, `:5073` | the temple's fabric with no built-fabric field (`MOVES.OBJECT` licences "a built-fabric field", `moveGrammar.js:42`) |
| **a clerical post** | `:5118` (`COVERT CONGREGATION`, undrawable) | a ROLE placement under "another creed's roof" — a role read on a field with no writer |
| **the hall (asked)** | `:2461` (DS-WAR-5 `posture alert`, dark) — "the hall is beginning to be asked about that" | the office organ as an ADDRESSEE (an agent-ish organ on a posture read) |
| **the impairment (a blockade)** | `:2941` — "the transport … is impaired and the impairment has a name on it" | the engine's `impairments[]` word borrowed for a blockade (`holderTable.js:184-185` maps `blockaded` to the toll-bar) |
| **the bearers** | `institutionServices.js:1427` (a desc string, as the sexton) | rowed by the survey as "no row, no field"; it is a description string like the sexton |

---

## §11 WHAT THE CHAIR SHOULD TAKE FROM THIS PACKET (findings, not decisions)

1. **The survey's structural conclusions HOLD** (no body read; the muster/court/parish trio; the
   unfillable `{institution}`; the covert-flag defect; the same-word collisions). The chair may
   ratify the desk's shape on them.
2. **Four "always-safe" words are NOT safe** and would license a false face if adopted:
   "{counterpart}'s garrison" (4-3), "the guard" (4-15), "the banner" on a family pool (4-6),
   "the muster" as one referent's word (4-5, 6-6). "the muster" survives as a BODY word on a
   body read with the possessor seated.
3. **Two power-slot claims are unsafe**: `{counterpart}` on a treaty pool (2-4, A-5) and the
   "one referent, two spellings" occupier (2-3).
4. **The PERSON clause's ground is wrong and its conclusion right** (1-14, 1-15, A-1): the law
   should say "a person is never a referent BY SCOPE", not "because no edge exists".
5. **Clause 4 needs two amendments**: a covert standing has a person source (A-1), and the
   patron layer's pen line follows the house's legality (A-7).
6. **The register car's list grows by**: the mercenary bucket/flag split (4-12), the wrong-town
   holder on the holdings rows (A-6), the voice table as the collision root (A-3), the `{term}`
   label leak (A-4), and the three capture thresholds (A-2).
7. **Twenty-one line cites in the survey drift** (all re-derived above); none changed a verdict
   on its own.
