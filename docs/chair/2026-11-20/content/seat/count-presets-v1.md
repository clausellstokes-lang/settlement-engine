# The seat count, arm presets — who is present, who rules, who contends (960 born towns)

Executed: `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm presets --n 10` at the base named in the commit; seeds `seat-measure-<tier>-<preset>-<i>, i=0..n-1, 16 presets`; config `{ settType: <tier>, ...archetypePatch(<preset>) } ; customContent {}`. 0 generation errors. Kind = the coup's reading (`factionArchetypes.js :: factionArchetype`). Raw: `count-presets-v1.json` (v1: bare config, before the --law switch existed; renamed).

## THE TABLE (all tiers)

| kind | present in | rules at birth | a contender | median power (not ruling) | left out though present | of those: under the floor of 5 | of those: the factor alone keeps it out | contenders that are in only by their factor |
|---|---|---|---|---|---|---|---|---|
| government | 586 (61%) | 579 | 19 (3% of present) | 15 | 3 | 0 | 0 | 1 |
| noble | 523 (54%) | 12 | 349 (67% of present) | 12 | 186 | 7 | 1 | 28 |
| military | 720 (75%) | 61 | 573 (80% of present) | 17 | 161 | 10 | 0 | 46 |
| merchant | 551 (57%) | 179 | 395 (72% of present) | 10 | 470 | 0 | 53 | 1 |
| religious | 714 (74%) | 85 | 481 (67% of present) | 14 | 242 | 1 | 9 | 9 |
| criminal | 180 (19%) | 22 | 0 (0% of present) | 9 | 0 | 0 | 0 | 0 |
| arcane | 303 (32%) | 20 | 90 (30% of present) | 7 | 213 | 2 | 7 | 1 |
| craft | 0 | 0 | 0 | – | – | – | – | – |
| labor | 0 | 0 | 0 | – | – | – | – | – |
| outsider | 0 | 0 | 0 | – | – | – | – | – |
| occupation | 0 | 0 | 0 | – | – | – | – | – |
| civic | 0 | 0 | 0 | – | – | – | – | – |
| other | 162 (17%) | 2 | 83 (51% of present) | 12 | 92 | 0 | 16 | 0 |

## By tier: present / rules / contender

| kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government | 160/160/3 | 160/160/6 | 132/130/6 | 3/0/3 | 57/56/0 | 74/73/1 |
| noble | 4/0/4 | 66/0/56 | 66/0/44 | 83/12/59 | 150/0/91 | 154/0/95 |
| military | 74/0/74 | 93/0/93 | 93/0/81 | 145/29/114 | 158/18/109 | 157/14/102 |
| merchant | 5/0/5 | 18/0/17 | 49/0/46 | 159/69/109 | 160/59/109 | 160/51/109 |
| religious | 37/0/37 | 37/0/37 | 160/30/154 | 160/31/104 | 160/13/73 | 160/11/76 |
| criminal | 0/0/0 | 2/0/0 | 6/0/0 | 30/12/0 | 70/6/0 | 72/4/0 |
| arcane | 0/0/0 | 0/0/0 | 0/0/0 | 10/5/7 | 133/8/32 | 160/7/51 |
| other | 23/0/22 | 32/0/26 | 29/0/19 | 31/2/4 | 25/0/10 | 22/0/2 |

## The cut: a left-out power against the third contender (towns with a full field, power ≥ 5)

| kind | power p10 / p50 / p90 (not ruling) | third contender's weight, median | gap to the third (weight), p10 / p50 / p90 |
|---|---|---|---|
| government | 8.3 / 15 / 48.6 | 13.2 | 4.24 / 5.2 / 6.08 |
| noble | 6 / 12 / 22 | 10.45 | 0.82 / 3 / 5.75 |
| military | 6 / 17 / 28 | 10 | 0.7 / 2.3 / 4.95 |
| merchant | 6 / 10 / 21 | 12 | 1.35 / 4.5 / 9.37 |
| religious | 6 / 14 / 34 | 10.45 | 1.1 / 3.25 / 5.3 |
| criminal | 5 / 9 / 17 | – | – / – / – |
| arcane | 5 / 7 / 13 | 11 | 0.9 / 3.7 / 7.95 |
| other | 7 / 12 / 32 | 12.35 | 1.2 / 4.2 / 9.1 |

## The backing catalogue's reading (reads craft off the name)

| kind | present | rules | contender |
|---|---|---|---|
| government | 586 | 579 | 19 |
| noble | 523 | 12 | 349 |
| military | 720 | 61 | 573 |
| merchant | 551 | 179 | 395 |
| religious | 714 | 85 | 481 |
| criminal | 180 | 22 | 0 |
| arcane | 303 | 20 | 90 |
| craft | 496 | 0 | 184 |
| other | 162 | 2 | 83 |

## Where the ruler comes from

| tier | an institution's governance label | the priority / size path |
|---|---|---|
| all | 582 | 378 |
| thorp | 73 | 87 |
| hamlet | 98 | 62 |
| village | 51 | 109 |
| town | 108 | 52 |
| city | 124 | 36 |
| metropolis | 128 | 32 |

Label keys (all tiers): (none) 378 · merchant oligarchy 67 · informal elder consensus 65 · noble governor 56 · village headman 51 · guild governance 43 · guild consortium 40 · mayor and council 39 · lord's steward 36 · head-of-household consensus 30 · town council 30 · royal seat 29 · democratic assembly 26 · lord's reeve 21 · village reeve 19 · city-state government 18 · lord's appointee 12

## Ruling bodies born (all tiers)

Elder Council 193 · Household Council 92 · Feudal Stewardship 57 · Headman's Authority 51 · Guild Council 43 · Merchant oligarchy 41 · Free Elder Council 38 · Church Council 31 · Priestly Guidance 30 · Ducal Governorship 29 · Military Council 29 · Royal Authority 29 · Noble Governorship 27 · Democratic assembly 26 · Grand Merchant Oligarchy 26 · Merchant Guild Council 24 · Elected Reeve 19 · City-State Council 18 · Military City Council 18 · Grand Guild Consortium 16 · Grand Military Council 14 · Arcane Council 13 · Ecclesiastical Council 13 · Merchant Council 13 · Corrupt Council 12 · Feudal Appointee 12 · High Theocratic Council 11 · Grand Merchant Senate 9 · Arcane Senate 7 · Merchant City Council 7 · Corrupt City Council 6 · Shadow Senate 4 · Town Mayor 2

- thorp: Elder Council 85 · Household Council 54 · Feudal Stewardship 21
- hamlet: Elder Council 48 · Free Elder Council 38 · Headman's Authority 37 · Feudal Stewardship 23 · Household Council 14
- village: Elder Council 60 · Priestly Guidance 30 · Household Council 24 · Elected Reeve 19 · Headman's Authority 14 · Feudal Stewardship 13
- town: Guild Council 43 · Church Council 31 · Military Council 29 · Merchant Council 13 · Merchant oligarchy 13 · Corrupt Council 12 · Feudal Appointee 12 · Arcane Council 5 · Town Mayor 2
- city: Merchant oligarchy 28 · Noble Governorship 27 · Merchant Guild Council 24 · Military City Council 18 · Ecclesiastical Council 13 · Democratic assembly 12 · Royal Authority 12 · Arcane Council 8 · Merchant City Council 7 · Corrupt City Council 6 · City-State Council 5
- metropolis: Ducal Governorship 29 · Grand Merchant Oligarchy 26 · Royal Authority 17 · Grand Guild Consortium 16 · Democratic assembly 14 · Grand Military Council 14 · City-State Council 13 · High Theocratic Council 11 · Grand Merchant Senate 9 · Arcane Senate 7 · Shadow Senate 4

Ruler kinds (all): government 579 · merchant 179 · religious 85 · military 61 · criminal 22 · arcane 20 · noble 12 · other 2

**Never reached** (names the choosers can push, none born in 960): Elder Consensus · Grand Council · City Council · Town Council · Grand Guild Council · Guild Authority

Named only in the description / power tables, emitted by no chooser: Theocratic Council · Corrupt Oligarchy · Shadowed Council · Mixed Council

Born but in no table: (none)

## Names under each kind (all tiers)

- government: Elder Council 193 · Household Council 92 · Feudal Stewardship 57 · Headman's Authority 51 · Free Elder Council 38 · Ducal Governorship 29 · Royal Authority 29 · Noble Governorship 27 · Democratic assembly 26 · Elected Reeve 19 · City-State Council 18 · Quarantine Council 11
- noble: Noble Houses 151 · Noble Families 147 · Manor Household 124 · Landed Gentry 81 · The Highborn Circle 24 · The Peerage 24 · Feudal Appointee 12 · Crown Creditors (Noble Coalition) 1 · Loyalist Noble Opposition 1
- military: Military/Guard 569 · Military Party 141 · War Council 49 · Military Council 29 · Military City Council 18 · Grand Military Council 14 · Monster Hunters / Adventurers 6 · Occupation Authority 6 · Resistance Network 6
- merchant: Merchant Guilds 538 · Craft Guilds 496 · Guild Council 43 · Merchant oligarchy 41 · Grand Merchant Oligarchy 26 · Merchant Guild Council 24 · Grain Holders 16 · Grand Guild Consortium 16 · Merchant Council 13 · Grand Merchant Senate 9 · Merchant City Council 7
- religious: Religious Authorities 712 · Church Council 31 · Priestly Guidance 30 · Ecclesiastical Council 13 · High Theocratic Council 11 · Reform Congregation 8 · New Faith Community 4 · Conversion Enforcement Office 3 · Underground Old Faith 3
- criminal: Thieves' Guild 176 · Corrupt Council 12 · Corrupt City Council 6 · Shadow Senate 4
- arcane: Arcane Orders 303 · Arcane Council 13 · Arcane Senate 7
- other: Creditor's Representative 40 · The Independent Bloc 37 · Peace Movement 28 · Third Bloc (Neutrals) 24 · The Inquiry 22 · Newcomers' Settlement 17 · Reform Movement 17 · Town Mayor 2

Craft-named powers as each reader reads them: Craft Guilds -> coup:merchant backing:craft category:economy (496)

## The field

- all: contenders per town 0:87 1:130 2:106 3:637; incumbent gated 885/960
- thorp: contenders per town 0:53 1:61 2:32 3:14; incumbent gated 152/160
- hamlet: contenders per town 0:34 1:36 2:56 3:34; incumbent gated 147/160
- village: contenders per town 1:33 2:18 3:109; incumbent gated 130/160
- town: contenders per town 3:160; incumbent gated 140/160
- city: contenders per town 3:160; incumbent gated 158/160
- metropolis: contenders per town 3:160; incumbent gated 158/160

## The priority path (no governance label in the roster)

- all: 378 towns; top priority > 55 in 378, > 65 in 378; top>government where > 55: military>Elder Council 65 · economy>Household Council 62 · criminal>Elder Council 36 · religion>Elder Council 33 · magic>Elder Council 32 · religion>Priestly Guidance 30 · military>Military Council 19 · military>Military City Council 15 · religion>Church Council 15 · religion>High Theocratic Council 10 · military>Grand Military Council 9 · religion>Ecclesiastical Council 9 · magic>Arcane Council 8 · criminal>Corrupt Council 7 · economy>Grand Merchant Senate 6 · criminal>Corrupt City Council 5 · magic>Arcane Senate 5 · economy>Merchant Council 4 · criminal>Shadow Senate 2 · economy>Merchant City Council 2 · magic>Merchant Council 2 · magic>Town Mayor 2
- thorp: 87 towns; top priority > 55 in 87, > 65 in 87; top>government where > 55: military>Elder Council 26 · economy>Household Council 24 · religion>Elder Council 15 · magic>Elder Council 12 · criminal>Elder Council 10
- hamlet: 62 towns; top priority > 55 in 62, > 65 in 62; top>government where > 55: religion>Elder Council 18 · economy>Household Council 14 · military>Elder Council 11 · criminal>Elder Council 10 · magic>Elder Council 9
- village: 109 towns; top priority > 55 in 109, > 65 in 109; top>government where > 55: religion>Priestly Guidance 30 · military>Elder Council 28 · economy>Household Council 24 · criminal>Elder Council 16 · magic>Elder Council 11
- town: 52 towns; top priority > 55 in 52, > 65 in 52; top>government where > 55: military>Military Council 19 · religion>Church Council 15 · criminal>Corrupt Council 7 · economy>Merchant Council 4 · magic>Arcane Council 3 · magic>Merchant Council 2 · magic>Town Mayor 2
- city: 36 towns; top priority > 55 in 36, > 65 in 36; top>government where > 55: military>Military City Council 15 · religion>Ecclesiastical Council 9 · criminal>Corrupt City Council 5 · magic>Arcane Council 5 · economy>Merchant City Council 2
- metropolis: 32 towns; top priority > 55 in 32, > 65 in 32; top>government where > 55: religion>High Theocratic Council 10 · military>Grand Military Council 9 · economy>Grand Merchant Senate 6 · magic>Arcane Senate 5 · criminal>Shadow Senate 2

## Ruling bodies by preset (all tiers)

- merchant_republic: Household Council 24 · Guild Council 7 · Grand Merchant Senate 4 · Ducal Governorship 3 · Free Elder Council 3 · Merchant oligarchy 3 · Noble Governorship 3 · Headman's Authority 2 · Merchant Council 2 · Merchant Guild Council 2 · City-State Council 1 · Democratic assembly 1 · Elected Reeve 1 · Grand Guild Consortium 1 · Grand Merchant Oligarchy 1 · Merchant City Council 1 · Royal Authority 1
- trade_crossroads: Household Council 21 · Guild Council 5 · Grand Merchant Oligarchy 4 · Grand Merchant Senate 4 · Elected Reeve 3 · Free Elder Council 3 · Merchant City Council 3 · Merchant Council 3 · Merchant oligarchy 3 · Democratic assembly 2 · Headman's Authority 2 · Merchant Guild Council 2 · City-State Council 1 · Ducal Governorship 1 · Elder Council 1 · Grand Guild Consortium 1 · Royal Authority 1
- mining_colony: Elder Council 15 · Military Council 6 · Headman's Authority 5 · Free Elder Council 4 · Grand Military Council 4 · Military City Council 4 · City-State Council 3 · Guild Council 3 · Merchant oligarchy 3 · Democratic assembly 2 · Elected Reeve 2 · Feudal Stewardship 2 · Household Council 2 · Noble Governorship 2 · Grand Guild Consortium 1 · Grand Merchant Oligarchy 1 · Merchant Guild Council 1
- military_fortress: Elder Council 16 · Headman's Authority 5 · Military Council 5 · Feudal Stewardship 4 · Royal Authority 4 · Feudal Appointee 3 · Free Elder Council 3 · Grand Military Council 3 · Military City Council 3 · Noble Governorship 3 · Grand Guild Consortium 2 · Guild Council 2 · City-State Council 1 · Democratic assembly 1 · Ducal Governorship 1 · Elected Reeve 1 · Grand Merchant Oligarchy 1 · Household Council 1 · Merchant Guild Council 1
- frontier_outpost: Elder Council 17 · Feudal Stewardship 7 · Military Council 6 · Headman's Authority 3 · Household Council 3 · Military City Council 3 · Noble Governorship 3 · Royal Authority 3 · City-State Council 2 · Democratic assembly 2 · Feudal Appointee 2 · Grand Merchant Oligarchy 2 · Guild Council 2 · Merchant oligarchy 2 · Ducal Governorship 1 · Grand Military Council 1 · Merchant Guild Council 1
- besieged_holdout: Elder Council 13 · Feudal Stewardship 9 · Military Council 9 · Free Elder Council 5 · Noble Governorship 5 · Ducal Governorship 4 · Grand Military Council 3 · Military City Council 3 · Merchant Guild Council 2 · Democratic assembly 1 · Elected Reeve 1 · Grand Merchant Oligarchy 1 · Guild Council 1 · Headman's Authority 1 · Household Council 1 · Royal Authority 1
- plague_of_beasts: Elder Council 9 · Feudal Stewardship 8 · Church Council 7 · Priestly Guidance 6 · Ecclesiastical Council 4 · Headman's Authority 4 · Ducal Governorship 3 · Noble Governorship 3 · Democratic assembly 2 · Guild Council 2 · High Theocratic Council 2 · Household Council 2 · Royal Authority 2 · City-State Council 1 · Elected Reeve 1 · Feudal Appointee 1 · Grand Guild Consortium 1 · Merchant Guild Council 1 · Merchant oligarchy 1
- theocracy: Church Council 10 · Elder Council 9 · Priestly Guidance 8 · Household Council 4 · Noble Governorship 4 · Feudal Stewardship 3 · Headman's Authority 3 · Merchant oligarchy 3 · City-State Council 2 · Democratic assembly 2 · Ecclesiastical Council 2 · Elected Reeve 2 · Grand Merchant Oligarchy 2 · Ducal Governorship 1 · Free Elder Council 1 · Grand Guild Consortium 1 · High Theocratic Council 1 · Merchant Guild Council 1 · Royal Authority 1
- holy_sanctuary: Elder Council 10 · Church Council 6 · Priestly Guidance 6 · Feudal Stewardship 5 · Merchant oligarchy 5 · Headman's Authority 4 · Ecclesiastical Council 3 · Guild Council 3 · High Theocratic Council 3 · Democratic assembly 2 · Ducal Governorship 2 · Elected Reeve 2 · Free Elder Council 2 · Grand Guild Consortium 2 · Grand Merchant Oligarchy 2 · Household Council 1 · Merchant Guild Council 1 · Royal Authority 1
- crusader_chapter: Elder Council 11 · Priestly Guidance 10 · Church Council 8 · High Theocratic Council 5 · Ecclesiastical Council 4 · Feudal Stewardship 4 · Ducal Governorship 3 · Free Elder Council 3 · Feudal Appointee 2 · Noble Governorship 2 · Royal Authority 2 · City-State Council 1 · Democratic assembly 1 · Grand Guild Consortium 1 · Headman's Authority 1 · Household Council 1 · Merchant Guild Council 1
- mage_city: Elder Council 18 · Arcane Council 6 · Guild Council 5 · Headman's Authority 5 · Arcane Senate 4 · Merchant Guild Council 4 · Feudal Stewardship 3 · Free Elder Council 3 · Ducal Governorship 2 · Feudal Appointee 2 · Grand Merchant Oligarchy 2 · Merchant Council 2 · Democratic assembly 1 · Elected Reeve 1 · Merchant oligarchy 1 · Royal Authority 1
- arcane_academy: Elder Council 16 · Arcane Council 7 · Merchant oligarchy 6 · Household Council 5 · Arcane Senate 3 · Elected Reeve 3 · Free Elder Council 3 · Grand Guild Consortium 3 · Grand Merchant Oligarchy 2 · Guild Council 2 · Headman's Authority 2 · Merchant Guild Council 2 · Town Mayor 2 · Democratic assembly 1 · Feudal Stewardship 1 · Noble Governorship 1 · Royal Authority 1
- monster_hunters: Elder Council 17 · Feudal Stewardship 5 · Military City Council 5 · Guild Council 4 · Merchant oligarchy 4 · Royal Authority 4 · Grand Military Council 3 · Headman's Authority 3 · Military Council 3 · Ducal Governorship 2 · Elected Reeve 2 · Free Elder Council 2 · Grand Merchant Oligarchy 2 · City-State Council 1 · Grand Guild Consortium 1 · Household Council 1 · Merchant Guild Council 1
- lawless_frontier: Elder Council 16 · Corrupt Council 7 · Free Elder Council 5 · Household Council 5 · Grand Merchant Oligarchy 4 · Ducal Governorship 3 · Merchant oligarchy 3 · Royal Authority 3 · City-State Council 2 · Corrupt City Council 2 · Feudal Appointee 2 · Feudal Stewardship 2 · Headman's Authority 2 · Democratic assembly 1 · Guild Council 1 · Merchant Guild Council 1 · Noble Governorship 1
- criminal_haven: Elder Council 22 · Corrupt Council 5 · Democratic assembly 5 · Corrupt City Council 4 · Headman's Authority 4 · Shadow Senate 4 · Guild Council 3 · Merchant oligarchy 3 · Ducal Governorship 2 · Feudal Stewardship 2 · Household Council 2 · Grand Guild Consortium 1 · Grand Merchant Oligarchy 1 · Merchant Guild Council 1 · Royal Authority 1
- safe_province_capital: Household Council 19 · Merchant Council 6 · Headman's Authority 5 · Merchant oligarchy 4 · City-State Council 3 · Elder Council 3 · Guild Council 3 · Merchant City Council 3 · Royal Authority 3 · Democratic assembly 2 · Feudal Stewardship 2 · Merchant Guild Council 2 · Ducal Governorship 1 · Free Elder Council 1 · Grand Guild Consortium 1 · Grand Merchant Oligarchy 1 · Grand Merchant Senate 1

## By culture: present / rules / contender

- arabic (86): government 57/57/2 · noble 47/1/31 · military 58/3/51 · merchant 47/14/34 · religious 66/9/51 · criminal 14/1/0 · arcane 25/1/4 · other 20/0/9
- celtic (81): government 56/55/4 · noble 42/1/30 · military 56/4/41 · merchant 42/13/32 · religious 59/5/38 · criminal 12/1/0 · arcane 28/2/7 · other 12/0/8
- east_asian (99): government 62/62/0 · noble 50/0/34 · military 75/7/62 · merchant 55/18/42 · religious 68/8/42 · criminal 19/2/0 · arcane 32/2/8 · other 19/0/9
- germanic (80): government 48/47/2 · noble 42/1/31 · military 62/5/44 · merchant 49/22/40 · religious 62/3/38 · criminal 14/1/0 · arcane 23/1/12 · other 11/0/6
- greek (83): government 48/48/0 · noble 52/3/39 · military 64/5/52 · merchant 52/16/33 · religious 61/8/42 · criminal 16/1/0 · arcane 27/1/7 · other 18/1/7
- latin (85): government 48/46/1 · noble 41/0/22 · military 62/3/42 · merchant 53/19/40 · religious 66/11/46 · criminal 17/3/0 · arcane 33/3/15 · other 15/0/8
- mesoamerican (94): government 58/56/5 · noble 55/0/30 · military 77/6/64 · merchant 50/16/38 · religious 71/11/51 · criminal 19/3/0 · arcane 25/1/7 · other 13/1/7
- norse (100): government 58/58/1 · noble 58/1/43 · military 77/10/67 · merchant 64/17/38 · religious 78/10/53 · criminal 23/2/0 · arcane 36/2/7 · other 19/0/7
- slavic (76): government 50/50/1 · noble 39/1/28 · military 55/4/45 · merchant 37/14/25 · religious 54/5/41 · criminal 6/2/0 · arcane 16/0/6 · other 12/0/8
- south_asian (85): government 50/49/1 · noble 48/2/32 · military 70/7/58 · merchant 51/12/36 · religious 66/10/44 · criminal 16/3/0 · arcane 29/2/8 · other 10/0/5
- steppe (91): government 51/51/2 · noble 49/2/29 · military 64/7/47 · merchant 51/18/37 · religious 63/5/35 · criminal 24/3/0 · arcane 29/5/9 · other 13/0/9
