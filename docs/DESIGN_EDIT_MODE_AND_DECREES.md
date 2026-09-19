# Edit Mode and the Decree Registry — the design (2026-09-19)

**Status:** architecture for implementation, awaiting the owner's word (ODQ §934.36 and its addenda; §934.37 records this document). Sequenced after the 2026-09-18 consist's push and the public-path review. Nothing here is built.

## 0. Thesis

A generated settlement is changed through one door, into one queue, applied at one moment. The DM edits **facts**, never prose; every value comes from a **pool** the engine already reasons about, except a proven **flavor tier** that may be typed; each edit is an **operation** with a declared **effect**: a *correction* of the record that takes effect now, or an *event* that takes effect when time advances, in the order the DM set, as a cause the world propagates and the chronicle records. **Guards** inform and offer; they never refuse, because at this table a god sits and magic is real. Counterparties may be **on-stage** (a settlement in the realm, simulated on both sides) or **off-stage** (a phantom the DM names, the engine mints, and the home settlement feels). The game is not the pencil; it is the world pushing back.

This is the architecture the estate already has underneath (staged operations, one set of store writers, engine reconciliation, causes recorded), given a single interface. It unifies today's three editing doors — the inline pencils with the Change Dock, change-a-dial-and-regenerate with the regeneration delta card, and the Surveyor's proposal review — into one.

## 1. Vocabulary

| term | meaning |
|---|---|
| **Edit mode** | a state of a *saved* settlement's dossier (never an anonymous draft), entered from the library, tier-gated, visibly on ("the pen is out"), left with Done |
| **card** | a dossier unit that declares editable fields (an institution, an NPC, a faction, a power, a system state) |
| **field** | a fact a card owns; declared once in the domain as `pool` or `free`, with its `effect` |
| **pool** | a typed value set the engine already reasons about (the institution catalogue, the name generator, archetypes, roles, stances, causes, commodities, the pantheon, tiers) |
| **free field** | a value that may be typed because no derivation, guard, pulse consequence or register reads it — proven by census, not chosen by taste (names, epithets, mottoes, devices, signs, the DM's note fields) |
| **operation (op)** | the unit of change: `{ type, target, payload, effect, requires[], conflictsWith[], duration? }`; the ONLY mutation path |
| **correction** | an op on a record fact; applies on save; lives in the DM's layer; never a chronicle event |
| **event** | an op in time; queued; applied at the tick in order as a first-class cause; chronicled with the table's hand as its cause |
| **decree** | a queued event with its status (`pending`, `applied`, `withdrawn`) and provenance (`dm`, `guard`, `surveyor`) |
| **the registry** | the ordered list of decrees at the dossier's foot ("Decrees pending" / "Decrees applied"); the Change Dock moved into the document |
| **the tick** | one advance of realm time; the pulse's head applies pending decrees in order, then simulates |
| **guard** | a pure evaluation of the queue against the world: prerequisite, contradiction, duration, range — each with three offers |
| **phantom** | an off-stage counterparty minted from a seed with enough typed facts for the home derivations, never simulated on its own side |
| **the DM's layer** | the overlay of corrections and DM-minted entities over the seed's untouched derivation; regeneration keeps it |

## 2. The model

### 2.1 Field declarations (the source of every modal)
`src/domain/edit/fieldDeclarations.js` declares, per card type, every editable field: `{ card, field, kind: 'pool' | 'free', pool?, effect: 'correction' | 'event', label, readersProof }`. The modal is generated from this table; a card without a declaration has no pencil. `readersProof` for a `free` field names the census that proved it has only display readers (§6, instrument 2). Empty fields are declared and shown empty.

### 2.2 Pools (the catalogue of catalogues)
`src/domain/edit/pools.js` maps pool ids to their sources, all existing: institutions → the catalogue behind `institutionDisplayName`; names → the culture's name generator (with "roll another") plus the world's own names; roles → occupations implied by the world's institutions; factions → the typed archetypes; powers → the power structure's seats; stances → the relationship kinds; causes (for removal) → died, left, burned, dissolved, seized; commodities → the resource catalogue behind `resourceDisplayName`; deities → the pantheon; tiers → the size ladder. A DM's own words enter a pool only through the compendium, where they take a type (the custom-content promotion contract). The compendium is the pressure valve of the whole design.

### 2.3 Operations (one mutation path)
`src/domain/edit/operations.js` is the typed op catalogue. Each type declares its target kind, payload schema (pooled or free by field), effect, `requires[]` (prerequisite op types or world predicates), `conflictsWith[]`, and optional `duration`. Ops are emitted by the modal (Save/Add/Remove), by guards ("fulfil it for me"), and by the Surveyor (its proposals are ops). Ops apply only through the existing store writers via the lazy application-command boundary the Surveyor already uses; there is no second path.

### 2.4 The DM's layer
Corrections and DM-minted entities live in a persisted overlay keyed by entity id and field, in a `dm:` identity namespace. The seed's derivation is never edited; the layer is composed over it at read time and re-applied after regeneration (the regeneration delta reports it under "kept"). The golden master and every generation instrument ignore the layer by construction. Free-field values live here too.

### 2.5 The registry (persisted, ordered)
A persisted key on the saved settlement: `decrees: [{ id, op, status, addedBy, orderIndex, orderedAt, appliedAt?, tickRef?, chronicleRef?, overrode?: guardId[] }]`. Ordered by `orderIndex`; reorderable (up/down); entries reopen their card for editing at any status and return to their index; withdrawn entries are kept for the record; a reverted tick returns its entries to `pending` in order (§2.5a). The registry is part of the save, so it survives reload, sign-in and export; it never prints in the PDF while pending.

### 2.5a Reversibility and the reopened card (the owner, 2026-09-19 ~20:2x)
Everything is reversible from the edit until time advances: a waiting entry can be reordered, withdrawn, or reopened. Clicking any entry in the sequence — waiting or applied — reopens its own card with its values (the modal reappears); Save returns it to exactly its place in the order. If the DM reverts time (the realm's own rewind of a tick), that tick's applied decrees return to the waiting sequence in their original order with their chronicle lines retracted, so a rewind never loses a decree and never reorders one. The registry therefore stores an explicit order index per entry, and application never deletes an entry — it changes its status.

### 2.6 Application — THE CANON RULE (the owner, 2026-09-19 ~20:0x)
**The settlement's state decides the effect, not the field.** Edit mode has two settings behind one tag: a settlement that is NOT canonized takes plain edits that apply on Save; a CANONIZED settlement turns every edit into an event applied at the next advance. The per-field `effect` declaration of §2.1 is therefore withdrawn: a field declares only `pool | free`; the modal's tag reads the settlement's state ("Draft — edits apply now" / "Canon — edits become events at the next advance"). The paragraphs below describe the two settings.
- **Plain edits (a draft)** apply on Save: the store writer updates the layer; dependents re-derive immediately (the regeneration delta's machinery, scoped to the change); no chronicle entry; the card re-renders.
- **Events (a canonized settlement)** apply at the tick: the pulse's head takes the pending decrees in order, applies each as a cause, then runs the simulation; each applied decree yields a chronicle entry written by the prose engine with cause = the table's hand (`offStage` when the counterparty is a phantom; `overrode` when a guard was proceeded past — "overnight, by means the town does not understand"). The advance report speaks the regeneration card's vocabulary: direct effects, propagated effects, what was kept.

### 2.7 Guards (suggestive, never refusing)
`src/domain/edit/guards.js`: `evaluateGuards(queue, world) → [{ entryId, kind: 'prerequisite' | 'contradiction' | 'duration' | 'range', message, offers: ['fulfil', 'self', 'proceed'] }]`. Rules live in `guardRules.js` and REUSE the estate's authored knowledge: the structural validator's tier rules (a cathedral wants a city; a parish church wants a priest), faction-power totality (adding a faction asks "how much, from whom" or the engine rebalances and shows it as an inserted entry), the tier ranges for section counts, and durations the simulation knows. Coverage is honest: no rule, no guard, and the absence is stated. "Fulfil it for me" inserts a visible, seeded, editable entry marked as added by the guard. "Proceed" records the override on the entry. Cancel is always the DM's own choice.

### 2.7a Sequence and connection (the owner, 2026-09-19 ~20:3x)
The relation between two entries is declared knowledge (an op type's `requires[]` / `enables[]` / `relatedTo[]`), so the engine always knows when X and Y belong together; the DM decides whether they connect. In sequence, Y's chronicle line cites X as its ground automatically. Out of sequence, the guard offers to CONNECT: reorder so X precedes Y, fulfil X in place, or proceed independent — two events, nothing invented between them. Beyond declared relations, the DM may set an explicit **follows-from** link between any two entries (offered by the guard when the catalogue marks them related, settable by hand otherwise), and the chronicle writes the pair as one account ("after the mill burned, the widow took the ferry"). Never blocking.

### 2.8 Phantoms (off-stage counterparties)
`src/domain/edit/phantoms.js` mints a phantom from a seed: `{ id: 'dm:phantom:<seedHash>', name (free), kind (pool), size (pool), stance (pool), traits (rolled) }`. Neighbour rows and the engagement derivations accept a phantom partner (no `saveId`). Off-stage ops (send a force, open trade, declare war) have real home consequences the pulse carries; outcome ops (victory, defeat, stalemate, a truce bought) are decreed or rolled from a pool and applied at a tick. Promotion: forging the phantom as a real settlement takes the phantom's seed, so traits and written history carry over; the realm link then replaces the phantom row.

## 3. The surfaces

- **The library.** A saved settlement's card offers Edit when the tier allows it. Entering opens the dossier in edit mode.
- **Edit mode.** A visible mode indicator in the tome's register; every declared card grows a pencil; every section that accepts additions grows a plus; Done leaves the mode. Anonymous drafts never see it.
- **The modal's chrome (the owner, 2026-09-19 ~21:4x).** The edit pop-ups wear the forge's own scheme — the brown ground and gold lettering the pipeline rail shows while a settlement is being sequenced — or a scheme close enough to it that the reader knows at a glance they are in the editor rather than the dossier; the registry page and the edit-mode indicator share it. The tokens come from the design system the rail already uses, never new hexes.
- **The modal.** Generated from the declarations: the card's fields grouped as the card groups them; pool controls (drop-down, search, or both; "roll another" beside every name); free fields as plain text with a length limit; the effect tag beside the action ("takes effect now" / "takes effect when time advances"); Save, Add or Remove (remove carries its cause pool); the door per §934.31 (a labelled close, Escape, focus returned); on the phone a full-height sheet inside the page, never over the bar.
- **The registry page.** At the dossier's foot, in the tome's idiom (a page of decrees): each entry in one line (what it does, what it requires), move up/down, remove; guard badges with the three offers inline; the realm's own Advance control applies them; applied entries move below with links to their chronicle lines.
- **The advance report.** Direct, propagated, kept — the regeneration card's vocabulary for a tick that applied decrees.
- **The Surveyor.** Its compiled proposals land in the registry as decrees `addedBy: 'surveyor'`; its approve/edit/reject becomes the registry's own controls; the protected-consent barrier becomes a guard kind.
- **The PDF.** Applied decrees print through the chronicle; the DM's layer prints as the world's facts; pending decrees do not print.

## 4. Data flow

declare (field declarations, pools, op types) → edit (mode → card → modal) → emit an op → **correction**: apply now → re-derive dependents → render / **event**: stage a decree → guards evaluate → the DM orders, fulfils, proceeds or withdraws → Advance → the tick applies decrees in order as causes → the pulse propagates → the chronicle records with cause → the advance report → the PDF.

## 5. Persistence and migrations

Two persisted keys join the saved settlement: the DM's layer and the decree registry. Both go through the observed-shape register's migration door (a schema rung, executed on the consist lineage) and the persisted-key walker; the anonymous-draft envelope never carries them (edit mode is saved-only). Exports carry both. Regeneration re-applies the layer and keeps pending decrees.

## 6. Instruments (what keeps it honest)

1. **Declaration walker** — every card with a pencil has a declaration; every declared field has a pool or a proof.
2. **Flavor census** — every `free` field has zero readers under generators, worldPulse, causalState, guards or registers, measured from the writer-reach and observed-shape data; a `free` field that gains a derivation reader reds.
3. **Op coverage** — every op type states its guard coverage (rules or "none, stated").
4. **Cause walker** — every applied decree has a chronicle entry with `cause`; an override carries `overrode`.
5. **Single mutation path** — no store writer is reachable from the edit surfaces except through the op boundary.
6. **Dialog door, phone floors, reachability** — the §934.26/§934.31 walkers extend to the modal and the registry page.
7. **Golden isolation** — the DM's layer changes no generation golden; a property test regenerates with a layer and asserts "kept".

## 7. The program (lanes, each with its proof)

- **A. Declarations and pools** — the field declaration table for every card type; the pool catalogue; the flavor census with proofs. Proof: instruments 1–2.
- **B. Ops, the layer, the registry** — the op catalogue; the DM's layer with its namespace; the registry key; the schema rung and persisted-key updates; corrections applying now with scoped re-derivation. Proof: instrument 5, 7; store lifecycle tests (create, read, persist, regenerate, export, migrate).
- **C. Guards** — the engine and the rules reusing the validator, totality and tier ranges; the three offers; overrides recorded. Proof: instrument 3; property tests that any queue the guards accept applies without contradiction, and that "proceed" always applies.
- **D. The surfaces** — edit mode, pencils and pluses, the generated modal, the registry page, phone sheets, the tome's chrome. Proof: rendered tests at desktop and phone; instruments 6.
- **E. The tick** — the pulse's head applying decrees as causes; chronicle entries; the advance report. Proof: instrument 4; preset witnesses re-recorded through the door with a record.
- **F. Phantoms and promotion** — minting, neighbour rows with phantom partners, off-stage ops and outcomes, promotion keeping the seed. Proof: parity between a phantom later promoted and a settlement forged from that seed.
- **G. The Surveyor unified** — proposals as decrees; consent as a guard. Proof: the existing Surveyor suites re-pointed, none weakened.

Build C before D: the guards are the game. A through C are domain and store work that can be proven headless; D is the first thing a reader sees.

## 8. Open decisions (the owner's)

1. ~~Which tier gets edit mode~~ — RULED 2026-09-19: the editor, its door and plain edits are all behind the Cartographer gate, with events, phantoms and the Surveyor.
2. Whether a correction to a *derived* fact (one the engine computed) is allowed at all, or only to record facts — the chair's default: allowed, recorded in the layer, and the delta card shows what it displaced.
3. The registry's cap per tick, if any (the chair's default: none; the guards speak, the DM decides).
4. Whether pending decrees may print in the PDF as "pending" (the chair's default: no).

## 9. Risks, plainly

Apply-at-advance without the correction split would frustrate the first DM who fixes a name; the split is load-bearing. Pools feel like a cage until the compendium is fluent; the valve must ship with the door. The guard rules must start small and true; a false warning costs more trust than a missing one. The pulse must treat decrees as first-class causes or the chronicle lies. Immediate re-derivation for corrections must be scoped, or a rename re-forges the town. And this is new capability, not repair: it is a program, gated on the owner's word, after the push and the public-path review.

## 10. Kept open — extension points for the simulator to come

The owner's word (2026-09-19): "keep it open because we still have a lot more simulator to build out. But we're building this first." So the design is a living contract, and every later system joins it through declarations, never through a second door:

- **New op types** register in the op catalogue with their effect, prerequisites, conflicts and duration; the modal, the registry and the guards pick them up without UI work.
- **New pools** register in the pool catalogue; a field's declaration points at a pool id, so a system that adds a vocabulary (a new institution class, a new stance, a new cause) is editable the day it exists.
- **New guard rules** register against op types and reuse the simulator's own knowledge as it grows (durations, capacities, supply, casualties); coverage is stated per op type, so unfinished coverage is visible, not silent.
- **New chronicle causes** register with the cause vocabulary; the cause walker holds every applied decree to one.
- **New phantom kinds** register with their rolled traits; promotion by seed stays the one rule.
- **New tick semantics** (seasons, projects with duration, multi-settlement resolution) hook the same head-of-tick application; decrees remain the first causes of a tick.
- **New surfaces** (the map, the realm, the VTT) emit ops through the same boundary; the single-mutation-path instrument refuses anything else.

Order of the programs, as the owner set it: the 2026-09-18 consist's push → this program (guards before surfaces) → the simulator's build-out, with the public-path review running as a read-only walk beside them.

## 11. Lifecycle and edges — integrated by the chair's judgment (the owner, 2026-09-19 ~21:2x: "integrate them according to your best judgment")

- **Travel (the owner's rule):** edits do not show when a settlement is forked, imported, or put in the gallery. The DM's layer and the decree registry live only in the owner's save (and its cloud copy); a fork, an import and the gallery projection carry the seed's world alone. Consequence stated once: a personal backup export cannot restore edits under this rule; if the owner wants that, the export may carry the layer while every import still strips it — a one-line change to the import path, not a model change.
- **Migration of what exists:** existing saves' Change Dock pending changes and inline edits are folded into the registry (pending) and the layer (plain edits on drafts) by a governed migration through the observed-shape door, in lane B before any surface.
- **Scheduling:** an entry carries an optional `when` (a tick index or a season), defaulting to the next advance; the registry orders by `when` then `orderIndex`; guards treat a scheduled entry's prerequisites at its own tick.
- **Contention on one field:** two entries that set the same fact in one sequence raise a `contention` guard ("two entries set the miller's name") with keep-first / keep-last / keep-both-in-order; the last applied wins if the DM proceeds.
- **The chronicle's voice:** authored pools for the table's hand ("by the table's hand", "overnight, by means the town does not understand", the off-stage forms, the follows-from joins), under the prose program's law, in lane E with the tick.
- **Seeded rolls:** "roll another" is seeded from the settlement seed, the entry id and a roll counter, so reopening a card reproduces its rolls and the golden isolation holds.
- **Spatial edits:** out of this design; the town map's own tools emit the same ops when they arrive (extension point §10).
- **Free-text hygiene:** plain text only, a length limit per field, a font-coverage check against the PDF's embedded faces at save, and a walker that no free field reaches a derivation.
- **The player projection:** the layer and the chronicle carry the dossier's existing secrecy classes; a player-safe export scrubs what the DM has not revealed, through the same denylists the gallery uses.
- **The Surveyor's accounting:** a proposal costs its credit at compile; applying it from the registry costs nothing more; the registry shows the credit already spent beside a Surveyor entry.
- **Bulk and templates:** a realm-level op ("the crown raises the levy") is a later op type over several settlements' registries; named as an extension, not built in the first program.
- **Learning from edits:** count edits by op type and card type, no content, from the first lane; the counts are the generator's best signal of what it gets wrong.

## 12. The adversarial review's findings and the chair's rulings (2026-09-19 ~08:2x EDT)

An Opus reviewer refuted the design and the architecture against the consist at 13ab242e3. Thirteen findings; each is ruled here and the architecture is amended to match. Where a section above disagrees with this one, THIS SECTION GOVERNS.

1. **The rewind is `undoLastPulse` — a whole-state snapshot restore, session-only, ten deep.** RULING: the design builds on the real mechanism, not an assumed one. A rewind of a tick restores the snapshot (whose registry already holds that tick's decrees as pending, in order) and then RE-APPENDS every decree staged after the tick from the pre-undo registry, so nothing staged later is lost. The registry page states the rewind's own limit ("available for the last ten advances of this session"). Persisted tick snapshots are an extension point for the simulator program (§10), not this one.
2. **Canon is a save's state; the advance is a campaign act.** RULING: events queue on a canonized settlement, and the registry's Advance affordance is the realm's own; a canonized settlement in no campaign shows "Place it in the Realm to advance" (the existing rung) and its decrees wait. Uncanonizing after applied decrees follows the event log's own fate (the existing tombstone restores both); the registry's applied entries ARE history.
3. **Names are join keys, not flavor.** Factions and NPCs are referenced by display name from more than twenty stored fields and the estate already owns a rename cascade. RULING: a third field kind, `free-cascade` — typeable, but a change is a typed op (`rename-faction`, `rename-npc`, `rename-settlement`) that runs the existing cascade; the flavor census classifies by property reads AND by value joins, and a join-key field can never be plain `free`.
4. **Neither persisted key is scrubbed on the travel paths.** RULING (lane B, before any surface): `dmLayer` and `decrees` join the three hand-mirrored denylists and their drift test, and `publicSafe` / `worldSnapshotPublic` name them explicitly; the travel instrument is a RUNTIME test that a fork, an import and the gallery projection carry neither key, not a static walker.
5. **A layer composed only in the store splits the readers** (the PDF view model, the domain prose readers and the world book read the record directly). RULING: the layer is applied ON WRITE — the saved record carries the edited values, and `dmLayer` records which fields are the DM's (for regeneration to re-apply and for goldens to ignore). Every reader sees one record.
6. **Phantoms break the neighbour derivations** (the back-link resolves partners by save; the singular `neighborRelationship` allows one; downstream reads `neighbourNetwork[].id` as a save id). RULING (lane F): a phantom IS a minimal save record (`kind: 'phantom'`, a seed, the pooled traits) in the owner's library, hidden from the shelf unless revealed, so every derivation that resolves by save works unchanged; promotion re-forges that save fully from its seed.
7. **The pools must read the generator's catalogue** (`getInstitutionalCatalog` / `getInstitutionsForTier`, tier-gated), never the display seams, which are relabeling maps that pass unknowns through.
8. **Guard rules and purity.** RULING: the initial rules are prerequisite (`checkInstCompat` / the gate features), totality (`renormalizeFactionPower` as the `fulfil` writer), contradiction, contention and connection; the "range over section counts" rule is DROPPED until a count table exists in the engine. `evaluateGuards` FOLDS: each entry is judged against the world with every earlier entry applied (a synthesized post-op world), which is also what makes the property test non-vacuous on queues longer than one. Coverage is executable rule functions per op type, never a string; the op-coverage walker refuses a declared rule that cannot fire.
9. **The observed-shape door for a new domain reader of a save-time key is an `EXPLAINED_WRITER_EXEMPTIONS` entry through the migration bundle**, with a declared mechanism; the architecture's "schema rung" wording is corrected.
10. **The gate is the `premium` tier key** (Cartographer is its display name): a new `TIER_GATE.*.editMode` field with its tier-facts parity pin.
11. **The preset witness has no door**: lane E re-records it by hand with a stated cause as the estate does, and the tick hook consumes no PRNG and preserves the pulse record's key order when there are no decrees (the witness hashes the serialized record).
12. **The delta card's "kept" is an entity diff**: a field-level "the DM's fields" section is new derivation, in lane D.
13. **Omissions now stated:** scheduling (`when`) touches the interval orchestrator and the two-phase commit, not one hook; the command boundary gains ONE generic decree adapter dispatching by op type, not twenty adapters; font coverage at save is new capability (a cmap read of the embedded faces), costed in lane D; the persisted-key instrument is named by its real path at pre-proof; the Change Dock ships flag-off, so the editor REPLACES it rather than merging it, and the migration folds inline edits and Surveyor state only.

**Product rulings.** An APPLIED decree reopens READ-ONLY; only a rewind returns it to pending and editable — the pencil never rewrites what the chronicle recorded (THE PROMISE). Uncanonizing with applied decrees is guarded by the tombstone's own notice. The registry states the rewind's session limit. Guards judge folded worlds, so a queue of one and a queue of ten are judged alike.

## 13. The phantom consequence rule (the owner, ODQ §934.43; 2026-09-19)

**The rule.** A phantom counterparty can absorb an act but never return one. What leaves comes back by the estate's own procedures; what is declared is recorded; nothing from outside comes home.

**What a phantom act produces — exactly two things.**
1. **The home procedures.** A force sent against a phantom resolves won or lost (the DM's `resolve-outcome`, or rolled on the entry's own stream) and returns through the existing muster, casualty and upkeep mechanics exactly as any returning force does. An envoy returns. A caravan returns with neither loss nor gain. These are the home's own costs, acting on the home's own state.
2. **The record.** The chronicle carries the declaration or the outcome in the herald's voice (§11's pools), marked off-stage.

**What it never produces.** No war state, no treaty, no trade route, no envoy state, no faction-power or legitimacy shift derived from the phantom. Phantoms never enter the world pulse: no self-ending war starts against one, and no interval machinery carries one.

**Consequence is the DM's, as a decree.** If the DM wants a defeat to shake the town, that is a typed op on the town itself, staged and guarded like any other. After a lost return the registry may OFFER it as a follows-from suggestion (a connection guard with `fulfil`); it never applies it on its own.

**Reality is shown.** Every off-stage decree wears a PHANTOM or REAL badge in the registry. A REAL counterparty — a saved settlement in the same campaign — routes through the existing inter-settlement machinery (the campaign's wars, routes and relations) with full consequence; that path is the simulator's, not the editor's, and the editor only hands it the decree.

**Promotion does not rewrite the past.** When a phantom is forged into a real settlement (§2.8), its earlier record-only outcomes stay record-only; consequence begins from the promotion forward (THE PROMISE).

**Chair default, vetoable.** A returning force's own losses may move the settlement's defense readiness through the existing readiness derivation — the home's procedure on the home's force, not a consequence imported from the phantom.

**What this simplifies.** The phantom packet (EM-F1) loses its phantom-side state and most of its guard rules; the op catalogue (EM-B1) carries one `consequence` policy per off-stage op — `home-procedures+record` for a phantom target, `world` for a real save — decided at apply time by the target's reality; the tick hook (EM-E1) applies that policy and nothing else.

## 14. Edit at the source, never at the derivation — and world facts by consequence (the owner, ODQ §934.44–§934.45; final shape 2026-09-19)

**The rule.** The world is a derivation graph rooted in the seed. A fact is editable only where it exists first. A derivation is never editable, on any card. And a world fact, once the city exists, is edited without re-rolling the city: the change is read as CONSEQUENCE.

**Root means CHOSEN, not computed.** What makes a fact a root is that the generator CHOSE it from a candidate set, however that set was gated by other facts. A derived fact is COMPUTED from other facts with no choice in it. The estate registers every seeded chooser in its decision-fork classification registry, so the root set is that registry's rows — a measurement, never a judgment.

**Five kinds of fact, and one engine.**
1. **World facts** (§934.45) — terrain, culture, trade access, resources, goods, services, stressors. Before generation they are the wizard's DIALS and changing one rolls a new world. After generation they are the city's world facts: the editor edits them on a fifth card, whose pools are the wizard's own option sets, and a change NEVER re-rolls — it re-derives the computed facts with every chosen fact pinned from the record. The teleported port keeps its harbour master and its ship-wrights; its water access, trade reach, food security and defense reading now say what a port in a desert honestly says. That incoherence is consequence by design, not an error; the simulation plays it out over ticks; guards observe ("the harbour has no water") and offer a fulfil or a proceed, never a refusal.
2. **Root** — a registered chooser's output: an NPC's name, role and disposition; an institution's name, class and standing; a faction's name, archetype, stance and power share; a power seat's holder; the rosters themselves (additions and removals are roster roots). The editor's pencils, pluses and pools; a root's pool is the candidate set its chooser drew from. A root edit is the same act as a world-fact edit with ONE PIN RELEASED: everything else held, one choice changed, the derivations follow.
3. **Derived** — the economy, the supply chains, the defense scores, food security, the system states, the history. Never editable, on any card. A derived card shows PROVENANCE where a pencil would be — "follows from X — change X" — from a static producer map admitted by a walker. History is the chronicle's and immutable (THE PROMISE).
4. **Annotation** — the free notes; the DM's layer only; the flavor census proves nothing reads them.
5. **Minted** — an entity the DM adds (`dm:` ids), whose roots are its own from the moment of minting.

**One engine: re-derive with pins.** `rederive(record, config′, layer)` runs the pipeline's derivation steps against the record's chosen facts held fixed — every registered chooser whose output the record holds takes the record's value instead of drawing; a chooser whose output the record lacks (a derivation path the new world facts open — desert hazards, say) draws on the seed's own stream — with the layer's overrides applied (a root edit; a world-fact change in `config′`). Fresh generation with no pins is the golden and cannot move. Same seed, same pins, same layer, same reading. `dmLayer` records the DM's overrides: `roots` (by `<cardType>:<entityId>:<field>`) and `worldFacts` (by config key). Generation is milliseconds, so an edit is instant.

**Canon stays events.** A canonized city cannot be corrected — history is lived. There the teleport, the conquest, the new mayor and the new stressor are DECREES the simulation applies at the tick, using the same pinned re-derivation inside the tick, with a chronicle line in the herald's voice; a rename runs the existing cascade on the record. On a draft the same acts are plain corrections (§2.5's canon rule). Drafts re-derive; canon simulates. Both end with one coherent record.

**What this makes simpler.** Phantom promotion (§13) is "forge the seed with the phantom's traits as its layer". Additions and removals are roster roots. The Surveyor proposes only root ops, world-fact ops and decrees (FINITE-SEMANTICS). The wizard is untouched: it still rolls worlds from dials.

**What leaves the editable set.** The system-state cards are derived and are struck. The card list is world facts, NPC, institution, faction, power seat; neighbours and phantoms are their own records.

**One edge, ruled by default.** A faction's power share is a chosen share the guard renormalizes; it stays a ROOT under the totality guard. Vetoable.

**What this changes in the train.** EM-A1 declares five cards (world facts first) from the decision-fork registry and the wizard's option sets; EM-A2's pools are the choosers' candidate sets and the wizard's option sets; EM-B2 is pinned re-derivation — the load-bearing packet — and the lane MEASURES whether the pipeline's derivation steps run from the record's rosters without re-drawing (the culture fact is the one to expect to bite: the prose voice and the naming culture are read in many places, and the packet names every reader), STOPPING with the measured contradiction if they cannot, so that a pipeline-seam packet can precede it; EM-F2's promotion is a forge with the phantom's layer.

## 15. Entity states: exile, jail, ruin, impairment (the owner, ODQ §934.46; 2026-09-19)

An NPC carries a `status` and an institution a `state`, both typed roots set from a pool, both read by the derivations, both events on a canonized town.

- **NPC status** ∈ { active, exiled, jailed, dead, missing, retired, removed } — the tree's `NpcStatus` typedef (`entities/npcs.js`, six values) plus `jailed`, the owner's word, added to the typedef by EM-B1a with every enumerating consumer named (§934.47 addendum 3): "present" is `active`, "departed" is `retired`. One writer, the ops layer, serves the DM's op and the pulse alike. A jailed or exiled holder cannot keep a seat: the holder guard offers a successor (`fulfil`) or `proceed`; an exile may return by a later decree.
- **Institution state** ∈ { active, impaired, ruined, destroyed, vacant, removed } — the tree's `EntityStatus` typedef (five values) plus `ruined`, the owner's word, added by EM-B1a (§934.47 addendum 3): "abandoned" is `vacant`. The scalar `state` on the institution record is CREATED by wave 1 (the pulse's `impairments[]` ledger of typed entries remains the EVENTS that explain the state). One writer, `set-institution-state`, used by the DM's op and by the pulse when it records an impairment. An impaired or ruined institution's services and standing fall in the derivations that read it; a destroyed one stands in the record as a ruin the town remembers.
- **Destruction is a state; removal is erasure.** Both stay available, each with a cause from the removal pool. The record keeps what was destroyed; it forgets what was removed.
- **Ops:** `set-npc-status` and `set-institution-state` join the home set (EM-B1a); `add-institution` is "created". The vocabularies are FINITE-SEMANTICS pools, never free text, and the readers that consume them are named in the packet that adds each field.

## 16. The director's vocabulary — outcomes the DM predetermines or the party shapes (the owner, ODQ §934.48; 2026-09-19)

**The rule.** Every intervention in the owner's list — suing for or accepting peace, receiving or refusing an envoy, directing a force, resupply or resources, steering trade, an automatic win, a siege or a coup that fails, a belief's confidence changed, mutated or corrected, a stressor or an event — is the OUTCOME OF A PROCESS THE SIMULATION ALREADY RUNS. The DM never writes the outcome into the world. The DM PINS THE PROCESS'S DECISION, and the simulation plays the consequences by its own rules. This is §13's phantom rule generalized, and it is §14's engine — pins — applied to the simulation's forks instead of the generator's.

**The mechanism: pins on registered forks.** The simulation registers every weighted decision it makes (the decision-fork registry; forty-two forks today, each with a typed outcome vocabulary). A DIRECTIVE decree names a fork, an outcome from that fork's own vocabulary, and a tick (`when`, §13). When the pulse reaches that fork it takes the pinned outcome instead of rolling — the same consult the generator's pinned mode (EM-P0) performs — and everything downstream (casualties, morale, legitimacy, the chronicle line) follows from the existing machinery. One op type, `pin-fork`, over different forks: peace sued for, accepted or refused; an envoy received or turned away; a siege that holds or falls; a coup that succeeds or is exposed; an automatic win.

**Direction.** Resupply, redirecting a force, steering trade are the levers the simulation's other side already pulls. They surface as decrees that call the war and trade layers' own actions at the tick (`direct-force`, `resupply`, `direct-trade`), so a resupplied army is resupplied by the upkeep mechanics, never by a number typed over the muster.

**Information.** The belief ledger is simulation state with its own forks. Three ops through the pulse's own belief writer at the tick: `set-belief-confidence` (a band), `mutate-belief` (to a recorded variant), `correct-belief` (to the truth). The town's knowledge stays a thing the simulation owns.

**Events, predetermined or shaped by the party.** A predetermined event is a decree with `when` drawn from the pulse's own event catalogue (never free text). An event shaped by the party is the same decree with `cause: 'party'`: "the party broke the siege" pins the siege fork to its lifted-by-outside-aid outcome with the party as the agent, and the chronicle says so in the herald's voice. Stressors added after generation are world facts by consequence (§14).

**What keeps it honest.** Guards stay suggestive (§2.7): a pinned siege with no siege standing offers "start one" (`fulfil`) or `proceed`, never a refusal. Phantom targets yield home procedures and a record only (§13). Applied pins reopen read-only; the rewind is `undoLastPulse` (§12.1). The vocabulary is closed by construction — a fork's own outcomes, a catalogue's own events, a belief's own variants (FINITE-SEMANTICS); the free tier stays annotation.

**What it costs, and where the two programs meet.** ONE HOOK: the pulse consults pins at each registered fork — the shape EM-P0 lands for the generator — so the editor and the simulator share one idea. The fork registry gains the outcome key EM-P2 already adds. `informationStatecraft.js` is hot (780/800): the information ops packet opens with an executed headroom measurement and splits if it must. This is the seam the simulator program (§934.38) builds against.

**Chair defaults, vetoable.** An automatic win settles the war's terms in the same act, from the fork's own vocabulary. A party-caused chronicle line reads "by the party's hand" from the herald's pools.

## 17. Where the acts live, and missions (the owner, ODQ §934.49; 2026-09-19)

**The rule.** Every act starts on the card of the thing it acts on. The dossier is organized by subject (§934.25), so the editor adds no director's console and no second surface: in edit mode a card that holds a first-hand fact wears a PENCIL (an edit, §14), a card that shows a process wears a SEAL (a directive, §16), and a derived card wears neither — a provenance note.

**The seals, by card.**
- The war card: "Sue for peace", "Accept the peace", "Refuse it", "Direct the force", "Resupply", "Let the siege fall" (or hold), "Let the coup fail" (or succeed) — each a `pin-fork` or a direction over the war layer's own forks and actions.
- The trade card: "Receive the envoy", "Turn the envoy away", "Direct trade", "Embargo".
- A rumour or belief row: "Confirm it" (correct), "Cast doubt" (confidence), "Twist it" (mutate to a recorded variant).
- The chronicle's next-tick foot: "Schedule an event" from the pulse's own catalogue, with a `when`.
- A person's card: "Send on a mission" — envoy (to whom: a real save or a phantom; about what: peace, trade, alliance) or spy (on whom), and every other mission the simulation's casting and espionage forks already know, never one they do not. The NPC's status reads away-on-mission until the return the tick resolves; the mission's outcome is pinned by the DM or rolled by the fork; the return follows the estate's own procedures (a caught spy is the espionage layer's business, not a new rule).

**One pop-up shape for every seal.** Worded in the herald's voice ("What befalls this siege?") with the fork's own outcomes as the choices, a `when`, the cause toggle "the party did this" (`cause: 'party'`), and the forge's brown-and-gold scheme (§3). It never shows a fork id. Every act lands in the one registry at the dossier's foot, in order, with a PHANTOM/REAL badge where a counterparty is involved (§13).

**What this fixes for intuition.** The DM never asks "where is the war console"; they look at the war. The same gesture edits a fact and directs a process, and the glyph tells them which. Missions are the one place a person and a process meet, and they live on the person.

**Build.** Wave 3 gains **EM-E7 — missions**: `send-on-mission` over the casting and espionage forks (measured against `envoyCasting.js` and the espionage layer's registered forks), the away-on-mission status (measured: whether `NpcStatus` needs a value or the roster's absence set already covers it), the return at the tick. Wave 4's surfaces place the seals per card as above.

