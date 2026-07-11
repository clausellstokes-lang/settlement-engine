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

**Fidelity decay — HOW information degrades (the heart of it), a layered model:**
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
