# W2-WRITE-SIDE-14 — the hand-back of the corpus lane's side seat, second seat (DS-ECO, DS-GEN, DS-SUP) — KEPT CURRENT AFTER EVERY POOL

**Branch:** `lane/w2-write-side-13-2026-11-14`, read back from origin at the start: `6173c999c` (the brief's figure, no difference).
Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-SIDE-14.md` on the chair's lane (the chair session_01ACmDYZrFEVXyZEUg1NDxxC).
Scratch worktree on local branch `side14`, pushed by `git push origin side14:refs/heads/lane/w2-write-side-13-2026-11-14`, each push
tested non-empty first. In the source document this seat edits only the sections of DS-ECO, DS-GEN and DS-SUP.

## Measured at the start
- The owner-page render (W2-WRITE-5's `render.sh` + `render.w5.jsx`) re-made ONCE at `6173c999c`, in a `git archive` of the commit
  (9332 files = `git ls-tree -r | wc -l`), over `seeds-w5a.txt` + the ten `bar0-` seeds (772 towns, 4 workers).
- THE PRINT MEASURE (`prints.mjs`, this seat's: per pool and vid, towns where the drawn line's text is found on the owner's page,
  matched by any slot-free clause of 18 characters or more): the pools below are DRAWN but PRINT ON NO TAB of the owner's page (the
  mount is a `glance` rung in `src/domain/display/stateProse/dossierMounts.js`; the PDF's `printProse.js` weaves the screen's own
  positions, so they print there nothing either): **DS-GEN-3 (all 37 pools: "GLANCE BY OWNER ORDER 2026-09-17 ... DS-GEN-3 has NO
  speaking position"), DS-GEN-5, DS-GEN-6, DS-GEN-7, DS-GEN-9, DS-GEN-12, DS-ECO-2 FOOD (surplus/balanced/deficit), DS-ECO-11 TERRAIN
  (all seven), DS-ECO-12 TRADE PROFILE (all five).** (Two false counts of the matcher read by hand: TERRAIN Plains 52 and GEN-3
  monster CRITICAL 37 are a generic clause, "the country around", printed by another block; no line of those pools prints.)
  The Foundry journal and the exports were not rendered: PLAUSIBLE that they print nothing of a glance pool, not measured.

## THE SWEEP'S 129 ROWS, ALL READ (each lacking sibling's text under the failed condition, `vtp.mjs`: the whole pool printed once)
Of 129 rows: **TAKES 13 rows' worth of lines in 8 pools; TRUE WITHOUT the condition 116** (most are a partition working as built:
the lacking sibling does not speak of the thing). Of the 8 pools that take, **4 print nowhere** (DS-GEN-3): NAMED, not declared
(the method's first law reads a line where it prints; a line that prints nowhere has no town to read it in, and neither has its
inheritor: the day DS-GEN-3 is re-homed by a registry act, these declarations go in with it).

TAKES, IN PRINTING POOLS (landed pool by pool below):
- R29 DS-ECO-10 POSTURE: established v8, v9 + `no crisis: under_siege` (famine lines "has more than one trade sending goods out" /
  "every trade X sells outward is judged by ... what it can bring back to eat" drawn under siege+famine: nothing goes out or comes
  back by road; v7 the siege line inherits).
- R80 DS-ECO-11 EXPLOITATION: fullyExploited v2 ("from the ground to the gate") and v4 ("takes everything it can from the
  {resource} its country gives") + `no crisis: under_siege` (v1 v3's condition: the gate is shut, the country is the besiegers';
  v5 the siege line inherits).
- R98 DS-GEN-13 WAREHOUSES v2 ("A merchant ... can store a cargo ... and sell it when the price suits") + `no crisis: under_siege`
  (the bar's #39; v1 v3 v4's condition); the pool would fall MUTE under a siege: TWIN v5 `[ledger · crisis: under_siege]` "Since
  the siege began, nothing new has come in to be stored at {settlement}, and nothing stored there can be sent on."
- R104 DS-GEN-13 COMMERCE: a bank v2 ("larger dealings, from cargoes ...") + `no crisis: under_siege` (v1's condition; v3 v4
  inherit: savings and credit, true inside the walls).

TAKES, IN DS-GEN-3 (prints nowhere; NAMED for the re-homing):
- R12 scores.military CRITICAL v1 + `no crisis: under_siege` ("nothing ... would stop anybody who meant to come in" of a town a
  besieging army has not entered; v4's condition; v6 the threat line inherits).
- R64, R66 readiness Undefended v2 + `no walls` ("nothing ... to hold" behind walls; v4 inherits), v1 + `no militia` ("no
  defences at all" beside a militia; v5 v6 inherit).
- R74, R76 safetyLabel Secure/Controlled/Quarantined v3 + `no crisis: occupied · no crisis: plague_onset` ("the streets are
  quiet, not because the watch is idle" where they are quiet because people are kept off them: v4's own claim; v4 inherits).
- R87 foodSecurity Import-Dependent v1, v2 + `no crisis: under_siege` ("It buys the rest" / "comes up the road" under a siege);
  the pool would fall mute under a siege (v3-v5 carry `no crisis: hunger`): a twin would be owed, and the block's own law (no
  historical cause: "no variant may say ... a route closed") shapes it: e.g. "{settlement} does not grow enough to eat, and under
  the siege nothing it would buy can reach it." NOT WRITTEN (prints nowhere).
- R125 scores.monster ADEQUATE v2 ("The bounty book ... is used and modest") under monster pressure: reword to drop "and modest"
  or `no crisis: monster_pressure` with a twin.
- R127 (DS-GEN-7, also a glance) power_economic temple economy v2 "The seat in X makes the decisions" under a succession void
  (1 of 3 draws; v1 "while {govFaction} holds the seat" would inherit and says the same): NAMED.

TRUE WITHOUT THE CONDITION, SAID (row: the lacking lines, why; one town each in the sweep's own list):
- R1-R4 DS-GEN-18 BOUGHT-IN without `guild` / `market` / `tier: ≥ village` / `no crisis: famine` (v1 v4 v9 v7 v8: goods brought in,
  the carts, things that change hands: no workshop, stall or work-seeker named).
- R5 R6 DS-GEN-13 NO-MARKET v3 without `gate` / `institution: tavern` ("house to house and on the road"); v4-v6 the siege lines.
- R7 R8 DS-ECO-2 FOOD deficit v1 without `grain` / granary (prints nowhere; SEEN: v1 "Food comes in from outside every week" and v2
  "which day the carts come" are false under a siege: for the day the pool prints).
- R9-R11 R13 R14 GEN-3 military CRITICAL (gate, walls, threat, wartime, no walls: capacity lines). R15 R16 food Secure. R17 R18 DS-ECO-12
  INCOME MIX one source v1 v2 without `prosperity: ≥ moderate` / `no hunger` (colour: no claim of doing well). R19 R20 DS-ECO-1 C4
  without `market` / `no market` (v1 v2: trade passes; no market named). R21 R22 DS-ECO-9 SECURE v1 v2 either side of the stores
  band. R23 DS-ECO-12 CRITICAL IMPORT the land cannot give it v1 v2 where the town imports ("none but what it buys": true). R24 R25
  FOOD balanced. R26-R28 DS-ECO-10 POSTURE established without `tier: ≥ village` / `no hunger` / `no crisis: famine` (v1 v3-v6:
  goods going out, buyers coming; v8 v9 the famine lines). R30 DS-ECO-12 a house needs v1 v2 either side of `stores: < 6` (food
  months; the lines speak of a craft's input). R31-R33 TERRAIN Forest. R34 R35 DS-ECO-1 C3 v1 (a crisis line) and v1 v2 without
  `market`. R36 TRADE PROFILE v2. R37 R38 FOOD surplus. R39-R43 GEN-3 military WEAK. R44 DS-ECO-8 STRUGGLING v1 v2 v4-v7 without
  `market` (sellers, credit, debts: no stall named). R45 DS-GEN-13 MARKET-OPEN v2-v6 above a town (through-traffic, the road, the
  siege and plague lines). R46 MARKET-OPEN v4 under a plague (side-13 read it; v3 took the condition, fe7769659). R47-R52 GEN-3
  military ADEQUATE/STRONG (R51 STRONG v1 v2 under an occupation: the men on the walls and the roll are a force that stands there,
  whoever holds it: the other seat's DEF-1 STRONG ruling, "the works, not who holds them"). R53-R55 DS-ECO-6 significant off-book
  without `no market` / `guild` / `market` (dm-only and colour lines; no guild fee or stall named). R56-R59 GEN-3 safety. R58 Plains.
  R60 R61 DS-ECO-9 PRESSURED v1 v2 (crisis lines; "grows a little less food": any food source). R62 R63 R65 GEN-3 Undefended.
  R67 R86 GEN-5, R68 R92 GEN-6, R69 R70 GEN-3. R71 Hills. R72 R73 DS-ECO-12 religious houses v3 v4 in hamlets ("keeps no house") and
  v1 v2 under a siege (what the houses spend: true inside the walls). R75 GEN-3 safety v4 without `watch`. R77 R78 DS-ECO-6 minor
  shadow v1-v3 v5 under a siege or famine (v0 alone says "a nuisance, nothing more"). R79 DS-ECO-11 fullyExploited v1 v3 v4 without
  `gate`. R81-R84 R87-R90 GEN-3. R85 DS-ECO-9 FOOD SOURCES one source v2 under a famine ("after a poor season ... less to go round":
  offers no food). R91 R109 GEN-9. R93 R94 DS-ECO-8 PROSPEROUS v1 v3 either side of walls ("defences"; the halls are the bar's #168).
  R95 DS-GEN-17 GARRISONED v1 without walls. R96 R97 GEN-7. R99 R100 DS-ECO-8 MODERATE v1 either side of a crisis. R101 R102 DS-ECO-9
  IMPORT-DEPENDENT v3 without `grain`, v5 v6 (the siege lines) under hunger. R103 R121 TERRAIN. R105-R108 GEN-3 Fortress, DS-ECO-12
  local production (prints nowhere), GEN-3 Pressured. R110 R111 GEN-3. R112 DS-ECO-8 POOR v1 v3 v4 without `food: ≥ secure`. R113
  DS-ECO-9 DEFICIT v3 under a siege ("taken out of the stores rather than made up from anywhere": the siege's own truth). R114
  DS-GEN-17 monastery v2 v4 under a siege (the monks' hours and order). R115-R119 GEN-3. R120 DS-GEN-13 merchant guild v3 under a
  siege ("do most of the buying and selling that matters": inside the walls). R122 craft guilds v1-v3 under a siege. R123 a market,
  no guild v1-v3 under a siege (v1 "Anyone with goods and the stall fee can sell ... without a guild's leave": a rule of who may
  sell, not of who can arrive; side-13 left it "for the sweep": read, TRUE). R124 DS-ECO-8 COMFORTABLE v2 v3 under a debt crisis
  (households put by; the debt is the town's books). R126 DS-ECO-6 large share v1 v2 without `guild`. R128 DS-ECO-8 WEALTHY v1 v3
  without `gate`. R129 GEN-3.

## THE BATCH, MEASURED BY REPLAY (before any landing)
`replay2.mjs` (W2-WRITE-13's `replay.mjs` + a new vid is eligible where its pool was reached and its declaration admits): on the base
it reproduces all 59,761 single draws, 0 misses. The whole batch (7 declarations + 1 twin) moves 67 draws in exactly the four pools
and nothing else: WAREHOUSES v2 -> v5 45; the bank v2 -> v4 5, -> v3 1; POSTURE established v9 -> v7 8, v8 -> v7 4; fullyExploited
v2 -> v5 2, v4 -> v5 2. No state falls mute.

## Pools landed
| pool | before -> after (772, replay) | cure | commit | guard |
|---|---|---|---|---|
| DS-GEN-13 WAREHOUSES, COMMERCE: a bank | WAREHOUSES v2 109 -> 64, v5 0 -> 45 (all 45 besieged warehouse towns); bank v2 41 -> 35 | v2 + `no crisis: under_siege` (both); WAREHOUSES twin v5 | fba284bcf | corpusCureGuards WAREHOUSES v2 at w5-city-under_siege-1, bank v2 at w5-city-under_siege-104 (red on the base: "is eligible") |

## New or changed lines (the owner's veto list, with the towns read)
- DS-GEN-13 WAREHOUSES v5 (NEW, fba284bcf) `[ledger · crisis: under_siege]` "Since the siege began, nothing new has come in to be stored
  at {settlement}, and nothing stored there can be sent on." Prints on the Overview clipped: "Since the siege began, nothing new has
  come in to be stored at X." Read in w5-town-under_siege-3 Celotsy (the smallest it reaches: a town), w5-metropolis-under_siege-1
  Qal'atpatan (the largest), bar0-city-under_siege+famine-rand-1 Agiospolis (siege and famine).
- Declarations only (text unchanged): WAREHOUSES v2, the bank v2 (+ `no crisis: under_siege`).

## THE INHERITORS READ
- The bank v3 "Townsfolk at Vysokoin keep their savings at the bank ..." (w5-city-under_siege-104); v4 "A trader wanting credit at
  Qal'atpatan must satisfy the bank ..." (w5-metropolis-under_siege-1; w5-metropolis-under_siege+famine-103 Silbergasse).
- POSTURE established v7 "X had several trades selling outward before the siege, and none of them can reach a buyer now." in
  w5-hamlet-under_siege+famine-2 Erdenbash (the smallest), w5-town-under_siege+famine-2 Izammul, w5-metropolis-under_siege+famine-1
  Tarkhannuur (the largest).
- fullyExploited v5 "With the siege on, none of X's {resource} can go out to buyers; whatever the town works, the town must use."
  in w5-hamlet-under_siege-102 Al-chowk (grain), w5-village-under_siege-104 Chrissopolis (grain), w5-city-under_siege-6 Chrissoousa
  (fish).

## THE REGISTERS NAMED STALE (not re-taken)
- The shift register (`docs/content/prose-shift-register.json`): fba284bcf's new line moves its variant-count pins (2950 -> 2951, the
  per-pool count, face and vid hashes): SEAM car 4's two tests ("recomputes every pin", "MUTANT") red from fba284bcf on.
- The byte baseline (proseCorpusBytes "RAW is EXACT") and the wiring census (proseWiringCensus "car 0", "THE DRY READ";
  wiringCensusDeclared "four columns"): stale before this seat, moved again.

## FOR THE JOIN
- Count pins re-keyed by this branch's one new line (2950 -> 2951 in composeStateProse, proseComposed, proseWiringCensus x3 and its
  histogram; 3418 -> 3419, 2713 -> 2714 x2 in proseEntryContradiction): the corpus lane, the join lanes and r2-code-a/b hold newer
  copies of proseComposed and proseWiringCensus with the same figures at these lines; a twin the corpus lane adds meets this one at
  the same line: re-measure on the joined tree and re-key once, with both causes.
- SEEN on the read pages, another block's line, not this seat's: "A shipment they weren't expecting arrived and is now in their
  warehouse." (a person's hook) prints in besieged towns (w5-metropolis-under_siege+famine-103, bar0-city-under_siege+famine-rand-1,
  w5-city-under_siege-6).

## What is left (line by line, the brief's order)
1. The sweep's batch: DS-GEN-13 LANDED (fba284bcf); DS-ECO-10 and DS-ECO-11 next (measured, read; their guards to write).
2. The bar's rows: #275 entrepot (DS-ECO-10), #168 halls (DS-ECO-8 PROSPEROUS), #12 abandonment (DS-ECO-11 RESOURCE CONDITION),
   #114 merchant guild where only a merchant oligarchy stands (DS-GEN-13 COMMERCE), #116 timber (find its pool). #39 is in the batch.
3. The reader's rows still false; the slash label; the hand-back-13 list.

## The rulings this seat worked to
BRIEF-W2-WRITE-SIDE-14 whole; copied: A TWIN TAKES ITS SIBLINGS' CONDITION, OR IS TRUE WITHOUT IT AND IS SAID SO. A RE-GATE READS THE
LINE THAT INHERITS ITS TOWNS. NO CEILING IS RAISED, AND A FALSE LINE IS NOT PARKED BEHIND ONE: a state a declaration would leave MUTE
is answered by A TWIN TRUE IN THAT STATE. BATCH NOTHING AT THE PUSH: MEASURE as a batch, LAND POOL BY POOL. A REGISTER THAT A DOOR
NEEDS IN ORDER TO OPEN IS RE-TAKEN THROUGH ITS OWN DOOR, in its own commit; every other register stays NAMED to the close. UNDER A
SIEGE NOTHING COMES IN OR GOES OUT BY ROAD, GATE OR WATER; UNDER A FAMINE NO LINE OFFERS THE FOOD THAT FAILED; A LINE THAT PRINTS
CLIPPED SAYS ITS CRISIS BEFORE THE CLIP.
THIS SEAT'S CALL (vetoable): a sweep row whose pool PRINTS NOWHERE is read and NAMED, not declared: its line and its inheritor
cannot be read where they print, and a declaration there moves no sentence a reader sees.
