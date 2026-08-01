# DESIGN — NPC CONSEQUENCES (directive 8: the personal consequence economy)

## Owner-commissioned 2026-07-31 ("fully and exhaustively architect it out"); binds with
## DESIGN_REALM_DIRECTIVES.md directive 8 + J-D8 + J-D8b (all amendments incorporated).
## Status: DESIGN, frozen at dispatch — W-H (sliced H1..H4) executes FROM this document.
## Companions: DESIGN_NPC_LIFECYCLE.md (THE FACET LAW — reputation is facets),
## DESIGN_SETTLEMENT_LIFECYCLE.md §2 (terminal death + the 2026-07-31 empty fast path),
## DESIGN_CORRUPTION_WEB.md (the covert/revealed seam this system consumes).

## 0. THESIS

Exposure stops being a terminal stamp and becomes CIRCULATION. A caught-corrupt NPC
resolves through a total verdict table — jailed, banished, turncoat, criminal founding —
with ROAMING as the shared displaced state; reputations travel as typed facets; vacated
influence becomes a contested opening; replacements carry the settlement's fingerprint;
a destroyed settlement scatters its named cast as story-seeds; and the Herald tracks all
of it by address. The engine never resolves a fate. The DM's authority is total.

## 1. CONSTITUTIONAL LAWS (each pinned; violations are wave-blocking)

1. **NEVER-KILL / DM-SOVEREIGN:** the engine kills no named character, ever. The DM
   gains explicit verbs — assign, kill, pardon/lift-exclusion — with receipts and
   snapshot undo. Verdicts are states; only the DM writes fates.
2. **REVEALED-ONLY:** the system fires exclusively on the corruption web's
   covert→revealed transition. Covert corruption is untouched; the ratified ~6.75%
   capture tuning upstream is not this system's dial.
3. **TOTALITY:** the verdict function is total over (exposure context × settlement
   state) — closed vocabulary, deterministic seeded tie-breaks, no fall-through (the
   mountain_pass class is pre-answered).
4. **FINITE SEMANTICS:** reputation, rejection reasons, turncoat capacities, verdict
   causes — all closed vocabularies / banded facets. No free prose in mechanics.
5. **DORMANCY:** everything behind virtual `npcConsequencesEnabled` (absent from
   DEFAULT_SIMULATION_RULES); dark ⇒ byte-identical generation and pulse (fenced golden).
6. **CONSERVATION:** an NPC is never duplicated and never vanishes — every transition
   moves exactly one durable identity between exactly two ledgers; population arithmetic
   respects the named-cast floor (§9).
7. **AUDIENCE PROJECTION (J-D8b iii):** roamer records carry DM truth (compromise
   sources are covert intelligence). Every pool projection rides the includeCovert seam
   extended to world-level NPC state; players see the wanderer, never the owner.

## 2. WHAT EXISTS (verified in-tree 2026-07-31 — consumed, never rewritten)

- `isCompromised` + compromised presentation modes on the NPC record
  (npcGenerator.js ~:800); the corruption web's covert/revealed seam.
- Prisons are real catalog institutions ('Small prison/stocks', 'Large prison') — the
  jailed precondition is an institution-presence check, not a new concept.
- Influence machinery: `influenceBasis` closed vocabulary (legal_authority,
  public_legitimacy, manpower, wealth, ...), npcLadder* (position contests),
  npcCredibility, npcAgency, faction competition + succession (the vacancy consumers).
- THE FACET LAW (DESIGN_NPC_LIFECYCLE.md): NPC attributes as bank-typed facets —
  REPUTATION IS BUILT AS FACETS, not a new subsystem.
- Slot inheritance + `_preservation` remap (locks + pinnedNpcs) — the replacement lane's
  identity machinery, hardened 2026-07-30.
- Terminal-death + empty fast path (settlementLifecycleFirstClass, 2026-07-31) — the
  destruction-dispersal trigger. Region powers/neighbour realms (src/domain/region) —
  the turncoat destination space. Herald address-chain news; the command spine (DM verbs).

## 3. CANONICAL MODEL

### 3a. Identity graduated by consequence
Roster NPCs keep positional ids (`npc_N`). At FIRST cross-settlement consequence
(any verdict, or destruction dispersal), the NPC graduates: a durable world-scoped id
`wnpc_<seededHash>` is minted ONCE (seeded from settlement seed + roster identity +
tick — deterministic, collision-checked), recorded on the NPC record and in the world
ledger. Local machinery keeps using slot ids; every cross-settlement surface keys ONLY
on the durable id. Graduation is one-way and idempotent.

### 3b. The world NPC ledger (new worldState surface, conditional key, drop-when-empty)
```
worldState.npcLedger: {
  roamers:   { [wnpcId]: RoamerRecord },       // the pool (Wanderers tab reads this)
  placed:    { [wnpcId]: PlacementRecord },     // graduated NPCs currently hosted
  exclusions:{ [wnpcId]: ExclusionEdge[] },     // banishment doors, windowed
}
RoamerRecord = { identityFacets, reputation: ReputationFacets, originRef,
                 verdictCause, sinceTick, dmTruth: { compromiseSource? } }
ReputationFacets = closed banded facets (THE FACET LAW): notoriety band, edict mark
                 (banished only), scandal class, alignment-read, competence-read.
ExclusionEdge = { settlementId, kind: 'banishment_edict', untilTick|indefinite }
```
Dormant ⇒ key absent ⇒ prior bytes (the armyTransit/satellites ledger pattern).

### 3c. The verdict table (total, seeded)
Inputs: exposure context (compromise source: none | rival_power | criminal_institution),
settlement state (prison present?, criminal power present?, faction capacities),
NPC facets. Outcomes (closed): `jailed | banished | turncoat | criminal_founding`.
Resolution order (deterministic):
1. rival-compromised → turncoat ELIGIBLE (weighted seeded choice vs banished/jailed —
   a compromised official may still just be jailed; bands tunable);
2. criminal-compromised + criminal power present → criminal_founding ELIGIBLE (same);
3. otherwise: prison present → jailed; no prison → banished.
Banished/turncoat/criminal_founding all RESOLVE INTO roaming placement flows (§6);
jailed holds the NPC in place, influence-stripped, until DM release or a tunable term.
Every verdict emits an address-chain Herald item with the receipt naming inputs.

## 4. INFLUENCE RELINQUISHMENT — the contested opening

On jailed or any roaming-resolving verdict: the NPC's ladder position, faction role,
and influence contributions are STRIPPED atomically (both alias homes: npcs[] and
factions[].members[]). The vacancy is NEVER silently refilled — it is emitted as a
contested opening into the EXISTING succession / npcLadderContest / faction-competition
machinery with a `vacancy_from_disgrace` cause tag. Power abhors a vacuum; the contest
is the story, and it is their story to run — this system only opens the door.

## 5. REPLACEMENT — the settlement's fingerprint

"Shortly after" a roster slot empties (banded delay, seeded), the slot refills through
the EXISTING slot-inheritance lane: a roamer (if one passes §6 admission — priority) or
a fresh mint. Fresh mints draw traits with a MARGINAL bias toward settlement state
(alignment lean, economic character, stress posture): one small documented weight in
NPC_CONSEQUENCES_TUNING, envelope-pinned at the designed effect size (small enough that
individuals surprise, large enough to read at scale) AND stationarity-pinned (J-D8b ii):
cast trait distributions at year 100 match year 10 within power — the
corruption-attracts-corruption loop is measured shut. Locks and pinnedNpcs ride the
existing `_preservation` remap unchanged.

## 6. CIRCULATION — rehosting, rejection, equilibrium

- **Candidate flow:** each pulse, roamers evaluate seeded rehost attempts against
  reachable settlements (spatial distance-weighted; exclusion edges filtered FIRST).
- **Admission:** target faction with open capacity ⇒ enter at LOWEST position; all
  factions full ⇒ found a sibling faction under that power (new faction id, seeded
  name, never reused); no compatible power ⇒ remain roaming.
- **Rejection (authored, closed):** a compatibility table over (roamer facets ×
  faction archetype × alignment × reputation marks × past-history flags). A rejection
  emits address-chain news REFERENCING THE ORIGINAL SCANDAL (circulation made visible).
  Rejected pairs record a cooldown edge (no per-tick retry spam).
- **Turncoat flow:** destination = the compromising rival power's sphere; capacity from
  the CLOSED vocabulary (J-D8b iv): `advisor | agent | quartermaster | envoy |
  enforcer` — mapped from the NPC's profession facet by authored table; embeds via the
  same admission rules inside the rival's settlements/factions.
- **TRAVEL PHYSICS (owner amendment 2026-07-31):** roamers move at most ONE
  route-hop per tick, only on routes connected to their current settlement, and may be
  MID-ROUTE at any pause — the armyTransit conditional-ledger pattern (drop-when-empty,
  dormancy-safe). Wanderers may use hidden paths (slowly); armies may not. DESIGNED
  CONSEQUENCE: a person travels at road speed while their story travels at news speed —
  the reputation race is a real mechanic (integration property pinned with §6b and the
  brokerage persons channel: whether the wanderer or the rumor arrives first depends on
  distance, route quality, and listeners at the gate).
- **Equilibrium (J-D8b i):** rehost pressure RISES with time-in-pool (banded), so
  unassigned roamers eventually settle themselves; pool size is envelope-bounded at
  soak horizons. The Wanderers register cannot become a graveyard of forgotten names.

## 6b. REPUTATION AS BELIEF (owner amendment 2026-07-31 — supersedes global-fact
## reputation; the epistemology unification)

The ledger records TRUTH (what happened, where, verdict, marks). What any settlement
BELIEVES about a roamer is DERIVED through the information layer: distance-priced decay
from the origin, complicated by infoMode — unreliable information can REINFORCE (the
rumor grows) or COUNTER (the story dies on the road) the truth, deterministically seeded
per (settlement, roamer, elapsed). Admission and rejection checks run against the LOCAL
BELIEF, never the global truth — a wanderer can outrun their story or be preceded by a
worse one. ENGINEERING GUARD: beliefs are derived on demand from the news/rumor record,
NEVER stored per-pair (no S x roamers state); the derivation is pure and pinned. This
gives the knowledge mover lane a personal payload (tuning-agenda tie-in: the starved
lane becomes load-bearing here).

## 6c. UNAFFILIATES + RESIDENCY (owner amendment 2026-07-31)

Roamers REST somewhere: each settlement dossier gains an UNAFFILIATES section — the
local projection of the same world ledger (one truth, two views: Wanderers tab = world,
unaffiliates = local). Stay durations are banded (weeks to years, seeded); transitions
happen on any advance (seeded) or by user input. Residency PREFERENCE weights toward
settlements matching the roamer's personal state — weighted, never bounded. While
resident, experiences reshape them: stay duration x settlement state x witnessed events
drive personality drift through the EXISTING growth system (npcGrowthKernel / trait
planes), bounded within facet bands at capped rates — a decade bends a person, never
replaces them. PRESENTATION: titles prefix "(former ...)"; the card carries a one-line
why (banishment / destruction / jail — jail cards carry it too), audience-projected.

## 6d. CRIMINAL DESTINATION GENERALIZATION (owner amendment 2026-07-31)

Criminal-compromise verdicts may target ANY settlement hosting a criminal-organization
power — join its faction at the lowest position or found a sibling under that power —
making the underworld a realm-wide network, not a local feature. Same admission,
rejection, and belief rules as every other flow.

## 7. DM VERBS (command-spine discipline, each with receipts + snapshot undo)

- **ASSIGN** a roamer to a settlement (sovereign — may override exclusions explicitly;
  the override is named in the receipt). Address-chain news: "X takes up residence in Y."
- **KILL** (the only death in the system): DM-explicit, receipt-carried, undoable.
- **PARDON / LIFT EXCLUSION / RELEASE (jail):** the mercy verbs — same discipline.
All three register in operationRegistry (+ compendium regen) and ride the gathered
adjudication surface once W-F lands.

## 8. HERALD SURFACES

- **WANDERERS tab** (with Gazetteer and Ruins & Remembrance): the roaming pool as an
  in-world register — identity, notoriety band, origin story pointer, time wandering;
  audience-projected per Law 7; the DM sees dmTruth, players never do.
- Every transition is address-chain news with typed causes: exposure, verdict,
  departure, rejection-at-the-gate (referencing the scandal), arrival, founding,
  turncoat surfacing (DM-only until revealed — an information-statecraft hook).

## 9. THE POPULATION FLOOR (reconciliation, binds W-H and the lifecycle kernel)

Population >= resident named-NPC count AT ALL TIMES; anonymous residents drain first.
The empty fast path's effective-zero floor evaluates against (pop − resident named
NPCs); a town reduced to only its cast IS terminal-decline eligible, and terminal
resolution DISPERSES the cast into the pool (rival-compromised members retain the
turncoat option) in the SAME outcome — the two laws compose. Population conservation
sums remain exact through dispersal (named NPCs carry their own count into the ledger).

## 10. LIFECYCLE PATHS (the write-that-ghosts pre-answer — every one pinned)

Every ledger write survives: save/reload (JSON round-trip — the alias trap walks BOTH
npc homes), regenSection (graduated NPCs and vacancies preserved via the preservation
report), snapshot undo/revert (ledger participates in campaignState), import/export
(world export carries the ledger; player variant projects it), gallery/public
projection (Law 7), and the DM verbs' own undo. A graduated id is NEVER re-minted.

## 11. DETERMINISM + TUNING

All randomness through seeded forks (`npcfate:*` labels). NPC_CONSEQUENCES_TUNING
(kernel-adjacent, the house table shape): verdict weights, jail terms, replacement
delay + bias weight, rehost pressure curve, rejection strictness, exclusion window,
pool pressure bands — every rate a band, every band soak-vetoable (PROPOSED shape).

## 12. TESTING ARCHITECTURE

- Verdict-table TOTALITY pin (every context×state cell resolves; no fall-through) +
  per-outcome fixture pins with executed negative controls.
- Dormancy golden (flag off ⇒ byte-identical, aspatial + spatial).
- Envelopes (the Wave-A instrument): replacement-bias effect size; trait stationarity
  at century horizon; pool boundedness at soak horizon.
- JSON-round-trip + regen + undo pins per lifecycle path (§10); alias-home dual-walk
  pins; graduated-id idempotency pin.
- Audience-projection pins: player pool projection contains zero dmTruth keys
  (anchored negatives per the walker laws).
- Soak integration: the subsystem-certification registry gains an
  npcConsequencesEnabled row (aliveness: verdict/rejection/arrival event types + pool
  ledger key; expectedTempo 'reactive').

## 13. SLICES (W-H AS A PROGRAM — each dark, gated, one commit, ledger row)

- **H1 IDENTITY + STATE:** durable-id graduation, the world ledger, exclusions,
  reputation facets (via THE FACET LAW), dormancy golden, round-trip pins.
- **H2 VERDICTS:** the total table, influence stripping + contested openings, jail
  holds, Herald verdict news, verdict envelopes.
- **H3 CIRCULATION:** replacement + bias + stationarity, rehost/rejection/equilibrium,
  founding, turncoat flows, destruction dispersal + population floor reconciliation.
- **H4 SURFACES + VERBS:** Wanderers tab (audience-projected), the three DM verbs
  through the command spine, adjudication-surface integration, compendium regen.

## 14. RISKS, HONESTLY

- **Combinatorial test surface** (highest): the verdict×capacity×rejection×exclusion
  matrix — held by the totality pin and authored-table closure; budget H2/H3 test time
  generously.
- **Cross-settlement identity is a one-way door:** the durable-id contract must be
  right at H1; changing id semantics after persistence ships is a migration. H1 gets
  the heaviest review.
- **Narrative flooding:** a busy realm's circulation could crowd the Herald — the
  pacing governor treats circulation news as a capped lane (majors unaffected).
- **Pool starvation inversion:** equilibrium pressure set too high makes roaming
  trivially brief and the Wanderers tab vestigial — the band has a floor too.

## 15. DEFERRED (recorded, not bugs to re-find)

- Roamer-initiated plots (a wanderer scheming return against their banisher) — a
  W-DISCOVERY-class story engine; after H4 ships and soaks.
- Player-visible reputation inspection UI beyond the register (dossier drill-in).
- Cross-realm (multi-region) roaming — bounded to the realm until the region graph
  earns it.

## 16. IMPLEMENTATION CONVENTIONS (appended by W-H3; the frozen sections above are
## unchanged — this records seams other programs must be able to read)

- **THE HIDDEN-PATH SEAM (the J-program coordination, §6 travel physics).** Design §6
  gives wanderers hidden paths and denies them to armies. The hidden-path network belongs
  to the J program, so the coupling is an OPTIONAL CALLBACK and never an import:
  `npcCirculationTransit.js` accepts `hiddenHopsOf(fromId) -> readonly string[]`, the ids
  reachable from here by a hidden way. ABSENT (every caller today) the module is
  byte-identical to the road-only reading. A hidden hop is taken only when it lands
  STRICTLY closer to the destination, and it costs `HIDDEN_PATH_SLOWDOWN` times the
  nominal hop ("slowly"). THE ARMY ASYMMETRY IS ENFORCED BY WHO SUPPLIES THE HOOK: the
  army lane never passes it, so armies never get the paths. Neither program edits the
  other's files.
- **ONE TUNING TABLE, RELOCATED.** `NPC_CONSEQUENCES_TUNING` (§11) lives in
  `src/domain/worldPulse/npcConsequencesTuning.js` and is RE-EXPORTED from
  `npcVerdictTable.js`, which had 65 of its 800 permitted lines left. One table, one home,
  every importer unchanged.
- **THE COOLDOWN IS AN EXCLUSION KIND, NOT A FOURTH MAP.** §3b freezes the ledger at three
  maps, so §6's rejection cooldown lands as a second `EXCLUSION_KINDS` rung
  (`rehost_cooldown`) rather than a shape change. The candidate flow reads every kind; the
  reader projection reads `EDICT_EXCLUSION_KINDS` only, because a cooldown is bookkeeping
  and a banishment is a legal fact.
- **RESIDENCY AND TRANSIT RIDE THE ROAMER'S OWN RECORD.** Both are conditional,
  drop-when-empty fields on the ledger record (the armyTransit pattern applied to a
  person) rather than new top-level ledger keys, so a walker cannot exist without a soul
  and law 6 stays structural. A record carrying neither serializes exactly as a pre-H3 one.
- **THE POPULATION FLOOR IS PURE, AND ITS WIRING IS DEFERRED.** `npcReplacement.js`
  exports the §9 arithmetic (`residentNamedNpcCount`, `effectivePopulationForFloor`,
  `reconcilePopulationFloor`, `drainAnonymousFirst`, `reducedToCast`). The settlement
  lifecycle kernel is READ-ONLY to W-H3, so the call that hands its empty fast path the
  effective population belongs to the slice that owns that kernel. Deliberately deferred,
  documented, not a bug to re-find.
- **NOTHING IN W-H3 IS CALLED FROM THE PULSE.** Every leaf is a pure function behind
  `npcConsequencesEnabled`. The slice that wires a trigger must add its candidate types
  (`npc_rejection`, `npc_arrival`, `npc_dispersal`) to the certification row's aliveness
  in the SAME edit.
