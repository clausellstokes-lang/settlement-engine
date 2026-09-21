# Settlement editor / train EM-T10 — EM-B3e: the veil reaches the snapshots — every settlement a saved entry can nest passes the SAME strip its live settlement does, on the account import (`prepareSettlementEntry`) and on the account export (`withoutEditState`), before the first writer of `dmLayer` exists

- **Status:** `READY`
  - Compiled 2026-09-21 by an Opus COMPILE lane (lane COMPILE-EM-B3e) at the read tip `429141e2d1c21cb5ee9dd5005ed1a77bbc9b3cd8`, on the chair's launch ruling (judgment 80) and the INTAKE RULE: the verifier's FIX-1, FIX-1b and FIX-2 on EM-B3d are slotted in the turn they arrived.
  - READY-able. **All four of §13's questions are RULED** (the chair, judgment 85); Q2 and Q4 are DISCHARGED IN THIS DOCUMENT by version 2's two edits. The §3 budget is inside every cap, so no override is requested.
  - ⛔ **THIS PACKET MUST LAND BEFORE `EM-C4a`.** EM-C4a is the charter's first writer of `dmLayer` (EDIT-MODE-TRAIN, train table row **EM-T7**). Until it lands nothing writes either key, so the hole this packet closes is unreachable; from its landing onward the hole is a live cross-account leak with a promotion path onto a live record. **EM-C4a's `Depends on` row owes `EM-B3e` beside `EM-B3d`** — named here for the chair, because a compile lane does not edit another packet.
  - ⭐ **VERSION 2 was cut by the Opus PRE-PROOF lane (lane PREPROOF-EM-B3e-T10) at the SAME read tip `429141e2d`**, on the chair's ruling of 03:12 EDT (judgment 85), which ruled version 1's §13 Q2 and Q4 and assigned EM-B3e the two edits below.
- **Packet version:** `2`
  - *What version 2 changed and why.* Two edits, both ordered by the chair's ruling on version 1's §13, neither touching the contract: **(Q2)** the three drifted `importScrub.js` citations EM-B3d's answered Q2 assigned to "the first Edit-Mode packet compiled after the probe" are now CARRIED — two new §7 rows, `src/lib/importReconciliationAdmission.js` (an ADDRESSES-ONLY CITATION row, §P2 row 14, outside the cap of three logic files) and `tests/lib/importReconciliation.test.js` (comment-only, **0 literal-titled `it`s**), with the drift proven to be exactly one line against `429141e2d~1`; **(Q4)** the no-recursion premise is now **PINNED rather than assumed** — two existing arms are named in §5.2, asserted verbatim as `requiredSymbols`, and RUN in `checks`, so the premise reds if a writer stops stripping a settlement's own timeline or a second promotion path appears beside `revertToSnapshotAction`. Nothing else moved: the algorithms, the five acceptance cases, the lighting delta (`titles +5`), the byte prices (+0 B in every closure) and the four original rows are version 1's, re-executed at this tip and unchanged. ⛔ One MEASURED correction to version 1's §13 Q2 recommendation: `CITATION` is **not** a member of `PACKET_ACTIONS` (`scripts/implementation-packets.mjs:31-37`, refused at `:836`), so the row's ACTION is `MODIFY` and "CITATION" is its CLASS in §7 and §P2 row 14 — the spelling the landed precedent (EM-R0d's `holderTable.js`) uses.
- **Verified base:** `em-t10-b3e-2026-09-21` at `e348d59b609e2c62c957a4cd78653849792043b7`
  - *The revalidation sentence the chair stamps, with the facts this compile measured:* "Re-measured at `<tip>` under J-T1: `git -C <tree> diff --stat <base> <tip> -- src/lib/accountImport.js src/lib/accountData.js src/lib/importScrub.js tests/lib/editTravel.test.js tests/lib/importScrub.test.js src/store/settlementVersionHistoryActions.js src/store/accountImportBody.js` printed NOTHING — zero declared paths moved; all nine `requiredSymbols` rows re-resolved verbatim at count 1 (`EM-B3e.evidence.md` E-SYM); `retiredSymbols` is empty; the four budgeted byte closures were re-derived and this packet reaches NONE (E-BUD); the observed-shape register moves by ZERO rows under the contracted spelling, measured against the detector's own rule (E-SPELL); the lighting DELTA of §10 is applied to the live baseline at promotion, never to a tuple copied from this document."
- **Last revalidated:** `e348d59b609e2c62c957a4cd78653849792043b7` — STAMPED BY THE CHAIR AT PLACEMENT. No gate was run by this compile lane and none is claimed.
- **Depends on:** **`EM-B3a` — ✅ LANDED at `668d87512f539ad1c866ec3d9327d6d41f3d8d2f`** (its `withoutEditState` is the export half this packet extends) and **`EM-B3d` — READY, composed at this compile's read tip as `429141e2d`** (its `scrubImportedEditState` is the strip this packet calls on the import half). Both are hard: this packet calls one and re-shapes the other. It depends on no writer and on no migration.
- **Depended on by:** `EM-C4a` — the first writer of `dmLayer`. See the ⛔ row under Status.
- **Collision group:** `NONE.` ⭐ **VERSION 2, re-measured at `429141e2d` over ALL SIX change paths** (the two citation rows included) against every `packets-waiting/*.manifest.json` change row and every non-terminal packet of `docs/implementation/PACKET_MANIFEST.json`: **zero intersections** with **train EM-T10's other three members (EM-A2a, EM-A2b, EM-B2a1 — and EM-B1i), with EM-P4 and EM-D0c, and with train EM-T9's four (EM-A1, EM-B1h, EM-D0a, EM-D0b)**. Both new paths are held by NOBODY. Two facts the chair must hold, both measured: **(1)** `EM-C4a` claims `tests/lib/editTravel.test.js` — it depends on EM-B3e and rides a LATER train, so the two can never be parallel members; **(2)** ⛔ **A PLACEMENT PRECONDITION:** `EM-B3d` (READY at the code tip `429141e2d`) still claims `src/lib/accountImport.js`, `tests/lib/editTravel.test.js` and `tests/lib/importScrub.test.js`, and `reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)` (`scripts/implementation-packets.mjs:828`) means a **LANDED** packet reserves nothing — EM-B3d is `LANDED` at the integration tip `7f0621fdb`, so EM-B3e places cleanly there and would refuse with `duplicate change path across packets` on a tree where EM-B3d is still READY. **This packet reaches NO budgeted closure and needs no byte-arm holder** (§7); train EM-T10's holder is the chair's to name, and it is not this member.
- **Commit authority:** `edits only; the chair commits`
- **Baseline posture:** `measured at the read tip 429141e2d.` `src/lib/accountImport.js` and `src/lib/accountData.js` read WHOLE; `prepareSettlementEntry`, `admitRestoredLifecycle`, `buildAccountExport`, `preflightAccountExport` and `withoutEditState` read whole and driven in plain node; the entry-shape census (E-SHAPE); the two gallery doors read (E-GALLERY); the promotion path read whole (E-PROMOTE); the hole re-executed on BOTH halves at this read tip (E-BEHAV part 1); the contracted cure executed standalone over the same doors, 18 rows (E-BEHAV parts 2–3); the contracted spelling counted with the tree's own TypeScript against the detector's own rule, with a failing control (E-SPELL); the registers (E-REG); the budgets (E-BUD); every `requiredSymbols` row verbatim with its count (E-SYM). **No gate was run and none is claimed.**
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: measured at this read tip with `shasum -a 256` — `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`; STAMPED BY THE CHAIR AT PROMOTION from the live file, never copied from this document.)
- **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth amendment's rules (1–16 as of 2026-09-21), obeyed before they land. Where this packet and `EM-PREAMBLE.md` (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`, measured with `shasum -a 256` at the read tip `429141e2d`) disagree, the interim rules govern and this row is the record of it.

> ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
> (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line.
> Every stamp lives on the continuation lines beneath it.

---

## 1. Reconciled authority

1. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §11 ("edits do not travel") and §12 item 4 GOVERN.** §12 item 4: *"the travel instrument is a RUNTIME test that a fork, an **import** and the gallery projection carry neither key, not a static walker."* This packet's charge is that the sentence is true of the WHOLE record a settlement travels inside, not only of the record's live settlement.
2. **`docs/implementation/packets/settlement-editor/EM-B3a.md` — LANDED.** Its `withoutEditState` (`src/lib/accountData.js`) is *"the one seam through which either key could leave the account at all"*, and it is REFERENCE-IDENTICAL when there is nothing to drop. Both sentences stay true here; the second is strengthened to cover the entry's version history.
3. **`docs/implementation/packets/settlement-editor/EM-B3d.md` — READY, composed at this read tip.** Its `scrubImportedEditState` is the settlement-level strip this packet calls on every nested settlement. ⚠ **EM-B3d's §2 and §11 declare `withoutEditState` out of scope and a STOP — that STOP bound EM-B3d's build lane, not this packet.** EM-B3e is the packet the chair ruled lawfully extends both (judgment 80); §5 states exactly which landed symbols are MODIFIED and which are only CALLED.
4. **The verifier's record — `findings/VERIFY-EM-B3d-T8-2026-09-21/VERIFY.md`, FIX-1, FIX-1b and FIX-2**, all executed in plain node. This packet is their discharge, in the slot the intake rule gave them the turn they arrived.
5. **The estate's own precedent for the class, in this exact file family:** `src/store/accountImportBody.js` (the custom-content roster block) — *"⛔ UNDO IS A WRITE PATH, AND IT WAS THE HOLE. `admitRestoredLifecycle` restores `versionHistory` verbatim, a snapshot is a WHOLE settlement … and `revertToSnapshotAction` assigns `savedSettlements[idx].settlement = cloneJson(target.settlement)` and persists it. So the two blocks above, which rewrite only the LIVE settlement, left every snapshot carrying the source account's records — and one revert after a correctly remapped import re-persisted them."* The estate has already been bitten by this exact shape at this exact seam, once.
6. `docs/implementation/preambles/EM-PREAMBLE.md` — §P2 rows 3, 10, 11, 13; §P3.1 (goldens); §P4; §P5 **HZ-TRAVEL**; §P6 (a written-contract arm is proved by its counterforce); §P8.
7. `docs/implementation/PACKET_STANDARD.md` — the standard itself. This packet is inside every cap of the default hard scope budget.
8. Live git state, quoted command by command in `EM-B3e.evidence.md`, all at `429141e2d`.

### ⭐ THE MEASUREMENT THAT COULD HAVE REFUTED THIS BRIEF, RUN FIRST — every clause held

`EM-B3e.evidence.md` E-BEHAV part 1, executed at this read tip (not relayed from the verifier):

```
1.import.noRestore           clean          versionHistory length=0
1.import.restoreLifecycle    CARRIES(HOLE)  versionHistory length=2, live settlement dmLayer=false
1.export.history             CARRIES(HOLE)  live settlement dmLayer=false, history len=1
```

The live settlement is stripped on both halves (EM-B3a's and EM-B3d's landed work, re-confirmed); the restored history and the exported history carry both keys. One clause was measurably NARROWER than the brief's wording and it is not a refutation: the brief says *"at EVERY place the entry shape can nest a settlement"*, and the entry shape has exactly **ONE** such place besides the live settlement (§5's E-SHAPE census: `campaignState` and `aiData` are settlement-free in every live writer, and the two gallery doors cannot carry a history at all). The packet contracts the measured class, not a larger one.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** a settlement that rides an account import or an account export arrives — and leaves — without the editor's two private keys **wherever the saved entry nests it**, not only in the entry's live settlement.

**Definition of done:** `prepareSettlementEntry` passes every restored `versionHistory[i].settlement` through `scrubImportedEditState`, the same strip its live settlement already takes; `withoutEditState` drops both keys from every `versionHistory[i].settlement` as well as from `entry.settlement`; **both halves stay REFERENCE-IDENTICAL when there is nothing to drop**, which is 100 % of real records at this landing; five acceptance cases pass; the verifier's two surviving mutants (M1, M7) die. The `editTravel`, `importScrub`, `accountData`, `accountImport`, `importReconciliation`, `accountImportSlice` and `treasuryDormancy.byteIdentity` suites stay green, and every golden is UNCHANGED.

In scope:

1. **One primary behaviour** — the veil reaches the snapshots, in both directions.
2. **One required integration** — the two existing seams (`prepareSettlementEntry`'s entry literal, `withoutEditState`'s body), each extended in place.
3. **One prevention guard** — the two-direction runtime arms, plus the inherited-key arm that kills the `in`-for-`Object.hasOwn` mutant.

Explicit non-goals:

- **Any writer.** `src/domain/edit/**` beyond the landed `recordRegister.js` is EM-C4a's / EM-B2a's / EM-C1's. This packet writes neither key and imports nothing from `src/domain/edit/**`.
- **The store seam.** `src/store/accountImportBody.js` is NOT touched: its roster block needs the import session's `contentIdentityMap`, this strip needs nothing but the record, and a cure there would leave `prepareSettlementEntry`'s other caller uncovered (§5, §13 Q3).
- **`normalizeSettlement`, `saves.js`, `persistProjection.js`, `persistMerge.js`, `worldExport.js`** — unchanged. EM-B3d's ruling stands: `normalizeSettlement` runs on every LOAD and SAVE, so a drop there would erase a DM's own edits from their own saves.
- **`src/lib/importScrub.js`.** Its four strips are PRESERVED UNCHANGED; this packet CALLS `scrubImportedEditState` and does not edit its module.
- **The two gallery doors.** Measured to be incapable of carrying a history (§5, E-GALLERY): both write `versionHistory: []` and `aiData: {}` as literals. No edit, no row, no arm.
- **`revertToSnapshotAction` and the version-history writers.** Read and recorded as the promotion path; not touched, not a manifest row.
- **Recursion below the entry shape.** `settlement.versionHistory[j].settlement` (a settlement nesting its OWN timeline) is out of contract, measured: `snapshotSettlement` deletes a settlement's own `versionHistory` on the write AND on the live restore, so no product writer can make one, and nothing promotes one onto an editable record (§6, §13 Q4).
- **The three idiom edges the verifier ruled ACCEPTED** (a lost prototype, dropped non-enumerables, a throwing sibling getter): none can exist on a record that arrives as parsed JSON or leaves through `JSON.stringify`, so this packet pins nothing for them.
- **The wording "the one boundary"** (the verifier's NOTE-3) is NOT this packet's: it is slotted to the parked DEVICE-DRAFT design lane.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Measured/priced here |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0 or 1` | **0** |
| Named state writers | `0 or 1` | **0** — this packet drops, never writes |
| Feature flags | `0 or 1` | **0** |
| User-facing surfaces | `0 or 1` | **0** |
| Direct consumers | `<=2` | **0 new** — no new exported symbol; both helpers are module-private |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | **2** — `src/lib/accountImport.js`, `src/lib/accountData.js`. ⭐ `src/lib/importReconciliationAdmission.js` is version 2's ADDRESSES-ONLY CITATION row and is **NOT a logic home**: `EM-PREAMBLE.md` §P2 row 14 puts it outside this cap (*"a production file whose only edit is the `path:line` addresses inside its comments or string literals — no logic byte — is a CITATION row … it is not a logic home and never splits a packet"*). Counted as a logic file anyway it would be **3 of 3** — still inside |
| Additional registration-only files | `<=3` | **0** |
| Handwritten files total | `<=12` | **6** (version 1's four, plus version 2's two comment-only citation files) |
| New/changed effective production lines | `<=400` | **42** (`+14` accountImport with 1 line changed in place; `+28 / -6` accountData ⇒ net `+22`). Version 2's two citation rows add **`+0` effective lines** — three changed comment lines, zero added, zero removed |
| Effective lines per new leaf | `<=250` | n/a — no new leaf |
| Delta in a shared/hot file | `<=15` | **0 hot files touched.** The standing list is `EconomicsTab.jsx`, `OutputContainer.jsx`, `convergence.js`, `institutionLifecycle.js`, `App.jsx`, `SettlementsPanel.jsx`, `peaceTerms.js`, `informationStatecraft.js`; none is here. `src/lib/**/*.{js,jsx}` carries `max-lines: ['error', { max: 800, skipBlankLines: true, skipComments: true }]` (`eslint.config.js:735-741`): `accountImport.js` **379 → 393 / 800**, `accountData.js` **371 → 393 / 800**; neither is in `scripts/.size-baseline.json` and neither carries a per-file override (E-EFF) |
| Acceptance cases | `<=8` | **5** |

**No override is requested.** Exceeding any limit is a STOP and split, not an invitation to renegotiate.

⚠ The effective-line figures were counted with a plain-node non-blank / non-comment pass, **not** with eslint's own `Linter` (this compile lane runs no eslint). The pass is cross-checked: it returns **379** for `src/lib/accountImport.js`, the exact figure EM-B3d's compile measured for the same file with eslint's `Linter` at `ee204c827` (E-EFF). The pre-proof may re-take them with the Linter; nothing in this packet's plan turns on the last digit, since the tightest headroom is 407 lines.

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- EM-B3e
```

Expected: exact packet Markdown and structured capsule emitted; verified-base ancestry and unchanged declared substrate proved before the seal pins exact HEAD; the **six** non-CREATE targets clean (version 2 added two), **zero** CREATE targets, and **all eleven** required symbols resolving — re-executed against the tip after version 2's edits, every row count 1; Git-visible foreign dirt fingerprinted without target overlap.

⛔ **THE BASE MUST BE AT OR AFTER `429141e2d` (EM-B3d's composed build).** `src/lib/importScrub.js`'s `scrubImportedEditState` — a `requiredSymbols` row of this packet — was created by EM-B3d, and `src/lib/accountImport.js:617` gained its call in the same commit. A base older than it makes the sealed substrate check throw `verified-base descendant changed declared substrate`, and the packet's premise would be false besides.

⛔ **SEALED DISPATCH WANTS THE WORKTREE ON THE VERIFIED BRANCH.** `implementation:dispatch` throws `branch mismatch` from a lane branch; the lane branch for this member is `em-t9-b3e-2026-09-21`, cut at the promotion commit, and the chair composes the lane's commit onto the train branch at the terminal.

Any mismatch makes this packet STALE. Stop before coding.

Edit only exact-manifest paths. This lifecycle never creates worktrees, stages, commits, merges, cleans, infers affected tests, or rules on a semantic line budget.

## 5. Verified tree contract

Every row was resolved BY SYMBOL at `429141e2d`; the command and its output are in `EM-B3e.evidence.md` under the cited section. Line numbers are the read tip's and are HINTS — re-find by symbol.

### 5.1 · THE ENTRY-SHAPE CENSUS — every field of a saved entry that can hold a settlement record (E-SHAPE)

`prepareSettlementEntry` returns exactly `{ name, tier, settlement, config, seed, aiData, campaignState, versionHistory }` (`src/lib/accountImport.js:646-655`); `preflightAccountExport` exports `state.savedSettlements.map(withoutEditState)` plus `campaigns`, `customContentArchive`, `serviceRecords`, `profile`, `preflight` (`src/lib/accountData.js:239-241, 372-381`).

| Field | Rides the import? | Rides the export? | Promoted onto a live record by | Settlement-bearing? |
|---|---|---|---|---|
| `entry.settlement` | **yes**, both modes | **yes** | it IS the live record | **YES — already stripped** (EM-B3d `:617`; EM-B3a `withoutEditState`) |
| `entry.versionHistory[i].settlement` | **only with `restoreLifecycle: true`**, and `src/store/accountImportBody.js:414` — the product's own account door — always passes it; the value is taken **verbatim** (`admitRestoredLifecycle`, `:391-395`) | **yes, whole** — `withoutEditState` replaces only `entry.settlement` | `revertToSnapshotAction` (`src/store/settlementVersionHistoryActions.js:133`): `s.savedSettlements[idx].settlement = cloneJson(target.settlement)`, then `persistSaveUpdate` | **YES — THE HOLE. THIS PACKET'S CHARGE** |
| `entry.campaignState` | yes with `restoreLifecycle` (whole, `{ ...sourceState, phase, eventLog }`) | yes | `hydrateFromSave` / `pickleCampaignState` round trip | **NO.** Its only live writer is `pickleCampaignState` (`settlementSliceHelpers.js:191-204`), whose shape is `phase · eventLog · systemState · locks · generatedAt · editedAt · canonizedAt · lastExportAt · narrativeDrift · exportState`. `systemState` is `deriveSystemState`'s four derived dimensions (`resilience · volatility · externalThreat · resourcePressure`, `deriveSystemState.js:82-90`) — no settlement spread. `eventLog[].beforeState` / `.afterState` are `SystemState` (`src/domain/types.js:155,185`; `settlementSlice.js:1452` restores it onto `state.systemState`, never onto a settlement) |
| `entry.aiData` | yes with `restoreLifecycle` (whole) | yes | read by the prose surfaces | **NO.** It holds AI prose (`aiSettlement`, `aiDailyLife` — `src/lib/narrativeMutations.js:116-125`); no writer puts a settlement record in it and nothing promotes it onto one |
| `entry.config`, `entry.seed` | forced `null` by `prepareSettlementEntry` (`:649-650`) | yes (the save's generation config) | the generator's dials | **NO** — a `GenerationConfig`, and `scrubImportedConfig` already governs it |
| `campaigns[]` | a separate array, never a settlement blob | yes | — | **NO.** `src/lib/campaigns.js` carries `settlementIds: []` (`:449`) and the row `select` list has no settlement column; the verifier's door census reached the same result independently |
| `state.draftVersionHistory`, the world-pulse snapshot (`campaignWorldPulseDeferred.js`) | **no** — store-only state, outside every persistence whitelist | **no** — `buildAccountExport` never reads them | — | settlement-bearing but **UNREACHABLE by both doors** |

⇒ **The class has exactly ONE unclosed member**, and this packet closes it on both halves.

### 5.2 · THE ROW TABLE

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The import seam** | `src/lib/accountImport.js` | `prepareSettlementEntry` (`:571`); the entry literal at `:646-655` | the live settlement is stripped at `:617`; `versionHistory: lifecycle.versionHistory` at `:654` is the RAW restored array. Driven in plain node at this tip: with `restoreLifecycle: true` the serialized entry CARRIES both keys, with the default it does not (E-BEHAV 1) | **MODIFIED.** One changed line in the entry literal; the declaration line, the signature, the return shape and every other statement are byte-unmoved |
| **The restore, verbatim** | `src/lib/accountImport.js` | `admitRestoredLifecycle` (`:330`) | `if (Array.isArray(source.versionHistory)) versionHistory = source.versionHistory;` — the source array by reference, no element inspection (`:391-395`). It is WEB-5's `requiredSymbols` row | **PRESERVE UNCHANGED.** The strip is applied in `prepareSettlementEntry`, not here: this function's contract is per-field ADMISSION and conflating it with a scrub would make one function answer two questions |
| **The opt-in literal** | `src/lib/accountImport.js` | `meta.restoreLifecycle === true` (`:639`) | WEB-5's `requiredSymbols` row, asserted verbatim at every status; count 1 (E-SYM) | **PRESERVE UNCHANGED, verbatim** |
| **The local guard this packet calls** | `src/lib/accountImport.js` | `function isPlainRecord(value)` (`:267`) | `value != null && typeof value === 'object' && !Array.isArray(value)`; count 1 (E-SYM) | **CALLED, PRESERVED UNCHANGED.** The new helper reuses it rather than re-spelling the guard |
| **The strip itself** | `src/lib/importScrub.js` | `scrubImportedEditState` (`:205`) | `Object.hasOwn`-guarded destructure-drop, reference-identical on the no-op path, created by EM-B3d; count 1 (E-SYM) | **CALLED, PRESERVED UNCHANGED.** This packet edits no file under `src/lib/importScrub.js` |
| **The export seam** | `src/lib/accountData.js` | `withoutEditState` (`:209`) | `const s = entry?.settlement; … return Object.keys(rest).length === Object.keys(s).length ? entry : { ...entry, settlement: rest };` — replaces ONLY `entry.settlement`; `entry.versionHistory` rides whole (E-BEHAV 1). EM-B3a's docblock contracts the reference identity | **MODIFIED.** The declaration `function withoutEditState(entry)` survives VERBATIM (count 1, E-SYM); its body is re-shaped and one module-private helper is extracted beside it |
| **The export's caller** | `src/lib/accountData.js` | `export function preflightAccountExport` (`:237`) | `(Array.isArray(state.savedSettlements) ? … : []).map(withoutEditState)` at `:239-241`; EM-B3a's `requiredSymbols` row | **PRESERVE UNCHANGED.** The call site, its arity and its position before the byte measurement are untouched |
| **⭐ THE PROMOTION PATH — why this is a leak and not a curiosity** | `src/store/settlementVersionHistoryActions.js` | `revertToSnapshotAction` (`:102`); `recordSnapshotAction` (`:31`) | `recordSnapshotAction` writes `settlement: snapshotSettlement(sourceSettlement)` (`:46`) — a whole settlement minus its own timeline; `revertToSnapshotAction` writes `s.savedSettlements[idx].settlement = cloneJson(target.settlement)` (`:133`), refreshes `s.settlement` (`:145`) and persists (`:173-177`) | **PRESERVE UNCHANGED, and NOT a manifest row.** Read and recorded as the fact that makes the hole load-bearing from EM-C4a onward. It is deliberately not a `requiredSymbols` row: this packet does not call it, and a LANDED row would cost a future rename an undeserved `retiredSymbols` discharge |
| **The estate's own precedent, same file family** | `src/store/accountImportBody.js` | the custom-content roster block (`:485-540`) and the door call (`:414`) | the block walks `preparedResult.entry.versionHistory` and remaps each `snapshot.settlement`'s `customContentProvenance` / `customContentRoster`, with a comment naming `revertToSnapshotAction` as the promotion path; `:414` passes `{ sourceName, importedAt, restoreLifecycle: true }` | **PRESERVE UNCHANGED, NOT TOUCHED.** §13 Q3 records why this packet's cure sits one level DOWN instead |
| **The two gallery doors** | `src/store/galleryImportSettlement.js` (`:49-90`), `src/store/galleryImportMap.js` (`:277-303`) | `importGallerySettlementImpl`, `importGalleryMapWithCampaignImpl` | **both entry literals write `versionHistory: []` and `aiData: {}` as LITERALS**, and `campaignState` as a literal `{ phase, eventLog: [] }`. There is no field on either door's entry through which a history could arrive (E-GALLERY) | **PRESERVE UNCHANGED.** No edit, no row, no arm — the doors are proved incapable, not assumed so |
| **The declared absence** | `src/domain/edit/recordRegister.js` | `NOT_YET_WRITTEN_KEYS` (`:59`) | `Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts'])`; `git grep -nE '\.(dmLayer\|decrees)\b' -- src` returns nothing (E-KEYS) | **PRESERVE UNCHANGED, and deliberately NOT a `requiredSymbols` row here** — EM-B3d already carries it inside this same family, and a second holder would double the `retiredSymbols` discharge EM-C4a already owes for it (EM-B3d §13 Q4, answered) |
| **Register — observed shape** | `scripts/check-observed-shape-readers.mjs`; `scripts/lib/legacy-reader-shape-scan.mjs` `scanReaders` (`:532-570`) | `BUILTIN_MEMBERS` (`:67-77`), `isWriteTarget` (`:516`) | a read is counted ONLY at a `ts.isPropertyAccessExpression` whose name is an identifier, is not in `BUILTIN_MEMBERS` and is not a write target; a finding is minted only when the receiver resolves to EXACTLY ONE known shape lacking that key. **All four of this packet's paths are ABSENT from the baseline's file-keyed `inventory`** — so any single counted read would MINT a new file entry (E-OSR) | **PRESERVE UNCHANGED. The register moves by ZERO rows** under the contracted spelling — measured with the tree's own TypeScript and a failing control (§6, E-SPELL) |
| **Test home — the runtime travel instrument** | `tests/lib/editTravel.test.js` | `EM-B3a — HZ-TRAVEL: a fork, a backup export and a realm snapshot carry neither key` › `A7 — the three travel surfaces, executed end to end` (`:119`) | 263 raw / 160 effective lines, 2 `describe`s and 4 literal `test` titles at this tip, `import { describe, test, expect, vi } from 'vitest'`, `vi.mock` of `supabase.js`, helpers `dmLayerFixture()` / `decreesFixture()` / `editedSettlement()` / `saveRow()` / `expectByteEqual()`. **Carries NO `FROZEN_UNANCHORED_NEGATIVES` row** (E-REG) | B1, B2, B3 and B5 join the EXISTING second `describe` as four new literal-titled `test`s. **A7 and A6 are byte-untouched.** ⭐ A7's `expect(payload.settlements[1]).toBe(unedited)` (`:166`) is the landed dormancy pin this packet must keep green — B3 is its sibling with a history present |
| **Test home — the unit** | `tests/lib/importScrub.test.js` | `EM-B3d — scrubImportedEditState: an import carries no editor state` (`:262`) › `A2 — is REFERENCE-IDENTICAL when there is nothing to strip` (`:307`) | 398 raw / 283 effective lines, 6 `describe`s and 18 literal `it` titles at this tip; count 1 for the A2 title (E-SYM) | B4 joins the EXISTING `EM-B3d` describe as a fifth `it`. ⛔ **`FROZEN_UNANCHORED_NEGATIVES['tests/lib/importScrub.test.js'] = 1`** (`negativeAssertionAnchor.walker.test.js:626`) is SHRINK-ONLY: **do not anchor the existing `expect(out).not.toHaveProperty(stripped)` at `:42`**, and add no new un-anchored negative |
| **⭐ VERSION 2 (Q2) — THE DRIFTED CITATIONS, RE-ADDRESSED** | `src/lib/importReconciliationAdmission.js` (`:442`, `:549`); `tests/lib/importReconciliation.test.js` (`:604`) | the comment strings `` `importScrub.js:115-121` `` and `` `importScrub.js:158-166` `` | **The drift is EXACTLY ONE LINE and is PROVEN, not inferred.** `git show 429141e2d~1:src/lib/importScrub.js \| sed -n '115,121p'` prints the cited paragraph (*"The living-content law marker goes with them …"*) and `sed -n '158,166p'` prints the cited destructure (*"if (!hasMarker) return rest; …"*); at `429141e2d` the IDENTICAL text is at `:116-122` and `:159-167`, because EM-B3d's docblock amendment added one raw line above both. The control: at the tip, `:115` is now a bare `` * `` and `:158` is the WRONG closing brace (`…*/ (settlement);` instead of `(config);`). `tests/lint/sourceCitationIntegrity.walker.test.js` ARM 1 is past-EOF only and a 214-line file makes both stale ranges in-bounds, so **no gate reds** — the addresses are simply wrong | **MODIFIED, ADDRESSES ONLY.** Change `115-121` → `116-122` at `:442` and at `:604`, and `158-166` → `159-167` at `:549`. **Not one other byte** in either file: no logic, no assertion, no test title, no import. Both files are RESERVED BY NOBODY (measured over every `packets-waiting/*.manifest.json` change row and every non-terminal estate packet) |
| **⭐ VERSION 2 (Q4) — THE NO-RECURSION PREMISE, PINNED BY TWO EXISTING ARMS** | `tests/domain/townMapEdits.test.js`; `tests/store/advertisedUndoArming.walker.test.js` | `snapshot/revert/undo/persist substrate: cloneJson + snapshotSettlement carry the container` (`:384`); `the versionHistory record kind: both writers really write the timeline` (`:635`) | **LIMB 1 — no product writer can MAKE the nesting.** The first arm asserts `expect(snap.versionHistory).toBeUndefined()` over the real `snapshotSettlement`, the helper BOTH promotion statements call (`settlementVersionHistoryActions.js:46` on record, `:145` on the live restore); re-executed at this tip (`Q4-BEHAV.out` 4.1 `STRIPPED`). **LIMB 2 — no SECOND promotion path appears beside `revertToSnapshotAction`.** The second arm asserts the versionHistory writers are EXACTLY `['commitPendingEdits', 'recordSnapshot']` and that `OPERATIONS.revertToSnapshot.undoState` is `external:auto-pre-revert-snapshot`, over the real `src/store/operationRegistry.js`, whose own walker proves registered ⇔ real mutating actions in both directions. Both titles count 1 at this tip | **PRESERVE UNCHANGED, and NOW `requiredSymbols` ROWS** — asserted verbatim at every status, so neither arm can be renamed or deleted in silence — and BOTH ARE RUN by `checks` (§10). Neither file is edited, so the post-edit simulation is trivially satisfied. ⚠ **The measured limit, stated rather than hidden:** neither arm convicts an UNADVERTISED promotion added inside an existing registered action (§13 Q4) |
| **Registers that do NOT move** | `scripts/mutation-coverage-manifest.json`; `docs/content/wiring-census.json`; `tests/lint/.prose-numerics-baseline.json`; `scripts/.size-baseline.json`; `tests/lint/.lighting-census-baseline.json`; `tests/lint/publicIdentitySingleRender.walker.test.js`; `scripts/.slugify-idiom-baseline.json`; every golden | — | mutation-coverage: **zero rows owed** — this packet CREATEs nothing, and `ENFORCER_DIRS` (read at this tip in `tests/lint/mutationCoverage.shared.mjs:36-45`) is `tests/lint · design · docs · data · copy · security · edgeFunctions · generators`; wiring census: **`+0`, measured against `src/generators/**` and `src/domain/**` — this packet CREATEs under neither, and neither `src/` path is in `stamp.files`**; prose-numerics: **zero rows for all four paths** (`git grep -n -F <path> -- tests/lint scripts` finds no line-addressed row: interim rule 13 satisfied, `none found`); `publicIdentitySingleRender` and `slugify-idiom` name `src/lib/accountData.js` but are FILE-keyed rationale maps, not line-addressed; lighting: the DELTA is §10's and the refreeze is the train's terminal act (E-REG) | **PRESERVE UNCHANGED**, every one |

**Forbidden alternatives:**

- no drop in `normalizeSettlement`, `saves.js`, `persistProjection.js`, `persistMerge.js` or `worldExport.js`;
- **no PROPERTY READ, anywhere in this packet's production code, of `dmLayer`, `decrees`, `settlement` or `versionHistory`** — every such field is read by DESTRUCTURE or probed with `Object.hasOwn` and a string literal (§6, E-SPELL). A dotted read on a resolvable receiver mints an observed-shape row through a door only the chair may open;
- no unconditional clone on either half — it would break the reference-identity contract that is this packet's dormancy proof and would move the bytes of every export and every import this build has ever taken;
- no recursion into `settlement.versionHistory` (§6, §13 Q4);
- no edit to `src/lib/importScrub.js`, to `src/store/accountImportBody.js`, to either gallery door, to any migration, to `WORLD_SNAPSHOT_HARD_DENY`, `PUBLIC_TOPLEVEL_KEYS`, `toPublicSafe`, `PRIVATE_KEY_RE` or `COVERT_KEY_RE`;
- no edit to `tests/lint/.lighting-census-baseline.json`, `tests/lint/negativeAssertionAnchor.walker.test.js`, `scripts/.observed-shape-readers-baseline.json`, `scripts/mutation-coverage-manifest.json` or any other register;
- no import of anything under `src/domain/edit/**`;
- no edit to `A6` or `A7` in `tests/lib/editTravel.test.js`, and none to `A1`–`A5` in `tests/lib/importScrub.test.js`;
- no re-serialisation of any manifest or baseline JSON; no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```js
// ── src/lib/accountImport.js — ONE new MODULE-PRIVATE pure helper, placed immediately
//    ABOVE `prepareSettlementEntry` (after `restoreIntraEnvelopeWiring`), plus ONE
//    changed line inside the existing entry literal.
/**
 * THE VEIL REACHES THE SNAPSHOTS (EM-B3e, design §11 and §12 item 4).
 *
 * `admitRestoredLifecycle` restores `versionHistory` VERBATIM on the account surface —
 * that is the point of §359.10, and it is right. But every element of that timeline
 * carries a WHOLE settlement (`recordSnapshotAction` writes `snapshotSettlement(...)`),
 * and `revertToSnapshotAction` promotes a snapshot onto the live saved record and
 * persists it. So a strip that reaches only `entry.settlement` leaves a keeper's
 * imported timeline carrying another account's editor state, one revert away from the
 * live world. The estate has already been bitten by exactly this shape at exactly this
 * seam, for the custom-content roster (`src/store/accountImportBody.js`).
 *
 * ⛔ WHY THE STRIP IS APPLIED HERE AND NOT IN `admitRestoredLifecycle`: that function
 * answers ONE question — does this field pass the live save-admission wall — and a
 * field that fails falls back to the reset value with a notice. A scrub is not an
 * admission: it never refuses, never notices, and must run on the admitted value.
 *
 * ⛔ AND WHY NOT IN `src/store/accountImportBody.js`, where the roster cure lives: the
 * roster remap needs the import session's identity map, which only the store has. This
 * strip needs nothing but the record — so one level down covers `prepareSettlementEntry`'s
 * OTHER caller (the reconciliation session) by construction, today and forever.
 *
 * Pure. REFERENCE-IDENTICAL when nothing is dropped: the array that went in comes back,
 * and so does every element that did not move. Reads every field by DESTRUCTURE, never
 * by a property access, so the observed-shape register cannot move (EM-B3d §6).
 *
 * @param {unknown} versionHistory the admitted lifecycle's timeline
 * @returns {unknown} the same array when nothing was dropped, else a new array
 */
function scrubRestoredHistoryEditState(versionHistory) { /* exact algorithm in §8 */ }

//    …and the entry literal's one changed line (`:654`):
    versionHistory: scrubRestoredHistoryEditState(lifecycle.versionHistory),

// ── src/lib/accountData.js — `withoutEditState` re-shaped in place, with its drop
//    extracted into ONE new module-private helper beside it. The declaration line
//    `function withoutEditState(entry) {` is byte-unmoved.
/** The settlement-level drop EM-B3a landed, extracted verbatim so the entry's live
 *  settlement and every settlement its timeline nests take the IDENTICAL operation.
 *  Reference-identical when neither key is present. The destructure-drop spelling and
 *  the `// eslint-disable-next-line no-unused-vars` directive are EM-B3a's, unchanged. */
function withoutEditKeys(settlement) { /* exact algorithm in §8 */ }

function withoutEditState(entry) { /* exact algorithm in §8 */ }
```

**Return shapes, exactly.**

- `scrubRestoredHistoryEditState` returns its input **by reference** when it is not an Array, and **by reference** when no element moved. Otherwise it returns a NEW array of the same length and order, in which every element that did not move is **the very element that went in** and every element that did is `{ ...element, settlement: <stripped> }` — the element's own key order preserved, its `id`, `ts`, `kind` and `label` untouched. A non-record element, a record without a plain-record `settlement`, and a record whose `settlement` is `null` / an array / a primitive are all returned **by reference, unexamined**. It reads no value inside either editor key, consumes no PRNG, reads no clock, mints no id, **throws on nothing**, and **mutates nothing** (the caller's raw file object is shared with the notices path).
- `withoutEditKeys` returns its input **by reference** when the settlement is not a plain object, is an array, or has neither key; otherwise a **shallow copy minus the two keys**, preserving the insertion order of every surviving key. This is EM-B3a's landed behaviour, unchanged in every branch.
- `withoutEditState` returns **the entry it was given, by reference**, when neither the live settlement nor any timeline element moved — *the case 100 % of real exports take at this landing, and the case `tests/lib/editTravel.test.js:166` pins with `toBe`*. Otherwise `{ ...entry, settlement?, versionHistory? }`, each replaced key keeping its ORIGINAL position (a spread over an existing key does not move it), and a key that did not move not re-assigned at all. A non-record `entry` (`null`, `undefined`, `0`, `''`, `[]`) is returned by reference and nothing throws.

**Ordering and precedence.** On the import half the history strip runs **after** `admitRestoredLifecycle` and **beside** the live settlement's strip, in the entry literal — so the value stripped is the value that will be stored, never a pre-admission candidate. On the export half the live settlement and the timeline are stripped in one pass, and the reference-identity test is taken over BOTH before anything is copied.

### THE SPELLING IS MEASURED, NOT PREFERRED

Executed with the tree's own TypeScript against `scanReaders`' own rule, with a failing control (`E-SPELL.out`):

| Source | COUNTED property reads | Receivers | Register cost |
|---|---:|---|---|
| the contracted import half | **1** | `Array` (`Array.isArray`) | **ZERO rows** |
| the contracted export half | **3** | `Array` (`Array.isArray` ×3) | **ZERO rows** |
| the refuted dotted alternative (the control) | **4** | `entry.settlement`, `entry.versionHistory`, `history[0].settlement`, `…settlement.dmLayer` | would MINT a new file entry for a path the inventory records as ABSENT |

`Array.isArray` is the live control's own spelling: the landed `scrubImportedEditState` uses it in `src/lib/importScrub.js`, a file the baseline's `inventory` records as **ABSENT**. `map`, `keys`, `length` and `push` are in `BUILTIN_MEMBERS` (`legacy-reader-shape-scan.mjs:67-77`) and are never counted. **Every read of `settlement`, `versionHistory`, `dmLayer` and `decrees` in this packet's production code is a DESTRUCTURE or an `Object.hasOwn` string literal.** A dotted read of any of the four is a STOP (§11).

### State schema

⛔ **BOTH VALUES STAY OPAQUE**, exactly as EM-B3a ruled (B3a-2) and EM-B3d kept. This packet drops by key NAME and asserts by deep equality and serialized-substring absence on the SURVIVING record; it names no field inside either value. Fixtures reuse `editTravel.test.js`'s existing `dmLayerFixture()` / `decreesFixture()`.

**Absence rules** — inherited unchanged from EM-B3d's strip on the import half and EM-B3a's on the export half; `empty`, `null` and malformed values are all PRESENT keys and are all DROPPED, and a record carrying neither key comes back by reference. **New here, for the timeline:**

- **`versionHistory` absent or `[]`** — the case every gallery import and every `restoreLifecycle: false` call takes: returned **by reference**, zero work.
- **a timeline whose elements carry neither key** — returned **by reference**, elements included. This is the dormancy case and it is 100 % of real records at this landing.
- **a malformed timeline** (`null`, a string, a number, `[]`, an element with no `settlement`, an element whose `settlement` is `null` or an array): every such element rides through **by reference**, nothing throws, and a well-formed element in the same array is still stripped. Executed: `2.5.import.malformed NO THROW len=9, element refs kept=true, last stripped=true`.
- **a settlement nesting its OWN `versionHistory`** — **OUT OF CONTRACT** (§2, §13 Q4). Measured: `snapshotSettlement` (`settlementSliceHelpers.js:129-134`) deletes a settlement's own `versionHistory` when a snapshot is recorded AND when one is restored to the live view, so no product writer makes one; and `revertToSnapshotAction` reads the ENTRY's timeline, never a settlement's, so a nested one promotes onto nothing.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| an account file whose `versionHistory[i].settlement` carries both keys | `prepareSettlementEntry(raw, { …, restoreLifecycle: true })` | `Object.hasOwn` inside `scrubImportedEditState`, per element | the entry's timeline keeps every snapshot, its labels and its order; no snapshot carries either key | none |
| the same file | `prepareSettlementEntry(raw, meta)` without `restoreLifecycle` | `resetLifecycle()` already returned `[]` | `versionHistory: []`, by reference | none |
| the same file | the reconciliation session (`importReconciliationAdmission.js:684`) | inherited — the same seam, no second spelling | same | none |
| a save whose `versionHistory[i].settlement` carries both keys | `buildAccountExport` → `preflightAccountExport` → `withoutEditState` | same | the exported entry's timeline carries neither key; every sibling byte-exact | none |
| a record carrying NEITHER key anywhere (every record today) | either door | neither key own, no element moved | **the identical object reference**, entry and array alike | none |
| a gallery dossier or map member | either gallery door | the door writes `versionHistory: []` as a literal | no timeline can exist | none |
| the owner's OWN save carrying both keys | save / load / `normalizeSettlement` / `revertToSnapshot` | this packet adds no arm here | both keys survive byte-exact | none |

### Determinism

- **Hash/fork key:** `NONE`. No random value, no clock, no id.
- **Stable enumeration:** the shallow copy after a rest-destructure preserves every surviving key's insertion order, at both levels. Executed: `2.2.import.keyOrder EXACT ["id","name","tier","population","spatialLayout","institutions"]`, and `2.4.export.cured BYTE-EXACT`.
- **Rounding/clamping:** none.
- **No-draw behaviour:** on a record carrying neither key anywhere, both halves return **the identical object reference**. ⭐ **At this landing that is EVERY import and EVERY export**, because nothing in `src/` writes either key. The two reference-identity arms (B3) are therefore this packet's **dormancy proof**, not a nicety: a copy-always implementation would silently move the bytes of every backup export ever taken.

### Flag and dormancy

- **Flag:** `NONE`.
- **Dormancy:** the whole packet is dormant at its own landing and becomes load-bearing the moment EM-C4a writes the first `dmLayer`.
- ⛔ **HZ-PERSIST-UNGATED holds by construction:** neither helper sits inside a flag conditional, and the arm that carries persisted state (`normalizeSettlement`'s spread) is untouched.
- **Golden posture:** `UNCHANGED`. `tests/property/generatorGoldenMaster.test.js` and `tests/property/dossierProseManifest.test.js` must not move; nothing here reaches the generator. Motion is a STOP (§P3.1).

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| never here; EM-C4a is the first writer and lands AFTER | adds **no domain reader** — every field is destructured (§6) | untouched: `row.version_history = entry.versionHistory` (`saves.js:163-165`) | untouched: `versionHistory: row.version_history \|\| []` (`saves.js:307`) | untouched | ⭐ **the undo path is WHY this packet exists** — `revertToSnapshotAction` promotes a snapshot onto the live record; the snapshot it promotes now carries neither key. The action itself is untouched | ⭐ **THIS PACKET'S CHARGE**, on both the account import and the account export. A migration of existing saves stays EM-B4's | untouched: EM-B3a's and EM-B3b's landed veils carry every other way OUT |

### Receipts and privacy

- **Closed kinds:** `NONE` — no receipt, no chronicle line, no analytics event, no user-visible notice. *(A dropped editor key is not a per-item restore notice: the roster block warns because a remap FAILED and content was lost; here nothing of the importer's own is lost — the keys were never theirs.)*
- **Numeric-to-word bands:** n/a — this packet renders nothing.
- **DM-only fields:** `settlement.dmLayer`, `settlement.decrees` — the finite list, and exactly this packet's subject.
- **Player/public projection:** unchanged; this packet touches no projection.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY:` no NPC, faction or deity state, no alignment axis.
- **Edit story:** `ENGINE-ONLY:` this packet exposes no verb. It is the last reach of EM-B3's travel seams, laid down before the writer that makes it matter.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/lib/accountImport.js` | one new module-private helper `scrubRestoredHistoryEditState`, placed after `restoreIntraEnvelopeWiring` and before `prepareSettlementEntry`'s docblock; and ONE changed line in the entry literal (`:654`) | `+14 eff` new, `1 changed / 0 added` at the literal | **(a)** Write the helper with §6's JSDoc and §8's algorithm. Reuse the file's own `isPlainRecord` (`:267`) — do not re-spell the guard. Read the element's `settlement` by DESTRUCTURE (`const { settlement } = element;`), never `element.settlement`. **(b)** Change `versionHistory: lifecycle.versionHistory,` to `versionHistory: scrubRestoredHistoryEditState(lifecycle.versionHistory),` **in place** — one changed line, zero added lines, so no line below it moves. ⛔ `meta.restoreLifecycle === true` (`:639`), `admitRestoredLifecycle`, `restoreIntraEnvelopeWiring`, `importedNeighbourLinkId` and `isPlainRecord` are `requiredSymbols` (WEB-5's and this packet's) and must survive verbatim; this edit touches none of them. The import brace at `:58` is NOT touched — `scrubImportedEditState` is already bound there. |
| `MODIFY` | `src/lib/accountData.js` | `withoutEditState` (`:209-215`) re-shaped in place, plus one new module-private helper `withoutEditKeys` immediately above it | `+28 eff / -6 eff` (net `+22`) | **(a)** Extract EM-B3a's drop into `withoutEditKeys`, **carrying its `// eslint-disable-next-line no-unused-vars -- intentional drop of the two editor keys` directive verbatim** and its branch structure unchanged. **(b)** Re-shape `withoutEditState`'s body per §8. ⛔ **The declaration line `function withoutEditState(entry) {` is byte-unmoved** — it is a `requiredSymbols` row asserted verbatim at every status. ⛔ **EM-B3a's docblock above it (`:186-208`) is amended IN PLACE and MUST gain the timeline sentence** — its present text says the omission is *"spelled here and nowhere else"* and *"replaces only `entry.settlement`"* by implication; leaving it would leave a header that undercounts its own reach, the exact drift EM-B3d's Q2 refused. Amend the existing paragraph; add at most **two** raw comment lines (0 effective). **(c)** `preflightAccountExport`'s call site, arity and position are untouched. |
| `TEST` | `tests/lib/editTravel.test.js` | B1, B2, B3, B5 | `n/a` | **4 literal-titled `test`s appended INSIDE the EXISTING second `describe`** (`EM-B3a — HZ-TRAVEL: …`), after `A6`. **No existing arm is edited and no new `describe` is opened.** Reuse `dmLayerFixture()`, `decreesFixture()`, `editedSettlement()`, `saveRow()` and `expectByteEqual()`; add one local `snapshot(id, settlement)` helper (not a test). No `.each`, no loop-generated test, no nesting, and **no variable, parameter or binding named `it`, `test` or `describe`**. Every absence is asserted as `expect(serialized.includes('"dmLayer"')).toBe(false)` beside a liveness anchor, or through `expectAbsentWithAnchor` — **this file carries no `FROZEN_UNANCHORED_NEGATIVES` row and must not acquire one**, so no bare `not.toHaveProperty` / `not.toContain` / `not.toMatch`. |
| `TEST` | `tests/lib/importScrub.test.js` | B4 | `n/a` | **1 literal-titled `it` appended inside the EXISTING `EM-B3d — scrubImportedEditState: an import carries no editor state` describe**, after `A5`. No new `describe`. ⛔ **Do not touch the un-anchored `expect(out).not.toHaveProperty(stripped)` at `:42`** — its `FROZEN_UNANCHORED_NEGATIVES` ceiling of 1 reds on a SHRINK — and add no new un-anchored negative: B4's assertion is a POSITIVE identity (`toBe`). |

| `MODIFY` | `src/lib/importReconciliationAdmission.js` | ⭐ **VERSION 2 — AN ADDRESSES-ONLY CITATION ROW** (§P2 row 14: outside the cap of three modified logic files; not a logic home). The two comment citations at `:442` and `:549` | `+0 eff`, **2 changed comment lines / 0 added / 0 removed** | Change `` `importScrub.js:115-121` `` to `` `importScrub.js:116-122` `` at `:442`, and `` `importScrub.js:158-166` `` to `` `importScrub.js:159-167` `` at `:549`. ⛔ **NOT ONE OTHER BYTE**: no logic, no import, no string that is not the address itself, no re-flow of the surrounding comment. The new addresses are MEASURED, not computed: `git show 429141e2d~1:src/lib/importScrub.js \| sed -n '115,121p'` and `sed -n '158,166p'` print the same text that stands at `:116-122` and `:159-167` at the tip. ⛔ The manifest's `action` is `MODIFY` because `PACKET_ACTIONS` is frozen at `CREATE\|DOC\|MODIFY\|REGISTER\|TEST` (`scripts/implementation-packets.mjs:31-37`; `:836` refuses anything else) — `CITATION` is this row's CLASS, never its action value. |
| `TEST` | `tests/lib/importReconciliation.test.js` | ⭐ **VERSION 2 — the third drifted citation**, comment-only, at `:604` | **0 literal-titled `it`s**, `+0 eff` | Change `` `importScrub.js:115-121` `` to `` `importScrub.js:116-122` `` in the comment above `test('⭐ a world the LIT PRODUCT minted arrives with no roster AND no foreign birth law')`. ⛔ **No `it`, no `test`, no `describe`, no assertion is added, edited, removed or anchored** — this file carries `FROZEN_UNANCHORED_NEGATIVES['tests/lib/importReconciliation.test.js'] = 1` (`negativeAssertionAnchor.walker.test.js:624`), a FILE-keyed ceiling that reds on a SHRINK. It homes ZERO acceptance cases and adds ZERO titles: the lighting delta stays `+5`. |

⚠ **`TEST`, not `CREATE`, for both test rows** (interim rule 4): both files exist at the verified base, and `validate:packets` errors on any non-`CREATE` row whose path is absent. **This packet CREATEs no file**, so it opts into no new directory walker and owes no `scripts/mutation-coverage-manifest.json` row (interim rule 15; `ENFORCER_DIRS` read at the tip, `tests/lib` is not one).

**Generated artifacts:** `NONE`. No `checks` command of this packet runs a generator, so the ordering hazard of §P2 row 12 does not arise.

**Interim rule 1 — the wiring census:** `+0`. This packet CREATEs no `.js` under `src/generators/**` or `src/domain/**` — the two roots measured — and neither `src/` path is in the census's `stamp.files`. **`docs/content/wiring-census.json` appears in neither §7, nor the `changeManifest`, nor `checks`.**

**Interim rule 13 — line-addressed registers:** `none found`, re-measured at `429141e2d` for **all SIX** paths (version 2's two included). The two new ones: `src/lib/importReconciliationAdmission.js` appears only in `scripts/.observed-shape-readers-baseline.json`, which is CONTENT-keyed, and `tests/lib/importReconciliation.test.js` only at `tests/lint/negativeAssertionAnchor.walker.test.js:624`, a FILE-keyed ceiling of 1 that this packet neither shrinks nor grows (no assertion is touched). Neither is addressed BY LINE, so neither owes a re-address — and both edits are comment-only, so no line below them moves in any case. For the original four, the command `git grep -n -F '<path>' -- tests/lint scripts` returns only `scripts/.observed-shape-readers-baseline.json` (content-keyed, not line-addressed), `scripts/.slugify-idiom-baseline.json` (a file list) and `tests/lint/publicIdentitySingleRender.walker.test.js` (a file-keyed rationale map) — plus `negativeAssertionAnchor.walker.test.js:626`, a FILE-keyed ceiling. No register addresses any of this packet's paths BY LINE, so no re-address is owed.

**Interim rule 16 — a renamed or re-shaped binding:** this packet renames nothing and changes no exported call shape. `withoutEditState` and `scrubRestoredHistoryEditState` are module-private; `prepareSettlementEntry`'s and `preflightAccountExport`'s signatures, arities and return shapes are byte-identical. Command: `git grep -n -F 'withoutEditState' -- tests scripts docs/implementation` → the only hits are `docs/implementation/PACKET_MANIFEST.json` (EM-B3a's `_note` and EM-B3d's §11 prose), neither of which is a call shape. `git grep -n -F 'lifecycle.versionHistory' -- tests scripts docs/implementation` → no hits.

### ⭐ THE BUNDLE BUDGETS, PRICED — AND THIS PACKET OWES NOTHING

| Budget | Instrument and bound | Does this packet land in it? |
|---|---|---|
| First-paint eager closure | `EAGER_FIRST_PAINT_MODULES` IMPORTED live from `vite.config.js` (E-BUD); as executed history with an as-of mark, **269 at `429141e2d`**. Bound: `CLOSURE_BUDGET_BYTES` `1_048_000` | **NO** — `accountImport.js`, `accountData.js`, `importScrub.js`, `accountImportBody.js` **and version 2's `importReconciliationAdmission.js`** all probe `false` against the imported set (re-executed at `429141e2d`: the set holds **269** modules). Delta **+0 modules, +0 B** — and version 2's two rows are comment-only, which no minified bundle carries |
| Generation worker | `WORKER_BUNDLE_CEILING_BYTES` (`tests/build/generationWorkerLazy.test.js`), EXACT, zero slack | **NO** — neither `src/` path is in `src/workers/generation.worker.js`'s static source closure (EM-B3d measured the same two files at its own tip; re-derived here from the import graph) |
| Lazy engine chunk | `tests/build/vendorPdfLazy.test.js` | **NO** — the chunk rule keys on `/src/generators/` plus `/src/data/narrativeData.js`; no path of this packet matches. ⛔ **Interim rule 14: this packet is NOT its train's byte-arm holder and carries NO row on that path**, predicting **+0 B** here as in every closure. Train EM-T10's holder is the chair's to name at the pre-proof; EM-D0b holds train EM-T9's |
| Edge-shared bundles | the five `supabase/functions/_shared/*.meta.json` `inputs` closures | **NO** — zero hits for either `src/` path |

⇒ **No ceiling TEST row, no stated byte bound, no re-mint.** The two `src/` files are lazily reached (`accountImportLazy.test.js` pins the account-import body behind its dynamic-import trampoline, and that pin is in `checks`).

**No other file may be edited.**

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. **Capture the baseline**, in this order, before any edit: (a) `shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json`; (b) the lighting tuple from `tests/lint/.lighting-census-baseline.json`; (c) `node scripts/check-observed-shape-readers.mjs > "$SCRATCH/osr-base.log" 2>&1; echo "exit $?"` — **never through a pipe**; (d) the suites this packet must not move, green: `editTravel`, `importScrub`, `accountData`, `accountImport`, `importReconciliation`, `accountImportSlice`, `treasuryDormancy.byteIdentity`.
2. **Write B1, B2 and B5 as FAILING tests first** against the uncured tree and QUOTE the red — B1 and B2 red because the serialized record still contains `"dmLayer"`, B5 red because the arms do not exist. ⚠ **B3 and B4 cannot be red-first**: B3's reference identity holds vacuously before the walk exists, and B4's holds on the SHIPPED function (it is the correct behaviour the mutant breaks). Per §P6's EM amendment each is proved by its **counterforce**, planted and restored to the exact pre-mutant SHA-256:
   - **B3's counterforce** — replace `withoutEditState`'s final reference-identity test with an unconditional `return { ...entry }`: B3's named title reds, and so does the landed `A7 — the three travel surfaces, executed end to end` at `:166`.
   - **B4's counterforce (the verifier's M7)** — replace `scrubImportedEditState`'s two `Object.hasOwn` probes with `in`: B4's named title reds. *(This plants a mutant in `src/lib/importScrub.js`, a file OUTSIDE this manifest. It is a plant-and-restore in the working tree only, with the pre- and post-restore SHA-256 quoted in the receipt; if the chair prefers no mutant outside the manifest, B4 is instead proved by the shipped-behaviour assertion alone and the counterforce is recorded as not run — §13 Q2 is NOT about this, so the lane's default is: plant, quote, restore, and prove the restore.)*
3. `src/lib/accountData.js`: extract `withoutEditKeys`, re-shape `withoutEditState`, amend EM-B3a's docblock in place.
4. `src/lib/accountImport.js`: add `scrubRestoredHistoryEditState`, then change the entry literal's one line. `git diff -U0 -- src/lib/accountImport.js` must show the helper's block plus **exactly one changed line and zero added lines** at the literal.
5. `tests/lib/editTravel.test.js`: B1, B2, B3, B5 appended inside the existing second `describe`.
6. `tests/lib/importScrub.test.js`: B4 appended inside the existing `EM-B3d` describe.
7. Run focused verification (§10), then `tests/lint` WHOLE in its two halves, then the goldens plain.
8. `shasum -a 256` the two goldens again: identical to step 1(a). Any motion is a STOP.
9. Write the completion receipt.

**Bounded algorithm — `scrubRestoredHistoryEditState(versionHistory)`:**

```text
1. If versionHistory is not an Array, return versionHistory.                 (REFERENCE-IDENTICAL)
2. moved := false
3. next := versionHistory.map(element =>
     a. if element is not a plain record            -> return element         (by reference)
     b. destructure { settlement } from element
     c. if settlement is not a plain record         -> return element         (by reference)
     d. scrubbed := scrubImportedEditState(settlement)
     e. if scrubbed === settlement                  -> return element         (by reference)
     f. moved := true; return { ...element, settlement: scrubbed })
4. return moved ? next : versionHistory.                                     (REFERENCE-IDENTICAL)
```

**Bounded algorithm — `withoutEditKeys(settlement)`** (EM-B3a's landed drop, extracted verbatim):

```text
1. If settlement is falsy, not an object, or an Array, return settlement.    (REFERENCE-IDENTICAL)
2. Destructure { dmLayer, decrees, ...rest } = settlement.                   (a drop, never a read)
3. Return Object.keys(rest).length === Object.keys(settlement).length ? settlement : rest.
```

**Bounded algorithm — `withoutEditState(entry)`:**

```text
1. Destructure { settlement: liveSettlement, versionHistory: history } = entry || {}.
2. nextSettlement := withoutEditKeys(liveSettlement)
3. nextHistory := history
4. If history is an Array:
     moved := false
     mapped := history.map(element =>
       a. if element is falsy, not an object, or an Array -> return element   (by reference)
       b. destructure { settlement } from element
       c. scrubbed := withoutEditKeys(settlement)
       d. if scrubbed === settlement                      -> return element   (by reference)
       e. moved := true; return { ...element, settlement: scrubbed })
     if moved then nextHistory := mapped
5. If nextSettlement === liveSettlement AND nextHistory === history, return entry.  (REFERENCE-IDENTICAL)
6. Return { ...entry,
            ...(nextSettlement === liveSettlement ? {} : { settlement: nextSettlement }),
            ...(nextHistory    === history        ? {} : { versionHistory: nextHistory }) }.
```

⛔ Step 1 of `withoutEditState` and step 3b of both walks are DESTRUCTURES, never property reads (§6). Every one of these eighteen branches was executed standalone against this read tip before this packet was written (`E-BEHAV.out`, 18 rows).

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| B1 | ⭐ **THE IMPORT, AT THE CONFIGURATION THE PRODUCT USES** (the verifier's FIX-1 + FIX-1b) | a raw account entry whose `settlement` AND whose `versionHistory[0].settlement` and `versionHistory[1].settlement` each carry both keys planted opaque, driven through `prepareSettlementEntry(raw, { ...META, restoreLifecycle: true })` — the exact meta `src/store/accountImportBody.js:414` passes | the prepared entry's **serialized** form contains neither `"dmLayer"` nor `"decrees"` **at any depth**. Anchored: the timeline is still there and still the user's — `versionHistory` has length **2**, both `label`s survive in order, and each snapshot's settlement keeps every other key; plus the entry's own `name`, `tier` and `importedFrom.source` survive, so an emptied entry cannot pass | `tests/lib/editTravel.test.js` |
| B2 | ⭐ **THE EXPORT, THE PARITY ARM** (the verifier's FIX-1, the way OUT) | `buildAccountExport` over a save row carrying both keys on its live settlement AND on `versionHistory[0].settlement` | the serialized export contains neither key **at any depth** with a history present. Anchored: the export carries the save, its name and its timeline (`settlements[0].versionHistory` length 1, the snapshot's label and every sibling intact), and every sibling of the edited save survives **byte-exact** beside the two omissions | `tests/lib/editTravel.test.js` |
| B3 | ⭐ **DORMANCY, BOTH DIRECTIONS, WITH A TIMELINE PRESENT** — *the case 100 % of real records take at this landing* | (i) an export save row carrying neither key anywhere, with a two-element history; (ii) the same row with `versionHistory: []`; (iii) the import's admitted timeline carrying neither key; (iv) `versionHistory` absent and non-array | (i) and (ii): `buildAccountExport`'s entry is **the very object that went in** (`toBe`) — the sibling of the landed `A7` pin at `:166`, now with a history; (iii) the prepared entry's `versionHistory` is **the very array** the admitted lifecycle produced, every element by reference; (iv) nothing throws and the value rides through unchanged | `tests/lib/editTravel.test.js` |
| B4 | ⭐ **THE INHERITED KEY** (the verifier's FIX-2 — kills mutant **M7**, `in` for `Object.hasOwn`) | `const child = Object.create({ dmLayer: {}, decrees: [] }); child.name = 'Heir';` | `scrubImportedEditState(child)` is **the identical reference** (`toBe(child)`), and `child.name` still reads `'Heir'` — an INHERITED key is not an own key, so the dormancy contract holds and nothing is copied. Executed against the shipped function and against the `in` mutant: shipped `REF-IDENTICAL`, mutant `CLONED` (`E-BEHAV.out` 3.M7) | `tests/lib/importScrub.test.js` |
| B5 | **A MALFORMED TIMELINE NEVER THROWS AND NEVER SWALLOWS** | a `versionHistory` of nine elements: `null`, `undefined`, a string, a number, `[]`, `{ id }` with no settlement, `{ settlement: [] }`, `{ settlement: null }`, and one well-formed snapshot carrying both keys — driven through BOTH doors | neither door throws; the array's length and order are unchanged; the eight malformed elements come back **by reference**; and the one well-formed snapshot is still stripped — a bad neighbour never shelters a real one | `tests/lib/editTravel.test.js` |

This table is the entire edge-case budget. **The observed-shape register is deliberately NOT an acceptance case** — §6's measurement is a compile-time fact about a spelling and `node scripts/check-observed-shape-readers.mjs` in §10 is its proof.

⭐ **THE VERIFIER'S MUTANT TABLE, DISCHARGED.** M1 (*strip the live settlement only, not a restored snapshot* — the shipped behaviour) dies under **B1** on the import half and **B2** on the export half; M7 (*`in` for `Object.hasOwn`*) dies under **B4**. Both were re-executed at this read tip before this packet was written (`E-BEHAV.out` part 3). The mutants this packet's own §10 plants are named in §8 step 2: the unconditional-clone mutant (B3's counterforce) and M7 (B4's counterforce); a *strip-the-first-element-only* mutant is structurally impossible to survive B1, whose fixture carries **two** snapshots and whose assertion is over the whole serialized entry.

## 10. Verification commands

```sh
# Focused static checks — eslint runs BARE, never through the mutex
npx eslint src/lib/accountImport.js src/lib/accountData.js \
  tests/lib/editTravel.test.js tests/lib/importScrub.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# The observed-shape register, plain and read-only — NEVER through a pipe
node scripts/check-observed-shape-readers.mjs > "$SCRATCH/osr-head.log" 2>&1; echo "exit $?"; tail -5 "$SCRATCH/osr-head.log"

# Focused tests — ONE test directory per gated run
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lib/editTravel.test.js tests/lib/importScrub.test.js tests/lib/accountData.test.js \
  tests/lib/accountImport.test.js tests/lib/importReconciliation.test.js \
  tests/lib/importReconciliationRecovery.test.js tests/lib/accountSettlementContentPortability.test.js \
  tests/lib/customContentCharsetRestoreSplit.test.js

# ⭐ VERSION 2: tests/store gains the Q4 PIN's second arm (advertisedUndoArming)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/accountImportSlice.test.js tests/store/campaignRuntimeCallerCoverage.test.js \
  tests/store/advertisedUndoArming.walker.test.js

# ⭐ VERSION 2: tests/domain gains the Q4 PIN's first arm (townMapEdits)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/treasuryDormancy.byteIdentity.test.js tests/domain/livingContentLawWiring.test.js \
  tests/domain/townMapEdits.test.js

# The GOVERNING LINT FILES — sealed in `checks` (interim rule 8), the lighting walker excluded
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/publicIdentitySingleRender.walker.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/customContentCharsetWiring.test.js \
  tests/lint/premiumGateSingleSource.test.js tests/lint/sourceCitationIntegrity.walker.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/accountImportLazy.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/components/covenantClaimsParity.test.js tests/components/campaignImportPanel.test.jsx \
  tests/components/faithPanelModel.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ui/accountW4d.test.jsx tests/ui/accountDataPrivacySection.test.jsx

# ⭐ THE BUILD LANE'S INSTRUMENTS — NOT sealed checks (interim rule 8). Run both before the commit.
#   (a) the EXCLUDED directory run — MUST EXIT 0
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js
#   (b) the LIGHTING WALKER ALONE — reds BY DESIGN under a train
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js

# The goldens, plain — ⭐ VERSION 2 adds habitNeutralIdentity, the second governing
# test of `src/lib/importReconciliationAdmission.js` (interim rule 8, computed at the tip:
# `git grep -l -F 'importReconciliationAdmission' -- tests` → accountImport.test.js, which
# is already in the first array, and this one)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/property/habitNeutralIdentity.test.js

node scripts/implementation-packets.mjs validate

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B3e
npm run implementation:resume -- EM-B3e

# Wave-end presentation-safe invocation; never pipe
npm run check:tail
```

**Expected:** every command exits `0`. ⛔ **A gate line with no printed test count DID NOT RUN** — `gate-mutex.sh --run` gives up after its poll budget and **exits 3** (`GAVE UP`), so never drop the two exports. Report actual counts; copy no historical count. No generator is among these commands, so no step invalidates a later one. ⛔ **This packet touches no `src/components/**`, no route, no `data-testid` and no accessible name, so interim rule 10 names NO `e2e/` spec.**

**The train's interior red (named before it exists):** `tests/lint/sovereigntyLightingContract.walker.test.js` reds on this member's commit, because the census tuple is an exact equality and this member adds test titles. ⛔ **The prediction is a DELTA, never a tuple.** The predicted message has the SHAPE `expected <baseline titles + 5> to be <baseline titles>`.

| Figure | Walker semantics | **EM-B3e's delta** | Derivation |
|---|---|---:|---|
| `files` | every `*.test.js(x)` under `tests/` | **+0** | this packet CREATEs no test file |
| `parked` | files with ≥1 park reason | **+0** | no file's park status changes: every added registration is a straight-line literal `it` / `test` under an EXISTING literal `describe`, with no `.each`, no loop, no conditional and no rebinding of `it` / `test` / `describe` |
| `credited` | files with zero park reasons | **+0** | same — both files are ALREADY credited |
| `titles` | literal test titles in CREDITED files | **+5** | 4 new `test`s in `tests/lib/editTravel.test.js` + 1 new `it` in `tests/lib/importScrub.test.js` |
| `suiteTitles` | literal `describe` titles in CREDITED files | **+0** | no new `describe`; both additions join existing suites |

⭐ **THE CREDITED-FILE CONDITION IS DISCHARGED, NOT DEFERRED.** EM-B3d added five `it`s to `tests/lib/importScrub.test.js` and one `test` to `tests/lib/editTravel.test.js` and its executed lighting run reported `expected 25558 to be 25552` — **`titles +6`**, the exact sum. A `+6` is only reachable when BOTH files are credited (a parked file's titles count nowhere), so **both files are CREDITED — CONFIRMED by an executed run**, as of `392d5483d` / `429141e2d`. The pre-proof may still print `parkReasonsFor` for the record, but this packet's `+5` does not rest on an inspection.

**The absolute is the chair's stamp at promotion**, read from the live `tests/lint/.lighting-census-baseline.json` and added to this delta. Re-derived whole at the TERMINAL, by the chair, never inside this packet (§P2.1, §P3.2). ⛔ The deferred lighting row names `tests/lint/.lighting-census-baseline.json`, never the walker.

**Registers that do NOT move, measured at the read tip:** the observed-shape register (**zero rows** — E-SPELL); `scripts/mutation-coverage-manifest.json` (**zero rows owed** — no CREATE, and `tests/lib` is not an `ENFORCER_DIR`); `docs/content/wiring-census.json` (**`+0`**, measured against `src/generators/**` and `src/domain/**`; not named anywhere in this packet); `tests/lint/.prose-numerics-baseline.json` (zero rows, nothing rendered); `scripts/.size-baseline.json` (no entry, none owed); `negativeAssertionAnchor.walker.test.js`'s ceiling for `tests/lib/importScrub.test.js` (stays at **1**) and `tests/lib/editTravel.test.js` (stays ABSENT); `scripts/check-writer-reach.mjs` (no `src/domain/edit/**` file in this manifest); `scripts/.test-ratchet-baseline.json` (a scope FLOOR, not an equality); and **no bundle ceiling** (this packet reaches none; the train's byte-arm holder is EM-D0b).

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state; or resume reports authority, HEAD, foreign-work or receipt-integrity drift;
- the verified base is older than EM-B3d's composed build — `scrubImportedEditState` would not exist and this packet's premise would be false;
- **a PROPERTY READ of `dmLayer`, `decrees`, `settlement` or `versionHistory` appears in this packet's production code** (`element.settlement`, `entry.versionHistory`, `s?.decrees`, any dotted access). It mints observed-shape rows through a door only the chair may open (§6);
- **either half clones unconditionally**, or a reference-identity branch is removed — that is the dormancy contract and the bytes of every export ever taken;
- the strip is proposed for `normalizeSettlement`, `saves.js`, `persistProjection.js`, `persistMerge.js` or `worldExport.js`;
- the cure is proposed inside `admitRestoredLifecycle` (an admission is not a scrub) or inside `src/store/accountImportBody.js` (it would leave `prepareSettlementEntry`'s other caller uncovered) — either is a §13 Q3 question, never a lane's to re-decide;
- a **THIRD** settlement-bearing field of a saved entry is discovered that this packet does not cover, or a gallery door is found able to carry a timeline — either is a finding to report, never to fold in silently;
- `tests/lib/importScrub.test.js`'s existing un-anchored site at `:42` is anchored, or `tests/lib/editTravel.test.js` acquires a `FROZEN_UNANCHORED_NEGATIVES` row;
- `A6` or `A7` in `tests/lib/editTravel.test.js`, or `A1`–`A5` in `tests/lib/importScrub.test.js`, is edited;
- `src/lib/importScrub.js` is edited (rather than its mutant planted and restored under §8 step 2), or anything under `src/domain/edit/**` is imported by this packet's code or tests;
- a golden, the prose manifest, or any register outside this manifest moves;
- an acceptance case needs a sixth sibling, or any §3 limit is exceeded;
- ⭐ **VERSION 2 (Q2):** anything but the three ADDRESSES changes in `src/lib/importReconciliationAdmission.js` or `tests/lib/importReconciliation.test.js` — a logic byte, an assertion, a test title, an import, or a re-flowed comment. Either file's edit is `115-121` → `116-122` / `158-166` → `159-167` and nothing else. If the cited text is NOT found at `:116-122` and `:159-167` at the dispatch base, the base is not EM-B3d's composed build: STOP;
- ⭐ **VERSION 2 (Q4):** either PIN ARM is absent, renamed, or red before the first edit — `tests/domain/townMapEdits.test.js` › `snapshot/revert/undo/persist substrate: cloneJson + snapshotSettlement carry the container`, or `tests/store/advertisedUndoArming.walker.test.js` › `the versionHistory record kind: both writers really write the timeline`. They are `requiredSymbols` rows: the premise this packet's §2 declares out of contract stands on them, and a premise whose pin has gone is an assumption again.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (predicted: `accountImport.js +14 eff` with **1 changed / 0 added** at the entry literal; `accountData.js +28 / -6 eff`; the two test files; and version 2's two comment-only files at **`+0 eff`**):
- ⭐ **VERSION 2 (Q2) — the citation re-address, proven:** `git diff -U0 -- src/lib/importReconciliationAdmission.js tests/lib/importReconciliation.test.js` showing exactly THREE changed comment lines, zero added, zero removed, and `git grep -n -F 'importScrub.js:' -- src tests` afterwards printing `:116-122` twice and `:159-167` once, with no `115-121` / `158-166` left outside EM-B3d's own landed prose:
- ⭐ **VERSION 2 (Q4) — the pin, green:** `tests/domain/townMapEdits.test.js` and `tests/store/advertisedUndoArming.walker.test.js` ran inside their own `checks` arrays, with counts; both `requiredSymbols` titles resolved at the seal and again at the LANDED flip:
- The net-zero proof at the entry literal: `git diff -U0 -- src/lib/accountImport.js` showing exactly one changed line and ZERO added lines at `versionHistory:`:
- Acceptance cases B1–B5, and the TWO counterforces §8 step 2 requires, quoted beside B3 and B4 (the planted mutant, its red title, the restored SHA-256, the re-run green) — including the proof that `src/lib/importScrub.js` was restored byte-identically:
- Focused commands, exits, and counts (every gate line carrying a printed test count):
- `tests/lint` in its two instrument halves (§10): the EXCLUDED directory run (exit 0) and the lighting walker ALONE (the named interior red). Exit, count, and wall-clock for each:
- The observed-shape register: exit captured from the command itself, with its finding count before and after — predicted **identical, zero rows moved**:
- The lighting census delta, re-derived at the terminal against the DELTA predicted in §10 (`files +0 · parked +0 · credited +0 · titles +5 · suiteTitles +0`) applied to the baseline the chair stamped at promotion:
- Both typecheck configurations, by name:
- Dormancy/golden result (posture UNCHANGED): the two `shasum -a 256` values before the first edit and after the last, identical:
- Bundle/first-paint result: the four budgeted closures were priced at compile and this packet reaches **NONE** (§7); the train's byte-arm holder is **EM-D0b** and this packet carries no row on its path:
- Registers moved: observed-shape `0 rows` / mutation-coverage `none owed` / wiring census `+0, unnamed` / prose-numerics `n/a` / size-baseline `n/a` / anchor ceilings `unmoved` / test ratchet `unmoved` / bundle ceilings `none touched`:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation — carried forward from the compile so the chair can slot each one (the owner's law: there is never deferred work):
  - ⛔ **EM-C4a's `Depends on` row owes `EM-B3e`** beside `EM-B3d`, and its charter row's travel-test arm (*"a REAL written layer run through EM-B3a's travel tests"*) should name the RESTORED HISTORY on both directions, not only the live settlement. A compile lane does not edit another packet; this is the chair's one-line act.
  - ✅ **RULED AND CARRIED IN VERSION 2** (the chair, judgment 85): the three live citations `importScrub.js:115-121` / `:158-166` are re-addressed to `:116-122` / `:159-167` by this packet's own two §7 rows. The receipt quotes the three changed comment lines and the `git diff -U0` proving `+0` effective lines in both files.
  - `src/store/accountImportBody.js`'s roster block walks the same timeline this packet now strips, with its own hand-written `snapshot.settlement` guard. Two walks over one array is not a defect, but it is the shape a third walk would make a habit. Recorded, not investigated.
- Judgment calls: `NONE` beyond the four questions of §13, each of which is the chair's.

## 13. Questions only the chair can answer

**Q1 — FIX-1b: DISCHARGE BY ADDITION OR BY EDITING EM-B3d's SEALED A6?** The verifier's FIX-1b says *"A6 must also drive `prepareSettlementEntry(rawEntry, { ...META, restoreLifecycle: true })`"*. A6 is a SEALED acceptance case of EM-B3d, whose §7 row contracts that *no existing arm is edited* and whose manifest lists six `acceptanceCases`. This packet discharges FIX-1b by **adding B1**, a new arm that drives the product's own configuration, and leaves A6 byte-untouched. The alternative is to grow A6 in place, which re-opens a READY packet's sealed case and moves nobody's number. **The lane recommends ADDITION (as compiled).** If the chair prefers the edit, the cost is one `TEST`-row sentence in EM-B3d version 6 and a `titles +4` instead of `+5` here.

**Q2 — ✅ RULED (the chair, 2026-09-21 03:12, judgment 85): EM-B3e CARRIES IT, and version 2 does.** The two rows are in §7 and in the capsule, set-equal. ⛔ **ONE MEASURED CORRECTION to the recommendation below:** the manifest action is `MODIFY`, not `CITATION` — `PACKET_ACTIONS` is frozen at `CREATE|DOC|MODIFY|REGISTER|TEST` (`scripts/implementation-packets.mjs:31-37`) and `:836` refuses any other string (`changeManifest[i].action is unknown`); the estate has **0** landed `CITATION` rows and the named §P2-row-14 precedent, EM-R0d's `holderTable.js`, is spelled `MODIFY`. "ADDRESSES-ONLY CITATION" is the row's CLASS in §7 and the budget exemption, never its action value. The drift was re-proven against `429141e2d~1` rather than inherited. *The original question, kept as the record of what was asked:*

**Q2 (as asked in version 1) — WHO CARRIES THE `importScrub.js` CITATION RE-ADDRESS?** EM-B3d's answered Q2 (2026-09-21, at placement) says the three drifted citations *"are re-addressed as an ADDRESSES-ONLY CITATION row in the FIRST Edit-Mode packet compiled after this probe."* Two packets are compiling in this window — EM-B3e and EM-P4 — and neither brief names the duty. Measured here: the drift is real and is exactly one line (`:115-121` → `:116-122`, `:158-166` → `:159-167`), and no gate reds (the citation walker's ARM 1 is past-EOF only). **The lane recommends that EM-B3e carry it**, as two rows outside the logic cap — `src/lib/importReconciliationAdmission.js` as an ADDRESSES-ONLY `CITATION` row (two hits) and `tests/lib/importReconciliation.test.js` as a comment-only `TEST` row (one hit) — because this packet already declares that file family and EM-P4 touches a different one. **It is NOT in the compiled manifest**, so the chair's ruling costs one act either way: add the two rows here, or name EM-P4 (or a later member) and leave this packet's four rows as compiled.

**Q3 — THE SEAM: `src/lib/` OR `src/store/accountImportBody.js`?** The launch ruling asked this explicitly. **Measured answer: `src/lib/`, one level down from the roster cure's seam, and the reason is asymmetric rather than stylistic.** The roster cure MUST live in the store: it needs `contentIdentityMap` and `bindingDestinations`, which only the import session holds, and it must emit per-record user notices. This strip needs nothing but the record, emits nothing, and refuses nothing — so putting it in `prepareSettlementEntry` covers that function's OTHER caller (`src/lib/importReconciliationAdmission.js:684`, whose lifecycle resets TODAY but which is one `restoreLifecycle: true` away from the same hole) by construction, keeps the import half testable headlessly in the suite that already drives that door, and keeps the strip beside the live settlement's own strip at `:617` rather than 200 lines away in another layer. **The lane recommends the contracted shape and records that it improvised no second shape.**

**Q4 — ✅ RULED (the chair, judgment 85): NO RECURSION — and version 2 PINS the premise instead of assuming it.** The two arms are §5.2's row, `requiredSymbols` rows, and `checks` members: `tests/domain/townMapEdits.test.js` › `snapshot/revert/undo/persist substrate: cloneJson + snapshotSettlement carry the container` (`expect(snap.versionHistory).toBeUndefined()` — reds the moment a writer stops stripping a settlement's own timeline into a snapshot payload), and `tests/store/advertisedUndoArming.walker.test.js` › `the versionHistory record kind: both writers really write the timeline` (`expect(writers.sort()).toEqual(['commitPendingEdits','recordSnapshot'])` plus `OPERATIONS.revertToSnapshot.undoState === 'external:auto-pre-revert-snapshot'` — reds the moment a second advertised promotion or record path appears). Re-executed at this tip (`Q4-BEHAV.out`): `4.1` snapshotSettlement STRIPS; `4.2` the live-view half of the revert (`:145`) strips while the saved-record half (`:133`, `cloneJson`) does not, so a HAND-CRAFTED nested timeline rides onto the saved record as dead data; `4.3` the revert indexes the ENTRY's array, never the settlement's; `4.4` the contracted strip is depth-1 and a nested key survives — exactly what §2 declares out of contract, now with a receipt. ⚠ **THE ONE SHAPE NEITHER ARM CONVICTS, stated for the chair:** an UNADVERTISED promotion added inside an already-registered action (it changes no `ARMING` row and mints no new operation). Closing that needs a source-census walker over `savedSettlements[i].settlement =` assignments — a `tests/lint` CREATE, its own mutation-manifest row, and a packet of its own. **The lane recommends NOT widening EM-B3e** and leaves the shape as a named finding for the chair to slot. *The original question, kept as the record of what was asked:*

**Q4 (as asked in version 1) — SHOULD THE WALK RECURSE INTO A SETTLEMENT'S OWN TIMELINE?** The contract covers the two positions the ENTRY shape defines (`entry.settlement`, `entry.versionHistory[i].settlement`) and does NOT recurse into `settlement.versionHistory[j].settlement`. Measured for the recommendation: `snapshotSettlement` deletes a settlement's own `versionHistory` when a snapshot is recorded and again when one is restored to the live view, so **no product writer can create that nesting**; and `revertToSnapshotAction` reads the ENTRY's timeline, never a settlement's, so a nested one **promotes onto nothing**. A hostile file could still hand-craft one, and it would ride the next export as dead data. **The lane recommends NO recursion** — an unbounded walk over user-supplied JSON is a denial-of-service surface for a value that no code path can read, and the honest contract is the one this packet states. If the chair wants it covered, the cheapest lawful shape is a depth-2 bound inside `withoutEditKeys`' callers (about 6 effective lines each side, one more acceptance case), not an unbounded recursion.
