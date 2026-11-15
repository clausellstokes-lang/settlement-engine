# TAIL-CORPUS-ECO · hand-back (kept current after every batch) · TAIL-CORPUS-ECO-2 (the successor) keeps it from batch 3

Tip: the commit carrying this file. Rows: 148 · cured 64 (40 by TAIL-CORPUS-ECO, 24 by batch 3) · struck 24 (20 + 4) · parked 5
(C6) · named for the record 3 (batch 3) · left 52 (the predecessor's 83 less batch 3's 31).

Seat: TAIL-CORPUS-ECO, builder. Branch `lane/tail-corpus-eco-2026-11-14`, cut from the joined line `lane/join-2026-11-14`
at **48fedbe98** (read back from origin at the start). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-CORPUS-ECO.{md,json}`
on the chair's lane (148 rows, HIGH 6, read at e5b421802). Files: `src/data/dossierStateProse/economy.generated.js`,
`general.generated.js` (GENERATED: edited in their source `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the DS-ECO, DS-GEN,
DS-SUP sections only) and tests.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- (C1) YOUR POOLS: ids beginning DS-ECO, DS-GEN, DS-SUP. A line is cured by a declaration or by rewording in the SOURCE
  document, never by striking a middle row; the leaves are rebuilt through the corpus's own door
  (`node scripts/generate-dossier-state-prose.mjs`; its `--check` must pass before you push; if it refuses for a stale wiring
  census, that register is re-taken through its own door, `node scripts/wiring-census.mjs`, in its own commit).
- (C2) MEASURE BY REPLAY, as the lane's seats did: the probes under docs/chair/2026-11-14/probes/W2-WRITE-13/ on the joined
  line: a declaration needs no second render: every pool re-drawn from the render's own eligible lists, per variant before
  and after, the inheritors read. One census run at your base gives the lists.
- (C3) NO CEILING IS RAISED, AND A FALSE LINE IS NOT PARKED BEHIND ONE: a state a declaration would leave MUTE takes A TWIN
  TRUE IN THAT STATE. Land POOL BY POOL. (The seat before: "what is left" of W2-WRITE-SIDE-HANDBACK-14 read: its batch is
  landed whole; its bar rows #168 PROSPEROUS "halls", #275 entrepot, are in this worklist and taken here.)
- (C4) CORPUS-DEF edits the same source in ITS sections: no section of DS-DEF, DS-POW, DS-FTH or DS-CND is touched.
- (C6, the chair, 2026-11-14 23:57, on batch 1's park) INCOME WEIGHT magic: NO ATOM for "a practitioner on the rolls"; a town
  whose income leans on magic and holds no practitioner is THE RECORD'S FAULT (measured as a class by RECORD-MEASURE-2). Reword
  only if a wording claiming the income and not a practitioner stays good in all 54; else LEAVE THE FIVE PARKED with their
  measure and seeds. THIS SEAT: no such wording holds (the five's own income is farm rents at 100% and the page says "nothing it
  lives by would stop without it"; even the cities' magic income is 3-6%, so "a large part of its business" is the pool key's
  claim, `compound.magicInfluence` ≥ 60, not the income's): LEFT PARKED, the five seeds below.
- THE CHAIR'S RULINGS SINCE (2026-11-14 23:58 to 2026-11-15 00:30 UTC, handed to TAIL-CORPUS-ECO-2; each vetoable by the owner):
  (C6, restated) NO ATOM for "a practitioner on the rolls": a town whose income leans on magic with no practitioner is the
  record's own fault (measured by another seat: 3 towns, beside a teleport circle: designed): the five parked rows stay parked
  with their seeds; 54 towns are not gated for 5.
  (C7) THE POWERS' FAMILY OF ATOMS IS NAMED AND CLOSED FOR NOW: `shared power` (on this branch), `ruling body` (the ties seat's
  branch) and `rival power` (the crisis seat's branch; true of the SETTLED record only). A line that needs one of the two this
  branch does not hold is PARKED with its measure until the chair names a tip of the joined line that holds it (then
  origin/lane/join-2026-11-14 may be merged at THAT tip: the only merge allowed). A fourth atom is asked of the chair with every
  line that would use it and their measures; "a chain's input reaches its house" was REFUSED three times (the record's own chain
  state: lines that presume present work on an input take a rewording that claims the trade, in one short hedge form:
  "whenever clay can be had").
  (C8) A CLASS BEING MEASURED, not this seat's to move: prose written before its facts are final (a line true when drawn and
  false because the record moved afterwards): a row found to be that is NAMED with that reason.
  (X9) THE EXPORTS' READ found no row of these pools that only the PDF and the journal print: nothing to take.
  (C11, 2026-11-15 01:01) The joined line at eeaa06816 holds `ruling body` and `rival power`: merge it at THAT tip only when a
  parked row needs one. THIS SEAT: no row of these pools is parked on either (the five parked rows are C6's): NOT MERGED.
  (C12, 2026-11-15 01:12) THE SIEGE'S SEA EXCEPTION: the record holds the sea open to one besieged port (r2s-under_siege-city-0, food
  by ship); DS-ECO-1 C4 v4 and DS-ECO-9 IMPORT-DEPENDENT v5 are reworded to claim what every siege bears (the roads closed, nothing
  by road): text only, no pool moved, no atom. Taken as batch 4.
- BRIEF-TAIL whole: a flag is a candidate, verified by the record; batches; silence is true but a silence of TRUE lines in
  more than twenty towns is told first; a state left mute takes a twin; a draw is not moved outside the row's pool; under a
  siege nothing comes in or goes out; under a famine no line offers the food that failed; no new vocabulary word; every new or
  reworded line listed for the veto with three towns.

## The instruments (how they are re-made)

- The census: CENSUS-3 `census3.sh` copied to `census3d.sh` with ONE change: the render (`render.census3d.jsx`) also writes, per
  town, `<seed>.draws.json` (the kernel's `drawVariant` wrapped: per pool, the eligible vids and the drawn vid, W2-WRITE-5's
  `render.w5.jsx` mock verbatim) and `records/<seed>.json` (the born record), so the replay has its lists. Same 720 seeds,
  same configuration, same dumps (the inventory reads `dumps/*.txt` only). ~50 minutes at 4 workers here.
- `inventory.py` / `inventory_diff.py` (READ-ALL) on the census out-dirs.
- The replay: W2-WRITE-13 `replay.mjs` + the side seat's change (a NEW vid is eligible where its pool was reached and its
  declaration admits; `node replay.mjs <tree> <render> x <baseTree>`), `moved.mjs`.
- TAIL-CORPUS-ECO-2 re-made them from the probes' own lanes: `census3d.sh` = CENSUS-3 `census3.sh` with RJ defaulting to
  `render.census3d.jsx` and the dump count reading `*.txt` only (the draws files sit beside them); `render.census3d.jsx` =
  `render.census3.jsx` plus W2-WRITE-5 `render.w5.jsx`'s `drawVariant` mock verbatim, `mocks.rec` reset per town, and
  `records/<seed>.json` (the town as rendered) written per town. ~21 minutes here at 4 workers. `replay.mjs` takes the side seat's
  change as a fourth argument (`<baseTree>`: a vid absent from the base's pool is eligible where its declaration admits). `q.mjs`
  (this seat, `<run> <tree> <block::key> <vids|*> [js expr over (r, f, e)]`): every town where the pool drew those vids, with tier,
  rung, food band and ledger, route, market, trade counts, crisis kinds and the expression: the measure's one query.
- `facts.mjs` (this seat): one compact row of facts a town (`factsOf` + the economy fields the rows name) over
  `corpus.ndjson.gz`; `rows.py`: each worklist row's printing towns (the before inventory) with the named facts.

## Batches

THE BEFORE RUN at 48fedbe98 (the 720, census3d): 29,876 distinct sentences. Of the 148 rows, 12 are GONE AT THE BASE (all
DS-GEN-16, LIVING-MEMORY / LEGACY-*: the joined line prints those lines in their template form now, the reader's folds no longer
print) and 3 no longer print in the town they were read in (DS-GEN-13 MARKET-OPEN v3 23470: plague-cured at the base, 71 towns
left; WAREHOUSES v2 02808 02809: siege-cured at the base). The replay reproduces the render's draws (probe mode: 49,112
single draws, 0 misses).

### Batch 1 · DS-ECO-12 (the income mix, the critical imports) · REWORDED, no draw moved

Nine lines reworded to claim no more than every printing town bears (vid unchanged, so no draw moves: the measure is the
record's count of printing towns where the old claim is false; the after census reads the inventory):

| row(s) | line | prints | false by the record | the cure |
|---|---|---|---|---|
| B13238 | INCOME MIX one source v1 "comes from a single trade" | 170 | 20 with no exports and no imports (the one source is `Agricultural Rents` in every town but one) | "a single source" |
| B03337 | INCOME MIX one source v2 "depends on one trade" | 158 | 13 (as above) | "one source of income, whether or not they earn from it directly" |
| 18271 | INCOME MIX criminal present v2 "honest traders compete against it" | 119 | 23 with no market | "the people who earn theirs honestly do not know who is making it" |
| 01193 | INCOME MIX broad spread v1 "none of them brings in a real portion" | 15 | 14 with a leader at 15-19% (a real portion = ≥15, DS-ECO-6's own scale) | "lives on many trades, and no one of them carries the town" |
| 20338 20336 20354 20341 20334 20335 | CRITICAL IMPORT land v1 "the country produces no {good}" | 18/15/11/10/3/1 | 7/9/7/5/3/1 (the good made or listed here: luxury, gems, timber, grain) | "does not give the town enough {good}, so the town buys in what it needs" |
| 14987 | CRITICAL IMPORT land v2 "None of the {good} ... comes from the country here" | 3 | 3 | "Not enough of the {good} ... ; the town brings in the rest" |
| 20355 | CRITICAL IMPORT land v3 "produces no {good}" (no imports) | 2 | 2 | "does not give the town enough {good}, so the town must look elsewhere for the rest" |
| 18237 18245 18246 18231 18224 | CRITICAL IMPORT house v1 "the country ... produces none" | 15/6/2/1/1 | 15/6/2/1/1 (grain grown; dairy, grazing; a fisher's landing; hides) | "does not give enough of it" |
| 28786 | CRITICAL IMPORT house v2 "Whatever {good} ... must come from elsewhere" | 8 | 8 (dairy farmer, grazing) | "A good part of the {good}" (not "Much of": the slot takes plural goods, "grapes") |

Rows cured: 18 (B13238 B03337 18271 01193 20338 20336 20354 20341 20334 20335 14987 20355 18237 18245 18246 18231 18224 28786).
PARKED, a word the vocabulary lacks (told to the chair): INCOME WEIGHT the practice of magic v1 v2 (B12119 28731 28726 28745
21275): the line says practitioners carry a large part of the town's business; the pool's key is `compound.magicInfluence` ≥ 60
and the `magic` atom (magic functions) holds in every printing town, but in 5 of the 54 towns that print the pool the page itself
says "No arcane practitioners on the rolls" (r2r-town-29, r2r-village-2, r2s-indebted-hamlet-0, r2s-indebted-village-0,
r2s-recently_betrayed-thorp-3): the fact needed is "a practitioner is on the rolls", which no atom answers (a tier cut would
silence a true village, r2s-insurgency-village-2, and leave r2r-town-29 false).
GUARD: `tests/domain/corpusEcoTailGuards.test.js` (new, the batch's ONE collected test): 9 GONE rows (each red at the base for
the right reason: the old wording drawn) and 9 KEEP rows (the same vid still drawn in another town, its unchanged stem: green
before and after); the plant (v1 broad spread's old text put back in the leaf, not committed) reds its row.
Doors: generator --check 0; presumed --check fresh 147 = the base's 147; the grid 2 falls = the base's 2 (r2r-city-0,
r2s-insurgency-metropolis-0 P7a); strict-domain 0, the type ratchet 0, eslint 0 on the touched files; the 57 test files that name
the corpus leaves: the base's 38 reds (16 files) exactly, carried from the joined line, none new; the batch's 18 green.

### Batch 2 · DS-GEN-13/17/18 and DS-ECO-6/8/9/10 · DECLARED (measured by replay) and REWORDED

MEASURED BY REPLAY (every pool re-drawn from the base render's own eligible lists; probe 49,112 single draws, 0 misses): nine
pools moved and NO OTHER POOL MOVED. Per pool, before -> after, and the moves (`moved.mjs` prints vid 0, a pool's canonical row,
as "silent": DS-ECO-6's "v5->silent" below is v5 -> v0, read):

| row(s) | pool · line | cure | false by the record (of printing) | replay before -> after · moves |
|---|---|---|---|---|
| 12197 12196 | DS-GEN-13 WAREHOUSES v3 "fill after the harvest" | + `no crisis: famine` | 2 of 32, 1 of 29 (a famine) | v3 69 -> 65: -> v1 1, v2 1, v4 2 (all famine towns) |
| 21023 | DS-GEN-17 ADMINISTERED v1 "keeps its own court and its own gaol" | + `no crisis: occupied` (the pool stays `{colour}`; v2 v3 speak there) | 2 of 44 (an occupation) | v1 74 -> 71: -> v3 2, v2 1 |
| 20129 | DS-ECO-8 COMFORTABLE v3 "the stores are more than the season needs" | + `food: ≥ secure` | 1 of 41 | v3 41 -> 40: -> v2 1 |
| 20457 | DS-ECO-6 significant off-book v5 "the trade that plainly goes on there" | + `no crisis: under_siege` | 2 of 20 (a siege) | v5 20 -> 18: -> v4 1, v0 1 |
| 22618 04637 02818 20138 22545 | DS-ECO-10 POSTURE established v2-v6 (goods going out, outside buyers, carts) | + `no crisis: plague_onset` (v1 "sells more than one thing beyond the town" speaks there) | 5+5+4+4+1 of 92/89/79/79/52 (a plague: "travel is discouraged, and some goods stop arriving") | v1 79 -> 98: 19 plague towns from v2-v6 |
| 00639 22223 | DS-ECO-9 HOW THE NEED much brought in v2 "the rest comes in from the farms ... and from trade" | + `no crisis: famine` | 4 of 69, 1 of 1 (a famine, the deficit uncovered) | v2 72 -> 65: -> v3 4, v1 3 |
| 09715 09716 | DS-ECO-10 POSTURE entrepot v3 "Goods come, goods go" | + `no crisis: plague_onset` | 1 of 12, 1 of 7 | v3 43 -> 41: -> v1 1, v2 1 |
| 17631 | DS-ECO-8 STRUGGLING v6 "Sellers ... give credit" | `colour` -> `market` | 18 of 26 (no market) | v6 26 -> 8: -> v1 5, v2 5, v7 4, v5 2, v4 2 |
| 21997 | DS-ECO-8 STRUGGLING v3 "the shortage shows in small things" | + `no crisis: hunger` (the FACT atom: a `no hunger` MARK would partition the pool by a dimension the desk does not hand, and fail it closed) | 6 of 9 (a famine) | v3 9 -> 3: -> v1 v2 v4 v5 v7 |
| 14619 | DS-GEN-13 NO-MARKET v3 "done house to house and on the road" | REWORDED "done house to house" (+ `no market`, the word it denies) | 16 of 113 isolated | unmoved |
| 14079 | DS-GEN-18 BOUGHT-IN v9 "Much of what changes hands ... came from somewhere else" | REWORDED "Some of" | 59 of 98 with two imports or fewer | unmoved |
| 00473 | DS-GEN-13 MARKET-NARROW v2 "buys mostly what it makes itself" | REWORDED (+ `market`) | 6 of 7 with three imports or more | unmoved |
| 14605 | DS-GEN-13 COMMERCE a market, no guild v2 "No guild runs X's market" | REWORDED "No guild keeps a house at" (the key: no guild house; a guild POWER may stand) (+ `market`) | 9 of 13 (a guild power) | unmoved |
| 23392 | DS-ECO-10 POSTURE entrepot v2 "Very little of what leaves began here" | REWORDED | 13 of 48 (no transit good, no entrepot income: ports; `deriveIsEntrepot` NAMED, the bar's #275) | unmoved |
| 00755 (HIGH) | DS-ECO-8 PROSPEROUS v1 "spends it on its halls and its defences" | REWORDED (no hall atom; 2 of 32 with no defence at all) | 2 of 32 | unmoved |

Rows cured: 22 (12197 12196 21023 20129 20457 22618 04637 02818 20138 22545 00639 22223 09715 09716 17631 21997 14619 14079 00473
14605 23392 00755). THE INHERITORS READ (the replay's moves, each line where it lands): ESTABLISHED v1 "X sells more than one thing
beyond the town." in the 19 plague towns (their exports stand; the plague discourages travel, it does not empty the column);
WAREHOUSES v1 v2 v4 in four famine towns (storing and renting space: true of a famine town's warehouses); ADMINISTERED v2 "visibly
governed: a hall of justice, a gaol, and officers to staff them" and v3 "the law keeps a building of its own" under an occupation
(the buildings stand, whoever staffs them); COMFORTABLE v2 "People here put things by, and can."; DS-ECO-6 v4 "Goods change hands
... without anyone writing them down" and v0 "A good part of the trade here goes unrecorded, and merchants who pay their duties and
guild fees are undersold" inside a besieged city and town (the town's own trade goes on inside the line); HOW THE NEED v1 "Food carts
come into X most days ... a good part of what the town eats is grown elsewhere and brought in" and v3 "A good part of what X eats is
brought in, and everyone knows when the next load is due" in famine towns whose imports carry grain (PLAUSIBLE: neither says the
need is met); ENTREPOT v1 v2 in two plague towns (v1 is the bar's #275 claim, NOT measured here: left); STRUGGLING v1 v2 v4 v5 v7
(chronic shortage, mending, debts: the rung's own colour) in the 18 no-market towns and the 6 famine towns.
STRUCK, true by the record: B21281 DS-GEN-17 GARRISONED v1 "keeps people under arms for its defence" (66; the 47 with only a town
watch: a watch is the town's armed body, and GARRISONED's key is a standing force or a watch); 22300 ADMINISTERED v1 "keeps its own
court" (6; the `court` atom holds in all 6); B21289 (HIGH) DS-ECO-8 MODERATE v3 "supports itself and has a little in hand" (2; the
prosperity rung's claim, not the food ledger's: a town that buys a quarter of its food and pays for it supports itself); 22397
DS-ECO-1 C4 v2 "The village is poor" (30; Struggling is BELOW Poor on the ladder: the plain word holds); B03005 COMMERCE v4 (12; 1
famine village with a market: offering a stall is not offering the food that failed).
GUARD: 17 GONE rows (each red at the base for the right reason: the old line drawn) and 15 KEEP rows (green before and after) added to
`corpusEcoTailGuards.test.js`; the test's own draws agree with the replay's inheritor in every row (its `prints`).
PINS RE-KEYED BY IDENTITY: `tests/lint/undeclaredLines.register.json` (DS-ECO-8::COMFORTABLE leaves the undeclared register: its
last undeclared line now declares). THE PRESUMED DOOR: the three reworded market lines would have gone fresh (147 -> 150: their
banked rows are keyed by the old text); each now declares the word it names (`market`) or denies (`no market`), so fresh stays 147
(the replay: no draw moved by those marks) and the three old rows go stale: shrunk through the door's own `--shrink`, IN ITS OWN
COMMIT (the next one).
Doors: generator --check 0; presumed fresh 147 (= base); the grid 2 falls (= base); strict-domain 0, the type ratchet 0, eslint 0;
the 58 files: the base's 38 reds, plus the presumed walker's stale-row red that the next commit cures; the guard 50 green.

### THE AFTER RUN (both batches, at 29271e7bf: the census of the 720 on this tree; inventory_diff over the 40 cured rows)

29,876 -> 29,883 distinct sentences; gone 100, new 107 (the reworded lines and their tier-noun folds), in fewer towns 21, in more
towns 32, moved 0. THE 40 ROWS: 25 GONE (every reworded row, and DS-GEN-13 MARKET-NARROW v2, COMMERCE v2), 14 in FEWER towns by
exactly their measure before (the replay's counts, every one: established v2-v6 52->51, 92->87, 79->75, 89->84, 79->75; HOW THE NEED
v2 69->65; ADMINISTERED 44->42 and 6->5; WAREHOUSES v3 32->30, 29->28, 8->7; STRUGGLING v6 26->8, v3 9->3; DS-ECO-6 v5 20->18;
entrepot v3 12->11, 7->6), 1 "still in the town read": 20129 COMFORTABLE v3 41 -> 40 (its measure, 1, is r2s-succession_void-
metropolis-1; the town it was read in keeps it: its food band reads `secure` while its ledger is 3% short after imports: the band's
cut, NOT cured here, named).
EVERY OTHER SENTENCE IN FEWER TOWNS is a fragment of a batch line (the page splits a line at its full stop): "This is a town that
sells." (established v2), "The <tier>'s living is the road." (entrepot v3), "The metropolis is plainly past subsistence." (COMFORTABLE
v3). No line outside the batches was silenced.
THE INHERITORS (139 sentences gain towns that lost one): the reworded lines in the same towns; then exactly the replay's inheritors
(STRUGGLING v1 v2 v4 v5 v7 +4 to +7 each; established v1 "sells more than one thing beyond the <tier>" +19 over its tier folds; HOW
THE NEED v3 +4 and v1; WAREHOUSES v1 v2 v4; ADMINISTERED v2 v3; DS-ECO-6 v4 and v0; entrepot v1 v2; COMFORTABLE v2), each read in
batch 2's table above.

### TAIL-CORPUS-ECO-2 · the base and the before run

Seat: TAIL-CORPUS-ECO-2 (the successor), on this branch at its tip **50c597eea** (read back from origin), scratch worktree,
merging nothing. THE BEFORE RUN at 50c597eea (census3d re-made below, the 720): 29,883 distinct sentences (= the predecessor's
after run, reproduced); the replay's probe 58,242 single draws, 0 misses.

### Batch 3 · the economy desk (economy.generated.js): DS-ECO-1, -6, -8, -9, -10, -11 · DECLARED (by replay) and REWORDED

MEASURED BY REPLAY: five pools moved and NO OTHER POOL MOVED; no state left mute (every move lands on a line of the same pool).

| row(s) | pool · line | cure | false by the record (of printing) | replay before -> after · moves |
|---|---|---|---|---|
| 00583 | DS-ECO-1 C3 v2 "gets by on a thin margin, and little in its trade is spare" | REWORDED "pays its way from year to year, and nobody here calls the town poor" (a `prosperity: ≤ moderate` declaration was tried and withdrawn: it leaves a Comfortable calm town with no market and no `{complexity}` slot MUTE (economicsTabFlow's fixture threw) and thins the C3 crisis state) | 20 of 35 (Comfortable) | unmoved |
| 01572 01569 | DS-ECO-1 C4 v3 "the market sells little ... most of the traffic does not stop" | REWORDED "{settlement}'s {access} is busy, but little of what passes leaves its money here, and the traders at the market are poor" | 11 of 29 (daily markets, many squares, fairs, a caravan exchange: the cities) | unmoved |
| 01191 01181 (HIGH) 01186 | DS-ECO-1 C5 v2 "a {complexity} that feeds it and no more, and the road in is too poor to bring anything extra" | + `food: ≥ secure · no crisis: under_siege` | 14 of 21 (famine 7, deficit under a siege 3, import-dependent 2, pressured 2) | v2 21 -> 7: -> v3 9, v1 5 |
| 20456 | DS-ECO-6 large v1 "The duties collected fall well short of the trade actually done" | REWORDED "A large share of what {settlement} earns is earned out of sight, and none of it by accident." | 1 of 13 (no market, no office) | unmoved |
| 02935 | DS-ECO-6 significant v1 "sits outside the rolls, enough that the men who do pay their duties ..." | REWORDED "A real portion of {settlement}'s trade is done out of sight, enough that those who trade openly are at a disadvantage." | 11 of 18 (no market, no office, no clerk) | unmoved |
| 02770 02771 | DS-ECO-6 minor v1 "small enough to annoy the clerks" | REWORDED "A little of {settlement}'s trade is done out of sight, too little to change what the town is." | 42 of 57 (no office, no clerk) | unmoved |
| B02776 B02771 | DS-ECO-11 STRATEGIC VALUE v4 "A newcomer to X soon hears ..." | `colour` -> `no crisis: under_siege` (a colour line declares nothing else, R-AO) | 8 of 127 (a siege) | v4 127 -> 119: -> v1 3, v3 3, v5 1, v6 1 |
| B00791 | DS-ECO-8 WEALTHY v1 "reserves deep enough to ride out most of what could happen" | + `stores: ≥ 3` | 4 of 12 (1.8-2.4 months of stores) | v1 12 -> 8: -> v3 4 |
| B27697 | DS-ECO-10 POSTURE none v1 "What the town makes, the town uses", v3 "Whatever surplus there is stays" | + `no crisis: occupied` (both) | 3 of 19, 3 of 22 (an occupation: the occupier takes a share of every sale) | v1 19 -> 16, v3 22 -> 19: -> v2 6 |
| 00588 | DS-ECO-9 PRESSURED v1 "grows a little less food than it needs" | REWORDED "falls a little short of the food it needs, and every season the difference is made up by tighter belts" | 19 of 25 (grows under 85% and buys most of the gap) | unmoved |
| 00991 15068 (HIGH) 03095 22253 | DS-ECO-9 IMPORT-DEPENDENT v3 "is fed and dependent. Nothing about the arrangement is failing", v1 "bought rather than grown ... a trade item" | REWORDED v3 "cannot feed itself from its own land, and everything rests on what comes in from outside"; v1 "A substantial part of what {settlement} needs to eat has to come from outside the town, and when it does not come, the town goes short" | v3 4 of 4, v1 3 of 4 (every IMPORT-DEPENDENT town of the 720 is 16-40% short after imports; imports 0-8% in three) | unmoved |
| 20660 20530 28996 28994 | DS-ECO-9 FOOD SOURCES several v2 "the others carry it", v3 "without going hungry" | + `food: ≥ secure` (both) | 3 of 35, 3 of 34 (deficit, import-dependent, pressured) | v2 35 -> 32, v3 34 -> 31: -> v1 6 |
| 09248 | DS-ECO-9 HOW THE NEED much brought in v1 "Food carts come into X most days" | REWORDED "Food comes into {settlement} most days, and it matters" | 23 of 66 (a river or a port the food comes by) | unmoved |

Rows cured: 24 (00583 01572 01569 01191 01181 01186 20456 02935 02770 02771 B02776 B02771 B00791 B27697 00588 00991 15068 03095
22253 20660 20530 28996 28994 09248).
THE INHERITORS READ (each where it lands): C5 v3 "too poor to mend its road, and the road brings in too little to make it richer" and
v1 "What the road does not bring in, the people here go without" in the famine and deficit towns (true: neither says it is fed);
STRATEGIC v1 v3 v5 v6 under a siege (what its ground is worth, who wants it: none says anyone arrives); WEALTHY v3 "The town is rich
and behaves like it" in four calm towns with two months of stores (the purse, not the granary); POSTURE none v2 "Nothing leaves X for
trade" under an occupation (the levy is not trade); FOOD SOURCES several v1 "a poor year in one does not empty the town's tables" in
six short towns (true: it says nothing is enough).
STRUCK, true by the record: B27928 DS-ECO-1 C3 v1 "With a little left over each year" (4; the money rung Moderate, not the food
ledger: the predecessor's B21289 ruling); 01099 C5 v3 "the road brings in too little" (17; "too little" is true of none and of a
few); B21598 PRESSURED v2 "There is enough food, mostly. Portions have got smaller" (23; every PRESSURED town of the 720 has 87-95%
of its need after imports: "mostly" holds); 29012 ACTIVE FAMINE failed source v3 "whatever it can buy" (2; claims no purchase).
NAMED FOR THE RECORD (not the line): 23230 C1 v1 "a subsistence living keeps everyone busy" at Wealthy (the record's
`economicComplexity` "Subsistence — survival economy" beside the rung Wealthy: two fields of one record disagree); 29009 ACTIVE
FAMINE "With the fishing gone" beside fish exports (the famine's failed source against the trade list: the food record's writer);
B14264 DEFICIT v5 "Nothing has come into X since the siege closed the roads" where the ledger counts 12% imported (the siege law
holds; the record's import share under a siege is the food record's).
GUARD: 17 GONE rows (each red at the base for the right reason: the old line drawn; all 17 red there, 0 KEEP red) and 15 KEEP rows
(green before and after: the reworded rows keep a stem common to the old and new wording) added to
`tests/domain/corpusEcoTailGuards.test.js` (now 83). A GONE row may name TWO vids where the public page and the owner's read each
draw the pool (DS-ECO-6 significant at r2r-hamlet-17: the public v6, the owner's v1). The plant (PRESSURED v1's old text put back in
the leaf, not committed) reds its row.
PINS RE-KEYED BY IDENTITY: `tests/lint/undeclaredLines.register.json` (C5 3 -> 2, POSTURE none 3 -> 1: lines that now declare);
`tests/lint/proseEntryContradiction.walker.test.js` trailing-coordinate count 376 -> 374 (IMPORT-DEPENDENT v3 and C4 v3, reworded
without their "; …"); `tests/domain/economyStateProseDesk.test.js` THE PAYOFF's measured town is fed (C5 v2's `food: ≥ secure`
reads a food record; the fixture had none, so the fill measured 2, not 3).
THE PRESUMED DOOR: fresh 147 (= base); one banked row goes stale (HOW THE NEED v1's "Food carts", `openTrade`): shrunk through the
door's own `--shrink` IN ITS OWN COMMIT (the next one).
Doors: generator --check 0; the grid 2 falls (= base); strict-domain 0, the type ratchet 0, eslint 0 on the touched files; the 70
test files naming the leaves: the base's 40 reds exactly (carried from the joined line), plus the presumed walker's stale-row red
the next commit cures; the guard 83 green.

### Batch 4 · the chair's ruling C12 (DS-ECO-1 C4 v4, DS-ECO-9 IMPORT-DEPENDENT v5) · REWORDED, no draw moved

| line | old | new | prints | false by the record |
|---|---|---|---|---|
| DS-ECO-1 C4 v4 | "With the siege closing every way in, ..." | "With the siege closing the roads, {settlement} has lost what passing trade used to leave behind, and the town feels the loss." | 14 | 1 (r2s-under_siege-city-0: the sea open, food by ship) |
| DS-ECO-9 IMPORT-DEPENDENT v5 | "... none of it has come since the siege closed the roads." | "Whatever {settlement} used to buy for its table, none of it has come by road since the siege began." | 3 | 1 (the same port) |

GUARD: 2 GONE rows (r2s-under_siege-city-0, both red at the base) and 2 KEEP rows (the stems, green before and after); the guard 86
green. Doors: generator --check 0; presumed fresh 147, stale 0; the grid 2 falls (= base); strict-domain 0, the type ratchet 0,
eslint 0; the 70 leaf-naming files: the base's 40 reds exactly.

## The veto list (every new or reworded line, with the towns it was read in)

Batch 1 (DS-ECO-12; read where the old line printed, the reword in its place; smallest / largest / a crisis):
- INCOME MIX one source v1: "More than half of what {settlement} earns comes from a single source, and most households depend on
  it one way or another." — r2r-thorp-0 (Izamitza), r2s-wartime-village-1 (Puribagh), r2r-thorp-58 (Tallpatan, a siege).
- INCOME MIX one source v2: "Almost everyone's living at {settlement} depends on one source of income, whether or not they earn
  from it directly." — r2r-thorp-1 (an occupation), r2s-mass_migration-town-2 (Shivanand), r2r-thorp-17 (a famine).
- INCOME MIX criminal present v2 (dm-only): "Some of the money in {settlement} is made outside the law, and the people who earn
  theirs honestly do not know who is making it." — r2r-thorp-10, r2s-wartime-metropolis-3 (Nanwan), r2r-village-43 (a siege).
- INCOME MIX broad spread v1: "{settlement} lives on many trades, and no one of them carries the town." — r2r-town-16 (Birkhel),
  r2s-wartime-metropolis-3 (Nanwan), r2s-famine-town-1 (Hongcheng, a famine).
- CRITICAL IMPORT land v1: "The country around {settlement} does not give the town enough {good}, so the town buys in what it
  needs." — r2r-thorp-0 (metals), r2s-wartime-city-1 (grain), r2r-thorp-40 (timber, an occupation).
- CRITICAL IMPORT land v2: "Not enough of the {good} used at {settlement} comes from the country here; the town brings in the
  rest, or goes without." — r2r-thorp-12 (metals), r2s-slave_revolt-city-2 (luxury goods), r2s-famine-thorp-0 (a famine).
- CRITICAL IMPORT land v3: "The country around {settlement} does not give the town enough {good}, so the town must look elsewhere
  for the rest." — r2r-thorp-1 (an occupation), r2s-wartime-hamlet-3, r2r-thorp-54 (a famine).
- CRITICAL IMPORT house v1: "Some of {settlement}'s work cannot go on without {good}, and the country around the town does not
  give enough of it, so the town buys from outside or that work stops." — r2r-hamlet-19 (livestock), r2s-wartime-metropolis-3
  (grain), r2s-occupied-village-1 (an occupation).
- CRITICAL IMPORT house v2: "A good part of the {good} {settlement}'s work uses must come from elsewhere; when none comes, that
  work stands idle." — r2r-hamlet-12 (livestock), r2s-wartime-metropolis-1 (grapes), r2s-famine-hamlet-2 (a famine).

Batch 2 (reworded; smallest / largest / a crisis, from the replay's draws):
- DS-GEN-13 NO-MARKET v3: "No market or fair stands in {settlement}: what trade the town does is done house to house." —
  r2r-thorp-0, r2r-village-9, r2r-hamlet-16 (a famine).
- DS-GEN-18 BOUGHT-IN v9: "Some of what changes hands at {settlement} came from somewhere else first." — r2r-thorp-10,
  r2r-metropolis-46, r2s-famine-hamlet-0 (a famine).
- DS-GEN-13 MARKET-NARROW v2: "{settlement}'s market is where its own people trade with each other, more than with anyone from
  outside." — r2r-village-0, r2r-metropolis-9, r2s-under_siege-town-2 (a siege: true, only its own people are left).
- DS-GEN-13 COMMERCE a market, no guild v2: "No guild keeps a house at {settlement}'s market: the town's own hold on trade there is
  the stall fee." — r2r-hamlet-4, r2r-village-55 (a siege), r2s-occupied-village-2 (an occupation).
- DS-ECO-10 POSTURE entrepot v2: "The trade here is in the moving of things, and the town's yards are as busy as its workshops." —
  r2r-thorp-11, r2r-metropolis-57, r2s-occupied-city-0 (an occupation).
- DS-ECO-8 PROSPEROUS v1: "{settlement} has money to spend, and spends it on the town's buildings and their upkeep." — r2r-thorp-33,
  r2r-metropolis-9 (the rung prints in no siege, famine or occupation town of the 720).

Batch 3 (TAIL-CORPUS-ECO-2; smallest / largest / a crisis, from the before run's draws):
- DS-ECO-1 C3 v2: "{settlement} pays its way from year to year, and nobody here calls the town poor." — r2r-thorp-0,
  r2r-metropolis-22 (calm only by design: an unmarked line of a crisis-scoped pool).
- DS-ECO-1 C4 v3: "{settlement}'s {access} is busy, but little of what passes leaves its money here, and the traders at the market
  are poor." — r2r-hamlet-4, r2s-famine-metropolis-2, r2r-city-44 (a famine).
- DS-ECO-6 large v1 (dm-only): "A large share of what {settlement} earns is earned out of sight, and none of it by accident." —
  r2s-insurgency-hamlet-0, r2r-metropolis-4, r2s-famine-city-2 (a famine).
- DS-ECO-6 significant v1 (dm-only): "A real portion of {settlement}'s trade is done out of sight, enough that those who trade
  openly are at a disadvantage." — r2r-thorp-10, r2s-politically_fractured-metropolis-1, r2r-village-43 (a siege).
- DS-ECO-6 minor v1 (dm-only): "A little of {settlement}'s trade is done out of sight, too little to change what the town is." —
  r2r-thorp-31, r2r-town-36, r2r-hamlet-0 (a siege).
- DS-ECO-9 PRESSURED v1: "{settlement} falls a little short of the food it needs, and every season the difference is made up by
  tighter belts." — r2r-thorp-23, r2s-indebted-metropolis-3, r2s-occupied-city-3 (an occupation).
- DS-ECO-9 IMPORT-DEPENDENT v1: "A substantial part of what {settlement} needs to eat has to come from outside the town, and when it
  does not come, the town goes short." — r2s-wartime-thorp-3 (a war), r2s-mass_migration-town-2 (no siege by declaration).
- DS-ECO-9 IMPORT-DEPENDENT v3: "{settlement} cannot feed itself from its own land, and everything rests on what comes in from
  outside." — r2s-plague_onset-thorp-0, r2r-village-50, r2s-occupied-village-1 (an occupation).
- DS-ECO-9 HOW THE NEED v1: "Food comes into {settlement} most days, and it matters: a good part of what the town eats is grown
  elsewhere and brought in." — r2s-famine-hamlet-0 (a famine), r2r-metropolis-0, r2r-village-24 (a famine).

Batch 4 (C12; read where they print: smallest / largest / the sea exception):
- DS-ECO-1 C4 v4: "With the siege closing the roads, {settlement} has lost what passing trade used to leave behind, and the town
  feels the loss." — r2s-under_siege-thorp-1, r2s-under_siege-metropolis-2, r2s-under_siege-city-0 (the sea open).
- DS-ECO-9 IMPORT-DEPENDENT v5: "Whatever {settlement} used to buy for its table, none of it has come by road since the siege
  began." — r2s-under_siege-hamlet-2, r2s-under_siege-metropolis-3, r2s-under_siege-city-0 (the sea open: true, the food comes by ship).

## Rows struck (true by the record), with why

- AT THE BASE, no longer printing where read and true where they print: 23470 (HIGH) DS-GEN-13 MARKET-OPEN v3 (71 towns, none a
  plague or a siege: the base's `no crisis: plague_onset`); 02808 02809 WAREHOUSES v2 (27/25 towns, none a siege: the base's
  `no crisis: under_siege`).
- Batch 2's five: B21281, 22300, B21289 (HIGH), 22397, B03005 (each with its reason in the batch).

- GONE AT THE BASE (the fold prints nowhere at 48fedbe98): 03994 B21024 B03874 B21019 21304 B14751 B19451 B14745 B14746 B03823
  B00464 B21016 (DS-GEN-16). NOTE, honestly: the same pool lines still print in their template wording (e.g. LIVING-MEMORY v2 "Ask
  about the village's present quarrels in X and before long somebody brings up the succession crisis.", 9 towns); the readers'
  reason (no present quarrel on the record) may hold there too: NOT measured here, left in "what is left".

## Rows named for other groups

- `src/generators/economy/tradeGoods.js :: deriveIsEntrepot` (the bar's #275): 13 of the 48 towns printing DS-ECO-10 POSTURE
  entrepot are ports with no transit good and no entrepot income (r2r-city-12 -13 -16 -34 -38 -52 -9, r2r-metropolis-13 -21 -48
  -55, r2s-religious_conversion-city-2, r2s-slave_revolt-metropolis-3); v2 is reworded here, v1 ("some of what leaves the town
  entered it as imports the same season") is the record's to cure.
- The FOOD SOURCES rows (DS-ECO-9 one source / several, ~20 rows): the `{good}` slot and the one/several key come from the food
  record's `foodSources` (a town named as living on its fishing or its herds whose houses are farms and a mill): the food record's
  writer (`foodBalance.js :: deriveFoodRecord`), not the pool.
- DS-ECO-11 RESOURCE CONDITION / EXPLOITATION unexploited (~20 rows): "nobody bothers with the river fisheries" beside a working
  Fisher's landing; "its stone has been there to take, and nobody has found it worth the trouble" beside walls of local quarry
  stone; a named resource the resource list lacks: the exploitation record's writer (`resourceAnalysis.exploitation`).
- DS-GEN-18 UNWORKED v1 / BOUGHT-IN v4 (8 rows): a resource "unworked" or a good "from the carts" that the trade record lists as
  made here: the same record class (RECORD-MEASURE-2's kin: a good made with no house that makes it, or the reverse).
- DS-SUP-3 ONE EXPECTED CATEGORY MISSING v2 (07394, 18): the key fires where MORE than one is missing: the catalog's counter
  (`EXPECTED_SERVICES_BY_TIER` against `availableServices`), not the line.

## Registers named stale

- The shift register (`docs/content/prose-shift-register.json`, SEAM car 4) and the prose byte baseline: red at the base already
  (carried); every reword moves the per-pool hashes and bytes again. Named, re-derived once at the close.

## Guards owed

- None for the rows cured: every cure has its GONE row and a KEEP row in `tests/domain/corpusEcoTailGuards.test.js` (50 rows).

## What is left of the worklist

BATCH 3 (TAIL-CORPUS-ECO-2) took 31 of the 83 below: cured 00583 01572 01569 01191 01181 01186 20456 02935 02770 02771 B02776
B02771 B00791 B27697 00588 00991 15068 03095 22253 20660 20530 28996 28994 09248; struck B27928 01099 B21598 29012; named for the
record 23230 29009 B14264. The list below is the predecessor's, those 31 read as taken.


83 rows, unread or unmeasured by this seat (towns printing at the base in brackets), the widest first, each still A CANDIDATE:
- DS-ECO-9 (31 rows less those cured): IMPORT-DEPENDENT v3 00991 15068 (HIGH, 4: "is fed ... nothing is failing" in an occupied
  village, viable false) and v1 03095 22253; PRESSURED v1 00588 (22: "grows a little less food than it needs" at half its need) and
  v2 B21598 (23: "enough food, mostly" at a 13% gap) - a band word against the ledger's size: the band's cut, measure first;
  FOOD SOURCES several v2 v3 20660 20530 28996 28994 (18/12/11/8: "the others carry it" / "without going hungry" at a 35-68%
  deficit: a `food: ≥ pressured` declaration is the shape, a twin for the deficit bands owed: NOT begun); the one-source rows
  (named above); DEFICIT v5 B14264 (3); ACTIVE FAMINE failed source v3 29012 29009 (2 each); HOW THE NEED v1 09248 (1).
- DS-ECO-1: C3 v2 00583 (35: "gets by on a thin margin" in 20 Comfortable-or-better towns: `prosperity: ≤ moderate` + a twin for
  the comfortable calm town with no market, which the pool would leave mute: NOT begun); C3 v1 B27928 (4); C5 v2 v3 01181 (HIGH,
  1, a siege) 01191 01099 01186 (road and "feeds it" in isolated or starving towns); C4 v3 01572 01569 (14/5: "the market sells
  little" beside daily markets: the market's size has no atom); C1 v1 23230 (1).
- DS-ECO-11: STRATEGIC VALUE v4 B02776 B02771 (24/22: "A newcomer soon hears" under a siege: + `no crisis: under_siege` is the
  shape; v5 v6 are colour and speak there: NOT begun); the exploitation / resource-condition rows (named above).
- DS-ECO-6: significant v1 02935 (18), minor v1 02770 02771 (18/14), large v1 20456 (12): dm-only shadow lines naming "trade" and
  "clerks" in isolated thorps with no office: a reword in batch 1's form is the shape.
- DS-GEN-13: ENTREPOT v1 01563 B01502 (20/18: 2 plague, 1 occupied: PLAUSIBLE, not cured); merchant guild v2 12095 (6, a guild
  power Suppressed: no atom); a bank v1 03133 (1).
- DS-GEN-14 FOUNDED-YOUNG v2 07396 07397 (15/2: "still does the job it began with" against the founding: the founding has no atom).
- DS-ECO-8 WEALTHY v1 B00791 (12); DS-ECO-10 POSTURE none v1 B27697 (8, an occupier's levy).
- DS-SUP-2 UPSTREAM WEAK 18251 23280 (5/2).
- DS-GEN-16 (the 12 gone at the base): the same pool lines print in their template wording (LIVING-MEMORY v2 in 9 towns "Ask about
  the village's present quarrels ... the succession crisis"): the readers' reason (no present quarrel) to be measured there.
- PARKED (C6): INCOME WEIGHT magic B12119 28731 28726 28745 21275; false in 5 of 54: r2r-town-29, r2r-village-2,
  r2s-indebted-hamlet-0, r2s-indebted-village-0, r2s-recently_betrayed-thorp-3 (true when the record is cured).
