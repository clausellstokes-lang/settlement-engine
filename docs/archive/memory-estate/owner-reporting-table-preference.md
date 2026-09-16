---
name: owner-reporting-table-preference
description: "Owner standing order (2026-07-19) — after EVERY commit/landing report, include the updated remaining-work table (item · kind · status · purpose)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T05:10:41.764Z
---

Owner, 2026-07-19 (refined same day): the updated remaining-arc table is included
in the report whenever an ITEM IN THE TABLE COMPLETES (a slice/wave/phase/gate
lands) — NOT after every commit ("okay not update every commit but for every
complete item above in the list"). Columns: # · Item · Kind · Status · Purpose;
statuses kept current (Running / Next / Queued / Gate / ⛔Owner); completed items
drop off with a one-line landed note.

**Why:** the owner tracks program progress through this one artifact; prose-only
reports made them ask "what's left to run?" repeatedly.

**How to apply:** maintain the table in-chat with every ledger-commit report; the
canonical long-form state stays in [[comprehensive-review-fix-program]]'s ledger +
THE_REMAINING_ARCHITECTURE.md — the table is the digest, never a replacement.
