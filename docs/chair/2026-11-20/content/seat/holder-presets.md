# The holder, the contest and the circumstances, arm presets (960 born towns through birthConfig, 0 errors)

Executed: `node docs/chair/2026-11-20/content/seat/measure-holder.mjs --arm presets --n 10` against `docs/chair/2026-11-20/content/seat/seat-draft.mjs`. BEFORE re-spelled and checked against the shipped `coupContenders`: **0 mismatches**. Raw: `holder-presets.json`.

## (1) The holder leaf, rule by rule (owner audience; public audience beside it)

| rule | towns (owner) | towns (public) |
|---|---|---|
| R1 | 0 | 0 |
| R2 | 213 | 213 |
| R3 | 243 | 243 |
| R4 | 444 | 444 |
| R5 | 60 | 60 |

Veiled holders (the owner sees a hidden or criminal power; a public reader is told the office and the person only): 0.

Rule x holder kind: R4:government 370 · R2:merchant 144 · R3:merchant 84 · R2:noble 64 · R5:noble 60 · R3:military 58 · R3:religious 55 · R3:noble 30 · R4:religious 30 · R4:criminal 22 · R3:arcane 16 · R4:merchant 15 · R4:arcane 4 · R2:military 3 · R4:military 3 · R2:craft 2

**Towns where two rules answer differently: 2.**

- seat-measure-city-mage_city-7 (Merchant Guild Council): R2 The Guild Alliance · R3 Merchant Guilds → chosen R2
- seat-measure-city-arcane_academy-3 (Merchant oligarchy): R2 The Merchant Bloc · R3 Merchant Guilds → chosen R2

The seat-holder heads more than one other power: 0 towns.

## (2) The contender table per kind (CS4 labels; present = a non-governing power of that kind stands)

| kind | present | contends BEFORE | CS3 alone | CS3+CS4 | CS3+CS4+CS5 |
|---|---|---|---|---|---|
| noble | 257 | 220 | 158 | 158 | 161 |
| craft | 247 | 147 | 191 | 167 | 170 |
| labor | 0 | 0 | 0 | 0 | 0 |
| outsider | 0 | 0 | 0 | 0 | 0 |
| merchant | 419 | 345 | 209 | 215 | 214 |
| military | 411 | 356 | 339 | 345 | 345 |
| religious | 383 | 290 | 277 | 282 | 275 |
| arcane | 203 | 74 | 103 | 105 | 100 |
| criminal | 84 | 0 | 0 | 0 | 0 |
| occupation | 0 | 0 | 0 | 0 | 0 |
| government | 12 | 6 | 7 | 7 | 7 |
| other | 61 | 41 | 47 | 47 | 47 |
| **towns with no contender** | | 293 | 313 | 313 | 313 |

Field size (contenders per town): before 0:293 1:157 2:107 3:403 · cs3 0:313 1:203 2:97 3:347 · cs3cs4 0:313 1:203 2:97 3:347 · cs3cs4cs5 0:313 1:203 2:97 3:347

Coup-risk ladder: before: Holding 507, Stable 293, Contested 150, Critical. The seat could fall 10 · cs3: Holding 517, Stable 313, Contested 124, Critical. The seat could fall 6 · cs3cs4: Holding 518, Stable 313, Contested 123, Critical. The seat could fall 6 · cs3cs4cs5: Holding 509, Stable 313, Contested 131, Critical. The seat could fall 7

Measured only (not proposed): with the holder's own power counted on the incumbent's side, under CS3 the incumbent is gated in 958 towns against 954; risk Holding 553, Stable 313, Contested 92, Critical. The seat could fall 2 against Holding 517, Stable 313, Contested 124, Critical. The seat could fall 6.

## (3) Form x holder kind, against the one table (CS6)

Classes: office:R4 444 · own 387 · civic 66 · office:R5 60 · licensed:civic_fallback 3

- Merchant oligarchy x merchant (own): 39
- Guild Council x merchant (own): 37
- Royal Authority x noble (own): 28
- Ducal Governorship x noble (own): 27
- Military Council x military (own): 26
- Church Council x religious (own): 25
- Noble Governorship x noble (own): 25
- Grand Merchant Oligarchy x merchant (own): 23
- Merchant Guild Council x merchant (own): 22
- Democratic assembly x merchant (civic): 20
- Military City Council x military (own): 18
- City-State Council x merchant (civic): 15
- Grand Guild Consortium x merchant (own): 15
- Elder Council x merchant (civic): 14
- Grand Military Council x military (own): 14
- Ecclesiastical Council x religious (own): 13
- Merchant Council x merchant (own): 12
- High Theocratic Council x religious (own): 11
- Arcane Council x arcane (own): 9
- Feudal Appointee x noble (own): 9
- Grand Merchant Senate x merchant (own): 9
- Household Council x merchant (civic): 8
- Arcane Senate x arcane (own): 7
- Merchant City Council x merchant (own): 7
- Priestly Guidance x religious (own): 6
- Feudal Stewardship x noble (own): 5
- Elected Reeve x merchant (civic): 4
- Elder Council x military (licensed:civic_fallback): 3
- Headman's Authority x merchant (civic): 3
- Town Mayor x craft (civic): 2

## (4) The circumstances

| circumstance | reads | towns | by tier |
|---|---|---|---|
| craft_led | powerStructure.factions[] (a non-governing craft power at least four fifths as strong as the strongest merchant power), or economicState.incomeSources' 'Guild Fees' / 'Guild Licensing' at 25 per cent or more with a craft power standing | 29 | town 19, city 1, metropolis 9 |
| trade_wealth | economicState.prosperity in {Prosperous, Wealthy} and the largest of economicState.incomeSources is a trade source (Market Taxes, Trade Tariffs, Tolls, Port Fees, Caravan …) | 212 | town 31, city 73, metropolis 108 |
| strong_faith | config.priorityReligion >= 70, or the religious_conversion stress | 247 | thorp 41, hamlet 40, village 41, town 42, city 41, metropolis 42 |
| martial_pressure | the under_siege / wartime / insurgency / monster_pressure stress, or config.priorityMilitary >= 70 | 460 | thorp 74, hamlet 75, village 80, town 79, city 75, metropolis 77 |
| hunger | the famine stress, or economicState.foodSecurity.label beginning 'Deficit' | 31 | thorp 8, hamlet 7, village 6, town 7, metropolis 3 |
| mandate | powerStructure.publicLegitimacy (isContested or isLegitimacyCrisis), the governing row's 'vacant' modifier, or the succession_void / politically_fractured stress | 302 | thorp 64, hamlet 73, village 90, town 50, city 12, metropolis 13 |
| outside_debt | the indebted stress, or a power named for creditors (Crown Creditors / Creditor's Representative) | 41 | thorp 4, hamlet 8, village 7, town 8, city 7, metropolis 7 |
| occupation | the occupied stress, or a row carrying the 'occupied' modifier | 6 | thorp 1, hamlet 1, village 2, town 2 |
| (none held) | | 164 | |

### What each proposed factor does where its circumstance is held (CS3+CS4, then with CS5)

| circumstance -> kind (factor) | towns where it holds and that kind stands (power >= 5, not the holder) | contends without the factor | contends with it |
|---|---|---|---|
| craft_led -> craft (x1.5) | 28 | 18 | 21 |
| mandate -> craft (x1.2) | 29 | 21 | 21 |
| mandate -> noble (x1.3) | 28 | 26 | 28 |
| martial_pressure -> noble (x1.15) | 132 | 129 | 132 |
| outside_debt -> merchant (x1.15) | 3 | 2 | 2 |
| strong_faith -> religious (x1.25) | 83 | 83 | 83 |
| trade_wealth -> merchant (x1.15) | 123 | 99 | 99 |

