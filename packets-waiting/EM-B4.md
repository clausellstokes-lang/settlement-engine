# Settlement editor / EM-B4 — THE IN-APP MIGRATION: today's inline edits fold into `dmLayer.roots` by the §14 classification and into `dmLayer.notes` where they are derived or history, unconditionally and idempotently on every save read

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:11 EDT at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`, and re-proved unchanged against the docs-only descendant `34f320829656957d3cfb33ff28b1772859ca5b0a` (every measured path byte-identical by object id — `EM-B2.evidence.md` §E0)
- **Depends on:** `EM-P2` (the generation fork registry — the §14 root/derived CLASSIFIER this fold cannot work without), `EM-B2a` (the `DmLayer` shape it writes into) and `EM-B3` (the persisted key). ⭐ **Owner decision §934.47 B is DECIDED YES**, so the fold's target is settled and this packet is DRAFT rather than BLOCKED. None has landed; all are named as packet IDs, not SHAs.
- **Collision group:** `EM-B3` (⚠ this packet writes the two keys B3 mints; the two must serialize, B3 first) · `EM-B2` (blocked on the SAME ruling, §0.1)
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — the lighting census tuple `2645 / 383 / 2262 / 25009 / 6670` at `e5a27a1a5`; `tests/scripts/` holds 5 files and ZERO `scripts/mutation-coverage-manifest.json` rows; `SCHEMA_VERSION` is `1` and the migration chain holds exactly ONE entry (`{ from: 0, to: 1 }`); the golden master fixture holds **525** rows. Every figure executed at this base — evidence §E6, §E7.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** `EM-B4.evidence.md`, with §E0 and §E11 cross-referenced from `EM-B2.evidence.md`.

---

## §0 · ⛔⛔ WHY THIS PACKET IS BLOCKED — THREE MEASURED CONTRADICTIONS

The charter's row names three inputs and one medium. **Two of the three inputs do not exist as
described, and the medium cannot reach the data it is asked to migrate.**

### §0.1 · The surviving input is the state whose ownership is unruled

With §0.2 and §0.3 taken out, the migration's ONLY real input is the inline-edit record —
`entity._userEdits` + `entity._authored`, written by `applyUserEdit` (`src/domain/userEdits.js:181`,
`:205`) and walked by `walkUserEdits` (`:351`). That is exactly the state EM-B2 §0 is blocked on:
until the chair rules whether `dmLayer` **subsumes**, **excludes**, or **coexists with**
`_userEdits`, "fold the inline edits into the layer" has no defined target. This packet inherits
EM-B2's fork and adds nothing to it.

### §0.2 · ⛔ THE MEDIUM IS REFUTED — a repo-side node CLI cannot reach a single save

| Measured fact | Where |
|---|---|
| local saves live in a BROWSER's `localStorage['dnd_settlement_saves']` | `src/lib/saves.js:16`, `:105`, `:125` |
| cloud saves live in per-user Supabase `settlements` rows behind that user's session | `src/lib/saves.js:369-371` |
| the estate's save-shape migration is IN-APP and runs on every read AND write | `migrateSaveToV2` (`src/lib/saves.js:190`), applied at `:331, :443, :503, :684, :713, :743, :775, :850` |
| the settlement blob has a versioned, append-only, idempotent chain | `migrateSettlementToLatest` / `listMigrations` / `diagnoseMigrationChain` (`src/domain/settlementMigrations.js:90, :141, :162`) |
| the ONE `scripts/migrate-*` in the estate migrates a REPOSITORY BASELINE FILE, not user data | `scripts/migrate-observed-shape-readers.mjs` |

`scripts/migrate-edit-registry.mjs` would be a script no user can run against data no script can
see. This is also `PACKET_STANDARD.md`'s **"Ungated persistence"** law read forward: *"⛔ An arm
that normalizes or cleans PERSISTED state runs UNCONDITIONALLY... a world generated while the
flag is dark keeps its saves un-normalized, and the rot is discovered later by a reader that
cannot tell a stale shape from a new one."* A CLI a user never runs is the strongest form of the
failure that clause forbids — the normalization would never execute at all.

### §0.3 · ⛔ TWO OF THE THREE NAMED INPUTS ARE EMPTY

| Charter input | Measured state |
|---|---|
| **the Surveyor's staged state** | ⛔ **NOT PERSISTED.** `InterpretApplyPanel.jsx:153-155` holds `result`, `decisions` and `applyResult` in React `useState`; `git grep interpretation -- src/store` returns NOTHING. The only persisted Surveyor artifact is `'surveyorInstructions'` (`src/store/campaignSlice.js:400`) — the AutonomyPanel's STANDING instructions, not staged proposals. A tab close discards the review |
| **the Change Dock's pending changes** | ⛔ **SESSION-ONLY, so the input set is empty.** The store key is `pendingEditsQueue`; it is absent from `partializeStoreState`'s nine keys (`src/store/persistProjection.js:245`) and absent from the closed 17-key `SAVED_SETTLEMENT_PATCH_KEYS`. The estate's own audit says so: *"session-only (pendingEditsQueue is outside the persist allowlist)"* (`docs/CAPABILITY_REMEDIATION_PLAN.md:167`). Design §12.13's "RETIRED, not merged" is therefore correct AND costless |
| **inline edits** | ✅ real, persisted on the settlement blob — and §0.1's block |

### §0.4 · THE FORKS, PRICED

| Fork | The rule | Cost, measured |
|---|---|---|
| **G1 — IN-APP, VERSIONLESS** (the chair's cheapest lawful option) | the fold is a pure normalization arm applied UNCONDITIONALLY inside `src/lib/saves.js`'s existing per-read/per-write chain, beside `migrateSaveToV2` and `migrateSettlementShape`; no `SCHEMA_VERSION` bump | 1 new `src/domain/edit/**` leaf + 1 existing logic file (`src/lib/saves.js`) + 1 test file. Satisfies "Ungated persistence" by construction. **Goldens unmoved.** |
| **G2 — IN-APP, VERSIONED** (the `MIGRATIONS` chain) | append `{ from: 1, to: 2 }` and bump `SCHEMA_VERSION` | ⛔ **MOVES ALL 525 GOLDEN ROWS.** Measured: the golden hashes `sha256(JSON.stringify(generateSettlementPipeline(...)))`; `assembleSettlement.js:324` normalizes the output; `normalizeSettlement.js:167` stamps `schemaVersion: SCHEMA_VERSION`. `EM-PREAMBLE.md` §P3.1 makes that a standing STOP |
| **G3 — THE SCRIPT AS CHARTERED** | `scripts/migrate-edit-registry.mjs` with `--check` | ⛔ **REFUTED by §0.2.** The only lawful residue is a repo-side *auditor* over fixtures — which migrates nothing and does not discharge the charter's row |
| **G4 — RETIRE THE ROW** | with the Change Dock empty and the Surveyor unpersisted, fold nothing and let `applyEdit` absorb `_userEdits` lazily under EM-B2's fork F1 | 0 files here; the whole cost moves into EM-B2's F1 split |

**Everything below is measured and complete for fork G1**, which is the only fork that is both
lawful under the golden posture and faithful to the "Ungated persistence" law. Clauses a fork
decides are marked ⛔ WITHHELD and nowhere else.

### §0.5 · ⭐ ADDENDUM — DESIGN §14 LANDED MID-COMPILE

The chair landed `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 ("Edit at the source, never at the
derivation"; the owner, ODQ §934.44) and the preamble row `HZ-DERIVED` after this packet's base.
**This packet's charter row is BYTE-IDENTICAL at that HEAD**, so nothing above is stale. Its
consequence for the fold is one sentence: §14 rules derived facts never editable and history
immutable, and most of `EDITABLE_FIELDS`'s fourteen settlement-root paths are derived prose
(`economicViability.summary`, three `safetyProfile` descs, five `history.*`). **A fold that
copies them into `dmLayer` would carry a shipped violation of the newest design law forward into
the editor's own record.** The fold's input denominator therefore cannot be settled until the
chair rules which of those paths survive §14 — a fourth reason this packet is BLOCKED, and the
one with the shortest fuse, because §14 also makes fork G4 (retire the row) coherent.

### §0.6 · ⛔ THE CHAIR'S AMENDMENTS (2026-09-19, ODQ §934.44–§934.46; consist `2280742ab`, final at `7aa769830`) — THE FOLD'S CONTRACT GAINS A CLASSIFIER

The layer no longer patches the record; it acts AT THE CHOOSER, and `dmLayer` holds ROOT keys
only (design §14 as amended; EM-B2 §0A). The fold's contract changes accordingly, and the change
is a narrowing, not a widening:

1. **Inline edits on a DRAFT fold into the layer AS ROOT KEYS.** The fold must classify each
   inline edit's field as **root** or **derived** through the same decision-fork registry EM-A1's
   declarations are read from, and write only the root ones.
2. **A DERIVED inline edit CANNOT MIGRATE.** It is REPORTED, never applied — a fourth audit list
   `derivedRefused: string[]`, ASCII-ascending, beside `wouldAdd` / `alreadyOwned` / `unfoldable`.
   ⭐ **AMENDED BY DECISION B (§0R):** that list is no longer refused — it is the NOTES FOLD. The
   same measured set goes to `dmLayer.notes`, and the audit list is renamed `wouldNote`.
   Applying one would re-introduce exactly the stale-derivation contradiction §14 exists to
   prevent, and design §14 additionally rules history immutable (THE PROMISE).
3. **Measured, this is most of the input.** Of `EDITABLE_FIELDS`'s fourteen settlement-root paths,
   `economicViability.summary`, the three `economicState.safetyProfile.*Desc` paths and the five
   `history.*` paths are DERIVED under §14's taxonomy — **nine of fourteen refuse**. Of the entity
   paths, `npc.role` is a root §14 names explicitly; `npc.goal.short`, `npc.secret.what`,
   `npc.personality`, `faction.desc`, `institution.desc`, `hook.*`, `historicalEvent.*` and
   `currentTension.*` need the registry to classify them — and the registry does not cover
   `src/generators` at all (EM-B2 §0A.1).
4. **⛔ A FOURTH REASON THIS PACKET IS BLOCKED.** The classifier the fold needs does not exist:
   the decision-fork registry's scan roots are `src/domain/worldPulse`, `/spatial`, `/traditions`
   and `/region`, and **zero of its 43 rows names a `src/generators` module**. Without it the
   fold cannot tell a root from a derivation, and a fold that guesses is the data corruption §14
   was written to stop. The layer keys it would write are additionally unstable (EM-B2 §0A.2).

5. **THE FINAL AMENDMENT CHANGES NOTHING HERE, AND THAT IS WORTH STATING.** Design §14's final
   shape (re-derivation with pins, ODQ §934.45–§934.46) leaves this packet's row BYTE-IDENTICAL on
   the charter (verified: `git show 2280742ab:<charter> | grep EM-B4` equals the same at
   `7aa769830`), and its instruction for the fold is exactly clauses 1 and 2 above — inline edits
   fold into `dmLayer.roots` by the registry's classification, and a derived inline edit is
   reported, never applied. The fold is a normalization over stored edits; it is indifferent to
   how the engine later re-derives from them.

Recorded in §1 as these amendments, dated 2026-09-19, ODQ §934.44–§934.46.

---

## §0R · ⭐ OWNER DECISION §934.47 B — DECIDED YES, AND WHAT IT SETTLES

The owner ruled (by deferral to the chair's recommendation): the old inline editing is kept and
folded. Concretely, and this supersedes §0.1's block:

1. **`_userEdits` ROOT paths fold into `dmLayer.roots`** by the §14 classification, through EM-P2's
   generation fork registry — the same join EM-A1's declarations use, `(cardShape, outputKey)`.
2. **`_userEdits` DERIVED-prose and HISTORY paths fold into `dmLayer.notes`** — the DM's notes on
   the card, kept and shown as notes, never as facts. ⭐ **My `derivedRefused` list becomes the
   notes fold**: the same measured set, no longer refused but re-homed. Nothing a DM wrote is lost,
   and nothing derived is re-asserted as a fact.
3. **The Change Dock is retired WITHOUT migration** — measured, its queue is session-only
   (`pendingEditsQueue` is absent from `partializeStoreState`'s nine keys and from the closed 17-key
   `SAVED_SETTLEMENT_PATCH_KEYS`), so there is nothing persisted to fold. §0.3 stands as the receipt.
4. **The medium is the in-app `migrateSaveToV*` pattern**, unconditional on read and write — which
   is what §0.2 measured and what `PACKET_STANDARD.md`'s "Ungated persistence" law requires.

**Measured, this is a 9/14 split on the settlement-root paths.** Of `EDITABLE_FIELDS.settlement`'s
fourteen, NINE are derived or history under §14's taxonomy — `economicViability.summary`, the three
`economicState.safetyProfile.*Desc` paths, and the five `history.*` paths — and go to `notes`. The
remaining five and the entity-type paths are classified by the registry, which is why EM-P2 is a
hard dependency rather than a nicety.

## §0S · ⛔ THE RETIREMENT OF THE DERIVED/HISTORY PATHS IS ITS OWN PACKET — measured, with the reason

The chair asked for the retirement as a MODIFY row here, **or** the measurement that says it
belongs elsewhere. It belongs elsewhere, and here is why:

```
$ git grep -n "EDITABLE_FIELDS\|isEditablePath" -- src | grep -v "^src/domain/userEdits.js"
src/domain/historyPreservation.js:68:import { EDITABLE_FIELDS } from './userEdits.js';
src/domain/historyPreservation.js:83:  (EDITABLE_FIELDS.settlement || []).filter(path => path.startsWith('history.')),
src/store/settlementPendingEdits.js:27:import { getEffectiveValue, isEditablePath } from '../domain/userEdits.js';
src/store/settlementPendingEdits.js:36:// EDITABLE_FIELDS (domain/userEdits.js) registers 25 prose paths across 7
src/store/settlementPendingEdits.js:65:// Kept in lockstep with EDITABLE_FIELDS by …
src/store/settlementPendingEdits.js:189:    if (!isEditablePath(payload.entityKind, payload.path)) {
src/store/settlementSlice.js:834:      if (!isEditablePath(kind, path)) return;  // strict registry gate
src/components/dossier/WorkbenchProseEditor.jsx:4: * Gives the 16 queue-wired EDITABLE_FIELDS prose paths their lever.
```

⛔ **`src/domain/historyPreservation.js:83` DERIVES ITS OWN BEHAVIOUR FROM THOSE ROWS**: it filters
`EDITABLE_FIELDS.settlement` for `history.*` to decide what `restoreAuthoredHistory` re-applies
after a history reroll. **Deleting the five `history.*` rows silently stops authored history
surviving a reroll** — a regeneration behaviour change, not a data edit. Beside it,
`settlementPendingEdits.js` keeps `QUEUE_WIRED_PROSE_PATHS` *"in lockstep with EDITABLE_FIELDS"*
(:36, :65) and `WorkbenchProseEditor.jsx` renders "the 16 queue-wired paths".

So retirement touches `userEdits.js` + `historyPreservation.js` (BEHAVIOUR) +
`settlementPendingEdits.js` (a register kept in lockstep) + a component — **four files, one of them
a regeneration behaviour change and one of them a surface.** That is a second behaviour family and
it breaks this packet's three-file budget. **Named as `EM-B4b`, sequenced with wave 4's surfaces**,
because the lever must leave the screen in the same wave the rows leave the registry — otherwise a
DM sees a pencil that writes nothing.

⭐ **The fold does not need the retirement.** It reads `_userEdits` and writes `dmLayer`; it is
correct whether or not the old lever still exists, and it is idempotent, so running it before and
after `EM-B4b` gives the same result.

---

## §1 · Reconciled authority

0. ⭐ **THE CHAIR'S AMENDMENT, 2026-09-19 — ODQ §934.44 addendum** (consist `2280742ab`; design
   §14 whole): the layer acts AT THE CHOOSER and holds ROOT keys only, so the fold classifies each
   inline edit root-or-derived and refuses the derived ones. §0.6 holds the re-measurement.
1. **ODQ §934.42** — the editor is built now, from the charter, at the consist tip.
2. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §12 — GOVERNS.** §12.13: "the Change Dock ships
   flag-off, so the editor REPLACES it rather than merging it, and the migration folds inline
   edits and Surveyor state only." §11: "existing saves' Change Dock pending changes and inline
   edits are folded into the registry (pending) and the layer (plain edits on drafts) by a
   governed migration through the observed-shape door, in lane B before any surface."
3. **`PACKET_STANDARD.md` "Ungated persistence"** — the normalization arm runs UNCONDITIONALLY;
   a flag may gate the feature it serves, never the normalization. Mirrored at
   `EM-PREAMBLE.md` §P5 (HZ-PERSIST-UNGATED).
4. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1 (the module-map row) and §3 (the persisted schema).
5. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, wave 1, row **EM-B4**.
6. Live git state at `d31af2cee`.

**Resolved contradictions**

- ARCH §3 "folds each save's existing Change Dock pending changes ... into `decrees`" vs design
  §12.13 "RETIRED, not merged" → **§12.13 governs** (the charter row already says so), and
  measurement makes the disagreement moot: the queue is session-only, so the input set is empty.
- The charter's "the Surveyor's review artifact shape" as a required symbol → the SHAPE exists
  (`reviewInterpretation`, `REVIEW_ACTIONS`, `ReviewOp`, `ReviewDecision`) but **no instance of it
  is ever persisted**, so it is named here as a preserved symbol and NOT as a migration input.
- `scripts/migrate-edit-registry.mjs` as the medium → **REFUTED; §0.2.** UNRESOLVED pending the
  chair's fork.
- "fold inline edits into the layer" → **UNRESOLVED; §0.1**, the EM-B2 ruling.

The implementer does not read other documents to reinterpret this packet.

## §2 · Outcome

**Observable result:** every existing save, on the first read after this lands, carries its
inline edits as the DM's layer — the record's values unchanged, `dmLayer` naming the fields the
DM owns — and carries them identically on every read thereafter.

**Definition of done:** the fold runs UNCONDITIONALLY on the save-read path; running it twice is
byte-identical to running it once; a save with no inline edits is returned referentially
unchanged; a `--check`-equivalent audit reports what would change without writing; and both
goldens are byte-identical.

**In scope**

1. the pure fold leaf (one primary behaviour);
2. one required integration — the existing per-read normalization chain in `src/lib/saves.js`;
3. one prevention guard — the idempotency-and-dormancy battery.

**Explicit non-goals**

- minting `dmLayer` / `decrees` as persisted keys, the denylists, the travel test, the
  observed-shape exemption row — **all EM-B3's**;
- the layer's own semantics — **EM-B2's**;
- retiring, merging or touching the Change Dock (`settlementPendingEdits*.js`,
  `SettlementWorkbench`) — design §12.13 RETIRES it, and retirement is a later surface act;
- touching the Surveyor's panel, `interpretReview.js` or its suites — **EM-D4's**;
- any `SCHEMA_VERSION` bump (fork G2, ⛔ moves 525 goldens);
- any flag, any surface, any tier gate;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

Figures are for fork **G1**. Forks G2 and G3 are refused in §0.4; G4 has no manifest here.

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | 0 (EM-B3 mints them) | ≤1 |
| Named state writers | 1 (the fold) | ≤1 |
| Feature flags | **0 — forbidden by the ungated-persistence law** | ≤1 |
| User-facing surfaces | 0 (headless) | ≤1 |
| Direct consumers | 1 (`src/lib/saves.js`'s read chain) | ≤2 |
| New logic-bearing production leaves | 1 | ≤2 |
| Existing logic-bearing production files modified | 1 | ≤3 |
| Additional registration-only files | 0 | ≤3 |
| Handwritten files total | 4 | ≤12 |
| New/changed effective production lines | ≤190 | ≤400 |
| Effective lines per new leaf | ≤170 | ≤250 |
| Delta in a shared/hot file | ≤8 (`src/lib/saves.js`, no baseline entry, 800 layer ceiling) | ≤15 |
| Acceptance cases | 7 | ≤8 |

Overrides approved before dispatch: `NONE`.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B4
```

Expected: exact packet Markdown and structured capsule emitted; ancestry and substrate proven;
CREATE targets absent; MODIFY targets clean; every §5 symbol resolving; foreign dirt fingerprinted.

**This packet is BLOCKED and may not be dispatched until (a) EM-B2's fork and (b) §0.4's fork are
both signed, and (c) EM-B3 has LANDED** — this packet writes keys B3 mints.

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| State authority (source) | `src/domain/userEdits.js` | `export function walkUserEdits` | the whole-tree iterator over every `entity._userEdits[path]` record in a settlement | The ONLY read path for the fold's input |
| Source record shape | `src/domain/userEdits.js` | `export function applyUserEdit` | writes the field and records `{ value, originalValue, editedAt }` under `_userEdits[path]`, then sets `_authored = true` | Read; ⛔ not modified until EM-B2's fork |
| Declared source paths | `src/domain/userEdits.js` | `export const EDITABLE_FIELDS` | 6 entity types + 14 settlement-root prose paths; `npc` carries `goal.short`, `secret.what`, `personality`, `role` | The fold's closed input denominator |
| Integration seam | `src/lib/saves.js` | `export const saves` | the save service; `localLoad` chains `.map(migrateSaveToV2).map(migrateSettlementShape)` on every load, and `migrateSaveToV2` is applied on every read AND write path | The ONE unconditional seat for the fold |
| Migration contract | `src/domain/settlementMigrations.js` | `export function migrateSettlementToLatest` | pure, append-only chain, `to === from + 1`, idempotent on an already-current settlement, non-mutating, safe on null / non-object | Copy this contract's shape; ⛔ do NOT append to the chain under fork G1 |
| Chain integrity | `src/domain/settlementMigrations.js` | `export function listMigrations` / `export function diagnoseMigrationChain` | expose and validate the chain; exactly ONE entry today, `{ from: 0, to: 1 }` | Preserve |
| ⛔ Version stamp | `src/domain/settlement.schema.js` | `export const SCHEMA_VERSION` | `1`. Stamped into every settlement at `normalizeSettlement.js:167`, which the pipeline runs at `assembleSettlement.js:324`, whose output the golden hashes | **NEVER BUMPED BY THIS PACKET** — a bump re-records all 525 golden rows |
| Save patch surface | `src/store/settlementSliceHelpers.js` | `export const SAVED_SETTLEMENT_PATCH_KEYS` | a frozen 17-key list; `'settlement'` is a member and no queue key is | `dmLayer` rides inside the settlement blob; this list is NOT widened |
| Device persistence | `src/store/persistProjection.js` | `export function partializeStoreState` | returns exactly nine keys; `pendingEditsQueue` is NOT among them | The proof that the Change Dock's queue is session-only |
| Change Dock queue | `src/store/settlementPendingEdits.js` | `export function queuePendingEdit` | appends to `draft.pendingEditsQueue`, which no persistence surface carries | Read-only evidence; ⛔ NOT retired, merged or touched here |
| Surveyor artifact | `src/domain/intent/interpretReview.js` | `export function reviewInterpretation` | pure; returns `{ accepted: [{index, op}], blocked: [{index, reason:'needs_consent'}], corrections: [{index, class}] }` over `ReviewOp` / `ReviewDecision` | The shape is preserved; ⛔ **no instance is persisted**, so it is NOT an input |
| Surveyor vocabulary | `src/domain/intent/interpretReview.js` | `export const REVIEW_ACTIONS` | `['approve','edit','reject','pending']` | Preserve; EM-D4's, not this packet's |
| Test precedent (migration) | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migrateSettlementToLatest behavior')` › `it('is idempotent on an already-current settlement')`, `it('does not mutate the input')`, `it('returns the same value for null / non-object inputs (no crash)')` | flat literal registration; the estate's own migration proof shape | Copy this shape |
| Test precedent (chain) | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migration chain integrity')` › `it('every migration increments version by exactly 1')` | a structural arm over the declared chain | Copy for A7 |
| Test precedent (scripts) | `tests/scripts/implementationPackets.test.js` | `describe('IA-1 implementation packet manifest and capsule')` › `it('fails closed on unknown status and duplicate packet identity or paths')` | the estate's fail-closed CLI-arm idiom | Copy only if the chair signs a fork with a CLI arm |

**Forbidden alternatives**

- no second fold path, no second reader of `_userEdits`, no second save-read chain;
- ⛔ no `SCHEMA_VERSION` bump and no new `MIGRATIONS` entry under fork G1;
- ⛔ no flag, no conditional, no env gate around the normalization arm — it runs unconditionally;
- no edits to `src/store/persistProjection.js`, `publicSafe.js`, `worldSnapshotPublic.js`, any
  denylist mirror, or `scripts/check-observed-shape-readers.mjs` — **all EM-B3's**;
- no edits to `src/store/settlementPendingEdits*.js` or `SettlementWorkbench` (the Change Dock
  is RETIRED by a later surface act, never merged here);
- no edits to `src/components/surveyor/**` or `src/domain/intent/**` (EM-D4's);
- no file outside the §7 manifest.

## §6 · Exact contracts

⛔ **THE SIGNATURES BELOW ARE WRITTEN FOR FORK G1.** Under G3 they become a CLI's argv contract;
under G4 they do not exist. The `dmLayer` TARGET shape is EM-B2's and the persisted keys are
EM-B3's; this packet only moves data into them.

### Inputs and outputs

```js
/**
 * Fold a settlement's existing inline edits into the DM's layer. PURE; the argument is never
 * mutated. UNCONDITIONAL — no flag, no env read, no conditional arm (PACKET_STANDARD
 * "Ungated persistence").
 * @param {unknown} settlement any saved settlement blob, of any age
 * @returns {unknown} the settlement, or a NEW settlement carrying `dmLayer`
 *
 * TOTALITY AND THE NO-DRAW CASE, both exact:
 *   - a non-object, null or undefined argument is returned REFERENTIALLY unchanged;
 *   - a settlement with no `_userEdits` anywhere is returned REFERENTIALLY unchanged
 *     (=== the argument) and NO `dmLayer` key is created — absence stays absence;
 *   - a settlement already carrying `dmLayer` has every already-owned field LEFT ALONE; only
 *     fields present in `_userEdits` and absent from the layer are added. This is what makes
 *     the second run byte-identical to the first.
 */
export function foldInlineEditsIntoLayer(settlement);

/**
 * The audit arm — the `--check` the charter asks for, as a pure function rather than a CLI.
 * @param {unknown} settlement
 * @returns {{ wouldAdd: string[], alreadyOwned: string[], unfoldable: string[] }}
 *   Three ASCII-ascending, deduplicated lists of `"<entityId>.<field>"`. `unfoldable` holds a
 *   record whose enclosing entity carries no resolvable id. Reading is never writing: this
 *   function returns the same three lists however many times it is called.
 */
export function auditInlineEditFold(settlement);
```

### State schema

Written: `settlement.dmLayer`, exactly EM-B2's `DmLayer`. Per folded field,
`layer.entities[entityId][field]` receives the record's `originalValue` from
`_userEdits[path]` — the ENGINE's value — because the record already carries the DM's value
(`applyUserEdit` wrote it in place). ⛔ `minted` and `phantoms` are materialized EMPTY and never
populated by this packet.

**Absence rules**

- **absent** `_userEdits`: nothing to fold; the settlement is returned `===` the argument.
- **empty** `_userEdits: {}`: identical to absent. Never normalized away.
- **`null`** at either key: read as absent; never written.
- **invalid legacy input**: a `_userEdits` value that is not an object, or a record missing
  `originalValue`, is listed in `unfoldable` and SKIPPED. Never a throw, never a guess.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| no `dmLayer`, `_userEdits` present | first save read after landing | the entity id resolves | a NEW settlement with `dmLayer.entities[id][field] = originalValue` | `wouldAdd` listed it |
| `dmLayer` present, field already owned | any later read | — | unchanged; the existing original is KEPT | `alreadyOwned` |
| no `_userEdits` anywhere | any read | — | `===` the argument; no key created | all three lists empty |
| `_userEdits` record with no resolvable entity id | any read | — | skipped | `unfoldable` |
| non-object / null / undefined | any read | — | `===` the argument | all three lists empty |

### Ordering and precedence

- **Pipeline position:** inside `src/lib/saves.js`'s existing per-load chain, AFTER
  `migrateSaveToV2` and `migrateSettlementShape` (the settlement must already be at its current
  shape before its edits are read) and BEFORE the entry reaches any caller.
- **Same-tick visibility:** the folded layer is visible to the first reader of that load.
- **Merge/replace:** ADD-ONLY. An existing layer entry is never replaced — that single rule is
  what makes A3's idempotency exact.
- **Tie-break:** none; one `_userEdits` path maps to one layer field.

### Determinism

- **Hash/fork key:** `NONE` — the fold mints no id. Any id it needs comes from the record.
- **Stable enumeration:** all three audit lists ASCII-ascending on `"<entityId>.<field>"`.
- **Rounding/clamping:** none.
- **No-draw behaviour:** the settlement is returned referentially unchanged (above).

### Flag and dormancy

- **Flag:** ⛔ `NONE`, and a flag here is FORBIDDEN, not merely unnecessary
  (`PACKET_STANDARD.md` "Ungated persistence"; `EM-PREAMBLE.md` HZ-PERSIST-UNGATED). A flag may
  gate the editor; it may never gate this arm.
- **Golden posture:** **UNCHANGED.** Both fixtures byte-identical. The fold touches saves only;
  generation never produces `_userEdits`, so no corpus settlement can enter it. ⛔ The commands
  `UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js` and any
  re-record of `tests/fixtures/dossier-prose-manifest-golden.json` are FORBIDDEN to this packet.
  ⛔ `SCHEMA_VERSION` is NOT bumped: measured, a bump moves all 525 rows (§0.4, evidence §E6).

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| the fold CREATES `dmLayer` on a save that has inline edits and none before; it creates nothing on a save with no edits | the audit arm reads and never writes; the fold is the only writer | ⛔ EM-B3 partializes the key. This packet writes into the in-memory entry the save service returns; the durable write is the save path's existing one | the fold runs again on every reload and is a fixpoint after the first (A3) | EM-B2's `reapplyLayer` carries the folded fields through a regeneration; this packet adds no regeneration behaviour | ⛔ WITHHELD by EM-B2's fork: whether folding CLEARS the source `_userEdits` (fork F1) or leaves it standing (F2/F3) is the same ruling | **THIS PACKET** is the migrate step. Design §11: edits do not travel, so an IMPORTED settlement arrives with no `_userEdits` and the fold is a no-op on it by construction | ⛔ EM-B3 names both keys in `publicSafe` and `worldSnapshotPublic`. This packet emits no projection |

### Receipts and privacy

- **Closed kinds:** the audit's three list names — `wouldAdd`, `alreadyOwned`, `unfoldable`.
- **Address chain:** `"<entityId>.<field>"`.
- **Numeric-to-word bands:** `NONE` — nothing rendered, so nothing owed to prose-numerics.
- **DM-only fields:** the whole layer; its projection rule is EM-B3's.
- **Player/public projection:** `NONE` in this packet.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY`.
- **Edit story:** `ENGINE-ONLY` — a migration has no DM verb. It runs on a save read, whether or
  not anyone is in edit mode.

## §7 · Exact change manifest

⛔ Valid for fork **G1** only.

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/foldInlineEdits.js` | `foldInlineEditsIntoLayer`, `auditInlineEditFold` | 170 eff | Write the pure leaf at §6's exact signatures. Read `_userEdits` only through `walkUserEdits`; never re-implement the walk. No flag, no env read, no conditional arm. Zero imports from `src/components`; strict-typecheck clean. |
| `MODIFY` | `src/lib/saves.js` | the load chain that already reads `.map(migrateSaveToV2).map(migrateSettlementShape)` | +8 eff | Add the fold to the chain, AFTER both existing steps, on every read path — not on one. ⛔ Unconditional: no flag, no `if`. The file carries no `scripts/.size-baseline.json` entry and sits under the 800 layer ceiling. |
| `CREATE` | `tests/domain/foldInlineEdits.test.js` | A1–A5, A7 | n/a | Copy the proof shape of `tests/domain/settlementMigrations.test.js` (`describe('Tier 1.4 — migrateSettlementToLatest behavior')`'s idempotency, non-mutation and nullish arms). Flat literal `it(...)` only — no `.each`, no loops, no conditionals, no nested describes (`EM-PREAMBLE.md` §P3.4). |
| `TEST` | `tests/store/lifecycleRoundTrip.test.js` | one arm in `describe('E-C saves envelope — the local substrate: save, import (list), fixpoint, update')` | n/a | A6: the REAL save → list → writeAll → list hop over a settlement carrying inline edits is a byte-exact fixpoint with the layer folded. Already-credited file, so it adds no lighting-census file row. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json`, regenerated, NEVER hand-edited:

```sh
LIGHTING_CENSUS_REFREEZE='EM-B4' LIGHTING_CENSUS_NOTE='EM-B4: one new test file (the inline-edit fold)' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

**Predicted INTERIOR RED:** the lighting census moves `2645 / 383 / 2262 / 25009 / 6670` →
**`2646 / 383 / 2263 / <25009 + the file's literal titles> / <6670 + its literal suite titles>`**
— `+1 file, +0 parked, +1 credited`, the title figures exact once the file is written and counted
by execution. ⚠ THE CAUSE IS THE ONE NEW **TEST** FILE, not `src/domain/edit/foldInlineEdits.js`:
the walker walks `tests/` only (`EM-B2.evidence.md` §E7a; `EM-PREAMBLE.md` §P2.1 is wrong).

**Registers that DO NOT move, measured rather than assumed:**
`scripts/mutation-coverage-manifest.json` — `tests/domain/foldInlineEdits.test.js` matches no
`NAME_PATTERN` token and `tests/domain` is not one of the eight `ENFORCER_DIRS`, and the manifest
holds ZERO `tests/scripts` rows today for the same reason, so **no row is owed**.
`scripts/check-writer-reach.mjs` — no customer surface and no new written identity; neither
`--write` nor a mint. `scripts/check-observed-shape-readers.mjs` — the `dmLayer` exemption is
EM-B3's chair act at EM-B3's own door. `scripts/.size-baseline.json` — `src/lib/saves.js` has no
entry. `tests/lint/proseNumerics.test.js` — nothing rendered. The five edge-shared bundles —
neither changed file is in any closure.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Refuse to start while BLOCKED.**
1. Capture the baseline: both golden fixtures' SHA-256; the lighting tuple; `SCHEMA_VERSION`
   (expect `1`) and `listMigrations().length` (expect `1`).
2. Add the failing tests for A1–A7.
3. Implement `src/domain/edit/foldInlineEdits.js`.
4. Wire the ONE consumer: the fold into `src/lib/saves.js`'s load chain, unconditionally.
5. (no registrations owed — see §7.)
6. Regenerate the lighting baseline with the §7 command; re-run the walker plainly for the green.
7. Run the focused verification of §10.
8. Under the train, the bare full gate and the boot smoke move to the terminal; write §12.

**Bounded algorithm — `foldInlineEditsIntoLayer`**

```text
1. If the argument is not a plain object, return it REFERENTIALLY.
2. Collect every (entityId, field, originalValue) via walkUserEdits, ASCII-ascending.
   A record whose enclosing entity has no resolvable id, or which lacks `originalValue`,
   is SKIPPED and listed `unfoldable`. Never guess an id; never throw.
3. If the collection is empty, return the argument REFERENTIALLY. Create no `dmLayer`.
4. Start from the settlement's existing `dmLayer` when it is a valid DmLayer, else from
   EM-B2's EMPTY_DM_LAYER. Materialize `minted` and `phantoms` empty.
5. For each collected field: if `entities[id][field]` already exists, LEAVE IT (this is the
   fixpoint rule); otherwise set it to `originalValue`.
6. Return a NEW settlement carrying the new layer. Mutate nothing.
```

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | a saved settlement carrying three `_userEdits` records across two entities | `dmLayer.entities` holds all three, each at the record's `originalValue`; the record's own field values are UNTOUCHED; the argument is not mutated | `tests/domain/foldInlineEdits.test.js` |
| A2 | Dormant/absent | a settlement with no `_userEdits` anywhere; and `_userEdits: {}` | both are returned REFERENTIALLY unchanged (`===`) and NO `dmLayer` key is created — absence stays absence | `tests/domain/foldInlineEdits.test.js` |
| A3 | ⛔ Idempotency — THE FIXPOINT | run the fold twice, then three times | the second result is byte-identical to the first (`JSON.stringify` equality) and the third to the second; a field already owned in `dmLayer` keeps its ORIGINAL value and is never overwritten by a later `_userEdits` record | `tests/domain/foldInlineEdits.test.js` |
| A4 | Counterforce / malformed | `null`, `undefined`, a string, a number, a `_userEdits` value that is not an object, and a record missing `originalValue` | nothing throws; the four non-objects come back `===`; the two malformed records appear in `auditInlineEditFold().unfoldable` and are absent from `dmLayer` | `tests/domain/foldInlineEdits.test.js` |
| A5 | ⛔ The `--check` arm, as a reading that never writes, WITH THE ROOT/DERIVED CLASSIFIER | `auditInlineEditFold` on a mixed settlement: two root-foldable, one already owned, one malformed, and one DERIVED (e.g. `economicViability.summary`) | all FOUR lists — `wouldAdd`, `alreadyOwned`, `unfoldable`, `derivedRefused` — are the exact ASCII-ascending sets; the derived edit appears ONLY in `derivedRefused` and never in `dmLayer`; three calls return equal lists; **the settlement is byte-identical before and after** | `tests/domain/foldInlineEdits.test.js` |
| A6 | Lifecycle / real integration | the REAL `saves` service: save a settlement with inline edits → list → writeAll → list | the round trip is a byte-exact fixpoint and the layer is present and stable on both list hops; the fold ran on the read path without any flag being set | `tests/store/lifecycleRoundTrip.test.js` |
| A7 | ⛔ Privacy / regression — THE UNGATED AND UNVERSIONED PINS | a source scan of `src/domain/edit/foldInlineEdits.js` and the `src/lib/saves.js` call site, plus the two goldens and the chain | the fold's call site is reached on EVERY save-read path and sits inside NO conditional, flag read or env read; `SCHEMA_VERSION` is still `1`; `listMigrations()` still has ONE entry; `tests/fixtures/generator-golden-master.json` and `tests/fixtures/dossier-prose-manifest-golden.json` are byte-identical by SHA-256 | `tests/domain/foldInlineEdits.test.js` |

This table is the entire edge-case budget — **7 of 8**, one deliberately unused.

## §10 · Verification commands

```sh
# Focused static checks
npx eslint src/domain/edit/foldInlineEdits.js src/lib/saves.js tests/domain/foldInlineEdits.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Focused tests — ONE test directory per gated run, the slot held for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/foldInlineEdits.test.js tests/domain/settlementMigrations.test.js \
  tests/domain/userEdits.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/lifecycleRoundTrip.test.js tests/store/persistMerge.test.js

# The named golden proof
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# The moved instrument
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js

# Registers that must NOT move
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B4
npm run implementation:resume -- EM-B4
```

Every command exits `0`. A lane never runs `npm run check`; it pauses at a held gate per
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL. Report actual counts; never copy a historical count.

`tests/domain/userEdits.test.js` is named as an unchanged-behaviour control and is VERIFIED
present at this base (`git cat-file -e d31af2cee:tests/domain/userEdits.test.js` exits 0), as is
every other file named in the argv arrays above.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- **EM-B2's fork or §0.4's fork is unsigned, or EM-B3 has not LANDED** — this packet is BLOCKED;
- the fold would need to sit inside ANY conditional, flag read or env read;
- `SCHEMA_VERSION` would need bumping, or a `MIGRATIONS` entry appending;
- either golden fixture's SHA-256 moves by one byte;
- a second run of the fold is not byte-identical to the first;
- `_userEdits` or `_authored` would need clearing, rewriting or deleting (EM-B2's fork decides
  that, not this packet);
- the Change Dock, `settlementPendingEdits*.js` or the Surveyor's panel would need editing;
- any persisted key would need minting here, or any EM-B3 path would need editing;
- `scripts/check-observed-shape-readers.mjs` reports a NEW finding identity;
- a migration input beyond `_userEdits` is discovered (the charter named two that measure empty;
  a third is a premise change, not a widening);
- the lighting census moves by anything other than the predicted `+1 file / +0 parked /
  +1 credited`.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- The signed forks (EM-B2's, and §0.4's) quoted:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, `skipBlankLines` + `skipComments`):
- Acceptance cases A1–A7, executed and passed:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations (`typecheck:ratchet`, `typecheck:domain:strict`):
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after:
- `SCHEMA_VERSION` and `listMigrations().length` before and after:
- Lighting census tuple before and after, attributed PER FILE by execution:
- Generated artifacts: `NONE | tests/lint/.lighting-census-baseline.json`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
