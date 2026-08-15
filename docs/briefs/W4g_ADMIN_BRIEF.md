# W4g Implementer Brief — Admin operator tooling

Opus implementer, Phase 5 Reunification W4g, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
docs/PHASE5_REUNIFICATION.md + memory/feature-parity-ledger.md §8. REFERENCE (read-only):
/Users/cstokes/Desktop/settlement-generator/settlement-engine.

FENCE: src/components/AdminPanel.jsx, src/components/admin/**. You MAY make a MINIMAL,
ADDITIVE handler addition to supabase/functions/admin-actions/index.ts ONLY IF an item
genuinely needs one (item 3) — flag it loudly in your report; do NOT touch any other edge
function or any other surface. NO git add/commit/stash.

## THE POINT OF THIS WAVE (read first)
OUR admin = 4 panels; THEIRS = 8. The load-bearing gap is a SECURITY DOWNGRADE: OUR user
management reads the `profiles` table RAW, client-side (AdminPanel.jsx:207
`supabase.from('profiles').select('*')` + inline UserRow AdminPanel.jsx:48) — unaudited raw
PII in the browser. THEIRS routes through the audited, redacted `list_users` action which
ALREADY EXISTS in OUR backend (supabase/functions/admin-actions/index.ts). Adopting
AdminUsersPanel is the fix; when it lands, the raw `profiles` read + inline UserRow MUST be
REMOVED (do not leave both paths — the raw read is the vulnerability).

## Backend reality (probed by the manager — verify each yourself before wiring)
- `admin-actions/index.ts` HAS `list_users` (+ a `subscription` action). → AdminUsersPanel backend PRESENT.
- Support TICKET workflow backend lives in `account-actions/index.ts` (ticket / ticketId /
  ticket_reply / ticket_number / status transitions). → SupportQueuePanel workflow likely wireable there.
- Pricing resync logic in `_shared/pricingResync.ts` + `pricing-resync-cron` (a CRON, no manual
  admin trigger endpoint found). → AiPricingResyncPanel needs a trigger path.
- NO sim-tuning persistence backend found (`sim_tuning`/`tuning` absent in supabase/functions).
  → AdminSimTuningPanel likely STOP-AND-REPORT.

## Items (verify each against the live tree + backend first)

1. **AdminUsersPanel (ledger §8, ABSENT → the security fix).** Adopt THEIRS'
   `admin/AdminUsersPanel.jsx` onto OUR floor, backed by the `admin-actions` `list_users`
   action (search / inspect / ban / disable / reveal-full). Mount in AdminPanel.jsx where the
   inline UserRow console is today. **REMOVE OUR raw `profiles` read (AdminPanel.jsx:207) + the
   inline UserRow (AdminPanel.jsx:48) once the panel is wired** — that raw PII read is the
   vulnerability this closes. Verify each sub-action (ban/disable/reveal-full) has a matching
   `admin-actions` handler; wire the ones that exist, STOP-AND-REPORT any sub-action whose
   backend handler is absent (do NOT fabricate a client-only ban that silently no-ops).

2. **SupportQueuePanel (ledger §8, PARTIAL — file EXISTS, not mounted).**
   `src/components/admin/SupportQueuePanel.jsx` already exists in OUR tree (W4d ported it) but is
   NOT mounted in AdminPanel.jsx. Mount it (the flagged one-line edit), replacing / beside OUR
   read-only messages list (AdminPanel.jsx:374). Wire its operator workflow (claim / assign /
   transition / reply / notes) to the EXISTING `account-actions` ticket handlers. Verify each
   operator action has a backend handler; wire what exists, STOP-AND-REPORT the rest (do not ship
   a claim/assign button that no-ops). NOTE: support email destination is unconfirmed
   (memory/support-email-destination-unconfirmed.md) — if any action sends email, do NOT hardcode
   a new destination; reuse the existing send-email path and flag it.

3. **AiPricingResyncPanel (ledger §8, ABSENT).** Adopt THEIRS' panel as a manual operator trigger
   for the pricing resync whose logic already exists (`_shared/pricingResync.ts`, today only fired
   by `pricing-resync-cron`). If `admin-actions` has (or you add a MINIMAL additive action that
   calls the SHARED `pricingResync` module — the ONE allowed edge edit, flagged) a resync trigger,
   wire it. If wiring would require anything beyond a thin additive admin-actions action delegating
   to the existing shared module, STOP-AND-REPORT instead. Keep it idempotent/guarded (a resync is
   a heavy op — confirm-before-fire, disable-while-running).

4. **AdminSimTuningPanel (ledger §8, ABSENT).** THEIRS exposes operator UI for the war-economy
   tuning knobs (defenderAttrition / warEconomyDrain / etc.). FIRST verify where those knobs live
   in OUR tree (likely domain constants/config, NOT a writable store/table) and whether ANY
   admin-writable persistence exists for them. If there is NO persistence backend, **STOP-AND-
   REPORT** — do not ship a panel whose changes can't persist (a tuning panel that resets on
   reload is worse than none). If (and only if) a persistence path already exists, wire it.

## DO-NOT-REGRESS (OURS parity — keep as-is): AdminTrendsPanel, AdminAnalyticsPanel, gallery
moderation — the ledger marks these at parity; don't churn them. The admin mobile DesktopOnlyGate
(ledger §8, marked RP) is NOT this wave — skip it.

## Laws + gates
Adopt onto our floor; STOP-AND-REPORT absent backends rather than shipping dead/no-op panels; the
raw `profiles` PII read MUST be gone once AdminUsersPanel lands. Admin is a LAZY route (the
icon-split covers admin) — keep new panel code lazy, reuse bundled icons; first paint must not
move. Gates: eslint clean; typecheck + domain-strict; build; verify:dist GREEN (budget 1,440,000);
goldens byte-identical (admin is UI-only, should not touch any golden — confirm). Add a focused
test IF a panel has non-trivial gating/wiring logic worth pinning (e.g. AdminUsersPanel renders
NO raw-PII path; the audited action is the only user source). Report per-item status, which
backends were present vs absent (the STOP-AND-REPORT list), whether the raw profiles read was
removed, any admin-actions edit you made (flagged), files + line counts, gate results, OURS parity
preserved.
