# THE CONTENT PLANE OF SETTLEMENTFORGE
## A complete, ground-up guide to AI-authored custom content — how a user makes the world their own, and why it stays coherent
### Fable 5, 2026-07-16 — third companion volume, after docs/ONTOLOGY.md (what exists) and docs/GENERATION.md (how it is born). This document describes what a user can AUTHOR: the layer where AI creativity meets the deterministic engine. Written for a reader new to the system; no prior knowledge assumed. DESIGN-STATE: this describes the system AS DESIGNED (Surveyor stages S4+), not yet built — the "eventually" the owner asked about.

---

## HOW TO READ THIS DOCUMENT

The ontology describes the world the system knows how to run. Generation describes how a single
settlement is born into that world. This document describes the third thing: how a *user*, with
the help of AI, can reshape what the world is made of — its vocabulary, its dials, even an
entirely different genre — for their own account, without ever touching the shared system
everyone else uses, and without breaking a single one of the promises the other two documents
made.

The central tension this document resolves: **AI is unboundedly creative, but a simulation must
be bounded to stay coherent.** The whole design is the answer to "how do you let the AI invent
anything, while guaranteeing that whatever lands still obeys the laws?"

Two definitions up front:

- **Custom content:** anything a user adds that wasn't in the system's built-in library — a
  homebrew institution, a custom god, and (as designed here) far more.
- **The AI layer ("the Surveyor"):** an assistant that turns a user's plain-English wishes into
  proposals the system can validate and apply. Crucially, the AI never writes to the world
  directly — it only *proposes*, and the user always approves. (See docs/ONTOLOGY.md Section 7.)

---

## SECTION 0 — THE ONE LAW: TWO FREEDOMS, ONE BOUNDARY

Everything in this document follows from a single principle:

> **The AI's imagination is unbounded. What CONCLUDES into the system is typed.**

The AI may *imagine* anything — any institution, any god, any dial, any genre, any dynamic. But
only things that *compile into a registered, validated, bounded content type* actually land in
the system. The gate between "anything the AI can dream" and "what the machine will accept" is
**the schema** — the typed definition of what a valid piece of content looks like.

You have already met this idea twice. The system's manual controls work this way (a DM can only
issue defined operations). The AI's actions work this way (it can only propose defined
operations — "no operation type means no effect"). Custom content is the third application of
the same law: **no content type means no landing.** Content is just another thing that must pass
through the typed door.

And one more boundary, the one that makes the whole thing safe: **everything a user authors lands
in THEIR account only.** The shared master system — the built-in catalogs, the simulation
kernels, the constitutional laws, the reference worlds — is *architecturally unreachable* from
this layer. A user cannot change the system; they can only change *their own copy's vocabulary
and dials*. One user's sci-fi galaxy is invisible to another user's fantasy kingdom.

---

## SECTION 1 — THE THREE RUNGS: what "all the knobs" actually means

When the owner says the AI should have access to "all the knobs — not to edit the system, but to
create content that edits the system for that user," that resolves into three rungs of
increasing power.

### Rung 1 — ENTITIES (the parts of a world)

The AI can author the *things* a world is made of: custom institutions, custom deities, custom
trade goods, custom NPCs, custom stressor definitions. This already exists in the system today
as hand-authored "custom content"; the AI's job at this rung is to *write it for you* from a
conversation. By the **facet law** (docs/GENERATION.md Section 5), these get full mechanical
citizenship — a homebrew "Smugglers' Warren" behaves exactly like the built-in underground
network, because the engine reasons about *facets* (machine-readable character tags) rather than
names. Your invention is a first-class citizen, not a second-class bolt-on.

### Rung 2 — TUNABLES (the dials of a world)

The engine is saturated with named settings — how fast news travels, how much a week of travel
costs, how much drama a busy realm allows, how long a people remembers a grudge, how likely a
given stressor is to appear, how a personality trait maps to stubbornness. Every one of these is
a **knob**. Rung 2 promotes a curated set of these knobs to *per-account overrides*: the user
(through the AI) can say "in my world, news travels slowly and grudges last for centuries," and
those become their account's settings.

Each knob is defined with a *type*, a *bounded range* (you cannot set travel speed to infinity),
a *default*, and a note on what else it affects. If a user sets no override, the master default
applies — and their world is byte-identical to a default one (the dormancy law again: absence
means "as it always was").

An important behind-the-scenes fact: the machinery for this *already exists*, built and waiting.
The system shipped an "auto-tuning rails" framework — a whitelist of which settings are safely
tunable, plus a structural guard that makes the dangerous settings (the ones that would break
determinism or the master goldens) literally impossible to expose. The knob registry is that
framework's first real tenant. "NPC architecture" (the trait vocabulary, the temperament
tables), travel speed, relationship weights — all live here.

### Rung 3 — SETTING PACKS (a whole world's identity)

The top rung is the extreme the owner described: a user asks the AI to build a *fully coherent
sci-fi setting* (or noir, or post-apocalypse, or anything). A **setting pack** is a coherent
bundle of rungs 1 and 2 plus *vocabulary tables* — the naming style, the institution catalog's
skin, the goods and resources, the terrain/biome names, the faith-or-ideology layer, the flavor
of every stressor, the units and currency.

Here is why this is even possible, and it is the most important fact in this document: **the
engine is already genre-agnostic.** Conservation, belief, momentum, war physics, trade — none of
them care whether the caravan is a mule train or a freighter. The system was built with
"vocabulary lives in data, mechanics live in code" as a discipline for years, precisely so this
door could one day open. A sea lane becomes a shipping lane; a teleport circle becomes a jump
gate; a harbor becomes a spaceport. The *mechanics* are identical; only the *words* change.

---

## SECTION 2 — THE WALL, AND THE THREE WAYS THROUGH IT

"Can I add new kinds of things, not just new instances?" — yes, and the design answers with
three mechanisms and one permanent wall. This is the subtle heart of the whole plane.

### Mechanism 1 — Composition (most "new" things are old things in disguise)

The system's building blocks are deliberately abstract: courts, blocs, institutions, claims,
spheres of influence. A user asking for "megacorporations that secretly run the government"
doesn't need a new *kind* of thing — a megacorp is a faction-network, with institution holdings,
a sphere of influence, and a `corporate` facet; "secretly runs the government" is the corruption
web you already have. The AI's job is to *recognize* this — to map the user's dream onto the
existing building blocks — and to *say honestly* which parts mapped mechanically, which parts are
pure flavor, and which parts aren't supported. Most requested "new ontology" is composition.

### Mechanism 2 — Amendment points (new subtypes, from a palette)

Some parts of the engine are *table-driven*: they read a list of types and handle whatever is on
the list. New stressor types already work this way — there's even a guard that refuses to let a
new stressor type ship half-wired. Wherever the machinery is table-driven like this, users can
*add subtypes*: new condition kinds, new treaty-term kinds, new relationship flavors, new drama
categories, new stressor types.

The rule that keeps this safe is **the palette law**: a new subtype's *behavior* is composed from
a menu of registered building-blocks with bounded settings — never from user-written logic. You
can say "this stressor spawns in dry seasons, decays slowly, and couples to unrest" (all choices
from the menu, all within bounds); you cannot write a new rule from scratch. And amendments work
*subtractively* too — a pack can *remove* master vocabulary from that account ("no gunpowder in
my world," "no organized religion") — which is free, because removal is just the dormancy law
pointed the other way.

### Mechanism 3 — Standing operation programs (custom dynamics without custom code)

The deepest request — "my world has a mana tide that waxes and wanes and stresses the coastal
towns" — sounds like it needs a whole new *process* in the engine, which is sealed territory. It
doesn't. It needs a **score**: a recurring, condition-triggered *program of ordinary operations*
that plays through the same approval machinery the DM uses. "Every so often, when these
conditions hold, apply this effect with an oscillating strength." The world *experiences* a new
recurring dynamic; the engine runs *zero new code*, because the dynamic is just a pattern of the
operations that already exist — data in the log, fully replayable, fully receipted. This is,
quietly, the most powerful idea in the design: because the whole system is built on
"operations, not direct writes," even *dynamics* can be authored as content.

### The wall (what stays the system's alone, forever)

New kinds of things with genuinely new internal state; new engine code; and any change to the
*laws themselves* (conservation, "state never fate," the belief-vs-truth architecture,
determinism, the paid-visibility boundary) — these are never user-space. They are how the master
*system* grows, and only its owner grows them. But here's the elegant part: when the AI has to
*refuse* a request as beyond the wall, that refusal is *logged* (with the user's consent) as
roadmap signal. Users literally vote for the master system's next expansion with the dreams the
system had to decline.

---

## SECTION 3 — WHY IT ALL STAYS COHERENT (the guarantees, kept)

Every promise the other two documents made survives the content plane — by construction, not by
hope.

- **Determinism holds inside every account.** Custom content is *configuration* — it lives on
  the frozen-intent side of the world (docs/ONTOLOGY.md Section 0.1), never on the engine side.
  The world is still a pure function of its inputs; now the inputs include the user's pack. Same
  seed plus same pack yields the same world, byte for byte. The user's sci-fi town they generated
  in year one is the same town in year twenty of their campaign.
- **The master goldens never move.** Because master *defaults* never move — a user's overrides
  live only in the user's account — the shared reference worlds that guard against accidental
  change are untouched by anything any user does.
- **A pack absent means vanilla.** By the dormancy law, an account with no pack is byte-identical
  to a default account. Nothing a user *could* author changes what the world is when they haven't
  authored anything.
- **The coherence guarantee scales WITH ambition.** This is the payoff. A user's wildest world —
  a hard-scarcity spacer dystopia — still runs on the same audited laws as everyone's fantasy
  kingdom, because everything they added was a costume (vocabulary), a palette composition (a
  bounded subtype), or a score (a program of existing operations). Their empire still can't
  extract wealth from nothing; their beliefs can still be wrong and start wars; their treaties
  still fray term by term. They didn't get a *different* simulation — they got the *same*
  simulation, wearing their genre. That is exactly why it will feel coherent: it inherits every
  law the master system spent years proving.

---

## SECTION 4 — HOW A USER ACTUALLY BUILDS A WORLD (the authoring pipeline)

The experience, end to end:

1. **The interview.** The AI asks about tone, tech level, what factions matter, what the world is
   *about*. This conversation is unbounded — dream freely.
2. **The draft.** The AI compiles the conversation into a *staged pack*: typed entries, knob
   settings within their bounds, and — critically — a *coherence declaration* per entry (its
   facets, its supply-chain memberships, its terrain legality, its classification). The coherence
   work the master catalog does by hand becomes an *authoring obligation* the compiler must meet.
3. **Validation.** The *same guards* that police the built-in catalog run against the user's
   draft: no ID collisions, valid vocabulary, complete classifications, legal geography,
   everything reachable. Structure is machine-guaranteed before anything is shown.
4. **The taste test (the magic moment).** Because generation is cheap and deterministic, the
   system *forges a real sample settlement from the draft pack* — and the user reads an actual
   town from their own sci-fi world, receipts and all, *before committing anything*. The
   intent-vs-result check the system uses for AI-built settlements generalizes: "you asked for
   grim scarcity; here is where the draft drifts toward abundance."
5. **Iteration.** "Grimmer." "Less religion." "More corporate intrigue." The AI emits changes,
   the system re-forges, the user re-reads. Tighten until it sings.
6. **Approval and landing.** The pack enters the user's account library. A full provenance record
   is written — what was asked, which model, what landed — and from then on, every receipt in
   play *names its pack* ("stressor: Void Corsair raid, from the *Rimward* pack").
7. **The escape hatch (mandatory).** One action returns any campaign to vanilla, cleanly, because
   packs obey dormancy. No user can ever strand themselves in a broken world of their own making.

---

## SECTION 5 — HONEST LIMITS (what "as designed" does and doesn't promise)

- **Voice comes in two versions.** V1 authors the *structure* of a world (its entities, dials,
  vocabulary, names, calibration); the *diegetic voice* — the thousands of hand-written
  town-crier lines that give the fantasy world its literary texture — stays neutral or
  fantasy-toned at first. V2 lets the AI author *voice tables* too, checked by the same guards
  that already enforce the writing rules (second-person address, no interface-speak, complete
  coverage) — those guards don't care about genre; only the words need writing.
- **Some things are engine-shaped, not vocabulary-shaped.** The size tiers (thorp through
  capital), the weekly clock, and the fixed set of connection types are mechanical, not cosmetic
  — a pack renames how they *appear* ("orbital habitat" for a tier), never how they *work*.
- **A full pack is real work, priced honestly.** Building an entire coherent setting is a large
  AI job, paid for in credits or on the user's own API key (per the Surveyor's pricing model).
  But the ladder starts cheap — a naming-only pack, or a knobs-only tweak, is a small, affordable
  first step.
- **Sharing is a later chapter.** A marketplace of user-authored packs is a natural future — it
  would inherit the same validation as a quality floor, plus a moderation layer — but it is noted
  here, not designed yet.

---

## SECTION 6 — THE ONE THING TO REMEMBER

The content plane is the moat compounding on itself. Every rival AI worldbuilding tool offers
*unbounded creativity* and pays for it with *incoherence* — worlds that contradict themselves the
moment you ask a hard question. This system offers the same unbounded creativity and pays *no
coherence tax at all*, because of one architectural choice: **the AI may imagine anything, but
only typed, validated, bounded content concludes into the world — and whatever concludes inherits
every law the engine already keeps.** A user can build a galaxy. It will run on the same physics
as a village. It will replay to the byte. It will explain itself with receipts. And it will
never, ever leak into anyone else's world. That is the whole promise: *infinite worlds, one set
of laws, kept.*
