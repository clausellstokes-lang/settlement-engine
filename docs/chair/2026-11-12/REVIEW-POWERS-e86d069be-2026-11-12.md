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
