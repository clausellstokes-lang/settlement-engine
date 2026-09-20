# EM-B1c — compile evidence

Every fact `EM-B1c.md` and `EM-B1c.manifest.json` call verified is proved by a command below with
its real output. **Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. Read-only in
`$SP/consist` and the ledger; wrote only under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no
writing script.

## §0 · The base

`d31af2cee` confirmed before any measurement; an ancestor of every tip seen; every measured path
blob-identical across the window. Worktree clean of this lane's work. Held under **J-T1**.

## §1 · `requiredSymbols` — proved present, verbatim

```
1  src/domain/factionRename.js                        :: export function factionRenameChanges
1  src/domain/factionRename.js                        :: export function npcRenameChanges
1  src/domain/factionRename.js                        :: export const FACTION_RENAME_SURFACES
1  src/domain/factionRename.js                        :: export const NPC_RENAME_SURFACES
1  src/store/settlementRenameHelpers.js               :: export function renameSettlementImpl
1  src/domain/events/authoritativeCanonEventTypes.js  :: export const AUTHORITATIVE_CANON_EVENT_TYPES
1  src/domain/events/affordanceManifest.js            :: export const NON_AUTHORABLE_EVENTS
```

⚠ **`WORLD_FACT_SOURCES` is NOT named** — `src/data/worldFactOptions.js` is measured **ABSENT** at
this base (EM-P3 creates it), and the validator resolves rows against the live tree at every
status. The packet cites it in prose and depends on EM-P3 instead.

## §2 · ⚠ R-1 — `rename-settlement`'s cascade is STORE-SIDE

```
$ grep -n "^export" src/store/settlementRenameHelpers.js | head -5
77:export function renameSettlementImpl(get, set, id, newName) {
316:export async function renameFactionImpl(get, set, factionIndex, newName) {
422:export async function renameNpcImpl(get, set, npcIndex, newName) {
$ sed -n '70,80p' src/store/settlementRenameHelpers.js
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @returns {boolean} true when a canon flavor entry was recorded.
export function renameSettlementImpl(get, set, id, newName) {
  const trimmed = String(newName || '').trim();
  const now = new Date().toISOString();
```

⇒ it takes the slice's `get`/`set` and reads the wall clock. `rename-faction` and `rename-npc`
have **pure-domain** `*Changes` forms; the settlement rename has none. The row declares the store
path **as data** for EM-C4's adapter, since `src/domain/edit/**` may not reach the store (§P4).
**RAISED R1.**

## §3 · ⚠ R-2 — the catalogue already carries a DM-authoring rule

```
$ sed -n '8,11p' src/domain/events/authoritativeCanonEventTypes.js
export const AUTHORITATIVE_CANON_EVENT_TYPES = Object.freeze([
  'CUT_TRADE_ROUTE',
  'CREATE_ROUTE',
]);
$ sed -n '109,119p' src/domain/events/affordanceManifest.js
export const NON_AUTHORABLE_EVENTS = new Set([
  'KILL_LEADER', 'CUT_TRADE_ROUTE', 'DAMAGE_INSTITUTION', 'DEMOTE_NPC', 'REFUGEE_WAVE',
  'PLAGUE', 'RAID_OR_MONSTER_ATTACK', 'REMOVED_THREAT', 'STARTED_RIOT',
]);
```

⇒ **`CUT_TRADE_ROUTE` is authoritative AND non-authorable at once.** `schedule-event`'s values are
the catalogue **minus** the exclusion, both read **by reference**; C4 pins the rejection. The
editor inherits the estate's existing rule rather than minting one. **RAISED R2.**

## §4 · ⛔ R-3 — the combined file, re-measured after the ratified split

| packet | rows | per row | rows | machinery | `requires.world` | file total |
|---|---:|---:|---:|---:|---:|---:|
| EM-B1a | 14 | 8–9 | 112–126 | 87 | +14 | **≈213–227 of 250** ✅ |
| EM-B1c | 5 | 8–9 | 40–45 | — | +5 | +45–50 |
| **B1a + B1c in one file** | 19 | | | | | ⛔ **≈258–277 of 250** |

⇒ **the split fixed B1a alone.** The lane takes EM-B1b's own **O1** shape — a sibling leaf plus a
two-line spread — because it is the chair's precedent and the alternative is the squeeze the chair
forbade. This departs from the ruling's literal *"MODIFIES `operations.js` by its rows"*.
**RAISED R3.**

## §5 · CREATE absence and collision

```
$ for p in …; do [ -e "$p" ] && echo EXISTS || echo ABSENT; done
ABSENT src/domain/edit/operationsHomeDelegating.js
ABSENT src/data/worldFactOptions.js          (EM-P3 creates it)
```

⚠ **Three packets write two files** (`operations.js`, `editOperations.test.js`): B1a creates them,
B1b and B1c append. They serialize; DRAFT reserves as READY does.

## §6 · Registration

Census **`+0 files / +6 titles`** — no new test file; six arms appended to B1a's.
⭐ **No mutation-coverage row is owed**: the chair's condition was *"only if a new `tests/lint`
file appears"*, and none does. Writer-reach cannot move (`SURFACE_CLOSURE_STOP` includes
`'src/store/'`). No observed-shape, chooser or prose-numerics obligation.

## §7 · What this lane did NOT do

Ran no vitest, eslint or writing script. Wrote nothing in the consist or the ledger. Named no
symbol it did not prove present, and deliberately did **not** name `WORLD_FACT_SOURCES` (absent)
or the symbols this packet creates. Raised no budget. **Adjudicated nothing:** R1–R3 are the
chair's.
