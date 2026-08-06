# THE FULL ONTOLOGY OF SETTLEMENTFORGE

*An exhaustive, plain-language map of every system and subsystem in the simulation and the generator — what each one is, what feeds it, what it feeds, what it puts on the table in front of a Dungeon Master, and whether it is running today.*

---

> ## ⚠ ERRATA — READ BEFORE THE DOCUMENT
>
> This map was verified against the live code by an independent completeness
> critic after it was written. **One factual error has been corrected in place**
> (system 35, population — the document had claimed a settlement's headcount was
> fixed at generation; it is not, and the correction is verified against the
> running code). The findings below are **verified but NOT yet corrected**. They
> are recorded here rather than silently left, because a map that misstates what
> is *running* is worse than no map.
>
> **The root cause of most of them is one missing word.** The status vocabulary
> has no rung for the estate's most common real state: *"runs only in the three
> world-alive presets."* Entries carrying that state got rounded either up to
> LIVE or down to dark. Adding the rung and sweeping every entry against it fixes
> the whole class at once, and is the first thing a next pass should do.
>
> **Known errors, each verified against the code:**
> 1. **The preset story is unreconciled and a reader will get it backwards.**
>    Seven preset objects exist, but three are legacy (they resolve for old saves
>    and are applied by toolbar chips) while the world-laws dialog surfaces only
>    four. This matters because **the preset that lights the war layer is one of
>    the legacy three** — a reader will otherwise conclude the war layer is a card
>    in the dialog.
> 2. **"The two most active presets" names two different pairs** in different
>    places, and a reader cannot tell which is meant. For the town's
>    decision-maker and supply-web warfare it means one pair; for the rumour
>    network it must mean another, because the war-lighting preset carries
>    *instant omniscient* news.
> 3. **The loops do not say where they stop.** The information loop runs its
>    middle steps in only two presets; in the war-lighting preset it collapses to
>    its first step and then reads a picture that is always true. The corruption
>    loop genuinely ENDS two steps before the exit it advertises. The scarcity
>    loop cannot reach its final two steps in the preset that carries the peace
>    engine but deliberately starts no wars.
> 4. **The growth loop is under-sold.** It is headed "largely unlit," but its most
>    vivid step — a town founding a satellite — runs live in the three world-alive
>    presets, triggered by boom, prosperity, population pressure, and migration
>    the town cannot absorb.
> 5. **No loop names aid or generosity.** The hunger loop walks a famine all the
>    way to a neighbour's opportunism without ever passing through the live layer
>    that decides whether an ally *relieves* it. That is the most human step in
>    the flagship loop and it is missing.
> 6. **Smaller:** the foreign-planting half of corruption is lit by no preset at
>    all and belongs in the dark inventory; the dossier view list omits Traditions,
>    the steadings sections, and market prices; and the "about ninety-four
>    structural census tests" figure is not reproducible as stated and needs its
>    own definition or should be cut.
>
> Everything else the critic checked came back **correct**: the system, loop,
> promise and boundary counts; the thirteen engine-gated switches and their exact
> list; 165 registered operations; the 38-entry product flag registry; 13 faction
> archetypes; 16 grounds for war each mirrored by a ground for peace; the
> nine-phase tick order; and the espionage double-block.

---


## HOW TO READ THIS DOCUMENT

- **Equal weight.** Every system below gets the same four questions answered, in the same order, at roughly the same depth. The rumour network and the calendar get the same treatment. Nothing is "just plumbing."
- **Four fields per system.**
  - **What it is** — the mechanism, in plain words.
  - **Fed by / feeds** — the traceable web. Every named neighbour appears as its own entry somewhere in this document, so the whole graph can be walked.
  - **At the table** — what a DM actually sees, says, or does because this exists.
  - **Status** — whether it runs today.
- **The status vocabulary**, used identically everywhere:
  - **LIVE** — runs in an ordinary campaign with default settings.
  - **LIVE IN SOME WORLD-LAW SETTINGS** — built and running, but only under certain campaign presets (the seven presets run from "Static Campaign," which changes nothing on its own, up to "Full Simulation," which runs everything that can be reached).
  - **LIVE ONCE THE REALM IS MAPPED** — runs, but only after the DM presses the one-time "map the geography" button that freezes the world's distances. Unmapped worlds keep a simpler, distance-free behaviour.
  - **BUILT, NOT REACHABLE** — the code is complete, tested and guarded, and *no* setting anywhere in the product turns it on. Costs a campaign nothing; does nothing.
  - **BUILT, NOT WIRED** — the code is complete but nothing calls it yet.
  - **DESIGNED, NOT BUILT** — a finished architecture with no implementation.
- **The tiers.** THE SUBSTRATE (what makes it a simulation at all) → THE GENERATOR (how a world is born) → THE LIVING SYSTEMS (the domains that run) → THE INFORMATION LAYER (who knows what) → THE SURFACE (what the DM touches) → THE UNBUILT (designed, awaiting build). Then the cross-domain loops, the experience the whole thing is for, the deliberate boundaries, and an honest ledger of gaps.
- **One structural fact to hold throughout.** A large amount of this engine is built, tested, guarded — and switched off. That is deliberate: an unlit subsystem is designed to cost an installed campaign exactly zero, to write no data, to consume no randomness, and to leave the saved world byte-for-byte identical to a world where the subsystem does not exist. "Built, not reachable" is a shipping state, not a failure state. But it means the gap between what the codebase contains and what a DM can currently experience is large, and this document says so at every point where it is true.

---

# TIER ONE — THE SUBSTRATE

*The machinery that makes this a simulation rather than a random generator: one clock, one source of randomness, one causal order, one saved shape, and the instruments that keep them honest.*

### 1. The world pulse — the one-week kernel

- **What it is** — A single function advances the entire realm by exactly one week. It steps the week counter, re-derives its dice from the world's seed plus that week number, then runs every layer in a fixed causal order: what actors remember, what pressures already exist, each settlement's own internal clock, then the war, trade, faith, space and institution planes, then which candidate events are selected, then the application of those events, then the consequences, then the receipt of what happened. It takes a world in and hands a new world out and touches nothing else.
- **Fed by / feeds** — Fed by the world-law settings, the activation gates, and the seeded dice. Feeds the advance orchestrator, the saved world shape, the recorded-causality ledger, and every single living system in this document.
- **At the table** — The DM presses Advance and a week of the world genuinely happened: armies moved, granaries emptied, a council shifted. Not a random-event roll — a re-derivation of the world in an order where cause precedes effect.
- **Status** — LIVE. It is the largest single piece of the engine.

### 2. The advance orchestrator — intervals, pause, resume, background

- **What it is** — Advancing a month, a season or a year is not one large step: it is four, thirteen or fifty-two real one-week kernel calls threaded head to tail. The orchestrator runs them, hands the browser back periodically so the progress bar keeps painting, can stop mid-interval when a decision needs the DM's verdict, resumes from a stored cursor, and can run the whole run in a background thread with an identical result. A registry of "residue" sites guarantees a paused or dismissed major decision leaves no half-written record behind.
- **Fed by / feeds** — Drives the world pulse; driven by the campaign's advance controls; reads the calendar; guarded by the verification estate's pause-and-dismiss equivalence tests.
- **At the table** — "Advance one year" runs fifty-two real weeks with a moving bar, stops to ask about the war it just generated, and picks up exactly where it stopped — and the result is identical whether it ran in the foreground or the background.
- **Status** — LIVE.

### 3. The campaign calendar — integer weeks, a four-four-five year

- **What it is** — One week is the only real unit of time. A twelve-month display calendar is laid over four exact thirteen-week seasons (months of four, four and five weeks), so every month boundary lands on a week boundary and nothing drifts. Date labels are derived from elapsed weeks, never accumulated.
- **Fed by / feeds** — Single-sourced from one dependency-free table read by the world pulse, the orchestrator, treaty clocks, festival windows and the seasons layer.
- **At the table** — The date on the dossier and the season driving the harvest never disagree, and a campaign advanced week by week ends on the identical date as one advanced year by year.
- **Status** — LIVE.

### 4. The seeded dice and the fork tree

- **What it is** — All randomness comes from one seeded generator. Each week mints a child generator from a composite key (world seed, week number, interval), and each layer forks its own named child from that. Around a hundred and twenty named forks exist across the engine, so the war layer's draws can never shift because the weather layer took one extra draw. The fork naming convention is treated as load-bearing vocabulary with its own guard test.
- **Fed by / feeds** — Created by the world pulse; consumed by every system that makes a choice. The seed itself is minted once — the only sanctioned true randomness in the product — and stored on the world.
- **At the table** — The same seed is the same world, forever. Write a seed on a napkin, hand it to a DM across the country, and they get your realm down to the name of the third tavern.
- **Status** — LIVE.

### 5. The loaded-dice discipline

- **What it is** — Nothing in the world is a flat coin flip. Every random decision first computes weights from live state — need, bond strength, supply, legitimacy, exhaustion — and the seeded draw only picks *within* that weighting, on a stable composite key. The tuning constants are the weights; the fork structure is never retuned to change behaviour.
- **Fed by / feeds** — Used by name by the generosity, intervention, naval, espionage, corruption-web, religion and supply-warfare movers, among others.
- **At the table** — Events feel earned. A starving ally who helped you before is nearly certain to be helped back; a comfortable stranger barely registers. Surprise comes from circumstance, not from the die.
- **Status** — LIVE.

### 6. The one clock, and the fail-closed draw

- **What it is** — Two deliberate, documented holes in an otherwise pure engine. Real-world time enters through exactly one function; every domain caller threads an explicit timestamp and only falls back to the wall clock at the outermost boundary, and in tests an unpinned call throws rather than diverging silently. Randomness has the mirror rule: outside a seeded run, the draw helpers throw rather than quietly falling back to unseeded randomness, with one deliberately-named escape hatch.
- **Fed by / feeds** — Every domain module; enforced by the determinism lint layer.
- **At the table** — A saved settlement always regenerates into itself. The failure mode where a stored seed stops replaying its own world cannot ship — it crashes loudly at the offending line instead.
- **Status** — LIVE.

### 7. Determinism enforcement

- **What it is** — Per-layer lint rules forbid ambient randomness, wall-clock reads, host-locale sorting and environment reads inside the generator, domain, worker, kernel and print layers. Because such rules resolve last-wins, a meta-test resolves the *effective* configuration for every file in those layers and asserts the ban is still present at error severity — so a widened rule elsewhere cannot silently delete a determinism ban. A development-only paranoia mode re-runs every background advance in the foreground and compares the two worlds.
- **Fed by / feeds** — Guards the seeded dice, the clock seam and the background-worker path.
- **At the table** — Invisible, and that is the point: the reproducibility promise is held by machinery rather than by discipline.
- **Status** — LIVE (paranoia mode is development-only by design).

### 8. The stage manifest — the declared causal order

- **What it is** — A frozen, nine-phase declaration of what each phase of a week owns and what it must come after. Deliberately *not* a plugin registry: reordering the simulation by editing a list would make behaviour far too easy to change by accident. The kernel remains the execution authority and carries matching in-line stage markers, and a test pins the two against each other.
- **Fed by / feeds** — Documents the world pulse; pinned against the kernel.
- **At the table** — Nothing directly. It is why a newly built subsystem lands in the right place instead of quietly running before the state it reads exists.
- **Status** — LIVE, as a declaration.

### 9. World laws — the rules blob, the presets, and the dark-layer law

- **What it is** — Each campaign carries a normalised set of world laws: how far consequences propagate, how intense they are, whether people migrate, whether the world progresses on its own, how much political autonomy settlements have, and a bank of named subsystem switches — plus seven presets from "Static Campaign" (nothing moves on its own) through "Quiet Local," "Narrative," "Realistic Regional," "Dramatic Campaign," "Living Realm," to "Full Simulation." The normaliser fails closed: a corrupted or forward-dated value falls back to the safe default rather than being coerced on. The constitutional rule is the **virtual key**: an unlit subsystem's switch appears in neither the defaults nor any preset, so it costs an installed campaign zero stored bytes, every gate demands a strict positive, and absence is a complete no-op.
- **Fed by / feeds** — Read by the world pulse at startup, the DM's world-laws dialog, the campaign gates, and the certification census.
- **At the table** — A DM says "run this realm conservatively, and majors need my sign-off," and the world obeys. Campaigns installed before a feature existed never shift under a new build.
- **Status** — LIVE.

### 10. The engine-gated switch manifest

- **What it is** — The cure for a structural blindness. Because an unlit subsystem's switch appears in no declaration, the certification census could not see it, and a whole subsystem could ship completely dead with nothing ever asking. A committed list now enumerates exactly the switches the engine strictly gates on but never declares, and a source-scanning test proves that list in **both** directions: every listed switch is really gated somewhere, and every gated switch is really accounted for. A third arm demands each listed switch carry an authored certification row. The governing rule binds three things into one commit: the manifest entry, the first real gate read, and the certification row.
- **Fed by / feeds** — Joins the world-law settings to subsystem certification.
- **At the table** — Nothing visible. It is the reason a newly built layer cannot be quietly shipped inert.
- **Status** — LIVE. Thirteen switches are listed today — believed-world axes and three believed-world families, commercial grievances, conquest doctrine, espionage, information statecraft, migration rumours, oath-holders, sovereignty trade, strategic posture, and the treaty lifecycle voice — and **all thirteen are unlit by every preset.**

### 11. Activation gates — derived, never stored

- **What it is** — Some subsystems switch themselves on from the world's own contents rather than from a setting. The religion layer wakes the instant any member settlement carries a patron deity or a DM-imposed cult. The gate is read off the computed snapshot, consumes no randomness and writes nothing, so a dormant subsystem cannot perturb the random stream and a hand-edited save cannot fake one on.
- **Fed by / feeds** — Read by the world pulse before the faith layers run.
- **At the table** — Assign a patron deity to one town and its religious life comes alive — no settings trip required.
- **Status** — LIVE.

### 12. The saved shape — versioned state and conditional ledgers

- **What it is** — The world's saved state is a versioned blob with an ordered, migrating shape: bounded history (the last eighty weeks of receipts), bounded proposals, and pending intentions, plus a family of roughly twenty **conditional ledgers** — named containers that materialise only when their subsystem first writes, and remove themselves when empty, in a fixed key order. Additive ledgers normalise from absence without a version bump; genuinely breaking shapes go through an ordered, repeatable migration chain.
- **Fed by / feeds** — Written only through one durable-write seam in the world pulse; read by the store, undo, sync and export.
- **At the table** — A campaign saved before a feature existed loads afterwards unchanged, and a save from a world that never used war or faith carries none of their weight.
- **Status** — LIVE.

### 13. The recorded-causality ledger

- **What it is** — At the single durable-write seam, the engine records each committed receipt's parent-cause identifiers — a real event-to-consequence graph rather than one inferred afterwards from shared names and timing. Structural identifiers and week numbers only; no prose, no names. Capped, and evicted oldest-first.
- **Fed by / feeds** — Written by the world pulse's commit; read by the chronicle graph on the display side, which never imports the writer.
- **At the table** — When lit, the Chronicle can say "this famine caused that coup" as recorded fact instead of a plausible-looking inference.
- **Status** — BUILT, NOT REACHABLE.

### 14. The change-authority contract — what the DM gets to veto

- **What it is** — The written contract for which simulated changes apply on their own and which queue as proposals for the DM. The philosophy: the DM approves the *premise*, and bounded consequences then follow without further pestering. Seven authority classes run from always-automatic to unconditionally-a-proposal, alongside a separate classifier that marks campaign-altering outcomes by their *shape* rather than their severity.
- **Fed by / feeds** — Consulted by coups, conquest, a faction's challenge to the government, foreign intervention, blockades, treaty breaches, sovereignty conveyance, and the multi-week advance orchestrator. Feeds the approval queue on the surface.
- **At the table** — The seat of a town the party cares about never changes hands behind the DM's back — it lands in an approval queue — while the hundred small consequences of a siege they already sanctioned resolve on their own.
- **Status** — LIVE.

### 15. Certification — the honest instruments

- **What it is** — Four layers of instrument. A whole-world **behavioural contract** grades a long soak run's tempo, arcs, motion and attention against conservative floors. A **per-subsystem contract** asks, once per switch, whether that lane actually did anything, and grades one of four verdicts — alive, dormant by configuration, silent, or unobserved — never from a claim, always from a soak receipt's own recorded fields, with broad "the world moved" evidence explicitly refused as proof that *this* lane moved. **Convergence contracts** for war and trade grade endings, durations and force evidence. A **coupling registry** records every cross-layer read together with the receipt field that makes it reviewable.
- **Fed by / feeds** — Reads the world-law settings and the engine-gated switch manifest; fed by the soak runners.
- **At the table** — The product never claims a guarantee it has not measured: the certification panel reads "the long-horizon proving is scheduled" rather than inventing a number.
- **Status** — LIVE as instruments; **the evidence file is deliberately empty** — no soak receipt has been banked.

### 16. The forecast — preview equals apply, by construction

- **What it is** — A forecast clones the world, drains the entire pending queue through the *real* drain, and runs the *real* interval orchestrator over the clones — never a parallel implementation. Clone and discard: it never persists, never stamps a cursor, never emits analytics. Staleness is detected by fingerprinting the complete canonical inputs.
- **Fed by / feeds** — Wraps the advance orchestrator; reads the event queue.
- **At the table** — "Show me what happens if I advance a season" is exactly what will happen, with one honest caveat named in the interface rather than a different code path guessing.
- **Status** — LIVE.

### 17. The verification estate

- **What it is** — Roughly two thousand three hundred test files. About ninety-four are structural census tests that scan the source tree and prove a hand-written manifest against it in both directions. About a hundred are golden files, dominated by **dormancy goldens**: proof that with an unlit subsystem's switch absent, the world serialises byte-identically. Two only-shrink honesty ratchets govern the estate itself — a per-file size baseline that fails if a file grows *or* shrinks without banking the win, and a mutation-coverage manifest requiring every correctness-asserting test to be covered by a planted regression, a written rationale, or a counted, shrinking gap. Per-week operation and scan budgets pin the asymptotic cost of a tick.
- **Fed by / feeds** — Guards everything above and below.
- **At the table** — The reason a five-year-old save still opens, and the reason a new subsystem does not silently change an existing world.
- **Status** — LIVE.

---

# TIER TWO — THE GENERATOR

*How a world comes into being: a seed, a map, a plan, and a pipeline that derives a settlement from its own facts.*

### 18. The generation pipeline

- **What it is** — A settlement is built by named steps that declare their dependencies and are then run in dependency order, each handed its own generator forked from the step's name so one step's draws are isolated from another's. An optional strict mode detects any shared value a step changed without declaring it. Editing a settlement re-runs the whole pipeline at the same seed.
- **Fed by / feeds** — Uses the fail-closed draw context and the seeded fork tree; produces the settlements the world pulse then ages.
- **At the table** — Change one configuration value and the town re-derives coherently instead of drifting into a different town.
- **Status** — LIVE.

### 19. The map — geography without civilisation

- **What it is** — The landmass is drawn by an embedded fantasy-map generator running with its civilisation machinery switched entirely off: no states, no manors, no religions, no provinces. It produces terrain height, coastlines, rivers, lakes and biomes, and nothing else. Landmass shape is locked to a curated set of seven templates — mountainous island, low island, volcanic, peninsula, supercontinent, atoll, and a custom island chain.
- **Fed by / feeds** — Fed by the seed and the chosen template. Feeds placement, the frozen distance digest, and the automatic-placement ground matcher. Deliberately does *not* feed settlement generation directly.
- **At the table** — The DM sees a real fantasy world map with coasts, mountains and rivers, empty of anybody else's kingdoms — their settlements are the only civilisation on it.
- **Status** — LIVE.

### 20. The instant world plan — a seed and four questions

- **What it is** — A pure planner turns a seed and four answers (realm size, tone, map kind, magic or no magic) into a complete build order: how many settlements and at which tiers, which world-law preset the realm runs under, which map template, a scattered set of placement positions, and a separate forked seed per settlement. Realm sizes are authored pyramids: small is five settlements from a town down to a thorp, medium nine with a city at the top, large fourteen topped by a metropolis.
- **Fed by / feeds** — Consumes the seed. Feeds the map, the settlement pipeline (one configuration per slot), placement, and the campaign's world laws.
- **At the table** — Four questions and the DM has a populated region — a metropolis, its cities, its towns and its hamlets, already placed — instead of pressing "generate" fourteen times and arranging them by hand.
- **Status** — LIVE.

### 21. Settlement configuration — tier, population, terrain, route, culture, threat

- **What it is** — The first step of the pipeline settles what kind of place this is: a tier from thorp to metropolis and a population rolled inside that tier's band; terrain weighted-rolled from seven types when left on automatic; a trade route drawn from a pool the terrain itself constrains (a coastal place mostly rolls a port; a mountain place mostly rolls a road or isolation); a culture from eleven; a monster threat level; and a magic level. It refuses to roll a town-or-larger into total isolation unless high magic could sustain one.
- **Fed by / feeds** — Reads the seed and the wizard's settings. Feeds resources, institutions, economy, defence, narrative, the town map, and every derivation downstream. It is the trunk of the settlement.
- **At the table** — Ask for a random settlement and get a coherent one — a coastal town has a port and fishing, not a caravanserai — and the dossier can say *why* each choice was made.
- **Status** — LIVE.

### 22. Resources and the ground's yield

- **What it is** — Nearby resources are drawn from a pool that terrain and route legality permit, so deep-harbour fishing grounds cannot appear inland. Larger settlements are likelier to be born with a resource already partly worked out, on a scale rising with tier from about one in twenty for a thorp to seven in ten for a metropolis. Rare finds — ancient ruins, magical nodes — sit at low fixed odds.
- **Fed by / feeds** — Reads terrain, tier and the DM's own custom content. Feeds the economy, the supply chains, institutions, and the settlement's stress profile.
- **At the table** — The DM gets a reason the town exists — a silver vein, a floodplain, a ford — and sometimes a reason it is struggling, because the vein is nearly played out.
- **Status** — LIVE.

### 23. Placement — putting settlements on the ground

- **What it is** — Two paths. By hand, the DM drops a settlement on a map cell and the position and cell are recorded. Automatically, a one-button placer finds, for every settlement, ground whose terrain actually matches what that settlement was generated to sit on, keeps settlements a tier-scaled minimum distance apart, and rewards closeness to the *third*-nearest neighbour — which builds a connected web rather than a star or a scatter. It proposes rather than acts: a consent panel itemises every move first, and the placer takes no random draws at all.
- **Fed by / feeds** — Reads live map terrain and already-generated settlement terrain. Feeds the frozen distance digest (placements are its seeds), the map overlay, and regional relationship defaults.
- **At the table** — One button lays the realm out sensibly — the fishing village coastal, the mining town in the hills, nobody stranded — and the DM sees exactly what will move before saying yes.
- **Status** — LIVE.

### 24. The frozen distance digest — the keystone

- **What it is** — At the moment the world is canonised, the app takes a one-time, read-only snapshot of the map's terrain cells and computes, once and forever, everything the simulation will ever need about distance. Terrain is quantised into integer travel cost; a single flood-fill outward from every settlement at once carves the map into territories; the cheapest crossing between each pair of neighbouring territories becomes the **gate**, and the road between them; from that comes the full distance table and a neighbour ranking of primary, secondary and distant. Every hop carries a receipt explaining what the terrain cost and why. All arithmetic is integer, so no result can flip on a rounding tie. It is frozen and never recomputed — changing the cost law is a deliberate, versioned re-canonisation, never a silent drift.
- **Fed by / feeds** — Reads the map's terrain cells and the placements. Feeds travel time, army movement, caravans, rumour propagation, migration, supply shipments, envoy routing, roads, satellite founding and the war layer — nearly every physical system reads distance from here.
- **At the table** — "How long until the relief column reaches the siege?" is answered from the actual terrain on the actual map — mountains between them cost real weeks.
- **Status** — LIVE ONCE THE REALM IS MAPPED, for generated maps and premium accounts; an imported or custom-image backdrop stays distance-free.

### 25. Roads and routes

- **What it is** — Three distinct things share the word "road." The map frame can compute drawable road paths across terrain for display. The frozen digest's gates are the engine's actual route truth — where a road geographically *is*. And the DM can charter a route by hand between two settlements they own; its cost is read from the frozen digest rather than invented, and whether it is a land or water route is decided by the world, not chosen.
- **Fed by / feeds** — Reads the distance digest and the sea-lane set. Feeds the roads and travel layer (envoy missions, capture, ransom), the map overlay, and trade.
- **At the table** — Roads that follow the valleys instead of the straight line, and a DM-chartered trade road whose travel time is honestly harder if it crosses a range.
- **Status** — LIVE (the chartered route rides the mapped realm).

### 26. The regional graph — two of them

- **What it is** — At dossier scale, each settlement's neighbour list is promoted into typed links: supplier, rival, protector, tax authority, market hub, refugee source, military threat, smuggling partner and more, each with a direction, a severity, and a plain-language note on how trouble there becomes trouble here. At campaign scale, a second graph records confirmed causal *channels* between settlements — trade dependency, tax obligation, war front, information flow — and the impacts queued along them.
- **Fed by / feeds** — The dossier graph reads neighbour data and feeds the map profile's authority hierarchy and district derivation. The campaign graph feeds regional propagation, the news feed, and the world pulse.
- **At the table** — In one place: who this town answers to, who it feeds, and who it fears — and when the mine upriver floods, the news arrives here with a reason attached.
- **Status** — LIVE.

### 27. The settlement's own ground — site, town plan, and the engine's substrate

- **What it is** — Below the world map is a second, finer geography. The **site** is derived from the dossier's own facts — river, coast, marsh, dunes, mountain flank, plain — and the town chooses how to answer it (exploit the harbour, endure the marsh, fortify the defensible flank over the profitable bank). The economy then lays attractors onto that site, a core nucleates at the ford or the landing, arterials grow from the gates, lanes infill, and districts pull toward the attractors — each candidate layout scored against a legibility rubric before acceptance. Quarters (market, religious, noxious trades, waterfront, shadows) grow from the institutions actually present. Finally a compact **spatial substrate** projects the drawn map into engine terms: per-district flammability and density, a district adjacency graph, wall segments with individual strength, and gates as the soft spots.
- **Fed by / feeds** — Reads terrain, trade route, institutions, economy, governance and stress. Feeds the rendered town map, district profiles, fire, siege and riot mechanics, and the map profile.
- **At the table** — Not "the town has walls" but a drawn town where the tannery is downwind, the manor is on the hill, the wall by the poor quarter is the weak stretch, and a fire in the timber workshops has somewhere to spread.
- **Status** — LIVE.

### 28. The map-to-simulation interface

- **What it is** — A single explicit contract in both directions: what the simulation reads from map-derived configuration (terrain, biome, river and road access, monster threat, region), and what the map should render from simulation state (how important the roads are, how defensible the terrain is, which neighbours this place defers to, which hazards to pin, which features to draw).
- **Fed by / feeds** — Reads configuration, causal state, threat profiles and the regional graph. Feeds the town layout engine and map rendering.
- **At the table** — The map keeps agreeing with the dossier: a high-readiness walled city reads as fortified, and a hazard the dossier lists appears as a pin.
- **Status** — LIVE.

---

# TIER THREE — THE LIVING SYSTEMS

*Eight domains that run once a world exists. Each is a family of systems; each family reads from and writes into the others by name.*

## 3A — THE SETTLEMENT INTERIOR

*One town, read from the inside: its health, its crises, its food, its walls, its crime, its buildings, its streets.*

### 29. The causal substrate — sixteen system readings

- **What it is** — Every settlement carries sixteen health readings, recomputed from scratch whenever anything is asked of it: food, labour, legitimacy, ruling authority, faction power, trade, healing, defence, criminal opportunity, religious authority, housing, infrastructure, magic stability, social trust, economic capacity, and law and order. Each is a nought-to-hundred score plus a plain word (surplus, adequate, strained, critical, collapsed) and a list of the specific things that pushed it either way, each with a sentence of reasoning attached.
- **Fed by / feeds** — Fed by active conditions, faction profiles, supply chains, the food, defence, governance, healing and magic ledgers, the safety profile, the institution roster, and the patron-deity snapshot. Feeds the capacity model, the contradiction detector, district profiles, daily life, institution lifecycle, and the "what changed" comparison panel.
- **At the table** — The DM opens the substrate view and sees "law and order — strained," asks why, and gets "the black market holds a fifth of trade" and "no courts or watch" as named causes.
- **Status** — LIVE.

### 30. The capacity model — supply against demand

- **What it is** — A sharper second lens that splits nine capacities into how much exists and how much is being asked for: labour, healing, defence, administration, food production, transport, religious welfare, craft, magic. The point is that a plague does not reduce the number of healers — it raises the number of patients — and the model says so in exactly those words. Bands come from the ratio, and each capacity reports whether it is worsening, holding or improving.
- **Fed by / feeds** — Reads active conditions, threats, factions, supply chains and all five conserved ledgers. Would feed daily life, contradictions, the counterfactual tool and the regeneration comparison.
- **At the table** — Intended: "Healing went from adequate to strained because demand rose, not because supply fell."
- **Status** — BUILT, NOT WIRED. Nothing outside the domain layer imports it; only its band vocabulary reaches the reference book.

### 31. Active conditions — the persistent crisis state

- **What it is** — Crises are objects that live on the settlement and age. About sixty archetypes exist (plague, famine, siege, corruption scandal, food anchor lost, rebellion, occupation, trade embargo, war drain, war exhaustion, plus reconstruction, boom and flourishing on the positive side). Each carries a severity, a band word, a direction (worsening, stable, easing), an elapsed clock, an expiry, and the list of system readings it presses on. Drift is deterministic: worsening climbs, easing falls, and anything near expiry is forced into a wind-down so crises trail off rather than vanishing at a cliff.
- **Fed by / feeds** — Written by generation-time promotion, by DM events and by the world pulse. Read by the substrate, the capacity model, district tensions, daily life and faction relationships. Mirrored into the saved configuration so a regeneration does not erase a four-month-old plague.
- **At the table** — "The plague has been running four months and is still getting worse" is a fact the engine knows, not something the DM must remember.
- **Status** — LIVE.

### 32. Stressor promotion — narrative tag into engine consequence

- **What it is** — The bridge that turns a narrative stressor tag ("plague onset," "wartime," "infiltrated") into a real condition with engine consequences, through an ordered rule list. Severity is the archetype default nudged by the settlement's own state — a poor, undefended, food-short town generates a worse plague than a prosperous walled one. One condition per archetype, so two plague-flavoured stressors do not double-punish.
- **Fed by / feeds** — Reads the stressor container; writes active conditions; consumed by everything in this family.
- **At the table** — A town generated mid-famine actually reads food-critical everywhere in the dossier, instead of the famine being a line of flavour text.
- **Status** — LIVE.

### 33. The crisis lifecycle — one crisis, three representations

- **What it is** — A crisis exists in three places at once: the settlement's stressor list, the promoted condition, and the roaming world-level stressor that can spread. One module owns every transition — onset, escalation, resolution, undo — and returns all halves together, so the three can no longer drift apart.
- **Fed by / feeds** — DM events, the world pulse, the undo log, and the regeneration overlay records.
- **At the table** — When the DM ends the siege it ends everywhere: the dossier stops showing it, the substrate eases, the roaming crisis resolves — and undo restores all three.
- **Status** — LIVE.

### 34. Disease and plague

- **What it is** — Plague is modelled as a roaming, episodic outbreak with named spread channels (trade routes, migration pressure, service dependency) and named scars left behind (labour scars, healer exhaustion, quarantine distrust). It presses healing, labour and social trust, and resolves faster where healing capacity is high. The DM's plague button and the generic "apply the plague-onset stressor" path deliberately mint the same outbreak.
- **Fed by / feeds** — Conditions, healing and labour demand, religious welfare demand, district tension, and the world pulse's spread machinery.
- **At the table** — The sickness spreads along the roads the caravans actually use, the temple gets busier, the fields go unworked, and people distrust each other for a while after it passes.
- **Status** — LIVE.

### 35. Population, and the demographic engine behind it

- **What it is** — A settlement's headcount CHANGES EVERY PULSE in an ordinary campaign: a live pressure model grows towns under favourable conditions and shrinks them under accumulated pressure, and its own two receipts say so in those words. (The pipeline step named "population" at generation makes the *cast* of characters, not the number of souls — a separate thing.) What is NOT reachable is the richer DEMOGRAPHIC ENGINE beside it: births minus deaths, carrying capacity derived from food, a density ceiling from tier, named characters exempt from the death draw, and the plan system where a crowded town chooses between emigration, imports, infrastructure, promotion, or founding a satellite. Beside it sits a complete births-minus-deaths engine: carrying capacity derived from food, a density ceiling from tier, named characters exempt from the death draw, migration between settlements over the real road network, and a plan system where a crowded town chooses between emigration, imports, infrastructure, promotion, or founding a satellite.
- **Fed by / feeds** — When lit it would drive tier drift, the viability ladder, disease and raid risk, the resource-pressure grounds for war, and the news feed.
- **At the table** — Today: a town's population drifts up in good years and down under sustained pressure, and a severe enough loss reads as mass flight. Lit: a town that outgrows its fields exports people, builds, or starves for reasons the DM can trace to food and land rather than to accumulated pressure.
- **Status** — SPLIT, AND THE SPLIT MATTERS. Population CHANGE is **LIVE** (the pressure model runs in the ordinary tick order). The **DEMOGRAPHIC ENGINE** is **BUILT, NOT REACHABLE** — its switch is absent from the defaults and declared false in every preset. Curiously, lighting it makes the world *quieter* at first: it suppresses the legacy growth path in order to take that job over.

### 36. Food — the ledger, the balance, the granary

- **What it is** — Food is computed as real calories: per-head need against farming workforce, terrain fertility, institutions, and import coverage priced by route type. The result is a surplus or deficit percentage every food-flavoured lens reads from the same place. The granary is a moving stock: surpluses fill it, mild deficits still tithe into it (the lord's stores fill while tables thin), and real deficits draw it down slowly enough to be a multi-session arc rather than a one-week fix.
- **Fed by / feeds** — Feeds prosperity, the food capacity, food security in the substrate, famine conditions, viability warnings, sieges and blockades, and the demographic carrying capacity when lit.
- **At the table** — "Four months of grain in the granary, losing about a month per season under the siege" — a countdown the DM can play against.
- **Status** — LIVE (it runs every week regardless of settings).

### 37. Defence — five separate dimensions

- **What it is** — Walls, garrison, militia, watch, mercenaries and charter halls are scored into five distinct dimensions — conventional military, defence against monsters, internal security, siege logistics and economy, and arcane defence — then combined into a readiness word. Upkeep matters: a poor town cannot sustain the guard it nominally has, and the scores fall accordingly.
- **Fed by / feeds** — One conserved reading point feeds the defence capacity, defence readiness, law and order, and infrastructure condition, deliberately so the same walls are never counted twice.
- **At the table** — "Walls yes, but the garrison is half-paid and there is no siege stockpile" — separable answers instead of one defence number.
- **Status** — LIVE.

### 38. Internal security and law and order

- **What it is** — A reading distinct from military defence. Courts, gaols, watch and magistrates give the law teeth; an authoritarian government concentrates it and a commune or frontier disperses it; black-market capture and a strong criminal faction erode it; a lawful or chaotic patron deity swings it, amplified by local piety. Razed or ruined institutions are excluded — a burned court upholds nothing.
- **Fed by / feeds** — Reads governance legitimacy, the defence ledger's internal score, the safety profile, factions, the institution roster and the deity snapshot. Feeds corruption onset and exposure, district safety, and contradiction detection.
- **At the table** — "The watch is real but the guild owns half of it" reads differently from "there is no watch at all."
- **Status** — LIVE.

### 39. Crime and criminal presence

- **What it is** — A safety profile per settlement: a safety word, prose on how effective the guard is, the specific crime types present, the named criminal institutions, a black-market capture percentage, a description of the economic drag, and crime-driven plot hooks. Crime also opens informal services — fencing, protection, illicit markets — that the services generator layers in.
- **Fed by / feeds** — Feeds criminal opportunity and law and order, district safety, commoner resentments, corruption climate, and thieves' guild strength.
- **At the table** — "Smuggling and protection rackets; the Kestrel Company runs the docks; roughly a fifth of trade never sees a tax roll."
- **Status** — LIVE.

### 40. Corruption — onset, exposure, capture

- **What it is** — Individuals with corruptible flaws can be turned, but only where a criminal institution exists. Onset is a hazard that compounds over time, raised by crime pressure and lowered by security and prosperity; exposure is the counter-force, rising with a healthy town and falling where the guild is strong enough to shield its own. Institutions climb a capture ladder from adversarial through equilibrium to corrupted to captured; an exposure impairs both the criminal institution and the corrupt figure's own house. A patron court elsewhere can plant a covert asset here through a hostile edge or a smuggling corridor.
- **Fed by / feeds** — Reads crime, internal security, prosperity and the patron deity's moral axis; writes institution impairments, faction capture, guild strength, and corruption-scandal conditions.
- **At the table** — "The harbourmaster has been on the guild's books for two years, and the magistrate who could act is his cousin" — and when the scandal breaks it genuinely chills the noble quarter.
- **Status** — LIVE for the local loop; the foreign-planting web is engine-side and campaign-gated.

### 41. Institutions as living stock

- **What it is** — Institutions are not a static list. A stably healthy economy can grow one that fills a missing step in a supply chain; a stably distressed one can close one — cheapest and least necessary first — with hysteresis and clamps so nothing runs away. Separately, every institution gets a three-word verdict: operational, impaired, or shell (standing but unfunded), derived from marks other systems already wrote rather than a second status system. Calamities can ruin them outright, and ruined ones are filtered out of every capacity, law, healing and infrastructure reading.
- **Fed by / feeds** — Economy, defence, healing, law and order, infrastructure condition, district composition, the town map, and building interiors.
- **At the table** — "The mill is still standing but nobody has paid the miller since the flood" — and the town's food capacity reflects that.
- **Status** — LIVE.

### 42. Districts and quarters

- **What it is** — Each quarter is promoted into a structured district: an inferred category (religious, merchant, criminal, noble, industrial and so on), a wealth band and a safety band nudged by prosperity, crime and acute threats, a likely dominant faction, its institutions and services, sensory notes, a current tension pulled from live conditions, a ready plot hook, and its neighbours.
- **Fed by / feeds** — Reads factions, the substrate, conditions and threats; feeds the town map's semantic layout and the map's district cards.
- **At the table** — Click the tannery quarter and get: poor, unsafe, run by the tanners' guild, short of work since the food anchor collapsed, and a hook about a foreman assigning pointless night shifts.
- **Status** — LIVE.

### 43. The physical town — map, massing, interiors

- **What it is** — Three nested scales, all derived at view time from the seed and never persisted. A semantic town layout places the tannery downwind and the manor on the hill and scores its own legibility before accepting a candidate. A massing layer builds each signature building as a silhouette — a cathedral is nave plus transept plus spire, not a box. A per-building interior fits inside that building's own footprint with the entrance on the map-facing edge. A revealed corruption scandal adds a visible evidence room; a covert one adds a DM-only chamber scrubbed from every player-facing export.
- **Fed by / feeds** — Districts, institutions and their status, terrain, walls, active conditions, prosperity, corruption.
- **At the table** — Zoom from the town, to the building, to the room the party is standing in — and the room is inside the building they saw on the map.
- **Status** — LIVE.

### 44. Daily life — eight derived slots

- **What it is** — Eight derived paragraphs: what people eat, what starts at dawn, where they gather, what children are warned about, what commoners resent, what outsiders notice, what nobody discusses, what changed recently — each written from real structural state with clickable references back to the capacity, chain, threat or condition that produced it.
- **Fed by / feeds** — Reads capacities, chains, conditions, threats, factions, history beats, people and the substrate.
- **At the table** — Intended: table-ready colour that is *true* rather than invented.
- **Status** — BUILT, NOT WIRED. The shipped Daily Life tab is a separate surface reading raw generator fields; it does not consume these slots.

### 45. The contradiction detector

- **What it is** — A detector for six structural oddities: an outsized institution for the tier, a town or city with no enforcement at all, high legitimacy sitting beside high crime, a powerful faction with no supporting institution, a substrate surplus over a critical capacity, and an acute threat with no capacity to answer it. Each is classified — invalid, rare but justified, interesting tension, or author-created — with an explanation and consequences.
- **Fed by / feeds** — Factions, the substrate, threats, capacities.
- **At the table** — Intended: "A cathedral in a village of ninety — someone outside is paying for it, and that is your adventure."
- **Status** — BUILT, NOT WIRED.

## 3B — PEOPLE

*The named cast: who exists, what they want, who they know, what they hide, how they rise and fall, and the one thing the engine refuses to decide about them.*

### 46. The cast list — who exists at all

- **What it is** — Every settlement gets a named cast sized by the place: two or three in a thorp, fifteen to twenty in a metropolis. Certain seats are compulsory for the tier (a village must have a mayor and a guard captain); the current crisis adds more (a siege forces a garrison commander); the remaining slots are filled by a weighted lottery over roles the settlement's institutions could plausibly support. Noble and craft-guild roles only appear if a noble or crafts faction actually exists.
- **Fed by / feeds** — Fed by institutions, tier, the crisis picker, the power structure, the world's magic law, and trade-route access. Feeds factions, relationships, power rankings, the dossier, the printed export, and the narrative writer.
- **At the table** — Open a besieged town and the garrison commander is already there with a name, because a town under siege has one.
- **Status** — LIVE.

### 47. The character sheet — temperament, flaw, tell, speech, body

- **What it is** — Each person draws a good trait, a bad trait, a neutral quirk, a physical mannerism and a speech pattern. A deliberate lottery then decides whether the good trait, the bad trait, both, or neither survives onto the sheet — so plenty of people are simply unremarkable in one direction, which is what keeps the flawed ones legible.
- **Fed by / feeds** — Feeds corruption eligibility (only certain flaws are corruptible), the war layer's aggression baseline, the clergy reading that colours a deity's influence, the career ladder's risk appetite, and the personal-growth layer.
- **At the table** — "The reeve is patient and vain, taps his signet ring when he lies, and speaks in half-finished sentences."
- **Status** — LIVE.

### 48. Goals and ambitions

- **What it is** — Two layers. At generation, each person gets a short-term aim and a long-term want, drawn either from a crisis-specific pool (a famine goal reads differently from a siege goal) or a role pool, with the settlement's own trade commodity and dominant faction spliced into the sentence. Then the few most powerful people in town have their short-term goal *replaced* by a structural one derived from the settlement's live condition and whether they sit in the dominant faction or a subordinate one.
- **Fed by / feeds** — Reads crisis types, trade commodity, faction power, food security, legitimacy and criminal capture. Feeds the dossier's goal line, the narrative pass, and the career ladder's dynamic goals.
- **At the table** — Two council members want the same thing, but the one in the weaker faction cannot reach for it the same way — and the tab explains why in a sentence.
- **Status** — LIVE.

### 49. Secrets, private pressure, and the mask

- **What it is** — Every named person carries a secret with stakes. Some are institutional, weighted by whether the settlement actually has criminal, magical or religious infrastructure — no magical blackmail in a magic-free world. Roughly a quarter of the time the secret is instead about another named person in the same town, by name. A separate pass decides how the person *presents*: someone dangerous presents as safe; someone compromised presents as busy and professional. Finally, if a secret mentions a thieves' guild the settlement does not have, the text is rewritten to "a powerful outside interest."
- **Fed by / feeds** — Fed by institutions, crisis and the world's laws. Feeds the criminal secondary affiliation, corruption, the DM-only dossier fields, and plot hooks.
- **At the table** — The quartermaster's secret is about the magistrate, by name — so there is a scene before the DM has planned one.
- **Status** — LIVE.

### 50. Relationships between the cast

- **What it is** — Each person forms two or three ties, chosen by a compatibility score: same category breeds rivalry, similar power breeds contact, certain crisis conditions push specific pairings. Each tie gets an archetype — wary alliance, mutual leverage, old debt, mentor and legacy, bitter history, family complication — plus a strength word and a one-line tension.
- **Fed by / feeds** — Fed by categories, power gap, personality and crisis flags. Feeds faction formation, the relationship cards, the cross-settlement elite bleed, and the ladder's bonds and grudges.
- **At the table** — "Two merchants, bitter history, and neither will say what happened at the river crossing."
- **Status** — LIVE.

### 51. Faction membership — two independent mechanisms

- **What it is** — Two different machines. First, role-keyword matching locks obvious people to obvious factions (a crime lord to the criminal faction), longest keyword winning so "lord" cannot steal "crime lord"; everyone else is assigned by a capacity-weighted draw that steers the roster toward the faction power distribution while respecting which categories can plausibly join which. Second, and separately, factions can be *formed* by finding connected clumps of positive relationships and naming the clump after its commonest member category.
- **Fed by / feeds** — Fed by the power structure, relationships and secrets (a criminal-flavoured secret adds a secondary affiliation). Feeds the career ladder, structural rank, the influence strip on disgrace, oath-holder identity, and the elite bleed.
- **At the table** — The cast groups by faction, and the faction with the most power has the most people in it — because the roster was dealt that way.
- **Status** — LIVE.

### 52. Load-bearing versus flavour — the importance tiers

- **What it is** — Every person is graded minor, notable, key or pillar. Minor people are pure flavour and propagate nothing; a pillar's removal creates an institutional vacuum that needs filling. The record also carries status (active, dead, missing, exiled, retired, removed), what they prop up, how destabilising their absence is, and a list of pre-suggested successors.
- **Fed by / feeds** — Feeds institution impairment, the elite-bleed weighting, the ladder's ordering, and the removal-consequence text.
- **At the table** — Kill the abbot and the app names the institution that just lost its legs — and the plausible replacements.
- **Status** — LIVE.

### 53. The simulated interior — state, alignment, weakness, schemes

- **What it is** — Once a world runs, each named person acquires a simulation record: a role archetype, a nine-value alignment seeded once, a weakness (debt, blackmail, a sick relative, an old crime, a succession claim), and a set of preferred actions. Rules read over settlement pressure then propose what they attempt.
- **Fed by / feeds** — Fed by the roster, corruption, faction power and settlement pressures. Feeds candidate events, news, the ladder, and the dossier.
- **At the table** — "The captain's weakness is an old crime, and the world knows how to use it."
- **Status** — LIVE.

### 54. Compromise and the ouster

- **What it is** — The people-side of corruption. Someone with a corruptible flaw, in a town with criminal infrastructure, can be turned; a foreign court can also plant an asset in another town's cast, but only through a real channel and under strict scarcity. When a corrupt person is publicly ousted, a fresh person is installed in the seat — inheriting role, faction, institution and importance, but with a clean identity and a deliberately honest temperament, so the seat gets a genuine respite.
- **Fed by / feeds** — Fed by flaws, institutions, guild strength, divine disfavour and piety. Feeds settlement legitimacy, criminal capture, active conditions, and news.
- **At the table** — "The harbour master was on the guild's payroll for four years; now he is not, and the woman who replaced him is nervously spotless."
- **Status** — LIVE (the corruption engine, the exposure and the successor installation). The formal verdict layer stacked on top is unlit.

### 55. The contested court — the ladder, contested goals, and personal growth

- **What it is** — Three related engines. The **ladder** gives every faction a persistent rank order: you rise only by displacing the person above, and they fall when you do — no titles are invented, and every promotion has a named loser. Standing is a slow-moving stock, mounting a challenge weakens your own defence, and a court seals for roughly two years after a succession. **Contested goals** let two named people discover they want the same thing and settle it head to head. The **growth layer** lets lived events — a betrayal, a famine, a golden age — slowly deposit pressure until a person rarely acquires a *new* trait layered over their authored core, which is never overwritten; unreinforced traits fade again.
- **Fed by / feeds** — Fed by faction power, personality and flaws, settlement readings, memory horizons and credibility. Feeds power and legitimacy modifiers, news beats and the dossier.
- **At the table** — "The steward you met two years ago is now second in the guild, and the man he displaced is still in the room."
- **Status** — LIVE by default for the ladder and growth; the contested-goals adjunct and per-person credibility are separate and unlit.

### 56. The consequence economy — durable identity, verdicts, circulation, replacement, residency

- **What it is** — The largest people subsystem in the codebase, and it is switched off. Roster positions break on a reroll, so at the first cross-settlement consequence a person is issued a permanent world identity. A court then reaches a verdict from a closed four-word vocabulary (jailed, banished, turncoat, criminal founding); influence is stripped from *both* places the person is stored so a reload cannot resurrect it; the vacated seat is emitted as a contested opening rather than quietly refilled; a banishment writes a door-shut edge. Displaced people become roamers, lodge in real towns, drift slowly in character while they wander, and are admitted or refused elsewhere *on what that town believes* rather than on global truth — so a wanderer can outrun their story. Fresh replacements are drawn with a small, documented bias toward the settlement's own character, deliberately blind to the existing cast so corruption cannot breed itself.
- **Fed by / feeds** — Fed by corruption exposure, verdicts, settlement destruction, the growth vocabulary and the population floor. Feeds the wanderers register, the dossier's unaffiliated section, the news feed, and population reconciliation.
- **At the table** — "The disgraced tithe-clerk you exiled turns up six weeks later in a town far enough away not to have heard — and they take him in."
- **Status** — BUILT, NOT REACHABLE. The switch is declared off deliberately so the certification census can see it.

### 57. The DM's three verbs over a person

- **What it is** — The engine never kills, permanently exiles, or otherwise ends a named person. Every lane produces a *state*: a verdict is a state, roaming is a state, a shut door is a state. Exactly one function in the entire estate can remove a soul from the world ledger, and it is wired to a button a DM presses. Three verbs: **assign** (settle a wanderer, which may sovereignly override a town's own banishment — and the override is named on the receipt), **kill** (the only death in the system), and **pardon** (lift the edicts). Each returns a typed inverse that replays exactly what it disturbed, and each lands as full-address news in a small ruling register the realm paper reads back. The verbs refuse mid-advance rather than write something that would ghost.
- **Fed by / feeds** — Feeds the wanderers door, the ruling register and the dossier. Held out of every player-facing projection by two independent mechanisms.
- **At the table** — The world will ruin a person, corner them, and strip their office — but it will never tell the DM they died. That sentence is the DM's, it takes one click, and it can be taken back.
- **Status** — BUILT, NOT REACHABLE (rides the consequence-economy switch; the interface self-hides). The *doctrine* is live everywhere else — the ladder, contests and credibility each restate it as binding law.

### 58. Bounded person editing

- **What it is** — A DM can change four things about a person from closed dropdowns — alignment, temperament, role archetype and goal — plus shelve them with a typed reason. Free text is structurally impossible. Every change queues into the pending-changes bar and targets the person's durable identity, so reordering the roster between review and commit cannot redirect the edit onto someone else. Declared values beat generated ones; an unedited world is byte-identical.
- **Fed by / feeds** — Temperament and goal edits sync into the live fields the engine and dossier read; alignment and role edits currently write the declared value only.
- **At the table** — Make the priest lawful evil from a dropdown, preview it, commit it — and the corruption engine reads the change next week.
- **Status** — LIVE.

### 59. Pinned people

- **What it is** — A DM pins specific people on a save. Pinned identifiers ride along with every narrative request and the refinement pass filters them out before building its payload, so pinned people come back byte-identical across regenerations. Pins persist per save and are remapped when a roster reroll would otherwise strand them.
- **Fed by / feeds** — Reads the roster and the narrative pipeline; feeds regeneration preservation.
- **At the table** — Pin the two people the party has actually met, and regenerate everything else without losing them.
- **Status** — LIVE.

### 60. Cross-settlement personal ties

- **What it is** — Personal relationships between important people in *different* towns bleed upward into relations between the towns themselves, weighted by who the people are — two feuding nobodies are noise by law. A completed act of generosity deposits a gratitude bond from the receiving court's ruling seat toward the giving court's; debt and friendship are tracked separately and decay on different clocks. Treaties can additionally be stamped with *whose* oath they were, which makes the heir-who-breaks-his-father's-oath question askable.
- **Fed by / feeds** — Reads the cast, the ladder, ruling power and treaties. Feeds relationship drift, peace decisions and the treaty document.
- **At the table** — Two realms drift toward war partly because their chancellors loathe each other personally.
- **Status** — BUILT, NOT REACHABLE / partial. The elite bleed rides an unlit cohort; the oath stamp resolves to a durable identity for very few people today.

## 3C — POLITICS AND GOVERNANCE

*Who rules, how they lose it, who is manoeuvring against them, and how a town makes up its mind.*

### 61. Faction archetypes — the one classifier

- **What it is** — Every faction in the world is sorted into one of thirteen kinds: government, noble, military, merchant, religious, criminal, arcane, craft, labour, outsider, occupation, civic, other. An authored category wins; otherwise the name and description are read against an ordered rule list where the first match sticks. This exists because four separate layers used to guess a faction's kind with their own vocabularies, and the same guild could read as criminal in one and civic in another.
- **Fed by / feeds** — Feeds the coup contest, faction competition, the war seat books, the aggression disposition, the government-label generator, and the arcane-identity detector. Nearly every governance system starts by asking this question.
- **At the table** — Rename "The Copper Hand" to "The Copper Hand Trading House" and that faction starts behaving like merchants everywhere at once — coup odds, preferred government, war appetite — instead of in one panel only.
- **Status** — LIVE.

### 62. The governing seat and how rule changes hands

- **What it is** — A settlement's government is a persistent body whose name doubles as its type. What a transfer changes is the *authority behind* that body: the seat is relabelled to the new power's preferred government form for that settlement's size, the winner ascends, and legitimacy reseeds according to *how* it happened. One code path with two entrances — the simulation's coup verdict, and the DM's own change-of-power event.
- **Fed by / feeds** — Fed by coups, conquest and occupation authority, and the DM's event composer. Feeds legitimacy, the ruler's books, the faction roster writer, faction renaming, and the "previous governments" history that lets the engine tell a real succession from a cosmetic rename.
- **At the table** — When the Iron Compact overthrows the council, the town's government line changes from "Town Council" to "Military Council," the new rulers gain faction power, and legitimacy starts lower than an election would — with no DM editing.
- **Status** — LIVE. Of five recorded causes, the engine only ever produces coup, conquest and appointment; election and succession exist solely as DM choices.

### 63. Coups — the contested seat

- **What it is** — When a brewing coup resolves, that resolution *is* the verdict. The contest is recomputed from live settlement state at the moment it fires, not from a snapshot taken when the coup began, so everything the party did in the intervening weeks genuinely moves the outcome. The ruler either holds — purges and loyalty tests follow — or falls, and the seat transfers. Each faction archetype carries its own coercion weight: soldiers stage coups better than dockworkers.
- **Fed by / feeds** — Reads faction archetypes, legitimacy, the career ladder's effective power, war sentiment and foreign intervention. Writes into the ruling-power transfer, the stressor machinery and the DM approval queue.
- **At the table** — "You spent three sessions shoring up the magistrate's legitimacy — the coup fails, and now there are purges." And if the DM has locked the governing faction, the fall becomes a proposal to approve rather than a thing that simply happens.
- **Status** — LIVE. One sub-term — tribute drain feeding a coup's footing — is unlit.

### 64. Legitimacy — the conserved quantity

- **What it is** — One number, nought to a hundred, for how legitimate the ruling order looks to the public. Four lenses used to read it slightly differently and one was reading the wrong shape entirely; this is now the single reading point, with each lens still applying its own weighting. Governing-faction *power* is deliberately not folded in — that is a different notion.
- **Fed by / feeds** — Read by the causal substrate, the capacity model, volatility, the coup window, the government-challenge rule and the commons' voice. Written by ruling-power transfer, generosity, upswings, momentum, time progression and sovereignty transfer.
- **At the table** — A single "how shaky is this government" reading that every other panel agrees with, and which visibly moves when the party does something about it.
- **Status** — LIVE.

### 65. Faction competition — the live internal contest

- **What it is** — Factions inside a settlement each sit on a power base — wealth, manpower, doctrine, blackmail, bureaucracy — and pursue a fixed menu of moves against each other: challenging the government, capturing or suppressing an institution, bolstering services, pushing a law preference, contesting a rival. Each archetype also has a preferred form of government it pushes toward.
- **Fed by / feeds** — Reads faction archetypes, the belief map's governing coalition, the cast (seating named people into factions), and the faction-pair grudge ledger. Feeds settlement politics, corruption, the assize, and the war-decision incident selector.
- **At the table** — The temple and the merchants' guild are visibly jockeying — one captures the granary, the other gets a law changed — and named people are the ones doing it.
- **Status** — LIVE by default (off only in the quietest preset).

### 66. Settlement politics — blocs and conspiracies inside the walls

- **What it is** — Coalition machinery played at faction scale inside one town. Factions form blocs bound by concession, patronage, doctrine, threat or compromise, toward an end (seats, doctrine, commerce, survival, a patron). Blocs are sticky to form and carry *strain*; a strained bloc becomes the war party. Under an autocracy the bloc is instead a covert conspiracy against the seat. At most three per settlement.
- **Fed by / feeds** — Reads faction competition, treaty orientation, war fronts and mobilisation. Feeds the town's decision-maker (a ruling bloc loads the town's weights toward its own end), the corruption web (a divided court is cheap to corrupt, a consolidated one dear), the career ladder's political windows, and the ruler's books.
- **At the table** — "The Ironmongers and the Harbour Watch have stood together since the siege — while they hold, this town will not sue for peace." The DM-only view names the conspiracy the players cannot see.
- **Status** — BUILT, NOT REACHABLE. Wired to five consumers and lit by no preset.

### 67. The town's decision-maker

- **What it is** — Once a week each settlement enumerates the moves legally open to it, scores each, and *samples* one — so the strong move is likely but not certain. The four base moves are defend, hold, deploy, and sue for peace; where political depth is live, the governing seat's archetype swaps in its own objectives and its own non-war levers (a merchant polity scores rerouting, embargo and credit; a church scores missionising and legitimacy; a warlord scores prestige). An emergency recall home overrides the sample entirely and cannot be outbid.
- **Fed by / feeds** — The single biggest consumer in the politics family. Reads the relationship graph, pressure, disposition, deity pressure, war fronts, martial rust, the belief map (so a town acts on what it *believes* about neighbours), the war and peace reason ledgers, extraction economics, the corruption web, and, when lit, the ruling bloc's load.
- **At the table** — Neighbouring towns act on their own initiative for reasons the DM can read back: "Kettering marched because it believed you were weak, and its merchant council wanted the river tolls."
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (the two most active presets); off by default.

### 68. The disposition ledger and its four channels

- **What it is** — One ledger shape used three times: a settlement's aggression memory, a deity's fortunes, and a court's risk appetite. The extended form tracks four learned channels — martial, mercantile, diplomatic, insular — each a stock only *resolved outcomes* can move, decaying toward neutral over a twenty-year half-life. Crossing a band mints a news line. Readings happen when candidates are built and writes happen after they are applied, so a contest resolved this week only colours behaviour from next week.
- **Fed by / feeds** — Fed by war resolution, trade contests, occupation outcomes, treaties kept or broken, mediation, and coalition settlements. Feeds the decision-maker's thresholds, war termination, coalition refusal, peace terms, sovereignty intent, and the posture reading.
- **At the table** — "This town has lost three wars and now recoils from a fourth" — stated in words, not a hidden number, with the news feed naming the week it changed.
- **Status** — The legacy aggression score is LIVE; the four learned channels are BUILT, NOT REACHABLE.

### 69. Strategic posture and learned risk appetite

- **What it is** — Two readings over the same ledger. **Appetite** is a court learning, from resolved outcomes only, how much risk it has come to stomach — a war won or lost, a covenant kept or broken, a venture that paid or did not — and forgetting again over a few years. **Posture** weighs up to four terms (remembered standing, the disposition channels, learned appetite, and the ruler's books) into a bounded colour on any decision, capped at a fifth either way, plus a sentence naming exactly which terms it heard and which said nothing. A missing term is *dropped*, never voted as neutral.
- **Fed by / feeds** — Reads only the disposition ledger, deliberately: its whole import surface is one state read plus one arithmetic helper, so it structurally cannot name a target, reach a neighbour list, or select a victim. Intended consumers are the war and trade decision layers.
- **At the table** — When lit and wired: "This court's posture reads marked, weighed from its disposition channels and its learned appetite. Nothing was heard from its ruler's books."
- **Status** — BUILT, NOT REACHABLE **and** NOT WIRED — nothing calls it, and two of its four terms are structurally absent today.

### 70. The ruler's books

- **What it is** — A war decision is made by a legitimate seat, not an abstract town. This resolves who that seat is and splits the decision between the realm's books, the ruler's private books, and — for an exactly matched foreign asset — a covert patron's books. It deliberately excludes display names, so a rename can never look like a succession.
- **Fed by / feeds** — Reads the governing faction, the career ladder, legitimacy, corruption's foreign assets, distance, and (when lit) court consolidation. Consumed by nine war and diplomacy systems: termination, coalition decision and refusal, peace terms, sovereignty intent, envoy interception and negotiation, and army transit.
- **At the table** — "The duke will not spend his own coin on this war, but the realm's treasury will bear it" — war decisions that read as a person's choice.
- **Status** — LIVE, but war-scoped only; there is no general-purpose seat-books reading.

### 71. The commons' voice

- **What it is** — The unnamed crowd as a named collective actor, on a three-rung escalation — petition, gathering, riot-band — filling the gap between grumbling and revolution. It invents no new writers: every consequence routes through machinery that already exists.
- **Fed by / feeds** — Reads legitimacy, unrest and the stressor machinery; writes legitimacy, stressors, and faction resentment.
- **At the table** — "Three hundred farmers are at the gate with a petition" as an actual escalating world event.
- **Status** — BUILT, NOT REACHABLE.

### 72. The assize — the seated public judgment

- **What it is** — Turns an existing corruption or lie exposure into a seated public judgment: a courtroom scene with a real cause, whose verdict levies fines through the generosity ledger, raises faction resentment, relieves unrest, and lifts or dents legitimacy.
- **Fed by / feeds** — Reads corruption exposure and faction competition; writes legitimacy, the faction-pair ledger and the career ladder's stigma marks.
- **At the table** — "The magistrate you exposed is tried in the square on Thursday" — a scene with prepared stakes.
- **Status** — BUILT, NOT REACHABLE.

### 73. Hegemony — empire as a pattern, never an entity

- **What it is** — The engine mints no empire object. A hegemony is *derived* each time from treaty topology: a centre holding enough subordinate ties (tribute, compelled alliance, puppet seat, occupation) forms a sphere. When the edges dissolve the empire simply stops matching — no death event, no persistence, no undo burden. It is descriptive always; only the DM christens it.
- **Fed by / feeds** — Reads the treaty ledger. Feeds the fear-of-dominance grounds for war through a *belief*-side strength reading, so a town fears the empire it believes in, and feeds the realm dashboard and briefs.
- **At the table** — "Seven towns pay tribute to Thornwall" appears in the realm brief without anyone declaring an empire, and disappears when the tribute stops.
- **Status** — LIVE.

### 74. Faction capture

- **What it is** — A five-rung ladder — none, adversarial, equilibrium, corrupted, capture — driven by whether a faction's seat-holders are corrupt and how senior they are; security and prosperity push it back. It is the covert twin of the bloc layer.
- **Fed by / feeds** — Reads corruption and the cast; feeds law and order, legitimacy, and the criminal economy.
- **At the table** — "The watch is not merely bribed; it belongs to them now."
- **Status** — LIVE.

### 75. The DM ruling register

- **What it is** — A small single-writer ledger for rulings a DM hands down by button — deliberately not minted as a simulated pulse (a button press is not an advance) and deliberately not written into the world news feed (that would be a second writer on someone else's record). Absent while empty, dropped when the last ruling is withdrawn.
- **Fed by / feeds** — Written by the DM's person verbs; read back by the realm paper.
- **At the table** — The DM's own decrees appear in the world's own paper, in the world's own voice.
- **Status** — LIVE.

## 3D — DIPLOMACY AND TREATIES

*What two courts owe each other, how that is written down, how it is broken, and who carries the message.*

### 76. The treaty instrument and its term catalogue

- **What it is** — When a war ends by negotiation rather than conquest, the engine writes an actual document: two named courts, a list of promises, a price paid out of a budget earned by how decisively the winner *believed* it won, and a hard expiry on every clause. Eleven kinds of promise exist — tribute, reparations, restitution, a share of a named export, a compelled alliance, disarmament, a non-aggression pact, a continued occupation, an installed puppet seat, an intelligence-disclosure clause, a pledge of non-intervention, and a cession of a settlement. At most one promise per family, so a treaty cannot demand two economic tributes.
- **Fed by / feeds** — Fed by the war layer (a war must have de-escalated with a recorded suing for peace), the relationship graph, the belief map (the winner appraises what the loser *appears* to own), and alignment (an evil court presses harder). Feeds the granary and food ledger (tribute really moves grain), mobilisation (a disarmament clause caps war footing), the war chooser (a non-aggression pact zeroes appetite for that pair), the occupation ladder, and the news feed.
- **At the table** — "Thornwall and the Vale, signed year four — tribute, a quarter of the treasury, six years remaining; the wagons are rolling as the treaty promised." Clauses have teeth: the loser's granary genuinely drains each week.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (wherever the war layer and the peace engine both run).

### 77. Compliance, the fog, and default

- **What it is** — Every clause carries two states: what the loser is actually doing, and what the winner can *see*. A strained loser under-delivers; whether the winner notices depends on its reach — spies, roads, neighbours. Sustained strain breeds resentment on the relationship edge, and a full default becomes a fresh, typed reason for the next war.
- **Fed by / feeds** — Reads the belief and monitoring reach; writes relationship resentment, the war reasons ledger, and the news feed.
- **At the table** — "The tribute is late again — Thornwall's court does not yet know." Six months later the DM has a receipted reason for a new war and a chronicle line explaining it.
- **Status** — LIVE.

### 78. Deliberate repudiation

- **What it is** — A DM can have a court publicly tear up a live pact. Every still-running promise in that document defaults at once; the broken shell stays readable until its original horizon so the grievance it creates is legible.
- **Fed by / feeds** — Routed through the realm-verb and approval lane; writes the treaty ledger, the disposition ledger, and the war reasons ledger.
- **At the table** — A menu item — repudiate a treaty — with an honest refusal when no live pact exists, and a betrayed court that immediately has grounds for war.
- **Status** — LIVE (same settings as the peace engine).

### 79. Treaty orientation — who owes whom

- **What it is** — One small reader answers, for any treaty, which party hands the holding over and which bears the promises. In a war settlement the loser does both. In a *sale* the seller hands over the town but the **buyer** pays — the mirror. Every consumer asks this reader rather than guessing from fields.
- **Fed by / feeds** — Read by enforcement (disarmament caps, occupation rights), the treaty document display, and the pact-grammar voice.
- **At the table** — Sale deeds and war settlements read correctly in the same panel; a buyer is never called a victor, and the wrong court is never named as the one who owes.
- **Status** — LIVE (its sale branch only fires when the sovereignty market is lit).

### 80. The pact grammar — treaties that speak

- **What it is** — Two moments the engine has always executed silently learn to talk: when a spent pact is retired ("it ran its term; the road between them is open again"), and when a court *first notices* a partner slipping out of compliance. An undetected cheat mints nothing — an unbelieved betrayal is not yet a story.
- **Fed by / feeds** — Reads the treaty prune step and the compliance crossing; feeds the news feed and the dossier's DM-only true-state chip.
- **At the table** — News entries at the two moments that matter, in band words rather than numbers ("an old pact, thirty years standing"), plus a DM-only chip showing the truth behind the appearance.
- **Status** — BUILT, NOT REACHABLE.

### 81. Oath-holders — whose oath was it

- **What it is** — A treaty records the *person* who swore it: the seated ruler of the governing faction, resolved through sanctioned helpers and stamped at all three places a treaty can be minted. It moves no number — compliance is unaffected by whose name is on the parchment, and a dead oath-holder voids nothing.
- **Fed by / feeds** — Reads ruling power, the career ladder and the person ledger; writes the treaty document.
- **At the table** — When lit, a signature line on the deed — "sworn by Ser Halvard of the Grey Chair" — which is the prerequisite for the future story where an heir repudiates his father's oath.
- **Status** — BUILT, NOT REACHABLE. The durable person identity resolves to nothing for most people today, so it is a preference rather than a gate.

### 82. The sovereignty market — settlements bought and sold

- **What it is** — A court under demographic pressure looks at what it holds and asks whether to sell. Only things the ledgers already say someone *holds* are tradeable — a parent's chartered steading, or an occupation that has climbed all the way to vassalage. A free settlement is not a commodity, and a DM-placed settlement can never be reached. A clearing sale mints a real treaty with the cession on one side and a bundle of ordinary terms as the price; a swap is two treaties bound by one identifier, and neither mints unless both do.
- **Fed by / feeds** — Fed by the demographic pressure ladder (the trigger), the belief map (a buyer appraises a town it may never have seen, on four believed legs: size, granary, position, trend), the satellites and occupation ledgers (where the row actually moves), the treaty ledger, the envoy layer, and a fifteen-kind news corpus.
- **At the table** — "Greyford could not feed itself and sold Millbrook to the Vale for eight years of grain." A DM can also force it by decree. When nothing clears, the world says so honestly: "the Vale would not take what Greyford could bear to give."
- **Status** — BUILT, NOT REACHABLE, and additionally blocked: its own lighting condition depends on an evidence wave that has not been built.

### 83. Occupation, vassalage, overlordship

- **What it is** — A conquered settlement becomes a stateful relationship that climbs or slides: contested, unstable, extractive, stabilised, vassalised, with a mandatory dwell at each rung so nothing flips in a week. Holding it costs the occupier a garrison burden that grows with every additional holding, and a fresh conquest yields essentially nothing. Reaching the top rung converts the occupation into a formal vassal edge on the relationship graph, which then cascades — a new vassal's old alliances can be dragged into the overlord's wars. The occupier's take is capped per occupation *and* capped in total, so conquest cannot snowball.
- **Fed by / feeds** — Fed by the siege verdict and treaty enforcement (an "occupation continues" clause keeps a garrison standing after the army goes home). Feeds the relationship hierarchy, war exhaustion's burden side, faith pull, resistance and revolt, the returning-army liberation path, and the sovereignty market (only vassalised holdings are sellable).
- **At the table** — Per settlement: who holds it, how firmly, how angry the population is — plus the moment a town bends the knee and its alliances rearrange around its new overlord.
- **Status** — LIVE wherever the war layer runs.

### 84. Alliances, patrons, clients — the standing relationship graph

- **What it is** — The everyday diplomacy layer. Every pair of settlements carries a typed relationship — neutral, trade partner, allied, patron, client, vassal, rival, cold war, hostile, criminal network — which drifts on its own from trade volume, shared recovery, aid given, overburdening and betrayal.
- **Fed by / feeds** — Feeds the war chooser, coalition calls, the peace engine's appraisal of a loser's ally network, trade flows, and the news feed.
- **At the table** — The realm map's relationship lines change on their own with a receipted reason: "years of grain trade have made them allies."
- **Status** — LIVE by default in every preset except the static one.

### 85. Coalitions — calls, joins, separate exits, ratification

- **What it is** — Allies can be called into someone else's war, recorded as a single closed anchor rather than a membership list. At the peace table a war-weary member with weak ties to its co-besiegers can peel off and buy its own lighter peace, leaving the others; the deserted allies hold a typed grudge and the deserter carries a credibility discount. A term sheet an envoy carries home binds nothing until it is ratified at two levels: each member votes its own picture, then a weighted coalition majority can overrule its own member's ruler — and the overruled seat is named on the receipt. A derived per-member bill records what the war cost each participant, apportioned among losers and divided among winners with pairwise transfers.
- **Fed by / feeds** — Reads the relationship graph, the war layer, the ruler's books and the obligations ledger; writes treaties, disposition learning and news.
- **At the table** — The classic betrayal beat — "Ashmoor made its own peace and left the siege" — with the resentment written down as a future cause of war.
- **Status** — BUILT, NOT REACHABLE (its ratification half additionally needs the envoy layer). Coalition *sieges* — several besiegers converging on one target — are live.

### 86. Envoys, errands, interception, captivity and ransom

- **What it is** — A real named person leaves one court carrying a frozen picture of the world, travels the actual road network a week per leg, arrives, parlays, and must travel home again — and terms only take effect on arrival. On the road the envoy can be intercepted; the interceptor may parlay on its own account, imprison the traveller, or shop the terms elsewhere. A held envoy becomes a ransom claim priced only after a dwell, and both the demand and the reply have to travel — so the home court's default state is silence.
- **Fed by / feeds** — Reads the route network, named-person transit, the person ledger, and the rumour pipe (a traveller's picture can shift one step when a rumour reaches him). Feeds the peace engine (the carried term sheet is the alternative road to a treaty), coalition ratification, and the news feed.
- **At the table** — "Your envoy left for Ashmoor three weeks ago. Nothing has come back." A genuinely playable hook: the party can be the escort, the interceptor, or the rescue.
- **Status** — BUILT, NOT REACHABLE, plus five unlit prerequisites.

### 87. The treaty and occupation reading room

- **What it is** — The Treaties view of the realm inspector renders every treaty as a document in the herald's voice, marking the clause that will tear first; the occupation reading appears in the settlement dossier, session mode, the realm dashboard and the printed export. Both are pure lenses: they read the ledgers and compute nothing.
- **Fed by / feeds** — Reads the treaty and occupation ledgers only.
- **At the table** — Everything above is legible without opening a spreadsheet: party pills, a compliance chip per clause, a fraying warning, and the same facts in the printed export.
- **Status** — LIVE (the view self-hides when the ledger is empty).

## 3E — WAR

*Why a war starts, who marches, what it costs, how it is fought, and how it ends.*

### 88. Grounds for war — the reasons ledger

- **What it is** — Every settlement keeps a running, typed case for war against each neighbour. Sixteen named reasons — grievance, revanchism, resource pressure, treaty default, encirclement, legitimacy hunger, exposed corruption, foreign clash, fear of dominance, ingratitude debt, dependency by design, opportunism, sacred claim, lineage claim, alliance obligation, atrocity answer — are recomputed from current world state each week, each with its own receipt sentence and the week it first stood. Every reason for war has a mirrored reason for peace, enforced by a structural test, so the two sides can never drift apart.
- **Fed by / feeds** — Fed by relationships, grievances, deities, corruption, demographics, hegemony and treaties. Feeds the decision-maker's willingness to deploy, war termination, peace terms, and the news feed.
- **At the table** — A reasons panel beside any hostile pair listing why these two are at each other's throats and why they might stop — with the dramatic-irony line "four of six peace reasons now present; this war is dying."
- **Status** — LIVE.

### 89. The march decision

- **What it is** — A settlement's seat deliberates over roughly six legal moves each week and picks one by weighted sample. When it picks "march on this rival," it leaves a dated order naming that target; the single war opener consumes that order the following week. The order can waive a soft confidence pre-filter but never the hard gates.
- **Fed by / feeds** — Reads the reasons ledger, disposition and exhaustion. Writes into the deployment opener only.
- **At the table** — The war that starts is the war the ruler chose, against the rival the fiction named — not whichever neighbour sorted first alphabetically.
- **Status** — LIVE (wherever the decision-maker runs).

### 90. Mobilisation posture

- **What it is** — A settlement cannot lunge from peace into a siege. It climbs peace, alert, war preparation, mobilised over several weeks, then deployed; a long war pushes it into war exhaustion and back down through demobilising. Ramp speed depends on temperament, economy, legitimacy and patron deity; strain, famine or a leadership change cools it back down.
- **Fed by / feeds** — Consumes economy, legitimacy, food, deity and disposition. Feeds the deployment gate and readiness caps. Peace treaties can cap it through disarmament clauses.
- **At the table** — Weeks of visible warning before a war: a neighbour's war footing is something the party can see coming and try to stop.
- **Status** — LIVE.

### 91. What an army is worth

- **What it is** — A structured military capacity per settlement — manpower, weapons, logistics, institutions and economy compounded, so a city host genuinely outweighs a thorp's levy. Layered on top: martial readiness, which spikes with war and decays over a generation of peace, and its inverse, strategic rust, which makes a long-peace realm blunder its first war. Where mercenary or adventurer guilds exist, a settlement can buy readiness it never trained — at an upkeep cost, and with hired steel judging risk worse than sworn steel.
- **Fed by / feeds** — Reads institutions, food, supply chains and deity temper. Feeds the feasibility gate, the siege contest, attrition, and the misjudgment term.
- **At the table** — "A formidable host" against "a thin levy" in plain words, and a reason a rich peaceful realm loses its opening campaign.
- **Status** — LIVE.

### 92. Armies and deployment

- **What it is** — A settlement fields exactly one army. Marching it out mints a durable army record carrying its own current strength, supply integrity, morale and age — so it is a thing that wears down rather than a number recomputed each week. Several besiegers converging on one target form one large siege with many fronts.
- **Fed by / feeds** — Consumes mobilisation, capacity and the march order. Feeds sieges, attrition, reinforcement, home costs, the return outcomes, and occupation.
- **At the table** — "Their army marched out six weeks ago and is battered — about two fifths of its strength remains."
- **Status** — LIVE.

### 93. Fronts

- **What it is** — A besieging army opens a directed front channel into its target. Because a merely hostile relationship mints a channel with the same identity, every siege-detection reading passes one provenance-checked door, so a bare feud can never be mistaken for a live siege.
- **Fed by / feeds** — Read by supply severance, occupation, the decision-maker, the danger layer, and the map panel.
- **At the table** — The map shows real sieges only — no phantom armies at towns nobody marched on.
- **Status** — LIVE.

### 94. The siege contest

- **What it is** — Before any dice, a deterministic feasibility classifier compares attacker and defender capacity and decides whether the fight is even plausible; hopeless matchups resolve without a roll. Only genuine contests reach the one seeded roll. A hard duration ceiling ends grinds. Where the deeper war arms are lit, the defender's *will* — leadership, faith, legitimacy, food, and the odds it faces — biases the roll, and a fully broken will capitulates outright rather than being stormed.
- **Fed by / feeds** — Reads capacity, army strength, fortification, terrain, ally relief, supply interdiction and magic law. Writes conquest, occupation, attrition and news.
- **At the table** — A thorp cannot storm a fortified city on a lucky roll, and a starving illegitimate town can simply open its gates.
- **Status** — LIVE; the defender-will and attrition arms are LIVE IN SOME WORLD-LAW SETTINGS (the fullest preset).

### 95. Armies on the road — marches, interception, field battles

- **What it is** — With the realm mapped, armies have positions and march real routes at a pace set by readiness and terrain. Two hostile columns whose paths cross between settlements fight a **field battle** rather than a siege, resolved on a clamped odds curve — a badly outmatched force does not win on a lucky roll — with bounded losses so the loser retreats mauled rather than annihilated, by the safest road home. An army whose road home is cut goes information-starved and starts misjudging the enemy.
- **Fed by / feeds** — Reads the frozen distances, route danger, seasons and the belief layer. Feeds sieges, attrition, the belief staleness clock, and the travellers overlay.
- **At the table** — "The relief column is nine days out — and it is about to run into someone else's army in open country."
- **Status** — LIVE ONCE THE REALM IS MAPPED, and only where the war layer runs.

### 96. Navies, convoys, and blockade

- **What it is** — Ports with a genuinely war-capable maritime institution field navies; ports without one can still convoy. Navies carry friendly armies across water, two hostile navies sharing a sea edge fight by the same rules as land, an embarked army shares its convoy's fate, and a blockade is treated exactly as a siege.
- **Fed by / feeds** — Reads sea lanes and army transit; feeds the siege and war layer and, through blocked shipping, the economy.
- **At the table** — "The invasion fleet was intercepted mid-crossing; half the army never landed."
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the three most active presets.

### 97. Attrition, supply and reinforcement

- **What it is** — After every engagement both sides lose strength, computed from the matchup, fortification, terrain, siege length, supply, morale and the outcome band — bounded so no single week annihilates an army. The home can send a partial, expensive replenishment each week that never fully restores and never exceeds the army's starting strength, and paying for it drains the home harder the longer the army has been out.
- **Fed by / feeds** — Feeds the siege contest (a worn army loses fights it once would have won), the home-cost pass, and the return outcomes.
- **At the table** — Wars end. A stalled campaign trends toward resolution instead of grinding forever.
- **Status** — LIVE.

### 98. Supply-web warfare — strangling instead of storming

- **What it is** — Instead of the direct assault, an actor can systematically strangle the villages and thorps feeding a target: raid, occupy, embargo, toll war, purchase denial, interdiction — instruments running from bloody to bloodless, chosen by the commander's archetype and alignment. The system compares direct against indirect expected value with time priced in, keeps a campaign plan re-scored every week, and abandons it when the value collapses. The reading is belief-gated, so a badly-informed commander strangles the wrong village. Burning innocent villages drifts the aggressor's own alignment and earns a reputation, which is the brake.
- **Fed by / feeds** — Reads the supply web through the aggressor's *belief*, plus espionage and corruption sight. Feeds food, institutions, morale, alignment drift, reputation, and the peace layer (a strangled town sues early, which the plan reads as success).
- **At the table** — A weaker realm that wins by cutting roads, and a campaign the party can disrupt at the caravan rather than at the walls.
- **Status** — LIVE where the war layer runs, in the two most active presets. Physical raid execution and the granary debit are documented deferrals; a strangulation pressure ledger is the conserved stand-in.

### 99. War exhaustion and the home front

- **What it is** — Sustaining a war drains the home economy, thins the garrison, and accrues an exhaustion scar that ratchets up fast and decays roughly five times slower. In the fullest setting the war also eats real people and grain: an army conscripts population from home and returns survivors — deployed minus returned is the war dead — and an overlord levies men and grain from vassals at a loyalty cost.
- **Fed by / feeds** — Feeds economy, defence readiness, coup risk, mobilisation cooling, migration, route danger and peace willingness. Fully invertible when a DM dismisses the siege that caused it.
- **At the table** — "This realm has been at war too long" as a visible mechanical fact — emptier villages, a strained treasury, restless vassals.
- **Status** — LIVE; the conscription and levy arms are LIVE IN SOME WORLD-LAW SETTINGS.

### 100. Losing at home — the war political loop

- **What it is** — An unpopular, exhausting war erodes the ruling seat: war weariness makes a coup — an internal "end the war" — more likely, while a warlike regime waging a sustainable war is steadier. A peace decision can also organise an existing opposition faction against the seat.
- **Fed by / feeds** — Reads war exhaustion and faction competition; writes coup verdicts, seat transitions and, through those, the war's own continuation.
- **At the table** — An overextended aggressor that loses on its own home front, and a successor installed to make peace who is then bound to it.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS.

### 101. The army comes home

- **What it is** — When a siege resolves, the army marches home and the outcome is contextual: a strong army breaks an occupation, lifts a siege on its own town, or topples a vassal-master's seat; a depleted one fails, is brushed aside, or splinters into deserters and rebels even at an untroubled home.
- **Fed by / feeds** — Reads army strength and home state; writes occupation liberation, siege relief, coups, faction confidence, legitimacy and exhaustion decay.
- **At the table** — "The troops came home to trouble" as a scene the world generates itself.
- **Status** — LIVE.

### 102. Ending a war

- **What it is** — Two roads. Live: the decision-maker can pick "sue for peace," gated so the realm and its vassals are free to do so, and the DM can decree it. Unlit: a per-deployment termination reading that re-examines every live war each week and publishes a pressure to sue with typed, banded, receipted causes — plus the bilateral second yes, where the named target court must also accept or the war stays live.
- **Fed by / feeds** — Reads the reason ledgers, the cost trajectory, the ruler's books, coalition sunk cost and treaties. Feeds the treaty mint.
- **At the table** — Wars that end for stated reasons rather than timing out — and one side wanting peace is not the same as peace.
- **Status** — Suing is LIVE; the termination reading is BUILT, NOT REACHABLE.

### 103. Sacking a town, and the world's judgment

- **What it is** — The third victor's intent beside taking and pricing: punishing. Only an evil-aligned court may *initiate* a sack; anyone else needs a vengeance licence, which a razing mints for every settlement close enough to the victim and which legitimises exactly one war of retribution. The sack itself is conserved arithmetic on a population with a war-dead sink, a tier fall, ruined institutions, spoils, and a departure of survivors. Every observer judges it on their own moral axis — monumental from good courts and gods, lesser from neutral, mere recognition from the evil axis. Courts then form the atrocity-answer grounds for war from what the public news said happened, not from what happened.
- **Fed by / feeds** — Reads alignment, relationships, deities and the news feed; writes the reasons ledger and occupation.
- **At the table** — Atrocity as a world event with consequences that outlive the war — and a good realm that could have taken everything publishing why it did not.
- **Status** — BUILT, NOT REACHABLE.

### 104. Conquest doctrine

- **What it is** — A court marches on what it *believes* it can take: a belief composite over believed relative strength, believed coalition reach, and its own reserves, kept structurally unable to see the truth. Whether it *wants* to is a separate question answered from character — martial temper, conquest history, its own and its patron's nature, and the enemy's *believed* nature, which makes the most valuable thing to plant in a righteous court a lie about who its neighbour serves. Only an overwhelming victor may mature a hold into a client state; a merely winning one has to negotiate.
- **Fed by / feeds** — Reads the belief map, alignment, deities and history; writes intent, execution and occupation.
- **At the table** — Wars of conquest that are legible as *character*, and a lie that can start one.
- **Status** — BUILT, NOT REACHABLE.

## 3F — ECONOMY AND TRADE

*What a town makes, what it must buy, what travels the roads, who profits from the crossing, and what happens when the market closes.*

### 105. The founding economic profile

- **What it is** — At generation each settlement is given a complete economic identity: income sources, what it exports and imports, what it produces locally, which trades it depends on, and a prosperity rung with a plain-language description of its situation. It is assembled from terrain resources, the institutions standing in town, the tier, and road, river or port access.
- **Fed by / feeds** — Reads the resource roster and the institution roster. Feeds supply chains, food security, viability warnings, the causal readings the war and demographic layers consume, the economics view, the printed export, and the prose desk.
- **At the table** — "This town is prosperous; it exports salted fish and timber, imports iron and grain, and its wealth runs through the customs house on the river."
- **Status** — LIVE.

### 106. Supply chains and finished-goods demand

- **What it is** — Chains connect a raw resource to a producing institution to a finished good; the engine derives which chains are actually running, then compares what the town's military, religious, maritime, luxury and alchemical institutions *consume* against what those chains *produce*. A gap becomes an import label; a surplus becomes an export bonus.
- **Fed by / feeds** — Reads resources and institutions; feeds the export and import lists, viability warnings, and the caravan layer that ships the missing inputs. Accepts DM-authored custom chains.
- **At the table** — "Iron ore, to the smithy, into weapons — active. Grain, to the mill, into flour — impaired." Plus an honest note that the armoury needs iron the town cannot make.
- **Status** — LIVE.

### 107. Trade-route access — the one canonical reading

- **What it is** — A settlement's road, river, crossroads, port, coastal, isolated or mountain-pass access maps to one canonical tier that every consumer reads. A mountain pass gets its own seasonal tier, worth roughly two fifths of a year-round road, because it closes in winter.
- **Fed by / feeds** — Feeds prosperity, food import rates, connectivity, caravan reachability, viability, and the trade-crisis spillover.
- **At the table** — An isolated hamlet genuinely cannot buy its way out of a famine, and a pass town has a good half-year and a bad one.
- **Status** — LIVE.

### 108. Regional trade channels and the scarcity spillover

- **What it is** — Settlements are linked by typed channels; the trade-dependency channel is the economic one. When a supplier falls into a trade or route crisis, its dependents receive a typed import-shortage condition whose severity scales with how strong the dependency was.
- **Fed by / feeds** — Reads the regional graph; writes active conditions, the proposal queue, the chronicle and the news feed.
- **At the table** — "Supply from Harrowmill fails Ashford — Ashford's prices climb," delivered as an event the DM can approve or let run.
- **Status** — LIVE by default (off in the quietest presets).

### 109. Caravans — goods that travel and roads that can be cut

- **What it is** — A consuming institution that needs an input it cannot make draws it along an actual route from a producer settlement. The cheapest reachable producers are ranked once at establishment, so a severed source is a walk down a list rather than a re-solve. A total cut plus an empty buffer starves the institution with a written reason, and the starvation lifts the moment a shipment lands. A critical input with too few independent producers is flagged fragile up front.
- **Fed by / feeds** — Reads supply chains, the frozen distances, the week clock, and route danger (a hostile gate intercepts). Feeds institution impairment, smuggling, entrepôts, and the flow tally. Food is deliberately excluded so it is never double-counted.
- **At the table** — "The smithy has gone cold — the iron road through Redhollow is cut, and nothing has arrived in nine weeks."
- **Status** — LIVE ONCE THE REALM IS MAPPED.

### 110. Commodity continuity — finite stocks and real quantities

- **What it is** — The upgrade that stops goods teleporting. A producer holds a finite stock that refills at a production rate and drains as it ships; every town holds a per-good quantity that drains weekly and refills when a caravan lands; towns *along* the route consume part of the cargo in passing; and the whole thing balances exactly each week — what existed plus what was made equals what exists plus what was eaten plus what was lost.
- **Fed by / feeds** — Feeds the shortage, adequate and surplus bands that market prices, flow drift, entrepôts and smuggling all read. Consumes the caravan layer and the supply-chain roster.
- **At the table** — "Ore is short here this month — the last three caravans were tapped dry by the villages on the way."
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the fullest preset only.

### 111. Entrepôts, tolls, and warehouses

- **What it is** — Towns that trade actually *flows through* earn centrality from real gate crossings, not from looking central on a map. Centrality funds a toll, the toll lifts prosperity, and sustained centrality unlocks transshipment buildings in order: warehouse, then customs house, then carriers' guild. A greedy toll diverts caravans to a cheaper detour, which lowers the toll — the correction is built in. Four brakes cap it: a congestion ceiling, upkeep, a hard rate cap, and wartime targeting, because a fat crossroads is besieged first.
- **Fed by / feeds** — Reads the caravan and commodity ledgers; feeds prosperity, the institution-founding lane, siege target selection, and the commercial grievance ledger's toll cases.
- **At the table** — A crossroads town grows a warehouse district and a customs house because the roads made it rich — and becomes the first thing an army marches on.
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the fullest preset only.

### 112. Contraband, smuggling, and seizure

- **What it is** — When an honest caravan's expected value goes negative because the road is too dangerous, the unmet demand spills into the criminal channel. What counts as contraband is *relational*: an abolitionist gate seizes a slave caravan that a slaver gate waves through. A shipment makes one smuggling roll against the worst gate on its route and is then, in a fixed order, either seized (hostile), confiscated (contraband), or simply tolled. How much a seizer actually takes is set by their conscience.
- **Fed by / feeds** — Runs at the arrival gate of commodity flow. Reads culture distance, alignment and corruption (a leaky gate is easier to run); feeds the thieves' guild and criminal opportunity.
- **At the table** — "Nothing legal moves on that road now — but the Ferryman's people can get your cargo through, for a price, and the baron's men confiscate what they catch."
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the fullest preset only.

### 113. Measured flow and market prices

- **What it is** — Two read-only layers. The first tallies goods in and out per settlement, weighted by whether the town has a harbour, an airship dock or a teleport circle, and decays the tally, so a blockade quietly fades a town's trade to nothing. The second turns the resulting scarcity bands into in-world coin — a base price by goods class, a scarcity multiplier, a small fixed local jitter — phrased as "four silver the bushel," never a spreadsheet decimal. Neither ever writes back: generation stays sacred and prices never feed engine mathematics.
- **Fed by / feeds** — Reads commodity bands and the arrivals tally; renders in the economics view.
- **At the table** — A live trade-flow band beside the founding trade profile, and a market price list the DM can read aloud at the stall.
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the fullest preset only.

### 114. Trade salience — what a tie is worth

- **What it is** — For any pair with a confirmed trade tie, the engine scores how valuable that tie is to each side: a food-insecure town's grain tie is vital, a militarising town's iron tie is vital, a luxury tie with many alternative sellers is not. Modifiers: how hard the supplier is to replace, how recent the tie is, and how politically bound the two are. Valuable trade does not make neighbours friendly — it makes hostility expensive.
- **Fed by / feeds** — Reads the food ledger, military capacity and supply completeness. Feeds the relationship hostility dampener, the trade-war contest, the commercial grievance ledger, and a DM reading.
- **At the table** — "A vital grain tie restrains them." "Ashford is dependent on Redhollow for iron — losing it would mean famine." "Redhollow holds leverage; it could choke the supply." Covert smuggling ties are DM-only and never shown on a player-facing view.
- **Status** — LIVE wherever the war layer runs.

### 115. Trade war — the contested supplier

- **What it is** — "Who is Ashford's main iron supplier" is a prize that can be taken. A challenger contests the incumbent on a blend of supply completeness, economic strength and standing with the buyer. A win re-points the dependency; the beaten incumbent either winds down into a cold war or turns hostile and deposits a march order for the war opener to judge. Overlords can compel a vassal's trade outright, but that stamps a strain on the vassal, so the coerced client can still rebel. A cooldown after each flip stops the prize oscillating.
- **Fed by / feeds** — Reads regional channels and relationship state; writes relationship state, the march-order lane, and the commercial grievance ledger.
- **At the table** — "Redhollow has taken the iron trade from Greyfen — and Greyfen's council is not letting it go quietly."
- **Status** — LIVE wherever the war layer runs.

### 116. Grounds for closing a market — the commercial reasons ledger

- **What it is** — Commerce gets war's reasons layer as its own: eight typed grievances — contract default, toll extortion, market exclusion, cornering, famine profiteering, dependency fear, contraband injury, route predation — each mirrored by its exact opposite: contract honoured, toll relief, market opened, provision, famine relief, dependency comfort, honest gates, route wardenship. Every pair reads the *same* evidence with opposite signs, and the whole ledger is recomputed weekly, so a grievance fades when the cause heals instead of accumulating forever. A grievance contradicted by live state — accusing a town of famine profiteering when its warehouses are demonstrably empty — scores zero and names the reading that struck it out.
- **Fed by / feeds** — Reads the toll ledger, the no-trade predicate and pair salience; feeds the news feed and the trade-war escalation as pressure. It deliberately mints no grounds for *war*.
- **At the table** — Every market closure in the world comes with a stated reason a DM can read out, and its opposite when relations warm.
- **Status** — BUILT, NOT REACHABLE. Three of the eight pairs read live state today; five are registered seams whose producers do not exist yet and score a permanent honest zero.

### 117. The three embargo paths

- **What it is** — Markets close by three different mechanisms. **Conscience**: a buyer applies a penalty to a supplier whose worst standing institution offends its tolerance — a slave market under a saintly town's nose cuts trade to a trickle, never to zero — and sustained trade slowly normalises what a town *tolerates*, capped so trade never converts a good town into a cruel one. **A court's chosen lever**: a merchant or warlord seat can pick "close our markets to them" as its move of the week. **Collapse under tension**: a valuable, hard-to-replace dependency plus rising military or religious tension collapses into an embargo outright.
- **Fed by / feeds** — Reads institution rosters and alignment, relationship state, trade salience, faith and the deity axes; writes relationship state and conditions.
- **At the table** — "Saint-Bevin's houses will not buy from Karn Vor while the pits still run" — and a year later, "Karn Vor answers with an embargo of its own."
- **Status** — The conscience path is LIVE; the chosen lever is LIVE where the decision-maker runs; the tension collapse is LIVE where the war layer runs.

### 118. Resources — drift, discovery, and working out

- **What it is** — Two movers on the ground itself. The long-standing one drifts resource pressure and depletion with tier and demand. The newer one lets prospecting strike a genuinely *new* deposit drawn from what the terrain could plausibly hold, and lets a non-renewable that has sat depleted long enough be removed for good. Renewables never vanish; a worked-out vein never returns.
- **Fed by / feeds** — Rewrites the settlement's resource roster, then surgically reconciles production, supply chains and the economic profile in both directions. Feeds prosperity, viability and the trade goods list.
- **At the table** — "The silver at Hollowmere has run out — the mine is closing, and the town's second decade will not look like its first." And, occasionally, a strike.
- **Status** — Drift is LIVE by default; discovery and removal are LIVE IN SOME WORLD-LAW SETTINGS (the three most active presets).

### 119. Economy freshness — the honesty layer

- **What it is** — When a DM edits a settlement, the derived economy is deliberately *not* re-derived, because re-running it would rewrite saved fields and consume fresh randomness, breaking same-seed fidelity. Rather than quietly showing stale numbers, every economy surface declares it: the tallies are as judged at the last survey. Every economy reader in the app and the printed export is classified into one of four buckets by a structural test that fails closed on anything it cannot place.
- **Fed by / feeds** — Reads the edit state; feeds every economy view.
- **At the table** — A one-line note that stops the DM trusting a number that has not caught up with their edit.
- **Status** — LIVE.

## 3G — CULTURE, FAITH, AND MAGIC

*What a people are like, what they observe, whom they worship, and whether magic works here.*

### 120. The culture dial

- **What it is** — Every settlement is generated with one broad cultural inspiration family, each carrying a bounded design grammar: how buildings are built, how civic authority is negotiated, how exchange works, what people eat, how sacred life is organised, how they defend themselves, and the ordinary social texture. These are presentation context plus modest nudges to which institutions are likely to appear — never a claim that a whole people share a personality.
- **Fed by / feeds** — Fed by the generation wizard's culture choice. Feeds institution probability, naming pools, daily life, dossier prose, and the printed identity section. Read (never written) by culture distance.
- **At the table** — A specific, consistent civic and material world — "timber halls around a market green, craft associations bargaining with landed patrons" — and temples, guilds and defences that fit it.
- **Status** — LIVE.

### 121. Culture distance — how alike two places are

- **What it is** — Rather than storing an ethnographic identity, the engine computes how culturally close two settlements are from state it already has: shared gods, shared moral and lawful disposition, similar wealth and ways of life, similar governance (and whether they answer to the same sovereign), with a heavy trade tie pulling them closer still. There is no stored culture coordinate to go stale — it is recomputed from live state each time.
- **Fed by / feeds** — Reads faith, alignment, economy, trade ties and ruling power. Feeds migration's least-drift destination choice and the contraband "culturally different" gate.
- **At the table** — When a realm's people move, they drift toward places that feel like home; and when a conqueror flips a town's ruling name to his own, that town starts reading as culturally closer to the conqueror over the following weeks.
- **Status** — LIVE as a reading; its consumption rides the mapped-realm lanes.

### 122. Traditions — the founding observances

- **What it is** — Every settlement carries holidays, festivals and rites reconstructed deterministically from its own identity: a singular founding observance that persists forever, plus customs accrued as it grew. Each rite has an immutable core — an element and an act: a procession, an offering, a fair, a contest — a name, a calendar window in weeks, a grandeur band tied to town size, an optional patron deity, and a dressing of trappings and an epithet.
- **Fed by / feeds** — Reads the settlement seed, tier, terrain, culture, economic character, and the patron deity's alignment axes.
- **At the table** — Open the traditions view on any town, even an unsaved draft, and get named festivals with dates, what they look like, and which one the town has kept since its founding. Instant colour with no rolling.
- **Status** — LIVE (the preview works regardless of any setting).

### 123. Traditions — the living festival engine

- **What it is** — Once a campaign runs, each rite's window opens once a year and the festival either happens or does not. How well it goes is scored from prosperity, the season, the ruler's standing, war pressure, an active crisis or boom, whether the festival is grander than the town can afford, and last year's memory. A plague, famine, siege, occupation, severed trade lane or desperate economy cancels it outright. Outcomes run triumph, good, modest, troubled, failure, cancelled — and they pay out: a triumph or failure steps prosperity a band, the ruling seat's legitimacy moves, and a deity-dedicated rite nudges one share point between its patron and the largest rival god. A successful market fair on a real trade lane earns an extra prosperity step from the merchants it drew.
- **Fed by / feeds** — Runs last in the week, after growth, urban fabric, consequences and the career ladder have settled. Reads seasons, war stressors, active conditions, route tier, ladder churn and the occupation ledger. Writes its own ledger, prosperity, legitimacy, pantheon shares and news.
- **At the table** — The chronicle says "The Lantern Vigil faltered in Aldmoor," and the town is measurably poorer and its lord measurably shakier for it.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (three presets); absent from the default rule bank.

### 124. Traditions — who owns a rite, and how rites change

- **What it is** — Every observance belongs to a power: the ruling seat, a temple or guild, the merchants, the military. Ownership shifts when the world does — a coup re-anchors the seat's rites, a vanished institution orphans its own, a new patron god re-dedicates the devotional ones, and roughly once a generation the keeping simply drifts. Only the dressing, the grandeur and the owner ever move; the core of the rite is immutable forever, and every change writes a dated line into the rite's own history.
- **Fed by / feeds** — Reads ruling power, faction archetypes, institutions and the urban fabric's leadership. Named owners appear in the news beat and bear half the legitimacy consequence.
- **At the table** — "It is kept by the Coopers' Guild, who answer for its fortune" — a faction to blame or reward, and a readable century of why the rite looks the way it does.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (with the festival engine).

### 125. Traditions — imposition, suppression, liberation, adoption

- **What it is** — Culture is imposed and carried. A vassalised settlement can be forced each year to trade one of its rites for its overlord's: the overlord's grandest rite arrives as a local copy, the displaced local rite is *suppressed, never deleted* — and when the occupation ends the old rite returns intact and the imposed one is removed. Separately, culture travels with people: when migrants from one origin reach roughly an eighth of a destination's population over three years, the origin's foremost rite is transplanted, re-dressed in the destination's own idiom, and either added or set against the town's weakest existing rite. The founding rite is never a victim of either.
- **Fed by / feeds** — The occupation ledger is the sole imposition trigger; treaties and hegemony are deliberately not read. Migration columns supply the influx. An imposition leaves a decaying grievance on the overlord-to-vassal relationship.
- **At the table** — A liberated town holds its old festival again the next year, unprompted, with the whole story in the rite's own log: imposed in one year, restored in another. Refugee quarters keep their home rites, and eventually the town keeps them too.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (with the festival engine); the grievance mark is additionally unlit everywhere.

### 126. Pilgrimage and the realm almanac

- **What it is** — A grand procession, offering or famed fair pulls pilgrims from the nearest reachable neighbours, and the crowd lifts the festival's chances. It reads distances only and never writes anything to the visiting towns. Separately, a lightweight realm-level line reads the already-projected festival mirrors and answers "what is coming this season."
- **Fed by / feeds** — Needs a mapped realm; an unmapped campaign gets exactly zero lift.
- **At the table** — "Coming this season: the Harvest Assize at Wenholt" on the realm strip, and grand festivals in well-connected towns visibly outperform identical ones in isolated ones.
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS, plus a mapped realm for pilgrimage.

### 127. Deities — the no-premade-pool doctrine

- **What it is** — The product ships **no gods**. A DM authors each deity in the reference book: a name, a moral axis (good, evil, neutral), an order axis (lawful, chaotic, neutral), a rank (major, minor, cult), a free-text portfolio that is pure flavour with zero mechanics, and a one-word domain. Temperament is *derived* from the two axes, never set. Once authored, a deity is assigned to a settlement as patron or imposed as a cult, and a bounded snapshot is embedded on the settlement so the engine never reads the account's content library.
- **Fed by / feeds** — Feeds corruption direction and magnitude, law and order, religious authority, magic legality, war appetite, tradition dedication, and culture distance's strongest term.
- **At the table** — The DM's own pantheon is the campaign's pantheon. There is no stock god to explain away, and the authoring form states in plain words what each axis will do before they commit.
- **Status** — LIVE.

### 128. The pantheon — shares, niches, standing, patron

- **What it is** — A settlement holds several gods at once, each with a share of the faithful out of a hundred, a niche (temperament crossed with alignment, one god per niche), a standing (cult, established, ascendant), and exactly one patron. Faith grows gradually: a god arrives as a cult and climbs by winning adherents. A separate unaffiliated bucket drains the pews during a long comfortable golden age with a weak church and floods back under crisis, capped so a realm is never godless.
- **Fed by / feeds** — Driven each week by the religion engine; feeds legitimacy, corruption, the divine mandate, magic legality and the tradition faith nudge.
- **At the table** — A city's religious life reads like a real one: a dominant church, two rising rivals, a measurable secular drift in fat years, and a revival when the plague comes.
- **Status** — LIVE whenever the campaign has any deity at all — deliberately not behind a settings switch.

### 129. Legitimacy, contest, and the spread of a faith

- **What it is** — Two different knobs. **Growth** is fast and volatile: rank, carriers, regional prevalence, receptivity. **Legitimacy** is slow — how *rightful* a faith's claim is — and accrues only by holding the seat, by the ruler's endorsement, by neighbours recognising it, and by the chronicle read through the ruler's character; it is dragged down by corruption and by the heresy stain of a faith installed by force. A conqueror can convert a town overnight but the new faith stays brittle for years. When the patron seat actually changes hands the engine stamps a conversion, re-embeds the new patron, and seeds a fracture stressor that spreads along religious authority.
- **Fed by / feeds** — Reads the ruling faction, government form, corruption climate, institutions, martial and moral conduct, and clergy character. The **spread lane** — carriers into other settlements, regional prevalence, neighbour recognition, occupation faith-pull — is separately gated.
- **At the table** — A reason in sentences: the cult out-converted the church but the church still holds the seat, because the cult has no right to it yet. And an occupying army's god really does start pulling the occupied city's faithful.
- **Status** — The local lane is LIVE on deity presence alone; the spread lane is LIVE IN SOME WORLD-LAW SETTINGS.

### 130. Piety and the clergy lens

- **What it is** — In a very religious place a god's influence matters *more*; where faith is thin it matters less. Local and realm piety become multipliers over every deity coupling. And *who ministers* matters separately from who rules: each priest's authored temperament and flaws project onto the same two axes the gods use, so a flawed or compromised priesthood weakens the channel. A trait-neutral, unflawed priesthood reads exactly neutral.
- **Fed by / feeds** — Reads the religious roles in the cast; multiplies corruption pressure, the divine mandate swing and legitimacy terms.
- **At the table** — A devout city's gods bite harder in both directions, and a corrupt bishop measurably weakens his own god's grip — with the cause chain printed as a sentence on the faith panel.
- **Status** — LIVE (inert where no piety record exists).

### 131. Temples and clergy as institutions

- **What it is** — Religious institutions are ordinary catalogue institutions with a religious tag: wayside shrines, parish churches, resident priests, monasteries, cathedrals, competing for an exclusive religious-centre slot by tier. They supply religious authority, public legitimacy and healing, and they require donations and clergy.
- **Fed by / feeds** — Feeds the religious-authority reading, social trust, and the religious-welfare and healing capacities; institutional backing feeds faith legitimacy.
- **At the table** — A village has a shrine and a priest; a metropolis has a cathedral and a monastery, and losing them measurably shakes the faith's standing.
- **Status** — LIVE.

### 132. The faith-agnosticism law

- **What it is** — The engine models *believers*, never gods. It never confirms a divine act, never adjudicates whose god is real, never contradicts the DM's canon. Miracles exist only as *claims* inside history and rumour content, and the mechanical consequence is always the believer-side one — pilgrims, coin, strangers.
- **Fed by / feeds** — Binds every faith mechanism above.
- **At the table** — The DM's theology is never overruled by the simulation. The world reports how many believe and how firmly, and leaves whether the god answered entirely to the table.
- **Status** — LIVE as an observed property of the code and stated as binding law in the architecture.

### 133. The realm magic question

- **What it is** — Before a multi-settlement realm exists, the DM is asked one question: a world of magic, or a mundane world. The answer is not a live gate — it is *stamped into every settlement's own configuration at mint*, so every existing mechanism (generation law, the magic reader, display, regeneration, sharing) is correct by inheritance. A settlement generated into a mundane realm afterwards pre-selects mundane, visibly, and the DM can override it in one click — and the override sticks, because one strange glowing city in a dead-magic realm is a deliberate act the design protects. The copy is explicit that magic is not faith: a mundane realm still prays.
- **Fed by / feeds** — Feeds generation world law (which institutions, roles, services, secrets and history events may exist), the magic reader, the magic profile, teleport edges and war feasibility.
- **At the table** — "A mundane world. No working magic anywhere in the realm. Gods and temples remain." One click, and the whole realm generates without a single mage's guild.
- **Status** — LIVE.

### 134. Does magic work here — the one reader

- **What it is** — One accessor answers "does magic function in this place," from the settlement's own magic axis: an investment dial, a derived band, and the hard world fact. A settlement carrying no magic axis at all reads as *magical* rather than dead; only a settlement that actually asserts magic is absent reads false. An unrecognised band leaves a receipt rather than silently folding to the middle.
- **Fed by / feeds** — Read by the war layer's magic gate, the espionage layer's magical-transmission gate, the magic profile, teleport edges and arcane institution filtering.
- **At the table** — Magic behaves consistently in one town: the siege, the courier, the market and the dossier all agree on whether magic works there.
- **Status** — LIVE.

### 135. The magic profile — ten facets

- **What it is** — Magic is described as a structured posture: availability, legality, institutional control, service cost, risk, religious acceptance, plus four role facets — economic, military, medical, infrastructure. A major patron deity regulates a realm's magic, and a warlike or evil major orthodoxy tightens it harder. In a dead-magic world the profile says so honestly rather than fabricating an economy.
- **Fed by / feeds** — Reads factions, the causal substrate, magical capacity, arcane and healing institutions, and the patron deity's derived temperament.
- **At the table** — The magic view tells the DM whether a wizard can buy components here, whether the watch will arrest him for casting, and which church decided that.
- **Status** — LIVE.

### 136. The magic economy — regimes, buffer, substitution

- **What it is** — A designed and largely built layer answering "what can this settlement *do* with its magic," and the answer is economic: who pays — nobody, the town, a patron, or the work itself. Magic's *presence* keys off magic; its *exploitation* keys off the economy, through one gate formula every consumer reads. On top sit a disaster buffer (magic mitigates damage but converts it rather than deleting it, and only what the town can pay for) and a food-substitution channel (magic can feed a city as one more term in the existing hunger arithmetic, never as a bypass). A general institution status vocabulary — operational, impaired, shell — rides the same switch.
- **Fed by / feeds** — Institution lifecycle, the food and granary model, disasters, and the institution catalogue's authored rungs.
- **At the table** — Nothing yet.
- **Status** — BUILT, NOT REACHABLE.

## 3H — MOVEMENT AND FLOW

*Everything that crosses the space between settlements: people, goods, columns, and the time it takes.*

### 137. Aspatial migration — the distance-free fallback

- **What it is** — When a settlement loses many people at once, roughly half the loss is handed to nearby settlements immediately, split across up to four of the most desirable neighbours by relationship and pressure. There is no journey and no travel time; people appear elsewhere the same week. A roll mode picks, per event, whether the flow concentrates, disperses, or vanishes.
- **Fed by / feeds** — Fed by population dynamics and the pressure index (food, conflict, crime, legitimacy); feeds settlement populations directly. Superseded entirely once the world is mapped.
- **At the table** — "Ashford lost four hundred people to pressure; about a hundred and eighty turn up in the three nearest towns this week."
- **Status** — LIVE by default (off in the quietest presets).

### 138. Migration with mortality — the refugee column

- **What it is** — On a mapped world a mass exodus stops teleporting. The shed population splits three ways with exact integer conservation: some die at the origin — the weak and old who cannot travel — the rest walk a real route, some die on the road, and the survivors arrive later at a destination chosen over five weighted axes: closeness, cultural affinity, safety, prosperity, and whether a host has opened its doors to that specific origin. Origin survival scales with how prosperous, connected and well-granaried the origin was; road deaths scale with route danger multiplied by the season — winter war roads are deadliest, but capped, so a column is mauled and never wiped out. A scatter fraction always sends some people somewhere unlikely, and a congestion brake decays a rich hub's pull as it fills, so no megacity can form.
- **Fed by / feeds** — Reads the frozen distances, route danger, the season clock, culture distance, the pressure index, the regional graph and the generosity layer's refuge postures. Writes population counts and the in-transit ledger. Fed by population dynamics, the calamity engine, the settlement-death lane, and the DM's calamity verb.
- **At the table** — "The famine emptied Ashford; eleven weeks later a smaller, hungrier column reaches Dunmoor — and a few families ended up somewhere nobody expected."
- **Status** — LIVE ONCE THE REALM IS MAPPED (one sub-arm, a corruption-captured origin shedding harder, is unlit).

### 139. The in-transit column ledger

- **What it is** — Every column on the road is one aggregate record — origin, destination, headcount, departure week, arrival week — never one record per person. Each week, columns whose arrival has come are credited to their destination and removed. The lag is itself a stabiliser: it smooths migration waves and lets a destination fill while people are still walking toward it. The ledger disappears entirely when nobody is travelling.
- **Fed by / feeds** — Written by both the crisis lane and the demographic homeostat, each column stamped with its owner so the two lanes can never credit the same people twice. Read by the travellers overlay, the road-scene panel and the rumour carrier lane.
- **At the table** — The DM points at a moving marker and says "those are Ashford's people, they arrive in four weeks."
- **Status** — LIVE ONCE THE REALM IS MAPPED.

### 140. The demographic homeostat — voluntary movement and destination competition

- **What it is** — A second, calmer migration lane. Each settlement is read three ways (food flow, granary coverage, crowding), five push drivers are scored with per-driver applicability guards so a garrison town does not shed soldiers over poverty, and the would-be migrants are classed refugee or voluntary. Voluntary migrants are choosy — a destination must clearly beat home or they stay — while refugees take the least bad reachable place. Destinations then genuinely **compete**: reachable, viable settlements are ranked and their spare room consumed in order, with people already walking toward each place counted against its capacity. Whatever the realm cannot house is reported as unplaced with a named refusal reason. These columns arrive whole — no road deaths, on purpose.
- **Fed by / feeds** — Reads the lived road network for reachability and journey price, the settlement lifecycle (nobody moves into a dead remnant), the named cast (named people never migrate on this lane), and completed emigration plans as standing policy. Feeds the column ledger, the news feed and the founding lane.
- **At the table** — "Grain ran short in Ashford; three hundred took the north road." And when there is nowhere to go: "Two hundred would leave Ashford, and the realm has nowhere to put them."
- **Status** — BUILT, NOT REACHABLE (lighting it also transfers population growth to the demographic engine, a deliberate measurable change parked for a signed soak).

### 141. Seasons, sea lanes, and instant edges

- **What it is** — Three optional overlays on the frozen map. Seasons apply a terrain-weighted surcharge when a distance is read — a winter mountain pass is slow, never severed. Sea lanes exist only where a settlement is genuinely coastal or riverine *and* has a dock, harbour or shipyard; water is an order of magnitude cheaper than land, so an island with a harbour becomes a hub rather than a hermit. Teleport edges make certain pairs near-instant, and are magic-gated and geography-independent.
- **Fed by / feeds** — Feed route choice, caravan timing, army and navy movement, refugee road deaths, and the trade layer's modality weights.
- **At the table** — "The pass closes in winter; the grain goes by sea instead."
- **Status** — LIVE ONCE THE REALM IS MAPPED, each overlay opt-in. A fourth overlay, per-cell biome truth, is built and unlit.

### 142. Travel time and the distance calibration

- **What it is** — Travel time is derived, not authored. The map's own median adjacent-hop cost is calibrated to one week, so a neighbouring town is about a week away, a two-tier neighbour two or three, and the map's diameter lands near a season. Nothing stays in transit longer than a year, and no cross-settlement hop is ever instant.
- **Fed by / feeds** — Reads the frozen digest and the season overlay; feeds every arrival time in the game — refugee columns, caravans, armies, navies, envoys, and delayed regional consequences.
- **At the table** — "That is three weeks' ride" is a real number the world obeys.
- **Status** — LIVE ONCE THE REALM IS MAPPED.

### 143. Route danger and route choice

- **What it is** — Every region carries a continuous danger level driven by occupation, active sieges, war exhaustion and crime, minus institutional security, with hysteresis so it cannot flicker week to week. Route choice then scores a handful of candidate paths against a traveller's own risk tolerance — a cautious lawful merchant takes the long safe road, a bold one takes the short dangerous one — and tolls along the way count as cost.
- **Fed by / feeds** — Feeds refugee road deaths, caravan interception, army marches and retreats, smuggling, and the toll equilibrium.
- **At the table** — "The direct road runs through the war; the caravan went the long way and arrived two weeks late."
- **Status** — LIVE ONCE THE REALM IS MAPPED.

### 144. Named people on the road

- **What it is** — Named people move on a completely separate, protected model from population counts: one hop per week along connected routes, a deterministic mid-route position at any pause, and a rehosting economy where a wanderer is refused at the gate near the scandal and admitted six weeks up the road. Wanderers and smugglers may take overgrown hidden paths at a penalty; armies may not, and that refusal fails closed.
- **Fed by / feeds** — Feeds the roads mission and captivity ledger, ransoms, embassies, the belief layer, the travellers overlay, and the road-scene panel.
- **At the table** — "Your contact left Ashford last week; she is somewhere on the road and reaches Dunmoor next Tuesday."
- **Status** — LIVE ONCE THE REALM IS MAPPED, in the three most active presets; the lived-network half of its route selection is unlit.

### 145. The organic road lifecycle — roads earned and roads forgotten

- **What it is** — The network a realm was born with is derived from generation-time route access and never mutated. Every traversal by goods, people or armies is *counted* onto the corridor it used. When accumulated demand, a material objective, and an expedition-worth test all clear, a road is **chartered** — proposed to the DM, not silently built — and materialises at the lowest grade. Sustained use promotes it; prolonged silence demotes it, and the bottom rung is *hidden*: an overgrown remnant, never an absence. Dangerous roads have their usage discounted by what actually arrived, so greed that keeps losing caravans starves its own road.
- **Fed by / feeds** — Reads the frozen distances; would become the reachability substrate for the demographic homeostat, named-person travel, and the map's arterial rendering, and would let route-predation grievances score.
- **At the table** — "Nobody has walked the old east road in a generation; it is a track through the brush now — and the new road south was not there when your grandfather rode."
- **Status** — BUILT, NOT REACHABLE. Roughly seventeen modules, pinned and unlit.

### 146. Consequences and news that travel

- **What it is** — Two smaller flows. A cross-settlement consequence no longer lands the instant it is derived: it is parked with an arrival week and materialises later, dated at arrival. And refugee columns carry **news** — a column crossing towns relays rumours the way an army or a smuggling run does, and the column itself becomes a banded rumour ("several hundred families on the road") whose direction the belief layer can read. The news lags one week behind the column, deliberately.
- **Fed by / feeds** — Feeds regional propagation, the news feed, the rumour network and the believed-world axes.
- **At the table** — "Word of the sacking reaches you three weeks after it happened, carried by the people fleeing it."
- **Status** — The arrival queue is LIVE ONCE THE REALM IS MAPPED; migration rumours are BUILT, NOT REACHABLE.

---

# TIER FOUR — THE INFORMATION LAYER

*Who knows what, when they learned it, how wrong it is, and what they do about it. This layer sits between the world and every decision-maker in it: nothing above acts on truth directly, it acts on what it believes. Espionage — the deliberate acquisition of knowledge about places too far to hear about — belongs to this family and is documented in THE UNBUILT, because seven of its eight waves are unbuilt.*

### 147. The rumour network — news that walks

- **What it is** — Significant events no longer appear everywhere at once. An event enters the world at the settlements that witnessed it and travels hop by hop along real roads, sea lanes, army marches and smuggling routes, arriving weeks later depending on distance and season. Each settlement keeps a bounded ledger of what it has heard. Under the harshest setting a telling also *degrades* on every hop: details drop out, a magnitude is exaggerated or minimised, and occasionally a name is swapped for a different real town.
- **Fed by / feeds** — Fed by the world's news record (the truth), the road and sea network, seasons, army and smuggler movement, and refugee columns. Feeds the belief map, the settlement's rumours view, the reputation of wanderers, and the believed-razing outrage that starts wars.
- **At the table** — "Your players are in Ashford. Ashford has heard that something bad happened at Greymarch three weeks ago — that it was a battle, that it was large. It was actually a plague, and it was small."
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (the two most active presets); elsewhere news is instant and omniscient. The refugee-column carrier lane is unlit.

### 148. Lineage and corroboration — why five echoes are one rumour

- **What it is** — Every telling remembers which original witness it descends from. Confidence counts *independent* origins, never repetitions: five relays of one man's story weigh as one story, and a second witness's account is what actually raises certainty.
- **Fed by / feeds** — Directly weights the belief map's reconciliation; consumed by the DM truth block on every rumour.
- **At the table** — A town that has heard the same wrong story from six travellers is no more certain than one that heard it once — and the DM can see exactly why.
- **Status** — LIVE wherever the rumour network runs.

### 149. The belief map — the fog of war as an object

- **What it is** — Each settlement holds its own possibly-wrong, possibly-stale model of its neighbours: how strong they are in five coarse bands, how ready for war, who they are bonded to, what they worship. Fresh reports pull that picture toward the truth, degraded by how garbled they were; silence makes it decay until the town has effectively forgotten. Contradictory reports widen doubt rather than settling it. A town always knows itself truly.
- **Fed by / feeds** — Fed by the rumour network, distance-priced staleness, ally intelligence sharing, information statecraft and the brokerages. Feeds the war chooser, opportunistic aggression, peace terms and reparations pricing, fear of a hegemon, alliance risk, famine generosity, and the DM's divergence band.
- **At the table** — "Redhollow is marching on Greymarch because it still thinks Greymarch is a backwater. Greymarch has doubled its garrison. Nobody told Redhollow."
- **Status** — LIVE wherever news travels.

### 150. Per-faction belief and the council schism

- **What it is** — A settlement is not one mind. Merchants learn from caravans, the military from marching armies, the criminal underworld from smugglers, and the common populace from ambient talk. Each faction holds a *separate* picture, and when a confident faction's picture diverges sharply from the ruling seat's, the engine records a council schism. A corrupted faction's knowledge leaks into the public slot.
- **Fed by / feeds** — Rides the rumour carrier tags; feeds the governing-coalition reading and the DM divergence band.
- **At the table** — "The merchants know the war is coming. The duke does not. That argument in the council chamber is a scene you can run tonight."
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (the fullest preset only). One seam: the religious faction's slot is fed by a faith carrier no lane currently lights, so clergy belief stays empty.

### 151. Distance-priced staleness — one curve, shared

- **What it is** — A fact about a far-away place reads *older* to a distant observer than the same fact next door, on top of the travel delay already paid. There is exactly one such curve in the codebase, deliberately, so a town can never know a grain price three hundred miles away better than a banishment next door.
- **Fed by / feeds** — Shared by the belief engine, the rumour display, the believed-razing reader, the wanderer reputation reading, and the brokerage fidelity floor.
- **At the table** — Distance is felt, not asserted — the far realm is always a little out of focus.
- **Status** — LIVE by default.

### 152. Acting on belief rather than truth

- **What it is** — The strategic layer reads the *believed* world. War decisions, opportunistic strikes at a distracted neighbour, peace-term pricing, reparations and land demands, fear of a rising hegemon, alliance-risk calculations and famine relief all pass through belief. When a court commits to an offensive on a belief two bands off the truth — or on a hostility the world has already left behind — the engine stamps the move with a misjudgment record and writes a headline about it.
- **Fed by / feeds** — Belief map in; war, peace, diplomacy and generosity out; the news feed renders the receipt.
- **At the table** — "Redhollow marches on a misjudgment — it believed Greymarch negligible; the truth is formidable." A plot hook the DM did not have to invent.
- **Status** — LIVE wherever beliefs exist.

### 153. Belief from absence — the envoy who never came home

- **What it is** — When an envoy is overdue past the point of hope, the court that sent him concludes the worst and flips its reading of that neighbour to hostile — recording what it used to believe, so the inference can be undone if the envoy returns. It never invents facts it could not have observed; it only amends the relationship.
- **Fed by / feeds** — Written by the envoy errand spine; held by the belief map; acted on by the war chooser.
- **At the table** — A war that starts because a messenger drowned.
- **Status** — Requires both beliefs and the envoy layer; the envoy layer is unlit, so this is BUILT, NOT REACHABLE today.

### 154. Ally intelligence sharing

- **What it is** — Bonded allies pass each other what they know, at high confidence and — for magically linked blocs — instantly and without decay. The same channel can be used to hand a partner a *crafted* hostile belief.
- **Fed by / feeds** — Writes into the belief map; rides the teleport carrier lane; the intelligence sell-or-gift lane is its bounded, obligation-bearing twin.
- **At the table** — "Allied realms see the same map. Everyone else is guessing."
- **Status** — LIVE IN SOME WORLD-LAW SETTINGS (the fullest preset only).

### 155. Information statecraft — the four verbs and credibility as a stock

- **What it is** — Courts get to *do* things with information: SEE (pay agents to watch a rival), HIDE (seal your own strength from prying eyes), LIE (plant a false belief — canonically the garrison bluff, inflating your strength in a stronger neighbour's eyes to deter a war), and SHARE or SELL. Underneath sits credibility as a stock: a court caught lying is discounted next time it speaks, and the discount is consumed by the same corroboration mathematics that weighs any rumour.
- **Fed by / feeds** — Reads and writes the belief map; discounts war-decision margins; feeds exposure and blowback, the brokerage market, and per-person credibility.
- **At the table** — "The baron's court has bluffed once too often; nobody believes his mobilisation warnings any more, and the invasion he is warning about is real."
- **Status** — BUILT, NOT REACHABLE. All four verbs are built and guarded.

### 156. Plants and disinformation

- **What it is** — A lie is priced: whether a court will tell one at all is read off its alignment and desperation, the exaggeration is bounded, and the exposure gap and blowback are charged when the audience re-anchors to truth. The information houses sell the same act over a counter — a power pays coin to have its chosen falsehood planted in someone else's court, backed by the market's own credibility.
- **Fed by / feeds** — Writes the belief map override; reads and writes the credibility stock, the named spokesperson's personal reputation, the envoy's negotiating picture, and the brokerage market.
- **At the table** — "Someone paid the Whisper market to convince the margrave that your patron's garrison is twice its real size. When that lie breaks, it breaks on the margrave's face."
- **Status** — BUILT, NOT REACHABLE (both the statecraft and brokerage switches are unlit).

### 157. Information brokerages — watching, institutionalised

- **What it is** — Houses that sell readings. A patron pays an in-world political price and is handed the house's best answer about a subject, with an honest stamp saying where it came from. A query mints no facts: every claim resolves back to a record — either the settlement's own belief or the ground truth — and truth is admissible only where the house's competence, attenuated by distance, has earned it. A patron who cannot pay is refused by name rather than fobbed off with a worse answer.
- **Fed by / feeds** — Reads and sharpens the belief map; reads the faction political-capital economy; feeds the plant market.
- **At the table** — "Two towns over, the Whisper house can tell you what is actually happening in the capital — for a price your patron may not be able to pay."
- **Status** — BUILT, NOT REACHABLE.

### 158. Personal credibility and reputation at news speed

- **What it is** — Two people-scale extensions. A named spokesperson caught lying is personally discounted next time and takes a standing hit — the boy who cried wolf, at soul scale, and never a death sentence. Separately, what a town believes about a *wandering* person is derived on demand from the same distance curve, so a person can outrun their story on a long road and be preceded by it on a short one.
- **Fed by / feeds** — Reads information statecraft, the career ladder, the roaming pool and the distance curve; feeds the wanderers register.
- **At the table** — "The disgraced knight rides into a town three weeks ahead of the news. They welcome him."
- **Status** — BUILT, NOT REACHABLE.

### 159. The believed-world axes — population, culture, and three more

- **What it is** — Belief extends past strength and alliance to *what kind of place* a town is: whether it is emptying or swelling, which rite it keeps, how scarce its stores are, what conditions it suffers, how devout it is. The staleness is the feature: a rival that heard nothing still believes the old rite persists after politics rededicated it.
- **Fed by / feeds** — Rides the same folding, decay and forgetting as the base belief record; fed by refugee-column rumours and tradition-change beats; the intended consumer is the sovereignty market's appraisal.
- **At the table** — Would be: "The duke is buying a town he believes is thriving. It emptied out last winter."
- **Status** — BUILT, NOT REACHABLE (the parent switch plus three family switches, none lit).

### 160. Second-order belief — "what do they think of us?"

- **What it is** — A court estimates a rival's opinion of it from the only honest source it has: the record of what it has *shown* that rival — what it planted, sold, gifted, shared or hid. It deliberately cannot read the rival's actual belief, because that would be omniscience with an extra step.
- **Fed by / feeds** — Reads the outbound impression record; would feed diplomacy and deterrence.
- **At the table** — Nothing yet.
- **Status** — BUILT, NOT WIRED — nothing imports it and its switch appears nowhere in the source.

---

# TIER FIVE — THE SURFACE

*Everything the DM touches: the dossier, the newspaper, the reference book, the exports, the editing verbs, and the two faces of the same world.*

### 161. The application shell and the page table

- **What it is** — One small table maps a web address to a page: create, library, realm, reference book, gallery, account, pricing, the legal pages, the DM screen, and a shared-world link. Every page loads on demand, so the first screen stays light.
- **Fed by / feeds** — Feeds every surface below; fed by the authentication and entitlement state.
- **At the table** — A DM can bookmark or share any page and land exactly there — including a shared world code that regenerates the world in someone else's browser.
- **Status** — LIVE.

### 162. The settlement dossier

- **What it is** — The primary artifact: a long scrolling article about one place, split into thematic views — summary, overview, economics, services, power, defence, people, history, resources, viability, daily life, relationships, rumours and news, war and faith, magic, substrate, plot hooks, chronicle, guidance, notes, versions, map. Each loads only when opened.
- **Fed by / feeds** — Reads the generators and the display readings; feeds the printed and virtual-tabletop exports, the gallery, the DM screen, the town map, and the newspaper's entity links.
- **At the table** — A DM opens a town and can answer any question — who runs it, what it sells, who hates whom, what is about to go wrong — without reading the whole thing.
- **Status** — LIVE.

### 163. Editing verbs and the pending-change queue

- **What it is** — The dossier is editable, not read-only. Renaming a person, faction or town; adding or removing an institution, resource or hardship; rewriting a paragraph; and the person verbs (reassign, ransom, rescue, recall, champion, stasis) all enter a queue of staged changes with a cascade preview before anything commits.
- **Fed by / feeds** — Fed by the operation vocabulary; feeds campaign persistence, version history, the session ledger, and regeneration preservation.
- **At the table** — The DM renames the innkeeper mid-session, sees what else that touches, and commits — or backs it out — without breaking references elsewhere.
- **Status** — LIVE.

### 164. The settlement workbench

- **What it is** — A second shell around the dossier adding a contextual entity inspector and a save-scoped change dock. It builds no new mutation path: it reuses the same queue.
- **Fed by / feeds** — Reads the dossier's entity web; writes through the pending-change queue.
- **At the table** — When lit, click any name and get a side panel for that entity instead of scrolling back to its section.
- **Status** — BUILT, NOT REACHABLE.

### 165. The Herald — the realm's newspaper

- **What it is** — The realm's right-hand rail, built as a newspaper with seven doors — dashboard, war, faith, trade, events, divination, adjudication — plus two registers: a gazetteer of the living, and ruins and remembrance for the dead. Every event the engine mints is filed under exactly one desk by what the event *is*, never by scanning its prose. A time lens scopes every door to this advance or the whole campaign. The index is keyed on typed entity references rather than name matching. Covert and DM-only entries never surface in a view that could not read them.
- **Fed by / feeds** — Consumes the whole engine's outcome stream — war, trade, faith, rumour and treaty ledgers. Feeds the dossier through clickable names, and the chronicler's letter. The settlement rumour view links *upward* to it; the paper never reads the rumour mill.
- **At the table** — After advancing time, read what changed as headlines grouped by town, click any name, and land in that town's dossier.
- **Status** — LIVE.

### 166. The Herald command brief

- **What it is** — A decision-oriented alternative shell over the same canonical realm items: a briefing rather than a paper.
- **Fed by / feeds** — Same feed sources; adds a shadow accounting layer for diagnostics.
- **At the table** — When lit, a "here is what needs your decision" list instead of a news read.
- **Status** — BUILT, NOT REACHABLE (its diagnostics layer is explicitly never a promotion candidate).

### 167. The chronicler's letter

- **What it is** — A deterministic letter composed from everything that happened since the DM last marked the campaign read, grouped and prioritised, in the house voice. Marking as read moves the floor; export downloads it as plain text.
- **Fed by / feeds** — Reads the news stream and the audience projection; feeds the DM screen.
- **At the table** — Five minutes before the session, read one letter and know what to open with.
- **Status** — LIVE.

### 168. The reference book

- **What it is** — The book about the engine itself: fourteen catalogue views (tiers, economy, power, institutions, operations, magic and religion, living world, map lenses, facets, stress, calamity, neighbours, and an A-to-Z), a global search, and deep-link anchors that help popovers elsewhere jump into. Its data is generated at build time from the engine's own registries, so it cannot drift from the engine.
- **Fed by / feeds** — Reads the generated catalogue; feeds the help popovers across the app.
- **At the table** — A DM who wonders what "strained" actually means clicks the term and reads the engine's own definition.
- **Status** — LIVE (the custom-content manager inside it is desktop-only).

### 169. Custom content authoring

- **What it is** — The DM's own deities, factions, institutions, resources, supply chains and environments, written into the world with review, versioning, archive, and a usage echo showing where they landed.
- **Fed by / feeds** — Feeds the generators, the reference registries and campaign content bindings.
- **At the table** — Add a homebrew god and see it appear in temples and festivals the engine generates.
- **Status** — LIVE (behind a content gate).

### 170. The operation vocabulary

- **What it is** — A complete typed census of every state-changing action the app can take — one hundred and sixty-five registered operations plus a shrink-only exempt list — each with an authored human label and a description. It is a manifest, not a runtime pipe: no action emits an envelope today, which is a documented sequencing deferral rather than an oversight.
- **Fed by / feeds** — Generates the reference book's operations hub; read by the AI review panel for its labels.
- **At the table** — Every verb the app can perform is named in plain English in one place, and the AI proposal review shows the same names the manual interface uses.
- **Status** — LIVE as data; the runtime envelope flow is deliberately not built.

### 171. The Surveyor — the AI layer

- **What it is** — One door leading to an analyst panel, an interview correspondence, and an interpret-and-apply desk that turns session text into *proposed* operations the DM approves, edits or rejects one at a time. Flagged operations cannot be approved without an explicit consent tick, and an operation naming no real command is surfaced as unroutable rather than swallowed.
- **Fed by / feeds** — Reads the operation vocabulary; writes through the store's existing writers; draws on the credits ledger.
- **At the table** — Paste "the party burned the granary" and get a reviewable list of world changes — never a silent rewrite.
- **Status** — LIVE, behind its own entitlement (a premium subscription alone is deliberately not enough).

### 172. DM-versus-player projection and the veil

- **What it is** — Three explicit states: raw, display, and public-safe. The public-safe projection strips every DM-only field behind an allowlist that fails closed, mirrored by the server. The DM screen carries a DM-or-player toggle; exports carry both variants; the dossier itself takes a player-view flag that drops the summary, notes and guidance views and every secret reveal.
- **Fed by / feeds** — Reads every dossier and realm surface; feeds gallery sharing, world export, and the virtual-tabletop module.
- **At the table** — Flip one switch and hand the laptop to the table without leaking the assassin.
- **Status** — LIVE.

### 173. The DM screen

- **What it is** — One desktop page gathering the chronicler's letter, the dossier summary, the session ledger and the forecast, with the player-safe second face.
- **Fed by / feeds** — Reads all four; gated by the audience projection.
- **At the table** — One tab open during play instead of four.
- **Status** — LIVE.

### 174. The session ledger — the table feeding the world

- **What it is** — The loop back the other way. The DM records what happened at the table as a typed, bounded entry: pick a kind from a closed vocabulary, pick a target, set a magnitude band, add free-text flavour. An optional clerk reads free text and *proposes* buckets; free text is flavour only and never reaches the mechanics.
- **Fed by / feeds** — Enters the same pending-change queue as manual edits; feeds the world pulse.
- **At the table** — The party sacks the warehouse; the DM logs it; next advance, the town's economy knows.
- **Status** — LIVE.

### 175. Advance time, and its refusals

- **What it is** — The control that moves the world clock a week, month, season or year, with multi-week advance and a pause cursor: an advance can stop mid-way for the DM's verdicts and resume. Every refusal speaks plainly instead of silently doing nothing.
- **Fed by / feeds** — Drives the advance orchestrator and the whole simulation; feeds the newspaper, the undo stacks and campaign persistence.
- **At the table** — Click "advance a season" and either the world moves or the DM is told exactly why not.
- **Status** — LIVE.

### 176. Undo history

- **What it is** — One newest-first list over two snapshot stores — the pre-advance stack and the pre-apply ring — letting the DM walk back to any point through the existing undo paths. Rows read only non-secret scalars, so the panel itself cannot leak. Session-scoped: a reload clears it, except a paused advance's return point, which survives.
- **Fed by / feeds** — Reads the advance and AI-apply lanes.
- **At the table** — Advance, dislike the result, step back to before it.
- **Status** — LIVE.

### 177. Save, version history, and regeneration

- **What it is** — Settlements save to a library with a capped snapshot timeline for draft and saved siblings, revert-to-snapshot, and section rerolls that carry the DM's own written characters through the reroll by having them take over a fresh slot rather than joining alongside.
- **Fed by / feeds** — Reads the generators and pending edits; writes the campaign folder and persistence.
- **At the table** — Reroll the cast and the three people the DM wrote themselves are still there, still referenced correctly.
- **Status** — LIVE.

### 178. The world-laws dialog and the character presets

- **What it is** — The DM's control over the campaign's own physics: propagation, intensity, migration, world progression, political autonomy, and spatial, travel and information modes — chosen by preset or tuned in a detail drawer. Untouched keys stay virtual, so a campaign that never opened the dialog persists identically to before. Separately, seventeen character archetypes preset the generation sliders for a settlement.
- **Fed by / feeds** — Writes the world-law settings the whole engine reads; the archetypes feed the generation wizard.
- **At the table** — Four honest presets in a grid — a recorded world, an authored world, routine life running itself, or the whole engine acting on its own — plus eight fine-grained switches.
- **Status** — LIVE. Note: none of the thirteen engine-gated switches can be reached from this dialog.

### 179. Exports

- **What it is** — Four routes out: a settlement print export, a campaign print export, the world book (chronicle plus dossiers plus map plus realm plus receipts), and a virtual-tabletop module package; plus a versioned world portrait in DM and player variants, and a campaign import that reviews before it commits.
- **Fed by / feeds** — Reads the dossier view-model and the veil; gated by the entitlement ladder.
- **At the table** — Print the town for the table, or drop the whole realm into a virtual tabletop as journal entries.
- **Status** — LIVE.

### 180. Premium surfaces and the entitlement ladder

- **What it is** — Four separate gates that are deliberately *not* the same question: the authoring authority (may this viewer edit), the export ladder (a durable per-dossier download right, priced separately from the subscription), the AI-layer entitlement, and elevated roles. Every one fails closed.
- **Fed by / feeds** — Reads the account state; gates the dossier, exports, the AI layer and the gallery.
- **At the table** — A DM who bought one dossier's export keeps that download forever, even after a subscription lapses.
- **Status** — LIVE.

### 181. The generated prose corpus

- **What it is** — Authored sentence pools that let the engine describe a state in varied, non-repeating English. The pools live in twelve annexes; a strict projection script compiles two of them into checked-in data so the runtime never parses prose files, and it fails loudly if a single variant is silently dropped. The other ten reach the runtime through per-lane pool modules.
- **Fed by / feeds** — Feeds every dossier section, the newspaper headlines and the chronicler's letter.
- **At the table** — The same condition described a dozen different ways across a campaign, so the app never sounds like a form letter.
- **Status** — LIVE.

### 182. Run-of-play surfaces

- **What it is** — Three small things that matter mid-session: a command palette that jumps to any page, save or figure from the keyboard; a narrow phone-width table view for running the session; and a distraction-free session-mode overlay.
- **Fed by / feeds** — Read the dossier and realm state; write nothing.
- **At the table** — The DM keeps their hands on the keyboard and their eyes on the table.
- **Status** — LIVE.

### 183. Notes and campaign context

- **What it is** — Notes split into private DM notes and the campaign context that is shown for confirmation before any AI run, so the DM always sees what will be sent.
- **Fed by / feeds** — Feeds the narrative pipeline and the dossier.
- **At the table** — Private jottings stay private, and nothing goes to a model without being shown first.
- **Status** — LIVE.

### 184. The gallery and the public dossier

- **What it is** — An owner-free, read-only public view of a shared dossier, plus a gallery of shared worlds. Everything passes the public-safe projection first.
- **Fed by / feeds** — Reads the veil and the entitlement state.
- **At the table** — Share a town with the table or the internet without handing over the secrets.
- **Status** — LIVE.

### 185. The travellers overlay and the road scene

- **What it is** — An overlay draws armies, migrant columns and named envoys as markers positioned along their real paths, with a filter per kind. A "stage the road" panel takes an origin and a destination and composes the road's condition per hop, who is on it, and what waits at the gates, with a player-safe variant that strips everything secret. Both are pure lenses and write nothing.
- **Fed by / feeds** — Reads the column ledger, army transit, the roads ledger, route danger, tolls, war fronts, sieges and festivals.
- **At the table** — Mid-session: "Here is the road you are taking, here is who else is on it, and here is what is waiting at the far gate."
- **Status** — LIVE (renders nothing when the underlying ledgers are dormant).

### 186. The faith panel and its three gates

- **What it is** — The faith surface — patron, pantheon ranks, the piety arc, the unaffiliated share, legitimacy, the divine mandate, and the cause chains as sentences — mirrored into the print export. It is premium-gated in three distinct modes: a settlement carrying live embeds renders read-only to everyone including a shared premium pantheon; a free viewer with no embeds gets a generic neutral teaser that can never name a deity; a premium viewer with no deities sees nothing.
- **Fed by / feeds** — Reads the pantheon, piety and deity couplings; carries the DM's set-patron and impose-cult verbs, both undo-clean.
- **At the table** — Read a town's religious life at a glance, and change its patron deity from the same panel.
- **Status** — LIVE.

---

# TIER SIX — THE UNBUILT

*Five sealed or near-sealed architectures and one harness, with little or no implementation. Roughly fourteen and a half thousand lines of design carrying, in three cases, zero lines of code. This tier exists so the ontology is honest about where the product is going as well as where it is.*

### 187. Espionage — learning about places you cannot see

- **What it is** — A court decides on its own to send someone to another settlement under a false errand: the public story says trade envoy, the real itinerary is two or three stops of watching. If the traveller survives he comes home with three kinds of report — he confirms something the court suspected, acquires something it never knew, or refutes something it believed wrongly. If he is caught he becomes a hostage with a ransom price, and his absence costs his faction council weight and costs him his own standing on the career ladder. Every court has a doctrine — whom it watches, whether it uses lawful or lawless ways, how often it sends, how it treats the people it sends — read off the two alignment axes the world already computes. The doctrine sheet is itself a stealable and forgeable object.
- **Fed by / feeds** — Would feed *from* the belief map's believed-world axes, the errand spine, alignment, the cast and the career ladder, the corruption web, and disinformation. Would feed *into* the belief record (its three products are belief writes), the sovereignty market (spy-fed appraisal is what lets a distant holding be priced), the news feed, information statecraft, and later the habit layer.
- **At the table** — A rival kingdom two hundred miles away starts pricing a duchy it has never traded with, because its spy came back last month; and a court that sends nobody for three years finds its neighbours quietly stop trusting what it says about the far side of the map.
- **Status** — One wave of eight built: three pure calculation leaves plus the switch and its manifest and certification trio. **Double-blocked**: it cannot be lit even deliberately, because its gate requires an errand-spine switch belonging to a wave that has not been built. Its own certification prose names it a subsystem with a gate and no caller.

### 188. Wayfare — everything on the map is real, and everything real is conserved

- **What it is** — Every moving thing gets a true position and a click-to-read popup: armies and fleets sized by strength band, caravans carrying actual goods debited from a real warehouse, envoys and travellers, and columns of migrating people. Distance becomes the map's declared scale rather than an abstract two-to-eight-week normalisation, so a long road is genuinely long. Big news survives more road hops than small news, and only deliberate lying beats that floor. The map invents nothing: it shows records other systems wrote. A governing ambiguity law says a marker is a *presence*, never an intention.
- **Fed by / feeds** — Would feed from commodity flow, the migration ledgers, army and naval transit, the roads system, the rumour and news layers, and faith shares. Would feed the map surfaces, the dossier views and the print export — all three forced through one shared projection builder so they can never disagree — plus the war programme (army supply becomes a carried cargo) and espionage (covert legs must not leak onto the canvas).
- **At the table** — Freeze the world mid-week and see the actual caravan halfway down the road it really took, click it, and read what it is carrying and who sent it; and when a town's caravans stop arriving, the towns downstream go quiet on news about it without any label saying so.
- **Status** — DESIGNED, NOT BUILT — zero waves, nine designed record fields with none in source. Two live-code consequences worth naming: the shipped travellers overlay currently draws direction chevrons and states arrival times, which the ambiguity law forbids, so the first surface wave is a *deletion* of a live feature; and refugee population flows still teleport in one lane, running a non-physical migration regime alongside two physical ones.

### 189. War circulation — armies made of specific people from specific places

- **What it is** — Allies, vassals and occupied towns can send troops and supplies to *someone else's* army instead of fielding their own, and the sending is remembered as credit, charity or debt at the moment of arrival. Armies stop being a strength number and become origin-tagged blocks of people: this village's forty, that city's two hundred. Every person is conserved from census to block to army to casualty list to homecoming, structurally enforced end to end. Blocks that fight together build comradeship; blocks that hear bad news from home decide to stay, return, defect or resist. At war's end the army dissolves — some go home and rebuild the population and the walls, some drift off as free companies and become the world's brigands and adventurers.
- **Fed by / feeds** — Would feed from the war layer (levies, deployments, attrition, sieges), treaties and alliance ledgers, demographics, the lawful-and-chaotic axes, and the news system (block forks are news-gated). Would feed population and defence readiness, internal security and crime pressure, the mercenary market, war exhaustion and peace terms, diaspora relationships between settlements, and by design the habit layer (veterans carry learned habits into the next war) and Wayfare (supply becomes physical cargo).
- **At the table** — The second war's army is visibly greener than the first, because the veterans who would have stiffened it died in the first — nobody wrote a war-weariness rule; it fell out of counting bodies. And the next batch of bandits on the road has a name: the free company that never went home.
- **Status** — DESIGNED, NOT BUILT — zero of seventeen waves, six planned switches, none in source. The volume is an in-progress snapshot rather than a sealed design, with six collisions parked for the chair — including two live gates that currently forbid outright the allied and self-deploying cases the owner directive asks for.

### 190. Living futures — the past is fixed, the future is redrawable

- **What it is** — Every time the DM advances time, the world mints a fresh random seed and writes it into the history log. Undo deletes that entry; advancing again mints a *new* one, so the same world tells a genuinely different — and equally plausible — story. Replaying a recorded history feeds the recorded seeds back, so it comes out byte-identical and bug-chasing still works. The same law extends to every generate and reroll control: clicking always draws fresh, typing a seed always returns the exact starting world.
- **Fed by / feeds** — Would feed from the advance action, the history and action log, the undo system and the generation pipeline's reroll controls. Would feed the world pulse's random-stream identity, every subsystem that draws randomness, save and load, and the product's own marketing claim.
- **At the table** — A DM who dislikes where the last two years went undoes them, advances again, and gets a different plausible history — while the years they already played and loved stay exactly as they were, forever.
- **Status** — DESIGNED, NOT BUILT — zero of sixteen waves. The design is **sealed**: chair-attested after six adversarial rounds, with thirteen of its own premises refuted and struck along the way. It is the one programme that amends the product's constitutional promise (owner-signed): a seed is now a *starting world* forever, not a whole timeline. Its honest scope is nine token-level edits on the kernel's stream identity plus a much larger re-rooting of twenty-five random-number compositions across sixteen modules that today read the world seed directly.

### 191. Habit conditioning — courts learn what works, and being known is the price

- **What it is** — When a court makes a decision and the outcome is graded, the world remembers: choices that worked in that kind of circumstance become more likely, choices that failed less. The formulas never change — a single learned number enters as an input, so replay still works exactly. Each court accumulates a doctrine sheet of at most twelve lines, one per circumstance class, which is simultaneously a game input, a readable narrative object, and something a spy can steal or a liar can forge. Chaotic courts learn faster and forget faster; lawful ones are steadier. Rivals can anticipate a known court, but only one level deep, deliberately.
- **Fed by / feeds** — Would feed from the disposition ledger, every graded outcome vocabulary and the severity ladder, the law-band vocabulary, and strategic posture. Would feed roughly fifty decision forks across war, trade, faith, route creation and goals, plus the believed-world axes (doctrine becomes a fourth believed family), espionage (the doctrine tap and planted sheets), and the war chooser.
- **At the table** — A receipt that says the duke marched "as this court reliably does when its granaries run thin" — and later, a rival court that stole that doctrine sheet positioning itself for exactly that move.
- **Status** — DESIGNED, NOT BUILT — zero of ten waves, four planned switches, none in source. A mid-round snapshot rather than sealed. Its most important internal correction: the guarantee that learning cannot be tilted into a lock was proven false as first stated and re-expressed on pairwise odds ratios. A named collision hazard: the shipped momentum system looks like this and is not — momentum is sunk cost in a course, habit is learned success of an action, and a future lane must not unify them.

### 192. The diagnostic soak harness

- **What it is** — A composition-soak harness scheduled for the moment the build is complete but still dark: it runs long horizons across many seeds and reports findings only. It is forbidden from ever signing off a certification band or adjusting a tuning constant — its output is evidence for a human, never an authority.
- **Fed by / feeds** — Would consume the world pulse and the certification instruments; would feed the currently-empty certification evidence file.
- **At the table** — Nothing directly. It is the instrument that would let the product finally *claim* the long-horizon behaviour it currently declines to claim.
- **Status** — DESIGNED, NOT BUILT.

---

# THE INTERACTION LOOPS

*The systems above are the vocabulary; these are the sentences. Each loop below crosses at least three domains and is walked in order, step by step. Where a step is unlit today, it is marked, so the loop reads both as it runs now and as it is designed to run.*

## Loop 1 — The hunger loop (a bad harvest becomes somebody else's problem)

1. **Resource drift** or a **season** thins the yield, or a **festival cancellation** signals a lean year.
2. The **food ledger** recomputes calories against need, terrain fertility, institutions and import coverage — and comes out negative.
3. The **granary** begins its slow drawdown, rationing the release so the shortage lasts seasons rather than a week; a mild deficit still tithes into storage, so the lord's stores fill while tables thin.
4. **Stressor promotion** turns the shortfall into a real **famine condition** with a severity nudged worse by the town's own poverty and lack of defence.
5. The **causal substrate**'s food, labour and social-trust readings fall; the **capacity model** (unlit) would report that food *demand* did not change — supply did.
6. **Law and order** drops as **criminal opportunity** rises; the **safety profile**'s black market grows more attractive.
7. **Legitimacy** falls, because a government that cannot feed its people is visibly failing.
8. The **coup contest** window opens, recomputed live: if the party has been shoring up the magistrate, he holds and purges; if not, the **governing seat transfers** and the government's label changes.
9. Simultaneously, **population dynamics** shed people. On an unmapped world, **aspatial migration** hands them to neighbours instantly. On a mapped world, the **refugee column** splits them three ways — dead at the origin, dead on the road, arriving — chosen by closeness, **culture distance**, safety, prosperity and open doors.
10. The column enters the **in-transit ledger**, walks for weeks, and carries **rumours** with it (unlit) — the news of the famine arrives one week behind the people.
11. Arrival raises the destination's crowding; the **demographic homeostat** (unlit) would then have that destination compete for, or refuse, further arrivals.
12. The origin's shrunken population lowers its **military capacity**, which its neighbours eventually learn through the **belief map** — and a neighbour whose **decision-maker** reads weakness now has an **opportunism** case in its **reasons ledger**.

## Loop 2 — The scarcity-to-war loop (a played-out vein becomes an occupation becomes a grievance)

1. **Resource dynamics** exhausts a non-renewable and removes it for good; the **economic profile** is surgically reconciled and prosperity falls a band.
2. **Supply chains** lose a step; **finished-goods demand** now shows a gap; the **caravan layer** must import what the town used to make.
3. **Trade salience** scores the new dependency as vital, which makes hostility toward the supplier expensive but makes the *supplier* strategically important.
4. The **reasons ledger** stands up a resource-pressure case against a neighbour who has what this town lost, with a receipt sentence and the week it began.
5. The **disposition ledger** — and, when lit, **strategic posture** — colours how much risk this court will take; the **ruler's books** decide whose money pays.
6. The town's **decision-maker** samples its moves and picks "march," leaving a dated **march order** naming the target.
7. **Mobilisation** climbs peace, alert, preparation, mobilised over weeks — visible warning the party can act on.
8. The **war opener** consumes the order; an **army record** is minted; a **front** opens into the target.
9. On a mapped world the army **marches a real route**, can be **intercepted in the field**, and can be **convoyed by sea**.
10. The **feasibility gate** decides whether this is even a contest; if it is, one seeded **siege roll** decides it, biased by the defender's **will** where lit.
11. Win: **occupation** begins at "contested," yields almost nothing, costs a garrison burden, and climbs only with a sustained margin. Lose: the army **comes home** depleted and may splinter.
12. **War exhaustion** ratchets up at home fast and decays five times slower; **conscription** thins the villages; the **war political loop** raises coup odds against the seat that started it.
13. Eventually somebody **sues for peace**. The winner's **believed** advantage mints a budget, **appraises** the loser's holdings through its own possibly-wrong lens, and drafts up to three **treaty terms**, each with an expiry.
14. **Tribute** moves real grain out of the loser's granary every week — which feeds straight back into Loop 1 at the loser's end.
15. **Compliance** evolves under fog: a strained loser under-delivers, and whether the winner notices depends on its reach. Sustained strain breeds **resentment**; a detected default becomes a fresh typed **reason for war**, and the loop restarts with the sides reversed.

## Loop 3 — The severed road loop (a war two valleys away closes a smithy)

1. A **front** opens somewhere in the realm; **route danger** rises along the affected corridors with hysteresis so it does not flicker.
2. A **caravan** carrying iron finds its gate hostile; **route choice** looks for a cheaper or safer path and may take a longer one.
3. If every ranked source is severed and the local buffer is empty, the **supply-shipment layer** marks the institution **starved**, with a written reason.
4. The smithy becomes **impaired** in the **institution status model** — standing, but not working.
5. **Supply chains** lose their finished-goods step; **military capacity** falls, because weapons are one of its inputs; the **defence ledger**'s conventional score drops.
6. The **causal substrate**'s economic capacity and infrastructure readings fall; **prosperity** steps down.
7. **District profiles** re-read the town: the smith's quarter's wealth band falls and its tension line changes to the real cause.
8. Lower prosperity raises **corruption onset** hazard and lowers **exposure** chance, so this is the moment the guild buys the harbourmaster.
9. **Criminal opportunity** rises; **smuggling** (where lit) becomes the profitable channel precisely because the honest route's expected value went negative.
10. **Commercial grievances** (unlit) would stand up a route-predation or contraband-injury case, mirrored by its own opposite when the road is safe again.
11. When the war ends and the front closes, danger decays, a shipment lands, and the starvation **lifts the same week** — the loop is genuinely reversible, which is why a party clearing a road is a mechanical intervention and not just a scene.

## Loop 4 — The information loop (a rumour starts a war)

1. Something significant happens — a razing, a mobilisation, a coup — and is written into the world's **news record** at the settlements that witnessed it.
2. The **rumour network** carries it hop by hop along roads, sea lanes, army marches and smuggling runs, at a week or more per leg, seasonally priced.
3. On each hop the telling **degrades**: a detail drops, a magnitude is exaggerated, occasionally a name is swapped for a different real town.
4. **Lineage** keeps track of which witness each telling descends from, so five relays of one story count once.
5. **Distance-priced staleness** additionally ages the fact for a distant hearer, on the one shared curve.
6. The **belief map** folds the arrival in, pulling the town's picture toward the report in proportion to how garbled it was; contradictory reports widen doubt rather than settling it.
7. **Per-faction belief** (fullest setting) splits it: the merchants heard it from a caravan, the military from a marching army — and if their pictures diverge sharply from the seat's, a **council schism** is recorded.
8. The **decision-maker** reads the *believed* world: believed strength, believed readiness, believed alliances.
9. It commits to a march on a picture two bands off the truth. The engine stamps a **misjudgment** and writes the headline.
10. The war goes badly. The **disposition ledger** learns from the resolved outcome; **strategic posture** (unlit) would colour the next decision.
11. **Information statecraft** (unlit) closes the loop deliberately: a court that lies about its garrison spends **credibility**, and when the lie is exposed it is discounted next time it speaks — including when it speaks the truth.

## Loop 5 — The corruption loop (a flaw becomes a scandal becomes a fresh face)

1. **Crime** and a **criminal institution** exist; a named person's **character sheet** carries a corruptible flaw.
2. **Corruption onset** compounds over time, raised by crime pressure, lowered by internal security and prosperity, and swung by the patron deity's moral axis amplified by **piety**.
3. The person is turned. **Faction capture** climbs its ladder from adversarial toward corrupted as more and more senior seat-holders are compromised.
4. **Law and order** falls, because compromised security institutions do not enforce; **guild strength** rises, which lowers the chance anybody is caught.
5. **Exposure chance** rises with a healthy town and falls where the guild is strong — a self-limiting loop rather than a spiral.
6. Exposure fires: a **corruption-scandal condition** lands, the criminal institution and the corrupt figure's own house are both **impaired**, **legitimacy** dents.
7. The **assize** (unlit) would seat this as a public judgment with fines routed through the generosity ledger, resentment raised, unrest relieved.
8. The **ouster** installs a **successor** in the same seat, inheriting role, faction, institution and importance, but with a clean identity and a deliberately honest temperament — a genuine respite.
9. The **consequence economy** (unlit) would then issue the disgraced person a permanent identity, reach a verdict from a closed four-word vocabulary, strip influence from both places it is stored, emit the seat as a contested opening, and set the person walking.
10. **Wanderer reputation** (unlit) means the story travels at news speed: he is refused at the gate near the scandal and admitted six weeks up the road.
11. **The DM's three verbs** are the only exit: assign him somewhere, pardon him, or kill him — and only the last of those ends a person, only by a human hand, and it can be taken back.

## Loop 6 — The faith loop (a plague makes a god)

1. A crisis — plague, famine, siege — lands as an **active condition**.
2. The **unaffiliated bucket** floods back into the pews: hard years drive people to religion, comfortable ones drain them away.
3. The **religious contest** grows the fastest-growing faith, weighted by rank, carriers, regional prevalence and receptivity.
4. **Faith legitimacy** moves far more slowly: it accrues only by holding the seat, by the ruler's endorsement, by neighbours recognising it, and by conduct — so a cult can out-convert the church and still have no *right* to the seat.
5. If the patron seat does change hands, the engine stamps a **conversion**, re-embeds the new patron on the settlement, and seeds a **fracture stressor** that spreads along religious authority.
6. The new patron's two **alignment axes** re-couple everything downstream: **corruption** direction and magnitude, **law and order**, **magic legality** in the magic profile, and war appetite through domain pressure — all multiplied by local **piety** and coloured by the **clergy lens**, so a corrupt priesthood weakens its own god's grip.
7. **Traditions** re-dedicate: devotional rites shift owner and patron, and the rite's dated history records why.
8. The next **festival** either lands or fails on prosperity, season, ruler standing and war pressure — and its outcome nudges one share point between the patron and the largest rival, steps prosperity a band, and moves legitimacy.
9. **Culture distance** to neighbours changes, because shared gods is its strongest term — which changes where refugees choose to go and what a smuggler's gate treats as foreign.
10. Under occupation, **faith pull** lets the occupier's god start winning the occupied city's faithful — which is how a conquest becomes a conversion without a single line of theology being adjudicated.

## Loop 7 — The occupation loop (a victory becomes a burden becomes a vassal or a revolt)

1. A **siege** resolves in the attacker's favour; the conquest **disarms** the local military faction, humbles the deposed seat and suppresses civic factions.
2. An **occupation** record opens at "contested": it yields the occupier essentially nothing and costs a garrison burden that grows with every further holding.
3. **War exhaustion** at home carries that burden; the occupied population's resistance raises it further, so a resisting occupation costs more than it yields.
4. Each rung — contested, unstable, extractive, stabilised, vassalised — requires a sustained margin held over several weeks. No flips.
5. **Tradition imposition** begins: once a year the vassal may be forced to trade one of its rites for its overlord's, and the displaced rite is *suppressed, never deleted*.
6. Meanwhile the returning **army comes home**; a strong army elsewhere can break this occupation outright, and the occupied town's own allies may relieve it.
7. If it reaches vassalage, the **relationship hierarchy** cascades: the new vassal's old alliances can be dragged into the overlord's wars, and **levies** of men and grain begin at a loyalty cost.
8. Only now does the holding become **sellable** in the sovereignty market (unlit) — a free settlement is never a commodity.
9. If the occupation ends instead, **liberation** restores the suppressed rites intact the following year and removes the imposed one, and the whole story is readable in the rite's own dated log.

## Loop 8 — The trade-tie loop (a dependency becomes leverage becomes an embargo becomes a war)

1. A **supply chain** gap makes a town dependent on a specific supplier for a specific good.
2. **Trade salience** prices that tie: vital if the good is grain to a food-insecure town or iron to a militarising one, negligible if the good is luxury and the sellers are many.
3. High salience **dampens hostility** on the relationship edge — valuable trade does not make friends, it makes fighting expensive.
4. A challenger contests the prize: the **trade war** scores supply completeness, economic strength and standing with the buyer, and a win **re-points the dependency**.
5. The beaten incumbent either winds down into a cold war or turns hostile and deposits a **march order**.
6. Alternatively, the tie dies by conscience: the **institution tolerance** path has a buyer penalise a supplier whose worst institution offends it — a slave market under a saintly town's nose cuts trade to a trickle, never to zero.
7. Or it dies by decision: a merchant or warlord seat picks "close our markets to them" as its **move of the week**.
8. Or it dies by tension: a valuable, hard-to-replace dependency plus rising military or religious tension **collapses into an embargo**.
9. **Commercial grievances** (unlit) record which of the eight typed causes it was, and its exact mirror when relations warm.
10. The cut-off town's **food or military capacity** falls (Loop 1 or Loop 2), its **prosperity** steps down, and its **reasons ledger** stands up a dependency or exclusion case — which its **decision-maker** may cash as a war.

## Loop 9 — The growth loop (a town outgrows its fields)

*Largely unlit today; walked here as designed, because it is the loop that makes a settlement's size mean anything.*

1. The **food ledger** and the **granary** set a carrying capacity; the tier sets a density ceiling.
2. The **demographic engine** (unlit) runs births minus deaths, with named characters exempt from the death draw.
3. Crowding, poverty, danger and hunger score as **push drivers**, each with an applicability guard so a garrison town does not shed soldiers over poverty.
4. The town's **plan system** chooses between emigration, imports, infrastructure, promotion, or **founding a satellite** — the last of which creates a parent-and-child lineage with a claim when the child outgrows the parent.
5. Emigrants are classed refugee or voluntary; voluntary ones are choosy and stay unless a destination clearly beats home.
6. **Destinations compete**: reachable, viable settlements are ranked and their spare room consumed in order, with people already walking counted against capacity. Whatever the realm cannot house is reported **unplaced with a named reason**.
7. Arrivals raise the destination's tier over time; **tier drift** changes what institutions are legal there, which changes its economy, which changes its own carrying capacity.
8. Enough crowding and pressure makes a court willing to **sell a holding** (unlit) rather than feed it — which is how a settlement changes hands without a war.
9. Every step of it appears in the **news feed** as a readable line, which is the difference between a simulation and a spreadsheet.

## Loop 10 — The festival loop (a rite is a barometer and a lever at once)

1. A **founding observance** and its accrued customs sit on the settlement from generation, each with an immutable core and a calendar window.
2. Each year the window opens and the **festival engine** scores it: prosperity, season, ruler standing, war pressure, an active crisis or boom, whether the grandeur exceeds what the town can afford, and last year's memory.
3. A plague, famine, siege, occupation, severed trade lane or desperate economy **cancels it outright** — the rite is a live barometer of everything above.
4. **Pilgrimage** (mapped realms) pulls crowds from reachable neighbours, which lifts the odds — so connectivity is worth something cultural, not only economic.
5. The outcome pays out: a triumph or failure **steps prosperity a band**, moves the ruling seat's **legitimacy**, and nudges one **pantheon share** point between patron and rival.
6. The **owner** of the rite — the seat, a temple, a guild, the merchants, the military — bears half the legitimacy consequence, so the DM has a faction to blame or reward.
7. A successful market fair on a real **trade lane** earns an extra prosperity step from the merchants it drew — the loop back into Loop 8.
8. The result is written into the **rite's own dated history**, so a century later the DM can read why the festival looks the way it does.

## Loop 11 — The table loop (the party's actions become the world's next week)

1. Something happens at the table.
2. The DM records it in the **session ledger** as a typed, bounded entry: a kind from a closed vocabulary, a target, a magnitude band, and free-text flavour that never reaches the mechanics. An optional clerk *proposes* buckets from free text; it never decides.
3. Alternatively the DM pastes the session's text into the **Surveyor**, which proposes operations named from the same **operation vocabulary** the manual interface uses — approved, edited or rejected one at a time, never applied silently.
4. Either road lands in the **pending-change queue**, where a **cascade preview** shows what else the change touches.
5. On commit, the change enters the world; **version history** snapshots the before.
6. The DM presses **advance**. The **orchestrator** runs the real weeks through the **world pulse**, pausing if a major decision needs a verdict under the **change-authority contract**.
7. The week's outcomes are filed by the **newspaper** under exactly one desk each, by what they are.
8. Before the next session the DM reads the **chronicler's letter**, composed from everything since the last time they marked the campaign read.
9. If they dislike the result, **undo history** walks it back through the same paths that wrote it.
10. And the **forecast** lets them ask the question ahead of time — running the *real* orchestrator over a clone, so preview and apply cannot diverge.

## Loop 12 — The plague loop (a sickness crosses a realm)

1. An **outbreak** is minted — by the DM's button or by the generic stressor path, deliberately the same object.
2. **Stressor promotion** creates the condition with a severity worsened by the town's own poverty, food shortage and lack of defence.
3. **Healing demand** rises — the number of healers did not change, the number of patients did — and **religious welfare** demand rises with it.
4. **Labour** falls as the fields go unworked, feeding straight into the **food ledger** and Loop 1.
5. **Social trust** falls and stays fallen: quarantine distrust is a named scar that outlives the outbreak.
6. **District tension** re-reads: the poorest, densest quarters carry the visible burden.
7. Spread runs along named channels — **trade routes**, **migration pressure**, **service dependency** — so the sickness follows the caravans the economy actually runs.
8. Neighbours receive it as a **roaming stressor**; the **rumour network** carries the news at its own, slower speed, so a town can be infected before it is informed.
9. Resolution runs faster where **healing capacity** is high — which is a direct reward for the institutions the town chose to build.
10. Afterwards, the scars remain in labour and trust, and the **demographic engine** (unlit) would record the population loss as permanent rather than recovered.

## Loop 13 — The mapping loop (one button wakes the physical world)

1. The DM places settlements — by hand, or with the **automatic placer**, which matches each settlement to ground whose terrain agrees with the settlement's own generated terrain, keeps tier-scaled minimum distances, rewards closeness to the third-nearest neighbour, and itemises every proposed move for consent before acting.
2. The DM presses **map the geography**. The **frozen distance digest** is computed once: terrain quantised to integer cost, one flood-fill from every settlement carving territories, the cheapest boundary crossing between each pair becoming the **gate** and the road, then the full distance table, neighbour tiers, and a receipt per hop.
3. **Travel time** calibrates itself: the map's own median hop becomes one week, so a neighbour is a week away and the map's diameter is about a season.
4. Overlays wake where enabled: **seasons** surcharge terrain without ever severing it, **sea lanes** turn a harboured island into a hub, **teleport edges** make magically linked pairs near-instant.
5. Everything physical now runs: **caravans** follow real routes and can be cut; **refugee columns** walk and lose people on the road; **armies** march, are **intercepted in the field**, and are **convoyed by sea**; **named people** hop one leg a week; **rumours** propagate hop by hop; **consequences** are parked with an arrival week.
6. **Route danger** and **tolls** begin scoring those routes, which feeds **entrepôts** — towns that trade physically flows through — which feeds **prosperity**, which makes those same towns the **first targets** an army marches on.
7. The **travellers overlay** and the **road scene panel** render all of it as something the DM can point at mid-session.
8. Unmapped, none of the above runs: the world falls back to the aspatial migration path and instant news, which is a coherent, cheaper world rather than a broken one.

---

# THE EXPERIENCE — WHAT THE WHOLE THING IS FOR

*Each promise below is tied to the systems that deliver it. A promise with an unlit dependency says so.*

- **"A seed is a world, forever."** Write one string down and any DM anywhere regenerates your realm exactly — the same third tavern, the same reeve's tell. *Delivered by:* the seeded dice and fork tree, the fail-closed draw, determinism enforcement, the generation pipeline, dormancy goldens. *Amended by design:* the living-futures programme (unbuilt) will make a seed a fixed *starting world* whose future can be redrawn, while everything already played stays immutable.

- **"Prep a region in four questions, not four evenings."** Answer realm size, tone, map kind and magic, and get a placed, populated, internally coherent region. *Delivered by:* the instant world plan, the map, settlement configuration, resources, automatic placement, the regional graph.

- **"Every fact has a reason, and the reason is one click away."** No number in this product is decorative. Ask why law and order is strained and get named causes with sentences. *Delivered by:* the causal substrate, the ledgers (food, defence, governance, healing, magic), route receipts on every hop, the reasons ledgers for war and commerce, the recorded-causality ledger (unlit) which would upgrade inference into recorded fact.

- **"The world moves without you, and tells you what it did."** Advance a week or a year and read the result as a newspaper rather than a diff. *Delivered by:* the world pulse, the advance orchestrator, the newspaper's seven desks and two registers, the chronicler's letter, the full-address news law.

- **"Your table's actions are the world's inputs."** What the party did on Thursday is what the world reacts to on Friday, through a typed vocabulary rather than free text. *Delivered by:* the session ledger, the operation vocabulary, the Surveyor's propose-and-approve desk, the pending-change queue and its cascade preview.

- **"Nothing important happens behind your back."** The DM approves the premise; bounded consequences follow without pestering. *Delivered by:* the change-authority contract, the decision-tier classifier, the approval queue, the pause-and-resume advance, undo history.

- **"Preview is not a guess."** What the forecast shows is what the advance does, because it runs the same code over a clone. *Delivered by:* the forecast's clone-and-discard construction over the real orchestrator.

- **"Hand the laptop across the table safely."** One toggle turns the DM's screen into the players' screen with every secret gone, and the same split holds in every export. *Delivered by:* the three projection states, the fail-closed public-safe allowlist mirrored on the server, the DM-only interior rooms, the covert-tie gating in trade and rumour readings.

- **"Distance is real, and so is delay."** A relief column takes the weeks the terrain says it takes, and news arrives when the road allows. *Delivered by:* the frozen distance digest, travel-time calibration, seasons and sea lanes, the rumour network, the arrival queue. *Requires:* the realm to be mapped.

- **"Your enemies act on what they believe, not on the truth."** The most human failure mode in the product is a court marching on a stale picture — and the engine writes the headline naming the misjudgment. *Delivered by:* the belief map, distance-priced staleness, corroboration by independent lineage, per-faction belief and the council schism, the belief-reading decision-maker.

- **"Wars are about something, and they end for reasons."** Sixteen typed grounds for war, each mirrored by a ground for peace; feasibility before dice; treaties with named clauses and expiry dates. *Delivered by:* the reasons ledger, mobilisation, the feasibility gate, the siege contest, attrition, war exhaustion, the treaty catalogue, compliance under fog. *Partly unlit:* the termination reading, the coalition stack, conquest doctrine and razing.

- **"Your world is your cosmology, not ours."** The product ships no gods and adjudicates no theology; you author your pantheon and the engine models believers. And you can declare a mundane realm in one click, which is stamped into every settlement rather than gated at read time. *Delivered by:* the no-premade-pool doctrine, the faith-agnosticism law, the realm magic question, the single magic reader.

- **"A named character's fate is yours alone."** The world will ruin a person, corner them, strip their office and shut doors against them — and will never tell you they died. *Delivered by:* the state-never-fate law across the ladder, contests, credibility and circulation; the single DM-pressed removal verb with its typed inverse.

- **"You can rewrite anything without breaking everything."** Rename, add, remove, reroll — and the references still resolve, and your own written characters survive the reroll. *Delivered by:* the pending-change queue, cascade preview, version history, regeneration preservation, pinned people, bounded person editing.

- **"The app tells you what it does not know."** Where an economy reading is stale, it says so. Where the long-horizon behaviour has not been measured, the certification panel says the proving is scheduled rather than inventing a number. *Delivered by:* the economy freshness layer, the certification instruments and their deliberately empty evidence file.

- **"It reads like a book, not a form."** Roughly nine thousand authored sentence variants across twelve annexes mean the same condition is described a dozen different ways across a campaign. *Delivered by:* the prose corpus, the strict projection that fails loudly on a dropped variant, the herald's voice.

---

# HONEST BOUNDARIES — WHAT THE SIMULATION DELIBERATELY DOES NOT DO

*These are rulings, not gaps. Each has a reason, and in most cases the reason is that crossing the line would take something away from the DM.*

- **It never resolves a named character's fate.** No named person ages, dies of natural causes, is killed by an army, or is executed by the world. Every lane produces a *state* — disgraced, imprisoned, banished, wandering, replaced in their seat. Exactly one function in the entire product can remove a person from the world, and it is wired to a button a human presses, with a typed inverse that puts everything back. **Why:** the party's relationship with a named person is the campaign's property, not the simulation's. A world that kills the innkeeper the players loved has overstepped.

- **It never adjudicates theology.** The engine models believers, not gods: shares of the faithful, standing, legitimacy, piety, the character of the clergy. It never confirms a divine act, never rules whose god is real, and never contradicts the DM's canon. Miracles exist only as *claims* inside content, and the mechanical consequence is always the believer-side one — pilgrims, coin, strangers. Divine claims are handled by the same machinery that handles contested belief about anything else. **Why:** cosmology is the single most personal thing a DM owns.

- **It ships no gods at all.** There is no default pantheon anywhere in the data. The DM authors every deity, and the form states in plain words what each alignment axis will mechanically do before they commit. **Why:** a stock god is a thing to explain away.

- **There is no earth-physics terrain model.** Distance is an abstract integer travel cost quantised from terrain classes and calibrated so a neighbour is about a week away; seasons are a per-terrain surcharge, never a severance. There is no latitude, no temperature, no rainfall, no growing-season model, and no kilometres or miles anywhere in the engine. **Why:** an abstract cost field ports intact to any medieval-inspired cosmology — a world of floating cloud-islands, a subterranean realm, a ring, a disc. Bind the engine to earth physics and you bind every DM to earth.

- **The horizon is sub-century.** The engine is tuned, tested and bounded for a campaign's worth of world-time, not for the rise and fall of civilisations. Memory half-lives run to decades, treaties carry hard expiries, no extraction can be perpetual, and no conquest can snowball because every occupier's take is capped both per holding and in total. **Why:** the honest scope of a plausible simulation, and the scope a table actually plays in.

- **It is world-only, never party-facing.** The simulation has no concept of the player characters, no encounter tables, no combat resolution, no experience or levelling, and no player-facing session link. It models the world the party moves through and stops at the edge of the party. **Why:** the party is the DM's and the players', and every system that tried to model them would be competing with the rulebook they already chose.

- **It aims at plausibility, not empirical calibration.** No number in this engine claims to be historically or economically correct. Bands are qualitative (surplus, adequate, strained, critical, collapsed), prices exist only as a display fiction over scarcity bands and are structurally forbidden from feeding engine mathematics, and comparisons are stated in words because banding is lossy. **Why:** the goal is a world that *coheres and explains itself*, not one that would survive peer review — and false precision would invite DMs to argue with the model instead of using it.

- **Every vocabulary is closed and typed.** Verdicts come from a four-word list. Session-ledger entries pick a kind, a target and a magnitude band. Person edits are dropdowns. Free text is always flavour and never reaches the mechanics, and the AI layer is a clerk that proposes typed operations for approval — never a writer. **Why:** an engine that accepts arbitrary text cannot guarantee replay, cannot guarantee undo, and cannot show the DM a cascade preview.

- **The engine proposes; the DM disposes.** Autoplacement itemises every move before acting. Road charters are proposals. Campaign-altering outcomes queue for approval by their *shape*, not their severity. The AI layer cannot apply anything silently, and flagged operations need an explicit consent tick. **Why:** a tool that surprises you is a tool you stop trusting.

- **There is no personal lineage, and no aging.** There are no parents, children, marriages or blood heirs among named people; succession is always *seat* succession — the ladder's displacement chain, the ousted seat's successor, the named potential replacements. Age is a one-shot descriptive phrase. **Why:** this is a consequence of the state-never-fate law, not an oversight — but it does mean dynasties do not exist, and that is worth an owner ruling rather than an assumption.

- **Determinism outranks surprise.** Where randomness and reproducibility conflict, reproducibility wins: the clock has exactly one entrance, unseeded draws throw rather than fall back, lint rules ban ambient randomness per layer, and a meta-test guards the bans themselves. **Why:** the entire promise of a shareable seed rests on it.

- **An unlit subsystem must cost nothing.** A dark layer writes no bytes, consumes no randomness, and leaves the saved world byte-identical, proven by dormancy goldens. **Why:** so that shipping ambitious machinery unlit never degrades the campaigns of DMs who will never turn it on.

---

# KNOWN GAPS AND HONEST SHORTFALLS

*Recorded so the ontology is a true map rather than a sales sheet. These are not boundaries — they are things that are missing, unwired, or where a written claim outran the code.*

**The largest structural facts**

- **Thirteen engine-gated switches are unlit by every preset, and none can be reached from any interface.** Beliefs beyond the base map, espionage, information statecraft, commercial grievances, conquest doctrine, oath-holders, sovereignty trade, strategic posture, migration rumours and the treaty lifecycle voice all require hand-editing a stored settings blob. An entire build programme is invisible to any user today.
- **The certification evidence file is empty.** Every instrument exists — behavioural contract, per-subsystem verdicts, convergence contracts, coupling registry — and not one soak receipt has been banked. Apparatus without evidence is the single largest gap in the substrate.
- **Three of the five designed programmes have zero source footprint** — living futures, habit conditioning, war circulation — roughly fourteen and a half thousand lines of sealed or near-sealed architecture with no implementation at all.
- **Two product flag systems exist and do not meet.** A thirty-eight-entry product flag registry gates interface surfaces; none of its entries gates a simulation subsystem. Engine gating lives entirely in world-law keys with different resolution, different persistence and a separate manifest, and the developer flag panel cannot see engine gates.

**Built but unreachable from any interface**

- A whole derived-interior stack — the capacity model, daily life's eight slots, the contradiction detector, the seven causal views, and the AI grounding payload — is complete, coherent and imported by nothing outside the domain layer. This is the highest-leverage unlit thing in the settlement interior, and it is a wiring gap rather than a design gap.
- Strategic posture and learned risk appetite have zero callers, honestly recorded as such in their own certification row.
- Second-order belief has no callers and no switch anywhere in the source.
- The organic road lifecycle — roughly seventeen modules, fully pinned — is lit by no preset, which is why route-predation grievances score a permanent honest zero.

**Missing mechanisms a DM might reasonably expect**

- **No engine-driven election or peaceful succession of a seat.** Five causes of a power transfer exist and legitimacy distinguishes all five, but the engine only ever emits coup, conquest and appointment. A world left to run for fifty years changes governments exclusively by violence, conquest, or DM fiat.
- **No voluntary alliance or standalone non-aggression treaty.** Alliances form only by slow drift or are *imposed* on a loser; two friendly courts cannot sit down and sign anything. There is no treaty amendment or renegotiation either — a document can only run out, default, or be repudiated.
- **One treaty term is unreachable in every configuration** (reparations has no producing asset class), and two more are signed but toothless (an installed puppet seat and an intelligence-disclosure clause are priced, signed, displayed and expire while doing nothing).
- **No trade or route-rights treaty terms at all** — exclusivity, market access and toll exemption are named in design and return zero hits in source.
- **Envoys have exactly two purposes** — suing for peace, and parlaying on their own account. No trade mission, marriage embassy, alliance-seeking legation, or resident ambassador.
- **No auxiliary contribution:** allies reinforcing *someone else's* army does not exist in code in any form, and neither do composite origin-tagged armies. One army per settlement is a hard law, not a tunable limit.
- **No housing stock, no sanitation, water, fire or waste model, no local treasury, and no infrastructure condition that decays and is repaired** — housing pressure and infrastructure are both proxies over other numbers.
- **No absolute distance anywhere.** The field that would give the world a real scale exists in design documents and in zero source files.
- **The map never tells a settlement what terrain it sits on.** Hand-placing a settlement carries across only population and port status; terrain is chosen or re-rolled in the wizard. Automatic placement exists to reconcile them afterwards, but nothing prevents a hand-placed desert town sitting in a taiga. Relatedly, the biome field is read in two places and written by nothing in the generation path.
- **No language, literacy or education axis** in the culture model, and the culture dial itself never changes — occupation and migration change a town's *rites* and its *faith*, but not its cultural family.
- **No peaceful cultural diffusion.** Rites spread only by imposition or by migrants carrying them; a famous festival never diffuses across a trade lane on its own, despite trade being the strongest closing term in culture distance.
- **No tithe or temple economy, and no clergy lifecycle** — clergy are read as a lens over existing people, with no ordination or succession.
- **Crime has no live loop.** Criminal *opportunity* moves with the world; criminal *reality* — the safety profile and black-market capture — is generated once and does not respond to a collapsing watch or a famine the way corruption does.
- **No general undo.** Undo covers advances and AI applies; manual edits get soft revert inside the queue, but there is no single "undo the last thing I did" across the app.
- **No live player-facing surface.** Player view is a toggle on the DM's own screen and a variant of an export; there is no session link a player opens in their own browser.
- **No replay-from-week-zero facility.** Determinism is proven by goldens and byte-equality; there is no user-facing command to re-run a world from its beginning.

**Where a written claim has outrun the code (documentation drift, code wins)**

- Several module headers still describe features as unbuilt that the same files now build, or as unlit that presets have since lit — most notably the traditions engine (three presets light it while its own header says no lane does) and the information-statecraft module (its header calls three of its four verbs unbuilt while the file builds them).
- One certification row states that nothing calls the person-verdict lane from the world pulse; the world pulse does call it. The behaviour is unchanged because the switch is off, but the prose is now wrong about the wiring.
- The prose corpus headline figure needs reconciling: about nine thousand one hundred and seventy-nine authored variants exist across the twelve annexes, of which about two thousand six hundred are compiled by the strict projection; the rest reach the runtime through per-lane modules. The often-quoted larger figure should not be used publicly until the accounting is unified.
- The belief divergence band on the newspaper ships *without* its truth join, so it shows what towns believe rather than where they are mistaken — the most quotable promise of the belief layer is not currently rendered on that surface. The settlement rumours view's DM truth block does have it.
- The travellers overlay currently draws direction chevrons and states arrival times, which the Wayfare design's ambiguity law forbids; its first surface wave will remove a live feature.
- Migration receipts — the two mortality sinks the engine so carefully conserves — are computed and discarded on the main path, and the refugee arrival line names no origin, which is a live legibility gap against the full-address news law.

---

# CLOSING NOTE

This document describes **192 systems** across six tiers, **13 cross-domain loops**, **16 promises** to the DM, **12 deliberate boundaries**, and an honest ledger of what is missing.

The shape of the thing, in one paragraph: a deterministic seeded engine advances a realm one week at a time in a declared causal order; a generator derives each settlement from its own facts and freezes the geography once so distance becomes real; eight domains — the settlement interior, its people, its politics, its diplomacy, its wars, its economy, its culture and faith, and everything that moves between towns — read and write each other through named ledgers rather than shared globals; an information layer sits between the world and every decision so that courts act on what they believe rather than what is true; and a surface layer turns all of it into a dossier, a newspaper and a letter, with one toggle between the DM's face and the players'. What it refuses to do — end a named person, rule on a god, bind itself to earth physics, or model the party — it refuses on purpose, because each of those belongs to the DM.





