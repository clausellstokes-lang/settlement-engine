---
name: loop-endpoint-unreachable-when-step-doesnt-divide-bound
description: "⚠️⚠️ A `for (f=0; f<=BOUND; f+=STEP)` pin whose STEP does not divide BOUND silently never reaches its stated endpoint — and every 'obvious float fix' leaves it GREEN, so the tidy-up reads as vindication. Found in navFletching R5 (0.98/0.05=19.6) 2026-08-04; the paired finding is that multiply-by-white makes an authored token ratio a REAL pixel ratio at a gradient's lit stop"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8a9d5a1d-ff42-4f0a-9ac7-da0836233067
  modified: 2026-08-04T14:12:02.848Z
---

2026-08-04, lane V4D R-3b/R-3c, recorded in `docs/FABLE_VALIDATION_QUEUE.md`'s first
V4-family row @ `fc9534a4`.

## The loop class

`tests/components/navFletching.test.jsx`'s R5 pin (line 1514 at `9409d016`) reads:

```js
for (let f = 0; f <= SHAFT_STOPS.edge + 1e-9; f += 0.05)   // edge = 0.98
```

and its comment claims it checks "every twentieth of the depth down to SHAFT_STOPS.edge".
**It never evaluates 0.98.** `0.98 / 0.05 = 19.599999999999998` — the bound is not a
multiple of the step, so no 0.05 walk from 0 can land on it. The loop runs 20 iterations
ending at `0.9500000000000003`; the next value is `1.0000000000000002`, past the bound.
And the assertion WOULD fail at the endpoint: `ladderAt(0.98) = 1.3672` against its own
`> 1.5` floor. **The pin passing is the proof it never gets there.**

**WHY IT IS A TRAP AND NOT JUST A BUG.** The obvious diagnosis is float accumulation, and
it is wrong. Executed all three ways: the loop as written, integer stepping
(`f = i * 0.05`, last iterate `0.9500000000000001`), and dropping the `1e-9` slack — all
give the IDENTICAL 20 iterates and all stay GREEN. So a maintainer who "fixes the float"
sees no change and reads that as vindication. The `+ 1e-9` is dead code: it defends a
drift at a bound the loop never approaches. **Only ADDING the endpoint** (e.g. iterating
`[...grid, BOUND]`) reds it — and then the red is the pin telling the truth for the first
time, not a regression the fixer caused.

**How to apply:**

1. When you see `f += STEP` against `f <= BOUND`, compute `BOUND / STEP` before believing
   the range claim. Non-integer means the endpoint is unreachable BY CONSTRUCTION, in
   floats and in exact arithmetic alike.
2. Do not diagnose it as floating-point drift. That misdiagnosis generates a false hazard
   ("integer stepping will red it") that the next lane disproves in one command, and then
   discards the real finding with it. I published exactly that false hazard and the
   adversarial pass caught it.
3. The general shape: **a guard whose green depends on its own iteration set silently
   excluding the failing case.** Same family as the pin-vacuity entries — the assertion is
   fine, the domain it runs over is the lie. Check the tightest iterate's MARGIN (here
   f=0.95 gives 1.5792, margin 0.079 over the floor) — a comfortable margin next to a
   stated endpoint that fails is the tell.
4. Repairing it forces a real choice, so surface it rather than picking silently: add the
   endpoint and lower the floor (keeps the stated range, admits the number); add the
   endpoint and re-scope the comment to the last reachable grid point; or keep the loop and
   delete the range claim. The middle one is the smallest true statement.

## The paired finding: a white gradient stop makes an authored ratio a real pixel ratio

`WRAP_BARREL` is a neutral luminance MULTIPLY over the wrap turns, and its first two stops
are both `#FFFFFF` (`SHAFT_STOPS.lit = 0.09`). **Multiply by white is the identity**, so
across the bar's top 9% the turns render UNMODULATED and the authored token ratio
`WRAP_GLOSS:WRAP_EDGE = 2.12` IS the composited pixel ratio (crest byte-identical out to
~depth 0.100 under 8-bit rounding). Below the lit stop both tones dim together: 1.82
mid-bar, 1.37 at the edge stop, 1.23 in the silhouette.

Three separate docstrings had therefore over-corrected in the opposite direction — saying
2.12 "was never true of a pixel" / "no reader ever saw it" — and all three were repaired by
SCOPING the absolute ("below the lit stop"), not deleting it. ⚠️ Whenever a modulator's
ramp starts at white (or 1.0), the authored values survive to the screen in that band; an
"authored vs rendered" distinction needs the band named, or it becomes a new false claim.
⚠️ And that result is ANALYTIC over tokens, which is the failure R-2 exists for (deleting
one `backgroundBlendMode` line left 398 assertions green and rendered the wraps flat grey):
a raster confirmation of the band is still owed.

Related: [[self-referential-pin-class]], [[harness-default-empty-state-vacuous-absence-pin]],
[[unreachable-band-and-absent-self-belief]], [[v4d-bole-axis-split-and-blend-contract]],
[[foreign-file-vanish-is-not-destruction]].
