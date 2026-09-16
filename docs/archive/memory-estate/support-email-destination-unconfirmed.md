---
name: support-email-destination-unconfirmed
description: Support mailto now defaults to support@settlementforge.com — owner has not yet confirmed that inbox is monitored
metadata: 
  node_type: memory
  type: project
  originSessionId: 02d8aeaa-1e9f-4044-83fb-19a7e3497055
---

As of 2026-07-08, all support contact links route through `src/copy/support.js` (`SUPPORT_EMAIL` / `supportMailto(subject)`), which defaults to `support@settlementforge.com` (overridable via `VITE_SUPPORT_EMAIL`). This replaced the maintainer's personal address `clausellstokes@aol.com` across App.jsx, AuthModal.jsx, AccountSupportSection.jsx, and SingleDossierSuccessPage.jsx (part of the [[exhaustive-review-findings-deduped]] fix phase on branch `review-fixes-2026-07-08`).

**Why:** The new default changes where user support mail actually lands. If `support@settlementforge.com` is not a real, monitored inbox, support requests silently vanish.

**How to apply:** Before this branch deploys, confirm with the owner that the inbox is monitored, or set `VITE_SUPPORT_EMAIL` in the deploy environment to a known-good address. Once confirmed, delete this memory.

**UPDATE 2026-07-10 (reconciliation map):** The parallel branch fix/holistic-remediation carries an owner-directed support address — settlementforge@gmail.com, hardcoded at 3 call sites per their commit 9d7033aa. The reconciliation plan routes it through our copy/support.js seam. Still needs final owner ratification before deploy, but the destination question now has an owner-sourced answer; supersedes the support@settlementforge.com placeholder default.

**RESOLVED 2026-07-10:** Owner delegated ratification; settlementforge@gmail.com adopted through the copy/support.js seam (see [[reconciliation-decisions]]). This memory is closed.

**REOPENED 2026-07-18 (owner statement + DNS finding):** the owner's intended END
STATE is the BRANDED address — "support@settlementforge.com is suppose to redirect
to settlementforge@gmail.com." But `dig MX settlementforge.com` returns EMPTY (no
mail routing exists), so the branded address is a black hole today. FAIL-SAFE
SEQUENCING RULED (manager judgment under delegation, vetoable): code default STAYS
settlementforge@gmail.com (always deliverable) until forwarding is verified live;
THE VERY END deploy checklist carries the flip: (1) owner configures email routing
for settlementforge.com (registrar / Cloudflare Email Routing → the gmail),
(2) verify MX exists + one test mail round-trips, (3) flip SUPPORT_EMAIL's default
to support@settlementforge.com (the one-line change in src/copy/support.js) in the
same deploy batch. Never flip before the test passes.
