/**
 * adminLeastPrivilege.pglite.test.js — EXECUTION-level proof of the Phase A3
 * least-privilege RLS + append-only audit log + deletion-request path.
 *
 * Loads the REAL migration DDL/RPCs (050/051/052) into in-process Postgres
 * (pglite) and exercises the access boundary that actually protects user PII.
 *
 * pglite caveats baked in so the suite can't false-green:
 *   • pglite's default connection is a SUPERUSER, which BYPASSES RLS even when
 *     enabled. We `alter table … force row level security` AND `set role
 *     nosuperuser` for every attacking statement (mirrors profileEscalation.pglite).
 *   • RLS role grants aren't enforced single-connection for FUNCTION execute, so
 *     the RPCs' OWN role checks (current_user_is_* via has_role) ARE the gate we
 *     run here — exactly the server-side enforcement A3 relies on.
 *
 * What it proves:
 *   1. A plain `user` cannot read another user's profile row (RLS denies) and
 *      cannot read another user's support message.
 *   2. admin_user_summary returns the REDACTED shape (masked email, no raw email
 *      / no stripe id) for support/admin; a plain user is rejected.
 *   3. admin_user_full requires the HIGHEST role (admin|developer) AND a reason,
 *      writes exactly one audit row, and only then returns the raw email.
 *      support is rejected; a missing reason is rejected.
 *   4. audit_log is append-only for a non-superuser: UPDATE and DELETE are denied;
 *      INSERT is denied directly (only write_audit, definer, inserts).
 *   5. deletion_requests: a user inserts/reads their OWN; cannot read another's;
 *      an elevated role reads all.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '005': resolve(dir, '005_fix_profiles_rls_recursion.sql'),
  '033': resolve(dir, '033_security_review_hardening.sql'),
  '050': resolve(dir, '050_admin_least_privilege.sql'),
  '051': resolve(dir, '051_audit_log.sql'),
  '052': resolve(dir, '052_deletion_requests.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames:
// the runIf(allExist) suites below would otherwise go GREEN with 0 tests run.
describe('pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
});

const sql = (k) => readFileSync(MIG[k], 'utf-8');

/** Extract a `create or replace function public.<name>(…) … $$;` block verbatim. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}
/** Extract a `create policy "<name>" … ;` block verbatim. */
function extractPolicy(src, name) {
  const m = src.match(new RegExp(`create\\s+policy\\s+"${name.replace(/[()]/g, '\\$&')}"[\\s\\S]*?;`, 'i'));
  if (!m) throw new Error(`could not extract policy ${name}`);
  return m[0];
}

const ADMIN = '11111111-1111-1111-1111-111111111111';
const SUPPORT = '22222222-2222-2222-2222-222222222222';
const USER_A = '33333333-3333-3333-3333-333333333333';
const USER_B = '44444444-4444-4444-4444-444444444444';
const DEV = '55555555-5555-5555-5555-555555555555';

let db;
/** Run a single statement AS the unprivileged role (RLS enforced) — via exec so
 *  a statement that might be multi-command (or a definer call) is fine. */
const asUser = (uid, body) =>
  db.exec(`set role nosuperuser; set test.uid = '${uid}'; ${body};`);
const reset = () => db.exec('reset role;');
/** SELECT as a uid: set the role/uid via exec, then run the single query via
 *  query() (db.query can't take multiple ;-separated commands). */
async function queryAs(uid, singleSelect, params = []) {
  await db.exec(`set role nosuperuser; set test.uid = '${uid}';`);
  const out = await db.query(singleSelect, params);
  await db.exec('reset role;');
  return out;
}

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allExist).toBe(true);
});

describe.runIf(allExist)('A3 admin least-privilege — executed against 050/051/052 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    const s050 = sql('050'), s051 = sql('051'), s052 = sql('052');

    // ── Minimal auth + base tables (the real migrations layer on top) ────────
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create table auth.users (id uuid primary key);

      create table public.profiles (
        id uuid primary key,
        role text not null default 'user',
        tier text not null default 'free',
        credits integer not null default 0,
        is_founder boolean not null default false,
        display_name text,
        email text,
        stripe_customer_id text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create table public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        created_at timestamptz not null default now()
      );
      create table public.support_messages (
        id uuid primary key default gen_random_uuid(),
        user_id uuid,
        email text not null,
        subject text not null,
        message text not null,
        status text not null default 'new',
        created_at timestamptz not null default now()
      );

      -- migration-001 self-read policy (the only profiles SELECT that survives A3).
      create policy "Users read own profile" on public.profiles
        for select using (auth.uid() = id);
      -- migration-002 owner read on support_messages.
      create policy "Users read own support messages" on public.support_messages
        for select using (auth.uid() = user_id);

      alter table public.profiles enable row level security;
      alter table public.profiles force row level security;
      alter table public.support_messages enable row level security;
      alter table public.support_messages force row level security;
    `);

    // ── The REAL A3 helper functions + RPCs, verbatim from 050/051. ──────────
    for (const fn of [
      'has_role', 'current_user_has_role', 'current_user_is_highest',
      'current_user_is_support_or_higher', 'mask_email',
      'admin_user_summary', 'admin_user_full',
      'admin_support_messages',
    ]) {
      await db.exec(extractFn(s050, fn));
    }
    // The REAL current_user_is_privileged (developer|admin only) from 005, plus
    // the REAL 033 "Developers update any profile" UPDATE policy — together these
    // prove `support` is EXCLUDED from user-management writes (the least-privilege
    // boundary 050 deliberately preserves by NOT widening this helper).
    await db.exec(extractFn(sql('005'), 'current_user_is_privileged'));
    await db.exec(extractPolicy(sql('033'), 'Developers update any profile'));

    // write_audit + the audit_log table + its append-only SELECT policy (051).
    await db.exec(`
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
      alter table public.audit_log enable row level security;
      alter table public.audit_log force row level security;
    `);
    await db.exec(extractPolicy(s051, 'Elevated read audit log'));
    await db.exec(extractFn(s051, 'write_audit'));

    // deletion_requests table + its three policies (052).
    await db.exec(`
      create table public.deletion_requests (
        id uuid primary key default gen_random_uuid(),
        user_id uuid, email text,
        requested_at timestamptz not null default now(),
        status text not null default 'requested',
        processed_by uuid, processed_at timestamptz,
        created_at timestamptz not null default now()
      );
      alter table public.deletion_requests enable row level security;
      alter table public.deletion_requests force row level security;
    `);
    await db.exec(extractPolicy(s052, 'Users file own deletion request'));
    await db.exec(extractPolicy(s052, 'Users read own deletion request'));
    await db.exec(extractPolicy(s052, 'Elevated update deletion request'));

    // Non-superuser attack role + table grants (RLS still gates the rows).
    await db.exec(`
      create role nosuperuser nologin;
      grant select, insert, update, delete on public.profiles to nosuperuser;
      grant select, insert, update, delete on public.support_messages to nosuperuser;
      grant select, insert, update, delete on public.audit_log to nosuperuser;
      grant select, insert, update, delete on public.deletion_requests to nosuperuser;
      grant select on public.settlements to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role;
      truncate public.profiles, public.support_messages, public.audit_log,
               public.deletion_requests, public.settlements cascade;
      delete from auth.users;
      insert into auth.users (id) values
        ('${ADMIN}'), ('${SUPPORT}'), ('${USER_A}'), ('${USER_B}'), ('${DEV}');
      insert into public.profiles (id, role, email, stripe_customer_id, display_name) values
        ('${ADMIN}',   'admin',     'admin@x.com',   'cus_admin', 'Admin'),
        ('${SUPPORT}', 'support',   'support@x.com', 'cus_supp',  'Support'),
        ('${DEV}',     'developer', 'dev@x.com',     'cus_dev',   'Dev'),
        ('${USER_A}',  'user',      'alice@example.com', 'cus_alice', 'Alice'),
        ('${USER_B}',  'user',      'bob@example.com',   'cus_bob',   'Bob');
      insert into public.support_messages (user_id, email, subject, message) values
        ('${USER_A}', 'alice@example.com', 'Help', 'My town vanished');
    `);
  });

  // ── 1. Plain user cannot read another user's PII via the table ────────────
  it('a plain user cannot SELECT another user\'s profile row (RLS denies)', async () => {
    const { rows } = await queryAs(USER_A, `select id, email from public.profiles where id = '${USER_B}'`);
    expect(rows).toHaveLength(0); // USER_B's row is invisible to USER_A
  });

  it('a plain user CAN read their own profile, but not others (self-read policy)', async () => {
    const { rows } = await queryAs(USER_A, 'select id from public.profiles');
    expect(rows.map((r) => r.id)).toEqual([USER_A]);
  });

  it('a plain user cannot read another user\'s support message', async () => {
    const { rows } = await queryAs(USER_B, 'select id from public.support_messages');
    expect(rows).toHaveLength(0);
  });

  // ── 2. admin_user_summary — REDACTED for elevated; rejected for plain user ─
  it('admin_user_summary returns a REDACTED shape (masked email, no raw email / no stripe id)', async () => {
    const run = async (actor) => {
      const { rows } = await queryAs(actor, `select public.admin_user_summary('${USER_A}') as s`);
      return rows[0].s;
    };
    for (const actor of [SUPPORT, ADMIN, DEV]) {
      const s = await run(actor);
      expect(s.redacted).toBe(true);
      expect(s.email_masked).toBe('a***@example.com');
      expect(s.email).toBeUndefined();             // no raw email key
      expect(JSON.stringify(s)).not.toContain('alice@example.com');
      expect(JSON.stringify(s)).not.toContain('cus_alice'); // no payment id
      expect(s.display_name).toBe('Alice');
    }
  });

  it('admin_user_summary rejects a plain user', async () => {
    await expect(
      asUser(USER_B, `select public.admin_user_summary('${USER_A}')`),
    ).rejects.toThrow(/not authorized/i);
    await reset();
  });

  // ── 3. admin_user_full — HIGHEST role + reason + audited ──────────────────
  it('admin_user_full returns the RAW email AND writes exactly one audit row (admin)', async () => {
    const { rows } = await queryAs(ADMIN, `select public.admin_user_full('${USER_A}', 'GDPR data request #42') as f`);
    expect(rows[0].f.redacted).toBe(false);
    expect(rows[0].f.email).toBe('alice@example.com'); // raw, unmasked
    const { rows: audit } = await db.query(
      `select * from public.audit_log where action = 'read_full_pii'`,
    );
    expect(audit).toHaveLength(1);
    expect(audit[0].actor_id).toBe(ADMIN);
    expect(audit[0].actor_role).toBe('admin');
    expect(audit[0].target_user_id).toBe(USER_A);
    expect(audit[0].reason).toBe('GDPR data request #42');
    // The audit row itself carries NO raw email — only the masked form.
    expect(JSON.stringify(audit[0].after_state)).not.toContain('alice@example.com');
  });

  it('admin_user_full is rejected for support (not the highest role)', async () => {
    await expect(
      asUser(SUPPORT, `select public.admin_user_full('${USER_A}', 'snooping')`),
    ).rejects.toThrow(/not authorized.*admin or developer|requires admin/i);
    await reset();
  });

  it('admin_user_full requires a non-empty reason', async () => {
    await expect(
      asUser(ADMIN, `select public.admin_user_full('${USER_A}', '   ')`),
    ).rejects.toThrow(/reason is required/i);
    await reset();
  });

  it('developer (back-compat highest role) can read full PII', async () => {
    const { rows } = await queryAs(DEV, `select public.admin_user_full('${USER_A}', 'support escalation') as f`);
    expect(rows[0].f.email).toBe('alice@example.com');
  });

  // ── 4. audit_log is append-only for non-superusers ────────────────────────
  it('audit_log denies direct INSERT / UPDATE / DELETE by a non-superuser', async () => {
    // Seed one row via the definer writer (the legitimate path).
    await queryAs(ADMIN, `select public.write_audit('test_action', '${USER_A}'::uuid)`);
    const { rows: before } = await db.query('select id from public.audit_log');
    expect(before).toHaveLength(1);
    const rowId = before[0].id;

    // Direct INSERT — no INSERT policy → denied.
    await expect(
      asUser(ADMIN, `insert into public.audit_log (action) values ('forged')`),
    ).rejects.toThrow(/row-level security|policy/i);
    await reset();

    // UPDATE — no UPDATE policy → denied (or silently affects 0 rows; assert no change).
    await db.exec(`set role nosuperuser; set test.uid = '${ADMIN}';`);
    try {
      await db.query(`update public.audit_log set reason = 'tampered' where id = '${rowId}'`);
    } catch { /* either a policy error or a 0-row update is acceptable */ }
    await reset();
    const { rows: afterUpd } = await db.query(`select reason from public.audit_log where id = '${rowId}'`);
    expect(afterUpd[0].reason ?? null).not.toBe('tampered');

    // DELETE — no DELETE policy → row survives.
    await db.exec(`set role nosuperuser; set test.uid = '${ADMIN}';`);
    try {
      await db.query(`delete from public.audit_log where id = '${rowId}'`);
    } catch { /* policy error acceptable */ }
    await reset();
    const { rows: afterDel } = await db.query('select id from public.audit_log');
    expect(afterDel).toHaveLength(1); // immutable — still there
  });

  it('only elevated roles can SELECT the audit log; a plain user sees nothing', async () => {
    await queryAs(ADMIN, `select public.write_audit('seed', '${USER_A}'::uuid)`);
    const elevated = await queryAs(ADMIN, 'select count(*)::int n from public.audit_log');
    expect(elevated.rows[0].n).toBe(1);
    const plain = await queryAs(USER_A, 'select count(*)::int n from public.audit_log');
    expect(plain.rows[0].n).toBe(0); // RLS hides every row from a plain user
  });

  // ── 5. deletion_requests — own-row insert/read; elevated reads all ────────
  it('a user can file and read their OWN deletion request', async () => {
    await asUser(USER_A, `insert into public.deletion_requests (user_id, email) values ('${USER_A}', 'alice@example.com')`);
    await reset();
    const { rows } = await queryAs(USER_A, 'select user_id from public.deletion_requests');
    expect(rows.map((r) => r.user_id)).toEqual([USER_A]);
  });

  it('a user cannot file a deletion request for SOMEONE ELSE (WITH CHECK)', async () => {
    await expect(
      asUser(USER_A, `insert into public.deletion_requests (user_id) values ('${USER_B}')`),
    ).rejects.toThrow(/row-level security|policy/i);
    await reset();
  });

  it('a user cannot READ another user\'s deletion request', async () => {
    await asUser(USER_B, `insert into public.deletion_requests (user_id) values ('${USER_B}')`);
    await reset();
    const { rows } = await queryAs(USER_A, 'select user_id from public.deletion_requests');
    expect(rows).toHaveLength(0); // USER_B's request invisible to USER_A
  });

  it('an elevated role can read ALL deletion requests', async () => {
    await asUser(USER_A, `insert into public.deletion_requests (user_id) values ('${USER_A}')`);
    await reset();
    await asUser(USER_B, `insert into public.deletion_requests (user_id) values ('${USER_B}')`);
    await reset();
    for (const actor of [SUPPORT, ADMIN, DEV]) {
      const { rows } = await queryAs(actor, 'select user_id from public.deletion_requests order by user_id');
      expect(rows.map((r) => r.user_id)).toEqual([USER_A, USER_B]);
    }
  });

  // ── 6. LEAST-PRIVILEGE: cross-user profile WRITES via direct table access ──
  // The escalation guard. Widening current_user_is_privileged() to include
  // support would have let support write ANY profile via the 033 UPDATE policy;
  // 050 deliberately does NOT widen it. AND — because 050 dropped the flat
  // cross-user SELECT policy — NO elevated role (support OR admin) can mutate
  // another user's profile through a direct table UPDATE at all: with FORCE RLS
  // an UPDATE needs the row to be SELECT-visible, and the only surviving SELECT
  // policy is "Users read own profile". Cross-user writes therefore MUST go
  // through the audited service_update_profile_metadata RPC (the edge-fn path).
  it('support CANNOT update another user\'s profile (write policy + no cross-user read)', async () => {
    await db.exec(`set role nosuperuser; set test.uid = '${SUPPORT}';`);
    await db.query(`update public.profiles set role = 'developer' where id = '${USER_A}'`);
    await reset();
    const { rows } = await db.query(`select role from public.profiles where id = '${USER_A}'`);
    expect(rows[0].role).toBe('user'); // unchanged — support could not escalate USER_A
  });

  it('even ADMIN cannot mutate another user\'s profile via DIRECT table UPDATE (must use the audited RPC)', async () => {
    // Dropping the flat cross-user SELECT means the row is not visible to a
    // direct UPDATE → 0 rows affected. The legitimate admin path is the
    // SECURITY DEFINER service RPC, which audits. This is STRICTLY tighter than
    // the pre-A3 flat policy that let any elevated role write any profile row.
    await db.exec(`set role nosuperuser; set test.uid = '${ADMIN}';`);
    const res = await db.query(`update public.profiles set tier = 'premium' where id = '${USER_A}'`);
    await reset();
    expect(res.affectedRows).toBe(0);
    const { rows } = await db.query(`select tier from public.profiles where id = '${USER_A}'`);
    expect(rows[0].tier).toBe('free'); // untouched by the direct write
  });

  it('support CANNOT advance a deletion request status (UPDATE is highest-role only)', async () => {
    await asUser(USER_A, `insert into public.deletion_requests (user_id) values ('${USER_A}')`);
    await reset();
    await db.exec(`set role nosuperuser; set test.uid = '${SUPPORT}';`);
    await db.query(`update public.deletion_requests set status = 'processing' where user_id = '${USER_A}'`);
    await reset();
    const { rows } = await db.query(`select status from public.deletion_requests where user_id = '${USER_A}'`);
    expect(rows[0].status).toBe('requested'); // support could not advance it
  });

  it('admin CAN advance a deletion request status', async () => {
    await asUser(USER_A, `insert into public.deletion_requests (user_id) values ('${USER_A}')`);
    await reset();
    await db.exec(`set role nosuperuser; set test.uid = '${ADMIN}';`);
    await db.query(`update public.deletion_requests set status = 'processing', processed_by = '${ADMIN}' where user_id = '${USER_A}'`);
    await reset();
    const { rows } = await db.query(`select status from public.deletion_requests where user_id = '${USER_A}'`);
    expect(rows[0].status).toBe('processing');
  });
});

// ── Static contract: the flat 003/005 raw-read policies are REMOVED, not kept ─
describe.runIf(allExist)('A3 — the flat raw-PII policies are dropped (static)', () => {
  const s050 = sql('050');
  it('050 drops the flat "Developers read all profiles" SELECT policy', () => {
    expect(s050).toMatch(/drop policy if exists "Developers read all profiles" on public\.profiles/i);
    // …and does NOT recreate a flat raw-read SELECT on profiles.
    expect(s050).not.toMatch(/create policy "Developers read all profiles"/i);
  });
  it('050 drops the flat raw "Developers read all support messages" SELECT policy', () => {
    expect(s050).toMatch(/drop policy if exists "Developers read all support messages" on public\.support_messages/i);
    expect(s050).not.toMatch(/create policy "Developers read all support messages"/i);
  });
  it('051 audit_log has NO update or delete policy (append-only)', () => {
    const s051 = sql('051');
    expect(s051).not.toMatch(/create policy[^;]*on public\.audit_log[\s\S]*?for\s+update/i);
    expect(s051).not.toMatch(/create policy[^;]*on public\.audit_log[\s\S]*?for\s+delete/i);
  });
});
