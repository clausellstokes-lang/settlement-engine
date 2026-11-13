# UPKEEP-CAPACITY: a house's scale in the defence rating. The measure and the proposal

Seat: UPKEEP-CAPACITY, measure only. Nothing in `src/` is committed. Measured at **0a07f98c7** (`lane/coherence-upkeep-2026-11-12`, read back from origin at 0a07f98c7 when the seat started; this branch was cut from it). Probes, outputs and the gzipped corpus are in `docs/chair/2026-11-13/probes/UPKEEP-CAPACITY/`.

**The owner (2026-11-13):** "Also I want to add to defense, tier or size/capacity should also be calculated for defense. A single alchemist should not have the same influence as an alchemist district if that makes sense."

**The chair's reading, which this measure works to:** a house's influence on defence follows its scale, meaning its rung on its own family's ladder, read from the catalogue's one home. Each part's points are its weight times its house's scale factor, and the factor is a row of the tuning table, as the wall's kind already is.

## 0. Outcome first

- **THE MEASURE THAT COULD REFUTE THE BRIEF.** On the 3,756 births, every house on a multi-rung ladder sits on the rung its ladder writes at the place's own tier. No city holds an alchemist's shop and no town holds a quarter (0 and 0). No birth holds two rungs of one ladder, because the ladder's normaliser removes the lesser. So **the house's scale is the place's tier, part by part.** The owner's "a single alchemist" against "an alchemist district" is, in practice, a town against a city.
- The variant that reads a house's scale **against the place's tier** (R) therefore moves **0 of 3,756** births. It would also leave a town's shop and a city's quarter equal, which the owner's words rule out. **Recommended: the house's scale alone.**
- **Recommended table: anchor B.** The middle rung keeps today's points; the factor runs from 0.8 at the least rung to 1.2 at the greatest, in equal steps along each ladder, and a one-rung ladder stays at 1.
  - The move under B: 2,674 of 3,756 births move (1,297 up, 1,377 down). The mean move is +0.42 over all births, with extremes of −9 and +9. Bands change in 335 births. By tier: thorp −0.35, hamlet −0.54, village −0.47, town −2.43, city +2.63, metropolis +3.96.
  - Anchor A, for comparison: 2,093 births move, every one of them down. The mean is −2.04 and the low is −20; bands change in 498 births. The move falls almost wholly on towns: −7.19 on average, and 350 of 752 towns drop a band. No metropolis moves.
- **The one thing the chair must rule:** the anchor, A or B. Everything else in the proposal follows from the measure.

## 1. The census of scale (step 1)

`census.mjs` puts every catalogue name, at every tier it is offered, alone on a roster. It then asks the code's own openers which part that name opens: `getInstFlags`, `defenseTraditionNamesOf`, `defenseFactsOf` and the market home. No keyword is re-spelled. Ruling E is applied (the shop and the quarter leave arcane). `chains.mjs` reads each part's ladder from `institutionLadders.js :: UPGRADE_CHAINS` (the family pairs unioned with the authored cross-family pairs), restricted to the names that open the part.

The full lists are in `census.txt` (each name with its family and its family rung) and `ladders.txt` (each part's ladders). In the table below, the tiers each rung is written at are given in brackets, and "one rung" means that house has no lesser or greater on any ladder.

| Part | Ladder(s) (rung order) | Notes |
|---|---|---|
| walls | Palisade [thorp] → Palisade or earthworks [hamlet, village] → Town walls [town] → City walls and gates [city] → Massive walls and fortifications [metropolis]. Citadel and Gates (if walled) are one rung each | Already counted by its kind (`wallKind`: the two palisade rungs 0.6, the three stone rungs 1) |
| garrison | Barracks [town] → Garrison [city] → Multiple garrisons [metropolis]. Professional city watch: one rung on this part (it is the watch ladder's top) | Professional city watch opens BOTH garrison and watch, and it stands in every city and metropolis (752 of 752, 552 of 552). One house, two parts: a count-once question for the chair, not repaired here |
| militia | Citizen militia [hamlet, village]: one rung | **GAP:** the family's rung 1, "Household levy" (thorp), does NOT open the militia part. `getInstFlags.hasMilitia` reads only 'citizen militia' and 'militia', while the defence bucket and `defenseFactsOf` both count the levy. Named, not repaired, and no rung invented |
| watch | Village watch [village] → Town watch [town] → Professional city watch [city, metropolis] | The Village watch to Town watch pair is the authored cross-family pair (F1) |
| court | Courthouse → Multiple courthouses → Multiple court buildings; Town hall → City hall. Democratic assembly: one rung | |
| prison | Small prison/stocks → Large prison → Massive prison | |
| wardens | Warden's Lodge [town]: one rung | |
| company | Free company hall [town] → Mercenary quarter [city, metropolis] | |
| charter | Adventurers' charter hall [hamlet to town] → Multiple adventurers' guilds [city, metropolis]. Hireling hall: one rung | |
| arcane | Traveling hedge wizard → Hedge wizard → Wizard's tower → Mages' guild → Mages' district. Academy of magic, Enchanter's shop and Scroll scribe: one rung each | **Already counted by rung:** the part's military adds `tower` +5 and `guild` +8. The magic presence also weights houses by sophistication class (folk 5, practitioner 10, institutional 18, advanced 28). Given no factor here: one would count the rung twice |
| clergy | Access to parish church [thorp, hamlet] → Parish church → Parish churches (2-5) → (10-30) → (50-100+); Cathedral → Great cathedral. Monastery or friary: one rung | "Access to parish church" is a fabric row (the walk to another place's church), yet it opens clergy and parish in 938 thorps and hamlets. Noted for the chair, not repaired |
| druids | Druid Circle [village]: one rung. Elder Grove Council [town+]: one rung | **GAP:** the catalogue pairs neither with the other, so no rung is invented |
| market | Periodic → Weekly → Daily markets → District markets (5-10); Market square → Multiple market squares; Annual fair → Major annual fairs; Merchant guilds (3-8) → (15-40) → (50-100+). One rung each: Fish market, Furrier's district, International trade center, Auction house, Caravaneer's post, Carriers' guild, Cobbler's guild, Tailor's guild | A part reads the greatest factor among its houses present. Under A, any one-rung market house holds the part at today's points |
| hospital | Small hospital → Major hospital → Hospital network; Monastery or friary → Multiple monasteries → Major monasteries (5-10). Healer (divine, 1st level): one rung | |
| alchemists | Alchemist shop [town] → Alchemist quarter [city, metropolis]. Apothecary district: one rung on this part | The Apothecary district is rung 3 of 3 on its own family's ladder, but Apothecary and Apothecary (established) do not open this part. The ladder restricted to the part's own openers is the one used here |
| community (households, parish, elders, close) | (tier rows) | Not scaled: the brief names the community rows as a size reading of the place |
| crisis reliefs (hasArcane, ArcaneGuild, Teleport, Divine, DivineStrong, Druid, Alchemy) | Same houses as their parts | Read as presence in every candidate. A crisis acts once, and a relief is a rule of the crisis table. Scaling the reliefs is NOT proposed |
| stores | read from the food record's months, not from a house | No factor (the granary ladder runs Town granary → City granaries → State granary complex) |

Count ranges carried by a name: Parish churches (2-5), (10-30), (50-100+); Merchant guilds (3-8), (15-40), (50-100+); District markets (5-10); Major monasteries (5-10). Each lies on a ladder already, so the range adds no rung of its own.

## 2. The corpus (step 2)

The corpus is the sixth seat's 3,756 births (the fifth seat's 3,036 plus the sixth seat's 720 fresh6), born as in `alch6.mjs`, with ruling E on. It holds 540 thorps, 540 hamlets, 620 villages, 752 towns, 752 cities and 552 metropolises. Below, the births holding each rung, by the place's tier (thorp / hamlet / village / town / city / metropolis); the complete table is in `measure.txt`.

- **alchemists:** shop 0/0/0/**108**/0/0 · quarter 0/0/0/0/**413**/**112** · Apothecary district 0/0/0/0/625/549. **No city with a shop and no town with a quarter.**
- **garrison:** Barracks 182 towns · Garrison 752 cities · Multiple garrisons 552 metropolises · Professional city watch 752 cities and 552 metropolises.
- **watch:** Village watch 37 villages · Town watch 752 towns · Professional city watch 752 cities and 552 metropolises.
- **court:** Courthouse 304, Multiple courthouses 752, Multiple court buildings 552; Town hall 752 towns, City hall 752 cities and 552 metropolises.
- **prison:** Small prison/stocks 150 towns, Large prison 487 cities, Massive prison 540 metropolises.
- **hospital:** Small hospital 100, Major hospital 381, Hospital network 451; the monastery ladder 137, 420, 418.
- **clergy:** each parish rung sits on its own tier in every birth (398/540/620/752/752/552). Cathedral 118 cities, Great cathedral 410 metropolises.
- **company:** Free company hall 90 towns, Mercenary quarter 439 cities and 434 metropolises.
- **charter:** hall 62/78/226 (hamlet, village, town), multiple guilds 612 cities and 545 metropolises.
- **walls:** each rung sits on its own tier.
- **Off-tier rungs found:** only Hedge wizard in 3 towns and 36 cities (arcane, given no factor) and Weekly market, which the catalogue itself writes at both village and town.
- **Two rungs of one ladder in one birth:** none, on any part.
- **A part open with no house on its ladder:** none.

## 3. Two candidate tables (step 3)

The steps follow the wall's own: today a palisade counts 0.6 of stone, a spread of 0.4 between the least and the greatest. Each ladder is spread evenly: x = (rung − 1) / (top rung − 1).

- **(A) The greatest rung keeps today's points:** f = 0.6 + 0.4·x.
- **(B) The middle rung keeps today's points:** f = 0.8 + 0.4·x.

Both anchors use the same spread of 0.4 and differ only in where 1 sits. A one-rung ladder is 1 under both. A part reads the greatest factor among its houses present. Walls keep their kind, and arcane takes no factor (section 1). No value was tuned to hit a target.

| Ladder length | A (least … greatest) | B (least … greatest) | Ladders of that length |
|---|---|---|---|
| 2 | 0.6, 1.0 | 0.8, 1.2 | alchemist shop → quarter; free company hall → mercenary quarter; charter hall → guilds; town hall → city hall; cathedral; market square; fair |
| 3 | 0.6, 0.8, 1.0 | 0.8, 1.0, 1.2 | barracks → garrison → garrisons; village → town → city watch; courthouses; prisons; hospitals; monasteries; merchant guilds |
| 4 | 0.6, 0.73, 0.87, 1.0 | 0.8, 0.93, 1.07, 1.2 | the markets (periodic → district) |
| 5 | 0.6 … 1.0 in steps of 0.1 | 0.8 … 1.2 in steps of 0.1 | parish churches |

The measured move on the corpus, with ruling E on in both base and candidate (`measure.txt`):

| | A | B | R (A read against the tier) | AW (A, and the walls by ladder in place of kind) |
|---|---|---|---|---|
| births moved (of 3,756) | 2,093 (all down) | 2,674 (1,297 up, 1,377 down) | **0** | 2,204 (97 up) |
| mean over all births / over movers | −2.04 / −3.65 | +0.42 / +0.59 | 0 | −2.19 / −3.74 |
| extremes | −20 … 0 | −9 … +9 | 0 | −20 … +2 |
| bands changed | 498 | 335 | 0 | 552 |
| fresh6 (unseen): moved / band changed | 367 / 85 | 477 / 61 | 0 | 391 / 91 |
| thorp: mean move (min, max), bands changed | −0.73 (−3, 0), 28 | −0.35 (−2, 0), 10 | 0 | as A |
| hamlet | −1.10 (−5, 0), 47 | −0.54 (−3, 0), 17 | 0 | −0.86, 50 |
| village | −1.17 (−10, 0), 53 | −0.47 (−4, 0), 31 | 0 | −0.94, 48 |
| town | **−7.19 (−20, 0), 350 of 752** | −2.43 (−9, 0), 114 | 0 | −8.17, 402 |
| city | −0.70 (−2, 0), 20 | +2.63 (0, +5), 85 | 0 | −0.86, 24 |
| metropolis | 0, 0 | +3.96 (0, +9), 78 | 0 | 0, 0 |

Band moves under A: Lightly Defended → Vulnerable 184; Defensible → Lightly Defended 142; Vulnerable → Undefended 76; Well-Defended → Defensible 75; Fortress → Well-Defended 19; Lightly Defended → Undefended 2.

Band moves under B: Well-Defended → Fortress 117; Lightly Defended → Vulnerable 58; Defensible → Well-Defended 46; Defensible → Lightly Defended 44; Well-Defended → Defensible 37; Vulnerable → Undefended 28; Fortress → Well-Defended 5.

Why towns carry A's move: they hold rung 1 of 3 on garrison, court, prison and hospital, and rung 1 of 2 on alchemists, company and charter (0.6 each), so nearly every paid part of a town falls at once. Cities sit at or near the top of each ladder, and metropolises sit at the top. Under B the town loses less because its rungs sit at 0.8 to 1.0, and cities and metropolises rise because theirs sit at 1.0 to 1.2.

## 4. The place's own size (step 4)

Share in each band by tier, in percent, in this band order: Undefended / Vulnerable / Lightly Defended / Defensible / Well-Defended / Fortress.

| tier | base | A | B |
|---|---|---|---|
| thorp | 15/57/28/0/0/0 | 16/59/24/0/0/0 | 16/58/26/0/0/0 |
| hamlet | 24/59/17/0/0/0 | 26/63/11/0/0/0 | 24/60/15/0/0/0 |
| village | 33/52/13/1/0/0 | 37/52/10/0/0/0 | 36/51/12/1/0/0 |
| town | 1/15/32/34/17/1 | 5/25/36/25/9/0 | 1/18/34/33/13/0 |
| city | 0/0/1/14/52/34 | 0/0/1/14/53/32 | 0/0/1/9/50/40 |
| metropolis | 0/0/0/2/38/60 | 0/0/0/2/38/60 | 0/0/0/0/28/72 |

(Rounded shares as `measure.txt` prints them; a row may not sum to exactly 100.)

Mean readiness by tier, base → A → B: thorp 19.3 → 18.6 → 19.0; hamlet 17.0 → 15.9 → 16.5; village 15.4 → 14.2 → 15.0; town 39.4 → 32.2 → 37.0; city 69.0 → 68.3 → 71.6; metropolis 77.1 → 77.1 → 81.1.

- **Does a larger place read stronger only because the catalogue gives it larger houses?** Under either anchor, yes. Rung equals tier in every birth (section 2), so the factor is a size reading per part, pulling the other way from the `size` row. The town-to-city gap in mean readiness is 29.6 today, 36.1 under A and 34.6 under B. A widens it by lowering the town; B widens it by raising the city and lowering the town a little.
- **Does a score fill to its top in the largest places?** It already does. Today cities hold 1.60 of their 5 scores at 100 on average, and metropolises 2.22; the military score averages 97 in cities and 98 in metropolises.
  - Under B, cities rise to 1.87 full scores and metropolises to 2.62, and the readiness itself reaches 100 in 1 metropolis. Most of B's rise in the largest places lands in the reserve held above 100. What shows is order (metropolis order 58.9 → 73.1, city order 55.2 → 63.6), and the share of metropolises in Fortress, which rises from 60% to 72%.
  - Under A, no metropolis moves at all.
- **Does the `size` row still do its work?** Yes, under both anchors. It adds +12, +8, +4 and +2 from thorp to town, and stops at the town. Small places lose little: at most 0.6 under B and 1.2 under A on average, because they hold few scaled houses. Without the size row their mean readiness would be 7.0 / 8.5 / 11.0 under B (6.6 / 7.9 / 10.2 under A), so the row stays the larger term for a small place, as it is today. The town's +2 is outweighed by A's −7.2, but not by B's −2.4.
- **ONE RECOMMENDATION: the house's scale alone.** Reading it against the place's tier (R) moves no birth: every house sits on its tier's rung. It would also keep a town's shop equal to a city's quarter, which is the very thing the owner asked to end.

## 5. What would now disagree (step 5)

These sentences say how strong a house's part is, or name a house as a strength. They read the house's presence by name, not the scaled part. This list comes from a read-only search seat. I spot-checked three entries and confirmed them by grep (the Invasion row's "meaningful deterrence", the dossier's "+6 Defensive walls in place.", and the guard assessment's "well paid, well equipped"). The rest are PLAUSIBLE, not each re-verified.

| Writer (`path :: symbol`) | Example | Part(s) |
|---|---|---|
| `domain/display/threatAssessment.js :: buildThreatAssessment`, Beasts & Monsters row | "Walls and garrison provide credible deterrence…" | walls, garrison, militia, charter (beside the beasts band) |
| same, Invasion & War row | "Walls and professional garrison provide meaningful deterrence against raiding and conventional assault." | walls, garrison (a barracks reads as multiple garrisons) |
| same, Internal Security row | "Arrest, trial and gaol all work here." | court, prison |
| same, Disasters & Famine row | "The hospital can isolate the sick…" / "Clergy provide basic wound care" | hospital, clergy |
| `domain/display/defenseDisplay.js :: deriveSupportingCapabilities` | "Court + Prison · Full enforcement chain." / "Hospital present · … recovery capacity." / "Present · Alchemist shop, …. Detection, wards, counterspell." | court, prison, hospital, alchemists and arcane |
| `domain/display/stateProse/defenseStateProse.js :: beastsRowPoolKey`, `invasionRowPoolKey`, `internalRowPoolKey` (DS-DEF-2) | "{settlement}'s garrison roll puts paid soldiers on every stretch of its walls…" | walls, garrison, militia, court, prison |
| same `:: fortificationPoolKey`, `arcaneDefensePoolKey`, `arcaneFixturePoolKey` (DS-DEF-5) | "…comes from its alchemists, who brew for the defenders." | walls, arcane, alchemists, clergy, druids |
| `generators/safetyProfile.js :: generateSafetyProfile` (`guardEffectivenessDesc`, `prisonNote`, `wallNote`, `safetyDesc`) | "The {force} is well paid, well equipped and patrols properly." | the guard assessment. It grades strength from a second model (`flags.militaryEffective`, built from the dials and the garrison's presence), not from the defence score: a Village watch can read "well paid, well equipped" |
| `safetyProfile.js :: keptGuardLine` | "Hired swords back the garrison when the purse allows." | company, garrison (the pay half follows the score) |
| `components/dossier/EngineSections.jsx :: DefenseWarFrontSection` via `domain/causalState.js` | "+6 Defensive walls in place." | walls: a flat bonus on presence, added on top of the readiness. Already a second count today |
| `pdf/lib/headlines.js :: defenseHeadline` (also used by `foundry/journalPages.js`) | "Well-defended: a stone wall, held by the garrison." | the grade follows the score; "held by" is a presence claim |
| PDF: `pdf/sections/DefenseSecurity.jsx`, `stateProse/printProse.js` | Prints the rows above | Inherits them |

These already follow the rating and cannot disagree: the band badges, the readiness label and posture prose (DS-DEF-1), the Economic Survival and Economic Backing rows, `defenseScoreBands.js`, and `defenseLedger` / `deriveDefensePosture`.

**The lane's eight towns** (`UPKEEP-DEFENCE-PARTS.md`, "The eight towns under V3") list every part with its points. Under a scale factor, the garrison, watch, court, prison, company, charter, clergy, hospital, market and alchemists lines of cold-famine-city-75, cold-town-139, cold-under_siege-town-52, cold-city-16, cold-famine-city-0, cold-hamlet-56, cold-hamlet-91 and cold-thorp-0 all change. That document is the owner's record of the machinery, not a page, and it is regenerated from built code (the eight towns owed from the lane's final statement).

Judgement: none of these sentences is made false by B's move. Each says that a house is present and what kind of house it is, which stays true. The risk is the grade beside it: a town's barracks under "meaningful deterrence" next to a lower military band. The worst case is the Invasion row in a town. Under B, towns' mean military goes 54.1 → 52.4. No rewrite is proposed in this build; the list is for the chair.

## 6. The proposal, for the chair to rule

**ONE TABLE, anchor B.** `DEFENCE_TUNING.houseScale = { least: 0.8, greatest: 1.2 }`, with a reason row: "a house counts by its rung on its own ladder: the middle rung at today's points, the least less, the greatest more". A house's factor is `least + (greatest − least) · x`, where x = (rung − 1) / (top − 1). A one-rung ladder takes 1, and a part reads its greatest house.

The factor is applied to garrison, militia, watch, court, prison, wardens, company, charter, clergy, druids, market, hospital and alchemists. It is NOT applied to:
- walls, which keep their ruled kind;
- arcane, which already counts its tower and guild;
- the community rows;
- the crisis reliefs;
- stores, purse, will and the ground.

**THE DECLARED MOVE (the corpus as above):** 2,674 of 3,756 births move, 1,297 up and 1,377 down. The mean is +0.42 and the extremes are −9 and +9. Bands change in 335 births:

| Band change | Births |
|---|---|
| Well-Defended → Fortress | 117 |
| Lightly Defended → Vulnerable | 58 |
| Defensible → Well-Defended | 46 |
| Defensible → Lightly Defended | 44 |
| Well-Defended → Defensible | 37 |
| Vulnerable → Undefended | 28 |
| Fortress → Well-Defended | 5 |

By tier: thorp −0.35, hamlet −0.54, village −0.47, town −2.43, city +2.63, metropolis +3.96. On fresh6, 477 of 720 move and 61 change band.

Why B over A: it is the smaller move in sum, and it moves in both directions. It reads the owner's words both ways (a greater house counts more, a lesser house less). It does not declare today's rating an overstatement for every place below the metropolis: under A, 47% of towns drop a band. **B's cost:** in cities and metropolises much of the rise is held in reserve above 100, and the metropolis Fortress share rises from 60% to 72%.

**SIX EXAMPLE TOWNS IN PLAIN WORDS** (ratings only; readiness, then military / beasts / order / supply / magic; today → under B; A in `six.txt`):

1. **A town with an alchemist's shop** (cold-town-116: also a town watch, a courthouse, a monastery, a wizard's tower). Today 62, Well-Defended; 62 / 40 / 49 / 97 / 50. Under B 60, Well-Defended; 62 / 39 / 45 / 93 / 50. Its shop, courthouse and monastery each count a little less.
2. **A city with an alchemist quarter** (cold-city-227: also city walls, a garrison, the city watch, a mercenary quarter, the guilds). Today 68, Well-Defended; 100 / 98 / 40 / 100 / 78. Under B 70, Well-Defended; 100 / 100 / 48 / 100 / 78. Its larger houses count more, and the gain shows in order.
3. **A thorp that walks to another's church** (cold-thorp-0). Today 25, Lightly Defended; 25 / 22 / 31 / 21 / 0. Under B 24, Lightly Defended; 25 / 18 / 31 / 21 / 0.
4. **A village with a charter hall and a parish church** (cold-village-65). Today 18, Vulnerable; 25 / 36 / 0 / 46 / 0. Under B 17, Vulnerable; 25 / 29 / 0 / 46 / 0.
5. **A metropolis** (fresh6-metropolis-30: massive walls, multiple garrisons, a hospital network, a great cathedral). Today 93, Fortress; 100 / 100 / 66 / 100 / 99. Under B 96, Fortress; 100 / 100 / 81 / 100 / 99.
6. **A town under siege** (cold-under_siege-town-52: town walls, a barracks, a town watch, a small hospital). Today 49, Defensible; 100 / 67 / 16 / 58 / 28. Under B 46, Defensible; 99 / 62 / 9 / 56 / 28.

Also measured, one of the lane's eight towns: cold-town-139 goes from 41 Defensible to 37 Lightly Defended under B (29 under A). Its free company hall and town hall are the least rungs.

**WHAT I WOULD BUILD**, one cause and one commit, red first:
- `src/data/defenceWeights.js`: the `houseScale` row and its reason (the reasons test keeps the two key sets equal). No other value moves.
- `src/domain/institutions/defenseInstitutionBuckets.js`: ONE function, `defenseHouseScaleOf(institutions)`, returning each scaled part's x (or null where no house on a ladder stands).
  - It reads `institutionLadders.js :: UPGRADE_CHAINS`, the catalogue's one home for scale, restricted per part to the names that open it, derived once at load as `chains.mjs` does.
  - It holds no table of names of its own. The roster's own names are matched to the catalogue's exactly, through `nativeSemanticName`.
  - **The import order must be checked first.** The openers live in `priorityHelpers.js :: getInstitutionNames` and `defenseFacts.js`, and the latter already imports this module. If it cycles, the derivation moves to a leaf that both read. Named as a risk, not yet measured.
- `src/generators/defenseGenerator.js :: computeDefenseScores`: `add` and `paid` multiply the part's weights by the factor, as the walls multiply by kind today. Parts stay computed by one function and are never stored. No new key goes in the settlement record, no new word in the vocabulary file, and no string on any page.
- The R2 counterfactual watch (a hired-only place "with a watch in its stead") takes factor 1: the middle rung under B.
- Tests (`tests/generators/defenceParts.test.js` and a new `defenceHouseScale.test.js`):
  - red first: the same record with the shop swapped for the quarter reads a larger alchemists part and a readiness no lower;
  - every multi-rung house in the catalogue resolves to a rung;
  - the one-rung and gap list is pinned by name: Household levy, Druid Circle and Elder Grove Council, Professional city watch on garrison;
  - the parts still sum exactly to the readiness on unseen births;
  - **the count-once test stays at zero**;
  - the defence walker still finds no literal in the generator.
- The golden master is re-recorded with the cause stated, as a declared move.

**WHAT I WOULD NOT BUILD:**
- the walls by ladder (AW: the ruled kind stands);
- a factor on arcane;
- scaled crisis reliefs;
- any rewrite of the section-5 sentences;
- the household-levy and druid gaps, the fabric church opening clergy, and Professional city watch opening two parts. Each is named for the chair, and none is repaired here.

## Probes

All are in `probes/UPKEEP-CAPACITY/`:

- `census.mjs` produces `census.json` and `census.txt`.
- `chains.mjs` produces `ladders.txt` and `ladder-of.json`.
- `corpus.mjs` runs on a scratch copy carrying `capacity-measure.patch` (ruling E's hook and an inert factor hook) and produced `corpus.ndjson.gz`.
- `an.py` produces `measure.txt`.
- `ex.py` produces `six.txt`.

The scratch tree was 0a07f98c7 plus the patch, after `npm ci --ignore-scripts`. Local refs and config were snapshotted before the work and compared after.
