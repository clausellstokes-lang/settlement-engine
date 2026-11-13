# UPKEEP-CAPACITY: a house's scale in the defence rating, and five gap candidates. The measure and the proposal

**Seat:** UPKEEP-CAPACITY, measure only; nothing in `src/` is committed. Branch `lane/upkeep-capacity-2026-11-13`. Probes, outputs and corpora are in `docs/chair/2026-11-13/probes/UPKEEP-CAPACITY/`.

**THE TREE MEASURED (the chair's second word):** `lane/coherence-upkeep-2026-11-12` at **ebcbfc48a**, read back from origin, plus `capacity-measure-2.patch`.
- The magic presence reads the WHOLE roster: the one line as it stood at c72917251, so reading A is withdrawn.
- There is **no alchemist patch**.
- The patch adds hooks that do nothing unless a probe sets them:
  - the factor;
  - a sink that records each part's own scores;
  - the gap candidates' flags and names;
  - G5's alchemist reading.
- With every hook off, a re-birth reproduces the base: the same record hashes on the seeds checked.
- `npm ci --ignore-scripts` was run in a scratch worktree. The lockfile is identical between 0a07f98c7 and ebcbfc48a, so `node_modules` is shared.
- The first measure (at 0a07f98c7, with ruling E's patch on) is kept in `measure.txt` and `six.txt` for the record. **Every figure below is the corrected tree's.**

**CORPUS:** the sixth seat's 3,756 births (the fifth seat's 3,036 plus 720 unseen fresh6), with the same keys and configurations as `alch6.mjs`.
- **Each seed is born once per candidate, with the hook set through the WHOLE pipeline.** So the powers, the legitimacy and every later reader see that candidate's defence.
- Base, A and B: `corpus2.mjs` → `measure2.txt`.
- E (= G5) and BE: `corpus2.mjs` with `CAP_CANDS=E,BE` → `measure3.txt`.
- G1 to G4: `corpus3.mjs` → `measure4.txt`.
- Six towns: `six2.txt`.

## 0. Outcome first

1. **The finding stands on the corrected tree.** Every house on a ladder of more than one rung sits on the rung its ladder writes at the place's own tier.
   - No city has a shop and no town has a quarter.
   - No birth holds two rungs of one ladder.
   - The owner's "single alchemist" against an "alchemist district" is a town against a city.
   - Reading the house's scale against the tier moves no birth. **Recommended: the house's scale alone.**
2. **Anchor: B** (least rung 0.8, greatest 1.2, the middle at today's points). It changes fewer bands, fewer score bands and fewer power structures than A.

   | | Readiness moved | Mean | Bands changed | Score-band changes | Power structure changed | A power appears or vanishes |
   |---|---|---|---|---|---|---|
   | **B** | 2,677 | +0.41 | 342 | 1,074 | 336 | 7 |
   | A | 2,094 (all down) | −2.02 | 495 | 1,593 | 475 | 1 |

3. **The gap candidates, each measured apart:**

   | Candidate | Readiness moved | Mean / extremes | Bands changed | Power structure changed | Recommend |
   |---|---|---|---|---|---|
   | **G1** the professional city watch opens the watch only | **0** | — | 0 | 0 | **yes** |
   | **G2** the household levy opens the militia | 143 (all up) | +7.67 over holders, max +13 | 98 | 42 | **yes** |
   | **G3** the walk to another's church opens no clergy | 346 (all down) | −1.58 over holders | 100 | 79 | **yes** |
   | **G3p** G3, and no parish row either | 735 | −3.14 over holders | 223 | 162 | **yes** |
   | **G4** the druid houses, one function at two scales | 46 | ±1 | 2 | 2 | **yes** (the catalogue's own `successor`) |
   | **G5** the alchemist is a trade, not a retained caster | 79 (all down) | −1.11 over holders, min −23 | 40 | 40 | **yes**, with a side effect declared |

   - G1 in a user-edited city that holds the watch alone: mean −9.43, 583 of 1,304 change band.
   - G3: beasts falls from Weak to Critical in 202 births.
   - G5's side effect: the magical score falls in 39 births, through limit 1.
4. **The law of the count is NOT at zero today, and no candidate was proved at zero.**
   - 2,157 births hold a house that opens two parts sharing one score: the professional city watch, the walk to another's church, the village's parish church and the monastery.
   - B adds no new dependency (262 by the drop test, as today); A adds one (1,101).
   - G1 and G3 cure two of the four.

## 1. The census of scale

The census reads each name alone through the code's own openers (`census.mjs` produces `census.txt` and `census.json`; `chains.mjs` produces `ladders.txt`), now with ruling E's hook off. The ladders are unchanged from the first measure:

| Part | Its ladders (rungs; one-rung houses) |
|---|---|
| garrison | Barracks → Garrison → Multiple garrisons; Professional city watch is one rung here (it is the watch's top) |
| watch | Village watch → Town watch → Professional city watch |
| court | Courthouse → Multiple courthouses → Multiple court buildings; Town hall → City hall; Democratic assembly is one rung |
| prison | three rungs |
| hospital | Small → Major hospital → Hospital network; Monastery → Multiple → Major monasteries; Healer is one rung |
| company | Free company hall → Mercenary quarter |
| charter | Charter hall → Multiple adventurers' guilds; Hireling hall is one rung |
| clergy | five parish rungs; Cathedral → Great cathedral; Monastery is one rung |
| market | four ladders, eight one-rung houses |
| alchemists | Alchemist shop → Alchemist quarter; Apothecary district is one rung here |
| militia, wardens, druids | one rung each |
| walls | counted by their ruled kind |
| arcane | already counts its tower (+5) and guild (+8); given no factor |

The gaps G1 to G4 come from this census (section 5).

## 2. The corpus: which rung, by the place's tier

Houses by rung and tier are in `measure2.txt` (the table at its head). Every rung sits on its own tier. The exceptions are:
- Weekly market, which the catalogue writes at both village and town;
- the hedge wizard (on arcane, given no factor), in 3 towns and 36 cities.

The shop stands in 108 towns, and the quarter in 413 cities and 112 metropolises.

## 3. The two anchors: the move on readiness, each of the five scores and their bands

The rule for each house: x = (rung − 1) / (top − 1). Under **A**, f = 0.6 + 0.4·x; under **B**, f = 0.8 + 0.4·x. A one-rung ladder takes 1, and a part reads its greatest house. The spread of 0.4 is the wall's own (palisade 0.6 against stone 1). No value was tuned to a target.

**Readiness** (base → candidate):

| | A | B |
|---|---|---|
| Moved | 2,094 (all down) | 2,677 (1,297 up, 1,380 down) |
| Mean, all / movers | −2.02 / −3.63 | +0.41 / +0.58 |
| Extremes | −20 … 0 | −9 … +9 |
| Bands changed | 495 | 342 |
| fresh6: moved / band | 369 / 80 | 477 / 59 |
| thorp, hamlet, village: mean move | −0.73 / −1.10 / −1.16 | −0.35 / −0.54 / −0.47 |
| town (mean readiness) | **−7.12**, 343 change band (40.5 → 33.4) | −2.39, 110 change band (40.5 → 38.1) |
| city | −0.71, 24 change band | +2.57, 92 change band (71.3 → 73.9) |
| metropolis | 0 | +3.96, 81 change band (77.7 → 81.7) |

Band moves under A: Lightly Defended → Vulnerable 176; Defensible → Lightly Defended 135; Well-Defended → Defensible 90; Vulnerable → Undefended 74; Fortress → Well-Defended 18; Lightly Defended → Undefended 2.

Band moves under B: Well-Defended → Fortress 137; Lightly Defended → Vulnerable 57; Defensible → Lightly Defended 45; Well-Defended → Defensible 36; Defensible → Well-Defended 35; Vulnerable → Undefended 27; Fortress → Well-Defended 4; Lightly Defended → Defensible 1.

**The five scores, with the page's bands** (`scoreBand`: STRONG ≥ 65, ADEQUATE ≥ 40, WEAK ≥ 20, otherwise CRITICAL; the disaster score moves under neither):

| Score | A: moved, mean, worst; band changes | B: moved, mean, range; band changes |
|---|---|---|
| military | 864, −1.24, −26; **142** (Strong → Adequate 74, Adequate → Weak 46, Weak → Critical 22) | 742, −0.12, −12 … +14; **49** |
| beasts (monster) | 1,612, −2.98, −27; **566** (Weak → Critical 328, Adequate → Weak 151, Strong → Adequate 87) | 1,776, −0.38, −12 … +16; **324** (Weak → Critical 212, Adequate → Weak 55, Strong → Adequate 44, Adequate → Strong 13) |
| order (internal) | 1,806, −3.48, −27; **534** | 2,428, +2.61, −11 … +17; **614** (Adequate → Strong 254, Weak → Adequate 124, Weak → Critical 84, Adequate → Weak 83, Critical → Weak 36, Strong → Adequate 33) |
| supply (economic) | 1,067, −1.74, −31; **231** | 1,284, +0.07, −14 … +8; **59** |
| magic (magical) | 453, −0.67, −28; **120** (Weak → Critical 75, Adequate → Weak 39) | 326, −0.14, −12 … +10; **28** |

- **Mean move by tier:** under A, the town's order falls 13.4 and its supply 7.3. Under B, the town's order falls 4.9, the city's rises 8.4 and the metropolis's 14.2. The full table is in `measure2.txt`.
- **The magic score moves although no factor touches the magic part.** It moves through limit 1: when the force falls, what sustains it is held, and the magic part is a sustaining part.
- **(a) Magic against the page:** births where "Reliance on magic: relied-upon / integral" stands beside Magical Capability Weak or Critical. There are 500 at base; **A makes 12, B makes 4**, and neither cures any. The reliance reading itself never changes (it reads the roster, not the score).

## 4. The coupling, and the AI prompt's threats (items c and d)

**(c) The politics re-drawn.** A power structure changes **only** where the readiness band changes: 0 of the births whose band holds, under every candidate. The other changes to the rest of the record (69 under A, 108 under B) come from the stored guard clause and the condition severity, item (d).

| | Band changed | …of which the power structure changed | A power appears or vanishes | Legitimacy label changed |
|---|---|---|---|---|
| A | 495 | 475 | 1 | 46 |
| **B** | **342** | **336** | 7 (all in cities and metropolises) | 37 |
| BE (B with G5) | 375 | 369 | 7 | 42 |

Under B, these powers come in or go out: The Independent Bloc out 2; Noble Houses, The Landed Bloc, Noble Families, Arcane Orders, The Free Alliance, The Tower Alliance and Religious Authorities in, 1 each; Merchant Guilds, The Holy Compact, The Hidden Hand and The Commercial Circle out, 1 each.

**(d) The AI prompt's threats from defence** (`threatProfile.js :: collectThreatSources`; the cuts are internal < 50 → "Civic stability at risk", economic < 40 → "Economic fragility", magical between 0 and 40 where magic is live → "Magical instability"):

| | Births whose threats change | Gained | Lost |
|---|---|---|---|
| A | 277 | Civic stability at risk 146, Economic fragility 108, **Magical instability 39** | none |
| B | 286 | Civic stability at risk 52, Economic fragility 19, **Magical instability 14** | Civic stability at risk **203** (cities' order rises over 50) |

**Every reader of a defence score or band outside the defence pages.** This list comes from a read-only search seat; I confirmed three entries by grep (the legitimacy table, the condition severity cuts and the threat cuts), and the rest are PLAUSIBLE. It is in four groups.

**Readers that re-draw the stored record at birth:**
- `assembleSettlement.js` → `economyReconciliation.js :: projectPower` → `rulingStructure.js` → `factionDynamics.js :: computePublicLegitimacy`. The readiness label is read through `DEFENSE_CONTRIB` (Undefended −10, Vulnerable −5, Lightly Defended −2, Defensible 0, Well-Defended +7, Fortress +10), scaled by tier (thorp 0.3, hamlet 0.4, village 0.6, town 0.85, otherwise 1). It moves the faction powers, the relationships and occasionally the roster of powers.
- `assembleSettlement.js :: withGuardPaidFromDefence`: the economic score's band rewrites the stored guard clause's purse word.
- `conditionPromotion.js :: settlementSeverityModifier`: the mean of military, order and supply crossing 30 or 75 nudges a stored condition's severity by 0.10.
- The coherence receipt (`generationCoherence.js`) and telemetry (`settlementGenerateAction.js`).

**Readers at display, export or AI time, against fixed cuts:**
- `threatProfile.js :: collectThreatSources`, feeding the AI grounding, `contradictions.js`, `capacityModel.js :: deriveMagical`, `districtProfile.js :: inferHook` (magical ≤ 24) and `dailyLife.js :: threatWarning`.
- `causalState.js`: readiness < 40 where the country is plagued; then (readiness − 50) × 0.6 and the order and military-plus-supply lines, feeding `mapProfile.js` (≥ 55 with walls) and the dossier's war front.
- The Overview and Summary tabs and the systems-health prose (65 / 40 / 20).
- The PDF's score bars (`toneForScore`, 70 / 40, a different cut from the screen's 65).
- The PDF and Foundry headline (`defenseHeadline`).
- The edge function's prompt (`summarizeSettlement`) and `aiLayer.js` ("Defense posture: {label}").

**Readers during world-pulse play, read linearly:** `militaryStrength.js`, `armyTransitKernel.js`, `capacityModel.js :: deriveDefense`, and the world-pulse pressure and migration models.

**Readers of `magicDependency` (it does not move with the scores):** "It leans on magic to hold" and `stressorGates.js`. They read the reliance, not the score.

The reader seat also noted three band words that can already disagree with another page, whatever the candidate: the PDF's 70 cut against the screen's 65; `defenseTone` grading "Undefended" as good; and `dailyLifeLogic` printing nothing for "Lightly Defended". These are noted for the chair and not touched.

## 5. The gap candidates and the alchemist, each apart (no anchor factor, and no other candidate)

### G1. The professional city watch opens the watch only
- **Today:** `priorityHelpers.js :: getInstitutionNames.hasGarrison` includes 'professional city watch', so the city watch opens the garrison part and the watch part. Both feed military and order. It is the top rung of the watch's ladder.
- **Move: none.** 1,304 holders, 0 births move, 0 bands, 0 power changes, 0 threats. Every city and metropolis also holds a Garrison or Multiple garrisons. The ten holders before and after are identical (`measure4.txt`).
- **The user-edited city with the watch alone** (the garrison houses removed from each of the 1,304): G1 takes the garrison part away. Mean −9.43 (from −31 to −2); 583 change band (Fortress → Well-Defended 307, Well-Defended → Defensible 211, …). Military −11.5, beasts −14.5, order −14.8 on average.
- **Not in G1:** the page's facts (`defenseFactsOf.hasGarrison` and the bucket keyword) still call the city watch a garrison: "a garrison stands", the Garrison Commander's licence, the force words. Whether they follow is a separate question; nothing is measured on it.
- **Recommend: yes.** It is a zero move on generated towns, it cures the double feed for the 1,304, and it is true for an edited town.

### G2. The household levy opens the militia part
- **Today:** the defence bucket and `defenseFactsOf` count the thorp's "Household levy" as militia, so the page shows a force. `getInstitutionNames.hasMilitia` reads only 'citizen militia' and 'militia', so the rating counts no armed body.
- **Move:** 143 thorps hold a levy; all 143 rise. The mean is +7.67 over holders, and the most is +13. 98 change band: Vulnerable → Lightly Defended 56, Undefended → Vulnerable 30, Lightly Defended → Defensible 12.
  - Military rises 22.2 on average among movers, with 125 band changes.
  - Beasts +9.6 (34 bands); order +7.1 (37 bands).
  - The power structure changes in 42 births (no power appears or vanishes); no threat changes.
- **Why the move is large:** 108 of the 143 also hold a palisade. Today those walls count half as unmanned (limit 2), and the will is held to no armed body. The levy mans them.
- **With the anchor:** the militia ladder becomes two rungs (levy → citizen militia; never both in one birth: 0). Under B the levy reads 0.8 and the citizen militia 1.2, which raises every hamlet's and village's militia. Not measured combined.
- **Recommend: yes.** The rating then counts the force the page shows. Declare it as a move upward for 143 thorps.

### G3 and G3p. "Access to parish church" opens no clergy part (G3), and no parish row either (G3p)
- **Today:** the name matches 'parish church' in the divine keywords and 'church' in `hasChurch`, so the walk opens clergy and parish. The catalogue writes it as **fabric**: "A walk of a few miles to the village house of worship", with no house, no power and no seat. The faith reading itself says "has no church of its own; its people walk to the next village's parish church" (`faithReading.js`).
- **G3 move:** 938 holders (398 thorps, 540 hamlets); 346 fall, mean −1.58 over holders, from −9 to 0. 100 change band: Lightly Defended → Vulnerable 57, Vulnerable → Undefended 42, Defensible → Lightly Defended 1.
  - **Beasts falls by 16.8 on average among movers, from 0 to −30; 221 band changes, 202 of them Weak → Critical.** The clergy's 18 against beasts was the largest beasts part these places had.
  - Order −4.6 (37 bands); military −4.1 (3 bands); supply −7.5 in 45 (17 bands).
  - The power structure changes in 79; 3 births gain "Economic fragility".
- **G3p move:** 735 fall, mean −3.14 over holders, from −12 to 0. 223 change band: Lightly Defended → Vulnerable 114, Vulnerable → Undefended 108, Defensible → Lightly Defended 1.
  - Beasts moves as in G3.
  - Military −3.5 in 727 (115 bands); order −8.9 in 572 (202 bands, 201 of them Weak → Critical); supply −7.0 in 201 (62 bands).
  - The power structure changes in 162; 29 gain "Economic fragility".
- **The recommendation, read from the code's own reasons:**
  - The parish row's words are "Parish as rallying point" (`DEFENCE_WORDS.parish`, source roster).
  - The community rows' reason is "the unpaid defence of a small place".
  - A rallying point is a house that stands in the place. The fabric row is the walk to someone else's.
  - **Recommend G3p** (no clergy, no parish row), declared as the larger move.
  - If the chair keeps the rallying point as a habit of the people rather than a building, G3 alone is the true minimum, and it also ends this house's double feed of order (clergy plus parish).

### G4. The druid houses
- **What each opens today:**
  - **Druid Circle** (village): the druids part ('druid circle'); the magic presence (folk weight); the small place's "actual magic" gate ('druid'); and the druid crisis reliefs (siege, famine, beasts).
  - **Elder Grove Council** (town and up): the druids part ('elder grove'); the magic presence (institutional weight); and the druid reliefs. Its name also matches 'elder' in the elders keywords, but the elders row opens only in small places, where the council is never written.
- **One function at two scales? By the catalogue's own words, yes.** The Druid Circle family declares `ceiling: { tier: 'village', reason: 'In towns and cities the druids speak through the Elder Grove Council.' }` but no `successor`. `successor` is the catalogue's own key for "where its function passes to another family's row", and `familyLadderPairs` turns it into a ladder pair. So no rung is invented: **declare `successor: 'Elder Grove Council'` on the Druid Circle family.**
  - The rows never stand together (0 births).
  - The new pair would let the ladder normalizer remove a circle where a council is seated. That is a generation-side effect of a catalogue edit; with 0 births holding both, it is expected to move nothing, but it is not measured.
- **Move:** apart from the anchor, none. Under B's steps on that ladder alone (circle 0.8, council 1.2): 46 move by ±1, 2 bands, 2 power changes; beasts ±1–3 in 80 (1 band).
- **Recommend: yes** (the `successor` key).

### G5. The alchemist's houses

**What a shop and a quarter open today, and by which reading of the name:**

| Reading | What it gives | True of the house's kind? |
|---|---|---|
| `getInstitutionNames.hasMagicInst` ('alchemist') | The **arcane part**, "retained casters", paid: military 10+, beasts 15+, order where the dial reaches 50 | **No.** The catalogue: "ALCHEMY IS A TRADE (TE-CH-5 / ODQ §541)", `magicLicense: 'none'`, filed on Crafts |
| `DEFENSE_TRADITION_KEYWORDS.alchemy` ('alchemist'), with a granary | The **alchemists part**, "preservation of the grain", supply 8 | Yes |
| The magic presence ('alchemist shop' at practitioner weight, 'alchemist quarter' at institutional weight; alone at dial 50 they add +4 and +7) | The **magic score** | Kept by the chair's ruling (the presence is whole); it already counts the quarter above the shop |
| `hasAlchemy` | The famine and plague reliefs | Yes: remedies and preserving |
| `hasArcane` | The arcane reliefs | No, as the arcane part |
| The `magicDef` bucket ('alchemist') | The Defense tab's "Arcane defense" list and "Arcane Support … Detection, wards, counterspell"; the DS-DEF-5 lines | Presence on the page, not a score. Out of scope here |

**The apothecary's houses:**
- **Apothecary** (village) and **Apothecary (established)** (town) open only the magic presence ('apothecary', practitioner weight). The village row's own text says "Distinct from the alchemist. No magical compounds".
- **Apothecary district** also opens the alchemists part, through the 'apothecary district' keyword: "preservation of the grain" for a district of herbalists and chirurgeons.
- Both readings look untrue of the kind. **Named for the chair; no candidate built, and not measured.**

**G5 = the shop and the quarter leave the arcane opener, and nothing else.**
- 633 holders; 79 fall, mean −1.11 over holders, from −23 to 0. 40 change band: Defensible → Lightly Defended 18, Well-Defended → Defensible 13, Lightly Defended → Vulnerable 6, Defensible → Vulnerable 2, Fortress → Well-Defended 1.
- By tier: towns 59 (38 bands), cities 20 (2 bands). The arcane part closes only where the alchemist's house was the one that opened it.
- Scores:
  - military −16.1 in 63 (36 bands);
  - beasts −15.8 in 79 (34 bands);
  - supply −16.7 in 42 (28 bands);
  - **magic −10.2 in 39 (20 bands: Adequate → Weak 10, Weak → Critical 9) through limit 1**, as in section 3.
- **Magic against the page:** 3 made. **AI threats:** "Magical instability" gained in 10, "Economic fragility" in 11. Power structure changed in 40.
- **Recommend: yes, with the side effect declared.** The house's arcane reading is untrue of its kind. The magic move is the owner's limit 1 at work, not a second reading of the alchemist. The "Magical instability" threat that follows is the threat reader turning a weaker magical defence into wild magic (the review's C-H1 class): that reader's defect, named for the chair.
- Combined with B (BE): 2,674 move, mean +0.22, 375 bands, 369 power changes, 7 powers appear or vanish.

## 6. The law of the count (item b)

"No house feeds ONE SCORE through two parts" was checked two ways.

**The drop test** (each house dropped alone; which of the HOUSE parts move on one score) reads, under each candidate:
- **base 262, A 1,101, B 262, E 262, BE 262** births with a house feeding one score through two of its own parts.
- At base, B, E and BE the 262 are all "Access to parish church", on order, through clergy and parish.
- **A adds 839 births:** the professional city watch (752: military and order, through garrison and watch) and the monastery (87: beasts, through clergy and hospital). Under A, which house stands decides the garrison's factor, so the double feed starts to matter.
- **Not counted as double feeds** (544 rows at base): the moves in a part the house does not open, from the three traditions' shared cap against beasts (R2, ruled: "one job, counted once") and from the derived terrain and will. They are listed in `measure2.txt`.

**The static test** (a house that opens two parts sharing a score, both standing) finds **2,157 births at base**:

| House | Parts | Score(s) | Births | Status |
|---|---|---|---|---|
| Professional city watch | garrison + watch | military, order | 1,304 | **G1 cures it** |
| Access to parish church | clergy + parish | military, order | 463 | **G3 cures it** |
| Parish church (village) | clergy + parish | military, order | 280 | open |
| Monastery or friary | clergy + hospital | beasts | 110 | open |

The drop test cannot see the city watch at base because the Garrison opens that part too. **So the law is not at zero today under any candidate.** No candidate makes a new double feed; after G1 and G3, two remain: the village church and the monastery. Both are named for the chair, unmeasured.

## 7. Six example towns, the corrected tree, in plain words

Ratings only: readiness and its band, then military / beasts / order / supply / magic. The power structure is unchanged unless stated; all figures are in `six2.txt`.

1. **A town with an alchemist's shop** (cold-town-116; also a wizard's tower, a town watch, a courthouse and a monastery). Today 63, Well-Defended, 62 / 40 / 49 / 95 / 60. Under B 62, Well-Defended, 62 / 39 / 45 / 92 / 60. G5 does not move it: its wizard's tower opens arcane anyway.
2. **A city with an alchemist quarter** (cold-city-227). Today 70, Well-Defended, 100 / 98 / 40 / 100 / 89. Under B 72, Well-Defended, 100 / 100 / 48 / 100 / 89.
3. **A thorp that walks to another's church** (cold-thorp-0). Today 25, Lightly Defended, 25 / 22 / 31 / 21 / 0. Under B 24, Lightly Defended, 25 / 18 / 31 / 21 / 0. Under G3 21: its beasts score falls to 4.
4. **A village with a charter hall and a parish church** (cold-village-65). Today 18, Vulnerable. Under B 17, Vulnerable (beasts 36 → 29).
5. **A metropolis** (fresh6-metropolis-30). Today 93, Fortress, order 66. Under B 96, Fortress, order 81.
6. **A town under siege** (cold-under_siege-town-52). Today 49, Defensible, 100 / 67 / 16 / 58 / 28. Under B 46, Defensible, 99 / 62 / 9 / 56 / 28.

Also measured, one of the lane's eight towns: cold-town-139 goes from 41 Defensible to 37 Lightly Defended under B (29 under A), **and its power structure is re-drawn**.

Where G5 bites: cold-wartime-town-75, an alchemist's shop and no other arcane house. Today 53, Defensible. Under G5 30, Lightly Defended (military 82 → 54, supply 65 → 33).

## 8. The proposal: each row for the chair to rule apart. NONE IS BUILT

| Row | What | Declared move (3,756 births) | Recommend |
|---|---|---|---|
| Anchor | `DEFENCE_TUNING.houseScale = { least: 0.8, greatest: 1.2 }` (B) on garrison, militia, watch, court, prison, wardens, company, charter, clergy, druids, market, hospital and alchemists. Walls keep their kind; arcane takes none; community rows, crisis reliefs, stores, purse and will take none | 2,677 move, mean +0.41 (−9 … +9), 342 bands; 336 power re-drawn, 7 powers appear or vanish; scores as in section 3; magic against the page +4; AI threats 286 changed | **B** (A in section 3) |
| G1 | the professional city watch opens the watch only | 0 move, 0 bands, 0 powers; an edited city holding the watch alone −9.4 | yes |
| G2 | the household levy opens the militia | 143 up, +7.67, 98 bands, 42 powers | yes |
| G3 / G3p | the walk to another's church opens no clergy (G3) and no parish row (G3p) | G3: 346 down, 100 bands, beasts Weak → Critical 202, 79 powers. G3p: 735 down, 223 bands, 162 powers | G3p |
| G4 | `successor: 'Elder Grove Council'` on the Druid Circle family | none apart; ±1 in 46 under the anchor; a catalogue edit (the ladder normalizer) | yes |
| G5 | the alchemist shop and quarter leave the arcane opener | 79 down, 40 bands, 40 powers; magic down in 39 by limit 1; "Magical instability" +10 | yes, declared |

**What I would build, if ruled:** one cause per commit, red first.
- **Anchor:**
  - `src/data/defenceWeights.js`: the row and its reason.
  - `src/domain/institutions/defenseInstitutionBuckets.js :: defenseHouseScaleOf`: the one function that reads a house's rung, from `institutionLadders.js :: UPGRADE_CHAINS` restricted to each part's openers, derived once at load. **Check the import order first:** `defenseFacts.js` already imports this module.
  - `computeDefenseScores`: `add` and `paid` multiply the weights by the factor.
- **G1:** one name out of `hasGarrison` in `priorityHelpers.js`.
- **G2:** 'household levy' into `hasMilitia`.
- **G3 / G3p:** the divine names and `hasChurch` read the roster without the fabric row. It should read the catalogue's `isFabricInstitution`, not a re-spelled name.
- **G4:** the catalogue key.
- **G5:** `hasMagicInst`'s 'alchemist' read for the arcane gate only.
- **Tests:**
  - the parts sum exactly to the readiness on unseen births;
  - a red-first test per row;
  - the count-once test (`magicCountOnce.test.js`) and the static count, pinned at what each ruling leaves: 2,157 today, 390 after G1 and G3 (the village church 280, the monastery 110);
  - no literal in the generator;
  - no new record key, no new vocabulary word, no string on any page.
- The golden master is re-recorded with each cause stated.

**What I would not build:**
- the walls by ladder;
- a factor on arcane;
- scaled reliefs;
- any change to the threat reader or to the page words in the first measure's section 5 (the Invasion row's "meaningful deterrence" beside a barracks, among others);
- the apothecary readings, the village church's and the monastery's double feeds, and the page's facts for the city watch. Each is named for the chair.

## Probes (`probes/UPKEEP-CAPACITY/`)

- `census.mjs` (ruling E's hook only with `CAP_ALCH_E=1`) produces `census.json` and `census.txt`.
- `chains.mjs` produces `ladders.txt` and `ladder-of.json`.
- `capacity-measure-2.patch` is the corrected tree's hooks.
- `corpus2.mjs` with `an2.py` produces `measure2.txt` (base, A, B); with `CAP_CANDS=E,BE` and `merge3.py`, it produces `measure3.txt`.
- `corpus3.mjs` with `an3.py` produces `measure4.txt` (G1 to G5, the ten towns each and the edited city).
- `six2.txt`.
- The first measure (0a07f98c7, ruling E on): `corpus.mjs`, `an.py`, `measure.txt`, `six.txt`, `capacity-measure.patch` and `corpus.ndjson.gz`.
- Local refs and config were snapshotted before and after every push; the only change is the upstream tracking line that `push -u` added.

---

# THE BUILD (the chair's rulings of 2026-11-13, after section 8)

Branch `lane/upkeep-capacity-2026-11-13`. The defence lane's tip 7a5f76dc2 is merged in at 8ef42a051 (a merge, not a rebase).
- **The merged base against the measured tree:** the magic presence is identical. The only residual is the will commit befa936dc: 43 of 3,756 records differ, the will part differs in all 43, 34 readiness rise, 3 change band, and the magic score moves in 2 through limit 1.
- **Each commit is measured against its predecessor** on the 3,756 births, born through the whole pipeline (`compare.py`, files `move-<commit>.txt`).
- **The golden corpus is measured, not signed** (`goldens.mjs`: 525 rows, record and defence hashes). No golden's door is opened.

## Correction (my own error, in section 4.3 and the C1 proposal)

I wrote that "the R2 counterfactual watch (a hired-only place with a watch in its stead) takes factor 1: the middle rung under B". That is true only in a town. A village's own watch is the Village watch, the least rung (0.8); a city's is the Professional city watch, the greatest (1.2).

With the counterfactual at 1, `tests/generators/upkeepHired.test.js` reds on four of its five villages:

| Village | Hired-only | With a watch instead |
|---|---|---|
| agree-village-30 | 32 | 30 |
| agree-village-40 | 35 | 33 |
| agree-village-43 | 52 | 51 |
| agree-village-45 | 75 | 71 |

RULED (the chair): the counterfactual watch takes the rung of the watch the catalogue writes at the place's own tier. A thorp and a hamlet, which have no watch written, take the least rung. This is built in C1.

## C0. R2's cap takes the martial will's military as well (the chair's ruling on the stop at C1)

**When R2 broke** (`r2scan.mjs`, `r2-history.txt`). The test's own reading: each of the 36 hired-only births of the corpus against the same record with its hired houses out and its tier's watch in.

| Tree | Military above its watch | Readiness above |
|---|---|---|
| c72917251 (before the will ceased to be paid) | 0 of 36 | 14 |
| 0a07f98c7 (the fourth read's tip) | 0 | 14 |
| 2133873fe (the presence whole) | 0 | 14 |
| **8ef42a051** (with befa936dc, the will unpaid on the hired branch) | **8** | **21** |

**The chair's own ruling W3 opened the military break and widened the readiness gap.** The cap cut only the hired parts' own military. The will is held to the armed bodies' whole points (R13), so a charter hall's 35 against beasts carries more will than a watch does. Once the will on the hired branch went unpaid, that will alone lifted these hamlets and villages above their watch.

**The cure:** where cutting the hired parts' military is not enough, the will's military is held as well, down to the counterfactual. It is a named limit inside the one function; nothing is stored, no weight changes, and readiness stays the exact sum of its parts.
- **Military above its watch:** 0 of 36.
- **Pay reaching the will outside its hold** (the reader's `willpay.mjs`, 1,440 births): 0.
- **Test:** `upkeepHired.test.js` gains the 36 births as a red-first case. It was red on exactly the eight, with the scan's figures, and is green after. No expectation of the five villages changes.

**STILL OPEN, for the chair: readiness above the counterfactual stays in 16 of 36** (14 before W3, 21 at the base).
- The military cap cannot reach it. It is the hired body's own points against beasts and for order: a charter hall's 35 beasts points against a watch's 0.
- Holding readiness too would mean capping the charter's work against beasts at a watch's, which removes the charter's own job in a hired-only place.
- The rule as coded and tested is military only ("as the cap was today's last word on the military"). Not built; the chair rules.

**The declared move** (`move-C0.txt`, against 8ef42a051):
- 20 records differ, all hired-only hamlets and villages.
- Military falls in 20 (as much as −12). Its band changes in 6: Adequate → Weak 5, Strong → Adequate 1.
- Readiness falls in 16 (by 1 to 3). 1 band changes (Lightly Defended → Vulnerable), and 1 power structure is re-drawn (with that band).
- No other score moves; no AI threat; no magic against the page.
- Golden corpus: 0 of 525 rows move.

**The eight, read on their Defense tab** (`pages.mjs` at both trees):
- Only the Invasion & War band word changes, in 5 of them: Adequate → Weak on cold-village-130, fresh6-hamlet-8, cold-hamlet-181 and fresh6-hamlet-41; Strong → Adequate on cold-village-203.
- The sentence under each band already says there is no line and no force ("The village's plan for an army is to not be interesting to one…"; "Knockness has no line and no force…"), so it agrees with the lower band.
- The other three change no line.

**Gates on the touched files:** eslint 0, typecheck:domain:strict 0 (1,113 at its ceiling), typecheck:ratchet 0 (167 at its ceiling). The defence suites are green: upkeepHired, defenceParts, magicCountOnce, and the defence walker.

## C1. A house counts by its rung (the chair's ruling B), with the counterfactual watch at its tier's rung

Commit **94c5d408f**, then the tuning inventory refrozen by its own ritual at that clean tip in **4cb6a7f27** (verified by an ordinary run, 76 of 76).

**What it does:**
- `DEFENCE_TUNING.houseScale = { least: 0.8, greatest: 1.2 }`, with its reason row.
- **The one reader** is a new file, `src/domain/institutions/houseScale.js :: houseRungsOf`. It reads the catalogue's `UPGRADE_CHAINS` restricted to the houses that do the job, comparing names by identity; it holds no table of names. `jobRungAtTier` reads a house no roster holds.
- The generator's `SCALED_PARTS` gives each part its own opener, asked of one house alone. `add` and `paid` multiply the weights by `scaleOf(id)`.

**The move:** `move-C1.txt`, against C0.
- 2,677 move: 1,297 up, 1,380 down; mean +0.41; from −9 to +9.
- 343 bands change.
- Score-band changes: military 56, beasts 324, order 614, supply 59, magic 28.
- 337 power structures are re-drawn, every one with a band move; 7 powers appear or vanish.
- Magic against the page: +4 (cold-famine-town-77, cold-town-2, fresh5-infiltrated-town-0, fresh5-town-27).
- AI threats change in 285 births.
- **Golden corpus:** 273 of 525 rows move, 16 of them change band. This is measured only; no door is opened.

**Pins:**
- `defenseEconomicGate` "identical buildings" is re-keyed by identity: it uses a one-rung market house.
- `upkeepHired` gains a case per tier.
- **Pin census:** the generators, lint, pdf and display suites at C1 against 8ef42a051 (`reds-base-8ef42a051.txt`, `reds-C1.txt`, `pins-C1.txt`). The only new red was the inventory, cured by 4cb6a7f27.
- The domain any-cast ratchet holds at 0 for the new file. Its "every declared overrun is attributed" row is red at base too: the commit it names is not in this shallow clone.

**Registers, each through its own door:**
- The tuning register gains the units for `houseScale`.
- The wiring census stamp is re-taken by its own writer. Its CLI crashes standalone on import order at base too, so run it as `node --import ./src/generators/generateSettlementPipeline.js scripts/wiring-census.mjs`. The producer index goes 1,329 → 1,330; no row moves; `--check` passes.

**Gates:** eslint 0; typecheck:domain:strict 0; typecheck:ratchet 0; validate:tuning-bands 0.

## THE HIRED-ONLY RULE: the band-word count the chair asked for (`r2-bands.txt`, executed)

**7 print a higher readiness band word than their counterfactual with a watch.** That is 7 of the 21 at the base (8ef42a051) and 7 of the 16 after C0: the same seven towns.

| Town | Hired-only | With a watch instead |
|---|---|---|
| cold-hamlet-56 | 25, Lightly Defended | 23, Vulnerable |
| cold-hamlet-91 | 24, Lightly Defended | 23, Vulnerable |
| cold-hamlet-238 | 12, Vulnerable | 11, Undefended |
| cold-village-65 | 14, Vulnerable | 11, Undefended |
| cold-village-98 | 39, Defensible | 35, Lightly Defended |
| cold-village-220 | 24, Lightly Defended | 21, Vulnerable |
| fresh6-hamlet-22 | 24, Lightly Defended | 23, Vulnerable |

**One of my example towns is hired-only:** cold-village-65 (a charter hall and a parish church). Side by side, it reads **14, Vulnerable**; the same village with a Village watch in the hall's stead reads **11, Undefended**. That is the charter's own work against beasts, which the chair ruled true of the world.

# HAND-BACK (2026-11-13, context past the brief's 400k): for a successor on this branch

**Tip:** 4cb6a7f27 on `lane/upkeep-capacity-2026-11-13`, read back from origin.

**Done:**
- the merge of the defence lane at 8ef42a051;
- **C0** at 2c3bd62a4;
- **C1** at 94c5d408f;
- the inventory refreeze at 4cb6a7f27.

**Not done:** C2 to C6, and the eight towns. In every step below, measure on the corpus with `corpus2.mjs` (`CAP_CANDS=base`, drops `0`, at the tree) and `compare.py` against the previous commit's run.

## How to work here (helpers, all in probes/UPKEEP-CAPACITY/)

- **One commit's move:** `CAP_CANDS=base node corpus2.mjs <tree> census.json <out>/c2-<i>.ndjson <i> <n> 0`, then `python3 compare.py <before-dir> <after-dir> <label>`. Readiness, the five scores and their bands, power structures, powers in and out, AI threats, and magic against the page. About 10 minutes on 3 shards.
- **The golden corpus:** `node goldens.mjs <tree> <out>`, then `python3 goldcmp.py a b`.
- **The pages:** `TREE=<tree> node pages.mjs <keys-file> <out-dir>` renders every tab, the PDF and the Foundry journal through the repo's harness.
- **R2:** `node r2scan.mjs <tree> <out> 0 1`, then `python3 r2sum.py <dir> <prefix>`.
- **The pin census:** `sh suites.sh <tree> <log>` runs the generators, lint, pdf and display suites (about 45 minutes, 2 workers). Compare the `^ FAIL ` lines against `reds-base-8ef42a051.txt`.
- **Gates:**
  - `sh scripts/gate-tail.sh npx eslint <files>`;
  - `sh scripts/gate-tail.sh npm run typecheck:domain:strict`;
  - `sh scripts/gate-tail.sh npm run typecheck:ratchet`;
  - tests through `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 …`.
- **The tuning inventory:** refrozen only at a clean committed tip, by `TUNING_INVENTORY_REFREEZE=… TUNING_INVENTORY_NOTE=…` on `tests/lint/tuningRegister.walker.test.js`. That run exits 1 by design; verify with a second, ordinary run.
- **Scratch worktrees** I registered (remove with `git worktree remove`): `wt`, `wt2`, `wt3`, `wt-c72917251`, `wt-0a07f98c7` and `wt-2133873fe` under the session scratchpad. `wt3` is the base 8ef42a051.
- **Before touching `src/domain/institutions/defenseInstitutionBuckets.js`** (C2 and C6): fetch the defence lane and merge its tip again (the seventh seat edits it). Never edit `standingDefenseForces`.

## C2 to C6: what is measured, what is not, and what is settled

All five were measured APART on the corrected tree, with no factor (section 5, `measure4.txt`). **None has been measured on top of C1.** The factor interacts, so each needs its own move measured at its commit.

**C2, G1 (the professional city watch is the watch, on every home).**
- **Settled:** take 'professional city watch' out of `priorityHelpers.js :: getInstitutionNames.hasGarrison` (the `PROFESSIONAL_CITY_WATCH` constant) and out of `DEFENSE_BUCKET_KEYWORDS.garrison` in the buckets file. The facts home (`defenseFactsOf.hasGarrison`, `hasCommander`, `forceName`) follows the bucket.
- **Expected on births:** no rating move with C1. A city's garrison factor is the Garrison's 1.0 either way, and a metropolis's the Multiple garrisons' 1.2.
- **But the stored `defenseProfile.institutions.garrison` loses the city watch in every city and metropolis** (1,304 births). That bucket is persisted, so the golden corpus moves and the Defense tab's force cards change. List every page line that changes with `pages.mjs` on a sample of cities, at C1 against C2.
- **Measured apart:** an edited city holding the watch alone, −9.43 on average.

**C3, G2 (the household levy opens the militia, at its ladder's least rung).**
- **Settled:** add 'household levy' to `hasMilitia` in `getInstitutionNames`.
- **Note:** with C1 the militia ladder becomes two rungs (Household levy → Citizen militia, the family pair). So the levy reads 0.8 and **the hamlets' and villages' Citizen militia rises to 1.2**. Declare it.
- **Measured apart without a factor:** 143 levy thorps up, +7.67, 98 bands. 108 of the 143 also hold a palisade, which today counts as unmanned.
- **The chair's read:** twenty levy thorps after; the force card, the Invasion row and the posture line must agree with the new bands. Not done.

**C4, G3 (the walk to another's church opens no clergy part; the parish row stays) and the one count test.**
- **Settled:** the divine names are read over the roster without fabric rows, via `institutionalCatalog.js :: isFabricInstitution`, which reads its registry by exact name. Use it in the generator, and in `scaledPartsOfHouse` too, so the clergy ladder agrees. `hasChurch` (the parish row) is untouched.
- **Measured apart:** 346 down, beasts Weak → Critical 202.
- **The chair's read:** twenty of those places' Beasts lines on the tab and the PDF; the sentence must be true of a place with no cleric. Not done.
- **THE COUNT TEST, one with `tests/generators/magicCountOnce.test.js`.**
  - **The static arm:** for each house of each birth, take the parts the house opens alone in that place's config, minus the parts an empty roster opens. Keep those standing in the birth that share a score, by the part line's `feeds`.
  - It must read exactly the named two-job houses that share a score: the **village's Parish church** (its clergy's powers; the building as the community's rallying point) and the **Monastery or friary** (its clergy's powers; its infirmary). The magic houses stay named with their two jobs (`TWO_ROLES`).
  - **At base the static arm finds** the professional city watch (1,304), Access to parish church (463), Parish church (280) and Monastery (110). So it is red before G1 and G3, and reads the named two after.
  - **Corpus:** the seventh seat's once8 births have no thorp or hamlet. Add some (the walk to church is a thorp and hamlet row).
  - **The drop arm's "no score through two parts" must exempt the named houses.** The traditions' shared cap against beasts (R2) moves the arcane, clergy and druid parts when one tradition drops. That is a side effect, not a double feed, and the test must class it so.

**C5, G4 (`successor: 'Elder Grove Council'` on the Druid Circle family, that ONE key).**
- **Measured apart:** the rows never stand together (0 births). Under B's steps on that ladder alone (circle 0.8, council 1.2): 46 move by ±1, 2 bands, 2 power structures.
- **To prove: the field diff for the key alone is empty.** Re-birth the corpus at C5 with `druids` taken out of `SCALED_PARTS` in a scratch copy, and compare the whole-record hashes with C4. Then declare the factor's own move.

**C6, G5 (the alchemist is a trade, on every home).**
- **Settled reading:** the arcane opener is `t.hasArcane = … (inst.hasMagicInst || names.arcane)`, and `hasMagicInst` matches 'alchemist'. **Do not change `hasMagicInst` itself**: other generators read it. Give the arcane gate the magic-house flag over the roster without the shop and the quarter, as `alch-measure.patch` measured, or a narrower named flag. The arcane reliefs follow `t.hasArcane`.
- **The page:** drop 'alchemist' from `DEFENSE_BUCKET_KEYWORDS.magicDef`. That bucket is persisted, so the goldens move. Check what `defenseDisplay.js :: deriveSupportingCapabilities` reads for "Arcane Support … Detection, wards, counterspell": it is `magicReliance.js :: magicPractitioners`, the Magic tab's own census. Decide with the chair whether that census changes, because it also feeds the Magic tab.
- **Keep:** the alchemists part and its reliefs, and the magic presence.
- **Measured apart (E):** 79 down, 40 bands; magic falls in 39 through limit 1. **Owed:** the births where Magical Capability then reads against the Magic tab, listed with both lines.

**The cumulative move after C6 against 8ef42a051, and THE EIGHT TOWNS for the owner** (ratings only, after the whole). The six are cold-town-116, cold-city-227, cold-thorp-0, cold-village-65 (hired-only: show both labels as above), fresh6-metropolis-30 and cold-under_siege-town-52. The other two:
- **a thorp with a levy and a palisade:** cold-thorp-191 (22, Vulnerable → 35, Lightly Defended under G2 apart) or fresh6-thorp-52;
- **a hamlet that walks to church:** cold-hamlet-123 (24, Lightly Defended → 15, Vulnerable under G3 apart).

## Executed against plausible

**EXECUTED (each with its probe and output in this directory):**
- C0's and C1's moves, goldens, gates and pin census;
- the R2 history at four trees, the willpay check at 0 of 1,440, and the band-word count;
- the eight hired-only towns' Defense tab before and after C0;
- the candidates G1 to G5 apart, and E/BE, on the corrected tree.

**PLAUSIBLE, not executed:**
- every expectation above for C2 to C6 on top of C1;
- the page-line lists the two read-only search seats gave in sections 4 and 5 (three entries of each spot-checked by grep);
- the C5 normalizer effect of the successor key (0 births hold both rows, so none is expected).

---

# SEAT 2 (UPKEEP-CAPACITY-2): C2 to C6, the cumulative move, the eight towns

**Seat:** UPKEEP-CAPACITY-2, the branch's second seat, building to the chair's rulings of 2026-11-13 (copied here, since the chair's messages are not on the branch):
- THE ANCHOR B, built at C1. ONE LAW FOR EVERY LADDER: a house's factor is read from the rungs that do the job, whatever step opened them; where a step makes a ladder (G2's levy under the militia), its rises are DECLARED with their counts, not special-cased.
- THE HIRED-ONLY RULE STAYS MILITARY, as coded at C0 (the seven band words stand).
- THE LAW OF THE COUNT: one job is counted once; a house opens two parts only where they are two jobs, each named in the test: the magic houses (force and craft), the village's Parish church (its clergy's powers; the building as the rallying point), the Monastery or friary (its clergy's powers; its infirmary).
- G1 the professional city watch is the watch only, on every home. G2 the household levy opens the militia at its ladder's least rung. G3 the walk to another's church opens no clergy part; the parish row stays (G3p not built). G4 the ONE key `successor: 'Elder Grove Council'` on the Druid Circle family. G5 the alchemist's shop and quarter are a trade: out of the arcane opener, the arcane reliefs and the page's "Arcane defense" list; the alchemists part, its reliefs and the magic presence stay; the apothecary's houses are not opened.
- G5's Defense display line ("Arcane Support … Detection, wards, counterspell", `defenseDisplay.js`, reading the Magic tab's census `magicReliance.js :: magicPractitioners`): neither file is touched; the chair has sent the line to the lane that holds the display. This seat lists the births where that line would still print against the stored profile.
- A band that moves re-draws a town's politics (the engine's design): every such move declared with its counts. The page shows the ratings, never the machinery. No new record key beyond what a step names; no new vocabulary word.

**How each step was measured** (helpers in `probes/UPKEEP-CAPACITY/seat2/`, the first seat's in the directory above):
- each commit's tree archived from git (`tree.sh`, integrity-counted), the 3,756 births born at it by `corpus2.mjs` (`CAP_CANDS=base`, drops off; `runc.sh`), and `compare.py` against the step before (`move-<step>.txt`);
- the golden corpus by `goldens.mjs` and `goldcmp.py` (`gold.sh`), measured only: no golden's door is opened;
- the pages by `pages.mjs` at both trees (`pages.sh`), every changed line classed by `pdiff.py` (`<step>-lines.txt`);
- the pin census by `suites.sh` in a detached census worktree (`census.sh`: local refs and config compared before and after every run), its `FAIL` lines against `reds-base-8ef42a051.txt`;
- the gates on the touched files, each through `sh scripts/gate-tail.sh`.

## M. The defence lane's tip merged before C2 (f6e1ad283)

The hand-back's order: the defence lane's seventh seat edits `defenseInstitutionBuckets.js`, so its tip (3ac6abd4c, four commits past 7a5f76dc2: the realm register's war clause, the journal's power names, the PDF's readiness strip, the money line's crisis noun) was merged before C2 touched that file. **No conflict.** It did not touch the buckets file after all. **Its move on the corpus: 0 of 3,756 records differ** (`move-M1.txt`).

**The wiring census, re-taken after the merge** (c6cace837, its own commit): the merge brought the new leaf `crisisNoun.js`, so the committed census was one producer file short and `proseWiringCensus.walker` read it stale (two reds at the merge, measured there). Re-taken by its door; `--check` passes; only `producerIndexFiles` moves, 1,330 → 1,331.

## C2. G1: the professional city watch is the watch only, on every home

**Built:** 'professional city watch' out of `priorityHelpers.js :: getInstitutionNames.hasGarrison` and out of `defenseInstitutionBuckets.js :: DEFENSE_BUCKET_KEYWORDS.garrison`. The facts home (`defenseFactsOf`: `hasGarrison`, `hasCommander`, `forceName`) follows the bucket with no edit. Red first: `tests/generators/upkeepCapacityGaps.test.js`, three tests red at the merge on exactly their assertions (the bucket held the watch; a city with the watch alone had a garrison part; a born city's garrison list held the watch), green after.

**Not a defence home, so not touched (named):** `structuralValidator.js` still counts the city watch as a city's "professional military" (a generation rule, which repairs nothing on these births: every city holds a garrison house), and `threatDefensePolicy.js` lists it among a city's forces.

**The move against the merge** (`move-C2.txt`):
- **1,304 records differ: exactly the 1,304 holders of the city watch.** In each, only the stored `defenseProfile.institutions.garrison` loses the watch.
- Readiness, the five scores, every part, the power structures, the AI threats and magic against the page: **0 moved.** The rest of the record: 0 differ.
- **Golden corpus:** 168 of 525 records move, all in the defence profile; readiness, band and powers 0. Measured only.

**The pages, twenty cities and metropolises** (`pages/C2-lines.txt`, every changed line classed):
- **The force card** reads "3 forces" before and "2 forces" after, in all twenty: the city watch had been counted twice, once as a garrison and once as the watch. True after: a Garrison (or Multiple garrisons) and the watch.
- **The order of the force cards and the Defence list** (tab, PDF, journal): the garrison house now comes before the watch. No name appears or vanishes.
- **The headline** (PDF and journal): "held by the professional city watch" becomes "held by the garrison" in the twelve cities and **"held by the multiple garrisons"** in the eight metropolises. Each is true of the town. The metropolis's article reads badly: the writer is `src/pdf/lib/headlines.js :: defenseHeadline` (`the ${name}`), which already printed it for any metropolis without a city watch. Named for that file's holder; not touched.
- No line on any other tab changes.

**Pins and registers:**
- `defenseInstitutionBucketsWork.test.js` "answers what it answered" re-keyed by identity with the cause: the garrison bucket holds the Garrison Barracks alone, and the watch holds the city watch.
- **The record register** (`recordRegister.js :: KEY_UNPROVEN_AT_LENGTH_ONE`, through its own door with a dated note): `defenseProfile.institutions.garrison` JOINS (10 → 11). With the watch out, no city of the golden corpus lists more than one garrison house, and `recordRegisterTotality.walker` A4 says such a row "must JOIN".
- **The holder table cites the buckets file BY LINE** (`src/domain/prose/holderTable.js`, five rows): the cure keeps every line of that file where it was (the note rides on the edited line), so no citation moves.
- My own red, cured before the push: the first cut of the new test had a bare `not.toContain` (`negativeAssertionAnchor.walker`); it now uses `expectAbsentWithAnchor` with the garrison house as the anchor.

**The pin census** (`census-C2.log`, the generators, lint, pdf and display suites, 563 files, run at the first cut 2b1cd8c5e): 47 `FAIL` lines against the base's 41 (`reds-base-8ef42a051.txt`); none gone. **Six new, each attributed by running its file at the merge and at the step:** two are the merge's (the wiring census, cured by c6cace837), four this step's (the anchor walker's two, the holder table's line citations, the register's A4), each cured as above. At the pushed C2 those four files and the defence suites read 128 of 128. Local refs and config compared before and after: the only change was this seat's own branch head.

**The tree measured:** the corpus, the goldens and the pages were run at the first cut 2b1cd8c5e; the pushed C2 differs from it only in a comment's place, the test's anchor and the register row (no generator byte), and its golden corpus reads the same 525 hashes.

**Gates** (each through `gate-tail.sh`): eslint 0 on the touched files; typecheck:domain:strict 0 (1,113 at its ceiling); typecheck:ratchet 0 (167 at its ceiling).

## C3. G2: the household levy is the militia, at its ladder's least rung

**Built:** 'household levy' into `priorityHelpers.js :: getInstitutionNames.hasMilitia`; the defence bucket and the facts home already read it so. By the one law for every ladder (no special case), the militia's ladder is now the catalogue's two rungs, Household levy → Citizen militia: **the levy reads 0.8 and the hamlets' and villages' Citizen militia reads 1.2.** Red first: `upkeepCapacityGaps.test.js`, three tests red at C2 (the roster flag; the levy thorps' militia part, at the least rung; the citizen militia at 1.5 times the levy in the same place), green after.

**Correction of the hand-back, by name:** it said that 108 of the 143 levy thorps hold a palisade "which today counts as unmanned". **That is false at this tree:** the small place's armed households are an armed body (`ARMED` holds `households`), so those palisades were already manned and counted whole (cold-thorp-191: walls 6.0 of 6.0 at C2, no unmanned line). The levy's rise is its own militia part, the will it now carries (R13) and what that force lets sustain (limit 1).

**The move against C2** (`move-C3.txt`): **388 places rise, none falls**; mean over all +0.31; 95 bands, all up one (Vulnerable → Lightly Defended 50, Undefended → Vulnerable 37, Lightly Defended → Defensible 8). Towns and larger: 0.

| | Holders | Rise | Mean over holders / most | Bands | Power structures re-drawn |
|---|---|---|---|---|---|
| Levy thorps | 143 | 143 | +6.26 / +10 | 74 | 34 |
| Citizen militia (hamlets and villages; the 1.2 rung) | 256 | 245 | +1.07 / +2 | 21 | 21 |

- Military: 396 rise (levy thorps +19.0 on average among movers, at most +33; the militia hamlets and villages +2.0); 136 band changes, all up (Weak → Adequate 75, Adequate → Strong 31, Critical → Weak 19, Critical → Adequate 8, Weak → Strong 3).
- Beasts: 384 rise; 63 bands up (Critical → Weak 59). Order: 347 rise; 40 bands up. Supply 9 and magic 3 rise (through limit 1); no band.
- **55 power structures re-drawn, each with a band move; no power appears or vanishes; no legitimacy label changes.** No AI threat changes; magic against the page 0.
- The rest of the record: 168 differ outside defence and powers: in the 143 levy thorps, the stored copy of the roster flags `economicState.compound.inst.hasMilitia` (and the safety profile's copy) turns true; in 25 militia places, the power trace's legitimacy figure follows the readiness.
- **Golden corpus:** 0 of 525 rows move.

**The pages: twenty levy thorps and ten militia hamlets and villages** (`pages/c3-force.txt`, `pages/C3-lines.txt`):
- The force card names the levy or the militia before and after: unchanged, and agrees.
- **The Invasion & War row** rises with the military score in 18 of the 30 (for example cold-famine-thorp-10 Critical → Adequate, cold-thorp-195 Critical → Adequate); its sentence already spoke of armed townsfolk ("Every household … would send someone to the walls"), and now its band agrees with it.
- **The posture band word** rises in 15 (as the move above), and the guard assessment's band line follows it (for example "You can walk into the centre of Ononkotan without being stopped" → "Ononkotan has not been attacked lately, and if it were, it would struggle to hold").
- **The selector's known fault, counted:** 3 of the 30 still print a "nobody" line beside a levy or a militia after the move: cold-thorp-191 and fresh6-famine-thorp-18 ("Much of …'s perimeter has nobody on it"), fresh6-famine-hamlet-7 ("You can walk into the centre … without being stopped, challenged or counted by anybody at all"). Both lines are their band's pool lines; cured on another lane.

**Pins:** none re-keyed (the C2 test file gains this step's describe). **Pin census** (`census-C3.log`): 41 `FAIL` lines, exactly the base's list; none new, none gone. Local refs and config compared: the only change was this seat's own fetch of the defence lane.

**Gates:** eslint 0 on the touched files; typecheck:domain:strict 0 (1,113 at its ceiling); typecheck:ratchet 0 (167 at its ceiling).

**The tree measured:** the corpus, goldens and pages ran on a measuring commit of the same generator bytes (ed9ec6702, on the first cut of C2); this commit's generator differs from it in no byte.

## C4a. G3: the walk to another's church opens no clergy part; the parish row stays

**Built:** `defenseGenerator.js :: housedOf`, the roster without its fabric rows (`institutionalCatalog.js :: isFabricInstitution`, the catalogue's own registry, read by exact name). The traditions' names are read over it, in the generator and in `scaledPartsOfHouse`, so the clergy's ladder agrees. The small place's parish row (`hasChurch`) still reads the whole roster. Of the catalogue's fabric rows, only "Access to parish church" answers any tradition's name (measured: it answers `divine` alone), so nothing else moves. Red first: `upkeepCapacityGaps.test.js`, two tests red at C3 (a walking thorp and hamlet had a clergy part and the divine tradition; the clergy's ladder read the village's Parish church as its second rung), green after.

**THE COUNT TEST IS IN C4b, NOT HERE, AND WHY:** on this tree its static arm reads a third house that shares a score, the Wayside shrine (the stop below and the chair's G3s). A test is never skipped, so it lands where it is green: C4b.

**The ladder, by the one law:** the walk was the clergy's least rung (1 of 5). Out of the ladder, the village's Parish church is the least (1 of 4): its factor falls from 0.9 to 0.8; a town's Parish churches (2–5) from 1.0 to 0.93; a city's (10–30) from 1.1 to 1.07; the metropolis's (50–100+) stays 1.2. Declared, not special-cased.

**The move against C3** (`move-C4a.txt`): 674 move (568 down, 106 up), mean −0.35, from −8 to +2; 107 bands.

| | Holders | Down / up | Mean over holders (extremes) | Bands | Beasts moved, band changes | Power structures |
|---|---|---|---|---|---|---|
| The walk to church (thorps, hamlets) | 938 | 346 / 106 | −1.17 (−8 … +2) | 97 | 463, −8.8 among movers (to −27); Weak → Critical 97 | 77 |
| The parish ladder (villages to cities) | 2,676 | 222 / 0 | −0.08 (−1 … 0) | 10 | 565, −1.5; Weak → Critical 82 | 10 |

- **The 106 that rise are walking places with a wayside shrine**: with the walk off the ladder, their clergy part is opened by the shrine alone (its religion gate), and the shrine stands on no clergy ladder (the scale reader's clergy job is the parish houses, the monastery and the cathedrals), so the part counts whole, 1, instead of the walk's 0.8. That is the shrine's clergy reading at work, and C4b closes it.
- The five scores (all births): military 73 moved, 6 bands; beasts 1,028, 237 bands (Weak → Critical 179, Critical → Weak 39); order 510, 37 bands; supply 152, 21 bands; magic 56 (limit 1), 1 band.
- **87 power structures re-drawn, every one with a band move; no power appears or vanishes; one legitimacy label changes.** AI threats: 4 gain "Economic fragility". Magic against the page: 0.
- The rest of the record: 86 differ outside defence and powers; 85 of them re-draw their power structure, and the two read field by field differ only in the power trace's legitimacy figure.
- **Golden corpus: 0 of 525 rows move.**

**The pages: twenty places that walk to church** (`pages/c4a-beasts.txt`; the Beasts & Monsters row on the tab and in the PDF, at C3 and C4a):
- The band word falls Weak → Critical in 7 of the 20; the rest hold.
- **Every sentence is true of a place with no cleric.** None speaks of clergy, a priest or divine help, before or after; no new line on any surface speaks of them.
- Two things named for the holder of the Beasts rows (`dossierStateProse/defense.generated.js`, DS-DEF-2), not touched:
  - **9 of the 20 tabs print no sentence under the Beasts row** at all, before and after (the row goes straight to "Invasion & War"); the PDF prints one.
  - The tab's sentence is drawn from a pool keyed on the threat and the force, not on the band: 5 of the 20 now print "… holding against the creatures, but each season wears them down" or "… has answered it properly: there is a wall to hold and there are people to hold it" beside a Critical band.

## STOP AT C4, RULED: the wayside shrine (the chair's G3s)

**Found:** the one count test's static arm (`once.mjs` on the 3,756 at C3, `once-C3.txt`) read, after G1 and G3, the two named houses AND a third: the **Wayside shrine**, clergy and parish on order, in 143 small places. The first seat's count missed it. The catalogue says of it "No resident clergy" at every tier, yet with religion at 65 or more it opened the clergy part (`DEFENSE_TRADITION_KEYWORDS.divineShrine`: 'shrine').

**Sent to the chair; RULED (the chair's, vetoable by the owner): G3s, as recommended.** The wayside shrine opens no clergy part and keeps its parish row. The reason, the chair's: the law of the count lets a house open two parts only where it does two jobs, each named; the clergy's powers are a job the shrine does not do, whatever the religion dial reads; the building as the place's rallying point is the one job it does. Built as its own commit, C4b, on top of G3.

## C4b. G3s: the wayside shrine opens no clergy part; its parish row stays. THE ONE COUNT TEST

**Built:** 'shrine' out of `DEFENSE_TRADITION_KEYWORDS.divineShrine` (its line kept, the note on it). Of the catalogue's names, 'shrine' answered the Wayside shrine alone; 'temple' answers none and 'friary' the Monastery or friary, which the divine list reads anyway. The parish row (`hasChurch`) is untouched.

**THE ONE COUNT TEST** (`tests/generators/magicCountOnce.test.js`, one file with the magic houses' law):
- **The static arm** (new): for each house, the parts it opens ALONE in its own place (config, tier and economy kept), minus what an empty roster opens there; of those standing in the birth, the pairs that share a score. It must read EXACTLY the named two-job houses (`TWO_JOBS`: the village's Parish church, its clergy's powers and the building as the rallying point; the Monastery or friary, its clergy's powers and its infirmary), and each is anchored as present.
- **The wayside shrine by name** (`ONE_JOB`): wherever it stands, it opens one part, the parish row.
- **The drop arm** ("no house feeds one score through two parts") now exempts only the named two-job houses, and classes R2's shared cap against beasts apart: a tradition part that stays open and moves only because another tradition opened or closed (anchored: the cap is at work in the corpus).
- The two-role list (the magic houses) stands as it was, and accepts the named two-job houses.
- **The corpus:** the seventh seat's once8 births, plus 108 births in the app's own shape with the dials drawn at every tier (thorps and hamlets among them, since the walk and the shrine are their rows and a clergy part opens only where religion is high), plus five of each class the static arm reads on the 3,756 (every fifth of each list).
- **Red first:** at C4a the static arm and the shrine test are red on exactly the wayside shrine (12 places of the test's corpus: "internal: parish+clergy"), and the two-role test on one shrine (clergy and magic); all five green at C4b. `upkeepCapacityGaps.test.js` adds the shrine thorp (cold-thorp-20), red at C4a and green after.
- **What the static arm reads on the 3,756** (`once.mjs`): at C3, the walk 387, the Parish church 227, the shrine 143, the Monastery 110 (the city watch already 0 after C2). After C4b the walk and the shrine are 0, and the two named houses remain.

**The move against C4a** (`move-C4b.txt`): **117 places, all down** (60 thorps, 57 hamlets): the 117 of the 262 shrine holders where the shrine alone opened the clergy part. Mean over them −4.8, at most −9. 46 bands: Lightly Defended → Vulnerable 30, Vulnerable → Undefended 13, Defensible → Lightly Defended 3.
- Beasts −0.52 over all births, at most −18; 76 band changes (Weak → Critical 72). Order 106 moved, 26 bands; military 20, 5 bands; supply 19, 8 bands; magic 0.
- **The defence profile's divine tradition** (`traditions.hasDivine`) turns false in all 117; the parish row stands in all 117.
- **27 power structures re-drawn, each with a band move; no power appears or vanishes; no legitimacy label changes.** AI threats: 1 gains "Economic fragility". Magic against the page: 0. The rest of the record: 28 differ outside defence and powers (the power trace's legitimacy figure).
- **Golden corpus: 0 of 525 rows move.**
- The real C4b tree reproduces the measured G3s variant on all 3,756 records (0 differ).

**The pages: twenty of the 117, after** (`pages/c4b-faith.txt`, `pages/C4b-lines.txt`):
- **The Beasts line**, tab and PDF: every one is about walls, fighters or no defence; none speaks of clergy. True of a place with a shrine and no cleric. 19 of 20 read Critical after.
- **No changed line on any surface speaks of clergy, a priest or divine help**, and no "Divine Support" row exists on these pages.
- **Lines that are NOT true of a place with a shrine and no cleric** (present before C4b and after; not this step's, listed for the lane that holds each writer):
  - **"Medical Readiness: Clergy care" / "Clerical care. Basic wound and disease management."**, in all 20 (the PDF's capability rows): `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities`, which reads `economicState.compound.inst.hasChurch` (any 'shrine' or 'church' in a name). Held by another lane; not touched.
  - **"Clergy provide basic wound care: better than nothing, worse than a hospital."** (and its famine form), in all 20 (the PDF): `src/domain/display/threatAssessment.js`.
  - **A chain's divine provision**, in 5 of the 20 ("Divine provision makes up a little more", "divine provision covers 45"): the food balance's `src/generators/economy/foodBalance.js :: hasDivineFood` reads 'parish church' as a substring, so it counts the WALK to another's church (all five hold "Access to parish church"). It is G3's class on another home, the food record's, which this step does not touch: named for its holder.
  - In 8 of the 20 a "Priestly Guidance" power governs, with a priest as its head: there the lines above have a person to stand on, though no house of clergy. In the other 12 nobody on the page is a priest.

## C5. G4: the ONE key `successor: 'Elder Grove Council'` on the Druid Circle family

**Built:** the one key in `src/data/institutionalCatalog.js` (the family's own `ceiling` already said "In towns and cities the druids speak through the Elder Grove Council"). `familyLadderPairs` turns it into the ladder pair Druid Circle → Elder Grove Council, so by the one law the circle reads 0.8 and the council 1.2. Red first: `upkeepCapacityGaps.test.js`, two tests red at C4b (the pair is not in `UPGRADE_CHAINS`; a council counted the same as a circle in the same village), green after.

**THE PROOF THAT THE KEY ALONE MOVES NOTHING:** the corpus born at C5 with `druids` taken out of `SCALED_PARTS` in a scratch copy (`move-C5x.txt`): **0 of 3,756 whole records differ from C4b, and 0 part lists.** The ladder normalizer's new pair removes nothing: no birth holds both houses (0).

**The factor's own move against C4b** (`move-C5.txt`): 69 records differ; readiness moves in 44 (32 up, 12 down), ±1; 5 bands (Lightly Defended → Defensible 2, Defensible → Well-Defended 1, Lightly Defended → Vulnerable 1, Vulnerable → Undefended 1).

| | Holders | With the druids part | Readiness up / down | Bands | Power structures |
|---|---|---|---|---|---|
| Druid Circle (villages; 0.8) | 24 | 18 | 0 / 12 | 2 | 2 |
| Elder Grove Council (towns and up; 1.2) | 600 | 445 | 32 / 0 | 3 | 3 |

- Beasts moves in 69 (±3; 2 bands up); supply 24 and magic 24 through limit 1 (2 bands each); military 2; order 0.
- **5 power structures re-drawn, each with a band move; no power appears or vanishes.** No AI threat; magic against the page 0. Outside defence and powers: 5 records, the same five whose power structure is re-drawn.
- **Golden corpus: 0 of 525 rows move.**
