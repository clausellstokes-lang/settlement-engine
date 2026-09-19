---
name: faction-rename-de-eager-async-cascade
description: "⭐ domain/factionRename.js de-eagered 2026-07-28 (closure 1,041,231 → 1,034,021): renameFactionImpl is now ASYNC and the whole pending-edit COMMIT path (applyRename → applyOne → commitPendingEditScope) went async with it — the commit runtime already accepted Promise<object>"
metadata: 
  node_type: memory
  type: project
  date: 2026-07-28
  tags: 
    - first-paint
    - closure-budget
    - async-cascade
    - pending-edits
    - faction-rename
    - wave-r5
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T04:36:15.089Z
---

Landed 2026-07-28 on `claude/composite-r4` (minifold worktree) as cure 5 of the Wave R-5 tail must-fix set. **UNCOMMITTED** at time of writing.

## What moved

`src/domain/factionRename.js` (8,574 B minified) rode the first-paint closure on ONE static edge: `settlementSlice` (eager) → `settlementRenameHelpers.js` → the cascade. Measured red: closure **1,041,231** against the 1,040,000 budget. After the cure: **1,034,021** (−7,210 B, 5,979 B margin); the cascade now rides its own `factionRename-<hash>.js` lazy chunk, verified absent from the entry closure by string fingerprint.

The cure: `renameFactionImpl` dynamic-imports the cascade at its call seam (the `loadEngine` / `setPrimaryDeity` idiom), placed AFTER the two cheap refusals so a refused rename fetches nothing.

## ⚠️ The non-obvious cost — the sync commit chain

Making the writer async is NOT a local change. `renameFaction` is dispatched from the pending-edit commit coordinator, and that whole chain was synchronous:

```
settlementPendingEdits.applyRename  (reads result.changed)
  → applyOne
    → commitPendingEditScope
      → settlementPendingEditActions.commitPendingEditsAction
```

All four became `async`. What made it survivable: `src/application/commands/pendingEditCommitRuntime.js` already types its dependency `commit: (selection) => Promise<object>|object`, so the runtime and `adapters/pendingEditCommit.js` (which already `await`s) needed **zero** changes. Check that typedef before assuming a similar cascade is cheap.

Two traps inside the cascade:
- **`return await applyRename(...)` must keep the `await` INSIDE `applyOne`'s try.** A bare `return applyRename(...)` settles outside the frame and routes a writer exception past the `writer_exception` receipt into an unhandled rejection.
- **Reading `.changed` off an un-awaited promise is silent.** It yields `undefined`, so every real rename scores as `rename_not_applied` while the write still lands — a receipt that lies in the safe-looking direction.

## Why the store-action dispatch was preserved

The tempting shortcut — have `applyRename` import `renameFactionImpl` directly and stay synchronous — would have removed the only `src` caller of the `renameFaction` store action. `tests/store/deadOperationRatchet.test.js` scans for `.op(` / `.op` store-handle references and would have put `renameFaction` back on the shrink-only dead list. The comment at that test's 5→4 note names the commit coordinator's dispatch explicitly.

## Pins updated in lockstep (the action envelope is now a promise)

`tests/store/factionRenameConvergence.test.js` (5 tests), `tests/store/settlementSlice.test.js` (3), `tests/store/editActionPersist.test.js` (1).

⚠️ One of them was a **vacuity trap**: `expect(() => store.getState().renameFaction(99, 'X')).not.toThrow()` is meaningless against an async action (a rejected promise never throws in the caller's frame). Rewritten to `await expect(...).resolves.toMatchObject({ changed: false })`. Any `.not.toThrow()` pin on an action you are making async has the same defect.

## Related

- [[lazy-chunk-import-reparents-eager-closure]] — the mirror hazard (lazy importer inflating the eager closure).
- The `tests/build/factionRenameDoorLazy.test.js` header used to document the cascade as "deliberately eager, not a defect". That claim is retired in-file; the byte guard is `tests/build/vendorPdfLazy.test.js`.
