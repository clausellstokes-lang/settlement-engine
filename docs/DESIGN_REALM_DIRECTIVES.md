# DESIGN — THE SEVEN REALM DIRECTIVES

## Owner order 2026-07-31 ("please do it all then to your best judgement"), design reviewed same day.
### Authority: owner-delegated build; design judgments below are BINDING for every wave and
### recorded vetoably here. Engine-touching waves ship DARK behind virtual flags with dormancy
### goldens per the constitution (playbook §0.2). One wave = one commit + full gate + ledger row.

> **Progress**
> - 2026-07-31: Program opened. Waves A+B launched (tier-inertia certification;
>   neutral-connected default; full auto-resolve). C–G queued in order.
> - 2026-07-31 (later): Waves A+B RETURNED green. A: directive 6 CONFIRMED — tier
>   inertia is EMERGENT (scale-free predicate; causal layer supplies all resistance;
>   84.25% village vs 10.0% city demotion under matched load; envelope registered,
>   roster 15—16). B1: neutral-connected BUILT DARK, lit nowhere — all-pairs is
>   quadratic (J-D2 amended to k-NN, B1b queued). B2: full auto-resolve through the
>   proposal accept path with engine-adjudicated provenance; toggle persists. Gate +
>   commit in progress.
> - 2026-07-31 (B1b RETURNED): k-nearest selection BUILT (k=3, distance then codepoint
>   id, spatial canon when present and the codepoint-rank line when not). Edge
>   population CURED and pinned — 6/16/31 pairs at S=4/8/16 vs a complete graph's
>   6/28/120, complete at S<=4 by construction. Budget NOT cleared: lit ratios 3.891
>   (4→8) and 2.620 (8→16) against a 2.6 ceiling, versus all-pairs' 3.312/3.594 —
>   better, still red. The flag therefore STAYS DARK in every preset and lighting is
>   OWNER-GATED on re-scoping tickScanBudget (see the J-D2 correction below).
> - 2026-07-31 (⛔ OWNER STOP ORDER): "stop all of the building after the current
>   build as we wait for the soak. I may have to hand this off to another account."
>   BINDING STATE FOR ANY SUCCESSOR: waves A+B COMMITTED (45600de6/3183b3b9/260ddb7d,
>   gate-certified); wave C IN FLIGHT at order time (Herald tabs + create chrome +
>   B1b k-NN) — it completes, gates, and commits as "the current build"; EVERYTHING
>   AFTER IS HELD: waves D..J, W-H, W-I, TC-0..TC-8, the cure-proof rerun, the
>   subsystem-certification build, the tuning pass — ALL WAIT on owner resume. The
>   300y research soak (running) completes passively; its receipts + the preserved
>   failing 100y×4s receipt are the tuning pass's evidence when resumed. The full
>   design corpus is committed in docs/: DESIGN_REALM_DIRECTIVES (9 directives),
>   DESIGN_TOWN_CARTOGRAPHY, DESIGN_NPC_CONSEQUENCES, DESIGN_INFORMATION_BROKERAGES,
>   DESIGN_ROUTE_LIFECYCLE — every judgment veto-open, every wave sliced.

## The seven directives (owner, verbatim intent)
1. AUTOPLACEMENT — one button places all settlements on the realm map balancing sim dynamism
   and a connected visual web, matching terrain/resources; mismatches trigger an OPTIONAL
   "bare minimum adjustments" popup.
2. NEUTRAL-CONNECTED DEFAULT — campaign members start as neutral but connected neighbors
   unless explicitly told otherwise.
3. USER ROUTES — create a route between two chosen settlements; the path reacts to map
   geography.
4. SATELLITE TOPOGRAPHY — satellite births place within reason of the parent and derive
   starting resources from the map's topography and cues.
5. HERALD TABS — an active-settlements organizer and a settlement graveyard (stasis /
   destroyed) for retrospective review.
6. TIER INERTIA CONFIRMATION — higher-tier + successful settlements must be proportionally
   harder to drift unless matched by acute pressure/stressors.
7. FULL AUTO-RESOLVE — optionally auto-resolve everything including majors; when OFF,
   pending decisions leave the Herald and appear in a popup replacing the advance-time
   popup after Advance is pressed.

8. NPC CORRUPTION CONSEQUENCES (added 2026-07-31) — an exposed-corrupt NPC never dies
   (death stays the DM's alone); the engine resolves one of five outcomes: jailed (prisons
   exist) / banished (no prisons) / roaming (rehosts elsewhere, reputation travels,
   may found a faction) / turncoat (rival-nation compromise embeds them there) /
   criminal_founding (criminal-institution compromise + that power present). Full faction
   ⇒ found a sibling faction under that power; open faction ⇒ enter at the lowest
   position; rejection possible on alignment/archetype/history conflict. The vacated
   slot refills shortly after with a roaming/random NPC whose traits are MARGINALLY
   biased toward the settlement's state (noticeable at scale only).
   AMENDED 2026-07-31: on SETTLEMENT DESTRUCTION (the terminal-death lane), every named
   NPC becomes roaming BY DEFAULT — durable id minted at dispersal, reputation intact —
   except rival-compromised NPCs, who additionally retain the turncoat option. Roaming
   is a state, never a fate: the never-resolve-fates law holds at the grave's edge.
   AMENDED 2026-07-31 (three additions): (i) the Herald gains a WANDERERS tab — the
   roaming pool as an in-world register, with a DM ASSIGN verb placing a roamer into a
   settlement (rides the command/adjudication discipline; assignment is address-chain
   news: "X takes up residence in Y"). (ii) JAILED or ROAMING NPCs RELINQUISH ALL
   INFLUENCE in their settlement — and the vacancy is never silently refilled: it routes
   through the existing succession/faction-competition machinery as a contested opening
   (power abhors a vacuum; the contest is the story). (iii) NPCs CAN die — but ONLY by
   explicit user order: a DM death verb with receipts, snapshot-undoable like every
   canon edit. The engine's never-kill law is unchanged; the DM's authority is total.
   AMENDED 2026-07-31 (taxonomy ruling): BANISHED IS A VERDICT, ROAMING IS A STATE —
   they are not sibling outcomes. Banishment, destruction-dispersal, and flight all
   RESOLVE INTO the one roaming state; the outcome vocabulary is
   { jailed, banished, turncoat, criminal_founding } with roaming as the shared
   resulting status. What distinguishes banishment mechanically is the EXCLUSION EDGE:
   the engine never rehosts a banished roamer to the settlement that banished them
   within the exclusion window (tunable band, long by default), and the edict carries a
   harsher reputation mark than a scandal-only displacement. The DM assign verb remains
   sovereign and may override any exclusion explicitly.
   AMENDED 2026-07-31 (population floor invariant): NPCs COUNT TOWARD POPULATION, and a
   settlement can never reach 0 population while at least one named NPC resides there —
   population >= resident named-NPC count AT ALL TIMES; anonymous residents drain first.
   RECONCILIATION with the terminal-death lane (the 2026-07-31 zombie cure): a town
   reduced to only its named cast IS terminal-decline eligible ("only the innkeeper
   remains" is a dying town), but resolution DISPERSES the cast into roaming (per the
   destruction rule) in the same outcome — the empty fast path's effective-zero floor
   evaluates against pop MINUS resident named NPCs, and W-H must land this
   reconciliation inside settlementLifecycleFirstClass alongside the roaming pool.

9. ORGANIC ROUTE LIFECYCLE (added 2026-07-31) — as time advances, routes form and
   fade organically: efficiency-primary (settlement AND system benefit), topography-
   reactive, reacting to rise/fall, conflict, and shifting trade costs. Isolation ends
   when connection becomes worth an expedition — or persists as geographic fate when
   nothing ever will. Removal where the system says it is not worth it, and on
   settlement destruction — ALWAYS leaving a HIDDEN PATH (the roads-layer remnant,
   pairing with the settlement remnant's privileged-rebirth law) for potential revival.
   PORTS TOTALITY: every port settlement has water routes (the seaRoads coverage
   becomes an invariant). ROAMER TRAVEL PHYSICS: roaming NPCs move at most ONE
   route-hop per tick, only on routes connected to their current settlement, and may
   be MID-ROUTE at any pause (the armyTransit ledger pattern).
10. THE MAGIC-ECONOMY DISASTER BUFFER (added 2026-07-31) — high magic and high economy
    each buffer catastrophe individually, and their COMBINATION is the strong buffer:
    damage reduction against, repair acceleration following. THE DEPENDENCY ASYMMETRY
    (owner insight, binding): magic's contribution is GATED by economy — magic consumes
    resources and materials, so mitigation = economy_term + magic_term × economy_gate;
    a high-magic poor settlement buffers barely better than a mundane poor one.

## Binding design judgments (the manager's rulings under delegation — vetoable here)
- **J-D1 (autoplacement consent):** placement-first — the placer finds best-fit terrain for
  every settlement before proposing ANY change. The popup itemizes exactly what it will do,
  in three strictly separated classes: (a) move a settlement (safe, default), (b) paint map
  terrain (FMG-canvas mutation — only with itemized consent, never bundled), (c) re-terrain
  a settlement (NEVER offered silently: it changes generation inputs and therefore the world
  under the same-seed law; offered only as an explicit labeled regen). Placement scoring is
  a pure seeded derivation over the spatial rasters; same realm + seed ⇒ same layout. The
  dynamism objective deliberately avoids sparse degenerate layouts (the small-N stasis
  evidence, 2026-07-31 soak).
- **J-D2 (neutral-connected):** the default edge = diplomatic KNOWN + minimal route
  awareness. NOT a free trade route, no resource flow. Versioned default applying to NEW
  worlds only; existing seeds keep frozen semantics (THE PROMISE).
  **AMENDED 2026-07-31 (B1 measurement):** the all-pairs edge set is QUADRATIC and reds
  the tick-scan budget 3.32x at realm scale (measured, not shipped). The default edge set
  is k-NEAREST SPATIAL NEIGHBORS, k=3 (deterministic: distance, then codepoint id) —
  COMPLETE at N<=4 (exactly where the small-N stasis medicine binds) and O(S*k) at scale,
  under budget with no raise. The dark seam as built stands; only the pair-selection
  function changes (B1b, folds into wave C's batch).
  **CORRECTED 2026-07-31 (B1b measurement — the amendment's last clause was wrong):**
  k-nearest is BUILT and its structural claims are CONFIRMED — the selection takes
  6 / 16 / 31 pairs at S = 4 / 8 / 16 against a complete graph's 6 / 28 / 120, always
  within S·k, and is exactly complete at S <= 4. But "under budget with no raise" is
  MEASURED FALSE. Driving the tickScanBudget fixture 12 ticks under full_simulation:
  dark 1205 / 2521 / 5893 scanOps (ratios 4→8 2.092, 8→16 2.338); lit k-nearest
  1007 / 3918 / 10266 (3.891, 2.620); lit all-pairs 1001 / 3315 / 11913 (3.312, 3.594).
  k-nearest beats all-pairs where the asymptote lives (8→16: 2.620 vs 3.594 on 46 edges
  instead of 128) but no lit window clears the 2.6 ceiling, and the 4→8 window is
  STRUCTURALLY UNWINNABLE for any k while completeness at S <= 4 is mandated: the lit
  S=4 fixture is already saturated (+1 edge) while lit S=8 gains +9, so the denominator
  cannot grow. The ceiling is a 4→8 calibration against the DARK fixture's density, not
  a scale-free law (the dark ratio itself climbs 2.092 → 2.338). CONSEQUENCE: the flag
  STAYS DARK in every preset. Lighting it is OWNER-GATED and now costs exactly one
  decision — re-scope what tickScanBudget measures (a window/ceiling that admits the lit
  density, holding the index-regression teeth), or price the remaining shape (a lighter
  default-edge class the hot indices skip until the pair evolves). Nothing else about
  J-D2 changes; the k-nearest selection ships regardless because it is strictly better
  than all-pairs at every scale.
- **J-D3 (user routes):** CREATE_ROUTE is the second command-spine vertical, the mirror
  sibling of CUT_TRADE_ROUTE — same family, same journal/receipt discipline, one
  transaction. User picks endpoints; the engine paths via the spatial travel-cost raster.
  User-created routes carry a provenance mark every lifecycle path (regen, reroll, import)
  must respect — pinned with a JSON-round-trip regen-survival test.
- **J-D4 (satellite topography):** satellites sample spatial rasters READ-ONLY at a seeded
  draw inside the orbit annulus; they never join the frozen spatial digest. Resource
  derivation uses the sampled topography through the existing resource-strike vocabulary.
- **J-D5 (Herald tabs):** in-world framing — "Gazetteer" (living roster) and "Ruins &
  Remembrance" (graveyard). Graveyard v1 shows remnant grades + Destroyed-rubric library
  rows + their chronicle receipts. USER-PARKABLE STASIS IS DEFERRED (recorded, not built):
  it is a new canonical lifecycle state requiring full persist/regen/undo/import design —
  deliberately deferred, not a bug to re-find.
- **J-D6 (tier inertia):** confirmation = a powered distribution-envelope property (drift
  probability as a function of tier × prosperity × pressure acuteness) + an invariant row
  destined for the subsystem-certification registry (tierDriftEnabled). If the property
  fails, the fix is a TUNING BAND, not code, and routes to the tuning pass.
- **J-D7 (auto-resolve + decision surface):** full-auto = productized wide-world mode
  (majorChangesRequireProposal false path), proven by the 30y soaks. Auto-adjudicated
  majors carry engine-adjudicated provenance so retrospective review always shows who
  ruled. When auto-resolve is OFF: ONE gathered adjudication screen replaces the
  advance-time popup (never a sequential modal chain). Dismissal parks unresolved items in
  a durable HELD DOCKET that re-surfaces on the next advance and shows a one-line Herald
  pointer; nothing is ever silently dropped (the coup-guarantee law extends to the UI).

- **J-D8 (NPC consequences — the exhaustiveness blueprint, BINDING for W-H):**
  (a) TOTAL seeded decision table over the closed outcome vocabulary — no fall-through;
  (b) identity earned by consequence: a mobile NPC graduates to a durable WORLD-SCOPED id
  at exposure; roster locals stay positional; (c) reputation = typed banded facets
  (finite-semantics), travels with the durable id, decay tunable; rejection = an authored
  compatibility table (alignment x archetype x history flags), closed and pinned;
  (d) replacement bias = a powered envelope property at the designed small effect size
  (the Wave-A instrument) landing through the slot-inheritance + pin-remap machinery;
  (e) every path walks BOTH alias homes (npcs[] and factions[].members[]) with
  JSON-round-trip, regen, and undo pins; faction founding mints new ids, never reuses;
  (f) every outcome is address-chain Herald news, and later rejections REFERENCE the
  original scandal (circulation made visible); (g) dark virtual flag + dormancy golden;
  fires ONLY on revealed corruption (covert seam untouched; ~6.75% capture truth
  upstream unchanged); all rates in tuning bands.

- **J-D8b (protective guards, bound 2026-07-31 after whole-design review):**
  (i) POOL EQUILIBRIUM — the roaming pool has outflow pressure: unassigned roamers
  eventually settle themselves at tunable rates; pool size is envelope-bounded at soak
  horizons (a register that only grows is the product's anti-pattern).
  (ii) TRAIT STATIONARITY — the replacement bias must not compound: cast trait
  distributions at year 100 match year 10 within a powered envelope (guards the
  corruption-attracts-corruption feedback loop the bias could seed).
  (iii) AUDIENCE PROJECTION OF THE POOL — roamer records carry DM truth (a turncoat's
  compromise source is covert intelligence); the Wanderers tab and every pool
  projection ride the includeCovert seam extended to world-level NPC state.
  (iv) TURNCOAT CAPACITY is a closed vocabulary, authored before W-H starts.
  W-H is SLICED AS A PROGRAM: H1 identity+state, H2 outcomes, H3 circulation+rejection,
  H4 UI+verbs — each dark, each gated, each its own commit.

- **J-D9 (route lifecycle — Fable refinements, veto open):** (a) DEMAND-THEN-CHARTER
  formation: accumulated informal corridor flow crosses a threshold, then a charter/
  expedition EVENT materializes the route — every network change is an address-chain
  story, never silent re-optimization (anti-stasis, anti-flap, pacing-governed);
  (b) HYSTERESIS: formation threshold well above removal threshold; wars never remove
  routes on the fast timescale (trade_route_disruption is the fast layer; organic
  removal is the slow verdict); (c) DUAL-BENEFIT formation (local demand AND system
  improvement) with its asymmetric mercy: system-critical links resist removal while
  an endpoint struggles; (d) decay ladder road → track → hidden → (hidden persists);
  wanderers and smugglers may travel hidden paths slowly, armies may not;
  (e) THE REPUTATION RACE is a designed property: persons move at road speed, stories
  at news speed — pinned as an integration property with the brokerage/belief layer;
  (f) dark flag routeLifecycleEnabled + dormancy goldens + all thresholds as tuning
  bands; charter and abandonment events carry full address chains.
  **AMENDED 2026-07-31 (owner clarification — EFFICIENCY IS MATERIAL):** the route
  objective is denominated in GOODS AND SERVICES, not abstract cost: (g) corridor
  demand derives from actual commodity/service IMBALANCES through the existing
  vocabulary (goodsCatalog, supplyChainData, commodity flows, foodBalance import
  channels) — a grain deficit west and a surplus east IS the corridor's demand, so a
  charter event can say WHY in goods ("grain wants to move west; the road follows");
  (h) the SYSTEM term = REALM SELF-SUFFICIENCY: a candidate route scores by how much
  it reduces the realm's aggregate unmet demand (closing material loops), with a
  resilience credit for giving a critical good a second path — and self-sufficiency
  becomes a MEASURED realm metric (certification observation + soak envelope
  candidate: the network should monotonically improve realm self-sufficiency absent
  shocks); (i) this gives supply-web warfare its true target — cutting a route now
  severs a named material artery, and the war layer's interdiction reasoning reads
  the same flow ledger the charter events write.
  **AMENDED 2026-07-31 (owner: incorporate military + population movement):** the
  corridor demand ledger carries THREE NAMED FLOW CLASSES, each with its own weight
  band: (j) GOODS/SERVICES (as above); (k) POPULATION — migration flows WEAR PATHS
  (desire-path mechanic: a booming settlement's inflow literally paves its roads;
  roamer and mid-route traffic count as informal flow); (l) MILITARY — deployments
  and mobilization corridors accumulate strategic demand; powers may charter MILITARY
  ROADS (a distinct charter flavor with its own address-chain attribution: the
  Crown's road, not the Guild's), and a militarily critical route RESISTS DECAY while
  strategic need persists even after trade dies (the garrison-road asymmetry — the
  war layer writes strategic need into the same ledger). Charter events name their
  dominant flow class so every road tells its origin story.
- **J-D10 (disaster buffer — Fable refinements, veto open):** (a) THE BUFFER SPENDS
  ITSELF: mitigation CONVERTS damage into economic drain (treasury, stocks, magical
  reserves draw down) — damage transmutes, never vanishes; a spent buffer is a
  vulnerability window, and the second shock is the story the first could not be;
  (b) MITIGATION CEILING: banded cap, never nullification — tail risk survives at
  every wealth level; (c) REACHABILITY PIN mandatory: the high-magic × high-economy
  cell must be proven reachable in generated corpora (the unreachable-conjunction
  hazard class; effectReachability idiom); (d) receipts narrate the buffer ("the
  wards held; the granaries paid") — Herald-carried, legibility law; (e) envelope:
  damage distributions conditioned on magic × economy show the designed ordering AND
  the gating asymmetry (high-magic/low-economy ≈ mundane/low-economy); (f) bands in
  the disaster kernel's tuning table; dark behind the existing disasters flag family;
  dormancy golden. Builds in W-K (queued with the held waves).
  **AMENDED 2026-07-31 (owner: PRESENCE vs EXPLOITATION):** high magic exists
  INDEPENDENTLY of economy — magic-class institution PRESENCE keys off magicLevel
  alone (the magicFilter seam; high magic ⇒ high presence odds at any wealth).
  Economy gates EXPLOITATION only: the economy_gate graduates from a disaster-local
  term to THE canonical magic-exploitation gate — ONE definition (single-writer for
  formulas), read by every magic-derived output (buffer, economic contribution,
  wards, service scale). This mints the MYSTIC BACKWATER archetype (real power, no
  capital, mechanically modest, LATENT — rising economy awakens it; an upswing story
  needing zero new machinery). Pins: presence-independence (magic-institution rates
  at high magic invariant across economy bands), archetype reachability
  (poor+high-magic cells generate magic institutions in real corpora), exploitation
  ordering (magic output monotone in economy at fixed magic).
  **RECONCILED 2026-07-31 (owner + Fable — THE REGIME LADDER):** the exploitation
  gate is thresholds-with-bands, the house idiom (tiers, route grades): a CLOSED
  regime vocabulary — subsistence | funded | patronized | industrial (authored,
  final names owner-vetoable) — entered by economy THRESHOLDS, with continuous
  BANDED gradation within each regime. Silent drift inside a regime; a Herald EVENT
  at every crossing ("the enchanters' circle takes a patron"; "the guild opens its
  foundry") — events-never-silent-drift, applied to magic. HYSTERESIS at every
  threshold (promotion above demotion — no flapping foundries). Presence stays
  magic-only per the amendment above; the ladder + bands live in one tuning table;
  the regime vocabulary joins finite semantics; transition events carry address
  chains and material receipts (what the crossing cost).

## Waves (execution order = the reviewed sequencing)
- **W-A (item 6):** tier-inertia envelope + pins. Done-when: envelope registered, powered,
  green or a documented tuning-band finding. NO engine edits.
- **W-B (items 2 + 7-auto):** neutral-connected default (dark flag `neutralNeighborsDefault`
  or the established naming) + full auto-resolve mode with provenance marks. Done-when:
  dormancy goldens byte-identical, defaults versioned, pins + negative controls, gate green.
- **W-C (item 5):** Gazetteer + Ruins & Remembrance Herald tabs (lazy, a11y, legibility
  law), stasis deferral recorded in-code.
- **W-D (item 3):** CREATE_ROUTE command vertical + provenance-marked routes + spatial
  pathing + regen-survival pins.
- **W-E (item 4):** satellite topographic resources.
- **W-F (item 7-popup):** the gathered adjudication screen + held docket + Herald pointer.
- **W-G (item 1):** autoplacement (scoring derivation + button + consent popup per J-D1).
- **W-K (item 10):** magic-economy disaster buffer per J-D10 (HELD with all waves).
- **W-J (item 9):** organic route lifecycle per J-D9 — demand ledgers, charter/decay
  events, hidden-path remnants, ports-water totality invariant; roamer travel physics
  land in W-H H3 (shared armyTransit pattern).
- **W-H (item 8):** NPC corruption consequences per J-D8 — architected fully at wave
  start (its own slice spec), built dark, envelope-verified, Herald-wired.

## Interleaving with the standing pipeline
The 300y research soak, its cure-proof rerun (100y×4s), the subsystem-certification build,
and the tuning pass proceed as already sequenced; realm-directive waves fill the compute
gaps and never run gates concurrently with another wave's gate.
