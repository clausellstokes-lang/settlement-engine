# DESIGN — THE CONTENT PLANE (Surveyor S4+: AI-authored custom content at full depth)
## Owner commission 2026-07-16 (verbatim intent: "not limiting the unlimited degrees of freedom
## and generative potential of AI, but bounding what concludes into our system (per user) for
## maximum coherency... AI should have access to all the knobs — not to edit the system, but to
## create all manners of custom content that edit the system FOR THAT USER upon their approval...
## at the extreme end, a fully coherent sci-fi setting. Bounded purely to their own account.")
### Fable 5 architecture draft — enters the Surveyor lane; BUILDS after S4 earns its metrics
### (the staged-trust ladder holds). Design-frozen on the owner's nod; coherence matrix included.

---

## 0. THE LAW: TWO FREEDOMS, ONE BOUNDARY

The AI's imagination is UNBOUNDED — it may propose any content, any vocabulary, any world.
What CONCLUDES into the system is TYPED — only content that compiles into a registered,
validated, bounded content type lands, and only in the requesting user's account. The boundary
object is the schema. This is the operation-registry philosophy (no op type = no effect)
extended from ACTIONS to CONTENT: **no content type = no landing.** The master system — the
catalogs, the kernels, the laws, the goldens — is architecturally unreachable from this plane.

## 1. THE THREE RUNGS OF THE CONTENT PLANE (what "all the knobs" means, typed)

**Rung 1 — ENTITIES (exists today, S4 automates it):** custom institutions, deities, goods,
NPCs, stressor definitions through customContentSchema — first-class by the facet law. The AI
compiler targets the schema; walkers validate; the facet chokepoint gives them full mechanical
citizenship.

**Rung 2 — TUNABLES (new: THE KNOB REGISTRY):** the engine is saturated with named, frozen,
owner-retunable constants (news speed, transit cost/week, tempo budgets, memory horizons,
stressor spawn weights, trait→threshold weights...). The knob registry PROMOTES a curated
subset to per-account overrides: each entry = {name, type, BOUNDED range, default,
coherence-couplings note}. Absent override ⇒ master default ⇒ byte-identical (dormancy).
CRITICAL SUBSTRATE ALREADY BUILT: the §10 auto-tuning rails shipped INERT with exactly the
needed machinery — the AUTO_TUNABLE whitelist, the structural validator making sim/generation
surfaces unrepresentable unless whitelisted, the golden-law lane classifier. The knob registry
is that machinery's first real tenant: user-tunables ride the same whitelist + validator + lane
discipline. NPC architecture (trait vocabularies, temperament tables), travel speed,
relationship-type weights — all rung-2 entries with declared bounds.

**Rung 3 — SETTING PACKS (the extreme end: the genre door):** a pack = a coherent BUNDLE of
rungs 1+2 plus vocabulary tables — naming corpora, institution catalog skin, resource/goods/
chain vocabulary, terrain/biome skin, faith-or-ideology reskin, stressor flavor, units/currency.
THE LOAD-BEARING FACT: the engine is already genre-agnostic — conservation, beliefs, momentum,
war physics, and trade do not care whether the caravan is a freighter. Vocabulary-in-data
discipline + the facet law were kept precisely as this door (recorded owner aspiration). The
modalities map: sea lanes → shipping lanes; teleport circles → jump gates; harbors → ports of
any kind. **THE PACK BOUNDARY (the coherence guarantee): packs RECOLOR and RETUNE the ontology;
they NEVER add entity classes, movers, or physics.** New physics is master-system evolution
(owner-only, forever). This boundary is what makes a user's sci-fi world COHERENT — it runs on
the same audited laws — and what makes it buildable at all.

## 1b. ONTOLOGY EXTENSION TIERS (owner amendment 2026-07-16: "can we have custom content
## ontology additions or amendments as well?" — yes, through three mechanisms, one wall)

**MECHANISM 1 — COMPOSITION (the default):** most requested "new ontology" is existing classes
wearing new facets — a megacorporation = faction-network + institution holdings + hegemony
sphere + a 'corporate' facet. The compiler's mapping duty (S4's honesty rule) reports exactly
what mapped mechanically, what is flavor, and what is unsupported. The class algebra covers
~90% of genre requests; the receipt names the remainder.

**MECHANISM 2 — AMENDMENT POINTS (the middle tier this amendment opens):** wherever consuming
machinery is TABLE-DRIVEN (the stressor registry + its walker is the proof pattern), users may
add SUBTYPES: new condition archetypes, treaty-term kinds, facet kinds, relationship flavors,
drama classes, stressor types. THE PALETTE LAW governs: a subtype's behavior is COMPOSED from
registered behavioral primitives with bounded parameters — never user-authored logic. Each
amendment point ships: its registration walker generalized over account registries, its
primitive palette enumerated, its bounds validated. AMENDMENTS RUN SUBTRACTIVE TOO: packs may
SUPPRESS master vocabulary per-account (no-gunpowder worlds, no-church worlds) — dormancy-
shaped, free by construction.

**MECHANISM 3 — STANDING OPERATION PROGRAMS (custom dynamics without custom code):** the
deepest requests ("a mana tide that waxes and stresses the coast") are served not by user
movers but by user-authored SCORES the op layer performs: recurring, predicate-triggered
programs of typed operations (the S7 standing-instruction + StopCondition machinery,
generalized) — periodic FORCE ops with oscillating dials, deterministic predicates over
read-models, E0 tempo-governed, receipted with program provenance, replayable because ops are
data. The world experiences a new process; the engine runs zero new code. Dynamics become
content.

**THE WALL (never user-space):** new entity classes with novel state shapes; new kernel/mover
code; amendments to the laws (conservation, state-never-fate, the epistemic layers,
determinism, the premium seam). Master evolution only. REFUSALS ARE HARVESTED: unsupported-
ontology requests log (consented) as the owner's roadmap signal — users vote for the next
master expansion with their rejected dreams.

**Revised pack boundary (supersedes §1's blunt form):** packs may COMPOSE, AMEND AT REGISTERED
TABLE-DRIVEN POINTS under the palette law, SUPPRESS, and SCORE dynamics through the covenant —
and may never author state shapes, kernel logic, or law changes.

## 2. DETERMINISM SURVIVES (the constitutional extension)

The content plane is CONFIG — it lives on the frozen-intent side of the ontology, never the
engine side. The world function extends: world = f(seed, config, **content-plane**, op-log).
Same seed + same pack ⇒ same world, byte for byte — the replay promise holds INSIDE every
account. Master goldens never move because master defaults never move; a pack absent is
vanilla, byte-identical. Campaigns bind packs AT CREATION (pack choice is config); mid-campaign
pack edits ride the existing receipted rules-change lane and are mostly locked (the same
posture as re-canonize).

## 3. THE AUTHORING PIPELINE (how a user builds a world with the AI)

1. **ELICITATION** — the AI interviews (tone, tech level, factions, what matters), unbounded
   conversation.
2. **THE DRAFT** — the compiler emits a staged pack: schema-typed entries, knob settings with
   bounds respected, coherence DECLARATIONS per entry (facets, chain memberships, terrain
   legality, classification rows — the coherence matrix as an authoring OBLIGATION).
3. **VALIDATION** — the SAME walkers that police the master catalog run against the user
   registry: id collisions, tag vocabulary, classification coverage, geography legality,
   reachability. Structure is machine-guaranteed.
4. **THE TASTE GATE (the killer preview):** generation is cheap and deterministic — so the
   system FORGES A SAMPLE SETTLEMENT from the draft pack before anything commits. The user
   reads a town from their own sci-fi world, with receipts. The S5 intent-vs-result comparator
   generalizes: "you asked for hard-scarcity spacer grit; here is where the draft deviates."
5. **ITERATION** — "grimmer", "less religion" → the compiler emits deltas, re-forge, re-read.
6. **APPROVAL → LANDING** — the pack enters the account registry; the aiOperationLog records
   the full provenance (prompt hash, model, entries landed); every receipt in play later NAMES
   pack provenance ("stressor: Void Corsairs pack").
7. **THE ESCAPE HATCH (mandatory):** one action returns any campaign to vanilla — packs are
   dormancy-lawful, so reset is byte-clean. No user can strand themselves.

## 4. HONEST BOUNDARIES (V1/V2 split, stated now)

- **V1:** entities + knobs + vocabulary tables + naming + calibration. The DIEGETIC REGISTER
  (crier voice, whatPhrase corpora — thousands of authored fantasy lines) stays fantasy-toned
  or neutral in V1; **V2 = AI-generated voice tables validated by the existing register guards**
  (second-person rules, no-UI-verbs, totality floors — the guards are register-agnostic; the
  corpus is the work).
- Tiers (thorp→capital), week-ticks, and the digest's modality set are engine-shaped, not
  vocabulary-shaped — packs rename their DISPLAY, never their mechanics, in any version.
- A full pack is a LARGE generation job — task-priced honestly (credits/BYOK per the Surveyor
  commercial model); partial packs (naming-only, knobs-only) are cheap first rungs.
- Shared/gallery packs (the marketplace door) are FUTURE scope: they inherit the moderation
  lane + the same validation; noted, not designed here.

## 4b. THE ANALYTICAL COUPLING (owner amendment 2026-07-16: "with all of these potential
## expansions through custom content, as it regards both intent, and tuning/soak for their
## experience, there needs to be stronger coupling and relationships between that and the
## analytical layer")

The content plane changes what the analytical layer is FOR. Today analytics observes one
certified configuration; the plane mints a NEW configuration per authoring user — a
distribution nobody batch-certified. Three couplings close that gap:

**COUPLING 1 — INTENT, END TO END.** The intent atlas (mig-134) extends from intent→outcome
to intent→content: authoring sessions emit consented events for the stated intent, the
compiled result, the user's corrections, and — most valuable — the REFUSALS (what users
asked for that the plane could not compile). Three consumers: the training corpus
(intent→pack is the richest label shape yet, per the matrix), compiler evals (correction
rate per rung = the compiler's real acceptance metric), and the roadmap radar (clustered
refusals are the next knob/pack tier, demand-proven before it is designed).

OWNER AMENDMENT (2026-07-16 evening: outlandish ideas — "both what was rejected by the
system and what was built even with ontological differences… useful to me and other
developers for games and worldbuilders… to understand effective user aggregate
interests"): the event shape carries the dimensions the aggregate question needs — the
RUNG used (entity / knob / pack), the §1b EXTENSION TIER exercised (composition /
amendment-point / suppression / op-program), and for refusals a REASON CLASS
(no-operation-type / taste-gate / pack-boundary / knob-bounds / validator) — so "what do
worldbuilders actually want, and where does the system say no" is answerable from pure
aggregates without reading anyone's content. A FOURTH consumer joins the three: **THE
AGGREGATE INTEREST ATLAS** — k-anonymous, id-free theme/category/count aggregates
suitable for publication beyond the product (developer/worldbuilder insights). GUARD
(purpose limitation, non-negotiable): external sharing is a DISTINCT consent purpose,
named in the consent language BEFORE collection begins — never retrofitted onto data
collected for product improvement. Only theme/category/count aggregates ever leave;
verbatim user creations are the user's IP and never do. k-floors per the A2 precedent
(50/200). BYOK §3 (never logged) governs keys and raw provider traffic; consented seam
events remain opt-in for BYOK users like everyone else.

OWNER CLARIFICATION (2026-07-16 evening: theme-level extrapolation — "themes related to
Sci-fi or something more specific within… not too concerned about interpretability at
this stage… more so the organized data collection… fine with simply putting the data into
an artificial intelligence to extrapolate"): three binding consequences. (1) **THE THEME
DICTIONARY** — a generated, VERSIONED, HIERARCHICAL genre→subtheme taxonomy (the A2
dictionary pattern), multi-tagged onto every authoring event AT COMPILE TIME by the intent
compiler (retroactive theming is impossible where raw text is not retained — mint the tag
when the text is in hand). (2) **COLLECT FINE, AGGREGATE LATE** (the storage law):
consented planes retain EVENT-GRAIN records with stable schemas — never rollups-only;
today's questions must not be baked into storage, because the owner's stated analysis mode
is AI-over-organized-data at a later date; interpretability is deliberately deferred to
analysis time. (3) **ACCESS TIERS**: the owner queries/exports both consented planes
internally (named purposes); other worldbuilders receive only the Aggregate Interest
Atlas exports; deep slices publish externally only where the population clears the
k-floor (early suppression of narrow slices is the architecture working, not data loss —
the grain is still collected).

**COUPLING 2 — THE WORLD-HEALTH METRIC SUITE.** The SOAK_PLAN's 10 PASS criteria are
refactored as a reusable EVALUATOR LIBRARY with two clients: (a) master batch certification —
the soak as scheduled — and (b) per-account STREAMING health telemetry. A user's knob/pack
configuration is a world nobody soaked; their world gets a continuous soak-lite. Surfaces:
a "world pulse" health read-model (the DM sees their world's vital signs) and grounding for
the Surveyor's tuning advice (stage-S6 counsel cites health metrics the way S1 cites
receipts — never vibes).

**COUPLING 3 — THE CLOSED TUNING LOOP.** This is where the inert §10 rails' design premises
finally arrive in code: knobs exist → worlds run under them → health telemetry streams →
the Surveyor PROPOSES knob deltas through the ops/approval lane (never silently, never
auto-applied) → consented k-anon aggregates map which knob-REGIONS produce healthy worlds →
the knob registry's recommended ranges improve for everyone. Tuning stops being an event
and becomes an organ. Master-side range changes remain owner-signed.

**GUARDS (constitutional, restated as law):** ENDOGENEITY EXTENDS TO TELEMETRY — the world
never reads its own analytics; health metrics inform the Surveyor and the human, never the
tick (the rails' golden-law lane classifier stays load-bearing as the enforcement point).
Proposals always cross DM approval — the loop is closed through a human, not around one.
The consent architecture is inherited whole (research plane, k-floors, id-free events).

## 5. COHERENCE MATRIX (standing practice)

×FACET LAW (the plane's citizenship mechanism — rung 1 rides it wholesale) · ×§10 RAILS (the
inert substrate becomes load-bearing; its golden-law lane classifier is the safety floor) ·
×COUNTERPART CRITERION (pack content is forceable exactly as catalog content — force≡organic
holds because facets, not names, drive mechanics) · ×PREMIUM SEAM (packs are user content;
players see them through normal projections; latent-pantheon-class secrets keep their walls
inside packs) · ×DETERMINISM/GOLDENS (§2 — the constitutional extension; master goldens
untouchable by construction) · ×SURVEYOR TRUST LADDER (S4+ builds after S4's acceptance
metrics; the compiler's schema-fencing means worst case = refused drafts, never corrupted
worlds) · ×D7/EPISTEMICS (pack-authored actors get beliefs/reframes identically — the
epistemic engine is content-blind) · ×GALLERY LOOP (a shared world in a user's own genre is
the strongest artifact the share loop can carry) · ×TRAINING CORPUS (intent→pack is the
richest label shape yet; consent-gated per the standing corpus rules) · ×ANALYTICS SEAM
(§4b couplings 1–3 ride the existing track→EVENTS→consent→ingest spine — enrich-first,
zero eager; endogeneity-extends-to-telemetry enters the law set) · ×SOAK PLAN (one evaluator
library, two clients — the soak's criteria become the plane's per-account health floor).

## 6. SEQUENCING

Design enters the Surveyor lane NOW (this doc); the KNOB REGISTRY (rung 2's enumeration —
which constants, what bounds) is the one substrate artifact worth building EARLY because the
soak's tuning pass touches the same constants (one enumeration serves both). Build order:
S4 (entities, per the existing ladder) → S4+ rung 2 (knobs) → rung 3 V1 (packs, vocabulary) →
V2 (register skins). Every stage gated on the prior's acceptance metrics, per the Surveyor
doctrine. Nothing here disturbs the current endgame sequence.
