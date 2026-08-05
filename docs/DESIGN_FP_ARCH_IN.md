# IN-ARCHITECTURE — THE INFORMATION PROGRAM, COMPILED TO IMPLEMENTATION

## Compiled 2026-08-04 by the IN program architect against the LIVE tree:
## minifold @ claude/composite-r4, HEAD e564e135. The governing volume is
## DESIGN_FP_INFORMATION.md (2026-08-02, fp-audit-corrected); the template and
## protocol authority is DESIGN_WAR_RULINGS_ARCHITECTURE.md (§10 binds verbatim);
## the constitution is DESIGN_FP_SPINE.md. LIVE CODE OUTRANKS THIS DOCUMENT and
## outranks the volume — every §1 row below was re-measured by executed grep/read
## on 2026-08-04, and the deltas against the volume's 2026-08-02 survey are the
## headline product. Queue rows are SPECS, not open work (build order:
## SOL_QUEUE.md A2 row 13 — INFO builds after GRAMMAR row 12, before TRADE row 14).
## Every judgment below is labeled JUDGMENT (vetoable, J-INA-*; the volume's
## J-INF-* rulings stand except where a refutation forces a re-scope, and each
## such re-scope is its own J-INA block, never a silent overwrite).

**THE HEADLINE (read this before any wave):** the tree moved hard in the two days
since the volume's survey. Five load-bearing premises are REFUTED or materially
re-scoped: (1) the PLANT fold is BUILT — what is missing is only the pulse-level
envelope handoff (IN-0a shrinks by two-thirds and changes shape); (2) the entire
WR-7 envoy program landed (~7,750 lines) including `sendTwoDivergence.js`, whose
header EXPLICITLY discharges J-INF-15 — IN-3 consumes, never builds, the
divergence reader; (3) the "seven dark flags" are no longer uniformly dark —
`distancePricedNewsEnabled` is lit in the ONE_REGEN preset spread and
`allyIntelSharingEnabled` is lit in the Full Simulation preset, so two IN
preconditions are REACHABLE-LIT in shipped configs and every dormancy fence must
be captured against those presets, not only against defaults; (4) peaceTerms.js
was decomposed (1680 -> 765 effective; baseline entry deleted) — the hot-file
constraint on IN-0c relaxes to ordinary leaf discipline; (5) `faithLabel` is a
live believed axis on BeliefRecord, so IN-2's DEVOTION bait is no longer hard
-blocked on SP-2 (re-scoped under J-INA-3). Every line number in the volume's §2
has rotted at least once — NAVIGATE BY SYMBOL (the estate's recorded
hand-keyed-line-address-rot hazard; it bit this compilation five times).

---

## §1 SUBSTRATE CLAIMS — every existing-code premise, re-measured 2026-08-04

Verdicts: VERIFIED (executed receipt matches the claim), REFUTED (a load-bearing
assertion is false against the live tree), REFINED (true in substance, false in a
detail a wave would have tripped on). Live code outranks this table too.

### 1a The physics rows (the volume builds ON these)

| # | Claim (volume) | Live receipt (2026-08-04) | Verdict |
|---|---|---|---|
| S1 | beliefMap physics: SILENCE_DECAY 0.92, MIN_CONFIDENCE 0.03, HOP_DECAY 0.75, RECENCY_DECAY 0.85; reconcileBelief; per-source credibility multiply | src/domain/worldPulse/beliefMap.js — BELIEF_TUNING :109-133; beliefsActive :203-208 (spatialCanonVersion marker AND infoMode !== 'omniscient'); aggregateReports :546-556 (`w *= credibilityOf(r.sourceId)`); reconcileBelief :591 | VERIFIED |
| S2 | detectMisjudgment + M9b ally-intel with alignment-styled deception | beliefMap.js — applyAllyIntelSharing :1025 (wired :1356), detectMisjudgment :1468. Volume's :801-1009 / :1362-1386 cites rotted | VERIFIED (addresses REFINED) |
| S3 | One-substrate distance law: hopDelay = floor(hopWeeks×0.5), V-24b impedance | src/domain/worldPulse/distancePricedNews.js :18 (formula), hopDelayTicks :30, embattlement-reactive impedance :47-66 | VERIFIED |
| S4 | Credibility asymmetry: rise 0.6 / fall 5 / half-life 52 / weight [0.35, 1.15] centred on 1.0 | src/domain/worldPulse/informationStatecraft.js — CREDIBILITY_TUNING :136-165 (TRUE_RISE 0.6, LIE_FALL 5, HALF_LIFE_TICKS 52, WEIGHT_FLOOR 0.35 / WEIGHT_CEIL 1.15); span math :187-197. Also present, NEW since survey: CLIMB_DOWN_FALL 2 (momentum seam, never produced yet) | VERIFIED |
| S5 | DisinfoRecord is strength-typed; exposure comparator reads strengthBand exclusively; EXPOSE_MAX_AGE 8 | informationStatecraft.js — comparator loop :536-541 (`belief.strengthBand`, EXPOSE_CONTRADICT_BANDS / EXPOSE_MAX_AGE_TICKS); record mint :672-678 ({liarId, subjectId, audienceId, assertedBand, trueBand, seededTick, lineageId, spokespersonNpcId?}) | VERIFIED — with S24's new channel caveat |
| S6 | Brokerage stamp ladder calibrated on 18,377 real arrival records | src/domain/worldPulse/brokerageStamps.js :20 (header states exactly this) | VERIFIED |
| S7 | claimFrom is the ONLY claim constructor; QUERY_REFUSALS is a frozen five incl `no_record` | src/domain/worldPulse/brokerageServices.js — claimFrom :297 (header :16 states the one-place law); QUERY_REFUSALS :321-324 = ['dormant','no_house','channel_declined','cannot_pay','no_record'] | VERIFIED |
| S8 | CHANNEL_BELIEF_AXES.trade frozen EMPTY (no believed scarcity/conditions) | brokerageServices.js :122-129 — trade: [], crime: [], persons: []; war: [strengthBand, readiness]; politics: [allianceLabel]; faith: [faithLabel] | VERIFIED — and see S25 |
| S9 | D-3 intel lane: 26-week pair cooldown, 12/tick cap, one-tick deposit courier | src/domain/spatial/intelActs.js — INTEL_TRADE_TUNING :44+ (COOLDOWN_WEEKS 26, ACTS_PER_TICK_CAP 12); consume arm informationStatecraft.js ~:1290-1360 ("Generosity OWNS + prunes intelTransfers — this mover only READS it"; self-policing resolvedSales at arrival) | VERIFIED |
| S10 | Statecraft wired in the pulse after the belief advance | pulseKernel.js — import :105, W-DOCTRINE-2 block + advanceInformationStatecraft call :2064-2095 (call at :2073). Volume's :1875 rotted | VERIFIED (address REFINED) |
| S11 | The race: RACE_OUTCOMES ['person','story','together','neither'] verbatim; ZERO src consumers | src/domain/worldPulse/routeNetworkConsumersRace.js :104 (frozen exactly so), reputationRace :322; executed grep: no importer anywhere in src outside the module | VERIFIED |
| S12 | sightPostures ledger exists, NO UI consumer | written at informationStatecraft.js ~:1253 (`setSpatialLedger(state,'sightPostures',…)`); executed grep over src/components + src/domain/display: zero hits | VERIFIED |
| S13 | Covert patronage/live-plant projections built, zero non-test consumers; the `exposed` list is a parameter nothing supplies | src/domain/worldPulse/brokeragePatronage.js — projectPatronBindings :319 (`{ audience='dm', exposed=[] }`, doc :305-316); executed grep: no caller outside the brokerage modules | VERIFIED |
| S14 | projectPlants fail-OPEN on its default (`audience: 'dm'`) | src/domain/worldPulse/brokerageServicesPlant.js :537 — `projectPlants(records, { audience = 'dm', … })`. J-INF-17 stands as ruled | VERIFIED |
| S15 | The chooser enumerates NO information verb; belief-aware reads only | src/domain/worldPulse/settlementStrategy.js — evaluateSettlementStrategyRules :1095+ (settlementStrategyEnabled gate + WR-6 coalition arm; beliefsActive read; war/peace/coalition levers); grep sweep/vet: zero | VERIFIED |
| S16 | Herald: six frozen sections, walker-pinned correspondence; belief_misjudgment under FAITH; intel_transfer under TRADE by recorded judgment | src/domain/realm/heraldRouting.js — HERALD_SECTIONS :64 = ['war','faith','trade','events','divination','adjudication']; belief_misjudgment: 'faith' :134; intel_transfer: 'trade' :167 with the authoring ruling comment :120; KIND_SECTION_CORRESPONDENCE :491 | VERIFIED |
| S17 | Knowledge-lane narration starving; late-lane; ceiling 'notable' | statecraft beats mint significance 'notable' at informationStatecraft.js :584, :1007, :1338; the routed-token census has GROWN — executed count 2026-08-04: 354 routed kind tokens (war 90, trade 104, faith 18, events 132, divination 8, adjudication 2; NO knowledge section). The volume's 269/68 figures rotted; the starvation is now ~1.1%, i.e. WORSE | VERIFIED (numerators REFINED) |
| S18 | WHAT_PHRASES registration home | src/domain/display/settlementRumors.js :116 (`export const WHAT_PHRASES`) | VERIFIED |
| S19 | knowledgeLaneEvidence honesty: ONE dispositive literal; 15 residual impactKinds; 7 kind-only | src/domain/certification/knowledgeLaneEvidence.js — KNOWLEDGE_LANE_EVENT_TYPES = ['belief_misjudgment'] :62; the FIFTEEN :91; kind-only contract :126-134 | VERIFIED |
| S20 | The lit/dark differential instrument asked for and ABSENT; the medium soak-unobserved | src/domain/certification/subsystemRowsRegen.js distancePricedNews row (~:50-75): "Half of that instrument now exists; the differential harness does not", soakEvidence: 'unobserved' | VERIFIED |
| S21 | BEHAVIORAL_MOVER_FAMILIES.knowledge is a residual bucket; "knowledge: 28" was contamination | scripts/audit/behavioral-observation.mjs :60 (the family), :559-561 ("knowledge: 28 over thirty years proves nothing about the belief lane at all"); bare-`news`-token contamination restated at subsystemRowsWaves.js :214, :303-304, :370, :464 | VERIFIED |
| S22 | WR-1's optional live-strength restraint stands; fog may overstate degree, never reverse the live sign | src/domain/worldPulse/opportunism.js — liveStrengthContradictsOpportunism :180, consumed :368, `constraints.enforceLiveStrength === true` :377-386. J-INF-14 binds unchanged | VERIFIED |
| S23 | No informational casus belli | src/domain/worldPulse/warReasonTaxonomy.js :24-40 — WAR_REASON_TYPES now SIXTEEN (volume said 13; +sacred_claim, lineage_claim, alliance_obligation, atrocity_answer since), NONE deception-typed; corruption_exposed :31 stays revelation-as-grievance. J-INF-9's substance holds; the walker-bijection count in any pin must use 16 | VERIFIED (count REFINED) |
| S24 | (volume: absent) any non-strength lie channel | REFINED-NEW SUBSTRATE: plants may now carry an ENVOY-PICTURE patch — ENVOY_PICTURE_PLANT_FIELDS (brokerageServicesPlant.js :89-100) is a frozen TEN-field vocabulary (strengthBand, storesBand, foodPressureBand, economyPressureBand, tradePressureBand, threatBand, allyStrengthBand, restitutionClaimBand, warExhaustionBand, alignmentPressBand) that moves ONE frozen WR-7b negotiation picture via processLies' envoyPicturePatches return. This is a PER-ERRAND EPHEMERAL channel, NOT a belief axis — §3 rules the two channels distinct | REFINED |
| S25 | Verified-ABSENT: BELIEVED DEVOTION does not exist | PARTIALLY REFUTED: `faithLabel` is a LIVE believed axis on BeliefRecord (the planted record carries it forward; CHANNEL_BELIEF_AXES.faith = ['faithLabel']), and src/domain/worldPulse/beliefAxes.js ships the D-1 axis idiom (populationTrendBand + observanceLabel behind `beliefAxesEnabled`, foldBeliefAxes as the extension pattern). What is absent is only the DISINFO-side axis typing + comparator + receipt. BELIEVED SCARCITY / CONDITIONS remain absent (S8) | REFUTED (in part) — drives J-INA-3 |
| S26 | Foreign-asset scandal + organic exposure ousts/reseats; beats disjoint | src/domain/worldPulse/corruptionWeb.js :443-762 (un-ousted assets census, exposure/ousting machinery, EXPOSED_OUSTED_BONUS :762); council_schism at pulseKernel.js :597-621; no composer joins secret→break→fall (grep: no such composer) | VERIFIED |
| S27 | Irony surfaces built; BeliefDivergenceBand v1 lacks its truth join | src/domain/briefs/composers.js — dramaticIronyBrief :272-312; src/components/map/BeliefDivergenceBand.jsx + WarCausalBrief.jsx exist | VERIFIED |
| S28 | avgTieStrength reads ground-truth trust on a K3-adjacent path (cross-volume bug note) | MOVED but TRUE: now src/domain/worldPulse/peaceTermsGraph.js :73-84 — reads `relationshipStates[key].trust` raw. The bug-report row stands for GRAMMAR's K3 sweep, at the NEW address | VERIFIED (address REFINED) |
| S29 | Disclosure term minted/strains/expires; executor 'seam'; the credit is W-PEACE's seam | TERM_CATALOG moved to src/domain/worldPulse/peaceTermsCatalog.js — disclosure :157 (`family:'informational', executor:'seam'`), intel→disclosure war-spoil mapping :209, label :225; the statecraft foot notes (informationStatecraft.js :1400-1428) restate the seam and name the landing: "a signed disclosure term should CREDIT the loser's credibility … at the draftTerm executor:'seam' branch"; AND the credit hook is PRE-PLUMBED — advanceInformationStatecraft already accepts `provenTrue = []` / `npcProvenTrue = []` (:1216-1218) | VERIFIED (address REFINED; hook NEW) |
| S30 | HIDE's trade tax narrated, unwired; SEE gate-not-drain; SELL spammer deliberately absent | informationStatecraft.js foot seam notes :1400-1428 — all three stand verbatim ("wiring the actual merchantAppetite/tradeSalience penalty into the trade read is a thin downstream hook, NOT a pinned effect") | VERIFIED — IN-0d remains real work |
| S31 | Intercept act is narrative-only (no claim, no belief record) | src/domain/worldPulse/brokerageServicesRules.js :303-327 — mints headline + metadata {institutionId, patronId, rivalId, covert}; constructs NO claim | VERIFIED — IN-0b remains real work |
| S32 | The six planned receipt kinds do not exist; the two built beats do | executed greps: plant_took, lure_sprung, mirror_shift, court_sat_still, false_accusation, treaty_disclosure_opened — ZERO src hits; infowar_lie_exposed + infowar_spy_exposed live in informationStatecraft.js + settlementRumors.js | VERIFIED |
| S33 | Flag manifest + walker exist; infoStatecraftEnabled is a member | src/domain/worldPulse/simulationRules.js — ENGINE_GATED_VIRTUAL_RULE_KEYS :185-194 = ['beliefAxesEnabled','conquestDoctrineEnabled','infoStatecraftEnabled','migrationRumorsEnabled','sovereigntyTradeEnabled']; walker tests/lint/engineGatedRuleKeys.walker.test.js | VERIFIED |
| S34 | Mutation-manifest + tripwire idioms exist for L7/L9 obligations | tests/lint/mutationCoverageManifest.test.js + tests/lint/mutationCoverage.shared.mjs; the TR-5 tripwire pattern live at src/domain/worldPulse/sovereigntyBundle.js :166 (`catalogGrewSinceWr10()`) | VERIFIED |
| S35 | Envoy transit obeys law M | src/domain/worldPulse/envoyErrandTransit.js :104 — "one-week-per-leg"; interception/custody/parlay staged in envoyInterceptionStage.js (single pre-mutation cut, one transition per tick) | VERIFIED |

### 1b The refuted premises (the most valuable rows — each re-scopes a wave)

| # | Volume premise | What the tree actually holds | Consequence |
|---|---|---|---|
| R1 | **PLANT_WIRING is an unwired seam** — "the bought lie charges the buyer and plants NOTHING"; IN-0a = build the fold into processLies | THE FOLD IS BUILT. `processLies` takes `commissionedPlants = []` (informationStatecraft.js :493-517) and folds validated envelopes into `nextDisinfo` under the disjoint `plant:*` namespace with full belief overrides (:598-608); the envelope validator is a NEW pure leaf, src/domain/worldPulse/disinformationPlant.js (328 lines — `commissionedPlantAt` :235, LIE_TUNING/applyBeliefOverrides extracted here under R-BLD-4); brokerageServicesPlant.js :61-72 documents the landing and PLANT_WIRING now NAMES it. **What is genuinely absent is the PULSE HANDOFF**: pulseKernel :2073 calls advanceInformationStatecraft WITHOUT commissionedPlants; pulseKernel :2031 calls advanceEnvoyDiplomacyPulse WITHOUT them; the act rotation (brokerageServicesRules.js :330-380) mints candidates whose `metadata.plant` carries the paid envelope — and NOTHING in src reads `metadata.plant` (executed grep: zero). Both consumers are fed only by tests | IN-0a RE-SCOPES from "build the fold" to "carry the envelope": the live thesis (charges the buyer, plants nothing) still holds AT THE PULSE, but the wave is now a transport problem under the zero-pulse-edit law — see §4 IN-0a and OPEN QUESTION Q1 |
| R2 | **WR-7d SEND-TWO / envoy vetting SPEC-ONLY** ("executed grep 2026-08-02: zero envoyErrand/sendTwo hits in src") | The ENTIRE WR-7 program landed: 20 envoy modules, ~7,750 lines (envoyErrand/Offer/Transit/Records/Vocabulary/Evidence/Ledger/Parlay/Projection/EncounterWriter, envoyPulse, envoyInterceptionStage, envoyNegotiationPictureBuilder, envoyTestimony, envoyRansomStage, envoyRatificationStage, envoyNews, envoyDiplomacy, envoyEncounter, + ransomClaim/ransomChoices). **src/domain/worldPulse/sendTwoDivergence.js exists and its header discharges J-INF-15 by name**: "WR-7d built first, so the information volume's SEND-TWO verb (IN-3) consumes THIS reader rather than forking a second one." SEND_TWO_VERDICTS ['agreed','diverged','not_a_send_two']; VETTING_QUALITIES ['hurried','careful']; VOLUNTEER_LOYALTY_BANDS / VOLUNTEER_TIE_BANDS / VETTING_BASES all closed and built; WR-7c's envoyTestimony ladder is equality-pinned to brokerageStamps' RELIABILITY_LADDER | J-INF-15's contingency RESOLVED in the war program's favor. IN-3(2) VET and IN-3(3) SEND-TWO become CONSUMERS of sendTwoDivergence.js + envoyTestimony.js; IN-3 must NOT mint a second divergence reader or a second vetting vocabulary (source-scan pin). IN-4's double-agent/interception cross-pins now point at BUILT machinery |
| R3 | **"Seven dark virtual flags, none in DEFAULT_SIMULATION_RULES"** | None in DEFAULT_SIMULATION_RULES — still true. Uniform DARKNESS — false, three ways: (a) `distancePricedNewsEnabled: true` rides the ONE_REGEN preset override (simulationRules.js :269, spread into presets at :376, :417, :625); (b) `allyIntelSharingEnabled: true` in the Full Simulation preset (:491, with infoMode 'full' at :483); (c) `intelTradeEnabled` is an INVISIBLE key — declared NOWHERE in simulationRules (not in the manifest :185-194, not declared-false like informationBrokeragesEnabled :562), the exact defect the file itself warns about at :500 ("npcCredibilityEnabled is exactly that shape today"). informationBrokeragesEnabled is declared-false (walker-visible) and dark | IN-0c's disclosure feed precondition (`allyIntelSharingEnabled`) is REACHABLE-LIT in a shipped preset: the "named degraded arm" is not hypothetical, and goldens must be captured for the full-sim preset BEFORE the executor lands. IN-4's story-leg precondition (`distancePricedNewsEnabled`) is lit in ONE_REGEN worlds. The intelTradeEnabled visibility defect is cured in IN-4's first commit (Q3) |
| R4 | **peaceTerms.js sits at its size ceiling; the executor must dodge the hot file** | peaceTerms was DECOMPOSED 2026-08-03 (scripts/.size-baseline.json `_decomposition_wave_war_2026_08_03`: 1680 -> 765 effective, entry DELETED, nine pure leaves; TERM_CATALOG now lives in peaceTermsCatalog.js) | IN-0c's leaf-first shape stands as ordinary discipline, not emergency surgery; the executor lands as a new pure leaf of the peaceTerms family (head keeps the mover), and the volume's "net-zero seam lines only" constraint on the head relaxes to the normal size budget |
| R5 | **PLANT_REFUSALS is a "frozen five"** growing to six with `too_hot` | It is SIX today: ['dormant','no_market','bad_intent','cannot_pay','no_channel','already_active'] (brokerageServicesPlant.js :84-87) | IN-3(b)'s closed-vocabulary pin asserts SEVEN after `too_hot`; any pin written against five reds on arrival. QUERY_REFUSALS stays five and untouched (S7) |
| R6 | **Casting adds "no new NPC state" because none exists** | npcCredibility.js (288 lines) landed: the LIE verb stamps a SPOKESPERSON (`spokespersonNpcId` on DisinfoRecord, mouthpiece pick + composite settlementCred × mouthpieceCred weight in processLies), with per-NPC credibility deltas advanced in the statecraft tail; gated on `npcCredibilityEnabled` (itself an invisible key — R3's class) | IN-1's mirror inputs, IN-2's exposure blowback, and IN-3's vet read must COMPOSE the mouthpiece plane (a burned mouthpiece is a personal leg of the blowback triple); every IN receipts row that names a speaker uses the existing spokesperson attribution, no new NPC state — the volume's law holds, the substrate is just richer |
| R7 | **Line-address integrity of the volume's §2** | Rotted throughout: statecraft foot notes :1444-1472 -> :1400-1428 (content also changed — the four verbs are now marked BUILT, the deferred set is exactly S29/S30's three); pulse wiring :1875 -> :2073; peaceTerms cites -> peaceTermsCatalog/peaceTermsGraph; beliefMap :485-550 -> :591, :801-1009 -> :1025-1360; heraldRouting :104 -> :120/:167; file sizes beliefMap 1458 -> 1564, informationStatecraft (1428 physical) | Implementer law: NAVIGATE BY SYMBOL, never by the volume's line numbers. Every pin that anchors a doc or source address asserts its target appears EXACTLY ONCE (L7) |
| R8 | **Herald numerators: 4 knowledge beats / 269 routed tokens, war 68** | 354 routed tokens (war 90, trade 104, faith 18, events 132, divination 8, adjudication 2) — executed count over KIND_SECTION_CORRESPONDENCE | IN-6's decontamination baseline and IN-5's parity target re-measure at build time; the ~1.5% figure is now ~1.1% (the diagnosis strengthens; the numbers must never be quoted from the volume) |

**Verified-ABSENT rows re-confirmed 2026-08-04 (build on their absence, in the
wave that homes each):** second-order belief structure (no mirror module; no
`secondOrderBelief`/`mirrorOf` in src) · reputationRace consumers (S11) · a
brokerage_intercept claim (S31) · a house-side risk chooser (acts are
rotation-picked, no decline-on-risk) · HIDE entered as a RESPONSE to detected
espionage · informational casus (S23) · an inaction receipt · arc machinery ·
a knowledge Herald desk (S16/S17) · the strength-axis divergence measure + the
lit/dark differential harness (S20) · all six planned receipt kinds (S32) ·
`suspicionOf`/`secrecyTradeFactorOf` (no hits).

**Cross-volume bug rows (report, never build):** (1) S28's ground-truth trust
read at peaceTermsGraph.js:73-84 — re-filed to the GRAMMAR K3 sweep at the new
address. (2) The volume's second bug note (info-suite greenness PLAUSIBLE-only
under parallel-load fake reds) stands: a build wave is RUNNING in this tree
right now — IN-0's first act remains an isolation-verified green baseline of
the ~26 info-layer suites, and no gate is read through a pipe (check:tail /
gate-tail.sh only).

---

## §2 FLAG FAMILY — four new virtual flags, law-2 shape, manifest timing

All four: ABSENT from DEFAULT_SIMULATION_RULES forever; every gate reads
`=== true` (dark-never-permissive); each JOINS `ENGINE_GATED_VIRTUAL_RULE_KEYS`
(simulationRules.js:185) IN THE SAME COMMIT as its first real gate read, with
its certification row authored in that commit (the walker's contract, restated
at subsystemRowsVirtual.js:36 and :307) and the engineGatedRuleKeys walker
asserting exactly the one-key delta. Each flag lands the FOUR-FENCE dormancy set
(own-footprint golden · absent-vs-false differential · call-path spy ·
gate-polarity census) WITH the lit-mutant control proving the fences see, and at
least one BY-NAME gate read (the conjunction-gate hole: a read only through a
frozen-list `.every()` is invisible to the gate walker).

| Flag | Joins manifest in | Gates | Lit-preconditions (re-measured) |
|---|---|---|---|
| `secondOrderBeliefEnabled` | IN-1 commit 1 | mirrorOf + every consumer | `infoStatecraftEnabled` (the outbound ledgers it derives from are its writers') |
| `infoLureEnabled` | IN-2 commit 1 | axis-typed plant subjects + bait receipts | `informationBrokeragesEnabled` + `infoStatecraftEnabled` + `secondOrderBeliefEnabled`; SCARCITY/CONDITIONS baits additionally on SP-2's trade families (HARD, still absent — S8); DEVOTION bait re-scoped buildable NOW (J-INA-3, S25). `enforceLiveStrength` stays an interaction, precondition in NEITHER direction (J-INF-14) |
| `counterIntelEnabled` | IN-3 commit 1 | sweep/vet/send-two/hide-as-answer + suspicionOf + house exposure producer | `infoStatecraftEnabled`; mirror-gap evidence arm degrades dark (named degraded read); SEND-TWO consumes the BUILT sendTwoDivergence.js (R2 — the J-INF-15 dependency is DISCHARGED, not pending) |
| `reputationRaceEnabled` | IN-4 commit 1 | race-at-arrivals + who-knew-first outcome keys | `distancePricedNewsEnabled` (NOTE R3: lit in ONE_REGEN — the race's story leg is live machinery in shipped presets; dormancy fences capture ONE_REGEN-preset goldens too); person legs degrade to already-staged arrivals until SP-1 lights; courier migration additionally `intelTradeEnabled` × SP-1 |

IN-0's four slices ride EXISTING flags with the volume's §3 gate compositions,
re-measured: IN-0a ⇒ `informationBrokeragesEnabled` × `infoStatecraftEnabled`
(both currently dark/declared-false — dormancy trivially fenceable); IN-0b ⇒
`informationBrokeragesEnabled`; IN-0c ⇒ peaceCausalActive (warReasons.js's gate,
imported by peaceTerms.js:78) × `allyIntelSharingEnabled` — REACHABLE-LIT in the
Full Simulation preset (R3): the degraded-arm pin and the goldens-first fence
are captured against that preset BY NAME; the signing credit rides
`infoStatecraftEnabled` × peaceCausalActive through the pre-plumbed `provenTrue`
param (S29); IN-0d ⇒ `infoStatecraftEnabled`, dark ⇒ exported factor is the 1.0
identity, trade bytes golden-fenced. IN-5 routing config is dark-safe except the
`belief_misjudgment` REFILE, which is NOT dark-safe (producer gated on
beliefsActive; infoMode 'full' ships in the Full Simulation preset — S16, R3):
Herald goldens for non-omniscient infoModes are captured FIRST and the one-time
shift recorded (the volume's §5 IN-5(a) discipline, now with a named preset).
IN-6 has no flag.

**Flag-family hygiene debt adopted (JUDGMENT J-INA-4, vetoable):** IN-4's first
commit also cures `intelTradeEnabled`'s invisible-key defect (R3c) by joining it
to ENGINE_GATED_VIRTUAL_RULE_KEYS with its certification row — it already has
real `=== true` gate reads (intelActs.js:90, generosityKernel, statecraft
consume arm), which is the walker's membership test. Recorded here because IN-4
is the first IN wave whose behavior rides that flag; doing it silently would be
a manifest change without a ruling. (npcCredibilityEnabled's twin defect is
NOTED, not adopted — it is the war/doctrine family's key; reported to the chair
queue instead.)

---

## §3 CANONICAL MODEL — zero new top-level keys, and the fight held

The volume's §4 stands with one channel clarification and one contested
transport (Q1). Everything below is the COMPLETE new-state story; anything not
listed is derived, never stored.

```
worldState.spatialLedgers.disinfo[]   — EXISTING ledger, EXISTING single writer
  (processLies; envelope boundary = disinformationPlant.commissionedPlantAt).
  IN-2 widens each record with the axis reference, exactly as the volume's §4
  CORRECTED block prices it:
    axis: 'strengthBand' | 'faithLabel' | <SP-2 family axis>   (conditional;
      ABSENT ⇒ 'strengthBand', LEGACY SEMANTICS — old records load unchanged,
      the shape-migration pin)
    assertedValue / trueValue          (the axis-typed spelling; assertedBand/
      trueBand STAND as the strength spelling — never rewritten)
    intent: 'inflate' | 'deflate'      (stands as built)
  THE TWO-CHANNEL RULING (new, forced by S24 — JUDGMENT J-INA-2, vetoable):
  the ENVOY-PICTURE plant channel (ENVOY_PICTURE_PLANT_FIELDS, ten frozen
  fields patching ONE WR-7b negotiation picture, ephemeral, per-errand) and
  the BELIEF-AXIS channel (this widening: persistent, lifecycled, exposed by
  the axis-typed comparator) are DISTINCT AND STAY DISTINCT. The axis
  vocabulary is NOT the picture-field vocabulary; a plant targets one channel
  or the other; the pin set includes a source scan asserting no axis token
  ever enters ENVOY_PICTURE_PLANT_FIELDS and vice versa. Collapsing them
  would make a treaty-table patch a persistent world lie — the defect class
  this ruling exists to prevent.

worldState.spatialLedgers.sightPostures — EXISTING; IN-3 adds NO fields; gains
  its first projection (the Watch panel), read-only, DM-only, fail-closed.

[Q1-CONTINGENT] worldState.spatialLedgers.pendingPlants — ONLY if Q1's
  primary road fails verification at build: a drop-when-empty conditional
  deposit under the D-3 intelTransfers contract VERBATIM (single writer = the
  act-apply lane; statecraft READS and the writer prunes; absent key = zero
  bytes). The fight for zero says: exhaust Q1's primary road first.

everything else — NEVER STORED. The mirror, suspicion, the race, the arc:
  pure reads over persisted receipts and ledgers.
```

**Lifecycle-paths clause (L4, per the WR-10 discipline — written BEFORE any
writer builds):**
- CREATE: axis-typed disinfo records enter ONLY through processLies' fold
  (commission → envelope → commissionedPlantAt → nextDisinfo) or its own lie
  seeding; no second writer (the R-BLD-4 family: informationStatecraft.js head,
  disinformationPlant.js law leaf; source-scan census with an executed
  third-writer plant).
- READ: exposure comparator (axis-typed after IN-2), projectPlants (audience
  EXPLICIT at every call site — J-INF-17's scan), the mirror's
  plants-we-commissioned input, IN-6's envelopes.
- PERSIST: records ride spatialLedgers.disinfo exactly as today; conditional
  fields drop-when-absent (T4: an empty array is a key and a key is a byte;
  absent, never null); the ledger is codepoint-sorted at the writer
  (sortDisinfo — byte-stable).
- REGENERATE (THE PROMISE): a regen that rebuilds spatialLedgers preserves live
  plants or ghosts the DM-truth trace — the estate's most-bitten class; the pin
  regenerates a fixture world and asserts the folded record survives
  byte-identical; no IN record has a load-time normalizer, so shape discipline
  pins AT the writer.
- UNDO / DM-KILL: undo restores the prior ledger snapshot (existing machinery);
  DM-kill of a mid-flight courier errand closes `lost` through SP-1's one
  writer (IN-4 consumes, never forks).
- MIGRATE: absent-axis ⇒ legacy strength semantics is the ONLY migration — no
  script, no rewrite; the JSON-round-trip pin loads a pre-IN-2 record and
  asserts identical exposure behavior.
- VEIL: every public payload passes veilPublicPayload (standing estate law);
  plant records, Watch-panel rows, patron bindings, and arc DM-phases are
  DM/premium-audience projections, fail-closed player-side; `covert: true`
  fails closed UPSTREAM (L6).

**Deliberately NOT modeled (re-affirmed):** no nested belief map · no suspicion
stock (SP-5 closed) · no spy NPCs · no house micro-agents · no informational
casus · no partial-leak grading (binary exposure; owner surface) · no arc state
· no mirror persistence.

---

## §4 THE WAVES — dependency order, implementation grade, sizes measured

Protocol for every wave: one commit per slice/wave; focused gates per slice and
the full gate at wave end THROUGH check:tail / gate-tail.sh; isolation re-run
before believing any red (a build wave runs in this tree NOW); pathspec commits
under the staged-set law; byte-scan every authored file (the NUL hazard — bit
six times); every load-bearing conjunction gets an executed mutant (cp backup,
cmp/md5 restore, never checkout-family) + a mutationCoverageManifest entry; new
negatives carry `// anchored:`; doc-reading pins assert EXACTLY-ONCE; spine
requirements 13 (Alignment line) and 14 (Edit-verb story) discharged per wave
below per CR-6/CR-7 (FABLE_VALIDATION_QUEUE.md — the per-wave rows land AT
BUILD, which is here). Sizes quoted are PHYSICAL lines measured 2026-08-04; the
binding number is the enforcer Linter's effective count AT the publishing
commit (L8) — no file below except settlementStrategy.js (baselined 812,
AT ceiling) and the two banked pulse mouths is currently constrained, but
MEASURE, never inherit.

### IN-0 — THE PRICES BECOME LAW (four slices, four commits; rides existing flags)

**IN-0a — THE HANDOFF (re-scoped by R1; was "the fold").** The fold is built;
the envelope dies in candidate metadata. This slice carries it to the fold.
- Files: brokerageServicesRules.js (383), candidateEvents.js (786 — near the
  800 layer ceiling: any addition beyond ~10 lines needs a leaf), a NEW pure
  leaf for envelope collection (~80-line budget), informationStatecraft.js
  (1428 physical, effective well under 800 — head gains only the consume read),
  envoyPulse.js (376 — WAR-owned: the head-read gated on
  informationBrokeragesEnabled is coordinated with the war family, see
  collision map), a projection mount in the settlement dossier surface.
- Model: the applied brokerage_plant event's envelope reaches BOTH consumers
  (envoy targeting via prepareEnvoyPlantTargets — already pass-through-built,
  envoyPulse.js:108-146; the fold via advanceInformationStatecraft's
  commissionedPlants param) WITHOUT editing the banked pulse mouths
  (pulseKernel 1580 / applyWorldPulse 941 — ZERO edits ever, L1). Primary
  road: each consumer READS the prior tick's applied brokerage_plant events
  at its OWN head off the existing applied-event/news record
  (deposit-and-consume through an EXISTING home; one-week lag = law M and
  thematically exact: a commission takes a week to become a telling).
  VERIFY-AT-BUILD: applied-event metadata retention through the candidate
  apply lane. If retention fails: Q1's fallback (the pendingPlants conditional
  deposit under the D-3 contract). If BOTH fail: STOP-and-report (a chair-
  signed kernel seam is the chair's to grant, never the implementer's).
- Receipts: `plant_took` (DM-truth-only projection line) when the mark's
  belief crosses to the planted band; the exposure beat extends to NAME THE
  MARKET (and the commission where lineage collapsed). Registration complete
  IN THIS COMMIT: WHAT_PHRASES (settlementRumors.js:116) + heraldRouting +
  pacing/significance class (SP-6a assignment: routine) + the knowledge
  family's own-vocabulary token (mint-time rule §1c).
- Dossier round-trip: mount `projectPlants` (first non-test consumer) on the
  town page, DM/premium, audience passed EXPLICITLY; source scan catches any
  call site omitting it (J-INF-17); player projection pinned EMPTY for live
  plants.
- Pins (negative hardest): the corroborated mark's plant DIES at the fold
  (reconcile's contradiction arm — seeded non-empty); THE SPENT MARKET banded
  margin pin exactly as the volume's CORRECTED block (WEIGHT_FLOOR 0.35 is a
  discount, not silence; the fresh-plant-beats-stale-truth sibling pinned
  too); the WRITER/READER pin boots the REAL rotation producer through the
  REAL apply lane through the REAL fold (three stages, no shortcut fixture —
  the fixture-mirrors-deriver hazard); reachability: one plant TAKES in a
  generated lit corpus; the handoff's mutant: sever the envelope collection
  and the fold pin REDS (manifest entry); dormancy golden (both flags dark ⇒
  byte-identical, including the ONE_REGEN preset).
- Lifecycle: fold adds no shape change; JSON-round-trip on a folded record;
  regen preserves live plants (§3 clause).
- Spine 13: alignment DECLARED-ENGAGED — willingness already composes
  malice/lawfulness (lieWillingness); the slice adds no new alignment read.
  Spine 14: the DM verb story = the plant projection is read-only; commission
  remains engine-only THIS slice — recorded as an engine-only decision with
  rationale (the DM lie-commission verb is IN-2's surface).

**IN-0b — THE INTERCEPT CONSUMER.** As the volume (S31 verified narrative-only),
with these tree-corrections: the claim rides `claimFrom` (brokerageServices.js:
297 — grep pin: no second construction site); refusal = `no_record` from the
UNTOUCHED five-token QUERY_REFUSALS (S7); the fog compose WIRES HIDE's -0.7
rivals'-reads factor into the intercept's vagueness band (new work, named); the
outbound record read spans intelTransfers + feed contracts + commission
existence at banded vagueness. Files: brokerageServicesRules.js (the act body),
brokerageServices.js (432), a claims leaf if the head nears ceiling. Pins: the
empty-outbound honest refusal (seeded-positive twin); fog-compose pin (HIDE
court ⇒ degraded or refused); closed-vocabulary pin re-asserts QUERY_REFUSALS
unchanged; registration for the intercept hum; dormancy. Endings {read,
refused} minted here, `caught` declared cross-wave (IN-3's sweep). Spine 13:
declared-empty with reason (a priced read, no alignment lever). Spine 14:
engine-only, recorded.

**IN-0c — THE DISCLOSURE EXECUTOR.** As the volume, re-priced by R4 and armed
by S29: lands as a NEW pure leaf of the peaceTerms family (e.g.
peaceTermsDisclosure.js, ~200-line budget) consuming peaceTerms' exports —
minting/compliance/expiry stay the head's; the M9b-style loser→victor feed
(lawful relay ×0.95) runs behind peaceCausalActive × allyIntelSharingEnabled;
the signing credit is a `proven_true` delta through the PRE-PLUMBED provenTrue
param (S29 — the hook exists, zero statecraft-head surgery). GOLDENS FIRST
against the Full Simulation preset (R3 — allyIntelSharing is LIT there; the
degraded arm lit-peace/dark-info is byte-identical on belief state, pinned).
Pins: the expiry lift SAME TICK (one artifact, one lift contract — GRAMMAR's
enforcement law); defaulted ⇒ no feed + the default receipt; writer/reader pin
boots peaceTerms' real minter; reachability on a real drafted treaty carrying
disclosure; `treaty_disclosure_opened` registered at mint; compliance-state
spellings read from the head's own vocabulary AT BUILD (observedState
machinery verified; exact union VERIFY-AT-BUILD — never hardcode `strained`
from the volume). Spine 13: engaged — the loser's strain posture reads
alignment through the existing compliance scorer; declared. Spine 14: the
treaty document's disclosure article is read-only; term editing stays the
treaty lane's — recorded.

**IN-0d — HIDE'S TRADE TAX.** As the volume; S30 confirms it open, and the foot
note names the landing ("the merchantAppetite/tradeSalience penalty into the
trade read is a thin downstream hook"). A NEW pure read leaf
`secrecyTradeFactor.js` (~100-line budget) exported from the statecraft family;
banded, capped, identity-1.0 outside HIDE; the consuming join is TRADE's
(coupling row names both sides — WR-6/WR-8 pointer discipline; TRADE builds
row 14, AFTER us — the seam contract in §5 pre-pins it). Pins: identity
outside HIDE; banded/capped; dark ⇒ trade bytes identical (fence FIRST);
seclusion hum registered. Clock/casting/endings exactly as the volume's
CORRECTED unpack (per-pulse pure read on the posture's own hysteresis; no
endings of its own — IN-6 grades TOLL INCIDENCE). Spine 13: declared-empty
with reason. Spine 14: engine-only, recorded.

### IN-1 — THE MIRROR (`secondOrderBeliefEnabled`)
As the volume, with ONE substrate addition (J-INA-5, vetoable): the derivation's
input set gains a SEVENTH ledgered family — the WR-7b NEGOTIATION PICTURES we
handed across a table (the frozen picture IS "what we showed them," the purest
outbound record in the estate; reader = the envoy errand records' picture
references). The allow-list import fence names it; the K3 exclusion
(observer-side beliefMap reads) is unchanged; guard-the-guard positive control
points at beliefMap itself. New PURE module `secondOrderBelief.js` (~250-line
budget, no state, no writer, no RNG). Everything else stands verbatim: the
closed banded shape; the degradation arm fed ONLY by first-person receipts
(our exposure receipts, our caught-intercept receipts, our own belief record of
their acts); the EMPTY-RECORD negative (UNKNOWN at zero confidence, non-empty
sibling seeded); THE REVERSAL PIN (degradation reachable on a real fixture);
determinism pin; the PHRASE SCAN (no perception verb — "the record suggests,"
never "they believe"); `mirror_shift` registered at mint; dormancy; the
save/load-identical derived-mirror pin. Dossier: "WHAT THE NEIGHBOURS HAVE BEEN
SHOWN" standing lines, DM expansion to the deriving record. Four-fence set +
lit-mutant for the flag; manifest join commit 1. Spine 13: declared-empty with
reason (the mirror reads records, not souls). Spine 14: read-only surface,
recorded engine-only.

### IN-2 — THE LURE (`infoLureEnabled`)
As the volume with the J-INF-14 compliance channels VERBATIM (S22 — the
restraint stands, degree-and-timing + misjudgment-refusal channels, both states
pinned), re-scoped in one place:
- **J-INA-3 (vetoable):** the DEVOTION bait builds IN THIS WAVE on the LIVE
  `faithLabel` axis (S25): the axis-typed record carries axis:'faithLabel',
  asserted/true as categorical labels, contradiction = label-inequality (the
  volume's own §4 spelling — "stated, not discovered"), exposure receipt
  axis-aware. SCARCITY/CONDITIONS stay HARD-BLOCKED on SP-2's trade families
  (S8 — CHANNEL_BELIEF_AXES.trade frozen empty; the endings/envelopes cover
  all baits now so nothing re-opens). Rationale: the substrate premise behind
  the block was measured false in the devotion arm; building it now retires a
  cross-wave dependency at zero new state. VETO restores the volume's full
  block.
- The widening implements §3's axis model + the TWO-CHANNEL RULING (J-INA-2)
  with its source-scan pin; ONE writer, ONE lifecycle, ONE (axis-typed)
  exposure law (J-INF-3); "a non-strength plant exposes by CONTRADICTION on a
  real fixture, not only by age" pinned per axis built.
- All volume pins stand: THE RESISTED LURE; the UNATTRACTIVE BAIT; SPRING
  REACHABILITY under BOTH restraint states; THE BLUFF-VS-BLUFF fixture pinned
  on the expiry arm (EXPOSE_MAX_AGE_TICKS 8 verified live — S5); the
  starvation arm stays honestly deferred; THE NAMED LIE grievance variant
  (eventProse.js is decomposed to 751 effective — the variant lands in the
  prose leaf, VERIFY-AT-BUILD the current symbol home); NO-FATES phrase scan;
  `lure_sprung` registered at mint; dormancy per §2. Blowback composes the
  mouthpiece plane where npcCredibility is lit (R6). Files: informationStatecraft
  head (fold-side axis law), disinformationPlant.js (envelope validator gains
  the axis fields — the law leaf is the right home), brokerageServicesPlant.js
  (commission targets), + a bait-selection leaf (~150-line budget) that aims
  through IN-1's mirror. Spine 13: ENGAGED — willingness/malice at commission,
  posture tilt priced; the wave's Bands entry carries it. Spine 14: the DM
  LIE-COMMISSION VERB lands here (store-action lane + operationRegistry +
  gen:compendium-data — the store-action lifecycle law; typed AI proposal
  driving the same verb; approval-routed), discharging INFO's named verb gap
  from CR-7.

### IN-3 — THE COUNTER-GAME (`counterIntelEnabled`)
As the volume, with R2's consumption corrections: VET composes the BUILT
envoyTestimony ladder + sendTwoDivergence's vetting vocabulary
(VETTING_QUALITIES/VOLUNTEER_LOYALTY_BANDS/VETTING_BASES — closed, live);
SEND-TWO consumes `sendTwoDivergence.js` (its header IS the one-home contract —
the pin imports the reader and a source scan asserts no second implementation);
`suspicionOf` derives (J-INF-2) from live conditions, deception grievances,
caught intercepts, and the mirror gap (degrades dark). The house sub-program
stands whole: the organic exposure producer finally SUPPLIES
projectPatronBindings' `exposed` parameter (S13 — the named gap closes with a
producer AND a surface); PLANT_REFUSALS grows six→SEVEN with `too_hot` (R5 —
the pin asserts seven; QUERY_REFUSALS asserted UNCHANGED); both-sides service
fixture; the witch-hunt counterforce with the no-fates receipt wording verbatim
(§1b's phrase scan bites on fate verbs). Watch panel (sightPostures' first UI
consumer, DM-only fail-closed) + the Houses block per the volume's CORRECTED
dossier clause. All volume pins stand (CLEAN MISS seeded properly; FALSE
ACCUSATION priced; send-two false-positive tolerance; suspicion-never-reads-
truth import pin + token scan + guard-the-guard; deliberate-HIDE reversal;
registration for `false_accusation` + hums; dormancy). Files: a suspicion leaf
(~150), a sweep/verbs leaf (~250), statecraft head (HIDE's response entry
path), brokerageServicesPlant.js (`too_hot`), corruptionWeb-adjacent exposure
producer leaf (~100), two dossier components (≤600 each — component ceiling).
Spine 13: ENGAGED (zeal = posture-derived; paranoid/trusting entry thresholds).
Spine 14: the SWEEP DM verb (same store-action lane discipline as IN-2's verb).

### IN-4 — THE ROAD (couriers, double agents, the race)
As the volume, with the seam re-grounded: SP-1 "extends WR-7a's design"
(DESIGN_FP_SPINE.md:120) and WR-7a/b's errand machinery is BUILT (R2) — the
courier migration still waits on SP-1's GENERALIZED errand spine (the war
errands are envoy-typed), but the interception surface, transit law
(one-week-per-leg — S35), and testimony/divergence cross-pins now point at live
code. The D-3 deposit-courier retirement stays flag-gated
(`intelTradeEnabled` × SP-1's flag), dark path byte-identical, golden-pinned
first (J-INF-4). The race half builds NOW in its degraded arm (arrivals the
existing ledgers stage: armies, exiles, refugee columns, envoy returns — the
last is NEW substrate the volume could not name). RACE_OUTCOMES tokens VERBATIM
(S11 — long forms are receipt PROSE, never tokens). J-INA-4 (the
intelTradeEnabled manifest cure) lands in commit 1. All volume pins stand
(trivial race silent + seeded twin; THE TRUTH THAT ARRIVED TOO LATE — the
jewel; the double agent's detour lateness; the intercepted demand leaving the
misreading standing, cross-pinned with the BUILT envoyInterceptionStage;
JSON-round-trip on courier fixtures — the alias trap; DM-KILL closes `lost`
through the one writer; registration; dormancy). Files: a race-consumer leaf
(~200) reading routeNetworkConsumersRace (its FIRST consumers), arrival-join
read-wiring in the staging ledgers' composers, no chooser edits
(settlementStrategy is AT its 812 baseline — any strategy-side read lands in a
leaf it imports... it does not: NOTHING in IN-4 touches the chooser; recorded).
Spine 13: declared-empty with reason (physics wave). Spine 14: engine-only,
recorded (courier dispatch is SP-1's verb surface).

### IN-5 — THE VOICE (no engine state; routing + composers)
As the volume, J-INF-7 priced honestly: the SEVENTH section grows
HERALD_SECTIONS' frozen six (S16) — the section token, its correspondence rows,
the walker update, and EVERY HERALD_SECTIONS consumer audited (executed
consumer census at build; the count is measured, never assumed). The
`belief_misjudgment` REFILE (J-INF-6) with non-omniscient-infoMode Herald
goldens captured FIRST (§2 — the Full Simulation preset is the named reachable
config). `intel_transfer` STAYS under trade (the :120 authoring ruling stands
unoverturned). The arc composer (pure, no state — a save/load mid-arc
recomposes identically), the hums, the retrospective joins (the SCANDAL join
owned here per CPL-20), the inaction receipt `court_sat_still` (its negative:
LOW-confidence sitting still mints NOTHING), the significance ceiling raised to
'major' for exactly three banded shapes (J-INF-8; today's ceiling 'notable'
verified — S17). Registration discipline restated: this wave registers ONLY
its own mints and re-routes the already-registered. Every new kind gets its
OWN walker file (envoy template — and the envoy walkers now EXIST to copy).
Spine 13: declared-empty (narration). Spine 14: read-only surfaces; recorded.

### IN-6 — THE MEASURE (no flag; the acceptance harness)
As the volume, re-based: the decontamination ratchet's baseline lists
re-measure at build (R8 — never quote 15/7/269/68 from the volume); the
earned-classification walker (bare `news` token REMOVED from
BEHAVIORAL_MOVER_FAMILIES.knowledge, classification earned by registered
own-vocabulary tokens — scripts/audit/behavioral-observation.mjs:60 is the
edit site); the display-safe banded truth provider (J-INF-11) completes
BeliefDivergenceBand's documented v1 follow-up (S27); the lit/dark
differential instrument the certification row asks for by name (S20 — the row
text is the spec); ALL the envelopes of the volume's CORRECTED list, each
cross-checked mechanically against every §4 Endings entry (no promised
envelope unauthored), each with a tuning-constant mutant negative that REDS
it; lit/dark pair byte-identical at tick 0. Certification rows for all four
flags name their dispositive literals. Spine 13/14: declared-empty
(instrumentation), recorded.

**Collision map (all waves):** the tree is LIVE — lanes WW-A/WW-B worked
sovereignty/war files within the last day (HEAD commits) and WR-10 wiring is
owner-granted in-flight; before EVERY commit: fresh `git status` + re-read of
any shared file (concurrent-lane silent-revert hazard — re-grep old names
after renames). File-level collisions to watch: envoyPulse.js +
envoyInterceptionStage.js (WAR family owns; IN-0a/IN-4 touch — coordinate via
chair queue rows); brokerageServicesPlant.js (IN-0a, IN-2, IN-3 all touch —
serialize within IN); simulationRules.js manifest lines (IN-1..4 + any war
lane joining keys — the walker's one-key-delta pin makes races loud);
heraldRouting.js (IN-5 vs any lane minting kinds); knowledgeLaneEvidence.js +
behavioral-observation.mjs (IN-6 vs certification lanes). Cross-volume:
GRAMMAR (builds row 12, FIRST) may touch peaceTerms leaves — IN-0c rebases on
its landing; TRADE (row 14) consumes IN-0d's export; FAITH consumes the
devotion bait's tension feed; POP consumes the wealth bait when SP-2 lands.
Any lane touching edge-bundled inputs rebuilds edge-shared (the five-bundle
law) — none of IN's files are bundle inputs as of this measure, VERIFY-AT-BUILD.

---

## §5 SEAM CONTRACTS

**Honored (already pinned by others — IN must not break, and names the tripwires):**
1. **The one-home divergence reader** — sendTwoDivergence.js's header contract
   (J-INF-15 discharged: WR-7d built first). IN-3 imports; its pin asserts the
   import AND a source scan proves no second reader exists. Tripwire: the scan
   itself (a fork reds it).
2. **PLANT_WIRING's landed contract string** (brokerageServicesPlant.js:72) +
   the envelope validator boundary (disinformationPlant.commissionedPlantAt) —
   IN-0a feeds THROUGH the validator, never around it; the forged-envelope
   negative is already the leaf's law (total-on-garbage).
3. **The testimony one-spelling pin** — TESTIMONY_LADDER == brokerageStamps.
   RELIABILITY_LADDER (equality-pinned upstream). IN-3's vet composes the
   ladder; it never re-spells it.
4. **The WR-10/TR-5 sovereignty seam** — catalogGrewSinceWr10()
   (sovereigntyBundle.js:166). IN touches NO sovereignty catalog; recorded so
   no IN wave grows it by accident (the tripwire fires if anyone does).
5. **The D-3 single-writer transfer contract** — generosity OWNS + prunes
   intelTransfers; statecraft reads (spatialUsage.js:268 + the consume-arm
   comment). IN-4's retirement honors it; IN-1's mirror reads it read-only.
6. **The engine-gated manifest walker contract** — membership = measured real
   gate + certification row in the same commit (subsystemRowsVirtual.js:36).

**Pre-pinned by IN toward unbuilt neighbors (the TR-5 pattern — pinned from
BOTH sides at build time, with a named tripwire):**
1. **secrecyTradeFactorOf → TRADE (TR rows):** IN-0d exports the banded read +
   pins identity-1.0-outside-HIDE and band/cap; the coupling row names the
   consuming join; tripwire `secrecyTradeContractChangedSinceIn0d()` (shape
   census over the export's band vocabulary) so TRADE's build learns if the
   contract moved.
2. **The axis vocabulary → SP-2's trade families:** IN-2 closes
   axis ∈ {strengthBand, faithLabel} + a DECLARED-EMPTY extension point for
   the SP-2 families; tripwire: an axis-family census pin
   (`axisFamiliesGrewSinceIn2()`) reds when SP-2 lands a family so the
   scarcity/conditions baits' deferral is re-opened deliberately, never
   silently.
3. **The deposit-courier retirement → SP-1:** IN-4 pins the dark arm
   byte-identical AND the lit-arm contract (typed covert/commercial errand;
   the K.2 decaying snapshot as cargo); tripwire: the retirement pin reads
   SP-1's flag by name, so SP-1's landing turns the pinned degraded arm red
   until the errand arm is wired — the deferral cannot ghost.
4. **The mirror read → GRAMMAR's negotiation posture:** IN-1 freezes
   mirrorOf's returned shape (closed keys, banded) with a shape pin; GRAMMAR
   consumes by that pin (one reader shape, two programs).
5. **The knowledge desk → every volume's knowledge-native kinds:** IN-5's desk
   accepts by REGISTRATION only (mint-time rule); the earned-classification
   walker (IN-6) is the standing tripwire that a foreign lane's new kind
   cannot ride the residual bucket in.

---

## §6 OPEN CHAIR QUESTIONS (max 4, each with the architect's recommendation)

**Q1 — IN-0a's envelope transport under the zero-pulse-edit law.** The fold
wants `commissionedPlants` at two heads the banked pulse mouths call without
it (R1). RECOMMENDATION: the primary road — each consumer reads the PRIOR
tick's applied brokerage_plant events off the existing applied-event record at
its OWN head (zero new keys, zero kernel edits, law-M-true one-week lag);
VERIFY-AT-BUILD the metadata retention; fallback = the pendingPlants
conditional deposit under the D-3 contract (ONE drop-when-empty key —
§3's Q1-contingent block); if both fail, STOP-and-report for a chair-signed
kernel seam. Vetoable either way; the wave does not start until this is ruled.

**Q2 — Reporting vs adopting the war family's file touches.** IN-0a (envoy
head-read) and IN-4 (interception cross-pins) touch WAR-owned files while war
lanes are live. RECOMMENDATION: IN lands read-only consumers behind IN flags
with the war chair's queue row per touch (the WR-6/WR-8 pointer discipline),
never a behavioral edit to a war path; any needed war-side change is a
reported seam, built by the war lane. Alternative (rejected): forking IN-side
copies — the defect the one-home contracts exist to prevent.

**Q3 — intelTradeEnabled's invisible-key cure (J-INA-4).** RECOMMENDATION:
join ENGINE_GATED_VIRTUAL_RULE_KEYS + certification row in IN-4 commit 1 (it
already has real gate reads — the walker's own membership test). Alternative:
declared-false in the Full Simulation preset only (weaker; leaves the manifest
lying about a measured gate). Veto holds the status quo and records why an
invisible key is acceptable.

**Q4 — The devotion-bait re-scope (J-INA-3).** RECOMMENDATION: build the
faithLabel devotion bait in IN-2 (substrate measured live — S25); keep
scarcity/conditions SP-2-blocked; FAITH's sacred-tension consumer remains
FAITH's wave (the bait writes the axis; the jaws are theirs). Veto restores
the volume's full hard-block and the bait waits for SP-2 wholesale.

---

## §7 WHAT THIS COMPILATION DOES NOT REOPEN
The volume's §6 judgment blocks stand except as amended here: J-INF-15 is
DISCHARGED (R2 — consumed, not contingent); J-INF-14 verified standing (S22);
J-INF-17 verified standing (S14); J-INA-1..5 are this document's additions
(Q1's transport, the two-channel ruling, the devotion re-scope, the manifest
cure, the mirror's seventh input). The tuning surface (§7 of the volume) and
the Herald sentence contract (§8) bind unchanged — with every numeric baseline
re-measured at build per R8. Sequencing per the volume's §9 and SOL_QUEUE row
13; every wave DARK; lighting is owner-held at the signed soak. The war
volume's §10 implementer protocol binds verbatim, plus this tree's standing
laws: check:tail only, isolation re-runs under load, pathspec commits,
byte-scan every authored file, cp-backup mutants with cmp-exact restores,
STOP-and-report as a SUCCESS mode.
