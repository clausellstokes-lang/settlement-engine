# Settlement editor / EM-B1c1 — THE ONE-ROW SLICE: `set-npc-name` alone, in its own leaf, so the owner's first door carries the rename without waiting for the whole EM-R family

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader` anchors the status
  row at end-of-line and takes `status` only when exactly one row matches. Every stamp, caveat and
  date goes on these continuation lines, never on the row.
  ⭐ **RULED BY THE CHAIR (2026-09-20 ~22:15, judgment 39, ruling 1):** *"THE RENAME STAYS IN THE
  DOOR (the owner's design), by the smallest lawful route: EM-B1c1 + EM-C4a VERSION 2 … EM-B1c
  keeps the rest and loses that row (ESTATE-REPAIR-4)."* This is the first of the two pieces.
  ⭐ **THE SEVENTH OF THE FOURTEEN PACKETS ON THE ROAD TO THE FIRST DOOR:** EM-A1 · EM-A2a ·
  EM-A2b · EM-B1h · EM-B1i · EM-B1a · **EM-B1c1** · EM-B2a1 · EM-C4a (v2) · EM-D0a · D0b · D0c ·
  D0d · D0e.
- **Landed at:** `a89ee75f6d0c4003f67bd40652b5a6ed4ce260f7` — the thirtieth landing — train EM-T12 (version 5, judgments 126 and 135): set-npc-name, one row in its own leaf, spliced into the op catalogue at its codepoint position (index 11 of 15, the one-row slice of EM-B1c; 3 files, +288/−10); B6 keeps the op layer and the shipped EDIT_KINDS verbs disjoint by name. Two things said at this flip: the three red-firsts B2/B3/B4 red on a TypeError with the row absent (not vacuous, read whole — judgment 140), and the restamp note in e5c0906b4's body names the T11 drift's cause where the true cause was the version-5 packet commit fa697b1ff (never amended)
- **Packet version:** 5
  ⭐ **VERSION 5 (the chair, judgment 135, 2026-09-21; the build lane's STOP `lane-em-b1c1-t12-scratch/EM-B1c1.STOP-voice-mechanics.md`).** §6.1's `guardsStated` literal carried one U+2014 em dash; `tests/copy/voiceMechanics.test.js` Tier 2 counts every string literal under `src/domain/**` per file (a file with no baseline entry is held at zero) and §10 rightly lists that register among those that must not move — two sentences of one packet disagreed. The standing law wins (no em dash in a `src/` string literal; the baseline is never raised): version 5 changes that ONE character in §6.1 so the leaf installs byte-identical and measures em 0 · bang 0, and corrects §10's reason (Tier 2 counts literals, not rendered copy). No contract, key, count, symbol, arm, path or budget moves; the staged build is re-applied byte-identical under the version-5 seal and the lane makes the one-character change under it.
  ⭐⭐ **VERSION 4 — THE OP IS RE-SPELLED `set-npc-name`, AND ONE DISJOINTNESS ARM IS ADDED (the
  chair, JUDGMENT 126, 2026-09-21, on the EM-C4a pre-proof's §12 Qe recommendation (a)+(c)).**
  ⛔ **THE SEMANTICS, THE ROW, THE LEAF, THE PATHS, THE BUDGETS AND EVERY OTHER BYTE OF THE DESIGN
  ARE VERSION 3's.** Exactly what moved:
  **(1) THE KEY.** The op type is `set-npc-name` everywhere — the prose, the §-tables, §6.1's row,
  §9's cases, the capsule's `_note`s — because **`rename-npc` IS ALREADY A LIVE MEMBER OF THE
  SHIPPED PENDING-EDIT VOCABULARY `EDIT_KINDS`** (`src/domain/pendingEdits.js:33`; sixteen
  occurrences over seven `src/` files, fifteen code and one comment, with a canon lock), and one
  string may not mean two typed things. Version 3's **R8** raised this and docketed it; version 4
  **CURES** it. The new key fits the family's own `set-<subject>-<field>` convention, and
  ⛔ **`set-npc-name` occurs NOWHERE in `src`, `tests`, `e2e`, `scripts` or `docs` at the read
  tip** (`git grep -F` → zero hits, exit 1).
  **(2) THE SPLICE MOVES WITH THE NAME.** Re-executed against the tree's own `compareCodepoint`
  over EM-B1a's **LANDED** fourteen: **`set-npc-name` sorts at INDEX 11 OF 15, between
  `set-institution-state` and `set-npc-status`** — and a trailing spread is still proved NOT to
  equal that order. Version 3's *index 9, between `remove-npc` and `set-field`* is retired WITH
  the name it belonged to; the index is a function of the key.
  **(3) ONE ARM IS ADDED — B6, THE SHRINK-ONLY DISJOINTNESS GUARD.** The acceptance matrix is
  **SIX**, §7's row reads `arms B1–B6`, §3's budget reads **6** and the lighting delta is
  `titles +6`. ⛔ **MEASURED, AND IT IS WHY THE ARM IS SHRINK-ONLY AND NOT A BARE EMPTINESS:**
  `OP_TYPES` × `EDIT_KINDS` is **NOT** empty at the tip — **`add-institution` and
  `remove-institution` ALREADY collide**, and they are EM-B1a's LANDED rows, not this member's.
  So B6 guards the population this member can answer for: **every row minted AFTER EM-B1a's
  fourteen**, with the two inherited collisions NAMED and asserted exactly, so a cure banks and a
  NEW collision reds (§6.3).
  **(4) THE RENAME REMOVES TWO OF FIVE LANDED-ARM EXPOSURES — MEASURED AGAINST EM-B1a's ARMS AS
  LANDED.** A non-`rename-*` key does not red **A5**, and it does not red **A1's absent-by-name
  clause**. **THREE** landed arms are widened (**A1 · A3 · A6**) where version 3 named five; **A4
  and A5 are measured GREEN, no widening is owed on either, and a red on either is a STOP.**
  ⭐ And B1's own absent-by-name list becomes **ALL FIVE** of EM-B1c's names, not four.
  **(5) `EDIT_KINDS` JOINS `requiredSymbols`** as the sixth row, because B6 reads it by import.
  **(6) §13:** R8 is **CURED**, R4 gains its version-4 consequence (its reversal STANDS; only the
  exposure it names has gone with the name), and **R11** is raised.
  ⛔ **THE LEAF PATH `src/domain/edit/operationsNpcRename.js` AND THE EXPORTED BINDING
  `NPC_RENAME_OP_TYPES` DO NOT MOVE** — they name the MODULE, not the op key — so no §7 path, no
  `checks` entry, no validator row, no reserved path and no measured path-disjointness moves.
  ⚠⚠ **MEASURED AT THE VERSION-4 READ TIP `a247fa84dd7ae0be7d0be45748bd470e9df81613`**
  (`em-train-11-2026-09-21`; `git status --short` EMPTY before and after; the lane wrote only in
  its own scratch): **EM-B1a HAS LANDED** at that commit — `src/domain/edit/operations.js` (403
  lines) and `tests/domain/editOperations.test.js` (604 lines) are ON DISK and **byte-identical to
  the staged blobs version 3 was pre-proved against** (SHA-256 `c7f7f01a…` and `0b78c9cd…`), so
  every arm quoted below is read from LANDED bytes rather than from a staged blob. ⛔ **Version 4
  discharges nothing on that account** (judgment 126): the `Depends on` row and the five
  `_pendingRequiredSymbols` rows are left exactly as version 3 wrote them, and **the chair
  discharges them at placement.** The fact is recorded here so no build lane reads version 3's
  *"AND IT IS NOT YET"* as current.
  ⚠ **AND THE BRANCH MOVED ONCE MORE DURING THE LANE — `a247fa84d` → `bbd024b6d`** (EM-B3f
  `5a6ce3498`, TOOL-33 `bbd024b6d`), which is why the window is stated rather than assumed:
  **`git diff --stat a247fa84d..bbd024b6d` over all SEVEN of this member's change and
  `requiredSymbols` paths prints NOTHING**, `a247fa84d` is an ancestor (exit 0), and all six
  `requiredSymbols` re-measure at `git grep -c -F` = 1 at the newer tip. ⇒ **Every version-4
  figure holds at both.**
- **Packet version (history):** 3
  ⭐⭐ **VERSION 3 IS THE INDEPENDENT PRE-PROOF AGAINST EM-B1a VERSION 10, MEASURED AT
  `5926f454e`** (the Opus pre-proof lane, train EM-T12, 2026-09-21; read tip `em-train-11`,
  detached-equivalent on `em-train-11-2026-09-21`, `git status --short` EMPTY before and after).
  ⚠ **THE BRANCH MOVED UNDER THE LANE TWICE** — `252d7ba4e` → `cd684a58b` (train EM-T11's
  placement: EM-B1a version 11, EM-B3f, EM-A2a, EM-V10 READY) → `5926f454e` (that placement
  repaired) — so **every measurement was RE-RUN in the same command that read the final tip**, and
  the J-T1 window `bdbf7c89c → <tip>` over all six paths printed EMPTY at each of the three.
  ⛔ **No path, no op row, no payload key, no acceptance COUNT, no required symbol, no `checks`
  entry and no lighting figure moved; the count prover is green unchanged.** ⛔⛔ **THE
  LOAD-BEARING FIND: version 2 named TWO landed EM-B1a arms to widen (A1 and A4) and the roster
  is FIVE.** Measured against EM-B1a **version 10**'s own §9: **A5** asserts
  *"`rename-faction`, `rename-npc` and `rename-settlement` are absent from `OP_TYPES` by name"*
  (version 8, judgment 99, re-aimed A5 at its satisfiable half — version 2's R4 was written
  against version 7's A5 and is now REFUTED), and **A6** asserts `operations.js`'s import list
  **EXACTLY at FIVE specifiers** (version 10, judgment 115 Q6), which this member's one import
  line makes six. **A3**'s home-selection clause is the third exposure, shape-dependent and
  named with its STOP. This is judgment 110's class — a landed arm is widened only by the packet
  whose landing needs it, under its own seal, and a cure lane cannot add a §7 row — caught here
  rather than at the build, exactly as judgment 115 caught it for EM-B1b. What else moved:
  (a) the interim-rules row is STRUCK and the preamble re-stamped, because the fifth amendment
  has LANDED and supersedes the interim sheet; (b) EM-A1 is **LANDED** (train EM-T9) so its
  pending typedef row is discharged and the one remaining gate is EM-B1a; (c) the first-paint
  figure becomes a DATED PAIR (**269** at `bdbf7c89c`, **270** at this member's base) and the
  member's own figure stays the DELTA `N → N`; (d) the sealed `checks` gain
  `tests/domain/editDeclarations.test.js`, whose governing hit is NEW at this tip; (e) the census
  and tuning figures are restated in the shapes their instruments actually print.
  ⭐ **VERSION 2 WAS THE PRE-PROOF'S ORDER, SHAPE AND RULE-COVERAGE REPAIR, MEASURED AT
  `429141e2d`** (the Opus pre-proof lane, train EM-T11, 2026-09-21). ⛔ **No path, no op row, no
  payload key, no acceptance COUNT, no required symbol and no `checks` entry moved.** What moved:
  (1) the composition is a **CODEPOINT-ORDER SPLICE**, not a trailing spread — executed against
  the tip's own `compareCodepoint`, `rename-npc` sorts at **index 9 of 15, between `remove-npc`
  and `set-field`** (⭐ **version 4's key `set-npc-name` sorts at index 11**; each figure is kept
  with the name it belonged to), so version 1's appended spread would have RED EM-B1a's own order arm and its
  parenthetical (*"between `promote-phantom` and `rebalance-power`"*) was measurably false;
  (2) the composition is named by SHAPE, because `HOME_OP_TYPES` is a binding **EM-B1a's contract
  does not mint** (R6); (3) B1's *"both source maps frozen"* is replaced by the arm REACHABLE from
  EM-B1a's five declared exports (R7); (4) B3 spells the two-kind `requires` and B1 spells
  `makeOp`'s FLATTEN, because EM-A1 is **BUILT** with `Op.requires: readonly string[]` and
  `typecheck:domain:strict` is a sealed check; (5) interim rules **12, 14, 15 and 17** — every one
  minted after version 1 was compiled — are answered by measurement, and a count prover ships
  beside the packet.
- **Verified base:** `em-t12-b1c1-2026-09-21` at `efd0eb4481669fce0fa00c356fef9399ab374d17`
  ⚠ Left for the chair's promotion stamp. **The revalidation sentence the chair will use:**
  *"Re-measured at `5926f454ecf1d8fd508b01d757459e2e36686d5d` (read tip `em-train-11`, on
  `em-train-11-2026-09-21` = train EM-T10's landed tip + the fifth amendment + TOOL-30;
  `git status --short` EMPTY at the start and the end of the lane): the **J-T1 window
  `bdbf7c89c → 5926f454e` over all six change and requiredSymbols paths is EMPTY** — `git diff
  --stat` prints nothing, and `bdbf7c89c`, `429141e2d`, `583f8f644` and `e348d59b6` are each an
  ancestor (`merge-base --is-ancestor`, exit 0); the one CREATE target ABSENT (`git ls-files
  src/domain/edit` lists `dmLayer.js`, `fieldDeclarations.js`, `recordRegister.js` and `types.js`,
  so neither `operationsNpcRename.js` nor `operations.js` exists yet); all five `requiredSymbols`
  present VERBATIM, each at `git grep -c -F` = 1; `retiredSymbols` empty and proved so by the
  post-edit simulation; the preamble RE-MEASURED at this tip and **MOVED to
  `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c`** (the fifth amendment,
  `fead56357`, re-spelled at `5926f454e`); the SPLICE INDEX re-executed against the tree's own
  `compareCodepoint` over EM-B1a version 10's fourteen plus this row — **`rename-npc` at index 9
  of 15, between `remove-npc` and `set-field`** (⭐ **VERSION 4 RE-EXECUTED IT FOR THE NEW KEY:
  `set-npc-name` at INDEX 11 OF 15, between `set-institution-state` and `set-npc-status`**; the
  version-3 figure is kept with the name it belonged to), with a trailing spread proved NOT to equal that
  order; the leaf typechecked through the TypeScript API in plain node over both gate configs at
  **0 and 0 errors with `{any:0,suppress:0}`** from the ratchet's own `countText`, a planted
  TS2322 seen in both and an any-cast seen by the counter; the eager first-paint set measured
  **270** with `src/domain/edit/` contributing **ZERO** members (the packet's own probe, exit 0);
  the tip's own validator over a scratch estate with EM-B1a version 10 as if LANDED:
  **`ok=true`, 0 errors over 208 packets** at READY and at DRAFT, the same run with EM-B1a still
  READY refusing on exactly `duplicate change path across packets` for the two shared rows, and
  with EM-B1a absent refusing on exactly the two non-CREATE `fileExists` rows."* ⭐ **EXECUTED
  HISTORY, kept with its as-of mark (§P3.5):** versions 1 and 2's facts were measured at
  `bdbf7c89c` and `429141e2d`, and the window above proves not one of the six paths moved. ⛔ A `__BASE__` packet can never pass
  `validate:packets`; validation is downstream of this stamp, never a precondition of it.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** **`EM-B1a` — MUST BE LANDED, AND IT IS NOT YET** (it authors `OP_TYPES`,
  `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `makeOp`, `validateOp` and the suite this member
  appends to; version 10, train EM-T11). ⭐⭐ **`EM-A1` IS LANDED** (train EM-T9, `e348d59b6`):
  `src/domain/edit/types.js` is ON DISK at this read tip (`git ls-files src/domain/edit` →
  `dmLayer.js`, `fieldDeclarations.js`, `recordRegister.js`, `types.js`), so the `Op` /
  `EntityRef` typedefs this leaf's JSDoc references exist and that half of
  `_pendingRequiredSymbols` is DISCHARGED. **EM-B1a is the one remaining gate, and it is what
  puts this member on TRAIN EM-T12** (judgment 110: EM-B1a returned to compile as version 9 and
  rides EM-T11, so EM-C4a, EM-B1c1 and EM-B1b each moved one train later; judgment 115: EM-B1c1
  takes EM-T12 and EM-B1b EM-T13, because the two share `operations.js` and
  `editOperations.test.js` and the validator's duplicate-path refusal is MEASURED, §10a).
  ⭐ **AND NOTHING ELSE.** It does **not** depend on `EM-P3` (no `set-world-fact` row), on
  `EM-A2a`/`EM-A2b` (no pool), on `EM-B1b`, on `EM-B1c`, or on **`EM-R6`** — see §2.2, where both
  of EM-B1c's gates are re-measured and neither touches an NPC. The six symbols those two siblings
  create ride `_pendingRequiredSymbols`, never `requiredSymbols` (interim rule 3: the array form
  refuses twice, once on the row's `path` and once on its `symbol`).
- **Collision group:** **`EM-B1a`** · **`EM-B1b`** · **`EM-B1c`** — all four write
  `src/domain/edit/operations.js` and `tests/domain/editOperations.test.js`. ⛔ **They serialize:
  B1a → B1c1 → (B1b, B1c in either order).** This member is deliberately placed second so the door
  does not wait: it is the only one of the four with no gate of its own. ⭐ **The four leaves are
  DISJOINT and each is named:** `operations.js` (EM-B1a) · `operationsOffStage.js` (EM-B1b) ·
  `operationsNpcRename.js` (**this**) · `operationsHomeDelegating.js` (EM-B1c v4).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. The NPC cascade read by symbol; its five declared surfaces; the
  shipped store writer read WHOLE (`src/store/settlementRenameHelpers.js`, 444 lines); the pulse's
  NPC key; the eager first-paint graph (269 members, by IMPORTING `vite.config.js`'s own export,
  reading no `dist`); the governing test set by `git grep -l -F`; the validator's own `fileExists`
  rule read at source. Receipts in `EM-B1c1.evidence.md`; the chair's own measurement in
  `findings/COMPILE-EM-D0-2026-09-20/01-THE-RENAME.md`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR;
  measured at this read tip with `shasum -a 256` as
  `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c`).
  ⭐⭐ **THE FIFTH AMENDMENT HAS LANDED** (`fead56357` on the train EM-T11 branch, re-spelled at
  `5926f454e`), **so this packet carries NO interim-rules row.** The amendment's own opening
  sentence rules it: the interim sheet *"is SUPERSEDED BY THIS TEXT … so a packet compiled after
  this amendment carries no interim row and no clause saying which of the two governs where they
  disagree."* Version 2's row (rules 1–17 with a stale hash) is STRUCK and every citation of an
  interim rule below is re-aimed at the amendment's own section and item.

---

## §1 · Reconciled authority

| source | section + item | what it rules here |
|---|---|---|
| the chair | **ruling 1 on EM-D0**, 2026-09-20 ~22:15 (judgment 39) | *"EM-B1c1 = the one-row slice of EM-B1c carrying `rename-npc` alone, in its own leaf (about ten lines) … EM-B1c keeps the rest and loses that row (ESTATE-REPAIR-4)."* ⭐ **THE QUOTE IS LEFT VERBATIM: the ROW is the ruling's, and its KEY is `set-npc-name` from version 4** (judgment 126) |
| the chair | **judgment 126**, 2026-09-21 ~14:5x, on the EM-C4a pre-proof's §12 Qe | the op is re-spelled **`set-npc-name`** (the shipped `EDIT_KINDS` verb `rename-npc` keeps its name and its fifteen code sites) and **ONE shrink-only `OP_TYPES` × `EDIT_KINDS` disjointness arm** is added to this member's own TEST row; nothing else is discharged and nothing else is re-ruled |
| design `DESIGN_EDIT_MODE_AND_DECREES.md` | **§20.4**, the first door | *"the rename through the cascade"* is IN the first door — the sentence this member exists to keep true |
| the same | **§12.3** | names are JOIN KEYS; a rename is a typed op that **runs the existing cascade** |
| the same | **§18** / ODQ §934.50 | `requires: { world, registry }`; a rename requires nothing of the world |
| charter `EDIT-MODE-TRAIN.md` | the **EM-B1c** row, as sliced | the five delegating home ops; this member takes exactly one of them |
| `EM-B1a` | **§16.3** (R6, CLOSED) | the two-kind `requires` shape, on **every** row |
| `EM-B1a` | **§6**, the row schema | every field is required on every row; none may be omitted "when empty" |
| `EM-PREAMBLE.md` (the FIFTH AMENDMENT) | **§P2.1 · §P2.2 · §P2.11 · §P2.13 · §P2.15 · §P2.16 · §P2.17 · §P3.4 · §P3.5 · §P4 (the splice law) · §P9(a)–(f) · §P10.2 · §P10.3 · §P10.8 · §P10.11 · §P11** | ⭐ **VERSION 3 RE-AIMS EVERY CITATION FROM THE INTERIM SHEET TO THE AMENDMENT THAT SUPERSEDED IT:** the deferred lighting and census rows and their two named red arms (§P2.1, §P2.13); the mutation row not owed (§P2.2, measured); the byte price and the one byte-arm holder (§P2.11); the browser suite stated as NOT governing (§P2.15); line-addressed registers, `none found` (§P2.16); the tuning inventory's own counters with controls (§P2.17); straight-line `it`s, no `.each` (§P3.4); every register figure a DELTA and every absolute a dated pair (§P3.5); ⛔ **the codepoint SPLICE by position, never a trailing spread (§P4, judgment 92 — this member's own finding, now law)**; the six capsule-shape rules and the count law (§P9); the lane branch and MEASURE-BEFORE-YOU-SEAL (§P10.2, §P10.3); the row-keyed register (§P10.8); the independent pre-proof (§P10.11); what stays the owner's (§P11) |

### ⛔ §1.1 · EM-B1c LOSES THIS ROW. NEVER TWO HOMES FOR ONE OP.

⭐ **EM-B1c §6's `rename-npc` ROW IS CARRIED HERE VERBATIM IN EVERY FIELD, AND RE-KEYED
`set-npc-name`** (judgment 126): the `target`, the `payload`, the `stage`, the `consequence`, the
two-kind `requires` and the `guardsStated` delegation are EM-B1c's, byte for byte; only the KEY
is re-spelled, and §6.1 says why in one sentence. At EM-B1c's next repair
(**ESTATE-REPAIR-4**, the chair's) EM-B1c goes to **version 4 with FOUR rows** —
`rename-faction`, `rename-settlement`, `set-world-fact`, `schedule-event` — in
`src/domain/edit/operationsHomeDelegating.js`, and:

1. its §6 table drops the `rename-npc` line (EM-B1c's own key; this member no longer carries it under that spelling at all);
2. its C1 re-derives the combined totality — ⚠ **RE-DERIVED AT VERSION 3: EM-B1b is SEVEN rows at
   its version 5, not eleven**, so the sum is **14 (B1a) + 1 (this) + 7 (B1b) + 4 = 26**, not
   thirty. The figure is EM-B1c's to state at its own re-cut; it is corrected here because a build
   lane reading this section would otherwise carry a stale sibling count. ⛔ It moves NO arm of
   this member: B1 asserts **FIFTEEN** — EM-B1a's fourteen plus this one — and nothing wider;
3. its C2's no-name-write scan drops `npcRenameChanges` from the three writers it names and keeps
   `factionRenameChanges` and `renameSettlementImpl`;
4. its C6 import-list arm and its §3.1 arithmetic re-run over four rows (≈36–41 of 250, unchanged
   by the loss of one row at 8–9);
5. its `requiredSymbols` keeps `NPC_RENAME_SURFACES` **only if** its remaining C2 scan still reads
   it — measured: it does, because the scan proves the module re-implements no path in **either**
   surface list, and the NPC list is the shorter half of the same claim.

⛔ **Until that repair lands, EM-B1c and this member both declare THE SAME OP — the NPC rename —
under TWO KEYS** (`rename-npc` there, `set-npc-name` here). ⭐ **VERSION 4 REMOVES THE KEY
COLLISION AND LEAVES THE SEMANTIC ONE EXACTLY WHERE IT WAS**, and the guard is STRONGER than
version 3's: B1's totality arm names FIFTEEN and asserts **all five** of EM-B1c's names ABSENT
(not four), so EM-B1c v3's landing reds against this member's own arm AND against EM-B1a's landed
A1 and A5. **The repair is the chair's and is owed before EM-B1c is
promoted, not before this member is.**

---

## §2 · Outcome

### §2.1 What this packet delivers
ONE op type — `set-npc-name` — in its own frozen leaf, spread into `OP_TYPES` by two lines. **Nothing
else.** No rename logic, no cascade call, no store reach, no surface, no consumer. It lands **DARK**
with exactly one importer, which is its own spread.

**Definition of done:** `OP_TYPES` holds EM-B1a's fourteen plus this one; the row names the existing
cascade as DATA and writes no name field; **all five** of EM-B1c's names stay asserted ABSENT by
name; ⭐ the composed catalogue and the shipped `EDIT_KINDS` stay DISJOINT over every row minted
after EM-B1a's fourteen (B6);
name; the leaf stays inside 250 and `operations.js` grows by exactly two effective lines.

### §2.2 ⛔ THE TWO GATES ON EM-B1c, RE-MEASURED — AND NEITHER TOUCHES AN NPC

The chair's `01-THE-RENAME.md` is the whole measurement; this section carries the two facts the
packet stands on, both re-executed at `bdbf7c89c`.

**GATE 1 — EM-R6.** EM-R6 v3.1 blocks EM-B1c *as a whole packet* (*"⛔ EM-B1c CANNOT BE PROMOTED
BEFORE THIS LANDS"*), and EM-R6 creates `src/domain/institutionRename.js` /
`institutionRemoval.js`. ⛔ **There is no `rename-institution` op anywhere in the waiting estate** —
`grep -l "rename-institution" packets-waiting/EM-*.md` returns **ZERO** hits over all 27 packets,
and EM-B1c's three renames are **faction · npc · settlement**. The block is therefore a block on a
shared LEAF, not on a fact about the NPC. **This member declares no institution path, imports
neither leaf, and names neither**, which the membership probe in `checks` keeps true.

**GATE 2 — design §21.5 ruling 7** (*"a choice is keyed on a DISPLAY NAME … EM-B1c's rename ops may
not be promoted before those sites take the stable id"*). Re-found by symbol: the three sites are
an **institution's** description (`assembleInstitutions.js:745`), a **building's** glyph
(`glyphAssign.js:125`, `anchorKey` first) and a **generation-time relationship-prose** variant
(`npcData.js:1334`). ⭐ **And the fact the ruling did not have: the pulse keys an NPC by
`npc.id`** — `npcAgency.js:194-196`, `npc.id ||` first, written unconditionally on every generated
NPC at `npcGenerator.js:1629-1631`, and kept OUT of the cascade by name
(`factionRename.js :: NON_CASCADED_SURFACES`: *"the durable identity undo keys on; a rename
changes the label only"*). The one NPC-name-keyed draw is generation-time, and **the first door
performs no pipeline re-entry at all** (charter 16:2x; EM-C4a §6.4), so the stored prose is not
re-picked. The staleness a draft rename causes is the staleness the estate already chose
(`NPC_NON_CASCADED_SURFACES`, owner-gated).

⇒ **Neither gate binds this member.** The chair rules on promotion; this packet measured what the
gates rest on and states it, and no more.

### §2.3 ⛔ THE OP TYPE IS HALF THE DOOR. THE OTHER HALF IS EM-C4a VERSION 2.
`set-npc-name` in `OP_TYPES` buys the door **nothing on its own**: EM-C4a v1's
`applyPlainEditToDraft` is a `set-root` single-key writer, so a `free-cascade` edit pushed through
it would write `npcs[].name` and leave the other four `NPC_RENAME_SURFACES` stale — the exact
two-lane divergence `settlementRenameHelpers.js:391-406` records as already fixed. **The writer's
branch is EM-C4a's**, ⭐ **now version 4.1 and — MEASURED at version 3 — a member of THE SAME
TRAIN, EM-T12, path-disjoint from this member at ZERO intersection (three rows against nine)**
(judgments 94, 110): the two halves of the door land together, exactly as this section asks, and
neither reserves a path the other names. ⛔ **This member does not write that branch, and a line of it
appearing here is a STOP** (§11).

### §2.4 In scope / out of scope
**In:** the one row; its own leaf; the two-line spread; six arms appended to EM-B1a's suite,
including the deliberate widening of EM-B1a's A1, A3 and A6.
**Out:** ⛔ the cascade itself (existing, untouched) · the adapter branch that calls it (EM-C4a v2)
· EM-B1c's other four rows · `rederive` and every pin (EM-B2) · any store or component reach ·
any pool, golden, tuning or migration · the target-kind and name-length refusals, which have no
home in `validateOp` and whose home is named in §13 R1.

---

## §3 · Hard scope budget

| limit | this packet | cap |
|---|---|---|
| behaviour families | **1** — one op type that delegates to existing machinery | 1 |
| new persisted record families / writers / flags / surfaces | **0** each | ≤1 each |
| direct production consumers | **0** — lands DARK | ≤2 |
| new logic-bearing production leaves | **1** (`operationsNpcRename.js`) | ≤2 |
| existing logic-bearing production files modified | **1** (`operations.js`, EM-B1a's) | ≤3 |
| handwritten files total | **3** | ≤12 |
| new/changed effective production lines | **≈22** (the row **≈10**, the leaf's frame ≈10, the spread **+2**) | ≤400 |
| each new production leaf | `operationsNpcRename.js` **≈20 of 250** | ≤250 each |
| shared / hot-file delta | `operations.js` **+2** | ≤15 |
| named acceptance cases | **6** | ≤8 |

Overrides approved before dispatch: **NONE — none is needed.**

### §3.1 · THE ARITHMETIC, AND WHY THE ROW GETS ITS OWN LEAF

⭐⭐ **RE-DERIVED AT VERSION 3 ON THE SIBLINGS' MEASURED FIGURES, NOT ON VERSION 1's ESTIMATES** —
EM-B1a's version-8 build MEASURED `operations.js` at **231** (version 9 §3 replaced its own
estimate with it), and EM-B1b **version 5** MEASURED **seven** rows, a **101**-line leaf and **+5**
on `operations.js` (231 → 236: four splice groups plus one import), where version 2 of this packet
still carried "11 rows / ≈83 / +2":

| packet | rows | leaf | its leaf's total | `operations.js` | running total |
|---|---:|---|---:|---:|---:|
| **EM-B1a** v10 | 14 | `operations.js` | — | **231 MEASURED** | **231 of 250** ✅ |
| **EM-B1c1** (this; train EM-T12) | **1** | `operationsNpcRename.js` | **≈20 of 250** | **+2** | **233** ✅ |
| **EM-B1b** v5 (train EM-T13) | **7** | `operationsOffStage.js` | **101 MEASURED** | **+5 MEASURED** | **238** |
| **EM-B1c v4** (unwritten) | 4 | `operationsHomeDelegating.js` | ≈36–41 of 250 | **+2 to +4** (§P4's codepoint splice can need more than one group) | **≈240–242 of 250** ⚠ |

⚠⚠ **THE FAMILY'S MARGIN ON `operations.js` IS ABOUT EIGHT TO TEN LINES, NOT TWENTY**, and this
member's **+2** is the smallest of the three appenders. RAISED at §13 **R9**, because the last
appender (EM-B1c v4, still unwritten) is the one that meets the cap. ⛔ Nothing here moves this
member's own **+2** or its STOP at +2.

⚠ **The one row would also FIT inline** (≈10 effective takes `operations.js` to ≈223–237, inside
the cap). The leaf is taken anyway, and for a reason arithmetic does not carry: the chair's ruling
says *"in its own leaf"*, and **two packets appending rows to one file is the collision the four
disjoint leaves exist to remove** — EM-B1c v4 would otherwise have to know whether this member had
landed before it could count its own lines. The cost is +2 effective and one file; the arithmetic
is stated both ways so the chair can see the alternative it is paying for. ⭐ The leaf's estimate
(**≈20**, not the ruling's ≈10) is the ROW's ≈10 plus the module's own frame — the JSDoc typedef
header, the exported frozen wrapper and its closing — and is an ESTIMATE, measured by eslint's
`Linter` at the landing.

**Hot files:** none. `operations.js` is a sibling's CREATE with three appenders, which is a
COLLISION (the header's group), not a hub: `git grep -l -F OP_TYPES -- tests` is **0** at this base,
because the symbol arrives with EM-B1a.

---

## §4 · Sealed dispatch and preflight

A dry read of `scripts/implementation-session.mjs`'s checks at the tip:
- **branch name** — the chair's; the packet asserts nothing.
- **ancestry** — the chair sets `Verified base` at promotion; `__BASE__` is replaced there and
  nowhere else.
- **CREATE targets absent** — `src/domain/edit/operationsNpcRename.js` verified absent at
  `bdbf7c89c` (`git ls-files src/domain/edit` lists `recordRegister.js` alone).
- **non-CREATE rows must EXIST** — `scripts/implementation-packets.mjs:834` refuses any row whose
  `action !== 'CREATE'` when `fileExists` is false. ⇒ **`src/domain/edit/operations.js` and
  `tests/domain/editOperations.test.js` must be on disk at dispatch, which is true only once
  EM-B1a has LANDED.** That is the dependency, stated as the validator enforces it.
- **substrate unchanged since the verified base** — every `requiredSymbols` path is read-only to
  this packet (§5's post-edit simulation is trivial: none of the five is written).
- **git-clean** — the lane wrote nothing in any tree; `git status --short` in `read-tip-em-t7` was
  EMPTY at the start and at the end.
⚠ **SEALED DISPATCH WANTS THE WORKTREE ON THE VERIFIED BRANCH.** One build lane holds the
integration branch in its own worktree; the chair's worktree stays detached at the tip.

---

## §5 · Verified tree contract

The first five rows proved at `bdbf7c89c` by `git grep -c -F` = **1** (receipts in
`EM-B1c1.evidence.md` §E1–E5) and **RE-PROVED at version 4's read tip `a247fa84d`, each still at
1**. ⭐ **THE SIXTH ROW IS VERSION 4's**, proved at that same tip with the same command; its
executed line is in `EM-B1c1.V4-NOTES.md` §M4.

| what | path | symbol (verbatim) | why it must not move |
|---|---|---|---|
| ⭐ the declared writer, pure form | `src/domain/factionRename.js` | `export function npcRenameChanges` | the row names it in `guardsStated` and **imports it nowhere**; B2 scans against it |
| the declared writer, in-place form | `src/domain/factionRename.js` | `export function applyNpcRenameToSettlement` | the entry point the SHIPPED store writer calls (`settlementRenameHelpers.js:438`); named so both halves of the one cascade are visible to the seal |
| ⛔ the five join surfaces | `src/domain/factionRename.js` | `export const NPC_RENAME_SURFACES` | B2 proves this module re-implements **none** of `npcs[].name` · `factions[].members[].name` · `relationships[].npc1Name` · `relationships[].npc2Name` · `interSettlementRelationships[].npcName` |
| the string order | `src/domain/deterministicSort.js` | `export const compareCodepoint = (a, b) => {` | B1 asserts key order over the COMPOSITION — the assertion a spread can silently break. ⚠ Pinned by PATH: three other modules declare a same-named local (`townMap/arch/project.js`, `worldPulse/envoyErrandVocabulary.js`, `worldPulse/npcLadderState.js`) |
| the eager set | `vite.config.js` | `export const EAGER_FIRST_PAINT_MODULES` | the membership probe imports it and reads no `dist`; a hand-seeded replica drifts silently |
| ⭐ **NEW AT VERSION 4** — the shipped pending-edit vocabulary | `src/domain/pendingEdits.js` | `export const EDIT_KINDS = Object.freeze([` | **B6 reads this list BY IMPORT and never re-types it.** If the declaration moved or was re-shaped, the arm would compare against `undefined` and the disjointness claim would go vacuous — the exact defect the anchor law exists for. ⛔ This member writes no byte of the file: the row is read-only and `retiredSymbols` stays empty. Measured at `a247fa84d`: `git grep -c -F` = **1**; the list is **nineteen** members |

**`_pendingRequiredSymbols` (§P9(a): a SIBLING KEY, never an element of `requiredSymbols` — the
array form refuses twice, once on the row's `path` and once on its `symbol`).** ⭐ **VERSION 3
DISCHARGES HALF OF IT BY MEASUREMENT: EM-A1 HAS LANDED** (train EM-T9, `e348d59b6`), so
`src/domain/edit/types.js` is on disk at this read tip and the `Op` / `EntityRef` typedefs this
leaf's JSDoc references EXIST. ⚠ The capsule's sixth row is left in the `_pending` block rather
than promoted, because its `symbol` text is the bare token `@typedef`, which is not a verbatim
declaration line any validator should assert — **the chair strikes it or re-spells it at
placement** (§13 **R10**; recommended: strike it, and let EM-A1's own landed rows carry the
typedefs). **The FIVE genuinely pending rows:** `OP_TYPES` · `OP_STAGES` ·
`OP_CONSEQUENCE_POLICIES` · `makeOp` · `validateOp`, all in `src/domain/edit/operations.js`
(**EM-B1a**, version 10, train EM-T11).

**`retiredSymbols`: EMPTY**, and trivially proved: all six rows sit at paths this member does not
write, this member moves and deletes no symbol, and no other LANDED or waiting packet carries a row
for any of the five pairs.

**Forbidden alternatives:** ⛔ no rename logic of any kind in this module (HZ-JOINKEY) · ⛔ no
second `OP_TYPES`, constructor, validator or stage vocabulary · ⛔ no import of
`src/domain/factionRename.js`, `src/domain/edit/operations.js`, a PRNG, `rngContext`,
`src/store/**` or `src/components/**` · no files outside the manifest.

---

## §6 · Exact contracts

### §6.1 `src/domain/edit/operationsNpcRename.js` — the one row

```js
/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

/**
 * `set-npc-name` — EM-B1c §6's row, carried VERBATIM into its own home.
 *
 * ⛔ THIS MODULE IMPORTS NOTHING. `operations.js` imports THIS module's rows, so an import back
 * for OP_STAGES / OP_CONSEQUENCE_POLICIES would be a module cycle whose `const` bindings sit in
 * the temporal dead zone at initialisation. `stage` and `consequence` are literals here and
 * acceptance B4 asserts their MEMBERSHIP in both vocabularies from the test, where there is no
 * cycle.
 */
export const NPC_RENAME_OP_TYPES = Object.freeze({
  'set-npc-name': Object.freeze({
    target: 'npc',
    payload: Object.freeze({ newName: Object.freeze({ kind: 'free', required: true }) }),
    stage: 'home',
    consequence: 'home',
    requires: Object.freeze({ world: Object.freeze([]), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze([]),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated:
      'NO GUARD. The rename DELEGATES: the estate\'s existing NPC cascade is the writer: '
      + 'src/domain/factionRename.js#npcRenameChanges (pure patch form) and '
      + '#applyNpcRenameToSettlement (in place), each walking NPC_RENAME_SURFACES. This module '
      + 'names them as DATA and imports neither. The STORE action the adapter calls is EM-C4a\'s '
      + 'to name: §P4 forbids a domain module reaching the store, so that name has exactly one '
      + 'home and it is not this one.',
  }),
});
```

⛔ **EXACT, WITH NO DISCRETION.** The row is EM-B1c §6's, quoted here for the record:

| op | `target` | `payload` | `stage`/`consequence` | `requires.world` |
|---|---|---|---|---|
| `set-npc-name` | `npc` | `{ newName: { kind: 'free', required: true } }` | `home`/`home` | `[]` |

⛔ **`newName` is `kind: 'free'` and that is correct, not a lapse** — EM-B1c's own sentence: *"A
name is the estate's one `free-cascade` field (§12.3): typeable, but a change is this typed op,
which runs the existing cascade. The freedom is in the value; the safety is in the delegation."*
⚠ **`free` here is the `PayloadFieldSpec` vocabulary (EM-B1a §6: `'pool'|'free'|'ref'|'int'|'enum'`)
and `free-cascade` is the `FieldKind` vocabulary (EM-A1 §6.2: `'pool'|'free'|'free-cascade'|'share'`).
Two vocabularies, two layers; the op's payload kind and the card field's kind are different facts,
and this note exists so no reader reconciles them by editing one.**

⚠⚠ **AND THE KEY IS `set-npc-name`, NOT `rename-npc` — DELIBERATELY (version 4, judgment 126).**
`rename-npc` is a live member of the SHIPPED pending-edit vocabulary `EDIT_KINDS`
(`src/domain/pendingEdits.js`) with its own payload (`{npcId|npcIndex, newName}`), its own intent
id (`settlement.rename-npc`), its own preview and its own canon lock at the queue seam. **Two
layers, two typed things; one string may not mean both** — the op-layer key takes the family's own
`set-<subject>-<field>` shape, **B6 convicts the next packet that would collide**, and the op's
SEMANTICS are untouched: this is still *"the rename through the cascade"* of design §20.4, running
the same writer through the same five surfaces. ⛔ **The leaf's FILE NAME and its exported binding
keep the rename's word** (`operationsNpcRename.js`, `NPC_RENAME_OP_TYPES`): they name the module,
not the op key, and moving them would move a §7 path for nothing.

⛔ **`requires` is the TWO-KIND shape** EM-B1a §16.3 forces on every row (`{ world, registry }`),
both arrays empty: design §18 gives a rename no world precondition. ⚠ EM-B1a §6's typedef line
still spells `requires: readonly string[]`; **§16.3 governs and EM-B1a's own R6 closes it** — the
typedef line is the stale half of EM-B1a and is reported, not adapted to (§13 R3).

⭐ **AND `makeOp` FLATTENS IT — MEASURED IN BUILT CODE.** EM-A1 is **BUILT** and its
`src/domain/edit/types.js` declares `Op` with **TEN** fields and `requires: readonly string[]`;
EM-B1a §6's `makeOp` copies the declaration's pair onto the `Op` *"FLATTENING `requires` from the
declaration's `{ world, registry }` pair into EM-A1's `readonly string[]`"*. So the **DECLARATION**
carries `{ world: [], registry: [] }` (ELEVEN keys) and the built **`Op`** carries `requires: []`
(TEN fields): B1 asserts the flat form on the op, B4 the pair on the row, and ⛔ **an arm that
asserted the pair on the `Op` would red `typecheck:domain:strict`, a SEALED check.**

### §6.2 `src/domain/edit/operations.js` — the composition, exactly two lines

```js
// +1 · the import, in the file's existing import block
import { NPC_RENAME_OP_TYPES } from './operationsNpcRename.js';

// +1 · the SPLICE — ONE line INSIDE the composed catalogue, at the codepoint position:
//      after the `set-institution-state` row and BEFORE the `set-npc-status` row.
//      ⛔ NOT a trailing spread. ⭐ VERSION 4: the position moved WITH the key.
export const OP_TYPES = Object.freeze({
  // … `add-faction` … `set-institution-state`  (EM-B1a's rows, untouched)
  ...NPC_RENAME_OP_TYPES,
  // … `set-npc-status` … `set-relationship`  (EM-B1a's rows, untouched)
});
```

⛔⛔ **IT IS A SPLICE, NOT AN APPEND, AND THE POSITION IS MEASURED.** Executed at the read tip by
importing the estate's own `compareCodepoint` and sorting EM-B1a §6's fourteen plus this row:
`set-npc-name` lands at **index 11 of 15 — between `set-institution-state` and `set-npc-status`**. A spread appended
at the END (version 1's shape, and EM-B1b's O1 line) puts `set-npc-name` **last** and therefore REDS
EM-B1a's own A1 order arm — §6 *"Ordering and precedence"*: *"`Object.keys(OP_TYPES)` is authored
and asserted in `compareCodepoint` order, so a new row cannot be appended 'wherever'"*.
⚠ **Version 1's parenthetical — *"sorts between `promote-phantom` and `rebalance-power`"* — was
measurably FALSE and is retired.**

⛔ **THE COMPOSITION IS NAMED BY SHAPE, NEVER BY AN ASSUMED BINDING (§13 R6).** EM-B1a's contract
exports exactly five symbols — `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `OP_TYPES`, `makeOp`,
`validateOp` — and its §7 CREATE row says only *"leave the structure open for B1b to append"*:
**`HOME_OP_TYPES` is EM-B1b's spelling of a binding EM-B1a's contract does not mint.** The coding
instruction is therefore the POSITION, not the name — read `operations.js` WHOLE, put the one
spread line where codepoint order requires it, whatever EM-B1a's build names the home rows, and
**STOP if that cannot be done in +2 effective lines** (§11).

⛔ **Nothing else in the file moves.** An edit exceeding **+2 effective** is a STOP. ⚠
`Object.freeze` on a spread freezes the **outer** map only, so the hole is real — and B1 closes it
with the arms that are REACHABLE from EM-B1a's five exports: `NPC_RENAME_OP_TYPES` (imported from
this member's own leaf) asserted frozen, and **every one of the FIFTEEN composed rows** asserted
frozen (`Object.isFrozen(OP_TYPES[k])`). ⛔ **EM-B1a's home map is not exported, so no test can
hold a reference to it**, and an arm asserting IT frozen cannot be written from the declared
exports at all (§13 R7).

### §6.3 `tests/domain/editOperations.test.js` — six arms appended to EM-B1a's one literal describe

Straight-line literal `it`s, no `.each`, no `runIf`, no nesting (§P3.4); the openers come from the
file's own `vitest` import and each word is bound exactly once (⛔ no variable, parameter or alias
named `it`, `test` or `describe`); no bare seed loop — collect, then assert once.

⛔⛔ **THE LOAD-BEARING EDIT, NAMED SO IT IS NEVER A SURPRISE — AND VERSION 4's ROSTER IS THREE
WIDENED ARMS, NOT FIVE.** A fifteenth row in `OP_TYPES`, and the one import line §6.2 adds, put
**three** of EM-B1a's eight LANDED arms red — measured against the arms AS LANDED at
`a247fa84d`, not against a staged blob. Each is widened **BY ADDITION, INSIDE the arm it
strengthens**, so **zero `it` and zero `describe`** are added by the widening and the lighting
delta does not move. ⭐ **A4 AND A5 ARE MEASURED GREEN AND NO WIDENING IS OWED ON EITHER** — that
is judgment 126's dividend, and a red on either is a **STOP** (§11):

| EM-B1a arm | what reds | this member's widening |
|---|---|---|
| **A1** ⛔ | THREE clauses: `Object.keys(OP_TYPES).length` `toBe(14)` (`:110`), the set-equality against `THE_FOURTEEN` both ways (`:114-118`), and `toEqual(THE_FOURTEEN)` (`:122`) | the count becomes **15**; the roster becomes **`THE_FOURTEEN` PLUS this row, DERIVED from the landed constant and re-sorted with `compareCodepoint`** — never a hand-spelled fifteen, because the file's own header says *"§6's ONE LIST. Every other roster claim in this file names THIS constant"*. ⛔ **TWO CLAUSES ARE UNTOUCHED AND MUST STAY GREEN BY THEMSELVES:** the codepoint-order clause (`:120-121`, `live` vs its own sort) is the arm that CONVICTS a trailing spread, and the absent-by-name clause (`:152-155`, `B1C_FIVE`) needs no widening at all now — **all five of EM-B1c's names stay absent under `set-npc-name`** |
| **A3** ⚠ | its home-selection clause only: `home` and `homeConsequence` `toEqual(THE_FOURTEEN)` (`:352-353`) — this member adds a **`home`/`home`** row, so both gain one member | both rosters gain `set-npc-name` by the SAME derivation A1 uses. ⛔ **The set-equality of the two partitions (`:354-355`) and the off-stage `toEqual([])` (`:356-358`) are UNTOUCHED** — the off-stage clause is EM-B1b's, one train later. ⛔ **If the widening is more than those two additions, STOP** |
| **A4** ⭐ | **NOTHING. MEASURED GREEN AT THE LANDED ARM, AND NO WIDENING IS OWED.** Its roster is already `Object.keys(OP_TYPES)` — it RUNS over the composition — and its `foreign` filter (`:415-421`) only reds when some row NAMES a foreign type | **no edit.** This row's five arrays are ALL EMPTY and no landed row names `set-npc-name`, so `foreign` stays `[]` and `unknown` stays `[]`. ⛔ Version 3 carried a hedged widening here because the arm was not yet landed; version 4 read it whole and the hedge is spent. **A red here is a STOP, not a widening** |
| **A5** ⭐⭐ | **NOTHING — JUDGMENT 126's DIVIDEND.** `renames` is `B1C_FIVE.filter((t) => t.startsWith('rename-'))` (`:426`), so the arm reds only for a LIVE `rename-*` key. `set-npc-name` is not one | **no edit.** `rename-faction`, `rename-npc` and `rename-settlement` all stay absent by name, and A5's delegation source scan over `operations.js` is untouched and still green (this member writes no rename logic there, and its +2 lines are an import and a spread). ⛔ **A red here is a STOP**: it would mean the key was spelled `rename-*` after all |
| **A6** ⛔ | the EXACT import list of `operations.js` — **FIVE** specifiers in source order (`'../deterministicSort.js'`, `'../entities/npcs.js'`, `'../entities/status.js'`, `'../worldPulse/relationshipCompatibility.js'`, `'./fieldDeclarations.js'`), spelled at EM-B1a version 10 by judgment 115 Q6 | the exact list gains **`'./operationsNpcRename.js'`**, in source order — the same one-specifier addition EM-B1b's §7 row spells for its own leaf. The fence arm (no PRNG / store / components) and the **zero-importers** arm are left UNTOUCHED: this member's leaf is imported BY `operations.js`, so nothing new imports EM-B1a's leaves |

⛔ **THIS IS JUDGMENT 110's CLASS, CAUGHT AT THE PRE-PROOF.** A landed arm is widened only by the
packet whose landing needs it, under its own seal; a cure lane cannot add a §7 row and the chair
widening it at a terminal would be the chair editing another packet's guarantee. ⛔ **If ANY
landed arm outside this roster reds at the build, STOP** (§11) — do not widen it under the seal.
B1 and B3 are this member's own new arms over the composition and B6 is version 4's; the three
widenings above live in the landed arms and add no title. ⛔ **No arm is weakened**: every set
stays exact in both directions with a full offender list, and **all five** of EM-B1c's names stay
asserted ABSENT so EM-B1c v4's landing still reds until it widens the arms in its turn.

### §6.3a ⭐ B6 — THE SHRINK-ONLY DISJOINTNESS ARM (version 4, judgment 126)

⭐ **THE ARM'S TITLE, SPELLED EXACTLY, BECAUSE THE COUNTERFORCE MUST NAME IT** (the file's own
convention puts the case id first, as EM-B1a's eight do):

```js
it('B6: the op catalogue and the shipped EDIT_KINDS vocabulary are disjoint over every row minted after the fourteen', () => {
```

⛔⛔ **MEASURED FIRST, AND IT REFUTES THE ARM'S OBVIOUS SPELLING.** `OP_TYPES` × `EDIT_KINDS` is
**NOT EMPTY** at the tip: **`add-institution`** and **`remove-institution`** are members of BOTH —
EM-B1a's landed rows and the shipped queue's kinds. An arm asserting the whole intersection empty
would RED AT THIS MEMBER'S OWN BUILD against a sibling's landed rows, which is a STOP, not a
guard. ⭐ **So B6 guards the population this member can answer for and BANKS the one it cannot:**

1. **THE GUARD (shrink-only).** `minted` = the composed catalogue MINUS `THE_FOURTEEN` — today
   exactly `['set-npc-name']`, tomorrow EM-B1b's seven and EM-B1c v4's four. `minted` ∩
   `EDIT_KINDS` is asserted **`[]`** with a full offender list. ⛔ **A new op that takes a shipped
   kind's name reds HERE, and the cure is to RENAME THE OP — never to add an exemption.**
2. **THE BANKED PAIR, ASSERTED EXACTLY.** `THE_FOURTEEN` ∩ `EDIT_KINDS` is asserted
   `['add-institution', 'remove-institution']` — named, dated and owed to nobody here. It reds
   BOTH ways on purpose: a NEW inherited collision reds, and a CURED one must be BANKED by
   shrinking this list rather than pocketed silently. ⭐ **It is also the arm's positive control:**
   a non-empty result proves the membership matcher and both rosters are live, so the `[]` above
   is never a vacuous green.
3. **THE PLANTED COLLISION.** `[...minted, 'rename-npc']` ∩ `EDIT_KINDS` is asserted
   `['rename-npc']` — the matcher proved live on the exact collision judgment 126 cured.
4. **THE NEGATIVE, ANCHORED** (§P6's marker rule: ONE line, immediately above the assertion):
   `// anchored: minted is asserted exactly ['set-npc-name'] above, so this cannot go vacuous.`
   then `expect(minted, …).not.toContain('rename-npc')`. ⛔ **MEASURED, AND IT IS A HARD GATE:**
   `tests/lint/negativeAssertionAnchor.walker.test.js` carries **NO frozen row** for
   `tests/domain/editOperations.test.js` (grep at `a247fa84d` → zero hits), so the file is held at
   **EXACT ZERO** un-anchored negatives — and the walker reads only the assertion's own line and
   the ONE line above it, so **a marker wrapped over two comment lines anchors nothing** and reds
   the excluded-directory run in §10.

⛔ **`EDIT_KINDS` IS READ BY IMPORT, NEVER RE-TYPED** (`src/domain/pendingEdits.js`, §5's sixth
`requiredSymbols` row): a hand-spelled copy of nineteen kinds would drift the day one is added,
and a drifted copy makes the disjointness claim about nothing. The leaf itself still imports
NOTHING — the import is the TEST's, where there is no cycle, exactly as B4's vocabulary membership
is proved.

⭐ **THE COUNTERFORCE (§P6: a written-contract arm is never red-first).** B6 holds the moment it is
written, so it is proved by a **perturbed input** that reds **EXACTLY the B6 title**: in the test
file, temporarily seed the arm's own subject with the colliding key
(`const minted = [...live.filter(…), 'rename-npc'];`), run the sealed `editOperations` check,
require a nonzero exit and **`B6` red by name with no other title moving** (a red under another
title is an ambiguous mutant and a STOP), then restore the exact pre-mutant SHA-256 and rerun
green. ⛔ **Do NOT prove B6 by planting the key in the LEAF**: that reds A1, A3, A5 and B1 as well
and is exactly the ambiguous mutant §P6 refuses.

### §6.4 Determinism, lifecycle, receipts
- **Hash / fork key:** NONE. No random number, no clock, no locale, no id minted.
- **Ordering:** `Object.keys(OP_TYPES)` in `compareCodepoint` order over the composition.
- **Absence vs empty vs null:** an empty relation is `[]`; the absent duration is `null`; `requires`
  carries two empty arrays, never an omitted key — EM-B1a §6: *"A row missing a field is an A1 red,
  not a default."*
- **Lifecycle, every path:** *create / read / persist / regenerate / undo / import / migrate* — ⛔
  **NONE OF THEM.** This packet touches no record, no save, no store and no persisted key. An `Op`
  persists only inside a `Decree`, which is EM-B3's key and EM-B3's door.
- **Receipts:** none. No surface, no command, no chronicle line.
- **Golden posture: UNCHANGED.** `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dossierProseManifest.test.js` do not move; generation is not touched.
- **Flag / dormancy:** no flag; **zero consumers** — the leaf's one importer is its own spread.

---

## §7 · Exact change manifest

Generated from `EM-B1c1.manifest.json` and proved SET-EQUAL to it (interim rule 6; the executed
line is in `EM-B1c1.compile.report.md` §A).

| Action | File | Symbol / region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operationsNpcRename.js` | `NPC_RENAME_OP_TYPES` | **250 cap; ≈20 est.** | §6.1 verbatim. ⛔ Import NOTHING — not `operations.js`, not the cascade. ⛔ Author no rename logic, no target-kind check, no length rule. |
| `MODIFY` | `src/domain/edit/operations.js` | the `OP_TYPES` composition | **+2 eff** | §6.2: one import, one spread — EM-B1b's O1 shape. ⛔ Nothing else in the file moves. |
| `TEST` | `tests/domain/editOperations.test.js` | arms B1–B6 appended **AND THREE LANDED ARMS WIDENED IN PLACE** | `n/a; adds SIX `it`s and ZERO `describe`` | §6.3 and §6.3a. ⛔ **`TEST`, not `CREATE`** (§P9(b)'s named-sibling form): the path does not exist at this member's verified base and the NAMED SIBLING that creates it is **EM-B1a**. Append B1–B6 to EM-B1a's single literal `describe`; straight-line `it`, no `.each`/`runIf`/nesting (§P3.4); every negative carries `// anchored:` on the line immediately above, on ONE line. ⛔⛔ **AND WIDEN, BY ADDITION, THE THREE LANDED ARMS THIS ROW PUTS RED — A1 · A3 (its home-selection clause only) · A6 — each widening INSIDE the arm it strengthens so no `it` and no `describe` is added** (§6.3's table spells every clause, and names the clauses of A1 and A3 that stay UNTOUCHED). ⛔ **A4 AND A5 ARE MEASURED GREEN: widen NEITHER, and STOP if either reds.** ⛔ **Delete no assertion, weaken none, add no `it` beyond B1–B6, and STOP if any landed arm outside the A1 · A3 · A6 roster reds.** |

Generated artifacts: **NONE**.

### The deferred rows — PREDICTIONS, named in no `checks` and in no `changeManifest`

> `docs/content/wiring-census.json` — **a named INTERIOR RED, delta only** (interim rule 1).
> `stamp.producerIndexFiles` **+1**: this member's new `.js` leaf under the two counted roots,
> named one by one — `src/domain/edit/operationsNpcRename.js`. ⛔ `producerIndexFiles` **NAMES
> NOTHING — IT IS A NUMBER**, so *"the register does not name mine"* would be a category error.
> ⭐ **THE FIGURE IS A DATED PAIR AND THE MEMBER'S CLAIM IS THE DELTA ONLY** (§P3.5): `1172` at
> `bdbf7c89c` is version 1's executed reading, kept with its as-of mark; re-measured at this
> member's read tip `5926f454e` it is **1177** (train EM-T10's terminal regenerated it,
> `38e258c7b`: 1175 → 1177). **This member asserts `+1` on whatever N the train's base carries,
> and no absolute.** `stamp.files` (7 entries) and `stamp.candidateLeaves`
> (6) **UNMOVED** — both key on `src/domain/display/stateProse/` paths this member does not touch.
> `totals.*` **UNMOVED** — this member produces no pool, variant or relation. ⛔ **Regenerated
> WHOLE at the train's terminal, BY THE CHAIR**; the path is in NEITHER §7, NOR the
> `changeManifest`, NOR `checks`.

> `tests/lint/.lighting-census-baseline.json` — **a named INTERIOR RED, delta only**, in the
> register's own order: **files +0 · parked +0 · credited +0 · titles +6 · suiteTitles +0.** This
> member CREATEs **no** test file; it appends six straight-line literal `it`s to EM-B1a's one
> literal `describe`. The predicted red's SHAPE is `expected <N+5> to be <N>` on the first moved
> figure (the walker stops there), never a numeral. ⛔ The row names the **BASELINE JSON**, never
> the walker. ⛔ Regenerated at the train's terminal BY THE CHAIR; this member never sets
> `LIGHTING_CENSUS_REFREEZE`. ⚠ The titles delta is a PREDICTION until the build lane prints
> `parkReasonsFor` over the edited file; if EM-B1a's file parks, the delta is `titles +0` and the
> receipt says which it was.

> `scripts/mutation-coverage-manifest.json` — **NOT OWED, AND MEASURED** (interim rule 15).
> `ENFORCER_DIRS`, READ at the tip in `tests/lint/mutationCoverage.shared.mjs` rather than
> recalled, is **EIGHT** directories — `tests/lint` · `tests/design` · `tests/docs` · `tests/data`
> · `tests/copy` · `tests/security` · `tests/edgeFunctions` · `tests/generators` — and this member
> **CREATEs no file under any of them**: its one CREATE is `src/domain/edit/operationsNpcRename.js`
> and its one test path is an existing sibling's file under `tests/domain`. `NAME_PATTERN` is
> never reached, because it matches basenames OUTSIDE the enforcer dirs and this member creates no
> test basename at all. Said rather than silently omitted, and it keeps this member off a path six
> waiting siblings already contend for.

> **THE BYTE ARM (interim rule 14) — THIS MEMBER IS NOT THE HOLDER AND CARRIES NO `tests/build/*`
> ROW.** Its predicted delta on every budgeted closure is **ZERO**, executed at the tip: the
> packet's own membership probe prints `EAGER_FIRST_PAINT_MODULES: 270 | anti-vacuity
> src/main.jsx present: true | src/domain/edit/ members in the eager closure: NONE` at **exit 0**
> (re-executed at `5926f454e`, version 3), and the new leaf lands DARK with its single importer
> (`operations.js`) itself outside every budgeted chunk — worker, lazy engine and eager first
> paint alike. ⭐ **THE SET'S SIZE IS A DATED PAIR AND THIS MEMBER'S OWN FIGURE IS THE DELTA
> `N → N`** (§P2.11, §P3.5): **269** at `bdbf7c89c` is the ESTATE-REPAIR lane's executed receipt,
> **270** is this member's base, and the rise is EM-P4's pure relocation — judgment 86: the owner
> signed the BYTE budget `CLOSURE_BUDGET_BYTES`, not the module count — not anything of this
> member's. ⛔ **THIS MEMBER IS NOT ITS TRAIN'S BYTE-ARM HOLDER** (§P2.11's last clause: a member
> compiles as if it is NOT the holder unless the chair's brief says it is): it states its zero,
> carries no `tests/build/*` row, and names **train EM-T12's holder as the chair's to name at the
> pre-proof** (train EM-T9's was EM-D0b on `tests/build/vendorPdfLazy.test.js`).

> **THE TUNING INVENTORY (interim rule 17) — NO ROW IS OWED, AND IT IS A MEASUREMENT, NOT A
> WALK.** `scripts/lib/tuning-inventory.mjs`'s **own** `countUnregisteredNamed` and
> `countBareDecimals`, imported in plain node and run over a COPY-ONLY root (§P5 HZ-WORKTREE,
> judgment 88: a scratch estate COPIES and never symlinks a tracked directory) carrying this
> member's planned §6.1 text at `src/domain/edit/operationsNpcRename.js`: **the leaf is P2 0 ·
> P3 0.** ⚠ **The shapes are the library's own, restated at version 3:** `countUnregisteredNamed`
> returns `{ counts, sites }` — version 2 wrote `{}`, which the library never prints — and
> `countBareDecimals` returns a flat map. **TWO CONTROLS, both executed at `5926f454e`:** the REAL
> positive control `src/domain/activeConditions.js` returns **P2 3** with its three sites named
> (`WORSENING_SEVERITY_CEILING`, `EASING_SEVERITY_FLOOR`, `EXPIRY_EASING_WINDOW_TICKS`) and
> **P3 60**; a SYNTHETIC control beside the leaf (two module-top-level `UPPER_SNAKE = <number>`
> consts and one bare decimal) returns **P2 2** with its two site names and **P3 1**. So the
> leaf's zero is MEASURED against a live walk, not a silent one.
> ⇒ **no tuning-register row, no owner-signed dial, no ceiling moved.** The row's only number is
> `duration: null`; `guardsStated` carries no numeral; the MODIFY path does not exist at this base
> and the +2 effective lines add no numeric const and no decimal.

---

## §8 · Ordered coding sequence

1. **K-GATE, BEFORE THE FIRST EDIT.** Confirm **EM-B1a has LANDED** (`operations.js` and
   `tests/domain/editOperations.test.js` both on disk); re-run the membership probe and quote its
   line; measure `operations.js`'s effective lines with eslint's `Linter` so the **+2** is proved
   to fit before it is written. **Any miss is a STOP, not a workaround.**
2. Read `src/domain/edit/operations.js` WHOLE and `tests/domain/editOperations.test.js` WHOLE
   before the first edit — the enclosing scope before any change. ⛔ **FIND THE SPLICE POINT AND
   PROVE IT:** print `Object.keys(OP_TYPES)` as EM-B1a built it, confirm it is `compareCodepoint`
   order, and locate the boundary between the `set-institution-state` row and the `set-npc-status`
   row (⭐ version 4's position; the key decides the index). ⛔ **Do
   not assume a binding named `HOME_OP_TYPES`** (§13 R6) — the instruction is the POSITION. If the
   one spread line cannot be placed there inside +2 effective lines, **STOP** (§11).
3. Write `src/domain/edit/operationsNpcRename.js` (§6.1). Import nothing. Run nothing yet.
4. Append **B2 first** (the planted-assignment scan), so the other arms are written against a
   matcher already proved to convict.
5. Append B1, B3, B4, B5, **B6** and **widen EM-B1a's THREE landed arms in the same edit** —
   A1 · A3's home-selection clause · A6 — by name, by ADDITION, adding no `it` beyond the six
   (§6.3's table spells every clause, including the ones that stay UNTOUCHED).
   ⛔⛔ **WIDEN NEITHER A4 NOR A5**: both are measured GREEN against the LANDED arms, and a red on
   either is a **STOP**, never a widening. ⛔ Read each arm as EM-B1a LANDED it before touching it;
   a widening that is more than the addition §6.3 names, or a fourth landed arm going red, is a
   **STOP** (§11).
6. ⭐ **B6's COUNTERFORCE, BEFORE THE ARM IS BELIEVED** (§6.3a; §P6 — a written-contract arm is
   never red-first). Perturb **B6's own subject** in the test file with the colliding key, run the
   sealed `editOperations` check, require a **nonzero exit with `B6` red BY TITLE and no other
   title moved**, restore the exact pre-mutant SHA-256 and rerun green. ⛔ **Never plant the
   collision in the LEAF** — that mutant also reds A1, A3, A5 and B1 and is the ambiguous mutant
   §P6 refuses.
7. Add the import and the spread in `operations.js` (§6.2, +2).
8. Run the sealed `checks` in §10's order, the validator LAST.
9. Print `parkReasonsFor` over the edited file and record whether the five titles credited or
   parked (§7's deferred lighting row), then run the lighting walker ALONE as an instrument so its
   five figures are RECORDED rather than discovered.

---

## §9 · Acceptance matrix

| # | claim | how it is proved |
|---|---|---|
| **B1** | **MAIN — the totality at FIFTEEN, and ALL FIVE of EM-B1c's names still ABSENT** | `OP_TYPES` set-equal, both directions, to EM-B1a's fourteen plus `set-npc-name`, with a full offender list, so a row dropped by either packet reds here; ⭐ **all five** — `rename-faction`, `rename-npc`, `rename-settlement`, `set-world-fact`, `schedule-event` — asserted **ABSENT by name** (version 4: the list is five, not four, because this member no longer spells one of them); `compareCodepoint` order held over the composition **with `set-npc-name` at index 11 of 15, between `set-institution-state` and `set-npc-status`** (the SPLICE, §6.2); `NPC_RENAME_OP_TYPES` **and every one of the fifteen composed rows** asserted frozen — R7: EM-B1a's home map is not exported, so no arm can hold it; `makeOp('set-npc-name', {kind:'npc', id:'n1'}, { newName: 'X' })` (arity THREE, EM-B1a §6) returns an `Op` carrying `home`/`home` and **four empty arrays — `requires` FLATTENED to `[]`, `enables`, `relatedTo`, `conflictsWith`** |
| **B2** | ⛔ **THE RENAME DELEGATES AND WRITES NO NAME** (the prevention guard) | the row declares `target:'npc'`, one required `newName`, `home`/`home`, the two-kind empty `requires`, and names its writer in `guardsStated`; a source scan proves the module writes no name field and re-implements **none** of the five `NPC_RENAME_SURFACES` paths — **read from the frozen list, never re-typed** — with the matcher proved live on a **planted** assignment to `npcs[].name`; a second arm proves `src/domain/factionRename.js` appears in the import list **nowhere** |
| **B3** | **Relational integrity, total and closed over the composition** | every string in the row's **FIVE** arrays — `requires.world`, `requires.registry`, `enables`, `relatedTo`, `conflictsWith` — is a key of the composed `OP_TYPES` (all five are empty here and the arm asserts EMPTINESS rather than trusting it); ⛔ the DECLARATION's `requires` is the two-kind PAIR, so an arm that iterated it as one flat array would throw — the flat form is the `Op`'s, not the row's; `conflictsWith` symmetric, `requires`/`enables` exact inverses, `relatedTo` symmetric across all fifteen — EM-B1a's A4 arm re-run over the composition; `set-npc-name` names **none** of EM-B1c's remaining four, by name |
| **B4** | **The two-kind `requires`, and vocabulary membership proved WITHOUT a cycle** | `requires` is `{ world: [], registry: [] }` (EM-B1a §16.3); `stage` and `consequence` asserted MEMBERS of `OP_STAGES` and `OP_CONSEQUENCE_POLICIES`, **imported in the test**, because `operations.js` imports this leaf and an import back would put both `const` bindings in the TDZ. The arm reds the day either vocabulary loses a member |
| **B5** | **Purity, dormancy and the import fence** | `makeOp`/`validateOp` proved pure over the new row (input payload unmutated against a pre-call clone; identical inputs give `toEqual` results); the import list asserted EXACTLY and containing **none of** a PRNG, `rngContext`, `src/store/**`, `src/components/**`, `src/domain/factionRename.js`, `src/domain/edit/operations.js`; a scan over `src/**` finds **exactly one** importer of the new leaf — its own spread — with guard-the-guard arms on the walk and the matcher |
| **B6** | ⭐ **VERSION 4 (judgment 126) — ONE STRING, ONE MEANING: the op catalogue and the shipped pending-edit vocabulary are DISJOINT over every row minted after EM-B1a's fourteen** | `EDIT_KINDS` imported from `src/domain/pendingEdits.js` (never re-typed); `minted` = the composed catalogue minus `THE_FOURTEEN`, asserted `['set-npc-name']`; **`minted` ∩ `EDIT_KINDS` asserted `[]` with a full offender list** — a future op taking a shipped kind's name reds here and the cure is to rename the op, never to exempt it; ⛔ the **two INHERITED collisions** `add-institution` and `remove-institution` (EM-B1a's landed rows, measured, not this member's) asserted EXACTLY in both directions, which both BANKS them shrink-only and serves as the arm's positive control; the matcher proved live on a **planted** `rename-npc`; the one negative carries its single-line `// anchored:` marker. **Proved by the perturbed-input counterforce of §6.3a, never red-first** |

**6 of ≤8.**

---

## §10 · Verification commands

```sh
# THE SEALED CHECKS (the capsule's `checks`, in this order)
npx vitest run --pool=threads --maxWorkers=2 tests/domain/editOperations.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/domain/npcRename.test.js
# ⭐ VERSION 3 — NEW AT THIS TIP: EM-A1 has LANDED and its suite now names NPC_RENAME_SURFACES,
#   so the governing grep returns TWO files where version 2 measured one; and this is the arm
#   that SCANS every module under src/ for an importer of EM-A1's leaves, a population this
#   member's CREATE joins (§P10.11; judgment 110's lesson). MEASURED SAFE: the leaf's only
#   references to ./types.js are JSDoc @typedef lines, which TOOL-32's comment strip blanks.
npx vitest run --pool=threads --maxWorkers=2 tests/domain/editDeclarations.test.js
npx eslint src/domain/edit/operationsNpcRename.js src/domain/edit/operations.js \
  tests/domain/editOperations.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js \
                                             tests/property/dossierProseManifest.test.js
node scripts/check-observed-shape-readers.mjs

# the membership probe — it IMPORTS the exported set, reads no dist, and therefore can never skip
node -e "const{relative}=require('node:path');const{pathToFileURL}=require('node:url');import(pathToFileURL('vite.config.js').href).then(m=>{const S=new Set([...m.EAGER_FIRST_PAINT_MODULES].map(a=>relative(process.cwd(),String(a))));const mine=[...S].filter(p=>p.startsWith('src/domain/edit/'));console.log('EAGER_FIRST_PAINT_MODULES:',S.size,'| anti-vacuity src/main.jsx present:',S.has('src/main.jsx'),'| src/domain/edit/ members in the eager closure:',mine.length?mine.join(', '):'NONE');if(mine.length||!S.has('src/main.jsx')||S.size<200)process.exit(1);})"

npm run typecheck:ratchet
npm run typecheck:domain:strict

# the seal, LAST
node scripts/implementation-packets.mjs validate
```

**How the sealed set was computed (interim rule 8).** TOOL-26's `scripts/governing-tests.mjs` has
not landed at the integration tip, so the interim form applies —
`git grep -l -F '<basename or changed symbol>' -- tests`, **RE-COMPUTED AT `5926f454e`**:
`npcRenameChanges` → **1** (`tests/domain/npcRename.test.js`), `NPC_RENAME_SURFACES` → **TWO**
(⭐ version 3: `tests/domain/npcRename.test.js` AND `tests/domain/editDeclarations.test.js`, NEW
since version 2's base — EM-A1 landed its suite in train EM-T9 — and therefore a sealed row
above), `OP_TYPES` → **0** and `validateOp` → **0** (both symbols arrive with EM-B1a in the same
landing), `compareCodepoint` → **7**, a HUB symbol this
member does not change — it only re-asserts an order — so by the chair's ruling 3 on EM-B2a4 it
contributes no sealed row and its importers go below as instruments. ⚠ `makeOp` → **1**,
`tests/store/operations.test.js`, which is the STORE's operation registry and not this vocabulary:
a substring false positive, stated rather than silently dropped.
⭐⭐ **VERSION 4 — `EDIT_KINDS`, B6's NEW `requiredSymbols` ROW, CONTRIBUTES NO SEALED ROW, AND
THAT IS THE CHAIR'S RULING 3 ON EM-B2a4, NOT AN OMISSION.** Re-executed at `a247fa84d`:
`git grep -l -F EDIT_KINDS -- tests` returns **NINE** files — `tests/domain/pendingEdits.test.js`,
`tests/lib/editFingerprint.test.js`, `tests/lib/simMetricEmitter.test.js`,
`tests/store/npcOpsCovenant.test.js`, `tests/store/editActionPersist.test.js`,
`tests/store/editProseQueueSpine.test.js`,
`tests/store/commitPendingEditsTotality.walker.test.js`,
`tests/build/pendingEditProseLazy.test.js` and
`tests/edgeFunctions/analyticsEventsBundle.freshness.test.js`. It is a **HUB symbol this member
does not change**: B6 READS the frozen list from a test and this member writes no byte of
`src/domain/pendingEdits.js`, exactly as it only re-asserts `compareCodepoint`'s order. The nine go
below as INSTRUMENTS; the one arm that would break if the list moved is B6, and B6 lives in this
member's own sealed file. ⛔ **B6 asserts NO COUNT of `EDIT_KINDS`** — a count would red on every
lawful addition to the queue's vocabulary — it asserts a DISJOINTNESS.
⛔ Never the `tests/lint`
directory; ⛔ never the lighting walker; ⭐ the validator last.

```sh
# ⛔ THE BUILD LANE'S INSTRUMENTS — NEVER SEALED CHECKS
#  (a) the EXCLUDED tests/lint directory run, which MUST EXIT 0 — ⛔ TWO exclusions, not one:
#      this member CREATEs a .js leaf under src/domain, so the wiring-census walker is a NAMED
#      interior red until the chair regenerates the census at the terminal (interim rule 17).
npx vitest run --pool=threads --maxWorkers=2 tests/lint \
  --exclude=tests/lint/sovereigntyLightingContract.walker.test.js \
  --exclude=tests/lint/proseWiringCensus.walker.test.js
#  (b) the lighting walker ALONE, as the measured, named INTERIOR RED (§7's deferred row)
npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
#  ⛔ DO NOT set LIGHTING_CENSUS_REFREEZE. The refreeze is the chair's, at the terminal.
#  (c) the WIRING-CENSUS walker ALONE, expected NONZERO on EXACTLY TWO ARMS (interim rule 17):
#        · car 0 — 'the committed census is byte-identical to a fresh build, and the stamp is live'
#        · '⭐ THE DRY READ: both modes, and the one that writes is not among them'
#      Both red because `stamp.producerIndexFiles` moves N -> N+1 when a .js leaf is CREATEd
#      under src/domain (⛔ a DELTA, never an absolute: the stamp read 1172 at bdbf7c89c and
#      1177 at 5926f454e, and the train's base decides N). ⛔ A member NEVER runs `node scripts/wiring-census.mjs`: N lanes each
#      regenerating one global count produce N conflicting blobs. The chair regenerates it WHOLE.
npx vitest run --pool=threads --maxWorkers=2 tests/lint/proseWiringCensus.walker.test.js
#  (d) THE COUNT PROVER (interim rule 12), PRE-SEAL, run FROM THE KIT PATH — it is kit furniture
#      and is never placed in the tree, never a `checks` entry and never a §7 row:
#        node <kit>/packets-waiting/EM-B1c1.count-prover.mjs \
#             <kit>/packets-waiting/EM-B1c1.md <kit>/packets-waiting/EM-B1c1.manifest.json
#  (e) the lighting walker's OWN park verdict over tests/domain/editOperations.test.js, printed,
#      before the lighting delta is believed. ⚠ VERSION 3, MEASURED: `parkReasonsFor` is a
#      module-PRIVATE const inside the walker (sovereigntyLightingContract.walker.test.js:1670,
#      `const parkReasonsFor = (src) => classify(src).reasons;`) and is EXPORTED BY NOTHING, so it
#      cannot be imported: lift `classify`'s reasons into a throwaway probe in the lane's scratch,
#      or read the credited/parked membership from the walker's own run. Print the reasons list.
#  ⚠ tests/domain WHOLE is NOT owed: this member CREATEs and RENAMEs no test file, so the
#    CREATE-directory rule (the chair's addendum after runs 17/18/19) does not fire for it.
#    EM-B1a owes that run, in its own landing, for the file it creates.
```

**⛔ THE BROWSER SUITE (interim rule 10): NOT GOVERNING FOR THIS MEMBER.** It touches no
`src/components/**` path, no route, no `data-testid`, no accessible name, no nav, header, footer,
bottom bar or page chrome; it renders nothing. Measured, not assumed:
`git grep -n -E "set-npc-name|operationsNpcRename|renameNPC" -- e2e` → **ZERO hits** (version 4, re-executed at `a247fa84d`; the union with `rename-npc` is zero too, exit 1). ⭐ The member
that owes the chromium project is **EM-D0e**.

**Registers that must NOT move:** the two goldens above; `tests/copy/.voice-mechanics-*.json` (this
member renders no reader-facing string); `scripts/mutation-coverage-manifest.json`;
`docs/content/wiring-census.json`.

---

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, **stop** if: **EM-B1a has not landed**, or
`operations.js` / `tests/domain/editOperations.test.js` is absent at dispatch; the seal is missing
or foreign; the leaf measures **> 250 effective lines**, or the `operations.js` edit exceeds **+2
effective**, or `operations.js` after the edit exceeds **250**; **the one spread line cannot be placed at the
codepoint position (between the `set-institution-state` row and the `set-npc-status` row) inside
+2 effective lines**, or `Object.keys(OP_TYPES)` as EM-B1a LANDED it is not in `compareCodepoint`
order; **rename logic of any kind would
have to be written here**; a target-kind check, a name-length rule or any refusal would have to be
authored here (§13 R1 — the refusal's home is EM-C4a v2's branch and EM-B1a's own repair); an
import of `src/domain/factionRename.js` or of `src/domain/edit/operations.js` would be needed to
make anything work; any of EM-B1a's THREE named arms (A1 · A3 · A6) would have to be
**weakened** rather than widened by addition, or **A4 or A5 reds**, or a landed arm OUTSIDE that
roster reds, or the
widening of any one of them is more than §6.3's table names, or **all five** of EM-B1c's names would
have to stop being asserted absent; ⛔ **B6 cannot be written without an exemption for a row minted
after EM-B1a's fourteen**, or `EDIT_KINDS` is not importable from `src/domain/pendingEdits.js`, or
the inherited pair `add-institution` / `remove-institution` is not what the arm measures;
`NPC_RENAME_SURFACES` no longer holds
five rows, or `npcRenameChanges`'s signature has changed; the eager first-paint closure gains any
`src/domain/edit/` member; a golden or the prose manifest moves.

---

## §12 · Receipt, questions and handoff

**The SET-EQUAL proof (interim rule 6)** — `setEqual.mjs` over this file and the capsule; the
executed line is in `EM-B1c1.compile.report.md` §A.

**What EM-C4a version 2 may rely on.** ⭐⭐ **THE KEY IT DISPATCHES ON IS `set-npc-name`, NOT **MEASURED AT THE LANDING (the pass-1B verifier's FIX-2; judgment 154, train EM-T13's hygiene commit):** EM-C4a as landed (version 4.3) dispatches on NEITHER key — its branch is `declaration.kind === 'free-cascade'`, its writer `CASCADE_WRITERS['npc:name']`, and the op it carries for a rename is `set-field` with `{ field: 'name', value }` — so `set-npc-name` stays dark after BOTH halves of the first door, and R8's residual question (*which vocabulary does the adapter's branch dispatch?*) is CLOSED with this answer. The one act now has two typed payload shapes (this packet's `{ newName }` against the door's `{ field: 'name', value }`); its slot is the packet that first constructs a `set-npc-name` op, which reconciles by choosing one shape at its own seam and never by editing the other vocabulary (§6.1's law one layer up).
`rename-npc`** (version 4, judgment 126): the op layer and the shipped `EDIT_KINDS` queue are
DISJOINT by name over every row minted after EM-B1a's fourteen, and B6 keeps them so. Version 3's
R8 slotted *"which vocabulary does the adapter's branch dispatch?"* to EM-C4a's inbox under the
intake rule; that question is unchanged and still EM-C4a's, but it can no longer be answered by
accident — a branch keyed on the string now says which layer it means.
⭐⭐ **MEASURED AT THE FLIP (the train verifier's pass 1B, FIX-2, 2026-09-22): EM-C4a v4.2 dispatches on NEITHER key.** Its cascade branch keys on the DECLARATION's kind `free-cascade` and `CASCADE_WRITERS['npc:name'] → renameNPC`; a rename request through the one adapter carries `makeOp('set-field', …, { field: 'name', value })`, which validates `{ ok: true }` against the composed catalogue, and the layer records `set-root`. So R8's residual question is CLOSED with the answer *neither*: **`set-npc-name` has NO producer at this landing and stays DARK**, and one act carries two payload shapes (`{ newName }` here, `{ field, value }` there). SLOTTED, not deferred: the Edit-Mode inbox row "who mints `set-npc-name`" (EM-C4b's registry actions or EM-B1c's own consumer) — the chair's ruling at EM-T13's placement; EM-D0e's compile dispatches C4a's shape and raises the divergence in its §13.
`OP_TYPES['set-npc-name']` exists with `target: 'npc'` and a
single required `newName`; its `guardsStated` names the pure-domain cascade as DATA and **names no
store action**, because that name is EM-C4a's one home. ⛔ **`validateOp` refuses neither a
wrong-kind target nor an empty or over-long name** (§13 R1): every refusal the door owes is the
adapter's.

**Questions only the chair can answer** are carried in §13 and in the lane's final message.

**Completion receipt owed at the landing:** the count prover's printed line and exit 0 from the
kit path (interim rule 12) · the wiring-census walker's TWO named red arms quoted (interim rule
17) · base sha · seal identity · the exact changed files with
effective-line deltas measured by eslint's `Linter`, **including `operations.js`'s combined
figure** · B1–B6 executed · B6's perturbed-input counterforce quoted with the exact pre-mutant SHA-256 restored · the mutants planted, convicted and restored digest-exact · focused
commands, exits and counts · both typecheck configurations · the census tuple before and at the tip
**with the interior red quoted verbatim and `parkReasonsFor`'s printed output** · generated
artifacts `NONE` · deviations `NONE | STOP` · judgment calls: `NONE`.

⭐ **EXECUTED (the flip, 2026-09-22):** base `efd0eb448` · placement `04ac6520e` · the version-5 packet commit `fa697b1ff` (judgment 135: one character in §6.1's `guardsStated` literal) · seal `fcf8020b…` at `fa697b1ff` (re-sealed after that commit — ⚠ the restamp note in the build commit `e5c0906b4`'s body names the T11 drift's cause, "the EM-B1a manifest-entry rebuild", where the true cause was the version-5 packet commit; the tool hard-coded it; never amended, said here) · the build `e5c0906b4` → picked `a89ee75f6` (3 files, +288/−10; the leaf 21 effective; `operations.js` 231 → 233; the count prover exit 0 from the kit path; the census walker's two red arms quoted in the lane's receipt) · B1–B6 executed in queue window 35 job 4 (exit 0 after 660 s; the lighting delta `+0/+0/+0/+6/+0`) — ⚠ **B2, B3 and B4's red-firsts red on a `TypeError` with the row absent** (`Cannot read properties of undefined (reading 'target')` / `(reading 'requires')`: the first dereference throws before the claim is tested), NOT on their own assertion; they are not vacuous (a wrong row reds them; read whole by the verifier) — **judgment 140: said rather than guarded**, no assertion added to a proven build · the verifier's pass 1B: 0 STOP · 2 FIX · 6 NOTE (this paragraph and the one above are the two FIX cures).

---

## §13 · RAISED — for the chair

| # | item |
|---|---|
| **R1** | ⛔ **`validateOp` ENFORCES NEITHER THE TARGET-KIND MATCH NOR ANY NAME RULE — measured, and it is not this member's to fix.** EM-B1a §8's algorithm step 3 refuses a target only when its `kind` is outside the closed seven, so `makeOp('set-npc-name', {kind:'faction', id:'f1'}, …)` builds a **valid** op with a faction target; step 4 tests `=== undefined`, so `newName: ''` **passes**. ⭐ **RE-MEASURED AT VERSION 2 AND NOW RATIFIED IN EM-B1a'S OWN TEXT:** EM-B1a **version 7**'s §8 carries the comment *"⛔ AND NOTHING MORE AT STEP 3: the kind is checked for MEMBERSHIP of the closed seven, never for a MATCH against `decl.target`, and no name rule is applied. Both are closed AT THE DOOR."* — so the split below is EM-B1a's declared design, not an oversight, and the recommendation is now only the docket line. The brief's acceptance (*"a non-NPC target and an empty or over-long name are refused with EM-B1a's closed reasons"*) therefore has no home in EM-B1a as compiled. **This member declares `target: 'npc'` and authors no check** (a second validator is a STOP). **Both refusals are closed at the door by EM-C4a version 2**: the branch resolves `npc:<id>:name` through the NPC roster, so a faction id resolves to no NPC (`unknown_target`), and the shipped writer trims and refuses an empty name, which the read-back converts into the one added reason. *Recommend: ratify that split, and docket ONE line to EM-B1a's next repair — step 3 also refusing `op.target.kind !== decl.target` — since the gap is general to all fifteen rows, not special to this one.* |
| **R2** | ⚠ **EM-B1b's and EM-B1c's leaves declare an import that would be a module cycle.** Both §7 rows say *"Import the vocabularies from `operations.js`"* while `operations.js` imports their rows; a leaf reading `OP_STAGES` at module-evaluation time would hit the temporal dead zone. It is LATENT today (the rows carry literals), not live. **This member imports nothing and asserts vocabulary membership from the TEST instead.** *Recommend: ratify this shape for EM-B1c1, and docket the same one-line correction to EM-B1b and to EM-B1c's version 4.* |
| **R3** | ⚠ **EM-B1a's §6 typedef and its §16.3 disagree about `requires`.** The typedef line spells `requires: readonly string[]`; §16.3 (R6, CLOSED) makes it `{ world, registry }` on **every** row and the split's whole arithmetic rests on that. This member carries the **two-kind** shape and reports the stale line rather than adapting to it. *Recommend: one line in EM-B1a's next docs repair; no contract moves.* |
| **R4** | ⛔⛔ **REFUTED AT VERSION 3 AND REVERSED — A5 IS LIVE, AND WIDENING IT IS THIS MEMBER'S.** Version 2 read EM-B1a **version 7**'s A5 (*"Each of the three `rename-*` types declares the right target kind…"*), which contradicted A1 and was therefore unsatisfiable, and concluded that A5 was EM-B1a's repair to make. **EM-B1a version 8 (judgment 99) already made that repair:** it struck A5's stale first clause and kept the satisfiable half, which now reads *"`rename-faction`, `rename-npc` and `rename-settlement` are absent from `OP_TYPES` by name — the same absence A1 pins"* plus the delegation source scan. **So A5 was a live arm that a fifteenth row spelled `rename-npc` would break**, exactly as A1 is, and by judgment 110's law such an arm is widened by the packet whose landing needs it, under its own seal — never by a cure lane and never by the chair at a terminal. ⭐⭐ **VERSION 4 (judgment 126) — THE REVERSAL STANDS; THE EXPOSURE IT NAMED IS GONE WITH THE NAME.** A5's subject is `B1C_FIVE.filter((t) => t.startsWith('rename-'))` (`:426`, LANDED), so the arm reds only for a LIVE `rename-*` key, and `set-npc-name` is not one: **A5 is MEASURED GREEN, this member widens it nowhere, `rename-npc` stays on its absent-by-name list forever, and a red on A5 at the build is a STOP** (§6.3, §11). *Recommend: ratify — version 3's refutation of version 2 stands as the record, nothing is owed to EM-B1a on A5 either way, and ESTATE-REPAIR-4's A5 line (if it still carries one) is struck.* |
| **R5** | ⚠ **`OpTypeDeclaration` has no `writer` key**, so EM-B1a's A5 and EM-B1c's C2 (*"names the existing cascade as its declared writer"*) have no declared home in the row schema. This member names it in **`guardsStated`**, as prose-data. *Recommend: ratify the prose-data form rather than minting a twelfth field — EM-B1a's own note is that the op shape is persisted by EM-B3 and *"a field added after EM-B3 lands is a stored-shape change with a migration cost."** |
| **R6** | ⛔ **`HOME_OP_TYPES` IS A BINDING NO PACKET MINTS — AND TWO PACKETS SPELL IT.** EM-B1a's §6 export block declares exactly five symbols (`OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `OP_TYPES`, `makeOp`, `validateOp`) and its §7 CREATE row says only *"leave the structure open for B1b to append"*; **`HOME_OP_TYPES` appears in EM-B1b's §6.2 and (until version 2) in this packet's, and in EM-B1a nowhere** (`grep -F HOME_OP_TYPES` over the kit's waiting packets: EM-B1b and EM-B1c1 only). Version 2 names the composition by POSITION instead, so this member cannot be stopped by a name EM-B1a's build never writes. *Recommend: rule ONCE for the family — either EM-B1a's next repair names the internal home map (and EM-B1b, EM-B1c1 and EM-B1c v4 all spell it), or all three spell the SPLICE by position, as this version now does. The second costs EM-B1a nothing and is what version 2 assumes.* |
| **R8** | ⛔⛔ **CURED AT VERSION 4, NOT DOCKETED — THE OP TYPE NO LONGER COLLIDES WITH A SHIPPED VOCABULARY OF THE SAME NAME (the chair, JUDGMENT 126, on the EM-C4a pre-proof's §12 Qe).** ⭐ **The finding itself stands exactly as version 3 measured it:** `rename-npc` IS a live member of the estate's pending-edits vocabulary — `EDIT_KINDS` (`src/domain/pendingEdits.js:33`, with `:22`'s typedef and `:76`'s committable list), `pendingEditIntents.js` (`:69` the roster, `:124` the `settlement.rename-npc` intent, `:604` a branch), `settlementPendingEdits.js` (`:207`, `:309`, `:382`, `:495`), `pendingEditsPreview.js` (`:19`, `:311`), `src/lib/editFingerprint.js` (`:22` `'npc'`, `:39` `'cosmetic'`) and `PendingChangesBar.jsx:60` — **SIXTEEN occurrences over SEVEN `src/` files, fifteen code and one comment** (`settlementRenameHelpers.js:414`), re-counted at `a247fa84d`, plus the canon lock the store already enforces (`tests/store/npcOpsCovenant.test.js:193-194`: *"rename-npc is identity-locked post-canon (refused at the queue seam)"*). ⛔ **THIS MEMBER TOUCHES NONE OF THOSE SIXTEEN SITES AND NEVER WILL:** it re-spells its OWN op, not the shipped verb, which keeps its name, its payload (`{npcId\|npcIndex, newName}` against this one's `{newName}` with the subject in the `EntityRef` target), its intent id and its lock. ⭐⭐ **AND THE NAMED RESIDUE IS CLOSED STRUCTURALLY RATHER THAN DOCUMENTARILY:** version 3 named `editFingerprint.js`'s classify-by-STRING as the silent fall-through that either spelling would have kept open — **B6 is the arm that convicts the next packet that would re-open it** (§6.3a), and it is shrink-only, so the two INHERITED collisions (`add-institution`, `remove-institution`, EM-B1a's landed rows) are banked and named rather than discovered later. *Recommend: ratify the cure and CLOSE R8. The one question that remains is EM-C4a's and is unchanged — which vocabulary its branch dispatches — and it sits in EM-C4a's inbox under the intake rule, now answerable by name rather than by accident.* |
| **R9** | ⚠ **`operations.js`'s FAMILY MARGIN IS EIGHT TO TEN LINES, NOT TWENTY (version 3's §3.1).** On the siblings' MEASURED figures — EM-B1a **231**, this member **+2**, EM-B1b version 5 **+5** — the file stands at **238 of 250** before EM-B1c version 4 appends its four rows, and §P4's codepoint splice can cost that member more than one group. *Recommend: rule now that EM-B1c version 4's re-cut carries an effective-line measurement of `operations.js` as a STOP condition at its own compile, and that the chair re-derives the running total at each of the three placements. Nothing is owed by this member: its **+2** and its STOP at +2 are unchanged.* |
| **R10** | ⚠ **THE SIXTH `_pendingRequiredSymbols` ROW SPELLS `@typedef`, WHICH IS NOT A DECLARATION LINE.** EM-A1 has LANDED, so `src/domain/edit/types.js` exists and that row's premise is discharged; but promoting it into `requiredSymbols` as written would assert the bare token `@typedef` verbatim, which the file carries six times and which pins nothing. *Recommend: STRIKE the row at placement (EM-A1's own landed rows carry the typedefs), or re-spell it as the exact declaration line the chair wants pinned. The other five rows stay pending on EM-B1a.* |
| **R7** | ⛔ **THE "BOTH SOURCE MAPS FROZEN" ARM IS UNREACHABLE AS WRITTEN — proved from the declared signatures alone.** `Object.freeze({...A, ...B})` freezes the OUTER map only (EM-B1b's R2 raises the same reading), but a test can only assert `Object.isFrozen` on a value it can NAME: this member's map is importable (`NPC_RENAME_OP_TYPES`), and **EM-B1a's home map is exported by nothing**, so no arm of any packet can hold it. Version 2's B1 therefore asserts what closes the same hole from the declared exports: `NPC_RENAME_OP_TYPES` frozen **and all fifteen composed ROWS frozen**. *Recommend: ratify that form and answer EM-B1b's R2 with it, so EM-B1b and EM-B1c v4 do not each write an arm that cannot be written.* |
| **R11** ⚠ | **NEW AT VERSION 4 — EM-B1a's `B1C_FIVE` WILL CARRY A NAME NO PACKET WILL EVER MINT, AND NOTHING IS OWED BY THIS MEMBER.** `B1C_FIVE` (`tests/domain/editOperations.test.js:50-53`, LANDED at `a247fa84d`) is *"the five the chair's ruling R8 moved to EM-B1c"* — `rename-faction`, `rename-npc`, `rename-settlement`, `schedule-event`, `set-world-fact`. After version 4 **`rename-npc` is a name the op layer will never mint**: this member spells `set-npc-name`, and EM-B1c version 4 drops the row at ESTATE-REPAIR-4. The constant is therefore one member wider than the estate it describes. ⛔ **It reds nothing, weakens nothing and goes vacuous nowhere** — A1's `reabsorbed` clause (`:152-155`) and A5 (`:424-429`) both assert an ABSENCE, and a stale absence claim is the SAFE direction: it can only ever over-refuse, and B6 now covers the class it was standing in for. *Recommend: ONE documentary line at EM-B1a's next docs repair, or inside EM-B1c version 4's own widening — re-word `B1C_FIVE`'s comment so it says FOUR names are EM-B1c's and the fifth is the shipped queue's verb the op layer now avoids by design. ⛔ Not this member's and not a cure lane's: it is an edit inside another packet's landed guarantee (judgment 110).* |
