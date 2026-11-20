# FORTUNE U5 "merits of rule": the measure and the proposal (no build until the chair rules)

Written 2026-11-20 15:14 UTC by the U5 measuring builder, seated by FORTUNE-2, on the owner's question "How would you
fix: No ruler is born beloved at untouched settings once fortune is switched on" (the chair's order of 13:56 UTC; brief
`briefs/U5.md`). BASE: `f20b80b0a`. No file under `src/` or `tests/` changed. Every figure below was EXECUTED on copies
of the checkout (`instruments/u5-*`; section 12) unless a line says PLAUSIBLE. Every number is a DRAFT row of the
leaf's one table (`FORTUNE_LAW_TUNING` in `src/domain/fortune/fortuneLaw.js`), signed by none; the build, if ruled,
lands DARK under the fortune law.

## 1. The answer first

**Two merits, each +10 (DRAFT), counted only upward, and only where the ruler already stands at Tolerated or better
with no trouble of today about the ruler:** (1) **the principled ruler** (the governing power's rank-1 card has a
dominant trait in `npcData.js`'s `straight` family and no flaw in the `price`, `slippery` or `hard` families): present
in 4% to 13% of calm places by size; (2) **a catastrophe weathered within a generation** (a `catastrophic` event of
the history within 40 years, with no trouble of its kind today and no legacy line saying it was "never put right"):
3% to 17%. Neither grows with size. **The safety rule:** a calm-ladder safety label inside its size's usual range
(p10 to p90, seeds hxe) is worth 0, outside it the label's own points less those of the nearest usual band; the
measure found the usual range is Moderate at every size but the city (Unsafe to Moderate), so at untouched settings it
moves only calm cities' Unsafe streets (-8 to 0), and **the chair's "-4 at every size" is the mean over all towns
(crisis-born included); among calm towns the safety term is already about 0** (section 3). **Endorsed among calm
places at untouched settings, today / ruled / with U5:** 0 / 0 / 4, 6, 4, 4, 1, 1% on hxd, and ruled 0, 0, 0, 0, 1, 0% -> 3, 2, 2, 6, 3, 4% on hxu; pooled over the two sets (195 to 220 calm places a size) 3.6, 3.6, 2.8, 5.4, 2.3, 3.0%. Today's 0, 0, 0, 0, 41, 91% (hxd) was "big", not merit (thorp to metropolis; seeds hxd, and the
confirmation set hxu of 200 a size), never on fewer than two reasons (15 calm places Endorsed on hxd and 28 on hxu, every one on two reasons or more: a merit and Prosperous fortune in 14 of 15 and 19 of 28).

**FS4 HOLDS** on all three seed sets: the Legitimacy Crisis share is unchanged at every size, calm and crisis-born, and
no town's score falls (merits only add; the safety form only forgives). **The contest's figures do not move with U5**:
the incumbent is protected in a contest in 100% of calm places at every size at untouched settings under all three
rules, and with every dial random U5 moves no protected share at any size (ruled -> U5: town 99% -> 99%, city 98% ->
98%); the crisis-born arm is untouched (no crisis-born score falls or rises past a cut but one crisis-born town at
untouched settings, Tolerated -> Approved); the capture rung differs in 0 of 600 (hxd), 0 of 1200 (hxu) and 1 of 600
(hxr) towns, because the merits land after the rung is born (section 8). What moves the contest is FORTUNE-1's ruled
rule (its section 5.2), not U5. **The one structural cost (section 11):
the facts the merits read (the ruler's card, the history) are born AFTER the standing**, so the build is a late step that
re-bands the score; the powers' legitimacy multipliers were applied at the pre-merit band in the towns it moves.

## 2. The chair's figures, re-measured (EXECUTED, `u5-report.mjs search`; calm towns; seeds hxd, hxr, hxu)

| the chair's figure | the record on my seeds | holds? |
|---|---|---|
| "about -4 from SAFETY at every size" (calm) | calm: -0.9, -0.7, -0.6, 0.0, -1.8, -0.1 (thorp to metropolis, hxd); ALL towns: -5.3, -5.0, -4.4, -3.4, -4.3, -4.3 | NO for calm towns; it is the all-towns mean (crisis strain labels, -12) |
| principled ruler 3% to 20% | rank 1 of the governing power, dominant trait in `straight`: 6-18% (hxd), 5-15% (hxr), 8-13% (hxu); found in 416 of 416 calm towns (hxd) | yes |
| hardship major or worse, no trouble of its kind today, 22% (thorp) to 69% (metropolis), growing | that reading: 76-100% (hxd); CATASTROPHIC weathered, any age: 21% to 78% (hxd), 28% to 76% (hxu): the chair's figure matches the catastrophic reading | the growth holds; the 22-69 matches "catastrophic" |
| "no trouble of today about the ruler and no capture" 47% to 78% | 64-80% (hxd), 58-81% (hxr), 70-84% (hxu) | yes (no size trend) |
| `previousGovernments` absent in every born town | absent in 416 + 396 + 806 calm towns | yes |
| no alliance of faith and seat | no relation of type `allied`; seat-faith is `dependent` (237 of 416 calm, hxd) or `tense` (8) | yes |

## 3. PART 1: SAFETY against the size's usual (EXECUTED, `measures/u5-usual.txt`, derivation seeds hxe)

The calm safety ladder is Dangerous, Unsafe, Moderate, Safe, Very Safe (`safetyProfile.js`; a crisis strain label such
as "Tense — Plague" and the two governance labels, "Controlled — Authoritarian" and "Dangerous — Criminal Governance",
are not on it and keep today's points). Its usual range by size, p10 to p90 on 600 towns of the derivation set:

```
calm:
thorp       n  64  p10 2 p90 2  [Moderate .. Moderate]  (Dangerous 4, Unsafe 0, Moderate 60, Safe 0, Very Safe 0)
hamlet      n  65  p10 2 p90 2  [Moderate .. Moderate]  (Dangerous 3, Unsafe 0, Moderate 62, Safe 0, Very Safe 0)
village     n  72  p10 2 p90 2  [Moderate .. Moderate]  (Dangerous 0, Unsafe 0, Moderate 72, Safe 0, Very Safe 0)
town        n  77  p10 2 p90 2  [Moderate .. Moderate]  (Dangerous 0, Unsafe 0, Moderate 74, Safe 3, Very Safe 0)
city        n  66  p10 1 p90 2  [Unsafe .. Moderate]  (Dangerous 0, Unsafe 20, Moderate 46, Safe 0, Very Safe 0)
metropolis  n  71  p10 2 p90 2  [Moderate .. Moderate]  (Dangerous 0, Unsafe 0, Moderate 71, Safe 0, Very Safe 0)
```

THE RULE (DRAFT row `standing.safetyUsualRange`): inside the range, 0; outside it, the label's own points (today's
`safetyContrib`) less those of the nearest usual band. At untouched settings the change is one cell: a calm city's
Unsafe streets (20 of 66 on hxe, 25% of calm cities on hxd) go from -8 to 0; Safe (+15) and Very Safe (+20) keep their
points everywhere, so the earned top of the ladder is untouched with every dial random.

REJECTED (measured, `measures/u5-points-*.txt`): defence's own form (4 points a band outside the range, within ±10)
cuts Safe from +15 to +4 and Very Safe from +20 to +8: with every dial random calm Endorsed falls at the town 23% -> 13%
and the city 16% -> 8%, Contested RISES (thorp 23% -> 27%, town 19% -> 23%) and 95 towns' scores fall. It would
lower standing where the record has earned it.

## 4. PART 2: the merits (EXECUTED, `measures/u5-search.txt`; calm towns; share of the size's calm towns)

Every candidate is a pure read of the born record (the line of `u5-measure.mjs`). Three seed sets; the rows that decide:

```
ruled-hxd.jsonl: calm towns by size: thorp 70, hamlet 66, village 70, town 70, city 73, metropolis 67
ruler found (rank 1 of the governing power): 416 of 416
                                                                                                  thorp hamlet villag   town   city metrop
principled ruler (dominant trait in the straight family, no vice)                                   13%     5%     6%    11%    12%    13%
principled ruler, any flaw (the chair's reading)                                                    17%     6%     7%    13%    14%    18%
kindly ruler (dominant trait in the warm family, no vice)                                            9%    14%    16%     7%     8%    12%
ruler with no flaw at all                                                                           27%    32%    31%    31%    26%    33%
weathered catastrophe within 60 years (no trouble of its kind today, none "never put right")         9%    21%    16%    13%    16%    22%
weathered catastrophe within 40 years                                                                3%    15%    13%     7%    10%    15%
weathered catastrophe within 100 years                                                              11%    26%    21%    29%    32%    33%
weathered catastrophe, any age                                                                      21%    26%    30%    39%    64%    78%
weathered hardship major or worse, any age (the chair's reading)                                    76%    82%    91%    93%    99%   100%
a legacy line "hit hard, and it has since recovered"                                                31%    35%    49%    57%    77%    61%
a legacy line "the way it is ruled was settled then" (political drift)                              17%    12%    30%    50%    30%    43%
founded "through sustained effort and reliable governance"                                          13%    14%    19%    11%    12%     6%
a siege in the history (siegeNarrative)                                                             19%     9%     9%    10%     3%     0%
every relation of the seat calm (none tense or competitive)                                          0%    18%    83%    93%    88%    88%
faith and seat ALLIED (a relation of type allied)                                                    0%     0%     0%     0%     0%     0%
previousGovernments present                                                                          0%     0%     0%     0%     0%     0%
a neighbour relationship recorded                                                                    0%     0%     0%     0%     0%     0%
CONDITION: no trouble of today concerns the ruler, no capture (U5's)                                77%    74%    67%    80%    64%    73%
  of which: no tension of the ruler's kinds or naming the seat                                      77%    74%    67%    81%    66%    75%
  of which: capture rung not corrupted or capture                                                  100%   100%   100%    99%    99%    94%
rejected condition: also no HIGH conflict naming the seat                                           77%    73%    64%    59%    22%    28%

ruled-hxr.jsonl: calm towns by size: thorp 62, hamlet 59, village 70, town 69, city 63, metropolis 73
ruler found (rank 1 of the governing power): 396 of 396
                                                                                                  thorp hamlet villag   town   city metrop
principled ruler (dominant trait in the straight family, no vice)                                   10%     5%     9%    10%    11%     4%
principled ruler, any flaw (the chair's reading)                                                    15%     5%    11%    12%    14%     5%
kindly ruler (dominant trait in the warm family, no vice)                                            6%    14%    20%    14%    11%     5%
ruler with no flaw at all                                                                           29%    29%    33%    35%    35%    22%
weathered catastrophe within 60 years (no trouble of its kind today, none "never put right")         8%    20%    11%    17%     8%    18%
weathered catastrophe within 40 years                                                                3%    17%     9%    12%     5%     8%
weathered catastrophe within 100 years                                                              15%    24%    20%    23%    21%    30%
weathered catastrophe, any age                                                                      27%    24%    30%    39%    63%    85%
weathered hardship major or worse, any age (the chair's reading)                                    74%    75%    89%    91%    97%   100%
a legacy line "hit hard, and it has since recovered"                                                31%    44%    49%    55%    56%    62%
a legacy line "the way it is ruled was settled then" (political drift)                              23%     8%    30%    28%    41%    37%
founded "through sustained effort and reliable governance"                                          16%     7%    10%     9%     5%     5%
a siege in the history (siegeNarrative)                                                             19%    17%    16%    10%     0%     0%
every relation of the seat calm (none tense or competitive)                                          0%    17%    71%    86%    76%    63%
faith and seat ALLIED (a relation of type allied)                                                    0%     0%     0%     0%     0%     0%
previousGovernments present                                                                          0%     0%     0%     0%     0%     0%
a neighbour relationship recorded                                                                    0%     0%     0%     0%     0%     0%
CONDITION: no trouble of today concerns the ruler, no capture (U5's)                                68%    81%    67%    58%    65%    63%
  of which: no tension of the ruler's kinds or naming the seat                                      68%    81%    67%    70%    68%    70%
  of which: capture rung not corrupted or capture                                                  100%   100%   100%    86%    97%    90%
rejected condition: also no HIGH conflict naming the seat                                           68%    80%    64%    42%    29%    21%

ruled-hxu.jsonl: calm towns by size: thorp 125, hamlet 128, village 142, town 134, city 147, metropolis 130
ruler found (rank 1 of the governing power): 806 of 806
                                                                                                  thorp hamlet villag   town   city metrop
principled ruler (dominant trait in the straight family, no vice)                                    6%     4%     6%     9%     8%     6%
principled ruler, any flaw (the chair's reading)                                                    10%     8%    10%    13%    11%    12%
kindly ruler (dominant trait in the warm family, no vice)                                           14%    11%    10%    11%     5%    10%
ruler with no flaw at all                                                                           28%    32%    33%    33%    27%    32%
weathered catastrophe within 60 years (no trouble of its kind today, none "never put right")         6%    14%    18%    19%    15%    15%
weathered catastrophe within 40 years                                                                5%    12%    12%    13%     9%    11%
weathered catastrophe within 100 years                                                              17%    16%    25%    30%    24%    25%
weathered catastrophe, any age                                                                      28%    16%    33%    47%    58%    76%
weathered hardship major or worse, any age (the chair's reading)                                    81%    76%    87%    93%    99%   100%
a legacy line "hit hard, and it has since recovered"                                                42%    45%    48%    61%    67%    69%
a legacy line "the way it is ruled was settled then" (political drift)                              18%    15%    31%    37%    37%    39%
founded "through sustained effort and reliable governance"                                          14%    21%     8%     9%     7%    15%
a siege in the history (siegeNarrative)                                                             15%    20%     8%     4%     3%     1%
every relation of the seat calm (none tense or competitive)                                          0%    18%    83%    93%    89%    90%
faith and seat ALLIED (a relation of type allied)                                                    0%     0%     0%     0%     0%     0%
previousGovernments present                                                                          0%     0%     0%     0%     0%     0%
a neighbour relationship recorded                                                                    0%     0%     0%     0%     0%     0%
CONDITION: no trouble of today concerns the ruler, no capture (U5's)                                74%    74%    70%    84%    71%    71%
  of which: no tension of the ruler's kinds or naming the seat                                      75%    74%    70%    85%    76%    78%
  of which: capture rung not corrupted or capture                                                   99%   100%   100%    99%    94%    92%
rejected condition: also no HIGH conflict naming the seat                                           74%    73%    68%    66%    35%    18%
```

CHOSEN:
1. **The principled ruler.** The ruler is the card holding rank 1 of the governing power (`npcs[].memberships`); its
   `personality.dominant` maps to `straight` in `DEALING_TRAIT_FAMILY` (honest, candid, forthright, plain-dealing,
   principled, incorruptible, fair-minded, equitable), and its `flaw` does not map to `price` (greedy, corrupt, ...),
   `slippery` (deceitful, ...) or `hard` (cruel, ruthless, ...): an "incorruptible" ruler who is also "corrupt" is not
   principled. 4-13% by size on three sets; flat (hxu 6, 4, 6, 9, 8, 6).
2. **A catastrophe weathered within a generation.** A `historicalEvents[]` entry graded `catastrophic`, at most 40 years
   ago, whose `templateType` names no `currentTensions[]` today, and no legacy annotation of it says "never been put
   right". 3-17% by size; flat (hxu 5, 12, 12, 13, 9, 11). This is the chair's "hardship judged against what a place of
   its size usually remembers": the window, not the size, bounds it. A metropolis remembers ten events where a thorp
   remembers two-and-a-half, so "any age" grows 21% -> 78%; within a generation it does not. The 60-year window was
   executed too (`measures/u5-window60-*.txt`): merit rates 6-22%, but Endorsed at untouched settings reads 7% (hxd) and 8% (hxu)
   at the town and 5% and 6% at the city, above the target; 40 holds it pooled (section 6). The legacy clause excludes 4 of 71
   weathered catastrophes (hxd, 60 years).

MEASURED AND NOT CHOSEN: the kindly ruler (`warm` family, 5-20%, flat) is a second trait of the same card and doubles
the rate of the first merit (Endorsed 4-11% by size with it, computed from the hxd records with the 60-year window); "no flaw at all" (22-35%) sits at the band's
top; "founded through sustained effort and reliable governance" (5-21%) speaks of founders centuries dead in a
metropolis; a siege in the history falls with size (19% -> 0%); a "recovered" legacy line (31-77%) and the political
"settled then" line (8-50%) grow with size; every relation of the seat calm is absent at a thorp and 83-93% elsewhere.
`neighborRelationship` is null at untouched settings; there is no faith-seat alliance in the record (section 2).

## 5. PART 3: the condition (no trouble of today about the ruler)

Never a merit: the merits count only where (a) no `history.currentTensions[]` entry is of the ruler's kinds
(`succession_crisis`, `corruption_scandal`, `tyranny`, `popular_uprising`, `legitimacy_crisis`, `leadership_vacuum`)
or names the governing power among its `factions`, and (b) the capture rung is not `corrupted` or `capture`. Met in
58-84% of calm places, no size trend (section 2). REJECTED: adding "no HIGH conflict naming the seat" (the seat's
quarrels in `powerStructure.conflicts`) falls with size (77% at a thorp, 18-28% at a metropolis): it would make
Endorsed rarer the larger the place, the fault FS1 removed. A merit also counts only where the standing before it is at
least Tolerated (45, the band's own cut, no new figure): a merit lifts a ruler the people already accept; it never
lifts a Contested seat whose stability line, legacy annotations and card positions were born saying it is contested.

## 6. PART 4: the target (EXECUTED; standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed)

UNTOUCHED SETTINGS, seeds hxd-<size>-<0..99> (`measures/u5-untouched.txt`):

```
=== BORN UNDER NO CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                 9/27/61/3/0          4/11/56/29/0          4/11/49/31/4   70, 70, 70
hamlet               12/39/48/0/0          5/17/42/36/0          5/17/38/35/6   66, 66, 66
village               3/66/30/1/0          0/14/49/37/0          0/14/44/37/4   70, 70, 70
town                  0/4/59/37/0           0/6/66/29/0           0/6/54/36/4   70, 70, 70
city                  0/0/0/59/41           0/8/64/27/0           0/3/42/53/1   73, 73, 73
metropolis             0/0/0/9/91           0/0/81/19/0           0/0/61/37/1   67, 67, 67

=== BORN UNDER A CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                 63/33/3/0/0          37/37/27/0/0          37/37/27/0/0   30, 30, 30
hamlet                76/21/3/0/0          41/35/21/3/0          41/35/21/3/0   34, 34, 34
village               90/10/0/0/0          43/30/27/0/0          43/30/27/0/0   30, 30, 30
town                 23/57/20/0/0          23/43/33/0/0          23/43/30/3/0   30, 30, 30
city                  4/0/70/26/0          15/48/33/4/0          15/48/33/4/0   27, 27, 27
metropolis           12/0/48/36/3          21/45/30/3/0          21/45/30/3/0   33, 33, 33

=== FS4: the Legitimacy Crisis share, ruled -> with U5 (must not rise at any size), and the towns whose score FELL
thorp      calm 3 -> 3 held | crisis-born 11 -> 11 held | score fell in 0 towns (calm or not)
hamlet     calm 3 -> 3 held | crisis-born 14 -> 14 held | score fell in 0 towns (calm or not)
village    calm 0 -> 0 held | crisis-born 13 -> 13 held | score fell in 0 towns (calm or not)
town       calm 0 -> 0 held | crisis-born 7 -> 7 held | score fell in 0 towns (calm or not)
city       calm 0 -> 0 held | crisis-born 4 -> 4 held | score fell in 0 towns (calm or not)
metropolis calm 0 -> 0 held | crisis-born 7 -> 7 held | score fell in 0 towns (calm or not)

=== REASONS: calm towns Endorsed with U5: 15; by reasons count: 2 reasons 14, 3 reasons 1; fewer than two: 0
Endorsed with U5 (calm), by what carried it: principled+prosperity15 7; weathered+prosperity15 7; principled+prosperity15+defense1 1
```

UNTOUCHED SETTINGS, the confirmation set hxu-<size>-<0..199> (`measures/u5-confirm.txt`; "today" is not birthed here,
the first two columns are both the ruled rule):

```
=== BORN UNDER NO CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                3/10/50/37/0          3/10/50/37/0          3/10/47/37/3   125, 125, 125
hamlet               2/16/36/47/0          2/16/36/47/0          2/16/30/51/2   128, 128, 128
village              0/11/54/35/0          0/11/54/35/0          0/11/49/38/2   142, 142, 142
town                  0/3/56/41/0           0/3/56/41/0           0/3/44/47/6   134, 134, 134
city                 0/10/75/14/1          0/10/75/14/1           0/3/62/32/3   147, 147, 147
metropolis            0/0/64/36/0           0/0/64/36/0           0/0/57/39/4   130, 130, 130

=== BORN UNDER A CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                43/32/24/1/0          43/32/24/1/0          43/32/24/1/0   75, 75, 75
hamlet               44/29/26/0/0          44/29/26/0/0          44/29/25/1/0   72, 72, 72
village              34/38/24/3/0          34/38/24/3/0          34/38/24/3/0   58, 58, 58
town                 44/32/24/0/0          44/32/24/0/0          44/32/24/0/0   66, 66, 66
city                 40/38/21/2/0          40/38/21/2/0          40/38/19/2/2   53, 53, 53
metropolis           23/43/30/4/0          23/43/30/4/0          23/43/30/4/0   70, 70, 70

=== FS4: the Legitimacy Crisis share, ruled -> with U5 (must not rise at any size), and the towns whose score FELL
thorp      calm 4 -> 4 held | crisis-born 32 -> 32 held | score fell in 0 towns (calm or not)
hamlet     calm 2 -> 2 held | crisis-born 32 -> 32 held | score fell in 0 towns (calm or not)
village    calm 0 -> 0 held | crisis-born 20 -> 20 held | score fell in 0 towns (calm or not)
town       calm 0 -> 0 held | crisis-born 29 -> 29 held | score fell in 0 towns (calm or not)
city       calm 0 -> 0 held | crisis-born 21 -> 21 held | score fell in 0 towns (calm or not)
metropolis calm 0 -> 0 held | crisis-born 16 -> 16 held | score fell in 0 towns (calm or not)

=== REASONS: calm towns Endorsed with U5: 28; by reasons count: 2 reasons 21, 3 reasons 6, 4 reasons 1; fewer than two: 0
Endorsed with U5 (calm), by what carried it: weathered+prosperity15 12; principled+prosperity15 7; principled+weathered+prosperity8 4; principled+weathered+prosperity15 1; principled+weathered+prosperity8+defense2 1; weathered+safety15 1; principled+prosperity15+defense3 1; prosperity15+safety15 1

=== MERITS COUNTED with U5 (calm; a merit counts only at Tolerated or better with no trouble of the ruler), share of the size's calm towns
                                thorp hamlet villag   town   city metrop
principled                         4%     3%     3%     7%     5%     5%
weathered                          3%     7%     6%    10%     7%     6%
any merit                          6%     9%     8%    17%    11%    11%
two merits                         1%     1%     1%     1%     1%     0%
```

EVERY DIAL RANDOM (`run.sh`'s DIALS), seeds hxr-<size>-<0..99> (`measures/u5-every-dial.txt`):

```
=== BORN UNDER NO CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                 6/39/48/5/2          3/23/47/26/2          3/23/42/27/5   62, 62, 62
hamlet                7/31/51/8/3          2/19/22/49/8         2/19/17/44/19   59, 59, 59
village             16/40/29/13/3         0/14/41/34/10         0/14/36/37/13   70, 70, 70
town                7/10/33/20/29         1/19/30/26/23         1/19/26/28/26   69, 69, 69
city                  0/0/6/41/52         0/14/48/22/16         0/11/46/22/21   63, 63, 63
metropolis            0/0/1/37/62         0/15/47/25/14         0/15/42/29/14   73, 73, 73

=== BORN UNDER A CRISIS: standing, Legitimacy Crisis / Contested / Tolerated / Approved / Endorsed (% of the size's towns in the arm, each run's own arm)
size                        today                 ruled               with U5   n (today, ruled, U5)
thorp                 82/16/3/0/0          61/26/13/0/0          61/26/13/0/0   38, 38, 38
hamlet                88/12/0/0/0          66/22/12/0/0          66/22/12/0/0   41, 41, 41
village               87/13/0/0/0          50/27/23/0/0          50/27/23/0/0   30, 30, 30
town                 45/35/16/3/0          48/35/13/3/0          48/35/13/3/0   31, 31, 31
city                 24/27/41/5/3          57/30/11/0/3          57/30/11/0/3   37, 37, 37
metropolis          15/11/52/19/4          44/30/22/4/0          44/30/22/4/0   27, 27, 27

=== FS4: the Legitimacy Crisis share, ruled -> with U5 (must not rise at any size), and the towns whose score FELL
thorp      calm 2 -> 2 held | crisis-born 23 -> 23 held | score fell in 0 towns (calm or not)
hamlet     calm 1 -> 1 held | crisis-born 27 -> 27 held | score fell in 0 towns (calm or not)
village    calm 0 -> 0 held | crisis-born 15 -> 15 held | score fell in 0 towns (calm or not)
town       calm 1 -> 1 held | crisis-born 15 -> 15 held | score fell in 0 towns (calm or not)
city       calm 0 -> 0 held | crisis-born 21 -> 21 held | score fell in 0 towns (calm or not)
metropolis calm 0 -> 0 held | crisis-born 12 -> 12 held | score fell in 0 towns (calm or not)

=== REASONS: calm towns Endorsed with U5: 64; by reasons count: 2 reasons 41, 3 reasons 22, 4 reasons 1; fewer than two: 0
Endorsed with U5 (calm), by what carried it: prosperity15+safety20 9; prosperity20+safety15 8; prosperity8+safety20 7; weathered+prosperity15 5; prosperity20+safety20 5; prosperity15+safety15 3; weathered+prosperity8+safety15 3; weathered+prosperity15+safety15 3; principled+prosperity15 3; prosperity15+safety15+defense3 2; prosperity15+safety20+defense3 2; principled+prosperity8+safety20 2; principled+prosperity15+defense1 1; weathered+safety20+defense2 1; prosperity20+safety20+defense2 1; weathered+prosperity20 1; prosperity20+safety15+defense2 1; principled+prosperity8+safety15 1; prosperity15+safety15+defense2 1; prosperity8+safety20+defense2 1; prosperity8+safety20+defense5 1; principled+prosperity20+safety15 1; principled+prosperity15+safety20+defense3 1; weathered+prosperity15+safety20 1
```

THE TWO-REASON RULE: a reason is a merit or a positive term of the sum. With merits at 10, one reason can never reach
75 (the largest single positive term is 20: 50 + 20 = 70), so the guard never fires; it stays in the rule as the
build's test. Calm Endorsed under U5 by reasons: hxd 14 on two reasons, 1 on three; hxu 21 on two, 6 on three, 1 on four; hxr (every dial) 41, 22, 1. None on fewer than two. What carries it at untouched settings (hxd): principled + Prosperous 7, weathered + Prosperous 7, principled + Prosperous + defence above usual 1.

## 7. PART 5: the reason is printed (read only; PLAUSIBLE until built)

THE LABEL STAYS A BAND. The score carries the merits as one term of the stored breakdown (`breakdown.merits`, the
points); the WORDS are composed at render, from the document in hand only, never stored.

THE RENDER FILE AND FUNCTION: `src/domain/display/stateProse/powerStateProse.js :: powerStateProse` (DS-POW-1, the
legitimacy banner, which today returns the `legitimacyBanner` and `legitimacyLens` rungs). A new pure reader beside
`legitimacyLensPoolKey`, `legitimacyMeritsOf(settlement)`, re-reads the two merits from the record (the same predicates
as the birth step: a shared helper in the fortune leaf's domain, so the page and the birth cannot disagree) and the
desk returns one more rung (`legitimacyMerits`) through the same composer; its pool sentences are content's to author
and are not quoted here. Lens B iterates `BREAKDOWN_WORD`'s four fields only, so the new breakdown key is silent there
(read in the code).

WHAT A SHARED PAGE CARRIES (EXECUTED, `publicSafe.js :: toPublicSafe` on every born town, `measures/u5-shared.txt`):

| fact | on a shared page | measured |
|---|---|---|
| the ruler (rank 1 of the seat) | `npcs[].memberships` ride only per row by the veil bit (a card with no institution record, or a veiled one, loses them) | found in 100% (hxd) and 96% (hxr) of shared pages; 100% of the towns with a merit |
| the ruler's traits | `personality` is in `NPC_PUBLIC_KEYS` | carried wherever the ruler is |
| the history's events (severity, yearsAgo, templateType, name) | `history` is public; hooks stripped | 100% |
| today's tensions | `history.currentTensions` preserved explicitly | 100% |
| the legacy lines | public | 100% |
| the capture rung | STRIPPED (`criminalCaptureState` absent) | 0%: a CONDITION, never printed, so nothing is lost |
| the breakdown | public | 100% |

A shared page lacking the ruler's membership omits the principled reason (the points stay in the score, as every term
does). Measured: no town with a counted merit would lose its reason on its shared page.

## 8. The contest's figures (EXECUTED; today -> ruled -> with U5)

```
UNTOUCHED (hxd)
=== THE CONTEST'S FIGURES: today -> ruled -> with U5
calm: the incumbent protected (rulingPowerCoup.js :: coupContenders().incumbent.gated) | capture rung equilibrium or worse | corrupted or capture | below 45 | score mean
  thorp       protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 36% -> 16% -> 16% | 46.7 -> 54.6 -> 55.7
  hamlet      protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 52% -> 21% -> 21% | 42.4 -> 54.5 -> 55.7
  village     protected 100% -> 100% -> 100% | eq+ 1% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 69% -> 14% -> 14% | 41.2 -> 56.4 -> 57.2
  town        protected 100% -> 100% -> 100% | eq+ 6% -> 4% -> 4%    | corr+ 1% -> 1% -> 1%  | <45 4% -> 6% -> 6%    | 56.5 -> 57.1 -> 58.8
  city        protected 100% -> 100% -> 100% | eq+ 10% -> 12% -> 12% | corr+ 1% -> 1% -> 1%  | <45 0% -> 8% -> 3%    | 71.8 -> 56.3 -> 60.1
  metropolis  protected 100% -> 100% -> 100% | eq+ 12% -> 18% -> 18% | corr+ 3% -> 6% -> 6%  | <45 0% -> 0% -> 0%    | 74.7 -> 58.3 -> 60.4
crisis-born: the incumbent protected (rulingPowerCoup.js :: coupContenders().incumbent.gated) | capture rung equilibrium or worse | corrupted or capture | below 45 | score mean
  thorp       protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 97% -> 73% -> 73% | 21.3 -> 28.1 -> 28.5
  hamlet      protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 97% -> 76% -> 76% | 19.8 -> 31.2 -> 31.2
  village     protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 100% -> 73% -> 73% | 17.4 -> 33.3 -> 33.3
  town        protected 70% -> 77% -> 77%    | eq+ 10% -> 10% -> 10% | corr+ 0% -> 0% -> 0%  | <45 80% -> 67% -> 67% | 36.0 -> 36.8 -> 37.5
  city        protected 81% -> 59% -> 59%    | eq+ 33% -> 37% -> 37% | corr+ 11% -> 11% -> 11% | <45 4% -> 63% -> 63%  | 54.4 -> 39.6 -> 39.6
  metropolis  protected 82% -> 39% -> 39%    | eq+ 33% -> 45% -> 45% | corr+ 12% -> 12% -> 12% | <45 12% -> 67% -> 67% | 52.1 -> 36.7 -> 37.0

THE BIRTH UNDER U5 vs THE RULED BIRTH: towns whose crisis, ruler's trait or history differ: 0 of 600; towns whose capture rung differs: 0; whose band differs: 71

EVERY DIAL RANDOM (hxr)
=== THE CONTEST'S FIGURES: today -> ruled -> with U5
calm: the incumbent protected (rulingPowerCoup.js :: coupContenders().incumbent.gated) | capture rung equilibrium or worse | corrupted or capture | below 45 | score mean
  thorp       protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 45% -> 26% -> 26% | 46.6 -> 53.7 -> 54.5
  hamlet      protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 37% -> 20% -> 20% | 47.7 -> 59.3 -> 61.0
  village     protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 56% -> 14% -> 14% | 44.3 -> 58.7 -> 59.9
  town        protected 100% -> 99% -> 99%   | eq+ 23% -> 23% -> 23% | corr+ 14% -> 14% -> 14% | <45 17% -> 20% -> 20% | 61.3 -> 61.7 -> 62.8
  city        protected 100% -> 98% -> 98%   | eq+ 8% -> 14% -> 13%  | corr+ 3% -> 3% -> 3%  | <45 0% -> 14% -> 11%  | 76.1 -> 59.4 -> 61.4
  metropolis  protected 100% -> 100% -> 100% | eq+ 15% -> 23% -> 23% | corr+ 8% -> 10% -> 10% | <45 0% -> 15% -> 15%  | 76.0 -> 58.8 -> 59.6
crisis-born: the incumbent protected (rulingPowerCoup.js :: coupContenders().incumbent.gated) | capture rung equilibrium or worse | corrupted or capture | below 45 | score mean
  thorp       protected 100% -> 100% -> 100% | eq+ 3% -> 3% -> 3%    | corr+ 3% -> 3% -> 3%  | <45 97% -> 87% -> 87% | 17.7 -> 22.7 -> 22.7
  hamlet      protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 100% -> 88% -> 88% | 14.2 -> 22.0 -> 22.0
  village     protected 100% -> 100% -> 100% | eq+ 0% -> 0% -> 0%    | corr+ 0% -> 0% -> 0%  | <45 100% -> 77% -> 77% | 16.5 -> 28.8 -> 29.4
  town        protected 74% -> 74% -> 74%    | eq+ 48% -> 52% -> 52% | corr+ 23% -> 23% -> 23% | <45 81% -> 84% -> 84% | 30.5 -> 29.5 -> 29.8
  city        protected 78% -> 54% -> 54%    | eq+ 43% -> 43% -> 43% | corr+ 14% -> 14% -> 14% | <45 51% -> 86% -> 86% | 40.4 -> 25.1 -> 25.4
  metropolis  protected 89% -> 63% -> 63%    | eq+ 30% -> 41% -> 41% | corr+ 0% -> 4% -> 4%  | <45 26% -> 74% -> 74% | 47.5 -> 31.1 -> 31.5

THE BIRTH UNDER U5 vs THE RULED BIRTH: towns whose crisis, ruler's trait or history differ: 0 of 600; towns whose capture rung differs: 1; whose band differs: 36
```

At untouched settings the merits move nothing the contest reads: protection is 100% for every calm place under all
three rules (the coup gate reads the band, and a merit only lifts a band at Tolerated or above, where the incumbent is
already protected), the crisis-born arm moves by one town (hxd: a crisis-born town with a merit and no trouble of the
ruler, Tolerated -> Approved), and the capture rung is born
in `generatePower` before the merits exist (measured: the rung differs from the ruled birth in 0 of 600 towns on hxd, 0 of 1200 on hxu, 1 of 600 on hxr, the last a city whose Unsafe streets PART 1 forgave). With every dial random the same: see the file.

## 9. Twenty calm towns (EXECUTED, `measures/u5-twenty.txt`; standing today / ruled / with U5; seeds hxd)

Per size the first two calm towns with a merit counted and the first without, then calm towns Endorsed with U5:

```
Qinggang (thorp, hxd-thorp-2): Tolerated 57 / Approved 66 / Endorsed 76. Decides: merits: principled; ruler Elder: incorruptible; terms prosperity 15, safety 0, defense 1, food 0, merits 10.
Lyssono (thorp, hxd-thorp-23): Approved 64 / Approved 65 / Endorsed 75. Decides: merits: principled; ruler Household Elder: candid, flaw paranoid; catastrophes: The Occupation 91y; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
Rossleigh (thorp, hxd-thorp-0): Tolerated 57 / Approved 65 / Approved 65. Decides: no merit counted; ruler Elder: no dominant trait, flaw imperious; terms prosperity 15, safety 0, defense 0, food 0.
Steinhausen (hamlet, hxd-hamlet-0): Tolerated 49 / Approved 60 / Approved 70. Decides: merits: principled; ruler Headman: incorruptible, flaw stubborn; catastrophes: The Flood 44y; terms prosperity 8, safety 0, defense 2, food 0, merits 10.
Langenkoppel (hamlet, hxd-hamlet-27): Contested 38 / Tolerated 50 / Approved 60. Decides: merits: weathered; ruler Elder: charismatic, flaw envious; catastrophes: The Plague Years 23y; terms prosperity 0, safety 0, defense 0, food 0, merits 10.
Breitwiese (hamlet, hxd-hamlet-3): Tolerated 48 / Approved 65 / Approved 65. Decides: no merit counted; ruler Elder: merciful; terms prosperity 15, safety 0, defense 0, food 0.
Baildale (village, hxd-village-20): Tolerated 47 / Approved 65 / Endorsed 75. Decides: merits: weathered; ruler Headman: wise, flaw reckless; catastrophes: The Occupation 33y; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
Nordby (village, hxd-village-26): Contested 34 / Tolerated 58 / Approved 68. Decides: merits: weathered; ruler Reeve: no dominant trait; catastrophes: The Siege 28y; terms prosperity 8, safety 0, defense 0, food 0, merits 10.
Dobroki (village, hxd-village-0): Contested 37 / Tolerated 50 / Tolerated 50. Decides: no merit counted; ruler Headman: no dominant trait, flaw corrupt; terms prosperity 0, safety 0, defense 0, food 0.
Kalitsy (town, hxd-town-38): Approved 65 / Approved 65 / Endorsed 75. Decides: merits: principled; ruler Alderman: fair-minded; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
Grudovo (town, hxd-town-39): Tolerated 56 / Tolerated 58 / Approved 68. Decides: merits: weathered; ruler Mayor: no dominant trait; catastrophes: The Occupation 9y; terms prosperity 8, safety 0, defense 0, food 0, merits 10.
Petenmul (town, hxd-town-0): Tolerated 58 / Tolerated 58 / Tolerated 58. Decides: no merit counted; ruler's trouble today (corruption_scandal); ruler Mayor: scholarly; terms prosperity 8, safety 0, defense 0, food 0.
Becanhuitz (city, hxd-city-10): Approved 72 / Tolerated 50 / Approved 60. Decides: merits: weathered; ruler the monarch: no dominant trait, flaw wrathful; catastrophes: The Great Fire 221y, The Occupation 12y; terms prosperity 0, safety 0, defense 0, food 0, merits 10.
Padmathal (city, hxd-city-15): Approved 72 / Tolerated 50 / Approved 60. Decides: merits: weathered; ruler Lord Mayor: protective, flaw dismissive; catastrophes: The Uprising 258y, The Occupation 210y, The Siege 7y; terms prosperity 0, safety 0, defense 0, food 0, merits 10.
Dionkastro (city, hxd-city-2): Approved 64 / Tolerated 50 / Tolerated 58. Decides: no merit counted; ruler Lord Mayor: no dominant trait, flaw vain; catastrophes: The Flood 204y; terms prosperity 8, safety 0, defense 0, food 0.
Khutulunörtöö (metropolis, hxd-metropolis-13): Endorsed 75 / Approved 65 / Endorsed 75. Decides: merits: weathered; ruler Lord Mayor: no dominant trait; catastrophes: The Flood 32y; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
Doirecross (metropolis, hxd-metropolis-24): Endorsed 75 / Tolerated 58 / Approved 68. Decides: merits: principled; ruler First Councillor: forthright, flaw dismissive; terms prosperity 8, safety 0, defense 0, food 0, merits 10.
Bellaplenum (metropolis, hxd-metropolis-3): Endorsed 75 / Tolerated 58 / Tolerated 58. Decides: no merit counted; ruler the governor: no dominant trait; catastrophes: The Occupation 359y; terms prosperity 8, safety 0, defense 0, food 0.
Saltoripa (thorp, hxd-thorp-84): Tolerated 57 / Approved 65 / Endorsed 75. Decides: merits: principled; ruler Household Elder: incorruptible; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
Zuubash (hamlet, hxd-hamlet-39): Tolerated 48 / Approved 65 / Endorsed 75. Decides: merits: weathered; ruler Elder: no dominant trait; catastrophes: The Occupation 5y; terms prosperity 15, safety 0, defense 0, food 0, merits 10.
```

## 10. The draft rows (for `FORTUNE_LAW_TUNING.standing`; DRAFT, signed by none)

| row | value | source |
|---|---|---|
| `safetyUsualRange` | thorp, hamlet, village, town, metropolis `['Moderate','Moderate']`; city `['Unsafe','Moderate']` | p10..p90, seeds hxe, the ruled rule in force |
| `meritPoints` | 10 | the smallest value by which a Prosperous place (65) with one merit reaches 75 |
| `weatheredWithinYears` | 40 | measured against 60 (section 4) |
| `meritFloor` | Tolerated's cut (45, read from `LEGITIMACY_CUTS`, no new figure) | section 5 |
| `endorsedMinReasons` | 2 | the brief |
| vocabulary, not tuning | the `straight` family and the vice families (`npcData.js`); the ruler's-trouble kinds (`historyData.js` types) | read, not chosen |

## 11. What could go wrong

1. **THE FACTS ARE BORN AFTER THE STANDING (measured from the pipeline's own step order).** `generatePower` writes the
   standing; `generatePopulation` then births the ruler's card and `generateNarratives` the history. So the merits
   are a step after `generateNarratives` (the prototype runs them at the end of `generateSettlementPipeline`) that
   re-bands the score through `legitimacyBandFor`. In the towns it moves (the band differs from the ruled birth in 71 of 600 towns on hxd, 109 of 1200 on hxu, 36 of 600 on hxr, PART 1 included), the readers that ran
   before it saw the lower band: `applyLegitimacyMultipliers` (the seat's power x1.00 or x1.15 where the stored band
   now says x1.15 or x1.30; merchants' x1.05 at Endorsed), `govCriminalRelation`'s direction (`declining` at
   Endorsed), `settleClaimsToLabel` and `annotateFactionStanding`. Readers that read only Contested and below (the
   stability line, the cards' conditions, `classifyLegitimacy` for the legacy lines) are unaffected because of the
   Tolerated floor. PLAUSIBLE (read, not run): the play-time `reBand` stamps the same tuple on a moved score today, so the
   shape is not new. The chair rules whether the build re-runs the multipliers in that step or accepts the birth's
   powers; a census of every birth reader of the bands above Tolerated is the build's first task (not done here).
2. **THE TOWN SITS AT THE TARGET'S TOP**: the town reads 4% on hxd and 6% on hxu (pooled 5.4%); the city and the metropolis read 1% on hxd (one place each; pooled 2.3% and 3.0%). An arm of 70 calm places carries about ±2.5 points of sampling error: the rule meets 2 to 5 pooled at every size, not on every seed set. The 60-year window reads 7-8% at the town (section 4); a shorter window would starve the thorp further (not measured).
3. **WITH EVERY DIAL RANDOM ENDORSED RISES** where the record earns it (section 6): merits add, so the owner sees more
   beloved rulers in rich worlds, not only in untouched ones.
4. **THE LEGACY CLAUSE READS WORDS**: the record keeps no field for a legacy line's relationship (`unresolved`,
   `recovery`, `drift`); the prototype reads "never been put right" in the line. The build should read a typed field
   or share `legacyGenerator.js`'s classification, not match text.
5. **THE PRINCIPLED MERIT READS A DISPLAY TABLE**: `DEALING_TRAIT_FAMILY` was written for the card's "How they deal"
   line (STYLE-2 SW-7). If that table is re-voiced, standing moves; the build should name the merit's own trait list
   (equal to today's `straight` family) in the fortune leaf, guarded by a test that the two agree.
6. **A THORP RARELY WEATHERS** (3-5% within 40 years): its principled ruler carries it (4-13%).
7. **PART 1 CALLS UNSAFE STREETS USUAL FOR A CITY** (25-30% of calm cities): the owner may say they should still cost.
8. NOT MEASURED: the merits under the seat's law (`src/domain/seat/`, not on this base); the contest odds were read
   with the line's `coupContenders`.

## 12. The instruments (each in one command; none changes a source file)

- The whole measure: `sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/content/fortune/instruments/u5-run.sh <checkout> <scratch>`.
  It builds the ruled copy (`tree.mjs` proto), the U5 copy (`u5-tree.mjs`: the ruled copy plus `u5-rule.mjs`'s three
  patches, each refused unless it matches once) and two variant copies (`U5_SAFETY=points`, `U5_WINDOW=60`), births
  the seed sets (`u5-measure.mjs`), and writes `measures/u5-*.txt` (`u5-report.mjs`). Here its steps were run one by
  one under the gate mutex (a shared machine); the single command was not run end to end (PLAUSIBLE that it
  reproduces the files byte for byte).
- The knobs: `U5_SAFETY`, `U5_POINTS`, `U5_WINDOW`, `U5_MERITS` (`principled,weathered`; also `kindly`, `founding`),
  `U5_GATE`, read by `u5-rule.mjs` when `u5-tree.mjs` builds a copy.
- The ruled copy reproduces FORTUNE-1's section 15 column "proposal (15)" exactly (hxd and hxr, calm standing rows).
- The U5 birth equals the ruled birth in every fact the merits read: crisis, ruler's traits and history differ in 0 of
  600 towns (hxd), the capture rung in 0.
