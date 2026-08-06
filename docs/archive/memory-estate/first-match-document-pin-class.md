---
name: first-match-document-pin-class
description: "⚠️⚠️ An exec-based document pin reads the FIRST regex match — a volume that grows a SECOND matching sentence silently RETARGETS the pin, which then asserts agreement about two sentences nobody compared. Cure = a uniqueness guard (exactly-once per document) + never restate the pinned list elsewhere in the volume"
metadata:
  type: project
  created: 2026-08-04
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-04T16:50:54.711Z
---

# The first-match document-pin class (found by WR-10r, 2026-08-04)

WR-10's PIN 6 compares the war and trade volumes' degraded-bundle lists by
`exec`-ing a regex against each document. `exec` returns the FIRST match — so
any amendment that adds a second "bundle composes … only" sentence to a volume
would silently retarget the pin onto the new sentence, and the pin would keep
asserting "the twins agree" about two sentences nobody compared. WR-10r's own
first draft of the §3 amendment row was EXACTLY that second sentence — the
lane caught its own trap.

**Why:** document pins are the estate's mechanism for keeping two design
volumes honest about each other; a retargeting pin is worse than no pin
because it certifies agreement it no longer checks.

**How to apply:** every exec-based document pin needs (1) a uniqueness guard —
count matches, assert exactly 1 per document (WR-10r's mutant reds with
"expected 2 to be 1"); (2) the discipline that amendment rows POINT at the
canonical sentence rather than restating the list. ⚠ OPEN CHAIR ITEM: the
estate-wide sweep of other exec-based document pins (chair-scoped recon,
queued in the WR-10r erratum @ 18f0ced4). Related:
[[filename-anchored-source-pin-vacuity]], [[self-referential-pin-class]].
