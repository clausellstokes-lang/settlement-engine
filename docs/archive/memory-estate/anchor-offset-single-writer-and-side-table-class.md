---
name: anchor-offset-single-writer-and-side-table-class
description: "theme.js ANCHOR_OFFSET = the About-family anchor-margin single writer (Compendium's 84 + a hardcoded 80 deferred); plus the hand-keyed-side-table defect class"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T16:27:51.502Z
---

2026-08-03 (cycle-8 R2 lane @ aaa6f3a4, verifier-confirmed 7/7 mutants):

- **`src/components/theme.js` exports `ANCHOR_OFFSET` (= CHROME.headerDesktop
  60 + SP.xxl 24 = 84) as the SINGLE WRITER for About-family anchor scroll
  margins** (HowToUse, howto/AboutManifesto, about/CompareSection all import
  it). ⚠️ Deliberately DEFERRED, recorded in the theme.js docstring: the
  Compendium's own `registrySlug.js ANCHOR_SCROLL_MARGIN = 84` (17 consumer
  sites) and `CatalogTabs.jsx:145`'s hardcoded `scrollMarginTop:80` (a live
  4px drift) — a future unification wave folds both into ANCHOR_OFFSET.
- **THE HAND-KEYED SIDE-TABLE DEFECT CLASS** (found via SECTION_BLURBS): a
  side table keyed by a manifest id, where a MISSING key renders EMPTY
  instead of throwing — every DOM pin stays green while the surface silently
  degrades. Cure = a totality pin: `Object.keys(table)` equals the manifest's
  id set BOTH directions + non-empty text per row. Sweep candidates: any
  `TABLE[u.id]` render over a manifest-driven list.

**Why:** two lanes independently hit the vacuous-green shape; the class is
generic across surfaces. See [[harness-default-empty-state-vacuous-absence-pin]].

**How to apply:** new anchor-bearing About/guide sections import ANCHOR_OFFSET
(never a literal); new manifest-keyed side tables get the totality pin the
same commit.
