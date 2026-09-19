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

## 12. The adversarial review's findings and the chair's rulings (2026-09-19 ~23:2x)

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
