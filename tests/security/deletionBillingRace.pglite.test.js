/**
 * Migration 178 — inactive-account billing fence and deletion/Stripe race.
 *
 * Applies the complete migration to PGlite over a minimal net-current schema.
 * Exercises the actual trigger/RPC bodies: atomic inactive money guards, cleanup-
 * safe billing fences, durable late-ID requeue/checkpoint, exact completion CAS,
 * retained deleted-billing identity, and ambiguity fail-closed behavior.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/178_inactive_account_billing_fence.sql',
);
const migration = readFileSync(migrationPath, 'utf8');

const ACTIVE = '11111111-1111-1111-1111-111111111111';
const DELETED = '22222222-2222-2222-2222-222222222222';
const OTHER_DELETED = '33333333-3333-3333-3333-333333333333';
const ACTIVE_ATTEMPT = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const DELETED_ATTEMPT = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const REQUEST = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const OTHER_REQUEST = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const JOB = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const OTHER_JOB = 'ffffffff-ffff-4fff-8fff-ffffffffffff';
const LEASE = '12121212-1212-4121-8121-121212121212';

let db;

async function makeDb() {
  const next = new PGlite();
  await next.exec(`
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
      if not exists (select from pg_roles where rolname = 'service_role') then
        create role service_role;
      end if;
    end $do$;

    create schema if not exists auth;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        'authenticated'
      )
    $fn$;
    create table auth.users (id uuid primary key);

    create table public.profiles (
      id uuid primary key references auth.users(id) on delete cascade,
      tier text not null default 'free',
      credits integer not null default 0,
      is_founder boolean not null default false,
      stripe_subscription_id text,
      stripe_customer_id text,
      display_name text,
      email text,
      banned_at timestamptz,
      disabled_at timestamptz,
      deleted_at timestamptz,
      premium_downgraded_at timestamptz,
      premium_retention_expires_at timestamptz,
      updated_at timestamptz not null default now()
    );

    create or replace function public.account_is_active(p_uid uuid)
    returns boolean
    language sql
    stable
    security definer
    set search_path = public, pg_temp
    as $fn$
      select exists (
        select 1 from public.profiles
         where id = p_uid
           and banned_at is null
           and disabled_at is null
           and deleted_at is null
      )
    $fn$;
    revoke all on function public.account_is_active(uuid) from public;
    grant execute on function public.account_is_active(uuid)
      to authenticated, service_role;

    create table public.credit_auto_reload_settings (
      user_id uuid primary key references auth.users(id) on delete cascade,
      enabled boolean not null default true,
      threshold_credits integer not null default 5,
      target_credits integer not null default 25,
      monthly_cap_cents integer not null default 4000,
      notified_at timestamptz,
      notified_bucket text,
      updated_at timestamptz not null default now()
    );
    create table public.credit_auto_reload_attempts (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      state text not null default 'pending',
      credits_delta integer not null,
      amount_cents integer not null,
      month_bucket text not null,
      stripe_payment_intent_id text,
      failure_reason text,
      created_at timestamptz not null default now(),
      resolved_at timestamptz
    );
    create unique index uidx_test_auto_reload_open
      on public.credit_auto_reload_attempts(user_id)
      where state in ('pending', 'requires_action');

    create table public.credit_grant_idempotency (
      source text not null,
      idempotency_key text not null,
      user_id uuid not null,
      ledger_id uuid,
      primary key (source, idempotency_key)
    );
    create table public.credit_ledger (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null,
      kind text not null,
      amount integer not null,
      source text not null,
      metadata jsonb not null default '{}'::jsonb,
      expires_at timestamptz,
      created_at timestamptz not null default now()
    );
    create table public.credit_transactions (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null,
      amount integer not null,
      reason text,
      created_at timestamptz not null default now()
    );
    create or replace function public.get_credit_balance(target_user uuid)
    returns integer language sql stable set search_path = public, pg_temp as $fn$
      select coalesce(sum(case when kind = 'grant' then amount else -amount end), 0)::int
        from public.credit_ledger where user_id = target_user
    $fn$;
    create or replace function public._audit_action(
      p_actor uuid,
      p_target uuid,
      p_action text,
      p_before jsonb,
      p_after jsonb,
      p_reason text
    ) returns void language plpgsql set search_path = public, pg_temp as $fn$
    begin
      return;
    end
    $fn$;

    create table public.settlements (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null,
      access_state text not null default 'active',
      inactive_reason text,
      inactive_since timestamptz,
      retention_expires_at timestamptz
    );
    create table public.saved_maps (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null,
      access_state text not null default 'active',
      inactive_reason text,
      inactive_since timestamptz,
      retention_expires_at timestamptz
    );

    create table public.surveyor_entitlements (
      user_id uuid primary key references auth.users(id) on delete cascade,
      status text not null default 'active',
      source text,
      granted_at timestamptz not null default now(),
      revoked_at timestamptz,
      stripe_subscription_id text,
      stripe_customer_id text
    );
    grant select, insert, update on public.surveyor_entitlements
      to service_role;
    create table public.surveyor_byok_keys (
      user_id uuid not null references auth.users(id) on delete cascade,
      provider text not null default 'anthropic',
      ciphertext bytea not null,
      primary key (user_id, provider)
    );

    create table public.deletion_requests (
      id uuid primary key,
      user_id uuid references auth.users(id) on delete cascade,
      email text,
      status text not null default 'processing',
      processed_at timestamptz
    );
    create table public.account_deletion_cleanup_jobs (
      id uuid primary key default gen_random_uuid(),
      deletion_request_id uuid not null unique
        references public.deletion_requests(id) on delete cascade,
      user_id uuid not null,
      status text not null default 'pending',
      attempts integer not null default 0,
      next_attempt_at timestamptz not null default now(),
      locked_at timestamptz,
      lease_token uuid,
      auth_revoked_at timestamptz,
      stripe_cleaned_at timestamptz,
      completed_at timestamptz,
      last_failed_at timestamptz,
      last_error text,
      audit_before jsonb,
      audit_actor_id uuid,
      audit_required boolean not null default false,
      audit_written_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create or replace function public.write_audit(
      p_action text,
      p_target_user_id uuid default null,
      p_target_type text default null,
      p_target_id text default null,
      p_reason text default null,
      p_before jsonb default null,
      p_after jsonb default null,
      p_was_destructive boolean default false,
      p_was_reversible boolean default true,
      p_user_notified boolean default false,
      p_actor_id uuid default null
    ) returns uuid language sql set search_path = public, pg_temp as $fn$
      select gen_random_uuid()
    $fn$;

    insert into auth.users (id) values
      ('${ACTIVE}'), ('${DELETED}'), ('${OTHER_DELETED}');
    insert into public.profiles (
      id, tier, credits, is_founder, stripe_subscription_id,
      stripe_customer_id, disabled_at, deleted_at,
      premium_downgraded_at, premium_retention_expires_at
    ) values
      ('${ACTIVE}', 'free', 0, false, null, null, null, null, now(), now()),
      ('${DELETED}', 'free', 0, false, 'sub_old', 'cus_old', now(), now(), now(), now()),
      ('${OTHER_DELETED}', 'free', 0, false, null, null, now(), now(), now(), now());

    insert into public.credit_auto_reload_settings (
      user_id, enabled, threshold_credits, target_credits, monthly_cap_cents
    ) values
      ('${ACTIVE}', true, 5, 25, 4000),
      ('${DELETED}', true, 5, 25, 4000);

    insert into public.surveyor_entitlements (
      user_id, status, source, stripe_subscription_id, stripe_customer_id
    ) values (
      '${DELETED}', 'active', 'subscription', 'sub_surv', 'cus_surv'
    );
    insert into public.surveyor_byok_keys (user_id, ciphertext)
    values ('${DELETED}', decode('0102', 'hex'));

    insert into public.deletion_requests (
      id, user_id, status, processed_at
    ) values
      ('${REQUEST}', '${DELETED}', 'done', now()),
      ('${OTHER_REQUEST}', '${OTHER_DELETED}', 'done', now());
    insert into public.account_deletion_cleanup_jobs (
      id, deletion_request_id, user_id, status, auth_revoked_at,
      stripe_cleaned_at, completed_at, audit_written_at
    ) values
      ('${JOB}', '${REQUEST}', '${DELETED}', 'done', now(), now(), now(), now()),
      ('${OTHER_JOB}', '${OTHER_REQUEST}', '${OTHER_DELETED}', 'done', now(), now(), now(), now());

    insert into public.settlements (
      user_id, access_state, inactive_reason, inactive_since, retention_expires_at
    ) values (
      '${DELETED}', 'inactive_plan', 'premium_downgrade', now(), now() + interval '1 day'
    );
    insert into public.saved_maps (
      user_id, access_state, inactive_reason, inactive_since, retention_expires_at
    ) values (
      '${DELETED}', 'pending_delete', 'premium_downgrade', now(), now() + interval '1 day'
    );
  `);

  await next.exec(migration);
  return next;
}

async function asRole(role) {
  await db.query(
    `select set_config('request.jwt.claim.role', $1, false)`,
    [role],
  );
}

async function asService() {
  await asRole('service_role');
}

async function requeue({
  user = DELETED,
  subscription = 'sub_late',
  customer = 'cus_late',
  reason = 'late_checkout_after_deletion',
} = {}) {
  await asService();
  const { rows } = await db.query(
    `select public.requeue_account_deletion_cleanup_for_late_billing(
       $1::uuid, $2::text, $3::text, $4::text
     ) as result`,
    [user, subscription, customer, reason],
  );
  return rows[0].result;
}

async function claimCleanup() {
  await asService();
  const { rows } = await db.query(`
    select * from public.claim_account_deletion_cleanup_jobs(10, 30)
     order by job_id
  `);
  return rows;
}

async function complete(job, {
  revision = job.late_billing_revision,
  lateSubscriptions = job.late_stripe_subscription_ids,
  lateCustomers = job.late_stripe_customer_ids,
} = {}) {
  await asService();
  const { rows } = await db.query(
    `select public.complete_account_deletion_cleanup_job(
       $1::uuid, $2::uuid, $3::text, $4::text, $5::text, $6::text,
       $7::text[], $8::text[], $9::bigint
     ) as ok`,
    [
      job.job_id,
      job.lease_token,
      job.stripe_subscription_id,
      job.stripe_customer_id,
      job.surveyor_subscription_id,
      job.surveyor_customer_id,
      lateSubscriptions,
      lateCustomers,
      revision,
    ],
  );
  return rows[0].ok;
}

beforeEach(async () => {
  db = await makeDb();
});

describe('migration 178 inactive-account billing fence', () => {
  // ⚠ ANCHORED AT LINE START (`^` + m), replacing bare indexOf: a header that
  // quotes one of these create statements in prose would silently shift a
  // section boundary and misalign every slice below — and this test only
  // asserts over the sliced TEXT. Throws on a missing definition rather than
  // slicing from -1. See tests/security/moneyRpcNetCurrentGuards.test.js.
  const defIndex = (name) => {
    const m = migration.match(new RegExp(`^create or replace function public\\.${name}\\b`, 'im'));
    if (!m) throw new Error(`definition not found in 178: ${name}`);
    return m.index;
  };

  it('pins profile locks before all guarded money/restore mutations', () => {
    const claim = defIndex('claim_auto_reload_attempt');
    const grant = defIndex('system_grant_credits');
    const restore = defIndex('restore_premium_settlements');
    const nextSection = defIndex('guard_inactive_profile_billing');
    const claimBody = migration.slice(claim, grant);
    const grantBody = migration.slice(grant, restore);
    const restoreBody = migration.slice(restore, nextSection);
    for (const body of [claimBody, grantBody, restoreBody]) {
      expect(body).toMatch(/from public\.profiles[\s\S]*?for update/i);
      expect(body.indexOf('for update')).toBeLessThan(
        body.indexOf('public.account_is_active'),
      );
    }
    expect(grantBody.indexOf('public.account_is_active'))
      .toBeLessThan(grantBody.indexOf('credit_grant_idempotency'));
    expect(restoreBody.indexOf('public.account_is_active'))
      .toBeLessThan(restoreBody.indexOf('update public.settlements'));
    const surveyorGrant = defIndex('grant_surveyor_entitlement');
    const lateColumns = migration.indexOf(
      'alter table public.account_deletion_cleanup_jobs',
    );
    const surveyorGrantBody = migration.slice(surveyorGrant, lateColumns);
    expect(surveyorGrantBody).toMatch(
      /from public\.profiles[\s\S]*?for update[\s\S]*?public\.account_is_active/i,
    );
    expect(surveyorGrantBody.indexOf('public.account_is_active'))
      .toBeLessThan(surveyorGrantBody.indexOf('insert into public.surveyor_entitlements'));
  });

  it('refuses an inactive auto-reload before creating an attempt, while active still claims', async () => {
    await asService();
    const inactive = await db.query(`
      select public.claim_auto_reload_attempt('${DELETED}', 499, 25) as result
    `);
    expect(inactive.rows[0].result).toEqual({
      ok: false,
      reason: 'account_inactive',
    });
    expect((await db.query(`
      select count(*)::int as n
        from public.credit_auto_reload_attempts
       where user_id = '${DELETED}'
    `)).rows[0].n).toBe(0);

    const active = await db.query(`
      select public.claim_auto_reload_attempt('${ACTIVE}', 499, 25) as result
    `);
    expect(active.rows[0].result.ok).toBe(true);
    expect((await db.query(`
      select count(*)::int as n
        from public.credit_auto_reload_attempts
       where user_id = '${ACTIVE}'
    `)).rows[0].n).toBe(1);
  });

  it('raises inactive_target_account before any grant idempotency/ledger/counter mutation', async () => {
    await asService();
    await expect(db.query(`
      select public.system_grant_credits(
        '${DELETED}', 25, 'purchase',
        '{"stripe_session_id":"cs_deleted"}'::jsonb
      )
    `)).rejects.toThrow(/inactive_target_account/);
    const counts = await db.query(`
      select
        (select count(*)::int from public.credit_grant_idempotency) as idempotency,
        (select count(*)::int from public.credit_ledger) as ledger,
        (select count(*)::int from public.credit_transactions) as transactions,
        (select credits from public.profiles where id = '${DELETED}') as credits
    `);
    expect(counts.rows[0]).toEqual({
      idempotency: 0,
      ledger: 0,
      transactions: 0,
      credits: 0,
    });

    await db.query(`
      select public.system_grant_credits('${ACTIVE}', 5, 'manual_grant')
    `);
    expect((await db.query(`
      select credits from public.profiles where id = '${ACTIVE}'
    `)).rows[0].credits).toBe(5);
  });

  it('refuses premium restoration before touching retained assets for an inactive account', async () => {
    await asService();
    await expect(db.query(`
      select public.restore_premium_settlements('${DELETED}')
    `)).rejects.toThrow(/inactive_target_account/);
    const { rows } = await db.query(`
      select
        (select access_state from public.settlements where user_id = '${DELETED}')
          as settlement_state,
        (select access_state from public.saved_maps where user_id = '${DELETED}')
          as map_state,
        (select premium_downgraded_at is not null
           from public.profiles where id = '${DELETED}') as retained
    `);
    expect(rows[0]).toEqual({
      settlement_state: 'inactive_plan',
      map_state: 'pending_delete',
      retained: true,
    });
  });

  it('blocks inactive profile billing/upgrades but permits linkage cleanup', async () => {
    await expect(db.exec(`
      update public.profiles
         set stripe_subscription_id = 'sub_replacement'
       where id = '${DELETED}'
    `)).rejects.toThrow(/inactive_profile_billing_upgrade_forbidden/);
    await expect(db.exec(`
      update public.profiles set tier = 'premium' where id = '${DELETED}'
    `)).rejects.toThrow(/inactive_profile_billing_upgrade_forbidden/);
    await expect(db.exec(`
      update public.profiles set is_founder = true where id = '${DELETED}'
    `)).rejects.toThrow(/inactive_profile_billing_upgrade_forbidden/);

    await db.exec(`
      update public.profiles
         set stripe_subscription_id = null,
             stripe_customer_id = null,
             tier = 'free',
             is_founder = false
       where id = '${DELETED}'
    `);
    const row = (await db.query(`
      select stripe_subscription_id, stripe_customer_id, tier, is_founder
        from public.profiles where id = '${DELETED}'
    `)).rows[0];
    expect(row).toEqual({
      stripe_subscription_id: null,
      stripe_customer_id: null,
      tier: 'free',
      is_founder: false,
    });
  });

  it('blocks service-role Surveyor activation/linkage but permits revoke-and-clear', async () => {
    await asService();
    // Use the actual database role, not only a JWT-role GUC, so trigger-function
    // owner/EXECUTE posture is exercised as the webhook reaches it.
    await db.exec('set role service_role');
    try {
      await expect(db.query(`
        select public.grant_surveyor_entitlement(
          '${DELETED}', 'subscription', 'sub_rpc_new', 'cus_rpc_new'
        )
      `)).rejects.toThrow(/inactive_target_account/);
      expect((await db.query(`
        select public.grant_surveyor_entitlement(
          '${ACTIVE}', 'subscription', 'sub_active', 'cus_active'
        ) as ok
      `)).rows[0].ok).toBe(true);
      await expect(db.exec(`
        update public.surveyor_entitlements
           set status = 'active'
         where user_id = '${DELETED}'
      `)).rejects.toThrow(/inactive_surveyor_entitlement_forbidden/);
      await expect(db.exec(`
        insert into public.surveyor_entitlements (
          user_id, status, source, stripe_subscription_id, stripe_customer_id
        ) values (
          '${OTHER_DELETED}', 'active', 'subscription', 'sub_new', 'cus_new'
        )
      `)).rejects.toThrow(/inactive_surveyor_entitlement_forbidden/);

      await db.exec(`
        update public.surveyor_entitlements
           set status = 'revoked',
               revoked_at = now(),
               stripe_subscription_id = null,
               stripe_customer_id = null
         where user_id = '${DELETED}'
      `);
      const row = (await db.query(`
        select status, stripe_subscription_id, stripe_customer_id
          from public.surveyor_entitlements where user_id = '${DELETED}'
      `)).rows[0];
      expect(row).toEqual({
        status: 'revoked',
        stripe_subscription_id: null,
        stripe_customer_id: null,
      });
    } finally {
      await db.exec('reset role');
    }
  });

  it('reopens a done job, invalidates its lease, and dedupes repeated late IDs', async () => {
    await db.exec(`
      update public.account_deletion_cleanup_jobs
         set status = 'processing',
             lease_token = '${LEASE}',
             locked_at = now()
       where id = '${JOB}'
    `);
    const first = await requeue();
    expect(first).toMatchObject({
      ok: true,
      job_id: JOB,
      status: 'retry',
      late_billing_revision: 1,
      late_stripe_subscription_ids: ['sub_late'],
      late_stripe_customer_ids: ['cus_late'],
    });
    const second = await requeue();
    expect(second.late_billing_revision).toBe(2);
    expect(second.late_stripe_subscription_ids).toEqual(['sub_late']);
    expect(second.late_stripe_customer_ids).toEqual(['cus_late']);
    expect(second.known_stripe_subscription_ids).toContain('sub_late');
    expect(second.known_stripe_customer_ids).toContain('cus_late');

    const job = (await db.query(`
      select status, lease_token, locked_at, completed_at
        from public.account_deletion_cleanup_jobs where id = '${JOB}'
    `)).rows[0];
    expect(job).toEqual({
      status: 'retry',
      lease_token: null,
      locked_at: null,
      completed_at: null,
    });
    expect((await db.query(`
      select status from public.deletion_requests where id = '${REQUEST}'
    `)).rows[0].status).toBe('processing');
  });

  it('claims late IDs and checkpoints a worker-discovered customer without losing its lease', async () => {
    await requeue({ customer: null });
    const claimed = (await claimCleanup()).find((row) => row.job_id === JOB);
    expect(claimed.late_stripe_subscription_ids).toEqual(['sub_late']);
    expect(claimed.late_stripe_customer_ids).toEqual([]);
    const beforeRevision = claimed.late_billing_revision;

    const checkpoint = await db.query(
      `select public.checkpoint_account_deletion_billing_identity(
         $1::uuid, $2::uuid, null, 'cus_from_subscription'
       ) as result`,
      [claimed.job_id, claimed.lease_token],
    );
    expect(checkpoint.rows[0].result).toMatchObject({
      ok: true,
      job_id: JOB,
      lease_token: claimed.lease_token,
      late_billing_revision: beforeRevision + 1,
      late_stripe_customer_ids: ['cus_from_subscription'],
    });

    const duplicate = await db.query(
      `select public.checkpoint_account_deletion_billing_identity(
         $1::uuid, $2::uuid, null, 'cus_from_subscription'
       ) as result`,
      [claimed.job_id, claimed.lease_token],
    );
    expect(duplicate.rows[0].result.late_billing_revision)
      .toBe(beforeRevision + 1);
  });

  it('completion requires exact late arrays/revision, clears obligations, and retains resolvable history', async () => {
    await requeue();
    const claimed = (await claimCleanup()).find((row) => row.job_id === JOB);
    expect(await complete(claimed, {
      revision: claimed.late_billing_revision + 1,
    })).toBe(false);

    expect(await complete(claimed)).toBe(true);
    const finished = (await db.query(`
      select status, late_stripe_subscription_ids, late_stripe_customer_ids,
             known_stripe_subscription_ids, known_stripe_customer_ids,
             late_billing_revision
        from public.account_deletion_cleanup_jobs where id = '${JOB}'
    `)).rows[0];
    expect(finished.status).toBe('done');
    expect(finished.late_stripe_subscription_ids).toEqual([]);
    expect(finished.late_stripe_customer_ids).toEqual([]);
    expect(finished.known_stripe_subscription_ids)
      .toEqual(expect.arrayContaining(['sub_old', 'sub_surv', 'sub_late']));
    expect(finished.known_stripe_customer_ids)
      .toEqual(expect.arrayContaining(['cus_old', 'cus_surv', 'cus_late']));
    expect(finished.late_billing_revision)
      .toBe(claimed.late_billing_revision + 1);

    const resolved = await db.query(`
      select public.resolve_account_deletion_user_by_stripe_billing(
        'sub_late', 'cus_late'
      ) as result
    `);
    expect(resolved.rows[0].result).toEqual({
      ok: true,
      user_id: DELETED,
      job_id: JOB,
    });
  });

  it('a late requeue invalidates the old lease so completion cannot lose the new ID', async () => {
    await requeue();
    const claimed = (await claimCleanup()).find((row) => row.job_id === JOB);
    await requeue({
      subscription: 'sub_after_claim',
      customer: 'cus_after_claim',
    });
    expect(await complete(claimed)).toBe(false);

    const reclaimed = (await claimCleanup()).find((row) => row.job_id === JOB);
    expect(reclaimed.lease_token).not.toBe(claimed.lease_token);
    expect(reclaimed.late_stripe_subscription_ids)
      .toEqual(expect.arrayContaining(['sub_late', 'sub_after_claim']));
    expect(reclaimed.late_stripe_customer_ids)
      .toEqual(expect.arrayContaining(['cus_late', 'cus_after_claim']));
  });

  it('deleted-billing resolver fails closed when one Stripe identity maps to two users', async () => {
    await requeue({
      user: DELETED,
      subscription: null,
      customer: 'cus_ambiguous',
    });
    await requeue({
      user: OTHER_DELETED,
      subscription: null,
      customer: 'cus_ambiguous',
    });
    const result = await db.query(`
      select public.resolve_account_deletion_user_by_stripe_billing(
        null, 'cus_ambiguous'
      ) as result
    `);
    expect(result.rows[0].result).toEqual({
      ok: false,
      reason: 'ambiguous',
    });
  });

  it('late-billing mutation and identity RPCs are service-role-only', async () => {
    const { rows } = await db.query(`
      select
        has_function_privilege(
          'service_role',
          'public.requeue_account_deletion_cleanup_for_late_billing(uuid,text,text,text)',
          'EXECUTE'
        ) as service_requeue,
        has_function_privilege(
          'authenticated',
          'public.requeue_account_deletion_cleanup_for_late_billing(uuid,text,text,text)',
          'EXECUTE'
        ) as user_requeue,
        has_function_privilege(
          'service_role',
          'public.checkpoint_account_deletion_billing_identity(uuid,uuid,text,text)',
          'EXECUTE'
        ) as service_checkpoint,
        has_function_privilege(
          'authenticated',
          'public.resolve_account_deletion_user_by_stripe_billing(text,text)',
          'EXECUTE'
        ) as user_resolver
    `);
    expect(rows[0]).toEqual({
      service_requeue: true,
      user_requeue: false,
      service_checkpoint: true,
      user_resolver: false,
    });

    await asRole('authenticated');
    await expect(db.query(`
      select public.requeue_account_deletion_cleanup_for_late_billing(
        '${DELETED}', 'sub_forbidden', null, 'forbidden'
      )
    `)).rejects.toThrow(/service-role only/);
  });
});
