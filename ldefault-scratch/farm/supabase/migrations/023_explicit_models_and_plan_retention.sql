-- 023_explicit_models_and_plan_retention.sql
-- Current AI model preferences are explicit provider/model keys, and
-- premium downgrade retention is tracked server-side for saved settlements.

alter table public.profiles
  alter column model_preference set default 'anthropic_claude_opus_4_8',
  add column if not exists premium_downgraded_at timestamptz,
  add column if not exists premium_retention_expires_at timestamptz;

-- Drop the stale (claude_best/...) check BEFORE rewriting values: the data
-- migration must not be blocked by the constraint it is replacing, and any
-- rows that already carry the new model keys stop tripping the old check.
alter table public.profiles
  drop constraint if exists profiles_model_preference_check;

update public.profiles
  set model_preference = case model_preference
    when 'claude_best' then 'anthropic_claude_opus_4_8'
    when 'claude_fast' then 'anthropic_claude_haiku_4_5'
    when 'chatgpt_best' then 'openai_gpt_5_2'
    when 'chatgpt_fast' then 'openai_gpt_5_mini'
    else model_preference
  end;

alter table public.profiles
  add constraint profiles_model_preference_check
  check (model_preference in (
    'anthropic_claude_opus_4_8',
    'anthropic_claude_sonnet_4_6',
    'anthropic_claude_haiku_4_5',
    'openai_gpt_5_2',
    'openai_gpt_5_mini',
    'openai_gpt_5_nano',
    'openai_gpt_4_1',
    'openai_gpt_4_1_mini'
  ));

alter table public.settlements
  add column if not exists access_state text not null default 'active',
  add column if not exists inactive_reason text,
  add column if not exists inactive_since timestamptz,
  add column if not exists retention_expires_at timestamptz,
  add column if not exists reactivated_free_at timestamptz;

alter table public.settlements
  drop constraint if exists settlements_access_state_check;

alter table public.settlements
  add constraint settlements_access_state_check
  check (access_state in ('active', 'inactive_plan', 'pending_delete'));

create index if not exists idx_settlements_retention_expiry
  on public.settlements(retention_expires_at)
  where access_state in ('inactive_plan', 'pending_delete');

create or replace function public.handle_premium_downgrade(target_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expires_at timestamptz := now() + interval '3 months';
  affected integer := 0;
  founder boolean := false;
begin
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  select coalesce(is_founder, false) into founder
    from public.profiles
    where id = target_user;

  if founder then
    return jsonb_build_object('ok', true, 'inactive_count', 0, 'founder', true);
  end if;

  update public.profiles
    set tier = 'free',
        premium_downgraded_at = now(),
        premium_retention_expires_at = expires_at
    where id = target_user
      and coalesce(is_founder, false) = false;

  update public.settlements
    set access_state = 'inactive_plan',
        inactive_reason = 'premium_downgrade',
        inactive_since = coalesce(inactive_since, now()),
        retention_expires_at = coalesce(retention_expires_at, expires_at),
        reactivated_free_at = null
    where user_id = target_user
      and access_state = 'active';

  get diagnostics affected = row_count;

  return jsonb_build_object(
    'ok', true,
    'inactive_count', affected,
    'retention_expires_at', expires_at
  );
end;
$$;

revoke all on function public.handle_premium_downgrade(uuid) from public;
grant execute on function public.handle_premium_downgrade(uuid) to service_role;

create or replace function public.reactivate_free_settlement(target_settlement_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid;
  owner_tier text;
  active_count integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select user_id into owner_id
    from public.settlements
    where id = target_settlement_id
    for update;

  if owner_id is null or owner_id <> auth.uid() then
    raise exception 'settlement not found';
  end if;

  select tier into owner_tier from public.profiles where id = auth.uid();
  if owner_tier <> 'free' then
    raise exception 'reactivation is only needed for free accounts';
  end if;

  select count(*)::integer into active_count
    from public.settlements
    where user_id = auth.uid()
      and access_state = 'active';

  if active_count >= 3 then
    return jsonb_build_object('ok', false, 'reason', 'free_limit_reached', 'active_count', active_count);
  end if;

  update public.settlements
    set access_state = 'active',
        inactive_reason = null,
        inactive_since = null,
        retention_expires_at = null,
        reactivated_free_at = now()
    where id = target_settlement_id
      and user_id = auth.uid();

  return jsonb_build_object('ok', true, 'active_count', active_count + 1);
end;
$$;

revoke all on function public.reactivate_free_settlement(uuid) from public;
grant execute on function public.reactivate_free_settlement(uuid) to authenticated;

create or replace function public.restore_premium_settlements(target_user uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  restored integer := 0;
begin
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  update public.profiles
    set premium_downgraded_at = null,
        premium_retention_expires_at = null
    where id = target_user;

  update public.settlements
    set access_state = 'active',
        inactive_reason = null,
        inactive_since = null,
        retention_expires_at = null
    where user_id = target_user
      and access_state in ('inactive_plan', 'pending_delete');

  get diagnostics restored = row_count;
  return restored;
end;
$$;

revoke all on function public.restore_premium_settlements(uuid) from public;
grant execute on function public.restore_premium_settlements(uuid) to service_role;

create or replace function public.purge_expired_plan_inactive_settlements()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  purged integer := 0;
begin
  delete from public.settlements
    where access_state in ('inactive_plan', 'pending_delete')
      and retention_expires_at is not null
      and retention_expires_at <= now();

  get diagnostics purged = row_count;
  return purged;
end;
$$;

revoke all on function public.purge_expired_plan_inactive_settlements() from public;
grant execute on function public.purge_expired_plan_inactive_settlements() to service_role;

comment on column public.profiles.premium_retention_expires_at is
  'When a premium subscription lapses, saved premium-era rows remain restorable until this timestamp.';
comment on column public.settlements.access_state is
  'active rows are usable; inactive_plan rows remain listed/restorable during downgrade retention; pending_delete rows are scheduled for purge.';
comment on function public.handle_premium_downgrade(uuid) is
  'Service-role downgrade hook. Marks premium-era settlements inactive for a three-month retention window.';
comment on function public.reactivate_free_settlement(uuid) is
  'User RPC for choosing one inactive settlement to count as one of the three free active settlements.';
comment on function public.restore_premium_settlements(uuid) is
  'Service-role upgrade hook. Restores retained inactive settlements when a user regains premium access.';
comment on function public.purge_expired_plan_inactive_settlements() is
  'Service-role maintenance RPC that deletes inactive downgrade-retention settlements after their expiry.';
