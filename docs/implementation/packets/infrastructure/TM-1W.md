# TM / TM-1W — the engine/telemetry wall walker (member 3 of `tm-core`, the §117.3 mint)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6b337fb1f7bb1d3dde0810310a01a3653c874aac`
  (the `mb` terminal; the tm+sk family's dispatch base)
- **Train:** `tm-core`, family **TM**, member **3** of 5 (stage 1 of 2).
- **Depends on:** TM-1A, TM-1B — Arm B's roots and Arm D's dims are the registry's,
  and the emitter must exist for the telemetry roster to be non-vacuous.
- **Preamble:** none — TM is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§117.3** · **§102.3** · **§120.2** ·
  **§141** (the soak-harness charter's §2.2 obligation, discharged here) · **§149**.
- **Compile of record:** `laneTC28-TM-PLAN.md` §3.3, annex rows `TM.M5`, `TM.M11`,
  `SK.M13`; laws `TM.L2`, `TM.L5`.

---

## §1 · WHY THIS IS MACHINERY AND NOT A DESIGN SENTENCE

§117.3 + THE PROMISE: telemetry informs SUGGESTION, never engine math. The
hazard-conversion law says a rule of that shape is MACHINERY FROM BIRTH or it is
nothing. The existing `telemetrySimulationSeparation.test.js` is the seed — but its
census denominator is `src/domain/worldPulse` **alone**, and §117.3 asks for the
union of the deterministic-core roots. This walker measures all four and **folds
that file in rather than duplicating it**: the old file is DELETED in this member,
and its four arms survive as A′, F and the detector self-test.

## §2 ⚠ · WHY THE `worldPulse` FLOOR IS ASSERTED SEPARATELY

A union floor over four roots stays green when a whole root is deleted, because the
other three still clear it. That is the redundant-guard-subsumption shape this
estate has already convicted once — a `live` flag hid a deleted counter and the
mutant passed 7/7. Each root carries its own floor, and `worldPulse` is
additionally asserted by name so the fold provably lost no coverage. Merging them
would be tidier and would be the defect.

## §3 ⛔ · `scripts/soak` IS IN THE ROOTS PIN FROM BIRTH, AND ITS EMPTINESS IS NAMED

The soak-harness charter §2.2 obliges Arm B's census to cover `scripts/soak/**`,
and that directory does not exist at this base — the harness family's own SK-1
creates it. A non-empty floor over an absent directory is a vacuous arm. So the
root is DECLARED in the exact-set `ARM_B_ROOTS` pin, its emptiness is NAMED in a
shrink-only `AWAITING_POPULATION` list, and the walker asserts that every root is
either populated-and-floored **or** listed — a root in neither state reds, and a
root in BOTH states reds too (a stale row is a floor nobody is enforcing). SK-1
removes the row and supplies the floor.

⭐ **The same idiom is reused for Arm D's DDL half**, which is what lets this member
land before the migration exists: `SIM_METRIC_MIGRATIONS` declares
`196_world_sim_metrics.sql` and `AWAITING_MIGRATION` names it as not-yet-minted.
TM-2A supplies the file and removes the row — lawful because this packet is
TERMINAL by then, which is what the train's two-stage promotion buys.

## §4 ⭐ · WHAT THE MEASUREMENT FOUND: THE EXEMPTION MANIFEST IS EMPTY AT BIRTH

Executed over the union of the four roots (1,043 files) with the forbidden class
`/analytics|telemetr|simMetric|ingest/i`: **ZERO violations.** Executed over the
Arm B roster (11 files) with `/worldPulse|worldState|generateSettlementPipeline|
simulationRules/i`: **ZERO violations.** So `ARM_A_EXEMPTIONS` is EMPTY — an
exemption row here would silence a violation that does not exist. That is the same
birth idiom the estate's three other allowlists carry, and it is why Arm C's proof
is its three PLANTED CONTROLS rather than its live row count.

## §5 · SCOPE AND BOUNDARY

One new walker, one deleted walker, one manifest row swapped surgically. Nothing
under `src/` is edited. **Same-seed: NEUTRAL.**

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the detector catches static, dynamic and require spellings in both directions |
| A2 | no deterministic-core module imports telemetry, and each of the four roots clears its own floor |
| A3 | `worldPulse`'s floor is asserted separately, so a deleted root cannot hide inside the union |
| A4 | no telemetry module imports engine internals, and every Arm B root is populated-or-awaiting |
| A5 | the exemption manifest is exact, rationale-carrying, shrink-only, and its controls convict |
| A6 | the simulation class is PII-free in the registry and in its own DDL, with the DDL half awaiting TM-2A |
| A7 | the ingest path refuses every simulation metric name by closed-set membership |
| A8 | the retired file's four arms survive the fold, and its mutation-coverage row moves with it |

## §7 · CHECKS

```
npx vitest run tests/lint/engineTelemetryWall.walker.test.js tests/lint/mutationCoverageManifest.test.js
```

## §8 · MUTANTS AND HAZARDS

- **EXECUTED ESTATE MUTANT.** `import { track } from '../../lib/analytics.js';` was
  planted at the top of the REAL `src/domain/worldPulse/tickIndices.js`. **Both**
  Arm A and Arm A′ came back exit 1 naming the file and the specifier — which is
  the receipt that the fold lost no coverage. Restored, `cmp` exit 0.
- ⛔ **§102.3:** `tests/lint/` is an enforcer dir, so this member OWES a
  mutation-coverage row and mints one. ⚠ **The deleted file's row is REMOVED in the
  SAME member** or the no-stale-entries arm reds; the manifest is edited surgically
  beside its sibling and is never re-serialised whole.
- ⚠⚠ `scripts/mutation-coverage-manifest.json` is an estate-wide path-reservation
  chokepoint: no other co-live non-terminal packet may declare it. That is one of
  the two constraints forcing this train's two-stage promotion.
- ⚠ **Census:** one new test file (+1), one deleted test file (−1), eight titles,
  one suite title; the deleted file carried four titles and one suite title.
