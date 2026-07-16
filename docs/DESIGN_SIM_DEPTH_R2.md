# DESIGN — SIM DEPTH R2 (the round-2 depth commission)
## Owner commission 2026-07-16 (verbatim: "for the three abstractions, implement them" + "regarding the hunt: I like number one" + the long-lived-races consideration on number two)
### Fable 5, architect. THE CORPUS REOPENS for exactly these five designs (its fourth reopening) and closes again behind them. Builds as **W-R2-DEPTH** — post-merge, strictly after W-R2-SEAMS and W-R2-LIGHT (these designs touch kernels being fixed and flags being lit).

Constitution binding on all five: same-seed byte-identity · dormancy (absent ⇒ prior bytes,
virtual flags, no write-on-load) · loaded-dice law (§H — seeded forks on stable keys sampling
situation-weighted distributions, weights receipted) · state-never-fate · zero/near-zero eager
bytes (lazy leaves; any eager literal counted against the ratchet) · every mechanism legible
(receipts + read-model) · the facet law for anything reading world character.

---

## D1 — DISTANCE-PRICED NEWS (information pays for distance the way grain does)

**Gap:** goods movement is hop-priced through the frozen digest; belief updates use uniform lag.
A war six hops away is known as fast as one next door — and misjudgment is the war-starter, so
information speed is load-bearing.

**Shape:** a REFINEMENT of the existing infoMode seam, not a new system. For a fact about origin
O observed by S, effective information age = actual age + `hopDelayTicks(dist(O,S))`, where
`hopDelayTicks = floor(distanceWeeks(O,S) × NEWS_SPEED_FACTOR)` reads the frozen digest's
distance matrix (already deterministic, already week-denominated). Applied at exactly two
consumers: the beliefMap recency/lag fold and rumor recency capture. DM-truth surfaces and realm
verbs are NEVER delayed (the DM is not a world actor; player-view rumor staleness already
exists).

**Gating:** virtual flag `distancePricedNewsEnabled` (absent ⇒ prior bytes — byte-identity by
construction). Lit by W-R2-LIGHT in the same three presets, composing with infoMode:
`omniscient` ignores it; `perfect_delayed` becomes base-delay + hop-delay; `unreliable` composes
with its existing quality loss. NEWS_SPEED_FACTOR is a named, frozen, owner-retunable constant
(soak-tunable; start ≈ 0.5 — news travels twice as fast as caravans).

**Legibility:** the existing fog/staleness notes gain the distance clause ("word from the far
coast runs weeks behind"). Receipts on misjudgment news may name stale distance as a cause.

**Pins:** (1) dormancy golden (flag absent ⇒ byte-identical); (2) adjacent settlement =
zero added delay; (3) monotonicity (further ⇒ never fresher); (4) DM-truth surfaces unaffected;
(5) determinism (same seed, same delays).

**Implementer recon-pins:** locate perfect_delayed's existing delay implementation before
threading (expected in beliefMap's reconcile); verify rumor capture stamps origin ids.

---

## D2 — THE SCALING LAW (attention, trade, and military interaction density survive realm growth)
### (Owner extension 2026-07-16: "make sure realm size scaling is also included in trade and military movement")

**The unified principle:** the world scales by LOCALITY. Per-settlement interaction density is
realm-size-invariant; realm-global budgets scale SUBLINEARLY (√N — big realms sample highlights,
never N-linear cacophony); selection is always distance-localized through the frozen digest; and
scaling caps DEFER physical quantities, never delete them (conservation survives every cap).

**D2a — Attention (tempo):** as originally designed — effective classMax = classMax +
floor(sqrt(max(0, N − TEMPO_BASE_REALM)) × TEMPO_SCALE_PER_ROOT); per-settlement `lastBeatTick`
starvation weighting (§H loaded dice, a weight never a wall).

**D2b — Trade (recon-verified state + the two gaps):** trade is ALREADY mostly scale-correct by
construction — route choice is distance/danger-scored (chooseRoute), commodity physics caps are
per-origin and rate-scaled (ORIGIN_CAP_WEEKS × local rate, MAX_SHIP, TAP_CAP — all local, all
scale-free), and matching walks are codepoint-sorted. The gaps: (1) supplyShipments'
`ranked.slice(0, kk)` top-k partner selection — the implementer VERIFIES k's semantics: if k is
per-destination (local), it is scale-free and stands; if k is realm-global, it gains the √N
form. (2) Any realm-global trade-event budget (boom minting rides tempo — covered by D2a).
Emergent property preserved: entrepôts still emerge from geography, not from caps.

**D2c — Military movement + decision throughput:** movement itself is already distance-priced
(transit ticks ride the digest) and engagement is front-local (feasibility gates) — armies do
not need scaling. What DOES: the DECISION pipeline's fixed realm-global caps. `rollCandidates`
runs at `maxAuto: 7, maxProposals: 5` per tick regardless of N (pulseKernel.js:1254) — at 50
settlements the realm's entire agency shares 12 slots; and the proposals ring (MAX_PROPOSALS=80,
worldState.js) silently evicts under forcing modes (the confirmed tick-core-2 finding — this
design ABSORBS that fix). Shape: maxAuto/maxProposals gain the same √N sublinear form
(named constants, current values exact at N ≤ BASE); the proposal ring scales with N AND prunes
resolved-first with visible expire-to-decline stamps for pending overflow (the finding's fix,
now a law: **eviction is always receipted**). Retention caps that feed the DM's memory of the
world (wizardNews 240, terminal impacts 250) gain sublinear scaling + per-settlement rescue
(wizardNews's bounded major-arc rescue generalizes) so a quiet member's history survives a loud
realm.

**Gating:** every scaled constant reduces to today's exact value at N ≤ BASE (byte-identity for
every existing campaign and golden); scaling activates only above the base — no flag needed,
dormancy by arithmetic. Constants named, frozen, owner-retunable; the SOAK's settlement-cap
study gains drama-per-settlement AND proposals-per-settlement distribution panels.

**Pins:** (1) N ≤ BASE ⇒ current constants exactly (the load-bearing golden); (2) monotone
sublinearity (N=100 budget < 2× N=25 budget); (3) eviction-is-receipted (no proposal vanishes
without a stamp); (4) conservation under caps (a deferred shipment/beat is deferred, never
destroyed); (5) determinism under permuted member order.

---

## D3 — DOCTRINE COURSES (momentum binds religion; the last free reconsideration ends)

**Gap:** the momentum course taxonomy (war / peace / campaign / contest / blockade —
momentum.js:131) has no doctrinal kind: a crown's religious policy is the one belief-consuming
course actors may abandon for free, against the owner's "all entities that use beliefs" ruling.

**Shape:** `courseKeyOf` gains kind `doctrine:<deityRef|policy>` (bounded: the policy vocabulary
is the existing imposition/tolerance/contest-escalation act set — no freetext). Deposits: the
PUBLIC religious acts the machinery already sees — cult imposition applies, temple foundings,
contest escalations, tolerance edicts — through the same loudness-measured, lawfulness-scaled
deposit fold. Threshold: the seat's existing entityThreshold verbatim (temperament + conscience
doors + legitimacy fragility — zero new math). Consumption: the religious-contest and imposition
decision seams read the same commitment discount the strategy chooser reads. The crack: a
doctrinal reversal (abandoning an imposed cult, reversing tolerance) is priced once —
legitimacy + credibility — with the synod as the face-saving off-ramp (the mediation analogue,
reusing the existing off-ramp price reduction).

**Counterpart:** FORCE_RECONSIDERATION is already course-generic — once W-R2 fixes its course
dial ('__live__' placeholder), doctrine courses are forceable with zero new verbs. The criterion
holds by generalization.

**Gating:** rides `momentumEnabled ∧ beliefsActive ∧ faithSpreadEnabled` (the intersection —
each already virtual). Same commitments ledger, drop-when-empty; zero new draws; zero eager.

**Pins:** (1) dormancy golden extension; (2) an imposition deposits a doctrine course; a
committed crown discounts unrest counter-evidence; (3) the reversal is priced exactly once;
(4) succession re-rolls the doctrine cliff (the new-ruler conversion falls out free — assert it).

---

## D4 — THE HEGEMONY READ + FEAR OF DOMINANCE (the world learns to see, and resist, an empire)

**Gap (the owner's "number one"):** conquerors are braked internally (exhaustion, extraction
ceilings) but nothing organizes the world against a dominant power — fear-of-the-hegemon,
Blainey's own first-class cause, is absent from the reason taxonomy; and hegemony is illegible
(the unnamed-empire read designed in DESIGN_COHESION_WEAVE §F.3b, never built). Two halves of
one mechanism — the read supplies the input the reason needs.

**Shape, half (a) — hegemonyRead (per the frozen §F.3b design, unchanged):** a pure lazy
read-model over existing treaties + relationship edges: a center C with ≥ HEGEMONY_MIN_TIES
subordinate ties (vassal / tribute / compelled_ally) forms a sphere; the read returns centers,
members, aggregate-strength share, and strain summary. ZERO persisted state (per §F.3b's own
pins). Legibility: a RealmDashboard cluster line + the brief's count ("seven towns pay tribute
to Thornwall"); the DM baptizes via the existing canon-label lane (the christening moment).
Rides W-R2-SURFACE's display lane; the reason half consumes the same selector.

**Shape, half (b) — `fear_of_dominance` joins the typed reason taxonomy:** for observer O and
sphere center C: inputs = C's BELIEVED aggregate-strength share (belief-side where infoMode
lights fog — an empire's true size can be misjudged, both directions), distance discount
(digest hops — far empires frighten less), O's independence (subordinates of C are excluded —
v1 balances, never bandwagons; bandwagoning is a recorded soak-era refinement). Consumers, all
existing machinery: (i) defensive/mutual-defense treaty term weighting between free settlements
near C; (ii) sovereignty/non_intervention term weights; (iii) the standard war/peace reason
ledgers — the reasons machinery decides escalation, per the standing law that reasons never
auto-declare. Receipted like every reason ("banners gather against Thornwall's shadow").

**Gating:** the reason type is additive under `peaceEngineEnabled` (typed reasons are already
gated there); the read is display-lane lazy. 0-when-dark ⇒ byte-identical.

**Pins:** (1) no sphere ⇒ reason scores 0 everywhere (negative control); (2) a 3-vassal center
minted from fixtures produces fear_of_dominance at free neighbors, NOT at vassals; (3) distance
monotonicity; (4) belief-side divergence (a fogged observer fears the empire it believes in);
(5) the read is pure (same input ⇒ identical output; zero writes).

---

## D5 — LIFESPAN-SCALED MEMORY (the cohort clock, made fantasy-true — the owner's consideration, decided)

**The owner's point, honored as the design:** fixed human-generational forgetting is WRONG in a
world with elves and immortals. So the memory horizon derives from the settlement's demographic
character via THE FACET LAW — never from a hardcoded human clock.

**Shape:** a `memoryHorizon` facet on settlements: **declared** (custom content states it) ??
**inferred** (from race-bearing generation data where present) ?? **kind-default**
(`generational` — the human band). Four bands, each a bounded multiplier on the EXISTING
grievance/relationshipMemory decay constants: `fleeting` (0.5× horizons), `generational` (1.0 —
**byte-identical to today by construction**), `long` (3× — the elven haven), `undying` (no
generational decay; only event-driven forgetting — reconciliation events, the climb-down lane —
erodes the ledger). NPCs are untouched: state-never-fate stands; nobody ages out; this is
COLLECTIVE memory only. Emergent texture for free: a human town allied to an elven haven
experiences asymmetric grudge decay — the elves remember the broken treaty long after the men
who broke it are dust, receipted ("Thornwall's elves do not forget").

**Gating:** default band ⇒ multiplier 1.0 ⇒ byte-identical (dormancy by construction, no flag
needed — but the facet read rides the existing facetOf chokepoint, and absent facets infer to
the default). Custom content declares and COUNTS (facet law compliance).

**Pins:** (1) default-band world byte-identical (the load-bearing golden); (2) declared facet
overrides inference; (3) undying band still erodes via reconciliation events (no absorbing
grudge — the anti-stasis constitution applies to memory too, weights never walls); (4) the
multiplier is clamped to the band table (no freetext scaling).

**JUDGMENT (vetoable):** built WITH the wave rather than parked — the owner's "not against it,
but consider" resolved by making lifespan the mechanism instead of the objection. Say "veto" to
park D5 and ship the other four.

---

## THE COHERENCE MATRIX (owner directive 2026-07-16: "it has to be coherent with all aspects of
## the ontology... The number one thing I'm trying to sell is a coherent world.")

Every design above, traced against every ontology system it touches. Entries marked **COUPLING**
are new wires this matrix DISCOVERED and adds to the build scope; entries marked *emergent* are
referencable cumulative causalities the composition produces for free — the product the owner is
selling. This matrix is the design-time version of the seam audit round 2 ran retrospectively.

**D1 distance-priced news ×**
- *Blainey/misjudgment*: distant powers act on staler beliefs ⇒ far wars start from deeper
  misjudgment — *emergent, historically true, referencable* ("they declared war on a fleet that
  had already sailed home").
- *Momentum*: counter-evidence from distant theaters arrives late ⇒ far commitments crack
  slower — *emergent* (the distant war is easier to stay committed to).
- *D4 fear_of_dominance*: observers fear the empire they BELIEVE exists; distance-stale beliefs
  mean the frontier fears yesterday's empire — *emergent, both directions*.
- *Credibility/unreliable mode*: AGE and QUALITY are separate axes — distance delays arrival,
  credibility discounts sources, unreliable degrades fidelity. The implementer must NOT
  double-count (one delay application, at the recency fold only).
- *Generosity* — **COUPLING (discovered)**: relief decisions currently read ground-truth need;
  once D1 lights, the giver must learn of the famine through beliefs — considerOrientation's
  need read gains the belief-side variant where beliefsActive. Otherwise aid arrives faster
  than news, an incoherence. The story it buys: "word of the famine reached the ally three
  weeks late" — aid lag becomes referencable causality.
- *Physical ledgers*: shipments, armies, convoys are TRUTH and are never delayed — only
  information ABOUT them. The DM's feed stays omniscient; player-view rumors gain distance
  texture. (The line: D1 delays actor epistemics, never physics, never the DM.)

**D2 scaling law ×**
- *Conservation*: caps defer, never delete (stated as law above) — Σ invariants survive scale.
- *E0 drama classes*: boom/war minting already tempo-classed ⇒ D2a covers their frequency
  coherently; no second governor.
- *Proposals/DM authority*: eviction-is-receipted closes tick-core-2 INSIDE this design — the
  forcing modes' authority contract survives realm growth.
- *Emergent preserved*: entrepôts, hegemonies, and trade arteries remain GEOGRAPHIC phenomena —
  scaling never injects randomness, only widens budgets sublinearly.

**D3 doctrine courses ×**
- *Settlement politics* — the glue typology already has a 'doctrine' glue kind: a crown pressing
  doctrine past its cliff is exactly what doctrine-glued blocs form around/against —
  **COUPLING (light)**: the bloc-formation interest read gains the crown's doctrine-course
  commitment as one bounded input (±, §G-clamped). *Emergent*: the zealot king's court splits.
- *Conversion crisis machinery*: a forced doctrinal reversal can mint the existing conversion
  crisis — reuse, no new event kind.
- *Premium seam*: doctrine courses reference ACTIVATED deities only; latent pantheon never
  named in any course key or receipt (law 3 holds by construction — course keys use deityRef
  of activated cults only).
- *Custom content*: custom deities carry course keys exactly like catalog ones (facet law ✓).
- *Succession*: re-rolls the doctrine cliff — the new-ruler conversion falls out free
  (*emergent*, pinned).

**D4 hegemony + fear_of_dominance ×**
- *Extraction/upswing*: empire extracts ⇒ upswings ⇒ believed strength rises ⇒ fear rises ⇒
  balancing coalitions form ⇒ expansion prices in resistance — **the missing brake loop closes**;
  every link receipted, the whole chain referencable.
- *Corruption*: a corrupt empire's extraction leaks (existing) while its FACADE of strength
  still frightens neighbors — *emergent*: hollow empires are over-feared until exposure.
- *Navy* — **COUPLING (discovered)**: the aggregate-strength share MUST include navalStrength
  (a maritime hegemon frightens ports it can blockade) — the read sums land + naval capability.
- *Lifecycle satellites*: steadings are PROPERTY, not vassals — excluded from subordinate-tie
  counting (no double-counting a parent's own orbit).
- *Convergence/intervention*: fear_of_dominance joins the counter-intervention (DENIAL) motive
  weighting as one bounded input — *the coalition that intervenes against the conqueror*.
- *Treaties/defection*: sphere strain reads existing term-burden machinery; a cracking sphere
  is visible through the same treaty document the DM already reads.
- *Peace reasons*: feeds spheres_understanding (existing type) — fear can END wars too
  (détente between rival spheres), honoring the unification law: the same input, both signs.

**D5 lifespan-scaled memory ×**
- *The contracts/memories distinction* — treaties, obligations, and maturity schedules are
  SEAT-HELD CONTRACTS and never scale with lifespan; grievances and relationship warmth are
  PEOPLE-HELD MEMORIES and do. This is the SAME distinction the politics glue typology already
  draws (seat-held concession vs people-held loyalty) — the ontology rhymes with itself.
- *Both signs scale* (unification law): elves remember kindness as long as grievance —
  relationship warmth decay scales by the same band. Never grievance-only.
- *Momentum*: memory ≠ stubbornness — reconsideration cliffs stay temperament-derived,
  NOT lifespan-scaled in v1 (an undying court can still be pragmatic). Recorded refinement
  door: lifespan-informed thresholds, soak-era, owner-nod.
- *Anti-stasis*: even `undying` erodes via reconciliation events (weights never walls — no
  absorbing grudge). The climb-down/mediation lane is the immortal court's only forgetting —
  *emergent*: peace with elves must be EARNED, never waited out. Referencable.
- *Generation law*: the facet is minted at generation/canonize from config-side data; the tick
  reads the facet — generation never reads tick state (law intact).
- *D1 composition*: a long-memory settlement with distance-stale news holds OLD grievances
  refreshed by LATE news — coherent (memory holds what arrived; arrival is D1's business).

**STANDING PRACTICE (adopted for this program; recommended for the constitution):** every
future design freezes WITH its coherence matrix — the design-time census of every ontology
system it touches, couplings named, emergents predicted. Round 2's entire seam-defect class is
what this practice prevents. (Constitutionalizing it as §0.2-7 is the owner's call — this doc
adopts it as precedent.)

## SEQUENCING + BUDGET
W-R2-DEPTH lands post-merge, after W-R2-SEAMS (D3/D4 touch momentum/upswing kernels being
fixed) and after W-R2-LIGHT (D1 composes with newly-lit infoMode presets). All five are lazy
worldPulse/display work: expected eager cost ≈ one conditional-ledger key literal + one facet
key (≪ 100 B against the 85 B margin — the implementer measures FIRST and stops if over,
per the ratchet law; the wave may need its own micro-reclaim). Every design consumes existing
machinery (digest distances, tempo ledger, commitments ledger, reason taxonomy, facetOf) —
NO new engine systems. Model split: Opus implements per this doc; Fable checks per §0.3.
