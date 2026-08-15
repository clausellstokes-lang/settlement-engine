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

## D6 — THE UNDERWAYS (the underground network institution — owner commission 2026-07-16:
## "literal excavated caverns for smuggling, escape tunnels, and other clandestine use...
## give it the full coherence work similar to all the other institutions")

**What it is:** a first-class catalog institution — excavated tunnels and caverns beneath a
settlement — with the FULL institution parity checklist AND engine couplings into the covert
mechanics that already exist. Working name **"Underways"** (implementer verifies against the
catalog's naming register and may substitute — e.g. "Smugglers' warren" — recording the
JUDGMENT; id `underground_network` either way, kernel-slugified, collision-checked).

**Catalog + generation half (⚠️ GOLDEN-SHIFTING — a catalog addition shifts same-seed worlds;
this half rides the Track-G2 regen moment, never lands alone):**
- Tiers village+ (excavation needs labor); probability loaded by (§H): criminal presence
  (thieves' guild, dens), ports/border position, MINING presence (excavation competence — the
  W-DISCOVERY mining-camp coupling, both directions), siege history; SUPPRESSED to impossible
  on floodplain/marsh terrain (tunnels flood — the geography-inconsistent-is-impossible
  precedent from the discovery wave, pinned).
- Full parity checklist (what "the same as every other institution" means, derived from the
  data-layer census): catalog entry with tags + category (the dual-axis vocabulary decides) +
  declared facets `clandestine` + `subterranean`; institutionServices menu (discreet passage,
  untaxed storage, no-questions transport — joins the crime menus); NPC layer (tunnel-warden
  role via the office-equivalence resolver, goals/secrets, vignettes); geography modifier rows
  (mountain/hills excavation affinity — single-match, per the terrain double-stack lesson);
  stress-type integrations (insurgency + slave_revolt use the tunnels — content + the
  registration walker); history/timeline founding mentions ("dug during the siege of...").
  Every catalog pin extended: id collision, category vocabulary, tag ratchet, services keys,
  the stressInstitutionEffects walker.

**Engine couplings half (dark-kernel/bounded — rides W-R2-DEPTH; every coupling reads the
FACET via the facetOf chokepoint, never the name string — custom clandestine institutions
COUNT, per the facet law):**
1. **M7 smuggling substrate:** a bounded multiplier on the existing smuggle machinery
   (smuggleSuccessChance up, smuggleDetected down) at facet settlements — the tunnels are
   WHERE smuggling happens; receipts name the institution.
2. **Siege + blockade endurance (land–sea parity by construction):** the starvation/
   capitulation reads gain a bounded supply-trickle floor at facet settlements — a tunneled
   town starves slower under siege OR naval blockade (the underways don't care which side the
   wall is on). Bounded modifier only; no new counterplay machinery (simplicity-over-fidelity).
3. **Covert-operations affinity:** corruption-web exposure rolls discounted (bounded) at facet
   settlements; covert bloc (conspiracy) formation eased (§G-clamped) — clandestine
   infrastructure shelters clandestine politics. The resolveLeash chokepoint untouched.
4. **The escape lane (state-never-fate):** ousted powers' existing dispersal stamps at facet
   settlements gain "escaped through the underways" receipts — story, never fate resolution.
5. **Organic founding:** detectInstitutionGaps gains the underways gap — sustained smuggling
   activity + criminal density founds one organically (the mine-founds-itself pattern);
   forced founding already exists via the custom/forced institution lane (counterpart ✓).

**The visibility line (coherence with the premium/covert seam, decided):** the institution's
EXISTENCE is public dossier truth ("everyone knows the warren exists; no one maps it"); its
OPERATIONS are covert through the existing covert seams. A hidden-institution visibility class
was considered and REJECTED — the ontology has no hidden-entity class and minting one for a
single institution is scope the fiction doesn't need. (Recorded conscious rejection.)

**D6 coherence matrix (condensed):** ×M7 smuggling (substrate — the coupling closes the "where
does smuggling physically live" gap); ×navy (blockade-running by sea reads the same facet);
×W-DISCOVERY (mining ↔ tunneling competence, bidirectional probability); ×lifecycle (a dead
town's underways enrich its ruin flavor — relic ruins with intact tunnels are DM gold, free);
×corruption/politics (exposure resistance + conspiracy ease, both bounded); ×stress content
(insurgency/revolt); ×calamity (bucket-neutral — no tunnel-collapse type; flavor stays DM
freetext); ×premium seam (existence public / operations covert, above); ×PDF/display (standard
institution rendering; services + profile — zero new display machinery).

## D7 — THE REFRAME LAYER (the ledger of gifts and debts; motive attribution as belief)
### Owner commission 2026-07-16 (verbatim intent: the inverse of emotions/intentions as
### relationships change — "shouldn't that generosity... turn more into a sort of debtor
### mentality after a betrayal... do not simply stop at generosity vs greed"). BUILDS IN THE
### TUNING WINDOW (post-soak-verdicts, pre-regen) so its shifts batch into THE ONE REGEN.

**THE LAW: FACTS FROZEN, MEANING DERIVED.** Receipts and transfer ledgers are immutable
(constitutional). What changes when relationships change is the INTERPRETATION — a per-observer
derived read: `interpretationOf(act, observer, now)`. History is never rewritten; it is
re-READ. And because interpretation is belief-side, IT CAN BE WRONG — this layer extends the
epistemics engine from misjudged facts to misjudged MOTIVES (the mint-time generosityEV
receipts already record TRUE intent weights — the ground truth for the irony read exists).

**THE ACT CLASSES + their existing fact sources (nothing new is recorded):**
| Act class | Frozen source | Reframe vocabulary (bounded) |
|---|---|---|
| Aid/relief/credit transfers | obligations ledger + generosity receipts (intent weights AT MINT) | gift → investment → debt_unpaid → tribute_extracted |
| Military aid / garrisons / interventions | deployments history, interventions ledger, relationshipMemory | protection → occupation_that_never_left (racket) |
| Intelligence shares | info-statecraft marks | candor → espionage_all_along |
| Mediation / peace brokering | treaty provenance records | goodwill → manipulation |
| Religious patronage | imposition/patronage records | piety → infiltration |
| Kinship/§G ties | tie records | bond → leverage |
| Trade-dependence formation | M6 dependence metrics + route history | commerce → dependency_by_design |
| Tribute/terms payments | treaty terms + compliance records | honored_terms → extortion_endured |

**THE REFRAME FUNCTION (inputs, all existing state):** current relationship status + warmth,
grievance stock (D5-scaled — you can only reframe what you REMEMBER; elves reframe
centuries-old gifts, humans forget them: the memory law composes), observer alignment axes,
deity conduct profile (the contract-god invoices, the mercy-god mourns — alignment-not-domain
extended to interpretation), actor/bloc temperament (§G-clamped), live momentum courses (a
committed hostile course darkens readings — coherent sunk-cost psychology), hegemony fear
(D4 — tribute/gift tilt), and credibility (a proven liar's past acts reframe darker). This IS
the owner's "generosity vs greed competition" — implemented as INTERPRETATION WEIGHTS on §H
loaded dice, never as new resource flows. The simple ally/enemy mode-switch is REJECTED: it
severs the referencable chain (the product law).

**TRANSITIONS ARE EVENTS (the mover half):** a small kernel pass (fold into relationship
rules or a lazy reframeKernel) behind virtual flag `reframeEnabled` — absent ⇒ no transitions
⇒ prior bytes. A reframe TRANSITION ("Thornwall now speaks of the grain years as a debt
unpaid") is: E0-classed (rare, story-grade — capped concurrent reframed-pairs per the
scarcity-as-law precedent), hysteresis-guarded (warmth deadband; no flapping), STICKY
(reversal only through reconciliation events — the same forgiveness lane D5's undying band
uses; BOTH SIGNS exist: debt can be forgiven back into gift, per the unification law),
loud (deposits momentum; the rumor machinery carries it), and receipted with the chain
("after the border seizure, the old aid reads differently in Thornwall's court").

**CONSUMERS (all existing machinery, additive):**
1. WAR REASONS: new typed kinds `ingratitude_debt` + `dependency_by_design` joining the
   scorers — reasons load choices; they NEVER auto-declare (standing law).
2. PEACE TERMS: a restitution/repayment term kind at the peace table — the reframed claim
   priced and settleable through the existing terms catalog (real goods move ONLY here,
   through existing machinery — conservation untouched).
3. CORRUPTION WEB: a darkly-reframed obligation is leash-eligible material (one bounded input
   to the existing resolver).
4. COUNTERPART (criterion): DECLARE_CASUS gains the reframe casus types as dial options — the
   DM decrees the reinterpretation; force ≡ organic at the casus mint (no new verb needed).
5. DISPLAY — THE LEDGER OF GIFTS AND DEBTS read-model: per-pair, each remembered act with
   BOTH readings — the frozen fact, the observer's current reading, and (DM-truth lane) the
   TRUE mint intent. The dramatic-irony surface gains motive-divergence beside
   fact-divergence: the DM sees the war brewing over a kindness misremembered.
6. Whisper + glossary entries per the criterion's final clause.

**PINS:** dormancy golden (flag absent ⇒ byte-identical) · frozen-facts pin (no interpretation
path writes any transfer/receipt ledger) · both-signs pin (a reconciliation event reverses
debt_unpaid → gift_forgiven) · false-reframe irony pin (true intent ≠ believed intent renders
in the DM irony read; the player-safe view shows only the observer's own reading — premium
seam) · hysteresis pin (oscillating warmth mints ZERO transitions inside the deadband) ·
scarcity pin (concurrent reframed-pairs ≤ cap) · counterpart pin (decreed ≡ organic) ·
determinism (stable fork keys on transition draws).

**THE BRIGHT MISREADING LANE (owner confirmation 2026-07-16 — the unification law applied to
misattribution; misunderstandings run BOTH directions):** false-POSITIVE attribution is
first-class: an enemy's self-interested or accidental act read as deliberate kindness.
Vocabulary additions: `unintended_kindness` (their navy sank the pirates for their own trade;
the beleaguered port credits protection), `misattributed_aid` (relief arrives via a paid
smuggler; the starving town credits its old rival — the irony ledger shows the truth),
`noble_enemy_myth` (an honored parley or spared column mythologizes into character),
`common_threat_misread` (a phantom column attributed to a third party unites two rivals — a
false flag with no flagger). Consumers, all existing: warmth deposits + relationship memory
(D5-scaled — bright memories fade or endure by the same lifespan law), the E1
gratitude/overture instruments (a bright misreading can seed a real overture), the peace-reason
taxonomy (détente from misread magnanimity), and coalition formation (the misread common
threat). RARITY: the same E0-classing, caps, and hysteresis — plus a NEGATIVITY-BIAS default
(dark reframes more probable than bright, per human realism; owner-retunable), tilted by
temperament (trusting/pious courts misread generously; paranoid courts are nearly immune to
good news — coherent with the momentum conscience machinery). PINS: an enemies-to-allies-via-
misreading fixture (rare-path, seeded); the irony read shows the TRUE cause beside the believed
one; both-signs symmetry (the bright lane uses the same transition machinery, never a parallel
system).

**REJECTED (recorded):** a per-NPC emotion system (blocs/settlements/factions reframe; NPCs
modulate via §G and never have engine-resolved feelings — state-never-fate extended to
sentiment); continuous emotion scalars (bounded vocabulary only); mutable intent on receipts
(unconstitutional).

**D7 COHERENCE MATRIX:** ×D5 memory (reframe horizon = memory horizon; forgetting forecloses
re-litigation — *emergent*: making peace with elves before the grudge hardens matters) ·
×D4 hegemony (fear tilts tribute/gift readings; a sphere's collapse triggers mass re-reads —
*emergent*: the empire falls and every "gift" it gave becomes an extraction overnight) ·
×credibility/Blainey (liars' acts darken; false reframes ARE misjudgments — war from motive-
attribution error, the layer's crown emergent) · ×momentum (courses bias readings; transitions
deposit; pressing a debt claim is a course with a cliff) · ×corruption (leash material) ·
×peace terms (restitution) · ×religion (conduct-profile tilts; patronage→infiltration after
schism) · ×E1 (mint-intent receipts = ground truth) · ×lifecycle (a dead benefactor's gifts
reframe in its successor's court) · ×tempo (E0-classed transitions) · ×premium seam (readings
are per-audience) · ×D6 (aid smuggled through the underways reframes darkest — "they bought
us in the dark").

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
