# Settlement editor / wave 1 — EM-B3b: the SQL mirror and its train — migration 202 teaches the net-current gallery scanner to deny `decrees`, and registers itself in the rehearsal train and the three doc heads, with the applied head left at 200 for the owner's hand

- **Status:** `READY`
- **Packet version:** `1`
- **Verified base:** `fixes-2026-09-18-consist` at `80a05c849493f2dc9ad28f3b65043d5c0cf50c39`
- **Last revalidated:** 2026-09-19 at `80a05c849493f2dc9ad28f3b65043d5c0cf50c39` by the chair at promotion — re-pinned from d31af2cee under J-T1: every path in §7 and every suite in §10 proved byte-identical across the window by `git diff --stat` (the chair) and by blob id (the lane's E0).
- **Depends on:** `NONE.` This packet stands alone at the base and is the FIRST of the split to land.
- **Collision group:** `NONE.` No packet in the manifest names any of its six paths; zero non-terminal packets exist estate-wide (E14). **`EM-B3a` shares not one path with it** — that disjointness is what makes the split a split. Sequence: **B2 → B3b → B3a → B4**.
- **Commit authority:** `edits only; the chair commits`
- **Baseline posture:** `measured.` The net-current scanner and its 33 alternatives, executed through the drift test's own extractors (E6); the rehearsal train's constants, wave shape and test pins, read out of the chair's own two cars (E19); `supabase/applied-head.json` read whole (E19); the three doc figures and the freshness regex that admits them (E19). **No gate was run by this lane, and none is claimed.**
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: fece7560b7418c607f41717c9955aef87ad7496add1ee7dc863d1f038d3cd60e)

> ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
> (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).

---

## 1. Reconciled authority

1. **The chair's K2 ruling, 2026-09-19** (ODQ §934.36 addendum, consist `7aa769830`): `decrees` joins the client denylist WITH migration 202 as a CREATE row; the migration must ALSO register in the rehearsal train; `supabase/applied-head.json` stays 200 and the packet says so; split if over budget. **It was over budget on three ceilings, so this is the `b` half** (EM-B3a §3 carries the executed split record).
2. **THE PROMISE** and the deploy law: deployment is the owner's manual act. This packet applies nothing.
3. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` **§12.4** — both keys join the three hand-mirrored denylists and their drift test. This packet is mirror three.
4. `docs/implementation/PACKET_STANDARD.md` and `docs/implementation/preambles/EM-PREAMBLE.md` §P2.6.
5. **The two chair cars this packet copies, by execution:** `1d5c79a34` ("The migration train extends to 201…") and `87b87c406` ("The onboarding docs state the real migration head…"). Their shape is the contract; their one-time builder cure and regex widening are already landed and are NOT re-done here.
6. Live git state at `d31af2cee`.

**Resolved contradictions:** none remain. The four this compile raised were ruled by the chair
and are recorded in EM-B3a §1.

## 2. Outcome

**Observable result:** the net-current server scanner `public._gallery_world_snapshot_is_safe`
denies `decrees` and hard-denies both edit keys, so the third mirror is in place **before** any
client token exists — and the migration is registered in the rehearsal train and the three doc
heads, so the gate's own sentinels stay green.

**Definition of done:** `sqlDenies('decrees') === true` against the net-current scanner;
`MIGRATION_TRAIN_REPO_HEAD` is 202 with a `MIGRATION_WAVES` row for it; the rehearsal test's
plan figures and new tail pin are exact; `docs/DEPLOY.md`, `ARCHITECTURE.md` and
`docs/CURRENT_STATE.md` state 202 with a two-migration gap; `supabase/applied-head.json` is
**unchanged at 200**; and four acceptance cases pass.

In scope:

1. **One primary behaviour** — the server-side denial of `decrees`.
2. **One required integration** — the rehearsal train's wave row and repo head.
3. **One prevention guard** — the rehearsal test's exact plan figures and its by-id tail pin.

Explicit non-goals:

- **Applying the migration.** `supabase db push` is the owner's hand. This packet's SQL is inert until then, and `supabase/applied-head.json` is deliberately **NOT** edited.
- **The client denylist token, both public projections, the export omit and the runtime travel test** — all **EM-B3a's**, landed after this packet.
- **`_gallery_sanitize_public_json`** (the dossier sanitizer) and **`_gallery_dm_full_json`** — deliberately NOT re-created; §6 records the measured reason and migration 136's identical precedent.
- **The rehearsal builder's boundary cure and the freshness regex's singular widening** — already landed in `1d5c79a34` / `87b87c406`; re-doing either is a STOP.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Measured/priced here |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0 or 1` | **0** (no table, no column, no row) |
| Named state writers | `0 or 1` | **0** |
| Feature flags | `0 or 1` | **0** |
| User-facing surfaces | `0 or 1` | **0** |
| Direct consumers | `<=2` | **0** |
| New logic-bearing production leaves | `<=2` | **0** |
| Existing logic-bearing production files modified | `<=3` | **1** — `scripts/ops/migrationRehearsalCore.mjs` (96 branch tokens, 9 exported functions) |
| Additional registration-only files | `<=3` | **1** — `supabase/migrations/202_edit_registry_public_denylist.sql` |
| Handwritten files total | `<=12` | **6** (3 of them DOC, which cost no production lines) |
| New/changed effective production lines | `<=400` | **<= 95** (`<=34` the wave row, `+0` the head constant, `<=60` SQL raw) |
| Effective lines per new leaf | `<=250` | n/a — no new leaf |
| Delta in a shared/hot file | `<=15` | **0 hot files touched**; `migrationRehearsalCore.mjs` carries no `scripts/.size-baseline.json` entry and no ceiling near its size |
| Acceptance cases | `<=8` | **4** |

Overrides approved before dispatch: `NONE`.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B3b
```

Expected: the five non-CREATE targets clean, the one CREATE target absent, every required
symbol resolving, foreign dirt fingerprinted without target overlap. Any mismatch makes this
packet STALE. Stop before coding. Edit only exact-manifest paths.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **State authority (the mirror)** | `supabase/migrations/136_world_snapshot_deny_census_lift.sql` | `create or replace function public._gallery_world_snapshot_is_safe` | the **net-current** scanner, latest-wins across 201 migrations; 33 alternatives; `sqlDenies('dmlayer') === true`, `sqlDenies('decrees') === false` (E6) | its body is copied VERBATIM into 202, with two additive changes and nothing else |
| **The pin that compels it** | `tests/security/snapshotDenylistDrift.test.js` | `the net-current SQL sanitizer denies the "%s" key (membership)` (`:78`) | asserts every CLIENT token ⊆ SQL alternatives, **one-directional** — three tests read whole, no SQL-side subset arm, floors of 30 on both sets (E6) | ⭐ this is why B3b lands FIRST and costs zero interior reds: a SQL alternative with no client token reds nothing |
| **State authority (the train)** | `scripts/ops/migrationRehearsalCore.mjs` | `MIGRATION_TRAIN_REPO_HEAD` (`:19`, value `201`), `MIGRATION_WAVES` (`:30`), `buildMigrationRehearsalPlan` (`:658`) | the builder admits any WAVE BOUNDARY as the applied head and refuses a head inside a wave (the cure landed in `1d5c79a34`); it throws when `repoHead !== MIGRATION_TRAIN_REPO_HEAD` (E19) | the head becomes 202 and one wave row is appended; the builder is NOT touched |
| **Sole scope sentinel** | `tests/ops/migrationRehearsal.test.js` | `covers the exact applied-head to repository-head gap in semantic waves` | pins `plan.repoHead` `201`, `plan.pendingCount` `80`, the boundary list ending `[201, 201]`, `Array.from({ length: 80 }…)`, `MIGRATION_WAVES.at(-1).to === MIGRATION_TRAIN_REPO_HEAD`, and at `:418` the live plan `{ appliedHead: 200, repoHead: 201, pendingCount: 1 }` (E19) | each figure moves by exactly one; the historical `at(-N)` pins were already re-pointed BY ID in `1d5c79a34`, so **none of them rots** |
| **Applied-head ledger** | `supabase/applied-head.json` | `"appliedHead": 200` | verified against the production project after the owner's 2026-09-16 push; its own note says to bump it *"in the SAME commit/PR as the `supabase db push`"* (E19) | **PRESERVE UNCHANGED.** Editing it is a STOP |
| **Doc head** | `docs/DEPLOY.md` | `**Current migration head: \`201_staff_unlock_surveyor_entitlement.sql\`**` | derived from disk by `tests/docs/deployRunbookFreshness.test.js` (E19) | one line, 201 → 202 |
| **Doc count** | `ARCHITECTURE.md` | `- **migrations/** (201)` | derived from the filesystem by `tests/docs/architectureFreshness.test.js` (E19) | one line, 201 → 202 |
| **Doc head + gap** | `docs/CURRENT_STATE.md` | `migrations are contiguous to 201 at` (`:5`), `Working-tree migration head 201 is 1 migration ahead` (`:79`) | the freshness arm's regex is `/migration head (\d+) is (\d+) migrations? ahead\s+of the live-verified production head (\d+)/`, widened to admit the SINGULAR in `87b87c406` — so the **PLURAL** two-migration form this packet writes was already admitted (E19) | head → 202; the gap sentence → `2 migrations ahead`, naming 202 and whose hand it waits on |
| **Test precedent** | `scripts/ops/migrationRehearsalCore.mjs` | the `staff-unlock-surveyor-entitlement` wave (`from: 201, to: 201`, 34 lines) | the exact shape of a one-function, forward-only wave row | 202's row copies it field for field |
| **Test precedent** | `tests/ops/migrationRehearsal.test.js` | the `201` tail block added by `1d5c79a34` | the by-id `plan.waves.find((wave) => wave.id === …).toMatchObject` idiom | 202's tail pin copies it |
| **Negative control** | `tests/security/galleryWorldSnapshotScanner.pglite.test.js`, `tests/security/gallerySanitize.pglite.test.js` | their fixtures | **zero** occurrences of any `decree*` token (`grep -nio 'decree[a-z]*'` → no output), so no fixture key is newly rejected (E19) | proves the new alternative rejects nothing that exists |

**Forbidden alternatives:**

- no edit to `supabase/applied-head.json`, and no `supabase db push`;
- no edit to `buildMigrationRehearsalPlan` or any other function in the rehearsal core;
- no re-creation of `_gallery_sanitize_public_json` or `_gallery_dm_full_json`;
- no edit to `tests/docs/architectureFreshness.test.js` (its regex already admits this packet's plural), `tests/docs/deployRunbookFreshness.test.js`, or `tests/security/snapshotDenylistDrift.test.js`;
- no client-side denylist edit (that is EM-B3a's, and shipping it here would invert the safe order);
- no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```sql
-- supabase/migrations/202_edit_registry_public_denylist.sql
-- The body of 136's public._gallery_world_snapshot_is_safe, VERBATIM, with exactly two
-- additive changes and no other character altered:
--
--   (1) hard_deny gains two members, appended after the existing always-present keys:
--         'dmLayer', 'decrees'
--   (2) the private-channel alternation gains ONE alternative, beside .*latentPantheon.*:
--         || '|.*decrees.*'
--
-- `create or replace`, same signature, no re-grant. publish_map (089) and the saved_maps
-- write guard (091) call it by name and re-point automatically.
-- @rollback: recreate 136's body verbatim (drop the two hard_deny members and the one
-- alternative). Nothing is destroyed: the function holds no state and mints no row.
```

```js
// scripts/ops/migrationRehearsalCore.mjs
export const MIGRATION_TRAIN_REPO_HEAD = 202;   // one-line-for-one-line, +0 eff

// …and ONE wave appended to MIGRATION_WAVES, last, copying the 201 row field for field:
Object.freeze({
  id: 'edit-registry-public-denylist',
  from: 202,
  to: 202,
  purpose: /* exact prose: design §12.4 — one re-stated SECURITY DEFINER function;
     _gallery_world_snapshot_is_safe is 136's body verbatim plus two hard_deny members
     and one alternation alternative, so a stored gallery world snapshot carrying the
     settlement editor's dmLayer or decrees is rejected server-side. It creates no table,
     no column, no policy and no row; deployment remains the owner's manual act. */,
  rollback: Object.freeze({ mode: 'forward-only', reason: /* FORWARD_ONLY_REASON + the
     @rollback line's own spelled reversal, in the 201 row's voice */ }),
  expectedObjects: Object.freeze([
    Object.freeze({ kind: 'function', name: '_gallery_world_snapshot_is_safe' }),
  ]),
}),
```

**Return shapes, exactly.** `MIGRATION_TRAIN_REPO_HEAD` stays a number. `MIGRATION_WAVES`
stays `Object.freeze([...])` of frozen wave objects with the five keys
`id, from, to, purpose, rollback` plus `expectedObjects`. The SQL function's signature,
return type, `SECURITY DEFINER` posture and grants are byte-unchanged.

### State schema

No schema change. **No table, no column, no policy, no index, no row, no grant.** The
migration re-states one function body. This is why `expectedObjects` names a single
`function` and why the rollback classifies forward-only with its reversal spelled out.

Absence rules: n/a — nothing optional is introduced.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| repo head 201, applied head 200, gap 1 | this packet's commit | none | repo head 202, applied head **200**, gap **2** | the three doc lines + the wave row |
| a stored gallery snapshot carrying `decrees` at any depth | `publish_map` / the `saved_maps` write guard | the new alternation alternative | **rejected** server-side | the RPC's own refusal |
| a snapshot carrying neither key | the same call | unchanged | accepted exactly as today | none |
| the rehearsal plan | `buildMigrationRehearsalPlan` with ledger 200 | 200 is a wave boundary (the `1d5c79a34` cure) | one more planned wave; `pendingCount` 2 | the plan |
| the owner runs `supabase db push` | out of scope | — | applied head 202, bumped in that same act | not this packet's |

### Ordering and precedence

- **Pipeline position:** migration 202 is the last file in `supabase/migrations/`; the wave row is the last member of `MIGRATION_WAVES`; the tail pin is the last block of the rehearsal test's gap case. All three orders are asserted by `MIGRATION_WAVES.at(-1).to === MIGRATION_TRAIN_REPO_HEAD`.
- **Relative to EM-B3a:** **this packet lands FIRST.** Measured (E6): the drift test is one-directional, so mirror three may precede its client token but never follow it.
- **Merge/replace/deduplicate:** `create or replace` replaces the function in place; the historical waves are kept as the record they are (the builder filters by `wave.from > appliedHead`).
- **Tie-break:** the alternation's order is irrelevant under `~*`; the alternative is placed beside `.*latentPantheon.*`, mirroring migration 128's placement.
- **The number:** `202` is free (`supabase/migrations/` runs to `201_staff_unlock_surveyor_entitlement.sql`, E14) and is re-assigned at dispatch if another lane has taken it — in which case every figure in §7 moves with it.

### Determinism

- **Hash/fork key:** `NONE`. No PRNG, no clock, no locale.
- **Stable enumeration:** `MIGRATION_WAVES` is a literal array in migration order; the plan derives from it.
- **Rounding/clamping:** none.
- **No-draw behaviour:** a snapshot carrying neither key is accepted byte-identically to today.

### Flag and dormancy

- **Flag:** `NONE`.
- **Dormancy:** ⚠ **THE MIGRATION IS INERT UNTIL THE OWNER APPLIES IT.** Nothing in this packet changes production behaviour; the repository simply sits two migrations ahead of the applied head, visibly, which `validate:migration-head` surfaces by design.
- ⛔ **HZ-PERSIST-UNGATED:** nothing here is gated on a flag, and no persisted-state normalization is introduced or moved.
- **Golden posture:** `UNCHANGED`. Nothing reaches the generator.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| the SQL file and one wave row | `buildMigrationRehearsalPlan`; `publish_map` and the `saved_maps` guard at runtime | nothing new persists | n/a | n/a | the `@rollback` line: recreate 136's body verbatim | this IS the migration; the applied head moves only in the owner's own push commit | **the point of the packet** — the server refuses a stored snapshot carrying either key |

### Receipts and privacy

- **Closed kinds:** `NONE`.
- **DM-only fields:** `settlement.dmLayer`, `settlement.decrees` — the two keys this scanner learns to refuse.
- **Player/public projection:** rejection, not redaction: the scanner returns `false` and the write is refused whole.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY:` no alignment axis is touched.
- **Edit story:** `ENGINE-ONLY:` this is a deployment-train and server-guard packet; it exposes no DM verb.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `supabase/migrations/202_edit_registry_public_denylist.sql` | `public._gallery_world_snapshot_is_safe` | `<=60 raw` | Copy 136's definition VERBATIM and make exactly the two additive changes of §6. Write 136's own header idiom: what moved, why, the `@rollback` line, and the recorded reason the sibling dossier sanitizer `_gallery_sanitize_public_json` is deliberately left net-current (`decrees` is a settlement-ROOT key its top-level allowlist already drops; no nested occurrence exists or can exist; the drift test pins the SCANNER). State that the applied head stays 200 and deployment is the owner's manual act. |
| `MODIFY` | `scripts/ops/migrationRehearsalCore.mjs` | `MIGRATION_TRAIN_REPO_HEAD` (`:19`) and `MIGRATION_WAVES` (`:30`) | `+34 eff` | `201` → `202` on the existing line (+0 eff), and append ONE wave row copying the `staff-unlock-surveyor-entitlement` row field for field (34 lines). **Do not touch `buildMigrationRehearsalPlan` or any other function** — the boundary cure already landed in `1d5c79a34`. |
| `TEST` | `tests/ops/migrationRehearsal.test.js` | `covers the exact applied-head to repository-head gap in semantic waves`; the live-plan arm at `:418` | `n/a` | Move exactly five figures and add one block: `repoHead` `201`→`202`; `pendingCount` `80`→`81`; append `[202, 202]` to the boundary list; `Array.from({ length: 80 }…)` → `{ length: 81 }`; `:418`'s live plan → `{ appliedHead: 200, repoHead: 202, pendingCount: 2 }`; and one tail pin `plan.waves.find((wave) => wave.id === 'edit-registry-public-denylist')` in the 201 block's voice. **Add no new `describe`** — the figures live inside the existing case, so the lighting census moves by titles only where §10 predicts. |
| `DOC` | `docs/DEPLOY.md` | the `**Current migration head:**` line (`:198`) | `n/a` | `201_staff_unlock_surveyor_entitlement.sql` → `202_edit_registry_public_denylist.sql`. One line. |
| `DOC` | `ARCHITECTURE.md` | `- **migrations/** (201)` | `n/a` | `(201)` → `(202)`. One line. |
| `DOC` | `docs/CURRENT_STATE.md` | `:5` the contiguous head; `:79` the migration-train gap | `n/a` | Head `201` → `202`; the gap sentence to `202` and `2 migrations ahead`, naming 202 as design §12.4's gallery-scanner denial of the editor's two keys and saying it waits on the owner's `supabase db push` beside 201. The freshness regex already admits the plural (measured) — **do not touch `tests/docs/architectureFreshness.test.js`**. |

**Generated artifacts:** `NONE`. No touched file sits in an edge-shared bundle closure; the
implementer re-derives that closure from the committed metas' own `inputs` at preflight.

**No other file may be edited.** In particular **not** `supabase/applied-head.json`.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. **Capture the baseline:** `MIGRATION_TRAIN_REPO_HEAD`, the rehearsal test's five figures, the three doc figures, `supabase/applied-head.json`'s `appliedHead`, and `sqlDenies('decrees') === false` against the net-current scanner.
2. Add the four acceptance cases as **failing** assertions.
3. Write `supabase/migrations/202_edit_registry_public_denylist.sql`.
4. `scripts/ops/migrationRehearsalCore.mjs`: the head constant, then the wave row.
5. `tests/ops/migrationRehearsal.test.js`: the five figures and the tail pin.
6. The three doc lines.
7. Run focused verification (§10).
8. Run the wave-end gate and write the completion receipt.

**Bounded algorithm — the SQL edit:**

```text
1. Extract 136's `create or replace function public._gallery_world_snapshot_is_safe … $$;`
   slice VERBATIM (the same latest-wins anchor the drift test uses).
2. In the hard_deny array literal, append 'dmLayer', 'decrees' after the last
   always-present key.
3. In the `key ~* ('^(' || … || ')$')` alternation, insert `|| '|.*decrees.*'` on its own
   line immediately after the `.*latentPantheon.*` line.
4. Change NOTHING else — not a comment, not whitespace, not the covert whole-key group.
5. Prepend the header and append the @rollback line.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| B1 | **Main behaviour — the server denies it** | the net-current scanner extracted latest-wins across the migrations, exercised in pglite | the scanner rejects a snapshot carrying `decrees` at any depth and one carrying `dmLayer`; `sqlDenies('decrees')` is now `true` | `tests/ops/migrationRehearsal.test.js` (the wave's own arm) + the existing `tests/security/snapshotDenylistDrift.test.js`, which needs no edit |
| B2 | **Counterforce — nothing existing is newly rejected** | the existing pglite scanner and sanitizer fixtures | every fixture that passed before still passes; measured, they carry **zero** `decree*` tokens, so the new alternative rejects nothing that exists | `tests/ops/migrationRehearsal.test.js` |
| B3 | **The train plans it** | `buildMigrationRehearsalPlan` with the live ledger | `repoHead` `202`, `pendingCount` `2`, the boundary list ends `[202, 202]`, coverage is `Array.from({ length: 81 }, …)` from 122, `MIGRATION_WAVES.at(-1).to === MIGRATION_TRAIN_REPO_HEAD`, and the tail wave matches by id with `expectedObjects` naming the one function | `tests/ops/migrationRehearsal.test.js` |
| B4 | **The applied head does not move** | `supabase/applied-head.json` | `appliedHead` is still `200`; the repo head is `202`; `validate:migration-head` surfaces exactly two pending migrations; the doc gap sentence says `2 migrations ahead` and the freshness regex accepts it | `tests/ops/migrationRehearsal.test.js` + the existing `tests/docs/architectureFreshness.test.js` and `tests/docs/deployRunbookFreshness.test.js`, neither edited |

Four cases, against a ceiling of eight. The drift test and the two doc-freshness suites are
**not** restated as cases: they already assert these properties, and a restatement would be
the redundant second guard §P6's anti-vacuity rules refuse.

## 10. Verification commands

```sh
npx eslint scripts/ops/migrationRehearsalCore.mjs tests/ops/migrationRehearsal.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ops/migrationRehearsal.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/docs/architectureFreshness.test.js tests/docs/deployRunbookFreshness.test.js \
  tests/docs/docCounts.test.js tests/docs/migrationAppliedHead.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/security/snapshotDenylistDrift.test.js tests/security/galleryWorldSnapshotScanner.pglite.test.js \
  tests/security/gallerySanitize.pglite.test.js

npm run validate:migration-head
npm run check:packet -- EM-B3b
npm run implementation:resume -- EM-B3b
npm run check:tail
```

**Expected:** every command exits `0`. **There is no interior red in this packet** — it adds a
SQL alternative with no client token, and the drift test is one-directional (measured), so
every existing suite is green at every commit.

**Lighting census:** this packet adds **no test file** and **no `describe`**; it adds
**one** literal test title only if the implementer gives B1/B2's arms their own `it`, which
§7 permits inside the existing case. **Predicted: files 2645 → 2645, parked 383 → 383,
credited 2262 → 2262, titles 25009 → 25009+n, suiteTitles 6670 → 6670**, where `n` is the
exact count of new `it` titles the implementer writes — declared in the receipt, and the
census re-derived whole at the terminal.

**Registers that do NOT move, measured:** the observed-shape register (no `src/` file is
touched); `scripts/.test-ratchet-baseline.json` (a scope floor, and no test file is added);
`scripts/mutation-coverage-manifest.json` (no `tests/lint/` file); `scripts/.size-baseline.json`
(no entry for any touched file); **`supabase/applied-head.json` (200, by law)**.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state;
- **anyone edits `supabase/applied-head.json` or runs `supabase db push`.** The deploy is the owner's hand, and the ledger's own note requires the bump to ride that same act;
- the client denylist token would be added here (that is EM-B3a's, and shipping it here inverts the safe order);
- `buildMigrationRehearsalPlan` or any other rehearsal-core function would need to change — the boundary cure already landed in `1d5c79a34`, and a second cure means a premise died;
- `tests/docs/architectureFreshness.test.js`'s regex would need widening — measured, it already admits the plural;
- `_gallery_sanitize_public_json` or `_gallery_dm_full_json` would need re-creating;
- migration number `202` is taken at dispatch and the packet's figures have not been moved with it;
- any pglite fixture is newly rejected by the added alternative;
- a golden or the prose manifest moves.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (predicted: migration `<=60 raw`, rehearsal core `+34 eff`, test `~25 lines`, three DOC lines):
- The migration number actually taken, and every figure moved with it:
- Acceptance cases B1–B4:
- Focused commands, exits, and counts:
- `supabase/applied-head.json`: unchanged at `200` — confirm by diff:
- `validate:migration-head` output, naming exactly two pending migrations:
- The lighting census delta, with `n` stated:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (posture UNCHANGED):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
