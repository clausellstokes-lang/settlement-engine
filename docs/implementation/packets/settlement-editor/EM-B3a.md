# Settlement editor / wave 1 — EM-B3a: the registry key + travel, the JS half — `dmLayer` and `decrees` ride the save blob, are named by both public projections, join the two client denylist mirrors, and are proved by RUNTIME test to carry into no fork, import, gallery projection, export or anonymous envelope

- **Status:** `DRAFT`
- **Packet version:** `1`
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 at `d31af2ceebf643818201b2e2ab4a556765d2fc7c` (the base moved twice under this compile — see §5's base note; every measured path is byte-identical across the window, proved by blob sha in `EM-B3.evidence.md` §E0)
- **Depends on:** `EM-B2` (the layer on write — the sole writer of both keys; `src/domain/edit/dmLayer.js` is ABSENT at this base, proved E15) **and `EM-B3b`** (the third denylist mirror). ⭐ **B3b LANDS FIRST, and the order is measured, not stylistic:** `tests/security/snapshotDenylistDrift.test.js` asserts only that every CLIENT token is denied by the net-current SQL scanner — never the reverse, and it has no SQL-side subset arm (three tests read whole, E6). So a SQL alternative with no client token reds **nothing**, while a client token with no SQL alternative reds. Landing B3b first therefore costs this split **zero** interior reds. Sequence: **B2 → B3b → B3a → B4**.
- **Collision group:** `NONE at the change-path level.` No wave-1 sibling (EM-A1, EM-A2, EM-A3, EM-B1, EM-B2, EM-B4) names any file in this manifest, and no live packet reserves one (E14: zero non-terminal packets estate-wide; `publicSafe.js` / `worldSnapshotPublic.js` / `accountData.js` have never appeared in a `changeManifest`). The charter's "⚠ collision with anything touching persistProjection" is VOID because `src/store/persistProjection.js` is not modified (chair ruling K1, ACCEPTED). **EM-B3b** shares no path with this packet either — its four targets are `supabase/migrations/202_*.sql`, `scripts/ops/migrationRehearsalCore.mjs`, `tests/ops/migrationRehearsal.test.js` and three docs. Sequence only: **B2 → B3b → B3a → B4**.
- **Commit authority:** `edits only; the chair commits`
- **Baseline posture:** `measured.` Measured at this base and quoted in `EM-B3.evidence.md`: the nine keys of `partializeStoreState` and the `ZUSTAND_PERSIST_KEYS` registry (E1, E3); `mergePersistedState`'s whole body (E4); the `PRIVATE_KEY_RE` / `COVERT_KEY_RE` / net-current-SQL token sets, executed through the drift test's own extractors (E6); `PUBLIC_TOPLEVEL_KEYS` and `toPublicSafe`'s two modes (E7); `WORLD_SNAPSHOT_HARD_DENY` and its three readers (E8); the three travel surfaces plus the export (E9); the observed-shape inventory for every touched file (E10); effective lines under eslint's own `Linter` (E12); the lighting census tuple and the test ratchet's floor semantics (E13). **No gate was run by this lane, and none is claimed.**
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

> ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
> (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).

---

## 1. Reconciled authority

1. **ODQ §934.42** — the owner pauses the push chain and orders the editor built NOW from the packet-train charter, with the consist tip standing in for master. **ODQ §934.36–§934.41** — the design and its addenda.
2. **THE PROMISE** (constitutional) — a seed is a STARTING world forever; the pencil never rewrites what the chronicle recorded. **The product scope** — world-only, setting-agnostic.
3. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` — **§12 GOVERNS**. §12.4 is this packet's charge; §11 ("edits do not travel") and §5 ("Two persisted keys join the saved settlement") are its model.
4. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1 (the `persistProjection` and command-registry rows), §2 (`Decree`, `DmLayer`), §3 (persisted schema), §8 instrument 8 — **as amended by design §12, and as corrected by §5's measured refutations below**.
5. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, row **EM-B3**.
6. `docs/implementation/PACKET_STANDARD.md` and `docs/implementation/preambles/EM-PREAMBLE.md` — the standard and the family's signed invariants (§P2.6 assigns this cost here and to no later member; §P5 HZ-TRAVEL; §P8's travel STOP).
7. Live git state at `d31af2cee`, quoted command by command in `EM-B3.evidence.md`.

**Resolved contradictions.** All four were measured by this compile, raised to the chair, and **RULED by the chair on 2026-09-19 (ODQ §934.36 addendum; the charter's EM-B3 row and ARCH §3 now say what was measured — consist `7aa769830`)**. None was adjudicated by a lane.

- **K1 — ACCEPTED by the chair.** ARCH §3 *"The persisted-key instrument … its key set grows by two"* and the charter's `M src/store/persistProjection.js` → **REFUTED; the charter row is struck, ARCH §3's claim withdrawn, and no store-root key is minted.** `partializeStoreState` is the device-local zustand projection (`persistProjection.js:245`), has no `saveId` (`grep -c saveId` → `0`), and its key set is an exact-equality registry (`tests/store/lifecycleRoundTrip.test.js:141`). Settlement-record keys of this exact class — `mapEdits`, `fogSessions` — appear in **neither**; they ride `row.data = entry.settlement` (`src/lib/saves.js:157`). The packet PRESERVES `partializeStoreState` and does not modify the file.
- ARCH §4 *"`mergePersistedState` validates both against the observed-shape exemptions"* → **REFUTED.** That function (`src/store/persistMerge.js:52`, 107 lines read whole) validates only store-root keys and imports nothing from the register, which is a build-time script. The reload contract is the blob pass-through of `normalizeSettlement` (`:178`, a spread), pinned by the landed `fogSessions` arm.
- **K2 — ACCEPTED by the chair**, and it is why this packet is the `a` half: `decrees` joins the client denylist **with** `supabase/migrations/202_edit_registry_public_denylist.sql`, and that migration plus its rehearsal-train registration is **EM-B3b** (§3's split record). Design §12.4 *"both keys join the three hand-mirrored denylists"* → **ALREADY TRUE FOR `dmLayer` (K4).** `PRIVATE_KEY_RE.test('dmLayer') === true` via `\bdm`, and the net-current SQL scanner denies `dmlayer` via `.*dm.*` (E6). Only `decrees` needs a token — and that token cannot ship client-only (K2).
- **K3 — ACCEPTED by the chair.** The charter's `scripts/check-observed-shape-readers.mjs` REGISTER row leaves this packet: measured E10, its spellings move the register by **zero** rows, and the mint is owed by **EM-B2** (`dmLayer on settlement`) and **EM-C1** (`decrees on settlement`).
- **K4 — RULED by the chair.** EM-B3 carries the public veil, the SQL mirror, the EXPORT omit and the RUNTIME travel test against the existing mechanisms; **the `importScrub` strip is defense-in-depth, DEFERRED and recorded** (§2 non-goals, §12 out-of-scope) — deliberately deferred, documented, not a bug to re-find.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** a saved settlement's `dmLayer` and `decrees` survive save → reload byte-exact inside the save blob, and appear in **no** fork, import, gallery projection, DM-full share, world export, account export or anonymous-draft envelope — proved by runtime test on every one of those surfaces, not by a static walker.

**Definition of done:** `decrees` is denied by the two CLIENT denylist mirrors (`dmLayer` already is, measured; the SQL third mirror is EM-B3b's, landed before this packet); `toPublicSafe`'s full branch and `WORLD_SNAPSHOT_HARD_DENY` name both keys explicitly; `buildAccountExport` omits both from every exported settlement; and eight acceptance cases in two new test files pass, with the existing `snapshotDenylistDrift`, `worldSnapshotDenyCensus`, `gallerySanitizeAllowlist.contract`, `townMapEditsPublicDrop` and `worldExport` suites still green.

In scope:

1. **One primary behaviour** — the two edit keys are veiled and do not travel.
2. **One required integration** — the backup export's omit (`src/lib/accountData.js`), the one seam through which either key could leave the owner's account.
3. **One prevention guard** — the runtime travel test (`tests/lib/editTravel.test.js`, ARCH §8 instrument 8).

Explicit non-goals:

- **The writer.** `src/domain/edit/dmLayer.js`, `applyEdit`, `reapplyLayer`, `DM_ID_NS` and `mintDmId` are EM-B2's. This packet writes no key; it veils, proves and round-trips what B2 writes.
- **The registry's operations** (EM-C1), **the store slice** (EM-C4), **the migration of existing saves** (EM-B4), **every surface** (wave 4).
- **`supabase/migrations/202_edit_registry_public_denylist.sql` and the whole migration-train registration** — **EM-B3b's**, landed BEFORE this packet. Three independent ceilings forced the split (§3).
- ⛔ **THE `importScrub` STRIP — DELIBERATELY DEFERRED, DOCUMENTED, NOT A BUG TO RE-FIND** (chair ruling K4). A settlement-level drop of both keys in `src/lib/importScrub.js` would be defense-in-depth only: measured, the gallery import's source is the server's public projection, which already drops both by the fail-closed allowlist (E7/E9), and the account import's source is an export this packet now omits them from. Building it would add a fourth logic file plus its three call sites (`galleryImportSettlement.js:71`, `galleryImportMap.js:290`, `accountImport.js:617`) and blow the budget. A7(ii) proves the account path end to end without it.
- **The `EXPLAINED_WRITER_EXEMPTIONS` mint** — measured to be earned by B2 and C1, not here (K3, E10).
- **`src/store/persistProjection.js`** — refuted (K1); `partializeStoreState` is preserved and proved by A6, never edited.
- **`_gallery_sanitize_public_json`** (the dossier sanitizer) and **`_gallery_dm_full_json`** — deliberately NOT re-created, for the reason §6 records; migration 136 set the identical precedent for a scanner-only amendment.
- **`src/lib/worldExport.js`** — measured to need no change; it inherits the cure through `toPublicSafe` (E9).
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Measured/priced here |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0 or 1` | **0** (EM-B2 mints them) |
| Named state writers | `0 or 1` | **0** |
| Feature flags | `0 or 1` | **0** (wave 1 is headless; the editor's gate is EM-D1's) |
| User-facing surfaces | `0 or 1` | **0** |
| Direct consumers | `<=2` | **0** |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | **3** — `publicSafe.js`, `worldSnapshotPublic.js`, `accountData.js` |
| Additional registration-only files | `<=3` | **0** |
| Handwritten files total | `<=12` | **5** |
| New/changed effective production lines | `<=400` | **10** (`+2` publicSafe, `+2` worldSnapshotPublic, `+6` accountData) |
| Effective lines per new leaf | `<=250` | n/a — no new leaf |
| Delta in a shared/hot file | `<=15` | **0 hot files touched** (E12: the standing list is `EconomicsTab.jsx`, `OutputContainer.jsx`, `convergence.js`, `peaceTerms.js`, `informationStatecraft.js`); the largest file touched is `worldSnapshotPublic.js` at **332 / 800** effective, 468 lines of headroom |
| Acceptance cases | `<=8` | **8** |

Overrides approved before dispatch: `NONE`.

⚠ **The three-logic-file line is EXACT, and TWO rulings keep it.** K1 struck
`src/store/persistProjection.js` (a fourth logic file). The split below struck
`scripts/ops/migrationRehearsalCore.mjs` (another fourth).

### STOP AND SPLIT — executed, on three independently measured ceilings

The chair's K2 ruling added the migration-train registration to EM-B3's charge and
pre-authorized the split if it overran. **It overruns three ceilings, not one:**

| Ceiling | Budget | Combined EM-B3 | Measurement |
|---|---:|---:|---|
| Existing logic-bearing production files modified | `<=3` | **4** | `publicSafe.js` + `worldSnapshotPublic.js` + `accountData.js` + `scripts/ops/migrationRehearsalCore.mjs`, which is unambiguously logic-bearing: **96** branch tokens and **9** exported functions including `buildMigrationRehearsalPlan` (`:658`) |
| Acceptance cases | `<=8` | **9** | the eight below plus the rehearsal plan's own case (`plan.repoHead` 202, `pendingCount` 2, the live plan at `migrationRehearsal.test.js:418`) |
| Behaviour families | `1` | **2** | the veil-and-travel family, and the migration-train registration family — a different reviewer (the owner's hand at `supabase db push`), a different proof (`migrationRehearsal` · `deployRunbookFreshness` · `architectureFreshness` · `docCounts`) and a different failure mode |

**The split, and it is the smallest one:** **EM-B3b** takes `supabase/migrations/202_*.sql`
and its whole registration — `scripts/ops/migrationRehearsalCore.mjs`
(`MIGRATION_TRAIN_REPO_HEAD` 201→202 plus one ~34-line `MIGRATION_WAVES` row),
`tests/ops/migrationRehearsal.test.js`, `docs/DEPLOY.md`, `ARCHITECTURE.md` and
`docs/CURRENT_STATE.md`; `supabase/applied-head.json` stays at **200** because the deploy is
the owner's hand. **EM-B3a** (this packet) keeps the JS veil, the export omit and the runtime
travel test. **B3b lands first**, which costs the split zero interior reds (see *Depends on*).

Exceeding any limit is a STOP and split, not an invitation to renegotiate.

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- EM-B3
```

Expected: exact packet Markdown and structured capsule emitted; verified-base ancestry and
unchanged declared substrate proved before the seal pins exact HEAD; the four non-CREATE
targets clean, the three CREATE targets absent, and every required symbol resolving;
Git-visible foreign dirt fingerprinted without target overlap.

Any mismatch makes this packet STALE. Stop before coding.

Edit only exact-manifest paths. This lifecycle never creates worktrees, stages, commits,
merges, cleans, infers affected tests, or rules on a semantic line budget.

## 5. Verified tree contract

Every row was resolved by symbol at `d31af2cee`; the command and its output are in
`EM-B3.evidence.md` under the cited section.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **State authority** | `src/lib/saves.js` | `row.data = entry.settlement` (`:157`) | the whole settlement blob IS the `data` column; `SETTLEMENTS_DB_WRITER_COLUMNS` (`lifecycleRoundTrip.test.js:277`) names twelve columns and no blob key (E2) | both keys persist here, with no new column and no new registry row |
| **State authority (device)** | `src/store/persistProjection.js` | `partializeStoreState` (`:245`) | the device-local projection: nine keys, **no `saveId` in the file** (`grep -c saveId` → `0`); its one world is the anonymous draft, written iff `state.draftOrigin === 'anon' && auth.user == null` (E1) | **PRESERVE UNCHANGED.** A6 proves the envelope carries neither key; a MODIFY here is a STOP (K1) |
| **Sole writer** | *(EM-B2)* `src/domain/edit/dmLayer.js` | `applyEdit`, `reapplyLayer` | **ABSENT at this base** (E15) — the named dependency | no second writer; this packet writes neither key |
| **Reader / projection (settlement)** | `src/domain/display/publicSafe.js` | `PUBLIC_TOPLEVEL_KEYS` (`:52`), `toPublicSafe` (`:244`) | a 39-member frozen allowlist holding neither key, iterated at `:357`, so DEFAULT mode drops both by construction; `full: true` **skips that gate** and deep-clones, stripping only the thirteen keys it names (E7) | the full branch must NAME both keys, beside `delete clone.dossierNotes` |
| **Reader / projection (realm)** | `src/domain/display/worldSnapshotPublic.js` | `WORLD_SNAPSHOT_HARD_DENY` (`:68`), `serializeWorldSnapshotPublic` (`:608`) | allowlist-built, covert force-OFF; its census (`tests/security/worldSnapshotDenyCensus.test.js`) asserts `CONDITIONAL_LEDGER_KEYS − allowlist ⊆ HARD_DENY`, disjointness and four named members — **never an exact HARD_DENY set** (E8) | both keys join HARD_DENY; three existing absence assertions then cover them free |
| **Denylist mirror 1** | `src/domain/display/publicSafe.js` | `PRIVATE_KEY_RE` (`:101`) | denies `dmLayer` **today** via `\bdm`; does **not** deny `decrees` (E6) | gains exactly one token, `decrees`, on the existing line |
| **Denylist mirror 2** | `src/domain/display/worldSnapshotPublic.js` | `COVERT_KEY_RE` (`:134`) | denies neither key; `decrees` is not covert/seed/prose class (E6) | **UNCHANGED** — a second token here would be the redundant guard §P6 refuses |
| **Denylist mirror 3** | `supabase/migrations/136_world_snapshot_deny_census_lift.sql` | `public._gallery_world_snapshot_is_safe` | the **net-current** scanner (latest-wins across 201 migrations); 33 alternatives; `sqlDenies('dmlayer') === true`, `sqlDenies('decrees') === false` (E6) | **EM-B3b's**, landed before this packet; this packet asserts it, never edits it |
| **Drift pin** | `tests/security/snapshotDenylistDrift.test.js` | `test.each(JS_TOKENS)('the net-current SQL sanitizer denies the "%s" key (membership)')` (`:78`) | 35 JS tokens ⊆ 33 SQL alternatives today; a 36th client token with no SQL twin **reds** (E6) | never edited; green from the first commit of this packet, because B3b landed mirror 3 first |
| **Normalizer / absence** | `src/domain/normalizeSettlement.js` | `normalizeSettlement` (`:162`, `const out = { ...settlement }` at `:178`) | unknown top-level keys pass through untouched; pinned by `lifecycleRoundTrip.test.js:1917` (`a settlement blob still carrying the retired fogSessions key loads and is ignored`) (E5) | **the unconditional arm.** Absence, empty and null behaviour rest on this pass-through, which runs on every load/save/import with no flag anywhere near it (HZ-PERSIST-UNGATED) |
| **Lifecycle — reload** | `src/store/persistMerge.js` | `mergePersistedState` (`:52`) | handles only store-root keys; **no** settlement-key validation, **no** register import (E4) | PRESERVE UNCHANGED |
| **Lifecycle — fork** | `src/data/sampleSettlements.js` | `forkConfigFor` (`:181`), `forkSeedFor` (`:166`) | `forkConfigFor` returns the sample's config minus `seed`; the seed is the generation ARGUMENT; both call sites then run the generator with `intent: 'sampleFork'` (`src/lib/generationIntent.js:32`) — **a fork is a fresh generation** (E9) | A7(i) proves the forked world carries neither key |
| **Lifecycle — import** | `src/lib/importScrub.js` | `scrubImportedTreasury` (`:87`) | the SINGLE writer for the import dormancy strip, called at the settlement level by **all three** import paths (`galleryImportSettlement.js:71`, `galleryImportMap.js:290`, `accountImport.js:617`) (E9) | **PRESERVE UNCHANGED** — the gallery source is already veiled (E7) and the account source is cured at the export |
| **Lifecycle — export** | `src/lib/accountData.js` | `preflightAccountExport` (`:206`), `buildAccountExport` (`:405`) | `payload.settlements` is built from the store's saved settlements **verbatim**, so a backup export would carry both keys today (E9) | the one export seam; ARCH §3: *"A personal backup export omits them under the same rule"* |
| **Lifecycle — world export** | `src/lib/worldExport.js` | `buildWorldExport` (`:112`) | player variant → default `toPublicSafe`; DM variant → `toPublicSafe({full:true})` — **no covert seam re-implemented here** (E9) | **PRESERVE UNCHANGED**; it inherits both cures |
| **Receipt / audience** | `src/domain/display/publicSafe.js` | `veilPublicPayload` (`:481`) | the ONE call every public payload ends in | unchanged; neither key reaches it |
| **Register** | `scripts/check-observed-shape-readers.mjs` | `EXPLAINED_WRITER_EXEMPTIONS` (`:1140`), `assertExplainedWriterExemptions` (`:1290`) | the inventory carries `decrees on settlement: 1` (`personaSlicer.js:172`) and no `dmLayer` row; `publicSafe.js` carries one row and **none** for its thirteen `delete clone.<key>` statements; `importScrub.js` and `accountData.js` are **ABSENT** (E10) | **PRESERVE UNCHANGED.** The spellings below are chosen so the register moves by zero |
| **Test precedent** | `tests/security/townMapEditsPublicDrop.test.js` | `SM-3 — mapEdits is dropped from the public projection` › `mapEdits is NOT an allowlisted top-level public key` | 43 lines, 2 cases, the exact shape for a library-only settlement key | A3 copies it |
| **Test precedent** | `tests/store/lifecycleRoundTrip.test.js` | `E-C saves envelope …` › `save → list → writeAll → list is a byte-exact fixpoint (the reload/import hop)` | the canonical persistence round trip | A1, A2, A5 copy it |
| **Test precedent** | `tests/lib/importScrub.test.js` | `W-COIN A1.8 — scrubImportedTreasury: imports arrive COINLESS` › `is REFERENCE-IDENTICAL when there is nothing to strip` | settlement-level strip + reference identity | A7(ii) copies it |
| **Test precedent** | `tests/lib/worldExport.test.js` | `buildWorldExport — THE PLAYER VARIANT LEAKS NOTHING COVERT (load-bearing)` | a deep string scan of a whole payload | A7(iii) copies it |
| **Test precedent** | `tests/store/lifecycleRoundTrip.test.js:1937` | `expectAbsentWithAnchor([...PUBLIC_TOPLEVEL_KEYS], 'fogSessions', 'spatialLayout', …)` | the anchored negative over a REAL allowlist | A3 and A8 copy it |

**Base note.** The base moved twice under this compile (`34f320829`, then `023085560`), both
times by the chair and both times docs-only for this surface. Every path in this table is
byte-identical across the window (E0). The verified base stays `d31af2cee`; the chair may
re-stamp it to the tip under J-T1 without re-measuring, **and should**, because
`docs/implementation/preambles/EM-PREAMBLE.md` — the file this header cites by SHA-256 — is
only a committed file from `02968876b` onward.

**Forbidden alternatives:**

- no second writer of `dmLayer` or `decrees`, and no writer at all in this packet;
- no new top-level `worldState` key and no new `settlements` DB column;
- no edit to `src/store/persistProjection.js`, `src/store/persistMerge.js`, `src/lib/saves.js`, `src/lib/importScrub.js`, `src/lib/worldExport.js`, `src/domain/normalizeSettlement.js`, `tests/security/snapshotDenylistDrift.test.js`, `tests/store/lifecycleRoundTrip.test.js`, `scripts/check-observed-shape-readers.mjs`, `scripts/.observed-shape-readers-baseline.json`;
- no addition to `PUBLIC_TOPLEVEL_KEYS` (it is pinned character-identical to the SQL by `tests/security/gallerySanitizeAllowlist.contract.test.js:119`);
- no token added to `COVERT_KEY_RE`;
- no re-serialisation of any manifest or baseline JSON;
- no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```js
// src/domain/display/publicSafe.js — PRIVATE_KEY_RE gains ONE token, on the SAME line.
// dmLayer is ALREADY denied by the existing `\bdm` token (measured) and gains nothing.
export const PRIVATE_KEY_RE = /(secret|private|\bdm|\bgm|guidance|dossierNotes|tabNotes|\bnotes?\b|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|decrees|seed|_config)/i;
// Insert position: immediately before `seed`. Contains-semantics, unanchored, case-insensitive
// — identical to every neighbouring private token, so `appliedDecrees` and `decreesApplied`
// are denied too. The normalizer (tests/helpers/sourceContract.js normalizeAlternative)
// yields exactly one new token, "decrees"; JS_TOKENS goes 35 -> 36.

// src/domain/display/publicSafe.js — inside toPublicSafe's `full` branch ONLY, immediately
// after `delete clone.narrativeNotes;`. Two statements, no guard, no condition.
delete clone.dmLayer;
delete clone.decrees;

// src/domain/display/worldSnapshotPublic.js — two members appended to the FIRST block of
// WORLD_SNAPSHOT_HARD_DENY (the "always-present private worldState keys" block), after
// 'deferredPartyImpacts' and BEFORE the conditional-ledger block, so the census's derived
// comparison over CONDITIONAL_LEDGER_KEYS is untouched.
'dmLayer',
'decrees',

// src/lib/accountData.js — one pure helper + one call inside preflightAccountExport, on the
// settlements list, BEFORE the payload literal at :340. The spelling is a DESTRUCTURE-DROP,
// copied from importScrub.js's scrubImportedConfig, because that spelling is measured to
// carry NO observed-shape inventory row (E10).
/**
 * A saved-settlement entry as an export carries it: the DM's layer and the decree registry
 * are the owner's own save state and never leave it (design §11; ARCH §3).
 * REFERENCE-IDENTICAL when the entry's settlement carries neither key.
 * @param {Record<string, any>} entry a save envelope
 * @returns {Record<string, any>} the same entry, or a copy whose settlement lost both keys
 */
function withoutEditState(entry) { /* exact algorithm in §8 */ }
```

**Return shapes, exactly.** `PRIVATE_KEY_RE` stays a `RegExp` with the `i` flag and one
capture group. `WORLD_SNAPSHOT_HARD_DENY` stays `Object.freeze([...])` of strings.
`toPublicSafe`'s return type is unchanged in both modes. `withoutEditState` returns its input
**by reference** when neither key is present, and otherwise a shallow copy of the entry whose
`settlement` is a shallow copy minus the two keys. Failure/absence result: a non-object or
array `entry`, or an entry whose `settlement` is not a plain object, is returned unchanged.

### State schema

```js
// The two keys, as EM-B2 mints them and as this packet persists and veils them.
// Both are OPTIONAL top-level keys on the settlement record. Neither is a DB column;
// both ride src/lib/saves.js's `row.data = entry.settlement` (:157).
/** @typedef {{ entities: Record<string, Record<string, unknown>>,
 *              minted:   Record<string, object>,
 *              phantoms: Record<string, object> }} DmLayer */   // ARCH §2
/** @typedef {Array<import('...').Decree>} DecreeRegistry */      // ARCH §2
// settlement.dmLayer?: DmLayer
// settlement.decrees?: DecreeRegistry
```

**Absence rules** — identical for both keys, and load-bearing:

- **absent:** the settlement has never been edited. **This is the only state a generated,
  forked or imported world may be in.** No code path in this packet ever materializes either
  key; `normalizeSettlement`'s spread (`:178`) neither creates nor removes them.
- **empty** (`decrees: []`, `dmLayer: { entities: {}, minted: {}, phantoms: {} }`):
  **PERMITTED and DISTINCT from absent** — an edit session that staged nothing, or one whose
  entries were all withdrawn. Persisted verbatim; the round trip preserves `[]` as `[]` and
  never collapses it to absent. (This deliberately differs from `normalizeMapEdits`, which
  collapses an emptied container to `null`; that key is cosmetic and byte-identity with an
  unedited world is its whole contract, whereas an emptied registry is a fact about a save
  the DM opened.)
- **`null`:** **FORBIDDEN as a written value.** No writer emits it. A `null` arriving from a
  hand-edited or half-migrated blob is treated exactly as ABSENT by every reader and is
  never re-emitted as `null`; the pass-through carries it inert, as the landed `fogSessions`
  arm does, and nothing in this packet throws on it.
- **invalid legacy input** (a string, a number, an array where an object is expected):
  treated as ABSENT by readers; carried inert by the blob; never repaired, never deleted.
  Repair belongs to EM-B4's governed migration, not here.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| a save with both keys | `saves.save` / `saves.update` | none | `row.data` carries both, verbatim | none (persistence is silent) |
| a save with both keys | `saves.list` → `normalizeSettlement` | none | both keys unchanged, byte-exact | none |
| a save with both keys | `toPublicSafe(s)` default | `PUBLIC_TOPLEVEL_KEYS` membership | both absent from the projection | none |
| a save with both keys | `toPublicSafe(s, {full:true})` | the explicit delete chain | both absent from the projection | none |
| a realm with member saves | `serializeWorldSnapshotPublic` | allowlist construction + `scrub` | both absent at every depth | none |
| an account with such saves | `buildAccountExport` | `withoutEditState` | both absent from every exported settlement | none |
| a sample | fork (`forkSeedFor` + `forkConfigFor` + generate) | none needed | a fresh world with neither key | none |
| a gallery/account import | `scrubImported*` | the source is already veiled / already omitted | neither key present | none |
| an account-origin world | store write → `partializeStoreState` | `draftOrigin === 'anon' && auth.user == null` is FALSE | no envelope written for this world | none |
| a stored envelope | rehydrate → `mergePersistedState` | `readAnonDraft` | the lifted payload, verbatim | none |

### Ordering and precedence

- **Pipeline position:** the two `delete` statements run inside `toPublicSafe`'s `full` branch, AFTER the AI-prose and DM-notes deletes and BEFORE the seed-carrier deletes — i.e. in the "later-attached DM blocks" run, where `dossierNotes` and `narrativeNotes` already sit. `withoutEditState` runs inside `preflightAccountExport`, after the settlements list is assembled and BEFORE the byte measurement, so the measured size is the size that downloads.
- **Same-tick visibility:** n/a — this packet has no tick.
- **Merge/replace/deduplicate:** n/a — no list is merged. The denylist token is inserted once, at a fixed position.
- **Tie-break:** the SQL alternation order is irrelevant (`~*` over an alternation); the token is placed beside `latentPantheon` for readability, mirroring migration 128's placement.

### Determinism

- **Hash/fork key:** `NONE`. This packet draws no random value, reads no clock and mints no id.
- **Stable enumeration:** `toPublicSafe` default mode iterates `PUBLIC_TOPLEVEL_KEYS` in its frozen order (unchanged); `withoutEditState` preserves the settlements array's order and every surviving key's insertion order (a shallow copy after a destructure preserves it for the `...rest` keys).
- **Rounding/clamping:** none.
- **No-draw behaviour:** `withoutEditState` on an entry with neither key returns **the identical object reference**, so an unedited account's export is byte-identical to today's.

### Flag and dormancy

- **Flag:** `NONE`. Wave 1 is headless and this packet mints no flag.
- **Dormancy:** the whole packet is dormant on a world that has never been edited — every
  arm is a no-op and every projection is byte-identical to today's.
- ⛔ **HZ-PERSIST-UNGATED holds by construction:** the arm that carries persisted state
  (`normalizeSettlement`'s spread) is unchanged and unconditional, and the two new arms
  (`withoutEditState`, the `full`-branch deletes) sit inside no conditional of any flag.
- **Golden posture:** `UNCHANGED`. `tests/property/generatorGoldenMaster.test.js` (525 rows)
  and `tests/property/dossierProseManifest.test.js` must not move; nothing here reaches the
  generator. Motion is a STOP (§P3.1).

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| never here — EM-B2's `applyEdit` is the sole writer; absence is the only state this packet creates | every reader sees ONE record (§P4); this packet adds no domain reader | inside the save blob, `row.data = entry.settlement` (`saves.js:157`); no column, no registry row | `normalizeSettlement`'s spread carries both keys untouched; `[]` stays `[]`, `null` reads as absent and is carried inert | EM-B2's `reapplyLayer`; this packet neither re-applies nor drops | EM-C1/E1's `revertTick`; not this packet | **a fork regenerates from a seed** and carries neither; **an import** receives a source already veiled (gallery) or already omitted (account); **a migration of existing saves** is EM-B4's | DEFAULT: dropped by the `PUBLIC_TOPLEVEL_KEYS` allowlist. FULL (`gallery_share_dm`): dropped by two explicit deletes. REALM: `WORLD_SNAPSHOT_HARD_DENY`. SERVER: the 202 scanner amendment. ANON ENVELOPE: never written, by the `draftOrigin` gate |

### Receipts and privacy

- **Closed kinds:** `NONE` — this packet emits no receipt, no chronicle line and no analytics event.
- **Address chain:** n/a.
- **Numeric-to-word bands:** n/a — wave 1 renders nothing, so prose-numerics is not owed (§P2.7).
- **DM-only fields:** `settlement.dmLayer`, `settlement.decrees` — **the finite list, and it is exactly this packet's subject.** Both are DM-only on every audience, including the owner's own `gallery_share_dm` opt-in, for the reason `publicSafe.js` already records for `customContentRoster`: a publication switch is not a transfer of the author's private working state.
- **Player/public projection:** omitted entirely — never redacted, never summarized, never replaced by a count.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY:` this packet touches no NPC, faction or deity state and no alignment axis.
- **Edit story:** `ENGINE-ONLY:` the DM's edit verbs are EM-B2's (`applyEdit`) and EM-C1's (`stage`/`withdraw`/…). This packet is the persistence-and-veil seam beneath them and exposes no verb.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/display/publicSafe.js` | `PRIVATE_KEY_RE` (`:101`) **and** `toPublicSafe`'s `full` branch (`:244-345`) — ONE row, because a duplicate change path is a `validate:packets` error (`scripts/implementation-packets.mjs:692`; zero of 182 landed packets carry one) | `+2 eff` | **(a)** Insert the single token `decrees\|` immediately before `seed` **on the existing `PRIVATE_KEY_RE` line** — one-line-for-one-line, zero new effective lines. Comment above it that `dmLayer` is already denied by `\bdm` (measured), that contains-semantics also covers `appliedDecrees`, and that the SQL twin lands in the same wave as migration `202`. **(b)** After `delete clone.narrativeNotes;`, add exactly `delete clone.dmLayer;` and `delete clone.decrees;`, with a comment in the voice of the `customContentRoster` block beside it: default mode already drops both through the fail-closed allowlist, full mode skips that gate, and `gallery_share_dm` is a publication switch over authored DM content — not a transfer of the owner's working edit state. |
| `MODIFY` | `src/domain/display/worldSnapshotPublic.js` | `WORLD_SNAPSHOT_HARD_DENY` (`:68`), first block | `+2 eff` | Append `'dmLayer',` and `'decrees',` after `'deferredPartyImpacts',`, i.e. inside the always-present block and **before** the conditional-ledger block, with a comment stating that they are settlement-record keys rather than conditional ledgers, so `worldSnapshotDenyCensus.test.js`'s derived comparison is untouched. |
| `MODIFY` | `src/lib/accountData.js` | `preflightAccountExport` (`:206`) + one new module-private helper `withoutEditState` | `+6 eff` | Add the pure helper of §6/§8 and map the settlements list through it before the payload literal at `:340`. Use the DESTRUCTURE-DROP spelling of `importScrub.js`'s `scrubImportedConfig`, never a property read or `Object.hasOwn`, so the observed-shape register does not move (E10). Return the input by reference when there is nothing to drop. |
| `CREATE` | `tests/store/decreeRegistryPersistence.test.js` | A1, A2, A4, A5, A6 | `n/a` | **5 tests in 2 `describe`s, every title a literal, no `.each`, no loop-generated test** (§P3.4). Copy the shape of `lifecycleRoundTrip.test.js`'s `save → list → writeAll → list is a byte-exact fixpoint`. |
| `CREATE` | `tests/lib/editTravel.test.js` | A3, A7, A8 | `n/a` | **3 tests in 2 `describe`s**, same registration law. ARCH §8 instrument 8: a RUNTIME test, never a static walker. Anchored negatives use `expectAbsentWithAnchor`'s idiom (`lifecycleRoundTrip.test.js:1937`) with `spatialLayout` as the live anchor, and every anchor line carries the `// anchored:` marker on the line immediately above the negative (§P6). |

⚠ **`CREATE`, not `TEST`, for a new test file — measured, not stylistic.** `validate:packets` errors on any non-`CREATE` row whose path is absent (`scripts/implementation-packets.mjs:710`), and the estate's own usage agrees: 134 landed rows on `tests/` paths are `CREATE` (new files) against 287 `TEST` (existing files).

**Generated artifacts:** `NONE`. No file touched sits in an edge-shared bundle closure
(`scripts/build-edge-shared.mjs`'s entries and their transitive imports do not reach
`publicSafe.js`, `worldSnapshotPublic.js` or `accountData.js`); the implementer re-derives that
closure from the committed metas' own `inputs` at preflight rather than trusting this line.

**No other file may be edited.**

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. **Capture the baseline**, in this order, before any edit: (a) the lighting census tuple
   from `tests/lint/.lighting-census-baseline.json`; (b) `JS_TOKENS.length` and the three
   `sqlDenies` answers from the drift test's own extractors; (c) the five existing suites this
   packet must not move — `snapshotDenylistDrift`, `worldSnapshotDenyCensus`,
   `gallerySanitizeAllowlist.contract`, `townMapEditsPublicDrop`, `worldExport` — green.
2. Add the eight acceptance cases as **failing** tests in the two new files.
3. **Prove EM-B3b landed:** `sqlDenies('decrees')` is already `true` at this packet's base.
   If it is not, STOP — the token must not ship ahead of its mirror.
4. `worldSnapshotPublic.js`: the two `WORLD_SNAPSHOT_HARD_DENY` members.
5. `publicSafe.js`: the two `full`-branch deletes, then the `PRIVATE_KEY_RE` token.
   **The drift test stays GREEN across this step, because mirror 3 is already in place.**
6. `accountData.js`: `withoutEditState` and its one call.
7. Run focused verification (§10).
8. Run the wave-end gate and write the completion receipt.

**Bounded algorithm — `withoutEditState`:**

```text
1. If entry is not a plain object, return entry.
2. Let s = entry.settlement. If s is not a plain object (null, array, absent), return entry.
3. If neither 'dmLayer' nor 'decrees' is an own key of s, return entry  (REFERENCE-IDENTICAL).
4. Destructure: const { dmLayer, decrees, ...rest } = s;  (a destructure-drop, never a read)
5. Return { ...entry, settlement: rest }.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | **Main behaviour — the round trip** | a save envelope whose settlement carries `dmLayer` (one edited entity, one minted id, one phantom) and `decrees` (two entries, `orderIndex` 0 and 1, one `pending` one `applied`) | `saves.save → list → writeAll → list` is byte-exact; both keys survive with every field and the array order intact; the DB writer places them inside `data` and mints no column | `tests/store/decreeRegistryPersistence.test.js` |
| A2 | **Dormant/absent** | the same settlement with neither key | the round trip is byte-identical to today's, and neither key is materialized at any hop; `normalizeSettlement` output has neither own key | `tests/store/decreeRegistryPersistence.test.js` |
| A3 | **Counterforce — the default public veil** | a settlement carrying both keys beside allowlisted content | neither key is on `PUBLIC_TOPLEVEL_KEYS` (anchored on the live allowlist with `spatialLayout` as the liveness anchor); `toPublicSafe(s)` drops both and still projects `name` and `institutions` | `tests/lib/editTravel.test.js` |
| A4 | **Boundary — absence vs empty vs null** | three settlements: `decrees: []` + an empty `dmLayer`; `decrees: null` + `dmLayer: null`; `decrees: 'nonsense'` | empty persists and reloads **as empty, not absent**; `null` reads as absent at every reader, is never re-emitted as a written value, and does not throw; the malformed string is carried inert and does not throw | `tests/store/decreeRegistryPersistence.test.js` |
| A5 | **Idempotency** | the A1 settlement, saved twice | the second save is byte-identical to the first; no id is re-minted, no array re-ordered, no key normalized away; a partial `saves.update` of an unrelated field leaves both keys byte-exact | `tests/store/decreeRegistryPersistence.test.js` |
| A6 | **Lifecycle — the anonymous-draft envelope** | a store state holding the A1 settlement with `draftOrigin: 'account'` and a signed-in `auth.user`; and a second with `draftOrigin: 'anon'`, `auth.user: null` | the account-origin state writes **no** envelope for this world (the `anonDraft` slot is untouched — the case-(c) re-emit, not a null); the anon-origin state's envelope is proved byte-identical to the world it carries, so the gate — not a strip — is what keeps edits out; `ZUSTAND_PERSIST_KEYS` is unchanged and holds neither key | `tests/store/decreeRegistryPersistence.test.js` |
| A7 | **Real integration — the three travel surfaces** | (i) a `SAMPLE_SETTLEMENTS` entry forked through `forkSeedFor` + `forkConfigFor` + the generator; (ii) an account export built by `buildAccountExport` over a store holding the A1 settlement plus one unedited save; (iii) a realm serialized by `serializeWorldSnapshotPublic` with every section enabled and the A1 settlement among `memberSettlements` | (i) the forked world has neither own key, and `forkConfigFor`'s output carries no `seed`; (ii) the serialized export string contains neither `"dmLayer"` nor `"decrees"`, every sibling field of the edited save survives byte-exact, and the unedited entry comes back **reference-identical**; (iii) neither key appears at any depth of the snapshot | `tests/lib/editTravel.test.js` |
| A8 | **Privacy boundary — the DM-full share** | the A1 settlement through `toPublicSafe(s, { full: true })` | both keys are absent although the allowlist gate was skipped; `dossierNotes` is absent beside them (the live anchor proving the delete chain ran); an allowlisted sibling and a genuine DM field the opt-in DOES reveal (`npcs[0].secret`) both survive, so the case cannot pass by the projection returning nothing | `tests/lib/editTravel.test.js` |

This table is the entire edge-case budget. **The denylist mirror is deliberately NOT an
acceptance case**: `tests/security/snapshotDenylistDrift.test.js:78` already asserts, for
every client token, that the net-current SQL scanner denies it — a ninth case restating it
would be the redundant second guard §P6's anti-vacuity rules refuse. Its green after step 5
is the proof, and step 1(b) captures the before.

## 10. Verification commands

```sh
# Focused static checks
npx eslint src/domain/display/publicSafe.js src/domain/display/worldSnapshotPublic.js \
  src/lib/accountData.js tests/store/decreeRegistryPersistence.test.js tests/lib/editTravel.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Focused tests — ONE test directory per gated run; acquire the slot for the whole process
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/decreeRegistryPersistence.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lib/editTravel.test.js

# The five suites this packet must not move (two directories, two runs)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/security/snapshotDenylistDrift.test.js tests/security/worldSnapshotDenyCensus.test.js \
  tests/security/gallerySanitizeAllowlist.contract.test.js tests/security/townMapEditsPublicDrop.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lib/worldExport.test.js tests/lib/importScrub.test.js

# The named golden/dormancy proof
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-B3
npm run implementation:resume -- EM-B3

# Wave-end presentation-safe invocation; never pipe
npm run check:tail
```

**Expected:** every command exits `0`. **There is no drift-test interior red in this packet**
— EM-B3b landed mirror 3 first, so `sqlDenies('decrees')` is already `true` and
`tests/security/snapshotDenylistDrift.test.js` is green at every commit. Report actual
counts; do not copy historical counts.

**The train's interior red (named before it exists, per `PACKET_STANDARD.md` "Train landings"):**
`tests/lint/sovereigntyLightingContract.walker.test.js` reds on this member's commit because
the census tuple is an exact equality and this member adds two test files.
**Predicted:** files `2645 → 2647`, parked `383 → 383`, credited `2262 → 2264`,
titles `25009 → 25017` (+8), suiteTitles `6670 → 6674` (+4). Re-derived whole at the terminal;
never patched by hand (§P3.2). Parked is predicted UNCHANGED because every title in both new
files is a literal and neither file generates a test from a loop.

**Registers that do NOT move, measured:** the observed-shape register (E10 — zero rows; the
`EXPLAINED_WRITER_EXEMPTIONS` mint is EM-B2's and EM-C1's, not this member's);
`scripts/.test-ratchet-baseline.json` (E13 — a scope FLOOR, not an equality);
`scripts/mutation-coverage-manifest.json` (no `tests/lint/` file added);
`scripts/.size-baseline.json` (no entry for any touched file, and none is owed);
`scripts/check-writer-reach.mjs` (no `src/domain/edit/**` file in this manifest).

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state;
- resume reports authority, HEAD, foreign-work or receipt-integrity drift;
- **K1 (RULED, ACCEPTED)** — anyone proposes editing `src/store/persistProjection.js` or adding either key to `ZUSTAND_PERSIST_KEYS`. The charter row is struck and ARCH §3's claim withdrawn; re-opening it is a STOP;
- **K2 (RULED, ACCEPTED; SPLIT OUT)** — `EM-B3b` has not landed, or `sqlDenies('decrees')` is still `false` at this packet's base. The `decrees` token must never ship ahead of its SQL mirror: `snapshotDenylistDrift.test.js` reds, and the estate records the gate in the very file being edited (`publicSafe.js:299-305`). Step 3 of §8 is the check;
- **K3 (RULED, ACCEPTED)** — anyone asks this member to execute the `EXPLAINED_WRITER_EXEMPTIONS` mint. The register does not move here; the mint belongs to EM-B2 and EM-C1 as a CHAIR act on a branch cut at the integration tip (§P2.3);
- **K4 (RULED)** — anyone builds the `importScrub` strip. It is deferred defense-in-depth, recorded in §2 and §12; building it adds a fourth logic file plus three call sites;
- any file of EM-B3b's manifest is touched here;
- EM-B2 has not landed, so no writer of either key exists;
- a golden or the prose manifest moves;
- `PUBLIC_TOPLEVEL_KEYS` would gain a member (it is pinned character-identical to the SQL);
- a token would be added to `COVERT_KEY_RE`, or a redundant `dmLayer` token to `PRIVATE_KEY_RE` (measured already covered);
- either key would enter a fork, an import, the gallery projection, an export or the anonymous envelope;
- the persisted shape would gain a DB column, or either key would be normalized away, defaulted, or collapsed from empty to absent;
- any acceptance case needs a ninth sibling.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue
into the next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (predicted: publicSafe `+2`, worldSnapshotPublic `+2`, accountData `+6`, migration `<=60 raw`):
- Acceptance cases A1–A8:
- Focused commands, exits, and counts:
- The named interior red: the drift test's single case between steps 4 and 5, and its green after:
- The lighting census delta, re-derived at the terminal, against the prediction 2647/383/2264/25017/6674:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (posture UNCHANGED):
- Bundle/first-paint result:
- Generated artifacts: `NONE`
- Registers moved: observed-shape `0 rows` / test ratchet `unmoved` / mutation-coverage `n/a` / size-baseline `n/a`:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
  - ⛔ **DELIBERATELY DEFERRED — DOCUMENTED, NOT A BUG TO RE-FIND (chair ruling K4, 2026-09-19).** A settlement-level `dmLayer`/`decrees` drop in `src/lib/importScrub.js`, beside `scrubImportedTreasury`, is defense-in-depth on all three import paths. It is NOT built here: measured, the gallery source is already veiled by the fail-closed allowlist and the account source is an export this packet omits them from, so it guards no reachable gap today — and it would cost a fourth logic file plus edits at `galleryImportSettlement.js:71`, `galleryImportMap.js:290` and `accountImport.js:617`. Revisit if design §11's optional rule ever lands ("the export may carry the layer while every import still strips it"), which is exactly the change that would make the strip load-bearing.
  - `toPublicSafe({full:true})`'s server twin `_gallery_dm_full_json` still re-issues `customContentRoster` / `customContentProvenance` (recorded at `publicSafe.js:299-305` as owner-gated and not landed). Both keys of THIS packet are covered server-side by EM-B3b's scanner amendment, so they do not join that gap — recorded so the next reader does not re-find it as new.
- Judgment calls: `NONE`
