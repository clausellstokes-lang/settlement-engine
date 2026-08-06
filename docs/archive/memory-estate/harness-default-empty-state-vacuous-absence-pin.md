---
name: harness-default-empty-state-vacuous-absence-pin
description: ⚠️ An ABSENCE pin is vacuous when the shared render harness defaults the state that would produce the thing to EMPTY — the component self-hides on the emptiness branch before reaching the gate under test; cure = seed non-empty state + a source-level pin of the default
metadata: 
  node_type: memory
  type: project
  date: 2026-07-28
  tags: 
    - hazard
    - test-quality
    - vacuity
    - pins
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T04:36:31.325Z
---

Found 2026-07-28 by the Wave R-5 tail verifier, cured the same day (uncommitted, `claude/composite-r4`).

## The shape

`tests/components/settlementWorkbench.test.jsx` matrix row **M7** asserted that a `readOnly` caller passing no `canReview` gets no Change Dock. The shared `renderWorkbench` harness seeds `pendingEditsQueue: []` and `pendingEditReceipts: []`. `ChangeDock` returns `null` on its own emptiness branch **before** the entitlement gate is ever consulted — so the dock was absent for a reason unrelated to the property under test.

**The tell:** the verifier flipped `canReview`'s default from `false` to `true` in the signature and the whole suite stayed green. An absence pin that survives inverting the thing it pins is not a pin.

## The generalization

Any `queryBy*(...)  === null` / `not.toBeInTheDocument()` assertion is only load-bearing if the state that WOULD render the element is present. Shared harnesses with convenient empty defaults are the standard way this goes quiet. Before trusting an absence pin, ask: *would this assertion still hold if the gate were removed entirely?*

## The cure shape (both halves, deliberately)

1. **Render half** — seed NON-EMPTY owner-scoped state (a queued intent plus an applied receipt) so the absence is attributable to the gate and nothing else.
2. **Source half** — assert the declared default itself by reading the source and regexing the signature (`/canReview\s*=\s*false/`).

Two halves on purpose: they fail for *different* reasons, so a change to what the component chooses to render cannot silence the contract.

Refutation executed both ways: with the default flipped to `true` BOTH rows red (render row on the `Change Dock` heading, source row on the signature match); restored byte-exactly (sha256 verified identical) and 28/28 green.

## Related

Same family as the vacuity guards already in `tests/build/vendorPdfLazy.test.js` (the VERIFY_DIST anti-vacuity `it`, and the sentinel-PRESENT checks that keep the sentinel-ABSENT checks honest).
