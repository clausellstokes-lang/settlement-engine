# The seat's own kind, arm presets (960 born towns, 0 errors, 0 with no seat-holder)

Executed: `node docs/chair/2026-11-20/content/seat/measure-kin.mjs --arm presets --n 10`. Kind of the seat = `backingArchetypeOf` (craft read off the name). Raw: `kin-presets-v1.json`.

## (a) Per kind of seat

| seat kind | seats | rulingKindOf null (no house test, no fold) | a same-kind power stands beside it | that power is one of the 3 contenders | the seat-holder is that power's first member | …and it contends |
|---|---|---|---|---|---|---|
| government | 579 | 579 | 15 | 14 | 0 | 0 |
| merchant | 179 | 0 | 178 | 157 | 87 | 76 |
| religious | 85 | 0 | 85 | 85 | 0 | 0 |
| military | 61 | 0 | 61 | 61 | 0 | 0 |
| criminal | 22 | 22 | 18 | 0 | 0 | 0 |
| arcane | 20 | 0 | 20 | 20 | 0 | 0 |
| noble | 12 | 0 | 12 | 10 | 12 | 10 |
| other | 2 | 2 | 0 | 0 | 0 | 0 |

## (b) Body × same-kind power beside it

- Merchant oligarchy | Merchant Guilds (contends): 40
- Guild Council | Merchant Guilds (contends): 35
- Church Council | Religious Authorities (contends): 31
- Priestly Guidance | Religious Authorities (contends): 30
- Military Council | Military/Guard (contends): 29
- Grand Merchant Oligarchy | Merchant Guilds (contends): 23
- Merchant Guild Council | Merchant Guilds (contends): 19
- Military City Council | Military/Guard (contends): 18
- Grand Military Council | Military/Guard (contends): 14
- Arcane Council | Arcane Orders (contends): 13
- Ecclesiastical Council | Religious Authorities (contends): 13
- Grand Guild Consortium | Merchant Guilds (contends): 12
- Merchant Council | Merchant Guilds (contends): 12
- High Theocratic Council | Religious Authorities (contends): 11
- Feudal Appointee | Landed Gentry (contends): 10
- Grand Merchant Senate | Merchant Guilds (contends): 9
- Corrupt Council | Thieves' Guild: 8
- Guild Council | Merchant Guilds: 8
- Arcane Senate | Arcane Orders (contends): 7
- Merchant City Council | Merchant Guilds (contends): 7
- Corrupt City Council | Thieves' Guild: 6
- Grand Guild Consortium | Merchant Guilds: 4
- Merchant Guild Council | Merchant Guilds: 4
- Shadow Senate | Thieves' Guild: 4
- Grand Merchant Oligarchy | Merchant Guilds: 3
- Military Council | War Council (contends): 3
- Elder Council | Quarantine Council (contends): 2
- Feudal Appointee | Landed Gentry: 2
- Feudal Stewardship | Quarantine Council (contends): 2
- Free Elder Council | Quarantine Council (contends): 2
- Grand Military Council | War Council (contends): 2
- Household Council | People's Council (contends): 2
- City-State Council | Quarantine Council: 1
- Ducal Governorship | People's Council (contends): 1
- Ecclesiastical Council | Reform Congregation: 1
- Elder Council | People's Council (contends): 1
- Feudal Stewardship | People's Council (contends): 1
- Free Elder Council | People's Council (contends): 1
- Guild Council | Grain Holders: 1
- Headman's Authority | People's Council (contends): 1
- Headman's Authority | Quarantine Council (contends): 1
- Merchant Council | Merchant Guilds: 1
- Merchant oligarchy | Merchant Guilds: 1
- Military Council | Monster Hunters / Adventurers: 1
- Priestly Guidance | Conversion Enforcement Office (contends): 1
- Priestly Guidance | Underground Old Faith: 1

## (c) Form × the kind of the power the seat-holder heads

- Elder Council x (holder heads no other power): 174
- Household Council x (holder heads no other power): 84
- Headman's Authority x (holder heads no other power): 43
- Free Elder Council x (holder heads no other power): 37
- Merchant oligarchy x (holder heads no other power): 34
- Church Council x (holder heads no other power): 31
- Priestly Guidance x (holder heads no other power): 30
- Ducal Governorship x noble (Noble Houses): 29
- Feudal Stewardship x noble (Manor Household): 29
- Military Council x (holder heads no other power): 29
- Royal Authority x (holder heads no other power): 29
- Feudal Stewardship x (holder heads no other power): 28
- Grand Merchant Oligarchy x merchant (Merchant Guilds): 26
- Noble Governorship x noble (Noble Families): 26
- Merchant Guild Council x (holder heads no other power): 24
- Guild Council x merchant (Merchant Guilds): 23
- Democratic assembly x merchant (Merchant Guilds): 22
- Guild Council x (holder heads no other power): 20
- City-State Council x merchant (Merchant Guilds): 18
- Military City Council x (holder heads no other power): 18
- Elder Council x merchant (Merchant Guilds): 17
- Grand Guild Consortium x merchant (Merchant Guilds): 16
- Grand Military Council x (holder heads no other power): 14
- Arcane Council x (holder heads no other power): 13
- Ecclesiastical Council x (holder heads no other power): 13
- Elected Reeve x (holder heads no other power): 13
- Corrupt Council x (holder heads no other power): 12
- Feudal Appointee x noble (Landed Gentry): 12
- High Theocratic Council x (holder heads no other power): 11
- Grand Merchant Senate x merchant (Merchant Guilds): 9
- Household Council x merchant (Merchant Guilds): 8
- Arcane Senate x (holder heads no other power): 7
- Merchant City Council x (holder heads no other power): 7
- Merchant Council x (holder heads no other power): 7
- Merchant oligarchy x merchant (Merchant Guilds): 7
- Corrupt City Council x (holder heads no other power): 6
- Elected Reeve x merchant (Merchant Guilds): 6
- Headman's Authority x merchant (Merchant Guilds): 6
- Merchant Council x merchant (Merchant Guilds): 6
- Shadow Senate x (holder heads no other power): 4
- Democratic assembly x (holder heads no other power): 2
- Democratic assembly x craft (Craft Guilds): 2
- Headman's Authority x military (Military Party): 2
- Town Mayor x craft (Craft Guilds): 2
- Elder Council x military (Military Party): 1
- Elder Council x military (Military/Guard): 1
- Free Elder Council x merchant (Merchant Guilds): 1
- Noble Governorship x (holder heads no other power): 1

## Form × its own kind (backing / coup reading)

- Elder Council -> backing:government coup:government: 193
- Household Council -> backing:government coup:government: 92
- Feudal Stewardship -> backing:government coup:government: 57
- Headman's Authority -> backing:government coup:government: 51
- Guild Council -> backing:merchant coup:merchant: 43
- Merchant oligarchy -> backing:merchant coup:merchant: 41
- Free Elder Council -> backing:government coup:government: 38
- Church Council -> backing:religious coup:religious: 31
- Priestly Guidance -> backing:religious coup:religious: 30
- Ducal Governorship -> backing:government coup:government: 29
- Military Council -> backing:military coup:military: 29
- Royal Authority -> backing:government coup:government: 29
- Noble Governorship -> backing:government coup:government: 27
- Democratic assembly -> backing:government coup:government: 26
- Grand Merchant Oligarchy -> backing:merchant coup:merchant: 26
- Merchant Guild Council -> backing:merchant coup:merchant: 24
- Elected Reeve -> backing:government coup:government: 19
- City-State Council -> backing:government coup:government: 18
- Military City Council -> backing:military coup:military: 18
- Grand Guild Consortium -> backing:merchant coup:merchant: 16
- Grand Military Council -> backing:military coup:military: 14
- Arcane Council -> backing:arcane coup:arcane: 13
- Ecclesiastical Council -> backing:religious coup:religious: 13
- Merchant Council -> backing:merchant coup:merchant: 13
- Corrupt Council -> backing:criminal coup:criminal: 12
- Feudal Appointee -> backing:noble coup:noble: 12
- High Theocratic Council -> backing:religious coup:religious: 11
- Grand Merchant Senate -> backing:merchant coup:merchant: 9
- Arcane Senate -> backing:arcane coup:arcane: 7
- Merchant City Council -> backing:merchant coup:merchant: 7
- Corrupt City Council -> backing:criminal coup:criminal: 6
- Shadow Senate -> backing:criminal coup:criminal: 4
- Town Mayor -> backing:other coup:other: 2

## Form × rulingKindOf

- Elder Council -> rulingKindOf:(none: civic/other): 193
- Household Council -> rulingKindOf:(none: civic/other): 92
- Feudal Stewardship -> rulingKindOf:(none: civic/other): 57
- Headman's Authority -> rulingKindOf:(none: civic/other): 51
- Guild Council -> rulingKindOf:merchant: 43
- Merchant oligarchy -> rulingKindOf:merchant: 41
- Free Elder Council -> rulingKindOf:(none: civic/other): 38
- Church Council -> rulingKindOf:religious: 31
- Priestly Guidance -> rulingKindOf:religious: 30
- Ducal Governorship -> rulingKindOf:(none: civic/other): 29
- Military Council -> rulingKindOf:military: 29
- Royal Authority -> rulingKindOf:(none: civic/other): 29
- Noble Governorship -> rulingKindOf:(none: civic/other): 27
- Democratic assembly -> rulingKindOf:(none: civic/other): 26
- Grand Merchant Oligarchy -> rulingKindOf:merchant: 26
- Merchant Guild Council -> rulingKindOf:merchant: 24
- Elected Reeve -> rulingKindOf:(none: civic/other): 19
- City-State Council -> rulingKindOf:(none: civic/other): 18
- Military City Council -> rulingKindOf:military: 18
- Grand Guild Consortium -> rulingKindOf:merchant: 16
- Grand Military Council -> rulingKindOf:military: 14
- Arcane Council -> rulingKindOf:arcane: 13
- Ecclesiastical Council -> rulingKindOf:religious: 13
- Merchant Council -> rulingKindOf:merchant: 13
- Corrupt Council -> rulingKindOf:(none: civic/other): 12
- Feudal Appointee -> rulingKindOf:noble: 12
- High Theocratic Council -> rulingKindOf:religious: 11
- Grand Merchant Senate -> rulingKindOf:merchant: 9
- Arcane Senate -> rulingKindOf:arcane: 7
- Merchant City Council -> rulingKindOf:merchant: 7
- Corrupt City Council -> rulingKindOf:(none: civic/other): 6
- Shadow Senate -> rulingKindOf:(none: civic/other): 4
- Town Mayor -> rulingKindOf:(none: civic/other): 2
