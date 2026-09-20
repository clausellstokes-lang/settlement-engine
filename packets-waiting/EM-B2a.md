# Settlement editor / EM-B2a — PINNED RE-DERIVATION over the four card kinds: `pinsFrom(record)` holds every chosen fact the record carries, `rederive(record, config, layer)` runs the derivation steps through EM-P0's pinned mode with the DM's root overrides released, and the isolation property proves an empty layer changes nothing

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:11 EDT at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`, and re-proved unchanged against the docs-only descendant `34f320829656957d3cfb33ff28b1772859ca5b0a` (`.gitignore` + `docs/implementation/preambles/EM-PREAMBLE.md` only; every measured path byte-identical by object id — evidence §E0, the `PACKET_STANDARD.md` J-T1 shape)
- **Depends on:** `EM-P0` (the pinned mode this packet drives), `EM-P1` (stable ids — the layer key's `<entityId>` slot), `EM-P2` (the registry rows `pinsFrom` enumerates), then `EM-A1` and `EM-B1`. ⭐ **All three prerequisites are now chartered as Wave 0 (§934.47) and the identity decision is DECIDED YES (§934.47 A), so this packet is DRAFT rather than BLOCKED** — its three named blocks became three packets. None has landed; all are named as packet IDs, not SHAs.
- **Collision group:** `EM-B3` (the persisted keys; this packet names NONE of B3's paths and writes no persisted key) · `EM-E3` (`RegenerationDeltaCard` renders the envelope this packet grows by one key) · `EM-B4` (blocked on the same rulings) · ⚠ **`src/generators/pipeline.js` and the five chooser files are a NEW collision surface the charter did not record** — any packet touching generation serializes with this one
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — `src/store/settlementSlice.js` at **816** effective lines against a frozen `scripts/.size-baseline.json` entry of **816** (zero headroom, eslint `Linter`, `skipBlankLines` + `skipComments`); `src/domain/regenerationDelta.js` at **103** effective against the 800 layer ceiling; the lighting census tuple `2645 / 383 / 2262 / 25009 / 6670` at `e5a27a1a5`; the golden master fixture at **525** rows. Every figure executed at this base — evidence §E6, §E7, §E8.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** every VERIFIED row below is receipted in `EM-B2.evidence.md` by command and output.

---

## §0 · ⛔⛔ WHY THIS PACKET IS BLOCKED — THE SMALLEST MEASURED CONTRADICTION

Design §12.5 rules that "the layer is applied ON WRITE — the saved record carries the edited
values, and `dmLayer` records which fields are the DM's (for regeneration to re-apply and for
goldens to ignore)". **The estate already implements that sentence, for a declared field set,
with a named writer and two measured regeneration re-apply seams.**

| The ruling's clause | The tree's existing answer, measured |
|---|---|
| edits applied ON WRITE | `applyUserEdit(entity, path, newValue)` — `src/domain/userEdits.js:181` — mutates the entity's field in place |
| a record of which fields are the DM's | `entity._userEdits = { '<path>': { value, originalValue, editedAt } }` plus `entity._authored = true` (`userEdits.js:205`) |
| every reader sees ONE record | `src/domain/canonStatus.js:99` promotes an `_authored` entity to `source: 'user'`, `canonStatus: 'canon'`, `locked: true` |
| regeneration RE-APPLIES it | NPCs: `mergePreservedNpcs` (`src/domain/regenerationPreservation.js:237`) via `regenerationMode`'s preservation rules. History: `restoreAuthoredHistory` (`src/domain/historyPreservation.js:186`) |
| the mechanism is proven | `src/domain/npc/characterEdit.js:160` — `markerRuling: '_authored alone buys regen survival in all three modes (executed)'` |

**The contradiction, at field level and as small as it gets.** `EDITABLE_FIELDS`
(`src/domain/userEdits.js:73`) declares for `npc`: `goal.short`, `secret.what`, `personality`,
**`role`**. `ARCH_EDIT_MODE_AND_DECREES.md` §9 declares for the npc card: "name free-cascade
with the generator's roll; **role pool** from the world's institutions; disposition pool; note
free". **`npc.role` is declared editable by both mechanisms.**

That is two named writers for one state, which `PACKET_STANDARD.md`'s hard budget forbids
outright ("exactly one named writer for any ONE state that changes"), and it is that document's
own MANDATORY STOP: *"live code refutes state ownership, lifecycle, or ordering."* Whether
`dmLayer` **subsumes**, **excludes**, or **coexists with** `_userEdits`/`_authored` decides this
packet's state schema, its lifecycle table's `regenerate` and `undo` rows, and EM-A1's declared
field set. It is a RULING. A lane does not make it, and this packet does not pretend to.

**THE THREE FORKS, PRICED, for the chair to sign one.**

| Fork | The rule | What it costs here | What it costs elsewhere |
|---|---|---|---|
| **F1 — SUBSUME** | `dmLayer` becomes the one record of DM field ownership; `_userEdits`/`_authored` is migrated into it and retired | +1 existing logic file (`userEdits.js`), + a `retiredSymbols` row, + the two re-apply seams re-pointed → **over the ≤3 existing-logic-file budget; this packet STOPS AND SPLITS** | EM-B4 folds `_userEdits` (its only real input, evidence EM-B4 §E3); `canonStatus`, `regenerationPreservation`, `historyPreservation`, `generationOwnership`, `opVocabulary`, `characterEdit` all re-point — a train, not a car |
| **F2 — EXCLUDE** | `applyEdit` REFUSES any `(cardType, field)` pair that `isEditablePath` admits, with a typed result; `EDITABLE_FIELDS` keeps its four npc paths and `npc.role` leaves EM-A1's declaration | fits this packet's budget unchanged (§3) | EM-A1's npc card loses `role`; the owner's "roles → occupations implied by the world's institutions" pool (design §2.2) has no npc field to serve |
| **F3 — COEXIST** | the two records are declared different states with a stated boundary: `_userEdits` owns authored PROSE, `dmLayer` owns pooled FACTS; `npc.role` is assigned to exactly one of them by name | fits this packet's budget, + one arm asserting the disjointness of the two declared path sets | needs the ruling on `npc.role` and a standing instrument so the sets can never overlap again |

The chair's own preamble (`EM-PREAMBLE.md` §P8) already lists "a second writer of `decrees` or
`dmLayer` appears necessary" as a standing STOP. This is the mirror case — a second writer of the
state `dmLayer` would OWN — and the same STOP applies.

**Everything else in this packet is measured, complete, and ready to dispatch the moment a fork
is signed.** The clauses that a fork decides are marked ⛔ WITHHELD and nowhere else.

---

## §0Y · ⭐ THE BLOCKS BECAME WAVE 0 (ODQ §934.47) — THIS PACKET IS NOW DRAFT

Every measurement in §0, §0A and §0Z below **stands in full**; the chair accepted them and turned
each into a packet, so what blocked this car is now scheduled before it:

| The measured block | Where it went |
|---|---|
| §0Z.1 — `runPipeline` has no pin seam; `generatePopulation` is root-writing and deriving in one body | **EM-P0** (rides alone; the seam and the population split) |
| §0A.2 — no card kind has a regeneration-stable id | **EM-P1** (DECIDED YES, §934.47 A; rides alone) |
| §0A.1 — the decision-fork registry does not cover `src/generators` | **EM-P2** (a SIBLING registry, measured) |
| §0A.3 / §0Z.2 — nine existing logic files against a limit of three | the split: **EM-B2a** (this packet) and **EM-B2b** |
| §0 — `_userEdits` owns DM field ownership | **EM-B4** (DECIDED YES, §934.47 B: roots fold to `dmLayer.roots`, derived and history to `dmLayer.notes`) |

**This packet is now EM-B2a: the pins and `rederive` over the four card kinds, plus the isolation
property.** `config′` world facts and the delta card's DM-fields section are **EM-B2b's**. The
sections below are preserved as compiled, including the measurements that earned the split, and
read as this car's scope wherever they name `dmLayer.worldFacts` or the delta.

⭐ **The `dmLayer on settlement` exemptions row** is accepted as the chair's K3 ruling: it is minted
**at the train terminal, after the writer lands**, and it appears in §7 as a chair `REGISTER` row
scheduled there — never executed by this lane.

---

## §0Z · THE MECHANISM (ODQ §934.44–§934.46, consist `7aa769830`) — AND THE MEASUREMENT THAT SCHEDULED EM-P0

**This section supersedes §0A's mechanism** exactly as §0A superseded §12.5's. The one engine is
**re-derivation with pins**: `pinsFrom(record) → pins` maps every registered decision-fork's key
to the record's stored value; `rederive(record, config′, layer) → record` runs the pipeline's
DERIVATION steps with every chooser the record holds PINNED (no re-roll), a chooser the record
lacks drawing on the seed's own stream, and the layer's overrides applied — a ROOT edit
(`dmLayer.roots[key]`, one pin released) or a WORLD-FACT change (`config′`). Fresh generation with
no pins is the golden. `dmLayer = { roots, worldFacts, minted, phantoms }`.

The chair set gate (1): measure the pipeline, classify each step ROOT-WRITING or DERIVING, and
prove the deriving steps can run from the record's rosters — *"if any deriving step draws ... NAME
IT ... the packet STOPs with the smallest measured one so a pipeline-seam packet can precede B2."*

### §0Z.1 · ⛔ THE SEAM DOES NOT EXIST — the smallest measured contradiction

> `runPipeline(initialContext, rng, options)` (`src/generators/pipeline.js:152`) runs all **23**
> registered steps **unconditionally** against a context built from config alone. It accepts **no
> record**, and `git grep "skip\|reuse\|existing\|pinned\|preserve" -- src/generators/pipeline.js`
> returns **nothing**. `generatePopulation` calls `generateNPCs(...)` with **no roster parameter**
> (`steps/generatePopulation.js:63`), and `generateNPCs` re-mints `npc.id = \`npc_${idx + 1}\``
> positionally on every run (`npcGenerator.js:1631`).

So `rederive` has nothing to attach to and `pinsFrom` has nothing to hand its pins to. Gate (2)
fails on the same evidence: the pipeline neither accepts a pre-populated roster nor preserves ids.

⚠ **`generatePopulation` is ROOT-WRITING AND DERIVING IN ONE STEP** — `generateNPCs` draws the
roster, then `generateRelationships(npcs, …)` and `generateFactions(npcs, relationships)` derive
from it in the same function body. The two halves are not separable at any existing seam, which is
why the cure is an engine change rather than a parameter.

⭐ **The half that already works, recorded so the seam packet can build on it:** `runPipeline`
gives each step its own stream via `rng.fork(name)` (`:165`), so releasing a pin inside one step
cannot shift another step's draws. The per-step determinism pinning needs is present; only the
plumbing is absent.

### §0Z.2 · ⛔ THE ORDERING THIS FORCES — three prerequisites, all before EM-A1

| # | Packet | Why it must precede | Existing logic files |
|---|---|---|---:|
| **EM-P0** the pipeline seam ⚠ owner-gated | `runPipeline` gains a pins parameter; `generatePopulation` splits root-writing from deriving. It reshapes the one engine THE PROMISE rests on, with the 525-row golden master as its own proof | 2 |
| **EM-P1** stable entity identity ⚠ owner-gated | ids for the four card kinds that survive a roster edit and a rename (§0A.2: npc = array index, institution = display name, faction = `slug(name)`) | 2–3 |
| **EM-P2** register generation's choosers | the decision-fork registry's scan roots grow to `src/generators` (§0A.1: zero of 43 rows names one); §14 final reads EM-A1's declarations from that registry | 1 + the walker |

Then **EM-B2a** (`pinsFrom` + `rederive` over the four card kinds + the isolation property, 2
existing logic files) and **EM-B2b** (`config′` world facts + the delta section, 2). As chartered
the work spans **nine** existing logic-bearing production files against a hard limit of three, so
the split is compelled, not chosen.

### §0Z.3 · GATE (4) — THE CULTURE FACT, COUNTED, AS THE CHAIR EXPECTED

`git grep -l "culture" -- src | wc -l` = **145 files**; 21 under `src/generators`, 15 under
`src/domain/display` + `src/pdf`. Inside the pipeline it is read at `resolveConfig.js` (18 reads)
and `buildGenerationContext.js` (4) — **upstream of every chooser** — and passed straight into
`generateNPCs` (`generatePopulation.js:65`). A `config′` culture change therefore re-derives
essentially the whole world, and "only the derivations move" has no measured boundary for this
one fact. Recorded, not adjudicated.

### §0Z.4 · WHAT THIS AMENDMENT DOES NOT MOVE

The verified base stays `d31af2cee` with its J-T1 measurements (the chair re-pins at promotion).
`tests/property/dmLayerGoldenIsolation.test.js` still owes its `scripts/mutation-coverage-manifest.json`
row. The lighting census still moves by this packet's TEST files only. Per the chair's **K3
ruling** the `EXPLAINED_WRITER_EXEMPTIONS` mint for `dmLayer on settlement` is priced here as the
chair's own REGISTER row — ⚠ with one measured constraint: gate 0
(`assertExplainedWriterEvidence`, `scripts/check-observed-shape-readers.mjs:1345`) refuses a row
whose named `src/**` writer does not actually write the key, so the row can be minted only at or
after the commit that writes it. **Canon does not re-derive** — an explicit non-goal; there an
edit is a decree at the tick (wave 3), and `regenSection` already returns early on
`get().phase === 'canon'`.

### §0Z.5 · THE ISOLATION PROPERTY, IN ITS FINAL FORM (replaces A7)

(a) `rederive(record, config, {})` on a golden-generated record equals that record
**byte-for-byte** — pins with no overrides change nothing. (b) A one-root layer moves only that
root and its downstream derivations, every other pinned fact identical. (c) Fresh generation with
no pins equals `tests/fixtures/generator-golden-master.json` across the 525-row corpus, and
`tests/fixtures/dossier-prose-manifest-golden.json` is unmoved. **Anti-vacuity:** (b) must differ
from (a) somewhere, or the layer was never read.


---

## §0A · ⛔⛔ THE CHAIR'S AMENDMENT (2026-09-19, ODQ §934.44 addendum, consist `2280742ab`) — AND THE THREE MEASURED CONTRADICTIONS IT RAISES

**The mechanism of §12.5 is SUPERSEDED.** The layer is no longer patched onto the saved record
(which would leave every derivation the pipeline STORED at generation time stale). Design §14 as
thought through whole: for a DRAFT, an edit **re-runs generation with the layer consulted at each
registered root chooser** of the four card kinds; where the DM overrode the root the chooser takes
the layer's value **and still consumes its draw**, so every untouched root keeps its value; the
record then carries the edited values and every stored derivation follows. Same seed + same layer
= same world. The goldens are generation with an EMPTY layer.

This packet is rewritten to that mechanism below. **It remains BLOCKED, now on three measured
contradictions**, two of which are the chair's own gates firing. Every figure is receipted in
`EM-B2.evidence.md` §E13.

### §0A.1 · ⛔ GATE ONE — the decision-fork registry does not see `src/generators`

The chair directed me to find the choosers through the decision-fork classification registry.
Measured, it cannot answer:

| Fact | Command |
|---|---|
| the registry's scan roots are `src/domain/worldPulse`, `src/domain/spatial`, `src/domain/traditions`, `src/domain/region` — **`src/generators` is not among them** | `sed -n '64,69p' tests/lint/chooserTotality.walker.test.js` |
| **zero** of `HABIT_FORK_REGISTRY`'s 43 rows names a `src/generators` module | `grep -c "generators" src/domain/worldPulse/habitForkRegistry.js` → `0` |
| the registry's own header scopes it: *"Every weighted decision fork in `src/domain`"* | `sed -n '1,8p' src/domain/worldPulse/habitForkRegistry.js` |

The second locator does not close it either: `src/generators` holds **6** `createPRNG(` sites in
4 files, but **74** `rng(` draw sites across **19** files — generation threads ONE rng down through
`runPipeline(initialContext, rng, options)` (`src/generators/pipeline.js:152`), so the choosers are
draw sites, not PRNG-creation sites, and no instrument enumerates them.

Design §14 makes this a prerequisite rather than a detail: *"a chooser without a registry row is
registered first or its field is dropped."* **Registering generation's root choosers is a wave
BEFORE EM-A1**, and EM-A1's declarations (*"read from the decision-fork registry"*) rest on the
same missing rows.

### §0A.2 · ⛔⛔ GATE TWO — NO CARD KIND HAS A STABLE ID, SO A LAYER KEY CANNOT BE STABLE

The chair set this as an explicit block gate. Measured at the base, **none of the four card kinds
mints an id from the PRNG stream**:

| Card kind | How it is identified | Receipt |
|---|---|---|
| **NPC** | `npc.id = \`npc_${idx + 1}\`` — the ARRAY INDEX | `src/generators/npcGenerator.js:1631` |
| **Institution** | **by display NAME** (`institutions.find(i => i.name === instName)`); no general id mint, only `id: \`repair.N\`` | `src/generators/steps/assembleInstitutions.js:426, :492, :285, :701` |
| **Faction** | `id: \`faction.${slug(name)}\`` — DERIVED FROM THE NAME | `src/generators/density/densityAscension.js:142` |
| **Power seat** | references an npc or a faction — inherits both | — |

**The estate has already convicted this class three times, in its own comments:**
`src/domain/locksPreservation.js:228` (*"a locked `npc_3` ... may name somebody else"*),
`src/domain/npc/characterDrift.js:17` (*"a keeper moved npc_6 -> npc_8 while `npc_6` came to name
a"* different person), `src/domain/npc/characterEdit.js:51-53` (*"stamps `npc_${idx+1}` ... came to
name a different person. Every id-keyed SIDECAR is"* exposed).

**Why this is fatal under the AMENDED mechanism specifically.** Design §14 puts the ROSTERS in the
editable set — *"the rosters themselves (which institutions, NPCs and factions exist — additions
and removals are roster roots)"*. A roster edit is exactly what shifts every later index and
re-slugs every renamed faction. Under the old patch-the-record mechanism a mis-keyed layer lost an
edit; under the amended mechanism the layer is consulted at the chooser on EVERY regeneration, so
a mis-keyed layer **applies the DM's value to the wrong entity, every time, forever**. THE PROMISE's
extension — "same seed, same layer, same world" — cannot hold on this base.

⛔ **Per the chair's instruction, the packet is BLOCKED on this.** The cure is a stable entity
identity for the four card kinds, minted so a same-seed regeneration re-mints it and a roster edit
cannot re-point it. That is its own packet, before EM-A1, and naming its scheme is an owner-gated
persistence-shape decision — not a lane's.

### §0A.3 · ⛔ STOP AND SPLIT — THE BUDGET IS EXCEEDED EVEN IF BOTH GATES CLEAR

Files holding root choosers for the four card kinds, counted:

| file | `rng(` sites | roots it chooses |
|---|---:|---|
| `src/generators/npcGenerator.js` | 23 | npc name, role, disposition, roster |
| `src/generators/steps/assembleInstitutions.js` | 0 direct (draws via helpers) | institution roster, class, standing |
| `src/generators/power/relationshipArchetypes.js` | 5 | faction archetype, stance |
| `src/generators/power/stressFactions.js` | 1 | faction roster, power share |
| `src/generators/power/rulingStructure.js` | 0 direct | the power seat's holder |
| `src/generators/pipeline.js` | threads the single rng (`runPipeline`, `:152`) | the hook's host |

**Five to six existing logic-bearing production files against a hard limit of three**, before
`regenerateWithLayer` and the delta section are counted. The split the chair authorized, with its
own budgets:

| Split | Scope | Existing logic files | New leaves | Eff lines | Cases |
|---|---|---:|---:|---:|---:|
| **EM-B2a** — the hook at the choosers | `drawRoot(rng, key, pool, layer)` in `src/generators/pipeline.js`; `layerRead` in `src/domain/edit/dmLayer.js`; the hook threaded at the npc choosers ONLY; the isolation property in its true form | 2 (`pipeline.js`, `npcGenerator.js`) | 1 | ≤200 | 5 |
| **EM-B2b** — the remaining choosers | the hook at the institution, faction and power-seat choosers | 3 (`assembleInstitutions.js`, `relationshipArchetypes.js` + `stressFactions.js`, `rulingStructure.js`) | 0 | ≤120 | 4 |
| **EM-B2c** — the orchestration | `applyEdit(layer, op)`, `regenerateWithLayer(seed, config, layer)`, `src/domain/regenerationDelta.js`'s `dmFields` section | 2 (`regenerationDelta.js`, the store's regeneration path) | 0 | ≤150 | 6 |

⚠ The chair's two-way split (B2a = the hook, B2b = orchestration + delta) does **not** fit: the
hook alone spans five to six chooser files. Three cars do fit. This is a proposal, not a decision.


### §0.5 · ⭐ ADDENDUM — DESIGN §14 LANDED MID-COMPILE AND SHARPENS THIS BLOCK

Between this packet's base and 11:30 EDT the chair landed five commits, including
`docs/DESIGN_EDIT_MODE_AND_DECREES.md` **§14 — "Edit at the source, never at the derivation"**
(the owner, ODQ §934.44) and its preamble row `HZ-DERIVED`. **This packet's own charter row is
BYTE-IDENTICAL at that HEAD** (only EM-A1's and EM-F1's rows moved), so nothing above is stale —
but §14 changes what the chair is ruling on, in this packet's favour and against the block's
other half.

§14's ROOT list, verbatim: *"an NPC's name, **role** and disposition; an institution's name,
class and standing; a faction's name, archetype and stance; a power seat's holder."*

1. **`npc.role` is now RULED the editor's**, as a root fact. Half of §0's overlap is answered:
   `dmLayer` has the owner's claim on that field.
2. **The other half is now sharper, not resolved.** `src/domain/userEdits.js` still declares
   `npc.role` editable as free prose through `applyUserEditAction`, with `_authored` buying it
   regeneration survival. Two writers of one field remain, and the newest law does not say which
   retires.
3. **A THIRD fact §14 surfaces, larger than the first two.** `EDITABLE_FIELDS`'s fourteen
   settlement-root paths are mostly **DERIVED** prose — `economicViability.summary`,
   `economicState.safetyProfile.safetyDesc`, `guardEffectivenessDesc`, `economicDragDesc`, and
   five `history.*` paths. §14 rules derived facts never editable on any card and rules history
   "the chronicle's and immutable (THE PROMISE)". So a shipped surface edits facts the newest
   design law forbids editing. That is not this packet's to repair, and it is not EM-A1's either
   — it is a standing ruling the chair owes, and it makes fork **F1 (SUBSUME)** look less like a
   budget overrun and more like the honest cure.

The forks in §0 stand unchanged; §14 supplies evidence for choosing among them.

---

## §1 · Reconciled authority

0. ⭐ **THE CHAIR'S AMENDMENT, 2026-09-19 — ODQ §934.44 addendum**, on the consist at
   `2280742ab`, thought through whole in `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 and folded
   into the ARCH's `dmLayer` row, instrument 7 and the charter's EM-B2 row (now "the layer at the
   chooser"). **THE MECHANISM OF §12.5 IS SUPERSEDED — its intent stands.** The layer is not
   patched onto the saved record; it acts AT THE CHOOSER. This is the newest ruling and it
   outranks every §12 clause it touches. §0A holds this packet's re-measurement of it.
1. **ODQ §934.42** (the owner, 2026-09-19 10:5x EDT): "Actually pause this and build the editor" —
   the push chain is paused and the editor is built NOW from the charter, with the consist tip
   standing in for master as the packets' base.
2. **ODQ §934.40 / `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §12 — GOVERNS.** §12.5: the layer is
   applied ON WRITE. §12.12: the delta card's "kept" is an entity diff, so a field-level section
   is NEW derivation. §12.3: names are join keys (`free-cascade`, a typed rename op).
3. **THE PROMISE** (constitutional): a seed is a STARTING world forever; the pencil never
   rewrites what the chronicle recorded.
4. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1 (the module map and `dmLayer.js`'s exports), §2 (the
   `DmLayer` JSDoc type), §8 instrument 7 (the golden isolation property).
5. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, wave 1, row **EM-B2**.
6. `docs/implementation/PACKET_STANDARD.md` and `docs/implementation/preambles/EM-PREAMBLE.md`.
7. Live git state at `d31af2cee` — which outranks all of the above on what exists.

**Resolved contradictions**

- ARCH §2.4 "the layer is composed over it at read time" → **withdrawn** by design §12.5; the
  record carries the values and `dmLayer` records ownership. The ARCH's own §1 row already
  carries the amendment.
- The charter's hint "find it by symbol under `src/store` and `src/generators/pipeline`" →
  **`src/generators/pipeline/` does not exist** (evidence §E2). The real spellings are
  `src/generators/pipeline.js` and `src/generators/generateSettlementPipeline.js`, and the
  regeneration path for a SAVED settlement is `regenSection` in `src/store/settlementSlice.js:456`.
- `EM-PREAMBLE.md` §P2.1 "a new file under `src/domain/**` ... moves the sovereignty-lighting
  census" → **REFUTED by measurement** (evidence §E7a): the walker walks `tests/` only and `files`
  is `TEST_FILES.length`. The census moves on this packet's two NEW TEST FILES. The chair owes
  §P2.1 a correction, since a preamble edit re-stamps every member.
- **Design §12.5's MECHANISM → SUPERSEDED by §14 (the chair's amendment, §0A).** The layer acts
  at the chooser; the record is never patched. Every clause below is written to the amendment.
- Design §12.5's mechanism vs `src/domain/userEdits.js` → the amendment settles the ARCHITECTURAL
  half: `_userEdits` IS the patch-the-record mechanism §14 supersedes. It does not settle the
  OWNERSHIP half — `_userEdits` still ships, still writes `npc.role`, and still survives
  regeneration through `_authored`. §0's three forks stand.
- "find the choosers through the decision-fork classification registry" → **REFUTED; §0A.1.**
- "`<cardType>:<entityId>:<field>` ... prove it or the packet is BLOCKED" → **PROVED FALSE;
  §0A.2.** No card kind has a regeneration-stable id.

The implementer does not read other documents to reinterpret this packet.

## §2 · Outcome

**Observable result:** a plain edit to a declared field of a saved DRAFT settlement writes the
value onto the record and records the field as the DM's in `dmLayer`; a section regeneration
re-applies those fields onto the freshly generated record; the regeneration delta reports them
by field; and the generator golden master and the dossier prose manifest do not move.

**Definition of done:** `src/domain/edit/dmLayer.js` exports `applyEdit`, `reapplyLayer`,
`DM_ID_NS` and `mintDmId` at the exact contracts of §6; `regenSection` calls `reapplyLayer` at
the one lawful seat; `deriveRegenerationDelta` returns a twelfth key `dmFields`; the eight
acceptance cases of §9 pass; the two goldens are byte-identical.

**In scope**

1. the pure leaf `src/domain/edit/dmLayer.js` (the one primary behaviour);
2. one required integration — the re-apply seat inside `regenSection`, net zero effective lines;
3. one prevention guard — `tests/property/dmLayerGoldenIsolation.test.js`, ARCH §8 instrument 7.

**Explicit non-goals**

- the persisted keys, the denylists, `publicSafe` / `worldSnapshotPublic`, the travel test and
  the observed-shape exemption row — **all EM-B3's**, and no path of B3's is named here;
- the migration of existing state — **EM-B4's**;
- the registry, the guards, the store slice, the tick, any component, any flag, any tier gate;
- any change to `_userEdits` / `_authored` — ⛔ WITHHELD pending §0's fork;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

⛔ **AS CHARTERED UNDER THE AMENDMENT, THIS PACKET EXCEEDS THE BUDGET AND STOPS AND SPLITS.**
The row that breaks first is the one the chair predicted: **existing logic-bearing production
files modified — SIX measured (`src/generators/pipeline.js`, `npcGenerator.js`,
`steps/assembleInstitutions.js`, `power/relationshipArchetypes.js`, `power/stressFactions.js`,
`power/rulingStructure.js`) plus `src/domain/regenerationDelta.js` and the store's regeneration
path — against a hard limit of THREE.** The three-car split is proposed in §0A.3 with each car's
own budget. The table below is the budget for **EM-B2a** (the hook, the helper, the npc choosers
and the isolation property); it is the only car that fits as a single packet today, and even it
cannot be dispatched until §0A.1 and §0A.2 are ruled.

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | 0 | ≤1 |
| Named state writers | 1 (`applyEdit`) | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 (headless) | ≤1 |
| Direct consumers | 1 (`runPipeline`'s step hosts, through the one `drawRoot` helper) | ≤2 |
| New logic-bearing production leaves | 1 | ≤2 |
| Existing logic-bearing production files modified | **2 in EM-B2a** (`src/generators/pipeline.js`, `npcGenerator.js`); **6+ as chartered** | ≤3 |
| Additional registration-only files | 1 | ≤3 |
| Handwritten files total | 7 | ≤12 |
| New/changed effective production lines | ≤250 | ≤400 |
| Effective lines per new leaf | ≤200 | ≤250 |
| Delta in a shared/baselined file | **0** (`settlementSlice.js`, measured zero headroom) | ≤15 |
| Acceptance cases | 8 | ≤8 |

Overrides approved before dispatch: `NONE`. ⛔ **No budget is raised or invented here** — the excess is reported and split, per `PACKET_STANDARD.md`.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B2
```

Expected: exact packet Markdown and structured capsule emitted; verified-base ancestry and
unchanged declared substrate proven before the seal pins exact HEAD; the CREATE targets
(`src/domain/edit/dmLayer.js`, the two test files) absent; the MODIFY targets
(`src/domain/regenerationDelta.js`, `src/store/settlementSlice.js`) clean; every required symbol
of §5 resolving; Git-visible foreign dirt fingerprinted without target overlap.

**This packet is BLOCKED and may not be dispatched at all until §0's fork is signed.** Any
mismatch after that makes it STALE. Stop before coding.

## §5 · Verified tree contract

Every row was re-found by symbol at this base; no line number below is a coding instruction.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Regeneration path | `src/store/settlementSlice.js` | `regenSection: async (section) => {` | the ONE store action that re-runs generation on an existing settlement; returns early on `get().phase === 'canon'`; exactly two branches, `'npcs'` → `eng.regenNPCsPipeline` + `foldRegeneratedRoster`, `'history'` → `eng.regenHistoryPipeline` | The re-apply seat. No second regeneration path |
| Delta deriver | `src/domain/regenerationDelta.js` | `export function deriveRegenerationDelta` | returns an ELEVEN-key envelope — `directEffects, rippleEffects, capacityShifts, dailyLifeShifts, preservedCanon, brokenDependencies, newEntities, removedEntities, newOpportunities, newRisks, summary` — identically on the nullish branch and the real return | Extend by exactly one key; preserve the eleven and their order |
| Delta size | `src/domain/regenerationDelta.js` | `export function regenerationDeltaSize` | sums the four effect layers plus added/removed entities; returns 0 for nullish | Preserve; `dmFields` does NOT enter the size (it is not a structural change) |
| Entity diff | `src/domain/regenerationDelta.js` | `export function newEntitiesByType` | groups `newEntities` by `type` | Preserve |
| Save writer | `src/store/settlementSlice.js` | `updateSavedSettlement` | refuses any key outside the closed patch list, returning a typed `makeActionResult` envelope | Only mutation path for a save row; unchanged by this packet |
| Patch key set | `src/store/settlementSliceHelpers.js` | `export const SAVED_SETTLEMENT_PATCH_KEYS` | a frozen 17-key list whose first member is `'settlement'` | `dmLayer` rides INSIDE the settlement blob; this list is NOT widened |
| ⛔ Rival writer | `src/domain/userEdits.js` | `export function applyUserEdit` | mutates the entity's field and records `{ value, originalValue, editedAt }` under `entity._userEdits[path]`, then sets `entity._authored = true` | **§0's block.** Untouched until the fork is signed |
| ⛔ Rival declaration | `src/domain/userEdits.js` | `export const EDITABLE_FIELDS` | declares 6 entity types + 14 settlement-root prose paths; `npc` carries `goal.short`, `secret.what`, `personality`, **`role`** | **§0's block.** The single measured overlap is `npc.role` |
| ⛔ Rival re-apply (npcs) | `src/domain/regenerationPreservation.js` | `export function mergePreservedNpcs` | re-seats `_authored` NPCs into a fresh roster under `regenerationMode`'s rules | **§0's block** |
| ⛔ Rival re-apply (history) | `src/domain/historyPreservation.js` | `export function restoreAuthoredHistory` | re-applies authored settlement-root `history.*` prose after a history reroll | **§0's block** |
| Authorship marker | `src/domain/npc/characterEdit.js` | `export const AUTHORED_MARKER_KEY` | `'_authored'`, with the recorded ruling "`_authored` alone buys regen survival in all three modes (executed)" | Reuse the vocabulary; never a second marker |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `hashFor` / `MANIFEST` | `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, { seed, customContent: {} })))` over a 525-row committed fixture | UNCHANGED. The update command is FORBIDDEN (§6) |
| Pipeline | `src/generators/generateSettlementPipeline.js` | `export function generateSettlementPipeline` | the function the golden hashes; its output is normalized by `assembleSettlement.js:324` | No writer of `dmLayer` exists in it, and none is added |
| Prose golden | `tests/property/dossierProseManifest.test.js` | `MANIFEST_REL` | `'tests/fixtures/dossier-prose-manifest-golden.json'` | UNCHANGED |
| Test precedent (unit) | `tests/domain/regenerationDelta.test.js` | `describe('deriveRegenerationDelta()')` › `it('returns canonical envelope shape')` and `it('does not mutate either snapshot')` | flat literal registration; asserts the whole envelope and purity | Copy this proof shape for `dmLayer.test.js` |
| Test precedent (property) | `tests/property/beliefMapGolden.test.js` | `describe('belief-map golden (WAVE A, deterministic)')` › `it('is deterministic across two runs (byte-identical projection)')`, `it('anti-vacuity: the belief maps are non-empty and the two modes differ')` | flat literal registration; a byte-identity arm beside an explicit anti-vacuity arm | Copy this proof shape for `dmLayerGoldenIsolation.test.js` |
| Test precedent (round trip) | `tests/store/lifecycleRoundTrip.test.js` | `describe('E-C worldState — ensure fixpoint, persist, clone, migrate, dormancy')` › `test('the persist hop (JSON round-trip) then re-ensure survives byte-exact')` | the estate's fixpoint idiom | Copy for A6 |

**Forbidden alternatives**

- no second record of DM field ownership beyond the one §0's fork names;
- no second regeneration path, no second delta deriver, no second identity namespace, no second
  PRNG stream, no second settlement writer;
- no new top-level `worldState` key; no persisted key written by this packet;
- no direct edits to `src/store/persistProjection.js`, `src/domain/display/publicSafe.js`,
  `src/domain/display/worldSnapshotPublic.js`, any denylist mirror, or
  `scripts/check-observed-shape-readers.mjs` — **every one of those is EM-B3's**;
- no edits to `src/domain/userEdits.js`, `regenerationPreservation.js`, `historyPreservation.js`,
  `canonStatus.js` — ⛔ WITHHELD by §0;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

⛔ **WRITTEN TO THE AMENDED MECHANISM (§0A).** Item (2)'s key spelling is the packet's BLOCK:
no card kind has a regeneration-stable id at this base, so the `<entityId>` slot has no lawful
value. Every other clause is exact and dispatchable the moment identity lands.

```js
/**
 * @typedef {{ roots: Record<string, unknown>, minted: Record<string, object>,
 *             phantoms: Record<string, object> }} DmLayer
 * `roots` is keyed by the ROOT KEY of item (2). The value stored is THE DM'S OVERRIDE — under
 * the amended mechanism the record is regenerated FROM the layer, so the layer is the input and
 * the record is the output. (This inverts §12.5's storage: there the layer held the engine's
 * original; here it holds the DM's value.)
 */
export const EMPTY_DM_LAYER;   // frozen; the one spelling
export const DM_ID_NS;         // exactly `dm:`

/** (1) THE READ. Pure, total, throws never. */
export function layerRead(layer, key);   // → value | undefined  (undefined = the DM did not override)

/**
 * (1) THE HOOK — ONE helper, called at each registered root chooser.
 * ⭐ THE DRAW IS ALWAYS CONSUMED. `rng` is advanced EXACTLY as an unoverridden draw would
 * advance it, BEFORE the layer is consulted, so an override cannot shift any later chooser's
 * value. This single rule is what makes "untouched roots keep their value" true and what makes
 * instrument 7's one-root property provable.
 * @returns {unknown} the layer's value when `layerRead` returns a defined value AND that value
 *   is a member of `pool`; otherwise the drawn value. An override NOT in `pool` is IGNORED and
 *   the drawn value stands — a pool is the chooser's candidate set and the layer may not widen it.
 */
export function drawRoot(rng, key, pool, layer);

/** (3) THE OP APPLICATION. Pure; the layer in, a new layer out. Never touches a record. */
export function applyEdit(layer, op);    // → DmLayer

/**
 * (3) THE ORCHESTRATION. Re-runs the REAL pipeline with the layer threaded to every hook.
 * @returns {object} the regenerated record. Same seed + same config + same layer = the same
 *   record, byte-for-byte (THE PROMISE extended, design §14).
 */
export function regenerateWithLayer(seed, config, layer);

/** Deterministic DM id mint: `dm:<kind>:<16 lowercase hex of sha256(`${seed}|${kind}|${n}`)>`.
 *  Throws TypeError on a non-string seed, an unknown kind, or an n that is not a non-negative
 *  safe integer. No PRNG, no clock, no locale. */
export function mintDmId(seed, kind, n);
```

**(2) THE ROOT KEY — ⛔ THIS IS THE BLOCK.** The intended spelling is
`<cardType>:<entityId>:<field>`. Measured at this base (`EM-B2.evidence.md` §E13b), no
`<entityId>` is regeneration-stable: NPC ids are the ARRAY INDEX
(`npcGenerator.js:1631`, `npc_${idx+1}`), institutions are identified BY DISPLAY NAME
(`assembleInstitutions.js:426, :492`), and faction ids are `faction.${slug(name)}`
(`densityAscension.js:142`). Design §14 makes ROSTERS editable, which is exactly what shifts an
index and re-slugs a name — so under the amended mechanism a mis-keyed layer applies the DM's
value to the WRONG ENTITY on every regeneration. The chair's own gate fires: **BLOCKED.**

**(3) THE REAL PIPELINE ENTRY, measured.** `runPipeline(initialContext, rng, options)`
(`src/generators/pipeline.js:152`) is the runner that threads the single rng to every step, so it
is `drawRoot`'s host; `generateSettlementPipeline(config, importedNeighbour, options)`
(`src/generators/generateSettlementPipeline.js:77`) is the entry the golden hashes and the one
`regenerateWithLayer` must call, so the isolation property compares like with like.

**(5) THE DELTA SECTION.** `src/domain/regenerationDelta.js` gains a TWELFTH key `dmFields`,
after `summary`, on BOTH the nullish branch and the real return, reading `dmLayer.roots`:
`Array<{ key: string, cardType: string, field: string, dmValue: unknown, engineValue: unknown }>`,
ASCII-ascending on `key`, `[]` when the layer is absent or empty, NOT counted by
`regenerationDeltaSize`. The eleven existing keys and their order are untouched.

⛔ **WITHHELD pending the rulings:** (a) the `<entityId>` spelling, pending the identity packet
(§0A.2); (b) `applyEdit`'s treatment of a field `isEditablePath` also admits, pending §0's fork;
(c) the chooser roster, pending the registry rows for `src/generators` (§0A.1). Nothing else in
this section is withheld.

⭐ **CANON IS AN EXPLICIT NON-GOAL.** A canonized settlement does NOT regenerate — history is
lived (THE PROMISE). There an edit is a DECREE the simulation applies at the tick (wave 3,
EM-E1), and a rename runs the existing cascade on the record (`free-cascade`, §12.3). Measured,
the tree already enforces the half this packet relies on: `regenSection` returns early on
`get().phase === 'canon'`.

### State schema

`dmLayer` is a plain JSON object on the saved settlement record, shaped exactly as `DmLayer`.
It holds the ENGINE'S ORIGINAL value per owned field; the DM's value lives on the record itself.
Bounds: `entities` keys are EntityRef ids; field keys are the dotted paths EM-A1 declares;
values are JSON scalars, arrays or plain objects — never functions, `undefined`, `NaN`, or a
cyclic graph. **This packet writes no persisted key; EM-B3 persists it.**

**Absence rules**

- **absent** (`record.dmLayer === undefined`): the record has never been edited. Read as
  `EMPTY_DM_LAYER`. This is the ONLY shape a generated settlement ever has.
- **empty** (`{ entities: {}, minted: {}, phantoms: {} }`): every edit was reverted. Legal,
  and behaviourally identical to absent. NEVER normalized back to absent by this packet.
- **`null`**: FORBIDDEN as a stored value. Read defensively as `EMPTY_DM_LAYER`; never written.
- **invalid legacy input** (a non-object, or an object missing any of the three keys): read as
  `EMPTY_DM_LAYER` and the missing sub-objects are materialized empty. Never a throw.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| `layer` without `<id>.<field>` | `applyEdit(record, layer, op)` | the field is declared by EM-A1 for the target's card type | record's field ← the op's value; `layer.entities[id][field]` ← the record's PRIOR value | `{ ok: true, fields: ['<id>.<field>'] }` |
| `layer` WITH `<id>.<field>` | `applyEdit` on the same field again | as above | record's field ← the new value; **`layer.entities[id][field]` is NOT overwritten** — the engine's original is kept | `{ ok: true, fields: ['<id>.<field>'] }` |
| any | `applyEdit` with an undeclared field | — | both returned unchanged | `{ ok: false, reason: 'undeclared_field' }` |
| any | `applyEdit` with a target id absent from the record | — | both returned unchanged | `{ ok: false, reason: 'unknown_target' }` |
| any | `applyEdit` with an op `validateOp` refuses | — | both returned unchanged | `{ ok: false, reason: 'invalid_op' }` |
| regenerated record + `layer` | `reapplyLayer` | the entity id exists in the regenerated record | that field ← the DM's value carried in the layer's paired record | `{ reapplied: [...], dropped: [] }` |
| regenerated record + `layer` | `reapplyLayer` | the entity id is ABSENT | field skipped | `{ reapplied: [...], dropped: ['<id>.<field>'] }` |

### Ordering and precedence

- **Pipeline position:** `reapplyLayer` runs inside `regenSection`, AFTER the `'npcs'` /
  `'history'` branch has written its parts to the store and BEFORE
  `deriveRegenerationDelta(before, after)` is called. A re-apply after the delta would make the
  delta describe a world no reader ever sees.
- **Same-tick visibility:** the re-applied fields are visible to the delta in the same action.
- **Merge/replace:** `applyEdit` REPLACES the record's field value and NEVER replaces an existing
  original in the layer (the second row of the transition table). `reapplyLayer` replaces the
  regenerated value at every re-applied field.
- **Tie-break:** none — one op touches one field of one entity.

### Determinism

- **Hash/fork key:** `mintDmId` = `sha256(`${seed}|${kind}|${n}`)`, first 16 lowercase hex.
  No other hash, and no PRNG draw anywhere in this packet.
- **Stable enumeration:** `reapplied` and `dropped` are ASCII-ascending on `"<id>.<field>"`;
  `dmFields` (below) is ASCII-ascending on `entityId` then `field`.
- **Rounding/clamping:** none — no numeric derivation.
- **No-draw behaviour:** `reapplyLayer` on an empty or absent layer returns the regenerated
  record REFERENTIALLY UNCHANGED with `reapplied: []` and `dropped: []`.

### Flag and dormancy

- **Flag:** `NONE`. Wave 1 is headless and mints no flag (`EM-PREAMBLE.md` §P2, charter wave 1).
- **Golden posture:** **UNCHANGED.** `tests/property/generatorGoldenMaster.test.js` with
  `tests/fixtures/generator-golden-master.json` (525 rows) and
  `tests/property/dossierProseManifest.test.js` with
  `tests/fixtures/dossier-prose-manifest-golden.json` are byte-identical before and after.
  ⛔ **`UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js` IS
  FORBIDDEN TO THIS PACKET.** Any motion of either fixture is a STOP, not a re-record.
  The mechanism that makes this true is measured, not asserted: the golden hashes
  `generateSettlementPipeline`'s output, and no writer of `dmLayer` exists anywhere in `src/`.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| `applyEdit` materializes `dmLayer` from `EMPTY_DM_LAYER` on the first accepted op; a generated settlement is created WITHOUT the key | every reader sees ONE record — the edited values are on the record itself; only `dmLayer` consumers read the layer, and only through `src/domain/edit/**` | ⛔ NOT THIS PACKET — `EM-B3` partializes the key with the save. This packet's `applyEdit` returns the layer to its caller and writes nothing | ⛔ EM-B3. Absent/empty/invalid all read as `EMPTY_DM_LAYER` (the absence rules) so a pre-EM save reloads correctly the day the key ships | **THIS PACKET.** `regenSection` calls `reapplyLayer` on the post-branch record before the delta; fields whose entity vanished are `dropped`, never re-created; `regenSection` returns early on canon, so a canonized settlement never regenerates | `revertUserEdit` is the EXISTING per-field undo for `_userEdits`; ⛔ the layer's own undo is WITHHELD pending §0's fork and is otherwise EM-C1's `withdraw`/`reopen` | ⛔ EM-B3/EM-B4. Design §11: edits do not travel — a fork, an import and the gallery projection carry neither key | ⛔ EM-B3 names both keys in `publicSafe` and `worldSnapshotPublic`. This packet emits no player-facing projection and no receipt string |

### Receipts and privacy

- **Closed kinds:** `applyEdit`'s `result.reason` ∈ `{'undeclared_field','unknown_target','invalid_op','field_owned_elsewhere'}` (the fourth is F2-only, §0). No other value.
- **Address chain:** `"<entityId>.<field>"`, with `entityId` an EntityRef id.
- **Numeric-to-word bands:** `NONE` — this packet renders no figure, so nothing is owed to
  prose-numerics (`EM-PREAMBLE.md` §P2.7).
- **DM-only fields:** the whole layer. ⛔ Its projection rule is EM-B3's.
- **Player/public projection:** `NONE` in this packet — headless, no projection surface.

### The twelfth delta key

```js
/** Added to BOTH the nullish branch and the real return of deriveRegenerationDelta, as the
 *  TWELFTH key, after `summary`, leaving the eleven and their order untouched.
 *  @type {Array<{ entityId: string, entityType: string, field: string,
 *                 dmValue: unknown, engineValue: unknown, state: 'kept'|'dropped' }>}
 *  ASCII-ascending on entityId then field. `[]` on the nullish branch and whenever
 *  `after.dmLayer` is absent or empty — so every existing caller sees an added key and no
 *  changed one. `regenerationDeltaSize` does NOT count it: a DM's own field is not a
 *  structural change the world made. */
dmFields
```

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY` — this packet touches no faction/deity alignment surface.
- **Edit story:** this packet IS the DM edit path's leaf. The DM verb is EM-D2's `Save` in the
  generated modal, reaching this leaf through EM-C4's store slice and the ONE generic decree
  adapter (design §12.13). ⛔ Its relationship to the existing `applyUserEditAction` verb is
  §0's fork.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/dmLayer.js` | `EMPTY_DM_LAYER`, `DM_ID_NS`, `mintDmId`, `applyEdit`, `reapplyLayer` | 200 eff | Write the pure leaf at §6's exact signatures. Zero imports from `src/components`; strict-typecheck clean; no PRNG, no clock, no locale. |
| `MODIFY` | `src/domain/regenerationDelta.js` | `deriveRegenerationDelta` (both the nullish branch and the real return) | +35 eff | Add the twelfth key `dmFields` exactly as §6 specifies. Do not touch the eleven, their order, `regenerationDeltaSize` or `newEntitiesByType`. |
| `MODIFY` | `src/store/settlementSlice.js` | `regenSection`, between the branch's write and the `deriveRegenerationDelta` import | **+0 eff (NET ZERO)** | Insert the `reapplyLayer` call one-line-for-one-line. ⛔ The file measures 816 effective against a frozen `.size-baseline.json` entry of 816 — ZERO headroom; any growth reds `max-lines`. If net zero cannot be expressed here, move the seat into `src/store/settlementSliceHelpers.js` by the file's own delegation idiom and re-measure BOTH files with eslint's `Linter`. |
| `TEST` | `tests/domain/dmLayer.test.js` | A1–A5, A8 | n/a | Copy the proof shape of `tests/domain/regenerationDelta.test.js`. Flat literal `it(...)` only — no `.each`, no loops, no conditionals, no nested describes (`EM-PREAMBLE.md` §P3.4). |
| `TEST` | `tests/property/dmLayerGoldenIsolation.test.js` | A6, A7 | n/a | Copy the proof shape of `tests/property/beliefMapGolden.test.js`, including its explicit anti-vacuity arm. |
| `TEST` | `tests/domain/regenerationDelta.test.js` | one arm inside `describe('deriveRegenerationDelta()')` | n/a | Assert the twelfth key on both branches and that the eleven are unmoved. Re-assert `it('returns canonical envelope shape')` against TWELVE keys. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/property/dmLayerGoldenIsolation.test.js` | +4 eff | Add the row SURGICALLY beside its `tests/property/*Golden*` siblings. ⛔ Never re-serialise the manifest whole. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json` — regenerated, NEVER hand-edited:

```sh
LIGHTING_CENSUS_REFREEZE='EM-B2' LIGHTING_CENSUS_NOTE='EM-B2: two new test files (dmLayer unit, golden isolation property)' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

It refuses a dirty tree, writes all five figures or none, and EXITS NON-ZERO BY DESIGN; the
proof is a plain re-run afterwards.

**Predicted INTERIOR RED** (named before it exists, per `PACKET_STANDARD.md`'s train law): the
lighting census moves from `2645 / 383 / 2262 / 25009 / 6670` to **`2647 / 383 / 2264 / <25009 +
the two files' literal titles> / <6670 + their literal suite titles>`** — `+2 files, +0 parked,
+2 credited`, the title counts exact once the two files are written and counted by execution.
⚠ THE CAUSE IS THE TWO NEW **TEST** FILES, not `src/domain/edit/dmLayer.js`: the walker walks
`tests/` only and `files` is `TEST_FILES.length` (evidence §E7a; `EM-PREAMBLE.md` §P2.1 is wrong
about this and the chair owes it a correction).

**Registers that DO NOT move, measured rather than assumed:**
`scripts/check-writer-reach.mjs` (no new written identity, no new customer surface — neither
`--write` nor a mint), `scripts/check-observed-shape-readers.mjs` (gate 0 would refuse an
exemption naming a writer that does not exist until EM-B3, and the resolver yields no finding for
a parameter with no `src/` call site), the five edge-shared bundles (`regenerationDelta.js` is in
none of the closures, measured against each meta's own `inputs`), `scripts/.size-baseline.json`
(net-zero edit; never raised), `tests/lint/proseNumerics.test.js` (nothing rendered).

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch. **Refuse to start while the
   status is BLOCKED.**
1. Capture the baseline: both golden fixtures' SHA-256; the lighting tuple; eslint `Linter`
   `max-lines` for `src/store/settlementSlice.js` (expect **816**) and
   `src/domain/regenerationDelta.js` (expect **103**).
2. Add the failing tests for A1–A8.
3. Implement `src/domain/edit/dmLayer.js` (the pure leaf and the data contract).
4. Extend `deriveRegenerationDelta` with `dmFields` on both branches.
5. Wire the ONE consumer: `reapplyLayer` inside `regenSection` at the seat named in §6, net zero.
6. Add the `scripts/mutation-coverage-manifest.json` row; regenerate the lighting baseline with
   the §7 command; re-run the walker plainly for the green.
7. Run the focused verification of §10.
8. Under the train, the bare full gate and the boot smoke move to the terminal; write the
   completion receipt of §12.

**Bounded algorithm — `reapplyLayer`**

```text
1. If layer is nullish, or entities has no own key, return { record: regenerated,
   reapplied: [], dropped: [] } with `record` REFERENTIALLY the argument.
2. Collect every "<entityId>.<field>" in entities, ASCII-ascending on entityId then field.
3. For each: resolve entityId in the regenerated record by the EntityRef rules EM-A1 declares.
   a. Absent  -> push to `dropped`; continue. NEVER create the entity.
   b. Present -> write the DM's value at `field` on a structurally-shared copy; push to `reapplied`.
4. Return the new record and the two sorted, deduplicated lists. Mutate neither argument.
```

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | a saved draft record + `EMPTY_DM_LAYER` + one valid `set-field` op on a declared pool field | the returned record carries the DM's value; `layer.entities[id][field]` carries the ENGINE'S ORIGINAL; `result.ok === true` with one `fields` entry; **neither argument is mutated** | `tests/domain/dmLayer.test.js` |
| A2 | Dormant/absent | `reapplyLayer(regenerated, undefined)` and `reapplyLayer(regenerated, EMPTY_DM_LAYER)` | the regenerated record is returned REFERENTIALLY unchanged (`===`); `reapplied` and `dropped` are both `[]` | `tests/domain/dmLayer.test.js` |
| A3 | Counterforce | `applyEdit` with (a) an undeclared field, (b) a target id absent from the record, (c) an op `validateOp` refuses | each returns `ok: false` with the exact reason of §6; `record` and `layer` come back `===` the inputs; nothing throws | `tests/domain/dmLayer.test.js` |
| A4 | Boundary/sparse | a layer holding a field for an entity the reroll REMOVED, mixed with two that survived | the two survivors are in `reapplied`, the casualty is in `dropped`, the entity is NOT re-created, and both lists are ASCII-ascending | `tests/domain/dmLayer.test.js` |
| A5 | Idempotency | `applyEdit` twice on the same field with different values; then `reapplyLayer` twice | the record holds the SECOND value; `layer.entities[id][field]` still holds the ENGINE'S ORIGINAL (not the first DM value); the second `reapplyLayer` is byte-identical to the first (`JSON.stringify` equality) | `tests/domain/dmLayer.test.js` |
| A6 | Lifecycle | a real generated settlement → `applyEdit` → `JSON.parse(JSON.stringify(...))` → `reapplyLayer` on a fresh generation from the same seed | the round trip is byte-exact and the re-applied fields survive; `mintDmId` reproduces the same id for the same `(seed, kind, n)` across the hop | `tests/property/dmLayerGoldenIsolation.test.js` |
| A7 | ⛔ THE ISOLATION PROPERTY — see §0Z.5 for its FINAL (pinned) form, which supersedes this row's wording | (a) `generateSettlementPipeline` with an EMPTY layer; (b) the same seed+config with a ONE-ROOT layer | (a) equals `tests/fixtures/generator-golden-master.json` **byte-for-byte** across the corpus, and `tests/fixtures/dossier-prose-manifest-golden.json` is unmoved; (b) differs from (a) ONLY in that root and the derivations downstream of it — **every untouched root is IDENTICAL**, which is the executable statement that the overridden chooser still consumed its draw. **ANTI-VACUITY:** (b) must differ from (a) somewhere, or the layer was never consulted | `tests/property/dmLayerGoldenIsolation.test.js` |
| A8 | Privacy/regression | `mintDmId` over the invalid-input matrix (non-string seed, unknown kind, negative / fractional / non-safe `n`) and the valid matrix | every invalid input throws `TypeError` and returns nothing; every valid input returns `dm:<kind>:<16 lowercase hex>`; the same triple yields the same id twice, and three distinct triples yield three distinct ids | `tests/domain/dmLayer.test.js` |

This table is the entire edge-case budget — **8 of 8**. Omit nothing; add nothing.

## §10 · Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/dmLayer.js src/domain/regenerationDelta.js src/store/settlementSlice.js \
  tests/domain/dmLayer.test.js tests/property/dmLayerGoldenIsolation.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Focused tests — ONE test directory per gated run, the slot held for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/dmLayer.test.js tests/domain/regenerationDelta.test.js

# The named golden/dormancy proof
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/dmLayerGoldenIsolation.test.js tests/property/generatorGoldenMaster.test.js \
  tests/property/dossierProseManifest.test.js

# The moved instruments
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/sizeBaseline.test.js

# The store consumer
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/lifecycleRoundTrip.test.js

# Registers that must NOT move
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B2
npm run implementation:resume -- EM-B2
```

Every command exits `0`. A lane never runs `npm run check`; it pauses at a held gate per
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL. Report actual counts; never copy a historical count.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- **the §0 fork is unsigned** — this packet is BLOCKED and is not dispatchable;
- either golden fixture's SHA-256 moves by one byte;
- `src/store/settlementSlice.js` grows by one effective line, measured by eslint's `Linter`;
- a second writer of DM field ownership appears necessary beyond the fork the chair signed;
- any of `deriveRegenerationDelta`'s eleven existing keys changes name, order or value;
- a persisted key would be written by this packet, or any EM-B3 path would need editing;
- `scripts/check-observed-shape-readers.mjs` reports a NEW finding identity, or an
  `EXPLAINED_WRITER_EXEMPTIONS` row appears necessary (it is EM-B3's and the chair's);
- `scripts/check-writer-reach.mjs` would need `--write`, `--genesis` or `--rebank`;
- the lighting census moves by anything other than the predicted `+2 files / +0 parked /
  +2 credited`;
- `mintDmId` would need a PRNG, a clock, a locale or any non-`dm:` namespace;
- the acceptance matrix would grow past eight cases.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, `skipBlankLines` + `skipComments`, before and after, for `settlementSlice.js` and `regenerationDelta.js`):
- Acceptance cases A1–A8, executed and passed:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations (`typecheck:ratchet`, `typecheck:domain:strict`):
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after:
- Lighting census tuple before and after, attributed PER FILE by execution:
- Generated artifacts: `NONE | tests/lint/.lighting-census-baseline.json`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
