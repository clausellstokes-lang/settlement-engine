NOT CLEAR

# REVIEW-POWERS-2 — lane/coherence-powers-2026-11-11 at e86d069be (2026-11-12)

A fresh, independent review. The reviewer changes nothing on the lane. Line = `lane/integration-2026-11-07` at 3575cf061 (an ancestor of the tip). Tip = e86d069be.

## STEP 1 — COLD, AS THE OWNER READS IT (written and committed before any review, hand-back or record was opened)

**What was rendered.** Both trees born and rendered by the SECOND-WAVE-CENSUS walk (`census.sh`, 720 seeds each: `r2r-<size>-0..59` with every dial random, and `r2s-<crisis>-<size>-0..3` with each of fifteen crises forced at all six sizes), through each tree's own `OutputContainer` as the owner (premium, not read-only, every group, sub-tab and disclosure opened). The forty towns read side by side, line against tip (Power tab, World/NPCs, Relationships, Institutions, the governance paragraph and the DM-only "Who really runs this …" block, which is the game master's page on the Power tab):
`r2s-{succession_void, occupied, politically_fractured, insurgency, plague_onset, famine}-{thorp, hamlet, village, town, city, metropolis}-0` (36) and `r2r-thorp-0`, `r2r-hamlet-0`, `r2r-town-0`, `r2r-metropolis-0`. Other seeds were opened where a pattern needed its extent measured; counts below are over all 720 births of each tree (the corpus each census births), and are RUN.

Probes (scratch, not committed): `leadpos.mjs`, `leadinf.mjs`, `leadcard.mjs`, `holdseat.mjs`, `claim.mjs`, `roster.mjs`, `names.mjs`, `newlines.mjs` over `<out>/corpus.ndjson.gz` and `<out>/dumps/`.

### C1 — THE LEADER'S OWN CARD SAYS SOMEONE ELSE RUNS THE SEAT (tip only; HIGH)
Under the dual hat the governing power's first is a house's face, and its card's position/constraint/goal lines are drawn from the HOUSE's category template, not the seat's (`src/generators/npcStructure.js:466` keys the template on `npc.category`, which stays the house's kind). So the person the Power tab names as holding the seat reads, on their own card, as a subordinate of "the seat":
- `r2r-thorp-0` (Izamitza): Power tab "The seat — Cosij Chan, the boat-headman and Elder"; his card: "Heads an old family while the seat's offices take up more of what the family once did. Constraint: The family's say slowly shrinks beside the offices that run things." He IS the office. Line: the leader (Zuma Chuc) read "Holds the seat, and people accept it".
- `r2s-insurgency-town-0` (Al-para): the Church Council's leader Ghazi al-Rumi, "the dean and Warden of the Council": card "Serves the faith under its leaders while rivals fight over the seat."
- `r2s-occupied-city-0`: Guta Hoffmann, "the watch commander and Lord Marshal" of the city: card "Leads a squad that is short of pay, gear and hands."
- `r2r-city-0`: Varvara Vorobev, Lord Burgomaster: "Constraint: Every new privilege it gathers in plain sight draws the eye of the seat and of its rivals." (the seat is hers).
- 130 leaders read "Heads an old family while the seat fails…"; 64 "…while the seat's offices take up more…"; the seat is spoken of as a third party on the seat-holder's own card.
Measured (governing power's rank-1 card, all 720 births): a position line that places its holder UNDER the seat or a greater house ("Heads an old family while the seat's offices…", "Serves the faith under its leaders", "Belongs to a lesser…", "Runs a smaller house…", "Leads a squad…", "Works spells under…", "Holds an office under/that hangs on/among…"): **line 39 → tip 96**. Leaders whose card still says they hold the seat ("Holds the seat…"): **line 584 → tip 170**.

### C2 — THE LEADER OF A CITY IS A "LOW INFLUENCE" FIGURE (tip only; HIGH)
`influence` and `power` are drawn from the role keywords at the mint (`src/generators/npcGenerator.js:59-74`, assigned at :162); the dual hat keeps the house face's draw (a miller, a circle-keeper → low, power 1-3). The NPC list prints influence as dots (● low … ●●● high) and the header counts "N high influence".
- `r2r-city-0`: the Lord Burgomaster Varvara Vorobev — record `influence: "low", power: 2`, printed "Varvara Vorobev●"; the header falls "4 high influence" → "3 high influence".
- `r2r-town-1`: the Archmage of the Council, Tabassum al-Dimashqi, "●"; line's leader was ●●●.
Measured (governing first's `influence`, 120 births per size): line — every village, town, city and metropolis leader `high` (480/480). Tip — `low` in villages 98, towns 62, cities 69, metropolises 66 (295 of 480); `high` only 142. The leader holds the highest `power` on the roster in 427 births at the line, 246 at the tip.

### C3 — A NON-HOLDER'S CARD SAYS "HOLDS THE SEAT" (widened by the lane; MEDIUM)
The occupier's governor the lane seats (category `government` at the mint) takes the government-holder template while the Power tab names another as the seat:
- `r2r-thorp-1`: Lepidus Brutus (Occupation Authority) "Holds the seat while money is short…"; `r2s-occupied-town-0`: Licinia Strabo (Governor, Occupation Authority) "Holds the seat in name, but fewer people come when called…", while "The seat — Decimia Tacitus, the mine captain and Mayor".
- A fractured realm's seated bloc speaker does the same (`r2s-politically_fractured-village-0`: Fronto Cicero, "Speaker" of The Independent Bloc, "Holds the seat in name…"; the seat is Prima Nero's, whose own card reads "Heads an old family while the seat fails").
Measured (cards not the governing first whose position begins "Holds the seat"): **line 21 cards / 21 births → tip 52 / 52** (Occupation Authority 0 → 19, The Independent Bloc 15 → 27).

### C4 — THE NOBLE CLAIMANTS ARE FACED BY MILLERS AND IMPRESARIOS (tip only; MEDIUM)
In a succession crisis the claimants' noble party ("The Highborn Circle", "The Peerage", "The Landed Bloc"), described on the page as "Hereditary or institutional claim; has legal arguments", now has a first who is a tradesman's house face. Line: no one on the page.
- `r2s-succession_void-town-0` (Shivamandal): "The Highborn Circle ↳1 member · first Nikhil Basu" — "Mills (2-5) · Master Miller", and also second of the very Feudal Appointee whose empty seat the Circle contests.
- Over the 24 succession births: the claimant parties' firsts are 7 millers, 2 opera impresarios, 2 mine captains, 2 bardic-college masters, a head shepherd (`r2s-succession_void-hamlet-0`, where that Circle holds 59 of the power); one ("The Peerage", `r2s-succession_void-town-2`) has no one and prints "No one claimant has stepped forward yet: the old families press the claim together." above its pool line "Popular support; questionable legitimacy" (the two read against each other).

### C5 — "THE RULING THREE" WITH ONE NAME, AND "FIRST" OF ONE (pre-existing pattern the lane more than doubles; LOW-MEDIUM)
Cure (i) (one person, one face) removes the seat's minted face, so a small council keeps fewer members: the DM block prints "The ruling three of Elder Council / Head · X" and nothing else, and the power row "↳1 member · first X".
Measured over the dumps rendered at the time of writing (≈200 per tree, thorps–villages): "ruling three" with one name — line 39, tip 91; dumps with a "↳1 member · first" row — line 87, tip 132 (the full count over 720 is in step 6).

### C6 — DOUBLED OFFICE WORDS (tip only; LOW)
The seat row composes the house title and the office: "the boat-headman and Headman" (11 of the first ≈160 tip dumps), "the priest and Elder Priest" (5), "the mine captain and Headman", "the innkeeper and Headman". The same person is "Headman Cosij Chan" on one Institutions row and "Elder Cosij Chan, the boat-headman" on the next (`r2r-thorp-0`, Fishing community / Informal elder consensus).

### C7 — THE CARETAKER HAS TWO TITLES (tip only; LOW)
A succession's seat row says "Acting Household Elder Asuka Yang, the head shepherd, keeps the seat meanwhile" while the DM block on the same tab heads her "Steward · Asuka Yang, the head shepherd" (`r2s-succession_void-thorp-0`); `r2s-succession_void-town-0`: card "Acting Bailiff", DM "Steward". (The "Steward" label is the line's; the "Acting" form is the lane's, and they now disagree on one tab.)

### Checked and clean (no finding)
- Every person or house the Power tab, the DM block and the Institutions "Connection" rows name is on the people list (structured slots: seat, ranked members, ruling three, connections): 0 misses at line and tip (`names.mjs`).
- The fractured realm's second power and the occupier's seat (both new on the tip) match the stress on the page; the War Council / commons / grain leaderless lines appear only where no house or cast stands (few: 8 in the first 640 tip dumps).
- Two different "The Powers (n)" counts on one Power tab: line 168, tip 164 of ≈425 dumps — pre-existing, not the lane's.
- Pre-existing and not the lane's (line has them identically): a thorp's tension "The church wants approval rights … The village reeve disagrees." with no church and no reeve (`r2r-thorp-0`); "The Occupation Authority no longer takes its orders" (`r2s-occupied-town-0`); "Weak defences keeps …"; the vacant seat's "One person decides at Shivamandal and decides quickly" beside "governs without a head".

---

## STEP 2 — THE FIRST REVIEW'S THIRTEEN, RE-RUN ON THIS REVIEW'S CORPUS (720 births per tree, seeds the lane never used)

RUN unless marked READ. Line = 3575cf061; tip = e86d069be (the step-7 commits move no generator output; see step 7).

| finding | is the cure real? | my measure, line → tip |
|---|---|---|
| F1 a crisis's own power lost to the seat-ceiling cut | REAL | forced-crisis births whose own power is on the line's roster and gone at the tip: **0**. Births with none of the crisis's own powers: 182 → 174 (the occupier and the fracture seated). |
| F2 a removed power named in text | REAL for the tension chips | `history.currentTensions[].factions` naming a power not on the roster: **103 → 0**. Descriptions naming a roster-absent name: 40 → 27, every one I opened a substring of a longer name ("City Council" inside "Merchant City Council"): no true hit. |
| F3 the claimant line under a "Noble Claimant" | REAL | "Noble Claimant …" followed by "No one claimant has stepped forward": 0 → 0 (one royal vacancy in the corpus, `r2r-metropolis-8`: "2 claimants circle: Franz Treue for Noble Claimant (Senior Line), Dietmar Licht for … Regent Oda Kauf keeps the seat meanwhile"). |
| F4 a power with neither a member nor a line | REAL | powers with no member and no "↳" line on the Power tab: **64 → 0**. |
| F5 the Resistance Network unveiled | REAL | unveiled Resistance memberships: **12 → 0**. |
| F6 a crisis power led by a leader of another power | REAL | crisis powers whose first leads a second power: 0 at the tip. |
| F7 the empty seat with an office-holder | REAL on cards and the seat row | vacant-seat births (31) where a card prints "<office>, first of" not in the caretaker form: 0 → 0; the seat row now names the keeper. Residue: C7 (the DM block's "Steward" beside the seat row's "Acting …"). |
| F8 capture moves toward danger | REAL as a declaration; the rule holds | moves: 26 of 720; toward danger 14 (2 with no criminal power standing, both at most corrupted/equilibrium). FULL capture with no criminal power: **0**. But see N4: `adversarial → capture` and `none → adversarial` occur here and are not rows of the record's table. |
| F9 the guard misses the planted office-holder | REAL | planted (`representatives.js:522` commented out, scratch tree): `powersDualHat.test.js` **red**, 1 of 4 ("no office-holder stands beside the house head who leads"), naming critique-town-3, -town-13, -city-0, -city-9. |
| F10 two office titles on the leader's card | REAL on the card; NOT on the Institutions tab | cards with an office honorific beside a different office: **0**. The same class lives on the leader's own house's Connection row: N6 (31 births). |
| F11 the PDF golden and the DM pin undeclared | REAL (READ for the record; the suite's run in step 3) | the record's `surfaces` names the PDF golden MOVED; the DM pins re-keyed by identity to birth(5) (premise generic: an answering face, a hidden boost, handlers; assertions unchanged — read). |
| F12 the packed ceiling | REAL | `rulingStructure.js` 799 → 792 lines; the shrink-only packed-line guard is in `tests/generators/powerStructure.test.js` (green in the suite run). |
| F13 the guard's seeds narrower than a corpus | REAL (READ) | `stressPowersFaced.test.js` now births 180 `rvf-<crisis>-<size>-10/11` through `birthConfig`, beside its pins. |

## STEP 3 — THE LANE'S CLAIMS

**The whole-lane field diff (RUN on 720).** Births that differ: **637 of 720** (the seat: 3,674 of 4,305; the same share). Families that move: npcs 561, relationships 551, powerStructure 420, prominentRelationship 316, stress/stressors 245 (the cast of a seated occupier and the claimants), conflicts 233, pressureSentence 155, history 104 (the tensions' parties, F2), economicState 10, coherenceNotes 1. economicState and coherenceNotes move ONLY in births whose government moved (the council of a kind): 10 of 10, 1 of 1. `coherenceNotes` is a family the record's table does not list (`r2r-town-2`: the "formal governance rests with Arcane Council" note leaves with the Arcane Council) — a declared cause, an unlisted family (LOW, N10).
**Is any person re-dealt outside a declared cause?** Every birth whose cast moved, by what else moved: leader changed and card set changed 435; + roster 67; government + leader + cards + roster 22; cards + roster 8 (the occupier minted); government + roster 9; roster only 5; cards only 3 (the claimants minted); **none of those 12** — opened `r2r-town-17`, `r2r-town-27`: the Feudal Appointee (noble) is dealt the noble houses ahead of the Landed Gentry (rule A, 23a2015d4, declared) and the members' ranks follow. No re-deal found outside a declared cause.

**The six surfaces** and **the whole suite**: see the end of this file (the run is long).

## STEP 4 — EVERY PIN THE LANE CHANGED (read, file by file)

Re-keyed by identity with a stated, measured cause: `powerSeatRender` (thorp 28/42 → 57), `whoRunsThisTownPanel` and `whoRunsThisTownDm` (birth 785 → 5), `tonightSeatSecret` (five seam seeds replaced, each measured), the three store keepers (`locksEngine`, `npcStateRegenRebind`, `pinnedNpcRegenRemap`, index moves of the same card), the prose-numerics and legacy-reader line addresses, `seatHolder`/`terrainPoolsSeat`/`representatives`/`castDerived` (the expected office now from `tests/helpers/dualHatOracle.js`'s literals, F9). Re-measured with the commit that moved them: `rosterDuplicateDraws` 899 → 853, `generation.test.js` npcCount 12 → 11, the phone floors (bisected per view; no token moved), the route census `floored` +2. Census rows that classify a new reader or writer: `ruinFilterRoster` 109 → 110 (one EXEMPT name-lookup with a reason), `heldKeyWriterCensus` 20 → 22 (two mutators). The presumed-things register LOSES a row (tighter).
**One loosening (N8, LOW):** `tests/generators/people/castPowers.test.js:69` — "every membership share > 0" now skips the governing power's rank-1 membership entirely. Its comment says "the one membership at share 0", but the arm asserts nothing about it, and the leaders I opened hold it at share 1 (`r2r-city-0`). A negative, NaN or any share passes. Cure: assert what the comment says (`share === 0` where the house backs another power, else `> 0`), or `>= 0`.
No test is skipped, no ceiling raised (the census rows above are classifications, each with its reason), no baseline banked upward.

## STEP 6 — THE PAGE COUNT (SECOND-WAVE-CENSUS, RUN on both trees, 720 dossiers each, two workers per tree)

`compare.mjs <line>/counts.perseed.json <tip>/counts.perseed.json`: **one row rises — 16a "ruling three lists fewer" 332 → 393 (+61).** No new row. Falling: 4 "almost level vs leader far ahead" 103 → 94; 14 "size words in small places" 167 → 166; 16b two "Powers (n)" counts 291 → 282. Every other row equal. GLANCE towns (excluding 17, 18): 623 → 641. Row 16a is a finding (N5 below, = C5).

**Every sentence or panel the lane adds, and what it reads:**
- The seat row "X, the <house title> and <Office>" — reads the card's title and role. Doubles office words ("the boat-headman and Headman", "the priest and Elder Priest"): C6.
- The caretaker line "Acting <office> X keeps the seat meanwhile" — reads the vacant modifier and the governing first. It does not read whether the keeper is in a claimant's party: in 12 of 31 vacancies the keeper belongs to another power, 4 of them a claimant or contender — `r2s-succession_void-hamlet-0` (Titia Caesar keeps the seat and is second of The Highborn Circle, which contests it at 59), `-village-3`, `-town-0` (Renuka Ahuja, first of Landed Gentry, 52, "Contests the seat"), `r2r-metropolis-8` (the Regent is a member of Noble Claimant (Senior Line) and "Wants: Do one thing for Noble Claimant (Senior Line) this season"). The sentence presumes a neutral caretaker it does not read (part of N4 below). And the DM block on the same tab calls the keeper "Steward": C7.
- The leaderless lines — read the stress only. "It has no one leader yet: the commons speak for it in the street" prints in a thorp of 21 (`r2r-thorp-25`, Tlalpan, People's Council at 53; LOW). The old families' "No one claimant has stepped forward…" sits over the pool line "Popular support; questionable legitimacy" (`r2s-succession_void-town-2`).
- "· also first in X" and the boost lines in the DM block — read the memberships; correct where opened.
- The card's "<House> · <Office>, first of <Power>" — correct; but the position/constraint lines beneath it read the house's category (C1), and the influence dots read the house's draw (C2).
- The leader's own house's Connection row — prints the house honorific even where it is an office word other than the office held (N6).

## STEP 7 — THE TIP MOVED WHILE I READ: e86d069be → 463eb0b04 (read)
- `0ffbf39b8` fix(power tab): where two or more old families' bodies have no one, the line prints once under the stronger, the other reads "Presses the claim with {power}." Reads the faceless bodies of one row; no generator output moves (the commit's own L3; on my corpus no birth has two faceless bodies, so the pointer never prints here: nothing to read against). New words for the veto list.
- `69949c00e` test(tonight sheet): the oracle accepts the temperament ONLY where `says === 'temperament'` and the line is the record's own `personality.dominant`. A widening the chair ruled; it is tight (planted wrong temperament red). Not a finding. Its subject is the lane's: under the dual hat the insurgency's target is the seat-holder who keeps the crisis's own secret (x51-tonight-51).
- `e6fc88690` lighting census re-frozen by its command; `4ab6d8788` docs; `463eb0b04` the edge bundles re-emitted (engine 3f3ed4bfa23523fc). The delta's tests are run at 463eb0b04 below.

## STEP 5 — THE WARS (RUN: the seat's own `wars.mjs`, statecraftExposureBand's recipe, twenty years, head on)

Re-run, line and tip, ten of the thirty realms: the four that lose half (pop-6, pop-13, pop-16, rvr-7) and six more. Every figure equals the seat's table:

| realm | line | tip | conquests line → tip |
|---|---|---|---|
| rvr-7 | 1,054 (a twenty-year war, 52 a year) | 143 (70, 52, 21, then 0) | 0 → 1 |
| pop-16 | 209 (61, 51, 52, 45) | 51 (year one only) | 2 → 0 |
| pop-6 | 146 | 32 | 1 → 1 |
| pop-13 | 36 | 17 | 1 → 0 |
| pop-2 | 125 | 117 | 1 → 1 |
| pop-10 | 6 | **41** | 1 → 1 |
| pop-11 | 64 | 66 | 0 → 0 |
| pop-15 | 29 | **44** | 1 → 1 |
| rvr-1 | 18 | **38** | 1 → 1 |
| rvr-8 | 64 | 71 | 1 → 1 |

**Not systematic; a re-deal of who rules each court.** (1) At first light (`courts.mjs`: `composeReaderRegion` + the deity case, both trees) every court of pop-16, pop-13 and rvr-7 has the SAME government, governing share, number of powers and legitimacy at line and tip; only the ruler differs, in 11 of 12 courts (pop-16's Unterkirche: Liutgar Hartmann [magnanimous/callous/fatalistic] → Ortwin Wenzel [—/volatile/brooding]). (2) The war decision reads the ruler's temperament and alignment (`src/domain/worldPulse/warSeatBooks.js:235-266` `rulerTraits`/`traitScore`, :298 conscience, :348/:720 aggression) beside legitimacy, share and standing; the dual hat names a different person, so each realm's leaning is re-drawn. (3) It is not the ladder order: with a26de3410's order reverted in a scratch tree (`npcLadderState.js` sort key), pop-13 17, pop-16 51, pop-6 32, rvr-7 143 — the tip's figures exactly. (4) No bias in what is re-drawn: over this review's 480 village-to-metropolis births the leader's mean `TRAIT_AGGRESSION` score is 0.185 at the line and 0.172 at the tip (positive 220 → 217, negative 82 → 77), conscience −0.119 → −0.122. Directions in my ten: three rise, three fall by half or more, four within ten. The total's fall is rvr-7's single never-ending war at the line (half of the line's 2,148). **The seat's reading stands: a few wars ending early or not starting, by a re-drawn ruler, not a systematic change.** One note: `influence`/`power` collapse (N2) is not read by the war decision (not among its security facts), so it does not reach the wars.

---

## THE FINDINGS, most serious first

**N1 — HIGH — The leader's own card says someone else holds the seat.** (C1.) Where: `src/generators/npcStructure.js:466-473` keys the position/constraint/goal template on `npc.category`, which under the dual hat stays the house's (economy, religious, magic, military, other), never `government`. Reproduce: `r2r-thorp-0` (birth through `birthConfig` with the census dials, seed `r2r-thorp-0`), World/NPCs: Cosij Chan, "Fishing community · Elder, first of Elder Council … Heads an old family while the seat's offices take up more of what the family once did. Constraint: The family's say slowly shrinks beside the offices that run things." Also `r2s-insurgency-town-0` ("Serves the faith under its leaders" — the Church Council's Warden), `r2s-occupied-city-0` (the Lord Marshal "Leads a squad that is short of pay, gear and hands"), `r2r-city-0`. Measure over 720: governing firsts with a subordinate position 39 → 96; governing firsts whose card says they hold the seat 584 → 170. How bad: on the owner's own principle the leader is "elevated yet still tied to an institution"; the page now prints the tie and erases the elevation, on the card the owner reads first, in every size. Cure: the governing first's template is read from the seat (the government row) and the house's lines compose beneath it, as the seat row already composes the two hats; or the government row wins for the governing first.

**N2 — HIGH — The leader of a village, town, city or metropolis is a "low influence" person.** (C2.) Where: `src/generators/npcGenerator.js:59-74` (`generateNPCPowerLevel`, role keywords) assigned at :162; the dual hat writes the office to `role` after the draw and never re-derives `influence`/`power`. Reproduce: `r2r-city-0`, World/NPCs: "Varvara Vorobev●" (one dot), record `influence: "low", power: 2`, the Lord Burgomaster; the header "3 high influence" (line 4). Measure: the governing first's influence over 480 village-to-metropolis births: line high 480/480; tip high 142, moderate 43, **low 295**; the leader holds the roster's highest `power` 427 → 246 of 720. How bad: the people list ranks and filters by these dots; the leader sorts below their own clerks. Cure: the office raises the card's influence/power (the higher of the two hats), in the same commit that writes the office.

**N3 — MEDIUM — A person who does not hold the seat reads "Holds the seat…".** (C3.) Where: the same template (`npcStructure.js`), reached by the occupier's governor (minted `category: government`, the lane's seated occupier) and a fractured realm's bloc speaker. Reproduce: `r2s-occupied-town-0` — Licinia Strabo, Governor of the Occupation Authority: "Holds the seat in name, but fewer people come when called…", while "The seat — Decimia Tacitus, the mine captain and Mayor". Measure: non-holders with a "Holds the seat" position 21 → 52 births (Occupation Authority 0 → 19; The Independent Bloc 15 → 27, a class the line had). Cure: the government-holder rows only for the governing first; an appointed occupier reads an occupier's row.

**N4 — MEDIUM — The noble claimants are a miller's party, and the caretaker sits in a claimant's party.** (C4; F3's ruled "next free landed rung".) Where: `src/data/stressPowerFaces.js` succession_void `rungOf` and `castPowers.js :: freeRungOf`; the caretaker line `src/domain/people/seatKeeper.js :: seatKeeperLineOf`. Reproduce: `r2s-succession_void-town-0` (Shivamandal): "The Highborn Circle ↳1 member · first Nikhil Basu" (Mills · Master Miller), pool line "Hereditary or institutional claim"; over the 24 succession births the bodies' firsts are 7 millers, 2 opera impresarios, 2 mine captains, 2 college masters, a head shepherd. The caretaker: `r2s-succession_void-hamlet-0` "Acting Elder Titia Caesar … keeps the seat meanwhile" while second of The Highborn Circle (59, "Contests the seat"); 4 of 31 vacancies put the keeper in a claimant's or contender's party. How bad: reads false on the crisis's own panel. It is the ruled rule working as written, so the cure is the chair's (or the owner's): a body faced only by a house of a landed or noble kind, else its line; and the caretaker line reads the keeper's other memberships (or the keeper is drawn from a power that contests nothing).

**N5 — MEDIUM-LOW — The page count rises: "The ruling three of X" lists one name.** (C5; census row 16a 332 → 393.) Where: the DM block (`patronage.js :: dmPowerViewOf`, the Power tab's "Who really runs this …"); cure (i) leaves small councils with fewer members. Reproduce: `r2s-famine-thorp-0`, DM block: "The ruling three of Household Council / Head · Philippos Bryennios, the boat-headman" and nothing else; "↳1 member · first Philippos Bryennios". Measure (720): the block with one name 78 → 169; dumps with a "↳1 member · first" row 347 → 446. A rising census row is a finding by the law of today. Cure: the heading and the "first" read the count ("Who leads Household Council: …"; no "first" of one).

**N6 — LOW — F10's two titles survive on the Institutions tab.** Where: the house's Connection row. Reproduce: `r2r-thorp-0`, Systems/Institutions: "Fishing community … Connection: Headman Cosij Chan" and, two rows down, "Informal elder consensus … Connection: Elder Cosij Chan, the boat-headman" — the seat row says Elder. Measure: 31 tip births title the leader on their own house's row with an office word not the office held (line: the boat-headman was not the leader). Cure: the leader's house row composes as the seat row does.

**N7 — LOW — Doubled office words, and the caretaker's two titles.** (C6, C7.) The seat row "the boat-headman and Headman", "the priest and Elder Priest": 29 tip births (line 0). The caretaker "Acting Household Elder Asuka Yang" on the seat row and "Steward · Asuka Yang" in the DM block of the same tab (`r2s-succession_void-thorp-0`; `-town-0` card "Acting Bailiff", DM "Steward"). Cure: drop the office from the seat row where the house title already carries its word; the DM block's keeper label reads the caretaker's form.

**N8 — LOW — One loosened pin.** `tests/generators/people/castPowers.test.js:69` (step 4). Cure: assert the leader's governing share.

**N9 — LOW — The record's capture table is a corpus table, not the class.** On this review's 720: 26 moves, 14 toward danger, including `adversarial → capture` (`r2r-metropolis-18`: "Fighting the criminals … Nobody at its head answers to the criminals." → "Run by the criminals. The head of Grand Merchant Oligarchy answers to The Underground…") and `none → adversarial`, neither a row of the record's table; full captures +3, −1. The chair's rule (no full capture without a criminal power) holds: 0. Cure: the record states the class by its rule (the dual-hat leader is a house face and carries the house's allegiance into the hall), not as a closed table.

**N10 — LOW — An unlisted moved family.** `coherenceNotes` moves (1 of 720, `r2r-town-2`, a council-of-a-kind birth); the record's family table does not name it. Cure: name it.

**N11 — MEDIUM — A red the lane owns, outside the classed set.** `tests/docs/enforcement-claims.test.js`, 2 titles ("every completeness claim carries an @enforced-by tag" and "the banked naked-claim debt is frozen PER CLAIM"), red at 463eb0b04 (RUN; the row it reads predates e86d069be): `docs/chair/2026-11-11/COHERENCE-POWERS-HANDBACK.md:741` — the dossierPhoneFloorAllViews row's "zero violations" — is a completeness claim with no `@enforced-by` tag. The file does not exist on the line; the row was written at 09b220277, after the fourth seat's final suite run at 2fd6cf8a2, so the hand-back's "No title is YOURS TO CURE" never saw it. Reproduce: `npx vitest run tests/docs/enforcement-claims.test.js` at the tip. How bad: the lane's failing set is not the classed set, and the lane's own words red a gate. Cure: tag the claim with the enforcer that proves it (`@enforced-by tests/components/dossierPhoneFloorAllViews.test.jsx`) or reword it.

Not findings (checked): F1–F13's cures (step 2); the field diff's causes (step 3); the ten wars (step 5); the step-7 commits; the three gates at 463eb0b04 (typecheck:ratchet 167/167, domain-strict 1113/1113, lint 0 errors, 37 warnings; each exit 0 through `scripts/gate-tail.sh`); the step-7 delta's seven test files at 463eb0b04 (83 passed, 2 skipped, exit 0).

---

## STEP 3 (continued) — THE SIX SURFACES AND THE WHOLE SUITE, RUN AT THE FINAL TIP 463eb0b04

The suite was started twice as one run and killed twice by container restarts. It was then run to completion as 64 resumable chunks (each top directory, `tests/domain` and `tests/components` split by subdirectory and by first letter), every chunk `npx vitest run <files> --maxWorkers=2` in a worktree at 463eb0b04 with its own `npm ci`, after `git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08` (235efce1a). Merged by file (no file counted twice): **3,221 files, 38,947 tests (the seat: 38,945; +2 from the step-7 commits), 55 failed plus the two file-level news walkers = 57 failing titles in 32 files, 147 skipped (the suite's own).**

**Against the hand-back's classed 57 (at 2fd6cf8a2):** the same set, title for title, LESS the two parked titles (tabSentencesOnce on x50-trim-21, tonightSheetOnce on x51-tonight-51), which the step-7 commits cure (green here), PLUS the two `enforcement-claims` titles of N11, which are the lane's and not classed. Every other title is a row the record names: the line's 8 (landingFixtureFreshness 2, newsHeadlineContract, newsVoiceContract, proseFamilyContract A1 A3 A5, dossierProseManifest's drift arm), the founding worlds' 1, and the merge seat's 46 (the goldens and their null-change pins, the re-taken digests, the measured figures, proseFamilyContract A2, proseComposed A13, proseTasteInterested 2, writerReach 9, observedShapeReaders 4, statecraftExposureBand's floor (mobilizations 27 against 72), poolDominance).

**The six surfaces, by this run (MOVED = red here):** generator golden master MOVED (376 of 525 configurations differ — the record's 376); espionage dormancy fence MOVED (1 of 21, the driven golden's hash); dossier prose manifest MOVED (3 arms: the drift corpus tally, the drift arm, the audience arm 204 against 203); PDF golden MOVED (pdf.6); Herald knowledge desk golden MOVED (its hash); preset-lighting witness UNMOVED (`tests/simulation` 187 of 187 green). **Each equals the record's MOVED / UNMOVED.**

---

## WHAT WAS RE-RUN, IN ONE PLACE
- Two trees born and rendered as the owner reads them, 720 dossiers each (SECOND-WAVE-CENSUS); forty towns read side by side; probes over all 720.
- The thirteen findings' proofs on that corpus (F9 by a planted fault in a scratch tree).
- The whole-lane field diff on 720 births; the per-birth cause classes.
- The census counter and `compare.mjs` on both trees.
- Ten of the thirty realms' twenty-year wars at line and tip, four of them again with the ladder order reverted; the first-light courts of three realms.
- The three gates and the step-7 delta's seven test files at 463eb0b04.
- The whole suite at 463eb0b04 (chunked).
Not done: the other twenty realms (READ from the hand-back; the ten re-run equal it to the unit); the seat's 4,305-birth corpora (this review used its own 720).

## VERDICT
**NOT CLEAR.** The thirteen first-review findings are cured, the field diff and the six surfaces are as declared, and the wars' fall is a re-deal, not a systematic change. But the finished page contradicts itself on the leader, the person the owner's principle is about: the leader's own card says "the seat's offices take up more of what the family once did" (N1, 39 → 96 subordinate readings; 584 → 170 leaders whose card says they hold the seat), the people list ranks the leader of a city as a low-influence figure (N2, 295 of 480 village-to-metropolis leaders), and the occupier's governor reads "Holds the seat" beside someone else's seat (N3). The page count rises on one row (N5), and the lane leaves one red of its own outside its classed set (N11).
