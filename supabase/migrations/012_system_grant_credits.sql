-- ────────────────────────────────────────────────────────────────────────────
-- 012_system_grant_credits.sql - Webhook-callable ledger-consistent grant.
--
-- The Tier 9.9 audit (docs/refund-ledger-audit.md) called out the
-- stripe-webhook's `update profiles set credits = credits + amount`
-- pattern at line 85. It's racy under concurrent spend and bypasses
-- the credit_ledger audit trail.
--
-- The existing `admin_grant_credits()` RPC (migration 009) gates on
-- `current_user_is_privileged()`, which requires an auth.uid() that
-- has role='developer' or 'admin'. The stripe webhook calls with the
-- service-role JWT - no auth.uid(), no profile row - so that RPC
-- rejects.
--
-- This migration adds `system_grant_credits()` - a SECURITY DEFINER
-- function that:
--   1. Verifies the caller is the service role (the only role outside
--      'authenticated' / 'anon'). The webhook uses the service-role
--      key after verifying the Stripe signature, so by the time we
--      hit this RPC, the request is already authenticated as Stripe.
--   2. Atomically increments profiles.credits via `credits = credits + N`
--      (no read-then-write race).
--   3. Writes the credit_ledger row + the legacy credit_transactions
--      row in the same transaction.
--   4. Audits to admin_actions with actor_id=NULL + the source string.
--
-- The trust chain remains:
--   Stripe → signature-verified webhook → service-role JWT → this RPC.
-- A direct call to this RPC from a non-service-role client is
-- rejected at step 1.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.system_grant_credits(
  target_user uuid,
  amount      integer,
  source      text,
  metadata    jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
  caller_role text;
begin
  -- Step 1: gate on service-role. auth.role() returns the role the
  -- request was authenticated as. For a service-role JWT it returns
  -- 'service_role'; for an authenticated user JWT it returns
  -- 'authenticated'; for anon it returns 'anon'.
  --
  -- We do NOT want this RPC reachable from authenticated client code,
  -- because that would let any user grant themselves credits.
  caller_role := current_setting('request.jwt.claim.role', true);
  if caller_role is null then
    caller_role := auth.role();
  end if;
  if caller_role <> 'service_role' then
    raise exception 'system_grant_credits is service-role only (got: %)', caller_role;
  end if;

  if amount <= 0 then
    raise exception 'amount must be positive (got: %)', amount;
  end if;
  if amount > 10000 then
    raise exception 'amount exceeds per-call limit (10000)';
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required (e.g. ''stripe_purchase'', ''single_dossier'')';
  end if;

  -- Step 2: ledger row (the source of truth for the new balance system).
  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (target_user, 'grant', amount, source, metadata);

  -- Step 3: legacy mirror so the old credit_transactions audit stays
  -- accurate until everything reads from credit_ledger.
  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, source);

  -- Step 4: atomic profile counter bump. `credits = credits + N` is
  -- safe under concurrent writes; the value never desyncs from the
  -- ledger because both writes are in the same transaction.
  update public.profiles
    set credits    = coalesce(credits, 0) + amount,
        updated_at = now()
    where id = target_user
    returning credits into new_balance;

  -- Step 5: audit. actor_id is NULL because the actor is the webhook,
  -- not a user. The before/after JSON captures the credit context.
  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object('new_balance', new_balance) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

-- Grant only to the service-role; the gate above enforces this, but
-- being explicit about EXECUTE keeps the API surface narrow.
grant execute on function public.system_grant_credits(uuid, integer, text, jsonb) to service_role;

comment on function public.system_grant_credits(uuid, integer, text, jsonb) is
  'Service-role-only: ledger-consistent credit grant for the Stripe webhook. Atomically writes to credit_ledger, credit_transactions, and profiles.credits, then logs an admin_actions row with actor_id=NULL.';
