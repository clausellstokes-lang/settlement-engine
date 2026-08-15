-- ────────────────────────────────────────────────────────────────────────────
-- 178_inactive_account_billing_fence.sql — close deletion/billing races at the
-- database boundary.
--
-- WHY
--   A Stripe event can race account deletion after application code has checked
--   account state. The database must therefore serialize account deletion with
--   every money, entitlement, and billing-linkage mutation.
--
-- SCOPE
--   This migration makes the database the final arbiter in three places:
--     1. auto-reload claims and every system credit grant fail closed for an
--        inactive/missing target account before any money/idempotency mutation;
--     2. row triggers prevent inactive profiles and Surveyor entitlements from
--        acquiring fresh billing linkage or entitlement upgrades while still
--        permitting downgrade, revocation, and linkage cleanup;
--     3. deletion cleanup jobs retain late subscription/customer IDs durably.
--        Recording late billing invalidates any live lease and reopens even a
--        done job. Claims return the IDs + revision; completion proves the exact
--        claimed revision/arrays and clears them atomically.
--
-- ORDERING
--   Existing money/provisioning entry points take the target profile row lock
--   before their first side effect. This is the same row deletion updates, so one
--   transaction wins and the other observes the committed active/inactive state.
--   Late billing increments a monotonic revision and invalidates any current
--   cleanup lease. Completion succeeds only for the exact lease, live linkage,
--   late-ID arrays, and revision the worker inspected.
--
-- SECURITY
--   Money and cleanup RPCs remain service-role-only through grants and in-body
--   role checks. BEFORE-row triggers are the universal backstop for direct SQL
--   and future callers: inactive accounts may clear/revoke billing state, never
--   acquire or upgrade it. Deleted-account Stripe identity resolution fails
--   closed when more than one cleanup job matches.
--
-- DEPENDENCIES
--   057 account_is_active; 158 auto reload; 159 Surveyor provisioning;
--   163 net-current system_grant_credits; 175 deletion cleanup queue.
--
-- DEPLOYMENT
--   WRITTEN-NOT-DEPLOYED. supabase/applied-head.json remains the production
--   truth until this migration and its billing/deletion workers deploy together.
--
-- @rollback:
--   Roll back the billing/deletion workers first. Re-apply the superseded
--   function bodies from 158 (claim_auto_reload_attempt), 163
--   (system_grant_credits), 024 (restore_premium_settlements), 159
--   (grant_surveyor_entitlement), and 175 (cleanup claim/completion).
--   Drop the new trigger/functions and late-billing columns only after every
--   queued deletion job is complete and no worker depends on their signatures.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Fail closed before creating any auto-reload attempt ───────────────────
-- COPIED BODY: migration 158's net-current claim is preserved except for ONE
-- inactive-account fence immediately after service-role authentication: lock the
-- target profile and reject missing/inactive before reading settings or inserting
-- an attempt.
create or replace function public.claim_auto_reload_attempt(
  p_user uuid,
  p_unit_amount_cents numeric,
  p_credits_per_unit int
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_settings public.credit_auto_reload_settings%rowtype;
  v_balance int;
  v_delta int;
  v_rate numeric;
  v_amount int;
  v_bucket text;
  v_spent int;
  v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_auto_reload_attempt is service-role only (got: %)', caller_role;
  end if;

  -- Serialize against the deletion processor's profile-flag UPDATE. If deletion
  -- commits first the predicate below fails; if this lock wins, the claim
  -- legitimately commits before deletion and the processor waits.
  perform 1
    from public.profiles
   where id = p_user
   for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'account_inactive');
  end if;

  -- Missing profile is inactive by definition (057). This check precedes settings,
  -- balance, cap, and INSERT work, so no auto-reload attempt can be claimed after
  -- deletion/disable even if application state was checked just before the race.
  if not public.account_is_active(p_user) then
    return jsonb_build_object('ok', false, 'reason', 'account_inactive');
  end if;

  select * into v_settings
    from public.credit_auto_reload_settings
   where user_id = p_user
   for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_settings');
  end if;

  v_balance := public.get_credit_balance(p_user);

  if not v_settings.enabled then
    return jsonb_build_object(
      'ok', false,
      'reason', 'disabled',
      'below_threshold', (v_balance < v_settings.threshold_credits)
    );
  end if;

  if v_balance >= v_settings.threshold_credits then
    return jsonb_build_object('ok', false, 'reason', 'above_threshold');
  end if;

  v_delta := v_settings.target_credits - v_balance;
  if v_delta <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'no_delta');
  end if;

  if p_credits_per_unit is null or p_credits_per_unit <= 0
     or p_unit_amount_cents is null or p_unit_amount_cents <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'bad_rate');
  end if;
  v_rate := p_unit_amount_cents::numeric / p_credits_per_unit::numeric;
  v_amount := round(v_delta * v_rate)::int;
  if v_amount <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'no_amount');
  end if;

  v_bucket := to_char((now() at time zone 'utc'), 'YYYY-MM');

  if exists (
    select 1
      from public.credit_auto_reload_attempts
     where user_id = p_user
       and resolved_at is not null
       and resolved_at > now() - interval '10 minutes'
  ) then
    return jsonb_build_object('ok', false, 'reason', 'cooldown');
  end if;

  select coalesce(sum(amount_cents), 0)
    into v_spent
    from public.credit_auto_reload_attempts
   where user_id = p_user
     and month_bucket = v_bucket
     and state in ('succeeded', 'pending', 'requires_action');
  if v_spent + v_amount > v_settings.monthly_cap_cents then
    return jsonb_build_object(
      'ok', false,
      'reason', 'cap',
      'below_threshold', true
    );
  end if;

  begin
    insert into public.credit_auto_reload_attempts (
      user_id, state, credits_delta, amount_cents, month_bucket
    ) values (
      p_user, 'pending', v_delta, v_amount, v_bucket
    )
    returning id into v_id;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'open_attempt');
  end;

  return jsonb_build_object(
    'ok', true,
    'attempt_id', v_id,
    'credits_delta', v_delta,
    'amount_cents', v_amount
  );
end;
$$;

revoke all on function public.claim_auto_reload_attempt(uuid, numeric, int)
  from public, anon, authenticated;
grant execute on function public.claim_auto_reload_attempt(uuid, numeric, int)
  to service_role;

-- ── 2. Existing money/restoration entry points: one inactive gate ────────────
-- COPIED BODY: migration 163's net-current system_grant_credits is preserved
-- except for ONE inactive-account fence immediately after service-role
-- authentication: lock the target profile and reject before validation,
-- delivery-key claim, ledger insert, counter mutation, or audit.
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
set search_path = public, pg_temp
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

  -- Hold the same profile row that the deletion processor must update. A plain
  -- predicate check would leave a check→ledger TOCTOU window.
  perform 1
    from public.profiles
   where id = target_user
   for update;
  if not found or not public.account_is_active(target_user) then
    raise exception 'inactive_target_account';
  end if;

  if amount <= 0 or amount > 10000 then
    raise exception 'amount must be between 1 and 10000 (got: %)', amount;
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required';
  end if;

  -- 163 net-current delivery-key arms, preserved verbatim.
  delivery_key := case
    when source = 'founder_grant' then 'founder:' || target_user::text
    when source = 'purchase' then metadata->>'stripe_session_id'
    when source = 'monthly_allowance' then metadata->>'stripe_invoice_id'
    when source = 'auto_reload' then metadata->>'stripe_payment_intent_id'
    when source = 'seat_payout' then
      coalesce(metadata->>'case_id', metadata->>'buyback_id')
    else null
  end;

  if source = 'founder_grant'
     and coalesce(metadata->>'stripe_session_id', '') = '' then
    raise exception
      'founder_grant requires metadata.stripe_session_id (refund clawback key)';
  end if;

  if source in ('purchase', 'monthly_allowance', 'auto_reload', 'seat_payout')
     and coalesce(delivery_key, '') = '' then
    raise exception 'idempotency metadata is required for source %', source;
  end if;

  if delivery_key is not null then
    insert into public.credit_grant_idempotency (
      source, idempotency_key, user_id
    ) values (
      source, delivery_key, target_user
    )
    on conflict do nothing
    returning idempotency_key into claimed_key;

    if claimed_key is null then
      return public.get_credit_balance(target_user);
    end if;
  end if;

  insert into public.credit_ledger (
    user_id, kind, amount, source, metadata, expires_at
  ) values (
    target_user, 'grant', amount, source, coalesce(metadata, '{}'::jsonb), expires_at
  )
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
     set credits = new_balance,
         updated_at = now()
   where id = target_user;

  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object(
      'new_balance', new_balance,
      'expires_at', expires_at
    ) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

revoke all on function public.system_grant_credits(
  uuid, integer, text, jsonb, timestamptz
) from public, anon, authenticated;
grant execute on function public.system_grant_credits(
  uuid, integer, text, jsonb, timestamptz
) to service_role;

-- COPIED BODY: migration 024's net-current restore_premium_settlements is
-- preserved except for ONE inactive-account fence: lock the target profile and
-- reject before profiles, settlements, or saved_maps can be reactivated.
create or replace function public.restore_premium_settlements(target_user uuid)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  settlement_count integer := 0;
  campaign_count integer := 0;
begin
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  perform 1
    from public.profiles
   where id = target_user
   for update;
  if not found or not public.account_is_active(target_user) then
    raise exception 'inactive_target_account';
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
  get diagnostics settlement_count = row_count;
  update public.saved_maps
     set access_state = 'active',
         inactive_reason = null,
         inactive_since = null,
         retention_expires_at = null
   where user_id = target_user
     and access_state in ('inactive_plan', 'pending_delete');
  get diagnostics campaign_count = row_count;
  return settlement_count + campaign_count;
end;
$$;

revoke all on function public.restore_premium_settlements(uuid)
  from public, anon, authenticated;
grant execute on function public.restore_premium_settlements(uuid)
  to service_role;

-- ── 3. Row-level inactive-account billing/entitlement fences ────────────────
create or replace function public.guard_inactive_profile_billing()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_inactive boolean;
begin
  v_inactive := new.deleted_at is not null
    or new.disabled_at is not null
    or new.banned_at is not null;

  if not v_inactive then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.stripe_subscription_id is not null
       or new.stripe_customer_id is not null
       or new.tier = 'premium'
       or new.is_founder is true then
      raise exception 'inactive_profile_billing_upgrade_forbidden';
    end if;
    return new;
  end if;

  -- Existing linkage/entitlement may remain long enough for the cleanup worker
  -- to inspect it. Clearing/downgrading is allowed; acquisition or replacement is
  -- not. This also permits the deletion processor to set lock flags atomically
  -- while preserving the IDs that the worker must cancel.
  if (
    new.stripe_subscription_id is not null
    and new.stripe_subscription_id is distinct from old.stripe_subscription_id
  ) or (
    new.stripe_customer_id is not null
    and new.stripe_customer_id is distinct from old.stripe_customer_id
  ) or (
    new.tier = 'premium'
    and old.tier is distinct from 'premium'
  ) or (
    new.is_founder is true
    and old.is_founder is distinct from true
  ) then
    raise exception 'inactive_profile_billing_upgrade_forbidden';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_inactive_profile_billing
  on public.profiles;
create trigger trg_guard_inactive_profile_billing
before insert or update on public.profiles
for each row execute function public.guard_inactive_profile_billing();

comment on function public.guard_inactive_profile_billing() is
  'BEFORE-row fence: an inactive profile cannot acquire/replace Stripe linkage or upgrade to premium/founder. Unchanged linkage, clearing, and downgrades remain legal for durable cleanup.';

create or replace function public.guard_inactive_surveyor_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Serialize every Surveyor write against deletion's profile-flag update. A
  -- plain predicate check would race because the two transactions otherwise
  -- mutate different tables.
  perform 1
    from public.profiles
   where id = new.user_id
   for update;
  if found and public.account_is_active(new.user_id) then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status = 'active'
       or new.stripe_subscription_id is not null
       or new.stripe_customer_id is not null then
      raise exception 'inactive_surveyor_entitlement_forbidden';
    end if;
    return new;
  end if;

  -- Revocation and nulling IDs are cleanup. Reactivation or assigning a fresh
  -- non-null billing identity to an inactive owner is forbidden.
  if new.status = 'active' or (
    new.stripe_subscription_id is not null
    and new.stripe_subscription_id is distinct from old.stripe_subscription_id
  ) or (
    new.stripe_customer_id is not null
    and new.stripe_customer_id is distinct from old.stripe_customer_id
  ) then
    raise exception 'inactive_surveyor_entitlement_forbidden';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_inactive_surveyor_entitlement()
  from public, anon, authenticated, service_role;

drop trigger if exists trg_guard_inactive_surveyor_entitlement
  on public.surveyor_entitlements;
create trigger trg_guard_inactive_surveyor_entitlement
before insert or update on public.surveyor_entitlements
for each row execute function public.guard_inactive_surveyor_entitlement();

comment on function public.guard_inactive_surveyor_entitlement() is
  'BEFORE-row fence: locks the owner profile to serialize with deletion; an inactive/missing owner cannot receive/reactivate Surveyor or acquire/replace its Stripe linkage. Revocation and linkage clearing remain legal.';

-- COPIED BODY: migration 159's net-current grant_surveyor_entitlement is
-- preserved except for ONE inactive-account fence before the entitlement upsert.
-- The canonical provisioning path takes the profile lock BEFORE touching the
-- entitlement row, avoiding the direct-write trigger's unavoidable row-lock
-- inversion while preserving the trigger as a universal backstop.
create or replace function public.grant_surveyor_entitlement(
  p_user uuid,
  p_source text,
  p_subscription_id text default null,
  p_customer_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'grant_surveyor_entitlement is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;
  if p_user is null then
    raise exception 'p_user is required';
  end if;

  perform 1
    from public.profiles
   where id = p_user
   for update;
  if not found or not public.account_is_active(p_user) then
    raise exception 'inactive_target_account';
  end if;

  insert into public.surveyor_entitlements (
    user_id,
    status,
    source,
    granted_at,
    revoked_at,
    stripe_subscription_id,
    stripe_customer_id
  ) values (
    p_user,
    'active',
    coalesce(nullif(btrim(p_source), ''), 'subscription'),
    now(),
    null,
    p_subscription_id,
    p_customer_id
  )
  on conflict (user_id) do update set
    status = 'active',
    source = coalesce(
      nullif(btrim(p_source), ''),
      public.surveyor_entitlements.source
    ),
    granted_at = now(),
    revoked_at = null,
    stripe_subscription_id = coalesce(
      p_subscription_id,
      public.surveyor_entitlements.stripe_subscription_id
    ),
    stripe_customer_id = coalesce(
      p_customer_id,
      public.surveyor_entitlements.stripe_customer_id
    );

  return true;
end;
$$;

revoke all on function public.grant_surveyor_entitlement(
  uuid, text, text, text
) from public, anon, authenticated;
grant execute on function public.grant_surveyor_entitlement(
  uuid, text, text, text
) to service_role;

-- ── 4. Durable late-billing identities on deletion cleanup jobs ─────────────
alter table public.account_deletion_cleanup_jobs
  add column if not exists late_stripe_subscription_ids text[]
    not null default '{}'::text[],
  add column if not exists late_stripe_customer_ids text[]
    not null default '{}'::text[],
  add column if not exists known_stripe_subscription_ids text[]
    not null default '{}'::text[],
  add column if not exists known_stripe_customer_ids text[]
    not null default '{}'::text[],
  add column if not exists late_billing_revision bigint
    not null default 0,
  add column if not exists late_billing_recorded_at timestamptz;

comment on column
  public.account_deletion_cleanup_jobs.late_stripe_subscription_ids is
  'Deduplicated Stripe subscription IDs observed after local account deletion. A claimed worker must cancel every ID and CAS the exact array/revision at completion.';
comment on column
  public.account_deletion_cleanup_jobs.late_stripe_customer_ids is
  'Deduplicated Stripe customer IDs observed after local account deletion. A claimed worker must enumerate/cancel/delete every ID and CAS the exact array/revision at completion.';
comment on column
  public.account_deletion_cleanup_jobs.late_billing_revision is
  'Monotonic generation incremented by every late-billing requeue and successful completion. Prevents a worker from clearing IDs it did not inspect.';
comment on column
  public.account_deletion_cleanup_jobs.known_stripe_subscription_ids is
  'Non-cleared historical subscription identities for resolving Stripe events back to a deleted account after live profile linkage and late obligations are cleared.';
comment on column
  public.account_deletion_cleanup_jobs.known_stripe_customer_ids is
  'Non-cleared historical customer identities for resolving late invoices back to a deleted account after live profile linkage and late obligations are cleared.';

-- Preserve any linkage still present when 178 is applied. Future completions
-- append their exact profile/Surveyor/late identities before clearing live data.
update public.account_deletion_cleanup_jobs j
   set known_stripe_subscription_ids = (
         select coalesce(array_agg(distinct x order by x), '{}'::text[])
           from unnest(
             j.known_stripe_subscription_ids
             || array_remove(
               array[p.stripe_subscription_id, se.stripe_subscription_id],
               null
             )
           ) as ids(x)
          where btrim(x) <> ''
       ),
       known_stripe_customer_ids = (
         select coalesce(array_agg(distinct x order by x), '{}'::text[])
           from unnest(
             j.known_stripe_customer_ids
             || array_remove(
               array[p.stripe_customer_id, se.stripe_customer_id],
               null
             )
           ) as ids(x)
          where btrim(x) <> ''
       )
  from public.profiles p
  left join public.surveyor_entitlements se on se.user_id = p.id
 where p.id = j.user_id;

create or replace function
  public.requeue_account_deletion_cleanup_for_late_billing(
    p_user uuid,
    p_subscription_id text default null,
    p_customer_id text default null,
    p_reason text default null
  )
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_subscription_id text;
  v_customer_id text;
  v_job public.account_deletion_cleanup_jobs%rowtype;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'requeue_account_deletion_cleanup_for_late_billing is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  if p_user is null then
    raise exception 'p_user is required';
  end if;
  v_subscription_id := nullif(btrim(p_subscription_id), '');
  v_customer_id := nullif(btrim(p_customer_id), '');
  if p_subscription_id is not null and v_subscription_id is null then
    raise exception 'p_subscription_id cannot be blank';
  end if;
  if p_customer_id is not null and v_customer_id is null then
    raise exception 'p_customer_id cannot be blank';
  end if;
  if v_subscription_id is null and v_customer_id is null then
    raise exception 'subscription_id or customer_id is required';
  end if;

  -- A still-active account belongs to normal billing flow, not deletion cleanup.
  if public.account_is_active(p_user) then
    return jsonb_build_object('ok', false, 'reason', 'account_active');
  end if;

  select j.*
    into v_job
    from public.account_deletion_cleanup_jobs j
    join public.deletion_requests dr on dr.id = j.deletion_request_id
   where j.user_id = p_user
     and dr.status <> 'cancelled'
   order by j.created_at desc, j.id desc
   limit 1
   for update of j;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'cleanup_job_not_found');
  end if;

  update public.account_deletion_cleanup_jobs
     set late_stripe_subscription_ids = case
           when v_subscription_id is null
             or v_subscription_id = any(late_stripe_subscription_ids)
             then late_stripe_subscription_ids
           else array_append(late_stripe_subscription_ids, v_subscription_id)
         end,
         late_stripe_customer_ids = case
           when v_customer_id is null
             or v_customer_id = any(late_stripe_customer_ids)
             then late_stripe_customer_ids
           else array_append(late_stripe_customer_ids, v_customer_id)
         end,
         known_stripe_subscription_ids = case
           when v_subscription_id is null
             or v_subscription_id = any(known_stripe_subscription_ids)
             then known_stripe_subscription_ids
           else array_append(known_stripe_subscription_ids, v_subscription_id)
         end,
         known_stripe_customer_ids = case
           when v_customer_id is null
             or v_customer_id = any(known_stripe_customer_ids)
             then known_stripe_customer_ids
           else array_append(known_stripe_customer_ids, v_customer_id)
         end,
         late_billing_revision = late_billing_revision + 1,
         late_billing_recorded_at = now(),
         status = 'retry',
         next_attempt_at = now(),
         locked_at = null,
         lease_token = null,
         stripe_cleaned_at = null,
         completed_at = null,
         last_error = left(
           coalesce(
             nullif(btrim(p_reason), ''),
             'late Stripe billing observed after account deletion'
           ),
           1000
         ),
         updated_at = now()
   where id = v_job.id
   returning * into v_job;

  -- A previously completed request is no longer externally clean. Reopen the
  -- durable parent without rewriting its final audit history.
  update public.deletion_requests
     set status = 'processing',
         email = null
   where id = v_job.deletion_request_id
     and status <> 'cancelled';

  return jsonb_build_object(
    'ok', true,
    'job_id', v_job.id,
    'status', v_job.status,
    'late_billing_revision', v_job.late_billing_revision,
    'late_stripe_subscription_ids', v_job.late_stripe_subscription_ids,
    'late_stripe_customer_ids', v_job.late_stripe_customer_ids,
    'known_stripe_subscription_ids', v_job.known_stripe_subscription_ids,
    'known_stripe_customer_ids', v_job.known_stripe_customer_ids
  );
end;
$$;

revoke all on function
  public.requeue_account_deletion_cleanup_for_late_billing(
    uuid, text, text, text
  ) from public, anon, authenticated;
grant execute on function
  public.requeue_account_deletion_cleanup_for_late_billing(
    uuid, text, text, text
  ) to service_role;

comment on function
  public.requeue_account_deletion_cleanup_for_late_billing(
    uuid, text, text, text
  ) is
  'Service-role durable late-billing recorder. Deduplicates subscription/customer IDs, increments the generation, invalidates any live lease, and reopens even a completed deletion request.';

-- A worker can discover a previously-unknown customer by retrieving/canceling a
-- subscription. Checkpoint it under the active lease before customer deletion.
-- Unlike requeue, this preserves the lease and returns the new CAS generation.
create or replace function
  public.checkpoint_account_deletion_billing_identity(
    p_job_id uuid,
    p_lease_token uuid,
    p_subscription_id text default null,
    p_customer_id text default null
  )
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_subscription_id text;
  v_customer_id text;
  v_job public.account_deletion_cleanup_jobs%rowtype;
  v_late_set_grows boolean;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'checkpoint_account_deletion_billing_identity is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  v_subscription_id := nullif(btrim(p_subscription_id), '');
  v_customer_id := nullif(btrim(p_customer_id), '');
  if p_subscription_id is not null and v_subscription_id is null then
    raise exception 'p_subscription_id cannot be blank';
  end if;
  if p_customer_id is not null and v_customer_id is null then
    raise exception 'p_customer_id cannot be blank';
  end if;
  if v_subscription_id is null and v_customer_id is null then
    raise exception 'subscription_id or customer_id is required';
  end if;

  select *
    into v_job
    from public.account_deletion_cleanup_jobs
   where id = p_job_id
     and status = 'processing'
     and lease_token = p_lease_token
   for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'lease_lost');
  end if;

  v_late_set_grows := (
    v_subscription_id is not null
    and not (v_subscription_id = any(v_job.late_stripe_subscription_ids))
  ) or (
    v_customer_id is not null
    and not (v_customer_id = any(v_job.late_stripe_customer_ids))
  );

  update public.account_deletion_cleanup_jobs
     set late_stripe_subscription_ids = case
           when v_subscription_id is null
             or v_subscription_id = any(late_stripe_subscription_ids)
             then late_stripe_subscription_ids
           else array_append(late_stripe_subscription_ids, v_subscription_id)
         end,
         late_stripe_customer_ids = case
           when v_customer_id is null
             or v_customer_id = any(late_stripe_customer_ids)
             then late_stripe_customer_ids
           else array_append(late_stripe_customer_ids, v_customer_id)
         end,
         known_stripe_subscription_ids = case
           when v_subscription_id is null
             or v_subscription_id = any(known_stripe_subscription_ids)
             then known_stripe_subscription_ids
           else array_append(known_stripe_subscription_ids, v_subscription_id)
         end,
         known_stripe_customer_ids = case
           when v_customer_id is null
             or v_customer_id = any(known_stripe_customer_ids)
             then known_stripe_customer_ids
           else array_append(known_stripe_customer_ids, v_customer_id)
         end,
         late_billing_revision = late_billing_revision
           + case when v_late_set_grows then 1 else 0 end,
         late_billing_recorded_at = case
           when v_late_set_grows then now()
           else late_billing_recorded_at
         end,
         updated_at = now()
   where id = v_job.id
   returning * into v_job;

  return jsonb_build_object(
    'ok', true,
    'job_id', v_job.id,
    'lease_token', v_job.lease_token,
    'late_billing_revision', v_job.late_billing_revision,
    'late_stripe_subscription_ids', v_job.late_stripe_subscription_ids,
    'late_stripe_customer_ids', v_job.late_stripe_customer_ids
  );
end;
$$;

revoke all on function
  public.checkpoint_account_deletion_billing_identity(
    uuid, uuid, text, text
  ) from public, anon, authenticated;
grant execute on function
  public.checkpoint_account_deletion_billing_identity(
    uuid, uuid, text, text
  ) to service_role;

-- Resolve a late subscription/invoice after profile linkage has been cleared.
-- Both supplied IDs must match the same job. Stripe IDs should be globally
-- unique, but ambiguity is explicitly fail-closed rather than choosing a user.
create or replace function
  public.resolve_account_deletion_user_by_stripe_billing(
    p_subscription_id text default null,
    p_customer_id text default null
  )
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_subscription_id text;
  v_customer_id text;
  v_user_count int;
  v_user_id uuid;
  v_job_id uuid;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'resolve_account_deletion_user_by_stripe_billing is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  v_subscription_id := nullif(btrim(p_subscription_id), '');
  v_customer_id := nullif(btrim(p_customer_id), '');
  if p_subscription_id is not null and v_subscription_id is null then
    raise exception 'p_subscription_id cannot be blank';
  end if;
  if p_customer_id is not null and v_customer_id is null then
    raise exception 'p_customer_id cannot be blank';
  end if;
  if v_subscription_id is null and v_customer_id is null then
    raise exception 'subscription_id or customer_id is required';
  end if;

  select count(distinct j.user_id)::int
    into v_user_count
    from public.account_deletion_cleanup_jobs j
   where (
     v_subscription_id is null
     or v_subscription_id = any(j.known_stripe_subscription_ids)
     or v_subscription_id = any(j.late_stripe_subscription_ids)
   )
     and (
       v_customer_id is null
       or v_customer_id = any(j.known_stripe_customer_ids)
       or v_customer_id = any(j.late_stripe_customer_ids)
     );

  if v_user_count = 0 then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if v_user_count > 1 then
    return jsonb_build_object('ok', false, 'reason', 'ambiguous');
  end if;

  select j.user_id, j.id
    into v_user_id, v_job_id
    from public.account_deletion_cleanup_jobs j
   where (
     v_subscription_id is null
     or v_subscription_id = any(j.known_stripe_subscription_ids)
     or v_subscription_id = any(j.late_stripe_subscription_ids)
   )
     and (
       v_customer_id is null
       or v_customer_id = any(j.known_stripe_customer_ids)
       or v_customer_id = any(j.late_stripe_customer_ids)
     )
   order by j.created_at desc, j.id desc
   limit 1;

  return jsonb_build_object(
    'ok', true,
    'user_id', v_user_id,
    'job_id', v_job_id
  );
end;
$$;

revoke all on function
  public.resolve_account_deletion_user_by_stripe_billing(text, text)
  from public, anon, authenticated;
grant execute on function
  public.resolve_account_deletion_user_by_stripe_billing(text, text)
  to service_role;

comment on function
  public.checkpoint_account_deletion_billing_identity(
    uuid, uuid, text, text
  ) is
  'Lease-guarded service checkpoint for customer/subscription IDs discovered by the cleanup worker. Preserves the lease, appends durable late + historical identity, and returns the updated CAS generation.';
comment on function
  public.resolve_account_deletion_user_by_stripe_billing(text, text) is
  'Service-only deleted-account identity resolver over non-cleared billing history. Returns a user only for one unambiguous match; both supplied IDs must match the same job.';

-- ── 5. Claim returns the exact late-billing generation/identities ────────────
-- Return type changed, so PostgreSQL requires a drop/recreate rather than
-- CREATE OR REPLACE.
-- COPIED BODY: migration 175's lease candidate/claim ordering is unchanged.
-- This signature adds an in-body service-role gate and returns the exact late
-- subscription/customer arrays plus their CAS revision.
drop function if exists public.claim_account_deletion_cleanup_jobs(int, int);

create function public.claim_account_deletion_cleanup_jobs(
  p_limit int default 50,
  p_stale_after_minutes int default 30
)
returns table (
  job_id uuid,
  deletion_request_id uuid,
  user_id uuid,
  lease_token uuid,
  attempts int,
  auth_revoked_at timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  surveyor_subscription_id text,
  surveyor_customer_id text,
  late_stripe_subscription_ids text[],
  late_stripe_customer_ids text[],
  late_billing_revision bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_limit int := greatest(1, least(coalesce(p_limit, 50), 200));
  v_stale interval := make_interval(
    mins => greatest(5, least(coalesce(p_stale_after_minutes, 30), 1440))
  );
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'claim_account_deletion_cleanup_jobs is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  return query
  with candidates as (
    select j.id
      from public.account_deletion_cleanup_jobs j
     where (
       j.status in ('pending', 'retry')
       and j.next_attempt_at <= now()
     ) or (
       j.status = 'processing'
       and (j.locked_at is null or j.locked_at <= now() - v_stale)
     )
     order by
       case
         when j.status = 'processing' then 0
         when j.status = 'retry' then 1
         else 2
       end,
       j.next_attempt_at asc,
       j.created_at asc,
       j.id asc
     limit v_limit
     for update skip locked
  ),
  claimed as (
    update public.account_deletion_cleanup_jobs j
       set status = 'processing',
           attempts = j.attempts + 1,
           locked_at = now(),
           lease_token = gen_random_uuid(),
           updated_at = now()
      from candidates c
     where j.id = c.id
    returning j.*
  )
  select c.id,
         c.deletion_request_id,
         c.user_id,
         c.lease_token,
         c.attempts,
         c.auth_revoked_at,
         p.stripe_subscription_id,
         p.stripe_customer_id,
         se.stripe_subscription_id,
         se.stripe_customer_id,
         c.late_stripe_subscription_ids,
         c.late_stripe_customer_ids,
         c.late_billing_revision
    from claimed c
    left join public.profiles p on p.id = c.user_id
    left join public.surveyor_entitlements se on se.user_id = c.user_id
   order by c.created_at asc, c.id asc;
end;
$$;

revoke all on function public.claim_account_deletion_cleanup_jobs(int, int)
  from public, anon, authenticated;
grant execute on function public.claim_account_deletion_cleanup_jobs(int, int)
  to service_role;

-- ── 6. Completion CASes and clears the exact late-billing generation ─────────
-- COPIED BODY: migration 175's external-cleanup completion transaction remains
-- intact. The replacement adds an in-body service-role gate, exact late-ID/
-- revision proof, durable historical identity, and atomic clearing of the
-- inspected late set before marking the request done.
drop function if exists public.complete_account_deletion_cleanup_job(
  uuid, uuid, text, text, text, text
);

create function public.complete_account_deletion_cleanup_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_expected_subscription_id text default null,
  p_expected_customer_id text default null,
  p_expected_surveyor_subscription_id text default null,
  p_expected_surveyor_customer_id text default null,
  p_expected_late_subscription_ids text[] default '{}'::text[],
  p_expected_late_customer_ids text[] default '{}'::text[],
  p_expected_late_billing_revision bigint default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  j record;
  v_subscription_id text;
  v_customer_id text;
  v_surveyor_subscription_id text;
  v_surveyor_customer_id text;
  v_expected_late_subscription_ids text[] :=
    coalesce(p_expected_late_subscription_ids, '{}'::text[]);
  v_expected_late_customer_ids text[] :=
    coalesce(p_expected_late_customer_ids, '{}'::text[]);
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception
      'complete_account_deletion_cleanup_job is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  select *
    into j
    from public.account_deletion_cleanup_jobs
   where id = p_job_id
     and status = 'processing'
     and lease_token = p_lease_token
   for update;

  if not found or j.auth_revoked_at is null then
    return false;
  end if;

  -- Old workers (which omit the new arguments) remain safe only for jobs with no
  -- late identities. Any non-empty late set requires an explicit generation CAS.
  if j.late_stripe_subscription_ids
       is distinct from v_expected_late_subscription_ids
     or j.late_stripe_customer_ids
       is distinct from v_expected_late_customer_ids
     or (
       (
         cardinality(j.late_stripe_subscription_ids) > 0
         or cardinality(j.late_stripe_customer_ids) > 0
       )
       and p_expected_late_billing_revision is null
     )
     or (
       p_expected_late_billing_revision is not null
       and j.late_billing_revision <> p_expected_late_billing_revision
     ) then
    return false;
  end if;

  select stripe_subscription_id, stripe_customer_id
    into v_subscription_id, v_customer_id
    from public.profiles
   where id = j.user_id
   for update;
  if not found then
    return false;
  end if;

  if v_subscription_id is distinct from p_expected_subscription_id
     or v_customer_id is distinct from p_expected_customer_id then
    return false;
  end if;

  select stripe_subscription_id, stripe_customer_id
    into v_surveyor_subscription_id, v_surveyor_customer_id
    from public.surveyor_entitlements
   where user_id = j.user_id
   for update;
  if not found then
    v_surveyor_subscription_id := null;
    v_surveyor_customer_id := null;
  end if;
  if v_surveyor_subscription_id
       is distinct from p_expected_surveyor_subscription_id
     or v_surveyor_customer_id
       is distinct from p_expected_surveyor_customer_id then
    return false;
  end if;

  update public.profiles
     set stripe_subscription_id = null,
         stripe_customer_id = null,
         updated_at = now()
   where id = j.user_id;

  update public.surveyor_entitlements
     set status = 'revoked',
         revoked_at = coalesce(revoked_at, now()),
         stripe_subscription_id = null,
         stripe_customer_id = null
   where user_id = j.user_id;

  delete from public.surveyor_byok_keys
   where user_id = j.user_id;

  update public.account_deletion_cleanup_jobs
     set status = 'done',
         stripe_cleaned_at = now(),
         completed_at = now(),
         next_attempt_at = now(),
         locked_at = null,
         lease_token = null,
         last_error = null,
         known_stripe_subscription_ids = (
           select coalesce(array_agg(distinct x order by x), '{}'::text[])
             from unnest(
               j.known_stripe_subscription_ids
               || j.late_stripe_subscription_ids
               || array_remove(
                 array[
                   p_expected_subscription_id,
                   p_expected_surveyor_subscription_id
                 ],
                 null
               )
             ) as ids(x)
            where btrim(x) <> ''
         ),
         known_stripe_customer_ids = (
           select coalesce(array_agg(distinct x order by x), '{}'::text[])
             from unnest(
               j.known_stripe_customer_ids
               || j.late_stripe_customer_ids
               || array_remove(
                 array[
                   p_expected_customer_id,
                   p_expected_surveyor_customer_id
                 ],
                 null
               )
             ) as ids(x)
            where btrim(x) <> ''
         ),
         late_stripe_subscription_ids = '{}'::text[],
         late_stripe_customer_ids = '{}'::text[],
         late_billing_revision = j.late_billing_revision + 1,
         updated_at = now()
   where id = j.id;

  update public.deletion_requests
     set status = 'done',
         processed_at = now(),
         email = null
   where id = j.deletion_request_id;

  if j.audit_required and j.audit_written_at is null then
    perform public.write_audit(
      p_action          => 'process_deletion',
      p_target_user_id  => j.user_id,
      p_target_type     => 'deletion_request',
      p_target_id       => j.deletion_request_id::text,
      p_reason          =>
        'soft-delete and external cleanup completed after grace window',
      p_before          =>
        coalesce(j.audit_before, jsonb_build_object('backfilled', true)),
      p_after           => jsonb_build_object(
        'anonymized', true,
        'status', 'done',
        'locked', true,
        'auth_revoked', true,
        'billing_canceled', true
      ),
      p_was_destructive => true,
      p_was_reversible  => false,
      p_user_notified   => true,
      p_actor_id        => j.audit_actor_id
    );
    update public.account_deletion_cleanup_jobs
       set audit_written_at = now()
     where id = j.id;
  elsif not j.audit_required and j.audit_written_at is null then
    perform public.write_audit(
      p_action          => 'complete_deletion_external_cleanup',
      p_target_user_id  => j.user_id,
      p_target_type     => 'deletion_request',
      p_target_id       => j.deletion_request_id::text,
      p_reason          => 'backfilled GoTrue and Stripe cleanup completed',
      p_before          => jsonb_build_object('backfilled', true),
      p_after           => jsonb_build_object(
        'status', 'done',
        'auth_revoked', true,
        'billing_canceled', true
      ),
      p_was_destructive => true,
      p_was_reversible  => false,
      p_user_notified   => true,
      p_actor_id        => j.audit_actor_id
    );
    update public.account_deletion_cleanup_jobs
       set audit_written_at = now()
     where id = j.id;
  end if;

  return true;
end;
$$;

revoke all on function public.complete_account_deletion_cleanup_job(
  uuid, uuid, text, text, text, text, text[], text[], bigint
) from public, anon, authenticated;
grant execute on function public.complete_account_deletion_cleanup_job(
  uuid, uuid, text, text, text, text, text[], text[], bigint
) to service_role;

comment on function public.claim_account_deletion_cleanup_jobs(int, int) is
  'Service-role lease claim returning current profile/Surveyor linkage plus exact late subscription/customer arrays and their CAS revision.';
comment on function public.complete_account_deletion_cleanup_job(
  uuid, uuid, text, text, text, text, text[], text[], bigint
) is
  'Service-role completion transaction. Requires active lease, auth checkpoint, unchanged profile/Surveyor linkage, and exact late-billing arrays/revision; then clears every linkage and late identity atomically before marking done.';
