# EM-R0a VERSION 2 — COMPILE REPORT (Opus COMPILE lane resumed, 2026-09-19 ~18:5x–19:1x EDT)

## Verdict

**DRAFT — READY-able in one pass.** Every §22.3 ruling is applied and measured. **One ruling's
EXAMPLE LIST is refuted on one member by the ruling's own TEST** (`authoredTensions`), which is a
question, not a block. Four new questions stand; nothing is BLOCKED.

**Tree:** `$SP/read-tip-ad7ddf2c9`, HEAD `ad7ddf2c9712a4f9e17a194e3ba2891bf23cc246`, `git status
--porcelain -uall` = 0 lines at entry and at exit. `src/` differs from version 1's tree in ONE file
(`calamityKernel.js`, EM-B1e's ruin writer) and **the whole version-1 census is byte-identical**.
Nothing edited, staged or committed anywhere; no vitest, eslint, npm script or build; all writes
through absolute paths into this lane's own scratch. Version 1 is preserved beside version 2 as
`EM-R0a.v1.*`.

## What changed from v1 — eight things, every one measured

| # | change | driver |
|---:|---|---|
| 1 | ⭐ **The generation receipt is split BY PATH**: `generationCoherenceReceipt` becomes a **READING** with ONE exception, `generationCoherenceReceipt.repairs` → **HISTORY**. The five `V-EVIDENCE-*` invariants stay LIVE and §5.2b names the path each reads | §22.3 item 1 |
| 2 | Groups carry `{ id, root, members }`, `members: null` = the whole object; groups never nest (A6) | item 2, ratified |
| 3 | ⭐ **A collection under a cross-entry total is ATOMIC** — the sweep found **TWO**, and **REJECTED TWO** | item 3 |
| 4 | The group register is **six**; `income-shares` struck by (3); the seed is **FIVE** shapes, as v1 measured | item 4 |
| 5 | ⭐ **The register is total over a SAVED record**: four saved-only keys classed, one of which nothing writes | item 7 |
| 6 | `stress ≡ stressors`, the HELD-internal pairs and the referential services invariant leave this packet | item 5, Q3 |
| 7 | Name ratified (`recordRegister.js`); walker stays in `tests/lint`; the manifest row is SEQUENCED behind EM-B1d | Q4, Q6 |
| 8 | Base moved to `ad7ddf2c9`; the preamble's hash moved (`1cf5442719…` → `b90a95b7af…`, §P2 row 12) | the new tip |

Budget: **163 effective lines** (was 126), bound ≤210, cap 250 — **still one leaf**. Acceptance
cases 7 → **8** (A7, the cross-entry totals). Change paths unchanged at 3.

## The receipt's sub-path table — the input each one reads

Measured by rebuilding `buildGenerationCoherenceReceipt(record, ctx)` with each input withheld, over
all 63 rows, and re-run over the **20 rows that carry at least one repair** so the repair arm is not
vacuous (E-29, E-30).

| receipt sub-path | reads | class | measurement |
|---|---|---|---|
| **`repairs`** | **`generationRepairs`** | ⛔ **HISTORY** | the ONLY mover: 52 path-moves over 63 rows under an emptied log; 0 under a withheld context; 0 under an emptied seed. `generationCoherence.js:515` is a pure copy of the input |
| `checks[]` (17 ids) | the settlement | **READING** | **0 of 17 ids** move under any arm, over the 20 repair-carrying rows |
| `judgments[]` (7 ids) + `evidence` | the settlement | **READING**, each judgment ATOMIC | **0 of 7 ids** move, same arms |
| `authoredTensions` | ⛔ **the settlement** | **READING** — the finding | built at `:418-441` from `settlement.structuralViolations`, `presentationBranches(settlement)`, `resolveGenerationContentProfile(settlement.config)`; moves under no arm in 63/63 |
| `status` | the settlement | READING | `:528-532`, from `checks`' findings and `authoredTensions.length` |
| `seed` | recoverable | READING | `:511` falls back to `settlement._seed`; `receipt.seed === record._seed` in **63/63** |
| `worldLawVersion` | recoverable | READING | `:512-514` falls back to a world law built from `settlement.config` (`:354-364`) |
| `cultureProfile` · `contentProfile` · `version` | the settlement / a literal | READING | `:539-540`, `:535` |

⭐ **Why `checks`/`judgments` are settlement-functions even though `provenanceAssessment` is handed
`repairs`:** its repair loop (`generationReceiptJudgments.js:654-660`) pushes a finding **only for a
MALFORMED repair** (`if (repair?.type && repair?.action && repair?.reason) continue;`). A well-formed
log contributes nothing. That one seam is CANNOT-CATCH row 10 and is slotted to EM-B1a's pre-proof.

**The five evidence invariants, each with its path — all READINGS, all live:**
`V-EVIDENCE-ROSTER` → `judgments[id=hard_structural_validity].evidence[path=finalGraph]` ·
`V-EVIDENCE-EVENTS` → `judgments[id=narrative_realization].evidence[path=narrative]` ·
`V-EVIDENCE-TENSION` → `judgments[id=dramatic_tension].evidence[path=history.currentTensions[N]]` ·
`V-EVIDENCE-STRESS` → `…evidence[path=stress[0]]` · `V-EVIDENCE-CONFLICT` → `…evidence[path=conflicts[N]]`.
Because they are READINGS, a merged record's evidence is re-derived with the roster and the five
convict nothing consistent — which is what item 1 set out to repair. **EM-R0b needs no HISTORY
exemption.**

⭐ **And a finding the control produced:** a **RECOMPUTE** of the receipt moves
`judgments[id=confidence_and_provenance].evidence[path=simulationTrace]` on **63/63** records,
because the receipt is built at `assembleSettlement.js:283` **before** the trace is propagated
(`:292`). Status, all 17 checks and all 7 judgment ids are otherwise identical. → **the receipt is
MERGED, never RECOMPUTED**, pinned in §5.5 and slotted to EM-R0c.

## The final class table — 47 keys

**Generated (41):** HELD 7 · WORLD 3 · CONSTANT 4 · **READING 25** (24 + `generationCoherenceReceipt`)
· AUTHORED 2.
**Saved-only (4), new:** `neighbourNetwork` → HELD (written by `saves.js:233-256` on all four write
paths, and by `SettlementsPanel.jsx`'s back-link) · `interSettlementRelationships` → HELD
(`SettlementsPanel.jsx:468…520`) · `populationHistory` → HISTORY (the PULSE:
`calamityKernel.js:470`, `demographicsKernel.js:356`) · `crossSettlementConflicts` → HELD
(⛔ **nothing in `src/` writes it**).
**Declared ahead (2):** `dmLayer` `decrees` → AUTHORED, absent 525/525.
**Deliberately omitted:** `thesis` and `dailyLife` are `ai_data.aiSettlement` fields
(`publicSafe.js:39-40`; `aiLayer.js:10`), not settlement keys.

**Three CLASS_EXCEPTIONS:** `powerStructure.economyInputFingerprint` → RECEIPT ·
`factions[].members[]` → MIRROR (572/572 exact copies) · `generationCoherenceReceipt.repairs` →
HISTORY.

## KEYED 48 / ATOMIC 15, and the cross-entry sweep

63 collapsed collection paths; 51 declared; 50 hold; **two leave KEYED under §22.3 item 3**.

| collection | field | total | multi arrays | distinct sums | verdict |
|---|---|---:|---:|---|---|
| `economicState.incomeSources` | `percentage` | **100** | 61 | **1** | ⛔ ATOMIC — the chair's own row |
| `powerStructure.factions` | `power` | **100** | 63 | **1** | ⛔ ATOMIC, `mootUnder: 'HELD'` — where item 3 and §22.2 item 8 meet and agree |
| `defenseProfile.institutions.magicDef` | `baseChance` | ~1 | 11 | **4** (0.9·0.8·0.85·0.6) | ✅ **REJECTED by its own control** |
| `defenseProfile.institutions.walls` | `baseChance` | ~1 | 9 | **2** (1.0·1.3) | ✅ **REJECTED by its own control** |

⚠ **The first pass raised the two rejections** because its tolerance (`|sum − first| ≤ 1`) is right
for a percentage and meaningless for a sum near 1. A relative tolerance refuted them. Both are
recorded, and **A7 carries them as its paired negative** so the arm that admits a total also refuses
a near-miss. **Also swept, deliberately not atomic:** `history.eventsTimeline` and
`history.historicalEvents` are ORDER-BEARING (monotone in 60/60) — an ordering, which §22.2 item 4
already merges three-way; slotted to EM-R0c.

## The group register — six

`food-security` (whole) · `food-balance` (whole) · `viability-counts` (member list) ·
`isolation-support` (member list) · `condition-severity` (**per-entry**) · `defense-readiness`
(whole). `income-shares` **struck** by item 3 — ATOMIC is strictly stronger than a group.

⭐ **How `{ root, members }` expresses "within each entry", with NO extension — measured.** The
register's paths are COLLAPSED (`[]` = "at every index"), and the merge's keyed arm passes exactly
that spelling to the entry node: `mergeNode(kr.get(k), k0.get(k), k1.get(k), ` + "`${path}[]`" + `, stats)`
(the prototype's `merge.mjs:133`, the code EM-R0c inherits). So
`{ root: 'activeConditions[]', members: ['severity','severityBand'] }` is matched by plain path
equality at the entry node. **No extension is needed**, and the register says so in a comment so
EM-R0c cannot invent a second mechanism.

## The save round trip

| arm | result |
|---|---|
| JSON round trip alone | **identical to the record, 63/63** |
| `normalizeSettlement` alone | **identical, 63/63** |
| JSON then normalize (the real READ path) | **identical, 63/63** — adds no key, drops no key, changes no leaf, adds or drops no collection |
| the WRITE path's one blob clause (`saves.js:233-256`) | a **no-op** on a generated record (`neighborRelationship` null 525/525); with a neighbour NAMED it adds exactly **`neighbourNetwork`**, 41 → 42 |
| `migrateSaveToV2` (`:190-218`) | touches `seed` and `campaignState` on the ENVELOPE, never the blob — read whole |

**Second instrument, and it found more than the code path did:** `publicSafe.js#PUBLIC_TOPLEVEL_KEYS`
(38 keys) names **six** keys a generated record lacks; its own comment (`:39-42`) splits them into
two AI-layer fields and **four settlement keys**, and every writer was found except one — ⛔
`crossSettlementConflicts`, which two independent source comments state that nothing in `src/`
writes (`RelationshipsTab.jsx:59`, `relationshipsDeskRead.js:156`).

**The walker's own boundary is stated rather than hidden:** it GENERATES and does not SAVE, so it
asserts the four saved-only keys ABSENT; observing them over a real save → load is **EM-R7's arm**
(§22.3 item 7), and CANNOT-CATCH row 9 carries the design.

## requiredSymbols — post-edit simulation, re-run at `ad7ddf2c9`

| # | path :: symbol | grep | post-edit |
|---:|---|---:|---|
| 1 | `src/generators/generateSettlementPipeline.js` :: `export function generateSettlementPipeline` | 1 | **SURVIVES** — file untouched |
| 2 | `tests/helpers/goldenMasterCorpus.js` :: `export function goldenCorpus` | 1 | **SURVIVES** |
| 3 | `tests/helpers/goldenMasterCorpus.js` :: `export const keyOf` | 1 | **SURVIVES** |
| 4 | `tests/lint/mutationCoverage.shared.mjs` :: `export const ENFORCER_DIRS` | 1 | **SURVIVES** — the REGISTER row edits the JSON manifest, not this file |

**`retiredSymbols` EMPTY as the simulation's result:** the packet CREATEs two files and appends one
JSON row; it moves, renames and deletes no symbol, and disturbs no LANDED packet's rows.

**§7 / `changeManifest` equality, EXECUTED at the new tip:** `|§7| = 3`, `|JSON| = 3`, both
differences 0, every action in the tree's own `PACKET_ACTIONS`, every path a plain repo-relative
file, 8 acceptance cases against a cap of 8. ⚠ The validator arm is **still absent at `ad7ddf2c9`**
(TOOL-1 composes at EM-T4), so this is the lane's own re-implementation of the stated contract, and
it says so. The header also re-verified: a bare `__BASE__` parses to `null`; the
`` `fixes-2026-09-18-consist` at `__BASE__` `` form yields `verifiedBase` and the non-blank
`verifiedBranch` a READY packet requires.

## ⛔ What the chair must act on

**The sequencing act stands and was re-measured.** `implementation-packets.mjs:676` reserves change
paths at every non-terminal status, DRAFT included, and **EM-B1d is STILL READY at `ad7ddf2c9`** and
still names `scripts/mutation-coverage-manifest.json` (its own manifest has grown 11 → 16 rows under
§P2 row 12; none of the new rows is a path of this packet). EM-R0a's entry may not enter
`PACKET_MANIFEST.json` until EM-B1d is terminal. Free, since the family builds after EM-T7.

## The questions that remain

1. **`authoredTensions`: the ruling's TEST and its EXAMPLE LIST disagree.** §22.3 item 1 names it
   HISTORY and, in the same sentence, defines HISTORY as "anything computed from the generation
   context or the repair log" and commands "measured …, never by name". Measured, it reads **only
   the settlement** and moves under none of the three arms in 63/63. **The register applies the
   TEST.** If the chair prefers the example list, one row moves to `CLASS_EXCEPTIONS` — and a merged
   record would then carry `authoredTensions` from the pre-edit record while
   `structuralViolations`, the key it is computed from, is re-derived beside it, which is the
   contradiction shape item 1 exists to remove. One line either way.
2. **The four saved-only classes.** All four are **behaviour-free today** (neither re-derivation
   produces them, so the ABSENT rule keeps them whole whatever class they carry). The one needing a
   word: classing `populationHistory` HISTORY **widens that class by one word**, from "the account of
   how the town was first made" to "the record's own account of what has happened to it" — justified
   by THE PROMISE, but a definition change, which is the chair's. HELD is the alternative and it
   would make a lived-history ledger editable.
3. **`crossSettlementConflicts` is a key nothing writes.** Classed, listed in
   `NOT_YET_WRITTEN_KEYS` so the walker asserts absence rather than inventing a shape. Fate proposed
   below; the chair slots it.
4. **The pre-proof's owed scanner run.** The observed-shape prediction is PLAUSIBLE with a live
   precedent, never CONFIRMED — a compile lane may not run repo scripts. Confirm the pre-proof, not
   the build, discharges it.

## Noticed, with a fate for each (the owner's no-deferral law)

| item | proposed fate |
|---|---|
| ⛔ `crossSettlementConflicts` allow-listed, merged by two readers, **written by nothing** | **SLOT: RECON-ID's table** (chartered 18:49) — the same question in another dress: a cross-save relation with readers and no writer. CLOSED if the recon shows it dead, and the key leaves the allow-list in that sitting |
| ⭐ A recompute of the receipt moves one evidence entry on 63/63 | **SLOT: EM-R0c's compile**, as a pinned forbidden alternative — already written into §5.5 so R0c inherits it |
| A MALFORMED `repairs[]` entry is the one seam by which HISTORY reaches a READING | **SLOT: EM-B1a's pre-proof**, where an op that could write a repair is designed; CANNOT-CATCH row 10 here |
| `history.eventsTimeline` / `history.historicalEvents` are ORDER-BEARING (60/60) | **SLOT: EM-R0c's compile** — where §22.2 item 4's second arm should be counted |
| `powerStructure.factions`' total is owned by both item 3 and §22.2 item 8 | **CLOSED — not work: the two rulings agree**; recorded once, in `CROSS_ENTRY_TOTALS` with `mootUnder: 'HELD'` |
| FIX-G1 still live at this tip (1 of 51 rows) | **CLOSED — already slotted and built**; rides the owner's signed door at EM-T4. G3's evidence goes 50/51 → 51/51; the group does not change |
| `stress ≡ stressors` 63/63 | **CLOSED — slotted by §22.3 item 5** as an EM-R0b cross-key check |
| `resourceAnalysis.gaps`' `chain` not unique in 142/489 arrays at 525 rows | **OWNER'S DECISION POINT, at the moment the gaps card is designed** (EM-D). Not a defect; a display question with no current surface |
| The kit's `instrument.mjs` chdir hazard | **CLOSED — cured by the chair the same turn**; this lane re-audited under the cure and is clean |
| The change-table validator arm still absent at `ad7ddf2c9` | **CLOSED — already slotted**: TOOL-1 composes at EM-T4 |

## Judgment calls (each vetoable, each with its measurement)

1. **Applied §22.3 item 1's TEST over its example list for `authoredTensions`** — the ruling
   commands measurement and forbids naming by feel.
2. **Classed the four saved-only keys**, noting all four are behaviour-free today.
3. **Rejected two cross-entry candidates by a relative tolerance** after a loose one raised them,
   and recorded the rejection rather than dropping it.
4. **Made A7 carry the paired negative**, so the arm that admits a total also refuses a near-miss.
5. **Kept the 63-row stride**, re-confirmed identical to the 525-row classification at the new tip.
6. **Left every band THRESHOLD out of this register** — the ladders are EM-R0d's, and a register
   that spelled a number would fork the ladder EM-R0d exists to unify.
