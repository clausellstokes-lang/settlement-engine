# Defence as the sum of its parts — stage one: measured and shown, NOTHING BUILT (COHERENCE-UPKEEP-5, 2026-11-13)

**For the owner, before anything is built.** No line of `src/` changed for this document. The two variants below were computed beside the lane's tip by a probe; neither is in the product.

**The owner's design (2026-11-13), verbatim:** "I want defensibility to be derived from all of the supporting contributions that prosperity sets teh scale too in some. all of those add up to a score that shows how defensible a place is, rather than we set a place as defensible and then make everything match to that rating".

**The births (3,036; no seat of this lane tuned on any of them).**
- The reviewer's cold births: `cold-<size>-<i>`, 240 of each size from thorp to city and 40 metropolises (1,240).
- The reviewer's forced births: `cold-<famine|under_siege|wartime>-<size>-<i>`, 40 per small size and 84 per town, city and metropolis (1,116).
- Fresh seeds: `fresh5-<size>-0..59` (360), and `fresh5-<crisis>-<village|town|city|metropolis>-0..9` for eight crises (320).
- Born as the reviewer bore them: `birthConfig({...DEFAULT_CONFIG, ...census dials, settType[, selectedStresses]})`, `{ seed, customContent: {} }`. "Calm" below means no crisis was forced; a calm birth may still roll one of its own.

**The trees.** *Base*: the agreement lane's tip `69b53decd` (no upkeep scaling). *Today*: this lane's tip `15fa0c569`. *V1* and *V2*: computed from today's births. The probe is `docs/chair/2026-11-13/probes/UPKEEP-5/` (`parts.mjs`, `births.mjs`, `README.md`).

**Two receipts.**
- **Every term is classed.** The probe recomputes today's formula term by term (`parts.mjs :: today`). It reproduces all five scores and the readiness on **3,036 of 3,036** births. A missed term would show as a miss.
- **The probe moved nothing.** It needs the prosperity label as it stood before any crisis, so it ran in a copy of the tip with two measuring lines added (the label with no crisis, the draw replayed; the stores at that label's share). That copy's births equal the tip's on readiness, scores, months and label in **3,036 of 3,036**.

---

## (a) The formula as it stands

Readiness = the average of five scores (military, monster, internal, economic, magical; four in a world with no magic), plus a size bonus, minus a threat penalty, held between 0 and 100 (`src/generators/defenseGenerator.js:526-556`). Each score is built from contributions, then multiplied by gates, then cut by crises, and held between 0 and 100. Line numbers are at the tip.

| Term | Class | Where |
|---|---|---|
| Community (small places): remoteness 8/4/2; armed households 6/8/10; parish +3 military, +8 order; elders +3, +6; close-knit policing 18/14/10; no den of thieves +6 | CONTRIBUTION | `defenseGenerator.js:149-167` |
| Walls +30 military, +20 monster | CONTRIBUTION | `:202`, `:239` |
| Garrison +28 / +20 / +15 order; militia +10 / +12 / +8; watch +7 military, +18 order | CONTRIBUTION | `:203-205`, `:238-240`, `:273-277` |
| Court +20 order; prison +15 order | CONTRIBUTION | `:273-274` |
| Hospital +5 monster, +10 economic; wardens +12 monster | CONTRIBUTION | `:241-242`, `:312` |
| Arcane force 10–25 (+5 tower, +8 guild) military, 15–25 monster, up to 8 order; clergy 18 monster, up to 10 order, +6 military (strong faith); druids 12 monster | CONTRIBUTION | `:207-213`, `:245-248`, `:281-283` |
| The military dial: ×0.35 military (×0.06 with nothing built or standing; between, for a hired-only place), ×0.25 order (×0.04 without law) | CONTRIBUTION | `:214-218`, `:286` |
| Hired company +14 × what the place can pay; charter hall +10 military, +35 monster, +5 order | CONTRIBUTION | `:226`, `:267`, `:278` |
| Stores: months on a curve, 0 to 70 | CONTRIBUTION | `:305-310` |
| Market +10; sea supply +10; crossroads +8; the economy dial ×0.2; alchemists with a granary +8 | CONTRIBUTION | `:311-319` |
| Magic: the presence score, + faith ×0.12, + druids 6, + guild 8 | CONTRIBUTION | `:349-358` |
| Chains: garrison provisioned ±5; masons +6 / −4; contract chain +4 × pay; food processing +5 / −8 | CONTRIBUTION | `:626-643` |
| Size +12 / +8 / +4 / +2 / 0 | CONTRIBUTION | `:529-533` |
| Terrain ×1.00 to ×1.28 on the military score | MULTIPLIER | `:141-146`, `:220` |
| Pay gates from the prosperity label: military floor 0.6 (over everything above the community, walls included); monster 0.7 (the paid part); order 0.65; economic 0.45 over the WHOLE economic score (the stores and the economy dial too) | MULTIPLIER | `:194`, `:221-223`, `:261-264`, `:292-295`, `:329-330`; read at `steps/assembleSettlement.js:233` |
| Magic's health 0.45 to 1 (magic influence over presence) | MULTIPLIER | `:366-368` |
| The average (÷5, or ÷4) | MULTIPLIER | `:542-545` |
| Ceilings: each score 0 to 100; the three traditions together at most 35 against monsters; a hired-only place never above the same place with a watch; readiness 0 to 100 | CAP | `:218-229`, `:249`, `:549`, `:659-660` |
| Crime: order −0.4 × the crime effect | PENALTY | `:296` |
| Threat: −15 / −7 on readiness; plagued country −15 monster | PENALTY | `:268`, `:536-538` |
| Crises: siege, famine, occupation, plague, succession void, faction split, betrayal, debt, infiltration, monster pressure, each points off whole scores | PENALTY | `:377-483` |
| **The hidden one: the crisis caps the label, and every gate reads the label.** A famine or a siege caps prosperity at Struggling (`economy/prosperity.js:210-211`); a famine also caps base prosperity through the food record (`prosperity.js:313-316`, `foodGenerator.js:497-500`); most other crises take one step (`prosperity.js:212-223`). | PENALTY, through every MULTIPLIER | as named |

**What the hidden penalty costs, measured.** Read today's formula at the label the place had before its crisis:

| Forced births | n | Today | Today, read at the label before the crisis | What the crisis itself takes in V1 (below) |
|---|---|---|---|---|
| famine | 412 | 26.9 | 37.9 | 8.7 |
| under siege | 412 | 30.8 | 42.1 | 6.8 |
| wartime | 372 | 46.8 | 50.3 | 0.1 |

The label costs a famine town 11 points: more than the famine's own penalties. **Wartime has no penalty of its own**: its whole reach to readiness is the label.

---

## (b) The itemised form

Every part is in **readiness points**: its points on the five scores, divided by the number of scores the world has (five; four with no magic). Readiness is the sum of the parts. There is no average to re-weight, no ceiling and no clamp.

**Prosperity sets the scale once, from ONE label: the label before any crisis.** Four kinds of scale:
- **Paid** (wages, provisions, retainers): the part keeps `floor + (1 − floor) × funded` of itself. The floors are today's, per score: military 0.6, monster 0.7, order 0.65, economic 0.45.
- **Bought** (a company, a charter, a contract): the part keeps `bought` of itself.
- **Stores**: laid by at the place's share by the stores' own writer (`foodGenerator.js`), and read as they lie.
- **None**: what already stands, the unpaid, the ground.

| Part | Group | Full points (÷5) | Its one home | Prosperity sets its scale? | What a crisis does to it |
|---|---|---|---|---|---|
| Walls | BUILT | 10 | `defenseGenerator.js:202, :239` | No: it stands | Nothing (V2: half, if no one stands to man them) |
| Masons keeping the walls / walls unmended | BUILT | +1.2 / −0.8 | the fortification chain | No: the chain reads the economy already | Nothing |
| Garrison | STANDS | 12.6 | `:203, :238, :275` | Paid | Famine, occupation, plague, betrayal, debt, infiltration, monster pressure, succession void: their military, order and monster points, shared across the standing parts by size |
| Militia | STANDS | 6 | as above | Paid (fed and armed) | as above |
| Watch | STANDS | 5 | as above | Paid | as above |
| Court; prison | STANDS | 4; 3 | `:273-274` | Paid | the order points of the crises |
| Wardens | STANDS | 2.4 | `:242` | Paid | the monster points |
| The military dial | STANDS | up to 7 military, 5 order | `:214-218, :286` | Paid (built or standing); for a hired-only place the dial's rate is set by pay instead | as the garrison |
| Hired company (+ contract chain) | STANDS | 2.8 (+0.8) | `:226, :637-639` | Bought | as the garrison |
| Adventurers' charter | STANDS | 10 (2 military, 7 monster, 1 order) | `:226, :267, :278` | Bought, the order point too (today it is unscaled) | as the garrison |
| Armed households; parish; elders; close-knit policing | STANDS | 1.2–2; 2.2; 1.8; 2–4.8 | `:149-167` | No: unpaid | as the garrison |
| Arcane practitioners | STANDS | 5–14 | `:207-211, :246, :281` | Paid (retained) | as the garrison |
| Clergy; druids | STANDS | up to 7; 2.4 | `:213, :247-248, :283` | No: a vocation | as the garrison |
| Stores | SUSTAINS | 0–14 by months | `foodGenerator.js` (the months), curve `:305-310` | Stores share | Siege and plague take from it. **The famine does not**: it already ate the stores at their writer ("what is in hand", `foodGenerator.js:331`). Today it takes them twice. |
| Alchemists preserving the grain | SUSTAINS | 1.6 | `:319` | Paid | the economic points of siege, famine, plague, debt |
| Healing (hospital) | SUSTAINS | 3 | `:241, :312` | Paid (refilled) | as above |
| Market | SUSTAINS | 2 | `:311` | Paid | as above |
| The purse (the economy dial) | SUSTAINS | up to 4 | `:317` | No: it IS the economy's reading | as above |
| Food processing; garrison provisions | SUSTAINS | +1 / −1.6; ±1 | `:626-628, :641-643` | No: chain readings | as above |
| Magic (wards, healing, countermagic) | SUSTAINS | up to 20 | `:349-368` | Magic's own health reading (see the open question) | Nothing today |
| Sea supply; many roads in | GROUND | 2; 1.6 | `:313-316` | No | Nothing |
| Remoteness; folk used to beasts; plagued country | GROUND | 0.4–1.6; 0.8–1.6; −3 | `:153, :235-236, :268` | No | Nothing |
| Terrain | GROUND | (×1.00–1.28 − 1) × what is built and stands, military | `:141-146` | No | Nothing |
| Size; threat | GROUND | +12 to 0; 0 to −15 | `:529-538` | No | Nothing |
| Crime | AGAINST | −0.08 × the crime effect | `:296` | No | Nothing |

**How a crisis acts, once.** Each crisis keeps today's points (and today's lessening by faith, druids, arcana and alchemy). Its military, order and monster points come off the STANDS parts; its economic points come off the SUSTAINS parts. Within a group they are shared by each part's size, and a crisis takes no more than the parts hold. It never acts through the label, never multiplies the total and never caps anything.

---

## (c) The two variants, computed and not built

- **V1, the pure sum.** Readiness = Built + Stands + Sustains + Ground + Against (size and threat included), after the crises.
- **V2, the sum with the chair's two plain limits:**
  1. what sustains a force counts for no more than the force it sustains (Sustains ≤ Stands);
  2. walls with no one standing to man them count half. "Someone standing" is a garrison, militia, watch, hired company, charter, armed households, practitioners, clergy, druids or wardens.

**What the limits do on 3,036 births.** Limit 1 bites on **370** births (town 266, village 66, thorp 19, hamlet 14, city 3, metropolis 2). Limit 2 bites on **none**: every walled birth has someone standing.

---

## (d) The ratings, base against today, V1 and V2

**Mean readiness:**

| Births | n | Base | Today | V1 | V1 with today's five ceilings kept (diagnostic) | V2 | Births with a score past 100 points in V1 |
|---|---|---|---|---|---|---|---|
| calm thorp | 300 | 21.1 | 20.5 | 22.0 | 22.1 | 21.9 | 0 |
| calm hamlet | 300 | 18.7 | 17.5 | 18.7 | 18.9 | 18.6 | 0 |
| calm village | 300 | 18.4 | 16.9 | 18.5 | 18.7 | 18.1 | 2 |
| calm town | 300 | 41.8 | 41.9 | 44.7 | 44.5 | 42.1 | 28 |
| calm city | 300 | 66.1 | 70.5 | 80.0 | 73.2 | 79.9 | 249 |
| calm metropolis | 100 | 67.7 | 75.9 | 86.8 | 78.7 | 86.8 | 96 |
| famine | 412 | 31.9 | 26.9 | 43.1 | 40.9 | 42.5 | 147 |
| under siege | 412 | 34.0 | 30.8 | 46.8 | 43.8 | 46.5 | 174 |
| wartime | 372 | 46.5 | 46.8 | 56.1 | 51.8 | 55.7 | 161 |
| other crises (8 kinds) | 240 | 43.0 | 42.7 | 51.4 | 49.0 | 50.1 | 94 |

**Bands moved against the base** (down 2+ / down 1 / up 1 / up 2+):

| Births | n | Today | V1 | V2 |
|---|---|---|---|---|
| calm thorp | 300 | 0 / 18 / 2 / 0 | 0 / 2 / 26 / 0 | 0 / 4 / 24 / 0 |
| calm hamlet | 300 | 0 / 35 / 1 / 0 | 0 / 11 / 17 / 0 | 0 / 11 / 17 / 0 |
| calm village | 300 | 0 / 36 / 4 / 0 | 0 / 13 / 16 / 0 | 0 / 21 / 16 / 0 |
| calm town | 300 | 0 / 24 / 29 / 0 | 0 / 5 / 57 / 0 | 2 / 46 / 44 / 0 |
| calm city | 300 | 0 / 11 / 71 / 0 | 0 / 0 / 137 / 6 | 0 / 0 / 137 / 6 |
| calm metropolis | 100 | 0 / 0 / 39 / 3 | 0 / 0 / 54 / 7 | 0 / 0 / 54 / 7 |
| famine | 412 | 3 / 138 / 14 / 0 | 0 / 5 / 159 / 44 | 1 / 14 / 151 / 44 |
| under siege | 412 | 0 / 87 / 21 / 0 | 0 / 5 / 183 / 41 | 0 / 11 / 180 / 41 |
| wartime | 372 | 0 / 46 / 39 / 1 | 0 / 6 / 123 / 10 | 0 / 17 / 118 / 10 |
| other crises | 240 | 0 / 40 / 38 / 1 | 0 / 6 / 81 / 14 | 1 / 20 / 74 / 14 |

**What these say, in four findings.**

1. **The crisis now acts once, and crisis towns rise.** Today a famine or a siege cuts readiness twice: by its own points, and by capping the label every paid part reads. In V1 only the first remains, so famine towns rise 31.9 → 43.1 against the base (today: 26.9). The review's three two-band famine falls become: cold-famine-city-0, Fortress 77 → 84 Fortress (it was **Wealthy** before the famine); cold-famine-town-25, Defensible 45 → 47 Defensible; cold-famine-town-68, Lightly Defended 24 → 27 Lightly Defended.
2. **Without the five ceilings, big places keep counting.** Today each score stops at 100, so a city whose forces would score 160 on military counts 100. In the pure sum, every part counts. **103 births go past 100 points** (61 metropolises, 42 cities). This explains most of the city and metropolis rise: kept ceilings would give 73.2 and 78.7 instead of 80.0 and 86.8. It also hides a crisis in a large place: cold-under_siege-metropolis-62 sums to **108 (Fortress)** while besieged (base 57), because its forces overflow by far more than the siege takes (3 points after its arcane and divine relief). Whether "more than enough" should keep counting is the owner's to say. The chair's V2 does not touch it.
3. **V2's first limit lands on towns with stores and magic but little force.** Calm towns: 46 fall a band and 2 fall two. The deepest:
   - cold-town-142 (Comfortable, no garrison or watch, a succession void): base 28 → V2 4. Its stores, magic and hospital (23.8) are held to its force (3.8).
   - fresh5-town-37 (Wealthy, walls, no standing force): 38 → 16.
   - cold-town-3 (Wealthy): 34 → 15.

   The rule says a granary without soldiers defends nothing, and it says so hard. Its second limit (unmanned walls) never bites.
4. **The biggest falls in V1 are poor places that the base paid in full.** cold-town-131 (Poor): base 45 → V1 34. The base read the economy dial (at or above 50, full pay); the one home reads Poor, so its garrison keeps 79% and its charter 55%. Crime takes 7.6 points, and walls 10.

**The movers, each by its parts** (V1 unless named; the full lists are in `probes/UPKEEP-5/movers.txt`):

| Town | Base → V1 / V2 | The parts that move it |
|---|---|---|
| cold-under_siege-metropolis-62 (Prosperous before the siege) | 57 → 108 / 108 | magic 18.6, stores 13.0, garrison 12.4, arcane 11.9, walls 10, charter 9.9; military overflows to 164; the siege takes 3.0 |
| cold-famine-metropolis-50 (Comfortable before) | 38 → 88 / 88 | magic 16.2, stores 14.0 (eaten by the famine at the writer, not again), garrison 11.6, arcane 10.6; the famine takes 6.8 |
| cold-wartime-metropolis-77 (Prosperous before) | 57 → 105 / 105 | wartime takes nothing; military overflows to 201 |
| cold-town-131 (Poor, calm) | 45 → 34 / 34 | garrison 9.9 of 12.6 (paid at Poor), charter 5.5 of 10, crime −7.6 |
| cold-famine-village-28 (Struggling) | 7 → 0 / 0 | the famine takes 7.0; crime −7.6; almost nothing stands |
| cold-town-142 (Comfortable, succession void) | 28 → 27 / **4** | V2: sustains 23.8 held to the force 3.8 |

---

## (e) Eight towns, the sums written out

Each part is shown as: its full points → what it counts after pay and the crisis. Base = the agreement tip; today = this lane's tip.

**1. A poor walled city in famine: cold-famine-city-75.** Poor before the famine, Struggling under it. Road, forest, frontier.
**Base 24 Lightly Defended · today 25 Lightly Defended · V1 36 Lightly Defended · V2 36 Lightly Defended.**
- **Built:** walls 10 → 10; walls going unmended −0.8.
- **Stands:** garrison 12.6, paid at Poor (79%), famine −2.0 → 7.9.
  - watch 5 → 2.7; court 4 → 2.0;
  - the military dial 6.2 → 3.6;
  - hired company 2.8, paid at Poor (55%) → 1.3;
  - adventurers' charter 10 at 55% → 4.5;
  - arcane practitioners 6.6 → 4.4.
- **Sustains:** stores, 3.3 months → 5.2 (the famine ate them at the writer, not again). Alchemists 1.6, the market 2 and the purse 0.2 are all taken by the famine → 0. Garrison unprovisioned −1. Magic 12.2 at 59% health → 7.2.
- **Ground:** forest +2.3; folk used to beasts +0.8; frontier −7.
- **Against:** crime −7.6.
- **The famine takes** 13.1 economic, 10 military, 20 order, 8 monster points (in all, 10.2).
- **V2:** sustains 11.4 against a force of 26.4; no limit.

**2. A prosperous unwalled trade town that hires a company: cold-town-139.** Prosperous before a mass migration took it to Comfortable. A port, no walls, a watch and a hired company.
**Base 38 Defensible · today 40 Defensible · V1 41 Defensible · V2 35 Lightly Defended.**
- **Stands:** watch 5, court 4, the military dial 5.2, hired company 2.8; all paid in full.
- **Sustains:** stores, 6.5 months → 9.4; market 2; purse 1.6; garrison unprovisioned −1; magic 11.8 at 88% → 10.4.
- **Ground:** sea supply +2; coast +0.1; size +2; heartland 0.
- **Against:** crime −2.8.
- **V2:** sustains 22.4 are held to the force 17, so 5.4 points go.

**3. A thorp: cold-thorp-0.** Struggling and isolated, in hills on the frontier.
**Base 27 · today 24 · V1 26 · V2 26: Lightly Defended in all four.**
- **Stands:** armed households 1.2; the parish 2.2; elders 1.8; close-knit policing 4.8; clergy 3.6; the military dial 0.2. All are unpaid, and none is scaled.
- **Sustains:** stores, 1.4 months → 2.6; purse 2.
- **Ground:** size +12; remoteness +1.6; hills +0.5; folk used to beasts +0.8; frontier −7.
- **Against:** crime −0.4.

**4. A garrison town under siege: cold-under_siege-town-52.** Comfortable before the siege. Walls, a garrison, a watch; on a mountain.
**Base 34 Lightly Defended · today 28 Lightly Defended · V1 45 Defensible · V2 45 Defensible.**
- **Built:** walls 10.
- **Stands** (all paid in full; the siege's order points shared): garrison 12.6 → 11.9; watch 5 → 4.2; court 4 → 3.1; the military dial 5.2 → 4.7; clergy 4 → 3.9.
- **Sustains** (the siege's supply points shared): stores, 6.1 months, 9 → 5.8; hospital 3 → 2.3; market 2 → 1.3; purse 1 → 0.6; garrison unprovisioned −1; magic 7.2 at 79% → 5.7.
- **Ground:** mountain +4.5; size +2; folk used to beasts +0.8; frontier −7.
- **Against:** crime −8.
- **The siege takes** 25 economic and 15 order points (8.0).
- **Today** it is rated as a Struggling town, then besieged.

**5. A rich city at peace: cold-city-16.** Wealthy, on a road in hills, frontier.
**Base 87 · today 87 · V1 103 · V2 103: Fortress in all four.**
- **Built:** walls 10.
- **Stands:** garrison 12.6, watch 5, court 4, the military dial 8, hired company 2.8, charter 10, arcane 11.2.
- **Sustains:** stores, 9 months, 11.4; alchemists 1.6; hospital 3; market 2; purse 4; garrison provisioned 1; magic 19.4.
- **Ground:** hills +5.1; folk +0.8; frontier −7.
- **Against:** crime −1.6.
- **Today** four of its five scores sit at the ceiling of 100. The sum counts past it, to 103.

**6. A rich city struck by famine: cold-famine-city-0** (the review's: Fortress 77 → Defensible 54 today). Wealthy before the famine. River, walls, a garrison, a watch, a charter, arcane practitioners.
**Base 77 Fortress · today 54 Defensible · V1 84 Fortress · V2 84 Fortress.**
- **Today**, the famine's cap makes it a Struggling city: every paid part keeps about 75%, its charter 40%, and its stores 7.1 months instead of 8.7.
- **In the sum,** it pays as the Wealthy city it is. The famine takes 10.6 points from what stands and from the market and purse, and its stores are eaten once, at the writer.
- **The parts:**
  - walls 10;
  - garrison 12.6 → 10.9;
  - charter 10 → 8.9;
  - arcane 13 → 11.5;
  - stores 11.2;
  - magic 18;
  - frontier −7.

**7. A hamlet with only a charter hall, that can pay: cold-hamlet-56.** Comfortable, at a crossroads.
**Base 25 · today 25 · V1 25 · V2 25: Lightly Defended in all four.**
- **Stands:** adventurers' charter 10, bought at Comfortable (90%) → 9.0; armed households 1.6; parish 2.2; elders 1.8; close-knit policing 4.0; the military dial 1.2 (its rate set by pay).
- **Sustains:** stores, 1.5 months, 2.8; purse 1.8.
- **Ground:** size +8; many roads in +1.6; hills +1.0; remoteness +0.4; folk +0.8; frontier −7.
- **Against:** crime −4.2.

**8. A hamlet with only a charter hall, that cannot pay: cold-hamlet-91.** Poor, on a road.
**Base 25 Lightly Defended · today 22 Vulnerable · V1 23 Vulnerable · V2 23 Vulnerable.**
- **Stands:** adventurers' charter 10 at Poor (55%) → 5.5; armed households 1.6; parish 2.2; close-knit policing 4.0; clergy 4.4; the military dial 0.4.
- **Sustains:** stores, 1.3 months, 2.4; purse 1.0.
- **Ground:** size +8; hills +0.7; remoteness +0.8; folk +0.8; frontier −7.
- **Against:** crime −2.2.
- **Read with 7:** the same charter hall is worth 9.0 where it can be paid and 5.5 where it cannot. This is the owner's "if they have the cash, then that means something", said as a number. In V1 it moves the pair three points apart.

---

## Open questions the build would carry (each the owner's, none taken)

1. **Past 100.** The pure sum has no ceiling: 103 of 3,036 births sum past 100, and a besieged metropolis reads 108. Who reads the number:
   - the Defense tab prints it (`EngineSections.jsx:174`);
   - the posture line reads its band (`defenseStateProse.js:832`);
   - public legitimacy reads `(score − 50) × 0.6` (`causalState.js:1063`).

   Either the number counts on (a stronger city is a stronger city), or a part has a natural fullness (a dial that cannot muster more than its people). Neither is built.
2. **Wartime touches no part.** Its only reach today is the label. Under the design, a war that touches nothing does nothing to readiness. Should it take from the stores, the levy or the purse?
3. **Magic's scale.** The magic part reads magic's own health (the magic influence, which the economy and crime dials degrade), not the prosperity label. Should it move to the one home, as the owner's "healing, magic, etc." asks?
4. **The purse.** The economy dial's ×0.2 is wealth itself. In the sum it counts as the dial reads it, and the label does not scale it again (today the label's economic gate does). Should it read the label instead of the dial, as the one home?

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by execution on 3,036 births: today's formula is fully classed, the measuring copy moved nothing, and every figure above. PLAUSIBLE: that the crisis-to-part mapping (economic points from Sustains, the rest from Stands, the famine sparing the stores it already ate) is the reading the owner means. It is a measurement choice, stated here so it can be overruled.
