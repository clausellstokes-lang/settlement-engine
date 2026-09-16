# GV / GV-2 — sessionGateCensus binds the call to its consequence (member 2 of `gv`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `69758820aac972a528f9dd330cb25807106b8979`
- **Train:** `gv`, family **GV**, member **2** of 4. Path-disjoint from its siblings.
- **Preamble:** none — GV is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** · **§75** · **§137**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.1, annex row `MB.M3`.

---

## §1 · THE DEFECT

`importsGate` was two PRESENCE questions joined by `&&`:

```js
const importsGate = (src) => /_shared\/sessionGate\.ts/.test(src) && /isSessionSuperseded\s*\(/.test(src);
```

Presence is not enforcement. `if (false && await isSessionSuperseded(...))` satisfies both
halves, evicts nobody, and passes all twenty arms of this census — measured, not supposed.

⛔ **THE STAKES ARE THE FIVE MONEY SURFACES.** `surveyor-byok`, `create-checkout`,
`create-customer-portal`, `account-actions` and `founder-transfer` spend no credits, so they
have NO `spend_credits` belt behind them. This scan is their ONLY enforcement, and the guard's
own comment at `:83-85` says so.

## §2 · THE CURE

The call must sit in the CONDITION of an `if` whose consequent answers 401, and the condition
must be LIVE. Four shapes are enumerated in-file BY NAME — braced, unbraced, guarded by a
leading conjunct, and raw-`Response` — and all four are admitted by ONE rule rather than four
special cases: the consequent (block or single statement) carries the 401, and no conjunct of
the condition is a falsy literal. A shape not in the list is a RED, never an allowlist row.

⚠ All four shapes are LIVE in the tree today. They were read off the sixteen surfaces before
the rule was written, not guessed — which is why the stricter rule lands with the whole roster
already passing.

## §3 · THE CONTROL ARMS (§75, MANDATORY)

- **MUTANT — `false &&`:** the exact neutered form REDS, and the problem it reports names the
  dead literal conjunct.
- **MUTANT — unconsumed result:** a call assigned to a binding with no `if` REDS.
- **MUTANT — wrong answer:** a gate whose consequent returns 200 REDS.
- **POSITIVE — all four live shapes** are admitted, so the rule is not "reject everything".

## §4 · SCOPE AND BOUNDARY

The predicate only. The roster, the belt check, the deferred set and the founder-transfer
binding assertions are untouched. No regex vocabulary is widened.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | all sixteen roster surfaces pass the STRICTER predicate unchanged |
| A2 | the `false &&` neutering is refused, naming the dead conjunct |
| A3 | a call whose result is never consumed is refused |
| A4 | a consequent that does not answer 401 is refused |
| A5 | the four shapes live in the tree are all admitted |
| A6 | neutering a REAL paid surface reds the census, and the file is restored byte-exact |

## §6 · CHECKS

```
npx vitest run tests/edgeFunctions/sessionGateCensus.test.js \
  tests/edgeFunctions/contracts.test.js tests/security/moneyPathCoverageContract.test.js
```

## §7 · MUTANTS AND HAZARDS

- **The estate plant.** `false &&` planted on the REAL `surveyor-byok` gate reds two arms of
  the census; restored byte-exact and verified by `cmp`.
- ⚠ **Same-seed: NEUTRAL** — a test file, in no generation import closure.
- ⚠ **Census:** this file registers its roster arms from `it.each`, so it is PARKED and its new
  control arms move no census figure. Their coverage is real and executes; the census cannot
  see it, which is recorded rather than left as a puzzle.
