# CULL-PLAN — TUNEREG Car 5

Measured at dock HEAD `1223489c9`. **Nothing was edited, staged, or executed as a test.**

## THE PLAN IS: DO NOT CULL. Delete zero exports.

The census found **no export that is both provably unreferenced and safe to delete.** The
recommended act for the next car is to **retire the cull** and replace it with the two
register repairs in §3, which serve the stated goal — *"the tuning surface the owner signs is
the surface that actually drives the world"* — without deleting a line of live behaviour.

---

## 1. Why there is no deletion list

The intended dead-set was "≈113 tables at zero consumers." Re-derived at HEAD, the estate's
per-export column (`namedDependents`, the J-6 column) puts **140** exports at zero. All 140
were then searched across the whole repo, not just `src/`:

| Class | Count | Why it is NOT deletable |
|---|---|---|
| Used inside its own module | 130 | `const T = X_TUNING;`, `X_TUNING.FIELD` — deleting the export is a `ReferenceError` in the same file. |
| Named-imported by tests / scripts / docs | 6 | e.g. `tests/domain/statefulArmies.test.js:9` imports `ATTRITION_TUNING`. The engine's own rule: *"A TABLE READ BY A TEST ONLY IS NOT DEAD."* |
| Aggregator facade (see §2) | 4 | Zero consumers, but deleting them **removes 21 dials from the register** and trips the growth guard. |

`namedDependents === 0` means **"no other module names this export in an import clause."** It
never meant "no consumer." Reading it as a delete-list is the file-vs-export error one level
down — the J-6 correction applied to files, applied again to *importers vs users*.

## 2. The four facades — the only true zero-consumer bindings

| id | line | keys | shape |
|---|---|---|---|
| `src/domain/worldPulse/reinforcement.js#REINFORCEMENT_TUNING` | 217 | 14 | `Object.freeze({ BASE_FLOW_FRACTION, … })` |
| `src/domain/worldPulse/settlementStrategy.js#STRATEGY_TUNING` | 1287 | 3 | `Object.freeze({ STRATEGY_K, MOVE_SEVERITY, OVERRIDE_SEVERITY })` |
| `src/domain/worldPulse/warIntent.js#WAR_INTENT_TUNING` | 420 | 1 | `Object.freeze({ WAR_INTENT_TTL_TICKS })` |
| `src/domain/worldPulse/mobilizationReactions.js#REACTION_TUNING` | 349 | 3 | `Object.freeze({ REACT_SEVERITY, PRE_EMPT_AGGR, FORTIFY_AGGR })` |

All four are shorthand aggregators whose **members are live module constants** (verified
individually: e.g. `STRATEGY_K` at `settlementStrategy.js:1229`, `MOVE_SEVERITY` at `:879 :934
:955`, `OVERRIDE_SEVERITY` at `:1101`). They exist to give the register a window onto dials
that are otherwise module-private. The engine names this idiom deliberately
(`scripts/lib/tuning-inventory.mjs:717-724`) and records them as `idiom: "aggregator"` with
`expr` leaves.

**Deleting them deletes no value and turns 21 registered dials into unregistered ones.** That
is the opposite of the program's goal.

## 3. What to do instead (the two repairs that serve the goal)

**R1 — Rename the column's meaning in the review, not the estate.** The register should
carry, per row, *how* a table is reached: `module-internal` / `named-import` / `test-only` /
`aggregator-window`. 130 + 6 + 4 is the honest split. The owner then signs a surface annotated
by reach, and nobody re-derives "113 dead tables" from a column that never said that. This is
a register-schema change — **owner-gated** (schema/persistence shape).

**R2 — Correct the 113 claim at its source.** `scripts/lib/tuning-inventory.mjs:545` still
reads *"The estate carries 113 of 206 `_TUNING` tables with no consumer at all."* Both figures
are stale (denominator is now 225) and the phrase **"no consumer at all"** is the sentence that
authored this whole car. Suggested replacement wording: *"no other module names it in an import
clause"* — plus a pointer to this census. A one-line docblock repair; not owner-gated.

## 4. Predicted register/baseline movement — **IN WRITING, instruments NOT run**

If a later car ignores §1 and deletes the four facades anyway, these are my predictions:

| Figure | Now | Predicted after | Basis |
|---|---|---|---|
| `totals.tables` | 225 | **221** | four ids leave `discoverTables` |
| `totals.keys` | 2099 | **2078** | −(14+3+1+3) = −21 |
| `totals.zeroNamedDependentTables` | 140 | **136** | the four leave the population |
| `totals.zeroDependentTables` | 9 | **9** (unchanged) | none of the four is in the file-level nine |
| `totals.unregisteredNamed` | 535 | **555** (+20) | members stop being aggregator leaves |
| `register.tables` rows | 225 | **221** | rows must be hand-deleted from the declared register |
| `totals.bareDecimals` | 6985 | **6985** (unchanged) | P3 skips lines matching the P2 named-const regex |

The **+20** breaks down as reinforcement.js **+14**, settlementStrategy.js **+3**,
mobilizationReactions.js **+2** (`REACT_SEVERITY` is an `Object.freeze`, not a numeric const,
so it does *not* count), warIntent.js **+1**.

### The refreeze WILL REFUSE
`refreezeRefusals()` guards growth in `unregisteredNamed` per file. All four files would grow
with **no `DECLARED_GROWTH` row**, so the ritual returns
`{ refusal: 'POPULATION_GREW' }` naming all four. Clearing it requires, per file: a
`declaredGrowth.unregisteredNamed[<file>]` entry with a **40-hex `introducedAt`** that resolves
to a real commit, a **`cause` longer than 60 characters**, and `sites` ≥ the measured delta.
Authoring four growth rows to launder the deletion of four register windows is the clearest
possible sign the act is backwards.

## 5. Order of operations (only if §3 R2 is taken)

1. Edit the docblock at `scripts/lib/tuning-inventory.mjs:545` only. No `src/` change.
2. `tests/lint/tuningRegister.walker.test.js` asserts the **inventory**, not this comment —
   I predict **no refreeze is required** and the walker stays green.
3. Because `scripts/` is outside `TREES_P1`/`TREES_P2P3`, I predict **no inventory figure
   moves at all**: tables 225, keys 2099, unregisteredNamed 535, bareDecimals 6985.
4. Run the gate at a quiet tree and confirm those four figures are unmoved.

⚠ Any act here must land at a **clean tip** — `refreezeRefusals` returns `DIRTY_TREE` for any
porcelain path outside `allowedDirty`, and this is a shared tree.
