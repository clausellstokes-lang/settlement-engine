# SK / SK-7 — the rolling protocol, PID-exact cancellation, and the `sk-b` census (member 5 of `sk-b`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6c2bedad2064a523b9e7f61d7e0f6e61f0571650`
  (the `sk-a` terminal)
- **Train:** `sk-b`, family **SK**, member **5** of 5 — last in the train.
- **Depends on:** SK-4, SK-3, SK-6, SK-5.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§143.1** · **§145.2** · **§146.3** ·
  the census law.
- **Compile of record:** `laneTC28-SK-PLAN.md` §4.5.

---

## §1 ⛔⛔ CANCELLATION IS PID-EXACT, AND THE DECOY IS THE PROOF

`pkill -f` has returned a SIBLING LANE'S WORKERS as SKIPS in this estate — a recorded
hazard that has already bitten. A soak runner and a sibling executor's vitest workers share
command-line text, so a pattern matching "the soak" matches them too and the sibling's run
dies with no error anyone can trace back here.

The pool records its own child PIDs and process group at spawn — **eagerly**, so a
cancellation arriving before the run finishes still has exact children to signal — and
signals exactly those. The pin drives the real decision path with a DECOY whose command
line matches any plausible pattern and asserts it SURVIVES.

⚠ **AND OWNERSHIP IS VERIFIED BEFORE SIGNALLING.** A PID is reused by the OS; a stale
ledger entry can name a PID that now belongs to something else. Each is checked against the
recorded process group — an unowned or dead PID is SKIPPED and reported, never signalled on
the assumption the ledger is fresh. Any cancellation expressed as a COMMAND PATTERN rather
than a PID set is refused by name, in every spelling.

## §2 ⛔ THE DISPATCH GATE, AS DATA RATHER THAN RECOLLECTION

Nothing soaks before the §145.2 audit passes; nothing soaks before tm+sk lands; and the
first rolling run fires at the **next family exposure AFTER** that landing — so **not at
this family's own exposure, because this family IS tm+sk**. All three are refusals a caller
can read, not rules an operator has to remember.

## §3 · THE REPORT

Findings-only, ADDITIVE (no rolling result ever substitutes for any rung, boundary or
official instrument), and header-stamped with the ARCHIVED TIP SHA it measured — archive
drift is lawful ONLY when named — plus the superseding sha when superseded. A superseded
run's partial results are withheld entirely, never merged into findings or density.

⛔ **Every rolling cell attaches the dark control: a finding with no control row is not a
finding.** Orphans are REPORTED rather than silently dropped, so a missing control is
visible as a defect in the run.

## §4 ⚠ THE SECOND FINGERPRINT MOVE, DECLARED

`package.json` is in `REALM_SCALE_SOURCE_PATHS`, so the `soak:*` rows move the certification
source fingerprint a second time. Both moves are inside this family, so ONE fingerprint
statement covers `sk-a` + `sk-b` and the stamp is taken after this train's terminal. Per
the chair's recommendation on OQ-8 the rows are added: path-invoked CLIs are an operator
trap, and the move is already owned by SK-0 within the same family sweep.

## §5 · THE `sk-b` CENSUS RE-RECORD

Last in the train, so the tuple is final. Re-derived from this train's own executed run and
attributed ONE TEST FILE AT A TIME with a one-title credited stub.

## §6 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | cancellation is PID-exact and a pattern-matching decoy survives, even if mis-listed |
| A2 | a dead or recycled PID is skipped and reported, never signalled |
| A3 | a pattern-matched kill is refused by name in every spelling |
| A4 | the dispatch gate refuses by its own cause, including at tm+sk's own exposure |
| A5 | the report is findings-only, additive, sha-stamped, and orphan findings are reported |
| A6 | the lighting census tuple is re-derived from an executed run and attributed by measurement |

## §8 · CHECKS

```
npx vitest run tests/soak-harness/rollingCancellation.test.js tests/lint/sovereigntyLightingContract.walker.test.js
```

## §9 · MUTANTS AND HAZARDS

- ⚠ A superseded run contributes NOTHING, returned explicitly so a caller cannot get "some
  of it" by accident.
- ⚠ §102.3: `rollingCancellation.test.js` matches no `NAME_PATTERN` token ⇒ no row owed.
- ⚠ Census: one new test file, five titles, one suite title.
