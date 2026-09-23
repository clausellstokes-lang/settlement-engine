# Settlement editor / EM-C4a — THE STORE'S PLAIN-EDIT HALF: one lazy `src/store/editSlice.js`, ONE generic adapter in the command registry, and a plain edit that applies on a DRAFT through the estate's existing application-command boundary — at +0 eager first-paint modules

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader` anchors the status
  row at end-of-line and takes `status` only when exactly one row matches. Every stamp, caveat and
  date goes on these continuation lines, never on the row.
  ⭐ **THE SEVENTH OF THE EIGHT PACKETS ON THE ROAD TO THE FIRST DOOR** (the chair's ruling of
  2026-09-20 ~21:00, judgment 33): EM-A1 · EM-A2a · EM-B1h · EM-B1i · EM-B1a · EM-B2a1 ·
  **EM-C4a** · EM-D0. EM-C4b later extends this slice with the registry's actions and
  `selectGuards`; it no longer creates the file.
  ⛔ **COMPILED TO SHAPE A** (§2.2): `src/store/index.js` is NOT modified, because the charter's
  `M src/store/index.js` cannot be honoured at +0 eager first-paint modules and a rise in that
  closure is a STOP for the OWNER. The chair rules on the charter row; the measurement is §2.2.
- **Landed at:** `4801434d98adf211addd4912c5f4e8534d56ac78` — the thirty-first landing — train EM-T12 (version 4.2, judgment 139; its build c2d44fa65 composed as 4801434d9 with its packet commit 9eef9c9af → 9e2a318d1): the store's plain-edit half — one lazy editSlice, ONE generic adapter and a plain edit applied on an uncanonized save through the command boundary at +0 eager first-paint modules (10 files, +1313; the version-4.1 build's two reds cured: the reviewed-capability pin ten → eleven as a TEST row with its review sentence, and the cascade writer reached by LITERAL name through the exported CASCADE_DISPATCH table pinned set-equal to CASCADE_WRITERS by A1's assertion (d) — the dead-op ratchet's premise); its mutation-manifest row composed beside EM-B2a3's on the row-keyed register (judgment 142); cured at `17bf34dd1` (version 4.3 — the two landed dormancy arms this landing widens, editDeclarations.test.js and editOperations.test.js, as TEST rows; the cure lane at the flipped tip, judgments 148/148b)
- **Packet version:** 4.3
  - ⭐⭐ **VERSION 4.3 (THE CHAIR, JUDGMENT 148; queue window 39's pre-flight of `tests/domain` at train EM-T12's flipped tip `16f0bc71c`, 2026-09-22 12:17 EDT; cut by the successor chair, session cce01f87). NO CASE, NO REFUSAL, NO IMPORT AND NO LIGHTING FIGURE MOVES; TWO TEST ROWS ARE ADDED.** The composed tip redded two LANDED dormancy arms this member's landing widens and version 4.2 never named: **(1)** EM-A1's `tests/domain/editDeclarations.test.js` DORMANCY arm holds the importer roster of `src/domain/edit/fieldDeclarations.js` EXACT in both directions (`EXPECTED_IMPORTERS`, one row: `operations.js`), and **(2)** EM-B1a's `tests/domain/editOperations.test.js` A6 asserts NOTHING under `src/` imports `src/domain/edit/operations.js`. `src/store/editSlice.js` — LAZY, composed by no eager slice, +0 eager modules by A5 — is by §6.1 the FIRST runtime importer of both leaves, so the two arms red at the composed tip (`src/store/editSlice.js imports src/domain/edit/fieldDeclarations.js`; `… imports src/domain/edit/operations.js`). The arms exist to keep the declaration table and the op catalogue out of every bundle closure; a lazy store leaf is exactly the sanctioned shape, and the arms are WIDENED IN PLACE by the packet whose landing needs it (judgment 110/111's rule): each roster gains the one `editSlice.js` row with a comment naming this member and its laziness, no assertion is weakened, and the rosters stay exact. The cure rides this member's own lane under a fresh seal, committed ON TOP of the build commit `c2d44fa65` as MODIFYs (judgment 141), and the train's LANDED entry is re-spelled at version 4.3 (judgment 132). LAW for the sixth amendment (§P10.11 (i), already written; this member is its first casualty on a train): a member that becomes the FIRST IMPORTER of a landed leaf carries that leaf's DORMANCY arm as a TEST row — the pre-proof's `git grep -l -F '<leaf basename>' -- tests` finds it; version 4.1's pre-proof (2026-09-21 14:3x) predated the brief's step 17 and grepped the leaves' contracts, not their importer rosters.
  - ⭐⭐ **VERSION 4.2 (THE CHAIR, JUDGMENT 139; the two reds of the version-4.1 build at queue window 35 job 3, 2026-09-21 17:54–18:03 EDT; cut 2026-09-22 by the successor chair, session cce01f87). NO CASE, NO REFUSAL, NO LIGHTING FIGURE AND NO IMPORT MOVES; ONE TEST ROW IS ADDED AND ONE EXPORT IS NAMED.** The build was green on every red-first, every mutant and every sealed check but two, and both are instruments the packet had not named. **(1) `tests/application/commands/commandRegistry.test.js` pins the REVIEWED capability set at TEN** (*"the live registry exposes the bounded reviewed capabilities"*), and registering `settlement.plain-edit.apply` makes the live registry ELEVEN. The pin is a review act, so it is a `TEST` row here with its review sentence in §6.2: the reviewed set goes ten → eleven in the registry's own order, and the surveyor set is unchanged. **(2) `tests/store/deadOperationRatchet.test.js`'s premise arm** (*"no dispatch-by-computed-name exists (the scanner premise holds)"*) convicts `src/store/editSlice.js`: §6.1a step 4's `await get()[action](index, value)` is a COMPUTED dispatch off the store handle, and that ratchet decides whether a registered op is DEAD by counting its literal call sites — one computed dispatcher anywhere in `src/` makes every op nominally reachable and voids the whole ratchet. **The cure keeps the declaration and the call apart:** `CASCADE_WRITERS` stays the DECLARATION (which store action owns a declared field) and a new exported frozen table `CASCADE_DISPATCH` is the CALL — one row per writer, each reaching its action by the LITERAL name the scanner can see, `renameNPC: (get, index, value) => get().renameNPC?.(index, value)`, the spelling `settlementPendingEdits.js:317` already uses. A1 gains ONE assertion inside its existing arm, no case and no title minted: `Object.keys(CASCADE_DISPATCH)` set-equal BOTH WAYS to `Object.values(CASCADE_WRITERS)`, both read from the frozen exports (anti-vacuity rule 2), so a row added to one table and not the other reds. The import list is unchanged, so A5's arm and SHAPE A's `+0` stand; `PLAIN_EDIT_REFUSALS` is unchanged; §6.1a step 1 refuses `not_a_draft_field` for an action with no dispatch row, the fail-closed twin of the declaration check (unreachable in a lawful build, pinned by A1). LAW for the sixth amendment: a packet that registers an application command names the reviewed-set pin as a TEST row and its review sentence in §6; a store edit dispatches by literal names, never `get()[…]`, because the dead-op ratchet's premise is the estate's.
  - ⭐⭐ **VERSION 4.1 IS THE INDEPENDENT PRE-PROOF FOR TRAIN EM-T12, MEASURED AT `80e855f26` ON
    `em-train-11-2026-09-21`, AND IT MOVES NO PATH, NO CASE, NO REFUSAL AND NO CONTRACT** (the Opus
    pre-proof lane, 2026-09-21 ~14:3x; read tree `$SP/em-train-11`, READ-ONLY, `git status --short`
    EMPTY before and after). ⛔ **The nine §7 rows, the eight acceptance cases, the seven refusals,
    the three-leaf override and SHAPE A are version 4's, unmoved and still SET-EQUAL; the count
    prover is green unchanged.** What moved, each MEASURED at the tip:
    **(1) TWO PROVIDERS LANDED, SO SIX PENDING ROWS ARE DISCHARGED.** `src/domain/edit/dmLayer.js`
    (EM-B2a1) and `src/domain/edit/fieldDeclarations.js` (EM-A1) are REAL at the tip — the J-T1
    window shows them arriving `+239` and `+144` — so their six `_pendingRequiredSymbols` rows are
    now `requiredSymbols` rows proved verbatim at `grep -c -F` = 1, and **every fact §6 quotes from
    either is CONFIRMED against LANDED code, not against a packet.** `operations.js` is still ABSENT
    (EM-B1a is READY, not landed), so its three rows stay pending — the one remaining provider gate.
    **(2) `Depends on` GAINS EM-B3e (LANDED) AND EM-B3f (BUILT), and the reason is one sentence:**
    this packet is the FIRST WRITER of `dmLayer`, and the two members close the last two seams
    through which a written layer could LEAVE the account — EM-B3e the restored `versionHistory[]`
    snapshot, EM-B3f the PARKED campaign snapshot `preflightAccountExport` was shipping
    unprojected. Both are ORDERING dependencies; nothing here imports either.
    **(3) ⛔ THE PLACEMENT BLOCKER MOVED FROM EM-B3e TO EM-V10, AND IT IS EXECUTED, NOT REASONED.**
    EM-B3e is LANDED; **EM-V10 is READY and holds `tests/lib/editTravel.test.js`**, so the tip's own
    validator refuses this packet's entry — `duplicate change path across packets:
    tests/lib/editTravel.test.js (EM-V10, EM-C4a)`, exit 1 — and acquits it the moment EM-V10 is
    LANDED. ⇒ **this packet rides train EM-T12** (the chair's judgment 110 re-roster), never EM-T11.
    **(4) A5b IS RE-ADDRESSED AGAINST THE FILE EM-V10 LEAVES**, because EM-V10's build inserts nine
    lines at `:87` and thirty-five at the END of the second `describe` (§7's row).
    **(5) JUDGMENT 123's RULING IS MEASURED AND PUT TO THE CHAIR** (§12 Qe) — it moves no byte of
    this packet either way, because §6.1a keys on the DECLARATION's `kind` and never on an op type.
    **(6) FOUR STALE ABSOLUTES BECOME DATED PAIRS** (the eager set 269 → **270**, the `editMode`
    population 43 → **47**, the four closure module counts, the `savedSettlements.find` siblings) and
    **two line citations are re-addressed** (`implementation-packets.mjs:828` → **`:921`**;
    `settlementSlice.js:1111` → **`:337`**, the declaration rather than a read site) — judgment
    124's law: a pre-proof's citation grep reads the manifest's `_note`s too, and all **29**
    citations in this packet and its capsule were re-resolved against the tip.
    **(7) THE PREAMBLE IS THE FIFTH AMENDMENT'S** (`fdecd426…`), measured at the tip, and the
    interim-rules row is STRUCK because the amendment has LANDED and supersedes the sheet.
  - ⭐⭐ **VERSION 4 IS THE TRAIN EM-T11 PRE-PROOF'S RULING EDIT, AND IT MOVES NO PATH, NO CASE AND
    NO REFUSAL** (the Opus pre-proof lane, 2026-09-21 ~06:0x, measured at `429141e2d`). Three edits,
    each measured: **(1) THE OWED EDIT — ONE REFUSAL SITE PER REASON** (the chair's judgment 82 item
    2): §6.1 step 1 is now the ONLY site that returns `no_save`, it resolves the save by id and
    succeeds only for the ACTIVE save, and §6.1a step 2's pre-condition is an INVARIANT the algorithm
    holds by having reached it rather than a second arm returning the same reason. The data-safety
    gate is HOISTED, not weakened: it now guards the `set-root` path too, and §11 STOP 9 re-points to
    its one home. **(2) `validateOp`'s SECOND ARGUMENT IS BOUND.** Version 3 wrote
    `validateOp(request.op, world)`, and this module binds no `world`: EM-B1a version 7's algorithm
    reads that parameter at NO step, so the call passes `null` explicitly and §11 STOP 5 gains the
    arm that convicts a landed `validateOp` which reads it. **(3) `selectCanonState`'s SUBJECT IS
    NAMED** inside its declared contract — the LIVE store state for the ACTIVE save, which
    `savePhase` reads first and which the declared writer's own canon lock reads, so the two can
    never disagree; the `savedSettlements` envelope is a CACHE that `setActiveSaveId` does not
    upsert. ⛔ **The nine §7 rows, the eight acceptance cases, the seven refusals and SHAPE A are
    version 3's, unmoved and still SET-EQUAL.** Versions 5.2/2.1/7 of the providers are re-quoted in
    `Depends on`, and every EM-A1 fact below is now CONFIRMED against BUILT code.
  - ⭐ **VERSION 3 IS THE PRE-PROOF'S COUNT AND RULE-COVERAGE REPAIR, AND MOVES NO PATH AND NO
    BEHAVIOUR** (the Opus pre-proof lane for train EM-T10, 2026-09-21 ~02:5x, measured at
    `e80a6a3f4`). Four inequalities the interim rules' **rule 12 count law** convicts were repaired,
    and rules **13, 14 and 16** — added after version 2 was compiled — were answered by measurement:
    (1) the deferred lighting row claimed **three** CREATEd test files, predicted `files +3` and a
    red shaped `expected <N+3> to be <N>`, while §7 and the capsule declare **two** — the third was
    the walker's own inline fixtures, which create no file; all three figures are now **two**;
    (2) §7's `tests/lint/editMutationPath.walker.test.js` row declared **A4** alone while §9 homes
    **A4 and A5** there — the row now declares both, which is exactly the contradiction that stopped
    EM-B3d's sealed build before its first byte; (3) every capsule acceptance case now carries a
    `home` field naming the file that holds it and the §7 row that authorizes that file's edit
    (rule 12); (4) §7 gains the three measured statements rules 13, 14 and 16 require. ⛔ **No path
    moved, no contract moved, no acceptance case minted or retired**: §7's nine rows and the capsule
    are unchanged as a SET and still SET-EQUAL, and the seven refusals, the eight cases and SHAPE A
    are version 2's.
  - ⭐ **VERSION 2 ADDS ONE BRANCH AND NOTHING ELSE** (the chair's ruling 1 on EM-D0, 2026-09-20
    ~22:15, judgment 39): when the declared field's `kind` is **`free-cascade`**,
    `applyPlainEditToDraft` routes to the field's **DECLARED WRITER** — the estate's shipped
    `renameNPC` — **awaits** it, verifies by READ-BACK, and never writes the key itself (§6.1a).
    ⛔ **No path moved**: §7's nine rows and the capsule are unchanged and still SET-EQUAL. The
    closed refusal set grows by **exactly one** reason, `rename_not_applied`, taken VERBATIM from
    the estate's own dispatcher; the acceptance stays at **8 of ≤8** with four arms folded into
    A1, A2, A3 and A5 (EM-B1a's own precedent — *"VERSION 2 ADDS THREE ARMS INSIDE A2 — still 8 of
    ≤8, no case minted"*). SHAPE A is re-proved: **the branch adds ZERO import edges.**
  - Version 1 is in `superseded/`. Everything else in version 1 stands, including SHAPE A, the
    chair's six rulings, the `roots` key spelling, `EDITOR_MODES`, the 2 → 3 leaf override and the
    `NOT_YET_WRITTEN_KEYS` discharge.
- **Verified base:** `em-t12-c4a-2026-09-21` at `efd0eb4481669fce0fa00c356fef9399ab374d17`
  ⚠ Left for the chair's promotion stamp. ⭐⭐ **VERSION 4.1 REWRITES THE SENTENCE at its own read
  tip and corrects its one count** (version 4's said "TWENTY `requiredSymbols`"; six pending rows are
  discharged at this tip, so the row count is **TWENTY-SIX**). **The revalidation sentence the chair
  will use:**
  *"Re-measured at `80e855f269a1e8ca3dbcefa0a68a28507ecb339a` (read tree `em-train-11` on
  `em-train-11-2026-09-21` = train EM-T10's landed tip `5a6d7f1fc` + the fifth amendment + TOOL-30 +
  train EM-T11's placement; `git status --short` EMPTY at the start and the end of the lane): all
  five CREATE targets ABSENT (`git ls-tree -r HEAD` returns zero rows for each of
  `src/store/editSlice.js`, `src/application/commands/plainEditRuntime.js`,
  `src/application/commands/adapters/plainEditApply.js`, `tests/store/editSlice.test.js`,
  `tests/lint/editMutationPath.walker.test.js`); all TWENTY-SIX `requiredSymbols` present VERBATIM at
  the paths in §5, each at `git grep -c -F` = 1; `retiredSymbols` empty and proved so by the
  post-edit simulation; `429141e2d`, `e80a6a3f4`, `bdbf7c89c`, `5a6d7f1fc` and `5926f454e` are each
  an ancestor (`merge-base --is-ancestor`, exit 0); the preamble RE-MEASURED at this tip as
  `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c` (the fifth amendment); the
  eager first-paint set measured **270**, with this packet's seven named modules ABSENT from it and
  `src/main.jsx` present."* ⛔ A `__BASE__` packet can NEVER pass `validate:packets`; validation is
  downstream of this stamp, never a precondition of it.
  ⚠ **THE J-T1 WINDOW `429141e2d → 80e855f26`, over every change path AND every `requiredSymbols`
  and `_pendingRequiredSymbols` path, names FOUR files and no more** (`git diff --stat`, run in the
  same command that read the tip):
  ```
   scripts/mutation-coverage-manifest.json |  18 +++
   src/domain/edit/dmLayer.js              | 239 ++++++++++++++++++++++++++++++++
   src/domain/edit/fieldDeclarations.js    | 144 +++++++++++++++++++
   tests/lib/editTravel.test.js            | 179 ++++++++++++++++++++++++
   4 files changed, 580 insertions(+)
  ```
  Each is ACCOUNTED: `dmLayer.js` and `fieldDeclarations.js` are the two providers LANDING (§5's six
  discharged rows); `mutation-coverage-manifest.json` is ROW-KEYED and this packet's row
  (`invariants['tests/lint/editMutationPath.walker.test.js']`) is still absent from it
  (`grep -c editMutationPath` → 0); `tests/lib/editTravel.test.js` is EM-B3d's and EM-B3e's landings.
  ⛔ **AND IT MOVES ONCE MORE BEFORE THIS PACKET BUILDS** — EM-V10's build (`eb8402184`, on top of
  this tip) adds `+44` to that file. §7's row is written against the file as EM-V10 leaves it.
  Every other declared path: window EMPTY.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** ⭐⭐ **VERSION 4.1 RE-MEASURES EVERY ROW AT `80e855f26`. TWO PROVIDERS HAVE LANDED, AND TWO ORDERING MEMBERS ARE ADDED.**
  **EM-A1 — LANDED** (`e7bdb944b`, train EM-T9): `src/domain/edit/fieldDeclarations.js` and `src/domain/edit/types.js` are REAL at the tip and were read WHOLE by this lane. ⭐ **Every fact this packet takes from EM-A1 is now CONFIRMED AGAINST LANDED CODE**, line-true: `declarationsFor(cardType)` returns the ONE shared frozen `NO_DECLARATIONS` array for an unknown card type and never throws (`fieldDeclarations.js:130-136`); `isEditableCard` is exactly `declarationsFor(cardType).length > 0` (`:142-144`); the table declares **SEVENTEEN** rows over **FIVE** card types with **three** `free-cascade` fields — `institution.name` (`:94`), `npc.name` (`:100`), `faction.faction` (`:106`) — and ONE `share` field, `faction.power` (`:108`); `npc` declares exactly FOUR rows — `name`, `role`, `status`, `note` (`:100-103`) — which is §12's witness for `undeclared_field`; `FieldDeclaration.writer` holds a GENERATOR address (`'src/generators/steps/generatePopulation.js#generatePopulation'` for `npc.name`), never a store action, which is what keeps `CASCADE_WRITERS` the one home for that name; `Op.requires` is a FLAT `readonly string[]` (`src/domain/edit/types.js:69`) and `EntityRef.kind` is the closed SEVEN — `settlement|institution|npc|faction|power|phantom|section` (`src/domain/edit/types.js:54-55`).
  **EM-B2a1 — LANDED** (`f9b68387a`, train EM-T10): `src/domain/edit/dmLayer.js`, read WHOLE (239 lines). ⭐ **CONFIRMED AGAINST LANDED CODE:** `applyEdit(layer, op, declarations)` is ARITY THREE (`dmLayer.js:164`); its op shape is exactly `{ kind: 'set-root', key, cardType, field, value }`, with `cardType` and `field` declared TRANSIENT COMMAND COORDINATES that persist nothing (`:153-156`); `APPLY_EDIT_REASONS` is `['invalid_op', 'undeclared_field', 'unknown_target']` (`:71`) and the REFUSAL ORDER the leaf's own header fixes is `invalid_op` → `unknown_target` → `undeclared_field` (`:67-68`), exactly as §6.1 step 6 states it; an unusable consult FAILS CLOSED to `unknown_target` (`:185-186`); `layerRead` is own-property only and never throws (`:125-129`); `EMPTY_DM_LAYER` is deeply frozen (`:55-60`); and on `ok:true` the returned layer is a NEW deeply-frozen object whose `keys` holds exactly the keys the call wrote (`:208-214`).
  **EM-B1a version 11 — BUILT, NOT LANDED** (`src/domain/edit/operations.js` is ABSENT at the tip; the staged build is on `em-t11-b1a-2026-09-21`, READ-ONLY). ⭐ **VERSION 4.1 CONFIRMS §6.1 STEP 3 AGAINST THAT BUILD:** `validateOp(op, _world)` names its second parameter `_world` and **reads it at NO step** — the body is the op's object-ness, `declarationOf(op.type)`, `isEntityRef(op.target)`, the payload's required fields, the declared-values membership and the undeclared-key sweep — so passing `null` EXPLICITLY at the declared arity is right, and §11 STOP 5's arm is the correct tripwire. `OP_TYPES` holds exactly **FOURTEEN** keys and **`rename-npc` is NOT one of them** (executed over the staged blob: `add-faction · add-institution · add-npc · found-phantom · promote-phantom · rebalance-power · remove-faction · remove-institution · remove-npc · set-field · set-institution-state · set-npc-status · set-power-holder · set-relationship`), which is §12's witness for `invalid_op`; `makeOp` FLATTENS `requires` (`[...decl.requires.world, ...decl.requires.registry]`), which this packet neither reads nor passes.
  ⭐⭐ **EM-B3e — LANDED** (`49a5f1e01`, train EM-T10). **AN ORDERING DEPENDENCY, NOT AN IMPORT.** The veil hole EM-B3d left open — a restored `versionHistory[].settlement` snapshot bypassing the import and export strips — is closed, and A5b CONSUMES that closure: `withoutEditState` (`src/lib/accountData.js:223`) destructures `versionHistory` and maps `withoutEditKeys` (`:191`, called at `:232`) over every settlement the entry nests, and `preflightAccountExport` (`:267`) applies it across the whole save population (`:271`). Both symbols proved present verbatim at the tip, each at `git grep -c -F` = 1.
  ⭐⭐ **EM-B3f — BUILT, NOT LANDED** (staged on `em-t11-b3f-2026-09-21`, READ-ONLY; its three paths intersect this packet's nine at **∅**). **AN ORDERING DEPENDENCY, NOT AN IMPORT, and the reason is this packet's own.** Every EM-B3f fact below is CONFIRMED against its STAGED BYTES (`git show :src/lib/accountData.js`), as version 4 did for EM-A1. It closes the LAST export seam, in its own words: *"`capturePulseSnapshot` embeds a WHOLE settlement per campaign member … and a PAUSED advance parks that snapshot on the campaign record itself … `preflightAccountExport` then puts `campaigns` into the payload unprojected — so a strip that reaches only `savedSettlements` leaves a paused realm's export carrying the DM's private layer for every member, while the live settlement beside it is clean."* It adds two module-private helpers — `withoutSnapshotEditState` and `withoutParkedSnapshotEditState` — and ⛔ **moves no symbol this packet names**: `withoutEditKeys`, `withoutEditState`, `preflightAccountExport` and `buildAccountExport` each survive its staged edit VERBATIM, measured against the staged blob, so no `requiredSymbols` row of this packet is disturbed by it.
  ⇒ ⛔ **THIS PACKET IS THE FIRST WRITER OF `dmLayer`, SO EVERY WAY OUT MUST BE SEALED BEFORE IT WRITES.** EM-B3e sealed the restored snapshot; EM-B3f seals the parked campaign snapshot. Both are ORDERING dependencies; nothing here imports either; and A5b is the arm that proves the seal at runtime with a REAL layer.
  ⛔⛔ **EM-V10 — READY, AND IT IS THIS PACKET'S PLACEMENT BLOCKER** (the executed proof is the placement law below, and §2.4's train measurement): it holds `tests/lib/editTravel.test.js`, the ONE path it shares with this packet, so the two may not ride one train and this packet's entry may not be added to `PACKET_MANIFEST.json` until EM-V10 is LANDED. EM-V10 rides train EM-T11; **this packet rides train EM-T12.**
  ⚠ **The rows below are version 4's, kept as the record of what was measured then:** **EM-A1 version 5.2**
  **EM-B1a version 7** (`src/domain/edit/operations.js` — `makeOp` · `validateOp` · `OP_TYPES`; it keeps **fourteen** home ops and the three `rename-*` rows left with EM-B1c, so `rename-npc` is EM-B1c1's and §2.4's measurement stands; `makeOp` FLATTENS `requires`, which this packet neither reads nor passes) · **EM-B2a1 version 2.1** (`src/domain/edit/dmLayer.js`, ⭐ **ARITY THREE** — `applyEdit(layer, op, declarations)`, the chair's judgment 77 of 2026-09-21; version 2 of EM-C4a called the retired arity-two shape; its op shape `{ kind, key, cardType, field, value }` and `APPLY_EDIT_REASONS` are re-quoted verbatim in §6.1 step 6) ·
  ⭐⭐ **THE PLACEMENT LAW, RE-EXECUTED AT `80e855f26`, AND ITS BLOCKER HAS MOVED FROM EM-B3e TO EM-V10.** The tip's own validator reserves a change path for every NON-TERMINAL packet (`implementation-packets.mjs:921`, `reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status))`; `:44`, `TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED'])` — so **a DRAFT reserves it too**). ⚠ **VERSION 4 CITED `:828`; the line is `:921` at this tip, and version 4.1 re-addresses it** (judgment 124). ⛔ **EM-B3e IS LANDED, SO IT IS NO LONGER THE BLOCKER.** EXECUTED on a scratch estate built from the tip by `git archive`, with this packet's capsule appended as its entry: the CONTROL run is `valid: 210 packets (4 READY)`, **exit 0**; with this packet's entry present and EM-V10 at READY the validator refuses — **`duplicate change path across packets: tests/lib/editTravel.test.js (EM-V10, EM-C4a)`, exit 1**; with EM-V10 flipped to LANDED and nothing else changed, that error is GONE and the only EM-C4a rows left are the two the chair's own promotion stamp answers (`verifiedBase … packet=null`, from `__BASE__`; and the absent INDEX row). ⇒ **this packet's entry may not be added to `PACKET_MANIFEST.json` until EM-V10 is LANDED** (not merely built), and the two can never ride one train. The same rule is why EM-B3d and EM-B3e, which also held that path, each had to reach LANDED first — they did, at `7f0621fdb` and `49a5f1e01`. ⭐ **AND NOTHING ELSE CONTENDS:** in the same run `scripts/mutation-coverage-manifest.json` is ROW-KEYED (`ROW_KEYED_REGISTERS`, `implementation-packets.mjs:67-70`), this packet's row declares its `rowKey`, and **no other non-terminal packet in the manifest holds that path at all** (measured: zero).
  **EM-A2a** is NOT a dependency of this packet (§2.4's measurement) — it is EM-D0's, because pools
  are resolved by the modal, never by the store's writer. Every dependency is an IMPORT of a file a
  sibling CREATEs, so each is satisfied at validation by `fileExists` and at acceptance by the
  sibling having LANDED. The nine symbols are carried in `_pendingRequiredSymbols`, never as
  `requiredSymbols` rows (interim rule 3: the array form refuses twice).
- **Collision group:** `src/application/commands/standardCommandRegistry.js` (EM-C4b, EM-E1) ·
  `tests/application/commands/commandRegistry.walker.test.js` (EM-C4b) ·
  `scripts/mutation-coverage-manifest.json` (EM-A3, EM-B1b, EM-B2a4 among the packets still WAITING
  in the kit) · ⭐⭐ **`tests/lib/editTravel.test.js` (EM-V10, READY — the one LIVE collision, and it
  is a PLACEMENT blocker, not a merge conflict; see the placement law above).**
  ⭐ **VERSION 4.1 RE-MEASURES THE REGISTER ROW AND IT IS UNCONTENDED:** TOOL-27 has landed, so
  `scripts/mutation-coverage-manifest.json` reserves BY ROW KEY, and at the tip **no non-terminal
  packet in the manifest holds that path at all** (EM-A1 and EM-B1h, version 4's two live holders,
  are both LANDED). Version 4's "SIX waiting packets" was the KIT's count, not the manifest's, and is
  restated here as such.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. The eager first-paint graph (269 members, by importing
  `vite.config.js`'s own export), the application-command boundary (nine files read whole), the
  store's lazy idiom (four entry/body pairs), the canon read (`src/domain/campaign/canon.js`), the
  `editMode` collision (⭐ **47** hits at `80e855f26`, 43 at `bdbf7c89c` — a dated pair; the
  population is a context measure and no arm of this packet asserts an absolute over it), the
  record-class register's walker (arms read at source) and the
  governing test set (by `git grep -l`). Receipts in `EM-C4a.evidence.md`, `00-COMMAND-BOUNDARY.md`
  and `01-FIRSTPAINT.md`.
  ⭐ **VERSION 2 adds four measurements**, all at `bdbf7c89c`: `src/store/settlementRenameHelpers.js`
  read **WHOLE** (444 lines) — the declared writer's signature, its canon lock, its active-save
  scope and the divergence comment it records as fixed; `src/store/settlementPendingEdits.js`'s
  `applyRename` read whole — the estate's OWN id→index resolution, its `await` and its read-back,
  with the reason strings this branch reuses; `npcFor`'s exactly-one-match guard; and the
  `renameNPC` governing test set. Receipts in `EM-C4a.v2.evidence.md`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR;
  ⭐⭐ **VERSION 4.1 RE-MEASURES IT AT THE TIP** — `shasum -a 256` over
  `git show HEAD:docs/implementation/preambles/EM-PREAMBLE.md` prints
  `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c`, **THE FIFTH AMENDMENT**
  (`fead56357`, re-spelled at `252d7ba4e`), and it matches the `Preamble` row every placed EM-T11
  member carries. Version 4's `c9f33c8d…` is superseded.)
  > ⛔ **THE INTERIM-RULES ROW IS STRUCK** (version 4.1): the fifth amendment has LANDED and
  > SUPERSEDES `COMPILE-RULES.interim.md`, so that sheet no longer governs anything and a row saying
  > it does is a false claim about the estate. Every rule this packet obeys is now the amendment's;
  > nothing it obeys has changed.

---

## §1 · Reconciled authority

| source | item | what it rules for this packet |
|---|---|---|
| charter, amendments of 2026-09-19 14:5x | the **EM-C4a** row | `editSlice.js`; `editMode` (transient); the ONE generic adapter in the command registry; plain-edit application on a draft; `selectCanonState`. C `src/store/editSlice.js`; M `standardCommandRegistry.js`, `src/store/index.js`; T `tests/store/editSlice.test.js`, `tests/lint/editMutationPath.walker.test.js` |
| charter, amendments of 2026-09-19 16:2x | **EM-D0 NO LONGER WAITS ON RE-DERIVATION** | "D0's plain edits are RECORD WRITES through the op boundary — `set-field` on the NPC's held fields, the rename through the existing cascade, the annotation — with no pipeline re-entry at all." ⇒ **`rederive` is NOT called by this packet** (§6.4) |
| charter, train **EM-T7** | the stop | "⛔ EM-C4a IS THE FIRST WRITER of `dmLayer`: its packet carries the arm EM-B3a could not — a REAL written layer run through EM-B3a's travel tests — and a red there is ITS stop" ⇒ acceptance A5b |
| design **§2.3** | one mutation path | "Ops apply only through the existing store writers via the lazy application-command boundary the Surveyor already uses; **there is no second path**" ⇒ §6.2 and the §6.3 walker |
| design **§2.4** | the DM's layer | corrections live in a persisted overlay keyed by entity id and field in a `dm:` namespace; the seed's derivation is never edited ⇒ the layer is written beside the record, never instead of it |
| design **§2.5** | the registry | persisted, ordered — ⛔ **NOT THIS PACKET**. A draft's plain edit takes **no registry entry** (§20.2) |
| design **§2.6** | ⛔ **THE CANON RULE** | "a settlement that is NOT canonized takes plain edits that apply on Save; a CANONIZED settlement turns every edit into an event" ⇒ §6.1's `selectCanonState` and acceptance A2 |
| design **§3** | the surfaces | "**Anonymous drafts never see it**" ⇒ §2.5: the enforcement is EM-D0's surface gate plus the executor's own identity check; this packet adds one typed refusal, no surface |
| the chair | **ruling 1 on EM-D0**, 2026-09-20 ~22:15 (judgment 39) | *"EM-C4a v2 = one added branch that routes a `free-cascade` field to its DECLARED writer (`renameNPC`), never a second cascade."* ⇒ **§6.1a**, and this version exists for that sentence |
| design **§20.2** | the two free kinds on canon | `free` and `free-cascade` apply on Save even on canon and take no registry entry. ⛔ **VERSION 2 REFUTES THIS FOR `free-cascade`, BY MEASUREMENT** — the estate's shipped writer freezes an NPC's name at canonization (`settlementRenameHelpers.js:425-427`, *"Campaign-clock identity lock"*), so the clause cannot be honoured by the writer the design itself points at. §6.1a refuses a canon `free-cascade` edit with the already-closed `canon_locked`; **§20.2 stays true for `free`** (an annotation writes no record and freezes nothing). The one clause owed is the OWNER's (§12, Q1) |
| design **§20.4** | the first door | "plain edits through the real op boundary … behind `TIER_GATE.premium.editMode`" ⇒ §2.5 |
| chair ruling, 2026-09-20 ~21:00, item 3 of the correction | hub files | a file with > ~25 test importers takes the grep of the CHANGED SYMBOLS in sealed `checks`, with the importing directory in §10 ⇒ §10 (and moot under SHAPE A) |
| interim rules 1, 2, 4, 8, 9, 10 | the estate's law tonight | §7's deferred rows, the unskippable membership probe, CREATE for new test files, sealed `checks` naming FILES and ending with the validator, every register figure as a DELTA, and the browser suite stated as NOT governing |
| ⭐⭐ **VERSION 4.1: THESE RULES NOW LIVE IN THE FIFTH AMENDMENT** (`EM-PREAMBLE.md`, SHA-256 `fdecd426…`), which has LANDED and supersedes `COMPILE-RULES.interim.md`. The interim numbers are kept below as the estate spelled them when this packet was compiled, each re-executed at `80e855f26` in §7; their permanent homes are **§P9(f)** (the count law), **§P2.16** (line-addressed registers), **§P2.11 / §P2.10** (the byte arm and a member's bundle closure), **§P2.2** (a CREATE under an enforcer directory) and **§P2.17** (the tuning inventory). Interim rules **12, 13, 14, 15, 16, 17** | the count law · line-addressed registers · one byte-arm holder per train · a CREATE under an enforcer directory · a renamed binding · ⭐ the tuning inventory and the wiring census's two red arms | **17** — measured with the library's OWN counters at the read tip: `TREES_P2P3 = ['src/domain', 'src/generators']` and every one of this member's four `src/` rows lies outside both, so P2 and P3 cannot move (`EM-C4a planned paths COUNTED: NONE`, against a planted control that WAS counted); and this member CREATEs no `.js` leaf under either root, so the wiring census gains no red arm (§7's statement block). **12** — §7's row text, §9's matrix and the capsule state the SAME numbers, every case names its home file and that file's authorizing row, and `EM-C4a.count-prover.mjs` ships beside the packet (§7's statement block). **13** — measured `none found`. **14** — this member is **NOT** the train's byte-arm holder and carries no `tests/build/**` row; its predicted per-closure deltas are in §7. **15** — `tests/lint` IS an `ENFORCER_DIRS` member at the read tip, so the walker CREATE's `scripts/mutation-coverage-manifest.json` row and `tests/lint/mutationCoverageManifest.test.js` in `checks` are both carried. **16** — this member renames and re-shapes no binding |

---

## §2 · Outcome

### §2.1 What this packet delivers
A DM editing a **DRAFT** settlement's NPC card presses Save; one typed op travels the estate's
**existing** application-command boundary — envelope → executor → registered spec → the store's
injected writer — and comes back as a receipt. The record carries the edited value, the DM's layer
records that the field is the DM's, and nothing re-enters the generation pipeline. On a **CANONIZED**
settlement the same act is refused with one closed, typed reason, because there the act is a decree
and decrees are EM-C4b's.

**Definition of done:** exactly one new command kind is registered; exactly one new dispatch file
exists and is declared in the walker's frozen surface; `applyPlainEditToDraft` is the ONE named
writer of the edited state; `selectCanonState` delegates to the estate's own `isCanonSave`; the
walker convicts any other `src/` writer of an edit; and the eager first-paint closure grows by
**ZERO modules**, proved by a probe that imports the set and reads no `dist`.

### §2.2 ⛔ THE FIRST-PAINT MEASUREMENT, AND WHY `src/store/index.js` IS NOT MODIFIED

MEASURED (receipt: `01-FIRSTPAINT.md`; harness `fp-c4a.mjs`, tree from `$READ_TIP` with no default):

```
EXPORT KIND: Set   EAGER COUNT: 270   (at 80e855f26; 269 at bdbf7c89c and at 429141e2d)
   EAGER   src/store/index.js · settlementSlice.js · uiSlice.js · settlementPendingEditActions.js …
   not     every src/application/commands/** file (0 of 270)
   not     every src/domain/edit/** file (0 of 270) — ⭐ STILL ZERO THOUGH dmLayer.js AND
           fieldDeclarations.js ARE NOW REAL: both LANDED LAZY, which is what §6.1's import list
           needs, and version 4.1 re-executed it rather than inheriting it
```
⭐⭐ **VERSION 4.1 · THE FIGURE IS A DATED PAIR AND THE LOAD-BEARING CLAIM IS MEMBERSHIP.** The eager
set is **269 at `bdbf7c89c` / `429141e2d` and 270 at `80e855f26`** — it moves under the programme, no
arm of this packet asserts it as an absolute, and this member's own figure is the DELTA `N → N`. What
IS asserted was re-executed at the tip by `checks` #10's own probe (which IMPORTS
`EAGER_FIRST_PAINT_MODULES` and reads no `dist`): **all seven named modules ABSENT**, `src/main.jsx`
present, `src/application/commands/**` at **0**, `src/domain/edit/**` at **0**,
`standardCommandRegistry.js` NOT a member, `settlementRenameHelpers.js` a member and
`src/domain/factionRename.js` NOT one — exactly the pair §5 and A5 rest on. **Probe exit 0.**
`vite.config.js:277 computeEagerModuleGraph()` walks **static edges only** ("a dynamic import stays
a lazy boundary" — its own comment). ⇒ **a static `import { createEditSlice } from './editSlice.js'`
in `src/store/index.js` makes `editSlice.js` eager, and anything it statically imports eager with
it.** The store's own idiom for a lazily loaded slice is THIN-ENTRY / LAZY-BODY
(`npcVerbsSlice.js` + `npcVerbsBody.js`, and three more pairs) — the entry is **still eager**. There
is **no runtime slice-installation precedent anywhere in `src/`** (`git grep -E
"create[A-Z][A-Za-z]*Slice\("` finds callers only in `index.js`, the campaign test runtime and
`campaignSlice.js` itself; `git grep -E "\.setState\("` finds only React and one JSDoc line).

⇒ **The charter's `M src/store/index.js` costs +1 eager module at minimum. Interim rule 2: a rise in
the eager first-paint closure is a STOP for the OWNER.** So this packet is compiled to the smallest
lawful shape that costs **+0 modules and +0 eager bytes**:

> **SHAPE A.** `src/store/editSlice.js` is created as a **LAZY leaf** that no eager module imports
> and that `src/store/index.js` does not compose. The transient mode rides `uiSlice.js`'s
> **already-shipped** generic bag — `setUserPref(key, value)` / `getUserPref(key)` at
> `src/store/uiSlice.js:78-89` — under the key `editorMode`, so **no eager file is edited at all**.
> `userPrefs` is CONFIRMED transient: it appears nowhere in `src/store/persistProjection.js`, and
> `uiSlice.js`'s own header names `displayPrefsSlice` as "uiSlice's persisted counterpart".

Two alternatives were measured and are recorded, not taken: **SHAPE B** (the charter literally;
+1 eager module; the owner's STOP) and **SHAPE C** (a named `editorMode` key and setter added to the
eager `uiSlice.js`; +0 modules but +~200 B of eager source; the smallest possible rise, and it buys a
typed key instead of a string in a generic bag). ⚠ **The choice between A and C is the chair's**
(§12, Q1).

### §2.3 ⛔ THE NAME COLLISION, RULED
`editMode` as a store key is **TAKEN**: `src/store/settlementSlice.js:806-808` ships
`editMode: false`, `setEditMode`, `toggleEditMode` — the live Cartographer "Edit Dossier" boolean,
read off the store by `SettlementDetail.jsx:219` and `components/new/npcComponents.jsx:196` and
threaded as a prop into `EditableText.jsx`, `SettlementDetailActions.jsx`, `SettlementDossierHero.jsx`
and `useNextActionRailHandlers.js`; ten test files pin its behaviour. `settlementSlice.js` is EAGER.
⇒ **the architected key is `editorMode`, carrying VALUES and never a boolean**
(`EDITOR_MODES = ['off', 'plain']`; `'decree'` joins it at EM-C4b). **The shipped boolean is left
exactly alone**, and it is carried as a `requiredSymbols` row so that any edit to it is visible to
the sealed dispatch. `TIER_GATE.premium.editMode` does **not** exist
(`src/store/authSlice.js:82-86`); **EM-D0 creates it** and this packet neither creates nor reads it.

### §2.4 WHAT THIS PACKET REALLY DEPENDS ON (measured, not inherited)
The NPC card's three edits at the first door:

| the edit | what it needs | verdict |
|---|---|---|
| **a held field** (`set-field` on an NPC's role, disposition, …) | EM-B1a's `makeOp`/`validateOp`/`OP_TYPES` + EM-A1's `declarationsFor` (to prove the field is declared) + EM-B2a1's `applyEdit` (to record the override) | **all three must have LANDED** |
| **the annotation** (a free note) | design **§14 kind 4**, verbatim: "Annotation — the free notes; **the DM's layer only**; the flavor census proves nothing reads them" | ⇒ **YES, the annotation truly needs `dmLayer.js`.** It is the one edit with NO record write, so EM-B2a1 is load-bearing and not merely convenient. CONFIRMED against design §14 |
| **the rename** | ⭐ **VERSION 2, RULED.** The op type is **EM-B1c1's** (the one-row slice the chair ruled beside this version); the WRITER half was this packet's gap and §6.1a closes it. Version 1's row said *"NOT THIS PACKET'S GAP, but it is EM-D0's"* and named the measurement §12 Q2 put to the chair; the chair answered it (judgment 39) | ⛔ **THE OP TYPE IS NOT A DEPENDENCY OF THIS PACKET.** §6.1a is keyed on the DECLARATION's `kind`, never on an op type, so this version lands whether or not EM-B1c1 has: with no `rename-npc` row, `validateOp` refuses at step 3 (`invalid_op`) and the branch is never reached. **EM-B1c1 and EM-C4a v2 may land in either order; only EM-D0e needs both** |

**EM-A2a is not a dependency.** Pools are the modal's business: the store's writer takes a value that
is already chosen and asks only whether the field is DECLARED. Nothing in §6 resolves a pool.
**Placement order — ⭐⭐ VERSION 4.1 RE-STATES IT AGAIN, AND THE TRAIN HAS MOVED** (the chair's
judgment 110 re-roster, 2026-09-21 09:1x, which supersedes judgment 90's for this member; judgment
33's serial list is kept as the working order it was). **Trains EM-T9 and EM-T10 have LANDED
LOCALLY** (`5a6d7f1fc`); **train EM-T11 is IN PROOF** — EM-B1a v11 · EM-B3f v3 · EM-A2a v8 · EM-V10
v3 placed READY, with EM-B2a2 v3 and TOOL-33 beside them; **⭐ THIS PACKET RIDES TRAIN EM-T12**, with
EM-B1c1 v3 · EM-B1b · EM-B2a3, then EM-T13's EM-D0e · EM-A2b — the door. Version 4 said EM-T11; that
is superseded, and the validator's own refusal below is why.

⭐⭐ **THE PATH-DISJOINTNESS TABLE, RE-INTERSECTED AT `80e855f26` AGAINST EVERY LIVE SIBLING —
EXECUTED OVER THE KIT CAPSULES AND THE MANIFEST, NOT INHERITED:**

| sibling | its change paths | ∩ EM-C4a's nine | verdict |
|---|---|---|---|
| **EM-V10** (READY, EM-T11; staged build `eb8402184`) | `tests/components/editFields.test.jsx` · `tests/components/primitives/editorHalo.test.jsx` · **`tests/lib/editTravel.test.js`** | **ONE** | ⛔ **THE BLOCKER.** The validator refuses the pair by name (the placement law above). EM-V10 lands FIRST; **A5b is written against the file EM-V10 leaves** (§7's row) |
| **EM-B1c1 v3** (EM-T12, the same train) | `src/domain/edit/operationsNpcRename.js` · `src/domain/edit/operations.js` · `tests/domain/editOperations.test.js` | **∅** | may ride one train; and §2.4's row below is why neither is the other's dependency |
| **EM-B3f v3** (READY, EM-T11; staged) | `src/lib/accountData.js` · `tests/lib/accountData.test.js` · `tests/lint/snapshotPromotion.census.walker.test.js` | **∅** | ORDERING only (`Depends on`); ⭐ its staged edit moves NO symbol this packet names |
| **EM-B1a v11** (READY, EM-T11; staged) | `src/domain/edit/operations.js` · `src/domain/edit/worldConditions.js` · `tests/domain/editDeclarations.test.js` · `tests/domain/editOperations.test.js` · `tests/domain/relationshipCompatibility.test.js` | **∅** | a PROVIDER, not a collision; its three pending rows are this packet's last provider gate |
| **EM-B2a2 v3** (EM-T11, own branch `786ee593f`) | `src/generators/pipeline.js` · `src/generators/steps/generatePopulation.js` · `tests/generators/pipelinePinnedMode.test.js` | **∅** | no relation |
| **EM-A2a v8** (READY, EM-T11; staged) | `src/domain/edit/pools.js` · `tests/domain/editPools.test.js` | **∅** | not a dependency (the row above) |

⭐ **AND THE ROW-KEYED REGISTER IS UNCONTENDED:** none of the six names
`scripts/mutation-coverage-manifest.json` at all, and no non-terminal packet in the manifest holds it
either, so this member's one row (`invariants['tests/lint/editMutationPath.walker.test.js']`, absent
from the register at the tip: `grep -c editMutationPath` → **0**) reserves against nobody.
Validation at placement needs only `fileExists` for the three imported CREATE targets.

### §2.5 ANONYMOUS DRAFTS, AND WHOSE ENFORCEMENT IT IS
Design §3: "Anonymous drafts never see it." **The enforcement is EM-D0's, twice over, and this
packet adds a third line of defence it does not own:**
1. `TIER_GATE.premium.editMode` — EM-D0's new field; `anon` is not `premium`.
2. `TIER_GATE.anon.maxSaves: 0` (`authSlice.js:83`) — an anonymous visitor has no library row to
   press Edit on. This is INDEPENDENT of the new gate and already shipped.
3. **This packet:** the executor's `checkCommandIdentity` already refuses a command whose
   `ownerRef.ownerKey` or `targets.saveId` has no live context, with `owner_context_missing` /
   `save_context_missing`; the adapter's `validate()` requires both, so a plain edit with no owner
   and no save **cannot reach a writer**. That is structural, not a surface check.

### §2.6 In scope / out of scope
**In:** the lazy store leaf; the one generic adapter; the one lazy dispatch seam; the registry row;
`selectCanonState`; the transient mode's read/write through the shipped pref bag; the mutation-path
walker; the travel arm with a real written layer; ⭐ **version 2's ONE branch** (§6.1a) — the
`free-cascade` route to the declared writer, its `await`, its read-back and its one added reason.
**Out:** ⛔ any pipeline re-entry or call to `rederive` (§6.4); the decree registry and its actions
(EM-C4b); `selectGuards` (EM-C4b); pools (EM-A2a); any component, route or surface (EM-D0);
`TIER_GATE.premium.settlementEditor` (EM-D0b); persistence of the layer into the save (EM-B3);
moving `dmLayer` out of `NOT_YET_WRITTEN_KEYS` (§5's measurement; SLOT: EM-B3);
⛔ **any change to the cascade itself, any second cascade, any partner-save walk** (§6.1a's
"noticed and not touched": the shipped store writer reaches the HOST save only, which is the
estate's pre-existing reach and not this packet's to widen — SLOT and measurement in §12).

---

## §3 · Hard scope budget

| limit | this packet | cap |
|---|---|---|
| behaviour families | 1 (a plain edit applies on a draft) | 1 |
| new persisted record families | 0 — the layer's persistence is EM-B3's | ≤1 |
| named writers for the one state that changes | **1** (`applyPlainEditToDraft`) ⭐ **and version 2 mints no second**: for a `free-cascade` field the RECORD's writer is the estate's already-named, already-shipped `renameNPC`, which §6.1a CALLS and does not re-implement — the single-writer law honoured by delegation, which is the whole reason the branch exists | exactly 1 |
| feature flags | 0 | ≤1 |
| user-facing surfaces | **0** (headless) | ≤1 |
| direct production consumers | 1 (EM-D0's dialog, not yet written) | ≤2 |
| **new logic-bearing production leaves** | **3** ⚠ **OVERRIDE REQUESTED, 2 → 3** | ≤2 |
| existing logic-bearing production files modified | **0** | ≤3 |
| registration-only production files touched | **1** (`standardCommandRegistry.js`: one import, one array element) | ≤3 |
| handwritten files total | **12** (⭐ v4.2: the reviewed-pin TEST row; ⭐ v4.3: the two dormancy-arm TEST rows — AT the cap) | ≤12 |
| new/changed effective production lines | **≈ 205 estimated** (editSlice ≈ 120, adapter ≈ 60, runtime ≈ 23, registry +2) | ≤400 |
| each new production leaf | editSlice ≈ 120 · adapter ≈ 60 · runtime ≈ 23 | ≤250 each |
| shared / hot-file delta | `standardCommandRegistry.js` **+2** | ≤15 |
| named acceptance cases | **8** | ≤8 |

⚠ **THE ONE OVERRIDE, STATED AND NOT RENEGOTIATED QUIETLY.** Three new leaves are structurally
forced, not chosen:
1. `standardCommandRegistry.js` statically imports every adapter spec, and `sessionCommandRuntime.js`
   statically imports `standardCommandRegistry.js`. **Folding the dispatch runtime into the adapter
   spec would close that import cycle.** The estate already pays this exact price:
   `adapters/pendingEditCommit.js` (the spec) and `pendingEditCommitRuntime.js` (the dispatch) are
   two files for this reason.
2. The adapter reaches a store writer **only** through `context.actions` (`commandContext.js`'s
   whole purpose: "Keeping the two separate prevents callbacks or store references from leaking into
   queues, logs, or server payloads"). So the writer cannot live under `src/application/`, and the
   charter's `src/store/editSlice.js` is the third file.
**The chair approves 2 → 3 or refuses; there is no third shape.** Precedent: EM-B3d's approved
override (modified logic files 3 → 4, direct consumers 2 → 3).

**Hot files:** none. `src/store/index.js` is the family's known hot/hub file (271 test importers) and
SHAPE A does not touch it.

---

## §4 · Sealed dispatch and preflight

A dry read of `scripts/implementation-session.mjs`'s checks at the tip:
- **branch name** — the chair's; the packet asserts nothing.
- **ancestry** — the chair sets `Verified base` to the integration tip at promotion; the `__BASE__`
  placeholder is replaced there and nowhere else.
- **substrate unchanged since the verified base** — every `requiredSymbols` path is read-only to this
  packet except `standardCommandRegistry.js`, whose required line survives verbatim (§5's post-edit
  simulation).
- **CREATE targets absent** — ⭐ **VERSION 4.1 RE-VERIFIES ALL FIVE AT `80e855f26`**: `git ls-tree -r
  --name-only HEAD -- <path>` returns ZERO rows for each of `src/store/editSlice.js`,
  `src/application/commands/adapters/plainEditApply.js`,
  `src/application/commands/plainEditRuntime.js`, `tests/store/editSlice.test.js` and
  `tests/lint/editMutationPath.walker.test.js` (§ header's revalidation sentence).
- **git-clean** — the lane wrote nothing in any tree.
⚠ **SEALED DISPATCH WANTS THE WORKTREE ON THE VERIFIED BRANCH.** The build lane holds the
integration branch in its own worktree; the chair's worktree stays detached at the tip.

---

## §5 · Verified tree contract

⭐⭐ **VERSION 4.1 RE-PROVED EVERY ROW AT `80e855f26` BY `git grep -c -F` = 1, AND THE TABLE GREW BY
SIX** — version 4's twenty rows plus the six `_pendingRequiredSymbols` rows whose providers have
LANDED (EM-A1 and EM-B2a1), which interim/amendment practice discharges into `requiredSymbols` the
moment the provider lands (EM-B1c1 version 3's own precedent: *"EM-A1 is LANDED … so its pending
typedef row is discharged"*). **TWENTY-SIX rows, each at count 1.** The three EM-B1a rows
(`makeOp`, `validateOp`, `OP_TYPES` on `src/domain/edit/operations.js`) STAY in
`_pendingRequiredSymbols`: that file is still ABSENT at the tip (`git ls-tree src/domain/edit` lists
only `dmLayer.js`, `fieldDeclarations.js`, `recordRegister.js`, `types.js`), so a row asserting them
would refuse at validation. (Version 4's receipts, at `bdbf7c89c`, are in `EM-C4a.evidence.md`
§E1–E9 and `EM-C4a.v2.evidence.md`.)


⭐ Every row here was proved by `grep -c -F` = 1 at `bdbf7c89c` and RE-PROVED by `git grep -c -F` = 1
at `80e855f26`.

| what | path | symbol (verbatim) | why it must not move |
|---|---|---|---|
| ⭐ **v4.1 · DISCHARGED — the layer's application** | `src/domain/edit/dmLayer.js` | `export function applyEdit` | EM-B2a1 has LANDED; §6.1 step 6 and §6.1a step 6 call it at ARITY THREE, and a move in its arity or its op shape is §11 STOP 5 |
| ⭐ **v4.1 · DISCHARGED — the layer's read** | `src/domain/edit/dmLayer.js` | `export function layerRead` | §6.5's *read* path; own-property only, never a throw |
| ⭐ **v4.1 · DISCHARGED — the empty layer** | `src/domain/edit/dmLayer.js` | `export const EMPTY_DM_LAYER` | §6.5's absence rule: an absent layer reads as this, deeply frozen |
| ⭐ **v4.1 · DISCHARGED — the leaf's refusal set** | `src/domain/edit/dmLayer.js` | `export const APPLY_EDIT_REASONS` | A3 asserts `APPLY_EDIT_REASONS ⊆ PLAIN_EDIT_REFUSALS`, so the two sets can never drift; a fourth member there is §11 STOP 5 |
| ⭐ **v4.1 · DISCHARGED — the consult (rows)** | `src/domain/edit/fieldDeclarations.js` | `export function declarationsFor` | §6.1 step 4's declared-field proof and §6.1 step 6's injected consult; it returns the shared frozen empty array for an unknown card type and never throws |
| ⭐ **v4.1 · DISCHARGED — the consult (card)** | `src/domain/edit/fieldDeclarations.js` | `export function isEditableCard` | the other half of the same injected consult |
| the dispatch entry | `src/application/commands/sessionCommandRuntime.js` | `export function executeSessionCommand(command, context)` | the runtime calls it; the walker's dispatch-surface census keys on this name |
| the registry | `src/application/commands/standardCommandRegistry.js` | `export const standardCommandRegistry = createCommandRegistry([` | the MODIFY adds an element INSIDE the array; this line survives verbatim |
| the registry factory | `src/application/commands/commandRegistry.js` | `export function createCommandRegistry(initialSpecs = [])` | `checkedSpec()` is what refuses a malformed new spec |
| the envelope | `src/application/commands/commandEnvelope.js` | `export function makeCommandEnvelope` | the kind census is anchored on this factory; an envelope built any other way is invisible to it |
| deterministic identity | `src/application/commands/commandEnvelope.js` | `export function commandIdForValue` | the command id is derived, never random — the journal's replay depends on it |
| the status vocabulary | `src/application/commands/commandReceipts.js` | `export const COMMAND_STATUS` | the adapter returns its members |
| the persistence vocabulary | `src/application/commands/commandReceipts.js` | `export const PERSISTENCE_STATE` | the adapter's receipt declares `NOT_REQUIRED` (EM-B3 persists) |
| ⭐ the canon read | `src/domain/campaign/canon.js` | `export function isCanonSave(save)` | `selectCanonState` delegates to it; re-typing the phase comparison is the defect §6.1 exists to prevent |
| the transient bag (write) | `src/store/uiSlice.js` | `setUserPref: (key, value)` | SHAPE A's mode write; already shipped, already eager |
| the transient bag (read) | `src/store/uiSlice.js` | `getUserPref: (key)` | SHAPE A's mode read |
| ⛔ the shipped collision | `src/store/settlementSlice.js` | `editMode: false,` | **PRESERVE UNTOUCHED.** The Cartographer's boolean; the new key is `editorMode`. Carried so that an edit to it is visible to the sealed dispatch |
| ⛔ the declared absence | `src/domain/edit/recordRegister.js` | `export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);` | **PRESERVE VERBATIM** — see the discharge below |
| ⭐ **v2 · THE DECLARED WRITER** | `src/store/settlementSlice.js` | `  renameNPC: (npcIndex, newName) =>` | the ONE store action §6.1a resolves off `get()` — **by name, never by import**. Its arity is `(npcIndex, newName)`, which is why the branch resolves an id to an INDEX |
| ⭐ **v2 · the writer's body** | `src/store/settlementRenameHelpers.js` | `export async function renameNpcImpl` | ⛔ **ASYNC BY CONSTRUCTION** — it fetches the cascade at the call seam, so the branch AWAITS it. Its own JSDoc: *"this returns a PROMISE and every caller must await it before reading the result"* |
| ⭐ **v2 · the cascade it runs** | `src/domain/factionRename.js` | `export function applyNpcRenameToSettlement` | the ONE writer of all five `NPC_RENAME_SURFACES`; the branch calls it only THROUGH `renameNPC` and imports it nowhere |
| ⭐ **v2 · the five surfaces** | `src/domain/factionRename.js` | `export const NPC_RENAME_SURFACES` | A1's cascade arm reads this frozen list rather than re-typing five paths (`contractTestAntiVacuity` Rule 2) |
| ⛔ **v2 · THE REASON'S ONE SPELLING** | `src/store/settlementPendingEdits.js` | `      : { ok: false, status: 'failed', reason: 'rename_not_applied' };` | the estate ALREADY derived this reason from this writer; version 2 reuses the spelling instead of minting a second, and A3 scans this file so the two can never drift |
| ⭐ **v2 · the id→index precedent** | `src/store/settlementPendingEdits.js` | `    await get().renameNPC?.(index, payload.newName);` | the whole idiom §6.1a copies: resolve, refuse, AWAIT, read back. Its own comment names the hazard the await removes |
| the enforcer dirs | `tests/lint/mutationCoverage.shared.mjs` | `export const ENFORCER_DIRS` | it is why the new walker owes a mutation-coverage row |
| the eager set | `vite.config.js` | `export const EAGER_FIRST_PAINT_MODULES` | the membership probe imports it; a replica would drift silently |

**`retiredSymbols`: EMPTY.** Post-edit simulation (pre-proof step 10), row by row: thirteen rows sit
at paths this packet does not write; the fourteenth (`standardCommandRegistry.js`) is modified, and
the edit inserts an import line above and an array element below the required line, which is
therefore still present verbatim after the packet's own edits. No other LANDED packet's row for any
of these pairs is disturbed.

### ⛔ THE `NOT_YET_WRITTEN_KEYS` DISCHARGE (EM-B3d's Q4, owed to this compile) — **NOT OWED. MEASURED.**
`tests/lint/recordRegisterTotality.walker.test.js` was read at source. Its A1 arm builds every record
it inspects with `generateSettlementPipeline` (`:77`, `:121`), and its leak check is
`for (const key of [...SAVED_ONLY_KEYS, ...NOT_YET_WRITTEN_KEYS]) if (key in row.record)` — **on a
GENERATED record** (`:219-222`). **This packet changes nothing about generation**, so the walker is
green whether or not the key moves. Moving it would break the verbatim `requiredSymbols` row that
**two** waiting siblings carry (EM-B3d, which asked the question, and EM-B2a1), each then owing a
`retiredSymbols` discharge, for **zero** behavioural gain.
⇒ **EM-C4a PRESERVES the frozen list verbatim.** The move is not deferred loosely — it has a slot:
**SLOT: EM-B3, at its compile.** `SAVED_ONLY_KEYS` means "written only by the save path", EM-B3 is
the member that persists the layer, a lawful home therefore exists there, and `editorKeys.length > 0`
(`:228`) survives on `decrees` alone. *(Deliberately deferred — documented, not a bug to re-find.)*

---

## §6 · Exact contracts

### §6.1 `src/store/editSlice.js` — the store's plain-edit half (LAZY)

```js
/** The closed transient vocabulary. VALUES, never a boolean — `editMode` is taken
 *  by the shipped Cartographer flag (settlementSlice.js:806). Frozen. */
export const EDITOR_MODES;          // readonly ['off', 'plain']   ('decree' joins at EM-C4b)

/** The key under uiSlice's shipped userPrefs bag. Exactly 'editorMode'. */
export const EDITOR_MODE_PREF_KEY;

/** The closed refusal set, EXPORTED so a test asserts it both directions rather than re-typing it.
 *  ⭐ VERSION 2 adds EXACTLY ONE member, `rename_not_applied`, and it is not a new word: it is the
 *  spelling the estate's own dispatcher already derived from this same writer
 *  (settlementPendingEdits.js:321). Seven, frozen, compareCodepoint-ordered. */
export const PLAIN_EDIT_REFUSALS;
// exactly ['canon_locked', 'invalid_op', 'no_save', 'not_a_draft_field', 'rename_not_applied',
//          'undeclared_field', 'unknown_target']

/**
 * ⭐ VERSION 2 · THE DECLARED WRITERS, AS DATA. `<card>:<field>` -> the STORE ACTION NAME the
 * adapter resolves off `get()`. ONE row today. Frozen.
 *   { 'npc:name': 'renameNPC' }
 * ⛔ THIS IS THE ONE HOME FOR THAT NAME. A domain module may not reach the store (§P4), so
 * EM-B1c1's op row names the PURE-DOMAIN cascade in its `guardsStated` and names no store action;
 * this map names the store action and names no domain path. Two facts, two layers, one home each.
 * ⛔ A `free-cascade` declaration with NO row here is refused `not_a_draft_field` — already closed,
 * and already glossed "a declaration whose kind the first door does not carry". EM-R6 adds
 * `institution:name` and EM-D2 adds `faction:faction` when their cascades exist; neither is here.
 */
export const CASCADE_WRITERS;
export const CASCADE_DISPATCH;    // ⭐ v4.2: Object.freeze({ renameNPC: (get, index, value) => get().renameNPC?.(index, value) })
                                  //   — the CALL half, by LITERAL name; keys set-equal to CASCADE_WRITERS' values (A1)

/**
 * ⛔ THE RE-DERIVATION SEAM, A TYPED NO-OP TODAY (charter 16:2x; §6.4).
 * Frozen: { kind: 'noop', owner: 'EM-B2a4', calls: 0 }. `applyPlainEditToDraft` consults it and
 * takes the no-op branch; acceptance A8 asserts it IS a no-op, which is the assertion that fails
 * the day EM-B2a4 plugs scoped re-derivation in. ⛔ Nothing here imports or calls `rederive`.
 */
export const REDERIVE_SEAM;

/**
 * ⭐⭐ VERSION 3 · THE ROOT KEY AND ITS COORDINATES, MINTED AND READ AS ONE THING
 * (the chair's judgment 77, 2026-09-21: EM-C4a is the ROOT-KEY MINTER and therefore owns the
 * pin that the key it mints names the same card type and field it passes as coordinates).
 * ⛔ THESE TWO ARE THE ESTATE'S ONLY SPELLING OF THE KEY. Version 1 named "ONE exported helper"
 * and never named it; naming it is what makes the pin assertable.
 *
 * `rootKeyFor` is the ONLY mint and it returns BOTH halves in one frozen record, so no caller
 * can spell the key and its coordinates apart; `readRootKey` is its exact inverse and is the
 * ONLY reader. `applyPlainEditToDraft` passes `coords.cardType` and `coords.field` to
 * `applyEdit` straight off the object it took `key` from — it never re-spells either.
 *
 * @param {string} cardType @param {string} entityId @param {string} field
 * @returns {Readonly<{ key: string, cardType: string, entityId: string, field: string }>}
 *   `key` is exactly `` `${cardType}:${entityId}:${field}` `` (chair ruling 3).
 */
export function rootKeyFor(cardType, entityId, field);

/** The exact inverse. A key that is not three non-empty colon-separated parts returns `null`,
 *  which the caller turns into `'unknown_target'` — it never throws and never guesses.
 * @param {string} key
 * @returns {Readonly<{ key: string, cardType: string, entityId: string, field: string }>|null} */
export function readRootKey(key);

/** @param {object} state the live store state @returns {'off'|'plain'} never undefined */
export function selectEditorMode(state);

/**
 * ⛔ THE CANON RULE'S READ (design §2.6). DELEGATES to src/domain/campaign/canon.js#isCanonSave —
 * it NEVER re-types a phase comparison, because `campaignState.phase` is one of FOUR spellings
 * `savePhase` accepts and a save carrying `canonizedAt` with no phase string is canon.
 * @param {object} state @param {string} saveId
 * @returns {{ found: boolean, canon: boolean, phase: string }}
 *   `found:false` with `canon:true` when the save is unknown — ⭐ UNKNOWN FAILS CLOSED: an edit is
 *   never applied to a settlement whose phase could not be read.
 *   ⭐⭐ VERSION 4 NAMES WHAT IT RESOLVES, and this is a clarification INSIDE the declared contract,
 *   not a change to it. For the ACTIVE save it hands `isCanonSave` the LIVE store state, which is
 *   `CanonSaveLike` by shape — `savePhase` reads `save.phase` FIRST (`canon.js:14-20`, re-read at
 *   80e855f26) and the store carries `phase` at top level — ⭐ VERSION 4.1 RE-ADDRESSES THIS TO THE
 *   DECLARATION, `settlementSlice.js:337` (`phase: 'draft',  // 'draft' | 'canon'`); version 4 cited
 *   `:1111`, a READ site (`state.phase === 'canon'`) and not the declaration the sentence names
 *   (judgment 124) — so NO phase comparison is re-typed and
 *   this read can never disagree with the declared writer's own canon lock, which reads exactly that
 *   (`renameNpcImpl`: `before.phase === 'canon'`). For any other id it reads the `savedSettlements`
 *   envelope, and an unknown id stays `found:false, canon:true`. ⛔ Reading a CACHED envelope for the
 *   active save is the defect this names: `setActiveSaveId` does not upsert the cache row, so the
 *   envelope may be absent (a false `canon_locked` on a freshly-saved draft) or stale in the other
 *   direction (the writer refuses silently on the live phase and the receipt says
 *   `rename_not_applied` — a refusal wearing the wrong reason, which is what §6.1 step 2 exists to
 *   prevent).
 */
export function selectCanonState(state, saveId);

/**
 * THE ONE NAMED WRITER of the edited state. Called ONLY by the adapter, through
 * `context.actions.applyPlainEditToDraft`. It is async so the caller's shape matches the estate's
 * other injected writers; it draws no random number, reads no clock and resolves no pool.
 * @param {StoreGet} get @param {StoreSet} set
 * @param {{ saveId: string, op: Op, rootKey: string, value: unknown }} request
 * @returns {Promise<{ ok: true, saveId: string, keys: string[], layer: DmLayer }
 *                  | { ok: false, reason: (typeof PLAIN_EDIT_REFUSALS)[number] }>}
 *   NEITHER branch throws. On `ok:false` the store is unchanged and no argument is mutated.
 */
export async function applyPlainEditToDraft(get, set, request);
```

**The ordered algorithm of `applyPlainEditToDraft`, exactly:**
1. ⭐⭐ **VERSION 4 · THE ONE `no_save` SITE (the chair's judgment 82 item 2).** Resolve the save by
   `request.saveId` — `const saveId = String(request.saveId ?? '')`, looked up by id over the store's
   own save population (`get().savedSettlements.find(s => String(s?.id ?? '') === saveId)`, the
   estate's own POPULATION and LOOKUP SHAPE — ⭐ **VERSION 4.1 RE-MEASURES IT: `savedSettlements.find`
   appears in FIFTEEN `src/` files at `80e855f26`**, `aiDossierPinActions.js:35` among them, whose
   line reads `const entry = get().savedSettlements.find(s => s.id === saveId);`. ⚠ **The `String()`
   coercion on BOTH sides is this packet's HARDENING and is not the estate's literal spelling** — a
   save id is a string in some writers and a number in others, and an uncoerced `===` would refuse a
   numerically-identified save. Version 4 called the coerced form "the estate's own spelling", which
   the re-read refutes: the POPULATION is the estate's, the coercion is ours, and saying which is
   which is the difference between a citation and a claim) — **and the resolution
   succeeds only for the ACTIVE save** (`saveId === String(get().activeSaveId ?? '')`). An empty id,
   or an id that is not the active save's, → `{ ok:false, reason:'no_save' }`.
   ⛔ **THIS IS THE ONLY SITE IN THE ALGORITHM THAT RETURNS `no_save`**, so A3's two hostile rows (a
   missing save; a `saveId` that is not the active one) can never be ambiguous about which arm fired.
   ⭐ **The active-save requirement is version 2's data-safety gate HOISTED, never weakened:** version
   3 kept it at §6.1a step 2, guarding the cascade branch alone; it now guards BOTH branches from one
   place, and §11 STOP 9 convicts its absence here. It is load-bearing because the declared writer
   reads `get().settlement` and indexes it (`settlementRenameHelpers.js:428`), so it reaches exactly
   ONE save — the active one.
   ⚠ **THE CACHE ROW IS NOT THE GATE, AND THAT IS MEASURED.** `setActiveSaveId` stamps `activeSaveId`
   and, by its own recorded byte constitution, *"does NOT upsert a full savedSettlements cache row"*
   (`settlementSlice.js:665-672`; the row appears on the next hydration) — so a freshly-saved
   settlement is ACTIVE with no cached row. The gate is therefore keyed on `activeSaveId`, and the
   `savedSettlements` row is the ENVELOPE this step reads WHEN PRESENT; its absence for the active
   save is **not** a refusal, because refusing there would refuse the first door's likeliest first
   use. The chair's ruled wording was "resolve by id over `savedSettlements`": that population is
   where the id is looked up, and the ACTIVE conjunct is what makes §6.1a's invariant true (§12 Qa).
2. `selectCanonState(get(), saveId)`; `canon === true` → `{ ok:false, reason:'canon_locked' }`.
   ⭐ **Design §20.2 scoping, AS VERSION 2 MEASURES IT:** the refusal applies to a `pool` field
   **and to a `free-cascade` field**. ⛔ Version 1 said the two free kinds both apply on canon;
   **measured, that is false for `free-cascade`** — the estate's declared writer refuses on canon
   by construction (`settlementRenameHelpers.js:425-427`, *"Campaign-clock identity lock: NPC names
   freeze at canonization"*), so sending the edit through would produce a refusal wearing the wrong
   reason. §20.2 **stays true for `free`**: an annotation writes no record and freezes nothing.
   The canon branch reads the DECLARATION's `kind` — never the op's, and never a new op property.
3. `validateOp(request.op, null)`; `ok:false` → `{ ok:false, reason:'invalid_op' }`. ⚠ `validateOp`
   REPORTS, never refuses; the refusal is this writer's act, on its report.
   ⭐ **VERSION 4 BINDS THE SECOND ARGUMENT, MEASURED against EM-B1a version 7.** Version 3 wrote
   `validateOp(request.op, world)` and this module binds no `world` — an unbound identifier in the
   exact algorithm, which the packet's own `npx eslint` check (`no-undef`) reds before any test runs.
   EM-B1a version 7's seven-step algorithm (its §8) reads its `world` parameter at **no step**: the
   steps are the op's object-ness, `OP_TYPES[op.type]`, the target's shape against the closed seven
   `EntityRef` kinds, the payload schema, undeclared payload keys, the sort and the return. The
   world half of `requires` is a list of PREDICATE IDS that decides which acts the world OFFERS —
   EM-B1a's `worldConditions.js`, folded into its own A2/A4 — and it is never a validation input
   here. ⛔ The store's plain-edit writer holds no world view and may not invent one, so it passes
   `null` EXPLICITLY at the declared arity rather than an identifier it cannot bind. **If a landed
   `validateOp` ever READS its second argument, that is §11 STOP 5** — a provider's landed contract
   differing from §6's quotation — and this call site is the declared consumer that moves with it.
4. `isEditableCard` / `declarationsFor` prove the field is declared for the card type; not declared →
   `'undeclared_field'`; card type unknown → `'unknown_target'`; a declaration whose `kind` the first
   door does not carry → `'not_a_draft_field'`.
5. ⭐ **VERSION 2'S ONE BRANCH.** If the declaration's `kind` is **`free-cascade`**, take §6.1a and
   RETURN from it. ⛔ Steps 6 and 7 below are the `set-root` path and are NOT reached for a
   `free-cascade` field: the key is never written here, because writing it is the defect (§6.1a).
6. ⭐ **VERSION 3, ARITY THREE (the chair's judgment 77):**
   `applyEdit(currentLayer, { kind: 'set-root', key: coords.key, cardType: coords.cardType,
   field: coords.field, value: request.value }, declarations)`, where `coords =
   readRootKey(request.rootKey)` — the SAME frozen record the key came out of, never a re-spelling
   — and `declarations` is the injected consult `{ isEditableCard, declarationsFor }`, supplied by
   **this module** (`src/store/editSlice.js`) from **EM-A1's `src/domain/edit/fieldDeclarations.js`,
   which this file ALREADY imports** (§7's CREATE row, version 1): ⭐ **the consult therefore adds
   ZERO import edges and SHAPE A's `+0 eager modules / +0 eager bytes` is untouched.** The pure leaf
   still imports nothing from EM-A1; the store member is the layer that is allowed to wire them.
   `coords === null` → `{ ok:false, reason:'unknown_target' }` (the same fail-closed direction the
   leaf takes on an absent consult). `ok:false` → the leaf's `reason` is returned VERBATIM
   (`APPLY_EDIT_REASONS` = `['invalid_op','undeclared_field','unknown_target']` ⊂
   `PLAIN_EDIT_REFUSALS`, asserted by A3, so the sets can never drift); the leaf's ruled refusal
   ORDER is `invalid_op` → `unknown_target` → `undeclared_field` and this writer does not re-order it.
7. one `set(...)` writes BOTH the record's edited value AND the returned layer onto the save. ⭐ ONE
   `set` — the estate's participation-view hazard is that a write born from a filtered view lands
   wholesale; here the base of the write is the SAVE, never a projection of it.
8. consult `REDERIVE_SEAM`; take the no-op branch (§6.4).
9. return `{ ok:true, saveId, keys, layer }`.

### §6.1a ⛔⛔ VERSION 2 · A `free-cascade` FIELD ROUTES TO ITS DECLARED WRITER

**WHY THE BRANCH EXISTS, in the estate's own words.** Version 1's step 5 is a `set-root`
single-key writer. An NPC's name is a JOIN KEY held on **five** surfaces
(`NPC_RENAME_SURFACES`): `npcs[].name` · `factions[].members[].name` ·
`relationships[].npc1Name` · `relationships[].npc2Name` · `interSettlementRelationships[].npcName`.
Pushing a `free-cascade` value through `set-root` writes the first and leaves four stale — the
exact divergence `src/store/settlementRenameHelpers.js:391-406` records as already fixed:

> *"the STORE lane wrote exactly `settlement.npcs[index].name` — one field, no cascade, while
> `operationRegistry` advertised that it 'carries the new name through its references'; the LIBRARY
> lane rewrote `npcs[].name`, the relationship join keys and the neighbour contacts — **but not
> `factions[].members[].name`** … at generation it is the SAME OBJECT as the `npcs[]` record, so an
> in-memory rename appears to move both, and JSON splits the alias on save. **Every RELOADED save
> therefore kept the dead name on the member chips the dossier renders.**"*

⇒ the bug is invisible in memory and appears on reload. **That is why this branch is not an
optimisation: it is the difference between a rename and a recurrence of a bug the estate already
paid to fix.**

**THE ORDERED BRANCH, exactly.** Let `coords = readRootKey(request.rootKey)` — ⭐ **VERSION 3 NAMES
THE HELPER** the chair's judgment 77 requires (`rootKeyFor` / `readRootKey`, §6.1; version 1 said
"ONE exported helper" and named none, which is why the pin could not be asserted). `coords` is one
frozen record carrying `{ key, cardType, entityId, field }` TOGETHER, and every use below reads its
fields off that one object; `coords === null` → `{ ok:false, reason:'unknown_target' }`.

1. `action = CASCADE_WRITERS[`${coords.cardType}:${coords.field}`]`; absent → `{ ok:false, reason:'not_a_draft_field' }`
   (already closed; its gloss already covers a declaration the first door does not carry); ⭐ **v4.2:** an `action` with no `CASCADE_DISPATCH` row refuses the SAME reason — the fail-closed twin of the declaration check, unreachable in a lawful build because A1 pins the two tables set-equal.
2. ⛔ **THE ACTIVE-SAVE PRE-CONDITION IS AN INVARIANT HERE, NOT AN ARM** (⭐ **VERSION 4**, the chair's
   judgment 82 item 2: ONE REFUSAL SITE PER REASON). Reaching this branch means §6.1 step 1 resolved
   the request's save **as the ACTIVE save**, so `request.saveId === String(get().activeSaveId ?? '')`
   HOLDS BY CONSTRUCTION: this step returns no reason and takes no branch. A second arm returning
   `no_save` here would be unreachable code, and A3 could not tell which of the two fired.
   ⛔ **The gate moved UPSTREAM; it was not removed, and §11 STOP 9 still convicts its ABSENCE.** It is
   a data-safety gate, not tidiness: the declared writer reads `get().settlement` and indexes it
   (`settlementRenameHelpers.js:428`), so routing a non-active save's request would hand an index
   computed from save X's roster to a writer operating on save Y and **rename a different person**.
   A3's hostile row (a non-active `saveId` → `no_save`, the declared writer asserted NOT CALLED) now
   pins §6.1 step 1, and it is the same row, at the same reason, with the same witness.
3. `index = get().settlement.npcs.findIndex(n => String(n?.id ?? '') === String(coords.entityId))`, with the
   estate's own **exactly-one-match** guard (`settlementPendingEdits.js:116-120`, `npcFor`: two
   matches is `null`, not the first). `index < 0` or ambiguous → `{ ok:false, reason:'unknown_target' }`.
   ⭐ This is also the refusal that closes EM-B1a's measured gap — `validateOp` admits any of the
   closed seven `EntityRef` kinds, so a faction id on a `rename-npc` op reaches here and is refused
   *because it resolves to no NPC*, not because a second validator was written (EM-B1c1 §13 R1).
4. ⛔ **`await CASCADE_DISPATCH[action](get, index, value)`** — ⭐ **VERSION 4.2:** the writer is reached by its LITERAL name (`get().renameNPC?.(index, value)`) through the exported one-row table, never by a computed `get()[action]`, which `tests/store/deadOperationRatchet.test.js`'s premise arm convicts — and never an un-awaited call. The writer is **ASYNC BY
   CONSTRUCTION**: it fetches the ~8.6 kB cascade at its call seam to keep it off first paint, and
   its own JSDoc says *"every caller must await it before reading the result."* The estate's
   dispatcher names the precise hazard: *"Reading the roster off the un-awaited call would score
   every real rename as `rename_not_applied` while the write still landed."* ⇒ un-awaited, the
   command returns **a FALSE REFUSAL over a REAL WRITE** — the receipt says failed and the save
   moved. A1 proves the await with a stub that resolves on a later microtask.
5. ⛔ **READ BACK, NEVER TRUST THE BOOLEAN.** The writer returns a bare `false` for five different
   causes and names none of them. Re-resolve the record and compare:
   `get().settlement.npcs` → the entity by id → `name === value` ? continue : `{ ok:false,
   reason:'rename_not_applied' }`. **That is the derivation of the one added reason from the
   writer's own contract, and the estate performed the same derivation from the same writer.**
6. ⭐ **THE LAYER STILL RECORDS THE OVERRIDE.** ⭐ **VERSION 3, ARITY THREE:**
   `applyEdit(currentLayer, { kind:'set-root', key: coords.key, cardType: coords.cardType,
   field: coords.field, value: request.value }, declarations)` — the same one `coords` record and
   the same injected consult as §6.1 step 6 — and one `set(...)` writing **the layer only** —
   the record was written and persisted by the declared writer (`persistActiveSaveEdit`, its own
   line 442). ⚠ **TWO writes, not one**, and the order is fixed: the record first (the writer's),
   the layer after the read-back confirms. A refusal at step 5 writes **no** layer, and nothing
   moved, because the writer persists only `if (changed)`.
7. consult `REDERIVE_SEAM`; take the no-op branch (§6.4). Return `{ ok:true, saveId, keys, layer }`. ⭐ **MEASURED AT THE FLIP (the pass-1D verifier's FIX-1, 2026-09-22; judgment 145):** the built `applyCascadeEdit` does NOT consult the seam — only the `set-root` path does (`src/store/editSlice.js :: applyPlainEditToDraft`, step 8's consult and step 9's derived `keys`) — so one seam site exists where this step rules two. Inert today: the seam is a typed no-op (`kind: 'noop'`, `calls: 0`; A8 pins the constant) and the cascade branch returns the same `keys` either way. The consult is EM-B2a4's to add in the same §7 row that plugs re-derivation in (its pre-proof measures the seam's consult sites; the inbox carries the row) — slotted, not cured under a new seal for zero observable change; the packet's rule stands as written and the code is short of it until then.

⛔ **NEVER A SECOND CASCADE.** The branch calls ONE store action, which calls ONE cascade. It
imports neither `src/domain/factionRename.js` nor any rename helper; it re-implements no surface;
it writes `npcs[].name` nowhere itself. ⭐ **AND IT ADDS ZERO IMPORT EDGES** — the writer is
reached off `get()` by its LITERAL name through `CASCADE_DISPATCH` (⭐ v4.2; `settlementPendingEdits.js:317` spells its call the same way) — which is why
SHAPE A's `+0 eager modules, +0 eager bytes` is unchanged and A5 re-proves it against an import
list that has not moved.

⚠ **ONE THING THE BRANCH DOES NOT DO, MEASURED AND NAMED.** The declared writer reaches the **HOST
save only**: `renameNpcImpl` calls `applyNpcRenameToSettlement` and **not** `applyNpcRenameToPartner`,
while `renameFactionImpl` does walk its neighbours (`settlementRenameHelpers.js:351-358`). A
neighbour save's `interSettlementRelationships[].npcName` therefore keeps the old name — the same
shape as the bug quoted above, one lane further out, and **pre-existing at this base**. ⛔ This
packet does not widen it: doing so would be a second cascade, which §5's forbidden alternatives and
the chair's ruling both bar. It is reported with its measurement and its slot (§12).

### §6.2 `src/application/commands/adapters/plainEditApply.js` — THE ONE GENERIC ADAPTER

```js
export const PLAIN_EDIT_APPLY;      // exactly 'settlement.plain-edit.apply'

export const plainEditApplySpec;    // Object.freeze({ … }) — the CommandSpec
//   kind: PLAIN_EDIT_APPLY
//   description: 'Apply one plain edit to a draft settlement.'
//   targetScope: 'save'          (the edit names one save)
//   delivery:    'local'         (⛔ EM-B3 owns persistence; this claims none)
//   atomicity:   'single-target' (one op, one key, one save)
//   surveyor:    false           ⇒ a surveyor-provenance command is refused at dispatch with
//                                  'surveyor_capability_refused', BEFORE validation or any writer
//   validate(command)   → { ok:false, reason:'owner_scope_required' } with no ownerRef.ownerKey
//                       → { ok:false, reason:'save_required' }        with no targets.saveId
//                       → { ok:false, reason:'op_required' }          with no params.op
//                       → { ok:true }
//   preflight(_c, ctx)  → typeof ctx.actions?.applyPlainEditToDraft === 'function'
//                           ? { ok:true } : { ok:false, reason:'no_verb' }
//   apply(command, ctx) → await ctx.actions.applyPlainEditToDraft(command.params)
//                         ok:true  → { ok:true,  status: COMMAND_STATUS.APPLIED, result,
//                                      persistence:{ state: PERSISTENCE_STATE.NOT_REQUIRED } }
//                         ok:false → { ok:false, status: COMMAND_STATUS.FAILED, reason: result.reason, result }

/** Build the envelope. `commandIdForValue` over (saveId, rootKey, op.type, value fingerprint)
 *  makes a double-submit of the SAME edit one journal entry and a DIFFERENT edit a new command. */
export function plainEditCommand(scope, { now = null } = {});

/** Map a receipt back to the store's result shape, with the receipt attached non-enumerably
 *  (pendingEditFacadeResult's exact idiom, so deep-equality consumers keep their contract). */
export function plainEditFacadeResult(receipt);
```
⭐ **VERSION 4.2 — THE REVIEW SENTENCE, for the reviewed-set pin in `tests/application/commands/commandRegistry.test.js` (§7's TEST row):** `settlement.plain-edit.apply` is REVIEWED into the bounded capability set — `surveyor:false` (refused at dispatch for surveyor provenance), `targetScope:'save'`, `delivery:'local'` (no network, no persistence claim), `atomicity:'single-target'`; it reaches exactly ONE store writer through `context.actions`, and no second dispatch path exists (the mutation-path walker). The pin's list gains it in the LIVE registry's order — immediately after `'settlement.pending-edits.commit'` — so the reviewed set is eleven; `surveyorCapabilities()` is unchanged at three.

⛔ **This file imports NOTHING from `src/store/**` and nothing from `src/domain/edit/**`.** It is
pure envelope-and-policy; the writer arrives as `context.actions`.

⭐ **VERSION 4.3 — THE TWO DORMANCY ARMS THIS LANDING WIDENS (judgment 148):** by importing `../domain/edit/{operations,dmLayer,fieldDeclarations}.js` this leaf becomes the FIRST runtime importer of EM-A1's declaration table and EM-B1a's op catalogue, and each of those landed packets pins its leaf's importer roster EXACT (`tests/domain/editDeclarations.test.js`'s DORMANCY arm; `tests/domain/editOperations.test.js`'s A6). Both rosters gain the one `src/store/editSlice.js` row under §7's two TEST rows — a LAZY importer composed by no eager slice, which is the shape the arms exist to admit and the reason they stay exact.


### §6.3 `src/application/commands/plainEditRuntime.js` — the lazy dispatch seam

```js
/**
 * @param {object} scope exact, owner-scoped, captured BEFORE this import
 * @param {{ journalScope: object|Function,
 *           readContext: () => { ownerKey:string|null, saveId:string|null,
 *                                revision?:string|null, sourceFingerprint?:string|null },
 *           applyPlainEdit: (request:object) => Promise<object>,
 *           now?: string }} dependencies
 */
export async function runPlainEditCommand(scope, dependencies);
```
It builds the envelope, calls `executeSessionCommand(command, { ...dependencies.readContext(),
journalScope: dependencies.journalScope, actions: { applyPlainEditToDraft: dependencies.applyPlainEdit } })`
and returns `plainEditFacadeResult(receipt)`. **This is the SEVENTH `DISPATCH_SURFACE` member and its
row is declared in the same landing** (`tests/application/commands/commandRegistry.walker.test.js`,
with its own paragraph, as that list's comment prescribes).

**THE WALKER THIS PACKET CREATES** — `tests/lint/editMutationPath.walker.test.js`. Predicate, designed
from the measured boundary and deliberately NOT duplicating the three arms that already exist:
> every `src/` module that statically imports `makeOp`, `validateOp` or `OP_TYPES` from
> `src/domain/edit/operations.js`, or `applyEdit` from `src/domain/edit/dmLayer.js`, must be a
> DECLARED member of the edit path (the adapter, the runtime, `editSlice.js`) or a DECLARED read-only
> consumer. Anything else is a SECOND MUTATION PATH and is convicted by name.
Its declared sets are IMPORTED from their producer, never re-typed (`contractTestAntiVacuity` Rule 2).
Planted reds: **P1** a fabricated `src/store/*.js` importing `applyEdit` → convicted; **P2** a
fabricated `src/components/*.jsx` importing `makeOp` → convicted; **P3** (negative control) the real
adapter → not convicted; **P4** (negative control) a DYNAMIC `import('…/dmLayer.js')` from the
declared runtime → not convicted, because the lazy boundary is the design's own seam; **P5**
(anti-vacuity) the scanned denominator is non-empty and contains the real adapter.
**DECLARED CANNOT-CATCH:** a writer reaching the layer through more than one re-export hop (it
degrades to a loud unresolved-specifier failure, never a silent pass), and a writer that mutates the
settlement record without naming either module (the pre-existing estate's problem, not this
walker's).

### §6.4 ⛔ NO PIPELINE RE-ENTRY. THE SEAM, NAMED.
The charter's amendment of 2026-09-19 16:2x: *"D0's plain edits are RECORD WRITES through the op
boundary … with no pipeline re-entry at all."* ⇒ **`rederive` does not exist at this packet's base,
is not imported, is not called, and is named nowhere in `src/` by this packet.** The charter row's
clause "scoped re-derivation through `rederive`" is recorded as **DEFERRED to the packet that lands
`rederive`: EM-B2a4** — read from its capsule and from the chair's ruling of 2026-09-20 ~21:00 item
2 ("a4 KEEPS `rederive`'s authorship"), where `pinsFrom` and `rederive` stay in `dmLayer.js` with the
engine INJECTED. The charter sequences EM-B2a's family AFTER the EM-R family, so the seam stays a
no-op for the whole of wave 1. **`REDERIVE_SEAM` is the named plug point, and acceptance A8 asserts
it IS a no-op — the arm that fails the day EM-B2a4 lands, which is how the seam is found.**

### §6.5 Determinism, lifecycle, receipts
- **Hash / fork key:** NONE. This packet draws no random number and mints no id (`mintDmId` is the
  caller's, and the first door mints nothing).
- **Ordering:** `keys` comes back from `applyEdit` ASCII-ascending; the refusal sets are asserted in
  `compareCodepoint` order.
- **Absence vs empty vs null:** an absent layer reads as `EMPTY_DM_LAYER` (EM-B2a1's absence rules);
  an unknown save fails CLOSED (`found:false ⇒ canon:true`); a missing writer is `no_verb` at
  preflight, never a throw.
- **Lifecycle, every path:** *create* — the first accepted op materializes the layer from
  `EMPTY_DM_LAYER`. *read* — `layerRead`, own-property only. *persist* — ⛔ **NOT THIS PACKET**
  (EM-B3). *regenerate / re-derive* — ⛔ NOT THIS PACKET (EM-B2a4; §6.4). *undo* — ⛔ EM-C1's
  withdraw/reopen; the shipped per-field `revertUserEdit` is untouched. *import / fork / gallery /
  export* — ⛔ **edits do not travel**, and acceptance A5b PROVES it with a real written layer
  (design §11; the charter's EM-T7 stop). *migrate* — none: no save holds either key yet.
- **Receipts:** the command receipt only. No player-facing projection, no chronicle line (design
  §2.6: a plain edit on a draft writes none), no decree entry.
- **Golden posture: UNCHANGED.** `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dossierProseManifest.test.js` do not move; generation is not touched.

---

## §7 · Exact change manifest

⚠ Generated FROM the capsule (`EM-C4a.manifest.json`) and proved SET-EQUAL to it (interim rule 6);
the proof line is in §12.

| action | path | symbols | effective lines | the exact instruction |
|---|---|---|---|---|
| `CREATE` | `src/store/editSlice.js` | `EDITOR_MODES`, `EDITOR_MODE_PREF_KEY`, `PLAIN_EDIT_REFUSALS`, `CASCADE_WRITERS`, ⭐ **v4.2** `CASCADE_DISPATCH`, `REDERIVE_SEAM`, ⭐ **v3** `rootKeyFor`, ⭐ **v3** `readRootKey`, `selectEditorMode`, `selectCanonState`, `applyPlainEditToDraft` | ≤250 (**≈134 est.**) | §6.1's exact signatures. ⛔ LAZY: no eager module may import it and `src/store/index.js` does not compose it. Import `../domain/edit/{operations,dmLayer,fieldDeclarations}.js` and `../domain/campaign/canon.js`; import nothing from `src/components/**`, no PRNG, no clock. |
| `CREATE` | `src/application/commands/adapters/plainEditApply.js` | `PLAIN_EDIT_APPLY`, `plainEditApplySpec`, `plainEditCommand`, `plainEditFacadeResult` | ≤250 (**≈60 est.**) | §6.2's exact spec at `pendingEditCommit.js`'s shape. ⛔ Import nothing from `src/store/**` or `src/domain/edit/**`. |
| `CREATE` | `src/application/commands/plainEditRuntime.js` | `runPlainEditCommand` | ≤250 (**≈23 est.**) | §6.3, at `pendingEditCommitRuntime.js`'s exact shape. Its own file because the registry→runtime import would otherwise cycle. |
| `MODIFY` | `src/application/commands/standardCommandRegistry.js` | registration-only: one import, one array element | **+2** | Add `plainEditApplySpec` to the import block and to `createCommandRegistry([…])`. ⛔ The line `export const standardCommandRegistry = createCommandRegistry([` is a `requiredSymbols` row and survives verbatim. Not in the eager graph (0 of 269). |
| `CREATE` | `tests/store/editSlice.test.js` | A1, A2, A3, A8 | — | Literal `it` titles under ONE literal `describe`; no `.each`, no loops, no nesting; ⛔ no binding named `it`, `test` or `describe` anywhere in the file (26 of the estate's 384 parked files park for that alone). |
| `CREATE` | `tests/lint/editMutationPath.walker.test.js` | A4, A5 | — | §6.3's walker with its five plants. Declared sets IMPORTED from their producer. ⭐ **VERSION 3 DECLARES A5 HERE TOO**, because §9 homes A5 in this file (`checks` #8 carries the probe; this file carries A5's MUTANT arm and version 2's import-list assertion). A case homed in a file whose row does not authorize it is the contradiction that stopped EM-B3d's sealed build before its first byte. |
| `TEST` | `tests/application/commands/commandRegistry.walker.test.js` | A6 | — | `DISPATCH_SURFACE` gains `'src/application/commands/plainEditRuntime.js'` as its seventh row with its own paragraph; the positive-control arm gains `expect(staticKinds).toContain('settlement.plain-edit.apply')`. ⛔ No arm is widened. |
| `TEST` | `tests/lib/editTravel.test.js` | A5b | — | The charter's EM-T7 stop: a REAL written layer through fork · import · gallery · export · the anonymous envelope. ⛔ Never weakened to pass. ⭐⭐ **VERSION 4.1 RE-ADDRESSES THIS ROW AGAINST THE FILE EM-V10 LEAVES, MEASURED** (`git diff -U0 80e855f26 eb8402184` in EM-V10's lane worktree, READ-ONLY): EM-V10 inserts **`@@ -86,0 +87,9 @@`** — a `deepFreeze` helper above the first `describe` — and **`@@ -440,0 +450,35 @@`** — its `B6` test, appended INSIDE the second `describe` (`'EM-B3a — HZ-TRAVEL: a fork, a backup export and a realm snapshot carry neither key'`, at `:124` pre-V10) and before that block's closing `});`. ⇒ **A5b appends AFTER `B6`, inside that SAME final `describe`, and touches neither the helper block at `:87-95` nor any existing arm.** The file is 441 lines at the tip and 485 after EM-V10. ⛔ **AND ONE HEADER SENTENCE MUST MOVE WITH THIS ROW**: the file's own docblock says *"nothing here imports from `src/domain/edit/**`"* and *"every case below runs on HAND-PLANTED fixtures through code that already exists"* — A5b's whole point is a REAL layer from THIS packet's writer, so the docblock is amended IN PLACE, in this member's landing, to name A5b as the one case that does (at most two raw comment lines, 0 effective; EM-B3e's own precedent for amending a header whose reach its landing widens). A header that outlives its own truth is the drift EM-B3d's Q2 refused. |
| `TEST` | `tests/application/commands/commandRegistry.test.js` | the reviewed-capability pin (no case; no arm added) | — | ⭐ **VERSION 4.2 (judgment 139).** The arm *"the live registry exposes the bounded reviewed capabilities"* pins the REVIEWED set at ten, and the registered `settlement.plain-edit.apply` makes the live registry eleven: the pin gains `'settlement.plain-edit.apply'` in the registry's own order — immediately after `'settlement.pending-edits.commit'` — under §6.2's review sentence. ⛔ The `surveyorCapabilities()` list stays at three, byte-unmoved; no other arm in the file moves; no title is added. |
| `TEST` | `tests/domain/editDeclarations.test.js` | the DORMANCY arm's `EXPECTED_IMPORTERS` roster (no case; no arm added) | — | ⭐ **VERSION 4.3 (judgment 148).** EM-A1's landed DORMANCY arm holds the importer roster of `src/domain/edit/fieldDeclarations.js` EXACT in both directions; `src/store/editSlice.js` is this member's LAZY first runtime importer. `EXPECTED_IMPORTERS` gains exactly ONE row, `src/store/editSlice.js imports src/domain/edit/fieldDeclarations.js`, with one comment naming EM-C4a and the leaf's laziness (composed by no eager slice; A5's probe). ⛔ No assertion is weakened: the roster stays exact both ways; the second-order scan (`:294-313`) is widened the same way — judgment 150: an EXACT sorted one-row roster, `src/store/editSlice.js imports src/domain/edit/operations.js`, set-equal both ways, its message re-worded (EM-B1a LANDED dark; the first runtime importer is EM-C4a's lazy store slice; `worldConditions.js` still has no importer); no title is added. |
| `TEST` | `tests/domain/editOperations.test.js` | the importer roster in the arm 'makeOp and validateOp are pure, the import list is exactly five, and nothing imports the leaf' (no case; no arm added) | — | ⭐ **VERSION 4.3 (judgment 148).** EM-B1a's landed A6 asserts nothing under `src/` imports `src/domain/edit/operations.js`; `src/store/editSlice.js` is this member's LAZY first runtime importer. The expected roster becomes exactly ONE row, `src/store/editSlice.js imports src/domain/edit/operations.js`, with one comment naming EM-C4a and the leaf's laziness; the planted-importer negative control beside it is untouched. ⛔ No assertion is weakened; no title is added. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | `invariants['tests/lint/editMutationPath.walker.test.js']` | — | ONE row, surgically beside its `tests/lint/` siblings, carrying its `rowKey`, as a DELTA. The manifest is never re-serialised whole; `uncoveredBaseline` untouched. |

### The deferred rows — PREDICTIONS, named in no `checks` and in no `changeManifest`

> **`tests/lint/.lighting-census-baseline.json`** — a named INTERIOR RED, **delta only**. This member
> CREATEs **two** test files (`tests/store/editSlice.test.js` and
> `tests/lint/editMutationPath.walker.test.js`); the walker's own fixtures are INLINE and create no
> third file. The five figures move as `files +2` and `credited / titles / suiteTitles` by the counts
> the build lane measures with `parkReasonsFor` run over each new file. ⛔ **No absolute tuple is
> quoted here.** The predicted red's SHAPE is `expected <N+2> to be <N>` on the first figure the
> walker reaches. ⛔ **The terminal refreeze is the CHAIR's**; a member never edits this file and
> never sets `LIGHTING_CENSUS_REFREEZE`. ⛔ The row names the BASELINE JSON, never the walker.
> ⭐ **VERSION 3 CORRECTED THIS ROW from three / `+3` / `<N+3>`**: §7 and the capsule declare two
> `tests/` CREATEs, and a member whose prose and capsule disagree about a count stops its build
> before the first byte (EM-B3d, 2026-09-21). `EM-C4a.count-prover.mjs` now makes the disagreement
> impossible to ship.

> **`docs/content/wiring-census.json`** — **NOT NAMED, and deliberately so** (interim rule 1). This
> member CREATEs no `.js` under `src/generators/**` or `src/domain/**` — measured against both roots,
> its three `src/` CREATEs land under `src/store/` and `src/application/commands/`. ⇒
> `stamp.producerIndexFiles` **+0**. The path appears in neither §7, nor the capsule, nor `checks`.

### ⭐ VERSION 3 · THE THREE STATEMENTS RULES 13, 14 AND 16 REQUIRE — each MEASURED at `e80a6a3f4`

**Rule 13 · LINE-ADDRESSED REGISTERS — `none found`, ⭐ RE-EXECUTED AT `80e855f26`** (and version
4.1 widens it per judgment 124: the sweep now reads `docs/implementation/PACKET_MANIFEST.json`'s
`requiredSymbols` `_note`s as well, because a `_note` that cites a line is a citation like any other
and it is what redded EM-B2a2 version 2 at gate window 25). `tests/lint/.prose-numerics-baseline.json`
carries **zero** rows for each of this packet's four `src/` paths (`grep -c -F` = 0 each, re-run).
⛔ **And this member SHRINKS no file**: three of its four `src/` rows CREATE files absent at the tip
and the fourth adds two lines, so it cannot push any existing address past an EOF — which is the one
HARD arm of `tests/lint/sourceCitationIntegrity.walker.test.js` (ARM 2, only-shrinks; ARMs 3, 4 and 5
are REPORT-ONLY by the walker's own header). ⭐ **ALL 29 `path:line` CITATIONS in this packet and its
capsule were RE-RESOLVED against the tip and every one is IN RANGE**; two were semantically stale and
are re-addressed by version 4.1 (`implementation-packets.mjs:828` → `:921`;
`settlementSlice.js:1111` → `:337`). The original statement follows, re-run unchanged.

**Rule 13 (version 3's statement, re-executed).** For every path this packet modifies:
`git grep -n -F '<path>' -- tests/lint scripts` over
`src/application/commands/standardCommandRegistry.js` (the one `MODIFY`) and the three `src/`
CREATE targets. `tests/lint/.prose-numerics-baseline.json` carries **zero** rows for any of the
four (`grep -c -F` = 0 each). The only register naming the `MODIFY` path is
`scripts/.observed-shape-readers-baseline.json`, which addresses by **content digest**
(`{mode, path, sha256, size}`), not by line, and only inside `manifests.{scanTree, sourceTree,
executionTree}`; the path is a SCANNED entry, and `provenanceDriftOf` skips a scanned entry's sha
drift by construction (`if (scannedNow.has(entry.path)) continue;`) and refuses only on a DETECTOR
SOURCE. ⇒ **no line-addressed row of this estate sits below a line this packet adds, and no
re-address is owed.**

**Rule 14 · THE BYTE ARM — this member is NOT the holder, and its predicted delta is `+0` on every
budget that exists.** No `tests/build/**` path appears in §7, the capsule or `checks`. Predicted
price per closure, each measured by a plain static-import walk at the read tip:
- **eager first paint — `+0` modules, `+0` bytes.** ⭐ **VERSION 4.1 RE-EXECUTED IT at `80e855f26`:**
  `EAGER_FIRST_PAINT_MODULES` measured **270** (269 at `bdbf7c89c` and `429141e2d` — a dated pair,
  not an absolute); all seven of A5's named modules ABSENT;
  `src/application/commands/standardCommandRegistry.js` is **not** a member, so the one `MODIFY`
  costs first paint nothing; and `src/domain/edit/**` is still at **0** of 270 although `dmLayer.js`
  and `fieldDeclarations.js` are now REAL.
- **the generation worker — `+0` B.** `src/workers/generation.worker.js`'s static closure contains
  **no** `src/application/commands/**` file at all; the registry is unreachable from it, so the
  EXACT, zero-slack `WORKER_BUNDLE_CEILING_BYTES` cannot move. The same holds for
  `customContentPreview.worker.js` and `advanceInterval.worker.js`.
- **the lazy engine / PDF vendor closure — `+0` B.** `src/utils/pdfRender.worker.js`'s static
  closure contains no `src/application/commands/**` file.
  ⭐ **THE LOAD-BEARING CLAIM IS MEMBERSHIP, NOT A COUNT** (version 4's finding, and version 4.1
  re-executes it). Version 3 quoted four module counts (220 · 267 · 545 · 371) as absolutes; version
  4's walk at `429141e2d` read **196 · 243 · 532 · 368**; ⭐ **version 4.1's own walk at `80e855f26`
  reads 145 · 204 · 545 · 370** for `generation.worker.js` · `customContentPreview.worker.js` ·
  `advanceInterval.worker.js` · `pdfRender.worker.js`. THREE INSTRUMENTS, THREE ANSWERS — the figures
  are INSTRUMENT-DEPENDENT (a walker's specifier resolution decides them), they are asserted by no
  test and banked in no register, and nothing in this packet rests on them. **What IS asserted, and
  what all three walks agree on at all three tips, is the MEMBERSHIP: ZERO
  `src/application/commands/**` files and ZERO `src/domain/edit/**` files in any of the four.** The
  counts are kept only as an as-of mark naming the instrument that produced them.
- **the five edge-shared metas — `+0`.** This packet declares no `supabase/functions/**` path and
  its `checks` run no generator.
- The only closure that grows is the **session-command lazy chunk** — reached from
  `src/application/commands/sessionCommandRuntime.js`, **re-walked at `80e855f26`: 37 modules, 12 of
  them under `src/application/commands/**`** — which the registry's one new static import extends by
  `adapters/plainEditApply.js` alone. **No `tests/build/**` budget test names that chunk**
  (`git grep -l -F 'application/commands' -- tests/build` at the tip → NO OUTPUT, re-run by version
  4.1), so no budget row is owed and no holder is named. ⛔ **If the chair names a byte-arm holder for this
  member's train, this member is still not it**: it carries no row on any budget path.

**⭐ Rule 17 · THE TUNING INVENTORY AND THE WIRING CENSUS'S TWO RED ARMS — NOT OWED, MEASURED WITH
THE LIBRARY'S OWN COUNTERS AND A POSITIVE CONTROL, ⭐⭐ RE-EXECUTED BY VERSION 4.1 AT `80e855f26`**
(the run is quoted below; the earlier run was version 4's at `429141e2d`).
`scripts/lib/tuning-inventory.mjs:60` declares **`TREES_P2P3 = ['src/domain', 'src/generators']`**,
re-read at `80e855f26`. ⛔ **All four of this
packet's `src/` rows lie OUTSIDE both trees** — three CREATEs under `src/store/` and
`src/application/commands/`, one registration-only MODIFY under `src/application/commands/` — so
`src/store` and `src/application` are not counted trees and no P2 or P3 count of this estate can
move by anything this packet writes. **EXECUTED, not reasoned:** the library's own
`countUnregisteredNamed` and `countBareDecimals` were run over a scratch root holding this packet's
PLANNED text at its real paths (`editSlice.js`'s five frozen constants and the `rootKeyFor` /
`readRootKey` pair included) beside a planted control under `src/domain/`. Result: **P2 `{control:
1}` · P3 `{control: 2}`** — the control is counted, and **`EM-C4a planned paths COUNTED: NONE`**.
The instrument is therefore proved LIVE and the exclusion proved by the same run.
⭐⭐ **VERSION 4.1 RE-RAN IT AT THE TIP with the library's own counters and its own planted control,
and the print is:**
```
TREES_P2P3: ["src/domain","src/generators"]
P2 countUnregisteredNamed: {"src/domain/__plantedControl.js":2}
P2 sites                 : {"src/domain/__plantedControl.js":["CONTROL_DIAL","CONTROL_RATE"]}
P3 countBareDecimals     : {"src/domain/__plantedControl.js":1}
```
⇒ the control IS counted (P2 two, P3 one) and **`EM-C4a planned paths COUNTED: NONE`** — the
scratch root held this member's planned `editSlice.js`, `plainEditApply.js` and `plainEditRuntime.js`
at their REAL paths, with the five frozen constants and the `rootKeyFor` / `readRootKey` pair, and
not one of them is in either counted tree. ⭐ The rule's
second half is likewise not owed: this member CREATEs **no `.js` leaf under `src/domain` or
`src/generators`**, so `tests/lint/proseWiringCensus.walker.test.js` gains no red arm from it and
§10 excludes no walker on its account (rule 1's `+0`, already stated in the deferred rows).

**⭐ Rule 15 · A CREATE UNDER AN ENFORCER DIRECTORY — OWED, AND RE-VERIFIED.** `ENFORCER_DIRS`
(`tests/lint/mutationCoverage.shared.mjs:36-42`) still lists `tests/lint` FIRST at `80e855f26`, so
this member's `tests/lint/editMutationPath.walker.test.js` CREATE owes its one
`scripts/mutation-coverage-manifest.json` row (§7) and `tests/lint/mutationCoverageManifest.test.js`
in `checks` — both carried, both unchanged. The row key is ABSENT from the register at the tip
(`grep -c editMutationPath` → 0) and no other non-terminal packet holds the path.

**⭐ Rule 15b · THE STAMPED-FILE ARM (the pre-proof brief's step 15) — NOT OWED, RE-MEASURED.**
`docs/content/wiring-census.json`'s `stamp.files` names SEVEN producer files at the tip, all under
`src/domain/display/stateProse/`; **none is a path this member writes**, so the census's `stale-bytes`
arm cannot fire and the JSON takes no change-manifest row. (`stamp.producerIndexFiles` is 1177 at the
tip, 1175 at version 4's — this member's delta is `+0` either way, which is the only figure it
claims.)

**Rule 16 · A RENAMED OR RE-SHAPED BINDING — none.** This packet renames nothing, re-shapes no call
and deletes no export: three of its four `src/` rows are CREATEs of files absent at the tip, and the
fourth is registration-only (one import line, one array element) that adds two lines and changes no
existing spelling. `retiredSymbols` is therefore EMPTY, and there is no old spelling to grep the
estate for.

---

## §8 · Ordered coding sequence

1. **K-GATE, BEFORE THE FIRST EDIT.** Re-run the eager probe (`checks` #8 form) and quote its line;
   re-run `git grep -n -w editMode -- src` and confirm `settlementSlice.js:806-808` is unchanged;
   confirm the three provider files exist (`fileExists` on `operations.js`, `dmLayer.js`,
   `fieldDeclarations.js`). **Any miss is a STOP, not a workaround.**
2. Write `src/application/commands/adapters/plainEditApply.js` — constants first, then the frozen
   spec, then the envelope builder, then the facade mapper.
3. Write `src/application/commands/plainEditRuntime.js`.
4. `MODIFY` `standardCommandRegistry.js` (+2 lines).
5. `TEST` `tests/application/commands/commandRegistry.walker.test.js` — the seventh
   `DISPATCH_SURFACE` row and the positive control. **Run it now**: it should be the first thing that
   goes green, and if it does not, the runtime is in the wrong place.
6. Write `src/store/editSlice.js` — the frozen constants (**including `CASCADE_WRITERS`, one row**),
   `selectEditorMode`, `selectCanonState`, then `applyPlainEditToDraft` (the only one that writes).
6b. ⭐ **THE VERSION 2 BRANCH (§6.1a), AND ITS NEGATIVE CONTROL FIRST.** Write A1's **await** arm
   before the branch — a stub writer that resolves on a later microtask — so the branch is written
   against a detector already proved to convict an un-awaited call. Then write the branch in §6.1a's
   order: the `CASCADE_WRITERS` lookup, the STATED INVARIANT (⭐ **version 4**: the active-save gate
   is §6.1 step 1's, written in step 6 above and never repeated here), the exactly-one-match
   id→index resolution, the `await`, the READ-BACK, and only then the layer write. ⛔ Never trust the writer's
   boolean; ⛔ never import a rename helper; ⛔ never write `npcs[].name` here.
7. Write `tests/store/editSlice.test.js` (A1 incl. the cascade and await arms, A2 incl. the canon
   spy arm, A3 incl. the seven-member set and the three hostile rows, A8).
8. Write `tests/lint/editMutationPath.walker.test.js` (A4) and its `scripts/mutation-coverage-manifest.json`
   row.
9. Extend `tests/lib/editTravel.test.js` (A5b) with a REAL layer produced by step 6's writer.
10. Run `checks` in order; the validator LAST.

---

## §9 · Acceptance matrix

| # | case | proof | home |
|---|---|---|---|
| **A1** | **MAIN** — a plain `set-field` on a DRAFT applies through the ONE adapter | the record carries the value; the layer records the override at exactly one root key; `COMMAND_STATUS.APPLIED`; no other save touched; op and layer proved unmutated against pre-call clones. ⭐ **VERSION 2 FOLDS IN TWO ARMS, no case minted:** **(a) THE CASCADE ARM** — a `free-cascade` edit on a draft moves **all five** `NPC_RENAME_SURFACES` on the record, the list **read from the frozen export and never re-typed** (`contractTestAntiVacuity` Rule 2), including `factions[].members[].name`, which is the surface the quoted divergence lost; the layer still records the override at exactly one root key; and a source scan proves `applyPlainEditToDraft` writes `npcs[].name` **nowhere itself**. **(b) ⛔ THE AWAIT NEGATIVE CONTROL** — the declared writer is stubbed to resolve on a LATER microtask and only then write; with the `await` the arm passes, and the same arm run against an un-awaited call **reds**, which is the estate's own recorded failure (*"Reading the roster off the un-awaited call would score every real rename as `rename_not_applied` while the write still landed"*). Without (b), an un-awaited branch passes every other arm on a synchronous stub. ⭐⭐ **VERSION 3 FOLDS IN A THIRD ARM, and still mints NO case (the matrix stays EIGHT and §3's cap is untouched): (c) THE ROOT KEY ↔ COORDINATES PIN** (the chair's judgment 77 — EM-C4a is the root-key minter, so the pin is this packet's). BOTH DIRECTIONS: (i) for a key minted by `rootKeyFor(cardType, entityId, field)`, the op this writer hands `applyEdit` carries `cardType` and `field` **strictly equal** to that mint's, over the whole declared card/field population, `readRootKey(rootKeyFor(...).key)` asserted DEEP-EQUAL to the mint both ways; and (ii) a HOSTILE op whose coordinates were spelled by hand to disagree with its key cannot be produced by this module — a SOURCE SCAN of `src/store/editSlice.js` proves every `cardType:`/`field:` it writes into an op reads off the ONE `coords` record, and a planted mutant that re-spells either from `request` REDS. ⛔ Without (ii) the pin is a tautology: the mint and the read would agree because one call produced both, which is precisely the property (ii) proves no caller can break. ⭐ **VERSION 4.2 FOLDS IN A FOURTH ASSERTION INSIDE THE SAME ARM, no case and no title minted: (d) THE DECLARATION ↔ CALL PIN** — `Object.keys(CASCADE_DISPATCH)` set-equal BOTH WAYS to `Object.values(CASCADE_WRITERS)`, both read from the frozen exports; a row planted in either table alone reds | `tests/store/editSlice.test.js` |
| **A2** | ⛔ **THE CANON RULE, BOTH SPELLINGS** | `campaignState.phase === 'canon'` **and** a save with `canonizedAt` and NO phase string both refuse with `'canon_locked'`, store `===` its input; a plain draft is the negative control and DOES apply. ⭐ **VERSION 2 FOLDS IN ONE ARM:** a **`free-cascade`** edit on a canon save refuses `'canon_locked'` **and the declared writer is asserted NOT CALLED** (a spy with a call count of zero) — because the estate freezes an NPC's name at canonization and a call would be a silent no-op wearing the wrong reason. The draft case is the paired positive control | `tests/store/editSlice.test.js` |
| **A3** | the closed refusal set | both directions against the module's own `PLAIN_EDIT_REFUSALS`, so an **eighth** reason reds here; `APPLY_EDIT_REASONS ⊆ PLAIN_EDIT_REFUSALS` asserted, so the two can never drift; the hostile matrix (absent op, malformed op, unknown card, undeclared field, missing save, missing owner) throws in none of its rows. ⭐ **VERSION 2 FOLDS IN:** the set is **SEVEN** and `compareCodepoint`-ordered; `'rename_not_applied'` is asserted **byte-identical to the estate's own spelling** by a source scan over `src/store/settlementPendingEdits.js`, so the two dispatchers can never drift into two words for one fact; and the hostile matrix gains three rows — an entity id resolving to **no** NPC and to **two** NPCs (both `'unknown_target'`), a `saveId` that is **not** the active save (`'no_save'`, with the writer asserted **not called**), and a writer that ran and left the record unmoved (`'rename_not_applied'`) | `tests/store/editSlice.test.js` |
| **A4** | **ONE MUTATION PATH** | P1 and P2 convicted; P3 and P4 cleared; P5's denominator non-empty and containing the real adapter | `tests/lint/editMutationPath.walker.test.js` |
| **A5** | ⛔ **FIRST PAINT, +0 MODULES** | the probe IMPORTS `EAGER_FIRST_PAINT_MODULES` (reads no `dist`, cannot skip): all seven named modules ABSENT; the set non-empty and containing `src/main.jsx`; a MUTANT arm proves a fabricated eager STATIC importer would be caught and a DYNAMIC one would not. ⭐ **VERSION 2 FOLDS IN:** `src/store/editSlice.js`'s import list is asserted **IDENTICAL to version 1's** — the `free-cascade` branch resolves its writer off `get()` **by name**, so it adds **ZERO import edges** and the `+0 modules / +0 eager bytes` claim is unchanged by construction rather than by measurement luck. ⛔ A static import of `src/domain/factionRename.js` or of any rename helper appearing in this file is the arm's red **and** §11's STOP | `checks` #8 + `tests/lint/editMutationPath.walker.test.js` |
| **A5b** | ⛔ **THE TRAVEL STOP** (charter EM-T7) | a REAL layer from this packet's own writer carries NO `dmLayer` across fork, import, gallery, export and the anonymous envelope. **A red here is this packet's STOP** | `tests/lib/editTravel.test.js` |
| **A6** | the command boundary | `unregistered` stays `[]`; `ghosts` stays `[]`; the dispatch-surface exact equality holds with seven rows; a `provenance: 'surveyor'` command is refused `'surveyor_capability_refused'` before validation or any writer | `tests/application/commands/commandRegistry.walker.test.js` |
| **A8** | purity, idempotency and ⛔ the `rederive` seam as a typed no-op | two identical applications give a JSON-identical settlement and layer; three keys in all six orders give a byte-identical layer under sorted-key `JSON.stringify`; `REDERIVE_SEAM` asserted a declared no-op whose consultation changes nothing observable | `tests/store/editSlice.test.js` |

**Test precedent, by path and title:** `tests/application/commands/commandAdapters.test.js` (an
adapter's spec shape and refusal set) · `tests/store/userRouteCommandTransaction.test.js` (a store
writer reached through the command boundary) · `tests/domain/canonSave.test.js` (the canon read's own
suite) · `tests/lint/recordRegisterTotality.walker.test.js` (a walker with planted reds and an
anti-vacuity floor) · `tests/build/vendorPdfLazy.test.js` `it('MUTANT: a fabricated eager importer of
the chains surface is caught')` (the membership-probe mutant, copied in shape).

---

## §10 · Verification commands

```bash
# Focused static checks
npx eslint src/store/editSlice.js src/application/commands/adapters/plainEditApply.js \
           src/application/commands/plainEditRuntime.js src/application/commands/standardCommandRegistry.js \
           tests/store/editSlice.test.js tests/lint/editMutationPath.walker.test.js
npm run typecheck:domain:strict
npm run typecheck:ratchet

# The packet's own battery — ONE test directory per gated run, the slot held for the whole process
npx vitest run --pool=threads --maxWorkers=2 tests/store/editSlice.test.js

# ⭐ THE CREATE DIRECTORIES, RUN WHOLE (the chair's addendum after runs 17/18/19: a CREATE under
#    tests/<dir> opts into EVERY walker that governs tests/<dir>)
npx vitest run --pool=threads --maxWorkers=2 tests/store
npx vitest run --pool=threads --maxWorkers=2 tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js

# The governing set, by FILE (these are the sealed checks — see the capsule)
#   tests/application/commands/{commandRegistry.walker,commandRegistry,commandAdapters,executeCommand,commandEnvelope}.test.js
#   tests/architecture/{surveyorCommandBoundary,layerBoundaries}.test.js
#   tests/store/{canonEventCommandTransaction,userRouteCommandTransaction,operationRegistry.walker}.test.js
#   tests/lib/{editTravel,interpretApply}.test.js   ·   tests/domain/canonSave.test.js
#   tests/lint/{editMutationPath.walker,mutationCoverageManifest,recordRegisterTotality.walker,
#               contractTestAntiVacuity.walker,negativeAssertionAnchor.walker,seedLoopTotality.walker,
#               goldenFreeze.walker}.test.js

# ⭐ VERSION 2 ADDS THREE SEALED FILES — the DECLARED WRITER's own governing set, computed at
#    bdbf7c89c by `git grep -l -F <symbol> -- tests` (TOOL-26's governing-tests.mjs has not landed):
#      renameNPC                  -> 2   tests/store/settlementSlice.test.js, tests/store/editActionPersist.test.js
#      applyNpcRenameToSettlement -> 1   tests/domain/npcRename.test.js
#      NPC_RENAME_SURFACES        -> 1   the same file
#      renameNpcImpl              -> 0   (the Impl is reached only through the action)
#    ⛔ This packet CHANGES none of those symbols — it CALLS one. They are sealed because the
#    branch's whole claim is that the shipped writer's behaviour is unchanged by being called
#    from a second caller, and that claim is theirs to keep.
npx vitest run --pool=threads --maxWorkers=2 tests/store/settlementSlice.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/store/editActionPersist.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/domain/npcRename.test.js

# ⛔ THE BUILD LANE'S INSTRUMENTS — NEVER SEALED CHECKS
#   (a) the excluded tests/lint directory above, which MUST EXIT 0
#   (b) the lighting walker ALONE, as the measured, named INTERIOR RED:
npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
#   ⛔ DO NOT set LIGHTING_CENSUS_REFREEZE. The refreeze is the chair's, at the terminal.
#   (c) ⭐ THE HUB-FILE INSTRUMENT (tonight's ruling 3): SHAPE A modifies no hub file, so none is
#       owed. If the chair rules SHAPE B or C, `tests/store` whole (above) becomes the instrument
#       and the sealed checks take the grep of the CHANGED SYMBOLS only.

# Registers that must NOT move
npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js \
                                             tests/property/dossierProseManifest.test.js
node scripts/check-observed-shape-readers.mjs
node scripts/check-writer-reach.mjs

# ⛔ THE BROWSER SUITE: NOT GOVERNING. This member touches no src/components path, no route, no
# data-testid and no accessible name, so NO e2e/ spec is named. (Interim rule 10, stated as it
# requires.) EM-D0 is the member that owes the chromium project.

# The seal, LAST
node scripts/implementation-packets.mjs validate
```

---

## §11 · Mandatory STOP conditions

1. ⛔ **The eager first-paint closure grows by even one module or one byte.** The probe's line is
   quoted at the landing; a rise is a STOP for the OWNER, never a re-mint under delegation.
2. ⛔ **`tests/lib/editTravel.test.js` reds with a real written layer.** The charter names this the
   packet's own stop. The travel test is never weakened, and no `dmLayer` is allowed to travel.
3. ⛔ The dispatch-surface arm cannot be made green by DECLARING the new runtime — i.e. a second
   file turns out to dispatch. Two dispatch entries for one capability is the second path design
   §2.3 forbids.
4. ⛔ Any register grows: `NOT_YET_WRITTEN_KEYS`, `RECORD_CLASSES`, `EAGER_FIRST_PAINT_MODULES`,
   `DISPATCH_SURFACE` beyond its declared seventh row, `mutation-coverage-manifest.json` beyond its
   one row, `uncoveredBaseline`, or any lighting figure written by a lane.
5. ⛔ A provider's landed contract differs from §6's quotation (`applyEdit`'s arity or reason set;
   `validateOp`'s return shape, **or a landed `validateOp` that READS its second argument** — §6.1
   step 3 passes `null` on the measurement that version 7's algorithm reads it at no step;
   `declarationsFor`'s signature). STOP with the smallest measured contradiction; never adapt
   silently.
6. ⛔ **VERSION 2 — a `free-cascade` value would reach `applyEdit`'s `set-root`.** That is the
   defect §6.1a exists to prevent; it re-opens a bug the estate already paid to fix, and it is
   invisible in memory because the two homes are the same object until JSON splits them.
7. ⛔ `src/store/index.js`, `src/store/settlementSlice.js` or `src/store/uiSlice.js` is edited under
   SHAPE A. All three are EAGER; SHAPE A's whole claim is that none of them changes.
8. ⛔ Budget: the 2 → 3 leaf override is refused by the chair, or a fourth leaf appears.
9. ⛔ **THE ACTIVE-SAVE PRE-CONDITION is absent, weakened, or moved after the writer call.** The
   declared writer indexes `get().settlement`; routing a non-active save's request renames a
   DIFFERENT PERSON in the active save. This is a data-safety gate. ⭐ **VERSION 4: its ONE home is
   §6.1 step 1** (the single `no_save` site), where it guards BOTH branches; a gate that reappears
   as a second `no_save` arm inside §6.1a is the unreachable-code defect judgment 82 item 2 ruled
   out, and a gate that exists in NEITHER place is this STOP.
10. ⛔ **VERSION 2 — the writer's boolean is trusted instead of a read-back**, or the call is not
    awaited, or the layer is written before the read-back confirms. Each produces a receipt that
    disagrees with the save: the first two silently, the third on a refusal.
11. ⛔ **VERSION 2 — a second cascade, a partner-save walk, or any import of
    `src/domain/factionRename.js` (or any rename helper) appears in `src/store/editSlice.js`.**
    The first two are the chair's ruling; the third is SHAPE A's `+0` claim and A5's arm.
12. ⛔ **VERSION 2 — `PLAIN_EDIT_REFUSALS` grows by more than the one reason**, or the reason is
    spelled differently from `src/store/settlementPendingEdits.js`'s, or `renameNpcImpl`'s
    signature, canon lock or active-save scope differs from §5's quotation. STOP with the smallest
    measured contradiction; never adapt silently.
13. ⛔ **VERSION 4.2 — a computed dispatch off the store handle (`get()[…]`, `getState()[…]`) appears anywhere in
    `src/store/editSlice.js`**, or `CASCADE_DISPATCH` and `CASCADE_WRITERS` disagree, or the reviewed pin is
    widened by more than the one kind or re-ordered, or `surveyorCapabilities()`'s pin moves.

---

## §12 · Receipt, questions and handoff

**The SET-EQUAL proof (interim rule 6)** — `setEqual.mjs` over this file and the capsule; the
executed line is in `FIRST-DOOR-CHAIN.compile.report.md` §A and reads
`§7 table rows parsed : 9 · capsule changeManifest: 9 · IN §7 AND NOT THE CAPSULE: NONE · IN THE
CAPSULE AND NOT §7: NONE · SET-EQUAL: YES` (⭐ v4.3: TWELVE rows, the two dormancy-arm TEST rows joining; re-measured `12 = 12 SET-EQUAL`) (⭐ the flip, 2026-09-22: version 4.2 carries TEN rows — the reviewed-pin TEST row joined — and the build lane re-measured `10 = 10 SET-EQUAL, NONE either way`; the pass-1D verifier's FIX-2: the prose had not moved with the row). ⭐ **Version 2 moved no path**, so the nine rows are
version 1's nine and the proof is re-executed rather than re-derived.

**What EM-D0's compile may now rely on** — the adapter's exact contract is §6.2 and the cascade
branch's is §6.1a. The closed refusal reasons are **SEVEN**: `canon_locked · invalid_op · no_save ·
not_a_draft_field · rename_not_applied · undeclared_field · unknown_target`, plus the executor's own
`owner_context_missing · save_context_missing · owner_changed · save_changed · unknown_command ·
surveyor_capability_refused · no_verb`. ⭐ **The first door may show the NPC's name as EDITABLE**:
a `free-cascade` edit on a DRAFT moves all five join surfaces through the estate's own writer.
⛔ **On a CANON save the name is not editable** and the refusal is `canon_locked` — the surface
should say so rather than offer a control that will refuse (EM-D0e's copy).

**Questions only the chair can answer** are carried in the lane's compile report and final message:
design §20.2's `free-cascade`-on-canon clause (Q1); SHAPE A vs C; `EDITOR_MODES`' members; and the
browser-pass ordering. (The root-key's owner and the 2 → 3 leaf override were ANSWERED by judgment
82, items 3 and 5.) ⭐ **VERSION 4 adds three, each with its measurement in §6.1:** **Qa** — step 1's
resolution is `activeSaveId`-keyed with the `savedSettlements` row as the envelope, rather than a
`savedSettlements`-MEMBERSHIP gate, because `setActiveSaveId` does not upsert that row; **Qb** —
`validateOp`'s second argument is an explicit `null`; **Qc** — `selectCanonState`'s subject for the
active save is the LIVE store state rather than the cached envelope.
⭐⭐ **VERSION 4.1 ADDS TWO, EACH WITH ITS MEASUREMENT ABOVE:** **Qd** — version 4's reading of
judgment 82 item 2 as ONE SITE PER CONDITION (the table above) stands unreviewed and this version
does not change it; **Qe** — ⛔ **THE `rename-npc` VERB SPELLING (judgment 123)**: the pre-proof
RECOMMENDS renaming EM-B1c1's op to **`set-npc-name`** (index 11 of 15; two of five landed-arm
exposures removed; free only while EM-B1c1 is unplaced) and adding ONE shrink-only disjointness arm
in `tests/domain/editOperations.test.js`; the alternative is to keep `rename-npc` and declare the
seam. ⛔ **Either ruling moves NO byte of EM-C4a**, and no member of train EM-T12 is blocked on it.

### ⭐ VERSION 4 · EVERY REFUSAL HAS A WITNESSING INPUT, FROM THE DECLARED SIGNATURES ALONE

Proved after the §6.1 step 1 merge, against EM-A1's BUILT table, EM-B1a version 7's §6/§8 and
EM-B2a1 version 2.1's §6 — **no input is invented and no arm is unreachable**:

| refusal | where it is returned | a witnessing input |
|---|---|---|
| `no_save` | §6.1 step 1 — ⛔ **THE ONE SITE** | an absent or empty `request.saveId`, or one naming any save that is not `get().activeSaveId` |
| `canon_locked` | §6.1 step 2 | the active save's phase is `'canon'`, **or** it carries `canonizedAt` with no phase string — A2's two spellings, both reached through `isCanonSave` |
| `invalid_op` | §6.1 step 3 | any op `validateOp` reports on: a non-object, a `type` outside `OP_TYPES` (`rename-npc` is EM-B1c1's, so it is outside EM-B1a version 7's fourteen), a missing required payload field, an undeclared payload key |
| `undeclared_field` | §6.1 step 4 | `cardType 'npc'`, `field 'salary'`: `declarationsFor('npc')` returns FOUR rows — `name`, `role`, `status`, `note` — and none is `salary` |
| `unknown_target` | §6.1 step 4 · §6.1 step 6 · §6.1a step 3 — **THREE DISTINCT CONDITIONS, none unreachable** | an unknown card type (`'building'`: the table has no own property for it); a `rootKey` that is not three non-empty colon-separated parts, so `readRootKey` returns `null`; an `entityId` matching ZERO or TWO NPCs under the exactly-one-match guard |
| `not_a_draft_field` | §6.1 step 4 · §6.1a step 1 — **TWO DISTINCT CONDITIONS** | `faction.power`, whose `kind` is `'share'` — the ONE `share` row EM-A1 declares, and a kind the first door does not carry; and `institution.name` or `faction.faction`, the two `free-cascade` rows with no `CASCADE_WRITERS` entry |
| `rename_not_applied` | §6.1a step 5 | a value that is empty after `String(v).trim()`, or one equal to the current name: the shipped writer returns `false` without writing in both cases (`if (!trimmed …) return false;` · `if (!oldName \|\| oldName === trimmed) return false;`) and the read-back convicts |

⛔ **ONE SITE PER REASON is read as ONE SITE PER CONDITION** (judgment 82 item 2's own grounds: a
second arm would be *unreachable code* and *A3 could not tell which fired*). `no_save`'s two arms
were one condition twice and are now one. `unknown_target`'s three and `not_a_draft_field`'s two are
distinct conditions at different stages with different data in hand, each with its own witness above
and its own A3 row, so none is unreachable and none is ambiguous. **§12 Qd puts that reading to the
chair.**

⭐ **AND THE CASCADE BRANCH STILL HAS EXACTLY ONE HOME.** `CASCADE_WRITERS` is the only place in the
estate that maps a `<card>:<field>` to a STORE ACTION NAME. EM-A1's `FieldDeclaration.writer` is
**not** a second home — measured in its built code, it holds a GENERATOR address
(`src/generators/steps/generatePopulation.js#generatePopulation` for `npc.name`), a different fact
about a different layer. The estate's shipped `settlementPendingEdits.js` pairs its own INTENT KIND
`rename-npc` with the same action; that is a pre-existing second CALLER of one writer, not a second
declaration of which writer owns the field, and it imports neither `makeOp` nor `applyEdit`, so A4's
walker is untouched by it.


### ⭐⭐ VERSION 4.1 · JUDGMENT 123 — THE `rename-npc` VERB COLLISION, MEASURED, WITH A RECOMMENDATION

The chair slotted this here (judgment 123, 14:21: *"the rename-npc verb collision with the shipped
`EDIT_KINDS` slotted to EM-C4a's re-pre-proof (15 src sites, a canon lock)"*), after EM-B1c1's own
R8 measured it and refused to adjudicate it. ⛔ **FIRST, THE THING THAT MAKES THIS CHEAP TO RULE:
NO BYTE OF EM-C4a MOVES EITHER WAY.** §6.1a is keyed on the DECLARATION's `kind` (`free-cascade`),
never on an op type; §6.1 step 3 refuses an unknown `type` with `invalid_op` before the branch is
reached; and §2.4's row already says the two members may land in either order. This section records
a measurement and a recommendation; it changes no contract, no path, no case and no refusal.

**THE COLLISION, MEASURED AT `80e855f26` (`git grep -n -F 'rename-npc' -- src`): SIXTEEN occurrences
over SEVEN files — fifteen code sites and one comment**, which is EM-B1c1's count:

| file | sites | what reads the string |
|---|---|---|
| `src/domain/pendingEdits.js` | 3 (`:22` typedef · `:34` `EDIT_KINDS` · `:76` `COMMITTABLE_EDIT_KINDS`) | the shipped pending-edit INTENT vocabulary, frozen, and its committable subset |
| `src/domain/pendingEditIntents.js` | 3 (`:69` roster · `:124` → the operationRegistry id `settlement.rename-npc` · `:604` a branch) | ⭐ a THIRD registry with the same stem |
| `src/store/settlementPendingEdits.js` | 4 (`:207`, `:309`, `:382`, `:495`) | the dispatcher that resolves `renameNPC` off `get()`, awaits it and reads back |
| `src/domain/pendingEditsPreview.js` | 2 (`:19`, `:311`) | the preview's own copy of the roster |
| `src/lib/editFingerprint.js` | 2 (`:22` → `'npc'` · `:39` → `'cosmetic'`) | ⚠ a classification keyed on the STRING alone |
| `src/components/dossier/PendingChangesBar.jsx` | 1 (`:60`) | the label |
| `src/store/settlementRenameHelpers.js` | 1 (`:414`) | a COMMENT naming the dispatcher |

**AND THE CANON LOCK IS REAL AND IS THE SAME ONE:** `renameNpcImpl` refuses on
`before.phase === 'canon'` (`settlementRenameHelpers.js:427`, comment at `:425-426`), and the queue
seam refuses too (`tests/store/npcOpsCovenant.test.js`: *"rename-npc is identity-locked post-canon"*).
⇒ **BOTH vocabularies' `rename-npc` route to the SAME ONE writer** — the pending-edit lane through
its dispatcher, this packet through `CASCADE_WRITERS` — and both refuse post-canon. That is the
whole of what they share.

**WHAT REDS TODAY: NOTHING, AND IT IS EXECUTED.** `OP_TYPES` and `validateOp` appear at **ZERO**
sites in `src/` and `tests/` at the tip (EM-B1a is READY, not landed); **no test asserts
cross-registry name disjointness** (`git grep -rn -F 'OP_TYPES' -- src tests` → no output); and the
two vocabularies have **DISJOINT CONSUMER SETS** — `EDIT_KINDS` has thirteen importers, every one of
them the pending-edit lane, and `editFingerprint.js` is imported by `settlementPendingEdits.js`
alone.

⛔ **WHAT IT COSTS EM-B1c1, MEASURED AGAINST EM-B1a VERSION 11'S BUILT TEST** (read-only, on
`em-t11-b1a-2026-09-21`). Adding a row to `OP_TYPES` exposes **five** landed arms; the SPELLING
decides two of them:

| arm | what it asserts | reds under `rename-npc`? | reds under a non-`rename-*` name? |
|---|---|---|---|
| `:115-122` | `live` equals `THE_FOURTEEN` exactly, in order | YES | **YES** — any addition |
| `:352-353` | every one of the fourteen is `stage: home` / `consequence: home` | YES | **YES** — any addition |
| `:418` | no home row NAMES an off-stage type or one of `B1C_FIVE` | only if the new row names one | only if the new row names one |
| `:152` | `B1C_FIVE.filter(t => live.includes(t))` is `[]` | **YES** | **NO** |
| `:426` (A5) | the three `rename-*` names are ABSENT from `OP_TYPES` — *"their absence here is the reason this module owns no rename logic"* | **YES** | **NO** |

⇒ a rename removes **two of five** exposures. It does not remove EM-B1c1's need to widen a landed
arm, because three of them red under ANY new key.

**THE RECOMMENDATION — (a), SPELLED `set-npc-name`, WITH (c)'s PIN BESIDE IT.** The chair rules;
the evidence is:
1. **The verb fits the op family's OWN convention and the collision disappears.** EM-B1a's fourteen
   spell a field write `set-<subject>-<field>`: `set-npc-status`, `set-institution-state`,
   `set-power-holder`, `set-field`. The op IS a field write that happens to cascade; the
   `EDIT_KINDS` member is a QUEUED DM INTENT with a preview, a label and a revert. **Two typed
   things, two names** — which is the FINITE-SEMANTICS law's own shape, and the same shape §6.1a's
   `CASCADE_WRITERS` note already uses (*"Two facts, two layers, one home each"*).
2. **The splice is executed, not guessed.** Against the tree's own `compareCodepoint`,
   `set-npc-name` sorts at **index 11 of 15, between `set-institution-state` and `set-npc-status`**
   (`rename-npc` sorts at index 9, between `remove-npc` and `set-field`) — so EM-B1c1's splice pin
   moves by exactly one integer and nothing else about its composition changes.
3. **It costs no landed byte and no re-seal, and it is free only NOW.** EM-B1c1 is still a KIT
   packet (train EM-T12, unplaced); after placement the spelling is a sealed contract, a dispatcher
   id and a `@typedef`.
4. **It answers EM-B1c1's own open sentence.** R8 asked which vocabulary the adapter dispatches;
   under `set-npc-name` the answer is structural rather than documentary — the op layer writes the
   FIELD through the declared cascade writer, the pending-edit layer queues an INTENT that commits
   through the same writer, and §P4's "exactly one writer per state" is visibly honoured by two
   names over one writer rather than one name over two paths.
5. ⚠ **AND IT LEAVES ONE RESIDUE, NAMED:** `editFingerprint.js` classifies by the kind STRING, so a
   future op-layer kind that meets it falls through silently under EITHER spelling. That is what
   (c) is for: **one arm, in `tests/domain/editOperations.test.js` — a file EM-B1c1 already owns —
   asserting that `Object.keys(OP_TYPES) ∩ EDIT_KINDS` equals a DECLARED set (empty under the
   recommendation), shrink-only, with the reason in its message.** A third collision then reds by
   name instead of being noticed by a pre-proof two trains later. Zero new files, zero registers.

**THE ALTERNATIVE, STATED FAIRLY.** (b) KEEP `rename-npc` and declare the seam: the design and the
charter both call this capability "the rename", EM-B1c1 v3 is written and its A5 widening is already
ratified, and the collision reds nothing measurable. The cost is a permanent two-meaning string in a
codebase whose own law is typed buckets, and a `@typedef`-level ambiguity every future reader pays.
⛔ **The chair rules; §12 Qe carries it.**

### ⚠ NOTICED, MEASURED AND NOT TOUCHED — WITH ITS SLOT (the owner's law: never a bare deferral)

**The NPC rename does not reach neighbour saves, and the faction rename does.** Measured at
`bdbf7c89c` by reading `src/store/settlementRenameHelpers.js` WHOLE: `renameNpcImpl` (`:422-444`)
calls `applyNpcRenameToSettlement` and nothing else, while `renameFactionImpl` (`:351-358`) walks
`state.savedSettlements` and calls `applyFactionRenameToPartner` on each. The NPC partner writer
**exists and is exported** (`factionRename.js :: applyNpcRenameToPartner`) and its only callers
are the LIBRARY lane — `src/components/settlements/helpers.js:82` (`withNpcRenamed`), used by
`SettlementsPanel.jsx:422`. ⇒ **a neighbour save keeps the old name in
`interSettlementRelationships[].npcName` after a store-lane NPC rename**, which is the same shape
as the divergence §6.1a quotes, one lane further out.
⛔ **It is PRE-EXISTING at this base and is not caused by this packet** — the store lane has behaved
this way since the converged rename landed. ⛔ **Widening it here would be a second cascade**, which
§5's forbidden alternatives and the chair's ruling both bar.
**SLOT: an EM-R-family repair beside EM-R6's institution cascade** (the member that already owns
"one rename, every surface, every save"), or an OWNER'S DECISION POINT if the chair judges the
asymmetry intentional — the faction rename's own header records the neighbour walk as the
**library lane's contribution**, so the NPC lane may simply never have been given it.
*(Deliberately deferred — documented, not a bug to re-find.)*
