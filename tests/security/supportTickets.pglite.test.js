/**
 * supportTickets.pglite.test.js — EXECUTION-level proof of the Phase A5 support
 * ticket workflow RLS + RPCs (migration 055), run against in-process Postgres
 * (pglite). Layers the REAL 055 DDL/RPCs on top of a minimal auth + 050/051
 * foundation (has_role / current_user_is_support_or_higher / write_audit /
 * mask_email + audit_log).
 *
 * Same pglite caveats as adminLeastPrivilege.pglite:
 *   • pglite's default connection is SUPERUSER and BYPASSES RLS even when
 *     enabled — so we `force row level security` AND run attacking statements as
 *     a `nosuperuser` role.
 *   • single-connection FUNCTION-execute grants aren't enforced, so the RPCs'
 *     OWN role checks (has_role / current_user_is_support_or_higher) ARE the
 *     gate exercised — exactly the server-side enforcement A5 relies on.
 *
 * What it proves:
 *   1. A user reads ONLY their own tickets (RLS) and ONLY user-visible events;
 *      an INTERNAL note on their own ticket is INVISIBLE to the owner (the core
 *      least-privilege claim) — both via direct table SELECT and via the
 *      list_ticket_thread RPC.
 *   2. A non-agent cannot read the pool (list_ticket_pool rejects) and cannot
 *      claim / set-status / link-FAQ (the agent RPCs reject).
 *   3. support+ reads the pool + ALL events; claim + status-change + link-FAQ
 *      write an audit row each; ticket numbers are unique and minted on insert.
 *   4. An existing pre-A5 support_messages row survives the migration with a
 *      generated ticket_number and a valid status.
 *   5. post_ticket_reply: owner→user-reply only (an owner CANNOT post an
 *      internal note); agent→either; an owner reply on a resolved ticket
 *      reopens it.
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
/** Mint a ticket via the definer RPC and return its uuid. */
async function createTicket(actor, subject, message) {
  const { rows } = await db.query(
    `select public.create_ticket('${actor}'::uuid, $1, $2, 'alice@example.com') as t`,
    [subject, message],
  );
  return rows[0].t.id;
}

describe.runIf(allExist)('A5 support tickets — executed against 050/051/055 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    const s050 = sql('050'), s051 = sql('051'), s055 = sql('055');

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
        email text,
        display_name text,
        created_at timestamptz not null default now()
      );

      -- migration-002 support_messages base shape (pre-A5). The 055 migration
      -- adds the ticket columns on top; we apply 055's ALTER below.
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

      -- migration-002 owner read + insert on support_messages.
      create policy "Users read own support messages" on public.support_messages
        for select using (auth.uid() = user_id);
      create policy "Users create support messages" on public.support_messages
        for insert with check (auth.uid() = user_id);

      alter table public.support_messages enable row level security;
      alter table public.support_messages force row level security;
    `);

    // ── 050/051 helpers the 055 RPCs + policies depend on. ───────────────────
    for (const fn of [
      'has_role', 'current_user_is_support_or_higher', 'mask_email',
    ]) {
      await db.exec(extractFn(s050, fn));
    }
    // The 050 "Elevated update support message status" policy (agent triage).
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

    // ── Seed ONE pre-A5 row BEFORE applying the 055 migration, to prove the
    // existing row survives the backfill with a number + valid status. ────────
    await db.exec(`
      insert into auth.users (id) values ('${USER_A}');
      insert into public.support_messages (user_id, email, subject, message, status)
        values ('${USER_A}', 'alice@example.com', 'Pre-A5 ticket', 'old body', 'read');
    `);

    // The 055 migration GRANTs execute to `service_role` / `authenticated`,
    // which exist in Supabase but not in vanilla pglite. Create them so the
    // whole migration file applies verbatim.
    await db.exec(`
      do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role')
        then create role service_role nologin; end if; end $$;
      do $$ begin if not exists (select 1 from pg_roles where rolname = 'authenticated')
        then create role authenticated nologin; end if; end $$;
    `);

    // ── Apply the FULL 055 migration (sequence, ALTERs, backfill, triggers,
    // events table + policy, all RPCs). pglite runs the whole file. ───────────
    await db.exec(s055);

    // ── Non-superuser attack role + table grants (RLS still gates rows). ─────
    // The migration REVOKEs execute from public and GRANTs only to
    // service_role / authenticated. nosuperuser models the attacking client; we
    // grant it execute on the ticket RPCs to mirror how production reaches them
    // (user RPCs via `authenticated`; the service-role RPCs via the edge fn's
    // service-role client). The RPCs' OWN role checks remain the real gate.
    await db.exec(`
      create role nosuperuser nologin;
      grant select, insert, update, delete on public.profiles to nosuperuser;
      grant select, insert, update, delete on public.support_messages to nosuperuser;
      grant select, insert, update, delete on public.support_ticket_events to nosuperuser;
      grant select, insert, update, delete on public.audit_log to nosuperuser;
      grant usage on sequence public.support_ticket_seq to nosuperuser;
      grant execute on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb) to nosuperuser;
      grant execute on function public.claim_ticket(uuid, uuid) to nosuperuser;
      grant execute on function public.set_ticket_status(uuid, uuid, text, text) to nosuperuser;
      grant execute on function public.post_ticket_reply(uuid, uuid, text, text) to nosuperuser;
      grant execute on function public.link_ticket_faq(uuid, uuid, text) to nosuperuser;
      grant execute on function public.list_my_tickets() to nosuperuser;
      grant execute on function public.list_ticket_pool(text, int) to nosuperuser;
      grant execute on function public.list_ticket_thread(uuid) to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role;
      truncate public.support_ticket_events, public.audit_log cascade;
      delete from public.support_messages;
      delete from public.profiles;
      delete from auth.users;
      insert into auth.users (id) values
        ('${ADMIN}'), ('${SUPPORT}'), ('${USER_A}'), ('${USER_B}');
      insert into public.profiles (id, role, email, display_name) values
        ('${ADMIN}',   'admin',   'admin@x.com',       'Admin'),
        ('${SUPPORT}', 'support', 'support@x.com',     'Support'),
        ('${USER_A}',  'user',    'alice@example.com', 'Alice'),
        ('${USER_B}',  'user',    'bob@example.com',   'Bob');
    `);
  });

  // ── 1. Existing pre-A5 row survived the migration ─────────────────────────
  it('an existing pre-A5 support_messages row got a ticket_number + valid status', async () => {
    // Re-seed a legacy-status row (truncate cleared the original); the running
    // trigger + constraint must accept it and mint a number.
    await db.exec(`reset role;
      insert into public.support_messages (user_id, email, subject, message)
        values ('${USER_A}', 'alice@example.com', 'Legacy', 'legacy body');`);
    const { rows } = await db.query(
      `select ticket_number, status from public.support_messages where subject = 'Legacy'`,
    );
    expect(rows[0].ticket_number).toMatch(/^SF-\d{6}$/);
    expect(['new', 'triage', 'assigned', 'in_progress', 'waiting_on_user',
      'resolved', 'closed', 'reopened']).toContain(rows[0].status);
  });

  // ── 2. Ticket numbers are unique + minted on create ───────────────────────
  it('create_ticket mints a unique SF-###### number', async () => {
    const t1 = await createTicket(USER_A, 'First', 'body one');
    const t2 = await createTicket(USER_A, 'Second', 'body two');
    const { rows } = await db.query(
      `select ticket_number from public.support_messages where id in ('${t1}','${t2}') order by ticket_number`,
    );
    expect(rows).toHaveLength(2);
    expect(rows[0].ticket_number).toMatch(/^SF-\d{6}$/);
    expect(rows[0].ticket_number).not.toBe(rows[1].ticket_number);
  });

  // ── 3. Owner reads only own tickets; not others' ──────────────────────────
  it('a user reads ONLY their own tickets (RLS denies others)', async () => {
    await createTicket(USER_A, 'A ticket', 'a');
    await createTicket(USER_B, 'B ticket', 'b');
    const { rows } = await queryAs(USER_A, 'select subject from public.support_messages');
    expect(rows.map((r) => r.subject)).toEqual(['A ticket']);
  });

  // ── 4. THE CORE CLAIM: an internal note is invisible to the owner ─────────
  it('an internal note on the owner\'s ticket is INVISIBLE to the owner (direct SELECT)', async () => {
    const t = await createTicket(USER_A, 'Need help', 'broken');
    // agent posts a user-visible reply + an internal note.
    await db.query(`select public.post_ticket_reply('${SUPPORT}'::uuid, '${t}'::uuid, 'we are on it', 'user')`);
    await db.query(`select public.post_ticket_reply('${SUPPORT}'::uuid, '${t}'::uuid, 'SECRET internal note', 'internal')`);

    // Owner direct SELECT on events: sees the user reply, NOT the internal note.
    const { rows } = await queryAs(USER_A, `select body, visibility from public.support_ticket_events where ticket_id = '${t}'`);
    const bodies = rows.map((r) => r.body);
    expect(bodies).toContain('we are on it');
    expect(bodies).not.toContain('SECRET internal note');
    expect(rows.every((r) => r.visibility === 'user')).toBe(true);
  });

  it('list_ticket_thread hides the internal note from the owner but shows it to an agent', async () => {
    const t = await createTicket(USER_A, 'Need help', 'broken');
    await db.query(`select public.post_ticket_reply('${SUPPORT}'::uuid, '${t}'::uuid, 'public reply', 'user')`);
    await db.query(`select public.post_ticket_reply('${SUPPORT}'::uuid, '${t}'::uuid, 'SECRET note', 'internal')`);

    const owner = await queryAs(USER_A, `select body from public.list_ticket_thread('${t}'::uuid)`);
    const ownerBodies = owner.rows.map((r) => r.body);
    expect(ownerBodies).toContain('public reply');
    expect(ownerBodies).not.toContain('SECRET note');

    const agent = await queryAs(SUPPORT, `select body from public.list_ticket_thread('${t}'::uuid)`);
    const agentBodies = agent.rows.map((r) => r.body);
    expect(agentBodies).toContain('public reply');
    expect(agentBodies).toContain('SECRET note'); // agent sees everything
  });

  it('a user cannot read another user\'s thread via list_ticket_thread', async () => {
    const t = await createTicket(USER_A, 'A private', 'a');
    await db.query(`select public.post_ticket_reply('${SUPPORT}'::uuid, '${t}'::uuid, 'reply to A', 'user')`);
    const { rows } = await queryAs(USER_B, `select body from public.list_ticket_thread('${t}'::uuid)`);
    expect(rows).toHaveLength(0); // not the owner, not an agent → nothing
  });

  // ── 5. Pool reads + agent gating ──────────────────────────────────────────
  it('a non-agent CANNOT read the pool (list_ticket_pool rejects)', async () => {
    await createTicket(USER_A, 't', 'b');
    await expect(
      asUser(USER_B, `select * from public.list_ticket_pool(null, 100)`),
    ).rejects.toThrow(/not authorized/i);
    await reset();
  });

  it('support+ reads the pool (masked email, all tickets)', async () => {
    await createTicket(USER_A, 'A', 'a');
    await createTicket(USER_B, 'B', 'b');
    for (const agent of [SUPPORT, ADMIN]) {
      const { rows } = await queryAs(agent, `select email_masked, subject from public.list_ticket_pool(null, 100)`);
      expect(rows.length).toBe(2);
      // masked, never raw.
      expect(rows.every((r) => /\*\*\*@/.test(r.email_masked))).toBe(true);
      expect(JSON.stringify(rows)).not.toContain('alice@example.com');
    }
  });

  // ── 6. claim / status / link-faq: agent-only + audited ────────────────────
  it('a non-agent cannot claim / set-status / link-faq', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await expect(asUser(USER_B, `select public.claim_ticket('${USER_B}'::uuid, '${t}'::uuid)`)).rejects.toThrow(/not authorized/i);
    await reset();
    await expect(asUser(USER_B, `select public.set_ticket_status('${USER_B}'::uuid, '${t}'::uuid, 'resolved', null)`)).rejects.toThrow(/not authorized/i);
    await reset();
    await expect(asUser(USER_B, `select public.link_ticket_faq('${USER_B}'::uuid, '${t}'::uuid, 'refundWindow')`)).rejects.toThrow(/not authorized/i);
    await reset();
  });

  it('claim_ticket assigns the agent + writes an audit row', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await db.query(`select public.claim_ticket('${SUPPORT}'::uuid, '${t}'::uuid)`);
    const { rows } = await db.query(`select assignee, status from public.support_messages where id = '${t}'`);
    expect(rows[0].assignee).toBe(SUPPORT);
    expect(rows[0].status).toBe('assigned');
    const { rows: audit } = await db.query(`select * from public.audit_log where action = 'claim_ticket'`);
    expect(audit).toHaveLength(1);
    expect(audit[0].actor_id).toBe(SUPPORT);
    expect(audit[0].actor_role).toBe('support');
    expect(audit[0].target_id).toBe(t);
  });

  it('set_ticket_status transitions + writes an audit row + a user-visible breadcrumb', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await db.query(`select public.set_ticket_status('${ADMIN}'::uuid, '${t}'::uuid, 'resolved', 'fixed it')`);
    const { rows } = await db.query(`select status from public.support_messages where id = '${t}'`);
    expect(rows[0].status).toBe('resolved');
    const { rows: audit } = await db.query(`select * from public.audit_log where action = 'set_ticket_status'`);
    expect(audit).toHaveLength(1);
    expect(audit[0].before_state.status).toBe('new');
    expect(audit[0].after_state.status).toBe('resolved');
    expect(audit[0].reason).toBe('fixed it');
    // the breadcrumb is a USER-visible status_change event (owner can see it).
    const ev = await queryAs(USER_A, `select kind, visibility from public.support_ticket_events where ticket_id = '${t}'`);
    expect(ev.rows.some((r) => r.kind === 'status_change' && r.visibility === 'user')).toBe(true);
  });

  it('link_ticket_faq sets the slug + writes an audit row', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await db.query(`select public.link_ticket_faq('${SUPPORT}'::uuid, '${t}'::uuid, 'refundWindow')`);
    const { rows } = await db.query(`select linked_faq from public.support_messages where id = '${t}'`);
    expect(rows[0].linked_faq).toBe('refundWindow');
    const { rows: audit } = await db.query(`select count(*)::int n from public.audit_log where action = 'link_ticket_faq'`);
    expect(audit[0].n).toBe(1);
  });

  // ── 7. post_ticket_reply visibility rules ─────────────────────────────────
  it('an owner CANNOT post an internal note (forced to user-reply path → rejected)', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await expect(
      asUser(USER_A, `select public.post_ticket_reply('${USER_A}'::uuid, '${t}'::uuid, 'sneaky', 'internal')`),
    ).rejects.toThrow(/not authorized: only agents post internal notes/i);
    await reset();
  });

  it('a stranger (non-owner, non-agent) cannot reply at all', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await expect(
      asUser(USER_B, `select public.post_ticket_reply('${USER_B}'::uuid, '${t}'::uuid, 'hi', 'user')`),
    ).rejects.toThrow(/not authorized/i);
    await reset();
  });

  it('an owner user-reply on a resolved ticket reopens it', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    await db.query(`select public.set_ticket_status('${SUPPORT}'::uuid, '${t}'::uuid, 'resolved', null)`);
    await db.query(`select public.post_ticket_reply('${USER_A}'::uuid, '${t}'::uuid, 'still broken', 'user')`);
    const { rows } = await db.query(`select status from public.support_messages where id = '${t}'`);
    expect(rows[0].status).toBe('reopened');
  });

  // ── 8. The internal-vs-user visibility constraint binds the columns ───────
  it('the visibility/kind consistency constraint rejects a mislabelled internal note', async () => {
    const t = await createTicket(USER_A, 't', 'b');
    // Try to insert an internal_note marked visibility='user' — the CHECK forbids it.
    await expect(
      db.exec(`insert into public.support_ticket_events (ticket_id, kind, visibility, body)
               values ('${t}', 'internal_note', 'user', 'leak attempt')`),
    ).rejects.toThrow(/support_event_visibility_consistent|violates check/i);
  });

  // ── 9. list_my_tickets is owner-scoped ────────────────────────────────────
  it('list_my_tickets returns only the caller\'s own tickets', async () => {
    await createTicket(USER_A, 'mine', 'a');
    await createTicket(USER_B, 'theirs', 'b');
    const { rows } = await queryAs(USER_A, `select subject from public.list_my_tickets()`);
    expect(rows.map((r) => r.subject)).toEqual(['mine']);
  });
});
