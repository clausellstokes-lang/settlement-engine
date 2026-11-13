# REVIEW-POWERS-3 — step 1: every new or reworded line of 714381934..96a6ced46, read where it prints

An independent reviewer's list, written from the DIFF of the range (code and data) before the lane's hand-back
(`POWERS-FOLLOW-UP-HANDBACK-2.md`) or any commit message of the range was opened. Nothing on the lane was changed.

**EXECUTED** throughout unless marked PLAUSIBLE. Probes: `docs/chair/2026-11-13/probes/REVIEW-POWERS-3/`.

## The births and the instrument

- **The 720:** the census's seeds (`SECOND-WAVE-CENSUS/seeds.txt`). They were born and rendered at the tip 96a6ced46 and at the base 714381934 by the measuring seat's own `census2.sh` (CENSUS-2 at `lane/census-2-2026-11-13`).
- **The rendering:** every dossier goes through the tree's own `OutputContainer`, as the owner sees it: every group, every sub-tab, every disclosure opened.
- **360 more births, in the app's own shape:** `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false, selectedStresses, _randomizePriorities:true})`, with seeds `rww-<size>-<crisis>-3xx/4xx` (`seeds.extra.txt`). They were rendered at the tip and born (records only) at the base.
  - Per size: 8 calm, 8 succession void, 8 infiltrated, 8 wartime, 4 occupied, 4 siege, 4 famine, 4 fractured, 2 succession+famine, 2 wartime+infiltrated.
  - Plus 24 wartime cities and 24 wartime metropolises, so that the self-governing wartime lines print.
- **Total: 1,080 towns at the tip.**
- **The reading:** `lines.mjs` reads every line below where it prints (the rendered dump of the town) against the town's own record (the census-2 corpus of the same tree). It marks a print NEW where the printed thing differs from the base's same card, power or row.
  - Results: `results/lines720.tip.json` and `results/linesX.tip.json`, one row per line, with up to 60 false and 30 true examples each.
  - Where the script's test is a proxy, I read the examples myself, and the verdict below is mine, not the script's.
- **The scale:** REVIEW-R2-STAGES' READER-BRIEF.md.

**Count:** 47 lines and line classes listed. Of the lines the stage ADDED or PLACED, none is false at HIGH or MEDIUM: 0 origin rows at high, 0 at medium. Four of the stage's placements are false at LOW: L05h, L16f, L16h and L16i. Three MEDIUM classes are OLD and print beside the stage's work: L16-tw, a narrowed cure of the stage's own class; L12-tw, a sovereign twin in others' files; and L06-tw, the roster's thieves' guild in another lane's file. Other LOW: L01-tw, L07-tw, L09s, L11-h, L16b, L16g and L18. NEVER PRINTS: L04a/b and L12a (in 1,080 births); L18 has no reader.

## The lines

Column key:
- **prints**: rows in towns.
- **NEW (t/f)**: prints that differ from the base, then the script's true and false.
- **sizes**: the smallest and the largest size it reaches.
- **crisis**: towns under a forced crisis.

### A. The styled title (R2): `data/faceHonorifics.js :: styledTitleOf`, read by `people/ties.js :: drawTies`, `generateSettlementPipeline.js :: refreshRelationshipProjections`, `domain/people/patronage.js :: faceOf`

| # | line (where, condition) | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L01 | "the lady" / "the abbess" / "the senior abbess" / "the high priestess" as a row's role word, for a woman whose title is "the lord" / "the abbot" / "the senior abbot" / "the high priest" (Relationships rows, `npcComponents.jsx`) | 539 in 231 | 539 (539/0) | hamlet–metropolis | 144 | **TRUE** in every town. Every such row belongs to a woman with that title. E.g. `r2r-town-15` Kyriake Limniotes, `r2r-city-3` Komnenou Kamytzes ("the senior abbess"). |
| L01b | the masculine word on a row | 506 in 235 | 0 new | hamlet–metropolis | 156 | **TRUE**. Every one belongs to a man. No woman's row keeps "the lord" in 1,080 towns. |
| L01c | a culture's card form beside the row's "the lady" ("Jarl", "Emir", "Daimyo", "Tlatoani" print for women too) | (not counted) | | | | **TRUE**: "the lady" is the plain-English truth of her rank. A reader may see two words for one rank. Not listed as false. |
| L01-tw | **twin, the line's (not new):** a woman's disambiguated NAME carries the masculine title: "Járnsaxa Helgason (the senior abbot)", beside "Connection: Lady Abbess Járnsaxa Helgason (the senior abbot)" | 22 lines in 2 towns (`r2r-metropolis-18` and one more) | 0 new | metropolis | 0 | **FALSE, LOW** (two places disagree; old). The styled title's one home does not reach the name's disambiguator (`npcDisplayNames.js`, not this lane's file). |
| L01-pat | the DM block's patronage rows read the styled title (`patronage.js :: faceOf`) | in the DM block | | | | **TRUE** (the lane's own test town `r2r-city-19` Grainne Shaughnessy, "the lady"; read in the dump). |

### B. The midwife's honorific (`faceHonorifics.js`, "the midwife")

| # | line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L02 | "Goodman <name>" for a male midwife | 173 in 173 | 173 (173/0) | village–metropolis | 108 | **TRUE** in every town (every Goodman is a man). |
| L02b | "Goodwife <name>" | 165 in 165 | 0 new | village–metropolis | 106 | **TRUE** (every Goodwife is a woman). |

### C. The DM block's possessives (`data/people/dmPowerLines.js :: askerLine`, `CAPTURE_LINES`), through `powerPossessive` / `powerSentenceName`

| # | line | prints | NEW | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L03a | "<name> is third in <ruler> and holds <share> in <power>, and carries <power>' requests to the two above." | 116 in 114 | (by dump) | hamlet–metropolis | 60 | **TRUE**. No "s's" anywhere. The base prints "Merchant Guilds's requests" 15×, "Religious Authorities's" 5×, "Craft Guilds's" 2× in 548 base dumps read; the tip prints a power's "s's" **0×** in 1,080. Person names keep "'s" ("Aurelius's people"), correctly. |
| L03b | "While the seat of <ruler> stands empty, its steward <name> holds … and <power>' requests go through <name>." | 4 in 4 | | city–metropolis | 3 | **TRUE**. |
| L04a/b | the adversarial "goes after <criminals>' people" and the captured "A case that touches <criminals>' business goes nowhere." | **0** | | | | **NEVER PRINTS** in 1,080 births (no town reached either rung with a named criminal power). |

### D. The lord minted in the old families' category (R1): `data/stressPowerFaces.js :: CLAIMANT_FACE` category `government` → `other`

| # | line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L05a | "Heads an old family while the seat's offices take up more of what the family once did." · "The family's say slowly shrinks beside the offices that run things." (`npcStructure.js` other×stable×dominant, CALM_ONLY) | 36 in 36 | 36 (36/0) | village–metropolis | 0 (calm only: refused under a crisis) | **TRUE**. In every town the lord heads the strongest noble power and the governing power outweighs it. |
| L05b | "Heads an old family while the seat fails, and old names count for more when the seat counts for less." | 21 in 21 | 21 (21/0) | hamlet–metropolis | 19 | **TRUE**. Every card's condition is `governance_fractured` and the page prints "Governance fractured." |
| L05c | "Belongs to a lesser family behind the leading one…" | 10 in 10 | 10 (10/0) | town–metropolis | 6 | **TRUE**. A stronger noble power stands in every town. |
| L05x | an office line on a lord ("Holds an office…") | **0** | | | | the false line is gone (base: lords carried "Holds an office that hangs on a seat someone else is trying to take" etc.) |
| L05y | the governor's debt row (`gov_econ_dependence`) on a lord | **0** | | | | gone |
| L05h | **the other pool's plot hooks on a lord** (re-dealt by the category move): "A customer paid them with a ring…", "Their apprentice has been talking to a rival, and came back with an offer to buy them out.", "Their best customer owes them a year's takings…" | 51 lords of 279 carry a hook that presumes a trade (customer, takings, apprentice, landlord, supplier, a small venture) | base: 34 of the same 279 | village–metropolis | yes | **FALSE, LOW, an old class raised by the move**. Office hooks on lords: 61 → 6; trade hooks: 34 → 51. "Their apprentice … offer to buy them out" (7 lords, new to lords) and "A customer paid them with a ring" (1 → 9) are the rise. Read: `r2r-metropolis-45` Lokesh Das, the lord of Noble Houses, has an apprentice and a business to buy out. |
| L05p | **the other pool's clothes on a lord**: "work clothes patched by someone who loved them" (25 of 151 on the 720), "second-hand fine clothes that don't quite fit" (17), "whatever was available (they don't care about dress)" (26) | 151 lords | all moved | | | **LOW** (a stretch for the head of the leading old family; the base's "sombre official black" and "robes cut for a taller predecessor" were an office the lord does not hold). |

### E. A minted face's secret (`domain/crimeSignal.js :: withTownsOwnUnderworld`, read in `castPowers.js :: landMemberships`)

| # | line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L06a | "On the payroll of the local underworld as a silent informant" | 5 in 5 | 5 (5/0) | city–metropolis | 4 | **TRUE**. Crime stands in every town (criminal houses, `crimeSignalOf.present`), and no thieves' guild. E.g. `r2r-metropolis-39` Eustathios Nikerites, `r2s-indebted-city-0` Chimalli Ox. |
| L06b | "…a powerful outside interest" (on a minted face, a town with no crime) | 9 in 8 | 2 (2/0) | thorp–city | 7 | **TRUE**. |
| L06-tw | **the line's, not this stage's file:** a ROSTER card (not a minted face) in a town with crime and no thieves' guild still reads "On the payroll of the thieves' guild as a silent informant" (`r2r-town-26` Sophronios Chomatenos, the tavern keeper: crime is a "Fence (word of mouth)", no thieves' guild among the powers) | 38 of 86 such secrets in 1,080 | 0 new (identical at base) | town–metropolis | 43 | **FALSE, MEDIUM, old**. The rule's home reaches minted faces only; the roster's rule (`mergeNPCLists`, `npcGenerator.js`, another lane's file) rewrites only where there is no crime at all. |

### F. The title lines' disqualifiers (`data/people/titleSecretsPresentations.js :: TITLE_LINE_DECLARATIONS`, `people/poolMap.js :: settleTitleLines`, read in `representatives.js`)

| # | line | prints | NEW | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L07 | a declared line where it still prints: "Buys fish from boats…" / "Cheerful in the cold and the stink of the market…" (navigable), "…stolen ship's stores…" / "Smells of wax and soap…" (coast), "…the river's driftwood…" / "Easy and talkative, proud of every boat on the river…" / "Watches visitors near the slipway. Keeps the half-built hulls under cover." (river) | 191 in 163 | 0 new | village–metropolis | 95 | **TRUE** in every town (the water stands). The lines are kept where true. |
| L07r | what prints in a refused line's place (the title's next admitted line). E.g. `r2r-village-2` the boatwright: "Built boats with false bottoms…"; `r2r-village-22` the master fishmonger: "Watches the scales and the customers' hands at the same time."; `r2r-village-36`: "Sawdust and tar on the hands…" | 94 secrets and about 90 presentations moved on the 720 | | | | **TRUE**: read in the ten examples of the field diff. Each replacement is a line of the same title that presumes no water. |
| L07-tw | **twin lacking the condition:** the plain fishmonger's "Owes the boats a month of fish…" and "Talks about the boats, the weather and what came in this morning." carry no declaration | 7 in 7 | 0 new | village | 6 | **FALSE, LOW** in `r2s-monster_pressure-village-2` (Mohini Kaur, no water); true in 6. |
| L07f | "Has been selling some of the foundlings…" (topic `human_trafficking`) | 0 printed under a forbidding profile | | | | true by construction; NOT exercised (every birth here is `grounded`). |

### G. The criminal house's default (`domain/dossier/powerSupport.js :: houseBacksOf`)

| # | line | verdict |
|---|---|---|
| L08 | "Under the ruling power, with no power of its own kind here" on a criminal house | **0** at the tip in 1,080 (`houseBacksOf` run on every record). 678 criminal houses in 298 towns now carry no backing row; 1,111 are backed by a power. What prints in place of the default: no "backs" row, so the house stands alone. That is **TRUE** (it is not under the seat's law). Cured by silence; no line was owed. |

### H. The head of a power's row (`npcStructure.js :: headsItsKind`, `UNDER_KINDS`, `HOUSE_KINDS`)

| # | line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L09a | "Leads the faith…" on the head of the strongest religious power | 323 | 165 (165/0) | village–metropolis | 181 | **TRUE** |
| L09b | "Heads the crew…" | 53 | 41 (41/0) | town–metropolis | 19 | **TRUE** |
| L09c | "Heads the casters…" | 65 | 59 (59/0) | town–metropolis | 27 | **TRUE** (1 false is old, unchanged from the base) |
| L09d | "Heads the leading house in the trade…" | 112 | 84 (84/0) | hamlet–metropolis | 57 | **TRUE** on every new print. The 7 old falses are unchanged at base: e.g. `r2s-succession_void-hamlet-0` Titia Caesar, the mine captain heading the governing Free Elder Council. |
| L09u | "Serves the faith under its leaders" / "Holds a place under the crew's boss" / "Works spells under the senior casters" on a card ranked FIRST of its power | **0** | | | | gone |
| L09s | **the rows removed** (89 cards on the 720 lost their structural row: 42 "Serves the faith under its leaders", 26 a crew's place, 10 the casters', 5 a lord's office) | — | — | — | — | **Cured by silence. A read of 30 removed rows: 11 were TRUE**. The card heads a non-governing body of its kind under a GOVERNING body of the same kind (a Church Council, Priestly Guidance, an Ecclesiastical or High Theocratic Council, a Corrupt Council, a Shadow Senate), whose leaders it does serve under: `r2r-town-2` Stylianos Nestongos, the abbot of Religious Authorities 26 under the governing Church Council 48; `r2r-town-18` Sona Parekh, the smuggler heading the Thieves' Guild under the Corrupt Council. Nothing prints in their place. **LOW** (no false print; a true case left empty, against the brief's "a case left empty gets a line true in it"). |

### I. The power step's sentences (`power/*`)

| # | line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L10 | "A ruling that one power refuses to obey" (`conflictIssues.js`) | 56 in 28 | 56 | hamlet–metropolis | 15 | **TRUE** (grammar whole; cast RULE filled in every quarrel read) |
| L11a | "They are always at the table, but cannot set their own terms." for the third power where the top two stand more than 5 apart (`factionStanding.js`) | 231 in 231 | 195 (195/0) | village–metropolis | 120 | **TRUE** in every town read. E.g. `r2r-city-50`: 39 / 13 / 12, where the base said "Three powers stand almost level here, and no one leads". |
| L11c | the kept twin "Three powers stand almost level here, and no one leads…" | 72 | 23 new | town–metropolis | 65 | **TRUE** by the figures (top three within 10, no Dominant label among them) |
| L11b | the steward note "…; each would say it does." | 1 in 1 | 1 | town | 1 | **TRUE** (`rww-town-infiltrated-307`, Landed Gentry beside a feudal steward) |
| L11-h | **old, not the stage's:** a standing sentence on a hidden power ("They are always at the table…", "…get their way through petitions and procedure…") beside "Its presence is not known to the settlement." | 3 of 31 hidden powers | 0 new | | | **FALSE, LOW** (identical at base) |
| L12b | "…The army's supply carts take what they need first… An army quartermaster came last week…" (`governingStressVignettes.js`, City-state government + wartime) | 2 in 2 | 2 | metropolis | 2 | **TRUE** |
| L12a | "The garrison has doubled and the city treasury pays its bills…" | **0** | | | | **NEVER PRINTS** in 1,080 (51 wartime cities and metropolises born; three are self-governing, and none is well supplied) |
| L13b | "…Authority flows through military channels now." (`stressFactions.js`, sovereign wartime) | 4 in 3 | 4 | metropolis | 3 | **TRUE** |
| L13c | "Emergency body coordinating…" / "Emergency body with powers over requisition…" (the War Council, sovereign) | 3 in 3 | 3 | metropolis | 3 | **TRUE** |
| **L12-tw** | **twin lacking the condition, the line's:** in every self-governing wartime town born, the page still names a crown elsewhere: "A crown officer has arrived with requisition orders that will strip the settlement…", "Supply caravans pass through on crown requisition", "<town> is in a kingdom fighting a war it may not win", "sold to crown contracts" | 3 of 3 towns (`rww-metropolis-wartime-404`, `-419`, `rww-metropolis-wartime+infiltrated-300`) | | metropolis | 3 | **FALSE, MEDIUM, old**. It stands beside the stage's new "An army quartermaster came last week": two places disagree about who requisitions. The writers are the crisis's (stressTypes.js and the news, others' files); the stage's sovereign rule reaches only the powers' files. |
| L13a | "An external interest with its own people placed inside the settlement. Its presence is not known to the settlement." (the infiltrator) | 31 in 24 | 31 | hamlet–metropolis | 22 | **TRUE** (each has its face) |
| L15 | "…structural influence the seat cannot easily override." (the noble line where no council governs) | 11 in 10 | 11 | metropolis | 8 | **TRUE** (Ducal Governorship, Grand Guild Consortium) |
| L14 | the standing sentences settled to the final roster (`rosterText.js :: settleStandingToRoster`): 257 standing tails changed on the 720 | 257 | 257 | | | **TRUE**: a read of 28 against the final figures (`results/standdiff720.txt`). E.g. `r2r-hamlet-20`: 55/45 now "in the shadow of" where the base said "narrow". 2 are LOW ambiguities: `r2r-city-14` The Merchant Bloc 8 reads "The criminal network reaches further than the merchant guilds" while the Thieves' Guild 16 = Merchant Guilds 16; the sentence is true of the Bloc itself. |

### J. The claims read against the label (`power/claimStanding.js :: settleClaimsToLabel`): the rung that replaces a commanding claim beside Minor or Suppressed

| # | rung line | prints | NEW (t/f) | sizes | crisis | verdict |
|---|---|---|---|---|---|---|
| L16a | "Clergy are present but operate at the margins of civic life…" | 118 | 107 (107/0) | village–metropolis | 47 | **TRUE** |
| L16b | "The local clergy serve a real pastoral role…" | 6 | 2 | village | 5 | **LOW**: printed beside a Significant label (`r2s-politically_fractured-village-1`, Religious Authorities 36/Significant). |
| L16c | "Mages and arcane practitioners hold real influence through monopoly on magical services…" (Minor) | 223 | 127 (127/0) | town–metropolis | 105 | **TRUE** (Minor is influence without command) |
| L16d | "Magical practitioners are consulted but not formally empowered…" (Suppressed) | 78 | 63 | city–metropolis | 44 | **TRUE** |
| L16e | "Criminal network operating in shadows…" / "A local protection operation tolerated…" | 17 | 16 | town–metropolis | 12 | **TRUE** |
| L16f | "Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries." (Minor) | 139 | 119 | village–metropolis | 64 | **FALSE, LOW**: "council discussions" where no council governs. On the 720 this rises from 12 towns at the base to 40 at the tip (`rungcount.mjs`). E.g. `r2r-city-19` Royal Authority; `r2r-city-16` Noble Governorship. The rung is an old line with no council condition, placed by the stage in 28 more such towns. |
| L16g | "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice." (Minor AND Suppressed) | 168 | 118 | village–metropolis | 81 | **LOW** where the guild is the town's only or leading merchant power. E.g. `r2r-city-51` Merchant Guilds 30 beside The Trade Compact 17 is the leading commercial voice, but Minor overall. |
| L16h | "Gentry families with local landholdings; … outpaced by merchant capital in raw financial leverage" (town, Minor) | 5 | 3 (0/3) | town | 3 | **FALSE, LOW**. `r2r-town-28`: Landed Gentry 15 against Merchant Guilds 9 and Craft Guilds 7. `r2s-wartime-town-0`: no merchant power at all. |
| L16i | "Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital." (city, Minor) | 40 | 34 (23/11) | city–metropolis | 22 | **LOW**: in 11, no merchant power stands. E.g. `rww-city-calm-306`, `r2r-city-6`. |
| L16j | "Hereditary landowners with genuine but not dominant feudal claims…", "Noble families with residual feudal claims…", "Minor landed families with limited political reach…" | 55 | 39 | town–metropolis | 25 | **TRUE** |
| **L16-tw** | **twin lacking the condition (the class the table names as its own):** the commanding claims the table does NOT cover still print beside a Minor or Suppressed label: "Major church institutions hold structural influence. Land grants, hospital networks, and moral authority give them leverage across multiple civic domains." beside "The Holy Compact 5 · Suppressed" (`r2r-city-17`); "Militarised noble families … expect political weight in return" (Landed Gentry 17/Minor, `r2r-town-55`); "Hereditary great families … structurally embedded in governance" (The Peerage 4/Suppressed, `r2r-metropolis-2`); "Standing army with genuine political weight…" (The Order of the Watch 7/Minor, `r2r-city-18`); "The ruling class and the merchant class are the same people…" (Merchant Guilds 20/Minor, `r2r-city-10`) | 174 in 128 at the tip (60 in descriptions the stage rewrote) | | town–metropolis | 83 | **FALSE, MEDIUM** (two places disagree: the description against its own label). The claim class beside Minor/Suppressed is 453 at the base and 122 at the tip on the 720 (`rungcount.mjs`). The stage cures 331 and leaves five sibling claims of the same ladder untouched. The 60 rewritten descriptions are the stage's own output and still carry the claim. |

### K. The Power tab and the PDF (`PowerTab.jsx`, `pdf/sections/PowerStructure.jsx`)

| # | line | verdict |
|---|---|---|
| L17 | the "Breakdown" heading and its chips ("Safety +20", "Defense +6", "Food -3") | **Gone**: the base prints "Breakdown" in 518 of 520 base dumps read; the tip in **0 of 1,080**. What prints in place: the governance paragraph's words ("Safety and strong defences earned it.", `r2r-town-9`). **TRUE**. The PDF: the prop is removed (read, PLAUSIBLE; the PDF text was not rendered here). |

### L. The keeper, styled (`domain/people/seatKeeper.js :: seatKeeperStyledNameOf`), step 5

| # | line | verdict |
|---|---|---|
| L18 | the leaf's answer on every vacant seat born (91: 31 on the 720, 60 on the extra births) | **TRUE in 91 of 91**: the form, then the name ("Regent …", "Acting …"). Never a bare title, never a doubled office word: tested by a repeated word and by the parenthetical title against the form. **But the leaf has NO reader at the tip**: no file under `src/` imports it, so it **NEVER PRINTS**. Its JSDoc ("the Tonight sheet and the conflict card read it") is not so at 96a6ced46. LOW. |

## What I would strike, for the owner's veto

- **L16f's "present in council discussions through intermediaries"** as a Minor rung where no council governs. Keep the line under a council.
- **L16h/L16i's merchant clauses** as rungs where the merchants do not outweigh the nobles.

## What this list did not reach
- The PDF's text and the Foundry export were not rendered. The relationship rows do not print in either: no `src/pdf` or export file reads `npc1Role`/`npc2Role` (grep).
- L07f (the foundling line under a forbidding content profile) was not exercised.
- L04a/b never printed.
