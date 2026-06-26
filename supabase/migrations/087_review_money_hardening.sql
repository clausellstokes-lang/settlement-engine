-- 087_review_money_hardening.sql
--
-- Money / AI-cost hardening from the whole-codebase review (HEAD 1eaa03b). Four
-- independent, append-only fixes; the stripe-webhook + edge functions are updated
-- in the same change to use what this adds.
--
--   1. profiles.stripe_subscription_id — record the user's CURRENT subscription
--      so a redelivered / out-of-order customer.subscription.deleted for an OLD
--      (already-cancelled) subscription can't downgrade a user who has since
--      re-subscribed and is currently premium. Stripe redelivers + reorders
--      webhooks; the deleted-branch matched by stripe_customer_id ALONE.
--   2. refund_credits — close a concurrent double-refund window. The idempotency
--      guard is a check-then-insert with no lock; two redelivered refunds of the
--      same spend could both pass the check and double-credit. Adds FOR UPDATE on
--      the spend row (serializes refunds of one spend) + a DB-level unique index
--      (a backstop independent of the function path).
--   3. consume_ai_generate_rate_limit — make the ai_user_rate_limit operator
--      config LIVE. The defaults were 86400/60 and edge callers pass only p_user,
--      so the system_config tunable was dead. Defaults become NULL and the
--      function reads the config row when the caller doesn't override.
--   4. drop the deprecated, race-prone check_ai_spend_cap (079) — superseded by
--      the atomic reserve_ai_spend (086). Leaving it defined + granted invites
--      accidental reuse of the non-atomic path; nothing calls it now.

-- ── 1. Current-subscription column ──────────────────────────────────────────
alter table public.profiles add column if not exists stripe_subscription_id text;

-- ── 1b. Pin the new column IMMUTABLE in the end-user self-UPDATE policy ──────
-- CRITICAL: the stale-delete guard (stripe-webhook) trusts profiles
-- .stripe_subscription_id. Without pinning it here, an end user could
-- `update profiles set stripe_subscription_id = '<bogus>'` via their own RLS
-- UPDATE right (075's policy only pins the OTHER billing/identity columns), then
-- cancel — the webhook would see recorded != deleted and SKIP the downgrade,
-- keeping premium for free. Recreate 075's net-current self-UPDATE policy VERBATIM
-- with stripe_subscription_id added to the immutable pin list. It stays writable
-- ONLY via the service-role webhook (which bypasses RLS). Net-current = 075.
drop policy if exists "Users update own profile (safe preferences only)" on public.profiles;
create policy "Users update own profile (safe preferences only)"
  on public.profiles
  for update
  using (auth.uid() = id and public.account_is_active(auth.uid()))
  with check (
    auth.uid() = id
    and public.account_is_active(auth.uid())
    and role                   is not distinct from (select role                   from public.profiles where id = auth.uid())
    and tier                   is not distinct from (select tier                   from public.profiles where id = auth.uid())
    and credits                is not distinct from (select credits                from public.profiles where id = auth.uid())
    and is_founder             is not distinct from (select is_founder             from public.profiles where id = auth.uid())
    and stripe_customer_id     is not distinct from (select stripe_customer_id     from public.profiles where id = auth.uid())
    and stripe_subscription_id is not distinct from (select stripe_subscription_id from public.profiles where id = auth.uid())
    and email                  is not distinct from (select email                  from public.profiles where id = auth.uid())
    and banned_at              is not distinct from (select banned_at              from public.profiles where id = auth.uid())
    and disabled_at            is not distinct from (select disabled_at            from public.profiles where id = auth.uid())
    and deleted_at             is not distinct from (select deleted_at             from public.profiles where id = auth.uid())
    and account_number         is not distinct from (select account_number         from public.profiles where id = auth.uid())
    -- external_name has server-authoritative validation (reserved-name/charset/
    -- case-insensitive uniqueness) that lives ONLY in update_external_name(text)
    -- (075, SECURITY DEFINER). Pinning it here forces all writes through that
    -- validated RPC — a direct self-UPDATE can no longer set a reserved/duplicate/
    -- malformed public author name. The client already edits it only via the RPC.
    and external_name          is not distinct from (select external_name          from public.profiles where id = auth.uid())
  );

-- ── 1c. account_is_active: also grant to service_role (explicit, fail-closed) ─
-- The edge functions call account_is_active via the service_role admin client.
-- 057 granted it to `authenticated` only; service_role works today via Supabase's
-- default privileges, but make the grant EXPLICIT so a privilege-default change
-- can never silently brick the pre-spend account gate (the whole point is fail-
-- closed). Idempotent.
grant execute on function public.account_is_active(uuid) to service_role;

-- ── 2. refund_credits: serialize idempotency (net-current body = 085) ───────
-- Forked VERBATIM from 085's net-current body; the ONLY changes are the FOR
-- UPDATE on the spend-row read and the unique index below. Auth gates, the
-- dual-write, the legacy-counter bump, the optional admin audit, search_path,
-- and the 033/085 grant posture are all preserved exactly.
create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row record;
  is_admin boolean;
  is_service boolean;
  new_balance integer;
begin
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- FOR UPDATE: serialize concurrent refunds of the SAME spend so the
  -- check-then-insert idempotency below is atomic. A second (redelivered)
  -- refund blocks until the first COMMITs, then sees its grant and raises
  -- 'already refunded' instead of double-crediting.
  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row
    for update;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- An ELEVATED (dev/admin) spend never debited credits or wrote allocations
  -- (spend_credits skips the profiles.credits cache + credit_spend_allocations for
  -- metadata.elevated=true). Refunding it would BUMP profiles.credits for a debit
  -- that never happened — minting phantom credits. No-op + return the live balance
  -- (mirrors spend_credits' own elevated-skip; the edge already guards this, this
  -- is the RPC's defense-in-depth). Placed AFTER the ownership gate so a caller
  -- can't probe another user's balance via a non-owned elevated spend id.
  if coalesce(spend_row.metadata->>'elevated', 'false') = 'true' then
    return (select credits from public.profiles where id = spend_row.user_id);
  end if;

  -- Idempotency: don't double-refund. Any prior grant row referencing this
  -- spend id means it's already been refunded.
  if exists (
    select 1 from public.credit_ledger
    where source = 'refund'
      and metadata->>'refund_of' = spend_ledger_row::text
  ) then
    raise exception 'already refunded';
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      spend_row.user_id,
      'grant',
      spend_row.amount,
      'refund',
      jsonb_build_object('refund_of', spend_ledger_row, 'reason', refund_reason)
    );

  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  update public.profiles
    set credits = credits + spend_row.amount,
        updated_at = now()
    where id = spend_row.user_id
    returning credits into new_balance;

  if is_admin and auth.uid() <> spend_row.user_id then
    perform public._audit_action(
      auth.uid(),
      spend_row.user_id,
      'refund_credits',
      jsonb_build_object('spend_row', spend_ledger_row, 'amount', spend_row.amount),
      jsonb_build_object('new_balance', new_balance),
      refund_reason
    );
  end if;

  return new_balance;
end;
$$;

revoke execute on function public.refund_credits(uuid, text) from public;
revoke execute on function public.refund_credits(uuid, text) from anon;
revoke execute on function public.refund_credits(uuid, text) from authenticated;
grant  execute on function public.refund_credits(uuid, text) to service_role;

-- PRE-DEDUP (deploy safety): the unique index below ABORTS the whole migration if
-- the live ledger already holds a duplicate refund for any spend (producible by the
-- pre-085 refund path racing). Remediate first so `db push` can't brick on it:
-- for each over-refunded spend, keep the EARLIEST refund grant, delete the extras,
-- and reverse the phantom over-credit from the legacy profiles.credits counter
-- (the get_credit_balance ledger sum self-corrects once the extra rows are gone).
do $$
declare
  v_removed integer := 0;
  v_dup record;
begin
  -- Group by EXACTLY the unique-index key (metadata->>'refund_of') so the dedup
  -- can never leave a residual duplicate the index would then reject (grouping by
  -- (user_id, amount, refund_of) could miss a same-spend pair with a drifted amount).
  for v_dup in
    select (metadata->>'refund_of') as refund_of,
           array_agg(id order by created_at, id) as ids
      from public.credit_ledger
     where source = 'refund' and metadata ? 'refund_of'
     group by (metadata->>'refund_of')
    having count(*) > 1
  loop
    -- Delete every refund grant for this spend EXCEPT the earliest (ids[1]), and
    -- reverse the SUMMED deleted amount from each affected user's legacy counter
    -- (robust even if the duplicate grants drifted in amount).
    with extras as (
      delete from public.credit_ledger
       where id = any(v_dup.ids[2:array_length(v_dup.ids, 1)])
       returning user_id, amount
    )
    update public.profiles p
       set credits = greatest(0, p.credits - agg.total)
      from (select user_id, sum(amount) as total from extras group by user_id) agg
     where p.id = agg.user_id;
    v_removed := v_removed + (array_length(v_dup.ids, 1) - 1);
  end loop;
  if v_removed > 0 then
    raise notice 'ux_credit_ledger_one_refund_per_spend pre-dedup: removed % duplicate refund grant(s)', v_removed;
  end if;
end $$;

-- DB-level backstop, independent of the function: at most one refund grant per
-- spend. A concurrent / out-of-band duplicate insert fails on this unique index
-- even if it somehow bypasses the FOR UPDATE serialization above.
create unique index if not exists ux_credit_ledger_one_refund_per_spend
  on public.credit_ledger ((metadata->>'refund_of'))
  where source = 'refund';

-- ── 3. consume_ai_generate_rate_limit: live operator config (net-current=079) ─
-- Defaults change from 86400/60 to NULL so the function can DISTINGUISH "caller
-- didn't override" from "caller passed the default" and read the
-- ai_user_rate_limit system_config row in that case (falling back to 86400/60 if
-- the row is missing/malformed). The edge callers pass only p_user, so they now
-- honour the operator tunable. Arity is unchanged; existing callers still work.
create or replace function public.consume_ai_generate_rate_limit(
  p_user           uuid,
  p_window_seconds integer default null,
  p_user_limit     integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window     timestamptz;
  v_user_key   text;
  v_user_count integer;
  v_cfg        jsonb;
begin
  -- When the caller doesn't override, read the operator-tunable config row.
  if p_window_seconds is null or p_user_limit is null then
    select value into v_cfg from public.system_config where key = 'ai_user_rate_limit';
    -- Defensive cast: a malformed (non-integer) config value must FALL BACK to the
    -- default, not RAISE — a raise propagates to the edge caller, which fails OPEN
    -- on RPC error and would silently DISABLE the per-user rate limiter.
    if p_window_seconds is null then
      p_window_seconds := coalesce((case when (v_cfg ->> 'window_seconds') ~ '^[0-9]+$' then (v_cfg ->> 'window_seconds')::integer end), 86400);
    end if;
    if p_user_limit is null then
      p_user_limit := coalesce((case when (v_cfg ->> 'per_user_limit') ~ '^[0-9]+$' then (v_cfg ->> 'per_user_limit')::integer end), 60);
    end if;
  end if;

  if p_window_seconds is null or p_window_seconds < 1 then p_window_seconds := 86400; end if;
  if p_user_limit is null or p_user_limit < 1 then p_user_limit := 60; end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  v_user_key := coalesce(nullif(btrim(p_user::text), ''), '00000000-0000-0000-0000-000000000000');

  insert into public.ai_generate_rate_limits as arl (user_key, window_start, count)
  values (v_user_key, v_window, 1)
  on conflict (user_key, window_start)
    do update set count = arl.count + 1
  returning arl.count into v_user_count;

  return jsonb_build_object(
    'allowed',        (v_user_count <= p_user_limit),
    'count',          v_user_count,
    'limit',          p_user_limit,
    'window_start',   v_window,
    'window_seconds', p_window_seconds
  );
end;
$$;

revoke all on function public.consume_ai_generate_rate_limit(uuid, integer, integer) from public;
grant execute on function public.consume_ai_generate_rate_limit(uuid, integer, integer) to service_role;

-- ── 4. Drop the deprecated, race-prone read-only spend-cap check ────────────
-- Superseded by reserve_ai_spend (086, atomic admission under an advisory lock).
-- generate-narrative + generate-chronicle both migrated off it; nothing calls it
-- now. Removing it prevents accidental reuse of the non-atomic admission path.
drop function if exists public.check_ai_spend_cap();
