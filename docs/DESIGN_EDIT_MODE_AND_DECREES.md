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
A persisted key on the saved settlement: `decrees: [{ id, op, status, addedBy, orderedAt, appliedAt?, chronicleRef?, overrode?: guardId[] }]`. Ordered; reorderable (up/down); entries removable until applied (withdrawn entries are kept for the record). The registry is part of the save, so it survives reload, sign-in and export; it never prints in the PDF while pending.

### 2.6 Application
- **Corrections** apply on Save: the store writer updates the layer; dependents re-derive immediately (the regeneration delta's machinery, scoped to the change); no chronicle entry; the card re-renders.
- **Events** apply at the tick: the pulse's head takes the pending decrees in order, applies each as a cause, then runs the simulation; each applied decree yields a chronicle entry written by the prose engine with cause = the table's hand (`offStage` when the counterparty is a phantom; `overrode` when a guard was proceeded past — "overnight, by means the town does not understand"). The advance report speaks the regeneration card's vocabulary: direct effects, propagated effects, what was kept.

### 2.7 Guards (suggestive, never refusing)
`src/domain/edit/guards.js`: `evaluateGuards(queue, world) → [{ entryId, kind: 'prerequisite' | 'contradiction' | 'duration' | 'range', message, offers: ['fulfil', 'self', 'proceed'] }]`. Rules live in `guardRules.js` and REUSE the estate's authored knowledge: the structural validator's tier rules (a cathedral wants a city; a parish church wants a priest), faction-power totality (adding a faction asks "how much, from whom" or the engine rebalances and shows it as an inserted entry), the tier ranges for section counts, and durations the simulation knows. Coverage is honest: no rule, no guard, and the absence is stated. "Fulfil it for me" inserts a visible, seeded, editable entry marked as added by the guard. "Proceed" records the override on the entry. Cancel is always the DM's own choice.

### 2.8 Phantoms (off-stage counterparties)
`src/domain/edit/phantoms.js` mints a phantom from a seed: `{ id: 'dm:phantom:<seedHash>', name (free), kind (pool), size (pool), stance (pool), traits (rolled) }`. Neighbour rows and the engagement derivations accept a phantom partner (no `saveId`). Off-stage ops (send a force, open trade, declare war) have real home consequences the pulse carries; outcome ops (victory, defeat, stalemate, a truce bought) are decreed or rolled from a pool and applied at a tick. Promotion: forging the phantom as a real settlement takes the phantom's seed, so traits and written history carry over; the realm link then replaces the phantom row.

## 3. The surfaces

- **The library.** A saved settlement's card offers Edit when the tier allows it. Entering opens the dossier in edit mode.
- **Edit mode.** A visible mode indicator in the tome's register; every declared card grows a pencil; every section that accepts additions grows a plus; Done leaves the mode. Anonymous drafts never see it.
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

1. Which tier gets edit mode (the free account, or Cartographer), and whether phantoms and the Surveyor share that gate.
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
