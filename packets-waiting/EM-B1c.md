# Settlement editor / EM-B1c — the five delegating home ops: three renames that run the existing cascade, one world fact, one scheduled event

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ The branch has moved repeatedly under this lane; `d31af2cee` **IS an ancestor** of every tip
  seen and every path this packet measures is **blob-identical** across the window. Held under
  **J-T1**.
- **Last revalidated:** 2026-09-19, `d31af2cee`
- **Depends on:** **`EM-B1a`** (it authors `OP_TYPES`, the two closed vocabularies, `makeOp`,
  `validateOp` and `WORLD_CONDITIONS`; this packet appends five rows), **`EM-P3`**
  (`set-world-fact`'s config′ keys come from its one canonical home) and **`EM-A2a`/`EM-A2b`** (the
  seven world-fact pools its payload names). Lands **after B1a, in T6**.
- **Collision group:** **`EM-B1a`** and **`EM-B1b`** — all three write `src/domain/edit/operations.js`
  and `tests/domain/editOperations.test.js`. ⛔ **They serialize: B1a → B1b → B1c** (or B1a → B1c →
  B1b; the two appenders are mutually disjoint in rows but not in files).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: the faction/NPC cascade's pure-domain
  entry points **and** the settlement rename's **store-side** one; the canon event catalogue and
  its **non-authorable** exclusion set; EM-P3's `WORLD_FACT_SOURCES` shape. Census tuple
  `2645 / 383 / 2262 / 25009 / 6670`. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)

---

## 1. Reconciled authority

1. ⭐ **ODQ §934.47 ADDENDUM 10 (ledger `fa3b3fb32`) — EM-B1c IS RATIFIED** on the line the lane
   pre-declared: the three `rename-*` ops, `set-world-fact`, and **`schedule-event` as the
   nineteenth HOME op**. B1a returns under its cap with the remaining fourteen.
2. **ODQ §934.50 / design §18** — `requires: { world, registry }`; `schedule-event` **requires
   nothing**, its `when` at or after the next tick, and its event is **drawn from the pulse's own
   catalogue, never free text**.
3. **design §12.3** — names are JOIN KEYS; a rename is a typed op that **runs the existing
   cascade**.
4. **ODQ §934.45 / design §14 FINAL** — a world fact re-derives with pins; **the engine is
   EM-B2's**, and this packet declares the op only.
5. **THE PROMISE**; **`EM-PREAMBLE.md`** §P2–§P8 — cited by hash.
6. Live code at `d31af2cee` — which refines two of the five rows (§2).

**Resolved contradictions:** none outstanding. Two measured refinements are recorded at §2 and
neither blocks.

---

## 2. Outcome, and the two measured refinements

**Observable result:** five more home op types exist, each **delegating to machinery the estate
already owns** — that is the family: *ops whose work belongs to another module.*

**Definition of done:** `OP_TYPES` holds B1a's fourteen plus these five; the three renames name
the cascade and **write no name field themselves**; `set-world-fact` names its config′ key from
EM-P3's canonical home and its `value` pool per fact; `schedule-event` names the catalogue reader
by symbol and its `when` floor; the leaf stays inside 250.

### ⚠ R-1 · `rename-settlement`'s cascade is STORE-SIDE, unlike its two siblings

| op | the entry point it declares | shape |
|---|---|---|
| `rename-faction` | `factionRenameChanges(settlement, oldName, newName)` | ✅ **pure domain** → `{ changed, touched, changes }` |
| `rename-npc` | `npcRenameChanges(settlement, oldName, newName)` | ✅ **pure domain** |
| `rename-settlement` | ⚠ **`renameSettlementImpl(get, set, id, newName)`** — `src/store/settlementRenameHelpers.js:77` | ⛔ **a STORE impl**: it takes the slice's `get`/`set` (an Immer producer), reads `new Date().toISOString()`, and returns `true` when a canon flavor entry was recorded |

⇒ the third rename has **no pure-domain form to delegate to**. Its declared writer is therefore a
STORE path, reached through EM-C4's single generic adapter — **not** callable from `src/domain/edit`
(§P4 forbids a domain module reaching the store). The row declares it **as data** (a named writer
the adapter resolves), exactly as the other two declare theirs, and this packet calls none of the
three. **RAISED R1.**

### ⚠ R-2 · `schedule-event`'s catalogue has an explicit NON-AUTHORABLE exclusion set

```
$ sed -n '8,12p' src/domain/events/authoritativeCanonEventTypes.js
export const AUTHORITATIVE_CANON_EVENT_TYPES = Object.freeze(['CUT_TRADE_ROUTE', 'CREATE_ROUTE']);
$ sed -n '109,119p' src/domain/events/affordanceManifest.js
export const NON_AUTHORABLE_EVENTS = new Set([
  'KILL_LEADER', 'CUT_TRADE_ROUTE', 'DAMAGE_INSTITUTION', 'DEMOTE_NPC', 'REFUGEE_WAVE',
  'PLAGUE', 'RAID_OR_MONSTER_ATTACK', 'REMOVED_THREAT', 'STARTED_RIOT',
]);
```

⇒ the estate **already rules which events a DM may author**, and `CUT_TRADE_ROUTE` is
authoritative **and** non-authorable at once. `schedule-event`'s `event` payload is therefore
constrained by `NON_AUTHORABLE_EVENTS` **as an exclusion, by reference** — never a re-typed list.
A4 asserts a non-authorable type is rejected. **RAISED R2.**

In scope: (1) the five rows; (2) no integration — headless; (3) the prevention guard is A2's
no-name-write scan.

Explicit non-goals: **the cascade itself** (existing, untouched); **`rederive` and every pin**
(EM-B2); the event catalogue's own membership (the estate's); EM-B1a's fourteen rows and EM-B1b's
eleven; any golden, tuning or migration.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` — ops that delegate to existing machinery | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `0` — appends to B1a's | ≤2 |
| Existing logic-bearing production files modified | **`1`** (`operations.js`, B1a's) | ≤3 |
| Handwritten files total | `2` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈50 (estimate)** | ≤400 |
| **`operations.js` after B1a + B1b + B1c** | ⭐ **≈213–231 + 50 = ≈263–281 … see §3.1** | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `6` | ≤8 |

Overrides approved before dispatch: `NONE`.

### §3.1 · ⛔ THE COMBINED FILE, RE-MEASURED AFTER THE SPLIT — and it still does not fit

The chair asked for B1a's lines re-measured after the split. Executed as arithmetic over the same
per-row figures the lane has used throughout:

| packet | rows | per row | rows total | machinery | `requires.world` | **file total** |
|---|---:|---:|---:|---:|---:|---:|
| **EM-B1a** | 14 home | 8–9 | 112–126 | 87 | +14 | **≈213–227 of 250** ✅ |
| **EM-B1c** (this) | 5 | 8–9 | 40–45 | — | +5 | **+45–50** |
| **B1a + B1c in `operations.js`** | 19 | | | | | ⛔ **≈258–277 of 250** |

⇒ **the split fixed B1a alone; appending B1c to the same file puts it over again.** EM-B1b already
took **option O1** — its own leaf `operationsOffStage.js` with a two-line spread — and **the same
shape resolves this**: this packet CREATES `src/domain/edit/operationsHomeDelegating.js` (≈50) and
spreads it in `operations.js` by **+2 effective**, leaving B1a at ≈213–227 and every leaf inside
the cap.

⛔ **The manifest below is written that way**, because the chair's own O1 precedent settles the
shape and the alternative is squeezing rows the chair forbade. ⚠ It is a departure from the
ruling's literal wording — *"MODIFIES `operations.js` by its rows"* — so it is **RAISED as R3**,
and if the chair prefers the literal form, only §7's two rows change.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1c
```

Expected: capsule emitted; ancestry proven; **CREATE targets ABSENT**
(`src/domain/edit/operationsHomeDelegating.js`, and `tests/domain/editOperations.test.js` PRESENT
since B1a creates it); `src/domain/edit/operations.js` **present and clean** — true only once
**EM-B1a has landed**; every `requiredSymbols` row resolving.

⚠ **Three packets write two files.** Confirm B1a is terminal and B1b's state before the seal;
DRAFT reserves as READY does.

---

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Cascade — faction | `src/domain/factionRename.js` | `factionRenameChanges` | `(settlement, oldName, newName) → { changed, touched, changes }`; deep-clones only present `CASCADE_BUCKETS` | `rename-faction`'s declared writer |
| Cascade — NPC | `src/domain/factionRename.js` | `npcRenameChanges` | the same pair for NPCs | `rename-npc`'s declared writer |
| The join surfaces | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES`, `NPC_RENAME_SURFACES` | Frozen `{ path, kind, why }` rows; the NPC family SPREAD across `NPC_HOMES` *"so the two homes cannot drift"* | A2 scans them to prove this module re-implements none |
| ⚠ Cascade — settlement | `src/store/settlementRenameHelpers.js` | `renameSettlementImpl` | `(get, set, id, newName) → boolean` — **a STORE impl** taking the slice's `get`/`set`, reading `new Date().toISOString()` | `rename-settlement`'s declared writer, resolved by **EM-C4's adapter**, never called from `src/domain/edit` |
| Event catalogue | `src/domain/events/authoritativeCanonEventTypes.js` | `AUTHORITATIVE_CANON_EVENT_TYPES` | Frozen `['CUT_TRADE_ROUTE', 'CREATE_ROUTE']` | `schedule-event`'s catalogue reader |
| ⛔ The exclusion | `src/domain/events/affordanceManifest.js` | `NON_AUTHORABLE_EVENTS` | A frozen `Set` of **nine** types a DM may not author | ⛔ Read **by reference** as an exclusion; never re-typed |
| World-fact home | `src/data/worldFactOptions.js` | `WORLD_FACT_SOURCES` | ⚠ **Does not exist at this base — EM-P3 creates it.** Its shape is `{ terrain: '…#TERRAIN_WEIGHTS', culture: '…#CULTURES', tradeAccess: '…#TRADE_ACCESS', … }` | `set-world-fact`'s config′ keys. **Not named in `requiredSymbols`** — it does not yet exist |
| B1a's machinery | `src/domain/edit/operations.js` | `OP_TYPES`, `WORLD_CONDITIONS`, `makeOp`, `validateOp` | ⚠ **Does not exist at this base** — EM-B1a creates it | Extend; never fork a second catalogue or validator |
| Test precedent | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q …')` | One literal `describe`, straight-line `it` | Copy (§P3.4) |

**Forbidden alternatives:** ⛔ **no rename logic of any kind in this module** — the three ops
DELEGATE (HZ-JOINKEY); ⛔ no `rederive`, pin or re-derivation (EM-B2's, HZ-DERIVED); ⛔ no re-typed
event list and no free-text event; ⛔ no second `OP_TYPES`, validator or stage vocabulary; no
import of a PRNG, `rngContext`, `src/store/**` or `src/components/**`; no files outside the manifest.

---

## 6. Exact contracts

| op | `target` | `payload` | `stage` / `consequence` | `requires.world` |
|---|---|---|---|---|
| `rename-faction` | `faction` | `{ newName: { kind: 'free', required: true } }` | `home` / `home` | `[]` |
| `rename-npc` | `npc` | `{ newName: { kind: 'free', required: true } }` | `home` / `home` | `[]` |
| `rename-settlement` | `settlement` | `{ newName: { kind: 'free', required: true } }` | `home` / `home` | `[]` |
| `set-world-fact` | `settlement` | `{ fact: { kind: 'enum', values: <the seven>, required: true }, value: { kind: 'pool', pool: '<per fact>', required: true } }` | `home` / `home` | `[]` |
| `schedule-event` | `settlement` | `{ event: { kind: 'enum', values: <the catalogue minus NON_AUTHORABLE_EVENTS>, required: true }, when: { kind: 'int', required: true } }` | `home` / `home` | ⭐ **`[]` — "always" (§18)** |

⛔ **`newName` is `kind: 'free'` and that is correct, not a lapse.** A name is the estate's one
`free-cascade` field (§12.3): typeable, but **a change is this typed op, which runs the existing
cascade**. The freedom is in the value; the safety is in the delegation. A2 pins that this module
writes no name field itself.

⛔ **`schedule-event`'s `when` floor:** `when >= nextTick`. Scheduling into the past is rejected by
`validateOp` with a named error — never silently clamped, because a clamp would apply a decree at a
tick the DM did not choose. A5 pins it.

⛔ **`set-world-fact` resolves no pool and re-derives nothing** — it validates `fact` membership
and `value` presence only; EM-B2 owns `rederive`. The per-fact pool mapping is **data** citing
EM-P3's `WORLD_FACT_SOURCES`, never a second copy.

**Determinism:** ⛔ no random number, no clock, no locale. `when` is an integer the caller
supplies; **this module reads no current tick** — the floor is validated against a `nextTick`
passed in `world`, so the op stays pure. **Golden posture: UNCHANGED** — nothing imports the leaf.

**Lifecycle:** nothing persisted here; an `Op` persists only inside a `Decree` (EM-B3's key).

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operationsHomeDelegating.js` | `HOME_DELEGATING_OP_TYPES` | **250 cap; ≈50 est.** | The five rows of §6, each with all ten declared fields. Import the vocabularies from `operations.js`. ⛔ Author no rename logic, no `rederive`, no event list. |
| `MODIFY` | `src/domain/edit/operations.js` | the `OP_TYPES` composition | **+2 eff** | One import and one spread — the O1 shape EM-B1b already uses. Nothing else moves. |
| `MODIFY` | `tests/domain/editOperations.test.js` | arms C1–C6 | `n/a` | Append to B1a's single literal `describe`; straight-line `it`, no `.each`/nesting. Re-assert the combined totality. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL** — no edit. |

Generated artifacts: `NONE`.

### The registration ledger

| # | Obligation | Verdict |
|---|---|---|
| P2.1 | lighting census | **OWED — `+0 files / +6 titles`** only: this packet adds **no new test file**, appending six arms to B1a's. |
| P2.2 | mutation-coverage row | ⭐ **NOT OWED — the chair's condition is not met**: *"only if a new `tests/lint` file appears."* None does. |
| P2.3 | observed-shape | **NOT OWED** — no save-time key read. |
| P2.4 | writer-reach | **CANNOT MOVE** — `SURFACE_CLOSURE_STOP` includes `'src/store/'`. |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** — no chooser, no pool, no draw. |
| P2.7 | prose-numerics | **NOT OWED** — no figure rendered. |

> ⛔ **THE CENSUS ROW IS DEFERRED** — no edit; the manifest omits the path.

---

## 8. Ordered coding sequence

0. Dispatch and seal — only after **EM-B1a has landed**; re-read `git rev-parse HEAD` in the same
   command; confirm B1b's state.
1. Capture the baselines: the census figures; `sha256` of the golden fixture; ⚠ **an executed
   `max-lines` measurement of `operations.js`** so the +2 spread is proved to fit.
2. Append C1–C6 to `tests/domain/editOperations.test.js`, **failing**.
3. Implement the five rows — the three renames first (they share a payload shape), then
   `set-world-fact`, then `schedule-event`.
4. Add the import and the spread in `operations.js` (+2).
5. Wire consumers: **NOT APPLICABLE** — lands DARK. Record as skipped.
6. Registrations: none owed (§7). The prevention guard is C2's no-name-write scan.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

---

## 9. Acceptance matrix

| ID | Case | Required observation |
|---|---|---|
| **C1** | **Main + the combined totality re-asserted** | `OP_TYPES` holds exactly **B1a's fourteen + B1b's eleven + these five = thirty**, set-equal both directions with a full offender list, so a row dropped by any of the three reds here. Every new row carries all ten fields; keys stay `compareCodepoint`-ordered over the composition; **all three source maps are asserted frozen** (a spread freezes only the outer object). |
| **C2** | **⛔ THE RENAMES DELEGATE AND WRITE NO NAME (the prevention guard)** | Each of the three declares `target`, a single required `newName`, `stage:'home'`, `consequence:'home'`, and its declared writer by name — `factionRenameChanges`, `npcRenameChanges`, `renameSettlementImpl`. ⭐ A source scan proves this module **writes no name field and re-implements no path in `FACTION_RENAME_SURFACES` or `NPC_RENAME_SURFACES`**, with the matcher proved live on a planted assignment. |
| **C3** | **`set-world-fact` names EM-P3's home and resolves nothing** | `fact` validates against exactly the seven world-fact keys; `value` presence is required; the per-fact pool mapping cites `WORLD_FACT_SOURCES` and is asserted to contain **no second copy** of any option list. A source scan proves **no `rederive` call and no pool import** — the §14 engine stays EM-B2's. |
| **C4** | **⛔ `schedule-event` reads the catalogue and refuses the non-authorable** | Its `event` values derive from `AUTHORITATIVE_CANON_EVENT_TYPES` **minus `NON_AUTHORABLE_EVENTS`**, read **by reference** — a source scan proves neither list is re-typed. ⭐ `'CUT_TRADE_ROUTE'`, which is authoritative **and** non-authorable, is asserted **rejected**; `'CREATE_ROUTE'` accepted; a free-text event rejected. Anchored by the accepted case first. |
| **C5** | **The `when` floor, and no clamp** | `when` at `nextTick` and after validates; `when` before `nextTick` returns `{ ok: false }` with a named error and is **asserted not to be clamped** — the returned op is unchanged, because a clamp would apply a decree at a tick the DM did not choose. A non-integer `when` is rejected. |
| **C6** | **Purity, dormancy and the import fence** | `makeOp`/`validateOp` stay pure over the new rows (input payload unmutated against a clone); the module's import list contains **none of** a PRNG, `rngContext`, `src/store/**`, `src/components/**`, or `src/domain/factionRename.js` (it names the cascade as DATA, never imports it); a scan finds **zero importers** of the new leaf, with guard-the-guard arms on the walk and the matcher. |

**6 of ≤8.**

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/operationsHomeDelegating.js src/domain/edit/operations.js \
  tests/domain/editOperations.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1c
npm run implementation:resume -- EM-B1c
```

Expected: every command exits `0`, except the named census interior red until the terminal.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: **EM-B1a has not landed**; the seal is
missing or foreign; HEAD is not `d31af2cee` or a descendant proved non-interfering; **any leaf
measures > 250 effective lines**, or the `operations.js` edit exceeds **+2 effective**; **rename
logic would have to be written here**; `rederive`, a pin or a pool resolution appears necessary;
**an event list would have to be re-typed** or a free-text event admitted; a non-authorable event
would have to be accepted; `when` would have to be clamped rather than rejected; a golden or the
prose manifest moves; `renameSettlementImpl`'s signature has changed; EM-P3's
`WORLD_FACT_SOURCES` does not exist at dispatch.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **with
`operations.js`'s combined figure measured by eslint's `Linter`** · acceptance C1–C6 executed ·
the mutants planted, convicted and restored digest-exact (§P6) · focused commands, exits and counts
· sealed per-step receipt and resume status · both typecheck configurations · gate stages actually
executed · base-versus-wave failure identity diff · dormancy/golden result · census tuple before
and at the tip with the interior red quoted verbatim · generated artifacts `NONE` · deviations
`NONE | STOP` · out-of-scope observations · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ⚠ **`rename-settlement` has no pure-domain cascade.** Its only entry point is `renameSettlementImpl(get, set, id, newName)` — a **store impl** taking the slice's `get`/`set` and reading the wall clock — while `rename-faction` and `rename-npc` both have pure `*Changes` forms. The row declares it as data for EM-C4's adapter to resolve, since `src/domain/edit/**` may not reach the store (§P4). Ratify, or docket a pure `settlementRenameChanges` beside its two siblings. |
| **R2** | ⚠ **`schedule-event`'s catalogue already has a DM-authoring rule**, and it is sharper than "the pulse's own catalogue": `NON_AUTHORABLE_EVENTS` (nine types) excludes some of what `AUTHORITATIVE_CANON_EVENT_TYPES` admits — `CUT_TRADE_ROUTE` is in **both**. The op reads the exclusion by reference and C4 pins it. Confirm that the editor inherits the estate's existing authoring rule rather than a new one. |
| **R3** | ⛔ **THE COMBINED FILE STILL DOES NOT FIT, RE-MEASURED.** B1a's fourteen rows come to ≈213–227 of 250 ✅ — the split worked for B1a alone — but appending this packet's five puts `operations.js` at **≈258–277**. The ruling's literal wording is *"MODIFIES `operations.js` by its rows"*; the lane has instead taken **EM-B1b's own O1 shape** (a sibling leaf `operationsHomeDelegating.js` + a two-line spread), because it is the chair's own precedent and the alternative is the squeeze the chair forbade. **If the chair prefers the literal form, only §7's two rows change** — but then the cap is exceeded and a fourth split is owed. |
