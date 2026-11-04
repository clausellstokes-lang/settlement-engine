# F1 DEFENCE-WORDS: the split of kind 4 and the lane's record (2026-11-04)

> A dated lane record. Branch `lane/rung1b-f1-defence-words-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `f9ce225c5`. It answers `docs/SOAK_1000_RUNG1B_2026-11-04.md` §5 F1. Counts are settlements out of 1,000 on the rung corpus (`node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/f1-base`, 224 s, 0 errors).

## 1. The base reproduces rung 1B

`coh:defense-words` stands in **534** settlements at the base (3,256 findings across surfaces): thorp 87, hamlet 107, village 111, town 158, city 50, metropolis 21.

## 2. The split, by writer and shape

Each finding was sorted by its quote into one writer (one shape per row; a settlement counts once per row, and one settlement can sit in several rows). Buckets: **a** instrument reach (a flagged word that is not a defence claim); **b** a sentence that claims a force, walls or a commander the record does not hold; **h** the hospital words the check also carries (a claim about a house, not a defence; sorted on their own so the chair can see them); **U** unsorted.

Settlements touched per bucket: **a 363 · b 320 · h 121 · U 11**. Settlements whose every finding is bucket a: **145**; a or h: 213.

Bucket **c**, the catalogue gap below town (no watch row in the village catalogue), causes no sentence by itself. It is the reason a village's "watch" or "garrison" words have no row to stand on, and the reason the slider cannot raise a watch below town. The hamlet and village **militia rows already exist** (`institutionalCatalog.js`, the `Citizen militia` family: hamlet 0.15, village 0.22, thorp `Household levy` 0.18, each ×slider/50), so the brief's "Hamlet militia" row is already the catalogue's; see §4 unit 3.

| settlements | bucket | writer / shape |
|---|---|---|
| 131 | b | supplyChainData.js :: garrison chain label "Standing Garrison" |
| 118 | b | spatialGenerator.js :: LAYOUT_BY_TIER walled layouts |
| 90 | a | npcData goal "Found an institution (a hospital, a school)" |
| 70 | a | trade/service customers named generically (supply to garrisons, clothing for soldiers, hire soldiers) |
| 68 | b | factionStanding.js :: "The garrison handles bodies" / "garrison can arrest" |
| 64 | b | economicState.js :: Property Rents "within the walls" |
| 60 | h | factionDynamics.js :: "Merchants fund churches, endow hospitals" |
| 56 | a | narrativeGenerator.js :: founder "a discharged soldier" |
| 50 | b | stressFactions.js / faction desc soldiers |
| 43 | h | services "Hospital & Surgery" row |
| 37 | b | hook soldiers (npcData plot hooks) |
| 36 | b | historyGenerator.js :: stone construction "Walls, civic buildings" |
| 36 | a | walls of a building / regional quarry trade |
| 32 | b | Garrison Commander role (npcGenerator stress/pool roles) |
| 31 | a | role name Veteran/Wounded Soldier (one person) |
| 25 | b | narrativeData.js :: "these walls"/"inside the walls" |
| 24 | b | npcData.js :: hook "road toll for the garrison" |
| 21 | b | stress/overview siege prose (walls held, people on the walls, siege arithmetic) |
| 20 | h | catalog desc "May operate hospital/school" |
| 17 | b | religion wartime "soldiers praying before departure" |
| 15 | h | rulingStructure.js :: "hospital networks" |
| 14 | a | retired soldiers / veteran lodge (people, not a force) |
| 14 | a | one soldier / old soldiers as customers or patrons (people, not a force) |
| 13 | b | stress overview soldiers/garrison (gate, streets, patrols) |
| 13 | b | catalog desc adventurers hall "when the garrison falls short/cannot" |
| 12 | b | narrativeData.js :: "There are soldiers on X's streets" |
| 8 | a | modal hospital ("may keep / sometimes runs a hospital or school") |
| 6 | U | walls |
| 5 | U | garrison |
| 4 | b | wartime NPC goal "conscription pulls away experienced soldiers" |
| 4 | b | smuggling service "beneath the walls" |
| 4 | a | free company hall desc "garrison work" (its own trade; and `defenseInstitutionBuckets.js :: DEFENSE_BUCKET_KEYWORDS.mercenary` does not match "Free company hall", so the hall's own "soldiers" read as absent) |
| 2 | b | war/raid defence lead "holds the garrison's office" |
| 2 | a | "walled" enclosure (a building) |
| 1 | U | soldiers |

The reading of the big rows:
- **a, the reach rules** (unit 4): one soldier is a person, not a force ("a discharged soldier", "Veteran Soldier", "retired/old soldiers"); `walled` qualifying a building (a burial plot, a caravanserai compound) is that building's wall; the walls of a building or of the region's trade ("sealed inside the walls during construction", "the walls and churches of half the region"); a hedged hospital ("may keep a hospital or school"; the goal "Found an institution (a hospital, a school)"); a trade naming its customers in general ("supply of bows and arrows to garrison and militia", "clothing for soldiers and servants", a free company's "garrison work").
- **b, the claim writers** (unit 2): the garrison chain's label, the layout lines, the faction-standing garrison sentences, the property-rent line, the stress-faction soldiers, the hooks, the stone-construction history, the Garrison Commander, "these walls", the siege and stress overview lines, the wartime faith line, the adventurers' hall desc.
- **h**: "endow hospitals" (60), the hospital chain's label "Hospital & Surgery" (43), "hospital networks" (15) are claims of a house the place lacks; "May operate hospital/school" (20) and the founder goal are hedged and go with bucket a.
