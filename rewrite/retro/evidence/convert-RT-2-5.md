# CONVERT-RT-2-5 — the REFERENT TABLE's sections 2, 3, 4 and 5 re-classified under ADDENDUM 14

Source: `rewrite/entailment/REFERENT-TABLE.draft.md` §2 (six desks' layer assignments + each desk's REFUSED table), §3 (OV-1…OV-39), §4 (29 power slots · 19 visibility rows), §5 (the wrong-layer findings in the shipped rows).
Test applied: **a face is LAWFUL unless it CONTRADICTS the record.** "The card does not license it" is no longer a finding. Four floors survive: (1) no self-contradiction against the WHOLE town's record or another surface on the same page; (2) no invented HISTORY, DATE or NUMBER (THE PROMISE); (3) product scope + the deity doctrine; (4) the engine's own positive model.

## THE FIVE RULES THIS FOLD APPLIED (so the chair can veto the rule, not 527 rows)

1. **A layer assignment is a permission grammar and dies.** BODY / HOLDER / ORGAN-UNDER-POWER / ROLE / AGGREGATE / NONE told a writer which noun a read *earned*. Silence is now permission, so "a body word on an aggregate read" is not a finding. What survives out of W20 is only the **label trap**: a face that ASSERTS a body (watch, garrison, militia, walls, gates, granary, market, hall, court, shrine, mill) on a pool that can fire on a town whose roster does **not** carry that row contradicts the institutions roster and the defense projection printed beside it — ADDENDUM 14 floor 1 names this case verbatim.
2. **Existence claims meet the roster; metonyms do not.** "a policy of the hall", "argued in the hall", "what the hall issues" are place-metonyms of the power and are STRUCK. "{settlement} has a hall and a seat in it", "kept its own hall", "the shrines stand", "its granary holds" are existence claims and are CONTRADICTION wherever the tier's roster can lack the row.
3. **The engine's own words cannot be a finding.** Where the shipped sentence is verbatim a `VARIANT_HOOKS` / `reason` / `safetyProfile` / `governanceNarrative` / `TREATY_COMPLIANCE_VOICE` string, the charge is struck (OV-24 is the strongest single argument for striking the layer bars: the engine bakes them on the same page).
4. **Record words, citation rules, standpoints and constructions are STRUCK wholesale.** W24's ratified-noun table, arm A13's citation ban, the `[ledger]`/`[elder]`/`[visitor]` stance rules, R-i…R-iv, R-vi, the maxim-frame and doubled-beat rules policed tone.
5. **An unnamed person is now a plot hook.** W22 survives only as floor 3: a NAMED character with a fate, and nothing predicated of a deity. "Somebody is carrying a leash", "who is holding the keys", "the clerks have decided", "the collectors travel in pairs" are all licensed.

Counts: **CONTRADICTION 193 · MODEL 13 · SCOPE 10 · SPLIT 24 · STRUCK 327** over 567 items (every row of §2's six desks and six REFUSED tables, §3's 39 overlaps, §4's 29 slots and 19 visibility rows, §5's 189 findings).

Column key: **id** · **gist** · **verdict** · **field / ground** (for CONTRADICTION and MODEL this is the field, file and line that denies the face) · **what a writer may now do**.

---

## 2.1 THE DEFENSE DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.1-01 | wall · walls: a wall word only where the pool reads `forces.walls.present` | SPLIT | KEPT: `forces.walls.present` false / `hasWalls` (`priorityHelpers.js:52`) — DS-DEF-5 prints walls ABSENT on the same desk. STRUCK: the muster-HOLDER layer and the "the line" restriction | call the wall anything, at any layer, on any pool — but not on a pool that can fire unwalled |
| RT2.1-02 | citadel · palisade · earthwork · massive walls; W11's blanket material bar | SPLIT | KEPT: the catalogue row fixes the material (`Palisade` → timber; `Town walls` · `City walls and gates` · `Massive walls and fortifications` → stone; O-1's value table). STRUCK: the bar on naming any material at all | call a palisade timber and a town wall stone; never the reverse, and never a material SOURCE the fortification chain contradicts |
| RT2.1-03 | gate · gates: no pool reads a gate; "the gate" recurs on non-walls pools | CONTRADICTION | `hasGates` needs a wall-class row (`priorityHelpers.js:52-53`); DS-DEF-5 prints walls ABSENT beside it | write the gate freely on a walled town, including on a palisade (`hasGates` fires there — the engine's own reading) |
| RT2.1-04 | `{defwork}` refuses names outside the four wall words; the two residuals reach the page as literals | STRUCK | a fill mechanic owed to CAR 8b-W-2, never a writer's claim | write the slot; the residual grammar is the register car's problem |
| RT2.1-05 | garrison: BODY bucket + `hasGarrison`; at city the roster always includes `Professional city watch` | CONTRADICTION | `forces.garrison.present` (`defenseStateProse.js:655`), `priorityHelpers.js:46` | name the garrison wherever the bucket resolves — including off a `Barracks`, which IS a garrison-bucket row |
| RT2.1-06 | barracks: W12 said a Barracks licenses no "garrison" | STRUCK | `defenseInstitutionBuckets.js:89` puts barracks IN the garrison bucket, so the projection prints garrison present | call a Barracks town's force the garrison — the engine already does |
| RT2.1-07 | `professional guard`: a bucket keyword with NO shipped row | STRUCK | a measured absence; silence is permission | use the phrase as flavour; it asserts no row |
| RT2.1-08 | militia · citizen militia; "the muster" as a cited roll | CONTRADICTION | `forces.militia.present` / roster `Citizen militia` (`holderTable.js:279-288`) — a walled Town-watch-only town keeps no roll | say "the muster" as the class word anywhere; assert a militia or a roll only where the row stands |
| RT2.1-09 | mercenary company · quarter · hired muscle (fires only at city) | CONTRADICTION | `forces.mercenary.present` (`defenseStateProse.js:1284`) | name hired companies where the bucket resolves |
| RT2.1-10 | adventurers' charter hall | CONTRADICTION | `forces.charter.present` (`priorityHelpers.js:51`) | name the charter hall where it resolves |
| RT2.1-11 | magicDef bodies — the seventh bucket the census under-reports | STRUCK | a census under-report (M-12); the code reads `forces.magicDef.present` | write arcane provision on DS-DEF-5's arcane pools; the licence card's silence is a wiring defect |
| RT2.1-12 | `force` = garrison ‖ militia, excluding watch · mercenary · charter | STRUCK | a token fact; the presence traps are carried by the body rows | use any force word; only the roster binds |
| RT2.1-13 | watch: name only where `Town watch` / `Professional city watch` resolves; NEVER on a pay-gate read | SPLIT | KEPT: the label trap — `hasWatch` (`priorityHelpers.js:48`) false, and `safetyProfile.js:300` prints "There is no meaningful guard presence." beside it. STRUCK: rule 5's pay-gate bar (`defenseGenerator.js:177-178` counts `hasWatch`; `fieldSynonyms.js:51` calls the gate "the town's pay for its watch") | say the watch is paid for, kept, short of pay — on any town that HAS a watch row |
| RT2.1-14 | court · courthouse: "the court" only off a courthouse row | STRUCK | `hasCourtSystem` is satisfied by the REQUIRED town/city HALL (`priorityHelpers.js:55`) — the engine's own reading of a court system | call it the court, the town's law, the bench, wherever `hasCourtSystem` holds |
| RT2.1-15 | prison · gaol · stocks | CONTRADICTION | `hasPrison` (`priorityHelpers.js:54`); DS-DEF-6 prints Legal Infrastructure: None beside it | write the gaol where the flag holds |
| RT2.1-16 | treasury: the purse only on treasury reads | STRUCK | a record-word/layer bar (W24) | use purse, chest, coffer on any money sentence |
| RT2.1-17 | office: "a citation on it is a FINDING, never a licence" | STRUCK | arm A13's citation rule policed provenance, not truth | cite the record, or not, as the sentence wants |
| RT2.1-18 | granary · the stores: never the building and the stock in one word | SPLIT | KEPT: `hasGranary` false (`priorityHelpers.js:63`). STRUCK: the building/stock word-split | say the granary doors, the stores, the loft — where the flag holds |
| RT2.1-19 | hospital · infirmary: the flag catches monastery · healer · friary | STRUCK | the engine sets `hasHospital` on all four (`priorityHelpers.js:64`) | call a friary's care an infirmary; the engine does |
| RT2.1-20 | church · parish · clergy: `hasChurch` is TRUE on a hamlet from a church in ANOTHER settlement | CONTRADICTION | `priorityHelpers.js:65` — the label trap; the town's roster carries no church row | write faith freely; assert a church BUILDING here only where a religious row stands |
| RT2.1-21 | port · docks · harbour: `hasPort` is never the sea | CONTRADICTION | `PORT_INFRA_RE` (`priorityHelpers.js:32`); the sea only off a `Shipyard` row or `maritimeSupported` | write the water approach, the wharf, the quay on `hasPort`; the open sea needs the other row |
| RT2.1-22 | navy · fleet: X-D1 unresolved, `Naval force` treated as unreachable | STRUCK | a roster question owed to the register car | write ships where a naval row resolves; the pool may simply never fire |
| RT2.1-23 | road (holder kind resolving to `Listening post` / `Waystation`) | STRUCK | a holder-layer bar | write the road as a road |
| RT2.1-24 | `{seat}`: the fill can render a ROLE (`Town Mayor`) or a standing-laden label (`Corrupt Council`) | CONTRADICTION | `rulingStructure.js:284`, `:452`, `:443-452` — the rendered label is printed on the same page | surround the slot with anything that does not deny the label it renders |
| RT2.1-25 | "the ruling structure" as the class word | STRUCK | a safe-word permission | use it, or the seat, or the town's own arrangement |
| RT2.1-26 | `criminalCaptureState`: one field, two readings, two thresholds | MODEL | `rulingStructure.js:762-767` — `adversarial` "asserts enforcement is WINNING"; world capture only at `corrupted`/`capture` (`holderTable.js:661`) | write the rung's own meaning; never the underworld in charge at `adversarial` |
| RT2.1-27 | per-faction `captureState` (read by no defense pool) | STRUCK | no face reaches it | — |
| RT2.1-28 | `{faction}` declared on DS-DEF-3/4/5, filled by zero call sites | STRUCK | wiring | — |
| RT2.1-29 | `{npc}` declared on DS-DEF-4, forbidden by the block's own fence | SCOPE | floor 3: a NAMED character with a fate | an UNNAMED person may carry the leash, hold the key, be resented |
| RT2.1-30 | the criminal interest · the operators · **the syndicate** | CONTRADICTION | `defenseDisplay.js:183-195` prints the structure label (`diffuse` / `informal` / `organized`) on the same panel; `Organized Syndicate` is the `organized` key's own label | write the criminal interest, the trade, the quiet arrangement anywhere; "syndicate" only on the organized key |
| RT2.1-31 | a corruption impairment (POWER over a security body; no landed pool) | STRUCK | no face today; the covert rule lives at VIS-01 | — |
| RT2.1-32 | a brokerage patron (not a defense-desk read) | STRUCK | no face | — |
| RT2.1-33 | practitioner(s): a standing condition, never an act | STRUCK | the ROLE bar policed tone | a practitioner may act, refuse, charge, leave |
| RT2.1-34 | `Town Mayor` · `Elected Reeve` · `Feudal Appointee` entering as the POWER through `{seat}` | STRUCK | the role-word bar; the string is the engine's own | write around whatever the slot renders |
| RT2.1-35 | soldiers: "the men on the wall" struck for asserting manning AND a wall | SPLIT | KEPT: the wall (`hasWalls`). STRUCK: the manning bar — no field records manning, so silence is permission | put men on the wall of a walled town |
| RT2.1-36 | army (the enemy's; the town's abroad) as an EXTERNAL BODY with its possessor stated | STRUCK | the possessor-stating requirement was a construction rule | write the besieger, their army, the column on the road |
| RT2.1-37 | "the line": walls-BODY in DEF-2/5, the MANNED FRONT in DEF-7 | STRUCK | rule 3 (same word, same referent) is a construction rule; no reader is misinformed | use the line for either |
| RT2.1-38 | specialists · specialist recourse asserted on the Beasts key, which reads no `charter` | CONTRADICTION | `forces.charter.present` false; the roster denies a charter hall | write specialists where the charter row stands |
| RT2.1-39 | `Household levy`: a thorp with a levy reads `NO organized force at all` | CONTRADICTION | `institutionalCatalog.js:104` vs `defenseStateProse.js:1273-1274` — the roster prints the levy while the projection denies any force (an ENGINE contradiction; see newFindings) | nothing until the register car rules; today the page contradicts itself |
| RT2.1-40 | `{counterpart}` declared on six blocks, not filled at this tip | STRUCK | wiring | — |
| RT2.1-41 | `{institution}` with no provider on DS-DEF-6/9 | STRUCK | wiring | — |
| RT2.1-42 | the occupier: a BODY word with a foreign possessor; "{counterpart}'s garrison" refused | SPLIT | KEPT: the town's own `forces.garrison.present` false. STRUCK: W12/W25's bar on "the occupier's garrison" — the occupation record's silence is now permission | call the occupier's force a garrison; do not call it the TOWN's |
| RT2.1-43 | "the purse" used on a court/prison read | STRUCK | an organ-word bar | use it anywhere money is meant |
| RT2.1-44 | "the town's law" made an agent ("reaches for the purse") | STRUCK | the agent bar policed tone | the law may reach, wait, look away |
| RT2.1-45 | fences · bandits · small operators (the `diffuse` classifier's three substrings) | CONTRADICTION | `defenseDisplay.js:189` — the panel prints `Organized Syndicate` beside a face saying "a few fences" | write the small operators on a diffuse structure |
| RT2.1-46 | the sick-house · infirmary · the parish | STRUCK | a layer restatement of rows 19 and 20 | — |
| RT2.1-47 | the AGGREGATE row: 27 pools whose reads name no body (badges, readiness, the safety label, the structure, the posture, bands) | SPLIT | KEPT: the safety label is reachable with NO law body at all (a thorp reads `Moderate` off a community bonus, `safetyProfile.js:56-62`) — so a body named here is the live label trap. STRUCK: the rule that an aggregate read may name no body | name the town's bodies on a band read, as long as the town has them |

### 2.1-R — the defense REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.1R-01 | "the wall family has no organ, power or role layer anywhere" REFUTED | STRUCK | research; the layer vocabulary is struck | — |
| RT2.1R-02 | `hasWatch` IS consumed by the pay gate | MODEL | `defenseGenerator.js:177-178`, `:189-191` — `hasAnyDefense` counts the watch | say the town pays for its watch |
| RT2.1R-03 | "the engine's own prose never bakes 'the watch'" REFUTED | STRUCK | `safetyProfile.js:281`, `:288`, `:297`, `:307` bake it | use the engine's own word where the row resolves |
| RT2.1R-04 | the arcane pools read the bucket; the census under-reports | STRUCK | wiring (M-12) | — |
| RT2.1R-05 | `NO organized force at all` consults SIX buckets | CONTRADICTION | `defenseStateProse.js:1273` — a face naming any of the six on that pool is denied by the pool's own key | say no contracted, chartered or arcane body stands — the key licenses it |
| RT2.1R-06 | O-2 "a pay read does not reach the watch bucket" REFUTED | MODEL | the gate's producer counts `hasWatch`; `fieldSynonyms.js:51` | — |
| RT2.1R-07 | O-12 "four bucket keywords match no row" — three, not four | STRUCK | a count | — |
| RT2.1R-08 | "a ROLE-layer law costs this desk nothing" REFUTED | STRUCK | the role bar is struck; the fact feeds RT2.1-24 | — |
| RT2.1R-09 | `--section` handling exists (grep-binary file) | STRUCK | tooling | — |
| RT2.1R-10 | "the guard · the garrison" as always-safe body words | CONTRADICTION | `safetyProfile.js:300` prints "There is no meaningful guard presence." where no law body resolves | write "the guard" wherever any law body stands — the engine's own class word |
| RT2.1R-11 | law item 5 as drafted REFUTED (it bars the only true body word on a quarter of walled towns) | STRUCK | ADDENDUM 14 confirms the strike | — |
| RT2.1R-12 | "the desk names no role anywhere" CONDITIONAL | STRUCK | research | — |
| RT2.1R-13 | INTERESTED is not limited to the four organs | STRUCK | the citation machinery is struck | — |
| RT2.1R-14 | the `watch PRESENT` citation fails from rung 1, not from `corrupted` | STRUCK | the citation bar is struck | cite the watch on a captured town |

## 2.2 THE GENERAL DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.2-01 | the watch: presence only, never a duty (`dutyNamed: 0`) | SPLIT | KEPT: `hasWatch` false (`priorityHelpers.js:48`) — the safety panel denies it. STRUCK: the duty bar — an unrecorded duty is silence, and silence is permission | say what the watch is FOR, what it neglects, when it walks |
| RT2.2-02 | the garrison on this desk's aggregate reads | CONTRADICTION | `hasGarrison` (`priorityHelpers.js:46`); the roster | name it where the row stands |
| RT2.2-03 | the militia · the muster (roster-backed by ONE row, `Muster training` rolled) | CONTRADICTION | roster `Citizen militia` (`holderTable.js:280-287`) | "the muster" as the class word anywhere |
| RT2.2-04 | mercenary · free company: the flag and the bucket disagree on three members | CONTRADICTION | `priorityHelpers.js:49-51` (`hasMercenary: true`) vs `forces.mercenary.present: false` — TWO engine surfaces disagree on a Hireling-hall town (see newFindings) | nothing safe on that town until the register car rules |
| RT2.2-05 | the charter hall | CONTRADICTION | `hasCharterHall` (`priorityHelpers.js:51`) | — |
| RT2.2-06 | the walls · the gates (`hasGates` fires on a wall row with no gate row) | CONTRADICTION | `hasWalls` (`priorityHelpers.js:52-53`) | write gates on any walled town |
| RT2.2-07 | the court: `hasCourtSystem` is satisfied by a HALL | STRUCK | the flag is the engine's own reading | call it the court at any `hasCourtSystem` town |
| RT2.2-08 | the prison · the gaol | CONTRADICTION | `hasPrison` (`priorityHelpers.js:54`) | — |
| RT2.2-09 | the magistrate · the constable: ZERO shipped rows | STRUCK | a role word, and `magistrate` is in the ROLE instrument | write a magistrate as a person of the town |
| RT2.2-10 | the hall · the council · the seat (several kinds at once; `{seat}` is the typed slot) | SPLIT | KEPT: the hall's EXISTENCE below town tier, where no hall row is seated, and any claim denying the `{seat}` label rendered beside it. STRUCK: the baked-noun bar at town+ where `Town hall` / `City hall` is REQUIRED | write the hall, the council chamber, the room where it is decided — at town and up |
| RT2.2-11 | the elders (kind; `hasInst('elder')` is a substring reaching `Elder Grove Council`) | CONTRADICTION | roster `Household elder · Village elder · Village headman · Town council` (`holderTable.js:332-336`) — except where the engine itself emits "the village elders" as a small-tier council label (`governanceNarrative.js:101-105`) | write the elders wherever the engine's own label does |
| RT2.2-12 | the reeve · headman · steward · appointee — role words that ARE body rows | STRUCK | the person bar; floor 3 relaxed | a reeve may be slow to open the books |
| RT2.2-13 | the treasury: a citation licensed where the provenance budget allows | STRUCK | the citation rule | cite the purse freely |
| RT2.2-14 | the office: a citation "would be citing the speaker" | STRUCK | the citation rule | — |
| RT2.2-15 | the toll-bar | STRUCK | a holder-layer bar | — |
| RT2.2-16 | the census kind (no general pool reads it; both services rolled) | STRUCK | a record-word bar | write the roll, the count, the reckoning |
| RT2.2-17 | the tradition: the ONE kind with no institution in the shipped roster | STRUCK | "nothing citable" is a citation bar | write custom, memory, the way it has been done |
| RT2.2-18 | the road (holder kind) | STRUCK | layer | — |
| RT2.2-19 | the market · stalls · exchange — the class ADMITS `Black market`, `Slave market`, `Whisper market` | CONTRADICTION | `generalStateProse.js:1109`, `:1138-1152`; a town whose only market row is a Black market resolves MARKET-OPEN and the roster prints the illegal row | write the trade, the stalls, what the town sells — asserting a LAWFUL market needs a licit row |
| RT2.2-20 | the church · temple · parish (`hasChurch` from a church in another settlement) | CONTRADICTION | `priorityHelpers.js:65-67` — the label trap | — |
| RT2.2-21 | the granary · storehouse: the stock/building split | STRUCK | a word-split rule | — |
| RT2.2-22 | the hospital · the healer | STRUCK | the flag catches four kinds; the engine's own reading | — |
| RT2.2-23 | the port · harbour · navy | CONTRADICTION | `hasPort` / `PORT_INFRA_RE` (`priorityHelpers.js:32`, `:61-62`) | — |
| RT2.2-24 | the guild · the trade (`hasGuild` is a bare substring firing on `Thieves' guild`) | CONTRADICTION | `priorityHelpers.js:57-58`; the roster prints which guild | write the trades, the companies; "the craft guilds" needs a craft row |
| RT2.2-25 | the magic house (`hasMagicInst` · `hasMagesGuild` · `hasWizardTower` · `hasAlchemist`) | CONTRADICTION | `priorityHelpers.js:68-71` | — |
| RT2.2-26 | the criminal house (flags + the typed criminal faction driving the ladder) | CONTRADICTION | `priorityHelpers.js:72-76`; `criminalCaptureState: none` printed beside a face asserting an underworld | write the underworld where a criminal row or a criminal faction stands |
| RT2.2-27 | `{institution}` (a workshop) whose values are CATEGORY labels, not roster names | STRUCK | wiring (`generalStateProse.js:1259`) | — |
| RT2.2-28 | `{steading}` · `{ruin}` | STRUCK | no bar | — |
| RT2.2-29 | the watchtower: a `watch` for `hasMilitaryInst`, in NO bucket and NO kind | CONTRADICTION | `institutionServices.js:1561-1565`; DS-GEN-17 GARRISONED fires on a Watchtower alone while its gloss says "a force the town PAYS for" | write the tower, the signal fire, the night watching; not a paid force |
| RT2.2-30 | the assembly · the royal seat (census carriers, `hasCourtSystem` members) | STRUCK | research | — |
| RT2.2-31 | the mayor · lord · sexton · warden — role words inside rows and service descs | STRUCK | the role bar | — |
| RT2.2-32 | `{faction}` · `{faction2}` (typed; DS-GEN-7 NAMED BUT NEVER FILLED) | STRUCK | wiring | — |
| RT2.2-33 | `{govFaction}` (the coherence note's governing faction) | STRUCK | wiring | — |
| RT2.2-34 | `{governing}` with the literal fallback `'the governing faction'` | STRUCK | wiring | — |
| RT2.2-35 | `{controller}`: glossed a POWER, filled with a BODY name or the literal `'unattributed'` | STRUCK | wiring (`supplyChainState.js:486`) — either the gloss or the fill is wrong | — |
| RT2.2-36 | the power fields no general pool reads (government · ladder · impairment · patron); three thresholds of "captured" | MODEL | `holderTable.js:141` (birth, `adversarial`) · `:659-661` (world, `corrupted`/`capture`) · `rulingStructure.js:762-767` | write each rung at its own meaning |
| RT2.2-37 | `{npc}` on DS-REL-1: a cast person named on a member receipt, "no fate resolved" | SCOPE | floor 3 | print the NAME; predicate no fate on the person |
| RT2.2-38 | `link` + `localRelationshipRole` (patron / client) | STRUCK | the tie's own word | — |
| RT2.2-39 | DS-GEN-3's 40 AGGREGATE rows (five axes, readiness, safety head, prosperity, foodSecurity) | SPLIT | KEPT: the label trap (a band reachable by a town lacking the body it names). STRUCK: the rule that a band read may name no body | name bodies on a band, where the town has them |

### 2.2-R — the general REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.2R-01 | "the guard" as the always-safe BODY word REFUTED (0 rows; `'guard'` is a faction-name substring) | CONTRADICTION | `safetyProfile.js:300`; `factionDynamics.js:232` | use "the guard" where any law body stands |
| RT2.2R-02 | the barracks IS a shipped row (not merely a regex member) | STRUCK | a bar removed | — |
| RT2.2R-03 | "the market body" REFUTED — the class contains the illegal markets | CONTRADICTION | `generalStateProse.js:1109` | — |
| RT2.2R-04 | the INTERESTED-flip corrections (OFFICE rows never flip; treasury only with a materialised holder) | STRUCK | citation machinery | — |
| RT2.2R-05 | "a role word is a body row, not a person" CONDITIONAL | STRUCK | the role bar | — |
| RT2.2R-06 | "no typed NPC→institution edge" CONDITIONAL (the edge exists; the table declines to read it) | STRUCK | research; the PERSON rule stands on scope alone | — |
| RT2.2R-07 | the covert list has SIX entries, not three | STRUCK | research; the covert rule lives at VIS-01 | — |
| RT2.2R-08 | readiness averages FOUR axes where `magicExists` is false | STRUCK | a computation detail | — |
| RT2.2R-09 | the muster kind carries TWELVE tokens | STRUCK | research | — |
| RT2.2R-10 | the four purses are not published side by side (`military` only with `hasAnyDefense`, `internal` only with `hasLawInfra`) | MODEL | `defenseGenerator.js:462-472`; R-viii′'s one purse over wall maintenance and wages | write the keeping as one purse; never the wall paid and the muster not |
| RT2.2R-11 | `narrativeGenerator.js:632` → `:633` | STRUCK | a cite | — |

## 2.3 THE ECONOMY DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.3-01 | `{institution}` on DS-ECO-11: a chain house from `processingInstitutions[0]` | STRUCK | the fill is true of the town; the overlaps are wiring | write around whatever the slot renders |
| RT2.3-02 | `{institution}` on DS-SUP-3: the slot can print `Town watch` / `Garrison` / `Town walls` as an economy subject | STRUCK | OW-8 — a wiring defect, never a writer's choice; the fill names a row the town HAS | — |
| RT2.3-03 | `{faction}` deliberately unfilled; the CAPTOR is nowhere typed | STRUCK | wiring | — |
| RT2.3-04 | `{access}` (`road · river · port · crossroads · pass`) filled from an unmapped alias | STRUCK | wiring (O-R1) | — |
| RT2.3-05 | the granary: the desk reads the STOCK, never the building | STRUCK | a layer bar | write the granary doors on a stock read |
| RT2.3-06 | the market (holder kind; "keeps a market" needs a licit member) | CONTRADICTION | `priorityHelpers.js:56`; the roster prints `Black market` | — |
| RT2.3-07 | its mill: `has('mill')` is a SUBSTRING — a `Fulling mill` or `Sawmill` raises food capacity | CONTRADICTION | `foodStockpile.js:194`; the roster names which mill | write the mill; call it a grain mill only where the row is one |
| RT2.3-08 | the guilds: BODY (`hasGuild`) and POWER (the typed guild factions) at once | CONTRADICTION | `priorityHelpers.js:57-58` — `hasGuild` fires on `Thieves' guild` | — |
| RT2.3-09 | the hall · the halls ("dictate to the hall" on a TREASURY read) | STRUCK | an organ-mismatch and a fused relation; both policed tone | write the hall as the place a trade leans on |
| RT2.3-10 | the gates · "the gate returns" (*returns* is not a ratified toll-bar noun) | STRUCK | a record-word bar; the pool is WIRING-UNRESOLVED and never fires | — |
| RT2.3-11 | the walls · a wall: no economy read is a walls read | CONTRADICTION | `hasWalls` — the Defense panel prints the works on the same dossier | write inside the walls of a walled town |
| RT2.3-12 | its watch: the three-way word on a TERRAIN read whose ratified noun set is empty | CONTRADICTION | `hasWatch` — DS-ECO-11 Forest fires on watchless towns | — |
| RT2.3-13 | warehouses · workshops · yard · stalls · house · quarter · workings · stores | STRUCK | civic-class generics | — |
| RT2.3-14 | the record words (books · accounts · ledgers · rolls · returns · duties · fees · licence · survey · counts · purse · chest) against the ratified table | STRUCK | W24 — the ratified-noun table policed vocabulary, not truth | use any record noun the sentence wants |
| RT2.3-15 | a stranger · the crier · a clerk · the men · Merchants · `[elder]` | STRUCK | role/standpoint words; floor 3 relaxed (the `Merchants` visibility fault is E-F18) | write the crier, the clerks, the stranger at the gate |
| RT2.3-16 | the road · the roads (31 occurrences): route or record? | STRUCK | a citation question | write the road as a road |
| RT2.3-17 | "the hands" as a POWER · "one name" (an idiom dodging the dark `{faction}`) | STRUCK | the oblique naming was a permission dodge | name a power obliquely; that IS the hook |
| RT2.3-18 | `Customs house` · `Warden's Lodge` · `Workhouse` · `Hunter's lodge` · the charter hall (missed) | STRUCK | research | — |
| RT2.3-19 | `rank` · `foodBalance.*` · `granary.*` · `flowDrift.band` · `text(terrainKey)` · `notableAbsences` · `leading.bucket` = layer NONE | STRUCK | W20's core; the label traps are carried by the body rows | name a body on a band read where the town has it |
| RT2.3-20 | `blackMarketCapture`: a shadow estimate with NO join to the capture ladder | CONTRADICTION | `safetyProfile.js:619-638` vs `criminalCaptureState` printed on the Power surface (O-R6) | write the shadow trade's weight; never "the watch is bought" from this read while the ladder reads `none` |
| RT2.3-21 | `eco.incomeSources`: the criminal LINE is a treasury record fact, not a standing over the treasury | CONTRADICTION | `holderTable.js:166`; the ladder on the same dossier | write the criminal line in the mix; not the underworld holding the purse |
| RT2.3-22 | `stockpile.blockaded` / `.blockadeBypass` — toll-bar, not an organ | STRUCK | layer | — |
| RT2.3-23 | `exportPosture.status` · `economicStrengths` · `strategicValue` · `isEntrepot` · production/exports/imports — market holder | STRUCK | layer | — |

### 2.3-R — the economy REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.3R-01 | LAYER=BODY on the bands REFUTED (layer NONE) | STRUCK | the layer vocabulary | — |
| RT2.3R-02 | ORGAN-UNDER-POWER on `blackMarketCapture` / `incomeSources` is CONDITIONAL; `standingOf` has NO product caller | STRUCK | unwired | — |
| RT2.3R-03 | "BODY cited to an organ" REFUTED — toll-bar and market are NOT state organs | STRUCK | layer | — |
| RT2.3R-04 | *duties* is in no kind's vocabulary (the route REFUTED, the wrong-word finding stood) | STRUCK | W24 | write duties, returns, ledgers |
| RT2.3R-05 | "the market body" / "toll-bar organ" as words REFUTED | STRUCK | vocabulary | — |
| RT2.3R-06 | *Merchants operating in the shadow economy* is a FROZEN component literal, unmarked, player-audible | CONTRADICTION | `EconomicsTab.jsx:664`; the annex declares DS-ECO-6 wholly `dm-only` — the two surfaces disagree | — (a wiring fix, not a writer's) |
| RT2.3R-07 | *a clerk* location corrected | STRUCK | a cite | — |
| RT2.3R-08 | `properFill` refusal corrected (`Bakers (5-15)` is `[2]`, never filled) | STRUCK | a cite | — |
| RT2.3R-09 | the `watch` token row / the census `fieldSynonyms` column corrected | STRUCK | a cite | — |
| RT2.3R-10 | path corrections | STRUCK | cites | — |

## 2.4 THE POWER DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.4-01 | the watch: no pool of this desk reads a bucket; every body word is baked | CONTRADICTION | `hasWatch` / the roster; `safetyProfile.js:300` | write the watch on a power page — where the town has one |
| RT2.4-02 | the hall (50 occurrences, zero reads; `Town hall` / `City hall` are OFFICE holders, not the ruling structure) | SPLIT | KEPT: the hall's existence below town tier, and any claim denying the `{seat}` label. STRUCK: the baked-power bar | write the hall as the place power sits, at town and up |
| RT2.4-03 | the walls · the gates (6 occurrences, no reads) | CONTRADICTION | `hasWalls` | — |
| RT2.4-04 | the granary (DS-POW-1 FOOD adverse) | CONTRADICTION | `hasGranary` | — |
| RT2.4-05 | the customs (`Customs house`) | CONTRADICTION | `institutionServices.js:530` — the roster | — |
| RT2.4-06 | the market on the operation-role pools (which read the operation's own label) | CONTRADICTION | `priorityHelpers.js:56`; `criminalOpRole.js:38-57` prints the role label beside it | write the operation by its own role label; "the market" needs a market row |
| RT2.4-07 | the court: the law court (typed) and the political ASSEMBLY (untyped) | STRUCK | the assembly sense is silence, and silence is permission | write a divided court |
| RT2.4-08 | the council: a lens VALUE, a NAME component, a role keyword; the annex's own fence | CONTRADICTION | `readings.structuralLens.rulingPower` / `powerStructure.governingName` — a council named where the value is `autocrat` or `theocracy` | write the council on the council lens |
| RT2.4-09 | the workshops · tables · **clearinghouse** (no engine row anywhere) · the temple · the prison | STRUCK | an invention where the record is silent is now licensed | write a clearinghouse |
| RT2.4-10 | the muster (the desk's one occurrence is the VERB) | STRUCK | no bar | — |
| RT2.4-11 | the rolls · records · accounts · books · returns · manifests · minutes · the writ | STRUCK | W24 + the "roll as an agent-source" bar; both policed tone | let the rolls show, carry, refuse |
| RT2.4-12 | the houses · a house (the typed faction plural vs `Banking House`) | STRUCK | a vocabulary collision | — |
| RT2.4-13 | the combination · the bloc · the majority (the typed `Bloc`) | STRUCK | the shipped word is licensed | — |
| RT2.4-14 | the criminal interest · the operator (the ladder's output names no faction) | STRUCK | the class word was always safe; the name is unwired | — |
| RT2.4-15 | the office in five registers | STRUCK | layer | — |
| RT2.4-16 | the clerks · officials · operator · leader · the person who speaks for `{faction}` · the incumbent · a ruler | STRUCK | the ACT charges rested on the person bar; floor 3 relaxed | a clerk may chase, an official may be agreeable, an operator may lean on a door |
| RT2.4-17 | `{npc}` on DS-POW-3: a recorded NAME in subject position, gated at the caller | SCOPE | floor 3 | print the name; predicate no fate |
| RT2.4-18 | the reeve · headman · mayor · priest · elder · captain inside `{seat}` fills and as emitted NPC roles | STRUCK | the role bar | — |
| RT2.4-19 | `{seat}` = `governingName`, whatever class the generated name happens to be | CONTRADICTION | `rulingStructure.js:787`, `:792`; the rendered label is on the page | write around the label; never deny it |
| RT2.4-20 | `{faction}` = THE SAME `governingName` string; DS-POW-6 documents it as the CAPTURED HOUSE and fills it with the GOVERNING body | CONTRADICTION | `powerStateProse.js:860`, `:876`, `:900-901`, `:953`, `:962` — one referent printed as two actors, and an accusation landing on the wrong power | never name both in one unit until the register car separates them |
| RT2.4-21 | `{counterpart}` = `challengers[0].name`, which can be `'Unknown Faction (hidden)'` | CONTRADICTION | `stressFactions.js:105-107` — "its presence is not known to the settlement", rendered on a player face with 0 dm-only marks | — |
| RT2.4-22 | the ruling structure as a CLASS · the patron (DS-POW-7 `end patron` invents the relation from the bloc's `end` value) | CONTRADICTION | `settlementPolitics.js:461-465`; `brokeragePatronage.js:60` — the bloc's end token is not a patronage record | write the combination's end in the bloc's own terms |
| RT2.4-23 | an army · the harvest · the government (`governanceFractured` asserts a SECOND, UNNAMED power) | CONTRADICTION | `factionDynamics.js:132-133`; the predicate is COEXTENSIVE with the crisis band (`score < 30`), and the record names one government | write a legitimacy below thirty; never a second government |

### 2.4-R — the power REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.4R-01 | PERSON: `holderRole: null` is the TABLE's choice, not a measured absence; the rule stands on product scope | SCOPE | floor 3 | — |
| RT2.4R-02 | "the guard" REFUTED on both halves | CONTRADICTION | `safetyProfile.js:300`; `rulingStructure.js:596` | — |
| RT2.4R-03 | "the captain is not this desk's vocabulary" REFUTED — the engine emits it | STRUCK | a bar removed | write a watch captain, a garrison commander |
| RT2.4R-04 | visibility HAS three caller-side carriers, none censused | STRUCK | wiring; the audience rule lives at VIS-19 | — |
| RT2.4R-05 | POWER (INTERESTED): the `corrupt` / `controlled` arms are dead in the product | STRUCK | unwired | — |
| RT2.4R-06 | the covert channel also fills from an unexposed corrupt NPC; the regex tests RAW `inst.name` while the buckets test `nativeSemanticName` | STRUCK | wiring (see newFindings: custom content) | — |
| RT2.4R-07 | the criminal party IS typed and named; no slot of this desk carries it | STRUCK | research | — |
| RT2.4R-08 | "66 of 256 variants carry a body word" — the refuter counts 55 | STRUCK | a count | — |
| RT2.4R-09 | nine cite corrections | STRUCK | cites | — |

## 2.5 THE STRESSORS DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.5-01 | walls · wall (13 uses; no desk pool reads a wall field) | CONTRADICTION | `hasWalls` (`priorityHelpers.js:53`) — the Defense panel on the same dossier | write the walls of a walled town on any crisis |
| RT2.5-02 | gates · gate (3) | CONTRADICTION | `hasGates` / `hasWalls` | — |
| RT2.5-03 | garrison · garrisons (7) | CONTRADICTION | `hasGarrison` (`priorityHelpers.js:46`) | — |
| RT2.5-04 | soldiers · officers (1 face) | STRUCK | a person-plural | — |
| RT2.5-05 | watch (a verb at `:4145`, a body at `:4155`) | CONTRADICTION | `hasWatch`; `safetyProfile.js:30-35` prints `'local watch'` only where `hasWatch` resolves | say "keeps watch" anywhere; assert the watch as a body where the row stands |
| RT2.5-06 | army (2): the engine speaks of a standing army as a DESCRIPTION string, never a row | STRUCK | `activeConditions.js:342` | — |
| RT2.5-07 | granary (2) · stores (2) | CONTRADICTION | `hasGranary` | — |
| RT2.5-08 | market (6) | CONTRADICTION | `hasMarket` / the licit-member trap | — |
| RT2.5-09 | warehouse · warehouses (2) | CONTRADICTION | `hasWarehouse` (`priorityHelpers.js:60`) | — |
| RT2.5-10 | hall (4) · council (2) · chamber (1) · seat (12) · office (5) — three layers in one civic class | SPLIT | KEPT: the hall's existence at thorp/hamlet, where no hall row is seated. STRUCK: the class refusal and the layer split | write the chamber, the office, the seat as places |
| RT2.5-11 | courthouse (1) | CONTRADICTION | the roster (`hasCourtSystem` may be a hall, not a courthouse) | write the court; a courthouse BUILDING needs the row |
| RT2.5-12 | treasury (2), once as an AGENT ("a drowning treasury") | STRUCK | the phrase is VERBATIM the record's own `reason` (`stressorDynamics.js:844`) | let the treasury drown, grasp, run dry |
| RT2.5-13 | altars · pulpit · sanctuary · observances · rite · creed · congregations (8) | SPLIT | KEPT: a religious BODY where the roster carries no religious row, and floor 3 (nothing predicated of a deity). STRUCK: the civic-class token filter, which never saw "pulpit" or "altars" anyway | write the rite, the observance, the tending; a shrine BUILDING needs a row |
| RT2.5-14 | roads · road · routes · arteries | STRUCK | a route word | — |
| RT2.5-15 | workshops · workroom | STRUCK | the craft class is generic; no single row is asserted | — |
| RT2.5-16 | schools · taverns · camps ("no roster row" REFUTED for the first two) | STRUCK | research | — |
| RT2.5-17 | houses (merchant sense, 2) | STRUCK | an archetype class word | — |
| RT2.5-18 | institutions · institution (4) | STRUCK | asserts no row | — |
| RT2.5-19 | healers (1) — "no engine row" REFUTED | STRUCK | `institutionalCatalog.js:845`; `npcGenerator.js:1035` | — |
| RT2.5-20 | barracks · militia · mercenary · charter · citadel · palisade · prison · gaol · muster (0 uses) | STRUCK | never rendered | — |
| RT2.5-21 | rolls · registers · books · accounts · ledgers · seals · writ · licence · tax · levy · **quarantine** · lists · tally · bill | STRUCK | W24; `quarantine` alone has no record at all (a Defense-tab display posture) and should not be asserted against a Defense tab printing no quarantine | write any register word; check the Defense posture before declaring a quarantine |
| RT2.5-22 | "another power" / "an outside power" — the positive exemplar | STRUCK | it was never a bar | — |
| RT2.5-23 | authority (5) | STRUCK | `publicLegitimacy` is not a holder token; a class word | — |
| RT2.5-24 | government · governments · the ruling power · the seat | STRUCK | class words | — |
| RT2.5-25 | ruler / rulers (2): a PERSON-shaped word for a FACTION-typed object | STRUCK | the engine's own hook says "loyal to the seat"; floor 3 relaxed | write the ruler |
| RT2.5-26 | occupier (2): at birth `worldState.occupations` is unwritten, so there is no name | STRUCK | wiring; the class word was always safe | write the occupier |
| RT2.5-27 | creditor · sponsor · faction · religious authority · the houses that finance · neighbour · conspiracy · resistance | STRUCK | POWER class words with unwired names | write them all as class words |
| RT2.5-28 | clerks · collectors · officers · administrators · scouts · handler — ROLE words with NO engine row | STRUCK | floor 3 relaxed | let the collectors travel in pairs |
| RT2.5-29 | overseers · officials · healers · mages — role words the engine EMITS; "the AGENCY given them is the finding" | STRUCK | agency is now licensed | — |
| RT2.5-30 | heir · the person responsible · somebody it had reason to trust | STRUCK | unnamed persons | — |
| RT2.5-31 | collaborators · patriots · commons · households · population · people (23) · the men · hands · the street | STRUCK | "a totality over persons" policed tone | write the street, the crowd, the households |
| RT2.5-32 | `{counterpart}` named by `declared_war` only, NEVER FILLED | STRUCK | wiring | — |
| RT2.5-33 | `attackerLabel` — the DM's pen, null on every branch, NOT READ | CONTRADICTION | `stressorDynamics.js:787-796`; `stressors.js:610-627` — on an `unattributed` origin the record states that nobody knows | say the town does not know; naming the attacker denies the origin token |
| RT2.5-34 | `originContext.variant` (17 ORIGIN pools): a face may not say "a noble house" without `contenders[0].archetype === 'noble'` | CONTRADICTION | `stressorDynamics.js:877`, `:886-893`; `palace_coup` is archetype `noble` OR THE DEFAULT (B-12) | write the origin's own archetype; the fallbacks name nobody |
| RT2.5-35 | `condition.archetype` (3 written of 46) | STRUCK | research | — |
| RT2.5-36 | the other 47 reads (token · ARITY · lifecycleStage · COUNTERFORCE · severity · DIRECTION · PROVENANCE · DURATION · FAMILY) | STRUCK | the layer bar; the records' own `description` / `hooks` / `reason` strings carry the engine's body words | write a crisis in the town's own furniture |

### 2.5-R — the stressors REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.5R-01 | variant counts corrected (96 / 96 / 54) | STRUCK | a count | — |
| RT2.5R-02 | the leaf-map cite | STRUCK | a cite | — |
| RT2.5R-03 | `holderTable.js:129-143` was exact | STRUCK | a cite | — |
| RT2.5R-04 | `hasWatch` "town and up" is the catalog's seating, not a law; a custom roster can seat a watch anywhere | STRUCK | a bar removed | write a watch at any tier where the row stands |
| RT2.5R-05 | `FACTION_ROLES` is not the only typed role vocabulary | STRUCK | research | — |
| RT2.5R-06 | the stressor records DO carry institution and person words in string fields | STRUCK | research | — |
| RT2.5R-07 | "every institution noun sits on a record holding none" — true of the READS, false of the RECORDS | STRUCK | research | — |
| RT2.5R-08 | warehouse · schools · taverns · healers · overseers · factor · mages rows exist | STRUCK | bars removed | — |
| RT2.5R-09 | "authority" → `publicLegitimacy` → court REFUTED (half) | STRUCK | a cite | — |
| RT2.5R-10 | the occupier's name is not one field away at birth | STRUCK | wiring | — |
| RT2.5R-11 | `tax_revolt` reads co-located stressors; four fallbacks, not two | STRUCK | research | — |
| RT2.5R-12 | `corruption_exposed` is not the only organ-under-power archetype | STRUCK | research | — |
| RT2.5R-13 | O-1 "below town the word names nothing" REFUTED — `'local watch'` prints | STRUCK | a bar removed | — |
| RT2.5R-14 | `[elder]` count and lines corrected (eight faces) | STRUCK | a count | — |
| RT2.5R-15 | "the watch never for a pay read" — the watch arms BOTH purses | MODEL | `defenseGenerator.js:177-178`, `:244-253` ("watch wages, court and gaol funding") | write the watch's pay |
| RT2.5R-16 | "the muster" safe as a class word only | STRUCK | a vocabulary note | — |
| RT2.5R-17 | F1 · F5 · F6 · F12 · F21 · F22 · F26 "invented" — the WORDS are the record's own hook / reason strings | STRUCK | `stressorDynamics.js:657-729`, `:738`, `:844` — the engine's own words cannot be a finding | — |
| RT2.5R-18 | F10(c) "patrols is not a watch service" — `patrol` IS a `force`-class token | STRUCK | a bar removed | write patrols |
| RT2.5R-19 | `institutionStatusModel.js` path corrected | STRUCK | a cite | — |

## 2.6 THE WARFAITH DESK — the noun rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.6-01 | the army · the field force (no BODY row; `On campaign` holds the muster) | STRUCK | a vocabulary bar | write the column, the field force |
| RT2.6-02 | the soldiers · the men — the possessor-stating rule (W12/W25) | STRUCK | the occupation record's silence is permission | write the occupier's men, their soldiers, the men in the square |
| RT2.6-03 | the muster: TWO referents in the ENGINE's own voice on this block | CONTRADICTION | `treatyDocument.js:58` ("the compelled banner still answers the muster" = the COUNTERPART's call) vs `:63` ("no muster gathers where none is allowed" = the TOWN's arms) | write the muster with the possessor seated; unseated it can state the wrong power's call |
| RT2.6-04 | the banner (the engine's own word for the `relational` clause) | STRUCK | the family rows carry no reads | write the banner |
| RT2.6-05 | the garrison: the town's own body; the occupation record has NO garrison field | CONTRADICTION | `forces.garrison.present` / `hasGarrison`; `occupationStatus.js:95-103` | write the occupier's men; the TOWN's garrison needs the row |
| RT2.6-06 | the walls · the gate ("a wall sentence here is another desk's read") | CONTRADICTION | `hasWalls`; `treatyDocument.js:68` bakes "The garrison keeps the walls" on the same page | write walls on a walled town, on any desk |
| RT2.6-07 | the militia (not used directly on this desk) | STRUCK | no face | — |
| RT2.6-08 | a mercenary company · hireling hall · free company (flags without buckets) | STRUCK | not rendered; the flag/bucket split is RT2.2-04's wiring fault | — |
| RT2.6-09 | the charter hall (not used) | STRUCK | no face | — |
| RT2.6-10 | the watch — ABSENT from the desk's corpus; "no safe use on this desk" | STRUCK | a permission bar; the label trap binds wherever the word IS used | write the watch on a war or faith page, where the town has one |
| RT2.6-11 | the barracks (not used) | STRUCK | no face | — |
| RT2.6-12 | the hall: baked 15 times with no read | SPLIT | KEPT: existence below town tier. STRUCK: "the hall is the power desk's organ" | write the hall at town and up |
| RT2.6-13 | the court: never "bought" from a birth INTERESTED mark at `adversarial`/`equilibrium` | MODEL | `rulingStructure.js:762-767` — `adversarial` asserts enforcement is WINNING | write the court under pressure at the rung the record gives |
| RT2.6-14 | the seat: FOUR rows, two of them authored on THIS desk (the faith seat; the treaty's installed seat) | CONTRADICTION | `treatyDocument.js:72-76` vs `religionState.js:620` — two referents under one word on one page | name which seat |
| RT2.6-15 | the occupier · the occupation authority: TWO readers, TWO referents | CONTRADICTION | `occupationStatus.js:96` (the occupier SETTLEMENT) vs `warStatus.js:318-335` (the OCCUPIED town's installed `governingName`) | name the occupier as a foreign town or as the installed seat — not as one thing |
| RT2.6-16 | the ruling structure · the government (the MANDATE regex returns null for a council or republic) | STRUCK | the authored phrase renders only where `mandateGovWeight > 0` | surround the phrase |
| RT2.6-17 | the faction · the house (FAITH FABRIC's "house" vs the brokerage `houseName`) | STRUCK | a vocabulary collision | — |
| RT2.6-18 | the treasury: "the faith's treasury" on `templeWealth`, a field with NO WRITER | STRUCK | the pool is unroutable — wiring, not a bar | — |
| RT2.6-19 | the market (not used on this desk) | STRUCK | no face | — |
| RT2.6-20 | the granary · stores · wagons (the DS-WAR-2 economic prose reaches for them) | CONTRADICTION | `hasGranary` | — |
| RT2.6-21 | the rolls · books · ledger · records — the `[ledger]` standpoint sliding into the organ | STRUCK | W24 + the standpoint rule | let the clerk's view name the books |
| RT2.6-22 | the elders — the angle only, never the body | STRUCK | not used as a body | write the elders where the roster seats them |
| RT2.6-23 | the parish (LICENSED on the two SINK pools) | STRUCK | a licence, not a bar | — |
| RT2.6-24 | the toll-bar · census · road · tradition (none on this desk) | STRUCK | no face | — |
| RT2.6-25 | the treaty · the instrument · the document (`victorId`/`loserId` ARE `receiverId`/`giverId`) | CONTRADICTION | `treatyDocument.js:359-361`; `treatyOrientation.js:166`, `:171-176` — a face naming the winner can invert the sides against the reader | write the instrument; name a winner only from the orientation reader |
| RT2.6-26 | the term · the clause: the label table fills `{term}` with `installed seat`, `temple restitution`, `pilgrim's road` | STRUCK | the engine's own strings arriving through a proper slot; "the installed seat" beside `{term}` is a duplication (construction) | write around the label |
| RT2.6-27 | the creed · faith · rite (`{creed}`, `{rival_creed}`) | SCOPE | floor 3, the deity doctrine: the creed by the deity's NAME, nothing predicated of the deity | write the observance, the calendar, the quarrel between creeds |
| RT2.6-28 | the patron: the seated creed, a brokerage house's patron, a pantheon rank word | CONTRADICTION | `religionState.js:620` vs `brokeragePatronage.js:60` — one word, two records, both able to ship on one dossier | name which patron |
| RT2.6-29 | the temple · church · shrine · cathedral · monastery (`hasChurch` is TRUE off a resident priest or a wayside shrine) | CONTRADICTION | `priorityHelpers.js:65`; the roster names the row | write the observance; a cathedral needs a cathedral row |
| RT2.6-30 | the parish church · graveyard · burial ground (the reliable parish holders) | STRUCK | a holder fact | — |
| RT2.6-31 | the clergy: the engine EMITS `'the clergy'` under a ROSTER condition; the leaf uses it 12 times | CONTRADICTION | `governanceNarrative.js:128-130` — a church, cathedral or parish row on the roster | write the clergy where a religious row stands |
| RT2.6-32 | the congregation · the faithful · the households (a person-plural banded by share) | STRUCK | the person-totality bar | write the following, the households, the faithful |
| RT2.6-33 | the house · benches · building · roof · stonework · fabric (no built-fabric field) | STRUCK | silence is permission | write the fabric of the place |
| RT2.6-34 | the faith's treasury · coffer · tithe · councils (of a faith) | STRUCK | `templeWealth` has no writer; the pools are unroutable | — |
| RT2.6-35 | `cults[]` · the lesser rites | STRUCK | a standing fact | — |
| RT2.6-36 | the ruler — licensed only inside the authored MANDATE phrase | STRUCK | the phrase is the engine's | write the ruler |
| RT2.6-37 | the pilgrim road · the inns (no pilgrim-season record; the pools are unroutable) | STRUCK | wiring | — |
| RT2.6-38 | the captain · priest · reeve · elder · factor · magistrate · mayor · guildmaster · clerks · sexton · bearers · shepherd | STRUCK | the role bar; floor 3 relaxed | write any of them, acting |
| RT2.6-39 | the ranks · `{counterpart}`'s company · the harbour · the coffer · a clerical post · the hall · "the impairment" | STRUCK | borrowed vocabulary | — |
| RT2.6-40 | the reads by layer; arm A13's "no record holder may be named" on 125 rows | SPLIT | KEPT: `occupierHoldings.*` is ANOTHER power's position and its holder resolves on the OCCUPIED town's militia (`holderTable.js:599-615`) — binding it to this town's own force denies the reader. STRUCK: the citation ban on the other 125 rows | cite freely; do not bind the occupier's overextension to this town's arms |

### 2.6-R — the warFaith REFUSED rows

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| RT2.6R-01 | "{counterpart}'s garrison" REFUTED — the occupation record has no garrison field | STRUCK | silence is permission | write the occupier's garrison |
| RT2.6R-02 | "the guard" as the garrison bucket's body word REFUTED | CONTRADICTION | `governanceNarrative.js:98`, `:148`; `safetyProfile.js:300` | — |
| RT2.6R-03 | `Hireling hall` is in NO bucket (two flags only) | STRUCK | research feeding RT2.2-04 | — |
| RT2.6R-04 | `{counterpart}` on a treaty pool is never the document's side | CONTRADICTION | `warFaithStateProse.js:690-694`, `:795`, `:930-933`; `treatyDocument.js:359-361` — the possessor may be the WRONG power | use the side-neutral cells and `{term}` |
| RT2.6R-05 | the occupier: two readers, two referents | CONTRADICTION | as RT2.6-15 | — |
| RT2.6R-06 | O-6 "the muster's three rows are one referent's layers" REFUTED | CONTRADICTION | as RT2.6-03 | — |
| RT2.6R-07 | PERSON: the typed edge exists; the conclusion holds on product scope | SCOPE | floor 3 | — |
| RT2.6R-08 | "captured" has THREE thresholds | MODEL | `holderTable.js:141`, `:661`; `rulingStructure.js:762-767` | — |
| RT2.6R-09 | the corruption impairment is not the whole covert channel | STRUCK | wiring | — |
| RT2.6R-10 | "the banner" licensed on the family pools CONDITIONAL | STRUCK | the licence question is struck | — |
| RT2.6R-11 | "the muster" as a posture-rung state word is CORPUS, not engine | STRUCK | vocabulary | — |
| RT2.6R-12 | `occupierHoldings.*` holder REFUTED — the wrong town | CONTRADICTION | `holderTable.js:199`, `:599-615` | — |
| RT2.6R-13 | `statusLabel: Occupied`'s muster licence is incidental | STRUCK | the citation rule | — |
| RT2.6R-14 | the clergy "asserts a body the engine does not count" REFUTED — it emits it under a roster condition | CONTRADICTION | `governanceNarrative.js:128-130` | — |
| RT2.6R-15 | "the ruler is the ruling STRUCTURE, not a person" CONDITIONAL | STRUCK | the regex admits person-shaped words | — |
| RT2.6R-16 | F-1 row 10's court-held ground REFUTED (the row is SOURCE-UNRESOLVED) | STRUCK | a cite | — |
| RT2.6R-17 | the per-tier parish claim is PLAUSIBLE, unverified | STRUCK | research | — |
| RT2.6R-18 | "26 catalog types" not re-counted | STRUCK | a count | — |
| RT2.6R-19 | twenty-one cite drifts re-derived | STRUCK | cites | — |

## 3. THE OVERLAPS OV-1 … OV-39

The section header already said these are "wiring facts for the register car, never a writer's choice". Under ADDENDUM 14 an overlap matters only where it makes a face contradict a surface printed beside it.

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| OV-1 | `Professional city watch` is in the GARRISON bucket AND the WATCH bucket; REQUIRED at city | CONTRADICTION | `defenseInstitutionBuckets.js:90`, `:96-97` — every city prints `garrison.present && watch.present` from one row, so a face saying "a watch and no garrison" is denied by the projection | write either word at city; never the contrast |
| OV-2 | "watch" in a dozen registers (bucket · kind · flag · regex · civic class · archetype · role keyword · tier label · Watchtower · the verb) | CONTRADICTION | `hasWatch` / the roster — the only surviving half is the label trap | pick any register; the town must have the row |
| OV-3 | the watch ORGAN's holders ARE the watch BUCKET's rows | STRUCK | rule 3's "same row" is a construction rule | carry a body read and an organ read on one row without announcing the change |
| OV-4 | the watch under the PAY GATE: `hasAnyDefense` arms the military purse, `hasLawInfra` the order purse — the watch and the garrison are each under TWO | MODEL | `defenseGenerator.js:177-178`, `:189-191`, `:244-253`, `:462-472`; R-viii′ | write the keeping as one purse over wall maintenance and wages |
| OV-5 | the MUSTER kind's only holder is `Citizen militia`; the holder resolves ON THE SETTLEMENT PASSED | CONTRADICTION | `holderTable.js:279-288`, `:599-615` — a roll cited where no militia stands, and `occupierHoldings.*` citing the OCCUPIED town's militia | say "the muster" as the class word; a ROLL needs the row |
| OV-6 | wall / walls / gates in three spellings; `hasMilitaryInst` EXCLUDES palisade and INCLUDES `walls` · `citadel` · `watch` | CONTRADICTION | DS-GEN-17 GARRISONED's gloss "a force the town PAYS for" is FALSE of its own key (`priorityHelpers.js:45`) | write walls, gates, the line; do not read the gloss as the key |
| OV-7 | mercenary / hireling hall / free company: three rows in the FLAG and NO bucket | CONTRADICTION | `priorityHelpers.js:49-51` vs `defenseInstitutionBuckets.js:98-100` — a Hireling-hall town reads `hasMercenary: true` to the generator and `mercenary.present: false` to the projection | — (an engine self-contradiction; see newFindings) |
| OV-8 | `hasCourtSystem` is satisfied by the REQUIRED halls | STRUCK | the flag is the engine's own reading of a court system | call it the court |
| OV-9 | hall · council · seat · office · chamber · charter · moot as ONE civic class; the annex fence against hard-coding "the council" | CONTRADICTION | `powerStructure.governingName` / `rulingPower` — a council named where the ruling power is not one | write the chamber, the office, the moot as places |
| OV-10 | eight institution ROWS whose names are ROLE words (`Village headman`, `Village reeve`, `Priest (resident)` …) | STRUCK | the role bar | write the reeve as a person or as the office |
| OV-11 | elder / elders / the `[elder]` angle tag | STRUCK | a refuter must not fail the tag as a person; the body case is RT2.2-11 | — |
| OV-12 | market / stalls / exchange: the class admits `Black market`, `Slave market`, `Whisper market` | CONTRADICTION | `generalStateProse.js:1109`; `priorityHelpers.js:56` — the roster prints the illegal row | — |
| OV-13 | patron in six registers (a relationship value, a brokerage power, a temple-class word, the seated creed, a rank word, an archetype end) | CONTRADICTION | `brokeragePatronage.js:296` (covert iff the HOUSE is illegal) vs `religionState.js:620` — two records, one word, both shippable on one dossier | name which patron |
| OV-14 | granary / stores / storehouse / mill: `has('mill')` is a substring raising food capacity off a `Fulling mill` | CONTRADICTION | `foodStockpile.js:185-195`; the roster names the mill | — |
| OV-15 | hospital / healer / church / temple / parish / shrine: `hasChurch` TRUE off a resident priest; "hospital present" can be one friary | CONTRADICTION | `priorityHelpers.js:64-67`; the roster names the row | write care and faith generically |
| OV-16 | port / harbour / navy; X-D1 (is `Naval force` reachable at all?) | STRUCK | a roster question for the register car | — |
| OV-17 | "guard": a bucket keyword with no row, a faction NAME, a role keyword, and the engine's FALLBACK label | CONTRADICTION | `governanceNarrative.js:98`, `:148`; `safetyProfile.js:300` "There is no meaningful guard presence." | write "the guard" wherever any law body stands — the engine's own class word |
| OV-18 | faction NAMES carry body / office / role class words (`'Military/Guard'`, `'Conversion Enforcement Office'`, `'Unknown Faction (hidden)'`) | CONTRADICTION | `rulingStructure.js:596`; `stressFactions.js:105-107` — a `proper` slot carries neither class nor visibility, so the NAME can render a body word or a covert power | never read the class word inside a NAME as a standing |
| OV-19 | `{seat}` / `governingName` / `government`: a body, an office, a ROLE or a STANDING-laden label | CONTRADICTION | `rulingStructure.js:259-292`, `:443-452` — `Corrupt Council` renders under a face saying nothing criminal has reached the seat | write around the label |
| OV-20 | the capture ladder: two readings, three thresholds; `adversarial` is NOT seeded because "it asserts enforcement is WINNING" | MODEL | `holderTable.js:141`, `:659-661`; `rulingStructure.js:762-767`; `factionDynamics.js:267-268` | write each rung at its engine meaning |
| OV-21 | the covert channel is PERSON-rooted (`compromisedSecurityInstitutions` from an unexposed corrupt NPC, no impairment at all); `revealed` wins | CONTRADICTION | `corruption.js:683-689`; `wiringCensus.js:1252-1259` — a player face naming a covert-flagged fact denies the flag | the DM line names the OFFICE, never the officer |
| OV-22 | a typed NPC→institution edge EXISTS; `holderRole: null` is the table's choice | SCOPE | floor 3 — the rule stands on product scope, not on measurement | an UNNAMED person may hold, act, be resented |
| OV-23 | the ROLE words the engine EMITS or MATCHES (five vocabularies) | STRUCK | the role bar | write captain, reeve, overseer, healer, collector |
| OV-24 | the ENGINE's own prose beside the corpus bakes every layer the law barred (`safetyProfile`, `governanceNarrative`, `hookEscalation`, `TREATY_COMPLIANCE_VOICE`, `VARIANT_HOOKS`) | STRUCK | this row is the strongest argument for striking the layer bars: a cure reaching only the corpus leaves the engine saying the same things on the same page | write as the engine's own strings write |
| OV-25 | `CIVIC_OBJECT_CLASSES` splits the POOL KEY only and is blind to tokens not in its list | STRUCK | an instrument refusal, never a law | — |
| OV-26 | three name accessors classify one roster; a materialized custom row returns `''` from `nativeSemanticName` | CONTRADICTION | `customContentSemanticAuthority.js:40-48`; `corruption.js:665-666` — a custom "Night Watch" is a security body in NO bucket, so the projection prints no watch while the roster prints one (see newFindings) | — |
| OV-27 | `magicDef` the seventh bucket; three keywords with no row; `Household levy` | CONTRADICTION | `institutionalCatalog.js:104` vs `defenseStateProse.js:1273` — a thorp with a levy reads `NO organized force at all` beside a roster printing the levy | — |
| OV-28 | `{institution}` renders other desks' bodies through a `proper` slot | STRUCK | the fill names a row the town HAS; the layer crossing is struck | — |
| OV-29 | `{counterpart}`: five desks, four fills, two referents; the occupier is a SETTLEMENT id, never a faction | CONTRADICTION | `occupationStatus.js:74-104` vs `warStatus.js:318-335`; `warFaithStateProse.js:930-933` — the possessor can be the wrong power | seat the possessor explicitly |
| OV-30 | `{term}` prints seat / temple / road words through a proper slot | STRUCK | the label is the engine's own string | — |
| OV-31 | `{controller}`: the gloss says a POWER, the fill gives a BODY name or `'unattributed'` | STRUCK | wiring (`supplyChainState.js:486`) | — |
| OV-32 | `terrainKey`/`terrainType` and `tradeAccess`/`tradeRouteAccess` — two one-token aliases losing two holders | STRUCK | wiring | — |
| OV-33 | the record words vs `HOLDER_KIND_NOUN_ROWS` vs the `[ledger]` angle | STRUCK | W24 — the ratified-noun table policed vocabulary | use any record noun |
| OV-34 | "the muster": the HOLDER kind, the class word, the verb, and TWO referents in the engine's own voice | CONTRADICTION | `treatyDocument.js:58` vs `:63` | seat the possessor |
| OV-35 | `impaired` at two grains; `corruption_exposed` as a cause AND an archetype | STRUCK | the archetype face cannot name WHICH institution — silence, and silence is permission | write a scandal without naming the office |
| OV-36 | the census `covert` flag reads the TOKEN, not the branch; the caller-side carriers are uncensused | CONTRADICTION | `wiringCensus.js:1681`; `warFaithStateProse.js:251-262` — the card prints `audience: DM only` on three PLAYER pools, so the instrument denies the leaf | — (a wiring fix; see newFindings) |
| OV-37 | `hasCourtSystem` reaches `Democratic assembly`; `City hall` carries the gaol as a SERVICE | STRUCK | research | — |
| OV-38 | `{reason}` will print `${key} institutions` from a sixth force vocabulary once the dark pool is wired | STRUCK | wiring | — |
| OV-39 | the layer vocabulary itself is not exhaustive (AGGREGATE · NONE · HOLDER-not-organ · EXTERNAL BODY · PERSON-ROOTED · TRADITION) | STRUCK | ADDENDUM 14 dissolves the tagging problem: the marker no longer has to choose a layer | — |

## 4.1 POWER SLOTS

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| PS-01 | `{seat}` (defense) — `properFill(power.government)`, an untagged class | CONTRADICTION | `rulingStructure.js:243-247`, `:259-292` — the rendered label can be a role or a standing | — |
| PS-02 | `{seat}` (power) — the same untagged class, 38 of 41 DS-POW-1 variants | CONTRADICTION | `powerStateProse.js:860`, `:862-876` | — |
| PS-03 | `{faction}` (power) = THE SAME `governingName` string | CONTRADICTION | `powerStateProse.js:876`, `:900-901`, `:909` — one referent printed as two actors | never both in a unit |
| PS-04 | `{faction}` (defense) — declared, named by zero variants, filled by zero call sites | STRUCK | wiring | — |
| PS-05 | `{faction}` (economy) — deliberately unfilled; the captor is nowhere typed | STRUCK | wiring | — |
| PS-06 | `{faction}` · `{faction2}` (general) — typed parties to a record | STRUCK | wiring on DS-GEN-7 | — |
| PS-07 | `{govFaction}` (general) | STRUCK | typed and correct | — |
| PS-08 | `{governing}` (general) with the literal fallback | STRUCK | typed | — |
| PS-09 | `{controller}` (general) — not a power; the engine's stages use it as an agent | STRUCK | wiring | — |
| PS-10 | `{counterpart}` (power) = `challengers[0].name`, which can be `'Unknown Faction (hidden)'` | CONTRADICTION | `stressFactions.js:105-107` — "its presence is not known to the settlement", on a player face | — |
| PS-11 | `{counterpart}` (warFaith) — the occupier or the one siege party, NEVER the treaty's side | CONTRADICTION | `warFaithStateProse.js:930-933`; `treatyDocument.js:359-361` | — |
| PS-12 | `{counterpart}` (defense · stressors) — declared, not filled | STRUCK | wiring | — |
| PS-13 | `{npc}` (power DS-POW-3) — a recorded NAME, drawn only off the public dossier | SCOPE | floor 3 | print the name, predicate no fate |
| PS-14 | `{npc}` (general DS-REL-1) — a cast name on a member receipt | SCOPE | floor 3 | — |
| PS-15 | `{npc}` (defense) — forbidden by the block's fence | SCOPE | floor 3 | an unnamed person may carry the leash |
| PS-16 | `powerStructure.criminalCaptureState` — the ladder read by DS-DEF-4 ×5 and DS-POW-6 ×4 | MODEL | `factionDynamics.js:220-273`; `rulingStructure.js:762-767` | — |
| PS-17 | `factions[].captureState` — stamped at `equilibrium`+ on the GOVERNING entry only | MODEL | `factionCapture.js:106-121`; `holderTable.js:129-143` | — |
| PS-18 | `impairments[].type === 'corruption'` + `covert` — read by NO shipped pool | CONTRADICTION | `corruption.js:663-692` — a player face naming a `covert: true` impairment denies the flag | — |
| PS-19 | `compromisedSecurityInstitutions` (the NPC route) | CONTRADICTION | `corruption.js:648-651`, `:683-689` — the DM line names the OFFICE | — |
| PS-20 | a brokerage PATRON (`genesis` ‖ `captured`; the player projection writes `patronName: 'unknown'`) | CONTRADICTION | `brokeragePatronage.js:296`, `:319-328` — covert iff `house.legality === 'illegal'` | name a legal house's patron on either face |
| PS-21 | `RULING_POWERS` as a CLASS (six values, failing soft to `mixed`) | CONTRADICTION | `cohesionWeave.js:133`, `:171-177` — the six words are lens VALUES; naming one against the value denies it | write the ruling structure |
| PS-22 | `originContext.contenders[]` · `.incumbent.name` — the coup field BY FACTION NAME, NOT READ | CONTRADICTION | `stressorDynamics.js:886-894` — a face asserting an archetype the record denies (B-12) | — |
| PS-23 | `attackerSettlementId` · `sponsorSettlementId` · `formerSponsorSettlementId` — typed, NOT READ | STRUCK | wiring | — |
| PS-24 | `originContext.attackerLabel` — THE DM'S PEN, null on every branch | CONTRADICTION | `stressors.js:610-627` — the record states that nobody knows | say the town does not know |
| PS-25 | `occupierName` — world-run only; the map overlay spells the occupier as the OCCUPIED town's installed `governingName` | CONTRADICTION | `occupationStatus.js:83-96`; `warStatus.js:318-335` | — |
| PS-26 | `politics.blocs[]` (`covert?`, the `patronage` glue, `leaderNpcId` typed and UNREAD) | CONTRADICTION | `settlementPolitics.js:423-436`, `:959-962` — a player face naming a covert bloc denies the flag | — |
| PS-27 | `mandateGovWeight` / the MANDATE phrases — `null` for a merchant council or republic | CONTRADICTION | `religionState.js:686-691` — "the ruler" where the government is a council denies `powerStructure.government` | write the phrase the engine renders |
| PS-28 | `legitimacy.governanceFractured` — a SECOND, UNNAMED power on a predicate coextensive with the crisis band | CONTRADICTION | `factionDynamics.js:132-133`; `powerStateProse.js:51-60` — the record names ONE government | write a legitimacy below thirty |
| PS-29 | the criminal party is typed and NAMED and carried by NO slot of any desk | STRUCK | the class word was always safe | write the criminal interest |

## 4.2 VISIBILITY

Note for the chair: ADDENDUM 14's four floors do not name an AUDIENCE floor. Where a covert FIELD exists, a player face naming the fact contradicts that field and I have kept it as CONTRADICTION. Where the visibility is an AUTHORED mark with no field behind it, nothing under the four floors refuses a leak — recorded in newFindings.

| id | gist | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| VIS-01 | a COVERT corruption impairment on a security body — the DM pen line only | CONTRADICTION | `impairments[].covert === true` (`corruption.js:670-681`) | — |
| VIS-02 | a REVEALED impairment — both faces | STRUCK | a licence, never a bar | write the scandal on either face |
| VIS-03 | `corruption_exposed` (the archetype) — both faces; the face cannot name WHICH institution | STRUCK | silence is permission | name no office, or name one as a hook |
| VIS-04 | a birth CAPTURE at `corrupted` / `capture` — the DM face | CONTRADICTION | `holderTable.js:129-143` + the authored `dm-only` marks; the player face says what the state's organs would admit | — |
| VIS-05 | the rungs `none` · `adversarial` · `equilibrium` — the player face | STRUCK | a licence | — |
| VIS-06 | a CITATION of an INTERESTED holder — arm A13 fails a citing player face | STRUCK | the citation bar policed provenance, not truth | cite a state organ's record on any face |
| VIS-07 | a brokerage PATRON — legal house both faces, illegal house the DM | CONTRADICTION | `brokeragePatronage.js:296` (`covert: house.legality === 'illegal'`) | — |
| VIS-08 | a COVERT MOBILIZATION posture — the DM pen line only | CONTRADICTION | `mobilization.js:128`, `:147`, `:418` (`covert: true`) | — |
| VIS-09 | the three NON-covert `mobilization:` pools carded as DM-only | STRUCK | an instrument defect (`row.covert` reads the token) — no writer bar | — |
| VIS-10 | `blocs[].covert` (a conspiracy under an autarchy) | CONTRADICTION | `settlementPolitics.js:423-436`, `:823-830` | a revealed leash is a public scandal both faces may name |
| VIS-11 | a COVERT CONGREGATION (`deities[ref].covert`) — the field has NO WRITER, the pool undrawable | STRUCK | wiring | — |
| VIS-12 | foreign funding (`sovereignty · strained`) — AUTHORED dm-only, no engine field | STRUCK | no field behind the mark; under the four floors nothing refuses the leak (newFindings) | — |
| VIS-13 | the attacker's identity on `ORIGIN: unattributed` | CONTRADICTION | `attackerSettlementId` / `attackerLabel` null (`stressorDynamics.js:787-796`) — the record states nobody knows | say the town does not know; the absence IS the fact |
| VIS-14 | the DS-ECO-6 shadow-economy block: two canonical rows are FROZEN literals, unmarked and player-audible | CONTRADICTION | `economy.generated.js:1595`; `EconomicsTab.jsx:664` vs the annex's "wholly dm-only" | — |
| VIS-15 | DS-STR-1 `INFILTRATED` #5 — an authored `dm-only` on a `covert: false` row the card calls player | STRUCK | an instrument mismatch | — |
| VIS-16 | `{counterpart}` = `'Unknown Faction (hidden)'` on DS-POW-4 player faces | CONTRADICTION | `stressFactions.js:105-107`; `properFill` does not reject `(hidden)` | — |
| VIS-17 | `'Corrupt Official'` — a mandated NPC role naming the corrupt officer OPENLY in a public roster string | MODEL | `npcGenerator.js:1524`, `:1532` — the engine publishes it, so prose may not call that corruption hidden | — |
| VIS-18 | the desks' DM faces in general (§0e's editorial test) | STRUCK | an authored editorial test, not a field | — |
| VIS-19 | the caller-side carriers (`audience`, `publicDossier` nulling the desk, the DS-POW-7 secrets filter) | STRUCK | an engine gate no writer can breach | — |

## 5.1 THE DEFENSE DESK'S WRONG-LAYER FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| D-F1 | "stands better than the watch that should man it" | CONTRADICTION | `hasWatch` false on much of WALLED-STRAINED; `safetyProfile.js:300` prints the absence beside it | write the wall against its keeping, where a watch stands |
| D-F2 | "The watch at {settlement} has been overwhelmed" (×8 on the safety label) | CONTRADICTION | the safety label is reachable with NO law body (`safetyProfile.js:56-62`): FALSE at thorp/hamlet/village | — |
| D-F3 | "doing less each season as the watch thins" on a NO-force branch | CONTRADICTION | `hasWatch` / the roster | — |
| D-F4 | "rely on that rather than on the watch's temper" on a `court ; prison` read | CONTRADICTION | `hasWatch` | write the watch's temper where the watch stands |
| D-F5 | "it is not the watch's doing" from a NAME classification | CONTRADICTION | `hasWatch` | — |
| D-F6 | "Somebody at the {seat} of {settlement} is carrying a leash" | STRUCK | floor 3 relaxed: an UNNAMED person may act and hold a leash | keep it — it is the plot hook the owner asked for |
| D-F7 | "counted at the gate by somebody whose job that is" | SPLIT | KEPT: "the gate" imports a wall the pool never read (`hasWalls`). STRUCK: the person-as-agent charge | give the job to somebody, on a walled town |
| D-F8 | "depends on who is holding the keys" | STRUCK | ADDENDUM 14 names "keep a key" as licensed | — |
| D-F9 | "drifts with whoever is doing the holding" | STRUCK | as D-F8 | — |
| D-F10 | "as far as somebody willing to enforce it is standing" | STRUCK | as D-F8 | — |
| D-F11 | "is somebody's charge rather than nobody's" | STRUCK | as D-F8 | — |
| D-F12 | "does not run through somebody's permission" | STRUCK | an unmodelled permission is silence | — |
| D-F13 | "the comfort has somebody maintaining it" | STRUCK | as D-F8 | — |
| D-F14 | "A thinner watch or a bolder operator would show up" | CONTRADICTION | the counterfactual presupposes a watch; `hasWatch` may be false | the operator half is now free |
| D-F15 | "The people who would have to hold {settlement} … are already owed" | STRUCK | the debt IS the producer's own reading of the band (`defenseDisplay.js:221`); persons are licensed | — |
| D-F16 | "the town has decided that arming itself when needed costs less" | STRUCK | a cause the record is silent on — silence is permission | give the town a reason |
| D-F17 | "what stands between the town and one is the cost" | STRUCK | as D-F16 | — |
| D-F18 | "an end … the town has not yet had to think about" | STRUCK | as D-F16 | — |
| D-F19 | "the town is being administered by its syndicate" | SPLIT | KEPT: "syndicate" is the `organized` key's own label (`defenseDisplay.js:183-195`) and contradicts a `diffuse` panel. STRUCK: the untyped possessive | write the possessive; match the structure word to the panel |
| D-F20 | "The hall … moves against the operators and the operators move back" | STRUCK | a reciprocal relation the ladder does not record — silence | keep the movement |
| D-F21 | "the town's courts are spending down a reputation" | STRUCK | `hasCourtSystem` is the engine's own court claim; "courts" as a functional plural is idiom | — |
| D-F22 | "the hall's decisions are the hall's" (×8) | SPLIT | KEPT: the hall's EXISTENCE below town tier and any claim denying the `{seat}` label. STRUCK: the baked-power bar — the module's own comment accepts "the hall" as the fallback | write the hall at town and up |
| D-F23 | "a falling-out with the hall" on a block with no `{seat}` | STRUCK | as D-F22's struck half | — |
| D-F24 | "how much of the perimeter has nobody on it" | CONTRADICTION | `hasWalls` — the perimeter asserted from a five-arm summary that can be reached unwalled | write the manning; the perimeter needs the works |
| D-F25 | "the garrison can be kept paid while they last" | CONTRADICTION | `forces.garrison.present` / `hasGarrison` on an economic band read | write the paying; name the body the town has |
| D-F26 | "keeps a watch, which is a matter of order rather than of war" | SPLIT | KEPT: the imported `walls` the pool does not read. STRUCK: the body/organ layer-crossing on the one pool that guarantees the watch | narrate the watch's order on the watch pool |
| D-F27 | "Nothing criminal has reached the {seat} at {settlement}" | CONTRADICTION | `rulingStructure.js:284`, `:452` — at `Corrupt Council` the sentence denies the label rendered inside it | — |
| D-F28 | "the muster behind it is thinning" | CONTRADICTION | `forces.militia.present` / `hasGarrison` — wrong on the walled watch-only town | — |

## 5.2 THE GENERAL DESK'S FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| G-F1 | "The muster roll at {settlement} is long and current" | CONTRADICTION | roster `Citizen militia` — the muster's only holder (`holderTable.js:280-287`) | — |
| G-F2 | "The watch at {settlement} is a watch and not a garrison" | CONTRADICTION | a garrisoned town reaches WEAK (`10 + 28 × 0.6`); the roster prints `Garrison` | — |
| G-F3 | "counted in … what the hall issues" | STRUCK | a place-metonym of the power | — |
| G-F4 | "{settlement} keeps no muster worth the name" | CONTRADICTION | negates a body the roster may print | — |
| G-F5 | "The watch at {settlement} answers what is reported to it" | SPLIT | KEPT: `hasWatch`. STRUCK: the unrecorded-duty bar (`dutyNamed: 0`) | say what the watch is for |
| G-F6 | "more going on … than the watch troubles itself with" | CONTRADICTION | `hasLawInfra` is satisfied with no watch at all | — |
| G-F7 | "Walls, garrison and stores at {settlement} are all of a piece" | CONTRADICTION | three bodies on a Fortress label reachable without all three | — |
| G-F8 | "{settlement} has walls in the sense that there is a line" | CONTRADICTION | the band is reachable with `hasWalls` false | — |
| G-F9 | "The watch's book at {settlement} is thick" | CONTRADICTION | `hasWatch` (the record word itself is struck) | let the watch keep a thick book — where there is a watch |
| G-F10 | "the watch takes the complaint" | CONTRADICTION | `hasWatch` on a tension read | — |
| G-F11 | "Whatever holds {settlement}'s streets after dark, … not the watch" | CONTRADICTION | negates a body the roster may print | — |
| G-F12 | "The watch's returns at {settlement} are short" | CONTRADICTION | `hasWatch` — the safetyLabel pool fires on watchless towns; *returns* itself is now free | — |
| G-F13 | "The watch … is stretched across more than it can cover" | CONTRADICTION | `hasWatch` | the capacity claim is now free |
| G-F14 | "the fraction is not chosen by the watch" | CONTRADICTION | `hasWatch`; the unnamed chooser is now free | — |
| G-F15 | "the burial rolls run longer than the harvest explains" | STRUCK | a record word (W24) | — |
| G-F16 | "what the market can sell and what the levy can raise" | STRUCK | a capacity phrase, not an existence claim | — |
| G-F17 | "The departure rolls are empty" | STRUCK | a record word | — |
| G-F18 | "{settlement}'s complaint book has more entries opened than closed" | STRUCK | a record word and a comparative — not a count | — |
| G-F19 | "a habit of the gate, not a policy of the hall" | CONTRADICTION | "the gate" imports `hasWalls`; the hall metonym is struck | — |
| G-F20 | "{settlement} has a hall and a seat in it" | CONTRADICTION | an EXISTENCE claim; no hall row below town tier | — |
| G-F21 | "neither holds enough of the hall to end the argument" | STRUCK | a metonym | — |
| G-F22 | "{settlement} kept its own hall through the occupation" | CONTRADICTION | an existence claim across a recorded occupation | — |
| G-F23 | "what is argued in the hall now" | STRUCK | a metonym | — |
| G-F24 | "who will hold the seat next" · "The seat is held firmly enough" | STRUCK | the seat is the power's own class word | — |
| G-F25 | "arrangements the hall would rather not itemise" | STRUCK | a metonym | — |
| G-F26 | "its own hall still governs" · "The occupier collects and does not administer" | STRUCK | a metonym and a class word | — |
| G-F27 | "The seat in {settlement} decides" · "they meet in the market rather than in the hall" | STRUCK | `{govFaction}` exists; the class word was always available | — |
| G-F28 | "{settlement}'s hall put it where it is" | STRUCK | a decreeing body the steading record does not name — silence | keep it |
| G-F29 | "both halls are working to keep those two facts apart" | STRUCK | a metonym ×2 | — |
| G-F30 | "Instructions from {settlement}'s hall are being complied with slowly" | STRUCK | a metonym | — |
| G-F31 | "{settlement}'s hall, and the rooms that matter more" | STRUCK | a metonym | — |
| G-F32 | "the arrangement holds, and it holds on one person's word" | STRUCK | an unnamed person as the load-bearing referent is now licensed | — |
| G-F33 | "rules here have rooms, and the rooms have officers" | STRUCK | the role bar | — |
| G-F34 | "the founders' argument has not yet been improved on" | STRUCK | atmosphere on a founding-age read; no date, no count | — |
| G-F35 | "you will be given a name in {counterpart} more often" | STRUCK | an unnamed person | — |
| G-F36 | "it belongs to a few people on each side" | STRUCK | persons | — |
| G-F37 | "both sides have begun naming individuals rather than practices" | STRUCK | persons | — |
| G-F38 | "a careful eye goes looking for a patron" | STRUCK | a typed power with no read — silence is permission | — |
| G-F39 | "{settlement} pays for its own defense in wages, not only in stone" | CONTRADICTION | DS-GEN-17 GARRISONED's key is satisfied by `walls` · `citadel` · `Watchtower` alone (`priorityHelpers.js:45`) — a pay claim the key denies | — |
| G-F40 | "{faction} holds {band} of the power in {settlement}" | STRUCK | the layer is right; the slots are a wiring defect | — |
| G-F41 | "{settlement}'s trade is strained and its watch is not distracted" | CONTRADICTION | `hasWatch` on a `chain.status` trigger | — |
| G-F42 | "{settlement}'s food chain is strained and its granary is not" | CONTRADICTION | `hasGranary` is a separate boolean the trigger does not read | — |
| G-F43 | "keeps stores against the bad season and care for the bad year" | CONTRADICTION | asserts BOTH disjuncts of `hasGranary ‖ hasHospital` | assert one |
| G-F44-48 | the `hookEscalation.js` stages that bake a council, the watch, a person, an assembly and `{controller}` as an agent | STRUCK | the ENGINE's own strings on the same page (OV-24) — they cannot be a writer's finding, though they are an engine defect (newFindings) | — |
| G-F49-83 | the 35 record-word rows ("the rolls carry it", "the books show", "off the rolls" …) | STRUCK | W24 and the metonym-vs-citation question are struck wholesale; the two wrong-organ cites go with them | write rolls, books, counts, ledgers on any read |

## 5.3 THE ECONOMY DESK'S FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| E-F1 | "the town has arranged its light, its roads and its watch around them" | CONTRADICTION | `hasWatch` on a terrain read, RESOLVED, mounted and player-audible | — |
| E-F2 | "{institution} at {settlement} is open and short of what it works with" | STRUCK | the fill names a row the town HAS; the layer crossing is struck | — |
| E-F3 | "The guilds are losing their grip a little further each season" | CONTRADICTION | `hasGuild` fires on `Thieves' guild` (`priorityHelpers.js:57`) — the roster says which guild | write the guilds where a craft or merchant guild stands |
| E-F4 | "The duties collected fall well short of the trade actually done" | STRUCK | a record word | — |
| E-F5 | "No single trade … is large enough to dictate to the hall" | STRUCK | a metonym and a fused relation | — |
| E-F6 | "The granary doors open more often than they shut" | CONTRADICTION | `hasGranary` | — |
| E-F7 | "The granary door is watched now." | CONTRADICTION | `hasGranary`; the recency word is now free | — |
| E-F8 | "The gate returns are thin in both columns." | STRUCK | *returns* is free and the pool is WIRING-UNRESOLVED (it never fires) | — |
| E-F9 | "A real portion of {settlement}'s trade sits outside the rolls" | STRUCK | recorded as licensed even under the old law | — |
| E-F10 | "The {chain} is on the rolls and off the road." | STRUCK | a record word on authored-only pools | — |
| E-F11 | "{faction} is not paying what he is paying." | STRUCK | a wiring finding (the slot can never render) | — |
| E-F12 | "{faction} takes its portion and has never reached for a second" | STRUCK | a negative history is atmosphere, not an invented date or count | — |
| E-F13 | "Inside it, one name sits on every stage." | STRUCK | an oblique power was a permission dodge; obliquity is now the hook | — |
| E-F14 | "The {chain} runs on {institution}'s craft" | STRUCK | an unwired pool; the fused relation is free | — |
| E-F15 | "{institution} sells work rather than goods." | STRUCK | an institution as an economic agent is now free | — |
| E-F16 | "There is some thieving and some selling without a licence." | STRUCK | a record/instrument word | — |
| E-F17 | "there is nobody guarding the region's roads" | STRUCK | an absence at region scope the record does not deny | — |
| E-F18 | "Merchants operating in the shadow economy have a cost advantage" | CONTRADICTION | `EconomicsTab.jsx:664` — a FROZEN literal with no `dm-only` mark inside a block the annex declares wholly `dm-only` | — |
| E-F19 | "The water is {settlement}'s road and its mill both" | CONTRADICTION | the roster names the mill; `river_mills` is an `infrastructure` resource, not a mill row | write the water as the road |
| E-F20 | "{settlement}'s books close with a margin" (+ 19 `books`/`accounts`/`ledgers` rows) | STRUCK | W24 and the `[ledger]` standpoint question — both struck | — |
| E-F21 | "the market is not empty" on a TOLL-BAR read | STRUCK | a wrong-organ (layer) charge | — |

## 5.4 THE POWER DESK'S FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| P-R1a | "Crime finds little room … and the watch is not the reason" | CONTRADICTION | `hasWatch` on a legitimacy band | — |
| P-R1b | "it governs rationing, the gates and the watch rota" | CONTRADICTION | `hasWalls` + `hasWatch` on a stability string | — |
| P-R1c | "not the harvest, not the watch, not the walls" | CONTRADICTION | a three-body negation against the roster | — |
| P-R1d | "Prosperity and a working watch did what no investigation did" | CONTRADICTION | `hasWatch`; the fused agency is now free | — |
| P-R1e | "the somewhere is the part the watch has never reached" | CONTRADICTION | `hasWatch` | — |
| P-R1f | "is being judged at the granary door, and the granary is not helping" | CONTRADICTION | `hasGranary` | — |
| P-R1g | the hall, 50 occurrences across six blocks | STRUCK | a place-metonym at town+ (the existence case is RT2.4-02) | write the hall |
| P-R1h | "Goods reach {settlement} around the customs rather than through them" | CONTRADICTION | the roster: `Customs house` (`institutionServices.js:530`) | — |
| P-R1i | "moved back into lawful circulation through a clearinghouse" | STRUCK | a body word with no engine row anywhere — silence is permission | keep the clearinghouse |
| P-R1j | "A council falls to unrest rather than to a rival" | STRUCK | the pool's own key IS the `council` ruling-power value | — |
| P-R4a | "the clerks record almost nothing they have had to chase" | STRUCK | `'City Clerk'` is emitted, and the act charge rested on the person bar | — |
| P-R4b | "the exceptions are few enough that the clerks can name them" | STRUCK | as P-R4a | — |
| P-R4c | "the clerks who keep them have stopped chasing what is missing" | STRUCK | as P-R4a | — |
| P-R4d | "enough officials are agreeable for it to be routine" | STRUCK | a person with a disposition is now licensed | — |
| P-R4e | "The person who speaks for {faction} … is not free to speak" | STRUCK | an unnamed person; the `dm-only` mark carries the visibility | — |
| P-R4f | "leaves an operator very few doors to lean on" | STRUCK | a criminal person unnamed | — |
| P-R4g | "A leader who bound the combination … left the seat" | STRUCK | an unnamed leader | — |
| P-R4h | "a ruler with the town behind them can do things" | STRUCK | the maxim-frame rule (W5) policed construction | — |
| P-R5a | "A house that keeps re-learning who it answers to gets less done" | STRUCK | a fused agent — silence | — |
| P-R5b | "Somebody well down inside {faction} … is answering elsewhere" | SPLIT | KEPT: `{faction}` renders the RULING STRUCTURE's own name, so the accusation lands on the governing body (`powerStateProse.js:900-901`). STRUCK: the person, the depth and the relation | keep the somebody; not inside that slot |
| P-R5c | "A small interest buys a great deal here" | STRUCK | a power-layer purchase on an unread scalar — silence | — |
| P-R5d | "{faction} outweighs everyone who wants the {seat}" | CONTRADICTION | both slots render the SAME STRING (`powerStateProse.js:860`) — one actor outweighing itself | — |
| P-R2 | `{seat}` + `{faction}` from one `governing` | CONTRADICTION | `powerStateProse.js:875-876`, `:909`, `:953`, `:962` | — |
| P-R3 | DS-POW-6's `{faction}` documented as the captured house, filled with the governing body | CONTRADICTION | `powerStateProse.js:900-901`, `:962` | — |
| P-R6 | "{settlement} has a governing body and it has a government" | CONTRADICTION | `factionDynamics.js:132-133` — a second unnamed power coextensive with the band | — |
| P-W1 | DS-POW-1's card: "NAMED BUT NEVER FILLED: {seat}" while 38 of 41 variants carry it | CONTRADICTION | `resolveBag` first-match at `powerStateProse.js:634` — the instrument denies the leaf | — |
| P-W2 | DS-POW-5's card licenses the COURT's bloc record on a ruling-power classification pool | CONTRADICTION | `powerStateProse.js:709-713` — a layer error created by the instrument | — |

## 5.5 THE STRESSORS DESK'S FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| S-F1 | "The garrison is the danger. It drilled at midnight without orders" | SPLIT | KEPT: `hasGarrison` — the roster may carry no garrison. STRUCK: the "invented" charge; the sentence is the engine's own hook (`stressorDynamics.js:689`) | keep the drill, on a garrisoned town |
| S-F2 | "armed, disciplined, and already inside the walls by right" | CONTRADICTION | `hasWalls` | — |
| S-F3 | "the houses that finance {settlement} have decided to finance something else" | STRUCK | a class plural and a decision — both free | — |
| S-F4 | "it is being asked from a pulpit" | CONTRADICTION | `hasChurch` / the roster's religious rows | write the asking; the pulpit needs a house |
| S-F5 | "Wards around the council hall have failed more than once" | STRUCK | the engine's own hook (`:701`); the per-institution failure is silence | — |
| S-F6 | "A rump session voted itself emergency powers while the chamber stood" | STRUCK | the engine's own hook (`:705`) | — |
| S-F7 | "The garrison is quartered inside the walls" | CONTRADICTION | `forces.garrison.present` + `hasWalls` — the occupier's force in the town's own bucket word | write the occupier's men |
| S-F8 | "the treasury and the thin garrison, not in the walls" | STRUCK | a dark pool with no read; it never fires | — |
| S-F9 | "Garrisons, administrators and suppression tie down strength" | STRUCK | a dark pool carrying the producer's own description | — |
| S-F10 | "The watch's patrols at {settlement} have been rewritten" | CONTRADICTION | `hasWatch` — `'local watch'` prints below town only where the flag resolves | write patrols (`patrol` is a `force`-class token) |
| S-F11 | "{settlement} keeps more watch than it can afford" | STRUCK | "keeps watch" is definitional and the watch arms BOTH purses (`defenseGenerator.js:244-253`) — the pay read is licensed | — |
| S-F12 | "The levies of a drowning treasury finally broke the commons" | STRUCK | VERBATIM the record's own `reason` (`stressorDynamics.js:844`) | — |
| S-F13 | "the town's own hall now advises rather than decides" (+2) | SPLIT | KEPT: at thorp there is no hall of any kind — the roster denies it. STRUCK: the hall-as-agent bar | write the hall deciding, at town and up |
| S-F14 | "{settlement}'s granary holds… issued by rule rather than by price" | CONTRADICTION | `hasGranary` | write the issuing rule |
| S-F15 | "The market has grain, and the price of it has become" | CONTRADICTION | `hasMarket` / the roster at small tiers | write the price |
| S-F16 | "The altars… are tended and the tending is new" | CONTRADICTION | the roster's religious rows; the recency is now free | — |
| S-F17 | "claim the same seal, the same office and the same tax" | STRUCK | the engine's own hook (`:706`) | — |
| S-F18 | "now a person with dangerous knowledge and no protection" | STRUCK | an unnamed person — the ADDENDUM 14 example | — |
| S-F19 | "the clerks have quietly decided which to obey" | STRUCK | an unnamed role with agency | — |
| S-F20 | "The overseers keep order in the daylight hours" | STRUCK | `'overseer'` is an engine role token; the agency is now licensed | — |
| S-F21 | "Collectors travel in pairs, then in fours, and lately not at all" | STRUCK | the engine's own hook (`:717`) | — |
| S-F22 | "officers loyal to the ruler are posted to the walls one by one" | SPLIT | KEPT: `hasWalls`. STRUCK: the role plural, the loyalty and the person-shaped "ruler" (the hook says "loyal to the seat") | keep the posting, on a walled town |
| S-F23 | "the healers are the busiest people here" | STRUCK | already REFUTED: `'healer'` is a role token, a catalog row and a mandated role | — |
| S-F24 | "Scouts could put a name to it; nobody has yet" | STRUCK | the hook `:679` | — |
| S-F25 | "the mages responsible shrug" · "Hedge wizards are leaving {settlement} quietly" | STRUCK | engine role tokens; the movement claims are free | — |
| S-F26 | "Two officials claim the same seal… The town pays whichever collector" | STRUCK | the hook `:706` | — |
| S-F27 | "The soldiers here have stopped being the seat's instrument" | STRUCK | a collective person with an intention | — |
| S-F28 | "keeps more watch" vs "The watch's patrols" on one Overview page | STRUCK | an activity and a body under one word misinform no reader | — |
| S-F29 | "The factions each hold enough to block and none hold enough to rule" | CONTRADICTION | `powerStructure.factions[].power` printed on the Power surface — an arithmetic the page can deny | write the deadlock without the arithmetic |
| S-F30 | "The resistance is bleeding the garrison… costs the occupier more each season" | STRUCK | a dark pool; the three-party relation is silence | — |
| S-F31 | DS-STR-2's anaphora ("the trouble", "this") binding to the DS-STR-1 banner above | CONTRADICTION | `.find()` chooses a DIFFERENT record class — the page attaches the sentence to the wrong crisis | name the crisis |
| S-F32 | `INFILTRATED` #5 tagged `[ledger · dm-only]` on a `covert: false` row | STRUCK | an instrument mismatch | — |
| S-F33 | "reaches past the person responsible" · "somebody it had reason to trust" | STRUCK | unnamed persons | — |
| S-F34 | "issued against a list" · "tally" · "bill" | STRUCK | record words | — |

## 5.6 THE WARFAITH DESK'S FINDINGS

| id | quote | verdict | field / ground | a writer may now |
|---|---|---|---|---|
| W-1 | "The hall still sits, the market still opens" | CONTRADICTION | two EXISTENCE claims (`hasMarket`, the hall row) on an Occupied read touching no institution | — |
| W-2 | "neither soldiers nor temples worth remarking on" | CONTRADICTION | a Garrison + Parish church town draws it — the negation denies the roster | — |
| W-3 | "the shrines answer to no named god" | CONTRADICTION | the roster's religious rows (`Wayside shrine` never consulted) | the deity half is lawful — no predicate on a deity |
| W-4 | "shrines at crossroads and doorframes, none of them a creed's" | CONTRADICTION | as W-3 | keep the crossroads |
| W-5 | "Its shrine is real, its calendar is observed" | CONTRADICTION | a body existence claim from a SHARE band | write the calendar |
| W-6 | "a real congregation, a real house" | CONTRADICTION | a house asserted from a share band; the person-totality is free | — |
| W-7 | "Shrines stand unclaimed, and an arriving creed would find space" | STRUCK | the pool is not routed | — |
| W-8 | "The creed followed the garrison, and the calendar changed" | CONTRADICTION | `hasGarrison` | — |
| W-9 | "Its shrines are closed, its days unmarked" | CONTRADICTION | a body claim from a cause token | write the unmarked days |
| W-10 | "the clerks who load them have stopped remarking" | STRUCK | a role plural + an organ word | — |
| W-11 | "nobody in the hall can say in advance which demand" | STRUCK | a person-plural inside a metonym | — |
| W-12 | "the not-spending is a choice somebody made" | STRUCK | an unnamed decider | — |
| W-13 | "Somebody at {settlement} is being funded from outside" | STRUCK | an unnamed person; the `dm-only` mark carries the visibility | — |
| W-14 | "There are people at the hall who are not the town's" | STRUCK | a person-plural | — |
| W-15 | "a decision nobody in the hall has been willing" | STRUCK | as W-11 | — |
| W-16 | "Its shepherd holds an ordinary clerical post under another creed's" | STRUCK | an unnamed person; the field has no writer so the pool is undrawable | — |
| W-17 | "Its clergy speak with the confidence of people who" | CONTRADICTION | `governanceNarrative.js:128-130` conditions "the clergy" on a church / cathedral / parish row | — |
| W-18 | "its clergy speak to rulers rather than about them" | CONTRADICTION | as W-17; the "rulers" plural is now free | — |
| W-19 | "What its councils say about the lawfulness of magic" | STRUCK | an organ invented for a creed — silence is permission | keep the councils |
| W-20 | "The faith's treasury is full. It is among the richest" | STRUCK | `templeWealth` has no writer; the pool is unroutable | — |
| W-21 | "the ruler's writ carries a weight the office alone" | STRUCK | bare organ and role words | — |
| W-22 | "in the rolls, in the feast days, in who" | STRUCK | record words on a dark pool | — |
| W-23 | the seat: "The installed seat at {settlement} still sits" vs "It holds the seat on numbers alone" | CONTRADICTION | `treatyDocument.js:73` vs `religionState.js:620` — a treaty-installed POWER and a FAITH standing under one word, both authored here | name which seat |
| W-24 | the garrison: the occupier's expense vs "The creed followed the garrison" | CONTRADICTION | `occupationStatus.js:95-103` (no garrison field) + `hasGarrison` | — |
| W-25 | the muster: "answers {counterpart}'s muster" vs "no muster gathers where the terms forbid one" | CONTRADICTION | `treatyDocument.js:58` vs `:63` — opposite directions, one word, adjacent pools | seat the possessor |
| W-26 | the court as the record's keeper and as a room with a door on one page | STRUCK | both senses are true of a court | — |
| W-27 | "the garrison at {settlement} is stronger for the occupier's other" | CONTRADICTION | `holderTable.js:599-615` — `occupierHoldings.*` is the OCCUPIER's position; the slot roles are inverted against the reader | — |
| W-28 | "what the ruling power asks, the patron's clergy have already" | STRUCK | a fused sequencing relation — silence | — |
| W-29 | "the shortness is felt at the harvest and the gate" | CONTRADICTION | `hasWalls` / `hasGates` on a deployment read | — |
| W-30 | the three PLAYER `mobilization:` pools carded `audience: DM only` | STRUCK | an instrument defect (`row.covert` reads the token) | — |
| W-31 | `mobilization: COVERT` vs DS-WAR-5's `posture COVERT`, fenced by a note | STRUCK | the fence is vacuous while DS-WAR-5 is dark | — |
| W-32 | "the clerks who load them" · "the observers are seeing less than they are owed" | STRUCK | the `[ledger]` standpoint promoted into an organ with agents | — |
| W-33 | the desk's 20 `[elder]` variants | STRUCK | an angle tag is not a body | — |
| W-34 | "{settlement} answers {counterpart}'s muster" | CONTRADICTION | `warFaithStateProse.js:930-933` — the slot fills from the occupier or the siege party, never the signatory | — |
| W-35 | `occupierHoldings.*`'s muster citation | CONTRADICTION | `holderTable.js:599-615` — the OCCUPIED town's militia cited for the OCCUPIER's overextension | — |

---

## NEW FINDINGS — real contradictions this slice's research shows that no bar ever stated

These are not re-classifications. They are page-level or engine-level self-contradictions the tables uncovered while answering a different question. Each is a refuter's finding under floor 1 today, or a wiring row the chair should charter.

1. **A Hireling-hall town contradicts itself with no face involved.** `priorityHelpers.js:49-51` sets `hasMercenary: true` while `defenseInstitutionBuckets.js:98-100` leaves `forces.mercenary.present: false` (the row is in two FLAGS and NO bucket). No sentence can satisfy both surfaces. (OV-7, RT2.2-04, RT2.6-08.)
2. **A thorp with a `Household levy` prints a roster row beside a projection denying it.** `institutionalCatalog.js:104` seats the levy; `defenseStateProse.js:1273-1274` renders `NO organized force at all`. (OV-27, RT2.1-39.)
3. **Custom content is invisible to the buckets and visible to the security regex.** The buckets and `linkToInst` test `nativeSemanticName`, which returns `''` for materialized custom rows (`customContentSemanticAuthority.js:40-48`), while `SECURITY_INSTITUTION_RE` and `nameMatches` test raw `inst.name` (`corruption.js:665-666`). A custom "Night Watch" is a corruptible security body that the defense projection prints as absent — the roster and the projection disagree on the same page. This is the custom-content parity question of FOLD 59 arriving as a truth defect.
4. **DS-GEN-17 GARRISONED's own gloss is false of its key.** The gloss says "a force the town PAYS for"; the key is satisfied by `walls` · `citadel` · a `Watchtower` alone (`priorityHelpers.js:45`). A writer briefed by the gloss writes a pay claim the key denies. (G-F39, OV-6.)
5. **The licence card lies about audience on three shipped PLAYER pools.** `row.covert = reads.some(isCovertPath)` reads the TOKEN, not the branch, so DS-WAR-1's three non-covert `mobilization:` cards print `audience: DM only` (`wiringCensus.js:1681`; `warFaithStateProse.js:251-262`). (W-30, OV-36, VIS-09.)
6. **A covert-economy sentence is player-audible today.** DS-ECO-6's two canonical-at-zero rows are FROZEN component literals with no `dm-only` mark inside a block the annex declares wholly `dm-only` (`economy.generated.js:1595`; `EconomicsTab.jsx:664`). (E-F18, VIS-14.)
7. **The power desk prints one actor as two.** `{seat}` and `{faction}` fill from ONE `governingName` string (`powerStateProse.js:860`, `:875-876`), and DS-POW-6's `{faction}` is documented as the CAPTURED HOUSE while filled with the GOVERNING body — so an accusation lands on the wrong power by the fill, not by the writer. (P-R2, P-R3, P-R5b, P-R5d.)
8. **`occupierHoldings.*` cites the wrong town.** The muster holder resolves on the settlement passed, so the OCCUPIED town's militia is cited for the OCCUPIER's overextension (`holderTable.js:599-615`). (W-27, W-35, OV-5.)
9. **DS-POW-1's card prints the wrong slot bag.** `resolveBag` first-match at `powerStateProse.js:634` tells a writer the block may name `{npc}` and may NOT name `{seat}` — the inverse of the leaf, where 38 of 41 variants carry `{seat}`. (P-W1.)
10. **A page-level referent error no per-pool bar can see.** DS-STR-2's anaphora binds to the DS-STR-1 banner above it, a different record class chosen by `.find()` — the sentence attaches to the wrong crisis (`:4222-4224`, `:4403-4405`). Under the re-cut this is exactly floor 1 and it needs a PAGE-grain refuter, not a pool-grain one.
11. **`'Unknown Faction (hidden)'` reaches a player face.** `stressFactions.js:105-107` gives it power 15 and the note "its presence is not known to the settlement"; `properFill` does not reject `(hidden)`; DS-POW-4 Contested/Critical carry 0 `dm-only` marks. (PS-10, VIS-16.)
12. **The engine's own voice gives "the muster" two opposite referents on one page.** `treatyDocument.js:58` ("the compelled banner still answers the muster" — the COUNTERPART's call) against `:63` ("no muster gathers where none is allowed" — the TOWN's arms). The contradiction ships today with no corpus sentence involved. (W-25, OV-34.)
13. **The safety label is reachable with NO law body at all** — a thorp reads `Moderate` off a community bonus (`safetyProfile.js:56-62`). Every "the watch"/"the guard" sentence on a safety-label read is therefore a LIVE label trap, not a hypothetical, and `safetyProfile.js:300` prints "There is no meaningful guard presence." on the same panel. (D-F2, RT2.1-47.)

### TWO GAPS IN THE FOLD'S OWN VOCABULARY (the chair may want to rule)

- **Floor 2 (THE PROMISE) has no verdict token.** CONTRADICTION · MODEL · SCOPE · STRUCK cover floors 1, 4 and 3. Nothing in this slice turned on an invented date or count once the comparatives were struck, so I have used no token for it — but a refuter needs one, because "forty on the roll" contradicts no field and must still fail.
- **Visibility with no field has no floor.** VIS-12 (foreign funding) and VIS-18 (the desks' §0e editorial marks) rest on AUTHORED marks alone. Under the four floors as written, a player face carrying them is unrefutable. Either the audience contract becomes a fifth floor or the leaks are accepted; I have marked those two STRUCK and kept every visibility row with a real `covert` field as CONTRADICTION.
