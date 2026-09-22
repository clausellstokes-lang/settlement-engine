# Settlement editor / EM-B2a4 — THE ORCHESTRATION AND THE STORE SEAT: `pinsFrom(record)` reads the chooser roster from its producer, `rederive(record, config, layer, engine)` merges the DM's overrides into the pin bag and REPORTS every override the candidate set refuses, and the golden-isolation property proves an empty layer never reaches the runner

- **Status:** `READY`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line and takes `status`
  only when exactly one row matches. Every stamp, caveat and date goes on these continuation
  lines, never on the row.
  ⛔ **READ §0 BEFORE PROMOTING.** This member carries ONE MEASURED CONTRADICTION it does not
  adjudicate: the clause it inherits as acceptance case A7 (a) — *"a pinned re-derive of a record
  reproduces that record byte-for-byte"* — is refuted by the chair's own executed measurement in
  the owner-ratified design (§21.5 item 5, §22 item 1, §22.1). A7 is compiled to what IS provable
  at this base and the refuted clause is quoted in §0 with its receipt.
  ⭐ MEMBER 4 OF 4 of the superseded **EM-B2a**, per the chair's ESTATE-REPAIR ruling of
  2026-09-20: **EM-B2a1** (the leaf) → **EM-B2a2** (the pin primitive) ∥ **EM-B2a3** (the two
  remaining chooser steps) → **EM-B2a4** (this) → **EM-B2b**. The four-member partition, with
  every parent item assigned to exactly one member, is `EM-B2a.partition.md`.
- **Packet version:** 4
  > **What version 4 changed and why (judgment 176, the chair, on this lane's THIRD STOP — taken
  > after the seal and before any byte).** Version 3 cured the pin channel; version 4 cures the
  > three gaps that channel then exposed. THREE MEASUREMENTS, all executed in plain `node` at the
  > placement tip.
  > (1) **THE ROOT KEY HAS NO RECORD PATH AND `rederive` HAD NO SET TO MAP IT WITH.**
  > `editSlice.js :: rootKeyFor` mints `` `${cardType}:${entityId}:${field}` ``, and version 3's
  > `rederive(record, config, layer, engine)` carried no declaration set. The one route §7 left
  > open — importing `fieldDeclarations.js` into `dmLayer.js` — would have made it the THIRD
  > importer of a roster pinned EXACT and both-directions at
  > `editDeclarations.test.js :: DORMANCY` (two sanctioned edges), and §7 carries no row on that
  > file: judgment 148's law, a STOP. ⇒ **THE SET IS INJECTED, NEVER IMPORTED**: arity FIVE,
  > `rederive(record, config, layer, engine, declarations)`, `pinsFrom(record, layer, declarations,
  > engine)`, injected by `editSlice.js :: applyPlainEditToDraft`, which ALREADY holds the set as
  > `DECLARATION_CONSULT` and is ALREADY one of the roster's two sanctioned importers. The rosters
  > stay EXACT at two, `dmLayer.js` and the new leaf import no leaf, and no TEST row on
  > `editDeclarations.test.js` is owed — which also keeps this member path-disjoint from EM-D0e
  > v1.2, the member that holds that path on this train.
  > (2) **NO WRITE-TIME DOOR CHECKS POOL MEMBERSHIP, MEASURED.** Driving the real writer with an
  > off-pool value on the `pool` field `npc.role` (`outputKey` `npcs[].role`): `ok=true`, the
  > value written to the record AND recorded in the layer, against a live control that an in-pool
  > value is accepted; the door's closed refusal set holds no pool member, and
  > `editSlice.js :: applyPlainEditToDraft` says of itself that it *"resolves no pool"*.
  > ⇒ `not_in_pool` LEAVES `rederive` (judgment 176(2)): pool membership is a WRITE-TIME check at
  > the single writer's door, so a value outside its pool never enters the layer and `rederive`
  > re-validates nothing. The refusal, its arm and its case are removed and the count line follows
  > (EIGHT cases to SEVEN). ⛔ The missing refusal is RAISED in §13, not deferred.
  > (3) **A LEAF OVERRIDE DOES NOT FIT A COLLECTION PIN.** The runner's choosers are COLLECTION
  > keys (`npcs`, `institutions`, `powerStructure`, …) and every root `outputKey` is a LEAF path
  > (`npcs[].role`, `powerStructure.governingName`). ⇒ `pinsFrom` resolves each root key's
  > `outputKey` to `(collectionKey, leafPath)`, deep-clones the record's collection, applies the
  > DM's value at the leaf INSIDE the clone and pins the collection — §6's transition sentence
  > *"the DM's value at that key and the record's value everywhere else"* is the law and §8 step
  > 3(d)'s `pins[recordPath] = value` was the wrong sentence. EXECUTED end to end: one edited leaf,
  > the WHOLE roster pinned (3 of 3), the record itself untouched, the override taking in the
  > re-derivation, every other roster entry keeping the record's values, and the no-layer run
  > byte-identical.
  > (4) Everything else of version 3 stands: the entry's forwarding, `getStepMeta` from
  > `src/generators/pipeline.js :: getStepMeta`, the ceiling figure 1396015, the sixth amendment's
  > stamp, and judgment 175's two ratified lane calls (`tests/generators` in `checks`; the
  > caller-side partial-pin law, which now applies PER COLLECTION).
  > **What version 3 changed and why (judgment 173, the chair, 2026-09-22, on this lane's STOP
  > before its seal).** Version 2's whole pin path was INERT and its A7(b) unprovable, because the
  > function §6 binds as `engine.run` does not carry the bag. TWO MEASUREMENTS, both executed at
  > the placement tip by the build lane in plain `node`, are what this version answers.
  > (1) **THE ENTRY DROPS THE BAG.** `generateSettlementPipeline.js :: generateSettlementPipeline`
  > holds the ONE production call of `runPipeline` in the estate and forwards `{ onStep: options.onStep }`
  > ALONE. With an OVERRIDDEN record-built bag on a real consulting chooser (`npcs`, EM-B2a2's
  > landed `chooseOrPin`), `sha(no pins) === sha(the overridden bag)` reads **true** through
  > `engine.run` and the override never lands; the SAME bag handed straight to `runPipeline` takes
  > it (`ctx.npcs[0].name` moves, the assembled settlement's sha moves). ⇒ §7 gains a MODIFY row on
  > the entry that forwards `pins` beside `onStep`, and A7(b)'s anti-vacuity arm becomes REAL.
  > (2) **`pipe.getStepMeta` IS `undefined`.** The entry's namespace exports exactly
  > `carryLockedRosterThroughGenerate, generateSettlementPipeline, refreshRosterProse,
  > regenHistoryPipeline, regenNPCsPipeline` and re-exports nothing (`export {` / `export *` both
  > exit 1), so version 2's one-module import could not give `pinsFrom` the roster its own contract
  > demands. ⇒ the CREATE row names `src/generators/pipeline.js :: getStepMeta` as a SECOND dynamic
  > import.
  > ⭐ **AND §2 IN-SCOPE ITEM 3(b) MOVED OUT** — judgment 155b's own split line, taken because the
  > entry is a third logic-bearing modified file. The `regenSection` delegation and its
  > `src/store/settlementSlice.js` MODIFY are **EM-B2a5's**, which the chair charters as a slot;
  > nothing is dropped and nothing is deferred. §3 therefore still reads **3 of 3** logic-bearing
  > (`dmLayer.js` · `editSlice.js` · the entry) and **2 of 3** registration-only.
  > ⚠ **A THIRD MEASUREMENT, found only once the bag reached the runner, and it binds `pinsFrom`:**
  > the bag is keyed by RECORD PATH and two steps may share a key, so pinning a key on one step's
  > behalf makes a step that shares it PARTIAL — executed, the runner threw
  > `Pipeline pins: step "resolveStress" has choosers [stress, stressTypes] but pins supply only [stress]`.
  > §6 now spells the exact rule: a key is pinnable only if EVERY step that provides it can be
  > wholly pinned from this record. With it, A7(b) holds 5 of 5 sampled corpus rows.
  > ⛔ **THE ENTRY IS A WORKER CLOSURE MEMBER AND THE ONE LINE IS PRICED**, not assumed free — see
  > §7's byte note. Everything version 2 measured that this version does not touch stands.
  > **What version 2 changed and why.** Version 1 was compiled 2026-09-20/21 against three
  > siblings AS PACKETS. All three have since LANDED as real code on train EM-T12
  > (`16f0bc71c`), and judgment 134's law makes a sibling's LANDED fence the only one a
  > member may measure, so every fact this member took on prediction was re-measured. FIVE
  > facts moved. (1) **EM-B2a2 landed `chooseOrPin` at a NEW HOME** — `src/generators/pipeline.js:152`,
  > EXPORTED — so version 1's `requiredSymbols` row naming
  > `src/generators/steps/generatePopulation.js` returns `count=0` and is REFUTED; the row is
  > re-pointed. (2) **EM-C4a landed `REDERIVE_SEAM` and named this member its owner**
  > (`src/store/editSlice.js:89`), consulted by the `set-root` path ALONE (`:339`, its derived
  > use `:347`) and NOT by `applyCascadeEdit`; under **judgment 145** this member adds the
  > cascade branch's consult in the same §7 MODIFY row that plugs re-derivation in, so
  > `src/store/editSlice.js` and `tests/store/editSlice.test.js` are §7 rows this member did
  > not carry. (3) **A LANDED WALKER CONVICTS THE NEW LEAF** —
  > `tests/lint/densityCreateBoundary.walker.test.js` reds any `src/` module that spells the
  > bare symbol `generateSettlementPipeline` and is not classified in `PIPELINE_REACHERS`
  > (`src/domain/density/densityCreateBoundary.js:157`); version 1 named neither, and the
  > class the manifest's own message prescribes for this member — **DERIVED**, *"re-derives an
  > existing world"* — exists and holds ZERO rows today. (4) **EM-B2a1 landed its five
  > exports**, so the §5 "DECLARED, not yet present" table is DISCHARGED into
  > `requiredSymbols`, each row re-measured VERBATIM at the tip (judgment 151: a contract's
  > spelling is not the code's). (5) **`applyEdit` is arity THREE**
  > (`src/domain/edit/dmLayer.js:164`, judgment 77), which re-writes §5's interface row and
  > A6's round trip. Three absolutes are also restated as deltas: the eager closure (269 →
  > 270 live), the mutation manifest's `invariants` (716 → 723) and the wiring census's
  > `producerIndexFiles` (1172 → 1181).
- **Verified base:** `em-t13-b2a4-2026-09-22` at `e1750d7454c1dff7e81342efadd05e47719ca6aa`
  ⚠ Left for the chair's promotion stamp. **The revalidation sentence the chair will use:**
  *"Re-measured at `16f0bc71cff32445164079542c0f38b2acb498c7` (train EM-T12's FLIPPED tip; read
  tip `read-tip-em-t11`, detached, `git status --short` EMPTY before and after): the CREATE
  targets `src/store/settlementRederiveAction.js` and
  `tests/property/dmLayerGoldenIsolation.test.js` ABSENT (executed); the MODIFY targets
  `src/domain/edit/dmLayer.js` (82 effective), `src/store/settlementSlice.js` (816 effective
  against a frozen `.size-baseline.json` entry of 816) and `src/store/editSlice.js` (116
  effective) all present and clean; the REGISTER target
  `src/domain/density/densityCreateBoundary.js` present with `PIPELINE_REACHERS` holding SIX
  rows and no `DERIVED` row; all THIRTY `requiredSymbols` present VERBATIM at the paths
  and lines in §5, each `count=1`; `retiredSymbols` empty; the preamble measured
  `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c` (the FIFTH amendment, the
  law standing at this tip) — this packet is WRITTEN TO THE SIXTH amendment
  (`drafts/amendment-6/EM-PREAMBLE.amended.md`, judgment 144), which lands as the FIRST commit
  of train EM-T13's branch, and its preamble row is RE-STAMPED to the sixth's measured hash at
  placement."*
  ⛔ A `__BASE__` packet can NEVER pass `validate:packets`; validation is downstream of this
  stamp, never a precondition of it.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** ⭐ **EVERY DEPENDENCY HAS LANDED**, re-measured as REAL CODE at `16f0bc71c`
  (judgment 134's law — a sibling's LANDED fence, never its predicted one):
  **EM-B2a1** LANDED (`src/domain/edit/dmLayer.js` exists; six exports, `EMPTY_DM_LAYER` `:55`,
  `DM_ID_NS` `:63`, `APPLY_EDIT_REASONS` `:71`, `layerRead` `:125`, `applyEdit` `:164` AT ARITY
  THREE, `mintDmId` `:230`);
  **EM-B2a2** LANDED (`export function chooseOrPin(pins, key, draw)` at
  `src/generators/pipeline.js:152` — the primitive's ONE exported home, MOVED off
  `steps/generatePopulation.js`, which now IMPORTS it at `:18`);
  **EM-B2a3** LANDED (`assembleInstitutions.js:236-238` and `generatePower.js:74,:84` consult
  the pin seam for every key they provide, through an `UNPINNED` sentinel);
  **EM-C4a** LANDED (`src/store/editSlice.js`, 350 lines, carrying the `REDERIVE_SEAM` this
  member plugs — judgment 145);
  **EM-P0** LANDED (`const _PINS_KEY = '__pins'` at `src/generators/pipeline.js:59`,
  `export function runPipeline(initialContext, rng, options = {})` at `:182`,
  `export function getStepMeta()` at `:270`).
  ⛔ **EM-P1 IS WITHDRAWN** (design §22.4 ruling 1) and is NOT named as a dependency.
  ⇒ §8 step 0's two "refuse to start until …" gates and §11's first STOP are therefore
  DISCHARGED HISTORY at this base, kept for the record and re-read at the seal.
- **Collision group:** **`src/domain/edit/dmLayer.js`** — EM-B2a1 CREATEs it and **EM-B2b**
  MODIFIES it, so the three cannot ride one train (the validator's duplicate rule keys on the
  PATH, not the action; ⛔ TOOL-27 does not cure a CREATE and a MODIFY of one SOURCE file).
  ⭐ **`scripts/mutation-coverage-manifest.json`** — the collision version 1 stated but could not
  resolve is now RESOLVED BY A LANDING: **TOOL-27 HAS LANDED**
  (`scripts/implementation-packets.mjs:67-70`,
  `export const ROW_KEYED_REGISTERS = Object.freeze(['scripts/mutation-coverage-manifest.json'])`,
  with the reservation keyed `${row.path}\0${rowKey}` at `:953` and the duplicate message
  `duplicate register row key across packets` at `:958`). This member's `rowKey` is
  `invariants['tests/property/dmLayerGoldenIsolation.test.js']`; train EM-T13's only other
  holder of that path, **EM-B1b**, carries
  `invariants['tests/lint/opGuardCoverage.walker.test.js']` (executed over the kit's capsules).
  The two differ, so the two may ride ONE train.
  ⭐ **`src/store/editSlice.js` and `tests/store/editSlice.test.js`** are **EM-C4a's LANDED
  territory**, not a sibling's CREATE: this member MODIFIES them under judgment 145 and names
  in §7 the landed arms it widens. Measured against train EM-T13's other two members, there is
  NO intersection: **EM-D0e v1.1** holds `src/components/edit/CardEditorDialog.jsx` ·
  `src/copy/en.js` · `tests/components/primitives/editorHalo.test.jsx` ·
  `tests/components/cardEditorDialog.test.jsx`; **EM-B1b v5/v6** holds
  `src/domain/edit/operationsOffStage.js` · `src/domain/edit/operations.js` ·
  `tests/domain/editOperations.test.js` · `tests/lint/opGuardCoverage.walker.test.js` ·
  `scripts/mutation-coverage-manifest.json` (row-keyed, above). ⛔ Neither touches
  `src/domain/edit/dmLayer.js`, `src/store/**` or `src/domain/density/**`.
  **`src/store/settlementSlice.js`**, **`src/store/settlementRederiveAction.js`** and
  **`src/domain/density/densityCreateBoundary.js`** collide with NOTHING in `packets-waiting/`
  (executed).
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured at the read tip with the ONE effective-line instrument (§P9:
  eslint's own `Linter` under `max-lines`, `skipBlankLines` + `skipComments`; never `wc -l`) —
  `src/store/settlementSlice.js` is **816** against a frozen `scripts/.size-baseline.json` entry
  of **816** (ZERO headroom, re-measured at this tip and UNMOVED in the J-T1 window);
  `src/store/editSlice.js` is **116**; `src/domain/edit/dmLayer.js` is **82**;
  `src/store/settlementSliceHelpers.js` is **246**. EAGER MEMBERSHIP, read by IMPORTING the
  exported set from the tree's own `vite.config.js` (never a replica, never a `dist` read):
  `src/store/settlementSlice.js` IS a member and `src/store/settlementSliceHelpers.js` IS;
  `src/domain/edit/dmLayer.js` is NOT, `src/store/editSlice.js` is NOT,
  `src/store/settlementGenerateAction.js` is NOT and `src/generators/generateSettlementPipeline.js`
  is NOT. ⛔ The set's SIZE is a chair-stamped absolute and is NOT quoted as this packet's own
  figure: it read **270** at `16f0bc71c` (version 1 read 269 at `bdbf7c89c`), and this member's
  prediction is the MEMBERSHIP DELTA **+0**. No `scripts/.size-baseline.json` row exists for any
  `src/store/` path but the slice itself, so this member's new leaf mints none and the 800-line
  layer ceiling governs it. Every register figure this packet predicts is a DELTA; the live
  absolutes are the chair's to stamp.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256:
  `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d`)
  > ⭐ **THE SIXTH AMENDMENT IS LANDED AND THIS HASH IS MEASURED AT THE PLACEMENT TIP**, not quoted
  > from a brief (§P10.3): `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` in the lane
  > worktree at `4a1a6bf79`. The placement tool did not write this row (judgment 172); version 3
  > carries it.
  > **The law measured at this base is the FIFTH amendment**, SHA-256
  > `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c`, measured at the read tip
  > with `shasum -a 256` (§P10.3's law: the hash is MEASURED, never quoted from a brief).
  > ⭐ **THIS PACKET IS WRITTEN TO THE SIXTH AMENDMENT** (`drafts/amendment-6/EM-PREAMBLE.amended.md`,
  > selected as judgment 144), which lands as the FIRST commit of train EM-T13's branch before
  > this member is placed; §P2.19–21, §P6, §P7 and §P9 are obeyed here and their measurements are
  > §7 rows. The preamble row is RE-STAMPED to the sixth's own measured hash at placement.
  > The fifth amendment's interim compile rules (`COMPILE-RULES.interim.md`) are now LANDED law
  > and are cited as the preamble, not as interim text.
- **Evidence:** every VERIFIED row below is receipted in `EM-B2a4.evidence.md` by command and output.

---

## §0 · ⛔⛔ THREE MEASUREMENTS THAT CHANGE THIS MEMBER'S SHAPE — none adjudicated by the lane

### §0.1 · THE LAYER BOUNDARY — the partition's §2 home for `regenerateWithLayer` is UNBUILDABLE

The partition's §2.2 table homes `pinsFrom`, `rederive` **and** `regenerateWithLayer` in
`src/domain/edit/dmLayer.js`, with `regenerateWithLayer` reaching *"the REAL entry
`generateSettlementPipeline`"* under `src/generators/**`. This is the one case the launch brief
names where a member does NOT compile to the table.

`tests/build/domainGeneratorsBoundary.test.js` is a **shrink-only architecture ratchet**. Read
whole at the read tip, its three arms are: `it('introduces NO new domain→generators edge beyond
the frozen baseline')`, which walks every `.js` under `src/domain/` and pushes
`NEW importer: <file> -> <specs>` for any file `BASELINE_EDGES` does not list; `it('the baseline
contains no STALE entries …')`, which forbids a dead row and therefore forbids widening; and
`it('baseline is exactly the 6 known edges (cardinality guard)')`. `BASELINE_EDGES` is
`Object.freeze` over **four files and five specifiers**, and its own failure message prescribes
the cure: *"If the new coupling is unavoidable, invert it (move the shared leaf down a layer or DI
the generator fn) rather than widening the baseline."* The walker matches **dynamic
`import('…/generators/…')` as well as static `from '…/generators/…'`**, by its own stated design,
so a "lazy" import does not dodge it.

**MEASURED, so nothing above is assumed.** `git grep -n -E "from ['\"][^'\"]*/generators/" --
src/domain` returns exactly the five frozen specifiers across the four frozen files; the dynamic
form returns nothing (exit 1). No `src/domain/**` module imports `generateSettlementPipeline` at
all — every mention under that root is prose inside a comment or a certification string. The three
real importers are `src/lib/instantWorld/composeInstantWorld.js` (static, and then **DI'd**:
`:226  engine = { generateSettlementPipeline },` with `:184  settlement = engine.generateSettlementPipeline(`),
`src/components/surveyor/ConstructionPanel.jsx:96` (`await import`) and
`src/store/campaignContentBindingSession.js:78` (`await import`) — all three OUTSIDE the ratchet.

⇒ **THE SMALLEST LAWFUL HOME, compiled to instead.** `pinsFrom` and `rederive` **stay in
`src/domain/edit/dmLayer.js`**, because neither needs to *name* the engine: `pinsFrom` reads the
record, and `rederive` takes the engine as an **injected parameter** — the inversion the walker
prescribes and the shape `composeInstantWorld.js` already ships. `regenerateWithLayer` **leaves
`dmLayer.js`** for **the store's lazy application-command seam**, which design §2.3 names as the
one path ops travel (*"Ops apply only through the existing store writers via the lazy application-
command boundary the Surveyor already uses; there is no second path"*), and which is already this
member's own MODIFY path. **a1's five exports are untouched.**

⚠ And the store's own two eager files cannot host it either: `src/store/settlementSlice.js` (816 /
816, zero headroom) and `src/store/settlementSliceHelpers.js` — the delegation target the parent's
§7 named as the net-zero cure — are **both members of `EAGER_FIRST_PAINT_MODULES`** (executed), so
lines added to either RAISE the owner-signed eager closure. Hence the new lazy leaf
`src/store/settlementRederiveAction.js`, reached only by `await import(…)`, on the measured
precedent of `src/store/settlementGenerateAction.js` (the generation lane's own lazy leaf, NOT in
the eager set) and on the measured fact that `computeEagerModuleGraph` in `vite.config.js` walks
**static edges only** (its specifier regex body is `[^'"()]*?`, which a dynamic `import(` cannot
match).

### §0.1a · ⛔⛔ A LANDED WALKER CLASSIFIES EVERY MODULE THAT NAMES THE ENGINE — the new leaf owes a `PIPELINE_REACHERS` row, and `dmLayer.js` must NOT name the engine in CODE

`tests/lint/densityCreateBoundary.walker.test.js` is THE CREATE-BOUNDARY WALKER (ODQ §822). Its
live arm `it('every module that reaches the pipeline is classified')` computes the reacher set as
EVERY `src/**/*.{js,jsx}` whose text, **comment- and string-stripped**, matches
`/\bgenerateSettlementPipeline\b/`, and asserts that every one is a key of
`PIPELINE_REACHERS` — a frozen table at `src/domain/density/densityCreateBoundary.js:157`. Its own
failure message prescribes the vocabulary: *"decide whether each is a BIRTH (mints a new world's
law), **DERIVED (re-derives an existing world)** or PREVIEW (throwaway), and say why. An
unclassified caller is exactly how a world gets silently re-born under a law it was not created
with."* `BOUNDARY_CLASSES` (`:128`) is `['BIRTH', 'DERIVED', 'PREVIEW', 'EXECUTOR']`.

**MEASURED, so nothing above is assumed.** Importing the module at the read tip,
`PIPELINE_REACHERS` holds **SIX** rows — `src/store/settlementGenerateAction.js` (BIRTH) ·
`src/workers/generationRequest.js` (EXECUTOR) · `src/lib/instantWorld/composeInstantWorld.js`
(BIRTH) · `src/components/surveyor/ConstructionPanel.jsx` (PREVIEW) ·
`src/workers/customContentPreview.worker.js` (PREVIEW) ·
`src/store/campaignContentBindingSession.js` (PREVIEW) — and **`DERIVED` holds ZERO**. ⭐ And the
measured reason `src/store/settlementSlice.js` is NOT a reacher today, although it dynamically
imports the engine module at `:45`, is that its `loadEngine()` destructures ONLY
`pipe.regenNPCsPipeline` and `pipe.regenHistoryPipeline`: the specifier itself is a STRING and the
walker strips strings.

⇒ **TWO CONSEQUENCES, both compiled to here.**
1. **The new leaf `src/store/settlementRederiveAction.js` WILL name the engine in code** — that is
   its whole job (§2 in-scope 2) — so it joins the reacher set the day it lands and, unclassified,
   reds that arm BY CONSTRUCTION. It therefore carries **ONE new row** in `PIPELINE_REACHERS`,
   `class: 'DERIVED'`, the first of that class, with its `why` and its
   `payloadAwaitedBy: ['src/store/settlementRederiveAction.js']` (the walker holds each named
   module to the tree: a row whose module stopped awaiting the loader is a stale red).
2. ⛔ **`src/domain/edit/dmLayer.js` MUST NOT SPELL `generateSettlementPipeline` IN CODE.** §0.1
   kept `rederive` in the domain leaf on the ground that it *"needs never to name the engine"* —
   true of `BASELINE_EDGES`, which matches import SPECIFIERS, and FALSE of this walker, which
   matches the bare SYMBOL. So the injected engine handle's run member is named NEUTRALLY:
   `engine.run(config, importedNeighbour, options)`, bound at the store leaf by
   `run: pipe.generateSettlementPipeline`. A JSDoc `@param` naming the real symbol is safe (the
   walker blanks comments), but the CALL is not, and the contract in §6 spells the neutral name.
   ⇒ **`src/domain/edit/dmLayer.js` stays OUT of the reacher set: DELTA +0. The new leaf is +1.**

### §0.2 · ⛔ A PINNED RE-DERIVE DOES NOT REPRODUCE THE RECORD — the inherited A7 (a) is refuted

The parent's §0Z.5, which the partition assigns to this member as **A7**, reads: *"(a)
`rederive(record, config, {})` on a golden-generated record equals that record **byte-for-byte** —
pins with no overrides change nothing."* **That clause is false at this base, and the chair
measured it.** From the owner-ratified `docs/DESIGN_EDIT_MODE_AND_DECREES.md`, later sections of
the same document that carries §14:

| section | the measurement, verbatim |
|---|---|
| **§21.5 item 5** | *"pins built from the RECORD — the only thing the editor ever has — reproduce it 2/9 … RULED: EM-B2a's premise (`rederive(record, ...)` by pinning from the record through EM-P0's mode) is REFUTED AS DESIGNED and EM-B2a is BLOCKED pending the re-derivation seam's architecture (ARCH-REDERIVE)."* |
| **§22 item 1** | *"No pin at a STEP BOUNDARY reproduces a record. Record-built pins reproduce the settlement in 6 of 63 rows — and early, late, cloned, restored-after-every-step and corruption-undone placements ALL score exactly 6/63."* Ruling 1: *"'Pinned at a step boundary' is withdrawn as the model; 'final at every writer' replaces it."* |
| **§22.1** | *"hold the final roster at EVERY writer and a no-edit re-derivation reproduces 6/63 … hold it only at its LAST writer and the record reproduces 60/63 … RULED: none of the three. THE CONSEQUENCE OF AN EDIT IS THE DIFFERENCE BETWEEN TWO RE-DERIVATIONS."* |
| **§22.2** | *"With one added clause the merge IS the identity with no edit: 63/63."* ⇒ the no-edit identity is a property of **THE MERGE**, never of `rederive` alone. |

**EM-P0's landed seam is a step-boundary pin** — CONFIRMED by reading `runPipeline`:
`const ctx = pins === null ? { ...initialContext } : { ...initialContext, ...pins, [_PINS_KEY]: pins };`.
So the chair's Q1 ruling ("the mechanism is the LANDED PIN CONSULT") and §22 ruling 1 ("pinned at a
step boundary is withdrawn as the model") are the two texts that meet here.

**Two further receipts, both from the estate's own documents.** `EM-R0c.md` (THE MERGE, version 4,
CONDITIONALLY READY-able, in `packets-waiting/`) declares *"`R0` — `rederive(base)`; `R1` —
`rederive(record)`. Both are ARGUMENTS"* and lists among its non-goals *"The re-derivation itself
(EM-R1–EM-R5)."* The charter says the same twice: *"EM-B2a is RE-CUT, not merely blocked:
`rederive` is 'held facts are final' (design §22), and it is preceded by the re-entry family EM-R"*,
and the train table's *"the EM-R family | EM-R0…R6 … then EM-B2a."*

**RE-MEASURED AT `16f0bc71c`, AND THE SEAM THIS MEMBER MEETS FIRST IS NAMED.** EM-B2a3's landed
§12 records two observations from its own build, *"as of `04ac6520e`, both EM-R3's seam"*:
(i) `generationCoherenceReceipt` reproduces **34/63** — the row EM-R1's writer census re-takes as
its own baseline; and (ii) *"through the member's own consults, `generatePower`'s record-built pin
reproduces **62/63**, not 63/63"*, because `generatePower.js`'s trace loop runs BELOW the consults
and reads `powerStructure?.factions`, which `neighbourFactions` and `powerEconomyReconcilePass`
move after the step — *"SLOT: EM-R3's replay / **EM-B2a4's `rederive` meets this figure first**."*
⇒ This member ASSERTS NEITHER FIGURE. Both are EM-R3's seam, both are recorded here as the shape
of what `rederive` will see, and A7's refuted byte-identity clause stays unasserted; §11 carries
the STOP that keeps it so.

`git grep -n -E "\b(rederive|pinsFrom|regenerateWithLayer|reapplyLayer)\b"
-- src tests scripts` still returns NOTHING (exit 1) at `16f0bc71c`, and nothing of the EM-R family has landed
(`recordInvariants`, a consistency-group register and a record-key class register are all absent;
`src/domain/edit/recordRegister.js` is the SAVE-KEY register EM-B2a1 names as its boundary, not the
merge's path register).

**WHAT THIS PACKET DOES ABOUT IT, and the one thing it leaves to the chair.** A7 is compiled to the
two clauses that ARE provable at this base and by construction — (a) **fresh generation with no
pins is the golden**, which holds because an empty layer never reaches `runPipeline` and
`options.pins` absent *"⇒ today's behaviour EXACTLY"*; and (b) a one-root layer moves that root,
with the anti-vacuity arm. The refuted clause is NOT asserted anywhere in this packet. ⛔ **The
chair rules whether (i) this member owns `rederive` and simply waits for EM-R1–R5's seam to make it
faithful, or (ii) `rederive` belongs to EM-R1–R5 and this member's scope shrinks to `pinsFrom`, the
store seat, the pool-membership rule and the property.** That is a charter-sequence ruling, not a
measurement, and the lane does not make it. ⇒ **QUESTION Q1.**

---

## §1 · Reconciled authority

0. ⭐⭐ **THE CHAIR'S RULINGS THAT ARRIVED AFTER VERSION 1 WAS COMPILED, each measured here:**
   **judgment 77** — `applyEdit` is ARITY THREE and its consult is INJECTED, never imported
   (measured: `export function applyEdit(layer, op, declarations) {` at
   `src/domain/edit/dmLayer.js:164`, and the leaf's own header `:15` says so); this REVISES the
   partition ruling's Q3 below, whose two-argument spelling could not reach two of its three
   ruled refusals. **Judgment 145** — *"the packet that plugs re-derivation in adds the cascade
   branch's consult in the same §7 MODIFY row of `src/store/editSlice.js`; its pre-proof measures
   the seam's consult sites (one today, two ruled)"*; MEASURED: `REDERIVE_SEAM` is declared at
   `editSlice.js:89` and consulted at `:339` ALONE, inside `applyPlainEditToDraft` step 8, with
   its derived use at `:347` — `applyCascadeEdit` (`:221`-`:255`) does NOT consult it. ⇒ **ONE
   consult site today; TWO ruled.** **Judgment 148's LAW** — a member's pre-proof greps `tests`
   for every LEAF it imports and carries each dormancy / importer-roster arm as a TEST row
   (executed; §7's note records the result). **Judgment 151** — a `_pendingRequiredSymbols` row
   is RE-MEASURED VERBATIM at its discharge, never promoted as written.
1. ⭐ **THE CHAIR'S RULING ON THE EM-B2a PARTITION, 2026-09-20** (`findings/COMPILE-EM-B2a1-2026-09-20/CHAIR-RULING.md`)
   — Q1: *"THE MECHANISM IS THE LANDED PIN CONSULT"*; Q2: `EMPTY_DM_LAYER` is FOUR keys
   `{ roots, worldFacts, minted, phantoms }`; Q3: `applyEdit(layer, op)` returns a typed envelope
   with a CLOSED reason set of THREE — ⛔ **Q3's ARITY IS REVISED BY JUDGMENT 77** (row 0); the
   closed reason set of three stands and is measured LANDED
   (`export const APPLY_EDIT_REASONS = Object.freeze(['invalid_op', 'undeclared_field', 'unknown_target']);`
   at `dmLayer.js:71`); Q4: **no member carries the observed-shape REGISTER row**.
   ⭐ Its consequence for this member, verbatim: *"an override outside the chooser's candidate set
   is NOT APPLIED AND IS REPORTED — never silently ignored, never deleted from the layer."*
2. **`COMPILE-RULES.interim.md`** (the chair, 2026-09-20), which governs where it and the preamble
   disagree — see the header row.
3. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md`** — §14 *"Edit at the source, never at the derivation"*
   (the root list; `dmLayer` records `roots` and `worldFacts`; fresh generation with no pins is the
   golden and cannot move; *"Canon stays events"*), §2.3 *"the lazy application-command boundary the
   Surveyor already uses; there is no second path"*, §2.4 (the `dm:` identity namespace), §6
   instrument 7 (golden isolation). ⛔ **§21.5.3 AMENDS §14** — *"an editable root is a fact the
   record HOLDS … `origin: drawn | computed` … is never the test of editability"* — and **§21.5.5,
   §22 and §22.1–§22.4 amend the ENGINE**; §0.2 above holds this member's re-measurement of them.
4. **THE PROMISE** (constitutional): a seed is a STARTING world forever; the pencil never rewrites
   what the chronicle recorded.
5. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1 (the module map) and §8 instrument 7.
6. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, wave 1, row **EM-B2** (as split).
7. `docs/implementation/PACKET_STANDARD.md` and `docs/implementation/preambles/EM-PREAMBLE.md`.
8. **Live git state at the verified base — which outranks all of the above on what exists.**

**Resolved contradictions** (each settled by measurement, with the losing text named):

- **The partition's §2.2 home for `regenerateWithLayer`** → **REFUTED by the boundary ratchet**;
  §0.1. The smallest lawful home is compiled to instead and the disagreement is reported.
- **The parent's A7 (a), the byte-identity of a pinned re-derive** → **REFUTED by the chair's own
  executed measurement**; §0.2. Not asserted here.
- **The parent's `reapplyLayer` (the patch-the-record path)** → **RETIRED.** §7's CREATE row named
  it; §6's contract block named `regenerateWithLayer` and did not export it at all. Under §0Z — the
  newest of the parent's sections — `rederive`/`regenerateWithLayer` is the live mechanism, and the
  partition records that *"a4 owns the choice"*. `reapplyLayer` appears nowhere in this packet.
- **The parent's `drawRoot(rng, key, pool, layer)` and its "the draw is always consumed" rule** →
  **RETIRED with §0A** by the chair's Q1 ruling. The landed primitive `chooseOrPin` does NOT advance
  the stream on a pin, which is the opposite rule; this member supplies pins and mints no second
  spelling.
- **`EM-PREAMBLE.md` §P2.1** (*"a new file under `src/domain/**` … moves the sovereignty-lighting
  census"*) → **REFUTED by measurement**: the walker's `files` is `TEST_FILES.length` and
  `TEST_FILES` walks `tests/` ONLY (`:515`). This member's census motion is caused by its ONE new
  TEST file and by nothing else. The correction rides the fifth amendment (the chair's slot I).
- **`EM-PREAMBLE.md` §P2 row 11** (*"a closure of 268 modules"*) → **269 at the read tip**, measured
  by importing the set. The correction rides the fifth amendment (the chair's slot H).
- **The parent's `<cardType>:<entityId>:<field>` key and its EM-P1 block** → **EM-P1 IS WITHDRAWN**
  (design §22.4 ruling 1: *"No NPC id is re-spelled; no faction id is minted"*). This member treats
  the root key as an OPAQUE STRING exactly as EM-B2a1 does, so no spelling of it can stale this
  packet.

The implementer does not read other documents to reinterpret this packet.

## §2 · Outcome

**Observable result:** a DM's layer can be turned into a pin bag and a re-derivation without the
layer ever entering `src/generators/**`, without a single new `src/domain/**` → `src/generators/**`
import edge, and without one byte entering the eager first-paint closure; every override the
chooser's candidate set refuses comes back NAMED rather than vanishing; and the generator golden
master and the dossier prose manifest do not move.

**Definition of done:** `src/domain/edit/dmLayer.js` exports `pinsFrom` and `rederive` at the exact
contracts of §6 and spells `generateSettlementPipeline` NOWHERE in code (§0.1a);
`src/store/settlementRederiveAction.js` exports `regenerateWithLayer`, is the ONLY file this member
ADDS that spells the engine's bare symbol, and carries the one new `DERIVED` row in
`PIPELINE_REACHERS` (⛔ the entry already spelled that symbol at the base, so this member's edit to
it moves the walker's reacher set by NOTHING); `editSlice.js` consults the seam on BOTH branches and
its landed A8 arms are re-pinned to the plugged seam; ⭐ the entry FORWARDS the pin bag, so an
overridden bag through `engine.run` moves the record and A7(b) bites; ⛔ `regenSection` is NOT wired
here — the leaf lands DORMANT and EM-B2a5 takes the delegation (judgment 173(b)); the
eight acceptance cases of §9 pass; both goldens are byte-identical; `EAGER_FIRST_PAINT_MODULES`
gains no member, `BASELINE_EDGES` gains no entry, and `EDIT_SLICE_IMPORTS` gains no specifier.

**In scope**

1. the orchestration added to EM-B2a1's leaf (`pinsFrom`, `rederive`);
2. one new lazy leaf at the store's application-command seam (`regenerateWithLayer`);
3. **TWO required integrations, one ruled and one measured** — (a) ⭐ **EM-C4a's
   `REDERIVE_SEAM` PLUGGED, and the cascade branch's consult ADDED** in the same §7 MODIFY row
   of `src/store/editSlice.js` (judgment 145: one consult site today, two ruled); (b) ⭐ **the
   ENTRY FORWARDS THE PIN BAG** — one option beside `onStep` in
   `generateSettlementPipeline.js :: generateSettlementPipeline`, without which every pin this
   member builds is dropped before the runner (judgment 173(a));
   ⛔ **the `regenSection` delegation IS NOT IN THIS PACKET** — version 2's item 3(b) is
   **EM-B2a5's** under judgment 155b's split line, chartered as a slot by the chair;
4. ⭐ **one registration the landed CREATE-boundary walker compels** — the `DERIVED` row for the
   new leaf in `PIPELINE_REACHERS` (§0.1a);
5. one prevention guard — `tests/property/dmLayerGoldenIsolation.test.js`, ARCH §8 instrument 7,
   carrying the first-paint membership probe and the layer-boundary arm.

**Explicit non-goals**

- ⛔ **the leaf's five primitives** (`EMPTY_DM_LAYER`, `DM_ID_NS`, `APPLY_EDIT_REASONS`,
  `layerRead`, `applyEdit`) — **EM-B2a1's**; this member consumes them and re-mints none;
- ⛔ **the pin primitive's export move and the chooser steps** — **EM-B2a2's and EM-B2a3's**, and
  no path of theirs is named here;
- ⛔ **`worldFacts`' reader, `config′` and the twelfth delta key `dmFields`** — **EM-B2b's**;
- ⛔ **THE MERGE** (`R0`/`R1`, consistency groups, `recordInvariants`, the escalation, the chain)
  and **the every-writer re-derivation seam** — **the EM-R family's** (EM-R0a/b/c/d, R1–R5, R6, R7);
- ⛔ **the persisted key, the denylists, `publicSafe` / `worldSnapshotPublic` and the observed-shape
  exemption row** — **EM-B3's and the chair's** (Q4: no member carries the REGISTER row);
- ⛔ **the field declarations** — **EM-A1's**; this member consumes a declaration through an
  injected set and authors none;
- ⛔ any change to `src/domain/userEdits.js`, `regenerationPreservation.js`, `historyPreservation.js`
  or `canonStatus.js` — §0's fork was decided to **EM-B4**;
- ⛔ any component, route, `data-testid`, accessible name, feature flag or tier gate;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | **0** (this member persists nothing) | ≤1 |
| Named state writers | 1 (`rederive`, and it writes a RECORD it returns to its caller) | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 (headless — no component, no route, no test id, no accessible name) | ≤1 |
| Direct consumers | **0** (the leaf lands DORMANT; `regenSection` reaches it in **EM-B2a5**, judgment 173(b)) | ≤2 |
| New logic-bearing production leaves | **1** (`src/store/settlementRederiveAction.js`) | ≤2 |
| Existing logic-bearing production files modified | **3** (`src/domain/edit/dmLayer.js`, ⭐ `src/store/editSlice.js` — judgment 145, ⭐ `src/generators/generateSettlementPipeline.js` — judgment 173(a)) | ≤3 |
| Additional registration-only files | **2** (`scripts/mutation-coverage-manifest.json`; ⭐ `src/domain/density/densityCreateBoundary.js` — ONE frozen `PIPELINE_REACHERS` row and its `why`, data only, §0.1a) | ≤3 |
| Handwritten files total | **7** (the 3 logic-bearing + the 2 registration-only above + the 2 CREATEs; the two `TEST` rows re-pin landed arms and add no file) | ≤12 |
| New/changed effective production lines | ≤250 | ≤400 |
| Effective lines per new leaf | ≤120 | ≤250 |
| Delta in a shared/baselined file | **0** — ⛔ `settlementSlice.js` is NO LONGER A §7 PATH (its row is EM-B2a5's); no §7 path carries a `scripts/.size-baseline.json` row (measured) | ≤15 |
| Acceptance cases | **8** | ≤8 |

Overrides approved before dispatch: **NONE — and none is needed.** ⛔ No budget is raised or
invented here. ⚠ **ONE CLASSIFICATION IS THE CHAIR'S, and the packet states it rather than
assuming it** (⇒ **QUESTION Q2**): `src/domain/density/densityCreateBoundary.js` is counted above
as **registration-only**, because this member's whole edit to it is ONE frozen literal row of a
declaration table plus its `why` string — the same shape as a `mutation-coverage-manifest.json`
row, and the file's own header calls the table *"the manifest"* whose *"`why` rows are the human
backstop"*. If the chair rules it LOGIC-BEARING instead, the row "existing logic-bearing
production files modified" reads **4 of 3** and the packet is OVER; **the proposed split line is
then §2 in-scope item 3(b)** — the `regenSection` delegation and its `src/store/settlementSlice.js`
MODIFY leave for a successor (EM-B2b or EM-R), because 3(a) is the seat judgment 145 RULED to this
member and 3(b) is the seat version 1 chose for itself. ⛔ The lane does not take that decision.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B2a4
```

Expected, dry-read against the dispatch checks at the read tip:

| dispatch check | verdict once the chair stamps the base |
|---|---|
| branch name / ancestry | ⚠ the sealed dispatch wants the worktree ON the verified branch; one build lane holds the integration branch in its worktree while the chair's is detached at the tip |
| substrate unchanged since the verified base | **PASSES** for the two store paths and the four register/test paths; ⛔ **`src/domain/edit/dmLayer.js` has no substrate until EM-B2a1 LANDS**, and this member refuses with `path does not exist for MODIFY` before then — which is the order, enforced |
| CREATE targets ABSENT | **PASSES** — `src/store/settlementRederiveAction.js` and `tests/property/dmLayerGoldenIsolation.test.js` are both absent (measured: `git grep -l -F 'dmLayerGoldenIsolation' -- tests` returns nothing, exit 1) |
| MODIFY targets clean | `src/store/settlementSlice.js` is real and frozen at 816/816; `src/domain/edit/dmLayer.js` is member 1's |
| every `requiredSymbols` row resolving | **PASSES** — all **thirty** found VERBATIM at `16f0bc71c`, each `count=1`, executed row by row over the capsule (§5; version 1 carried seventeen, of which one — `chooseOrPin` at its old path — is REFUTED and re-pointed, and thirteen are added: the six EM-B2a1 exports discharged, the seam and the refusal set on `editSlice.js`, the two `densityCreateBoundary.js` exports, the two `editMutationPath` pins and the dead-op ratchet's premise arm) |
| git-clean / foreign dirt fingerprinted without target overlap | the two store paths and the property test collide with no sibling's targets; `scripts/mutation-coverage-manifest.json` collides with FOUR (header) |

⭐ This member is **DRAFT, not BLOCKED**: every gate the parent carried is either decided (the §0
fork → EM-B4; §0A.1 → EM-P2; §0A.2 → EM-P1, since WITHDRAWN) or refuted by a landing (§0Z.1 →
EM-P0). §0.2's contradiction is not a block on the packet's own contracts — it removes one clause
from one acceptance case and raises a sequencing question the chair answers once.

## §5 · Verified tree contract

Every row re-found BY SYMBOL at the read tip, `count=1` each; no line number below is a coding
instruction.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The regeneration path | `src/store/settlementSlice.js` | `regenSection: async (section) => {` (`:456`) | the ONE store action that re-runs generation on an existing settlement; returns early on `get().phase === 'canon'`; exactly two branches, `'npcs'` → `eng.regenNPCsPipeline` + `foldRegeneratedRoster`, `'history'` → `eng.regenHistoryPipeline` | ⛔ **EM-B2a5's SEAT, NOT THIS MEMBER'S** (judgment 173(b)). Named here so the successor is not re-derived, and PRESERVED untouched: this packet's leaf lands DORMANT. No second regeneration path |
| ⭐⭐ The lazy engine seam | `src/store/settlementSlice.js` | `_enginePromise = import('../generators/generateSettlementPipeline.js').then((pipe) => {` (`:45`) | `loadEngine()` memoizes a DYNAMIC import, which is exactly why the pipeline is NOT in `EAGER_FIRST_PAINT_MODULES` | This member reaches the engine by the same idiom, through its own lazy leaf. ⛔ NEVER a static edge |
| Save writer | `src/store/settlementSlice.js` | `updateSavedSettlement: (id, partial) => {` (`:637`) | refuses any key outside the closed patch list, returning a typed `makeActionResult` envelope | PRESERVE, untouched. This member writes no save row |
| Patch key set | `src/store/settlementSliceHelpers.js` | `export const SAVED_SETTLEMENT_PATCH_KEYS` (`:318`) | a frozen 17-key list whose first member is `'settlement'` | `dmLayer` rides INSIDE the settlement blob; this list is NOT widened |
| Pipeline (the real entry) | `src/generators/generateSettlementPipeline.js` | `export function generateSettlementPipeline` (`:77`) | the function the golden hashes | Called through an INJECTED handle from the store's lazy seam, never named from `src/domain/**`. ⛔ Its OPENING is what `requiredSymbols` quotes, because §7's row re-values a line inside the body |
| ⭐⭐ THE DROPPED BAG (judgment 173(a)) | `src/generators/generateSettlementPipeline.js` | `generateSettlementPipeline.js :: generateSettlementPipeline` — the ONE production call of `runPipeline` | MEASURED at the base: the call forwards `{ onStep: options.onStep }` ALONE, so `options.pins` is dropped. `sha(no pins) === sha(an OVERRIDDEN record-built bag)` is **true** through this function; the same bag at `runPipeline` takes the override. Every other `runPipeline` caller in the estate is a TEST | ⭐ **THE §7 ROW.** One option added beside `onStep`. Nothing else in the file moves |
| ⭐ The roster's real home | `src/generators/pipeline.js` | `export function getStepMeta()` (`:270`) | ⛔ **NOT re-exported by the entry**: that namespace is exactly `carryLockedRosterThroughGenerate, generateSettlementPipeline, refreshRosterProse, regenHistoryPipeline, regenNPCsPipeline`, and `pipe.getStepMeta` reads `undefined` (executed) | ⭐ The new leaf imports it from `src/generators/pipeline.js :: getStepMeta` by a SECOND dynamic import (judgment 173(c)) |
| The runner | `src/generators/pipeline.js` | `export function runPipeline(initialContext, rng, options = {})` (`:182`) | `options.pins` ABSENT or `{}` ⇒ "today's behaviour EXACTLY"; EVERY step still runs; a partial pin set THROWS `Pipeline pins: step "<name>" has choosers [...] but pins supply only [...]` | Unchanged. "Pins absent = the golden" is what makes A7 (a) true by construction |
| ⭐ The chooser roster's producer | `src/generators/pipeline.js` | `export function getStepMeta()` (`:270`) | returns every registered step with `provides: step.provides \|\| []` | `pinsFrom` IMPORTS its roster from here. ⛔ Never a re-typed list |
| ⭐⭐ The landed pin primitive, AT ITS NEW HOME | `src/generators/pipeline.js` | `export function chooseOrPin(pins, key, draw)` (`:152`) | returns `pins[key]` when own-present, else `draw()`; ⛔ **does NOT advance the stream on a pin**. ⛔ **VERSION 1'S ROW IS REFUTED**: at `src/generators/steps/generatePopulation.js` the verbatim text `function chooseOrPin(pins, key, draw)` now counts **0** — EM-B2a2 MOVED the primitive to the runner and that step IMPORTS it (`generatePopulation.js:18`), as do `assembleInstitutions.js:11` and `generatePower.js:15` | PRESERVE. No second spelling. This member supplies pins to `runPipeline` and never calls the primitive |
| ⛔⛔ The architecture boundary | `tests/build/domainGeneratorsBoundary.test.js` | `const BASELINE_EDGES = Object.freeze({` (`:70`) | four files / five specifiers, frozen, shrink-only; a NEW `src/domain/**` importer of `src/generators/**` is convicted by name, static or dynamic | §0.1's ground. `rederive` takes the engine as a parameter; `regenerateWithLayer` lives in the store |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` (`:796`) | `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, { seed, customContent: {} })))` over a committed 525-row fixture | UNCHANGED. ⛔ `UPDATE_GOLDEN=1` is FORBIDDEN to this packet |
| Prose golden | `tests/property/dossierProseManifest.test.js` | `const MANIFEST_REL` (`:83`) | `'tests/fixtures/dossier-prose-manifest-golden.json'` | UNCHANGED |
| The census correction | `tests/lint/sovereigntyLightingContract.walker.test.js` | `const TEST_FILES = walk(join(ROOT, 'tests'))` (`:515`) | `files` is `TEST_FILES.length` and `TEST_FILES` walks `tests/` ONLY | The ground of §7's lighting delta: only the ONE new TEST file moves it |
| The mutation denominator | `tests/lint/mutationCoverage.shared.mjs` | `export const ENFORCER_DIRS` (`:36`) | eight dirs; `enumerateInvariants`'s SECOND clause admits any basename matching `NAME_PATTERN` elsewhere under `tests/`; `NAME_PATTERN.test('dmLayerGoldenIsolation.test.js')` is **true** (`golden`) | The executable reason this member DOES owe a manifest row |
| ⛔ The record-class boundary | `src/domain/edit/recordRegister.js` | `export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);` (`:59`) | held EQUAL IN BOTH DIRECTIONS by `tests/lint/recordRegisterTotality.walker.test.js` against records from the REAL pipeline | PRESERVE. `rederive` returns a record to its caller and writes no `dmLayer` key; EM-B3 owes the removal |
| ⛔ Rival re-apply (npcs) | `src/domain/regenerationPreservation.js` | `export function mergePreservedNpcs` (`:237`) | re-seats `_authored` NPCs into a fresh roster under `regenerationMode`'s rules — at the EXACT seat this member takes | PRESERVE, untouched. §0's fork went to EM-B4 |
| ⛔ Rival re-apply (history) | `src/domain/historyPreservation.js` | `export function restoreAuthoredHistory` (`:186`) | re-applies authored settlement-root `history.*` prose after a history reroll | PRESERVE, untouched |
| ⛔ The owner-signed ceiling | `vite.config.js` | `EAGER_FIRST_PAINT_MODULES` (`:338`) | exported from `vite.config.js` "so a first-paint contract can be asserted against THIS derivation rather than a replica of it"; `computeEagerModuleGraph` walks STATIC edges only. ⛔ The set's SIZE is the chair's stamped absolute, NOT this packet's figure (it read 270 at `16f0bc71c`); this member's claim is the MEMBERSHIP delta **+0** | A8's probe IMPORTS it. ⛔ Any rise is a STOP for the OWNER |
| ⛔⛔ The CREATE boundary (§0.1a) | `src/domain/density/densityCreateBoundary.js` | `export const PIPELINE_REACHERS = Object.freeze({` (`:157`) | SIX rows at the tip, `DERIVED` holding ZERO; `export const BOUNDARY_CLASSES = Object.freeze(['BIRTH', 'DERIVED', 'PREVIEW', 'EXECUTOR']);` (`:128`); `tests/lint/densityCreateBoundary.walker.test.js` computes its reacher set by the comment- and string-stripped bare symbol `generateSettlementPipeline` and reds every unclassified one | ⭐ **This member adds the FIRST `DERIVED` row**, for its new leaf, with `why` and `payloadAwaitedBy` |
| ⭐⭐ The re-derivation seam (judgment 145) | `src/store/editSlice.js` | `export const REDERIVE_SEAM = Object.freeze({ kind: 'noop', owner: 'EM-B2a4', calls: 0 });` (`:89`) | EM-C4a's typed no-op, naming THIS member its owner; consulted ONCE, at `:339` inside `applyPlainEditToDraft` step 8 (`const seamIsNoop = REDERIVE_SEAM.kind === 'noop' && REDERIVE_SEAM.calls === 0;`), with its derived use at `:347` (`keys: seamIsNoop ? applied.keys : []`); ⛔ `applyCascadeEdit` (`:221`) does NOT consult it | ⭐ PLUGGED here, and the cascade branch's consult ADDED: **one site today, two after this member** |
| ⛔ The store leaf's frozen import list | `tests/lint/editMutationPath.walker.test.js` | `const EDIT_SLICE_IMPORTS = Object.freeze([` (`:76`) | an EXACT ARRAY equality at `:212` over `editSlice.js`'s STATIC named-import specifiers; measured live as exactly `['../domain/campaign/canon.js', '../domain/edit/dmLayer.js', '../domain/edit/fieldDeclarations.js', '../domain/edit/operations.js']` | ⛔ PRESERVE EXACTLY. The seam plug is a **DYNAMIC** `await import('./settlementRederiveAction.js')`, which carries no `from` clause and is invisible to `staticNamedEdges` BY CONSTRUCTION — a static import here would red this arm |
| ⛔ The one-mutation-path watch list | `tests/lint/editMutationPath.walker.test.js` | `'src/domain/edit/dmLayer.js': Object.freeze(['applyEdit']),` (`:51`) | ONLY `applyEdit` is watched on this producer, and only STATIC named imports are edges | EXECUTED over the walker's own predicate with this member's leaf planted: offenders `[]` before and `[]` after — a static `import { rederive } from '../domain/edit/dmLayer.js';` is NOT convicted |
| ⭐⭐ THE INJECTION SITE (judgment 176(1)) | `src/store/editSlice.js` | `editSlice.js :: applyPlainEditToDraft`, whose `DECLARATION_CONSULT` is `Object.freeze({ isEditableCard, declarationsFor })` | this file ALREADY imports `fieldDeclarations.js` and is ONE OF THE TWO sanctioned edges `tests/domain/editDeclarations.test.js :: DORMANCY` pins EXACT and both-directions (the other is `src/domain/edit/operations.js`); its own message: *"an UNLISTED importer … invalidates the +0 B price this packet declared"* | ⭐ THE SET IS HANDED IN FROM HERE and imported nowhere else. ⛔ A `dmLayer.js` import would be the THIRD edge and a STOP (judgment 148) |
| ⛔ THE WRITE-TIME POOL DOOR, MEASURED ABSENT (judgment 176(2)) | `src/store/editSlice.js` | `editSlice.js :: applyPlainEditToDraft` — its own header: *"It draws no random number, reads no clock and resolves no pool"* | EXECUTED against a live control: an off-pool value on the `pool` field `npc.role` returns `ok=true`, is written to the record AND recorded in the layer; `PLAIN_EDIT_REFUSALS` holds no pool member | ⛔ NOT THIS MEMBER'S TO CURE. `rederive` trusts the layer; the missing refusal is §13 RAISED |
| ⭐ The record path a root key maps to | `src/domain/edit/fieldDeclarations.js` | `outputKey` (17 declared rows) | the declaration's `outputKey` is the RECORD PATH (`'npcs[].name'`, `'powerStructure.governingName'`, `'config.terrainType'`); ⛔ it is NOT the field name — FOUR of the seventeen disagree (`powerSeat.holder` → `powerStructure.governingName`; `worldFact.terrain` → `config.terrainType`; `worldFact.stressors` → `config.stressTypes`; `worldFact.resources` → `config.nearbyResources`), which is pass 1D's NOTE the chair slotted to this pre-proof | ⛔ `rederive` maps a root key to its record path through **`outputKey`**, never through the key's own third segment. EM-C4a's landed `set` writes by `coords.field` and is correct for its ONE reachable card (`ROOT_COLLECTIONS = { npc: 'npcs' }`, all four npc fields agreeing); the generalization is EM-C4b's, not this member's |

⭐⭐ **DISCHARGED — version 1's "DECLARED, not yet present" table is now REAL CODE** (judgment
151: each row is RE-MEASURED VERBATIM at the tip, never promoted as written; every one is now a
`requiredSymbols` row of the capsule, `count=1` each):

| symbol, as the CODE spells it | home | line | this member's use |
|---|---|---:|---|
| `export const EMPTY_DM_LAYER = Object.freeze({` | `src/domain/edit/dmLayer.js` | `:55` | the absence rules; A2 |
| `export const DM_ID_NS = 'dm:';` | `src/domain/edit/dmLayer.js` | `:63` | A6's namespace assertion |
| `export const APPLY_EDIT_REASONS = Object.freeze(['invalid_op', 'undeclared_field', 'unknown_target']);` | `src/domain/edit/dmLayer.js` | `:71` | the leaf's closed reason set, DISJOINT from this member's own |
| `export function layerRead(layer, key) {` | `src/domain/edit/dmLayer.js` | `:125` | `rederive` reads each override through it |
| ⭐ `export function applyEdit(layer, op, declarations) {` | `src/domain/edit/dmLayer.js` | `:164` | **ARITY THREE** (judgment 77) — A6's round trip builds its layer with it and MUST inject a declaration consult; version 1's two-argument spelling is retired |
| `export function mintDmId(seed, kind, n) {` | `src/domain/edit/dmLayer.js` | `:230` | A6 asserts the id survives the JSON hop |
| `export function chooseOrPin(pins, key, draw) {` | `src/generators/pipeline.js` | `:152` | ⛔ NOT imported here — this member supplies pins to `runPipeline` and never calls the primitive |

⛔ **`retiredSymbols`: EMPTY.** Post-edit validation simulated row by row (the shared brief's step
10): this member ADDS exports to `dmLayer.js` and moves, renames or deletes none, so every row
above still reads `count=1` after the member's own edits; the same holds for the seam constant,
whose TEXT this member re-values but whose `export const REDERIVE_SEAM = Object.freeze({` opening
is preserved — ⚠ and for that reason the seam's `requiredSymbols` row quotes the OPENING ALONE,
never the whole frozen literal, which this member's own edit moves.

**Test precedents** (shape copied, by path and name): `tests/property/beliefMapGolden.test.js` ›
`describe('belief-map golden (WAVE A, deterministic)')` › `it('is deterministic across two runs
(byte-identical projection)')` (`:159`) beside `it('anti-vacuity: the belief maps are non-empty and
the two modes differ')` (`:163`) — a byte-identity arm BESIDE an explicit anti-vacuity arm;
`tests/store/lifecycleRoundTrip.test.js` › `test('the persist hop (JSON round-trip) then re-ensure
survives byte-exact')` (`:763`) — the estate's fixpoint idiom, copied for A6;
`tests/build/vendorPdfLazy.test.js` › `it('the eager graph this arm reads is non-empty and contains
the entry (anti-vacuity)')` (`:1270`) — the idiom A8's arm (3) copies.

**Forbidden alternatives**

- ⛔ **no `src/domain/**` → `src/generators/**` import edge, static or dynamic** — the engine is a
  parameter, never a specifier, inside `src/domain/edit/**`;
- ⛔ **no static import of `src/domain/edit/dmLayer.js`, of the new leaf, or of the pipeline from
  any module already in `EAGER_FIRST_PAINT_MODULES`** — a static edge is a first-paint rise and
  that ceiling is the OWNER's;
- no second regeneration path, no second identity namespace, no second PRNG stream, no second
  settlement writer, no second record of DM field ownership;
- no new top-level `worldState` key; no persisted key written by this packet; no widening of
  `SAVED_SETTLEMENT_PATCH_KEYS`;
- no direct edits to `src/store/persistProjection.js`, `src/domain/display/publicSafe.js`,
  `src/domain/display/worldSnapshotPublic.js`, any denylist mirror, or
  `scripts/check-observed-shape-readers.mjs` — **every one is EM-B3's**;
- no edits to `src/domain/userEdits.js`, `regenerationPreservation.js`, `historyPreservation.js`,
  `canonStatus.js`, `recordRegister.js`, `pipeline.js` or any step file;
- ⛔ **no `UPDATE_GOLDEN=1`, no `scripts/.size-baseline.json` raise, no `BASELINE_EDGES` widening,
  no lighting refreeze**;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
// ── src/domain/edit/dmLayer.js — ADDED by this member (a1's five exports untouched) ──

/**
 * THE CHOOSER ROSTER, READ FROM ITS PRODUCER.
 * @param {object} record        a generated or saved settlement record
 * @param {{ getStepMeta: () => Array<{name:string, provides:string[]}> }} engine
 *   ⛔ INJECTED, and it carries NO run member: `pinsFrom` reads the roster and nothing else. `src/domain/**` may not import `src/generators/**` (§0.1), so the roster arrives
 *   as a handle. The roster is NEVER a literal in this module: `contractTestAntiVacuity` Rule 2
 *   convicts a hardcoded exhaustive claim, and a roster that drifts by one key turns the runner's
 *   partial-pin refusal into a runtime throw.
 * @returns {{ pins: Record<string, unknown>, missing: Array<{ step: string, keys: string[] }> }}
 *   `pins` holds a pin for every key a step PROVIDES that the record carries — and, per step,
 *   EITHER every one of its `provides` OR none of them, because `runPipeline` throws on a partial
 *   set. ⭐⭐ THE EXACT RULE, and a per-step read is NOT it (judgment 173, measured the moment the
 *   bag first reached the runner): the bag is keyed by RECORD PATH and TWO STEPS MAY SHARE A KEY,
 *   so a key pinned on one step's behalf makes a step that shares it PARTIAL. ⇒ **a key is
 *   pinnable only if EVERY step that provides it can be wholly pinned from this record**; every
 *   other key is omitted and its steps are named in `missing`. Executed without this rule, the
 *   runner threw `Pipeline pins: step "resolveStress" has choosers [stress, stressTypes] but pins
 *   supply only [stress]`; with it, A7(b) holds on 5 of 5 sampled corpus rows.
 *   A step the record can only half-supply is NOT pinned at all and is named in `missing`
 *   ⭐⭐ AND A LEAF OVERRIDE PINS ITS WHOLE COLLECTION (judgment 176(3)). The runner's choosers
 *   are COLLECTION keys (`npcs`, `institutions`, `powerStructure`, …) and every root `outputKey`
 *   is a LEAF path (`npcs[].role`, `powerStructure.governingName`), so a pin of the leaf's VALUE
 *   at the collection's key would hand the runner a role string where it expects a roster.
 *   ⇒ for each own root key of `layer.roots`, ASCII-ascending: resolve `cardType:entityId:field`
 *   through the INJECTED set to its declaration's `outputKey` (⛔ never the key's own third
 *   segment, §11), split that into `(collectionKey, leafPath)`, DEEP-CLONE the record's
 *   collection, apply the DM's value at the leaf INSIDE THE CLONE (an array collection is located
 *   by `entityId`), and pin the CLONE. §6's transition sentence is the law: the bag carries the
 *   DM's value at that key and THE RECORD'S VALUE EVERYWHERE ELSE, and the record itself is never
 *   touched. A declaration with NO `outputKey` is an ANNOTATION by EM-A1's own contract, and a
 *   `collectionKey` no registered step provides (`config.terrainType` → `config`) is not
 *   pinnable: both are reported `unknown_key`, never guessed at.
 *   with the keys it lacks. Deterministic: `pins`' keys are ASCII-ascending.
 */
export function pinsFrom(record, layer, declarations, engine);
// ⭐ ARITY FOUR (judgment 176(1)). `declarations` is the INJECTED set — the same shape judgment
// 77/81 gives `applyEdit`: `{ declarationsFor }`, handed in as DATA by the store. ⛔ THE LEAF
// IMPORTS IT NEVER: `editDeclarations.test.js :: DORMANCY` pins `fieldDeclarations.js`'s importer
// roster EXACT and both-directions at two sanctioned edges, and a third would red it.
// ⛔ FAIL CLOSED, on EM-B2a1's own law: an absent or unusable set resolves NO declaration, so every
// root key is reported `unknown_key` and nothing is applied. An unusable set can only close the door.

/** The closed refusal set for an override the chooser's candidate set will not take.
 *  EXPORTED so a test asserts it both directions rather than re-typing it. */
export const REDERIVE_UNAPPLIED_REASONS;  // exactly ['step_not_pinnable', 'unknown_key']
// ⛔ TWO, not three (judgment 176(2)): `not_in_pool` is NOT this member's. Pool membership is a
// WRITE-TIME check at the single writer's door, so a value outside its pool never enters the
// layer; `rederive` trusts the layer's recorded values and re-validates nothing. ⚠ MEASURED: no
// door performs that check TODAY (§13 RAISED), and the refusal is the adapter's next member's.

/**
 * ONE RE-DERIVATION. Pure with respect to its arguments.
 * @param {object} record
 * @param {object} config   the generation config (`config′` — a world-fact change is EM-B2b's)
 * @param {unknown} layer   read through EM-B2a1's absence rules; `undefined`, `null`, a non-object
 *                          and `EMPTY_DM_LAYER` all behave identically
 * @param {{ run: Function, getStepMeta: Function }} engine  ⛔ INJECTED. ⛔⛔ THE RUN MEMBER IS
 *   NAMED `run`, NEVER `generateSettlementPipeline`: `tests/lint/densityCreateBoundary.walker.test.js`
 *   computes its reacher set from the comment- and string-stripped BARE SYMBOL, so a call spelled
 *   `engine.generateSettlementPipeline(...)` inside this domain leaf would make `dmLayer.js` an
 *   unclassified pipeline reacher and red that walker (§0.1a). The store leaf binds
 *   `run: pipe.generateSettlementPipeline` and is the ONE file that spells it.
 * @returns {{ record: object, unapplied: Array<{ key: string, value: unknown,
 *             reason: (typeof REDERIVE_UNAPPLIED_REASONS)[number] }> }}
 *
 * ⭐ THE POOL-MEMBERSHIP RULE, as the chair ruled it: an override outside the chooser's candidate
 *   set is NOT APPLIED AND IS REPORTED. It is returned in `unapplied`; the RETURNED RECORD carries
 *   the engine's own value at that key; and the LAYER IS NOT MUTATED and still holds the override,
 *   because a later world-fact change may make the value a member again. ⛔ Nothing is silently
 *   ignored and nothing is deleted from the layer — a silent drop is the estate's most-bitten class.
 * ⛔ PINS ARE DEEP-CLONED ON ENTRY (`structuredClone`), always: design §22.1 measured an aliased
 *   pin bag writing through into the caller's own record in 36 of 63 rows and a cloned one in 0.
 * ⛔ AN EMPTY OR ABSENT LAYER NEVER REACHES THE RUNNER as `{}` — `options.pins` is passed ONLY when
 *   the pin bag is non-empty, so fresh generation with no pins is bit-for-bit today's behaviour.
 * ⛔ `unapplied` is ASCII-ascending on `key` and deduplicated. `rederive` THROWS NEVER for a
 *   malformed layer; it throws only what the engine throws.
 */
export function rederive(record, config, layer, engine, declarations);
// ⭐ ARITY FIVE (judgment 176(1)), the set injected by `editSlice.js :: applyPlainEditToDraft`
// through `settlementRederiveAction.js :: regenerateWithLayer`. ⛔ `dmLayer.js` imports no leaf.

// ── src/store/settlementRederiveAction.js — the NEW LAZY LEAF ──

/**
 * THE ONE SEAT THAT NAMES THE ENGINE. Reached ONLY by `await import(...)` from `regenSection`, on
 * the memoized idiom `loadEngine()` and `loadGenerateLane()` already use, so neither this leaf nor
 * `dmLayer.js` nor the pipeline enters `EAGER_FIRST_PAINT_MODULES` (its derivation walks STATIC
 * edges only — measured).
 * ⛔ THE ONE FILE OF THIS MEMBER THAT SPELLS `generateSettlementPipeline` IN CODE, and therefore
 * the ONE that carries a `PIPELINE_REACHERS` row — `class: 'DERIVED'`, the first of that class
 * (§0.1a). It binds the neutral handle the domain leaf takes:
 * `const [pipe, runner] = await Promise.all([`
 * `  import('../generators/generateSettlementPipeline.js'), import('../generators/pipeline.js'),`
 * `]);`
 * `const engine = { run: pipe.generateSettlementPipeline, getStepMeta: runner.getStepMeta };`
 * ⛔ TWO modules, both DYNAMIC (judgment 173(c)): the entry re-exports nothing, so
 * `pipe.getStepMeta` is `undefined` and the roster must come from its own producer.
 * @returns {Promise<{ record: object, unapplied: Array<object> }>} `rederive`'s envelope, verbatim.
 */
export async function regenerateWithLayer(seed, config, layer, declarations);
// ⭐ ARITY FOUR (judgment 176(1)): it FORWARDS the injected set and holds none of its own. ⛔ THIS
// LEAF IMPORTS NO DOMAIN LEAF BUT `dmLayer.js`, so `fieldDeclarations.js`'s importer roster
// (`editDeclarations.test.js :: DORMANCY`, EXACT at two) is unmoved by this member.

// ── src/store/editSlice.js — MODIFIED by this member (judgment 145) ──
//
// ⭐ THE SEAM, PLUGGED, ON BOTH BRANCHES. EM-C4a declared
// `REDERIVE_SEAM = Object.freeze({ kind: 'noop', owner: 'EM-B2a4', calls: 0 })` at `:89` and
// consulted it at ONE site (`:339`, `applyPlainEditToDraft` step 8) with its derived use at
// `:347`; `applyCascadeEdit` (`:221`) consults it nowhere. This member:
//   (1) re-values the seam to `Object.freeze({ kind: 'scoped', owner: 'EM-B2a4', calls: 1 })`,
//       keeping the export's OPENING text byte-identical so every `requiredSymbols` row that
//       quotes it still resolves;
//   (2) reaches the re-derivation through `await import('./settlementRederiveAction.js')` at
//       BOTH consult sites - ⛔ a DYNAMIC import and never a static one, because
//       `tests/lint/editMutationPath.walker.test.js:212` pins this file's static specifier list
//       EXACT at four and `vite.config.js`'s eager graph walks static edges only;
//   (3) leaves step 9's receipt expression the one site that learns what else moved, exactly as
//       EM-C4a's own comment at `:341-343` foresaw.
// ⛔ NO computed `get()[name]` dispatch is introduced: `tests/store/deadOperationRatchet.test.js`
// `test('no dispatch-by-computed-name exists (the scanner premise holds)')` (`:229`) convicts one
// by name, and this member's reach is a literal module specifier, not a store-handle lookup.
```

**THE ROOT KEY.** `roots` is keyed by the root key EM-A1 declares and this member, like EM-B2a1,
treats it as an OPAQUE STRING: it is mapped to a RECORD PATH through the injected declaration set
and asserts nothing about its internal shape. ⭐⭐ **THE MAPPING READS `outputKey`, NEVER THE KEY'S
OWN THIRD SEGMENT** (pass 1D's NOTE, slotted here by the chair, measured at the tip): of EM-A1's
seventeen declarations, FOUR have an `outputKey` whose last segment differs from the declared
`field` — `powerSeat.holder` → `powerStructure.governingName`, `worldFact.terrain` →
`config.terrainType`, `worldFact.stressors` → `config.stressTypes`, `worldFact.resources` →
`config.nearbyResources`. All four are unreachable through EM-C4a's landed door today
(`ROOT_COLLECTIONS = { npc: 'npcs' }`, whose four npc fields all agree), which is why its `set`
writing by `coords.field` is correct there and stays untouched here; but `rederive` maps EVERY
declared root, so reading anything but `outputKey` would pin the wrong record path for four of
seventeen the day the second card opens. A declaration with NO `outputKey` is an ANNOTATION by
EM-A1's own contract and is reported `unknown_key`, never guessed at. ⛔ EM-P1 is WITHDRAWN (design §22.4), so no id is
re-spelled and no spelling of the key can stale this packet.

### State schema

This member writes **no persisted key**. `rederive` returns a record and an envelope to its caller;
`regenerateWithLayer` returns the same envelope to `regenSection`. `dmLayer` remains declared
NOT-YET-WRITTEN by `recordRegister.js`, and this member preserves that.

**Absence rules** (EM-B2a1's, consumed unchanged): absent / empty / `null` / an invalid legacy
object all read as `EMPTY_DM_LAYER`; an empty layer is NEVER normalized back to absent; ⛔ never a
throw.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| a record + an absent/empty layer | `rederive` | — | a re-derivation with `options.pins` supplied from the record ONLY; the layer never reaches the runner | `unapplied: []` |
| a record + a one-root layer whose value IS in the chooser's candidate set | `rederive` | the key maps to a pinnable record path and its step's whole `provides` can be pinned | the pin bag carries the DM's value at that key and the record's value everywhere else | `unapplied: []` |
| a record + a layer naming a key no registered chooser provides | `rederive` | — | as above | `unapplied: [{ key, value, reason: 'unknown_key' }]` |
| a record + a layer naming a key whose STEP cannot be wholly pinned from this record | `rederive` | — | that step is not pinned at all (the runner's partial-pin refusal) and is named in `missing` | `unapplied: [{ key, value, reason: 'step_not_pinnable' }]` |
| a draft settlement in the store | `regenSection` → `regenerateWithLayer` | `get().phase !== 'canon'` | the branch's existing write, then the re-derivation | the envelope, carried to the caller |
| a CANONIZED settlement | `regenSection` | `get().phase === 'canon'` | ⛔ early return, unchanged — **canon does not re-derive** (design §14: *"Canon stays events"*) | none |

### Ordering and precedence

- **Pipeline position:** the delegation runs inside `regenSection`, AFTER the `'npcs'` / `'history'`
  branch has written its parts and BEFORE `deriveRegenerationDelta(before, after)` is reached — a
  re-derivation after the delta would make the delta describe a world no reader ever sees.
- **Same-tick visibility:** the re-derived record is visible to the delta in the same action.
- **Merge/replace:** the layer's override REPLACES the record's value IN THE PIN BAG only; the
  record itself is never patched (design §14: *"Edit at the source, never at the derivation"*).
- **Tie-break:** none — one override touches one key.

### Determinism

- **Hash/fork key:** none minted here. `mintDmId` is EM-B2a1's and is only asserted across A6's hop.
- **Stable enumeration:** `pins`' keys and `unapplied` are ASCII-ascending; `unapplied` is
  deduplicated on `key`.
- **Rounding/clamping:** none — no numeric derivation.
- **No-draw behaviour:** with an empty or absent layer and no record pins, `options.pins` is NOT
  passed at all, so `runPipeline` takes its `pins === null` path and the run is byte-identical to
  today's generation.

### Flag and dormancy

- **Flag:** `NONE`. Wave 1 is headless and mints no flag.
- **Golden posture:** **UNCHANGED.** `tests/property/generatorGoldenMaster.test.js` (525 rows) and
  `tests/property/dossierProseManifest.test.js` are byte-identical before and after. The mechanism
  is measured, not asserted: the golden hashes `generateSettlementPipeline` with no `options`, and
  this member passes `pins` only when the bag is non-empty. ⛔ `UPDATE_GOLDEN=1` is FORBIDDEN;
  any motion of either fixture is a STOP, not a re-record.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| nothing created — `rederive` returns a record to its caller | `layerRead` (a1's), own-property only | ⛔ NOT THIS MEMBER — EM-B3 persists the key; `SAVED_SETTLEMENT_PATCH_KEYS` is not widened | ⛔ EM-B3; a1's absence rules make a pre-EM save read correctly the day the key ships | **THIS MEMBER.** `regenSection` delegates to the lazy leaf on a DRAFT; ⛔ it returns early on canon, so a canonized settlement never re-derives | ⛔ the store's own snapshot (design §22.1: *"Undo is the store's snapshot, never an inverse merge"*); EM-C1 owns `withdraw`/`reopen` | ⛔ EM-B3/EM-B4. Design §11: edits do not travel — already half-enforced (`publicSafe.js:294` deletes `clone.dmLayer`, `worldSnapshotPublic.js:92` denies it) | ⛔ EM-B3. This member emits no player-facing projection and no receipt string |

### Receipts and privacy

- **Closed kinds:** `REDERIVE_UNAPPLIED_REASONS` = `['step_not_pinnable', 'unknown_key']`,
  asserted as a both-directions set equality in A3 against the module's own export.
- **Address chain:** the opaque root key, echoed verbatim in `unapplied[].key`.
- **Numeric-to-word bands:** `NONE` — this member renders no figure, so nothing is owed to
  prose-numerics.
- **DM-only fields:** the whole layer. ⛔ Its projection rule is EM-B3's.
- **Player/public projection:** `NONE`.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY` — this member touches no faction/deity alignment surface.
- **Edit story:** this member is the DM edit path's ORCHESTRATION. The DM verb is EM-D2's `Save` in
  the generated modal, reaching EM-B2a1's `applyEdit` through EM-C4's store slice and the one
  generic decree adapter, and reaching THIS member through `regenSection`.

## §7 · Exact change manifest

⭐ **GENERATED FROM `EM-B2a4.manifest.json` AND PROVED SET-EQUAL WITH IT** (interim rule 6 / chair
ruling 8). The proof is quoted in §12 and in `EM-B2a4.evidence.md`.

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/edit/dmLayer.js` | `pinsFrom`, `REDERIVE_UNAPPLIED_REASONS`, `rederive` | +120 eff | Add the two functions and the reason list at §6's exact signatures. ⛔ **Import NOTHING from `src/generators/**`, `src/store/**` or `src/components/**` — static or dynamic**: the engine and the chooser roster arrive as INJECTED handles (§0.1). ⛔ a1's five exports and their call shapes are untouched. ⛔ `structuredClone` the pin bag on entry. Strict-typecheck clean; no PRNG, no clock, no locale. |
| `CREATE` | `src/store/settlementRederiveAction.js` | `regenerateWithLayer` | 120 eff | The ONE seat that names the engine. Memoize **TWO** DYNAMIC imports: `../generators/generateSettlementPipeline.js` exactly as `loadEngine()` does, for the run member; and ⭐ `../generators/pipeline.js` for `src/generators/pipeline.js :: getStepMeta` — **judgment 173(c)**, because the entry RE-EXPORTS NOTHING and `pipe.getStepMeta` reads `undefined` (measured: the entry's namespace is exactly `carryLockedRosterThroughGenerate, generateSettlementPipeline, refreshRosterProse, regenHistoryPipeline, regenNPCsPipeline`; `export {` and `export *` both exit 1), so without it `pinsFrom` cannot read the roster from its producer as its own contract demands. Then import `rederive` from `../domain/edit/dmLayer.js` and hand the engine in. ⭐ **THE SECOND EDGE IS MEASURED SAFE, NOT ASSUMED:** `tests/build/domainGeneratorsBoundary.test.js` walks `src/domain/` ALONE (`collectJsFiles(domainDir)`), so a `src/store/**` → `src/generators/**` edge is OUTSIDE its corpus and `BASELINE_EDGES` gains nothing — and the store already holds such an edge at `settlementSlice.js :: loadEngine`; `tests/lint/editMutationPath.walker.test.js`'s `WATCHED` names only `src/domain/edit/operations.js` and `src/domain/edit/dmLayer.js` (and only `applyEdit` on the latter), and its A5 arm reads `src/store/editSlice.js` alone, so neither arm sees this leaf. ⛔ BOTH generator imports are DYNAMIC. ⛔ Nothing already in `EAGER_FIRST_PAINT_MODULES` may import this file STATICALLY. |
| ⭐ `MODIFY` | `src/generators/generateSettlementPipeline.js` | `generateSettlementPipeline.js :: generateSettlementPipeline` — the ONE production call of `runPipeline` in the estate | **+0 eff** (one option on an existing line) | **JUDGMENT 173(a)'s ROW.** Forward the pin bag beside the step hook: `{ onStep: options.onStep, pins: options.pins }`. ⛔ **NOTHING ELSE IN THIS FILE MOVES** — not a guard, not a return, not the provenance tail, not `regenNPCsPipeline` or `regenHistoryPipeline`. WHY THE ROW EXISTS, MEASURED: at the base the entry forwards `onStep` ALONE, so `sha(no pins) === sha(an OVERRIDDEN record-built bag)` reads **true** through `engine.run` while the SAME bag handed straight to `runPipeline` takes the override — every pin this member builds is dropped before the runner sees it, and A7(b) cannot hold without this line. ⛔ **A WORKER CLOSURE MEMBER**: `src/workers/generationRequest.js` imports this file STATICALLY, so the line is PRICED in worker bytes (the byte note below) and any rise is bought back by the chair at the terminal under rule 33 — ⛔ never a ceiling raise. ⛔ `retiredSymbols` stays EMPTY: this row's `requiredSymbols` quotes the function's OPENING, which the edit does not move. |
| `CREATE` | `tests/property/dmLayerGoldenIsolation.test.js` | A1, A2, A4–A8 | n/a | ⭐ **ADDS SEVEN `it`s UNDER ONE `describe`** — the same seven §9's matrix homes here and the same seven the deferred lighting row prices as `titles +7` (⭐ judgment 176(2) retired A3 with `not_in_pool`; the surviving ids do not move) (§P9(f), the count law; `EM-B2a4.count-prover.mjs` proves the equality). Copy the proof shape of `tests/property/beliefMapGolden.test.js` — a byte-identity arm beside an explicit anti-vacuity arm. Flat literal `it(...)` under ONE literal `describe`; `it`/`test`/`describe` each bound EXACTLY ONCE; ⛔ no bare seed loop (collect, then assert once); every negative assertion carries `// anchored:` or is a both-directions set equality; ⛔ every asserted set IMPORTED from its producer — the chooser roster from `getStepMeta()`, the reason set from `dmLayer.js`, `EAGER_FIRST_PAINT_MODULES` from `vite.config.js`. |
| `TEST` | `tests/build/vendorPdfLazy.test.js` | the literal budget pin (`:1769`) and the first-paint closure membership arms | n/a | Re-assert that the eager closure is unmoved. **The stated bounds, all five:** the THREE OWNER-SIGNED first-paint ceilings pinned as literals at `:565` — `CLOSURE_BUDGET_BYTES = 1_048_000` (raw), `CLOSURE_GZIP_BUDGET_BYTES = 337_000`, `CLOSURE_BROTLI_BUDGET_BYTES = 283_000`, under `describe('ARCH car 2 — the three first-paint budgets stay where the owner signed them')` (*"Raises stay owner-signed"*); the lazy engine's `expect(size).toBeLessThan(679_000)` (`:831`); and ⭐ `WORKER_BUNDLE_CEILING_BYTES = 1396015` at `generationWorkerLazy.test.js :: WORKER_BUNDLE_CEILING_BYTES` (EXACT, zero slack, monotone-down). ⭐ **RE-MEASURED: version 2 read 1401208, which the T12 buy-back LOWERED** (judgment 160, seedrandom's ARC4 core alone in `src/kernel/prng.js`; the ceiling followed the measurement DOWN, never up). ⭐ `:1769`'s pin is NOT `skipIf`'d and cannot skip; `:1020`'s real-closure measurement IS, and belongs to the terminal's build. ⛔ Not a sealed check: the file carries `it.skipIf(!requireDistRead)` dist arms (interim rule 2). |
| ⭐ `MODIFY` | `src/store/editSlice.js` | `REDERIVE_SEAM` (`:89`), the `applyPlainEditToDraft` consult (`:339`) and the `applyCascadeEdit` branch (`:221`-`:255`) | +12 eff | **JUDGMENT 145's ROW, AND JUDGMENT 176(1)'s INJECTION SITE.** ⭐ This file is where the declaration set enters the re-derivation: it ALREADY holds it as `DECLARATION_CONSULT` and is ALREADY one of the two sanctioned importers `editDeclarations.test.js :: DORMANCY` pins, so the thunk that reaches the leaf passes that same frozen record on to `regenerateWithLayer` and NO NEW IMPORT EDGE IS CREATED anywhere. ⛔ Neither `dmLayer.js` nor the new leaf imports `fieldDeclarations.js`, and §7 carries NO row on `tests/domain/editDeclarations.test.js` — which is also what keeps this member path-disjoint from EM-D0e v1.2, the member holding that path on train EM-T13. Plug the seam and ADD THE CASCADE BRANCH'S CONSULT here, in this one row: one consult site today, TWO after this member. ⛔ Re-value the frozen constant but keep `export const REDERIVE_SEAM = Object.freeze({` byte-identical. ⛔ Reach the re-derivation by `await import('./settlementRederiveAction.js')` — a DYNAMIC import ONLY: `tests/lint/editMutationPath.walker.test.js:212` pins the static specifier list EXACT at four, and this file is NOT eager (measured) only while it stays off every eager static edge. ⛔ No computed `get()[name]` dispatch (`deadOperationRatchet.test.js:229`). File measures **116** effective; the 800-line layer ceiling governs. |
| ⭐ `TEST` | `tests/store/editSlice.test.js` | EM-C4a's landed `it('A8 — purity, idempotency, key-order independence, the transient mode and the rederive seam as a typed no-op')` (`:376`) and its three seam assertions | n/a | **THE LANDED ARMS THIS MEMBER MOVES, NAMED:** `:403` `expect(REDERIVE_SEAM).toEqual({ kind: 'noop', owner: 'EM-B2a4', calls: 0 });` → the plugged value; `:407` `expect(REDERIVE_SEAM.kind).toBe('noop');` → `'scoped'`; `:404` `expect(Object.isFrozen(REDERIVE_SEAM)).toBe(true);` STAYS BYTE-UNMOVED. EM-C4a's own comment at `:401-402` says so: *"The day EM-B2a4 plugs scoped re-derivation in, THIS is the arm that fails."* The `it` TITLE's trailing clause is re-worded to the plugged shape. ⛔ **ADDS NO `it` AND NO `describe`** (the file holds 7 `it`s under ONE `describe` at `:134`, before and after) ⇒ census `titles +0 · suiteTitles +0 · files +0` from this row. ⛔ No arm weakened, no assertion deleted. |
| ⭐ `REGISTER` | `src/domain/density/densityCreateBoundary.js` | the `PIPELINE_REACHERS` row for `src/store/settlementRederiveAction.js` (`:157`) | +10 eff | **§0.1a's ROW.** Add ONE frozen row, `class: 'DERIVED'` (the FIRST of that class; `BOUNDARY_CLASSES` at `:128` declares it and the walker's own message defines it *"re-derives an existing world"*), `payloadAwaitedBy: Object.freeze(['src/store/settlementRederiveAction.js'])` — the leaf awaits its own memoized loader, so no `reachesVia` is owed — and a `why` that says the leaf re-derives an EXISTING world from pins built out of its own record and mints no density law. ⛔ Add the row SURGICALLY; touch no other row and no other export. ⛔ No em dash and no exclamation point in the `why` string (§P2.19, measured: the packet's five planted `src/` literals carry 0 and 0). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/property/dmLayerGoldenIsolation.test.js` | +4 eff | Add the row SURGICALLY beside its 47 `tests/property/*Golden*` siblings, at the shape they carry: `{ "kind": "rationale", "ref": "golden-byte-pin" }` (the value `beliefMapGolden.test.js` and `generatorGoldenMaster.test.js` both carry, read by execution). `kind` is closed to `mutation \| rationale \| uncovered` (`tests/lint/mutationCoverageManifest.test.js:116`), so ⛔ `uncoveredBaseline` is UNMOVED. ⛔ Never re-serialise the manifest whole. ⭐ RE-MEASURED: `invariants` holds **723** rows at `16f0bc71c` (445 rationale + 92 mutation + 186 uncovered) and `enumerateInvariants(tree)` returns **723**, SET-EQUAL both directions — version 1 read 716; the DELTA this member causes is **+1**, unchanged. `rowKey` = `invariants['tests/property/dmLayerGoldenIsolation.test.js']`, distinct from EM-B1b's on the same train. |

**Generated artifacts: `NONE`.**

> ⛔ **THE LIGHTING CENSUS IS A DEFERRED ROW, NOT AN ARTIFACT OF THIS PACKET.**
> `tests/lint/.lighting-census-baseline.json` — **a named INTERIOR RED, delta only.** This member
> causes **`files +1 · parked +0 · credited +1 · titles +7 · suiteTitles +1`** (all five figures,
> in the register's own order, because the walker stops at its first moved figure). ⭐ **`+7` IS
> DERIVED, NOT GUESSED, AND THE COUNT LAW BINDS IT** (§P9(f)): the acceptance matrix homes SEVEN
> cases (A1, A2, A4–A8 — judgment 176(2) retired A3 with `not_in_pool`, and the ids of the
> survivors are UNMOVED so every §12 reference still resolves) and §7's CREATE row writes them as
> SEVEN literal `it`s under ONE literal
> `describe`, so the CREATE row's own words, the matrix, §10 and this delta state the SAME number
> and `EM-B2a4.count-prover.mjs` proves the equality. ⛔ The `TEST` row on
> `tests/store/editSlice.test.js` adds NO title and NO suite (7 `it`s / 1 `describe` before and
> after), and the `src/` rows move the census by nothing. The predicted red MESSAGE has the shape
> `expected <N+1> to be <N>`. ⚠ The `+1 credited` is CONDITIONAL on the file not parking: the build
> lane runs the walker's own `parkReasonsFor` over the new file and quotes its output. ⛔ THE CAUSE
> IS THE ONE NEW **TEST** FILE: the new `src/store/**` leaf and the MODIFY of a `src/domain/**`
> leaf move it by NOTHING (`files` is `TEST_FILES.length`; `TEST_FILES` walks `tests/` only).
> ⛔ **`LIGHTING_CENSUS_REFREEZE` is NEVER set by this lane** — the refreeze is regenerated WHOLE at
> the train's terminal, BY THE CHAIR.

> ⛔ **THE WIRING CENSUS IS A DEFERRED PREDICTION AND THIS PACKET NAMES ITS PATH NOWHERE**
> (interim rule 1 — not in this table, not in the capsule, not in `checks`).
> `stamp.producerIndexFiles` **+0**, and the roots it was measured against are named: this member
> CREATEs exactly one `.js`, `src/store/settlementRederiveAction.js`, which is under NEITHER
> producer root — and ⭐ version 3's new §7 row under `src/generators` is a MODIFY, which adds no
> FILE and therefore moves a file COUNT by nothing —
> `find src/generators src/domain -name '*.js' -type f | wc -l` → **1181** at
> `16f0bc71c`, equal to the census's own live `stamp.producerIndexFiles` (version 1 read 1172,
> before EM-B1c1's and EM-C4a's leaves), and
> `find src/generators src/domain -path '*src/store*'` → **0**. Its only `src/domain/**` row is a
> MODIFY of a file EM-B2a1 creates, which mints no new leaf of this member's. `stamp.files` and
> `stamp.candidateLeaves` **UNMOVED** — both key on `src/domain/display/stateProse/` paths this
> member does not touch. `totals.*` **UNMOVED** — this member produces no pool, variant or relation.
> ⛔ Regenerated WHOLE at the train's terminal, BY THE CHAIR.

⭐⭐ **THE SIXTH AMENDMENT'S INSTRUMENT LIST, EACH RUN IN PLAIN `node` OVER THE TIP AND OVER THIS
MEMBER'S PLANTED TEXT, EVERY FIGURE A DELTA** (§P2.19 · §P2.21; `EM-B2a4.evidence.md` carries the
harness, which takes its tree from an environment variable with NO default):

| instrument (§P2.21) | at `16f0bc71c` | with this member's text | DELTA | disposition |
|---|---:|---:|---:|---|
| **(a) entropy-root census** — `createPRNG(` lines under `src/domain/` (the walker pins **36**) | 36 | 36 | **+0** | **NOT OWED.** This member mints no stream; the engine mints its own inside the pipeline, behind a dynamic import |
| **(a) entropy-root census** — `createPRNG(` lines under `src/` WHOLE (the walker pins **47**; ⭐ judgment 151: the corpus is `src/` whole, so a `src/store` leaf is dispositioned by CONTENT, never by its root) | 47 | 47 | **+0** | **NOT OWED.** The new `src/store/**` leaf spells `createPRNG` nowhere |
| **(b) ruin-filter roster** — the `src/domain` discovery set (code-only; comments and string literals blanked before the scan) | 94 | 94 | **+0** | **NOT OWED.** `src/domain/edit/dmLayer.js` is NOT in the set today and this member's additions spell `.institutions` ZERO times: `pinsFrom` reads record keys by a COMPUTED key off `getStepMeta()`'s roster, never by a literal member |
| **(c) goods roster** — `src/domain/goods.schema.js`'s ST-2 roster, parsed by `tests/build/vendorPdfLazy.test.js` | — | — | **+0** | **NOT OWED.** No planted file imports `src/data/resourceData.js` or any goods identity half-table |
| **§P2.17 tuning inventory** — `countUnregisteredNamed` / `countBareDecimals` (the library's own, `scripts/lib/tuning-inventory.mjs`) over `src/domain/edit/dmLayer.js` | 0 / 0 | 0 / 0 | **+0 / +0** | **NOT OWED.** The planted text declares no top-level `UPPER_SNAKE = <number>` and no fractional decimal; `.tuning-inventory.json` holds no `dmLayer` row |
| **§P2.19 voice walker** — em dashes and exclamation points inside `src/` string literals, per file (a file the packet CREATEs is held at ZERO) | dmLayer 86 literals, 0 / 0 · editSlice 128 literals, 0 / 0 | the five planted literals | **0 em dash · 0 exclamation** | **CLEAN.** Counted with the walker's own predicate over the planned text: the new leaf 1 literal, the dmLayer additions 3, the editSlice plug 1 — 5 measured, 0 and 0 |
| **§P2.20 reviewed-set pin** — `tests/application/commands/commandRegistry.test.js` | — | — | **n/a** | ⛔ **NOT OWED, SAID AS THE ROW REQUIRES: this member REGISTERS NO APPLICATION COMMAND.** It plugs a seam inside a command EM-C4a already registered and reviewed (`settlement.plain-edit.apply`, ten → eleven at C4a's version 4.2); the bounded set does not move. The row's second half IS met: §6's editSlice contract reaches its target by a LITERAL module specifier, never a computed `get()[name]` dispatch |
| **§P9 effective lines** — eslint's own `Linter`, `max-lines`, `skipBlankLines` + `skipComments` | slice 816 · editSlice 116 · dmLayer 82 · helpers 246 | — | see §3 | **THE ONE INSTRUMENT.** Every budget figure in this packet is measured with it; ⛔ never `wc -l` |
| ⭐⭐ **THE LANDED CREATE-BOUNDARY WALKER** — `PIPELINE_REACHERS` rows (§0.1a) | 6 rows, `DERIVED` = 0 | 7 rows, `DERIVED` = 1 | **+1** | ⛔ **OWED, AND A §7 `REGISTER` ROW.** Executed over the walker's own reacher predicate |
| ⭐ **THE ONE-MUTATION-PATH WALKER** — `mutationPathOffenders(tree)`, the walker's own pure predicate | `[]` | `[]` | **+0** | **CLEAN.** Only `applyEdit` is watched on `dmLayer.js`; a static `import { rederive } …` is not an offender, and a dynamic import is not an edge at all |

⭐ **JUDGMENT 148's LAW, EXECUTED** (a member's pre-proof greps `tests` for every LEAF it imports
and carries each dormancy / importer-roster arm as a TEST row): the new leaf imports exactly ONE
estate leaf, `src/domain/edit/dmLayer.js`. `git grep -l -F 'dmLayer' -- tests` returns ELEVEN
files; `git grep -n -F 'src/domain/edit/dmLayer.js' -- tests` returns NINE hits across THREE files.
⛔ **NO IMPORTER-ROSTER OR DORMANCY ARM OVER `dmLayer.js` EXISTS**: `tests/domain/dmLayer.test.js`
is EM-B2a1's unit battery (six `it`s, none scanning importers) and
`tests/lint/editMutationPath.walker.test.js` watches `applyEdit` alone (above). ⇒ **NO TEST ROW IS
OWED ON THAT ACCOUNT.** ⚠ NOTICED, NOT TOUCHED: `tests/domain/dmLayer.test.js:5` still reads
*"Nothing in the estate imports `src/domain/edit/dmLayer.js` at this member's landing"*, which
`editSlice.js:30` made false at the EM-T12 landing — a PROSE sentence, asserted nowhere, and one
of VERIFY pass 2's stale-sentence family; it is the chair's to slot, not this member's to edit.

**Registers that DO NOT move, measured rather than assumed:**

- `scripts/check-observed-shape-readers.mjs` — ⛔ no `EXPLAINED_WRITER_EXEMPTIONS` row is owed or
  minted (the chair's **Q4**): gate 0 (`assertExplainedWriterEvidence`) refuses a row whose named
  `src/**` writer does not write the key, and no member of this split writes `dmLayer` onto a
  record. The script stays in `checks` as a standing GUARD that no NEW finding identity appears.
- `scripts/check-writer-reach.mjs` — no new written identity and no new customer surface; neither
  `--write` nor a mint.
- `scripts/.size-baseline.json` — ⛔ **NO §7 PATH CARRIES A ROW** (measured): the only `src/store/`
  row is `src/store/settlementSlice.js` at **816 / 816**, and that file left this packet with
  version 2's item 3(b) (it is EM-B2a5's); no row exists for the new leaf, for
  `src/generators/generateSettlementPipeline.js`, for `src/store/editSlice.js` or for
  `src/domain/edit/dmLayer.js`, and none is minted — the 800-line layer ceiling governs all four.
- `tests/lint/proseNumerics.test.js` — nothing rendered.
- `tests/lint/testRatchet.test.js` — measured: its `CEILING` (17) caps `baseline.entries`,
  enforcement-walker rows rather than test files, and is monotone-down.
- `EAGER_FIRST_PAINT_MODULES` — **MEMBERSHIP +0**, proved by A8's probe rather than by an
  absolute: neither `src/domain/edit/dmLayer.js` nor `src/store/editSlice.js` nor the new leaf is
  a member (all three measured 0 at `16f0bc71c` by importing the exported set), the new leaf is
  reached only dynamically from two non-members, and `computeEagerModuleGraph` walks static edges
  only. ⛔ The set's live SIZE (270 at this tip) is the chair's stamp, never this packet's figure.
  ⛔ **ANY RISE IS A STOP FOR THE OWNER.**
- `EDIT_SLICE_IMPORTS` (`tests/lint/editMutationPath.walker.test.js:76`) — **UNMOVED at four
  specifiers**, by construction: the seam plug is dynamic and carries no `from` clause.
- `tests/lint/proseNumerics.test.js` line-addressed baselines — **measured ZERO rows** for all
  three `src/` files this member modifies (`settlementSlice.js`, `dmLayer.js`, `editSlice.js`), so
  no baselined row sits below an insertion point and no re-address is owed.
- `docs/content/wiring-census.json` `stamp.files` — **seven producer files, none of them this
  member's**; no plain re-take is owed on that account.
- **Line-addressed citations into this member's files** — `git grep -n -E '<path>:[0-9]'` over
  `src`, `docs/content` and `tests` returns NOTHING for any of the three modified `src/` paths, so
  no citing file owes a re-address (the CURE-D class).
- `BASELINE_EDGES` (`tests/build/domainGeneratorsBoundary.test.js`) — **four files / five
  specifiers, UNMOVED**, by construction: the engine is a parameter, never a specifier, inside
  `src/domain/edit/**`.
- ⭐⭐ **THE BYTE NOTE — VERSION 3 PAYS A PRICE VERSION 2 DID NOT, AND IT IS MEASURED, NOT ASSUMED.**
  The FIRST-PAINT closure is still **MEMBERSHIP +0**: nothing under `src/generators/**` imports
  `dmLayer.js` or the new leaf, and `src/generators/generateSettlementPipeline.js` is not in
  `EAGER_FIRST_PAINT_MODULES` (measured by importing the exported set). ⛔ **THE GENERATION WORKER
  IS DIFFERENT.** `src/workers/generationRequest.js` imports the entry STATICALLY, so the entry is a
  member of that worker's closure — executed by a STATIC CLOSURE WALK from the worker entry
  (152 local modules; membership `true`), never a `dist` read. PRICE OF THE ONE LINE, measured with
  the tree's own esbuild over the file before and after: source **+20 B**, MINIFIED **+12 B**
  (`,pins:n.pins`). ⭐ THE SHAVE WAS TAKEN FIRST (buy-back ledger row 2, a source-side shave inside
  the member's own site): three spellings were minified and compared —
  `{ onStep: options.onStep, pins: options.pins }` **+12 B**, a nullish-defaulted variant **+18 B**,
  a hoisted destructure **+20 B** — so the spelling §7 carries IS the cheapest that keeps the
  mechanism. ⇒ **+12 B is owed against `WORKER_BUNDLE_CEILING_BYTES = 1396015`, which has ZERO
  slack.** ⛔ THE LANE NEVER RAISES IT: under rule 33 the chair buys the bytes back at the terminal
  from `BUY-BACK-LEDGER.md` and lowers the ceiling to the real build's measurement. The same +12 B
  rides every other chunk that carries the entry (`advanceInterval.worker`, `pdfRender.worker`,
  `customContentPreview.worker`), none of which is a zero-slack ceiling. Every dist arm stays OUT of
  `checks` (interim rule 2) and the train's terminal takes ONE summed price from ONE real build.

**THE BROWSER SUITE: NOT GOVERNING.** This member touches no `src/components/**` path, no route,
no `data-testid` and no accessible name, so **no `e2e/` spec is named** (interim rule 10, stated as
it requires).

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch. ⛔ Refuse to start until
   **EM-B2a1** has LANDED (`src/domain/edit/dmLayer.js` must exist) and **EM-B2a2** has LANDED
   (A7's anti-vacuity arm is vacuous before it). ⭐ **BOTH LANDED on train EM-T12; re-read at the
   seal, and the gate is discharged history at this base** (the header's `Depends on` row carries
   the measurements).
1. Capture the baseline: the five lighting figures; `scripts/mutation-coverage-manifest.json`'s
   `invariants` count and its `uncoveredBaseline` NUMBER; `stamp.producerIndexFiles`;
   `EAGER_FIRST_PAINT_MODULES`'s size and membership; both golden fixtures' SHA-256; eslint
   `Linter` `max-lines` for `src/store/settlementSlice.js` (expect **816**). Each read LIVE and
   recorded as the BEFORE of a delta — never copied from this packet.
2. Write the failing tests for A1–A8 and RUN THEM: every one must RED, for the stated reason,
   before any production line exists. ⭐ A8's arms (1) and (2) must red against a deliberately
   STATIC import of the leaf from `settlementSlice.js` and against a deliberately direct
   `import { generateSettlementPipeline } from '../../generators/…'` inside `dmLayer.js`
   respectively — a probe that cannot red is not a probe.
3. Add `pinsFrom` and `REDERIVE_UNAPPLIED_REASONS` to `src/domain/edit/dmLayer.js`, then `rederive`
   (the only one that clones and allocates).
4. Write `src/store/settlementRederiveAction.js` with its memoized dynamic import.
5. ⭐ **FORWARD THE BAG AT THE ENTRY** (judgment 173(a)): one option beside `onStep` in
   `generateSettlementPipeline.js :: generateSettlementPipeline`, and nothing else in that file.
   ⛔ RED-FIRST, and the control is the lane's own: with the row ABSENT, an OVERRIDDEN record-built
   bag through `engine.run` leaves the output BYTE-IDENTICAL (A7(b) holds on 0 of 5 sampled corpus
   rows); with the one line, it holds on 5 of 5 while A7(a) stays byte-identical both ways. Quote
   both counts. ⛔ **NO CONSUMER IS WIRED HERE** — `regenSection` is EM-B2a5's (judgment 173(b)),
   so `src/store/settlementSlice.js` is not opened and this member's leaf lands DORMANT.
6. Add the `scripts/mutation-coverage-manifest.json` row surgically.
6a. ⭐ Plug the seam in `src/store/editSlice.js` and ADD THE CASCADE BRANCH'S CONSULT (judgment
   145), then re-pin EM-C4a's two landed seam assertions in `tests/store/editSlice.test.js`. ⛔
   RED-FIRST: those two arms must RED against the plugged constant BEFORE the consult is added,
   and the log must print a TEST COUNT — a file that fails to LOAD reads exactly like the red a
   red-first wants (§P7). ⛔ Re-measure `editSlice.js`'s static specifier list after the edit and
   assert it still equals the frozen four.
6b. ⭐ Add the ONE `DERIVED` row to `PIPELINE_REACHERS` in
   `src/domain/density/densityCreateBoundary.js`. ⛔ RED-FIRST: run
   `tests/lint/densityCreateBoundary.walker.test.js` with the new leaf present and the row ABSENT,
   and quote `these modules reach generateSettlementPipeline but are not classified in
   PIPELINE_REACHERS: src/store/settlementRederiveAction.js` — a control that cannot red is not a
   control. Then add the row and re-run green. ⛔ Also assert `src/domain/edit/dmLayer.js` is NOT
   in the reacher set after the edit (§0.1a consequence 2): the neutral `engine.run(...)` call is
   what keeps it out.
7. Run `parkReasonsFor` over `tests/property/dmLayerGoldenIsolation.test.js` and quote its output;
   a non-empty reason list means the promised `credited +1` would land as `parked +1`, and the FILE
   is fixed, never the prediction.
8. Run the focused verification of §10. ⛔ Do NOT regenerate the lighting baseline; MEASURE the
   delta and record it.
9. Under the train, the bare full gate and the boot smoke move to the terminal; write the
   completion receipt of §12.

**Bounded algorithm — `rederive`**

```text
1. Read `layer` through EM-B2a1's absence rules into a base layer (never mutating the argument).
2. pins, missing, unapplied <- pinsFrom(record, layer, declarations, engine), which for each own
   key of layer.roots, ASCII-ascending:
   a. no usable set, no declaration, no `outputKey`, or a collectionKey no registered step
      provides                                          -> unapplied += { key, value, 'unknown_key' }
   b. its collection is in `missing`                    -> unapplied += { key, value, 'step_not_pinnable' }
   c. otherwise -> DEEP-CLONE record[collectionKey], write the DM's value at the leaf INSIDE the
      clone (an array located by entityId), and pin the CLONE   <- ⭐ JUDGMENT 176(3)
   ⛔ In (a) and (b) the PIN KEEPS THE RECORD'S OWN VALUE, the layer is left untouched, and ⛔ the
   RECORD is never mutated on any path.
4. If `pins` has no own key, call engine.run(config, null, { seed })   <- ⛔ THE NEUTRAL MEMBER
   with NO `pins` option at all (this is the golden's own call shape). ⛔ `engine.run`, NEVER
   `engine.generateSettlementPipeline`: §0.1a consequence 2 keeps `dmLayer.js` out of the reacher
   set, and version 2's spelling of this line contradicted its own §6 (corrected in version 3).
   Otherwise call it with `{ seed, pins: structuredClone(pins) }`.
5. Return { record: <the pipeline's output>, unapplied: <sorted, deduplicated on key> }.
   Mutate neither argument.
```

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Pins from the record, total against their producer | a golden-corpus record + the injected engine | `pinsFrom` returns a pin for EVERY key a registered step provides that the record holds and none for a key it lacks, asserted as a BOTH-DIRECTIONS set equality against the roster IMPORTED from its REAL producer, ⭐ `src/generators/pipeline.js :: getStepMeta` (judgment 173(c) — ⛔ NOT `pipe.getStepMeta`, which is `undefined` on the entry's namespace, executed); ⭐ **the pinnability rule asserted exactly**: a key is pinned only when EVERY step providing it is wholly pinnable, so the shared-key case (`stress` / `stressTypes` on `resolveStress`) yields a bag the runner accepts rather than the partial-pin throw; the steps that cannot be wholly pinned are NAMED in `missing` | `tests/property/dmLayerGoldenIsolation.test.js` |
| A2 | Dormant/absent, and purity | `rederive(record, config, undefined, engine)` and `(record, config, EMPTY_DM_LAYER, engine)` | byte-identical results; both `unapplied: []`; NEITHER argument mutated — the input record is deep-frozen and its JSON compared before and after (design §22.1 measured an aliased bag writing through in 36/63 and a cloned one in 0/63) | same |
| A4 | Boundary/sparse | a layer holding an override for a key the record no longer carries, mixed with two it does | the two are applied, the casualty is reported, the entity is NEVER re-created, `unapplied` is ASCII-ascending and deduplicated, and ⛔ **nothing present in the record and untouched by the override is ABSENT from the returned record** (a both-directions top-level key-set equality)  ⭐ **AND THE TWO SURVIVING REFUSALS LIVE HERE** (judgment 176(2) retired A3 with `not_in_pool`): a key whose declaration has no `outputKey` (an ANNOTATION) and a key whose `collectionKey` no registered step provides are each reported `unknown_key`; a key whose collection is in `missing` is `step_not_pinnable`; the returned record carries the ENGINE's value at every refused key, the LAYER comes back unchanged and STILL HOLDS the override, nothing throws, and the reason set is a BOTH-DIRECTIONS equality against the module's own `REDERIVE_UNAPPLIED_REASONS`, so a THIRD reason reds here | same |
| A5 | Idempotency and determinism | the same `(record, config, layer, engine)` twice; then the first output re-derived with the same layer | byte-identical under `JSON.stringify` both times — same seed + same config + same layer = the same record (THE PROMISE extended). Over a stride of the golden corpus, collected then asserted ONCE | same |
| A6 | Lifecycle round trip | a real generated settlement → `applyEdit(layer, op, declarations)` ⭐ **AT ARITY THREE with an injected declaration consult** (judgment 77; a two-argument call cannot build the layer at all) → `JSON.parse(JSON.stringify(layer))` → `rederive` against a FRESH same-seed generation | the overrides survive the hop; `mintDmId` reproduces the same id for the same `(seed, kind, n)` across it; the persist hop is byte-exact (the `lifecycleRoundTrip.test.js` fixpoint idiom) | same |
| A7 | ⛔ THE ISOLATION PROPERTY — see §0.2; the parent's byte-identity clause is REFUTED and is NOT asserted | (a) `generateSettlementPipeline` with an EMPTY layer; (b) the same seed+config with a ONE-ROOT layer | (a) equals `tests/fixtures/generator-golden-master.json` **byte-for-byte** across the corpus and `tests/fixtures/dossier-prose-manifest-golden.json` is unmoved — true by construction, because an empty layer never reaches `runPipeline` and `options.pins` absent ⇒ today's behaviour EXACTLY; (b) differs from (a) at that root. ⭐⭐ **ANTI-VACUITY, AND IT IS REAL IN VERSION 3** (judgment 173(a)): (b) must differ from (a) somewhere, or the layer was never consulted. EM-B2a2 has LANDED, and version 2 would still have been vacuous for a SECOND reason it had not measured — the entry dropped the bag, so (b) was byte-identical to (a) on every row. §7's entry row is what makes this arm bite, and the lane's own control proves it BOTH WAYS: with the row absent the arm holds on **0 of 5** sampled corpus rows, with it on **5 of 5**, while (a) stays byte-identical on 5 of 5 either way | same |
| A8 | ⭐ The closure probe, the layer boundary and the CREATE boundary | `EAGER_FIRST_PAINT_MODULES` imported from `vite.config.js`; every `.js` under `src/domain/` parsed; `PIPELINE_REACHERS` imported from its producer | (1) neither `src/domain/edit/dmLayer.js` nor `src/store/settlementRederiveAction.js` nor `src/store/editSlice.js` is a member of the eager set; (2) NO file under `src/domain/**` carries a `src/generators/**` specifier `BASELINE_EDGES` does not list, static or dynamic; ⭐ (3) `src/domain/edit/dmLayer.js` spells the bare symbol `generateSettlementPipeline` NOWHERE in comment- and string-stripped code, and `src/store/settlementRederiveAction.js` IS a key of `PIPELINE_REACHERS` with `class: 'DERIVED'` — both read from the producers, never re-typed; (4) ANTI-VACUITY: the eager graph read is non-empty and contains `src/main.jsx`, and `PIPELINE_REACHERS` is non-empty, so (1)–(3) cannot be green-on-nothing. ⛔ Reads no `dist` and therefore cannot skip | same |

This table is the entire edge-case budget — **7 of 7**. Omit nothing; add nothing.

## §10 · Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/dmLayer.js src/store/settlementRederiveAction.js \
  src/store/editSlice.js src/generators/generateSettlementPipeline.js \
  src/domain/density/densityCreateBoundary.js tests/property/dmLayerGoldenIsolation.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# The property battery and both goldens — ONE test directory per gated run
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/dmLayerGoldenIsolation.test.js tests/property/generatorGoldenMaster.test.js \
  tests/property/dossierProseManifest.test.js tests/property/beliefMapGolden.test.js

# ⭐ THE CREATE DIRECTORY, RUN WHOLE (the chair's addendum after runs 17/18/19: a CREATE under
# tests/<dir> opts into EVERY walker that governs tests/<dir>)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/property

# ⭐ THE STORE SEAM AND THE CREATE BOUNDARY (judgment 145 and §0.1a), by FILE
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/editSlice.test.js tests/store/deadOperationRatchet.test.js \
  tests/lint/editMutationPath.walker.test.js tests/lint/densityCreateBoundary.walker.test.js

# ⭐ THE COUNT PROVER — the build lane's PRE-SEAL instrument, run from the KIT path, never the
# tree; it is no `checks` entry and no §7 row (§P9).
node <kit>/packets-waiting/EM-B2a4.count-prover.mjs <kit>/packets-waiting/EM-B2a4.md \
  <kit>/packets-waiting/EM-B2a4.manifest.json

# ⭐ THE ENTRY'S OWN DIRECTORY (judgment 173(a)): a §7 MODIFY under src/generators opts into the
# pipeline's own batteries, which are the arms that would see a forwarding mistake first.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/generators

# The layer-boundary probe (pure source-parse; it cannot skip)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/domainGeneratorsBoundary.test.js

# The governing walkers, by FILE (these are the sealed checks)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/goldenFreeze.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/seedLoopTotality.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js tests/lint/sizeBaseline.test.js \
  tests/lint/recordRegisterTotality.walker.test.js

# The store consumer — ⛔ THE DIRECTORY WHOLE IS AN INSTRUMENT, NOT A SEALED CHECK (see §7's note
# and the compile report's Q3): `git grep -l -F 'settlementSlice' -- tests` returns NINETY files.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/store

# The path guards the leaf itself brings, and member 1's own battery
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/dmLayer.test.js tests/domain/livingContentLawWiring.test.js
# …and the same form for tests/lib/editTravel.test.js, tests/ops/migrationRehearsal.test.js,
#    tests/security/galleryScannerMirrorTotality.test.js

# ⛔ THE BUILD LANE'S INSTRUMENTS — NEVER SEALED CHECKS
#   (a) the excluded directory, which MUST EXIT 0:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js
#   (b) the lighting walker ALONE, as the measured, named INTERIOR RED:
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
#   ⛔ DO NOT set LIGHTING_CENSUS_REFREEZE. The refreeze is the chair's, at the terminal.
#   (c) the byte budgets' own tests, with their dist arms, at the TERMINAL and with a real build:
#       tests/build/vendorPdfLazy.test.js  tests/build/generationWorkerLazy.test.js
#       tests/build/engineChunkLazy.test.js

# Registers that must NOT move
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# ⛔ THE BROWSER SUITE: NOT GOVERNING. This member touches no src/components path, no route, no
# data-testid and no accessible name, so no e2e/ spec is named.

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B2a4
npm run implementation:resume -- EM-B2a4
```

Every command exits `0` except the lighting walker, which is the declared interior red. A lane
never runs `npm run check`; it pauses at a held gate. ⚠ `gate-mutex.sh --run` gives up after its
poll budget and **exits 3** (`GAVE UP`) — export the budgets above, capture the exit code, and
never pipe the gate: no printed count means it DID NOT RUN. Report actual counts; never copy a
historical count.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- **EM-B2a1 has not landed** (`src/domain/edit/dmLayer.js` absent) or **EM-B2a2** has not landed
  (A7's anti-vacuity arm would be vacuous);
- ⛔ **any `src/domain/**` file would need to name a `src/generators/**` specifier**, statically or
  dynamically, or `BASELINE_EDGES` would need one more entry;
- ⛔ **`EAGER_FIRST_PAINT_MODULES` gains ONE member, or any of the three owner-signed first-paint
  ceilings (`CLOSURE_BUDGET_BYTES` 1,048,000 · `CLOSURE_GZIP_BUDGET_BYTES` 337,000 ·
  `CLOSURE_BROTLI_BUDGET_BYTES` 283,000) would have to move** — a raise is the OWNER's signature,
  never this lane's, and `tests/build/vendorPdfLazy.test.js:1769` pins all three so a car that
  moves one must move the pin in the same commit;
- ⭐ **the entry's forwarding would need MORE than the one option** — a second statement, a guard,
  a changed return, or any other line of `src/generators/generateSettlementPipeline.js`: the row is
  one option beside `onStep` and nothing else (judgment 173(a));
- ⭐ **the worker-closure price is not measured, or a ceiling would have to RISE** — the entry is a
  member of the generation worker's closure and `WORKER_BUNDLE_CEILING_BYTES` (1396015) has zero
  slack: the lane PRICES the line and names a buy-back, ⛔ it never raises the ceiling and never
  re-records it (rule 33; the raise is the OWNER's);
- ⭐ **`src/store/settlementSlice.js` would have to be opened at all** — `regenSection` is EM-B2a5's
  under judgment 173(b), and this member's leaf lands DORMANT;
- ⭐ **`pipe.getStepMeta` would have to be used** — it is `undefined`; the roster comes from
  `src/generators/pipeline.js :: getStepMeta` (judgment 173(c));
- ⭐ **`pinsFrom` would have to hand the runner a bag that trips the partial-pin refusal** — a key
  is pinnable only if every step providing it is wholly pinnable;
- either golden fixture's SHA-256 moves by one byte, or `UPDATE_GOLDEN=1` appears necessary;
- ⛔ **a pinned re-derive would have to be asserted byte-identical to the record** — §0.2; that
  clause is the EM-R family's to make true, and asserting it here would red on the corpus;
- `runPipeline`, `chooseOrPin`, `getStepMeta` or any step's `provides` would need to change — those
  are EM-B2a2's, EM-B2a3's and the EM-R family's;
- ⛔ **`src/domain/edit/dmLayer.js` would have to spell the bare symbol `generateSettlementPipeline`
  in code**, or `src/store/settlementRederiveAction.js` would need any class but `DERIVED`, or
  `PIPELINE_REACHERS` would need a row for any file but the new leaf (§0.1a);
- ⛔ **`src/store/editSlice.js` would need a NEW STATIC IMPORT** (its frozen four-specifier list is
  an exact landed arm), or the seam would have to be reached by a computed `get()[name]` dispatch,
  or a landed arm of `tests/store/editSlice.test.js` would have to be WEAKENED rather than
  re-pinned to the plugged value;
- ⛔ **the seam's consult sites would end at anything but TWO** — judgment 145 rules the cascade
  branch's consult into this member's one `editSlice.js` MODIFY row;
- ⛔ **a root key would have to be mapped to a record path by anything but its declaration's
  `outputKey`** (four of seventeen disagree with the field name);
- `SAVED_SETTLEMENT_PATCH_KEYS` would need a new key, or a persisted key would be written here;
- `NOT_YET_WRITTEN_KEYS` would need to lose `dmLayer`, or
  `tests/lint/recordRegisterTotality.walker.test.js` reds;
- ⭐ **the closed reason set would need a THIRD member** (it is `['step_not_pinnable', 'unknown_key']` after judgment 176(2)), or a refused override would be silently dropped or deleted from the layer;
- ⭐ **`dmLayer.js` or `src/store/settlementRederiveAction.js` would need to IMPORT `src/domain/edit/fieldDeclarations.js` or `src/domain/edit/pools.js`** — the declaration set is INJECTED at arity five (judgment 176(1)); an import would make the leaf a THIRD entry in a roster `tests/domain/editDeclarations.test.js :: DORMANCY` pins EXACT at two, and §7 carries no row to widen it (judgment 148's law);
- ⭐ **`rederive` would need to RE-VALIDATE pool membership** — that is a write-time check at the single writer's door (judgment 176(2)); its absence today is RAISED in §13, never cured here;
- ⭐ **a leaf override would have to be pinned AS the collection's value** rather than written into a deep clone of the collection (judgment 176(3));
- a second record of DM field ownership, a second regeneration path or a second identity namespace
  appears necessary;
- `scripts/check-writer-reach.mjs` would need `--write`, `--genesis` or `--rebank`, or
  `scripts/check-observed-shape-readers.mjs` reports a NEW finding identity, or an
  `EXPLAINED_WRITER_EXEMPTIONS` row appears necessary (it is EM-B3's and the chair's);
- `parkReasonsFor` reports a reason for `tests/property/dmLayerGoldenIsolation.test.js` that cannot
  be cured inside this packet's files;
- the lighting census moves by anything other than `+1 file / +0 parked / +1 credited / +T titles /
  +1 suiteTitle`, or `uncoveredBaseline` moves at all;
- the acceptance matrix would grow past eight cases.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next member.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, `skipBlankLines` + `skipComments`, before and after) for `src/domain/edit/dmLayer.js`, `src/store/editSlice.js`, `src/store/settlementRederiveAction.js` and `src/generators/generateSettlementPipeline.js`, each against the 800 layer ceiling (⛔ no §7 path carries a `scripts/.size-baseline.json` row):
- ⭐ THE ENTRY'S ROW, PROVED BOTH WAYS: the A7(b) control with the forwarding ABSENT (expected: the arm holds on 0 of N rows) and PRESENT (expected: N of N), with A7(a) byte-identical either way; and `git diff -- src/generators/generateSettlementPipeline.js` showing ONE changed line:
- ⭐ THE WORKER PRICE: the entry's membership in the generation worker's closure by the STATIC CLOSURE WALK (⛔ never a `dist` read), the minified byte delta of the forwarding, the cheaper spellings tried, and the buy-back row named for the chair's terminal:
- ⭐ `pipe.getStepMeta` measured `undefined` and the roster read instead from `src/generators/pipeline.js :: getStepMeta`, with the second dynamic edge measured against `domainGeneratorsBoundary`'s corpus and `editMutationPath`'s `WATCHED`:
- Acceptance cases A1, A2, A4–A8 (SEVEN; judgment 176(2) retired A3), executed and passed:
- ⭐ THE INJECTED SET: `rederive`/`pinsFrom` at arity five/four with the set handed in by `editSlice.js :: applyPlainEditToDraft`, and the importer rosters of `src/domain/edit/fieldDeclarations.js` and `src/domain/edit/types.js` re-read UNMOVED at their two sanctioned edges:
- ⭐ THE COLLECTION PIN: one edited leaf, the WHOLE collection pinned from a deep clone, the record itself byte-identical after the call, and every unedited member of that collection carrying the record's own value:
- ⭐ A8's two red-first controls: the RED message quoted for a deliberately STATIC import of the leaf from an EAGER member (⛔ `settlementSlice.js` is no longer a §7 path — plant the probe in a scratch copy or another eager member and say which), and for a deliberate `src/generators/**` import inside `dmLayer.js`:
- `EAGER_FIRST_PAINT_MODULES` size and membership before and after (expected UNMOVED at both), read by IMPORTING the set:
- `BASELINE_EDGES` live edge count before and after (expected UNMOVED):
- `parkReasonsFor('tests/property/dmLayerGoldenIsolation.test.js')` output, quoted:
- Lighting census DELTA, all five figures, attributed to the one new test file by execution (⛔ never an absolute tuple; ⛔ no refreeze run here):
- Wiring census prediction re-stated as measured: `stamp.producerIndexFiles` before and after (expected UNMOVED) and the roots measured against:
- Mutation-coverage manifest: `invariants` count before and after (+1) and `uncoveredBaseline` before and after (expected UNMOVED); the added row quoted:
- `tests/property` run WHOLE, `tests/store` run WHOLE, and the seven governing walker files, with exits and counts:
- The four path guards (`dmLayer.test.js`, `editTravel`, `migrationRehearsal`, `galleryScannerMirrorTotality`), with exits:
- `tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js` — exit (must be 0):
- The lighting walker alone — the named interior red, message quoted:
- Both typecheck configurations (`typecheck:ratchet`, `typecheck:domain:strict`):
- Sealed per-step receipt and exact-state resume status:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after (expected identical):
- §7-versus-capsule set-equality proof, re-run at the landing:
- ⭐ `PIPELINE_REACHERS` row count and class histogram before and after (expected 6 → 7, `DERIVED` 0 → 1), and the RED-FIRST message of `densityCreateBoundary.walker.test.js` with the row absent, quoted:
- ⭐ The seam's consult SITES before and after (expected 1 → 2), and the two landed `editSlice.test.js` arms re-pinned, with their red-first messages and their TEST COUNT lines quoted:
- ⭐ `editSlice.js`'s static specifier list before and after (expected UNMOVED at four), read by the walker's own `staticNamedEdges`:
- ⭐ The sixth amendment's instrument list re-run at the member's own tip, every figure as a DELTA (entropy 36 / 47; ruin-filter 94; goods; tuning 0 / 0; voice 0 em dash / 0 exclamation; the one-mutation-path offender list):
- ⭐ `tsconfig.full.json`'s errors on this member's own `src/` paths, measured with the TypeScript compiler API before the report (§P7):
- ⭐ `EM-B2a4.count-prover.mjs` run from the kit path, exit 0, and its run against a deliberately wrong copy, exit non-zero:
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: the THREE of §0, each reported to the chair rather than taken silently

## §13 · RAISED MATTERS (judgment 176; the chair's, not the lane's)

- ⛔⛔ **NO DOOR IN THE ESTATE REFUSES AN OFF-POOL VALUE ON A `pool` FIELD TODAY — MEASURED, WITH A
  LIVE CONTROL, AND SLOTTED RATHER THAN DEFERRED.** Judgment 176(2) moves pool membership out of
  `rederive` and onto the single writer's door, on the ground that a value outside its pool never
  enters the layer. That ground is NOT TRUE AT THIS BASE. Driving
  `editSlice.js :: applyPlainEditToDraft` in plain `node`, exactly as the adapter calls it, over the
  declared `pool` field `npc.role` (`pool: 'npc.role'`, `outputKey: 'npcs[].role'`):

  | arm | value | result |
  |---|---|---|
  | CONTROL | an in-pool-shaped value | `ok=true`, written — so the probe is live |
  | SUBJECT | a value no pool holds | `ok=true`, **written to the record AND recorded in the layer** |

  `PLAIN_EDIT_REFUSALS` holds seven reasons and none of them is a pool reason, and the writer's own
  header says it *"resolves no pool"*. The dialog (EM-D0e) renders pool options only, so the GUI
  path is closed by construction — but the COMMAND path is not, and the command boundary is the one
  the estate's own law says is the only path.
  ⇒ **SLOTTED TO THE ADAPTER'S NEXT MEMBER (EM-C4b or EM-B2a5), NOT DEFERRED** — the chair assigns
  the slot the turn it reads this. ⛔ It is NOT this member's: curing it here would re-import the
  pool catalogue `src/domain/edit/pools.js` into a leaf whose importer roster forbids it, which is
  the STOP this version exists to cure.

- ⚠ **A SECOND-ORDER CONSEQUENCE, STATED SO NOBODY RE-FINDS IT.** Until that refusal lands, a layer
  may record a value no pool holds, and `rederive` — which by judgment 176(2) re-validates nothing —
  will pin it and re-derive a world around it. That is the DESIGNED behaviour at this base, not a
  defect of this member, and the acceptance matrix asserts it nowhere.
