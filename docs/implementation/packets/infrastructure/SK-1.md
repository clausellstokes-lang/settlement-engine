# SK / SK-1 — the runner core, the parallel seed pool, and the walker's `scripts/soak` floor (member 2 of `sk-a`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `0cbb0177b177717873804200e908a27d42363ed4`
- **Train:** `sk-a`, family **SK**, member **2** of 4.
- **Depends on:** SK-0; `tm-core` LANDED (TM-1W creates the walker this member edits).
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§141.1** · **§131** · the soak-harness charter §2.2.
- **Compile of record:** `laneTC28-SK-PLAN.md` §3.2; TE-27 receipt §9.1.

---

## §1 · THE POOL-INDEPENDENCE INVARIANT IS THE MEMBER'S WHOLE POINT

A soak grid is embarrassingly parallel only if the GRID is a pure function of the config
— never of N, of core count, or of scheduling. The moment worker count reaches the grid,
"the same seed run in-pool and solo" stops being a well-formed claim, because the two are
no longer the same run. `grid()` therefore takes the config and nothing else, its pin runs
the whole plan at N = 1, 3 and 8 and demands the identical ordered cell list AND the
identical receipt paths, and a host-seeded mutant is asserted to produce a different one.

## §2 ⛔ THE COMPARISON SURFACE IS DEFINED, AND SPELLED AS AN EXCLUSION

Two arms. (a) The full per-year composite-hash SEQUENCE — a mid-run divergence that
reconverges by the horizon is invisible to a final-hash comparison, and the pin
demonstrates exactly that case with a receipt whose `finalHash` matches across a year-2
divergence. (b) The receipt minus a CLOSED volatile list.

⚠⚠ **The list is an EXCLUSION, never an allowlist.** A receipt field added later is
COMPARED until somebody deliberately excludes it. The mutant is a field-added-later case
that an allowlist implementation would pass silently.

⚠ `__tickIndexStats` is deliberately absent from the list and named in prose as
host-observability, so nobody puts it ON a receipt first and then quietly excludes it.

## §3 ⭐ THE CHARTER'S §2.2 OBLIGATION, DISCHARGED

TM-1W put `scripts/soak` in the wall walker's exact-set `ARM_B_ROOTS` from birth with a
shrink-only `AWAITING_POPULATION` row, because a non-empty floor over an absent directory
is a vacuous arm. This member removes the row and supplies the floor — three modules,
three the member actually created.

⚠⚠ **AND THE FLOOR IS WHY THE HARNESS SHELLS OUT INSTEAD OF IMPORTING.** `scripts/soak`
now sits under Arm B's forbidden-import scan, so no runner module may import a specifier
matching `worldPulse|worldState|generateSettlementPipeline|simulationRules`. Engine contact
is therefore a SUBPROCESS, which turns the charter's "consumes the engine through the same
public entry points, never reaches into engine internals" from a promise into a structure.
A later member needing the flag census reads it from `scripts/audit/`, the side of the wall
that may hold it.

## §4 ⛔ THE SUBSTRATE, AND THE CONDITIONAL LIE MODE

Archives always. The runner asserts its extraction directory is OUTSIDE any repository —
and the assertion's PASS is `git rev-parse --show-toplevel` THROWING. Extract the same
archive anywhere inside a repository and `git rev-parse`/`git ls-files` answer about the
WRONG repository while `readFileSync` reads the archive: a source fingerprint over a mixed
file set, at exit 0. Source identity IS the archived tip sha, passed in and stamped into
every artefact; `readSourceIdentity` is never invoked inside an archive.

## §5 · VALUES (§42/§43, §131)

| value | band | home |
|---|---|---|
| worker count `N` | `clamp(1, floor(freeMem / 800MB), cpus − 1)`, computed at launch | §141.1's own measurement — "~8-way on this machine; peak RSS per world measured under 800 MB" — the existing owner-ratified home, quoted rather than re-derived |

## §6 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. No engine import. **Same-seed: NEUTRAL.**

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the grid and every receipt path are identical at N = 1, 3, 8; a host-seeded mutant differs |
| A2 | the worker band is computed from the host, floors at 1, and memory binds before cores |
| A3 | runs differing only in host observability compare EQUAL; a reconverging mid-run divergence does not |
| A4 | a field added to the receipt later is compared by default, and naming it volatile is a deliberate act |
| A5 | an archive extracted inside a repository is REFUSED, and the throw is the pass |

## §8 · CHECKS

```
npx vitest run tests/soak-harness/determinismUnderWorkers.test.js tests/lint/engineTelemetryWall.walker.test.js
```

## §9 · MUTANTS AND HAZARDS

- ⚠ An empty hash sequence on either side is a FINDING, not a pass — two empty sequences
  compare equal and certify nothing.
- ⚠ Both comparison arms convict a reconverging divergence, and that is deliberate: the
  receipt arm names the FIELD, the sequence arm names the YEAR a fix lane needs.
- ⚠ §102.3: `determinismUnderWorkers.test.js` matches no `NAME_PATTERN` token ⇒ **no
  mutation-coverage row owed**, and the name was chosen so.
- ⚠ Census: one new test file, four titles, one suite title.
