# Phase 5.5 — The Spatial Engine (design synthesis)

STATUS: DESIGN (owner directives 2026-07-11, three rounds, synthesized by the architect).
Depends on the Realm map as a stable first-class surface (the reunification's W4b surfaced
its war/faith layer). To be built AFTER the reunification, with the determinism/dormancy
contract nailed here before implementation — the same discipline as PHASE4_FAITH_DELTA.
Raw directive log: memory/spatial-engine-direction.md.

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
