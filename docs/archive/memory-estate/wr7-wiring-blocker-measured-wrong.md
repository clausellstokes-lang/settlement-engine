---
name: ""
metadata: 
  node_type: memory
  title: "⚠️⚠️ The WR-7c/7d wiring deferral's blocker is MEASURED WRONG — envoyPulse.js is the seam and it has 552 lines of headroom"
  date: 2026-08-03
  tags: 
    - war-program
    - wr-7c
    - wr-7d
    - wiring-deferral
    - size-baseline
    - hazard
    - r-bld-8d
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T18:06:09.386Z
---

# The WR-7 wiring blocker three waves recorded does not bind the wiring

## The claim that was wrong

WR-7b, WR-7c, WR-7d and THE DECOMPOSITION WAVE each deferred the live pulse
wiring with the same recorded reason: `applyWorldPulse.js` (1395) and
`pulseKernel.js` (1580) sit at EXACTLY their frozen R-BLD-6 baselines with zero
headroom, so one added effective line reds eslint at the pre-commit hook, and
R-BLD-6 forbids raising a baseline. A Fable dispatch on 2026-08-03 then opened
with "THE PULSE MOUTHS NOW HAVE HEADROOM" — also wrong, in the other direction.

**Both mouths are still at exactly zero** (measured at HEAD 397c184b: 1395/1395
and 1580/1580). `bb44fccc` split `peaceTerms` — file 2 of the war tranche's four
— and files 3 and 4 were never started.

## Why it does not matter — the seam that was never measured

The wiring writes to NEITHER mouth:

- `envoyPulse.js` is **248 effective against the 800 layer ceiling and carries no
  baseline entry — 552 lines of headroom.** It is the file the deferral text
  itself names ("Ratification belongs at the home-delivery seam in
  `envoyPulse.js`").
- `envoyPulse.js:23` imports and **`:264` already CALLS `applyWorldPulseOutcomes`**
  — the WR-5 mouth — so a WR-7d ransom claim lands AT THE MOUTH with zero edits
  to `applyWorldPulse.js`.
- `pulseKernel.js:96/1980` already imports and calls `advanceEnvoyDiplomacyPulse`,
  so a new stage inside `envoyPulse.js` needs zero edits to `pulseKernel.js`.
- `envoyErrand.js` is **691/800 since `42299b07` — 109 free** (the other file the
  wiring writes to, for the compromise-round re-mint).

**The real blocker is SCOPE, not size.** The stage must enumerate a coalition,
derive a power band per member, cast one ballot per member on that member's own
frozen picture, tally, choose among competing sheets, gate the carried sheet at
the mouth, and on `close` re-mint both mandates through `mintEnvoyErrand`.

## How to apply

Before deferring WR-7 wiring again on a size argument, re-measure `envoyPulse.js`
— not the mouths. Recorded @ `f6828d9d` in `docs/FABLE_VALIDATION_QUEUE.md`.

## The three chair questions that DO block it (none is a size question)

1. **The power band is a K3 fork.** `castRatificationBallot` requires a
   `powerBand` per member, and K3 names THE VOTE among the paths that may never
   read true world state. A coalition-ledger or settlement-tier derivation is a
   truth read inside a negotiation path and would force the mandated K3 import
   pin to widen; a picture-derived band keeps the pin closed but makes coalition
   legitimacy a belief. The volume settles neither.
2. **Does a coalition-less episode ratify at all?** Today a carried sheet lands
   unconditionally at the mouth once the exactness checks pass; WR-7c says a
   sheet binds nothing until ratified.
3. **⚠️ The compromise round collides with `MAX_CONCURRENT_ENVOYS`.**
   `mintEnvoyErrand` refuses `origin_capacity` at
   `activeAtOrigin >= MAX_CONCURRENT_ENVOYS` (default **2**, `envoyErrand.js:162-165`),
   while K2.4 sends BOTH sides out EVERY round with no round limit (law L). A
   court already holding two errands silently fails to open its round — the
   convergence terminator quietly stops terminating.

## Executed proof the family is dark (re-runnable shape)

A transitive import walk from `pulseKernel.js`, `applyWorldPulse.js` and
`envoyPulse.js` reaches **409 modules**. All six WR-7c/7d leaves —
`coalitionRatification`, `compromiseRound`, `envoyTestimony`, `ransomClaim`,
`ransomChoices`, `sendTwoDivergence` — come back **UNREACHABLE**. Four controls
the pulse genuinely reaches (`envoyErrand`, `negotiationPictures`,
`foreignGuestHold`, `envoyInterceptionStage`) come back REACHABLE, so the walk is
guard-the-guarded and not vacuous. `envoyTestimony` has exactly two src
importers, both themselves unreachable — the family is closed under its own
darkness.

## Related landings

- **R-BLD-8d built @ `04997090`** — `unionCoalitionWeight` now re-enforces
  `duplicate_member` (per offer) and ballot/sheet/episode identity
  (`sheet_mismatch`). Both probe2 counterexamples were reproduced on the unfixed
  module first: a duplicated ballot ratified a 3-of-6 minority at
  `unionMargin01: 1`, and an offer relabelled `ts.zzz` over `ts.a` ballots was
  chosen by id.
- **Pre-wiring dormancy baseline** (for the byte-identity compare the wiring
  owes): 27 committed dormancy fixtures aggregate to
  `sha256 7e947a3e473fedf1236c6277c21b903fc865ed2e7d088f5ffe95eb0df5487640`.
  ⚠️ `tests/property/peaceCausalDormancyGolden.test.js:309` is RED at HEAD
  (`3 of 15` vs `/^\d of 13/`) — inherited from an already-committed war wave and
  the queue forbids re-recording it silently.
