# PROGRAMME — long-tail items #32 · #33 · #34, and where they sit against #18 · #20 · #21

Folded 2026-09-15 from two readers and two skeptics per item, plus the sequencing read. Code was read at the build slot `claude/composite-r4` @ `f73bdbf16`; the record was read at the ledger `a803dee7a`. Every figure is labelled **CONFIRMED** (a skeptic opened the file and re-counted) or **PLAUSIBLE** (a reader's claim no skeptic tested). Read-only throughout; nothing was built, staged or run.

The rule this whole document follows, from §928 and §930: **where the record and the code disagree, the code wins.** It disagrees on all three items, every time in the same direction — the record says "unbuilt", the code says "built, usually dark".

---

## A. THE ANSWER FIRST

The owner asked: are #32, #33 and #34 already built? In plain words:

| Item | What it is | BUILT | PART-BUILT | UNBUILT | of | The record said | Label |
|---|---|---|---|---|---|---|---|
| **#32** | the engine family waves (13 volumes compiled in `DESIGN_FP_ARCHITECTURE.md` §5) | **28** | **10** | **78** | 116 waves (117 if WY-8a is its own row) | "11 landed, ~102 remaining" — short by about 17 waves | CONFIRMED |
| **#33** | the logistics and vessel family (LG: circles, airships, fleets, cover, confiscation…) | **1** | **5** | **12** | 18 members | "never landed" — wrong on four members; right that no LG-numbered wave exists | CONFIRMED per row; the count is the fold's tally of skeptic verdicts |
| **#34** | the political / economic / heraldic programmes (W-COIN, W-SEAT, W-DESK, W-OPS, the WEAVE, encounters, W-ARMS) | **45** | **11** | **17** | 73 build units | "sealed and unbuilt" — wrong for six of seven programmes | CONFIRMED |

So: **#34 is about three-quarters done, #32 is about a third done, and #33 is a new capability with more substrate under it than anyone recorded.** The one thing in all three items that is exactly as the record describes it is W-ARMS (generative heraldry): designed, never started.

### #32 — the five most important "already built" findings (CONFIRMED)

1. **WF-1 the unseating is in the pulse**, at four production sites — `src/domain/worldPulse/patronFall.js:2` ("WF-1a, THE TYPED PATRON FALL"), `religionState.js:239` (the one writer of `suppressed`) and `:276`, `pulseKernel.js:1637` (`unseating: simulationRules.faithUnseatingEnabled === true`), certification row `src/domain/certification/subsystemRowsVirtual.js:458-480`. The compiled volume's own progress block says no faith wave landed.
2. **EP-0 through EP-3 are deeply mounted** — `src/domain/advanceEpochLedger.js:3` has thirteen importers including `pulseKernel.js`, which reads `advanceEpochEnabled` at `:313`. The record says no epochs wave landed.
3. **ES-5b / 5c / 5d landed and are reached in production** — `espionage/espionagePresence.js:2` (consumed at `settlementPolitics.js:555`), `espionageCareer.js:2` (consumed at `npcLadderChallenge.js:169`), `espionageCareerCredit.js:2` (writer at `npcLadderKernel.js:500`). The 2026-08-09 snapshot has them owed.
4. **GR-3b and IN-0c, both recorded as "remain owed", are done** — `tests/domain/peaceTermsGrantTerms.test.js:38` says in words "GR-3b HAS LANDED"; `src/domain/certification/couplingRegistryInfo.js:129-140` carries `owningWave: 'IN-0c'` with the live call at `informationStatecraft.js:1442`.
5. **Five waves landed dark that the record never saw land** — HB-0 (`habit/habitCurve.js:2`), HB-1/HB-2 (`habit/habitLedger.js:255 writeHabits`), WC-0 (`contributionLedger.js:78`, the gate read), INT-3b (`emigreErrand.js:2`). They are part-built because nothing in `src/` imports them yet — dark by their own charter.

### #32 — the five most important "not built" findings (CONFIRMED)

1. **Three whole families are at zero**: POPULATIONS 8 of 8 (`believedMigrationEnabled` and five sibling flags: 0 hits in 2,213 src and 2,614 test files), WAYFARE 12 of 12 including all five surface waves and WY-8a (`armySupplyEnabled` 0, `kmScale` 0), INTERIORS 7 of 8 — `strategicPosture.js:36` says it itself: "THE RULER'S BOOKS are unbuilt (`grep seatBooksEnabled src` → zero hits)".
2. **TRADE is 1 of 9** — TR-2..TR-8's flags exist only as spec rows in `tradeConvergenceContract.js:136-143`; `envoyTaskCatalog.js:291-293` records TR-8 as `built:false` by name.
3. **WAR CIRCULATION is 1 of 17** — WC-1..WC-16 absent; `contributionLedger.js:9`: "IT WRITES NOTHING, AND THAT IS THE MEMBER'S BOUNDARY". WC-6 onward is behind the owner's CR-WC-9.
4. **FAITH is 1 of 10 plus a slice** — WF-0/2/3/4/5/6/7/9 unbuilt; `warFaithStateProse.js:96`: "`templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE".
5. **The programme's terminus is untouched** — GR-6/GR-7, IN-2/3/5/6, CW-1/2x/3 and ES-7 have no code; `subsystemRowsBelief.js:169`: "the six Herald kinds are ES-7's, in ES-7's commit".

Two things a census-by-grep would get wrong (CONFIRMED): `tithe` (38 files, all the old economy layer), `cornering` (TR-1's landed taxonomy, not TR-6), `endingsMix` (trade/war, not GR-7), and a 2026-07-27 "wave EP-5" in the lint tests that is a different programme.

### #33 — the five most important "already built" findings (CONFIRMED)

1. **The teleportation-circle network exists, is live and is tested** under an older lineage — `src/domain/spatial/teleportEdges.js:1-6` ("TELEPORT BLOCS"), the clique builder `:193-213`, opted in at `src/store/campaignSpatialCanonize.js:124` (`teleport: true`), folded into routing at `distanceRead.js:789-806`, 449 lines of tests. The record says nothing in LG has landed.
2. **Airships already carry cargo** — `src/data/foodImportRates.js:17-22` (`airship: 0.3, airshipBesieged: 0.15`), consumed by the food model, and `blockadeTransport.js:20` (`AIRSHIP_RE`) runs in the live pulse at `pulseKernel.js:578`. Airships as a *travel mode* do not exist (see below).
3. **Ships and circles already carry news** — `rumorNetwork.js:85` (`RUMOR_CARRIER_SHIP`) and `:93` (`RUMOR_CARRIER_TELEPORT`, full fidelity), both consumed at `:745`/`:750`.
4. **The "units flow toward war, never back" outcome is already enforced by sea** — `navalKernel.js:330-353` (`seaLiftDelivered`; no return-convoy path anywhere). The *law* is not written, so a later trade round-trip would silently repeal it.
5. **The record's named blocker on the journey waves is dead** — §49 said "there IS no caravan reception machinery at HEAD"; `demographicsMigration.js:107-109` now carries `MIGRATION_REFUSALS = ['none','partial','unreachable','no_capacity','unattractive']` with capacity-ranked placement at `:231-242`. And a persisted capture-and-custody ledger exists: `foreignGuestHold.js:22/:36-42/:53-58` (cause `caught_spying`, close reasons `release/escape/death/pardon`).

### #33 — the five most important "not built" findings (CONFIRMED)

1. **Neither LG flag exists** — `src/lib/flagRegistry.js:31` holds 38 keys, none LG; `simulationRules.js:644-654` WAVES holds nine, none LG; `circleNetworkEnabled`, `vesselFleetsEnabled`: 0 hits everywhere.
2. **Airships as a travel mode have no substrate at all** — `spatialDigest.js:193` hard-codes `airField: null`; eight `toBeNull` assertions across six test files pin it; key order fixed at `:186`. Lighting it is a declared golden movement.
3. **There is no vessel pool and no rebuild timer** — `navalLayer.js:18-19` "capability DERIVED, NEVER PERSISTED"; capacity is per sea lane (`:317`, `:332`), not per settlement; `cooldownUntil` (the chair's own spelling) exists only at `npcLadderChallenge.js:258` and `demographicsPlans.js:120`.
4. **Caravan cover, army confiscation, siege lockdown and roaming captivity are zero** — `ransomClaim.js:181` requires a home settlement as debtor, so an untied NPC cannot be priced; `smuggle.js:250-260` already *owns the word* "confiscation" for gate policy — the LG car must not reuse the spelling.
5. **The relay is narrower than the owner's sentence** — `distanceRead.js:816-822` only uses the circle graph when an *endpoint* holds a circle; and no willingness predicate exists (`teleportEdges.js:22-26` defers it to read time, no reader applies one) — any traveller, hostile or not, uses any circle today. Size-scaled speed is also absent (`armyTransit.js:51-59`, a flat 1.5 factor).

### #34 — the five most important "already built" findings (CONFIRMED)

1. **The treasury is built, wired and tested** — `src/domain/worldPulse/treasury.js` (1,302 lines, 35 exports), called in the pulse at `pulseKernel.js:578`; its header `:10-13` names the "two questions you have not answered" as answered (Q10/A1.21, Q11/A1.23, ODQ §763.2). Cars 1a/1b/2/3 landed. **It is dark on every preset** although its own lighting precondition is met (`simulationRules.js:393-402`; the band chip at `dossierViewModel.js:409`).
2. **The eight-car political layer is not "queued" — eight of its cars landed** across eleven modules (`rulingPowerSeat.js:1-6`, `foreignPrimacy.js:2`, `irregularForce.js:2` …), three flags minted at `simulationRules.js:513/:525/:557`, and `foreignSeatOf` is imported by five product modules.
3. **W-DESK landed whole and was never recorded as dispatched** — DESK-1 `HeraldGazetteer.jsx:105`, DESK-2 `MapOverlay.jsx:42`/`showOnMap.js:2`, DESK-3 `RealmComparisons.jsx:2`, DESK-4 `PerspectiveStandings.jsx:2`, DESK-5 `HeraldBody.jsx:65`/`CommandPalette.jsx:31`, all mounted from `WorldMap.jsx:53`. The 32,673-line ledger mentions W-DESK twice, both at §730.
4. **The season cap "that locks out the whole world" is cured and pinned** — `characterConsumers.js:655-667` (`driftTaughtWithin` takes one identity), the one caller subject-scoped at `envoyChanceMeetingStage.js:769`, the two-subject test at `tests/domain/npc/characterConsumers.test.js:870`. The brief lists a cured defect as live work.
5. **The WEAVE is 21 of ~28 build units built**, including five the record calls unbuilt: NET-2 `routeNetworkGenesis.js:63`, POLIS-3 `TravelRingsLayer.jsx:2`, POLIS-4 `TerritoryLayer.jsx:2`, VAR-3 `InstantWorldEntry.jsx:56`, SEAM-5 `canonMembership.js:3`.

### #34 — the five most important "not built" findings (CONFIRMED)

1. **W-ARMS has zero code** — sixteen search terms, all zero; the only emblem substrate is a closed eight-item ornament pool (`src/design/organic/ornament/pools.js:21`), not a heraldry generator. Record, code and brief agree.
2. **The two operations WIRING cars are owed, and the seven W-OPS leaves have zero product importers** — `subsystemRowsOps.js:193` ("WHAT THE FLAG LIGHTS … nothing") and `:239` (the errand mint site). 4,009 lines of tested shelf code reached by nothing.
3. **SEAT-8 is owner-gated in code** — `subsystemRowsSeat.js:162` "`civilContests` ledger is a NEW PERSISTED SHAPE and therefore an owner-gated class"; SEAT-6 is recorded "deferred priced" (§870.4) with zero code; the TE-CEIL-blocked SEAT-2a §H arm and SEAT-4 chooser have no cure (`TE-CEIL` 0 hits).
4. **The encounters drift door is flatly unbuilt** — `envoyChanceMeetingStage.js:61` "`characterDriftEnabled` is in no manifest, so the door is UNBUILT"; ENC-5's grudge fold owed (`envoyChanceMeetingLedger.js:70`); ENC-7 0 hits (`eliteBleed.js` is a different family — a grep trap). The owner's second of four §881.10 outcomes reaches nothing.
5. **WEAVE stragglers and W-COIN-4** — SEAM-4, NAME-2 (`markov` 0), POLIS-5, VAR-1b, VAR-2, ST-1 all zero; ST-4's calamity half absent; W-COIN-4 exists only as a forward reference at `dossierViewModel.js:382`.

### Where the record and the code disagree — the code wins

| Record claim | Code | Winner |
|---|---|---|
| #32 "11 landed → 102 remaining" (START_HERE §3j) | 28 + 10 landed | code |
| #32 family list names "logistics"; it is SPINE — LG is item #33, with zero code | `DESIGN_FP_ARCH_LG.md` on the ledger only | code |
| #32 "WY F9 `supplyCargo` UNSIGNED" | ledger §4:669 says SIGNED since 2026-08-09; the **build-slot copy of the same doc still says UNSIGNED** (slot :669, :3043) and contradicts itself at :1891 | ledger record; the slot doc needs catching up |
| #32 the flag-mint fourth obligation is "two literal 22s" (§148.2) | `tests/domain/contributionLedgerShape.test.js:49` "holds the triple bijection at 28" | code — any packet compiled against §148.2 edits the wrong number |
| #33 "fully architected, never-landed" | circle network, airship cargo channel, ship/teleport news, capture ledger all landed | code (no LG *wave* landed — both true) |
| #33 "LG-9..12 BLOCKED-ON POP-1" (§49, §92.3) | reception machinery landed in `demographicsMigration.js` | code — the remaining dependency is the individual suspicion refusal, smaller |
| #33 the wartime question "asked of you and never answered" (brief) | chair ruled vetoably at §125a; the OWNER never answered | both half right — "answered only by a vetoable chair ruling" |
| #34 "sealed and unbuilt" | six of seven programmes substantially built | code |
| #34 the season cap "locks out the whole world" | cured at §893.2 `19126aaac`, pinned | code and later record |
| #34 W-DESK never dispatched | five cars mounted in the app | code |
| #34 WC-15 quoted as gated by its own header | `DESIGN_FP_ARCH_WC.md:29-30` says CR-WC-21 **UNBLOCKS** WC-15; the live gate is CR-WC-9 | record read whole |

---

## B. THE FULL PER-ROW TABLES

Verdicts are the skeptics' corrected ones. `src/` and `tests/` paths are at the slot. "Record says" is the ledger's last word.

### B.1 — #32, the engine family waves (116 rows; 117 with WY-8a)

**SPINE (SP) — 6 of 6 BUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| SP-A the pure foundations | SP | LANDED | BUILT | `worldPulse/bandedStock.js`, `bandFamilies.js`; `tests/lint/spBandFamilies.walker.test.js:173` | — |
| SP-B the believed-world axes | SP | LANDED, flags 1-3 | BUILT | `beliefAxes.js:91-93` the three flag reads | — |
| SP-B2 the belief-legs discharge | SP | LANDED | BUILT | `certification/warConvergenceContract.js:350` | — |
| SP-C the posture read | SP | LANDED "dark with zero callers" (ODQ §215) | BUILT, **one real caller now** | `strategicPosture.js:145`; imported by `pactFormation.js` — §215's zero-callers is stale | — |
| SP-D the errand spine | SP | LANDED | BUILT | `errandMint.js:23/:76` | — |
| SP-E the narration kit | SP | LANDED (not in §3j's eleven) | BUILT | `tests/helpers/kindPoolWalker.js`, `components/map/heraldFeed.js` | — |

**GRAMMAR (GR) — 4 BUILT · 2 PART · 2 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| GR-0 the lifecycle voice | GR | LANDED | BUILT | `treatyLifecycleVoice.js:63-65`; `subsystemRowsCompact.js:218` | — |
| GR-1 the oath-holder identity | GR | LANDED | BUILT | `oathHolder.js:2/:122` | — |
| GR-2 peacetime formation + NAP | GR | LANDED | BUILT | `pactProposals.js:114/:134`; `pactAmendment.js:2` | — |
| GR-3 new term families + tripwire discharge | GR | "GR-3b remains owed" (§5 PROGRESS) | BUILT — code wins | `tests/domain/peaceTermsGrantTerms.test.js:38/:264`; `peaceTermsCatalog.js:205` | — |
| GR-4 the succession question | GR | PART (4c, 4b-ii trains ruled) | PART-BUILT | built `treatySuccession.js:2` (+5 siblings); owed `treatyBreach.js:248`, `grammarReceiptPools.js:115` | — |
| GR-5 renewal / renegotiation / conversion | GR | PART, stopped twice | PART-BUILT | `pactAmendment.js:138` mounted; `subsystemRowsCompact.js:469` "NO CONSUMER AT THIS WAVE"; GR-5b/c 0 | — |
| GR-6 mediation generalized | GR | PARKED FOR RE-CHARTER (§35) | UNBUILT | `mediationGeneralizedEnabled` 0; no `mediationPressure.js` | — |
| GR-7 grammar measurement | GR | UNBUILT | UNBUILT | `grammarReceiptPools.js:28` "Deferred BY NAME"; no endings-mix instrument | — |

**INFORMATION (IN) — 1 BUILT · 1 PART · 5 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| IN-0 the prices become law | IN | "IN-0c remains owed" | BUILT — code wins | `couplingRegistryInfo.js:129-140` owningWave IN-0c; `informationStatecraft.js:1442`; 12 importers | — |
| IN-1 the mirror | IN | PART (1c-a landed, 1c-b drafted) | PART-BUILT | `secondOrderBelief.js:133`; `informationNews.js:2` (1c-a); IN-1c-b 0 hits; `neighbourMirror.js:143` still owed | — |
| IN-2 the lure | IN | UNBUILT | UNBUILT | `infoLureEnabled` 0 | — |
| IN-3 the counter-game | IN | UNBUILT | UNBUILT | `brokerageServices.js:587` "`caught` is IN-3's sweep, declared not built" | — |
| IN-4 the road | IN | UNBUILT | UNBUILT, **substrate built** | `reputationRaceEnabled` 0; but `routeNetworkConsumersRace.js:322 reputationRace` (W-J slice J4) exists with 16 test files, no engine consumer (`DESIGN_FP_ARCH_IN.md:62` row S11) — a wiring wave, not a green field | — |
| IN-5 the voice (7th Herald section) | IN | UNBUILT | UNBUILT | `informationNews.js:24` "seventh is IN-5's to mint" | — |
| IN-6 the measure | IN | UNBUILT | UNBUILT | `subsystemRowsCoin.js:58` forward reference only | — |

**TRADE (TR) — 1 BUILT · 1 PART · 7 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| TR-1 the casus commercii | TR | LANDED | BUILT | `commercialReasons.js:21/:133`; `couplingRegistryTrade.js:61` | — |
| TR-2 the house | TR | UNBUILT; TR-2b unscheduled | UNBUILT | `merchantHousesEnabled` only as spec rows `tradeConvergenceContract.js:137…`; no `houseLedger.js` | SOL_QUEUE row 14: "TR-2b (the syndicate variant) is recorded shape only — dark, UNSCHEDULED until the owner sequences it." |
| TR-3 believed markets | TR | UNBUILT | UNBUILT | spec rows only; no `beliefScarcity.js` | — |
| TR-4 the grain road | TR | UNBUILT; CR-2 binds (storageMonths fold) | UNBUILT | spec rows only; no `grainFlow` | — |
| TR-5 the pact lane | TR | UNBUILT (GR-2/3 landed) | UNBUILT | `sovereigntyBundle.js:68/:72`; `peaceTermsCatalog.js:274` | — |
| TR-6 the corner + famine speculator | TR | UNBUILT | UNBUILT, **consumer built** | `commercialReasons.js:349` live scorer over `seam_cornering` that nothing writes; `:51` names TR-6 as the owed producer | — |
| TR-7 ventures | TR | UNBUILT | UNBUILT | `venturesEnabled` spec rows only; no `ventureLedger.js` | — |
| TR-8 the traveling factor | TR | UNBUILT | UNBUILT | `envoyTaskCatalog.js:291-293` `namedWave: 'TR-8'`, unblockingAct names `factorErrand.js` (absent) | — |
| TR-9 trade convergence instrumentation | TR | PART (9c only) | PART-BUILT | `tradeConvergenceContract.js` whole; `simulationRules.js:257` none of eight converted | — |

**FAITH (WF) — 1 BUILT · 1 PART · 8 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| WF-0 the observation floor | WF | UNBUILT | UNBUILT | `WF-0` 0; `deityBearers` at `religiousContest.js:265` is a private helper, not the v5 field | — |
| WF-1 the unseating | WF | "no WF landing" (§5 PROGRESS); ODQ §227/§313 1a/1b landed | BUILT — code wins | `patronFall.js:2`, `religionState.js:239/:276`, `pulseKernel.js:1637`, `subsystemRowsVirtual.js:458-480`; slices 1a–1f pinned | — |
| WF-2 pilgrims + legates | WF | UNBUILT | UNBUILT | `pilgrimageEnabled` 0; `traditions/pilgrimage.js` is the pre-existing generator module | — |
| WF-3 stance consequences | WF | UNBUILT; CR-4 deferral | UNBUILT | `faithStanceConsequencesEnabled` 0 | — |
| WF-4 omen reads | WF | UNBUILT | UNBUILT | `omenReadsEnabled` 0; no `omenReading.js` | — |
| WF-5 schism + underground | WF | UNBUILT | UNBUILT | `faithSchismEnabled` 0 | — |
| WF-6 faith terms | WF | UNBUILT (GR-2/3 landed) | UNBUILT | `couplingRegistryGrammar.js:150/:172` forward | — |
| WF-7 the tithe | WF | UNBUILT | UNBUILT | `titheEnabled` 0; `warFaithStateProse.js:96` templeWealth has no writer; **`tithe` 38 files = old economy layer, a grep trap** | — |
| WF-8 narration 3x | WF | UNBUILT as FP wave; **name collision with launch-tail WF-8/WF-8A doc cars** | PART-BUILT | `faithNews.js:2` (WF-8a slice) mounted by `religiousContest.js`; `faithNarrationEnabled` 0; `faithNews.js:107` shrink-back owed | — |
| WF-9 faith convergence instrumentation | WF | UNBUILT | UNBUILT | no faith convergence contract under `certification/` | — |

**POPULATIONS (POP) — 8 of 8 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| POP-1 the believed road | POP | UNBUILT; ordering anchor for WY-4 and LG | UNBUILT | `believedMigrationEnabled` 0; `POP-1` src hits are `DS-POP-1` dossier ids only | — |
| POP-2 the commons arc | POP | UNBUILT | UNBUILT | `commonsArcEnabled` 0 | — |
| POP-3 departure memory | POP | UNBUILT | UNBUILT | `departureMemoryEnabled` 0; no `departureMemory.js` | — |
| POP-4 the plague arc | POP | UNBUILT | UNBUILT | `calamityArcEnabled` 0 | — |
| POP-5a road drama | POP | UNBUILT | UNBUILT | `roadDramaEnabled` 0 | — |
| POP-5b the permit table | POP | UNBUILT | UNBUILT | `treatyEnforcement.js:297` declared reader, no consumers | — |
| POP-6 the hopeful half | POP | UNBUILT | UNBUILT | `POP-6` 0; neither charter module exists | — |
| POP-7 populations convergence | POP | UNBUILT; Q6 owner-shaped deferral | UNBUILT | `POP-7` 0 | `DESIGN_FP_ARCHITECTURE.md:2938` **CR-FP-6 RULED**: "ACCEPT NO — deliberately deferred beside J-POP-14; ONE owner ruling covers both arrival-side couplings; this goes on the owner queue, not into any wave." |

**INTERIORS (INT) — 1 PART · 7 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| INT-1 the books generalized | INT | UNBUILT; SP-C runs on the declared-degraded arm | UNBUILT | `strategicPosture.js:36` says it in words; only `warSeatBooks.js` exists | — |
| INT-2 the positions wired | INT | UNBUILT | UNBUILT | no `blocCounsel.js`; `INT-2` 0 | — |
| INT-3 the interior veto completes | INT | PART (3B ruled, stopped, re-landed) | PART-BUILT — corrects the code reader | `emigreErrand.js:2` "INT-3b. THE ÉMIGRÉ MINT SEAM", `:7` `built:false`, 0 importers; `interiorVetoEnabled` 0 | — |
| INT-4 the narrated middle | INT | UNBUILT | UNBUILT | `strainAttributionEnabled` 0 | — |
| INT-5 memory seam + founding wound | INT | UNBUILT | UNBUILT | `razing.js:114` forward only | — |
| INT-6 deliberate forgiveness | INT | UNBUILT | UNBUILT | `deliberateForgivenessEnabled` 0; no `burialLedger.js` | — |
| INT-7 legitimacy's row + envelopes | INT | UNBUILT | UNBUILT | no `subsystemRowsInterior.js` | — |
| INT-8 the interior voice | INT | UNBUILT, "chair-gated" on Q4 | UNBUILT | `INT-8` 0 | Not an open gate: `DESIGN_FP_ARCHITECTURE.md:2933` **CR-FP-5 RULED** — "ACCEPT — pre-record the DARK arm now … the owner may later take the re-record arm". |

**COUPLINGS (CW) — 1 BUILT · 3 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| CW-0w the walkers the registry is owed | CW | LANDED (four slices) | BUILT | `couplingRegistryWar.js:4`; `couplingRegistrySchema.js:20` | — |
| CW-1 the cascade governor | CW | UNBUILT | UNBUILT | `cascadeGovernorEnabled` 0 | — |
| CW-2x the cause-walk extension | CW | UNBUILT | UNBUILT | no `causeWalkCouplingJoin.js` | — |
| CW-3 the coupling measure (closes FP) | CW | UNBUILT; terminus of the 9-wave critical path | UNBUILT | no `subsystemRowsCoupling.js` | — |

**ESPIONAGE (ES) — 9 BUILT · 1 PART · 1 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| ES-0 the pure leaves | ES | LANDED (mints `espionageEnabled`) | BUILT | `espionage/espionageMath.js`, `espionageDoctrine.js`; `espionageGate.js:4` | — |
| ES-1 the mission | ES | LANDED | BUILT | `espionageGate.js:80-81`; `couplingRegistryEspionage.js:5` | — |
| ES-2 the gauntlet | ES | LANDED; captor-leniency arm DARK | BUILT | `espionageGauntlet.js:7-10` | — |
| ES-3 products + gradient | ES | LANDED | BUILT | `espionageProducts.js:427` | — |
| ES-4 the joint-legs discharge | ES | LANDED (after "THE WAVE DID NOT LAND" at 08-06) | BUILT | `warConvergenceContract.js:350`; 59 test hits | — |
| ES-5a doctrine engaged | ES | LANDED `41ddeae0` | BUILT | `espionageDoctrineStage.js` | — |
| ES-5b the absence amendment, bench grain | ES | LANDED `6c0238ad`; "owed" at the 08-09 snapshot | BUILT | `espionagePresence.js:2`; consumers `settlementPolitics.js:555`, `factionCompetition.js:205` | ODQ §10 opened a gate on ES-5b + the war chooser; ES-5b shipped under CR-ES-1's one signature |
| ES-5c the career grain | ES | LANDED `c0447b8f` | BUILT | `espionageCareer.js:2`; `npcLadderChallenge.js:169` | — |
| ES-5d the career credit | ES | READY, NOT LANDED (INDEX.md) | BUILT — code wins | `espionageCareerCredit.js:2`; writer `npcLadderKernel.js:500`; manifest `lib/spatialUsage.js:285` | ODQ §11a FYI-not-a-gate: "if the prune is ever removed, or the window widens past one tick … THAT change is owner-gated." |
| ES-6 the double agent | ES | UNBUILT | PART-BUILT | `espionageLeak.js:2` (ES-6a) mounted at `espionageProductStage.js:753`; ES-6b 0 | — |
| ES-7 the voice + the measure | ES | UNBUILT; after IN-5 | UNBUILT | `subsystemRowsBelief.js:169`; `missionDispatcher.js:9/:402` refusal stands | — |

**WAYFARE (WY) — 12 of 12 UNBUILT (7 engine · 5 surface) + WY-8a**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| WY-1 the scale charter | WY engine | UNBUILT; data-gated by `kmScale` | UNBUILT | `kmScale` 0 | — |
| WY-2 the durable truth | WY engine | UNBUILT; before ES-1 (erratum noted) | UNBUILT | `severityDurableRumorsEnabled` 0 | — |
| WY-3 the mover bodies | WY engine | UNBUILT; §2a sign-off rows | UNBUILT | `caravanBodiesEnabled` 0 | SOL_QUEUE row 18b: "⛔ the §2a owner sign-off table gates the field-minting waves one row at a time — an unsigned row stalls exactly one wave, never the program" |
| WY-4 population cargo + the fence | WY engine | UNBUILT; after POP-1; fields F4/F5 | UNBUILT | both flags 0 | same §2a table |
| WY-5 the carried word | WY engine | UNBUILT | UNBUILT | `moversCarryNewsEnabled` 0 | — |
| WY-6 the prize arm + pairs table | WY engine | UNBUILT; born seeing fifteen rows | UNBUILT | `caravanSeizureEnabled` 0; `espionageGauntlet.js:9/:12` | — |
| WY-11 the lifeblood envelope | WY engine | UNBUILT | UNBUILT | `caravanFloorEnabled` 0 | — |
| WY-0 the lawful canvas | WY surface | UNBUILT; "buildable NOW"; carries the Q3 arrow-deletion ruling | UNBUILT | `WY-0` 0 | `DESIGN_FP_ARCH_WY.md` §5 LANE S: "WarFaithMapOverlay arrow deletion per the Q3 RULING (r2: RULED, vetoable … the owner's veto window is open until this wave lands" |
| WY-7 the projection spine | WY surface | UNBUILT; CHECK-GIT-FIRST | UNBUILT | `WY-7` 0 | — |
| WY-8 army mirror + supply train | WY surface | UNBUILT | UNBUILT | `WY-8` 0 | — |
| WY-8a military supply (engine slice) | WY engine on a LANE B row | "UNSIGNED" (rows 18b/21b) vs SIGNED (header, §4) | UNBUILT | `armySupplyEnabled` 0; no `armySupply.js`; WC-10 hard-gates on this BUILD | Ledger `DESIGN_FP_ARCHITECTURE.md` §4:669: "F9 `supplyCargo`: ⏱ SIGNED — released at its queue position". **Slot copy still says UNSIGNED** — doc catch-up owed. |
| WY-9 the clickable canvas | WY surface | UNBUILT; the covert tightening | UNBUILT | `WY-9` 0 | — |
| WY-10 the flow layers | WY surface | UNBUILT; blocks on WY-3 + WY-4 | UNBUILT | `WY-10` 0 | — |

**EPOCHS (EP) — 4 BUILT · 2 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| EP-0 pure segment + root census | EP | UNBUILT | BUILT — code wins | `tests/lint/entropyRootCensus.walker.test.js:2` "wave EP-0"; `tests/kernel/advanceEpochStreamIdentity.test.js:3` | — |
| EP-1 the kernel seam + the flag | EP | UNBUILT; edits `pulseKernel.js`, can never share a cycle | BUILT | `pulseKernel.js:313` reads `advanceEpochEnabled`; `store/campaignAdvanceSession.js:328` | — |
| EP-2 the fork semantics | EP | UNBUILT | BUILT | `campaignAdvanceSession.js:803` re-thread | — |
| EP-3 the side-channel disposition | EP | UNBUILT; slice B chair-gated on Q1 | BUILT | `advanceEpochLedger.js:3` "wave EP-3 slice A", 13 importers | — |
| EP-4 | EP | four rows extracted to §7a | UNBUILT | one test-comment forward reference | `DESIGN_FP_ARCH_EP.md:3741-3743`: "rows 1-3 are SIGNED by the 2026-08-06 blanket sign-off; row 4 is ESCALATED" (FORCE_RESETTLE's tick-invariant stream) |
| EP-5 | EP | declared | UNBUILT | every `EP-5` test hit is a 2026-07-27 programme (`distributionEnvelopePower.test.js:63`) — a grep trap | — |

**HABITS (HB) — 1 BUILT · 2 PART · 7 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| HB-0 the pure substrate | HB | "no HB landing" | BUILT — code wins | `habit/habitCurve.js:2` | — |
| HB-1 action vocabularies + fork registry | HB | refuted then re-chartered (§36/§38/§39) | PART-BUILT | `strategyMoves.js:2` mounted by `settlementStrategy.js`; `habitForkRegistry.js` 0 importers | — |
| HB-2 the ledger + the flag | HB | "IN TRAIN, STOPPED AND RE-ROADED — not landed" | PART-BUILT — code wins | `habitGate.js:2/:62`; `habitLedger.js:255` `writeHabits` with `stocks` + `open`; `:7` "⛔ DARK … nothing in `src/` calls it"; flag at `simulationRules.js:296/:307` | HB Q1's two fields (`deployment.habitEpisode`, `treaty.habitEpisode`) — `DESIGN_FP_ARCH_HB.md:3881-3882`, binds HB-3 onward; **the storage already exists dark** |
| HB-3 … HB-9 (7 rows) | HB | declared; HB-3 owns the missing caller | UNBUILT | `habitCredit` no file anywhere; no other HB writer module in the tree | HB Q1 on HB-3 onward |

**WAR CIRCULATION (WC) — 1 PART · 16 UNBUILT**

| Wave | Family | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| WC-0 registration (the vocabulary wave) | WC | "no WC landing" | PART-BUILT — code wins | `peopleLedger.js:112`, `warStance.js:91`, `lawBandModulation.js:47`, `contributionLedger.js:78` gate; both flags at `simulationRules.js:460/:484`; **all four modules 0 importers** | — |
| WC-1 … WC-5 (5 rows) | WC | declared; "all 17 waves are DISPATCHABLE" (WC header:25-32) | UNBUILT | `warContributions` only in comments; `serviceBonds` 0; named writers absent (`relayNetwork.js`, `warBlockRoster.js`, `blockForks.js`, `serviceIntegrals.js`, `enduranceEnvelope.js` …) | — |
| WC-6 … WC-16 (11 rows) | WC | declared | UNBUILT | as above (`freeUnitKernel.js`, `brigandContest.js`, `demobilizationPulse.js`, `veteranReads.js` absent); WC-10 also hard-gates on WY-8a's build | **CR-WC-9** the persisted field batch — `DESIGN_FP_ARCHITECTURE.md` §4:686 "An unsigned batch stalls WC-6 onward, never WC-0/WC-1". WC-15: CR-WC-21 **UNBLOCKS** it (`DESIGN_FP_ARCH_WC.md:29-30`); its gate is CR-WC-9 like the rest. |

Tally: BUILT 28 · PART-BUILT 10 · UNBUILT 78 of 116 — CONFIRMED.

### B.2 — #33, the logistics and vessel family (18 members)

| Member | Family / wave | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| Teleportation circles — the network | LG-0/LG-1 core graph | chartered, never built | **BUILT** | `spatial/teleportEdges.js:1-6/:70/:75/:193-213`; mounted `spatialDigest.js:630/:903`; lit `store/campaignSpatialCanonize.js:124`; 449 test lines. Qualifier: entitled + new-canon only (`:61-64`) | — |
| Transitive relay + passage predicate | LG-0/LG-1; §125.1 | relay explicit; predicate allied-or-beneficial, widened to traders | PART-BUILT | relay via `distanceRead.js:789-806`; **endpoint-gated** `:816-822`; no willingness predicate `teleportEdges.js:22-26` | — |
| Trade use, ally-free/partner-toll, wartime preemption | §125.1 + §125a | two chair proposals; §125a ruled full preemption vetoably | UNBUILT | no toll/preempt code; no capacity throttle (`teleportEdges.js:42-44`) | §125.1 verbatim: "allies pass free, trading partners pay a toll … and in WARTIME military/envoy use PREEMPTS trade use of limited capacity — ⚠ the second is ASKED of the owner below rather than assumed." |
| Airships | LG-3/LG-4 | one origin port, reduced time, air battles | PART-BUILT — corrects the code reader | cargo channel BUILT: `data/foodImportRates.js:17-22`, `foodGenerator.js:140-146/:446`, `blockadeTransport.js:20` in the pulse at `pulseKernel.js:578`. Travel mode ABSENT: `spatialDigest.js:193` `airField: null`, eight null pins in six files, 0 for air battle | — |
| Unified vessel pool | LG-2; L-LG-2 | fleet per settlement, trade-or-war, unavailable until return | UNBUILT | 0 for vesselPool/shipPool/fleetSize; `navalLayer.js:18-19` derived never persisted; capacity per sea lane `:317/:332`; W-NAVY is lit (`navalEnabled` `simulationRules.js:646`) — a REFIT, not a build beside it | §48 ruling 4: "Owner-gated cure classes (persisted shape, tuning values, parked rows) architect the ARMS and stop at the gate" |
| Rebuild timers | LG-2 (§46a item 5 + addendum) | economic/tier-derived; `cooldownUntil` spelling | UNBUILT | 0 for rebuild*/unavailableUntil; `cooldownUntil` only `npcLadderChallenge.js:258`, `demographicsPlans.js:120` | — |
| Cargo asymmetry | LG-3/LG-5; L-LG-4 | units toward war, never back; return legs carry trade | PART-BUILT — corrects the code reader | outcome enforced `navalKernel.js:330-353` (`seaLiftDelivered`), no return convoy, `:14-17` overland retreat; the LAW, cargo class and trade exemption absent | — |
| News carriage | LG-8; §125.3 chain | vessels carry origin news; caravan-to-caravan chain | PART-BUILT | `rumorNetwork.js:85/:93` consumed `:745/:750`; no airship carrier, no caravan chain | — |
| Rescue exception | LG-6 | route-absence-triggered evacuation | UNBUILT | `rescue` = DM hostage verb (`pendingEditIntents.js:132`); `retreatRoute` is the opposite arm; nearest analogue parked in code (`infiltrationDrift.js` PARKED 'extraction') | — |
| Envoy vessels | LG-7 | named NPC by ship/airship/circle | UNBUILT | envoy family modality-blind (`namedPersonTransit.js:152-154`); `envoyDiplomacyEnabled: false` `simulationRules.js:920`; **live incidental**: an envoy whose endpoint holds a circle already crosses a teleport edge untyped | — |
| Caravan cover + infiltration channel | LG-9..12 (§46b.3, §46c) | entry-route spectrum, group fate, suspicion refusal | UNBUILT | all cover/companion terms 0; ladder is depth not entry (`infiltrationDepth.js:2-5`); **§49 blocker cured** `demographicsMigration.js:107-109/:231-242`; individual suspicion refusal still 0 | — |
| Confiscation + inspection split | LG-5; §125.2 | army takes/turns back a caravan; observed cargo × believed destination | UNBUILT | 0 for army-on-route; but gate seizure books stock `commodityFlow.js:606-620`, two-register read at `dispatchEV.js:88-94/:148-175`; `smuggle.js:250-260` owns the word "confiscation" | — |
| Siege lockdown + capture by captor relation | LG-9..12 | exits by smuggler/tunnel/circle; friendly release, enemy ransom | UNBUILT | no exit-mode set; custody ledger exists `foreignGuestHold.js:22/:36-42/:53-58` priced by `ransomClaim.js:133-215`; only relation test `:184-186` captor_is_home | §46c fourth addendum chair note: "NPC ransom is a sibling family the LG volume must grade … before chartering the outcome — flagged, not assumed." Code narrows it: `envoyRansomStage.js:39-42` "NOTHING IS PERSISTED HERE, AND THAT IS AN OWNER GATE" |
| Roaming captivity without ransom | §125.5 | bounded hold, no ransom, bandit producer maybe owed | UNBUILT | hold-then-release exists (`pardon` writer `npcDmVerbs.js:710`); settlement-less arm 0 — `ransomClaim.js:181` needs `homeId`; `bandit` label only; parked 'ransom' exit `road_unbuilt` | — |
| Size-scaled speed | §125.4 (WY/POP-adjacent) | armies and columns slower with size | UNBUILT | `armyTransit.js:51-59` flat 1.5 + readiness; `migration.js` no size read | bands derived not signed (§144.2) — tuning class |
| Flag `circleNetworkEnabled` | constitution | dark by construction | UNBUILT | 0 hits; **§148.2's "literal 22s" is now 28** (`contributionLedgerShape.test.js:49`) | — |
| Flag `vesselFleetsEnabled` | constitution | dark by construction | UNBUILT | 0 hits; `flagRegistry.js:31` 38 keys none LG; WAVES `simulationRules.js:644-654` | — |
| Declared widening of saved data | Q7 / L-LG-2 / Q5 | commitments ledger + circle/dock features | UNBUILT | 0 of 200 migrations; `teleportEdges.js:54-56` widened nothing; `spatialLedgers.navalTransit` and `foreignGuestHolds` are the adjacent landed families | §46: "Persisted-shape widening (circle/port as settlement features) is declared for the veto surface per the standing law." No signature anywhere. Q9 measured circles/docks already in the closed catalog — only the commitment ledger is genuinely new |
| Capacity vs throughput as two typed reads | §46 addendum ~12:55 | settlement capacity ≠ route throughput | PART-BUILT | capacity `reinforcement.js:1-10/:35-36`; throughput `foodImportRates.js:17-22` per channel; the two never meet (`reinforcement.js` imports no spatial read) | — |

Tally: BUILT 1 · PART-BUILT 5 · UNBUILT 12 of 18 (the fold's count of the skeptic's per-row verdicts; each row CONFIRMED).

### B.3 — #34, the political, economic and heraldic programmes (73 build units)

| Unit | Programme | Record says | Code says | Evidence | Owner gate |
|---|---|---|---|---|---|
| W-COIN-1a stock / flag / lifecycle | W-COIN | landed §793 (brief: "blocked") | BUILT | `treasury.js:635/:647/:673/:716/:762/:803/:1203`; `fieldManifest.js:84` | Q-W8 GRANTED §731.1 verbatim: "do Q-W8 regardless. do the confirmation for Q-S1. do both when they are up." |
| W-COIN-1b taxation | W-COIN | landed §793 | BUILT | `treasury.js:269/:280/:301/:929/:443` | — |
| W-COIN-2 upkeep, ledger, news, band chip | W-COIN | landed §842 | BUILT | `treasury.js:498/:1057/:465/:480`; `treasuryNews.js:1-2`; `dossierViewModel.js:409` | Q10 lighting law `simulationRules.js:393-398` — precondition now MET |
| W-COIN-3 coffers into both war reads | W-COIN | landed §842 | BUILT | `treasury.js:1106`; `warCosts.js:466-486`; `warCoalitionExpenditure.js:236-243` | — |
| W-COIN-4 fuller display + realm aggregation | W-COIN | "unshipped 4th car stays with its named experiment" | UNBUILT | `dossierViewModel.js:382` forward only | — |
| SEAT-1 foreign-seat resolver | W-SEAT | built §823 | BUILT | `rulingPowerSeat.js:1-6`; `occupation.js:1635` | Q-S3 §820: three keys ALL DARK at launch posture, decision at the walk |
| SEAT-2a fourth book / partition / primacy | W-SEAT | landed §861 | BUILT (widens WR-5's `warSeatBooks.js`) | `warSeatBooks.js:8/:513`; `candidateEvents.js:627` | — |
| SEAT-2a §H arm + SEAT-4 chooser | W-SEAT (TE-CEIL) | blocked by `settlementStrategy.js` 812/812 (§844) | UNBUILT | `TE-CEIL` 0 hits — no cure | — |
| SEAT-2b upheaval scaling | W-SEAT | landed §876 | BUILT | `simulationRules.js:514-525`; `subsystemRowsSeat.js:93` | — |
| SEAT-2c D9 wave 1 | W-SEAT | landed §861 | BUILT | `seatIntervention.js:2`; `convergence.js:545` | — |
| SEAT-3 occupation posture | W-SEAT | landed §861 | BUILT | `occupation.js:311/:513/:1338` | — |
| SEAT-4 anticipated reactions | W-SEAT | landed §861 | BUILT | `anticipatedReactions.js:2`; `candidateEvents.js:643` | — |
| SEAT-5 liberation un-install | W-SEAT | landed §876 | BUILT | `applyWorldPulseOccupationAuthority.js:223/:231` | Q-S7/Q-S8 wording + pre-cut snapshot rows (§744.1) — built under A1 defaults |
| SEAT-6 | W-SEAT | "deferred priced" §870.4 | UNBUILT | `SEAT-6` 0 hits | deferred by record |
| SEAT-7a / SEAT-78 irregular-force law | W-SEAT | landed §900 | BUILT | `irregularForce.js:2`; `rulingPowerCoup.js:202`; `coup.js:144`; tuning row DRAFT `.tuning-register.json:2149` | adj budget 0.815 of 0.82 — raising is a tuning-signature act (`subsystemRowsSeat.js:165`) |
| SEAT-8 D11 market + `civilContests` | W-SEAT | open half | UNBUILT | six forward refs; walker asserts absence `treasuryConservation.walker.test.js:197-205` | `subsystemRowsSeat.js:162`: "`civilContests` ledger is a NEW PERSISTED SHAPE and therefore an owner-gated class"; Q-S6 instigation verb (§743.2 REC sim-only) |
| DESK-1 census table | W-DESK | minted §730.3, never dispatched | BUILT | `HeraldGazetteer.jsx:105/:208`; `heraldRegister.js:144` | — |
| DESK-2 map↔word linkage | W-DESK | as above | BUILT | `MapOverlay.jsx:42`; `HoverGlowLayer.jsx:2`; `showOnMap.js:2` | — |
| DESK-3 comparison charts | W-DESK | as above | BUILT | `RealmComparisons.jsx:2` | — |
| DESK-4 perspective standings | W-DESK | as above | BUILT | `PerspectiveStandings.jsx:2` — **collides with prose-desk DESK-4** `warFaithStateProse.js:2` | — |
| DESK-5 legibility texture batch | W-DESK | as above; A2.1 adds `?focus=` deep link | PART-BUILT | `HeraldBody.jsx:65`; `CommandPalette.jsx:31`; `HeraldSection.jsx:38/:87`; `?focus=` 0 hits | — |
| W-OPS O1 grammar + dispatcher | W-OPS | collected §859, landed §874 | PART-BUILT (0 product importers) | `operations/operationGrammar.js:2`, `missionDispatcher.js:2`; `subsystemRowsOps.js:89` "EMPTY src importer set" | leaves shipped CANDIDATE, `signedBy: null` (`subsystemRowsOps.js:216/:262`) |
| W-OPS O2 acceptance seam | W-OPS | "COMPLETE AND HOLDING" `a1981ab96` §872.1 | PART-BUILT | `missionAcceptance.js:2`; 0 importers | — |
| W-OPS O3 infiltration rungs | W-OPS | cars 3–7 unbuilt by the record | PART-BUILT — code wins | `espionage/infiltrationDepth.js:2`; flag `simulationRules.js:568` | — |
| W-OPS O4 envoy task catalog | W-OPS | unbuilt by the record | PART-BUILT | `envoyTaskCatalog.js:2`; flag `:591`; 0 importers | five owner rows on the catalog (`subsystemRowsOps.js:262`) |
| W-OPS O5 depth-priced drift | W-OPS | unbuilt by the record | PART-BUILT | `espionage/infiltrationDrift.js:3` | — |
| W-OPS O6-B place_agent | W-OPS | unbuilt by the record | PART-BUILT | `tests/domain/infiltrationDepth.test.js:497` | — |
| W-OPS O7 operations voice | W-OPS | unbuilt by the record | PART-BUILT | `espionage/operationsVoice.js:2`; flag `:584` | the words are the pen's (`subsystemRowsOps.js:216`) |
| W-OPS wiring car A (feed envelope + desk registration) | W-OPS | — | UNBUILT | `subsystemRowsOps.js:193` | — |
| W-OPS wiring car B (errand mint site) | W-OPS | — | UNBUILT | `subsystemRowsOps.js:239` | — |
| SEAM-0 canonize lockout | WEAVE | REFUTED as a verdict §734.2 | PART-BUILT (finding landed as a guard) | `spatialPackCapture.js:46`; `campaignSpatialCanonize.js:79` | — |
| SEAM-1 · SEAM-2 · SEAM-3 · SEAM-5 | WEAVE | SEAM-1 landed; SEAM-3 §794.1; SEAM-4/5 "disposition open" | BUILT (4) | `spatialDigest.js:485/:282/:281`; `captureSidecar.js:3`; `canonMembership.js:3`; `LivingWorldGates.jsx:43-174` | Q-W1 capture sidecar — pre-ruled |
| SEAM-4 | WEAVE | open | UNBUILT | 0 hits | — |
| CAP-1..4 | WEAVE | built §758.1 | BUILT (4) | `spatialDigest.js:64/:77`; `seaLanes.js:67-225`; `seasons.js:98-163`; `steadingTopography.js:236-305` | — |
| NAME-1 · NAME-3 · NAME-4 | WEAVE | landed §761.2 | BUILT (3) | `warAndRoadNames.js:4`; `engagementNarrative.js:5`; `forceComposition.js:5` | Q-W4 field-battle site, shrunk to `field_battle` alone |
| NAME-2 Markov naming | WEAVE | unbuilt | UNBUILT | `markovNamingEnabled` 0; `markov` 0 | — |
| NET-1 · NET-2 | WEAVE | NET-1 §770; NET-2 "unbuilt" | BUILT (2) — corrects the record | `roadNetwork.js:143/:315`; `routeNetworkGenesis.js:63` "WEAVE NET-2 … owner row Q-W6" | Q-W6 route-genesis law stamp (REC grant) |
| POLIS-1 · POLIS-2 · POLIS-3 · POLIS-4 | WEAVE | POLIS-1/2 landed; POLIS-3/4 "unbuilt" | BUILT (4) — corrects the record | `worldCode.js:40`; `composeInstantWorld.js:292`; `TravelRingsLayer.jsx:2` mounted `MapOverlay.jsx:354`; `TerritoryLayer.jsx:2` mounted `:332` | Q-W3 worldCode v2 pre-ruled |
| POLIS-5 | WEAVE | "dispatches pre-soak in a later genesis window" §794.2(c) | UNBUILT | 0 hits | — |
| VAR-1a · VAR-3 | WEAVE | VAR-1a landed; VAR-3 "unbuilt" | BUILT (2) — corrects the record | `kernel/detPow.js:2`; `detMath.js:42`; `InstantWorldEntry.jsx:56/:94/:267`; `operationRegistry.js:271` | — |
| VAR-1b · VAR-2 | WEAVE | VAR-1b re-specced §794.2(a); VAR-2 behind it | UNBUILT (2) | 0 hits each | — |
| ST-2 · ST-3 | WEAVE | landed | BUILT (2) | `goods/chains.js:5`; `composerPipeline.js:2` | — |
| ST-4 | WEAVE | calamity half priced-deferred §811 | PART-BUILT | `seaLanes.js:526/:561/:571` advisory half; calamity half 0 | countersignature owner's (§811) |
| ST-1 | WEAVE | — | UNBUILT | 0 hits | — |
| ENC-1 · 2 · 3 · 4 · 4b · 4c · 6 | encounters | landed §888–§900 | BUILT (7) | `envoyChanceMeeting*.js` (3,445+ lines); gate `envoyChanceMeetingStage.js:179`; flag `simulationRules.js:535`; `regenIdentityFold.js:205` | rows 4 and 9 "OWNER-gated persisted-shape rows … never chair-ruled" (§882.10) |
| the season cap | encounters | "locks out the whole world" (brief) | BUILT (cured) | `characterConsumers.js:655-667`; `envoyChanceMeetingStage.js:769`; test `:870` | — |
| ENC-5 the words + the grudge fold | encounters | landed §899 (the words) | PART-BUILT | words `envoyChanceMeetingReceiptPools.js` sealed `refs/preserve/enc5-words-2026-09-04`; fold owed `envoyChanceMeetingLedger.js:70`, `npcLadderKernel.js:409` | — |
| ENC-7 elite-bleed wiring | encounters | deferred to the lighting wave (§887.1) | UNBUILT | `ENC-7` 0; `eliteBleed.js` is D-7f — a trap | row 8's ruling |
| the drift door (`characterDriftEnabled`) | encounters | reserved to TE-VIRT-1 (§890.1); "L-HOMES-7 … priced the chartered car in eight acts" (§900) | UNBUILT | `envoyChanceMeetingStage.js:61` "the door is UNBUILT"; `characterDrift.js:150/:155` | §900 owner row: the manifest home; tie-break by town spelling |
| W-ARMS Car 0 probes | W-ARMS | ran read-only §896.2 | discharged | — | — |
| W-ARMS Car 1 leaf + pins · Car 2 adapter + web seam · Car 3 PDF seam | W-ARMS | designed, never started | UNBUILT (3) | sixteen terms 0; `ornament/pools.js:21` closed 8-emblem pool | §879.11 R2: "⚠ OWNER: your one-word veto drops it"; eleven §9 taste rows; the paid-rights floor (Car 3) |

Tally: BUILT 45 · PART-BUILT 11 · UNBUILT 17 of 73 — CONFIRMED.

---

## C. THE DEPENDENCY SPINE AND THE PROPOSED LANE ORDER

### C.1 What must precede what (anchors)

```
                       ┌── Q10 band-walker prefix (§99.3, STILL OWED; no instrument at the slot) ──┐
                       │                                                                           ├─→ any #33 wave that lands a BAND (nearly all)
                       │   §125.1 toll + §125a confirmation (owner) ─── design-blocking, not build ─┘
                       │
#32 waves (dark, each behind its own *Enabled key) ──→ stop at CR-WC-9 (WC-6+) · HB Q1 (HB-3+) · EP §7a row 4 · WY §2a rows
                       │
#34 remainder: W-OPS wiring (free) · WEAVE stragglers (free) · ENC-5 fold (free) · W-COIN-4 (free)
               SEAT-8 ──→ civilContests persisted shape (owner)     W-ARMS Cars 1-3 ──→ veto window + taste rows (owner)
               drift-door car ──→ chartered under TE-VIRT-1 (chair)
                       │
banked rewrite (owner's word 09-14 ~17:2x) ──→ #18 ONLY
                       │
every persisted-shape widening (#32 batch · #33 commitment ledger · encounters rows 4/9 · civilContests)
                       └──────────────────────────────────────────→ #20 ONE trailing OSR mint (§482.2, §739.2)
                       │
all dark landings ──→ THE SECOND DECLARED LIGHTING (sitting item 1's §764.3 amendment) ──→ GOLDEN freeze [OWNER]
                       ──→ walk + ONE regen [OWNER] ──→ #21 the exhaustive review + fix cars (§879.6, §881.4)
```

Corrections to the sequencing read from the skeptics, which change the spine:

- **POP-1 is no longer a hard predecessor of #33.** §49's dependency was "no caravan reception machinery"; `demographicsMigration.js:107-109/:231-242` landed it (CONFIRMED). What LG's journey waves still need from POP is the *individual* suspicion/rumour refusal — a smaller car that can ride LG-9 itself. POP-1 stays a #32 wave and the WY-4 ordering anchor.
- **The Q10 band-walker prefix is still the one hard infra blocker** for #33 (CONFIRMED absent at the slot).
- **The lighting wave (§898–§906) is spent**, so every flag minted by #32/#33/#34 from here lands dark and needs a *second* declared lighting before the freeze. That lighting is exactly what `docs/OWNER_SITTING_2026-09-15.md` item 1's §764.3 amendment would license. Nothing below can be frozen until item 1 is initialled — and #21's output-moving fixes have no door either (`HANDOFF_CURRENT.md:366`: "exactly ONE remains: the LIGHTING WAVE"). Both go on the sheet.
- **The brief's #21 → #22 → #23 order is stale** (§881.4 and six handoff pickups put the walk before the review); #22's recorded reason died with §739.1. Recorded for re-ruling, not re-sequenced here.

### C.2 Output-moving or not — the thing the freeze cares about

| Lane | Moves same-seed output? | Basis |
|---|---|---|
| #32 waves | NO at landing (each behind its own flag with a dormancy fence); YES at the second lighting | the flag-mint law (§49.3/§50.2, plus the 28-not-22 fourth obligation) | 
| #33 LG | NO at landing; **but** lighting `airField` moves eight pinned nulls (CONFIRMED), and lighting the LG-0 willingness gate is a doctrine-10 shift the volume already declares "scheduled, not smuggled" | `spatialDigest.js:186/:193`; `DESIGN_FP_ARCH_LG.md:70-78` |
| #34 W-OPS wiring, ENC-5 fold, drift door, SEAT-8, W-COIN-4 | NO (dark behind lit-in-no-preset keys; W-COIN-4 is display) | `subsystemRowsOps.js`, `simulationRules.js:535/:402` |
| #34 WEAVE stragglers | NAME-2 dark behind `markovNamingEnabled`; SEAM-4/POLIS-5/VAR-1b/VAR-2/ST-1 are generation-side — **classify each at charter**; VAR-1b re-homes 17 ambient `Math.random()` draws, which the record already calls a declared shift | §794.2(a) |
| #34 W-ARMS | derived-never-stored display leaf; still reader-visible arms on the dossier header → **PLAUSIBLE output-moving unless flagged**; §880.5 says the golden view model does not carry it | Car 0 measured nothing here; Car 1 must |
| `treasuryEnabled` lighting on three presets | YES — a declared preset shift the owner must take | `simulationRules.js:393-398` |
| #18 display trains | SPLIT — classify car by car (LT38 non-moving vs LT41 moving) | §930.6 |
| #20 | NO — an instrument act | `f73bdbf16` "no OSR movement" |
| #21 fixes | CAN BE — and today have no door | §879.6 |

### C.3 The proposed lane order (four build lanes at a time; research exempt)

| # | Lane | Cars | Output-moving | Why here |
|---|---|---|---|---|
| 0 | **The record fold** — this recon's counts into START_HERE §3j, the brief, the sitting; the eight stale sentences named in §A; `contributionLedgerShape` 28; the slot copy of §4 F9; the WC-15 receipt | 1 (ledger docs) | no | §3j's own "derive-don't-restate" rule is now satisfied by the skeptic's re-derivation; recording it retires the last UNKNOWN. Also shrinks the sitting's #34 "XL" to "three-quarters built". |
| 1 | **The Q10 band-walker prefix** (infra) | 1 | no | The oldest unpaid debt on this path (08-15); the only hard blocker of #33's bands. |
| 2 | **#34 free remainder** — W-OPS wiring A+B · ENC-5 grudge fold · W-COIN-4 · WEAVE SEAM-4/NAME-2/POLIS-5/ST-1 (VAR-1b/VAR-2 after classification) · the drift-door car under TE-VIRT-1 | ≈12–14 | no (dark/display), except VAR-1b declared | Cheapest way to close a programme that is 45/73 done; none needs an owner. |
| 3 | **#32 non-gated waves, to the gates**, in §3j's order: TR-4 (early-eligible, CR-2 pin first) · TR-5 · WF-6 · POP-1 → WY-4 (needs §2a rows) · WY-0 · WY-1 · IN-4 (wiring over `reputationRace`) · TR-6 (producer over the live scorer) · the critical path ES-6b → IN-5 → ES-7 → CW-3 last · everything else by family; **stop** at WC-6+, HB-3+, EP-4 row 4, unsigned WY rows | see §D | no at landing | Independent of 1 and 2; each wave carries its own fence. The stops are all already on the sitting (item 16). |
| 4 | **#33 design → build**, core first: re-price LG-0 against the built circle graph and the 28 literal · LG-1 predicate (allied half now; the toll arm when §125.1 is signed) · LG-2 pool as a W-NAVY refit · then airships, timers, cargo law, rescue, envoys, news chain, journey waves | ≈32 (28–36) | no at landing; `airField` and the willingness gate declared at lighting | Boards after lane 1 lands; the design lane needs §125.1's toll answer and the §46 widening signature before LG-2. Charter must name `blockadeTransport.js:20`'s `/airship/i` and `smuggle.js`'s "confiscation" as collision surfaces. |
| 5 | **W-ARMS Cars 1–3** | 3 | PLAUSIBLE unless flagged — Car 1 measures | Only after the veto window closes and the three Car-1 taste rows (seed root, shield, tinctures) are ruled. Prove the dark-landing claim before the freeze, not after. |
| 6 | **#18** — held on the banked rewrite; its car-by-car classification pass runs now (read-only) | 6 trains | split | Not schedulable today; the classification costs one cheap lane and stops it thrashing later. |
| 7 | **#20** the ONE trailing OSR mint + parity, after the last schema-bearing car of 2–5 | 1 | no | §482.2; rungs 19–20 already spoken for; must swallow LG's commitment ledger, civilContests and #32's batch in one act. |
| 8 | **The second declared lighting** → **GOLDEN freeze** [OWNER, after sitting item 1] | 1 + owner | YES (declared) | "Never freeze a corpus you are about to move" (§764.3). |
| 9 | **Walk + ONE regen** [OWNER] → **#21** the exhaustive review + fix cars, with a governed door for output-moving fixes | — | fixes can be | §879.6 clause 5; §881.4. |

Hazards every lane above carries (from memory, still live): `gate-mutex.sh` exits 0 after 40 polls (a gate line with no test count did not run); re-freeze `deno.lock` before any `--frozen` run; `git grep` without a rev reads the index; ledger edits start from `git show HEAD:<path>`; the generator golden is 525/525 red at the slot — golden claims are code-to-code.

---

## D. SIZES IN CARS PER LANE

| Lane | Cars | Label | Note |
|---|---|---|---|
| 0 record fold | 1 | CONFIRMED (docs only) | |
| 1 Q10 prefix | 1 | PLAUSIBLE | §99.3 "docketed to the next infra member"; no recorded price |
| 2 #34 free remainder | 12–14 | PLAUSIBLE | W-OPS wiring 2 · ENC-5 fold 1 · W-COIN-4 1–2 · WEAVE stragglers 6 · drift door 1 (eight acts, L-HOMES-7 priced) · ENC-7 rides the lighting. Gated and excluded: SEAT-8 1–2, SEAT-6 (deferred priced), TE-CEIL arms 2, SEAT-7a's tuning-register deferrals 2 |
| 3 #32 non-gated | 88 wave-units (78 unbuilt + 10 part) of which ≈67 are non-gated; **cars unknown** | UNKNOWN in cars | The record prices waves, not cars, and landed waves ran 1 slice (SP-C) to 6 slices (WF-1) to 18 cars (ENC-3 in #34). A car count is a lane-zero-of-lane-3 task: price per wave at charter. Any figure quoted today is PLAUSIBLE at best; the honest band is 100–200 cars. The 9-wave critical path (SP-D → ES-1..ES-7 → CW-3) is strictly serial; six of nine are done. |
| 4 #33 | 28–36 (≈32) | PLAUSIBLE — the code reader's estimate, not skeptic-tested | Pulled down by the built circle graph, airship cargo channel, custody ledger and reception refusal; pushed up by airships having no travel substrate. The record gives no car count; the brief says "XL". |
| 5 W-ARMS | 3 (+ Car 0 discharged) | CONFIRMED (§880.5) | The code reader's 6–10 is PLAUSIBLE and untested; the skeptic held 3 |
| 6 #18 classification | 1 (read-only) | PLAUSIBLE | the trains themselves: held |
| 7 #20 | 1 mint + parity | CONFIRMED machinery built and idle (`.observed-shape-readers-baseline.json` rung 18) | |
| 8 second lighting + freeze | 1 + owner keystroke | — | |

---

## E. WHAT COULD START TOMORROW WITHOUT ANY OWNER ANSWER, IN ORDER

1. **The record fold (lane 0)** — one ledger-docs car: the three counts; correct the brief's #32 family list ("logistics" → SPINE), #33's "never answered" sentence, #34's "sealed and unbuilt" and the season cap; the sitting's #34 XL estimate; §148.2's 22 → 28; the build-slot copy of `DESIGN_FP_ARCHITECTURE.md` §4 F9 (UNSIGNED → SIGNED); the WC-15 receipt; `subsystemRowsEncounters.js:54`'s stale "ENC-4 … BLOCKED" prose.
2. **The Q10 band-walker prefix** — one infra car under `tests/lint`.
3. **The two W-OPS wiring cars** — feed envelope + desk registration; the errand mint site. Dark; the content stays unsigned behind the doors exactly as the leaves did.
4. **ENC-5's grudge fold** — lift the fold at `envoyChanceMeetingLedger.js:70`, `npcLadderKernel.js:409`, `envoyChanceMeetingStage.js:717`, under `chanceEncountersEnabled`.
5. **The drift-door car** — the chair charters it under TE-VIRT-1 (§890.1's law lets the chair charter; the owner row at §900 is the manifest home's spelling, which the chair can take vetoably).
6. **WEAVE stragglers** SEAM-4 · NAME-2 (behind `markovNamingEnabled`) · POLIS-5 · ST-1; VAR-1b and VAR-2 after a classification note (VAR-1b is a declared shift by the record).
7. **W-COIN-4** — display row + realm aggregation.
8. **#32 in §3j's order, to the gates** — TR-4 with its CR-2 pin first, TR-5, WF-6, POP-1, WY-0, WY-1, IN-4, TR-6, then the critical path ES-6b → IN-5 → ES-7, then by family; every packet carries the 28-literal fourth obligation and `subsystemRowsVirtual.test.js`.
9. **#33 LG-0 re-price + LG-1's allied predicate half** — LG-0 is "compiled to execution-ready" (§148.1) but against a stale flag bill and a graph it did not know existed; re-price, then land the allied-or-co-belligerent willingness gate (the owner's own §46 sentence, no toll needed).
10. **#18's car-by-car classification** — read-only.
11. **The #32 per-wave car pricing** — the lane-zero-of-lane-3 read, so lane 3's size stops being UNKNOWN.

Waits on an owner line (see OWNER-QUESTIONS-32-34.md): sitting item 1 (the freeze and the second lighting), the #21 door, `treasuryEnabled` lighting, `civilContests` (SEAT-8), §125.1's toll, the §46 widening (LG-2 onward), the ransom persistence ruling, W-ARMS's veto window and taste rows, CR-WC-9 / HB Q1 / EP §7a row 4 / the WY §2a rows, encounters rows 4 and 9, TR-2b's sequencing.

Deferred and written down, not dropped: #18's six trains (owner's word, 09-14); #22's position (its recorded reason died with §739.1); the brief's #21-before-#23 order (refuted, not edited — the brief is not the chair's file to rewrite here); ST-4's calamity half (countersignature owner's, §811); SEAT-6 (deferred priced, §870.4); ENC-7 (rides the lighting, §887.1).
