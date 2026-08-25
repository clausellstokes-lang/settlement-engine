---
name: landing-discipline-collides-with-path-reservation
description: ⚠⚠ "Every packet adding a test file re-derives the census IN ITS OWN CHANGE" collides with the exclusive-path reservation the moment TWO packets are READY — the validator refuses both
metadata:
  type: feedback
---

**MEASURED 2026-08-11.** The validator refused a promotion with
`duplicate change path across packets: tests/lint/sovereigntyLightingContract.walker.test.js
(TC-5A, ES-6A)` — **and it was right.** The standing landing discipline I had been putting
INTO every packet ("any packet adding a test file re-derives the lighting census whole, in
its own change") is unsatisfiable for more than one READY packet at a time, because the
census file is a single exact-pinned artifact and non-terminal packets reserve their change
paths EXCLUSIVELY.

**RULING: the FIRST CLAIMANT keeps the reservation; every later packet's census
re-derivation becomes a CHAIR POST-LANDING STEP** — the same shape as the observed-shape
`--write`. The later implementer MEASURES and REPORTS all five figures plus its isolated
delta, and does **not** touch the file. ⭐ Anchoring negatives stays PER-FILE and conflicts
with nothing, so that half of the discipline still belongs in every packet.

**Why: a discipline that every packet must satisfy on a SHARED artifact is not a
per-packet obligation at all — it is a chair obligation wearing a packet's clothes.** The
exclusivity rule is what exposed it; without the validator this would have surfaced as two
lanes silently overwriting each other's census figures.

⚠ Watch for the same shape on any other shared exact-pinned artifact —
`.observed-shape-readers-baseline.json` and `.test-ratchet-baseline.json` already work this
way (mechanical write, chair-owned, post-commit), which is the pattern to copy rather than
the exception.
Related: [[a-new-test-file-reds-two-censuses-at-landing]],
[[receipt-vacuity-and-shared-ratchet-rules]], [[implementation-packet-dispatch-system]].
