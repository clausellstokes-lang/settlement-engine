# The holder, the contest and the circumstances, arm default (900 born towns through birthConfig, 0 errors)

Executed: `node docs/chair/2026-11-20/content/seat/measure-holder.mjs --arm default --n 150` against `docs/chair/2026-11-20/content/seat/seat-draft.mjs`. BEFORE re-spelled and checked against the shipped `coupContenders`: **0 mismatches**. Raw: `holder-default.json`.

## (1) The holder leaf, rule by rule (owner audience; public audience beside it)

| rule | towns (owner) | towns (public) |
|---|---|---|
| R1 | 0 | 0 |
| R2 | 365 | 365 |
| R3 | 96 | 96 |
| R4 | 413 | 413 |
| R5 | 26 | 26 |

Veiled holders (the owner sees a hidden or criminal power; a public reader is told the office and the person only): 0.

Rule x holder kind: R4:government 403 · R2:merchant 295 · R3:merchant 80 · R2:noble 61 · R5:noble 26 · R3:noble 16 · R4:merchant 10 · R2:military 5 · R2:craft 4

**Towns where two rules answer differently: 0.**


The seat-holder heads more than one other power: 0 towns.

## (2) The contender table per kind (CS4 labels; present = a non-governing power of that kind stands)

| kind | present | contends BEFORE | CS3 alone | CS3+CS4 | CS3+CS4+CS5 |
|---|---|---|---|---|---|
| noble | 252 | 98 | 115 | 115 | 117 |
| craft | 161 | 2 | 37 | 36 | 37 |
| labor | 0 | 0 | 0 | 0 | 0 |
| outsider | 0 | 0 | 0 | 0 | 0 |
| merchant | 473 | 450 | 145 | 145 | 146 |
| military | 452 | 446 | 444 | 444 | 443 |
| religious | 545 | 472 | 525 | 525 | 526 |
| arcane | 207 | 29 | 71 | 71 | 67 |
| criminal | 26 | 0 | 0 | 0 | 0 |
| occupation | 0 | 0 | 0 | 0 | 0 |
| government | 15 | 7 | 8 | 8 | 7 |
| other | 43 | 21 | 27 | 27 | 27 |
| **towns with no contender** | | 240 | 269 | 269 | 269 |

Field size (contenders per town): before 0:240 1:156 2:94 3:410 · cs3 0:269 1:181 2:89 3:361 · cs3cs4 0:269 1:181 2:89 3:361 · cs3cs4cs5 0:269 1:181 2:89 3:361

Coup-risk ladder: before: Holding 407, Stable 240, Contested 220, Critical. The seat could fall 33 · cs3: Holding 402, Stable 269, Contested 205, Critical. The seat could fall 24 · cs3cs4: Holding 402, Stable 269, Contested 205, Critical. The seat could fall 24 · cs3cs4cs5: Holding 398, Stable 269, Contested 209, Critical. The seat could fall 24

Measured only (not proposed): with the holder's own power counted on the incumbent's side, under CS3 the incumbent is gated in 887 towns against 876; risk Holding 446, Stable 269, Contested 172, Critical. The seat could fall 13 against Holding 402, Stable 269, Contested 205, Critical. The seat could fall 24.

## (3) Form x holder kind, against the one table (CS6)

Classes: office:R4 413 · civic 241 · own 215 · office:R5 26 · licensed:civic_fallback 5

- City Council x merchant (civic): 53
- Merchant oligarchy x merchant (own): 42
- Town Mayor x merchant (civic): 42
- Grand Council x merchant (civic): 40
- Merchant Guild Council x merchant (own): 29
- Elder Council x merchant (civic): 28
- Grand Merchant Oligarchy x merchant (own): 23
- Grand Guild Consortium x merchant (own): 22
- Guild Council x merchant (own): 22
- Town Council x merchant (civic): 22
- Democratic assembly x merchant (civic): 21
- Ducal Governorship x noble (own): 21
- City-State Council x merchant (civic): 18
- Noble Governorship x noble (own): 18
- Royal Authority x noble (own): 16
- Feudal Appointee x noble (own): 15
- Elected Reeve x merchant (civic): 9
- Feudal Stewardship x noble (own): 7
- Elder Council x military (licensed:civic_fallback): 3
- Free Elder Council x merchant (civic): 2
- Headman's Authority x merchant (civic): 2
- Town Council x craft (civic): 2
- Town Mayor x craft (civic): 2
- Free Elder Council x military (licensed:civic_fallback): 1
- Headman's Authority x military (licensed:civic_fallback): 1

## (4) The circumstances

| circumstance | reads | towns | by tier |
|---|---|---|---|
| craft_led | powerStructure.factions[] (a non-governing craft power at least four fifths as strong as the strongest merchant power), or economicState.incomeSources' 'Guild Fees' / 'Guild Licensing' at 25 per cent or more with a craft power standing | 9 | town 6, metropolis 3 |
| trade_wealth | economicState.prosperity in {Prosperous, Wealthy} and the largest of economicState.incomeSources is a trade source (Market Taxes, Trade Tariffs, Tolls, Port Fees, Caravan …) | 228 | town 7, city 110, metropolis 111 |
| strong_faith | config.priorityReligion >= 70, or the religious_conversion stress | 23 | thorp 1, hamlet 3, village 6, town 4, city 4, metropolis 5 |
| martial_pressure | the under_siege / wartime / insurgency / monster_pressure stress, or config.priorityMilitary >= 70 | 103 | thorp 23, hamlet 15, village 22, town 13, city 18, metropolis 12 |
| hunger | the famine stress, or economicState.foodSecurity.label beginning 'Deficit' | 23 | thorp 8, hamlet 7, village 3, town 4, city 1 |
| mandate | powerStructure.publicLegitimacy (isContested or isLegitimacyCrisis), the governing row's 'vacant' modifier, or the succession_void / politically_fractured stress | 329 | thorp 54, hamlet 91, village 127, town 38, city 9, metropolis 10 |
| outside_debt | the indebted stress, or a power named for creditors (Crown Creditors / Creditor's Representative) | 30 | thorp 8, hamlet 3, village 4, town 2, city 4, metropolis 9 |
| occupation | the occupied stress, or a row carrying the 'occupied' modifier | 10 | thorp 4, hamlet 2, village 1, town 1, city 1, metropolis 1 |
| (none held) | | 295 | |

### What each proposed factor does where its circumstance is held (CS3+CS4, then with CS5)

| circumstance -> kind (factor) | towns where it holds and that kind stands (power >= 5, not the holder) | contends without the factor | contends with it |
|---|---|---|---|
| craft_led -> craft (x1.5) | 9 | 4 | 5 |
| mandate -> craft (x1.2) | 11 | 3 | 4 |
| mandate -> noble (x1.3) | 26 | 22 | 22 |
| martial_pressure -> noble (x1.15) | 16 | 1 | 3 |
| outside_debt -> merchant (x1.15) | 7 | 6 | 7 |
| strong_faith -> religious (x1.25) | 19 | 17 | 19 |
| trade_wealth -> merchant (x1.15) | 120 | 84 | 85 |

