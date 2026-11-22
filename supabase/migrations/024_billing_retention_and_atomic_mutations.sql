-- 024_billing_retention_and_atomic_mutations.sql
-- Hardens Stripe delivery, extends premium retention to campaigns/maps,
-- wires Chronicle credit spending, and provides atomic linked-save writes.

-- ── Replay-safe Stripe credit delivery ─────────────────────────────────────

create table if not exists public.credit_grant_idempotency (
  source text not null,
  idempotency_key text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  ledger_id uuid references public.credit_ledger(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (source, idempotency_key)
);

alter table public.credit_grant_idempotency enable row level security;

insert into public.credit_grant_idempotency (source, idempotency_key, user_id, ledger_id)
select distinct on (source, idempotency_key)
  source, idempotency_key, user_id, id
from (
  select id, source, user_id, metadata->>'stripe_session_id' as idempotency_key, created_at
  from public.credit_ledger
  where source in ('purchase', 'founder_grant') and metadata ? 'stripe_session_id'
  union all
  select id, source, user_id, metadata->>'stripe_invoice_id' as idempotency_key, created_at
  from public.credit_ledger
  where source = 'monthly_allowance' and metadata ? 'stripe_invoice_id'
) existing
where idempotency_key is not null and idempotency_key <> ''
order by source, idempotency_key, created_at
on conflict do nothing;

create or replace function public.system_grant_credits(
  target_user uuid,
  amount integer,
  source text,
  metadata jsonb default '{}'::jsonb,
  expires_at timestamptz default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
<<grant_fn>>
declare
  new_balance integer;
  caller_role text;
  delivery_key text;
  claimed_key text;
  new_ledger_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'system_grant_credits is service-role only (got: %)', caller_role;
  end if;
  if amount <= 0 or amount > 10000 then
    raise exception 'amount must be between 1 and 10000 (got: %)', amount;
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required';
  end if;

  delivery_key := case
    when source in ('purchase', 'founder_grant') then metadata->>'stripe_session_id'
    when source = 'monthly_allowance' then metadata->>'stripe_invoice_id'
    else null
  end;

  if source in ('purchase', 'founder_grant', 'monthly_allowance')
     and coalesce(delivery_key, '') = '' then
    raise exception 'idempotency metadata is required for source %', source;
  end if;

  if delivery_key is not null then
    insert into public.credit_grant_idempotency (source, idempotency_key, user_id)
      values (source, delivery_key, target_user)
      on conflict do nothing
      returning idempotency_key into claimed_key;

    if claimed_key is null then
      return public.get_credit_balance(target_user);
    end if;
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata, expires_at)
    values (target_user, 'grant', amount, source, coalesce(metadata, '{}'::jsonb), expires_at)
    returning id into new_ledger_id;

  if delivery_key is not null then
    update public.credit_grant_idempotency cgi
      set ledger_id = new_ledger_id
      where cgi.source = grant_fn.source
        and idempotency_key = delivery_key;
  end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, source);

  new_balance := public.get_credit_balance(target_user);
  update public.profiles
    set credits = new_balance, updated_at = now()
    where id = target_user;

  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object('new_balance', new_balance, 'expires_at', expires_at) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

revoke all on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) from public;
grant execute on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) to service_role;

-- Chronicle uses the standard atomic ledger path at a cost of two credits.
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

-- ── Premium campaign/map retention ─────────────────────────────────────────

alter table public.saved_maps
  add column if not exists access_state text not null default 'active',
  add column if not exists inactive_reason text,
  add column if not exists inactive_since timestamptz,
  add column if not exists retention_expires_at timestamptz;

alter table public.saved_maps drop constraint if exists saved_maps_access_state_check;
alter table public.saved_maps add constraint saved_maps_access_state_check
  check (access_state in ('active', 'inactive_plan', 'pending_delete'));

create index if not exists idx_saved_maps_retention_expiry
  on public.saved_maps(retention_expires_at)
  where access_state in ('inactive_plan', 'pending_delete');

-- Users who downgraded before this migration already have retained
-- settlements from migration 023. Bring their campaign/map rows under the
-- same retention window instead of leaving stale active maps behind.
update public.saved_maps sm
  set access_state = 'inactive_plan',
      inactive_reason = 'premium_downgrade',
      inactive_since = coalesce(sm.inactive_since, p.premium_downgraded_at, now()),
      retention_expires_at = coalesce(
        sm.retention_expires_at,
        p.premium_retention_expires_at,
        p.premium_downgraded_at + interval '3 months'
      )
from public.profiles p
where p.id = sm.user_id
  and p.tier = 'free'
  and p.premium_downgraded_at is not null
  and sm.access_state = 'active';

create or replace function public.current_user_has_premium_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (tier = 'premium' or is_founder = true or role in ('developer', 'admin'))
  );
$$;

revoke all on function public.current_user_has_premium_access() from public;
grant execute on function public.current_user_has_premium_access() to authenticated;

-- Retained settlements stay readable so the client can show their expiry and
-- offer the dedicated free-slot reactivation RPC, but ordinary writes are
-- limited to active rows.
drop policy if exists "Users insert own settlements" on public.settlements;
create policy "Users insert active own settlements" on public.settlements
  for insert with check (auth.uid() = user_id and access_state = 'active');
drop policy if exists "Users update own settlements" on public.settlements;
create policy "Users update active own settlements" on public.settlements
  for update using (auth.uid() = user_id and access_state = 'active')
  with check (auth.uid() = user_id and access_state = 'active');
drop policy if exists "Users delete own settlements" on public.settlements;
create policy "Users delete active own settlements" on public.settlements
  for delete using (auth.uid() = user_id and access_state = 'active');

-- Migration 014 counted retained rows toward the free limit. After a
-- downgrade only active rows consume one of the three usable free slots.
create or replace function public.enforce_save_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_tier text;
  user_role text;
  save_count integer;
  save_limit integer;
begin
  select tier, role into user_tier, user_role
    from public.profiles where id = new.user_id;

  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'cannot save a settlement for another user';
  end if;
  if coalesce(new.access_state, 'active') <> 'active'
     and coalesce(current_setting('request.jwt.claim.role', true), auth.role()) <> 'service_role' then
    raise exception 'new settlements must be active';
  end if;
  if user_role in ('developer', 'admin') then return new; end if;

  save_limit := case user_tier
    when 'premium' then null
    when 'cartographer' then null
    when 'founder' then null
    else 3
  end;
  if save_limit is null or coalesce(new.access_state, 'active') <> 'active' then
    return new;
  end if;

  select count(*)::integer into save_count
    from public.settlements
    where user_id = new.user_id and access_state = 'active';
  if save_count >= save_limit then
    raise exception 'save limit reached: % allows % active saves. Upgrade for unlimited saves.',
      coalesce(user_tier, 'free'), save_limit;
  end if;
  return new;
end;
$$;

drop policy if exists "Users insert own maps" on public.saved_maps;
create policy "Premium users insert own maps" on public.saved_maps
  for insert with check (auth.uid() = user_id and public.current_user_has_premium_access());
drop policy if exists "Users update own maps" on public.saved_maps;
create policy "Premium users update active own maps" on public.saved_maps
  for update using (
    auth.uid() = user_id and access_state = 'active' and public.current_user_has_premium_access()
  ) with check (
    auth.uid() = user_id and access_state = 'active' and public.current_user_has_premium_access()
  );
drop policy if exists "Users delete own maps" on public.saved_maps;
create policy "Premium users delete active own maps" on public.saved_maps
  for delete using (
    auth.uid() = user_id and access_state = 'active' and public.current_user_has_premium_access()
  );

create or replace function public.handle_premium_downgrade(target_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expires_at timestamptz := now() + interval '3 months';
  settlement_count integer := 0;
  campaign_count integer := 0;
  founder boolean := false;
begin
  if target_user is null then raise exception 'target_user is required'; end if;
  select coalesce(is_founder, false) into founder from public.profiles where id = target_user;
  if founder then
    return jsonb_build_object('ok', true, 'inactive_count', 0, 'inactive_campaign_count', 0, 'founder', true);
  end if;

  update public.profiles
    set tier = 'free', premium_downgraded_at = now(), premium_retention_expires_at = expires_at
    where id = target_user and coalesce(is_founder, false) = false;

  update public.settlements
    set access_state = 'inactive_plan', inactive_reason = 'premium_downgrade',
        inactive_since = coalesce(inactive_since, now()),
        retention_expires_at = coalesce(retention_expires_at, expires_at),
        reactivated_free_at = null
    where user_id = target_user and access_state = 'active';
  get diagnostics settlement_count = row_count;

  update public.saved_maps
    set access_state = 'inactive_plan', inactive_reason = 'premium_downgrade',
        inactive_since = coalesce(inactive_since, now()),
        retention_expires_at = coalesce(retention_expires_at, expires_at)
    where user_id = target_user and access_state = 'active';
  get diagnostics campaign_count = row_count;

  return jsonb_build_object(
    'ok', true, 'inactive_count', settlement_count,
    'inactive_campaign_count', campaign_count, 'retention_expires_at', expires_at
  );
end;
$$;

revoke all on function public.handle_premium_downgrade(uuid) from public;
grant execute on function public.handle_premium_downgrade(uuid) to service_role;

create or replace function public.restore_premium_settlements(target_user uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  settlement_count integer := 0;
  campaign_count integer := 0;
begin
  if target_user is null then raise exception 'target_user is required'; end if;
  update public.profiles
    set premium_downgraded_at = null, premium_retention_expires_at = null
    where id = target_user;
  update public.settlements
    set access_state = 'active', inactive_reason = null, inactive_since = null, retention_expires_at = null
    where user_id = target_user and access_state in ('inactive_plan', 'pending_delete');
  get diagnostics settlement_count = row_count;
  update public.saved_maps
    set access_state = 'active', inactive_reason = null, inactive_since = null, retention_expires_at = null
    where user_id = target_user and access_state in ('inactive_plan', 'pending_delete');
  get diagnostics campaign_count = row_count;
  return settlement_count + campaign_count;
end;
$$;

revoke all on function public.restore_premium_settlements(uuid) from public;
grant execute on function public.restore_premium_settlements(uuid) to service_role;

create or replace function public.purge_expired_plan_inactive_assets()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  settlement_count integer := 0;
  campaign_count integer := 0;
begin
  delete from public.settlements
    where access_state in ('inactive_plan', 'pending_delete')
      and retention_expires_at is not null and retention_expires_at <= now();
  get diagnostics settlement_count = row_count;
  delete from public.saved_maps
    where access_state in ('inactive_plan', 'pending_delete')
      and retention_expires_at is not null and retention_expires_at <= now();
  get diagnostics campaign_count = row_count;
  return jsonb_build_object('settlements', settlement_count, 'campaigns', campaign_count);
end;
$$;

revoke all on function public.purge_expired_plan_inactive_assets() from public;
grant execute on function public.purge_expired_plan_inactive_assets() to service_role;

do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule purge_expired_plan_inactive_assets manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'purge-expired-plan-assets';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'purge-expired-plan-assets',
    '17 3 * * *',
    $job$select public.purge_expired_plan_inactive_assets();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule purge_expired_plan_inactive_assets manually';
end;
$$;

-- ── Atomic reciprocal settlement mutations ─────────────────────────────────

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

comment on table public.credit_grant_idempotency is
  'Claims Stripe delivery keys before ledger writes so webhook retries cannot grant credits twice.';
comment on function public.purge_expired_plan_inactive_assets() is
  'Daily maintenance function that purges expired retained settlements and campaigns/maps.';
comment on function public.mutate_settlement_batch(jsonb, uuid[], jsonb) is
  'Atomically creates, updates, and deletes owned settlements, including reciprocal relationship changes.';
