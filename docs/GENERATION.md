# THE GENERATION SYSTEM OF SETTLEMENTFORGE
## A complete, ground-up guide to the Forge — how a settlement is born, and why you can trust it
### Fable 5, 2026-07-16 — companion volume to docs/ONTOLOGY.md. Written for a reader new to the system; no prior knowledge assumed. The ontology describes what EXISTS; this document describes how it comes to exist.

---

## HOW TO READ THIS DOCUMENT

When a user clicks "generate," the system mints a complete settlement — economy, people,
institutions, history, secrets, adventure hooks — in a few seconds. This document explains that
minting process end to end: what goes in, how the machine decides everything, what comes out,
and the machinery that keeps every one of those decisions honest, repeatable, and explainable.

One definition up front, because everything depends on it:

- **The seed:** a short string that initializes the random number generator. In this system,
  the seed is destiny: the same seed with the same settings produces *the same settlement,
  byte for byte, every time, forever*. That promise ("same seed, same town") is on the
  product's landing page, and most of the machinery below exists to keep it true.

---

## SECTION 0 — THE THREE LAWS OF THE FORGE

Everything in generation follows from three laws.

### 0.1 The dice are sealed inside the machine (fail-closed randomness)

Generation may only draw randomness from a *seeded context* — a random stream derived entirely
from the seed. There is no way for stray randomness to leak in: if any code anywhere attempts
an unseeded random draw during generation, the system does not quietly tolerate it — **it
throws an error and halts**, in every environment including production. There is exactly one
deliberately-named escape hatch function for the rare legitimate use outside generation, and
its name is designed to be easy to search for. This is what "fail-closed" means here: the
system is built so the *mistake is impossible*, not merely discouraged.

Two subtler disciplines protect the same promise:

- **Name-keyed forks.** Each of the pipeline's steps draws from its own *named* branch of the
  random stream (the economy step from one branch, the NPC step from another). Because each
  branch is keyed by name rather than by position, *reordering the steps doesn't change
  anyone's dice* — the pipeline can be refactored without silently changing every world.
- **Draw-order stability.** Within a step, code is written so that a refactor consumes exactly
  the same number of draws in exactly the same order (a helper that replaces a pick must
  consume exactly one roll, like the pick it replaced). Loops that feed the dice always iterate
  in a stable order (sorted by codepoint — plain character order, immune to the computer's
  language/locale settings). These sound like small things; they are the entire difference
  between "same seed, same town" being a promise and being a lie.

### 0.2 Generation never reads the living world

The Forge's inputs are exactly four: the **config** (the user's settings), the **custom
content** snapshot (their homebrew), the **toggles** (which systems are enabled), and — when
generating a neighbor — the **imported neighbor settlement**. That's all. Generation is
structurally blind to the simulation's live state: it cannot see the current tick, the wars in
progress, or anything the living world has written. Why? Because if generation could read the
living world, regenerating a settlement mid-campaign would produce different results depending
on *when* you did it — and the replay promise would die. The boundary runs the other way too:
the living world treats generation's output as frozen (see the ontology, Section 0.1).

### 0.3 The user's hand is an overlay, never a mutation

When a user edits a generated settlement — changes a resource, adds a stressor, authors a
custom trade good — the edit is stored as a small **overlay delta** (resourceEdits,
stressorEdits, customTradeGoods) and *re-applied after the rolls* every time the settlement is
regenerated. Crucially, applying overlays consumes **zero random draws** — so a settlement
with no edits regenerates byte-identically, and a settlement *with* edits keeps them through
every regeneration. The user's intent survives the machine; the machine's determinism survives
the user.

---

## SECTION 1 — THE INPUTS: what the Forge is given

**The config** is the user's intent, resolved into a complete specification before any content
rolls: the settlement's tier (thorp through capital), terrain, population posture, which
*stressors* (pressures like banditry or plague) the user asked for versus which the dice may
add, tone settings, and dozens of switches. A special resolution step reconciles what the user
*asked for* with what the world can support, and records which stress types were user-intended
versus rolled — a distinction later steps respect. (A guard exists specifically to prevent a
subtle failure: a previously-generated settlement's *outputs* accidentally re-entering as if
they were the user's *inputs* on reload — emergent facts must never masquerade as intent.)

**The custom content snapshot** is the user's homebrew library: custom institutions, deities,
trade goods, NPCs. By the **facet law** (see Section 5), these are first-class citizens — every
mechanism that reasons about catalog content must reason about custom content identically.

**The toggles** decide which optional layers even run (magic, particular stress families,
ancient-ruin seeding, and so on). By the dormancy law, a disabled layer consumes no dice and
leaves no trace — a world generated with a layer off is byte-identical to one where the layer
never existed.

**The imported neighbor** (when generating adjacent settlements) carries the already-generated
neighbor so relationships, trade logic, and conflicts can be woven between them — with *honest
receipts*: if a neighbor relationship had no mechanical effect on some outcome, the receipt
says so explicitly rather than implying influence that didn't happen.

---

## SECTION 2 — THE PIPELINE: how a settlement is actually built

Generation runs as a **pipeline of roughly twenty-two steps in a fixed, topologically-sorted
order** (each step declaring what it needs from the steps before it). Every step: takes its
named fork of the dice; declares, under a machine-checked contract, exactly which parts of the
settlement it *provides*, *mutates*, or uses as *scratch* (so no step can secretly write where
it shouldn't — a test cross-checks every step's actual reads against its declarations); and
emits **trace receipts** recording what it decided and why (timestamped by a deterministic
counter, never the wall clock).

Walked in narrative order, a settlement is born like this:

**1. The ground.** Config resolution fixes the terrain, tier, and stress plan. Terrain then
governs everything downstream: which resources the land can hold (a floodplain cannot hide an
ore vein — geographic impossibility is *impossible*, not rare), which institutions the ground
favors (mountains favor quarries; forests favor sawmills — each terrain's boost rows are
single-match by law so nothing double-counts).

**2. The organs.** The institution assembly rolls the settlement's organizations from the
catalog: probability-weighted by tier, terrain, resources, and the presence of their neighbors
(institutions attract and exclude one another). Then the pruning passes shape the roster —
upgrade ladders collapse (a town with a Temple doesn't also keep its redundant Shrine),
subsumption merges overlapping functions, and isolation/subsistence rules strip what a
cut-off hamlet couldn't sustain. One law binds every pruning pass: institutions marked
**required, forced, or custom are contracts with the user** and are never silently deleted.

**3. The economy, solved as a bounded loop.** Economy, power, and factions depend on each
other. The pipeline therefore rolls a provisional economy, forms a political *intent* against
it, permits one faction-to-institution pull, and then re-solves the economy against the final
roster. One final power pass replays the original political intent on the original named dice
stream, refreshing only the prosperity-, safety-, food-, and defense-dependent projection. It
does **not** pull institutions again. This is a one-iteration closeout, not an open-ended
fixpoint: identities and neighbour-faction rolls survive, while stale economic power cannot.
The finished power structure carries a versioned fingerprint of the exact economic inputs it
consumed, and assembly fails closed if that fingerprint disagrees with the dossier's final
economy. Food security likewise has a single authoritative writer (one function owns the food
answer; every other surface *threads* it rather than recomputing it — the design cure for two
parts of the dossier disagreeing about whether the town is starving). Defense scores,
prosperity bands, services, and trade goods follow, each reading the settled roster.

**4. The people.** The NPC generator mints the named cast: office-holders resolved against the
power structure (with an office-equivalence resolver so the "Guildmaster" and the "Master of
the Guild" are the same seat, and structural placeholders keep unled offices visible), each
person with traits, goals, secrets, and attire drawn from deep authored tables. In settlements
with criminal institutions, the **corruption pass** decides explicitly, per NPC, who is
compromised — stamping an explicit yes/no so the living world later knows generation already
decided (no ambiguity for the simulation to re-litigate). A coherence pass then tightens the
cast: relationships, faction memberships, and conflicts are woven so the people form a
society, not a list.

**5. The faith.** The pantheon step seeds the settlement's gods — and here generation performs
its most elegant privacy trick: the **latent pantheon** (the secret gods that may emerge
later) is baked *identically for every user tier*, and its activation is a separate step that
consumes *no randomness at all*. Consequence: no paid tier ever gets "better" gods (the
premium law — tier never touches generation), and no generation-time surface can even *name* a
latent deity (its summary reports counts only). The secret is secret by construction.

**6. The story.** The history and timeline generator writes the settlement's past — founding,
disasters, golden years — consistent with everything rolled above (a settlement with a
siege-scarred wall has a siege in its timeline). If the ancient-ruins toggle is on, the deep
past may seed a relic ruin nearby (opt-in, zero draws when off). Naming draws from a large
authored corpus with cultural consistency.

**7. The inspection.** A structural validator checks the finished settlement against its own
rules; cross-settlement conflicts are woven if a neighbor was imported; and the final metadata
step seals the trace — the complete record of every step's decisions and reasons — into the
dossier's birth receipts.

The output is the **dossier**: the frozen expression of everything above (see the ontology,
Section 1), plus the **trace rail** a user can open to see *why* — why this institution, why
this price, why this NPC leads that faction — every answer receipted.

---

## SECTION 3 — THE CONTENT LIBRARY: the data tables underneath

The pipeline's raw material is a large authored data layer (~18,000 lines of tables), governed
like code:

- **The institutional catalog** — every institution with tiers, tags, categories, services,
  and identity machinery: ids are generated by one shared slugifier, checked for collisions at
  load time (a colliding name refuses to boot rather than silently shadowing), and all joins
  between tables are **id-first** — matched by identifier, with the legacy name-matching
  behavior frozen byte-compatibly underneath so nothing shifted when the ids arrived.
- **Resource data** — every resource with its terrain legality, its commodities, and its
  renewable/nonrenewable nature; guarded by a hand-checked classification table that forces a
  human decision on every new resource (born of a real incident: a substring match once
  classified barley as magical because "bar-LEY" contained "ley," as in ley-lines).
- **Geography, trade goods, supply chains, naming, NPC material, stress metadata** — each with
  its own vocabulary governance (a documented two-axis category system), an orphan-tag ratchet
  (tags that lose all users must be consciously removed, not accumulate), and joins pinned by
  a dense battery of contract tests.

The tables are where the world's *flavor* lives; the governance is why ten thousand lines of
flavor don't rot.

---

## SECTION 4 — THE RECEIPTS: every decision explains itself

The trace rail deserves its own section because it embodies the product's soul at birth.
Every step emits receipts: which candidates were considered, which weights applied, what won,
and *why*. Silent overrides are forbidden — if the machine quietly rewrites something (an
isolated settlement's trade route, a plague-decimated militia floor), it must leave a receipt
saying so. And receipts practice **anti-overclaiming**: they only credit a mechanism with
influence if it actually exercised any (a neighbor relationship that didn't change the roll
says "no mechanical bias" rather than taking credit). The user reading the trace is never
flattered and never lied to.

---

## SECTION 5 — CUSTOM CONTENT: the facet law

Users author their own institutions, deities, goods, and people — and the system's law is
that **custom content is a first-class citizen of every coherence**. The mechanism is the
**facet**: a small set of machine-readable character tags (clandestine, subterranean,
mercenary, …) resolved through one chokepoint with a fixed precedence — *declared* (the author
said so) → *inferred* (the system recognized it) → *kind-default*. Every system that treats a
catalog institution specially must consult facets, never hardcoded names — so a user's
homebrew "Smugglers' Warren" gets the same underground-network mechanics as the catalog's, by
right rather than by exception. Custom entities also enjoy the pruning protections of
Section 2 (never silently deleted) and deterministic treatment (custom-content loops sort
stably before touching the dice, so adding homebrew never scrambles unrelated rolls).

---

## SECTION 6 — AFTER BIRTH: edits, regeneration, and what survives what

A settlement's life doesn't end at generation, and the Forge's hardest engineering is here.

**Section regeneration.** A user can reroll *part* of a settlement — just the NPCs, just a
section — without touching the rest. Regeneration runs the relevant pipeline steps under a
recorded regeneration seed, **respects locks** (canon-locked entities are preserved), re-runs
the coherence passes so the new piece knits into the old whole, and **persists** properly.
The law being protected: a regenerated section must be *the same kind of thing* generation
would have made — the same distributions, the same decided-markers (a rerolled cast in a
criminal town must carry corruption verdicts, exactly as a born cast would).

**The survival table** — the lifecycle question that has historically bitten this codebase
hardest ("a write that survives one path and ghosts another"), so it is engineered explicitly.
What survives what:
- **User edits (overlays)** survive: full regeneration, section regeneration, reload, undo.
- **Custom content** survives everything; it lives in its own library.
- **Canon locks** survive regeneration (locked entities are not rerolled).
- **The living world's changes** are *not* generation's concern (they live in the overlay
  realm — see the ontology) — but event-promoted conditions are dual-written so that a
  settlement regenerated mid-campaign doesn't resurrect an expired crisis or lose a live one.
- **The seed** itself is recorded (including per-section regen seeds), so *everything above
  is replayable*.

**The town map** deserves a note: it is not stored at all — it is a *pure view-time
projection* recomputed from the dossier through its own named fork of the seed. The dossier
and its map cannot disagree, because the map has no independent existence (cosmetic map edits
ride a small anchored overlay, same philosophy as Section 0.3).

---

## SECTION 7 — CANONIZATION: the handoff to the living world

Generating a settlement makes a *document*. **Canonizing** it into a campaign makes it a
*place in a world*. Canonization builds the **frozen spatial digest** — the precomputed map of
distances, territories, routes, and chokepoints between all member settlements, computed by a
provably deterministic pathfinding pass (its tie-breaking rules are documented and proven, so
the same realm always produces the same geography). The digest is then sealed — deep-frozen in
memory so that any code attempting to write to it throws — and versioned, so a deliberate
re-canonization (new member, new roads) is an explicit, receipted event rather than drift.
From that moment, the living world begins: the tick engine writes its overlays *over* this
frozen geometry, and the boundary between the two realms (ontology Section 0.1) is in force.

---

## SECTION 8 — THE QUALITY MACHINERY: why you can believe all of the above

Every claim in this document is enforced by test machinery, not good intentions:

- **The golden master:** a full settlement, generated from a pinned seed, committed to the
  repository byte-for-byte. Any change that alters generation output — even one byte — turns
  the build red. Regenerating the golden is an owner-signed ceremony with a documented reason,
  never a casual refresh. This is the replay promise, mechanized.
- **The strict data-flow contract:** every pipeline step's declared reads/writes are
  cross-checked against its actual behavior.
- **The economy-to-power freshness proof:** the final power projection persists a versioned
  fingerprint over the exact tier, prosperity, safety, and food inputs it consumed. Final
  assembly recomputes and asserts that fingerprint, so a future reorder cannot quietly persist
  a power structure derived from an earlier economy.
- **Reachability tests:** every catalog entry must be reachable by some legal configuration
  (dead content that can never roll is a test failure, not a surprise).
- **Registration walkers:** adding a new stress type, resource, or institution without wiring
  every consumer (vignettes, tension templates, classification, services) fails a walker test
  that literally scans the source for half-wired additions.
- **The determinism battery:** same-seed property tests, draw-order pins, hostile-locale runs
  (the suite re-runs under a Turkish locale and a Pacific timezone to prove no cultural
  setting can bend a world), and the edit-overlay zero-draw pins.
- **The config-seam contracts:** the vocabulary the config speaks must be the vocabulary the
  pipeline hears (a setting that generation would silently ignore is a contract violation).

---

## SECTION 9 — THE ONE THING TO REMEMBER

The Forge's entire design serves a single sentence: **a generated world is an argument, not an
accident.** The same seed always produces the same town; every choice in that town carries its
reasons; the user's hand is preserved through every regeneration; secrets are secret by
construction; homebrew is native, never bolted on; and the whole edifice is guarded by
machinery that turns any broken promise into a red build. When the living world (the
ontology's Sections 4–6) later makes that town boom, break, and believe — it is building on a
foundation whose every stone is signed.
