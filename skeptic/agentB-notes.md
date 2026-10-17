# agentB notes (adversarial verify IN/AIN/AES brackets) — code of record master-00b648c9d
## Spot-checks so far (PASS/FAIL)
1 beliefsActive beliefMap.js:204-209 PASS
2 infoMode rows simulationRules.js:56,953(dramatic),996(living_realm),1073(full) PASS; only three presets
3 RACE_ARRIVAL_KINDS reputationRaceConsumer.js:103 PASS
4 settlementLifecycleKernel.js:591 advanceReputationRace PASS
5 IN flags (infoStatecraft, informationBrokerages(false at :1153), errandSpine, espionage, counterIntel, infoLure, reputationRace, secondOrderBelief, intelTrade) in no preset; FP_LIT_* tables lack them PASS
6 EXPOSE_MAX_AGE_TICKS 8 disinformationPlant.js:93 PASS
7 EXPOSE_BASE 0.01 informationStatecraft.js:822 PASS
8 INTERCEPT_ENDINGS brokerageServices.js:588 PASS
9 peaceTermsDisclosure.js:10-14 T+1 window; informationStatecraft.js:1487; :1387; envoyPulse.js:207 PASS
10 heraldRouting 74/139/270/338; grammarNews.js:118 PASS
11 secrecyTradeFactor.js:17-23 zero consumers (src grep) PASS
12 neighbourMirror.js:40,:202 PASS; secondOrderBelief.js:64,:292,:297 PASS
13 infoLure.js:159,:383-399,:176-180,:418-437 PASS
14 infoLure.js:45-48 "commission's consumer lands when U123..." FAIL: text is at :37-38 (lines 45-48 are the counterparty/J-FP-5 prose). cited 4x (INFO L793-bracket,L1488; ARCH_IN L524)
15 infoConvergenceContract.js:135-137 "sweep endings UNMOUNTED" FAIL: 135-137 are plant endings; UNMOUNTED sweep endings at :148,:194-196 (def :25) (INFO L982 bracket)
16 suspicion.js:8-10,:86,:152; counterIntelSweep.js:44,:65; resolveSweep no prod caller PASS; no espionage module imports suspicionOf PASS
17 espionageMissions.js zero src importers; espionageDoctrineStage only via espionageRider; envoyDiplomacy.js:41; subsystemRowsBelief.js:178 PASS
18 espionageProducts.js:28-31 / :32-40 FAIL(minor): target-read quote is :30-33, waypoint :26-29
19 envoyErrandVocabulary.js:207-213 five legRefs, :168 three products PASS
20 espionageCareerCredit.js:16,:200-209; npcLadderKernel.js:93; spatialUsage.js:307 PASS
21 warReasonTaxonomy.js:24-41 sixteen PASS; size-baseline pulseKernel 1581 :13, applyWorldPulse 907 :9 PASS
22 brokerageServicesPlant PLANT_REFUSALS seven (:98-100), projectPlants :577, composers.js:97, HousesBlock.jsx:40 PASS; CHANNEL_BELIEF_AXES.trade [] brokerageServices.js:129 (actual :129) PASS
23 allyIntelSharingEnabled "lit in quiet_local (:897) and full_simulation (:1082)" FAIL: :897 is inside realistic_regional (873-903), not quiet_local. quiet_local unlit. (INFO L183,L535; ARCH_IN L358) MAJOR-ish (also: realistic_regional is omniscient so feed is belief-write -> only full_simulation effective)
24 race tier/first-visible (INFO L1080, ARCH_IN L553): omits that reputationRaceEnabled is lit nowhere and storyArrivalTicks needs routeLifecycleActive (routeNetworkConsumersRace.js:218; simulationRules.js:782-788 "HELD DARK ... reputation race, whose story leg answers only over lived route network") FAIL (MAJOR)
25 ES "twelve units landed (ES-0..4,5a-5d,6a,Da)" = 11 by git log FAIL (MINOR)
26 shas: 9e916163b,769c2363e,6dbb76c2,99d63d92,55674790 ancestors OK; d7b779928, 582527f13, 5731d4052 NOT ancestors (pre-rebase; master = 9c4ddfc50 IN-3/1, 60877042d IN-3/2) FAIL (MINOR) INFO L181,L982
27 beliefMap.js:1117 ghost-write: actual :1121 (reader's line) ; PLAUSIBLE claim, line off by 4 (MINOR)

## Additional checks
28 INFO L470 / ARCH_IN L343 IN-0b "act lane runs at INTEL_TRADE cadence (26-week pair cooldown, 12/tick cap)" FAIL MAJOR: that cadence is the D-3 gift/sell intel lane (intelActs.js:62-70; generosityKernel.js:1009-1024, gated intelTradeEnabled ∧ beliefsActive ∧ infoStatecraft). Built intercept = brokerage rule candidate rotated by (fnv1a32(settlementId)+tick)%available.length at probability 0.07 (brokerageServicesRules.js:94-97, :256-263, :329); no cooldown/cap in brokerageServices*.js (grep none).
29 INFO L535 / ARCH_IN L358 treaty_disclosure_opened "one tick after signing (credit at T+1)", TIER omits treatyLifecycleVoiceEnabled: FAIL MAJOR. peaceTerms.js:611-613 "spoken ONCE at the signing" (same tick as mint) gated lifecycleVoiceLit = treatyLifecycleVoiceEnabled, lit via FP_LIT_WARPEACE (simulationRules.js:958 dramatic, :1215 full). T+1 credit (peaceTermsDisclosure.js) is a different mechanic, needs infoStatecraft (dark).
30 INFO L948 / ARCH_IN L527 "sweep cooldown (~26 weeks)": FAIL MINOR: no cooldown exists in counterIntelSweep.js/suspicion.js (grep -i cooldown none); it is INFO's design idiom (INFO:1028). Verbs unmounted anyway.
31 ES L1205 cites FABLE_VALIDATION_QUEUE.md:2598 for owner quote: actual :2593; scope names arm at :2616 (cited :2615-2617 ok); HB ":3442-3450 R1 REFUTED BY EVENT": R1 is at HB:277/:286 (the CR-ES-4 correction at :3487-3492); the 3442-3450 are ledger-copy lines. FAIL MINOR
32 ARCH_IN L725 DESIGN_FP_ARCHITECTURE.md:2926 (CR-FP-4): actual :2988 on master copy (ledger line). FAIL MINOR
33 W-OPS leaves unimported (infiltrationDepth/Drift, missionAcceptance, operationsVoice none; operationGrammar only by missionDispatcher; dispatcher only string in habitForkRegistry) PASS; espionageActive = beliefsActive ∧ errandSpine ∧ espionage (espionageGate.js:75-81) PASS; ransom DWELL_CUTS_COVERT [4,16] (ransomClaim.js:81) PASS; CONDITIONS_STEMS three (infoLure.js:145) PASS; HALF_LIFE_BANDS season..generation (bandedStock.js:57) PASS; envoy 'column' = army column PASS
34 INFO tier head "every IN wave needs infoStatecraftEnabled and/or informationBrokeragesEnabled" false for IN-4/2 race (own flag reputationRaceEnabled only: reputationRaceConsumer.js:121-122) MINOR (rolled into race finding)
## TALLY: 35 checks, 22 PASS / 13 FAIL (0 BLOCKING; 5 MAJOR: allyIntel preset, race tier/route, IN-0b cadence, disclosure timing, [none else]; rest MINOR)
## Job 2
All 30 IN-ES §10 items for the 3 volumes landed as brackets (AES:1682 flag attribution already corrected in the master base at ES:1857-1858; AIN:34-39 IN-0c BLOCKED already corrected in base at ARCH_IN:37/:359). §11 Q1-Q6 -> OD-FC-19/39, OD-FC-9, §3.1.4, OD-FC-4, OD-FC-12, OD-FC-28 all present.
Items 31-37 (other volumes): 31 SP ok, 32 HB ok, 33 WC ok (:4844 STRUCK), 34 WY ok (:389,:1564), 35a COUPLINGS:672 ok.
DROPPED (no bracket, no fold row): D1 COUPLINGS:674-675 "SP-5's house credibility instantiates the confidence-stock family for commerce" (refinement 35b; CHANNEL_BELIEF_AXES.trade still [] ; no 'CHANNEL_BELIEF_AXES' hit in COUPLINGS/TRADE/fold); D2 TRADE:650 "counterforces are the BUILT exposure stack (IN-3's sweep…)" (refinement 36; sweep unmounted; no UNMOUNTED/U123 in TRADE beyond header); D3 (partial) ARCHITECTURE:961 "GR-3b and IN-0c remain owed" progress block (refinement 37) - no 10-16 bracket at 949-975; IN-0c landed (peaceTermsDisclosure). 
MISREAD: INFO L172 / ARCH_IN L60 / ES L753 "adopted ally share REPLACES the receiver's whole seat record": code replaces ONE subject's BeliefRecord (beliefMap.js:1121 nextSeat[subjectId]=shared), seat map is kept (MINOR).
