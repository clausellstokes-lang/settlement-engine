---
name: owner-risk-appetite-directive
description: "Standing owner directive (2026-07-27): always choose the best option even if it introduces risk — decisiveness over defensiveness in delegated calls; owner-gated classes still hold"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-27T09:30:02.837Z
---

Owner, mid-session 2026-07-27 (while resuming the capability remediation program): "always choose the best option even if it introduces risk."

**Why:** Complements [[owner-fix-philosophy]] (bold architecture over patches). The owner prefers the technically best option chosen decisively — a safer-but-worse alternative is the wrong pick even when the best one carries risk.

**How to apply:** In delegated judgment calls, pick the best-engineering option and record it vetoably per judgment-ledger; do not default to the timid variant to avoid risk. This does NOT unlock owner-gated classes (pushes/deploys, migrations, persistence shape, data deletion, security posture, paid surfaces, R-5/parked queue items) — those stay gated; the directive governs how to choose WITHIN delegated scope.
