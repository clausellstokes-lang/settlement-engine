# (B) WHO COULD SAY IT

Tree 682667fe2. C and V, 900 births each, owner views as the app renders them. Script counts CONFIRMED (`b/speakers.mjs`, `b/sum.mjs`, `b/tsv.mjs`); the subject reading is a script's keyword reading (PLAUSIBLE). The per-pool table is `B-speakers.tsv` (148 candidate pools that print a STREET line).

## The ranking as I ran it (the design's words made executable; every choice is mine and named)

For each STREET line a town prints (one line a tab, deduped; 45,945 line-prints over C and V):
- **Subject.** A house the sentence names (a roster name), else a power it names, else a topic by keywords (food, safety, trade, faith, rule, health, outsiders), else **general** (the place's people at large).
- **Rung 1, the house's own named connection.** The face of that house. For a topic, a face of a house of that trade by name (the watch for safety, the mill or granary for food, the temple for faith).
- **Rung 2, a member of the power it backs.** The members of the powers the engine says the house backs (`domain/dossier/powerSupport.js :: houseBacksOf`) or the face's own powers. For a topic, the members of the powers the topic's houses back, or the matching power (the governing power for rule, a military power for safety).
- **Rung 3, a neighbouring trade.** A face of a house in the same catalogue category.
- **Rung 4, an unnamed voice.**
- **Least-used first** over the whole page in tab order. Criminal faces and veiled cards never speak (the design keeps their quotes DM-only).
- **STRICT:** a general line has no subject, so no rung names anyone, and it goes to an unnamed voice. **LOOSE:** a general line goes to any legitimate named person, least-used first (rung 3 widened to the whole place).

## What the candidate lines are about

Of the 45,945 STREET line-prints: **general 31%**, trade 17%, safety 14%, food 9%, outsiders 7%, a named power 6%, faith 5%, a named house 4%, rule 4%, health 3%. Nearly a third of the candidates are about "the people here" and nobody in particular. The design's ranking has no rung for that. It is the largest single fact about who could say these lines.

The fifteen largest candidate pools (line-prints over C+V; subjects; strict share by rung 1 / 2 / 3 / 4):

| pool | prints | subjects | rung 1 / 2 / 3 / unnamed |
|---|---|---|---|
| `data/dailyLife/outsiderImpressions.js :: OUTSIDER_IMPRESSIONS` | 3797 | outsiders 1107, power 959, safety 574, general 539, rule 227, health 211, house 154, trade 26 | 59% / 6% / 2% / 33% |
| `data/historyData.js :: HISTORICAL_EVENTS_DATA` | 3162 | general 1323, trade 907, safety 624, rule 150, health 150, food 8 | 49% / 2% / 4% / 46% |
| `generators/narrativeText.js :: POLITICAL_FLAVOR` | 2074 | general 1414, trade 230, outsiders 174, rule 100, health 72, faith 60, food 14, house 10 | 20% / 3% / 3% / 74% |
| `data/dossierStateProse/economy.generated.js :: DOSSIER_STATE_PROSE_ECONOMY :: DS-ECO-12` | 1726 | trade 958, general 421, outsiders 295, faith 46, food 6 | 53% / 4% / 6% / 37% |
| `data/dossierStateProse/defense.generated.js :: DOSSIER_STATE_PROSE_DEFENSE :: DS-DEF-2` | 1635 | safety 1171, general 450, rule 8, outsiders 3, food 2, trade 1 | 49% / 2% / 0% / 49% |
| `domain/dossier/faithReading.js :: observanceOf` | 1421 | faith 1421 | 69% / 31% / 0% / 0% |
| `data/dailyLife/unspokenTopics.js :: UNSPOKEN_TOPICS` | 1419 | general 444, outsiders 421, trade 238, rule 186, safety 73, health 36, faith 20, house 1 | 43% / 7% / 2% / 47% |
| `data/dossierStateProse/defense.generated.js :: DOSSIER_STATE_PROSE_DEFENSE :: DS-DEF-5` | 1389 | safety 919, trade 181, general 162, outsiders 127 | 70% / 2% / 0% / 29% |
| `data/dailyLife/gatheringPlaces.js :: GATHERING_NAMED` | 1334 | house 611, general 339, faith 218, trade 105, food 39, safety 22 | 59% / 15% / 1% / 25% |
| `data/dossierStateProse/economy.generated.js :: DOSSIER_STATE_PROSE_ECONOMY :: DS-ECO-11` | 1293 | general 881, outsiders 378, food 29, trade 5 | 21% / 1% / 0% / 78% |
| `data/historyDescVariants.js :: HISTORY_DESC_VARIANTS` | 1286 | general 1023, trade 234, rule 27, food 2 | 20% / 1% / 0% / 80% |
| `data/dossierStateProse/economy.generated.js :: DOSSIER_STATE_PROSE_ECONOMY :: DS-ECO-9` | 1275 | food 1275 | 91% / 9% / 0% / 0% |
| `data/dossierStateProse/defense.generated.js :: DOSSIER_STATE_PROSE_DEFENSE :: DS-DEF-3` | 1059 | safety 553, general 217, outsiders 216, rule 26, food 20, health 14, faith 8, trade 5 | 43% / 3% / 0% / 53% |
| `data/dailyLife/commonerResentments.js :: COMMONER_RESENTMENTS` | 970 | power 519, rule 161, food 105, house 94, general 81, trade 10 | 74% / 18% / 0% / 8% |
| `generators/economy/incomeLineSiblings.js :: OWN_HARVEST_LINE` | 829 | food 789, general 40 | 75% / 21% / 0% / 5% |

Who the ranking offers, by kind of line: a Daily Life line about strangers goes to the innkeeper or the market. A safety line goes to the reeve, the watch sergeant or the garrison commander. A food line goes to the miller, the granary reeve or the head shepherd. A faith line goes to the priest. A resentment of the council goes first to a council member: **the ruled are voiced by their rulers**, since the house of a "power" subject is the power itself (see the cold read). History and political-flavour pools are mostly general (74–80% unnamed in strict). Their lines are the place's memory and have no owner.

## On C and V, by size


**C, STRICT** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| named people a town (mean; median) | 1.3; 1 | 3.6; 3 | 8; 8 | 24.9; 26 | 60.9; 64 | 83.9; 86 | 30.4; 13 |
| STREET lines the town prints (mean) | 23 | 24.1 | 22 | 23.4 | 28.4 | 30.1 | 25.2 |
| distinct speakers the ranking finds (mean; median) | 1.1; 1 | 3.2; 3 | 5.5; 6 | 12.4; 12 | 17; 17 | 17; 17 | 9.4; 8 |
| **share of STREET lines that fall to an unnamed voice** | 58% | 52% | 47% | 31% | 32% | 37% | 42% |
| lines from the most-used person, whole town (mean; median) | 9; 8 | 5.5; 5 | 4.1; 4 | 2.4; 2 | 2; 2 | 1.8; 2 | 4.1; 3 |
| towns where someone speaks more than twice (whole town) | 150 | 139 | 114 | 50 | 27 | 11 | 491 |
| most lines from one person on one tab (mean) | 3.1 | 2.4 | 2.2 | 1.4 | 1.3 | 1.2 | 1.9 |
| **towns where someone speaks more than twice on one tab** | 98 | 49 | 48 | 5 | 1 | 0 | 201 |
| line-prints by rung 1 / 2 / 3 / 4 | 723 / 424 / 291 / 2006 | 926 / 654 / 146 / 1893 | 1405 / 220 / 134 / 1544 | 2283 / 118 / 25 / 1084 | 2835 / 63 / 6 / 1353 | 2690 / 146 / 0 / 1681 | 10862 / 1625 / 602 / 9561 |

**V, STRICT** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| named people a town (mean; median) | 1.3; 1 | 3.4; 3 | 8.1; 8 | 24.5; 25 | 57.6; 60 | 79.9; 81 | 29.1; 14 |
| STREET lines the town prints (mean) | 23.8 | 25.4 | 23.4 | 23.5 | 29.2 | 30.1 | 25.9 |
| distinct speakers the ranking finds (mean; median) | 1.1; 1 | 2.9; 3 | 5.8; 6 | 12.6; 12 | 17.2; 17 | 17.5; 17 | 9.5; 8 |
| **share of STREET lines that fall to an unnamed voice** | 61% | 50% | 41% | 29% | 30% | 33% | 40% |
| lines from the most-used person, whole town (mean; median) | 8.7; 8 | 7.2; 6 | 4.7; 4 | 2.4; 2 | 2.2; 2 | 2; 2 | 4.5; 3 |
| towns where someone speaks more than twice (whole town) | 149 | 141 | 131 | 53 | 36 | 20 | 530 |
| most lines from one person on one tab (mean) | 3.3 | 3 | 2.5 | 1.3 | 1.4 | 1.2 | 2.1 |
| **towns where someone speaks more than twice on one tab** | 114 | 93 | 68 | 5 | 5 | 1 | 286 |
| line-prints by rung 1 / 2 / 3 / 4 | 643 / 512 / 225 / 2190 | 1030 / 708 / 167 / 1908 | 1647 / 244 / 187 / 1426 | 2382 / 86 / 32 / 1019 | 2977 / 77 / 10 / 1313 | 2870 / 133 / 0 / 1509 | 11549 / 1760 / 621 / 9365 |

**C, LOOSE** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| named people a town (mean; median) | 1.3; 1 | 3.6; 3 | 8; 8 | 24.9; 26 | 60.9; 64 | 83.9; 86 | 30.4; 13 |
| STREET lines the town prints (mean) | 23 | 24.1 | 22 | 23.4 | 28.4 | 30.1 | 25.2 |
| distinct speakers the ranking finds (mean; median) | 1.2; 1 | 3.4; 3 | 7.5; 8 | 17.2; 17 | 24.1; 24 | 26.5; 26 | 13.3; 12 |
| **share of STREET lines that fall to an unnamed voice** | 29% | 22% | 14% | 1% | 0% | 0% | 10% |
| lines from the most-used person, whole town (mean; median) | 14.7; 15 | 8.5; 7 | 4.8; 4 | 2.8; 3 | 2.4; 2 | 2.1; 2 | 5.9; 3 |
| towns where someone speaks more than twice (whole town) | 150 | 149 | 143 | 81 | 46 | 21 | 590 |
| most lines from one person on one tab (mean) | 4.3 | 2.9 | 2.3 | 1.4 | 1.2 | 1.2 | 2.2 |
| **towns where someone speaks more than twice on one tab** | 146 | 78 | 53 | 3 | 1 | 0 | 281 |
| line-prints by rung 1 / 2 / 3 / 4 | 723 / 424 / 1309 / 988 | 926 / 654 / 1247 / 792 | 1405 / 220 / 1219 / 459 | 2283 / 118 / 1078 / 31 | 2835 / 63 / 1358 / 1 | 2690 / 146 / 1681 / 0 | 10862 / 1625 / 7892 / 2271 |

**V, LOOSE** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| named people a town (mean; median) | 1.3; 1 | 3.4; 3 | 8.1; 8 | 24.5; 25 | 57.6; 60 | 79.9; 81 | 29.1; 14 |
| STREET lines the town prints (mean) | 23.8 | 25.4 | 23.4 | 23.5 | 29.2 | 30.1 | 25.9 |
| distinct speakers the ranking finds (mean; median) | 1.2; 1 | 3.3; 3 | 7.6; 8 | 17.2; 17 | 24.2; 24 | 26; 26 | 13.3; 12 |
| **share of STREET lines that fall to an unnamed voice** | 32% | 21% | 10% | 1% | 0% | 0% | 10% |
| lines from the most-used person, whole town (mean; median) | 14.5; 14 | 9.7; 8 | 5.3; 5 | 2.7; 2 | 2.5; 2 | 2.1; 2 | 6.1; 4 |
| towns where someone speaks more than twice (whole town) | 150 | 150 | 147 | 73 | 59 | 30 | 609 |
| most lines from one person on one tab (mean) | 4.5 | 3.5 | 2.6 | 1.3 | 1.4 | 1.2 | 2.4 |
| **towns where someone speaks more than twice on one tab** | 141 | 106 | 73 | 2 | 5 | 1 | 328 |
| line-prints by rung 1 / 2 / 3 / 4 | 643 / 512 / 1270 / 1145 | 1030 / 708 / 1279 / 796 | 1647 / 244 / 1253 / 360 | 2382 / 86 / 1034 / 17 | 2977 / 77 / 1321 / 2 | 2870 / 133 / 1501 / 8 | 11549 / 1760 / 7658 / 2328 |

## What the numbers say (CONFIRMED counts; the reading PLAUSIBLE)

1. **Above the village the design works as written.** A town prints about 23 STREET lines and finds 12 distinct speakers (strict) or 17 (loose). The most-used person speaks about 2.4 times on the whole page, and in only 5 of 150 towns (C and V alike) does anyone speak more than twice on one tab. Cities and metropolises are the same (17 speakers, at most 2 a page).
2. **Below it the design collapses.** A thorp holds **1** named person (mean 1.3) and prints about 23 STREET lines. Strict, 58–61% of them fall to an unnamed voice, and the one person still speaks 8–9 times (98 and 114 of 150 thorps have someone speaking more than twice on one tab). Loose, that one person speaks 14–15 times. Hamlets (3 people) and villages (8) are between: someone speaks more than twice on a tab in 49–106 of 150. "Least-used first, a repeat allowed where the place is small, kept even" cannot be kept even when there is one person. Half of all places by size class are thorps, hamlets and villages.
3. **"An unnamed voice" is not a fallback. It is the commonest speaker.** Strict, it takes 42% (C) and 40% (V) of all STREET line-prints, and 29–37% even in cities with 60 named people, because a third of the lines have no subject. A subjectless line should go either to an unnamed voice by design, or to the place's people under a stated rule (LOOSE, which costs the thorps). It should not reach the unnamed voice as a leftover.
4. **Rung 3 (a neighbouring trade) almost never decides.** It decides 602 / 621 line-prints of 45,945 (strict). Rung 1 fills by name in towns and up; rung 2 does the work in hamlets (654 / 708).
