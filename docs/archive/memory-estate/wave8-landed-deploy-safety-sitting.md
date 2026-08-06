---
name: wave8-landed-deploy-safety-sitting
description: 2026-07-26 evening — Wave 8 LANDED (migs 189/190) + 12 deploy-safety/merge rulings recorded; partial-refund rule becomes POLICY with a goodwill path
metadata: 
  node_type: memory
  type: project
  originSessionId: 89567b52-be97-4ef9-bcce-a0f1c8956737
  modified: 2026-07-27T03:32:10.020Z
---

Owner order 2026-07-26 ("do all of these" over queue items 6–17). All recorded in OWNER_DECISION_QUEUE.md in-place; ledger row same date.

**WAVE 8 LANDED** @ composite-r4 2725780e (limiter + M11 gate) / 02ae1d6f (mig 189 member-privacy parity) / 91ec7c22 (webhook chokepoint + mig 190 credit clawback) / 478e8e13 (owner desk docs):
- **POLICY (not accident anymore):** every reversal class → FULL clawback (CRIT-1); classifyChargeReversal names the class and records it durably (p_reason); goodwill = credit grants, NEVER partial refunds. After the train deploys, partial refunds are SAFE-and-classified; until then, still issue none.
- Credit-pack refunds claw back in full; balance may go NEGATIVE (netting proven in pglite 20→−30→+40→10); mig 190 RPC system_clawback_credits, claim-once mirror of the grant; redeem_code untouched; auto-reload unreachable by this arm.
- Members leak truth: `goal`/`gender`/`power` leaked under factions[].members[]; `secret`/`plotHooks` were ALREADY depth-caught. mig 189 + publicSafe NPC_PUBLIC_KEYS twin; ⚠️ `publicNpc` must stay a plain object literal (gallerySanitizer.pglite regex-parses it).
- verify-checkout-session limiter: fail-closed per-user 30/h + per-IP 90/h via shared checkUserIpRate (rides deployed mig-036 RPC — no new deploy dep).
- amr CONFIRMED WIRED: admin-actions:48 checkTwoKey+decodeJwtAmr, enforce ~424-435.

**Rulings shorthand:** D1 CSP enforce-at-deploy · T9 rehearsal-first · D7 Connect@PUSH#3 pre-founder-activation · M35 reclaim-first (92973282 candidate) · M31 keep-NUL+allowlist · M32 CLOSED EMPTY · T11 support-email flip = VITE_SUPPORT_EMAIL env only, NO code.

**Owner artifacts:** docs/ops/OWNER_CONSOLE_RUNSHEET.md (all owner-physical acts) · docs/legal/LEGAL_CONSULT_PACKET.md (T10; 4 repo copy defects → queue M41: FAQ 7-day refund promise vs CRIT-1, $5.99 vs $6.00, stale draft credit costs, $25/$49.50 doc split).

**How to apply:** quote mig numbers as 189/190 occupied (next free 191). See [[master-merge-already-executed]] for the same sitting's merge discovery; [[backup-exposure-2026-07-26]] for push state.
