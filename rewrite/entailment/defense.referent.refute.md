# REFERENT REFUTE — THE DEFENSE DESK (DS-DEF-1 … DS-DEF-11)

Fable refuter, seat Fable 5.1, against `defense.referent.survey.md` (Opus surveyor). Dock `laneRW-DEFW` at `f2da5a3ee`, READ-ONLY. Every cite re-derived in the dock. Verdict vocabulary: HOLDS · CONDITIONAL (condition stated exactly) · REFUTED (code quoted). Default under doubt: CONDITIONAL or REFUTED.

STATUS: COMPLETE (checkpointed in six writes; §A–§K). Sections planned: §A the engine re-read (what the refuter found that moves rows) · §B verdicts on §1–§2 (the layers) · §C verdicts on §3 (the nouns) · §D verdicts on §4 (the reads) · §E verdicts on §5–§6 (overlaps, slots) · §F verdicts on §7 (visibility) · §G verdicts on §8 (findings) · §H overlaps the surveyor missed · §I missed nouns · §J the law as drafted, tested.

## §A THE ENGINE RE-READ — findings that move rows (written first, checkpoint 1)

A-1. `holderTable.js:317-323`: the WATCH holder KIND's record-keepers in the shipped roster are `Professional city watch, Town watch` (services `Crime reporting · Crime response · Missing persons`). So the ORGAN (holder of `criminalCaptureState`, `safetyProfile`, `blackMarketCapture`) resolves to the SAME institution rows the watch BUCKET holds (`defenseInstitutionBuckets.js:95-97`). "Two things by table" is true of the TABLES; it is ONE row in the town. (Moves: §3.3, O-2, law item 3.)
A-2. `holderTable.js:279-288`: the MUSTER kind's only record-keeper is the `Citizen militia` (`Muster training`); a garrison town without a militia has "men under arms and no roll of them". So a citation of "the muster" as a HOLDER is CONDITIONAL on a live Citizen militia; as a CLASS WORD for the body it is the chair's ruling, not an engine object. (Moves: §3.2 safe words.)
A-3. `holderTable.js:141`: `captured = criminal !== 'none' || faction !== null` — INTERESTED-at-birth fires at `adversarial` and `equilibrium` too, not only `corrupted`/`capture`; but `standingOf:661` reads the WORLD `captureState` as captured only at `corrupted`/`capture`. Two thresholds for "captured". (Moves: §7.1's "while the town is not captured".)
A-4. `holderTable.js:707-708`: `interested` is ALSO true on `corrupt` (the compromised list) and `corruptImpairment` for ANY kind, not only STATE_ORGAN_KINDS. A corruption impairment on a muster holder makes a muster read INTERESTED. (Moves: §4.3 "INTERESTED ... the four organs it reaches".)
A-5. `corruption.js:683-688`: the COVERT set is ALSO fed by a corrupt, un-ousted NPC homed at a security institution (`npcHomeInstitution` = `factionAffiliation || factionLink || institutionId`, matched by name substring). So the covert channel has a PERSON at its root and a name-matched NPC→institution edge, contrary to "no typed NPC-to-institution edge exists anywhere" (`holderTable.js:33-35`, `institutionTable.js:134`). The edge is untyped (string match) but it is READ by the corruption path. (Moves: PERSON layer, §7.1 unlanded pools, law item 4.)
A-6. `institutionalCatalog.js` (enumerated at f2da5a3ee): `Town watch` REQUIRED at town; `Professional city watch`, `Garrison`, `City walls and gates`, `Multiple courthouses`, `City hall` REQUIRED at city; `Town hall` REQUIRED at town. Consequence with `forceCorePoolKey` (`defenseStateProse.js:1269-1275`, garrison > militia > watch): `watch PRESENT` can fire only where the garrison and militia buckets are both empty — never at city tier (the required `Garrison` row and the required `Professional city watch`, itself a garrison keyword `:90`, both fill the garrison bucket). The O-1 alias row (`professional city watch` in two buckets) therefore never reaches the `watch PRESENT` pool; it reaches `garrison PRESENT` at every city.
A-7. `defenseStateProse.js:1273`: `NO organized force at all` consults SIX buckets (garrison · militia · watch · mercenary · charter · magicDef), not "the same four". `:1319-1321`: `arcaneDefensePoolKey` reads `forces.magicDef.present` — the magicDef bucket IS read by DS-DEF-5's arcane lens (the survey's W-4 says it is not; the CENSUS may under-report the read, the CODE reads it).
A-8. `rulingStructure.js:792`: `powerStructure.government` (the `{seat}` fill, `defenseStateProse.js:961`) is the governing faction's LABEL: `Town Council · Town Mayor · Elected Reeve · Headman's Authority · Corrupt Council · Corrupt City Council · Shadow Senate · Military Council · Feudal Appointee …` (`:251-292`, `:443-452`) or a generated council name. So the desk's one typed POWER slot can render a ROLE word (`Town Mayor`, `Elected Reeve`) or a standing-laden label (`Corrupt Council`) into a `capture none` sentence. (Moves: §6 `{seat}` verdict, law item 1's ROLE clause.)
A-9. `defenseDisplay.js:162`: the structure key `organized` carries the recorded label `Organized Syndicate`. "Syndicate" is an ENGINE LABEL word for the structure lens, not a pure invention; it remains unlicensed on a CAPTURE read (rung 4 reads `criminalCaptureState` only, `:976`).
A-10. `safetyProfile.js:273, :276, :282, :336`: the engine's own prose says "the guard" AFTER a `lawRef` that may have resolved to the watch or the militia ("Walls ... reinforce the guard's ability"; "give the guard leverage"). The ENGINE uses "the guard" as a class word over whichever law body exists, not as the garrison bucket's word. (Moves: the addendum's "the guard is a body word (garrison bucket)".)
A-11. `defenseGenerator.js:177-178`: `hasAnyDefense = inst.hasWalls || inst.hasGarrison || inst.hasMilitia || inst.hasWatch || inst.hasMercenary || inst.hasCharterHall` gates `economicGates.military` (`:189-191`, `:467-468`). THE PAY GATE MEASURES THE WATCH FLAG. The holder table's MUSTER kind (`holderTable.js:188-192`) omits the `watch` token, but the PRODUCER the gate is computed from includes `hasWatch`. So "the muster kind does not contain the watch bucket" is a TABLE fact that the gate's own producer contradicts; and `fieldSynonyms.js:49-52` (car 8a-6, the estate's own instrument) records the gate as "the town's pay for its WATCH". A walled TOWN with the required `Town watch` and no Barracks (chance 0.3) and no Citizen militia (0.6) — roughly a quarter of walled towns — is STRAINED on a gate whose only paid body besides the wall IS the watch, and whose muster-kind holder is null (`holderTable.js:285-287`). (Moves: O-2, F-1, law item 5.)
A-12. `customContentSemanticAuthority.js:41-48`: `nativeSemanticName` returns `''` for materialized custom content, so a custom institution is in NO defence bucket and lights NO `has*` flag; but `corruption.js:666` and `defenseDisplay.js:185` read the raw `inst.name`, so the same custom row IS a SECURITY body and IS a crime classifier input. (Moves: W-6, the BODY layer's definition.)
A-13. `institutionalCatalog.js:104` `Household levy` (thorp, 0.18) matches no bucket keyword and no `has*` flag; it is a force only to `threatDefensePolicy.js:13, :47` (`levy`). `threatDefensePolicy.js:38` names `Professional guard (hundreds)`, a row the catalogue does not carry. `threatDefensePolicy.js:44-47` is a FIFTH name vocabulary and files `garrison` and `barracks` under FORTIFICATION.
A-14. `scripts/prose-wave-gate.mjs:61, :65, :111-112` document and parse `--section <desk>` (plain `grep` reads the file as binary and returns nothing; `grep -a` finds it). The survey's §0 opening claim is wrong; its derived desk boundary (`DS-DEF-*`) is right anyway.
A-15. `safetyProfile.js:74`: the safety label is `max(safetyRatio, communityOrderBonus, courtOrderFloor)` — a thorp reads `Moderate` from a community bonus of 1.25 with NO law body at all (`:56-62`). A DS-DEF-3 label licenses no body.
A-16. `rulingStructure.js:243-247`: the governing faction label can be `Corrupt Council` / `Corrupt City Council` / `Shadow Senate` (a criminal-priority seat) while `criminalCaptureState` is generated separately; `{seat}` can print a standing the capture read contradicts ("Nothing criminal has reached the Corrupt Council").
A-17. `factionCapture.js:129-145`: the world-pulse `settlementCaptureState` is MIRRORED onto `powerStructure.criminalCaptureState`; the module's own comment (`:149-150`) says a faction "could capture the City Watch" — the engine's own reading of the capture ladder is a capture of the WATCH ORGAN by the underworld, not of the ruling structure. `holderTable.js:107-110` reads the same fact as a capture of the STATE reaching four organs. Two readings of one field inside the engine.

## §B VERDICTS ON §0–§2 (scope, cites, the four layers)

| Survey claim | Verdict | Evidence / condition |
|---|---|---|
| §0 "`--section` handling does not exist at this tip; grep returns nothing" | **REFUTED** | A-14: `prose-wave-gate.mjs:61, :65, :111-112`. The boundary the survey derived instead (`DS-DEF-*`, 126 rows / 383 variants) HOLDS: `generate-dossier-state-prose.mjs:111`, census re-counted (A-6 run: 126 rows; 8/26/7/9/11/21/11/4/3/21/5). |
| §0.1 four DS-DEF-11 taste pools exist in `TASTE_POOLS` and not in the annex | **HOLDS** | `scripts/prose-licence-card.mjs:37-41`; `:114` throws on an unknown pool. |
| §0.2 the card prints holder kind + "a STATE ORGAN" and never a referent layer | **HOLDS** | `scripts/lib/prose-licence-card.mjs:406-410`; `holderTable.js:560` emits `stateOrgan` on LICENSED rows only. |
| §1 seven buckets, `magicDef` omitted by the addendum | **HOLDS** | `defenseInstitutionBuckets.js:105-108`. |
| §1 "professional city watch" in garrison AND watch | **HOLDS** | `:90`, `:97`, substring at `:138`. And A-6: at city tier it is REQUIRED, so every city is `garrison.present && watch.present` from that one row. |
| §1 MUSTER kind = walls·garrison·militia·mercenary·charter + 7 more tokens | **HOLDS** | `holderTable.js:188-199`. |
| §1 WATCH kind is a state organ keeping the order records | **CONDITIONAL** | `:115`, `:210-212` HOLD. Condition: the ORGAN's town-holder is `Professional city watch` / `Town watch` (`:317-323`) — the same rows as the watch BUCKET. "Two things by table" is two TABLES over ONE row; a face that names the watch names one building whichever layer it means. |
| §1 `holderRole` is a measured null; the engine licenses the role noun only | **HOLDS** | `institutionTable.js:129-138`, `:215`, `:455-461`, `:503-508`. But see A-5: `corruption.js:648-649, :683-688` READ an NPC→institution link (`factionAffiliation || factionLink || institutionId`) for the covert set. "No typed edge" holds; "no edge the engine reads" does not. |
| §1 brokerage patron is not a defense-desk read | **HOLDS** | no DS-DEF census row reads a brokerage field (A-6 run). |
| §2 BODY = an institution row partitioned into seven buckets | **CONDITIONAL** | Condition: a NATIVE row. A materialized custom institution is in no bucket (A-12) yet is a security body for corruption and a crime-classifier input. |
| §2 HOLDER-ORGAN counts: muster 26 · toll-bar 3 · muster+watch 2 · treasury 2 · muster+road 2; 91 of 126 none | **HOLDS** | census re-run: `{"(none)":91,"muster":26,"muster + watch":2,"toll-bar":3,"treasury":2,"muster + road":2}`. |
| §2 POWER resolves on exactly 5 pools (DS-DEF-4's ladder) | **CONDITIONAL** | HOLDS as reads. Condition: INTERESTED (a POWER standing) also arises on any kind from a corruption impairment or the compromised list (`holderTable.js:707-708`), so a `muster` row can carry a power standing at citation time; and `{seat}` (POWER slot) can render a ROLE word (A-8). |
| §2 ROLE resolves on 0 pools | **CONDITIONAL** | No DS-DEF row reads a role field (census). Condition: the `{seat}` fill renders `Town Mayor` / `Elected Reeve` (A-8) — a role word reaches five DS-DEF-4 pools through the POWER slot. |
| §2 "a law expensive at the ROLE layer costs this desk nothing" | **REFUTED** as stated | A-8: the desk's only power slot is where a role word enters; a role clause is not free here. |
(A-14 refined: the flag is parsed at `scripts/prose-wave-gate.mjs:343-378`, `poolRosterOf({section})` over `SECTION_LEAVES`.)

## §C VERDICTS ON §3 (every noun row)

### 3.1 the wall family
| Row | Verdict | Evidence / condition |
|---|---|---|
| `wall`/`walls` BODY only; reads `forces.walls.present` (DS-DEF-5 ×2, DS-DEF-11 ×5), `walls` arg (DS-DEF-2 invasion), `perimeter` arg (beasts) | **HOLDS** | `defenseStateProse.js:623-626, :655-656, :1089, :1385`. Holder kind muster (`holderTable.js:188`). |
| singular `'wall'` bucket key vs plural `'walls'` flag key, "two tables, two keys, same intent" | **CONDITIONAL** | Keys HOLD (`:85`, `priorityHelpers.js:52`). "Same intent" is not the same SET: the bucket's `'wall'` also catches `Gates (if walled)` via "walled" (the survey's own gate row) and would catch any custom-free name containing "wall"; the flag list carries `palisade`/`earthwork`/`gates (if walled)` explicitly. Same shipped set, different closure. |
| `citadel` / `palisade` / `earthwork` / `massive walls` BODY only | **HOLDS** | `:85-87`; catalogue rows `Citadel` (city), `Palisade` (thorp), `Palisade or earthworks` (hamlet/village), `Massive walls and fortifications` (metropolis). |
| `gate`/`gates` in the walls bucket "by accident" | **HOLDS** | `Gates (if walled)` (town) matches `'wall'` through "walled" (`:85`, `:138`); and the flag list names it on purpose (`priorityHelpers.js:52`) — accident in one table, intent in the other. |
| `{defwork}` BODY only, the town's own wall by recorded name, refuses non-wall names | **HOLDS** | `defenseStateProse.js:1003, :1027-1035, :1086`. Cite correction: the bag line is `:1086` (the survey's `:1084` is `const slots = {`). |
| "the wall family has NO organ, NO power and NO role layer anywhere in the engine" | **REFUTED** | (i) `threatDefensePolicy.js:44-45` files `garrison` and `barracks` under FORTIFICATION — the engine has a vocabulary in which a wall word and a force word share a class. (ii) `holderTable.js:188` puts `walls` under the MUSTER kind — the wall's record IS held by an organ (the muster roll), and `holdersOf('muster')` resolves to the Citizen militia (`:281-284`): the wall's holder is the militia's roll where one exists. (iii) A `Citadel` under a `corruption` impairment carries no power (`SECURITY_INSTITUTION_RE` omits wall words: `corruption.js:630`) — that part holds. |
| always-safe: the wall / the perimeter / the line | **CONDITIONAL** | "the line" is used in the corpus for the MANNED front, not the masonry (`RECEIPT_POOLS_DOSSIER_STATE.md:3092, :3099, :3102, :3105, :3124` — DS-DEF-7's live-readiness pools: "keep the line manned", "holding the line"), i.e. a FORCE word there. Safe as a wall word only where the pool reads `forces.walls.present`. |

### 3.2 the force family
| Row | Verdict | Evidence / condition |
|---|---|---|
| `garrison` BODY + muster; reads DS-DEF-5 `garrison PRESENT`, DS-DEF-2 invasion, beasts via `garrison \|\| militia` | **HOLDS** | `:88-91`, `priorityHelpers.js:46`, `holderTable.js:189`, `defenseStateProse.js:655-656, :1270`. |
| "the garrison · the guard" as the always-safe body words | **CONDITIONAL** | "the garrison" holds for the bucket. "the guard": the engine's own prose uses it as a class word over WHICHEVER law body exists after a watch-only or militia-only `lawRef` (A-10: `safetyProfile.js:273, :276, :282, :336`), and `hasMilitaryInst` reads bare `'guard'` (`priorityHelpers.js:45`); the only garrison-bucket keyword carrying it is `professional guard` (`:89`), which no catalogue row has. So "the guard" is safe as a CLASS word for the law body; it is NOT engine-anchored to the garrison bucket. |
| `barracks` BODY (garrison bucket), also in the SECURITY set | **HOLDS** | `:89`; `corruption.js:630`; catalogue `Barracks` (town, 0.3). |
| `professional guard` matches no shipped row | **HOLDS** | catalogue enumeration at f2da5a3ee: no row; `threatDefensePolicy.js:38` names `Professional guard (hundreds)` in a policy list with no catalogue row behind it. |
| `militia` BODY + muster; `'militia'` matches `'citizen militia'` | **HOLDS** | `:92-94`, `holderTable.js:190`, catalogue `Citizen militia` (hamlet/village/town). |
| "the militia · the muster (class word for the paid military)" | **CONDITIONAL** | "the militia" holds. "the muster" as the CLASS word is the chair's ruling, not an engine object; as a HOLDER it is the Citizen militia's `Muster training` and nobody else's (`holderTable.js:279-288`: "a town with a Garrison and no militia has men under arms and no roll of them"). Condition for a citing face: a live Citizen militia. Condition for the class-word use: the pool's gate actually measures a paid force — see A-11 for the walled Town-watch-only town, where "the muster" names a body the town does not have while "the watch" names the one it has. |
| `mercenary` BODY + muster; the FLAG catches four rows the BUCKET does not | **HOLDS** | bucket `:98-100` vs `priorityHelpers.js:49`. Shipped: `Mercenary quarter` (city) is the ONLY bucket member; `Free company hall` (town), `Hireling hall` (town), `Veteran's lodge` (village) are flag-only. DS-DEF-5 `mercenary … PRESENT` (`:1284`) therefore fires only at city. |
| "the contracted force" as the safe word | **HOLDS** | the annex's own fence licenses "the contract is a contract" (`:2877-2878`). |
| charter hall BODY + muster; `hireling hall` in both flags | **HOLDS** | `:101-104`, `priorityHelpers.js:49, :51`, `holderTable.js:192`. |
| `magicDef` bodies; "DS-DEF-5 arcane pools read `magicWorks`, not the bucket — a wiring row" | **REFUTED** | `defenseStateProse.js:1319-1321`: `arcaneDefensePoolKey(forces, magicWorks)` returns on `forces.magicDef.present`; `:1389` passes `forces`. The CENSUS row lists only `magicWorks` (A-7) — the wiring row is a census under-report, not an unread bucket. |
| `force` (the token) muster; `force = garrison \|\| militia` EXCLUDES the watch | **HOLDS** | `holderTable.js:193`, `defenseStateProse.js:655`. |
| "the most load-bearing line … anything a beasts face says about 'the force' refers to garrison or militia and nothing else" | **HOLDS** | `:655`; `beastsRowSituation` `:429-440`. |

### 3.3 `watch`
| Row | Verdict | Evidence / condition |
|---|---|---|
| BODY: watch bucket resolved by `forces.watch.present` — DS-DEF-5 `watch PRESENT` and `NO organized force at all`, nothing else | **CONDITIONAL** | Reads HOLD (`:1272-1274`). Condition on `watch PRESENT`: it fires only where garrison AND militia are absent (`:1270-1272`), so never at city (A-6); the pool's referent is `Town watch` (town, REQUIRED) or a custom-free village/hamlet name containing `town watch`/`city watch`. The `Professional city watch` never reaches this pool. |
| BODY: the inst flag `hasWatch` consumed by safetyProfile, never by a DS-DEF pool | **REFUTED** | `defenseGenerator.js:177-178`: `hasWatch` is a term of `hasAnyDefense`, which gates `economicGates.military` (`:189-191, :468`) — the read of DS-DEF-11 `WALLED-STRAINED` and the two `muster + road` pools (census reads at f2da5a3ee). The watch flag reaches three DS-DEF pools through the gate. |
| HOLDER-ORGAN: the WATCH kind; two-source rows print `muster + watch · a STATE ORGAN` | **HOLDS** | `holderTable.js:202-209`, `:560`; card run reproduced in the survey. |
| the organ's records (`blackMarketCapture`, `criminalCaptureState`, `safetyProfile`) read by DS-DEF-3/4 and unresolved back to the kind | **HOLDS** | `:210-212`; census: DS-DEF-3 and DS-DEF-4 rows `SOURCE-UNRESOLVED`. |
| SECURITY body for corruption: no landed pool | **HOLDS** | census `covert` = 0 of 126. |
| `watchLabel` tier-derived `'town watch'`/`'city watch'`/`'local watch'` | **HOLDS** | `safetyProfile.js:30-35`. |
| fact 1: "the class word for the paid military is the muster and the watch bucket is not in it" | **CONDITIONAL** | The TABLE holds (`:188-199` vs `:202`). The PRODUCER refutes the consequence: the pay gate the desk reads counts `hasWatch` (A-11), and `fieldSynonyms.js:51` calls the gate "the town's pay for its watch". The chair must choose which instrument the law follows; as drafted the law follows the table against the gate it licenses. |
| fact 2: one Professional city watch makes both `garrison.present` and `watch.present` true | **HOLDS** | `:90`, `:97`. |
| fact 3: the engine's own prose never bakes "the watch" | **REFUTED** | `safetyProfile.js:274`: `" The adventurers' charter hall handles threats the watch cannot."` is baked under `hasCharterHall` with no `hasWatch` guard; `:260` (comment) and `:281, :288, :297, :307` bake `'The watch'` under `hasWatch` — derived, yes, but the `:274` string names the watch on a charter flag. |

### 3.4 the other state organs
| Row | Verdict | Evidence / condition |
|---|---|---|
| `court` BODY (flag) + court kind; `hasCourtSystem` satisfied by `town hall`/`city hall` (required) | **HOLDS** | `priorityHelpers.js:55`; catalogue `Town hall` REQUIRED (town), `City hall` REQUIRED (city). Every town+ is `hasCourtSystem`. And `Multiple courthouses` is REQUIRED at city. |
| `court` in the SECURITY set | **HOLDS** | `corruption.js:630`; shipped hits: `Courthouse`, `Multiple courthouses`, `Multiple court buildings`. |
| `prison` BODY only, no holder kind | **HOLDS** | `priorityHelpers.js:54`; no `prison` token in `HOLDER_SOURCES`. |
| `treasury` organ, no defence body; DS-DEF-8 rows | **HOLDS** | census: `settlement.economicViability.viable` → treasury (`holderTable.js:167`). |
| `office` kind; a citation on it is a finding | **HOLDS** | `:84`, `:362-363`, `:488-490`. |

### 3.5 civic and support bodies
| Row | Verdict | Evidence / condition |
|---|---|---|
| granary / hospital / church / port / navy / road rows | **HOLDS** | `priorityHelpers.js:32, :61-65`; `holderTable.js:157-161, :183-185, :233-234`; `hasNavy` matches no shipped row (enumeration: no `navy`/`major port` name). |
| `hasHospital` catches `monastery`, `healer`, `friary` | **HOLDS** | `:64`; shipped `Healer (divine, 1st level)` (village), `Monastery or friary` (town), `Multiple monasteries` (city). |
| `road` organ "holds the COUNTRY facts, not a road institution" | **CONDITIONAL** | `holdersOf('road')` resolves to `Listening post` / `Waystation` (`holderTable.js:349-355`) — the organ HAS institutions; the survey's "a body word for nothing" is wrong as a holder, right as a defence bucket. |

### 3.6 the power layer
| Row | Verdict | Evidence / condition |
|---|---|---|
| `{seat}` proper, filled at `defenseStateProse.js:962` from `power.government` | **CONDITIONAL** | Fill is at `:961` (`:962` is the closing brace). Condition on "the ruling structure by its recorded designation": the value is the governing faction's LABEL (`rulingStructure.js:792` = `:787`), whose vocabulary includes ROLE words (`Town Mayor`, `Elected Reeve`, `Feudal Appointee`) and standing-laden labels (`Corrupt Council`, `Shadow Senate`) — A-8, A-16. |
| "the ruling structure · the seat" as the class words | **HOLDS** | no engine object refutes a class word; the module's own comment accepts "the hall" as the fallback the annex tolerates (`defenseStateProse.js:866-871`). |
| capture ladder POWER; mapped to WATCH kind | **CONDITIONAL** | HOLDS by table (`holderTable.js:211`). Condition: the engine reads the same ladder two ways — a capture of the STATE reaching four organs (`holderTable.js:107-110`) and a capture of the WATCH by the underworld (`factionCapture.js:149-150`); and INTERESTED-at-birth fires from `adversarial` up (`:141`) while `standingOf` reads a world capture only at `corrupted`/`capture` (`:661`). |
| per-faction `captureState` — none on this desk | **HOLDS** | census reads. |
| `{faction}` declared on DS-DEF-3/4/5, named by zero variants, filled by zero call sites | **HOLDS** | annex `:2737, :2800, :2870`; `grep` over the leaf: 0 hits. |
| `{npc}` declared, forbidden by the block fence | **HOLDS** | `:2800`, `:2809-2810`. |
| "the criminal interest / the operators / the syndicate" UNTYPED authored nouns | **CONDITIONAL** | "the syndicate" is the engine's OWN label word for the `organized` structure key (`defenseDisplay.js:162` `Organized Syndicate`) and the annex fence's own word (`:2807`). It is typed for a STRUCTURE read and untyped for a CAPTURE read. "the operators"/"the criminal interest" are untyped everywhere — HOLDS. |
| corruption impairment: none landed | **HOLDS** | census `covert` 0. |
| brokerage patron: none on this desk | **HOLDS** | census. |

### 3.7 the engine's derived body word
| Row | Verdict | Evidence / condition |
|---|---|---|
| six sites with precedence and fallbacks | **HOLDS** | `safetyProfile.js:263-272, :281, :288-289, :295-300, :305-310, :320-325`; `watchLabel` `:30-35`. |
| "This is the engine's own answer … never an institution name where no body resolves" | **CONDITIONAL** | HOLDS for `lawRef`. Condition: the same sites bake "the guard" as a second, unguarded noun after ANY `lawRef` (A-10) and bake "the watch" under a charter flag (`:274`). The engine's answer is two-voiced. |

### 3.8 role words
| Row | Verdict | Evidence / condition |
|---|---|---|
| zero titled roles in 383 variants; `practitioner(s)` the only role noun with a read; `[elder]` is an angle tag | **CONDITIONAL** | Re-grepped the annex ranges: `captain … guildmaster` 0 hits; `practitioner(s)` 7; `elder` 1 (`:5978`, the tag) — HOLDS over the CORPUS. Condition: the `{seat}` fill injects `Town Mayor` / `Elected Reeve` / `Feudal Appointee` into five DS-DEF-4 pools at render (A-8), so the rendered desk DOES name a role. |
| "the desk's PERSON problem is an INDEFINITE-PERSON problem" | **CONDITIONAL** | HOLDS for the corpus (10 indefinite persons, §8.2 re-verified). Condition: the covert channel's root is a definite PERSON (an un-ousted corrupt NPC homed at the institution, A-5); the two unlanded `watch: bought (covert)` pools inherit a person-rooted read. |

### 3.9 aggregate labels
| Row | Verdict | Evidence / condition |
|---|---|---|
| per-arm badge, overall readiness, safety label, criminal structure, capture rung, posture, live band, supporting status | **HOLDS** | `defenseScoreBands.js:38-39`; `defenseGenerator.js:515-521`; `safetyProfile.js:226-314`; `defenseDisplay.js:25-41, :183-195, :219-259`; `causalState.js:422-449`. |
| "safety label — the engine's own prose derives a body word" | **CONDITIONAL** | A-15: the label can be reached with no body at all (`Moderate` from a thorp's community bonus, `:56-62, :74`); the derived body word is then `'Locals watch over'` (`:289`) — a function phrase, which supports the survey's point, with the condition that the label itself is not evidence of any body. |

## §D VERDICTS ON §4 (the reads by layer)

| Survey row | Verdict | Evidence / condition |
|---|---|---|
| 4.1 DS-DEF-5 `walls PRESENT/ABSENT`, `garrison PRESENT`, `militia PRESENT (no garrison)`, `mercenary`, `charter` — buckets and muster kind | **HOLDS** | `defenseStateProse.js:1251-1252, :1270-1271, :1284, :1295-1297`; census source `muster LICENSED`. |
| 4.1 `watch PRESENT` reads garrison·militia·watch; `NO organized force at all` "same four" | **REFUTED** for the second | `:1273`: the NO-force pool ALSO consults `mercenary`, `charter`, `magicDef` (six buckets); the census lists four (A-7). A face on `NO organized force at all` is licensed to say no contracted, chartered or arcane body stands — the survey's table denies it that read. |
| 4.1 DS-DEF-11 ×5 read walls (+threat/gate/tier), muster (+road ×2) | **HOLDS** | `:1088-1093`; census. |
| 4.2 beasts key `(monsterThreat, walls, garrison \|\| militia)`; NOT watch/mercenary/charter | **HOLDS** | `:655`, `:429-440`. |
| 4.2 invasion key; garrison outranks militia | **HOLDS** | `:476-483`, `:656`. |
| 4.2 internal key `(hasCourtSystem, hasPrison)`; a town hall satisfies the court flag | **HOLDS** | `:657-659`; `priorityHelpers.js:55`. |
| 4.2 disaster key (granary, hospital, church) | **HOLDS** | `:661-663`. |
| 4.2 supply logistics / naval keys; `hasNavy` matches zero rows | **HOLDS** | census reads `blockaded ; navy ; port`; enumeration. |
| 4.2 "an aggregate read licenses a claim about the KEY, not about any body inside it" | **CONDITIONAL** | HOLDS for the band/label keys. Condition: a SITUATION key over booleans (beasts, invasion, internal, disaster) DOES license the boolean each branch selected on — `walls, no force` licenses "no garrison and no militia stand" (both consulted, `:479`); the survey's own example ("does not say WHICH body is absent") is wrong for the invasion key, right for the beasts key (`force` is a disjunction, `:655`). |
| 4.3 five capture reads; corrupted/capture DM-only; the two unlanded watch pools | **HOLDS** | `:908-914`, `:976`; annex `:2850, :2855`; `corruption.js:679-680`. |
| 4.3 "INTERESTED … the four organs it reaches at `:115`" | **CONDITIONAL** | `:115` HOLDS for the birth-capture route. Condition: `standingOf` marks ANY kind's holder interested on `corrupt` (compromised list), `corruptImpairment` (any `impairments[].type === 'corruption'` on the holder row), `captured` (world capture at corrupted/capture) or `controlled` (a patron) — `holderTable.js:645, :656, :661, :665, :707-708`. A `muster` row is interested where its Citizen militia carries a corruption impairment. |
| 4.4 no role reads | **CONDITIONAL** | as §C 3.8: no role FIELD; a role WORD renders through `{seat}`. |

## §E VERDICTS ON §5 (overlaps) AND §6 (slots)

| # | Verdict | Evidence / condition |
|---|---|---|
| O-1 professional city watch in garrison AND watch | **HOLDS**, consequence CONDITIONAL | `:90`, `:97`. The consequence "the garrison and the watch can be the same building" is true of the FLAGS and of `garrison PRESENT`; it never reaches the `watch PRESENT` pool (A-6, `:1270-1272`). At city the two buckets ALWAYS share the row (REQUIRED), so at city "the garrison" pool's roster always includes the watch. |
| O-2 the WATCH bucket is not in the MUSTER kind; a pay read does not reach the watch bucket | **REFUTED** as an engine fact | Table half HOLDS (`holderTable.js:188-199` vs `:202`). "A pay/upkeep read does not reach the watch bucket" is false: the pay gate's producer counts `hasWatch` (A-11, `defenseGenerator.js:177-178, :189-191`), the gate's own synonym row names the watch (`fieldSynonyms.js:51`), and the `hasWatch` list (`priorityHelpers.js:48`) equals the watch bucket's keyword list (`:95-97`). The read reaches the bucket; the TABLE declines to name it. |
| O-3 `hasWalls` plural vs bucket singular | **HOLDS** | `priorityHelpers.js:52`, `defenseInstitutionBuckets.js:85`; annex `:3241-3245` (walls hazard, restated). |
| O-4 `hasMercenary` catches four rows the bucket does not | **HOLDS** (three rows, not four) | `priorityHelpers.js:49` adds `hireling hall`, `free company hall`, `veteran's lodge` — THREE names beyond the bucket's three; the survey's own list has three. |
| O-5 hireling hall in both flags | **HOLDS** | `:49`, `:51`. |
| O-6 `hasCourtSystem` via the required halls | **HOLDS** | `:55`; catalogue. |
| O-7 hospital/church share monastery+friary | **HOLDS** | `:64`, `:65`. |
| O-8 `hasNavy` matches no row | **HOLDS** | enumeration. |
| O-9 `hasMilitaryInst` excludes palisade/earthwork; `guardEffectivenessDesc` not built for a palisaded thorp | **HOLDS** | `priorityHelpers.js:45`; `safetyProfile.js:319`. |
| O-10 corruption's SECURITY set is a third vocabulary on raw `inst.name` | **HOLDS** | `corruption.js:630, :666`; shipped members: Town watch · Professional city watch · Barracks · Garrison · Multiple garrisons · Courthouse · Multiple courthouses · Multiple court buildings. |
| O-11 criminal classifier reads raw `i.name` | **HOLDS** | `defenseDisplay.js:185`. |
| O-12 four bucket keywords match no shipped row | **REFUTED** as counted | `inner citadel` (no row), `massive walls` (matches `Massive walls and fortifications` — the survey's "as a distinct row" caveat is right, the keyword matches a row), `professional guard` (no row), `hired muscle` (no row), `adventurers' guild hall` (no row; `Multiple adventurers' guilds` matches `multiple adventurers'` instead). Three keywords match nothing; two match a row through a sibling keyword. |
| §6 `{seat}` "named but never filled" per census vs filled at `:962` | **HOLDS** as a disagreement | census `slotsWithoutProvider: ["seat"]` on all five capture rows; the fill is at `:961`. |
| §6 `{faction}` / `{npc}` / `{counterpart}` / `{institution}` unfilled on this leaf | **HOLDS** | grep: no `faction`, `counterpart` or `institution:` fill in `defenseStateProse.js`; census `noProvider: ["institution"]` on `Clergy care`, `["good"]` on DS-DEF-9's named-chain pool. |
| §6 `{defwork}` filled at `:1084` | **HOLDS** (cite `:1086`) | census also reports it `NAMED BUT NEVER FILLED` on all five DS-DEF-11 rows — the same W-2 disagreement. |
| §6 "for the criminal power there is NO typed slot; 'the syndicate' is authored, not recorded" | **CONDITIONAL** | No slot HOLDS. "Syndicate" is recorded as the `organized` label (`defenseDisplay.js:162`); licensed only where the pool reads the structure key (`:975`), never on a capture rung. |

## §F VERDICTS ON §7 (visibility)

| Row | Verdict | Evidence / condition |
|---|---|---|
| V-1 `COVERT_SOURCES` read-path list; zero DS-DEF rows covert | **HOLDS** | `wiringCensus.js:1252-1259, :1265-1269, :1681`; census `covert` 0/126. |
| V-2 the `dm-only` mark; 7 variants (DS-DEF-4 ×6, DS-DEF-6 blockade v4) | **HOLDS** | annex `:2851-2853, :2856-2858, :3065`; `composedWalker.js:172-173`; `entryWalker.js:1019-1023`. |
| V-3 arm A13 fires only where the face cites the holder | **HOLDS** | `composedWalker.js:1059` (`provenanceCount === 0 ⇒ continue`), `:1077-1079`. |
| 7.1 `watch PRESENT` citation "licensed only while the town is not captured" | **CONDITIONAL** | Condition stated exactly: `capturedRulingStructure` counts `adversarial` and `equilibrium` as captured (`holderTable.js:141`); so the citing player face FAILS from rung 1 up, not from `corrupted`. And the same face fails where the holder (`Town watch`) carries any `corruption` impairment or sits on the compromised list, capture or no capture (`:707-708`). |
| 7.1 the unlanded `revealed` pool: "both faces"; the `covert` pool: DM only | **CONDITIONAL** | `corruption.js:679-680` HOLD for impairments. Condition: the covert set is ALSO produced by an un-ousted corrupt NPC homed there with NO impairment on the row (`:683-688`), and `revealed` wins over `covert` for the same institution (`:688`). A `watch: bought (covert)` face may therefore rest on an NPC fact, not an impairment — a PERSON-rooted read on the DM face. |
| 7.2 (1) visibility on this desk is authored, not derived | **HOLDS** | DS-DEF-4 rows `SOURCE-UNRESOLVED`; V-1 zero. |
| 7.2 (2) V-3 gates the citation, not the claim | **HOLDS** | `:1059`. |
| 7.2 (3) the unlanded pools are the first where V-1 fires | **CONDITIONAL** | only if their census read names `compromisedSecurityInstitutions` or a `covert` segment (`:1252-1259`); a pool reading `impairments[].type` alone is NOT on the list and would ship covert-blind. |

## §G VERDICTS ON §8 (the shipped-row findings; every quote re-read in the annex at f2da5a3ee)

| # | Verdict | Evidence / condition |
|---|---|---|
| F-1 `:5982` "the watch that should man it" on the pay gate | **CONDITIONAL** (not the clean case the survey and ADDENDUM 11 item 5 make it) | Quote verified. By the TABLE the watch is outside the muster kind. By the PRODUCER the gate counts `hasWatch` (A-11); in a walled town whose only law body is the required `Town watch` (no Barracks, no Citizen militia), "the watch that should man it" names the one paid body the gate measures and "the muster behind it" (`:5983`) names a roll the town does not keep (`holderTable.js:285-287`). Condition under which F-1 is wrong: `forces.garrison.present || forces.militia.present`. Condition under which the sibling v2 is wrong: neither present. Neither wording is licensed on every STRAINED town; the desk needs a derived force word (the `{watchname}` / holder fill ADDENDUM 13 charters) before either face is safe. |
| F-2 DS-DEF-3 ×8 "the watch" on a safety label | **HOLDS** | quotes verified (`:2752, :2755, :2766, :2769, :2771, :2774, :2780, :2781`); the label needs no body (A-15); `forces.watch.present` is read by DS-DEF-5 only. Strengthened: `Town watch` is REQUIRED at town and `Professional city watch` at city, so "the watch" is FALSE only at thorp/hamlet/village and on a ruined-watch town — which is exactly where the corpus has no other word. |
| F-3 `:2603` "as the watch thins" on the beasts key with force false | **HOLDS** | `:655`, `:431`. |
| F-4 `:2662` "the watch's temper" on court;prison | **HOLDS** | `:657-659`. |
| F-5 `:2818` "not the watch's doing" on the structure key | **HOLDS** | `defenseDisplay.js:183-195`. |
| F-6 `:2851` "Somebody at the {seat}" | **HOLDS** | fence `:2809-2810`. |
| F-7 `:2895` "counted at the gate by somebody whose job that is" | **HOLDS** | and "the gate" recurs on non-walls pools: `:2904` (watch v2 "anything at the gate"), `:2929` (arcane v2 "measured at the gate") — the survey lists only F-7. |
| F-8 … F-11 (DS-DEF-6 indefinite persons) | **HOLDS** | quotes verified at `:3002, :3004, :3009, :2984`. |
| F-12, F-13, F-14 (DS-DEF-3 persons) | **HOLDS** | `:2775, :2760, :2766`. |
| F-15 `:2692` "the people who would have to hold … are already owed" | **CONDITIONAL** | quote verified. Condition: the economic band is `defenseProfile.scores.economic` (`:660`), and the shipped engine note for the same band says "Irregular pay, worn equipment, morale risk" (`defenseDisplay.js:221`) — a debt to the paid force IS the producer's own reading of the band; the unindividuated persons are the fault, the debt relation is not "a relation no field computes". |
| F-16 `:2900` the town "has decided"; F-17 `:2924` cost; F-18 `:2915` a future | **HOLDS** | quotes verified; the fence's `may NOT` (a cause). |
| F-19 `:2857` "its syndicate" on rung 4 | **HOLDS** as to the possessive; **CONDITIONAL** as to the word | "syndicate" is the engine's `organized` label (A-9) — licensed on a structure read, not on a capture read; "its" asserts an untyped possession either way. |
| F-20 `:2842` hall vs operators reciprocal | **HOLDS** | ladder records no relation. |
| F-21 `:2668` "the town's courts are spending down a reputation" | **HOLDS** | `court` is a FLAG that a town hall satisfies (`priorityHelpers.js:55`); "courts" plural asserts buildings. |
| F-22 DS-DEF-4 ×8 "the hall" for `{seat}` | **CONDITIONAL** | quotes verified. Condition: the module's own design comment ACCEPTS "the hall" as the fallback when the fill is refused (`defenseStateProse.js:866-871`: "the other two say 'the hall' in their own words"), and the census reports `{seat}` never filled (W-2). "The hall" is a baked noun the engine's author chose as the always-available word; it is a finding for the register car, and refusing it before W-2 is cured drops two of three variants in every capture pool. |
| F-23 `:3213` "a falling-out with the hall" on DS-DEF-9 (no seat slot, no power read) | **HOLDS** | `:3197` SLOTS; census reads `settlement.defenseProfile.magicDependency` only. |
| F-24 `:2538` "how much of the perimeter has nobody on it" on the readiness band | **HOLDS** | fence `:2510-2511`. |
| F-25 `:2681` "the garrison can be kept paid" on the economic band | **HOLDS** | `:660`; no bucket consulted. |
| 8.6 `:5983` "the muster behind it is thinning" is RIGHT | **CONDITIONAL** | right where a Citizen militia or garrison stands; wrong on the walled watch-only town (F-1's condition inverted). |
| 8.6 `:2759` "Enforcement at {settlement}" is right | **HOLDS** | mirrors `safetyProfile.js:281`. |
| 8.6 `:2836` first clause right | **CONDITIONAL** | right where `{seat}` renders a body label; at `Town Mayor` / `Elected Reeve` the sentence names a ROLE as the organ ("Nothing criminal has reached the Elected Reeve at X"), and at `Corrupt Council` it contradicts itself (A-16). |
| 8.6 `:2977` "cannot sustain armed forces" right | **HOLDS** | `defenseDisplay.js:221` `'Cannot sustain forces'`. |
| 8.6 `:2905` agentless passive right | **HOLDS** | — but its siblings are not: `:2903` v1 "keeps a watch, which is a matter of order rather than of war. It answers what happens inside the walls" narrates the ORGAN (order) on a BODY-presence read and imports `walls` the pool does not read — the survey missed the desk's clearest layer-crossing on the one pool named `watch`. |

## §H OVERLAPS THE SURVEYOR MISSED (each a wiring fact for the register car)

| # | The overlap | Rows | Consequence for a face |
|---|---|---|---|
| M-1 | **The pay gate counts the watch; the muster kind does not.** `hasAnyDefense` includes `hasWatch` | `defenseGenerator.js:177-178, :189-191, :467-468`; `holderTable.js:188-199, :202`; `fieldSynonyms.js:49-52` | ADDENDUM 11 item 5's rule ("never 'the watch' for a pay-gate read") follows the table against the producer; on a walled watch-only town it refuses the only true body word. |
| M-2 | **The WATCH organ's holder IS the watch bucket's rows.** `holdersOf('watch')` = `Professional city watch` / `Town watch` | `holderTable.js:317-323` vs `defenseInstitutionBuckets.js:95-97` | "two things by table" is one building; a face naming "the watch" as an organ and "the watch" as a body in one unit names one row twice — law item 3 must say whether that is one referent or two. |
| M-3 | **The MUSTER organ's only holder is the Citizen militia.** A garrison town keeps no roll | `holderTable.js:279-288` | "the muster" as a cited record is CONDITIONAL on `Citizen militia` live; a garrison-only town's `muster LICENSED` rows resolve `holder: null` at the town (`:746-754`). |
| M-4 | **Custom content is invisible to every bucket and every flag, and visible to corruption and the crime classifier** | `customContentSemanticAuthority.js:41-48`; `corruption.js:666`; `defenseDisplay.js:185` | a custom "City Guard" is never `forces.*.present` and never `hasAnyDefense`, yet can be a SECURITY body under a corruption impairment — a power over a body the BODY layer cannot see. |
| M-5 | **`Household levy` is a force to the defence policy and to nobody else** | `institutionalCatalog.js:104`; `threatDefensePolicy.js:13, :47`; no bucket keyword, no flag keyword | a thorp with a levy reads `NO organized force at all` (`:1273-1274`) — "no command, no training" over a mustered levy. |
| M-6 | **A fifth name vocabulary files garrison and barracks under FORTIFICATION** | `threatDefensePolicy.js:44-47` | the engine itself has a class in which a force word is a wall word. |
| M-7 | **The `{seat}` slot's value set crosses into the ROLE and STANDING layers** (`Town Mayor`, `Elected Reeve`, `Feudal Appointee`; `Corrupt Council`, `Shadow Senate`) | `rulingStructure.js:243-247, :259-292, :443-452, :787, :792` | the desk's one typed power slot can render a role word as the organ, or a standing the capture read denies. |
| M-8 | **The capture ladder is read two ways inside the engine**: a capture of the STATE reaching four organs, and a capture of the CITY WATCH by the underworld | `holderTable.js:107-110`; `factionCapture.js:129, :149-150` | "the watch is bought" and "the seat is held" are both engine readings of ONE field; the law's "names the power only through the typed slot" has two candidate objects. |
| M-9 | **Two thresholds for "captured"**: birth-capture at any non-`none` rung; world-capture at `corrupted`/`capture` only | `holderTable.js:141` vs `:661` | the INTERESTED gate on a citing player face fires from `adversarial` at birth. |
| M-10 | **The covert channel is person-rooted**: an un-ousted corrupt NPC homed at a security institution makes it covert with no impairment on the row | `corruption.js:648-649, :683-688` | the unlanded `watch: bought (covert)` pool reads a fact whose subject is a person; item 4's "the DM pen line" must say the office and not the stooge. |
| M-11 | **The engine's own prose bakes "the guard" after any law body and "the watch" under a charter flag** | `safetyProfile.js:273-274, :276, :282, :336` | the desk's two surfaces (engine string beside corpus cell) already disagree with ADDENDUM 11's "the guard = garrison bucket". |
| M-12 | **`NO organized force at all` reads six buckets; the census records four. `arcane defense` reads the magicDef bucket; the census records none** | `defenseStateProse.js:1273, :1321` vs census `reads` | the licence card under-licenses two DS-DEF-5 pools. |
| M-13 | **Occupation makes "the garrison" another power's body** | `RECEIPT_POOLS_DOSSIER_STATE.md:3297-3299` (DS-DEF-10 `UNDER OCCUPATION`: "What stands on these walls answers to {counterpart}"; "well garrisoned and cannot use the garrison"); `occupationStatus.js:74-76` | a BODY word with an external POWER as possessor; no row in the survey's §3.2 carries a possessor layer. |
| M-14 | **`Garrison` and `Professional city watch` are both REQUIRED at city; `Town watch` at town** | `institutionalCatalog.js` (city › Defense; town › Defense) | every city reads `garrison PRESENT` and is `watch.present`; every town is `watch.present`; the survey records no tier-required row, which is the fact that decides which pools can ever fire (A-6). |

## §I MISSED NOUNS (institution-class nouns and role words of the desk the survey did not row)

| Noun | Occurrences (annex ranges) | Layer as used | Engine row |
|---|---|---|---|
| **soldiers** | 14 (`:2617, :2648, :2894, :2899, :2900, :2914, :2919, :2925, :2963, :2983, :3144, :3298`) | BODY, plural-person grain, for the garrison / militia / mercenary / occupier's force | no row; the paid military at the person grain — the class word ADDENDUM 10 item 5 called "the men on the wall" |
| **army** (the enemy's / the town's own abroad) | 6 (`:2562, :2652, :2658, :3138, :3144, :3287`) | an EXTERNAL BODY (`besiegedBy`) or a hypothetical | `warStatus.js:289-297` (`besiegingTargets`, `besiegedBy`, muster kind `holderTable.js:196-197`); `{counterpart}` unfilled |
| **the fleet** (hostile; the town's own) | 4 (`:3027, :3052, :3062, :3065`) | hostile: `blockaded` (toll-bar); own: `hasNavy` — matches NO shipped row | `priorityHelpers.js:62`; `foodStockpile.js:417` |
| **the line** | 19 (DS-DEF-2 `:2601, :2606, :2611, :2648, :2656`; DS-DEF-5 `:2883`; DS-DEF-7 `:3092-3124`) | walls-BODY in DS-DEF-2/5, the MANNED FRONT (a force word) in DS-DEF-7 | one spelling, two layers — law item 3's case inside one desk |
| **specialists / specialist recourse** | 5 (`:2606, :2918, :2923, :2924`) | charter-hall BODY at the person grain; asserted on the beasts key (`:2606`) which does not read `charter` | `forces.charter.present` (DS-DEF-5 only) |
| **the levy** | 0 in prose; the catalogue row `Household levy` | BODY in no table (M-5) | `institutionalCatalog.js:104` |
| **fences · bandits · small operators** | `:2826` | criminal BODIES at the person grain on the `diffuse` structure key | `defenseDisplay.js:189` (`fence`, `bandit`, `outlaw` substrings) — the only three the classifier reads |
| **the purse** | `:2667`, `:5969` (fence) | treasury ORGAN word on a court/prison read (`:2667`) | `holderTable.js:166-169` |
| **the town's law / the law** | `:2661, :2667, :2763` | a FUNCTION word (safe), sometimes as an agent ("reaches for the purse") | none |
| **the seat's people** | `:2837` | PERSONS of the power on a capture read | none — a person layer through the slot |
| **the two buildings / both buildings** | `:2703, :2994` | BODY count asserted on flag reads that a town hall / a friary satisfy | `priorityHelpers.js:55, :64` |
| **the sick-house / infirmary / the parish** | `:2708, :2723, :3017` | hospital flag (may be a friary) / parish ORGAN | `:64`; `holderTable.js:296-302` |
| **the people it calls on / practitioners** | `:2983`, DS-DEF-9 ×6 | ROLE (plural, standing) — under a MUSTER holder | `holderTable.js:194` (`magicDependency` → muster) |
| **the occupier / the people who put them here** | `:3297-3299` | an external POWER possessing the garrison | `occupationStatus.js:74-76`; `{counterpart}` |
| **Town Mayor · Elected Reeve · Feudal Appointee** (rendered through `{seat}`) | five DS-DEF-4 pools at render | ROLE words entering as the POWER | `rulingStructure.js:284, :452` |

## §J THE LAW AS DRAFTED, TESTED AGAINST THE ENGINE (item by item; verdicts on the CHAIR's five items, not the survey's)

| Item | Verdict | The engine fact that decides it |
|---|---|---|
| 1. The referent is fixed by the LAYER OF THE READ | **CONDITIONAL** | Holds wherever a read is single-layered. Fails to decide three shipped cases: (a) the pay gate is a BODY read by the table (muster) and a WATCH read by its producer (M-1) — the layer is contested inside the engine; (b) a capture read is an ORGAN-UNDER-POWER read whose typed slot renders ROLE words (M-7) — the read's layer is POWER, the slot's word is ROLE; (c) the watch organ and the watch body are one row (M-2) — "the layer of the read" changes the sentence's grammar but not its referent. Condition to make item 1 total: name the INSTRUMENT that fixes a read's layer (the holder table, the producer, or the census read list) — they disagree on M-1 and M-12. |
| 1. body words: "the muster, the garrison, the militia, the watch as a bucket name, the men on the wall" | **CONDITIONAL** | "the muster" is safe only where a paid force other than the watch stands (M-1, M-3); "the watch as a bucket name" reaches one pool and never the Professional city watch (A-6); "the garrison" at city always includes the watch row (O-1); "the guard" is the engine's class word over any law body (M-11). "the men on the wall" / "soldiers" is the one always-safe body spelling (a person-plural class word no table splits). |
| 1. standing words: the institution as OBJECT, the power through the typed slot or "the ruling structure" | **CONDITIONAL** | The slot is `{seat}` alone and its value set includes role words and self-refuting labels (M-7, A-16); "the ruling structure" as the class word holds. Condition: a face may use `{seat}` on a capture read only where the fill is a body label — which no predicate today distinguishes; the register car owes a `seatKind` (body · role · label) or the class word replaces the slot. |
| 1. role words: "a standing condition, never a fate" | **HOLDS** | `institutionTable.js:455-461`; DS-DEF-9's `practitioners` is the shipped form. |
| 2. The skeleton tags REFERENT LAYER per claim; a refuter fails a layer mismatch | **CONDITIONAL** | Holds as an instrument. Condition: the three tagged layers are not exhaustive on this desk — AGGREGATE (a band/label that refers to no body: §3.9, 27 of the desk's pools), EXTERNAL BODY (the besieger's army, the occupier's garrison: M-13), and PERSON-ROOTED-STANDING (M-10) each need a tag or a refusal rule; a marker forced to choose BODY/ORGAN/ROLE for "the watch" on a `Dangerous` label will tag the wrong thing. |
| 3. SAME WORD, SAME REFERENT inside a unit; two facts = two units; a fused agent refused | **CONDITIONAL** | Holds as a writing rule. Condition: where the body and the organ are ONE row (M-2: `Town watch` keeps the order record AND stands in the watch bucket), "the watch is present" + "the watch's returns are thin" is one referent under two reads, and the rule as written ("two referents, two units") would split a sentence about one building; the rule needs "same ROW" beside "same referent". |
| 4. Visibility follows the power layer; covert = the DM pen line; the player face says what the organs would admit | **CONDITIONAL** | Holds for impairments (`corruption.js:679-680`). Conditions: (a) the covert set is also NPC-derived (M-10) — the DM line must name the office; (b) INTERESTED at birth fires from `adversarial` (M-9), so "what the organs would admit" excludes a CITATION of the watch's or treasury's record on the player face at rung 1, not only at rung 3 — a stricter line than the addendum states; (c) V-3 gates citations only (`:1059`), so the BODY claim survives on the player face in a captured town — item 4 should say so. |
| 5. The alias overlap is a wiring fact; until cured a face never uses "the watch" for a pay-gate read | **REFUTED** as the rule stands | The rule follows the holder table against the gate's own producer (M-1) and against the estate's synonym instrument (`fieldSynonyms.js:51`); on a walled Town-watch-only town it bars the only true body word and licenses "the muster" for a roll the town does not keep (M-3). The safe form until the `{watchname}` / holder fill lands (ADDENDUM 13 D(b)): the person-plural class word ("the men who should man it", "the soldiers' wages") or the gate's own nouns (`wages · pay · purse`, `fieldSynonyms.js:50`), never either institution name. |

## §K WHAT THE CHAIR SHOULD TAKE FROM THIS PACKET (findings, no ruling)

1. The desk has a TABLE (holderTable) and a PRODUCER (defenseGenerator's gate) that disagree about whether the watch is paid; the law as drafted picks the table without saying so. Pick, and record the pick.
2. The watch ORGAN and the watch BODY are one catalogue row (`Town watch` / `Professional city watch`); the law's "two things" is true of tables and false of buildings — item 3 needs "same row".
3. `{seat}` is not a clean POWER slot: its value set carries role words and standing labels. Either the register car types the seat's kind or the class word replaces the slot on capture reads.
4. `watch PRESENT` is a TOWN-only pool in the shipped roster; `mercenary PRESENT` is CITY-only; every city is `garrison PRESENT`; `NO organized force` is thorp/hamlet/village-only. The layer table should carry the TIER each pool can fire at, because the referent is decided by which rows are required there.
5. Two DS-DEF-5 pools read buckets the census does not list (M-12); the licence card is the refuters' instrument and under-licenses them.
6. The person problem has a definite root on the DM face (M-10); the survey's "indefinite persons only" is a corpus fact, not an engine fact.
7. Cite corrections for the record: `defenseStateProse.js:961` (seat fill), `:1086` (defwork fill), `factionCapture.js:137` (ladder), `--section` exists at `prose-wave-gate.mjs:343-378`.

*Fable refuter, defense desk. Dock read-only at f2da5a3ee; nothing modified, staged or committed; no vitest, npm or build run. Scratch: `_defref_annex.txt` beside this file (the annex ranges, for the chair's re-grep).*
