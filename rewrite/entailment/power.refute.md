# ENTAILMENT REFUTATION — THE POWER DESK (DS-POW-1 … DS-POW-7)

Refuter's packet for the Fable chair, against `power.survey.md`. Seat: Fable 5.1. Read-only against
the dock `laneRW-DEFW` at `f2da5a3ee`. No vitest, no build, no write into the dock. Two print-only
node probes were run from the session scratchpad (`lens-probe.mjs`, which calls
`inferFactionCategory` and `rulingPowerFromArchetype` on the 52 roster labels; `dump-power-corpus.mjs`,
which prints all 256 variants). Every `file:line` is dock-relative.

Verdict vocabulary: **HOLDS** (true for every member and consistent with the engine) ·
**CONDITIONAL** (true only for named members or only where a named field resolves; the condition is
stated) · **REFUTED** (false for some member, or asserts more than the simulation holds; the code is
quoted). Default under uncertainty is CONDITIONAL or REFUTED, per the chair's instruction.

Headline: of the surveyor's 20 rows, the ENTAILS column survives intact on 7 (E-2, E-5, E-6, E-11,
E-12, E-13, E-17). Ten are CONDITIONAL on a field or a lifecycle the face cannot see. Three carry an
item that is REFUTED outright (E-8 `commerce`, E-8 `survival`, E-9 "sorted top-first"), and the
surveyor's E-16 defect (b) is worse than written: the ruling-power word puts `Royal Authority`,
`Noble Governorship` and `Ducal Governorship` under `council` and `Military Council` under `autocrat`.
Fifteen traps the surveyor missed are added in §3, and §4 lists twenty-one nouns the corpus puts on a
page that no row of the survey covers.

---

## §1 VERDICTS, ROW BY ROW

### E-1 · `{seat}` — the governing body's name

| # | ENTAILS item (surveyor) | Verdict | Evidence |
|---|---|---|---|
| 1a | *Council / Consensus / Assembly / Senate / Consortium* → "a body, more than one person decides" | **CONDITIONAL** | True as English for the 22 `governanceLabelMap` rows (`rulingStructure.js:161-176`) and their glosses. But the DS-POW-5 lens word for the same town can say the opposite: `Military Council` → category `military` → `autocrat` ("One person decides", corpus v1), and `Royal Authority` → category `government` → `council` ("a body rather than a person"). Probe output over all 52 labels is in §2. The two entailments (the name's and the lens's) are drawn on one page at one town. |
| 1b | *Elected Reeve* entails election | **HOLDS** | Gloss at `:366` is attached to the record as `desc` because `village reeve` is a `govBody` key (`:164`, `:440`). |
| 1c | *Feudal Appointee* entails delegation, revocable | **HOLDS** | `:369-370`, `govBody` key `lord's appointee` `:166`. |
| 1d | *Merchant oligarchy* entails office bought | **HOLDS** | `:415-416`, key `merchant oligarchy` `:172`. |
| 1e | "these are the label's own authored gloss, i.e. the engine's model of what the word means" | **CONDITIONAL** — birth only, and only for `govBody`-matched labels | (i) The gloss reaches the record as `desc` via `govDescByLabel[govBody] \|\| govDescByFaction[governingFaction] \|\| govDescByFaction['Mixed Council']` (`:440`). On the FALLBACK path `govBody` is null, so a label absent from `govDescByFaction` (`:424-439`) carries the **Mixed Council** gloss: "Power is distributed across multiple factions without a clear dominant authority". That is the persisted `desc` for `Headman's Authority`, `Priestly Guidance`, `Town Mayor`, `Grand Military Council`, `High Theocratic Council`, `Grand Merchant Senate`, `Shadow Senate`, `Arcane Senate`, `Military City Council`, `Ecclesiastical Council`, `Merchant City Council`, `Corrupt City Council`, `Corrupt Council` when minted on the fallback ladders (`:255-338`). A reader treating `desc` as the definition asserts the opposite of the label. (ii) After a play-time transfer `governingName` is a label from `GOVERNMENT_PREFERENCES` / `ALT_GOVERNMENT_LABELS` — `Noble Regency`, `Garrison Command`, `Martial Administration`, or `<label> Ascendant` (`rulingPower.js:180-187`, `:214-217`, `:433-449`, written at `:657-658`). None of those is in the surveyor's name class. |
| 1f | ENGINE-CONTRADICTS (a) Democratic assembly vs coup field | **HOLDS** as a finding | `rulingStructure.js:418-419`; `coupContenders` never reads the label (`rulingPowerCoup.js:81-106`). |

### E-2 · "the hall"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 2a | entails nothing about a building | **HOLDS** | No producer; `powerStateProse.js:862-876`. `hasCourtSystem` matches `town hall`/`city hall` (`priorityHelpers.js:55`) and the `office` holder kind is instantiated by `Town hall`/`City hall`/`City administration` (`holderTable.js:357-366`), and nothing joins either to the corpus word. |
| 2b | ENGINE-CONTRADICTS: thorp/hamlet consensus rows | **HOLDS** | `institutionServices.js:1448-1453`; `rulingStructure.js:162-163`. |

### E-3 · "the watch"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 3a | Town watch / Professional city watch → "keeps watch and takes crime reports" | **CONDITIONAL** — per row | `Town watch` services are `Night patrol`, `Gate duty`, `Crime response` (`institutionServices.js:1322-1326`); `Professional city watch` are `Law enforcement`, `Crime reporting`, `Missing persons`, `Escort service` (`:1206-1211`). "Takes crime reports" (`Crime reporting`) is the PROFESSIONAL row only; the Town watch row RESPONDS but does not record. A "crime returns" or "reports" face follows the row. |
| 3b | the two corpus watch assertions read no watch row | **HOLDS** | Census reads for `Endorsed`: none (WIRING-UNRESOLVED); for `capture pressure RECOVERING`: `breakdown.*`, `power.criminalCaptureState`. |
| — | ADDED: the corpus asserts a watch in THREE more places the surveyor did not list | see §4 | DS-POW-2 `siege matched` v2 "the watch rota"; DS-POW-6 `neutral baseline` v1 "not the watch, not the walls"; DS-POW-6 `stolen goods market` v2 "the part the watch has never reached". |

### E-4 · "the rolls / the clerks / the record"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 4a | a record exists only where an office-kind institution does | **HOLDS** | `holderTable.js:357-366`. |
| 4b | "small tiers have no office-kind institution" | **PLAUSIBLE, not verified** | The surveyor cites no tier table for `Town hall`; I did not find one in the files read. Treat the tier claim as unproven; the three-standing law (`holderTable.js:36-45`) makes the point without it. |

### E-5 · "the court"

| 5a | two disjoint senses; political sense entails nothing | **HOLDS** | `holderTable.js:325-333`; `wiringCensus.js:1311`; census `objectClass: law` on the DS-POW-7 consolidation key (printed). |

### E-6 · "a bloc / the combination"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 6a | at least two members | **HOLDS** | `MIN_BLOC_MEMBERS: 2` `settlementPolitics.js:96`; a bloc that drops below it fractures `:882-885`. |
| 6b | a primary glue and an end | **HOLDS** | `Bloc` typedef `:64-67`; written `:952-970`. |
| 6c | at most three | **HOLDS** | `:93`, the cap deferral `:985`. |
| 6d | 8-tick dwell before a non-triggering dissolution | **HOLDS** | `:120`; every non-triggering path tests `age >= T.MIN_DWELL_TICKS` (`:803`, `:848`, `:854`, `:864`). Exposure (`:810-820`) and discovery are triggering and are not dwelled, as the surveyor said. |
| 6e | ENGINE-CONTRADICTS: consolidation 0 is not a measured division | **HOLDS** | `:581`, `:604-607`. |
| — | ADDED: "a working majority" | **REFUTED** as an entailment of a ruling bloc | `RULING_CONSOLIDATION_FLOOR: 0.4` (`:149`); `rulingBlocOf` returns at `share >= 0.4` (`:588-590`). A ruling bloc is a 40% plurality. The corpus says "A working majority sits at {settlement}" (`a RULING bloc, consolidated` v1) and the ENGINE'S OWN concession detail says "traded for a working majority" (`:454`). Both overstate the model; lifting the detail string verbatim carries the overstatement. |

### E-7 · the glue words

| Glue | Item | Verdict | Evidence |
|---|---|---|---|
| `patronage` | PEOPLE-HELD; dies at succession | **CONDITIONAL** — dies at a succession **past the dwell** | `peopleHeld: true` `:447-450`; the fracture requires `peopleHeld && succession && age >= T.MIN_DWELL_TICKS` (`:803`). A leader change inside the first 8 ticks does not end it. Also `succession` is detected only when a PRIOR leader id was recorded (`was != null`, `:800`). The corpus v3 "will die with its bearers' tenure" is true in the limit, not "the moment either changes" (v1). |
| `concession` | SEAT-HELD; outbiddable; survives leader changes | **HOLDS** | `:452-455`; outbid market `:858-889` gated on `age >= dwell` and `memberViews.length >= 2`. |
| `doctrine` | ≥2 members with archetype religious OR arcane | **HOLDS** | `:443-446`. The archetype is `factionStates[].archetype` (`:249`), i.e. the canonical archetype, under which `magic`-category rosters read `arcane` (`factionArchetypes.js:58`). Arcane conflation stands. |
| `threat` | "an EXTERNAL danger is live" | **REFUTED** as "external" | `settlementUnderThreat` (`:510-528`) is true for a besieging war front INTO the town (`:513`) **or** the town's OWN war posture at `war_preparation` / `mobilized` / `deployed` (`:516-518`; `mobilization.js:117-121`), **or** any of six tolerant snapshot fields (`:521-527`). A town whose army is deployed on its own campaign abroad forms a `threat` bloc with the detail "a common danger at the walls". The danger is not external and there need be no wall. |
| `compromise` | a seat-holder carries a corruption leash | **CONDITIONAL** — leash OR a bare corrupt flag | `corrupt = st.corruption === true \|\| st.corrupt === true \|\| Object.keys(leash).length > 0` (`:428`). A corrupt leader with no leash object fires the glue whose detail says "carries a corruption leash". |

### E-8 · the end words

| End | Item | Verdict | Evidence |
|---|---|---|---|
| `seats` | lead archetype noble/military/government/civic, or a lead-leader goal in {secure_office, seek_promotion, consolidate_power} | **HOLDS** | `ARCHETYPE_END` `:461-466`, `GOAL_END_HINT` `:469-473`, `deriveEnd` `:484-496`. Note the goal hint is read on the LEAD member's leader only (`:487-492`) and overrides the archetype. |
| `commerce` | archetype merchant/craft/labor, or goal in {profit_from_change, accumulate_wealth, expand_trade} | **REFUTED** | `return base \|\| 'commerce'` (`:495`): `commerce` is also the FAIL-SOFT for a lead member whose archetype has no `ARCHETYPE_END` row — `other`, or any unrecognised string. A bloc led by an `other`-archetype faction (e.g. `Town Mayor`, `Elder Consensus`, `Elected Reeve`, which classify `other`, §2) reads "organized around money" with no merchant in it. |
| `doctrine` | archetype religious/arcane, or goal in {spread_faith, defend_doctrine} | **HOLDS** | `:463`, `:472`. |
| `survival` | "an external threat override, unconditional when underThreat" | **REFUTED** as the only source | `GOAL_END_HINT.break_vassalage = 'survival'` (`:470`): a lead leader with that goal yields `survival` with no threat at all. And the threat itself includes the town's own mobilization (E-7). "Getting the town through" (corpus v1) is asserted of a bloc whose end is a vassal's independence bid or a deployed army's home front. |
| `patron` | archetype criminal OR outsider, or goal serve_patron | **HOLDS** | `:464`, `:473`. |

### E-9 · "the ladder / a rung / standing"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 9a | "an order (the array is sorted top-first)" | **REFUTED** as *sorted by standing* | The rung array is a SEAT order: first-lit from structural importance (`npcLadderKernel.js:677-683`: `rungs = [...keptPrior, ...newOnes.slice(0, room)]` / `eligibleIds.slice(0, cap) // first-lit derivation from structural order`), thereafter changed only by a contest swap (`:828 swapIntoSeat`, `:1181 "The ranks swapped"`). `standing` is a separate per-NPC stock projected onto each rung (`npcLadderState.js:912-921`). Nothing sorts the array by standing, so `standing[0] - standing[1]` can be NEGATIVE while the array still says who holds the top rung. The desk's `<= CROWDED_TOP_GAP` (`powerStateProse.js:610`) folds a negative gap into "crowded top rung", whose prose says "{npc} leads by very little" of an NPC whose standing is below the second's. |
| 9b | standing = stock / STAND_MAX (10) | **HOLDS** | `npcLadderState.js:46`, `:920`. |
| 9c | decays toward baseline, 156-week half-life | **HOLDS** | `:47-51`, `:228-234`. |
| 9d | only office-holders hold a rung (RUNG_ELIGIBLE_FLOOR 0.4) | **HOLDS** | `:57`, `:208-209`. |
| 9e | high instability erodes effective power | **HOLDS** | `ladderRead.js:211-217`; consumed at `rulingPowerCoup.js:93-94`, `:108-109`. |
| 9f | ENGINE-CONTRADICTS (a) depth is a tier cap | **HOLDS** | `RUNG_CAP_BY_TIER` `npcLadderState.js:108-110`; desk cut `SHALLOW_RUNGS_BELOW = 3` `powerStateProse.js:579`. A thorp (cap 1) and a hamlet (cap 2) are always "shallow". |
| 9g | ENGINE-CONTRADICTS (b) first-light gaps: 3 rungs → "long-held order", 4 → "clear top", 5 → "crowded" | **CONDITIONAL** — the 3-rung cell sits ON the boundary | `seedStandingForRung` gives 6.0 / 4.5 / 3.0 for three rungs (`:219-224`), normalised 0.60 / 0.45 / 0.30, gaps exactly 0.15 = `SETTLED_MIN_GAP` (`>=` at `powerStateProse.js:611`). But `FIRST_SIGHT_WEEKS: 1` (`npcLadderState.js:54`) integrates one week of decay at first sight; one week at a 156-week half-life shrinks each gap by ~0.44% to ~0.1493, which fails `>= 0.15` and lands the town in "clear top rung" instead. Whether the seed is decayed before the first mirror is a kernel ordering question I could not settle by reading; either way the SELECTION IS A FUNCTION OF RUNG COUNT ALONE at first light, which is the surveyor's real point and HOLDS. |
| 9h | ENGINE-CONTRADICTS (c) instability 0 when the field is absent | **HOLDS** | `ladderRead.js:138-141`; the mirror omits `instability` when 0 (`npcLadderState.js:927`). |

### E-10 · "a challenger / outweighs / the seat could fall"

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 10a | a rival exists on the roster with the stated relative weight | **CONDITIONAL** — "weight" is coercion × ladder-adjusted power vs. the incumbent's power × govMultiplier | `rulingPowerCoup.js:87-106`, `:108-112`. `Holding` = `amplifiedWeight >= challengers[0].weight` (`:279-281`): the two sides are weighed on DIFFERENT multipliers (coercion on the challenger, legitimacy on the incumbent). "Outweighs" is true in the engine's sense only. |
| 10b | `Critical` entails ungated (amplified weight below the weakest of a FULL field of three) | **HOLDS** | `gated = challengers.length < 3 \|\| amplifiedWeight >= last.weight` (`:111-112`); `coupRiskLabel` `:278`. |
| 10c | ENGINE-CONTRADICTS: `Stable` excludes criminal factions by construction | **HOLDS** | `:102-104`. Add: `governingFactionOf` falls back to a `governingName` match and then null (`rulingPower.js:224-230`); with null, every roster row is a challenger and the incumbent has no name — an edge the pools' `{faction}` fill (governingName) would then also miss. |

### E-11 · the legitimacy band words

| 11a | a score position, 50 + four bounded contributions, clamped | **HOLDS** | `factionDynamics.js:161-166`, bands `:105-118`. |
| 11b | L-1: `governanceFractured` ≡ `score < 30` at all three writers | **HOLDS** | `factionDynamics.js:133`; `timeProgression.js:179`; `rulingPower.js:352`. Desk note `powerStateProse.js:53-62`. |

### E-12 · "the dominant contributor"

| 12a | which of the four signed numbers has the largest magnitude | **HOLDS** | `powerStateProse.js:255-260`. |
| 12b | ENGINE-CONTRADICTS: ranges not commensurable; small-tier artifact | **HOLDS** | `factionDynamics.js:20-27`, `:30-44`, `:51-59`, `:76-81`, `:155-159`. Thorp defense ≤ round(10 × 0.3) = 3; food ≤ 4. |
| — | ADDED: the SAFETY word is fed by non-crime strains | see §3 L-I | `safetyContrib` returns −20 for a label containing `famine` (`:33-34`), −8 for `quarantined` (`:37`), −5 for `controlled` (`:40`). |

### E-13 · "the hold" (govMultiplier)

| 13a | direction and magnitude of legitimacy's effect on coup defence | **HOLDS** | `rulingPowerCoup.js:85`, `:110`. |
| 13b | ENGINE-CONTRADICTS: five bands into three pools | **HOLDS** | `powerStateProse.js:519-524` vs `EngineSections.jsx:208-214`. |

### E-14 · the capture rungs

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 14a | a FACTION-level position on the ladder | **HOLDS** | `corruption.js:474`; `factionCapture.js:136-146`. |
| 14b | `capture` at birth additionally entails crimP > govP×1.5 ∧ crimP ≥ 24 ∧ govP ≥ 15 ∧ safetyRatio < 0.35 | **CONDITIONAL** — birth only, and the face cannot tell birth from play | `factionDynamics.js:243` at birth. At play `advanceCaptureState` steps the ladder per faction (`corruption.js:476-480`) and the settlement value is the ROLLUP of the WORST faction (`factionCapture.js:136-146`; written at `pulseKernel.js:645-648`). Nothing about the birth predicate survives a single step. |
| 14c | ENGINE-CONTRADICTS: AGENT/LEADER is a declared judgment on a faction-level rung | **HOLDS** — and worse | The DS-POW-6 `{faction}` fill is `governingName` (`powerStateProse.js:962`), but the rollup is the max over EVERY faction in the settlement, governing or not. "The person who speaks for {faction} is not free to speak" (LEADER v1) names the SEAT's faction for a capture that may sit on `Military/Guard` or `Merchant Guilds` — the code's own example is "the underworld could capture the City Watch" (`factionCapture.js:150-152`). |

### E-15 · the criminal operation roles

| 15a | the role is what the operation IS, by substring on the name | **HOLDS** as a label definition | `criminalOpRole.js:38-46`; the list is `CRIMINAL_INST_LABELS` canonical names (`safetyProfile.js:610-616`). |
| 15b | ENGINE-CONTRADICTS: first classifiable only; wide fallback | **HOLDS** | `powerStateProse.js:985-987`; the fallback names listed by the surveyor all miss the six substrings. |
| — | ADDED: `duty evasion` v1 "the landing points are unofficial" | **CONDITIONAL** on `hasPort` | `Smuggling network/operation/waypoint` are minted at city, hamlet and town (`institutionDescVariants.js:81`, `:437`, `:797`) with no port gate; `hasPort` is a separate flag (`priorityHelpers.js:62`). "Landing points" asserts water on an inland town. |

### E-16 · the ruling-power words

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 16a | the five authored lens rows (autocrat one decider … criminal leverage) | **CONDITIONAL** — true of the LENS ROW, not of the TOWN the word is drawn for | `RULING_POWER_LENS` `cohesionWeave.js:161-168` is a constant table. What reaches it is `structuralLensOf` → max-power faction's `category` (`:279-286`) → `rulingPowerFromArchetype` (`:194-197`) over `ARCHETYPE_TO_RULING` (`:171-177`). §2 shows the actual joins. |
| 16b | ENGINE-CONTRADICTS (a) max-power, not `isGoverning` | **HOLDS** | `:279-285`. Under `under_siege` the `Military/Guard` row is doubled (`stressFactions.js:13-16`), so a besieged Town Council town can read `autocrat` off its guard. |
| 16c | ENGINE-CONTRADICTS (b) vocabularies do not join; `merchant_league` unreachable | **HOLDS, and understated** | Probe (§2): 21 of 52 labels read `mixed`; **`Royal Authority`, `Noble Governorship`, `Ducal Governorship`, `Feudal Stewardship`, `Headman's Authority` read `council`** because `Authority`/`Governor`/`Steward` are `government` keywords and `government` is tested before `noble` (`factionCategories.js:109-146`, `:151`). `Feudal Appointee` reads `autocrat` (noble). `Military Council` reads `autocrat`. `merchant_league` is unreachable on generated data; reachable only if a custom faction declares `category: 'merchant'` or `'craft'` (the `if (!f.category)` guard at `rulingStructure.js:699-701`). |
| 16d | ENGINE-CONTRADICTS (c) `mixed` is fail-soft dressed as a reading | **HOLDS** | `:196`. |

### E-17 · the economic-base words

| 17a | each base's authored fear/warStyle | **HOLDS** as table rows | `cohesionWeave.js:141-147`. |
| 17b | all five pools DARK by declaration | **HOLDS** | `:258-269`, `:286`; `powerStateProse.js:668-679`. |

### E-18 · the stability words

| 18a | only the token the classifier matched | **HOLDS** | `powerStateProse.js:305-330`. |
| 18b | ENGINE-CONTRADICTS (a) `critical matched` unreachable; (b) the floor absorbs Fractured | **HOLDS** | `:295-302`; `governanceNarrative.js:288-295`. |
| — | ADDED: `recentConflict present` | **REFUTED** for "the losing side is still on the rolls" (v2) and "the quarrel it came through" (v1) | Every birth producer string is an UNRESOLVED present-tense dispute (`governanceNarrative.js:372-487`: "Neither side will back down", "is hearing the case", "has been running for two seasons", `Ongoing tensions with ${neighbour}`). The only resolved form is the transfer's own sentence (`rulingPower.js:672-675`), where under a coup the old house is REMOVED (`:552-565`), so "still on the rolls" is true only under a lawful passage with `demoted` true. `recentConflict present` entails "a recorded dispute exists" and nothing about its outcome. |

### E-19 · the militia / garrison / guard / community

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 19a | each named row entails the institution it matched on | **CONDITIONAL** — substring match | `includesInstitution = names.some(name => name.includes(keyword))` (`governanceNarrative.js:74-75`). `'watch'` matches the roster institution **`Watchtower`** (`institutionServices.js:1561`), so "The watch" is minted on a town whose only "watch" is a masonry tower. `'garrison'` matches `Multiple garrisons`; fine. |
| 19b | `The community` / `The guard` are fallbacks and entail no institution | **HOLDS** as read; **"the guard" is NOT always safe** (see A-4) | `:506`. |
| 19c | first-match precedence, a selection not an inventory | **HOLDS** | `:500-506`. |

### E-20 · "previous government / the cause"

| 20a | a RECORDED cause; lawful passage → defeated house survives demoted | **CONDITIONAL** — demotion only under Register VII | `LAWFUL_PASSAGE_CAUSES` `rulingPower.js:376`; `demotesIncumbent` returns `rollsRegisterVii(config)` and is false on every v1 world (`:400-404`, the docblock's own words). So "survives demoted" is not entailed by the cause word; it is entailed by cause ∧ Register VII. |
| 20b | no generation-time writer; play-only | **HOLDS** | `:629-632`; desk `powerStateProse.js:527-546`. Row shape is `{label, cause, tick}` (`:631`), not the annex's `{government, cause, tick, by}`; `by` is never written; `EngineSections.jsx:277` reads `g.label \|\| g.government`. |

---

## §2 THE LENS PROBE — every roster label through the shipped derivation

`node lens-probe.mjs` (print-only; imports `inferFactionCategory`, `rulingPowerFromArchetype`,
`factionArchetype` from the dock). Columns: the generation-side `category` the roster carries
(`rulingStructure.js:699-701`), the DS-POW-5 word `structuralLensOf` would draw, and the CANONICAL
archetype the coup and politics layers use for the same row.

| Label | category | DS-POW-5 word | canonical archetype |
|---|---|---|---|
| Elder Consensus · Elected Reeve · Town Mayor | other | **mixed** | government / government / other |
| Household Council · Free Elder Council · Elder Council · Grand/City/Town Council · City-State Council · Democratic assembly · Quarantine Council | government | council | government |
| **Royal Authority · Noble Governorship · Ducal Governorship · Feudal Stewardship · Headman's Authority** | government | **council** | government |
| Feudal Appointee · Landed Gentry · Noble Houses · Manor Household | noble | autocrat | noble |
| Military Council · Military City Council · Grand Military Council · War Council · Occupation Authority · Military/Guard | military | autocrat | military |
| Church Council · Ecclesiastical Council · High Theocratic Council · Priestly Guidance · Religious Authorities | religious | theocracy | religious |
| Guild Council · Guild Authority · Grand Guild Council · Grand Guild Consortium · Merchant Guild Council · Merchant Council · Merchant City Council · Grand Merchant Senate · Merchant oligarchy · Grand Merchant Oligarchy · Merchant Guilds (+dominant) · Craft Guilds | economy | **mixed** | merchant |
| Arcane Council · Arcane Senate · Arcane Orders | magic | **mixed** | arcane |
| Corrupt Council · Corrupt City Council · Shadow Senate · Thieves' Guild | criminal | criminal | criminal |

Three consequences for the entailment rule. (1) "Council" ⇒ a body is contradicted on the same page
for every `military`-category council. (2) "Authority" / "Governorship" ⇒ one holder is contradicted
by the `council` word. (3) The canonical archetype (right column) DOES join — the coup field and the
bloc layer classify `Royal Authority` as `government` too, but classify `Merchant Council` as
`merchant` and `Arcane Council` as `arcane`, so a bloc's `doctrine` glue can fire on two arcane rows
while DS-POW-5 calls the same town `mixed`. Two readers, two vocabularies, one page.

---

## §3 TRAPS THE SURVEYOR MISSED

### Label traps (an engine value whose English is not its engine meaning)

| # | Label / value | Engine meaning | file:line |
|---|---|---|---|
| L-A | `Merchant Guilds (dominant)` | The parenthetical is the PROSPERITY flag (`Wealthy`/`Thriving`), and the row's power is then CAPPED at 0.88 × the government's (`merchantCap`). A "(dominant)" guild never outweighs the seat at birth. | `rulingStructure.js:497-504`, `:507` |
| L-B | `Military/Guard` (faction row) | An aggregate of "the soldiers and watchmen, not the officers who govern"; minted whenever `militaryPower > 5` (thorp: priority > 60) with NO institution test, so the row exists on towns with no garrison, watch or militia. It is not the `watch` holder kind and not `inst.hasWatch`. | `rulingStructure.js:570-600`, `:590-593`; `priorityHelpers.js:48` |
| L-C | `Thieves' Guild` (faction row) | Minted whenever `criminalPower > 5`, independent of a thieves'-guild INSTITUTION (`hasThievesGuild`); and `computeCriminalCaptureState`'s `isCrim` matches the substring `thiev` on the NAME. A faction called Thieves' Guild is not the `Thieves' guild chapter` row and licenses no building. | `rulingStructure.js:658-674`; `factionDynamics.js:221`; `priorityHelpers.js:74` |
| L-D | `modifiers: ['vacant']` on the governing row (`succession_void`) | The SEAT is vacant and the governing power is halved, while `isGoverning` stays true and `governingName` still fills `{seat}`/`{faction}`. The stability label is `Volatile — power is available to whoever moves first`, routed to `unstable matched`, whose v1 reads "{faction} governs". PowerTab's own chain prints "the seat itself stands vacant". | `stressFactions.js:109-111`; `governanceNarrative.js:306-308`; `powerStateProse.js:307`; `PowerTab.jsx:117` |
| L-E | `modifiers: ['occupied']` (`occupied`) | The pre-occupation body keeps `isGoverning` at 0.6 power; an `Occupation Authority` row (power 20) is pushed NON-governing. `Suppressed (under occupation…)` falls to the FLOOR pool, whose v1 says "{faction} holds the hall" of the occupied body. | `stressFactions.js:25-46`; `governanceNarrative.js:291-292`; `powerStateProse.js:313-314` |
| L-F | `Tense (external threat)` | An ADVERSARIAL NEIGHBOUR RELATIONSHIP TYPE, not a siege or an army. | `governanceNarrative.js:17`, `:267-269` |
| L-G | `Vulnerable` | Two vocabularies: the stability label `Vulnerable (prosperous but underdefended)` and the DEFENSE readiness label `Vulnerable` (−5 to legitimacy; the provisional default for thorp/hamlet). | `governanceNarrative.js:270-274`; `factionDynamics.js:51-53`; `rulingStructure.js:740-741` |
| L-H | `criminalCaptureState` at play | The WORST rung across EVERY faction of the settlement, governing or not; not the seat's own rung. | `factionCapture.js:136-146`; `pulseKernel.js:645-648` |
| L-I | `breakdown.safety < 0` ("SAFETY, adverse") | Fed by the SAFETY LABEL substring: `famine` → −20, `quarantined` → −8, **`controlled` → −5** (the authoritarian peace, whose own desc says "The streets are unusually quiet… little risk from common thieves"). The pool's "streets after dark", "badly policed", "crime returns" prose is drawn for a famine, a quarantine or an over-policed town. On a thorp the −5 can dominate. | `factionDynamics.js:33-40`; `safetyProfile.js:241-246` |
| L-J | `recentConflict` (birth) | An ONGOING dispute in every producer branch; resolved only by the play-time transfer's sentence. | `governanceNarrative.js:372-487`; `rulingPower.js:672-675` |
| L-K | `underThreat` (bloc layer) | Includes the town's OWN `war_preparation` / `mobilized` / `deployed` posture. The glue detail "at the walls" fires for an army marching OUT. | `settlementPolitics.js:515-518`; `mobilization.js:117-121` |
| L-L | `end: commerce` | Also the FAIL-SOFT for a lead member with no `ARCHETYPE_END` row (`other`). | `settlementPolitics.js:495` |
| L-M | `end: survival` | Also from the goal `break_vassalage` with no threat. | `settlementPolitics.js:470` |
| L-N | `desc` on the governing row | Falls to the `Mixed Council` gloss ("Power is distributed across multiple factions without a clear dominant authority") for every fallback-path label absent from `govDescByFaction` — a Headman's Authority persisted with a multi-faction gloss. | `rulingStructure.js:424-440` |
| L-O | `powerLabel: Dominant` | ≥ 35 of the renormalised 100, i.e. a plurality band. The desk's `DOMINANT share` is `governing > sum(others)` (> 50). A roster row labelled Dominant need not be the desk's dominant faction, and the pool's "outweighs everything else put together" is the strict one. | `factionDynamics.js:582-586`; `powerStateProse.js:353` |
| L-P | `stability` after a transfer | Five play-time labels (`Unsettled:`, `Subjugated:`, `Stable:`, `Transitional:` ×2); `Stable: a fresh mandate` draws the same pool as a decades-old `Stable` (surveyor's L-4, here with the writer cited). | `rulingPower.js:414-420`, `:662` |
| L-Q | `{seat}` after a transfer | A `GOVERNMENT_PREFERENCES` / alt label (`Noble Regency`, `Garrison Command`, `Martial Administration`) or `<label> Ascendant`; outside E-1's class. `properFill` accepts them. | `rulingPower.js:180-187`, `:433-449`, `:657-658`; `powerStateProse.js:178-185` |

### Alias traps (one English word, several engine rows)

| # | Word | Rows | Rule |
|---|---|---|---|
| A-α | **the garrison** | `hasGarrison` is set by `garrison`, `barracks`, `professional guard`, **`professional city watch`**, `multiple garrison`; `hasWatch` by `town watch`, `city watch`, `professional city watch`. ONE institution row (`Professional city watch`) sets BOTH flags, and `safetyProfile` then renders "garrison and city watch" for it. `governanceNarrative`'s label ladder, matching `garrison` on the NAME, calls the same town "The watch". | `priorityHelpers.js:46-48`; `safetyProfile.js:263-268`, `:321-322`; `governanceNarrative.js:500-502`. A pay/manning face must follow the ROW NAME, never the flag. |
| A-β | **the guard** (the surveyor's "always-safe" spelling) | `The guard` is the non-small-tier FALLBACK when NO force institution matches (`governanceNarrative.js:506`); on that same town `safetyProfile` says "There is no meaningful guard presence" / "There is effectively no law enforcement" (`safetyProfile.js:300`, `:309`) and the guard-effectiveness branch is not entered (`:318 if (inst.hasMilitaryInst)`). Two engine sites disagree about whether a guard exists. **NOT always safe**: safe only where `hasMilitaryInst` is true; on small tiers the engine's own generic is `The community` (`:506`), backed by `communityMilBase` (`defenseGenerator.js:140-156`). |
| A-γ | **the seat** | THREE senses inside DS-POW-7 alone: `{seat}` = the governing body's NAME; "seats" = the bloc's END (office); "the seats that hold together" = the MEMBER FACTIONS of a bloc (`glue doctrine` v1, `concession` v1). Plus DS-POW-4's OFFICE sense ("the office is the thinner of the two") and DS-POW-2's PLACE sense (`powerStateProse.js:862-876`). | The rewrite must fix one sense per block; the desk already refuses to fill the PLACE sense. |
| A-δ | **the houses** | Used generically for factions ("the other houses", DS-POW-2 `DOMINANT` v1, `NARROW` v3; DS-POW-7 passim). In the engine `Noble Houses` is a specific METROPOLIS roster row and `Manor Household` / `Landed Gentry` / `Noble Families` its tier siblings (`rulingStructure.js:524-531`); `house\s+[a-z]` is the NOBLE name rule (`factionArchetypes.js:84`). "The houses" of a town whose roster is Guilds, Orders and Authorities asserts a nobility the roster may not carry. |
| A-ε | **a majority** | `rulingBlocOf` needs a 0.4 share (`settlementPolitics.js:149`, `:588-590`). "A working majority" (corpus, and the engine's own concession detail `:454`) overstates. Safe spelling: "a working plurality" / "the largest combination". |
| A-ζ | **the levies / the rolls come back paid** (DS-POW-1 `Endorsed` v2, `Contested` v2) | The `treasury` holder kind is instantiated by `Village headman`, `City administration`, `Weekly market`, `City-state government`, `Lord's appointee`, `Village reeve`, `Town hall` (`holderTable.js:271-277`); `Tithe and dues` sits on the headman. A "levies" face on a town with none of those has no holder; the `Endorsed` card prints SOURCE-UNRESOLVED (card printed in this packet's run). |
| A-η | **a ruler / whoever sits** (DS-POW-4 hold pools) | The incumbent is a governing FACTION, never a person (`EngineSections.jsx:232-234`; `coupContenders` reads `f.faction/f.name`). "A ruler with the town behind them" personifies a roster row. |

---

## §4 MISSED NOUNS — corpus words no survey row covers

Read off all 256 variants (`dump-power-corpus.mjs`). Each with the pool that carries it and the
engine field that would have to license it.

| Noun | Where the corpus puts it | What would license it | Standing |
|---|---|---|---|
| **the walls** | DS-POW-2 `siege matched` v1 "the walls have settled the argument", v4 "outside the walls"; DS-POW-6 `neutral baseline` v1 "not the walls"; DS-POW-7 `glue threat` v1 "what is at the walls" | `inst.hasWalls` (`priorityHelpers.js:52`) — read by NO power pool. `under_siege` is a config stress with no wall gate (`defenseGenerator.js:336` handles a siege regardless). | REFUTED as an entailment of siege/threat/neutral. |
| **the gates** | DS-POW-2 `siege matched` v2 "rationing, the gates and the watch rota"; DS-POW-6 `duty evasion` v2 "never appears at the gate" | `inst.hasGates` (`:53`); `Gate duty` is a Town-watch service (`institutionServices.js:1324`). Unread. | REFUTED as entailed by siege or smuggling. |
| **the watch rota** | DS-POW-2 `siege matched` v2 | `inst.hasWatch`; unread (E-3). | REFUTED. |
| **rationing** | DS-POW-2 `siege matched` v2 | `Rationing` is a `City granaries` service (`institutionServices.js:841`) and a food-generator siege arm (`foodGenerator.js:237`); the pool reads `power.stability` only. | CONDITIONAL on `hasGranary` or the food desk's own reading. |
| **the granary (door)** | DS-POW-1 `FOOD, adverse` v1 | `inst.hasGranary` (`priorityHelpers.js:66`); the contribution reads `foodSecurity.label` only (`factionDynamics.js:149`, `:164`). | REFUTED as entailed by a food contribution. |
| **the harvest** | DS-POW-1 `FOOD` v2; DS-POW-6 `neutral` v1 | food label words are `famine/deficit/dependent/pressured/surplus` (`:62-70`); no harvest field on this desk (economicBase `agrarian` is dark, E-17). | CONDITIONAL — a fishing or mining town has no harvest. |
| **the customs / manifests / landing points / agreeable officials** | DS-POW-6 `duty evasion` v1, v3 | the `toll-bar` holder kind (`Gates (if walled)`, `Major Port`, `Town council`; `holderTable.js:299-305`); `hasPort`. The pool reads the operation NAME only. | CONDITIONAL on a toll-bar holder; "landing points" CONDITIONAL on `hasPort`. |
| **the crime returns** (a record) | DS-POW-1 `SAFETY, adverse` v2 | `Crime reporting` exists on `Professional city watch` only (`institutionServices.js:1208`). | CONDITIONAL on that one row. |
| **the streets (after dark) / policing** | DS-POW-1 `SAFETY` v1, v3 | the safety label (L-I). | REFUTED for `controlled`/`famine`/`quarantined` labels. |
| **the accounts / the books / the minute of any meeting** | DS-POW-1 `PROSPERITY` v1, v2; DS-POW-6 `money laundering` v3, `LEADER` v1 | `office` holder kind; a prosperity tier is not an account. | CONDITIONAL on an `office` row; "minute" REFUTED (no meeting record exists anywhere). |
| **the office** (as distinct from the body) | DS-POW-4 `Contested` v1, `Critical` v1 | the incumbent's `gated` flag; there is no office object. | HOLDS only as a figure of speech for `amplifiedWeight`; a writer must not add an office-holder. |
| **the levies / the purse / spending goodwill** | DS-POW-1 `Endorsed` v2, `Tolerated` v4, `Approved` v4 | treasury holder (A-ζ); no goodwill stock exists. | CONDITIONAL / REFUTED ("spend") — the card refuses "a future". |
| **the season / each season / every season** | DS-POW-1 `Contested` v2, `SAFETY` v3, `FOOD` v3; DS-POW-4 `Holding` v3, `rejection` v2; DS-POW-6 `ADVANCING` v2, `protection` v3; DS-POW-7 `seats` v3 | a trend requires a persisted band with a CHANGE flag (`powerStateProseCandidates.js:47-51`); the birth reading is a static score. | REFUTED as entailment — the card's own "may NOT: a season, a future". |
| **remembers being hungry longer than being fed** | DS-POW-1 `FOOD` v3 | `computePublicLegitimacy` has no memory (`factionDynamics.js:161-166`); play-time deltas are symmetric (`timeProgression.js:165`). | REFUTED (asymmetric hysteresis the model lacks). |
| **the traders** | DS-POW-6 `protection + extraction` v3 | `Merchant Guilds` row or `hasMarket`; the pool reads the operation name. | CONDITIONAL. |
| **the tables** | DS-POW-6 `unlicensed revenue` v3 | `gambling` substring (`criminalOpRole.js:41`) over `Gambling Den/Halls/District`. | HOLDS (the word is the institution's). |
| **a second market alongside the lawful one** | DS-POW-6 `parallel marketplace` v1 | `black market` substring; a LAWFUL market is `hasMarket` (`priorityHelpers.js:56`), unread. | CONDITIONAL on `hasMarket` (a black market with no lawful market to run "alongside"). |
| **a person who speaks for {faction}** | DS-POW-6 `LEADER` v1 | no person-level capture record (`powerStateProse.js:396-404`); `leader_champion` seat exists in `factionStates.internalSeats` (`settlementPolitics.js:240-241`) but the desk does not read it. | REFUTED (and the wrong faction, L-H). |
| **the mandate** | `Stable: a fresh mandate` (transfer label) | `election` cause only (`rulingPower.js:417`). | HOLDS for that label; the first-word classifier discards it. |
| **camps / sides / meetings that are not meetings** | DS-POW-7 dormant v2, covert v3 | bloc presence; `covert` flag. | HOLDS for the covert pool (dm-only). |
| **the district / the quarter / the neighbourhood** | DS-POW-1 `Approved` v1 "in most quarters" | no ward model on this desk (`City administration` "wards" is a service desc only). | CONDITIONAL — read as idiom only. |
| **the temple / the creed** (`{institution}`) | DS-POW-5 `theocracy` v4, v1, v3 | `{institution}` deliberately unfilled (`powerStateProse.js:914-916`); the lens word can come from two arcane rows (E-7, §2). | CONDITIONAL; the deity doctrine bites (surveyor A-6). |

---

## §5 THE CHAIR'S THREE CLASSES, GENERALISED FOR THIS DESK

**Definitional entailment (licensed).** On the power desk the licensed dictionary is the ENGINE'S OWN
ROW, and the row is one of: an `institutionServices.js` service list (a `Town watch` patrols at night;
a `Courthouse` judges), an authored `govDescByLabel` gloss where it actually reaches the record
(E-1e), a `RULING_POWER_LENS` / `ECONOMIC_BASE_LENS` table row, or a bloc glue/end definition
(`classifyGlue`, `ARCHETYPE_END`). The face may say what the row says. The one caveat that recurs
across all four: the row is entered by a KEYWORD on a NAME (`inferFactionCategory`,
`includesInstitution`, `criminalOpEcon`, `hasAny`), so the definition licensed is the row's, and the
face must not add what the keyword's English suggests but the row does not carry (a Watchtower is not
a watch; a Thieves' Guild faction is not a chapter house; "(dominant)" is prosperity).

**Label traps (refused).** Seventeen added above. The shape that recurs: an engine string that reads as
a WORLD fact but is a CLASSIFIER OUTPUT — `mixed`, `commerce`, `survival`, `Stable`, `Vulnerable`,
`Dominant`, `Controlled`, `Tense (external threat)`, `governanceFractured`.

**Alias traps (follow the row).** The generic words on this desk that split into rows: the seat (5
senses), the guard/garrison/watch/militia (four flags, one of which two institutions share), the
houses, the majority, the court, the council, the record. The always-safe spellings the survey proposed
need two corrections: "the guard" is safe only where `hasMilitaryInst`; "the hall" and "the houses"
are never safe. The safe generic on this desk is the SLOT (`{seat}`, `{faction}`) or a word the engine
itself mints as its fallback FOR THAT TIER (`The community` on small tiers).

**Contradiction class (the desk's counterparts to "walls never decay").** (1) A legitimacy reading has
no memory at birth and symmetric memory at play — no "remembers hunger longer" (§4). (2) A ladder's
first-light shape is its tier's rung cap, not its history (E-9f, g). (3) The coup field cannot see a
criminal contender (E-10c). (4) A ruling bloc is 40%, not a majority (A-ε). (5) The capture rung is the
worst faction's, not the seat's (L-H). (6) `underThreat` fires for the town's own army leaving (L-K).
(7) The ruling-power word is the STRONGEST faction's keyword category, so a Royal Authority is a
`council` (§2). (8) `recentConflict` is unresolved at birth (L-J). (9) A siege entails no wall, gate or
watch (§4). Each is a place where a true English sentence is more knowledgeable than the simulation.

---

## §6 CORRECTIONS TO THE SURVEY'S OWN TEXT

- §3 slot table: `{counterpart}` is also filled in DS-POW-4 (`powerStateProse.js:953`) — correct as
  written; but `{faction}` in DS-POW-6 is `governingName` (`:962`), which makes the capture pools
  name the seat's faction (L-H).
- E-9: "the array is sorted top-first" should read "the array is the SEAT order, top rung first;
  standing is a separate stock and is not monotone along it".
- E-20: the row shape is `{label, cause, tick}`; `by` and `government` are annex spellings no writer
  produces.
- A-4: "the guard" is not always safe (A-β).
- §2 card 1 (`governanceFractured true`) prints `source: court · LICENSED`; the census row confirms
  `standing: LICENSED, stateOrgan: true` (printed). Cards 3, 4, 7 SOURCE-UNRESOLVED: confirmed by the
  census rows printed in this run.
- §6 L-21 (`covert: false` on every DS-POW row): confirmed by direct print of the census `covert`
  column for DS-POW-5/6/7 (all `false`).

*Packet written 2026-09-10 by the power-desk refuter (Fable 5.1). Read-only against `f2da5a3ee`.*
