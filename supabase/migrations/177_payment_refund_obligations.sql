-- ────────────────────────────────────────────────────────────────────────────
-- 177_payment_refund_obligations.sql — durable refund obligations for payments
-- that SettlementForge accepted but cannot fulfill.
--
-- WHY
--   A refund is an external Stripe side effect. A handler can decide that money
--   must be returned and then crash before (or after) Stripe acknowledges the
--   refund. Webhook delivery is also unordered. The obligation therefore needs
--   a durable, queryable database record that exists independently of one Edge
--   invocation and whose Stripe status cannot be regressed by a late handler.
--
-- SCOPE
--   This is deliberately payment-purpose agnostic. Initial callers are rejected
--   credit auto-reloads and late subscription Checkouts for a deleted account.
--   `purpose` identifies that workflow; `reason` records the specific rejection.
--   One PaymentIntent has one obligation. Optional user, auto-reload-attempt, and
--   Checkout Session links are fill-once context and may be absent or later
--   nulled by account deletion without erasing the financial obligation. Those
--   mutable links are database context only: Stripe refund request metadata is
--   built from the canonical immutable row fields returned by this RPC, so a
--   replay under the same Stripe idempotency key has identical parameters.
--
-- ORDERING
--   record_payment_refund_obligation is the only mutation surface:
--     * an update carrying stripe_event_created_at outranks a handler observation
--       with no Stripe event timestamp;
--     * among Stripe events, a newer timestamp changes status; equal-second
--       events use the safety rank failed/canceled > succeeded >
--       requires_action > pending;
--     * when neither observation has an event timestamp, terminal status wins
--       over non-terminal status and requires_action wins over pending.
--   Stripe can report a later failure after an earlier succeeded status, so
--   terminal states are NOT globally immutable. A newer Stripe event may change
--   any prior status, including succeeded -> failed.
--
-- SECURITY
--   RLS is enabled with no client policies. The service role can inspect rows but
--   cannot mutate the table directly; all writes pass through the service-role-
--   gated, SECURITY DEFINER RPC below so identity and ordering rules are atomic.
--
-- Depends on: 158_credit_auto_reload.sql.
-- @rollback:
--   drop function if exists public.record_payment_refund_obligation(
--     text, text, integer, text, text, text, text, text, uuid, uuid, text,
--     timestamptz, timestamptz
--   );
--   drop table if exists public.payment_refund_obligations;
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.payment_refund_obligations (
  payment_intent_id       text primary key,
  stripe_refund_id        text unique,
  checkout_session_id     text,
  user_id                 uuid references auth.users(id) on delete set null,
  attempt_id              uuid references public.credit_auto_reload_attempts(id)
                              on delete set null,
  purpose                 text not null,
  amount_cents            integer not null,
  currency                text not null,
  reason                  text not null,
  status                  text not null default 'pending',
  failure_reason          text,
  stripe_event_created_at timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  resolved_at             timestamptz,

  constraint payment_refund_obligations_payment_intent_nonempty
    check (btrim(payment_intent_id) <> ''),
  constraint payment_refund_obligations_refund_id_nonempty
    check (stripe_refund_id is null or btrim(stripe_refund_id) <> ''),
  constraint payment_refund_obligations_checkout_id_nonempty
    check (checkout_session_id is null or btrim(checkout_session_id) <> ''),
  constraint payment_refund_obligations_purpose_nonempty
    check (btrim(purpose) <> ''),
  constraint payment_refund_obligations_amount_positive
    check (amount_cents > 0),
  constraint payment_refund_obligations_currency_iso
    check (currency ~ '^[a-z]{3}$'),
  constraint payment_refund_obligations_reason_nonempty
    check (btrim(reason) <> ''),
  constraint payment_refund_obligations_status_valid
    check (status in ('pending', 'requires_action', 'succeeded', 'failed', 'canceled')),
  constraint payment_refund_obligations_resolution_matches_status
    check (
      (status in ('pending', 'requires_action') and resolved_at is null)
      or
      (status in ('succeeded', 'failed', 'canceled') and resolved_at is not null)
    ),
  constraint payment_refund_obligations_terminal_has_refund_id
    check (
      status not in ('succeeded', 'failed', 'canceled')
      or stripe_refund_id is not null
    ),
  constraint payment_refund_obligations_failure_matches_status
    check (failure_reason is null or status in ('failed', 'canceled'))
);

alter table public.payment_refund_obligations enable row level security;

comment on table public.payment_refund_obligations is
  'Durable service-only obligations to refund an unfulfillable Stripe payment. One row per PaymentIntent; status writes are ordered atomically by record_payment_refund_obligation.';

comment on column public.payment_refund_obligations.stripe_event_created_at is
  'Created timestamp of the newest Stripe event whose refund status was accepted. NULL means the current status came from a synchronous handler observation.';

create index if not exists idx_payment_refund_obligations_unfulfilled
  on public.payment_refund_obligations(status, updated_at)
  where status <> 'succeeded';

create index if not exists idx_payment_refund_obligations_checkout_session
  on public.payment_refund_obligations(checkout_session_id)
  where checkout_session_id is not null;

revoke all on table public.payment_refund_obligations
  from public, anon, authenticated, service_role;
grant select on table public.payment_refund_obligations to service_role;

create or replace function public.record_payment_refund_obligation(
  p_payment_intent_id text,
  p_purpose text,
  p_amount_cents integer,
  p_currency text,
  p_reason text,
  p_status text,
  p_stripe_refund_id text default null,
  p_checkout_session_id text default null,
  p_user_id uuid default null,
  p_attempt_id uuid default null,
  p_failure_reason text default null,
  p_stripe_event_created_at timestamptz default null,
  p_resolved_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_payment_intent_id text;
  v_purpose text;
  v_currency text;
  v_reason text;
  v_status text;
  v_stripe_refund_id text;
  v_checkout_session_id text;
  v_failure_reason text;
  v_resolved_at timestamptz;
  v_row public.payment_refund_obligations%rowtype;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'record_payment_refund_obligation is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  v_payment_intent_id := btrim(coalesce(p_payment_intent_id, ''));
  v_purpose := lower(btrim(coalesce(p_purpose, '')));
  v_currency := lower(btrim(coalesce(p_currency, '')));
  v_reason := btrim(coalesce(p_reason, ''));
  v_status := lower(btrim(coalesce(p_status, '')));
  v_stripe_refund_id := nullif(btrim(p_stripe_refund_id), '');
  v_checkout_session_id := nullif(btrim(p_checkout_session_id), '');
  v_failure_reason := nullif(btrim(p_failure_reason), '');

  if v_payment_intent_id = '' then
    raise exception 'payment_intent_id is required';
  end if;
  if v_purpose = '' then
    raise exception 'purpose is required';
  end if;
  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'amount_cents must be positive';
  end if;
  if v_currency !~ '^[a-z]{3}$' then
    raise exception 'currency must be a three-letter ISO code';
  end if;
  if v_reason = '' then
    raise exception 'reason is required';
  end if;
  if not (
    v_status = any (
      array['pending', 'requires_action', 'succeeded', 'failed', 'canceled']
    )
  ) then
    raise exception 'unsupported refund status: %', coalesce(v_status, '');
  end if;
  if p_stripe_refund_id is not null and v_stripe_refund_id is null then
    raise exception 'stripe_refund_id cannot be blank';
  end if;
  if p_checkout_session_id is not null and v_checkout_session_id is null then
    raise exception 'checkout_session_id cannot be blank';
  end if;
  if v_status in ('succeeded', 'failed', 'canceled')
     and v_stripe_refund_id is null then
    raise exception 'stripe_refund_id is required for terminal refund status';
  end if;

  if v_status in ('succeeded', 'failed', 'canceled') then
    v_resolved_at := coalesce(
      p_resolved_at,
      p_stripe_event_created_at,
      now()
    );
  else
    v_resolved_at := null;
  end if;

  if v_status not in ('failed', 'canceled') then
    v_failure_reason := null;
  end if;

  insert into public.payment_refund_obligations as obligation (
    payment_intent_id,
    stripe_refund_id,
    checkout_session_id,
    user_id,
    attempt_id,
    purpose,
    amount_cents,
    currency,
    reason,
    status,
    failure_reason,
    stripe_event_created_at,
    resolved_at
  ) values (
    v_payment_intent_id,
    v_stripe_refund_id,
    v_checkout_session_id,
    p_user_id,
    p_attempt_id,
    v_purpose,
    p_amount_cents,
    v_currency,
    v_reason,
    v_status,
    v_failure_reason,
    p_stripe_event_created_at,
    v_resolved_at
  )
  on conflict (payment_intent_id) do update set
    stripe_refund_id = coalesce(
      obligation.stripe_refund_id,
      excluded.stripe_refund_id
    ),
    checkout_session_id = coalesce(
      obligation.checkout_session_id,
      excluded.checkout_session_id
    ),
    user_id = coalesce(obligation.user_id, excluded.user_id),
    attempt_id = coalesce(obligation.attempt_id, excluded.attempt_id),
    status = case
      -- A newer Stripe event is authoritative, even when it changes one terminal
      -- state to another (for example succeeded -> failed). Stripe event.created
      -- is second-resolution, so an equal-second event wins only when its safety
      -- rank is strictly higher: failed/canceled > succeeded > requires_action >
      -- pending.
      when excluded.stripe_event_created_at is not null
       and (
         obligation.stripe_event_created_at is null
         or excluded.stripe_event_created_at > obligation.stripe_event_created_at
         or (
           excluded.stripe_event_created_at = obligation.stripe_event_created_at
           and (
             case
               when excluded.status in ('failed', 'canceled') then 4
               when excluded.status = 'succeeded' then 3
               when excluded.status = 'requires_action' then 2
               else 1
             end
           ) > (
             case
               when obligation.status in ('failed', 'canceled') then 4
               when obligation.status = 'succeeded' then 3
               when obligation.status = 'requires_action' then 2
               else 1
             end
           )
         )
       )
        then excluded.status
      -- Once an event-derived status exists, a handler observation with no event
      -- timestamp (or an older/equal event) cannot overwrite it.
      when obligation.stripe_event_created_at is not null
        then obligation.status
      -- Neither side is event-derived: keep terminal handler outcomes monotonic.
      when obligation.status in ('succeeded', 'failed', 'canceled')
        then obligation.status
      when excluded.status in ('succeeded', 'failed', 'canceled')
        then excluded.status
      -- requires_action is more advanced than pending for unordered handler
      -- observations.
      when obligation.status = 'requires_action'
        then obligation.status
      else excluded.status
    end,
    failure_reason = case
      when excluded.stripe_event_created_at is not null
       and (
         obligation.stripe_event_created_at is null
         or excluded.stripe_event_created_at > obligation.stripe_event_created_at
         or (
           excluded.stripe_event_created_at = obligation.stripe_event_created_at
           and (
             case
               when excluded.status in ('failed', 'canceled') then 4
               when excluded.status = 'succeeded' then 3
               when excluded.status = 'requires_action' then 2
               else 1
             end
           ) > (
             case
               when obligation.status in ('failed', 'canceled') then 4
               when obligation.status = 'succeeded' then 3
               when obligation.status = 'requires_action' then 2
               else 1
             end
           )
         )
       )
        then excluded.failure_reason
      when obligation.stripe_event_created_at is not null
        then obligation.failure_reason
      when obligation.status in ('succeeded', 'failed', 'canceled')
        then obligation.failure_reason
      when excluded.status in ('succeeded', 'failed', 'canceled')
        then excluded.failure_reason
      when obligation.status = 'requires_action'
        then obligation.failure_reason
      else excluded.failure_reason
    end,
    stripe_event_created_at = case
      when excluded.stripe_event_created_at is not null
       and (
         obligation.stripe_event_created_at is null
         or excluded.stripe_event_created_at > obligation.stripe_event_created_at
         or (
           excluded.stripe_event_created_at = obligation.stripe_event_created_at
           and (
             case
               when excluded.status in ('failed', 'canceled') then 4
               when excluded.status = 'succeeded' then 3
               when excluded.status = 'requires_action' then 2
               else 1
             end
           ) > (
             case
               when obligation.status in ('failed', 'canceled') then 4
               when obligation.status = 'succeeded' then 3
               when obligation.status = 'requires_action' then 2
               else 1
             end
           )
         )
       )
        then excluded.stripe_event_created_at
      else obligation.stripe_event_created_at
    end,
    resolved_at = case
      when excluded.stripe_event_created_at is not null
       and (
         obligation.stripe_event_created_at is null
         or excluded.stripe_event_created_at > obligation.stripe_event_created_at
         or (
           excluded.stripe_event_created_at = obligation.stripe_event_created_at
           and (
             case
               when excluded.status in ('failed', 'canceled') then 4
               when excluded.status = 'succeeded' then 3
               when excluded.status = 'requires_action' then 2
               else 1
             end
           ) > (
             case
               when obligation.status in ('failed', 'canceled') then 4
               when obligation.status = 'succeeded' then 3
               when obligation.status = 'requires_action' then 2
               else 1
             end
           )
         )
       )
        then excluded.resolved_at
      when obligation.stripe_event_created_at is not null
        then obligation.resolved_at
      when obligation.status in ('succeeded', 'failed', 'canceled')
        then obligation.resolved_at
      when excluded.status in ('succeeded', 'failed', 'canceled')
        then excluded.resolved_at
      when obligation.status = 'requires_action'
        then obligation.resolved_at
      else excluded.resolved_at
    end,
    updated_at = now()
  where
    -- Money identity is immutable. Nullable contextual links may be supplied on
    -- a later retry, but two distinct non-null identities must never be merged.
    obligation.purpose = excluded.purpose
    and obligation.amount_cents = excluded.amount_cents
    and obligation.currency = excluded.currency
    and (
      obligation.stripe_refund_id is null
      or excluded.stripe_refund_id is null
      or obligation.stripe_refund_id = excluded.stripe_refund_id
    )
    and (
      obligation.checkout_session_id is null
      or excluded.checkout_session_id is null
      or obligation.checkout_session_id = excluded.checkout_session_id
    )
    and (
      obligation.user_id is null
      or excluded.user_id is null
      or obligation.user_id = excluded.user_id
    )
    and (
      obligation.attempt_id is null
      or excluded.attempt_id is null
      or obligation.attempt_id = excluded.attempt_id
    )
  returning * into v_row;

  if not found then
    raise exception
      'payment_intent_id % already has conflicting immutable refund identity',
      v_payment_intent_id;
  end if;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.record_payment_refund_obligation(
  text, text, integer, text, text, text, text, text, uuid, uuid, text,
  timestamptz, timestamptz
) from public, anon, authenticated, service_role;
grant execute on function public.record_payment_refund_obligation(
  text, text, integer, text, text, text, text, text, uuid, uuid, text,
  timestamptz, timestamptz
) to service_role;

comment on function public.record_payment_refund_obligation(
  text, text, integer, text, text, text, text, text, uuid, uuid, text,
  timestamptz, timestamptz
) is
  'Service-role idempotent upsert for one durable payment refund obligation. Returns the canonical immutable request identity used for Stripe replay; nullable links remain database-only context. Newer Stripe event timestamps outrank handler observations, while equal-second events use failed/canceled > succeeded > requires_action > pending.';
