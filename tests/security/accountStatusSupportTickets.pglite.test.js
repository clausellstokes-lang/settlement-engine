/**
 * accountStatusSupportTickets.pglite.test.js — A+ closes the LAST two account-
 * status gaps on the SECURITY DEFINER write surface (adversarial finding on 055).
 *
 * 057 gated the credit/settlement write RPCs and 059 added a redundant in-body
 * account_is_active() guard to every gallery/map definer write RPC. But the two
 * support-ticket definer WRITE RPCs from 055 — create_ticket and
 * post_ticket_reply — were missed: `grep account_is_active 055` returns nothing.
 * Until 060 the only enforcement was the account-actions EDGE gate, so any
 * service_role caller invoking either RPC directly bypassed a ban with no DB
 * backstop. Migration 060 inserts the guard into both bodies, UNCONDITIONALLY on
 * p_actor (owner AND staff are gated — a disabled staff account is cut off too).
 *
 * This test loads the REAL 055 RPC bodies, the 057 account_is_active predicate, and
 * the 060 overrides into pglite and proves — at the DB layer, by calling the RPC
 * DIRECTLY (the service_role path that bypasses the edge gate) — that:
 *  (a) an ACTIVE actor CAN open a ticket and post a reply (baseline preserved),
 *  (b) a BANNED actor is BLOCKED from create_ticket,
 *  (c) a BANNED actor is BLOCKED from post_ticket_reply,
 *  (d) the gate also blocks a DISABLED / soft-DELETED actor (any 053/054 flag),
 *  (e) the post_ticket_reply gate applies to AGENT actors too (gates p_actor, not
 *      just owners), while an active agent's internal note still succeeds,
 *  (f) a SENTINEL (055 only, no 060) reproduces the bypass — a banned actor opens a
 *      ticket — so the "blocked" assertions are load-bearing, not vacuously green.
 *
 * Same pglite caveats as supportTickets.pglite: the default connection is SUPERUSER
 * and a SECURITY DEFINER fn runs as its (superuser) owner — exactly modelling the
 * service_role/RLS-bypassing direct call the guard must still reject. The guard is
 * the in-body account_is_active(p_actor) check, independent of the caller's role.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '050': resolve(dir, '050_admin_least_privilege.sql'),
  '051': resolve(dir, '051_audit_log.sql'),
  '055': resolve(dir, '055_support_tickets.sql'),
  '057': resolve(dir, '057_enforce_account_status_writes.sql'),
  '060': resolve(dir, '060_enforce_account_status_support_tickets.sql'),
};
const allExist = Object.values(MIG).every(existsSync);
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

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames, AND
// prove 060 actually carries the guard so a revert can't go green via runIf-skip.
describe('pglite targets exist + 060 carries the guard (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
  it('060 guards BOTH create_ticket and post_ticket_reply on account_is_active(p_actor)', () => {
    const s060 = sql('060');
    for (const name of ['create_ticket', 'post_ticket_reply']) {
      const body = extractFn(s060, name);
      expect(body, `${name} must call account_is_active(p_actor)`).toMatch(/account_is_active\(p_actor\)/);
    }
  });
});

/** Build a pglite db with the auth + 050/051/055/057 foundation. Applies the 060
 *  overrides only when `with060` is true (the SENTINEL omits them). Returns the db. */
async function buildDb({ with060 }) {
  const db = new PGlite();
  const s050 = sql('050'), s051 = sql('051'), s055 = sql('055'), s057 = sql('057');

  // ── Minimal auth + base tables. profiles carries the 053/054 lockout flags so
  //    account_is_active (language sql, validated at CREATE) resolves its columns.
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    create table auth.users (id uuid primary key);

    create table public.profiles (
      id uuid primary key,
      role text not null default 'user',
      email text,
      display_name text,
      banned_at   timestamptz,
      disabled_at timestamptz,
      deleted_at  timestamptz,
      created_at timestamptz not null default now()
    );

    -- migration-002 support_messages base shape (pre-A5); 055 ALTERs it.
    create table public.support_messages (
      id uuid primary key default gen_random_uuid(),
      user_id uuid,
      email text not null,
      subject text not null,
      message text not null,
      status text not null default 'new'
        check (status in ('new', 'read', 'replied', 'closed')),
      created_at timestamptz not null default now()
    );
    create policy "Users read own support messages" on public.support_messages
      for select using (auth.uid() = user_id);
    create policy "Users create support messages" on public.support_messages
      for insert with check (auth.uid() = user_id);
    alter table public.support_messages enable row level security;
    alter table public.support_messages force row level security;
  `);

  // 050 helpers the 055 RPCs depend on, + the 050 agent-triage update policy.
  for (const fn of ['has_role', 'current_user_is_support_or_higher', 'mask_email']) {
    await db.exec(extractFn(s050, fn));
  }
  await db.exec(extractPolicy(s050, 'Elevated update support message status'));

  // audit_log + write_audit (051).
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
  await db.exec(extractFn(s051, 'write_audit'));

  // 057 account_is_active — the status predicate the guard calls (must exist
  // before 055/060 create_ticket/post_ticket_reply reference it).
  await db.exec(extractFn(s057, 'account_is_active'));

  // service_role / authenticated exist in Supabase but not vanilla pglite.
  await db.exec(`
    do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role')
      then create role service_role nologin; end if; end $$;
    do $$ begin if not exists (select 1 from pg_roles where rolname = 'authenticated')
      then create role authenticated nologin; end if; end $$;
  `);

  // Apply the FULL 055 migration (this is the UN-guarded baseline), then — unless
  // we are the SENTINEL — the 060 overrides that insert the account_is_active guard.
  await db.exec(s055);
  if (with060) await db.exec(sql('060'));
  return db;
}

describe.runIf(allExist)('account-status support-ticket gate — executed against 050/051/055/057/060 (pglite)', () => {
  let db;
  beforeAll(async () => { db = await buildDb({ with060: true }); });

  beforeEach(async () => {
    await db.exec(`
      reset role;
      truncate public.support_ticket_events, public.audit_log cascade;
      delete from public.support_messages;
      delete from public.profiles;
      delete from auth.users;
      insert into auth.users (id) values ('${ADMIN}'), ('${SUPPORT}'), ('${USER_A}'), ('${USER_B}');
      insert into public.profiles (id, role, email, display_name) values
        ('${ADMIN}',   'admin',   'admin@x.com',       'Admin'),
        ('${SUPPORT}', 'support', 'support@x.com',     'Support'),
        ('${USER_A}',  'user',    'alice@example.com', 'Alice'),
        ('${USER_B}',  'user',    'bob@example.com',   'Bob');
    `);
  });

  // Flag the actor's account (banned_at by default) — service-role/owner UPDATE.
  const flag = (uid, col = 'banned_at') =>
    db.exec(`reset role; update public.profiles set ${col} = now() where id = '${uid}';`);
  // Direct RPC call (models the service_role path that bypasses the edge gate).
  const createTicket = (actor) =>
    db.query(`select public.create_ticket('${actor}'::uuid, 'Subj', 'Body', 'a@x.com') as t`);
  const postReply = (actor, ticketId, vis = 'user') =>
    db.query(`select public.post_ticket_reply('${actor}'::uuid, '${ticketId}'::uuid, 'a reply', '${vis}') as r`);
  const newTicketId = async (actor) => (await createTicket(actor)).rows[0].t.id;

  // ── create_ticket ─────────────────────────────────────────────────────────
  it('an ACTIVE actor CAN open a ticket (baseline preserved)', async () => {
    const { rows } = await createTicket(USER_A);
    expect(rows[0].t.id).toBeTruthy();
    expect(rows[0].t.ticket_number).toMatch(/^SF-\d{6}$/);
  });

  it('a BANNED actor CANNOT open a ticket (account_is_active gate, direct RPC)', async () => {
    await flag(USER_A, 'banned_at');
    await expect(createTicket(USER_A)).rejects.toThrow(/account is not active/i);
    // and nothing was written.
    await db.exec('reset role;');
    const { rows } = await db.query(`select count(*)::int n from public.support_messages where user_id = '${USER_A}'`);
    expect(rows[0].n).toBe(0);
  });

  it('a DISABLED or soft-DELETED actor is likewise blocked from create_ticket', async () => {
    await flag(USER_A, 'disabled_at');
    await expect(createTicket(USER_A)).rejects.toThrow(/account is not active/i);
    await flag(USER_B, 'deleted_at');
    await expect(createTicket(USER_B)).rejects.toThrow(/account is not active/i);
  });

  // ── post_ticket_reply ─────────────────────────────────────────────────────
  it('an ACTIVE owner CAN post a reply (baseline preserved)', async () => {
    const t = await newTicketId(USER_A);
    const { rows } = await postReply(USER_A, t, 'user');
    expect(rows[0].r.kind).toBe('user_reply');
  });

  it('a BANNED owner CANNOT post a reply (account_is_active gate, direct RPC)', async () => {
    const t = await newTicketId(USER_A);   // created while active
    await flag(USER_A, 'banned_at');       // then banned
    await expect(postReply(USER_A, t, 'user')).rejects.toThrow(/account is not active/i);
    await db.exec('reset role;');
    const { rows } = await db.query(`select count(*)::int n from public.support_ticket_events where ticket_id = '${t}'`);
    expect(rows[0].n).toBe(0);             // no event written
  });

  it('a BANNED AGENT CANNOT post a reply either (the guard gates p_actor, not just owners)', async () => {
    const t = await newTicketId(USER_A);
    await flag(SUPPORT, 'banned_at');
    await expect(postReply(SUPPORT, t, 'internal')).rejects.toThrow(/account is not active/i);
  });

  it('an ACTIVE agent CAN still post an internal note (baseline preserved)', async () => {
    const t = await newTicketId(USER_A);
    const { rows } = await postReply(SUPPORT, t, 'internal');
    expect(rows[0].r.kind).toBe('internal_note');
    expect(rows[0].r.visibility).toBe('internal');
  });
});

// SENTINEL (isolated db): with 055 ONLY (no 060 override), the bypass is REAL — a
// banned actor opens a ticket through the un-guarded definer RPC. This proves the
// main suite's "banned blocked" assertions are load-bearing (they would fail if 060
// stopped guarding the RPCs).
describe.runIf(allExist)('SENTINEL — the bypass reproduces without the 060 guard', () => {
  it('a banned actor CAN open a ticket via the un-guarded 055 create_ticket', async () => {
    const db = await buildDb({ with060: false });
    await db.exec(`
      reset role;
      insert into auth.users (id) values ('${USER_A}');
      insert into public.profiles (id, role, email, display_name, banned_at)
        values ('${USER_A}', 'user', 'alice@example.com', 'Alice', now());
    `);
    const { rows } = await db.query(
      `select public.create_ticket('${USER_A}'::uuid, 'Subj', 'Body', 'a@x.com') as t`,
    );
    expect(rows[0].t.id).toBeTruthy();           // the bug, reproduced — the guard is necessary
    expect(rows[0].t.status).toBe('new');
  });
});
