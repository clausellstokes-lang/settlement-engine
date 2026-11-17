# BIRTH-2-COUNT · a source house where the land gives nothing: kept at a share, with a stated cause · COUNTED, NOT BUILT

Seat BIRTH-AUDIT, the chair's follow-up of 2026-11-17 04:27 UTC (the owner: "usually not drawn; sometimes it stands, with
a stated cause: its ground is EXHAUSTED, or its material is BOUGHT IN"). Base cfc2b680a; branch
`lane/birth-audit-2026-11-17`; read-only (the prototype is `PROTOTYPE-BIRTH2.patch`, a superset of `PROTOTYPE.patch`:
203 lines in 7 files). Every share is counted ON TOP OF BIRTH-1 (R2 + R5 born together, as seated): "moved" below means
against the R2 + R5 births (`out/diffs.summary.json :: R25-*`), so it is BIRTH-2's own move. Births by
`probes/births-all.sh` with `BIRTH_RULE=R2,R5,K BIRTH_SHARE=<share> BIRTH_SITE=<site>` (`BIRTH_SHARE_BY=<id>:<share>,…`
for a share by kind). Every run was seen to end with `EXIT 0`. Probes (`probes/`): `b2kinds.mjs`, `b2towns.mjs`,
`b2lines.mjs`, `q4rules.mjs`, `q4roster.mjs`, `fieldDiff.mjs`. Outputs: `out2/`.

## 1 · THE KINDS ON NO GROUND OF THEIR OWN (`b2kinds.mjs`, base; `out2/b2kinds.txt`)

| kind | the 720: houses (towns) | main draw · cascade | tiers | the 150 | the 525 |
|---|---|---|---|---|---|
| charcoal burner | 75 (75) | 72 · 3 | metropolis 35, city 20, hamlet 12, town 6, village 2 | 18 | 0 |
| stone quarry | 57 (57) | 43 · 14 | metropolis 31, city 11, hamlet/village/town 5 each | 11 | 2 |
| salt works, off the coast | 40 (40) | 24 · 16 | spread over every tier | 6 | 2 |
| dairy farmer | 34 (34) | 22 · 12 | hamlet 22, village 12 (the catalogue has it nowhere else) | 8 | 0 |
| peat cutter | 16 (16) | 14 · 2 | hamlet 9, village 7 | 0 | 0 |
| mine · mine (open cast) | 7 · 3 | 10 · 0 | town, city, metropolis · hamlet | 0 · 2 | 0 |
| **in all** | **232 houses in 193 towns (26.8%)** | | | 45 in 36 (24%) | 4 in 4 (0.8%) |

ALSO OCCURRING, JUDGED NOT BARREN (each row's own gate puts it on its ground, though the record names no resource):
the fisher's landing 32 and the fishing community 15 (`tradeRouteRequired: port, river`: the water is there), the
woodcutter's camp 28 (`terrainRequired: forest`), the hunter's lodge 24 and the shepherd 22 (open or wild land, which
every hamlet has), the wildfowler 2. They are not marked, and nothing here gates or causes them. The owner can strike
any of these judgements. The salt works ON a coast (a port route or coastal terrain) is BIRTH-1's R5: the sea is its brine.

## 2 · THE CAUSE EACH KIND CAN BEAR (the chair's table, corrected where the catalogue says otherwise)

| kind | worked out | bought in | the catalogue's own line, and the correction |
|---|---|---|---|
| stone quarry | YES (the quarry ground spent) | no | "the only source of proper building stone the place has had": a quarry is its stone. As the chair's table. |
| mine, open-cast mine | YES (iron deposits spent) | no | "a shaft or excavation to extract iron ore, coal, or stone". As the chair's table (a mine also stands on stone: `kinds.mjs` now says so). |
| peat cutter | YES (the marsh spent) | no | "cuts and dries peat blocks from nearby marshland". Not in the chair's table; it is the quarry's case. |
| charcoal burner | YES (the woods cut over) | YES (wood carted in) | "operates kilns in nearby woodland". The chair's table stands, but "carted in" contradicts the line: burners went to the wood, the town bought the charcoal. See 6. |
| salt works off the coast | YES (the brine failed: the salt flats spent) | YES (bought-in salt refined) | "evaporates saline brine … whenever brine can be had". As the chair's table. |
| dairy farmer | **CORRECTION: YES (the grazing grazed out)** | only at a town or larger: **NEVER** (the dairy stands in hamlets and villages only; 0 of the 34) | "from cattle or goats, whenever livestock can be had". Under the chair's table as written, no dairy can bear a cause anywhere it stands, so share 1 would be impossible for it. The grazed-out pasture is within the two causes, so the counts below use it. |

Under this table a cause is chosen by the town's road. "Bought in" needs a connected road no siege shuts. Where both
causes are open, the seed's own hash picks one (`causeOf`). Everywhere else the house is "worked out".

## 3 · HOW THE RECORD CARRIES EACH CAUSE, WITH NO NEW FIELD

- **WORKED OUT** = the kind's ground written into `config.nearbyResources` AND `config.nearbyResourcesDepleted` (and their
  native sidecars `nearbyResourcesNative`, `nearbyResourcesNativeDepleted`), plus the shortage import the economy already
  writes for a spent ground, in its own words: "Dressed stone (local quarry depleted)", "Iron ore (local iron mines
  exhausted)", "Reeds, peat, and marsh herbs (local wetlands exhausted)", "Salt (local salt flats exhausted)", "Timber (local
  managed woodland cleared)", "Livestock and dairy (local grazing land depleted)" (`resourceSemantics.js ::
  resourceShortageImport`: every word exists). WHERE IT IS WRITTEN DECIDES WHAT MOVES. Measured at share 1, the 720 · the
  150 · the 525, against BIRTH-1:

  | site | towns moved | people · ties · names | what else is drawn again |
  |---|---|---|---|
  | after the roster is drawn, before the economy (`cascadePass`, BIRTH_SITE=draw) | 164 · 32 · 4 | **people 109 · 28 · 3**; ties 0 | the economy builds a chain on the new ground and the people re-draw (`economicState.activeChains` 29 of the 150) |
  | at the gaps' hour (`resourceGenerator.js :: generateResourceAnalysis`, BIRTH_SITE=gap) | 160 · 32 · 4 | 0 · 0 · 0 | **the history re-draws**: 14 of the 150 (the founding reason, tensions, events: `generateHistory` reads the resources later in the same step) |
  | **imports at the gaps' hour, the ground at the end of `steps/generateNarratives.js`, after the history (BIRTH_SITE=late)** | **160 · 32 · 4** | **0 · 0 · 0** | **nothing drawn moves**: imports 160 of the 720, the four resource lists 143, gaps 68, the coherence receipt 11, the arrival scene 4 |

  So the cause is written in two parts in one file: the import just before the resource analysis, the ground after the
  history (BIRTH-2's edit in `generateNarratives.js`; never `assembleSettlement.js`). Nothing drawn after that reads it.
  `resourceAnalysis.resourceConditions` and `.conditionNotes` (computed earlier) do not name the late ground, and nothing
  on the page prints them. The Resources tab's Depleted list prints `config.nearbyResourcesDepleted`
  (`ResourcesTab.jsx`, line 227).
  THE READER MUST READ IT: the late ground stands on no chain, so `housesOnSpentGround` (which reads the chains) cannot see
  it, and the quarry would answer its own stone (`LOCAL_PRODUCERS`). The prototype reads a source house whose own grounds
  on the record are every one spent as on a spent ground (`houseInputAtHand.js :: ownGroundSpent`, used by the reader and
  by `housesOnSpentGround`). That is BIRTH-1's R4 reading, defined by the kinds' grounds and the Depleted list, not the chains.
- **BOUGHT IN** = the import in the list's own words, written just before the resource analysis: "Salt" (exists: the
  crises' necessity word; the reader answers `desert_salt` by it), "Timber" (exists; the reader answers the burner's
  timber by it). The dairy's would be ONE NEW WORD, "Fodder and hay", and the reader would need to read fodder as the
  dairy's input. It is never needed, because no dairy stands at a town or larger. Cordwood and rock salt need no new word.

THE KEEP IS THE SEED'S OWN AND MOVES NO DRAW: `keepBarren(seed, id)` = FNV-1a 32 of `<seed>::birth-keep::<catalogue id>`
mod 60 < share × 60 (the kernel's own hash, as `resolveResources` keys its refills on `${rng.seed}::refill::…`). A kept
house is drawn at its chance as today. A removed one keeps its draw at chance 0, at both draw sites (`rowRoll`; the
cascade's `_rng()` at 0). The choice consumes nothing. What spreads is the roster: people are drawn by house.

## 4 · THE SHARES (counted over the 720 · the 150 · the 525; the cause written late)

| kept share | houses removed, the 720 (charcoal · quarry · salt · dairy · peat · mines) | kept | towns whose people · ties · roster move, the 720 · the 150 · the 525 | born-short left in calm connected towns, the 720 · the 150 | stored families moved, the 720 (top) |
|---|---|---|---|---|---|
| **0** (R3b, widened to mines and peat) | 235 (75 · 57 · 41 · 34 · 16 · 12) | 0 | **205 · 203 · 205** · 37 · 36 · 37 · **6 · 5 · 6** | 4 in 4 · 1 in 1 | trace 255, receipt 209, roster 205 and all drawn after it |
| **1/5** | 193 (65 · 44 · 30 · 29 · 15 · 10) | 41 (33 worked out, 8 bought in) | **178** · 177 · 178 · 29 · 28 · 29 · 6 · 5 · 6 | 5 in 5 · 1 in 1 | trace 220, receipt 183, roster 178 … |
| **1/3** | 160 (54 · 35 · 27 · 25 · 12 · 7) | 73 (55 worked out, 18 bought in) | **151** · 150 · 151 · 26 · 25 · 26 · 6 · 5 · 6 | 5 in 5 · 1 in 1 | trace 189, receipt 156, roster 151 … |
| **1** | 0 | 232 (165 worked out, 67 bought in) | **0 · 0 · 0** in all three | 6 in 6 · 2 in 2 | imports 160, resource lists 143, gaps 68, receipt 11, arrival 4 |

(The houses removed run slightly above the barren counts of 1 where a roster re-draw also takes a second house.) THE
SHARE BUYS LITTLE: the people re-drawn fall from 205 to 178 to 151 as the kept share rises. Only at share 1 do they stop.
Every born-short house left is the luxury goods quarter (4 · 1, BIRTH-1's word closes it), or, at share 1, a worked-out
salt works whose other chain (live river fish) keeps the chain-based spent reading from seeing it (r2r-town-2,
r2r-town-15; bar0-town-calm-rand-34). That mark is true, and the kinds-based reading of 3 counts it as spent. The 525
barely holds such houses (4), so every share moves 6 of the 525's people or none.

## 5 · THE CHEAPEST VARIANT, COUNTED APART: SHARE 1, A CAUSE FOR EVERY HOUSE, NO DRAW MOVED

No person, tie, name or house moves in the 720, the 150 or the 525 (above: BIRTH_SITE=late). What it leaves on the page
(`b2towns.mjs`, `b2lines.mjs` over the 720 at share 1):

| cause · kind | houses | marked short | the page's other lines |
|---|---|---|---|
| worked out · stone quarry | 57 | 57 ("Short of stone.") | the Depleted list names the quarry; "Dressed stone (local quarry depleted)" 57; NO gap line (the stored gap was never written); exports naming stone 2; "Stone Quarrying" 1; services "Cut stone; Rubble and aggregate" 57 |
| worked out · salt works | 18 | 18 | the shortage import 18; the stored gap line "No salt reaches the salt works." 18; a chain still running (the record's `entrepot` salt chain) 13; services "Salt production" 18 |
| bought in · salt works | 22 | 0 | "Salt" 22; its chain running 19 (`entrepot`, which agrees); services "Salt production" |
| worked out · mine, open-cast mine | 10 | 10 | the shortage import 10; services "Raw extraction" 10 |
| worked out · peat cutter | 16 | **1** | the shortage import 16, which FEEDS it (the cutter is not in `SPENT_GROUND_WORKERS`, so the import lifts its mark): false, an import feeds a buyer, never the work on the ground; services "Peat fuel supply" |
| worked out · charcoal burner | 30 | 5 | "Timber (local managed woodland cleared)" 30 feeds it, as above |
| bought in · charcoal burner | 45 | 6 (short of coal on another spent ground) | "Timber" 45; exports 3; its chain running 20 |
| worked out · dairy farmer | 34 | 0 | "Livestock and dairy (local grazing land depleted)" 34: a hamlet dairy fed by bought-in dairy |

**HOW MANY TOWNS: 193 of the 720 (26.8%), 65 of its 225 calm connected towns, and 69 of its 120 METROPOLISES (58%);
36 of the 150 (24%), 71 of the fresh 300 (24%), 4 of the 525.** One town in four is too many to read as the exception,
and in the metropolis it is the rule: more than half would hold a worked-out or bought-in source house. Mostly they are
the charcoal burners (35 metropolises) and the quarries (31).

## 6 · THE LINES THAT MUST AGREE, BY CAUSE

WORKED OUT (agrees today, by the record's own readers): the mark ("Short of stone.", `crisisStoppedRow.js ::
housesShortOfInput` through the spent-ground reading), the Depleted list (`ResourcesTab.jsx`), the shortage import
(`tradeListDisplay.js :: importsAsPrinted`), the card's description (past tense or hedged in every kept kind: "the only
source … the place has had", "whenever brine can be had"). WOULD BE FALSE: (a) the house's SERVICES ("Cut stone", "Salt
production", "Raw extraction", "Peat fuel supply": `availableServices`, written at the birth from the catalogue,
`institutionServices.js`): a worked-out house supplies nothing; (b) the stored gap line of a salt works, "No salt reaches
the salt works." (18), which says the salt is elsewhere: BIRTH-1's R4 line reads the spent ground (`validationOnPage.js`);
(c) the chain card of the salt works' stored `entrepot` chain, running (13: `chainStateShown.js`); (d) the exports and the
income share the economy wrote before the cause (2 + 1 quarries); (e) the peat cutter's and the charcoal burner's marks,
lifted by their own shortage import (15 + 25): the peat cutter belongs in `SPENT_GROUND_WORKERS` (`crisisDependence.js`).
BOUGHT IN (agrees): the Imports line ("Salt", "Timber"), no mark, the `entrepot` salt chain, the services. WOULD BE FALSE:
the charcoal burner's own line, "operates kilns in nearby woodland", beside "Timber" carted into a metropolis.

THE WORDS (the page's existing words first; the new lines are PROPOSALS FOR THE OWNER'S VETO):
- existing, worked out: "Short of stone." (the mark), the Depleted list's resource name, "Dressed stone (local quarry
  depleted)" and its kin; existing, bought in: "Salt", "Timber".
- NEW 1, the worked-out house's services, in place of its list: **"Worked out: the quarry yields no more."** (one template:
  "Worked out: the <ground> yields no more.": quarry, seam, salt pans, peat bog).
- NEW 2, the bought-in salt works' service line: **"Salt refined from salt brought in."**
- NEW 3 (BIRTH-1's R4 gap line, which a worked-out salt works needs): **"The salt works stands on spent salt pans."**
- Not needed under the recommendation: "Fodder and hay"; a wood-carted-in line for the charcoal burner.

## 7 · RECOMMENDATION

THE SHARE: **1 FOR THE KINDS WHOSE CAUSE READS TRUE, 0 FOR THE TWO WHOSE CAUSE READS FALSE**, measured (`BIRTH_SHARE=1
BIRTH_SHARE_BY=charcoal_burner:0,dairy_farmer:0`, `out2/q4.KM.json`, `out2/b2lines.KM.md`):

| kind | rule | the 720 |
|---|---|---|
| stone quarry, mine, open-cast mine, peat cutter | always kept, WORKED OUT | 57 + 10 + 14 kept, all worked out (2 peat cutters and 1 open-cast mine lost to a roster re-draw) |
| salt works off the coast | always kept: BOUGHT IN on a connected road (the seed picks between the two), else WORKED OUT | 22 bought in, 18 worked out |
| charcoal burner | NOT DRAWN where no wood stands (the draw kept) | 75 removed |
| dairy farmer | NOT DRAWN where no pasture stands (the draw kept) | 34 removed |

ITS PRICE: people, ties and roster move in **106 of the 720, 24 of the 150, NONE of the 525** (4 of the 525 move in
imports and resource lists only). That is half of share 0 (205), and the reference books barely move. Born-short left in
calm connected towns: 6 · 2 (the luxury quarter's 4 · 1, and the worked-out salt works the kinds reading counts as spent).
Towns then holding a kept source house: **111 of the 720 (15.4%), 40 of the 120 metropolises (most of them a worked-out
quarry), 18 of the 150 (12%)**. Stored families, the 720: gaps 125, receipt 118, imports 117, trace 109, roster 106 and
what is drawn after it.

THE SEATS (after BIRTH-1 lands; BIRTH-2's files are its own):
- **BIRTH-2a · THE DRAW** (re-draws people in 106 of the 720: THE OWNER'S, for the move): `src/generators/steps/assembleInstitutions.js`
  (`rowEnvironment` carries the seed; `rowRoll` gives a removed barren row the chance 0), `src/generators/cascadeGenerator.js`
  and `src/generators/steps/cascadePass.js` (the nearby resources and the seed handed in; the cascade's chance 0).
- **BIRTH-2b · THE CAUSE** (no draw moves): `src/generators/steps/generateNarratives.js` (the import before the resource
  analysis, the ground after the history, the seed passed as an argument, not through a global as the prototype does); a new
  import-free leaf `src/domain/facts/houseCauses.js` (the barren kinds, their grounds, the causes, `keepBarren`, `causeOf`);
  `src/data/crisisDependence.js` (`peat_cutter` into `SPENT_GROUND_WORKERS`). It needs BIRTH-1's R4 reading to be the
  kinds-and-Depleted-list one (`ownGroundSpent`). If BIRTH-1's R4 reads chains, the 99 worked-out houses go unmarked:
  the chair's word to BIRTH-1.
- **BIRTH-2c · THE KEEPER'S LINES** (a reading at print): the services of a worked-out house (NEW 1, NEW 2) where the page
  prints `availableServices` (`src/domain/display/` service rows: the file to be named by the seat, not measured here).
- THE GUARD: BIRTH-1's law with its exception defined by the kinds: "in a town with no crisis and a connected road, no
  house of kind (i) or (ii) is marked short unless its own ground is on the Depleted list". Counted exceptions here: the
  luxury quarter (4 · 1, closed by BIRTH-1's word).

WHAT SHOULD NOT BE DONE, WITH THE COUNT:
- **A share between 0 and 1** for every kind: 1/5 and 1/3 still re-draw people in 178 and 151 of the 720 and keep houses
  whose cause is false.
- **Writing the cause at the draw**: people re-draw in 109 of the 720 at share 1, with no house removed.
- **Writing the ground at the gaps' hour**: the history re-draws (14 of the 150).
- **Share 1 for every kind**: one town in four and 58% of metropolises hold a stated-cause house, 109 of them a charcoal burner (45 on carted wood) or a dairy (34, fed by bought-in dairy).
- **"Bought in" for the dairy as the chair's table writes it**: it never applies (no dairy at a town).

WHAT WOULD CHANGE MY MIND: if the owner reads a city charcoal burner on carted wood as true, share 1 for it costs nothing
in people (75 more towns hold the exception, 35 of them metropolises). If the owner will move no person at all, share 1
for every kind is the only such rule, and NEW 1 and NEW 2 then carry most of its truth.

---

## 8 · THE OWNER'S ADDENDUM: THE CAUSES ALIGN WITH THE IMPORTS (the chair, 04:30 and 04:33 UTC), RE-BORN AND COUNTED

THE RULE AS CORRECTED, and the prototype changed to it (`PROTOTYPE-BIRTH2.patch` regenerated; every figure in this section
is from the new births `*s-720/150/ref`, read by `probes/b2-all.sh` and `probes/b2align.mjs`; outputs `out2/b2s/`):
- A CAUSE IS OF ORDINARY TIMES. "Bought in" is open wherever the route is connected in ordinary times, **a siege
  included**. Only an ISOLATED route closes it, and there a kept house is "exhausted" or not drawn. BIRTH-1's own import
  (R2) is written under a siege too: its births were re-made as `R25s`, and every share here is counted against `R25s`.
- "EXHAUSTED" PAIRS WITH THE FINISHED GOOD NOW BROUGHT IN, ONLY WHERE A ROUTE IS OPEN; on an isolated route, no import.
- EVERY SOURCE HOUSE WORKS ITS OWN GROUND: an import never lifts its mark (the prototype reads the seven barren kinds as
  `SPENT_GROUND_WORKERS` do). Without this the peat cutter, the charcoal burner and the dairy were fed by their own
  ground's shortage import (c1 below: 44 towns of the 720 before the change; 38 at the base today).

### (b) THE PAIRS: kind · cause · route · the import line · the card's mark (the mixed rule of 7; share 1 for the two removed kinds)

| kind | cause | route | the line on `primaryImports` | the card's mark | the Imports heading | houses, the 720 |
|---|---|---|---|---|---|---|
| stone quarry | exhausted | connected | "Dressed stone (local quarry depleted)" | "Short of stone." | prints it | 52 |
| stone quarry | exhausted | besieged | the same, kept as ordinary trade | "Short of stone." | heading left out (trade stopped) | 3 |
| stone quarry | exhausted | isolated | none | "Short of stone." | prints nothing of it | 2 |
| mine, open-cast | exhausted | connected · besieged | "Iron ore (local iron mines exhausted)" | "Short of iron ore." | prints it · heading left out | 9 · 1 |
| peat cutter | exhausted | connected | "Reeds, peat, and marsh herbs (local wetlands exhausted)" | "Short of …" in 8; **no mark in 6** (see c1) | prints it | 14 |
| salt works | bought in | connected | "Salt" | none | prints it | 22 |
| salt works | **bought in** | **besieged** | "Salt", kept as ordinary trade | **"Curtailed by the siege."** (the leaf's own rule: an imported input under a siege) | heading left out (trade stopped) | 1 |
| salt works | exhausted | connected | "Salt (local salt flats exhausted)" | "Short of salt." | prints it | 17 |
| charcoal burner (share 1) | bought in | connected | "Timber" | none in 30; "Short of timber." in 15 (their own woods are spent, see c4) | prints it | 45 |
| charcoal burner (share 1) | exhausted | connected · besieged | "Charcoal and fuel" (an existing word of the list; the woods' own shortage import is timber, its raw material) | "Short of timber." | prints it · left out | 29 · 1 |
| dairy farmer (share 1) | exhausted | connected · besieged · isolated | "Livestock and dairy (local grazing land depleted)", none on the isolated route | "Short of livestock." | prints it · left out · nothing | 29 · 3 · 2 |

THE WORDS FOR "BOUGHT IN": salt is "Salt" (exists); cordwood is "Timber" (exists; the reader answers the burner's timber by
it); rock salt needs no word of its own ("Salt"); fodder has NO WORD, and it would be one new word, "Fodder and hay", but
never needed (no dairy stands at a town or larger). THE WORDS FOR "EXHAUSTED": every ground's shortage import exists; the
charcoal burner's finished good is "Charcoal and fuel" (exists, `UPSTREAM_IMPORT_LABELS.fuel`).

### (c) THE REVERSE, towns where it would be false after the rule (`b2align.mjs`; the 720 · the 150)

| share | c1 an import feeds a house the page calls exhausted | c2 an export or Produced-locally pill names its good | c3 "Needed, and not brought in" names a material the imports list names | kept houses in besieged towns |
|---|---|---|---|---|
| the base today | 38 · 0 (charcoal 27, mine 10, salt 3, shepherd 1) | 0 | 0 | — |
| the mixed rule before "every source house works its ground" (the first prototype) | 44 · — (charcoal 27, peat 13, salt 6) | 0 | 0 | — |
| 0 | 1 · 0 | 0 · 0 | 0 · 0 | 0 |
| 1/5 | 2 · 1 | 0 · 0 | 0 · 0 | 1 |
| 1/3 | 4 · 2 | 0 · 0 | 0 · 0 | 3 |
| 1 | 16 · 1 | 1 · 0 (a woodcutter's "Sacred wood") | 0 · 0 | 9 |
| **the mixed rule** | **7 · 0** | **0 · 0** | **0 · 0** | **5** (3 quarries, 1 mine: "Short of …"; 1 salt works bought in: "Curtailed by the siege.") |

WHAT IS LEFT IN c1, AND THE READER THAT MUST CHANGE: the peat cutters (6 at the mixed rule) stand on a chain of another
ground (the coal chain lists "Charcoal burner, Peat cutter"), and `houseInputAtHand.js :: housesOnSpentGround` judges a
house by EVERY chain it is listed on, so a live coal chain hides the spent marsh. The shepherd (1–10) is not a barren kind
here (its spent pasture is BIRTH-1's buyer reading). THE CHANGE: a kind (ii) house is judged by its own kind's grounds and
the Depleted list (`ownGroundSpent`), not by the chains it is listed on: BIRTH-1's R4 reading, as said in 3. The same
reading counts as spent the houses the chain reading misses in the target. The born-short houses left in calm connected
towns at the mixed rule: 9 in 8 of the 720 = the luxury quarter 4 (BIRTH-1's word), the 2 worked-out salt works of 4,
and 3 charcoal burners on their own spent woods (r2r-city-22, r2r-metropolis-17): all true marks, the kinds reading's
exceptions. c2 and c3 hold by construction. The Produced-locally and Exports pills print a made good only where a chain
works it (`tradeListDisplay.js :: pillBorneOut`), and the need line is computed against the record's whole imports list,
not the printed heading (`importsAsPrinted`). So the owner's point holds under a siege too: "Needed, and not brought in"
never names a material the list names (0 towns in every share and at the base).

c4, A PAIR TO RULE ON (the charcoal burner only): with every source house working its ground, a burner on its own spent
woods is "Short of timber." beside the woods' own shortage import "Timber (local managed woodland cleared)". That is the
quarry's form, but the import is the burner's RAW material, not its finished good: 35 burners in the 720 at the mixed
rule (BIRTH-1 alone prints them unmarked, fed). Either the owner reads it as true (the town buys timber for its carpenters,
and the burner's work in the wood is over), or the burner is not a ground worker and these 35 read "bought in".

### (d) UNDER A SIEGE

A kept "bought in" house keeps its cause and its import. The card prints **"Curtailed by the siege."** (the leaf's
`housesOnImportedInput`: the stored gap is `imported`, since BIRTH-1's import is written under the siege too); it is never
short with no cause, never re-read as exhausted, never removed. TODAY'S PAGE PRINTS NO "cut off" LINE: where a siege stops
trade, the Economics tab leaves its Imports heading out (`tradeListDisplay.js :: tradeListsAsPrinted`, `tradeStopped`,
`chainStateShown.js :: tradeStoppedHere`), while the need line still reads the whole list, so it does not name the cut
import. If the owner wants the import to READ cut off, that is one new line for the owner's veto, at that heading:
**"Imports: cut off by the siege (in ordinary times: Salt, …)."**

### THE SHARES AGAIN, UNDER THE CORRECTED RULE (against R25s; the 720 · the 150 · the 525)

| share | houses removed, the 720 | people · ties · roster move | born-short left in calm connected towns | marks, the 720 (base 2,066; BIRTH-1 alone 652) |
|---|---|---|---|---|
| 0 | 235 | 205 · 203 · 205 · 37 · 36 · 37 · 6 · 5 · 6 | 7 in 6 · 2 in 2 | 564 |
| 1/5 | 193 | 178 · 177 · 178 · 29 · 28 · 29 · 6 · 5 · 6 | 9 in 8 · 3 in 3 | 597 |
| 1/3 | 160 | 151 · 150 · 151 · 26 · 25 · 26 · 6 · 5 · 6 | 11 in 10 · 3 in 3 | 621 |
| 1 | 0 | 0 in all | 17 in 16 · 5 in 5 | 730 |
| **mixed** | 112 (charcoal 75, dairy 34, 3 by re-draw) | **106 · 105 · 106 · 24 · 23 · 24 · 0 · 0 · 0** | 9 in 8 · 3 in 3 (all true marks; above) | 652 |

The people moved are unchanged by the correction (the cause takes no draw). THE RECOMMENDATION OF 7 STANDS, with the reader
change of (c) folded into BIRTH-1's R4 and the charcoal burner's pair (c4) put to the owner. Under the mixed rule, 111 of
the 720 and 44 of the fresh 300 (14.7%) hold a kept source house.

---

## V · THE HOUSE STIPULATES ITS GROUND (the owner's question, the chair 04:58 UTC), PROTOTYPED AND COUNTED

V1, THE RULE AS BUILT: where a source house of the seven barren kinds stands on none of its grounds, its kind's ground is
written onto `config.nearbyResources` and `nearbyResourcesNative` AS AVAILABLE (not spent), if the terrain admits it
(`resourceTerrainCompatibility.js :: getCompatibleResources`). No house is removed, no cause is invented, and "worked out"
stays only where the record's own depletion roll spent the ground. It is on top of BIRTH-1 (R2 + R5) and counted against
`R25s`. Prototype: `birthKinds.js :: birthWriteGround`, `BIRTH_RULE=R2,R5,V BIRTH_VSITE=early|late`, in
`PROTOTYPE-BIRTH2.patch`. Births `VE-*`, `VL-*`, all `EXIT 0`.

V2, WHERE IT IS WRITTEN (the 720 · the 150 · the 525):

| site | towns moved | people · ties · names · roster | what the record then says |
|---|---|---|---|
| (a) EARLY, after the roster, before the economy (`cascadePass`) | 116 · 23 · 2 | **people 98 · 20 · 2**; ties, names, roster 0 | the economy builds on it: `activeChains` 109, the made list 110, **exports 97**, `resourceChains` 87, gaps 106 of the 720 |
| (b) LATE, after the history (`generateNarratives` end) | 114 · 23 · 2 | **0 · 0 · 0 · 0** | `config.nearbyResources(+Native)` 114, the coherence receipt 114, the arrival scene 2; nothing else |

THE PAGE AT (b): the Resources tab's "Nearby Resources" section prints every key of `config.nearbyResources`
(`ResourcesTab.jsx`, lines 224–226), so the new ground prints there as a resource of the town. Its "Resource Exploitation"
cards read `resourceAnalysis.exploitation`, computed before the late write, so no card is printed. The house's card and
mark: none (the reader already answered the house by itself; now its ground agrees). No chain card, no export, no made
pill, no income share. WHAT AGREES: the house and the land. WHAT IS SILENT: the working of the ground (no exploitation card
beside a quarry at work). WHAT WOULD BE FALSE: nothing was found in the record's lines (c2 and c3 of 8 hold: no pill or
export names a good that is not made). At (a) the economy turns one small quarry into a chain, an export (97 towns) and a
made good: THE PRESUMPTION THE CHAIR FEARED, "known for its stone" from one quarry, and people move.

V3, BY KIND, AND THE HOUSES THE TERRAIN DENIES (the ground each takes: quarry `stone_quarry`; mine and open-cast mine
`iron_deposits`; peat cutter `marshlands`; salt works off the coast `salt_flats`, since the record has no brine spring (no
ground of `RESOURCE_DATA` is a spring with salt; `hot_springs` holds none); dairy `grazing_land`; charcoal burner
`managed_forest`). DENIED by the terrain's own compatibility, the 720 + 150 + 525 together (`VDENIED` in the VL births'
logs): **salt works 46** (salt flats belong to few terrains: nearly every river salt works), charcoal burner 30, stone
quarry 13, dairy farmer 11, mine 7 + open-cast 5, peat cutter 6. These are the houses this rule cannot keep: they stay
marked short.

V4, WHAT IT LEAVES (late): born-short houses in calm connected towns **16 in 16 of the 720, 4 in 4 of the 150** (the
denied kinds above, and the luxury quarter's 4 · 1); marks 2,066 → 559 (BIRTH-1 alone 652); towns changed 114 · 23 · 2;
the 525: 2 (resource lists and receipt only). NO NEW LINE PRESUMES MORE THAN THE HOUSE PROVES at the late site (no chain,
export or made good is written); at the early site, 97 exports do.

V5, MY VIEW:
1. The late stipulation is the cheapest truthful rule there is: no draw, no person and 2 of the 525 move, and the house
   proves its ground. I would take it for the quarry, the mines, the peat cutter, the dairy and the charcoal burner
   wherever the terrain admits the ground.
2. The mix: stipulate late where the terrain admits; where it denies (salt works 46, charcoal 30, quarry 13, dairy 11,
   mines 12, peat 6, the three populations together), use the by-kind rule of 7 (kept with a stated cause, or not drawn).
   The salt works off the coast is mostly that denied case.
3. I would NOT write the ground early: the economy then builds chains and exports on one house (97 towns) and people move
   in 98 of the 720. Nor would I stipulate a ground the terrain forbids.
   Left for the owner: the exploitation card the late ground lacks. Either the Resources tab reads the ground's working
   from the house, or the ground prints as a nearby resource only, as now.

---

## W · THE ROUND TRIP, THE DENIED GROUNDS, THE WORKING OF THE GROUND (the chair, 05:15 UTC)

**W1 · THE SAVED TOWN'S ROUND TRIP** (`probes/w1roundtrip.mjs`; `out2/w/w1.VL.txt`, control `out2/w/w1.R25s.txt`). Ten towns of
the 720 that V-late changes, generated again from the produced record, under the same rule, in three forms:

| form fed back | V-late | the control (the same ten without V) |
|---|---|---|
| (a) `record.config` with `record._seed`: **the product's regenerate** (`store/settlementRegenAction.js`: `const cfg = settlement.config \|\| config`) | 0 of 10 identical; every one differs only in `config`, `_config`, `simulationTrace`, the receipt (and `stress`/`stressors` in 4) | **the same families, the same towns**: the round trip's own drift, not V's |
| (b) `record._config` (the kept input) | **10 of 10 SAME** | 10 of 10 SAME |
| (c) `record.config` with `nearbyResourcesRandom: false` (the stored roster read as the DM's word, as the wizard's manual roster reads it) | **10 of 10 differ in substance**: the economy (10), people (5), history (2), culture, defence, and the ROSTER of r2r-hamlet-48 | bookkeeping only |

So the late write is stable under the product's regenerate and under a seed replay. In random mode, `resolveResources`
ignores a stored roster that carries its native sidecar (the sidecar marks the generator's own answer). It is NOT stable
where the stored list becomes input: there the stipulated ground acts EARLY (chains, exports, people). The panel's switch
(`ConfigurationPanel.jsx`, `toggleRandom`) does not feed the stored list back: it writes every compatible key. Only a
person keeping the stored list as a manual roster, or an import that strips the sidecar, would.
WHAT I WOULD BUILD: **(i) NOTHING STORED, ONE IMPORT-FREE READING**: "the town's grounds as the page reads them = the
stored list plus the ground each source house of the seven kinds implies". It is stable by construction, needs no new
field, and nothing generation reads changes. ITS READERS ON THE PAGE: the Resources tab's Nearby Resources
(`ResourcesTab.jsx`, lines 224–240); the facts that read the land list (`facts/registeredWords.js`,
`facts/leadingSourceSpent.js`, `facts/chainCarrier.js`, `facts/houseInputAtHand.js :: availableNativeResourceKeys`'s
callers); `display/tracePresentation.js`; `display/tradeListDisplay.js`. 41 page-side files name `nearbyResources`.
WHAT (i) LEAVES UNSAID: every other reader of the stored list. The six ground keys are named page-side in 73 lines of 30
files (`stone_quarry` 16 lines in 7 files, `iron_deposits` 20 in 5, `grazing_land` 15 in 8, `managed_forest` 16 in 4,
`marshlands` 4 in 4, `salt_flats` 2 in 2; outside `src/generators`): a line declared on those keys would not see the
implied ground unless it reads the one reading. (ii) A stored form generation provably ignores exists today (the sidecar
in random mode), but the manual roster breaks it, so I would not rely on it.

**W2 · THE HOUSE WINS WHERE THE ROLL TABLE DENIES** (`BIRTH_VFORCE=1`; births `VLF-*`, `EXIT 0`; `probes/w2denied.mjs`,
`out2/w/w2.*.txt`). Towns changed against BIRTH-1: **193 of the 720, 36 of the 150; people, ties, names, roster 0**; only
the two resource lists move. Born-short left in calm connected towns: **4 · 1 (the luxury quarter only)**. THE DENIED GROUNDS
WRITTEN, the 720 (the 150): salt works on salt flats 39 (5), charcoal burner on managed woodland 24 (6), stone quarry 12
(1), mine on iron deposits 10 (1), dairy on grazing land 9 (2), peat cutter on marshlands 6. THE PAGE prints each under the
Nearby Resources section's **"Abundant"** label (unlabelled under a siege), by `RESOURCE_DISPLAY_LABELS`: r2r-hamlet-2 (road,
mountain) and r2r-hamlet-18 (river, riverside) "Salt Flats"; r2r-hamlet-3 (port, coastal) "Iron Ore Deposits";
r2r-hamlet-15 (crossroads, plains) "Marshlands"; r2r-hamlet-19 (port, coastal) "Open Grazing Land"; r2r-village-45 (port,
coastal) "Stone quarry"; r2r-city-10 (crossroads, plains) "Managed Woodland". OBJECTIONS: 0 stored ("is not compatible
with", which `coherence/readerBattery.js` reads), because the validator ran before the late write. No reader of the page
re-checks compatibility. THE WORD THAT PRESUMES: "Abundant". One quarry does not prove plenty, at the admitted grounds as
at the denied ones: a stipulated ground should print without "Abundant" (a word for the owner's veto: under the section's
title alone, as the siege form already prints it). THE SALT WORKS APART: all 39 off-coast denied salt works stand on a
connected route, and none on an isolated one. The existing "Salt" import carries every one ("bought in", §8: no mark,
"Curtailed by the siege." under a siege). "Salt Flats, Abundant" in a mountain or riverside hamlet reads FALSE, while
"Imports: Salt" beside a salt works that refines it reads TRUE. So: bought in for the salt works off the coast; on an
isolated route, nothing is left (0 here).

**W3 · THE WORKING OF THE GROUND.** The Resources tab's exploitation cards read `resourceAnalysis.exploitation`, written
before the late ground. THE SMALLEST READING: in the tab's stage reader (`ResourcesTab.jsx`, the `shown` lists, line ~159,
through the one reader of "worked here", `facts/chainWorking.js :: chainWorksResource`), a ground the house implies is
worked by the chain `RESOURCE_CHAINS` names that house in: stone (Stone quarry, Stonemasons' guild), livestock (Butcher,
Tannery, Dairy farmer), mountainTimber (Sawmill, Carpenters' guild, Charcoal burner; the written ground is managed
woodland, whose own chain `timber` does not name the burner: a mismatch to settle), desertSalt (Salt works). The mines and
the peat cutter are named by no chain, so no card. TOWNS GAINING A CARD at V-late, the 720: up to 114 (grounds written:
managed woodland 51, stone 45, grazing 25, marsh 10 with no card, salt flats 1). THE CARD'S FIELDS (`rawResource`,
`processingInstitutions`, `intermediateGoods`, `finalProducts`, `exportValue`, `dependsOn`): `finalProducts` ("cut stone",
"stone blocks"; "meat, hides, dairy"; "lumber, planks, charcoal") and **`exportValue` presume more than one house proves**.
A lone quarry is a "partial" stage at most ("no stonemasons' guild finishes it"). Print the card with the house's own
stage and services only, never the export value.

**MY VIEW (W):** build (i), the reading, not a stored ground. Let the house win everywhere except the salt works off the
coast, which is bought in ("Salt"). Drop "Abundant" for a stipulated ground. Print its card without `exportValue`.
