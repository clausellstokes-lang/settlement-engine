-- ────────────────────────────────────────────────────────────────────────────
-- 179_owner_confirmed_privacy_deletes.sql — privacy deletion must work for
-- retained plan-inactive assets, and batch mutation must bind to the owner the
-- client authenticated before starting the request.
--
-- WHY
--   The billing-retention policies intentionally keep downgraded assets readable,
--   but the previous DELETE policies required access_state='active' (and, for
--   saved_maps, current premium access). PostgREST therefore returned a successful
--   zero-row DELETE when a downgraded owner tried to erase retained data. Deletion
--   is a one-way privacy operation; an active account must be allowed to remove
--   every row it owns regardless of plan state.
--
--   mutate_settlement_batch also derived its owner solely from auth.uid() inside
--   the RPC. If the browser completed its owner preflight as A but the request was
--   ultimately sent with B's rotated session, the RPC could validly mutate B. The
--   expected owner is now mandatory and checked before any write. The active
--   profile row is locked for the transaction so soft deletion cannot commit
--   between the account check and the mutations.
--
-- Depends on: 057_enforce_account_status_writes.sql,
--             059_enforce_account_status_rls.sql.
-- @rollback:
--   Reapply the two DELETE policies from 059 and recreate the three-argument
--   mutate_settlement_batch body from 057.
-- ────────────────────────────────────────────────────────────────────────────

-- An active owner may erase any retained settlement. Moderated, disabled, and
-- soft-deleted accounts remain blocked by account_is_active plus the redundant
-- table trigger from migration 059.
drop policy if exists "Users delete active own settlements"
  on public.settlements;
create policy "Users delete active own settlements"
  on public.settlements
  for delete using (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
  );

-- Campaign/map deletion is likewise independent of premium status and
-- access_state. Insert/update remain plan-gated; this only permits erasure.
drop policy if exists "Premium users delete active own maps"
  on public.saved_maps;
create policy "Premium users delete active own maps"
  on public.saved_maps
  for delete using (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
  );

-- Migration 059's redundant table trigger checked account_is_active without
-- taking the profile lock. A direct save/upsert and account deletion touch
-- different rows, so both could observe "active" and commit in the wrong order.
-- Lock the acting profile through the asset transaction.
create or replace function public.enforce_account_active_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  acting uuid := auth.uid();
begin
  if coalesce(
       nullif(current_setting('request.jwt.claim.role', true), ''),
       auth.role()
     ) = 'service_role' then
    return case when tg_op = 'DELETE' then old else new end;
  end if;

  -- Null-auth system triggers remain exempt exactly as in migration 059.
  if acting is not null then
    perform 1
    from public.profiles p
    where p.id = acting
      and p.banned_at is null
      and p.disabled_at is null
      and p.deleted_at is null
    for update;
    if not found then
      raise exception 'account is not active'
        using errcode = 'check_violation';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function public.enforce_account_active_write()
  from public, anon, authenticated, service_role;

comment on function public.enforce_account_active_write() is
  'BEFORE asset-write fence: end-user writes lock an active profile row through commit, serializing direct settlement/map writes against account deletion. Service-role and null-auth system maintenance remain exempt.';

-- The net-current spend_credits function inserts the authoritative spend row
-- before any compatibility writes. Fence that insertion with the same profile
-- lock. This closes the deletion race without duplicating the large, frequently
-- repriced spend_credits body from migration 174.
create or replace function public.enforce_active_credit_spend_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  acting uuid := auth.uid();
begin
  if new.kind <> 'spend'
     or acting is null
     or coalesce(
          nullif(current_setting('request.jwt.claim.role', true), ''),
          auth.role()
        ) = 'service_role' then
    return new;
  end if;

  if new.user_id <> acting then
    raise exception 'credit spend owner does not match authenticated user'
      using errcode = 'check_violation';
  end if;
  perform 1
  from public.profiles p
  where p.id = acting
    and p.banned_at is null
    and p.disabled_at is null
    and p.deleted_at is null
  for update;
  if not found then
    raise exception 'account is not active'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_active_credit_spend_insert()
  from public, anon, authenticated, service_role;

drop trigger if exists trg_enforce_active_credit_spend
  on public.credit_ledger;
create trigger trg_enforce_active_credit_spend
before insert on public.credit_ledger
for each row
when (new.kind = 'spend')
execute function public.enforce_active_credit_spend_insert();

comment on function public.enforce_active_credit_spend_insert() is
  'Authoritative spend-row fence: locks the active owner profile before an authenticated credit debit can land, serializing spend_credits with account deletion.';

-- Remove the permissive legacy signature so callers cannot omit the expected
-- owner. Named PostgREST arguments make the new ordering transparent to clients.
drop function if exists public.mutate_settlement_batch(jsonb, uuid[], jsonb);

create or replace function public.mutate_settlement_batch(
  p_expected_user uuid,
  updates jsonb default '[]'::jsonb,
  delete_ids uuid[] default '{}'::uuid[],
  creates jsonb default '[]'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item jsonb;
  target_id uuid;
  affected integer := 0;
  deleted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if p_expected_user is null or auth.uid() <> p_expected_user then
    raise exception 'auth session changed before settlement batch mutation';
  end if;

  -- Serialize the full mutation against account deletion/moderation. Deletion
  -- first => this finds no active row and fails closed. Mutation first => the
  -- profile lock is held until all writes commit, then deletion may proceed.
  perform 1
  from public.profiles p
  where p.id = auth.uid()
    and p.banned_at is null
    and p.disabled_at is null
    and p.deleted_at is null
  for update;
  if not found then
    raise exception 'account is not active';
  end if;

  if jsonb_typeof(coalesce(updates, '[]'::jsonb)) <> 'array' then
    raise exception 'updates must be an array';
  end if;
  if jsonb_typeof(coalesce(creates, '[]'::jsonb)) <> 'array' then
    raise exception 'creates must be an array';
  end if;

  for item in
    select value
    from jsonb_array_elements(coalesce(updates, '[]'::jsonb))
  loop
    target_id := (item->>'id')::uuid;
    if not exists (
      select 1
      from public.settlements
      where id = target_id
        and user_id = auth.uid()
        and access_state = 'active'
      for update
    ) then
      raise exception
        'settlement % is not active or not owned by caller',
        target_id;
    end if;
  end loop;

  -- Lock every requested deletion target. Unlike updates, privacy deletion is
  -- valid for active, inactive_plan, and pending_delete rows.
  if exists (
    select 1
    from unnest(coalesce(delete_ids, '{}'::uuid[])) requested(id)
    left join public.settlements s
      on s.id = requested.id
     and s.user_id = auth.uid()
    where s.id is null
  ) then
    raise exception 'one or more deleted settlements are not owned by caller';
  end if;
  perform 1
  from public.settlements s
  where s.id = any(coalesce(delete_ids, '{}'::uuid[]))
    and s.user_id = auth.uid()
  for update;

  for item in
    select value
    from jsonb_array_elements(coalesce(creates, '[]'::jsonb))
  loop
    insert into public.settlements (
      id, user_id, name, tier, data, config, toggles, seed,
      neighbour_links, ai_data, campaign_state, version_history
    ) values (
      (item->>'id')::uuid,
      auth.uid(),
      item->>'name',
      item->>'tier',
      item->'data',
      item->'config',
      item->'toggles',
      item->>'seed',
      item->'neighbour_links',
      coalesce(item->'ai_data', '{}'::jsonb),
      item->'campaign_state',
      item->'version_history'
    );
    affected := affected + 1;
  end loop;

  for item in
    select value
    from jsonb_array_elements(coalesce(updates, '[]'::jsonb))
  loop
    target_id := (item->>'id')::uuid;
    update public.settlements
    set
      name = case when item ? 'name' then item->>'name' else name end,
      tier = case when item ? 'tier' then item->>'tier' else tier end,
      data = case when item ? 'data' then item->'data' else data end,
      config = case when item ? 'config' then item->'config' else config end,
      toggles = case when item ? 'toggles' then item->'toggles' else toggles end,
      seed = case when item ? 'seed' then item->>'seed' else seed end,
      neighbour_links = case
        when item ? 'neighbour_links' then item->'neighbour_links'
        else neighbour_links
      end,
      ai_data = case
        when item ? 'ai_data' then item->'ai_data'
        else ai_data
      end,
      campaign_state = case
        when item ? 'campaign_state' then item->'campaign_state'
        else campaign_state
      end,
      version_history = case
        when item ? 'version_history' then item->'version_history'
        else version_history
      end
    where id = target_id
      and user_id = auth.uid();
    affected := affected + 1;
  end loop;

  delete from public.settlements
  where id = any(coalesce(delete_ids, '{}'::uuid[]))
    and user_id = auth.uid();
  get diagnostics deleted_count = row_count;
  if deleted_count <> coalesce(cardinality(delete_ids), 0) then
    -- Duplicate ids or an unexpected short delete cannot be reported as exact
    -- success. Raising rolls the entire SECURITY DEFINER transaction back.
    raise exception 'settlement batch delete did not confirm every requested row';
  end if;
  affected := affected + deleted_count;
  return affected;
end;
$$;

revoke all on function public.mutate_settlement_batch(
  uuid, jsonb, uuid[], jsonb
) from public, anon, authenticated, service_role;
grant execute on function public.mutate_settlement_batch(
  uuid, jsonb, uuid[], jsonb
) to authenticated;

comment on function public.mutate_settlement_batch(
  uuid, jsonb, uuid[], jsonb
) is
  'Atomic owner-confirmed settlement batch mutation. Requires auth.uid() to equal p_expected_user, locks the active profile against deletion, keeps updates active-only, and permits exact-count privacy deletion of any owned plan-retained row.';
