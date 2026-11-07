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

## 3. Before and after (unit 5)

`node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/f1-tip` at `ef96bd01`: 262 s, 0 errors.

| class | base `f9ce225c5` | tip `ef96bd01` |
|---|---|---|
| coh:defense-words | 534 | **60** |
| info:battery-would-not-vouch (informational) | 808 | 713 |
| A-09:behaviour-line-share | 7 | 8 (+`soak1k-476`, "resourceful" 2 of 5: a roster draw moved by the generation change, not a defence line) |
| every other class (A-05 977, A-06 16, A-11 14, A-12 1, A-14 1, X-50 30, coh:food-words 3) | | unchanged |

**The residue, 60 settlements, by writer** (none cured here; each is intake for the next defence lane):
- `npcData.js` plot hook "Someone is paying their soldiers more than their salary. The soldiers aren't saying who." (11);
- `dossierStateProse/power.generated.js`, the siege pool's "the walls have settled the argument" (9) and "decided outside the walls rather than inside them" (8): pools-door edits in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`;
- `institutionServices.js`, a civic office's "Walls, wells, roads, and the watch" (9) and the smugglers' "Move people beneath the walls unseen." (4);
- `npcGenerator.js` wartime goal "conscription pulls away experienced soldiers" (6);
- `crisisCast.js :: CAST_REASONS` "holds the garrison's office" (3) and "its people stand on the walls" (3);
- singles: a waystation "behind walls", a "garrison-backed" power line, "a reinforced garrison" in an overview.

## 4. Units

| unit | commit | outcome |
|---|---|---|
| 1 measure and split | `17bde9d9` | this record, §2 |
| 2 one home for defence facts | `2906232d`, `75e60fc9`, `ef96bd01` | the existing reader `src/domain/defense/defenseFacts.js` (no second one minted) gains `hasGate`, `hasCommander`, `forceWordsOf`, the free company as a hired company and the Garrison Commander role need; 19 writers read it; red-first throughout (`tests/generators/defenceClaimWriters.test.js`) |
| 3 the catalogue below town | `22ea53ea` | the Village watch row; the hamlet half is a **STOP**: the hamlet militia row already stands (`Citizen militia`, hamlet 0.15) |
| 4 the instrument | `3072047e` | `scripts/audit/soak-review/defenceReach.mjs`, by rule; real claims stay red |
| 5 the count | this commit | 534 → 60 |

**Unit 3, measured** (60 villages per slider, the density law lit): the Village watch rolls in 1/60 at slider 0, 50 and 100. The chance is 0.2 × slider/50, then × the village density factor (about 0.08 at 150 people to 0.27 at 370), so the row is rare by the budget's own law; the slider-0 watch enters through the stress-raised effective military. At slider 50, 60 of 60 thorps, hamlets, towns, cities and metropolises are byte-identical to the unit-2 commit; 14 of 60 villages move (the row's draw shifts the village stream).

## 5. VETOABLE content (the owner's class)

- The Village watch row: its name, its desc ("Householders who take turns walking the lanes after dark, keep a lantern at the crossroads, and raise the alarm. Unpaid; the headman keeps the rota."), base chance 0.2, its services ("Night watch", "Hue and cry"), backing shares and its ladder rung to the Town watch.
- Chain labels where the house is absent: "Standing Watch" (garrison chain), "Almshouse Care" (hospital chain).
- The open town layouts (seven terrains and the default) and the two open village layouts ("Stone-built village…", "Compact settlement around a central well…"); the mountain town without a garrison drops ", garrison above".
- "…residential plots in the {tier}."; "Land grants, charity, and moral authority…"; "endow charities"; "how much force they can bring here"; "the called-up praying before departure"; "Civic buildings or a cathedral raised from local quarry stone."; the hamlet charter hall's "where no garrison stands" lines.
- The force words: watch → watch / watchmen / watchman; militia → militia / militia / militiaman; none → guard / guards / guard; a hired company → hired company / soldiers / soldier.

## 6. What moves for the landing seat (not re-recorded here)

Generation moves wherever a writer now reads the record: chain labels (`economicState.activeChains[].label`), `spatialLayout.layout`, income-source descs, faction descs and standing lines, relationship descriptions and tensions, NPC roles (no Garrison Commander over a watch), founding stress notes, history event text, institution descs (the hamlet charter hall), and every village roster (the new row's draw). Expected to move: the generator golden master; the `defense*` seed pins; the catalogue and institution censuses and registers (a new row, `village_watch`, a new service key in `institutionServiceKeys.generated.js`, which this lane regenerated with `npm run gen:institution-service-keys`); the line-keyed citation registers for the files whose lines moved (`computeActiveChains.js`, `spatialGenerator.js`, `narrativeGenerator.js`, `npcData.js`, `institutionalCatalog.js`, `institutionServices.js`, `generateSettlementPipeline.js`). The lane's governing-suite run (688 files naming the changed modules, at `2906232d`) had not concluded when this record was written; its reds are PLAUSIBLE until the landing reads them.

## 7. Intake noticed, not done

`narrativeText.js :: PRESSURE_SENTENCES.under_siege` printed "how many days of raw" on `soak1k-348` (a commodity slot filled with `raw`); `institutionVocabulary.js` gives the Citizen militia "Part-time soldiers".

## 8. CONFIRMED vs PLAUSIBLE

**CONFIRMED:** the base and tip counts (read from `artifacts/f1-base` and `artifacts/f1-tip`); every red-first, red before and green after, by its quoted title; the unit-3 rates and the byte-identity of the other tiers. **PLAUSIBLE:** the residue's writer attribution (sorted by quote); the list of suites that move (§6), which the lane did not see concluded.
