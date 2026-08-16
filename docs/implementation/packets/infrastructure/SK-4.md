# SK / SK-4 — the constraint manifest, minted, and the covering array (member 1 of `sk-b`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6c2bedad2064a523b9e7f61d7e0f6e61f0571650`
  (the `sk-a` terminal) (the `sk-a` terminal)
- **Train:** `sk-b`, family **SK**, member **1** of 5.
- **Depends on:** `sk-a` LANDED, `tm-core` LANDED.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§143.2** · **§85.4** · §42/§43 · §102.3 ·
  the closed-corpus law · the finite-semantics law.
- **Compile of record:** `laneTC28-SK-PLAN.md` §4.1, annex rows `SK.M10`, `SK.M11`, `SK.U4`.

---

## §1 ⛔ NO MACHINE-READABLE CONSTRAINT SOURCE EXISTS, WHICH IS WHY THE MANIFEST IS MINTED

The constraints governing the flag space live in four places and only ONE is enforced by
code. `normalizeSimulationRules` enforces exactly two families; it spreads `...input`, so
the 22 engine-gated virtual keys pass through un-validated and 32 preset-declared booleans
are never coerced. The rest live in code conjunctions, in COMMENTS alone, and in an
exclusion set. **The normalizer is not the oracle.** Every minted row is typed and carries
its SOURCE and its RATIONALE, because a constraint whose provenance nobody recorded is a
constraint the next reader deletes.

## §2 ⭐ THE FLAG DOMAIN IS READ ON THE AUDIT SIDE OF THE WALL, AND IT HAS TO BE

The array must enumerate the space FROM the registry at runtime. But the registry is
`simulationRules.js`, and `scripts/soak/**` is inside the engine/telemetry wall's Arm B,
which reds on exactly that specifier. So the census is read in `scripts/audit/soakRules.mjs`,
where the soak already legitimately imports the preset, and the runner imports it from
there — the allowed direction. The wall holds and the enumeration stays a live read.

Re-derived at this base: **25 governed + 32 ungoverned + 22 virtual = 79, zero overlap**,
13 non-boolean, 7 presets. 54 of 79 sit outside the normalizer's fail-closed coercion.

## §3 ⛔ EFFECTIVE PAIRS ONLY, AND THE FIXTURE MUST BE ABLE TO EXECUTE THAT DEFECT

A pair whose member is structurally dark — its `requires` parent off — covers NOTHING,
because the engine never lit it. Per **SK.U4**, the fixture therefore carries a row in
which a key reads ON and is not effective, and the test's FIRST assertion is that shape,
before any coverage number is read. Without it every coverage arm passes for the wrong
reason.

## §4 ⭐⭐ THE SHRINK GUARD EARNED ITS KEEP ON ITS FIRST EXECUTED RUN

The compile listed `neutralNeighborsEnabled` as an `excluded-with-rationale` row. Executed
against the live census it is **not in the domain at all** — declared on neither
`DEFAULT_SIMULATION_RULES`, nor any preset, nor `ENGINE_GATED_VIRTUAL_RULE_KEYS`. An
exclusion for a key that was never included is a row pointing at nothing, and the
manifest's own defect scan convicted it. It is **not deleted**: the knowledge is real and
load-bearing, so it becomes a DECLARED ABSENCE with its own guard — if the flag ever
enters the census, that reds and somebody decides deliberately.

## §5 ⚠ THE ROW-COUNT BAND WAS RE-DERIVED FROM MEASUREMENT

The compile predicted `[10, 20]` for 79 UNCONSTRAINED factors and said the figure would be
higher under constraints. Executed — 77 varying factors, effective-pair credit, full
coverage — the generator lands at **53 rows**. A ceiling of 20, or of 40, would have
REFUSED THE CORRECT ANSWER. The ceiling now guards the pathological shape
(one row per pair) and is stated as such.

⚠ **AND THE GREEDY PASS ALONE STALLS AT ~95%.** A 95% pairwise array is not a pairwise
covering array; it is an array that will one day be quoted as one. The completion pass
seeds a row with each still-uncovered pair, and a partially-covering array is REFUSED.

## §6 ⭐ §85.4 IS **NOT OWED**, BY MEASUREMENT (OQ-7 RESOLVED)

The compile flagged this conditionally without the clause text and asked the executor to
read it. Read at this base, §85.4 prices two obligations on *"any wave minting a SEEDED
CHOOSER OR POOL"*: a decision-fork classification row, whose walker scans `src/domain`, and
a mechanism-coverage baseline row, whose walker enumerates `src/domain/worldPulse` modules.
This manifest draws no random number, registers no decision fork and lights no worldPulse
mechanism. **Neither obligation attaches.**

## §7 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §8 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the fixture can execute its own defect, asserted before any coverage number |
| A2 | a pair on a structurally dark key covers nothing, and the lawful row re-covers it |
| A3 | the manifest is typed, sourced, rationale-carrying and shrink-guarded, and a stale row reds |
| A4 | the flag domain is enumerated from the registry and its arithmetic closes at 79 |
| A5 | all-on is recast as maximal-lawful and all-off stays the dark control |
| A6 | the array covers every reachable pair, is deterministic, and a thin one is refused |

## §9 · CHECKS

```
npx vitest run tests/soak-harness/coveringArrayCoverage.test.js tests/lint/mutationCoverageManifest.test.js
```

## §10 · MUTANTS AND HAZARDS

- ⚠ §102.3: `coveringArrayCoverage.test.js` contains `coverage` ⇒ it MATCHES `NAME_PATTERN`
  and OWES its mutation-coverage row, minted here.
- ⚠ The manifest is edited by SURGICAL TEXT INSERT, never re-serialized.
- ⚠ Constraint-forbidden pairs are REPORTED, never counted as coverage gaps — counting them
  would make full coverage unreachable and train a reader to ignore the number.
- ⚠ Census: one new test file, six titles, one suite title. The new `tests/fixtures/` file
  is a `.js`, not a `.test.js`, so it moves no census figure.
