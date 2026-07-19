-- ────────────────────────────────────────────────────────────────────────────
-- 157_money_events.sql — THE MONEY SPINE (DESIGN_MONEY_WAVE §2, slice M-1)
--
-- ⚠ NUMBERING (manager coordination 2026-07-19): this wave takes 157-161 as
--   designed (money_events 157 · credit_auto_reload 158 · surveyor_provisioning
--   159 · founder_transfer_cases 160 · single_session 161). File 156 is minted by
--   two SIBLING lanes (the perimeter token-bucket lane + the Wave E mail-ops lane),
--   neither folded into this composite base (aad6265e, head 155) — so on THIS
--   isolated branch the chain jumps 155 → 157 and the on-disk gaplessness assertion
--   in tests/security/migrationSequenceAll.pglite.test.js reds at the 156 gap. That
--   red is a CROSS-LANE ARTIFACT resolved at fold, NOT a defect: the migrations
--   still apply cleanly (the syntax + ordering sub-tests stay green) and no
--   migration NUMBER is hardcoded anywhere in this wave's code (table/RPC NAMES are
--   the interface). The manager renumbers ALL lanes contiguously at fold (a pure
--   file rename + this header edit), per the doc's §8 collision-at-fold rule.
--
-- WHY THIS EXISTS
--   ONE append-mostly ledger that every money movement mirrors into. The purchase
--   ledger (#14) reads it; auto-reload (#13) writes its top-ups; the founder
--   transfer flow (#17) writes payment/payout/refund rows. The Stripe webhook is
--   the ONLY writer (service-role); the client only ever SELECTs its own rows.
--
-- SECURITY POSTURE
--   RLS ON. ONE policy: owner SELECT own rows (auth.uid() = user_id). No client
--   INSERT/UPDATE/DELETE policy of any kind → default-deny; service_role bypasses
--   RLS for the webhook writes. This mirrors the dossier_entitlements owner-read /
--   service-write posture (108).
--
-- LAW 9 (destruction paths spare money records): user_id references auth.users
--   ON DELETE SET NULL — a deleted account NEVER destroys the financial record,
--   and an anonymous single_dossier row legitimately carries user_id NULL. This
--   table is FK-INDEPENDENT of public.settlements BY CONSTRUCTION: the
--   dossier_entitlements.save_id → settlements(id) ON DELETE CASCADE at 108:74 is
--   the audited counterexample a money table must never reproduce (the retention
--   purge touches settlements/saved_maps only, so this table is purge-immune).
--
-- APPEND-MOSTLY, not append-only: `status` is the ONE sanctioned mutation
--   (a refund/dispute flips it via service-role UPDATE keyed on event_key);
--   every other column is immutable once written.
--
-- IDEMPOTENCY: event_key is UNIQUE and is the redelivery shield. Writers upsert
--   with onConflict:'event_key', ignoreDuplicates — a replayed webhook re-inserts
--   nothing (the single_dossier_purchases idiom). Key forms:
--     sess:{session_id}         checkout fulfillments (one-time + subscription start)
--     inv:{invoice_id}          subscription renewals
--     pi:{payment_intent_id}    auto-reload top-ups (157)
--     payout:{case_id}          transfers-out (160/M-8)
--
-- Depends on: 001 (auth.users). Re-runnable.
-- @rollback: drop table public.money_events; (holds financial/audit rows —
--   forward-fix per the runbook; drop only to unblock a broken deploy).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.money_events (
  id            uuid primary key default gen_random_uuid(),
  event_key     text not null unique,          -- writer-computed redelivery shield
  user_id       uuid references auth.users(id) on delete set null,
  occurred_at   timestamptz not null,
  kind          text not null check (kind in (
                  'credit_pack','founder_seat','single_dossier',
                  'subscription_start','subscription_renewal',
                  'surveyor_start','surveyor_renewal','auto_reload',
                  'seat_transfer_payment','seat_transfer_payout','refund_note')),
  amount_cents  integer not null,
  currency      text not null default 'usd',
  description   text not null,                  -- server-composed, human-readable
  receipt_url   text,                           -- Stripe-hosted, permanent (or NULL)
  status        text not null default 'paid'
                  check (status in ('paid','refunded','disputed','reversed')),
  stripe_session_id        text,
  stripe_invoice_id        text,
  stripe_payment_intent_id text,
  stripe_charge_id         text,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

alter table public.money_events enable row level security;

comment on table public.money_events is
  'Append-mostly money ledger (156, DESIGN_MONEY_WAVE §2). Webhook is the ONLY writer (service-role); clients SELECT own rows only. status is the sole sanctioned mutation (refund/dispute). FK-independent of settlements BY CONSTRUCTION (LAW 9); user_id ON DELETE SET NULL so a deleted account never destroys the record.';

drop policy if exists "Owner reads own money events" on public.money_events;
create policy "Owner reads own money events" on public.money_events
  for select
  using (auth.uid() = user_id);

-- The purchase-ledger read path: a user's rows, newest first.
create index if not exists idx_money_events_user_occurred
  on public.money_events(user_id, occurred_at desc);
