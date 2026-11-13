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
