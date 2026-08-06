---
name: rbld10-pulsekernel-banked-permanently
description: "CHAIR RULING R-BLD-10 — pulseKernel.js is BANKED PERMANENTLY at 1580, NOT owed burn-down: the 800 ceiling is structurally unreachable (whole consequence_fold extraction still lands at 864) and deeper cuts risk THE PROMISE; also corrects the fork census to 22, not 54"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T21:03:09.428Z
---

# R-BLD-10: pulseKernel is retained at 1580 — do not re-open it as debt

Ruled 2026-08-03, LANE KR. Landed @ `f5582322`; ledger row @ `1caf2fbe`.
Vetoable, and the veto surface is written in `docs/FABLE_VALIDATION_QUEUE.md`.

## The ruling

`src/domain/worldPulse/pulseKernel.js` stays in `scripts/.size-baseline.json` at
its measured **1580**, with a `_r_bld_10_pulsekernel_banked_permanently_2026_08_03`
rationale key naming this ruling. **THE DECOMPOSITION WAVE closes at three of four
by ruling, not by a fourth deferral.**

## Why (measured, not argued)

- Extracting the **ENTIRE** `consequence_fold` body — the largest stage, **718
  effective** — still lands the head at **864**. The maximal sanctioned move does
  not clear 800.
- Clearing 800 needs `consequence_fold` AND `mover_planes` together: the two
  stages holding **65 of the 68 mutable-spine writes**, which inverts R-BLD-4's
  writer-family law (the kernel is a write-sequencing SPINE; its stage bodies ARE
  the writers the head must keep).
- The plan already breaks **nine machine-enforced source-address assertions across
  six walkers** (cycle-16 K-2 measurement).
- **The deeper price is THE PROMISE:** the kernel's PRNG call order IS the stream
  identity. Deeper rewrites risk a same-seed shift **for a size number**. Refused.

## What still binds

1580 is a **CEILING, not a licence**. eslint reds growth past it;
`tests/lint/sizeBaseline.test.js` reds a shrink below it that is not banked by
lowering the number. **Only the obligation to reach 800 is retired.**

## How to apply

- A future lane reading `1580` must read the `_r_bld_10` key first — it is NOT a
  burn-down row. Re-opening requires a chair veto, and a veto also re-opens the
  three questions the K-2 stop-report row left standing.
- **`applyWorldPulse.js` is DIFFERENT:** it sits at 941, still **141 over** the
  ceiling, and that remainder IS owed debt (surgery inside `applyWorldPulseOutcomes`).
  This ruling does not cover it.

## Corrected for the record

`pulseKernel` carries **22** `rng.fork` sites, **not 54**. The 54 circulated in the
wave's working notes only; a repo-wide grep over `docs/`, `src/`, `tests/`,
`scripts/` proves it was never written to the tree, so the ruling key is the record.
