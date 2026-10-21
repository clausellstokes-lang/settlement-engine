# WC-BD — THE WIRING CENSUS over THE BODIES (`docs/DESIGN_FP_ARCH_BD.md`, 507,585 bytes, 1,358 lines, read whole) — lane WC-BD (Opus 5.5), chair 6eb7b5b6, 2026-10-20

rows 160 · ok 149 · dead ends 1 · shells 7 · inappropriate 3

Method: rows built from the volume's own tables (§2.5 reads 26 + 5 other declared signatures; §12 hearings 17; §13 flags 5; §15 lifecycle 11 shapes + 4 sub-shapes) and its §2.7/§3–§11 mechanisms (84 incl. the 8 DM verbs). Landed seams probed at master `81f1cd963` (`WC-BD-probe/master-symbols.txt`, 104 symbols; host effective lines `WC-BD-probe/efflines.out` — every host count matches the volume: calamityKernel 461 · factionCompetition 775 · institutionLifecycle 800 · generosityKernel 800 · stressorGates 609 · religiousContest 493 · activeConditions 597 · pressureModel 258 · habitLedger 134 · routeNetworkConsumers 184 · routeNetworkLedger 238 · roadsKernel 838 frozen · pulseKernel 1581 frozen). Sibling readers probed in every `DESIGN_FP_*`/`DESIGN_W_*` volume (`WC-BD-probe/sibling-hits.txt`, `sibling-seams.txt`). Class rule for routed halves: a sibling half carried in the sibling's text or in a fold §3.1 INBOX row ("each row IS its slot") = OK (slot); a half carried NOWHERE = SHELL. NEXT-PROGRAM-INBOX items (4 hamlet founding, 6 dossier desk, 7 map pieces) are never findings.

| id | kind | item | where | writer | readers | seam | flag | wave | class | note |
|---|---|---|---|---|---|---|---|---|---|---|
| WC-BD-1 | mechanism | the stage `advanceBodies` | §2.7 | `bodies/bodyStage.js` | every BD step; PR §4.1 stage order cites it | `worldPulse/calamityKernel.js :: advanceCalamity` (461 eff, +3) — CONFIRMED present | bodiesEnabled | BD-0 | OK | 4th leaf after MN/ST/PR; car-0 STOP if host full |
| WC-BD-2 | mechanism | the one writer/normalizer/mint | §2.2 | `bodies/bodyLedger.js` | every §2.5 read | `kernel/proseHash.js :: fnv1a32` CONFIRMED | bodiesEnabled | BD-0 | OK | zero-rng ids |
| WC-BD-3 | mechanism | adoption of ST's id-less authored gangs `adoptUntiedHolders` | §2.1 · §3.2(b) | bodyLedger.js through ST's writer | ST §2.1 adoption (25 hits) | ST's one site writer (designed, ST) | bodiesEnabled | BD-0 | OK | belief begins from tellings (ST-3) |
| WC-BD-4 | mechanism | birth (a) `spilled` | §3.2 | `bodyBirths.js` | records → every read | `supplyKernel.js :: criminalStrength01Of` + `pIndex 'crime'` CONFIRMED | bodiesEnabled | BD-1 | OK | canon only |
| WC-BD-5 | mechanism | birth (a) `sent_forth` / `driven_out` | §3.2 | `conclaveMission.js` | records | `settlementStrategy.js` `missionize` · `religionState.js :: standingFor` CONFIRMED | bodiesEnabled + faithSpreadEnabled | BD-3 | OK | — |
| WC-BD-6 | mechanism | birth (b) `den_held` · `bred` | §3.2 · §6.3 | bodyBirths.js | records | ST holder ref (designed) | bodiesEnabled | BD-0/1 | OK | — |
| WC-BD-7 | mechanism | birth (c) `wild_born` | §3.2 | bodyBirths.js | records | `data/monsterThreat.js` tiers · `spatialCost.js :: TERRAIN_CLASSES` CONFIRMED | bodiesEnabled | BD-1 | OK | — |
| WC-BD-8 | mechanism | birth (d) `deserted` | §3.2 | WC's `brigand` tag event | records | `peopleLedger.js :: TAG_EVENTS` (law, no callers); WC-11/12 designed | bodiesEnabled | BD-7 | OK | DARK slot (G.4) |
| WC-BD-9 | mechanism | birth (e) `cast_out` | §3.2 | bodyBirths.js | records | `demographicsMigration.js :: MIGRATION_REFUSALS` CONFIRMED | bodiesEnabled | BD-1 | OK | per-tick reachability PLAUSIBLE (car-0) |
| WC-BD-10 | mechanism | dwell clocks and the cap | §3.3–3.4 | bodyLedger.js (`births`) | births step | BD's own map | bodiesEnabled | BD-1 | OK | — |
| WC-BD-11 | mechanism | the weekly pick | §4.1 | `bodyChoice.js` | the act producers §9 | `kernel/prng.js :: weightedPick`; HBF `habitForkRegistry.js` CONFIRMED | bodiesEnabled | BD-1 | OK | its truth read is WC-BD-100 |
| WC-BD-12 | mechanism | habits at the body grain | §4.4(c) | HB `habitLedger.js :: writeHabits` + BD-10's `ends` form | `bodyHabitTilt`; PR `predictedPlaceOf` | writeHabits CONFIRMED ("changes.credits") | habitConditioningEnabled | BD-10 | OK | — |
| WC-BD-13 | mechanism | court-grain lessons (stance prior · gate · bounty) | §4.4(a) | "HB's court rows; ROUTE HB" | §7.1 fork's habit term | none: HB volume names no such rows; no fold slot | habitConditioningEnabled | BD-10 | SHELL | classifier rows carried nowhere |
| WC-BD-14 | mechanism | movement on the one physics | §5.1 | bodyStage.js | radius, meetings | `distanceRead.js :: hopWeeks` · `seasonalPathCost` CONFIRMED | bodiesEnabled | BD-1 | OK | — |
| WC-BD-15 | mechanism | ways: access token `body` + landed price | §5.2(a)(b) | BD-5 host edit (2 arrays) | `mayUseHiddenPaths`, `gradeLegMultiplier` | `routeNetworkConsumers.js :: TRAVELLER_KINDS`/`HIDDEN_PATH_KINDS` (184) CONFIRMED | hiddenWaysEnabled | BD-5 | OK | ⭐ OD-BD-49 |
| WC-BD-16 | mechanism | candidate geometry (beside + bypass) | §5.2 | `hiddenWays.js` | `hiddenWayEdges` | digest `routeReceipts…byTerrain` CONFIRMED | hiddenWaysEnabled | BD-5 | OK | bypass PLAUSIBLE until car-0 |
| WC-BD-17 | mechanism | a way's rung life / use counter | §5.2(c) · §2.7 s5 | route lifecycle ("WY's") | `hiddenWayEdges` | `routeNetworkLedger.js :: ROUTE_MODES` CONFIRMED; writer = fold §3.1 INBOX P4 "THE ROUTE LIFECYCLE (WY) (1)" slot | hiddenWaysEnabled ∧ routeLifecycleEnabled | BD-5 | OK | slot only — WY text silent; ⭐ OD-BD-56 |
| WC-BD-18 | mechanism | road-or-way choice | §5.3 | `bodyRoute.js` | movement | PR `believedWatch`; PS `enemyColumnPresence` (PS12) | hiddenWaysEnabled | BD-5 | OK | belief-read ✓ |
| WC-BD-19 | mechanism | base and radius | §5.4 | bodyReads.js | every act's reach | ST holder ref; hopWeeks | bodiesEnabled | BD-1 | OK | — |
| WC-BD-20 | mechanism | plague on the ways | §5.2 | PG pg-1 seeding door | PG epidemic ledger | PG `COLUMN_SEED_CAP` (designed) | — | (PG) | OK | DARK slot |
| WC-BD-21 | mechanism | pirates on the lanes | §5.2 | landed piracy parity | lane losses | `embattlement.js :: banditryLoss` CONFIRMED | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-22 | mechanism | smugglers take the ways | §5.2 | EC gauntlet | EC run | EC l.1353 "summons the hidden path (J4 when lit)" | — | (EC) | OK | PLAUSIBLE; EC names no BD11 roll |
| WC-BD-23 | mechanism | supply stock and upkeep | §6.1 | `bodySupply.js` | readiness, size, existence | BD's own | bodiesEnabled | BD-1 | OK | — |
| WC-BD-24 | mechanism | size: recruit / shed | §6.2 | bodySupply.js | strength, presence | BD's own | bodiesEnabled | BD-1 | OK | — |
| WC-BD-25 | mechanism | the beasts' year | §6.3 | bodyStage.js | births `bred`, ends | season read; EC herds slot | bodiesEnabled | BD-1 | OK | — |
| WC-BD-26 | mechanism | cohesion and existence ends | §6.4 | bodyLedger.js | stage step 1 | ST's writer for the site; HB `ends` | bodiesEnabled | BD-1 | OK | — |
| WC-BD-27 | mechanism | THE ALMS | §6.6 | `bodyAlms.js` | supplies; `alms_requested` | ST `settlementFundingBand` (designed); `deityStance.js :: stanceOf` CONFIRMED | bodiesEnabled | BD-8 | OK | temple purse WF-7 slot |
| WC-BD-28 | mechanism | fission | §6.7 | `bodyFission.js` | records | BD's own; HBF `bodyFissionDraw` | bodiesEnabled | BD-8 | OK | — |
| WC-BD-29 | mechanism | end (a) `retire` → `dispersed` | §6.8(a) | bodyEnds.js | `ended`; POP rejoin slot | BD's own | bodiesEnabled | BD-8 | OK | — |
| WC-BD-30 | mechanism | end (b) `free_company` founding | §6.8(b) | landed institution writer | `mercenaryMarket.js :: mercPresenceOf` | `institutionLifecycle.js :: applyInstitutionLifecycleOutcome` exported, `fate: 'founded'` CONFIRMED (800, called) | bodyEffectsEnabled | BD-8 | OK | car-0 STOP kept |
| WC-BD-31 | mechanism | end (c) `hamlet` | §6.8(c) | POP runtime founding | — | none at master | — | (POP) | OK | queued NEXT-PROGRAM-INBOX 4, ⭐ OD-BD-35 — not a finding |
| WC-BD-32 | mechanism | end (d) guild founding / subservience | §6.8(d) | landed institution writer | criminal power floor | same writer; catalog `criminalPower` CONFIRMED | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-33 | mechanism | the guild war's ONE condition | §6.8(d) | BD leaf via `activeConditions.js :: withActiveCondition` | `causalState.js :: applyConditions`; `pressureModel.js` DEFENSE step | all CONFIRMED; +1 template row, +1 Set token | bodyEffectsEnabled | BD-8 | OK | drift: §8.5 and fold §5 l.213 still say "criminal opportunity" (A.4 struck it) |
| WC-BD-34 | mechanism | the place of a founding | §6.8(e) | bodyEnds.js | base move | reads towns' `believedBodyOf` / RN `fameIn` | bodiesEnabled | BD-8 | INAPPROPRIATE | the gang DECIDES on other actors' belief records as truth (18 d) — PLAUSIBLE |
| WC-BD-35 | mechanism | naming at the band | §6.10 · BD23 | bodyNaming.js | `namingOf` readers | voice pools (dossier desk queued, inbox 6) | bodiesEnabled | BD-8 | OK | — |
| WC-BD-36 | mechanism | the leader slot | §6.10 | CH `paragonRetainer.js :: setLeader` | `bodyLeaderOf` | CH `paragon.leads` (designed, 31 hits) | bodiesEnabled | BD-8 | OK | — |
| WC-BD-37 | mechanism | court stance default + fork | §7.1 | `courtStance.js` | travel, PR pursuit, gang standing | `institutionTolerance.js :: effectiveToleranceOf`/`patronConviction`, `stanceOf`, `LEGIT_ORGANIC_CONTEST` CONFIRMED; PL `huntOrderOf` | bodiesEnabled | BD-3 | OK | — |
| WC-BD-38 | mechanism | harbouring priced | §7.1 | PL `requestFealtyRow` | PL §4.8 | PL designed (9 hits) | bodiesEnabled ∧ polityEnabled | BD-3 | OK | — |
| WC-BD-39 | mechanism | covert hire `employed` exposure | §7.1 | CH `exposeCovertHire` | `corruptionWeb.js :: applyForeignExposureBlowback` | CONFIRMED landed; CH leaf designed | bodiesEnabled + CH covert | BD-3 | OK | latch `exposedAt` |
| WC-BD-40 | mechanism | body↔body pairs and `body_act` deeds | §7.2 | bodyLedger.js (`pairs`); RN door | `bodies_meet` default; RN value table (raided 5 · robbed_road 3 · gave_shelter 3 hits) | RN designed | bodiesEnabled | BD-4 | OK | — |
| WC-BD-41 | mechanism | gang standing composed into criminal power | §7.3 | `criminalPower.js` | `supplyKernel.js` `guildOf`; `espionageGauntlet.js`; `espionageMath.js :: covertCompetence01` | all CONFIRMED; +1 line each; ctx PLAUSIBLE | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-42 | mechanism | defeat legitimacy delta | §7.3 · §9.3 | `generosityUpdates.js :: applyLegitimacyDeltasToUpdates` | landed legitimacy readers | CONFIRMED | bodiesEnabled | BD-4 | OK | "the watch's reputation" names no record |
| WC-BD-43 | mechanism | conclave strength lean | §7.4 | `conclaveLean.js` | `religiousContest.js` share law | `strengthByRef[dref] =` line CONFIRMED (493 +1) | bodyEffectsEnabled | BD-3 | OK | — |
| WC-BD-44 | mechanism | moving flock's arrival | §7.4 | faith system | religion row | `religionState.js :: attemptEntry` CONFIRMED | bodiesEnabled | BD-3 | OK | — |
| WC-BD-45 | mechanism | fracture-gate row | §7.5 | bodyGateRows | `religious_conversion_fracture` births | `stressorGates.js :: religiousConversionGate` CONFIRMED | bodyEffectsEnabled | BD-3 | OK | — |
| WC-BD-46 | mechanism | commons' stance + the quarter's due | §7.6 | RN door; act receipt `quarter:` | PR cover +0.2; informer sightings | RN regard (designed); MN `recordSighting` | renownEnabled | BD-8 | OK | — |
| WC-BD-47 | mechanism | the presence feeder row | §8.2 | `bodyPresence.js` | MN §3.3 `presenceTerms` (names BD row) | CAR: A.3 shared composer `spatial/presenceComposer.js` (not at master) | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-48 | mechanism | raider-gate row | §8.3 | bodyGateRows | `monster_raider_pressure` births | `stressorGates.js :: monsterRaiderGate` CONFIRMED | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-49 | mechanism | two bodies meet | §9.1 | `bodiesMeet.js` | `bodies_meet` card | PR encounter widened (7 hits); `warSiegeVerdict.js :: SIEGE_VERDICT_BANDS` CONFIRMED | bodiesEnabled | BD-4 | OK | — |
| WC-BD-50 | mechanism | raid producer and the take | §9.2 | `bodyRaid.js` | `raid` card; supplies | `defenseLedger.js` military/monster CONFIRMED; `ruinInstitution` status; ST `siteReadinessOf` | bodiesEnabled | BD-4 | OK | — |
| WC-BD-51 | mechanism | raid's bounded loss on the target | §9.2 · BD22 | "the ordinary `mortality` sink" | population | `peopleLedger.js` SINKS `mortality` — "DARK-COMPLETE BY ABSENCE OF CALLERS" | bodiesEnabled | BD-4 | SHELL | no landed writer named; BD22/§8.5 cite these deaths as the record's same-seed shift |
| WC-BD-52 | mechanism | patrols and THE HUNT | §9.3 | PR | `patrol_engages` | PR §5.5 (designed) | bodiesEnabled ∧ patrolsEnabled | BD-4 | OK | — |
| WC-BD-53 | mechanism | site skirmishes · sale · repair ceiling | §9.4 | ST's writer | ST site kinds | ST designed (`saleFork`, `BODY_REPAIR_CEILING`) | bodiesEnabled + site flags | BD-4 | OK | — |
| WC-BD-54 | mechanism | T3 attribution | §9.5 | `bodyAttribution.js` | the receipt | `roadsKernel.js` T3 lines, `robbedReceipted` CONFIRMED (read only) | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-55 | mechanism | outrage and retaliation | §9.5 | `bodyRetaliation.js` | court fork → `hunted`, bounty, grievance/casus | `bodyOnRoute` TRUTH attribution | bodySponsorshipEnabled | BD-9 | INAPPROPRIATE | a court DECIDES (hunt · bounty · casus) on the truth-attributed hand (Law One; 18 d) — PLAUSIBLE |
| WC-BD-56 | mechanism | the warden attempt | §9.5 | CH road arm | `person_at_the_gate` card | CH designed (21 hits) | bodiesEnabled | BD-4 | OK | — |
| WC-BD-57 | mechanism | traffic attribution + fired-loss sink | §9.6 | `bodyTraffic.js` | supplies; receipt | `commodityFlow.js`/`supplyShipments.js` `banditryLoss(` CONFIRMED (+1 line each) | bodyEffectsEnabled | BD-2 | OK | signature PLAUSIBLE (car-0) |
| WC-BD-58 | mechanism | caravan seized by a body | §9.7 | WY-6 resolver | `caravan_seized` | fold §3.4 ↳ r4 carries the widening | caravanBodiesEnabled | BD-4 | OK | WY text not widened (route) |
| WC-BD-59 | mechanism | wartime: supply road · irregulars | §9.8(a) | landed banditry; covert hire | supply shipments | `supplyShipments.js` CONFIRMED | warLayerEnabled | BD-7 | OK | — |
| WC-BD-60 | mechanism | wartime: beasts vs an army's march | §9.8(b) | WC attrition read | WC | fold §3.1 INBOX r4 WC (9) slot | warLayerEnabled | BD-7 | OK | slot only |
| WC-BD-61 | mechanism | wartime: an army sacks a flock | §9.8(c) | `bodies_meet` + RN deed | RN; WF `sacredClaim.js` CONFIRMED | — | warLayerEnabled | BD-7 | OK | — |
| WC-BD-62 | mechanism | a gang joins an enlisting menace | §9.8(d) | MN `absorbBody` | MN might | MN designed (12 hits) | bodiesEnabled | BD-7 | OK | — |
| WC-BD-63 | mechanism | the bought gate | §9.8(e) | "ROUTE WC" | siege verdict defender read | none: WC silent; no fold slot; BD-7 hosts "—" | warLayerEnabled | BD-7 | SHELL | carried nowhere |
| WC-BD-64 | mechanism | sponsored flock vs a besieged town's resolve | §9.8(f) · §10.5 | "ROUTE WC" | `warHomeCosts.js :: applyHomeWarCosts` | landed symbol CONFIRMED, but no host edit listed, WC silent, no slot | bodySponsorshipEnabled | BD-7/9 | SHELL | carried nowhere |
| WC-BD-65 | mechanism | bounty and the call board | §9.9 | `bodyBounty.js` | CH `callBoard`; ST band input (ST l.184) | CH/ST designed | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-66 | mechanism | the ransom race | §9.10 | bodyLedger.js (`held`) | `ransom` card | `ransomChoices.js` CAPTOR/HOME CONFIRMED | — | BD-8 | OK | DARK until ES-2b (owner's slot) |
| WC-BD-67 | mechanism | the hunt led | §9.11 | `bodyHunt.js` | PR detachment; CH `championForHunt`; `hunt_won` | `roleCatalog.js` seats CONFIRMED; CH `securityOfficeOf` | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-68 | mechanism | fast spill (bodies move) | §10.1(i) | movement | neighbour's gauge | as WC-BD-14 | bodiesEnabled | BD-6 | OK | — |
| WC-BD-69 | mechanism | slow habitat spill (drawn `0.15 × N.level`) | §10.1(ii) | `bodySpill.js` | none: `bodyHabitat`'s parts (§2.5) list no spill term; nothing persisted | — | bodySpillEnabled | BD-6 | DEAD END | PLAUSIBLE; HBF `bodySpillDraw` result has no consumer |
| WC-BD-70 | mechanism | peer patch `peace_unkept` | §10.2(a) | `relationshipEvolution.js :: applyRelationshipPatch` | landed pair state; GR "keep your peace" | CONFIRMED; GR half = fold §3.1 INBOX r4 GR slot | bodySpillEnabled | BD-6 | OK | GR text silent |
| WC-BD-71 | mechanism | near flock `shared_faith` lean | §10.2(a) | applyRelationshipPatch | pair trust | `generosityKernel.js :: faithProximity` (private, 800: export or parity pin) | bodySpillEnabled | BD-6 | OK | — |
| WC-BD-72 | mechanism | the liege face (incl. b′) | §10.2(b) | PL `requestFealtyRow` | PL §4.8 (1)(4) | PL designed | bodySpillEnabled ∧ polityEnabled | BD-6 | OK | — |
| WC-BD-73 | mechanism | inverse credit `peace_kept` | §10.2(c) | applyRelationshipPatch + legitimacy writer | pair trust; legitimacy | CONFIRMED | bodySpillEnabled | BD-6 | OK | "26 weeks with no body" history unstored — PLAUSIBLE |
| WC-BD-74 | mechanism | the sword-holder lean | §10.3 | `publicOrder.js` → `applyFactionPatch` | faction plane; gates via legitimacy | `factionCompetition.js :: applyFactionPatch` CONFIRMED (775, CAR ≤1) | bodySpillEnabled | BD-6 | OK | ruling-faction field PLAUSIBLE |
| WC-BD-75 | mechanism | the sponsorship OFFER | §10.4 | "IN/ES covert decision, one more objective" | `sponsorship_offered` | none: IN 0 · ES 0 hits for sponsor; no fold slot; "no such row today" | bodySponsorshipEnabled | BD-9 | SHELL | the tie has no producer |
| WC-BD-76 | mechanism | delivery and its carriers | §10.4 | `bodySponsorship.js` | supplies; leak | PR encounter + `covertCompetence01` CONFIRMED; `operative` needs ES, `temple_alms` IN + WF-7 | bodySponsorshipEnabled | BD-9 | SHELL | two of four carriers carried nowhere; unreachable without WC-BD-75 |
| WC-BD-77 | mechanism | the leak and exposure | §10.4 | CH `exposeCovertHire` | RN `TELLING_SOURCES`; `sponsor_exposed` | CH/RN designed; blowback CONFIRMED | bodySponsorshipEnabled | BD-9 | OK | — |
| WC-BD-78 | mechanism | détente clause "no hand in each other's hills" | §10.5 | GR | `peaceTermsCatalog.js :: TERM_CATALOG` | landed host; fold §3.1 INBOX r4 GR slot | bodySponsorshipEnabled | BD-9 | OK | slot only |
| WC-BD-79 | mechanism | the sphere: the crown's casus | §10.5 | BD leak | landed grievance ladder | PL `polityOf` (designed) | bodySponsorshipEnabled | BD-9 | OK | — |
| WC-BD-80 | mechanism | the word: rumor slots + Herald | §2.7 s8 · §2.4 | bodyStage.js | `believedBodies`/`believedBodyOf` | `spatial/rumorNetwork.js` `captureContent` CONFIRMED (MN-17 idiom) | bodiesEnabled | BD-0 | OK | — |
| WC-BD-81 | mechanism | ways knowledge: catch · pursuit · watched · guide · DM + fade | §2.3 | `hiddenWays.js` | `knownTrailsOf` | PR gleaning/watched (designed); `habitCurve.js :: applyCredit` CONFIRMED | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-82 | mechanism | ways knowledge: `by_survey` · `by_broker` | §2.3 | hiddenWays.js on ES product / IN sale | `knownTrailsOf` | none: ES 0 · IN 0 hits; no fold slot | hiddenWaysEnabled (+ informationBrokeragesEnabled) | BD-5 | SHELL | two of six sources have no producer |
| WC-BD-83 | mechanism | the office's ways `by_office` | §2.3 | derived | PR `trailWatchOf`, PS `hiddenWayFor`, CH | CH `isWardenParagon`; `factionRoles.js` `warden` | hiddenWaysEnabled | BD-8 | OK | — |
| WC-BD-84 | mechanism | the party's knowledge | §2.3 | PT door | PT record | PT `party_made_known_trail` (designed) | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-85 | mechanism | verb `BODY_STANCE` | §11 | `bodyVerbs.js` | `courtStances`; `body_stance` | `realmVerbExecution.js` (663) · `realmManifest.js` CONFIRMED | bodiesEnabled | BD-0 | OK | CN lists 0 of 8 verbs (fold §3.1.20: CN not an FP program) |
| WC-BD-86 | mechanism | verb `PROMOTE_BODY` | §11 | bodyVerbs.js | MN `RAISE_MENACE` | as above; MN designed | bodiesEnabled | BD-0 | OK | — |
| WC-BD-87 | mechanism | verb `BODY_HOLD` | §11 | bodyVerbs.js | stage `pinnedBy` | as above | bodiesEnabled | BD-0 | OK | — |
| WC-BD-88 | mechanism | verb `END_BODY` | §11 | bodyVerbs.js | PT `body_ended` | as above | bodiesEnabled | BD-0 | OK | — |
| WC-BD-89 | mechanism | verb `PLACE_BODY` | §11 | bodyVerbs.js | records | as above | bodiesEnabled | BD-0 | OK | — |
| WC-BD-90 | mechanism | verb `TRAIL_KNOWN` | §11 | bodyVerbs.js | `hiddenWays` / PT | as above | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-91 | mechanism | verb `BODY_LEADER` | §11 | CH `setLeader` | `leads` | as above | bodiesEnabled | BD-8 | OK | — |
| WC-BD-92 | mechanism | verb `BODY_GOAL` | §11 | bodyVerbs.js | `endGoal` | as above | bodiesEnabled | BD-8 | OK | — |
| WC-BD-93 | read | `bodyHabitat` | §2.5 | pure | births §3, recruit §6.2 | `pIndex 'crime'`, `commonsGrievance01`, `effectiveToleranceOf`, RN `fameIn` | bodiesEnabled | BD-1 | OK | "INT's unrest read" does not exist (INT: "no unrest scalar"); the commons grievance does |
| WC-BD-94 | read | `bodySecurity` | §2.5 | pure | births, cap | `1 − pIndex 'defense'`; PR §6.1; ST `siteSuppression` | bodiesEnabled | BD-1 | OK | — |
| WC-BD-95 | read | `bodyBalance` | §2.5 | pure | §3.1 births | composes 93/94 | bodiesEnabled | BD-1 | OK | — |
| WC-BD-96 | read | `bodyPresenceFeeder` | §2.5 · §8.2 | pure | MN §3.3 `presenceTerms` | CAR A.3 | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-97 | read | `bodyPresenceTermOf` | §8.2 | pure | ST `denPressOf` (4 hits) | — | bodyEffectsEnabled | BD-2 | OK | — |
| WC-BD-98 | read | `bodyReadiness01` | §2.5 | pure | `bodyStrength`, choice | `warResolve.js :: supplyBand` words CONFIRMED | bodiesEnabled | BD-1 | OK | — |
| WC-BD-99 | read | `bodyStrength` | §2.5 | pure | band contest; BD14; PR (6) · ST (9) | `armyStrength.js` floors CONFIRMED | bodiesEnabled | BD-4 | OK | — |
| WC-BD-100 | read | `bodyChoiceSet` | §2.5 · §4.2–4.3 | pure | the weekly pick | target terms read TRUTH (`bodyDefenceOf` outmatch; feud/confront "believes" with no belief read) | bodiesEnabled | BD-1 | INAPPROPRIATE | §4.3: "no belief inside the choice except `believedStanceOf`" vs BD12; an actor DECIDES on truth (18 d) — PLAUSIBLE |
| WC-BD-101 | read | `courtStanceOf` | §2.5 · §7.1 | pure | route choice; PR (3) · ST (4) | landed tolerance/stance | bodiesEnabled | BD-3 | OK | — |
| WC-BD-102 | read | `believedStanceOf` | §2.5 | pure | `bodyRouteChoice`; sponsor offer default | landed belief reads (unnamed) | bodiesEnabled | BD-5 | OK | — |
| WC-BD-103 | read | `bodyOnRoute` | §2.5 | pure | §9.5/§9.6 attribution | — | bodyEffectsEnabled | BD-2 | OK | its decision use is WC-BD-55 |
| WC-BD-104 | read | `bodiesIn` | §2.5 | pure | meeting, cap, dossier | — | bodiesEnabled | BD-1 | OK | — |
| WC-BD-105 | read | `bodyRadius` | §2.5 | pure | every act | hopWeeks | bodiesEnabled | BD-1 | OK | — |
| WC-BD-106 | read | `hiddenWayEdges` | §2.5 · §5.2 | pure | PR (16) · PS (3) · CH (7) | `gradeLegMultiplier` CONFIRMED | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-107 | read | `believedBodies` | §2.5 | pure | PR (7) · MN (2) · ST (1) | rumor records | bodiesEnabled | BD-0 | OK | — |
| WC-BD-108 | read | `bodyName` | §2.5 | pure | every line | voice pools | bodiesEnabled | BD-0 | OK | — |
| WC-BD-109 | read | `bodyProjection` | §2.5 | pure | WY §3e builder (map, dossier, PDF) | fold §3.4 caravan ↳ notes "builder gains kind `body`"; WY silent | bodiesEnabled | BD-0 | OK | readers queued: NEXT-PROGRAM-INBOX 6 · 7 — not a finding |
| WC-BD-110 | read | `almsOf` | §2.5 · §6.6 | pure | supplies; `alms_requested` | ST band; stanceOf | bodiesEnabled | BD-8 | OK | — |
| WC-BD-111 | read | `knownTrailsOf` | §2.3 | pure | PR (22) · PS (16) · CH (12) · PT (3) | — | hiddenWaysEnabled | BD-8 | OK | ES routing reader absent (ES 0) |
| WC-BD-112 | read | `believedBodyOf` | §2.4 | pure | PR `predictedPlaceOf` (12) · ST `believedDenOf` (12) · RN (8) | MN `sightings` | bodiesEnabled | BD-0 | OK | — |
| WC-BD-113 | read | `commonsStanceOf` | §2.5 · §7.6 | pure | PR cover (4); habitat | RN regard | renownEnabled | BD-8 | OK | — |
| WC-BD-114 | read | `bodyThreat01` | §2.5 | pure | `hunt_taken`; bounty fork | belief ✓ | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-115 | read | `namingOf` | §2.5 | pure | every shower/keyer | — | bodiesEnabled | BD-8 | OK | — |
| WC-BD-116 | read | `bodyHabitTilt` | §2.5 · §4.4 | pure | choice factors | `habitCurve.js` CONFIRMED | habitConditioningEnabled | BD-10 | OK | — |
| WC-BD-117 | read | `bodyDefenceOf` | §2.5 · BD14 | pure | raid producer; S10 pin | `defenseLedger`; `defenseGenerator.js` `terrainMilMult` CONFIRMED | bodiesEnabled | BD-4 | OK | physics read (truth ✓) |
| WC-BD-118 | read | `bodyRouteChoice` | §2.5 · §5.3 | pure | movement | `believedWatch` | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-119 | read | `bodyLeaderOf` | §2.5 | pure | choice, cohesion, HB seat | CH `paragonOf` | bodiesEnabled | BD-8 | OK | — |
| WC-BD-120 | read | `criminalPowerOf` | §7.3 | pure | three landed consumers | as WC-BD-41 | bodyEffectsEnabled | BD-2 | OK | dark returns landed value |
| WC-BD-121 | read | `conclaveLean` | §7.4 | pure | `religiousContest.js` strength line | CONFIRMED | bodyEffectsEnabled | BD-3 | OK | — |
| WC-BD-122 | read | predicates `bodyPresent` · `bodyBirthPossible` | §14 BD-0/1 | pure | verb vetoes | `realmVetoProse` CONFIRMED | bodiesEnabled | BD-0/1 | OK | — |
| WC-BD-123 | read | `BODY_HABITS` (kind prior) | §9.3 | pure | PR `predictedPlaceOf` (5) | — | hiddenWaysEnabled | BD-5 | OK | — |
| WC-BD-124 | hearing | `bodies_meet` | §12 | BD resolver | fold §3.4 l.622 ✓; SP-9 docket ✓ | `registerEngagementKind` (SP-9, designed) | bodiesEnabled | BD-4 | OK | — |
| WC-BD-125 | hearing | `body_stance` | §12 | BD | fold l.623 ✓; docket ✓; PL reads (10) | SP-9 | bodiesEnabled | BD-3 | OK | — |
| WC-BD-126 | hearing | `traffic_waylaid` | §12 | BD | fold l.624 ✓; docket ✓ | SP-9 | bodiesEnabled | BD-4 | OK | — |
| WC-BD-127 | hearing | `raid` (widened) | §12 | war volume | fold l.670 (a body raider) ✓; docket ✓ | landed incident `raid` | bodiesEnabled | BD-4 | OK | — |
| WC-BD-128 | hearing | `patrol_engages` (widened) | §12 | PR | fold l.640 ✓; docket ✓ | SP-9 | patrolsEnabled | BD-4 | OK | — |
| WC-BD-129 | hearing | `site_taken` · `site_cleared` · `site_siege` (widened) | §12 | ST | fold ✓; docket ✓ | SP-9 | siteFatesEnabled | BD-4 | OK | — |
| WC-BD-130 | hearing | `caravan_seized` (widened) | §12 | WY-6 | fold l.522 ↳ ✓; docket ✓ | SP-9 | caravanBodiesEnabled | BD-4 | OK | WY's own text not widened |
| WC-BD-131 | hearing | `supply_raid` (widened) | §12 | war volume | fold l.551 ↳ ✓; docket ✓ | landed `supply_raid_ordered` act (heraldRouting) | warLayerEnabled | BD-7 | OK | "where built" |
| WC-BD-132 | hearing | PT / CH road arms (incl. `person_at_the_gate` attempt) | §12 | PT · CH | fold ✓ (PT/CH rows); docket ✓ | SP-9 | — | BD-4 | OK | — |
| WC-BD-133 | hearing | `alms_requested` | §12 | BD | fold l.625 ✓; docket ✓ | SP-9 | bodiesEnabled | BD-8 | OK | — |
| WC-BD-134 | hearing | `body_bounty` | §12 | BD | fold l.626 ✓; docket ✓; CH (5) · PT (3) | SP-9 | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-135 | hearing | `hunt_taken` | §12 | BD | fold l.627 ✓; docket ✓; CH (11) · PR (8) · RN (10) | SP-9 | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-136 | hearing | `guild_war` | §12 | BD | fold l.628 ✓; docket ✓ | SP-9 | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-137 | hearing | `sponsorship_offered` | §12 | BD | fold l.629 ✓; docket ✓ | SP-9 | bodySponsorshipEnabled | BD-9 | OK | unreachable until WC-BD-75 |
| WC-BD-138 | hearing | `sponsor_exposed` | §12 | BD | fold l.630 ✓; docket ✓; CH (1) · PL (1) | SP-9 | bodySponsorshipEnabled | BD-9 | OK | belief read ✓ |
| WC-BD-139 | hearing | `ransom` (widened, captor) | §12 | war volume / ES | fold §3.3.13 ↳ ✓; docket ✓ | SP-9 | — | BD-8 | OK | DARK until ES-2b |
| WC-BD-140 | hearing | `site_sale` (answerer) | §12 | ST | fold l.639 ✓; docket ✓ | SP-9 | siteFatesEnabled | BD-4 | OK | — |
| WC-BD-141 | flag | `bodiesEnabled` | §13 | the preset/certification row | WC-BD-1..40 family | `subsystemRowsVirtual` (landed file) | — | BD-0 | OK | — |
| WC-BD-142 | flag | `bodyEffectsEnabled` | §13 | the preset/certification row | presence row, criminal power, gates, founding ends, guild war, bounty, hunt | as above | — | BD-2 | OK | — |
| WC-BD-143 | flag | `hiddenWaysEnabled` | §13 | the preset/certification row | ways, knowledge, route choice | as above | — | BD-5 | OK | — |
| WC-BD-144 | flag | `bodySpillEnabled` | §13 | the preset/certification row | spill, patches, liege rows, sword lean | as above | — | BD-6 | OK | — |
| WC-BD-145 | flag | `bodySponsorshipEnabled` | §13 | the preset/certification row | tie, offer, delivery, leak, cold war | as above | — | BD-9 | OK | gated mechanisms partly SHELL (75 · 76 · 64) |
| WC-BD-146 | shape | `spatialLedgers.bodies.records` | §2.2 · §15 | bodyLedger.js | every §2.5 read | `spatialUsage.js` TRACKED row (BD-0) | bodiesEnabled | BD-0 | OK | ⭐ OD-BD-1 |
| WC-BD-147 | shape | `pairs` | §2.2 | bodyLedger.js | `bodies_meet` default; `feud` | — | bodiesEnabled | BD-4 | OK | — |
| WC-BD-148 | shape | `courtStances` (+ `exposedAt`) | §2.2 | bodyLedger.js | `courtStanceOf`; CH board | — | bodiesEnabled | BD-3 | OK | — |
| WC-BD-149 | shape | `births` dwell clocks | §2.2 · §3.3 | bodyLedger.js | births | — | bodiesEnabled | BD-1 | OK | — |
| WC-BD-150 | shape | `ended` ring (24) | §2.2 | bodyLedger.js | id collision check; HB `ends` | — | bodiesEnabled | BD-1 | OK | — |
| WC-BD-151 | shape | `spatialLedgers.hiddenWays` | §2.3 · §15 | hiddenWays.js | `knownTrailsOf` | — | hiddenWaysEnabled | BD-5 | OK | ⭐ OD-BD-4 |
| WC-BD-152 | shape | rumor slots `bodyId` · `bodyKind` | §2.4 · §15 | the word step | `believedBodies`/`believedBodyOf` | `rumorNetwork.js` `captureContent` | bodiesEnabled | BD-0 | OK | ⭐ OD-BD-5 |
| WC-BD-153 | shape | record's `naming` · `endGoal` · `subservientTo` · `contest` | §15.1 | bodyLedger.js | namingOf; §6.8; upkeep; `guild_war` | — | bodiesEnabled | BD-8 | OK | — |
| WC-BD-154 | shape | `held` (named captives) | §15.1 | bodyLedger.js | `ransom` card | — | — | BD-8 | OK | DARK until ES-2b |
| WC-BD-155 | shape | `courtStances[…].bounty` | §15.1 | bodyLedger.js | CH `callBoard`; ST band input; hunt leader | — | bodyEffectsEnabled | BD-8 | OK | — |
| WC-BD-156 | shape | `sponsorships` (the tie) | §15.1 | bodyLedger.js | choice weight; delivery; leak | — | bodySponsorshipEnabled | BD-9 | OK | ⭐ OD-BD-31; never written until WC-BD-75 has a producer |
| WC-BD-157 | shape | HB rows at the body grain | §15.1 | HB writeHabits | `bodyHabitTilt`; PR prediction | `spatialLedgers.habits` | habitConditioningEnabled | BD-10 | OK | — |
| WC-BD-158 | shape | the `guild_war` condition | §15.2 | BD leaf via withActiveCondition | `applyConditions`; DEFENSE step | `activeConditions.js` CONFIRMED | bodyEffectsEnabled | BD-8 | OK | see 33's drift note |
| WC-BD-159 | shape | way-mode edge `wayRung` · `useCount` (+ `ROUTE_MODES` `way`) | §15.2 | route lifecycle (WY slot) | `hiddenWayEdges`; `hopOf` | `routeNetworkLedger.js` CONFIRMED; writer = fold §3.1 INBOX P4 WY (1) | hiddenWaysEnabled ∧ routeLifecycleEnabled | BD-5 | OK | slot only; ⭐ OD-BD-56 |
| WC-BD-160 | shape | sighting rows (MN's ONE store) | §15.2 | MN `recordSighting` | `believedBodyOf`; ST `believedDenOf` | MN designed (12 hits) | bodiesEnabled | BD-0 | OK | BD declares no store |

## CANDIDATES FOR THE CHAIR (every non-OK row)
- WC-BD-13 · SHELL · §4.4 (a)'s court-grain lessons ("HB's court rows; ROUTE HB for the classifier rows") — HB's volume names no court rows for a body stance, a gate stance or a bounty, and the fold has no slot · cure: BD-10 supplies the court classifier itself (a landed class such as `faith_contested` as the ARGUMENT, HB's writer refusing nothing else) or strike the court grain to a fold INBOX row — owner volume BD.
- WC-BD-34 · INAPPROPRIATE (PLAUSIBLE) · §6.8 (e): a gang chooses where to found by reading OTHER towns' `believedBodyOf` and RN fame as truth · cure: the gang reads its own belief of its notoriety (its ties' tellings, or RN's fame as the gang's own believed reach) — BD.
- WC-BD-51 · SHELL (PLAUSIBLE) · §9.2's "deaths through the ordinary `mortality` sink": master's `peopleLedger.js` is "DARK-COMPLETE BY ABSENCE OF CALLERS" and BD names no landed population writer, yet BD22 and §8.5 count these deaths in the record's signed same-seed shift · cure: name the landed writer (`populationDynamics.js :: applyPopulationOutcomeToSettlement` or the demographics death path) or make the loss DARK until WC's ledger runs and strike it from BD22's list — BD.
- WC-BD-55 · INAPPROPRIATE (PLAUSIBLE) · §9.5's outrage turns the court's fork to `hunted`, opens the bounty and aims a casus using `bodyOnRoute` — a TRUTH attribution — for a court's DECISION (Law One) · cure: the outrage reaches the court as a telling/sighting naming the doer and the fork reads `believedBodyOf`; the receipt may stay truth — BD.
- WC-BD-63 · SHELL · §9.8 (e) the bought gate: "ONE bounded term on the siege verdict's defender read (WC's … ROUTE WC)" — WC is silent, no fold slot, BD-7 lists no host · cure: a fold §3.1 INBOX WC row (the slot) or strike — BD/FOLD.
- WC-BD-64 · SHELL · §9.8 (f)/§10.5 a sponsored flock leans `warHomeCosts.js :: applyHomeWarCosts` — landed symbol, but no host edit is listed and WC carries nothing · cure: name the host line at BD-9 (or a WC INBOX slot) — BD/FOLD.
- WC-BD-69 · DEAD END (PLAUSIBLE) · §10.1 (ii)'s drawn slow spill "raises T's habitat by `0.15 × N.level`", but `bodyHabitat` (§2.5) lists no spill term and nothing persists the draw · cure: add the spill as one part of `bodyHabitat` (with its dwell clock in `births`-style keys) — BD.
- WC-BD-75 · SHELL · §10.4's OFFER is "ONE more objective of" IN/ES's covert decision — IN and ES carry no sponsorship row ("measured, no such row today") and the fold has no slot, so no tie can ever be written · cure: BD-9 names its own offer producer (a seasonal draw on the sponsor's alignment and purse) or a fold INBOX IN/ES slot — BD.
- WC-BD-76 · SHELL (PLAUSIBLE) · §10.4's `operative` (ES errand spine) and `temple_alms` (IN scrutiny + WF-7) carriers have no carrier in ES/IN · cure: as 75, or narrow BD-9 to `smuggler` and `cache_drop` until ES/IN carry theirs — BD.
- WC-BD-82 · SHELL · §2.3's `by_survey` (ES product) and `by_broker` (IN's sale) sources: ES 0 hits, IN 0 hits, no fold slot · cure: fold §3.1 INBOX rows for ES and IN (the slots), or mark both sources DARK until carried — BD/FOLD.
- WC-BD-100 · INAPPROPRIATE (PLAUSIBLE) · `bodyChoiceSet` reads the target's TRUTH (§4.2's raid "it OUTMATCHES by the defence threshold"; §4.3: "no belief inside the choice except `believedStanceOf`") against BD12 ("never on the foreign town's truth") · cure: the choice's outmatch term reads a believed defence (the body's ties' belief, or the visible walls band only); the producer's BD14 threshold stays truth — BD (CHAIR-NOTES 18 (d): the owner names which, once).

## DRIFT SEEN (OK-class rows, one line each, for the dispatch packet)
- §8.5 and fold §5 l.213 (and OD-BD-52's first clause) still give the guild-war condition `criminal_opportunity`; §6.8 (d) r6 / A.4 removed it.
- §12's docket bullet: "BD registers its THREE resolvers with SP-9" — BD owns nine kinds since round 4.
- §9.11 (ii) calls `SWORD_BY_GOVERNMENT` "the ONE read"; §10.3 r5 makes it a display gloss only.
- Routed halves carried only by fold §3.1 INBOX slots (WY way mode; GR demand + term; WC beasts' attrition) or only by the fold's own rows (WY `caravan_seized` widening and §3e kind `body`) — the sibling volumes' texts are silent.

CONFIRMED-vs-PLAUSIBLE: every landed seam above marked CONFIRMED was read at `81f1cd963` (symbol and line in the probe files); every sibling reader was confirmed by grep-and-read of the sibling volume; the classes of WC-BD-34, 51, 55, 69, 76 and 100 are PLAUSIBLE (reasoned from the text), the five SHELLs 13, 63, 64, 75 and 82 are CONFIRMED by absence (0 hits in the owning sibling and in the fold).
