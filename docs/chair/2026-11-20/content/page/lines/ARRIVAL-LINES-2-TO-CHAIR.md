# ARRIVAL-LINES-2: the landmark tranche, each new line beside a line of its pool (PAGE-8's drafting seat, written 2026-11-20 19:28 UTC by `date -u`)

> **THE CHAIR'S READ (20:02): 31 OF 32 APPROVED**, with three cures and one strike, marked in place below. Built in
> `src/data/arrivalLandmarkWordings.js` (ARRIVAL-LINES-2-BUILD), keyed by branch, each row by its id (`<branch>/+k`, k =
> NEW [k] below). There every cathedral row also declares `church` (the presumed-things walker's atom for the word
> "cathedral"; the faith reading's `hasChurch`, true wherever a cathedral stands), and the two "streets" rows (great
> cathedral [9], cathedral [2]) declare `tier: ≥ village` (the size class). **28 are in the file; three are HELD for the
> chair's word**, a walker reddening their approved words: citadel [3] ("rather than": the style law; proposed "...
> plainly built to be held, not admired."), citadel [7] ("The road in": the presumption classes' arrival from outside;
> proposed "The road passes beneath the citadel, close enough to see how thick its foundations are."), great cathedral
> [16] ("from far off", the same class; proposed "... built to be seen from a long way off, and it is."). **NOT WIRED:**
> the arrival site knows the drawn line only by its text (`checkInstCompat` returns `textOf` of its row), so naming its
> branch and index there is stopped for the chair's ruling (its word of 20:50).

For the chair's eye before any builder is cut. Nothing under `src/` or `tests/` was written. The measure is
`measures/page-8/arrival2/measure.mjs` (forge once, cache, read the cache; the projection below parses THIS file's lines).
900 places: the chair's recipe (`hxd-${size}-${i}`, `DEFAULT_CONFIG` untouched), 150 a size, forged at a614d7664 (L2 and S9 merged).

## 1. THE MEASURE (before)

**The surface, by symbol.** `src/generators/narrative/arrivalScene.js :: composeArrivalScene` -> `narrativeGenerator.js ::
generateArrivalScene` -> `steps/assembleSettlement.js:254` (`settlement.arrivalScene = inAssemblySubstream(rng, 'arrival-scene', ...)`)
-> printed whole by `components/new/tabs/OverviewTab.jsx:341-347` (`data-testid="overview-place-arrival"`, `{r.arrivalScene}`),
and by `SummaryTab.jsx` and the PDF. Present on 900/900; 4.70 sentences a paragraph; 3,662 beats matched to a pool line, 0 places
with unattributed residue (every printed sentence is a known pool line).

**The bar.** Three places of one size (every triple of distinct places, exact over C(150,3)): the chance that at least two print
one sentence. MASKED reads each place's own name as one token (the honest reading: "The market at A..." and "The market at B..."
are one sentence to a reader); STRICT is verbatim. Masked binds below; strict is beside it.

| size | strict | MASKED | scene | vignette | LANDMARK | built detail | senses | people | tension | memory |
|---|---|---|---|---|---|---|---|---|---|---|
| thorp | 16.3% | 20.8% | 5.3% | 1.2% | - | 3.1% | 8.4% | 4.1% | 1.2% | 0.1% |
| hamlet | 18.7% | 22.3% | 4.7% | 1.5% | - | 3.8% | 8.3% | 4.6% | 1.3% | 1.1% |
| village | 15.8% | 19.7% | 4.4% | 1.2% | - | 5.3% | 4.7% | 4.4% | 2.1% | 0.5% |
| town | 29.3% | 33.3% | 5.2% | 0.3% | **20.9%** | 0.4% | 6.1% | 3.4% | 1.2% | 0.8% |
| city | 38.2% | 40.9% | 4.7% | 0.2% | **27.1%** | 0.0% | 6.6% | 4.0% | 7.8% | 0.2% |
| metropolis | 57.9% | 59.6% | 4.0% | 0.5% | **51.6%** | 0.0% | 7.7% | 3.9% | 7.6% | 0.7% |

(each beat column: that beat's sentences alone.)

**By pool.** THREE pools are over the bar on their own, all three of them landmarks, and no other pool or beat is: LANDMARK great
cathedral (metropolis: 100 of 150 print it, 2 lines, 51.6%), LANDMARK wall / gatehouse (town: 60, 2 lines, 20.6%; city 6.1%),
LANDMARK massive wall / citadel (city: 56, 2 lines, 18.1%). The next pools: ARRIVAL_TENSIONS.prosperous metropolis 7.6% (9
lines), ARRIVAL_SENSES.livestock.lines hamlet 4.7%, ARRIVAL_SCENES.ordinary thorp 3.9%; every other pool at or under 2.9% in every size.

**The sentences that carry it** (places of 150 printing it): metropolis "The great cathedral's spire is the tallest thing for
miles." 50, "A cathedral dominates the skyline. ..." 50; city "The citadel on the high ground makes clear ..." 31, "The walls are
serious. ..." 25, "A wall circuit, unremarkable but intact." 18, "The cathedral bell tower is the first thing visible ..." 14;
town "A wall circuit, unremarkable but intact." 33, "The gatehouse arch frames the main road." 27. Below the landmarks the
commonest sentence of any size is printed by 11 places of 150 (thorp to village: livestock, fish, ordinary scene, built-detail
twins; town to metropolis: the faith bells, prosperous doorsteps, the ordinary scene's merchant and carter).

**What each would need** (the measure's model, section 7: appending k lines spreads the pool's draws as `n/(n+k)`): great
cathedral +10 to come under 10% (+14 under 7%); wall / gatehouse +3 (+5); massive wall / citadel +2 (+4). The landmark beat of a
city carries three branches at once (citadel, walls, cathedral), so the city's cathedral takes three as well.

## 2. THE LANDMARK BEAT, AS FOUND

`src/generators/structuralValidator.js:270 :: checkInstCompat(institutions, tier)`, called once from `arrivalScene.js:316`
(`sight = checkInstCompat(...)`, only when no stress vignette opens the paragraph; a line naming a market or a catch the place
lacks is dropped at :317, and the culture's built detail stands in). Eight branches, FIRST MATCH WINS, each a substring test
(`has`) over the NATIVE institution names, lowercased: great cathedral; cathedral (not thorp or hamlet); massive wall or citadel;
wall or gatehouse, not massive; wizard or mage with a tower; major port; palace or royal seat; university or academy of magic.
Each branch holds TWO lines, chosen by ONE `pickRandom` on the arrival substream. Declarations are carried (`walls`, `gate`,
`navigable`, `crisis: under_siege`, `crisis: succession`) but read only through `textOf`: nothing refuses them. On the 900:
thorp, hamlet and village never reach a branch; towns reach wall / gatehouse (80 places, 60 printed) and citadel (15, 8);
cities reach cathedral (26, 21), citadel (77, 56) and wall / gatehouse (47, 32); metropolises reach the great cathedral (145,
100). The houses seen: `great cathedral`, `cathedral (10,000+ only)`, `citadel`, `massive walls and fortifications`, `city walls
and gates`, `town walls`, `gates (if walled)`, `wizard's tower` (1 town, never printed); no `major port`, palace or university
branch is ever reached (the great cathedral wins first). **Found, not cured here:** 57 printed landmark lines name a house more
particular than the roster's: 27 towns print "The gatehouse arch frames the main road." with `town walls` and no gate-named
house (the `gate` atom holds: the defence fact gives walls a gate), and 30 cities print "The walls are serious. High stone ..."
(the massive walls) where the roster holds `city walls and gates` and a citadel. No printed landmark line is refused by its own
declaration.

**The wiring these lines are written for** (the brief's; for the builder, not done here): the `pickRandom` stays exactly as it
is (no draw added, removed or moved). The drawn line is then SAID in one of `[drawn line, ...the branch's new wordings whose
house stands and whose declaration admits]`, chosen by `pickVariantMixed` (`src/kernel/proseHash.js` at bd42d63c7,
`lane/kernel-mix-2026-11-20`) keyed on the arrival substream's seed and the beat (`${seed}::landmark`). The new wordings live in
their own new data file, one row each: `{ text, house, needs?, excludes? }`. `house` is the native-name fragment the branch's
own `has` already reads (a substring of a native name, so no new vocabulary atom: the vocabulary has no cathedral, citadel or
walls-house atom); `needs` / `excludes` are existing atoms only (`walls`, `gate`, `crisis: under_siege`). ONE call line at
`arrivalScene.js:316` wraps the return. MOVES: only `arrivalScene`, and only in a town, city or metropolis that prints a landmark.

## 3. THE LINES (32, in the four landmark branches the bar needs)

Each NEW line sits beside the existing line of its branch it shares a slot with (new k beside base k mod 2). After each line:
its `house` (the native-name fragment that must stand) and its declarations, in the atoms its siblings use. Every house listed
is checked against `src/domain/people/cardVeil.js :: isHideableHouse` on its catalogue row: none is hideable. No line names a
climate, season, species, crime, event or person; no digit, em dash or exclamation mark; "the settlement", as the siblings say it.

## LANDMARK great cathedral (checkInstCompat's first branch, `has('great cathedral')`: 2 lines at the base, +15; every new line's house: "great cathedral")
1. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [2]: The great cathedral is in sight long before anything else of the settlement is, and it stays in sight the whole way in.**  _(house: ["great cathedral"])_
2. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [3]: The roofs of the settlement gather around the great cathedral the way a crowd gathers around a speaker.**  _(house: ["great cathedral"])_
3. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [4]: Carved figures line the front of the great cathedral, row above row.**  _(house: ["great cathedral"])_  [CURED by the chair, 20:02: ends at "row above row"; was "..., worn to the same grey" (an age)]
4. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [5]: Wherever the road bends, the great cathedral is somewhere above the rooftops ahead.**  _(house: ["great cathedral"])_
5. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [6]: The great cathedral's doors stand taller than any house in the settlement.**  _(house: ["great cathedral"])_
6. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [7]: Buttresses march along the great cathedral's flanks, each one thicker than a cottage.**  _(house: ["great cathedral"])_
7. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [8]: The great cathedral seems less a building than a second settlement, raised in stone above the first.**  _(house: ["great cathedral"])_
8. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [9]: The streets all seem to lean toward the great cathedral, as if it were the reason they were laid down.**  _(house: ["great cathedral"])_
9. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   ~~NEW [10]: The great cathedral's bells are the loudest thing in the settlement, and they carry far out along the road.~~  [STRUCK by the chair, 20:02: the senses beat already rings the faith's bells in the same paragraph]
10. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [11]: Coloured glass glints in the great cathedral's windows from a long way down the road.**  _(house: ["great cathedral"])_
11. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [12]: The great cathedral's long roof rides above every other roof in the settlement.**  _(house: ["great cathedral"])_
12. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [13]: The great cathedral's size is hard to judge from the road, because nothing near it is large enough to measure it by.**  _(house: ["great cathedral"])_
13. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [14]: Towers flank the front of the great cathedral, and the whole skyline of the settlement is built around them.**  _(house: ["great cathedral"])_
14. EXISTING [1]: A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.
   **NEW [15]: The great cathedral stands at the heart of the settlement, and every lane seems to know the way to it.**  _(house: ["great cathedral"])_
15. EXISTING [0]: The great cathedral's spire is the tallest thing for miles.
   **NEW [16]: The great cathedral was plainly built to be seen from far off, and it is.**  _(house: ["great cathedral"])_

## LANDMARK cathedral (the second branch, `has('cathedral')` outside a thorp or hamlet: 2 lines at the base, +3; house: "cathedral")
1. EXISTING [0]: A stone cathedral anchors the high ground.
   **NEW [2]: The cathedral's tower stands over the roofs, and the streets seem to bend toward it.**  _(house: ["cathedral"])_
2. EXISTING [1]: The cathedral bell tower is the first thing visible from this direction.
   **NEW [3]: A cathedral of plain, heavy stone rises out of the middle of the settlement.**  _(house: ["cathedral"])_
3. EXISTING [0]: A stone cathedral anchors the high ground.
   **NEW [4]: The cathedral rises well above the houses around it, which keep a respectful distance.**  _(house: ["cathedral"])_  [CURED by the chair, 20:02: was "The cathedral is the largest building in sight, and the houses around it keep a respectful distance." (a citadel may stand)]

## LANDMARK massive wall / citadel (the third branch, `has('massive wall', 'citadel')`: 2 lines at the base, +6; houses: "citadel" (4), "walls" (2))
1. EXISTING [0]: The walls are serious. High stone, maintained, with watchtowers spaced to cover every angle.  _(needs: ["walls"])_
   **NEW [2]: The walls run on as far as the eye can follow, with towers set into them at steady intervals.**  _(house: ["walls"]; needs: ["walls"])_
2. EXISTING [1]: The citadel on the high ground makes clear that this settlement has been defended before and expects to be again.
   **NEW [3]: The citadel stands a little apart from the houses, plainly built to be held rather than admired.**  _(house: ["citadel"])_
3. EXISTING [0]: The walls are serious. High stone, maintained, with watchtowers spaced to cover every angle.  _(needs: ["walls"])_
   **NEW [4]: The walls stand higher than the houses behind them, so that from the road you see stone first and roofs only afterward.**  _(house: ["walls"]; needs: ["walls"])_
4. EXISTING [1]: The citadel on the high ground makes clear that this settlement has been defended before and expects to be again.
   **NEW [5]: The citadel's keep is the tallest thing in sight, and it has very few windows.**  _(house: ["citadel"])_
5. EXISTING [0]: The walls are serious. High stone, maintained, with watchtowers spaced to cover every angle.  _(needs: ["walls"])_
   **NEW [6]: Banners hang from the citadel's towers, the first colour you see on the approach.**  _(house: ["citadel"])_
6. EXISTING [1]: The citadel on the high ground makes clear that this settlement has been defended before and expects to be again.
   **NEW [7]: The road in passes beneath the citadel, close enough to see how thick its foundations are.**  _(house: ["citadel"])_

## LANDMARK wall / gatehouse (the fourth branch, `has('wall', 'gatehouse') && !has('massive')`: 2 lines at the base, +8; houses: "walls" (5), "gates" (3))
1. EXISTING [0]: A wall circuit, unremarkable but intact.  _(needs: ["walls"]; excludes: ["crisis: under_siege"])_
   **NEW [2]: A plain wall runs round the settlement, no higher than it needs to be.**  _(house: ["walls"]; needs: ["walls"])_
2. EXISTING [1]: The gatehouse arch frames the main road.  _(needs: ["gate"])_
   **NEW [3]: The road narrows to pass through the gate, and carts take their turn.**  _(house: ["gates"]; needs: ["gate"]; excludes: ["crisis: under_siege"])_  [CURED by the chair, 20:02: the excludes added]
3. EXISTING [0]: A wall circuit, unremarkable but intact.  _(needs: ["walls"]; excludes: ["crisis: under_siege"])_
   **NEW [4]: The wall is the first thing you reach on the road in, and the houses begin just inside it.**  _(house: ["walls"]; needs: ["walls"])_
4. EXISTING [1]: The gatehouse arch frames the main road.  _(needs: ["gate"])_
   **NEW [5]: The gate stands open, its heavy doors folded back against the wall.**  _(house: ["gates"]; needs: ["gate", "walls"]; excludes: ["crisis: under_siege"])_
5. EXISTING [0]: A wall circuit, unremarkable but intact.  _(needs: ["walls"]; excludes: ["crisis: under_siege"])_
   **NEW [6]: Houses lean against the inside of the wall here and there, using it as their back.**  _(house: ["walls"]; needs: ["walls"])_
6. EXISTING [1]: The gatehouse arch frames the main road.  _(needs: ["gate"])_
   **NEW [7]: The gate's arch is deep enough that the road goes dim for a few steps before the settlement opens out.**  _(house: ["gates"]; needs: ["gate"])_
7. EXISTING [0]: A wall circuit, unremarkable but intact.  _(needs: ["walls"]; excludes: ["crisis: under_siege"])_
   **NEW [8]: A wall encloses the settlement, mended where it needed mending and otherwise left alone.**  _(house: ["walls"]; needs: ["walls"]; excludes: ["crisis: under_siege"])_
8. EXISTING [1]: The gatehouse arch frames the main road.  _(needs: ["gate"])_
   **NEW [9]: From the last stretch of road the wall is all you see of the settlement, a long line with roofs showing above it.**  _(house: ["walls"]; needs: ["walls"])_

**The words each law wants, line by line.** Every line names its own house by its word (great cathedral, cathedral, citadel,
wall, gate), so it is said from the house that stands and never from a neighbour's. The wall lines need `walls` and the gate
lines `gate`, as the siblings do; the two that say the place is calm and kept ("the gate stands open", "mended where it needed
mending") exclude `crisis: under_siege`, as "unremarkable but intact" does. The gate lines are said only where a gate-named house
stands (`gates (if walled)`, `city walls and gates`), not on the 27 towns whose gate is only the defence fact's. The citadel
lines say nothing of high ground, of a past defence or of an enemy. Nothing in the great cathedral's fifteen presumes a faith's
particulars (no saint, no pilgrim, no rite): carved figures, bells, glass, doors, towers, buttresses, a roof.

## 4. PROJECTED SHARE AFTER (the measure's section 6, reading this file)

The landmark draw is unchanged; the keyed wording is projected with the measure's own key (`${seed}::landmark`; the real key is
the arrival substream's seed) and, beside it, over 20 other keys (mean [min-max]). Every other beat is untouched, so its column
does not move.

| size | MASKED before | MASKED after | strict before -> after | LANDMARK beat before -> after (20 keys) |
|---|---|---|---|---|
| thorp | 20.8% | 20.8% | 16.3% -> 16.3% | - |
| hamlet | 22.3% | 22.3% | 18.7% -> 18.7% | - |
| village | 19.7% | 19.7% | 15.8% -> 15.8% | - |
| town | 33.3% | 22.1% (20 keys: 21.7% [21.1-22.3]) | 29.3% -> 17.3% | 20.9% -> 7.2% (6.7% [5.8-7.6]) |
| city | 40.9% | 27.6% (27.1% [26.4-28.0]) | 38.2% -> 23.9% | 27.1% -> 8.3% (7.9% [7.0-9.1]) |
| metropolis | 59.6% | 28.9% (27.7% [27.1-28.3]) | 57.9% -> 24.9% | 51.6% -> 9.4% (7.8% [7.2-8.5]) |

Each drafted pool alone after (worst size): great cathedral 9.4%, wall / gatehouse 7.1%, massive wall / citadel 5.7%, cathedral
1.4%. **After these 32 lines every pool and every beat of every size is under the bar. The whole paragraph is not:** 20-28% in
every size, because five beats each carry 1-8% and they add. The measure's model (section 7(c)) prices the whole bar, every size
under 10% with the landmarks held at these counts, at about 255 more lines across some 45 pools, led by ARRIVAL_TENSIONS.prosperous
+36, ARRIVAL_SCENES.ordinary +18, ARRIVAL_TENSIONS.unsafe +14, the arcane, cloth, smiths, livestock and faith senses +11 to +14
each, river +10, and three to seven in each of eleven cultures' people. That is a ruling for the chair, not a drafting call: these 32 are
what the bar by pool and by beat needs.
