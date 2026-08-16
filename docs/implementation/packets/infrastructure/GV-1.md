# GV / GV-1 — byokNeverLogged goes statement-granular (member 1 of `gv`, SECURITY)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `69758820aac972a528f9dd330cb25807106b8979`
  (the `dcs` terminal; the micro-batch's second train base)
- **Train:** `gv`, family **GV**, member **1** of 4. All four members are path-disjoint
  (TTS S1/S6, zero duplicate-change-path convictions), so all four promote together.
- **Preamble:** none — GV is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** (structural prevention over
  guard-by-guard probing) · **§75** (the mutant-control idiom) · **§137**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.1, annex row `MB.M2`.

---

## §1 · THE DEFECT

`tests/security/byokNeverLogged.test.js` asserts that the user's decrypted provider key never
reaches a logging or telemetry sink. It asserted it PER PHYSICAL LINE:

```js
if (SINK_RE.test(line) && KEY_CARRIER_RE.test(line)) offenders.push(...)
```

Both patterns must match the SAME line. Prettier's multi-line call form — the likely shape for
a call whose arguments do not fit one line, which is exactly the shape a long secret travels in
— puts the sink on one line and the key on another. Neither line satisfies the conjunction, the
offender list comes back empty, and the guard passes while the leak ships.

⚠ **TWO SITES, NOT ONE.** The identical shape is at `:38` (the `byok.ts` / `index.ts` loop) and
at `:104` (`SINK_RE2` × `KEY_RE2` over `surveyor-byok/index.ts`, the BYOK **management**
surface). Curing only the loop would leave the management path blind to the same form — and
would leave a live instance for the anti-vacuity fold's same-line rule to convict in a file this
train had just cured.

## §2 · THE CURE

A STATEMENT-GRANULAR scan. From each sink match, the window runs from the start of that physical
line forward to the close of whatever brackets it opens, plus the rest of the statement; the
carrier pattern is tested over that whole window.

The window is bounded by the call's OWN brackets, so it can never sweep in a neighbouring
statement — that is what makes this a restored dimension rather than a widened claim.

The scanner lands in `tests/helpers/sourceContract.js`, which is already the estate's fail-closed
chokepoint for source-reading contract tests and is named as such by the anti-vacuity walker's own
header. ONE implementation, both call sites — the same-function law. It fails closed like its
siblings: an empty source throws rather than reporting a clean scan, because "no offenders" and
"nothing was scanned" must never be the same value.

## §3 · THE CONTROL ARMS (§75, MANDATORY)

⛔ This member is a CURE FOR VACUITY, so shipping it without a discriminating control would
reproduce the exact defect it was dispatched to kill. Five arms, and the first two are a pair:

1. **POSITIVE (multi-line).** A fixture in prettier's split-call form MUST be flagged, and the
   offender row must name the exact line.
2. **MUTANT CONTROL.** The pre-cure per-physical-line shape MUST MISS that same fixture. It is
   exported as `sinkLineOffendersBlind` — the defect preserved on purpose, marked never to be
   called from a live guard — so the difference the cure made is executable rather than argued.
3. **POSITIVE (single line).** The dimension the old scan already had is not regressed, AND the
   blind shape catches this one — proving arm 2 measures a real difference rather than a scanner
   that never fires.
4. **NEGATIVE.** A sink and a carrier in SEPARATE statements are NOT flagged, so the cure does
   not trade a blind spot for a false-positive machine.
5. **FAIL-CLOSED.** An empty source throws.

## §4 · SCOPE AND BOUNDARY

This fixes every instance of the same-line sink-scan blindness in this guard's two scans. It does
not touch the migration or table assertions below them, and it does not widen either regex — the
sink and carrier vocabularies are unchanged, only the window they are tested over.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | both scans are statement-granular and share one implementation |
| A2 | a planted multi-line leak in the REAL `byok.ts` reds the scan, naming its line |
| A3 | the pre-cure per-line shape misses that same fixture (executed, not argued) |
| A4 | the single-line dimension still bites, and the blind shape still catches it |
| A5 | a sink and a carrier in separate statements are not flagged |
| A6 | an empty source throws instead of reporting a clean scan |

## §6 · CHECKS

```
npx vitest run tests/security/byokNeverLogged.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js \
  tests/security/edgeLogRedaction.test.js tests/edgeFunctions/surveyorByok.test.js
```

## §7 · MUTANTS AND HAZARDS

- **The window-narrowing mutant.** Narrowing back to one physical line reds arm 1 and arm 2
  names what was lost. Executed at fixture level in-file.
- **The estate plant.** A prettier-shaped leak planted in the live `byok.ts` reds the real scan
  and is restored byte-exact, verified by `cmp`.
- ⚠ **Same-seed: NEUTRAL.** A test file and a test helper, in no generation import closure.
- ⚠ **Census:** no test FILE is created or deleted, so `files`, `parked` and `credited` cannot
  move. `titles` may.
