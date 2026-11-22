/**
 * Net-current account-deletion lifecycle (migration 175).
 *
 * This applies the COMPLETE migration to PGlite — including backfill, grants,
 * dispatcher, and exception-safe extension/schedule blocks — so syntax or
 * statement-order drift cannot hide behind a regex-only contract test.
 * Negative controls prove completion cannot bypass the auth/linkage checkpoints
 * and no client role can mutate the service-owned queue.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/175_account_deletion_cleanup_queue.sql',
);
const migration = readFileSync(migrationPath, 'utf8');
let db;

const ADMIN = '11111111-1111-1111-1111-111111111111';
const BACKFILLED = '22222222-2222-2222-2222-222222222222';
const NEW_USER = '33333333-3333-3333-3333-333333333333';
const ORPHANED_SOFT_DELETE = '44444444-4444-4444-4444-444444444444';
const BACKFILLED_REQUEST = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const NEW_REQUEST = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;

    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    create table auth.users (id uuid primary key);

    create table public.profiles (
      id uuid primary key references auth.users(id),
      role text not null default 'user',
      display_name text,
      email text,
      deleted_at timestamptz,
      disabled_at timestamptz,
      stripe_subscription_id text,
      stripe_customer_id text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    create table public.deletion_requests (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references auth.users(id) on delete cascade,
      email text,
      requested_at timestamptz not null default now(),
      status text not null default 'requested'
        check (status in ('requested', 'processing', 'done', 'cancelled')),
      processed_by uuid references auth.users(id) on delete set null,
      processed_at timestamptz,
      created_at timestamptz not null default now()
    );
    create table public.audit_log (
      id uuid primary key default gen_random_uuid(),
      actor_id uuid,
      actor_role text,
      target_user_id uuid,
      target_type text,
      target_id text,
      action text not null,
      reason text,
      before_state jsonb,
      after_state jsonb,
      was_destructive boolean not null default false,
      was_reversible boolean not null default true,
      user_notified boolean not null default false,
      created_at timestamptz not null default now()
    );
    create table public.system_config (
      key text primary key,
      value jsonb not null,
      updated_by uuid,
      updated_at timestamptz not null default now()
    );
    create table public.surveyor_entitlements (
      user_id uuid primary key references auth.users(id),
      status text not null default 'active',
      source text,
      granted_at timestamptz not null default now(),
      revoked_at timestamptz,
      stripe_subscription_id text,
      stripe_customer_id text
    );
    create table public.surveyor_byok_keys (
      user_id uuid not null references auth.users(id),
      provider text not null default 'anthropic',
      ciphertext bytea not null,
      created_at timestamptz not null default now(),
      rotated_at timestamptz not null default now(),
      primary key (user_id, provider)
    );

    create or replace function public.has_role(p_user_id uuid, p_roles text[])
    returns boolean language sql stable set search_path = public, pg_temp as $fn$
      select exists (
        select 1 from public.profiles
         where id = p_user_id and role = any(p_roles)
      )
    $fn$;
    create or replace function public.mask_email(p_email text)
    returns text language sql immutable as $fn$
      select case when p_email is null then null
        else left(split_part(p_email, '@', 1), 1) || '***@' || split_part(p_email, '@', 2)
      end
    $fn$;
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
    ) returns uuid language plpgsql security definer set search_path = public, pg_temp as $fn$
    declare v_id uuid;
    begin
      insert into public.audit_log (
        actor_id, actor_role, target_user_id, target_type, target_id, action,
        reason, before_state, after_state, was_destructive, was_reversible,
        user_notified
      ) values (
        p_actor_id,
        (select role from public.profiles where id = p_actor_id),
        p_target_user_id, p_target_type, p_target_id, p_action, p_reason,
        p_before, p_after, p_was_destructive, p_was_reversible, p_user_notified
      ) returning id into v_id;
      return v_id;
    end $fn$;

    insert into auth.users (id) values
      ('${ADMIN}'), ('${BACKFILLED}'), ('${NEW_USER}'), ('${ORPHANED_SOFT_DELETE}');
    insert into public.profiles (
      id, role, display_name, email, deleted_at, disabled_at,
      stripe_subscription_id, stripe_customer_id
    ) values
      ('${ADMIN}', 'admin', 'Admin', 'admin@example.com', null, null, null, null),
      ('${BACKFILLED}', 'user', null, null, now() - interval '3 days',
       now() - interval '3 days', 'sub-old', 'cus-old'),
      ('${NEW_USER}', 'user', 'Alice', 'alice@example.com', null, null, 'sub-new', 'cus-new'),
      ('${ORPHANED_SOFT_DELETE}', 'user', null, null, now() - interval '4 days',
       now() - interval '4 days', null, null);
    insert into public.deletion_requests (
      id, user_id, email, requested_at, status, processed_by, processed_at
    ) values (
      '${BACKFILLED_REQUEST}', '${BACKFILLED}', null, now() - interval '10 days',
      'done', '${ADMIN}', now() - interval '3 days'
    );
    insert into public.audit_log (
      actor_id, actor_role, target_user_id, target_type, target_id, action,
      was_destructive, was_reversible, user_notified
    ) values (
      '${ADMIN}', 'admin', '${BACKFILLED}', 'deletion_request',
      '${BACKFILLED_REQUEST}', 'process_deletion', true, false, true
    );
    insert into public.surveyor_entitlements (
      user_id, status, source, stripe_subscription_id, stripe_customer_id
    ) values (
      '${NEW_USER}', 'active', 'subscription', 'sub-surveyor', 'cus-new'
    );
    insert into public.surveyor_byok_keys (user_id, ciphertext)
    values ('${NEW_USER}', decode('010203', 'hex'));
  `);

  // Whole-file apply: pg_net/pg_cron are absent in PGlite, and the migration's
  // guarded notices must keep that environment green.
  await db.exec(migration);
}, 60_000);

describe('migration 175 durable account-deletion queue', () => {
  it('full migration applied and seeded an inert cron config', async () => {
    const { rows } = await db.query(`
      select value from public.system_config where key = 'account_deletion_cron'
    `);
    expect(rows).toHaveLength(1);
    expect(rows[0].value.enabled).toBe(true);
    expect(rows[0].value.url).toBeNull();
    expect(rows[0].value.secret).toBeNull();
    const verdict = await db.query(`
      select public._account_deletion_cron_should_dispatch(
        '{"enabled":true,"url":null,"secret":null}'::jsonb
      ) as v
    `);
    expect(verdict.rows[0].v).toBe('not_configured');
  });

  it('backfills formerly-done soft deletions and suppresses duplicate audit', async () => {
    const request = await db.query(`
      select status from public.deletion_requests where id = '${BACKFILLED_REQUEST}'
    `);
    expect(request.rows[0].status).toBe('processing');
    const queued = await db.query(`
      select status, audit_required
        from public.account_deletion_cleanup_jobs
       where deletion_request_id = '${BACKFILLED_REQUEST}'
    `);
    expect(queued.rows).toEqual([{ status: 'pending', audit_required: false }]);
  });

  it('creates a synthetic processing request/job for an orphaned soft-deleted profile', async () => {
    const { rows } = await db.query(`
      select dr.status request_status, j.status job_status, j.audit_required
        from public.deletion_requests dr
        join public.account_deletion_cleanup_jobs j on j.deletion_request_id = dr.id
       where dr.user_id = '${ORPHANED_SOFT_DELETE}'
    `);
    expect(rows).toEqual([{
      request_status: 'processing',
      job_status: 'pending',
      audit_required: true,
    }]);
  });

  it('atomically anonymises and queues a due request without falsely marking it done', async () => {
    await db.exec(`
      insert into public.deletion_requests (id, user_id, email, requested_at, status)
      values (
        '${NEW_REQUEST}', '${NEW_USER}', 'alice@example.com',
        now() - interval '10 days', 'requested'
      )
    `);
    const result = await db.query(`
      select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r
    `);
    expect(result.rows[0].r.queued).toBe(1);

    const request = await db.query(`
      select status, email from public.deletion_requests where id = '${NEW_REQUEST}'
    `);
    expect(request.rows[0]).toEqual({ status: 'processing', email: null });
    const profile = await db.query(`
      select display_name, email, deleted_at, disabled_at
        from public.profiles where id = '${NEW_USER}'
    `);
    expect(profile.rows[0].display_name).toBeNull();
    expect(profile.rows[0].email).toBeNull();
    expect(profile.rows[0].deleted_at).not.toBeNull();
    expect(profile.rows[0].disabled_at).not.toBeNull();
    const queued = await db.query(`
      select status, auth_revoked_at
        from public.account_deletion_cleanup_jobs
       where deletion_request_id = '${NEW_REQUEST}'
    `);
    expect(queued.rows[0]).toEqual({ status: 'pending', auth_revoked_at: null });
    const audit = await db.query(`
      select count(*)::int n from public.audit_log
       where target_id = '${NEW_REQUEST}' and action = 'process_deletion'
    `);
    expect(audit.rows[0].n).toBe(0);
  });

  it('requires auth checkpoint + unchanged inspected linkage before final completion', async () => {
    const claim = await db.query(`
      select * from public.claim_account_deletion_cleanup_jobs(20, 30)
       where deletion_request_id = '${NEW_REQUEST}'::uuid
    `);
    expect(claim.rows).toHaveLength(1);
    const row = claim.rows[0];

    let complete = await db.query(`
      select public.complete_account_deletion_cleanup_job(
        '${row.job_id}'::uuid, '${row.lease_token}'::uuid,
        'sub-new', 'cus-new', 'sub-surveyor', 'cus-new'
      ) as ok
    `);
    expect(complete.rows[0].ok).toBe(false);

    const marked = await db.query(`
      select public.mark_account_deletion_auth_revoked(
        '${row.job_id}'::uuid, '${row.lease_token}'::uuid
      ) as ok
    `);
    expect(marked.rows[0].ok).toBe(true);

    complete = await db.query(`
      select public.complete_account_deletion_cleanup_job(
        '${row.job_id}'::uuid, '${row.lease_token}'::uuid,
        'different-sub', 'cus-new', 'sub-surveyor', 'cus-new'
      ) as ok
    `);
    expect(complete.rows[0].ok).toBe(false);
    const retained = await db.query(`
      select stripe_subscription_id, stripe_customer_id
        from public.profiles where id = '${NEW_USER}'
    `);
    expect(retained.rows[0]).toEqual({
      stripe_subscription_id: 'sub-new',
      stripe_customer_id: 'cus-new',
    });

    complete = await db.query(`
      select public.complete_account_deletion_cleanup_job(
        '${row.job_id}'::uuid, '${row.lease_token}'::uuid,
        'sub-new', 'cus-new', 'sub-surveyor', 'cus-new'
      ) as ok
    `);
    expect(complete.rows[0].ok).toBe(true);
    const final = await db.query(`
      select dr.status request_status, j.status job_status,
             p.stripe_subscription_id, p.stripe_customer_id,
             se.status surveyor_status,
             se.stripe_subscription_id surveyor_subscription_id,
             se.stripe_customer_id surveyor_customer_id
        from public.deletion_requests dr
        join public.account_deletion_cleanup_jobs j on j.deletion_request_id = dr.id
        join public.profiles p on p.id = dr.user_id
        left join public.surveyor_entitlements se on se.user_id = dr.user_id
       where dr.id = '${NEW_REQUEST}'
    `);
    expect(final.rows[0]).toEqual({
      request_status: 'done',
      job_status: 'done',
      stripe_subscription_id: null,
      stripe_customer_id: null,
      surveyor_status: 'revoked',
      surveyor_subscription_id: null,
      surveyor_customer_id: null,
    });
    const byok = await db.query(`
      select count(*)::int n from public.surveyor_byok_keys where user_id = '${NEW_USER}'
    `);
    expect(byok.rows[0].n).toBe(0);
    const audit = await db.query(`
      select actor_id, before_state, was_destructive, was_reversible,
             user_notified, after_state
        from public.audit_log
       where target_id = '${NEW_REQUEST}' and action = 'process_deletion'
    `);
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0].actor_id).toBe(ADMIN);
    expect(audit.rows[0].before_state.email_masked).toBe('a***@example.com');
    expect(JSON.stringify(audit.rows[0])).not.toContain('alice@example.com');
    expect(audit.rows[0].was_destructive).toBe(true);
    expect(audit.rows[0].was_reversible).toBe(false);
    expect(audit.rows[0].user_notified).toBe(true);
    expect(audit.rows[0].after_state.auth_revoked).toBe(true);
    expect(audit.rows[0].after_state.billing_canceled).toBe(true);
  });

  it('persists partial auth progress and reclaims both retry and stale leases', async () => {
    const leased = await db.query(`
      select id, lease_token, attempts
        from public.account_deletion_cleanup_jobs
       where deletion_request_id = '${BACKFILLED_REQUEST}'
    `);
    expect(leased.rows[0].lease_token).not.toBeNull();
    const firstLease = leased.rows[0].lease_token;

    const marked = await db.query(`
      select public.mark_account_deletion_auth_revoked(
        '${leased.rows[0].id}'::uuid, '${firstLease}'::uuid
      ) as ok
    `);
    expect(marked.rows[0].ok).toBe(true);
    const failed = await db.query(`
      select public.fail_account_deletion_cleanup_job(
        '${leased.rows[0].id}'::uuid, '${firstLease}'::uuid,
        'stripe outage', 30
      ) as ok
    `);
    expect(failed.rows[0].ok).toBe(true);
    await db.exec(`
      update public.account_deletion_cleanup_jobs
         set next_attempt_at = now() - interval '1 second'
       where id = '${leased.rows[0].id}'
    `);

    const retried = await db.query(`
      select * from public.claim_account_deletion_cleanup_jobs(1, 30)
    `);
    expect(retried.rows).toHaveLength(1);
    expect(retried.rows[0].job_id).toBe(leased.rows[0].id);
    expect(retried.rows[0].lease_token).not.toBe(firstLease);
    expect(retried.rows[0].attempts).toBe(leased.rows[0].attempts + 1);
    expect(retried.rows[0].auth_revoked_at).not.toBeNull();

    const retryLease = retried.rows[0].lease_token;
    await db.exec(`
      update public.account_deletion_cleanup_jobs
         set locked_at = now() - interval '2 hours'
       where id = '${leased.rows[0].id}'
    `);
    const reclaimed = await db.query(`
      select * from public.claim_account_deletion_cleanup_jobs(1, 30)
    `);
    expect(reclaimed.rows).toHaveLength(1);
    expect(reclaimed.rows[0].lease_token).not.toBe(retryLease);
    expect(reclaimed.rows[0].attempts).toBe(retried.rows[0].attempts + 1);
    expect(reclaimed.rows[0].auth_revoked_at).not.toBeNull();

    const completed = await db.query(`
      select public.complete_account_deletion_cleanup_job(
        '${leased.rows[0].id}'::uuid, '${reclaimed.rows[0].lease_token}'::uuid,
        'sub-old', 'cus-old', null, null
      ) as ok
    `);
    expect(completed.rows[0].ok).toBe(true);
    const audits = await db.query(`
      select action, count(*)::int n
        from public.audit_log
       where target_id = '${BACKFILLED_REQUEST}'
       group by action order by action
    `);
    expect(audits.rows).toEqual([
      { action: 'complete_deletion_external_cleanup', n: 1 },
      { action: 'process_deletion', n: 1 },
    ]);
  });

  it('all queue mutation RPCs are service-role-only', async () => {
    const { rows } = await db.query(`
      select
        has_table_privilege('service_role', 'public.account_deletion_cleanup_jobs', 'SELECT') service_table,
        has_table_privilege('authenticated', 'public.account_deletion_cleanup_jobs', 'SELECT') user_table,
        has_function_privilege('service_role', 'public.claim_account_deletion_cleanup_jobs(integer,integer)', 'EXECUTE') service_claim,
        has_function_privilege('authenticated', 'public.claim_account_deletion_cleanup_jobs(integer,integer)', 'EXECUTE') user_claim,
        has_function_privilege('service_role', 'public.complete_account_deletion_cleanup_job(uuid,uuid,text,text,text,text)', 'EXECUTE') service_complete,
        has_function_privilege('authenticated', 'public.complete_account_deletion_cleanup_job(uuid,uuid,text,text,text,text)', 'EXECUTE') user_complete
    `);
    expect(rows[0]).toEqual({
      service_table: true,
      user_table: false,
      service_claim: true,
      user_claim: false,
      service_complete: true,
      user_complete: false,
    });
  });
});

describe('migration 175 static dispatcher replacement contract', () => {
  it('unschedules the old direct SQL cron and schedules only the Edge dispatcher', () => {
    expect(migration).toMatch(/jobname in \('account-deletions-daily', 'account-deletion-cleanup-hourly'\)/);
    expect(migration).toMatch(
      /cron\.schedule\([\s\S]*?'account-deletion-cleanup-hourly'[\s\S]*?select public\.run_account_deletion_cleanup\(\)/,
    );
    expect(migration).not.toMatch(
      /cron\.schedule\([\s\S]*?select public\.process_account_deletions\(null/,
    );
  });
});
