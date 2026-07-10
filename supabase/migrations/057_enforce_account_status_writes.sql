-- ────────────────────────────────────────────────────────────────────────────
-- 057_enforce_account_status_writes.sql — make ban / disable / soft-delete REAL
-- at the database trust boundary (review B16 finding #1).
--
-- THE PROBLEM
--   053 added profiles.banned_at / disabled_at and 054 added profiles.deleted_at,
--   but NOTHING enforced them. A banned, disabled, or anonymised-soft-deleted user
--   kept a valid JWT and full write access — they could still spend credits and
--   mutate their settlements. Moderation was cosmetic: staff believed an abuser
--   was cut off when they were not.
--
-- THE FIX (database side; the edge-function auth gate is the other half)
--   1. account_is_active(uid) — one SECURITY DEFINER predicate that returns false
--      when ANY of banned_at / disabled_at / deleted_at is set. Owner-RLS already
--      scopes who can write WHICH rows; this adds WHETHER the account may write
--      at all. Reused by the write RPCs and available to RLS policies.
--   2. spend_credits (net-current body lives in 024) — reject up front when the
--      caller's account is not active, so a banned user cannot drain/charge credits
--      or invoke the paid AI endpoints (they all spend through this RPC).
--   3. mutate_settlement_batch (024) — reject up front so a banned/disabled/
--      soft-deleted user cannot create/update/delete settlements.
--
-- These two SECURITY DEFINER RPCs are the funnel for the write paths the audit
-- called out; gating them here closes the boundary even for a forged direct RPC
-- call that bypasses the client. (Revoking live refresh tokens on ban is an
-- auth-admin action handled in the admin-actions edge function, out of scope for
-- a SQL migration — noted in the function-side change.)
--
-- Re-runnable: CREATE OR REPLACE throughout; the RPC bodies are byte-for-byte the
-- 024 net-current versions plus the single guard line, so no behavior changes for
-- an active account.
-- Depends on: 053 (banned_at/disabled_at), 054 (deleted_at), 024 (the RPC bodies),
--             018 (get_credit_balance), 050 (current_user_is_privileged via 018).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. account_is_active(uid) — the status predicate ───────────────────────
-- True only when the profile exists and carries NONE of the lockout flags. A
-- missing profile is treated as inactive (fail closed). SECURITY DEFINER so it
-- can read the flags regardless of the (strict) profiles RLS.
create or replace function public.account_is_active(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_uid
      and banned_at   is null
      and disabled_at is null
      and deleted_at  is null
  );
$$;

revoke all on function public.account_is_active(uuid) from public;
grant execute on function public.account_is_active(uuid) to authenticated;

comment on function public.account_is_active(uuid) is
  'True when the account exists and is NOT banned / disabled / soft-deleted (053/054 flags). Fail-closed: an unknown profile is inactive. Gates the write RPCs so moderation flags actually cut off access.';

-- ── 2. spend_credits — block a non-active account before any debit ──────────
-- Byte-for-byte the migration 024 net-current body with ONE added guard right
-- after the authentication check. A banned/disabled/soft-deleted user can no
-- longer spend credits (and therefore can no longer reach generate-narrative /
-- generate-chronicle, which all spend through here).
create or replace function public.spend_credits(feature text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cost integer;
  remaining integer;
  current_balance integer;
  user_role text;
  new_spend_id uuid;
  needed integer;
  grant_row record;
  allocation integer;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- Trust-boundary gate (057): a banned/disabled/soft-deleted account may not
  -- spend, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  cost := case feature
    when 'chronicle' then 2
    when 'narrative' then 3
    when 'dailyLife' then 4
    when 'progression' then 5
    when 'narrative_fast' then 2
    when 'dailyLife_fast' then 3
    when 'progression_fast' then 4
    else null
  end;
  if cost is null then raise exception 'unknown feature: %', feature; end if;

  select role into user_role from public.profiles where id = auth.uid() for update;
  if user_role in ('developer', 'admin') or public.current_user_is_privileged() then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (auth.uid(), 'spend', cost, feature, jsonb_build_object('elevated', true))
      returning id into new_spend_id;
    return jsonb_build_object('ok', true, 'balance', -2, 'spend_id', new_spend_id, 'elevated', true);
  end if;

  current_balance := public.get_credit_balance(auth.uid());
  if current_balance < cost then
    return jsonb_build_object('ok', false, 'reason', 'insufficient_funds', 'balance', coalesce(current_balance, 0));
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (auth.uid(), 'spend', cost, feature, '{}'::jsonb)
    returning id into new_spend_id;
  needed := cost;

  for grant_row in
    select g.id, greatest(g.amount - coalesce(a.amount, 0), 0)::integer as available
    from public.credit_ledger g
    left join (
      select grant_id, sum(amount)::integer as amount
      from public.credit_spend_allocations group by grant_id
    ) a on a.grant_id = g.id
    where g.user_id = auth.uid()
      and g.kind = 'grant'
      and (g.expires_at is null or g.expires_at > now())
      and greatest(g.amount - coalesce(a.amount, 0), 0) > 0
    order by case when g.source = 'monthly_allowance' then 0 else 1 end,
      g.expires_at nulls last, g.created_at
    for update of g
  loop
    allocation := least(needed, grant_row.available);
    if allocation > 0 then
      insert into public.credit_spend_allocations (spend_id, grant_id, amount)
        values (new_spend_id, grant_row.id, allocation);
      needed := needed - allocation;
    end if;
    exit when needed <= 0;
  end loop;
  if needed > 0 then raise exception 'credit allocation failed'; end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (auth.uid(), -cost, feature);
  remaining := public.get_credit_balance(auth.uid());
  update public.profiles set credits = remaining, updated_at = now() where id = auth.uid();
  return jsonb_build_object('ok', true, 'balance', remaining, 'spend_id', new_spend_id, 'elevated', false);
end;
$$;

grant execute on function public.spend_credits(text) to authenticated;

-- ── 3. mutate_settlement_batch — block a non-active account before any write ─
-- Byte-for-byte the migration 024 net-current body with ONE added guard right
-- after the authentication check.
create or replace function public.mutate_settlement_batch(
  updates jsonb default '[]'::jsonb,
  delete_ids uuid[] default '{}'::uuid[],
  creates jsonb default '[]'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  target_id uuid;
  affected integer := 0;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- Trust-boundary gate (057): a banned/disabled/soft-deleted account may not
  -- create/update/delete settlements, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;
  if jsonb_typeof(coalesce(updates, '[]'::jsonb)) <> 'array' then
    raise exception 'updates must be an array';
  end if;
  if jsonb_typeof(coalesce(creates, '[]'::jsonb)) <> 'array' then
    raise exception 'creates must be an array';
  end if;

  for item in select value from jsonb_array_elements(coalesce(updates, '[]'::jsonb))
  loop
    target_id := (item->>'id')::uuid;
    if not exists (
      select 1 from public.settlements
      where id = target_id and user_id = auth.uid() and access_state = 'active'
      for update
    ) then
      raise exception 'settlement % is not active or not owned by caller', target_id;
    end if;
  end loop;

  for item in select value from jsonb_array_elements(coalesce(creates, '[]'::jsonb))
  loop
    insert into public.settlements (
      id, user_id, name, tier, data, config, toggles, seed,
      neighbour_links, ai_data, campaign_state, version_history
    ) values (
      (item->>'id')::uuid, auth.uid(), item->>'name', item->>'tier',
      item->'data', item->'config', item->'toggles', item->>'seed',
      item->'neighbour_links', coalesce(item->'ai_data', '{}'::jsonb),
      item->'campaign_state', item->'version_history'
    );
    affected := affected + 1;
  end loop;

  if exists (
    select 1 from unnest(coalesce(delete_ids, '{}'::uuid[])) requested(id)
    left join public.settlements s
      on s.id = requested.id and s.user_id = auth.uid() and s.access_state = 'active'
    where s.id is null
  ) then
    raise exception 'one or more deleted settlements are not active or not owned by caller';
  end if;

  for item in select value from jsonb_array_elements(coalesce(updates, '[]'::jsonb))
  loop
    target_id := (item->>'id')::uuid;
    update public.settlements set
      name = case when item ? 'name' then item->>'name' else name end,
      tier = case when item ? 'tier' then item->>'tier' else tier end,
      data = case when item ? 'data' then item->'data' else data end,
      config = case when item ? 'config' then item->'config' else config end,
      toggles = case when item ? 'toggles' then item->'toggles' else toggles end,
      seed = case when item ? 'seed' then item->>'seed' else seed end,
      neighbour_links = case when item ? 'neighbour_links' then item->'neighbour_links' else neighbour_links end,
      ai_data = case when item ? 'ai_data' then item->'ai_data' else ai_data end,
      campaign_state = case when item ? 'campaign_state' then item->'campaign_state' else campaign_state end,
      version_history = case when item ? 'version_history' then item->'version_history' else version_history end
    where id = target_id and user_id = auth.uid();
    affected := affected + 1;
  end loop;

  delete from public.settlements
    where id = any(coalesce(delete_ids, '{}'::uuid[]))
      and user_id = auth.uid() and access_state = 'active';
  affected := affected + coalesce(array_length(delete_ids, 1), 0);
  return affected;
end;
$$;

revoke all on function public.mutate_settlement_batch(jsonb, uuid[], jsonb) from public;
grant execute on function public.mutate_settlement_batch(jsonb, uuid[], jsonb) to authenticated;

comment on function public.spend_credits(text) is
  'Atomic ledger-allocation credit spend. Net-current body (024) plus the 057 account-status gate: a banned/disabled/soft-deleted account cannot spend (and therefore cannot reach the paid AI endpoints).';
comment on function public.mutate_settlement_batch(jsonb, uuid[], jsonb) is
  'Atomic settlement create/update/delete batch. Net-current body (024) plus the 057 account-status gate: a banned/disabled/soft-deleted account cannot mutate settlements.';
