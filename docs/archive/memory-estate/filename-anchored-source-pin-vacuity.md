---
name: filename-anchored-source-pin-vacuity
description: "A structural pin that readFileSync's ONE source file and asserts string containment breaks on any code relocation — and worse, goes VACUOUS (green, matching nothing) the next time; cure is to read a declared module SET plus a non-empty assertion"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T15:46:10.189Z
---

# Filename-anchored source pins go vacuous when the code moves

Discovered 2026-08-03 during THE DECOMPOSITION WAVE lane D. Four separate
structural pins broke on **pure, behaviour-identical relocations** — no logic
changed, only which file a function lived in:

- `tests/pdf/screenParitySource.test.js` — `read('src/pdf/lib/viewModel.js')` then
  `toContain('deriveDefenseReadiness')`.
- `tests/pdf/viewModelDocReference.test.js` — same shape, `toContain('domain/display/parityContract.js')`.
- `tests/store/settlementSlice.test.js` — sliced `settlementSlice.js` between
  `'function resetSettlementIdentity'` and `'export const createSettlementSlice'`,
  and counted `/function resetSettlementIdentity/g` occurrences in that one file.
- `tests/store/advertisedUndoArming.walker.test.js` — `storeSource.get('settlementSlice.js')`
  then `/versionHistory/.test(settlement)`.

A fifth, `tests/lint/premiumGateSingleSource.test.js`, is an exact-SET census
keyed by path; its exemption row had to move with the code.

**Why:** the red is the harmless half. The dangerous half is that the same probe
can go **green while guarding nothing**. `expect((src.match(/function X/g) || []).length).toBe(1)`
fails loudly at 0, but `expect(src).not.toContain('bad-thing')` and any
`filter(...).length === 0` shape SUCCEED trivially once the file no longer holds
the code — a pure relocation silently converts the guard into a no-op that no one
will re-examine, because it is green. Same family as
[[harness-default-empty-state-vacuous-absence-pin]] and [[self-referential-pin-class]]:
the denominator quietly went to zero.

**How to apply:** when a source-reading pin's anchor moves, do NOT just repoint
the filename. Repoint it at the **code**:

1. Read a declared module SET — either an explicit list
   (`const DEFINING_MODULES = ['settlementSlice.js', 'settlementLifecycleHelpers.js']`)
   or a glob of the family (`readdirSync(dir).filter(f => /^viewModel.*\.js$/.test(f))`).
2. Add an explicit non-vacuity assertion in the same test file: the set is
   non-empty / every named module resolves / exactly ONE module in the set
   defines the symbol. Without it you have only moved the vacuity one step.
3. Prove the repaired pin still bites with a negative control before committing.
   The one run here: deleting a single `state.generationId = null;` from the
   moved `resetSettlementIdentity` reddened 4 tests; restoring it returned 28/28.

Repairs landed on `claude/composite-r4` at `f570becb` (the two PDF pins) and
`947799f0` (the three store/lint pins).

Related: [[decomposition-wave-laneD-nonwar]], [[self-referential-pin-class]],
[[harness-default-empty-state-vacuous-absence-pin]],
[[unanchored-net-current-extractor-class]].
