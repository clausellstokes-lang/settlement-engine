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
   - cold-town-142 (Comfortable, a town watch and a court, no garrison, a succession void): base 28 → V2 4. Its stores, magic and hospital (23.8) are held to its force (3.8). *CORRECTED in the addendum: an earlier wording said it had no watch; it has a town watch.*
   - fresh5-town-37 (Wealthy, walls, a town watch, no garrison): 38 → 16. *CORRECTED: an earlier wording said no standing force; it has a town watch.*
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

---

# ADDENDUM (the chair's R10, records 317, 318 and 320): V3, and what defence reads

**Correction first, by name.** In finding 3 above I said cold-town-142 had no garrison or watch and fresh5-town-37 no standing force. Both have a **town watch** (and a court). Limit 1 bites them because one watch is small beside their stores and magic, not because nothing stands. The chair's R8 carried my wording; R8's count below is taken on the record.

**V3 is V2 under R1 to R7**, measured on the same 3,036 births. The build is V3 exactly as measured here.
- R1: each of the five scores is the sum of its parts on that score, held between 0 and 100. More than enough is reserve. Readiness is their mean, plus size, minus threat, held between 0 and 100.
- R2: the traditions count 35 at most against monsters. A hired-only place reads no more than the same place with a watch.
- R3: pay reads the STANDING label.
- R5: magic keeps 0.45 + 0.55 × funded.
- R6: the purse is 20 × bought on the economic score (4 points).
- R7: only an armed body mans walls.
- R9: the military dial is the base configuration's slider, not the effective reading. That reading folds in the garrison's presence, crime and the crisis multipliers (`priorityHelpers.js:375-399`), each counted elsewhere.
- Count once (below): the magic score no longer adds the temple, grove and guild a second time, and the criminal houses count once.

## (i) SOURCE and KIND of every term

KIND: **DERIVED** (a function of town facts through their homes) · **CONFIG** (the base configuration's own dial) · **DRAWN** · **STORED-ONLY** · **WEIGHT**.

| Term | SOURCE (home) | KIND |
|---|---|---|
| Walls, garrison, militia, watch, court, prison, hospital, market, charter hall, hired company, granary | the live roster, `settlement.institutions`, through `priorityHelpers.js::getInstFlags` (name keywords there, and `defenseFacts.js::defenseFactsOf` for the company, gates, prison, court, hospital) | DERIVED |
| Wardens, arcane (wizard, mages, guild, tower, teleport), divine (cathedral, monastery, parish church, shrine, temple), druid, alchemy | the roster, **read by name tests inside `defenseGenerator.js:97-130`**: a second reading of the roster outside its home | DERIVED, in breach of the home rule; the build moves them to the roster's defence home `domain/institutions/defenseInstitutionBuckets.js` |
| Community: parish, elders, no den of thieves | the roster, by name tests at `defenseGenerator.js:160-166` | DERIVED, same breach, same move |
| The military dial (today: `militaryEffective`) | `getInstFlags`: the military slider × the garrison's presence × crime × threat × crisis multipliers × neighbour | today DERIVED-with-doubles; **V3: CONFIG** (`getPriorities(config).military`) |
| The economy dial (today ×0.2) | `getInstFlags.economyOutput`: the economy slider × crime × magic × the market's presence × crisis | today DERIVED-with-doubles; **V3: gone**, the purse reads the standing label |
| The magic, religion dials (traditions' thresholds) | `config.priorityMagic`, `priorityReligion` | CONFIG |
| Magic presence | `priorityHelpers.js::computeEffectiveMagicPresence` (roster, magic slider, resources) | DERIVED |
| Magic's health (today) | `magicInfluence / presence` (economy slider, crime) | today DERIVED-with-doubles; **V3: the standing label** |
| Crime | `getInstFlags.criminalEffective` | DERIVED |
| Stores | `economicState.foodSecurity.storageMonths` (`foodGenerator.js::generateFoodSecurity`) | DERIVED |
| Chains: garrison, fortification, contract, food processing | `economicState.activeChains` (`computeActiveChains.js`) | DERIVED |
| Pay (the label) | `economicState.prosperity` through `keep.js::keepOf`; **V3: the standing label**, written by prosperity's own writer (R3) | DERIVED |
| Terrain, route, threat, tier, magic in the world | `config.terrainType`, `tradeRouteAccess`, `monsterThreat`, `settlement.tier`, the world law | DERIVED (birth facts) |
| Crises | `settlement.stress[].type` | DERIVED |
| Every number in the formula | the weight table below | WEIGHT |

**The kinds counted.** The proof below, and the census (`getInstFlags` and `computeEffectiveMagicPresence` draw nothing), show **DRAWN 0 and STORED-ONLY 0**: 0% of any town's readiness comes from either, today or in V3. CONFIG in V3 is the military dial alone as a value (the magic and religion dials only open a tradition). It carries a mean **3.7 points, 8.9%** of a town's V3 readiness.

**The proof of "derived"** (`probes/UPKEEP-5/rederive.mjs`). Birth, store as a save stores it, strip `defenseProfile`, recompute from what is left. Today's profile is equal field for field on **432 of 432** fresh births (`derive5-*`, six sizes, four crises). The build re-runs it for V3, with the standing label as the one new input on the record.

**Saved towns** (the direction census, Q4). A saved town's profile is stored and read as it is: `hydrateFromSave` does not recompute it, and no migration touches it. So **no saved town's rating moves under its user**, and nothing stored is ignored. A regenerate re-births the town and writes the standing label with it. A save made before the change has no standing label; if it is ever recomputed, it reads the label it has (in a crisis, the capped one), as today. One existing staleness, not this lane's: the world pulse's food tick rewrites the months and `scores.disaster`, but not `scores.economic` or readiness (`foodStockpile.js:473-480`).

## The weight table (V3, whole; each row the owner may veto)

| Weight | Value | Reason |
|---|---|---|
| Walls | military 30, monster 20 | the largest built defence; holds against raiders and beasts alike |
| Garrison | military 28, monster 20, order 15 | a standing professional force; it also keeps order |
| Militia | 10, 12, 8 | citizens under arms: less than soldiers, good against beasts |
| Watch | military 7, order 18 | a police force first |
| Court; prison | order 20; 15 | law that is heard and enforced |
| Wardens | monster 12 | rangers: beast lore and tracking |
| Hired company | military 14 (+4 with a working contract chain) | half a garrison, bought |
| Adventurers' charter | military 10, monster 35, order 5 | bounty work against beasts above all |
| Military dial | ×0.35 military, ×0.25 order (×0.04 without law); ×0.06 with nothing built or standing; hired-only 0.06 + 0.29 × bought | how far the town puts itself to arms |
| Community (small places) | remoteness 8/4/2; armed households 6/8/10; parish +3 military, +8 order; elders +3, +6; close-knit policing 18/14/10 | the unpaid defence of a small place |
| Arcane practitioners | military 10 + min(15, (magic − 35) × 0.25), tower +5, guild +8; monster 15 + min(10, (magic − 35) × 0.2); order min(8, (magic − 50) × 0.16) | retained casters |
| Clergy | monster 18; order min(10, (religion − 60) × 0.25); military +6 (strong faith, religion ≥ 70) | turning the dead, compelled truth, a battle blessing |
| Druids | monster 12 | beast lore |
| Traditions against monsters, together | at most 35 | one job, counted once (R2) |
| Stores | 10 a month to 1, then 7 a month to 6, then 4 a month, to 70 | diminishing returns on months laid by |
| Market; hospital; alchemists with a granary | economic 10; economic 10 + monster 5; economic 8 | supply, medicine, preservation |
| The purse | economic 20 × bought | what the town can spend in a crisis |
| Sea supply; crossroads | economic 10; 8 | a land siege cannot cut the sea; many roads in |
| Magic | the presence score, kept at 0.45 + 0.55 × funded | wards and countermagic must be paid for |
| Terrain | ×1.28 mountain, 1.18 hills, 1.12 forest, 1.06 riverside, 1.02 coast, on what is built and stands | the ground strengthens a defence |
| Threat | folk used to beasts +4 (frontier) / +8 (plagued) monster; plagued country −15 monster; readiness −7 frontier / −15 plagued | the land's own dangers |
| Crime | order −0.4 × the crime reading | crime works against order |
| Size | readiness +12 thorp, +8 hamlet, +4 village, +2 town | a small place is easier to hold |
| Pay floors (funded) | military 0.6, monster 0.7, order 0.65, economic 0.45, magic 0.45 | unpaid soldiers desert slowly, never at once |
| Supply chains | garrison provisioned ±5; masons +6, walls unmended −4; food processing +5 / −8 | what the economy keeps working |
| Crises | today's points (siege, famine, occupation, plague, succession void, faction split, betrayal, debt, infiltration, monster pressure), with today's relief by faith, druids, arcana, alchemy | unchanged; each acts once, on the parts it touches |
| Limit 1 | sustains count no more than the force | a granary defends nobody by itself |
| Limit 2 | walls with no armed body count half | a wall needs someone on it |
| Fullness | each score 0 to 100; readiness 0 to 100 | an aspect can be full (R1) |
| Bands | Fortress 76, Well-Defended 55, Defensible 38, Lightly Defended 24, Vulnerable 12 (`bandLadders.js`) | unchanged |

## One direction: readers and inputs (`census-direction.md`, a read of the code; no loop)

**Readers of readiness, its band and the five scores** that feed generation:
- public legitimacy, then faction power (`assembleSettlement.js:244` → `factionDynamics.js:145`);
- condition severity (`conditionPromotion.js:112`);
- the hook check (`hookTruth.js:163`, presence only).

Simulation readers act on saved towns only: causalState (legitimacy, law and order, infrastructure), capacityModel, militaryStrength, armyTransitKernel, threatProfile. The rest is display: the Defense, Overview and Summary tabs, defenseDisplay, defenseStateProse, the PDF.

**Inputs of every part and their writers:**
- the roster (assembleInstitutions and its passes);
- `getInstFlags` (config and roster);
- the config dials (resolveConfig and its passes);
- stress (resolveStress);
- the food record and the chains (economicState);
- prosperity (`prosperity.js`);
- magic presence (priorityHelpers).

**None of these writers reads `defenseProfile`, legitimacy or faction power.** Every input is written before `assembleSettlement.js:233`, and nothing after it changes one. Prosperity reads walls and garrison only as roster names (`_defPremium`, `prosperity.js:268-275`), and the military slider (`_milDrain`). It reads no defence fact.

## What the formula does not read (listed only; nothing built)

- **The powers.** Confirmed: the formula reads no `powerStructure` field. The powers reach it only through the crises of power: succession void, faction split, betrayal, infiltration, as `settlement.stress` types. These are unread, each with its home:
  - who commands the force (`powerStructure.factions`, the governing faction);
  - a seat in contest (`powerStructure` conflicts);
  - a power's own armed following (faction category military or criminal, with its power);
  - the house a hired company answers to (`institutions[].factionSource`).
- The gates. `getInstFlags` writes `hasGates` (`defenseFacts.js`), and no term reads it.
- The kind of wall: palisade, stone or citadel (the roster name).
- The NPCs: a captain or a castellan (`settlement.npcs`).
- The stores held shut (`foodRecord.storesHeld`).
- Neighbours. Today they are folded into the military dial; V3 reads the slider, so they are read by nothing.
- History: past sieges, breaches (`settlement.history`).

## Count once: double homes found, and the home chosen

1. **The garrison counted again in the military dial.** `militaryEffective` multiplies by the garrison's presence. Home: the Garrison part; the dial reads the slider (R9).
2. **Crime and the crises counted again in both dials.** Home: Crime (against) and each crisis's own points.
3. **The market counted again in the economy dial.** Home: the Market part; the purse reads the label (R6).
4. **The temple, the grove and the guild counted twice:** each stands as its own part, and the magic score added them again (+religion × 0.12, +6, +8). Home: their own parts. The magic score keeps the presence alone, which already counts their houses as magic.
5. **The criminal houses counted twice:** a +6 order bonus for their absence, and the crime reading. Home: Crime.
6. **The magic houses as force and as craft.** Practitioners stand (R5); the presence sustains. These are the same houses in two roles, kept by R5 and named here.
7. **The contract chain and the hired company:** one part. **The garrison's provisions:** a chain fact, its own line. **The charter hall's order point:** inside its one part, now paid as the rest of it.

## (ii) V3 against today, V2 and the base

| births | n | base | today | V2 | V3 | V3 vs today: down 2+ / down 1 / up 1 / up 2+ | V3 vs base: down 2+ / down 1 / up 1 / up 2+ |
|---|---|---|---|---|---|---|---|
| calm thorp | 300 | 21.1 | 20.5 | 21.9 | 23.3 | 0 / 3 / 69 / 0 | 0 / 5 / 55 / 0 |
| calm hamlet | 300 | 18.7 | 17.5 | 18.6 | 19.4 | 0 / 2 / 59 / 0 | 0 / 12 / 35 / 0 |
| calm village | 300 | 18.4 | 16.9 | 18.1 | 18.5 | 0 / 9 / 42 / 0 | 0 / 27 / 28 / 0 |
| calm town | 300 | 41.8 | 41.9 | 42.1 | 44.4 | 2 / 23 / 69 / 0 | 2 / 29 / 78 / 1 |
| calm city | 300 | 66.1 | 70.5 | 79.9 | 74.8 | 0 / 2 / 63 / 4 | 0 / 2 / 117 / 7 |
| calm metropolis | 100 | 67.7 | 75.9 | 86.8 | 79.7 | 0 / 0 / 15 / 0 | 0 / 0 / 50 / 5 |
| famine | 412 | 31.9 | 26.9 | 42.5 | 42.6 | 0 / 3 / 193 / 98 | 0 / 10 / 172 / 47 |
| under_siege | 412 | 34.0 | 30.8 | 46.5 | 46.2 | 0 / 1 / 209 / 69 | 0 / 2 / 200 / 41 |
| wartime | 372 | 46.5 | 46.8 | 55.7 | 52.3 | 0 / 6 / 124 / 1 | 0 / 14 / 109 / 10 |
| other crises | 240 | 43.0 | 42.7 | 50.1 | 49.6 | 1 / 10 / 99 / 0 | 1 / 18 / 83 / 12 |

**R1's fullness.**
- 1,012 births have at least one score full at 100 (its reserve shown). On 352, a score bottoms out at 0: order, under crime.
- No birth's readiness passes either end of the scale.
- Putting fullness before limit 1, instead of after it, changes 29 bands (132 scores).

**R2's inner rules are kept in V3.**
- The traditions' 35 binds on 383 births.
- The hired-only rule binds on 19: cold-hamlet-56, -120, -132, -152, cold-village-168 and others.
- V1 and V2 as first measured did NOT keep either rule.

**Limit 1** bites on 417 births: town 252, village 88, thorp 34, hamlet 21, city 14, metropolis 8.

**Limit 2** (armed body) bites on **0** births. **R8's count: 0 births at any size are walled or wealthy (standing Prosperous or Wealthy) with no armed body.** Every walled town born has at least a watch. The three hard cases each have a town watch, and limit 1 bites them as a watch against a granary.

**R5: magic, by size** (mean points of the magic part):

| Size | V2 | V3 |
|---|---|---|
| town | 7.4 | 6.0 |
| city | 11.0 | 11.2 |
| metropolis | 13.6 | 14.1 |

**R9: the military dial against the roster.** Mean armed houses (garrison, militia, watch, company, charter, wardens) by the slider:

| Size | Low (under 34) | Middle | High (67 and up) |
|---|---|---|---|
| village | 0.33 | 0.36 | 0.50 |
| town | 1.66 | 1.87 | 2.05 |
| city | 3.15 | 3.63 | 3.81 |
| metropolis | 3.50 | 3.90 | 3.95 |

A higher dial bears a few more armed houses, by about 0.4 a town from low to high. The dial's own part is separate: a mean 3.7 points. **A reader's name for it, proposed:** "Martial will", meaning how far the town puts itself to arms.

**Two bands or more against TODAY: 175 births, 172 up and 3 down.** Every one is listed, by its parts, in `probes/UPKEEP-5/movers-v3-two-bands.txt`.
- **All 172 rises** are crisis or random-stress births paid at their standing label where today pays at the crisis-capped one. On each line, today's own formula read at the standing label stands beside it.
- **The 3 falls** are limit 1 under a succession void:
  - cold-town-142: 27 → 8;
  - fresh5-succession_void-town-0: 28 → 10;
  - fresh5-town-37: 38 → 20.

## The eight towns under V3 (each part: [its source] full → counts; V1 and V2 beside)

### cold-famine-city-75: city, label Struggling (standing Poor), crises famine
**Base 24 Lightly Defended · today 25 Lightly Defended · V1 36 · V2 36 · V3 41 Defensible**
- Walls [roster] 10→10 · Walls going unmended [supply chains] -0.8→-0.8 · Garrison [roster] 12.6→8 (famine −1.9) · Watch [roster] 5→2.8 (famine −1.1) · Court [roster] 4→2.1 (famine −1) · Martial strength (the military dial) [military dial (config)] 10→6 (famine −1.7) · Hired company [roster + contract chain] 2.8→1.3 (famine −0.2) · Adventurers' charter [roster] 10→4.5 (famine −1) · Arcane practitioners [roster + magic dial] 6.6→4.4 (famine −0.8) · Stores (3.3 months) [stores months (food record)] 5.2→5.2 · Alchemists preserving the grain [roster] 1.6→0.3 (famine −0.8) · Market [roster] 2→0.3 (famine −1) · The purse [standing label] 4→0.6 (famine −1.6) · Garrison unprovisioned [supply chains] -1→-1 · Magic (wards, healing, countermagic) [magic presence (roster, magic dial)] 12.2→8.2 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -7.6→-7.6 · Terrain (forest) [terrain] 2.5→2.5
- size +0, threat −7; scores {'mil': 98.3, 'mon': 64.8, 'int': 3.2, 'eco': 32.1, 'mag': 40.9}; full at 100, reserve none

### cold-town-139: town, label Comfortable (standing Prosperous), crises mass_migration
**Base 38 Defensible · today 40 Defensible · V1 41 · V2 35 · V3 46 Defensible**
- Watch [roster] 5→5 · Court [roster] 4→4 · Martial strength (the military dial) [military dial (config)] 10.6→10.6 · Hired company [roster + contract chain] 2.8→2.8 · Stores (6.5 months) [stores months (food record)] 9.4→8 · Market [roster] 2→1.7 · The purse [standing label] 4→3.4 · Garrison unprovisioned [supply chains] -1→-0.8 · Magic (wards, healing, countermagic) [magic presence (roster, magic dial)] 11.8→10.1 · Sea supply [route] 2→2 · Crime [criminal reading] -2.8→-2.8 · Terrain (coastal) [terrain] 0.2→0.2
- size +2, threat −0; scores {'mil': 48.8, 'int': 46, 'eco': 75.8, 'mag': 50.4}; full at 100, reserve none; limit 1: sustains 26.2→22.4

### cold-thorp-0: thorp, label Struggling (standing Struggling), crises none
**Base 27 Lightly Defended · today 24 Lightly Defended · V1 26 · V2 26 · V3 25 Lightly Defended**
- Martial strength (the military dial) [military dial (config)] 0.6→0.6 · Armed households [tier] 1.2→1.2 · Parish as rallying point [roster] 2.2→2.2 · Elders and reeve [roster] 1.8→1.8 · Close-knit self-policing [tier + roster] 3.6→3.6 · Clergy (divine) [roster + religion dial] 3.6→3.6 · Stores (1.4 months) [stores months (food record)] 2.6→2.6 · The purse [standing label] 4→1.6 · Remoteness (alarm and flight) [route] 1.6→1.6 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -0.4→-0.4 · Terrain (hills) [terrain] 0.5→0.5
- size +12, threat −7; scores {'mil': 24.5, 'int': 31, 'mon': 22, 'eco': 21}; full at 100, reserve none

### cold-under_siege-town-52: town, label Struggling (standing Comfortable), crises under_siege
**Base 34 Lightly Defended · today 28 Lightly Defended · V1 45 · V2 45 · V3 49 Defensible**
- Walls [roster] 10→10 · Garrison [roster] 12.6→12 (under_siege −0.6) · Watch [roster] 5→4.2 (under_siege −0.8) · Court [roster] 4→3.1 (under_siege −0.8) · Martial strength (the military dial) [military dial (config)] 7.6→6.9 (under_siege −0.7) · Clergy (divine) [roster + religion dial] 4→3.9 (under_siege −0.1) · Stores (6.1 months) [stores months (food record)] 9→6.3 (under_siege −2.7) · Healing (hospital) [roster] 3→2.4 (under_siege −0.6) · Market [roster] 2→1.4 (under_siege −0.6) · The purse [standing label] 4→2.5 (under_siege −1.1) · Garrison unprovisioned [supply chains] -1→-1 · Magic (wards, healing, countermagic) [magic presence (roster, magic dial)] 5.6→5.6 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -8→-8 · Terrain (mountain) [terrain] 4.9→4.9
- size +2, threat −7; scores {'mil': 100, 'mon': 67, 'int': 16, 'eco': 58, 'mag': 28}; full at 100, reserve {'mil': 6.4}

### cold-city-16: city, label Wealthy (standing Wealthy), crises none
**Base 87 Fortress · today 87 Fortress · V1 103 · V2 103 · V3 84 Fortress**
- Walls [roster] 10→10 · Garrison [roster] 12.6→12.6 · Watch [roster] 5→5 · Court [roster] 4→4 · Martial strength (the military dial) [military dial (config)] 6.6→6.6 · Hired company [roster + contract chain] 2.8→2.8 · Adventurers' charter [roster] 10→10 · Arcane practitioners [roster + magic dial] 11.2→11.2 · Stores (9 months) [stores months (food record)] 11.4→11.4 · Alchemists preserving the grain [roster] 1.6→1.6 · Healing (hospital) [roster] 3→3 · Market [roster] 2→2 · The purse [standing label] 4→4 · Garrison provisioned [supply chains] 1→1 · Magic (wards, healing, countermagic) [magic presence (roster, magic dial)] 17.8→17.8 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -1.6→-1.6 · Terrain (hills) [terrain] 4.9→4.9
- size +0, threat −7; scores {'mil': 100, 'mon': 100, 'int': 68, 'eco': 100, 'mag': 89}; full at 100, reserve {'mil': 66.7, 'mon': 7, 'eco': 5}

### cold-famine-city-0: city, label Struggling (standing Wealthy), crises famine
**Base 77 Fortress · today 54 Defensible · V1 84 · V2 84 · V3 79 Fortress**
- Walls [roster] 10→10 · Garrison [roster] 12.6→10.9 (famine −1.7) · Watch [roster] 5→4 (famine −1) · Court [roster] 4→3.1 (famine −0.9) · Prison [roster] 3→2.3 (famine −0.7) · Martial strength (the military dial) [military dial (config)] 4.2→3.5 (famine −0.7) · Adventurers' charter [roster] 10→8.8 (famine −1.1) · Arcane practitioners [roster + magic dial] 13→11.4 (famine −1.5) · Stores (8.7 months) [stores months (food record)] 11.2→11.2 · Healing (hospital) [roster] 3→2.3 (famine −0.7) · Market [roster] 2→1.3 (famine −0.7) · The purse [standing label] 4→2.7 (famine −1.3) · Food processing working [supply chains] 1→0.7 (famine −0.3) · Garrison provisioned [supply chains] 1→1 · Magic (wards, healing, countermagic) [magic presence (roster, magic dial)] 16.4→16.4 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -1.4→-1.4 · Terrain (riverside) [terrain] 1.4→1.4
- size +0, threat −7; scores {'mil': 100, 'mon': 100, 'int': 62, 'eco': 86, 'mag': 82}; full at 100, reserve {'mil': 22.2, 'mon': 1}

### cold-hamlet-56: hamlet, label Comfortable (standing Comfortable), crises none
**Base 25 Lightly Defended · today 25 Lightly Defended · V1 25 · V2 25 · V3 25 Lightly Defended**
- Martial strength (the military dial) [military dial (config)] 1.4→1.4 · Adventurers' charter [roster] 10→8.6 · Armed households [tier] 1.6→1.6 · Parish as rallying point [roster] 2.2→2.2 · Elders and reeve [roster] 1.8→1.8 · Close-knit self-policing [tier + roster] 2.8→2.8 · Stores (1.5 months) [stores months (food record)] 2.8→2.8 · The purse [standing label] 4→3.6 · Remoteness (alarm and flight) [route] 0.4→0.4 · Many roads in [route] 1.6→1.6 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -4.2→-4.2 · Terrain (hills) [terrain] 1→1
- size +8, threat −7; scores {'mil': 34.2, 'int': 12.5, 'mon': 35.5, 'eco': 40}; full at 100, reserve none; hired held to a watch's worth (−0.4)

### cold-hamlet-91: hamlet, label Poor (standing Poor), crises none
**Base 25 Lightly Defended · today 22 Vulnerable · V1 23 · V2 23 · V3 23 Vulnerable**
- Martial strength (the military dial) [military dial (config)] 1→1 · Adventurers' charter [roster] 10→5.5 · Armed households [tier] 1.6→1.6 · Parish as rallying point [roster] 2.2→2.2 · Close-knit self-policing [tier + roster] 2.8→2.8 · Clergy (divine) [roster + religion dial] 4.4→4.4 · Stores (1.3 months) [stores months (food record)] 2.4→2.4 · The purse [standing label] 4→2.2 · Remoteness (alarm and flight) [route] 0.8→0.8 · Folk used to beasts [threat] 0.8→0.8 · Crime [criminal reading] -2.2→-2.2 · Terrain (hills) [terrain] 0.7→0.7
- size +8, threat −7; scores {'mil': 28.2, 'int': 18.8, 'mon': 41.3, 'eco': 23}; full at 100, reserve none
## New words, for the owner's veto (none built yet)

- **The standing label** (R3), where prosperity is shown and the crisis caps it: "Comfortable before the famine; Struggling while it lasts." The Defense tab names the pay against the label the page shows: "paid as a Comfortable town".
- **Fullness:** "{aspect}: more than enough, and the rest held in reserve."
- **Limit 1:** "Its stores and its magic can carry no more than its watch can use."
- **Limit 2:** "Walls with no one to man them."
- **The dial:** "Martial will".
