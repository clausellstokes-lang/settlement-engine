---
created: 2026-08-03
tags: [WR-7c, coalitionRatification, chair-ruling, verification, landed]
status: LANDED dark @ minifold cb681e9d
---

# R-BLD-8a/8b/8c — the cycle-6 verifier's three residuals on `chooseAmongCompetingOffers`

`src/domain/worldPulse/coalitionRatification.js` (still DARK and unwired).
Suite `tests/domain/coalitionRatificationWr7c.test.js`: **22 passed** (was 18).

## Why
Three defects the WR-7c wave shipped, each with an executed counterexample:
- **8a cross-side union.** `unionCoalitionWeight` sums by `memberId` and never asked
  whose side a member is on, so two OPPOSITE-side tallies of one episode unioned into
  a nine-weight "coalition" that never met and ratified. Cured with the same
  `side_mismatch` spelling `ratifyTermSheet` already uses, read off the BALLOTS
  (the tally publishes no side).
- **8b self-contradicting sole offer.** The arm copied the tally's verdict while
  computing `holds` at the CALLER's band ⇒ `ratified` + a chosen sheet sitting beside
  `holds === false`. Cured twice: the verdict is now DERIVED from the signed union
  margin (>band ratified, < −band refused, else close), AND a tally decided at a band
  the caller did not ask for refuses closed (`band_mismatch`). **Band check ruled
  GENERAL, not sole-arm-only — a deviation from the brief's letter, recorded vetoable.**
  A widening round must RE-TALLY at the new band, never re-decide stale verdicts.
- **8c forged summary.** `unionMargin01` divided the tally's own `acceptWeight` by a
  denominator the module counted itself; `acceptWeight: 999` against a union of 6
  chose the refused sheet. The ballot walk now recounts accept weight
  (`accept_weight_mismatch`). Only `acceptWeight` is recounted — the other summary
  fields decide nothing (deliberate, recorded).

## How to apply
- ⚠️ **A by-construction guard is not a mutant-killer.** The invariant walk over 24
  compositions killed NO mutant, because with matched bands the copied and derived
  verdicts coincide. It only became load-bearing after adding a tally whose every
  field is honest except a forged `verdict` string. Run the mutant control that
  targets each pin individually; a pin that kills nothing is decoration.
- Mutant-control recipe used here: `perl -0pi` the single line out, run the suite,
  `cp` back from a scratchpad backup, re-verify the sha256 (`325aec62…`).
  NEVER `git checkout --` on an uncommitted target.
