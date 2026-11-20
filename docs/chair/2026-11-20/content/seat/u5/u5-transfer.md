# U5 acceptance: the built transfer on the proposal's two pools (every rate under today's standing)

One command: `node docs/chair/2026-11-20/content/seat/u5/measure-u5.mjs --force-law _seatLawVersion=2` (532 s). Per town the heaviest contender (`coupContenders(s).challengers[0]` on that law's record) takes the seat by coup through `transferRulingPower`, the circumstances handed in as the coup path would hand them; OLD = the town as born; LAW = the same record with `_seatLawVersion: 2`. Then a second and a third coup in a row, each by the heaviest contender of the moment. FORCED = the town born with the forced keys, its first transfer compared with LAW's.

## default (900 towns, 0 birth errors), under today's standing

| band | law | towns | no contender | KEPT | RENAMED | own | civic | licensed held | licensed not held | fallback | none | R1 names the winner | R1 > 1 taker after coup 1 · 2 · 3 | unattributed (answer / predicate) after 1 · 2 · 3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| small | OLD | 450 | 240 | 0 (0%) | 210 (100%) | 21 | 46 | 0 | 0 | 130 | 13 | 210 of 210 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| small | LAW | 450 | 269 | 23 (12.7%) | 158 (87.3%) | 14 | 9 | 0 | 0 | 145 | 13 | 181 of 181 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| town | OLD | 150 | 0 | 0 (0%) | 150 (100%) | 35 | 45 | 0 | 0 | 45 | 25 | 150 of 150 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| town | LAW | 150 | 0 | 11 (7.3%) | 139 (92.7%) | 0 | 11 | 0 | 0 | 79 | 60 | 150 of 150 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| large | OLD | 300 | 0 | 0 (0%) | 300 (100%) | 71 | 2 | 0 | 0 | 139 | 88 | 300 of 300 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| large | LAW | 300 | 0 | 2 (0.7%) | 298 (99.3%) | 0 | 2 | 0 | 0 | 139 | 159 | 300 of 300 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |

Totals: OLD kept 0, renamed 660; LAW kept 36 (5.7%, under today's standing), renamed 595. **R1 answers more than one taker: LAW 0 (all three coups), OLD 0.** Retired edges written (LAW): 1008, in the 'retiredEdge' wording 1008, read as an 'edge' wording 0. **The unattributed read (the fail-closed rule, `unattributedTransferOn`) fires: LAW 0 by the answer, 0 by the predicate**; OLD 0 / 0.

### The chair's condition 1 (CS22): 0 towns keep a crowned form under the law

personRule: {}; no person: 0; **the person KEEPS (rank 1) a house other than the seat's own: 0**; the person is a member (any rank) of another house: 0; the person's title reads a crown word: 0. **The guard's read (a card with a crown word keeping another house), the article dropped: 0 towns; the same read on the town BEFORE the transfer: 0; the guard's card is the person holderOf names: 0; the bare read (officeWordInfo on the word as carried): 0 towns.**

FORCED births: 0 errors; towns whose forced first transfer differs from LAW's: 1 (seat-measure-town-22).

## presets (960 towns, 0 birth errors), under today's standing

| band | law | towns | no contender | KEPT | RENAMED | own | civic | licensed held | licensed not held | fallback | none | R1 names the winner | R1 > 1 taker after coup 1 · 2 · 3 | unattributed (answer / predicate) after 1 · 2 · 3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| small | OLD | 480 | 293 | 0 (0%) | 187 (100%) | 27 | 32 | 0 | 0 | 98 | 30 | 187 of 187 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| small | LAW | 480 | 311 | 41 (24.3%) | 128 (75.7%) | 21 | 20 | 0 | 0 | 98 | 30 | 169 of 169 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| town | OLD | 160 | 0 | 0 (0%) | 160 (100%) | 97 | 2 | 0 | 0 | 0 | 61 | 160 of 160 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| town | LAW | 160 | 2 | 19 (12%) | 139 (88%) | 17 | 2 | 0 | 0 | 0 | 139 | 158 of 158 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| large | OLD | 320 | 0 | 0 (0%) | 320 (100%) | 143 | 17 | 9 | 7 | 27 | 117 | 320 of 320 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |
| large | LAW | 320 | 0 | 28 (8.8%) | 292 (91.3%) | 12 | 7 | 9 | 7 | 37 | 248 | 320 of 320 | 0 · 0 · 0 | 0 · 0 · 0 / 0 · 0 · 0 |

Totals: OLD kept 0, renamed 667; LAW kept 88 (13.6%, under today's standing), renamed 559. **R1 answers more than one taker: LAW 0 (all three coups), OLD 0.** Retired edges written (LAW): 1020, in the 'retiredEdge' wording 1020, read as an 'edge' wording 0. **The unattributed read (the fail-closed rule, `unattributedTransferOn`) fires: LAW 0 by the answer, 0 by the predicate**; OLD 0 / 0.

### The chair's condition 1 (CS22): 5 towns keep a crowned form under the law

personRule: {"crown":5}; no person: 0; **the person KEEPS (rank 1) a house other than the seat's own: 0**; the person is a member (any rank) of another house: 5; the person's title reads a crown word: 5. **The guard's read (a card with a crown word keeping another house), the article dropped: 5 towns; the same read on the town BEFORE the transfer: 5; the guard's card is the person holderOf names: 0; the bare read (officeWordInfo on the word as carried): 0 towns.**

| seed | form | winner | person (title) | personRule | keeps | member of |
|---|---|---|---|---|---|---|
| seat-measure-city-trade_crossroads-5 | Royal Authority | Merchant Guilds | Gregorios Glabas (the monarch) | crown | - | Noble Families#null |
| seat-measure-city-safe_province_capital-7 | Royal Authority | Merchant Guilds | Mikhail Tretyakov (the monarch) | crown | - | Noble Families#3 |
| seat-measure-metropolis-mage_city-4 | Royal Authority | Merchant Guilds | Sigrid Ljotsson (the monarch) | crown | - | Noble Houses#null |
| seat-measure-metropolis-safe_province_capital-8 | Royal Authority | Merchant Guilds | Anna Gabalas (the monarch) | crown | - | Noble Houses#null |
| seat-measure-metropolis-safe_province_capital-9 | Royal Authority | Merchant Guilds | Egor Solovyov (the monarch) | crown | - | Noble Houses#null |

Guard towns: seat-measure-city-trade_crossroads-5: Panteleimon Limniotes (the lord); seat-measure-city-safe_province_capital-7: Anastasia Vasilyev (the lady); seat-measure-metropolis-mage_city-4: Dag Sigurðarson (the lord); seat-measure-metropolis-safe_province_capital-8: Pavlos Argyros (the lord), Athanasios Zoe (the lord); seat-measure-metropolis-safe_province_capital-9: Lyuben Lazić (the lord), Petra Zdravković (the lady).

FORCED births: 0 errors; towns whose forced first transfer differs from LAW's: 2 (seat-measure-town-lawless_frontier-8, seat-measure-city-theocracy-6).

