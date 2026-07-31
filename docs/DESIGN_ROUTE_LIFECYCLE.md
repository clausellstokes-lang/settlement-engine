# DESIGN — THE ORGANIC ROUTE LIFECYCLE (directive 9: the arteries live)

## Owner-commissioned 2026-07-31; full architecture same day ("fully and exhaustively
## architect it out"). Fable design; owner veto OPEN on the J-D9 refinement blocks
## (demand-then-charter, hysteresis, dual-benefit mercy, hidden-path access rules).
## Status: DESIGN, frozen at dispatch — W-J executes FROM this document.
## Companions: DESIGN_THE_ROADS.md (binding law for the roads engine this extends),
## DESIGN_REALM_DIRECTIVES.md directive 9 + J-D9 (all amendments incorporated),
## DESIGN_NPC_CONSEQUENCES.md (roamer travel physics), DESIGN_INFORMATION_BROKERAGES.md
## (the reputation race), DESIGN_TOWN_CARTOGRAPHY.md (routes as arterial seeds),
## DESIGN_SUPPLY_WEB_WARFARE.md (interdiction reads this ledger).

## 0. THESIS

Settlements are born and die; people circulate; the roads were the last static layer.
This program makes the network ALIVE: routes charter where accumulated need proves
them, decay where the realm stops walking them, and are never forgotten — a hidden
path holds every door open for revival. Efficiency is MATERIAL (the owner's law):
the network's fitness is the realm's ability to feed, supply, garrison, and people
itself. Every change is an event with an address and a reason denominated in goods,
people, or strategy. Isolation remains a possible fate — some places are simply too
far for any expedition to be worth it, and that is character, not failure.

## 1. CONSTITUTIONAL LAWS

1. **THE DIGEST STAYS FROZEN:** the network is a SIDECAR LEDGER over the frozen
   integer-quantized spatial digest (the armyTransit / satellites / missions
   pattern) — route lifecycle NEVER mutates territory, membership, or positions.
2. **GENESIS IS SACRED (same-seed law):** a settlement's generation-time
   tradeRouteAccess config is frozen truth — the LIVED network is worldState that
   evolves on top of it. The initial network derives FROM genesis (access vocabulary
   + k-NN + geography); divergence between genesis access and lived connectivity is
   expected, visible, and never back-propagates into generation.
3. **EVENTS, NEVER SILENT DRIFT:** every network change is a charter or abandonment
   EVENT with a full address chain and a named dominant flow class. No tick silently
   re-optimizes the graph.
4. **HYSTERESIS:** formation threshold >> removal threshold; infrastructure has sunk
   cost. Wars never remove routes on the fast timescale — trade_route_disruption
   (existing) is the fast layer; organic removal is the slow verdict.
5. **NOTHING IS FORGOTTEN:** removal demotes to HIDDEN, never to absence, when the
   corridor ever carried a charter or served a destroyed settlement. Hidden paths are
   the roads-layer remnant, pairing with the settlement remnant's
   privileged-rebirth law.
6. **PORTS TOTALITY (owner law):** every port settlement carries water routes where a
   navigable counterpart exists — an invariant, not a probability.
7. **DORMANCY:** virtual `routeLifecycleEnabled` (absent from
   DEFAULT_SIMULATION_RULES); dark ⇒ byte-identical (fenced golden, aspatial +
   spatial). Determinism: seeded forks (`routelife:*`), no ambient anything.
8. **ENDOGENEITY:** the ledger counts world flows only; party/player movement never
   feeds it.

## 2. WHAT EXISTS (verified in-tree — consumed, never rewritten)

- **THE ROADS engine** (src/domain/roads/): sidecar-ledger discipline, the
  roadsEnabled dormancy gate, travelersGeometry (path geometry over the digest),
  seaRoads (water routing), knownWorld (BELIEF-BASED ROUTING — routing reads the
  faction's known picture while outcomes roll against truth: the epistemics tie is
  already native law), migrationReason.
- **armyTransit** (spatial/armyTransit.js + kernel adapter): planMarch over the
  frozen digest, mid-route positions, collision — the mid-route substrate roamers
  and the demand ledger both reuse.
- **Flow sources:** migrationKernel (population flows), commodity/trade flows,
  foodBalance import channels (incl. the seasonal mountain_pass rung),
  supplyWebWarfare (interdiction), goodsCatalog + supplyChainData (the material
  vocabulary), war deployment/mobilization (military corridors).
- **Spatial:** travel-cost rasters, the mover ladder, k-NN neighbor derivation
  (wave B1/C), tradeRouteSemantics (genesis access vocabulary + SEASONAL tier).

## 3. CANONICAL MODEL — the network ledger (conditional spatialLedger, drop-when-empty)

```
spatialLedgers.routeNetwork: {
  edges:    { [edgeId]: RouteEdge },
  corridor: { [corridorId]: CorridorDemand },   // the accumulation ledger
}
RouteEdge = { a, b (digest settlement ids), grade: 'highway'|'road'|'track'|'hidden',
              mode: 'land'|'water', geometry: ref (derived via travelersGeometry /
              seaRoads — never stored duplicated when derivable), charter:
              { flavor: 'mercantile'|'military'|'migration'|'genesis'|'user',
                byPowerRef?, tick, dominantFlowClass, reasonGoods? },
              strategicNeed?: band,             // the war layer writes this (garrison law)
              provenance: 'generated'|'chartered:<tick>'|'user' }
CorridorDemand = { a, b, flows: { goods: band, population: band, military: band },
                   sinceTick, lastCharterEval }
```
Rules: edgeIds deterministic (`route.<a>.<b>.<mode>` codepoint-ordered); user routes
(W-D CREATE_ROUTE) enter with provenance 'user' and are LIFECYCLE-IMMUNE to organic
removal (decay may downgrade grade with a Herald notice, never remove — the user's
provenance law); genesis edges derive at world-connect from access vocabulary + k-NN;
corridors are evaluated over a BOUNDED candidate set (k-NN pairs + existing-edge
endpoints + port pairs — never all-pairs; the B1 quadratic lesson is law here).

## 4. THE FLOW LEDGER (three named classes — J-D9 j/k/l)

Each pulse, existing movers WRITE their corridor usage (they already move; the ledger
only counts): commodity/trade flows and unmet-demand pressure (goods), migration +
roamer + mission traffic (population — DESIRE PATHS: walking wears roads), deployment
and mobilization traversals + written strategicNeed (military). Informal flow on
non-edges accumulates corridor demand; flow on edges accumulates usage (decay's
inverse). Weights per class are tuning bands. The ledger is receipts-first: every
band step names its contributing flows.

## 5. THE MATERIAL OBJECTIVE (owner law: efficiency = realm self-sufficiency)

A candidate charter scores by: LOCAL term (both endpoints' unmet demand reduced —
denominated in goodsCatalog vocabulary: "grain wants to move west") × SYSTEM term
(realm aggregate unmet-demand reduction: does this edge close a material loop?) +
RESILIENCE credit (a second path for a critical good) − COST (travel-cost raster ×
distance × terrain; water mode uses seaRoads costs). The DUAL-BENEFIT MERCY: system-
critical edges resist removal while an endpoint struggles (removal evaluation reads
the system term, not endpoint health alone). REALM SELF-SUFFICIENCY becomes a
measured metric: emitted per-pulse into the behavioral observation (certification +
soak envelope: monotone improvement absent shocks).

## 5b. SAFETY VS GREED (owner amendment 2026-07-31)

Danger is a first-class term in the objective: corridor cost is DANGER-ADJUSTED using
the M1 danger re-score vocabulary the army planner already speaks (war fronts,
occupation, monster threat, banditry pressure) — and routing reads BELIEVED danger
through knownWorld (the roads engine's law: route by the known picture, roll outcomes
against truth — a corridor FEARED dangerous suppresses charters even when safe, and
vice versa; the epistemics layer prices safety). EMBATTLED REGIONS: active war zones
defer charters (the slow lifecycle waits out the fast layer) and step up effective
cost on existing edges without removing them (Law 4). THE GREED OVERRIDE: a corridor
whose profit margin clears the RISK PREMIUM band charters anyway — traders' greed
carries roads through danger, at a price: dangerous-route flows carry loss rates that
feed back into the ledger (greed that keeps losing caravans eventually reads as
unmet demand again, and the road starves honestly). SMUGGLER EXTREME: hidden-path
traffic tolerates danger at the steepest premium — the dangerous goods take the
overgrown road. All bands tunable (RISK_PREMIUM, danger weights, embattled deferral).

## 5c. BYPASS GEOMETRY (owner amendment 2026-07-31 — circumvention)

An unsafe settlement need not be a wall: when BELIEVED danger at an intermediate
settlement exceeds the bypass band, through-corridor pathing may pay a DETOUR PREMIUM
to skirt its vicinity (an avoidance radius in the geometry derivation — waypoints are
geometry, never new graph nodes; the frozen digest is untouched). BOTH edges may
coexist: the road TO the dangerous town (serving its own demand — someone still sells
it grain, at the risk premium) and the road AROUND it (carrying through-traffic).
Hysteresis applies to geometry too: a worn bypass persists after danger clears until
usage says otherwise — roads remember fear a while. THE FEEDBACK (the design's gift):
a settlement that becomes unsafe LOSES ITS THROUGH-TRAFFIC — the caravans swing wide,
its market thins, and the loss reads honestly into its unmet-demand ledger. Safety
becomes an economic asset a settlement can squander; recovering the through-trade is
a story arc the Herald can tell ("the wagons return to the Vale road").

## 5d. THE LIVED PROFILE (owner amendment 2026-07-31 — the loop closes both ways)

Routes react to the economy; the economy MUST react to its routes. A settlement's
LIVED ECONOMIC PROFILE is a derived role composition with two components:
- **THE PERMANENT BASIS (genesis, frozen):** terrain, resources, founding character —
  the mountain and its ore never leave (same-seed law; never back-propagated).
- **THE NETWORK ROLES (worldState, fluid):** crossroads, entrepot, port-of-transit —
  derived from live network position: through-flows (what travels, with what
  material — through-traffic is an ECONOMIC INPUT, generalizing the bypass
  feedback), the connected-neighbor set (who you can trade with is an input to the
  trade flows), and route grades.
THE CANONICAL EXAMPLE (binding): a mountain mining town charters into a crossroads
(mining + crossroads), tilts to mostly-crossroads-with-a-mountain as through-trade
dominates, then war severs two routes and — on the slow timescale, with hysteresis —
it is a mountain town again. Identity shifts at ROLE THRESHOLDS are Herald EVENTS
("Karsgard is spoken of as a crossroads now"), never silent drift; the dossier shows
the composition honestly ("a mining town, lately a crossroads"). CARRIERS: religion
spread and information propagation WEIGHT BY EDGE GRADE — the roads are the arteries
of faith and news as much as goods (faithSpread + distance-priced news read the
network; a severed route slows a god and a story alike). CARTOGRAPHY: the lived
profile drives ward evolution through the existing pulse-reactivity law (the market
quarter grows as crossroads-ness rises; the A-8 institution counts read the LIVED
profile, not genesis alone). Pins: genesis immutability under any network history;
role-threshold hysteresis (no identity flapping); the canonical example as an
end-to-end integration test — charter in, tilt, sever, revert, every step evented.

## 6. CHARTER (formation) — demand-then-event

When a corridor's accumulated demand crosses the formation threshold (per dominant
class; hysteresis per Law 4) AND the material objective clears its bar AND the
expedition-worth ceiling passes (too-far = isolation as fate), a CHARTER EVENT
proposes through the docket (major-class when realm-shaping; the E0 pacing governor
applies; guaranteed-admission rules per the coup precedent do NOT apply — charters
re-derive, they can wait). On acceptance (or auto-resolve): the edge materializes at
'track' grade (roads are earned — grade promotion follows sustained usage),
Herald-announced with flavor + reason ("the Crown charters the Eastpass road; grain
and the garrison follow"). Military charters may be power-initiated off strategicNeed
without corridor accumulation (strategy buys roads demand hasn't worn yet).

## 7. DECAY + REMOVAL — the slow verdict

Sustained under-use + failing material objective steps the grade down
(highway→road→track→hidden) on long dwells (bands); HIDDEN persists per Law 5.
Settlement destruction: all its edges drop to hidden in the SAME outcome (paired
with cast dispersal); revival (remnant resettlement) re-evaluates hidden corridors
FIRST with a warm-start bonus — the old road remembers. Garrison asymmetry: edges
with live strategicNeed do not decay below 'road' regardless of trade. Every step is
an event with receipts; abandonment of a chartered route is Herald-worthy mourning.

## 8. WATER ROUTES + PORTS TOTALITY

Water edges ride seaRoads costs/geometry with mode 'water'; the PORTS TOTALITY
invariant runs at network genesis and every charter eval: a port settlement with any
navigable counterpart carries at least one water edge (auto-genesis at 'road' grade,
flavor 'genesis'). Seasonal interaction (frozen harbors) is a TUNING question routed
to the seasons table, not a new mechanism.

## 9. TRAVEL PHYSICS CONSUMERS

Armies (existing armyTransit) and roamers (W-H H3) traverse edges; roamers: one hop
per tick, connected-only, mid-route records in the transit ledger pattern; wanderers
and smugglers may use hidden paths at a grade penalty, armies may NOT (J-D9 d). THE
REPUTATION RACE integration property (pinned): person-speed (edges/tick) vs
news-speed (distance-priced propagation) — whether the wanderer or the story arrives
first is a deterministic function of route grade, distance, and listeners (brokerage
presence) at the gate.

## 10. SURFACES

- **Herald:** charter/promotion/abandonment events (full address chains, dominant
  flow class, goods-denominated reasons); the realm map view reflects grade.
- **Cartography (TC):** edges are the field stage's arterial boundary conditions —
  grade renders as road weight; hidden paths render ONLY on the DM view (audience-
  projected: players see the overgrown nothing).
- **Dossier/Realm:** a settlement's lived connectivity (edges + grades) beside its
  genesis access, labeled honestly ("founded a crossroads; today, three roads and a
  harbor").

## 11. LIFECYCLE PATHS

Ledger persists via campaignState (JSON round-trip pinned); regen/undo/import per
the conditional-ledger norms; world export carries the network; player export
projects it (hidden paths + strategicNeed are DM truth). User-route immunity pinned
through every path (the write-that-ghosts pre-answer for W-D's provenance law).

## 12. TUNING (ROUTE_LIFECYCLE_TUNING — every entry a band, soak-vetoable)

Class weights (goods/population/military), formation + removal thresholds
(hysteresis pair), grade promotion/demotion dwells, expedition-worth ceiling,
resilience credit, hidden-path penalty, warm-start bonus, military charter bar.

## 13. TESTING ARCHITECTURE

- **Envelopes:** realm self-sufficiency monotone-improving absent shocks (the new
  realm metric); NETWORK STABILITY (anti-flap: charter+abandonment event rate
  bounded at soak horizons — the hysteresis proof); isolation-fate preservation
  (a designed too-far settlement stays isolated across the corpus).
- **Totality/invariants:** ports totality; corridor evaluation bounded (candidate-set
  size pin — the anti-quadratic law); edge-id determinism; user-route immunity;
  hidden-persistence (no edge with charter history ever reaches absence).
- **Integration pins:** destruction→hidden + revival warm-start (with the lifecycle
  kernel); interdiction reads the ledger (with supplyWebWarfare); the reputation
  race (with §6b + brokerages); genesis-vs-lived divergence honesty (a settlement's
  config never mutates).
- Dormancy goldens (aspatial + spatial); full negative controls per pin; subsystem-
  certification row (routeLifecycleEnabled — aliveness: charter/decay events +
  ledger keys; expectedTempo 'multi_year').

## 14. SLICES (W-J — each dark, gated, one commit, ledger row)

- **J1 LEDGER + GENESIS:** the network ledger, genesis derivation (access + k-NN +
  ports totality), edge determinism, dormancy goldens, round-trip pins. Inert — no
  lifecycle events yet.
- **J2 FLOWS:** the three-class corridor ledger wired to existing movers; the
  self-sufficiency metric into behavioral observation.
- **J3 CHARTER + DECAY:** formation/removal events through the docket, hysteresis,
  grade ladder, hidden persistence, destruction/revival integration, Herald.
- **J4 CONSUMERS:** roamer physics hookup (with W-H H3), garrison asymmetry with the
  war layer, interdiction integration, cartography arterial seeds, the reputation-
  race pin.

## 15. RISKS + DEFERRED

- **Risk — network churn reads as noise:** held by hysteresis bands + the stability
  envelope + pacing governor; the tuning pass owns final feel.
- **Risk — ledger cost at scale:** bounded candidate set (k-NN + edges + ports) is
  the law; the perf budget test extends to the lit network at N=30 before J2 lands.
- **Risk — two route truths (genesis config vs lived network):** held by Law 2's
  honesty surface (both shown, labeled) and the divergence pin; never reconciled by
  mutation.
- **DEFERRED (recorded):** bridges/passes as build projects (chartered
  infrastructure upgrades — after J4); bandit/interception encounters on routes
  (pairs with roamer mid-route — after W-H); caravan entities (visible goods in
  motion — presentation, after TC); cross-realm routes (after the region graph
  earns them).
