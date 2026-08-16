# SK / SK-3 — the rung ladder and the differential re-soak scope (member 2 of `sk-b`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6c2bedad2064a523b9e7f61d7e0f6e61f0571650`
  (the `sk-a` terminal)
- **Train:** `sk-b`, family **SK**, member **2** of 5.
- **Depends on:** SK-4.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§141.3** · §42/§43 · §131.
- **Compile of record:** `laneTC28-SK-PLAN.md` §4.2.

---

## §1 ⛔ THE DIFFERENTIAL'S VALUE IS ENTIRELY IN ITS REFUSALS

An accelerant that occasionally scopes wrong is worse than no accelerant: it produces a
green re-soak over the wrong cells and calls the fix proven. The scope is the UNION of
three arms, any one sufficient — the reverse-dependency closure INCLUDING worker and
dynamic-import edges (a worker is a separate build, so edges are classified by REFERENCES,
not static specifiers — the TC-5bi lesson); every coupling-registry row whose `flags` or
`reads` intersect the change, over the **seven** measured registry files; and a
token-reference census of every changed exported symbol, the barrel-hop catcher.

## §2 ⛔ IT REFUSES ITSELF, AND EACH REFUSAL HAS ITS OWN CAUSE

`src/kernel/` (no bounded radius), `simulationRules.js` (re-scopes every cell), a pipeline
step-order change, and `package.json`/`package-lock.json` — **a dependency bump is a MINT
TRIGGER: the substrate moved, not the code, and no closure over source files can see that.**
Plus two structural refusals: the arms DISAGREEING on a core file (a file exactly one arm
sees is a file the other two are blind to, and blindness is what a differential cannot
afford), and a derivation that errored. **A failed derivation is a full soak, never a guess.**

## §3 ⛔ AT EVERY PHASE BOUNDARY THE FULL GRID RUNS REGARDLESS

The differential is an accelerant BETWEEN boundaries, never a substitute AT one, and asking
for one at a boundary is refused by name.

## §4 · §141'S REFUSED-BY-NAME LIST, MADE EXECUTABLE

Shortened centuries, sampled ticks and reduced seed grids each have their own refusal,
keyed on the SHAPE of the ask rather than on a flag name, so a differently-spelled version
of the same thinning is still refused. A rung is FINDINGS-ONLY and its report carries
`verdict: null` with the reason stated on the artifact — a reader should not need to know
the law to read the report.

## §5 · VALUES (§42/§43)

| value | band | home |
|---|---|---|
| control-sample size | `max(3, ceil(0.10 × grid))`, drawn by a seeded config-derived permutation | DERIVED. §141.3 names a control sample without a size; the floor of 3 is the release profile's own recorded precedent (*"three release probes across two seed families and two scale bands are enough to test the control oracle"*), and the 10% term scales it. **Chair-signed at promotion.** |
| composition | at least one cell from each seed family and each scale band | same home |

## §6 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the coupling registry is seven files and every one exists |
| A2 | the happy path is a differential over the union of the three arms |
| A3 | each refuse-to-full condition fires by its own cause, disagreement included |
| A4 | the control sample is banded, seeded and compositionally complete |
| A5 | the ladder gates cheapest-first and refuses every thinning §141 names |

## §8 · CHECKS

```
npx vitest run tests/soak-harness/blastRadiusUnion.test.js
```

## §9 · MUTANTS AND HAZARDS

- ⚠ The gating invariant is asserted over EVERY subset of clean rungs, not one hand-picked
  case — a hand-picked case passes on a ladder that gates only the pair the author tried.
- ⚠ A registry file list that has drifted would silently NARROW arm 2: the arm would still
  run, over fewer rows, and report a smaller radius with no error. The existence check is
  what makes that visible.
- ⚠ §102.3: `blastRadiusUnion.test.js` matches no `NAME_PATTERN` token ⇒ no row owed.
- ⚠ Census: one new test file, five titles, one suite title.
