# EM / EM-R0a — THE CLASS REGISTER of a settlement record (the re-entry family, member 1)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR — verified at this lane's tip as `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`, E-26. ⚠ It MOVED under version 1's hash `1cf5442719…`: §P2 gained row 12. Neither row 10 nor row 12 binds this packet — no `checks` command of this packet runs a generator, no `src/` path of it is an edge-shared input, and it widens no named set — and §7 says so.)

- **Status:** `DRAFT`
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:294`) anchors the status row at end-of-line.
- **Packet version:** 2 (compiled at `58fcfe614`, re-cut at `ad7ddf2c9` under design §22.3)
  **What version 2 changed and why.** The chair ruled the six questions version 1 raised (design
  §22.3, ODQ §934.47 addendum 25) and sent this lane back to measure three of them. Eight things
  changed, every one of them measured at `ad7ddf2c9`:
  (1) ⭐ **THE GENERATION RECEIPT IS SPLIT BY PATH** (§22.3 item 1). Measured by WITHHOLDING each
  input in turn: **only `repairs[]` moves.** The receipt becomes a READING with ONE exception,
  `generationCoherenceReceipt.repairs` → HISTORY. **The five `V-EVIDENCE-*` invariants stay live**
  and §5.2b names the path each one reads. ⛔ **And the chair's own example list is refuted by the
  measurement on one member: `authoredTensions` reads no HISTORY input** — §11 Q1.
  (2) **Groups carry a member list** (§22.3 item 2) — ratified, and §6's shape is unchanged from
  version 1's proposal.
  (3) ⭐ **A collection under a CROSS-ENTRY TOTAL is ATOMIC** (§22.3 item 3). The sweep the chair
  asked for found **TWO, not one**: `economicState.incomeSources` (the chair's) and
  `powerStructure.factions`. Two further candidates were **REJECTED BY THEIR OWN CONTROL**.
  (4) **The group register is SIX**, seeded from FIVE shapes (§22.3 item 4, which ratifies version
  1's correction of "nine"). `income-shares` is struck by (3).
  (5) ⭐ **THE REGISTER IS NOW TOTAL OVER A SAVED RECORD** (§22.3 item 7). The read path is a
  **no-op in 63/63**; the write path adds `neighbourNetwork`; the estate's own allow-list names
  **four** saved-only settlement keys, one of which **nothing in `src/` writes**.
  (6) `stress ≡ stressors`, the HELD-internal pairs and the referential services invariant leave
  this packet for EM-R0b and EM-R6, as ruled (§22.3 items 5, and Q3).
  (7) The name `src/domain/edit/recordRegister.js` is ratified (Q6); the walker stays in
  `tests/lint` and the manifest row is SEQUENCED behind EM-B1d (Q4).
  (8) The measured base moved to `ad7ddf2c9`; `src/` differs from version 1's tree in ONE file and
  **the whole census is byte-identical** (E-27).
- **Verified base:** `fixes-2026-09-18-consist` at `__BASE__`
  ⛔⛔ **THE PLACEHOLDER'S FORM IS LOAD-BEARING AND WAS MEASURED** (E-25). `__BASE__` is one token
  the chair replaces with the promotion tip's full 40-hex sha, in THIS line and in the manifest's
  `verifiedBase`, in one act. `parsePacketHeader` (`:302-310`) accepts only `<branch>` at
  `<40-hex>` or a bare 40-hex; a bare `` `__BASE__` `` parses to `null` and `:889` then errors
  `verifiedBase disagrees with packet Markdown`. Executed against the tree's own parser, this form
  yields `verifiedBase` AND the non-blank `verifiedBranch` `:891` requires of a READY packet.
- **Last revalidated:** `__BASE__` — stamped by the chair at promotion.
  ⭐ **THE REVALIDATION SENTENCE.** *"Compiled at `58fcfe614`, re-cut at `ad7ddf2c9` under design
  §22.3, by execution (E-1…E-34). Re-validated at `__BASE__`: the J-T1 window over every
  change-manifest and `requiredSymbols` path is quoted; both CREATE targets ABSENT and Git-clean;
  all four `requiredSymbols` rows resolve verbatim; `scripts/mutation-coverage-manifest.json` is a
  REGISTER row and therefore SUBSTRATE, so the base is the tip (§4); and the register's figures —
  41 generated keys, 4 saved-only, 48 keyed, 15 atomic, 2 cross-entry totals, 6 groups, the
  receipt's one HISTORY sub-path — were re-measured by re-running `tools2/` from the chair kit."*
  ⛔ **WHAT WILL DRIFT, in order of likelihood.** (1) ⭐ **THE KEY SET.** An earlier editor packet
  may write `dmLayer`/`decrees` — already CLASSED, so that costs one liveness flip and no re-cut.
  Any OTHER new top-level key is a re-cut of `RECORD_CLASSES`, and arm A1 is what makes it a RED.
  (2) The 48/15 collection split — moves only if a generator step changes a collection's shape.
  (3) The group register, if `economicState`/`economicViability` derivation moves.
  (4) ⚠ **`economicViability.summary`'s prose count.** FIX-G1 is BUILT AND STAGED on a parallel
  lane and re-records one golden row at train EM-T4 under the owner's signature; when it composes,
  this packet's G3 evidence goes 50/51 → 51/51 (E-16, re-measured at this tip). **The group does
  not change; only the figure beside it does.**
  (5) The lighting census tuple — ALREADY RED at this tip and no absolute is quoted anywhere here.
  (6) ⛔ The `scripts/mutation-coverage-manifest.json` reservation: EM-B1d is STILL READY at
  `ad7ddf2c9` and still names that path (E-28). §4.
- **Depends on:** **NONE for its substrate.** Sequencing only: EM-B1d must be TERMINAL before this
  packet's manifest entry is added (§4). ⭐ **EM-R0d does NOT precede this packet** — the family's
  order is EM-R0a → EM-R0d → EM-R0b (the charter's amendment of 2026-09-19 18:30), and the three
  band ladders EM-R0d exports are EM-R0b's input, never this register's: this packet names no band
  threshold and imports nothing.
- **Collision group:** `scripts/mutation-coverage-manifest.json` with **EM-B1d** (both add one row;
  the file is never re-serialised whole). No other packet of the manifest's 189 names any path of
  this packet (E-28). ⭐ EM-R0b, EM-R0c, EM-R6 and EM-R7 will all IMPORT
  `src/domain/edit/recordRegister.js` and must not re-declare any of it.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** **measured, by execution, at `ad7ddf2c9`** — and the whole version-1 census
  re-run and diffed (E-27). New in version 2: the receipt classed by withheld input over 63 rows
  and re-run over the 20 rows that carry a repair; the cross-entry sweep at two tolerances; the
  save round trip through `normalizeSettlement` and the write-path neighbour clause; the estate's
  own saved-key allow-list. Every figure carries its command in `EM-R0a.evidence.md`.

---

## 1. Reconciled authority

1. ⭐ **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.3** (ARCH-REDERIVE — the rulings the first two
   compiles forced), items 1, 2, 3, 4 and 7 — this packet's whole re-cut.
2. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.2 items 2, 4, 5, 7; §22 ruling 1; §21.5 ruling 3.
3. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, amendment of 2026-09-19 18:30 EDT (the EM-R
   family's new order and EM-R0a v2's five bullets) and of 18:10 EDT (**the owner's law: nothing is
   ever deferred — every item in §12 carries a fate**).
4. `docs/implementation/PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P1–§P9 (§P2 now twelve rows).
5. Live code and executed evidence at `ad7ddf2c9` — `EM-R0a.evidence.md`.

**Resolved contradictions — each measured, none adjudicated.**

- ⭐⭐ **THE RECEIPT'S SPLIT, MEASURED — and it is ONE sub-path, not a family.** §22.3 item 1 rules
  the receipt split by path and commands the test: class every sub-path *by which INPUT it reads*.
  Executed (E-29) by rebuilding the receipt with each input withheld across 63 rows:
  **only `repairs[]` and `repairs.length` move.** `version`, `status`, `seed`, `worldLawVersion`,
  `cultureProfile`, `contentProfile`, `checks[]`, `judgments[]` **and `authoredTensions`** are
  functions of the settlement alone. → `generationCoherenceReceipt` is a **READING**, with the
  single exception `generationCoherenceReceipt.repairs` → **HISTORY**.
- ⛔ **AND THE RULING'S EXAMPLE LIST IS REFUTED ON ONE MEMBER, WITH THE LINE.** §22.3 item 1 and
  the dispatch both name `authoredTensions` as HISTORY. Measured, it is built at
  `src/generators/generationCoherence.js:418-441` from `settlement.structuralViolations` (`:418`),
  `presentationBranches(settlement)` (`:311`) and `resolveGenerationContentProfile(settlement.config)`
  (`:390`) — **it reads neither the generation context, nor the repair log, nor the seed**, and it
  moves under none of the three withholding arms in 63/63 rows. By the ruling's own test it is a
  READING. **The register applies the TEST, because the ruling commands measurement and forbids
  naming by feel; the divergence from the example list is §11 Q1 and its reversal is one row.**
- ⭐ **`checks[]` and `judgments[]` are settlement-functions, and the SOURCE says why.**
  `provenanceAssessment` (`generationReceiptJudgments.js:594`) is handed `repairs` — but its repair
  loop (`:654-660`) pushes a finding **only for a MALFORMED repair** (`if (repair?.type &&
  repair?.action && repair?.reason) continue;`). Every generated repair carries all three, so a
  well-formed log contributes nothing. CONFIRMED by execution over the **20 rows of 63 that carry a
  repair**: zero of 17 check ids and zero of 7 judgment ids move when the log is emptied (E-30).
  ⚠ The one seam is named in §6's CANNOT-CATCH: a MALFORMED `repairs[]` entry would reach a READING.
- ⭐ **A RECOMPUTE OF THE RECEIPT WOULD MOVE ONE EVIDENCE ENTRY ON EVERY RECORD** (E-30). Rebuilding
  it from the final record differs from the recorded receipt in exactly two leaf shapes in 63/63:
  `judgments[].evidence[].evidence` and `.detail`, at
  `judgments[id=confidence_and_provenance].evidence[path=simulationTrace]`. The mechanism is exact:
  the receipt is built at `assembleSettlement.js:283`, **before** the trace is propagated onto the
  settlement (`:292`'s own comment), so the recorded evidence reads *"No step trace was persisted…"*
  while a rebuild reads *"Deterministic generation trace is present. N trace entries"*. Status, all
  17 checks and all 7 judgment ids are otherwise identical. → **The receipt is MERGED, never
  RECOMPUTED**, pinned as a forbidden alternative in §5.5. Under the merge it is harmless: `R0` and
  `R1` agree on the rebuilt form, the record carries the recorded one, and the subtree short-circuit
  keeps the record's.
- ⭐ **THE CROSS-ENTRY SWEEP FOUND TWO, AND REJECTED TWO** (§22.3 item 3; E-31, E-32).
  `economicState.incomeSources.percentage` sums to **exactly 100 in 61 of 61** multi-entry arrays
  (one distinct sum) and `powerStructure.factions.power` to **exactly 100 in 63 of 63**. ⛔
  `defenseProfile.institutions.magicDef.baseChance` and `.walls.baseChance` were raised by a first
  pass whose tolerance (`|sum − first| ≤ 1`) is right for a percentage and meaningless for a sum
  near 1; **re-measured at a relative tolerance they carry four and two distinct sums**
  (0.9 / 0.8 / 0.85 / 0.6 and 1.0 / 1.3) — independent per-institution probabilities, **REJECTED**.
- ⭐ **`powerStructure.factions` is where §22.3 item 3 and §22.2 item 8 MEET AND AGREE.** Item 8
  gives the shares' total to the op (`set-faction-power` renormalises); item 3 makes the collection
  ATOMIC. Both say the merge may not take one share fresh beside settled neighbours. It is inside a
  HELD key, so the rule is moot today and declared anyway — with `mootUnder: 'HELD'` — so a
  reclassification inherits the law instead of re-deriving it.
- **"the recon lists 41 keyed collections" — version 1's reconciliation stands, re-measured:** 63
  collapsed collection paths; 51 with a declared key; 50 hold; `51 − 9 (inside HELD) − 1 (broken
  key) = 41`, the merge-exercised subset. Version 2 moves two of the 50 to ATOMIC by §22.3 item 3,
  leaving **48 KEYED and 15 ATOMIC**.
- **"nine object paths outside the trace and the receipt" is FIVE** — version 1 measured it and
  §22.3 item 4 ratifies the correction. The census collapses to nine object SHAPES in all, of which
  three are the trace and one the receipt.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** one pure-data module, `src/domain/edit/recordRegister.js`, declares for a
settlement record — generated **or saved** — (a) the CLASS of every top-level key and of every
sub-path whose class differs from its parent's, (b) the declared KEY of every keyed collection,
(c) every keyless collection and every collection under a cross-entry total as ATOMIC, with the
total named, (d) the CONSISTENCY GROUPS with their invariants, and (e) the collections a future
reclassification may not merge; and one totality walker,
`tests/lint/recordRegisterTotality.walker.test.js`, holds the register EQUAL IN BOTH DIRECTIONS to
what a stride of the golden corpus actually produces, so a new record key, a new collection, a
broken key, a lost total or a dead declaration REDS.

**Definition of done:** nothing about a record's shape is declared twice or declared without being
observed, and the walker reds on the first record key nobody classed.

In scope: (1) the register, as pure frozen data with no branch; (2) no integration — nothing
imports `src/domain/edit/` and that is measured, not assumed (§5.4); (3) the totality walker, with
its anti-vacuity floor and its `CANNOT-CATCH:` header.

Explicit non-goals: the merge (EM-R0c), `recordInvariants` (EM-R0b), the three band ladders
(EM-R0d), the writer census (EM-R1), any seam (EM-R2…R5), the rename/removal surface list (EM-R6),
the corpus ratchet (EM-R7); **any change to a record** — this packet writes DATA ABOUT the record,
touches no generator and no save path, and the goldens are UNCHANGED; the `set-faction-power`
renormalisation (§22.2 item 8); FIX-G1, FIX-G2 and the `crossSettlementConflicts` ghost key, each
of which carries a FATE in §12 rather than an investigation here.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families · Named state writers · Feature flags · User-facing surfaces | `0` |
| Direct consumers | `0` — **measured** (E-17, re-run at this tip): nothing imports `src/domain/edit/` |
| New logic-bearing production leaves | `0` — the leaf is **pure frozen data**, no branch, no import |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` — `scripts/mutation-coverage-manifest.json` |
| Handwritten files total | `3` — the cap is 12 |
| New/changed effective production lines | **`≤ 210`** — the emitted draft measures **163** (E-33) |
| Effective lines per new leaf | **`≤ 210`** (measured 163; the cap is 250 — **no split needed**) |
| Delta in a shared/hot file | `n/a` — **NO hot file is named** |
| Acceptance cases | `8` — the standard's cap is 8 |
| ⭐ Bundle byte delta | **ZERO in every budgeted chunk**, by the import graph (§5.4) |

Overrides approved before dispatch: `NONE`. **IDENTITY POSTURE: byte-identical output** — proof A8.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-R0a
```

Expected: both CREATE targets ABSENT (verified at this tip, E-17); the REGISTER target clean; every
`requiredSymbols` row resolving verbatim.

| check | source | verdict once the chair stamps the base to the tip |
|---|---|---|
| status is READY | `:274` | the chair's promotion supplies it |
| manifest validates | `:271` | ⛔ **PASSES ONLY AFTER EM-B1d IS TERMINAL** — below |
| branch matches the capsule | `:353` | the build lane holds the integration branch; the chair stays detached |
| base is an ancestor of HEAD | `:176-183` | PASSES — the base IS the tip |
| substrate unchanged since base | `:185-196` | **SHORT-CIRCUITS at `:184`** (`head === packet.verifiedBase`) |
| capsule names every substrate path | `:197-200` | PASSES |
| CREATE targets absent and Git-clean | `:205-211` | PASSES — both ABSENT at the tip |
| non-CREATE targets Git-clean | `:212-213` | PASSES on a clean lane worktree |

⛔⛔ **THE CHANGE-PATH RESERVATION, RE-MEASURED AT `ad7ddf2c9` (E-28).** `implementation-packets.mjs:676`
sets `reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)` with `TERMINAL = {LANDED,
SUPERSEDED}` (`:43`), and `:694-703` errors `duplicate change path across packets` — **a DRAFT
reserves.** The manifest holds 189 packets, 186 LANDED, 2 SUPERSEDED and **one non-terminal:
EM-B1d (READY), whose change manifest still names `scripts/mutation-coverage-manifest.json`.**
**EM-R0a's entry may not enter `PACKET_MANIFEST.json` at any status until EM-B1d is terminal.**
The chair ruled SEQUENCE (Q4); the family builds after train EM-T7, so this costs nothing — but it
is an act the chair executes, not a surprise the terminal discovers. ⚠ EM-B1d's own manifest has
GROWN since version 1 (11 → 16 rows, the five edge-shared metas of §P2 row 12); none of the new rows
is a path of this packet.

⛔ **And the REGISTER row puts the manifest into the SUBSTRATE** (`:185-196` excludes CREATE rows
only, `:186`), so the chair stamps the base to the promotion tip and the arm short-circuits at `:184`.

## 5. Verified tree contract

### 5.1 ⭐ TABLE 1 — the class of every top-level key of a record, generated AND saved

**Generated (41 of 41)**, measured over the 63-row sample and re-measured over the full 525-row
corpus, which produces the same 41 and no more (E-3, E-21, E-27):

| class | n | keys |
|---|---:|---|
| **HELD** | 7 | `institutions` `npcs` `factions` `relationships` `conflicts` `powerStructure` `name` |
| **WORLD** | 3 | `config` `_config` `_seed` |
| **CONSTANT** | 4 | `id` `generatorVersion` `schemaVersion` `simulationVersion` |
| **READING** | 25 | the 24 of version 1 **plus `generationCoherenceReceipt`**, which §22.3 item 1 moves here |
| **AUTHORED** | 2 | `userCanon` `aiOverlays` |

⭐ **Saved-only (4), new in version 2 — a saved record carries keys generation never produces**
(§22.3 item 7; E-34). Measured two ways that agree: the save path's own code, and the estate's own
allow-list `src/domain/display/publicSafe.js#PUBLIC_TOPLEVEL_KEYS` (38 keys), whose own comment
(`:39-42`) separates the settlement's keys from the AI layer's.

| key | class | who writes it, measured | evidence |
|---|---|---|---|
| `neighbourNetwork` | **HELD** | `src/lib/saves.js:233-256`, applied to `v2.settlement` on all four WRITE paths (`:444 :505 :744 :777`) when the record carries a NAMED `neighborRelationship`; and `SettlementsPanel.jsx:468…520`'s bidirectional back-link | **EXECUTED**: with the generated (null) relationship the clause is a no-op; with a neighbour named it adds exactly this key, 41 → 42 |
| `interSettlementRelationships` | **HELD** | `SettlementsPanel.jsx:468, 482, 501, 520` — written in the same change bags as `neighbourNetwork` | source |
| `populationHistory` | **HISTORY** | the PULSE: `worldPulse/calamityKernel.js:470`, `worldPulse/demographicsKernel.js:356`; read by `domain/highWater.js:228` | source |
| `crossSettlementConflicts` | **HELD** | ⛔ **NOTHING IN `src/` WRITES IT.** Two independent source comments say so in as many words: `components/new/tabs/RelationshipsTab.jsx:59` and `domain/display/stateProse/relationshipsDeskRead.js:156`. Two readers merge it; the public allow-list names it | source |

**Declared ahead (2):** `dmLayer` `decrees` → **AUTHORED**, **ABSENT in 525/525** generated records
and asserted absent by arm A1 until an editor packet writes them.
**AI-layer keys, deliberately NOT in this register:** `thesis` and `dailyLife` are
`ai_data.aiSettlement` fields (`publicSafe.js:39-40`; `generators/aiLayer.js:10`), not settlement
top-level keys. Naming them here would make the walker demand a key no record carries.

⚠ **THE FOUR SAVED-ONLY CLASSES ARE BEHAVIOUR-FREE TODAY AND ARE PUT TO THE CHAIR (§11 Q2).**
Neither re-derivation produces any of them, so under item 1's ABSENT rule all four are kept WHOLE
whatever class they carry. The choice is about MEANING and about what a future writer inherits.
`populationHistory` is the one that matters: it is classed HISTORY on THE PROMISE (lived history is
immutable, never merged, never recomputed), which **widens the HISTORY class by one word** — from
"the account of how the town was first made" to "the record's own account of what has happened to
it". That widening is the chair's.

**The three sub-paths whose class differs from their parent's — the whole exception list:**

| path | class | parent | the measurement |
|---|---|---|---|
| `powerStructure.economyInputFingerprint` | **RECEIPT** | HELD | the only digest of other record fields (E-6) |
| `factions[].members[]` | **MIRROR** | HELD | 572/572 members resolve by `id`; all 25 fields equal the NPC's in 572/572; **no NPC field is absent from its chip in any pair** (E-15) |
| `generationCoherenceReceipt.repairs` | **HISTORY** | READING | ⭐ the ONLY receipt sub-path that moves when a HISTORY input is withheld: 52 path-moves over 63 rows under an emptied repair log, 0 under a withheld context, 0 under an emptied seed (E-29) |

### 5.2 TABLE 2 / TABLE 3 — 48 KEYED and 15 ATOMIC

63 collapsed array-of-object paths; 51 carry a declared key; 50 are present-and-unique in every
observed array; **two of those 50 move to ATOMIC under §22.3 item 3**, leaving **48 KEYED**. The
full tables are in `EM-R0a.evidence.md` E-10 and are reproduced in §6's module body. The same
classification comes out of the 525-row corpus unchanged (E-21) and out of the new tip unchanged
(E-27).

**The two that leave KEYED, and the two that were rejected:**

| collection | field | total | multi-entry arrays | distinct sums | verdict |
|---|---|---:|---:|---|---|
| `economicState.incomeSources` | `percentage` | **100** | 61 | **1** (`100.000000`) | ⛔ **ATOMIC** (§22.3 item 3; the chair's own row) |
| `powerStructure.factions` | `power` | **100** | 63 | **1** (`100.000000`) | ⛔ **ATOMIC**, `mootUnder: 'HELD'` — where item 3 and §22.2 item 8 meet |
| `defenseProfile.institutions.magicDef` | `baseChance` | ~1 | 11 | **4** (0.9 · 0.8 · 0.85 · 0.6) | ✅ **REJECTED by its own control** — independent probabilities |
| `defenseProfile.institutions.walls` | `baseChance` | ~1 | 9 | **2** (1.0 · 1.3) | ✅ **REJECTED by its own control** |

**Also swept and deliberately NOT made atomic — ORDER-BEARING collections.** `history.eventsTimeline`
(`year`, `yearsAgo`), `history.historicalEvents` (`yearsAgo`): entries are monotone in every
multi-entry array of 60. An ORDERING is not a cross-entry total — §22.2 item 4 already merges order
three-way, and these three are exactly where its "R1's order governs only when the edit moved the
order" arm has teeth. Named so EM-R0c measures its second arm on them.

⭐ **The one declared key that BREAKS:** `resourceAnalysis.gaps`' `chain` is present on every entry
and **not unique in 29 of 60 arrays at 63 rows, 142 of 489 at 525** → ATOMIC.

⚠ **THE VACUITY ROW SET — nine collections whose key the corpus CANNOT test** (longest observed
array is one entry): `activeConditions` · `defenseProfile.institutions.charter/.mercenary/.militia/
.watch` · `economicViability.warnings` · `activeConditions[].causes` ·
`generationCoherenceReceipt.authoredTensions` · `structuralSuggestions`. Arm A4 asserts that set
exactly, both directions. The chair ACCEPTED this floor as written.

### 5.2b ⭐ THE GENERATION RECEIPT, SUB-PATH BY SUB-PATH, BY THE INPUT EACH READS

Measured by rebuilding the receipt with each input withheld, over all 63 rows (E-29), and re-run
over the **20 rows that carry at least one repair** so arm B is not vacuous (E-30).

| receipt sub-path | reads | class | measurement |
|---|---|---|---|
| `repairs` (and `repairs[].*`) | **`generationRepairs`** | ⛔ **HISTORY** | the only mover: 52 path-moves over 63 rows under an emptied log; `generationCoherence.js:515` is `Object.freeze([...(context.generationRepairs || [])])` — a pure copy of an input that never reaches the record |
| `checks[]` (17 ids) | the settlement | **READING** | **0 of 17 ids** move under any withheld input, over the 20 rows that carry a repair. The `provenance` check is handed `repairs` but its loop (`generationReceiptJudgments.js:654-660`) fires only on a MALFORMED repair |
| `judgments[]` (7 ids) with their `evidence` | the settlement | **READING**, each judgment **ATOMIC** with its evidence | **0 of 7 ids** move, same arms. `judgments[].evidence` carries no stable key (E-10) so it is atomic already; §22.3 item 1 says the same in words |
| `authoredTensions` | ⛔ **the settlement** | **READING** (the finding — §11 Q1) | built at `generationCoherence.js:418-441` from `settlement.structuralViolations`, `presentationBranches(settlement)` and `resolveGenerationContentProfile(settlement.config)`; moves under no withholding arm in 63/63 |
| `status` | the settlement | **READING** | `:528-532`, from `checks`' finding count and `authoredTensions.length` — both settlement-functions |
| `seed` | both, and RECOVERABLE | **READING** | `:511` is `String(context.seed || settlement?._seed || '')`; measured **`receipt.seed === record._seed` in 63/63**, so the fallback makes it a settlement-function; it moves under no arm |
| `worldLawVersion` | both | **READING** | `:512-514` prefers `generationContext.worldLaw.version` and falls back to a world law built from `settlement.config` (`:354-364`); it moves under no arm in 63/63 |
| `cultureProfile` · `contentProfile` · `version` | the settlement / a literal | **READING** | `:539-540`, `:535` |

⭐ **THE FIVE `V-EVIDENCE-*` INVARIANTS STAY LIVE, and every one reads a path that is now a
READING** (E-29, §6 of the probe; each printed with its own judgment id and evidence path):

| invariant | the receipt path it reads | class |
|---|---|---|
| `V-EVIDENCE-ROSTER` | `judgments[id=hard_structural_validity].evidence[path=finalGraph].evidence` (`"14 NPCs / 37 relationships"`) | READING |
| `V-EVIDENCE-EVENTS` | `judgments[id=narrative_realization].evidence[path=narrative].evidence` (`"9 historical events"`) | READING |
| `V-EVIDENCE-TENSION` | `judgments[id=dramatic_tension].evidence[path=history.currentTensions[N]].evidence` | READING |
| `V-EVIDENCE-STRESS` | `judgments[id=dramatic_tension].evidence[path=stress[0]].evidence` | READING |
| `V-EVIDENCE-CONFLICT` | `judgments[id=dramatic_tension].evidence[path=conflicts[N]].evidence` | READING |

Because they are READINGS, a merged record's evidence is re-derived with the roster and the five
checks convict nothing that is consistent — which is exactly what §22.3 item 1 set out to repair.
**EM-R0b keeps all five live and needs no HISTORY exemption.**

### 5.3 THE CONSISTENCY GROUPS — six, ratified

Seeded from the MIXED census's **five** shapes outside the trace and the receipt (E-11, E-12;
§22.3 item 4 ratifies the correction of "nine").

| id | root | members | invariant | convicting row |
|---|---|---|---|---|
| **G1 `food-security`** | `economicState.foodSecurity` | `null` (whole, 33 keys) | label ⇒ flag vector, per-flag (`Secure` NEVER beside `isDeficit`/`isPressured`; `Import-Dependent` NEVER beside `isSecure`, 63/63); `activeChainsCount === activeChains.length` (63/63); the deficit arithmetic; the `deficitPct ↔ label` band | `village#7 city#7 metropolis#7`: SETTLED `isSecure`/`surplusPct` beside `label color bg foodRatio deficitPct dailyProduction` taken; instrument convicts `FLAGVEC … "Import-Dependent" but isSecure=true` |
| **G2 `food-balance`** | `economicViability.metrics.foodBalance` | `null` (whole, 12 keys) | `rawDeficit = max(0, need − production)`; `deficit = max(0, rawDeficit − import − magic)`; `deficitPercent = round(deficit/need×100)` | `village#7`: SETTLED `surplus`, `importChannel` beside six leaves taken |
| **G3 `viability-counts`** | `economicViability` | `summary` `dependencies` `warnings` `plotHooks` `metrics.dependencyCount` `metrics.warningCount` | `dependencyCount === dependencies.length` (63/63, 10 distinct values); `warningCount === warnings.length` (63/63); the summary's prose counts (50/51 and 51/51 — the one exception is FIX-G1, §12) | `village#7`: SETTLED `plotHooks[~add "Survival Crisis"]` beside dependency entries taken; convicts `V-SUMMARY-HOOKS: summary says 3 plot hooks but plotHooks.length=2` |
| **G4 `isolation-support`** | `isolationSupport` | `requiredCapacity` `capacity` `deficit` `status` | `deficit = max(0, requiredCapacity − capacity)` | never mixed in 32 trials; RATIFIED by §22.3 item 4 on the arithmetic |
| **G6 `condition-severity`** | `activeConditions[]` | `severity` `severityBand` | the band pair | never mixed; RATIFIED as PER-ENTRY |
| **G7 `defense-readiness`** | `defenseProfile.readiness` | `null` (whole, 5 keys) | the `score ↔ label` band | never mixed; RATIFIED |

⭐ **HOW `{ root, members }` EXPRESSES "WITHIN EACH ENTRY", WITH NO EXTENSION — measured, not
proposed.** The register's path vocabulary is COLLAPSED: `[]` means "at every index". The merge's
keyed-collection arm passes exactly that spelling to the entry node — `mergeNode(kr.get(k),
k0.get(k), k1.get(k), \`${path}[]\`, stats)` (the recon prototype's `merge.mjs:133`, the code
EM-R0c inherits). So `{ root: 'activeConditions[]', members: ['severity','severityBand'] }` is
matched by plain path equality at the entry node, inside the keyed merge, **and needs no new
machinery at all**. The register says so in a comment so EM-R0c cannot invent a second mechanism.

⛔ **`income-shares` IS STRUCK**, by §22.3 item 3: a collection under a cross-entry total is ATOMIC,
which is strictly stronger than a group (a group takes the whole object from one side; ATOMIC takes
the whole collection from one side, and the collection is what the total is over).

**The two measured NON-groups stand** (§22.3 item 4): `economicState` — the settled child is always
the whole `foodSecurity` subtree beside an unrelated import or income entry; a group there would
move the food card when a bank is added. `availableServices` — the mixing is across eleven
independent lists, and its real invariant is REFERENTIAL, which is EM-R0b's check and EM-R6's
removal sweep (Q3, CONFIRMED).

**Recorded here, owned elsewhere** (§22.3 item 5): `stress ≡ stressors` byte-identical in 63/63, and
the HELD-internal pairs (`publicLegitimacy`'s score/breakdown and label/flags; the governing-seat
pair) are EM-R0b's cross-key checks, never groups — the merge never merges a HELD key, so a group
there could not fire. ⛔ **One candidate REJECTED by its own control:** `economicState.tier ⇒
isEntrepot` — a capacity correlation at the larger tiers, not a band of the tier.

### 5.4 PLACEMENT, THE FOUR BUDGETS, AND THE SAVE ROUND TRIP

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The address that does not exist yet | `src/domain/edit/` | — | ABSENT; `git grep "domain/edit"` returns **two lines, both comments in test files**, zero production references (E-17, re-run at this tip) | This packet founds it |
| Generation-worker ceiling | `tests/build/generationWorkerLazy.test.js` | `WORKER_BUNDLE_CEILING_BYTES` | `= 1401208`, EXACT, zero slack | **UNTOUCHED.** Delta **0 B** |
| First paint | `vite.config.js` | `computeEngineSharedDomain()` `:31`, `EAGER_FIRST_PAINT_MODULES` `:309` | seeded from the `src/domain` closure of what `src/generators` imports | **NOT SEEDED.** Delta **0 B** |
| Lazy engine / data-lazy | `tests/build/vendorPdfLazy.test.js` | the engine + data-lazy arms | a module with no importer is in NO chunk | Delta **0 B** |
| ⭐ The save READ path | `src/domain/normalizeSettlement.js` | `normalizeSettlement` | loaded by `saves.js:78-88` and applied to `entry.settlement` by `migrateSettlementShape` (`:264-267`) at `:713` and `:332`. **MEASURED: JSON round trip then normalize is byte-identical to the generated record in 63/63 — adds no key, drops no key, changes no leaf, adds or drops no collection** (E-34) | The register is total over a loaded record by construction |
| ⭐ The save WRITE path | `src/lib/saves.js` | `withNeighbourNetworkFromRelationship` (`:233-256`) | the ONLY clause of the save path that reshapes the settlement blob; applied at `:444 :505 :744 :777`. **MEASURED: a no-op on a generated record (`neighborRelationship` is null in 525/525); with a neighbour named it adds exactly `neighbourNetwork`, 41 → 42** | §5.1's saved-only rows |
| The envelope, deliberately excluded | `src/lib/saves.js` | `migrateSaveToV2` (`:190-218`) | it touches `seed` and `campaignState` on the ENTRY, never the settlement blob — read whole | Not a record key; not in the register |
| Test precedent (totality walker) | `tests/lint/densityCreateBoundary.walker.test.js` | its `describe` | an EXACT PARTITION over a live scan, both directions, floored against vacuity in the same file — and its mutation-coverage row is a `rationale` for that reason | **Copy this shape and this rationale form** |
| Test precedent (corpus stride) | `tests/lint/proseWiringCensus.walker.test.js` | its `goldenCorpus` import (`:60`) | **13 of the estate's `tests/lint/` files already generate settlements** | The precedent that makes a generating walker lawful under `tests/lint` |
| The obligation's source | `tests/lint/mutationCoverage.shared.mjs` | `export const ENFORCER_DIRS` | `tests/lint` is one of the eight (`:36`) | §7's REGISTER row |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | neither appears in §7 | UNCHANGED; motion is a STOP |

⛔ **THE PLACEMENT RULE THIS PACKET PINS FOR THE WHOLE FAMILY:** no `src/generators/**` module may
ever import `src/domain/edit/` — EM-P3 measured that one path segment sends
`EAGER_FIRST_PAINT_MODULES` 268 → 270. **When a consumer exists, which chunk:** today none, so every
budget delta is exactly 0 B rather than "small"; the FIRST importer is **EM-R0c (THE MERGE)**, then
EM-R0b, EM-R6 and EM-R7, and EM-R0c prices the register's 163 measured lines with its own.

### 5.5 Forbidden alternatives

- ⛔⛔ no `src/generators/**` module may import `src/domain/edit/recordRegister.js`;
- ⛔ **THE RECEIPT IS MERGED, NEVER RECOMPUTED.** A rebuild moves
  `judgments[id=confidence_and_provenance].evidence[path=simulationTrace]` on 63/63 records, because
  the receipt is built before the trace reaches the settlement (§1). Only RECEIPT and MIRROR paths
  are ever recomputed; the generation receipt is neither;
- ⛔ no branch, no function, no import in the leaf — a resolver belongs to EM-R0c;
- ⛔ no second register — EM-R0b, EM-R0c, EM-R6 and EM-R7 import this module and re-declare nothing;
- ⛔ no key declared on uniqueness alone where the corpus cannot test it (the nine A4 rows);
- ⛔ **nothing merged by position, ever**, and nothing keyed under a cross-entry total;
- ⛔ no band THRESHOLD in this register — the three ladders are EM-R0d's and the fourth is the
  domain's; this packet names no number;
- ⛔ no committed corpus fixture; no new `worldState` key; no persisted shape; no flag; no component;
- ⛔ no edit to either golden, to the lighting baseline by hand, or to any file outside §7.

## 6. Exact contracts

### Inputs and outputs

```js
// src/domain/edit/recordRegister.js — PURE FROZEN DATA. No branch, no function, no import.
// Every row is a MEASUREMENT over the golden corpus and the save path, re-measured at promotion;
// the walker holds this file equal to the corpus in BOTH directions.
// ⛔ NO src/generators/** MODULE MAY IMPORT THIS FILE (§5.4).
// ⛔ PATH SPELLING: collapsed. `[]` means "at every index"; `factions[].members` is the
//    collection, `factions[].members[]` the entry. The merge's keyed arm passes exactly this
//    spelling to an entry node, which is how a PER-ENTRY group is matched with no new machinery.

export const RECORD_CLASS_NAMES = Object.freeze([
  'HELD', 'WORLD', 'CONSTANT', 'READING', 'MIRROR', 'RECEIPT', 'HISTORY', 'AUTHORED',
]);

/** Every top-level key a record can carry — generated, saved, or the editor's. */
export const RECORD_CLASSES = Object.freeze({
  // HELD (7) — the record's first-hand entity facts. Never re-derived.
  institutions: 'HELD', npcs: 'HELD', factions: 'HELD', relationships: 'HELD',
  conflicts: 'HELD', powerStructure: 'HELD', name: 'HELD',
  // WORLD (3) — the input itself; the merge takes R1's.
  config: 'WORLD', _config: 'WORLD', _seed: 'WORLD',
  // CONSTANT (4)
  id: 'CONSTANT', generatorVersion: 'CONSTANT', schemaVersion: 'CONSTANT',
  simulationVersion: 'CONSTANT',
  // READING (25) — everything the seam does not hold; merged three-way, never recomputed.
  activeConditions: 'READING', arrivalScene: 'READING', availableServices: 'READING',
  coherenceNotes: 'READING', culturalIdentity: 'READING', culturalNotes: 'READING',
  defenseProfile: 'READING', economicState: 'READING', economicViability: 'READING',
  generationCoherenceReceipt: 'READING', history: 'READING', isolationSupport: 'READING',
  neighborRelationship: 'READING', population: 'READING', pressureSentence: 'READING',
  prominentRelationship: 'READING', resourceAnalysis: 'READING', settlementReason: 'READING',
  simulationTrace: 'READING', spatialLayout: 'READING', stress: 'READING', stressors: 'READING',
  structuralSuggestions: 'READING', structuralViolations: 'READING', tier: 'READING',
  // AUTHORED (2 live) — the DM's and the clerk's words, untouched BY CLASS.
  userCanon: 'AUTHORED', aiOverlays: 'AUTHORED',
  // SAVED-ONLY (4) — generation produces none of these; see SAVED_ONLY_KEYS.
  neighbourNetwork: 'HELD', interSettlementRelationships: 'HELD',
  crossSettlementConflicts: 'HELD', populationHistory: 'HISTORY',
  // THE EDITOR'S (2) — declared ahead; asserted ABSENT until an editor packet writes them.
  dmLayer: 'AUTHORED', decrees: 'AUTHORED',
});

/** The 41 a generated record carries. Arm A1 asserts this set exactly against the corpus. */
export const GENERATED_KEYS = Object.freeze([ /* the 41 of §5.1, lexicographic */ ]);
/** Written only by the save path, the campaign or the pulse — never by generation. */
export const SAVED_ONLY_KEYS = Object.freeze([
  'neighbourNetwork', 'interSettlementRelationships', 'crossSettlementConflicts', 'populationHistory',
]);
/** Declared but not yet written anywhere. Arm A1 asserts their ABSENCE, never their shape.
 *  ⚠ `crossSettlementConflicts` is here because NOTHING IN src/ WRITES IT: two readers merge it
 *  and the public allow-list names it (RelationshipsTab.jsx:59; relationshipsDeskRead.js:156). */
export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);

/** Sub-paths whose class differs from their parent's. The WHOLE exception list. */
export const CLASS_EXCEPTIONS = Object.freeze({
  'powerStructure.economyInputFingerprint': 'RECEIPT',
  'factions[].members[]': 'MIRROR',
  // ⭐ MEASURED, not named: the ONLY receipt sub-path that reads an input the record lacks.
  'generationCoherenceReceipt.repairs': 'HISTORY',
});

/** Collections merged BY a declared key (48). A string is one field; an array is a composite. */
export const KEYED_COLLECTIONS = Object.freeze({ /* the 48 of §5.2 / E-10, lexicographic */ });

/** Collections merged AS ONE VALUE (15) — keyless, key-broken, or under a cross-entry total. */
export const ATOMIC_COLLECTIONS = Object.freeze([ /* the 15 of §5.2 / E-10, lexicographic */ ]);

/** ⭐ Why two of those fifteen are atomic DESPITE carrying a sound key (design §22.3 item 3):
 *  taking one changed entry from the re-derivation beside settled neighbours breaks the total.
 *  `mootUnder: 'HELD'` records that the merge cannot reach the second one today. */
export const CROSS_ENTRY_TOTALS = Object.freeze({
  'economicState.incomeSources': Object.freeze({ field: 'percentage', total: 100 }),
  'powerStructure.factions': Object.freeze({ field: 'power', total: 100, mootUnder: 'HELD' }),
});

/** ⚠ Rows whose longest observed array is ONE entry: the corpus cannot test uniqueness there,
 *  so the key is declared on its STABILITY and NAMED as unproven. */
export const KEY_UNPROVEN_AT_LENGTH_ONE = Object.freeze([ /* the nine of §5.2 */ ]);

/** ⛔ Collections a reclassification may NOT merge without first proving a key. */
export const UNMERGEABLE_COLLECTIONS = Object.freeze([
  'relationships', 'conflicts', 'powerStructure.conflicts',
]);

/** Object paths the generator derives together. `members: null` means the whole object.
 *  A root spelled `foo[]` is a PER-ENTRY group, matched at the entry node the keyed merge
 *  produces — by path equality, with no additional mechanism. Groups never nest (arm A6). */
export const CONSISTENCY_GROUPS = Object.freeze([
  { id: 'food-security', root: 'economicState.foodSecurity', members: null },
  { id: 'food-balance', root: 'economicViability.metrics.foodBalance', members: null },
  { id: 'viability-counts', root: 'economicViability', members: Object.freeze([
    'summary', 'dependencies', 'warnings', 'plotHooks',
    'metrics.dependencyCount', 'metrics.warningCount']) },
  { id: 'isolation-support', root: 'isolationSupport', members: Object.freeze([
    'requiredCapacity', 'capacity', 'deficit', 'status']) },
  { id: 'condition-severity', root: 'activeConditions[]', members: Object.freeze([
    'severity', 'severityBand']) },
  { id: 'defense-readiness', root: 'defenseProfile.readiness', members: null },
]);
```

### Absence rules

- **absent from `RECORD_CLASSES`:** forbidden for any observed key — arm A1 reds by name.
- **`NOT_YET_WRITTEN_KEYS`:** asserted **ABSENT** from every generated record. Present is a RED
  here; the packet that writes one moves the arm.
- **`SAVED_ONLY_KEYS`:** asserted absent from a GENERATED record and classed for a saved one. The
  walker does not demand them, because it generates and does not save (A1's third arm).
- **every declared path must be OBSERVED at least once** — a dead declaration reds (A2, A3, A6).
- **an empty array** carries no entry shape and is not an observation of its entries; **`null`** is
  an observation of the path, never of its shape; **a new field on an entry** is not a red — the
  register declares keys, not schemas.

### Ordering, determinism, lifecycle

- The exception beats the parent; there is no third level. `KEYED` and `ATOMIC` are DISJOINT and
  their union is total over the observed object collections (A3, both directions).
  `CROSS_ENTRY_TOTALS`' key set is a SUBSET of `ATOMIC_COLLECTIONS` (A7).
  `UNMERGEABLE_COLLECTIONS` are all HELD (A5). Declaration order is lexicographic by path.
- Hash/fork key `NONE`; no PRNG, clock, locale or environment. The walker is deterministic: the
  stride is `goldenCorpus()`'s own fixed rows with the corpus's own `_seed`.
- Flag `NONE`. Golden posture **UNCHANGED**. Lifecycle: module load, frozen; read by EM-R0b/R0c/R6/R7
  at merge time; never persisted. Alignment: `DECLARED EMPTY.` Edit story:
  `ENGINE-ONLY: this packet declares the shape of a record; it exposes no DM verb.`

### ⭐ THE WALKER — seven arms and its `CANNOT-CATCH:` header

`tests/lint/recordRegisterTotality.walker.test.js`. ONE `describe`, seven `it`s, literal titles, no
`.each`, no loop-generated registration, no nested describe (§P3.4). Every negative assertion
carries `// anchored:` on the line immediately above.

**The stride: the 63-row structured sample, derived in-test from `goldenCorpus()` — chosen BY
EXECUTION** (E-21): it yields the same 41 keys, the same 63 collection paths, the same split, the
same 1,170 node and 884 leaf paths as the full 525-row corpus, at **1,256 ms against 7,820 ms**.

| arm | what it asserts |
|---|---|
| **A1 CLASS TOTALITY, BOTH DIRECTIONS** | the walk is non-empty first (≥ 63 records); every observed top-level key is classed; every class is in `RECORD_CLASS_NAMES`; `GENERATED_KEYS` equals the observed set EXACTLY; every `SAVED_ONLY_KEYS` and `NOT_YET_WRITTEN_KEYS` member is ABSENT from every generated record; and the three key lists partition `RECORD_CLASSES` |
| **A2 EXCEPTION LIVENESS AND THE MIRROR** | all three `CLASS_EXCEPTIONS` paths resolve; `factions[].members[]` equals the NPC its `id` names, field for field, in every observed pair; `generationCoherenceReceipt.repairs` is present wherever the corpus produces one |
| **A3 COLLECTION TOTALITY, BOTH DIRECTIONS** | KEYED XOR ATOMIC over every observed object collection; every declared row observed; disjoint; and every KEYED row's key present on every entry and UNIQUE in every array |
| **A4 THE VACUITY FLOOR** | `KEY_UNPROVEN_AT_LENGTH_ONE` equals EXACTLY the declared collections whose longest observed array is one entry |
| **A5 UNMERGEABLE** | every `UNMERGEABLE_COLLECTIONS` path is still HELD and its composite still present-and-unique in every array |
| **A6 GROUP LIVENESS AND NON-NESTING** | every root resolves (a `foo[]` root at every entry); every member path resolves under its root; ids unique; no root nested inside another's |
| **A7 ⭐ THE CROSS-ENTRY TOTALS ARE STILL TOTALS** | every `CROSS_ENTRY_TOTALS` key is in `ATOMIC_COLLECTIONS` and NOT in `KEYED_COLLECTIONS`; and over every multi-entry array observed, the named field sums to the named total (`percentage` → 100 over ≥ 60 arrays; `power` → 100 over ≥ 60). **The paired negative:** `defenseProfile.institutions.magicDef.baseChance` and `.walls.baseChance` are asserted NOT to be totals (≥ 2 distinct sums each), so the arm that admits a total also refuses a near-miss |

```text
CANNOT-CATCH:
1.  neighborRelationship is null in 525/525 corpus rows — its object shape is NEVER observed, and
    it is the very field whose presence makes the save path write `neighbourNetwork`.
2.  Twelve array paths are EMPTY in every corpus row, so their ENTRY shape is never observed:
    aiOverlays · coherenceNotes · config.intendedStressTypes · config.nearbyResourceDefinitions
    · config.nearbyResourceDefinitionsDepleted · config.nearbyResourcesCustom
    · generationCoherenceReceipt.checks[].findings · generationCoherenceReceipt.judgments[].findings
    · resourceAnalysis.exploitation.warnings · resourceAnalysis.featureEffects
    · resourceAnalysis.imports.recommended · resourceAnalysis.priorityNotes
3.  Five leaves are observed ONLY as null: economicState.incomeSources[].priorityNote ·
    economicState.foodSecurity.magicTradeChannel · powerStructure.factions[].modifier ·
    economicState.activeChains[].externalMillNote · powerStructure.factionRelationships[].dmNote
4.  Uniqueness is VACUOUS for the nine KEY_UNPROVEN_AT_LENGTH_ONE rows; A4 names them, it does
    not prove them.
5.  Single-observation paths are one bit: defenseProfile.institutions.militia appears in 1 of 63
    rows, as do institutions[].exclusiveGroupCoexists, defenseProfile.institutions.magicDef[]
    .nativeTier and .coherenceRepair, and economicViability.warnings[].category/.impact/
    .suggestedFixes.
6.  The wizard's RANDOM modes are OFF-CORPUS (settType:'random', culture:'random_culture',
    _randomizePriorities — design §21.5 item 8): a key only those configs produce is unseen.
7.  CUSTOM CONTENT is empty (customContent: {}): a compendium-promoted institution or resource can
    populate config.nearbyResourcesCustom and new institutions[].source values.
8.  userCanon is {} and aiOverlays is [] in 525/525 — both AUTHORED, so their INTERIOR is unseen.
9.  ⭐ THE WALKER GENERATES; IT DOES NOT SAVE. The four SAVED_ONLY_KEYS are classed from the save
    path's source and the public allow-list, and this walker can only assert their ABSENCE. The
    arm that observes them over a real save → load is EM-R7's (design §22.3 item 7).
10. A MALFORMED repairs[] entry is the one seam by which HISTORY reaches a READING: the provenance
    check fires only on a repair missing `type`, `action` or `reason`
    (generationReceiptJudgments.js:654-660). No generated repair is malformed; a future op could
    write one.
11. dmLayer and decrees do not exist yet: A1 asserts their ABSENCE, never their shape.
```

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/recordRegister.js` | `RECORD_CLASS_NAMES`, `RECORD_CLASSES`, `GENERATED_KEYS`, `SAVED_ONLY_KEYS`, `NOT_YET_WRITTEN_KEYS`, `CLASS_EXCEPTIONS`, `KEYED_COLLECTIONS`, `ATOMIC_COLLECTIONS`, `CROSS_ENTRY_TOTALS`, `KEY_UNPROVEN_AT_LENGTH_ONE`, `UNMERGEABLE_COLLECTIONS`, `CONSISTENCY_GROUPS` | `≤ 210` | Copy §6's body VERBATIM with §5.1/§5.2's tables expanded from `EM-R0a.evidence.md` E-10 — every row is a measurement and none may be re-derived, re-ordered or abbreviated. Frozen at module load. **Import nothing. Declare no function. Take no branch.** The emitted draft measures 163 effective lines (E-33). |
| `CREATE` | `tests/lint/recordRegisterTotality.walker.test.js` | arms A1–A7 and the `CANNOT-CATCH:` header | `n/a` | The seven arms of §6 in ONE `describe` with seven literal `it` titles. Derive the 63-row stride in-test from `goldenCorpus()`; commit NO fixture. Generate through `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })`, exactly as `tests/property/generatorGoldenMaster.test.js:798` does. Put the eleven-row `CANNOT-CATCH:` block in the header verbatim. Every negative assertion carries `// anchored:` on the line immediately above. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | one `invariants` row keyed `tests/lint/recordRegisterTotality.walker.test.js` | `n/a` | ⛔ Added SURGICALLY beside its siblings; **the manifest is NEVER re-serialised whole.** `kind: "rationale"`, in `tests/lint/densityCreateBoundary.walker.test.js`'s form: the file's catching power is an EXACT PARTITION over a live measurement, asserted in BOTH directions and floored against vacuity inside the same file (A1's non-empty walk, A3's disjoint-and-total pair, A4's exact unproven set, A7's paired negative), so no source mutant can perturb it. |

**Generated artifacts: `NONE`, and §P2 rows 10 and 12 are answered rather than assumed.** No
`checks` command of this packet runs a generator (`npx vitest` and `npx eslint` only, §10); the new
leaf is imported by nothing and is therefore an input to none of the five edge-shared bundles; and
this packet widens no named set, so row 12's consequence sweep has no subject.

No other file may be edited.

**Predicted register moves:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census (§P2.1) | **YES — one new TEST file** | `files +1` · `parked +0` · `credited +1` · `titles +7` (A1–A7; A8 runs a file it does not edit) · `suiteTitles +1`. ⛔ **NO ABSOLUTE IS QUOTED.** The register is ALREADY RED at this tip and this packet is not the cause: the baseline pins `files 2646` while the live tree holds **2649** (E-28) — EM-B3a, EM-P3 and EM-B1e's un-refrozen landings. The chair stamps the live baseline at promotion | a named INTERIOR RED; re-derived whole at the terminal, BY THE CHAIR |
| Mutation-coverage (§P2.2) | **YES** | `+1` row — `tests/lint` is an `ENFORCER_DIR` | §7's REGISTER row. ⛔ It forces the base to the tip and collides with EM-B1d (§4) |
| Observed-shape readers (§P2.3) | **PREDICTED NO**, with a live precedent | the leaf has zero member expressions and zero destructuring over a settlement value; `src/domain/display/publicSafe.js` already carries quoted top-level record keys under `src/domain/`, inside the scanner's roots, with no exemption row (E-24) | ⚠ **MEASUREMENT OWED AT PRE-PROOF** — run the scanner read-only with and without an overlay and quote the delta; if it moves, the migration-bundle door is a CHAIR act and the packet **STOPS** |
| Writer-reach (§P2.4) | **NO** | a module no importer reaches is outside all seven `SURFACE_ROOTS` | — |
| Bundle ceilings (§P2.11) | **NO — 0 B in all four** | a module with no importer is emitted in no chunk (§5.4) | EM-R0c pays the register's bytes as its first importer |
| Prose-numerics · decision-fork · mechanism-coverage · size-baseline · edge-shared | **NO** | zero | — |
| ⚠ Line-addressed baselines (the pre-proof's new step 13) | **PREDICTED NO** | this packet adds two files and shifts no line in any existing file, so no FILE+LINE-addressed baseline row can move | re-confirmed at pre-proof |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Re-run E-17's grep**; a production reference
   to `src/domain/edit/` is a STOP and a re-compile.
1. Capture the baseline: both goldens GREEN at the base, counts recorded, so A8 is a comparison.
2. Add the walker with arms A1–A7 **failing** and the `CANNOT-CATCH:` header.
3. Create `src/domain/edit/recordRegister.js` with §6's body verbatim. The arms go green.
4. **Prove each arm bites, one at a time, then restore** (§P6): delete a `RECORD_CLASSES` row →
   A1 reds naming that key; add a `SAVED_ONLY_KEYS` member to a generated record's expected set →
   A1's absence arm reds; change a `KEYED_COLLECTIONS` key to a non-unique field → A3 reds naming
   the duplicate; add an unobserved path to `ATOMIC_COLLECTIONS` → A3's liveness direction reds;
   drop a `KEY_UNPROVEN_AT_LENGTH_ONE` row → A4 reds; move `relationships` out of HELD → A5 reds;
   point a group root at a path no record carries → A6 reds; **move `economicState.incomeSources`
   back into `KEYED_COLLECTIONS` → A7 reds**, and change its declared total to 99 → A7 reds again.
   Restore the exact pre-mutant SHA-256 after each and re-run green. A mutant that reds under a
   DIFFERENT title is ambiguous and is a STOP.
5. Add the `scripts/mutation-coverage-manifest.json` row, surgically.
6. No other registration is owed (§7's table).
7. Run focused verification (§10), including A8's golden proof.
8. ⛔ **Do NOT refreeze the lighting census** — the terminal's act and the chair's (§P2.1).
9. Write the completion receipt, quoting the walker's own test count, the nine restored mutants, and
   the two goldens' counts.

Bounded algorithm (the walker's core):

```text
1. rows = the 63-row structured sample derived from goldenCorpus(): the FIRST row of each
   (settType, terrainOverride) pair among the grid rows, then every non-grid row.
2. records = rows.map(generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })).
3. REFUSE an empty denominator: assert records.length >= 63 before any other assertion.
4. Walk every record. Collapse each path (every [i] -> []). Collect: topKeys · objectCollections
   with, per declared key, present-on-every-entry and unique-in-array · maxLenByPath ·
   observedPaths · and, for every CROSS_ENTRY_TOTALS row, the per-array sum of its named field.
5. A1..A7 assert the register against those six collections, in both directions, BY NAME — never
   by count alone: a failure message carries the offending path and the row that must change.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behaviour — class totality, three-way partition | the 63-row stride | every observed key classed; every class one of the eight; `GENERATED_KEYS` equals the observed set exactly; every saved-only and not-yet-written key ABSENT | `tests/lint/recordRegisterTotality.walker.test.js` |
| A2 | The exceptions are live; the MIRROR is measured | the same records | all three exception paths resolve; every member chip equals its NPC field for field | same |
| A3 | Counterforce — collection totality and key soundness | the same records | KEYED XOR ATOMIC, both directions, disjoint; every KEYED key present and UNIQUE in every array | same |
| A4 | Boundary / anti-vacuity | the same records | non-empty walk; `KEY_UNPROVEN_AT_LENGTH_ONE` equals exactly the length-one declared collections | same |
| A5 | A ruling made enforceable — the unmergeable set | the same records | all three still HELD; composites still unique; a reclassification out of HELD reds | same |
| A6 | Group liveness and non-nesting | the same records | every root resolves (per-entry roots at every entry); members resolve; ids unique; no nesting | same |
| A7 | ⭐ The cross-entry totals, with a paired negative | the same records | `percentage` → 100 and `power` → 100 over every multi-entry array; both keys ATOMIC and not KEYED; and the two rejected `baseChance` candidates asserted NOT totals | same |
| A8 | ⭐ Identity / golden | the 525-row corpus | `generatorGoldenMaster` and `dossierProseManifest` **do not move** | `tests/property/generatorGoldenMaster.test.js` · `dossierProseManifest.test.js` (run, not edited) |

Rows for lifecycle and idempotency are **omitted, not replaced**: nothing is persisted or projected.

## 10. Verification commands

```sh
npx eslint src/domain/edit/recordRegister.js tests/lint/recordRegisterTotality.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/recordRegisterTotality.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js --maxWorkers=2

# A8 — the identity proof. It must be GREEN, not re-recorded.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/property/generatorGoldenMaster.test.js \
  tests/property/dossierProseManifest.test.js --maxWorkers=2

node scripts/implementation-packets.mjs validate
```

Expected: **every command exits `0`**, except the ONE named interior red — the lighting census,
red at the base already and re-derived whole at the terminal by the chair. `UPDATE_GOLDEN` and
`LIGHTING_CENSUS_REFREEZE` are **never** set. ⛔ A gate line with no printed test count DID NOT RUN.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if: either golden moves; the
observed-shape or writer-reach scanner moves against §7's prediction; the leaf would gain an import,
a function or a branch; any `src/generators/**` module would import `src/domain/edit/`; a second
register appears necessary; the receipt would be RECOMPUTED rather than merged; a declared
collection proves to have no sound key AND no atomic reading; a cross-entry total is found that the
register does not name; `validate:packets` reports a duplicate change path (§4); the stride would
need a committed fixture; an arm would be gated behind an environment variable; or the lighting
census would be refrozen inside the packet.

### ⛔ The questions that remain — listed, not waited on

**Q1 — `authoredTensions`: the ruling's TEST and the ruling's EXAMPLE LIST disagree, and the test
wins here.** §22.3 item 1 names `authoredTensions` as HISTORY and, in the same sentence, defines
HISTORY as "anything computed from the generation context or the repair log, neither of which
reaches the record", and commands "measured from `buildGenerationCoherenceReceipt`, never by name".
Measured (E-29, and the source at `generationCoherence.js:418-441`), `authoredTensions` reads
**only the settlement** and moves under none of the three withholding arms in 63/63 rows. **The
register applies the TEST and classes it a READING.** Consequence if the chair prefers the example
list: one row moves into `CLASS_EXCEPTIONS`, and a merged record's `authoredTensions` would then be
carried from the pre-edit record while `structuralViolations` — the key it is computed from — is
re-derived beside it, which is the contradiction shape item 1 exists to remove. **One line either way.**

**Q2 — the four SAVED-ONLY classes.** `neighbourNetwork` · `interSettlementRelationships` ·
`crossSettlementConflicts` → HELD; `populationHistory` → HISTORY. **All four are behaviour-free
today** (neither re-derivation produces them, so the ABSENT rule keeps all four whole whatever class
they carry), so this is about meaning and about what a future writer inherits. The one that needs a
word: **classing `populationHistory` HISTORY widens that class from "the account of how the town was
first made" to "the record's own account of what has happened to it"** — justified by THE PROMISE
(lived history is immutable, never merged, never recomputed) but a definition change, which is the
chair's. The alternative is HELD, which would make it editable, and that contradicts THE PROMISE.

**Q3 — `crossSettlementConflicts` is a key nothing writes.** The public allow-list names it, two
readers merge it, and two independent source comments state that nothing in `src/` writes it. This
packet classes it and lists it in `NOT_YET_WRITTEN_KEYS` so the walker asserts its ABSENCE rather
than inventing a shape for it. Its FATE is proposed in §12 under the owner's no-deferral law; the
chair slots it.

**Q4 — the pre-proof's owed scanner run.** The observed-shape prediction is PLAUSIBLE with a live
precedent, never CONFIRMED, because a compile lane may not run repo scripts. Named as owed in §7;
confirm that the pre-proof, not the build, is where it is discharged.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue.

## 12. Completion receipt

⭐ **THE COMPLETION COMMIT NAMES EXACTLY THESE THREE PATHS AND NO OTHER** — the commit is made with
an explicit pathspec and `git show --stat HEAD` is read back before the receipt is written:

```
src/domain/edit/recordRegister.js                      (CREATE)
tests/lint/recordRegisterTotality.walker.test.js       (CREATE)
scripts/mutation-coverage-manifest.json                (REGISTER — one row, surgical)
```

- Base SHA: `__BASE__` (stamped by the chair at promotion).
- Dispatch bundle and seal identity: **NOT DISPATCHED** — status DRAFT; compiled at `58fcfe614`,
  re-cut at `ad7ddf2c9`.
- Final commit or working-tree state: **no edit made in any tree.** The lane wrote only under
  `$SP/lane-em-compile-EM-R0a-scratch/`.
- Exact changed files and effective-line deltas: `NONE` — the emitted draft measures 163 effective
  lines against a `≤ 210` bound.
- Acceptance cases: `0 of 8 executed`. Focused commands: **no vitest, eslint, `npm run check`, build
  or writing script was run.** Every measurement is in `EM-R0a.evidence.md` (E-1…E-34).
- Both typecheck configurations · base-versus-wave diff · dormancy: `n/a`.
- Bundle/first-paint result: **0 B in all four budgets**, by the import graph.
- Generated artifacts: `NONE`. Deviations: `NONE`.
- ⭐ **NOTICED, WITH A FATE FOR EACH — the owner's law (charter, 2026-09-19 18:10): no item leaves
  this packet without a SLOT, an OWNER'S DECISION POINT, or CLOSED-not-work.**

| item, as measured here | proposed fate (the chair slots it) |
|---|---|
| ⛔ **`crossSettlementConflicts` is allow-listed by the public veil and merged by two readers, and NOTHING IN `src/` WRITES IT** (`RelationshipsTab.jsx:59`, `relationshipsDeskRead.js:156` both say so) | **SLOT: RECON-ID's table** (chartered 2026-09-19 18:49 — "every entity-id namespace in one table, every handle and resolver"). It is the same question in another dress: a cross-save relation with readers and no writer. If the recon shows it is dead, the fate becomes CLOSED and the key leaves the allow-list in the same sitting |
| ⭐ **A RECOMPUTE of the generation receipt moves `judgments[id=confidence_and_provenance].evidence[path=simulationTrace]` on 63/63 records**, because the receipt is built before the trace reaches the settlement (`assembleSettlement.js:283` vs `:292`) | **SLOT: EM-R0c's compile**, as a pinned forbidden alternative (the receipt is merged, never recomputed) — already written into §5.5 here so R0c inherits it rather than rediscovering it |
| **A MALFORMED `repairs[]` entry is the one seam by which HISTORY reaches a READING** (`generationReceiptJudgments.js:654-660`) | **SLOT: EM-B1a's pre-proof**, which is where an op that could write a repair is designed; and it is CANNOT-CATCH row 10 here |
| **`history.eventsTimeline` and `history.historicalEvents` are ORDER-BEARING** (monotone in 60/60 multi-entry arrays) | **SLOT: EM-R0c's compile** — they are where §22.2 item 4's "R1's order governs only when the edit moved the order" arm has teeth, and its second arm's counter should be measured on them |
| **`powerStructure.factions`' total is owned by BOTH §22.3 item 3 (atomic) and §22.2 item 8 (the op renormalises)** | **CLOSED — not work: the two rulings agree.** Recorded in `CROSS_ENTRY_TOTALS` with `mootUnder: 'HELD'` so the agreement is in one place |
| ⛔ **FIX-G1 is still live at THIS tip** — `town\|germanic\|mountain\|mountain_pass\|civilized` says 6 operational dependencies beside a list of 5, 1 of 51 rows that spell the count (re-measured at `ad7ddf2c9`) | **CLOSED — already slotted and built:** the FIX-G1 parallel lane is staged and its one-row golden re-record rides the owner's signed door at train EM-T4. This packet's G3 evidence goes 50/51 → 51/51 when it composes; the group does not change |
| **`stress ≡ stressors`, byte-identical in 63/63** | **CLOSED — slotted by §22.3 item 5:** it ships as an EM-R0b cross-key check |
| **`resourceAnalysis.gaps`' `chain` is not unique in 142 of 489 arrays at 525 rows** — several rows per chain by design; whether a DM should ever see two gap rows for one chain is a product question nobody has asked | **OWNER'S DECISION POINT, at the moment the gaps card is designed** (the EM-D family's dossier work). Not a defect; a display question with no current surface |
| ⛔ **The kit's `instrument.mjs` chdir hazard** | **CLOSED — cured by the chair the same turn** (charter, 18:23): a loud header on every kit copy and a line in the launch texts. This lane re-audited itself under the cure and is clean (E-1) |
| **The Markdown-vs-JSON change-table validator arm is still ABSENT at `ad7ddf2c9`** (`implementation-packets.mjs` reads the Markdown only through `parsePacketHeader`) | **CLOSED — already slotted:** TOOL-1 is composed at train EM-T4. This packet's §7/JSON equality was printed by this lane's own re-implementation of the stated contract (E-20) and will be re-printed by the arm when it lands |

- Judgment calls (compile lane, each vetoable, each with its measurement):
  1. **Applied §22.3 item 1's TEST over its example list for `authoredTensions`** (Q1), because the
     ruling commands measurement and forbids naming by feel.
  2. **Classed the four saved-only keys** (Q2), noting all four are behaviour-free today.
  3. **Rejected two cross-entry candidates by a relative tolerance** after a loose one raised them,
     and recorded the rejection rather than dropping it.
  4. **Made A7 carry the paired negative** so the arm that admits a total also refuses a near-miss.
  5. **Kept the 63-row stride**, re-confirmed identical to the 525-row classification at the new tip.
  6. **Left every band THRESHOLD out of this register** — the ladders are EM-R0d's, and a register
     that spelled a number would fork the ladder EM-R0d exists to unify.
