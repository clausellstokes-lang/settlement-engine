/**
 * accountDeletionProcessing.pglite.test.js — EXECUTION-level proof of the Phase
 * A3 follow-up: the soft-delete PROCESSOR (migration 054) that 052 left stubbed.
 *
 * Loads the REAL migration RPC (054 process_account_deletions) plus the helpers
 * it depends on (050 has_role/mask_email, 051 write_audit/audit_log, 052
 * deletion_requests) into in-process Postgres (pglite) and RUNS the processor.
 *
 * What it proves:
 *   1. A request past the grace window is PROCESSED: status flips
 *      requested -> done, the target profile is ANONYMISED + LOCKED
 *      (display_name + email cleared, deleted_at + disabled_at stamped), and the
 *      row is NOT hard-deleted (soft-delete).
 *   2. Each processed request writes EXACTLY ONE audit row: action=
 *      'process_deletion', was_destructive=true, was_reversible=false,
 *      user_notified=true, with a REDACTED before/after (masked email, never raw).
 *   3. The grace window is RESPECTED both ways: a request still inside the window
 *      is left untouched; one past it is processed.
 *   4. Idempotent: a second run does NOT re-process a 'done' row (no second audit).
 *   5. Authorization: a non-highest actor is rejected; a null actor (the
 *      scheduled/system cron run) is allowed and audited with a null actor.
 *
 * Mirrors adminLeastPrivilege.pglite: the processor is SECURITY DEFINER and runs
 * with service-role (RLS-bypass) in production, so here we invoke it on the
 * default (superuser) connection — exactly the trust boundary it relies on.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '050': resolve(dir, '050_admin_least_privilege.sql'),
  '051': resolve(dir, '051_audit_log.sql'),
  '054': resolve(dir, '054_account_deletion_processing.sql'),
};
const allExist = Object.values(MIG).every(existsSync);
const sql = (k) => readFileSync(MIG[k], 'utf-8');

/** Extract a `create or replace function public.<name>(…) … $$;` block verbatim. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

const ADMIN = '11111111-1111-1111-1111-111111111111';
const DEV = '55555555-5555-5555-5555-555555555555';
const USER_A = '33333333-3333-3333-3333-333333333333';
const USER_B = '44444444-4444-4444-4444-444444444444';

let db;

describe.runIf(allExist)('A3 follow-up — account-deletion processor (pglite, executed against 054)', () => {
  beforeAll(async () => {
    db = new PGlite();
    const s050 = sql('050'), s051 = sql('051'), s054 = sql('054');

    // Minimal auth + the columns 054 touches (profiles.deleted_at/disabled_at).
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create table auth.users (id uuid primary key);

      create table public.profiles (
        id uuid primary key,
        role text not null default 'user',
        display_name text,
        email text,
        deleted_at timestamptz,
        disabled_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table public.deletion_requests (
        id uuid primary key default gen_random_uuid(),
        user_id uuid, email text,
        requested_at timestamptz not null default now(),
        status text not null default 'requested'
          check (status in ('requested', 'processing', 'done', 'cancelled')),
        processed_by uuid, processed_at timestamptz,
        created_at timestamptz not null default now()
      );

      create table public.audit_log (
        id uuid primary key default gen_random_uuid(),
        actor_id uuid, actor_role text, target_user_id uuid,
        target_type text, target_id text, action text not null, reason text,
        before_state jsonb, after_state jsonb,
        was_destructive boolean not null default false,
        was_reversible boolean not null default true,
        user_notified boolean not null default false,
        created_at timestamptz not null default now()
      );
    `);

    // The REAL helpers the processor calls, verbatim from the migrations.
    await db.exec(extractFn(s050, 'has_role'));
    await db.exec(extractFn(s050, 'mask_email'));
    await db.exec(extractFn(s051, 'write_audit'));
    await db.exec(extractFn(s054, 'process_account_deletions'));
  });

  beforeEach(async () => {
    await db.exec(`
      truncate public.profiles, public.deletion_requests, public.audit_log cascade;
      delete from auth.users;
      insert into auth.users (id) values ('${ADMIN}'), ('${DEV}'), ('${USER_A}'), ('${USER_B}');
      insert into public.profiles (id, role, email, display_name) values
        ('${ADMIN}',  'admin',     'admin@x.com',       'Admin'),
        ('${DEV}',    'developer', 'dev@x.com',         'Dev'),
        ('${USER_A}', 'user',      'alice@example.com', 'Alice'),
        ('${USER_B}', 'user',      'bob@example.com',   'Bob');
    `);
  });

  /** Insert a deletion request for a user, requested `daysAgo` days in the past. */
  const fileRequest = (uid, daysAgo) => db.exec(`
    insert into public.deletion_requests (user_id, email, requested_at, status)
    values ('${uid}', (select email from public.profiles where id = '${uid}'),
            now() - make_interval(days => ${daysAgo}), 'requested');
  `);

  // ── 1 + 2 + 3. Past-grace request processed; fresh one skipped; audited ────
  it('processes a request past the grace window, anonymises the profile, and leaves a fresh request untouched', async () => {
    await fileRequest(USER_A, 10); // 10 days old → past a 7-day grace
    await fileRequest(USER_B, 0);  // just now → inside the window

    const { rows } = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r`);
    expect(rows[0].r.processed).toBe(1);

    // USER_A: request done, profile anonymised + locked, row RETAINED.
    const { rows: drA } = await db.query(`select status, processed_by from public.deletion_requests where user_id = '${USER_A}'`);
    expect(drA[0].status).toBe('done');
    expect(drA[0].processed_by).toBe(ADMIN);

    const { rows: pA } = await db.query(`select display_name, email, deleted_at, disabled_at from public.profiles where id = '${USER_A}'`);
    expect(pA).toHaveLength(1);                 // soft-delete: row still exists
    expect(pA[0].display_name).toBeNull();
    expect(pA[0].email).toBeNull();             // email mirror cleared
    expect(pA[0].deleted_at).not.toBeNull();
    expect(pA[0].disabled_at).not.toBeNull();   // locked

    // USER_B: still inside the grace window → untouched.
    const { rows: drB } = await db.query(`select status from public.deletion_requests where user_id = '${USER_B}'`);
    expect(drB[0].status).toBe('requested');
    const { rows: pB } = await db.query(`select email, deleted_at from public.profiles where id = '${USER_B}'`);
    expect(pB[0].email).toBe('bob@example.com'); // mirror intact
    expect(pB[0].deleted_at).toBeNull();
  });

  it('writes EXACTLY ONE process_deletion audit row with the destructive/irreversible/notified flags and a REDACTED snapshot', async () => {
    await fileRequest(USER_A, 10);
    await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100)`);

    const { rows: audit } = await db.query(`select * from public.audit_log where action = 'process_deletion'`);
    expect(audit).toHaveLength(1);
    const a = audit[0];
    expect(a.target_user_id).toBe(USER_A);
    expect(a.target_type).toBe('deletion_request');
    expect(a.actor_id).toBe(ADMIN);
    expect(a.actor_role).toBe('admin');
    expect(a.was_destructive).toBe(true);
    expect(a.was_reversible).toBe(false);
    expect(a.user_notified).toBe(true);
    // REDACTION: masked email present, raw address NEVER in the audit row.
    expect(a.before_state.email_masked).toBe('a***@example.com');
    expect(JSON.stringify(a)).not.toContain('alice@example.com');
    expect(a.after_state.anonymized).toBe(true);
  });

  it('a request still INSIDE the grace window is never processed (grace respected the other way)', async () => {
    await fileRequest(USER_A, 3); // 3 days old, grace is 7 → too new
    const { rows } = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r`);
    expect(rows[0].r.processed).toBe(0);
    const { rows: dr } = await db.query(`select status from public.deletion_requests where user_id = '${USER_A}'`);
    expect(dr[0].status).toBe('requested');
    const { rows: au } = await db.query(`select count(*)::int n from public.audit_log where action = 'process_deletion'`);
    expect(au[0].n).toBe(0);
  });

  // ── 4. Idempotent: a 'done' row is not re-processed ───────────────────────
  it('is idempotent — a second run does not re-process a done row or write a second audit', async () => {
    await fileRequest(USER_A, 10);
    const first = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r`);
    expect(first.rows[0].r.processed).toBe(1);
    const second = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r`);
    expect(second.rows[0].r.processed).toBe(0);
    const { rows: au } = await db.query(`select count(*)::int n from public.audit_log where action = 'process_deletion'`);
    expect(au[0].n).toBe(1); // still exactly one — no re-processing
  });

  // ── 5. Authorization ──────────────────────────────────────────────────────
  it('rejects a non-highest actor (a plain user cannot trigger processing)', async () => {
    await fileRequest(USER_A, 10);
    await expect(
      db.query(`select public.process_account_deletions('${USER_A}'::uuid, 7, 100)`),
    ).rejects.toThrow(/not authorized.*admin or developer/i);
    // Nothing was processed.
    const { rows } = await db.query(`select status from public.deletion_requests where user_id = '${USER_A}'`);
    expect(rows[0].status).toBe('requested');
  });

  it('a developer (back-compat highest role) can trigger processing', async () => {
    await fileRequest(USER_A, 10);
    const { rows } = await db.query(`select public.process_account_deletions('${DEV}'::uuid, 7, 100) as r`);
    expect(rows[0].r.processed).toBe(1);
    const { rows: au } = await db.query(`select actor_role from public.audit_log where action = 'process_deletion'`);
    expect(au[0].actor_role).toBe('developer');
  });

  it('a NULL actor (scheduled/system cron run) is allowed and audited with a null actor', async () => {
    await fileRequest(USER_A, 10);
    const { rows } = await db.query(`select public.process_account_deletions(null, 7, 100) as r`);
    expect(rows[0].r.processed).toBe(1);
    const { rows: au } = await db.query(`select actor_id, actor_role from public.audit_log where action = 'process_deletion'`);
    expect(au[0].actor_id).toBeNull();   // system run — no human actor
    expect(au[0].actor_role).toBeNull();
  });

  it('honours a custom grace window — a wider grace defers a request the default would process', async () => {
    await fileRequest(USER_A, 10); // 10 days old
    // grace=30 → 10-day-old request is still inside the window, deferred.
    const wide = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 30, 100) as r`);
    expect(wide.rows[0].r.processed).toBe(0);
    // grace=7 → now past the window, processed.
    const narrow = await db.query(`select public.process_account_deletions('${ADMIN}'::uuid, 7, 100) as r`);
    expect(narrow.rows[0].r.processed).toBe(1);
  });
});

// ── Static contract: 054 ships the processor + soft-delete marker, audited ────
describe.runIf(allExist)('A3 follow-up — 054 static contract', () => {
  const s054 = sql('054');
  it('054 adds the soft-delete deleted_at marker on profiles (not a hard delete)', () => {
    expect(s054).toMatch(/alter table public\.profiles[\s\S]*?add column if not exists deleted_at timestamptz/i);
    // The processor never DROPs/DELETEs the profile or auth user.
    expect(s054).not.toMatch(/delete\s+from\s+public\.profiles/i);
    expect(s054).not.toMatch(/delete\s+from\s+auth\.users/i);
  });
  it('054 grants the processor to service_role only (revoked from public)', () => {
    expect(s054).toMatch(/revoke all on function public\.process_account_deletions\([^)]*\) from public/i);
    expect(s054).toMatch(/grant execute on function public\.process_account_deletions\([^)]*\) to service_role/i);
    expect(s054).not.toMatch(/grant execute on function public\.process_account_deletions\([^)]*\) to authenticated/i);
  });
  it('054 writes a process_deletion audit row with the required destructive/irreversible/notified flags', () => {
    expect(s054).toMatch(/p_action\s*=>\s*'process_deletion'/i);
    expect(s054).toMatch(/p_was_destructive\s*=>\s*true/i);
    expect(s054).toMatch(/p_was_reversible\s*=>\s*false/i);
    expect(s054).toMatch(/p_user_notified\s*=>\s*true/i);
  });
});
