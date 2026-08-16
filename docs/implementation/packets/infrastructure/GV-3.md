# GV / GV-3 — ciCheckParity gains the enforcement dimension (member 3 of `gv`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `69758820aac972a528f9dd330cb25807106b8979`
- **Train:** `gv`, family **GV**, member **3** of 4. Path-disjoint from its siblings.
- **Preamble:** none — GV is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** · **§75** · **§137**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.1, annex row `MB.M4`.

---

## §1 · THE DEFECT

The parity arms read the step TOKEN out of a CI run body. `npm run lint || true` still yields
the token `lint`, so parity holds perfectly while enforcement is gone: the step runs, fails,
and the job reports success.

`directGateCommandsFromJob` cannot see it either — it hunts raw runners, and it SPLITS on `||`,
so the escape hatch is discarded as a delimiter before any match is attempted. A CI gate can
therefore be disarmed without moving a single existing assertion.

## §2 · THE CURE

A scan for the three shapes that disarm a step while leaving its token in place: `|| true`,
`; true`, and a step-level `continue-on-error` whose value is not `false`. It runs over the
same five gate jobs the parity arms read. The presence dimension is untouched — the two are
orthogonal and both are needed.

## §3 · THE NARROWING, MEASURED RATHER THAN ASSUMED (fork `GV-3'`)

⚠ The first spelling read the WHOLE job body and convicted `ci.yml` on its first run — on

```yaml
- name: Audit dev dependencies (non-blocking visibility)
  run: npm audit --audit-level=high
  continue-on-error: true
```

That is not a gate step. `npm audit` and `npm ci` are deliberately outside the parity surface
(the comment on `ciCheckJobSteps` says so), and a dev-dependency audit that is non-blocking BY
NAME is the intended shape. The signed fork governs: the scan is SCOPED to steps whose own
command is an `npm run <step>`, and the exempted line is quoted in-file. It is NOT an allowlist
keyed on job or step name — such a key would have hidden the next real instance too.

The narrowing is itself pinned in both directions: the live non-gate soft step reports nothing,
and the same step with `npm run lint` in place of `npm audit` reports one escape.

## §4 · THE CONTROL ARMS (§75, MANDATORY)

The file already owns the idiom — `derives parity only from executable run fields` feeds
SYNTHETIC yaml to the existing scanners and asserts exact output. The new rule gets a synthetic
sibling in the same test:

- a DISARMED job whose three steps are `|| true`, `; true` and `continue-on-error: true`. The
  control asserts the two OLD scanners report it as perfectly compliant — every step token
  present, no direct runner — and that the new scan reports all three escapes. That contrast IS
  the member's justification, executed.
- an ARMED job reports nothing, so the scan is not "reject every job".

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the five gate jobs carry no disarmed gate step |
| A2 | a synthetic disarmed job yields three escapes, one per shape |
| A3 | the OLD parity + direct-runner scanners both report that same job as clean |
| A4 | an armed job yields none |
| A5 | the live non-gate soft step is exempt BY SHAPE, and a gate-driving one is not |
| A6 | disarming a REAL gate step in `ci.yml` reds only the new arm; restored byte-exact |

## §6 · CHECKS

```
npx vitest run tests/build/ciCheckParity.test.js tests/lint/fullTypecheckRatchet.test.js \
  tests/lint/testRatchet.test.js
```

## §7 · MUTANTS AND HAZARDS

- **The estate plant.** `npm run validate:packets || true` planted in the live `ci.yml` reds the
  new arm while the six pre-existing arms stay GREEN — the proof that parity could not see it.
  Restored byte-exact, verified by `cmp`.
- ⚠ **Same-seed: NEUTRAL.**
- ⚠ **Census:** +1 title, +0 suite titles; no test file created or deleted.
