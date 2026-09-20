# `settlement-editor / EM-R0c` — THE MERGE: the consequence of an edit is the difference of two re-derivations, applied to the record by consistency group

- **Status:** `DRAFT`
- **Packet version:** `1`
- **Verified base:** `__BASE__`
  > *Revalidation sentence for the chair:* re-measured against `claude/composite-r4` at
  > `32602dc607b7423838249cf57d73baf08feb047d`; the read tree's `status --short` was empty at the
  > start and the end of the compile; the inertness control reproduced the committed golden manifest
  > `b77b5909…c3ce` and a 25-row stride 25/25; every CREATE target is absent; every present
  > `requiredSymbols` row proved by `grep -cF` → 1.
- **Last revalidated:** `__BASE__` (the chair stamps the date and sha at promotion)
- **Depends on:** `EM-R0a` (the class register) · `EM-R0b` (`recordInvariants`, and see STOP-4) ·
  `EM-R0d` (the band ladders EM-R0b reads) · `EM-R6` (the `OrphanKind` vocabulary the delta carries) ·
  ⭐ `EM-R0f` — **NEW, proposed by this compile** (the economy fingerprint moved down a layer; §3)
- **Collision group:** `src/domain/edit/**` — serialize with **EM-R0a** (`recordRegister.js`) and
  **EM-R0b** (`recordInvariants.js`, `recordInvariantFlags.js`). No file is shared with any packet:
  the two CREATE paths are claimed by nothing in `PACKET_MANIFEST.json` or in the kit's
  `packets-waiting/`. `EM-R0f` alone touches `src/generators/power/economyReconciliation.js`.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured. The inertness control (evidence E-1), the identity arm (E-3), the
  504-trial corpus (E-4), the emitted-vs-measured equivalence (E-2), the budget under eslint's own
  `max-lines` (E-9) and the import graph (E-8) were all executed at
  `32602dc607b7423838249cf57d73baf08feb047d`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)
  > measured at this compile's tip: `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`

---

## 1. Reconciled authority

1. **The owner**, ODQ §934.36–§934.42: build the settlement editor now.
2. **THE PROMISE** — a seed is a starting world forever; lived history is immutable. This packet
   never merges and never recomputes HISTORY.
3. **Design §22.1** — the consequence of an edit is the DIFFERENCE between two re-derivations;
   **§22.2** (twelve items — the merge's law); **§22.3** (the receipt split by path; groups as
   `{ id, root, members }`; a collection under a cross-entry total is ATOMIC; cross-key checks ship);
   **§22.4** (the identity table: `npcs` by `id`, `institutions` and `factions` by `name`).
4. **The chair, 2026-09-19 20:16 (ODQ §934.60), the contract added from the pulse's data-loss
   defect:** `record′` is built FROM THE RECORD, and nothing present in the record and untouched by
   the edit may be absent from it. This packet carries it as an EXECUTED acceptance arm (A1), not a
   sentence: 0 record keys lost over 63 identity rows and over 504 edit trials (E-3, E-4).
5. **The charter's EM-R row for EM-R0c** and the amendments of 2026-09-19 18:30, 19:15, 19:29, 19:48,
   20:03, 20:16 and 20:34.
6. **The siblings, IMPORTED and never re-declared:** EM-R0a v2 (47 keys classed; KEYED 48 / ATOMIC
   15; six groups; the receipt MERGED, never recomputed), EM-R0b v2 (`recordInvariants`, 30 checks),
   EM-R0d v2 (the four ladder tables), EM-R6 v2/v3 (`OrphanKind`, a closed vocabulary of two).
7. **The code and the receipts at `32602dc60`** — `EM-R0c.evidence.md`, every row a quoted command.

**Resolved contradictions**

- *§22.2 item 4: "if [the order rule's second arm] never [fires], it is built as a counted diagnostic
  … not a silent branch."* → **It FIRES: 52 of 504 trials, five collections, 67 firings** (E-4.4).
  It ships as a real branch AND as a counted row in `delta.orderMoved`.
- *EM-R0a v2 slotted two findings to this compile.* → **Both answered.** (a) The generation receipt
  is MERGED, never recomputed; the ONE declared RECEIPT is recomputed, and taking `R1`'s digest
  instead is WRONG for the merged record in 31 of 315 trials (E-6). (b) The two ORDER-BEARING history
  collections need no declaration: each fires the second arm exactly once in 504 trials, which the
  general three-way order rule already carries (E-4.4).
- *The recon justified the chain partly because the batch path produced the `isSecure` conviction.*
  → With the GROUP rule on, **neither path is convicted**; the chain stands on §22.2 item 6's own
  ground — an edit is an event in order — and on the measured 18-leaf divergence (E-5).
- *The shared brief: "a new `src/domain/**` file moves the lighting census's file count."* → The
  PREAMBLE governs (§P2.1, and the chair's correction of 2026-09-19): the census counts TEST files;
  **a new `src/` leaf moves nothing** (E-11).
- *`LANE-EM-COMPILE-2.md` quotes preamble SHA-256 `1cf54427…`.* → measured at this tip:
  `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` (E-11).

The implementer does not read other documents to reinterpret this packet.

---

## 2. Outcome

**Observable result:** a PURE module family under `src/domain/edit/` whose single public function,
`mergeConsequence(record, R0, R1, { edit, base }) → { record, delta }`, turns one edit's two
re-derivations into the new saved record and the delta card's three-valued account of what moved —
built FROM the record, by consistency group, with mirrors and the receipt recomputed and the town's
own invariants standing guard.

**Definition of done:** over the 63-row structured sample and all eight edits on all six tiers
(504 trials): every edit sticks, the settlement's name is kept, no caller record is mutated, **no
record key is lost**, no untouched HELD or AUTHORED subtree moves except the two the register exempts
by CLASS, and `recordInvariants` is clean with **ZERO escalations** — each arm executed, not argued.

**In scope**

1. **The pure tree merge** (§22.2 items 1, 2, 4, 5): compare and short-circuit at every NODE with
   ABSENT as a value; a declared CONSISTENCY GROUP moves WHOLE; a keyed collection merges by its
   DECLARED key; a keyless collection, a key-broken one, a collection under a cross-entry total and
   an array of scalars are ONE value; **nothing is ever merged by position**; ORDER is a reading
   merged three-way, its second arm counted.
2. **The post-passes and the delta** (§22.2 items 3, 7, 8, 12): MIRRORS recomputed after the merge,
   never merged; the one declared RECEIPT recomputed LAST over the merged record; HISTORY and
   AUTHORED untouched by CLASS; the runtime guard with its deterministic three-step escalation; the
   delta carrying, per moved reading, what it read BEFORE, what it reads NOW and what THE EDIT ALONE
   accounts for, plus `orderMoved`, `escalations` and EM-R6's `orphaned` entries.
3. **The prevention guard: THE CHAIN IS THE SEMANTICS** (§22.2 item 6). The module exports ONE merge
   function, it takes ONE edit, an ARRAY THROWS, and the chain is expressed in the RETURN
   (`delta.nextBase` is `R1`, which is the next edit's `R0`). A batch call is not merely discouraged:
   there is no exported symbol that accepts more than one edit, and the one that looks like it
   might refuses with a message that names the law.

**Explicit non-goals**

- The re-derivation itself (EM-R1–EM-R5). This packet takes `R0` and `R1` as ARGUMENTS and calls
  nothing that generates.
- Any caller. Nothing in `src/` imports these leaves when this packet lands; **EM-B2a** is the first,
  and the dynamic-import obligation and the byte price fall on its pre-proof (E-8).
- The corpus ratchet over the real seam — **EM-R7**, the family's terminal proof.
- Renormalising the power card's total (§22.2 item 8 — the OP's, not the merge's), the removal
  cascade (EM-R6), the newcomer's sixteen fields (§22.2 item 9), the trace partition (§22.2 item 11),
  and the delta CARD's wording (EM-D*). This packet supplies the numbers; it renders nothing.
- ⛔ Moving the economy fingerprint down a layer — **EM-R0f**, the split this compile takes (§3).

---

## 3. Hard scope budget

| Limit | This packet | Measured |
|---|---:|---|
| one behaviour family | the merge | — |
| new persisted record family | **0** | persists nothing; a pure function |
| named writer per state | **0** | writes no state; returns a value |
| feature flag | **0** | wave 1 is headless |
| user-facing surface | **0** | renders nothing |
| direct production consumers | **0 at landing** (EM-B2a is the first) | E-8(c): 0 importers in `src/` |
| new logic-bearing leaves ≤ 2 | **2** | E-9 |
| existing logic files modified ≤ 3 | **0** | `changeManifest` carries no MODIFY row |
| registration-only files touched ≤ 3 | **0** | §7 |
| handwritten files ≤ 12 | **3** (2 production + 1 test) | §7 |
| new/changed effective production lines ≤ 400 | **294** | E-9 |
| each new leaf ≤ 250 effective | `recordMergeTree.js` **166** · `mergeConsequence.js` **128** | E-9 |
| shared / hot-file delta ≤ 15 effective | **n/a** — this packet names no hot file and modifies none | §7 |
| acceptance cases ≤ 8 | **8** | §9 |

Counted with eslint's own rule, in process: `max-lines` with `{ skipBlankLines: true, skipComments:
true }` — the rule every ceiling in `eslint.config.js` uses.

### ⛔ 3.1 THE SPLIT THIS COMPILE TAKES, and who waits on which

**The merge itself fits in two leaves and did not need splitting.** One thing does not fit, and it is
not the merge:

`recomputeReceipts` must call `fingerprintPowerEconomyInput`, and taking `R1`'s digest instead is
measurably WRONG for the merged record in **31 of 315 trials** (E-6) — wherever a declared group kept
the record's own economy, `R1`'s digest digests inputs the merged record does not hold. That symbol
lives at `src/generators/power/economyReconciliation.js:100`, and
`tests/build/domainGeneratorsBoundary.test.js` freezes the `src/domain` → `src/generators` edge set
at **four files / five edges, shrink-only**. A `src/domain/edit/` leaf importing it is a FIFTH file
and the ratchet reds (E-7).

Three shapes were weighed and two are refused by measurement or by law:

| shape | verdict |
|---|---|
| take `R1`'s fingerprint | ⛔ REFUTED by execution: wrong in 31/315 (E-6) |
| re-implement the digest inside `src/domain/edit/` | ⛔ REFUSED: it would spell one fact twice — the version constant, the four-field tuple and the hash — which is the exact defect FIX-D2 exists to unify |
| **move the leaf DOWN a layer** | ⭐ TAKEN. It is the ratchet's own written instruction (*"pushing the shared leaves DOWN into a layer both can import"*) and EM-R0d's accepted precedent (`src/data/bandLadders.js`; 96 `src/domain` files already import `src/data` directly) |

Folding that move into this packet would make **three** new logic leaves and break the standard's
`≤ 2` cap — which *"the agent may not quietly renegotiate"*. So it is proposed as its own member:

> **EM-R0f (NEW, proposed): the economy fingerprint moves to `src/data/economyFingerprint.js`.**
> CREATE the leaf carrying `ECONOMY_FINGERPRINT_VERSION` (`economyReconciliation.js:37`),
> `economyProjectionInput` (`:85–91`) and `fingerprintPowerEconomyInput` (`:100–111`), importing
> `fnv1a32` from `src/kernel/proseHash.js` (which `src/data/` already imports in five files);
> MODIFY `economyReconciliation.js` to import it and keep a forwarding export so the text
> `export function fingerprintPowerEconomyInput` is preserved verbatim (else a `retiredSymbols` row
> is owed). About **15 effective lines, one leaf, one MODIFY.** Golden-neutral: the same code, one
> module boundary further down; the generation worker already carries both the function and
> `proseHash.js` (E-8(b)), so its bytes move by the module wrapper alone — priced at EM-R0f's own
> pre-proof against the zero-slack ceiling. **The discharge is measured:** the one LANDED packet with
> a `requiredSymbols` row on that file (EP-0) names a symbol inside `createPowerGenerationIntent`
> (line 118+), below the moved region (E-7). ⛔ EM-R0f is also the one MODIFY in this neighbourhood,
> so it — not EM-R0c — carries the prose-numerics line-addressing sweep, the `wiring-census.json`
> `stamp.files` check and the `path:line` citation sweep.

**Who waits on which**

| waits on | why |
|---|---|
| **EM-R0c waits on EM-R0f** | `recomputeReceipts` imports it; without it the boundary ratchet reds |
| **EM-R0c waits on EM-R0a, EM-R0b, EM-R0d** | it imports the register and the invariants and re-declares neither; EM-R0b reads EM-R0d's ladders |
| **EM-B2a waits on EM-R0c** | the store path that first calls the merge; it owes the dynamic import and the byte price |
| **EM-B2b waits on EM-R0c** | the isolation property reads the delta |
| **EM-R7 waits on EM-R0c + the seam (EM-R1–R5)** | the corpus ratchet runs the merge over the REAL re-derivation |
| **the delta card (EM-D\*) waits on EM-R0c** | `delta.readings`' three values are what it renders |
| **EM-R6 does NOT wait on EM-R0c** | the delta carries its `orphaned` rows verbatim and judges nothing |

---

## 4. Sealed dispatch and preflight

`scripts/implementation-session.mjs`, check by check, as it would read at `__BASE__`:

1. **Branch name** — the implementation branch the chair cuts; the worktree holds the verified
   branch (the sealed dispatch throws `branch mismatch` from a lane branch).
2. **Ancestry** — `__BASE__` is an ancestor of the branch tip.
3. **Substrate unchanged since the verified base** — this packet's substrate is
   `src/domain/edit/recordRegister.js`, `src/domain/edit/recordInvariants.js` and
   `src/data/economyFingerprint.js`; all three land with EM-R0a, EM-R0b and EM-R0f BEFORE this base
   is stamped, so the chair must stamp `__BASE__` at or after those three landings.
4. **CREATE targets absent** — `src/domain/edit/mergeConsequence.js`,
   `src/domain/edit/recordMergeTree.js` and `tests/domain/recordMerge.test.js` are absent at
   `32602dc60` and this packet is the only claimant (E-12).
5. **git-clean** — the build lane's own worktree.

**Generators among `checks`: NONE.** No command in §10 writes a file, so §P2.12's "a generator goes
LAST" has nothing to order and no generated artifact is owed. Edge-shared INPUT MEMBERSHIP measured
against all five metas' own `inputs` lists: **none** (E-8).

---

## 5. Verified tree contract

| # | Fact | Where | Proof |
|---|---|---|---|
| V1 | `src/domain/edit/` does not exist | `src/domain/` | `git ls-files -- 'src/domain/edit/*'` → 0 (E-8) |
| V2 | nothing in `src/` imports `src/domain/edit/**` | whole `src/` walk | E-8(c): 0 importers ⇒ in NO emitted chunk |
| V3 | the eager first-paint closure is 268 modules and holds 0 `src/domain/edit/**` files | `vite.config.js#EAGER_FIRST_PAINT_MODULES`, read from the file itself | E-8(a) |
| V4 | the generation worker's static closure is 220 modules and holds 0 `src/domain/edit/**` files | `src/workers/generation.worker.js` | E-8(b) |
| V5 | `fingerprintPowerEconomyInput` is exported from `src/generators/power/economyReconciliation.js` | `:100` | `grep -cF` → 1 (E-12) |
| V6 | the domain→generators ratchet's baseline is 4 files / 5 edges, shrink-only, and the live set is 4 | `tests/build/domainGeneratorsBoundary.test.js#BASELINE_EDGES` | E-7 |
| V7 | the fingerprint's three members are private to one file | `:37`, `:85`, `:100` | `git grep -n` (E-7) |
| V8 | EM-R0b's `Violation` is `{ id, path, message, kind }` and the module exports no per-check metadata | `packets-waiting/EM-R0b.md:316`, `:302` | E-13 — **STOP-4** |
| V9 | `tests/domain/` is not a mutation-coverage enforcer dir and `recordMerge` matches no NAME_PATTERN token | `tests/lint/mutationCoverage.shared.mjs:36–50` | E-11 |
| V10 | the lighting census counts TEST files, not `src/` leaves | `EM-PREAMBLE.md` §P2.1 | E-11 |
| V11 | `tsconfig.domain-strict.json` covers `src/domain/**` and its debt baseline can only shrink | `scripts/check-domain-strict.mjs:11,40,138` | E-11 — **STOP-3** |
| V12 | EP-0 (LANDED) holds one `requiredSymbols` row on `economyReconciliation.js`, for a symbol below the moved region | `PACKET_MANIFEST.json` | E-7, E-12 |
| V13 | the emitted leaves are byte-for-byte the measured function | 567 trials | E-2 |

---

## 6. Exact contracts

### Inputs and outputs

```js
// src/domain/edit/recordMergeTree.js — PURE. No store, PRNG, clock, locale, I/O.
// ⛔ NO src/generators import, NO src/components import.
import {
  RECORD_CLASSES, CLASS_EXCEPTIONS, KEYED_COLLECTIONS, ATOMIC_COLLECTIONS, CONSISTENCY_GROUPS,
} from './recordRegister.js';

export const collapse = (path) => path.replace(/\[\d+\]/g, '[]');
export function newReceipts();          // the accounting shape, below
export function mergeTree(record, R0, R1);  // -> { value, receipts }
export const __internals = { at, put, mergeNode, collapse };
```

```js
// src/domain/edit/mergeConsequence.js — PURE. The post-passes, the guard and the delta.
import { CLASS_EXCEPTIONS, RECORD_CLASSES, CONSISTENCY_GROUPS } from './recordRegister.js';
import { recordInvariants, CHECK_META } from './recordInvariants.js';
import { fingerprintPowerEconomyInput } from '../../data/economyFingerprint.js';
import { mergeTree, __internals } from './recordMergeTree.js';

export function recomputeMirrors(merged);      // -> number of members rewritten
export function recomputeReceipts(merged);     // -> boolean, whether the digest moved
export function enclosingGroup(path);          // -> the SMALLEST declared group, or null
export function guardMergedRecord(merged, R1, exempt);  // -> escalation rows
export function mergeConsequence(record, R0, R1, options);  // -> { record, delta }
```

- `record` — **THE WRITE BASE**: the saved record with the op's own writes already applied.
- `R0` — `rederive(base)`; `R1` — `rederive(record)`. Both are ARGUMENTS; this module generates
  nothing.
- `options.edit` — `{ id, opType, touched?, orphaned? }` or `null`. **An ARRAY throws `TypeError`.**
- `options.base` — the record before the edit (the store's snapshot); defaults to `record`.

### State schema

**No state, no persisted key, no new record family.** The module holds nothing between calls and
writes nothing. `delta` is a return value, never stored by this packet.

### Transition table — the node rule, in the order it is applied

| the node at path `p` | rule | source |
|---|---|---|
| `collapse(p)` is a `CLASS_EXCEPTIONS` HISTORY or AUTHORED path | keep the record's, whole | §22.2 item 7 |
| `R0` and `R1` are deep-equal | keep the RECORD's own value — **including ABSENT** | §22.2 item 1 |
| `collapse(p)` is a declared group root and either side is an object | the group moves WHOLE: `R1`'s if any member differs, else the record's; a `members` list moves as ONE value over a node-rule rebuild that preserves key order | §22.2 item 2, §22.3 item 2 |
| both sides are arrays and `collapse(p)` is a declared KEYED collection not also declared ATOMIC | merge by the DECLARED key; see the order rule | §22.2 item 5, §22.4 |
| both sides are arrays otherwise (keyless, ATOMIC, a cross-entry total, an array of scalars) | ONE value: `R1`'s | §22.2 item 5, §22.3 item 3 |
| a declared key is absent or non-unique in any of the three arrays | the collection degrades to ONE value and the refusal is recorded in `receipts.keyBroken` | §22.2 item 5 |
| both sides are objects | recurse over the union of keys, `R0`'s order first | §22.2 item 1 |
| otherwise (a differing leaf) | take `R1`'s, and record the path in `receipts.taken` | §22.1 |

At the TOP level, before the node rule: a key whose class is `WORLD` takes `R1`'s (it is the input);
a key whose class is **anything other than `READING`** — HELD, AUTHORED, HISTORY, CONSTANT, or
unknown — is taken from the RECORD untouched. ⛔ **A key present in `record` is present in the
result, whatever the two re-derivations carry.**

### Ordering and precedence

1. `mergeTree` — the whole tree, once.
2. `recomputeMirrors` — every `CLASS_EXCEPTIONS` MIRROR path, from the merged roster. A member whose
   `id` the merged roster no longer carries is left exactly as the record has it (removing a person
   is the op's cascade, never the merge's).
3. `recomputeReceipts` — the declared RECEIPT, **LAST**, over the merged record.
4. `guardMergedRecord` — `recordInvariants(merged)` minus the EXEMPT set (every violation the
   pre-edit record, the edited record or `R1` already carries). Each surviving violation escalates:
   **step 1** the enclosing declared group from `R1` (or, for a cross-key check, BOTH its keys);
   **step 2** the violated path's top-level key(s) from `R1`; **step 3** every READING key from `R1`.
   The receipt is recomputed after every escalation step. It terminates because a generated world
   agrees with itself; an exhausted ladder is recorded as `step: 'EXHAUSTED'` and never loops.

**The order rule, both arms.** Let the COMMON entries be those keyed in all three. If their relative
order is the same in `R0` and `R1`, **the record's order stands**: an entry only the record carries
keeps its place, and an addition takes the place of its `R1` neighbour. If `R0`'s and `R1`'s common
order DIFFERS — the edit moved the order — **`R1`'s order governs**, entries only the record carries
are appended, and the collection's collapsed path is pushed to `delta.orderMoved`.

### Determinism

Hash / fork key **NONE**. No PRNG, no clock, no locale, no environment, no `Math.random`, no
`Date`, no `Intl`. Every iteration order is derived from the arguments' own key order and from the
register's declaration order; every set is built from those, never from a hash of unordered input.
`structuredClone` on entry and on every value written out: **0 of 504 caller records mutated** and
0 of 63 on the identity arm (E-3, E-4).

### Flag and dormancy

Flag **NONE**. Wave 1 is headless. Dormancy is structural, not conditional: nothing in `src/` imports
these leaves until EM-B2a does, so the code is unreachable rather than switched off (E-8).

### Lifecycle

| path | behaviour |
|---|---|
| create | the merge returns a value; the op and the store persist it |
| read | none; the module reads only its three arguments |
| persist | **nothing** — no new key, no schema change |
| reload | nothing; the merged record is an ordinary saved record |
| regenerate | untouched; fresh generation never calls this module |
| undo | **the store's snapshot, never an inverse merge** (§22.1) |
| import / fork / gallery | edits do not travel (HZ-TRAVEL); this module is not on those paths |
| migrate | none owed; no persisted shape moves |
| public veil | none; the module renders nothing and reads no save-time key |

### Receipts and privacy

`delta` carries: `appliedEdit` (a string or `null`, **never an array**); `readings[]` of
`{ path, before, now, editAlone: { from, to } }`; `orderMoved[]`; `escalations[]`;
`orphaned[]` (EM-R6's rows, carried VERBATIM — the writer reports, the guard engine judges);
`groupsTaken[]`; `groupsKept`; `honesty: { taken, rideAlong }`; `nextBase` (which is `R1`, the next
edit's `R0`). No PII, no seed, no prose. The delta is not persisted by this packet.

### Alignment and edit story

Alignment: `DECLARED EMPTY.` Edit story: `ENGINE-ONLY: this packet computes the consequence of an
edit; it exposes no DM verb and renders no card.`

---

## 7. Exact change manifest

| action | path | symbols | bound | note |
|---|---|---|---|---|
| `CREATE` | `src/domain/edit/recordMergeTree.js` | `mergeTree`, `newReceipts`, `collapse`, `__internals` | `≤ 250` effective | The pure tree merge: the node rule, groups, keyed collections, ATOMIC, order. **Import only `./recordRegister.js`.** Declare no class, no key, no group. The emitted draft measures **166** effective lines (E-9). |
| `CREATE` | `src/domain/edit/mergeConsequence.js` | `mergeConsequence`, `recomputeMirrors`, `recomputeReceipts`, `enclosingGroup`, `guardMergedRecord` | `≤ 250` effective | The post-passes, the guard and the delta, plus the ONE public surface. Imports `./recordRegister.js`, `./recordInvariants.js`, `../../data/economyFingerprint.js`, `./recordMergeTree.js` and **nothing else**. The emitted draft measures **128** effective lines (E-9). |
| `TEST` | `tests/domain/recordMerge.test.js` | arms A1–A8 and the `CANNOT-CATCH:` header | `n/a` | §9's eight arms in **ONE literal `describe` with eight straight-line literal `it` titles** — no `.each`, no loop, no conditional, no nested describe (§P3.4). Derive the 63-row stride from `goldenCorpus()`; commit NO fixture; generate through `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` as `tests/property/generatorGoldenMaster.test.js` does. ⛔ **Never bind `it`, `test` or `describe` as a variable or parameter** (26 of the estate's 384 parked files park for that alone). ⛔ **The file is named `recordMerge.test.js` and NOT `recordMergeContract.test.js`**: the second matches the mutation-coverage NAME_PATTERN and would pull a register row EM-R0a holds (E-11). Every negative assertion carries `// anchored:` on the line immediately above. |

**Generated artifacts: `NONE`**, and §P2 rows 10 and 12 are answered rather than assumed: no `checks`
command runs a generator, and no `src/` path of this packet is an input to any of the five
edge-shared bundle metas (E-8).

### Registration obligations, priced

| obligation | owed? | measurement |
|---|---|---|
| sovereignty-lighting census | **YES — an INTERIOR RED, delta only** | `files +1 · credited +1 · suiteTitles +1 · titles +8`, from the ONE new test file. ⛔ **No absolute tuple is quoted as this packet's own; the census is re-derived whole at the train's terminal, BY THE CHAIR** (§P2.1). |
| `scripts/mutation-coverage-manifest.json` | **NO** | `tests/domain/` is not an ENFORCER_DIR and `recordMerge` matches no NAME_PATTERN token (E-11) |
| observed-shape `EXPLAINED_WRITER_EXEMPTIONS` | **NO** | no `dmLayer` and no `decrees` literal in either leaf (E-11) |
| `scripts/check-writer-reach.mjs` | **NO MOVEMENT PREDICTED** — neither a shrink nor a mint | seven literal settlement fields, every one with a live corpus writer (E-11); the pre-proof re-measures |
| `tests/lint/proseNumerics.test.js` | **NO** | renders no number; and its line-addressed baseline keys on a MODIFIED `src/` file — this packet modifies none |
| `docs/content/wiring-census.json` `stamp.files` | **NO** | keys on a MODIFIED `src/` file — none |
| `path:line` citations in other files | **NO** | this packet shifts no line in any existing file |
| `npm run build:edge-shared` | **NO** | input membership measured against all five metas: none (E-8) |
| generation-worker / lazy-engine / first-paint budgets | **ZERO BYTES in all three** | E-8; the bytes become real at EM-B2a's import, priced there |
| golden posture | **UNCHANGED** | §P3.1; the inertness control is the standing proof (E-1) |

---

## 8. Ordered coding sequence

1. **K-GATE, before the first edit.** Re-run the inertness control and confirm the three substrate
   files exist at the stamped base: `src/domain/edit/recordRegister.js`,
   `src/domain/edit/recordInvariants.js`, `src/data/economyFingerprint.js`. **If any is absent, STOP**
   — the dependency chain (§3.1) has not closed.
2. Create `src/domain/edit/recordMergeTree.js` from §6's contract. Import only the register.
3. Create `src/domain/edit/mergeConsequence.js` from §6's contract. ⛔ The import of the fingerprint
   is `../../data/economyFingerprint.js` — **never** `../../generators/power/economyReconciliation.js`
   (V6: the boundary ratchet reds on a fifth file).
4. Run `npx eslint` on both leaves. Then `npm run typecheck:domain:strict`. **Both leaves must be
   strict-clean; the debt baseline can only shrink and cannot absorb a new file** (STOP-3).
5. Create `tests/domain/recordMerge.test.js` with §9's eight arms — ONE literal `describe`, eight
   straight-line literal `it` titles, the `CANNOT-CATCH:` header verbatim.
6. Run the focused test slot, then the boundary ratchet, then the goldens (§10, in that order).
7. ⛔ **This packet's §8 schedules NO census refreeze.** An in-packet refreeze needs a commit, a
   commit drifts the sealed HEAD, and the sealed verbs then refuse (§P2.1, measured at EM-P0's build).
   The delta of §7 is reported to the chair and the chair re-derives the census at the terminal.

---

## 9. Acceptance matrix

Every arm below was EXECUTED at `32602dc60` against the emitted modules (E-10), and takes `R0` and
`R1` as INPUTS — so it runs at this packet's own base, with the re-derivation seam still unbuilt.

| id | case | executed |
|---|---|---|
| **A1** | ⭐ **IDENTITY AND THE WRITE BASE.** For every row of the 63-row stride, `mergeConsequence(record, X, X)` with `X` deep-equal on both sides returns a record BYTE-IDENTICAL to the record; the caller's record is unmutated; **no key of `record` is absent from the result**; `escalations` and `readings` are both empty. | 63/63 identical · 0 mutated · 0 keys lost · 0 escalations · 0 readings |
| **A2** | ⭐ **THE GROUP IS THE UNIT — a label never sits beside a flag that contradicts it.** With `economicState.foodSecurity.label` differing between `R0` and `R1` and `isSecure` identical in both, the merged group is `R1`'s WHOLE. `enclosingGroup('economicState.foodSecurity.label')` is `'food-security'`; `enclosingGroup('availableServices.legal')` is `null` (a measured NON-group, §22.3 item 4). **The paired negative:** with the group rule off the same inputs produce the contradictory pair. | 63/63 whole · 0 split |
| **A3** | **ABSENT IS A VALUE, AND NOTHING IS MERGED BY POSITION.** When `R0` and `R1` agree on a collection LONGER than the record's, the record's own array stands unpadded; a key both re-derivations carry and the record does not stays ABSENT from the result. | 63/63 · 63/63 |
| **A4** | **KEYED BY THE DECLARED KEY.** With `R1`'s `availableServices.food` permuted and one entry changed, the changed entry joins BY NAME, every other entry is byte-identical to the record's, and the order arm is COUNTED in `delta.orderMoved`. | 31/31 |
| **A5** | **A CROSS-ENTRY TOTAL IS ATOMIC** (§22.3 item 3). `economicState.incomeSources` — whose shares total 100 — comes from `R1` as ONE value, never entry by entry beside settled neighbours. | 61/61 |
| **A6** | ⭐ **THE ORDER RULE'S TWO ARMS**, on `economicState.activeChains` — the READING collection the corpus itself re-ordered 43 of 67 times. ⛔ Never on `institutions`: it is HELD, the tree merge never reaches it, and an arm written there measures 0 and proves nothing. Arm 1: `R0` and `R1` agree on the commons' order ⇒ the record's order stands and `delta.orderMoved` is silent. Arm 2: `R1` reverses them ⇒ `R1`'s order governs and `delta.orderMoved` names the collection. | 55/55 · 55/55 |
| **A7** | **MIRRORS RECOMPUTED, THE RECEIPT RECOMPUTED AND NEVER TAKEN.** `recomputeMirrors` is a no-op on a plain record; after a role change the member chip follows the merged roster. With `R1` carrying a planted digest and a changed prosperity, the merged record's `economyInputFingerprint` is the RECOMPUTED value, never `R1`'s. | 63/63 · 63/63 · 63/63 |
| **A8** | ⭐ **THE CHAIN IS THE SEMANTICS.** An ARRAY of edits throws `TypeError` with the law in the message; a single edit yields `delta.appliedEdit` as a STRING; `delta.nextBase` is `R1`; `delta.orphaned` is the op's EM-R6 rows verbatim and `[]` when the op has none; and the module's export list is enumerated in the assertion so **no exported symbol takes more than one edit**. | throws · string · true · verbatim · 5 exports enumerated |

```text
CANNOT-CATCH:
1.  The merge over the REAL re-derivation. A1–A8 take R0 and R1 as inputs; EM-R1–R5 are unbuilt.
    EM-R7's corpus ratchet is the only place the seam and the merge meet.
2.  The 504-trial corpus figures themselves — identity 63/63 through the seam, zero escalations,
    the MIXED census, the order arm's 52/504, the 36 % honesty figure. Measured at this compile
    (E-3, E-4) and re-measured by EM-R7; not assertable in this file.
3.  The cross-key escalation (step 1 taking BOTH keys). EM-R0b v2 exports no per-check metadata
    (STOP-4), and the prototype instrument carried no cross-key check, so the arm is unexercised.
4.  Whether the four MIXED objects outside a declared group (E-4.3) are missing groups. None
    produced a conviction; the chair rules, and EM-R7 holds the family to zero.
5.  The byte price. Zero bytes land while nothing imports these leaves; EM-B2a's pre-proof prices
    them.
6.  Whether the record's key order matters downstream. This packet preserves it (E-2) but nothing
    in the estate asserts it.
7.  merge∘merge vs merge(both) beyond five pairs. Five were run (E-5), one disagrees; all 28
    ordered pairs are EM-R7's.
8.  A DM edit outside the eight-edit corpus. The runtime guard is what covers it, by design.
```

---

## 10. Verification commands

```bash
# Focused static checks
npx eslint src/domain/edit/mergeConsequence.js src/domain/edit/recordMergeTree.js tests/domain/recordMerge.test.js
npm run typecheck:domain:strict

# Focused tests: acquire the one test slot in the same command
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/recordMerge.test.js

# The boundary ratchet: this packet adds no domain -> generators edge
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/domainGeneratorsBoundary.test.js

# Named golden proof: the posture is UNCHANGED and motion is a STOP
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js
```

⛔ **No command above writes a file**, so no generated path is owed and §P2.12's generator-last rule
has nothing to order. ⛔ A gate line with no printed test count DID NOT RUN (`gate-mutex.sh` gives up
after its poll budget and exits 0). Never read a gate through a shell pipe; use `npm run check:tail`
or `sh scripts/gate-tail.sh`. The lane never runs `npm run check`; the full gate moves to the
train's terminal.

---

## 11. Mandatory STOP conditions

- **STOP-1 — a golden moves.** `generatorGoldenMaster` or `dossierProseManifest` shifting by one byte
  is a STOP, not a re-record (§P3.1, HZ-GOLDEN).
- **STOP-2 — the boundary ratchet reds.** If `tests/build/domainGeneratorsBoundary.test.js` reports a
  FIFTH domain→generators file, the fingerprint import took the generators address. Fix the import;
  **never widen the baseline** (V6, E-7).
- **STOP-3 — a leaf is not strict-clean.** `scripts/check-domain-strict.mjs`'s debt baseline can only
  shrink and refuses to absorb a new file. Annotate the leaf; never run `--update` (V11).
- **STOP-4 — ⛔ the cross-key escalation has no data.** `recordInvariants` must expose, per check, the
  top-level key(s) it relates, so step 1 of the ladder can take BOTH keys for a cross-key violation
  (design §22.2 item 3, §22.3 item 5). **EM-R0b version 2 as accepted exports no such metadata and
  its `Violation` carries no keys** (V8). If the implementer reaches `import { … CHECK_META } from
  './recordInvariants.js'` and the symbol is absent, **STOP for the chair** — do NOT re-declare the
  seven cross-key ids here. That would spell EM-R0b's table twice and drift the moment a check is
  added (report question 2).
- **STOP-5 — an escalation fires on the corpus.** The family's contract is ZERO escalations; one that
  fires is a MISSING GROUP DECLARATION and belongs to EM-R0a, not to a local patch here.
- **STOP-6 — a MIXED object outside a declared group produces a CONVICTION.** Report it with its
  leaves to the chair. **Never invent a group** (§22.2 item 2; the launch file's instruction).
- **STOP-7 — the budget.** Any leaf above 250 effective lines, the packet above 400, or a THIRD logic
  leaf. Split; never renegotiate.
- **STOP-8 — a substrate file is absent at the stamped base** (§8 step 1).

---

## 12. Completion receipt

The build lane records, each executed and quoted:

1. The two CREATE targets absent before the first edit, and `git status` clean.
2. `npx eslint` clean on both leaves and the test file; `npm run typecheck:domain:strict` green with
   the debt baseline UNMOVED (quote the printed total).
3. `tests/domain/recordMerge.test.js` — eight `it` titles, all green, with the printed test count.
4. `tests/build/domainGeneratorsBoundary.test.js` green: **the live edge set is still four files /
   five edges.**
5. `tests/property/generatorGoldenMaster.test.js` and `tests/property/dossierProseManifest.test.js`
   green and UNCHANGED.
6. The effective-line count of each landed leaf under eslint `max-lines`
   `{ skipBlankLines, skipComments }`, against 250 and 400.
7. The lighting-census DELTA this packet causes — `files +1 · credited +1 · suiteTitles +1 ·
   titles +8` — restated as an INTERIOR RED for the chair's terminal refreeze, **with no absolute
   tuple**.
8. `git show --stat HEAD` naming ONLY this packet's three files.
