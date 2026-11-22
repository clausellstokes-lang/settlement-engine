### tests/data/catalogGuildTag.test.js
the three villages of CENSUS-4c unit 1 soak1k-236 and -320: the guild atom is false and no Guild Master is crewed
AssertionError: neither village holds a guild atom or crews a Guild Master — 1 of 2 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] 236 — soak1k-236: expected true to be false // Object.is equality: expected [ Array(1) ] to deeply equal []

### tests/generators/arcaneAdvisoryReadsTheSeat.test.js
TAIL-POWERS-B-2 batch 6a · the arcane advisory line reads the seat r2s-occupied-city-3: an Arcane Council governs; the practitioners are not called unempowered, and take the twin
AssertionError: LIVENESS ANCHOR [r2s-occupied-city-3: the twin prints where the advisory line is refused]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'The Arcane Council keeps the seat, bu…' to contain 'Magical practitioners outside the sea…'

### tests/generators/bar2PayAndGrain.test.js
BAR2-LABELS-2 batch 4: the defenders' pay reads the military gate (LB4); the need line reads the food record (LB6) NOT "irregular pay" where the gate is 1 (the paid-in-full twin prints); KEEP: below 1 it stands
AssertionError: the irregular-pay line reads the gate — 2 of 3 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[1] r2r-city-6 — r2r-city-6: the gate: expected 0.88 to be 1 // Object.is equality
[2] r2r-metropolis-0 — r2r-metropolis-0: the gate: expected 0.76 to be 1 // Object.is equality: expected [ …(2) ] to deeply equal []

### tests/generators/bar2PayAndGrain.test.js
BAR2-LABELS-2 batch 4: the defenders' pay reads the military gate (LB4); the need line reads the food record (LB6) NOT "chronically underfunded" where the gate is 1 (the funded twin prints); KEEP: below 1 it stands
AssertionError: the validator's funding reason reads the gate — 1 of 3 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[2] r2r-metropolis-2 — r2r-metropolis-2: the gate: expected 0.76 to be 1 // Object.is equality: expected [ Array(1) ] to deeply equal []

### tests/generators/bar2PayAndGrain.test.js
BAR2-LABELS-2 batch 4: the defenders' pay reads the military gate (LB4); the need line reads the food record (LB6) THE LAW, on every birth above: a gate of 1 never prints irregular pay or underfunding; a gate below 1 never prints well paid
AssertionError: expected 11 to be greater than or equal to 13

### tests/generators/bar2People2Trade.test.js
BAR2-PEOPLE-2 · a rivalry claims a shared trade only where the pair shares one (PP3, PP3a, PP3b) KEEP r2r-town-15: "Every client Juliana Kamytzes wins is one Julian…" still prints
AssertionError: expected '{"relationships":[{"id":"tie_npc_barr…' to contain 'Every client Juliana Kamytzes wins is…'

### tests/generators/bar3PeoplePowers.test.js
BAR3-PEOPLE · the note names a decider only where no relation row of the pair speaks (P2) r2r-village-1: not "Holds the title; the decisions that matter are made by Merchant Guilds."; the rest of the note prints
AssertionError: expected '' to contain 'Holds the title, but the decisions th…'

### tests/generators/bar3PeoplePowers.test.js
BAR3-PEOPLE · the note names a decider only where no relation row of the pair speaks (P2) r2r-village-9: not "Holds the title; the decisions that matter are made by Religious Authorities."; the rest of the note prints
AssertionError: expected '' to contain 'Holds the title, but the decisions th…'

### tests/generators/bar3PeoplePowers.test.js
BAR3-PEOPLE · the note names a decider only where no relation row of the pair speaks (P2) r2r-village-41: not "Holds the title; the decisions that matter are made by Religious Authorities."; the rest of the note prints
AssertionError: expected '' to contain 'Holds the title, but the decisions th…'

### tests/generators/bar3PeoplePowers.test.js
BAR3-PEOPLE · the note names a decider only where no relation row of the pair speaks (P2) KEEP r2r-thorp-25: the note still names People's Council
AssertionError: expected '' to contain 'Holds the title; the decisions that m…'

### tests/generators/bar3PeopleTies.test.js
BAR3-PEOPLE · a vote from a seat, a trade taught shared, the tie's one state (P1, P5) KEEP r2r-town-14: "Hassan al-Basri took Badr ibn Khaldun in as an a…" still prints
AssertionError: expected '{"relationships":[{"id":"tie_npc_merc…' to contain 'Hassan al-Basri took Badr ibn Khaldun…'

### tests/generators/bar3PlacesRows.test.js
BAR3-PLACES: the rows read the town the flagged line no longer prints, and its slot says what the record bears (every row)
AssertionError: the flagged line no longer prints — 1 of 34 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[21] ["C18651 no power over the seat","r2r-town-54",{},{}] — C18651 no power over the seat r2r-town-54: what prints instead: expected '{"name":"Erdenbuurt","tier":"town","p…' to match /has a say the official seat must reck…/: expected [ Array(1) ] to deeply equal []

### tests/generators/bar3PlacesRows.test.js
BAR3-PLACES-2: the routed rows read the town the flagged line no longer prints, and its slot says what the record bears (every row)
AssertionError: the flagged line no longer prints — 1 of 14 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] ["C6485 the profiteer under the war (the read town)","bar0-city-wartime-rand-6",{},{}] — C6485 the profiteer under the war (the read town) bar0-city-wartime-rand-6: what prints instead: expected '{"name":"Nanpu","tier":"city","popula…' to match /"role":"profiteer","reason":"no one i…/: expected [ Array(1) ] to deeply equal []

### tests/generators/bar3PowersLines.test.js
BAR3-POWERS · a power line claims no more than the record bears (P3) C45570 r2r-village-46: "they are waiting for a chance to push back" refused; ", close enough to matter and too far behind to lead." prints instead
AssertionError: expected 'Armed patrol of able-bodied residents…' to contain ', close enough to matter and too far …'

### tests/generators/bar4HistoryOneTelling.test.js
BAR4-HISTORY T1: one past event, one telling (e) C26792: an accepted seat's legitimacy tension says most accept it (red at the base in each of the eight)
AssertionError: C26792: no "widely questioned" beside an accepted seat — 4 of 8 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] r2r-city-12 — expected false to be true // Object.is equality
[4] r2r-metropolis-21 — expected false to be true // Object.is equality
[6] r2s-infiltrated-metropolis-0 — expected false to be true // Object.is equality
[7] r2s-religious_conversion-city-1 — expected false to be true // Object.is equality: expected [ …(4) ] to deeply equal []

### tests/generators/bar4HistoryOneTelling.test.js
BAR4-HISTORY T1: one past event, one telling (e2) C26792: the twin prints only beside an accepted seat (r2s-infiltrated-hamlet-0: accepted at the history step, Tolerated at the end)
AssertionError: expected 'Most here accept the current authorit…' to match /openly and widely questioned/

### tests/generators/bar4HistoryOneTelling.test.js
BAR4-HISTORY T1: one past event, one telling (f) C26792: the history section regeneration derives the same line (the chair's condition 3)
AssertionError: C26792: a regenerated history says what the born one says of an accepted seat — 1 of 3 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] r2r-city-12 — expected [ Array(1) ] to deeply equal []: expected [ Array(1) ] to deeply equal []

### tests/generators/bar4HistoryOneTelling.test.js
BAR4-HISTORY T1: one past event, one telling (h) C14176: the rank-1 power that could take a Contested seat says so (red at the base in each)
AssertionError: C14176: the challenger is not told it is too far behind — 2 of 5 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[1] r2s-religious_conversion-village-0 — expected 'The breakaway side in the religious s…' to contain 'Close enough now to contest the seat,…'
[4] bar0-city-under_siege+famine-rand-110 — expected 'City watch; it answers for keeping or…' to contain 'Close enough now to contest the seat,…': expected [ …(2) ] to deeply equal []

### tests/generators/bar7Lines.test.js
BAR7-LINES: seven single writers, each in its own words low.agree: a plural cause takes a plural verb
AssertionError: POSITIVE: the plural cause is still named in the sample: expected 0 to be greater than 0

### tests/generators/bar7Scenes.test.js
BAR7-SCENES item 3 (9g.margin, the chair's PM1): the war's requisition row denies no margin the purse holds C15153 · bar0-city-wartime-rand-43: a Comfortable purse; the row names the requisition and says no "cannot afford" or "running thin"
AssertionError: expected 'Moderate' to be 'Comfortable' // Object.is equality

### tests/generators/bar8People.test.js
BAR8 K-PEOPLE (13b) · a tie that holds someone inside stands where a prison does THE POSITIVE: a town with a prison keeps the held friend (r2r-city-10)
AssertionError: expected false to be true // Object.is equality

### tests/generators/bar8People.test.js
BAR8 K-PEOPLE (14b) · no house's network is handled only by another house whose own network it handles (BR13) THE POSITIVE: a network handled one way by another house's face stands (the deal's design, r2r-city-10)
AssertionError: expected false to be true // Object.is equality

### tests/generators/bar8Powers.test.js
BAR8-K-POWERS: a power's own words are true of that power and of the place 13g: where the guild has bought the seat, no card calls the tie a war of arrests
AssertionError: r2r-city-5: an adversarial tie: expected true to be false // Object.is equality

### tests/generators/churchNoteReadsFlag.test.js
the church-economy note reads the flag a theocratic economy whose situation sentence is suppressed still carries its note
AssertionError: expected false to be true // Object.is equality

### tests/generators/conflictRelationsTwin.test.js
TAIL-POWERS-B-2 · P19: a pair at HIGH conflict is not called a stable bargain r2s-religious_conversion-metropolis-1: Grand Merchant Oligarchy ~ Military/Guard names the quarrel and escalates
AssertionError: expected [ 'symbiotic', 'dependent' ] to include 'competitive'

### tests/generators/conflictRelationsTwin.test.js
TAIL-POWERS-B-2 · P19: a pair at HIGH conflict is not called a stable bargain KEEP: every other row of those towns is kept as drawn (no twin where the pair is not at HIGH)
AssertionError: every row of those towns not at HIGH is kept as drawn — 1 of 3 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[2] ["r2s-religious_conversion-metropolis-1","Grand Merchant Oligarchy","Military/Guard"] — expected 'The Noble Houses live under the rule …' not to match /Even so, the two are now at odds/: expected [ Array(1) ] to deeply equal []

### tests/generators/defenceParts.test.js
defence is the sum of its parts the printed prosperity label is the label the tree printed before this lane (pinned at e1b2f9c1f)
AssertionError: expected { …(16) } to deeply equal { …(16) }

### tests/generators/defenceParts.test.js
the martial will (R13, R14) R13: where something is built or standing, the will counts no more than the armed bodies that carry it
AssertionError: v3build-village-3: expected 6.9 to be less than or equal to 6.8

### tests/generators/defenceParts.test.js
the martial will is not paid on the hired branch either (W3) RED-FIRST: where only a hired body stands, the will at the standing pay equals the will at full pay
AssertionError: on every hired-only birth the will at the standing pay equals the will at full pay — 5 of 10 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] ["rv2-calm-hamlet-9",{"name":"Ravenki","tier":"hamlet","population":41,"institutions":[{"category":"Economy","name":"... — rv2-calm-hamlet-9: paid short: expected 1 to be less than 1
[2] ["rv2-calm-hamlet-28",{"name":"Huaan","tier":"hamlet","population":76,"institutions":[{"category":"Economy","name":"S... — rv2-calm-hamlet-28: paid short: expected 1 to be less than 1
[4] ["rv2-calm-village-1",{"name":"Somapuram","tier":"village","population":233,"institutions":[{"category":"Economy","na... — rv2-calm-village-1: paid short: expected 1 to be less than 1
[6] ["rv2-calm-village-38",{"name":"Kripavaram","tier":"village","population":392,"institutions":[{"cat

### tests/generators/faultsWatch.test.js
8 · the court's ties print only where a court sits (FR25) NEGATIVE: where a courthouse sits (bar0-city-wartime-rand-36) both lines still print
AssertionError: the judge: expected false to be true // Object.is equality

### tests/generators/faultsWatch.test.js
8 (c) · the standing names courts only where a court sits (FR25 (c)) NEGATIVE: beside a courthouse (bar0-metropolis-calm-rand-40) the standing keeps its courts
AssertionError: expected false to be true // Object.is equality

### tests/generators/headOfItsPowerRow.test.js
COHERENCE-POWERS-8 · the head of its power is not under its leaders rr2s-city-calm-rand-1: the first of Arcane Orders heads the casters; the first of the Thieves' Guild holds no place "in a crew"
AssertionError: expected undefined to be 'Heads the casters among bribe-taking …' // Object.is equality

### tests/generators/headOfItsPowerRow.test.js
COHERENCE-POWERS-8 · the head of its power is not under its leaders rr2s-metropolis-plague_onset-port-1: Bebinn MacIntyre, the guild archmage, heads the casters
AssertionError: expected 'Heads the casters while the seat fail…' to be 'Heads the casters while many doubt th…' // Object.is equality

### tests/generators/powersReadTheRosterP31.test.js
TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land r2r-town-34: not "The Merchant Guilds and the Craft Guilds vote to…"; prints "The Merchant Guilds and the Craft Guilds…"
AssertionError: LIVENESS ANCHOR [r2r-town-34: the cured line]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected '{"factions":[{"faction":"Guild Counci…' to contain 'The Merchant Guilds and the Craft Gui…'

### tests/generators/powersReadTheRosterP31.test.js
TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land r2r-metropolis-39: not "Three powers stand almost level here…"; prints "Five powers stand almost level here, and…"
AssertionError: LIVENESS ANCHOR [r2r-metropolis-39: the cured line]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected '{"factions":[{"faction":"The Independ…' to contain 'Five powers stand almost level here, …'

### tests/generators/powersReadTheRosterP31.test.js
TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land r2r-village-12: the Religious Authorities's card does not say "Clergy are present but operate at the ma…"; it says "The faith holds no office in the hall, b…"
AssertionError: LIVENESS ANCHOR [r2r-village-12: the Religious Authorities's card]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Clergy are present but operate at the…' to contain 'The faith holds no office in the hall…'

### tests/generators/powersReadTheRosterP31.test.js
TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land KEEP r2s-politically_fractured-metropolis-1: "Clergy are present but operate at the margins of…" still prints
AssertionError: expected '{"factions":[{"faction":"Thieves\' Gu…' to contain 'Clergy are present but operate at the…'

### tests/generators/powersReadTheRosterP31.test.js
TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land KEEP r2s-succession_void-metropolis-3: "Three powers stand almost level here…" still prints
AssertionError: expected '{"factions":[{"faction":"Merchant Gui…' to contain 'Three powers stand almost level here'

### tests/generators/prosperityStanding.test.js
the standing label (R3): the label with no crisis in force, stored by prosperity's writer the printed label is the label the tree printed before the change, on every pin
AssertionError: expected { …(13) } to deeply equal { …(13) }

### tests/generators/prosperityStanding.test.js
the standing label (R3): the label with no crisis in force, stored by prosperity's writer economicState.prosperityStanding is the probe's reading, on every pin
AssertionError: expected { …(13) } to deeply equal { …(13) }

### tests/generators/prosperityStanding.test.js
the standing label (R3): the label with no crisis in force, stored by prosperity's writer the stores are laid by at the standing label's share
AssertionError: expected { 'v3build-thorp-0': 1.4, …(12) } to deeply equal { 'v3build-thorp-0': 1.4, …(12) }

### tests/generators/prosperityStanding.test.js
the standing label (R3): the label with no crisis in force, stored by prosperity's writer keepOfRecord reads the standing label, and an old save without it reads the label it has
AssertionError: v3build-hamlet-2: expected { bought: 0.9, funded: 1 } to deeply equal { bought: 0.75, funded: 0.7 }

### tests/generators/relationLinesSayTheRecord.test.js
TAIL-POWERS-B batch 1 · the relation lines say what the record holds r2r-hamlet-5: not "the commander's agreement"
AssertionError: prints instead: is now about as strong as: expected 'The Elder Council gives the orders an…' to contain 'is now about as strong as'

### tests/generators/relationLinesSayTheRecord.test.js
TAIL-POWERS-B batch 1 · the relation lines say what the record holds r2r-metropolis-39: not "Noble Houses live under the rule of"
AssertionError: prints instead: Noble Houses still have their titles: expected 'The Grand Council needs the taxes and…' to contain 'Noble Houses still have their titles'

### tests/generators/rosterDuplicateDraws.test.js
REVIEW-INTAKE-4 — no roster carries one secret or one goal twice the corpus is live: the 1,000 births carry rosters of two or more
AssertionError: expected 890 to be 889 // Object.is equality

### tests/generators/standingReadsTheRivalItRead.test.js
TAIL-POWERS-B-3 batch 7 · a standing line reads the rival it read and the strength of its own card r2r-city-45 (Religious Authorities): "The arcane orders have more say right now, and the" does not print; "Arcane Council has more say right now, and the clergy cannot" prints instead
AssertionError: LIVENESS ANCHOR [r2r-city-45 (Religious Authorities)]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Church holds substantial temporal pow…' to contain 'Arcane Council has more say right now…'

### tests/generators/standingReadsTheRivalItRead.test.js
TAIL-POWERS-B-3 batch 7 · a standing line reads the rival it read and the strength of its own card r2r-city-19 (Thieves' Guild): "Criminal network operating in shadows; controls il" does not print; "Criminal network operating in shadows; it keeps out of the l" prints instead
AssertionError: LIVENESS ANCHOR [r2r-city-19 (Thieves' Guild)]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Criminal network operating in shadows…' to contain 'Criminal network operating in shadows…'

### tests/generators/standingReadsTheRivalItRead.test.js
TAIL-POWERS-B-3 batch 7 · a standing line reads the rival it read and the strength of its own card r2r-metropolis-25 (Thieves' Guild): "Criminal network operating in shadows; controls il" does not print; "Criminal network operating in shadows; it keeps out of the l" prints instead
AssertionError: LIVENESS ANCHOR [r2r-metropolis-25 (Thieves' Guild)]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Organised criminal network controls t…' to contain 'Criminal network operating in shadows…'

### tests/generators/standingReadsTheRivalItRead.test.js
TAIL-POWERS-B-3 batch 7 · a standing line reads the rival it read and the strength of its own card r2s-religious_conversion-metropolis-0 (Thieves' Guild): "the nominal government tolerates this because it c" does not print; "Underworld effectively controls vice and key officials; the " prints instead
AssertionError: LIVENESS ANCHOR [r2s-religious_conversion-metropolis-0 (Thieves' Guild)]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Underworld effectively controls vice,…' to contain 'Underworld effectively controls vice …'

### tests/generators/stressFactionsClaimWhatTheRecordHolds.test.js
TAIL-POWERS-B-3 batch 6b · the stress factions and the bread hook claim what the record holds r2s-religious_conversion-village-3: "claiming the legitimate succession" does not print; "One of two rival sides, each claiming to be the true faith: the legal standing of their records is contested." prints instead
AssertionError: LIVENESS ANCHOR [r2s-religious_conversion-village-3]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected '{"name":"Archodion","tier":"village",…' to contain 'One of two rival sides, each claiming…'

### tests/generators/stressFactionsClaimWhatTheRecordHolds.test.js
TAIL-POWERS-B-3 batch 6b · the stress factions and the bread hook claim what the record holds r2r-city-10: "a baker says he was told to raise it" does not print; "Bread went up twice this month, and one of the sellers says they were told to raise it." prints instead
AssertionError: LIVENESS ANCHOR [r2r-city-10]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected '{"name":"Dharmamandal","tier":"city",…' to contain 'Bread went up twice this month, and o…'

### tests/generators/stressLateReRead.test.js
the insurgency summary: the strong line needs a rival of standing ON THE SETTLED RECORD each RIVAL seed holds a rival of standing at the end and prints the strong line (red at 3f45e6fa9: the plain line) (every row)
AssertionError: every RIVAL seed holds a rival of standing at the end and prints the strong line — 1 of 4 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] r2r-thorp-25 — r2r-thorp-25 holds a rival of standing at the end: expected false to be true // Object.is equality: expected [ Array(1) ] to deeply equal []

### tests/generators/tailNarrativeRows.test.js
B1 the narrative text rows read the town (TAIL-NARRATIVE batch 1) the flagged sentence no longer prints, and its slot says what the town bears (every row)
AssertionError: the flagged sentence no longer prints — 1 of 22 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[18] ["03831","r2s-indebted-metropolis-0","pressure",{},{}] — 03831 r2s-indebted-metropolis-0: what prints instead: expected 'The Thieves\' Guild took the loans an…' to match /took the loans and is now repaying th…/: expected [ Array(1) ] to deeply equal []

### tests/generators/tailTies3Batch1.test.js
TAIL-TIES-3 batch 1 NOT (b): no rival claimant on a contested seat; each row says what the condition holds
AssertionError: no contested seat names a rival claimant — 2 of 4 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[1] r2r-village-48 — LIVENESS ANCHOR [r2r-village-48]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away...
[2] r2r-hamlet-32 — LIVENESS ANCHOR [r2r-hamlet-32]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away"...: expected [ …(2) ] to deeply equal []

### tests/generators/tailTies3Batch1.test.js
TAIL-TIES-3 batch 1 INSTEAD (b): the contested seat-holder still holds the seat on the card, in the condition's words
AssertionError: Holds the seat, and in a place this small everyone knows it; most quarrels end at its door. Still the boat-master as well.: expected false to be true // Object.is equality

### tests/generators/tailTies4Batch2.test.js
TAIL-TIES-4 batch 2: a tie gives its military end no office its house does not hold (T19, decided (B)) NOT: the line that gave the card an office no longer prints; INSTEAD: the same tie prints the reworded line
AssertionError: NOT: every old office line is gone and its tie prints the reworded line — 2 of 18 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[4] ["r2r-city-45","needs a prisoner released","Garrison","needs a blind eye,"] — r2r-city-45: instead, needs a blind eye,: expected false to be true // Object.is equality
[8] ["r2r-city-1","is fought in raids, informants, and paperwork","Mercenary quarter","is fought with informants, threats... — r2r-city-1: instead, is fought with informants, threats and favours called in: expected false to be true // Object.is equality: expected [ …(2) ] to deeply equal []

### tests/generators/upkeepHired.test.js
the five upkeep gates read the prosperity label, not the output RED-FIRST agree-village-16 (Comfortable, output 16): every gate is the identity
AssertionError: expected 'Prosperous' to be 'Comfortable' // Object.is equality

### tests/generators/upkeepHired.test.js
the five upkeep gates read the prosperity label, not the output RED-FIRST agree-village-5 (Struggling, output 57): every gate stands at the Struggling rung of the ladder
AssertionError: expected 'Poor' to be 'Struggling' // Object.is equality

### tests/generators/upkeepHired.test.js
the guard assessment says what the place can pay for its hired force RED-FIRST agree-village-40 (Poor, a charter hall and no standing guard): the guard line is the purse-bound charter line
AssertionError: expected 'Comfortable' to be 'Poor' // Object.is equality

### tests/generators/upkeepHired.test.js
the charter hall says whether the town can pay its bounties (F7) agree-village-43 (Poor in ordinary years, a charter hall and no standing guard) prints the short line
AssertionError: expected 'Comfortable' to be 'Poor' // Object.is equality

### tests/generators/warContractsSecretProsperity.test.js
the war-contracts secret needs a town the war made rich r2s-wartime-city-0: a comfortable town keeps it
AssertionError: expected 'Moderate' to be 'Comfortable' // Object.is equality

### tests/generators/people/dualHatPoliticalMass.test.js
COHERENCE-POWERS-3 F1 — the dual hat does not shrink a place's political mass a small place keeps the power the fold of the office's face into the leader's house cut
AssertionError: expected [ …(3) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) thorp: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0
AssertionError: (u) thorp: only repeats and refused cards move (2 holdings moved): expected [ …(3) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) hamlet: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0
AssertionError: (u) hamlet: only repeats and refused cards move (7 holdings moved): expected [ …(8) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) village: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0
AssertionError: (u) village: only repeats and refused cards move (55 holdings moved): expected [ …(63) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) town: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0
AssertionError: (u) town: only repeats and refused cards move (97 holdings moved): expected [ …(82) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) city: every sentence printed twice is held by an 'exhausted' card, and the count is at most 1
AssertionError: (u) city: only repeats and refused cards move (148 holdings moved): expected [ …(109) ] to deeply equal []

### tests/generators/people/goalSentencesOnceInTown.test.js
the gate's count: no goal sentence printed twice in one town (p) (p) metropolis: every sentence printed twice is held by an 'exhausted' card, and the count is at most 2
AssertionError: (u) metropolis: only repeats and refused cards move (46 holdings moved): expected [ …(58) ] to deeply equal []

### tests/generators/people/mintedFaceUnderworld.test.js
COHERENCE-POWERS-7 leftover 1 · the four minted faces of the census's 720 every minted face of the four towns reads "the local underworld", and no minted face names a guild the town lacks
AssertionError: every minted face of the four towns reads "the local underworld", and no minted face names a guild the town lacks — 1 of 4 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[0] ["r2r-metropolis-39","the lord"] — expected true to be false // Object.is equality: expected [ Array(1) ] to deeply equal []

### tests/generators/people/mintedLordKeepsLines.test.js
COHERENCE-POWERS-6 item 3: a minted lord pushes no true line off a card the review's six true house lines are on their cards again
AssertionError: expected [ …(2) ] to deeply equal []

### tests/generators/people/seatKeeperContender.test.js
COHERENCE-POWERS-6 item 2: the keeper of a vacant seat heads no contender the contender keeps its people: the keeper of rvf-succession_void-town-4 stays a member of Landed Gentry and heads it no longer; a lord leads it
AssertionError: the keeper heads no contender: expected 1 not to be 1 // Object.is equality

### tests/generators/people/successionClaimants.test.js
COHERENCE-POWERS-4 (F3) — a claimant is the succession crisis's own cast the review's two towns: each claimant is a minted person, printed by name on the seat row, never the leaderless line
AssertionError: expected [ 'Noble Claimant (Senior Line)' ] to deeply equal [ Array(2) ]

### tests/generators/seat/seatHolderLines.test.js
U6 (2): a lit holder apart is the office, never under it u6t-city-4 (a city): the Merchant Guilds hold the Merchant oligarchy
AssertionError: LIVENESS ANCHOR [the form<->holder row]: the before-collection must already contain the member the operation is supposed to remove. It does not — so the "it is gone afterwards" assertion below would pass vacuously. Either the producer stopped emitting this member (a real regression) or the fixture no longer exercises the path.: expected 'The Merchant oligarchy needs the taxe…' to contain 'work under the rules'

### tests/generators/power/bar2People3Funding.test.js
BAR2-PEOPLE-3 · "underfunded" only where the funding gate is under 1 (PP11) r2r-city-6: the gate reads 1; not "Tense (militarised, chronically underfunded)": its twin "Tense (militarised)" prints
AssertionError: expected 0.88 to be 1 // Object.is equality

### tests/generators/power/bar2People3Funding.test.js
BAR2-PEOPLE-3 · "underfunded" only where the funding gate is under 1 (PP11) r2s-monster_pressure-city-0: the gate reads 1; not "Tense (militarised, chronically underfunded)": its twin "Tense (militarised)" prints
AssertionError: expected 0.88 to be 1 // Object.is equality

### tests/generators/power/bar2PeoplePowers.test.js
BAR2-PEOPLE batch A · the powers say what the record holds (PP1, PP2, PP9, PP10) r2r-hamlet-27: not "Holds the title; the decisions that matter are m…"; "The Elder Council keeps the title; the G…" prints
AssertionError: LIVENESS ANCHOR [r2r-hamlet-27: the refused line; what prints in its place]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected '{"hall":"The seat is not in criminal …' to contain 'The Elder Council keeps the title; th…'

### tests/generators/power/bar2PeoplePowers.test.js
BAR2-PEOPLE batch A · the powers say what the record holds (PP1, PP2, PP9, PP10) KEEP r2r-thorp-25: "Holds the title; the decisions that matter are m…" still prints
AssertionError: expected '{"hall":"The seat is not in criminal …' to contain 'Holds the title; the decisions that m…'

### tests/generators/power/seatNamedAsItSits.test.js
TAIL-POWERS-B batch 2 · a council is named only where one sits r2r-town-40: not "council access"
AssertionError: prints instead: expect access to the hall in return.: expected 'A mayor runs the town\'s day-to-day b…' to contain 'expect access to the hall in return.'

### tests/generators/power/seatNamedAsItSits.test.js
TAIL-POWERS-B batch 2 · a council is named only where one sits r2s-famine-city-2: not "every council vote"
AssertionError: prints instead: They are always at the table, but cannot set their own terms.: expected 'Wealthy merchants hold exclusive powe…' to contain 'They are always at the table, but can…'

### tests/generators/power/standingAgainstFigure.test.js
(b) a rival of the density law carries its own standing, never its host's rw3-metropolis-calm-9: The Commercial Circle (a rival of Merchant Guilds) does not read its host's standing sentence
AssertionError: the rival's own settled standing: expected 'Merchants trade here in number but ca…' to contain 'They have a say on only a few matters'

### tests/generators/power/standingReadsTheNamedPower.test.js
TAIL-POWERS batch 2 · the towns read: what each prints instead (births) every false town prints its true line; every keep town keeps its line
AssertionError: every town of the batch prints the line its state admits — 5 of 19 case(s) failed. This is the TRUE count: every case ran. A bare seed loop would have reported 1 and stopped at the first one.
[10] r2r-city-10 — LIVENESS ANCHOR [r2r-city-10: "Craft guilds regulating production and apprentices" no longer prints]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot dist...
[11] r2r-city-22 — LIVENESS ANCHOR [r2r-city-22: "Craft guilds regulating production and apprentices" no longer prints]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot dist...
[13] r2r-hamlet-17 — LIVENESS ANCHOR [r2r-hamlet-17: "The oldest heads of the community decide things to" no longer prints]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot di...
[14] r2r-thorp-19 — LIVENESS A

### tests/generators/power/tailPowers3Labels.test.js
TAIL-POWERS-3 · batch 1: the account names a power by its prose form; the stability word reads the record r2r-hamlet-10: the account prints "The Guard no longer takes its orders.", not "The Military/Guard no longer takes its orders."
AssertionError: LIVENESS ANCHOR [r2r-hamlet-10]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'The Free Elder Council governs Bellan…' to contain 'The Guard no longer takes its orders.'

### tests/generators/power/tailPowers3Labels.test.js
TAIL-POWERS-3 · batch 1: the account names a power by its prose form; the stability word reads the record r2r-hamlet-18: the account prints "The Guard is at odds with it.", not "The Military/Guard is at odds with it."
AssertionError: LIVENESS ANCHOR [r2r-hamlet-18]: the anchor sibling is missing from the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from "the whole collection drifted away". Fix the collection or choose an anchor that still travels this path — do not delete the anchor to get green.: expected 'Caerwick is governed by the Elder Cou…' to contain 'The Guard is at odds with it.'

### tests/generators/power/tailPowers3Labels.test.js
TAIL-POWERS-3 · batch 1: the account names a power by its prose form; the stability word reads the record r2r-town-44: the stability reads "Tense (the seat has lost the people's trust)", not "Stable"
AssertionError: r2r-town-44: expected 'Stable' not to be 'Stable' // Object.is equality

