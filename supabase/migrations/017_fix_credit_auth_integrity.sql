-- ---------------------------------------------------------------------------
-- 017_fix_credit_auth_integrity.sql
--
-- Repairs the trust-boundary issues found in the full-code audit:
--   * migration 015's welcome-credit trigger referenced non-existent columns
--     and could break auth.users inserts when fired.
--   * migration 012 writes webhook audit rows with actor_id = NULL, while
--     migration 009 accidentally made actor_id NOT NULL.
--   * admin Edge functions need transaction-safe service-role paths for
--     profile/credit edits after the caller has been verified as elevated.
--   * custom_content's premium gate lived only in client code.
-- ---------------------------------------------------------------------------

-- System/webhook actions have no human actor. The admin_actions table comment
-- and system_grant_credits() already expect actor_id to be nullable.
alter table public.admin_actions
  alter column actor_id drop not null;

comment on column public.admin_actions.actor_id is
  'Privileged user who initiated the action. NULL for trusted system/webhook actions.';

-- One welcome grant per account. This is defensive against accidental double
-- trigger installation and makes the idempotency rule enforceable by the DB.
create unique index if not exists idx_credit_ledger_one_welcome_grant
  on public.credit_ledger(user_id)
  where kind = 'grant' and source = 'welcome';

-- Replace the signup hook with one function that creates the profile and
-- grants the welcome credit using the actual ledger schema.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, tier, credits)
  values (new.id, new.email, 'free', 0)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  if not exists (
    select 1
    from public.credit_ledger
    where user_id = new.id
      and kind = 'grant'
      and source = 'welcome'
  ) then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      new.id,
      'grant',
      1,
      'welcome',
      jsonb_build_object('trigger', 'handle_new_user')
    );

    insert into public.credit_transactions (user_id, amount, reason)
    values (new.id, 1, 'welcome');

    update public.profiles
      set credits = coalesce(credits, 0) + 1,
          updated_at = now()
      where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists auth_users_welcome_credit on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the migration-015 function name harmless if a deployment or manual
-- script still calls it. The trigger above is the canonical path.
create or replace function public.grant_welcome_credit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.credit_ledger
    where user_id = new.id
      and kind = 'grant'
      and source = 'welcome'
  ) then
    return new;
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
  values (
    new.id,
    'grant',
    1,
    'welcome',
    jsonb_build_object('trigger', 'grant_welcome_credit')
  );

  insert into public.credit_transactions (user_id, amount, reason)
  values (new.id, 1, 'welcome');

  update public.profiles
    set credits = coalesce(credits, 0) + 1,
        updated_at = now()
    where id = new.id;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Creates a profile and grants the one-time welcome credit using credit_ledger.source=''welcome''.';

comment on function public.grant_welcome_credit() is
  'Compatibility wrapper for the old migration-015 trigger function. Uses the current credit_ledger schema.';

-- Server-side premium gate for cloud custom content.
create or replace function public.profile_has_premium_access(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_user
      and (p.tier = 'premium' or p.role in ('developer', 'admin'))
  );
$$;

grant execute on function public.profile_has_premium_access(uuid) to authenticated;

drop policy if exists "users insert own custom content" on public.custom_content;
drop policy if exists "users update own custom content" on public.custom_content;
drop policy if exists "users delete own custom content" on public.custom_content;

create policy "premium users insert own custom content"
  on public.custom_content
  for insert
  with check (
    auth.uid() = user_id
    and public.profile_has_premium_access(auth.uid())
  );

create policy "premium users update own custom content"
  on public.custom_content
  for update
  using (
    auth.uid() = user_id
    and public.profile_has_premium_access(auth.uid())
  )
  with check (
    auth.uid() = user_id
    and public.profile_has_premium_access(auth.uid())
  );

create policy "premium users delete own custom content"
  on public.custom_content
  for delete
  using (
    auth.uid() = user_id
    and public.profile_has_premium_access(auth.uid())
  );

comment on function public.profile_has_premium_access(uuid) is
  'True when a profile is premium or elevated. Used by custom_content RLS write policies.';

-- The welcome credit is fungible once granted. For UI purposes, we treat the
-- first AI spend after the welcome grant as consuming that first taste.
create or replace function public.welcome_credit_available(target_user uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  welcome_created_at timestamptz;
  current_balance integer;
begin
  if auth.uid() is null then
    return false;
  end if;
  if target_user is null then
    return false;
  end if;
  if auth.uid() <> target_user and not public.current_user_is_privileged() then
    raise exception 'not authorized';
  end if;

  select cl.created_at into welcome_created_at
  from public.credit_ledger cl
  where cl.user_id = target_user
    and cl.kind = 'grant'
    and cl.source = 'welcome'
  order by cl.created_at asc
  limit 1;

  if welcome_created_at is null then
    return false;
  end if;

  if exists (
    select 1
    from public.credit_ledger cl
    where cl.user_id = target_user
      and cl.kind = 'spend'
      and cl.source in ('narrative', 'dailyLife', 'daily_life', 'progression')
      and cl.created_at >= welcome_created_at
  ) then
    return false;
  end if;

  select public.get_credit_balance(target_user) into current_balance;
  return coalesce(current_balance, 0) > 0;
end;
$$;

grant execute on function public.welcome_credit_available(uuid) to authenticated;

comment on function public.welcome_credit_available(uuid) is
  'User-callable for self: true when the welcome grant exists, no AI spend has followed it, and balance remains positive.';

-- Helper used by service-role RPCs. It verifies both that the caller is using
-- the service role and that the human actor supplied by the Edge function is
-- actually elevated in profiles.
create or replace function public._assert_service_admin_actor(actor_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  actor_role text;
begin
  caller_role := current_setting('request.jwt.claim.role', true);
  if caller_role is null then
    caller_role := auth.role();
  end if;
  if caller_role <> 'service_role' then
    raise exception 'service role required (got: %)', caller_role;
  end if;

  select role into actor_role
  from public.profiles
  where id = actor_user;

  if actor_role not in ('developer', 'admin') then
    raise exception 'actor is not privileged';
  end if;
end;
$$;

revoke all on function public._assert_service_admin_actor(uuid) from public;

create or replace function public.service_update_profile_metadata(
  actor_user uuid,
  target_user uuid,
  profile_patch jsonb,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  before_row jsonb;
  after_row jsonb;
  patch_keys text[];
  bad_keys text[];
  new_role text;
  new_tier text;
begin
  perform public._assert_service_admin_actor(actor_user);

  if target_user is null then
    raise exception 'target_user is required';
  end if;
  if profile_patch is null or jsonb_typeof(profile_patch) <> 'object' then
    raise exception 'profile_patch must be a JSON object';
  end if;

  select array_agg(key order by key) into patch_keys
  from jsonb_object_keys(profile_patch) as keys(key);

  select array_agg(key order by key) into bad_keys
  from jsonb_object_keys(profile_patch) as keys(key)
  where key not in ('role', 'tier', 'display_name', 'is_founder');

  if bad_keys is not null then
    raise exception 'unsupported profile metadata keys: %', array_to_string(bad_keys, ', ');
  end if;

  if profile_patch ? 'role' then
    new_role := profile_patch->>'role';
    if new_role not in ('user', 'developer', 'admin') then
      raise exception 'invalid role: %', new_role;
    end if;
  end if;

  if profile_patch ? 'tier' then
    new_tier := profile_patch->>'tier';
    if new_tier not in ('free', 'premium') then
      raise exception 'invalid tier: %', new_tier;
    end if;
  end if;

  if profile_patch ? 'is_founder'
     and jsonb_typeof(profile_patch->'is_founder') <> 'boolean' then
    raise exception 'is_founder must be boolean';
  end if;

  select to_jsonb(p.*) into before_row
  from public.profiles p
  where p.id = target_user;

  if before_row is null then
    raise exception 'target profile not found';
  end if;

  update public.profiles
    set role = case when profile_patch ? 'role' then new_role else role end,
        tier = case when profile_patch ? 'tier' then new_tier else tier end,
        display_name = case
          when profile_patch ? 'display_name' then nullif(btrim(profile_patch->>'display_name'), '')
          else display_name
        end,
        is_founder = case
          when profile_patch ? 'is_founder' then (profile_patch->>'is_founder')::boolean
          else is_founder
        end,
        updated_at = now()
    where id = target_user;

  select to_jsonb(p.*) into after_row
  from public.profiles p
  where p.id = target_user;

  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values
    (
      actor_user,
      target_user,
      'update_user_metadata',
      before_row,
      jsonb_build_object('patch', profile_patch, 'profile', after_row, 'keys', coalesce(patch_keys, array[]::text[])),
      reason
    );

  return jsonb_build_object('before', before_row, 'after', after_row);
end;
$$;

grant execute on function public.service_update_profile_metadata(uuid, uuid, jsonb, text) to service_role;

create or replace function public.service_set_credits(
  actor_user uuid,
  target_user uuid,
  new_credits integer,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_credits integer;
  delta integer;
  after_row jsonb;
begin
  perform public._assert_service_admin_actor(actor_user);

  if target_user is null then
    raise exception 'target_user is required';
  end if;
  if new_credits is null or new_credits < 0 then
    raise exception 'new_credits must be a non-negative integer';
  end if;
  if new_credits > 100000 then
    raise exception 'new_credits exceeds per-call limit (100000)';
  end if;

  select credits into prev_credits
  from public.profiles
  where id = target_user;

  if prev_credits is null then
    raise exception 'target profile not found';
  end if;

  delta := new_credits - prev_credits;

  if delta <> 0 then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      target_user,
      case when delta > 0 then 'grant' else 'spend' end,
      abs(delta),
      'admin_set',
      jsonb_build_object(
        'admin_actor', actor_user,
        'previous_balance', prev_credits,
        'new_balance', new_credits,
        'reason', reason
      )
    );

    insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, delta, 'admin_set');
  end if;

  update public.profiles p
    set credits = new_credits,
        updated_at = now()
    where p.id = target_user
    returning to_jsonb(p.*) into after_row;

  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values
    (
      actor_user,
      target_user,
      'admin_set_credits',
      jsonb_build_object('credits', prev_credits),
      jsonb_build_object('credits', new_credits, 'delta', delta, 'profile', after_row),
      reason
    );

  return jsonb_build_object('prev', prev_credits, 'next', new_credits, 'delta', delta);
end;
$$;

grant execute on function public.service_set_credits(uuid, uuid, integer, text) to service_role;

comment on function public.service_update_profile_metadata(uuid, uuid, jsonb, text) is
  'Service-role-only admin profile metadata update. Verifies actor_user is elevated, writes profiles, and audits admin_actions.';

comment on function public.service_set_credits(uuid, uuid, integer, text) is
  'Service-role-only admin credit set. Verifies actor_user is elevated, writes credit_ledger/credit_transactions/profiles atomically, and audits admin_actions.';
