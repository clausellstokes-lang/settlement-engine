# DEAD-SET — TUNEREG Car 5 (THE CULL) — one row per EXPORT

Measured at dock HEAD `1223489c9` by re-running the estate’s own `measureTree()`.
**Denominator: 225 EXPORTS** (not files). Rows below are the **140** exports the estate
measures at `namedDependents.length === 0` over `src/` — the J-6 per-export column.

`internal` = comment-stripped uses of the symbol inside its OWN module, excluding the
declaration. `foreign` = files elsewhere in the repo naming the symbol (identifier index
over 5,854 files, which also catches quoted spellings). REGISTER/INVENTORY bookkeeping
rows are excluded from `foreign` — they are the register’s own ledger, not consumers.

| # | Symbol | File | Line | src namedDeps | internal uses | foreign consumer files | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | `WAR_CONVERGENCE_TUNING` | `src/domain/certification/warConvergenceContract.js` | 169 | 0 | 20 | docs:1 src:2 tests:1 | LIVE (module-internal) |
| 2 | `WAR_CONVERGENCE_FORCE_TUNING` | `src/domain/certification/warConvergenceForces.js` | 179 | 0 | 5 | docs:1 tests:1 | LIVE (module-internal) |
| 3 | `CAPTURE_TUNING` | `src/domain/corruption.js` | 485 | 0 | 2 | docs:2 other:3 | LIVE (module-internal) |
| 4 | `DENSITY_BANDS` | `src/domain/density/densityBands.js` | 110 | 0 | 1 | scripts:1 other:1 tests:1 | LIVE (module-internal) |
| 5 | `RANK_CEILING_BY_TIER` | `src/domain/density/densityBands.js` | 135 | 0 | 1 | scripts:1 other:1 tests:1 | LIVE (module-internal) |
| 6 | `TIER_ORDER` | `src/domain/density/densityBands.js` | 66 | 0 | 1 | other:3 docs:17 scripts:7 src:66 tests:20 | LIVE (module-internal) |
| 7 | `DEFAULT_RETENTION_TUNING` | `src/domain/dossier/hookRetention.js` | 87 | 0 | 3 | other:1 tests:1 | LIVE (module-internal) |
| 8 | `FUNNEL_TUNING` | `src/domain/npc/livedExperienceFunnel.js` | 222 | 0 | 5 | src:1 tests:3 | LIVE (module-internal) |
| 9 | `AUTOPLACEMENT_TUNING` | `src/domain/realm/autoplacement.js` | 83 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 10 | `SEA_ROADS_TUNING` | `src/domain/roads/seaRoads.js` | 49 | 0 | 1 | tests:2 | LIVE (module-internal) |
| 11 | `SEAT_TUNING` | `src/domain/rulingPowerSeat.js` | 89 | 0 | 10 | src:1 tests:2 | LIVE (module-internal) |
| 12 | `EXPOSURE_TUNING` | `src/domain/spatial/calamity.js` | 159 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 13 | `QUADRANT_TUNING` | `src/domain/spatial/cohesionWeave.js` | 41 | 0 | 5 | other:3 tests:1 | LIVE (module-internal) |
| 14 | `CULTURE_TUNING` | `src/domain/spatial/cultureDistance.js` | 41 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 15 | `EMBATTLEMENT_TUNING` | `src/domain/spatial/embattlement.js` | 69 | 0 | 5 | src:1 tests:2 | LIVE (module-internal) |
| 16 | `GENEROSITY_TUNING` | `src/domain/spatial/generosityEV.js` | 47 | 0 | 3 | tests:1 | LIVE (module-internal) |
| 17 | `INTEL_SALE_TUNING` | `src/domain/spatial/generosityEV.js` | 898 | 0 | 1 | — | LIVE (module-internal) |
| 18 | `MIGRATION_RUMOR_TUNING` | `src/domain/spatial/migrationRumors.js` | 46 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 19 | `SMUGGLE_TUNING` | `src/domain/spatial/smuggle.js` | 52 | 0 | 4 | tests:1 | LIVE (module-internal) |
| 20 | `UNDERCITY_TUNING` | `src/domain/undercity/colonization.js` | 169 | 0 | 4 | docs:1 tests:1 | LIVE (module-internal) |
| 21 | `MONOTONE_EXTENT_TUNING` | `src/domain/undercity/monotoneComponents.js` | 283 | 0 | 6 | docs:2 tests:1 | LIVE (module-internal) |
| 22 | `SEWER_DERIVATION_TUNING` | `src/domain/undercity/sewerDerivation.js` | 227 | 0 | 2 | docs:2 src:2 tests:1 | LIVE (module-internal) |
| 23 | `REACTION_TUNING` | `src/domain/worldPulse/anticipatedReactions.js` | 59 | 0 | 4 | docs:2 scripts:1 src:5 tests:4 | LIVE (module-internal) |
| 24 | `ARMY_ENVOY_INTENT_TUNING` | `src/domain/worldPulse/armyTransitKernel.js` | 76 | 0 | 5 | tests:1 | LIVE (module-internal) |
| 25 | `ATTRITION_TUNING` | `src/domain/worldPulse/attrition.js` | 318 | 0 | 0 | scripts:1 tests:1 | LIVE (foreign consumer) |
| 26 | `HALF_LIFE_WEEKS` | `src/domain/worldPulse/bandedStock.js` | 71 | 0 | 2 | docs:4 scripts:2 src:1 other:3 tests:4 | LIVE (module-internal) |
| 27 | `SUBJECT_AXIS_TUNING` | `src/domain/worldPulse/beliefAxisSubjects.js` | 141 | 0 | 3 | docs:1 tests:2 | LIVE (module-internal) |
| 28 | `BROKERAGE_FIDELITY_TUNING` | `src/domain/worldPulse/brokerageFidelity.js` | 67 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 29 | `INTERCEPT_FOG_TUNING` | `src/domain/worldPulse/brokerageServices.js` | 537 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 30 | `QUERY_PRICE_TUNING` | `src/domain/worldPulse/brokerageServices.js` | 167 | 0 | 2 | docs:1 tests:1 | LIVE (module-internal) |
| 31 | `PATRON_FEED_TUNING` | `src/domain/worldPulse/brokerageServicesFeed.js` | 93 | 0 | 3 | — | LIVE (module-internal) |
| 32 | `PLANT_PRICE_TUNING` | `src/domain/worldPulse/brokerageServicesPlant.js` | 114 | 0 | 2 | — | LIVE (module-internal) |
| 33 | `LIFECYCLE_TUNING` | `src/domain/worldPulse/causeLifecycle.js` | 100 | 0 | 2 | scripts:1 tests:1 | LIVE (module-internal) |
| 34 | `CAUSE_TUNING` | `src/domain/worldPulse/causeVocabulary.js` | 77 | 0 | 3 | — | LIVE (module-internal) |
| 35 | `FOOTHOLD_TUNING` | `src/domain/worldPulse/clergyTraitPlane.js` | 232 | 0 | 1 | — | LIVE (module-internal) |
| 36 | `COMMERCIAL_REASON_TUNING` | `src/domain/worldPulse/commercialReasons.js` | 104 | 0 | 5 | tests:1 | LIVE (module-internal) |
| 37 | `COMPROMISE_ROUND_TUNING` | `src/domain/worldPulse/compromiseRound.js` | 51 | 0 | 6 | docs:3 src:1 tests:2 | LIVE (module-internal) |
| 38 | `CONQUEST_STAGE_TUNING` | `src/domain/worldPulse/conquestDoctrineStage.js` | 640 | 0 | 1 | docs:1 tests:1 | LIVE (module-internal) |
| 39 | `CONQUEST_EXECUTION_TUNING` | `src/domain/worldPulse/conquestExecution.js` | 92 | 0 | 4 | tests:1 | LIVE (module-internal) |
| 40 | `CONQUEST_FEASIBILITY_TUNING` | `src/domain/worldPulse/conquestFeasibility.js` | 119 | 0 | 4 | tests:1 | LIVE (module-internal) |
| 41 | `CONQUEST_FEED_TUNING` | `src/domain/worldPulse/conquestFeeds.js` | 43 | 0 | 7 | scripts:1 tests:1 | LIVE (module-internal) |
| 42 | `CONQUEST_INTENT_TUNING` | `src/domain/worldPulse/conquestIntent.js` | 86 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 43 | `CONVERGENCE_TUNING` | `src/domain/worldPulse/convergence.js` | 114 | 0 | 13 | src:1 tests:3 | LIVE (module-internal) |
| 44 | `REFORM_TUNING` | `src/domain/worldPulse/corruptionImpair.js` | 131 | 0 | 5 | — | LIVE (module-internal) |
| 45 | `CORRUPTION_WEB_TUNING` | `src/domain/worldPulse/corruptionWeb.js` | 118 | 0 | 19 | src:2 tests:5 | LIVE (module-internal) |
| 46 | `STANCE_LANE_TUNING` | `src/domain/worldPulse/deityStanceLane.js` | 51 | 0 | 5 | docs:2 tests:2 | LIVE (module-internal) |
| 47 | `HERALD_TUNING` | `src/domain/worldPulse/demographicsHerald.js` | 83 | 0 | 13 | docs:1 src:1 other:2 tests:1 | LIVE (module-internal) |
| 48 | `LADDER_TUNING` | `src/domain/worldPulse/demographicsLadder.js` | 104 | 0 | 1 | docs:2 scripts:1 src:7 other:2 tests:12 | LIVE (module-internal) |
| 49 | `SPATIAL_LAW_TUNING` | `src/domain/worldPulse/demographicsLand.js` | 164 | 0 | 1 | src:1 other:2 tests:1 | LIVE (module-internal) |
| 50 | `PLAN_TUNING` | `src/domain/worldPulse/demographicsPlans.js` | 139 | 0 | 1 | docs:1 src:1 other:2 tests:1 | LIVE (module-internal) |
| 51 | `RESPONSE_TUNING` | `src/domain/worldPulse/demographicsResponses.js` | 158 | 0 | 1 | src:1 other:2 | LIVE (module-internal) |
| 52 | `RISK_TUNING` | `src/domain/worldPulse/demographicsRisk.js` | 78 | 0 | 1 | src:1 other:2 | LIVE (module-internal) |
| 53 | `WAR_DEMOGRAPHIC_TUNING` | `src/domain/worldPulse/demographicsWar.js` | 68 | 0 | 1 | docs:1 src:2 other:2 tests:2 | LIVE (module-internal) |
| 54 | `ALIGNMENT_TUNING` | `src/domain/worldPulse/disposition.js` | 595 | 0 | 0 | tests:1 | LIVE (foreign consumer) |
| 55 | `APPETITE_TUNING` | `src/domain/worldPulse/dispositionLedger.js` | 787 | 0 | 0 | other:2 tests:3 | LIVE (foreign consumer) |
| 56 | `ELITE_BLEED_TUNING` | `src/domain/worldPulse/eliteBleed.js` | 36 | 0 | 6 | tests:1 | LIVE (module-internal) |
| 57 | `CHANCE_MEETING_TUNING` | `src/domain/worldPulse/envoyChanceMeeting.js` | 201 | 0 | 24 | tests:2 | LIVE (module-internal) |
| 58 | `CAREER_CREDIT_TUNING` | `src/domain/worldPulse/espionage/espionageCareerCredit.js` | 121 | 0 | 2 | docs:1 tests:2 | LIVE (module-internal) |
| 59 | `DISPATCH_TUNING` | `src/domain/worldPulse/espionage/espionageDoctrineStage.js` | 99 | 0 | 2 | docs:1 scripts:1 src:2 tests:4 | LIVE (module-internal) |
| 60 | `LEAK_TUNING` | `src/domain/worldPulse/espionage/espionageLeak.js` | 123 | 0 | 1 | docs:2 tests:1 | LIVE (module-internal) |
| 61 | `PRODUCT_TUNING` | `src/domain/worldPulse/espionage/espionageProducts.js` | 85 | 0 | 2 | docs:1 tests:1 | LIVE (module-internal) |
| 62 | `TAP_TUNING` | `src/domain/worldPulse/espionage/espionageTap.js` | 83 | 0 | 2 | docs:1 src:2 tests:1 | LIVE (module-internal) |
| 63 | `TELL_TUNING` | `src/domain/worldPulse/espionage/espionageWariness.js` | 92 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 64 | `INFILTRATION_DEPTH_TUNING` | `src/domain/worldPulse/espionage/infiltrationDepth.js` | 151 | 0 | 2 | tests:2 | LIVE (module-internal) |
| 65 | `FACTION_PAIR_TUNING` | `src/domain/worldPulse/factionPairLedger.js` | 43 | 0 | 3 | tests:1 | LIVE (module-internal) |
| 66 | `FAITH_NEWS_TUNING` | `src/domain/worldPulse/faithNews.js` | 140 | 0 | 1 | docs:2 tests:1 | LIVE (module-internal) |
| 67 | `FAITH_TUNING_COVERAGE` | `src/domain/worldPulse/faithTuningSurface.js` | 307 | 0 | 1 | scripts:2 tests:1 | LIVE (module-internal) |
| 68 | `FEASIBILITY_TUNING` | `src/domain/worldPulse/feasibilityGate.js` | 338 | 0 | 0 | tests:1 | LIVE (foreign consumer) |
| 69 | `GENEROSITY_MOVER_TUNING` | `src/domain/worldPulse/generosityKernel.js` | 195 | 0 | 2 | src:1 tests:1 | LIVE (module-internal) |
| 70 | `GRIEVANCE_READ_TUNING` | `src/domain/worldPulse/grievanceRead.js` | 27 | 0 | 6 | tests:1 | LIVE (module-internal) |
| 71 | `HEGEMONY_FEAR_TUNING` | `src/domain/worldPulse/hegemonyFear.js` | 35 | 0 | 1 | — | LIVE (module-internal) |
| 72 | `SIGHT_TUNING` | `src/domain/worldPulse/informationStatecraft.js` | 744 | 0 | 5 | docs:1 src:2 tests:3 | LIVE (module-internal) |
| 73 | `INSTITUTION_LIFECYCLE_TUNING` | `src/domain/worldPulse/institutionLifecycle.js` | 82 | 0 | 9 | src:1 tests:3 | LIVE (module-internal) |
| 74 | `TOLERANCE_TUNING` | `src/domain/worldPulse/institutionTolerance.js` | 30 | 0 | 2 | scripts:1 tests:1 | LIVE (module-internal) |
| 75 | `LINEAGE_CLAIM_TUNING` | `src/domain/worldPulse/lineageClaim.js` | 27 | 0 | 6 | tests:1 | LIVE (module-internal) |
| 76 | `MAGIC_FORMS_TUNING` | `src/domain/worldPulse/magicForms.js` | 226 | 0 | 6 | tests:1 | LIVE (module-internal) |
| 77 | `MAGIC_REGIME_TUNING` | `src/domain/worldPulse/magicRegimeModel.js` | 148 | 0 | 5 | tests:3 | LIVE (module-internal) |
| 78 | `MAGIC_SUBSTITUTION_TUNING` | `src/domain/worldPulse/magicSubstitution.js` | 146 | 0 | 4 | src:2 tests:1 | LIVE (module-internal) |
| 79 | `REAGENT_TUNING` | `src/domain/worldPulse/magicSubstitutionReagents.js` | 113 | 0 | 4 | tests:1 | LIVE (module-internal) |
| 80 | `MARTIAL_READINESS_TUNING` | `src/domain/worldPulse/martialReadiness.js` | 54 | 0 | 13 | scripts:1 tests:2 | LIVE (module-internal) |
| 81 | `MERCENARY_MARKET_TUNING` | `src/domain/worldPulse/mercenaryMarket.js` | 41 | 0 | 4 | docs:1 scripts:1 tests:1 | LIVE (module-internal) |
| 82 | `MIGRATION_KERNEL_TUNING` | `src/domain/worldPulse/migrationKernel.js` | 67 | 0 | 5 | src:1 other:2 tests:1 | LIVE (module-internal) |
| 83 | `MOBILIZATION_TUNING` | `src/domain/worldPulse/mobilization.js` | 511 | 0 | 0 | src:1 tests:1 | LIVE (foreign consumer) |
| 84 | `REACTION_TUNING` | `src/domain/worldPulse/mobilizationReactions.js` | 349 | 0 | 0 | docs:2 scripts:1 src:5 tests:4 | **DEAD (binding) — HOLD** |
| 85 | `CONSUMPTION_TUNING` | `src/domain/worldPulse/momentum.js` | 857 | 0 | 3 | tests:1 | LIVE (module-internal) |
| 86 | `CRACK_TUNING` | `src/domain/worldPulse/momentum.js` | 1020 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 87 | `THRESHOLD_TUNING` | `src/domain/worldPulse/momentum.js` | 566 | 0 | 5 | tests:1 | LIVE (module-internal) |
| 88 | `NPC_CREDIBILITY_TUNING` | `src/domain/worldPulse/npcCredibility.js` | 80 | 0 | 4 | tests:2 | LIVE (module-internal) |
| 89 | `CONTEST_TUNING` | `src/domain/worldPulse/npcLadderContest.js` | 46 | 0 | 12 | tests:1 | LIVE (module-internal) |
| 90 | `OPPORTUNISM_TUNING` | `src/domain/worldPulse/opportunism.js` | 80 | 0 | 1 | — | LIVE (module-internal) |
| 91 | `PACT_FORMATION_TUNING` | `src/domain/worldPulse/pactFormation.js` | 117 | 0 | 1 | docs:1 tests:2 | LIVE (module-internal) |
| 92 | `PACT_PROPOSAL_TUNING` | `src/domain/worldPulse/pactProposals.js` | 98 | 0 | 1 | docs:1 tests:1 | LIVE (module-internal) |
| 93 | `PACT_TRIGGER_TUNING` | `src/domain/worldPulse/pactTriggers.js` | 73 | 0 | 1 | tests:2 | LIVE (module-internal) |
| 94 | `PEACE_REASON_TUNING` | `src/domain/worldPulse/peaceReasons.js` | 72 | 0 | 7 | tests:1 | LIVE (module-internal) |
| 95 | `PESTILENCE_KERNEL_TUNING` | `src/domain/worldPulse/pestilenceKernel.js` | 71 | 0 | 1 | — | LIVE (module-internal) |
| 96 | `RANSOM_TUNING` | `src/domain/worldPulse/ransomClaim.js` | 71 | 0 | 7 | tests:3 | LIVE (module-internal) |
| 97 | `RAZING_EXECUTION_TUNING` | `src/domain/worldPulse/razingExecution.js` | 196 | 0 | 2 | tests:2 | LIVE (module-internal) |
| 98 | `RAZING_WITNESS_TUNING` | `src/domain/worldPulse/razingWitness.js` | 87 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 99 | `REFRAME_TUNING` | `src/domain/worldPulse/reframeKernel.js` | 133 | 0 | 5 | src:1 tests:1 | LIVE (module-internal) |
| 100 | `REINFORCEMENT_TUNING` | `src/domain/worldPulse/reinforcement.js` | 217 | 0 | 0 | — | **DEAD (binding) — HOLD** |
| 101 | `CRISIS_CONVERSION_TUNING` | `src/domain/worldPulse/religiousContest.js` | 149 | 0 | 2 | docs:2 | LIVE (module-internal) |
| 102 | `RESOURCE_DYNAMICS_TUNING` | `src/domain/worldPulse/resourceDynamicsKernel.js` | 131 | 0 | 2 | tests:2 | LIVE (module-internal) |
| 103 | `ROUTE_BYPASS_TUNING` | `src/domain/worldPulse/routeNetworkCharterBypass.js` | 72 | 0 | 5 | tests:1 | LIVE (module-internal) |
| 104 | `ROUTE_DANGER_TUNING` | `src/domain/worldPulse/routeNetworkCharterDanger.js` | 91 | 0 | 9 | tests:1 | LIVE (module-internal) |
| 105 | `ROUTE_RACE_TUNING` | `src/domain/worldPulse/routeNetworkConsumersRace.js` | 85 | 0 | 3 | tests:1 | LIVE (module-internal) |
| 106 | `ROUTE_STRATEGIC_TUNING` | `src/domain/worldPulse/routeNetworkConsumersStrategic.js` | 80 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 107 | `ROUTE_TRANSIT_TUNING` | `src/domain/worldPulse/routeNetworkConsumersTransit.js` | 82 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 108 | `ROUTE_FLOW_TUNING` | `src/domain/worldPulse/routeNetworkFlows.js` | 118 | 0 | 8 | tests:1 | LIVE (module-internal) |
| 109 | `SACRED_CLAIM_TUNING` | `src/domain/worldPulse/sacredClaim.js` | 67 | 0 | 1 | docs:2 | LIVE (module-internal) |
| 110 | `SEAT_INTERVENTION_TUNING` | `src/domain/worldPulse/seatIntervention.js` | 52 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 111 | `SECRECY_TRADE_TUNING` | `src/domain/worldPulse/secrecyTradeFactor.js` | 119 | 0 | 4 | docs:1 tests:1 | LIVE (module-internal) |
| 112 | `SETTLEMENT_POLITICS_TUNING` | `src/domain/worldPulse/settlementPolitics.js` | 83 | 0 | 5 | docs:1 tests:3 | LIVE (module-internal) |
| 113 | `STRATEGY_TUNING` | `src/domain/worldPulse/settlementStrategy.js` | 1287 | 0 | 0 | — | **DEAD (binding) — HOLD** |
| 114 | `SOVEREIGNTY_APPRAISAL_TUNING` | `src/domain/worldPulse/sovereigntyAppraisal.js` | 126 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 115 | `SOVEREIGNTY_BUNDLE_TUNING` | `src/domain/worldPulse/sovereigntyBundle.js` | 126 | 0 | 1 | — | LIVE (module-internal) |
| 116 | `SOVEREIGNTY_INTENT_TUNING` | `src/domain/worldPulse/sovereigntyIntent.js` | 102 | 0 | 6 | tests:1 | LIVE (module-internal) |
| 117 | `SOVEREIGNTY_MARKET_TUNING` | `src/domain/worldPulse/sovereigntyMarketStage.js` | 120 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 118 | `SOVEREIGNTY_REACH_TUNING` | `src/domain/worldPulse/sovereigntyReach.js` | 55 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 119 | `SOVEREIGNTY_TRANSFER_TUNING` | `src/domain/worldPulse/sovereigntyTransfer.js` | 89 | 0 | 1 | tests:2 | LIVE (module-internal) |
| 120 | `STEADING_TOPOGRAPHY_TUNING` | `src/domain/worldPulse/steadingTopography.js` | 185 | 0 | 1 | tests:1 | LIVE (module-internal) |
| 121 | `POSTURE_TUNING` | `src/domain/worldPulse/strategicPosture.js` | 320 | 0 | 0 | docs:1 tests:1 | LIVE (foreign consumer) |
| 122 | `UPHEAVAL_TUNING` | `src/domain/worldPulse/stressorGates.js` | 77 | 0 | 2 | scripts:1 tests:1 | LIVE (module-internal) |
| 123 | `WEBWAR_TUNING` | `src/domain/worldPulse/supplyWebWarfare.js` | 125 | 0 | 13 | tests:1 | LIVE (module-internal) |
| 124 | `TRAD_TUNING` | `src/domain/worldPulse/traditionsKernel.js` | 130 | 0 | 9 | tests:1 | LIVE (module-internal) |
| 125 | `TREASURY_TUNING` | `src/domain/worldPulse/treasury.js` | 98 | 0 | 17 | tests:2 | LIVE (module-internal) |
| 126 | `BREACH_CREDIBILITY_TUNING` | `src/domain/worldPulse/treatyBreachCredibility.js` | 61 | 0 | 1 | docs:1 tests:1 | LIVE (module-internal) |
| 127 | `TREATY_ENFORCEMENT_TUNING` | `src/domain/worldPulse/treatyEnforcement.js` | 41 | 0 | 1 | tests:2 | LIVE (module-internal) |
| 128 | `SUCCESSION_TUNING` | `src/domain/worldPulse/treatySuccession.js` | 89 | 0 | 3 | docs:3 | LIVE (module-internal) |
| 129 | `UPSWING_TUNING` | `src/domain/worldPulse/upswingKernel.js` | 100 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 130 | `FABRIC_TUNING` | `src/domain/worldPulse/urbanFabricKernel.js` | 237 | 0 | 5 | docs:1 src:1 tests:1 | LIVE (module-internal) |
| 131 | `VENGEANCE_LICENSE_TUNING` | `src/domain/worldPulse/vengeanceLicense.js` | 82 | 0 | 2 | tests:1 | LIVE (module-internal) |
| 132 | `COALITION_EXPENDITURE_TUNING` | `src/domain/worldPulse/warCoalitionExpenditure.js` | 21 | 0 | 2 | — | LIVE (module-internal) |
| 133 | `COALITION_SETTLEMENT_TUNING` | `src/domain/worldPulse/warCoalitionSettlement.js` | 44 | 0 | 1 | — | LIVE (module-internal) |
| 134 | `WAR_COSTS_TUNING` | `src/domain/worldPulse/warCosts.js` | 59 | 0 | 14 | tests:1 | LIVE (module-internal) |
| 135 | `WAR_INTENT_TUNING` | `src/domain/worldPulse/warIntent.js` | 420 | 0 | 0 | — | **DEAD (binding) — HOLD** |
| 136 | `WAR_PEACE_DECISION_TUNING` | `src/domain/worldPulse/warPeaceDecision.js` | 32 | 0 | 2 | — | LIVE (module-internal) |
| 137 | `WAR_PEACE_REFUSAL_TUNING` | `src/domain/worldPulse/warPeaceRefusal.js` | 21 | 0 | 1 | — | LIVE (module-internal) |
| 138 | `WAR_POLITICAL_TUNING` | `src/domain/worldPulse/warPoliticalLoop.js` | 20 | 0 | 4 | — | LIVE (module-internal) |
| 139 | `WAR_TERMINATION_TUNING` | `src/domain/worldPulse/warTermination.js` | 103 | 0 | 7 | docs:1 | LIVE (module-internal) |
| 140 | `GOVERNOR_TUNING` | `src/lib/townScene/adaptiveQuality.js` | 32 | 0 | 5 | other:2 scripts:3 tests:2 | LIVE (module-internal) |

## Tally
- LIVE (module-internal): **130**
- LIVE (foreign consumer only): **6**
- DEAD binding, HOLD (aggregator facade): **4**
- CANNOT PROVE: **0** — every candidate resolved to a demonstrated verdict.
- **Provably dead AND safe to delete: 0.**
