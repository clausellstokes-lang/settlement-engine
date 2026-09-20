# EM-R0c — COMPILE REPORT (Opus COMPILE lane, session a9df403c, 2026-09-20)

## STATUS: **DRAFT, READY-able — with ONE SPLIT TAKEN and FOUR questions only the chair can answer.**

The merge itself is **not** over budget and did not need splitting: **294 effective lines in 2
leaves** (166 + 128, each under 250). What does not fit is a sibling obligation the merge's own
contract creates — the economy fingerprint must move down a layer, and folding that in would make a
THIRD logic leaf. It is proposed as **EM-R0f** (question 1). No premise of design §22.1–§22.4 was
refuted; two of §22's open questions are now ANSWERED by execution.

**Files** (all under `$SP/lane-em-compile-EM-R0c-scratch/`):

- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0c-scratch/EM-R0c.md`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0c-scratch/EM-R0c.manifest.json`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0c-scratch/EM-R0c.evidence.md`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0c-scratch/EM-R0c.compile.report.md`

The emitted modules the packet describes are at `emit/recordMergeTree.js` and
`emit/mergeConsequence.js`; the measuring harness is `tools/r0c-*.mjs`.

**Tree:** `read-tip-32602dc60` at `32602dc607b7423838249cf57d73baf08feb047d`, `status --short` EMPTY
at the start and at the end. ⚠ The dead lane's `tools/instrument.mjs` pointed at `read-tip-e5bdfd031`
— an older tip — so **none of its figures is quoted**; `TREE` was re-pointed and every arm re-run.

---

## The budget table

| limit | measured | verdict |
|---|---:|---|
| new logic-bearing leaves ≤ 2 | **2** | in |
| total effective production lines ≤ 400 | **294** | in |
| `src/domain/edit/recordMergeTree.js` ≤ 250 | **166** effective (204 raw, 8,277 B) | in |
| `src/domain/edit/mergeConsequence.js` ≤ 250 | **128** effective (199 raw, 8,748 B) | in |
| existing logic files modified ≤ 3 | **0** | in |
| handwritten files ≤ 12 | **3** | in |
| acceptance cases ≤ 8 | **8** | in |
| hot files named | **0** | in |

Counted with eslint's own `max-lines` `{ skipBlankLines: true, skipComments: true }`, run in process.
⛔ The first shape measured **44 / 89 / 166 = 299 over THREE leaves** and was over the cap; the
post-passes were folded into the public-surface leaf (the launch file's seams (b)+(c)) rather than
renegotiated.

---

## Register moves, every one a DELTA

- **Sovereignty-lighting census — `files +1 · credited +1 · suiteTitles +1 · titles +8`**, caused by
  the ONE new test file (`tests/domain/recordMerge.test.js`, one literal `describe`, eight
  straight-line literal `it`s). ⛔ **No absolute tuple is stated as this packet's own.** The preamble
  §P2.1 governs over the shared brief: the census counts TEST files and *a new `src/` leaf moves
  nothing*. The refreeze is the chair's, at the train's terminal.
- **`scripts/mutation-coverage-manifest.json` — NO ROW.** `tests/domain/` is not an `ENFORCER_DIR`
  and `recordMerge` matches no `NAME_PATTERN` token. ⛔ The obvious alternative name
  `recordMergeContract.test.js` WOULD match (`contract`) and pull a register row EM-R0a holds; the
  packet forbids that name explicitly.
- **Observed-shape `EXPLAINED_WRITER_EXEMPTIONS` — NO MINT.** Neither leaf contains a `dmLayer` or
  `decrees` literal; those live in EM-R0a's register.
- **`scripts/check-writer-reach.mjs` — NO MOVEMENT PREDICTED**, neither shrink nor mint: seven
  literal settlement fields (`factions`, `npcs`, `members`, `powerStructure`, `economicState`,
  `economyInputFingerprint`, `tier`), every one with a live corpus writer.
- **prose-numerics, `wiring-census.json` `stamp.files`, `path:line` citations — ALL NIL**, because
  this packet MODIFIES no `src/` file. All three key on a modified path. ⭐ That is itself an argument
  for the split: EM-R0f is the one MODIFY in the neighbourhood and carries those three sweeps.
- **Byte budgets — ZERO in all three.** `src/domain/edit/**` is in neither the eager first-paint
  closure (268 modules, read from `vite.config.js#EAGER_FIRST_PAINT_MODULES` itself, not a replica)
  nor the generation worker's static closure (220 modules), and nothing in `src/` imports it. The
  bytes become real when **EM-B2a** first imports the merge; its pre-proof owes the dynamic import
  and the price.
- **Golden posture UNCHANGED**; the inertness control reproduced the committed manifest
  `b77b5909…c3ce` and a 25-row stride 25/25 at this tip.

**Collision group:** `src/domain/edit/**`, serialized with EM-R0a and EM-R0b. **No file is shared
with any packet** — neither `PACKET_MANIFEST.json` nor the kit's `packets-waiting/` claims
`src/domain/edit/mergeConsequence.js`, `src/domain/edit/recordMergeTree.js`,
`tests/domain/recordMerge.test.js` or `src/data/economyFingerprint.js`.

---

## §7 table and JSON `changeManifest`, proved set-equal

```
PACKET_ACTIONS (from scripts/implementation-packets.mjs): ['CREATE', 'DOC', 'MODIFY', 'REGISTER', 'TEST']
§7 table rows : [('CREATE', 'src/domain/edit/mergeConsequence.js'),
                 ('CREATE', 'src/domain/edit/recordMergeTree.js'),
                 ('TEST',   'tests/domain/recordMerge.test.js')]
JSON rows     : [('CREATE', 'src/domain/edit/mergeConsequence.js'),
                 ('CREATE', 'src/domain/edit/recordMergeTree.js'),
                 ('TEST',   'tests/domain/recordMerge.test.js')]
SET-EQUAL     : True
actions all in PACKET_ACTIONS: True
acceptanceCases: 8 objects, keys = ['case', 'id']
checks arrays  : 5 | generator among them: False
retiredSymbols : []
```

`requiredSymbols`, each proved by a quoted `grep -cF` at 32602dc60:

```
src/generators/generateSettlementPipeline.js   export function generateSettlementPipeline  -> 1
tests/helpers/goldenMasterCorpus.js            export function goldenCorpus                -> 1
tests/helpers/goldenMasterCorpus.js            export const keyOf                          -> 1
tests/build/domainGeneratorsBoundary.test.js   const BASELINE_EDGES                        -> 1
src/domain/edit/recordRegister.js              export const CONSISTENCY_GROUPS             -> (file absent)  [EM-R0a]
src/domain/edit/recordInvariants.js            export function recordInvariants            -> (file absent)  [EM-R0b]
src/data/economyFingerprint.js                 export function fingerprintPowerEconomyInput-> (file absent)  [EM-R0f]
```

**POST-EDIT SIMULATION:** the packet's edits are two CREATEs under `src/domain/edit/` and one under
`tests/domain/`. It touches no file that any `requiredSymbols` row names, so every row's text is
present verbatim after its own edits. **`retiredSymbols` is `[]`.** The one retirement nearby is
EM-R0f's; EP-0 (LANDED) holds a row on `economyReconciliation.js` for
`rngSeed: stepRng.fork(POWER_STREAM).seed,` (→ 1), which sits at line 118+, below the moved region
(lines 37, 85–111), so it is undisturbed either way.

---

## What was measured, and the four things it changed

**504 trials — the eight edits × ALL SIX tiers over the 63-row sample** (the recon ran 32 on four),
0 errors, nothing thrown.

| arm | measured |
|---|---|
| identity, through the real seam, no edit | **63/63**, 0 caller records mutated, 163 settled subtrees cancelled |
| ⭐ the chair's WRITE-BASE contract (ODQ §934.60) | **0 of 63 and 0 of 504 rows lose a record key; 0 move an untouched HELD/AUTHORED subtree** |
| every edit sticks · the name is kept | **504/504 · 504/504** |
| untouched HELD moving | 116/504, **every one the MIRROR or the RECEIPT** — exempt by class, because the merge RECOMPUTES them. Non-exempt: **0** |
| ⭐ `recordInvariants` clean with ZERO escalations | **0 escalations, 0 surviving convictions, `guardRuns` max 1** |
| ⭐ the negative control (group rule OFF) | **9 of 504 convicted**; the guard cures **all nine at STEP 1** |
| the order rule's second arm | **FIRES: 52/504 trials, 5 collections, 67 firings** (activeChains ×43, resourceConditions ×13, legacyAnnotations ×9, historicalEvents ×1, eventsTimeline ×1) |
| honesty | **36 %** (26,914 / 74,018) — the 63-row figure; the recon's 43 % was four rows. **74 DM-visible ride-along leaves** |
| declared keys | **all 48 held; 0 key-broken collections** |
| the cache claim | **5/5**, byte-identical, including the reversed interacting pair |
| chain vs batch | differs in **18 leaf paths** on the interacting pair; **neither is convicted** now |
| cost | merge alone 2.1–7.2 ms by tier; one re-derivation 4–32 ms |

**⛔ MIXED objects outside the six declared groups: 4 distinct, 11 occurrences — reported, no group
invented** (see question 4).

### The four things the measurement changed

1. ⛔ **The emitted modules were NOT the measured function** — 140 of 567 trials disagreed. Cause,
   isolated to one row: a group with a MEMBER LIST hoisted every member head to the END of the
   object. Values identical; **key order** different. The emitted, order-preserving shape is right
   (the record is the write base; a key-order shuffle is a persisted-byte change nothing asked for),
   the prototype was corrected to it, and **every figure above was re-measured from scratch**.
   Equivalence is now **567/567 record-identical and 567/567 delta-identical**. This is the class of
   defect that ships silently and EM-R7 would have found on a branch.
2. ⛔ **A 3-leaf split broke the standard's ≤2 logic-leaf cap** (299 over three). Folded to two.
3. ⛔ **An acceptance arm was VACUOUS and is recorded as such.** A6's first draft exercised the order
   rule on `institutions` and read `arm 2 = 0/63` — because `institutions` is **HELD**, so the tree
   merge never reaches it. Re-cut onto `economicState.activeChains`: **55/55 and 55/55.** The packet
   names the collection so the vacuity cannot be rebuilt.
4. ⛔ **The receipt recompute creates a layering contradiction** (question 1).

### EM-R0a's two slotted items — BOTH ANSWERED

- **The receipt-recompute finding.** The ONE declared RECEIPT is recomputed LAST; taking `R1`'s
  digest instead is **WRONG for the merged record in 31 of 315 trials** (wherever a declared group
  kept the record's own economy, `R1`'s digest digests inputs the merged record does not hold).
  `generationCoherenceReceipt` stays MERGED and never recomputed, exactly as EM-R0a v2 ruled.
- **The ORDER-BEARING history collections.** `history.eventsTimeline` and `history.historicalEvents`
  each fire the second arm **exactly once in 504 trials**. They need NO declaration: the general
  three-way order rule carries them. EM-R0a v2 exports no `ORDER_BEARING_COLLECTIONS` and this packet
  asks for none.

### One honest correction to the recon

The recon justified the chain partly because the batch path produced the `isSecure` conviction. With
the GROUP rule on, **neither path is convicted**. The chain still stands — on §22.2 item 6's own
ground (an edit is an event in order) and on the measured 18-leaf divergence — but not on a
conviction, and the packet says so in those words.

---

## Questions only the chair can answer

**1. ⭐ EM-R0f — does the economy fingerprint move down a layer, and is it its own member?**
`recomputeReceipts` must call `fingerprintPowerEconomyInput`, which lives at
`src/generators/power/economyReconciliation.js:100`. `tests/build/domainGeneratorsBoundary.test.js`
freezes the `src/domain → src/generators` edge set at **4 files / 5 edges, shrink-only** (live set
measured: 4). A `src/domain/edit/` leaf importing it is a FIFTH file and the ratchet reds. Taking
`R1`'s digest is REFUTED (31/315 wrong); re-implementing the digest in the domain would spell one
fact twice (the FIX-D2 defect). The ratchet's own instruction — *"pushing the shared leaves DOWN into
a layer both can import"* — and EM-R0d's accepted precedent both point at `src/data/`. **Proposed:
EM-R0f, one leaf (~15 effective lines) carrying `ECONOMY_FINGERPRINT_VERSION` (`:37`),
`economyProjectionInput` (`:85–91`) and `fingerprintPowerEconomyInput` (`:100–111`), importing
`fnv1a32` from `src/kernel/proseHash.js`; MODIFY `economyReconciliation.js` to import it and keep a
forwarding export.** Golden-neutral; the worker already carries both the function and `proseHash.js`,
so only the module wrapper's bytes move. **EM-R0c waits on it. Its alternative is folding it in and
breaking the ≤2 cap, which the standard forbids.**

**2. ⛔ EM-R0b owes the escalation's cross-key data — a version 3, or a shape change?**
Design §22.2 item 3 and §22.3 item 5 require step 1 of the ladder to take **BOTH** keys from `R1` for
a cross-key violation. **EM-R0b version 2 as accepted exports no per-check metadata, and its
`Violation` is `{ id, path, message, kind }` — no keys.** Its §5 table has the knowledge (seven
cross-key checks are named there); nothing exposes it. **Recommended: EM-R0b version 3 exports
`CHECK_META` (check id → `{ kind, crossKeys? }`)** — one frozen table beside the checks it describes.
The alternative (a `keys[]` field on every violation) changes an accepted return shape. ⛔ EM-R0c must
NOT re-declare the seven ids: that spells EM-R0b's table twice and drifts the moment a check is
added. This is the packet's STOP-4. **Honest scope:** the arm is currently *unexercised* — the
prototype instrument is the recon's 25-check version 1 with no cross-key entry at all, and the corpus
produced zero escalations, so nothing measured here depends on the answer.

**3. Does EM-R0c's acceptance suite stay seam-free, or wait for EM-R1–R5?** The packet's eight arms
all take `R0`/`R1` as INPUTS and run at its own base, today. The corpus arms under the REAL seam
(identity 63/63 through re-derivation, zero escalations over 504 trials, the MIXED census, the
honesty figures) are measured in this compile's evidence and belong to **EM-R7**. **Recommended:
seam-free**, so EM-R0c can land in the same train as EM-R0a/R0b/R0d instead of behind EM-R1–R5.

**4. ⛔ The four MIXED objects outside a declared group — a fate each.** Reported with their leaves,
no group invented (the launch file's instruction). **None produced a conviction; the thirty-check
instrument judged every merged record clean.**

| path | ×occurrences | taken leaf | settled leaf | my reading |
|---|---:|---|---|---|
| `availableServices` | 7 | `availableServices.healing[]` | `availableServices.legal` | §22.3 item 4 declares it a **measured NON-group** on purpose; at a container of twelve independent lists a MIXED reading is structural. **CLOSE with that reason?** |
| `economicState` | 2 | `economicState.situationDesc` | `economicState.prosperity` | same: a declared NON-group (*"declaring either would move the food card when a bank is added"*). **CLOSE?** |
| `defenseProfile.scores` | 1 | `.military`, `.magical` | `.disaster` | **NEW.** One occurrence. EM-R0b REFUTED two defence check candidates by a relative tolerance, so no invariant relates the three scores today. A group or a slot? |
| `history.founding` | 1 | `.reason` | `.overcoming` | **NEW.** One occurrence. Two prose fields of one founding story; no invariant relates them. A group or a slot? |

**5. Is the record's KEY ORDER a contract?** This packet preserves it (finding 1 above), but nothing
in the estate asserts it. If it matters — for a save round trip, a byte-comparison or EM-R7's
ratchet — it should be a named arm somewhere. If it does not, the finding is still the right call
and needs no further work.

---

## ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. **⛔ The chair-kit brief `LANE-EM-COMPILE-2.md` names a stale preamble hash.** It says
   `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`; measured at 32602dc60,
   `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` gives
   `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`. **SLOT: a one-line brief
   refresh at the chair's next sitting**, or the next compile lane quotes a hash that does not exist.
2. **⛔ `LANE-EM-COMPILE.md` contradicts the preamble on the lighting census.** The brief says *"a new
   `src/domain/**` file → the … census's file count moves"*; §P2.1 says *"a new `src/` leaf moves
   nothing"* and the walker's own comments agree. The chair's 2026-09-19 correction already rules the
   preamble right. **SLOT: strike that clause from the shared brief** at the same sitting — it is the
   second lane to hit it.
3. **⛔ The dead lane's `tools/instrument.mjs` pointed at a tree that is no longer the tip
   (`read-tip-e5bdfd031`).** Every partial output it left was measured there. A successor that
   quoted them would have shipped figures from another commit. **SLOT: the kit's recon-prototype
   README (or `instrument.mjs`'s own header) should read `TREE` from an env var with no default**, so
   an inherited harness cannot silently measure the wrong tree. Cheap, and it removes the habitat.
4. **The standing hot-file list is still stale.** EM-R6's compile reported it
   (`convergence.js` recorded 798, measures 764; `institutionLifecycle.js` at 798 of 800 missing) and
   it is unfixed at 32602dc60. This packet names no hot file so it is not blocked — **the existing
   slot at the chair's next sitting on the branch still holds.**
5. **`tests/build/domainGeneratorsBoundary.test.js`'s header comment is out of date.** It lists a
   six-entry baseline *"captured at HEAD 8e10816"* in prose, then a re-baseline comment, then the
   live four-entry `BASELINE_EDGES`. The prose list names `display/defenseDisplay.js`,
   `events/mutateEntities.js` and `worldPulse/pulseKernel.js`, which are no longer edges.
   **SLOT: a docs-only correction in whichever packet next touches that file — EM-R0f is the natural
   carrier**, since it is the one that will re-read the ratchet.
6. **The merge's cost is dominated by the re-derivations, not the merge.** Measured: merge 2.1–7.2 ms
   vs one re-derivation 4–32 ms by tier, and the cache claim holds 5/5, so a session pays one
   re-derivation per edit. **No work owed** — recorded because EM-B2a's pre-proof will want the
   number and it is measured here rather than re-measured there.
7. **`delta.readings` can be large.** On a town's terrain edit the corpus saw ~21,000 leaves taken
   from `R1` in one trial, and the delta currently carries a row per moved leaf with four values
   each. The DELTA CARD (EM-D\*) will not render 21,000 rows. **SLOT: the delta card's own compile
   decides the projection (which paths are DM-visible — the corpus measured 74 over six paths) and
   whether `readings` should be filtered at the source or at the card.** Not EM-R0c's to decide: the
   merge's job is to have the numbers.
8. **The power card's total is still broken by a share edit** (§22.2 item 8: shares sum to 89–94).
   The merge cannot mend it and does not try. **Already slotted** to `set-faction-power`'s op, which
   rescales by largest-remainder; recorded here because the corpus reproduces it (`V-POWER-100` on
   the edited record, exempt in the merge) and a reader of this report might think the merge regressed
   it.
9. **The genuine dangling join survives the merge**: `availableServices.*[].institution` ×13 over 504
   trials, at village and town on an institution removal. **Already EM-R6's removal sweep**; recorded
   so the number is on the record for EM-R6 version 3's denominator.
10. **`node_modules` in the read tree is a symlink into `slot-2`.** Every `node` probe here read
    through it. Harmless and unchanged, but it means a lane's probes depend on a build lane's
    install surviving. **No work owed; recorded as a standing property of the read-tip worktrees.**
