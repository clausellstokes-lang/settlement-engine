# RECEIPT — LANE CAP-TRIP-907
**Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session 405b5e7e) · dock `$SC/laneB6` · repair lane, four cars**

**STATUS: PARTIAL** — CAR 1 landed (`3835be900`). CARS 2–4 in flight. Last written Mon Sep  7 01:06:33 EDT 2026.

## ARRIVAL CHECK — Mon Sep  7 00:52:00 EDT 2026 — **all three lines pass**
- `git rev-parse HEAD` == `4243bdc610fe5b380f1d0029973cf9088bae1631` — **CONFIRMED**
- `git status --porcelain | wc -l` == `0` — **CONFIRMED**
- `ls -A node_modules | wc -l` == `455`. The two over 453 are the Vitest cache dirs; the dot-entries are exactly `.bin`, `.vite`, `.vite-temp`. **ACCEPTABLE per the brief, and stated as the brief requires.**

## THE BRIEF'S FIGURES, RE-DERIVED BEFORE ANY EDIT (a brief figure is a hypothesis)
| brief cites | measured at `4243bdc61` | verdict |
|---|---|---|
| `tripwires.mjs:239,:243,:276,:278` key on `yearlyPopulations`/`yearlyDiedFlags` | grep: exactly those four lines | **CONFIRMED** |
| `whole-world-soak.mjs:389-390,:489-490,:555-556` build the series per run | grep: exactly those lines | **CONFIRMED** |
| `receiptBody` at `:1013`, `finalDiedFlags` at `:1074`, written at `:1163` | `sed -n` at those lines shows `const receiptBody = {`, `finalDiedFlags: …`, `writeFileSync(file, …)` | **CONFIRMED** |
| `evaluateTripwires` at `:364-375`, `evaluate.mjs:63` | read in full | **CONFIRMED** |
| registry pin plants the field at `:161,:172,:197` | read in full | **CONFIRMED** |
| the pin's comment "documents the silence" at `:186-188` | the comment is at **`:179-181`**; `:186` is an assertion | **brief off by seven lines; immaterial** |
| both register genesis cells UNFROZEN | `.soak-register.json`: both `frozenAtSha: ""`, both `figures: {}` | **CONFIRMED — no banked verdict moves in this lane** |
| `demographicsEnvelope.test.js:19-23` carries the four figures | the header runs `:19-26`; the four figures sit at `:21-24` | **brief off by three lines; immaterial** |
| `behavioral.yearly[29].motion` exists on the real receipt | `{"populationTransitions":4,"populationMoved":3,…}` | **CONFIRMED (car 3)** |
| the motion writer is `37459391a`, 2026-07-28 | `git log -S populationTransitions -- scripts/audit/behavioral-observation.mjs` → `37459391a 2026-07-28 13:43:21 -0400` | **CONFIRMED** |
| C3 landed `d02c5acde` five weeks later | `d02c5acde 2026-09-03 16:19:44 -0400` — 37 days after the writer | **CONFIRMED** |

---

## CAR 1 — THE NOT-EXECUTABLE CHANNEL — **LANDED `3835be90012a4e5e6926921d4bdea50b021c9745`**

**Files** (5): `scripts/soak/tripwires.mjs`, `scripts/soak/evaluate.mjs`, `scripts/soak/register.mjs`, `tests/soak-harness/tripwireRegistry.test.js`, `tests/soak-harness/soakRegister.test.js` — +302 / −40.

**What shipped.** `evaluateTripwires` returns a third channel, `notExecutable: [{ id, class, reason }]`. Two optional registry-row declarations carry §206.2b's third status and separate two facts one early return used to blur:
- `requires: string[]` — the TOP-LEVEL receipt fields without which the row's silence is not a measurement. Absent ⇒ the detector is **not called** and the row is listed with the field named.
- `gate(receipt)` — the row does not APPLY (a capacity row on a dark cell). Silent, and lists nothing.

The demographics gate moved off the three capacity detectors' first line onto the row (one spelling, where the evaluator can read it). `evaluateReceipt` appends the evaluator's rows to the receipt-level `notExecutable` ledger stamped `source: 'tripwire-registry'`, and `fullInstrument` reads both halves. `mintRefusals` adds a clause naming the blind rows.

**BEFORE / AFTER, MEASURED ON THE B6 RECEIPT** (`$SC/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`, 5.2 MB, read with node, never cat) — **CONFIRMED, executed both sides**:

| | before (`4243bdc61`, the skeptic's probe) | after (`3835be900`) |
|---|---|---|
| `evaluateTripwires().findings` | `1` — `capacity_realm_load` | `1` — `capacity_realm_load` (**unchanged, as the brief predicted**) |
| `observability` | `0` | `0` |
| `notExecutable` | *(channel did not exist)* | `capacity_plateau`, `capacity_floor_thaw` |
| `deterministicFirings` | `1` | `1` |
| `annotated.fullInstrument` | `true` | **`false`** |
| `mintRefusals` | 1 line (`a deterministic-class tripwire fired`) | 3 lines: + `not the FULL instrument…` + `2 deterministic tripwire row(s) could not run — tripwire capacity_plateau (…); tripwire capacity_floor_thaw (…)` |

The reason text, verbatim on both rows:
```
requires receipt.yearlyPopulations, receipt.yearlyDiedFlags — absent from this receipt
```

**No register cell moves.** Both genesis cells are UNFROZEN (`frozenAtSha: ""`, `figures: {}` — read from `tests/soak-harness/.soak-register.json`), so no banked verdict is disturbed by any of this. **CONFIRMED.**

**⛔ DECLARED BEHAVIOUR SHIFT #1 — the register door closes until the schema row lands.** Every lit receipt today's writer produces now grades `fullInstrument: false` and therefore **cannot mint a register cell**. This is chartered by the brief in those words ("`fullInstrument` true → false") and is what the measurement lane asked for: *"a future clean run would be clean partly because its detectors are blind."* It is stated here because it gates the tuning sitting's freeze act.

**⛔ DECLARED BEHAVIOUR SHIFT #2 — the growth door's debt path was reachable only through the blindness.** `soakRegister.test.js` banked `realm.runawayCount 0 → 1` under charter §882. With the series visible, `capacity_plateau` convicts that receipt and `--write` is refused at the TRIPWIRE door before the declaration door is reached. The test now pins the two doors **in order** (a new arm asserts the runaway write is refused with `a deterministic-class tripwire fired` and *not* with `SOAK_REGISTER_DECLARED`), and the charter arms price a figure that moves without the world breaking: `liveness.minDistinctTypesPerDecade 120 → 60`, which no tripwire grades. Every governance property the test proved before — dirty tree, seat, note, undeclared move, no charter, thin note, debt banked and printed as a standing HOLD — is still proved.

**FAST GATE** (each captured in-shell before any pipe; no unfiltered `vitest run`):
```
npx vitest run tests/soak-harness/tripwireRegistry.test.js   EXIT=0   Test Files 1 passed (1)  Tests 8 passed (8)
npx vitest run tests/soak-harness/soakRegister.test.js       EXIT=0   Test Files 1 passed (1)  Tests 8 passed (8)
npx vitest run tests/soak-harness/tripwireCaller.test.js     EXIT=0   Test Files 1 passed (1)  Tests 10 passed (10)
npx vitest run tests/soak-harness/soakScriptSeams.test.js    EXIT=0   Test Files 1 passed (1)  Tests 8 passed (8)
npx vitest run tests/soak-harness/curveBandFreeze.test.js    EXIT=0   Test Files 1 passed (1)  Tests 4 passed (4)
npx eslint (all five changed files)                          EXIT=0   (no output)
```
`npx tsc --noEmit -p .` exits 2 with **167 pre-existing errors, every one under `src/domain/worldPulse/**`** and none in any file this lane touches (grep for `scripts/soak|tests/soak-harness|whole-world-soak|demographicsEnvelope` over the tsc output returns nothing). **PRE-EXISTING, not this lane's** — recorded rather than silently inherited.

---

## CARS 2, 3, 4 — in flight
