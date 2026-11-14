# UPKEEP-MONOTONE-MEASURE: adding a house must never lower a score. Measured and shown, NOTHING BUILT

Seat UPKEEP-MEASURE-2, 2026-11-14, for the chair. Measured at the defence lane's tip **c56fd565e**. The lane moved on origin to
26474cda9 during the work: one docs-only commit, with none of the defence files touched. I stayed on c56fd565e. Every
figure here is **EXECUTED**, re-made by a command listed in the last section. Where a figure is PLAUSIBLE, it says so.
Candidates are patches in `probes/UPKEEP-MEASURE-2/patches/`. No file under src/ or tests/ is changed by this branch.

## The first page

**What is wrong today, in one town.** r2r-village-0, a village: add an Alchemist shop and its Economic reads **38 → 21**.
The shop opens only a sustaining part, its magic. Limit 1 ("what sustains a force counts for no more than the force")
holds EVERY sustaining part to the force together, so the supply loses what the magic gains. Across the reader's 972
births, adding a house or a larger rung lowers a score or readiness in **292 births (1,751 house-and-score falls)**.
That counts the magical score, which the reader's probe did not read. The reader's own count was 1,206 in 265, and I
reproduced it byte for byte. Widened to every catalogue house and every ladder pair, the falls are **5,195 in 604
births**.

**The candidates, one sentence each** (falls are on the reader's set over the 972; moves are on the lane's 3,756 births
against the tip):
| | the candidate | falls left | readiness moved / bands | score bands | powers re-drawn | AI threats |
|---|---|---|---|---|---|---|
| **P2** (the chair's) | limit 1 held SCORE BY SCORE, and readiness's sustaining total held to the force on limit 1's own line | 61 | 279 / 23 | 425 | 23 | 141 |
| P2 rival | limit 1 holds the supply score alone | 60 | 383 / 147 | 435 | 147 | 151 |
| **P3** | a house on no ladder counts as the least rung the catalogue offers at its size or above (13 houses) | (composes) | 317 / 33 | 60 | 33 | 7 |
| **P4** | the military score is full at its people's measure, one point a person | (no effect on falls) | 393 / 134 | 261 | 75 | 0 |
| P4 at two points a person | the same, at two | | 181 / 42 | 103 | 18 | 0 |
| **X** (mine: the residue P2 leaves) | the will's hold score by score with a floor; the traditions' cap on what they count; the siege's two reliefs both kept; "monasteries"; figures read at hundredths | with P2: 3 → 0 | 590 / 57 | 258 | 42 | 49 |
| **ALL TOGETHER** (P2 + P3 + P4 + X) | | **0 in 972 births** | **1,214 / 214** | 889 | 157 | 176 |

**Recommendation, item by item:**
- **P2: build the chair's candidate.** It holds P1 for every fall that limit 1 caused. Its readiness falls (276, at most
  2 points) are all in births whose list holds a negative sustaining part ("provisions short", "food processing
  broken"); today's hold had softened those, and now they count in full (55 of the census's 55). The rival moves six
  times the bands for the same cure.
- **P3: build as measured.** No off-ladder house counts for more than a house the catalogue offers at its size or above.
- **P4: build the form.** The value is the owner's: I recommend 1 point a person, and show 2 beside it. One warning for
  the join: P4 makes more small places read "Undefended" (464 → 526 of 3,756). That is the label the reader's H1 found
  false beside walls, so H1's display cure should land first.
- **X: build X1–X5 and X9 with P2.** Without them, P1 is not at zero.
- **P5: the score stands; the line moves.** The falls are the stage's cures as designed, plus a band line crossed by 0.6
  of a point. The lines that print "effective" beside a Critical score belong to the display seat.
- **Two scope questions for the chair**, named below and not cured. A criminal house lowers order by design (1,829
  falls). Six renames across a function or a government are not "a larger house of its own kind" (191 falls).

**The bands the recommended set (ALL TOGETHER) moves:** readiness bands in **214 of 3,756** births, and the five
scores' bands **889** times. On the census, 44 of 720 readiness bands and 166 score bands.

---

## 1. The red: the reproduction (item 1)

`mono.mjs` (the reader's) at c56fd565e: **1,206 fall rows in 265 births, identical to the reader's `mono.tip.ndjson`**.
`mono2.mjs` reads all five scores and readiness. It marks the reader's set (houses that open a scaled part, ladder pairs
sharing a scaled job) and widens it to all 282 catalogue houses at the tier or one around, and to every pair of
`UPGRADE_CHAINS`. The tables by house are in `results/mono2.tip.txt` (reader's set) and `results/mono.reader-instrument.tip.txt`.

The leading falls on the reader's set at the tip, by house (births; the score that falls):
- Healer (divine, 1st level): 253 (economic 208, magical 80, military 10)
- Druid Circle: 165 (economic 143)
- Alchemist shop: 145 (economic 125)
- Monastery or friary: 145 (economic 89, magical 77)
- Small hospital: 117 (magical 90, economic 56)
- Elder Grove Council: 80 (economic 56)
- Alchemist quarter: 84
- Small prison: 40 and Large prison: 38 (military)
- City hall: 28 (military)
- Town hall → City hall: 28 (military)
- Monastery → Multiple monasteries: 21, readiness included (the reader's L4)
- Alchemist shop → Alchemist quarter: 5 (economic)

### The causes, each traced in one birth (`why3.mjs`, `dims.mjs`)
| cause | example | cured by |
|---|---|---|
| limit 1 holds all sustaining parts together, so a part on one score lowers another | r2r-hamlet-1 + Druid Circle: economic 43 → 31 (the magic part appears) | P2 |
| limit 1 also shrinks the NEGATIVE sustaining parts, so more force means a bigger penalty | r2r-town-2, Town hall → City hall: military 26 → 25 ("provisions short" relieved less) | P2 |
| R13 holds the will's military and order together, so law (a court) lowers military | r2r-village-6 + Small prison: military 93 → 88 | X1 |
| the same hold, through a crisis's relief | r2s-plague_onset-town-3 + Alchemist shop: order 19 → 17 | X1 |
| a wall switches the hold on, below the unheld will | r2r-thorp-20 + Palisade: order 22 → 21 | X4 |
| the traditions' cap of 35 is taken on the weights, before the house scale and pay | r2s-infiltrated-town-0 + Druid Circle: beasts 89 → 88 | X2 |
| under siege, the teleport's supply relief REPLACES the guild's order relief (`else if`) | rv5-under_siege+famine-metropolis-4 + Teleportation circle: order 77 → 70 | X3 |
| "monasteries" does not contain "monastery" | r2r-town-2, Monastery → Multiple monasteries: readiness 39 → 36 | X5 |
| float noise at a half point: a held sum, exactly unchanged, reads one lower | rv5-under_siege-town-4 + Alchemist quarter: economic 30.500000000000007 → 30.499999999999996 | X9 |

## 2. Each candidate, measured (item 2)

The monotonicity probe on the 972, for each tree. Each count is change-and-score falls and the births they fall in
(`results/mono2.<tree>.txt`):

| tree | reader's set | widened set |
|---|---|---|
| tip | 1,751 in 292 | 5,195 in 604 |
| P2 | 61 in 35 | 2,463 in 496 |
| P2 rival | 60 in 34 | 2,462 in 496 |
| P3 alone | 1,813 in 296 (a smaller factor tightens limit 1; composes with P2) | 5,289 in 602 |
| X alone | 1,652 in 272 | 4,708 in 592 |
| P2 + X | 3 in 2 (all float noise, the X9 rows) | 2,025 in 481 |
| P4 alone | 1,751 in 292 | 5,193 in 604 |
| **ALL** | **0 in 0** | 2,020 in 480 |

**What ALL leaves on the widened set:**
- **1,829 falls in 454 births from the 13 criminal houses.** Crime works against order, by design (the AGAINST group). P1
  as written would forbid this; I recommend P1 be read over the houses that defend.
- **191 falls in 115 births from six renames that are not a larger house of the same kind.**
  - Citizen militia → Town watch, and Citizen militia → Professional city watch, 65 each: a change of function. The
    beasts-fighting militia goes.
  - Lord's steward → Lord's appointee (34) and Village reeve → Town council (18): the greater rung of the government
    ladder is not read as "Elders and reeve".
  - Wizard's tower → Mages' guild (7): the tower's +5 goes, and the guild's +8 needs the dial at 55.
  - Traveling hedge wizard → Hedge wizard (2): the magic presence counts both of the traveller's keywords
    (`priorityHelpers.js :: computeEffectiveMagicPresence`).
  - None is cured here. The chair rules whether P1's "enlarging" covers them.

**The moves.** Each candidate against the tip, by script (`cmp.py`). Corpus = the lane's 3,756; census = the 720.

| candidate | corpus: readiness moved (up/down), mean; bands | corpus: score bands; powers; threats | census: readiness moved; bands | census: score bands; powers; threats |
|---|---|---|---|---|
| P2 | 279 (3/276), −0.07; 23 (Lightly → Vulnerable 12, Defensible → Lightly 9) | 425; 23; 141 | 55 (all down); 8 | 82 (supply 39, magic 37); 8; 34 |
| P2 rival | 383 (all up), +0.53; 147 | 435; 147; 151 | 72 (all up); 27 | 82; 27; 35 |
| P3 | 317 (59/258), −0.09; 33 | 60; 33; 7 | 56; 4 | 10; 4; 1 |
| P4 (1 a person) | 393 (all down), −0.45; 134 (Lightly → Vulnerable 68, Vulnerable → Undefended 60) | 261; 75; 0 | 77; 25 | 55; 15; 0 |
| P4 (2 a person) | 181 (all down), −0.17; 42 | 103; 18; 0 | | |
| X | 590 (231/359), −0.06; 57 | 258 (military 129: Strong → Adequate 49); 42; 49 | 101; 9 | 51; 8; 8 |
| P2 + X | 717 (217/500), −0.13; 80 | 622; 65; 171 | 125; 18 | 119; 17; 39 |
| **ALL** | **1,214 (249/965), −0.61; 214** (Lightly → Vulnerable 94, Vulnerable → Undefended 68, Defensible → Lightly 24) | **889; 157; 176** | **208; 44** | **166; 34; 39** |

In every run no power appears or vanishes: the powers are re-drawn, not gained or lost. Under P2 the supply and magic
scores rise where today's hold split one share between them. On the census: supply up in 75 births and magic up in 75,
up to +31.

### P2, the form measured (`patches/c2.patch`)
- On each score, the positive points of the sustaining parts are held to the force's whole points, on that score's
  scale (the force's readiness points times the number of scores). The parts of that one score are held together.
- Negative sustaining points count in full.
- Readiness's sum is held to the same sum without what sustains, plus the force. Both sides only rise when a house is
  added, so their least only rises.
- The second hold is carried on limit 1's own line ("Stores and supply can carry no more than the force can use"), so
  there is **no new word**.
- When no score is full at 100 and no sustaining part is negative, readiness is exactly today's.
- **P2 does not fail P1 anywhere limit 1 is the cause.** Its 61 remaining falls are the residue X cures.

### P3, every off-ladder house of a laddered part (`patches/c3.patch`, `results/ladders.c3.txt`)
Rule: the least rung of the part's ladders that the catalogue offers at the house's own least tier or any greater tier.
Where nothing is offered at or above that tier, the greatest rung. A part with no ladder (wardens) and a custom house
keep 1.

| part | house [tiers the catalogue offers it at] | today | placed |
|---|---|---|---|
| court | Democratic assembly [ci, me] | 1.00 | 1.00 (Multiple courthouses) |
| charter | Hireling hall [to, ci, me] | 1.00 | **0.80** (Adventurers' charter hall) |
| clergy | Monastery or friary [to] | 1.00 | **0.80** (Cathedral, offered at city) |
| market | Fish market [vi, to, ci, me] | 1.00 | **0.80** (Market square) |
| market | Caravaneer's post, Carriers' guild [to] | 1.00 | **0.80** |
| market | Auction house, Cobbler's guild, Tailor's guild [to, ci, me] | 1.00 | **0.80** |
| market | Furrier's district [ci, me] | 1.00 | 1.00 (Merchant guilds (15-40)) |
| market | International trade center [me] | 1.00 | **1.20** (every market rung at a metropolis) |
| hospital | Healer (divine, 1st level) [vi] | 1.00 | **0.80** (Small hospital) |
| alchemists | Apothecary district [ci, me] | 1.00 | **1.20** (Alchemist quarter) |

**Not cured by P3: anchor B's own cross-ladder order** (ruling 3). In one part, ladders of different lengths put rungs of
one size apart: a Weekly market (village and town) at 0.93 against a town's Market square at 0.80; Parish churches
(10-30) at 1.07 against a city's Cathedral at 0.80. P3 places the off-ladder houses below both, and the ladders' own
order is the chair's to reopen.

### P4: where the levy's points come from (r2s-under_siege-thorp-2, 6 people, military 71 "Strong")
- **The parts, military points:** palisade 18, will about 22 (dial 60 × 0.35 × the neighbour, held to the armed
  bodies), the levy 8 (10 × 0.8, paid), armed households 6, parish 3, remoteness 8, and the hills × 1.18 on all that
  stands and is built.
- **What the levy adds is mostly not its own 8.** It mans the palisade (limit 2: unmanned walls count half), and it
  raises the will's hold, because the will is held to the armed bodies' whole points.
- **What bounds them today:** R13 (whole points), limit 2 and fullness at 100. **Nothing reads the people.**
- **X alone** takes the reader's three besieged thorps to 62, 58 and 56 (Adequate). Thorps of 17–19 people still read
  Strong (65).
- **P4** makes the military score full at the people × `milPerHead` (never above 100). Excess is held in reserve on the
  fullness line's own words ("Military: more than enough, held in reserve"), so there is no new word. Those words read
  loosely for "more than its people can use". A precise word would be new, and is PARKED.
- **The besieged thorps under P4:** at 1 a person they read 6, 7 and 9 (Critical); r2r-thorp-6 (19 people) reads 19;
  r2r-hamlet-11 (46 people) reads 46 (Adequate).
- **Strong in thorps and hamlets, corpus:** 76 at the tip, 25 at 1 a person, 47 at 2.
- **The smallest change that makes the word true at every size:** 1 a person makes "Strong" need at least 65 people,
  which is a village. 2 lets a hamlet of 33 read Strong behind a palisade, and I would not call that true. Either value
  is the owner's.

### Holders (the brief's law, by content): FOR THE JOIN, nothing
Each touched file's copy on every lane was compared with the integration line's: `defenseGenerator.js`,
`defenceWeights.js`, `houseScale.js` and `defenseInstitutionBuckets.js`. Only the defence lane's family differs (this
lane, upkeep-capacity, the readers, join and join-rehearsal).

The other copies of the buckets file (142, 37 and 2 lanes) are earlier versions of the integration line's own history
(blobs 9d1d620d, 10d3b228 and cea71534, all in its log). Those lanes do not hold the file. The defence lane holds every
file the candidates touch.

## 3. The owner's example and the eight towns (item 3)

**The shop against the quarter**, in all 158 births of the 972 that hold either (`alch.mjs`: that house written as each,
the record otherwise untouched):

| tree | quarter above the shop on readiness | equal | below | quarter below the shop on ANY score | size shows on no rating |
|---|---|---|---|---|---|
| tip | 76 | 82 | 0 | **5** (economic 5, military 1) | 37 |
| P2 | 75 | 83 | 0 | **0** | 33 |
| P3 | 65 | 93 | 0 | 5 | 46 |
| ALL | 64 | 94 | 0 | **0** | 44 |

So under P2 a quarter never reads below a shop, on any score, in any of the 158 (P1 holds). It reads ABOVE only where the
force can use the extra supply. Where the force cannot, limit 1 holds both at the force's measure. The cause is the
limit's design, which the chair's P2 keeps: P2 makes the hold fair, and the hold still binds.

**Ioannoakra** (cold-wartime-town-75), the file's own example: one watch, an alchemist's shop.
- At the tip, shop / quarter: readiness 28 / 28; supply 31 / **30**; magic 25 / 25.
- Under P2 and ALL: readiness 27 / 27; supply 53 / 53; magic 53 / 53.
- Supply and magic no longer share one hold. The quarter no longer reads lower. Both reach what the town's one watch can
  use, so the quarter reads the same.
- Readiness 28 → 27: its "provisions short" now counts in full.

**The eight towns, before (the tip) and after (ALL), in plain words:**
- **Sahlzamin** (cold-town-116): readiness 62 → 59, still Well-Defended. The townsfolk's will to fight now counts for no
  more than the fighters who carry it, so Invasion & War 62 → 54. The same rule lets its watch and court show more order
  (45 → 50). Its supply and magic each rise a point.
- **Dongguan, Fjordberg, Medinamela, Gerasdion, Chalmal:** unchanged on every rating.
- **Niederholz** (cold-under_siege-town-52): readiness 46 → 45. Its markets beside the market square now count as the
  smaller houses they are (supply 56 → 55).
- **Hongshan** (cold-thorp-191, 13 people): readiness 29 → 16, Lightly Defended → Vulnerable. Thirteen people cannot be
  strong against an army, so Invasion & War reads 13, Critical, where it read 77, Strong. Behind its palisade it still
  sees off a raid. That is no longer written as strength in war.

## 4. P5: "Monster Defense Critical" beside "effective for monster incursions" (item 4)

The beasts score's parts at DEF (6e61d042a) and at the tip, born at each (`parts2.mjs <rec> mon`):

| town | DEF | tip | what moved |
|---|---|---|---|
| r2r-hamlet-21 (95 people) | 41.3: charter 19.3, clergy 18, folk 4 | **19.4**: charter 15.4, folk 4 | C4a: "Access to parish church" is the walk to another's church (−18). C1: the charter hall is its ladder's least rung (35 → 28 before pay at 0.55). 19.4 prints 19, 0.6 under the Weak line at 20 |
| r2r-hamlet-6 (57) | 32.8: walls 12, militia 9.8, clergy 18, folk 8, plagued country −15 | 16.8: the clergy gone, the militia 11.8 (its greater rung) | C4a (−18) |
| r2r-town-38 (1,393) | 39: garrison 20, arcane 19 | 16: garrison 16 | C6: the alchemist shop is a trade, not casters (−19). C1: Barracks at 0.8 (−4) |

- **It is the scale as designed, not an artefact.** No limit bites (no hold touches beasts in these towns), and none of
  the candidates moves any of the three beasts scores.
- **What is not designed is the threshold.** In r2r-hamlet-21 the word "Critical" is 0.6 of a point from "Weak".
- **The side that should move is the line.** The score is true of the record: a hamlet with a half-paid bounty hall and
  no church of its own, a town whose only fighters against beasts are a barracks. The charter block's "effective for
  monster incursions" and "musters the defence" print whatever the town's beasts score, and so does "has answered it
  properly: there is a wall to hold and there are people to hold it".
- **Recommendation for the display seat:** each line prints only where Beasts & Monsters reads Weak or better, and is
  silent otherwise. Silence is not a false sentence. Not built here; the display findings are the builder seat's.

## 5. Every number and every word (item 5)

- **Added:** one row, `DEFENCE_TUNING.people = { milPerHead: 1 }`, with its reason row (P4), for the owner's veto. 2 is
  measured beside it.
- **Changed:** none. P2, P3 and X use only the table's existing rows and the structural 1 and 100. X9's hundredths are
  the structural 100.
- **Words:** none new. P2's readiness hold rides limit 1's line, and P4 rides the fullness line. P4's precise word is
  PARKED (above).
- **Read, not changed:** P3 reads the catalogue's tiers (`institutionalCatalog.js`) for the off-ladder places. X5 adds
  the keyword "monasteries" to three rows of the defence home (`divine`, `divineStrong`, `actualMagic`).

## What I did not measure (PLAUSIBLE or open)
- **The suite against any patch.** The pins of `tests/generators/defenceParts.test.js` and their kin will move, and the
  builder re-keys them by identity. The gates were not run on the patches.
- **The pages:** no line was read where it prints. A builder's cure carries the method; this is a measure.
- **The golden-freeze register's surfaces**, and the NPC, relationship and conflict re-draws that follow the 157 power
  re-draws (the reader's M7 shape). Count them when building.
- **Custom houses.** P3 keeps them at 1 (no catalogue tier).

## How every figure is re-made (`probes/UPKEEP-MEASURE-2/`, README there)
- **Trees:** `git worktree add --detach <scratch>/wt/<label> c56fd565e`, symlink `node_modules`, then `git apply
  patches/<label>.patch` (P2 + X = c2.patch then cx.patch; `call.patch` is ALL; `c4b.patch` is P4 at 2).
- **The red:** `TREE=<tree> node mono.mjs <recdir> all.seeds <out>` (the reader's). `sh run972.sh <label>` births the
  972 and runs `mono2.mjs`, and `python3 monosum2.py <ndjson>` tables it.
- **The moves:** `sh bornall.sh corpus.seeds corpus <labels>` births the 3,756. Its keys are corpus2.mjs's rows; one key
  matched corpus2.mjs's record hash. Then `python3 cmp.py <tip-dir> <cand-dir> <label> [own.seeds exclude]`, where
  `exclude` with own.seeds gives the census's 720.
- **The owner's example:** `TREE=<tree> node alch.mjs <recdir> all.seeds`.
- **P4's parts:** `milparts.mjs`. **P5:** `parts2.mjs <rec> mon` at the def and tip trees.
- **The causes:** `why3.mjs` and `dims.mjs`.
- **The holders:** `git rev-parse <lane>:<file>` grouped by blob, against `git log` of the integration line for the file.
