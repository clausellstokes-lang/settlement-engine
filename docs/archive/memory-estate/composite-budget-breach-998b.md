---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  type: hazard / owner-decision-queue
  commits: "composite fold-2 6f5d29ae, completion b4e0f017; assembly COMPLETED through aad6265e (folds 1-3 + freshness cure 7009db36) — the breach is the SOLE push blocker (claude/the-composite)"
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T12:56:35.494Z
---

# The composite first-paint budget breach — 998 B, owner-gated

**What:** At THE COMPOSITE ASSEMBLY fold 2 (claude/traditions @ 80b8ad71 merged at
6f5d29ae), the entry static closure went to **1,040,998 B vs the 1,040,000 ratchet**
(tests/build/vendorPdfLazy.test.js, RATCHET #11). verify:dist red; the plain
`npm test` full suite does NOT carry this red (dist contracts fire under verify:dist).

**Attribution (all CONFIRMED by probe builds, measure-closure over dist):**
- base 78a04afc = 1,038,588 · +deep-craft = 1,039,830 (+1,242) · +traditions alone =
  1,039,754 (+1,166) · composite = 1,040,998 (the sum). Each lane green on its own
  base; the SUM breaches. Neither lane is at fault.
- The traditions bytes are HONEST registration, not a lazy-seam leak: engine-core
  +793 ≈ customContentSchema validateTradition + duplicated TRADITION_*_KEYS (the
  T5-c custom-content bucket; schema deliberately duplicates corpus keys to avoid
  eager corpus drag — drift-guard-pinned); index +375 ≈ slice/vocabulary/
  OutputContainer/dossierLazyTabs registration + plotHooks hook seam (32 B).
- PROVEN INNOCENT (0 B eager): the T-1 TraditionsTab (lazy via dossierLazyTabs),
  the RealmStrip almanac Seg (RealmStrip is NOT in the entry closure), the
  pulseKernel mover wiring (pulseKernel rides the LAZY engine chunk, not eager
  engine-core), prose/traditionProse pools (lazy chunks).

**Why it's owner-gated:** budget raises are owner-signed (the ratchet's own text:
"the FINAL tightening happens at the composite gate"); the only real reduction lane
is schema/slice de-eagering = sync→async persisted-path conversion, recorded
owner-gated in [customregistry-deeagering-gated]. No removable-without-owner subset
reaches 998 B. Options for the owner: (a) sign a raise ≥ +998 B (1,040,998 exact),
or (b) order the de-eagering lane.

**How to apply:** never "fix" this by editing the budget test or golfing eager
modules. Re-measure with the BFS static-closure method (scratchpad
measure-closure.mjs replicates the test). Kill-list note: the census counts COMMENT
lines too — a comment naming GOLD_BG/borderRadius re-trips the ratchet.
