---
name: spatial-engine-direction
description: "Owner's major design direction (2026-07-11) — make the realm map a first-class ENGINE input (geometry governs the sim), not just a picture. Its own program; depends on the Realm surfaces."
metadata: 
  node_type: memory
  type: project
  originSessionId: 95cca3f6-d313-4fe1-91f6-b4b3a29fb5ef
---

Owner proposal (2026-07-11): add a SPATIAL DIMENSION to the whole simulation, dependent
on the realm map. Today the engine is ASPATIAL — neighbors are an abstract graph
(regionalGraph edges); trade/faith/war/cascade propagate topologically with no distance
or latency. The fantasy-map generator already computes positions / terrain / height for
placed+canonized settlements, but that is DISPLAY-only. Make it feed the engine.

**Geometry governs:**
- Trade RATE + primary/secondary/tertiary neighbor tiers (by path cost, not just declared
  adjacency); trade gated THROUGH intermediary settlements' "gates" unless the DM forces a road.
- Amplifies/deters: trade, religion conversion/spread, military travel rate, news/information
  speed. Distance + terrain + elevation are the modifiers.
- INFORMATION/CASCADE LATENCY: an event a week ago may not have reached the far side of the
  map yet, but will, via the perpetuation/cascade chain. A propagation FRONT expands over ticks.
- ARMY TRAVEL TIME (weeks) between settlements; two hostile armies can COLLIDE mid-transit
  (field battle, emulate it); logistics narrows where armies go + when to replenish/attack.
- ATTRITION on any army/trade passing through embattled/besieged/hostile regions.
- ARMY COMBAT: weighted PRNG over readiness/strength/size/equipment(supplyQuality)/funding/etc.,
  with CEILINGS + GATES so improbable upsets are bounded (no "hand of miracle" too often).
- DM OVERRIDE: force a road/trade route for a dynamic map; else even declared neighbors route
  through gates.

**Architect's governing-theory constraints (the program's spine must survive):**
- DETERMINISM: the spatial graph (distances, least-cost routes over a terrain cost field, gates,
  neighbor tiers) must be a PURE, seeded function of the canonized map state (positions +
  terrain + heightmap). Same map ⇒ same graph ⇒ byte-identical sim. Stable tie-breaking in A*.
- ACTIVATION SEAM (owner, explicit): the spatial layer takes effect ONLY AFTER THE MAP IS
  CANONIZED. Map-canonize is the discrete on-switch (a realm-level canon event), exactly like
  the latent-pantheon activation seam. Before canonize — drafts, free/anon, placed-but-not-
  canonized — everything is ASPATIAL, byte-identical to today. This is the crisp dormancy
  boundary: no canon map ⇒ no spatial graph ⇒ no routes/latency/army-transit ⇒ prior bytes.
- DORMANCY/ADDITIVITY: spatial modulation applies only within a canonized realm. The spatial
  graph is DERIVED DETERMINISTICALLY from the canon map state at canonize-time and re-derived
  when the DM adds settlements / forces a road / re-canonizes (stable + cached between events).
  In-transit ledgers (propagation outbox with arrival ticks; army-transit positions) are
  conditionally-materialized (the conquestFeeds/institutionTolerance read-last/write-next
  pattern) — empty until something is actually moving.
- PREMIUM: the world map = the Realm = Cartographer. So the spatial layer is inherently premium;
  free/anon = aspatial. Tier never touches generation (unchanged).
- TEMPORAL: travel/latency in WEEKS (4-4-5 calendar). Advancing time moves armies + propagation
  fronts. "A week-old event hasn't crossed the map" falls out naturally when travel > 1 wk.
- PERFORMANCE: routes O(N²) shortest-paths computed ONCE on canonize/place/force-road, CACHED;
  per-tick just advances the in-transit ledgers (cheap).
- CONVERGENCE POINT: the combat-resolution module is where W-C1 (readiness/rust/supplyQuality),
  W-C2 (conquest/mercenary), funding, size finally resolve into a single bounded weighted-PRNG
  battle outcome — the natural completion of the war system.

**Owner additions (2026-07-11, round 2) — EMBATTLED REGIONS + routing risk + imported maps:**
- EMBATTLED REGION = a first-class spatial state. A settlement/region becomes embattled via a
  RAMP when recently occupied, under siege, freshly through a PYRRHIC-scale war effort, or with
  high criminal activity — where appropriate. COUNTERFORCE: high internal security + reduced
  crime graduate a region back OUT of embattled. (Ties to the existing occupation/siege/
  martial-readiness/corruption systems as the ramp inputs; the crime↔security counterforce
  mirrors W-C3 institutional/moral machinery.)
- ROUTING = CHEAP vs SAFE tradeoff. An embattled settlement/region on a route is treated as
  ROUGH TERRAIN / UNSAFE PASSAGE. Trade, religious conversion, and military movement each run a
  RISK ASSESSMENT over candidate routes: a longer path may be SAFER; a cheaper (shorter) path
  may be MORE DANGEROUS → costs more TIME, inflicts ATTRITION, and for TRADE sporadically (but
  NOT to a significant degree) drops a shipment to banditry / wild beasts. This is the route
  cost-field's "danger" term made a decision, not just a modifier: each mover weights cost vs
  safety by its own risk tolerance (recall the alignment/rust fidelity: lawful/seasoned reads
  the risk true, chaotic/rusty mis-weights).
- MILITARY RETREAT / MOVEMENT THROUGH ENEMY TERRITORY. If a defeated or retreating army's route
  options include passing through ENEMY territory, that enters its strategy risk assessment. If
  the ONLY route is through enemy territory, treat that route as EMBATTLED for THAT SPECIFIC
  army (per-mover embattlement — the danger is relative to who's moving, not just the terrain).
- IMPORTED MAP IMAGES (vs native generation). When a user imports a map image: the heightmap /
  overlay / biome editors flatten the whole map to a FLAT PLAIN and become a TRANSPARENT OVERLAY
  the user adjusts (texture) to resemble their imported map. After editing, the heightmap/overlay
  go INVISIBLE unless drawn on again, so the imported image takes visual priority. IMPLICATION
  for the engine: with an imported (flat) map, the spatial cost-field must derive from the
  USER-DRAWN overlay/annotations (roads, biomes, terrain the user paints), NOT a generated
  heightmap — the DM authors the geography the sim then respects. Determinism holds: the spatial
  graph derives from whatever the canonized map state persists (generated heightmap OR user
  overlay), purely and reproducibly.

**Owner additions (2026-07-11, round 3) — TRADE AS A PHYSICAL SUPPLY NETWORK + siege redefined:**
- MULTI-SOURCE + STOCKPILE, so impairment is STARVATION, not chain-incompleteness. An input
  (iron ore is the example, generalizes to all) can come from MULTIPLE producers / directions.
  A single missed shipment is absorbed (other sources + stockpile buffer). A NEW, DISTINCT
  impairment kind — SUPPLY-STARVED — triggers ONLY when the input is unavailable for an EXTENDED
  period (all sources cut AND stockpile depleted), e.g. a road closed by siege / embattled
  region. It is TEMPORARY: it lifts the moment a shipment arrives. Distinct from underfunding/
  corruption impairment; the CAUSAL RECEIPT must explain WHY to the DM ("the smithy starves:
  the iron road is cut under the siege of X; no shipment in N weeks"). Resolution rides the
  W-C5 cause-lifecycle (cause resolves ⇒ impairment lifts). Builds on existing foodStockpile
  (buffer) + supplyCompleteness + WAR_SUPPLY_CHAINS, not a replacement.
- PER-INSTITUTION TRADE + INVISIBLE CARAVANS. When primary/secondary producers are established,
  trade is established PER CONSUMING INSTITUTION that requires the input. Each active supply link
  carries INVISIBLE moving pieces (caravans/shipments) — an in-transit ledger (the propagation-
  outbox pattern) with arrival ticks. NOT DM-facing (a map of moving dots is too noisy) — the
  caravans are ENGINE state that surfaces ONLY as hooks/consequences (a loss, an interception,
  an arrival that lifts a starvation). Must be ABSTRACTED/aggregated (one shipment record per
  active link advancing per tick), conditionally-materialized, bounded — not per-wagon.
- INTERCEPTION + SIEGE-AS-INTERDICTION. A caravan routed THROUGH a town that is OCCUPIED or in a
  HOSTILE relationship with the caravan's FINAL DESTINATION is CUT OFF: the intermediary seizes
  the goods and denies them to the destination (seized goods can feed the interceptor as loot,
  gated by W-C2 conscience). SIEGE IS REDEFINED as exactly this: the besieger interdicts ALL
  routes into the besieged settlement ⇒ its consuming institutions starve as stockpiles deplete
  ⇒ cascading supply-starved impairments over weeks ⇒ the settlement weakens/falls. Siege becomes
  a SUPPLY mechanic (starvation + time), not a hitpoint bar — unifying siege / blockade / embargo /
  interception under ONE model: control of the route gates (the earlier "gates" mechanic). Total
  gate-control around one settlement = siege; key-route control = blockade; opportunistic gate
  seizure = interception.
- ARCHITECTURE NOTE: the region's embattled level IS the route's danger term IS (at the extreme)
  a siege's interdiction — one spatial state read at three intensities. Determinism/dormancy hold:
  caravans + starvation derive from canonized map + established trade links + seeded per-decision
  rolls (the sporadic banditry loss); no established trade / no map ⇒ no caravans ⇒ aspatial as
  today. Performance risk: the caravan ledger must be aggregate + bounded, or per-institution ×
  per-input × multi-source explodes.

**GROUNDING VERDICT (2026-07-11, workflow wf_d0c0299d-226 — 6 ground + 5 critics; now PART II
of the design doc):** vision coherent, seams exist, but NOT buildable as written. THE gating
fact: geometry is NOT persisted engine-readable — it lives ONLY in the opaque ~1MB fmgSnapshot
blob (nothing in src/ parses it); the only routing code (sf-bridge.js:617-851) is iframe/async/
20s-timeout/MAX_ITER-capped/float — wrong layer, wrong contract. So §1's "pure seeded function
of canon map state ⇒ byte-identical" is UNSATISFIABLE today. Determinism/dormancy/cascade/
completeness all RED, all fixable. KEYSTONE MOVE (fixes determinism+dormancy+premium at once):
freeze an INTEGER spatial digest ONCE at the EXISTING canonize seam (canonizeCampaignWorld,
campaignWorldPulseSlice.js:187, beside extractRegionalGraphSnapshot), port the router into a
pure seeded kernel, persist it immutable in worldState, advance READS it (tier-blind, byte-
identical). Gate on a NEW marker (worldState.spatialCanonVersion) behind an entitlement read —
NOT the existing canonizedAt (already true for the whole installed base → would retro-light it).
Perf: use ONE multi-source Dijkstra (Voronoi partition), not all-pairs A*; per-tick RE-SCORES
cached k-routes, never re-pathfinds. Minimal v1: marker+entitled-canonize → frozen digest →
distance/latency modulation of what already propagates; richer layers each a fenced wave after
(migration-mortality + army-combat highest-risk, own soaks).

**4 OWNER DECISIONS — SETTLED 2026-07-11 (BINDING, do not re-litigate; owner delegated 1/3/4 to
architect judgment, decided 2 explicitly):**
1. COST→WEEKS: primary hop ≈1 wk, secondary ≈2-3, tertiary ≈4+, map diameter ≈1 season (~13 wk);
   median hop ~1-2 wk × readiness/terrain mult. Retunable in propagation soak.
2. CULTURE-DISTANCE (owner's explicit clarification): NOT ethnographic (NOT germanic-vs-east-asian).
   It's a DERIVED behavioral/economic SIMILARITY composite over existing state — faith proximity
   (deity axes / share cosine) + alignment proximity + economy/ways-of-life (profile/industry/
   wealth/trade-access) + recent-activity & trade ties. ENDOGENOUS, derived-not-rolled. ONE pure
   selector cultureDistance(a,b); NO new persisted culture field. Both §4c least-drift migration &
   §4d contraband gate read it.
3. IMPORTED MAPS: option (b) — v1 spatial only on GENERATED maps; imported stay aspatial (byte-
   identical) until a real authoring layer later. Marker not offered for imported in v1.
4. COST-FIELD: canonize-time ONE-SHOT iframe extraction → frozen quantized-integer digest in
   worldState (immutable, goldens pin it). No headless reconstructor for v1.

**Owner additions (2026-07-11, round 7) — movement modalities + governance drift:**
- MOVEMENT MODALITIES (exceptions on the base terrestrial cost field; frozen at canonize; magic/
  tech/premium-gated; each keeps a counterforce):
  • ISOLATED SETTLEMENTS = DISCONNECTION, emergent from the cost field (infinite/prohibitive land
    route; island/fastness/disconnected component). Consequences: siege-RESISTANT by land, chronic
    TRADE-STARVED, faith/news LAGGED/never-reached, migration-TRAPPED (higher origin-mortality or
    forced sea). Counterforce = sea/air/teleport. Make it a legible derived state.
  • TELEPORT CIRCLES = zero-cost/zero-latency/gate-BYPASSING edge between 2 settlements (magic-
    gated → none in magic-opt-out world; premium; rare). Collapses distance for faith/news/bounded
    trade. Counterforces: SEIZABLE chokepoint (war objective), THROUGHPUT-BOUNDED (people/messages/
    high-value goods, NOT armies/bulk), single point of failure. A besieged settlement w/ a circle
    gets the §7 trickle magically. Authored edge in the digest → deterministic.
  • AIRSHIPS = a PARALLEL aerial cost field (straight-line, terrain-ignoring, gate-bypassing; time
    ∝ distance, faster than land; risks: weather, aerial interception, range, LOWER volume). Tech/
    magic/premium-gated per-settlement flag. DEFEATS land interdiction → §7 siege now needs "land
    AND air"; total interdiction requires AIR SUPERIORITY (counterforce = aerial interception).
  • UNIFYING: modifiers on the ONE base cost field; determinism + dormancy + magic-opt-out +
    premium all hold.
- GOVERNANCE DRIFT = a 5TH cultureDistance component (owner: "culture should include drift from
  the governing power; some are more similar than others; map it out"). Grounded in OUR existing
  powerStructure.governanceType / governingName / previousGovernments. TWO sub-terms:
  (i) REGIME-TYPE distance over 3 AXES (works for any governanceType string, no pair table):
    CONCENTRATION (autocratic→oligarchic→popular→none), LEGITIMACY SOURCE (divine/arcane/hereditary/
    martial/mercantile/popular/tribal), RULE-OF-LAW (bureaucratic→personalist→lawless). e.g. two
    theocracies≈close; theocracy vs magocracy=same concentration+adjacent legitimacy=moderately
    close; monarchy vs junta=same concentration diff legitimacy; merchant-republic vs plutocracy
    close; anarchy far from all concentrated.
  (ii) GOVERNING-POWER IDENTITY: same overlord/faction (governingName)→close; rival→distant;
    HOSTILE rival→distant AND feeds §4c hostility (double push). Wires CONQUEST→culture: A conquers
    B ⇒ B.governingName→A ⇒ B drifts toward A's governance over weeks (W-C2 coupling);
    previousGovernments gives the drift memory.
- NOTE: geometry FREEZES at canonize but CULTURE terms (incl. governance) are LIVE reads — culture
  must evolve as regimes/faith/trade change; only the cost field is immutable. cultureDistance is a
  per-eval selector; the frozen digest holds only distances/routes/gates.

**Owner additions (2026-07-11, round 8) — RUMORS & NEWS (the information/telephone layer):**
- §3 propagation given NARRATIVE CONTENT + FIDELITY DECAY. Settlement-level "Rumors & News" tab in
  the World tab. THE most DM-usable output: "what players have heard" vs "what actually happened,"
  spatially grounded, unreliability pre-computed + causally justified.
- LOOP: event at site-zero → SIGNIFICANCE gate (magnitude×drama; doubles as the review's event-
  triage — only signal travels, noise stays local) → next trade caravan CARRIES it (§4 in-transit
  ledger, now w/ news payload) → INFECTS next settlement's mill → re-emits hop-by-hop over sparse
  trade graph (already-reached guard; latency = round-6 cost→weeks; distant = late) → populates the
  dossier tab, completeness ∝ hop-distance.
- FIDELITY DECAY (telephone): (1) COMPLETENESS decay (details drop per hop; hops 1-3≈complete, far=
  "a battle near X" only); (2) DISTORTION/mutation (names garble/swap, magnitude in/deflates, cause
  reattributed, winner/loser flips = "way off base"); (3) CROSS-CONFIRMATION corrects — same event
  via MULTIPLE routes = higher fidelity ⇒ the §4b ENTREPÔT is the best-informed rumor CLEARINGHOUSE;
  end-of-single-chain = most degraded.
- DISTORTION OPERATORS = every other system: FAITH (reframe in deity's lens), POLITICAL/allegiance
  (spin toward governing power — round7), CULTURE-DISTANCE (farther culture = more garble),
  HOSTILITY (adversarial distortion re enemies), RECEIVER fidelity (scholarship/library preserve;
  corruption/low-legitimacy distort; spy/intel reads through). Same event → different STORIES at
  different settlements.
- "NEWS" vs "RUMOR" = two ends of the fidelity spectrum (fresh/close/confirmed=News; stale/distant/
  single-chain/distorted=Rumor). One system, the tab name IS the axis.
- DM/PLAYER ASYMMETRY = the product feature, MIRRORS FAITH SEAM: player-facing = rumor as believed
  (shareable/lower-tier); DM-only premium reveal = ground truth + provenance (hops/route/what
  mutated) + confidence. Free/anon never get omniscient view.
- TIME: rumors live/fade; later arrival SUPERSEDES/CORRECTS earlier (correction propagates behind;
  W-C5 resolution = follow-up rumor); ENTRENCHMENT — uncorrected false first-arrival becomes locally
  "known" (persistent misconception, esp. isolated/distant/low-fidelity). Feature.
- ISOLATION (round7): NO TRADE ⇒ NO RUMOR MILL (owner explicit) — informationally DARK, 5th
  isolation consequence; besieged settlement goes progressively dark as routes cut. TELEPORT circle
  = instant HIGH-fidelity (0 hops); AIRSHIP = fast but still hops.
- DETERMINISM (seeded forks rumor:eventId:carrier:hop / distort:eventId:settlement; hop-by-hop;
  sorted mutation), DORMANCY (no map/trade ⇒ local events only, today's bytes; behind spatial-canon
  marker; expiry+significance bound the ledger), ENDOGENEITY (world-driven, party RECEIVES not
  drives; party-as-carrier = future extension, core stays party-independent).

**Owner additions (2026-07-11, round 9) — MULTI-CHANNEL CARRIERS for Rumors & News:**
Info rides a UNION of channel-topologies; each has own GRAPH/SPEED/FIDELITY/BIAS(=distortion op)/
NEWS-TYPE affinity. Tab aggregates all; MIX shifts with circumstance. Trade dominant only in peace.
- TRADE (dominant peacetime): trade graph, broad, moderate fidelity (telephone), merchant bias, commercial+general.
- ARMIES (wartime): directed army movement, martial bias, FRONT news + own propaganda; brings war to peaceful regions.
- REFUGEES (round5): migration routes, ARE the news of origin's collapse, distortion→CATASTROPHE (traumatized/exaggerated).
- FAITH NETWORKS: religion graph (co-religionists, SEPARATE topology, crosses political/trade lines), faith bias, religious news (miracle/heresy/schism/W-C4 deity activation).
- COURIERS: point-to-point TARGETED, faster, HIGH fidelity (sealed letter resists decay), low distortion, but INTERCEPTABLE (captured = no arrival + intel); institutional/premium.
- CRIMINALS (round4/6/7 smuggle net): underground, crosses gates that block official trade, illicit news + spy intel; public=low-fi whispers but network may hold HIGH-fi intelligence.
- MAGIC: teleport (round7 instant/hi-fi/0-hop) + scrying/sending; fastest+most accurate where it exists, targeted, magic-gated (none in opt-out world), rare/premium/limited reach.
- WARTIME↔PEACE SHIFT (payoff): peace=trade bulk; routes cut (siege/embattlement) ⇒ news shifts to
  armies/refugees/couriers/smugglers/magic. Besieged settlement's info DIET changes — dark to TRADE,
  not to the underground = round-8 "goes dark" made precise. CHANNEL DIVERSITY *is* the §4f cross-
  confirmation (entrepôt hears via many channels → triangulates; one-channel town can't).
- NEWS-TYPE AFFINITY: economic→trade, military→armies/couriers, disaster→refugees, religious→faith,
  diplomatic→couriers, illicit→criminals, any-fast→magic/couriers. Each channel blind to news it doesn't carry.

**Owner additions (2026-07-11, round 10) — BELIEF-DRIVEN ACTION (info drives decisions; fog of war):**
Rounds 8-9 produce info; round 10 makes settlements ACT on it imperfectly → actions = new info. World
stops being OMNISCIENT; each settlement acts on BELIEFS; gap between belief↔truth = war/tragedy/morality.
- MASTER LOOP: event→rumor→BELIEFS→DECISION(weighted,PRNG)→new event→…
- CORE PRIMITIVE = per-settlement BELIEF MAP (its possibly-wrong model of others' readiness/alignment/
  faith/ALLIANCES/intentions; bounded to its info-neighbourhood; derived from propagation; §4f-distorted).
  Round 10's biggest new structure. DM sees truth + each belief map + DIVERGENCE (watch misunderstandings brew).
- WAR-DECISION = THREAT ASSESSMENT over BELIEFS not truth. Ex A: hostile A ramps; B may not react by
  temperament UNTIL it hears a rumor A targets it/an ally → B ramps, maybe PREEMPTIVE STRIKE. Ex B: B
  marches on A who never heard (no channel), didn't ramp, weak defense → SIEGE before A knew (info-
  starvation = exploitable military vulnerability). Weights: temperament/dynamics/history/cultureDrift/
  alignment/readiness over BELIEVED threat × rumor CONFIDENCE. Ladder: nothing→ramp→preempt→defend-ally.
  MISJUDGMENT first-class, PRNG scaled INVERSELY by confidence (low-fi info→wrong call). A FALSE rumor
  can start a REAL war. Info QUALITY→decision QUALITY (entrepôt acts soundly; backwater blunders).
- INFO-ASYMMETRY EXPLOITS (speed vs info RACE): SURPRISE (strike before target hears — army outruns its
  own mobilization rumor); ROAD-BLOCK (army blocks trade/rumors BEHIND it — suppresses the warning;
  generalizes §7 interception to INFO); TRADE BLACKOUT (block all in/out to deny enemy intel / deny own
  people destabilizing news). Blackout+road-block+fast army = win-the-race play.
- STATE-CHANGE NEWS (changes of NATURE, can be WRONG): religion/alignment changes propagate (distorted:
  "converted"→"fallen to dark cult") → belief update → cultureDistance/hostility shift. ALLIANCE state is
  itself propagated + can be STALE/FALSE. ALLY CONFUSION: ally-defends-ahead (A rides to rescue oblivious/
  startled B); WRONG INTERPRETATION (A's defensive march misread as aggression by hostile/distant C → C
  preempts → cascading misread war nobody intended — richest emergent drama).
- MORAL DRIFT from unjust action (architect-delegated): instigating while IN THE WRONG (false rumor,
  innocent target) → ALIGNMENT DRIFT, sharpest for lawful-good; scales w/ WHO (innocent/weak/ally worse)
  + PAST RELATIONS (former friend worse). Wires W-C2 conscience + corruption + W-C5 (unjust war=a CAUSE→
  drift or reckoning/reform). Fog of war MORALLY LOADED: good settlement deceived into unjust war pays.
- TELEPORT-TRADE CONSTRAINT (round-7 refinement): isolated circle settlement trades ONLY via circle +
  ONLY w/ NON-HOSTILE other circle-holders. ≥1 friendly ⇒ gate-bypassing bloc; all hostile ⇒ fully cut
  off (circle=dead weight). Teleport net = CLIQUE OF THE WILLING (magical trade+intel bloc, diplomacy-bounded).
- DET/ENDO/DORMANCY: seeded PRNG over beliefs (deterministic) ⇒ same seed=same misjudgments=same wars;
  party OBSERVES not drives (party-as-carrier=future); no spatial info layer ⇒ no belief maps ⇒ today's
  decision model. ADDITIVE, downstream of §4f+round9 (build rumor mill FIRST, then this).

**Owner additions (2026-07-11, round 11) — teleport-bloc siege economics + ally intel-sharing/alignment/betrayal:**
- TELEPORT-BLOC ECONOMICS: a circle link is SIEGE-PROOF (not a land route — besieger can't cut the EDGE,
  only STARVE the NODE). Besieged circle-holder still trades/shares w/ bloc, but BOTH suffer (its own
  land-trade cut ⇒ contributes less; dependent partner gets less). = round-3 supply net on an UN-
  INTERDICTABLE topology; node-starvation the ONLY attack vector. A NETWORK of isolated circle-holders
  whose outputs cover each other's inputs = SELF-SUFFICIENT + land-siege-immune (legit strategy). Well-
  composed bloc resilient; ill-composed (all lean on 1 land-trader) collapses when that member sieged.
  Bloc prosperity bounded by collective production, not roads.
- ALLY INTEL-SHARING (deliberate channel, DISTINCT from ambient §4f telephone): allies ACTIVELY share
  HIGH-CONFIDENCE intel at PRESERVED fidelity (matters of importance/national security) — directed
  (couriers/circles, not hop-degraded), TRUSTED (faithful relay), CONFIDENCE-GATED (only high-conf shared
  as actionable). Well-allied LAWFUL bloc = SUPERIOR collective intel (belief maps converge to TRUTH ⇒
  sounder decisions, misjudgment falls).
- ALIGNMENT GOVERNS HANDLING (fills §4f passive distortion w/ AGENCY; 2-axis onto derived settlement
  alignment): LAW↔CHAOS = FIDELITY (lawful MINIMIZES mutation, faithful relay, reduces telephone
  weathering; chaotic UNPREDICTABLE — embellish/garble/sit/act-rash, adds noise). GOOD↔EVIL = HONESTY/
  INTENT (good shares TRUE for mutual benefit; evil DISTORTS for SELF-benefit — strategic directed
  deception, feeds allies FALSE intel, intent not noise).
- BETRAYAL/COMPROMISED-ALLY LEAK: share based on who BELIEVED ally (§4g belief map) not truly. Presumed
  ally that TURNED/compromised = LEAK → relays your high-conf intel to real ENEMY, tips a war. Intel
  security real (cautious/lawful VETS; naive/trusting leaks). Wires belief-map alliance accuracy +
  corruption/compromise system.
- DARK EMERGENT (deepest moral↔info coupling): EVIL WEAPONIZES the layer — feeds FALSE high-conf intel
  to lawful-good neighbour ⇒ it acts ⇒ attacks unjustly ⇒ DRIFTS toward manipulator's alignment (§4g).
  Evil corrupts good THROUGH information; engineers the tragedy of the deceived-good actor, and profits.
- SUBSTRATE: makes absent SETTLEMENT-ALIGNMENT field (PART III III.4-1) TRIPLY required (culture + moral
  drift + info-handling) → reinforces DERIVE endogenously (governance + faith + recent acts).
- RISK ASSESSMENT = THE UNIFYING FACULTY (owner: "this all goes into risk assessment"). Every decision
  already runs a risk assessment (routing §2/§6, army strategy §5, war threat §4g). Info (rounds 8-11) is
  NOT parallel — it's the INPUT-QUALITY dimension. SAME alignment faculty governs physical risk tolerance
  (§2/§6 lawful-reads-true) AND epistemic weighting (lawful-faithful/chaotic-erratic/evil-selfserving).

**Owner additions (2026-07-11, round 12) — army info nodes, reinforcements, info-is-PRIOR, info-quality vector:**
- INFO IS PRIOR TO RISK ASSESSMENT (strict ordering; sharpens round-11): the INFORMATION NETWORK comes
  FIRST + constructs the believed picture of EVERYTHING (military might, siege fortifications, supply
  strength/resilience, alliances, trades) — none known as ground truth. ONLY THEN risk assessment runs on
  the available/believed picture. NO ground-truth input to any decision; every object input is belief-
  sourced carrying the quality vector. Corrects the round-11 "two layers" framing (not object-over-truth +
  epistemic; ALL inputs belief-sourced, epistemic quality is a property OF each).
- DEPLOYED ARMIES = mobile info nodes: gather intel from each settlement en route + directed stream from
  HOME (couriers, stopped caravans, reinforcements) updating best-course-of-action by intel quality. Far-
  from-home + couriers intercepted (§4g road-block) + hostile territory = INFO-STARVED → mis-assess → walk
  into traps. Blinding enemy army (cut couriers) = objective. REINFORCEMENTS = army-in-transit (§5): travel
  roads + embattled/hostile by choice (§6 cheap-vs-safe), take ATTRITION, meet enemy en route = BATTLE/
  SKIRMISH. Reinforcement+courier+caravan = army's supply+info UMBILICAL to home; sever = starve both.
- INFO-QUALITY VECTOR (owner: NOT payload+one fidelity scalar). ALL 6 AXES CONFIRMED (owner PROMOTED the
  architect's +3 on 2026-07-11), in 3 groups:
  CONTENT: COMPLETENESS (how much remains), ACCURACY (retained facts correct?), FRAMING (how interpreted),
    TIMELINESS/RECENCY (age — true-when-sent stale-now as world moves; THE biggest add, orthogonal, deadliest
    failure = a TRUE fact weeks out of date; turns §3 latency from delay into RISK; critical for armies on
    stale positions).
  TRUST (feeds §4g weighting): PROVENANCE/CREDIBILITY (which source/carrier + trust — round-11; packet carries
    source), CORROBORATION/CONFIDENCE (independent-source agreement — §4f cross-confirm; separable from
    accuracy — can be confidently wrong; receiver's P(accurate)).
  STRATEGIC (world-level, not per-packet): EXCLUSIVITY/REACH (who else knows; surprise=intel enemy lacks;
    defended by blackout/road-block; a world derivation of how widely a rumor propagated).
  Packet carries CONTENT+TRUST vector; each axis its own decay rule.

**Owner additions (2026-07-11, round 13) — PRNG organic degradation + absence-is-information:**
- ORGANIC DEGRADATION = PRNG-GATED (not fixed decrement). Content-axis weathering (completeness/accuracy/
  framing) is a SEEDED per-hop ROLL = a DISTRIBUTION; tails matter — news CAN be PERFECTLY PRESERVED across
  whole map (RARE) or severely garbled. TWO distortion SOURCES compose: ORGANIC (PRNG, undirected noise/
  telephone) + INTENTIONAL (alignment-DIRECTED, round-11 evil-for-gain/framing). Final = base − organic
  PRNG ± intentional directed. SEEDED (event/carrier/edge/hop fork) ⇒ deterministic replay. Same event →
  DIFFERENT fidelity down DIFFERENT chains ⇒ cross-confirm has real work; rare long-range perfect truth is
  a genuine lucky event. TIMELINESS is the exception — degrades DETERMINISTICALLY w/ distance/time (not a roll).
**Owner additions (2026-07-11, round 14) — a SETTLEMENT IS A POLITY, belief map is FACTIONAL:**
Owner pushed HARD (correct): "the settlement believes X" flattens the factional model. WHO believes?
ruler/council/merchants/clergy/military/criminal-net/public/bureaucracy — diff sources/incentives/info-
quality. KEY INSIGHT (architect add): the round-9 CARRIERS ARE THE FACTION INFO ORGANS — trade→merchants,
armies/couriers→military, faith-net/pilgrims→clergy, smuggle→criminal, public-rumor→public, diplomatic
couriers→gov. So faction belief maps = NATURAL PARTITION of carrier info, NOT new work; the single map
DISCARDED the carrier↔faction alignment the design already had. V1 (don't block): ONE map = THE GOVERNING
COALITION'S OPERATIONAL BELIEF (not "objective settlement mind"), drives settlementStrategy. BUT data model
carries OPTIONAL FACTION KEY day one: beliefMaps[observer][factionId?][subject], default=governing coalition.
EXTENSION (where relevant): per-faction belief (gov/military/merchant/religious/public/criminal) fed by its
carrier + INTRA-settlement intel sharing (round-11 internal). Governing coalition = strategic action; other
factions → DISSENT (belief divergence = internal stressor, council_schism/legitimacy), LEAKAGE (faction
leaks intel to public/other-faction/enemy = round-11 betrayal at settlement scale via corruption/compromise),
ALT ACTIONS (merchants reroute, clergy missionize, criminals smuggle, faction COUP if belief+power justify).
WILLFUL IGNORANCE = govt belief that WON'T UPDATE from a better-informed faction (epistemic closure =
disposition/corruption trait; a cause W-C5). Makes MISJUDGMENT FACTIONAL (mayor marches ignoring merchants =
internal-info-flow failure). Tractable (v1=1 map) w/o assuming one settlement mind in the data model.

**Owner additions (2026-07-11, round 17) — the SIMULATION CONTROL LAYER (now §11; the full sim is a CEILING not a philosophy):**
Full spatial sim = engine's MAX capability, NOT mandatory philosophy. One causal model; DM dials how much
geography/delay/misinfo/drift/autonomy enters. RESOLVES the agency concern (empirical stasis + autonomy shift):
autonomy is a DIAL. Turning off PRESERVES state (never deletes routes/beliefs/pending/history).
- 4 INDEPENDENT AXES (> "spatial on/off"): (1) geography constrains? (2) movement consumes time? (3) info
  incomplete/distorted? (4) actors decide w/o DM approval? Orthogonal, combine (geo-but-instant / slow-but-
  accurate / instant-but-distorted / imperfect-belief-but-approval / autonomous-but-omniscient). = the design's
  internal LAYERS decomposed (axis1=cost-field, axis2=latency+carrier-speeds, axis3=rumor/belief, axis4=
  settlementStrategy+belief-action). Control layer = user-facing PROJECTION of the layering; layers already
  separable (dormancy oracle) ⇒ independent axes possible. VALIDATES the layering.
- 5-PART HIERARCHY: (1) WORLD PROGRESSION parent: Frozen/DM-Advanced/Living/Autonomous. (2) SPATIAL MODEL:
  Ignore-Geo / Abstract-Distance / Mapped-Geo / Full-Spatial. (3) TRAVEL+PROPAGATION TIME (separate from geo):
  Instant/Compressed/Standard/Slow/Custom; human benchmark "continent crossing = 1wk/1mo/2mo" → global mult;
  advanced per-domain speed. Default = 1 global. (4) INFO MODEL (modes not toggles): Omniscient / PERFECT-BUT-
  DELAYED (the SLEEPER — full strategic payoff staleness→risk WITHOUT misinfo burden, cheap, build FIRST) /
  Unreliable-News / Full-Info-Sim. (5) POLITICAL AUTONOMY: DM-Only / Recommendations / Routine-Autonomy(best
  default) / Full; + approval threshold (minor/major/catastrophic/none).
- DOMAIN MODULES (existing toggles → TRI-STATE): war/trade/migration/religion/diplomacy/disease/criminal/magic/
  culture/founding. OFF / DM-DRIVEN / AUTONOMOUS. "autonomous war OFF" ≠ "DM can't create war" (engine won't
  independently escalate; DM-created still resolves). system-ABSENT vs system-AWAITING-DM-INIT. Grounds onto
  EXISTING simulationRules (settlementStrategyEnabled + war/trade/religion + normalizeSimulationRules) — booleans
  BECOME tri-states; EXTENDS not net-new; tri-state can ship NOW.
- DEPENDENCY GATING = CORRECTNESS (prevent incoherent combos): frozen→hide autonomous/drift; ignore-geo→hide
  terrain/route/blockade + limit travel; instant→hide speed/latency/in-transit; omniscient→hide distortion/
  lineage/corrob (objectives remain); autonomous-war-off→hide auto-escalate but permit DM-created.
- PRESETS (essential): Static / Narrative / LIVING REALM (best default: mapped-geo+standard+unreliable+routine-
  autonomy+major-approval) / Full-Sim ("Dwarf Fortress mode") / Custom. = INCREMENTAL BUILD MILESTONES: DM-Only
  IS TODAY (empirically-verified current build); LIVING REALM ships strategic core (delay+geo+autonomy) WITHOUT
  full distortion/belief — shippable milestone below full sim. Build UP the axes.
- CANONICAL + VERSIONED: rules change the LAWS of history → RULESET-CHANGE RECEIPT (=§V.1 versioning generalized);
  in-flight movement policy (preserve/recalc/new-only), DEFAULT preserve-existing + apply-new PROSPECTIVELY (no
  retroactive rewrite); enabling imperfect-info midway = prospective (old reports can't gain provenance).
- PRODUCT PRINCIPLE (binding): controls = FICTIONAL ASSUMPTIONS not internals. GOOD "ignore distance"/"news
  always accurate"/"continent = 1 month". BAD "disable cost-field digest"/"bypass lineage". Also a correctness
  guard (can't set distortion-on/lineage-off). PLACEMENT: REALM PAGE, grow the existing SimulationRulesDialog
  (RP-1 just hardened it) from flat toggles → preset-picker + axes-behind-disclosure.

**Owner rulings (2026-07-11, round 18 — on Fable's gap review; now §4h):**
- PARTY VANTAGE: REJECTED — party location is DM flavor, not engine state. The per-settlement Rumors &
  News tab IS the table surface (DM = full truth via includeGroundTruth; party = the mill as written).
  PLAYER-FACING = the EXISTING share-to-gallery pipeline WITH DM-TRUTH STRIPPED (ground-truth/provenance/
  confidence removed at the gallery/publicSafe seam — the same discipline as deity stripping; = the
  PART III whitelisted player projection, ONE seam).
- NPC EXCURSIONS: ACCEPTED w/ BINDING protective constraints — named NPCs are the settlement's CAST:
  home base is home base; movement = BOUNDED ROUND-TRIP w/ determined duration (week/month/season/year,
  deterministic at departure) + RETURN; depart/arrive/return = hooks (incl. party travel hook); PROTECTED
  travel (individual, IMMUNE to banditry/attrition/mortality — can't die unnecessarily; §6 danger never
  rolls against them); rare exception = a STRESSOR (detained/stranded/siege-caught) that RESOLVES → NPC
  returns (rescue/escort hook, W-C5 lifecycle — never a random road death). Impl: payload on existing
  movers {npcId,purpose,destination,departTick,returnTick}; dossier shows absence+expected return;
  destination gains visitor hook.
**Owner ratification (2026-07-11, round 19 — SEASONS, now §4i, expanded + ratified):**
13-wk quarters = the 4 seasons; season = pure f(tick). FOOD YEAR (owner verbatim): renewables (animals/
fisheries/farming) abundant → winter TEMPORARILY DEPLETED → spring replenish-to-abundant (biome-modulated
amplitude); GRANARY = the buffer — refills summer/fall (harvest), draws down winter; = existing
foodStockpile as level, capacity derived from tier/institutions. Drama curve: fall anxious → late-winter
"hungry gap" crisis → spring relief; autumn war/forage = delayed late-winter catastrophe. WINTER TRAVEL =
SLOW NOT SEVER (owner explicit): seasonal multiplier on cost field, MULTIPLICATIVE w/ terrain (mountains
→ near-impassable, plains merely slow). Composes: info runs cold (timeliness decays faster; SPRING THAW =
annual information event — burst of catch-up news); campaign season EMERGES by cost not rule (winter siege
= starvation race); trade breathes (entrepôt warehouses matter most in Feb); winter migration = desperate
(§4c mortality seasonal; NPCs stay excursion-protected). Texture: harvest festivals/midwinter rites/spring
renewal (faith-keyed), lean-winter crime, spring founding, seasonal institution vocabulary. INTER-ANNUAL
VARIANCE (architect): rare seeded severity draws per (year,region) — hard winter/drought/bountiful harvest
— fork season:${year}:${region}, bounded, deterministic. BUILD SPLIT: SEASONS-A aspatial (resource cycle +
granary + texture; ships early near CL-0 as a control-layer domain module, seasonsEnabled tri-state,
default OFF = byte-identical; Living Realm+ presets on) / SEASONS-B spatial (travel/info/campaign rhythm;
rides keystone as versioned cost-law overlay).

**Owner ratification (2026-07-11, round 20 — WATER/SEA LANES, now §4j; keystone reservation SETTLED):**
PORT ELIGIBILITY = GEOGRAPHY ∧ INSTITUTIONS (owner rule): close proximity to navigable water (canon map
coast/river/lake) AND a water-access institution (mapped from existing catalog: dock/harbor/shipwright/
fishery/ferry/port-authority). Geography necessary, institutions sufficient — landlocked can never buy in;
coastal-without-dock = a beach; FOUNDING a harbor (W-C3) makes a port mid-campaign (fully derived).
Sea/river lanes = SEPARATE edge set in the frozen digest (PART VI air/teleport pattern), materialized when
≥2 eligible ports; port = the maritime GATE. Water = cheap + high-capacity (historical order-of-magnitude)
→ PORT CITIES a distinct destiny (port-entrepôt richest); isolation inversion fixed (island+harbor=HUB).
Composes: siege of a port needs land AND SEA (naval blockade = hold the water gate; blockade-runner =
wet smuggler); PIRACY = maritime banditry (§6 danger on lanes); STORM SEASON (round 19 — winter prices up
the sea route exactly when the granary bites); ship crews = fast long-range port-to-port rumor carrier
(round-9 variant — ports become info brokers between coastlines); refugee sea passage (funded sail,
desperate walk). V1 = edges + port-gates + blockade/piracy danger + carrier variant; NO fleet combat
(sea-interdiction abstraction; navies future). Derived at digest time, re-derived on founding; no ports ⇒
no edge set ⇒ prior bytes.

- STILL PENDING owner ratification from the gap review: BELIEF COLD-START (recommend: init = ground truth
  as-of-canonize), SCALE ENVELOPE declaration (5-30 tuned).

**Owner additions (2026-07-11, round 16) — 6 TECHNICAL HARDENING requirements (now PART V, BINDING):**
1. COST FIELD stable+explainable: two-tier digest (frozen geometry / live overlays) INSUFFICIENT — add
   VERSIONED INTERPRETATION: 3 version axes (geometryVersion + costLawVersion + overlayVersion). Changing
   the cost-LAW = discrete re-canonize (bump costLawVersion), never silent drift on load. + ROUTE
   EXPLANATION RECEIPTS (causal-legibility applied to geometry — "why this road?").
2. CARRIER-SPECIFIC ROUTE PREFERENCES: don't collapse to one shortest-path. Shared frozen geometry +
   per-carrier cost PROFILE (trade=low-cost/high-cap, army=width/terrain/supply/hostility, refugee=safety/
   pull, smuggler=concealment, missionary=pop/religious-opp, rumor=high-connectivity-social, courier=speed,
   airship/teleport=DIFFERENT GRAPHS). k-shortest cache computed PER carrier profile.
3. RUMOR CARDINALITY explosion: need canonical event id (wizardNews sourceEventId substrate) + LINEAGE ids +
   merge rules + salience thresholds + expiration + per-observer info budgets + SOURCE-CORRELATION tracking.
   THE big one = CORRECTION to round-8 cross-confirm: weight by INDEPENDENCE not count — 5 retellings of 1
   origin = NOT 5 corroborations (false corroboration). Cross-confirm reads LINEAGE; shared-origin corroborates
   little. Else entrepôt "best-informed" is illusion (hears same lie 5×).
4. BELIEF UPDATE conflict-resolution rule (the MISSING piece): contradictory reports (army 5000 old-official/
   merchant 2000/refugees total-defeat/spy intact/no-courier-3wk) → consistent WEIGHTED RECONCILIATION (not
   last-writer-wins, not nec. full Bayesian). KEY SYNTHESIS: the update rule = where rounds 12/13/15 get
   CONSUMED — weight by provenance(12)+recency(12)+independence(V.3)+prior; FILTER by disposition/political/
   confirmation bias (15A accept/reject); contradiction→uncertainty; confidence decays w/ silence(13).
5. DETERMINISM tuning burden: spatial INVARIANT TEST SUITE (golden-equiv, gates every wave): same(event,path,
   carrier,hop)→same degradation; reroute doesn't change unrelated; adding unrelated settlement doesn't reroll;
   stable tie-break; overlays affect only dependents; dormant canon byte-identical; old-saves identity-fallback.
   Same discipline as existing no-Date/unseeded grep-gates + goldens; burden real, budget per wave.
6. MORE FEEDBACK LOOPS than migration+prosperity: ENTREPÔT (trade→infra→lower-cost→trade), RELIGIOUS-CENTER
   (pilgrims→legitimacy→institutions→pilgrims), MILITARY-CHOKEPOINT (position→investment→control→importance),
   INFO-CENTER (carriers→info→decisions→stability→carriers). Each needs LOCAL brakes (congestion/rent/
   maintenance/targeting/resentment/capacity/rival-investment). ARCHITECT SYNTHESIS = SYSTEMIC brake: all 4
   same shape (centrality feedback) + COUPLED → a mega-hub winning all 4 = biggest TARGET + single-point-of-
   failure + juiciest manipulation mark → TOTAL centrality SELF-LIMITING (concentrates risk). Force/counterforce
   at systemic scale; no settlement runs away to dominate realm.

**Owner additions (2026-07-11, round 15) — RESTRAINT: alignment=distortion STYLE not amount; risk=FRAMEWORK not one utility:**
(A) ALIGNMENT = distortion STYLE/signature, TENDENCIES not moral laws — changes HOW distortion occurs not
just HOW MUCH (supersedes round-11 scalar). 5 levers: source preference, framing willingness, uncertainty
tolerance, manipulation incentive, transmission style. LAWFUL≠accurate (fidelity to OFFICIAL channel —
preserves official errors, suppresses unauthorized truth, prefers stale formal, repeats propaganda,
rejects informal; reliable-but-BRITTLE). CHAOTIC≠incoherent (decentralized — fast/redundant/locally-
accurate/censorship-resistant/good-informal-corroboration; no canonical version; resilient-but-uncanonical).
EVIL≠deceptive (self-serving — ruthlessly ACCURATE intel for ITSELF, deception OUTWARD; accurate-inward/
deceptive-outward). GOOD distorts UNINTENTIONALLY (softens bad news, protects victims, amplifies moral
framing). Lawful vs chaotic settlement build DIFFERENTLY-SHAPED belief maps from same events; styles CLASH
(lawful bureaucracy rejects chaotic net's credible informal warning → misjudgment). Round-13 PRNG = undirected
noise; alignment-style = SHAPE of directed distortion.
(B) RISK = FRAMEWORK not one universal utility w/ coefficients (else elegant-but-HOMOGENEOUS). Shape:
BELIEFS + OBJECTIVES + DISPOSITION + CONSTRAINTS → DECISION SCORE. OBJECTIVES are ACTOR/FACTION-SPECIFIC
(ties round 14): merchant=revenue/reliability/credit; warlord=prestige/opportunity/weakness; church=heresy/
legitimacy/sacred-access; refugee=survival/distance/kinship/border-hostility. Beliefs=factional belief map;
disposition=alignment/temperament (15A); constraints=physical layer. Governing coalition scores w/ ITS
objectives=strategy; DISSENT now DEEPER (factions reach OPPOSITE conclusions on SAME situation b/c optimize
DIFFERENT things, not just diff beliefs). IMPL: settlementStrategy SCORER must become OBJECTIVE-PARAMETERIZED
(pluggable objective set per faction), NOT one war-utility+coefficients.

- ABSENCE OF INFO = INFORMATION, most uncertain kind. Silence from route/settlement = maximally AMBIGUOUS
  signal (cut-off/besieged/fallen/isolated/just-delayed — don't know which). NOT a new channel — a DERIVED
  belief-map property + limiting case of TIMELINESS axis: track WEEKS-SINCE-LAST-UPDATE; silence grows ⇒
  confidence in prior belief DECAYS → MAX UNCERTAINTY = the signal the risk assessment reads. Drives action
  per disposition: cautious/lawful treats silence as danger (ramp / send SCOUT to probe → closes loop);
  naive/chaotic ignores → SURPRISED. Besieged/isolated going DARK is EXPERIENCED by allies AS absence (→
  relieve?). Road-block/blackout WEAPONIZES absence but double-edged (silencing them ⇒ you may misread their
  silence — delayed couriers = false alarm). Absence = timeliness run to limit (belief w/ no update → ≈ no belief).

**Original feasibility question (now answered above):** what does OUR canon map state persist?
ANSWER: fmgSnapshot blob + seed + placements{x/y/cellId} + customBackdrop + decorative
labels/markers/forests. NO cost field / heightmap / distance matrix / gates / tiers persisted.

**Sequencing:** its own program (call it PHASE 5.5 — THE SPATIAL ENGINE, or a spatial
companion). AFTER the reunification stabilizes the Realm surfaces (W4b surfaces the map's
war/faith layer now). Nail the determinism/dormancy design in a doc BEFORE build (like
PHASE4_FAITH_DELTA). Related: [[phase5-engine-companion-complete]] (war cluster it completes),
[[reconciliation-decisions]], the realm map / W4b reunification wave.

**Owner additions (2026-07-11, round 4) — entrepôt growth + smuggling counterforce:**
- ENTREPÔT PROGRESSION: settlements that are FREQUENTLY trade intermediaries (gates many routes
  cross) get natural entrepôt growth + economics via TOLL and GATE taxes on pass-through trade.
  Spatially-driven founding/growth lane (per-settlement intermediary-frequency metric on the
  W-C3 founding/tier machinery). Self-balancing: tolls too high divert trade to alternate routes
  (the cheap-vs-safe router), so greed self-corrects. The CONSTRUCTIVE half of the spatial
  economy; explains why crossroads towns get rich (the Sanctavilla profile the external review praised).
- SMUGGLING: interception/siege is NOT binary. A caravan through a hostile/occupied gate gets a
  seeded PRNG smuggle-through chance, weighted by a SMUGGLE NETWORK strength (from criminal
  opportunity / thieves-guild), the goods, and the gate's CORRUPTION (a bribed gate is leaky).
  Ties crime/corruption into the spatial layer; a besieged settlement with smugglers gets a
  trickle (slows starvation, not lifts). Bounded (no hand-of-miracle). Conscience (W-C2) still
  gates the interceptor's take.
- DESIGN PRINCIPLE: every spatial force has a counterforce (movement↔friction, embattlement↔
  security, interception↔smuggling, entrepôt-growth↔toll-greed-self-correction). Corruption is
  the hinge (a corrupt gate is both a greedy toll-taker AND a leaky smuggle seam).

**Owner additions (2026-07-11, round 5) — MIGRATION (population as a spatial flow):**
- CARRYING-CAPACITY VALVE: a settlement sustains stable heuristic pop growth up to a FOOD-DEFICIT
  TOLERANCE (~20% anchor — architect tunes; make CONTEXT-DEPENDENT: rich/well-connected entrepôt
  imports to cover more deficit, poor/cut-off town tolerates far less). BEYOND tolerance, over
  weeks/months/years the EXCESS pop MIGRATES along ROUTES to closest reachable neighbours.
- MORTALITY (two sinks, "make something of it"): some die at ORIGIN (starvation — weak/old/can't
  travel), some die ON THE ROAD (distance + terrain + embattled/hostile passage = same routing-
  danger term as caravans/armies; refugees through a war zone die more). Destination receives
  FEWER than left (attrition = self-limiting). Deaths are EVENTS/hooks + causal-ledger legibility
  (shrink explained as emigration AND starvation).
- MULTI-FACTOR PUSH (holistic, sliding): food deficit + WAR + other stressors + LOW PROSPERITY,
  weighted by the whole situation. DESTINATION SELECTION (pull+avoidance, PRNG-gated at levels):
  CLOSEST (path cost) + LEAST DRIFT from own culture/religion + LEAST HOSTILITY. Under war /
  large culture-religion gap they SHY from the hostile/instigating settlement — but NOT ALL (a
  scatter fraction goes "wrong"). Makes culture/religion a MIGRATION factor that FEEDS BACK into
  the destination's culture/faith (similar influx reinforces; large different influx shifts).
- REGIONAL EMERGENCE (with round-4 entrepôt): hubs ATTRACT (pull→growth, bounded), crisis zones
  SHED → the map grows population CENTRES + GHOST TOWNS from the sim. Demographic counterpart of
  trade flows: PUSH↔PULL with FRICTION (mortality/distance). IMPL: enhances OUR existing
  populationDynamics/migrationFlows when spatial active (route-based, distance-weighted); aggregate
  migration-flow record per push (in-transit ledger, seeded, bounded); aspatial fallback w/o map;
  DAMPING soak-gated (mortality+attrition+buffer+graded rates) vs regional oscillation/collapse.

**Owner additions (2026-07-11, round 6) — prosperity gravity + contraband smuggling:**
- PROSPERITY AXIS: destination selection gets a 4TH axis — most migrants also head for the
  HIGHEST-PROSPERITY reachable neighbour (gravity term). = §4b entrepôt PULL made explicit in
  migration; four axes (close / least-drift / least-hostile / richest) trade off, weighted+PRNG.
- CONTRABAND + GATE POLICY: gates gain a POLICY dim beyond toll — a settlement may PROHIBIT/
  CONFISCATE goods categories that violate its law/culture/alignment (SLAVES the flagship). Makes
  smuggling TWO-SIDED: round-4 evaded HOSTILE interception; round-6 also evades LEGAL/MORAL
  prohibition. Contraband is RELATIONAL (w.r.t. the transiting gate — reuses culture/alignment
  distance). Smuggle attempt weighted by mover RISK TOLERANCE (same cheap-vs-safe/alignment-
  fidelity pattern → smuggling is a distribution, not a constant). Corruption still the hinge
  (a corrupt gate bans-on-paper, bribed-in-practice). Confiscation feeds seizer (W-C2 conscience).

**ROUND 21 (2026-07-12) — M11 WORLD-AS-ACTOR SHOCKS ratified.** The owner returned to the two
held gap-analysis ideas and directed them for the ladder as M11 (specced to dispatch depth in the
playbook PART 7, committed c247568b): M11a PESTILENCE — plague travels as information travels
(trade channels + shipments + armies at hopWeeks latency), extending the EXISTING plague stressor
(one plague truth); care counterforce from the institution ROSTER (churches/derivatives, hospitals,
druids, alchemists — diminishing returns, hard-capped, never immune); armies read plague as a graded
hazard + contract + become vectors; temporary religious-authority influence while active (both
directions: triumph vs abandonment). M11b CALAMITY — very rare (realm ~1/10-20y, per-settlement
seeded annual draw, cooldown derived from the minted permanent history stamp = zero new state),
terrain-keyed, destroys/demotes K non-required institutions (subsumption via UPGRADE_CHAINS +
multi-instance collapse; required NEVER), bounded aggregate death + M4-exodus tail, emergent
popToTier demotion, W-C5 ruler-pressure cause; preset-gated default OFF. Checkpoint validates
THROUGH M11. Boundary held: aggregate mortality only — named NPCs never sim-killed (see
[[product-scope-boundaries]]).
