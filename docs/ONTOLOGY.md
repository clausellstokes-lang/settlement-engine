# THE ONTOLOGY OF SETTLEMENTFORGE
## A complete, ground-up guide to everything that exists in the simulation — and why
### Fable 5, 2026-07-16 — written for a reader meeting this system for the first time. No prior knowledge assumed beyond "this is a tool for tabletop RPG dungeon masters." Read top to bottom; every term is defined before it is used.

---

## HOW TO READ THIS DOCUMENT

"Ontology" just means *a catalog of what exists and how it relates*. This document is the map of
everything that can exist inside a SettlementForge world, what each thing is made of, what rules
bind them, and what makes them change. It is long because the world is deep, but it is written to
be read in order — each section builds on the last. If you read only one thing, read Section 0:
it is the handful of ideas everything else follows from.

Two words you will see constantly:

- **The DM (Dungeon Master):** the person running a tabletop game. They are the customer. The
  whole system exists to give them a world that feels alive without them having to hand-track it.
- **Deterministic:** given the same starting inputs, the system always produces exactly the same
  result — down to the last byte. Roll the world forward twice from the same seed and you get two
  identical worlds. This is the single most important property; a great deal below exists to
  protect it.

---

## SECTION 0 — THE METAPHYSICS: the six ideas everything rests on

Before any content, understand the physics of this reality. There are six.

### 0.1 There are two kinds of existence: the Frozen and the Living

When you first generate a settlement, the system *mints* it: it rolls up an economy, populates it
with people and institutions, writes its history, and records the exact reasons for every choice.
Once minted, that founding description is **Frozen** — it never changes again. Think of it as the
town's birth certificate and blueprint, sealed forever.

But a world where nothing changes is dead. So everything that *happens after birth* — a war, a
plague, a boom, a betrayal — is recorded separately, in what we call **the Living overlay**: a
thin layer of change-notes laid on top of the frozen blueprint. The real, current state of the
town is always *"the frozen blueprint, plus the overlay changes, read together."*

Why split it this way? Because it lets the world change *and* stay perfectly replayable. The
blueprint never gets corrupted by events; events are just a list of deltas you can replay. This is
the foundation of determinism.

A crucial subtlety: if a settlement has no overlay note about something, that doesn't mean "empty"
— it means *"exactly as the blueprint said."* Absence equals the original. (In the system's terms
this is called **dormancy**: an inactive system contributes nothing and changes nothing.)

### 0.2 Time moves in weeks, and only forward, and only on purpose

The world has a clock that ticks one week at a time. Nothing in the world "just happens" in real
time while you're away — the world only advances when the DM advances it (or catches it up after a
gap). The world's interior has no concept of the real-world clock at all; this is deliberate, so
that the same world advanced the same number of weeks always lands in the same place.

When a DM returns after being away, the system doesn't skip ahead — it *runs every intervening
week*, quickly, so the history is complete and real. This is called **catch-up**.

### 0.3 Everything that happens has a stated reason, and you can always read it

This is the product's soul. Nothing in this world happens by fiat. Every war has typed, named
reasons. Every price has contributing factors. Every death, every boom, every betrayal carries a
**receipt** — a plain record of *why it happened and what caused it*. The DM can always trace the
chain backward: this war came from that grievance, which came from that broken treaty, which came
from that unpaid debt.

The randomness is honest, too. When the system rolls dice, it never rolls blindly — it rolls
*weighted* dice, where the weights come from the actual situation (a desperate, cornered ruler is
*likely* to lash out; a secure one is not), and those weights are themselves written into the
receipt. We call this **loaded dice**: chance chooses among outcomes the situation already made
more or less likely. So even luck has a legible reason.

### 0.4 Nothing comes from nothing (conservation)

The world obeys accounting. People are conserved: when a settlement grows, those people came from
*somewhere* (migration, birth), and when war kills them, that is the only way people leave the
count. Goods are conserved: what a town has after a trade equals what it had before, plus what it
made, minus what it used or lost. And prosperity is conserved: every economic boom has a named
*source* that gets *debited* — an ally's aid, a new trade route, conquest loot — never free wealth
from nowhere. If the town got richer, the receipt says who got poorer or what got spent.

### 0.5 Every fact has an audience (the visibility rule)

Some truths are for the DM's eyes only (which deity secretly pulls a court's strings; a spy's real
loyalty). Some are safe for players to see (the town's public rumors). Some are safe for total
strangers (a shared gallery page). Every single fact in the world carries a label saying who may
see it, and the system enforces this **fail-closed** — meaning if there's ever any doubt, it hides
rather than reveals. Paid features never change the *world*; they only change *how much of the
truth you're allowed to see*.

### 0.6 The engine resolves states, never fates

This is the boundary that makes it a *tool for a DM* rather than a replacement for one. The system
will decide what happens to *institutions, powers, populations, and places*: the guild falls, the
dynasty cracks, the port starves, the empire rises. It will **never** decide what happens to a
*named person*. Whether the beloved captain lives or dies, redeems or betrays — that is always the
DM's to author. Named people can *influence* the world (a paranoid king makes his court harder to
turn), but the world never resolves their souls. In the system's words: **state, never fate.**

Those six ideas — two realms of existence, weekly forward time, total legible causality,
conservation, per-audience visibility, and state-not-fate — generate everything below.

---

## SECTION 1 — THE BEINGS: everything that can exist

This is the cast of the world. For each, we say *what it is*, *what it's made of*, and *why it
exists*.

### The Realm (also called the Campaign)
**What it is:** the container for everything — a whole world/region the DM is running.
**Made of:** a roster of member settlements; the world clock (the current week); a *regional
graph* (a network diagram of who is connected to whom, and how); a *docket* of pending orders
awaiting the DM's approval; and a *ruleset* (the switches deciding which simulation systems are
active), whose every change is logged with a reason.
**Why:** it is the stage. Everything else is a player on it.

### The Settlement — the atom of the world
**What it is:** a single populated place — a thorp, hamlet, village, town, city, or capital (those
are the six size tiers, smallest to largest).
**Made of three parts** (remember 0.1 — Frozen vs Living):
- Its **config** — the frozen *intent*: the settings it was born from ("a coastal trade town of
  ~4,000, tense with its neighbor").
- Its **dossier** — the frozen *expression*: the actual generated content — the economy, the named
  people, the institutions, the written history, the adventure hooks.
- Its **live state** — the Living part: everything the passing weeks have written onto it —
  current conditions (famine? plague?), its prosperity band, the legitimacy of its rulers, whether
  it's mobilizing for war, what its people currently believe.
**Why:** it is the unit the whole simulation operates on. Wars are between settlements; trade flows
between settlements; the DM reads one settlement at a time.

**Sub-kinds of settlement** (its lifecycle produces these):
- **Satellites / steadings:** tiny proto-settlements (single-family homesteads) that a larger town
  spins off into its surrounding territory. They orbit a parent, grow or starve, and either mature
  into real settlements or die. Their people are *transferred* from the parent (conservation).
- **Remnants:** a settlement that has died. Its record is kept (so history remembers it) but the
  simulation's movers *skip* it — the dead don't trade, mobilize, or boom.
- **Relic ruins:** the *rare, earned* dead — only a settlement that once rose to city-or-greater
  and then declined all the way to death leaves behind a true ancient ruin. This scarcity is
  deliberate: ruins should feel legendary, not common.

### The Institution — a settlement's organs
**What it is:** an organization within a settlement — a temple, a market, a smithy, a thieves'
guild, a mercenary company, and now an **Underground Network** (excavated tunnels for smuggling,
escape, and clandestine business).
**Made of:** a catalog identity (or a fully custom one — see the *facet law* later; custom content
is a first-class citizen, never a second-class bolt-on); a *source* tag saying how it got there
(randomly rolled / required by the config / forced by the DM / authored as custom content — the
last three are "contracts with the DM" the system promises never to silently delete); upgrade
ladders (a shrine can grow into a temple); service menus; terrain affinities (you cannot dig an
Underground Network under a floodplain — it would flood; the system makes geographically
impossible things *impossible*, not merely rare); and **facets** — machine-readable character tags
like `clandestine` or `subterranean` that let other systems reason about it.
**Why:** institutions are what give a settlement texture and mechanical hooks — they drive its
economy, its politics, its secrets.

### The NPC (Non-Player Character) — a named person
**What it is:** an individual with a name and a role.
**Made of:** an office or role (the High Priestess, the Harbormaster); a *temperament* and *flaws*
(proud, wrathful, cautious — these are not flavor, they mechanically set how stubborn the person
is); goals; secrets; a possible corruption flag (secretly compromised, or openly so); and a rank.
**Why, and the key rule:** NPCs *tilt* everything around them — a beloved leader makes a coalition
easier to form, a paranoid one makes his court nearly impossible to turn — but per 0.6, the engine
**never resolves their fate.** They are the dials on the machine, never the output.

### The Faction
**What it is:** an organized interest group *inside* a settlement (a merchant clique, a
reformist movement).
**Why:** factions compete for influence and are how internal pressure gets expressed. Crises can
even *spawn* factions (an insurgency, a religious-conversion movement, a slave revolt).

### The Bloc / Coalition
**What it is:** a political alliance *above* the faction level — factions or settlements banding
together.
**Made of:** a capped membership; a "glue" type explaining *what holds it together* — bargained
concessions (seat-held: durable but transactional), personal loyalty (people-held: strong but
fragile when leaders die), shared doctrine, shared fear of a threat, or covert corruption. A
**conspiracy** is simply a bloc that hides.
**Why:** this is how the world does coalition politics — alliances that form on shared interest,
strain, and fracture when a leader dies or a secret is exposed.

### The Court / Ruling Power
**What it is:** whoever governs a settlement — the seat of power.
**Made of:** legitimacy (how secure their right to rule is); a temperament (inherited from the
ruling NPC) that sets how hard it is to make them reconsider a committed course; and a *succession*
mechanism. Here's an emergent gem: because a new ruler brings a new temperament, a succession can
*by itself* shift the realm's whole disposition — the famous "new king, new peace" falls out of
the machine for free, with no special code.

### The Deity & Cult — the faith layer
**What it is:** gods and their followers.
**Made of two pantheons:** the **activated** one (the gods a settlement openly worships — public by
design) and the **latent** one (gods secretly waiting in the wings — the single most tightly
guarded secret in the entire world; strangers must *never* learn a latent deity's name).
Plus: piety levels, contests between faiths, and *conduct profiles* — a mercy-god and a
contract-god will lead their followers to interpret the same event completely differently.
**Why:** faith is a major driver of politics, war, and (soon) how courts interpret each other's
motives.

### The Army / Column / Convoy / Navy — military bodies
**What it is:** armed forces in the field.
**Key idea:** these are *derived* from a settlement's capability — a town doesn't "have" a
standing army object so much as it can *field* one, which then exists as a record with a strict
life story: raised → marching → fighting → coming home (or being destroyed). Rules bind them: a
settlement can field only one army at a time (the "one-army law"); navies follow the same combat
rules as land armies; and — an owner law — **a naval blockade counts as a siege**, starving a port
exactly as an encircling army would. Mercenary companies can *reinforce* an army but never act on
their own.

### The Covert Organization — the shadow layer
**What it is:** thieves' guilds, foreign patrons, cutouts, corruption assets.
**Made of:** the **leash** architecture — influence *purchased* through obligation. A foreign
power gets a hook into a local court by doing it favors it can later call in. These are *scarce by
law* (rare, expensive, slow) so corruption feels like a real conspiracy, not background noise.

### The Resource / Deposit
**What it is:** the raw wealth in the ground — ore, timber, fish, gems.
**Made of:** a frozen base endowment (what the land was born with) plus a Living overlay of
*discoveries* and *depletions*. A first-class distinction: **renewable** (fisheries, timber —
deplete under pressure but recover) vs **nonrenewable** (ore veins — run productive, then decline,
then deplete, then, after a long dwell, are *gone*). A new mine can be discovered organically
(from a terrain-legal hidden pool) or forced by the DM — never from nowhere.

### The Trade Good / Chain / Market
**What it is:** the economy's moving parts — goods, the supply chains that produce them, the
markets and prices they trade at.
**Key idea:** prices are *derived for display* — computed when shown, never fed back into the
simulation (this keeps the player's act of *looking* from changing the world; see endogeneity,
0.6's cousin).

### The Route / Edge — the spatial weave
**What it is:** the connections between places — roads, sea lanes, mountain passes, magical
teleport circles.
**Made of:** a *frozen digest* — a precomputed map of distances, terrain costs, and chokepoints,
sealed at world creation — with Living overlays for seasons (winter closes passes), new sea lanes,
and a *danger field* (**embattlement**) marking where war makes travel deadly.
**Why:** distance is real here. Trade, armies, and news all pay for the ground they cross.

### The Treaty / Term
**What it is:** a formal agreement between powers.
**Made of:** typed terms (tribute, mutual defense, sovereignty guarantees, non-intervention pacts,
and — with the coming reframe layer — restitution); a duration; and *compliance strain* that the
DM can read term-by-term ("the peace holds by two of its five terms; the tribute clause is
fraying").
**Why:** treaties are how peace is structured — and how it visibly falls apart.

### The Claim / Reason — the normative layer
**What it is:** the *justifications* that drive conflict and cooperation.
**Made of:** typed **war reasons** and **peace reasons** (based on the historian Geoffrey
Blainey's theory that wars start from *miscalculation*); **casus belli** (formal pretexts for war,
which the DM can also decree); **grievances** (remembered wrongs, which fade at a rate set by the
population's lifespan — elves nurse grudges for centuries); and **obligations / credit** (debts
with maturity dates, default consequences, and a "hardened lender" memory).
**Why:** this is the layer that makes conflict *make sense* — wars have reasons you can name and
trace.

### The Event / Outcome / Proposal
**What it is:** the things that happen, and the DM's queue of things about to.
**Made of:** canon events (dozens of authorable types), party impacts (the effects of what the
adventuring party does), realm verbs (high-level DM commands like "force a calamity" or "declare a
blockade"), and *queued intentions* — orders the DM has staged but not yet committed, which remain
editable until they fire.
**Why:** this is the seam between the DM's will and the world's mechanics.

### The Condition / Crisis / Stressor
**What it is:** the afflictions and pressures on a settlement.
**Made of:** conditions (plague, famine — with severity that drifts over time); crises (with full
begin-to-end lifecycles); and fifteen types of *stressor* (from banditry to insurgency to
religious conversion), which interact — some counter each other, some compound each other.
**Why:** these are the world's sources of drama and hardship.

### The Knowledge Object — the epistemic layer's citizens
**What it is:** what people *know and believe*, tracked separately from what is *true*.
**Made of:** rumors (each with provenance, recency, and independence — a thing three independent
sources say is more credible than a thing one says); beliefs (each court's banded estimate of some
fact); credibility stocks (a known liar is trusted less); statecraft marks (lies told, spies seen,
things concealed); fog; and misjudgments.
**Why:** this is what makes the world *psychologically real* — see Section 6, the heart of the
whole design.

### The Psychology Object
**What it is:** the momentum behind decisions.
**Made of:** *commitment stocks* (how deeply an actor has publicly committed to a course), *cliffs*
(how hard it is to reverse, set by temperament), and moral drift.
**Why:** it models why powers *double down* — why a court that has loudly committed to a war finds
it costly to climb down, even when climbing down is wise.

### The Narrative Object
**What it is:** the world's self-told story.
**Made of:** chronicle entries, news in a consistent "town crier" voice, history beats, seven
classes of "drama" paced by a *tempo governor* (so the world doesn't produce ten wars at once),
teaching whispers, and an auto-generated glossary.
**Why:** this is how the simulation *reaches the DM's eye* as story rather than spreadsheet.

### The Party, and The DM
**The Party:** the adventurers. Their actions enter the world as events — but the world never
*peeks* at the party to decide how to behave (this is *endogeneity*: the simulation must be
self-driven, not secretly steered by who's watching).
**The DM:** sovereign, and standing *outside* the ontology. They touch the world through exactly
one door: the operation vocabulary (Section 7). Every command is validated, previewed, receipted,
and refusable — and crucially, a DM-forced event is *byte-for-byte identical* to the same event
happening organically (**force ≡ organic**). The DM's dragon-attack and a naturally-occurring one
leave the world in exactly the same state.

---

## SECTION 2 — THE STATE STRATA: how mutable each thing is

Everything a being "carries" lives in one of three strictly ordered layers. This ordering is a
safety architecture — the less something is allowed to change, the more it can be trusted.

1. **Frozen** — never changes after creation: config, dossier, the map digest, the birth
   receipts, and signed history. The bedrock.
2. **Persistent-Live** — changes *only* through the tick engine or DM operations: the world clock,
   the pending orders, and all the "change-note ledgers" (for war, politics, debts, resources,
   and so on). All of these vanish cleanly when empty, and all obey dormancy (0.1).
3. **Derived** — *never stored at all*, always recomputed from the layers below: every display,
   every price, every read-model, the hegemony map, motive interpretations, and all the
   player-safe projections. Because derived truth has no independent existence, it *cannot drift*
   from the real state — it is literally recomputed from it every time.

The takeaway for a newcomer: when you wonder "can this get out of sync?", the answer is architected
to be *no* — the trustworthy stuff is frozen, the changing stuff flows through one narrow set of
gates, and the displayed stuff is recomputed fresh.

---

## SECTION 3 — THE RELATIONAL FABRIC: what binds beings together

Beings are not islands. They are connected by:

- **Typed relationship edges:** allied, trade partner, client, cold-war, hostile — each carrying a
  *warmth* level and a *memory* whose fade rate is set by the population's lifespan (short-lived
  humans forget; elves remember for centuries).
- **War and faith channels:** the specific lines along which conflict and religious influence flow.
- **Named ties (kinship, mentorship):** bounded personal bonds between NPCs that ease or block
  political moves.
- **Dependence webs:** supply chains and trade arteries that make one place *need* another —
  which is exactly what an economic boom rides on and a blockade severs.
- **Hierarchies:** vassal and tribute relationships that stack up into **spheres of influence** —
  and when many such ties cluster under one dominant power, that *is* an empire, which a special
  read-model makes visible ("seven towns pay tribute to Thornwall") so the DM can see — and name —
  the hegemony the map is quietly exhibiting.
- **The corruption web:** the *shadow* fabric — the covert leashes binding courts to foreign
  patrons, invisible until exposed.

---

## SECTION 4 — THE PROCESS ENGINE: the movers that make time pass

When the DM advances the world one week, roughly twenty **movers** run in a fixed, documented
order. Each is independent, each can be switched off (and contributes nothing when off), each rolls
deterministic dice, and each leaves receipts. In plain sequence, a single week does this:

Pressures build, counter each other, and combine → old troubles resolve or deepen → **calamity**
may strike (the system models the *consequences* of a disaster — the death, the ruin — and leaves
the *flavor*, whether it was a flood or a dragon, entirely to the DM) → **generous acts** flow
(aid, loans, gifts — always within the giver's means, never overdrawing them) → **foreign armies**
may intervene in someone else's internal fight → **recovery arcs** run (rebuilding after disaster,
economic booms, golden ages of long peace) → **settlements are born and die** (new steadings from
surplus, death from starvation) → **the ground gives and gives out** (new resources discovered,
old veins exhausted) → **people migrate** → **goods trade** → **contraband is smuggled** → **fleets
sail, blockade, and fight** → **armies mobilize, besiege, grind down, and march home** → **reasons
for war and peace accumulate** (each side reading its own strength truly but its rival's through
belief — the seed of miscalculation) → **treaties strain** → **political blocs form and fracture**
→ **faiths contest** → **lies are told and priced against the liar's credibility** → **rumors
harden into beliefs** (arriving late, fogged, and — soon — slower the farther they travel) →
**commitments deepen and occasionally crack** → **the tempo governor** ensures the week's drama is
paced, not chaotic → **pending orders are routed** to the DM or auto-resolved → and finally **the
world writes its own news.**

Every one of those is a system you can point at, switch on, and read the receipts of.

---

## SECTION 5 — THE LAWS: the constitution and its statutes

Laws are the promises the whole system keeps. There are two tiers.

**The Constitution** (never violated, by anyone, ever):
- **Same-seed byte-identity:** same inputs → identical world, to the byte.
- **Dormancy:** an inactive system changes nothing; absence means the prior state exactly.
- **The premium seam:** paid tiers change what you may *see*, never what the world *is*; the
  simulation itself is blind to who's paying.
- **Endogeneity:** the party observes the world; it never secretly steers it.
- **The first-paint ratchet:** the app's initial load size may only ever shrink, never grow.
- **Bold-over-safe:** within all the above, prefer the real, ambitious architecture over the timid
  patch.

**The Statutes** (the simulation's design laws):
- **Loaded dice:** every random draw is situation-weighted, on a stable key, with receipted
  weights.
- **The counterpart criterion:** every organic mechanism has a DM-forceable twin, and every DM verb
  has an organic origin — and the two are byte-identical (force ≡ organic).
- **The facet law:** custom content is a first-class citizen of every system; the deity system is
  the proof — a homebrew god behaves exactly like a catalog one.
- **The unification law:** where a thing has an opposite, they are *one system running two
  directions*, never two systems. Booms and busts, commitment and reconsideration, grudge and
  gratitude, dark misreadings and bright ones — each is a single mechanism with a sign.
- **Conservation:** people, goods, and wealth all balance (Section 0.4).
- **Scarcity-as-law:** story-grade rare things (corruption assets, motive-reframes) are made *rare
  by rule*, so they feel momentous.
- **Weights never walls:** there is no permanent, inescapable state anywhere in the world. Every
  committed course can be reversed (at a price), every grudge can fade, every belief can crack. The
  world can always surprise you.
- **State never fate:** Section 0.6.
- Plus specific rulings: a blockade is a siege; mercenaries only reinforce; relic ruins are earned;
  disaster and recovery are one cycle; the geographically impossible is impossible; collective
  memory scales with lifespan; the world scales by *locality* (a bigger realm doesn't make each
  town quieter); and — the newest — *facts are frozen, meaning is derived* (Section 6).
- And the display laws: teach through the world's own furniture, never break immersion, and never
  let a raw internal term leak into the fiction a player reads.

---

## SECTION 6 — THE EPISTEMIC ARCHITECTURE: why this world feels alive

This is the deepest idea in the entire design, and the one hardest to find anywhere else. **Reality
exists three times over.**

1. **Truth** — what is actually so. The engine's ground state. The DM's birthright to see.
2. **Belief** — what each court *thinks* is so. This is tracked *separately, per observer.* A
   ruler acts on their *beliefs*, not on the truth — and their beliefs can be *wrong, in both
   directions.* They can overestimate an enemy (and sue for a peace they didn't need to) or
   underestimate one (and start a war they can't win). Beliefs arrive late, through fog, and —
   soon — slower the farther the news must travel. Wars, in this world, begin in *misjudgment*, not
   in truth. And — a confirmed design point — so, rarely, do alliances: an enemy's self-interested
   act, *misread* as kindness, can seed a real friendship. Beliefs are about *facts* today; with
   the coming reframe layer, they will also be about *motives* — why a court thinks another did
   what it did.
3. **Projection** — what each *audience* is permitted to see: a player-safe view, a public view, a
   stranger's view. These are computed *from* the truth but can never leak back to it; the walls
   are enforced twice over.

The magic lives in the *gaps between these layers.* When what a court believes differs from what is
true, that gap is a story — dramatic irony the DM can see and play. A war brewing over a kindness
misremembered as a trap; a peace resting on a miscounted army; two rivals united against a threat
that was never real. No other tool in this space models belief as distinct from truth, and it is
the reason this world produces *stories* rather than *state changes.*

---

## SECTION 7 — THE COVENANT: how the DM touches the world

The DM is sovereign but disciplined: they reach the world through exactly one channel, and that
channel has rails.

**Operations** (the only way to write to the world) → **validation** (each operation is typed and
checked; if there's no valid operation for what was asked, nothing happens — the system cannot be
made to do something undefined) → **proposals** (many changes queue for the DM's explicit yes) →
**the DM's word** (approve, edit, or dismiss — and a dismissal leaves the world byte-identical to
if it had never been proposed) → **application** → **receipts.**

Supporting this: the pending-orders **docket** stays editable until an order fires; the **forecast**
shows the DM *exactly* what the next tick will do, guaranteed identical to what will actually happen
if they commit; refusals are always shown, never silent; the interface teaches through in-world
"whispers" rather than intrusive tutorials; and the glossary is generated from the code itself so it
can never fall out of date.

The planned **AI layer** (the "Surveyor") enters here — and this is the clever part — as *just
another user of this same door.* The AI cannot write to the world directly any more than a human
can; it can only *propose operations*, which flow through the same validation, preview, and
approval. The AI is a translator from plain English into the operation vocabulary — never an author
of the world's state. This is why the AI can't corrupt continuity or hallucinate facts into
existence: it is architecturally incapable of writing state, only of *asking.*

---

## SECTION 8 — THE MORTALITY WEB: everything can die

A closing observation that ties the ontology together: *every* being in this world has a full life
cycle, and everything that ends leaves a trace.

Settlements are born as satellites, grow, and either mature or starve to death — and a fallen
great city leaves a legendary ruin. Institutions are founded, upgraded, absorbed, or destroyed.
Rulers succeed one another, each reshuffling the realm's temperament. Resources are discovered,
worked, depleted, and — if nonrenewable — gone forever. Treaties are signed, strained, frayed, and
broken, breeding resentment. Wars ignite from reasons, mobilize, exhaust themselves, and end in a
peace that itself slowly decays. Grudges are born, fade with the generations, and are either
forgiven or hardened. Beliefs are seeded, reinforced, contradicted, and cracked. Booms are sourced,
built, and either cooled or busted.

Nothing here is static, and nothing that dies is forgotten — because everything that happens leaves
a receipt.

---

## SECTION 9 — THE ONE THING TO REMEMBER

If you retain a single idea from this entire document, let it be this: **the world explains itself,
because the system that built it refuses to do anything without a reason you can read.** Every other
property — the determinism, the three-layer reality, the conservation, the receipts, the loaded
dice — exists in service of that one promise. A DM using this tool is never handed an outcome; they
are handed an outcome *and its entire causal lineage.* That is the whole product, and this ontology
is the map of how it is kept true.
