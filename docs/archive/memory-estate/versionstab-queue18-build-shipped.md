---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-27
  status: shipped-in-tree (UNCOMMITTED at write time)
  lane: "R-5b tail / atlas owner queue #18"
  worktree: .claude/worktrees/minifold @ claude/composite-r4
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T03:39:46.502Z
---

# Queue #18 CLOSED: VersionsTab manual snapshot + side-by-side diff BUILT — ✅ FOLDED @ `b1aeec6d` 2026-07-27 ~23:20

(One commit with both dead-op halves. Post-build change in the same fold:
RegenerationDeltaCard's new prop is `heading`, NOT `title` — the title= census
counts the textual pattern `title=`, and the AdminPanel precedent renames the
presentation prop; VersionDiffView passes `heading="What the world did between
these points"`.)

## What shipped

Owner ruled BUILD on atlas queue #18 (the paid-surface pitch that sold two
features that did not exist). Both now exist:

1. **Manual snapshot lever.** `recordSnapshot` was registered and armed since
   Track K with **zero user-facing callers** (the R-0 census's standout
   op-but-no-exposure row). `src/components/settlement/VersionsTab.jsx` now
   mounts an optional-label input plus a **Take a snapshot** button calling
   `recordSnapshot({ saveId, kind: 'manual', label })`. This is its FIRST
   user-facing caller. The two internal callers (commitPendingEdits checkpoint,
   revertToSnapshot pre-revert) are untouched.
2. **Side-by-side comparison.** `src/components/settlement/VersionDiffView.jsx`,
   a lazy leaf behind `React.lazy` in VersionsTab. Read-only: no store access at
   all, pinned by a `not.toMatch(/useStore/)` assertion.

## ⚠️ THE LATENT DEFECT THIS BUILD EXPOSED (payload-spelling class)

`recordSnapshot` writes the frozen content under **`settlement`**
(settlementSlice.js). `buildVersionTimeline` (VersionsTab.jsx) only ever read
**`snapshot`**. So **every real store-written snapshot arrived at the UI with an
undefined payload** and nobody noticed for the whole life of the feature,
because revert addresses snapshots by `id` alone and no consumer ever read the
payload. Only the diff view needed it.

Cure: `const payload = v.settlement ?? v.snapshot;` (store spelling first,
legacy/fixture spelling as fallback) plus a `comparable: payload != null` flag.

**How to apply:** when a writer and a reader of the same record live in
different modules, the fixture in the reader's test will agree with the reader,
not with the writer. The pin that catches it must boot the REAL writer. That is
why `tests/components/versionDiffView.test.jsx` boots the real settlement slice,
calls the real `recordSnapshot` twice across a real edit, and routes the result
through the real `buildVersionTimeline` before rendering. A hand-rolled fixture
would have agreed with the bug.

## Architecture decisions (vetoable)

- **Reused `deriveRegenerationDelta` + `RegenerationDeltaCard`** for the
  translated half rather than hand-rolling a deep-object diff. A whole-settlement
  deep diff yields hundreds of rows like `powerStructure.factions[3].power`,
  which violates LEGIBILITY LAW and forks the repo's existing
  settlement-comparison authority. `RegenerationDeltaCard` gained ONE additive
  prop, `title`, defaulting to its original 'What changed in the rerun' string,
  because "rerun" is the wrong word for a version comparison.
- **The table half** covers what the derivations do not name: 3 identity fields
  (name / tier / population) plus the 14 authored prose paths.
- **`PROSE_FIELD_LABELS` extracted** from `WorkbenchProseEditor.jsx` to the
  zero-import leaf `src/components/dossier/proseFieldLabels.js`, re-exported from
  the editor so its existing importers and lockstep pin are untouched. Without
  the extraction the lazy diff chunk would have dragged the whole authoring panel
  in. MEASURED: `proseFieldLabels-w3GBSsvK.js` = 1.14 kB shared,
  WorkbenchProseEditor NOT in the diff chunk.
- **Snapshot lever withheld when `save?.id` is falsy.** With no save,
  `recordSnapshot` appends to the `draftVersionHistory` SIBLING, which this tab
  never reads (it reads `save.versionHistory`), so the button would look like a
  silent no-op. The tab shows "Save this settlement to start taking snapshots of
  it." instead.

## MEASURED (fresh vite production build)

- `VersionDiffView-C_RkyOSV.js` = **6.07 kB** (2.71 kB gzip), its own chunk.
- `VersionsTab-W8q_XKmp.js` = 11.98 kB. Static-import negative control pushed it
  to 14.95 kB with NO separate diff chunk, and `tests/build/versionDiffLazy.test.js`
  RED on exactly that.
- First-paint pins (vendorPdfLazy / firstPaintNonJs / engineChunkLazy) unchanged.
- `deriveRegenerationDelta` already had its own chunk (settlementSlice
  dynamic-imports it), so the diff leaf shares it and adds no new eager bytes.

## The lazy pin has a SECOND assertion worth copying

`tests/build/versionDiffLazy.test.js` asserts not only "absent from the entry
static closure" (the usual claim) but **"absent from the VersionsTab chunk"** —
located by a copy fingerprint, with an anti-vacuity check that the locator
actually found the tab. The parent surface here is ITSELF lazy, so the
entry-closure assertion alone would pass even with a static import. That is the
claim that pays: a reader who opens Versions to revert must not download the
comparison derivation stack.

## Bidirectional pitch honesty

`tests/components/versionsTabPitchHonesty.test.js` was rewritten: the two
formerly-negative pins became **positive + wired** (the pitch must claim it AND
the component must contain the mechanism). Both directions were negative-control
proven: removing the copy reds 2 tests, removing the mechanism (kind rename +
lazy-seam rewrite) reds the same 2. `Auto-snapshot on canonize` stays a NEGATIVE
with a non-vacuity check that reads `canonize()`'s body from settlementSlice and
proves it still records no snapshot.

## Files

`src/components/settlement/VersionsTab.jsx` (M) ·
`src/components/settlement/VersionDiffView.jsx` (new) ·
`src/components/dossier/proseFieldLabels.js` (new) ·
`src/components/dossier/WorkbenchProseEditor.jsx` (M, re-export) ·
`src/components/primitives/RegenerationDeltaCard.jsx` (M, `title` prop) ·
`src/copy/en.js` (M, `errors.snapshotRecordUnavailable` + `errors.snapshotRecordFail`) ·
`src/store/operationRegistry.js` (M, COMMENT ONLY — the R-0 "no user-facing
caller" note is now false) · tests: `versionsTab.test.jsx`,
`versionsTabPitchHonesty.test.js`, `versionDiffView.test.jsx` (new),
`tests/build/versionDiffLazy.test.js` (new).

None of the new tests needs an E-A manifest entry: `tests/build` is not an
enforcer dir and no basename carries invariant nomenclature.
`gen:compendium-data` is a NO-OP for this change (comment-only registry edit).

## Walker follow-through (closed 2026-07-27, later session)

`proseFieldLabels.js` tripped `tests/lint/economyReadModelCoverage.walker.test.js`
(its path literals contain `economicState`). Classified FROZEN_DEFERRED. ⚠️ Fixing
the unclassified red UNMASKED a second failure in the same test: the EXACT SET
test asserts serially, so the stale-entry check never ran while unclassified
failed first — the extraction moved every `economicState` token OUT of
WorkbenchProseEditor.jsx, whose FROZEN_DEFERRED entry had to be DELETED (it now
reaches the paths only through the classified helper, the walker's documented
helper-shape blind spot). Lesson: an extraction that moves tokens between files
moves walker-census membership in BOTH directions; expect a hidden second
assertion behind any first-assertion red.
