# DESIGN — THE LG FAMILY: THE LOGISTICS NETWORK (circles, fleets, journeys)

- **Status:** ARCHITECTED 2026-08-15 (Fable chair, the §46 sitting). Lands on
  the ledger branch (the build branch is mid-train); **fold obligation:** to
  the build branch, CLAIM_RE-checked, at the next integration point. Compiles
  cite THIS volume plus the graded substrate — never the volume alone.
- **The owner's directives are the constitution of this family and are bound
  BY REFERENCE, verbatim at their recorded homes:** OWNER_DECISION_QUEUE §46
  (circles, airships, the wartime one-way law, capacity bounds; addendum:
  settlement-derived reinforcement/supply volume), §46a (+2 addenda: the
  fleet model; economic rebuild speed), §46b (rescue exception, envoy
  vessels, the infiltration channel), §46c (+5 addenda incl. the restored
  avoidance clause: caravan cover, scaling laws, refusal-by-suspicion,
  wartime gates, confiscation with the inspection split, siege lockdown,
  capture resolution, refusal-continuation). A compile that paraphrases a
  directive instead of citing it is defective.
- **The graded substrate is `laneLGR-substrate.md` §§1-11** (this session's
  scratchpad, to be landed beside this volume at fold as
  `docs/implementation/preverification/LG-SUBSTRATE.md`). Its MEASURED rows
  are consumable under the SPV consumption law; its staleness clause binds.
- **Cross-family rulings this volume owns:** the POP/LG/ES column-class
  vocabulary (§C below); the LG sequencing against POP-1 (§D).

## §1 · LAWS (all inherited estate law binds; these are the family-specific ones)

- **L-LG-1 — ONE GRAPH.** All movement — ground, sea, air, circle — is edges
  in the one logistics graph the existing `distanceRead` machinery already
  queries. New modes are edge types with costs and predicates, never parallel
  pathfinders. "Strategically reasonable" IS least-cost over this graph;
  the transitive relay is derived, never special-cased (measured: it already
  is — substrate §1).
- **L-LG-2 — ONE POOL.** Air and sea vessels are one vessel-pool mechanism,
  two modes (air: any route, immune to ground forces; sea: sea lanes).
  Counts are DERIVED from tier/economy/population (coefficients only, §43
  law — the navalStrength idiom, substrate §11, noting it reads no
  population today: the fleet derivation ADDS the population read
  deliberately, a declared difference). COMMITMENTS are the only stored
  state (mission, return tick, rebuild-until) — this is the Q7 ruling, and
  it reconciles the fleet model with `supplyShipments.js`'s never-per-wagon
  cardinality law: we persist obligations, never wagons.
- **L-LG-3 — POLITICS IS THE PREDICATE.** Circle edges exist per-tick iff
  the relationship read says allied-or-mutually-beneficial; vessel charter
  from an ally likewise. Severance is instant and free — the graph is
  recomputed from the relationship plane each pulse.
- **L-LG-4 — UNITS FLOW TOWARD WAR, NEVER BACK** (§46a.3), with exactly one
  exception: the §46b rescue, triggered ONLY by measured route-absence (a
  deterministic graph query), capacity-bound, interceptable.
- **L-LG-5 — THE INSPECTION SPLIT** (§46c fifth addendum): a checkpoint
  converts cargo to OBSERVED truth and leaves destination as BELIEF; every
  confiscation decision reads two registers. Passengers' purposes are
  revealed by neither.
- **L-LG-6 — JOURNEYS ARE WORLD STATE.** A traveling NPC (spy, envoy) is a
  passenger of the world's own machinery: the group's reception, the
  army's belief, the siege's exits. No journey outcome gets bespoke dice;
  every §46c fate is the inherited resolution of an existing system, and
  where that system does not exist yet (caravan reception — substrate
  finding, POP-S), the wave is BLOCKED-ON its producer, never faked.
- **L-LG-7 — ALL VALUES CHAIR-SIGNED** under the §42/§43 derivation law:
  the airship speed factor, both capacity families, rebuild coefficients,
  the infiltration and cover multipliers, the suspicion scalers. Zero
  numbers are authored by implementers; a band without an executed
  derivation is a promotion STOP.

## §2 · THE TEN SUBSTRATE QUESTIONS, RULED

- **Q1 (edge licensing)** — the circle predicate reads the relationship
  plane through the existing alias table; no new relationship vocabulary.
- **Q2 (gating the live teleport bloc)** — RULED: the willingness gate
  (LG-0) lands GATED under a new virtual key, lit at the lighting phase.
  The defect (hostile routing through a target's circle) is live but
  UNOBSERVED — production has no users pre-launch — so dark worlds keep
  byte-identity and no golden shifts before the declared batch. The
  doctrine-10 shift is therefore scheduled, not smuggled.
- **Q3 (fleet count inputs)** — TIER_ORDER + PROSPERITY_TIERS + the
  canonical population read (POP's cured shape when POP-0/1 lands; until
  then the scalar read with the two-shape hazard noted — LG-2 preflights
  which is live).
- **Q4 (route reuse)** — airship routes ARE the existing route set;
  no air-route authoring. Sea = the landed sea lanes.
- **Q5 (airField vs ledger)** — RULED FOR THE W-NAVY LEDGER ROAD (the
  lane's lean adopted): vessel state lives in a spatial ledger family, not
  by lighting `airField` (whose six exact-null pins stay untouched).
- **Q6 (battle machinery)** — air battles are the landed naval stack
  verbatim (`resolveFieldBattle` + its consequence writers + news template,
  substrate §2); no new combat system, mode-specific costs only.
- **Q7 (persistence shape)** — counts derived, commitments stored (L-LG-2).
- **Q8 (news carriage)** — the in-flight army carrier idiom (substrate §10);
  meaningful only in non-omniscient worlds — LG-8 is a no-op under
  `infoMode: 'omniscient'` and its acceptance proves that no-op.
- **Q9 (feature minting)** — circles and airship docks are generated
  settlement features in the closed catalog (both already exist there,
  substrate §4), rarity tier-keyed; LG mints no new feature type, it
  CONSUMES two existing ones.
- **Q10 (the band-walker prefix)** — the LG prefix joins the band-walker
  alternation IN THE NEXT INFRA ACT, BEFORE any LG band lands; an LG wave
  landing a band before that prefix exists is a STOP (the CR-HB0B-BANDGAP
  class, pre-cured).

## §3 · THE FLAG FAMILY (two keys, dark by construction)

`circleNetworkEnabled` — the willingness gate + circle capacity + war use
of circles. `vesselFleetsEnabled` — the pool, airship travel, interception,
rescue, envoys, news carriage. Both virtual keys, byte-identical dormancy,
the §49/§50 THREE-OBLIGATION flag-mint law priced into their minting waves
(the ordered pin, the seven bundles, the literal drive). The §46c journey
waves ride `vesselFleetsEnabled` ∧ the ES mission flags they extend.

## §4 · THE WAVE LADDER (declared; ≤4-member trains; flag waves are boundaries)

- **LG-0 — THE WILLINGNESS GATE** (mints `circleNetworkEnabled`): the
  diplomatic predicate on teleport edges (the landed-defect repair, Q2's
  ruling); circle capacity attribute; the DM-tier reveal untouched.
- **LG-1 — GRAPH FORMALIZATION**: the political predicate plumbed as an
  edge attribute; capacity as edge cost; the transitive relay pinned by
  test (it exists; it becomes GUARDED).
- **LG-2 — FLEETS** (mints `vesselFleetsEnabled`): derived counts, stored
  commitments, the rebuild timer (`cooldownUntil` spelling), economic
  rebuild speed (§46a addendum).
- **LG-3 — AIRSHIP TRAVEL**: the one-origin-port law, the speed factor
  (chair band), ground-force immunity, trade round-trips.
- **LG-4 — INTERCEPTION**: air battles via the naval template; loss →
  rebuild window; the news kinds (producers land here, prose after).
- **LG-5 — WAR LOGISTICS**: reinforcement/supply through the network;
  settlement-derived volume (§46 addendum: capacity vs throughput as two
  typed reads); the wartime one-way law; confiscation events with the
  inspection split (L-LG-5) — the army's belief read, the supply gain,
  the reroute arm.
- **LG-6 — THE RESCUE EXCEPTION**: route-absence-triggered evacuation,
  capacity-bound, interceptable (the contested-evacuation composition is
  emergent, not authored).
- **LG-7 — ENVOY VESSELS**: the landed envoy machinery + the ES-Da rider
  seam; interception = a credibility/casus event via the GR-4c substrate.
- **LG-8 — NEWS CARRIAGE**: vessel arrivals deliver origin news
  (non-omniscient worlds; omniscient no-op proven).
- **LG-9..12 — THE JOURNEY WAVES** (§46b/§46c whole): the infiltration
  channel (knowledge-gated, much-smaller multiplier); caravan cover with
  the scaling laws, refusal-by-suspicion, group fate inheritance,
  encounter shielding; wartime gate relaxation; siege lockdown with the
  smuggler/tunnel/circle exits (substrate check owed: smugglers/tunnels
  as features — graded at compile); capture resolution by captor relation
  (the ransom substrate graded against the parked WR-era arm before
  chartering); refusal-continuation. **ALL BLOCKED-ON POP-1** (the
  reception producer) per §D.
- **LG-13+ — PROSE/DOSSIER WAVES**: strictly after their producers, per
  the GR law.

## §46d · THE FIFTH DIRECTIVE FAMILY (owner, 2026-08-15; ODQ §125)

- **Trade circles**: the circle predicate widens to trading partners for
  COMMERCIAL passage (allies free, partners tolled — chair proposal,
  vetoable); wartime capacity priority is an OPEN OWNER QUESTION at ODQ
  §125.1. One graph, one capacity pool; the toll books as host income.
- **Confiscation replenishes**: the LG-5 supply-gain arm strengthened —
  confiscated cargo feeds the army-supply model via the one-supply-truth
  contract; typed by the inspection's OBSERVED register only.
- **The caravan news chain**: a released caravan informs every caravan it
  crosses; informed caravans decide by strategy/risk/destination to
  continue or turn; returners mint/update army-position NEWS (belief
  plane, never ground truth). En-route civilian encounters are belief
  carriers — the Q8 idiom extended.
- **Size-scaled speed**: armies AND migrating population columns travel
  slower with size (chair-derived bands, §42/§43; the transit kernels
  gain the read).
- **Roaming captivity, no ransom**: settlement-less NPCs are capturable
  by bandit-class encounters, held a bounded time, released — the ransom
  machinery never mints for the untied. The LG-9+ compile grades whether
  a bandit-class producer is owed or the criminal machinery hosts it.

## §C · THE COLUMN-CLASS RULING (POP/LG/ES, ruled once)

The demographic column-class vocabulary (`columnOf`'s whitelist +
`DEMOGRAPHIC_COLUMN_CLASSES`) is ONE closed vocabulary owned by POP;
LG and ES CONSUME it read-only and may propose members only through a
POP-family wave. Neither LG nor ES ever forks or extends it locally. The
spy-in-column representation (§46c's map-position rule) is a PROJECTION of
the group's column — public surfaces render the column, the DM-tier reveal
follows the existing includeGroundTruth seam.

## §D · SEQUENCING

LG-0..LG-8 are unblocked at compile-time (substrate graded). LG-9+ waits on
POP-1 (the arrival/reception producer — POP-S's inversion finding). The
willingness gate (LG-0) is the family's first train; its compile preflights
the §49/§50 three obligations. Every LG band waits on Q10's prefix landing
(the next infra act). EP/WC ordering is unaffected — LG trains interleave
with other families under the standard dependency rules.

## §5 · REFUSALS (recorded with reasons)

- No per-vessel simulation beyond the commitment record (the cardinality
  law); no vessel names/crews — vessels are capacity, not characters.
- No second combat system; no air-specific battle math beyond mode costs.
- No per-account or per-world variation in any LG constant (THE PROMISE).
- No LG-local relationship vocabulary; no LG-local column classes (§C).
- No prose before producers; no band before the Q10 prefix.
- The §46c fates never get bespoke dice (L-LG-6) — a missing producer
  blocks the wave rather than being simulated shallowly.

## §6 · WHAT THE COMPILES OWE

Every LG packet: cites this volume + the substrate annex by sha; grades any
substrate row its manifest touches (the SPV consumption law); prices the
three-obligation flag law where a flag mints; carries the §31 anchor
preflight; runs the TTS validator simulation; declares census reds by
figure; and brings every value to the chair with its executed derivation.
