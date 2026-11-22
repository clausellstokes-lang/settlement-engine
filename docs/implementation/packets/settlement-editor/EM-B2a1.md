# Settlement editor / EM-B2a1 — THE DM LAYER'S LEAF: a pure `src/domain/edit/dmLayer.js` that reads an override, applies an op to a layer and mints a deterministic DM id, with a unit battery that convicts a wrong leaf before anything imports it

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:295-314`) anchors the status row at end-of-line and takes
  `status` only when exactly one row matches. Every stamp, caveat and date goes on these
  continuation lines, never on the row.
  ⭐ MEMBER 1 OF 4 of the superseded **EM-B2a**, per the chair's ESTATE-REPAIR ruling of
  2026-09-20: **EM-B2a1** (this) → **EM-B2a2** (the seam + the heavy chooser) → **EM-B2a3** (the
  four remaining choosers) → **EM-B2a4** (the store consumer + the orchestration). **EM-B2b** lands
  after EM-B2a1 and EM-B2a4. The four-member partition, with every parent item assigned to exactly
  one member, is `EM-B2a.partition.md` beside this file.
- **Landed at:** `f9b68387a9185b6f791510b061232380c76ed3fb` — the twenty-first landing — train EM-T10: the DM's-layer leaf (arity-three applyEdit with an injected consult, fail-closed; two TS7006 parameters JSDoc-typed at its cure)
- **Packet version:** 2.1
  ⭐ **VERSION 2.1 (the chair, at install, 2026-09-21; judgment 81) — THE COUNT PROVER IS KIT FURNITURE.** It lives beside
  this packet in the chair's kit (`packets-waiting/EM-B2a1.count-prover.mjs`); it is run by the pre-proof, by the
  chair's placement (which refuses on a non-zero exit) and by the build lane BEFORE its seal. It is NOT placed in
  the tree and it is NOT a sealed check: a sealed check names a file the tree holds, and no furniture ships beside a
  packet in `docs/implementation/packets/` (measured: that directory holds packets only). ONE `checks` entry and ONE
  §10 command line were removed; no contract, acceptance case, required symbol or change row moved.
  ⭐ **WHAT VERSION 2 CHANGED AND WHY.** Version 1's pre-proof measured a contract whose
  parameters could not reach two of its three ruled refusal reasons: `applyEdit(layer, op)` was
  arity TWO, its op typedef was closed at `{ kind, key, value }`, and its root key was declared
  OPAQUE — so no card type, no field and no declaration set could reach the leaf, and
  `unknown_target` and `undeclared_field` were unreachable while §9's A3 required all three. The
  chair's **judgment 77** (2026-09-21 02:34 EDT, `findings/PREPROOF-EM-T10-2026-09-21/`) adopted
  cure (i) and REVISED its own judgment 30 Q3: `applyEdit` is now **arity THREE**, the op carries
  `cardType` and `field` beside the still-opaque root key, and `declarations` is an injected
  consult interface. Version 2 also: states the export count as **SIX** everywhere (version 1's
  prose and capsule note said five and the capsule's list omitted `APPLY_EDIT_REASONS`, the one
  export A3 asserts against); BINDS the lighting `titles` delta to a numeral and ships a count
  prover, because the red-first plants are plant-and-restore mutants and never `it`s; prints the
  preamble hash ONCE, in full, measured; and re-derives `checks` as if EM-B3d had landed.
- **Verified base:** `em-t10-b2a1-2026-09-21` at `e348d59b609e2c62c957a4cd78653849792043b7`
  ⚠ Left for the chair's promotion stamp. **The revalidation sentence the chair will use:**
  *"Re-measured at `e80a6a3f443e2f6a36e28fbebb72e98e46869fac` (read tip `read-tip-em-t9`,
  detached, `git status --short` EMPTY): the J-T1 window from version 1's compile base
  `bdbf7c89c` is EMPTY over every change-manifest path and every `requiredSymbols` path (18
  commits, 19 files, +942/−102 elsewhere); both CREATE targets ABSENT (`src/domain/edit/` holds
  only `recordRegister.js`; `tests/domain/` holds no `dmLayer` file); all seven `requiredSymbols`
  present VERBATIM, one hit each, at the paths and lines in §5; `retiredSymbols` empty; the
  preamble measured as the header's `Preamble:` row states it."* ⛔ A `__BASE__` packet can NEVER
  pass `validate:packets`; validation is downstream of this stamp, never a precondition of it.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** **NONE.** ⭐ This is the split's root member and the reason it is member 1: it
  imports nothing the estate does not already have, nothing imports it, and it therefore unblocks
  the parallel compiles of EM-B2a2, EM-B2a3 and EM-B2a4 against a fixed interface. `EM-P0`,
  `EM-P2` and `EM-R0a` have LANDED (measured: the pins seam at `src/generators/pipeline.js:59`
  and `:171`; `src/domain/edit/recordRegister.js`).
- **Collision group:** ⭐ **EMPTY at the file level.** No other waiting packet names
  `src/domain/edit/dmLayer.js` as a CREATE, and none names `tests/domain/dmLayer.test.js` at all.
  **EM-B2a4** and **EM-B2b** both MODIFY `src/domain/edit/dmLayer.js` and therefore land after
  this member; that is an ORDER, not a collision, and the just-in-time placement law enforces it
  (each refuses with `path does not exist for MODIFY` until this member lands).
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured at the read tip — `src/domain/edit/` holds ONE file
  (`recordRegister.js`, 10,581 B) and **no `scripts/.size-baseline.json` row exists for any path
  under `src/domain/edit/`** (grep, exit 1), so the 800-line layer ceiling governs and this
  member's ≤200-line leaf mints no row. `EAGER_FIRST_PAINT_MODULES` is **269** at the read tip
  (measured by IMPORTING the exported set, never by reading a list) and neither of this member's
  paths is in it. Every register figure this packet predicts is a DELTA; the live absolutes are
  the chair's to stamp.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)
  > **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth
  > amendment's eleven rules, obeyed before they land. Where this packet and `EM-PREAMBLE.md`
  > (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`, **measured at the
  > read tip** with `shasum -a 256`) disagree, the interim rules govern and this row is the record
  > of it.
- **Evidence:** every VERIFIED row below is receipted in `EM-B2a1.evidence.md` by command and output.

---

## §1 · Reconciled authority

1. ⭐ **THE CHAIR'S ESTATE-REPAIR RULING, 2026-09-20** — "THE EM-B2a SPLIT — RULED (the nine
   questions)". EM-B2a is **SUPERSEDED** by four members; this is member 1, "the leaf
   (`dmLayer.js` + its unit battery; nothing imports it yet)". Ruling 8: members are compiled
   CAPSULE-FIRST and §7 and the capsule must be set-equal. Ruling 9: the members compile against
   the **LANDED** EM-P0 pins seam, and EM-B2a's §0Z.1 stays as retired history.
2. **`COMPILE-RULES.interim.md`** (the chair, 2026-09-20), which governs where it and the preamble
   disagree — see the header row.
3. **ODQ §934.44–§934.46 / `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14** — "Edit at the source,
   never at the derivation". §14's ROOT list is the editor's subject; the layer holds the DM's
   OVERRIDE and the record is regenerated from it. **§14 outranks every §12 clause it touches.**
4. **THE PROMISE** (constitutional): a seed is a STARTING world forever; the pencil never rewrites
   what the chronicle recorded.
5. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1 (the module map and `dmLayer.js`'s exports) and §2
   (the `DmLayer` JSDoc type).
6. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, wave 1, row **EM-B2** (as split).
7. `docs/implementation/PACKET_STANDARD.md` and `docs/implementation/preambles/EM-PREAMBLE.md`.
8. **Live git state at the verified base — which outranks all of the above on what exists.**

**Resolved contradictions** (each settled by measurement, with the losing text named so nobody
re-litigates it):

- **The parent carried TWO mechanisms.** §0A/§6 put `drawRoot(rng, key, pool, layer)` at every
  root chooser with the draw always consumed; §0Z put the override on a **released pin** and
  declares itself to supersede §0A. **EM-P0 has landed and implements §0Z**, and its own code
  rules how a DM edit rides it (`src/generators/pipeline.js :: runPipeline`, verbatim: *"PARTIAL PINNING
  IS AN ERROR… (A DM's root edit is not a partial pin — the caller builds a pin for every chooser
  from the record and then overrides a VALUE.)"*). ⭐ **This member is INDIFFERENT to that
  ruling** — `layerRead`, `applyEdit` and `mintDmId` are required under both — which is why it is
  compilable today. It is EM-B2a2's and EM-B2a3's block, raised as partition question **Q1**.
- **`EM-B2a` §0Z.1 "⛔ THE SEAM DOES NOT EXIST"** (with `runPipeline` at `:152`) → **REFUTED at
  the tip and kept as RETIRED HISTORY** per ruling 9: `const _PINS_KEY = '__pins'` at
  `src/generators/pipeline.js:59` and `export function runPipeline(initialContext, rng, options = {})`
  at `:171`.
- **The parent's `requiredSymbols[21]`** (`generatePopulation.js :: const npcs = generateNPCs(`)
  → **NO LONGER RESOLVES** (`grep -c -F` → 0, exit 1). EM-P0 split the step's root half from its
  derive half; the live text is `const npcs = drawPopulation(ctx, rng, pins);` at `:237`. It is
  re-derived into two rows in the partition and belongs to **EM-B2a2**, not to this member.
- **`EMPTY_DM_LAYER`'s key set: the parent gave THREE spellings** — §6's typedef
  `{ roots, minted, phantoms }`, §0Z's `{ roots, worldFacts, minted, phantoms }`, and §6's own
  absence rules `{ entities: {}, minted: {}, phantoms: {} }`. **`entities` is the pre-amendment
  spelling and is RETIRED** (it belongs to §12.5's patch-the-record mechanism, which §14
  superseded). This packet mints the **FOUR-key** shape; see §6 and partition question **Q2**.
- **`applyEdit`'s arity: the parent gave TWO spellings and version 1 ruled a third that could not
  work.** The parent's §6 and manifest note said `applyEdit(layer, op) → layer`; its transition
  table and §9's A1 said `applyEdit(record, layer, op)`. **The record-taking form is retired with
  §12.5's mechanism.** Judgment 30 Q3 then ruled `applyEdit(layer, op)` with a THREE-member closed
  refusal set — and this packet's own pre-proof measured that those parameters cannot reach two of
  those three reasons (no card type, no field, no declaration set can enter, and the root key is
  opaque by rule). **REVISED BY JUDGMENT 77 (2026-09-21):** `applyEdit(layer, op, declarations)`,
  arity THREE. The closed set stays exactly three. See §6.
- **`EM-PREAMBLE.md` §P2.1** ("a new file under `src/domain/**` … moves the sovereignty-lighting
  census") → **REFUTED by measurement**: the walker's `files` is `TEST_FILES.length` and
  `TEST_FILES` walks `tests/` only (`:515`). This member's census motion is caused by its ONE new
  TEST file and by nothing else. The correction rides the fifth amendment (the chair's slot I).
- **`EM-PREAMBLE.md` §P2 row 11** ("a closure of 268 modules") → **269 at the read tip**, measured
  by importing the set. The correction rides the fifth amendment (the chair's slot H).

The implementer does not read other documents to reinterpret this packet.

## §2 · Outcome

**Observable result:** `src/domain/edit/dmLayer.js` exists and exports the DM layer's **six**
primitives at the exact contracts of §6; a unit battery drives every one of them over its whole
declared input space, including the hostile one, and reds on any leaf that gets them wrong.

**Definition of done:** the **six** exports of §6 are present at those exact signatures; the six
acceptance cases of §9 pass; the estate's record-class register still declares `dmLayer` NOT YET
WRITTEN and `tests/lint/recordRegisterTotality.walker.test.js` is green; both goldens are
untouched, which is trivially true because nothing generates anything here.

**In scope**

1. the pure leaf `src/domain/edit/dmLayer.js` (one new logic-bearing production leaf);
2. its unit battery `tests/domain/dmLayer.test.js` (one new test file).

**Explicit non-goals**

- ⛔ **the hook at the chooser** (`drawRoot` / the pin consult) — **EM-B2a2's and EM-B2a3's**, and
  no path of theirs is named here;
- ⛔ **the orchestration** (`pinsFrom`, `rederive`, `regenerateWithLayer`, `reapplyLayer`), the
  store seat in `regenSection`, and the golden-isolation property — **EM-B2a4's**;
- ⛔ **`worldFacts`' reader, `config′`, and the twelfth delta key `dmFields`** — **EM-B2b's**;
- ⛔ **the persisted key, the denylists, `publicSafe` / `worldSnapshotPublic`, and the
  observed-shape exemption row** — **EM-B3's and the chair's**;
- ⛔ **the field declarations** (which `(cardType, field)` pairs are declarable) — **EM-A1's**;
  this member consumes a declaration, it does not author one;
- ⛔ any change to `src/domain/userEdits.js`, `regenerationPreservation.js`,
  `historyPreservation.js` or `canonStatus.js` — §0's fork was decided and went to **EM-B4**;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | **0** (this member persists nothing) | ≤1 |
| Named state writers | 1 (`applyEdit`, and it writes a LAYER, never a record) | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 (headless) | ≤1 |
| Direct consumers | **0** — nothing imports the leaf at this member's landing, by design | ≤2 |
| New logic-bearing production leaves | 1 | ≤2 |
| Existing logic-bearing production files modified | **0** | ≤3 |
| Additional registration-only files | 0 | ≤3 |
| Handwritten files total | **2** (the leaf + its battery; `EM-B2a1.count-prover.mjs` is packet furniture kept in the chair's kit, never in the tree, not a build deliverable — see §7) | ≤12 |
| New/changed effective production lines | ≤200 | ≤400 |
| Effective lines per new leaf | ≤200 | ≤250 |
| Delta in a shared/baselined file | **0** (this member modifies none) | ≤15 |
| Acceptance cases | **6** | ≤8 |

Overrides approved before dispatch: **NONE — and none is needed.** ⛔ No budget is raised or
invented here. ⭐ Every row is at or under the standard, which is the point of making the leaf
member 1: the parent broke the existing-logic-files row at **six to eight against a limit of
three**, and this member takes **zero**.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B2a1
```

Expected, and dry-read against `scripts/implementation-session.mjs` check by check at the read tip:

| dispatch check | verdict at `bdbf7c89c` once the chair stamps the base |
|---|---|
| branch name / ancestry | ⚠ the sealed dispatch wants the worktree ON the verified branch; one build lane holds the integration branch in its worktree while the chair's is detached at the tip |
| substrate unchanged since the verified base | **PASSES** — this member declares two paths, both CREATE targets, so there is no substrate to have drifted |
| CREATE targets ABSENT | **PASSES** — `src/domain/edit/dmLayer.js` and `tests/domain/dmLayer.test.js` are both absent (measured) |
| MODIFY targets clean | **VACUOUS** — this member has none |
| every `requiredSymbols` row resolving | **PASSES** — all seven found VERBATIM (§5) |
| git-clean / foreign dirt fingerprinted without target overlap | no target of this member is a path any sibling writes |

⭐ This member is **DRAFT, not BLOCKED**: the parent's §0 fork was decided (to EM-B4), its §0A.1
and §0A.2 gates became EM-P2 and EM-P1, and its §0Z.1 block is refuted by EM-P0's landing. Nothing
this member needs is unruled.

## §5 · Verified tree contract

Every row re-found BY SYMBOL at the read tip; no line number below is a coding instruction.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⛔⛔ The boundary | `src/domain/edit/recordRegister.js` | `export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);` (`:59`) | the record-class register declares `dmLayer` NOT YET WRITTEN, and `tests/lint/recordRegisterTotality.walker.test.js` holds that register equal IN BOTH DIRECTIONS against records generated through the real pipeline over a 63-row stride of the golden corpus | PRESERVE. `applyEdit` returns a LAYER, so generation still writes no `dmLayer` key. The first member whose landing makes generation write it owes this row's removal — **it is not this one** |
| ⛔ Rival writer | `src/domain/userEdits.js` | `export function applyUserEdit` (`:181`) | mutates the entity's field and records `{ value, originalValue, editedAt }` under `entity._userEdits[path]`, then sets `entity._authored = true` | PRESERVE, untouched. §0's fork was DECIDED to EM-B4 (F1/SUBSUME, §934.47 B) |
| ⛔ Rival declaration | `src/domain/userEdits.js` | `export const EDITABLE_FIELDS` (`:73`) | declares 6 entity types + 14 settlement-root prose paths; `npc` carries `goal.short`, `secret.what`, `personality`, **`role`** — the single measured overlap with design §14's root list | PRESERVE. This member declares no field set, so it cannot widen the overlap |
| Migration input | `src/domain/userEdits.js` | `export function walkUserEdits` (`:351`) | the whole-tree iterator over existing inline edits; EM-B4's only real migration input reads through it | PRESERVE. No second iterator |
| Authorship marker | `src/domain/npc/characterEdit.js` | `export const AUTHORED_MARKER_KEY` (`:105`) | `'_authored'`, with the recorded ruling "`_authored` alone buys regen survival in all three modes (executed)" | Reuse the vocabulary. `DM_ID_NS` is an IDENTITY namespace, not a second marker |
| ⭐ The census correction | `tests/lint/sovereigntyLightingContract.walker.test.js` | `const TEST_FILES = walk(join(ROOT, 'tests'))` (`:515`) | `files` is `TEST_FILES.length` and `TEST_FILES` walks `tests/` ONLY | The ground of §7's lighting delta: the new `src/domain/**` leaf moves NOTHING; the one new TEST file moves it by one |
| The denominator | `tests/lint/mutationCoverage.shared.mjs` | `export const ENFORCER_DIRS` (`:36`) | eight dirs — `tests/lint, design, docs, data, copy, security, edgeFunctions, generators`. `NAME_PATTERN` (`:48`) matches `census\|scan\|baseline\|ratchet\|walker\|killlist\|parity\|coverage\|governance\|freshness\|integrity\|exhaustiveness\|roundtrip\|golden\|contract\|pin` | The executable reason `tests/domain/dmLayer.test.js` owes NO mutation-coverage row |
| Test precedent (unit) | `tests/domain/regenerationDelta.test.js` | `it('does not mutate either snapshot', () => {` (`:114`) | flat literal registration; an explicit purity arm beside whole-envelope assertions | Copy this proof shape for `dmLayer.test.js` |
| ⭐ Construction precedent | `tests/lint/recordRegisterTotality.walker.test.js` | its §6 header, "THREE CONSTRUCTION RULES" | (1) `it`/`test`/`describe` bound EXACTLY ONCE, never as a callback parameter; (2) every set an arm iterates is IMPORTED from its producer, never a local literal copy; (3) negative assertions carry `// anchored:` on the line immediately above, or are both-directions set equalities | Copy all three. They are the estate's newest test-file law and this member's file is governed by the same walkers |
| ⭐ The landed seam (context, not this member's) | `src/generators/pipeline.js` | `const _PINS_KEY = '__pins'` (`:59`); `export function runPipeline(initialContext, rng, options = {})` (`:171`) | EM-P0 has LANDED; `options.pins` absent or `{}` reproduces today's behaviour exactly, and EVERY step still runs | ⛔ NOT this member's. Named so nobody re-derives the parent's refuted "the seam does not exist" |

**Forbidden alternatives**

- no second record of DM field ownership beyond the one EM-B4's fork names;
- no second identity namespace and no second id mint; no PRNG, no clock, no locale anywhere in
  this leaf;
- no import of `src/components/**`, `src/store/**`, `src/generators/**` or any React/vite surface
  — this leaf is pure domain and must stay importable from a worker, a test and a node script;
- no persisted key written by this packet; no top-level `worldState` key;
- no edit to `src/domain/userEdits.js`, `regenerationPreservation.js`, `historyPreservation.js`,
  `canonStatus.js`, `recordRegister.js` or any generator file;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {{ roots: Record<string, unknown>, worldFacts: Record<string, unknown>,
 *             minted: Record<string, object>, phantoms: Record<string, object> }} DmLayer
 * `roots` holds THE DM'S OVERRIDE, keyed by ROOT KEY. Under design §14 the record is regenerated
 * FROM the layer, so the layer is the INPUT and the record is the OUTPUT. (This inverts §12.5's
 * storage, where the layer held the engine's original; that mechanism is superseded.)
 * ⭐ `worldFacts` is minted EMPTY here and READ BY NOBODY until EM-B2b. It is present from the
 * first landing on purpose: the layer's key set is a persistence shape, and widening a shipped
 * shape costs a migration that an empty frozen sub-object costs nothing to avoid.
 * ⛔ `entities` is the RETIRED pre-amendment spelling and appears nowhere.
 */

/** The one spelling. Deeply frozen: the object and all four sub-objects. */
export const EMPTY_DM_LAYER;

/** Exactly `dm:`. The ONE identity namespace of the DM layer. */
export const DM_ID_NS;

/** The closed refusal set, EXPORTED so a test asserts it both directions rather than re-typing it. */
export const APPLY_EDIT_REASONS;   // exactly ['invalid_op', 'undeclared_field', 'unknown_target']

/**
 * ⭐ THE INJECTED CONSULT (judgment 77). The leaf imports NOTHING from EM-A1; the caller passes
 * an object whose two members MIRROR BY SHAPE the two functions EM-A1 version 5.2 declares in
 * its §6.1, quoted here so the mirror is checkable rather than remembered:
 *   `declarationsFor(cardType)` — `@param {string} cardType`,
 *     `@returns {readonly FieldDeclaration[]}` "frozen, authored order; the SAME shared frozen
 *     EMPTY array for an unknown or undeclared cardType — never null, never a throw";
 *   `isEditableCard(cardType)` — `@param {string} cardType`, `@returns {boolean}`, defined as
 *     "`declarationsFor(cardType).length > 0`".
 * A `FieldDeclaration` carries `field: string` among its members (EM-A1 §6.2), which is the only
 * member this leaf reads.
 * ⚠ PLAUSIBLE UNTIL EM-A1 LANDS: these shapes are read from EM-A1's packet, not from code that
 * exists. They are RE-MEASURED at this packet's placement. The leaf is insulated from a change by
 * taking the consult as data: if EM-A1's shapes move, only the CALLER's adapter moves.
 * @typedef {{ isEditableCard: (cardType: string) => boolean,
 *             declarationsFor: (cardType: string) => readonly { field: string }[] }} DeclarationConsult
 */

/**
 * (1) THE READ. Pure, total, THROWS NEVER.
 * @param {unknown} layer any value at all — absent, null, a non-object, an array, or a DmLayer
 * @param {unknown} key
 * @returns {unknown|undefined} `undefined` means EXACTLY "the DM did not override this key".
 *   A stored `undefined` is impossible because `applyEdit` refuses it, so the two can never be
 *   confused. Own-property only: a key spelling a prototype member reads as `undefined`.
 */
export function layerRead(layer, key);

/**
 * (2) THE OP APPLICATION. Pure; a layer in, a NEW layer out. ⛔ IT NEVER TOUCHES A RECORD.
 * @param {unknown} layer read through the absence rules below
 * @param {{ kind: 'set-root', key: string, cardType: string, field: string, value: unknown }} op
 *   ⭐ `key` is the OPAQUE root key and is the ONLY thing the layer STORES. `cardType` and
 *   `field` are TRANSIENT COMMAND COORDINATES used for the consult and then discarded — they are
 *   never written into the layer, so ⛔ NO PERSISTED SHAPE MOVES (judgment 77).
 * @param {unknown} declarations a `DeclarationConsult`, read defensively
 * @returns {{ ok: true, layer: DmLayer, keys: string[] }
 *          | { ok: false, reason: (typeof APPLY_EDIT_REASONS)[number], layer: unknown }}
 *   On `ok:true` the returned layer is a NEW deeply-frozen object; `keys` holds exactly the keys
 *   this call wrote, ASCII-ascending. On `ok:false` `layer` is `===` the argument and nothing is
 *   allocated. NEITHER branch throws and NEITHER mutates an argument.
 * ⭐ THE ORDER OF REFUSAL IS FIXED AND ASSERTED: `invalid_op` (the op's own shape, which now
 *   includes a missing or non-string `cardType` or `field`) → `unknown_target` → `undeclared_field`.
 *   A fixed order means one hostile input has exactly one right answer, so A3 can assert it.
 * ⛔ FAIL CLOSED: an absent, null or malformed `declarations` (either member missing or not a
 *   function, or a member that throws) RESOLVES NO CARD TYPE, so every op is refused
 *   `unknown_target`. The leaf NEVER throws and NEVER writes on that path. An unusable consult
 *   can therefore never widen what the DM may override — it can only close the door.
 */
export function applyEdit(layer, op, declarations);

/**
 * (3) THE DETERMINISTIC DM ID MINT.
 * `dm:<kind>:<the first 16 lowercase hex of sha256(`${seed}|${kind}|${n}`)>`.
 * @throws {TypeError} on a non-string seed, an unknown kind, or an `n` that is not a non-negative
 *   safe integer. ⛔ No PRNG, no clock, no locale, no namespace other than `DM_ID_NS`.
 */
export function mintDmId(seed, kind, n);
```

**THE ROOT KEY.** `roots` is keyed by the root key EM-A1 declares; this member stores and returns
it as an OPAQUE STRING and asserts nothing about its internal shape. ⭐ This is deliberate and it
is what makes the leaf landable today: the parent was BLOCKED because `<cardType>:<entityId>:<field>`
had no regeneration-stable `<entityId>` (npc ids are the ARRAY INDEX, institutions are resolved by
display NAME, faction ids are `faction.${slug(name)}`). That block became **EM-P1** and is not
this member's; treating the key as opaque means no spelling of it can stale this leaf.
⭐ **THE KEY STAYS OPAQUE UNDER JUDGMENT 77.** The op's new `cardType` and `field` are NOT parsed
out of the key and are NOT stored beside it: they are transient coordinates the CALLER supplies
and the consult reads. ⛔ **Proving that the key a caller mints names the same `(cardType, field)`
it passes is NOT this member's** — the key is opaque to it. That pin belongs to the member that
MINTS root keys, which is **EM-C4a** (its own text decomposes the key: *"Let `{ card, entityId,
field }` be the root key read through…"*, and its held-field row already names EM-A1's
`declarationsFor` beside this leaf's `applyEdit`). Named here so it is not rediscovered.

**Absence rules** (asserted by A6):

- **absent** (`undefined`): read as `EMPTY_DM_LAYER`. The only shape a generated settlement has.
- **empty** (all four sub-objects present and empty): legal, behaviourally identical to absent,
  and ⛔ NEVER normalized back to absent by this member.
- **`null`**: FORBIDDEN as a stored value. Read defensively as `EMPTY_DM_LAYER`; never written.
- **invalid legacy input** (a non-object, an array, or an object missing any sub-object): read as
  `EMPTY_DM_LAYER` with the missing sub-objects materialized empty. ⛔ NEVER a throw.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
⭐ The guards are evaluated in the FIXED ORDER of §6: shape, then card type, then field. Every row
below is reached only when every row above it passed.

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| `layer` without `key` in `roots` | `applyEdit(layer, op, declarations)` | `op.kind === 'set-root'`; `op.key`, `op.cardType` and `op.field` each a non-empty string; `op.value` not `undefined`; `declarations.isEditableCard(op.cardType)` true; `op.field` among `declarations.declarationsFor(op.cardType)`'s `field`s | a NEW frozen layer whose `roots[key]` is `op.value`; the other three sub-objects `===` the input's; ⛔ `cardType` and `field` are NOT stored | `{ ok: true, keys: ['<key>'] }` |
| `layer` WITH `key` in `roots` | `applyEdit` on the same key | as above | a NEW frozen layer whose `roots[key]` is the NEW value — ⭐ the layer holds the DM's override, so the second value REPLACES the first (this inverts §12.5's "never overwrite the original", which belonged to the retired mechanism) | `{ ok: true, keys: ['<key>'] }` |
| any | `applyEdit` where `op` is not a well-formed `set-root` — wrong `kind`; a non-string or empty `key`, `cardType` or `field`; `value === undefined` | evaluated FIRST | the layer returned `===` the input | `{ ok: false, reason: 'invalid_op' }` |
| any | `applyEdit` whose `op.cardType` the consult does not know | evaluated SECOND | `===` the input | `{ ok: false, reason: 'unknown_target' }` |
| any | ⛔ `applyEdit` with an absent, null or malformed `declarations` (a member missing, not a function, or throwing) | the FAIL-CLOSED rule, evaluated with the second guard | `===` the input | `{ ok: false, reason: 'unknown_target' }` — no card type resolves, so the door closes; ⛔ never a throw, never a write |
| any | `applyEdit` with an `op.field` the consult does not declare for that card type | evaluated THIRD | `===` the input | `{ ok: false, reason: 'undeclared_field' }` |

⚠ **The consult mirrors EM-A1, which has not landed.** The leaf never imports EM-A1: it takes the
`DeclarationConsult` as its THIRD ARGUMENT, so all three refusals are provable TODAY against a
frozen test-supplied stub and become live the day EM-A1 lands with **no edit to this leaf**. The
mirror's shapes are quoted from EM-A1's §6.1/§6.2 in §6 above and are **PLAUSIBLE until EM-A1
lands, re-measured at placement**. ⛔ The parent's fourth reason `'field_owned_elsewhere'` was
fork-F2-only and **dies with §0's fork**, which went to EM-B4 as F1.

### Ordering and precedence

- **Pipeline position:** NONE. This leaf is not on any pipeline; it is called by EM-B2a4's
  orchestration and by EM-C4's store slice, neither of which exists yet.
- **Merge/replace:** `applyEdit` REPLACES `roots[key]`. One op touches one key.
- **Tie-break:** none.

### Determinism

- **Hash/fork key:** `mintDmId` = `sha256(\`${seed}|${kind}|${n}\`)`, first 16 lowercase hex.
  No other hash; no PRNG draw anywhere in this packet.
- **Stable enumeration:** `keys` is ASCII-ascending.
- **Rounding/clamping:** none — no numeric derivation.
- **No-draw behaviour:** `layerRead` on an absent, empty, null or invalid layer returns
  `undefined`; `applyEdit` on an absent layer materializes from `EMPTY_DM_LAYER` and allocates
  only on the `ok:true` branch.

### Flag and dormancy

- **Flag:** `NONE`. Wave 1 is headless and mints no flag.
- **Golden posture:** **UNCHANGED, and trivially so** — this member generates nothing, imports no
  generator and is imported by nothing, so `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dossierProseManifest.test.js` cannot see it.
  ⛔ `UPDATE_GOLDEN=1` is FORBIDDEN to this packet.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| `applyEdit` materializes a layer from `EMPTY_DM_LAYER` on the first accepted op; a generated settlement is created WITHOUT the key (⭐ still true after this member: `NOT_YET_WRITTEN_KEYS` is preserved) | `layerRead`, own-property only, total | ⛔ NOT THIS MEMBER — `applyEdit` returns the layer to its caller and writes nothing. EM-B3 persists it | ⛔ EM-B3. The absence rules make a pre-EM save reload correctly the day the key ships | ⛔ EM-B2a4 — `pinsFrom` / `rederive` / the `regenSection` seat | ⛔ EM-C1's `withdraw`/`reopen`; `revertUserEdit` remains the existing per-field undo for `_userEdits` | ⛔ EM-B3/EM-B4. Design §11: edits do not travel — a fork, an import and the gallery projection carry neither key (already half-enforced: `publicSafe.js:294` deletes `clone.dmLayer`, `worldSnapshotPublic.js:92` denies it) | ⛔ EM-B3. This member emits no player-facing projection and no receipt string |

### Receipts and privacy

- **Closed kinds:** `APPLY_EDIT_REASONS` = `['invalid_op', 'undeclared_field', 'unknown_target']`.
  ⛔ No other value, asserted as a both-directions set equality in A3.
- **Address chain:** the opaque root key, echoed verbatim in `keys`.
- **Numeric-to-word bands:** `NONE` — this member renders no figure, so nothing is owed to
  prose-numerics.
- **DM-only fields:** the whole layer. ⛔ Its projection rule is EM-B3's.
- **Player/public projection:** `NONE`.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY` — this member touches no faction/deity alignment surface.
- **Edit story:** this member IS the DM edit path's leaf, and nothing else. The DM verb is EM-D2's
  `Save`, reaching it through EM-C4's store slice and the one generic decree adapter.

## §7 · Exact change manifest

⭐ **GENERATED FROM `EM-B2a1.manifest.json` AND PROVED SET-EQUAL WITH IT** (interim rule 6 / chair
ruling 8). The proof is quoted in §12 and in `EM-B2a1.evidence.md` §E9.

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/dmLayer.js` | **SIX exports** — `EMPTY_DM_LAYER`, `DM_ID_NS`, `APPLY_EDIT_REASONS`, `layerRead`, `applyEdit`, `mintDmId` | 200 eff | Write the pure leaf at §6's exact signatures, `applyEdit` at **arity THREE**. Zero imports from `src/components`, `src/store` or `src/generators`, and ⛔ **zero import of EM-A1** — the consult is the third argument. Strict-typecheck clean; no PRNG, no clock, no locale. |
| `CREATE` | `tests/domain/dmLayer.test.js` | **adds exactly 6 literal `it`s** under ONE literal `describe` — one per acceptance case, A1–A6 | n/a | Copy the proof shape of `tests/domain/regenerationDelta.test.js` and the THREE CONSTRUCTION RULES of `tests/lint/recordRegisterTotality.walker.test.js`. Flat literal `it(...)` under ONE literal `describe`; `it`/`test`/`describe` each bound EXACTLY ONCE; no bare seed loop (collect, then assert once — which is why a case with a matrix is still ONE `it`); every negative assertion anchored; every asserted set IMPORTED from the leaf, never re-typed; the `DeclarationConsult` stub is a frozen literal in this file and is never imported from EM-A1. ⛔ **The four red-first plants of §9a add NO `it`** — they are plant-and-restore mutants of the gate script (§9a item 1). |

**Generated artifacts: `NONE`.**

> ⚠ **`EM-B2a1.count-prover.mjs` IS KIT FURNITURE: NOT A CHANGE-MANIFEST ROW, NOT IN THE TREE, NOT A SEALED CHECK** (interim rule
> 12; RULED by the chair at install, judgment 81, in answer to version 2's question). It stays beside this packet in the
> chair's kit (`packets-waiting/`), so §7 and the capsule stay set-equal and the tree gains no new file class. The chair's
> placement runs it and refuses on a non-zero exit; the build lane runs it BEFORE its seal (§10). The prover reads only this
> packet's Markdown and its capsule — no repository scan, no test runner — so it cannot go stale against the tree.

> ⛔ **THE LIGHTING CENSUS IS A DEFERRED ROW, NOT AN ARTIFACT OF THIS PACKET.**
> `tests/lint/.lighting-census-baseline.json` — **a named INTERIOR RED, delta only.** This member
> causes **`files +1 · parked +0 · credited +1 · titles +6 · suiteTitles +1`** (all five figures,
> in the register's own order, because the walker stops at its first moved figure). ⭐ **`titles
> +6` is BOUND, not symbolic** (interim rule 12, judgment 77): §7's CREATE row authorizes exactly
> six literal `it`s, §9's matrix homes exactly six cases in that file, and §9a item 1 rules the
> four plants out of the count because they are plant-and-restore mutants, not `it`s. The three
> numbers are proved equal by `EM-B2a1.count-prover.mjs`, which ships with this packet and exits
> non-zero on any inequality. The predicted red MESSAGE has the shape
> `expected <N+1> to be <N>`. ⛔ **`LIGHTING_CENSUS_REFREEZE` is NEVER set by this lane**, and the
> refreeze is regenerated WHOLE at the train's terminal, BY THE CHAIR (§P2.1: *an in-packet
> refreeze needs a commit, a commit drifts the sealed HEAD, and the sealed verbs then refuse*;
> §P3.2: *re-derived whole at the terminal, never patched*). ⚠ The `+1 credited` **and the
> `titles +6`** are CONDITIONAL on the file not parking: the build lane runs the walker's own
> `parkReasonsFor` over the new file and quotes its output; a parked file's titles count nowhere,
> and the commonest cause is a re-bound `it` (26 of the estate's 384 parked files park for that
> alone). A reported reason is a §11 STOP, never a re-prediction.

> ⛔ **THE WIRING CENSUS IS A DEFERRED PREDICTION AND THIS PACKET NAMES ITS PATH NOWHERE**
> (interim rule 1 — not in this table, not in the capsule, not in `checks`).
> `stamp.producerIndexFiles` **+1**, and the leaf is named one by one: **`src/domain/edit/dmLayer.js`**
> — that is the whole list, measured against BOTH producer roots (`src/generators/**` and
> `src/domain/**`; this member creates one `.js` under the second and none under the first).
> `stamp.files` (7 entries) and `stamp.candidateLeaves` (6 entries) are **UNMOVED** — both key on
> `src/domain/display/stateProse/` paths this member does not touch. `totals.*` **UNMOVED** — this
> member produces no pool, variant or relation. ⛔ Regenerated WHOLE at the train's terminal, BY
> THE CHAIR; a member never runs `node scripts/wiring-census.mjs`, because N lanes each
> regenerating a global COUNT produce N conflicting blobs.

**Registers that DO NOT move, measured rather than assumed:**

- `scripts/mutation-coverage-manifest.json` — ⛔ **NO ROW IS OWED, MEASURED** by importing the
  enforcer's own module: `tests/domain` is not in `ENFORCER_DIRS` and
  `NAME_PATTERN.test('dmLayer.test.js')` is **false**. (Its sibling EM-B2a4's
  `dmLayerGoldenIsolation.test.js` DOES match `golden` and owes a row there, stated as a delta
  with `"rowKey": "invariants['tests/property/dmLayerGoldenIsolation.test.js']"`.) A conditional
  row would still RESERVE the path against every sibling, so none is written.
- `scripts/check-observed-shape-readers.mjs` — no `EXPLAINED_WRITER_EXEMPTIONS` row is owed or
  minted: gate 0 (`assertExplainedWriterEvidence`) refuses a row whose named `src/**` writer does
  not write the key, and no member of this split writes `dmLayer` onto a record. The script stays
  in `checks` as a standing GUARD that no NEW finding identity appears.
- `scripts/check-writer-reach.mjs` — no new written identity and no new customer surface; neither
  `--write` nor a mint.
- `scripts/.size-baseline.json` — **no row exists for any path under `src/domain/edit/`** and none
  is minted; the 800-line layer ceiling governs a ≤200-line leaf.
- `tests/lint/proseNumerics.test.js` and every other LINE-ADDRESSED register (interim rule 13) —
  **`none found`, and the reason is structural:** this member's change manifest holds **ZERO
  non-`CREATE` rows**, so there is no modified path to grep and no frozen row can sit beneath an
  inserted line. The command rule 13 prescribes (`git grep -n -F '<path>' -- tests/lint scripts`)
  has no path to run on. Nothing is rendered either, so nothing is owed to prose-numerics.
- ⭐ **BYTE-ARM HOLDER (interim rule 14): NOT THIS MEMBER, and no member needs to be for it.**
  This packet carries NO `TEST` row on any budget's test file, because it is in no budgeted
  closure at all (the membership measurement below). If the chair names a byte-arm holder for
  train EM-T10, this member states a predicted delta of **ZERO bytes in every closure** and names
  that holder; it never carries the row itself.
- `scripts/mutation-coverage-manifest.json` under **interim rule 15**: `ENFORCER_DIRS` was READ at
  the read tip (`tests/lint/mutationCoverage.shared.mjs:36`, never recalled) — `tests/lint`,
  `tests/design`, `tests/docs`, `tests/data`, `tests/copy`, `tests/security`,
  `tests/edgeFunctions`, `tests/generators`. **`tests/domain` is not among the eight**, and
  `NAME_PATTERN.test('dmLayer.test.js')` is false, so the `CREATE` owes no `REGISTER` row and
  `tests/lint/mutationCoverageManifest.test.js` is not owed in `checks`.
- `tests/lint/testRatchet.test.js` — measured: its `CEILING` (17) caps `baseline.entries`,
  enforcement-walker rows rather than test files, and is monotone-down.
- both goldens and the five edge-shared bundles — this member is in no closure at all.
- ⛔ **Byte budgets: ZERO in every closure** — the worker (`WORKER_BUNDLE_CEILING_BYTES = 1401208`,
  EXACT, zero slack, no placement cure), the lazy engine (`< 679_000`) and the eager first-paint
  closure (269 modules). This is a MEMBERSHIP fact and it is why the leaf is member 1: **nothing
  imports it.** Every dist arm stays OUT of `checks` (interim rule 2) and the train's terminal
  takes ONE summed price from ONE real build. ⚠ The first `src/generators/**` importer of this
  leaf pulls it into the zero-slack worker closure; under the partition that importer is EM-B2a2
  and only under Q1's ruling (i) — see the partition.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. Capture the baseline: the five lighting figures, `scripts/mutation-coverage-manifest.json`'s
   `invariants` count, and `stamp.producerIndexFiles`, each read live and recorded as the BEFORE
   of a delta — never copied from this packet.
2. Write the failing tests for A1–A6 **and the four red-first plants of §9a**, and RUN THEM: every
   one must RED, for the stated reason, before any production line exists.
3. Implement `src/domain/edit/dmLayer.js` — the frozen constants first, then `layerRead`, then
   `mintDmId`, then `applyEdit` (which is the only one that allocates).
4. Re-run the battery to green; then re-run the four plants with the leaf deliberately broken one
   way each, and quote each red's message.
5. Run `parkReasonsFor` over `tests/domain/dmLayer.test.js` and quote its output; a non-empty
   reason list means the promised `credited +1` would land as `parked +1` and the file is fixed
   before the landing, never the prediction.
6. Run the focused verification of §10. ⛔ Do NOT regenerate the lighting baseline; MEASURE the
   delta and record it.
7. Under the train, the bare full gate and the boot smoke move to the terminal; write the
   completion receipt of §12.

**Bounded algorithm — `applyEdit`**

```text
1. Validate `op` — SHAPE ONLY, no consult: kind === 'set-root'; key, cardType and field each a
   non-empty string; value !== undefined.
   Any failure -> { ok: false, reason: 'invalid_op', layer } with `layer` REFERENTIALLY the input.
2. Resolve the CARD TYPE against the injected `declarations`, FAIL CLOSED:
   treat the consult as unusable when it is not an object, or either member is not a function,
   or a member throws when called (wrap the call, never let it escape).
   unusable, OR isEditableCard(op.cardType) is not true
                                        -> { ok: false, reason: 'unknown_target', layer }
3. Resolve the FIELD against the same consult:
   declarationsFor(op.cardType) is read as an array of objects and searched for one whose
   `field` === op.field; a non-array or a throw is treated as "no declarations" (fail closed).
   not found                            -> { ok: false, reason: 'undeclared_field', layer }
4. Read the input through the absence rules into a base layer (never mutating the argument).
5. Return { ok: true, keys: [op.key],
            layer: deep-frozen { ...base, roots: { ...base.roots, [op.key]: op.value } } }.
   The other three sub-objects are carried by reference: they are already frozen.
   ⛔ op.cardType and op.field are NOT written anywhere: they were command coordinates only.
```
⭐ Steps 1→2→3 are the fixed refusal order of §6, and nothing in steps 2 or 3 may throw: every
consult call is guarded, so a hostile or absent consult produces a REFUSAL, never a stack.

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | `EMPTY_DM_LAYER` + one valid `set-root` op (`key`, `cardType`, `field`, `value`) on a declared field + the FROZEN STUB consult | `ok:true`; the new layer's `roots` carries the DM's value at exactly that key and nothing else; **`cardType` and `field` appear NOWHERE in the returned layer** (a both-directions key-set check on `roots`); `keys` is exactly that one key; **no argument is mutated**, the input still `===` `EMPTY_DM_LAYER` and JSON-identical to it, and the stub consult is unmutated too | `tests/domain/dmLayer.test.js` |
| A2 | The read is pure and total | `layerRead` over the hostile matrix: `undefined`, `null`, `42`, `'x'`, `[]`, `{}`, a layer missing `roots`, a non-string key, `'__proto__'`, `'constructor'`, `'toString'` | a defined value for an overridden key; `undefined` for every other input; **nothing throws, in any of the eleven**; a prototype-member key reads `undefined` (own-property only) | `tests/domain/dmLayer.test.js` |
| A3 | Counterforce — the three refusals, their ORDER, and the fail-closed consult | `applyEdit` with (a) a malformed op — wrong `kind`, and a non-string/empty `key`, `cardType`, `field` in turn, and `value === undefined`; (b) an unknown card type; (c) an undeclared field; (d) ⭐ the FAIL-CLOSED matrix: `declarations` absent, `null`, `42`, `{}`, one member missing, a member that is not a function, and a member that THROWS; (e) ⭐ the ORDER probe: one op that is malformed AND names an unknown card type AND an undeclared field | each returns `ok:false` with the exact reason; `layer` comes back `===` the input; **nothing throws, in any of them**; every (d) case returns exactly `'unknown_target'` and writes nothing; the (e) op returns `'invalid_op'`, which is the executable statement that the order is shape → card type → field; and the reason set is asserted as a BOTH-DIRECTIONS equality against the leaf's own exported `APPLY_EDIT_REASONS`, so a fourth reason reds here and a missing one reds here | `tests/domain/dmLayer.test.js` |
| A4 | Idempotency and order | `applyEdit` twice on one key with different values; twice with the SAME value; three distinct keys in all six permutations (every call passing the same frozen stub consult) | the second value stands; the same value twice is JSON-identical; all six permutations yield a byte-identical layer under `JSON.stringify` with sorted keys | `tests/domain/dmLayer.test.js` |
| A5 | Determinism and the namespace | `mintDmId` over the invalid matrix (non-string seed, unknown kind, negative / fractional / non-safe `n`) and the valid matrix; then with `Math.random` and `Date.now` stubbed to throw | every invalid input throws `TypeError`; every valid input matches `/^dm:[a-z]+:[0-9a-f]{16}$/`; the same triple twice is equal and three distinct triples are distinct; **the stubbed run is byte-identical to the unstubbed one**, which is the executable statement that there is no PRNG, clock or locale in the mint | `tests/domain/dmLayer.test.js` |
| A6 | Boundary — absence and the frozen shape | absent / empty / `null` / a non-object / an array / an object missing each sub-object in turn; then `EMPTY_DM_LAYER` itself | all read as `EMPTY_DM_LAYER` with the missing sub-objects materialized empty, and **none throws**; an empty layer is never normalized back to absent; `EMPTY_DM_LAYER`'s key set equals `['minted','phantoms','roots','worldFacts']` BOTH DIRECTIONS; the object and all four sub-objects are frozen, and a write to each throws in strict mode | `tests/domain/dmLayer.test.js` |

This table is the entire edge-case budget — **6 of 8**. Omit nothing; add nothing.

## §9a · ⭐ HOW THIS BATTERY CONVICTS A WRONG LEAF, AND WHY THE LEAF IS NOT DEAD CODE

**The problem, stated plainly.** Nothing imports `src/domain/edit/dmLayer.js` at this member's
landing. A battery that only drives the leaf's happy path would be a test of a module that could
be a stub, and the estate would carry a dark file until EM-B2a2 lands.

**Measured: NO instrument in the estate convicts an unimported module under `src/` by totality.**
`tests/lint/deadCodeDisposition.walker.test.js` parses its roster from
`docs/DEAD_CODE_DISPOSITION.md`'s own tables (BY COLUMN NAME) and calls `importersOf(target, roots)`
per NAMED target; it has no arm that enumerates `src/**` looking for modules nothing reaches.
`tests/joins/deadCode.test.js` holds a hand-listed `PURGED` array of five `(file, symbol)` pairs,
none of them this leaf. ⇒ **this member trips neither**, and it therefore owes neither a
`CANONICAL_DARK_UNTIL` header nor a `docs/DEAD_CODE_DISPOSITION.md` row. CONFIRMED by reading both
files whole.

**So the liveness proof is this packet's own, and it is made of four things:**

1. **FOUR RED-FIRST PLANTS, each run before the leaf exists and each with the reason it must red.**
   A plant that cannot red is not a test; each of these is driven against a deliberately wrong
   leaf at step 4 of §8 and its message quoted in the receipt.
   ⛔⛔ **A PLANT IS NEVER AN `it` (the chair, judgment 77).** P1–P4 are **plant-and-restore
   mutants** the build lane's own gate script applies to `src/domain/edit/dmLayer.js`, runs the
   EXISTING battery against, and then restores — exactly the shape EM-B3d's script used. They add
   **ZERO** literal titles, they appear in no `describe`, and they are therefore **outside the
   lighting `titles` delta**. Each plant names the acceptance case whose arms convict it, and that
   case's `it` already exists: P1↔A1, P2↔A2, P3↔A3, P4↔A5. This is the sentence that BINDS the
   `titles` figure in §7, §10, §11 and §12 to a numeral; the count prover (§10) proves it.

   | plant | the wrong leaf it convicts | why it MUST red |
   |---|---|---|
   | P1 — the purity plant (A1) | an `applyEdit` that mutates `layer.roots` in place instead of allocating | the input is `EMPTY_DM_LAYER`, which is FROZEN: an in-place write throws in strict mode, and the arm asserts the input is still JSON-identical afterwards. A leaf that "works" by mutation cannot pass |
   | P2 — the totality plant (A2) | a `layerRead` written as `layer.roots[key]` with no guard | reds on `undefined`, `null`, `42` and the missing-`roots` case with a `TypeError`, naming the input that broke it |
   | P3 — the closed-set plant (A3) | a leaf that adds a fourth reason (e.g. the retired `'field_owned_elsewhere'`), or that throws where it should refuse, **or that FAILS OPEN — accepting the op when `declarations` is absent or malformed** | the set equality is BOTH DIRECTIONS against the leaf's own export, so a fourth member reds and a missing one reds; the "nothing throws" arm converts a throw into a named failure rather than a stack; and A3's fail-closed matrix (d) reds the fail-open leaf by name, which is what makes "an unusable consult can only close the door" executable rather than asserted |
   | P4 — the entropy plant (A5) | a `mintDmId` that reaches for `Math.random`, `Date.now` or a locale-sensitive path | the stubs THROW when touched, so the stubbed run reds instead of quietly differing; and the byte-equality of the two runs is what makes "no clock" executable rather than asserted |

2. **THE BOUNDARY IS HELD BY AN INSTRUMENT THAT ALREADY EXISTS.** `NOT_YET_WRITTEN_KEYS`
   (`recordRegister.js:59`) declares `dmLayer` unwritten, and
   `tests/lint/recordRegisterTotality.walker.test.js` — which is in this packet's sealed `checks`
   — holds the register equal in both directions against records generated through the REAL
   pipeline. If this leaf's landing somehow caused generation to write the key, that walker reds
   by name. It is a live guard on a dark file.

3. **FIVE MORE LIVE GUARDS COME FROM THE PATH ITSELF.** `git grep -l -F 'dmLayer' -- tests` at the
   read tip returns five files, all of them in `checks`: `tests/lib/editTravel.test.js` (edits do
   not travel), `tests/ops/migrationRehearsal.test.js`,
   `tests/security/galleryScannerMirrorTotality.test.js` and
   `tests/store/decreeRegistryPersistence.test.js` beside the totality walker. ⭐ **Re-derived as
   if EM-B3d had landed** (the same grep over EM-B3d's own build worktree, read-only): it returns
   **six**, adding `tests/lib/importScrub.test.js` — EM-B3d strips `dmLayer` and `decrees` on
   import, so its suite spells the key. That sixth file is in `checks`, which makes the derivation
   correct at placement in either order. The veil already
   denies the key (`publicSafe.js:294`, `worldSnapshotPublic.js:92`, and `accountData.js:213` as a
   third denial site), so the leaf lands inside an existing fence rather than beside one.

4. **THE WINDOW IS SHORT AND IT IS SCHEDULED.** The leaf is dark only between this member's
   landing and **EM-B2a4**'s (the orchestration imports `layerRead` and `applyEdit`) — and, under
   partition question Q1's ruling (i), **EM-B2a2**'s sooner. Both are compiled in parallel with
   this one and ride the same train. ⚠ If the chair ever parks the remaining members, THEN this
   leaf becomes a `docs/DEAD_CODE_DISPOSITION.md` row with a `CANONICAL_DARK_UNTIL` header — that
   is the cure, and it is named here so it is not rediscovered.

## §10 · Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/dmLayer.js tests/domain/dmLayer.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# The unit battery — ONE test directory per gated run, the slot held for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/dmLayer.test.js

# ⭐ THE CREATE DIRECTORY, RUN WHOLE (the chair's addendum after runs 17/18/19: a CREATE under
# tests/<dir> opts into EVERY walker that governs tests/<dir>)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain

# The governing walkers, by FILE (these are the sealed checks)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/recordRegisterTotality.walker.test.js tests/lint/contractTestAntiVacuity.walker.test.js \
  tests/lint/goldenFreeze.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/seedLoopTotality.walker.test.js

# ⭐ THE COUNT PROVER (interim rule 12) — plain node, no test runner, KIT FURNITURE (version 2.1): run it BEFORE your seal,
# from the chair's kit, where it reads the kit's copies of this packet and capsule (they differ from the placed ones only in
# the Status and Verified-base rows). It is an INSTRUMENT, never a sealed check:
#   node "$SP/chair-kit-923472dc/packets-waiting/EM-B2a1.count-prover.mjs"
#   It reads THIS packet's Markdown and the capsule JSON and prints one line per file —
#   `file · arms the row declares · cases the matrix homes there · titles delta` — exiting
#   non-zero on any inequality. Expected: `tests/domain/dmLayer.test.js · 6 · 6 · +6` and exit 0.
#   ⭐ Its FAILING CONTROL is run once and quoted in §12: the same prover over a deliberately
#   wrong copy of the packet (one §7 numeral changed) must exit NON-ZERO and name the inequality.

# The live guards the path itself brings — FIVE files (re-derived as if EM-B3d had landed)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lib/editTravel.test.js
# …and the same form for tests/lib/importScrub.test.js, tests/ops/migrationRehearsal.test.js,
#    tests/security/galleryScannerMirrorTotality.test.js, tests/store/decreeRegistryPersistence.test.js
# ⭐ tests/lib/importScrub.test.js is the ONE file EM-B3d adds to this set: the derivation was
#   re-run over EM-B3d's own build worktree (branch `em-t8-b3d-2026-09-21`, read-only) and the
#   grep returned SIX files where the tip returns five. It is in `checks` so the derivation is
#   correct at placement whether EM-B3d has landed or not — the file exists at the tip either way.

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

# Registers that must NOT move
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# ⛔ THE BROWSER SUITE: NOT GOVERNING. This member touches no src/components path, no route, no
# data-testid and no accessible name, so no e2e/ spec is named. (Interim rule 10, stated as it
# requires.)

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B2a1
npm run implementation:resume -- EM-B2a1
```

Every command exits `0` except the lighting walker, which is the declared interior red. A lane
never runs `npm run check`; it pauses at a held gate. ⚠ `gate-mutex.sh --run` gives up after its
poll budget and **exits 3** (`GAVE UP`) — export the budgets above, capture the exit code, and
never pipe the gate: no printed count means it DID NOT RUN. Report actual counts; never copy a
historical count.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- `src/domain/edit/dmLayer.js` or `tests/domain/dmLayer.test.js` already exists at dispatch;
- any of the seven `requiredSymbols` of §5 no longer resolves VERBATIM;
- **`NOT_YET_WRITTEN_KEYS` would need to lose `dmLayer`**, or
  `tests/lint/recordRegisterTotality.walker.test.js` reds — that means generation has begun
  writing the key, which is EM-B3's act and not this member's;
- the leaf would need to import anything from `src/components/**`, `src/store/**` or
  `src/generators/**`, or would need EM-A1's declaration module rather than an injected set;
- `mintDmId` would need a PRNG, a clock, a locale or any namespace other than `DM_ID_NS`;
- a second record of DM field ownership, or a second identity namespace, appears necessary;
- the closed reason set would need a fourth member;
- `parkReasonsFor` reports a reason for `tests/domain/dmLayer.test.js` that cannot be cured inside
  this packet's two files (the promised `credited +1` would land as `parked +1`);
- the lighting census moves by anything other than `+1 file / +0 parked / +1 credited / +6 titles
  / +1 suiteTitle`, **or `EM-B2a1.count-prover.mjs` exits non-zero**;
- `applyEdit` would need a fourth parameter, or the consult would have to be imported rather than
  injected, or an unusable consult would have to FAIL OPEN;
- the op would have to STORE `cardType` or `field` in the layer (that moves a persistence shape,
  which is the chair's and EM-B3's, not this member's);
- `scripts/check-writer-reach.mjs` would need `--write`, `--genesis` or `--rebank`, or
  `scripts/check-observed-shape-readers.mjs` reports a NEW finding identity;
- a `scripts/.size-baseline.json` row would have to be minted for the leaf;
- the acceptance matrix would grow past eight cases.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next member.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line counts (eslint `Linter`, `skipBlankLines` + `skipComments`) for `src/domain/edit/dmLayer.js` against the 200 budget and the 800 layer ceiling:
- Acceptance cases A1–A6, executed and passed:
- ⭐ The four red-first plants P1–P4: the RED message quoted for each, from the run BEFORE the leaf existed, and again from the deliberately-broken run — ⛔ together with the statement that the gate script PLANTED and RESTORED each mutant and that **no plant added an `it`**:
- ⭐ `EM-B2a1.count-prover.mjs`: its one line per file and its exit code (expected `tests/domain/dmLayer.test.js · 6 · 6 · +6`, exit 0), AND its FAILING CONTROL run over a deliberately wrong copy, with the inequality it named and its non-zero exit:
- `parkReasonsFor('tests/domain/dmLayer.test.js')` output, quoted:
- Lighting census DELTA, all five figures, measured and read AGAINST the stated `+1 / +0 / +1 / +6 / +1` (⛔ never an absolute tuple; ⛔ no refreeze run here; any other delta is the §11 STOP):
- Wiring census prediction re-stated as measured: `stamp.producerIndexFiles` before and after, and the one leaf named:
- Mutation-coverage manifest: `invariants` count before and after (expected UNMOVED) and the executed `ENFORCER_DIRS` / `NAME_PATTERN` measurement that says no row is owed:
- `tests/domain` run WHOLE, and the five governing walker files, with exits and counts:
- The five path guards (`editTravel`, `importScrub`, `migrationRehearsal`, `galleryScannerMirrorTotality`, `decreeRegistryPersistence`), with exits:
- `tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js` — exit (must be 0):
- The lighting walker alone — the named interior red, message quoted:
- Both typecheck configurations (`typecheck:ratchet`, `typecheck:domain:strict`):
- Sealed per-step receipt and exact-state resume status:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after (expected identical; this member generates nothing):
- §7-versus-capsule set-equality proof, re-run at the landing:
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
