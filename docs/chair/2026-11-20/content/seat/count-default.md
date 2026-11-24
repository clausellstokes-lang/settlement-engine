# The seat count, arm default, law birth — who is present, who rules, who contends (900 born towns)

Executed: `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm default --law birth --n 150` at the base named in the commit; seeds `seat-measure-<tier>-<i>, i=0..n-1`; config `{ settType: <tier> } ; customContent {} ; everything else the generator default draws (priorities 50)`. 0 generation errors. Kind = the coup's reading (`factionArchetypes.js :: factionArchetype`). Raw: `count-default.json`.

## THE TABLE (all tiers)

| kind | present in | rules at birth | a contender | median power (not ruling) | left out though present | of those: under the floor of 5 | of those: the factor alone keeps it out | contenders that are in only by their factor |
|---|---|---|---|---|---|---|---|---|
| government | 682 (76%) | 680 | 7 (1% of present) | 12 | 9 | 0 | 0 | 0 |
| noble | 252 (28%) | 15 | 98 (39% of present) | 10 | 201 | 1 | 1 | 1 |
| military | 452 (50%) | 0 | 446 (99% of present) | 14 | 86 | 0 | 0 | 38 |
| merchant | 485 (54%) | 148 | 450 (93% of present) | 14 | 297 | 9 | 20 | 0 |
| religious | 545 (61%) | 0 | 472 (87% of present) | 15.5 | 163 | 0 | 11 | 3 |
| criminal | 26 (3%) | 0 | 0 (0% of present) | 9 | 0 | 0 | 0 | 0 |
| arcane | 207 (23%) | 0 | 29 (14% of present) | 10 | 228 | 0 | 8 | 1 |
| craft | 0 | 0 | 0 | – | – | – | – | – |
| labor | 0 | 0 | 0 | – | – | – | – | – |
| outsider | 0 | 0 | 0 | – | – | – | – | – |
| occupation | 0 | 0 | 0 | – | – | – | – | – |
| civic | 0 | 0 | 0 | – | – | – | – | – |
| other | 100 (11%) | 57 | 21 (21% of present) | 16 | 28 | 0 | 3 | 0 |

## By tier: present / rules / contender

| kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government | 150/150/3 | 150/150/1 | 150/150/1 | 34/33/2 | 94/94/0 | 104/103/0 |
| noble | 3/0/3 | 7/0/7 | 0/0/0 | 22/15/20 | 86/0/32 | 134/0/36 |
| military | 8/0/8 | 18/0/18 | 27/0/27 | 106/0/105 | 143/0/141 | 150/0/147 |
| merchant | 0/0/0 | 9/0/9 | 43/0/43 | 144/45/138 | 141/56/131 | 148/47/129 |
| religious | 0/0/0 | 2/0/2 | 124/0/124 | 145/0/138 | 125/0/108 | 149/0/100 |
| criminal | 0/0/0 | 0/0/0 | 0/0/0 | 4/0/0 | 5/0/0 | 17/0/0 |
| arcane | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 59/0/4 | 148/0/25 |
| other | 5/0/5 | 6/0/6 | 6/0/6 | 61/57/1 | 8/0/3 | 14/0/0 |

## The cut: a left-out power against the third contender (towns with a full field, power ≥ 5)

| kind | power p10 / p50 / p90 (not ruling) | third contender's weight, median | gap to the third (weight), p10 / p50 / p90 |
|---|---|---|---|
| government | 7 / 12 / 61 | 12.5 | 1 / 5.5 / 7.48 |
| noble | 6 / 10 / 23 | 12 | 0.89 / 1.05 / 5.4 |
| military | 9 / 14 / 23.6 | 12.43 | 1.88 / 3.25 / 4.9 |
| merchant | 8 / 14 / 31 | 12.35 | 2.45 / 4.45 / 7.21 |
| religious | 8 / 15.5 / 52.5 | 12.35 | 0.55 / 5 / 6.95 |
| criminal | 5.4 / 9 / 18.2 | – | – / – / – |
| arcane | 6 / 10 / 11 | 12 | 0.54 / 1.55 / 6.05 |
| other | 7 / 16 / 76.4 | 13 | 1.08 / 3 / 8.5 |

## The backing catalogue's reading (reads craft off the name)

| kind | present | rules | contender |
|---|---|---|---|
| government | 682 | 680 | 7 |
| noble | 252 | 15 | 98 |
| military | 452 | 0 | 446 |
| merchant | 483 | 148 | 450 |
| religious | 545 | 0 | 472 |
| criminal | 26 | 0 | 0 |
| arcane | 207 | 0 | 29 |
| craft | 161 | 0 | 2 |
| other | 100 | 57 | 21 |

## Where the ruler comes from

| tier | an institution's governance label | the priority / size path |
|---|---|---|
| all | 537 | 363 |
| thorp | 61 | 89 |
| hamlet | 86 | 64 |
| village | 50 | 100 |
| town | 93 | 57 |
| city | 109 | 41 |
| metropolis | 138 | 12 |

Label keys (all tiers): (none) 363 · merchant oligarchy 69 · informal elder consensus 59 · mayor and council 59 · guild consortium 54 · village headman 48 · noble governor 40 · head-of-household consensus 36 · lord's steward 26 · guild governance 25 · city-state government 22 · democratic assembly 22 · village reeve 22 · town council 18 · royal seat 16 · lord's appointee 15 · lord's reeve 6

## Ruling bodies born (all tiers)

Elder Council 282 · City Council 57 · Town Mayor 57 · Headman's Authority 48 · Merchant oligarchy 44 · Grand Council 40 · Household Council 36 · Town Council 33 · Feudal Stewardship 32 · Merchant Guild Council 32 · Free Elder Council 30 · Grand Merchant Oligarchy 25 · Guild Council 25 · City-State Council 22 · Democratic assembly 22 · Elected Reeve 22 · Grand Guild Consortium 22 · Ducal Governorship 21 · Noble Governorship 19 · Royal Authority 16 · Feudal Appointee 15

- thorp: Elder Council 108 · Household Council 36 · Feudal Stewardship 6
- hamlet: Elder Council 64 · Headman's Authority 35 · Free Elder Council 30 · Feudal Stewardship 21
- village: Elder Council 110 · Elected Reeve 22 · Headman's Authority 13 · Feudal Stewardship 5
- town: Town Mayor 57 · Town Council 33 · Guild Council 25 · Merchant oligarchy 20 · Feudal Appointee 15
- city: City Council 57 · Merchant Guild Council 32 · Merchant oligarchy 24 · Noble Governorship 19 · Democratic assembly 7 · Royal Authority 6 · City-State Council 5
- metropolis: Grand Council 40 · Grand Merchant Oligarchy 25 · Grand Guild Consortium 22 · Ducal Governorship 21 · City-State Council 17 · Democratic assembly 15 · Royal Authority 10

Ruler kinds (all): government 680 · merchant 148 · other 57 · noble 15

**Never reached** (names the choosers can push, none born in 900): Elder Consensus · Grand Guild Council · Guild Authority · Grand Military Council · Military City Council · Military Council · High Theocratic Council · Ecclesiastical Council · Church Council · Grand Merchant Senate · Merchant City Council · Merchant Council · Shadow Senate · Corrupt City Council · Corrupt Council · Arcane Senate · Arcane Council · Priestly Guidance

Named only in the description / power tables, emitted by no chooser: Theocratic Council · Corrupt Oligarchy · Shadowed Council · Mixed Council

Born but in no table: (none)

## Names under each kind (all tiers)

- government: Elder Council 282 · City Council 57 · Headman's Authority 48 · Grand Council 40 · Household Council 36 · Town Council 33 · Feudal Stewardship 32 · Free Elder Council 30 · City-State Council 22 · Democratic assembly 22 · Elected Reeve 22 · Ducal Governorship 21
- noble: Noble Houses 134 · Noble Families 86 · The Highborn Circle 20 · Landed Gentry 19 · Feudal Appointee 15 · The Old Houses 13 · The Peerage 12 · The Landed Bloc 8 · Manor Household 7 · Crown Creditors (Noble Coalition) 2
- military: Military/Guard 399 · War Council 34 · Military Party 33 · The Martial Alliance 27 · The Shield Compact 27 · The Order of the Watch 23 · The Garrison Bloc 21 · Occupation Authority 10 · Resistance Network 1
- merchant: Merchant Guilds 469 · Craft Guilds 161 · Merchant oligarchy 44 · The Merchant Bloc 34 · Merchant Guild Council 32 · The Commercial Circle 32 · The Trade Compact 28 · Grand Merchant Oligarchy 25 · Guild Council 25 · The Guild Alliance 24 · Grand Guild Consortium 22 · Grain Holders 4
- religious: Religious Authorities 543 · The Clergy Alliance 26 · The Faithful Assembly 26 · The Devout Circle 19 · The Holy Compact 17 · Reform Congregation 4 · New Faith Community 1
- criminal: Thieves' Guild 26 · The Underground 5 · The Black Circle 2 · The Shadow Compact 2
- arcane: Arcane Orders 207 · The Enlightened 15 · The Arcane Circle 14 · The Tower Alliance 12 · The Mages' Compact 9
- other: Town Mayor 57 · The Independent Bloc 23 · Creditor's Representative 13 · Newcomers' Settlement 5 · The Free Alliance 3 · Peace Movement 2 · The Common Interest 2 · Reform Movement 1

Craft-named powers as each reader reads them: Craft Guilds -> coup:merchant backing:craft category:economy (161)

## The field

- all: contenders per town 0:240 1:156 2:94 3:410; incumbent gated 867/900
- thorp: contenders per town 0:131 1:19; incumbent gated 150/150
- hamlet: contenders per town 0:107 1:43; incumbent gated 150/150
- village: contenders per town 0:2 1:94 2:54; incumbent gated 150/150
- town: contenders per town 2:40 3:110; incumbent gated 131/150
- city: contenders per town 3:150; incumbent gated 142/150
- metropolis: contenders per town 3:150; incumbent gated 144/150

## The priority path (no governance label in the roster)

- all: 363 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- thorp: 89 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- hamlet: 64 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- village: 100 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- town: 57 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- city: 41 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)
- metropolis: 12 towns; top priority > 55 in 0, > 65 in 0; top>government where > 55: (none)

## By culture: present / rules / contender

- arabic (77): government 59/59/1 · noble 12/1/6 · military 31/0/30 · merchant 38/11/35 · religious 47/0/42 · criminal 2/0/0 · arcane 12/0/2 · other 9/6/1
- celtic (81): government 65/65/1 · noble 26/2/11 · military 37/0/37 · merchant 41/10/40 · religious 48/0/38 · criminal 1/0/0 · arcane 20/0/1 · other 5/4/1
- east_asian (81): government 54/54/1 · noble 25/3/11 · military 47/0/47 · merchant 49/19/46 · religious 53/0/42 · criminal 5/0/0 · arcane 24/0/6 · other 9/5/0
- germanic (83): government 60/60/0 · noble 24/1/10 · military 46/0/44 · merchant 52/17/47 · religious 48/0/40 · criminal 1/0/0 · arcane 17/0/2 · other 8/5/2
- greek (78): government 59/58/1 · noble 22/0/8 · military 41/0/40 · merchant 41/17/37 · religious 49/0/43 · criminal 3/0/0 · arcane 23/0/1 · other 6/3/1
- latin (93): government 66/66/1 · noble 23/2/6 · military 53/0/52 · merchant 52/16/51 · religious 60/0/52 · criminal 2/0/0 · arcane 25/0/4 · other 12/9/2
- mesoamerican (86): government 65/64/1 · noble 23/1/8 · military 40/0/40 · merchant 44/17/40 · religious 53/0/47 · criminal 4/0/0 · arcane 18/0/2 · other 5/4/0
- norse (72): government 58/58/1 · noble 26/1/8 · military 36/0/36 · merchant 41/8/38 · religious 42/0/39 · arcane 20/0/1 · other 11/5/2
- slavic (92): government 74/74/0 · noble 24/2/13 · military 42/0/41 · merchant 45/9/40 · religious 51/0/44 · criminal 4/0/0 · arcane 17/0/5 · other 13/7/4
- south_asian (76): government 57/57/0 · noble 26/2/9 · military 41/0/41 · merchant 43/11/40 · religious 50/0/47 · criminal 2/0/0 · arcane 14/0/3 · other 13/6/4
- steppe (81): government 65/65/0 · noble 21/0/8 · military 38/0/38 · merchant 39/13/36 · religious 44/0/38 · criminal 2/0/0 · arcane 17/0/2 · other 9/3/4
