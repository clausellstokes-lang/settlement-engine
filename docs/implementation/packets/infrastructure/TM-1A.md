# TM / TM-1A — the closed simulation vocabulary, and the one registry (member 1 of `tm-core`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `6b337fb1f7bb1d3dde0810310a01a3653c874aac`
  (the `mb` terminal; the tm+sk family's dispatch base)
- **Train:** `tm-core`, family **TM**, member **1** of 5 (stage 1 of 2).
- **Preamble:** none — TM is its own family, and its members carry their own authorities.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§117** · **§117a** · **§120.2** · **§147** ·
  **§149.2** (the chair's OQ-1 ruling) · **§151.3**.
- **Compile of record:** `laneTC28-TM-PLAN.md` §3.1, annex rows `TM.M1`–`TM.M4`, `TM.M7`,
  `TM.M8`, `TM.M9`, `TM.M11`, `TM.M16`; laws `TM.L1`–`TM.L6`.

---

## §1 · WHY A SECOND REGISTRY IS THE UNIFYING MOVE, NOT THE FORKING ONE

`EVENT_CLASS` in `src/lib/analyticsEvents.js` is **derived**, not authored: it is
`Object.fromEntries(Object.keys(EVENTS).map(...))`, so its key set is structurally
`EVENTS`'s and `tests/lib/analyticsTaxonomy.test.js` pins that 1:1. A third class
VALUE therefore cannot exist without eleven new members of `EVENTS` — and `EVENTS`
ships to the client and is edge-bundle entry #2 of five. That costs eleven unpriced
`docs/METRICS_REGISTRY.md` coverage rows, a `build:edge-shared` regeneration, and
eager client bytes for names no client can ever emit, which contradicts the
telemetry charter's own zero-eager-bytes wall.

The chair ruled OQ-1 at §149.2: the simulation vocabulary lives in its **own
Node-side registry** and `analyticsEvents.js` is not edited. §117a's "same closed
taxonomy" is delivered as ONE NAME CONTRACT (`EVENT_NAME_RE`, imported — a second
regex is refused by name), ONE dictionary (the generated analytics dictionary gains
a SIMULATION section rendered from this registry), ONE storage idiom (TM-2A's EAV
rollup), and ONE read-only discipline. The separation is **pinned, not described**:
the two name sets are proven DISJOINT, which is a stronger statement than a shared
object could make.

## §2 · WHY `scripts/telemetry/`

`REALM_SCALE_SOURCE_PATHS` is `src`, `scripts/audit`,
`tests/fixtures/spatialPackFixtures.js`, `package.json`, `package-lock.json`. This
directory is in none of them, and neither typecheck ratchet nor `sizeBaseline` can
see outside `src/`. So this member costs **zero** client bytes (structurally — no
component can reach it), zero ratchet motion, and it does not move the certification
source fingerprint. Under any `src/` placement all four of those would be false.

## §3 · THE EPOCH VOCABULARY IS MEASURED, AND THE COMPILE PREDICTED ONE VALUE TOO MANY

⛔ The compile specified `epoch ∈ {run, year, decade}` on the premise that "the
succession observation is already decade-folded". **MEASURED at this base that
premise is REFUTED.** `observeBehavioralYear` returns
`succession: { pendingProposals, attempts, completions, integrityFailures,
integrityFailureKinds }` once per YEAR, and `decade` appears in
`behavioral-observation.mjs`, `whole-world-soak.mjs` and `behavioralContract.js`
only inside prose. A `decade` epoch would oblige the emitter to RESAMPLE, which the
charter forbids in the same sentence that gives the emitter its licence.
**`SIM_METRIC_EPOCHS` is the measured two, `{run, year}`, and `sim_succession` is a
`year` row.** The arity table is what makes this checkable rather than promised.

## §4 · SCOPE AND BOUNDARY

Creates the registry, renders it into the generated dictionary, and pins it. It does
**not** touch `src/lib/analyticsEvents.js`, `EVENTS`, `EVENT_CLASS`,
`docs/METRICS_REGISTRY.md`, any edge-shared bundle, or any file under `src/`.
**Same-seed: NEUTRAL — no file under `src/` is edited, so no generation or
simulation code path changes at all.**

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | every simulation metric name satisfies `EVENT_NAME_RE` imported from the product registry — one contract, one spelling |
| A2 | the simulation name set and `Object.values(EVENTS)` are disjoint, and no product event may join the class by prefix |
| A3 | no `dims` entry names an actor, session, user, consent tier or country, and a planted PII dim reds |
| A4 | every row's epoch is the epoch its own receipt sources already have, and a fabricated source field reds |
| A5 | the committed dictionary is byte-identical to a fresh generation and carries the SIMULATION section |

## §6 · CHECKS

```
npx vitest run tests/lib/simMetricRegistry.test.js tests/docs/analyticsDictionaryFreshness.test.js
```

## §7 · MUTANTS AND HAZARDS

- **EXECUTED ESTATE MUTANT.** `sim_run_summary`'s `dims` was changed to
  `['property', 'actor_session']` **in the real registry file**; the battery came
  back exit 1 naming `dim actor_session is PII-bearing` on two arms. Restored,
  `cmp` exit 0, battery re-green.
- ⚠ **The naked-claim law.** `docs/analytics-event-dictionary.md` is regenerated, so
  `CLAIM_RE` was run over the diff before the commit: **0 matches**.
- ⚠ **`negativeAssertionAnchor`** — this member's test file authors no bare
  `not.toContain` / `not.toMatch` / `not.toHaveProperty`; every negative is spelled
  as `toEqual([])` over a defect list, which is out of that walker's scope by its
  own header. No anchor row is owed and none is added.
- ⚠ **§102.3:** `tests/lib/` is not an enforcer dir and `simMetricRegistry.test.js`
  matches none of `NAME_PATTERN`'s tokens, so **no mutation-coverage row is owed.**
  Recorded as a decision, not an omission.
- ⚠ **§104.4:** not triggered — no bundle entry is edited.
- ⚠ **Census:** one new test file, four titles, one suite title. The tuple is
  re-recorded ONCE, by TM-3A, from that member's own executed run.
