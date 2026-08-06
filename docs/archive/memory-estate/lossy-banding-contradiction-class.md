---
name: lossy-banding-contradiction-class
description: "⚠️ Banding is LOSSY — two numbers on either side of a threshold routinely share a band, so a naive band translation of a comparison sentence yields \"prices it great but it would cost great\" on a CORRECT verdict. Cure = each clause names ONE band and the comparison is stated in WORDS; scalars stay on the returned read for traceability"
metadata:
  type: project
  created: 2026-08-04
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-04T16:51:04.120Z
---

# The lossy-banding contradiction shape (WR-10r, 2026-08-04)

When WR-10r banded the sovereignty receipts (GAME-GRADE TRANSLATE: no raw
floats in prose), the naive translation of the ceiling_reached sentence — swap
each scalar for its band word — would have produced "prices the town great
but the bundle would cost it great" on a perfectly correct verdict, because
value and cost sat on opposite sides of a threshold INSIDE the same band. A
banded comparison between two same-band numbers reads as a contradiction.

**Why:** this generalises to every TRANSLATE surface in the estate — any
receipt that compares two scalars cannot band both sides of the comparison
independently.

**How to apply:** each receipt clause names ONE band; the comparison itself is
stated in words ("…and the price clears it" / "…which its reserve refuses"),
never implied by band adjacency. The raw scalars stay on the RETURNED READ
(LAW B traceability) — banding governs prose only. Runtime guard: a
behavioural no-decimal pin on composed output (the source-scan ratchet cannot
see what a composer says at runtime). Shipped: sovereigntyAppraisalWr10 /
sovereigntyBundleWr10 receipt pins @ e3d98512. Related:
[[receipt-vacuity-and-shared-ratchet-rules]], [[game-grade-ux-doctrine]]
(the TRANSLATE law's memory lives in the index as GAME-GRADE UX).
