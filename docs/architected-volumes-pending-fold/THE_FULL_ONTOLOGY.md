# THE FULL ONTOLOGY OF SETTLEMENTFORGE

*An exhaustive, plain-language map of every system and subsystem in the simulation and the generator — what each one is, what feeds it, what it feeds, what it puts on the table in front of a Dungeon Master, and whether it is running today.*

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

- **What it is** — Today a settlement's headcount is set at generation from its tier band and then essentially held; the pipeline step named "population" actually generates the *cast*, not the number of souls. Beside it sits a complete births-minus-deaths engine: carrying capacity derived from food, a density ceiling from tier, named characters exempt from the death draw, migration between settlements over the real road network, and a plan system where a crowded town chooses between emigration, imports, infrastructure, promotion, or founding a satellite.
- **Fed by / feeds** — When lit it would drive tier drift, the viability ladder, disease and raid risk, the resource-pressure grounds for war, and the news feed.
- **At the table** — Today: population is a fixed number with a tier label. Lit: a town that outgrows its fields exports people, builds, or starves, and the DM reads about it in the world news.
- **Status** — BUILT, NOT REACHABLE. Unlit it returns the same object references — a true no-op.

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

<!-- CONTINUE -->

