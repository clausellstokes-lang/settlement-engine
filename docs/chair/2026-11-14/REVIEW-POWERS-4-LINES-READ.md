# REVIEW-POWERS-4: step 1. Every new or reworded line of 96a6ced46..3909655c3, read where it prints

An independent reader's list, written from the DIFF of the stage before I opened the lane's hand-back
(`POWERS-FOLLOW-UP-HANDBACK-2.md`), any other file under `docs/chair/` on the lane, or any commit message of the range.
I changed nothing on the lane.

**Two subjects seen before this list was pushed.** The setup printed two commit subjects: 3909655c3 and its two
parents in a `git log --oneline -3`, and a5402c006 in the `git worktree add` banner. I read no other message, and no
claim from them shapes a verdict below.

**EXECUTED** throughout unless a row says PLAUSIBLE. The probes are in `docs/chair/2026-11-14/probes/REVIEW-POWERS-4/`
and their outputs in its `results/`.

## The stage, the births and the instrument

**The stage's own change.**
- The lane's 36 first-parent commits after 96a6ced46:
  - 24 before the merge, 96a6ced46..a5402c006. This is where every `src/` change of the lane's own lies.
  - 12 after it, 835cce92c..3909655c3. In `src/` these only rename `RungContext.factions` to `.roster` in `claimStanding.js`. The rest is registers, the edge bundles and tests.
- The merge of the integration line, 835cce92c (976db5b19 is on `lane/integration-2026-11-07`). Its remerge diff touches only registers and bundles: `wiring-census.json`, `pool-dominance.register.json` and the edge `_shared` bundles with their meta files. **No `src/` file conflicted.**
- So the stage's own record moves are measured as **96a6ced46 → a5402c006 ("lane-only")**. The merge's moves are a5402c006 → 3909655c3. What prints is read **at the tip**.

**The births** (`seedcfg.mjs`: CENSUS-2's map plus two prefixes of mine; seeds in `seeds.x.txt` and `seeds.war.txt`):
- **The census's 720**, born and rendered at the tip by CENSUS-2's `census2.sh` (every dossier view through the tree's own `OutputContainer`, as its owner sees it). Records only at the base and at a5402c006.
- **648 more in the app's own shape:** `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false, selectedStresses:[…], _randomizePriorities:true})`. Rendered at the tip; records at the base and at a5402c006.
  - The earlier reader's 360 `rww-` (calm, succession, infiltrated, wartime, occupied, siege, famine, fractured and two mixes, every size).
  - 216 `r4-`: every size × calm, siege, famine, occupied, wartime, succession, infiltrated, fractured, indebted and insurgency × 3, plus 36 wartime and calm cities and metropolises.
  - **72 `r4g-` under the `grim` content profile** (slavery and trafficking admitted): every size × calm, siege, wartime and famine × 3.
- **180 records only**, wartime towns, cities and metropolises at the tip (`seeds.war.txt`), for the one line that needs a self-governing town at war.
- **Total read where it prints: 1,368 rendered towns at the tip, plus 180 records.**

**The surfaces.**
- Every dossier view, from the dumps: the tabs, the NPC cards, the Tonight sheet, the Relationships and the Power tab.
- The PDF's view model and the Foundry journal, built for all 720 by `exports4.mjs`. They print the power descriptions, the goals, the secrets and the structural rows verbatim from the record, so each record-level verdict below holds there too. The honorifics print in the app only. In the 720, the persons-held lines and the vignette print in neither export.

**The reading.**
- `lines4.mjs` reads every line class below in every town where it prints, against the town's own record. It marks a print NEW where it differs from the base's same card or power.
- `rungdiff4.mjs`, `rungfalse4.mjs`, `twins4.mjs`, `supply4.mjs` and `goalmove4.mjs` read the claim rungs, the twins, the supply goals and the goal moves.
- Where a script's test is a proxy, I read its examples myself. The verdict is mine.
- Scale: REVIEW-R2-STAGES `READER-BRIEF.md`.

**Count: 30 lines and line classes. 0 false at HIGH. 0 false at MEDIUM among the lines the stage added or placed.**

Four LOW:
- **S1**: one rung reads a roster that moves after it.
- **S2**: the removed body rows, two of thirty true.
- **S3**: the solvency line placed on a council's head.
- **S4**: the alewife's and the madam's title word, the twin of the stage's honorific cure.

Carried twins of the stage's rung conditions (the claim ladders' NATIVE lines, false at the base too, `rulingStructure.js`): T1 to T4. One of them, T2, reads MEDIUM in some towns.

NEVER PRINTS: none. The roster settle's new host reading (R1) moved no description in 1,368 births.

## The lines

Column key:
- **prints**: rows in the 720 / the 648.
- **NEW**: lane-only prints, base → a5402c006.
- **sizes**: the smallest and largest size it reaches.
- **crisis**: towns under a crisis where it prints (720 / 648, summed over a class's lines).

### A. The honorifics: `data/faceHonorifics.js :: FACE_HONORIFICS`, styled at display (the card's "Connection:" line, the Relationships rows)

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| A1 | "Brewster <name>" for a man whose title is "the alewife" (first slot now `{male: Brewster, female: Alewife}`) | 38 / 30 | hamlet–village | 22 / 28 | **TRUE**: every one is a man. E.g. `r2r-hamlet-1` "Connection: Brewster Alexei Volkov". |
| A1b | "Alewife <name>" | 11 / 12 | village | 12 | **TRUE**: every one is a woman. |
| A2 | "Goodman <name>" for a male midwife (the first slot, `{male: Goodman, female: Midwife}`) | 117 / 101 | village–metropolis | many | **TRUE**: every one is a man. |
| A2b | "Midwife" / "Goodwife <name>" | 108 / 117 | village–metropolis | many | **TRUE**: every one is a woman. |
| A3 | "Master <name>" for a man whose title is "the madam" or "the district madam" | 132 / 133 | town–metropolis | 81 / 106 | **TRUE**: every one is a man. One script false, "Message-Master Guta Frank", is another person (`rww-metropolis-wartime-409`, whose madam reads "Madam Guta Schubert"). |
| A3b | "Madam <name>" | 107 / 128 | town–metropolis | many | **TRUE**: every one is a woman. |
| **S4** | **twin, not new:** the TITLE word on the same man's card and rows, "the alewife", "the madam", "the district madam" | 31 male alewives, 52 male madams and 80 male district madams on the 720 carry it | | | **FALSE, LOW** (two places on one page): "Connection: Brewster Alexei Volkov" beside "Second · Alexei Volkov, the alewife" and "Headman · personal · the alewife" (`r2r-hamlet-1`). The base printed "Alewife Alexei Volkov" and "the alewife", which agreed and were both wrong. Now the page says two things. The title pool is not this stage's file. It is the twin the cure did not reach, the same kind as the earlier reader's "Lady Abbess … (the senior abbot)". |

### B. The supply goals: `data/people/goalFamilies.js :: GOAL_FAMILY_LINES.SUPPLY`, drawn by `people/goals.js :: familyCandidates` / `drawVantage`, printed on the card ("Wants …"), the Tonight sheet, the PDF and the Foundry journal

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| B1 | the 12 `impaired` lines reworded from `{chain}` (a catalogue label) to "the work at {house}" / "{house}". Three are refused under a siege: "Find a new source of supply for the work at {house} before what is left runs out.", "Bring in from outside what the work at {house} can no longer get close to home.", "Find whoever can still supply {house}, and pay them what they ask." | 533 / 577 | hamlet–metropolis | 325 / 445 | **TRUE.** Every one names the card's own house by its display noun ("the tanner's yard", "the mills", "the salt works"). Every one stands on a chain whose status is `impaired` (533 of 533 on the 720). None of the three prints under a siege, in 1,368 towns. No catalogue label and no `{slot}` prints. |
| B2 | the 3 `dependency` lines now refused under a siege (text unchanged): "Find a second supplier of {resource}…", "Lay in a season of {resource}…", "Buy {resource} at the market in bulk…" | 325 / 355 | hamlet–metropolis | 174 / 246 | **TRUE.** None prints under a siege. In the siege towns their place is taken by the family's other lines. |
| B3 | the 12 `expansion` lines, 7 reworded ("Take on more hands at {house}…", "Look for a way to do more at {house} with the same hands.", "Make the work at {house} the thing this place is known for.", "Bring every step of the trade, from the first goods to the last, under the roof of {house}.", …). Four are refused under a siege, three under a famine. | 1,586 / 1,583 | hamlet–metropolis | 779 / 1,071 | **TRUE.** None prints under the crisis it is refused in. 311 stand on an `entrepot` chain, which the goals' running statuses already admit (old). |
| B4 | what prints in the siege towns in place of a refused line, lane-only (e.g. `r2s-under_siege-city-1`: "Find whoever can still supply Standing Garrison…" → "Waste nothing at the professional city watch while the supply is short."; `r2s-under_siege-town-0`: "Lay in a season of grain…" → "Learn who controls the supply of grain, and get on good terms with them.") | 50 read | town–metropolis | all | **TRUE** in every one read. |

### C. The refused charter: `people/goals.js :: familyCandidates` (`refuseCharter`), `admittedAfter`

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| C1 | no INSTITUTION `charter` goal ("…sealed by those who govern…", "…excused from one tax…") on a criminal house's card or on the governing power's head | charter goals at the tip: 3,662 / 3,989 | thorp–metropolis | | **TRUE**: 0 on a criminal house or the governing head, in 1,368 towns. |
| C2 | what prints in its place, lane-only: 467 on the 720. 289 criminal houses take `solvency`, e.g. "Get the local fence's people through the season without borrowing." (`r2r-thorp-1`). 178 governing heads take `solvency` 162, `takeover` 12, `rebuilding` 4. | 467 | thorp–metropolis | | **TRUE** but S3. |
| **S3** | the `solvency` line on the head of a council that keeps no purse: "See the informal elder consensus out of debt for good, with money set aside for bad years." (`r2r-thorp-1`, `r2r-thorp-7`: the eldest of the Elder Council) | 5 + 6 such houses ("Informal elder consensus"; also "Head-of-household consensus" 7 + 7) | thorp | | **LOW, the stage's placement.** The line presumes a house in debt with a purse. An elder consensus is neither, and the record cannot settle a debt. The other placements read true: "the lord's steward's office", "the fishing community", "the town hall", "the houses of worship". |

### D. The persons bought, sold or held: `data/people/titleSecretsPresentations.js :: TITLE_LINE_DECLARATIONS` (`PERSONS_HELD`), `people/poolMap.js :: settleTitleLines`

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| D1 | the lanista's two "Buys fighters who were taken against their will…" secrets, the pit boss's, the lanista's "…the eye of someone who buys and sells people.", the master carpenter's apprentice "kept … past the indenture" | 0 in the 1,296 grounded towns; **15 in 12 of the 72 grim towns** | town–metropolis | 10 | **TRUE**: they print only where slavery and trafficking are both admitted. |
| D2 | what prints in their place, lane-only: 160 on the 720. The carpenter: "Built a roof with green timber to save the cost, and the beams have started to split" (72). The lanista's secret: "Has been drugging fighters before bouts so they lose on the day the money says they should" (37). The lanista's presentation: "Watches visitors near the training yard and keeps the fighters out of reach." (32). The pit boss: "Fixes fights and takes bets on the outcome they have already chosen" (19). | 160 (+161 in the 648) | town–metropolis | | **TRUE**: each is its title's own line, true of any town with the house. |

### E. The armed rows: `npcStructure.js :: UNDER_KINDS.military` (`headsItsKind`, the lesser head's empty row)

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| E1 | "Leads a squad …" never on the head of a military power | 69 / 36 | hamlet–metropolis | 42 / 31 | **TRUE**: 0 on a head, in 1,368 towns. |
| E2 | "Commands those under arms …" (with its goal and constraint) on the head of the strongest armed power, 109 new lane-only, e.g. `r2r-village-50` Supriya Joshi, the militia captain heading Military/Guard | 146 / 145 | hamlet–metropolis | 69 / 104 | **TRUE.** One head of a LESSER armed power reads it: `r4-metropolis-wartime-608`, the garrison commander of the War Council (13 beside Military/Guard 14). The sentence is true of a garrison commander. It is a placement against the stage's own rule, not a false line. |
| E3 | the head of a lesser armed power reads no row: 67 rows removed lane-only on the 720, 111 on the 648 | | | | **TRUE** (the card keeps its own goal). Not read one by one. |

### F. The body rows: `npcStructure.js :: BODY_KINDS` / `inItsBody`

| # | line | prints | sizes | crisis | verdict |
|---|---|---|---|---|---|
| F1 | a row of the card's own body ("Heads an old family", "Belongs to a lesser old family", "Holds an office …", "Works spells under …", "Holds a place under the crew's boss", "Serves the faith under its leaders") only where its first-rank power (`membership.js :: structuralStandingOf`) is that body | 475 / 373 | hamlet–metropolis | many | **TRUE**: 0 on a card whose first-rank power is another kind, or none. |
| **S2** | the rows removed, lane-only: 295 on the 720 (other 252, government 25, criminal 17, religious 1) and 202 on the 648. **Read 30:** 28 false, which the rule rightly took (lone fences with "Holds a place in a crew"; occupiers' governors with "Holds an office whose purse shrinks"; camp foremen, shepherds, a dairy farmer and charter masters with "Belongs to a lesser old family"). **One true:** `r2s-recently_betrayed-town-2`, Dhruv Mukherjee, the investigator heading The Inquiry under a Corrupt Council: "Holds an office among officials who take bribes; not one of the takers, but working beside them." **One doubtful:** `r2s-politically_fractured-metropolis-2`, the chief magistrate heading The Grey Council. | | | | **LOW**: a true row removed with nothing in its place. No false print results. |

### G. The claim rungs: `power/claimStanding.js :: settleClaimsToLabel` / `CLAIM_RUNGS`, the Power tab, the PDF and the Foundry journal

Lane-only, the rungs placed on the 720 (`rungdiff4.mjs`), each read against the town's final roster at the tip.

| # | rung (the claim it replaces, beside Minor/Suppressed) | placed (720) | sizes | verdict |
|---|---|---|---|---|
| G1 | "Clergy are present but operate at the margins of civic life; …" for "Major church institutions hold structural influence. Land grants, …" | 40 | city–metropolis | **TRUE** in each (`r2r-city-12`, `r2r-city-17`: The Holy Compact 5 · Suppressed). |
| G2 | the criminal Minor rung where no council governs: "Criminal network operating in shadows; …" (29) or, in the small tiers, "A local protection operation tolerated …" (1) | 30 | village–metropolis | **TRUE** (`r2r-city-16`, Noble Governorship; `r2r-city-25`, Merchant oligarchy). |
| G3 | the merchants' rung for "The ruling class and the merchant class are the same people; …", printed only where a merchant power governs: "…without yet being the dominant commercial voice." | 27 | town–metropolis | **TRUE**: a merchant power governs in each (`r2r-city-11`, Merchant oligarchy 35 beside Merchant Guilds 17). |
| G4 | **new words**: "Merchants with local reach; a consistent civic presence, though other powers set the course here." for the leading merchant power where none governs | 42 / 43 | town–metropolis | **TRUE**: in all 85, the power is not governing and is Minor or Suppressed. |
| G5 | "Minor landed families with limited political reach; present in civic life but rarely decisive." for the militarised nobles (19), the great families (19), and the gentry and noble rungs with no merchant power ahead (3) | 41 | town–metropolis | **TRUE** (`r2r-town-55` Landed Gentry 17; `r2r-metropolis-2` The Peerage 4). |
| G6 | "Well-funded city watch; it keeps order reliably …" (Minor) / "City watch; law enforcement …" (Suppressed) for "Standing army with genuine political weight; …", only where a watch stands (the defence bucket's words) | 15 / 0 | city–metropolis | **TRUE**: a "professional city watch" stands in each (`r2r-city-1`, `r2r-city-18`). It is the ladder's own line, so the Military/Guard reads as the city watch. |
| G7 | **residue**: any commanding claim still beside Minor/Suppressed | **0 on the 720, 0 on the 648** | | The class is gone: the earlier reader counted 122 on the 720. |
| **S1** | a rung placed true lane-only but false at the tip: `rww-city-succession_void-301` Merchant Guilds 9 · Suppressed, "…without yet being the dominant commercial voice." It is the town's leading merchant power (The Guild Alliance 5), and the Democratic assembly governs. | 1 of 1,368 | city | **FALSE, LOW, the stage's own rung.** The rung reads the roster at its call. After the merge the roster moves after the call: at a5402c006 the same town had it 12 · Minor and true. The code's own comment names this hazard for the noble rung only. |

**Twins: the ladders' NATIVE lines that carry the clause the stage's rungs now condition.** They are written by `rulingStructure.js`'s ladders (the Minor- and Suppressed-weight lines themselves), not by the rung. All are **CARRIED: the same power printed the same line at the base** (`twins4.mjs`).

| # | the native line, where its clause is false | 720 | 648 | verdict |
|---|---|---|---|---|
| T1 | "…present in council discussions through intermediaries." where no council governs (a Noble Governorship, a Merchant oligarchy, a Ducal Governorship) | 15 prints in 13 towns (+2 in `r2s-mass_migration-city-2`, a Thieves' Guild the merge's roster adds) | 14 in 11 | **FALSE, LOW** (the scale of the earlier reader's L2). The stage's test file counts these "12 … the ladder's own line, untouched". |
| T2 | "Landed families increasingly outpaced by merchant capital …" / "Gentry families … outpaced by merchant capital …" where no merchant power stands ahead. In some it sits beside the same description's "Still ahead of merchant interests in real influence, for now." | 5 in 5 | 13 in 12 | **FALSE.** MEDIUM where the one description contradicts itself: `r2r-metropolis-57`, Noble Houses 12 beside Merchant Guilds 11. LOW elsewhere: `rww-town-wartime-305`, Landed Gentry 12 with no stronger merchant. Carried. |
| T3 | "…competitive with merchant capital." where no merchant power stands | 4 in 3 | 14 in 11 | **FALSE, LOW** (`r2r-city-6`, `rww-city-calm-306`). Carried. |
| T4 | "…without yet being the dominant commercial voice." on the town's only or leading merchant power, where none governs | 34 in 34 | 24 in 24 | **FALSE, LOW** (`r2r-village-17` Merchant Guilds 33 · Significant beside an Elected Reeve). Carried. |

### H. The self-governing well-supplied wartime vignette: `power/governingStressVignettes.js :: buildWartimeNarrative` (the governance account, `recentConflict`)

| # | line | prints | sizes | verdict |
|---|---|---|---|---|
| H1 | "Those under arms have doubled, and the city treasury pays their keep, so contracts for grain, leather and ironwork go to anyone who can fill them." (was "The garrison has doubled and the city treasury pays its bills …") | 0 / 1 rendered (`r4g-metropolis-wartime-501`); 4 more in the 180 wartime records (`r4-city-wartime-738`, `-739`, `r4-metropolis-wartime-725`, `-738`) | city–metropolis | **TRUE** in all 5: a City-state government, at war, armed powers, a professional city watch and a garrison. No sovereign town printed the crown's twin. |

### I. Moves with no new words

| # | change | verdict |
|---|---|---|
| R1 | `power/rosterText.js :: settleStandingToRoster` reads a new power's host by its description's tail (`hostByStanding`), not only by `contestsNiche` | **Moved no description in 1,368 births**, lane-only. Every description move base → a5402c006 is a rung (197 + 209). NOTHING TO READ. |
| R2 | `power/stressFactions.js`: the self-governing wartime line moved into a declared constant `WARTIME_SOVEREIGN_MILITARY` | Byte-identical text. Not a new line. |
| R3 | the "the work at {house}" phrase, read for broken fills | No `{`, no "the the", no catalogue label, no count range in 3,591 + 3,710 SUPPLY goals. |

No line of the stage says how the model works: no points, shares, sliders or weights.

## What I did not read in step 1
- The PDF and Foundry exports were built for the 720 only, as view models and journal pages, not as rendered PDF pages.
- E3's 67 + 111 removed armed rows were counted, not read one by one.
- Content profiles other than `grounded` and `grim`. A custom profile admitting slavery without trafficking was not born; the rule's `every` is planted in step 4.
