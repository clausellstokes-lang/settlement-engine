-- ────────────────────────────────────────────────────────────────────────────
-- 062_close_authz_gaps.sql — close three authorization-completeness gaps found
-- by the full-codebase audit. None is an anonymous cross-user hole; each is an
-- inconsistency with the codebase's own stated invariants ("RLS on every table",
-- "every privileged write is audited", "agents own the support workflow").
--
-- GAP 1 — analytics_daily_rollups + export_cursors never got RLS (038).
--   038 created both tables but never ran `enable row level security`, while
--   every other table in the schema enables RLS. They hold low-sensitivity data
--   (aggregate daily counts; a one-row export bookmark — no raw PII), but if the
--   project carries the common default public-schema grants to anon/authenticated,
--   either is directly readable via PostgREST. The ONLY legitimate access is the
--   rollup writer (rollup_analytics_daily, SECURITY DEFINER, table-owner →
--   RLS-exempt) and analytics-export (service-role client → RLS-exempt). Enabling
--   RLS with NO policy default-denies anon/authenticated and leaves both
--   legitimate paths untouched. Mirrors the universal table posture.
--
-- GAP 2 — "Developers update any profile" (033) had no column lock, so any
--   elevated account (developer/admin) — or anyone who compromises one — could
--   self-escalate role/credits/tier/is_founder, or stamp moderation columns, via
--   a direct PostgREST `profiles` UPDATE that writes NOTHING to audit_log,
--   defeating the 050/051 audited-admin model for the one actor class that
--   matters most. The 061 correlated-subquery column-lock idiom cannot be reused
--   here: it needs the writer to be able to READ the target row, but there is no
--   privileged read-all SELECT policy on profiles (the 050 least-privilege model
--   deliberately routes privileged reads through MASKED RPCs, not raw SELECT), so
--   the subquery would return NULL for any other user's row and reject every
--   write. The correct fix is therefore to REMOVE the bypass entirely: drop the
--   policy so EVERY privileged profile mutation goes through the audited
--   SECURITY DEFINER RPCs (admin_grant_credits, set_account_banned/_disabled, the
--   admin-actions role change), which run as service-role/owner and never needed
--   this policy. Verified zero callers: the only direct profiles.update() in the
--   tree is stripe-webhook's, on the service-role client (RLS-exempt). A user's
--   own-profile edits keep working via the column-locked "Users update own
--   profile (safe preferences only)" policy (059/061), which is untouched.
--
-- GAP 3 — "Users update own support ticket" (055) had no column lock, so a ticket
--   OWNER could direct-UPDATE workflow fields the agent layer owns — set their own
--   status to 'resolved', bump priority to 'urgent' (queue-jumping), or reassign
--   `assignee` — bypassing the support+-gated RPCs (set_ticket_status, claim_ticket)
--   and their audit_log writes. The owner CAN read their own ticket ("Users read
--   own support messages", 002), so here the 061 correlated-subquery column-lock
--   DOES work: recreate the owner-UPDATE policy pinning the workflow/identity
--   columns (status, priority, assignee, ticket_number, linked_faq, user_id) to
--   their current values. The owner keeps "add context" (subject/message/metadata
--   stay editable) and reopen still works — it runs through post_ticket_reply
--   (SECURITY DEFINER, RLS-exempt), which is the documented path.
--
-- Re-runnable: enable-RLS is idempotent; DROP POLICY IF EXISTS + CREATE throughout.
-- Depends on: 038 (the two tables), 033 (the dev policy being removed), 055 (the
--             owner-update policy + columns), 002 (support_messages + self-read).
-- Tests: tests/security/migration062Authz.pglite.test.js (effect-based, with
--        SENTINELs proving each gap reproduces without 062).
-- ────────────────────────────────────────────────────────────────────────────

-- ── GAP 1: enable RLS on the two analytics tables (default-deny; no policy) ───
alter table public.analytics_daily_rollups enable row level security;
alter table public.export_cursors          enable row level security;

comment on table public.analytics_daily_rollups is
  'Persisted daily rollups. RLS-enabled with NO policy: anon/authenticated are default-denied. Written by rollup_analytics_daily (SECURITY DEFINER) and read by analytics-export (service-role) — both RLS-exempt.';
comment on table public.export_cursors is
  'Incremental-export bookmark. RLS-enabled with NO policy (default-deny); touched only by the service-role analytics-export function.';

-- ── GAP 2: remove the un-audited privileged profiles-UPDATE bypass ────────────
-- After this, the ONLY writers of role/tier/credits/is_founder/moderation columns
-- are the audited SECURITY DEFINER RPCs and the service-role webhook. The user's
-- own-profile self-update policy (column-locked by 059/061) is intentionally left
-- in place.
drop policy if exists "Developers update any profile" on public.profiles;

-- ── GAP 3: column-lock the owner support-ticket UPDATE ────────────────────────
drop policy if exists "Users update own support ticket" on public.support_messages;
create policy "Users update own support ticket" on public.support_messages
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    -- Pin the workflow + identity columns to their current values so the owner
    -- can add context (subject/message/metadata) but can never tamper with the
    -- agent-owned support workflow. `is not distinct from` makes a no-op write of
    -- the SAME value pass (so a legitimate context edit is never collateral-hit).
    and status        is not distinct from (select sm.status        from public.support_messages sm where sm.id = support_messages.id)
    and priority      is not distinct from (select sm.priority      from public.support_messages sm where sm.id = support_messages.id)
    and assignee      is not distinct from (select sm.assignee      from public.support_messages sm where sm.id = support_messages.id)
    and ticket_number is not distinct from (select sm.ticket_number from public.support_messages sm where sm.id = support_messages.id)
    and linked_faq    is not distinct from (select sm.linked_faq    from public.support_messages sm where sm.id = support_messages.id)
    and user_id       is not distinct from (select sm.user_id       from public.support_messages sm where sm.id = support_messages.id)
  );
