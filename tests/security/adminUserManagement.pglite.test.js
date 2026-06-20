/**
 * adminUserManagement.pglite.test.js — EXECUTION-level proof of the Phase A4
 * user-management RPCs + warnings/internal-notes RLS, run against the REAL
 * migration DDL (050/051/053) in in-process Postgres (pglite).
 *
 * Inherits the A3 pglite harness conventions (see adminLeastPrivilege.pglite):
 *   • pglite's default connection is SUPERUSER (bypasses RLS), so we
 *     `force row level security` + `set role nosuperuser` for every attacking
 *     statement, and the RPCs' OWN role checks (has_role / current_user_is_*)
 *     are the server-side gate we exercise.
 *
 * What it proves (the A4 TEST GATE):
 *   1. A non-elevated user cannot invoke ANY admin action (issue_warning,
 *      add_internal_note, ban/disable, soft-delete, diagnostic bundle).
 *   2. A user cannot READ internal notes about THEMSELVES (RLS); elevated can.
 *   3. A user CAN read their OWN warnings; cannot read another's.
 *   4. Each action writes EXACTLY ONE audit row.
 *   5. ban/disable set REVERSIBLE flags (timestamps), with no hard delete, and
 *      the audit row records was_destructive=false / was_reversible=true.
 *   6. A FULL debug copy requires the HIGHEST role + a reason; support is
 *      rejected; the redacted variant is allowed for support and carries a
 *      masked email only.
 *   7. support CANNOT ban/disable/soft-delete (highest-role-only writes).
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '050': resolve(dir, '050_admin_least_privilege.sql'),
  '051': resolve(dir, '051_audit_log.sql'),
  '053': resolve(dir, '053_admin_user_management.sql'),
};
const allExist = Object.values(MIG).every(existsSync);
const sql = (k) => readFileSync(MIG[k], 'utf-8');

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames:
// the runIf(allExist) suites below would otherwise go GREEN with 0 tests run.
describe('pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
});

/** Extract a `create or replace function public.<name>(…) … $$;` block verbatim. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}
/** Extract a `create policy "<name>" … ;` block verbatim. */
function extractPolicy(src, name) {
  const m = src.match(new RegExp(`create\\s+policy\\s+"${name}"[\\s\\S]*?;`, 'i'));
  if (!m) throw new Error(`could not extract policy ${name}`);
  return m[0];
}

const ADMIN = '11111111-1111-1111-1111-111111111111';
const SUPPORT = '22222222-2222-2222-2222-222222222222';
const USER_A = '33333333-3333-3333-3333-333333333333';
const USER_B = '44444444-4444-4444-4444-444444444444';
const DEV = '55555555-5555-5555-5555-555555555555';

let db;
const asUser = (uid, body) =>
  db.exec(`set role nosuperuser; set test.uid = '${uid}'; ${body};`);
const reset = () => db.exec('reset role;');
async function queryAs(uid, singleSelect, params = []) {
  await db.exec(`set role nosuperuser; set test.uid = '${uid}';`);
  const out = await db.query(singleSelect, params);
  await db.exec('reset role;');
  return out;
}
/** Run an RPC as superuser (the edge-fn service-role path forwards the verified
 *  actor uuid as an argument; the RPC re-checks via has_role(actor,…)). */
const rpc = (q) => db.query(q);

describe.runIf(allExist)('A4 user-management — executed against 050/051/053 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    const s050 = sql('050'), s051 = sql('051'), s053 = sql('053');

    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select 'service_role'::text
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
        disabled_at timestamptz,
        banned_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create table public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        is_public boolean not null default false,
        is_curated boolean not null default false,
        curated_order integer,
        public_slug text,
        admin_deleted_at timestamptz,
        created_at timestamptz not null default now()
      );
      create table public.support_messages (
        id uuid primary key default gen_random_uuid(),
        user_id uuid, email text not null, subject text not null,
        message text not null, status text not null default 'new',
        created_at timestamptz not null default now()
      );

      create policy "Users read own profile" on public.profiles
        for select using (auth.uid() = id);
      alter table public.profiles enable row level security;
      alter table public.profiles force row level security;
    `);

    // A3 helpers from 050 + write_audit from 051 (the real DDL).
    for (const fn of [
      'has_role', 'current_user_has_role', 'current_user_is_highest',
      'current_user_is_support_or_higher', 'mask_email',
    ]) await db.exec(extractFn(s050, fn));

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

    // The REAL A4 tables/policies/RPCs from 053. (Columns already created above;
    // the create-table-if-not-exists in 053 is a no-op for them.)
    await db.exec(`
      create table public.warnings (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, issued_by uuid, severity text not null default 'notice',
        reason text not null, user_notified boolean not null default false,
        created_at timestamptz not null default now()
      );
      alter table public.warnings enable row level security;
      alter table public.warnings force row level security;
      create table public.internal_notes (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, author_id uuid, note text not null,
        created_at timestamptz not null default now()
      );
      alter table public.internal_notes enable row level security;
      alter table public.internal_notes force row level security;
    `);
    await db.exec(extractPolicy(s053, 'Users read own warnings'));
    await db.exec(extractPolicy(s053, 'Elevated read internal notes'));
    for (const fn of [
      'admin_user_summary', 'issue_warning', 'add_internal_note',
      'set_account_disabled', 'set_account_banned',
      'admin_soft_delete_settlement', 'admin_remove_gallery_item',
      'admin_revoke_share_link', 'admin_list_warnings',
      'admin_list_internal_notes', 'admin_billing_summary',
      'admin_diagnostic_bundle',
    ]) await db.exec(extractFn(s053, fn));

    await db.exec(`
      create role nosuperuser nologin;
      grant select, insert, update, delete on public.profiles to nosuperuser;
      grant select, insert, update, delete on public.warnings to nosuperuser;
      grant select, insert, update, delete on public.internal_notes to nosuperuser;
      grant select, insert, update, delete on public.audit_log to nosuperuser;
      grant select, insert, update, delete on public.settlements to nosuperuser;
      grant select on public.support_messages to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role;
      truncate public.profiles, public.warnings, public.internal_notes,
               public.audit_log, public.settlements, public.support_messages cascade;
      delete from auth.users;
      insert into auth.users (id) values
        ('${ADMIN}'), ('${SUPPORT}'), ('${USER_A}'), ('${USER_B}'), ('${DEV}');
      insert into public.profiles (id, role, email, stripe_customer_id, display_name) values
        ('${ADMIN}',   'admin',     'admin@x.com',       'cus_admin', 'Admin'),
        ('${SUPPORT}', 'support',   'support@x.com',     'cus_supp',  'Support'),
        ('${DEV}',     'developer', 'dev@x.com',         'cus_dev',   'Dev'),
        ('${USER_A}',  'user',      'alice@example.com', 'cus_alice12345', 'Alice'),
        ('${USER_B}',  'user',      'bob@example.com',   'cus_bob',   'Bob');
    `);
  });

  const auditCount = async (action) => {
    const { rows } = await db.query(`select count(*)::int n from public.audit_log where action = $1`, [action]);
    return rows[0].n;
  };

  // ── 1. Non-elevated user cannot invoke any admin action ───────────────────
  it('a plain user cannot issue_warning / add_internal_note (actor role gate)', async () => {
    await expect(rpc(`select public.issue_warning('${USER_B}', '${USER_A}', 'minor', 'spam')`))
      .rejects.toThrow(/not authorized/i);
    await expect(rpc(`select public.add_internal_note('${USER_B}', '${USER_A}', 'sus')`))
      .rejects.toThrow(/not authorized/i);
  });

  it('a plain user cannot ban / disable / soft-delete (highest-role-only)', async () => {
    await expect(rpc(`select public.set_account_banned('${USER_B}', '${USER_A}', true, 'x')`))
      .rejects.toThrow(/not authorized/i);
    await expect(rpc(`select public.set_account_disabled('${USER_B}', '${USER_A}', true, 'x')`))
      .rejects.toThrow(/not authorized/i);
  });

  // ── 2. internal_notes: subject CANNOT read about themselves; elevated can ──
  it('a user CANNOT read internal notes written about THEMSELVES', async () => {
    await rpc(`select public.add_internal_note('${ADMIN}', '${USER_A}', 'flagged for review')`);
    const { rows } = await queryAs(USER_A, 'select count(*)::int n from public.internal_notes');
    expect(rows[0].n).toBe(0); // RLS hides it from the subject
    // …but an elevated role sees it.
    const { rows: ev } = await queryAs(ADMIN, 'select count(*)::int n from public.internal_notes');
    expect(ev[0].n).toBe(1);
  });

  // ── 3. warnings: user reads OWN, not another's ────────────────────────────
  it('a user CAN read their OWN warnings but not another user\'s', async () => {
    await rpc(`select public.issue_warning('${ADMIN}', '${USER_A}', 'minor', 'be nice')`);
    const mine = await queryAs(USER_A, 'select count(*)::int n from public.warnings');
    expect(mine.rows[0].n).toBe(1);
    const theirs = await queryAs(USER_B, 'select count(*)::int n from public.warnings');
    expect(theirs.rows[0].n).toBe(0);
  });

  // ── 4. each action writes EXACTLY ONE audit row ───────────────────────────
  it('issue_warning writes exactly one audit row', async () => {
    await rpc(`select public.issue_warning('${ADMIN}', '${USER_A}', 'major', 'final notice')`);
    expect(await auditCount('issue_warning')).toBe(1);
    const { rows } = await db.query(`select actor_id, target_user_id, user_notified from public.audit_log where action = 'issue_warning'`);
    expect(rows[0].actor_id).toBe(ADMIN);
    expect(rows[0].target_user_id).toBe(USER_A);
  });

  it('add_internal_note writes one audit row WITHOUT the note body', async () => {
    await rpc(`select public.add_internal_note('${ADMIN}', '${USER_A}', 'alice@example.com mentioned')`);
    expect(await auditCount('add_internal_note')).toBe(1);
    const { rows } = await db.query(`select after_state from public.audit_log where action = 'add_internal_note'`);
    // the audit carries a length, never the note body / the PII it might quote.
    expect(JSON.stringify(rows[0].after_state)).not.toContain('alice@example.com');
  });

  // ── 5. ban/disable set reversible flags (no hard delete) ──────────────────
  it('ban sets a reversible timestamp + audits was_reversible=true, was_destructive=false', async () => {
    await rpc(`select public.set_account_banned('${ADMIN}', '${USER_A}', true, 'abuse')`);
    const { rows: prof } = await db.query(`select banned_at from public.profiles where id = '${USER_A}'`);
    expect(prof[0].banned_at).not.toBeNull();          // flag set, row still exists
    const { rows: audit } = await db.query(`select action, was_destructive, was_reversible from public.audit_log where target_user_id = '${USER_A}'`);
    expect(audit).toHaveLength(1);
    expect(audit[0].action).toBe('ban_account');
    expect(audit[0].was_destructive).toBe(false);
    expect(audit[0].was_reversible).toBe(true);

    // …and unban clears it (reversible).
    await rpc(`select public.set_account_banned('${ADMIN}', '${USER_A}', false, 'appeal granted')`);
    const { rows: after } = await db.query(`select banned_at from public.profiles where id = '${USER_A}'`);
    expect(after[0].banned_at).toBeNull();
  });

  it('disable sets a reversible timestamp; the user row is never deleted', async () => {
    await rpc(`select public.set_account_disabled('${DEV}', '${USER_A}', true, 'pending review')`);
    const { rows } = await db.query(`select id, disabled_at from public.profiles where id = '${USER_A}'`);
    expect(rows).toHaveLength(1);                       // not deleted
    expect(rows[0].disabled_at).not.toBeNull();
  });

  it('soft_delete_settlement flags + unpublishes (reversible), never DELETEs the row', async () => {
    await db.exec(`insert into public.settlements (id, user_id, is_public, public_slug) values ('66666666-6666-6666-6666-666666666666', '${USER_A}', true, 'slug-x')`);
    await rpc(`select public.admin_soft_delete_settlement('${ADMIN}', '66666666-6666-6666-6666-666666666666', true, 'moderation')`);
    const { rows } = await db.query(`select is_public, admin_deleted_at from public.settlements where id = '66666666-6666-6666-6666-666666666666'`);
    expect(rows).toHaveLength(1);                       // row survives
    expect(rows[0].is_public).toBe(false);             // unpublished
    expect(rows[0].admin_deleted_at).not.toBeNull();   // reversible flag
    expect(await auditCount('soft_delete_settlement')).toBe(1);
  });

  it('revoke_share_link clears the slug (reversible) + audits one row', async () => {
    await db.exec(`insert into public.settlements (id, user_id, is_public, public_slug) values ('77777777-7777-7777-7777-777777777777', '${USER_A}', true, 'slug-y')`);
    await rpc(`select public.admin_revoke_share_link('${ADMIN}', '77777777-7777-7777-7777-777777777777', 'dmca')`);
    const { rows } = await db.query(`select public_slug, is_public from public.settlements where id = '77777777-7777-7777-7777-777777777777'`);
    expect(rows[0].public_slug).toBeNull();
    expect(rows[0].is_public).toBe(false);
    expect(await auditCount('revoke_share_link')).toBe(1);
  });

  // ── 6. diagnostic bundle: redacted default vs full-with-justification ──────
  it('the REDACTED bundle is allowed for support and carries a MASKED email only', async () => {
    const { rows } = await rpc(`select public.admin_diagnostic_bundle('${SUPPORT}', '${USER_A}', false, null) as b`);
    expect(rows[0].b.redacted).toBe(true);
    expect(rows[0].b.email_masked).toBe('a***@example.com');
    expect(rows[0].b.email).toBeUndefined();           // no raw email
    expect(JSON.stringify(rows[0].b)).not.toContain('alice@example.com');
    expect(await auditCount('export_diagnostic')).toBe(1);
  });

  it('a FULL debug copy requires the HIGHEST role AND a justification', async () => {
    // support is rejected for the full variant.
    await expect(rpc(`select public.admin_diagnostic_bundle('${SUPPORT}', '${USER_A}', true, 'snooping')`))
      .rejects.toThrow(/admin or developer/i);
    // admin without a reason is rejected.
    await expect(rpc(`select public.admin_diagnostic_bundle('${ADMIN}', '${USER_A}', true, '   ')`))
      .rejects.toThrow(/justification is required/i);
    // admin WITH a reason gets the raw email + exactly one audit row.
    const { rows } = await rpc(`select public.admin_diagnostic_bundle('${ADMIN}', '${USER_A}', true, 'incident #7') as b`);
    expect(rows[0].b.redacted).toBe(false);
    expect(rows[0].b.email).toBe('alice@example.com'); // raw, unmasked
    expect(await auditCount('export_full_debug')).toBe(1);
    // the audit row itself never carries the raw email.
    const { rows: a } = await db.query(`select after_state from public.audit_log where action = 'export_full_debug'`);
    expect(JSON.stringify(a[0].after_state)).not.toContain('alice@example.com');
  });

  it('billing summary masks the stripe customer id (no raw id) + audits review_billing', async () => {
    const { rows } = await rpc(`select public.admin_billing_summary('${SUPPORT}', '${USER_A}') as b`);
    expect(rows[0].b.customer_masked).toBe('***2345');  // tail only
    expect(JSON.stringify(rows[0].b)).not.toContain('cus_alice12345');
    expect(await auditCount('review_billing')).toBe(1);
  });

  // ── 7. support cannot perform highest-role-only writes ────────────────────
  it('support CANNOT ban/disable/soft-delete (highest-role only)', async () => {
    await expect(rpc(`select public.set_account_banned('${SUPPORT}', '${USER_A}', true, 'x')`))
      .rejects.toThrow(/admin or developer/i);
    await expect(rpc(`select public.set_account_disabled('${SUPPORT}', '${USER_A}', true, 'x')`))
      .rejects.toThrow(/admin or developer/i);
    await expect(rpc(`select public.admin_soft_delete_settlement('${SUPPORT}', '66666666-6666-6666-6666-666666666666', true, 'x')`))
      .rejects.toThrow(/not authorized/i);
  });

  it('support CAN issue a warning + add a note (support+ actions)', async () => {
    await rpc(`select public.issue_warning('${SUPPORT}', '${USER_A}', 'notice', 'gentle reminder')`);
    await rpc(`select public.add_internal_note('${SUPPORT}', '${USER_A}', 'watching')`);
    expect(await auditCount('issue_warning')).toBe(1);
    expect(await auditCount('add_internal_note')).toBe(1);
  });

  // ── admin_user_summary: redacted management view ──────────────────────────
  it('admin_user_summary returns the REDACTED management view (counts, status, masked email)', async () => {
    await rpc(`select public.issue_warning('${ADMIN}', '${USER_A}', 'minor', 'w')`);
    await db.exec(`insert into public.settlements (user_id, is_public) values ('${USER_A}', true), ('${USER_A}', false)`);
    const { rows } = await queryAs(SUPPORT, `select public.admin_user_summary('${USER_A}') as s`);
    const s = rows[0].s;
    expect(s.redacted).toBe(true);
    expect(s.email_masked).toBe('a***@example.com');
    expect(s.email).toBeUndefined();
    expect(s.settlements).toBe(2);
    expect(s.gallery_items).toBe(1);
    expect(s.warnings).toBe(1);
    expect(s.banned).toBe(false);
    expect(s.disabled).toBe(false);
    expect(typeof s.account_age_days).toBe('number');
  });
});

// ── Static contract: warnings/internal_notes are append-only (no write policy) ─
describe.runIf(allExist)('A4 — warnings/internal_notes are append-only by RLS (static)', () => {
  const s053 = sql('053');
  it('internal_notes has NO insert/update/delete policy (written only via the RPC)', () => {
    expect(s053).not.toMatch(/create policy[^;]*on public\.internal_notes[\s\S]*?for\s+(insert|update|delete)/i);
  });
  it('the subject is NOT in the internal_notes read policy (no self-read)', () => {
    const m = s053.match(/create policy "Elevated read internal notes"[\s\S]*?;/i);
    expect(m).toBeTruthy();
    expect(m[0]).not.toMatch(/auth\.uid\(\)\s*=\s*user_id/i);
  });
  it('warnings has NO insert/update/delete policy (written only via the RPC)', () => {
    expect(s053).not.toMatch(/create policy[^;]*on public\.warnings[\s\S]*?for\s+(insert|update|delete)/i);
  });
});
