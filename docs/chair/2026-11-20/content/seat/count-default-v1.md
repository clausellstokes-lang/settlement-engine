# The seat count, arm default — who is present, who rules, who contends (900 born towns)

Executed: `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm default --n 150` at the base named in the commit; seeds `seat-measure-<tier>-<i>, i=0..n-1`; config `{ settType: <tier> } ; customContent {} ; everything else the generator default draws (priorities 50)`. 0 generation errors. Kind = the coup's reading (`factionArchetypes.js :: factionArchetype`). Raw: `count-default-v1.json` (v1: bare config, before the --law switch existed; renamed).

## THE TABLE (all tiers)

| kind | present in | rules at birth | a contender | median power (not ruling) | left out though present | of those: under the floor of 5 | of those: the factor alone keeps it out | contenders that are in only by their factor |
|---|---|---|---|---|---|---|---|---|
| government | 682 (76%) | 680 | 25 (4% of present) | 17 | 11 | 0 | 2 | 0 |
| noble | 517 (57%) | 15 | 145 (28% of present) | 10 | 391 | 0 | 3 | 1 |
| military | 770 (86%) | 0 | 710 (92% of present) | 14 | 74 | 0 | 0 | 42 |
| merchant | 518 (58%) | 148 | 454 (88% of present) | 13 | 535 | 0 | 25 | 0 |
| religious | 665 (74%) | 0 | 585 (88% of present) | 16 | 93 | 0 | 9 | 10 |
| criminal | 288 (32%) | 0 | 0 (0% of present) | 5 | 0 | 0 | 0 | 0 |
| arcane | 300 (33%) | 0 | 31 (10% of present) | 10 | 269 | 0 | 10 | 2 |
| craft | 0 | 0 | 0 | – | – | – | – | – |
| labor | 0 | 0 | 0 | – | – | – | – | – |
| outsider | 0 | 0 | 0 | – | – | – | – | – |
| occupation | 0 | 0 | 0 | – | – | – | – | – |
| civic | 0 | 0 | 0 | – | – | – | – | – |
| other | 194 (22%) | 57 | 53 (27% of present) | 11 | 102 | 0 | 6 | 0 |

## By tier: present / rules / contender

| kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government | 150/150/8 | 150/150/8 | 150/150/6 | 34/33/3 | 94/94/0 | 104/103/0 |
| noble | 3/0/3 | 47/0/39 | 31/0/12 | 136/15/23 | 150/0/32 | 150/0/36 |
| military | 20/0/20 | 150/0/149 | 150/0/108 | 150/0/139 | 150/0/147 | 150/0/147 |
| merchant | 0/0/0 | 14/0/14 | 54/0/50 | 150/45/137 | 150/56/128 | 150/47/125 |
| religious | 29/0/29 | 36/0/36 | 150/0/150 | 150/0/139 | 150/0/127 | 150/0/104 |
| criminal | 0/0/0 | 0/0/0 | 0/0/0 | 10/0/0 | 129/0/0 | 149/0/0 |
| arcane | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 150/0/3 | 150/0/28 |
| other | 23/0/23 | 19/0/16 | 23/0/12 | 74/57/2 | 30/0/0 | 25/0/0 |

## The cut: a left-out power against the third contender (towns with a full field, power ≥ 5)

| kind | power p10 / p50 / p90 (not ruling) | third contender's weight, median | gap to the third (weight), p10 / p50 / p90 |
|---|---|---|---|
| government | 9.6 / 17 / 61 | 12.5 | 0.55 / 1.55 / 5.5 |
| noble | 8 / 10 / 16 | 13 | 1 / 2 / 7.6 |
| military | 10 / 14 / 24 | 15.7 | 0.52 / 6.42 / 7.4 |
| merchant | 8 / 13 / 20 | 13 | 2.45 / 4.45 / 6.95 |
| religious | 11 / 16 / 46 | 12.35 | 0.25 / 1.35 / 3 |
| criminal | 5 / 5 / 9 | – | – / – / – |
| arcane | 7 / 10 / 11 | 12 | 0.5 / 1.85 / 5.99 |
| other | 5 / 11 / 37.9 | 13 | 1.35 / 5.13 / 10.79 |

## The backing catalogue's reading (reads craft off the name)

| kind | present | rules | contender |
|---|---|---|---|
| government | 682 | 680 | 25 |
| noble | 517 | 15 | 145 |
| military | 770 | 0 | 710 |
| merchant | 518 | 148 | 454 |
| religious | 665 | 0 | 585 |
| criminal | 288 | 0 | 0 |
| arcane | 300 | 0 | 31 |
| craft | 504 | 0 | 35 |
| other | 194 | 57 | 53 |

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
- noble: Noble Families 150 · Noble Houses 150 · Landed Gentry 131 · Manor Household 78 · Feudal Appointee 15 · The Highborn Circle 15 · The Peerage 15 · Crown Creditors (Noble Coalition) 2
- military: Military/Guard 472 · Military Party 275 · War Council 59 · Monster Hunters / Adventurers 19 · Occupation Authority 10 · Resistance Network 10
- merchant: Merchant Guilds 515 · Craft Guilds 504 · Merchant oligarchy 44 · Merchant Guild Council 32 · Grand Merchant Oligarchy 25 · Guild Council 25 · Grand Guild Consortium 22 · Grain Holders 6
- religious: Religious Authorities 661 · Reform Congregation 15 · New Faith Community 8
- criminal: Thieves' Guild 288
- arcane: Arcane Orders 300
- other: Town Mayor 57 · Peace Movement 39 · The Independent Bloc 34 · Creditor's Representative 28 · Third Bloc (Neutrals) 20 · Newcomers' Settlement 19 · The Inquiry 18 · Journeymen's League 2 · Reform Movement 2

Craft-named powers as each reader reads them: Craft Guilds -> coup:merchant backing:craft category:economy (504)

## The field

- all: contenders per town 0:80 1:99 2:143 3:578; incumbent gated 798/900
- thorp: contenders per town 0:80 1:46 2:23 3:1; incumbent gated 149/150
- hamlet: contenders per town 1:53 2:66 3:31; incumbent gated 138/150
- village: contenders per town 2:54 3:96; incumbent gated 104/150
- town: contenders per town 3:150; incumbent gated 120/150
- city: contenders per town 3:150; incumbent gated 143/150
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

- arabic (77): government 59/59/5 · noble 40/1/11 · military 60/0/56 · merchant 40/11/37 · religious 53/0/48 · criminal 17/0/0 · arcane 18/0/2 · other 13/6/1
- celtic (81): government 65/65/1 · noble 44/2/15 · military 68/0/65 · merchant 43/10/41 · religious 58/0/48 · criminal 25/0/0 · arcane 25/0/1 · other 13/4/5
- east_asian (81): government 54/54/3 · noble 54/3/14 · military 71/0/67 · merchant 52/19/47 · religious 64/0/52 · criminal 29/0/0 · arcane 31/0/5 · other 14/5/2
- germanic (83): government 60/60/1 · noble 48/1/11 · military 70/0/60 · merchant 56/17/49 · religious 59/0/51 · criminal 29/0/0 · arcane 32/0/2 · other 18/5/4
- greek (78): government 59/58/2 · noble 47/0/16 · military 64/0/60 · merchant 44/17/34 · religious 55/0/51 · criminal 28/0/0 · arcane 26/0/3 · other 14/3/5
- latin (93): government 66/66/1 · noble 52/2/10 · military 82/0/78 · merchant 53/16/51 · religious 73/0/64 · criminal 30/0/0 · arcane 31/0/4 · other 22/9/6
- mesoamerican (86): government 65/64/6 · noble 44/1/9 · military 75/0/70 · merchant 48/17/41 · religious 65/0/59 · criminal 25/0/0 · arcane 26/0/2 · other 18/4/4
- norse (72): government 58/58/2 · noble 42/1/13 · military 63/0/56 · merchant 44/8/40 · religious 55/0/48 · criminal 26/0/0 · arcane 27/0/2 · other 18/5/4
- slavic (92): government 74/74/0 · noble 53/2/18 · military 76/0/69 · merchant 50/9/40 · religious 65/0/56 · criminal 27/0/0 · arcane 27/0/5 · other 24/7/6
- south_asian (76): government 57/57/3 · noble 49/2/13 · military 70/0/64 · merchant 47/11/39 · religious 62/0/57 · criminal 29/0/0 · arcane 31/0/3 · other 19/6/7
- steppe (81): government 65/65/1 · noble 44/0/15 · military 71/0/65 · merchant 41/13/35 · religious 56/0/51 · criminal 23/0/0 · arcane 26/0/2 · other 21/3/9
