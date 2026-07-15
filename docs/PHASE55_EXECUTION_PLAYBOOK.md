# THE PHASE 5.5 → LAUNCH EXECUTION PLAYBOOK
## The complete architecture + management protocol for everything remaining
### Fable 5, 2026-07-12 — written as the succession document: EITHER Fable or Opus executes this end-to-end

This document is the single source of truth for the remaining program. It assumes Fable may be
unavailable for long stretches. Everything is pre-decided to the depth an Opus implementer/manager
can execute WITHOUT architectural guessing. Where a decision genuinely cannot be pre-made, it is
marked ⚠️ OWNER or 🔱 FABLE-ON-RETURN — there are deliberately few of these.

BINDING COMPANIONS (do not duplicate, reference): docs/PHASE55_SPATIAL_ENGINE_DESIGN.md (PARTS I-VII
— the design + six grounding verdicts), the committed briefs in docs/briefs/ (KEYSTONE_BRIEF,
MODULATION_BRIEF, SEASONS_A_BRIEF, FP1_FIRSTPAINT_BRIEF), memory/owner-fix-philosophy.md (the
standing loop: Fable surveys → Opus verifies+implements at full fidelity → bold-over-safe within
the constitution → check after each fix).

---

# PART 0 — THE OPERATING PROTOCOL (read first, every session)

## 0.0 THE STATE LEDGER (the portable truth — a successor AI starts HERE)
This ledger is maintained BY LAW (§0.3 step 7): every commit appends/updates a row. It is the
in-repo replacement for any assistant's private memory. Companion state that does NOT transfer to
a new AI: the Claude memory dir + session task lists — everything needed is HERE + the design doc
+ docs/briefs/ + git history. Amendment history for the docs themselves is in `git log --follow`.

### 0.0.1 ACCOMPLISHED (chronological, with commit hashes — verify any claim via `git show <hash>`)
| Wave / act | Commit(s) | What + notable deviations |
|---|---|---|
| Reunification W4a-W4e (Library/Realm/Gallery/Account/Dossier) | pre-24858b5d history | product surfaces onto OUR floor; W4e held the FaithSection constitutional gate |
| W4f Generate/PDF/Compendium | 24858b5d | draft export, save recovery, sealed Faith&War PDF chapter (three-fold gate, test-pinned) |
| W4g Admin | 1af43b01 | THE PII FIX: raw profiles.select gone, audited edge only; SimTuning stop-reported |
| W4h domain-display read-models | 56ca62ad | armyStrength/tradePressure/visibilityAudit verbatim (lineages had converged); budget→1,441,000 |
| RP-1 regressions | 508713fb | 7 real defects incl. AutoSaveChip integrity + SimRules write-guard; item 5 completed by manager |
| W4f last-mile | 2674802f | premium Faith&War chapter now REACHES premium exports (was dead-pathed); nameById plain-map law |
| W2 conjunction content | d7cc13df | 1,662 lines / all 2,016 conjunctions above floor; display sidecar + 4-rung ladder; goldens untouched |
| Chip fixes | 85bb8c51, a6f2a5bb | generator fails closed on options-in-neighbour-slot (killed the trace flake); copy-pin re-point |
| CL-0 control layer | 0359d243 | profile enums (virtual, absent=legacy-byte-exact), authorityFor, FROZEN mode, presets 3→5, rulesetLog receipts, dialog v2; REAL BUG fixed (LivingWorldGates faith toggle was droppable); worldState ledgers consolidated data-driven |
| 5.5-W0 foundations | dd4f522c | computeLawfulness/computeMalice + settlementAlignment (substrate, no consumers); temporal audit ZERO violations + gate extended; maintained 30y soak (FINDINGS: stasis on record; population→~390-470 attractor under war depth ⚠️ owner-parked); trade-primitive tests (premise corrected: suites existed); A3 full_simulation war sub-flags lit (+192B) |
| FP-1 first-paint | 4edc5bf8 (+a0145671 parking) | −186,998B (−13%): segmented copy, registry-prose split, exportPosture leaf, DERIVED data-chunk graph, graph-derived icons; budget 1,441,000→1,256,000 RATCHETED; store-slices STOP→parked §0.6 |
| SEASONS-A food year | b17b89db | granary rhythm term-for-term-zero at swing=0 (byte-identity by construction); hungry gap emergent; seeded year variance; seasonsEnabled default OFF, living_realm+full_simulation lit; regenerated CL-0 pin STRUCTURALLY verified. Noted: pre-existing living_realm saves re-infer realistic_regional (accepted display-only drift) |
| 5.5-K KEYSTONE (merged from claude/sad-poitras-1d587b) | f4d1aeef (+9f3c48d6 parking) | frozen integer digest (multi-source Dijkstra, territory/gates/tiers/distances/receipts, 3 version axes, 4 reserved null slots); digest sizes 47/61/87KB; DEVIATION: pack.cells capture was an INJECTED seam → wired later in 5.5-M; worldState auto-merge with SEASONS-A verified |
| Session mode + Foundry (merged from claude/peaceful-volhard-0ad3f1) | df217415 (5 commits) | Foundry VTT export + Session Mode; faithEventFilter default-closed (manager-read, 50/50 tests); zero conflicts |
| 5.5-M MODULATION + live capture | 18fc15f2 | trade/faith × distanceWeight (floor .35, modulated EXACTLY once), propagation ARRIVAL LATENCY (spatialArrivals ledger, news dated at arrival), hopWeeks calibration receipt (1wk/median-primary-hop); live read-only getSpatialPack bridge + capture registry; freeze-first-capture encoded; +17B (ledger key literal, keystone precedent) |
| any-cast restoration | b6959c9a | the parallel-worktree tax typed honestly: 13 holes→0 across keystone/worldState/faithEventFilter; ratchet EXACTLY 2252; esbuild-proven comments-only |
| Playbook + re-scope + ledger | 53943214, 2ebe1fd6, 759de2de | this document; OWNER RE-SCOPE (movers=launch); the STATE LEDGER (0.0) |
| STEP 3.5 RUMORS & NEWS + Perfect-but-Delayed | 884b5011 | rumorNetwork.js (packet + per-settlement top-K ledger, hop-by-hop trade carrier, lineageIds day-one, independence-weighted corroboration, organic degradation tailed distribution, tick-age expiry); settlementRumors.js read-model (DM truth vs player WHITELIST — enumerated, deity-name fails CLOSED, latentPantheon excluded — manager-verified constitutional); infoMode omniscient/perfect_delayed/unreliable (living_realm→delayed, full_sim→unreliable, prospective floor); RumorsTab lazy. wizardNews schema UNTOUCHED. +243B eager (spec-mandated §3.2-7) → closure 1,255,937/1,256,000 |
| WAVE A THE BELIEF MAP | a4e04ad5 | beliefMap.js — the belief() selector w/ IDENTITY FALLBACK (dormant/self ⇒ the ORIGINAL ground-truth fn verbatim, zero forks — manager-read); advanceBeliefMaps modeled node-for-node on advanceInstitutionTolerance (independence-weighted reconciliation, silence-decay, contradiction-widens, cold-start=ground-truth-at-canonize); the 3 settlementStrategy reads re-plumbed; misjudgment-as-cause (W-C5-shaped + news) when belief diverges >2 bands; scoringObjective.js default descriptor (byte-identical); settlementBeliefs.js DM read-model (truth/belief/divergence). Gate = spatialCanonVersion+infoMode NEVER settlementStrategyEnabled (pinned). +13B eager (the beliefMaps ledger key) → closure 1,255,950/1,256,000 = **50B HEADROOM**. CL-0 rogue-family war pins replay identical; suite 7819/7819 |
| M1 EMBATTLEMENT ROUTING (mover ladder #1) | (this commit) | embattlement.js — embattlement as a first-class CONTINUOUS region scalar (0..1 `level`), NOT a boolean: a conditionally-materialized ledger `{id → {level, phase, sinceTick, lastTick}}` advanced at tick-time from the ramp (siege+occupation acute drivers, war_exhaustion+high-crime sustain, bounded security counterforce capped so a garrison can't lift a live siege). HYSTERESIS = the co-built brake (enter 0.55 / exit 0.30 deadband + 6-tick exit dwell; `phase` is an INTERNAL latch, zero consumers — manager-grepped: the only `.phase==='embattled'` read in the tree is embattlement.js:204). Routing = RE-SCORE k cached candidate routes (candidateRoutes DERIVED from the frozen digest gates/distanceMatrix, WeakMap-memoized, NEVER re-pathfound — no keystone amendment needed) weighted by W0 risk-tolerance (lawful reads danger true); the scalar feeds a CONTINUOUS danger cost (affine, proven), never a gate. Seeded/sporadic/bounded banditry on channel strength (real shipments ride it in M2). +15B eager (the one `'embattlement'` ledger literal) → closure 1,255,965/1,256,000 = **35B HEADROOM**. Gates (manager re-verified): M1 23/23; any-cast 2252; goldens 72/72 byte-identical (dormant on aspatial AND peaceful-spatial fixtures — crime/exhaustion alone never cross 0.55); build+verify:dist 108/108 |
| M2 CARAVANS / SUPPLY-STARVATION (mover ladder #2) | (this commit) | supplyShipments.js (pure engine) + supplyKernel.js (adapter) — the map makes trade TRAVEL. Per-consuming-institution supply links pre-rank K cheapest REACHABLE producers from the frozen digest (rankSupplySources); FAILOVER = O(K) list-walk (pickSource), NEVER a re-solve. AGGREGATE in-transit shipment ledger keyed `${settlement}:${institution}:${input}` — ONE record per active link, NEVER per-wagon (cardinality manager-verified); rides M1 hopWeeks; real shipments ride M1 banditryLoss on the delivered fraction. GENERALIZED supply-starvation: new `supply_starved` impairment KIND in status.js (JSDoc-only, 0 runtime) generalizing blockadeTransport's 'access' — DISJOINT cause namespace `supply-starved:` (never re-triggers 'stressor-blockade:'); triggers ONLY on extended TOTAL cut (all K severed AND buffer empty AND not fragile-braked); TEMPORARY (lifts on arrival); mandatory causal receipt; foodStockpile stays food (no double-count). CO-BUILT BRAKE: <2 independent sources ⇒ FLAG fragile, don't starve. M2b (AUGMENT): resolveSiegeVerdict gains supplyPush = STRENGTH·clamp01(interdiction) folded into logOdds — interdiction 0 (aspatial/fed) ⇒ +0 ⇒ BYTE-IDENTICAL (all 6 siege pins manager-re-verified). Wired BEFORE the war layer (this-tick starvation feeds M2b). +18B eager (the one `supplyShipments` key) → closure 1,255,983/1,256,000 = **17B HEADROOM**. Gates (manager re-verified): M2 34/34; any-cast 2252; goldens+6 siege pins 108/108 byte-identical; build+verify:dist 108/108; full suite 7867/7867 |
| M3 SEASONS-B / WINTER ROADS (mover ladder #3) | (this commit) | distanceRead.js (read-time seasonal engine) + spatialCost.js (buildSeasonalOverlay cost law). The digest's reserved seasonalOverlay slot LIGHTS: per-season × per-terrain cost multipliers, MULTIPLICATIVE, applied at READ time — pathCost reads the FROZEN distanceMatrix scalar then × the season×terrain factor (matrix NEVER re-baked; manager-verified grep = zero digest writes). SLOW-NOT-SEVER: every factor finite ∈ [1, SLOW_NOT_SEVER_MAX=6], blend is a cost-weighted avg ⇒ bounded, hopWeeks ≤ 52, never Infinity/cut (a snowed-in town is rescuable by spring). OPT-IN dormancy: buildSpatialDigest lights the overlay ONLY on seasonalRoads:true; default → overlayVersion 1 + null → every byte-frozen golden BYTE-IDENTICAL (digest hash proven identical); read gate activeSeasonalOverlay returns null when absent ⇒ multiplier 1.0. NEW live canon opts in (overlayVersion 2, §V.1 receipted re-canonize); existing SAVED canons keep frozen v1, read dormant. Consequences EMERGE: winter lengthens M2 shipment + 3.5 rumor arrivals (info runs cold), SPRING-THAW news burst (season_marker score 70) seeds the rumor ledger on the winter→spring crossing (gated on activeSeasonalOverlay, NOT seasonsEnabled), route CHOICE reroutes a winter mountain pass to a plains detour by cost. Storm hooks pre-wired for M8. BUDGET-FREE: rides the existing spatialDigest slot, season derived free from seasonForTick → closure 1,255,983 UNCHANGED (a chunk-graph +49B artifact was diagnosed + fixed by keeping the blend inside distanceRead). ONE existing test updated (campaignWorldPulseSpatialCanon: a live-canonize BEHAVIOR assertion, not a byte-golden — new granular assertions for the intended overlayVersion-2 behavior; manager-verified legit, not a masked regen). Gates (manager re-verified): seasonalRoads 17/17 + new seasonalOverlay golden 3/3; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 7887/7887 |
| M4 MIGRATION-WITH-MORTALITY (mover ladder #4) | (this commit) | migration.js (pure engine) + cultureDistance.js (the §II.5-2 5-term composite, LIVE read) + migrationKernel.js (adapter). Population is a SPATIAL FLOW: a shed pool → a refugee column that travels a route, loses people to TWO mortality sinks (origin τ-scaled + road embattlement×season, both BOUNDED — "rescuable not annihilated"), and arrives fewer+later at a 4-axis destination (closeness/culture/safety/richness) with congestion pushback + scatter-floor. THE CONSERVATION INVARIANT holds BY CONSTRUCTION (departures == originDeaths + roadDeaths + Σarrivals, exact integers; asserted per dispatch + on a 60-tick soak, ledger fully drains). Origin-loss-proxy RECONCILED: aspatial abs*0.45 path runs verbatim when dormant (spatialActive default falsy → byte-identical); spatial sheds the same abs (byte-parity origin trajectory), the abs*0.45 BECOMES the origin-mortality stage (never both). RELEASE (pre-apply arrivals credit) / DISPATCH (post-apply shed→columns) two-phase. cultureDistance reads only live state (proven never-frozen). MORTALITY IS AGGREGATE-ONLY — no npc id touched (product boundary; test: named NPC survives max-mortality tick). OWNER-DELEGATED ATTRACTOR TUNING (retunable constants documented): 6y war+famine 8-settlement soak → hub 3.16× mean (congestion caps it, NO megacity), min 493 (NO annihilation), 83.7% survival, total 84% of start (war-sink not collapse), NO A→B→C chain-collapse. BUDGET-FREE (nests under spatialLedgers via setSpatialLedger) → closure 1,255,921 UNCHANGED. Gates (manager re-verified): M4 29/29; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 7916/7916 |
| M5 ARMY-TRANSIT + FIELD COMBAT (mover ladder #5, the war convergence) | (this commit) | armyTransit.js (pure engine) + armyTransitKernel.js (adapter). Armies gain POSITION (position-along-path ledger nested under spatialLedgers; hopWeeks × speed, readiness/terrain modulate); crossing-path COLLISION → the §5 bounded FIELD RESOLVER — win prob = logistic(FIELD_K·(share−0.5)) with a NO-HAND-OF-MIRACLE clamp (P(upset) EXACTLY 0 past 3:1 — manager-verified 300v100→1, 100v300→0), effective strength = size×readiness×supplyQuality×funding×ground×(1−fatigue), fork battle:${[a,b].sort()}:${tick}. Collision O(armies²) bounded (assertArmyBound ≤128). RETREAT routes by M1 danger; REINFORCEMENTS ride the same ledger; the COURIER UMBILICAL (round 12) grows an army's belief-staleness when its route home is cut (reads Wave-A beliefsActive — ABSENT under omniscient), so an info-starved army mis-assesses. SIEGE-AS-STARVATION COMPLETES: resolveSiegeVerdict gains spatialSiege (default false) — a mutually-exclusive if/else; SPATIAL = logistic over interdiction×time − relief (capacity-roll GONE); ASPATIAL else = the pre-M5 formula BYTE-FOR-BYTE (manager grep-verified: SIEGE_CAPACITY_K·(coalition−defender) appears ONCE, in the else; all 6 siege pins byte-identical). Army rumor CARRIER lights (additive lane). Aggregate-only (no npc id — battles move strength numbers). SOAKS: certification envelopes (exhaustion homeostasis + distribution) hold with armies afield; a 30y mutual siege ENDS endogenously (starvation-fall / will-capitulation). BUDGET-FREE → closure 1,255,921 UNCHANGED. Gates (manager re-verified): M5 38/38; 6 siege pins + any-cast 2252 (83/83); goldens 75/75 byte-identical; build+verify:dist 108/108; full suite 7954/7954 |
| M6a COMMODITY CONTINUITY (mover ladder #6, part a of 4) | (this commit) | commodityFlow.js (pure engine) + supplyKernel.js (+202/−0 PURELY ADDITIVE — the M2 path is byte-untouched, the branch short-circuits when active). Goods gain origin→destination PHYSICAL truth: FINITE origin stocks (productionRateFor from activeChains count, capped warehouse, depletes on ship / reproduces / a depleted origin is walked-past like a severed one), QUANTITY-denominated per-(settlement,good) stockpiles (RECONCILED from M2's time-buffer — STOCKPILE_TARGET 8 === BUFFER_WEEKS 8 at the boundary; lives in a NEW commodityStocks ledger, NEVER writes economicState.inputStockpiles → no double-count), en-route intermediary TAPPING (v1: applied at arrival, route recomputed deterministically — per-tick transit tapping is an M6b refinement seam). THE GOODS-CONSERVATION INVARIANT (M4 pattern): before+produced == after+consumed+lost, exact integers, asserted EVERY tick of a 24-tick war+trade fixture WITH a mid-run severance (cut caravans' load booked to `lost`). commodityBand → shortage/adequate/surplus, NO numeric prices (the M6c/M6d read seam). ⚠️ DOUBLE-GATE: marker AND a NEW simulationRules.commodityFlowEnabled opt-in (deliberately NOT in DEFAULT_SIMULATION_RULES → rides the ...input spread → touches ZERO pinned fixtures, byte-identical off) — so commodity continuity is a DIALABLE feature, OFF by default even in a spatial campaign (⚠️ OWNER: a preset must enable it to make goods-continuity live; recommend full-sim/dramatic presets). Sparse (stock only where activeChains produce/consume; tidyStocks drops empties). BUDGET-FREE (both sub-ledgers nest under spatialLedgers) → closure 1,255,921 UNCHANGED. Gates (manager re-verified): M6a 17/17; M2 supply byte-identical; any-cast 2252; goldens 75/75 byte-identical; build+verify:dist 108/108; full suite 7971/7971 |
| M6b ENTREPÔTS / TOLLS (mover ladder #6, part b of 4) | (this commit) | entrepots.js (pure engine) + entrepotKernel.js (adapter). EARNED centrality (not geometry): countCrossings recomputes each active shipment's toll-aware route + tallies INTERMEDIARIES only (path.slice(1,-1)), decayed EWMA — a geometric hub with ZERO shipments earns ZERO (manager-verified). Toll income → BOUNDED prosperity lift (folds into institutionLifecycle health like conquestProsperity, 0 dormant) + unlocks transshipment institutions (warehouse→customs house→carriers' guild, ordered, on the W-C3 founding lane after INSTITUTION_STREAK=8 ticks ≥0.5 centrality). THE TOLL JOINS THE M1 RE-SCORE via tollRateOf in scoreRoute (mirrors embattlementLevel; NOT risk-discounted — a real cost every mover pays): a GREEDY toll DIVERTS shipments (manager-verified reroute P→M→C ⇒ P→X→C at toll 0.7; a modest 0.4 does NOT divert — smooth threshold not a gate). FOUR CO-BUILT BRAKES (none pre-existed): throughput ceiling (THROUGHPUT_CEILING=6, crossings beyond earn nothing), toll upkeep (UPKEEP_RATE=0.35, a marginal entrepôt nets 0), wartime targeting (targetPremium01 into rampThreat, capped 0.2<ENTER 0.55 — never alone-embattles, tips a besieged rich hub first-target), rent bounded (TOLL_MAX=1.0). ⚠️ M1-CORE MOD (embattlement.js +53/−9): tollRateOf 0 dormant + targetPremium01 default 0 ⇒ scoreRoute/rampThreat BYTE-IDENTICAL (M1 pins + goldens verified); the new ScoredRoute toll/tollCost fields are transient (not persisted). Gate = entrepotActive === commodityFlowActive (SAME double gate, no 2nd flag). MEGACITY SOAK (30y, 9-settlement): max Gini 0.19 (<0.35), hub/mean 1.47× (<3.0) — no runaway toll-hub. Closure 1,255,924 (+3B incidental index.js chunk churn, NOT eager logic; margin now 61B). Gates (manager re-verified): M6b 35/35; M1 embattlement byte-identical; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 8006/8006 |
| M6c GREED-vs-DANGER DISPATCH EV (mover ladder #6, part c of 4) | (this commit) | dispatchEV.js (pure decision math) + commodityFlow.js thread at the M6a dispatch point + supplyKernel buildDispatchEV. The caravan GO/NO-GO is an EV under fog. Framed as a REFUSAL on the danger side (byte-identity-preserving): netDanger = believedDanger·caution − needPremium·appetite; REFUSE >0.2 / RESUME <0.05 + 4-tick dwell (M1 hysteresis, no flip-flop); dispatch iff cur<target AND willing (or override). believedDanger=0 (peaceful/unheard/dormant) ⇒ never refuse ⇒ M6a VERBATIM. DETERRENT reads BELIEF not truth (via belief() selector): stale siege-rumor DETERS a recovered town (readiness·confidence), an UNHEARD danger SLIPS THROUGH (unknown⇒0), truth-fallback dormant/omniscient — manager-verified tests. Per-stressor shape (the M11a plug seam): SIEGE 0.95 near-absolute; OCCUPATION {contested .6/unstable .5/extractive .35/stabilized .2/vassalized .1} — extractive DAMPENS not severs. Caution = the ONE W0 risk read (never a 2nd derivation). ATTRACTION = needPremium (M6a commodityBand on the carried good) × DYNAMIC APPETITE — a bounded [0.3,2.0] per-origin scalar (merchantAppetite sub-ledger): RISES +0.25 on a risky paid-off arrival (emboldened receipt), FALLS −0.3 on a risky cut (loss>gain), DECAYS 0.1·(baseline−level) toward merchantBaseline (merchant-strength raises, lawfulness lowers) — a deterministic accumulator over M2/M6a outcomes, NO new rng, settled records prune (sparse). BLOCKADE-RUNNER emergence: deep shortage (premium→1) × bold appetite (2.0) beats even siege 0.95. M7 SEAM: EV-refused sets outcome.evRefused + the shortage PERSISTS (the unmet-demand-under-danger signal M7 harvests). Overrides: vassal-tribute must-go wired; ally-relief seam. Gate = same double gate; EV absent ⇒ M6a dispatch verbatim ⇒ byte-identical. Budget-free (merchantAppetite/dispatchWillingness nest under spatialLedgers) → closure 1,255,924 UNCHANGED. Gates (manager re-verified): M6c 32/32 + 120-tick soak (appetite bounded, no deadlock); M6a/M6b/M1/M2 byte-identical; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 8038/8038 |
| M6d FLOW-DERIVED ECONOMICS (mover ladder #6, part d of 4 — COMPLETES M6) | (this commit) | tradeFlow.js (the arrivals tally M2/M6a discarded now has a home — per-settlement {in,out} windowed/decayed throughput, modality-weighted ROSTER read: land 1 / sea 1 / airship 1.5 / teleport 2, nested under spatialLedgers.tradeFlow zero-eager) + tradeFlowEconomics.js (the drift read-model). GENERATION IS SACRED (the ruling, PROVEN): flowDerivedDependency reads economicState READ-ONLY (tests assert baseline + worldState byte-unchanged; seeded primaryImports/Exports survive a 24-tick run verbatim); absent ledger/entry ⇒ null ⇒ the tab renders TODAY'S generation reads BYTE-IDENTICALLY (settlementRumors dormancy shape). Drift is QUALITATIVE only (shortage/adequate/surplus + headline, NO prices). ISOLATION = AUTARKY: no caravans ⇒ no tally ⇒ 0 drift; a blockade/winter/quarantine decays the tally to absent (~6 ticks) — economically real, no new mechanism. EconomicsTab threaded via the RumorsTab store-selector pattern (LAZY-confirmed — selector+tab body+tally-write all in lazy chunks, absent from the 7-file entry closure); an additive LiveTradeFlowSection renders BESIDE the generation baseline. ⚠️ FIRST UI-TOUCHING MOVER: +35B eager (SOLELY OutputContainer's saveId={saveId} prop to EconomicsTab — saveId already threaded there for DailyLifeTab; minimal + pattern-consistent) → closure 1,255,959, MARGIN NOW 26B (⚠️ OWNER heads-up: M9/M10 are also UI/CL-touching — the next eager spend may trigger a budget decision or a second reclaim). Gates (manager re-verified): M6d 47/47; generation-sacred + isolation proven; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 8078/8078 |
| M7 CONTRABAND / SMUGGLE (mover ladder #7) | (this commit) | smuggle.js (pure engine, imports only cultureDistance) — smuggling is THE TAIL OF THE GREED CURVE: when M6c's legal EV refuses (or every route blockaded), the unmet premium spills to the criminal channel (smuggleDispatchWarrant = deep premium × network × boldness). CONTRABAND is RELATIONAL (CONTRABAND_TABLE: slaves flagship + military + arcane; isContraband bans when the gate's own alignment prohibits OR cultureDistance(gate,origin) ≥ floor — the SAME slaves cargo is contraband at a good/lawful gate, legal at an evil/close one). ⚠️ THE PIPELINE ORDER == THE §II.3-4-e LAW (manager grep-verified, smuggle.js:258 + call site commodityFlow.js:599): if(detected∧hostile)→SEIZURE; elif(detected∧contraband)→CONFISCATION; else TOLL. WORST-GATE (§II.3-4-f): ONE roll per shipment vs the route's worst gate (rank hostile>contraband>toll, then danger, codepoint), fork smuggle:${key}:${arrivalTick}. BESIEGED-TRICKLE proven: a besieged town WITHOUT smugglers gets 0 deliveries, WITH them gets some (starves SLOWER, never not-at-all). Corruption is the HINGE (a leaky gate slips what an honest one seizes); conscience gates the seizure TAKE (W-C2 — evil gate loots to its stock, conservation-exact; good/lawful loots nothing). Guild-cap brake: SUCCESS_MAX 0.65 (no hand-of-miracle), risk-tolerance attempt-floor (cautious/lawful never runs — the ONE W0 read). Criminal RUMOR CARRIER lights (reuses supplyShipments ledger, edge-prefix crime., army lane byte-identical) — a smuggle run carries news where no trade channel reaches. Renamed the gate `tier`→`kind`/`rank` (keystone premium-tier keyword collision avoided). BUDGET-FREE (all lazy) → closure 1,255,959 UNCHANGED, margin 26B. Gates (manager re-verified): M7 29/29; M6 byte-identical; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 8107/8107 |
| M8 SEA LANES MATERIALIZED (mover ladder #8) | (this commit) | seaLanes.js (pure builder) + distanceRead sea-aware routing. The digest's reserved seaLanes slot lights: PORT ELIGIBILITY = geography (coastal/river cell) ∧ institution (dock/harbor/shipwright — roster-derived, pure); a SPARSE, WATER-REACHABILITY-CONSTRAINED sea-edge set (waterComponents flood-fill + union-find SAILING GROUPS by shared water body — a lane ONLY between ports reachable over water, never across land; within a body a Kruskal spanning tree + K=4 nearest, edge count ≤ (P−1)+K·P — NOT O(P²)); lanes priced by a WATER-PATH Dijkstra over the navigable-water-cell graph (sails around headlands, not the straight-line chord); LAND-DOMINATED lanes pruned at build (a lane emitted only when its sea cost beats the frozen land distance). The 9 seams: isolation inversion (island port = hub), naval blockade (port needs land∧sea cut), PIRACY = M1 danger on lanes, storm season on the slot, the SHIP-CREW rumor carrier (ports = info brokers), refugee sea passage into M4, NO fleet combat. ROUTING: land-only gateAdjacency + a port-gated augmentedAdjacency (sea folded in ONLY when lit AND a port is involved) so landlocked↔landlocked pairs stay land-only + MONOTONE in both the fast (O(1)) and seasonal paths. ⚠️ REVIEW HISTORY (the code-review double-pass earned its keep — 3 cycles): pass-1 caught a canonize-BREAKING regression (O(P²) clique blew the 400KB digest cap — 90 ports 515KB→235KB fixed), a river-NaN spurious-port bug, phantom lanes across disconnected water; pass-2 caught a seasonal-path non-monotonicity + storm-law mis-attribution to land hops + Euclidean underpricing — ALL fixed + pinned. Existing goldens BYTE-IDENTICAL throughout (frozen matrix never re-baked; seaLanes version-gated, null on pre-M8 digests). BUDGET-FREE → closure 1,255,959 UNCHANGED. Gates (manager re-verified): M8 34/34; existing goldens byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8136/8136 |
| M9a FACTION BELIEFS + OBJECTIVE SCORING (mover ladder #9, part a of 2) | (this commit) | [⚠️ GATE-REVIEW ONLY — no code-review pass; owner policy 2026-07-13: Fable does the comprehensive review+fix at the end] beliefMap.js: the belief ledger's factionId dimension ACTIVATES — per-faction slots nest alongside the unchanged seat slot; each faction fed by its round-9 CARRIER organ (merchant←trade, military←army, criminal←smuggle, religious←faith [dormant seam], public←ambient) via a matchFraming predicate; the Wave-A per-subject reconcile lifted VERBATIM into a shared reconcileSlot (seat path byte-identical — belief golden + settlementStrategy pins prove it). governingCoalition (seat + relationship-allied factions, VI.4-1); council_schism stressor on belief divergence (read-last, inline copy at the lazy kernel — no eager template); faction LEAKAGE via the compromise system (compromised carrier → public slot). scoringObjective.js: per-archetype objective sets (merchant/religious/military) + non-war LEVERS (reroute/embargo/credit, missionize/legitimacy, prestige/opportunity — emitted INERT, apply-effects are M9b); objectiveForArchetype(unmapped) === DEFAULT (reference-equal) so it reduces to Wave A BYTE-IDENTICALLY (enumerateMoves default path proven). Faction-belief sparse (arrival-driven, never cold-started). BUDGET-FREE (reuses beliefMaps; an eager +269B condition-template was diagnosed + removed) → closure 1,255,959 UNCHANGED. Gates (manager gate-review): M9a 29/29; goldens + belief + settlementStrategy + CL-0 pins byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8165/8165 |
| M9b MORAL DRIFT + ALLY-INTEL/BETRAYAL (mover ladder #9, part b — components 3+4; M9 SUB-SPLIT) | (this commit) | [GATE-REVIEW ONLY] The implementer invoked the scope-strain clause: built 3+4, STOP-AND-REPORTED 5+6 as M9c (teleport + war-split — the two heaviest byte-identity refactors, own pass). (3) MORAL DRIFT (moralDrift.js, pure, IMPORT-FREE so no eager preload edge): unjust instigation — a march this tick on M9a's FALSE relationship-misjudgment against a non-threat — banks alignment drift (moralDrift ledger under spatialLedgers); W-C2 conscience sharpest for lawful-good (lawfulness01×(1−malice01) — a saint drifts >2× a devil, pinned), scaled by victim innocence + past-relations (betrayed bond ×1.4); W-C5 reckoning arc (decays toward 0 each silent tick unless reinforced; a threshold crossing emits moral_reckoning news). Drift folds into disposition.computeMalice/computeLawfulness (the two W0 reads have NO other live consumer ⇒ absent ledger = {0,0} = byte-identical). (4) ALLY-INTEL/BETRAYAL (beliefMap.applyAllyIntelSharing, gated behind a NEW opt-in allyIntelSharingEnabled — absent from DEFAULT, rides ...input ⇒ byte-identical off even on a belief-active campaign): allies pool high-confidence beliefs; alignment STYLES handling (round 15A — lawful faithful, evil deceptive-outward [engineers an unjust war → couples into moral drift], chaotic noisy); the COMPROMISED-ALLY LEAK relays self-intel to the REAL enemy ⇒ belief-map alliance accuracy is load-bearing. BUDGET-FREE (a +6B preload edge diagnosed + removed by making moralDrift import-free) → closure 1,255,959 UNCHANGED. Soak: evil-manipulation-arc BOUNDED (≤MAX_DRIFT, resolves when manipulation stops). Gates (manager gate-review): M9b 26/26; all 18 goldens + 6 siege pins + war certification + CL-0 pins byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8191/8191 |
| M9c TELEPORT BLOCS (mover ladder #9, part c — component 5; M9 SUB-SPLIT) | (this commit) | [GATE-REVIEW ONLY] Implementer stop-and-reported component 6 (war initiate/resolve split) as M9d — its investigation showed it is a CROSS-CUTTING apply-path refactor (siege-init is inline + its apply is a no-op; routing through the proposal machinery touches applyWorldPulseOutcomes + the residue strip + proposal formation + simulationProfile), NOT a clean if/else — warrants its own pass. teleportEdges.js: the reserved teleportEdges digest slot lights version-gated (M8 discipline — key order preserved, existing goldens BYTE-IDENTICAL: spatialDigest/seaLanes/seasonal hashes unchanged, NEW teleport golden e1fa765b, frozen matrix never re-baked). The CLIQUE OF THE WILLING among teleport-circle holders (magic-gated, geometry-INDEPENDENT — no pack read); TELEPORT_EDGE_COST=1 (collapsed distance), CAPACITY=2 (bounded — premium not firehose); null <2 holders. Zero-hop HI-FI intel (RUMOR_CARRIER_TELEPORT, never weathers even under unreliable — completeness/accuracy===1); NODE-STARVATION resilience (a land-isolated circle-holder still reaches its bloc, the edge survives a land cut). WAR PATH VERBATIM (grep-proven: git diff --name-only = spatial+store only, ZERO war/proposal/CL files; 16 war suites/117 + CL-0 pins re-run green). BUDGET-FREE (rides the teleportEdges slot) → closure 1,255,959 UNCHANGED. Gates (manager gate-review): M9c 21/21; all goldens byte-identical + new teleport golden; siege pins byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8212/8212. ⚠️ M9 INCOMPLETE — M9d (war initiate/resolve split + coalition-dissent→coup soak) remains |
| M9d WAR INITIATE/RESOLVE SPLIT (mover ladder #9, part d — component 6; M9 COMPLETE) | (this commit) | [GATE-REVIEW ONLY] Siege INITIATION routes its applyMode through the per-domain authority policy (warInitMode = authorityFor(rules,'strategy_deploy','auto')) so war's DM-Driven tri-state unlocks (the CL-0 deferral CLOSES); RESOLUTION untouched. The extraction: seedDeploymentState fires at the SAME point (rng order preserved — the seededRecord held in a local); LEGACY/auto ⇒ verbatim inline mint (deployments[from]=seededRecord + mintDirectedChannel); DM-DRIVEN ⇒ the mint is WITHHELD, the strategy_deploy outcome carries proposalPayload{kind:'siege_initiation', deployment, warFront}, and applyWorldPulse re-mints on approval (re-minted force .toEqual's the legacy record; double-seed guarded). LEGACY BYTE-IDENTITY (manager-verified): pulseKernel UNTOUCHED (residue-strip byte-identical; no residue under DM-Driven); the proposalPayload conditional spread adds NO key on the legacy path; the 6 siege pins + war certification + CL-0 pins (authorityLegacyPin, changeAuthorityPolicy.contract) BYTE-IDENTICAL. DM-Driven routed path verified (pending→approve re-mints / decline→no war / resolution unchanged). COALITION-DISSENT→COUP soak: a schism-depressed Crisis seat opens the coup gate, resolves through the real kernel into a two-sided fork (both coup_succeeded AND coup_suppressed across seeds, bounded). BUDGET-FREE → closure 1,255,959 UNCHANGED. Gates (manager gate-review): M9d 13/13; 6 siege pins + certification + CL-0 + all 19 goldens byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8225/8225. ✅ M9 COMPLETE (a+b+c+d). NEXT: M10 CL-3 — the KNOWN eager-adder / budget-decision point (26B margin) |
| M10a CL-3 APPROVAL QUEUE (mover ladder #10, part a — owner SPLIT the budget-blocked M10) | (this commit) | [GATE-REVIEW ONLY] M10 measured +122B eager (over the 26B margin) → owner chose SPLIT: M10a (fits) now, M10b (+86B, needs a budget raise) deferred (parking lot §0.6). CRUX RESOLVED: routing war-init/coup to proposals under PLAIN routine breaks the M9d/siege pins (they expect the inline auto-mint under virtual routine) → gated behind a 0-EAGER opt-in simulationRules.routineMajorApproval (tolerant read, ABSENT from DEFAULT ⇒ no accessor branch, no eager key; absent ⇒ routing dormant ⇒ byte-identical). (1) APPROVAL-QUEUE: authorityFor gains one gated branch — under routine+opt-in an ACTOR-INITIATED major (strategy_deploy war decl / coup_succeeded) returns 'proposal', else legacyMode verbatim; war rides M9d's siege_initiation payload (re-mint deepEqual the legacy inline); coup threaded through authorityFor, fires once (stressor consumed at resolution), re-applies deterministically; pending-actions = the existing worldState.proposals (0 eager) + WorldPulsePanel approve/dismiss. (2) HOLD-THEN-EXPIRE (actorMajorApproval.js, lazy): a major waits ACTOR_MAJOR_HOLD_WEEKS=6 (⚠️ owner-decision default, named+documented+retunable) then EXPIRES-TO-DECLINE; NO deadlock (expiry only retires, never blocks the advance; legacy returns the SAME worldState ref); HOLD dedup so a besieger doesn't re-propose each tick. (3) RATIONALE surface (mode-aware note, gated off under routine-default ⇒ byte-identical). (4) infoMode 'full' (the ONLY eager change, +6B net: +12B infoModeOf branch − ~6B shorter preset string) — an unreliable-superset (M9a factional beliefs + distortion). BYTE-IDENTITY (grep+run): goldens have ZERO coup/strategy_deploy markers, siege pins run with no opt-in ⇒ CL-0 pins + 6 siege pins + war certification + coalitionDissentCoup + all 45 goldens BYTE-IDENTICAL. Closure 1,255,965 ≤ 1,255,985 (20B margin). Gates (manager gate-review): M10a 18/18 + 3 panel; CL-0/siege/coup/goldens byte-identical; any-cast 2252; build+verify:dist 108/108; full suite 8246/8246. ⚠️ M10b DEFERRED (§0.6: catch-up cap + worldProgression living/autonomous + preset mover-flags, +86B, needs budget raise) |
| Design doc (companion) | many (98e2aed8…d5672d31 range) | 20 owner rounds + PARTS I-VII (6 grounding passes); §11 control layer; II.5 + VI.4 decisions settled |
| Parking-lot F24 fix | c85781f0 (cherry-pick of 6faa1045) | the STRANDED F24 fix landed on review-fixes: AccountPage profileSourceKey NUL join-separator → '|' (ephemeral memo, behavior-safe). src/ NUL scan 2→1 (the remaining one is the supplyCompleteness delimiter, §0.0.2). eslint clean; account smoke 2/2 |
| Parking-lot 5.5-K freeze-first guard | 47ccd6dd | +3 pins for the previously-uncovered live-capture double-read (differ⇒warn+return-FIRST; match⇒no-warn; throw⇒swallowed). Structural-prevention; 0 product code, 0 first-paint bytes. Seam already fully wired 5.5-M @ 18fc15f2 → §0.6 stale note corrected |
| FP-2a aiSlice reclaim (first store-slice split) | 715fe7b2 | −2,448 B closure (1,255,965→1,253,517) via the loadEngine pattern: lib/ai.js + narrativeMutations.js (both SOLE-imported by aiSlice, reached only from async actions after the sync prefix) dynamic-imported at their call sites, memoized. NOT the §0.7 eager-stub/body-extraction — that defers each action's sync prefix (set(aiLoading)+abort stamp) and broke F18. Budget UNCHANGED 1,255,985 (headroom now funds M10b+W5). Recorded shift: generateNarrative invoked one microtask later (loadEngine ordering); F18 abort contract intact; 2 F18 tests yield one tick. Goldens store-free ⇒ byte-identical. Gate: full suite 8,259/8,259; verify:dist 18/18 |
| M10b LIVING/AUTONOMOUS + CAPPED CATCH-UP (mover ladder #10, part b — M10 COMPLETE) | (this commit) | worldProgressionOf/advancesOnOpen accept living/autonomous (validator coercion progression_not_yet_built→progression_unrecognized); CATCH_UP_CAP_WEEKS=26 (owner default). catchUpCampaignWorld: capped whole-week catch-up = N one-week advanceCampaignWorld calls ⇒ DETERMINISM byte-identical to N manual (JSON-equal pin); autonomous auto-resolves / living pauses on a major. NEW PERSISTED STATE worldState.lastLivingAdvanceAt (wall-clock cursor) stamped at store level post-advance, UNDO-restored (pin), legacy/first-open SEEDS (never a 1970 delta), calendar-advances-past-cap. Trigger: WorldPulsePanel useEffect (once/open, Date.now). full_simulation preset lights worldProgression:'autonomous'+commodityFlowEnabled+allyIntelSharingEnabled; UI toggles enabled. +1,376 B eager (NOT +86 — trim available §0.8) → closure 1,254,893 ≤ 1,255,985 (margin 1,092). ⚠️ ACCEPTED preset-reinference drift (autonomous full-sim). Gate: catchUp 6/6; goldens byte-identical; profile pins updated; full suite green; verify:dist 18/18 |

| M11a PESTILENCE (mover ladder #11a; landed via the parallel round-21 stream) | 82ad676b | [LEDGER ROW ADDED RETROACTIVELY 2026-07-13 by the review program — §0.3-7 repair; full contract in `git show 82ad676b`] The traveling plague: epidemic ledger under spatialLedgers (marker-gated, zero eager), materializes the EXISTING plague stressor at each reached settlement; hop-by-hop spread on active trade channels + M2 arrivals; care counterforce reads the institution ROSTER (capped, diminishing); recovery floor (no perma-plague). ⚠️ RECORDED DEFERRAL (was commit-message-only): the four graded plague READ primitives (army hazard/contraction, route hazard, temple pulse) shipped with tests but ZERO consumers — the couplings (quarantine dilemma, army vector, trade refusal) were deferred, not wired. The review program's W-PLUG wave closes this. |
| M11b CALAMITY (mover ladder #11b — M11 + THE M1–M11 LADDER COMPLETE) | 62c81a0c | [LEDGER ROW ADDED RETROACTIVELY 2026-07-13 — §0.3-7 repair; full contract in `git show 62c81a0c`] Very-rare terrain-keyed instantaneous shock with fully EMERGENT tail (zero new persistent mechanism): seeded annual draw `disaster:${id}:${year}`, subsumption-first strike on K non-required institutions, exodus rides the M4 realized-debit conservation path, cooldown = the permanent calamityHistory stamp. Gates: M11b 30/30; goldens byte-identical; full suite 8,348/8,348; closure 1,254,886 ≤ 1,255,985. ⚠️ STOP-AND-REPORT (owner-gated, standing): `disastersEnabled` is set by NO preset/UI/default — the mover is unreachable until the owner flips one preset line (+20B measured, fits). |
| Comprehensive review+fix program OPENED (PART 9 grade-check) | 3b80c9ee, 104b1536, eb74cf8c, b4954688 | Fable 5 survey 28/28 agents → docs/COMPREHENSIVE_REVIEW_2026-07-13.md (271 findings, 0 critical); owner ruling: free = $2.99/PDF, premium-only unlimited export; Opus verification + fix waves follow. Live state: docs/COMPREHENSIVE_REVIEW_PROGRAM.md. |
| F1 LIFECYCLE-TRUST + first-paint reclaim (fix program wave 1) | (this commit) | The owner's most-bitten class closed at 9 seams: M10b lastLivingAdvanceAt stamped INSIDE the Phase-2 commit (rides the atomic persist; reload no longer re-simulates lived weeks — the persisted-surface pin class the in-memory tests missed); parked-pause mutation guards (apply/dismiss/party-impact, panel gated, internal in-flight replay exempted); advance-in-flight guards on queueSettlementEvent + 4 regional mutators; revertToSnapshot re-derives systemState + persists campaignState; ONE resetSettlementIdentity chokepoint (structural pin: exactly 1 definition, 4 call sites); regenSection respects canon locks + persists; zustand persist version/migrate + config deep-merge (persistMerge.js); requestDailyLife sync-prefix (double-click double-charge closed); import scrub single-writer (importScrub.js) now strips cultDeitySnapshots + faithProfile. RATCHET STORY: F1's eager guards/merge busted the budget (+805B) → wave HELD → the §0.8-1 trim landed IN-WAVE: catchUpCampaignWorld body → campaignAdvanceSession (lazy) + pulseFingerprint de-lazified (sole-importer, memoized loader) ⇒ closure 1,256,790 → **1,251,094** (margin 4,891B; budget const untouched — ratchet-down queued for the owner batch). Gates: +24 pins; suite 8,372/8,372; store+property 361/361 independent re-run; verify:dist 108/108; goldens byte-identical; any-cast 2252. |

| F2 CLIENT-SEAM INTENT (fix program wave 2) | (this commit) | User intent no longer silently drops at 4 client seams: MapOverlay prop contract restored (image-backdrop drag-drop lives; ref threaded, not callback); shareMap forwards ALL 12 publish_map params via new publishMapParams() (first publish keeps world snapshot/sections/cover/importable/arc/facets; text sanitized to match the edit path — deliberate one-time first-publish behavior change, recorded; sections allowlisted client-side, snapshot still hits the 089 server scan) + a client↔RPC param-parity contract test; bridge.exportThumb IMPLEMENTED (typed surface + a fail-safe SVG→canvas rasterizer in sf-bridge.js — the fork has no native raster exporter; un-gated file, node --check + walker-pinned, F6 harness will cover) + a structural walker (every consumed bridge method must exist — the bug class retired); BuyThisDossier unsaved rung SAVES for signed-in users (goSignIn reserved for anon). +4 pin files/13 tests, each negative-controlled. DISCOVERED: mapThumb [data-map-overlay-svg] queries an attribute set nowhere (campaign thumbs lack markers) — spawned as a follow-up task chip. Gates: pins+goldens 23 files/96 green independent; verify:dist 108/108 (budget green); goldens byte-identical; any-cast 2252. |

| F3a SURFACES & LEGIBILITY part 1 (fix program wave 3a) | (this commit) | The fiction stops speaking engine: settlementRumors whatPhrase vocabulary (~60 tokens → in-world phrases + register-guard pin); newsVoice gains pestilence/calamity/migration/authority crier categories (plague_arrival no longer market-news); newsBody.js recomposes the card body in the house voice (engine summary → hover tooltip). Read-models: chronicleTimeline id-poisoning fixed (matching its public sibling); warResolve leadership includes pillar figures; NEW settlementPestilence.js — the M11a read-model sibling (presence/severity/care/trend fiction, includeGroundTruth seam, realm view). Living-world visibility: World-Laws Distance/Travel axes tell the truth on a mapped realm (engine-derived, the "arrives with the map engine" lie removed); WorldPulsePanel shows the advancing banner; anon Basic banner states the real Town ceiling. DEFERRED-WITH-PROOF: publicSafe bare-`note` narrowing is a COUPLED client+SQL change (the drift pins forbid client-only) → owner batch, in-code DEFERRED note at PRIVATE_KEY_RE. Gates: 137 tests green over 15 files incl. new pins; goldens byte-identical; closure 1,251,206 (+112B eager, prop-threads only; margin 4,779); any-cast 2252. F3b carries the remainder (catch-up lift + digest, causal supplier, belief UI, RegionWakeReplay mount, PDF group). |

| F3b SURFACES & LEGIBILITY part 2 (fix program wave 3b — F3 COMPLETE) | (this commit) | The living world reaches the eye + the PDF: M10b catch-up lifted to the setActiveCampaign seam (fires on EVERY open path, dm_advanced stays free via the sync guard) + the WHILE-YOU-WERE-AWAY digest (transient, never persisted; failures surfaced) in RealmDashboard + WorldPulsePanel; ChronicleScrollback per-tick causal diff finally renders (session pulseUndoStack supplier); the Wave-A belief read-model gets its DM-gated UI (BeliefDivergenceBand — divergence rows deferred-with-reason pending a display-safe truth provider, two-writer hazard avoided); RegionWakeReplay mounted on the landing. PDF: the War Room (campaign_state) gains rumors/beliefs/flow-drift/pestilence via the F3a read-models under the FaithWar gate discipline; live-layer parity lane (LIVE_LAYER_FIELDS walker — future movers can't silently skip the PDF); prose-not-keys, by-design contradictions as plot seeds, defense stress set aligned (+plague_onset), canon-only phase gating + the first FaithWar execution coverage; campaign PDF gains the State of the Realm chapter. MANAGER RULINGS (vetoable): belief band + replay mount + campaign-PDF enrichment ruled in-scope (surfacing existing entitlements, named in the committed wave plan pre-delegation). MANAGER FIX folded in: 3 tsc errors (an F3a docstring mask + 2 unknown-property accesses) — LESSON: typecheck joins every wave battery. Gates: 130 tests (17 files) + battery 34/230 + verify:dist 108/108; closure 1,251,487 (margin 4,498); goldens byte-identical; any-cast 2252; tsc full+domain CLEAN. |

| F4 COMMERCE-TRUST (fix program wave 4) | (this commit) | The deal terms become true everywhere: NEW src/config/tierFacts.js derives every tier fact from pricing.js ONCE (six drifted surfaces rewired; contract test forbids stale literals + pins display↔TIER_GATE parity). THE OWNER-RULED $2.99 GATE FLIP: free export = per-dossier entitlement on the existing single-dossier ladder; premium unlimited; DISCOVERY — SettlementDetail's saved-view export was fully UNGATED (the flip alone would have been cosmetic) → routed through resolveExportAccess + defense-in-depth; founders (stored premium) keep unlimited. Founder cap 30 everywhere (FounderTile + emailTemplates → FOUNDER_SEAT_CAP; parity test extended to seat literals). create-checkout anon single_dossier gains the verify-single-dossier rate-limiter pattern (migration-035 bucket, no new migration; 2 Deno pins). pg_temp STRUCTURAL GUARD: migrationSearchPathPin walker (net-current definer fns must pin pg_temp-LAST; 84 bare fns frozen shrink-only; MIGRATION-TODO names the 8 post-111 regressions for the owner re-pin batch). ENTITY-REF: §6 recorded divergence — master's consumer architecture (EntityLink/EntityRef/provider) never landed on this lineage, so the documented degrade path shipped: ProseParagraph/ProseText de-tokenize to clean names at the four leak sites (token-free prose byte-identical), producer⇒consumer contract test added; the FULL link-layer port re-scoped to the master merge. ⚠️ MASTER-MERGE HAZARD UPGRADED: the entity-link consumer system is entirely absent on this lineage — a reconciliation gap larger than the register finding. Gates: 123 new/touched tests green; battery 23 files/117 + verify:dist 108/108; closure 1,251,618 (margin 4,367); goldens byte-identical; any-cast 2252; tsc clean; validate:edge valid. |

| F5+F5b PERF YEAR-TWO / F6 GATE HONESTY / F7 CODE HEALTH / LANE-2 (fix program waves 5-8, MAIN COMPLETE) | da5a1dee, fcdc319e, 1977f27f+65e79547, 9b9f7a28, 9dd8d0cb | F5: frozen-digest reference-sharing (routes 2.67→0.13ms/tick, 20.3×), queuedImpacts cap, rollExplanations cap, wizard-news ensure-brand, the committed tick-cost envelope gate; catch-up-orchestrator STOP (owner fork: history 26→1 persist-shape); the stash INCIDENT recovered+ledgered (briefs now forbid git stash). F5b: deepFreeze isDraft guard (the Immer/canonize regression F7's full battery caught). F6: VERIFY_DIST hard-fail real, blind-harness fix (moved to golden with its regens), pglite fail-not-skip, self-mint dead, tsc-ran sentinel, workers purity, flake timeout, M10b living pins, mover-composition smoke, sf-bridge harness, config-seam + metronome walkers; amendment 65e79547 keeps Track N always-green. F7: kernel clamp/slugify (13+8 sites byte-parity-proven; 61+37 baselined shrink-only), curated barrels, domain max-lines 800 (6 empirical grandfathers), DEAD_CODE_DISPOSITION.md (22 files, ZERO deletions — owner docket), political-autonomy ruling doc; any-cast RATCHETED DOWN 2252→2248. LANE-2: DM non-party relationship events ripple to the pulse, CREATE mints the canonical edge (survives the tick, negative-controlled), supersession-guarded undo, orientation normalized; adversarial-refuter round closed 1 CONFIRMED + 2 PLAUSIBLE pre-commit. Closure 1,254,740 ≤ 1,255,985. |

| THE GOLDEN MERGE + REGEN + PRESETS + FP-G1 RECLAIM + RATCHET-DOWN (the owner batch executed; the fix program UNIFIED) | 3726753e..98a08951 (golden), 6d3e5ca2 (merge home), (this commit: ratchet) | The owner-signed event, complete: main merged into golden (1 conflict, union-resolved; wizardNews three-way verified — G1d cooldowns + F5 brand + W2 capEntries all live); PRESETS LIT per ruling (full_simulation +disastersEnabled; dramatic_campaign +war/strategy/faith[+legacy mirror]/seasons/disasters; commodityFlow stays opt-in; 2 preset pins updated, accepted display-only re-inference drift); THE ONE REGEN across all six surfaces (generator manifest 187/187 — exactly as mapped; spatial+deity manifests; generation snapshots; pdf golden; edge bundle rebuilt, sourceHash cc094f07). FP-G1: the sequence's gate caught an 11,943B budget red → PROVEN pre-existing G-track debt (build-less wave batteries silently skipped the dist contracts — the F6 vacuity class, pre-closure); the reclaim diagnosis CLEARED the merge (zero new eager modules) and found the real seam: four eager consumers of stressors.js dragging the heavy evaluation machinery into first paint → stressorsCore leaf split (Lane-2 pattern) = −51,655B: closure 1,267,928 → 1,216,273. Merged home 6d3e5ca2; UNIFIED FINAL GATE 8,785/8,785 (792 files) + verify:dist 109/109, exit 0. BUDGET RATCHETED DOWN 1,255,985 → 1,216,350 (§0.2-5 monotone; history in the const's ledger comment). any-cast 2,248 (relocation-invariant). Remaining owner-batch waves: catch-up collapse, dead-code deletions, A-wave telemetry. |

| DEAD-CODE WAVE (owner-ruled "apply my dead-code recommendations" — the FINAL owner-batch item; THE BATCH IS COMPLETE) | (this commit) | Applied DEAD_CODE_DISPOSITION.md's DELETE set with per-entry re-verification against the post-merge tree: 14 modules + 6 dedicated tests deleted (−2,659 LOC). KEPT with reasons: mapProfile.js (now a live-behavior test oracle for terrain/walls — and the settlement-map design's interface), usePricingMoment (paid surface, owner-verify), counterfactual.js (owner-gated seam), Disclosure/debounce/StatTile (keep-as-seam), categoryVocabulary (governance canonical). Cascade found (NOT deleted, scope discipline): MapGalleryDetail exclusively parented CampaignStatePanel+MemberSettlementsList; NextActionRail parented ActionRail — flagged for follow-up; a PARALLEL ACTOR deleted the two gallery children in the shared tree mid-wave (left unstaged/foreign, preserved). Baselines shrunk (legal direction only): any-cast baseline −18 (total 2,230), slugify ceiling 37→36. Suite 792→786 files / 8,786→8,716 tests (the deleted modules' own cases). Battery: tsc full+strict clean, eslint 0, property goldens byte-identical, build OK, verify:dist 109/109, closure 1,216,273 ≤ 1,216,350 (byte-identical — deleted modules were already tree-shaken). |

| A-WAVE OPENS — USAGE-TELEMETRY MERGED (the endgame analytics workstream lands) | 1ccf84a9 | usage-telemetry@6a8bfade merged home (JUDGMENT, vetoable pre-push: the prerequisite of the owner-directed Analytics v2 workstream). Clean auto-merge onto the catch-up-collapse rewrite — extractSpatialUsage enriches BOTH world_pulse_advanced sites (advance + interval-resume) + spatialCanonizeUsage on world_canonized; zero new event names (enrich-existing-props doctrine); id-free coarse buckets. Edge bundle byte-parity vs fresh build CONFIRMED (sourceHash 07845c7a; timestamp churn discarded). GATE ON THE MERGED TREE: first run flaked 5 files/6 tests — ALL 20s-timeouts under parallel-session machine load (49-113s file durations, the documented scheduling-flake class), 76/76 green solo re-run; build exit 0; verify:dist 109/109 — **spatialUsage stays OUT of the entry closure, budget 1,216,350 holds at the 77B margin**. Suite 787 files / 8,724 tests (+spatialUsage.test.js). NEXT: Analytics v2 implementer waves per DESIGN_ANALYTICS_V2.md (consent purge, sessionId, dogfood stamp, v2 groupings, dictionary, rollups). |

| ANALYTICS V2 A1 + A1-FP LANDED + RATCHET-DOWN (the v2 core ships inside a SMALLER first paint) | 88dac334 (A1+A1-FP), cf65a3c1 (cascade adoption), (this commit: ratchet 1,216,350 → 1,215,520) | All six A1 core items per DESIGN_ANALYTICS_V2.md (consent purge on structural payloads; market-insights plane DEFAULT OFF via MARKET_INSIGHTS_DEFAULT — owner flip is one line; envelope sessionId; dogfood stamp; snapshot cap client≤server pinned cross-contract; listMeta deferral marker; config_archetype + realm topology groupings; approval rates confirmed pre-covered; ZERO new event names). A1 first measured +1,451 B eager (transport/consent is inherently eager) → the implementer correctly STOPPED at the wall → A1-FP reclaim per the reclaim-first ruling: analyticsQueue split into eager enqueue leaf + lazy analyticsFlush applier (loadFlush memoized, primed per enqueue, pagehide → PINNED synchronous spill fallback), sessionId extracted to a lazy-only module, flush↔queue cycle broken via analyticsQueueState (layerBoundaries ratchet unchanged at 2). Net −2,281 B: closure 1,215,443, wave lands −830 B BELOW its own baseline. Unified battery: 789 files / 8,751 tests green, verify:dist 109/109, goldens byte-identical, tsc/strict/eslint clean. Cascade-orphan session's deletions adopted @ cf65a3c1. NEXT: A2 (dictionary generator + rollup SQL, written-not-deployed) → A3 (§9 intent corpus + §10 auto-tune rails). Parallel chips live: SM-1, E0-dormant, master-merge plan, persist-gap, hover-emit. |

| A3 — THE A-WAVE CLOSES (analytics v2 COMPLETE on this lineage) | 7f74ccf7 | §9 pre-Surveyor slice (migration 134 written-not-deployed: manual-op atlas + revert-rate rollups over existing research-plane edit_events; correctionTypology v1 with Surveyor classes declared-deferred) + §10 auto-tune rails INERT (empty lane-A registry — ratification is the owner's setup act; golden boundary STRUCTURAL via surface allowlist + seeded-module denylist + mandatory envelopes, 27-pin walker; weekly job written-not-enabled, proposals-only) + campaign subjectId stamped on all four campaign-scoped emits (k=200 floor cells now form; generation_completed deliberately unstamped — no uuid exists at its emit). GROUNDING: §10's full loop is design-gated on E0 envelopes + cacophony soak (E0 building in a parallel chip). Battery: 794 files / 8,801 solo-green; closure 1,215,457 ≤ 1,215,520 (63 B headroom); head=134 contiguous. THE OWNER'S DEPLOY BATCH now carries: db push through 134 + ingest-events redeploy + cron enablement + the standing vetoables (market default OFF, archetype margin 12, cap 20, dictionary-beside-taxonomy, columns-over-props, registry ratification menu). NEXT on main: numeric prices → drain-path parity + wallClockNow → Track K. |

| CHIP INTEGRATION COMPLETE + FP-G2 + RATCHET #4 (the parallel harvest lands; owed work nearly closed) | c3c464d9..7ec40058 (5 merges), 79c4f821 (FP-G2), (this commit: ratchet 1,215,520 → 1,214,050) | Five owner-launched chip branches merged home in risk order, all lineage-verified: MASTER_MERGE_PLAN.md (647 lines — the endgame's battle map) · persist-gap fix (edits/renames persist at the action + 237-line pin suite; the live ghost-on-reload class closed) · hover-emit restoration + guard test (the wave-4f-2 casualty repaired on the CORRECT lineage) · SM-1 town-map model (+ golden manifest + BOTH §8 pre-build gate verdicts as tests incl. world-pulse blob preservation) · E0 tempo governor (DORMANT: byte-identity proof, drama-class registry contract, lit-behavior property tests, cacophony soak test staged for tuning). Integration gate: suite fully green 804 files / 8,924 tests; ONE red = first-paint +627 B (persist-gap eager wiring +673, E0 key +17, SM-1/hover zero) → FP-G2 RECLAIM: persist-split proven infeasible (helpers already eager; pins demand sync); fresh seam found — coup-contest model rode eager via rulingPower.js with only-lazy consumers → rulingPowerCoup.js leaf (−2,180 B). Closure 1,213,967; unified gate exit 0 (8,924/8,924 + 109/109). BUDGET RATCHETED 1,215,520 → 1,214,050 (#4 this program; ~83 B margin). ALSO: DESIGN CORPUS CLOSED this session (scope freeze df162a88; final docs: INFORMATION_STATECRAFT, CORRUPTION_WEB, SETTLEMENT_POLITICS, weave §G/§H; numeric prices SHIPPED 43398423 w/ parity pin). NEXT: drain-path parity + wallClockNow → Track K → E1 brief (the first against the complete corpus) ∥ SM-2. |

| DRAIN-PARITY + WALLCLOCKNOW (0d559be3) → TRACK K COMPLETE (c6fba3a3): THE OWED-WORK LEDGER IS EMPTY — the program enters pure expansion | 0d559be3, c6fba3a3 | Drain path gained exact Lane-2 parity through the ONE applier (clock-bound members' canon verbs rippled nowhere before; 5 pins incl. drain-vs-immediate identity + negative controls); pinNow seam on the canon session pair (store now-census: 12 sites — 4 pinned, 2 collapsed, 6 exempt-with-reason); shared pause→resume tail question deferred-with-reason to soak (party+canon replay patterns together). TRACK K: the one-operation-layer manifest — 157 registered + 66 exempt vs a fail-closed set()-census walker (real denominator 223 actions, 5.5× the design estimate); OperationEnvelope + canon adapter; 'ai' provenance reserved-unemittable. RECORDED DIVERGENCE (vetoable): §4 eager emission blocked at the 54 B margin + zero existing consumers — deferred to the Surveyor-stage-3 build. Gates green throughout: 8,942/8,942, verify:dist 109/109, closure 1,213,996, goldens byte-identical. NEXT: E1a (engine lane, first brief against the complete corpus) ∥ SM-2 chip (display lane). |

| THE NIGHT SHIFT OPENS: E1a/E1a-WIRE/E1b + W-COMPOSER-1 ALL LANDED (the soul's first organ + the instrument that plays it) | 2e744fef (E1a core), 561c7ed9 (wire, dormancy golden pre-captured+held), c0a12f2b (E1b credit), e66b6031 (composer merge) | GENEROSITY: pure kernel trio (EV/reactions/weave — the canonical famine/army/margin pin passes both halves; 300-case floor property) → live-dormant as the LAST mover (fenced golden byte-identical pre/post-wire; lit: aid changes history, conservation exact) → CREDIT complete (rng-free maturity per §H — solvency+malice fully differentiate; default = betrayal killswitch + resentment ratchet + hardened lender heart; repayment = the trust ledger the corruption web reads) + succor voice (fixed a latent crier mis-route) + legitimacy coupling + smuggle-premium pin; purchase/overture/refuge ledgered w/ recipes (depth-over-breadth JUDGMENT — the live flag drives no behavior; thin-flips would lie). COMPOSER FOUNDATION merged: affordance manifest (lazy leaf + named dist guard), coverage + predicate-parity walkers (ZERO exemptions), THE VETO CHANNEL (phantom-event hole closed at pipeline/store/batch/drain seams; legacy replay byte-identical), dial schemas ×29 w/ dual enforcement, target-first nav + pressures rail (cap 3), live preview FULL-PIPELINE-PER-DIAL-TICK (p50 0.38ms metropolis) + staleness law (applyPendingPreview bypass RETIRED), queued-vs-now surfaced; net −178 B eager. MERGED GATE: 9,072/9,073 with the 1 fail = the documented advancePauseResume contention flake (solo 9/9); build exit 0; verify:dist 110/110 on the merged tree; closure headroom ~232 B. FACET LAW born-compliant in both waves. Suite now 816 files / 9,073 tests. NIGHT DELEGATION ACTIVE (ebb2aa9d): all decisions mine, structural gates survive. IN FLIGHT: W-PEACE-1 (worktree), E1c (dispatching), SM-2 (owner chip). |

| E1 COMPLETE + THE TRIPLE MERGE (peace reasons, the map viewer, the persist-queue fix all home) + THE GUIDANCE CORPUS-CLOSER | 9e8acc95 (E1d), 47c4b9c0/474c044a/64a91c5c (merges), eb0b31a2 (guidance design), (this commit: integration fixes) | THE GENEROSITY ENGINE IS COMPLETE: six of six instruments live (purchase per the f3cf639e delegation rulings; overture through authorityFor; belief coupling double-gated, faithLabel deliberately sealed); the adversarial verifier CAUGHT A REAL BUG pre-ship (zero-grain sale charging the buyer — fixed + pinned; the E1a zero-grain-gift sibling flagged for the FP-G3+verbs wave). W-PEACE-1 merged (7 war + 7 peace typed reasons, the Blainey pin both directions, symmetry walker, irony brief verbatim, its own fenced dormancy golden; verbs deferred to W-COMPOSER-2 per the walker's own parked boundary). SM-2 merged (the [Dossier|Map] toggle + lazy viewer + hover≡dossier parity pin). pendingEdits no-silent-drop merged. TRIPLE-MERGE GATE: 9,195/9,197 with the 2 fails = REAL merge-integration artifacts, both fixed: the SM-2 anti-vacuity pin asserted against a PRE-MERGE STALE DIST (now VERIFY_DIST-gated — the presence half needs a fresh build; absence stays ungated) and the edge bundle needed its documented regen (hash 012883267b05bebb). All re-verified green under fresh dist incl. the budget. Suite 829 files / 9,197 tests. DEFERRED-OWED: FORCE_RELIEF/OFFER_CREDIT blocked at 232B headroom vs >1KB eager threading → FP-G3 reclaim hunt funds it (reclaim-first; never a raise). GUIDANCE LAYER design frozen @ eb0b31a2 — THE CORPUS IS CLOSED, completely. |

| THE PEACE ENGINE MERGES HOME (W-PEACE-1/2/3 complete) + FP-G3's −52KB + RATCHET #5 CORRECTED (a sequencing lesson becomes law) | 41c4447d (FP-G3+verbs), (this commit: peace merge + integration) | THE PEACE LANE IS COMPLETE ON MAIN: typed war/peace reasons w/ the Blainey proof · belief-appraised term budgets, top-3 prize ranking, duration caps structurally mandatory, fog-monitored compliance · treaties as DOCUMENTS (the fraying seam named verbatim), coalition joint-vs-peel with priced betrayal feeding revanchism, the NAMED mediator earning both-edge trust; wave-3 also fixed wave-2's incidentType metadata orphan in scope. FP-G3: corruption.js was dragging 64KB of npcData eager for ONE trait map → npcTraitWeights leaf, −51,957 B; the verbs threaded (40/31/9); the zero-grain sibling fixed (chip-session duplicate flagged for reconciliation at its branch). INTEGRATION LESSONS BANKED: (a) a lazy() inside an already-lazy chunk minted a chunk (~36 B manifest cost) → folded static (TreatyPanel); (b) a manualChunks 'engine' assignment for a 2-importer display leaf DRAGGED THE ENGINE EAGER (+824KB!) — reverted in minutes; the shared-chunk manifest byte is the CHEAPEST of the alternatives — accepted; (c) **RATCHET LAW CLARIFIED (JUDGMENT, vetoable): ratchets bind at integration-window CLOSE, never mid-window** — FP-G3's 1,161,810 fired with the peace stack known-incoming; corrected to 1,161,902 (post-merge measured 1,161,818 + 84); the owner-blessed floor replaced (1,214,050) is honored by ~52KB. Gate: 9,260/9,261 vitest + 113/113 dist at the corrected budget. NEXT: W-DOCTRINE-1. |

### 0.0.2 STANDING AMENDMENTS + RULINGS (things a successor must not re-litigate)

**THE COUNTERPART CRITERION (owner ruling 2026-07-14, binding on every capability wave):** no
simulation capability ships without its forceable dossier counterpart IN THE SAME WAVE — the
verb, its same-function affordance predicate, its bounded dial schema, and its live preview
(DESIGN_EVENT_COMPOSER_V2 §1 LAW 2; enforced fail-closed by the coverage walker once
W-COMPOSER-1 lands). Freetext law: identity-minting + flavor only, never behavior selection.
EXTENDED 2026-07-14 (owner): + THE FACET LAW (DESIGN_COHESION_WEAVE §I) — no coherence system
ships without its custom-content on-ramp: declared-over-inferred facets, the facetOf chokepoint,
the consumer walker, mint-time word-band questions. Custom entities are first-class citizens of
every coherence, permanently.

**SITUATION-WEIGHTED PRNG (owner ruling, 2026-07-14, binding on all future waves):** every
stochastic draw = a seeded fork on a stable composite key AND a situation-weighted distribution
(EV/pressure/character loading first, the fork samples within it). Flat draws only where the
fiction is indifferent; weights receipted as the outcome's typed reasons; tuning moves weights
never forks. Full statement: DESIGN_COHESION_WEAVE §H. Existing engine practice conforms; the
ruling prevents regression.
- BUDGETS: first-paint CLOSURE_BUDGET_BYTES = 1,255,985 (FP-1 ratchet 1,441,000→1,256,000, then the
  FP-R consolidation down-ratchet →1,255,985; never raise without owner). CURRENT closure 1,254,886 =
  1,099B margin (post-M11b @ 62c81a0c; MEASURED 2026-07-13 — the earlier "1,255,965/20B" figure
  here was post-M10a and had gone stale against this ledger's own M10b/M11b rows). ⚠️ HEADROOM IS
  SINGLE-ALLOCATION: §0.8 promises it to W5 (~890B) and the round-21 plan to W2 (+363B) — both do
  NOT fit (1,253B combined) until the §0.8-1 M10b eager-trim (~800B reclaim) lands first. Owner ruling 2026-07-13: FP-2 (store-slice split)
  RECLAIMS headroom for M10b+W5 rather than a budget raise — see §0.6.0. any-cast ceiling 2252 EXACT
  (fix types, never widen); domain-strict 0/0.
  ⚠️ HEADROOM CRITICAL as of 3.5: only **63 BYTES** free (closure 1,255,937). Wave A MUST stay fully
  lazy (its belief-ledger key ≈ one CONDITIONAL_LEDGER_KEYS literal ~17-25B fits; the selector +
  reconciliation + DM read-model are all LAZY worldPulse/display — no eager cost). Any wave that
  needs eager bytes beyond ~40B STOPs → triggers FP-2 (the parked store-slice split, ⚠️ owner-gated)
  OR a design tweak to keep it lazy. The store-slice reclaim (§0.6) is the release valve if pressed.
- OWNER RE-SCOPE (2026-07-12): the M1-M10 mover ladder is LAUNCH content; Phase 6 after M10;
  checkpoint = validation milestone only.
- SETTLED DESIGN DECISIONS: design doc §II.5 (cost→weeks 1wk/primary-hop; culture = derived
  behavioral composite; imported maps aspatial v1; one-shot extraction) + §VI.4 (coalition = seat
  in v1; centrality ceiling as soak-guard; archetype = the faction key) + belief cold-start =
  ground-truth-at-canonize + envelope 5-30 settlements + round-18 (no party vantage; NPC excursions
  protected) + round-19 seasons + round-20 ports.
- ACCEPTED DRIFT CLASS: preset re-inference on newly-lit keys (A3, SEASONS-A) — display-only.
- KNOWN OPEN FINDINGS: population attractor (owner-parked, gates M4); legibility-at-density
  (feed 240-cap, backlog); analytics dual-import build warnings (pre-existing); 15 lint advisories;
  supplyCompleteness.js:158 carries a NUL-byte (`\x00`) cache-key delimiter between supplierId and
  commodityId — INTENTIONAL (collision-safe) but trips the F24 clean-NUL-scan discipline; owner-surfaced
  2026-07-13, left as-is pending their call (the ONLY remaining NUL in src/ after AccountPage fix
  c85781f0; use the python byte-count check per F24 memory — plain `grep -P '\x00'` misses it).
- INCIDENT PATTERNS (proven recoveries): session-limit agent deaths → §0.5; worktree-lane
  baseline collisions → type honestly at merge (b6959c9a); mis-cut worktree base → verify
  merge-base before work (the W5 re-merge self-correction).

### 0.0.3 IN-FLIGHT / ON THE DESK (update on every dispatch + landing)
- STEP 3.5 RUMORS & NEWS: COMMITTED 884b5011 — manager-reviewed under the Opus handoff.
- WAVE A THE BELIEF MAP: COMMITTED a4e04ad5 — the belief/decision layer complete; the fog of
  war is real.
- M1 EMBATTLEMENT ROUTING: COMMITTED 4f76f1ee — mover ladder #1; embattlement is now a
  first-class continuous region scalar with a hysteresis brake, cheap-vs-safe routing re-scores
  the frozen digest's derived candidate routes.
- M2 CARAVANS / SUPPLY-STARVATION: COMMITTED 67a94661 — mover ladder #2; trade now travels,
  a cut road starves a smithy, a starved besieged town's hold weakens. Headroom is now 17B (down
  from 35). CHIPPABILITY VERDICT (grounded 2026-07-12, wf_b465a1ff): the ladder is a SERIAL
  pipeline — chip nothing; M2-M8 all share distanceRead's re-score + pulseKernel's tick + a single
  budget slot; the ONE future fork is M9 (political lane, budget-free, disjoint surface) but only
  AFTER M5. NEXT: M3 (winter roads) is budget-free (rides the spatialDigest reserved slot) → fits
  the 17B. THEN M4 = THE OWNER GATE (population-attractor review + the budget-reclaim decision:
  RECOMMEND nesting the spatial mover ledgers under one namespace key to reclaim the per-mover
  eager cost, over the store-slice FP-2/W5 path). The new-key movers M4/M5/M6 do NOT fit 17B.
- FP-R SPATIAL LEDGER CONSOLIDATION: COMMITTED (this commit) — the budget reclaim gating M4/M5/M6.
  The 5 spatial mover ledgers (spatialArrivals/rumorLedgers/beliefMaps/embattlement/supplyShipments)
  now nest under ONE conditional key `spatialLedgers` (accessors homed in the lazy distanceRead.js —
  a fresh module leaked a chunk-manifest entry, so it was folded in). Eager array 5 literals → 1;
  closure 1,255,983 → 1,255,921 (−62B); budget RATCHETED DOWN 1,256,000 → 1,255,985 (64B reserved
  margin). A NEW mover ledger (M4 migration) now costs ZERO eager bytes (setSpatialLedger + generic
  ensureWorldState). Goldens byte-identical (0 fixtures touched, all 5 dormant); deep-clone-no-alias
  contract preserved at the relocated path; any-cast 2252; full suite 7887/7887. THE BUDGET WALL IS
  CLEARED — M4/M5/M6 are now budget-free.
- M4 MIGRATION-WITH-MORTALITY: COMMITTED (this commit) — mover ladder #4; population is now a spatial
  flow with two bounded mortality sinks + a by-construction conservation invariant. Owner-delegated
  attractor tuning landed HEALTHY (hub 3.16× mean — no megacity; min 493 — no annihilation; no chain-
  collapse); mortality is aggregate-only (named NPCs never touched — product boundary held). Budget-
  free (nests under spatialLedgers).
- M5 ARMY-TRANSIT + FIELD COMBAT: COMMITTED (this commit) — mover ladder #5, the war convergence.
  Armies move on the map, collide into the bounded field resolver (no-hand-of-miracle clamp), retreat
  by danger, carry rumors, and — the crux — siege-as-starvation REPLACES the capacity roll on the
  spatial path while all 6 siege pins stay byte-identical aspatial (manager grep-verified: no dual
  math). Courier umbilical makes an info-starved army mis-assess. Budget-free.
- M6a COMMODITY CONTINUITY: COMMITTED (this commit) — mover ladder #6 part a. Goods now have origin→
  destination physical truth (finite stocks, quantity stockpiles reconciled from M2, en-route tapping,
  goods-conservation invariant). ⚠️ OWNER-VISIBLE: gated behind a NEW commodityFlowEnabled opt-in
  (default OFF even in spatial campaigns) — a preset must turn it on. NEXT: M6b entrepôts/tolls →
  M6c the greed-vs-danger dispatch EV → M6d flow-derived economics (all read M6a's stocks + bands).
- M3 SEASONS-B / WINTER ROADS: COMMITTED ce949b8f — mover ladder #3; the digest's reserved
  seasonalOverlay slot lit (read-time per-season × terrain cost, frozen matrix untouched, slow-not-
  sever). BUDGET-FREE (closure UNCHANGED 1,255,983 / 17B headroom). OWNER DELEGATION (2026-07-12,
  "continue M3 to M4"): the owner handed me the M4 gate — I take the population-attractor tuning +
  the budget-reclaim approach on best judgment, conservative + retunable constants, DOCUMENTED here
  for later owner review. NEXT: the budget reclaim (ledger-namespace consolidation) must land BEFORE
  M4/M5/M6 — 17B does not fit a new migration ledger key. Then M4 migration-with-mortality.
- PARKING-LOT ADJUDICATION: ✅ RULED 2026-07-13 (owner, in-session; the "do NOT self-rule on §0.6"
  hold is satisfied — the owner decided, not the manager) — see §0.6.0. FP-2-first funding (no raise);
  M10b catch-up CAP=26 calendar-advances-past-cap; F24 AccountPage fixed (c85781f0); 5.5-K stale note
  corrected + guarded (47ccd6dd). Working branch claude/phase55-parking-lot off review-fixes-2026-07-08.
- FP-2a aiSlice: ✅ LANDED 715fe7b2 (2026-07-13, Opus) — −2,448 B closure via the loadEngine dep-import
  pattern (§0.7.3 correction: the eager-stub/body-extraction defers sync prefixes — do NOT use it).
  Budget still 1,255,985; the reclaim FUNDS M10b+W5 with no raise. FP-2b/c (settlementSlice, campaign
  trio) are OPTIONAL further ratchet-down (same dep-import pattern), NOT needed for the endgame.
- M10b LIVING/AUTONOMOUS + CAPPED CATCH-UP: ✅ LANDED (2026-07-13, Opus) — M10 COMPLETE. Catch-up == N
  manual advances (determinism pin, JSON-equal); new persisted cursor lastLivingAdvanceAt is undo-restored
  + legacy-seeded; +1,376 B eager (trim available §0.8) → closure 1,254,893 (margin 1,092). Full suite
  8,266/8,266; verify:dist 18/18. NEXT: M10b eager-trim → W5 → budget ratchet-down (§0.8).
- ⚠️ MERGE (2026-07-13): claude/phase55-parking-lot MERGED to review-fixes-2026-07-08, which had advanced
  (parallel Round-21 stream: W1 voice sidecars 25003430 + M11a PESTILENCE + their handoff
  docs/PHASE55_ROUND21_BACKLOG_PLAN.md @ 9298b6c4). Clean merge (zero file overlap). The ladder is now at
  M10 COMPLETE + M11a. [UPDATED 2026-07-13: M11b CALAMITY subsequently LANDED at 62c81a0c — the
  M1–M11 ladder is COMPLETE; ledger rows above.] See §0.8 for the post-merge next steps.
- FP-2 STORE-SLICE SPLIT (spec): SPECCED + READY (2026-07-13, Opus). Full implementation-ready
  spec at §0.7 (design + byte-identity de-risking + sequence). The ratified shared unblock; lands BEFORE
  M10b/W5 as its own focused wave (FP-2a aiSlice first). No FP-2 code written this session.
- W5 RE-MERGE: ✅ RULED FP-2-first (§0.6.1) — re-apply after FP-2, no raise; MUST cherry-pick (a direct
  merge reverts the M-ladder, -25,330). Branch 312a5025 reachable via claude/adoring-wescoff-6a25a8
  (NOT amazing-thompson — that worktree was repurposed to claude/elastic-leavitt-50d90e @ d024286e).
- MODEL: main loop switched to OPUS 4.8 (2026-07-12) — running the playbook as manager per §0.1.
  [2026-07-13: FABLE 5 RETURNED — running the PART-9 comprehensive grade-check + review/fix
  program (the standing Fable-reserved mandate); Opus staffs verification + implementation.]
- NEXT [REWRITTEN 2026-07-13 — the old pointer routed a successor to waves long landed]: the
  COMPREHENSIVE REVIEW+FIX PROGRAM is the active desk (docs/COMPREHENSIVE_REVIEW_PROGRAM.md —
  survey done, Opus verification + fix waves in flight) → then §0.8 (M10b trim → W5 → ratchet-down)
  → the Living Realm checkpoint (PART 5) → Phase 6 (PART 8) → launch.
- OWNER DECISION QUEUE: population-attractor review (gates M4); M10 expiry policy + Living-World
  catch-up; Phase-6 backlog triage; golden-regen sign-off if ever needed.
- FABLE-ON-RETURN QUEUE: checkpoint grade-check (PART 5.5); the final comprehensive grade-check
  (PART 9); interim grade on record: A overall (A+ bones / B+ experiential voice — the sidecar
  backlog is the named fix).

## 0.1 The roles, and what changes when Fable is absent
- FABLE (when available): architecture rulings, wave sequencing changes, brief authorship for
  UNSPECCED work, the per-wave review judgment calls, the final grade-check.
- OPUS-AS-MANAGER (when Fable is out): executes THIS playbook mechanically — dispatches the next
  wave per §0.4, runs the §0.3 review checklist on its return, commits with exact staging, moves on.
  Opus does NOT: re-sequence waves, override a ⚠️/🔱 marker, regenerate goldens without the
  documented protocol, widen a fence mid-wave, or invent architecture not in this playbook or the
  design doc. If a wave's implementer STOP-AND-REPORTs something this playbook doesn't answer:
  park that item, commit what's clean, continue the ladder, log it in §0.6.
- IMPLEMENTERS: always Opus 4.8, always `model:'opus'` on spawned agents, always fenced, always
  leave work UNSTAGED, always report per the wave's contract.

## 0.2 The constitutional laws (every wave, no exceptions)
1. SAME-SEED BYTE-IDENTITY — goldens byte-identical (generator, worldpulse, pdf) or STOP.
2. DORMANCY/ADDITIVITY — every new layer gated (spatialCanonVersion / a domain-module flag /
   default-off); ABSENT ⇒ prior bytes, VIRTUAL (no write-on-load).
3. PREMIUM — tier never touches generation; free/anon never see live deity names or DM truth;
   the includeCovert/includeGroundTruth selector convention is the reveal seam.
4. ENDOGENEITY — the party observes; it never feeds fit math.
5. FIRST-PAINT RATCHET — verify:dist green at the CURRENT budget (check
   tests/build/vendorPdfLazy.test.js CLOSURE_BUDGET_BYTES — FP-1 will have lowered it); any wave
   that moves the entry closure without explicit budget in its spec STOPs.
6. BOLD-OVER-SAFE WITHIN THE ABOVE — prefer the real architecture over the minimal patch whenever
   both satisfy the gates; overhaul + prove the bytes (the CL-0 worldState consolidation is the exemplar).

## 0.3 THE MANAGER'S REVIEW CHECKLIST (run on every implementer return — mechanical)
1. `git status --short` — the diff matches the report's file list EXACTLY; foreign files excluded.
2. Re-run INDEPENDENTLY (never trust the report): the wave's NEW test files; the three golden
   masters; `npm run build`; `npm run verify:dist`. On a contended machine run files individually.
3. Read the diff of every file the wave's fence marked sensitive (each wave chapter names them).
4. Check the wave's constitutional law specifically (each chapter names its law + its proof).
5. Commit with EXACT staging (list every file; never `git add -A` — parallel sessions leave
   foreign unstaged work), `--no-verify`, a message following the house style: what + why +
   the laws held + gate numbers (closure bytes, test counts).
6. Update the task list; dispatch the next wave per §0.4.
7. **UPDATE THE STATE LEDGER (§0.0) — BY LAW.** Append the wave's row to 0.0.1 (hash, what,
   deviations), record any new ruling/amendment in 0.0.2, and refresh 0.0.3 (in-flight/desk/
   queues). The ledger update rides the SAME commit as the wave (or the very next one). A wave
   is not "done" until its ledger row exists — this document is the successor's memory.

## 0.4 THE DISPATCH ORDER (the ladder — sequential chain, ONE optional chip ahead)
CURRENT (as of this writing): FP-1 in flight (budget-exclusive) · W5 chip in its worktree ·
Session/Foundry branch awaiting merge review (§6.2).
1. FP-1 lands → commit → note the NEW budget number.
2. Dispatch SEASONS-A (brief: SEASONS_A_BRIEF.md) in the main session.
   SIMULTANEOUSLY (optional, if lanes allow): chip 5.5-K (KEYSTONE_BRIEF.md) in a worktree —
   the ONE safe parallel wave (disjoint fence, no entry bytes, longest critical path).
   Also: run the §6.2 Session/Foundry merge review.
3. SEASONS-A lands → commit. Keystone lands → merge per §6.1 + commit.
4. Dispatch 5.5-M (MODULATION_BRIEF.md — verify the committed digest shape first).
5. 5.5-M lands → commit → dispatch STEP 3.5 (the full spec is §3 of this playbook).
6. 3.5 lands → commit → dispatch WAVE A (the full spec is §4 of this playbook).
7. Wave A lands → commit → merges (PART 6) → the M1-M10 mover ladder (PART 7, each its own wave) →
   THE LIVING REALM CHECKPOINT (PART 5, the everything-on validation) → Phase 6 (PART 8) → launch.
CONCURRENCY LAW: never more than TWO heavy lanes total (incl. chips); the budget-touching lane
runs exclusive; never chip a wave whose upstream interface is uncommitted.

## 0.5 Session-limit recovery (proven twice)
On an agent death at a limit boundary: (1) verify tree state (`git status` + mtimes — what did it
write?); (2) SendMessage to the SAME agent id (resumes from transcript, context intact) with a
state briefing: what exists unstaged, what remains, any tree changes since dispatch, "do not
rewrite what exists"; (3) if the tree went quiet 15+ min with no completion, ping the same way.

## 0.6 The parking lot (append here; do not act without a ruling)
### 0.6.0 BATCHED ADJUDICATION — OWNER RULED 2026-07-13 (Opus manager surfaced; owner decided)
All four parked items adjudicated in one batch with verified numbers (workflow wf_31ef114d + independent
checks; base review-fixes-2026-07-08 @ 5ea117ec, closure MEASURED 1,255,965 / budget 1,255,985 / 20B
margin). Rulings:
- FUNDING (M10b + W5): **FP-2 FIRST, NO RAISE.** The owner chose the store-slice split over a budget
  raise — FP-2 reclaims ~80–130K eager (measured directional), absorbing both M10b (+86B) and W5
  (~+890B) with headroom to ratchet the budget DOWN. FP-2 lands FIRST; M10b + W5 then land at the
  reclaimed budget. (Overrides the earlier "raise 1,255,985→1,256,100+" recommendation.)
- M10b CATCH-UP: **BUILD IT.** Living/autonomous advance-on-open catch-up CONFIRMED wanted;
  CATCH_UP_CAP_WEEKS = 26 (named/retunable, ACTOR_MAJOR_HOLD_WEEKS pattern; the design's soak value =
  half a game-year); PAST-CAP SEMANTICS = the calendar advances but simulation stops at the cap.
- F24: **AccountPage NUL fixed now** (cherry-picked 6faa1045 → c85781f0). supplyCompleteness.js:158
  NUL SURFACED (owner's call — see §0.0.2 KNOWN OPEN FINDINGS); left as-is for now.
- SCOPE: work on branch claude/phase55-parking-lot off review-fixes-2026-07-08; ratified + non-gated
  work lands there, gate-green, for the owner to fast-forward. Push/merge to review-fixes is owner-only.

### 0.6.1 The items (status after the 2026-07-13 ruling)
- (M10b) ✅ RULED — BUILD after FP-2. LIVING/AUTONOMOUS worldProgression + CAPPED CATCH-UP
  (CATCH_UP_CAP_WEEKS=26, calendar-advances-past-cap) + full_simulation preset flags
  (commodityFlowEnabled/allyIntelSharingEnabled/worldProgression:'autonomous'). worldProgressionOf
  today only distinguishes 'frozen' (simulationRules.js:314); 'living'/'autonomous' fail closed +
  UI-disabled; catch-up entirely unbuilt (forward-ref actorMajorApproval.js:39). +86B is an ESTIMATE
  (the cited scratchpad/measure.mjs is GONE — re-measure at build via tests/build/vendorPdfLazy.test.js;
  set the const to measured+~50B, never exceed a ceiling the owner has to re-ratify). ⚠️ ACCEPTED
  DRIFT: full_simulation→worldProgression:'autonomous' changes a rulesMatchPreset key, so pre-M10b
  saved full-sim campaigns re-infer a different presetId (display-only; same class as SEASONS-A).
  Budget: NOT a raise — FP-2a's −2,448 B reclaim funds it (margin 2,468 B; M10b +86B fits).
  ── M10b IMPLEMENTATION-READY FLOW DESIGN (surveyed 2026-07-13; decided on best judgment, VETOABLE) ──
  SURFACE MAPPED: worldState.tick is the authoritative clock; advanceCampaignWorld(campaignId, interval,
  {now}) (campaignWorldPulseSlice.js:322) runs ticksForInterval(interval) deterministic one-week kernel
  calls; campaign open = setActiveCampaign (campaignSlice.js:614). DETERMINISM IS INHERITED: catch-up =
  loop N one_week advanceCampaignWorld calls ⇒ byte-identical to N manual one-week advances BY
  CONSTRUCTION (same kernel, same N) — the soak just confirms it.
  THE DECISIONS (each vetoable):
  1. worldProgressionOf returns 'living'/'autonomous' verbatim (they are already valid enum values). The
     existing `=== 'frozen'` consumers are UNAFFECTED (living/autonomous ≠ frozen, same as dm_advanced) ⇒
     no advance-block change. NEW accessor advancesOnOpen(rules) = living||autonomous.
  2. CATCH-UP FLOW: on setActiveCampaign of an advancesOnOpen campaign, N = min(floor((now −
     lastLivingAdvanceAt)/WEEK_MS), CATCH_UP_CAP_WEEKS=26); loop N one_week advanceCampaignWorld({now});
     autoResolve = (worldProgression==='autonomous') — autonomous auto-resolves proposals, 'living'
     QUEUES them (DM reviews the backlog on open). Past cap: run 26, set stamp = now (calendar advances,
     sim stops at cap — the owner ruling).
  3. ⚠️ NEW PERSISTED STATE = worldState.lastLivingAdvanceAt (wall-clock ms) — this is the OWNER'S
     MOST-BITTEN BUG CLASS. It MUST be traced + pinned across EVERY lifecycle path: canonize (stamp = now),
     each advance (re-stamp), UNDO (undoLastPulse must restore the prior stamp — else catch-up double-runs),
     REGEN/clone, MIGRATE (absent on legacy saves ⇒ treat as "no catch-up owed", never a 1970 epoch delta),
     persist round-trip. Absent ⇒ advancesOnOpen is false-by-default (dm_advanced) ⇒ goldens byte-identical.
     `now` is INJECTED (options.now), never Date.now() in the engine — the store passes it at the call site.
  4. Preset: full_simulation gains worldProgression:'autonomous' + commodityFlowEnabled:true +
     allyIntelSharingEnabled:true (the last two just LIGHT already-built M6a/M9b features). UI: flip the two
     `false` flags at SimulationRulesAxes.jsx:33-34 to `true`.
  5. GATE: goldens byte-identical (default rules ⇒ dormant); a determinism pin (26 catch-up == 26 manual,
     byte-identical); an UNDO-survives pin (stamp restored) + a legacy-save pin (absent stamp ⇒ no phantom
     catch-up); verify:dist re-measures the +86B (must fit the 2,468 B margin) + ratchets the budget DOWN
     to the post-M10b/W5 closure; any-cast 2252. STATUS: ✅ BUILT + VERIFIED 2026-07-13 (Opus) — the flow
     above shipped exactly as designed. The determinism pin (JSON-equal: 5-week catch-up == 5 manual
     one-week advances) + the undo-restores-cursor pin + seed/up-to-date/cap/dormancy pins are green
     (tests/store/catchUpCampaignWorld.test.js, 6/6); goldens byte-identical; the profile validator +
     worldProgressionOf now ACCEPT living/autonomous (was 'progression_not_yet_built' → renamed
     'progression_unrecognized'; two pins updated). ⚠️ EAGER COST +1,376 B (NOT the +86 B estimate — the
     catchUpCampaignWorld action body rides the eager slice; FITS the budget, margin 1,092 B, FP-2a's
     reclaim still covers M10b+W5). TRIM AVAILABLE (§0.8): lazify the catch-up body via loadWorldEngine
     (the same FP-2a pattern) to reclaim ~800 B. TRIGGER: WorldPulsePanel fires the catch-up once on open
     for a living/autonomous campaign (Date.now-derived; cursor makes a same-week remount a no-op).
- (W5) ✅ RULED — RE-APPLY after FP-2, no raise. Cosmetic sweep, branch 312a5025 (reachable via
  claude/adoring-wescoff-6a25a8). CORRECTIONS: true delta 68 files (+3355/-1077) vs its OWN base
  df217415; a direct `git merge` applies -25,330 deletions / 189 files and REVERTS the M-ladder —
  MUST cherry-pick / re-apply, never merge. Eager delta ~+890B MEASURED (not "+1,000"); the two eager
  fields are configSlice.customSlidersExplicit + mapSlice.selectedAnnotationKind (DIFFERENT slices,
  not "two configSlice fields"). Re-base conflict surface = 2 files (OutputContainer.jsx — keep BOTH
  3.5's dossierLazyTabs and W5's dossier polish — + the budget const). ⚠️ do NOT apply W5's raw-color
  ratchet 1546→1424 without its palette-token migration (review-fixes still has 1546). The 11th W5
  commit 6faa1045 (F24 AccountPage fix) is ALREADY cherry-picked (c85781f0) — do not double-apply.
- (5.5-K) ✅ CORRECTED — NOTHING TO BUILD; note was STALE. The live FMG-iframe read-only capture seam
  is FULLY WIRED both sides by 5.5-M @ 18fc15f2: iframe handler sf-bridge.js:863 (copies
  h/biome/r/p/c — broader than the old note's "H/biome/r/c"), client RPC mapBridge.js:280, freeze-first
  double-capture spatialPackCapture.js:91, registry + canonize integration (dormant
  spatial_capture_unavailable fallback). Contradicted the playbook's own ledger row 43. RESIDUAL:
  only the EMPIRICAL determinism check against a REAL map — DEFERRED to the checkpoint soak (freeze-first
  is a total function over both outcomes, so it's non-blocking). Freeze-first now has a guard test
  (tests/lib/spatialPackCapture.test.js, commit 47ccd6dd, +3 pins).
- (FP-1/FP-2) ✅ RULED — APPROVED as its own wave, lands FIRST (the shared unblock the owner chose over
  a raise). The monolithic 15-slice create() (store/index.js:48) statically imports the heavy feature
  slices (settlementSlice/aiSlice/campaign trio) into the eager index chunk. ARCHITECTURE (candidate A,
  placeholder-then-hydrate): eager create() composes only the core slices + seeds each heavy slice's
  small INITIAL STATE eagerly (so selectors + subscribeWithSelector see a stable shape); each heavy
  ACTION is a thin stub that on first call dynamic-imports the real slice, runs its creator, merges via
  set(), then invokes the real action. Reclaim ~80–130K minified (directional; exact needs the build).
  ⚠️ DOMINANT RISK: the store orchestrates generation — same-seed byte-identity (constitutional law 1)
  MUST hold; the full golden battery + any-cast 2252 gate every step. persist partialize never persists
  these slices (store/index.js:71), so rehydration can't break.

## 0.7 FP-2 WAVE SPEC (implementation-ready; owner ruled FP-2-first 2026-07-13)
The ratified store-slice split, written to the depth an Opus implementer executes without architectural
guessing (§0.1). It is the shared unblock for M10b + W5.

### 0.7.1 THE KEY DE-RISKING (verified 2026-07-13 — CORRECTS the FP-2 verifier's "dominant risk")
The byte-identity GOLDENS ARE STORE-FREE: no test under tests/property/*Golden.test.js (nor tests/
generators|domain|build|simulation) imports store/index.js, useStore, or any heavy-slice creator
(grep-verified). The generator/worldPulse/pdf goldens exercise the PURE headless engine directly (the
store's own comment: the generator is "runnable headlessly … free of any zustand/react import"); the
slices reach the engine via DYNAMIC loadEngine() (settlementSlice.js:28-33 = import('../generators/…')),
so the ~529KB engine chunk is ALREADY lazy. ⇒ An FP-2 store refactor CANNOT shift golden bytes —
same-seed byte-identity (law 1) is ORTHOGONAL to this wave. Real blast radius = the ~27 STORE-BEHAVIOR
tests (tests/store/*, tests/joins/* — they drive the slices' actions directly) + verify:dist (reclaim +
budget). This makes FP-2 materially SAFER than the verifier feared.

### 0.7.2 WHAT RECLAIMS (and what does NOT)
Reclaim = the heavy slices' ORCHESTRATION code (action bodies), NOT their state (small) and NOT the
generator (already lazy). Heavy slices, imported ONLY by store/index.js (grep-verified): settlementSlice
(91,648B src) / aiSlice (60,313B) / campaignSlice (31,847B) / campaignRegionalSlice (30,931B) /
campaignWorldPulseSlice (35,376B). persist partialize (store/index.js:71) NEVER persists any heavy-slice
state ⇒ lazy registration cannot break rehydration. Verifier estimate ~80–130K minified reclaim (floor
~25K); the owner-need is only ~976B (M10b +86B + W5 ~890B) — any reclaim clearing that with margin funds
BOTH and lets the budget RATCHET DOWN.

### 0.7.3 THE DESIGN
⚠️ CORRECTION (FP-2a @ 715fe7b2 proved it): the body-extraction below is WRONG. Moving an async
action's BODY behind `await import()` defers the action's SYNCHRONOUS PREFIX (the guards, set(loading),
the abort-controller stamp that run before the first real await) by a microtask — observable, and it
broke the aiSlice F18 abort tests. The CORRECT pattern (used by FP-2a, and by settlementSlice's
loadEngine all along): KEEP the action eager in xSlice.js; dynamic-import only its heavy SOLE-IMPORTED
DEPS at the call site, AFTER the sync prefix (`const { generateNarrative } = await loadAiLib();` right
before the transport call). Memoize the loader. This reclaims the deps' chunk with the sync prefix
intact; the one shift is the dep-consuming call fires one microtask later (benign; matches loadEngine).
Measure per slice — FP-2a's reclaim was 2,448 B (mostly lib/ai.js), NOT the ~25K the verifier guessed
(the orchestration BODY code stays eager; only sole-imported deps reclaim). FP-2a already funds M10b+W5;
FP-2b (settlementSlice) + FP-2c (campaign trio) are OPTIONAL further ratchet-down, same dep-import
pattern. The eager-stub/body-extraction design that follows is SUPERSEDED — kept only as the record of
why it fails.

### 0.7.3-OLD THE DESIGN — SUPERSEDED eager-stub variant (do NOT use; see the correction above)
Each heavy slice mixes small SYNC setters/getters with big ASYNC orchestrators (generateSettlement,
requestNarrative/DailyLife/Progression, importGalleryMap*, advance/preview worldpulse, …). The async
bodies are the bulk of the reclaim AND the only ones a lazy stub can serve WITHOUT a timing race — a
sync setter cannot await a dynamic import on first call. So:
- Split each heavy slice into EAGER `xSlice.js` (state + SYNC actions + ASYNC stubs) and LAZY
  `xSliceBody.js` (the async orchestrator bodies + heavy helpers they pull).
- Each ASYNC action becomes a stub: `async (...a) => { await ensureXBody(set,get); return get().name(...a) }`,
  where ensureXBody idempotently dynamic-imports xSliceBody ONCE and runs installXBody(set,get), which
  set()-merges the real async actions OVER the stubs; call #2 onward hits the real action.
- SYNC actions + all state STAY EAGER, unchanged (small code; no race, no contract change).
- MANIFEST + WALKER (structural-prevention): xSlice.js exports ASYNC_ACTION_NAMES (the stub list); a
  walker test asserts it EXACTLY matches the async actions installXBody provides — so a new async action
  can't be added to the body without a stub (which would 404 the eager call before hydration).
  @enforced-by a new tests/store/lazySliceManifest.test.js.
REJECTED VARIANT (recorded, per deep-work): a single eager-microtask hydration of the WHOLE slice
(sync + async) avoids the split but leaves a real-if-practically-impossible race for a sync setter fired
before the microtask install resolves — a quiet-lie risk. The async-only split has NO race and is the
recommended first cut; a later pass MAY lazify big sync bodies (recordSnapshot/revertToSnapshot/applyEvent
in settlementSlice) ONLY behind a proven-safe sync-hydration guard, owner-reviewed.

### 0.7.4 SEQUENCE + GATE (one gateable commit per slice — foundation-then-consumers)
Prove the pattern on ONE slice first (recommend aiSlice — clean async orchestrators, verifier floor
~25K), MEASURE the reclaim via a build + tests/build/vendorPdfLazy.test.js, verify that slice's store
tests + the FULL suite green + the goldens still byte-identical (proof-by-running: they can't change),
then extend slice-by-slice: FP-2a aiSlice → FP-2b settlementSlice → FP-2c campaign trio. After the LAST
slice, RATCHET CLOSURE_BUDGET_BYTES DOWN to the new measured closure (only-shrinks) — that ratchet is
what funds M10b + W5 at no raise. Per-wave gate = the slice's store/join tests + full suite + build +
verify:dist + any-cast 2252 + the manifest walker; one commit per slice; ledger row per §0.3-7.
THEN unblocked: M10b (§0.6.1, CAP=26, re-measure the +86B at build) and W5 (§0.6.1, cherry-pick onto the
reclaimed budget — NEVER merge 312a5025 directly).

## 0.8 IMMEDIATE NEXT STEPS (post-merge handoff — Opus, 2026-07-13, in priority order)
This session (branch claude/phase55-parking-lot, MERGED to review-fixes-2026-07-08) shipped: the parking-lot
ADJUDICATION (§0.6.0) + F24 AccountPage NUL fix + 5.5-K freeze-first guard + FP-2a (−2,448 B) + M10b
(living/autonomous catch-up, +1,376 B). Net budget: closure 1,254,893 ≤ 1,255,985 (margin 1,092 B). NOTE:
the merge folded in the PARALLEL session's Round-21 W1 (voice sidecars 25003430) + M11a PESTILENCE + docs
(their handoff = docs/PHASE55_ROUND21_BACKLOG_PLAN.md @ 9298b6c4 — READ IT; that stream owns the round-21
backlog + M11). Their work is budget-free/lazy, so the merged closure ≈ this branch's; RE-MEASURE
verify:dist on the merged tree before trusting any number. [RESOLVED 2026-07-13: the calamity.js
"uncommitted foreign WIP" note below is OBSOLETE — M11b LANDED at 62c81a0c; the ladder is complete.]

1. **M10b EAGER-COST TRIM (byte-discipline, ~800 B reclaim)** — M10b landed at +1,376 B, not the +86 B
   estimate, because catchUpCampaignWorld's body sits eager in campaignWorldPulseSlice.js (the hot slice).
   Lazify it via the FP-2a/loadEngine pattern: move the body to campaignAdvanceSession.js as
   `runCatchUpCampaignWorld({set,get,campaignId,options})`, leave a thin eager wrapper
   `catchUpCampaignWorld: async (id,opts) => (await loadWorldEngine()).runCatchUpCampaignWorld({...})`.
   Optionally also move the ~10-line post-advance stamp block into runAdvanceCampaignWorld (it's store-level,
   not the kernel — goldens unaffected). Re-run tests/store/catchUpCampaignWorld.test.js + verify:dist. This
   restores M10b toward the estimate and lets the budget ratchet DOWN meaningfully.
2. **W5 RE-APPLY (§0.6.1)** — cherry-pick the W5 cosmetic sweep (312a5025, via claude/adoring-wescoff-6a25a8;
   NEVER `git merge` — reverts the M-ladder, −25,330). ~+890 B eager. ⚠️ CHECK FIT: margin is now 1,092 B, so
   W5 fits (→ ~200 B) ONLY if M10b is trimmed first (step 1) OR you accept the thin margin. Resolve
   OutputContainer.jsx keeping BOTH 3.5's dossierLazyTabs and W5's dossier polish; do NOT apply W5's raw-color
   1546→1424 ratchet without its palette migration; the 11th W5 commit 6faa1045 is already landed (c85781f0)
   — skip it. Full gate battery.
3. **RATCHET CLOSURE_BUDGET_BYTES DOWN** (constitutional §0.2-5, only-shrinks) — after M10b-trim + W5 land,
   set the budget const (tests/build/vendorPdfLazy.test.js) to the new measured closure + a ~50 B artifact
   margin. This is the ratchet-down FP-2 was ruled for; do it as its own tiny commit.
4. **The empirical 5.5-K determinism check** — the live capture seam is wired + guarded (§0.6.1); the ONE
   residual is running an entitled canonize against a REAL FMG map to confirm two reads are byte-identical
   (freeze-first already handles either outcome). Owner deferred this to the Living-Realm checkpoint SOAK.
5. **supplyCompleteness.js:158 NUL** (§0.0.2) — the second live NUL byte (an intentional-looking cache-key
   delimiter). Owner-surfaced, left as-is; decide at the master-merge byte-integrity pass.
6. **FP-2b / FP-2c** (§0.7, OPTIONAL) — settlementSlice + campaign-trio dep-import reclaim (same loadEngine
   pattern). Not needed for the endgame; pure further ratchet-down. settlementSlice already uses loadEngine
   for the generator, so its unique reclaim is smaller.
7. **THE ENDGAME** — per memory/handoff-plan-post-ladder: the mover ladder is COMPLETE (M11b landed
   62c81a0c); the comprehensive review+fix program + the round-21 backlog continue, then the
   Living-Realm checkpoint SOAKS + everything-on TUNING (next-AI), then the MASTER MERGE (the high-risk item
   — memory/third-lineage-mystifying-ride) + push/deploy.

---

# PART 1 — 5.5-K: THE KEYSTONE (brief committed: docs/briefs/KEYSTONE_BRIEF.md)

The hardest wave. The brief is complete and binding; this chapter adds the MANAGER's protocol.

## 1.1 What it is (one paragraph)
An entitled, explicit opt-in at canonize stamps `worldState.spatialCanonVersion` and runs a
ONE-SHOT extraction: pack.cells captured from the FMG iframe once, then a PURE domain module
(src/domain/spatial/**) quantizes the cost field to integers and runs ONE multi-source Dijkstra
→ territory, gates, neighbour tiers, distance matrix, route receipts — persisted as an immutable,
conditionally-materialized digest with THREE version axes (spatialGeometryVersion, costLawVersion,
overlayVersion) and FOUR reserved null slots (seaLanes, airField, teleportEdges, seasonalOverlay).
LAND FIELD + SCHEMA ONLY — no consumers, no sea/air/seasonal materialization (scope-frozen).

## 1.2 Manager review — the sensitive reads
- The DORMANT proof: a canonized-but-not-opted-in fixture advances byte-identically (the test
  must exist and pass); the golden corpus untouched.
- The EXTRACTION-DETERMINISM finding: the report MUST answer whether two iframe captures of the
  same map are byte-identical. If NOT: the ruling is already made — FREEZE THE FIRST CAPTURE as
  canon (never recompute), and the digest golden pins it. Do not let the implementer soften this.
- The DIGEST SIZE numbers (5/15/30-settlement maps). Over ~200KB at 30 ⇒ the compaction options
  come back as a report, not a shipped save-bloater.
- Tie-break tests concrete (an equal-cost fixture asserting the deterministic choice).
- The entitlement read is AT THE STORE CALL SITE; the domain stays tier-blind. Grep the diff for
  any tier/auth read under src/domain/spatial/ — must be zero.
- The reserved slots are null-present in the schema AND the digest golden (so materializing waves
  can't schema-break).
## 1.3 Failure modes to expect
- Iframe capture nondeterminism (answered above — freeze-first).
- A* iteration blowups on big maps → the multi-source Dijkstra is the prescribed algorithm;
  all-pairs A* in the diff is grounds to bounce the wave.
- Scope creep toward consumers ("just wire one read to prove it") — bounce; Modulation is the
  consumer wave.

---

# PART 2 — 5.5-M: MODULATION (brief committed: docs/briefs/MODULATION_BRIEF.md)

## 2.1 What it is
Three seams read the digest under the marker: trade channel weights × distanceWeight, faith-spread
reach × distanceWeight, and regional-impact propagation gains ARRIVAL DELAY via a conditionally-
materialized arrival queue (news dated at arrival). hopWeeks derives its weeks-per-cost constant
from the digest's distance distribution (median primary hop ≈ 1-2wk, diameter ≈ one season) and
RECORDS it in the digest receipts. NO new movers/rumors/carriers.

## 2.2 Manager review — the sensitive reads
- VERIFY-FIRST evidence: the report must cite the committed digest field names it read (not the
  brief's guesses).
- The dormant branch: the aspatial code path is UNTOUCHED (prefer parallel gated reads over edits
  to aspatial expressions) — read the diff of tradeSalience/religiousContest/propagation for any
  un-gated behavior change.
- The arrival queue: object-keyed, conditionally materialized, applied in codepoint-sorted order
  at tick start; expiry/limits documented.
- The weight FLOOR (an established channel never zeroes) — the constant + its rationale in the report.
- Spatial-on golden fixture: deterministic across two runs; committed.
## 2.3 Failure modes
- Latency applied to LOCAL (same-settlement) effects — arrival delay is for CROSS-settlement
  propagation only.
- Double-modulation (weight applied at two seams of the same chain) — the report must show each
  chain modulated exactly once.

---

# PART 3 — STEP 3.5: RUMORS & NEWS (trade-carrier) + PERFECT-BUT-DELAYED — THE FULL SPEC
## (this section IS the implementer brief — copy it into the dispatch prompt)

DEPENDS ON: 5.5-M committed (the arrival queue + hopWeeks exist). BINDING: design doc §4f (the
info-quality vector, round-13 PRNG organic degradation), PART III (§III.1 wizardNews substrate
facts, §III.2 the five determinism disciplines, §III.3 the crown-ships-early correction), PART VI
§VI.2-1 (LINEAGE AT 3.5, NON-DEFERRABLE), §11 (the info-mode control).

### 3.1 Scope law
TRADE CARRIER ONLY. No armies/refugees/faith/courier/criminal/magic carriers (they ship WITH their
movers, post-checkpoint). Two info modes ship: PERFECT-BUT-DELAYED (build FIRST — §11's sleeper)
and UNRELIABLE-NEWS (the fidelity vector + organic degradation). OMNISCIENT = the dormant default.
FULL-INFO-SIM does NOT ship here (needs factional beliefs, Wave A+).

### 3.2 The architecture (pre-decided)
1. THE RUMOR PACKET + PER-SETTLEMENT LEDGER — a NEW conditionally-materialized worldState key
   (NOT a WizardNewsEntry schema change — PART III §III.2-3 is binding: campaign.wizardNews is
   written for every campaign; touching its schema breaks dormancy). Shape:
   `worldState.rumorLedgers = { [settlementId]: { [eventKey]: arrivalRecord } }`, top-K bounded
   (K=24 initial; tune in soak), tick-age expiry (NEVER createdAt).
2. THE ARRIVAL RECORD carries: eventRef (the wizardNews sourceEventId — the canonical event id,
   verified existing at propagation.js:1067), `lineageIds[]` (THE NON-DEFERRABLE FIELD — roots at
   the canonical id; every relay appends its telling), arrivalTick, hopCount, carrier ('trade'),
   and the CONTENT+TRUST vector fields per §4f: completeness01, accuracy01 (a DERIVED summary of
   field mutations, not stored prose), framing tags, provenance (source settlement + relay chain),
   corroboration count (INDEPENDENCE-WEIGHTED: reports sharing lineage roots corroborate ~0 —
   PART V §V.3 is binding; count independent lineages, not arrivals).
3. PROPAGATION — hop-by-hop over the TRADE edges only, riding 5.5-M's arrival queue (a rumor IS a
   delayed arrival with a payload). Continuation guard per-(event,carrier); recording
   per-(event,settlement,carrier) (PART III §III.2-6). Significance gate: reuse
   significanceForImpact/score — only `major`+high-`notable` events enter the network; score
   modulates max hop distance (constants documented, tuned in soak).
4. DEGRADATION (Unreliable mode only) — per-hop SEEDED roll forked
   `rumor-organic:${eventId}:${carrierId}:${edgeId}:${hop}` off the pulse rng confluence
   (pulseKernel.js:230) — a DISTRIBUTION with tails (rare perfect preservation, rare severe
   garble; round 13). Completeness decay drops low-salience FIELDS; accuracy mutation is BOUNDED
   (magnitude bands, name-swaps only to real in-world names). Perfect-but-Delayed mode: NO rolls,
   NO vector decay — latency only (timeliness is deterministic arithmetic).
5. THE READ-MODEL — pure `settlementRumors({worldState, settlementId, includeGroundTruth=false})`
   following the mobilizationStatus.js includeCovert convention (PART IV §IV.2): player projection
   = a WHITELISTED field set, value-scrubbed (deity names only if resolving to an ACTIVATED public
   snapshot; causeClass/covert dropped — PART III §III.2-4 binding). DM projection adds ground
   truth + provenance + divergence. The share-to-gallery pipeline strips DM truth at the EXISTING
   publicSafe seam (round 18 ruling — ONE seam, no new party state).
6. THE SURFACE — a "Rumors & News" section in the settlement dossier's World area (lazy), built
   on the WizardNewsPanel partition idiom (mine/elsewhere per settlementIds); arc-threading reused
   where applicable. Fiction-not-internals copy. FIRST-PAINT: zero entry bytes (lazy only).
7. THE CONTROL — `infoMode` in the CL-0 profile stops being locked: 'omniscient' (default,
   dormant) / 'perfect_delayed' / 'unreliable'. Preset wiring: living_realm → perfect_delayed;
   full_simulation → unreliable. Ruleset receipts on change; PROSPECTIVE application (historical
   reports don't gain lineage — PART V/§11 binding).
### 3.3 The tests (the wave's proof)
Dormant byte-identity (omniscient/no-marker ⇒ zero new keys); Perfect-but-Delayed determinism
(two runs byte-identical); Unreliable same-seed identity + different-seed divergence; the
FALSE-CORROBORATION pin (5 relays of 1 origin ⇒ independence count 1; 2 independent lineages ⇒ 2);
lineage threading (every arrival's lineageIds roots at the canonical event); expiry by tick-age;
the whitelist scrub (a free/anon projection NEVER contains a latent deity name, covert tag, or
ground-truth field — adversarial fixture with a deity-carrying event); top-K bounding; a
rumor-ledger golden fixture.
### 3.4 Manager review — sensitive reads
The whitelist function (read it line-by-line against PART III §III.2-4); the fork keys (per
event+carrier+edge+hop, never per settlement — §III.2-5); wizardNews schema UNTOUCHED (empty diff
on wizardNews.js normalizeEntry/schemaVersion); the CL preset wiring (receipts fire).

---

# PART 4 — WAVE A: THE BELIEF MAP — THE FULL SPEC
## (this section IS the implementer brief)

DEPENDS ON: 3.5 committed. BINDING: design doc §4g (rounds 10/13/14/15), PART IV (the verified
seams + IV.3 disciplines + IV.4 corrections + IV.5 order), PART V §V.4 (the reconciliation rule),
PART VI (VI.3 Wave-A amendment + VI.4 rulings).

### 4.1 Scope law
ZERO NEW MOVERS. This wave makes the EXISTING war chooser belief-sourced and misjudgment legible.
No preemptive strikes/ally-defense marches (Wave B, needs army-transit). The war domain's
DM-Driven state stays deferred (the initiate/resolve split is Wave B).

### 4.2 The architecture (pre-decided)
1. THE BELIEF LEDGER — `worldState.beliefMaps = { [observerId]: { [factionId]: { [subjectId]:
   { readiness, strengthBand, allianceLabel, faithLabel, confidence01, lastUpdateTick } } } }`
   — conditionally materialized under spatialCanonVersion + infoMode != omniscient. THE FACTION
   KEY IS PRESENT FROM DAY ONE, defaulting to THE GOVERNING SEAT (round-14/VI.4-1 ruling: v1 =
   the single isGoverning seat's operational belief; coalition derivation is Wave B). An
   (observer,subject) entry materializes ONLY when a rumor actually reached the observer
   (PART IV §IV.3-1 — never pre-populate; the sparse graph is the cardinality cap).
2. COLD-START (VI.4/round ruling, owner-delegated, now BINDING): at spatial opt-in, beliefs
   INITIALIZE TO GROUND TRUTH AS-OF-CANONIZE (confidence 1.0, lastUpdateTick = canonize tick).
   The fog ACCUMULATES from there. (This also makes the dormant→active transition non-paranoid.)
3. THE UPDATE RULE (V.4, the consumption point of rounds 12/13/15) — a pure
   `advanceBeliefMaps({snapshot, priorLedger, incomingReports, tick})` modeled NODE-FOR-NODE on
   advanceInstitutionTolerance (institutionTolerance.js:172 — PART IV verified precedent).
   Per-(observer,subject,attribute): weighted reconciliation of decayed-prior + reports, weights =
   provenance(source reliability) × recency(tick-delta) × INDEPENDENCE (3.5's lineage signal) ×
   prior-confidence. CONTRADICTION widens uncertainty (confidence drops — a contested belief).
   CONFIDENCE DECAYS with silence: pure arithmetic on (tick − lastUpdateTick), NO rng (round 13 /
   PART IV §IV.3-4). Total-order fold: packets sorted (tick desc, score desc, fidelity desc,
   codepoint packetId) BEFORE folding; observers+subjects codepoint-sorted (§III.2-5/IV.3-2).
4. THE THREE RE-PLUMBED READS (PART IV §IV.1 — the whole attachment): settlementStrategy.js
   buildStrengthLookup (:111), contextFor relationship labels (:164), isBesieged/warFronts (:101)
   route through ONE pure selector `belief(observer, subject, worldState)` with IDENTITY FALLBACK:
   marker absent OR omniscient ⇒ ground truth verbatim, NO rng forked (the fidelityNoise
   neutrality-theorem discipline — byte-exact today, gated orthogonally to settlementStrategyEnabled
   per PART IV §IV.4). Marker present + no belief record ⇒ MAX-UNCERTAINTY read (absence-as-
   information at the seam, §IV.3-5). SELF-reads stay ground truth (the self/other carve-out §IV.4).
5. MISJUDGMENT-AS-CAUSE — when the chooser acts on a belief whose divergence from ground truth
   exceeds a band, stamp a `misjudgment` record (the W-C5 cause-lifecycle shape: what was believed,
   what was true, which report misled) → a wizardNews entry in the house voice + a legible receipt.
   This is the fog of war made DM-visible.
6. THE DM VIEW — extend the 3.5 read-model: truth vs belief vs divergence per settlement
   (includeGroundTruth convention). The dossier war/status read gains a "what they believe" band
   (premium/DM only; player projection unchanged).
7. SCORER DOWN-PAYMENT ONLY (VI.3): lift enumerateMoves' four inlined formulas into a DEFAULT
   ScoringObjective descriptor, golden-pinned byte-identical. NO objective parameterization beyond
   the default (Wave B).
### 4.3 The tests
Byte-identity: marker-absent + omniscient fixtures advance byte-identically (the constitutional
pins, per-flag); cold-start init (beliefs == truth at opt-in); reconciliation properties
(deterministic, order-independent after sort, contradiction widens, silence decays, independence
weights beat echo-chambers); the three reads' identity-fallback (no marker ⇒ bytes equal HEAD);
misjudgment fires on a constructed stale-belief war fixture and produces the receipt; the DM/player
projection scrub (adversarial); cardinality (no entry without an arrival; a 30-settlement fixture's
ledger stays sparse); a belief-ledger golden.
### 4.4 Manager review — sensitive reads
The identity-fallback function (line-by-line: absent ⇒ verbatim ground truth, zero forks); the
gate is spatialCanonVersion+infoMode, NEVER settlementStrategyEnabled; the fold's sort keys; the
misjudgment band constants (documented, soak-tunable); goldens + the war-behavior pins (the CL-0
rogue-family fixture must still replay identically under legacy defaults).

---

# PART 6 — MERGES + IN-FLIGHT (the near-term desk)

## 6.1 Merging worktree branches (W5, Session/Foundry, keystone-if-chipped)
Protocol per branch: (1) read ITS report/commits; (2) rebase onto current HEAD (or merge if rebase
is noisy — prefer rebase for linear history); (3) resolve conflicts PREFERRING HEAD's constitutional
seams (budget test, simulationRules, worldState) and the branch's own feature files; (4) run the
FULL battery on the merged tree (this is where parallel lanes pay their serialization tax — budget
for it); (5) the faith/premium adversarial check on any branch adding surfaces (Session/Foundry's
faithEventFilter seam gets the FaithSection-equivalence test treatment: free/anon fixture, no
deity names, gate load-bearing); (6) exact-stage commit.
## 6.2 Session/Foundry branch (claude/peaceful-volhard-0ad3f1, 5 commits) — review AFTER FP-1
lands (it adds UI surfaces against a budget FP-1 is rewriting). The faithEventFilter seam is the
sensitive read. W5 (worktree amazing-euclid) merges when its session ends, same protocol.

# PART 7 — THE MOVER LADDER (⚠️ OWNER RE-SCOPE 2026-07-12: LAUNCH CONTENT, no longer post-launch)
## Dispatch-ready specs, PART-3 depth. Order BINDING. Each wave = mover + CO-BUILT brake + OWN soak.
## Execution order (owner 2026-07-12): this ladder runs BEFORE the Living Realm checkpoint (PART 5) —
## the checkpoint is the FINAL everything-on validation of the mover-COMPLETE engine, then Phase 6
## (PART 8), then launch. Each mover has its OWN incremental soak; the checkpoint's soak is the single
## holistic pass over all movers at the end. Universal laws for every M-wave: dormant (no marker /
## flag off) ⇒ byte-identical; conditionally-materialized ledgers (object-keyed); seeded forks from
## stable composite keys; codepoint-sorted mutation order; tick-time only; carriers ship WITH their
## movers (round 9); every wave re-runs the prior soaks green; any-cast 0-hole; the manager checklist §0.3.

### M1 — EMBATTLEMENT ROUTING (depends: 5.5-M)
Embattlement = a first-class CONTINUOUS region scalar in a new conditional ledger: ramp inputs =
occupation, active siege, pyrrhic war aftermath (war_exhaustion), high crime; counterforce = security
institutions + falling crime (the W-C3 machinery). HYSTERESIS is the co-built brake (PART II §II.3-3):
enter >X, exit <Y<X, minimum dwell ticks — routing reads the SCALAR (graded cost), never a boolean.
Cheap-vs-safe = RE-SCORING the k cached candidate routes per mover risk tolerance (k-shortest cached
at canonize per §II.4 — NEVER re-pathfind per tick); risk tolerance from settlementAlignment (W0) via
the rust/fidelity read (lawful/seasoned reads danger true). Trade through embattled routes: seeded
sporadic banditry loss — bounded, non-catastrophic (fork `banditry:${shipmentId}:${tick}`; v1 applies
to channel strength, real shipments arrive with M2). Fence: src/domain/spatial/embattlement.js +
distanceRead re-score + the ramp-input reads. Soak: threshold-jitter fixture NEVER flip-flops; 10y
embattled-border run bounded. Sensitive reads: the hysteresis constants; the scalar never gates a
boolean anywhere.

### M2 — CARAVANS / SUPPLY-STARVATION (depends: M1)
Per-CONSUMING-INSTITUTION supply links: at trade-establishment, pre-rank the K cheapest reachable
producers per (institution, input) from the digest (§II.4 — failover is O(K) list-walk, never a
re-solve). In-transit SHIPMENT ledger: ONE record per active link {institutionId, input, sourceId,
arrivalTick} riding hopWeeks — aggregate, bounded, conditionally materialized. NEW impairment kind
SUPPLY-STARVED in entities/status.js, GENERALIZING blockadeTransport's access impairment (one
starvation ledger — §II.3-4-g; foodStockpile REMAINS the food-specific buffer, no double-count);
per-input stockpile buffers generalize the foodStockpile pattern (iron etc.); triggers ONLY on
extended total cut (all K sources severed AND buffer empty); TEMPORARY (lifts on arrival); the causal
receipt is mandatory ("the smithy starves: the iron road is cut under the siege of X; no shipment in
N weeks"); resolution rides W-C5. Basic interception: a hostile-to-destination gate on the route cuts
the shipment (full smuggle counterplay = M7). M2b (same wave, AUGMENT not replace): resolveSiegeVerdict
gains a supply-interdiction TERM (a supply-starved besieged settlement's hold weakens) — the full
siege-as-starvation replacement completes in M5. CO-BUILT BRAKE: assert ≥2 independent source paths
for critical inputs at establishment (else flag, don't starve — §II.3-3). Soak: siege-starvation
cascade depth/rate capped; 10y supply-web run. Sensitive: ledger cardinality (records = active links,
never per-wagon); the generalized impairment does not re-trigger blockadeTransport's.

### M3 — SEASONS-B: WINTER ROADS (depends: M2; small)
The seasonalOverlay reserved slot materializes: per-season cost multipliers, MULTIPLICATIVE with
terrain (mountains → near-impassable, plains merely slow — round 19 slow-not-sever), versioned under
costLawVersion/overlayVersion (a cost-law change = receipted re-canonize per §V.1). Consequences
emerge, not authored: winter arrival ticks lengthen (info runs cold), the SPRING THAW news burst
appears in the rumor ledger, campaign season emerges by cost. Storm-season hooks pre-wired for M8's
sea lanes. Soak: the annual route-rhythm visible in arrival distributions; hungry-gap × slow-roads
composition bounded (a snowed-in famine town must be rescuable by spring, not annihilated — tune with
the SEASONS-A constants).

### M4 — MIGRATION-WITH-MORTALITY (depends: M3; HIGH-RISK — owner reviews the population-attractor
### finding BEFORE dispatch ⚠️)
The §4c full model: context-dependent carrying-capacity tolerance (prosperity + connectivity +
granary raise it); excess migrates along routes; TWO mortality sinks (origin + road, road deaths
scale with M1 embattlement + M3 season — refugees through a winter war zone die more) — both EVENTS
with receipts; destination = the 4-axis weighted choice (closest / least cultureDistance / least
hostile / richest) with a PRNG scatter fraction. cultureDistance(a,b) is BUILT HERE: the pure
composite selector (faith proximity via deity axes + alignment proximity via W0's settlementAlignment
+ economy/ways-of-life + trade ties + governance drift via factionArchetype 3-axis — rounds 6/7,
§II.5-2). Arrival feedback: same-faith influx reinforces, different-faith shifts (bounded).
CO-BUILT BRAKES (all mandatory, §II.3-3): congestion pushback (hub pull DECAYS as it fills —
per-capita saturation + crowding deficit + size-scaled crime), scatter-floor (the 'concentrated'
distribution mode FORBIDDEN under spatial), transport lag (the arrival queue), reconcile the
abs*0.45 origin-loss proxy (it BECOMES the origin-mortality stage — never both), and THE
CONSERVATION-LEDGER SOAK: Σarrivals + Σmodeled-deaths == Σdepartures, exact, asserted. Soak: the
multi-year war+famine regional run — no chain-collapse (A→B→C), no megacity, the W0 population-
attractor retune validated here. Sensitive: the conservation assertion; the scatter floor constant;
cultureDistance is a LIVE read (never frozen).

### M5 — ARMY-TRANSIT + FIELD COMBAT (depends: M4; the war convergence)
Armies gain position-along-path ledgers (travel weeks via hopWeeks × army speed; readiness/terrain
modulate); CROSSING-PATH COLLISION → field battle: the §5 bounded resolver — win probability = a
sigmoid over effective strength (readiness × supplyQuality × size × funding × defender's-ground ×
travel-fatigue), CLAMPED so P(upset)→0 past threshold (no-hand-of-miracle; fork
`battle:${[a,b].sort().join(':')}:${tick}`); retreat = per-mover embattlement (§6). REINFORCEMENTS =
armies-in-transit on the same ledger; the COURIER UMBILICAL (round 12): an army's belief-staleness
grows when its route home is cut (reads the Wave-A belief machinery — an info-starved army
mis-assesses; blinding the enemy's couriers becomes a real tactic). SIEGE-AS-STARVATION completes:
the capacity-roll core is REPLACED by the supply mechanic (M2's interdiction term + time + relief),
keeping the feasibility gate + outcome bands. The army/frontline carrier lights in the rumor network.
BRAKES: the clamp + the exhaustion homeostasis (already built + soak-verified). Soak: the
war-distribution certification RE-RUN (frequencies/outcomes/exhaustion curves within envelopes) +
a 30y two-power border war that ENDS endogenously. Sensitive: the sigmoid constants; collision
detection is O(armies²) per tick — armies are few, assert a bound; the old capacity-roll path must
be cleanly gone (no dual siege math).

### M6 — COMMODITY FLOW + ENTREPÔTS (RESCOPED, owner round 22; depends: M2, M4; four fenced parts)
**M6a COMMODITY CONTINUITY (round 22.3):** goods gain origin→destination PHYSICAL truth. Finite
ORIGIN STOCKS (production rates derived from activeChains — producers stop being infinite
fountains); QUANTITY-denominated per-(settlement,good) stockpiles (upgrading M2's time-denominated
buffers — reconcile, never both); EN-ROUTE DEPLETION at consuming intermediaries (a caravan is
tapped along its route); the destination's stockpile drains until the next SOURCED caravan lands.
THE GOODS-CONSERVATION INVARIANT (the M4 pattern applied to goods): Σproduced == Σin-transit +
Σconsumed + Σstockpiled, EXACT, asserted. Guard-rails: AGGREGATE always (one caravan record per
link — the M2 cardinality law; stock = sparse scalar only where activeChains produce/consume); NO
NUMERIC PRICES (backlog-frozen) — stock levels surface as qualitative shortage/adequate/surplus
BANDS feeding the existing prosperity/impairment reads.
**M6b ENTREPÔTS/TOLLS (the original spec):** intermediary-frequency metric from gate-crossings of
ACTIVE shipments (earned centrality — now REAL, it reads M6a's tapped flow); toll/gate-tax
prosperity + transshipment institutions on the W-C3 founding lane (warehouse, customs house,
carriers' guild); the toll term joins the M1 re-score (greedy tolls divert — self-balancing).
CO-BUILT BRAKES (V.6+VI.1, all here): gate throughput ceiling, toll upkeep, wartime targeting (a
fat entrepôt feeds M5 threat), rent extraction bounded.
**M6c THE DISPATCH EV — GREED vs DANGER (round 22.4):** the caravan GO/NO-GO becomes an
expected-value decision under fog (origin-side; M1's re-score stays the route-side). DETERRENT =
the BELIEVED destination stressor (belief map, never truth — stale rumor turns a caravan from a
recovered town; an unheard outbreak lets one walk in), with PER-STRESSOR danger shapes: plague =
crew contraction + next-stop refusal (M11a); occupation = confiscation/extraction risk — an
EXTRACTIVE occupier DAMPENS, never severs (it wants the tax); siege ≈ absolute; embattlement =
already M1's. Caution = the ONE W0 risk-tolerance read (never a second alignment derivation).
ATTRACTION = NEED-PREMIUM (the destination's M6a shortage band on exactly the carried goods) ×
DYNAMIC APPETITE: a bounded per-settlement scalar that RISES on profitable risky deliveries
(receipted), FALLS on losses (banditry/contraction/confiscation), DECAYS toward a disposition
baseline from merchant-faction strength + alignment. Emergent: the most cut-off towns attract the
boldest merchants — quarantines CREATE their blockade-runners. EV overrides ride existing edges:
vassal tribute coercion (must-go), ally relief (trade-as-peace). Decision = threshold + dwell (the
M1 hysteresis discipline), seeded tie-break.
**M6d FLOW-DERIVED ECONOMICS (round 22.2):** GENERATION IS SACRED (ruling) — seeded exports/imports/
prosperity stay the byte-identical baseline; measured flow drives only the LIVE DRIFT, under the
marker. Grounded seam: supplyKernel currently DISCARDS arrivals (pulseKernel reads only .changed)
→ a sparse windowed arrivals-tally under spatialLedgers (zero eager) written at the supplyKernel
outcome loop + a marker-gated display selector (the settlementRumors dormancy shape: absent ⇒
[]/null ⇒ the tab renders today's generation-time reads byte-identically). Modality is a ROSTER
read (docks/airship-dock institutions; teleport = M9's slot). No movers ⇒ no live trade effects:
isolation = autarky; blockade/winter/quarantine become economically real with zero new mechanism.
Soak: the megacity loop (30y, Gini-style concentration bound) + the goods-conservation multi-year
run + an EV fixture (premium beats danger at the documented threshold; appetite rises/falls/decays).
Sensitive: the conservation assertion; no-prices (bands only); the ONE caution read; the appetite
bounds; generation-baseline byte-identity on the aspatial path.

### M7 — CONTRABAND / SMUGGLE (depends: M6 + M4's cultureDistance)
[Round 22.4 framing: smuggling is THE TAIL OF THE GREED CURVE — when M6c's dispatch EV goes
negative (danger too high for legal trade), the UNMET need-premium spills into the criminal
channel. One continuous economic logic: honest caravan → risk-taking merchant → smuggler.]
Gates gain POLICY: prohibit/confiscate goods categories violating law/culture/alignment (contraband
is RELATIONAL — cultureDistance + the governing archetype decide; slaves the flagship, data-driven
category table). The smuggle network: strength from criminal opportunity + thieves-guild (the
EXISTING saturation cap re-validated as the brake); smuggle attempts are RISK-TOLERANCE-gated
(alignment fidelity — bold/chaotic runs what cautious/lawful won't). THE PER-GATE PIPELINE ORDER IS
LAW (§II.3-4-e): smuggle roll → (if detected ∧ hostile) interception seizure → (elif contraband)
confiscation → else toll. Smuggle = ONE per-shipment roll vs the route's WORST gate (§II.3-4-f — the
besieged trickle survives); corruption is the hinge (a corrupt gate leaks); conscience gates every
seizure's take (W-C2). The criminal/underground rumor carrier lights. Soak: the siege-trickle
envelope (a besieged settlement with smugglers starves SLOWER, never not-at-all); guild strength
stays bounded. Sensitive: the pipeline order in code matches the law; the worst-gate rule.

### M8 — SEA LANES MATERIALIZED (depends: M5; §4j verbatim)
The seaLanes reserved slot lights: PORT ELIGIBILITY = geography ∧ institutions (coastal/river cell +
dock/harbor/shipwright from the catalog — derived at digest, RE-DERIVED on founding events via the
receipted re-canonize path); sea/river edge set connects eligible ports (cheap + high-capacity — the
historical order-of-magnitude, constants documented); the ISOLATION INVERSION lands (island + port =
hub); NAVAL BLOCKADE = holding the water gate (M5 siege interdiction needs land ∧ sea for ports);
PIRACY = the M1 danger term on lanes; STORM SEASON = M3's hooks; the SHIP-CREW carrier lights
(fast port-to-port rumors — ports become info brokers); refugee sea passage (funded sail, desperate
walk) joins M4's destination choice. NO fleet combat (sea-interdiction abstraction only). Soak:
island-hub economics; blockade-starvation parity with land sieges. Sensitive: port derivation purity;
the re-derive-on-founding receipt.

### M9 — WAVE B: THE POLITICAL DEPTH (depends: M5 + Wave A; the largest M-wave — consider splitting
### at dispatch into M9a scorer/factions + M9b intel/moral if the implementer reports scope strain)
(1) FACTION BELIEF MAPS: the belief ledger's factionId dimension activates — per-faction beliefs fed
by their round-9 carrier organs (merchants←trade, military←couriers/armies, clergy←faith when lit,
criminal←smuggle, public←ambient); the governing COALITION derives (seat + relationship-allied
factions — VI.4-1's deferred half); dissent = belief divergence as an internal stressor
(council_schism); faction LEAKAGE via the compromise system. (2) OBJECTIVE-PARAMETERIZED SCORING:
enumerateMoves' default descriptor (Wave A's down-payment) gains per-archetype objective sets +
the NEW non-war move levers (merchant: reroute/embargo/credit; church: missionize/legitimacy;
warlord: prestige/opportunity) — VI.1's two-step completes. (3) MORAL DRIFT: unjust instigation
(acting on false belief against a non-threat) drifts settlementAlignment — sharpest for lawful-good,
scaled by victim innocence + past relations; wired to W-C2 conscience + W-C5 (the unjust war is a
CAUSE with a reckoning arc). (4) ALLY-INTEL/BETRAYAL: the deliberate high-confidence sharing channel
(couriers/circles, preserved fidelity, confidence-gated); alignment styles the handling (round 15A —
lawful faithful-but-brittle, evil accurate-inward/deceptive-outward); the COMPROMISED-ALLY LEAK
(shares route to the real enemy — belief-map alliance accuracy becomes load-bearing). (5) TELEPORT
BLOCS: the teleportEdges slot lights (authored premium edges, magic-gated); zero-hop hi-fi intel +
bounded trade; the bloc = clique-of-the-willing; node-starvation economics (round 11). (6) THE WAR
INITIATE/RESOLVE SPLIT: evaluateWarLayer's initiation routes through the candidate/proposal
machinery → war's DM-Driven tri-state unlocks (the CL-0 deferral closes). Soak: full-info 30y; an
evil-manipulation arc OCCURS and stays bounded; coalition dissent → coup pathway exercised.
Sensitive: the initiate/resolve split preserves the war-behavior pins under legacy flags; faction
belief cardinality (observer×faction×subject — the sparse-arrival law extends per-faction).

### M10 — CL-3: FULL AUTONOMY CONTROLS (depends: M9)
The approval queue EXTENDS to actor-initiated majors (M9's autonomous declarations/coups route
through it under 'routine'): pending-actions ledger + realm UI; HOLD-THEN-EXPIRE semantics — the
proposing actor holds a defensive posture N weeks then the proposal EXPIRES TO DECLINE (⚠️ OWNER
may override the expiry policy; never block the advance). Recommendations mode gains the rationale
surface (candidates' reasons[] rendered). LIVING/AUTONOMOUS progression ships: capped deterministic
advance-on-open catch-up (calendar-delta → N ticks, receipted; ⚠️ OWNER: confirm wanted + the cap).
infoMode completes: 'full' (factional beliefs + reconciliation) joins the ladder; presets re-audited
(Full Simulation = everything, honestly). Soak: a catch-up of 26 weeks == 26 manual ticks,
byte-identical. Sensitive: catch-up determinism (the pin-now discipline); expiry never deadlocks.

### M11 — WORLD-AS-ACTOR SHOCKS (owner round 21, 2026-07-12; depends: M4; army coupling: M5)
Two fenced sub-waves. The world's non-political forces finally ACT: pestilence that travels, calamity
that strikes. Both: AGGREGATE-population only (product boundary — the sim NEVER kills a named NPC;
at-risk/displaced flags are DM hooks); receipts mandatory; every rate a frozen, documented, owner-
retunable constant; PRNG = seeded forks from stable composite keys, codepoint-sorted mutation.

**M11a — PESTILENCE (the traveling plague).** ONE PLAGUE TRUTH: no second plague system — the
epidemic ledger (nested under spatialLedgers, marker-gated, ZERO eager bytes post-FP-R) MATERIALIZES
the EXISTING plague stressor at each settlement it reaches (reconcile like M4's origin-loss rule);
aspatial worlds keep today's plague byte-identically — the marker gates only the TRAVEL. Propagation:
plague travels AS INFORMATION TRAVELS — hop-by-hop along ACTIVE trade channels + M2 shipment arrivals
(+ M5 army movements once they exist) at hopWeeks latency, seeded per-edge forks
(`plague:spread:${edgeId}:${tick}`); import pressure scales with inbound volume (ports run hotter).
Onset: seeded draw scaled by density/tier + trade volume MINUS the care counterforce. THE CARE
COUNTERFORCE reads the INSTITUTION ROSTER, never the magic toggle (a no-magic world simply lacks
druids/alchemists): churches + church-derivatives, hospitals/healing houses, druidic institutions,
alchemists each add care capacity with DIMINISHING stacking returns, CAPPED (the SECURITY_MAX_RELIEF
pattern — a temple city resists, is never immune); care suppresses EMERGENCE and raises RECOVERY
(shortens survival). Density-vs-care tension is the texture: cities burn hot-and-short, care-poor
villages smolder. ARMIES: plague level joins the mover hazard read as a GRADED SCALAR in route +
engagement scoring (M1 discipline, never a boolean) weighted by W0 risk tolerance — a lawful
commander waits out the pestilence; an army interacting with a plagued settlement rolls seeded
contraction (`plague:army:${armyId}:${settlementId}:${tick}`), a contracted army takes an
effective-strength impairment AND becomes a VECTOR to its next stop. RELIGIOUS INFLUENCE (both
directions): while active, religious authorities gain a TEMPORARY standing/influence modifier +
piety pulse (formalizing the existing plague→temple-relief seam), REVERTING on clearance; clears-
fast-under-care = the temple's triumph, rages-unchecked feeds the existing piety-crisis/abandonment
seam. The QUARANTINE DILEMMA emerges free: movers re-route around plagued hubs (the hazard term) →
isolation → M2 supply risk. TRADE REFUSAL (round 22.1): a settlement may TURN AWAY caravans from a
source it BELIEVES plagued (the belief map, never truth — stale rumor refuses a recovered town; an
unheard outbreak slips through; texture varies by infoMode) via the M2 severance-predicate seam,
decided with the M1 hysteresis pattern (enter/exit + dwell — no gate-flicker), caution from the ONE
W0 risk-tolerance read. The cost is free on both sides: the refuser's failover walks costlier or
drains toward supply_starved; the refused exporter's outbound flow (and M6d dependency effects)
drop. The refused-glut ↔ refuser-shortage pair prices BOTH sides (owner: "at cost of course"). CO-BUILT BRAKES: recovery floor (NO perma-plague — every record clears),
the counterforce cap, per-tick spread bounded (cascade-depth cap). Soak: 20y port-seeded two-region
run — the front walks the network at hopWeeks-consistent arrival ticks; care-rich clears faster than
care-poor; armies avoid + contract + carry; influence pulses and reverts; every record eventually
clears; dormant byte-identity. Sensitive: ONE plague truth (grep: no parallel system); the cap; the
army term is a scalar; the roster-read (no toggle read).

**M11b — CALAMITY (natural disaster).** A VERY RARE instantaneous shock with a LONG, fully EMERGENT
economic tail. Frequency: realm-expected once per 10-20 years → per-settlement-year hazard
`1/(HAZARD_YEARS × N)`, ONE seeded annual draw (`disaster:${settlementId}:${year}`); cooldown WITHOUT
new state — the minted permanent history stamp IS the cooldown record (no re-strike within
COOLDOWN_YEARS of a prior stamp). Terrain-keyed type table (flood/riverside, fire/dense-timber,
quake/mountain, storm/coastal — the riverside town's flood-year is legible destiny). THE STRIKE
(bounded): seeded selection of K non-required institutions (K tier-capped 1..4, candidates codepoint-
sorted); SUBSUMPTION FIRST — an UPGRADE_CHAINS member DEMOTES down its chain, a multi-instance
category COLLAPSES to one survivor ("the lodging district is one lodge now"), singletons are
DESTROYED (hand-of-god); `required` institutions NEVER selected (the hard bound). Aggregate
population death: a seeded, BOUNDED, tier-scaled fraction (significant but survivable — the exodus
is the real depopulator, and it is recoverable drama). THE TAIL IS EMERGENT, ZERO NEW MECHANISM:
destroyed producers sever M2 supply links (downstream starvation risk); broken activeChains
re-reconcile the economy; lost livelihoods enter M4 AS DEPARTURES with the disaster receipt (the
mass exodus — and M4's conservation ledger MUST still balance through it, asserted); population loss
demotes the tier EMERGENTLY via popToTier (never forced); the legitimacy hit + a W-C5 'disaster
response' cause puts the ruler under coup-readable pressure. Mint the NAMED permanent stamp ("The
Great Fire of Thornwood, year 12"). GATE: a CL rules flag, preset-gated (ON in dramatic/full-sim
presets, default OFF → byte-identical); the spatial tails ride the marker; aspatial fallback = the
existing population-flight term. Soak: 50y realm run — frequency lands in the 10-20y band; NO
annihilation (bounds + the M4/M2 brakes hold — no chain-collapse); the tail composes end-to-end
(strike → starvation-risk → exodus → legitimacy → pressure) with every step receipted; cooldown-via-
stamp works; byte-identical with the flag off. Sensitive: required-never-selected; the death-fraction
bound; M4 conservation through the exodus; the frequency + cooldown constants.

## 7.2 The round-21+ backlog (frozen out of v1; triage at Phase 6 ⚠️ OWNER)
W2-style voice sidecars for war/faith/trade news (the pillar-inventory prescription — cheap, high
value, candidates for EARLY post-launch or even Phase-6 punch-list graduation); numeric prices;
miracles/divine-agency + lived-practice faith content (rituals, holy days, named clergy); peace
treaties/negotiated terms; ruins-as-artifacts (destroyed settlements become preserved dossiers +
adventure sites); map-as-legibility-surface (fronts/embattlement/trade-flow rendered on the realm
map); warding-vs-scrying info-defense; feed retention (non-recency major-arc pinning, the 240-cap
scale fix); the two temporal structural notes (mergeStressorUpsert bornTick; dead wallClockNow
pre-stamps); dramatic_campaign preset depth review; population-attractor retune (from the W0 soak).

# PART 5 — THE LIVING REALM CHECKPOINT (definition of done — runs AFTER the PART-7 mover ladder)
# (owner order 2026-07-12: the checkpoint is the FINAL validation of the COMPLETE, mover-finished
# engine, immediately before Phase 6 launch-readiness. Execution/reading flow: Wave A → merges
# (PART 6) → M1-M10 movers (PART 7) → THIS checkpoint (PART 5) → Phase 6 (PART 8) → launch. Numbers
# read 6,7,5,8,9 by owner directive; the SEQUENCE is what governs, per §0.4.)

The shippable milestone. It is REACHED when all of the following are committed and green:
1. The FULL ladder committed + green: Wave A, ALL merges (§6.1 — W5/Session-Foundry), and the ENTIRE
   mover ladder M1-M11 (PART 7, each with its own soak; M11 added by owner round 21, 2026-07-12 —
   the checkpoint validates THROUGH M11).
2. The LIVING REALM PRESET delivers, on a premium canonized realm: mapped geography (digest),
   seasons (food year), distance-weighted trade/faith, perfect-but-delayed news (or unreliable if
   the DM dials it), routine autonomy with major-approval, belief-sourced war posture with legible
   misjudgments, ruleset receipts, + the mover layers (embattlement, caravans, migration, field
   combat, entrepôts, smuggle, sea lanes, the political depth). Free/anon/legacy: byte-identical.
3. THE CHECKPOINT SOAK: whole-world-soak on the living_realm preset + a canonized spatial fixture —
   30 years, byte-identical re-run, bounded populations (⚠️ OWNER: the population-attractor tuning
   finding gates M4 long before this), stressors non-frozen (the stasis fix evidenced), all ledgers
   (rumor/belief/shipment/arrival/embattlement) bounded. This is the everything-on validation.
4. A FULL manager validation pass (the §0.3 checklist over the combined tree + an adversarial
   premium/faith-seam sweep — the wf_59bcd3b3 pattern).
5. 🔱 FABLE-ON-RETURN: the checkpoint grade-check (mini re-review of affected dimensions) — if
   Fable is unavailable, Phase 6 may START but not SHIP without it.

# PART 8 — PHASE 6: LAUNCH READINESS (runs AFTER the PART-5 checkpoint)

Sequenced program (each its own fenced wave, same protocol):
1. DATA LIFECYCLE — pre-launch: schema/migration audit (the head/net-current ledger, fusion specs
   per memory/wave0-migration-audit.md), storage quotas, export/delete completeness (GDPR-shaped),
   anon→free→premium upgrade paths carry all state. At-launch: seeding, onboarding fixtures,
   the landing fixture regen (memory: phase5-engine-companion-complete NEXT item). Post-launch:
   backup/restore discipline, migration-forward policy (the CL-0 ruleset + cost-law receipts are
   the versioning pattern), telemetry review (EVENTS.* audit — no PII, no deity leaks).
2. THE PUNCH LIST — sweep the parking lot (§0.6), the round-21+ backlog triage (§7.2 — what
   graduates into launch, owner call ⚠️), the deferred small items (aiPricing slice, EventComposer
   leftovers if W5 didn't land them, the dead-simulation-case cleanup).
3. THE EVERYTHING-ON SOAK — ONE soak, the full_simulation preset on a spatial fixture (covers
   spatial once, not twice): 30y determinism + the war-distribution certification (the W-C1..C5
   distributions against their design envelopes — war frequency, siege outcomes, exhaustion
   curves, occupation ladders; the soak asserts ENVELOPES, documents drift).
4. SECURITY/ABUSE PASS — the admin edge actions audit (rate limits, authz on every admin-actions
   verb), share/gallery scrub adversarial sweep, RLS review on new tables/keys.
5. LAUNCH GATE — all ratchets green at their POST-FP-1 values; the golden corpus regenerated ONCE
   with a reviewed UPDATE_GOLDEN protocol IF (and only if) any approved behavior change requires
   it (owner sign-off ⚠️); CI green end-to-end.

# PART 9 — STANDING ITEMS + THE FINAL GRADE-CHECK

- FP-1 (in flight): on landing, note the new budget in §0.2-5 and PROPAGATE it mentally to every
  queued wave's gate expectations. If FP-1 under-delivers (<10KB), SEASONS-A still fits (its cost
  ≈ tens of bytes of preset keys) but the Session/Foundry + W5 merges may not — in that case park
  the merges behind a second FP pass (write FP-2 from FP-1's ledger leftovers).
- THE ONE COMPREHENSIVE FABLE GRADE-CHECK 🔱 (the standing mandate, after ALL phases end): a full
  wf_65950203-pattern survey — every dimension re-graded against the A+ standard, the spatial
  engine's soak evidence reviewed, the constitutional seams adversarially re-swept, the launch
  gate co-signed. Until it runs, the A+ MAINTENANCE INVARIANT (memory/owner-fix-philosophy.md)
  governs every wave: born at A+, gate-green, own enforcement pins, no ratchet regressions.

— END. The next action, always: §0.4.
