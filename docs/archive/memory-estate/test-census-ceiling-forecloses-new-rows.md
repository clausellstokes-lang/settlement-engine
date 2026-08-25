---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-10
  type: hazard + program law
  lane: step-15 ratchet reconciliation
  commits: measured at 9df7e428
  modified: 2026-08-10T17:53:45.730Z
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
---

# ⭐⭐ "JUST CENSUS IT" IS NOT AVAILABLE — the test census is AT its pinned ceiling

## The fact

`scripts/.test-ratchet-baseline.json` holds **exactly 17 entries**, and
`tests/lint/testRatchet.test.js:177` pins `const CEILING = 17` as a **LITERAL**
(deliberately not read from the baseline — that would be the self-referential
pin class and would rise silently with every added row). The pin:

```js
test('the committed ceiling never rises (the ratchet is monotone-down)', () => {
  expect(Object.keys(baseline.entries).length).toBeLessThanOrEqual(CEILING);
});
```

Its comment is explicit: **"MONOTONE DOWN from here. You may burn it; you may never pad it."**

## Why it matters

Any brief, plan, or instruction that offers "if you cannot fix it, add it to the
census as a new attributed row" is **describing an unavailable option**. Adding a
row reds the ceiling pin, so the census cannot absorb new debt at all — it can
only shrink. A step-15 reconciliation therefore has exactly three lawful
dispositions per failing identity: lock-the-win (lower a pin to the measured
value), re-point (fix a moved address without re-freezing), or genuinely fix.

Two further gates narrow it further:

- ⛔ **NEVER RE-ADD A WALKER ROW.** A failing TEST is debt; a failing WALKER is a
  DISABLED GUARD. The walker-census law is executable machinery in the last
  `describe` of `testRatchet.test.js`, identifying walkers by a FIVE-ARM union
  (name / title / structure / delegated structure / `@enforcement-walker` marker).
  Genuine walker debt relocates to **the walker's own shrink-only inventory**, never
  the census.
- The `WALKER_ROWS_ADMITTED` / `WALKER_ROWS_OWED` ledgers are **exact-identity** and
  shrink-only; a walker row in neither ledger reds.

## How to apply

Before planning any ratchet-reconciliation work, read `testRatchet.test.js`'s header
and `CEILING` FIRST — it determines the entire shape of the lane. If the honest cure
for an identity is gated (needs an owner decision) and the census is full, the correct
outcome is to **escalate that identity and leave it red-with-attribution**, not to force
green. Report it as a principled blocker with the drafted edit ready for signature.

Corollary observed 2026-08-10: several of these walkers ALSO forbid their own inventory
from absorbing new violations (`negativeAssertionAnchor` — "Never raise a number; never
add a file"; `couplingInclusion`'s baseline is for §4 PRE-PROGRAM debt only). So for
those, the only door is curing the source.
