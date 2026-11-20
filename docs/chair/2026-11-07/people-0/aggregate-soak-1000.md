Corpus: soak.jsonl · 1000 settlements · cells read min / median / max (μ mean)

| tier | n | houses (non-fabric) | faces | judgment houses | none+fabric | today NPCs | powers | powers w/ ≥3 faces | towns with a power <3 | towns with a power at 0 | seat face in governing power |
|---|---|---|---|---|---|---|---|---|---|---|---|
| thorp | 167 | 2 / 5 / 7 (μ 4.8) | 0 / 2 / 3 (μ 1.6) | 0 / 1 / 2 (μ 0.6) | 5 / 6 / 8 (μ 6.4) | 1 / 1 / 3 (μ 1.5) | 1 / 1 / 2 (μ 1.1) | 14/182 (8%) | 154 | 23 | 144/167 |
| hamlet | 167 | 3 / 6 / 12 (μ 6.6) | 0 / 2 / 8 (μ 2.6) | 0 / 1 / 2 (μ 0.6) | 7 / 7 / 8 (μ 7.3) | 2 / 3 / 4 (μ 2.8) | 1 / 1 / 2 (μ 1.3) | 78/222 (35%) | 127 | 62 | 84/167 |
| village | 167 | 6 / 13 / 23 (μ 13.5) | 3 / 9 / 19 (μ 8.9) | 0 / 1 / 4 (μ 1.3) | 5 / 5 / 6 (μ 5.4) | 4 / 5 / 7 (μ 5.2) | 1 / 2 / 3 (μ 2.4) | 206/398 (52%) | 146 | 47 | 70/167 |
| town | 167 | 12 / 29 / 48 (μ 29.5) | 7 / 23 / 40 (μ 22.7) | 3 / 5 / 9 (μ 5.1) | 3 / 4 / 5 (μ 3.7) | 6 / 8 / 12 (μ 8.6) | 2 / 4 / 5 (μ 3.8) | 420/641 (66%) | 138 | 70 | 113/167 |
| city | 166 | 28 / 66 / 91 (μ 63.6) | 18 / 51 / 75 (μ 50.1) | 4 / 10 / 16 (μ 10.1) | 4 / 4 / 5 (μ 4.4) | 12 / 14 / 18 (μ 14.7) | 1 / 6 / 8 (μ 6.0) | 649/999 (65%) | 165 | 165 | 160/166 |
| metropolis | 166 | 59 / 87 / 107 (μ 85.8) | 46 / 68 / 83 (μ 67.1) | 9 / 15 / 21 (μ 15.1) | 4 / 5 / 5 (μ 4.5) | 18 / 26 / 30 (μ 24.8) | 1 / 7 / 10 (μ 7.2) | 811/1192 (68%) | 165 | 165 | 166/166 |

With the judgment houses counted as faces (upper bound):

| tier | faces+judge | powers w/ ≥3 | towns with a power <3 | towns with a power at 0 |
|---|---|---|---|---|
| thorp | 0 / 2 / 4 (μ 2.2) | 47/182 | 122 | 6 |
| hamlet | 0 / 3 / 8 (μ 3.2) | 92/222 | 117 | 39 |
| village | 3 / 10 / 19 (μ 10.1) | 224/398 | 139 | 45 |
| town | 11 / 27 / 46 (μ 27.8) | 421/641 | 138 | 68 |
| city | 24 / 62 / 88 (μ 60.2) | 658/999 | 165 | 165 |
| metropolis | 56 / 83 / 103 (μ 82.2) | 811/1192 | 165 | 165 |

Faces per power, by archetype (all tiers): powers · min/median/max faces · share with ≥3 · share at 0

| archetype | powers | faces | ≥3 | 0 | governing |
|---|---|---|---|---|---|
| merchant | 837 | 0 / 16 / 62 (μ 15.0) | 79% | 19% | 172 |
| military | 659 | 0 / 4 / 62 (μ 5.1) | 56% | 33% | 37 |
| government | 658 | 0 / 3 / 67 (μ 9.6) | 57% | 12% | 610 |
| religious | 637 | 0 / 2 / 59 (μ 4.4) | 50% | 20% | 83 |
| noble | 283 | 0 / 3 / 29 (μ 4.1) | 58% | 27% | 15 |
| criminal | 264 | 0 / 7 / 55 (μ 8.4) | 76% | 18% | 45 |
| other | 189 | 0 / 0 / 21 (μ 0.6) | 4% | 96% | 8 |
| arcane | 107 | 0 / 6 / 59 (μ 9.9) | 79% | 17% | 30 |

Power names by archetype (top 8 each):

- **government**: Elder Council (176), Headman's Authority (98), Household Council (93), Feudal Stewardship (45), Free Elder Council (29), City-State Council (29), Royal Authority (27), Noble Governorship (23)
- **military**: Military/Guard (363), War Council (72), Occupation Authority (48), The Shield Compact (33), The Garrison Bloc (29), The Order of the Watch (29), The Martial Alliance (25), Military Council (19)
- **religious**: Religious Authorities (445), Priestly Guidance (41), The Clergy Alliance (30), The Holy Compact (23), Church Council (21), The Devout Circle (20), The Faithful Assembly (18), High Theocratic Council (11)
- **criminal**: Thieves' Guild (175), Corrupt Council (23), The Black Circle (18), Corrupt City Council (11), Shadow Senate (11), The Shadow Compact (11), The Hidden Hand (8), The Underground (7)
- **merchant**: Merchant Guilds (296), Craft Guilds (165), Grain Holders (51), Merchant oligarchy (39), The Trade Compact (38), The Commercial Circle (38), The Merchant Bloc (32), The Guild Alliance (32)
- **noble**: Noble Houses (88), Noble Families (60), The Highborn Circle (36), Landed Gentry (20), The Landed Bloc (19), The Peerage (18), Feudal Appointee (15), The Old Houses (14)
- **other**: The Independent Bloc (60), Revolt Leadership (24), Creditor's Representative (23), Reformist Faction (19), Investigation Faction (16), The Common Interest (10), The Free Alliance (8), Town Mayor (8)
- **arcane**: Arcane Orders (61), Arcane Council (25), The Mages' Compact (6), Arcane Senate (5), The Arcane Circle (4), The Enlightened (3), The Tower Alliance (3)

Powers per tier, by archetype (count of powers):

| tier | government | military | religious | criminal | merchant | noble | other | arcane |
|---|---|---|---|---|---|---|---|---|
| thorp | 155 | 3 | 22 | 0 | 1 | 0 | 1 | 0 |
| hamlet | 160 | 14 | 24 | 0 | 11 | 2 | 11 | 0 |
| village | 152 | 64 | 120 | 2 | 35 | 6 | 19 | 0 |
| town | 20 | 136 | 128 | 62 | 191 | 44 | 44 | 16 |
| city | 70 | 191 | 168 | 94 | 289 | 93 | 45 | 49 |
| metropolis | 101 | 251 | 175 | 106 | 310 | 138 | 69 | 42 |

The weighted roll's top three (house weights of the 1st/2nd/3rd face by share×weight), governing power only, and faces backing 2+ powers:

| tier | gov top-1 weight (dist) | gov top-3 complete | faces backing 2+ powers | faces on the default (no share) |
|---|---|---|---|---|
| thorp | w1:15 w2:144 wnone:8 | 14/167 | 0 / 0 / 0 (μ 0.0) | 0 / 0 / 2 (μ 0.1) |
| hamlet | w1:48 w2:75 w3:20 wnone:24 | 74/167 | 0 / 0 / 2 (μ 0.1) | 0 / 0 / 3 (μ 0.4) |
| village | w1:56 w2:102 w3:9 | 152/167 | 0 / 0 / 3 (μ 0.5) | 0 / 2 / 7 (μ 2.1) |
| town | w2:103 w3:64 | 167/167 | 0 / 3 / 11 (μ 3.0) | 0 / 1 / 10 (μ 2.3) |
| city | w3:166 | 166/166 | 0 / 7 / 18 (μ 8.0) | 0 / 2 / 18 (μ 4.5) |
| metropolis | w3:166 | 166/166 | 0 / 14 / 22 (μ 13.6) | 0 / 2 / 25 (μ 5.8) |

## Today's NPCs, groups, hooks, relationships

| tier | NPCs | faction groups | group size | rung roles (head/middle/lowest/yearner/none) | NPC hooks per NPC | NPCs with 2+ hooks |
|---|---|---|---|---|---|---|
| thorp | 1 / 1 / 3 (μ 1.5) | 1 / 1 / 2 (μ 1.1) | 1 / 1 / 2 (μ 1.3) | 179/34/24/3/10 | 0 / 2 / 2 (μ 1.5) | 128/250 |
| hamlet | 2 / 3 / 4 (μ 2.8) | 1 / 1 / 2 (μ 1.3) | 1 / 2 / 4 (μ 2.1) | 210/114/129/10/6 | 0 / 1 / 2 (μ 1.5) | 221/469 |
| village | 4 / 5 / 7 (μ 5.2) | 1 / 2 / 3 (μ 2.4) | 1 / 2 / 5 (μ 2.2) | 347/217/260/41/7 | 0 / 2 / 2 (μ 1.5) | 437/872 |
| town | 6 / 8 / 12 (μ 8.6) | 2 / 4 / 5 (μ 3.8) | 1 / 2 / 6 (μ 2.2) | 555/360/453/63/0 | 0 / 1 / 2 (μ 1.5) | 707/1431 |
| city | 12 / 14 / 18 (μ 14.7) | 1 / 6 / 8 (μ 6.0) | 1 / 3 / 14 (μ 2.4) | 830/501/976/125/0 | 1 / 2 / 2 (μ 1.5) | 1235/2432 |
| metropolis | 18 / 26 / 30 (μ 24.8) | 1 / 7 / 10 (μ 7.2) | 1 / 3 / 30 (μ 3.5) | 983/695/2278/163/0 | 1 / 1 / 2 (μ 1.5) | 1989/4119 |

Hooks by source (collector class; crisis and traditions split out of `tension`), per settlement:

| tier | total | crisis | economics | faction | history | npc | safety | tension |
|---|---|---|---|---|---|---|---|---|
| thorp | 4 / 9 / 17 (μ 9.7) | 0 / 1 / 4 (μ 1.2) | 0 / 0 / 3 (μ 0.6) | 0 / 0 / 1 (μ 0.0) | 0 / 2 / 6 (μ 2.1) | 0 / 2 / 4 (μ 2.2) | 0 / 0 / 0 (μ 0.0) | 1 / 3 / 6 (μ 3.6) |
| hamlet | 6 / 12 / 22 (μ 12.7) | 0 / 1 / 6 (μ 1.5) | 0 / 1 / 3 (μ 0.8) | 0 / 0 / 2 (μ 0.1) | 0 / 2 / 8 (μ 2.8) | 2 / 4 / 8 (μ 4.1) | 0 / 0 / 1 (μ 0.0) | 1 / 3 / 6 (μ 3.4) |
| village | 9 / 18 / 27 (μ 18.0) | 0 / 1 / 4 (μ 1.4) | 0 / 1 / 3 (μ 0.8) | 0 / 1 / 4 (μ 0.7) | 0 / 2 / 8 (μ 2.6) | 4 / 7 / 14 (μ 7.8) | 0 / 0 / 0 (μ 0.0) | 1 / 6 / 9 (μ 4.8) |
| town | 14 / 25 / 39 (μ 25.7) | 0 / 2 / 4 (μ 2.0) | 0 / 1 / 3 (μ 0.8) | 0 / 2 / 4 (μ 1.6) | 0 / 3 / 7 (μ 3.2) | 6 / 12 / 20 (μ 12.6) | 0 / 0 / 4 (μ 0.4) | 1 / 6 / 9 (μ 5.1) |
| city | 27 / 37 / 49 (μ 37.3) | 0 / 2 / 4 (μ 2.0) | 0 / 1 / 4 (μ 1.3) | 0 / 2 / 4 (μ 2.3) | 0 / 3 / 7 (μ 3.1) | 13 / 20 / 28 (μ 20.4) | 0 / 1 / 4 (μ 0.9) | 3 / 7 / 9 (μ 7.3) |
| metropolis | 32 / 46 / 67 (μ 46.4) | 0 / 2 / 4 (μ 2.1) | 0 / 1 / 4 (μ 1.4) | 0 / 2 / 4 (μ 2.4) | 0 / 3 / 7 (μ 2.7) | 16 / 29 / 46 (μ 29.0) | 0 / 1 / 4 (μ 1.1) | 3 / 9 / 9 (μ 7.7) |

Hooks by party kind (the hook's links), corpus totals:

npc: 13594 (54.5%) · none: 6889 (27.6%) · historical: 2741 (11.0%) · faction: 1736 (7.0%)

Raw writer counts per settlement: tension hooks (history.currentTensions) · event hooks (historicalEvents) · conflicts · current tensions · historical events:

| tier | tension hooks | event hooks | conflicts | tensions | events |
|---|---|---|---|---|---|
| thorp | 3 / 3 / 6 (μ 3.7) | 0 / 2 / 6 (μ 2.1) | 0 / 0 / 1 (μ 0.0) | 1 / 1 / 2 (μ 1.2) | 0 / 3 / 4 (μ 2.6) |
| hamlet | 3 / 3 / 6 (μ 3.5) | 0 / 2 / 8 (μ 2.8) | 0 / 0 / 1 (μ 0.1) | 1 / 1 / 2 (μ 1.2) | 1 / 2 / 5 (μ 2.1) |
| village | 3 / 6 / 9 (μ 4.9) | 0 / 2 / 8 (μ 2.7) | 0 / 1 / 3 (μ 0.6) | 1 / 2 / 3 (μ 1.6) | 1 / 3 / 6 (μ 3.3) |
| town | 3 / 6 / 9 (μ 5.2) | 0 / 3 / 7 (μ 3.3) | 0 / 1 / 3 (μ 1.3) | 1 / 2 / 3 (μ 1.7) | 1 / 4 / 8 (μ 4.7) |
| city | 3 / 9 / 9 (μ 7.5) | 1 / 3 / 7 (μ 3.2) | 0 / 2 / 3 (μ 1.9) | 1 / 3 / 3 (μ 2.5) | 2 / 7 / 12 (μ 7.2) |
| metropolis | 3 / 9 / 9 (μ 7.8) | 0 / 3 / 7 (μ 2.8) | 0 / 2 / 3 (μ 2.0) | 1 / 3 / 3 (μ 2.6) | 3 / 11 / 18 (μ 10.5) |

Proposed hooks under the rule (faces + tension-class [tension+crisis+tradition+faction/conflict] + history), per settlement:

| tier | faces (1 each) | tension-class | history | proposed total | today total |
|---|---|---|---|---|---|
| thorp | 0 / 2 / 3 (μ 1.6) | 1 / 4 / 9 (μ 4.9) | 0 / 2 / 6 (μ 2.1) | 4 / 8 / 15 (μ 8.5) | 4 / 9 / 17 (μ 9.7) |
| hamlet | 0 / 2 / 8 (μ 2.6) | 1 / 5 / 10 (μ 5.1) | 0 / 2 / 8 (μ 2.8) | 3 / 10 / 20 (μ 10.5) | 6 / 12 / 22 (μ 12.7) |
| village | 3 / 9 / 19 (μ 8.9) | 3 / 7 / 14 (μ 6.9) | 0 / 2 / 8 (μ 2.6) | 8 / 18 / 29 (μ 18.3) | 9 / 18 / 27 (μ 18.0) |
| town | 7 / 23 / 40 (μ 22.7) | 3 / 9 / 13 (μ 8.7) | 0 / 3 / 7 (μ 3.2) | 12 / 35 / 54 (μ 34.7) | 14 / 25 / 39 (μ 25.7) |
| city | 18 / 51 / 75 (μ 50.1) | 7 / 12 / 17 (μ 11.7) | 0 / 3 / 7 (μ 3.1) | 32 / 66 / 91 (μ 64.8) | 27 / 37 / 49 (μ 37.3) |
| metropolis | 46 / 68 / 83 (μ 67.1) | 7 / 12 / 17 (μ 12.2) | 0 / 3 / 7 (μ 2.7) | 58 / 82 / 98 (μ 82.1) | 32 / 46 / 67 (μ 46.4) |

Relationships today:

| tier | ties | NPC degree | NPCs in 0 ties | NPCs in 2+ ties |
|---|---|---|---|---|
| thorp | 0 / 0 / 1 (μ 0.4) | 0 / 1 / 1 (μ 0.6) | 104/250 | 0/250 |
| hamlet | 1 / 2 / 6 (μ 2.5) | 0 / 2 / 3 (μ 1.8) | 6/469 | 288/469 |
| village | 4 / 8 / 18 (μ 9.0) | 0 / 3 / 6 (μ 3.4) | 7/872 | 858/872 |
| town | 9 / 18 / 33 (μ 19.1) | 1 / 4 / 10 (μ 4.5) | 0/1431 | 1430/1431 |
| city | 26 / 36 / 48 (μ 36.4) | 2 / 5 / 12 (μ 5.0) | 0/2432 | 2432/2432 |
| metropolis | 41 / 65 / 80 (μ 62.0) | 2 / 5 / 23 (μ 5.0) | 0/4119 | 4119/4119 |

Tie kinds (corpus): political 3734 (17.3%) · rival 3699 (17.2%) · ally 3477 (16.1%) · debtor_creditor 3439 (16.0%) · mentor_student 2622 (12.2%) · respect 2283 (10.6%) · enemy 1095 (5.1%) · family 845 (3.9%) · patron_client 336 (1.6%)

Tie pairs by NPC category (top 12): government~government 3026 · government~military 2031 · government~religious 1901 · economy~government 1768 · other~other 1721 · economy~economy 1202 · criminal~economy 1158 · economy~other 1058 · religious~religious 944 · military~military 921 · government~other 872 · criminal~criminal 865

Proposed: one outgoing tie per face (simulated, PLAUSIBLE: target weighted by house weight, ×3 when sharing a power):

| tier | ties (= faces with a peer) | named by 0 | named by exactly 1 | named by 2+ | max in-degree |
|---|---|---|---|---|---|
| thorp | 0 / 2 / 3 (μ 1.2) | 30% | 65% | 4% | 2 |
| hamlet | 0 / 2 / 8 (μ 2.4) | 33% | 46% | 21% | 4 |
| village | 3 / 9 / 19 (μ 8.9) | 38% | 34% | 27% | 6 |
| town | 7 / 23 / 40 (μ 22.7) | 40% | 34% | 26% | 7 |
| city | 18 / 51 / 75 (μ 50.1) | 40% | 34% | 26% | 8 |
| metropolis | 46 / 68 / 83 (μ 67.1) | 41% | 33% | 26% | 8 |

Unclassified house names (missing from faces.mjs or unplaced by the catalogue): []

Judgment houses by frequency (rosters carrying them): Weekly market 555 · Multiple market squares 499 · City hall 499 · Warehouse district 405 · Fish market 378 · Stable district 312 · Luxury goods quarter 295 · Major annual fairs 290 · Sage's quarter 257 · Furrier's district 239 · Dungeon delving supply district 221 · Charlatan fortune tellers 203 · Fisher's landing 198 · Red light district 168 · Palace/government complex 166 · Docks/port facilities 146 · International trade center 126 · Underground city 89 · Wayside shrine 78 · Teleportation circle 59 · Golem workforce 58 · Rookery 50 · Village musician 45 · Listening post 41 · Undead labor 35 · Message network (high magic) 35 · Dragon resident 8
