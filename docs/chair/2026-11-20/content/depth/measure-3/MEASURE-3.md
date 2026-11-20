# MEASURE-3: where a metropolis still repeats its hooks, and the third tranche's placement (DEPTH-3; written 2026-11-20T18:21Z by `date -u`)

Script: `hookpools.mjs <tree> 50 town,city,metropolis` (born as `measure/born.mjs`: hxd-<size>-0..49, names masked; the own-hook
PAIR share over ALL 2,450 ordered pairs, the same quantity as `measures.mjs` section A and `bill.mjs` section D; it reproduces
bill.mjs's group table at the tip exactly). Probe tree: e0d108bb0 + `probe5.patch` (never committed): tranche 2 as DEPTH-2's
probe 4 tagged it (other +30, economy +6), then a third tranche from the env `PROBE3` (counts, or a theme list per pool).

## The draw (why placement by THEME matters)
`src/generators/hookVariety.js :: drawUnique` prefers, town-wide, a line whose THEME the town has not yet spoken. A theme held by a
single line in a pool is therefore drawn about once per metropolis (economy/crime_ring 0.98 draws a town from 1 line; religious/
succession 0.92; religious/forbidden_love 0.90; government/blackmail 0.78), against 0.3-0.4 a line for a theme with many lines.
New lines in a pool's THIN themes cut the repeats most per line (`hp.t2cells.out.txt`).

## Own-hook pair share by size (50 towns a size, all ordered pairs)
| tree | pools (other/economy/government/religious/magic/criminal) | town | city | metropolis |
|---|---|---|---|---|
| tip e0d108bb0 (tranche 1 built) | 70/38/32/18/8/26 | 15.9 | 29.7 | 41.4 |
| + tranche 2 (placeholders) | 100/44/32/18/8/26 | 13.0 | 25.1 | 34.5 |
| + A: gov 14, rel 10, magic 8, crim 8, econ 10 (pool's own themes) | | 11.4 | 21.6 | 30.0 |
| + B: A + other 20 | | 9.8 | 20.1 | 27.9 |
| + D: rel 10, gov 12, magic 8, econ 10, other 10 (own themes) | | 10.9 | 21.4 | 29.7 |
| + C: D's counts, THEMES AIMED at thin cells | | 11.3 | 21.0 | 29.0 |
| **+ E (PROPOSED): C + other 10 more = 60** | 120/54/44/28/16/26 | **10.3** | **20.4** | **28.0** |

## The proposed placement E (60 hooks; `placeE.json`)
- other 20: divided_loyalty 3, old_wound 3, hidden_debt 3, looming_threat 2, vanished_person 2, secret_identity 2, forbidden_knowledge 2, ambition 2, outsider_suspicion 1
- government 12: divided_loyalty 3, vanished_person 2, forbidden_knowledge 2, old_wound 2, outsider_suspicion 2, ambition 1
- economy 10: scarcity_pressure 3, ambition 2, hidden_debt 2, rivalry 2, betrayal 1
- religious 10: succession 3, forbidden_love 3, faith_crisis 2, secret_identity 1, looming_threat 1
- magic 8 (the simulation tagged one secret_identity, a theme magic does not speak; the writer takes forbidden_knowledge instead):
  looming_threat 2, forbidden_knowledge 3, vanished_person 1, outsider_suspicion 1, betrayal 1
NONE to `criminal` and NO crime theme (crime_ring, smuggling, blackmail) and NO corruption: the hideable rule (no wording may need a
house of a hideable kind or a fact about crime) and the principled-card count. What this leaves: economy/crime_ring's one line is
3.9% of a metropolis's repeats after E (about 1.1 points of the 28.0); curing it needs a crime-themed line, which the rule bars.
