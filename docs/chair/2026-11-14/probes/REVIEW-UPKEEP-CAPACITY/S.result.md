# S: the UPKEEP-CAPACITY stage's statement, checked against the reviewer's data

**Statement:** `9354d792a:docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md`, the build part only (THE BUILD, Correction, C0, C1, the hired-only rule, HAND-BACK 1, SEAT 2, M, C2 to C6, M2, the census and gates table, sections 7 to 9, HAND-BACK 2), plus `UPKEEP-CAPACITY-EIGHT-TOWNS.md`. Sections 0 to 8 (the measure) were read only where the build cites them.

**Data used:**
- out/{base,def,tip}, 972 births. The census 720 are r2r- and r2s-, the shape `cfgFor` accepts. The lane's `cold-`/`fresh` keys use the same dials (`corpus2.mjs` DIALS = `render5.mjs` dials).
- 38 of the statement's own towns, born at base, def and tip by `work-S/render6.mjs`. This is `render5.mjs` plus one branch for the `cold-|freshN-[crisis-]tier-i` keys, with the lane's own config. Outputs are in `work-S/n.{base,def,tip}`.
- Per-birth extracts (`work-S/ext.*.ndjson`), made with each tree's own `collectThreatSources`, `deriveMagicReliance` and `scoreBand`.
- Page line diffs `work-S/ld.def-tip.ndjson` and `ldn.*.ndjson`.
- Part lists from each tree's `defencePartsOf` (`parts.mjs`).
- Counterfactuals with each tree's `generateDefenseProfile` (`cf.mjs`, `c0.mjs`, `alch.mjs`).

**One finding before the rows:** base and def give identical ratings on all 720 census births: readiness, the five scores, the bands and the powers. That agrees with the statement's claim that the defence-lane merges move no rating. So base→tip and def→tip measure the same rating move.

---

## 1. The rows the stage says it CURED

| Row | The false thing | On its own town | On our births (def→tip) | What prints in its place | Verdict |
|---|---|---|---|---|---|
| **C0** (R2 cap takes the will's military) | A hired-only place's military is above the same place with its tier's watch | 5 named towns (cold-village-130, fresh6-hamlet-8, cold-hamlet-181, fresh6-hamlet-41, cold-village-203). The Invasion band word goes Adequate→Weak in four and Strong→Adequate in one, exactly as stated. The sentence under it is unchanged ("has no line and no force" / "plan for an army is to not be interesting to one"). | Military above the watch counterfactual: def **13 of 25** hired-only births, tip **0 of 25**. Readiness above the counterfactual at tip: 11 of 25 (44%), where the statement has 16 of 36 (44%), declared open. A higher band word than the counterfactual: 1 of 25 (statement: 3 of 36). | The band words now agree with "no line and no force". cold-village-203 still reads Adequate beside "plan for an army is to not be interesting to one" (LOW). | **cured and true** |
| **C1** (a house counts by its rung) | "A single alchemist should not have the same influence as an alchemist district" (the owner); every house counted at one weight | Every factor is as stated in the eight towns: barracks 0.8, multiple garrisons 1.2, town hall 0.8, city hall 1.2, charter hall 0.8, levy 0.8, circle 0.8, council 1.2. **On the owner's own example town (Ioannoakra, cold-wartime-town-75) the shop and the quarter read the same readiness, 28 = 28, and the quarter reads LOWER on Economic, 30 against 31.** The statement says so and gives the cause (limit 1). | Alchemist size swap at tip, 158 holders: the larger house reads higher readiness in 76 (48%) and lower in 0. **It reads the same in 82 (52%).** Economic is lower with the larger house in 5 and military in 1. | In half the alchemist holders the size does not show on any rating. | **cured in part.** The house's own part is scaled, but in about half the holders, the owner's example among them, a shop and a quarter still rate the same, and in 3% the larger house reads lower on Economic. |
| **C2** (G1: city watch is the watch only) | The city watch is counted twice, as garrison and as watch ("3 forces") | Dongguan (cold-city-227): "3 forces" becomes "2 forces", and the headline "held by the professional city watch" becomes "held by the garrison", as stated. | The force chip disagrees with the record's distinct force houses in **324 of 972 at def and 0 at tip**. The watch is in the garrison bucket in 324 at def and 0 at tip. `hasGarrison` moves in 0 births. | "2 forces": true. "held by the garrison" or "held by the multiple garrisons": true; the house stands in every case. | **cured and true** |
| **C3** (G2: levy = militia) | The page shows a levy as a force while the rating counts no armed body | Hongshan (cold-thorp-191): militia part 4.8 opens, military 47→77, as stated. The correction (its palisade already counted whole at base, walls 6.0) is TRUE. | `hasMilitia` turns true in 37 of 37 levy thorps. Readiness rises in 31, holds in 3 and falls in 3. The three falls are −1 each: places that also walk to church, so C4a's cut outweighs the levy. Military bands: Weak→Adequate 14, Adequate→Strong 8, Critical→Weak 2, Critical→Adequate 1. | Mostly true. Still false: "Invasion & War: Strong" in 3 besieged thorps of 6 to 9 people (the reviewer's MED row 5). "Nobody on it" / "walk into the centre" lines beside a levy or militia: 30 at def, **32 at tip** (declared as another lane's fault). | **cured, true except 3 MED** |
| **C4a** (G3: the walk opens no clergy) and **C4b** (G3s: the shrine opens no clergy) | The rating counts a priest that a walk or a shrine does not have | Fjordberg (cold-thorp-0): clergy part 3.6→gone; the parish row (2.2) stays. Chalmal (cold-hamlet-123) and cold-thorp-20 (the shrine thorp) behave as stated. | 296 walk/shrine places with no other church house: `hasDivine` is true in 160 at def and **0 at tip**. **0 lines with clergy words were added** in them. Beasts Weak→Critical in 82. | No new clergy line. Carried and declared: "Clergy care / Clerical care" and "Clergy provide basic wound care" print in **all 296**, and in every town (they are generic PDF rows). "Divine provision" prints in 55. | **cured and true** (carried false lines remain, as declared) |
| **C5** (G4: one successor key) | A council counts the same as a circle | The 0-records proof is the statement's own and was not re-run. | No roster moves base→tip or def→tip (0 of 972). No birth holds both houses. Druids part tip/def ratio: circle 0.79 (8), council 1.17 to 1.26 (21); one circle part goes 0.4→0. | Nothing prints. | **cured by silence** (scores only) |
| **C6** (G5: the alchemist is a trade) | The "Arcane defense" list, the "N arcane" chip and the Foundry "Armed forces" list carry an alchemist; the arcane part opens on it | Ioannoakra: arcane part 11→gone, as stated. | Alchemist in the stored list: **158 at def, 0 at tip**. The chip equals the list in 972 of 972 at both trees. Arcane part closes in 14 of 21 shop towns (67%; statement 56%) and **0 of 137 quarter cities (statement 25 of 525)**. The 34 quarter-only cities all have a magic dial ≤ 34, below the arcane gate of 35. | **Not true everywhere.** "Arcane Support: Present … Detection, wards, counterspell" beside an empty Arcane defense list: **23 at def, 33 at tip (10 new).** The statement says 4 of 223, all Teleportation circles. Ours are 6 Teleportation circles, 3 Scroll scribe/Enchanter's shop and 1 Dragon resident. In 3 of them (r2r-city-19, r2r-town-10, r2s-religious_conversion-city-3) the profile's `hasArcane` is still TRUE while the list shows none, which contradicts the statement's "against a profile with no arcane tradition". The reviewer found "keeps no wards or seers" false in 10 of 55 (MED row 6). | **cured, but what prints in its place is false in ~10 births (MED)** |
| Correction: hired-only "14 against 11" | The capped keep | cold-village-65 at tip reads **17 Vulnerable as stored and 13 Vulnerable with a watch instead**, as corrected. | | | **correction true** |

### Removals the stage counts: up to 30 read in out/def, gone at out/tip

| Removal | Read | TRUE |
|---|---|---|
| C2: force chip "N forces" where the watch is counted twice | 30 of the 324 (the script checked all 324: the chip is one above the distinct force houses in every one) | **0 of 30** |
| C2: headline "…held by the professional city watch" (PDF and Foundry, 648 lines in 324 births) | 30 (the script checked all 324: the watch stands in every one) | **30 of 30**. A true line was swapped for another true line. |
| C2: Defence and Tonight lists, watch before garrison | 30 | **30 of 30**. Same houses, reordered. |
| C6: "Arcane defense" plus "Alchemist quarter/shop" and its description (tab and PDF), and Foundry "## Armed forces – Alchemist …" (158 births) | 30 | **0 of 30** as a classification: by the catalogue, alchemy is a trade. The house descriptions themselves are true of the house. |
| C6: "N arcane" chip counting the alchemist (158) | 30 | **0 of 30** |
| C3: "walk into the centre / perimeter has nobody on it / pass nobody on the way in" | all 7 | **3 of 7**. TRUE in unwalled towns with a watch (r2r-town-19, r2s-wartime-town-2, rv5-under_siege+famine-town-2). FALSE beside palisade + levy or militia (r2r-thorp-26, r2s-politically_fractured-thorp-2, r2s-plague_onset-hamlet-1) and beside town walls + watch (r2s-politically_fractured-town-0). Of the 17 added, 8 are again beside a levy/militia or walls. |
| C0/C1/C4: readiness headline band sentences, "<Label>: <walls>, held by <force>" (PDF, 102; city-watch lines excluded) | 30 random | **29 of 30** by the reviewer's kind c/g rule. The false one is "Undefended: no walls; the household levy is all that stands guard" (rv5-under_siege+famine-thorp-3). |
| C4a/C4b: Beasts "Weak" in walk/shrine-only places (82 Weak→Critical) | 30 | **0 of 30** by the stage's own ground (the points behind "Weak" were a priest the place lacks). As a world judgement the page cannot refute either word. |

---

## 2. Headline counts: base (8ef42a051) → tip on the 720 census births, as rates

| Figure (statement on 3,756) | Statement rate | Ours (720) | Agree? |
|---|---|---|---|
| Readiness moves 2,939 | 78.2% | 559, 77.6% | yes |
| up 1,512 / down 1,427 | 40.3% / 38.0% | 283 / 276, 39.3% / 38.3% | yes |
| mean +0.03; range −25 … +10 | | −0.09; −20 … +9 | yes |
| Bands 542 | 14.4% | 103, 14.3% | yes |
| Mean readiness by tier: thorp −0.2, hamlet −1.9, village −0.5, town −3.4, city +2.5, metropolis +4.0 | | −0.6, −2.2, −0.5, −3.5, +2.4, +3.9 | yes |
| Power structures re-drawn 481, every one with a band move | 12.8% | 88, 12.2%; 88 of 88 with a band move | yes |
| Band moves without a power re-draw: thorps only (100 bands, 39 powers) | | 15, all thorps (20 bands, 5 powers) | yes, same pattern |
| 7 births gain or lose a power | 0.19% | 1, 0.14% (r2r-city-55: Military/Guard in, Thieves' Guild out) | yes |
| Legitimacy labels 44 | 1.17% | 12, 1.7% | roughly |
| Military 1,161 moved / 237 bands | 30.9% / 6.3% | 29.6% / 5.4% | yes |
| Beasts 2,096 moved (1,366 down) / 524 bands (Weak→Critical 369) | 55.8% (65% down) / 14.0% (9.8%) | 54.4% (66% down) / 16.8% (11.9%) | yes |
| Order 2,711 moved (1,547 up) / 690 bands (Adequate→Strong 252) | 72.2% (57% up) / 18.4% (6.7%) | 69.6% (58% up) / 14.6% (6.0%) | yes (bands a little lower) |
| Supply 1,342 moved / 112 bands | 35.7% / 3.0% | 26.5% / 4.7% | **no**: fewer moves, more bands |
| Magic 360 moved (338 down) / 46 bands | 9.6% (94% down) / 1.2% | 9.9% (97% down) / 1.4% | yes |
| AI threats change in 308 | 8.2% | 64, 8.9% | yes |
| "Civic stability at risk": lost 203 / gained 52 | 5.4% / 1.4% | 35 / 11, 4.9% / 1.5% | yes |
| "Economic fragility" gained 37, none lost | 1.0% | 14 gained (1.9%) **and 1 lost** | gained roughly; **the loss is not in the statement** |
| "Magical instability" gained 22 | 0.59% | 6, 0.83% | yes |
| Magic against the page: 7 made, none cured | 0.19% | 1 made (r2s-famine-town-0), 0 cured, 0.14% | yes |
| C2: the garrison bucket loses the watch in exactly the holders | 1,304 of holders | 324 of 324 | yes |
| C6: the stored list loses the alchemist in every holder | 633 of 633 | 158 of 158 | yes |
| C6: arcane part closes, shop towns / quarter cities | 60 of 108 / 25 of 525 | 14 of 21 / **0 of 137** | shop yes; **quarter no** (dial-driven; see the C6 row) |
| Alchemist swap: higher readiness / never lower / band / score band / Magical higher / Economic higher / Economic lower | 299 of 633 (47%) / 0 / 23 (3.6%) / 65 (10.3%) / 435 (69%) / 257 (41%) / 31 (4.9%) | 76 of 158 (48%) / 0 / 6 (3.8%) / 18 (11.4%) / 110 (70%) / 39 (25%) / 5 (3.2%); **also military lower in 1, higher in 2 (not stated)** | yes, except Economic higher (25% against 41%) |
| Hired-only: readiness above the watch counterfactual | 16 of 36 (44%) | 11 of 25 (44%) | yes |

---

## 3. The eight towns: every figure checked at base and tip (8ef42a051 / 9354d792a; the tip reads the same ratings as 1dac1ca25 per the statement)

**Figures:** every Before and After row matches our births exactly. That covers readiness, band and the five scores with their band words, for:
- Sahlzamin, Dongguan, Fjordberg, Medinamela (with its watch-instead rows 14/25/4/9/46/0 and 13/24/4/5/46/0), Gerasdion, Niederholz, Hongshan and Chalmal;
- Ioannoakra, with its quarter-instead row;
- Berghavn: 69 → 72 Well-Defended; Beasts 84 → 91; Internal 68 → 77; Magical 29 both;
- Tikalahau: 54 Defensible against 55 Well-Defended; Economic 98 → 100; Magical 27 → 31.

The politics are re-dealt only for Chalmal and Ioannoakra (the power hash moves), and kept for the other six, Berghavn included. Chalmal's legitimacy is 37 → 36 and its defence share −1 → −2 ("slipped by a point"): true. **0 false figures.**

**The "why" sentences, against each town's own parts (base → tip):**

1. **Sahlzamin.** Court 4 → 3.2, hospital (the monastery's) 3 → 2.4, alchemists 1.6 → 1.3. The arcane part stays at 12.1 and Magical stays at 60. The roster is as described (no walls). **TRUE.** (Its court is also a Town hall, the same 0.8 rung.)
2. **Dongguan.** Watch 4.9 → 5.9, court 4 → 4.8, company ×1.2, charter ×1.2, arcane unchanged, Magical 89, "3 forces" → "2 forces". **TRUE.** The court's rise is the City hall's 1.2; "several courthouses" is the middle rung (1.0). The comparison "better than a town can" still holds.
3. **Fjordberg.** Clergy 3.6 → gone; the parish row stays at 2.2 ("still gather at the shrine"). **TRUE.**
4. **Medinamela.** Charter 8.6 → 6.9 (×0.8); with the hall it reads 17, with a watch instead 13; both Vulnerable. **TRUE.**
5. **Gerasdion.** Every scaled house it keeps is a top rung (Multiple garrisons, Professional city watch, City hall, Multiple court buildings, Massive prison, Hospital network, Elder Grove Council, Multiple adventurers' guilds). Each of those parts is ×1.2, and Internal goes 66 → 81. **TRUE.**
6. **Niederholz.** Garrison 12 → 9.5 (Barracks), hospital 2.4 → 1.9, court 3.2 → 2.4 (Town hall), Military 99 Strong. **TRUE.** The clergy 3.9 → 3.6 is not mentioned; that is an omission, not a falsehood.
7. **Hongshan.** Militia part 4.8 opens, the will goes 1.2 → 6, Internal 25 → 34, clergy gone, Beasts 23 → 15. **TRUE by the record.** **Doubtful:** "behind the palisade it would see off raiders" is said of a thorp of 13 people (Military 77 Strong). That is the reviewer's kind d, MED row 5 (Strong in levy thorps of 6 to 9).
8. **Chalmal.** Clergy 5.4 → gone. Without `hasDivine`, the plague crisis loses its divine relief (`plague_onset` divineMil/divineEco). Households 1.1 → 0, stores 2.1 → 1.6, purse 3.1 → 2.2. **TRUE.**
9. **Ioannoakra.** Arcane 11 → gone; sustainsHeld −1.2 → −12.5 ("counts for less: a granary defends nobody by itself"): **TRUE.** A town held by one watch: **TRUE** (Town watch only). The quarter's alchemists count half as much again (1.2 against 0.8): **TRUE.** "That cannot show in its rating": **TRUE for readiness (28 = 28)**, but its own next row shows Economic 30 against 31. The file explains this, so it is not false. The unrounded 30.4 against 30.6 was not re-derived.
10. **Berghavn.** "Its alchemist quarter changed nothing: it was never counted as arcane defence here." The arcane part is absent at base (magic dial 19, below the gate of 35): **TRUE for arcane.** Strictly, its alchemists part rose 1.6 → 1.9 under C1, though no score shows it (Economic 100 both). "Rises because watch, courts, mercenary quarter, guilds": watch 5 → 6, court 4 → 4.8, company and charter ×1.2. **TRUE.**
11. **Tikalahau.** No sustainsHeld at tip; with the quarter, Economic 98 → 100, Magical 27 → 31 and readiness 54 → 55, Defensible → Well-Defended. **TRUE.** Not stated: Tikalahau itself fell 64 Well-Defended → 54 Defensible from base to tip, and its power structure is re-dealt (legitimacy 86 → 80).

**False figures: none. False "why": none. Doubtful: Hongshan's "would see off raiders" (13 people).**

---

## 4. The chair's rulings copied into the statement

**Built to:**
1. **Counterfactual watch:** the watch the catalogue writes at the place's own tier; a thorp or hamlet takes the least rung (the Correction).
2. **C0, on the stop at C1:** R2's cap takes the martial will's military as well.
3. **Ruling B, the anchor:** `houseScale` least 0.8 / greatest 1.2.
4. **One law for every ladder:** the factor comes from the rungs that do the job; where a step makes a ladder, its rises are declared, not special-cased.
5. **The hired-only rule stays military**, as coded at C0 (the seven band words stand).
6. **The law of the count:** one job is counted once; a house opens two parts only where it does two named jobs (the magic houses, the village Parish church, the Monastery or friary).
7. **G1:** the professional city watch is the watch only, on every home.
8. **G2:** the household levy opens the militia, at its ladder's least rung.
9. **G3:** the walk to another's church opens no clergy part; the parish row stays (G3p not built).
10. **G4:** the one `successor: 'Elder Grove Council'` key on the Druid Circle family.
11. **G5:** the alchemist's shop and quarter are a trade: out of the arcane opener, the arcane reliefs and the "Arcane defense" list. The alchemists part, its reliefs and the magic presence stay; the apothecary's houses are not opened.
12. **G5's Defense display line:** `defenseDisplay.js` and `magicReliance.js` are not touched; the line goes to the display lane, and the seat lists the births.
13. **Politics:** a band that moves re-draws the politics, declared with counts; the page shows ratings, never the machinery; no new record key and no new vocabulary word.
14. **G3s:** the wayside shrine opens no clergy part and keeps its parish row; C4 is split into C4a and C4b, with the count test in C4b (vetoable by the owner).
15. **A7:** distinct sums over distinct member sets; the untested list is named, exact, shrink-only and pinned at one; the plants; its own commit; the change to another lane's walker is authorised for this purpose only; do not push C6 red (the cure landed after C6 had already been pushed).

**Earlier rulings only referenced:**
- the chair's second word: reading A and the alchemist patch are withdrawn, and the magic presence is whole;
- R2: "one job, counted once" (the shared cap against beasts);
- R13: the will is held to the armed bodies' points;
- W3: the will is unpaid on the hired branch;
- R16: war drains supply;
- the charter's work against beasts, "ruled true of the world";
- ruling E (withdrawn).

---

## 5. Claims about monotonicity, guards and plants, suite reds, and goldens and draws (one line each)

**Monotonicity:**
- EIGHT L6: "A barracks counts for less than a garrison, and a garrison for less than several garrisons; a village watch for less than a town watch … a single courthouse, a small hospital, a village's one parish church and a village's druid circle each count for less than the larger kind."
  - Ours, tip mono enlarge: a score falls in 68 renames. Town hall → City hall lowers military in 28; Courthouse → Multiple courthouses in 6; Small prison → Large prison in 3; Small hospital → Major hospital lowers economic or military in 2; Parish churches (2–5) → (10–30) lowers military in 1. Monastery → Multiple monasteries lowers READINESS in 19 (23 at def, so carried).
- MEASURE L786 / EIGHT L146: "the larger house reads higher readiness in 299 and lower in none / never lower … Magical higher in 435, Economic higher in 257 and lower in 31."
  - Ours: higher 76 of 158, lower 0; Economic lower 5; **military lower 1 (not stated).**
- MEASURE L785: "No rung is applied the wrong way round; no part is displaced."
- EIGHT L138: "The larger house is not counted the wrong way round; it is the town's small force that caps them both."
- **The statement makes NO "adding a house never lowers a score" claim.** Ours, tip mono add: a score falls in 1,138 additions (832 at def).

**Guards and plants:**
- A7: "Plants, each run: equal sums over two sets red; distinct sums pass; one set named passes and unnamed reds; a second name reds; the list removed reds."
- A7: "`REJECTED_UNTESTED`, an exact, shrink-only list pinned at one (magicDef) … a named row with evidence again reds (it does at the merge below C6: 4 member sets)."
- Red first at each step:
  - C0: "red on exactly the eight";
  - C2: "three tests red at the merge on exactly their assertions";
  - C3: three; C4a: two;
  - C4b: "red on exactly the wayside shrine (12 places) … all five green at C4b";
  - C5: two; C6: two.
- The count test: "each is anchored as present"; R2's cap is classed apart ("anchored: the cap is at work in the corpus").
- C5: "0 of 3,756 whole records differ from C4b, and 0 part lists."
- "The real C6 commit reproduces the measured C6 tree on all 3,756 records."

**Suite reds (own against carried):**
- Base: 41 FAIL lines.
- C1: "The only new red was the inventory, cured by 4cb6a7f27". The any-cast ratchet's attribution row is "red at base too".
- C2: 47. Two are the merge's (the wiring census / `proseWiringCensus.walker`). Four are the step's (`negativeAssertionAnchor.walker` ×2, holderTable line citations, `recordRegisterTotality.walker` A4), all cured; 128 of 128.
- C3 to C5: 41, exactly the base's.
- C6: 48.
  - Six are inherited and red at fbc4a0080: sovereigntyLighting park debt, recordRegister "the census is an assertion", the anchor walker ×2, chainPrintSites F1, the wiring census alias draft.
  - `defenceDerived.walker` is the step's own and cured.
  - A7 (`recordRegisterTotality.walker`) is the step's own, cured by 1dac1ca25.
- After the last merge (M3): 62. Two are gone, and 16 are new, "every one red at 6e61d042a": safety survival lines (6), projectionAgreement court-without-prison, defenceFactReaders, domain any-cast ratchet (5), wiring census (3), style ratchet. "None is this branch's."
- **Test FILES named:**
  - `tests/generators/upkeepHired.test.js`
  - `tests/generators/magicCountOnce.test.js`
  - `tests/generators/upkeepCapacityGaps.test.js`
  - `tests/lint/tuningRegister.walker.test.js`
  - `defenseInstitutionBucketsWork.test.js`
  - `recordRegisterTotality.walker`, `defenceDerived.walker`, `proseWiringCensus.walker`, `negativeAssertionAnchor.walker`
  - by short name: defenceParts, defenseEconomicGate, the holder table, the domain any-cast ratchet, sovereigntyLighting, recordRegister, chainPrintSites, the wiring census, the safety survival lines, projectionAgreement, defenceFactReaders, the style ratchet.
- Its census runs only the generators, lint, pdf and display suites (563 files). `tests/property` (generatorGoldenMaster and the dormancy goldens) is not in it.

**Goldens and draws:**
- "The golden corpus is measured, not signed (`goldens.mjs`: 525 rows) … No golden's door is opened." Rows moved: C1 273 (16 change band); C2 168; C3, C4a, C4b, C5 0; C6 46; cumulative 477 of 525 (defence profile 273, readiness 273, band 20, powers 20).
- **No surface of `tests/fixtures/.golden-freeze-register.json` is named, as moved or unmoved.** The register file is unchanged 8ef42a051 → tip. The section 8 proposal said "the golden master is re-recorded with each cause stated", which the build does not do.
- **NPC, relationship and conflict re-draws are NOT declared.** It declares power structures, legitimacy labels, the power trace's legitimacy figure and the `hasMilitia` flag copies.
  - Ours, def → tip field diff: npcs move in 12 births (in 8 the NPC's name and role change), relationships 8, conflicts 5, prominentRelationship 4, `stress.cast` stakes 2.
  - Also activeConditions severity 29 and coherenceNotes 1, neither declared in the build.
