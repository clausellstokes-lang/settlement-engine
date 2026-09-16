# RECHECK — items #32, #33, #34 after the second-angle pass (2026-09-15)

Reconciler: the chair's verification seat. Code read at the build slot
`lane-longtail-recon-slot` (claude/composite-r4 @ f73bdbf16) and the consist
`laneCONSIST-930` (@ a5876c0ea). Charters read from the ledger branch HEAD
(`git show HEAD:docs/…`; the main checkout has those files deleted). Every
finder claim below was opened by me before it was marked. Labels: CONFIRMED =
I read the code/test/charter at the cited lines; PLAUSIBLE = reasoning only.

## 1. THE ANSWER FIRST

**Did the second angle overturn any "not built" row?** Yes, but only a handful,
and every one of them is a case where the work landed under a *different name*
than the row was searched by. Nothing in any of the three items turned out to be
a whole programme secretly finished. In plain words:

- **#34**: two rows flip from not-built to BUILT (both WEAVE seam cars — the
  map-vs-engine comparison receipt, and the canonize-lockout verification with
  its cure), and one row moves from unbuilt to part-built (the genesis-war
  observation harness exists; the option itself does not). Everything else
  holds. CONFIRMED.
- **#33**: three rows move from unbuilt to part-built. A named envoy can already
  travel *by sea* with per-hop modality and sea hazards (dark behind a flag);
  a traveller can be trapped by a siege and released on peace by captor
  relation; a port's navy is locked "already at sea" until it stands down.
  Nothing becomes BUILT. CONFIRMED.
- **#32**: no row becomes BUILT. Two rows move from unbuilt to part-built: the
  five faith treaty terms are live in the catalog, draftable and readable (no
  faith-engine consumer); and the interior voice's two "prose numerics" cures
  landed under CW-0w slice 4 (the pool half is still owed). One evidence
  correction (the émigré registry row reads `built: true`). CONFIRMED.

### 1.1 Every ACTUALLY BUILT / PARTLY claim, opened and marked

#### #34 — politics, money, heraldry

| Row | Finder claim | What I read | Mark |
|---|---|---|---|
| SEAM-4 comparison receipt | ACTUALLY BUILT (3 of 4 angles) | `tests/lib/roadNetworkCanonReceipt.test.js` exists (9,662 B), header line 2 "WEAVE SEAM-4, THE S4 COMPARISON RECEIPT", `describe` at :93, imports `buildSpatialDigest` (:49) and `computeRoadEdges` (:51), asserts integers 41/35/23/18 and 92/67/59/33 at :118-129, fourth arm on NET-1 at :146+. `git log` → `83704ad3f TE-NET-1 car SEAM-4`. Ledger charter `DESIGN_FMG_WEAVE.md:43`: "test-only; the product-legend decision … goes to the docket only if the receipt finds divergence". The receipt is the whole deliverable. | **CONFIRMED BUILT** (the data angle's "PARTLY — no src shape" misreads a test-only charter) |
| SEAM-0 canonize lockout | ACTUALLY BUILT (concept, tests); PARTLY (ui) | Charter `DESIGN_FMG_WEAVE.md:39`: "reproduce or refute … If real: launch-relevant P1, cured by SEAM-2." `src/lib/spatialPackCapture.js:46-58` records the finding as REAL (`Number(null)===0` admitted every null cellId as cell 0) and the cure; `src/store/campaignSpatialCanonize.js:76-82` refuses with `spatial_placements_unresolved`; `tests/lib/spatialPackCapture.test.js:87` and :123 are titled `SEAM-0/SEAM-2` reproduce-then-clear arms. The verification ran, found a real bug, and the cure shipped. | **CONFIRMED BUILT (discharged)**. The first pass's "REFUTED as a verdict" is wrong in direction: the lockout was *reproduced*, then cured. |
| POLIS-5 genesis ongoing-war | PARTLY (ui angle only) | `scripts/observe-genesis-war-ramp.mjs` exists (9,275 B), header :3 "THE POLIS-5 OBSERVATION HARNESS (A1.2.8)", imports `composeInstantWorld` + `advanceCampaignWorld` (:34-35), `--ticks/--seeds`. Charter `DESIGN_FMG_WEAVE.md:65,115`: "held … dispatched only after … first-tick ramp behavior is observed"; "observation harness lands IN POLIS-2's act, with a terminal fork". No war option in `composeInstantWorld.js` / `worldPlan.js`. | **CONFIRMED PART-BUILT** — the chartered pre-step is done; the option is not. |
| DESK-5 texture batch | PARTLY | `HeraldBody.jsx:65` chip comment, `HeraldSection.jsx:38/:87` denominator footer, `tests/components/warFaithSurfacing.test.jsx:230` `describe('DESK-5 door textures')`. `?focus=` zero in src. | **CONFIRMED PARTLY** (unchanged) |
| W-OPS O1–O7 leaves | PARTLY ×7 | Importer census: `operationGrammar.js` imported only by `missionDispatcher.js`; `missionDispatcher`, `missionAcceptance`, `infiltrationDepth`, `envoyTaskCatalog`, `infiltrationDrift`, `operationsVoice` each have **zero** src importers. | **CONFIRMED PARTLY** — real leaves, no product path (unchanged) |
| ST-4 advisory half | PARTLY | `seaLanes.js:561` `PORT_ADVISORY_KINDS=['unpartnered_harbour']`, :569-571 phrase; only consumer is the barrel re-export `spatial/index.js:74-75`. Calamity half: nothing. | **CONFIRMED PARTLY** (unchanged) |
| ENC-5 words + fold | PARTLY | `npcLadderKernel.js:404-417` guard `if (ev.mark !== 'bond' …) return st;`; `envoyChanceMeetingLedger.js:69-72` "grudge … INERT … ENC-5 lifts the fold". | **CONFIRMED PARTLY** (unchanged) |

#### #33 — logistics and vessels

| Row | Finder claim | What I read | Mark |
|---|---|---|---|
| Envoy vessels (LG-7) | PARTLY (concept, data, tests); UNBUILT (ui) | `src/domain/roads/seaRoads.js:1-7` "Envoys, embassies, and captives travel by sea … MODALITY AWARENESS (per-hop land\|sea) … sea-hazard branch"; `classifyLegModes` :60-66; `currentSeaHop` reads `m.legModes` :112-118; `roads/state.js:87` typedef `legModes: Array<'land'\|'sea'>`; `roadsKernel.js:86` imports, :1032 writes `legModes` at dispatch. Dark behind `seaRoadsEnabled` (:30-38). No air/circle leg. | **CONFIRMED PART-BUILT** (ship arm real, dark; the ui angle is right that no surface shows it) |
| Siege lockdown + captor relation | PARTLY (concept, data, tests); UNBUILT (ui) | `roadsKernel.js:738` `m.trappedBySiege = true`, :317 blocks movement, :490 releases when no war front remains; :676 `hostileAtCapture = atOpenWar(…) \|\| HOSTILE_RUNGS.has(…)`, :685 stored, :783 `early = 'peace'` when relation normalises. `state.js:85/:105` typedefs. No exit modes. | **CONFIRMED PART-BUILT** |
| Unified vessel pool | PARTLY (concept, data); UNBUILT (tests, ui) | `realmVerbExecution.js:527-528` and :553-554 `if (records[ownerId]) return refused(… 'the fleet is already at sea')`; `navalKernel.js:333` `if (records[armyId]) continue; // this navy already has a live operation`; stand-down on arrival :304-317. No fleet size, no trade-or-war contention. | **CONFIRMED PART-BUILT** (the "unavailable until return" arm is enforced as a binary lock; upgraded from UNBUILT) |
| Transitive relay + predicate | PARTLY | `distanceRead.js:790-806` `augmentedAdjacency` folds teleport clique via `linkMin`; :817-822 `routingAdjacency` returns it only when `isTeleportNode(a)\|\|isTeleportNode(b)`. `teleportEdges.js:21-26` willingness is prose only; :193-213 emits full clique `{between,cost,capacity}`. | **CONFIRMED PARTLY** (unchanged; endpoint gate now citable) |
| Trade use / toll / preemption | PARTLY (data) vs UNBUILT (3 angles) | `TELEPORT_EDGE_CAPACITY=2` (:75) written at :203/:211; the only `.capacity` reader is `navalLayer.js:320` `seaLaneCapacityOf` over the SEA-LANE slot. `preempt` 0 in src. Trade crossing circles is LG-0/1's built row, not this row's three rule arms. | **CONFIRMED STILL UNBUILT** (the data angle's "PARTLY" credits a different row) |
| Airships | PARTLY | `tradeFlow.js:60` `MODALITY {…AIRSHIP:1.5…}`, :102 `AIRSHIP_RE`, :126-146 `settlementModalityWeight` over the live roster; `supplyKernel.js:506-512` consumes it per arrival; `foodImportRates.js:17-22` airship 0.3 / besieged 0.15; `spatialDigest.js:193` `airField: null` hard-coded. | **CONFIRMED PARTLY** (unchanged; cargo half larger than recorded) |
| Cargo asymmetry | PARTLY | `navalKernel.js:315` `seaLiftDelivered` stamp, :338-342 refuses re-mint. No return leg. | **CONFIRMED PARTLY** (unchanged) |
| News carriage | PARTLY | `rumorNetwork.js:72-101` six carriers; :742-750 all six dispatched incl. `RUMOR_CARRIER_SHIP` (:745) and `RUMOR_CARRIER_TELEPORT` (:750). No airship carrier; relay is settlement→settlement. | **CONFIRMED PARTLY** (unchanged) |
| Confiscation + inspection split | PARTLY (data) vs UNBUILT (3 angles) | `supplyShipments.js:209` `routeIntercepted(path, isHostileToDestination)` walks intermediary SETTLEMENTS; `commodityFlow.js:390-395` `shipmentCut` → load lost; live at :573. No army actor, no take/turn-back branch, no observed×believed product. | **CONFIRMED STILL UNBUILT, substrate real** (a gate-settlement cut, not the chartered army seizure) |
| Capacity vs throughput | PARTLY | `reinforcement.js` has 0 import statements, one importer (`warHomeCosts.js`); `supplyKernel.js:506-512` multiplies roster modality weight into route arrivals. The data angle's "they meet" is a different pair of reads (roster weight × flow), not reinforcement capacity × route throughput. | **CONFIRMED PARTLY** (unchanged) |
| Size-scaled speed | UNBUILT | `armyTransit.js:293-301` `armyMarchWeeks(baseHopWeeks, readiness01)` — two inputs, no size. | **CONFIRMED STILL UNBUILT** |

#### #32 — the engine family waves

| Row | Finder claim | What I read | Mark |
|---|---|---|---|
| WF-6 faith terms | PARTLY (concept, tests); UNBUILT (data, ui) | `peaceTermsCatalog.js:228-245` carries `shared_rite`, `pilgrimage_right`, `tolerance_guarantee`, `missionary_access` (`executor:'grant'`) and `temple_restitution` (`executor:'transfer'`), all `family:'faith'`; `pactFormation.js:174-179` `faith_communion` draft ladder; `treatyEnforcement.js:270-300` five readers. Callers outside their module: **zero** (only a comment at `couplingRegistryGrammar.js:148`). | **CONFIRMED PART-BUILT** (upgraded from UNBUILT). The data angle's "TERM_CATALOG carries no faith term" is **REFUTED**. |
| INT-8 interior voice | PARTLY (concept) vs UNBUILT (3 angles) | Ledger charter `DESIGN_FP_ARCH_INT.md:588` "The two cures + the habitat (one commit, J-INT-9): deploymentReturn.js…". Slot: `tests/helpers/proseNumericsWalk.js:6-8` follows `.push(...)` writes, :228-236 `collectArrayPushes` by const-array binding (landed `e30770bd0 CW-0w slice 4`); `tests/lint/proseNumerics.test.js:477-482` plants the exact `postureReasons` shape; `relationshipMemory.js` has **0** `toFixed`; `deploymentReturn.js:148/:171` export `returnMusterWordFor`/`returnOddsWordFor`; `tests/domain/deploymentReturnHeraldWords.test.js` exists. Pools half absent. | **CONFIRMED PART-BUILT** (upgraded). The volume's own recon row S18 ("both INT-8 cures still owed") is stale against the slot. |
| INT-3 émigré seam | PARTLY, evidence corrected | `envoyErrandVocabulary.js:357-363` row reads `built: true`; `emigreErrand.js:102` exports `emigreErrandFor`; :13-20 "NOTHING IN src/ CALLS THIS … IDENTITY CLAIM"; no src caller. | **CONFIRMED PARTLY** (unchanged verdict; the first pass's `built:false` cite was the docstring quoting history) |
| IN-1 the mirror | PARTLY, stronger | `src/domain/display/neighbourMirror.js` exists; `RelationshipsTab.jsx:11` imports, :62 calls `neighbourMirrorLines` with campaign worldState, :173 renders `NEIGHBOUR_MIRROR_HEADING`. `mirror_shift` producer: none (one comment). | **CONFIRMED PARTLY** (unchanged; the "still owed" note on neighbourMirror.js:143 is stale) |
| IN-4 the road | PARTLY (data, tests) vs UNBUILT-substrate (concept, ui) | `routeNetworkConsumersRace.js:322` `export function reputationRace`; importers: one certification row (`subsystemRowsWaves.js`, a module list) and two tests; `envoyErrandVocabulary.js:351-356` couriers row `built: false`. | **CONFIRMED STILL UNBUILT, substrate real** (a computing function with no engine caller, and the registry says not built) |
| POP-5b permit table | PARTLY (tests) vs UNBUILT (3 angles) | `demographicsResponses.js:244-251` is the only `moverPermitted` caller and it is P4's founding gate; `migrationRightFor` (`treatyEnforcement.js:300`) has zero callers. | **CONFIRMED STILL UNBUILT, substrate real** |
| GR-4 succession | PARTLY | six `treatySuccession*.js` modules; `treatyBreach.js:213` mints `SUCCESSION_REPUDIATION_TYPE`; :245-250 disposition arm "DELIBERATELY NOT ON THE SUCCESSION ROAD"; `grammarReceiptPools.js:115-121` names `honored_by_silence`/`credibility_charge` deferred. | **CONFIRMED PARTLY** (unchanged) |
| GR-5 renewal | PARTLY | `pactFormation.js:160-164,193` `renewal: []` tombstone; `peaceTerms.js:759` writes `worstObservedEver`; `pactAmendment.js:160` reader, unconsumed in src; `subsystemRowsCompact.js:469` "NO CONSUMER AT THIS WAVE … deliberately does not build the renewal window…". | **CONFIRMED PARTLY** (unchanged) |
| TR-9 | PARTLY | `certification/` holds `tradeConvergenceContract.js` + war only; `simulationRules.js:255-258` "TR-9 converts all eight to rows". | **CONFIRMED PARTLY** (unchanged) |
| WF-8 narration | PARTLY | `faithNews.js` imported only by `religiousContest.js`; `faithNarrationEnabled` 0. | **CONFIRMED PARTLY** (unchanged) |
| ES-6 double agent | PARTLY | `espionageLeak.js:2` "ES-6a"; `espionageProductStage.js:111` imports, :753 calls; `ES-6b` 0. | **CONFIRMED PARTLY** (unchanged) |
| GR-6 mediation | UNBUILT | `TreatyPanel.jsx:100-103` `doc.mediatorLine` is the peace-table mediator; `mediationGeneralizedEnabled` 0. | **CONFIRMED STILL UNBUILT** |

**Consist check (CONFIRMED):** `git diff --stat f73bdbf16 a5876c0ea -- src/ supabase/` on laneCONSIST-930 is 45 files, all chronicle/display/pricing/webhook/AI-bundle work (RelationshipChronicleSection, humanizeEngineTokens, stripe-webhook, aiCharterBundle…); none is a #32/#33/#34 target. Nothing moved today.

## 2. CORRECTED COUNTS

| Item | First pass (BUILT / PART / UNBUILT of N) | After recheck | What moved | Label |
|---|---|---|---|---|
| #32 | 28 / 10 / 78 of 116 | **28 / 12 / 76** | WF-6 → PART, INT-8 → PART | CONFIRMED (each move read at the cited lines; the base counts are the first pass's fold tally, PLAUSIBLE) |
| #33 | 1 / 5 / 12 of 18 | **1 / 8 / 9** | Envoy vessels, siege lockdown + captor relation, unified vessel pool → PART | CONFIRMED |
| #34 | 45 / 11 / 17 of 73 | **47 / 11 / 15** | SEAM-4 → BUILT, SEAM-0 → BUILT (discharged), POLIS-5 → PART | CONFIRMED |

Headline unchanged in shape: #34 is about two-thirds built by unit count (47 of 73), #32 about a quarter (28 of 116), #33 has one built member and a growing bed of substrate under names nobody searched for.

Two record corrections to carry beyond the counts (both CONFIRMED):
- The programme table's "TE-CEIL 0 hits — no cure" (SEAT-2a/SEAT-4 row) is a search artefact: TE-CEIL landed (`settlementStrategyReads.js` extracted; `mechanismLitCoverage.test.js:190`). The two seat cars are still unbuilt, but the stated blocker is the effective-line baseline of `settlementStrategy.js`, not an absent TE-CEIL.
- `DESIGN_FP_ARCH_INT.md` recon row S18 ("both INT-8 cures still owed") is stale: both cures are in the slot under CW-0w slice 4.

## 3. GENUINELY MISSING — rows that stayed STILL UNBUILT across all four angles

One line each, in plain words, for the owner. Every line CONFIRMED by at least one grep I ran myself or a file I opened; the long tail of #32 rows I did not personally reopen are marked PLAUSIBLE (four independent finders agreed and the first pass agreed).

### #32 — the engine family waves (76 remain; the ones that matter most)
- **GR-6** A neutral third party cannot offer to broker a dispute outside the peace table. CONFIRMED
- **GR-7** Nobody measures how treaties end or how often they are kept. CONFIRMED
- **IN-2** You cannot plant false information to bait an enemy. PLAUSIBLE
- **IN-3** There is no counter-spying: no sweeps, no suspicion, no catching an intercept. CONFIRMED (`INTERCEPT_ENDINGS=['read','refused']`)
- **IN-4** Couriers and the "who reaches the gate first" race exist as a function nothing calls. CONFIRMED
- **IN-5** The Herald has six desks; there is no seventh "knowledge" desk. CONFIRMED (`HERALD_SECTIONS` frozen six)
- **IN-6** No instrument measures how far belief drifts from truth. PLAUSIBLE
- **TR-2 / TR-2b** No merchant houses or syndicates as actors with fortunes. PLAUSIBLE
- **TR-3** Prices react to real scarcity, never to *believed* scarcity. PLAUSIBLE
- **TR-4** Grain does not move as a distinct food-class trade flow. PLAUSIBLE
- **TR-5** Treaties cannot carry trade terms (exclusivity, market access, toll exemption are typed rows with no producer). PLAUSIBLE
- **TR-6** Nobody can corner a market or speculate in a famine; the scorer exists, the writer does not. PLAUSIBLE
- **TR-7** No joint ventures. PLAUSIBLE
- **TR-8** No travelling commercial agent (registry row `built:false`). PLAUSIBLE
- **WF-0, WF-2, WF-3, WF-4, WF-5, WF-7, WF-9** No observance census; no pilgrims or legates; deity stances have no consequences beyond two; no omen readings; no schisms or underground creeds; no tithe or temple wealth (the tree says "templeWealth HAS NO WRITER"); no faith convergence instrument. PLAUSIBLE
- **POP-1, POP-2, POP-3, POP-4, POP-5a, POP-6, POP-7** Migrants choose by truth, not belief; the commons cannot refuse a levy; nobody remembers who left; plagues do not stage as arcs; nothing happens to a column on the road; the hopeful headline half is unwritten; no population convergence instrument (owner-gated anyway, CR-FP-6). PLAUSIBLE
- **POP-5b** The permit table has one consumer (founding); the other four never read it; treaty migration rights have no caller. CONFIRMED
- **INT-1, INT-2, INT-4, INT-5, INT-6, INT-7** The ruler's books stay war-only; bloc positions do not advise; strain is not attributed; no founding wound or memory seam; no deliberate forgiveness/burial ledger; no interior certification rows. PLAUSIBLE
- **CW-1, CW-2x, CW-3** No cascade governor; no coupling join on the cause walk; no coupling measure closing FP. PLAUSIBLE
- **ES-7** No espionage voice on the Herald (six kinds "DELIBERATELY EMPTY: ES-7's"). PLAUSIBLE
- **WY-1, WY-2 …** No real-unit distance scale; no durable severity rumors. PLAUSIBLE

### #33 — logistics and vessels (9 remain)
- Circles have no toll, no free passage for allies, no wartime priority; edge capacity is written and never read. CONFIRMED
- Ships do not rebuild after losses because losses are never recorded. CONFIRMED
- Nothing evacuates a town whose only road is gone. CONFIRMED (`Emergency extraction` is a catalog toggle with no reader)
- A spy cannot hide inside a caravan; no entry-route spectrum or individual suspicion. CONFIRMED (tests pin "none is built")
- An army on a road cannot seize or turn back a caravan; the only cut is a hostile gate settlement on the path. CONFIRMED
- A captive with no home settlement cannot exist (the ransom minter requires a home). CONFIRMED
- Big armies march at the same speed as small ones. CONFIRMED
- Neither `circleNetworkEnabled` nor `vesselFleetsEnabled` exists anywhere. CONFIRMED
- No migration widened the saved shape; `spatialLedgers.commitments` is MOMENTUM's, not LG's. CONFIRMED

### #34 — politics, money, heraldry (15 remain)
- **W-COIN-4** The treasury shows one word on one tile; no fuller panel, no realm-wide total, nothing in the PDF. CONFIRMED
- **SEAT-2a §H + SEAT-4** The settlement chooser reads no foreign-seat term; blocked by `settlementStrategy.js`'s size baseline. CONFIRMED
- **SEAT-6** No standings/occupation/seat panel exists (zero hits, no landing commit). CONFIRMED
- **SEAT-8** No intervention market, no `civilContests` ledger (a walker asserts its absence), no instigation verb. CONFIRMED
- **W-OPS wiring A + B** The seven operations leaves reach nothing: no Herald desk, no feed envelope, and the errand minter never stamps a catalog task. CONFIRMED
- **NAME-2** No Markov name generator (`markov` → one surname). CONFIRMED
- **VAR-1b, VAR-2** The heightmap interpreter is not ported; site scatter is still seeded jitter, not terrain-driven. CONFIRMED
- **ST-1** Faiths have no recorded origin/lineage field. CONFIRMED
- **ENC-7** The elite bleed is not wired into encounters (`eliteBleed.js` has no importer). CONFIRMED
- **Drift door** `characterDriftEnabled` is in no manifest; the whole lived-experience fold has no production caller. CONFIRMED
- **W-ARMS Cars 1–3** Generative heraldry: zero heraldic vocabulary in the tree; the 8-emblem pool is the pre-state. CONFIRMED

## 4. WHERE THE FOUR ANGLES DISAGREED, AND MY RULING

| Target | Split | Ruling |
|---|---|---|
| SEAM-4 | BUILT (concept, tests, ui) vs PARTLY (data) | **BUILT.** The charter is test-only; a data angle cannot see it by construction. |
| SEAM-0 | BUILT (concept, tests) vs PARTLY (ui) | **BUILT (discharged).** The ui finder held back because the cure is labelled SEAM-2; the charter itself says "cured by SEAM-2". Nothing is owed to SEAM-0. |
| POLIS-5 | PARTLY (ui) vs UNBUILT (3) | **PART-BUILT.** The harness is the chartered pre-step (§115 "lands IN POLIS-2's act"); the option is held pending its readout. |
| WF-6 | PARTLY (concept, tests) vs UNBUILT (data, ui) | **PART-BUILT.** The data angle's "no faith term in the catalog" is refuted at `peaceTermsCatalog.js:228-245`; the ui angle is right that no treaty surface renders them. |
| INT-8 | PARTLY (concept) vs UNBUILT (3) | **PART-BUILT.** The three UNBUILT angles searched the label `INT-8` (zero) and missed the cures that landed as CW-0w. Read at the cited test/helper/src lines. |
| Unified vessel pool | PARTLY (concept, data) vs UNBUILT (tests, ui) | **PART-BUILT.** The "already at sea" refusal is real code with a reader; the tests angle's "navy re-operates on arrival" is the same rule seen from its release side. |
| Envoy vessels | PARTLY (3) vs UNBUILT (ui) | **PART-BUILT.** `legModes` is persisted, written and read; the surface is modality-blind, which is why the ui angle saw nothing. |
| Siege lockdown | PARTLY (3) vs UNBUILT (ui) | **PART-BUILT.** Same shape: real engine state, no surface. |
| Trade use of circles | PARTLY (data) vs UNBUILT (3) | **STILL UNBUILT.** Goods crossing circles is LG-0/1's built row; this row's three arms (toll, free passage, preemption) are all absent. |
| Confiscation split | PARTLY (data) vs UNBUILT (3) | **STILL UNBUILT, substrate noted.** `routeIntercepted`/`shipmentCut` is a gate-settlement cut, not an army seizure, and has no split. |
| IN-4, POP-5b | PARTLY (1–2) vs UNBUILT-with-substrate (2–3) | **STILL UNBUILT, substrate noted.** A tested function with no engine caller and a registry row reading `built:false` does not make a wave; same standard as the first pass applied to IN-4. |
| Capacity vs throughput | "they meet" (data) vs "they never meet" (3) | **PARTLY, unchanged.** The data angle found roster-weight × flow meeting in `supplyKernel.js`; the row's pair is reinforcement capacity × route throughput, and `reinforcement.js` imports nothing. |

## 5. GREP TRAPS SURFACED BY THIS PASS (for the hazards fold)

All CONFIRMED by the finder's cited line and, where I opened it, by me.
- `spatialLedgers.commitments` = MOMENTUM's actor›course stock (`momentum.js:14/:187`), not an LG commitments ledger.
- `spatialLedgers.dispatchWillingness` = merchant dispatch appetite (`supplyKernel.js:581`), not circle passage willingness.
- `roaming` (72 files) = the roaming-stressor twin, not roaming captivity.
- `shipyard`/`drydock` = the war-navy capability regex (`navalLayer.js:130`), not a rebuild site.
- `travelMode` = the world's derived spatial axis instant/compressed/standard/slow, not an airship mode.
- `toll` everywhere = entrepôt/road-gate/smuggle-branch tolls, never a circle fee.
- `mediatorLine`/`doc.mediator` in TreatyPanel = the landed peace-table mediator, not GR-6.
- `omen` in the UI = V-16 THE AUSPICE (a forecast preview), not WF-4.
- `commons` in the UI = the landing page's gallery section, not the commons voice; `commonsVoice` ≠ `commonsArc`.
- `syndicate` in tests = the undercity crime layer, not TR-2b.
- `avalanche` = the FNV-1a hash mixing step, not a calamity word (ST-4).
- `markov` = the surname "Marković" at `namingData.js:2240`.
- `ST-1` matches `DS-GHOST-1` / `DS-TEST-1` substrings.
- `§H` in `settlementStrategy.js` = W-PEACE-1's causal-reasons layer, not W-SEAT's §H.
- `interventionEnabled` = SEAT-2c coup-tipping (built), not SEAT-8's market; `instigat` = the war-stressor/moral-drift feed, not D11.
- `heightmap` = FMG's own terrain editor button, not VAR-1b/VAR-2.
- `Emergency extraction` (`institutionServices.js:1581`) = a catalog toggle with no reader; counts against LG-6.
- `tests/domain/demographicsWorldsHand.test.js:524` "the permit table is TOTAL" = P4.4's ladder, not POP-5b.
- `Herald*` (28–40 files) = the news desk, not heraldry (W-ARMS).

## 6. CAVEATS
- Read-only pass. No suite was executed; "CONFIRMED" means the code or test text was read at the cited lines on the slot, not that a run was observed green.
- The first-pass base counts (28/10/78 · 1/5/12 · 45/11/17) are the fold's own tallies and were not re-derived row by row here; only the moved rows were re-read. The corrected totals therefore inherit any error in those tallies (PLAUSIBLE at the total, CONFIRMED at each delta).
- The #32 long-tail rows I did not personally reopen are marked PLAUSIBLE above; four independent finders plus the first pass agreed on each, and every one of those finders cited a self-declaring comment or a zero-hit flag.
