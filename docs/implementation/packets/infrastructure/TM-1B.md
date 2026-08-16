# TM / TM-1B — the emitter, a pure receipt transform (member 2 of `tm-core`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6b337fb1f7bb1d3dde0810310a01a3653c874aac`
  (the `mb` terminal; the tm+sk family's dispatch base)
- **Train:** `tm-core`, family **TM**, member **2** of 5 (stage 1 of 2).
- **Depends on:** TM-1A — the emitter reads the registry.
- **Preamble:** none — TM is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§117** · **§117a** · **§117.3** ·
  **§120.2** · **§145.2** · **§146** · **§149.2**.
- **Compile of record:** `laneTC28-TM-PLAN.md` §3.2, annex rows `TM.M7`, `TM.M8`,
  `TM.M9`, `TM.M11`, `TM.M16`; laws `TM.L2`, `TM.L3`, `TM.L6`.

---

## §1 · IT READS THE ARTIFACT; IT DOES NOT EDIT THE PRODUCER

`whole-world-soak.mjs:729-734` already writes the entire receipt to
`--receipt <path>` — `behavioral`, `warConvergence` + `warConvergenceCensus`,
`subsystems`, `stressorCounts`, `startPopulations`/`finalPopulations`,
`seedDivergence`, `frozenTail`, `failures`, `properties`, `schemaVersion`. So the
emitter is a pure `receipt JSON → JSONL` transform that runs after the process
exits. **This is what makes "provably outside the deterministic core" structural
rather than argued**, and it removes what would otherwise be a change-path
collision with the soak-harness family's own edits to
`scripts/audit/whole-world-soak.mjs`.

## §2 · PURITY AS A CONTRACT

No `Date.now()`, no `Math.random()`, no filesystem read inside the transform (the
CLI owns the disk), no `process.env`. Run identity is
`(run_id, seed_family, scale, horizon, profile, source_fingerprint, schema_version)`
and every component is CALLER-SUPPLIED or RECEIPT-READ. `--run-id` and
`--source-sha` have no default at all: a row whose identity the tool invented is a
row nobody can compare against another run.

An unsupported `schemaVersion` is a **hard refusal**, not a best-effort parse.
`SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS` is re-declared rather than imported from
`src/domain/certification/behavioralContract.js` **on purpose** — importing it
would give a telemetry module an edge into `src/domain`, which is the exact edge
the wall walker forbids. The wall is worth more than the shared constant.

## §3 ⛔ · THE FINDING THIS MEMBER EXECUTED — THE ONE UNAVOIDABLE CORE EDGE

The compile's import-closure claim ("the emitter's transitive imports contain
nothing from the deterministic core") is **REFUTED AS WRITTEN, and the refutation
is load-bearing.** `src/lib/analyticsEvents.js` — the home of `EVENT_NAME_RE`, the
ONE name contract the compile refuses to fork by name — imports `EDIT_KINDS` from
`src/domain/pendingEdits.js`. Importing the contract therefore drags exactly one
`src/domain` path into the closure, unavoidably.

It is **ENUMERATED, NOT SILENCED**: `ACCEPTED_CORE_EDGES` names the one module,
and the acceptance is guarded two ways so it cannot rot into a silencer — the row
must still be REACHED (a stale acceptance reds), and the accepted module must
import **nothing itself** (measured: `src/domain/pendingEdits.js` has zero import
specifiers), so it cannot carry engine behaviour into telemetry no matter what it
later grows.

## §4 ⚠ · THE FIXTURE IS AUTHORED, AND ITS OWN ARITY IS ASSERTED FIRST

§145.2/§146 forbid running any soak before this family lands, so the fixture is
written from the receipt's declared schema and pinned. The recorded
compile-fixture hazard is live here: a fixture with empty `behavioral` arrays makes
every yearly transform emit zero rows and every arm pass vacuously. The fixture
carries **three years, three closed wars, one completed succession, and a second
arm with three failures**, and the member's FIRST pin asserts those counts BEFORE
asserting any transform output.

⭐ A second finding fell out of that ordering: `sim_finding` is TOTAL over the
failing arm and **SILENT on the clean one** — a clean soak that published findings
would be inventing them. Asserting totality over the union alone would have hidden
it, so both halves of the asymmetry are pinned.

## §5 · SCOPE AND BOUNDARY

Creates the transform, its CLI and its fixture. It edits **no** engine file, **no**
soak file, and nothing under `src/`. **Same-seed: NEUTRAL.**

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the fixture's own arity is asserted before any transform output, and the transform is total over both epochs |
| A2 | `sim_finding` is silent on a clean receipt and non-empty on a failing one |
| A3 | no emitted row carries a PII dimension or a dimension the registry did not declare |
| A4 | an unsupported `schemaVersion` and a missing run identity are both refused with named messages |
| A5 | `emit(r)` twice is byte-identical, and the source contains no ambient-time or ambient-random read |
| A6 | the transitive import closure reaches no deterministic-core module beyond ONE enumerated, zero-import leaf |

## §7 · CHECKS

```
npx vitest run tests/lib/simMetricEmitter.test.js
```

## §8 · MUTANTS AND HAZARDS

- **EXECUTED ESTATE MUTANT.** `SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS` was replaced
  **in the real emitter** by an import from
  `src/domain/certification/behavioralContract.js` — the most plausible refactor a
  future reader would attempt. The closure arm came back exit 1 naming four newly
  reached core modules. Restored, `cmp` exit 0, battery re-green.
- ⚠ **§102.3:** `tests/lib/` is not an enforcer dir and `simMetricEmitter.test.js`
  matches no `NAME_PATTERN` token ⇒ **no mutation-coverage row owed.**
- ⚠ **`tests/fixtures/simSoakReceiptFixture.json` is not
  `spatialPackFixtures.js`**, so the certification source fingerprint does not move.
- ⚠ **Census:** one new test file, five titles, one suite title.
