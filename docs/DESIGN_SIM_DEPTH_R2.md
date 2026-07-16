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

## D2 — TEMPO SCALING (attention economics survive realm growth)

**Gap:** the E0 governor's TEMPO_BUDGETS are per-tier triples but realm-global — a 50-settlement
realm gives each settlement drama rarely; the world feels quieter per settlement as it grows.

**Shape:** two coupled refinements to the existing governor (narrativeTempo.js):
1. **Sublinear budget scaling:** effective classMax = classMax + floor(sqrt(max(0, N −
   TEMPO_BASE_REALM)) × TEMPO_SCALE_PER_ROOT) where N = live member count. Named frozen
   constants (start: BASE 8, SCALE 1). Sublinear by design — big realms sample highlights,
   never N-linear cacophony.
2. **Starvation weighting (§H loaded dice, not a wall):** per-settlement `lastBeatTick` (extend
   the existing tempo ledger; drop-when-empty) feeds candidate selection as a quiet-time weight —
   the longest-quiet settlements' dice load toward selection. A weight, never a guarantee; no
   new draws (it shapes existing distributions).

**Gating:** the governor is already tier-gated and dormant-∞; both refinements live inside its
active branch — dormant worlds byte-identical. Constants owner-retunable; the SOAK's
settlement-cap study gains a drama-per-settlement distribution panel (measure, then tune).

**Pins:** (1) dormant ⇒ byte-identical; (2) N ≤ BASE ⇒ current budgets exactly;
(3) quiet-time weight monotone; (4) determinism under permuted member order (codepoint sort).

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

## SEQUENCING + BUDGET
W-R2-DEPTH lands post-merge, after W-R2-SEAMS (D3/D4 touch momentum/upswing kernels being
fixed) and after W-R2-LIGHT (D1 composes with newly-lit infoMode presets). All five are lazy
worldPulse/display work: expected eager cost ≈ one conditional-ledger key literal + one facet
key (≪ 100 B against the 85 B margin — the implementer measures FIRST and stops if over,
per the ratchet law; the wave may need its own micro-reclaim). Every design consumes existing
machinery (digest distances, tempo ledger, commitments ledger, reason taxonomy, facetOf) —
NO new engine systems. Model split: Opus implements per this doc; Fable checks per §0.3.
