# DAILY-1 · L1b — LINES-1b: the chair's ruling of 18:37 UTC applied (changed and new lines only; written 2026-11-20T18:43Z by `date -u`)

Probe `probe.1b.mjs` (probe.1.mjs plus the ruling; 900 fresh births, M1's recipe; exit 0; `probe.1b.out.txt`). LINES-1.md is unchanged; every line not listed here stands as written there.

| row | thorp | hamlet | village | town | city | metropolis |
|---|---:|---:|---:|---:|---:|---:|
| top % dawn / gather / child | 9/11/7 | 7/7/4 | 7/12/3 | 9/8/5 | 9/8/12 | 13/9/13 |
| dawn reach % defence / default / food / merchant | 64/29/6/1 | 47/46/5/2 | 46/41/1/11 | 17/53/3/27 | 0/77/12/11 | 0/80/19/1 |
| child reach % unrest / economic / monster / none | 28/47/66/8 | 35/59/53/11 | 63/56/44/4 | 81/1/67/3 | 7/0/67/29 | 7/0/68/27 |
| eligible min, all places: dawn default / child none / gather plain | 7/7/9 | 8/7/10 | — | — | — | — |
| branch cells below reach/0.15 / false lines, M1's every test / my word tests / a rule-3 line not small | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 |

## 1. THE TESTS NAMED
- DEFENCE BRANCH: the defence band is critical or collapsed, AND `threatProfile.js :: deriveAllThreatProfiles` holds a threat of kind `siege`, `monster_pressure`, `bandit_raids` or `rival_neighbor` at `severityBand` medium or above (`threatSeverityBand`: severity >= 0.25). Taken at thorp 96, hamlet 71, village 69, town 25 places of 150; it was 141/121/122/63 on the rating alone. At thorp to town the kinds held are `monster_pressure` (medium or critical: frontier 0.45, overrun 0.85) and a few `siege` (medium). Every one is at medium or above. Without one, a place falls through to craft, merchant, then default.
- UNREST (`trouble`): the record holds a live trouble. Either `record.conflicts` is not empty (its live conflicts between powers), or a `history.currentTensions[].type` (the field `facts/uprising.js` reads) is one of popular_uprising, succession_crisis, legitimacy_crisis, leadership_vacuum, tyranny, population_friction, disputed_land, religious_tension, guild_conflict, generational_divide, economic_disparity, heresy_trial. An unrest threat that does not come from the `defenseProfile` rating also counts (today only "Leadership void", a condition). crime_wave, corruption_scandal and infiltration_fear are left out (rule 6). Skipped as a rating alone: 105/96/53/14/0/0.
- ECONOMIC COLLAPSE (`econStress`): `factsOf(r).prosperity` is poor or struggling, or an `economic_collapse` threat does not come from the rating, or a tension is trade_collapse, market_crash, outside_debt or resource_scarcity. Skipped: 54/37/17/2/0/0.
- `corruption` and `cult` are no longer pools: they fall to `default` (D0). A place whose every kind is skipped takes `none` (thorp 12, hamlet 16 places).
- SMALL (`small`, ruling 3): `factsOf(r).tier` is thorp, hamlet or village. `notSmall` ("crowds", "streets") stays `populationBand !== 'small'`. Reading it from the population band left a populous village with one default row.

## 2. CHANGED LINES
- F6 needs [farming, small]. B7 needs [water, small]. B10 needs [farming, small]. B13 needs [common, small]. N17 needs [sacred, farming, small]. N23 needs [inn, farming, small]. P5 needs [water, farming, small]. P8 needs [farming, small].
- B9 [livestockSource, small]: "The beasts are seen to first, before the rest of the day begins."
- N0 [church, market, inn]: "By midday people are gathered on the steps of {church}, at {market} and at {inn}: talking, trading, and watching."
- child siege S0 [sacred]: "staying close when the bells ring"
- child rival N0 [neighbour]: "anything bearing the colours of the neighbour"
- CUT: N26, N27, P12 (wellLandmark not granted). Also cut: the `corruption` (K0, K1) and `cult` (Q0, Q1) pools.

## 3. NEW LINES
dawn_work `default`, the calm small place:
- B18 [farming, small] "The first light goes to walking the fields to see how they stand, and then the day's work begins." (W6, calm)
- B19 [elder] "People stop at the elder's door at first light, and the day's work is talked over there." (W11, calm)
- B20 [livestockSource, small] "The beasts are let out at first light, and the day's other work begins after." (W13, calm)
- B21 [dwellings, small] "The households are up at first light, and the day's work starts close to home."
- B22 [dwellings, small] "Fires are lit and the households fed before anyone goes out to the day's work."
- B23 [water, small] "The first water of the day is fetched at first light, before anything else is done."
- B24 [farming, small] "The day begins with the walk out to the fields, and the work there runs on until midday."
- B25 [timber, small] "Some go out at first light to cut and carry wood, and the rest turn to the day's other work."
- B26 [landing] "The boats go out from the landing at first light, and the catch decides the rest of the day."

child_warnings `none`, the usual things of a small place:
- X8 [water, dwellings, small] "Children are warned about the usual things: going down to the water alone, and wandering out of sight of the houses."
- X9 [farming, small] "Children are warned about the usual things: trampling the young crops, and straying past the last of the fields."
- X10 [livestockSource] "Children are warned about the usual things: getting under the feet of the beasts, and letting any of them stray."
- X11 [timber] "Children are warned about the usual things: going into the woods alone, and being out after dark."
- X12 [route] "Children are warned about the usual things: the road and the strangers on it, and being home before dark."
- X13 [landing] "Children are warned about the usual things: the boats and the water's edge, and being home before dark."
- X14 [dwellings, small] "Children are warned about the usual things: straying out of call of the houses, and playing with fire."
- X15 [water, farming, small] "Children are warned about the usual things: the water's edge, the far fields, and being home before dark."
- X16 [] "Children are warned about the usual things: talking to strangers, and getting under the grown-ups' feet at work."
- X17 [water] "Children are warned about the usual things: leaning over the water to look in, and straying far from home."

## 4. NOTES
- Eligible rows at a thorp and a hamlet, for every branch, as if each place took it (min/median over all 150): defence 7/9 and 7/9; default 7/9 and 8/11; none 7/9 and 7/10; plain 9/11 and 10/11; unrest 7/7 and 7/7; economic 6/6 and 6/7; monster 5/6 and 5/6. The full list is section 2b of the out file.
- The atoms are granted: waterSource, dwellings, farmland, commonGrazing, bridge, square, bakery, warehouse, theatre, fishingLanding, rootCellar, shepherd, craftGuild. The probe still reads them by the same name tests (NEED_DOC), as the built rows of `INSTITUTION_KIND_PATTERNS` will.
- The 900 fresh births gave the same numbers as the scratch dump of the same seeds. The siege count ("three times") is gone, so my word tests are 0 everywhere.

CONFIRMED (executed): every number above. PLAUSIBLE: that the tension-type sets are the right reading of "a live trouble" and "a real economic stress"; that the new lines read well aloud.
