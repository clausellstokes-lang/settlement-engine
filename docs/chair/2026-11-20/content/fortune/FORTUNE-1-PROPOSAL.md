# FORTUNE-1: the measure and the proposal (no build)

Written 2026-11-20 10:2x UTC (`date -u` at the measure's last run: 10:22:10) by FORTUNE-1, seated by the seventh chair.
BASE: the working line at `0c9069489` (it descends from `0c906948`). No source file was changed; every figure below
was EXECUTED on copies of the checkout by the instruments in `instruments/` (one command: section 11), unless a line
says PLAUSIBLE.

## 1. The answer first

The chair's cause is right, and it is bigger than the tier bonus. **The largest single size term is the depth term,
whose "tier expectation" table is mis-calibrated**: it expects 13 economy and craft houses at a city that holds a median
of 42, and 14 at a metropolis that holds 53 (13 at a village that holds 8). So every city and every metropolis takes
+1 for "deep trades" and 60% of villages take -1 for "thin" ones. Of the raw gap between a village and a city, the depth
term carries 45%, the tier bonus 28%, the income-diversity count 13%, magic's tier scale 7% (section 2).

I propose four changes to the fortune sum and one to standing, all behind a dark law, with the cuts of both ladders
UNCHANGED. On the prototype (forced on, 1,200 towns, two seed sets) they do what FS1 and FS2 ask: every size now
spans Poor to Prosperous, a calm village is Approved in 37% (was 1%), a calm city is Poor or Moderate in 26% (was 0%),
and FS4 holds at every size on both seed sets. **Two consequences are the owner's to see before anything is built**
(section 5): at UNTOUCHED settings no ruler anywhere is born Endorsed (calm cities 41% and metropolises 91% today),
and towns born under a crisis now fall as far at a metropolis as at a village (a calm-born metropolis keeps its
cushion; a crisis-born one reads Legitimacy Crisis 21% at untouched settings, was 12%, and its incumbent is protected in
a contest 39%, was 82%).

## 2. Today's fortune sum by size (EXECUTED: `terms.mjs`, 600 towns, untouched settings, seeds `hxd-<size>-<0..99>`)

Mean of each term of `computeBaseProsperity`'s sum (the printed call). Raw is the sum before rounding, the cap at
Prosperous, the food modifier and the Poor floor.

```
size       route  tier   eco   magic  threat  mil  defPrem  depth  diversity   raw   index
thorp       1.97  0.00  0.00   0.00   -0.40  0.00   0.00    -0.03    0.00     1.54   1.92
hamlet      1.97  0.00  0.00   0.00   -0.45  0.00   0.00    -0.49    0.00     1.03   1.53
village     2.12  0.00  0.00   0.10   -0.36  0.00   0.00    -0.59    0.04     1.30   1.45
town        2.27  1.00  0.00   0.20   -0.45  0.00   0.00    -0.15    0.40     3.27   2.97
city        2.36  1.00  0.00   0.33   -0.48  0.00   0.11     1.00    0.50     4.82   3.97
metropolis  2.22  2.00  0.00   0.47   -0.43  0.00   0.07     1.00    0.50     5.82   3.87
```

Each term's share of the gap in the raw sum: village -> city (3.52): depth 45%, tier 28%, diversity 13%, magic 7%,
route 7%, defence premium 3%, threat -3%. Village -> metropolis (4.52): tier 44%, depth 35%, diversity 10%, magic 8%.
Hamlet -> town (2.24): tier 45%, diversity 18%, depth 15%, route 13%, magic 9%. Route, threat, the economy dial, the
military dial and food are the town's own record and do not grow with size; the defence premium (walls and a garrison
at a crossroads or port) is small and a fact of the roster.

The counts the depth and diversity terms read, by size (economy + craft houses; income sources):
thorp median 3 (p10 2, p90 4); hamlet 6 (3, 8); village 8 (4, 14); town 21 (14, 28); city 43 (26, 53); metropolis 53
(47, 57). Income sources: median 1, 2, 2, 7, 11, 12. Today's depth result: every city and metropolis +1; village +1 1%,
-1 60%; hamlet -1 49%.

Standing today (the chair's batch, re-taken here at 100 a size): the prosperity term averages -4.6 at a village and
+15.0 at a city and a metropolis born calm; the defence term -3.6 and +8.5 / +9.8. An Endorsed metropolis at birth is,
term for term, "Prosperous (+15) and a Fortress (+10)": 75, the cut exactly. MEASURED, not inferred: at untouched
settings safety reads Moderate in 388 of 416 calm towns and food Secure in 396, so those two terms carry almost no
spread; fortune and defence are the whole of standing at birth, and both were size.

## 3. The rule I propose (each figure a DRAFT row for the owner's signature)

FS1, FORTUNE (in `src/generators/economy/prosperity.js`, under the new law only):

1. **The tier bonus (0, 0, 0, 1, 1, 2) becomes ONE development figure at every size: 1.** DERIVED, not chosen: it is
   the pooled mean of what the rule removes (the tier bonus, the diversity bonus, and the shift of the depth and magic
   terms), measured on a separate derivation set (seeds `hxe-<size>-<0..99>`, untouched settings): today's pooled raw
   2.98, the rule's without it 1.97, gap 1.01. Without it (variant v0, measured) the whole world deflates: every size
   centres on Moderate and Tolerated, Endorsed is empty everywhere and 26% of calm cities read Contested. The figure
   makes the rule REDISTRIBUTE fortune across sizes rather than lower it.
2. **Magic's tier scale (0, 0, 0.3, 0.6, 1.0, 1.4) becomes 0.6 at every size** (the town's, the middle of the old
   ladder). The dial is the world's; how much it pays does not depend on the size.
3. **The depth term keeps the code's own rule (thin below 0.75 of the expectation, deep from 1.3 of it) against each
   size's MEASURED expectation: thorp 3, hamlet 5, village 8, town 20, city 42, metropolis 53** (the median count on
   the derivation set; the old table read 3, 8, 13, 22, 13, 14). Rejected variant (measured): cutting at each size's
   p20 and p80 makes the tight metropolis band (p10 47, p90 57) decide a whole label step on three houses; three calm
   metropolises went Prosperous to Poor on "47 against 50". With the ratio a metropolis is never thin or deep at
   untouched settings, a city is thin in 30% (its count has a long low tail: p10 26), a village either way in 45%.
4. **The income-diversity bonus is retired** (a count that grows with size; the depth term already reads the trades
   against the size). The count still prints on the Economics tab and still decides `deriveEconomicComplexity`.
5. **FS4's floor, from the code's own comment** ("Struggling is reserved for active stress/famine on top of structural
   poverty"): a place born under no crisis, holding its required economy, reads at least Poor AFTER the label's steps
   too (today the base is floored at Poor and the label's "economy output < 15" and "crime >= 65" steps can take it
   below). An isolated thorp or hamlet is excepted: its route makes it Subsistence. MEASURED NEED (variant `FORTUNE_FLOOR=0`, the
   rule otherwise as proposed, every dial random): 9 calm cities and metropolises read Struggling (-20) and a calm city
   and a calm metropolis read Legitimacy Crisis (0 today); each is a low economy dial counted three times (the dial's own
   term, the thin trades the dial causes, and the output step).

Unchanged: the route base, the threat, the economy and military dials, the defence premium, food, the cap at
Prosperous, every narrative step of the label, the isolated small places' Subsistence, `prosperityStanding` (R3) as
the same rule read with no crisis.

FS2, STANDING (in `src/generators/factionDynamics.js :: computePublicLegitimacy`, under the new law only):

6. **The prosperity term is unchanged in form**: the label it reads is now the size-relative one, so the term enters
   "by the place's own fortune" with no second scale (a second tier scale on a label that is already relative would
   count the size twice, in reverse).
7. **Defence is judged against the size's usual RANGE of bands: four points a band above or below it, within ±10,
   weighted by the size's existing scale (0.3, 0.4, 0.6, 0.85, 1, 1, unchanged).** The usual range (DRAFT: p10 to p90
   of the band on the derivation set, the fortune rule in force): thorp Vulnerable; hamlet and village Undefended to
   Vulnerable; town Lightly Defended to Defensible; city and metropolis Well-Defended to Fortress. So a walled city is
   a city (0), a city at Defensible is a failure (-4), a village with a palisade at Lightly Defended earns +2.
   Rejected variant (measured, with the earlier depth cut): one usual band (a metropolis's being Fortress) made every
   Well-Defended metropolis a failure (-4), which tipped six calm metropolises from 30 (Contested) to 26 (Legitimacy
   Crisis).
8. **The cuts (75, 60, 45, 30), the multipliers, the base 50, the safety and food terms: unchanged** (FS3). See 5.1.

THE PLAY-TIME READER (`timeProgression.js :: reBand`): MEASURED by reading every writer of the score: nothing at play
time re-derives standing or fortune from the size (`reBand`, the transfer reseed in `rulingPower.js` and the coup's
reads all band a score against the same cuts; prosperity moves at play time by band steps of the born label). With the
cuts unchanged `reBand` bands both laws alike and needs NO edit: the play-time unit is a GUARD (a town born under the
new law keeps its born score and band through an advance; a pre-light town is unchanged), not a change. If the chair
moves a cut (5.1), `reBand` and five other readers become law-aware, two of them in other lanes.

## 4. FS4, the measured law (EXECUTED; prototype forced on; calm = born under no crisis)

Legitimacy Crisis among calm towns, before -> after:

```
                 untouched (seeds hxd)     every dial random (seeds hxr)
thorp            9% -> 4%   (n 70)          6% -> 3%   (n 62)
hamlet          12% -> 5%   (n 66)          7% -> 2%   (n 59)
village          3% -> 0%   (n 70)         16% -> 0%   (n 70)
town             0% -> 0%   (n 70)          7% -> 1%   (n 69)
city             0% -> 0%   (n 73)          0% -> 0%   (n 63)
metropolis       0% -> 0%   (n 67)          0% -> 0%   (n 73)
pooled         3.8% -> 1.4%                6.1% -> 1.0%
```

It does not rise at any size on either set, and it falls for thorps, hamlets and villages. The share of calm towns is
unchanged (the crisis draw moved in 0 of 1,200 towns: 69% and 66% calm before and after). Below 45 among calm towns,
pooled: 26.4% -> 10.8% (untouched), 25.5% -> 18.2% (every dial). Contested among calm towns: 22.6% -> 9.4%,
19.4% -> 17.2%. The rule makes the calm world calmer; it adds no drama.

A LARGE PLACE POOR OR CONTESTED ONLY BY ITS RECORD: every calm city and metropolis the rule reads Poor or worse, or
below 45: 6 of 140 at untouched settings, 28 of 136 with every dial random (all 34 listed with their facts in
`measures/fs4-large.txt`). Twenty of them, each with the facts that decide:

- [untouched] Veliin (city, hxd-city-28, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 36.
  Decides: river (2); threat plagued (-1); trades 26 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Defensible against usual Well-Defended-Fortress (-4).
- [untouched] Jabalkarez (city, hxd-city-38, calm): fortune Prosperous -> Moderate; standing Approved 67 -> Contested 42.
  Decides: river (2); threat heartland (0); trades 23 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [untouched] Sanctaplenum (city, hxd-city-64, calm): fortune Prosperous -> Moderate; standing Approved 64 -> Contested 42.
  Decides: road (2); threat heartland (0); trades 23 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [untouched] Aristoeia (city, hxd-city-69, calm): fortune Prosperous -> Moderate; standing Approved 64 -> Contested 42.
  Decides: river (2); threat frontier (-0.5); trades 24 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [untouched] Jayapuram (city, hxd-city-71, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 36.
  Decides: river (2); threat plagued (-1); trades 27 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Defensible against usual Well-Defended-Fortress (-4).
- [untouched] Aristorion (city, hxd-city-73, calm): fortune Prosperous -> Moderate; standing Approved 64 -> Contested 42.
  Decides: road (2); threat frontier (-0.5); trades 21 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Longmiao (city, hxr-city-9, calm): fortune Moderate -> Poor; standing Tolerated 57 -> Contested 40.
  Decides: road (2); threat frontier (-0.5); economy dial 5 (-1.13); trades 25 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); economy output 5 (-1 step); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Leontnea (city, hxr-city-12, calm): fortune Prosperous -> Poor; standing Endorsed 75 -> Contested 40.
  Decides: road (2); threat frontier (-0.5); economy dial 19 (-0.78); trades 26 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Villavilla (city, hxr-city-21, calm): fortune Moderate -> Poor; standing Endorsed 77 -> Approved 60.
  Decides: road (2); threat plagued (-1); economy dial 5 (-1.13); trades 37 against an expected 42 (thin below 31.5, deep from 54.6: 0); military dial 86 (-0.3); economy output 6 (-1 step); safety Very Safe (20); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Grímholm (city, hxr-city-24, calm): fortune Comfortable -> Poor; standing Endorsed 83 -> Tolerated 55.
  Decides: isolated (1); threat plagued (-1); economy dial 31 (-0.47); trades 34 against an expected 42 (thin below 31.5, deep from 54.6: 0); safety Safe (15); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Ögedeikhand (city, hxr-city-32, calm): fortune Prosperous -> Moderate; standing Approved 67 -> Contested 42.
  Decides: river (2); threat heartland (0); economy dial 17 (-0.82); trades 35 against an expected 42 (thin below 31.5, deep from 54.6: 0); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Longmiao (city, hxr-city-33, calm): fortune Moderate -> Poor; standing Tolerated 57 -> Contested 40.
  Decides: river (2); threat heartland (0); economy dial 8 (-1.05); trades 36 against an expected 42 (thin below 31.5, deep from 54.6: 0); economy output 7 (-1 step); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Portaforum (city, hxr-city-43, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 40.
  Decides: road (2); threat frontier (-0.5); economy dial 32 (-0.45); trades 27 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Strathdale (city, hxr-city-45, calm): fortune Comfortable -> Poor; standing Approved 65 -> Contested 36.
  Decides: road (2); threat plagued (-1); economy dial 72 (+0.55); trades 39 against an expected 42 (thin below 31.5, deep from 54.6: 0); military dial 95 (-0.3); crime 67 (-1 step); safety Moderate (0); defence Defensible against usual Well-Defended-Fortress (-4).
- [every dial random] Rajiwadi (city, hxr-city-56, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 40.
  Decides: road (2); threat frontier (-0.5); economy dial 19 (-0.78); trades 23 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Altaihiid (city, hxr-city-59, calm): fortune Comfortable -> Poor; standing Tolerated 57 -> Contested 32.
  Decides: road (2); threat frontier (-0.5); economy dial 28 (-0.55); trades 23 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); crime 68 (-1 step); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Ravensund (city, hxr-city-76, calm): fortune Moderate -> Poor; standing Approved 65 -> Tolerated 51.
  Decides: road (2); threat plagued (-1); economy dial 11 (-0.97); trades 40 against an expected 42 (thin below 31.5, deep from 54.6: 0); economy output 11 (-1 step); safety Safe (15); defence Defensible against usual Well-Defended-Fortress (-4).
- [every dial random] Fengzhou (city, hxr-city-83, calm): fortune Comfortable -> Moderate; standing Tolerated 57 -> Contested 42.
  Decides: river (2); threat frontier (-0.5); economy dial 73 (+0.57); trades 39 against an expected 42 (thin below 31.5, deep from 54.6: 0); crime 74 (-1 step); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- [every dial random] Krasnotsy (city, hxr-city-90, calm): fortune Moderate -> Poor; standing Endorsed 77 -> Tolerated 56.
  Decides: river (2); threat plagued (-1); economy dial 18 (-0.80); trades 16 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Very Safe (20); defence Defensible against usual Well-Defended-Fortress (-4).
- [every dial random] Fengdao (city, hxr-city-98, calm): fortune Moderate -> Poor; standing Approved 72 -> Tolerated 55.
  Decides: river (2); threat frontier (-0.5); economy dial 8 (-1.05); trades 39 against an expected 42 (thin below 31.5, deep from 54.6: 0); economy output 7 (-1 step); safety Safe (15); defence Well-Defended against usual Well-Defended-Fortress (0).

What the 34 have in common, read line by line: thin trades for the size (fewer than three quarters of the size's
houses) with a plagued or frontier road, or an economy dial under 20 (counted as the dial's term and as the output
step), or crime 65 and over, or Unsafe or Dangerous streets. None reads poor by its size alone. The one that reads
lowest (Vysokoko, hxr-metropolis-25, Contested 30) has an economy dial of 10 and Dangerous streets.

## 5. What the owner must see before the build

### 5.1 No ruler is born Endorsed at untouched settings (a cut the measure says may move; I recommend it does not)

Under the new rule, at untouched settings, the calm score's maximum is 65 to 68 by size (Prosperous +15, a usual
defence 0, Moderate safety 0, Secure food 0 is 65): **Endorsed (75) is empty at birth at every size** (today 22% of calm towns,
all of them cities and metropolises). With every dial random it exists at every size (thorp 2%, hamlet 8%, village 10%,
town 23%, city 16%, metropolis 14%; 26% -> 12% pooled), reached by record: a Wealthy label (an economy dial that
drives output to 70 and over), Safe streets, a defence above the size's usual range. Approved and better, pooled among
calm towns: 40.6% -> 29.6% (untouched), 47.2% -> 42.4% (every dial).

RECOMMENDATION: KEEP THE CUT (FS3). The crux: Endorsed at birth today is "a prosperous fortress", which is "big"; at
untouched dials the record holds nothing that earns enthusiasm, so a middling world born with no enthusiastic ruler is
the record speaking, and Endorsed stays reachable by every size's record and at play time. Moving it is not cheap:
the score is compared to a literal 75 in `src/domain/worldPulse/stressorGates.js` ("no rebellion against a beloved
regime", twice), and the bands are mirrored in `timeProgression.js :: reBand`, `rulingPower.js :: rebandLegitimacy`
(the seat's lane), `src/domain/state/deriveSystemState.js` and the town map's civic dress
(`src/domain/townMap/arch/conditionGrammar.js`): a per-law cut is six readers in at least two lanes. WHAT WOULD CHANGE
MY ANSWER: the owner saying that a calm, prosperous, well-kept town of any size should open Endorsed at untouched
settings; then the cheaper cure is NOT a cut but a new-law prosperity term of +20 for Prosperous (one figure, one
file), which I have not measured and would measure first.

### 5.2 A town born under a crisis now falls as far at any size

The old size terms were a cushion of about three label steps under a city in crisis. Without them (untouched
settings): a crisis-born city reads Legitimacy Crisis 15% (was 4%), a metropolis 21% (was 12%); its incumbent is
protected in a contest 59% (was 81%) and 39% (was 82%). Every dial random: city 57% (24%), metropolis 44% (15%);
protected 54% (78%) and 63% (89%). Small places move the other way (crisis-born village 90% -> 43% Legitimacy Crisis).
This is FS1 applied to a crisis, and it reads the crisis that is there; but it moves the seat's lane's contest odds and
the session sheet's count, so it is named here for the owner and for those lanes.

### 5.3 Fortune moves defence and the underworld a little

The keep is paid at the crisis-free label's share (`facts/keep.js`), so a poorer large place keeps a weaker garrison:
every dial random, calm metropolises at Fortress 89% -> 74%, cities 60% -> 46%; at untouched settings 93% -> 84%,
51% -> 47%. Small places barely move. The criminal capture rung at equilibrium or worse, calm towns pooled: 4.8% ->
5.8% (untouched), 8.1% -> 10.6% (every dial), almost all at metropolises (a governing power's weaker multiplier).
Stability words barely move (calm villages "Tense" 27% -> 13% every dial random).

## 6. FS6: the tables (EXECUTED; prototype forced on; before -> after; share of the size's towns in the arm)

Full outputs, with the stability words and the capture rung for both arms: `measures/fs6-untouched.txt` and
`measures/fs6-every-dial.txt`.

### UNTOUCHED SETTINGS (seeds hxd-<size>-<0..99>), BORN UNDER NO CRISIS

```
FORTUNE (economicState.prosperity, the printed label): before -> after, share of the size's towns in the arm
size (n)                Struggling              Poor          Moderate       Comfortable        Prosperous
thorp (70)                6% -> 6%         29% -> 9%        36% -> 20%        27% -> 36%         3% -> 30%
hamlet (66)               9% -> 9%        41% -> 11%         36% -> 9%        14% -> 38%         0% -> 33%
village (70)              0% -> 0%        56% -> 13%        33% -> 16%        10% -> 36%         1% -> 36%
town (70)                 0% -> 0%          4% -> 6%        23% -> 20%        39% -> 47%        34% -> 27%
city (73)                 0% -> 0%          0% -> 3%         0% -> 23%         0% -> 37%       100% -> 37%
metropolis (67)           0% -> 0%          0% -> 0%         0% -> 12%         0% -> 69%       100% -> 19%

STANDING (publicLegitimacy.label): before -> after, share of the size's towns in the arm
size (n)         Legitimacy Crisis         Contested         Tolerated          Approved          Endorsed
thorp (70)                9% -> 4%        27% -> 11%        61% -> 56%         3% -> 29%          0% -> 0%
hamlet (66)              12% -> 5%        39% -> 17%        48% -> 42%         0% -> 36%          0% -> 0%
village (70)              3% -> 0%        66% -> 14%        30% -> 49%         1% -> 37%          0% -> 0%
town (70)                 0% -> 0%          4% -> 6%        59% -> 66%        37% -> 29%          0% -> 0%
city (73)                 0% -> 0%          0% -> 8%         0% -> 64%        59% -> 27%         41% -> 0%
metropolis (67)           0% -> 0%          0% -> 0%         0% -> 81%         9% -> 19%         91% -> 0%

DEFENCE (defenseProfile.readiness.label): before -> after, share of the size's towns in the arm
size (n)                Undefended        Vulnerable  Lightly Defended        Defensible     Well-Defended          Fortress
thorp (70)                0% -> 0%        91% -> 91%          9% -> 9%          0% -> 0%          0% -> 0%          0% -> 0%
hamlet (66)               0% -> 0%        94% -> 92%          6% -> 8%          0% -> 0%          0% -> 0%          0% -> 0%
village (70)            20% -> 13%        80% -> 84%          0% -> 3%          0% -> 0%          0% -> 0%          0% -> 0%
town (70)                 0% -> 0%          6% -> 6%        53% -> 51%        39% -> 40%          3% -> 3%          0% -> 0%
city (73)                 0% -> 0%          0% -> 0%          0% -> 0%          0% -> 4%        49% -> 49%        51% -> 47%
metropolis (67)           0% -> 0%          0% -> 0%          0% -> 0%          0% -> 0%         7% -> 16%        93% -> 84%

WHAT OTHER LANES READ: standing below 45 (the session sheet's weight); the incumbent protected in a contest (rulingPowerCoup.js :: coupContenders().incumbent.gated); the score's mean
thorp (70)       below 45: 36% -> 16% | protected: 100% -> 100% | score mean 46.7 -> 54.6 | prosperity term -1.4 -> 5.4 | defence term -1.0 -> 0.1 | safety -0.9 -> -0.9 | food 0.0 -> 0.0
hamlet (66)      below 45: 52% -> 21% | protected: 100% -> 100% | score mean 42.4 -> 54.5 | prosperity term -4.8 -> 5.2 | defence term -1.9 -> 0.2 | safety -0.7 -> -0.7 | food -0.1 -> -0.1
village (70)     below 45: 69% -> 14% | protected: 100% -> 100% | score mean 41.2 -> 56.4 | prosperity term -4.6 -> 6.9 | defence term -3.6 -> 0.1 | safety -0.6 -> -0.6 | food -0.1 -> -0.1
town (70)        below 45: 4% -> 6% | protected: 100% -> 100% | score mean 56.5 -> 57.1 | prosperity term 7.8 -> 7.3 | defence term -1.1 -> -0.1 | safety 0.0 -> 0.0 | food -0.2 -> -0.1
city (73)        below 45: 0% -> 8% | protected: 100% -> 100% | score mean 71.8 -> 56.3 | prosperity term 15.0 -> 8.2 | defence term 8.5 -> -0.2 | safety -1.8 -> -1.8 | food 0.0 -> 0.0
metropolis (67)  below 45: 0% -> 0% | protected: 100% -> 100% | score mean 74.7 -> 58.3 | prosperity term 15.0 -> 8.4 | defence term 9.8 -> 0.0 | safety -0.1 -> -0.1 | food 0.0 -> 0.0
```

### UNTOUCHED SETTINGS (seeds hxd-<size>-<0..99>), BORN UNDER A CRISIS

```
FORTUNE (economicState.prosperity, the printed label): before -> after, share of the size's towns in the arm
size (n)                Struggling              Poor          Moderate       Comfortable        Prosperous
thorp (30)              37% -> 30%        33% -> 13%        27% -> 27%         3% -> 30%          0% -> 0%
hamlet (34)             53% -> 29%        29% -> 15%        15% -> 29%         3% -> 15%         0% -> 12%
village (30)            53% -> 13%        37% -> 33%        10% -> 17%         0% -> 30%          0% -> 7%
town (30)                7% -> 10%        17% -> 13%        40% -> 37%        37% -> 40%          0% -> 0%
city (27)                 4% -> 4%         4% -> 19%         0% -> 33%        74% -> 41%         19% -> 4%
metropolis (33)         12% -> 12%          0% -> 9%         3% -> 42%        61% -> 24%        24% -> 12%

STANDING (publicLegitimacy.label): before -> after, share of the size's towns in the arm
size (n)         Legitimacy Crisis         Contested         Tolerated          Approved          Endorsed
thorp (30)              63% -> 37%        33% -> 37%         3% -> 27%          0% -> 0%          0% -> 0%
hamlet (34)             76% -> 41%        21% -> 35%         3% -> 21%          0% -> 3%          0% -> 0%
village (30)            90% -> 43%        10% -> 30%         0% -> 27%          0% -> 0%          0% -> 0%
town (30)               23% -> 23%        57% -> 43%        20% -> 33%          0% -> 0%          0% -> 0%
city (27)                4% -> 15%         0% -> 48%        70% -> 33%         26% -> 4%          0% -> 0%
metropolis (33)         12% -> 21%         0% -> 45%        48% -> 30%         36% -> 3%          3% -> 0%

DEFENCE (defenseProfile.readiness.label): before -> after, share of the size's towns in the arm
size (n)                Undefended        Vulnerable  Lightly Defended        Defensible     Well-Defended          Fortress
thorp (30)              27% -> 27%        70% -> 67%          3% -> 7%          0% -> 0%          0% -> 0%          0% -> 0%
hamlet (34)             26% -> 26%        71% -> 71%          3% -> 3%          0% -> 0%          0% -> 0%          0% -> 0%
village (30)            37% -> 30%        60% -> 67%          3% -> 3%          0% -> 0%          0% -> 0%          0% -> 0%
town (30)                 0% -> 0%        30% -> 30%        37% -> 37%        30% -> 30%          3% -> 3%          0% -> 0%
city (27)                 0% -> 0%          0% -> 0%          0% -> 0%          0% -> 4%        56% -> 52%        44% -> 44%
metropolis (33)           0% -> 0%          0% -> 0%          0% -> 0%          0% -> 0%         9% -> 12%        91% -> 88%

WHAT OTHER LANES READ: standing below 45 (the session sheet's weight); the incumbent protected in a contest (rulingPowerCoup.js :: coupContenders().incumbent.gated); the score's mean
thorp (30)       below 45: 97% -> 73% | protected: 100% -> 100% | score mean 21.3 -> 28.1 | prosperity term -10.4 -> -4.9 | defence term -1.5 -> -0.2 | safety -15.7 -> -15.7 | food -1.1 -> -1.1
hamlet (34)      below 45: 97% -> 76% | protected: 100% -> 100% | score mean 19.8 -> 31.2 | prosperity term -13.3 -> -4.4 | defence term -2.5 -> 0.1 | safety -13.3 -> -13.3 | food -1.1 -> -1.1
village (30)     below 45: 100% -> 73% | protected: 100% -> 100% | score mean 17.4 -> 33.3 | prosperity term -14.3 -> -2.6 | defence term -4.0 -> 0.1 | safety -13.4 -> -13.4 | food -0.8 -> -0.8
town (30)        below 45: 80% -> 67% | protected: 70% -> 77% | score mean 36.0 -> 36.8 | prosperity term -0.1 -> -0.1 | defence term -1.7 -> -0.8 | safety -11.2 -> -11.2 | food -1.1 -> -1.1
city (27)        below 45: 4% -> 63% | protected: 81% -> 59% | score mean 54.4 -> 39.6 | prosperity term 7.6 -> 1.2 | defence term 8.3 -> -0.1 | safety -11.3 -> -11.3 | food -0.2 -> -0.2
metropolis (33)  below 45: 12% -> 67% | protected: 82% -> 39% | score mean 52.1 -> 36.7 | prosperity term 6.1 -> 0.4 | defence term 9.7 -> 0.0 | safety -12.7 -> -12.7 | food -1.0 -> -1.0
```

### EVERY DIAL RANDOM (the census DIALS; seeds hxr-<size>-<0..99>), BORN UNDER NO CRISIS

```
FORTUNE (economicState.prosperity, the printed label): before -> after, share of the size's towns in the arm
size (n)                Struggling              Poor          Moderate       Comfortable        Prosperous           Wealthy
thorp (62)                5% -> 5%        48% -> 26%        23% -> 16%        18% -> 27%         6% -> 26%          0% -> 0%
hamlet (59)               5% -> 3%        47% -> 20%        31% -> 10%         8% -> 24%         7% -> 37%          2% -> 5%
village (70)             19% -> 0%        37% -> 19%        27% -> 23%         7% -> 23%         6% -> 26%         4% -> 10%
town (69)                 7% -> 0%        13% -> 22%        17% -> 22%        22% -> 14%        19% -> 22%        22% -> 20%
city (63)                 0% -> 0%         0% -> 19%        10% -> 25%        22% -> 30%        54% -> 14%        14% -> 11%
metropolis (73)           0% -> 0%         0% -> 18%         0% -> 21%        37% -> 29%        40% -> 21%        23% -> 12%

STANDING (publicLegitimacy.label): before -> after, share of the size's towns in the arm
size (n)         Legitimacy Crisis         Contested         Tolerated          Approved          Endorsed
thorp (62)                6% -> 3%        39% -> 23%        48% -> 47%         5% -> 26%          2% -> 2%
hamlet (59)               7% -> 2%        31% -> 19%        51% -> 22%         8% -> 49%          3% -> 8%
village (70)             16% -> 0%        40% -> 14%        29% -> 41%        13% -> 34%         3% -> 10%
town (69)                 7% -> 1%        10% -> 19%        33% -> 30%        20% -> 26%        29% -> 23%
city (63)                 0% -> 0%         0% -> 14%         6% -> 48%        41% -> 22%        52% -> 16%
metropolis (73)           0% -> 0%         0% -> 15%         1% -> 47%        37% -> 25%        62% -> 14%

DEFENCE (defenseProfile.readiness.label): before -> after, share of the size's towns in the arm
size (n)                Undefended        Vulnerable  Lightly Defended        Defensible     Well-Defended          Fortress
thorp (62)                0% -> 0%        89% -> 89%        11% -> 11%          0% -> 0%          0% -> 0%          0% -> 0%
hamlet (59)               2% -> 0%        93% -> 93%          5% -> 7%          0% -> 0%          0% -> 0%          0% -> 0%
village (70)            14% -> 10%        76% -> 79%        10% -> 10%          0% -> 1%          0% -> 0%          0% -> 0%
town (69)                 0% -> 0%          9% -> 7%        36% -> 38%        36% -> 38%        19% -> 17%          0% -> 0%
city (63)                 0% -> 0%          0% -> 0%          0% -> 0%          3% -> 6%        37% -> 48%        60% -> 46%
metropolis (73)           0% -> 0%          0% -> 0%          0% -> 0%          0% -> 1%        11% -> 25%        89% -> 74%

WHAT OTHER LANES READ: standing below 45 (the session sheet's weight); the incumbent protected in a contest (rulingPowerCoup.js :: coupContenders().incumbent.gated); the score's mean
thorp (62)       below 45: 45% -> 26% | protected: 100% -> 100% | score mean 46.6 -> 53.7 | prosperity term -3.4 -> 2.5 | defence term -1.0 -> 0.1 | safety 1.1 -> 1.1 | food -0.1 -> -0.1
hamlet (59)      below 45: 37% -> 20% | protected: 100% -> 100% | score mean 47.7 -> 59.3 | prosperity term -3.7 -> 5.8 | defence term -2.0 -> 0.1 | safety 3.4 -> 3.4 | food 0.0 -> 0.0
village (70)     below 45: 56% -> 14% | protected: 100% -> 100% | score mean 44.3 -> 58.7 | prosperity term -5.1 -> 5.8 | defence term -3.2 -> 0.3 | safety 2.7 -> 2.7 | food -0.1 -> -0.1
town (69)        below 45: 17% -> 20% | protected: 100% -> 99% | score mean 61.3 -> 61.7 | prosperity term 6.2 -> 6.3 | defence term 0.1 -> 0.3 | safety 5.1 -> 5.1 | food -0.1 -> -0.1
city (63)        below 45: 0% -> 14% | protected: 100% -> 98% | score mean 76.1 -> 59.4 | prosperity term 12.7 -> 4.9 | defence term 8.6 -> -0.3 | safety 4.8 -> 4.8 | food 0.0 -> 0.0
metropolis (73)  below 45: 0% -> 15% | protected: 100% -> 100% | score mean 76.0 -> 58.8 | prosperity term 13.6 -> 6.1 | defence term 9.7 -> -0.1 | safety 2.8 -> 2.8 | food 0.0 -> 0.0
```

### EVERY DIAL RANDOM (the census DIALS; seeds hxr-<size>-<0..99>), BORN UNDER A CRISIS

```
FORTUNE (economicState.prosperity, the printed label): before -> after, share of the size's towns in the arm
size (n)                Struggling              Poor          Moderate       Comfortable        Prosperous
thorp (38)              63% -> 53%        18% -> 16%        16% -> 11%         3% -> 21%          0% -> 0%
hamlet (41)             78% -> 59%        15% -> 17%         5% -> 10%         2% -> 12%          0% -> 2%
village (30)            63% -> 30%        27% -> 30%         3% -> 13%         7% -> 20%          0% -> 7%
town (31)               19% -> 29%        23% -> 26%        45% -> 29%         6% -> 10%          6% -> 6%
city (37)               16% -> 51%        30% -> 14%        24% -> 22%        24% -> 11%          5% -> 3%
metropolis (27)          7% -> 30%        11% -> 22%        44% -> 22%        22% -> 19%         15% -> 7%

STANDING (publicLegitimacy.label): before -> after, share of the size's towns in the arm
size (n)         Legitimacy Crisis         Contested         Tolerated          Approved          Endorsed
thorp (38)              82% -> 61%        16% -> 26%         3% -> 13%          0% -> 0%          0% -> 0%
hamlet (41)             88% -> 66%        12% -> 22%         0% -> 12%          0% -> 0%          0% -> 0%
village (30)            87% -> 50%        13% -> 27%         0% -> 23%          0% -> 0%          0% -> 0%
town (31)               45% -> 48%        35% -> 35%        16% -> 13%          3% -> 3%          0% -> 0%
city (37)               24% -> 57%        27% -> 30%        41% -> 11%          5% -> 0%          3% -> 3%
metropolis (27)         15% -> 44%        11% -> 30%        52% -> 22%         19% -> 4%          4% -> 0%

DEFENCE (defenseProfile.readiness.label): before -> after, share of the size's towns in the arm
size (n)                Undefended        Vulnerable  Lightly Defended        Defensible     Well-Defended          Fortress
thorp (38)              13% -> 13%        87% -> 87%          0% -> 0%          0% -> 0%          0% -> 0%          0% -> 0%
hamlet (41)             49% -> 46%        49% -> 51%          2% -> 2%          0% -> 0%          0% -> 0%          0% -> 0%
village (30)            33% -> 30%        63% -> 63%          3% -> 7%          0% -> 0%          0% -> 0%          0% -> 0%
town (31)                 0% -> 0%        39% -> 39%        29% -> 29%        29% -> 26%          3% -> 6%          0% -> 0%
city (37)                 0% -> 0%          0% -> 0%          0% -> 0%        11% -> 19%        41% -> 49%        49% -> 32%
metropolis (27)           0% -> 0%          0% -> 0%          0% -> 0%          0% -> 0%        19% -> 30%        81% -> 70%

WHAT OTHER LANES READ: standing below 45 (the session sheet's weight); the incumbent protected in a contest (rulingPowerCoup.js :: coupContenders().incumbent.gated); the score's mean
thorp (38)       below 45: 97% -> 87% | protected: 100% -> 100% | score mean 17.7 -> 22.7 | prosperity term -14.3 -> -10.4 | defence term -1.3 -> -0.1 | safety -15.3 -> -15.3 | food -1.4 -> -1.4
hamlet (41)      below 45: 100% -> 88% | protected: 100% -> 100% | score mean 14.2 -> 22.0 | prosperity term -16.9 -> -12.1 | defence term -3.0 -> 0.0 | safety -14.1 -> -14.1 | food -1.8 -> -1.8
village (30)     below 45: 100% -> 77% | protected: 100% -> 100% | score mean 16.5 -> 28.8 | prosperity term -14.8 -> -6.4 | defence term -3.9 -> 0.1 | safety -13.6 -> -13.6 | food -1.3 -> -1.3
town (31)        below 45: 81% -> 84% | protected: 74% -> 74% | score mean 30.5 -> 29.5 | prosperity term -4.6 -> -6.6 | defence term -1.9 -> -1.0 | safety -12.4 -> -12.4 | food -0.5 -> -0.5
city (37)        below 45: 51% -> 86% | protected: 78% -> 54% | score mean 40.4 -> 25.1 | prosperity term -3.5 -> -10.4 | defence term 7.7 -> -0.8 | safety -12.2 -> -12.2 | food -1.6 -> -1.6
metropolis (27)  below 45: 26% -> 74% | protected: 89% -> 63% | score mean 47.5 -> 31.1 | prosperity term 1.4 -> -5.6 | defence term 9.4 -> 0.0 | safety -12.0 -> -12.0 | food -1.3 -> -1.3
```

## 7. Twenty towns before and after (EXECUTED; untouched settings; per size the first calm town and the first born under a crisis, then the eight largest movers)

- Rossleigh (thorp, hxd-thorp-0, calm): fortune Comfortable -> Prosperous; standing Tolerated 57 -> Approved 65.
  Decides: river (2); threat frontier (-0.5); trades 4 against an expected 3 (thin below 2.25, deep from 3.9: +1 deep); safety Moderate (0); defence Vulnerable against usual Vulnerable (0).
- Raschowk (thorp, hxd-thorp-7): fortune Struggling -> Struggling; standing Legitimacy Crisis 3 -> Legitimacy Crisis 5.
  Decides: road (2); threat frontier (-0.5); trades 3 against an expected 3 (thin below 2.25, deep from 3.9: 0); food Deficit (cap:1); CRISIS under_siege; safety Desperate — Active Siege (-20); defence Undefended against usual Vulnerable (-1).
- Steinhausen (hamlet, hxd-hamlet-0, calm): fortune Moderate -> Comfortable; standing Tolerated 49 -> Approved 60.
  Decides: crossroads (3); threat plagued (-1); trades 6 against an expected 5 (thin below 3.75, deep from 6.5: 0); safety Moderate (0); defence Lightly Defended against usual Undefended-Vulnerable (2).
- Steinfurt (hamlet, hxd-hamlet-1): fortune Struggling -> Moderate; standing Legitimacy Crisis 18 -> Contested 42.
  Decides: road (2); threat frontier (-0.5); trades 5 against an expected 5 (thin below 3.75, deep from 6.5: 0); CRISIS recently_betrayed; safety Suspicious — Aftermath of Betrayal (-8); defence Undefended against usual Undefended-Vulnerable (0).
- Dobroki (village, hxd-village-0, calm): fortune Poor -> Moderate; standing Contested 37 -> Tolerated 50.
  Decides: isolated (1); threat heartland (0); trades 9 against an expected 8 (thin below 6, deep from 10.4: 0); safety Moderate (0); defence Vulnerable against usual Undefended-Vulnerable (0).
- Baizhen (village, hxd-village-5): fortune Poor -> Comfortable; standing Legitimacy Crisis 17 -> Contested 38.
  Decides: port (3); threat heartland (0); trades 7 against an expected 8 (thin below 6, deep from 10.4: 0); CRISIS insurgency; safety Dangerous — Insurgency (-20); defence Vulnerable against usual Undefended-Vulnerable (0).
- Petenmul (town, hxd-town-0, calm): fortune Comfortable -> Comfortable; standing Tolerated 58 -> Tolerated 58.
  Decides: river (2); threat frontier (-0.5); trades 17 against an expected 20 (thin below 15, deep from 26: 0); safety Moderate (0); defence Defensible against usual Lightly Defended-Defensible (0).
- Ravenstrand (town, hxd-town-2): fortune Comfortable -> Comfortable; standing Contested 42 -> Contested 43.
  Decides: port (3); threat frontier (-0.5); trades 14 against an expected 20 (thin below 15, deep from 26: -1 thin); CRISIS succession_void; safety Strained — Succession Crisis (-12); defence Vulnerable against usual Lightly Defended-Defensible (-3).
- Dionkastro (city, hxd-city-2, calm): fortune Prosperous -> Comfortable; standing Approved 64 -> Tolerated 50.
  Decides: river (2); threat frontier (-0.5); trades 49 against an expected 42 (thin below 31.5, deep from 54.6: 0); safety Unsafe (-8); defence Well-Defended against usual Well-Defended-Fortress (0).
- Petenhuitz (city, hxd-city-0): fortune Prosperous -> Prosperous; standing Approved 72 -> Approved 65.
  Decides: crossroads (3); threat plagued (-1); trades 34 against an expected 42 (thin below 31.5, deep from 54.6: 0); CRISIS infiltrated; safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- Bellaplenum (metropolis, hxd-metropolis-3, calm): fortune Prosperous -> Comfortable; standing Endorsed 75 -> Tolerated 58.
  Decides: river (2); threat frontier (-0.5); trades 57 against an expected 53 (thin below 39.75, deep from 68.9: 0); safety Moderate (0); defence Fortress against usual Well-Defended-Fortress (0).
- Shangjin (metropolis, hxd-metropolis-0): fortune Comfortable -> Moderate; standing Tolerated 56 -> Contested 38.
  Decides: road (2); threat frontier (-0.5); trades 48 against an expected 53 (thin below 39.75, deep from 68.9: 0); CRISIS monster_pressure; safety Strained — Monster Threat (-12); defence Fortress against usual Well-Defended-Fortress (0).
- Veliin (city, hxd-city-28, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 36.
  Decides: river (2); threat plagued (-1); trades 26 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Defensible against usual Well-Defended-Fortress (-4).
- Magnaium (city, hxd-city-58): fortune Prosperous -> Poor; standing Approved 60 -> Legitimacy Crisis 24.
  Decides: road (2); threat plagued (-1); trades 28 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); CRISIS succession_void; safety Strained — Succession Crisis (-12); defence Defensible against usual Well-Defended-Fortress (-4).
- Jayapuram (city, hxd-city-71, calm): fortune Prosperous -> Poor; standing Approved 72 -> Contested 36.
  Decides: river (2); threat plagued (-1); trades 27 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Defensible against usual Well-Defended-Fortress (-4).
- Langholz (metropolis, hxd-metropolis-57): fortune Comfortable -> Poor; standing Tolerated 56 -> Legitimacy Crisis 28.
  Decides: road (2); threat plagued (-1); trades 53 against an expected 53 (thin below 39.75, deep from 68.9: 0); CRISIS monster_pressure; safety Strained — Monster Threat (-12); defence Well-Defended against usual Well-Defended-Fortress (0).
- Makroeia (village, hxd-village-37): fortune Struggling -> Moderate; standing Legitimacy Crisis 4 -> Contested 30.
  Decides: road (2); threat heartland (0); trades 6 against an expected 8 (thin below 6, deep from 10.4: 0); CRISIS plague_onset; safety Dangerous — Plague Unrest — Plague Conditions (-20); defence Vulnerable against usual Undefended-Vulnerable (0).
- Waldbrunn (city, hxd-city-56, calm): fortune Prosperous -> Moderate; standing Endorsed 87 -> Approved 61.
  Decides: river (2); threat plagued (-1); trades 34 against an expected 42 (thin below 31.5, deep from 54.6: 0); safety Safe (15); defence Defensible against usual Well-Defended-Fortress (-4).
- Jintian (city, hxd-city-12, calm): fortune Prosperous -> Moderate; standing Endorsed 75 -> Tolerated 50.
  Decides: road (2); threat heartland (0); trades 22 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); safety Moderate (0); defence Well-Defended against usual Well-Defended-Fortress (0).
- Cerrovetum (city, hxd-city-17): fortune Comfortable -> Poor; standing Tolerated 53 -> Legitimacy Crisis 28.
  Decides: road (2); threat frontier (-0.5); trades 27 against an expected 42 (thin below 31.5, deep from 54.6: -1 thin); CRISIS indebted+infiltrated; safety Tense — Debt Crisis (-12); defence Well-Defended against usual Well-Defended-Fortress (0).

## 8. FS7: the page agrees with itself (a SCREEN at the proposal; the reading is the build's fourth unit)

Every sentence the generator picks BY the fortune or the standing label (the prosperity line and its siblings, the
arrival scene's tension, the pressure narrative's "overcoming", the Power tab's standing reading) follows the new label
by construction. The risk is a sentence picked by something else that SAYS wealth or favour. The screen
(`fs7.mjs`, 20 towns a size, every stored prose sentence): candidates where a wealth word stands in a Poor-or-worse
town, a poverty word in a Comfortable-or-better one, a favour word under a Contested-or-worse ruler or a disfavour word
under an Approved-or-better one: 73 before, 46 after. The candidates read by hand are not contradictions (famine's "the
wealthy are hoarding", an alms-house "for the destitute poor", a faction "quietly resented" under an approved hall). No
tier-keyed wealth cue surfaced. PLAUSIBLE, not proven: the screen's word lists are a floor; the build's FS7 unit reads
the sentences themselves on twenty towns a size, and the display-time desks (`stateProse/*`, read at render) are in its
scope.

## 9. FS5: the law, dark (the build's first unit, built exactly as the seat's U1)

A zero-import leaf `src/domain/fortune/fortuneLaw.js`: key `_fortuneLawVersion`, versions `[1, 2]`, the dial
`NEW_SETTLEMENT_FORTUNE_LAW_VERSION` at 1, a closed reader that fails closed (only the NUMBER 2 selects), a resolver
that reads the world and never the dial, and `newSettlementFortuneLaw()` that mints `{}` while dark. Wired in
`densityCreateBoundary.js :: birthConfig` (the incoming marker clamped, the mint spread) and a `GENERATION_LAWS` row;
the walker's rows (`MINT_SYMBOLS`, `MINT_HOMES`). The rule reads the law from the config it already receives:
`computeBaseProsperity` and `labelFromBase` take `config` (the standing reading's `standingConfigOf` keeps the key);
`computePublicLegitimacy(economicState, defenseLabel, tier)` takes no config, so it gains a fourth argument, the law,
handed by its one caller (`src/generators/power/rulingStructure.js`, which holds `config`; the late defence replay runs
through the same function). The new figures live in ONE registered table (`FORTUNE_LAW_TUNING`, DRAFT rows for
`tuningRegister`). WHILE DARK: zero differences in born towns, the golden's 525 and the census's 720 hashed at the base
and the tip (the shared two-tree tool), one sha256 each side, equal.

## 10. The figures the owner signs (all DRAFT; none signed by this lane)

| figure | value | derived from |
|---|---|---|
| development figure (replaces the tier bonus 0,0,0,1,1,2) | 1 at every size | pooled mean of the removed terms, 1.01, seeds hxe |
| magic's scale | 0.6 at every size | the old ladder's middle (the town's) |
| depth expectation by size | 3, 5, 8, 20, 42, 53 | median count, seeds hxe; the 0.75 and 1.3 ratios are today's |
| income-diversity bonus | retired | a size count; the depth term reads the trades |
| calm Poor floor after the label's steps | on (isolated thorp and hamlet excepted) | the code's own comment; FS4's measured need |
| defence usual range by size | Vuln.; Undef.-Vuln.; Undef.-Vuln.; Lightly-Defensible; Well-Def.-Fortress; Well-Def.-Fortress | p10 to p90 of the band, seeds hxe |
| defence points a band outside the range | 4, within ±10, times the size's existing scale | the old map's span (-10 to +10 over five bands) |
| the legitimacy cuts | unchanged (75, 60, 45, 30) | FS3; 5.1 |
| the consequence 5.1 | no Endorsed ruler at birth at untouched settings | the measure |
| the consequence 5.2 | crisis-born large places lose their cushion | the measure |

## 11. The instruments (each in one command; none changes a source file)

- The whole measure: `sh docs/chair/2026-11-20/content/fortune/instruments/run.sh <checkout> <scratch-dir>` (2 min 17 s
  here). It copies the checkout twice (`tree.mjs`: a trace copy, a prototype copy, the rule's text patches in
  `rule.mjs`, each refused unless it matches once), births 600 towns a copy a seed set (`measure.mjs`, the chair's
  recipe), and writes `measures/`: `terms.txt`, `fs6-untouched.txt`, `fs6-every-dial.txt`, `twenty.txt`,
  `fs4-large.txt`, `fs7-screen.txt`, `fs7-after-candidates.json`.
- The variants reported above: `FORTUNE_FLAT=0`, `FORTUNE_DEPTH=quantile`, `FORTUNE_DEF=point`, `FORTUNE_FLOOR=0`
  before `node instruments/tree.mjs <checkout> <out> proto`.
- The trace copy is proven neutral: 600 towns born on the trace copy and on the checkout itself differ in 0.

## 12. What could go wrong

1. THE DERIVATION'S SETTINGS: every expectation was taken at untouched settings. With every dial random, the economy
   dial moves the count of houses, so a low dial reads "thin" too (the dial is then counted in three places, as it is
   today at every size). Measured, not cured: it is why 28 of 136 calm large places read poor with every dial random.
2. THE MINT COLLIDES WITH THE SEAT'S U1: both add an import, a clamp, a spread and a `GENERATION_LAWS` row at the same
   lines of `densityCreateBoundary.js`; the seat's U1 is not on this base. Whoever lands second resolves a small
   mechanical conflict; the walker's rows likewise.
3. OTHER LANES' FIGURES MOVE WHEN THE LIGHT IS LIT (not while dark): the session sheet's calm-and-below-45 count (falls:
   26% -> 11% pooled at untouched settings), the seat's contest odds in crisis-born large places (5.2), the capture
   rung at metropolises (5.3).
4. PROSE REACH: a pool keyed on Endorsed is unreached at birth at untouched settings once lit; a reachability census
   that births at untouched settings would name it (not while dark).
5. A THORP CAN NOW BE PROSPEROUS (30% of calm thorps at untouched settings: "prosperous for a thorp"). It is FS1's
   meaning; the owner should see it said plainly.
6. NOT MEASURED: whether a depleted resource or an impaired chain should enter the sum (FS1's "any fact of the record
   you can show belongs"). I propose none: adding a negative fact would add poverty the chair did not ask for. An open
   question for the chair.

## 13. The build, once ruled (each unit one builder, one commit, red first; I integrate)

U1 the law leaf, dark (FS5): `src/domain/fortune/fortuneLaw.js`, `densityCreateBoundary.js`, the walker, a wiring test.
U2 fortune (FS1, the floor of FS4): `prosperity.js` and its tests, the tuning table registered DRAFT.
U3 standing and its play-time guard (FS2): `factionDynamics.js`, `power/rulingStructure.js` (the fourth argument), a
guard on `reBand` (no edit while the cuts stand).
U4 the readers' agreement (FS7): the reading of twenty towns a size, cures by cause where the cause is a label's reader.
Then the measure re-taken on the built rule forced on, the confinement while dark, the hand-back.

## 14. The registers the build's edits would move (added on the chair's word of 09:56Z: `factionDynamics.js` has one owner at a time)

Read from the line at `0c9069489` by grepping every register for the two paths; each is re-taken BY ITS OWN DOOR on the
merged tree by whoever lands second. FS2's unit asks the chair first ("factionDynamics.js for FORTUNE?") and edits ONLY
`computePublicLegitimacy`, its contribution tables and its helpers there, never the relation lines.

| register | `prosperity.js` (U2) | `factionDynamics.js` (U3) | moves because |
|---|---|---|---|
| `scripts/.observed-shape-readers-baseline.json` (its `sha256`/`size` file rows; the per-file reader counts) | sha256 and size | sha256 and size | any edit of the file; reader counts only if the edit reads a new field (none planned: the law arrives as an argument) |
| `tests/lint/.tuning-inventory.json` and `tests/lint/.tuning-register.json` | a NEW table (`FORTUNE_LAW_TUNING`, DRAFT rows) if the figures live here, else in the law leaf; P2 named count (1 today) unchanged; P3 bare decimals (13 today) must not rise | P3 bare decimals (36 today) must not rise; the defence usual range and its 4 points are integers, so none is added | `tuningRegister` names every new table by id; the figures land DRAFT, signed by none |
| `tests/lint/presumedThings.register.json`, `presumedThings.widened.register.json`, `presumptionClasses.register.json` | rows keyed by the file's lines: re-taken if a banked line moves | the same | line-keyed rows |
| `tests/lint/factLayers.register.json` | not keyed | rows keyed by line text (the faith name test, a relation line): untouched unless a banked line moves | line text |
| `scripts/mutation-coverage-manifest.json` | the R3 row (`deriveProsperityLabels`) names the file: unchanged unless that function moves | rows name the relation narratives and `govCriminalRelation`: untouched | rationale text only |
| born-town registers (the lighting census, the wiring census, the golden 525, the census 720) | ZERO while dark (the confinement hash proves it) | ZERO while dark | the law mints `{}` |

The seat's U1 already moved `densityCreateBoundary.js`'s rows and the walker `tests/lint/densityCreateBoundary.walker.test.js`
on its own branch; this lane's U1 adds one more row to each at the same lines (12.2).

## 15. 5.1's second column (the chair's ruling 2 of 10:33Z; MEASURED, no build)

The question: the smallest change of ONE figure of the new law's standing terms (not a cut) by which a calm place that
is Prosperous for its size AND holds one further earned merit (a defence above its size's usual range, or safe streets)
opens Endorsed at untouched settings.

Worked first, then measured (`FORTUNE_PROSPEROUS`, `FORTUNE_WEALTHY` in `instruments/rule.mjs`): Prosperous and Safe
streets is already 50 + 15 + 15 = 80 under the proposal's figures; the binding case is one band of defence above the
usual range, worth round(4 x the size's scale) = +1 at a thorp, +2 at a hamlet and a village, +3 at a town, +4 at a city
and a metropolis. So no value of the defence figure can carry a thorp (its weight 0.3 caps it at +3), and the only
single figure that carries every size is THE PROSPEROUS POINTS: 15 -> 24 (75 - 50 - 1). At 21 it carries only cities
and metropolises; at untouched settings that opened none.

Calm standing rows, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (EXECUTED, the proposal's rule with
the one figure changed; 100 towns a size):

```
untouched (hxd)  proposal (15)           Prosperous 24                (24, and Wealthy 25 to keep its rank)
thorp            4/11/56/29/0            4/11/56/26/3                 4/11/56/26/3
hamlet           5/17/42/36/0            5/17/42/36/0                 5/17/42/36/0
village          0/14/49/37/0            0/14/49/37/0                 0/14/49/37/0
town             0/6/66/29/0             0/6/66/27/1                  0/6/66/27/1
city             0/8/64/27/0             0/8/53/38/0                  0/8/53/38/0
metropolis       0/0/81/19/0             0/0/81/19/0                  0/0/81/19/0
every dial (hxr)
thorp            3/23/47/26/2            3/23/47/23/5                 3/23/47/23/5
hamlet           2/19/22/49/8            2/19/22/47/10                2/19/22/44/14
village          0/14/41/34/10           0/14/41/33/11                0/14/41/27/17
town             1/19/30/26/23           1/17/32/25/25                1/17/32/12/38
city             0/14/48/22/16           0/14/46/24/16                0/14/44/24/17
metropolis       0/15/47/25/14           0/15/45/26/14                0/15/45/18/22
```

Every calm town that is Prosperous with a merit opens Endorsed at 24: 3 of 3 at untouched settings, 27 of 27 with every
dial random (at 15: 0 of 3 and 22 of 27). FS4 HOLDS in every arm: only a positive term rises, so the Legitimacy Crisis
and Contested columns are those of the proposal. THE FINDING THE OWNER SHOULD HAVE WITH IT: at untouched settings the
merit itself is nearly absent (3 calm towns of 416 are Prosperous with any merit), so the figure opens Endorsed in under
1% of calm towns there; it does not bring back a common top band. And 24 ranks Prosperous above Wealthy (20); keeping
the ladder's order is a second figure (Wealthy 25, measured in the third column: it adds Endorsed wherever an economy
dial makes a place Wealthy, town 25% -> 38%).

RULED (the chair, 2026-11-20 10:48 UTC): KEEP 15. Measured and rejected: 24 does not restore a common top band at untouched settings and ranks Prosperous above Wealthy. No second figure.

THE LEAF IS SHAPED FOR IT: the new law's standing points (the prosperity table, the defence points and ranges) live in
the law's one tuning table, so either value changes before the signature with no second unit.
