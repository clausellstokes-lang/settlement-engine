# SKELETON — DS-DEF-2 · pool `Beasts & Monsters: frontier, credible deterrence`

Seat: **Opus 5, the marker**, writing for the Fable chair, 2026-09-12, under **ADDENDUM 14** (a face is lawful unless it CONTRADICTS the record; silence is permission; the verdict `unlicensed` no longer exists).

Read whole before a word was written: `prose-research/REGISTER-CARD.md` with amendments S2 and S3; `RULES-V2-PART-B.md` §1, §16–16.2, §18, §20, §21 (with 21.1–21.4), §22, §23, §24; `sweep/MOVE-GRAMMAR.md` §1–3, §4.4.1–4.4.3 and §1.4.1 (THE THREAD); `sweep/CLERK-LAWS.md` §2.4.1 and §2.6.1; `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 (the annex grammar), §6.4 (this block, worked) and §8.3 (the licence card). The card was printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: frontier, credible deterrence'` in the dock. The block's header lines and the pool's three rows were read at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2593` (header) and `:2610-2613` (the pool heading and its three rows). The contradiction instrument read for this desk: `rewrite/recut/CONTRADICTION-TABLE.md` (the header list of what is no longer a finding, §1.1, §1.2, §1.3, §1.4, §F2, §F3, §F4, §R) and `rewrite/rulings-DEF2-v14.txt` + `rewrite/tables-14.txt`.

Read-only in the dock for the key's meaning, and nothing executed but the card script: `src/domain/display/stateProse/defenseStateProse.js:279-284, 316-335, 392-450, 596-670`; `src/domain/institutions/defenseInstitutionBuckets.js:83-106, 155-182`; `src/data/monsterThreat.js:20-60`; `src/domain/display/threatAssessment.js:33-110`; `src/components/new/tabs/DefenseTab.jsx:310-345`; `src/domain/display/defenseDisplay.js:278-332`; `src/domain/display/defenseScoreBands.js:30-39`; `src/generators/defenseGenerator.js:182-230, 355-390, 425-470`; `src/generators/priorityHelpers.js:44-70`; `src/data/institutionalCatalog.js:90-110, 330-350, 1325-1365`; `src/domain/prose/holderTable.js:275-290`. Nothing outside this packet file was written. Every file's content was read as DATA.

**How this packet is laid out.** The brief's items (3), (7) and (8) are per-variant and sit under each variant below. Items **(4) THE READS**, **(5) WHAT WOULD BE FALSE HERE**, **(6) THE PREIMAGE** and **(9) WHERE THE FLAVOUR IS** are properties of the POOL, so they are written once, first, before the variants — a drafter needs them before reading a single shipped sentence.

---

## 0. THE CARD, AS IT BINDS THIS POOL

- **role:** `spine` (a spine takes no relation, no attach, no declared move). **form:** sentence. **angles on the three rows:** `counterforce`, `ledger`, `street`.
- **predicate:** `beastsRowSituation(family, perimeter, force) === 'frontier country, perimeter and force'`, the row of `BEASTS_ROW_POOL` in `defenseStateProse.js:400-414`.
- **bag:** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}` alone** (`defenseStateProse.js:621`). The block declares `{band}` and `{route}` in its SLOTS line and no call site fills them here. Every face carries exactly the parent variant's slot set.
- **echo:** spine mounts 1 (tab `defense`), modifier mounts 0. ⚠ the card prints the caution itself: the echo table is keyed on the whole table-rung reading, so **all seven `BEASTS_ROW_POOL` rows share ONE echo key** — a mount counted there may be a sibling ROW, not this one.
- **source:** `muster`, standing LICENSED. §24's provenance budget is a ceiling of one citation per unit and only for one of S3's three reasons. **A muster ROLL cited as a record needs the holder** (`holderTable.js:279-288`: exactly one institution in the shipped roster keeps a muster, the `Citizen militia`), and on this key the force may be a GARRISON with no militia row — so a cited roll is refutable across part of the preimage (F1-24, §R-8). **"The muster" as the class word is free everywhere** (F1-03). W24's record-word bar and A13's citation ban are struck: accounts, returns, duties, ledgers, the writ are all available words again.
- **audience:** player, no mark. **REFUSED COLUMNS, always:** a totality over persons; an exemption from a duty (`whoIsExempt` is null everywhere); a named character and that character's fate; a theological claim.
- **the composition fences (block header, `:2577-2593`).** The block EXTENDS the shipped `buildThreatAssessment` lattice rather than replacing it; each branch there holds exactly ONE string, so every settlement in a branch says the same words — that sameness is what this pool exists to cure. Institution presence is a STANDING fact with **no recorded history**; the causal clauses this block licenses are **capability** clauses (a work without people cannot be held) and never **historical** ones (a work raised after a siege). Two standing defects are named and must not be reintroduced: the lower-case sentence lead on the `plagued`+nothing branch, and reading wall PRESENCE off `institutions.walls` instead of the predicate.
- **the annex grammar that bites here (ARCH §2.5).** A sentence-form row or face begins on a capital that is **not** a `proper`-typed slot (T-F8) — so **no numbered row and no face may open on `{settlement}`**, and shipped variant 1 opens on `{settlement}` and cannot carry that opener. No two numbered lines share their first two words after slot normalisation (A11). A face's `{slot}` set must equal its parent's. No digit, no percent, no em dash, no `which`-clause, no exclamation mark.

---

## (4) THE READS THIS POOL REACHES — material a writer MAY use, never a bound on what may be written

1. **`config.monsterThreat` → the corpus family word `frontier`**, through `measuredMonsterFamily` (`defenseStateProse.js:328-335`) and `MONSTER_FAMILY_OF` (`:279-284`). ⭐ The read is a MEASUREMENT, not a default: `measuredMonsterFamily` returns `null` where the raw value is absent, precisely so the desk never describes the country of a town whose country nobody measured. So on THIS pool `frontier` is a measured fact about the country — which is the one place the desk's general warning ("frontier is the default of an unmeasured town") does **not** bite.
2. **`standingDefenseForces(settlement).walls.present === true`** (`defenseInstitutionBuckets.js:169-182`), the bucket matching any of `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`:84-87`) over `liveInstitutions(settlement)` — the **live, ruin-filtered roster**, never the generation-time `defenseProfile.institutions` snapshot (the desk's own header, `defenseStateProse.js:605-612`).
3. **`garrison.present || militia.present === true`** (`defenseStateProse.js:655`). Garrison bucket: `garrison · barracks · professional guard · professional city watch · multiple garrison` (`defenseInstitutionBuckets.js:88-91`). Militia bucket: `citizen militia · militia` (`defenseInstitutionBuckets.js:92-94`). ⭐ **The key cannot tell you which.** "Force" is the only word that is true of both ends of that disjunction.
4. **The slot bag** — `{settlement}` as a proper fill (`defenseStateProse.js:621`).

**What the pool does NOT read, and is therefore silent about** (silence is permission for atmosphere, and a trap for any face that asserts a VALUE): `scores.monster` and the STRONG/ADEQUATE/WEAK/CRITICAL badge printed beside this very row (`DefenseTab.jsx:322-341`); `economicGates.monster` and the funding note under it; the charter, watch, mercenary and arcane buckets; the tier; `terrainType`; `tradeRouteAccess`; the stress list; `history.age`; the culture profile.

---

## (5) ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows this pool's key can actually walk into

Every row below is one this key can reach. Rows the key cannot reach are omitted deliberately.

### 5a · the works
| # | the claim that would be false | the field / file:line that denies it | which is the record |
|---|---|---|---|
| a1 | **a LINE, a circuit, a ring, a perimeter *around* the town** | `forces.walls.present` is satisfied by `Citadel` and `Inner citadel` (inner keeps, not a circuit) and by `Gates (if walled)` (a point) — `defenseInstitutionBuckets.js:84-87`, `:169-182`; **F1-07** states it in terms: a citadel is inner and a gate is a point, neither is a line around the town | the ROSTER ROW. `rulings-DEF2-v14` fixes the safe generic: **the works, or the recorded name** |
| a2 | **a MATERIAL the row's own printed description fixes otherwise** — stone on a palisade town, timber on a walled one | `institutionVocabulary.js:157` (`Town walls` = stone with gates), `:162` (city = masonry), `:155`/`:278` (palisade = wooden / sharpened stakes). W11's blanket material bar is STRUCK: a palisade IS timber and town walls ARE stone — the fault is only naming the WRONG one, and this key cannot tell you which | the ROW'S DESCRIPTION (**F1-32**, §R-7) |
| a3 | **a material SOURCE** — cut from its own woods, the stone of the country | `supplyChainData.js:873-884` feeds every wall row `Quarried stone` / `Building materials` from a `Stone quarry` where a fortification chain is instantiated | **F1-33** |
| a4 | **a GATE, a gatehouse, a checkpoint — or the denial of one** | `inst.hasGates` fires on `gates · town walls · city walls · massive walls · palisade` (`priorityHelpers.js:53`) and **NOT on `earthwork` or `citadel` alone**; where it is false `safetyProfile.js:463-464` prints "no gates to bribe and no checkpoints to avoid" | **F1-08**. The walls bucket is WIDER than the gates flag, so a gate is not free on this key |
| a5 | **a MAGNITUDE of the works** — substantial, massive, high, thick, seen from a long way off, a day's walk of wall | no field bands the size of a fortification; the roster names the row and never its extent | **FLOOR 2** (F2-01). `rulings-DEF2-v14` lists "substantial works" as one of the four shipped clauses already struck on this block |
| a6 | **rot, weathering, erosion — or PERMANENCE** | **F4-01 as re-cut**: no material decay clock exists anywhere, AND no face asserts the permanence of any institution row, because `calamityKernel.js:96-151`, `:251`, `:259-275` demotes built fabric down `UPGRADE_CHAIN_PAIRS` and stamps `status:'ruined'` | the MODEL |
| a7 | **a raising, a builder, a founding, an age of the fabric stated as an age** | `institutionFounding.js` — absence is the typed value, no arm invents a year; `OverviewTab.jsx:251`, `:259` print `{age} years old` beside the prose | **FLOOR 2** (F2-03, F2-07). ⭐ Age-FLAVOUR is now free where it does not contradict the printed age: "older than the arrangement that pays for it" is lawful |

### 5b · the force
| # | the claim that would be false | the field / file:line that denies it | which is the record |
|---|---|---|---|
| b1 | **SOLDIERS, professionals, paid men, a standing army** | the key is satisfied by the MILITIA bucket alone (`defenseStateProse.js:655`), and `Citizen militia` is "part-time service" by its own row (`institutionalCatalog.js:335-341`, `:867-873`, `:1340-1347`) | the ROSTER ROW |
| b2 | **"the garrison"** as the town's own body | `inst.hasGarrison` / the garrison bucket (`priorityHelpers.js:46`, `defenseInstitutionBuckets.js:88-91`). A `Barracks` DOES license it (§R-3); a militia-only town does NOT | **F1-02** |
| b3 | **"the militia"** | `forces.militia.present` — false on a garrison-only town | **F1-03** |
| b4 | **"the watch"** as a standing body | `inst.hasWatch` (`priorityHelpers.js:48`); the watch bucket is NOT read by this key, so a watch may or may not stand — and where it does not, `safetyProfile.js:300`, `:309` print the denial on the same page | **F1-01**. "Keeps watch", "the night is watched", patrols are free anywhere |
| b5 | **a MILITIA and a WATCH together** | `Citizen militia` and `Town watch` share `exclusiveGroup: 'civilianDefense'` (`institutionalCatalog.js:1340-1354`) — never both as standing bodies | **F1-26** |
| b6 | **a town watch called professional, full-time, or soldiers** | `Town watch` = "Part-time guards. Night patrol and gate duty." (`:1348-1354`); the professional rung is a separate CITY row | **F1-27** |
| b7 | **"the guard"** where no law body stands | `inst.hasMilitaryInst` false → `safetyProfile.js:300`, `:309` print "There is no meaningful guard presence." Where ANY law body stands, "the guard" is the engine's OWN word (`:271`, `:336`) — and on this key a force always stands, so **"the guard" is safe here** | **F1-04**, read the permissive way |
| b8 | **a mercenary company; a charter hall or any specialist monster recourse** | `forces.mercenary.present` / `forces.charter.present` (`priorityHelpers.js:49-51`); the engine's own branch beside this row prints either "Charter hall handles anything above the garrison usual remit" **or nothing at all** (`threatAssessment.js:76-79`) | **F1-05**, **F1-06** |
| b9 | **a HEADCOUNT, a size, a roster count** — forty on the roll, a handful, enough men | the band vocabularies are closed; `demographicsHerald.js:70-80` is the trap | **FLOOR 2** (F2-01). ⚠ a headcount is also DS-DEF-5's own cell |
| b10 | **the singular office the tier names, acting** — the one who keeps the gate key, the captain who is slow at night | `npcGenerator.js:1511-1537` emits exactly ONE Guard Captain per village-plus, with a generated personality, disposition and secret printed on the NPC tab | **F3-06**. An unnamed person may act freely — use a plural, a trade, a bystander, or an office the roster does not seat |

### 5c · the country, and the page around the row
| # | the claim that would be false | the field / file:line that denies it | which is the record |
|---|---|---|---|
| c1 | **`frontier` read as a REALM's edge** — a march, a border, a lord of the marches, another kingdom beyond | `monsterThreat.js:20-28` — the tiers are `heartland · frontier · plagued`, a **monster-and-raider pressure tier of the surrounding country**; `SummaryTab.jsx:28`, `:37` print the tier as monster activity; the neighbour and relationship panels print the town's actual ties | **F1-34**'s class; **F1-113** for the ties |
| c2 | **`frontier` read as a totality of danger, or of safety** | `frontier` is the MIDDLE tier and adds exactly +4 to the monster score (`defenseGenerator.js:198`); `threatAssessment.js:113-130` builds an `Invasion & War` row for EVERY town | **F1-34** |
| c3 | **an OUTCOME over creature events** — very little reaches the town, most of it turns back, nothing has come through | the pulse ADJUDICATES: `monster_pressure` subtracts up to 20 from the monster score (`defenseGenerator.js:432-440`) and prints its own banner on the same dossier | **FLOOR 2** (F2-05, F2-06) and **F1-107** where the stressor is live |
| c4 | **a RATE** — most nights, seldom, more often than not | nothing bands a rate anywhere in the engine; the chair's own ADDENDUM 14 example is withdrawn in its rate form | **FLOOR 2** (F2-06) |
| c5 | **outrunning the BADGE beside this row, or borrowing another arm's** | the badge is `scoreBand(scores.monster)` (`DefenseTab.jsx:322-341`, `defenseScoreBands.js:37-39`), and **this key does not read it** (W-10 names the mismatch). Measured over the key's own domain: walls + militia, no charter, gate at floor → **26, WEAK**; walls + garrison ungated → **44, ADEQUATE**; with a charter hall → **79, STRONG**; with `monster_pressure` live → **CRITICAL**. **All four bands are reachable under this one key.** So "credible deterrence" may print beside a CRITICAL bar | **F1-40** |
| c6 | **the funding state, either way** — the patrols are short, or the purse is full | `economicGates.monster` is `min(1, 0.7 + econOutput/50 × 0.3)` (`defenseGenerator.js:223`) and is **not read by this key**; where it is below one the page prints "Upkeep underfunded: patrol provisioning at N%" under this very row (`defenseDisplay.js:278-321`) | **FLOOR 2** (a dependence on an unobserved field). F4-02/F4-03/F4-04 bind the SHAPE if a face ever does state it: one purse, four gates monotone in the same direction, the extreme is short/late/thin and **never none** |
| c7 | **terrain or approach named against the config** — a pass, a harbour, a cliff, cultivated fields | `config.terrainType` / `tradeRouteAccess` print on the overview; `generalStateProse.js:887-892`; `geographyData.js` | **F1-102** |
| c8 | **north-European village furniture** — thatch, hearth-smoke, the churchyard, the market green, snow on the road | `cultureProfiles.js:50-600` carries twelve profiles (`arabic`, `east_asian`, `mesoamerican`, `south_asian`, `steppe` among them), rendered at `dailyLifeLogic.js:14` and `ViabilityTab.jsx:190`; **no defense pool reads the profile** and the product is SETTING-AGNOSTIC | **F3-05** — the chair's own note that this is the finding most likely to recur in every block |
| c9 | **a minted PROPER NAME borne by the face** — a person, a tavern, a lane, a family | a pooled face is authored once and drawn by every matching town, so the name prints identically across a region; the NPC roster and the `{npc}` slots are the name authority | **F1-126** |
| c10 | **denying a body the roster DOES print** — no muster worth the name, neither walls nor men | the same flags read the other way; and a custom row supplies bodies the buckets cannot see (`customContentSemanticAuthority.js:22-32`) | **F1-25**, **F1-30**. **Write around an absence; never assert one** |

### 5d · THE CLOSED ROSTERS this pool touches (floor 1 — a body the roster does not carry may not be asserted)
1. **The institution roster over the LIVE roster** — `liveInstitutions(settlement)`, ruin-filtered. Everything the works and the force are made of comes from here.
2. **The force buckets** — `garrison · militia · watch · mercenary · charter` (plus `walls`, `magicDef`), `defenseInstitutionBuckets.js:83-106`. The key consults **walls + garrison + militia** and nothing else; the other four are silent, not absent.
3. **The faction list** — not read by this key; a faction may not be seated as the force or the works' owner.
4. **The faith entries** — not read; no temple, shrine or clergy may be seated (F1-11, F1-23).
5. **The NPC office roster** — `TIER_MANDATORY_ROLES` (`npcGenerator.js:1511-1537`); see b10.

### 5e · the deity's four axes
**N/A — this is not a faith pool.** No deity field is read, no `deityTemper()`, no `rankAxis`, no settlement `standing`, no `suppressed` flag. Floor 3's deity doctrine still binds as a wall: nothing may be predicated of a god, and the grammatical subject of any observance is the followers.

---

## (6) THE PREIMAGE — the range of towns one face must be true across

The key is **one enum equality and two booleans**, and nothing else. It fires wherever: `config.monsterThreat` is PRESENT and normalises to `frontier` (the canonical value, or the legacy alias `medium` — `monsterThreat.js:44-60`); the live walls bucket resolves; and the live garrison **or** militia bucket resolves.

- **Every tier the two rows can co-occur at.** The catalogue seats `Palisade or earthworks` + `Citizen militia` at village (`institutionalCatalog.js:335-348`), `Town walls` + a barracks/garrison at town (`:1332-1339`), and `Garrison` (required, professional, noble or royal) + city walls at city (**F1-28**). ⚠ At town and up, `Town watch` is required and shares `civilianDefense` with `Citizen militia`, so the force at those tiers is typically the GARRISON end of the disjunction and at village typically the MILITIA end — but the pool cannot see the tier, and **F1-31 bars naming the tier word** in any case. Write around it.
- **Every country, route and terrain.** No terrain, route, port, culture or region field is read. The same face prints on a desert town, a river port and a steppe camp.
- **Every stress state.** None of DS-DEF-2's five key functions reads `config.stressTypes`. This face can print under an active siege, an occupation, a famine, a plague quarantine or `monster_pressure` — the banners for all of which print on the same dossier. **Write nothing a siege, an occupation or a famine on the same page would make absurd.**
- **Every band of its own badge.** WEAK through STRONG in the ordinary case, CRITICAL under `monster_pressure` (see c5). An intensity word tuned to STRONG is refutable on most of the preimage.
- **Both ends of "force".** Part-time residents who drill, or professional soldiers in barracks. Any face that leans on either end is false on the other.
- **Frozen/live seam.** The pool reads the LIVE roster; the engine's own assess string beside it reads the FROZEN `defenseProfile.institutions` (`threatAssessment.js:38-40`) and defaults an absent tier to `frontier` (`:41`). Where they disagree, **§R-1 governs: the face stands and a WIRING row is filed** — the corpus face is the truthful party, and a floor that charged it would force the rewrite back into ruin-blindness.

---

## (9) ⭐ WHERE THE FLAVOUR IS — what this pool's states make available that the shipped rows never used

**The three shipped sentences never once say what was actually raised or who actually stands on it.** They say line, perimeter, force, arrangements — four abstractions, three times over. Everything below is concrete, is in the record, and is untouched.

1. **The works have a description, not just a name.** Sharpened stakes encircling the place, offering enough to deter a casual raider (`Palisade`, `institutionalCatalog.js:97-103`); a wooden palisade or an earthwork berm that slows raids and creature incursions (`Palisade or earthworks`, `:342-348`); stone fortifications with gates, expensive to build and *to maintain* (`Town walls`, `:1332-1339`). A face cannot pick which — but it can take the **shape** the whole class shares: a bank, a ditch, a line of stakes, a thing you have to come at rather than walk through. What a stranger notices is not that there is a wall; it is where the ground outside it has been kept clear, and how far out.
2. **The force is people with other work.** The militia row's own words: able-bodied residents who **drill** and **muster** against local threats, part-time (`:335-341`). The garrison end is housing for guards. Nothing shipped touches the drill, the rota, the nights owed, the calling-off from the fields, or that the same hands are on the works and in the harvest. That is the sharpest untaken particular in this pool, and it is true at both ends of the disjunction in its general form: **whoever stands there is doing it in addition to something else, or instead of something else.**
3. **The monster purse buys patrols and bounties.** The product's own words for what the beasts row's gate pays are **"patrol provisioning"** (`defenseDisplay.js:279`) and, in the generator's comment, bounty purses and charter-hall retainers (`defenseGenerator.js:212-214`). Not one shipped row leaves the wall. A frontier country is a country people go OUT into — patrols that walk a circuit and come back, a thing brought in and paid for, a distance past which nobody goes alone. (Do not state the gate's VALUE — c6 — but the *existence* of patrols, bounties and a country worth patrolling is the pool's own subject.)
4. **What someone would complain about.** The nights owed. Livestock brought inside. Children kept in after a certain hour. Ground outside kept cut back so nothing can come up to the line unseen — which is labour, every season, on top of the rest. The record is silent on all of it, and silence is permission.
5. **What the absence looks like here.** Nothing is absent: both halves stand. The pool's silence is about **everything the two things cost** — the purse, the watch, the charter hall, the badge. That is where the hook lives: a town that has the works and the people and whose record does not say what either is costing it. A standing condition opens the question a date would close.
6. **The fences on the flavour, in one line.** No north-European furniture (c8) · no named person or place (c9) · no singular tier office acting (b10) · no size, count, rate, date or elapsed course (a5, b9, c3, c4, a7) · no gate unless you write it as the works admit (a4) · and nothing a siege banner on the same page would make absurd (the preimage).

---

# THE THREE SHIPPED VARIANTS

Three variants, in the annex's order (`RECEIPT_POOLS_DOSSIER_STATE.md:2610-2613`). Tags: `SAFE` (nothing in the record denies it — the common case, and silence is permission) · `CONTRADICTED` (with the field, file and line, and which of the two is the record) · `FLOOR-2` (a magnitude outside the read's band word, an elapsed course, or a dependence on an unobserved field).

---

## VARIANT 1 · `[ledger]`

**(2) Shipped, verbatim:**

> `{settlement} sits on an active frontier with a line and a force behind it. Most of what comes out of the country will not press a defended perimeter, and most of what comes here does not.`

**(3) Every claim it makes:**

| the claim | verdict |
|---|---|
| the country around `{settlement}` is a frontier | **SAFE** — read 1; the family word is measured, not defaulted (`defenseStateProse.js:328-335`), and "Active frontier" is the engine's own phrase for this branch (`threatAssessment.js:74`) |
| the frontier is ACTIVE | **SAFE** — `frontier` is the middle pressure tier and the engine prints the same word; nothing denies liveliness in the country |
| `{settlement}` **sits on** it (the town is in that country) | **SAFE** |
| the town has **a LINE** | **CONTRADICTED** — `forces.walls.present` is satisfied by `Citadel`, `Inner citadel` (inner keeps) and `Gates (if walled)` (a point), `defenseInstitutionBuckets.js:84-87`, `:169-182`; **F1-07**. **The roster row is the record.** |
| the town has a **FORCE** | **SAFE** — read 3; "force" is the only word true across the garrison∨militia disjunction |
| the force stands **behind** the works (the two are one arrangement) | **SAFE** — the key conjoins them; read as a physical post it is an observable no field holds, so keep the pairing and drop the locative if the face means a station |
| there is a **DEFENDED PERIMETER** (second sentence) | **CONTRADICTED** — same field and line as the LINE row; **F1-07** names "perimeter" in terms |
| **MOST** of what comes out of the country will not press it | **FLOOR-2** — a magnitude in a word over an unrecorded population of events (F2-01) and a rate (F2-06) |
| …**will not** press it (the modal future) | **FLOOR-2** — a prediction the pulse adjudicates (F2-05); `monster_pressure` subtracts up to 20 on the same record (`defenseGenerator.js:432-440`) |
| **MOST** of what comes **here** does not press it — an outcome over this town's own creature events | **FLOOR-2** (F2-06) and, where `monster_pressure` or a siege banner is live on the dossier, **CONTRADICTED** by that banner (**F1-107**) |
| the deterrence is credible — the arrangement is what keeps the pressure off | **SAFE** as a standing posture; it is the key's own name and the engine's own reading (`threatAssessment.js:75`). It becomes a floor-2 claim only when it is cashed as an outcome over events, which is exactly what the second sentence does |

⚠ **Craft note, not a finding.** The second sentence is lifted near-verbatim from the engine's own hardcoded assess string, which sits one click away in the same box (`threatAssessment.js:76-77`). Under §R-1 engine prose is not the record and the face is not refutable for agreeing with it — but the whole point of this block is that the branch holds ONE string today, and a rewrite that re-says it in the same words has bought nothing (W-16's craft rider).

**(7) The angle's stance.** `[ledger]` enters the pair as the office's books hold it: the country's tier on one side, the two standing things on the other, set down in the order a clerk would, landing on a civic thing and stopping. It may name the works and the force flatly, may state the pairing as one condition, and may let the second beat be a second FACT of a varied kind. It may **not** turn the ledger into a tally (a count, a size, a share), into an outcome (what comes and what turns back), or into a forecast. It is the one angle here that may sound like a record and should.

**(8) The turns worth keeping.**
- **`sits on an active frontier`** — carry it whole. It is the engine's own word, it is licensed, and it puts the country before the town without spending the town's name on the opener.
- **`a force behind it`** — the noun `force` is the exact word for a disjunction the key cannot resolve, and the shipped row found it. Keep the noun; the possessive frame around it is free.
- **the two-beat shape** (a long first sentence stating the condition, a second beat that does something else) is word order and punctuation, spendable and worth spending. Only the CONTENT of the shipped second beat goes.
- **What cannot be carried:** the opener on `{settlement}` (T-F8 bars a sentence face opening on a `proper`-typed slot), `a line`, `a defended perimeter`, and both halves of `most … will not … most … does not`.

---

## VARIANT 2 · `[street]`

**(2) Shipped, verbatim:**

> `The town takes the frontier seriously and has taken it seriously long enough that the arrangements are ordinary rather than anxious.`

**(3) Every claim it makes:**

| the claim | verdict |
|---|---|
| the town treats the country's pressure as real ("takes the frontier seriously") | **SAFE** — a collective disposition, unnamed and unpersonned; W22's person bar and W27's stance rules are struck, and nothing in the record denies it |
| there ARE arrangements | **SAFE** — reads 2 and 3 are the arrangements |
| **has taken it seriously LONG ENOUGH THAT** — a duration, and a state reached through elapsed time | **FLOOR-2** — the perfect plus a duration (F2-02, F2-05); `ageBands.js`'s `HISTORICIZE_BAND` pin is the constitution's own: a birth-time state carries no origin stamp and can bear no temporal register |
| the arrangements are **ORDINARY** (routine, unremarked) | **SAFE** — nothing bands the town's own attitude to its own standing arrangements |
| the arrangements are **NOT ANXIOUS** | **SAFE** in the general case; ⚠ **CONTRADICTED** on the part of the preimage carrying `monster_pressure`, a siege or an occupation banner, all of which print on the same dossier (**F1-107**; `defenseGenerator.js:432-440`, `stressTypes.js`) |
| the ordinariness FOLLOWS FROM the duration (the causal frame) | **FLOOR-2** — it rests entirely on the elapsed course above |
| — | ⚠ **Discrimination note, not a finding.** This variant states neither of the pool's two reads. Word for word it would print true on `frontier, force without a perimeter` and on `settled, defenses beyond the need`. Under ADDENDUM 14 that is not a fault at the face; at the POOL grain it is the **DULL** verdict's raw material, because a face that cannot tell you which cell you are in has bought the reader nothing. |

**(7) The angle's stance.** `[street]` is the town at its own grain: what is done, by whom, how it is spoken of, what nobody remarks on any more. It may reach for scene words, a bystander, a plural, a trade, a complaint, a thing avoided. It may state a collective disposition and the ordinariness of a duty. It may **not** seat a named person, the singular office the tier emits (F3-06), a rate ("most nights"), a duration, or any body the roster does not carry. Ease at the town's own grain is explicitly free (**F1-34**'s rider: children on the earthwork, a bar not dropped in years — minus the rate).

**(8) The turns worth keeping.**
- **`ordinary rather than anxious`** — the sharpest four words in the pool and fully lawful. The contrast is a posture, not a magnitude, and it is exactly what "credible deterrence" means at the street's grain. Carry it, or carry the shape of it.
- **`The town`** as the opener of a sentence-form row: a capital that is not a proper slot, lawful under T-F8, and the row already owns it — so if variant 1 moves off `{settlement}`, it must not move onto `The town` (A11, the shared-opener arm).
- **What cannot be carried:** `has taken it seriously long enough that` — the whole elapsed frame. What replaces it must reach the same landing (ordinary, unremarked) from a STANDING condition rather than from time: the conversion §F2 asks for is *not* "long enough that it is ordinary" but a standing fact whose ordinariness is visible in it.

---

## VARIANT 3 · `[counterforce]`

**(2) Shipped, verbatim:**

> `Very little reaches {settlement} out of the wild country, and the reason is that the arrangements are visible from a long way off.`

**(3) Every claim it makes:**

| the claim | verdict |
|---|---|
| there IS a country outside the town with creatures in it | **SAFE** — read 1; `frontier` is a live monster-and-raider tier (`monsterThreat.js:20-28`) |
| the country is **WILD** | **SAFE** — nothing denies it; ⚠ weak adjacency risk only: `terrainType` and the cultivated-land readings print on the overview (**F1-102**), so "wild" is safest read as what is IN the country rather than as uncultivated ground |
| **VERY LITTLE REACHES** the town — an outcome over creature events | **FLOOR-2** — a magnitude over an unrecorded population (F2-01) and an implied rate (F2-06). ⚠ **CONTRADICTED** where `monster_pressure` is live (`defenseGenerator.js:432-440`, the banner on the same dossier) or where the beasts badge reads WEAK or CRITICAL, which this key permits across its whole domain (**F1-40**, §5c c5) |
| there ARE arrangements | **SAFE** — reads 2 and 3 |
| the arrangements are **VISIBLE FROM A LONG WAY OFF** | **FLOOR-2** — a magnitude of the works (height, extent, sightline) that no field bands; the roster names the row and never its size. The same fault as the struck shipped clause "substantial works" (`rulings-DEF2-v14`) |
| the visibility is **THE REASON** little comes (deterrence by appearance, not by use) | **SAFE** as a standing capability clause — the block's header licenses exactly this class (a capability clause, never a historical one) and the key's own name is "credible deterrence". It is sound in itself and unsound here only because both of its terms above are floor-2 |

**(7) The angle's stance.** `[counterforce]` states what is holding a pressure back, and reads the negative case as the record: the thing that does not happen, and the standing arrangement that is why. On this pool it is the angle closest to the key's own meaning and therefore the one most tempted into an outcome. What it may do: name the arrangement as a deterrent in the **subjunctive** (what would have to be attempted; what an attempt would meet), state the capability as a standing fact, and land on the civic thing. What it may not do: count what has come, rate what comes, forecast what will come, or size the works. **State never fate** — the edge is subjunctive, and the subjunctive is this angle's licensed instrument here.

**(8) The turns worth keeping.**
- **The IDEA of the whole sentence** — that what deters is what is *seen*, not what is used — is the pool key's own sense, is the sharpest thing any of the three rows reaches for, and is lawful once it stops being cashed in events and distances. Keep it; re-seat it in the subjunctive or as a standing capability.
- **`out of the ... country`** — the country as the source of what comes is licensed and is the pool's own subject; keep the preposition and the noun.
- **`and the reason is that`** — a plain joint that asserts a capability edge without a `which` and without a cause the record does not hold. Lawful, and worth keeping as a rhythm if not as these words.
- **What cannot be carried:** `Very little reaches`, and `visible from a long way off`.

---

## WHAT THE POOL'S REWRITE MUST HOLD ACROSS THE THREE (for the drafter and the refuters)

- **Three variants, three grammars, three openers.** A pool of k carries min(k, 8) distinct level-1 grammars (MOVE-GRAMMAR §2.1). No two numbered rows share their first two words after slot normalisation (A11), and **no row and no face opens on `{settlement}`** (T-F8) — which variant 1 does today and cannot keep. `The town` is variant 2's opener and is spoken for.
- **The two reads are the pool's discriminator.** Variant 2 states neither, and would print true on three other cells of this same row. The rewrite is free to leave a face abstract, but a pool in which no face tells you that **both** the works and the people are standing has not earned its cell.
- **The word "force" is load-bearing.** It is the only noun true of both a barracks garrison and a part-time citizen militia. Every sharper word for the people — soldiers, professionals, the garrison, the militia, the watch, paid men — is false on part of the preimage (§5b).
- **The works cannot be named sharply either**, for the same reason (citadel, gate, palisade, earthwork, town walls, massive walls all satisfy one flag). The sharpness available is not the material but the **shape and the labour**: what has been kept clear outside it, what it costs to maintain, who is on it and what else they do.
- **The thread** (MOVE-GRAMMAR §1.4.1, a wall). This pool is the SPINE and composes with zero modifiers today, so no face turns outward. Where a face runs to two sentences, the second carries a noun forward from the first — the works, the force, the country, the town — or it is a disconnect a refuter will name. The composer orders modifiers by salience with the spine first, and the drafter does not choose the face's place: **every face must read well immediately after nothing at all.**
- **Four faces per variant**, each a different vocabulary or rhythm inside the voice, never a paraphrase of a sibling; an unweighted seeded roll picks one at render, so each stands alone. Never trim: a face that fails stays in the annex as a refusal row with its measurement.
- **The ceiling, not the middle** (§21.1–21.4). Density and idiom that reward the reader are part of the ceiling; "unclear" is not a finding unless a law is broken; a refinement that makes a lawful line plainer with no law behind the change is the regression.

*End of packet. Marker: Opus 5. Nothing outside this file was written; only `scripts/prose-licence-card.mjs` was executed.*
