# TM / TM-3A — the read layer, and the train's census re-record (member 5 of `tm-core`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6b337fb1f7bb1d3dde0810310a01a3653c874aac`
  (the `mb` terminal; the tm+sk family's dispatch base)
- **Train:** `tm-core`, family **TM**, member **5** of 5 — **stage 2**, last in the train.
- **Depends on:** TM-1A, TM-2A.
- **Preamble:** none — TM is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§117a** · **§131** · the census law.
- **Compile of record:** `laneTC28-TM-PLAN.md` §3.5, annex rows `TM.M10`, `TM.M14`.

---

## §1 · THE SOAK NEEDS ZERO CLOUD

The aggregator never opens a database connection. It reads the SAME JSONL the loader
would publish, so a full diagnostic run and its tuning-curve report complete on a
laptop with no project configured — which is what makes the harness usable in the
fix loop rather than only after a deploy.

## §2 · THE POPULATION TRAJECTORY IS FIRST-CLASS, BECAUSE A RUNAWAY IS A SHAPE

The recorded 300-year population runaway is the tuning pass's own input, so the
report carries it as year-indexed rows rather than as a summary statistic. A mean
hides shapes. `populationRunaway()` REPORTS the growth multiple and the crossing
year; it never fails a run, because the tuning pass owns that verdict and this
module has no authority to sign a band.

## §3 ⛔ · THE ANTI-FORK PIN IS AN ABSENCE PIN, AND THE SUBSTITUTION IS DELIBERATE

The compile specified a parity pin over metric identifiers parsed out of migration
196's view definitions. **Migration 196 as built enumerates NO metric name at all** —
it is ONE generic EAV rollup in the 038/133 idiom the compile itself mandated — so a
name-parity pin would compare an empty set against an empty set and pass forever:
the self-referential vacuity class this estate has convicted before.

The pin is therefore restated as the stronger pair it actually supports:
1. **ABSENCE** — the SQL face names no metric identifier, with a control proving the
   scan would see one if it were there. Two faces cannot fork over a vocabulary only
   one of them spells.
2. **PARITY on the one vocabulary the SQL DOES enumerate** — the `epoch_kind` CHECK
   constraint — compared key-for-key against `SIM_METRIC_EPOCHS` in BOTH directions,
   with a planted extra identifier on each side.

## §4 · THE CENSUS RE-RECORD

ONE member per train declares
`tests/lint/sovereigntyLightingContract.walker.test.js`; this is it, last in the
train, so the tuple is final. ⚠ The tuple is **RE-DERIVED from this train's own
executed run and never transcribed** — the `gvf` `4e215298` idiom — and the delta is
attributed by reverting ONE test file at a time.

## §5 · SCOPE AND BOUNDARY

One aggregator, one test, one census re-record. Nothing under `src/`.
**Same-seed: NEUTRAL.**

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | band families are enumerated FROM the registry, one per year-epoch row, never hand-listed |
| A2 | the population trajectory is year-indexed, and the runaway read detects a planted runaway |
| A3 | every other year-epoch family folds to a series, and the run-epoch war histograms fold correctly |
| A4 | the SQL face names no metric identifier, and its epoch vocabulary matches the registry both ways |
| A5 | the lighting census tuple is re-derived from an executed run and its delta attributed by measurement |

## §7 · CHECKS

```
npx vitest run tests/lib/simMetricAggregate.test.js tests/lint/sovereigntyLightingContract.walker.test.js
```

## §8 · MUTANTS AND HAZARDS

- ⚠ **The census is SEQUENCED** — `files`, `parked` and `credited` are asserted
  BEFORE `titles`, and `suiteTitles` stays invisible until `titles` is right. Their
  passing is the receipt that the file-level prediction was correct.
- ⚠ **A parked file swallows its titles.** A delta smaller than the titles added is
  not arithmetic to accept; it is attributed by reverting ONE test file at a time.
- ⚠ **§102.3:** `tests/lib/` is not an enforcer dir and `simMetricAggregate.test.js`
  matches no `NAME_PATTERN` token ⇒ **no mutation-coverage row owed.**
- ⚠ **Census:** one new test file, four titles, one suite title.
