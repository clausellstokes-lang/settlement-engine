---
name: v4c-arrow-final-landed
description: "V4C (arrow final) landed 4 commits, verifier PASS with two unpinned defects (analytic-pin mirror + breakpoint scope); V4D repair dispatched; owner glance decisions staged"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T08:04:54.054Z
---

# V4C — the arrow's final lane LANDED (2026-08-04); V4D repairs the verifier's findings

## State

Four pathspec-tight commits on minifold: `653be592` (wood finishes: growth seed 11,
pores seed 13), `dd86e5f9` (thread-true whipping), `5acf5e93` (counsel pass R1-R8 +
SealImpression.jsx + textureBudget totality ratchet), `5ddd0d08` (R7 nock, built-and-shown,
one-deletion revert). Verifier: **PASS WITH TWO UNPINNED DEFECTS** — every numeric
receipt reproduced to the digit; V4D dispatched for the defects.

## ⚠️⚠️ Two hazard classes worth never re-learning

1. **THE ANALYTIC-PIN MIRROR CLASS** — the R5 pin computed the multiply
   ANALYTICALLY from WRAP_BARREL×WRAP_GLOSS tokens and never asserted the
   COMPONENT performs it. Deleting the single `backgroundBlendMode: 'multiply,
   normal'` line in ShaftWrap.jsx turned both wraps into a flat #D7D7D7 stripe —
   the loudest object on the bar — with all 398 design+nav tests green. Same
   shape as [[fixture-mirrors-deriver-dead-arm-class]], one level up, at the CSS
   layer. Cure = assert the RENDERED declaration + blend-list length ==
   image-list length + an `@supports not` fallback arm. (The list-index coupling
   between backgroundImage and backgroundBlendMode is an invisible contract —
   adding a third layer without extending the blend list breaks silently too.)
2. **THE BREAKPOINT-SCOPE GAP** — R1's plaque cure was discharged by eye and by
   pin on the 38px DESKTOP bar; on the 60px MOBILE bar the plaque survived WHOLE
   (dead-straight top/bottom boundaries, ~11px bare cedar above), because the
   bole bed hugs the wordmark's ink while the BAR grows. Eye passes and
   geometry pins must run PER BREAKPOINT; `CHROME.headerMobile` re-measures
   everything (the spec's own risk (d), landed on the bole instead of the riders).
3. Docstring claims must be MEASURED: the V4 "2.12:1 wound ladder" was
   arithmetic about two authored hexes that never met a screen (real: 1.806:1,
   and WRAP_GLOSS reached the screen nowhere below the top 9%); the
   SHAFT_GRAIN_LAYERS "darkening by construction" claim is false at row 37
   (GRAIN paints SHAFT_EDGE over fallen RIM). V4D corrects both IN PLACE.

## Owner glance decisions STANDING (do not build past them)

- **R7 NOCK keep/drop** — builder AND independent verifier lean DROP (invisible
  at 1x; a nock says "the object ENDS here" against the arrow-past-the-frame
  conceit; horn grey is the one off-family material, compounding beside the
  parchment SIGN IN). Revert = delete ShaftNock.jsx + NavRibbon's import+element;
  no token outlives it. Screenshots delivered (V-nock-stack-1x/2x).
- **Seal device impression** — struck into the BOWL as strokes (the 9-unit
  annulus fits no device; counter stays a true hole, proven over #00FF00).
  Observation from both agents: 28px is muddy, **40px is the safer threshold**
  (metadata's 28 is owner-confirmed, so unchanged). NO CONSUMER for the ≥28px
  register exists yet — wiring one is NEW SURFACE, documented not owed.
- **Two spec corrections, vetoable**: growth-line y-frequency 0.05 (spec's 0.55
  is a 1.8px period finer than the grain — cannot make its own "2-3 broad
  streaks"); pore-fleck frequency pair TRANSPOSED (spec's literal numbers
  elongate flecks ACROSS the shaft, contradicting its own sentence).
- **R3 stands**: quill line 2.5px, no keyline — reads as a gold rule, not a
  progress bar. Say "veto" for 3px + keyline.

## THE WHOLE-ARROW VERDICT (g) — honest and compositional, owner-level

At arm's length: **a warm wooden nav bar with a superb piece of fletching — not
yet ONE war arrow.** Three reasons, none inside any lane's brief: (1) no taper
and no head — a uniform 38px band reads as a turned RAIL; (2) two competing
left ends — the branded bole anchors the eye exactly where the head should be
off-frame; (3) the right third (reference tabs + parchment SIGN IN on bare
wood) reads as ordinary navigation, so the arrow terminates at the trail wrap.
What DOES land: three real feathers, two real bindings, a name branded into
wood. Any further move is COMPOSITIONAL (taper/head, or moving the brand off
the shaft's line) — more texture is now FORBIDDEN by R6's enforced budget
(textureBudget.test.js, retina cues ≤2% effective ink, totality-checked).

## Lane-craft note

The concurrent WZ-5 lane left `import { appendFileSync } from "node:fs"` as
DIRTY instrumentation in src/domain — it externalises in the browser and killed
the dev server for every concurrent lane. Instrument via test-local wrappers,
never dirty src edits; V4C correctly moved to a detached worktree on :5202 and
tore it down after.
