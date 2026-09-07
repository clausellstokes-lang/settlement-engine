/**
 * Migration 194 execution contract: private Operator Messages, explicit product
 * email consent, lazy broadcast receipts, lease-safe delivery, durable consent
 * history, moderation atomics, support ownership links, and deletion purging.
 */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const BOOT_TIMEOUT = 180_000;
const MIG_126 = resolve(process.cwd(), 'supabase/migrations/126_email_preferences.sql');
const MIG_194 = resolve(process.cwd(), 'supabase/migrations/194_operator_messages.sql');
const have = existsSync(MIG_126) && existsSync(MIG_194);

const ADMIN = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const USER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const LATE = '33333333-3333-4333-8333-333333333333';
const WRONG_LEASE = '99999999-9999-4999-8999-999999999999';
const PAGE_USERS = Array.from(
  { length: 7 },
  (_, index) => `44444444-4444-4444-8444-${String(index + 1).padStart(12, '0')}`,
);
const PAGE_USER_SQL = PAGE_USERS.map((id) => `'${id}'`).join(',');

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid ?? ''}';`);
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;

async function direct(target = USER, messageClass = 'service', subject = 'Account notice') {
  const template = messageClass === 'announcement' ? 'custom_announcement' : 'custom_service';
  return one(`select public.create_operator_direct_message(
    '${ADMIN}', '${target}', '${messageClass}', '${subject}', 'Please review this notice.', '${template}'
  ) as result`);
}

async function queue(messageClass = 'service', subject = 'Realm service notice') {
  const template = messageClass === 'announcement' ? 'product_update' : 'service_notice';
  return one(`select public.queue_operator_broadcast(
    '${ADMIN}', '${messageClass}', '${subject}', 'A message for every existing account.',
    '${template}', 'all', 10
  ) as result`);
}

async function makeClaimable(messageId) {
  await db.query(`update public.operator_messages set send_after = now() - interval '1 second' where id = $1`, [messageId]);
  await db.query(`update public.operator_message_delivery_jobs set next_attempt_at = now() - interval '1 second' where message_id = $1`, [messageId]);
}

describe('operator-message migration fixtures exist', () => {
  it('has both the preference base and migration 194', () => {
    expect(have).toBe(true);
  });
});

describe.runIf(have)('migration 194 Operator Messages — real SQL', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create schema if not exists extensions;
      create table auth.users (id uuid primary key, email text);
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      do $roles$ begin
        if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
        if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
        if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if;
        if not exists (select 1 from pg_roles where rolname='operator_attack') then create role operator_attack nologin; end if;
      end $roles$;
      grant usage on schema public, auth to anon, authenticated, service_role, operator_attack;

      create table public.profiles (
        id uuid primary key references auth.users(id) on delete cascade,
        role text not null default 'user',
        email text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        telemetry_consent jsonb not null default
          '{"essential":true,"research":true,"ai_prose":false,"market":false}'::jsonb,
        disabled_at timestamptz,
        banned_at timestamptz,
        deleted_at timestamptz
      );
      create table public.system_config (
        key text primary key, value jsonb not null, updated_at timestamptz not null default now()
      );
      create table public.warnings (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id),
        issued_by uuid references auth.users(id),
        severity text not null,
        reason text not null,
        user_notified boolean not null default false,
        created_at timestamptz not null default now()
      );
      create table public.audit_log (
        id uuid primary key default gen_random_uuid(), action text not null,
        actor_id uuid, target_user_id uuid, target_type text, target_id text,
        after_state jsonb, created_at timestamptz not null default now()
      );
      create table public.support_messages (
        id uuid primary key default gen_random_uuid(),
        user_id uuid references auth.users(id), email text not null,
        subject text not null, message text not null, status text not null default 'new',
        ticket_number text default 'SF-TEST', category text not null default 'general',
        priority text not null default 'normal', settlement_id uuid, campaign_id uuid,
        map_id uuid, payment_ref text, pdf_ref text, generation_ref text,
        gallery_ref text, metadata jsonb not null default '{}'::jsonb
      );
      create or replace function public.has_role(p_uid uuid, p_roles text[])
      returns boolean language sql stable security definer set search_path=public,pg_temp as $fn$
        select exists(select 1 from public.profiles where id=p_uid and role=any(p_roles))
      $fn$;
      create or replace function public.account_is_active(p_uid uuid)
      returns boolean language sql stable security definer set search_path=public,pg_temp as $fn$
        select exists(select 1 from public.profiles where id=p_uid and disabled_at is null and banned_at is null and deleted_at is null)
      $fn$;
      create or replace function public.write_audit(
        p_action text, p_target_user_id uuid default null, p_target_type text default null,
        p_target_id text default null, p_reason text default null, p_before jsonb default null,
        p_after jsonb default null, p_was_destructive boolean default false,
        p_was_reversible boolean default true, p_user_notified boolean default false,
        p_actor_id uuid default null
      ) returns uuid language plpgsql security definer set search_path=public,pg_temp as $fn$
      declare v_id uuid;
      begin
        insert into public.audit_log(action,actor_id,target_user_id,target_type,target_id,after_state)
        values(p_action,p_actor_id,p_target_user_id,p_target_type,p_target_id,p_after)
        returning id into v_id;
        return v_id;
      end $fn$;
      create or replace function public.issue_warning(
        p_actor uuid,p_target uuid,p_severity text,p_reason text,p_notified boolean default false
      ) returns uuid language sql security definer as $fn$ select gen_random_uuid() $fn$;
      create or replace function public.set_account_banned(
        p_actor uuid,p_target uuid,p_banned boolean,p_reason text default null
      ) returns jsonb language sql security definer as $fn$ select jsonb_build_object('banned',p_banned) $fn$;
      grant execute on function public.issue_warning(uuid,uuid,text,text,boolean) to service_role;
      grant execute on function public.set_account_banned(uuid,uuid,boolean,text) to service_role;

      insert into auth.users(id,email) values
        ('${ADMIN}','admin@example.com'), ('${USER}','user@example.com'), ('${OTHER}','other@example.com');
      insert into public.profiles(id,role,email,created_at) values
        ('${ADMIN}','admin','admin@example.com',now()-interval '3 days'),
        ('${USER}','user','user@example.com',now()-interval '2 days'),
        ('${OTHER}','user','other@example.com',now()-interval '1 day');
    `);
    await db.exec(readFileSync(MIG_126, 'utf8'));
    await db.exec(readFileSync(MIG_194, 'utf8'));
  }, BOOT_TIMEOUT);

  beforeEach(async () => {
    await db.exec(`
      truncate public.support_messages, public.warnings, public.audit_log,
        public.operator_message_receipts, public.operator_message_delivery_jobs,
        public.operator_messages, public.consent_change_records, public.email_preferences cascade;
      delete from public.profiles where id = any(array[${PAGE_USER_SQL}]::uuid[]);
      delete from auth.users where id = any(array[${PAGE_USER_SQL}]::uuid[]);
      delete from public.profiles where id='${LATE}';
      delete from auth.users where id='${LATE}';
      update public.profiles set disabled_at=null,banned_at=null,deleted_at=null,
        email=case id when '${ADMIN}' then 'admin@example.com'
                      when '${USER}' then 'user@example.com' else 'other@example.com' end,
        telemetry_consent='{"essential":true,"research":true,"ai_prose":false,"market":false}'::jsonb;
      truncate public.consent_change_records;
    `);
    await asUser(USER);
  });

  it('keeps every new table RLS-on with zero policies and makes token unsubscribe edge-only', async () => {
    const tableNames = [
      'operator_messages', 'operator_message_receipts',
      'operator_message_delivery_jobs', 'consent_change_records',
    ];
    for (const table of tableNames) {
      expect((await one(`select relrowsecurity from pg_class where oid='public.${table}'::regclass`)).relrowsecurity).toBe(true);
      expect((await one(`select count(*)::int n from pg_policies where schemaname='public' and tablename=$1`, [table])).n).toBe(0);
    }
    const grants = await one(`select
      has_function_privilege('anon','public.unsubscribe_via_token(uuid,text)','execute') as anon,
      has_function_privilege('authenticated','public.unsubscribe_via_token(uuid,text)','execute') as authed,
      has_function_privilege('service_role','public.unsubscribe_via_token(uuid,text)','execute') as service`);
    expect(grants).toEqual({ anon: false, authed: false, service: true });
    const workerGrants = await one(`select
      has_function_privilege('authenticated','public.renew_operator_message_delivery_job_lease(uuid,uuid,integer)','execute') as renew_authed,
      has_function_privilege('service_role','public.renew_operator_message_delivery_job_lease(uuid,uuid,integer)','execute') as renew_service,
      has_function_privilege('authenticated','public.claim_operator_message_recipient(uuid,uuid,uuid)','execute') as claim_authed,
      has_function_privilege('service_role','public.claim_operator_message_recipient(uuid,uuid,uuid)','execute') as claim_service,
      has_function_privilege('authenticated','public.record_operator_message_delivery_result(uuid,uuid,uuid,uuid,text,text,text,text)','execute') as result_authed,
      has_function_privilege('service_role','public.record_operator_message_delivery_result(uuid,uuid,uuid,uuid,text,text,text,text)','execute') as result_service`);
    expect(workerGrants).toEqual({
      renew_authed: false, renew_service: true,
      claim_authed: false, claim_service: true,
      result_authed: false, result_service: true,
    });
  });

  it('creates a direct message and receipt atomically; own-data RPCs cannot cross accounts', async () => {
    const created = (await direct()).result;
    expect(created.message_id).toBeTruthy();
    expect((await one(`select count(*)::int n from public.operator_message_receipts where message_id=$1`, [created.message_id])).n).toBe(1);

    await asUser(OTHER);
    expect(await rows(`select * from public.get_my_operator_message('${created.message_id}')`)).toEqual([]);
    expect(await rows(`select * from public.mark_operator_message_read('${created.message_id}')`)).toEqual([]);
    await asUser(USER);
    expect((await one('select public.get_my_operator_unread_count() as n')).n).toBe(1);
    const read = await one(`select * from public.mark_operator_message_read('${created.message_id}')`);
    expect(read.read_at).toBeTruthy();
    expect((await one('select public.get_my_operator_unread_count() as n')).n).toBe(0);
  });

  it('uses a complete inbox keyset cursor so equal-timestamp peers are never skipped', async () => {
    const firstId = (await direct(USER, 'service', 'Peer one')).result.message_id;
    const secondId = (await direct(USER, 'service', 'Peer two')).result.message_id;
    const peerTime = '2026-01-02T03:04:05.000Z';
    await db.query(`update public.operator_messages set created_at=$1
      where id = any($2::uuid[])`, [peerTime, [firstId, secondId]]);

    const firstPage = await rows('select * from public.list_my_operator_messages(1,null,null)');
    expect(firstPage).toHaveLength(1);
    expect([firstId, secondId]).toContain(firstPage[0].id);
    const secondPage = await rows(
      'select * from public.list_my_operator_messages(1,$1,$2)',
      [peerTime, firstPage[0].id],
    );
    expect(secondPage).toHaveLength(1);
    expect(secondPage[0].id).not.toBe(firstPage[0].id);
    expect(new Set([firstPage[0].id, secondPage[0].id])).toEqual(new Set([firstId, secondId]));
    expect(await rows(
      'select * from public.list_my_operator_messages(1,$1,$2)',
      [peerTime, secondPage[0].id],
    )).toEqual([]);
    await expect(db.query(
      'select * from public.list_my_operator_messages(1,$1,null)', [peerTime],
    )).rejects.toThrow(/cursor must be wholly null or wholly present/i);
    await expect(db.query(
      `select * from public.list_my_operator_messages(1,null,'${firstId}')`,
    )).rejects.toThrow(/cursor must be wholly null or wholly present/i);
  });

  it('enforces the closed template-to-class map at both RPC and table boundaries', async () => {
    await expect(db.query(`select public.create_operator_direct_message(
      '${ADMIN}','${USER}','service','Disguised marketing','Body','product_update'
    )`)).rejects.toThrow(/requires class announcement/i);
    await expect(db.query(`select public.create_operator_direct_message(
      '${ADMIN}','${USER}','service','Unknown template','Body','future_campaign_offer'
    )`)).rejects.toThrow(/unknown operator message template/i);
    await expect(db.query(`insert into public.operator_messages(
      kind,message_class,sender_role,sender_user_id,recipient_user_id,
      subject,body,template_key,status,sent_at
    ) values (
      'direct','service','admin','${ADMIN}','${USER}',
      'Constraint check','Body','product_update','sent',now()
    )`)).rejects.toThrow(/operator_messages_template_class_check/i);
  });

  it('keeps pre-migration/default product flags inert until an explicit decision', async () => {
    await db.query(`insert into public.email_preferences(user_id,product_updates) values('${USER}',true)`);
    expect((await one(`select public.can_email_user('${USER}','product_updates') as allowed`)).allowed).toBe(false);
    expect((await one('select * from public.get_my_email_preferences()')).product_updates).toBe(false);
    await db.query(`select public.set_my_email_preference('${USER}','product_updates',true)`);
    expect((await one(`select public.can_email_user('${USER}','product_updates') as allowed`)).allowed).toBe(true);
    const stored = await one(`select product_updates,product_updates_decided_at from public.email_preferences where user_id='${USER}'`);
    expect(stored.product_updates).toBe(true);
    expect(stored.product_updates_decided_at).toBeTruthy();
  });

  it('binds preference and telemetry mutations to the preflighted account owner', async () => {
    expect((await one(`select
      to_regprocedure('public.set_my_email_preference(text,boolean)') is null as old_preference_gone`)).old_preference_gone).toBe(true);
    await expect(db.query(`select public.set_my_email_preference(
      '${OTHER}','product_updates',true)`)).rejects.toThrow(/auth session changed/i);
    expect((await one(`select count(*)::int n from public.email_preferences`)).n).toBe(0);

    const before = (await one(`select telemetry_consent from public.profiles where id='${OTHER}'`)).telemetry_consent;
    await expect(db.query(`select public.set_my_telemetry_consent(
      '${OTHER}','{"essential":false,"research":false,"ai_prose":true,"market":true,"v":2}','account'
    )`)).rejects.toThrow(/auth session changed/i);
    expect((await one(`select telemetry_consent from public.profiles where id='${OTHER}'`)).telemetry_consent).toEqual(before);
    expect((await one(`select count(*)::int n from public.consent_change_records where user_id='${OTHER}'`)).n).toBe(0);
  });

  it('one-click product unsubscribe is opt-out-only and stamps decision provenance', async () => {
    await db.query(`insert into public.email_preferences(user_id,product_updates,product_updates_decided_at)
      values('${USER}',true,now())`);
    const token = (await one(`select unsubscribe_token from public.email_preferences where user_id='${USER}'`)).unsubscribe_token;
    expect((await one(`select public.unsubscribe_via_token('${token}','product_updates') as ok`)).ok).toBe(true);
    const stored = await one(`select product_updates,product_updates_decided_at from public.email_preferences where user_id='${USER}'`);
    expect(stored.product_updates).toBe(false);
    expect(stored.product_updates_decided_at).toBeTruthy();
  });

  it('writes one typed consent row per changed toggle and records direct-write backstops', async () => {
    const result = (await one(`select public.set_my_telemetry_consent(
      '${USER}','{"essential":true,"research":false,"ai_prose":true,"market":true,"v":2}', 'account'
    ) as value`)).value;
    expect(result.changed_keys.sort()).toEqual(['ai_prose', 'market', 'research']);
    let history = await rows(`select consent_key,source from public.consent_change_records where user_id='${USER}' order by consent_key`);
    expect(history).toEqual([
      { consent_key: 'ai_prose', source: 'account' },
      { consent_key: 'market', source: 'account' },
      { consent_key: 'research', source: 'account' },
    ]);
    await db.query(`update public.profiles set telemetry_consent=
      '{"essential":false,"research":false,"ai_prose":true,"market":true,"v":2}' where id='${USER}'`);
    history = await rows(`select consent_key,source from public.consent_change_records where user_id='${USER}' order by created_at,id`);
    expect(history.at(-1)).toEqual({ consent_key: 'essential', source: 'system' });
  });

  it('queues one shared broadcast with zero eager receipts, then Account releases it without the email worker', async () => {
    const queued = (await queue()).result;
    expect(queued.audience_count).toBe(3);
    expect((await one(`select count(*)::int n from public.operator_message_receipts`)).n).toBe(0);
    expect(await rows('select * from public.list_my_operator_messages()')).toEqual([]);
    // The courier is intentionally disabled by default. Crossing send_after is
    // sufficient for Account authority; no worker claim/status change is needed.
    await db.query(`update public.operator_messages set send_after=now()-interval '1 second' where id=$1`, [queued.message_id]);
    const inbox = await rows('select * from public.list_my_operator_messages()');
    expect(inbox).toHaveLength(1);
    expect(inbox[0].kind).toBe('broadcast');
    expect((await one(`select count(*)::int n from public.operator_messages where kind='broadcast'`)).n).toBe(1);
    await expect(db.query(
      `select public.cancel_operator_broadcast('${ADMIN}','${queued.message_id}')`,
    )).rejects.toThrow(/not cancelable/i);
  });

  it('claims a bounded stable audience page, enforces its lease, and excludes later signups', async () => {
    await db.query(`insert into public.email_preferences(user_id,product_updates,product_updates_decided_at)
      values('${USER}',true,now())`);
    const queued = (await queue('announcement', 'Product news')).result;
    await db.exec(`
      insert into auth.users(id,email) values('${LATE}','late@example.com');
      insert into public.profiles(id,role,email,created_at)
      values('${LATE}','user','late@example.com',now()+interval '1 hour');
    `);
    await makeClaimable(queued.message_id);
    // Account authority may materialize a pending receipt before the courier
    // reaches this page. The page must still settle an opt-out to skipped.
    await asUser(OTHER);
    await db.query('select * from public.list_my_operator_messages()');
    await asUser(USER);
    const claim = await one(`select * from public.claim_operator_message_delivery_jobs(1,240)`);
    expect(claim.message_id).toBe(queued.message_id);
    await expect(db.query(`select * from public.page_operator_message_recipients(
      '${claim.job_id}','${WRONG_LEASE}',null,null,10)`)).rejects.toThrow(/lease is not active/i);
    const page = await rows(`select * from public.page_operator_message_recipients(
      '${claim.job_id}','${claim.lease_token}',null,null,10)`);
    const pageUserIds = page.map((r) => r.user_id);
    expectAbsentWithAnchor(
      pageUserIds,
      LATE,
      USER,
      'stable audience page excludes accounts created after the broadcast cutoff',
    );
    expect(page).toHaveLength(3);
    expect(page.find((r) => r.user_id === USER).email_eligible).toBe(true);
    expect(page.find((r) => r.user_id === OTHER).email_eligible).toBe(false);
    expect((await one(`select email_status from public.operator_message_receipts
      where message_id='${queued.message_id}' and user_id='${OTHER}'`)).email_status).toBe('skipped');

    // An unsubscribe after page discovery but before the per-recipient attempt
    // must win; page-time eligibility is never authority to send.
    await db.query(`select public.set_my_email_preference(
      '${USER}','product_updates',false)`);
    const attempt = await one(`select * from public.claim_operator_message_recipient(
      '${claim.job_id}','${claim.lease_token}','${USER}')`);
    expect(attempt.claimed).toBe(false);
    expect(attempt.unsubscribe_token).toBeNull();
    expect((await one(`select email_status,email_failure_reason
      from public.operator_message_receipts
      where message_id='${queued.message_id}' and user_id='${USER}'`))).toEqual({
      email_status: 'skipped', email_failure_reason: 'announcement_opt_out',
    });
  });

  it('grants exactly one recipient attempt and records only its token-bound result', async () => {
    const queued = (await queue()).result;
    await makeClaimable(queued.message_id);
    const claim = await one(`select * from public.claim_operator_message_delivery_jobs(1,240)`);
    const page = await rows(`select * from public.page_operator_message_recipients(
      '${claim.job_id}','${claim.lease_token}',null,null,10)`);
    const userRow = page.find((r) => r.user_id === USER);
    expect(userRow.email_eligible).toBe(true);

    await expect(db.query(`select public.renew_operator_message_delivery_job_lease(
      '${claim.job_id}','${WRONG_LEASE}',240)`)).rejects.toThrow(/lease is not active/i);
    const renewed = (await one(`select public.renew_operator_message_delivery_job_lease(
      '${claim.job_id}','${claim.lease_token}',240) as result`)).result;
    expect(renewed.lease_expires_at).toBeTruthy();

    const [attemptA, attemptB] = await Promise.all([
      one(`select * from public.claim_operator_message_recipient(
        '${claim.job_id}','${claim.lease_token}','${USER}')`),
      one(`select * from public.claim_operator_message_recipient(
        '${claim.job_id}','${claim.lease_token}','${USER}')`),
    ]);
    const attempts = [attemptA, attemptB];
    expect(attempts.filter((attempt) => attempt.claimed)).toHaveLength(1);
    const winner = attempts.find((attempt) => attempt.claimed);
    expect(winner.email).toBe('user@example.com');
    expect(winner.attempt_token).toBeTruthy();
    expect(winner.email_idempotency_key).toBeTruthy();
    expect(attempts.find((attempt) => !attempt.claimed).attempt_token).toBeNull();

    const last = page.at(-1);
    await expect(db.query(
      'select public.advance_operator_message_delivery_job($1,$2,$3,$4,true)',
      [claim.job_id, claim.lease_token, last.created_at, last.user_id],
    )).rejects.toThrow(/still in flight/i);
    await expect(db.query(`select public.record_operator_message_delivery_result(
      '${claim.job_id}','${claim.lease_token}','${USER}','${WRONG_LEASE}',
      'sent','test','provider-1',null)`)).rejects.toThrow(/attempt is not active/i);

    // Wall-clock expiry alone does not defeat a valid result. Whichever takes the
    // job lock first—this result or a reclaimer—owns the terminal verdict.
    await db.query(`update public.operator_message_delivery_jobs
      set lease_expires_at=now()-interval '1 second' where id=$1`, [claim.job_id]);
    const result = (await one(`select public.record_operator_message_delivery_result(
      '${claim.job_id}','${claim.lease_token}','${USER}','${winner.attempt_token}',
      'sent','test','provider-1',null) as result`)).result;
    expect(result.recorded).toBe(true);
    expect(result.email_status).toBe('sent');
    expect((await one(`select email_status,email_attempt_token,email_job_lease_token
      from public.operator_message_receipts
      where message_id='${queued.message_id}' and user_id='${USER}'`))).toEqual({
      email_status: 'sent', email_attempt_token: null, email_job_lease_token: null,
    });
    await expect(db.query(`select public.record_operator_message_email_result(
      '${queued.message_id}','${USER}','sent','test','provider-legacy',null)`)).rejects.toThrow(/lease-bound/i);
  });

  it('terminalizes an orphaned provider attempt as unknown and never reclaims it', async () => {
    const queued = (await queue()).result;
    await makeClaimable(queued.message_id);
    const firstJob = await one(`select * from public.claim_operator_message_delivery_jobs(1,240)`);
    await db.query(`select * from public.page_operator_message_recipients(
      '${firstJob.job_id}','${firstJob.lease_token}',null,null,10)`);
    const attempt = await one(`select * from public.claim_operator_message_recipient(
      '${firstJob.job_id}','${firstJob.lease_token}','${USER}')`);
    expect(attempt.claimed).toBe(true);

    await db.query(`update public.operator_message_delivery_jobs
      set lease_expires_at=now()-interval '1 second' where id=$1`, [firstJob.job_id]);
    const replacementJob = await one(`select * from public.claim_operator_message_delivery_jobs(1,240)`);
    expect(replacementJob.job_id).toBe(firstJob.job_id);
    expect(replacementJob.lease_token).not.toBe(firstJob.lease_token);
    const terminal = await one(`select email_status,email_failure_reason,
      email_attempt_token,email_job_lease_token,email_idempotency_key
      from public.operator_message_receipts
      where message_id='${queued.message_id}' and user_id='${USER}'`);
    expect(terminal).toEqual({
      email_status: 'failed',
      email_failure_reason: 'delivery_outcome_unknown',
      email_attempt_token: null,
      email_job_lease_token: null,
      email_idempotency_key: attempt.email_idempotency_key,
    });
    const replayPage = await rows(`select * from public.page_operator_message_recipients(
      '${replacementJob.job_id}','${replacementJob.lease_token}',null,null,10)`);
    expect(replayPage.find((row) => row.user_id === USER).email_eligible).toBe(false);
    const reclaimed = await one(`select * from public.claim_operator_message_recipient(
      '${replacementJob.job_id}','${replacementJob.lease_token}','${USER}')`);
    expect(reclaimed.claimed).toBe(false);
    await expect(db.query(`select public.record_operator_message_delivery_result(
      '${firstJob.job_id}','${firstJob.lease_token}','${USER}','${attempt.attempt_token}',
      'sent','test','too-late',null)`)).rejects.toThrow(/job attempt is not current/i);

    // An explicit worker abort follows the same fail-closed rule for any attempt
    // it owns; retrying the page may continue, but this recipient is terminal.
    const otherAttempt = await one(`select * from public.claim_operator_message_recipient(
      '${replacementJob.job_id}','${replacementJob.lease_token}','${OTHER}')`);
    expect(otherAttempt.claimed).toBe(true);
    const failedJob = (await one(`select public.fail_operator_message_delivery_job(
      '${replacementJob.job_id}','${replacementJob.lease_token}','worker transport failed'
    ) as result`)).result;
    expect(failedJob.status).toBe('retry');
    expect((await one(`select email_status,email_failure_reason
      from public.operator_message_receipts
      where message_id='${queued.message_id}' and user_id='${OTHER}'`))).toEqual({
      email_status: 'failed', email_failure_reason: 'delivery_outcome_unknown',
    });
  });

  it('keeps the legacy email-result seam direct-only', async () => {
    const messageId = (await direct()).result.message_id;
    const result = (await one(`select public.record_operator_message_email_result(
      '${messageId}','${USER}','sent','test','direct-provider-1',null) as result`)).result;
    expect(result.recorded).toBe(true);
    expect(result.email_status).toBe('sent');
  });

  it('advances and completes only with the active lease; cancellation is CAS-bound to the window', async () => {
    const queued = (await queue()).result;
    await makeClaimable(queued.message_id);
    const claim = await one(`select * from public.claim_operator_message_delivery_jobs(1,240)`);
    const page = await rows(`select * from public.page_operator_message_recipients(
      '${claim.job_id}','${claim.lease_token}',null,null,10)`);
    const last = page.at(-1);
    await expect(db.query(
      'select public.advance_operator_message_delivery_job($1,$2,$3,$4,true)',
      [claim.job_id, WRONG_LEASE, last.created_at, last.user_id],
    )).rejects.toThrow(/lease is not active/i);
    const done = (await one(
      'select public.advance_operator_message_delivery_job($1,$2,$3,$4,true) as result',
      [claim.job_id, claim.lease_token, last.created_at, last.user_id],
    )).result;
    expect(done.status).toBe('completed');
    expect((await one(`select status from public.operator_messages where id='${queued.message_id}'`)).status).toBe('sent');

    const cancelable = (await queue()).result;
    expect((await one(`select public.cancel_operator_broadcast('${ADMIN}','${cancelable.message_id}') as result`)).result.status).toBe('canceled');
    expect((await one(`select status from public.operator_message_delivery_jobs where message_id='${cancelable.message_id}'`)).status).toBe('canceled');
  });

  it('resets consecutive-failure attempts after every successful page and reaches page ten', async () => {
    const authValues = PAGE_USERS.map(
      (id, index) => `('${id}','page-${index + 1}@example.com')`,
    ).join(',');
    const profileValues = PAGE_USERS.map(
      (id, index) => `('${id}','user','page-${index + 1}@example.com',now()-interval '12 hours')`,
    ).join(',');
    await db.exec(`
      insert into auth.users(id,email) values ${authValues};
      insert into public.profiles(id,role,email,created_at) values ${profileValues};
    `);
    const queued = (await queue()).result;
    expect(queued.audience_count).toBe(10);
    await makeClaimable(queued.message_id);

    for (let pageNumber = 1; pageNumber <= 9; pageNumber += 1) {
      const job = await one('select * from public.claim_operator_message_delivery_jobs(1,240)');
      expect(job?.job_id).toBe(queued.job_id);
      const page = await rows(
        'select * from public.page_operator_message_recipients($1,$2,$3,$4,1)',
        [job.job_id, job.lease_token, job.cursor_created_at, job.cursor_user_id],
      );
      expect(page).toHaveLength(1);
      const recipient = page[0];
      const attempt = await one(
        'select * from public.claim_operator_message_recipient($1,$2,$3)',
        [job.job_id, job.lease_token, recipient.user_id],
      );
      expect(attempt.claimed).toBe(true);
      await db.query(
        'select public.record_operator_message_delivery_result($1,$2,$3,$4,$5,$6,$7,$8)',
        [
          job.job_id, job.lease_token, recipient.user_id, attempt.attempt_token,
          'sent', 'test', `page-${pageNumber}`, null,
        ],
      );
      const advanced = (await one(
        'select public.advance_operator_message_delivery_job($1,$2,$3,$4,false) as result',
        [job.job_id, job.lease_token, recipient.created_at, recipient.user_id],
      )).result;
      expect(advanced.status).toBe('pending');
      expect((await one(`select attempts from public.operator_message_delivery_jobs
        where id='${job.job_id}'`)).attempts).toBe(0);
    }

    // Before the fix this claim retired the job because nine healthy page leases
    // had exhausted the retry counter. It must instead reach the tenth recipient.
    const tenthJob = await one('select * from public.claim_operator_message_delivery_jobs(1,240)');
    expect(tenthJob?.job_id).toBe(queued.job_id);
    expect((await one(`select attempts,status from public.operator_message_delivery_jobs
      where id='${queued.job_id}'`))).toEqual({ attempts: 1, status: 'processing' });
    const tenthPage = await rows(
      'select * from public.page_operator_message_recipients($1,$2,$3,$4,1)',
      [
        tenthJob.job_id, tenthJob.lease_token,
        tenthJob.cursor_created_at, tenthJob.cursor_user_id,
      ],
    );
    expect(tenthPage).toHaveLength(1);
    expect((await one(`select count(*)::int n from public.operator_message_receipts
      where message_id='${queued.message_id}' and email_status='sent'`)).n).toBe(9);
  });

  it('warning and ban wrappers commit their account message and one audit atomically', async () => {
    const legacy = await one(`select
      has_function_privilege('service_role','public.issue_warning(uuid,uuid,text,text,boolean)','execute') as warning,
      has_function_privilege('service_role','public.set_account_banned(uuid,uuid,boolean,text)','execute') as ban`);
    expect(legacy).toEqual({ warning: false, ban: false });
    const warning = (await one(`select public.issue_warning_with_message(
      '${ADMIN}','${USER}','major','Repeated abuse','Account warning','Please stop the reported behavior.'
    ) as result`)).result;
    expect(warning.warning_id).toBeTruthy();
    expect(warning.message_id).toBeTruthy();
    expect((await one(`select count(*)::int n from public.audit_log`)).n).toBe(1);

    await expect(db.query(`select public.set_account_banned_with_message(
      '${ADMIN}','${OTHER}',true,'reason','', '')`)).rejects.toThrow(/subject/i);
    expect((await one(`select banned_at from public.profiles where id='${OTHER}'`)).banned_at).toBeNull();
    const banned = (await one(`select public.set_account_banned_with_message(
      '${ADMIN}','${OTHER}',true,'reason','Account suspended','Use support to appeal.'
    ) as result`)).result;
    expect(banned.banned).toBe(true);
    expect(banned.message_id).toBeTruthy();
    expect((await one(`select count(*)::int n from public.audit_log`)).n).toBe(2);
  });

  it('links support only to an owned direct-message receipt', async () => {
    const message = (await direct()).result.message_id;
    const ticket = (await one(`select public.create_ticket(
      '${USER}','Appeal','Please review','user@example.com','account','normal',
      '{"operator_message_id":"${message}"}','{"operator_message_id":"${message}"}'
    ) as result`)).result;
    expect(ticket.operator_message_id).toBe(message);
    expect((await one(`select operator_message_id from public.support_messages where id=$1`, [ticket.id])).operator_message_id).toBe(message);
    await expect(db.query(`select public.create_ticket(
      '${OTHER}','Appeal','Please review','other@example.com','account','normal',
      '{"operator_message_id":"${message}"}','{}')`)).rejects.toThrow(/direct message visible/i);

    const broadcast = (await queue()).result;
    await db.query(`update public.operator_messages set send_after=now()-interval '1 second'
      where id=$1`, [broadcast.message_id]);
    await asUser(USER);
    await db.query('select * from public.list_my_operator_messages()');
    await expect(db.query(`select public.create_ticket(
      '${USER}','Broadcast reply','Please review','user@example.com','account','normal',
      '{"operator_message_id":"${broadcast.message_id}"}','{}')`)).rejects.toThrow(/direct message visible/i);
  });

  it('includes in-product delivery timestamps in the service export', async () => {
    const message = (await direct()).result;
    const exported = (await one('select public.get_my_operator_service_export() as value')).value;
    const row = exported.operator_messages.find((entry) => entry.id === message.message_id);
    expect(row.delivered_at).toBeTruthy();
  });

  it('soft deletion purges personal rows while preserving the shared broadcast', async () => {
    const directId = (await direct()).result.message_id;
    await asUser(USER);
    await db.query(`select public.set_my_telemetry_consent(
      '${USER}','{"essential":false,"research":true,"ai_prose":false,"market":false,"v":2}','account')`);
    const queued = (await queue()).result;
    await db.query(`update public.operator_messages set status='sending' where id=$1`, [queued.message_id]);
    await db.query('select * from public.list_my_operator_messages()');
    expect((await one(`select count(*)::int n from public.operator_message_receipts where user_id='${USER}'`)).n).toBe(2);

    await db.query(`update public.profiles set deleted_at=now() where id='${USER}'`);
    expect((await one(`select count(*)::int n from public.operator_message_receipts where user_id='${USER}'`)).n).toBe(0);
    expect((await one(`select count(*)::int n from public.operator_messages where id='${directId}'`)).n).toBe(0);
    expect((await one(`select count(*)::int n from public.consent_change_records where user_id='${USER}'`)).n).toBe(0);
    expect((await one(`select count(*)::int n from public.operator_messages where id='${queued.message_id}' and kind='broadcast'`)).n).toBe(1);
  });
});
