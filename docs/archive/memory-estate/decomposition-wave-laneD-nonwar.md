---
name: decomposition-wave-laneD-nonwar
description: "THE DECOMPOSITION WAVE lane D (non-war) landed 5 commits on claude/composite-r4: 4 baseline entries DELETED, settlementSlice ratcheted 1226->994; npcGenerator blocked (HK-3 lane owned it) and the settlementSlice remainder deferred on the loadEngine lazy-chunk hazard"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T15:45:49.461Z
---

# THE DECOMPOSITION WAVE — lane D (non-war tranche), 2026-08-03

Ran in `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold` on
`claude/composite-r4`. Burns down the `scripts/.size-baseline.json` entries that
chair ruling R-BLD-6 banked (see [[rbld6-size-baseline-rebaseline]]). Method per
file: golden-pin BEFORE, behaviour-identical VERBATIM range extraction into
leaves, then delete the baseline entry (under the 800 layer ceiling) or lower it.

## Landed — five commits, one per file

| file | before → after | commit | baseline |
|---|---|---|---|
| `src/domain/display/causeConjunctionRoleContent.js` | 3890 → 26 | `267d13e8` | DELETED |
| `src/generators/historyGenerator.js` | 826 → 655 | `1a820e8c` | DELETED |
| `src/store/aiSlice.js` | 829 → 757 | `f237010c` | DELETED |
| `src/pdf/lib/viewModel.js` | 998 → 698 | `f570becb` | DELETED |
| `src/store/settlementSlice.js` | 1226 → 994 | `947799f0` | RATCHETED, entry kept |

Committed, NOT pushed. Leaves created: `src/domain/display/causeConjunctionRole/<role>.js`
(12), `src/generators/history/historyEventStrands.js`, `src/store/aiDossierPinActions.js`,
`src/store/aiChronicleAppend.js`, `src/pdf/lib/viewModelBodySlices.js`,
`src/pdf/lib/viewModelPrimitives.js`, `src/store/settlementLifecycleHelpers.js`,
`src/store/settlementVersionHistoryActions.js`.

## Two things NOT done, and why

1. **`src/generators/npcGenerator.js` (1350) — NOT ATTEMPTED, entry still in the
   baseline.** The split was built and measured (691 / 304 / 369, all under 800)
   and then FULLY REVERTED: `git diff HEAD` showed the file carried another
   lane's uncommitted HK-3 work (`hookRegistry`, `themeOfText`,
   `./hookThemes.js`). That lane has since committed at `46255ad5`, so the file
   is now safe to take. The leaf plan that worked: `npc/npcGoalContent.js`
   (generateNPCRelType + generateCharacterTitle + pickTitle) and
   `npc/npcFactionMerge.js` (mergeNPCLists), re-exported from the head.
2. **`settlementSlice.js`'s remaining 194 lines — DELIBERATELY DEFERRED,
   recorded verbatim in the `_decomposition_wave_laneD_2026_08_03` note inside
   `scripts/.size-baseline.json`.** They are the generation lane
   (`generateSettlement` + `regenSection`) and the canon-event lane
   (`applyEvent` + `undoLastEvent`). The generation lane is **not** a
   like-for-like move: it closes over the module-local memoized `loadEngine()`,
   so extracting it relocates a LAZY chunk boundary and must be re-proved against
   the first-paint byte-budget build tests (`tests/build/vendorPdfLazy.test.js`,
   `tests/build/engineChunkLazy.test.js`) with a real `npm run build`. See
   [[lazy-chunk-import-reparents-eager-closure]].

**Why:** the lawful terminal state for a baselined file is "under its layer
ceiling, entry deleted, layer rule guards it" — but `tests/lint/sizeBaseline.test.js`
also accepts (and demands) a LOWERED number, so a partial decomposition still
locks its win permanently. Stopping at a proven partial beats an unverified
extraction across a lazy-chunk boundary.

**How to apply:** to continue, take npcGenerator first (plan above), then the
settlementSlice generation lane WITH the build gate. Measure with eslint's own
Linter, never `wc -l` — the ratchet counts `max-lines {skipBlankLines,
skipComments}`, so moving COMMENTS saves nothing; only code lines count. A ready
measurement script pattern: `new Linter({configType:'flat'}).verify(code, {rules:
{'max-lines': ['error', {max:1, skipBlankLines:true, skipComments:true}]}})`,
parse `(N)` from the message.

**Attribution discipline that was required here:** the minifold tree is shared
with 5+ live lanes. `tests/property/generatorGoldenMaster.test.js` (523 same-seed
sha256 rows) went red mid-lane from the HK-3 lane's uncommitted generation edits,
not from this lane. Every same-seed claim was re-proved in a throwaway
`git worktree add --detach <scratch> HEAD` with `node_modules` symlinked from
minifold and ONLY this lane's files copied in. Do that, not `git stash`.

Related: [[rbld6-size-baseline-rebaseline]], [[wr7b-size-ratchet-decomposition]],
[[sizebaseline-exact-ceiling-hazard]], [[filename-anchored-source-pin-vacuity]],
[[minifold-tree-is-live]].
