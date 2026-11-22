# Website / WEB-5 — import-vs-restore semantics (§359.10, closing §66.4 Q4)

- **Status:** LANDED
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `acc466a6e6c15ea904b47c50b2b41732b516b4b1`
- **Landing note:** built and gated at `19b799ce` (the authoring base); rebased by
  TE-WEB5-LANDING onto the slot `acc466a6` (WEB-4, the 28th landing) and re-verified
  there — §13. The authored member commit `966ec5c5` is `5bfeb3b5` after the rebase.
- **Authority:** ODQ §402 C3 (the chair signs the compiled semantics) and §409.1.
  §359.10's own terms make this compile the owner's veto window; nothing below
  re-opens a gate the owner has not already opened.
- **Built by:** TE-WEB5, 2026-08-22, at the base above. ⛔ **The lane builds and
  gates; it lands nothing and moves no ref.** The work is complete in the lane's
  worktree and the ref move is the chair's CAS.
- **Why the terminal status on a retrospective mint (§410):** this packet is
  written AFTER the build rather than as a dispatch instruction, and the validator
  refuses `DRAFT` for completed work. The deciding reason is the reservation rule:
  `implementation-packets.mjs` computes `reservesChangePaths = !TERMINAL_PACKET_STATUSES
  .has(status)`, so a non-terminal WEB-5 would RESERVE
  `tests/lint/sovereigntyLightingContract.walker.test.js` — the census-holder path a
  sibling website car already holds. A terminal packet reserves nothing, so the
  split-promotion collision cannot arise. The status is the manifest's word for
  "this packet no longer instructs anyone"; the landing record is the chair's CAS.
- **`censusAuthorization`:** §359.10, with §402 C3 and §409.1. This member adds
  **no test file** and moves the test census by **titles and suites only** — §9b
  carries the figures, every one re-derived at this base by isolation rather than
  inherited or computed.
- **Collision group:** `account-transfer`. Disjoint by construction: this packet
  reserves nothing (terminal status), and at its own base **zero** other packets
  sit at a non-terminal status.
- **⚠ Rebase note.** `docs/implementation/packets/website/` and its INDEX family
  section are founded independently by two sibling website cars in their own
  holding trees. At THIS base neither exists, so this packet founds the directory
  and inserts a plain row into the existing `Current packet set` table rather than
  opening a family section of its own. At any rebase: keep ONE family header and
  merge the rows; treat this packet as a pure row insert. The census tuple in §9b
  is subject to the carry law — drop it and re-derive, carrying only the delta.
- ⚠ **The tree is a LIVE SHARED WORKTREE.** This packet was built in an isolated
  worktree with its own `npm ci` (468 entries, `npm ls` exit 0). A sibling lane
  (`laneTEWEB6-tree`) held the test ratchet during part of the build; §9c records
  what that contention did to the reading and how it was separated from signal.

---

## 1. Reconciled authority

§66.4 recorded the question and refused to answer it: *"is 'Import my data' meant
to RESTORE campaign lifecycle (phase, eventLog, AI prose, version history)?
Today it deliberately resets all three with the distrust rationale in-file; the
export contents make restore possible. The recorded posture stands until the
owner rules."* §359.10 opens that gate under the grant and routes the concrete
semantics to this compile. ODQ §402 C3 signs them.

The compiled ruling, restated so this packet stands alone:

**THE SURFACE IS THE PROVENANCE.** Two surfaces read the same bytes and mean
different things.

1. **Gallery import** — a stranger's published world. The distrust posture is
   correct and is kept byte-identically. It lives in a different module
   (`src/store/galleryImportSettlement.js`) and this packet does not touch it.
2. **Account import** — "Import my data", the user's OWN exporter-produced
   estate. The reset there destroys the user's own lived history on their own
   transfer, against THE PROMISE's spirit. This surface becomes RESTORE:
   `campaignState.phase`, `campaignState.eventLog`, `versionHistory` and
   `aiData` carry through, **admission-walled per field, fail closed per field**.
3. **Never restored on either surface:** `id` / `user_id` / owner / `public_slug`
   / `is_public` / gallery flags; `serviceRecords` (`importable:false` is the
   contract); the `_seed` scrub and `scrubImportedConfig`, unchanged.
4. **Cross-settlement wiring** is restored ONLY intra-envelope, where both
   endpoints landed from the same file; otherwise it rebuilds empty.

## 2. Outcome

A user who exports their account and imports it — into a new account, after a
reinstall, or back into the same one — gets their canonized settlements back AS
CANONIZED: the phase they earned, the event log they wrote, the version history
they accumulated, the AI prose they generated, and the neighbour links between
settlements that travelled together in the same file. A field our own validator
cannot read falls back to the reset value for THAT FIELD and says so in the
import receipt, by settlement name. The user is never handed a silent partial,
and is never refused a whole file because one field of one settlement was
unreadable.

Nothing about the foreign-import wall moves. A gallery clone still arrives
dormant and draft. The reconciliation slice, which declares these same fields
unsupported on its own boundary, is unmoved to the byte.

## 3. Hard scope budget — measured, under every default limit

| Limit | Default | This packet |
|---|---:|---:|
| behavior families | 1 | 1 (account-transfer restore) |
| new persisted record families | 1 | **0** — no column, no RPC, no migration |
| new logic-bearing production leaves | 2 | **0** |
| existing logic-bearing production files modified | 3 | **3** |
| registration-only production files | 3 | 0 |
| handwritten files total | 12 | **5** |
| new/changed effective production lines | 400 | **208** |
| user-facing surfaces | 1 | 1 (the import receipt's notice list) |
| named acceptance cases | 8 | 8 |

Effective lines executed at the built tip (`git diff -U0`, comment and blank
lines excluded): `src/lib/accountImport.js` +173/−4,
`src/store/accountImportBody.js` +26/−2,
`src/components/account/AccountDataPrivacySection.jsx` +9/−0.

**Hot files:** none. No path in §7 appears on `PACKET_STANDARD.md`'s standing hot
list, and none carries a `scripts/.size-baseline.json` entry (executed: the four
basenames are absent from that file). `npx eslint` over all five paths exits 0,
which is the executed proof that no layer `max-lines` ceiling was crossed.

## 4. The verify-at-build branch — MEASURED, and it is the cheap one

The charter priced both branches and bound the executor to the measured one.

**Question:** does the exporter already serialize the four fields on
`settlements[]` rows, or does it strip them?

**Executed at the base**, against the live `preflightAccountExport`, with a
throwaway probe run under vitest and then deleted:

- `preflightAccountExport` places `state.savedSettlements` into the payload
  **verbatim** — no projection, no key list, no strip (`accountData.js`, the
  `payload` literal).
- The rows themselves come from `saveEntryFromSupabaseRow` (`saves.js`), which
  reads `ai_data`, `campaign_state` and `version_history` back off the row.
- The metadata projection that WOULD strip them (`supabaseListMeta` /
  `localListMeta`, which null `campaignState` and empty `versionHistory`) has
  **zero consumers** — executed grep: `listMeta` appears only at its own
  definition and in the service table. It is the deferred F42 infra the code
  says it is.
- The probe asserted, and passed: `ACCOUNT_EXPORT_VERSION === 4`, the exported
  row's `campaignState.phase === 'canon'`, its `eventLog` length 1, its
  `systemState` deep-equal to the input, `versionHistory` length 1, `aiData`
  keys `['aiSettlement']`, and the exported row's key set EXACTLY the input
  row's key set.

**VERDICT: the v4 branch. Zero exporter motion.** `src/lib/accountData.js` and
`src/lib/accountTransferContract.js` are NOT in this packet's change manifest.
`ACCOUNT_EXPORT_VERSION` stays 4; `MAX_IMPORT_BYTES` is untouched and the byte
budget does not move, because the exporter already carried these bytes before
this packet existed. The newer-envelope guard is unmoved and its arm re-runs.

## 5. Verified tree contract

- Base `19b799ce`, resolved with `git rev-parse` at lane start, never typed — the
  BUILD base. The landing slot is `acc466a6` (§13); every host below is the SAME
  blob at both (proved at blob level before the rebase).
- The account-transfer surface at that base: `accountImport.js` 328 lines whole,
  `accountData.js` 527 whole, `accountTransferContract.js` 47 whole,
  `saveAdmission.js` 306 whole, `accountImportBody.js` 740 whole. Two-part
  reading executed; no `ERR_MODULE_NOT_FOUND` on any live-module probe that
  resolved through the tree.
- Edge-bundle membership: none of §7's paths is inlined into the edge bundle
  (`scripts/build-edge-shared.mjs` and `supabase/functions/**` name none of
  them; the single textual hit is a prose reference in a comment), so §385.2's
  regeneration trigger does not apply.
- `package.json` is byte-unchanged — no mint trigger (§349.2).

## 6. Exact contracts

### 6.1 `prepareSettlementEntry(rawEntry, meta)` — restore is OPT-IN

`meta.restoreLifecycle === true` selects the restore arm. Anything else — and
the default — writes the historical reset triple, unchanged to the byte.

This is the load-bearing shape of the whole member. `prepareSettlementEntry` has
exactly **two** production callers, executed census:

| Caller | Surface | Restore? |
|---|---|---|
| `src/store/accountImportBody.js:392` | "Import my data" | **YES** — the user's own estate |
| `src/lib/importReconciliationAdmission.js:516` | reconciliation sessions | **NO** — that slice declares `campaign_state_reset_to_draft`, `ai_overlay_not_imported` and `version_history_not_imported` as its own unsupported-issue contract (`:343`–`:378`) |

A default-ON restore would have silently rewritten the second caller's declared
contract. Opt-in keeps it exact, and the arm that proves it is a live test, not
a comment.

### 6.2 `admitRestoredLifecycle(rawEntry)` — the per-field wall

Returns `{ aiData, campaignState, versionHistory, notices }`. Each field is
admitted alone; a failure falls back to that field's reset value and pushes one
notice naming the field and a plain-language reason.

**The validator enumeration, executed against the live modules** (the charter
required this to be derived at build, and one of its predictions did not
survive the derivation):

| Field | Live validator | Predicate | Fallback |
|---|---|---|---|
| `aiData` | `src/lib/saveAdmission.js` — `admitSavedSettlementEntries`, `recordFields` list | must be a plain record | `{}` |
| `campaignState` | same module, same list | must be a plain record | `{ phase: 'draft', eventLog: [] }` |
| `campaignState.phase` | same module, the `campaign_phase_invalid` arm | must be a non-blank string | `'draft'` |
| `versionHistory` | same module, the `version_history_invalid` arm | must be an array | `[]` |
| `campaignState.eventLog` | ⚠ **NONE EXISTS** | array of plain records | `[]` |

⚠ **The refuted prediction, recorded rather than papered over.** The charter
expected the event log to pass "through the import-reconciliation admission
machinery". Executed reading of `importReconciliationAdmission.js` shows that
module carries a **notice** for `settlement.campaignState`, `settlement.aiData`
and `settlement.versionHistory` — and nothing at all for `eventLog`. There is no
`eventLog` validator anywhere in `src/lib` or `src/domain`. Its wall is therefore
STATED here, at the shape the persisted schema declares (`settlement.schema.js`:
`@property {Object[]} [eventLog]`) and the readers assume — `domain/canonStatus.js`
and `domain/causalViews.js` both walk the array and read fields off each entry, so
a non-record member is precisely what would break them.

After the per-field walls, the assembled candidate is run through
`admitSavedSettlementEntries` — the same wall every Supabase and local read path
runs — and a candidate that somehow fails falls all the way back. Nothing
restored reaches the store without passing the live validator.

### 6.3 `restoreIntraEnvelopeWiring(rawSettlement, { idMap, ownSaveId })`

Pure. Re-addresses one settlement's `neighbourNetwork` and
`interSettlementRelationships` against the batch's completed old-id → new-id map,
in the SAME second pass that already re-addresses the founding parent ref — after
every fresh id is known.

An edge survives only when **every save id it carries** resolves to a settlement
that landed from this same envelope:

- `neighbour.id` — the partner's save id.
- `neighbour.relationshipFrom` / `relationshipTo` — ⚠ **also save ids**, executed:
  `relationshipLinkMetadata` (`domain/relationships/canonicalRelationship.js:285`)
  copies `edge.from` / `edge.to` onto the entry, and `canonicalEdgeForLink` builds
  those from `sourceSave.id` / `targetSave.id`. An edge whose direction cannot be
  re-addressed is DROPPED, because a direction stated in a foreign id is not a
  direction.

`linkId` is re-minted from the ordered pair of fresh ids, so both sides of one
edge compute the identical value — the source `linkId` is the join key the
`interSettlementRelationships` rows ride on, and a per-side mint would split that
join in half. A relationship row whose `linkId` did not survive is dropped.

The generated `generated_<Name>` stub carries a name token rather than a save id,
so it resolves to nothing and rebuilds empty — correct, and asserted.

`neighborRelationship` stays `null`. It is matched **by name** at the save
boundary (`neighbourBackLink.js#findSaveByName`), so restoring it would let an
imported settlement bind itself onto an unrelated save the importer already owns
that merely shares a name. That is the exact hazard the original scrub comment
names, and it is preserved.

### 6.4 The notice channel

`settlementRestoreNotices: Array<{ name, reason }>` — the same shape as the four
notice arrays the import result already carries, rendered in the same "N notices"
disclosure and counted in the same total. No new UI surface, no new component.

## 7. Exact change manifest

| Action | Path | What |
|---|---|---|
| `MODIFY` | `src/lib/accountImport.js` | the restore arm, the per-field wall, the pure wiring re-address (+173/−4 effective) |
| `MODIFY` | `src/store/accountImportBody.js` | passes `restoreLifecycle`, collects notices, calls the wiring re-address in the existing second pass (+26/−2) |
| `MODIFY` | `src/components/account/AccountDataPrivacySection.jsx` | renders the new notice array through the existing channel (+9/−0) |
| `TEST` | `tests/lib/accountImport.test.js` | the pure half: opt-in default, per-field fallbacks, the gallery pinned-absence arm, the wiring arms |
| `TEST` | `tests/store/accountImportSlice.test.js` | the store half: round trip, per-row notices, intra-envelope wiring, the second round trip, service records |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | ONE census re-record block naming its cause and its `censusAuthorization` refs; both moved figures re-derived together at this base by isolation (§9b) |

⛔ **NOT in the manifest, deliberately:** `src/lib/accountData.js` and
`src/lib/accountTransferContract.js` (§4's measured verdict makes them zero-motion),
`src/store/galleryImportSettlement.js` (the distrust surface, byte-untouched and
pinned so), `src/lib/importReconciliationAdmission.js` (its contract is preserved
by the opt-in default, not by an edit), `src/lib/saveAdmission.js` (consumed, never
changed), and every `tests/lint/**` file (this member re-records nothing).

**Zero CREATE rows.** The acceptance matrix is carried entirely by the two
existing suites, so this member adds no test file and reds no census that counts
files. See §9b.

## 8. Ordered coding sequence

1. Measure the exporter branch (§4). Follow the measurement.
2. Census `prepareSettlementEntry`'s callers before touching its signature (§6.1).
3. Add the per-field wall and the pure wiring re-address to `accountImport.js`.
4. Gate the restore behind `meta.restoreLifecycle`; leave the default alone.
5. Wire the account body: the flag, the notices, the second-pass re-address.
6. Render the notices through the existing channel.
7. Write the acceptance arms into the two existing suites.
8. Convict every arm with a mutant, against a green control.
9. Pre-gate sweep, then the full bare gate.

## 9. Acceptance matrix

| id | case | Executed by |
|---|---|---|
| A1 | An account round trip restores `campaignState` (phase, event log, and the whole rest of the block), `versionHistory` and `aiData` deep-equal to the source, in BOTH the saved entry and the live cache, while ownership is still remapped and no embedded id survives | `restores phase, event log, version history and AI prose byte-for-byte` |
| A2 | A tampered event log fails admission → THAT settlement lands with a reset event log, its phase and version history intact, one surfaced notice naming the settlement; its sibling restores whole and NEITHER settlement is refused | `a tampered field resets ALONE, with a notice, while its siblings restore` (+ four pure-half arms over each field) |
| A3 | The gallery importer still writes the distrust reset on all three keys and reaches neither the restore flag nor the restore wall — an anchored absence pin, so a drifted file cannot pass as "correctly excluded" | `keeps the gallery importer on the distrust reset, both keys` |
| A4 | No `id` / `user_id` / `public_slug` / `is_public` crosses the restore surface, and the dormancy strip (wiring, seed, deity bridge) is unchanged by restore | `never lets an ownership or publication field cross the restore surface` (+ the two pre-existing ownership arms, re-run) |
| A5 | A newer-than-this-build envelope is still refused with the update message and writes nothing — re-run against the unchanged v4 ceiling, which §4 proves needed no bump | `rejects a newer-version file with no writes` |
| A6 | Neighbour wiring is restored only where both endpoints landed from this file: both sides point at each other's FRESH ids and agree on one link id, the canonical direction is re-addressed, a dangling endpoint rebuilds empty, no source id appears anywhere in the store, and `neighborRelationship` stays null | `restores neighbour wiring only when both endpoints came from this file` (+ four pure arms) |
| A7 | The SECOND lifecycle path: import → re-export the restored library through the real `buildAccountExport` → import again under a second account. All four fields survive the second crossing and the first generation's fresh ids do not leak into the second | `survives the SECOND lifecycle path: import, re-export, import again` |
| A8 | `serviceRecords` in the envelope are still ignored on the restore surface — absent from the saved entry and from the whole store | `still ignores export-only service records on the restore surface` |

### 9a. Mutants — eight, each convicted against a GREEN control

An all-red sweep with no clean-green control is a broken runner, not evidence.
The control ran first and passed 52/52.

| id | mutation | reds |
|---|---|---|
| M0 | *(control — no mutation)* | **none; 52 passed** |
| M1 | the `eventLog` admission is removed from the wall | 2 (A2's pure and store arms) |
| M2 | the gallery path reaches the restore arm | 1 (A3) |
| M3 | an owner field is carried through the restore surface | 5 (A4 ×3, A1, A7) |
| M4 | one bad field rejects the WHOLE record | 1 (A2's sibling arm) |
| M5 | `relationshipFrom` / `relationshipTo` left un-remapped | 2 (A6 pure + store) |
| M6 | restore made unconditional | 1 (the reconciliation-default arm) |
| M7 | the wiring pass lands source ids verbatim | 3 (A6 pure ×2 + store) |
| M8 | the per-item notices are dropped on the floor | 1 (A2) |
| M9 | the own-key guard on the id map reverted to a bare index | 1 (the prototype-name arm) |
| M10 | the `aiData` wall removed | 1 (the per-field arm) |
| M11 | the `versionHistory` wall removed | 1 (the per-field arm) |
| M12 | the `phase` wall accepts a non-string | 1 (the per-field arm) |

M1–M4 are the charter's four; M5–M9 cover the hazards the build itself found —
the direction-carrying save ids, the reconciliation contract, the id map, the
notice channel, and the prototype-key read below. M10–M12 close the last gap in
the battery: M1 convicted only the `eventLog` wall, so each of the other three
per-field walls is now convicted on its own arm rather than resting on the
family's reputation. M10–M12 ran AFTER the terminal gate, applied to a pristine
copy and reverted; `src/lib/accountImport.js` was proved byte-identical to the
gated tree by sha256 before and after.

⚠ **A hardening the self-review found, and why it cost a gate cycle.** The id map
is indexed by ids that come from the user-supplied file, so `__proto__`,
`constructor` or `valueOf` as a `neighbour.id` would resolve against the map's
PROTOTYPE and read as a landed partner. The production caller already builds its
map with `Object.create(null)`, so this was never a live hole — but an exported
function on a hostile-input path should not rest its safety on how its caller
built an object, and this module's whole header is the promise that it does not.
`resolve` now requires an OWN key; the arm hands it a plain object literal ON
PURPOSE so the guard is proved without the caller's help; M9 convicts it. The
in-flight gate was stopped and re-run against the final tree rather than a
receipt being claimed for a tree that was about to change.

### 9b. Census motion — re-derived at this base, attributed by isolation

`censusAuthorization` §359.10, §402 C3, §409.1. **Zero new test files**, so the
class of red a new file causes cannot fire here, and the three FILE figures of
the estate census are structurally unmoved.

| Key | Before | After | Cause |
|---|---:|---:|---|
| `files` | 2497 | 2497 | no test file added |
| `parked` | 364 | 364 | no park rule touched |
| `credited` | 2133 | 2133 | no file changed credit |
| `titles` | 20719 | **20737** | +13 in `accountImport.test.js`, +5 in `accountImportSlice.test.js` |
| `suiteTitles` | 5785 | **5789** | +3 and +1 `describe` blocks in the same two files |

⛔ **Read, never computed.** Each figure came from the census arm's own failure
message with one test file reverted at a time. Reverting BOTH convicted
`20719 / 5785` **GREEN**, which is the proof that nothing else in this member
touches the census. The suite layer was read under a `-1` sentinel because the
arm is sequenced and `titles` refuses before reaching it. The two deltas close
(5+13=18, 1+3=4) as a CHECK on the readings, never as their source.

**Re-derived at the landing slot `acc466a6` (§13).** The slot's walker carried
`2500/365/2135/20732/5787` (H8B, MF-T2H, WEB-1 and WEB-4 re-recorded between the
build base and the slot). The DELTA `+0/+0/+0/+18/+4` is what crossed the rebase,
never the tuple: the landed tuple is **`2500/365/2135/20750/5791`**, convicted
33/33 at the rebased tree under the shared gate mutex, with the negative control
executed — the slot's own tuple put back reds at `titles` with
"expected 20750 to be 20732", exactly this member's +18 (the arm is sequenced,
so `files`/`parked`/`credited` passed first and `suiteTitles` is proved by the
green run alone).

The test ratchet is separately unmoved: its `totalTests` / `totalFiles` are a
scope FLOOR, not an exact ceiling (`check-test-ratchet.mjs` uses them only in the
`SCOPE_FLOOR_RATIO` collapse detector), so an addition cannot red it. The
banked-failure set is unmoved at **eleven** — this member neither adds an entry
nor cures one.

### 9c. Interior reds and the base reading

Executed at the CLEAN BASE before any edit,
`npx vitest run tests/lint tests/build tests/ops` (the §408 amendment; a narrower
sweep cannot see `tests/ops`): TRUE_EXIT 1, **4 files / 6 tests** red, and every
one of them is outside this member's surface:

| File | Titles | Class |
|---|---:|---|
| `tests/lint/warCostKindPools.walker.test.js` | 3 | BANKED |
| `tests/lint/warRulingKindPools.walker.test.js` | 1 | BANKED |
| `tests/lint/clampPrimitiveBaseline.test.js` | 1 | BANKED |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | 1 | STRAY — the §355 varying-cast class |

**Interior reds from the SEMANTIC change: none.** No test in the estate pinned
the account surface's reset-always behavior: the one arm that asserts the reset
triple (`tests/lib/accountImport.test.js`, `scrubs cross-settlement refs …`)
calls `prepareSettlementEntry` WITHOUT the flag, so the opt-in default keeps it
green unchanged. Nothing was re-pointed and nothing was declared under §359.10.

**Two INSTRUMENT reds the new test arms caused, both cured at their cause:**

1. `tests/lint/negativeAssertionAnchor.walker.test.js` — the new arms carried
   fourteen bare `not.toHaveProperty` / `not.toMatch` sites, over both files'
   frozen ceilings (6 and 9). ⛔ **Cured by ANCHORING, never by raising a
   ceiling or deleting an arm:** every one now goes through
   `expectAbsentWithAnchor` with a real sibling anchor that travels the same
   path (`campaignState` for a key set, the settlement's own name for a
   serialized blob), so a collection that drifted away can no longer pass as
   "correctly excluded". Both files sit back AT their unchanged frozen ceilings
   and the walker is green — the cure made the assertions stronger than the
   ones that reddened it.
2. `tests/lint/sovereigntyLightingContract.walker.test.js` — the estate title
   census. Re-recorded once, with the cause and the `censusAuthorization` refs
   in the block, both moved figures re-derived together (§9b).

**Strays, classified and re-run ONCE (§355).** The base reading's
`sovereigntyLightingContract` red was its `DOOR 3 PARSER DOOR` arm at 20.8s; at
the built tip that same file is green 33/33 in 5.6s. Two more appeared in a
related-suite sweep run while a sibling lane held the test ratchet
(`customContentArchiveTransfer.pglite` at 29.3s, `npcAuthoringScope` at 6.9s);
one quiet re-run of exactly those two files passed 25/25 in 15.8s. All three are
the varying-cast contamination class under CPU contention, none names a file
this member touches, and no second re-run was taken.

## 10. Verification commands — executed, with the exit captured in-shell

| Command | `TRUE_EXIT` | Reading |
|---|---:|---|
| `npx vitest run tests/lib/accountImport.test.js tests/store/accountImportSlice.test.js` | 0 | 52 passed |
| `npx vitest run tests/lint tests/build tests/ops` (the §408 sweep) | 1 | the five BANKED titles only — see §9c |
| `npx eslint` over all six change paths | 0 | clean |
| `npm run typecheck:ratchet` | 0 | 173 errors, ceiling 173 |
| `npm run typecheck:domain:strict` | 0 | 1134 errors, ceiling 1134 |
| `npx vitest run tests/docs/enforcement-claims.test.js` | 1 | the BANKED naked-claim title; all six listed claims pre-existing, none from this member |
| `npm run validate:packets` | 0 | 145 packets, 0 READY |
| `npm run check:tail` (the terminal) | **0** | see below |

**The terminal gate.** One full bare `npm run check` at the final tree.
`GATE_TRUE_EXIT=0` captured in-shell AND `[gate-tail] exit: 0` printed by the
wrapper — the two agree, which is the reading, not either alone. The log was
identified by CWD LINEAGE rather than recency (two gate-tail processes were live
on the box; `lsof -d cwd` named pid 10595 as this lane's).

All seventeen steps ran in order: the eleven validators, `typecheck:ratchet`,
`typecheck:domain:strict`, `lint`, `test:ratchet`, `prebuild`/`build`/`postbuild`,
`verify:dist`. The two figures that carry the verdict:

- `[test-ratchet] OK — no test regressions (11 known failure(s) of 28754 tests, ceiling 11)`
- `[test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 433 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.`

The banked set sits at ELEVEN, its ceiling, unmoved by this member. The gate
waited 25 mutex polls behind a sibling lane's gate and ran its suite at load
13–25, so the reading is a quiet one rather than a contended one.

⚠ **The only post-gate edit is this receipt.** §9a's M10–M12 rows and this
section were written after the terminal run; the production and test trees are
byte-identical to what the gate read (asserted by sha256). `validate:packets`,
`tests/docs/enforcement-claims.test.js` and the `tests/lint tests/build
tests/ops` sweep were re-run over the edited documentation.

## 11. Mandatory STOP conditions

Both of the charter's STOPs were evaluated against measurement and neither
fired:

- **"restore requires SERVER-side shape motion (a column, an RPC)"** — it does
  not. `campaign_state`, `ai_data`, `version_history` and `neighbour_links` are
  existing columns that both write paths (`supabaseSave`, `supabaseUpdate`) and
  both local paths already carry; the restore writes through the seams that were
  already there. No migration, no RPC, no persisted-shape change.
- **"the exporter cannot carry `aiData` within `MAX_IMPORT_BYTES`"** — the
  question is moot on the measured branch: the exporter has always carried it
  (§4), and the envelope preflight has always priced it. This packet moves no
  byte on the export side.

A third STOP was added at build and also did not fire: any need to edit
`importReconciliationAdmission.js` would have meant re-opening another slice's
declared contract. The opt-in default removed the need.

## 12. Completion receipt

Filled by the lane at the built tip; the chair CASes.

- Build base: `claude/composite-r4` at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`,
  resolved with `git rev-parse` at lane start and never typed (the landing slot
  is `acc466a6` — §13).
- Toolchain: isolated worktree, `npx husky` exit 0, `npm ci` exit 0, 468
  `node_modules` entries, `npm ls` exit 0.
- Exporter branch: **v4, zero exporter motion** — measured, not predicted (§4).
- STOPs: both evaluated against measurement; neither fired (§11).
- Acceptance: A1–A8 executed, all green.
- Mutants: two green controls; **twelve** mutants each red by named title (§9a).
- Census: titles and suites only, no new test file, both figures attributed by
  isolation with the both-reverted control green (§9b).
- Instrument reds caused and cured at their cause: the negative-assertion
  ceilings (cured by ANCHORING, neither ceiling raised) and the title census
  (one re-record block, cause and authority named) — §9c.
- Terminal: one full bare gate, `GATE_TRUE_EXIT=0` agreeing with the wrapper's
  own `exit: 0`, all seventeen steps, banked set at ELEVEN of 28754 (§10).
- Ref moves: **NONE.** The lane committed in its own worktree only.
- Landing: rebased onto `acc466a6` and re-proved there by TE-WEB5-LANDING (§13);
  the CAS `acc466a6 → <rebased tip>` is the chair's act.

## 13. The landing slot

Recorded by TE-WEB5-LANDING (the landing executor; it moves no ref).

- Slot: `claude/composite-r4` at `acc466a6e6c15ea904b47c50b2b41732b516b4b1`
  (WEB-4, the 28th landing), re-derived in-shell; the build base `19b799ce` is
  its ancestor with 15 commits between.
- Carry-proof-by-absence at blob level, before the rebase: of the nine delivered
  paths exactly three moved at the slot — the census walker (four re-record
  blocks landed above this member's), `PACKET_MANIFEST.json` (151 rows at the
  slot) and `INDEX.md`. All six src/test hosts are the same blob at base and
  slot, so nothing of this member was re-applied.
- Rebase: `--onto acc466a6 19b799ce`, two commits carried as authored (member,
  then packet). Walker: the slot file byte-for-byte with this member's block
  appended below WEB-4's, tuple = slot + delta (`2500/365/2135/20750/5791`),
  convicted 33/33 and the negative control red by exactly the delta (§9b).
  Manifest: the slot file byte-for-byte plus this row by string surgery, never
  re-serialized — deep-compare 151 → 152, ADDED `["WEB-5"]`, REMOVED `[]`,
  DRIFTED `[]`, prefix and suffix byte-identical. INDEX: keep-both, this row
  above WEB-1's (newest-first), exactly one line added.
- Re-stamps from the post-edit hash: `verifiedBase` → the slot (header and the
  manifest row, the replace scoped to this row's span because RR-2's row shares
  the old base sha); the rebased member sha beside the authored one (header).
  No per-file hash rows and no `_note` tuples exist in this packet's manifest
  row; the three MODIFY hosts are the same blob at base and slot.
- S0, two-part, live at the committed tip: part 1 reds at the tip with the
  schema-10 staleness line that is ALREADY RED AT THE SLOT (baseline lookup at
  the chair's clean baseproof b10ed1a1, byte-identical message — pre-existing,
  mint-class, recorded not cured; none of this member's nine files is in the
  detector tree or the unscanned-input set); part 2 the baseline blob
  `scripts/.observed-shape-readers-baseline.json` is identical at slot and tip
  and lists none of this member's files in its inventory.
- Terminal at the rebased tip: `npm run check:tail` bare, detached; the verdict
  lines are in the lane's landing receipt (`laneTEWEB5-receipt.md`, "THE
  LANDING SLOT"), as is every log path.
