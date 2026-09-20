# `settlement-editor / EM-R0c` — THE MERGE: the consequence of an edit is the difference of two re-derivations, applied to the record by consistency group

- **Status:** `DRAFT` — ⭐ **CONDITIONALLY READY-able at `141a1d775`** (pre-proofed 2026-09-20
  07:2x–07:4x EDT). Conditional on FOUR packets landing first, each naming a symbol this packet
  IMPORTS and none of which exists in the tree yet: **EM-R0a** (`recordRegister.js`), **EM-R0b v3**
  (`recordInvariants.js` + its `CHECK_META` re-export), **EM-R0d** (`bandLadders.js`, which EM-R0b
  imports) and **EM-R0f** (`src/data/economyFingerprint.js`). No premise is refuted; nothing is
  BLOCKED.
- **Packet version:** `2`
  > *What version 2 changed and why.* The pre-proof re-measured every verified fact at
  > `141a1d775` and found the J-T1 window EMPTY — 24 commits moved and not one touched a path this
  > packet names — so no figure drifted. Six things changed anyway, all from rulings and
  > measurements made AFTER the compile: (1) **STOP-4 is DISCHARGED** — ODQ §934.47 addendum 38
  > accepted EM-R0b version 3, which ships `CHECK_META` and re-exports it from `recordInvariants.js`
  > so this packet's compiled import is satisfied verbatim; V8 is rewritten and `CHECK_META` becomes
  > an owed `requiredSymbols` row. (2) **EM-R0f is CHARTERED**, not proposed (addendum 35 ruling 1).
  > (3) **G8 `history-age` now exists** (addendum 70), and §6's group row and §5's new V14 record
  > THE HISTORY-ORDER TRIAL the chair ordered — executed here over 693 trials. (4) ⛔ **§6's
  > write-base absolute is SCOPED to the top level**, because at depth it is false: 245 measured
  > counterexamples, every one lawful under §22.1. (5) ⛔ **§7's TEST row gains a seed-loop
  > construction rule** and §10 gains `tests/lint` WHOLE as an instrument — a new `tests/domain`
  > test file opts into six walkers that walk `tests/` whole, and one of them convicts the idiom §7
  > prescribed (executed, red-first). (6) The preamble hash is re-stamped to its second amendment.
- **Verified base:** `__BASE__`
  > *Revalidation sentence for the chair:* re-measured at `claude/composite-r4`
  > `141a1d775` (`rev-parse --short HEAD` confirmed; `status --short` EMPTY at the start, 07:21:47
  > EDT, and at the end of the pre-proof); `git diff --stat 32602dc60 141a1d775` over every
  > change-manifest path and every `requiredSymbols` path returned NO OUTPUT across 24 commits, so
  > every fact the compile measured stands byte-identical; all three CREATE targets ABSENT; all four
  > present `requiredSymbols` rows proved by `grep -cF` → 1 at lines 77 · 76 · 60 · 60; the
  > boundary ratchet's live edge set re-measured at FOUR files / FIVE edges over 1,057 domain files;
  > the eager first-paint closure re-measured BY IMPORTING `vite.config.js` (268 modules, §P2 row
  > 11) and the generation worker's at 220, with 0 `src/domain/edit/**` in either and 0 importers in
  > `src/`; the budget re-counted with eslint's own `max-lines` in process at 166 + 128 = 294.
- **Last revalidated:** `__BASE__` (the chair stamps the date and sha at promotion)
- **Depends on:** `EM-R0a` (the class register — **pre-proofed READY-able at `141a1d775`**, and its
  SEVENTH group `history-age` is what V14's trial measures) · `EM-R0b` **version 3**
  (`recordInvariants` **and `CHECK_META`** — accepted at ODQ §934.47 addendum 38, pre-proofed
  READY-able at `141a1d775`; **STOP-4 is discharged by it**) · `EM-R0d` (the band ladders EM-R0b
  reads) · `EM-R6` (the `OrphanKind` vocabulary the delta carries) ·
  ⭐ `EM-R0f` — **CHARTERED** by ODQ §934.47 addendum 35 ruling (1) on this compile's proposal; its
  compile was dispatched 2026-09-20 07:15 and had not produced a packet when this pre-proof ran, so
  every fact here that names `src/data/economyFingerprint.js` is **CONDITIONAL** (§3.1, V5′)
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
  > ⛔ RE-MEASURED at the pre-proof's tip `141a1d775`:
  > `16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195` — the preamble's SECOND
  > AMENDMENT. The compile's `b90a95b7…caa5e1` is STALE. `shasum -a 256
  > docs/implementation/preambles/EM-PREAMBLE.md` (P-2). The amendment's §P2 row 11 is what V3
  > below now satisfies: first-paint membership is measured BY IMPORTING
  > `vite.config.js`'s `EAGER_FIRST_PAINT_MODULES`, never by reading a list, and a `skipIf` byte arm
  > that SKIPPED is not a pass.

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
6. **The siblings, IMPORTED and never re-declared** (as they stand at the pre-proof, 2026-09-20):
   EM-R0a **pre-proofed** (47 keys classed; KEYED 48 / ATOMIC 15; ⭐ **SEVEN groups** — the six of
   version 2 plus **G8 `history-age`**, root `history`, members `['age','founding.age']`; the
   receipt MERGED, never recomputed), EM-R0b **version 3** (`recordInvariants`, **33** checks, and
   ⭐ `CHECK_META` / `CHECK_IDS` / `CROSS_KEY_CHECKS` re-exported from `recordInvariants.js`),
   EM-R0d (the four ladder tables in `src/data/bandLadders.js`), EM-R6 v3 (`OrphanKind`).
7. **The three rulings this packet was re-cut against**, each read from the ledger:
   **ODQ §934.47 addendum 35** (this packet compiled and ACCEPTED; EM-R0f chartered; the suite is
   SEAM-FREE; the family's order is R0a · R0d · R0b v3 · R0f · R0c · R1–R5 · R6 · R7;
   `availableServices` and `economicState` CLOSED as measured non-groups; **the record's KEY ORDER
   is a contract of the merge** and EM-R7 gains an arm for it); **addendum 38** (`CHECK_META` ships
   and is total — **STOP-4 discharged**; `defenseProfile.scores` and `history.founding` are LAWFUL
   MIXED objects, no group owed; a `history` GROUP prevents the age split while `V-HISTORY-AGE`
   detects it); **addendum 70** (G8 declared with its two-member list; ⭐ *"G8 is the first group
   whose root also holds ORDER-BEARING collections, where EM-R0c's order arm and its group arm
   meet → **EM-R0c's pre-proof** carries one measured trial"* — discharged as **V14**).
8. **The code and the receipts** — `EM-R0c.evidence.md`: E-1…E-13 at the compile's `32602dc60`,
   P-1…P-12 re-executed at `141a1d775`, every row a quoted command.

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
- *`LANE-EM-COMPILE-2.md` quotes preamble SHA-256 `1cf54427…`; the compile measured `b90a95b7…`.*
  → ⛔ BOTH are stale. Re-measured at `141a1d775`:
  `16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195` (P-2). The hash moves with
  every amendment, which is why the header's line is the CHAIR'S STAMP and never a lane's figure.
- *The compile's own STOP-4 (V8: EM-R0b exports no per-check metadata).* → ⛔ **SUPERSEDED BY A
  RULING AND A LANDING.** ODQ §934.47 addendum 38 accepted EM-R0b version 3, whose §7 row states in
  terms: *"Re-export `CHECK_META`, `CHECK_IDS` and `CROSS_KEY_CHECKS` so EM-R0c's compiled import is
  satisfied verbatim."* The `Violation` typedef gains `keys`. **No re-cut of §6 is owed** and this
  packet still re-declares nothing (P-8).
- *The compile's §6: "⛔ A key present in `record` is present in the result, whatever the two
  re-derivations carry."* → ⛔ **TRUE AT THE TOP LEVEL, FALSE AT DEPTH, and it is scoped below.**
  Executed over 693 trials: **0 top-level record keys lost**, but **245 pure-object paths lost at
  depth** (`resourceAnalysis.imports.reasons.*` ×231, `economicState.foodSecurity.prosperityMod`
  ×12, `economicViability.metrics.foodBalance.*` ×2, `history.legacyAnnotations` ×1) — and **0 of
  the 245** sits under a node where `R0 ≡ R1`, so every one is §22.1 working correctly (the edit
  touched it; `R1` governs; `R1` does not carry it). The chair's own contract (ODQ §934.60) already
  says it right — *"nothing present in the record **and untouched by the edit**"* — and §6 now says
  it that way (P-9).

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
`≤ 2` cap — which *"the agent may not quietly renegotiate"*. So it was proposed as its own member,
and ⭐ **the chair CHARTERED it** (ODQ §934.47 addendum 35 ruling 1, 2026-09-20 02:30; its compile
was dispatched 07:15 and had produced no packet when this pre-proof ran):

> **EM-R0f (CHARTERED): the economy fingerprint moves to `src/data/economyFingerprint.js`.**
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
   `src/data/economyFingerprint.js`; all three land with EM-R0a, EM-R0b **v3** and EM-R0f BEFORE
   this base is stamped, so the chair must stamp `__BASE__` at or after those three landings (and
   after EM-R0d's, which EM-R0b imports). ⚠ At `141a1d775` **none of the three exists** (P-3) — this
   is the whole content of the packet's CONDITIONAL status, and it is the family's declared build
   order (R0a · R0d · R0b v3 · R0f · R0c), not a defect.
4. **CREATE targets absent** — `src/domain/edit/mergeConsequence.js`,
   `src/domain/edit/recordMergeTree.js` and `tests/domain/recordMerge.test.js` are absent at
   **`141a1d775`** (re-measured, P-3) and this packet is the SOLE claimant: 0 occurrences of any of
   the three in `docs/implementation/PACKET_MANIFEST.json`, and exactly 1 in the kit's
   `packets-waiting/*.json` — its own (P-3).
5. **git-clean** — the build lane's own worktree.

**Generators among `checks`: NONE.** No command in §10 writes a file, so §P2.12's "a generator goes
LAST" has nothing to order and no generated artifact is owed. Edge-shared INPUT MEMBERSHIP measured
against all five metas' own `inputs` lists: **none** (E-8).

---

## 5. Verified tree contract

Every row below was RE-FOUND BY SYMBOL at `141a1d775`; the `Proof` column carries the compile's
receipt and, after `→`, the pre-proof's re-execution.

| # | Fact | Where | Proof |
|---|---|---|---|
| V1 | `src/domain/edit/` does not exist | `src/domain/` | `git ls-files -- 'src/domain/edit/*'` → 0 (E-8) → **0 at the tip** (P-3) |
| V2 | nothing in `src/` imports `src/domain/edit/**` | whole `src/` walk | E-8(c) → **0 importers ⇒ in NO emitted chunk** (P-4) |
| V3 | the eager first-paint closure is **268** modules and holds 0 `src/domain/edit/**` files | `vite.config.js#EAGER_FIRST_PAINT_MODULES`, ⭐ **read by IMPORTING the module**, never a replica or a list (§P2 row 11) | E-8(a) → **268, 0** (P-4) |
| V4 | the generation worker's static closure is **220** modules and holds 0 `src/domain/edit/**` files | `src/workers/generation.worker.js` | E-8(b) → **220, 0** (P-4) |
| V5 | `fingerprintPowerEconomyInput` is exported from `src/generators/power/economyReconciliation.js` **today** | `:100` | `grep -cF` → 1 (E-12) → **1, still `:100`** (P-3) |
| V5′ | ⚠ **CONDITIONAL — the symbol this packet actually IMPORTS is `fingerprintPowerEconomyInput` at `src/data/economyFingerprint.js`, which DOES NOT EXIST at `141a1d775`** | `src/data/economyFingerprint.js` | **file absent** (P-3). It is **EM-R0f**'s CREATE (chartered, addendum 35 ruling 1; compile dispatched 07:15, no packet yet). The chair stamps `__BASE__` at or after EM-R0f's landing; §8 step 1's K-gate is the build lane's guard |
| V6 | the domain→generators ratchet's baseline is **4 files / 5 edges**, shrink-only, and the live set is 4 | `tests/build/domainGeneratorsBoundary.test.js#BASELINE_EDGES` (`:60`) | E-7 → **live set re-walked over 1,057 `src/domain` files: 4 files / 5 edges, identical to the baseline** (P-5) |
| V7 | the fingerprint's three members are private to one file | `:37`, `:85`, `:100` | `git grep -n` (E-7) → **`:37`, `:85`, `:100` unchanged** (P-3) |
| V8 | ⛔ **SUPERSEDED — STOP-4 IS DISCHARGED.** EM-R0b **version 3** ships `CHECK_META` (33 rows, total both ways), gives `Violation` a `keys` field, and **re-exports `CHECK_META`, `CHECK_IDS` and `CROSS_KEY_CHECKS` from `recordInvariants.js` expressly so this packet's compiled import is satisfied verbatim** | ODQ §934.47 addendum 38; `lane-preproof-EM-R0b-scratch/EM-R0b.md` §6 `:334`, §7 `:453` | P-8. §6's import line stands UNCHANGED; `CHECK_META` joins `requiredSymbols` as an owed row |
| V9 | `tests/domain/` is not a mutation-coverage ENFORCER_DIR and `recordMerge` matches no NAME_PATTERN token | `tests/lint/mutationCoverage.shared.mjs` (`ENFORCER_DIRS` 8 entries, `NAME_PATTERN`) | E-11 → **re-read at the tip: `tests/domain` absent from the eight; `recordMerge` matches none of the 16 tokens; `recordMergeContract` WOULD match `contract`** (P-6) |
| V10 | the lighting census counts TEST files, not `src/` leaves | `EM-PREAMBLE.md` §P2.1 | E-11 → P-7 |
| V11 | `tsconfig.domain-strict.json` covers `src/domain/**` and its debt baseline can only shrink (written ONLY under `--update`) | `scripts/check-domain-strict.mjs`; `tsconfig.domain-strict.json` extends `./tsconfig.json` and flips `strict` + `noImplicitAny` only | E-11 → **re-read verbatim** (P-6) — **STOP-3** |
| V12 | EP-0 (LANDED) holds ONE `requiredSymbols` row on `economyReconciliation.js`, for a symbol BELOW the moved region | `PACKET_MANIFEST.json`; the symbol is `rngSeed: stepRng.fork(POWER_STREAM).seed,` | E-7, E-12 → **at `:132`** (the compile said "118+"), below `:37`/`:85–111` (P-3) |
| V13 | the emitted leaves are byte-for-byte the measured function | 567 trials | E-2 (the compile). **CARRIED FORWARD, not re-executed**: the J-T1 window is empty over every path either module reads, so nothing the equivalence depended on moved (P-1). Re-proving it is EM-R7's |
| **V14** | ⭐⭐ **THE HISTORY-ORDER TRIAL — G8's group arm and §22.2 item 4's order arm MEET at `history` and DO NOT INTERFERE.** With G8 declared as EM-R0a declares it (root `history`, members `['age','founding.age']`), `delta.orderMoved` names a `history.*` collection in **106 of 693** trials and carries **203** history entries — **identical, trial for trial, to the register with no `history` group at all**. With the SAME group given `members: null` the order arm is **SILENCED: 0 of 693**, the 203 entries vanish, and the four collections are swallowed whole. The merged record is byte-identical under the member-list and the no-group shapes in **693/693**, and `history`'s key order is preserved in 692/693 (the one is a lawful deep key removal, §6) | executed through the prototype seam at `141a1d775` | **P-10** — 63 rows × 11 edits (the corpus 8 plus 3 age-moving world-fact edits), 0 errors |
| **V15** | ⛔ **A NEW `tests/domain/*.test.js` OPTS INTO SIX `tests/lint` WALKERS THAT WALK `tests/` WHOLE**, and one of them — `seedLoopTotality.walker.test.js` — **CONVICTS the very idiom §7 prescribed**. `tests/domain` sits in its SHRINK-ONLY frozen habitat (13 rows; *"never raise a number; never add a file"*) | `tests/lint/seedLoopTotality.walker.test.js` · `negativeAssertionAnchor` · `sovereigntyLightingContract` · `goldenFreeze` · `controlBytes` · `worldGenerationClockSeam` | **P-11**, executed RED-FIRST through the walker's own `scanBareSeedLoops`. ⭐ `contractTestAntiVacuity` does **NOT** govern it (`inScope` admits `tests/security/**`, `tests/**/*.contract.test.*`, `tests/lint/*.test.js` only) |
| **V16** | the lighting delta is **`files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1`**, and the file is **CREDITED** | `tests/lint/sovereigntyLightingContract.walker.test.js#parkReasonsFor` (`:1670`) | **P-7** — the walker's OWN classifier run over a candidate draft built to §7: `parkReasonsFor → []`, `titles → 8`, `suiteTitles → 1` |

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
| ⭐ *the same row, said for the case EM-R0a's G8 created* — a group with a MEMBER LIST rebuilds every OTHER key of its root **by the node rule**, so an order-bearing collection under a group root keeps BOTH order arms and still reports to `delta.orderMoved`. ⛔ The implementer writes the member overwrite AFTER the node-rule rebuild and NEVER as a whole-object take: `members: null` at `history` silences the order arm on 4 collections (V14, measured 203 → 0 entries) | — | §22.2 items 2 and 4; V14 |
| both sides are arrays and `collapse(p)` is a declared KEYED collection not also declared ATOMIC | merge by the DECLARED key; see the order rule | §22.2 item 5, §22.4 |
| both sides are arrays otherwise (keyless, ATOMIC, a cross-entry total, an array of scalars) | ONE value: `R1`'s | §22.2 item 5, §22.3 item 3 |
| a declared key is absent or non-unique in any of the three arrays | the collection degrades to ONE value and the refusal is recorded in `receipts.keyBroken` | §22.2 item 5 |
| both sides are objects | recurse over the union of keys, `R0`'s order first | §22.2 item 1 |
| otherwise (a differing leaf) | take `R1`'s, and record the path in `receipts.taken` | §22.1 |

At the TOP level, before the node rule: a key whose class is `WORLD` takes `R1`'s (it is the input);
a key whose class is **anything other than `READING`** — HELD, AUTHORED, HISTORY, CONSTANT, or
unknown — is taken from the RECORD untouched. ⛔ **A TOP-LEVEL key present in `record` is present in
the result, whatever the two re-derivations carry** (measured: 0 top-level keys lost over 693
trials, P-9).

⛔⛔ **AND THE SAME RULE AT DEPTH, SAID EXACTLY — the chair's contract (ODQ §934.60) IS the exact
rule, and the absolute is not.** *Nothing present in the record **AND UNTOUCHED BY THE EDIT** may be
absent from the result.* "Untouched by the edit" is `R0 ≡ R1` at the node, and the node rule already
delivers it: a node the two re-derivations agree on returns the record's subtree WHOLE, present or
absent. Where they DISAGREE, `R1` governs — **including when `R1` does not carry the key at all**,
which is how a reading the edit genuinely removed leaves the record. Measured over 693 trials: 245
deep pure-object paths left the record, **0 of them under a node where `R0 ≡ R1`** (P-9). ⛔ **The
implementer must not "fix" this by padding absent keys back in**: that would re-introduce the dead
`resourceAnalysis.imports.reasons.*` rows a terrain edit legitimately clears, and it would
contradict §22.2 item 1's "present or absent". ⛔ **And A1 asserts the TOP-LEVEL form**, which is
safe at any depth because the identity arm makes `R0 ≡ R1` everywhere.

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
| `TEST` | `tests/domain/recordMerge.test.js` | arms A1–A8 and the `CANNOT-CATCH:` header | `n/a` | §9's eight arms in **ONE literal `describe` with eight straight-line literal `it` titles** — no `.each`, no loop, no conditional, no nested describe (§P3.4). Derive the 63-row stride from `goldenCorpus()`; commit NO fixture; generate through `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` as `tests/property/generatorGoldenMaster.test.js` does. ⛔ **Never bind `it`, `test` or `describe` as a variable or parameter** (26 of the estate's 384 parked files park for that alone). ⛔ **The file is named `recordMerge.test.js`** and NOT `recordMergeContract.test.js` (matches the mutation-coverage `NAME_PATTERN` token `contract` and would pull a register row EM-R0a holds, V9) and NOT `recordMerge.contract.test.js` (that spelling ALSO opts the file into `contractTestAntiVacuity.walker.test.js`, whose `inScope` otherwise excludes `tests/domain`, and whose Rule 2 would convict A8's enumerated export list — P-11). Every negative assertion carries `// anchored:` on the line immediately above. ⭐ **Its lighting posture is EXECUTED, not predicted**: a candidate draft to this row scored `parkReasonsFor → []`, `titles → 8`, `suiteTitles → 1` under the walker's own classifier (V16, P-7). <br><br> ⛔⛔ **THE SEED-LOOP CONSTRUCTION RULE — a NEW `tests/domain` file opts into `seedLoopTotality.walker.test.js`, which walks `tests/` WHOLE (V15).** It convicts any `for (` line that carries `seed`/`seeds`/`SEED` (case-insensitive; `_seed` and `seed:` both match) when the loop body holds a bare `expect(`. `tests/domain` is in its SHRINK-ONLY `FROZEN_BARE_SEED_LOOPS` habitat — *"never raise a number; never add a file"* — and the baseline is OUTSIDE this packet's manifest, so a conviction cannot be absorbed and reds at the landing. **Build it the way the precedent this row already names builds it:** `tests/property/generatorGoldenMaster.test.js:837` writes `for (const c of rows) {` and destructures the row INSIDE the body, collecting failures and asserting ONCE after the loop. ⛔ Never write `for (const { _seed, ...cfg } of rows) {` or put `{ seed: _seed }` on the `for (` line. (Executed red-first: that shape is convicted at its loop line; the precedent's shape and a `// seed-loop: collected — <why>` marker are both clean — P-11.) The two other lawful cures, if a per-row assertion is ever wanted: `collectSeedFailures` from `tests/helpers/seedFailures.js` (exempts the whole file), or the marker in the first 40 lines. |

**Generated artifacts: `NONE`**, and §P2 rows 10 and 12 are answered rather than assumed: no `checks`
command runs a generator, and no `src/` path of this packet is an input to any of the five
edge-shared bundle metas (E-8).

### Registration obligations, priced

| obligation | owed? | measurement |
|---|---|---|
| sovereignty-lighting census | **YES — an INTERIOR RED, delta only** | ⭐ **`files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1`**, from the ONE new test file, **EXECUTED through the walker's own `parkReasonsFor` / `classifySource` rather than predicted** (V16, P-7): `parkReasonsFor → []` (CREDITED), 8 titles, 1 suiteTitle. ⛔ **No absolute tuple is quoted as this packet's own; the census is re-derived whole at the train's terminal, BY THE CHAIR** (§P2.1). For the chair's arithmetic only, the frozen tuple at `141a1d775` is `2653·383·2270·25052·6680` (`tests/lint/.lighting-census-baseline.json`, `measuredAtSha 7c233db55`) — quoted as the BASELINE the chair refreezes from, never as this packet's own figure. |
| ⭐ `tests/lint` WHOLE, as a §10 INSTRUMENT | **YES — NEW, and it was missing** | The chair's addendum of 2026-09-20 (runs 17/18/19 were one family): *a CREATE of a test file under `tests/<dir>` opts into EVERY walker that governs `tests/<dir>`; run `tests/lint` whole always*. **Six walkers walk `tests/` whole and therefore read this file** (V15, P-11). It is an INSTRUMENT, never a sealed `checks` entry — sealing the 172-file run would bake the lighting INTERIOR RED into `check:packet` (addendum 70, Q-D). |
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
   — the dependency chain (§3.1) has not closed. ⭐ **And confirm the eight symbols by name, not the
   files alone**: `grep -cF` each of `RECORD_CLASSES`, `CLASS_EXCEPTIONS`, `KEYED_COLLECTIONS`,
   `ATOMIC_COLLECTIONS`, `CONSISTENCY_GROUPS` (EM-R0a), `recordInvariants` **and `CHECK_META`**
   (EM-R0b **version 3** — an EM-R0b before version 3 has the file and not the symbol, which is
   STOP-4's surviving guard), and `fingerprintPowerEconomyInput` (EM-R0f). ⛔ Confirm
   `CONSISTENCY_GROUPS` carries **SEVEN** entries including `history-age` with the member list
   `['age','founding.age']`: `members: null` there silences the order arm on four collections
   (V14).
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
| **A1** | ⭐ **IDENTITY AND THE WRITE BASE.** For every row of the 63-row stride, `mergeConsequence(record, X, X)` with `X` deep-equal on both sides returns a record BYTE-IDENTICAL to the record; the caller's record is unmutated; **no TOP-LEVEL key of `record` is absent from the result** (⛔ the arm is written at the TOP LEVEL, as the compile measured it — §6 says why the absolute is false at depth, and byte-identity already covers depth here because `R0 ≡ R1` makes every node short-circuit); `escalations` and `readings` are both empty. | 63/63 identical · 0 mutated · 0 keys lost · 0 escalations · 0 readings; re-measured 0 top-level keys lost over 693 trials (P-9) |
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
3.  The cross-key escalation (step 1 taking BOTH keys). EM-R0b VERSION 3 now supplies `CHECK_META`
    and seven derived `CROSS_KEY_CHECKS` (STOP-4 discharged), but THE ARM IS STILL UNEXERCISED
    HERE: the prototype instrument is the recon's 25-check version with no cross-key entry, and the
    corpus produced ZERO escalations, so nothing measured in this packet depends on it. EM-R7 is
    where the ladder meets real cross-key data.
9.  ⭐ **THE `history-age` GROUP'S EFFECT ON THE MERGED VALUE.** V14 proves the group arm and the
    order arm do not interfere, and that `members: null` would silence the order arm. It does NOT
    prove the group changes any merged value here: `history` re-derives faithfully in this corpus
    (the record's order never settles away from `R0` — 0 of 693), so the merged `history` is
    byte-identical with the member list, with `members: null` in 674 of 693, and with no group at
    all in 693 of 693. ⛔ **G8 is PREVENTIVE and its value-population in the 63-row corpus is
    ZERO** — the split addendum 38 measured lives in EM-R0b's own instrument, and the corpus that
    would open the seam is EM-R7's.
10. Whether the 3 AGE-MOVING world-fact edits V14 runs are edits the editor will actually offer.
    They are the ONLY edits that move `history.age` (its sole producer is
    `resolveSettlementAge(tier, config)`, `src/generators/historyGenerator.js`, read from
    `config.settlementAgeMode` / `settlementAgeYears`), and the corpus's own eight move it 0 times
    in 504. The EM-A1 root-field surface decides whether a DM can reach them.
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

```bash
# ⭐ INSTRUMENT, NOT A SEALED CHECK (addendum 70 Q-D: sealing the 172-file run would bake the
# lighting INTERIOR RED into `check:packet`). Run it ONCE, read it by hand, and report.
# ⛔ OWED BECAUSE THIS PACKET CREATES A FILE UNDER tests/ (the chair's 2026-09-20 addendum: a CREATE
#    under tests/<dir> opts into EVERY walker governing tests/<dir>). SIX walkers walk tests/ WHOLE
#    and read tests/domain/recordMerge.test.js — seedLoopTotality (⛔ see §7's construction rule),
#    negativeAssertionAnchor, sovereigntyLightingContract, goldenFreeze, controlBytes and
#    worldGenerationClockSeam. Expect EXACTLY ONE red: the lighting census's interior tuple.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```

⛔ **No command in the SEALED set writes a file**, so no generated path is owed and §P2.12's
generator-last rule has nothing to order. ⛔ A gate line with no printed test count DID NOT RUN (`gate-mutex.sh` gives up
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
- **STOP-4 — ✅ DISCHARGED at the pre-proof, and KEPT as a landing-time guard.** EM-R0b **version 3**
  (ODQ §934.47 addendum 38) ships `CHECK_META` — 33 rows, total in both directions, `CROSS_KEY_CHECKS`
  DERIVED — and re-exports it from `recordInvariants.js` expressly so this packet's compiled import
  is satisfied verbatim (V8). §6's import line is unchanged and `CHECK_META` is now an owed
  `requiredSymbols` row. **The guard that remains:** if the implementer reaches
  `import { recordInvariants, CHECK_META } from './recordInvariants.js'` and `CHECK_META` is absent
  at the stamped base, **STOP for the chair** — EM-R0b landed at a version before 3. Do NOT
  re-declare the seven cross-key ids here: that would spell EM-R0b's table twice and drift the
  moment a check is added.
- ⭐ **STOP-9 — `seedLoopTotality.walker.test.js` convicts the new test file.** Its frozen habitat is
  SHRINK-ONLY and its baseline is outside this manifest, so a conviction cannot be absorbed. Rebuild
  the loop to §7's construction rule (the precedent's `for (const c of rows)` shape) — **never add a
  frozen row, and never raise one** (V15).
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
7. The lighting-census DELTA this packet causes — `files +1 · parked +0 · credited +1 · titles +8 ·
   suiteTitles +1` — restated as an INTERIOR RED for the chair's terminal refreeze, **with no
   absolute tuple**, and CONFIRMED against the walker's own `parkReasonsFor` on the landed file
   (it must print `[]`).
8. ⭐ **`tests/lint` WHOLE, run once as an instrument** (§10), with the printed test count and the
   list of reds. **EXACTLY ONE red is expected — the lighting census's interior tuple.** ⛔ A red
   from `seedLoopTotality.walker.test.js` is STOP-9, not a baseline edit; a red from
   `negativeAssertionAnchor` is a missing `// anchored:`; any other red is reported to the chair
   before the seal.
9. `git show --stat HEAD` naming ONLY this packet's three files.
