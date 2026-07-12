# Phase 5.5 — The Spatial Engine (design synthesis)

STATUS: DESIGN — GROUNDED (owner directives 2026-07-11, SIX rounds, synthesized by the
architect; verified against the tree 2026-07-11 by workflow wf_d0c0299d-226 — see PART II).
Depends on the Realm map as a stable first-class surface (the reunification's W4b surfaced
its war/faith layer). To be built AFTER the reunification, with the determinism/dormancy
contract nailed here before implementation — the same discipline as PHASE4_FAITH_DELTA.
Raw directive log: memory/spatial-engine-direction.md.
PART I (§0–§10) is the owner's vision as synthesized. PART II is the code-grounded feasibility
verdict + the decisions the owner must make before build. READ PART II FIRST if you are scoping
the build — the vision as written is not buildable until the keystone (a persisted, deterministic
cost field) is resolved.

## 0. The thesis
Today the simulation is ASPATIAL. "Neighbours" are an abstract graph; trade, faith, war, and
the cascade propagate topologically and instantly. The map is a picture the engine ignores.
The spatial engine makes GEOMETRY a first-class engine input: when settlements are placed and
the map is CANONIZED, their positions + terrain + elevation (from the fantasy-map generator OR
a user-authored overlay) become the substrate the whole simulation reads. The map stops
illustrating the world and starts governing it. This is the axis the engine has been missing,
and it is where the war system (readiness, rust, supply-quality, funding) finally resolves into
battles, and where trade finally has to *travel*.

## 1. The spine (non-negotiable — inherited from the whole program)
- **Activation seam = CANONIZE THE MAP.** The spatial layer is dormant until the map is
  canonized (a realm-level canon event, like the latent-pantheon activation). Before it —
  drafts, free/anon, placed-but-uncanonized — everything is aspatial, byte-identical to today.
  No canon map ⇒ no spatial graph ⇒ prior bytes.
- **Determinism.** The spatial graph (distances, least-cost routes, gates, neighbour tiers) is a
  PURE, seeded function of the canonized map state. Same map ⇒ same graph ⇒ byte-identical sim.
  Deterministic path-finding with stable tie-breaking; no wall-clock, no unordered iteration.
- **Dormancy / additivity.** In-transit ledgers (news propagation, caravans, army transit) are
  conditionally materialized — empty until something is actually moving. A settlement not on a
  canonized map behaves exactly as today.
- **Premium.** The world map IS the Realm IS Cartographer. Spatial simulation is inherently
  premium; free/anon stays aspatial. Tier never touches generation.
- **Temporal.** Travel + latency measured in WEEKS (the 4-4-5 calendar). Advancing time is what
  moves armies, caravans, and propagation fronts.
- **Endogeneity.** The geometry feeds the world; user/party actions never enter the fit math
  (except the DM's explicit authoring of the map itself).
- **Performance.** Routes are O(N²) shortest-paths computed ONCE on canonize/place/force-road,
  cached. Per tick the engine only advances the cheap in-transit ledgers. Caravans are AGGREGATE
  (one shipment record per active supply link), never per-wagon.

## 2. The geometric substrate
Derived once from the canonized map:
- **Cost field** over terrain + elevation (mountains/water expensive; plains/roads cheap;
  gradients add cost).
- **Least-cost routes** between settlements (deterministic A*/Dijkstra over the cost field).
- **Neighbour tiers** by path cost: primary (cheap direct), secondary (through one gate),
  tertiary (through two), …
- **Gates**: a route from A to C that crosses B's territory makes B a GATE — B can tax,
  throttle, or (if hostile) block the flow. Geography becomes political: hold the pass, hold
  the trade.
- **DM override**: force a road / trade route (a low-cost authored edge that bypasses gates).
  Objective geography routes through gates unless the DM forces it.

## 3. The propagation layer — everything travels
Replaces instant topological propagation with a FRONT that expands over ticks. Each cascade
effect (news, faith pressure, consequence) carries {origin, target, arrival tick = now +
travel-weeks}; it lands when the tick arrives. Built on the read-last/write-next in-transit
ledger pattern (conquestFeeds/institutionTolerance). Produces the owner's target behaviour: a
week-old war on one edge of the map hasn't reached the far side yet, but will. Faith conversion
and religious spread inherit the same distance + latency.

## 4. Trade as a physical supply network
- **Multi-source + stockpile.** An input (iron ore is the example; generalizes) can come from
  MULTIPLE producers/directions. A single missed shipment is absorbed by other sources +
  a per-input stockpile buffer (the foodStockpile pattern generalized).
- **Impairment = STARVATION, not incompleteness.** A NEW, DISTINCT impairment kind —
  SUPPLY-STARVED — triggers ONLY on extended total starvation (all sources cut AND stockpile
  depleted), e.g. a road closed by siege/embattlement. It is TEMPORARY: it lifts the moment a
  shipment arrives. The causal receipt explains WHY to the DM ("the smithy starves: the iron
  road is cut under the siege of X; no shipment in N weeks"). Resolution rides the W-C5
  cause-lifecycle. Distinct from underfunding/corruption impairment.
- **Per-institution trade + invisible caravans.** When primary/secondary producers are
  established, trade is established PER CONSUMING INSTITUTION. Each active supply link carries
  INVISIBLE moving pieces (an aggregate shipment-in-transit record with an arrival tick). NOT
  DM-facing (a map of dots is noise) — caravans are ENGINE state that surfaces ONLY as hooks/
  consequences (a loss, an interception, an arrival that lifts a starvation).

## 4b. Entrepôt progression — geography as economic destiny (owner, round 4)
Position on the route network is a GROWTH DRIVER. A settlement that is FREQUENTLY an
intermediary (a gate many routes pass through) has natural ENTREPÔT PROGRESSION: it
develops transshipment institutions (warehouses, customs house, carriers' guild, money
changers, coaching inns — exactly the Sanctavilla profile the July-11 external review
praised) and grows its economy through TOLL and GATE-TAX revenue on the pass-through
trade. This is a SPATIALLY-DRIVEN founding/growth lane on the W-C3 founding + tier
machinery: a per-settlement "intermediary frequency" metric (derived from how many active
routes cross it) drives the progression. SELF-BALANCING (the counterforce is built in):
tolls set too high divert trade to alternate routes via the cheap-vs-safe router (§6), so
a greedy toll-town prices itself out — a natural equilibrium, no hard ceiling needed,
though a capacity cap prevents runaway. This is the CONSTRUCTIVE half of the spatial
economy (embattlement/interdiction is the destructive half): geography rewards the hubs
and isolates the cut-off. It also explains MECHANICALLY why crossroads towns become
wealthy trade hubs — the emergent coherence the review found most convincing, now derived
from position rather than a generation roll.

## 4c. Population as a spatial flow — migration (owner, round 5)
Population gets a carrying-capacity RELEASE VALVE tied to the supply network. A settlement
sustains stable heuristic growth up to a FOOD-DEFICIT TOLERANCE (~20% anchor — architect to
tune, and make CONTEXT-DEPENDENT: a prosperous, well-connected entrepôt imports to cover a
larger deficit; a poor cut-off town tolerates far less). BEYOND the tolerance, over weeks/
months/years, the EXCESS population MIGRATES along ROUTES to the closest reachable neighbours.
- MORTALITY (two sinks, "make something of it"): some die at the ORIGIN (starvation — the weak,
  the old, those who can't travel) and some die ON THE ROAD in transit (the journey's toll —
  distance, terrain, and especially embattled/hostile passage: refugees through a war zone die
  more, the SAME routing-danger term as caravans/armies). So the destination receives FEWER than
  left (attrition = self-limiting; migration is no perfect conveyor). Deaths are EVENTS/hooks (a
  decimated refugee column; the causal ledger explains a settlement's shrink as emigration AND
  starvation).
- MULTI-FACTOR PUSH (holistic, sliding): food deficit is one driver; WAR, other stressors, and
  LOW PROSPERITY also push population out, weighted by the whole situation (siege + famine + low
  prosperity hemorrhages; a prosperous peaceful town with a food dip barely loses any).
- DESTINATION SELECTION (pull + avoidance, PRNG-gated at various levels): migrants prefer the
  CLOSEST reachable settlement (path cost) with the LEAST DRIFT from their own culture/religion,
  the LEAST HOSTILITY, AND (round 6) the HIGHEST PROSPERITY — a fourth, gravity-like axis: most
  also head for the richest reachable neighbour. This is the §4b entrepôt PULL loop made an
  explicit migration term (hubs concentrate people; the four axes trade off, weighted + PRNG-
  gated). Under war or large culture/religion gaps they SHY AWAY from the
  hostile/instigating settlement — but NOT ALL do (a scatter fraction goes to the "wrong" place).
  Most cluster in the nearest friendly similar town; some disperse. Makes culture/religion a
  MIGRATION factor that FEEDS BACK into the destination (a similar-culture influx reinforces it;
  a large different-culture influx shifts it — coupling to the faith/culture spread mechanics).
- REGIONAL EMERGENCE (with §4b entrepôt): prosperous hubs ATTRACT migrants (pull → more growth,
  bounded), crisis zones SHED them → the map develops population CENTRES and GHOST TOWNS from the
  sim, not a roll. This is the demographic counterpart of the trade flows: PUSH (deficit/war/low-
  prosperity) ↔ PULL (prosperity/safety/cultural-similarity), with FRICTION (mortality/distance).
- IMPLEMENTATION: enhances OUR existing populationDynamics/migrationFlows when the spatial layer
  is active (route-based, distance-weighted destinations); an aggregate migration-flow record per
  active push (in-transit ledger, not per-person), seeded, bounded. Without a canon map it falls
  back to the current aspatial migration. DAMPING (soak-gated): mortality + attrition + the
  tolerance buffer + graded rates must prevent regional oscillation/collapse (A's refugees strain
  B strain C…). Fixes a review nit too: mass migration is a REAL event, so population change stops
  being "+3 residents/week" noise and becomes signal worth a headline.

## 4d. Contraband, gate policy, and smuggling risk tolerance (owner, round 6)
Gates gain a POLICY dimension beyond the round-4 toll rate: a settlement may PROHIBIT or
CONFISCATE specific GOODS CATEGORIES at its gates when they violate its LAW/CULTURE/ALIGNMENT
(SLAVES the flagship example — a settlement that outlaws slavery seizes a slave caravan; a
culturally-different or lawful gate bans what its neighbour trades freely). This makes smuggling
TWO-SIDED: round-4 smuggling evaded HOSTILE interception; round-6 smuggling also evades LEGAL/
MORAL PROHIBITION. Smugglers can attempt to run prohibited cargo through a banning gate.
- RISK-TOLERANCE RANGE: the smuggle attempt itself (whether to try, how much to risk) is weighted
  by the mover's RISK TOLERANCE — the SAME cheap-vs-safe / alignment-fidelity pattern as routing
  (§2 routing risk): a bold/chaotic smuggler runs contraband a cautious/lawful trader wouldn't,
  and mis-weights the danger; a seasoned one reads it true. So smuggling volume is a distribution,
  not a constant — some cargoes never attempt the run, some brazen ones do and are caught.
- COUPLINGS: contraband status is RELATIONAL (a good is contraband w.r.t. the transiting gate's
  law/culture, not intrinsically) → reuses the culture/alignment distance the migration §4c and
  faith systems already compute. Confiscation feeds the seizing settlement (loot, W-C2 conscience-
  gated) and denies the destination (the §7 interdiction path). Corruption is still the hinge: a
  corrupt gate that officially bans slaves takes a bribe and waves them through anyway (prohibition
  on paper, leak in practice). Slavery/contraband trade thus becomes a moral-economic axis with a
  legal force (prohibition/confiscation) and its counterforce (smuggling, risk-tolerance-gated).

## 4e. Movement modalities — isolation, teleport circles, airships (owner, round 7)
The base spatial layer is the TERRESTRIAL cost field. These three are each a DIFFERENT kind of
EXCEPTION to it — all captured deterministically at canonize, all magic/tech/premium-gated where
appropriate, all keeping the forces↔counterforces law. They cut across trade + land + war + faith
+ migration, so they live at the substrate level (§2) even though listed here.
- ISOLATED SETTLEMENTS = DISCONNECTION, an EMERGENT property of the cost field, not a new mechanic.
  A settlement whose least-cost LAND route to everything is prohibitive/infinite (an island, a
  mountain fastness, a disconnected graph component) is isolated. The digest already knows this
  (connectivity is a Dijkstra by-product). CONSEQUENCES, holistically: siege-RESISTANT by land
  (hard to interdict what has no land route — §7 siege needs sea/air control too); chronically
  TRADE-STARVED (few/no supply routes ⇒ standing supply-starved risk, high stockpile reliance);
  faith/news LAGGED or never-reached (the §3 propagation front can't cross); migration-TRAPPED
  (excess pop can't leave by land ⇒ higher origin-mortality OR forced sea route). Isolation's
  COUNTERFORCE is exactly the next two (and sea lanes): a teleport circle or airship de-isolates.
  Make isolation a LEGIBLE derived state (the dossier explains "cut off by land: no viable route").
- TELEPORTATION CIRCLES = a ZERO-cost, ZERO-latency, GATE-BYPASSING EDGE between two specific
  settlements (MAGIC-gated ⇒ absent in a magic-opt-out world; premium; rare/expensive). It
  collapses distance: the two become adjacent for faith spread, news, and (bounded) trade. But the
  counterforces are sharp: it is a SEIZABLE CHOKEPOINT (control it → control the link; disable/
  destroy it in war = a strategic objective that severs the link); THROUGHPUT-BOUNDED (people,
  messages, limited high-value goods per week — NOT an army pipeline or bulk grain); and a SINGLE
  POINT OF FAILURE. Trade through it bypasses land interception; a besieged settlement WITH a
  circle can't be fully starved by a land siege alone (the circle is the smuggle-route-of-last-
  resort — §7's trickle, magically). War: capturing/collapsing the enemy's circle is a real
  objective. It is an AUTHORED edge in the frozen digest (DM-placed or generated), so determinism
  holds.
- AIRSHIPS = a PARALLEL AERIAL cost field: straight-line, terrain-IGNORING, gate-BYPASSING — but
  NOT distance-free (time ∝ straight-line distance, faster than land) and carrying its own risk
  profile (weather, AERIAL interception, range/fuel limits, LOWER volume than a caravan). Tech/
  magic/premium-advanced-gated (a per-settlement capability flag). The big consequence: airships
  DEFEAT land interdiction — an airship resupplies a besieged settlement over the walls, so §7
  SIEGE becomes "control the land AND the air"; total interdiction now requires AIR SUPERIORITY
  (the counterforce: aerial interception / an enemy air arm). Airship trade is faster but lower-
  volume and interception-risked; military air-mobility extends reach but is bounded (can't move a
  whole army cheaply). Modeled as a second, flatter cost field the aerial-capable settlements read.
- UNIFYING: all three are modifiers on the ONE base cost field, frozen at canonize (teleport links
  = authored edges; airship capability = a per-settlement flag enabling the aerial layer; isolation
  = derived connectivity). Determinism + dormancy + magic-opt-out + premium all hold. Each keeps a
  counterforce: isolation↔sea/air/teleport access; teleport-power↔single-point-of-failure + magic
  dependency; airship-interdiction-defeat↔air-superiority requirement.

## 4f. Rumors & News — the information layer / the telephone (owner, round 8)
The §3 propagation layer given NARRATIVE CONTENT + FIDELITY DECAY. Information is a CONTAGION
that rides the trade network and DEGRADES as it travels — a game of telephone. This is the
single most DM-usable output of the whole spatial engine: "what your players have heard" vs
"what actually happened," spatially grounded, with unreliability pre-computed and causally
justified. A settlement-level **Rumors & News** tab inside the World tab surfaces it.

**The core loop (owner's model, verbatim intent):**
- An EVENT occurs at an origin (site zero) — war/conquest/deity activation/famine/founding/
  scandal/corruption-reveal/siege/notable-death. The engine already emits these (worldPulse,
  causeLifecycle W-C5). Not all travel — a SIGNIFICANCE gate (magnitude × drama) decides whether
  an event enters the rumor network and HOW FAR it travels before fading (big news travels far;
  routine ticks — "+3 residents" — never leave town). *This significance gate doubles as the
  event-triage/aggregation layer the external review asked for: only signal propagates; local
  noise stays local.*
- The next trade CARAVAN leaving site zero after the event CARRIES the rumor (the §4 invisible
  in-transit ledger — same caravans, now with a payload of news). On arrival it INFECTS the next
  settlement's rumor mill, which RE-EMITS to its own onward trade partners. Propagation is
  HOP-BY-HOP over the sparse trade graph with an already-reached guard (the exact perf-safe shape
  the grounding critique demanded — never origin-to-all-N broadcast). LATENCY = the caravan's
  travel weeks (round-6 cost→weeks): a distant settlement hears the news LATE.
- It POPULATES the settlement dossier's Rumors & News tab as an item whose COMPLETENESS/ACCURACY
  is a function of how far down the telephone chain that settlement sits.

**CARRIERS — trade dominates peacetime, but SEVEN channels carry news (owner, round 9).**
Information propagates over a UNION of channel-topologies, each with its own GRAPH, SPEED,
FIDELITY profile, BIAS (= a §4f distortion operator), and NEWS-TYPE affinity. The Rumors & News
tab aggregates what arrives via ALL of them; the MIX shifts with circumstance.
- TRADE (dominant, PEACETIME) — the trade route graph; broad reach, moderate fidelity (the
  telephone), merchant bias; carries commercial + general news. The bulk carrier when routes are open.
- ARMIES (WARTIME) — follows DIRECTED army movement (not a network); martial bias; carries FRONT
  news (battles, troop movements, sieges) + its own campaign's PROPAGANDA. An army moving through a
  peaceful region brings the war with it.
- REFUGEES (round-5 migration) — follow migration routes (toward safe/similar/prosperous); they ARE
  the news of their origin's collapse — high emotional salience, distortion biased toward CATASTROPHE
  (traumatized, exaggerated). A refugee wave is a propagation front of "something terrible happened at X."
- FAITH NETWORKS — pilgrims / missionaries / clergy over the RELIGION graph (co-religionists, a
  SEPARATE topology overlaid on geography — reaches across political/trade boundaries); faith bias
  (reframed in the deity's lens); carries religious news (a miracle, a heresy, a schism, a W-C4
  deity activation). News travels to fellow believers even where no trade goes.
- COURIERS — dedicated POINT-TO-POINT carriers (diplomatic dispatches, proclamations, guild post):
  faster, TARGETED (sender→specific recipient, not broadcast), HIGH fidelity (a written sealed
  letter resists telephone decay), low distortion — but INTERCEPTABLE (a captured courier = the
  message doesn't arrive + intelligence to the captor). Institutional/premium (a postal/courier institution).
- CRIMINALS (round-4/6/7 smuggle network) — the UNDERGROUND channel: follows the smuggle network
  (thrives in embattled/high-crime/corrupt regions), reaches the underworld ACROSS gates that block
  official trade; carries illicit news + black-market intelligence. Public face = low-fidelity
  whispers (rumor), but the network itself may hold HIGH-fidelity spy intelligence.
- MAGIC — teleport circles (round 7: instant, high-fidelity, zero hops) + scrying/sending: the
  fastest, most accurate channel where it exists, TARGETED, but MAGIC-gated (none in a magic-opt-out
  world), rare/premium, limited reach (only where magic infrastructure is).
- WARTIME↔PEACETIME SHIFT (the payoff): in peace, trade carries the bulk (broad, moderate fidelity).
  As routes are cut (embattlement/siege), the surviving news shifts to armies (front), refugees
  (catastrophe), couriers (if not intercepted), smugglers (underground), and magic (if any). A
  BESIEGED settlement's information DIET changes — it stops hearing merchant news and hears only what
  refugees/smugglers/magic bring: the round-8 "goes dark" made precise (dark to trade, not to the
  underground). And CHANNEL DIVERSITY *is* the §4f cross-confirmation mechanism — the entrepôt hears
  an event via trade AND couriers AND faith AND refugees and triangulates; a one-channel town cannot.
- NEWS-TYPE AFFINITY: an event's TYPE steers which channel carries it best — economic→trade,
  military→armies/couriers, disaster→refugees, religious→faith, diplomatic→couriers, illicit→criminals,
  any-fast→magic/couriers. So a religious schism reaches a trade-less town via pilgrims; a market
  crash reaches it via merchants; each channel is blind to the news it doesn't carry.

**INFORMATION-QUALITY VECTOR (owner, round 12 — supersedes scalar "fidelity"; all axes CONFIRMED,
architect additions PROMOTED by owner 2026-07-11).** Information is NOT "payload + one fidelity
number." It is a VECTOR of SEPARABLE, ORTHOGONAL properties that decay INDEPENDENTLY (any combination
possible), in three groups:
- CONTENT — what the message says, how true, how spun, and whether it is STILL true:
  • COMPLETENESS — how much of the original REMAINS (details retained vs dropped).
  • ACCURACY — whether the RETAINED facts are CORRECT (a fact can survive intact yet be WRONG).
  • FRAMING — how the facts are INTERPRETED (the lens/spin; the §4f distortion operators live here).
  • TIMELINESS / RECENCY — the AGE: true-when-sent can be STALE-now because the world MOVED (an army
    acts on where the enemy WAS; an ally is defended against a threat already passed). Orthogonal to
    the other three (complete + accurate-when-true + unframed can still be FALSE-NOW). In a world that
    travels in WEEKS, the deadliest failure is a TRUE fact three weeks out of date — this is the axis
    that turns the §3 latency model from a mere delay into a RISK.
- TRUST — how much a receiver should BELIEVE it (feeds the §4g risk-assessment weighting):
  • PROVENANCE / CREDIBILITY — which source/carrier + how trustworthy (round-11 source reliability +
    manipulation risk). The packet MUST carry its source so the receiver can weight it.
  • CORROBORATION / CONFIDENCE — how many INDEPENDENT sources agree (§4f cross-confirmation). Separable
    from accuracy — you can be confidently WRONG (a falsehood arriving by five routes) or accurately-
    informed yet unable to trust single-source intel. The receiver's assessed P(accurate).
- STRATEGIC (world-level, not per-packet):
  • EXCLUSIVITY / REACH — who ELSE knows (secret vs public). What makes information VALUABLE (surprise
    = intel the enemy lacks, §4g); tracked across the world, defended by blackout/road-block (§4g).
The rumor packet carries the CONTENT + TRUST vector; each axis has its own decay rule + operators.
EXCLUSIVITY is a world-level derivation (how widely an event's rumor has propagated).

**ORGANIC DEGRADATION IS PRNG-GATED (owner, round 13).** The CONTENT-axis weathering (completeness/
accuracy/framing drift) is ORGANIC — a SEEDED PRNG ROLL per hop, NOT a fixed decrement. It is a
DISTRIBUTION, and the tails matter: a piece of news CAN survive PERFECTLY PRESERVED across the whole
map (RARE but real), and can also garble severely. So there are TWO distinct distortion SOURCES that
compose on every packet: (1) ORGANIC degradation — PRNG-gated, UNDIRECTED noise (the telephone), and
(2) INTENTIONAL distortion — alignment-DIRECTED, self-serving (round 11: evil distorts for gain,
framing bias). Final packet state = base content − organic PRNG weathering ± intentional directed
distortion of the relayers it crossed. SEEDED (per event/carrier/edge/hop fork, PART III §III.2-5) ⇒
the "roll" is deterministic on replay. Consequence: the SAME event propagates at DIFFERENT fidelities
down DIFFERENT chains (the eastern chain garbles, the northern preserves) — so §4f cross-confirmation
has real work to do, and the rare perfectly-preserved long-range truth is a genuine (lucky) event.
Timeliness is the exception — it degrades DETERMINISTICALLY with distance/time (age is not a roll).

**Fidelity decay — HOW each axis degrades (the layered model; maps onto the vector above):**
1. COMPLETENESS decay — details drop. The event has structured fields (who/what/where/when/
   magnitude/cause); each hop, low-salience fields have a seeded chance to fall away. Hops 1–3 ≈
   complete or lightly lacking; far hops know only "there was a battle near X," not who won or why.
2. DISTORTION / mutation — fields ALTER, not just drop (the "way off base" case): a name garbles
   or swaps for a more famous one; magnitude inflates/deflates (500 dead → "thousands" or "a
   scuffle"); cause gets reattributed (a famine → "a curse from the gods"); winner/loser can flip.
3. CROSS-CONFIRMATION (the corrector) — a settlement that receives the SAME event via MULTIPLE
   INDEPENDENT routes gets HIGHER fidelity (the versions triangulate). So the §4b ENTREPÔT — the
   crossroads many routes cross — is not just economically central but INFORMATIONALLY central:
   the best-informed place, a rumor CLEARINGHOUSE. A settlement at the end of one long single
   chain gets the most degraded version.

**What COLORS the distortion — every other system becomes a distortion operator:**
- FAITH bias — a rumor passing through a deity-X settlement is reframed in X's lens (a victory →
  "X's blessing"; a plague → "X's punishment of heretics").
- POLITICAL/allegiance bias — passing through settlements under governing power Y, it spins toward
  Y (round-7 governance/allegiance: the conqueror's loyal towns tell conquest as liberation; the
  old regime's tell it as atrocity).
- CULTURE-DISTANCE bias — the more culturally distant (round-6/7 `cultureDistance`) the receiver
  from the source, the more it garbles (foreign events misunderstood, re-framed to local sense).
- HOSTILITY bias — a rumor about an enemy, received in a hostile settlement, distorts ADVERSARIALLY
  (exaggerate their defeats, minimize their wins, impute malice).
- RECEIVER fidelity — a settlement with scholarship/a library/high legitimacy PRESERVES fidelity;
  high-corruption/low-legitimacy DISTORTS more; a spy/intelligence institution READS THROUGH the
  distortion (sees closer to truth than its hop-distance would give). So the SAME event arrives at
  two settlements as two different STORIES because it crossed different faiths, powers, cultures.

**"News" vs "Rumor" = the two ends of the fidelity spectrum.** The one system renders a fresh,
close, cross-confirmed arrival as NEWS and a stale, distant, single-chain, distorted arrival as
RUMOR. The tab name "Rumors & News" is literally the fidelity axis.

**DM vs PLAYERS — information asymmetry as the product feature (mirrors the faith seam):**
- The tab shows the rumor AS THE SETTLEMENT BELIEVES IT (player-facing, shareable, the lower-tier
  surface). For the DM ONLY (premium/DM-gated, exactly like the FaithSection deity-name seam):
  the GROUND TRUTH (what actually happened), the PROVENANCE (hops, which route, what got dropped/
  mutated), and the CONFIDENCE. The DM runs the table on the players' partial/false picture while
  knowing the truth AND precisely where the players are wrong. Free/anon/lapsed never get the
  omniscient view — they see only the in-world rumor. (Premium law holds: tier never touches
  generation; premium unlocks the DM's-eye reveal.)

**Time — rumors live, get corrected, entrench, fade (ties to W-C5 causeLifecycle):**
- Rumors have a LIFESPAN — hot when fresh, fading with age. A later, more complete arrival can
  SUPERSEDE/CORRECT an earlier one (a correction propagates BEHIND the original: "the general we
  heard dead is alive"). When a cause RESOLVES (W-C5), the resolution propagates as a follow-up.
- ENTRENCHMENT — a false rumor that arrives first and isn't corrected can become "known" locally
  (esp. in low-fidelity / culturally-distant / isolated settlements): a persistent local
  misconception the DM can exploit. A feature, not a bug.

**Isolation & movement modalities (round 7) read straight through:**
- NO TRADE ⇒ NO RUMOR MILL (owner, explicit). An isolated settlement is informationally DARK —
  knows only local events + whatever the rare sea/air/teleport link brings. Isolation's FIFTH
  consequence: ignorance of the wider world. A BESIEGED settlement goes progressively dark as its
  routes are cut — a chilling, realistic siege effect (it stops hearing the world as it starves).
- TELEPORT CIRCLES carry rumors INSTANTLY and at HIGH fidelity (zero hops = no telephone decay) —
  a privileged accurate window on the linked partner even when land news is slow and garbled.
  AIRSHIPS carry news fast but still hop (aerial routes) — faster, not more accurate.

**Determinism / dormancy / performance / endogeneity:**
- DETERMINISM: rumor packets + distortion draws are seeded from stable composite forks
  (`rumor:${eventId}:${carrierId}:${hop}`, `distort:${eventId}:${settlementId}`); hop-by-hop over
  the sparse graph, already-reached guard, sorted mutation order. Same seed ⇒ same rumor mill.
- DORMANCY: no canon map / no trade ⇒ no propagation ⇒ settlements show only local events (today's
  behavior). Additive, materialized only when spatial trade is active; gated behind the spatial-
  canon marker. Rumors EXPIRE/decay so a settlement holds only its top-K live items (bounded
  ledger — the propagation-front balloon the grounding flagged is capped by significance + expiry).
- ENDOGENEITY: the rumor mill is WORLD-driven (events + trade), party-INDEPENDENT — the party
  RECEIVES rumors, never feeds propagation/fit math. (Party-as-carrier — the PCs spreading news as
  they travel — is a tempting FUTURE extension; the core stays party-independent to hold the law.)

## 4g. Belief-driven action — the fog of war closes the loop (owner, round 10)
Rounds 8–9 produce INFORMATION; round 10 makes settlements ACT on it — imperfectly — and their
actions become new information. This is the loop that makes the world self-driving and, more
importantly, STORY-GENERATING: stories come from actors deciding on incomplete/false information
and being wrong. The world stops being OMNISCIENT. Each settlement acts on what it BELIEVES; the
gap between belief and truth is where war, tragedy, and moral consequence live.

**THE MASTER LOOP:** event → propagates as rumor (§4f + round-9 carriers) → updates a settlement's
BELIEFS → drives a DECISION (weighted, PRNG-gated) → the action is a new event → propagates …

**THE CORE PRIMITIVE — per-settlement BELIEF STATE.** For a settlement to act on what it believes
(which differs from truth), it holds a BELIEF MAP: its own possibly-wrong model of the world —
what it thinks other settlements' readiness / alignment / faith / ALLIANCES / intentions are.
Bounded (only settlements it has news of — its informational neighbourhood), derived
deterministically from propagation, distorted by §4f fidelity. This is round 10's biggest new
structure. The DM sees GROUND TRUTH + each settlement's BELIEF MAP + the DIVERGENCE — i.e. watches
misunderstandings brew ("B believes A is about to attack — false — and is about to preempt").

**A SETTLEMENT IS A POLITY, NOT ONE ACTOR — the belief map is FACTIONAL (owner, round 14 — corrects
the round-10 framing).** "The settlement believes X" FLATTENS the factional richness the engine already
models. WHO believes? ruler / council / merchants / clergy / military command / criminal network /
public / bureaucracy — each with DIFFERENT sources, incentives, and information QUALITY. THE KEY
INSIGHT: the round-9 CARRIERS ARE THE FACTION INFORMATION ORGANS — each faction is fed by its own channel:
- TRADE carrier → MERCHANTS (know a road is unsafe before the mayor does).
- ARMIES / couriers → MILITARY COMMAND (accurate troop reports, poor food-price intel).
- FAITH network / pilgrims → CLERGY (news arrives via pilgrims).
- SMUGGLE network → CRIMINAL network (smuggling routes invisible to formal authorities).
- ambient REFUGEE / public rumor → the PUBLIC (believes the distorted version).
- diplomatic COURIERS → GOVERNMENT / bureaucracy.
So faction belief maps are NOT new work — they are the NATURAL PARTITION of the information the carriers
already deliver; the single settlement map was an over-simplification that DISCARDED the carrier↔faction
alignment the design already had.
- V1 (do NOT block on this): ONE canonical belief map, defined EXPLICITLY as THE GOVERNING COALITION'S
  CURRENT OPERATIONAL BELIEF (governingName + its supporting factions), NOT "the objective settlement
  mind." It drives the settlementStrategy chooser (PART IV). BUT the data model carries an OPTIONAL
  FACTION KEY from DAY ONE so the seam is real, not retrofitted:
  beliefMaps[observer][factionId?][subject], factionId defaulting to the governing coalition.
- EXTENSION (where relevant — not every settlement needs all six): per-faction belief (government /
  military / merchant / religious / public / criminal), each fed by its carrier(s) + INTRA-settlement
  intel sharing (round 11 applied INTERNALLY — factions share/withhold from each other, alignment-colored).
  Then: the GOVERNING COALITION sets STRATEGIC action (its operational belief = the v1 map); other factions
  create (a) DISSENT — belief diverging from the coalition's is an internal STRESSOR (ties stressorDynamics
  / council_schism / legitimacy); (b) LEAKAGE — a faction leaks its private intel to the public (rumor), to
  another faction, or OUTWARD to an enemy (round-11 betrayal at settlement scale, via the per-institution
  corruption/compromise system); (c) ALTERNATIVE ACTIONS in its own domain (merchants reroute trade, clergy
  send missionaries, the criminal net runs smuggling, a faction stages a COUP if belief + power justify it).
- WILLFUL IGNORANCE: "the ruler deliberately ignores accurate information" = a government-faction belief
  that WON'T UPDATE from a better-informed faction — a disposition/corruption trait (epistemic closure),
  itself a modeled behaviour and a CAUSE (W-C5) of misjudgment + eventual dissent.
This makes MISJUDGMENT (round 10) FACTIONAL — the coalition acts on ITS belief while ignoring a better-
informed faction (the mayor marches because he ignored the merchants) — a failure of INTERNAL information
flow, not just external fidelity. Preserves tractability (v1 = one map) without ever assuming a single
settlement mind in the data model.

**THE WAR-DECISION MODEL (the heart):** a settlement's posture is a THREAT ASSESSMENT over its
BELIEFS, not over ground truth.
- Owner example A: A & B hostile; A ramps war readiness. B (by TEMPERAMENT) may not react — UNTIL
  it HEARS a rumor that A is ramping to strike it or an ALLY. Then B ramps too, and (aggressive
  temperament + high perceived threat + PRNG) may launch a PREEMPTIVE STRIKE to catch A off guard.
- Owner example B: B marches on A who NEVER HEARD a rumor (no channel reached it — round 9), never
  ramped, defenses lacking → B achieves a SIEGE before A even knew. INFORMATION STARVATION is a
  military vulnerability, and it is exploitable.
- Decision weights: TEMPERAMENT (aggressive/cautious/pacific), CURRENT DYNAMICS (relationship/
  hostility), PRIOR HISTORY (past wars/betrayals), CULTURE DRIFT (round 6/7 distance), ALIGNMENT,
  READINESS — over the BELIEVED threat, scaled by the rumor's CONFIDENCE. Escalation ladder:
  do-nothing → ramp readiness (defensive) → preemptive strike (aggressive) → mobilize to defend an ally.
- MISJUDGMENT is first-class and PRNG-gated, scaled INVERSELY by confidence: low-fidelity info ⇒
  higher chance of a WRONG call (attack on a false/exaggerated rumor, over/under-react). So the
  QUALITY of a settlement's information determines the QUALITY of its decisions — the well-informed
  entrepôt (§4f cross-confirmation) acts soundly; the ill-informed backwater blunders into war. A
  FALSE rumor can start a REAL war. The misjudgment is a legible CAUSE (W-C5).

**INFORMATION-ASYMMETRY EXPLOITS (the strategic layer) — SPEED vs INFORMATION is a race:**
- SURPRISE: strike before the target hears. If the army outruns the rumor of its own mobilization,
  the defender can't ramp. Round-9 carrier SPEEDS become strategically central.
- ROAD-BLOCKING (owner): an army on a road BLOCKS trade/rumors BEHIND it — its own movement
  suppresses the warning that would precede it (generalizes §7 interception to INFORMATION).
- TRADE BLACKOUT (owner): a settlement can temporarily block ALL trade in/out to DENY the enemy
  intelligence about its preparations (or deny its own people destabilizing news) — information
  denial as strategy. Mobilization is itself a rumor-generating event; blackout + road-block + a
  fast army is the play to WIN THE RACE and preserve surprise.

**STATE-CHANGE NEWS — not just events, but changes of NATURE, and they can be WRONG:**
- RELIGION / ALIGNMENT changes propagate (a conversion, an alignment drift), distorted ("they
  converted" heard as "they've fallen to a dark cult"). Neighbours update BELIEFS ⇒ cultureDistance
  (§II.5-2) + hostility shift ⇒ trade/migration/faith adjust.
- ALLIANCE / RELATIONSHIP state is ITSELF propagated info and can be STALE/FALSE — a settlement may
  believe X & Y allied when they've secretly broken, or not know Z joined the enemy. ALLY CONFUSION:
  • ALLY-DEFENDS-AHEAD (owner): A mobilizes to defend ally B (A heard B is threatened) while B does
    NOT know A is coming, or doesn't even know it's threatened — asymmetric ally awareness (A rides
    to rescue an oblivious or startled B).
  • WRONG INTERPRETATION (owner): A's DEFENSIVE march is misread as AGGRESSION by a culturally-
    distant/hostile observer C (§4f hostility distortion) ⇒ C launches a preemptive strike thinking
    A comes for them ⇒ a CASCADING misread war nobody intended. The richest emergent drama in the design.

**MORAL DRIFT FROM UNJUST ACTION (owner, delegated to architect):** a settlement that INSTIGATES a
conflict while IN THE WRONG (acting on a false rumor, attacking a non-threatening/innocent target)
suffers ALIGNMENT DRIFT — sharpest for a LAWFUL-GOOD actor (the gap between professed alignment and
the unjust act). Magnitude scales with WHO it is against (innocent/weak/ally = worse) and PAST
RELATIONS (a former friend = worse). Wires to W-C2 CONSCIENCE (already forecloses immoral conquest),
the corruption/compromise system, and W-C5 (the unjust war becomes a CAUSE driving further drift or
a later reckoning/reform). The fog of war becomes MORALLY LOADED: a good settlement DECEIVED into an
unjust war pays a moral price — the tragedy of the well-intentioned deceived, and a self-correcting
arc (drift → reckoning, or a spiral).

**TELEPORT-TRADE CONSTRAINT (owner, round-7 refinement):** an ISOLATED teleport-circle settlement
can trade ONLY via its circle, and ONLY with OTHER circle-holders that are NON-HOSTILE to it.
Isolated + circle + ≥1 friendly circle-holder ⇒ trades/shares info through the circle network (a
gate-bypassing, geography-independent bloc). Isolated + circle + ALL other circle-holders hostile ⇒
FULLY cut off (the circle is dead weight without a willing counterpart). The teleport network is
thus a CLIQUE OF THE WILLING — a magical trade+intelligence bloc transcending geography but bounded
by DIPLOMACY; for allies a high-fidelity geography-independent intelligence channel (round-9 magic),
for the friendless-isolated, useless.

**TELEPORT-BLOC ECONOMICS under siege (owner, round 11).** A circle link is SIEGE-PROOF — it is not a
land route, so the besieger cannot cut the EDGE, only STARVE the NODE. So a besieged circle-holder
STILL trades/shares with its bloc — but BOTH sides suffer: the besieged node's own land-trade is cut,
so it contributes LESS into the bloc (node-starvation), and a partner that depended on it receives
less. This is the round-3 supply network run on an UN-INTERDICTABLE topology: node-starvation is the
ONLY attack vector on a circle edge. Emergent (and legitimate) strategy: a NETWORK of isolated circle-
holders whose collective outputs COVER each other's inputs is SELF-SUFFICIENT and land-siege-immune —
a well-composed bloc is resilient; an ill-composed one (all leaning on ONE land-trading member)
collapses in value the moment that member is besieged. The bloc's PROSPERITY is bounded by what the
bloc collectively produces, not by any road.

**ALLY INFORMATION-SHARING, ALIGNMENT-GOVERNED HANDLING & BETRAYAL (owner, round 11).** A DELIBERATE
ally-sharing channel, DISTINCT from the ambient §4f telephone: allies ACTIVELY share HIGH-CONFIDENCE
intel with one another at PRESERVED fidelity — matters of importance / national security. It is
directed (rides couriers/circles, not hop-degraded), TRUSTED (relayed faithfully, not garbled), and
CONFIDENCE-GATED (only high-confidence intel is shared as ACTIONABLE — you don't pass a vague rumor as
fact). So a well-allied lawful bloc has SUPERIOR collective intelligence: its members' belief maps
converge toward TRUTH via pooled intel (a strategic advantage — they act soundly, §4g misjudgment falls).
- ALIGNMENT GOVERNS HANDLING — this fills the §4f PASSIVE distortion operators with AGENCY, on a clean
  2-axis map onto the (derived) settlement alignment:
  • LAW↔CHAOS = FIDELITY of transmission. LAWFUL MINIMIZES mutation (faithful relay — records, honors
    the message; a HIGH-FIDELITY node that reduces the telephone weathering hop-to-hop). CHAOTIC is
    UNPREDICTABLE (high-variance — may embellish, garble, sit on it, or act rashly; adds NOISE).
  • GOOD↔EVIL = HONESTY / INTENT of transmission. GOOD shares TRUE for mutual benefit. EVIL DISTORTS
    for SELF-benefit — STRATEGIC, DIRECTED deception (feeds allies FALSE intel, manipulates the mill to
    its advantage; intent, not random noise).
- BETRAYAL / COMPROMISED-ALLY LEAK: a settlement shares based on who it BELIEVES is an ally (§4g belief
  map), NOT who truly is. A PRESUMED ally that has TURNED / been compromised is a LEAK — it relays your
  high-confidence intel to the REAL ENEMY, who uses it to TIP a war. Intelligence security becomes real:
  a cautious/lawful settlement VETS before sharing; a naive/trusting one leaks. Wires the belief-map's
  ALLIANCE accuracy + the corruption/compromise system (a compromised ally is an intel leak).
- THE DARK EMERGENT (the deepest moral↔information coupling): an EVIL settlement WEAPONIZES the layer —
  feeds FALSE high-confidence intel to a lawful-good neighbour ⇒ the neighbour acts on it ⇒ attacks
  unjustly ⇒ DRIFTS toward the manipulator's alignment (§4g moral drift). Evil corrupts good THROUGH
  information: the manipulator engineers the tragedy of the deceived-good actor, and profits.
- SUBSTRATE NOTE: this makes the absent SETTLEMENT-ALIGNMENT field (PART III §III.4-1) TRIPLY required —
  culture (§II.5-2) + moral drift (§4g) + info-handling (here) — reinforcing DERIVE-it-endogenously
  (governance + dominant faith + recent acts) over a new authored field.

**RISK ASSESSMENT IS THE UNIFYING FACULTY — information is its meta-layer (owner, round 11).** ALL of
the above "goes into risk assessment." Everything a settlement DECIDES already runs through a RISK
ASSESSMENT — the design has it in three places: routing cheap-vs-safe (§2/§6), army strategy/retreat
(§5), and the war threat-assessment (§4g). The information dynamics (rounds 8-11) are NOT a parallel
system; they are the INPUT-QUALITY dimension of that machinery. A risk assessment is now TWO layers:
- OBJECT risk — how dangerous is this route / enemy / trade / conversion — computed over BELIEFS
  (§4g belief map), NOT ground truth.
- EPISTEMIC risk (round 11) — how RELIABLE is the information behind the belief: CONFIDENCE (§4f
  fidelity — low confidence WIDENS the risk band); SOURCE RELIABILITY (round-11 alignment — a lawful
  ally's intel weighted up, a chaotic/evil source discounted/suspected); CROSS-CONFIRMATION (§4f —
  multi-source tightens the estimate, single-source is riskier to act on); and MANIPULATION RISK
  (round 11 — "could this be planted by an enemy?" is itself a risk term, and discounting for it is
  the DEFENSE against evil's weaponized false intel).
MISJUDGMENT (§4g) is precisely a FAILURE at the epistemic layer — acting on unreliable intel as if
certain. And the SAME alignment-governed faculty governs BOTH layers: the disposition that sets an
actor's PHYSICAL risk tolerance (§2/§6 — lawful/seasoned reads danger true, chaotic/rusty mis-weights)
is the SAME one that sets its EPISTEMIC weighting (lawful weights sources faithfully, chaotic
erratically, evil self-servingly). ONE risk-assessment faculty, two domains — physical danger +
epistemic reliability — the seam that UNIFIES the rounds 1-7 physical layer with the rounds 8-11
information layer into one decision model.

**INFORMATION IS PRIOR TO RISK ASSESSMENT (owner, round 12 — the strict ordering).** The foundation of
risk assessment IS information. The ordering is strict: the INFORMATION NETWORK comes FIRST and
constructs the believed picture of EVERYTHING a risk assessment needs — military might, siege
fortifications, supply-chain strength/resilience, alliances, trades — NONE of which an actor knows as
ground truth; it knows only what its network reported (each input carrying the round-12 quality
vector). ONLY THEN is risk assessment deployed, over that available (believed) picture. So there is NO
ground-truth input to any decision: every object input is itself belief-sourced. This SHARPENS the
"two layers" above — it is not object-risk-over-truth + epistemic-risk-on-top; correctly, ALL object
inputs are belief-sourced and epistemic quality is a property OF each input. Information is the
foundation; risk assessment is strictly downstream.

**DEPLOYED ARMIES as mobile information nodes (owner, round 12).** A deployed army GATHERS intel from
each settlement it reaches/passes (local reports) AND receives a directed stream from HOME — couriers,
stopped caravans, and reinforcements — updating its BEST COURSE OF ACTION, weighted by that intel's
quality. An army's decisions run the SAME §4g risk assessment on the information REACHING it: an army
far from home, its couriers intercepted (§4g road-blocking) and moving through hostile territory, is
INFORMATION-STARVED ⇒ mis-assesses ⇒ walks into traps / misjudges enemy strength. Blinding the enemy
army (cut its couriers) is a first-class objective. REINFORCEMENTS are just another army-in-transit
(§5): they travel roads + embattled/hostile regions BY CHOICE (the §6 cheap-vs-safe routing), take
ATTRITION through danger, and if they meet an enemy army en route it is a BATTLE / SKIRMISH (§5
collision, scaled to the forces). Reinforcement + courier + caravan together are the army's supply-and-
information UMBILICAL to home; severing it starves the army of both matériel and intelligence at once.

**ABSENCE OF INFORMATION IS INFORMATION — the most uncertain kind (owner, round 13).** Silence from a
route/direction/settlement is itself a SIGNAL — maximally AMBIGUOUS (cut off? besieged? fallen?
isolated? or just a delayed courier? — you don't know WHICH, only that something MIGHT have changed).
It is NOT a new channel or a "no-news message"; it is a DERIVED BELIEF-MAP property + the limiting case
of the TIMELINESS axis (§4f): for each settlement/route an actor cares about, track WEEKS-SINCE-LAST-
UPDATE; as silence grows, CONFIDENCE in the prior belief DECAYS toward MAXIMUM UNCERTAINTY, and that
rising uncertainty IS the signal the §4g/round-11 risk assessment reads. It DRIVES ACTION per
disposition: a cautious/lawful actor treats silence as danger (assume the worst about a silent ally/
front — ramp, or send a SCOUT/courier to probe, which closes the loop by generating a returning
report); a naive/chaotic one ignores it and is SURPRISED. It ties the whole design together: a
besieged/isolated settlement (§4e/§7) going DARK (§4f) is EXPERIENCED by its allies AS absence — the
trigger to decide whether to relieve it; §4g road-block/blackout WEAPONIZES absence (deny the enemy
news ⇒ engineer their uncertainty ⇒ their mis-assessment), but double-edged — silencing THEM also means
YOU may misread their silence (a fine settlement whose couriers were merely delayed reads as a false
alarm). Absence is the timeliness axis run to its limit: a belief with no update becomes, in time,
indistinguishable from no belief at all — and acting on that void is its own risk.

**ROUND 15 — RESTRAINT (owner): alignment shapes distortion STYLE (not amount); risk is a FRAMEWORK
(not one utility).** Two corrections that keep the model from collapsing into behavioral homogeneity.

(A) ALIGNMENT = a distortion STYLE / SIGNATURE — TENDENCIES, not deterministic moral laws. It changes
HOW distortion occurs, NOT merely HOW MUCH (SUPERSEDES the round-11 scalar lawful=faithful / chaotic=
noisy / evil=deceptive). Each alignment has characteristic STRENGTHS + WEAKNESSES via FIVE levers:
SOURCE PREFERENCE, willingness to ALTER FRAMING, UNCERTAINTY TOLERANCE, INCENTIVE TO MANIPULATE,
INSTITUTIONAL TRANSMISSION STYLE.
- LAWFUL ≠ accurate — fidelity to the OFFICIAL CHANNEL/PROCEDURE: preserves official errors, prefers
  stale formal reports, repeats propaganda faithfully, SUPPRESSES unauthorized truth, REJECTS credible
  informal sources. Reliable-but-BRITTLE (great at the official version, deaf to the informal truth that
  contradicts it).
- CHAOTIC ≠ incoherent — DECENTRALIZED/informal: fast, redundant, locally accurate, censorship-resistant,
  good at informal corroboration; but NO canonical version. Resilient-but-UNCANONICAL.
- EVIL ≠ deceptive — SELF-serving: an evil regime may keep RUTHLESSLY ACCURATE intel for ITSELF (it
  values control) while feeding OTHERS deception. Accurate-inward, deceptive-outward.
- GOOD may distort UNINTENTIONALLY — softens bad news, protects victims, AMPLIFIES MORAL framing.
  Compassionate-but-softening.
So a lawful and a chaotic settlement, given the SAME events, build DIFFERENTLY-SHAPED belief maps (the
lawful confident in its official — possibly wrong — version; the chaotic holding multiple noisy-but-
sometimes-truer ones), and their styles CLASH on contact (a lawful bureaucracy rejecting a chaotic
network's credible informal warning ⇒ misjudgment). Distortion has CHARACTER, not just magnitude — the
round-13 organic PRNG is the undirected noise; alignment-style is the SHAPE of the directed distortion.

(B) RISK ASSESSMENT = a FRAMEWORK, not one universal utility with coefficients (else technically elegant
but BEHAVIORALLY HOMOGENEOUS). Shared SHAPE: BELIEFS + OBJECTIVES + DISPOSITION + CONSTRAINTS → DECISION
SCORE. What DIFFERS is the OBJECTIVES, which are ACTOR/FACTION-SPECIFIC (ties round 14):
- MERCHANT council → revenue loss, route reliability, credit exposure.
- WARLORD → prestige, military opportunity, perceived weakness.
- CHURCH → heresy, legitimacy, sacred access.
- REFUGEE household → survival, distance, kinship, border hostility.
BELIEFS = the factional belief map (round 14); DISPOSITION = alignment/temperament (the 15A style + risk
tolerance + manipulation incentive); CONSTRAINTS = the physical layer (resources/readiness/geography/
funding). The governing coalition scores with ITS objectives (sets strategy); DISSENT (round 14) is now
DEEPER — factions see the SAME situation and reach OPPOSITE conclusions because they OPTIMIZE DIFFERENT
THINGS (merchants vs warlord on the same war), not merely because they hold different beliefs. IMPL: the
settlementStrategy SCORER must become OBJECTIVE-PARAMETERIZED (a pluggable objective set per actor/faction),
NOT one war-utility with coefficients; disposition.js supplies disposition, the belief map the beliefs, the
physical layer the constraints. Elegance WITHOUT homogeneity.

## 4h. Round 18 (owner rulings on the architect's gap review)
**(A) NO party-vantage concept — REJECTED; the per-settlement mill IS the table surface.** The party's
location is DM FLAVOR, not engine state. The Rumors & News tab serves the table directly: the DM holds
the full truth (the includeGroundTruth reveal); the party experiences the settlement's rumor mill as
written. The PLAYER-FACING surface is the EXISTING share-to-gallery pipeline: **sharing strips the DM
truth** (ground-truth/provenance/confidence fields removed) so players browse the rumor mill as the
settlement believes it. IMPLEMENTATION SEAM: this is exactly the PART III §III.2-4 whitelisted player
projection — applied at the gallery/publicSafe stripping seam (the same discipline that strips deity
fields today). ONE seam, already specced; no new party-position state anywhere. (Endogeneity untouched.)

**(B) NAMED-NPC EXCURSIONS — ACCEPTED, with the owner's protective constraints (BINDING):**
Named NPCs are the settlement's CAST; the dossier's integrity depends on them. So NPC movement is the
EXCURSION model, never emigration:
- HOME BASE IS HOME BASE. Named NPCs mostly STAY. When one relocates, it is a BOUNDED ROUND-TRIP with a
  DETERMINED duration (a week / a month / a season / a year — chosen deterministically at departure) and
  they RETURN home. Departure, arrival-at-destination, and return are EVENTS/hooks — including the
  natural party hook ("follow the envoy to X and back").
- PROTECTED TRAVEL. Named NPCs travel INDIVIDUALLY and are IMMUNE to banditry/attrition/travel mortality —
  they CANNOT die unnecessarily. The travel-risk layer (§6 danger terms) does NOT roll against them.
- THE RARE EXCEPTION is a STRESSOR, not a death: very rarely, an excursion is disrupted by a stressor-
  class event (detained, stranded, caught behind a siege) that RESOLVES — and when the stressor resolves,
  the NPC RETURNS. The disruption is itself a hook (rescue/escort/negotiate), tied to the W-C5 cause/
  stressor lifecycle so it always has a legible resolution path. Never a random grave on the road.
- IMPLEMENTATION: excursions ride the EXISTING movers (courier/caravan/pilgrim/refugee flows as carriers)
  as a payload — {npcId, purpose, destination, departTick, returnTick} on the in-transit ledger; the
  W-C5 lifecycle already creates the travelers (the exposed captain fleeing to a patron, the envoy, the
  missionary). While away, the NPC's dossier card shows the absence + expected return (legibility);
  the destination's dossier gains a visitor hook. Deterministic, bounded, conditionally materialized.

## 4i. The turning of the year — SEASONS (owner, round 19; architect expansion ratified-in-principle)
The 4-4-5 calendar's 13-week quarters BECOME the four seasons (spring wks 1-13, summer 14-26, fall
27-39, winter 40-52). Season is a PURE FUNCTION of the tick — deterministic, no roll. Seasons give the
world an annual HEARTBEAT: a recurring, endogenous stress test that fights the stasis finding without
any actor doing anything. The year itself becomes a character.

**THE FOOD YEAR (owner, verbatim intent — the core loop):**
- RENEWABLE natural resources (animals/hunting, fisheries, farming) cycle: ABUNDANT through the growing
  year → TEMPORARILY DEPLETED in winter → REPLENISH TO ABUNDANT in spring. Temporary, deterministic,
  biome-modulated (tundra harsh, temperate standard, coastal milder — amplitude from the canon biome).
- The GRANARY is the rhythm's buffer: food supply in winter depends on GRANARY STORAGE. Granaries REFILL
  their deficit through SUMMER and FALL (the harvest), DRAW DOWN through winter. Implementation: the
  EXISTING foodStockpile becomes the granary LEVEL; CAPACITY derives from tier/institutions/prosperity
  (a proper granary is infrastructure — derived, not authored).
- THE ANNUAL DRAMA CURVE this creates: FALL is the anxious season (did the harvest fill the stores?);
  EARLY WINTER is comfortable; LATE WINTER is the crisis point (stores run dry BEFORE spring — the
  historical "hungry gap"); SPRING is relief. A poor harvest + low granary at winter's onset = famine
  pressure → the whole downstream (§4c migration, mortality, unrest) — WITHOUT any war. And WAR COMPOSES
  chillingly: an army that burns or FORAGES a harvest in autumn (§5 forage/levy) inflicts a DELAYED
  catastrophe — war in autumn kills in late winter. The DM sees it coming for a season.

**WINTER TRAVEL — SLOW, NOT SEVER (owner, explicit):** winter applies a seasonal MULTIPLIER to the cost
field rather than closing routes — and it is MULTIPLICATIVE with terrain, so already-slow terrain
(mountains) degrades toward effective-impassability while plains merely slow. Nothing is hard-isolated;
everything is priced. DYNAMIC consequences compose across every layer:
- INFORMATION RUNS COLD: couriers/caravans slow ⇒ the rumor mill slows ⇒ timeliness (§4f) decays faster
  in winter ⇒ belief staleness and absence-uncertainty (round 13) RISE seasonally. News freezes with the
  roads. THE SPRING THAW becomes an annual INFORMATION EVENT — a burst of catch-up news as the passes
  reopen and a winter's worth of world arrives at once (the most immersive single consequence).
- THE CAMPAIGN SEASON EMERGES ENDOGENOUSLY: armies are never forbidden to march in winter — it is simply
  terrible (slow + supply consumption up + the granary math working against the mover). Wars naturally
  pause in winter and resume in spring BY COST, not by rule. A WINTER SIEGE becomes a starvation RACE:
  the besieged drain their granary faster while the besieger's supply lines crawl — brutal for both,
  historically exact.
- TRADE BREATHES: caravan volume drops in winter; import-dependent settlements lean on stockpiles;
  supply-starvation risk (§4) is seasonal; the entrepôt's warehouses matter most in February. (If SEA
  LANES are ratified: storm seasons close the cheap route in winter — the two decisions compose.)
- MIGRATION: fleeing in winter is desperation — §4c road mortality is seasonal; spring is the migration
  season. (Named NPCs remain excursion-protected per §4h — seasonality never rolls against the cast.)

**SEASONAL TEXTURE (the immersion layer — cheap reads off the season clock):** harvest festivals in
fall, midwinter rites, spring renewal — faith events keyed to the season (a harvest deity's great moment;
pilgrim traffic slows in winter with the roads); lean winters raise criminal desperation (crime pressure
seasonal — the crime↔security counterforce gets a rhythm); founding happens in spring/summer (the W-C3
founding lane gains a seasonal gate); institution activity reads seasonally (the mill after harvest, the
fishery in season) — display-level vocabulary, not new mechanics.

**INTER-ANNUAL VARIANCE (architect — the "no two winters alike" knob):** purely deterministic seasons
would make every year rhythmically identical. Layer RARE, SEEDED severity draws per (year, region):
a HARD WINTER (severity multiplier), a DROUGHT (summer replenishment partially fails), a BOUNTIFUL
HARVEST. Same discipline as organic rumor degradation (round 13): PRNG-gated, bounded, seeded fork
(`season:${year}:${region}`) ⇒ deterministic on replay, but the years differ — and a hard winter after
a war-burned harvest is an emergent catastrophe no one authored.

**ARCHITECT NOTE — SEASONS SPLIT ACROSS THE BUILD (important):** the food year is ASPATIAL — the
resource/granary cycle is populationDynamics/foodStockpile work and does NOT need the cost field. So:
- SEASONS-A (aspatial): resource cycling + granary rhythm + festivals/crime/founding texture — can ship
  EARLY (alongside/just after CL-0), gated as a CONTROL-LAYER DOMAIN MODULE (`seasonsEnabled` tri-state;
  default OFF ⇒ byte-identical; Living Realm+ presets turn it on — CL-0 just built exactly this seam).
- SEASONS-B (spatial): the travel/information/campaign-rhythm half — rides the keystone (a seasonal
  overlay on the cost field, versioned under the cost-law per §V.1's "seasonal passability").
Dormancy/determinism: season = f(tick); amplitude = f(canon biome); variance = seeded; OFF ⇒ prior bytes.

## 4j. Water — sea lanes, rivers, and the PORT rule (owner, round 20; settles the keystone reservation)
Water becomes the HIGHWAY it historically was — but access is EARNED, not free. The owner's rule:

**PORT ELIGIBILITY = GEOGRAPHY ∧ INSTITUTIONS (both required, both derived):**
- PROXIMITY: the settlement must be in CLOSE PROXIMITY to navigable water (coastal cell / river course /
  lake shore, read from the canon map — FMG already carries coastlines + rivers; the threshold is a
  digest-time derivation).
- CAPABILITY: the settlement must HAVE a water-access institution — mapped from the EXISTING institution
  catalog at build time (dock, harbor, shipwright, fishery, ferry, port authority — the build enumerates
  the actual catalog; no new authored flag).
- GEOGRAPHY IS NECESSARY, INSTITUTIONS ARE SUFFICIENT: a landlocked settlement can NEVER buy its way onto
  the water; a coastal settlement WITHOUT a dock is a beach, not a port — and can BECOME a port by
  FOUNDING one (the W-C3 founding lane gains its most consequential candidate: building a harbor changes
  the settlement's destiny). Ports are therefore fully DERIVED and can EMERGE mid-campaign.

**THE SEA/RIVER EDGE SET (the keystone schema reservation, now SETTLED):** water lanes are a SEPARATE
edge set in the frozen digest (the PART VI air/teleport pattern — optional sibling edge sets beside the
land cost field), materialized only when ≥2 eligible ports exist. Sea lanes connect eligible sea-ports;
river lanes connect river-ports ALONG the river course. Port = the settlement's WATER GATE (the §2 gate
concept, maritime).

**ECONOMICS — water is cheap and big:** water transport is the historical order-of-magnitude advantage —
LOW cost, HIGH capacity vs land. Consequences: PORT CITIES emerge as a distinct settlement destiny beside
the entrepôt (and a port-entrepôt is the richest thing on the map); the ISOLATION INVERSION is fixed — an
island with a harbor is a HUB, not a hermit (round-7 isolation now reads "no viable LAND route AND no
port"); import-dependent coastal towns lean on the sea lane their granary math assumes.

**EVERYTHING COMPOSES (each existing mechanic gains a maritime face):**
- SIEGE: a port city's interdiction now requires land AND SEA control (extends the round-7 air logic —
  "control the land and the air" becomes "…and the harbor"). NAVAL BLOCKADE = holding the water gate;
  a blockade-runner is the maritime smuggler (round-4 smuggle machinery, wet).
- PIRACY = maritime banditry: the §6 danger term on sea lanes, with pirate pressure as the embattlement
  analog for a lane; the smuggle network's sea arm moves contraband between ports that ban it (§4d).
- SEASONS (round 19 composes): STORM SEASON — winter closes/prices-up the cheap sea route exactly when
  the granary math bites; a port town that leans on winter grain ships is gambling with the §4i hungry gap.
- INFORMATION: ship crews are a FAST, LONG-RANGE rumor carrier between ports (a round-9 carrier variant —
  port-to-port news skips the land chain entirely; two ports gossip across a sea the land takes a season
  to walk around). Port cities become information brokers between coastlines.
- MIGRATION: refugees take ship where ports exist (§4c gains a sea route — with passage costs that make
  it selective); the desperate walk, the funded sail.
**V1 SCOPE (architect):** edges + port-gates + blockade/piracy as danger terms + the carrier variant.
NO fleet combat / naval warfare layer in v1 (a "sea interdiction" abstraction covers blockade; navies are
a future wave if ever). Determinism/dormancy: eligibility derived at digest time from canon map +
institution roster; re-derived on founding events; no ports ⇒ no edge set ⇒ prior bytes.

**Determinism / endogeneity / dormancy:** decisions are SEEDED PRNG over BELIEFS (themselves
deterministic functions of propagation) ⇒ same seed ⇒ same misjudgments ⇒ same wars. ENDOGENEITY:
settlements act on their own beliefs — world-driven, party-INDEPENDENT (the party observes; it does
not feed the decision math; party-as-rumor-carrier stays the opt-in future extension). DORMANCY: no
spatial info layer ⇒ no belief maps ⇒ decisions fall back to today's model; the belief-driven
decision layer is ADDITIVE, downstream of §4f + round-9 (build the rumor mill first, then this).

## 5. The military layer
- **Travel time** (weeks) along routes; terrain + readiness modulate speed. Armies advance a
  position each tick.
- **Collision.** Two hostile armies on crossing paths can meet BETWEEN settlements — a field
  battle, not a siege. Needs an army-transit ledger (position along path).
- **Combat resolution — bounded weighted PRNG.** Win probability = a sigmoid of the effective
  strength ratio (readiness × supplyQuality-equipment × size × funding × terrain/defender's-
  ground × travel-fatigue), CLAMPED so P(upset) collapses toward zero past a threshold — the
  owner's "no hand of miracle." A 10:1 force does not lose to a lucky roll. This is where W-C1
  rust/fidelity and supplyQuality finally converge.
- **Retreat / movement through enemy territory.** If a defeated or retreating army's route
  options include passing through ENEMY territory, that enters its strategy risk assessment;
  if the ONLY route is through enemy territory, treat that route as EMBATTLED for THAT SPECIFIC
  army (per-mover embattlement). Retreats become genuinely perilous.
- **Logistics.** The spatial layer narrows where armies must go, when to replenish/attack.

## 6. Embattlement — the unifying state
- **First-class region state** with a RAMP UP (recently occupied, under siege, freshly through
  a pyrrhic-scale war, high criminal activity — where appropriate) and a COUNTERFORCE DOWN
  (high internal security + falling crime graduate a region back out of embattled). Reuses
  occupation/siege/readiness/corruption as ramp inputs and the W-C3 moral/institutional machinery
  as the security↔crime counterforce.
- **Routing = cheap vs safe.** An embattled settlement/region on a route is ROUGH TERRAIN /
  UNSAFE PASSAGE. Trade, religious conversion, and military movement each run a RISK ASSESSMENT
  over candidate routes: a longer path may be SAFER; a cheaper path more DANGEROUS → costs more
  TIME, inflicts ATTRITION, and for TRADE sporadically (but NOT significantly) drops a shipment
  to banditry / wild beasts. Each mover weights cost-vs-safety by its own risk tolerance (the
  rust/fidelity model: lawful/seasoned reads the risk true, chaotic/rusty mis-weights).

## 7. Siege / blockade / embargo / interception — ONE model
Control of the route GATES, at three intensities:
- **Interception**: a caravan routed THROUGH a town occupied by or hostile to its FINAL
  destination is CUT OFF — the intermediary seizes the goods and denies them to the destination
  (seized goods can feed the interceptor as loot, gated by W-C2 conscience).
- **Blockade**: control of a key route.
- **SIEGE (redefined)**: TOTAL interdiction of the routes into a settlement ⇒ its consuming
  institutions starve as stockpiles deplete ⇒ cascading supply-starved impairments over weeks ⇒
  the settlement weakens and falls. A siege is a SUPPLY mechanic (starvation + time), not a
  hitpoint bar. This is how siege is explained from now on.
- **SMUGGLING — the counterforce to interception (owner, round 4).** Interception/siege is NOT
  a hard binary. Even through a hostile/occupied gate, a caravan gets a SEEDED PRNG CHANCE to
  smuggle through, weighted by a SMUGGLE NETWORK's strength, the goods (bulky/valuable = harder),
  and — critically — the intercepting gate's CORRUPTION (a bribed/compromised gate is a LEAKY
  one). This wires the criminal/corruption systems into the spatial layer: the recurring
  compromised-guard-captain lets shipments slip for a cut; a besieged settlement with smuggler
  contacts partially resupplies (a TRICKLE that slows starvation, not lifts it). The smuggle
  network's strength derives from the settlement's criminal opportunity / thieves-guild / criminal
  institutions (so high-crime and embattled regions are paradoxically MORE porous). Bounded like
  combat (no hand of miracle): a tight, honest siege has a very low smuggle rate; a corrupt loose
  one much higher. The DM is kept aware of smuggle networks as a factor (hooks: a ring supplying a
  besieged ally; a corrupt blockade captain running a smuggle op). Seized-vs-smuggled is the
  per-shipment roll; conscience (W-C2) still gates what the interceptor does with what it takes.

## 8. The DM authoring layer
- **Forced roads / trade routes** (§2) — authored low-cost edges overriding the terrain route.
- **Imported map images.** When a user imports a map image: the heightmap/overlay/biome editors
  flatten the whole map to a FLAT PLAIN and become a TRANSPARENT OVERLAY the user adjusts
  (texture) to resemble their imported map; after editing the overlay goes INVISIBLE unless
  drawn on again, so the imported image takes visual priority. ENGINE IMPLICATION: with an
  imported (flat) map, the spatial cost-field derives from the USER-DRAWN overlay/annotations
  (roads, biomes, terrain the DM paints), NOT image pixel-analysis (which would be fragile and
  non-deterministic). The DM authors the geography; the sim respects it deterministically.

## 9. The unifying architecture (the architect's synthesis)
- **One state, three intensities.** A region's embattled level IS its routes' danger term IS —
  at the extreme — a siege's interdiction. Embattlement, routing risk, and siege are ONE number
  and ONE ruleset, not three systems. This is the keystone that keeps the layer coherent.
- **One in-transit ledger, many payloads.** News, faith pressure, caravans, and armies are all
  "things moving along routes with arrival ticks." One aggregate ledger pattern serves all.
- **Danger is relative to the mover.** Per-mover embattlement (the retreating army; the caravan
  bound for its enemy) means the danger term is f(route, mover's allegiance/tolerance), not just
  the terrain.
- **Forces AND counterforces (the design's balance principle).** Every spatial force has a
  built-in counterforce, which is what prevents runaway and manufactures emergent equilibria +
  drama: movement ↔ friction (distance/terrain); embattlement ramp ↔ security/crime recovery;
  interception/siege ↔ smuggling; entrepôt toll-growth ↔ toll-greed self-correction (movers route
  around a greedy gate). Corruption is the hinge that connects them — a corrupt gate is both a
  greedy toll-taker AND a leaky smuggle seam, tying the criminal/corruption plane to spatial
  strategy.
- **Everything derives from canon.** Map (generated OR user-authored overlay) + established trade
  links + region ramp values ⇒ the whole spatial simulation, seeded and reproducible. The only
  randomness is the bounded, non-catastrophic banditry roll on trade. Dormancy holds throughout.

## 10. Risks / open questions
- **Combinatorics.** Per-institution × per-input × multi-source × in-transit must be AGGREGATE
  and bounded, or it explodes. One shipment record per active supply link.
- **Surfacing threshold.** Caravans/propagation are engine state; the art is choosing what
  becomes a DM-facing hook vs noise (same problem the living-world signals solved).
- **Feasibility check (BEFORE build):** what does OUR canon map state actually persist per
  settlement — x/y, terrain, a heightmap/cost field, user overlay annotations? The whole layer
  rests on reconstructing that geometry deterministically. Verify in the map/campaign store.
- **Combat-model tuning** needs a soak (envelope the upset-probability clamp so it never reads
  as a slot machine, per the "no hand of miracle" law).

## 11. The simulation CONTROL LAYER — the full sim is a CEILING, not a philosophy (owner, round 17)
The full spatial simulation is the engine's MAXIMUM CAPABILITY, NOT a mandatory campaign philosophy.
One causal model; the DM chooses how much geography, delay, misinformation, drift, and autonomy enters.
This directly RESOLVES the agency concern the empirical assessment surfaced (the world tends to
equilibrium under autoresolve, and autonomy shifts drama-generation into the engine): autonomy becomes
a DIAL, not a mandate. Turning any layer OFF PRESERVES all state (routes/beliefs/pending/history) — never
deletes.

**FOUR INDEPENDENT AXES (the core model — better than "spatial on/off"):**
1. Does GEOGRAPHY constrain interaction? 2. Does MOVEMENT consume time? 3. Is INFORMATION incomplete/
distorted? 4. May ACTORS decide without DM approval? — orthogonal, combine meaningfully (geography-but-
instant; slow-but-accurate; instant-but-distorted; imperfect-beliefs-but-DM-approval; autonomous-but-
omniscient). ARCHITECT NOTE: the four axes ARE the design's internal LAYERS decomposed — axis1 = cost
field/spatial graph (§2 / PART II); axis2 = cost→weeks latency + carrier speeds (round 6 / §V.2); axis3 =
rumor/belief/info-quality (rounds 8-16); axis4 = the settlementStrategy chooser + belief-driven action
(rounds 10-16). The control layer is the USER-FACING PROJECTION of the layered architecture — and the
layers are ALREADY separable (dormancy oracle, conditional materialization), which is exactly what makes
independent axes possible. The control layer VALIDATES the layering.

**5-PART CONTROL HIERARCHY:**
1. WORLD PROGRESSION (parent): Frozen (DM edits state manually) / DM-Advanced (changes only on DM advance/
   resolve) / Living (routine systems advance with time) / Autonomous (+ political actors initiate).
2. SPATIAL MODEL (3-4 levels, not boolean): Ignore Geography / Abstract Distance (nearby/regional/distant
   bands) / Mapped Geography (distance + basic routes) / Full Spatial (terrain cost/chokepoints/rerouting/
   interdiction/congestion/movement-modes). Ignore-Geography disables terrain-cost/route/chokepoint/
   attrition/entrepôt/blockade/isolation — trade/migration/religion/war still exist ABSTRACTLY.
3. TRAVEL + PROPAGATION TIME (separate from geography): Instant / Compressed / Standard / Slow / Custom.
   Human benchmark: "avg continent crossing = 1wk / 1mo / 2mo / custom" → a global movement multiplier.
   Advanced: per-domain speed modifiers (courier/army/caravan/migration/pilgrim/maritime/magical). DEFAULT
   = ONE global control (most DMs never tune seven carrier classes).
4. INFORMATION MODEL (MODES, not toggles): Omniscient (canonical state to all; disables distortion/lineage/
   corroboration/carrier-access/silence — factions still DISAGREE via different OBJECTIVES, not facts) /
   Perfect-but-Delayed (accurate but arrives by travel time; keeps surprise/response-delay/isolation/
   outdated-knowledge WITHOUT misinformation) / Unreliable News (wrong/incomplete/biased, simplified belief
   handling) / Full Information Simulation (carrier access + organic degradation + directed distortion +
   lineage corroboration + silence-as-uncertainty + factional belief maps + coalition reconciliation).
   ARCHITECT: Perfect-but-Delayed is the SLEEPER — it delivers the full STRATEGIC payoff (the round-12
   staleness→risk, the stale-army-position problem) WITHOUT the misinformation-management burden, is CHEAP
   (latency without the fidelity vector), and is likely the mode MOST DMs run. Build it FIRST of the modes.
5. POLITICAL AUTONOMY (resolves agency): DM-Decisions-Only (engine computes consequences, initiates no
   major action) / Recommendations (factions propose + explain) / Routine-Autonomy (ordinary auto, major
   need approval) / Full-Autonomy. Separate APPROVAL THRESHOLD (ask about minor/major/catastrophic/none).
   Routine-Autonomy = best active default. Auto: trade/couriers/minor-migration/ally-seeking/patrols/local
   outreach/info-gathering. Approval-required: war/coup/annex/raze/mass-expulsion/alliance-break/purge.

**DOMAIN MODULES (existing toggles → TRI-STATE, below the general controls):** war, trade drift, migration,
religion spread, diplomacy, disease, criminal, magic, culture, founding/abandonment. Each: OFF (engine
neither initiates nor propagates) / DM-DRIVEN (engine processes consequences after the DM introduces it) /
AUTONOMOUS (engine may initiate + propagate). KEY DISTINCTION: "autonomous war OFF" ≠ "DM can't create war"
— it means the engine won't INDEPENDENTLY escalate border tension into war; a DM-created war still resolves.
System-ABSENT vs system-AWAITING-DM-INITIATION, consistent everywhere. ARCHITECT: this grounds onto the
EXISTING simulationRules (settlementStrategyEnabled + war/trade/religion flags, normalizeSimulationRules) —
the booleans BECOME the tri-states; the control layer EXTENDS simulationRules, it is not net-new infra. The
tri-state can ship NOW, independent of the spatial engine.

**DEPENDENCY GATING (a CORRECTNESS property, not just UX — prevents meaningless/incoherent combos):**
frozen ⇒ hide autonomous/drift/propagation/auto-movement/periodic-belief-update (settings preserved, reactivate
on resume); ignore-geography ⇒ hide terrain/route/blockade/chokepoint/congestion/distance-mortality/isolation
+ limit travel to instant/abstract; instant-travel ⇒ hide speed-multipliers/latency/in-transit (geography may
STILL gate whether a route is possible/blocked); omniscient ⇒ hide distortion/lineage/corroboration/carrier-
access/silence (objectives + political disagreement REMAIN); faction-beliefs-off ⇒ read canonical OR one
polity operational belief; autonomous-war-off ⇒ hide independent-declaration/auto-escalation/auto-mobilization
but PERMIT DM-created wars + defensive consequences + approved mobilization.

**PRESETS (essential — most users never touch the dependency tree; presets POPULATE the settings, modifiable
without losing coherence):** STATIC CAMPAIGN (generator + recordkeeping: DM-advanced / geo-ignored / instant /
omniscient / DM-only / drift-off) · NARRATIVE CAMPAIGN (authored, reacts without taking over: DM-advanced /
abstract / compressed / perfect-but-delayed / recommendations / selected-drift) · LIVING REALM (best general
default: mapped-geo / standard / unreliable / routine-autonomy / major-approval) · FULL SIMULATION ("Dwarf
Fortress mode": full cost field / physical time / complete carrier+belief / autonomous / all domains) ·
CUSTOM. ARCHITECT: the presets ARE the incremental BUILD MILESTONES — DM-Decisions-Only IS TODAY (the
empirically-verified current build = the bottom corner of the control space); LIVING REALM (perfect-but-
delayed + mapped-geo + routine-autonomy) ships the STRATEGIC CORE (fog-of-war via delay + geography +
autonomy) WITHOUT the full distortion/belief machinery — a shippable product milestone BELOW full simulation.
Build UP the axes; every level is shippable and useful.

**CANONICAL + VERSIONED (these change the LAWS of campaign history, not cosmetic prefs):** record which rules
were active, when a setting changed, which pending processes were affected, and which rules produced each
result — a RULESET-CHANGE RECEIPT (the §V.1 cost-law-versioning + route-receipt discipline, generalized to
ALL rules). On a rule change affecting IN-FLIGHT movement: DM policy (preserve-existing-arrivals / recalculate
/ apply-to-new-only); SAFEST DEFAULT = preserve existing, apply new PROSPECTIVELY (never retroactively rewrite
history). Same for enabling imperfect-info midway: historical reports without lineage CANNOT gain provenance —
apply prospectively. ARCHITECT: the ruleset becomes another VERSIONED axis alongside geometry/cost-law/overlay
(§V.1), living in the canonized worldState under the spatial-canon marker, same freeze-old/apply-new discipline.

**THE PRODUCT PRINCIPLE (binding):** controls describe FICTIONAL ASSUMPTIONS, not engine internals. GOOD:
"Ignore distance" / "News is always accurate" / "Major actions require approval" / "A continent takes one
month to cross" / "Trade relationships change autonomously". BAD: "Disable cost-field digest" / "Bypass packet
lineage" / "Set reconciliation coefficient" / "Disable independence weighting". The DM chooses WHAT KIND OF
WORLD; the engine chooses the correct implementation. (This is ALSO a correctness guard — a DM cannot set
distortion-on / lineage-off; the mode grouping guarantees a coherent mechanism set.)

**PLACEMENT (owner):** the controls live on the REALM PAGE (campaign-scoped world laws). Grounds onto the
EXISTING SimulationRulesDialog (map/realm surface — the flat toggle list RP-1 just hardened with a focus-trap
+ mid-advance write guard): grow it from flat toggles into a preset-picker-prominent / advanced-axes-behind-
disclosure hierarchy.

---

# PART II — GROUNDING VERDICT (2026-07-11, verified against the tree)

Workflow wf_d0c0299d-226: 6 agents mapped each system the spatial layer must hook into
(file:line facts); 5 adversarially attacked determinism / cascade / dormancy / performance /
completeness. Headline: **the vision is coherent and the seams to attach to exist, but it is
NOT buildable as written.** It rests on one primitive the codebase does not have and the design
never chose how to build — a persisted, deterministic cost field — and four constitutional
axes (determinism, dormancy, cascade-stability, completeness) come back RED until that and a
handful of owner decisions are resolved. Every RED is fixable; none is fatal. The fix is
smaller and more disciplined than the full vision, and it converges on ONE move.

## II.1 The substrate reality (the feasibility check, answered)
What OUR canon map state ACTUALLY persists (mapSlice.js:98-123, campaignSlice.js:520-542):
- `fmgSnapshot` — an OPAQUE ~1MB base64 blob = the fantasy-map generator's native serialization.
  It is the ONLY carrier of terrain / heightmap / biome / river geometry, and **nothing in
  src/** parses it.** It is re-materializable only by injecting it back into the FMG iframe.
- `seed`, and `placements` = { burgId → { settlementId, x, y, cellId } } (x/y are FMG map-pixel
  coords; cellId is pack-relative, meaningful only against the same reloaded pack).
- `customBackdrop` (imported-image maps → a flat plain, NO cost field); `labels/markers/forests`
  (decorative pins/strokes — NOT terrain, NOT user-drawn roads); `layers/viewport` (render only).
- NOT PERSISTED anywhere engine-readable: a cost field, a heightmap array, per-settlement
  terrain/elevation, a distance matrix, road polylines (roads are DERIVED render-only), gates,
  or neighbour tiers.
- The ONLY routing code in the repo (sf-bridge.js:617-851) is a real biome/elevation/river
  cost field + A* — but it runs INSIDE the FMG iframe, async over postMessage, wall-clock-timeout
  bounded (RoadsLayer.jsx 20s), iteration-capped (MAX_ITER=25000, returns null on cap), over raw
  floats, and its output is discarded each session. It is the §2 math the design wants — in the
  wrong layer, under the wrong contract.

**Consequence:** §1's keystone — "the spatial graph is a PURE, seeded function of the canonized
map state ⇒ byte-identical sim" — is UNSATISFIABLE from persisted state today. This is THE
gating fact; rounds 2–7 all assume it is solved.

## II.2 The keystone move (resolves determinism + dormancy + premium at once)
Extract a FROZEN spatial digest ONCE, at the canonize seam, and make every advance a pure
READER of it. The seam already exists and already does exactly this shape for topology:
`canonizeCampaignWorld` (campaignWorldPulseSlice.js:187) stamps `worldState.canonizedAt` and
snapshots the aspatial `regionalGraph` beside it. The spatial digest slots in right there.
- **Port routing out of the iframe** into a pure seeded kernel module (lift landCost/seaCost +
  A*, sf-bridge.js:655-764). It must NEVER traverse the iframe bridge for sim.
- **Quantize to integers** at extraction (integer cost field, integer path costs) so route cost
  is exact and gate/neighbour-tier membership — a step function of cost — cannot flip on a float
  tie. Explicit A* tie-breaks (equal-f → lower cell index; equal-g → lower predecessor index).
- **Persist the digest as immutable canon DATA** in `worldState` (versioned + strip-migrated
  like the existing worldState discipline), treated like the fmgSnapshot blob: authored once,
  NEVER recomputed. Goldens pin the frozen digest, not a from-seed recomputation.
- Because the digest is authored at canonize and only READ thereafter, the advance is tier-blind
  and byte-identical across clients → **premium, dormancy, and determinism all fall out of this
  one decision.**

## II.3 The four RED breaks and their fixes
1. **Determinism (RED).** iframe/async/timeout/float routing → non-reproducible. FIX = II.2
   (pure kernel + frozen integer digest) + per-roll fork keys from stable composite keys
   (`fork('smuggle:'+shipmentId+':'+tick)`, `fork('scatter:'+sourceId+':'+tick)`,
   `fork('battle:'+[a,b].sort().join()+':'+tick)`), + sort every spatial entity set by codepoint
   id before mutating (conquestFeeds discipline), + thread the integer tick as the ONLY time
   source (extend the no-Date grep-gate to spatial/ — the tick-49 pulseKernel class of bug).
2. **Dormancy / premium (RED).** The proposed predicate (`canonizedAt` + a placement) is ALREADY
   TRUE for essentially every campaign in the wild → shipping would retroactively light up the
   installed base and break byte-identity, with NO entitlement seam on the advance path. FIX =
   gate on a NEW marker that did not exist before (`worldState.spatialCanonVersion`), stamped
   ONLY by an explicit spatial opt-in / re-canonize action, behind an entitlement read AT the
   store canonize call site (mirror the settlementSlice tier split; domain stays tier-blind).
   Old saves have no marker ⇒ stay aspatial ⇒ byte-identical. Write the digest under a NEW
   worldState key materialized only when the marker is present (don't bump mapState schema —
   that would rewrite every stored map on load and perturb the aspatial golden corpus).
3. **Cascade / stability (RED).** The "every force has a counterforce" claim does NOT hold on the
   prosperity/migration axis: (a) the megacity loop (entrepôt growth → prosperity → prosperity-
   gravity migration → more growth) is UNDAMPED — toll-greed self-correction damps a different
   sub-loop; (b) an EXISTING migration mode (`distributeMigrants` 'concentrated') dumps 100% of a
   region's refugees into destinations[0] in ONE tick — round-6 prosperity gravity would weaponize
   it; (c) the named chain-collapse damper (mortality, Σarrivals < migrants) DOESN'T EXIST and
   collides with the current population-conservation invariant + an existing abs*0.45 origin-loss
   proxy (double-mortality landmine). FIXES: add size-scaling congestion pushback (per-capita
   prosperity saturation, crowding-driven food deficit, rising crime with size) so a hub's pull
   DECAYS as it fills; forbid/ floor-scatter the 'concentrated' mode when spatial is active;
   build the §3 arrival-tick transport LAG first (lag is itself the stabilizer that smooths the
   wave); reconcile the 0.45 proxy vs new mortality (pick one) with a conservation-ledger soak
   asserting Σarrivals + Σdeaths == Σdepartures; give embattlement HYSTERESIS (enter>X, exit<Y,
   min dwell) + a continuous decaying scalar so it can't flip-flop tick-to-tick.
4. **Completeness / contradictions (RED).** Beyond the cost field: (a) the static-cached-routes
   claim CONTRADICTS §4b/§6/§4c/§5 all re-routing dynamically — resolve by splitting the cache:
   canonize-frozen BASE cost field + all-pairs base routes, then a per-DISPATCH re-weighting pass
   overlaying current tolls + per-mover danger, picking the route at dispatch (not per-tick);
   (b) cost→WEEKS is completely undefined yet §3/§4/§4c/§5 all need it — needs an owner calibration
   anchor; (c) culture-distance (§4c least-drift, §4d contraband) DOESN'T EXIST and §4d's claim to
   "reuse §4c's culture distance" is circular — owner must choose fold-into-faith/alignment vs a
   new persisted culture coordinate; (d) TERRITORY (the gate primitive for §4b/§4d/§7) isn't
   persisted — define it in the canonize extraction (Voronoi region / route cell-sequence); (e)
   define the per-gate event PIPELINE once (smuggle roll → interception seize → contraband
   confiscation → toll) since confiscation vs interception seize the same shipment via different
   conscience-gated paths; (f) smuggle = ONE per-shipment roll against the route's worst gate (not
   per-gate, or long hostile routes become impossible and contradict the "besieged trickle");
   (g) reconcile redefined SIEGE with the EXISTING blockadeTransport 'access' impairment +
   foodStockpile siege drawdown (generalize, don't double-count); (h) §8 imported-map flat-plain
   contradicts everything (no persisted overlay to route on).

## II.4 Performance (yellow — survivable with two fixes the doc omits)
- The "O(N²) shortest-paths cached" claim uses the WRONG algorithm. Do NOT compute all-pairs
  cell-level A*. Run ONE multi-source Dijkstra over the cost field seeded from ALL settlements at
  once → a Voronoi-of-settlements partition in O(cells·log cells), independent of N²; yields
  nearest-settlement per cell, territory, gates, and base distances in a single pass.
- Per-tick is NOT "just advance ledgers" IF §6 re-pathfinds per mover. Confine per-tick routing
  to RE-SCORING a small fixed set of candidate routes (k-shortest, cached at canonize) against the
  current embattlement field — never re-pathfind. Propagate fronts hop-by-hop over the sparse
  graph with an 'already-reached' guard (not origin-to-all-N broadcast). Pre-rank the K cheapest
  producers per (institution,input) once at canonize; per tick advance ledgers + fire arrivals.

## II.5 Owner decisions — SETTLED (2026-07-11; owner delegated 1/3/4 to architect judgment,
##       decided 2 explicitly). These are now BINDING; do not re-litigate.
1. **Cost→weeks calibration — SETTLED (architect judgment).** Anchor: a typical PRIMARY-tier
   (adjacent) hop ≈ **1 week**; SECONDARY ≈ 2–3 weeks; TERTIARY/distant ≈ 4+ weeks; the map
   DIAMETER ≈ one SEASON (~13 weeks). i.e. weeks = f(pathCost) calibrated so the MEDIAN inter-
   settlement hop is ~1–2 weeks and cross-map ~1 season, times readiness/terrain speed multipliers
   (§5). Consequence "a week-old event hasn't crossed the map" holds for anything past a primary
   neighbour — the design's intent. Retunable in the propagation soak; this is the starting anchor.
2. **Culture-distance — SETTLED (owner, explicit).** Culture is NOT ethnographic/civilizational
   identity (NOT "Germanic vs East Asian"). It is a **DERIVED behavioral/economic SIMILARITY** — a
   composite distance computed from state the engine already has, NEVER a new authored coordinate:
   - FAITH proximity (dominant-deity evil01/chaos01 axes, or a share-ledger cosine over
     religionState.deities — buildable today);
   - ALIGNMENT proximity (settlement alignment axes);
   - ECONOMY / WAYS OF LIFE (economic profile / dominant industries / wealth band / trade-route
     access — the settlement's economic character);
   - RECENT ACTIVITY + TRADE TIES (shared recent history + established trade relationships — two
     settlements that trade heavily and share events are "close").
   - GOVERNANCE DRIFT (owner, round 7) — political/governing similarity, TWO sub-terms over
     existing `powerStructure` state (governanceType / governingName / previousGovernments):
       (i) REGIME-TYPE distance, computed over three governance AXES so it works for whatever
       governanceType strings the generator emits (no hardcoded pair table):
         • CONCENTRATION of power — autocratic/single-ruler → oligarchic/council → popular/
           distributed → none (anarchy/lawless);
         • LEGITIMACY SOURCE — divine (theocracy) / arcane (magocracy) / hereditary (monarchy,
           feudal) / martial (junta, warlord) / mercantile (plutocracy, merchant guild) /
           popular (republic, commune) / tribal (clan);
         • RULE OF LAW — lawful-bureaucratic → personalist → lawless.
         Distance = weighted gap in that 3-axis space. So: two theocracies ≈ very close; theocracy
         vs magocracy = same concentration, ADJACENT legitimacy (both special-caste rule) ⇒
         moderately close; monarchy vs junta = same concentration, different legitimacy (hereditary
         vs martial); merchant republic vs plutocracy = close (mercantile + semi-distributed);
         anarchy = far from every concentrated form. "Some are more similar than others" falls out
         of the axis geometry rather than a lookup.
       (ii) GOVERNING-POWER IDENTITY — do they answer to the SAME sovereign/faction (governingName /
       allegiance)? Same overlord ⇒ close; RIVAL overlords ⇒ distant; HOSTILE rival overlords ⇒
       distant AND it feeds the §4c hostility axis (double push away). This makes CONQUEST matter
       for culture: when A conquers B, B's governingName → A's, so over the following weeks/months
       B DRIFTS toward A's governance even while its faith/economy lag — a long-horizon culture
       shift wired to the W-C2 conquest system. previousGovernments gives the drift a memory
       (a recently-conquered settlement still carries its old regime's residue for a while).
   So culture is ENDOGENOUS (emergent from belief + alignment + economy + behaviour + ties +
   governance), matching the engine's derived-not-rolled law. The §4c migration "least-drift" axis
   and the §4d "culturally-different" contraband gate BOTH read this ONE composite metric
   (`cultureDistance(a,b)`), built as a new pure selector over existing state — no new persisted
   culture field, no authoring.
3. **Imported / flat maps — SETTLED (architect judgment): option (b).** v1 restricts the spatial
   engine to GENERATED maps; IMPORTED-image maps stay ASPATIAL (byte-identical to today) until a
   real persisted terrain/road authoring layer is built later. Avoids the flat-plain degenerate-
   routing contradiction; the spatial-canon marker simply isn't offered for imported maps in v1.
4. **Cost-field construction — SETTLED (architect judgment): canonize-time one-shot extraction.**
   At the entitled canonize seam, run the existing iframe router ONCE over frozen placements and
   persist a FROZEN, quantized-integer spatial digest into worldState (immutable, never recomputed;
   goldens pin the digest). No headless FMG reconstructor for v1 — reuse the working router once,
   and the frozen-digest discipline is what makes replay byte-identical.

## II.6 The minimal coherent build slice (v1 — proves the seam, ships value)
The full 6-round vision is a program; the SMALLEST thing that delivers real value and proves the
determinism/dormancy seam is far smaller. Recommended v1 spine, in order:
1. **Spatial-canon marker + entitled canonize** (the dormancy/premium seam) — no behavior yet,
   just the opt-in switch + entitlement read + a persisted (empty) digest key. Goldens unchanged.
2. **Frozen integer spatial digest** at canonize: port the iframe router once, multi-source
   Dijkstra → per-cell nearest settlement, territory, gates, neighbour tiers, base distance
   matrix. Pure, seeded, quantized, persisted, immutable. This is the keystone; everything else
   is downstream.
3. **Distance/terrain modulation of what ALREADY propagates** — replace the aspatial regionalGraph
   weights in trade/faith/news with base-distance-weighted ones + cost→weeks latency (the §3
   propagation front). This alone makes the map govern the sim and is a complete, shippable story.
4. THEN, incrementally, the richer layers (embattlement routing, caravans/supply-starvation,
   migration w/ mortality, army transit + combat resolution, tolls/entrepôt, contraband/smuggle) —
   each its own fenced wave with its own soak, in roughly that dependency order. Migration-with-
   mortality and army-combat are the two highest-risk (conservation invariant; the war convergence
   point) and want dedicated soaks.

Sequence still holds: AFTER the reunification stabilizes the Realm surfaces. The determinism +
dormancy contract above is now nailed; the owner decisions in II.5 are the remaining gate.

---

# PART III — GROUNDING VERDICT for ROUNDS 7-10 (2026-07-11, workflow wf_b5680ccc-13d)

Verified rounds 7-9 (movement modalities, governance, Rumors & News, carriers) against the tree;
round 10 (belief-driven action) is NOT yet grounded (arrived after) — see III.5. HEADLINE: rounds
7-9 are MORE feasible than rounds 1-6 — the crown's substrate already EXISTS. But three structural
conflicts with the PART-II keystone must be resolved, and two of round 8's three invariants (dormant⇒
prior-bytes; premium) DO NOT hold as the doc wrote them. All fixable; the fixes SHRINK the build.

## III.1 Substrate reality (what the new layers can hook into)
- RUMOR EVENT SUBSTRATE (round 8) — **GREEN.** OUR Wizard News pipeline (src/domain/region/
  wizardNews.js) already IS the structured event substrate: a versioned typed `WizardNewsEntry`
  (tick/scope/significance/score/severity/kind/channelType/settlementIds/sourceEventId), a SALIENCE
  engine (scoreImpact/significanceForImpact — the round-8 triage gate, already load-bearing per
  chronicle.js), origin→target route traces (sourceSettlementId→targetSettlementId + pathSettlementIds
  on regional impacts), a bounded persisted ledger (campaign.wizardNews, MAX_ENTRIES=240), arc-
  threading (deriveNewsThreads), a per-settlement surface filter (WizardNewsPanel partitions "your
  settlements" vs "elsewhere"), and a module literally named `fidelityNoise.js` (a candidate distortion
  primitive — verify shape). The crown's substrate is built; round 8 is an ADDITIVE extension.
- CARRIER PROPAGATION (round 9) — **YELLOW, primitive exists.** `activeChannelsFrom(graph,id,{types})`
  IS "outbound edges of carrier-type T" — each of the 7 carriers is a types-filter over ONE directed
  graph; hop-by-hop decayed propagation exists (region/propagation.js). GAPS: 4/7 carriers net-new/
  half-present — FAITH as a distinct CO-RELIGIONIST topology is ABSENT (religious edges ride geographic
  carriers today, so faith can't reach believers where no trade goes — must be built); SMUGGLE is only
  authored-relationship-derived (no goods/gate/corruption discovery); ARMIES/REFUGEES don't move
  spatially yet (they ride their unbuilt movers).
- PREMIUM/DM REVEAL seam (round 8) — **YELLOW + a doc CORRECTION.** The reveal is NOT the FaithSection
  deity-name seam (that gates by DATA PRESENCE — fields stripped upstream). It is the `includeCovert` /
  `includeGroundTruth` READ-MODEL convention (mobilizationStatus.js / the W4h tradePressure.js): the
  same record exists; a pure `settlementRumors({worldState, settlement, includeGroundTruth=false})`
  selector decides whether to attach ground-truth+provenance. Build the rumor reveal on THAT pattern.
- GOVERNANCE (round 7) — **YELLOW.** Regime-type distance attaches via `factionArchetype()` (a 13-enum
  classifier) as the bridge from the free-string governance label to the 3-axis coordinate — but that
  archetype→{concentration,legitimacy,ruleOfLaw} table must be BUILT. previousGovernments[] gives the
  residue memory. **NO settlement-level ALIGNMENT field exists** (every `alignment` is deity-axis or
  NPC) — so both the culture "alignment axis" AND round-10 MORAL DRIFT have no substrate (the only
  regime-legitimacy signal is publicLegitimacy). This is a real gap + an owner decision (III.4).
- MODALITIES (round 7) — **YELLOW.** Airship = a per-settlement capability boolean gated like
  config.magicExists, additive like the proven simulationRules *Enabled flags (default off ⇒ byte-
  identical). Magic opt-out precedent exists (config.magicExists) for teleport suppression. BUT no
  connectivity/isolation DETECTION exists (isolation today = a user-chosen config string, not a
  Dijkstra by-product), and all three modalities still ride the PART-II cost-field keystone.

## III.2 The architectural refinements the stress-test forced
1. **The digest SPLITS in two (resolves the keystone conflict).** Round-9's faith co-religionist
   channel is keyed on LIVE mutable deity state and CANNOT sit in the ONE frozen cost-field digest.
   So the digest is TWO-TIER: (a) FROZEN GEOMETRY (cost field / territory / gates / neighbour tiers /
   distance matrix — immutable at canonize, PART II) and (b) LIVE CHANNEL OVERLAYS (faith co-
   religionist graph, governance, cultureDistance, embattlement) — recomputed each eval, made
   deterministic by pure-fn + codepoint-sorted iteration. This supersedes the PART-I implication that
   ALL channels ride one frozen graph.
2. **The FROZEN-vs-LIVE law (state it explicitly).** Geometry is frozen at canonize. Governance,
   culture, faith, and embattlement are LIVE reads SAMPLED AT THE HOP TICK and BAKED into the rumor
   packet at that hop — NEVER recomputed on read. Without this, a conquest mid-transit rewrites an
   in-flight packet retroactively and replay diverges. (This is the precise form of the round-7
   "culture is a live read" note.)
3. **Rumors: do NOT touch WizardNewsEntry.** Treating fidelity/hop/provenance as an additive schema
   bump BREAKS dormant⇒prior-bytes (campaign.wizardNews is written on EVERY advance for EVERY campaign
   with no spatial gate). Instead: put the rumor packet + a SEPARATE per-settlement rumor LEDGER (top-K
   by fidelity+recency+significance, tick-age expiry) under a NEW worldState key materialized ONLY when
   worldState.spatialCanonVersion is present. Keep realm news out of the rumor ledger (else rumor volume
   evicts real news from the global 240 feed).
4. **TWO records, whitelisted player projection (premium).** The omniscient source entry is DM/premium
   (includeGroundTruth). The per-settlement PLAYER belief is a DEGRADED projection from a WHITELISTED
   field set with value-level scrub — deity names ONLY when they resolve to an ACTIVATED public snapshot
   (never latentPantheon), causeClass/covert-corruption DROPPED. If the player sees the raw wizardNews
   entry, the whole DM-vs-player asymmetry collapses AND it leaks gated names. Non-negotiable.
5. **Determinism plumbing (round 8-9).** The news pipeline is deterministic TODAY only because it is
   PRNG-free / single-graph / depth-1 / globally-capped. Adding seeded distortion needs: a TOTAL order
   key `(tick desc, score desc, fidelity desc, compareCodepoint(packetId))` applied BEFORE any top-K or
   cross-confirmation fold (never fold incrementally during iteration); a REAL already-reached guard
   (a Set keyed `${carrierId}:${eventId}:${settlementId}` — the doc's stated shape doesn't exist in the
   forked code, which is maxDepth-1 + O(n) indexOf); distortion forked per (event,carrier,edge,hop)
   NOT per (event,settlement) — the latter defeats cross-confirmation independence AND omits the tick;
   thread rng.fork once at the pulseKernel confluence, codepoint-sort settlements/carriers/packets
   before ANY draw; extend the no-Date + unseeded-random grep-gates to region/ and the news append path;
   expiry keyed on `currentTick - entry.tick`, NEVER createdAt (wall-clock ⇒ golden flake).
6. **Cross-confirmation guard split.** CONTINUATION guard per-(event,carrier); RECORDING per-(event,
   settlement,carrier) — up to `carrierCount` bounded arrivals per settlement per event, so the entrepôt
   can triangulate without the propagation front ballooning.

## III.3 The build-order correction — the CROWN ships EARLY
Dependency inversion in PART-II II.6: Rumors & News (the owner's crown) was specced to ride five
UNBUILT movers (caravans, army-transit, spatial refugees, smuggle-runs, teleport), which buried it at
step 4 behind the two highest-risk waves. FIX — insert it as **STEP 3.5**, TRADE-CARRIER-ONLY:
- After II.6 step 3 (distance modulation), before embattlement/caravans/army/migration.
- Trade-carrier propagation + fidelity decay + the DM-vs-player reveal on the `includeCovert` seam +
  the additive-under-spatial-key ledger. Cutting trade edges already makes a besieged settlement go
  dark on the trade carrier (the round-9 info-diet shift, trade-only); the underground/front/faith/
  courier/magic carriers are LATER enrichment, each sequenced WITH its mover.
- This ships the single most compelling DM feature on the substrate that already exists (wizardNews),
  years before the full military layer. It is the highest value-to-effort wave in the whole program.
Then round 10 (belief-driven action) rides on top of the rumor ledger (III.5).

## III.4 New owner decisions surfaced (rounds 7-10)
1. **Settlement ALIGNMENT representation** — absent today, but REQUIRED by the culture alignment axis
   AND round-10 moral drift. Decide: (a) derive a settlement alignment from its governance + dominant
   faith + recent acts (endogenous, cheap, fits the derived-not-rolled law — RECOMMENDED), or (b) add a
   persisted settlement alignment field (authoring). Until decided, the moral-drift mechanic (round 10)
   and the culture alignment term have no home.
2. **Co-religionist faith topology keying** — recommend edges keyed on SHARED DOMINANT DEITY, CAPPED to
   k-nearest co-religionists by the frozen distance matrix (sparse + deterministic + still crosses
   political/trade boundaries). Explicitly NOT all-pairs (dense, breaks the sparse-graph perf budget).
3. **Non-trade carrier sequencing** — each of armies/refugees/smuggle/courier/magic ships WITH its
   mover wave, not up front. The wartime info-diet shift is a LATE feature, trade-dark being the v1 form.

## III.5 Round 10 (belief-driven action) — not yet grounded, but placed
Round 10 is the most DOWNSTREAM layer: it needs the per-settlement rumor ledger (step 3.5) AND a
per-settlement BELIEF MAP built on top of it, AND the absent settlement-alignment field (III.4-1) for
its moral-drift arc. Provisional placement: a wave AFTER step 3.5 and after the war/mobilization
mover exists (a settlement can only "ramp / preempt / defend an ally" once readiness + army-transit
are modelled). The belief-map primitive (a settlement's bounded, distorted model of others) is its
keystone and should be grounded before build — expect it to reuse the same per-settlement ledger +
the includeCovert reveal for the DM's "truth vs belief vs divergence" view.

---

# PART IV — GROUNDING VERDICT for ROUNDS 10-13 (2026-07-11, workflow wf_78289e7a-bd2)

The belief/decision/risk layer, verified. HEADLINE: rounds 10-13 are BYTE-ADDITIVE but require a
CODE RE-PLUMB — and every hard part already has a home in the tree. The engine is NOT a black-box
omniscient rules-machine: a real per-settlement DECISION chooser exists; it just reasons over ground
truth today. The belief map is the ONE net-new structure. Nothing here is a rewrite.

## IV.1 The central question, answered — the engine ALREADY decides
`settlementStrategy.js` (`evaluateSettlementStrategyRules`, gated `simulationRules.settlementStrategyEnabled`,
default OFF) is a real per-settlement chooser: it enumerates moves (defend/hold/deploy/sue_for_peace/
return_home), scores them, and softmax-samples one via a SEEDED per-settlement fork. So round 10
attaches to an EXISTING faculty — it is not new AI. Today it reads GROUND TRUTH at exactly THREE seams:
`buildStrengthLookup` (:111 — targets' TRUE strength, `margin = sStrength − strengthFor(targetId)`),
`contextFor` (:164 — hostileTargets/vassals from relationshipStates), and `isBesieged`/warFronts
(:101). Round 10 = interpose a per-observer BELIEF projection at those three reads; the softmax scorer
downstream is UNCHANGED. That is the whole attachment.

## IV.2 What already exists (the substrate is unusually ready)
- DECISION chooser — settlementStrategy.js (above). Attachment = 3 reads.
- DEGRADATION operator — `fidelityNoise.js` (fidelityFactor/chaosPull, alignment-conditioned, seeded
  fork, a NEUTRALITY THEOREM: forks NO rng + returns identity when the pull is 0). Today it distorts a
  settlement's reading of its OWN exhaustion (perceivedPeaceExhaustion); it is the round-11 INTENTIONAL/
  directed axis, reusable as the belief-projection's distortion operator.
- SEEDED PRNG — createPRNG/.fork (prng.js:22-72), threaded from the pulseKernel confluence (:230). The
  round-13 ORGANIC per-hop roll is a NEW labeled fork off it (`rumor-organic:${eventId}:${carrierId}:
  ${edgeId}:${hop}`), DISTINCT from fidelityNoise — the two round-13 sources map to two code homes.
- PERSISTENCE / DORMANCY ORACLE — worldState conditional-materialized ledgers (warPosture/occupations/
  martialReadiness/conquestFeeds…) stripped from the shallow spread + re-added only when non-empty
  (ensureWorldState + deepCloneConditionalLedger, worldState.js:214-249) ⇒ byte-identical when absent.
  The belief-map ledger keyed under a NEW `spatialCanonVersion` marker inherits this verbatim; a
  schemaVersion migration chain exists (WORLD_STATE_SCHEMA_VERSION=2, :117-160).
- DM REVEAL — the includeCovert/includeGroundTruth selector convention (mobilizationStatus.js:84-118,
  visibilityAudit.js, liveWorld.js). The "truth vs belief vs divergence" view is a pure selector on it.
- CARDINALITY BOUND — regionalGraph is SPARSE (center + declared neighbours). relationshipStates is
  O(edges) SYMMETRIC (one record/edge); the belief map is its DIRECTED, PARTIAL, nested variant
  { observerId → { subjectId → { readiness, alignment, faith, allianceLabel, confidence, lastUpdateTick } } },
  martialReadiness `{cid→{readiness01,experience01}}` being the single-level precedent.

## IV.3 The one net-new structure + its determinism discipline
The BELIEF MAP has zero substrate today (every cross-settlement input is ground truth). It is the
keystone of rounds 10-13. Determinism/perf fixes the stress-test demands (all satisfiable on the
existing substrate):
1. CARDINALITY — bound STRUCTURALLY: materialize an (observer,subject) entry ONLY when a rumor
   actually reached the observer (NEVER pre-populate all-pairs); the sparse informational neighbourhood
   is the cap. Else the directed/partial map turns the sparse graph dense (naive O(N²)).
2. FOLD ORDER — apply a TOTAL order key (tick desc, score desc, fidelity desc, compareCodepoint(packetId))
   to all packets targeting an observer BEFORE folding into its belief; codepoint-sort observers+subjects.
   (A Map-iteration-order fold breaks replay.)
3. TWO DISTORTION SOURCES don't collide — organic = the new `rumor-organic:…` fork off pulseKernel:230;
   directed = fidelityNoise's injected rng. Separate labels ⇒ independent streams.
4. ABSENCE — key PURELY on `currentTick − lastUpdateTick` (arithmetic, NO rng, no separate structure);
   timeliness is deterministic (age is not a roll). Confidence decays off the same delta.
5. SEAM FALLBACK (byte-identity) — make it explicit + gated: `spatialCanonVersion` ABSENT ⇒ read ground
   truth exactly as today (the proven default-off path, byte-identical); PRESENT but NO belief record ⇒
   a MAX-UNCERTAINTY belief (this is round-13 absence-as-information at the seam).

## IV.4 The corrections the stress-test forces (fold into PART I/§4g)
- "ADDITIVE" is byte-true but understated: it is byte-additive (identity-fallback gated on
  spatialCanonVersion, the fidelityNoise neutrality-theorem discipline) AND a code RE-PLUMB (every
  cross-settlement OBJECT read re-routed through ONE pure selector `belief(observer,subject,worldState)`).
  Describe the work honestly as "re-plumb the decision object-reads," not "a new layer beside."
- GATE ORTHOGONALLY: gate the belief projection on `spatialCanonVersion`, NOT on the existing war
  toggles (settlementStrategyEnabled) — the war faculty is already live for some campaigns.
- SELF vs OTHER carve-out: round-12's "NO ground-truth input to ANY decision" is unimplementable
  literally — a settlement CAN read its OWN true state. Correct boundary: only CROSS-settlement OBJECT
  reads (others' strength/alliances/fortifications/alignment/faith) route through the belief map;
  SELF-reads stay ground truth.
- ROUND-11's "three risk assessments already exist" overstates — only the WAR faculty is real code
  today. The war faculty is the SOLE v1 attachment for belief-driven decisions; routing- and army-
  strategy risk assessments ship WITH their movers.
- SETTLEMENT ALIGNMENT is on the critical path for FIVE mechanics (culture, moral drift, info-handling,
  the risk faculty, and the migration/contraband that sit below the belief layer) — promote III.4-1(a)
  DERIVE-endogenously to EARLY/foundational: add computeLawfulness/computeMalice as SIBLINGS of the
  existing `computeAggressiveness` (disposition.js:221), reusing TRAIT_ALIGNMENT + deity evil01/chaos01
  axes + governance. (A derivation home + precedent already exist — this is not a new subsystem.)

## IV.5 Revised build order (supersedes PART III §III.3 tail for rounds 10-13)
Round 10 was under-decomposed (a cheap half bundled with a mover-dependent half). Split it:
- Derive SETTLEMENT ALIGNMENT (disposition.js siblings) — foundational, unblocks five mechanics.
- STEP 3.5 — Rumors & News, trade-carrier only (PART III), + the round-13 organic PRNG roll + the info-
  quality vector fields on the per-settlement rumor ledger.
- WAVE A (right after 3.5, ZERO new movers) — the BELIEF MAP + belief-sourced war POSTURE (re-plumb the
  three settlementStrategy reads) + misjudgment-as-a-cause + absence-as-uncertainty. This ships the
  valuable half of the fog of war on the chooser that already exists — high value, no military layer.
  DATA-MODEL NOTE (round 14): the belief-map ledger key carries an OPTIONAL FACTION dimension from day one
  — beliefMaps[observer][factionId?][subject] — with factionId DEFAULTING to the governing coalition in
  Wave A (one map, defined as the governing coalition's operational belief). This costs nothing in v1 but
  preserves the seam so per-faction belief (merchant/military/clergy/criminal/public/government, each fed
  by its round-9 carrier) can be added later WITHOUT a schema break. Do NOT bake a single-settlement-mind
  assumption into the key.
- WAVE B (after the §5 army-transit + §7 movers) — belief-driven physical MOVEMENT (preempt/defend-ally/
  reinforce) + moral drift + the ally-intel/betrayal channel + teleport-bloc economics.
Everything downstream stays as PART III. The belief layer's payoff arrives EARLY and cheap; only its
physical-consequence half waits on the movers.

---

# PART V — TECHNICAL HARDENING REQUIREMENTS (owner, round 16) — BINDING

Six engineering requirements that every spatial wave must satisfy. These are not new mechanics; they
are the "actually works, stays balanced, stays deterministic, stays EXPLAINABLE" contract.

## V.1 The cost field must be STABLE + EXPLAINABLE — three version axes + route receipts
The two-tier digest (PART III §III.2-1: FROZEN GEOMETRY vs LIVE OVERLAYS) is correct but INSUFFICIENT.
- FROZEN GEOMETRY: elevation, terrain, permanent water, base road geometry, fixed crossings, distance.
- LIVE OVERLAYS: road damage, occupation, weather, embattlement, blockade, border closure, magical
  access, temporary bridges, seasonal passability.
- ADD VERSIONED INTERPRETATION (the real gap): a route depends not only on the map but on HOW cost is
  computed. If the slope-cost LAW later changes, old campaign routes would shift even though the map did
  not. So the spatial canon carries THREE version axes, not one: `geometryVersion` (the frozen digest),
  `costLawVersion` (the interpretation — how slope/terrain/river costs map to numbers), `overlayVersion`
  (the live layer). Old canon freezes under its (geometry, cost-law) pair; changing the cost law is a
  DISCRETE re-canonize event (bump costLawVersion + re-derive), never a silent drift on load.
- ROUTE EXPLANATION RECEIPTS: every route carries a RECEIPT — why it costs what it costs, which segments,
  which overlays applied (the causal-legibility law from the dossier / W-C5, applied to geometry). The DM
  can always ask "why this road?" This is also the determinism audit trail.

## V.2 Carriers use DIFFERENT route preferences over the SAME geometry — do NOT collapse to one shortest-path
The shared frozen geometry is common; ROUTE CHOICE is CARRIER-SPECIFIC (a per-carrier cost PROFILE that
re-weights geometry + overlays by that carrier's priorities). Refines PART III's multigraph.
- TRADE → low cost + high capacity. ARMIES → width, terrain, supply, hostility. REFUGEES → safety +
  destination pull. SMUGGLERS → concealment. MISSIONARIES → population + religious opportunity. RUMORS →
  high-connectivity social channels. COURIERS → speed. AIRSHIPS / TELEPORT → DIFFERENT GRAPHS entirely
  (the aerial field / the circle network — not a re-weight of land geometry, a separate edge set).
- IMPL: geometry (frozen, shared) → per-carrier cost profile (a pure function weighting geometry+overlays)
  → carrier route. Land carriers share the geometry with different profiles; air/teleport carry their own
  graphs. The k-shortest candidate cache (PART II §II.4) is computed PER CARRIER PROFILE.

## V.3 Rumor cardinality could EXPLODE — canonical identity + lineage + the FALSE-CORROBORATION fix
One event × many carriers × paths × settlements × distortion operators × retellings ⇒ an explosion of
rumor objects. The sparse directed belief map (PART IV) helps, but the EVENT layer needs consolidation:
- CANONICAL EVENT IDENTITY — one stable id per real event (the wizardNews `sourceEventId` → graph.eventLog
  is the existing substrate, PART III).
- LINEAGE IDs — every rumor descendant records which telling it descends from.
- MERGE RULES for near-equivalent reports; SALIENCE thresholds; EXPIRATION; PER-OBSERVER INFORMATION
  BUDGETS (a settlement holds only top-K live rumors).
- SOURCE-CORRELATION TRACKING — THE critical one, and a CORRECTION to round-8 cross-confirmation: cross-
  confirmation must weight by INDEPENDENCE, not count. Five retellings that all trace to ONE origin are
  NOT five corroborating sources — they are one source echoed. Cross-confirmation reads the LINEAGE: reports
  sharing an origin/lineage corroborate LITTLE or nothing; only genuinely INDEPENDENT observations raise
  confidence. Without this the entrepôt's "best-informed" advantage (§4f) is an illusion — it just hears the
  same lie five times. This is essential; the belief-update rule (V.4) consumes the independence signal.

## V.4 Belief updates need a CONFLICT-RESOLUTION rule (the missing piece)
When a settlement holds contradictory reports (army = 5,000 per an old official report; a merchant says
2,000; refugees report total defeat; a spy says intact; no courier in 3 weeks), belief must update by a
CONSISTENT RULE or beliefs become an arbitrary pile of reports, not actionable state. NOT necessarily full
Bayesian, but a defined weighted reconciliation. THE KEY SYNTHESIS: the update rule is where rounds 12/13/15
get CONSUMED — it is not new machinery:
- WEIGHT each report by: SOURCE RELIABILITY / provenance (round 12), RECENCY / timeliness (round 12),
  INDEPENDENCE / lineage (V.3), EXISTING PRIOR + its confidence.
- FILTER by disposition (round 15A): POLITICAL / CONFIRMATION BIAS decides which reports are ACCEPTED vs
  REJECTED (a lawful ruler rejects the informal spy report; a confirmation-biased one over-weights reports
  matching its prior; an evil one weights by self-interest).
- CONTRADICTION raises UNCERTAINTY (the belief becomes "contested" — itself a driver of probing/caution).
- CONFIDENCE DECAYS with silence (round 13 absence). Result: a per-(observer, subject, attribute) belief =
  a weighted reconciliation, deterministic (seeded where any tie-break/sampling occurs), NOT last-writer-wins.

## V.5 Determinism makes tuning laborious — a spatial INVARIANT TEST SUITE (real burden, same discipline)
The fork + total-order-fold design (PART III §III.2-5, IV.3) is correct, but the spatial engine multiplies
the places where ordering + stable identity matter. Required INVARIANT/property tests (the golden-equivalent
for the spatial engine, gating every wave):
- same (event, path, carrier, hop) ⇒ identical degradation; REROUTING doesn't change UNRELATED rumor
  outcomes; adding an UNRELATED settlement doesn't reroll existing routes; STABLE tie-break among equal-cost
  paths; live overlays affect ONLY dependent outcomes; DORMANT spatial canon ⇒ byte-identical; OLD saves ⇒
  identity-fallback correct. These extend the existing no-Date / unseeded-random grep-gates + golden discipline
  to region/ + the spatial modules. The test burden is significant and non-optional — budget for it per wave.

## V.6 Positive-feedback loops are BROADER than migration — apply force/counterforce rigorously
Beyond migration + prosperity, spatial systems create at least four more centrality loops — all historically
plausible, all needing explicit BRAKES:
- ENTREPÔT: more trade → better infrastructure → lower route cost → more trade. BRAKES: congestion, rent
  extraction / toll-greed reroute (round-4 DESIGN, UNBUILT — the grounding confirmed ZERO trade-side damping
  exists in-tree today; the brake MUST be co-built WITH the toll/entrepôt mover, not assumed), infrastructure
  MAINTENANCE cost, wartime targeting.
- RELIGIOUS-CENTER: more pilgrims → more legitimacy → more institutions → more pilgrims. BRAKES: political
  resentment (a dominant faith breeds dissent/heresy), capacity ceilings, rival centers, the faith-contest mechanics.
- MILITARY CHOKEPOINT: strategic position → investment → control → more strategic importance. BRAKES: wartime
  TARGETING (the more vital, the bigger the target), RIVAL ROUTE INVESTMENT (others build around it, like the
  toll reroute), maintenance.
- INFORMATION-CENTER: more carriers → better info → better decisions → more stability → more carriers. BRAKES:
  single-point-of-failure targeting, the round-11 MANIPULATION risk (a rich info-center is the juiciest target
  for planted intel), capacity.
- THE SYSTEMIC BRAKE (architect synthesis): all four are the SAME shape (positive feedback via centrality), and
  they are COUPLED — a settlement that wins all four becomes a mega-hub, which makes it the biggest TARGET, the
  biggest single-point-of-failure, and the juiciest mark for manipulation. So TOTAL centrality is SELF-LIMITING
  because it concentrates RISK: everyone wants to take it, cut it, or feed it lies. Centrality invites its own
  undoing — the force/counterforce law at the systemic scale. Each loop still needs its LOCAL brakes (above);
  the systemic brake ensures no single settlement runs away to dominate the whole realm.

---

# PART VI — GROUNDING VERDICT for ROUNDS 14-16 (2026-07-11, workflow wf_89ef3442-512)

The factional/objective refinements + the 6 hardening requirements, verified. HEADLINE: rounds 14-16
are ADDITIVE, BYTE-SAFE, and TRACTABLE — the coherence risks are almost all SEQUENCING (what must
co-ship with what), NOT architecture; every hard part has a home in the tree. Two things must NOT be
deferred; several owner decisions surface.

## VI.1 Feasibility per item
- SCORER objective-parameterization (15B) — YELLOW, FEASIBLE + localized. ALL scoring lives in ONE pure
  function (settlementStrategy.js enumerateMoves :264-317, four inlined coefficient formulas); softmax/
  sample downstream is objective-AGNOSTIC. Lift the formulas into a DEFAULT ScoringObjective descriptor
  (byte-identical), then pass a per-actor objective set. GAP: the move SET is WAR-ONLY — a merchant
  (revenue/reliability/credit) or church objective has NO enumerable levers to score over yet; disposition
  is a SCALAR (computeAggressiveness only). So objective-parameterization ships in two steps (VI.3).
- FACTION state (14/15) — YELLOW, keying is SOLID. deriveFactionProfile.id = `faction.<snake>` is stable +
  already used by factionRelationshipUpdate; factions even carry an `informationAccess` resource (a native
  hook for factional info). GAPS: (1) id is DERIVED not stored (cheap to derive); (2) TWO type vocabularies
  (stored `category` vs derived `archetype`) — pick ONE canonical set before keying faction-type objectives
  (recommend archetype — the round-15 examples map onto it); (3) NO governing COALITION — a single
  isGoverning SEAT + governingName, no supporters field (owner decision, VI.4).
- fidelityNoise STYLE (15A) — YELLOW. The seam to widen is cut (chaosPullOf), BUT settlement-level ALIGNMENT
  DOESN'T EXIST (only deity-axis/NPC) and the good/evil axis is ENTIRELY UNWIRED into fidelity today (only
  the deity chaos axis). Styling by settlement law+good REQUIRES the unbuilt computeLawfulness/computeMalice
  (disposition.js siblings) — reconfirms alignment-derivation is on the critical path.
- COST-LAW versioning + carrier profiles (16.1/16.2) — YELLOW, but the version axes belong IN THE KEYSTONE
  (VI.2). The 3 axes are NEW sibling scalars stamped into the FROZEN DIGEST at canonize — NOT a schemaVersion
  migration (that reduce is single-scalar, shape-only). NOTE: `geometryVersion` NAME-COLLIDES with a live
  runtime store field — rename (e.g. spatialGeometryVersion).
- RUMOR lineage + source-correlation (16.3) — RED-as-greenfield, but SEQUENCING-critical (VI.2). The
  canonical event id EXISTS (sourceEvent.id, propagation.js:1067) as the lineage ROOT; everything above it
  is net-new (grep: ZERO hits for corroborat/crossConfirm/independence/sourceCorrelation). wizardNews is a
  SINGLE-observer DM formatter, not a multi-observer graph. The look-alikes (admitStrongest, deriveNewsThreads)
  are TRAPS (dedup/thread, no independence).
- BELIEF-UPDATE rule (16.4) — YELLOW, has a PRECISE precedent: model a pure `advanceBeliefMaps({snapshot,
  priorLedger, incomingReports, tick})` node-for-node on advanceInstitutionTolerance (institutionTolerance.js:172)
  — per-(observer,subject,attribute) = weighted combine of decayed-prior + reports. GAP: its INDEPENDENCE
  weight consumes 16.3's lineage (so they co-ship); a v1 could stub independence=1 but loses the fix.
- INVARIANT infra + brakes (16.5/16.6) — YELLOW. Infra READY: extend the no-Date/unseeded grep-gates +
  domainWallClock scan to region/; reuse normalizeForDormancy as the dormant-spatial oracle; add a spatial
  golden master. The route-invariants have nothing to test until the keystone builds (front-heavy cost, VI.3).
  BRAKES: the entrepôt loop has ZERO trade-side damping in-tree (the "toll-reroute already partial" claim was
  FALSE — now corrected in V.6); each new loop's brake co-builds with its mover.

## VI.2 The TWO must-NOT-defer sequencing findings
1. **Lineage IDs must be threaded at STEP 3.5 (the rumor mill), from day one.** Independence-weighted
   cross-confirmation (16.3) is a MUST-FIX CO-REQUISITE of ANY confidence-raising cross-confirmation — NOT a
   later hardening pass — because **retrofitting lineage onto already-distorted historical reports is
   IMPOSSIBLE.** Thread `lineageIds[]` (rooted at sourceEvent.id) onto the rumor packet + per-settlement
   ledger at 3.5 (cheap field-threading). If 3.5 ships without it, the entrepôt "best-informed" advantage is
   an ILLUSION (it hears one lie five times) and the belief-update independence weight has nothing to read.
2. **Cost-law + geometry versioning belong IN the keystone wave.** Stamp spatialGeometryVersion +
   costLawVersion into the frozen digest AT canonizeCampaignWorld (II.6 step 2), not deferred — a route
   depends on how cost is computed, so the interpretation version must be frozen WITH the geometry or old
   routes drift on any later cost-law change.

## VI.3 Build-order corrections (fold into IV.5 / II.6)
- WAVE A is under-specified — AMEND to: belief map + **V.4 reconciliation rule** + **independence-weighting
  (fed by step-3.5 lineage)** + belief-sourced war posture + absence-as-uncertainty. (Wave A cannot ship the
  belief map without the update rule.) Model advanceBeliefMaps on advanceInstitutionTolerance.
- OBJECTIVE-parameterization (15B) is WAVE B, not Wave A — Wave A's down-payment is ONLY lifting the four
  coefficient formulas into a DEFAULT ScoringObjective descriptor (golden-pinned byte-identical). Full
  per-faction objectives + the new non-war MOVE LEVERS (merchant reroute/embargo/credit; church) are Wave B.
- ALIGNMENT derivation (computeLawfulness/computeMalice) stays FOUNDATIONAL/early — it now gates fidelity-
  STYLE (15A), the risk framework's disposition vector (15B), moral drift, culture, AND info-handling.
- The keystone digest holds {land cost field + territory/gates/tiers/distance matrix} PLUS OPTIONAL separate
  air/teleport edge sets (materialized only when those modalities are enabled) — V.2's "different graphs"
  don't fit "one frozen geometry," so scope them as optional sibling edge sets.
- INVARIANT-test budget is FRONT-HEAVY: the keystone wave carries an outsized route-determinism proof cost
  (integer tie-break, dormant byte-identity, old-save identity-fallback); budget it higher, ~20-30% on later waves.

## VI.4 New owner decisions surfaced (rounds 14-16)
1. **Governing coalition** — Wave A's one belief map is "the governing coalition's operational belief," but
   code has a SINGLE isGoverning seat + no supporters. DECIDE: derive the coalition (governing seat + factions
   allied by relationship archetype) as a pure selector, OR default factionId to the single governing seat in
   v1. (Recommend: default to the seat in Wave A; derive the coalition in Wave B with the faction objectives.)
2. **Systemic centrality brake (V.6)** — the coupled self-limiting brake is EMERGENT and has no cross-loop
   machinery, so it can't be relied on DURING incremental waves. DECIDE: accept temporary runaway during the
   build (rely on emergence once all loops+brakes land), OR add an explicit hard hub-size/centrality CEILING
   as a floor. (Recommend: explicit ceiling as a soak-guard, relax it as the emergent brakes prove out.)
3. **Cost-law re-canonize policy** — on a costLawVersion bump, what happens to the INSTALLED BASE of spatial
   canons? (re-derive on next open behind the entitlement, or freeze old canons on their old law forever.)
4. **Canonical objective/faction-type key** — pick `archetype` (9-value) over `category` as the one key for
   faction-type objectives (the round-15 examples map onto archetype cleanly).

---

# PART VII — CONTROL-LAYER VERIFICATION + THE CL-0 PLAN (Fable, 2026-07-11, wf_f37edb68-de4)

Five seams verified (3 structured Opus verifiers + 2 manager-verified directly after degenerate
structured output). HEADLINE: §11 lands on far MORE existing machinery than the round-17 capture assumed.
**Today's build already IS "DM-Advanced progression + Routine Autonomy"** — the §11 recommended default.

## VII.1 What verification established
- **simulationRules is the seam, verbatim.** Flat object: 3 enums + 24 booleans, `normalizeSimulationRules`
  (simulationRules.js:224 — fail-CLOSED boolean coercion, enum clamps, faith legacy-key lockstep :255).
  Persists at `campaign.worldState.simulationRules`; normalized on EVERY read/write/kernel-entry
  (worldState.js:176,277; campaignWorldPulseSlice.js:215-219; pulseKernel.js:229). Mid-advance write guard
  already exists (slice:205). schemaVersion=1 const, tolerant-reader back-compat (no migration ladder).
- **PRESETS ALREADY EXIST** — 3 named (quiet_local / realistic_regional=default / dramatic_campaign),
  `applyPreset` populates the whole draft, and `presetIdForRules` (:214) BACK-DERIVES the preset by
  structural match — the "Living Realm (modified)" inference is already-built machinery. Grow 3 → 5
  (§11's Static/Narrative/Living-Realm/Full-Sim/Custom map onto this system).
- **THE PROPOSAL/APPROVAL SYSTEM ALREADY EXISTS.** Candidates carry per-candidate `applyMode`
  ('proposal'|'auto'); `worldState.proposals` + `applyWorldPulseProposal`/`dismissWorldPulseProposal`
  (slice:349,419) + WorldPulsePanel = a live DM approve/dismiss queue. `majorChangesRequireProposal`
  DEFAULTS TRUE. §11's Political-Autonomy modes map onto EXISTING machinery: dm_only = force-all-proposal;
  recommendations ≈ dm_only + rationale; routine = TODAY'S DEFAULT (majors→proposal, routine→auto);
  full = majorChangesRequireProposal=false. CL-3's "approval queue" is an EXTENSION, not greenfield.
- **INITIATION is already per-domain** for the 9 candidate domains — candidateEvents.js:201-258 wraps each
  domain's emission in `if (rules.<domain>Enabled)`; off ⇒ zero candidates ⇒ no rng ⇒ byte-identical.
- **The AUTHORITY axis is global + INCONSISTENT** — the flag is honored by tier/resource families
  (tierResourceDynamics.js:157,373) but **4 candidate families escalate on severity ALONE and never consult
  it** (changeAuthorityPolicy.js:267 documents this as an unresolved decision). Tri-state work = make
  authority PER-DOMAIN + make all families consult one policy — with legacy defaults reproducing today's
  behavior EXACTLY per family.
- **WAR CONFLATES initiate+resolve under one boolean** — warLayerEnabled gates evaluateWarLayer
  (pulseKernel.js:530-537) which both OPENS sieges and RESOLVES them, INLINE, outside the candidate/proposal
  machinery; the 8 war sub-flags are resolution-only modifiers (warDeployment.js:1173-1185). A war DM-Driven
  tri-state requires a REAL SPLIT REFACTOR (route war-initiation through the proposal path) — deferred past
  CL-0; the war row ships Off/Autonomous only, with DM-Driven arriving with the war-layer rework.
- **PROGRESSION is 100% DM-triggered today** (all advance call sites are UI paths; no timers) — today IS
  DM-Advanced. FROZEN = a cheap store guard + disabled UI. Living/Autonomous = the one net-new mechanism
  (capped deterministic advance-on-open catch-up; owner decision; pin-now discipline makes it safe).
- **RECEIPTS: the exact procedure is verified.** Emit at the single choke point updateCampaignSimulationRules
  (slice:219): append a `kind:'ruleset_change'` entry via the public appendWizardNewsEntries (normalizeEntry
  needs no change — kind is free-form) + fold a record into a NEW conditionally-materialized
  `worldState.rulesetLog` (strip@~241 / clone@~249 / spread@~343 in worldState.js). ONE design ruling needed:
  deepCloneConditionalLedger is OBJECT-ONLY (rejects arrays) ⇒ **rulesetLog is an OBJECT keyed by change id**
  (`rc_<tick>_<seq>`), not an array. RULING MADE — object-keyed.
- **§11 prose correction:** the CL-0 aspatial profile does NOT live "under the spatial-canon marker" — rules
  already live at worldState.simulationRules (campaign-scoped, aspatial). Only the SPATIAL axes' digest
  versions (geometry/cost-law/overlay) ride the spatial-canon marker. The rulesetLog is a plain conditional
  ledger. (Scoping fix to §11's "canonical + versioned" paragraph.)
- **Cleanup found:** LivingWorldGates.jsx still reads/writes the LEGACY religionDynamicsEnabled key directly —
  migrate it to the canonical path in CL-0.

## VII.2 The CL-0 wave (final — brief at docs/briefs/CL0_CONTROL_LAYER_BRIEF.md)
Aspatial control-layer core; ships independent of any spatial wave; value at every tier. Contents:
profile extension (worldProgression/politicalAutonomy/infoMode/spatialMode/travelMode enums + per-domain
tri-states derived from the 24 booleans; absent-key = legacy defaults, VIRTUAL, no write), pure
`validateSimulationProfile` (versioned, coercion-receipted), per-domain AUTHORITY plumbing for the candidate
domains (+ fix the 4 rogue families to consult policy, legacy-defaults byte-exact), FROZEN progression guard,
politicalAutonomy modes on the existing proposal machinery, presets 3→5, dialog v2 (preset picker prominent +
axis cards + tri-state rows + fiction-not-internals copy + dependency gating), rulesetLog + ruleset_change
receipts, LivingWorldGates legacy-key cleanup. DEFERRED from CL-0: war DM-Driven (needs the split refactor),
Living/Autonomous progression (owner decision + catch-up), all spatial/travel/info modes beyond today's
values (cards render, locked to available modes). Gates: goldens byte-identical (virtual-default discipline),
legacy-normalization byte-exactness test PER FLAG, settings-history replay invariant, the usual suite.
SEQUENCING (manager): after W2 closes the reunification; CL-0 is then the first brick of Phase 5.5.

# ROUND 21 — WORLD-AS-ACTOR SHOCKS: PESTILENCE + CALAMITY (owner, 2026-07-12) → M11

The owner's directive (verbatim intent): plagues should TRAVEL the same way information travels; in
a magic-on world the counterforce is the care roster — druids, any church or church-derivative,
hospitals and the like, alchemists — suppressing both the EMERGENCE of the plague stressor and how
long it SURVIVES; an army interacting with a plagued settlement is likely to CONTRACT it and should
weigh that in its risk assessment (avoid until it passes); PRNG placed where appropriate; plagued
towns give TEMPORARY influence to religious authorities. Natural disaster: a very quick event with a
LONG TAIL of economic disaster — seeded selection of non-required institutions destroyed outright
(hand-of-god) or DEMOTED under a subsumption rule (a lodging district reduced to its one surviving
lodge); bounded and reasonable; possibly a tier demotion if unlucky, possibly a complete economic
rearrangement; significant populace death and MASS EXODUS (livelihoods removed); the ruling leader
under heavy pressure. VERY rare but not impossible — realm-wide roughly once per settlement every
10-20 years.

ARCHITECT'S REFINEMENTS (accepted into the M11 spec, playbook PART 7):
1. ONE PLAGUE TRUTH — the epidemic ledger EXTENDS the existing plague stressor (materializes it at
   arrival; reconcile like M4's origin-loss rule). Never a parallel plague system. Aspatial worlds
   keep today's plague byte-identically; the spatial marker gates only the TRAVEL.
2. The counterforce reads the INSTITUTION ROSTER, never the magic toggle — a no-magic world lacks
   the care institutions at generation, so the counterforce weakens with zero special-casing.
   Diminishing stacking returns + a hard cap (the SECURITY_MAX_RELIEF pattern): resist, never immune.
3. Density-vs-care is the texture: cities burn hot-and-short, care-poor villages smolder; ports run
   hotter (inbound volume). Emerges from two opposing scalars, no authored cases.
4. Armies: plague joins the mover hazard read as a GRADED SCALAR (M1 discipline) weighted by W0 risk
   tolerance; contraction is a seeded roll; a contracted army is impaired AND a vector to its next
   stop. Besieging a plagued city becomes priceable folly.
5. Religious influence swings BOTH ways: clears-fast-under-care = the temple's triumph (temporary
   influence + piety pulse, reverting on clearance); rages-unchecked feeds the existing
   piety-crisis/abandonment seam. Formalizes the existing plague→temple-relief seam.
6. The quarantine dilemma emerges FREE from composition: hazard-term re-routing isolates a plagued
   hub → M2 supply risk. No new mechanism.
7. Calamity subsumption rides the existing catalog machinery: UPGRADE_CHAINS demote, multi-instance
   categories collapse to one survivor, singletons destroyed, `required` NEVER selected.
8. Tier demotion EMERGES via popToTier from death+exodus arithmetic — never authored.
9. The long tail is the ladder's composition payoff, zero new mechanism: severed M2 links, economy
   re-reconcile, M4 departures (conservation asserted through the exodus), W-C5 'disaster response'
   cause, coup-readable legitimacy pressure.
10. Frequency 1/(HAZARD_YEARS × N) per settlement-year, seeded annual draw; the cooldown is DERIVED
    from the minted permanent history stamp (zero new state). Death fraction bounded + tier-scaled
    (significant but survivable — exodus is the real depopulator, and it is recoverable drama).
11. PRODUCT BOUNDARY (owner, this session): mortality is AGGREGATE ONLY — named NPCs are never
    killed by the sim; at-risk/displaced flags are DM hooks.

SEQUENCING: M11 appends to the mover ladder (depends M4 hard — exodus; the army coupling term ships
with/after M5). The Living Realm checkpoint (PART 5) now validates THROUGH M11. Full dispatch-ready
spec: playbook PART 7 §M11a/M11b.
