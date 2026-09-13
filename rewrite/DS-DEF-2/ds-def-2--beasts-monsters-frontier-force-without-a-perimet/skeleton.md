# SKELETON — DS-DEF-2 · `Beasts & Monsters: frontier, force without a perimeter`

Seat: Opus — MARKER for the REWRITE, working for the Fable chair. This file is the only thing this seat wrote; no dock was entered and nothing but the read-only licence-card script was run. Judged under **ADDENDUM 14**: a claim is SAFE unless the record CONTRADICTS it. "The card does not license it" is not a verdict and does not appear below.

**Variants: 3** — vid 1 `[ledger]`, vid 2 `[visitor]`, vid 3 `[street]`.

---

## 0. THE CARD, THE BRANCH, THE PAGE

**The licence card as printed** (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: frontier, force without a perimeter'`, read-only in `laneRW-DEF2`):

- role **spine** · form **sentence** · move none declared · angle **ledger street visitor** · covert **no** · audience **player (no mark)**
- **reads:** `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL` in `defenseStateProse.js` (absent ⇒ no candidate)
- **predicate:** `beastsRowSituation(...) === 'frontier country, force without a perimeter'`
- **bag:** `{band: RESERVED, route: proper, settlement: proper}` · **FILLED at this block's call sites: `{settlement}` alone**
- relation / attach: none (a spine takes neither) · **echo: spine mounts 1 (defense tab) · modifier mounts 0** — no modifier attaches at this pool today
- ⚠ the card's own warning on the echo key: it is keyed on the WHOLE table-rung reading, so every pool that selects a row of `BEASTS_ROW_POOL` shares one echo key; a mount counted there may be a sibling ROW of the same table, not this one
- **source:** `muster` · standing **LICENSED** — a citation of this holder is licensed where the provenance budget allows. ⚠ see §5 row **CR-9**: the muster kind has exactly ONE holder in the shipped roster, and this pool's key does not guarantee it.
- **may claim:** that the reader selects this row of `BEASTS_ROW_POOL`, as a STANDING fact of the record
- **may NOT (the card's floors):** a magnitude outside the read's own band word; an elapsed course, a dated cause or a season; a prediction the pulse adjudicates; another civic object of the class `wall`
- **REFUSED COLUMNS, always:** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity

**The branch, read for its VALUES** (`defenseStateProse.js:400-451`, and the call site at `:655`). The key resolves when all three hold:

1. `measuredMonsterFamily(settlement.config.monsterThreat) === 'frontier'` — the raw tier must be PRESENT (an absent tier returns `null` and draws nothing; `:312-334`), and normalises through `monsterThreat.js:55-61` (`'medium'` → `'frontier'`).
2. `perimeter === false` — `standingDefenseForces(settlement).walls.present` is false. The walls bucket is the keyword set `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-87`), matched as a substring over `nativeSemanticName`, over the **LIVE** roster (`liveInstitutions`), so a ruined or demoted wall row reads absent here.
3. `force === true` — the call site passes `garrison || militia` (`:655`): at least one live row in the garrison bucket (`garrison · barracks · professional guard · professional city watch · multiple garrison`) **or** the militia bucket (`citizen militia · militia`).

⭐ **The key cannot tell WHICH force it is.** `garrison || militia` collapses a professional body and a part-time citizen body into one boolean. This is the single most load-bearing fact in this packet; four of the findings below descend from it.

⭐ **The silences are the corpus's and are preserved** (`:417-423`): a frontier town with a perimeter and no force draws NOTHING. So this pool's siblings under `frontier` are exactly one — `frontier, credible deterrence`.

**The block's header lines (annex `### DS-DEF-2`, `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`).** STATE-KEY: five fixed rows each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. SLOTS `{settlement}` `{band}` `{route}`. SECTION-TARGET `defense`. PROVENANCE + FENCE: the shape EXTENDS the `buildThreatAssessment` lattice rather than replacing it, because each branch today holds exactly ONE string and every settlement in a branch says the same words; the walls read must ride the predicate and never a presence check on `institutions.walls`; **institution presence is a STANDING fact with no recorded history, and the causal clauses here are CAPABILITY clauses (walls without people cannot be held), never HISTORICAL ones (walls built after a siege)**.

**The register card's six registers, in one line each** (read whole): the **dossier** is the record itself, the clerk's third person, the six shapes of its closed set, the town's name not the default opener — *this is the register that binds here*; the **NPC ladder** is read aloud, role-bound, never a named interior; the **Herald** is the estate's one quoted in-world voice, flattest where hottest; the **chronicle** is a borrowed body of headlines whose own prose is frames and dressings; the **DM page** is candid, second person to the referee alone, grading never hedging; **chrome and the docent** are the product speaking to the person who runs it, mechanics first. Amendments **S2** (a computed consequence of the sentence's own fact may ride as one clause, the joint from the connectives list, never "which", two sentences at most) and **S3** (every fact has a holder; cite one only where a clerk would; the office never cites its own books) bind every face.

**Three composition fences this seat records, not decided here:**

1. **The slot set is fixed per variant** (ARCH §2.5: a face whose `{slot}` set differs from the parent's is refused). Variants 1 and 2 carry `{settlement}`; **variant 3 carries NO slot at all**, so all four of its faces must be written without one. Only `{settlement}` is ever filled at this block's call sites — `{band}` and `{route}` are named in the block's SLOTS and never provided here (`defenseStateProse.js:621`).
2. **The settlement-opener discipline** (MOVE-GRAMMAR §1.4 wall 10; R-DA-17): the settlement token opens at most one variant per pool and never two adjacent. Today vid 1 opens on it and vids 2 and 3 do not. The rewrite keeps that split; faces of vid 2 and vid 3 do not open on `{settlement}`.
3. **The row does not render alone.** All five DS-DEF-2 rows compose into one paragraph list in one bordered box (`DefenseTab.jsx:316-321`), and on every town in this pool's range the `Invasion & War` row beside it is either `force with NO walls` or `militia only` — both of which already say *soldiers / armed citizens, and no line to stand behind*. §9 below treats this as the pool's live craft hazard; §5 treats it as a floor-1 surface.

---
# THE POOL, WHOLE — sections (4), (5), (6) and (9)

*These four are properties of the POOL's key, not of one variant, so they are stated once here in full and cited per variant below. Every variant's own §(4)(5)(9) line names only the slice that variant touches.*

## (4) THE READS THIS POOL REACHES — material, not a bound

The card names ONE read, and it is a composite. What it actually hands a writer:

| the read | what it hands you | its grain |
|---|---|---|
| `measuredMonsterFamily(config.monsterThreat)` = **`frontier`** | the country around the town carries creature pressure at the MIDDLE of three tiers. The engine's own vocabulary is closed at three — `heartland · frontier · plagued` (`monsterThreat.js:28`), `heartland` named "the calm baseline" in the same file, `plagued` printed as "plagued by MONSTER activity" (`SummaryTab.jsx:28`). Frontier is the tier the random pool is weighted toward (3 of 6, `monsterThreat.js:MONSTER_THREAT_RANDOM_POOL`). | a TIER word, never a creature, never a count, never an incident |
| `standingDefenseForces(settlement).walls.present` = **false** | no wall, no palisade, no earthwork, no citadel stands TODAY. Not "never had one" — the read is over the live roster, so a demoted or ruined work reads the same as one never built (`defenseInstitutionBuckets.js:161-176`; `calamityKernel.js` demotes along `City walls → Town walls → Palisade or earthworks`). | a STANDING absence of the whole fortification class |
| `garrison.present \|\| militia.present` = **true** | armed people stand, and they are the town's own. Which body it is, the key does not say. | a STANDING presence of a force, CLASS-BLIND |

Second-order facts the three reads hand you for free, because the branch above them forecloses the alternatives:

- **The perimeter-and-force reading was available and was not taken.** The sibling `frontier, credible deterrence` exists, so this pool's town is on the far side of a fork the record draws itself. The contrast is a real sibling key (R-DA-02 satisfied) and may be written.
- **The frontier-with-a-wall-and-no-force reading does not exist at all** (`defenseStateProse.js:421`). There is no third way for this family.
- **`hasMilitaryInst` is necessarily TRUE here** (`priorityHelpers.js:45` counts `garrison · barracks · guard · watch · citadel · walls · militia · mercenary · navy · charter hall`). So `safetyProfile.js:300`'s "There is no meaningful guard presence" never prints on this town, and per **F1-04** and **§R-5** *"the guard"* is the engine's own word here and is free.
- **`hasGates` is necessarily FALSE here.** Its keyword set is `gates · town walls · city walls · massive walls · palisade` (`priorityHelpers.js:53`), and every member of it also matches the walls bucket (`Gates (if walled)` contains `wall`). So on this pool's towns `safetyProfile.js:463-464` prints the engine's OWN denial — **no gates to bribe and no checkpoints to avoid**. Writing that absence is not tolerated silence; it is the engine agreeing with you out loud.

## (5) ⭐ WHAT WOULD BE FALSE HERE

*The rows of the contradiction table (`rewrite/recut/CONTRADICTION-TABLE.md`) this pool's KEY can actually walk into. Rows that cannot fire on this key are not listed. Each carries the field that denies it.*

### The four that this key makes unusually easy to hit

| # | the claim that would be false | the field / file:line that denies it | which side is the record |
|---|---|---|---|
| **CR-1** | ⭐⭐ **calling the force SOLDIERS, PROFESSIONALS, FULL-TIME, a GARRISON, or men who belong to it** — on the militia half of the range | `inst.hasGarrison` false (`priorityHelpers.js:46`) and the garrison bucket empty (`defenseInstitutionBuckets.js:88-91`); the row's own printed description is the harder denial — `Citizen militia` reads *"Able-bodied residents drill and muster against local threats. Part-time service."* at hamlet (`institutionalCatalog.js:335-341`), *"Organised community defense. Musters for raids and monster incursions."* at village (`:867-873`), *"All able-bodied citizens obligated to defend town. Part-time service."* at town (`:1340-1347`). **F1-02**, and **F1-27**'s principle read onto the militia row | the ROSTER ROW and its printed description |
| **CR-2** | ⭐ **calling the force a MILITIA, armed citizens, townspeople, the able-bodied, or citing a MUSTER ROLL as a record** — on the garrison half of the range | `forces.militia.present` false; **F1-03**. And **F1-24** for the roll: the `muster` holder kind has exactly ONE institution in the shipped roster, the `Citizen militia` (`holderTable.js:279-288`, whose own note reads that a town with a Garrison and no militia has *men under arms and no roll of them*) | the ROSTER ROW / the holder table |
| **CR-3** | ⭐ **a WATCH as a standing body** | `inst.hasWatch` false (`priorityHelpers.js:48`) at hamlet and village, where no watch row exists in the catalogue at all; at town `Town watch` is `required: true` (`institutionalCatalog.js:1348-1351`) and the word is free. **The key cannot see which.** **F1-01**. ⚠ *"keeps watch", "the night is watched", a patrol* are free ANYWHERE by F1-01's own text | the FLAG on this town |
| **CR-4** | ⭐ **a WALL, a circuit, a perimeter, a line around the town, a rampart, a gate, a gatehouse, a wall-walk — asserted** | `forces.walls.present` false; **F1-07**. The card repeats it as *another civic object of the class `wall`* | the ROSTER |

### The rest of the live roster, by floor

| # | the claim that would be false | the field / file:line | note |
|---|---|---|---|
| **CR-5** | a CHARTER HALL, specialist recourse, adventurers on retainer | `forces.charter.present`; `priorityHelpers.js:51`; no charter row at hamlet/village (`institutionalCatalog.js:325`, `:837`). **F1-06** | the key does not read the charter bucket AT ALL — it may be present or absent and neither may be asserted |
| **CR-6** | a MERCENARY company, hired swords, a free company | `forces.mercenary.present`; `defenseInstitutionBuckets.js:98-100`. **F1-05** | same: unread by the key |
| **CR-7** | WARDS, counterspells, a standing arcane capability | the arcane bucket; `defenseGenerator.js:292-331`. **F1-17** | same: unread by the key |
| **CR-8** | the NEGATION direction — *"{settlement} keeps no force worth the name"*, *"nothing organized stands here"*, *"no meaningful guard"* | the same flags read the other way. **F1-25**. The key ASSERTS a force; denying it contradicts the pool's own predicate | the KEY |
| **CR-9** | citing a record to a keeper this town has nobody for — a muster roll with no militia, a toll book with no toll bar | `holderTable.js:243-247`, `:271-366`; `composedWalker.js:1071-1073`. **F1-24**. The record WORDS are free (W24 struck); the CITATION needs the holder | see CR-2 |
| **CR-10** | a body, building or record-keeper the roster does not hold — a granary (**F1-09**), a church or temple standing in the town (**F1-11**), a prison or gaol (**F1-13**), a hall or council room below town tier (**F1-20**), a market (**F1-10**) | `priorityHelpers.js:45-77`, each flag | this key reads NONE of them; a defence face reaching for civic furniture reaches outside its own read |
| **CR-11** | naming the TIER the identity strip does not print, or spelling the band | `{r.tier}` prints verbatim beside the name (`OverviewTab.jsx:247`). **F1-31**. This key fires across four tiers (see §6) | write around it — *a place this size*, *too small for stone*, or the town's own word |
| **CR-12** | naming the country's TERRAIN or APPROACH against the config — a pass, a ford, a cliff, woods, cultivated fields, a harbour | `config.terrainType` / `tradeRouteAccess` print on the overview; `terrainHelpers.js:24`; `geographyData.js`. **F1-102** | ⚠ **the standing temptation of this pool.** "Open frontier" in the shipped text means UNENCLOSED TOWN, not open ground. Keep it that way |
| **CR-13** | reading `frontier` as a totality of danger, or as an incident — a creature kind, an attack that happened, a night they came | there is no creature vocabulary and no incident field anywhere this key reads; **F2-04** (an event the record did not run) and the block's own PROVENANCE fence (*capability clauses, never historical ones*) | the pressure is a TIER, and the tier is a standing condition |
| **CR-14** | ANY magnitude in a digit or a word — a headcount, a share, a handful, a dozen, how many stand, how many ways in | **F2-01**; the engine's band vocabularies are closed | *"more of them than the town can feed"* is the licensed shape |
| **CR-15** | ANY date, season, month, duration or rate — *every season*, *most nights*, *since*, *three winters* | **F2-02** and **F2-06** (nothing bands a rate anywhere in the engine; the chair withdrew the rate form of its own example) | ⛔ **vid 3 ships one of these.** See §V3 |
| **CR-16** | an ELAPSED COURSE — the perfect, the durative, the comparative-against-a-past: *has stood*, *still*, *no longer*, *thinner than it was*, *again*, *would not last a winter* | **F2-05**; `ageBands.js`'s `HISTORICIZE_BAND` pin. A birth-time STATE carries no origin stamp and can bear no temporal register | |
| **CR-17** | a FOUNDING or a RAISING — *they never built one*, *the wall was never raised*, *nobody has got round to it* | **F2-03**; `institutionFounding.js`'s own precedent, *ABSENCE IS THE TYPED VALUE*. ⚠ the absence of a wall is a STANDING fact; the STORY of its non-building is an invented history | |
| **CR-18** | CULTURAL FURNITURE the town's own culture profile denies — thatch, hearth-smoke, the churchyard, the market green, snow on the road | `cultureProfiles.js:50-600`, twelve profiles; rendered at `dailyLifeLogic.js:14`. **F3-05**, the chair's amendment to floor 3, *the finding most likely to recur in every block*. The product is SETTING-AGNOSTIC and no defense pool reads the profile | |
| **CR-19** | an unnamed person's act in the SINGULAR office the tier names — the one who keeps the gate, the captain of the guard | `TIER_MANDATORY_ROLES` emits exactly ONE Guard Captain per village-plus, each with a generated personality, disposition and secret (`npcGenerator.js:1511-1537`, `:117-149`). **F3-06** | ⭐ an UNNAMED person otherwise acts freely (W22 struck by ADDENDUM 14): a scout, a quarter-master, an officer, a bystander, a plural, a trade |
| **CR-20** | a ROTTING, WEATHERING or ERODING work — **and equally, the PERMANENCE of any institution row** | **F4-01** as re-cut: no material decay clock exists, AND no face asserts that anything stands for good (`calamityKernel.js:96-151`, `:259-275` demote and ruin) | mostly moot here (no work stands) but reaches *"the men will always be there"* |
| **CR-21** | SPLITTING the purses, or a total collapse of pay — the men flush while nothing else is; nothing paid in a year; an emptied town | ONE multiplier over garrison wages and wall maintenance together (`defenseGenerator.js:182`, `:189-192`); every gate has a FLOOR and the community baseline is exempt (`:186-192`). **F4-02**, **F4-03**, **F4-04** | ⭐ **men drifting off slowly IS the model's own word** (`:186-187`, *unpaid soldiers desert slowly*) — §R-9 struck the old bar. Slow thinning is licensed; a headcount is CR-14 |
| **CR-22** | explaining the readiness BADGE by the works, or outrunning it | `defenseGenerator.js:487-522`, `:510` — `readiness = avgScore + tierBonus − threatPenalty`, and `:491` gives +12 for being cheap to defend. **F4-06**, **F1-40** | ⚠ the badge beside this very row is `scoreBand(scores.monster)` (`DefenseTab.jsx:323-325`, `:180-184`), a CONTINUOUS score fed by the magic bonus, the divine and druidic traditions and a community baseline (`defenseGenerator.js:215-227`). It can read ADEQUATE or STRONG on a town with no perimeter. **§1.6 W-10 rules this an INSTRUMENT row: no intensity word is refutable until the card prints the band spread over the key's domain.** Write at the KEY's grain (a force, no line) and the collision cannot arise |
| **CR-23** | the river or the coast doing nothing for the town's defence | `defenseGenerator.js:129-135` — riverside and coastal carry a small POSITIVE multiplier. **F4-07** | |
| **CR-24** | a clause that NEGATES or argues against what the `{settlement}` fill's own words assert | **F1-117**/**F1-118**: a `proper` slot carries neither class nor visibility | thin here (the fill is a place name) but the wall stands |
| **CR-25** | ⚠ contradicting the SIBLING ROW printed in the same box — `Invasion & War: force with NO walls` (*"keeps a professional force and no perimeter"*) or `Invasion & War: militia only` (*"can put armed citizens on their own ground"*) | **F1-107** / **§R-12**: the unit of floor 1 is the DOSSIER, not the tab; these compose into one paragraph list (`DefenseTab.jsx:316-321`) | ⭐ note the sibling's own hedge: it prints BOTH a professional reading and a citizen reading on two different keys, because `invasionRowPoolKey` DOES split what ours collapses. On any given town the sibling has already named the body correctly — which is precisely why this row must not name it at all |

### THE CLOSED ROSTERS THIS POOL TOUCHES

A body the roster does not carry may not be asserted. Four closed sets reach this key:

1. **The seven defence buckets** (`DEFENSE_BUCKET_KEYWORDS`, `defenseInstitutionBuckets.js:83-108`): `walls · garrison · militia · watch · mercenary · charter · magicDef`. **The key reads exactly two and a half of them** — walls (must be empty), garrison and militia (at least one non-empty). **Watch, mercenary, charter and magicDef are entirely unread: neither their presence nor their absence may be asserted.**
2. **The institution flags** (`priorityHelpers.js:45-77`), the estate's one grep. `hasMilitaryInst` is forced TRUE here; `hasGates` is forced FALSE; every other flag is free to be either.
3. **The monster tiers** (`MONSTER_THREAT_TIERS`, `monsterThreat.js`): exactly three — `heartland · frontier · plagued`. `embattled` was a dead display arm and the vocabulary walker forbids it. A fourth intensity word for the country does not exist.
4. **The holder kinds** (`HOLDER_RECORDS`, `holderTable.js:271-366`). This card's licensed source is `muster`, whose only roster-backed holder is the `Citizen militia` (`:279-288`). See CR-2 / CR-9.

### THE FAITH AXES

**Not applicable.** This is a defence pool; it reads no deity, no pantheon and no creed. The deity's four axes, `deityTemper()`, the PANTHEON rank against the SETTLEMENT standing, and the suppressed flag are all out of this pool's reach, and floor 3's F3-02 binds only as the general bar on predicating anything of a god — which nothing here would reach for.

## (6) THE PREIMAGE — the range of towns this key selects

**Three booleans and one closed tier word, so the key fires across nearly the whole product.** A face must contradict no state in this range, not merely a convenient town.

- **TIER.** Ordinarily **hamlet · village · town · metropolis**. Not thorp: the only defence row at thorp is `Household levy` (`institutionalCatalog.js:99`), which matches neither bucket, so `force` is false and the pool is silent (see also §1.6 **W-02**, which files that as WIRING). Not city by the ordinary path: `City walls and gates` is `required: true` at city (`:1910-1911`), so a generated city has a perimeter — this pool reaches a city only where that row has been **demoted or ruined** by a world run, which the desk's live read honestly sees. Metropolis IS in range: `Massive walls and fortifications` is `required: false` there (`:2347-2350`) while `Multiple garrisons` sits in the garrison bucket. Custom content can seat anything at any tier (**F1-30**; **§R-6**: the test is the FLAG on THIS town, never the tier).
- **WHICH BODY.** At hamlet and village the force can only be the `Citizen militia` — no garrison or barracks row exists below town. At town it is most often `Barracks` (`:1363-1368`, `baseChance: 0.3`), because `Town watch` is `required: true` and shares `exclusiveGroup: 'civilianDefense'` with the militia, which is seated *"only when no professional watch exists"*. At metropolis it is `Multiple garrisons`. ⭐ **So the body genuinely swings from part-time villagers to multiple standing garrisons inside one pool key.**
- **WHETHER A WATCH ALSO STANDS.** False at hamlet and village (no row); true at town (`Town watch`, required). Unread by the key. See CR-3.
- **COUNTRY.** Every terrain, every route-access value, every culture profile, every population inside those tiers. The key reads none of them.
- **STRESS AND WAR.** Unread and unconstrained: the town may be besieged, occupied, famine-struck, insurgent, quarantined or entirely quiet. A face asserting calm or crisis on this key speaks past its own read and into a surface that prints its own words beside it.
- **PAY.** `economicGates.military` is unread by this key but its funding note prints directly beneath this very row when a gate is short (`DefenseTab.jsx:189-191`, `:343`). A face that fixes the force's pay state in either direction is betting on a field it cannot see.
- **THE BADGE.** `scoreBand(scores.monster)` prints beside the row and can land anywhere in its range. See CR-22.

**What every town in the range shares, and therefore what a face may rest its whole weight on:** creature pressure at the middle tier; no fortification of any kind standing; armed people of the town's own who are not nothing; and no gate and no checkpoint, which the engine says out loud on the same page.

## (9) ⭐ WHERE THE FLAVOUR IS

*The shipped three rows are an argument in three restatements: reactive defence, no wall, a cost. They name almost nothing a person would see. The record is silent about far more than it denies, and this is what that silence holds.*

**a) The militia row's own verbs are unused and they are free.** `drill`, `muster`, `able-bodied`, `obligated`, `part-time`, *musters for raids and incursions* — these are the printed description of the row the town actually holds (`institutionalCatalog.js:338`, `:870`, `:1344`), so they are the record's own words, not the writer's invention. The shipped rows say *armed people* and *soldiers* and stop. What goes unsaid: that the same people have other work to go back to; that an obligation falling on everyone able-bodied is a fact about who is missing from a field or a bench when it is called; that drilling somewhere is a use of ground. ⚠ bounded by CR-1/CR-2 — this vein is open only in a form that survives BOTH halves of the range, or in a face written so the body's kind is never predicated.

**b) The absence has a shape on the ground, and the engine says so out loud.** `hasGates` is false, and `safetyProfile.js:463-464` prints **no gates to bribe and no checkpoints to avoid** on the same dossier. So: nothing closes at nightfall; there is no place where a stranger is stopped, asked, counted or turned away; the town's edge is wherever the last building is, and it is different on each road. What a stranger would notice is not the missing wall — it is that nobody stopped him, and that nobody found this remarkable. None of the three shipped rows uses this, and it is the single most concrete thing the state hands a writer.

**c) The direction problem is physical, not rhetorical.** The branch this pool replaces says it in the engine's own voice: *Attackers choose the point of engagement* and *Creatures can approach from any direction* (`threatAssessment.js:88-90`, `:74`). The shipped rows abstract that into "reactive". What it is on the ground: a force that can be in one place at a time and a town with more than one way into it; a decision, taken by somebody in the dark, about which way to go; outlying houses that are on the wrong side of nothing; the question of who is defended first, which in a town with a wall is not a question at all. ⚠ CR-14 bars counting the ways in; the claim is about SHAPE, never number.

**d) What someone would complain about.** The complaint writes itself from the state and is nowhere in the shipped text: the people who stand are the people who are needed elsewhere while they stand; the centre is where the force forms and the edge is where it is not; and the town is holding one argument it has not settled, which is whether armed men are the answer to a country like this one or merely the cheaper half of it. ⭐ this is also the pool's best candidate for the register card's *one matter left standing open*.

**e) The unnamed person is available now, and nobody used one.** ADDENDUM 14 relaxed the person bar by name: a scout, a quarter-master, an officer, a carter who brings word, a bystander who is told the wrong thing, a plural of any trade — all may appear, act, refuse, be avoided, be resented. The only bars are CR-19 (not the singular office the tier names) and floor 3 (no NAMED person's fate). Three rows of pure institutional abstraction where a person was free the whole time is the flavour failure this section exists to name.

**f) What the absence is NOT.** It is not a ruin, not a stump of old work, not a wall they never got round to, not weather (CR-16, CR-17, CR-20, F4-01). The record holds a standing absence of a class of thing and no story whatever about it. **The licensed sharpening of an absence is a present consequence, never a past**: not *they never built one*, but *there is nothing here that has to be opened in the morning*.

---
# §V1 · VARIANT 1

**(1) Number and angle tag:** vid **1** · `[ledger]`

**(2) Shipped, verbatim:**
> {settlement} keeps armed people on an open frontier, which means the defense is reactive: whatever comes chooses where the fighting happens, and the town arrives afterwards.

**(3) Every claim it makes, one per line, on the new test:**

- {settlement} keeps armed people — **SAFE.** The force read. ⭐ *armed people* is deliberately bucket-agnostic and is the one phrase in the pool that survives BOTH halves of the range (CR-1, CR-2). The best thing in the shipped rows.
- the town's frontier is **open**, i.e. unenclosed — **SAFE.** `walls.present` false. Reads as *no perimeter*, not as *flat country*; if a face lets it slide toward terrain it becomes CR-12.
- the country is a **frontier** — **SAFE.** The tier word is the engine's own, one of exactly three.
- the defence is **reactive** — **SAFE**, and strongly so: it is the engine's own word for this exact branch (`threatAssessment.js:88-89`, *"Defense is reactive."*). ⚠ craft note, not a finding: lifting an engine string verbatim is the one thing the block's PROVENANCE fence says this corpus exists to replace (*each branch currently holds exactly ONE string, so every settlement in a given branch says the same words*).
- whatever comes **chooses where the fighting happens** — **SAFE.** The engine's own (`:89-90`, *"Attackers choose the point of engagement."*). ⭐ note the discipline: *whatever comes* names no creature, which is correct — no creature vocabulary exists anywhere this key reads (CR-13).
- the town **arrives afterwards** — **SAFE.** A standing disposition, not an elapsed course; nothing in the record models a response time in either direction. Silence is permission.
- **FORM (not a claim tag).** *which means* is a which-clause, refused outright by the register card and by the annex's connective contract (`ARCH §2.5`: no `which` in the connectives leaf). It is also the sentence's only joint and it is doing summary work — the gloss the record never performs. Both of the sentence's halves are licensed; the seam between them is not.
- **FORM.** The unit is one sentence carrying four moves through a colon and two commas. S2 licenses ONE joint on a computed consequence; this is three.

**(4) The reads this variant touches:** all three, and it is the only shipped variant that states the tier word outright. See the pool table above.

**(5) The rows it can walk into:** CR-12 (if *open* drifts to terrain), CR-13 (if *whatever comes* acquires a kind), CR-16 (if *arrives afterwards* acquires a tense), CR-22 (if *reactive* is escalated into a verdict on the town's readiness).

**(6) Preimage:** clean across the whole range as written — nothing here predicates the body's kind, the tier, a watch, or pay. **This is the variant that already obeys the preimage, and the rewrite must not lose that by sharpening it into a garrison or a militia.**

**(7) The angle's stance — `[ledger]`:** the compiled record's own view: what the books, rolls and counts show, set down in the order a clerk sets things down, landing on the civic thing the fact names and stopping there. Here that is the force, the missing works, and the consequence the arrangement has as a standing fact. It may weigh two facts against each other because the record holds both. It may cite a holder at most once and only for an S3 reason (two accounts that disagree; a count from an interested party; a keeper who is a power) — **none of the three is present at this key**, so the recommended citation count is zero, and per CR-9 the one licensed holder may not even resolve on half the range. It may NOT gloss, sum up, or tell the reader what the arrangement means.

**(8) Turns worth keeping, verbatim:**
- ⭐ `keeps armed people` — carry this into at least one face unchanged. It is the pool's only class-blind name for the force and the whole preimage rests on it.
- `on an open frontier` — compact, lawful, and does two reads in four words.
- `whatever comes` — the correct evasion of a creature vocabulary the record does not have.
- `the town arrives afterwards` — lawful, and the sharpest clause in the pool. ⚠ it is also the clause nearest to being a story; keep it as a standing disposition.
- **Not kept:** `which means` (form); `the defense is reactive` as a lifted engine string (keep the fact, not the phrasing).

**(9) Flavour for this variant specifically:** the ledger stance is the one that may say plainly what the arrangement costs the town as a STANDING fact, and §9(d) is its material — the people who stand are the people who are needed elsewhere while they stand. It is also the stance that may state the fork the record itself draws (the sibling key `frontier, credible deterrence` exists, so the alternative is a real sibling and R-DA-02 is satisfied).

---

# §V2 · VARIANT 2

**(1) Number and angle tag:** vid **2** · `[visitor]`

**(2) Shipped, verbatim:**
> A stranger finds soldiers at {settlement} and no wall for them to stand on, and can see how that would go against anything that arrived in more than one place.

**(3) Every claim it makes, one per line, on the new test:**

- a stranger comes to the town and looks at it — **SAFE.** W27's stance rules are struck; a stranger may act, be turned away, be told the wrong thing, pay twice.
- ⛔ **the armed people are SOLDIERS** — **CONTRADICTED** on the militia half of this pool's range. `inst.hasGarrison` false (`priorityHelpers.js:46`); the garrison bucket empty (`defenseInstitutionBuckets.js:88-91`); and the harder denial is the row's own printed description, which the reader sees on the same tab: `Citizen militia` is *"Able-bodied residents drill and muster… Part-time service."* (`institutionalCatalog.js:335-341`), *"Organised community defense."* (`:867-873`), *"All able-bodied citizens obligated to defend town. Part-time service."* (`:1340-1347`). **The ROSTER ROW is the record.** (CR-1; F1-02, F1-27's principle.) ⭐ **This is the pool's one hard finding, and it is structural rather than careless: the key collapses `garrison || militia` into one boolean, so ANY face that names the body's kind is false on half its own range.**
- no wall stands for them to stand on — **SAFE.** `walls.present` false; and F1-25's negation bar does not bite, because the roster prints no wall to deny.
- a stranger **can see** this — **SAFE.** An observable of the two facts already stated; no interior, no belief, no verdict.
- an attack **arriving in more than one place** would go badly for the town — **SAFE.** Subjunctive, so state-never-fate holds; and it is the engine's own reading of this branch (`threatAssessment.js:90`, *exposed to anything coordinated*). ⚠ *more than one place* sits one word away from CR-14: it is a claim about the SHAPE of a hypothetical, not a magnitude of any field, and it stays safe only while it stays hypothetical and uncounted.
- ⚠ **PAGE-GRAIN, not a claim:** this sentence is a near-twin of the `Invasion & War` row printed two paragraphs below it on every town in this range — *"A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen."* Same stance, same stranger, same two nouns, same subjunctive close. **CR-25 / F1-107 / §R-12.** It is not a contradiction; it is the pool's worst craft fault and the rewrite's clearest target.

**(4) The reads this variant touches:** the perimeter read and the force read, both stated; the tier word is absent from this variant entirely (the frontier is implied by *anything that arrived*, not stated).

**(5) The rows it can walk into:** **CR-1 (it walks into it as shipped)**, CR-25 (it walks into that too), CR-14 (*more than one place*), CR-19 (if the stranger's counterpart becomes the one who keeps the gate).

**(6) Preimage:** ⛔ **this variant is false on the hamlet/village half of its own range as written**, and on any town tier where the seated body is the militia. A face here must name the force in a way that is true of a part-time citizen body AND of multiple standing garrisons, or must not name its kind at all.

**(7) The angle's stance — `[visitor]`:** what a person arriving from outside meets and can tell without being told, set down in the record's third person and never in the stranger's interior. The visitor may act, be stopped or not stopped, be answered or not answered, and may draw the inference any arriving person would draw from what is in front of him. He may NOT carry a named identity, a fate, a feeling assigned to him, or knowledge of a field he could not see from the road. ⭐ his privileged material at this key is §9(b): he is the one who notices that nothing stopped him.

**(8) Turns worth keeping, verbatim:**
- `no wall for them to stand on` — lawful and physical. ⚠ but the sibling row one paragraph below says *no line for them to stand behind*; at most ONE face may keep this shape, and it would be better spent elsewhere.
- `can see how that would go` — the correct subjunctive register for an edge.
- **Not kept:** `soldiers` (CR-1, the finding); `A stranger finds… at {settlement}` as an opening formula, since the sibling row opens *A stranger sees… at {settlement}* on the same page; `in more than one place` if any face lets it harden into a count.

**(9) Flavour for this variant specifically:** §9(b) belongs to this angle and is entirely unused — the engine prints *no gates to bribe and no checkpoints to avoid* (`safetyProfile.js:463-464`) on this very dossier, so the visitor face may write the thing a stranger actually experiences: that he walked in, and that nobody stopped, asked, counted or turned him, and that nobody local thought this worth remarking on. That is a licensed observation with the engine's own denial standing behind it, it is not the sibling row's sentence, and it puts a person in front of the reader instead of an argument.

---
# §V3 · VARIANT 3

**(1) Number and angle tag:** vid **3** · `[street]`

**(2) Shipped, verbatim:**
> The town can answer trouble and cannot prevent it, and the difference costs it something every season.

**(3) Every claim it makes, one per line, on the new test:**

- the town can answer trouble — **SAFE.** The force read; and *answer* is class-blind, so it survives the whole preimage.
- the town cannot prevent trouble — **SAFE.** The perimeter read, and the engine's own reading of this branch (an attacker chooses the point of engagement). ⚠ it is a capability clause, which is exactly what the block's PROVENANCE fence licenses (*walls without people cannot be held*) and it stays on the right side of that fence as long as it is not turned into an incident.
- the difference between answering and preventing costs the town something — **SAFE in substance.** No purse is split and no magnitude is named, so F4-02/F4-03 do not fire and CR-14 does not fire. Nothing in the record denies that an unenclosed arrangement costs the town; the cost is left unpriced, which is the licensed form.
- ⛔ **the cost falls EVERY SEASON** — **FLOOR-2.** Two floors at once: **F2-02** (*ANY date, year, season, month or duration*) names the season by itself, and **F2-06** (*A RATE*) names the recurrence — *"nothing bands a rate anywhere in the engine"*, and the chair explicitly withdrew the rate form of its own worked example. There is no clock on this dossier that turns, and a birth-time state carries no origin stamp to count from (`ageBands.js`, `HISTORICIZE_BAND = 'years-past'`). **The record is the pin; the face is wrong.**
- **FORM.** The variant carries **no slot at all.** Per ARCH §2.5 every one of its four faces must also carry none — a face that reaches for `{settlement}` here is refused by the projector before any refuter reads it.
- **FORM.** Two balanced clauses on one `and`, then a third clause on a second `and`. The register card's *a qualification is a sentence, never a tail* reads the third clause as a tail; S2 would license it only as a computed consequence of the sentence's own fact on ONE joint, and this unit already spent its joint.

**(4) The reads this variant touches:** the force read and the perimeter read, both as capabilities. The tier word is absent; *trouble* stands in for it, which is lawful (no creature vocabulary exists) but also the vaguest word in the pool.

**(5) The rows it can walk into:** **CR-15 (it walks into it as shipped — the season and the rate)**, CR-21 (if *costs it something* acquires a purse or a payer), CR-16 (if the cost acquires a trend), CR-14 (if it acquires a size).

**(6) Preimage:** clean across the range apart from the season. Nothing here predicates the body, the tier, a watch, terrain or pay. **Its failure is temporal, not referential** — the opposite of vid 2's, which is worth saying plainly to the writer: this pool's two faults are one of each kind, and a rewrite that cures only the obvious one leaves half the pool broken.

**(7) The angle's stance — `[street]`:** the town's own understanding of its own arrangement, in the record's third person and never in a townsman's interior. It may state what the town takes for granted, what it does not pretend, what it is used to and what it has not settled — and it holds the register card's licence to leave one matter standing open. It may NOT quantify over persons (*nobody in the town thinks…*, *everyone here knows…* — a totality over persons is a REFUSED COLUMN on the card, always), may not report a belief as a fact about minds, and may not close on a maxim, a moral or an epigram.

**(8) Turns worth keeping, verbatim:**
- ⭐ `can answer trouble and cannot prevent it` — the pool's thesis in seven words, class-blind, tense-free and true of every town in the range. The single most reusable clause the shipped pool holds; carry it into a face intact.
- `the difference` — lawful as the subject of a cost, and a genuinely good compression.
- **Not kept:** `every season` (CR-15, the finding); `costs it something` if it stays this vague across all four faces, since an unpriced cost repeated four ways is the DULL verdict at the pool grain.

**(9) Flavour for this variant specifically:** the street stance owns §9(c) and §9(d) — the decision about which way to go, taken by somebody, in the dark; the outlying houses on the wrong side of nothing; who is defended first, which in a walled town is not a question and here is; and the argument the town has not settled about whether armed people are the answer to a country like this one or the cheaper half of one. It also owns the plural unnamed person (§9(e)), which no row in this pool uses and which ADDENDUM 14 freed by name.

---

# §X · WHAT THE REWRITE OWES, IN ONE PLACE

1. **Twelve faces** — four per variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling; never trim; every face stands alone under an unweighted seeded roll.
2. **Two shipped claims are wrong and must not survive in any face:** `soldiers` (vid 2, CR-1, contradicted on half the range) and `every season` (vid 3, CR-15, floor 2 twice over).
3. **The class-blind rule is this pool's whole discipline.** `garrison || militia` is one boolean over a part-time citizen body and multiple standing garrisons. No face may predicate the body's kind. The safe register is what the shipped rows already found once: *armed people*, *can answer*, *the town's own*.
4. **Slot sets are fixed:** vid 1 and vid 2 carry `{settlement}`, vid 3 carries none. Only `{settlement}` is ever filled at this block's call sites. At most one variant's faces open on the settlement token, and today that is vid 1.
5. **Do not re-use the sibling's sentence.** `Invasion & War` prints *a stranger, soldiers, no line to stand behind* two paragraphs below on every town in this range. The visitor face must find its own observation, and §9(b) is sitting unused.
6. **The flavour brief in one line:** three rows of institutional abstraction where the record left a stranger nobody stopped, a gate that does not exist to be closed, a militia that drills and then goes back to work, a decision taken in the dark about which way to ride, and an argument the town has not settled. The record is silent about all of it, and silence is permission.
