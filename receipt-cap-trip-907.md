# RECEIPT — LANE CAP-TRIP-907
**Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session 405b5e7e) · dock `$SC/laneB6` · repair lane, four cars**

**STATUS: COMPLETE** — four cars chartered, **three landed as built and one landed as a measured REFUSAL** (car 3's row is not armed; the corrections it owed did land). Last written Mon Sep  7 01:15:48 EDT 2026.

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


## CAR 2 — THE REACHABILITY GUARD (the class, not the instance) — **LANDED `6f4fa80ad61c55e91e3190570541db2bc5813f0d`**

**Files** (2): `scripts/soak/tripwires.mjs`, `tests/soak-harness/tripwireRegistry.test.js` — +212 / −0.

Three exported functions beside `tripwireRegistryDefects`:
- `tripwireFieldsRead(row)` text-reads `receipt.x` / `receipt?.x` from the row's **own `detect` and `gate` source**, plus the one documented accessor idiom (`for (const field of ['a','b']) … receipt?.[field]` — how `negative_stock` is built; four of its fields would otherwise be invisible). A computed read whose key list is not a literal array in the same detector is reported **UNREADABLE**, never passed by default.
- `receiptWriterFields(source)` text-reads the writer's key set from **both** object literals.
- `tripwireFieldReach(rows, source)` is the difference. **It imports no writer module** — the caller hands over the text, so the Arm B wall stays structural.

**MEASURED at this tip — CONFIRMED, executed:**

| figure | value |
|---|---|
| writer key set | **41** keys |
| cross-check against the real receipt's own top-level keys (40) | **misses none**; the one extra is `presetId`, conditional on `--preset`, and that run named none |
| **unreachable ROWS** | **2** — `capacity_plateau`, `capacity_floor_thaw` |
| **unreachable (row, field) PAIRS** | **4** — both rows key on both of `yearlyPopulations`, `yearlyDiedFlags` |
| unreadable rows | **0** |
| `tripwireRegistryDefects()` | `[]` |

**The brief's "`unreachable: 2`" is the ROW count and is CONFIRMED.** The pair count of 4 is banked beside it, because a row-only ratchet would not notice one of the two fields landing alone — and a series shipped without its died flags would convict every lawful death. `UNREACHABLE_ROWS_BANKED = 2` and `UNREACHABLE_PAIRS_BANKED = 4`, both `toBeLessThanOrEqual`, alongside the exact identity of the four pairs. **The ratchet only shrinks.**

**THE THIRD, REFUSED WITH A MEASUREMENT.** A walker reading only `receiptBody` reports `non_finite_ledger_figure` as unreachable too — and it is not: `nonFiniteFigures` is added one statement later in `const receipt = { ...receiptBody, nonFiniteFigures }`. The pin **reproduces that false positive on purpose** (`receiptWriterFields(bodyOnly)` → 3 unreachable rows) and then refuses it, because a guard that cries wolf gets deleted.

**Walker and runtime channel pinned to each other:** the rows the walker calls unreachable must be exactly the rows that declare `requires`.

**NEGATIVE CONTROL, EXECUTED TWICE — CONFIRMED.**
1. *In-arm*: a planted row keyed on `receipt.doesNotExist` is reported; an opaque computed read is reported UNREADABLE.
2. *Out-of-band, the brief's own test*: a `planted_control` row keyed on `receipt.doesNotExist` was spliced into the **real frozen registry** and the pin was run —
```
MUTANT_EXIT=1     Tests  2 failed | 7 passed (9)
FAIL … > NO ROW MAY KEY ON A FIELD THE RECEIPT WRITER DOES NOT WRITE — the class, banked and shrink-only
AssertionError: expected [ 'capacity_plateau', …(2) ] to deeply equal [ 'capacity_plateau', …(1) ]
+   "planted_control",
```
The file was restored from a byte-for-byte backup and re-verified by **md5 `61551fba670b5ed3851d474e0c85956e` on both sides**, 0 occurrences of the plant remaining; the pin is green again (exit 0, 9 passed). **No `git checkout` was used** — the restore is a `cp` from a backup taken before the mutation, so no uncommitted work was ever at risk.

**FAST GATE:** `npx vitest run tests/soak-harness/tripwireRegistry.test.js` → **EXIT=0, 9 passed (9)**; eslint on both files → EXIT=0.

---

## CAR 3 — `capacity_envelope_30y` RE-MEASURED — **LANDED `11f6425a9704cc5cc1eaa5f4e29782ed290751ec`** — row **REFUSED**, on a corrected and different ground

**Files** (2): `scripts/soak/tripwires.mjs`, `tests/soak-harness/tripwireRegistry.test.js` — comment/pin bytes only.

**THE FALSE MECHANISM, REFUTED — CONFIRMED.** Both the registry's C3 block and the roster pin said `behavioral.yearly[].motion` "does not exist… no `motion` block at all". **It exists.** `scripts/audit/behavioral-observation.mjs:1016-1023` writes `motion: { populationTransitions, populationMoved, prosperityTransitions, prosperityMoved, powerTransitions, powerMoved }` on every yearly row, since `37459391a` (`2026-07-28 13:43:21 -0400`) — **37 days before** C3 landed (`d02c5acde`, `2026-09-03 16:19:44 -0400`). On the real receipt `behavioral.yearly[29].motion = {"populationTransitions":4,"populationMoved":3,…}`. Both comments now carry the writer, the sha and the date.

**⛔ THE ROW IS NOT REINSTATED, AND THE GROUND IS NEW.** The brief's two conditions both hold — the roster *would* become the design's 12 / 10, and the firing *is* explainable. **A third condition, which the brief did not anticipate, fails:** the row's band is the envelope suite's own bar, `MOVING_SHARE_FLOOR = 0.05` over transitions counted at `MOTION_FLOOR_01 = 0.0025`, and that constant's **only home is `tests/domain/demographicsEnvelope.test.js:47`** — a test file `scripts/soak/**` must not import. Re-typing `0.05` in `tripwires.mjs` would be a **SECOND SPELLING of one envelope**, which that file's own header refuses in its fourth paragraph; the motion floor is already spelled twice (`behavioral-observation.mjs:957` inline, and the suite's constant — **a pre-existing two-homes defect, reported, not this lane's to fix**), and a third would make it worse. This lane's charter forbids bytes in `soakInvariants.mjs` and in that test beyond its header. **Refused with measurement, per the brief's own instruction.**

**THE ACT HANDED TO THE CHAIR:** lift `MOVING_SHARE_FLOOR` (and, while there, the motion floor) into `scripts/audit/soakInvariants.mjs` beside `LIVENESS_FLOOR`, then arm the row importing from there exactly as `YEARLY_BYTES_PER_SETTLEMENT_CEILING` and `WALL_TIME_TREND` already are. Roster then 11 → 12 ids, 9 → 10 deterministic — the design's §2.5 C3 prediction, restored.

**WHAT THE ROW WOULD SAY IF ARMED — measured, so the chair is not asked to arm an instrument blind (CONFIRMED):**

| reading on the real 300-year receipt | value |
|---|---|
| year 30 exactly (`yearly[29].motion`) | 3 moved of 4 transitions — **0.75** |
| the customer horizon, 30y aggregate | **110 of 120**, share **0.9167** |
| all 300 years | **0.8992** |
| years at ratio 0 | **0 of 300** |
| years below the 0.05 bar | **0 of 300** |

**It is SILENT**, and agrees in shape with the envelope suite's own 170 of 180 (0.9444) on its different six-settlement fixture. Arming it moves no verdict on this receipt.

**ANTI-REGRESSION:** the roster pin now text-reads `behavioral-observation.mjs` and asserts the `motion` block is present, so the false claim is refuted by the tree rather than by memory.

**FAST GATE:** `npx vitest run tests/soak-harness/tripwireRegistry.test.js` → **EXIT=0, 9 passed (9)**; eslint → EXIT=0.

---

## CAR 4 — M3-F1, THE FALSE HEADER — **LANDED `082314af38aa00f7bd02be23f6b2007e288fbecb`**

**File** (1): `tests/domain/demographicsEnvelope.test.js` — **comment bytes only**. No bar, no dial, no arm changed. THE PROMISE untouched.

**RE-MEASURED BY THIS LANE, by running that one file at HEAD — CONFIRMED:**

| figure | header claimed | **this lane measured** | B6 receipt |
|---|---|---|---|
| moving transitions | 171 of 180 (0.95) | **170 of 180, share 0.944444** | 170/180, 0.9444 |
| growth-ratio spread | 0.41 | **0.484592** | 0.4846 |
| settlements unmoved | none | **none** (`frozen: []`) | none |
| Elderfen first filling | year 14 | **year 12** | year 12 |

**My run AGREES with the B6 receipt on all four, so no disagreement is owed.** Supporting figures: the six thirty-year ratios are `1.475, 1.653125, 1.175, 1.301571, 1.357143, 1.168533`; first-filling years are Cairnhold 1, **Elderfen 12**, Brackwater 27, Dunmarch 49, Ashford 50, Fallowmere never inside sixty; crowding lines 8.

**METHOD, recorded because the first attempt lied.** A temporary measurement arm was inserted into a byte-for-byte backup of the file and the file run (`EXIT=0`, 7 passed with the probe). **`console.log` from inside a test is swallowed by this harness's setup** — the first probe returned a silent green that would have looked like a measurement — so the probe was rewritten to write JSON to a scratch path. The file was then restored and re-verified by **md5 `6a7130844cb6acf7e14a09936ebf3927` on both sides**, 0 occurrences of the probe remaining, `git status --porcelain` empty; only then was the header edit applied.

**The header now also records WHY it was wrong:** every source file in the suite's reach is byte-identical between `d02c5acde` and HEAD, so this is not drift — the numbers were taken against a draft state and never re-measured.

**FAST GATE:** `npx vitest run tests/domain/demographicsEnvelope.test.js` → **EXIT=0, Test Files 1 passed (1), Tests 6 passed (6)**; eslint → EXIT=0.

---

## THE COMPOSED TIP — every touched file re-run at `082314af3`
```
tests/soak-harness/tripwireRegistry.test.js   EXIT=0   Tests  9 passed (9)
tests/soak-harness/tripwireCaller.test.js     EXIT=0   Tests 10 passed (10)
tests/soak-harness/soakRegister.test.js       EXIT=0   Tests  8 passed (8)
tests/soak-harness/soakScriptSeams.test.js    EXIT=0   Tests  8 passed (8)
tests/soak-harness/curveBandFreeze.test.js    EXIT=0   Tests  4 passed (4)
tests/domain/demographicsEnvelope.test.js     EXIT=0   Tests  6 passed (6)
```
`git status --porcelain` is **empty** at the tip. Four commits, each with both trailers, no push, no stash, no `git add -A`.

## THE ROSTER AND `deterministicFirings`, BEFORE AND AFTER

| | before (`4243bdc61`) | after (`082314af3`) |
|---|---|---|
| `TRIPWIRE_IDS` | 11 | **11 (unchanged)** |
| deterministic rows | 9 | **9 (unchanged)** |
| host-observability rows | 2 | **2 (unchanged)** |
| `tripwireRegistryDefects()` | `[]` | `[]` |
| B6 `deterministicFirings` | **1** (`capacity_realm_load`) | **1** (`capacity_realm_load`) |
| B6 `notExecutable` | *(no channel)* | **2** — `capacity_plateau`, `capacity_floor_thaw` |
| B6 `fullInstrument` | `true` | **`false`** |
| unreachable rows | *(unmeasured)* | **2, banked, shrink-only** |

The design's predicted **12 / 10 was not reached** and the reason is car 3's, measured and handed over. **No golden was re-recorded, no tuning value moved, no register `--write` was run, and the soak register file was not touched.**

---

## RETROVALIDATION ROW — every judgment call, for the chair to ratify or refuse

| # | call | why | reversible? |
|---|---|---|---|
| 1 | The channel is driven by a declared `requires` on the row, not by a runtime text-scan of detector source | a registry row is the estate's own idiom ("a new class costs its row"); text-scanning at evaluation time would put a fragile parser in the run path. Car 2's walker cross-checks the declaration against the source, so the two spellings **convict each other** rather than drifting | yes — one field |
| 2 | Only the two genuinely-unwritten fields got `requires`; `liveness_floor`, `non_finite_ledger_figure` and `capacity_realm_load` did **not** | their absences are documented, deliberate readings (an archived receipt lacking `nonFiniteFigures` must not be convicted; a v4 receipt lacking `realmDemography` is a legacy-schema question). Widening the channel to them would re-grade every archived receipt — a different act from curing a row that could never fire on anything | yes |
| 3 | `requires` grades **top-level** fields only; `capacity_realm_load`'s nested `yearly[last].realmDemography` gap is left open and documented in the row | dotted-path requirements re-grade archived receipts; that is the chair's call, and smuggling it in under a repair car would have been the wrong way to take it | n/a — deferred, written down in the row |
| 4 | Both `yearlyPopulations` **and** `yearlyDiedFlags` are required | without the died flags the remnant law has no exception list and the row convicts every lawful death; a series shipped alone would be worse than no series | yes |
| 5 | The demographics gate **moved** from inside `detect` onto a row-level `gate` | while it was the detector's first line a dark cell and a blind row produced the identical `[]`; one spelling, where the evaluator can read it | yes |
| 6 | `evaluateReceipt` **extends** `receipt.notExecutable` rather than adding a seventh annotation key | §4.1's finite-semantics clause caps the annotation at the `freezeBlockers` key set; `notExecutable` is not an annotation, it is the same ledger the writer opened. Rows are stamped `source: 'tripwire-registry'` so nothing is mistaken for a soak claim, and the "six keys and no more" pin stays green untouched | yes |
| 7 | **The register door now closes on every receipt today's writer produces** (`fullInstrument: false`) | chartered by the brief in those words; and the measurement lane's own conclusion — "a future clean run would be clean partly because its detectors are blind". ⛔ **This gates the tuning sitting's freeze act until the schema row ships the series.** | yes, but it is the point |
| 8 | `soakRegister.test.js`'s door arms now use an explicitly-labelled `instrumentComplete()` forward-shape fixture | a door cannot be exercised by a receipt the previous door already refused. The honest fixture is kept and pinned **first**, so the blindness is asserted rather than hidden by the helper | yes |
| 9 | The growth door's debt arm was re-pointed from `realm.runawayCount` to `liveness.minDistinctTypesPerDecade` | with the series visible, a runaway is convicted by `capacity_plateau` and can never reach the charter door. **Finding: the debt path was reachable only through the blindness.** `liveness.reported` is the one debt lever no tripwire grades | yes |
| 10 | Car 3 **refused** on a ground the brief did not name (the threshold has no importable home) | the brief's two conditions were necessary, not sufficient; arming would have required a second spelling of one envelope, which the registry header forbids. Refused **with** the full measured firing so the chair can arm it in one act | n/a — nothing shipped |
| 11 | Car 2's negative control was run against the **real** registry, restored by `cp` from a pre-mutation backup and md5-verified — never by `git checkout` | `git checkout` discards uncommitted work, and car 2's own changes were uncommitted at that moment | n/a |
| 12 | `npx tsc --noEmit` is left RED | 167 errors, **all** under `src/domain/worldPulse/**`, none in any file this lane touched. Pre-existing at the base tip; recorded rather than silently inherited or "fixed" outside charter | n/a |

## FINDINGS RAISED, NOT FIXED (outside charter)
1. **`MOTION_FLOOR_01 = 0.0025` is already spelled TWICE** — `scripts/audit/behavioral-observation.mjs:957` (inline literal) and `tests/domain/demographicsEnvelope.test.js:45`. A two-homes defect in a tree that refuses five-homes defects. Fold it into the same act as car 3's `MOVING_SHARE_FLOOR` lift.
2. **`capacity_realm_load`'s nested gap** — `behavioral.yearly[last].realmDemography` absent still reads as silence, not as NOT-EXECUTABLE. Needs a dotted-path `requires`, which re-grades archived receipts. Chair's call.
3. **The debt path finding** (row 9 above) — the growth door's "accept the honest red" ritual can no longer be exercised by a runaway. If the chair intends that ritual to cover runaways, the door's ORDER (tripwire before declaration) is the thing to rule on.

## FILES
- Receipt: `$SC/receipt-cap-trip-907.md` (this file)
- Working artifacts: `$SC/cap-trip-907/` — gate outputs, the two md5-verified backups, `m4-figures.json`, `probe-after.mjs`
- The dock is `$SC/laneB6` at `082314af38aa00f7bd02be23f6b2007e288fbecb`, porcelain empty. **The shared tree `/Users/cstokes/Desktop/settlement-engine` was never touched.**
