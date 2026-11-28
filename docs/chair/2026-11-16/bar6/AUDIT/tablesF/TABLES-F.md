# LAW 10 · tables (BAR6-AUDIT-F)

Populations: 150 (150 towns) · 720 (720 towns) · 300 (300 towns). Cells: towns / instances / distinct lines.

| rule | 150 | 720 | 300 | wrote the false line | holds the fact |
|---|---|---|---|---|---|
| 10a | 1 / 3 / 3 | 0 | 1 / 3 / 3 | src/domain/people/allegiance.js :: dealAllegiances / allegiancePowerFor (the agent's power) | npcs[].memberships (landMemberships, then rankPowers: castPowers.js) |
| 10b | 1 / 1 / 1 | 2 / 2 / 1 | 4 / 4 / 1 | src/generators/safetyProfile.js :: generateSafetyProfile (the crusader hook, drawn before any person is born) | npcs[].gender of the role's holder (the roster) |
| 10c | 7 / 14 / 8 | 36 / 72 / 37 | 11 / 22 / 13 | src/data/faceHonorifics.js :: honorificOfTitle (FACE_HONORIFICS_INLAND: "the harbour master" -> Dockmaster | Wharfinger) | npcs[].title and the house of the other holder (the roster) |
| 10d-purse | 1 / 1 / 1 | 2 / 2 / 2 | 0 | src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence ("borrowed … every year since") | the economy desk DS-ECO-8 MODERATE (the treasury's yearly balance: the prosperity band) |
| 10d-seat | 2 / 2 / 2 | 6 / 6 / 6 | 2 / 2 / 2 | src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence ("has asked for a seat on the council"; ties.js :: createTieProseDraw) | npcs[].memberships of the asker (the seat) |
| 10e-house | 2 / 2 / 1 | 0 | 0 | src/data/people/titleSecretsPresentations.js :: TITLE_SECRETS["the watch sergeant"] | src/domain/facts/guardPay.js :: watchIsUnpaidRota (the house card: institutionDescVariants.js) |
| 10e-pay | 1 / 1 / 1 | 0 | 0 | src/generators/safetyProfile.js (the guard assessment, keyed on militaryEffective and the economy priority) | the watch commander's constraint (npc structure) and guardPay.js |
| 10e-temper | 4 / 4 / 3 | 15 / 15 / 10 | 12 / 13 / 9 | the secret overlay (src/data/stressInstitutionEffects.js; titleSecretsPresentations.js) drawn after the personality (npcData.js NPC_PERSONALITY_TRAITS) | npcs[].personality.dominant |
| 10e-temper-honest | 4 / 4 / 4 | 11 / 11 / 8 | 8 / 8 / 5 | the same draws as 10e-temper | npcs[].personality.dominant |
| 10e-temper-manner | 5 / 5 / 3 | 14 / 14 / 11 | 8 / 8 / 8 | (apart, not law) the same draws as 10e-temper | npcs[].personality.dominant |
| 10f-backs | 5 / 5 / 4 | 28 / 28 / 10 | 15 / 15 / 7 | src/domain/dossier/powerSupport.js :: houseBacksOf (catalogue backing shares; data/institutionBacking.js) | powerStructure.conflicts (high) and the ruler's seat |
| 10f-backs-wide | 20 / 37 / 35 | 115 / 195 / 112 | 45 / 87 / 62 | src/domain/dossier/powerSupport.js :: houseBacksOf | powerStructure.conflicts |
| 10f-kind | 3 / 3 / 2 | 8 / 8 / 2 | 0 | src/generators/power/rulingStructure.js :: generatePowerStructure (govDescByLabel[govBody] from house names) | powerStructure.factions[governing].category |
| 10f-tier | 1 / 1 / 1 | 2 / 2 / 1 | 1 / 1 / 1 | src/generators/power/rulingStructure.js (the merchant desc keyed on power thresholds, never the tier) | record.tier |
| 10f-weight | 1 / 1 / 1 | 1 / 1 / 1 | 0 | src/generators/power/factionStanding.js :: annotateFactionStanding (keyed on the merchant category's power) | powerStructure.factions[].power of the power it names |
| 10g-legacy | 6 / 6 / 6 | 24 / 24 / 24 | 6 / 6 / 6 | src/data/dossierStateProse/general.generated.js DS-GEN-16 LEGACY-RECOVERED v2 (legacyPoolKey: generalStateProse.js) | history.historicalEvents[].type / templateType of legacyAnnotations[0] |
| 10g-legacy-answer | 1 / 1 / 1 | 4 / 4 / 4 | 1 / 1 / 1 | the same pool, v1 | the same |
| 10g-legacy-ruin | 0 | 6 / 6 / 6 | 3 / 3 / 3 | (apart, not law) DS-GEN-16 LEGACY-RECOVERED v2 after a crash or a trade collapse | history.historicalEvents[].templateType |
| 10g-span | 1 / 1 / 1 | 0 | 0 | src/generators/historyTemplate.js :: buildCurrentTensionTokens (the tension's duration fixed at "three") | history.historicalEvents[].description (historyGenerator.js: randInt(1,5)) |
| 10h | 2 / 2 / 2 | 5 / 5 / 5 | 4 / 4 / 4 | src/domain/dossier/hookLines.js :: hookPartyOf (the raw conflict party name) | src/data/people/powerSentenceName.js :: powerSentenceName (PROSE_FORMS) |

## 10b · the commonest distinct lines in the 720 (1 distinct)

- 2 town(s) · The garrison chaplain and the commander are the same man. He's authorizing military action for reasons that sound theological. · e.g. r2r-metropolis-16, r2r-metropolis-29

## 10c · the commonest distinct lines in the 720 (37 distinct)

- 36 town(s) · Wharfinger · e.g. r2r-city-31, r2r-city-35, r2r-city-40
- 1 town(s) · Connection: Wharfinger Aengus Sweetman · e.g. r2r-city-6
- 1 town(s) · Connection: Wharfinger Basilissa Chortasmenos · e.g. r2s-occupied-metropolis-0
- 1 town(s) · Connection: Wharfinger Bayasgalan Geniges · e.g. r2s-indebted-city-1
- 1 town(s) · Connection: Wharfinger Claudius Rutilius · e.g. r2s-mass_migration-metropolis-2
- 1 town(s) · Connection: Wharfinger Daniyya Tut · e.g. r2s-wartime-city-3
- 1 town(s) · Connection: Wharfinger Decimia Serranus · e.g. r2r-city-35
- 1 town(s) · Connection: Wharfinger Devraj Sahni · e.g. r2r-metropolis-9
- 1 town(s) · Connection: Wharfinger Fabia Dentatus · e.g. r2s-slave_revolt-city-1
- 1 town(s) · Connection: Wharfinger Gancho Nikolayev · e.g. r2r-town-29
- 1 town(s) · Connection: Wharfinger Ghalia ibn Rushd · e.g. r2s-monster_pressure-metropolis-2
- 1 town(s) · Connection: Wharfinger Jamal al-Omani · e.g. r2s-succession_void-metropolis-2
- 1 town(s) · Connection: Wharfinger Jun Ito · e.g. r2r-city-40
- 1 town(s) · Connection: Wharfinger Kadan Naiman · e.g. r2s-politically_fractured-metropolis-1
- 1 town(s) · Connection: Wharfinger Kai Tanaka · e.g. r2s-politically_fractured-city-1
- 1 town(s) · Connection: Wharfinger Livia Piso · e.g. r2r-town-21
- 1 town(s) · Connection: Wharfinger Manouel Vryennios · e.g. r2r-metropolis-39
- 1 town(s) · Connection: Wharfinger Marina Sidorov · e.g. r2s-wartime-metropolis-1
- 1 town(s) · Connection: Wharfinger Megingoz Schäfer · e.g. r2r-town-31
- 1 town(s) · Connection: Wharfinger Naya Seljuk · e.g. r2r-city-41
- 1 town(s) · Connection: Wharfinger Oh Sato · e.g. r2s-mass_migration-metropolis-0
- 1 town(s) · Connection: Wharfinger Petrissa Fink · e.g. r2r-metropolis-12
- 1 town(s) · Connection: Wharfinger Ravilla Varro · e.g. r2s-monster_pressure-city-3
- 1 town(s) · Connection: Wharfinger Romanos Comnenus · e.g. r2r-town-35
- 1 town(s) · Connection: Wharfinger Ronan MacEwan · e.g. r2r-metropolis-50
- 1 town(s) · Connection: Wharfinger Samira al-Bukhari · e.g. r2s-infiltrated-city-2
- 1 town(s) · Connection: Wharfinger Siegfried Schneider · e.g. r2s-wartime-town-3
- 1 town(s) · Connection: Wharfinger Skallag Magnrsson · e.g. r2r-city-31
- 1 town(s) · Connection: Wharfinger Sofia Semyonov · e.g. r2r-metropolis-51
- 1 town(s) · Connection: Wharfinger Sulayman al-Hakim · e.g. r2s-monster_pressure-city-0

## 10d-purse · the commonest distinct lines in the 720 (2 distinct)

- 1 town(s) · Hana al-Rifai's treasury borrowed from Lubna al-Basri to cover a bad harvest and has borrowed every year since. The interest is paid before the wages. · e.g. r2r-metropolis-44
- 1 town(s) · Oh Inoue's treasury borrowed from Chiyo Jung to cover a bad harvest and has borrowed every year since. The interest is paid before the wages. · e.g. r2s-politically_fractured-city-1

## 10d-seat · the commonest distinct lines in the 720 (6 distinct)

- 1 town(s) · Chagatai Qatagin has asked for a seat on the council as a condition of the next loan. Dogshin Tanghud has three weeks to answer. · e.g. r2r-metropolis-29
- 1 town(s) · Chiyo Jung has asked for a seat on the council as a condition of the next loan. Oh Inoue has three weeks to answer. · e.g. r2s-politically_fractured-city-1
- 1 town(s) · Nataliya Golubev has asked for a seat on the council as a condition of the next loan. Todor Marković has three weeks to answer. · e.g. r2r-city-30
- 1 town(s) · Raghuvir Roy has asked for a seat on the council as a condition of the next loan. Suvarchala Panda has three weeks to answer. · e.g. r2r-town-47
- 1 town(s) · Vira Vorobev has asked for a seat on the council as a condition of the next loan. Frantisek Nikitin has three weeks to answer. · e.g. r2r-city-39
- 1 town(s) · Wicher Naumann has asked for a seat on the council as a condition of the next loan. Peregrina Kaiser has three weeks to answer. · e.g. r2r-metropolis-12

## 10e-temper · the commonest distinct lines in the 720 (10 distinct)

- 6 town(s) · Temperament: incorruptible · e.g. r2r-city-34, r2r-metropolis-13, r2r-metropolis-33
- 1 town(s) · Flaw: bitter Temperament: incorruptible · e.g. r2s-indebted-village-2
- 1 town(s) · Flaw: imperious Temperament: incorruptible · e.g. r2s-monster_pressure-metropolis-3
- 1 town(s) · Flaw: mendacious Temperament: incorruptible · e.g. r2s-wartime-metropolis-3
- 1 town(s) · Flaw: paranoid Temperament: incorruptible · e.g. r2s-infiltrated-metropolis-1
- 1 town(s) · Flaw: petty Temperament: incorruptible · e.g. r2s-mass_migration-town-1
- 1 town(s) · Flaw: reckless Temperament: incorruptible · e.g. r2s-indebted-hamlet-0
- 1 town(s) · Flaw: stubborn Temperament: incorruptible · e.g. r2s-wartime-city-3
- 1 town(s) · Flaw: suspicious Temperament: incorruptible · e.g. r2s-politically_fractured-city-3
- 1 town(s) · Flaw: vain Temperament: incorruptible · e.g. r2r-city-16

## 10e-temper-honest · the commonest distinct lines in the 720 (8 distinct)

- 2 town(s) · Flaw: arrogant Temperament: plain-dealing · e.g. r2r-town-15, r2s-occupied-metropolis-1
- 2 town(s) · Temperament: honest · e.g. r2r-city-47, r2r-metropolis-56
- 2 town(s) · Temperament: plain-dealing · e.g. r2r-city-18, r2r-metropolis-50
- 1 town(s) · Flaw: petty Temperament: honest · e.g. r2s-infiltrated-metropolis-3
- 1 town(s) · Flaw: self-serving Temperament: honest · e.g. r2r-metropolis-15
- 1 town(s) · Flaw: suspicious Temperament: plain-dealing · e.g. r2r-town-59
- 1 town(s) · Flaw: vindictive Temperament: honest · e.g. r2r-town-13
- 1 town(s) · Flaw: volatile Temperament: plain-dealing · e.g. r2r-city-51

## 10e-temper-manner · the commonest distinct lines in the 720 (11 distinct)

- 2 town(s) · Flaw: callous Temperament: forthright · e.g. r2s-religious_conversion-town-0, r2s-wartime-town-2
- 2 town(s) · Temperament: candid · e.g. r2r-city-36, r2r-metropolis-24
- 2 town(s) · Temperament: forthright · e.g. r2r-town-3, r2s-mass_migration-metropolis-1
- 1 town(s) · Flaw: arrogant Temperament: forthright · e.g. r2r-metropolis-3
- 1 town(s) · Flaw: domineering Temperament: candid · e.g. r2s-occupied-city-1
- 1 town(s) · Flaw: domineering Temperament: forthright · e.g. r2r-metropolis-37
- 1 town(s) · Flaw: lazy Temperament: candid · e.g. r2s-infiltrated-metropolis-0
- 1 town(s) · Flaw: overbearing Temperament: candid · e.g. r2s-recently_betrayed-city-0
- 1 town(s) · Flaw: paranoid Temperament: candid · e.g. r2s-succession_void-metropolis-3
- 1 town(s) · Flaw: vain Temperament: forthright · e.g. r2r-city-56
- 1 town(s) · Flaw: volatile Temperament: forthright · e.g. r2r-metropolis-58

## 10f-backs · the commonest distinct lines in the 720 (10 distinct)

- 8 town(s) · Backs · Craft Guilds · Grand Guild Consortium · e.g. r2r-metropolis-17, r2r-metropolis-49, r2r-metropolis-5
- 5 town(s) · Backs · Merchant Guilds · Merchant oligarchy · e.g. r2r-city-11, r2r-city-29, r2r-city-55
- 4 town(s) · Backs · Merchant Guild Council · Merchant Guilds · e.g. r2r-city-13, r2r-city-40, r2r-city-7
- 3 town(s) · Backs · Noble Families · Noble Governorship · e.g. r2r-city-42, r2s-monster_pressure-city-0, r2s-plague_onset-city-2
- 2 town(s) · Backs · Craft Guilds · Merchant Guild Council · e.g. r2r-city-41, r2r-city-9
- 2 town(s) · Backs · Merchant Guilds · Grand Merchant Oligarchy · e.g. r2r-metropolis-47, r2s-religious_conversion-metropolis-1
- 1 town(s) · Backs · Craft Guilds · Guild Council · e.g. r2r-town-34
- 1 town(s) · Backs · Guild Council · Merchant Guilds · e.g. r2s-famine-town-0
- 1 town(s) · Backs · Noble Houses · Ducal Governorship · e.g. r2s-politically_fractured-metropolis-2
- 1 town(s) · Backs · Royal Authority · Noble Houses · e.g. r2r-metropolis-31

## 10f-backs-wide · the commonest distinct lines in the 720 (112 distinct)

- 7 town(s) · Backs · City-State Council · Merchant Guilds · e.g. r2r-city-22, r2r-city-26, r2r-city-3
- 6 town(s) · Backs · Ducal Governorship · Merchant Guilds · e.g. r2r-metropolis-21, r2r-metropolis-3, r2r-metropolis-46
- 6 town(s) · Backs · Merchant Guilds · City-State Council · e.g. r2r-city-26, r2r-city-3, r2r-city-52
- 5 town(s) · Backs · High Theocratic Council · Merchant Guilds · e.g. r2r-metropolis-18, r2r-metropolis-2, r2r-metropolis-28
- 5 town(s) · Backs · Merchant Guild Council · Merchant Guilds · e.g. r2r-city-10, r2r-city-13, r2r-city-40
- 5 town(s) · Backs · Merchant Guilds · Merchant Guild Council · e.g. r2r-city-10, r2r-city-13, r2r-city-40
- 5 town(s) · Backs · Merchant oligarchy · Merchant Guilds · e.g. r2r-city-11, r2r-city-29, r2r-city-55
- 4 town(s) · Backs · Merchant Guilds · Royal Authority · e.g. r2r-city-18, r2r-metropolis-56, r2s-mass_migration-metropolis-0
- 4 town(s) · Backs · Royal Authority · Merchant Guilds · e.g. r2r-city-18, r2r-metropolis-56, r2s-mass_migration-metropolis-0
- 3 town(s) · Backs · City Council · Merchant Guilds · e.g. r2r-city-8, r2s-indebted-city-2, r2s-succession_void-city-3
- 3 town(s) · Backs · City-State Council · Arcane Orders · e.g. r2r-metropolis-34, r2s-recently_betrayed-metropolis-1, r2s-slave_revolt-metropolis-0
- 3 town(s) · Backs · Craft Guilds · Grand Council · e.g. r2s-indebted-metropolis-2, r2s-insurgency-metropolis-0, r2s-plague_onset-metropolis-2
- 3 town(s) · Backs · Democratic assembly · Merchant Guilds · e.g. r2r-city-17, r2r-metropolis-57, r2s-wartime-metropolis-0
- 3 town(s) · Backs · Grand Guild Consortium · Merchant Guilds · e.g. r2r-metropolis-44, r2r-metropolis-49, r2s-insurgency-metropolis-1
- 3 town(s) · Backs · Guild Council · Merchant Guilds · e.g. r2r-town-32, r2r-town-52, r2s-famine-town-0
- 3 town(s) · Backs · Merchant Guilds · Ducal Governorship · e.g. r2r-metropolis-21, r2r-metropolis-3, r2r-metropolis-46
- 3 town(s) · Backs · Merchant Guilds · Grand Guild Consortium · e.g. r2r-metropolis-44, r2r-metropolis-49, r2s-insurgency-metropolis-1
- 3 town(s) · Backs · Merchant Guilds · High Theocratic Council · e.g. r2r-metropolis-18, r2r-metropolis-4, r2r-metropolis-40
- 3 town(s) · Backs · Merchant Guilds · Merchant oligarchy · e.g. r2r-city-29, r2r-city-55, r2s-wartime-city-1
- 3 town(s) · Backs · Merchant Guilds · Noble Governorship · e.g. r2r-city-59, r2s-insurgency-city-0, r2s-succession_void-city-2
- 3 town(s) · Backs · Noble Families · Noble Governorship · e.g. r2r-city-42, r2s-monster_pressure-city-0, r2s-plague_onset-city-2
- 3 town(s) · Backs · Noble Governorship · Merchant Guilds · e.g. r2r-city-59, r2s-insurgency-city-0, r2s-succession_void-city-2
- 2 town(s) · Backs · Arcane Council · Merchant Guilds · e.g. r2r-city-24, r2s-politically_fractured-city-1
- 2 town(s) · Backs · Arcane Orders · City-State Council · e.g. r2r-metropolis-34, r2s-slave_revolt-metropolis-0
- 2 town(s) · Backs · Arcane Orders · Religious Authorities · City-State Council · e.g. r2s-recently_betrayed-metropolis-1, r2s-slave_revolt-metropolis-0
- 2 town(s) · Backs · Craft Guilds · Grand Guild Consortium · e.g. r2r-metropolis-5, r2s-insurgency-metropolis-1
- 2 town(s) · Backs · Craft Guilds · Merchant Guild Council · e.g. r2r-city-41, r2r-city-9
- 2 town(s) · Backs · Craft Guilds · Royal Authority · e.g. r2r-metropolis-43, r2s-under_siege-city-0
- 2 town(s) · Backs · Ecclesiastical Council · Merchant Guilds · e.g. r2r-city-36, r2r-city-38
- 2 town(s) · Backs · Grand Merchant Oligarchy · Merchant Guilds · e.g. r2r-metropolis-47, r2s-religious_conversion-metropolis-1

## 10f-kind · the commonest distinct lines in the 720 (2 distinct)

- 6 town(s) · A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs. · e.g. r2r-metropolis-11, r2r-metropolis-18, r2r-metropolis-4
- 2 town(s) · A full council governs the city: aldermen, guild masters and appointed officials see to its taxes, its laws and its streets. · e.g. r2r-city-20, r2s-under_siege-city-1

## 10f-tier · the commonest distinct lines in the 720 (1 distinct)

- 2 town(s) · A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them. · e.g. r2r-metropolis-3, r2r-metropolis-53

## 10f-weight · the commonest distinct lines in the 720 (1 distinct)

- 1 town(s) · Minor landed families with limited political reach; present in civic life but rarely decisive. Close enough to the two above that their support is worth buying; they play The Guard and Grand Merchant Oligarchy against ea · e.g. r2s-religious_conversion-metropolis-1

## 10g-legacy · the commonest distinct lines in the 720 (24 distinct)

- 1 town(s) · Ask about the thorp's present quarrels in Prabhamala and before long somebody brings up the succession crisis. Much of what stands in Prabhamala now was built after the succession crisis, and that legacy is a generation  · e.g. r2r-thorp-33
- 1 town(s) · Much of what stands in Anba now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-metropolis-20
- 1 town(s) · Much of what stands in Beiguan now was built after the economic divide, and that legacy is older than anyone living. · e.g. r2r-metropolis-46
- 1 town(s) · Much of what stands in Brahmamandal now was built after the shortage, and that legacy is older than all but the oldest alive. · e.g. r2r-town-25
- 1 town(s) · Much of what stands in Campoplenum now was built after the economic divide, and that legacy is older than anyone living. · e.g. r2r-town-21
- 1 town(s) · Much of what stands in Darhanordu now was built after the shortage, and that legacy is older than all but the oldest alive. · e.g. r2s-indebted-city-1
- 1 town(s) · Much of what stands in Dharmamandal now was built after the guild war, and that legacy is older than anyone living. · e.g. r2r-city-10
- 1 town(s) · Much of what stands in Erdenkhurel now was built after the succession crisis, and that legacy is a generation old. · e.g. r2r-city-8
- 1 town(s) · Much of what stands in Farosaltus now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-town-46
- 1 town(s) · Much of what stands in Frostnes now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-hamlet-59
- 1 town(s) · Much of what stands in Ingivik now was built after the guild war, and that legacy is older than anyone living. · e.g. r2r-town-28
- 1 town(s) · Much of what stands in Jayagiri now was built after the economic divide, and that legacy is years old. · e.g. r2r-town-4
- 1 town(s) · Much of what stands in Khanhan now was built after the economic divide, and that legacy is older than anyone living. · e.g. r2r-town-53
- 1 town(s) · Much of what stands in Kulubtitlan now was built after the purge, and that legacy is a generation old. · e.g. r2s-succession_void-metropolis-0
- 1 town(s) · Much of what stands in Mahapeth now was built after the guild war, and that legacy is a generation old. · e.g. r2r-town-47
- 1 town(s) · Much of what stands in Olymptopia now was built after the guild war, and that legacy is a generation old. · e.g. r2r-town-2
- 1 town(s) · Much of what stands in Ormberg now was built after the iron dispute, and that legacy is a generation old. · e.g. r2r-town-38
- 1 town(s) · Much of what stands in Stormaker now was built after the economic divide, and that legacy is years old. · e.g. r2s-monster_pressure-metropolis-1
- 1 town(s) · Much of what stands in Sübeteiordu now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-hamlet-15
- 1 town(s) · Much of what stands in Tighleigh now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-town-51
- 1 town(s) · Much of what stands in Ulfstrand now was built after the guild war, and that legacy is a generation old. · e.g. r2r-metropolis-38
- 1 town(s) · Much of what stands in Varapeth now was built after the economic divide, and that legacy is a generation old. · e.g. r2r-metropolis-1
- 1 town(s) · Much of what stands in Vikkvam now was built after the shortage, and that legacy is a generation old. · e.g. r2r-city-31
- 1 town(s) · Much of what stands in Xinxian now was built after the economic divide, and that legacy is older than anyone living. · e.g. r2r-city-2

## 10g-legacy-answer · the commonest distinct lines in the 720 (4 distinct)

- 1 town(s) · Hongpu came through the economic divide, and what the town built in answer still stands, a legacy that is a generation old. · e.g. r2r-town-48
- 1 town(s) · Madinatchowk came through the trade collapse, and what the town built in answer still stands, a legacy that is older than anyone living. · e.g. r2r-town-10
- 1 town(s) · Neuheim came through the economic divide, and what the town built in answer still stands, a legacy that is older than anyone living. · e.g. r2r-town-6
- 1 town(s) · Yunxian came through the economic divide, and what the town built in answer still stands, a legacy that is older than anyone living. · e.g. r2r-town-52

## 10g-legacy-ruin · the commonest distinct lines in the 720 (6 distinct)

- 1 town(s) · Much of what stands in Achillimani now was built after the trade collapse, and that legacy is a generation old. · e.g. r2r-metropolis-24
- 1 town(s) · Much of what stands in Brahmabagh now was built after the crash, and that legacy is older than anyone living. · e.g. r2s-monster_pressure-metropolis-3
- 1 town(s) · Much of what stands in Olympagio now was built after the trade collapse, and that legacy is older than anyone living. · e.g. r2s-infiltrated-city-1
- 1 town(s) · Much of what stands in Ormstrand now was built after the trade collapse, and that legacy is older than anyone living. · e.g. r2s-recently_betrayed-metropolis-0
- 1 town(s) · Much of what stands in Tlalche now was built after the crash, and that legacy is a generation old. · e.g. r2r-village-57
- 1 town(s) · Much of what stands in Vedapeta now was built after the crash, and that legacy is older than anyone living. · e.g. r2r-metropolis-57

## 10h · the commonest distinct lines in the 720 (5 distinct)

- 1 town(s) · A ruling on authority over military conscription lists went Military/Guard's way, and Noble Governorship has simply carried on as though it did not. · e.g. r2s-wartime-city-0
- 1 town(s) · A ruling on control of the requisition enforcement apparatus went Military/Guard's way, and Merchant Guilds have simply carried on as though it did not. · e.g. r2s-wartime-metropolis-3
- 1 town(s) · Ducal Governorship has drawn up names under whether to open back-channel negotiations with the insurgency, and Military/Guard has been quietly telling people how to keep off the list. · e.g. r2s-insurgency-metropolis-3
- 1 town(s) · Military/Guard has undercut Grand Merchant Senate on rights to a lucrative war supply contract at a price that cannot be honest, and nobody has worked out yet where the difference comes from. · e.g. r2s-wartime-metropolis-1
- 1 town(s) · The last thing Military/Guard and its rivals agreed on in Xochiatl was that the disagreement should not be allowed to reach the streets; that agreement is the only thing holding, and it is fraying. · e.g. r2s-politically_fractured-metropolis-0
