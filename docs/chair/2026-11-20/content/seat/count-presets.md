# The seat count, arm presets, law birth — who is present, who rules, who contends (960 born towns)

Executed: `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm presets --law birth --n 10` at the base named in the commit; seeds `seat-measure-<tier>-<preset>-<i>, i=0..n-1, 16 presets`; config `{ settType: <tier>, ...archetypePatch(<preset>) } ; customContent {}`. 0 generation errors. Kind = the coup's reading (`factionArchetypes.js :: factionArchetype`). Raw: `count-presets.json`.

## THE TABLE (all tiers)

| kind | present in | rules at birth | a contender | median power (not ruling) | left out though present | of those: under the floor of 5 | of those: the factor alone keeps it out | contenders that are in only by their factor |
|---|---|---|---|---|---|---|---|---|
| government | 584 (61%) | 579 | 6 (1% of present) | 10 | 6 | 1 | 0 | 0 |
| noble | 260 (27%) | 12 | 220 (85% of present) | 12 | 91 | 5 | 0 | 17 |
| military | 414 (43%) | 61 | 356 (86% of present) | 17 | 119 | 22 | 0 | 46 |
| merchant | 438 (46%) | 179 | 345 (79% of present) | 12 | 284 | 21 | 50 | 1 |
| religious | 413 (43%) | 85 | 290 (70% of present) | 14 | 143 | 13 | 13 | 4 |
| criminal | 90 (9%) | 22 | 0 (0% of present) | 12 | 0 | 0 | 0 | 0 |
| arcane | 207 (22%) | 20 | 74 (36% of present) | 8 | 185 | 21 | 4 | 3 |
| craft | 0 | 0 | 0 | – | – | – | – | – |
| labor | 0 | 0 | 0 | – | – | – | – | – |
| outsider | 0 | 0 | 0 | – | – | – | – | – |
| occupation | 0 | 0 | 0 | – | – | – | – | – |
| civic | 0 | 0 | 0 | – | – | – | – | – |
| other | 63 (7%) | 2 | 41 (65% of present) | 15 | 30 | 2 | 4 | 0 |

## By tier: present / rules / contender

| kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government | 160/160/0 | 160/160/3 | 130/130/1 | 1/0/1 | 57/56/0 | 76/73/1 |
| noble | 2/0/2 | 1/0/1 | 6/0/6 | 42/12/36 | 94/0/80 | 115/0/95 |
| military | 1/0/1 | 21/0/21 | 42/0/42 | 102/29/95 | 114/18/97 | 134/14/100 |
| merchant | 0/0/0 | 5/0/5 | 34/0/34 | 127/69/109 | 128/59/100 | 144/51/97 |
| religious | 0/0/0 | 0/0/0 | 100/30/76 | 100/31/83 | 101/13/64 | 112/11/67 |
| criminal | 0/0/0 | 0/0/0 | 1/0/0 | 25/12/0 | 29/6/0 | 35/4/0 |
| arcane | 0/0/0 | 0/0/0 | 0/0/0 | 7/5/2 | 69/8/24 | 131/7/48 |
| other | 5/0/5 | 8/0/8 | 12/0/12 | 12/2/8 | 12/0/6 | 14/0/2 |

## The cut: a left-out power against the third contender (towns with a full field, power ≥ 5)

| kind | power p10 / p50 / p90 (not ruling) | third contender's weight, median | gap to the third (weight), p10 / p50 / p90 |
|---|---|---|---|
| government | 7 / 10 / 48.6 | 12.6 | 3.88 / 4.5 / 5.02 |
| noble | 6 / 12 / 23 | 11.13 | 0.5 / 3.42 / 5.5 |
| military | 6 / 17 / 36.7 | 10.5 | 0.5 / 2 / 5 |
| merchant | 6 / 12 / 26 | 11 | 0.7 / 3.75 / 7.26 |
| religious | 7 / 14 / 34 | 12.05 | 1.23 / 4 / 6.2 |
| criminal | 7 / 12 / 25 | – | – / – / – |
| arcane | 5 / 8 / 14 | 11 | 0.73 / 3.1 / 7.74 |
| other | 7 / 15 / 64 | 12.05 | 1.33 / 4.1 / 7.88 |

## The backing catalogue's reading (reads craft off the name)

| kind | present | rules | contender |
|---|---|---|---|
| government | 584 | 579 | 6 |
| noble | 260 | 12 | 220 |
| military | 414 | 61 | 356 |
| merchant | 434 | 179 | 345 |
| religious | 413 | 85 | 290 |
| criminal | 90 | 22 | 0 |
| arcane | 207 | 20 | 74 |
| craft | 247 | 0 | 147 |
| other | 63 | 2 | 41 |

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

- government: Elder Council 193 · Household Council 92 · Feudal Stewardship 57 · Headman's Authority 51 · Free Elder Council 38 · Ducal Governorship 29 · Royal Authority 29 · Noble Governorship 27 · Democratic assembly 26 · Elected Reeve 19 · City-State Council 18 · People's Council 4
- noble: Noble Houses 111 · Noble Families 92 · Landed Gentry 38 · The Highborn Circle 24 · The Peerage 21 · The Old Houses 17 · The Landed Bloc 16 · Feudal Appointee 12 · Manor Household 5 · Crown Creditors (Noble Coalition) 1 · Loyalist Noble Opposition 1
- military: Military/Guard 381 · Military Council 29 · The Garrison Bloc 28 · The Shield Compact 26 · The Order of the Watch 23 · Military City Council 18 · War Council 18 · Military Party 16 · The Martial Alliance 15 · Grand Military Council 14 · Occupation Authority 6 · Monster Hunters / Adventurers 1
- merchant: Merchant Guilds 415 · Craft Guilds 247 · The Guild Alliance 45 · Guild Council 43 · Merchant oligarchy 41 · The Commercial Circle 36 · The Merchant Bloc 32 · Grand Merchant Oligarchy 26 · The Trade Compact 26 · Merchant Guild Council 24 · Grand Guild Consortium 16 · Merchant Council 13
- religious: Religious Authorities 380 · Church Council 31 · Priestly Guidance 30 · The Faithful Assembly 22 · The Clergy Alliance 20 · The Devout Circle 15 · Ecclesiastical Council 13 · High Theocratic Council 11 · The Holy Compact 11 · Reform Congregation 2 · Conversion Enforcement Office 1 · New Faith Community 1
- criminal: Thieves' Guild 84 · Corrupt Council 12 · Corrupt City Council 6 · The Black Circle 6 · Shadow Senate 4 · The Shadow Compact 4 · The Underground 4 · The Hidden Hand 3
- arcane: Arcane Orders 203 · The Arcane Circle 20 · The Mages' Compact 16 · Arcane Council 13 · The Enlightened 10 · The Tower Alliance 10 · Arcane Senate 7
- other: The Independent Bloc 32 · Creditor's Representative 16 · Reform Movement 10 · The Common Interest 5 · Newcomers' Settlement 3 · The Inquiry 3 · Town Mayor 2 · The Free Alliance 1 · Third Bloc (Neutrals) 1

Craft-named powers as each reader reads them: Craft Guilds -> coup:merchant backing:craft category:economy (247)

## The field

- all: contenders per town 0:293 1:157 2:107 3:403; incumbent gated 950/960
- thorp: contenders per town 0:152 1:8; incumbent gated 160/160
- hamlet: contenders per town 0:122 1:38; incumbent gated 160/160
- village: contenders per town 0:19 1:96 2:45; incumbent gated 160/160
- town: contenders per town 1:15 2:59 3:86; incumbent gated 155/160
- city: contenders per town 2:3 3:157; incumbent gated 158/160
- metropolis: contenders per town 3:160; incumbent gated 157/160

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

- arabic (86): government 57/57/1 · noble 22/1/19 · military 34/3/32 · merchant 37/14/27 · religious 43/9/32 · criminal 8/1/0 · arcane 18/1/3 · other 7/0/5
- celtic (81): government 56/55/1 · noble 22/1/19 · military 31/4/25 · merchant 36/13/27 · religious 29/5/21 · criminal 8/1/0 · arcane 20/2/6 · other 4/0/2
- east_asian (99): government 62/62/0 · noble 25/0/21 · military 38/7/35 · merchant 43/18/36 · religious 34/8/23 · criminal 8/2/0 · arcane 23/2/9 · other 5/0/3
- germanic (80): government 48/47/0 · noble 24/1/21 · military 34/5/29 · merchant 40/22/35 · religious 34/3/21 · criminal 8/1/0 · arcane 14/1/9 · other 7/0/5
- greek (83): government 48/48/0 · noble 32/3/26 · military 41/5/36 · merchant 47/16/34 · religious 44/8/28 · criminal 4/1/0 · arcane 18/1/6 · other 5/1/3
- latin (85): government 46/46/0 · noble 19/0/14 · military 31/3/21 · merchant 46/19/37 · religious 43/11/32 · criminal 11/3/0 · arcane 27/3/10 · other 5/0/3
- mesoamerican (94): government 57/56/2 · noble 17/0/15 · military 41/6/39 · merchant 36/16/29 · religious 37/11/23 · criminal 13/3/0 · arcane 14/1/6 · other 6/1/3
- norse (100): government 58/58/0 · noble 33/1/30 · military 54/10/46 · merchant 44/17/36 · religious 49/10/36 · criminal 8/2/0 · arcane 20/2/6 · other 7/0/5
- slavic (76): government 50/50/0 · noble 19/1/17 · military 30/4/25 · merchant 31/14/20 · religious 36/5/30 · criminal 4/2/0 · arcane 13/0/5 · other 5/0/3
- south_asian (85): government 50/49/0 · noble 21/2/19 · military 41/7/38 · merchant 40/12/30 · religious 34/10/25 · criminal 6/3/0 · arcane 21/2/6 · other 4/0/3
- steppe (91): government 52/51/2 · noble 26/2/19 · military 39/7/30 · merchant 38/18/34 · religious 30/5/19 · criminal 12/3/0 · arcane 19/5/8 · other 8/0/6
