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
