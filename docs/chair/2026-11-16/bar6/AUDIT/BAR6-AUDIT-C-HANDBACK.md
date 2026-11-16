# BAR6-AUDIT-C · HAND-BACK · LAW 6 (the page names no thing, no size and no trade the town lacks) and LAW 7 (an ordinary day is not printed under a crisis or a stated threat)

Seat C of BAR6-AUDIT (M2, kinds K4 and K2). Tree: the joined line at **600b7683a**, with `lane/bar5-audit-a-2026-11-16` (c0ea05497) and `lane/bar5-audit-b-2026-11-16` (d40d6ab28) merged once with `--no-ff`. Branch `lane/bar6-audit-c-2026-11-16`. **I cured nothing.** No line under `src/` changed, I wrote no test file, and I edited no file that another seat or an earlier auditor wrote.

THE FILES OF THIS SEAT
- `tests/helpers/pageLaws/pageC.mjs`: my wrapper beside `pageB.mjs`. It calls `pageB.readTown` unchanged and adds:
  - the size;
  - the trade lists as printed;
  - the Resources tab's denials;
  - the powers' member counts;
  - the defence roster;
  - the stated threats.

  **I made no mend in any shared reader.**
- `tests/helpers/pageLaws/law6.mjs` holds LAW 6: rules 6a to 6e, and 6c-rec on the record.
- `tests/helpers/pageLaws/law7.mjs` holds LAW 7: rules 7a to 7d, and 7w (tone only, WEAK, counted apart).
- `docs/chair/2026-11-16/bar6/AUDIT/runC.mjs` is THE RUNNER. It runs over any PAGE-COPY render:
  `node docs/chair/2026-11-16/bar6/AUDIT/runC.mjs <render-dir> <out.json> [SECOND-CHECK.final221.json SECOND-CHECK.final72.json]`
  - It prints counts by rule: towns, instances, distinct lines, and how many an earlier law (L2, L3, L4n) already finds.
  - It writes `<out>.txt`, and `<out>.controls.json` when given the second-check files.
  - `TRACE=1` adds each line's writer file (by `git grep` in the tree).
  - It keeps one instance for each (rule, tab, line) in a town. An opened part prints a list again, and that is one line.
- `controlsC.json`: the controls, by rule.
- `sampleC.mjs`: the seeded precision draw.
- `tablesC.mjs` builds `TABLES-C.md`.
- `overlapC.cjs`: the overlap with BAR5.
- `sovereignStaticC.mjs`: the static count of 6e.
- `PRECISION-C.md` and `.json`: the judged draw.
- `sovereignPageC.mjs`: 6e on the page (which towns print a sovereign word, and what supplies it).
- `TABLES-C.md`: counts, the thirty commonest lines of each rule, and the writers.
- `tables/`: each population's instances (`C.<pop>.instances.json`, with each line's writer), its printed counts (`C.<pop>.counts.txt`), the controls tables of the 150 and the bar's thirty, and the static sovereign counts.

THE POPULATIONS. Each was born and rendered at 600b7683a in a scratch worktree with its own `npm ci`, by PAGE-COPY's `census3.sh` (`--count-only`), with the output outside every tree:
- the 150 of the wide read (`bar0-<shape>-rand-27..41`);
- the census's 720 (`seeds.txt`);
- the fresh 300 (`seeds.fresh300.txt`);
- the bar read's thirty (`rand-24..26`), for the bar-5 controls.

## 1 · THE CONTROLS

A control is FOUND when an instance **of its own rule**, in its own town, holds the control's text in its line or in its `against` line. Every STANDS control is found, and no EXPLAINED control is found. WEAK controls are reported apart.

| rule | id | verdict | found by | note |
|---|---|---|---|---|
| 6a | C154042 | STANDS | 6a-size | "particular streets" in a thorp of 23 |
| 6a | C209939 | STANDS | 6a-size | "organized neighborhoods" in a village of 128 (culture template) |
| 6a | C206170 | WEAK | 6a-w (apart) | a village's "which few streets": the WEAK class takes it |
| 6b | C39804 | STANDS | 6b-out | cloth and wool on the road out; the exports carry neither |
| 6b | C84094 | STANDS | 6b-denied | chisels on stone; the page says "No one here works the stone" |
| 6b | C115374 | STANDS | 6b-out | pots on the road out; pots are not exported (the potter is short of clay) |
| 6b | C219863 | STANDS | 6b-nomaker | butter churned where no house keeps cattle or dairy and nothing dairy is made |
| 6b | C15780 | STANDS | 6b-nomaker (and 7c) | spice piled where no house makes it, under a siege |
| 6b | C15951 (bar) | STANDS | 6b-nomaker | the fired-clay dust where no house fires clay |
| 6c | C86447 | STANDS | 6c-arms | a hamlet's exports list advanced weapons; its only smith is part-time |
| 6c | C86484 | STANDS | 6c-arms | the same, on the chain's outputs |
| 6c | C88481 | STANDS | 6c-unsold | raw sand exported against "none of the glass sand … is sold beyond" |
| 6c | C204663 | STANDS | 6c-unsold | the pair's other line |
| 6c | C171330 | STANDS | 6c-halfway | "no charcoal burner finishes it" against charcoal exported |
| 6c | C158113 | STANDS | 6c-unworked | "No one here works the stone" against a Running stone chain |
| 6c | C39608 (bar) | STANDS | 6c-arms | fine arms yielded where the iron gap says intermediate goods only |
| 6c | C37887 (bar) | STANDS | 6c-halfway | hides "stop half-way" against boots and saddles yielded |
| 6d | C161931 | STANDS | 6d-court | "a hall of justice" under "Legal Infrastructure · Prison only" |
| 6d | C203044 | STANDS | 6d-paid | "forces are present and paid" where only volunteers stand |
| 6d | C91256 | STANDS | 6d-members | "its members cannot agree" on a one-member authority |
| 6d | C128237 | STANDS | 6d-blurb | "a small group of traders who come on market days" in a metropolis |
| 6d | C113231 | STANDS | 6d-fields | the foodways' "raised fields" in a town that farms no field |
| 6d | C43925, C39734 (bar) | STANDS | 6d-force | the military power's stock blurb ("Significant military force for this scale", "Armed patrol of able-bodied residents") on an empty roster (BAR5-POWERS (b) cures it) |
| 6e | C42840 (bar) | STANDS | 6e-sovereign | "Collects the lord's dues" where no lord is |
| 6e | C48148, C48270, C48442 | EXPLAINED | clear | a war's crown requisition: not found (ruling LD1) |
| 7 | C3247 | STANDS | 7b-defence | "defended in the ordinary way" under a siege |
| 7 | C94460 | STANDS | 7d-traffic | a work party heads out singing, under a siege |
| 7 | C150831 | STANDS | 7d-traffic | laden porters counted in at an isolated thorp that brings nothing in ("nobody counts who comes in") |
| 7 | C85036, C205552 | STANDS | 7a-nothreat | "nothing threatens it now that a wall would keep out" on a monster frontier, Beasts & Monsters Critical |
| 7 | C146255 | STANDS | 7a-nothreat | "Nothing presses …" under "Tense — regional monster threat" |
| 7 | C157891 | STANDS | 7c-plenty | "Nobody here talks about the price of bread" beside bread marked short |
| 7 | C26390 | STANDS | 7b-defence | "fresh repairs … in working order" where the walls are Impaired |
| 7 | C217292 | STANDS | 7c-plenty | the market "handles more than the village could ever use" in a famine |
| 7 | C184150 | STANDS | 7c-plenty | "a poor year … does not empty the tables" where households go short |
| 7 | C40276 (bar) | STANDS | 7c-plenty | "without going hungry", food Pressured |
| 7 | C43575, C0350, C3223, C5452 (bar) | STANDS | L2.famine.work, L2.siege.abroad (kind `stands_by_L2`) | LAW 2's own rules find these, and the runner reads LAW 2 in their towns. LAW 7 does not count them again. |
| 7 | C0013, C4592 | WEAK | not found | a poet's crowd and a craftsman's piece under a siege: tone only. No rule of mine reads leisure. |
| 7 | C61115, C79603, C218186, C218926 | WEAK | 7w-tone (apart) | traffic or a singing work party under a war or a famine: the work goes on |
| 7 | C0343, C182276 | EXPLAINED | clear | the market's own siege text; food handed out in a Secure, poor town |

All eleven bar-read controls were printed again at 600b7683a and are found: the run over `rand-24..26`, `controlsC.json`.

## 2 · THE COUNTS

Towns · instances · distinct lines. The full table, the thirty commonest distinct lines of each rule with their towns, and the writers by file are in `TABLES-C.md`.

| rule | 150 | 720 | fresh 300 |
|---|---|---|---|
| 6a-size | 13 · 14 · 14 | 26 · 26 · 26 | 18 · 19 · 19 |
| 6b (denied, nomaker, out) | 11 · 11 · 6 | 38 · 38 · 8 | 26 · 26 · 6 |
| 6c (arms, halfway, unsold, unworked) | 14 · 20 · 14 | 32 · 54 · 37 | 17 · 23 · 12 |
| 6c-rec (on the record) | 2 | 8 | 0 |
| 6d (blurb, court, fields, force, members, paid) | 21 · 21 · 14 | 70 · 70 · 38 | 26 · 27 · 17 |
| 6e-sovereign | 0 | 3 · 3 · 1 | 1 · 1 · 1 |
| **LAW 6** | **55 · 68 · 49** | **156 · 199 · 111** | **78 · 96 · 55** |
| 7a-nothreat | 12 · 12 · 12 | 38 · 38 · 38 | 15 · 15 · 15 |
| 7b-defence | 3 · 3 · 3 | 1 · 1 · 1 | 11 · 11 · 11 |
| 7c-plenty | 4 · 4 · 4 | 12 · 13 · 13 | 10 · 10 · 8 |
| 7d-traffic | 2 · 2 · 2 | 1 · 1 · 1 | 1 · 1 · 1 |
| **LAW 7** | **20 · 21 · 21** | **52 · 53 · 53** | **35 · 37 · 35** |
| **BOTH** | **68 · 89 · 69** | **198 · 252 · 163** | **104 · 133 · 89** |
| WEAK apart: 6a-w · 6b-w · 7w-tone | 27 · 0 · 8 | 140 · 6 · 9 | 51 · 2 · 10 |

The towns in a law's row are distinct towns, so the row is less than the sum of its rules.

BY WRITER FILE (the 720). The fact each line should have read is given in section 4.

| writer | rules | instances |
|---|---|---|
| `src/data/dossierStateProse/defense.generated.js` (the DS-DEF desk) | 6a-size 19 · 7a 38 · 7b 1 | 58 |
| `src/data/arrivalProse.js` (the arrival sense pools) | 6b 38 · 7c 1 · 7d 1 | 40 |
| `src/data/supplyChainData.js` + `tradeGoodsData.js` (the chains' outputs and the exports) | 6c-arms 37 | 37 |
| `src/data/dossierStateProse/power.generated.js` (the DS-POW desk) | 6d-members 33 | 33 |
| `src/data/cultureProfiles.js` (the culture's foodways and architecture) | 6d-fields 20 · 6a-size 1 | 21 |
| `src/domain/display/validationOnPage.js` (the Resources tab's gap lines) | 6c-unworked 11 | 11 |
| `src/data/dossierStateProse/stressors.generated.js` | 6a-size 6 | 6 |
| `src/generators/resourceGenerator.js` and untraced (the half-way gap lines) | 6c-halfway 6 | 6 |
| `src/generators/power/rulingStructure.js` (the military power's description) | 6d-force 9 | 9 |
| `src/data/dossierStateProse/economy.generated.js` and `general.generated.js` | 7c 12 · 6d-court 2 | 14 |
| `src/data/institutionServices.js` ("Collects the lord's dues") | 6e 3 | 3 |
| `src/generators/structuralValidator.js` | 6d-paid 4 | 4 |
| `src/data/powerSiblings.js` + `src/generators/power/rulingStructure.js` | 6d-blurb 2 | 2 |
| the record (`economicState.primaryExports`) | 6c-rec 8 | 8 |

THE 6e STATIC COUNT (`sovereignStaticC.mjs`). I count the lower-case sovereign words in the string literals of `src/`, leaving out tests and comment lines.
- lord, lords, lord's, liege, overlord: **197 lines in 62 files; 163 of them declare nothing (in 61 files)**.
- crown, noble oversight: **60 lines in 27 files; 56 undeclared (in 26 files)**.

A line counts as declared when it carries a `needs`, `excludes`, `crisis`, `twinOf`, `colour`, `requires` or `gate` key.

**I could not reproduce BAR5-THINGS's 98 lines in about 45 files.** That seat's branch is not on origin, and its method is not written down where I can read it. My count is a different one, and its method is stated above.

ON THE PAGE, 6e IS ALMOST EMPTY (`sovereignPageC.mjs`). 256 of the 720 towns print a sovereign word, and in all but nineteen something supplies a sovereign:
- the government, a power, a house or a person;
- or the founding ("a noble granted lands by the crown");
- or a war.

Of those nineteen, sixteen are spared by the hedge ("the lord or municipality") or by the war (LD1). **3 instances stand in the 720, 1 in the fresh 300 and 1 in the bar's thirty, all one line:** "Collects the lord's dues and the tithe" (`institutionServices.js`, BAR5-MARKS's line by name; LAW 4n's `4n-lord` finds it too). **THE STOCK IS IN SOURCE, NOT ON THE PAGE.** It is seat G's to register.

A SEAT'S OWN SLIP, MENDED. My first fact test read "king" inside "ma*king*" in a founding's story and took it as a sovereign. The words are now whole words. That lifted 6e from 0 to 3 in the 720.

## 3 · PRECISION

The draw is twenty instances of each rule (all of them where a rule has fewer), drawn at random from the 720 with seed 617. The three rules changed after that draw (6d-force, 6e-sovereign, 7c-plenty) were drawn again with seed 618. Each instance is judged by the second check's rules. The whole draw is in `PRECISION-C.md` (and `.json`).

| rule | share that stands |
|---|---|
| 6a-size | 20/20 |
| 6b-denied | 3/3 |
| 6b-nomaker | 19/20 |
| 6b-out | 12/12 |
| 6c-arms | 20/20 |
| 6c-halfway | 6/6 |
| 6c-rec | 8/8 |
| 6c-unworked | 11/11 |
| 6d-blurb | 2/2 |
| 6d-court | 2/2 |
| 6d-fields | 20/20 |
| 6d-force | 9/9 |
| 6d-members | 20/20 |
| 6d-paid | 4/4 |
| 6e-sovereign | 3/3 |
| 7a-nothreat | 20/20 |
| 7b-defence | 1/1 |
| 7c-plenty | 13/13 |
| 7d-traffic | 1/1 |

The one WEAK row: racks of drying fish "laid in against the winter" where no house fishes.

THE NARROWING, MEASURED. A first draw (seed 616), taken before these narrowings, read three rules under seventeen in twenty. Each was narrowed and counted again:
- **6a-size: 14/20.** "Reach the streets" and "not in the streets" are figurative (the public, not a place). They are now spared, and a single "the street" or "street kitchens" moved to the WEAK class.
- **7c-plenty: 7/20.** The market's throughput and the piled stalls were read against a Pressured food word.
  - They now deny only a famine or a siege.
  - The bread line denies only bread marked short.
  - Only the tables' reassurance reads a Pressured word or households going short.
- **6b-out: 15/18.** Where wool is exported but cloth is not, the line is one loose word. It is now `6b-w`, apart.
- Smaller cuts:
  - 6b's "cloth" no longer matches "cloth over their faces";
  - "Little cloth is made here" is no denial of cloth drying;
  - a court named in a tie (World tabs) is no claim;
  - "waiting for the carts" alone may be the army's carts.

**SAID PLAINLY:**
- **6d-fields** is one culture line in twenty towns. I judged it on C113231's reading: no farm house and no grain made. A town that eats by tribute from the country around may make it WEAK. The second check read it STANDS once.
- **6b-nomaker**'s spice lines in a town that neither makes, imports nor exports spice: I judged them STANDS, as naming a good the town lacks. The second check's only spice row (C15780) also had a siege.

## 4 · THE CURE'S FORM (proposed, not made)

- **6a SIZE.**
  - THE ONE FACT: a size atom in the fact vocabulary:
    - streets and alleys: a village or larger;
    - districts, quarters and neighbourhoods: a town or larger.
  - It is declared on the DS-DEF desk's crime lines ("lone thieves … an alley … running the streets", "particular streets", "quarrels … on X's streets"), on the stressors desk's occupation line and on the culture template, each with a twin ("the lanes", "between the houses").
  - The desk lines are display only (annex blocks).
  - The culture template's `architecturalDetail` is stored on the record (`culturalIdentity`), so curing it is a declared move of the reference.
- **6b A GOOD IN A SCENE.**
  - THE ONE FACT: `trade at work: <good>` read from the page's own lists: the house that makes the good, Produced locally, the Exports, and the Resources gap ("No one here works the stone").
  - The sense pools of `arrivalProse.js` are chosen by a loose house-name match: "common grazing" opens the butter scene with no dairy, "apothecary" opens the spice stalls, "glassblower" opens the pots, "mine" opens the chisels. Each line declares the good it shows.
  - A line of goods LEAVING ("road out") needs `exports: <good>` and takes its twin otherwise. The file already holds such twins ("stacked high in the workshops" for an isolated route).
  - The scene is stored (`arrivalScene`), so the cure moves the record.
- **6c AN OUTPUT BEYOND THE HOUSE.**
  - THE ONE FACT: what a house can make. A part-time smith makes no fine arms, and an iron gap of "intermediate goods only" makes none either. The chain's outputs and the exports (`supplyChainData.js`, `tradeGoodsData.js`, the writer of `economicState.primaryExports`) read it.
  - The pair lines ("none of it leaves" against raw sand exported; "No one here works the stone" against a Running chain; "stops half-way" against the finished good) are one fact each: the gap and the chain's state are decided once and read by both surfaces (`resourceGenerator.js`, `validationOnPage.js`, `computeActiveChains.js`).
  - The exports are stored, so the cure moves the record. The Resources lines are display only.
- **6d AN OFFICE, A FORCE, A BODY.**
  - members: DS-POW's "its members cannot agree" declares two members or more, from the power's count, with a twin for one holder.
  - force: the military power's description (`rulingStructure.js`) reads the roster. BAR5-POWERS (b) holds this.
  - paid: `structuralValidator.js` "present and paid" reads the defence roster (`src/domain/facts/defence.js`: a paid force is a garrison, a watch or mercenaries).
  - court: DS-GEN's "a hall of justice, a gaol" reads the legal infrastructure.
  - blurb: the power's stock description reads the tier.
  - fields: the culture's foodways line reads a farm house or grain made.
  - All are display only except the power blurb (`rulingStructure.js` stores the description) and the culture line (stored in `culturalIdentity`).
- **6e THE SOVEREIGN WORDS.**
  - THE ONE FACT: the sovereign atom. A lord, a noble, a crown or an appointee comes from the government, the powers, the houses, the people or the founding, or from a war (LD1).
  - It is declared on the 163 + 56 undeclared source lines (seat G's register). On the page today it prints false once in 1,170 towns.
- **7a "NOTHING THREATENS".** The DS-DEF line reads the page's own Beasts & Monsters band, and the monster frontier or plague, and takes a twin ("nothing a wall would keep out, though beasts come down from the hills"). Display only.
- **7b CALM DEFENCE.** "Defended in the ordinary way" declares `no crisis: under_siege, wartime, occupied`. "Fresh repairs … in working order" reads the walls' Impaired mark. Display only (DS-DEF).
- **7c PLENTY UNDER WANT.**
  - The market's "more than … could ever use" declares no famine and no siege.
  - "Nobody talks about the price of bread" reads the bread's short mark.
  - The tables' reassurance reads the food word the page prints (BAR5-FOOD's fact (c)).
  - The market and bread lines are display only. The arrival lines are stored.
- **7d TRAFFIC.** The porters' scene declares `route: isolated` excluded where nothing is imported. The work party "heads out" declares `no crisis: under_siege`. These are stored (`arrivalScene`).

## 5 · THE OVERLAP WITH THE ROUND IN FLIGHT (`overlapC.cjs`)

An instance is the round's when it sits on a line or a fact a BAR5 seat's section names. In the WEAK classes, none is counted.

| | 150 | 720 | fresh 300 |
|---|---|---|---|
| instances of laws 6 and 7 | 89 | 252 | 133 |
| held by BAR5 | 20 | 63 | 34 |
| the next wave's | 69 | 189 | 99 |

By seat (figures from the 720):
- **BAR5-CHAINS** holds:
  - the half-way lines (6c-halfway: 6 of 6);
  - the stone chain Running over unworked stone (6c-unworked: 11 of 11; its file `validationOnPage.js`);
  - the fine arms where the iron gap denies them (17 of 37; LAW 3's `L3.halfway` finds 6 of those lines).
- **BAR5-POWERS** holds:
  - (b) the military blurb on an empty roster (6d-force: 9 of 9);
  - (a) the power blurb (6d-blurb: 2).
- **BAR5-FOOD** (c) holds the tables' reassurance in want (7c: 8 of 13).
- **BAR5-THINGS** holds:
  - (d) the kiln line (3);
  - (e) the court words (6d-court: 2);
  - (e) the quarters words (2 of 26 6a-size).
- **BAR5-MARKS** holds "Collects the lord's dues" by name (6e: 3 of 3).

NOT HELD (the next wave's):
- 7a "nothing threatens" (38) and 7b (1). Their file is BAR5-SAFETY's DS-DEF desk, but no fact of that seat names them.
- 6d-members (33). Its file is BAR5-POWERS's DS-POW desk; the fact is not named.
- 6d-fields (20). Its file is BAR5-WORLD's `cultureProfiles.js`; the fact is not named.
- 6a's streets (24 of 26).
- 6b's goods scenes (35 of 38).
- the part-time smith's fine arms (20) and 6c-rec (8).
- 6d-paid (4).
- 7c's market and bread lines (5).
- 7d (1).

## 6 · FOR THE OWNER, IN PLAIN WORDS

In plain words: **about one town in four of the 720 (198 towns; 104 of the fresh 300) prints at least one sentence of these two kinds that its own page denies.** Some name a thing, a size or a trade the town lacks: 156 of the 720. Some print a calm, ordinary day under a crisis or a stated threat: 52.

**The stock is shallow in sentences:** 163 distinct sentences in the 720. Most of the count comes from a handful of stock lines, each printed wherever its pool is drawn:
- "nothing threatens it now that a wall would keep out" on a monster frontier (38 towns);
- "its members cannot agree" on a council of one (33);
- a part-time smith's "advanced weapons and armour" (15 towns, 37 lines);
- butter churned where no one keeps cows, and spice piled where no one sells spice (23);
- a hamlet's or a thorp's "streets" (26);
- a city's foodways crediting fields it does not farm (20);
- cloth on the road out where none is exported (12);
- an "armed patrol of residents" where there is no militia (9).

**ONE FACT CLEARS A LINE EVERYWHERE IT PRINTS. Eight facts clear about nine tenths of the count:**
- the monster threat read by the defence desk;
- the member count read by the power desk;
- what a house can make, read by the exports and the chains' outputs;
- the trade at work read by the arrival scenes;
- the town's size read by the street words;
- a farm read by the foodways line;
- the defence roster read by the military blurb;
- the food word read by the reassurances.

The round in flight already holds a quarter of the count (63 of 252 in the 720): the chains, the military blurb, the food reassurance, the kilns, the court words and the lord's dues. The rest is the next wave's, and most of it is display only. **Three cures move the stored record:**
- the arrival scene;
- the exports;
- the culture template.
