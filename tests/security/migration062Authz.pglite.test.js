/**
 * migration062Authz.pglite.test.js — EXECUTION proof for the three authorization
 * gaps closed by migration 062, each with a SENTINEL (isolated db) showing the
 * gap REPRODUCES without 062 so the assertions are load-bearing, not vacuous.
 *
 *   GAP 1  analytics_daily_rollups + export_cursors get RLS enabled (038 left it
 *          off). Asserted structurally on pg_class.relrowsecurity.
 *   GAP 2  the un-audited "Developers update any profile" policy (033) is DROPPED,
 *          so a privileged account can no longer direct-UPDATE another user's
 *          credits/role via PostgREST (it must go through the audited RPCs).
 *   GAP 3  the owner support-ticket UPDATE policy (055) is column-locked, so a
 *          ticket owner can no longer tamper with status/priority/assignee.
 *
 * GAP 2/3 run the REAL policy bodies (extracted verbatim from the migrations)
 * under FORCE ROW LEVEL SECURITY as a non-superuser role — the faithful direct-
 * PostgREST path. Assertions are effect-based (read-back after reset role).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '033': resolve(dir, '033_security_review_hardening.sql'),
  '055': resolve(dir, '055_support_tickets.sql'),
  '062': resolve(dir, '062_close_authz_gaps.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

function extractPolicy(migKey, title) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = src.match(new RegExp(`create policy "${esc}"[\\s\\S]*?;\\s*\\n`, 'i'));
  if (!m) throw new Error(`could not extract policy "${title}" from ${migKey}`);
  return m[0];
}
const mig062 = () => readFileSync(MIG['062'], 'utf-8');

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allExist).toBe(true);
});

describe.runIf(allExist)('062 migration content is wired (binds the test to the real SQL)', () => {
  it('drops the dev-update bypass and enables RLS on the two analytics tables', () => {
    const sql = mig062();
    expect(sql).toMatch(/drop policy if exists "Developers update any profile" on public\.profiles/i);
    expect(sql).toMatch(/alter table public\.analytics_daily_rollups\s+enable row level security/i);
    expect(sql).toMatch(/alter table public\.export_cursors\s+enable row level security/i);
  });
});

// ── GAP 1: analytics tables get RLS ───────────────────────────────────────────
describe.runIf(allExist)('GAP 1 — analytics tables have RLS enabled by 062', () => {
  it('relrowsecurity is true on both tables after applying 062 enable-RLS', async () => {
    const db = new PGlite();
    await db.exec(`
      create table public.analytics_daily_rollups (day date, metric text, dims jsonb, value bigint);
      create table public.export_cursors (name text primary key, last_id bigint);
    `);
    // Apply ONLY 062's enable-RLS statements (the rest reference tables not in this
    // minimal db). Hardcoded to mirror the migration; the wiring test above proves
    // 062 actually contains them.
    await db.exec(`
      alter table public.analytics_daily_rollups enable row level security;
      alter table public.export_cursors enable row level security;
    `);
    const r = await db.query(`select relname, relrowsecurity from pg_class
      where relname in ('analytics_daily_rollups','export_cursors') order by relname`);
    expect(r.rows.map((x) => x.relrowsecurity)).toEqual([true, true]);
  });

  it('SENTINEL: a table created without enable-RLS reports relrowsecurity=false', async () => {
    const db = new PGlite();
    await db.exec(`create table public.export_cursors (name text primary key, last_id bigint);`);
    const r = await db.query(`select relrowsecurity from pg_class where relname='export_cursors'`);
    expect(r.rows[0].relrowsecurity).toBe(false); // the 038 gap, reproduced
  });
});

// ── GAP 2: the privileged direct-UPDATE bypass is removed ─────────────────────
// The real escalation is SELF-escalation: permissive RLS policies OR their WITH
// CHECKs, so the dev policy's un-column-locked `with check (privileged)` = true
// OVERRIDES the column-locked self-update policy for a privileged user's OWN row.
// We model a representative column-locked self policy (credits + role pinned) and
// the REAL 033 dev policy (extracted), and prove dropping the dev policy (062)
// lets the self-policy's column lock finally govern.
async function profilesDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
      select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false) $fn$;
    create table public.profiles (
      id uuid primary key, role text default 'user', tier text default 'free',
      credits integer not null default 0, is_founder boolean not null default false,
      display_name text
    );
    create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
    -- Representative column-locked self-update policy (the real one is 059/061).
    create policy "Users update own profile (safe preferences only)" on public.profiles
      for update using (auth.uid() = id)
      with check (
        auth.uid() = id
        and credits is not distinct from (select credits from public.profiles where id = auth.uid())
        and role    is not distinct from (select role    from public.profiles where id = auth.uid())
      );
    alter table public.profiles enable row level security;
    alter table public.profiles force row level security;
    create role nosuperuser nologin;
    grant select, insert, update, delete on public.profiles to nosuperuser;
  `);
  await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}','user',0), ('${OTHER}','user',0);`);
  return db;
}
const asPrivileged = async (db, sql) => {
  try { await db.exec(`set role nosuperuser; set test.privileged='true'; set test.uid='${UID}'; ${sql}`); return 'ok'; }
  catch { return 'rejected'; }
  finally { await db.exec('reset role;'); }
};
const creditsOf = async (db, id) => { await db.exec('reset role;'); return (await db.query(`select credits from public.profiles where id='${id}'`)).rows[0].credits; };
const fieldOf = async (db, id, col) => { await db.exec('reset role;'); return (await db.query(`select ${col} as v from public.profiles where id='${id}'`)).rows[0].v; };

describe.runIf(allExist)('GAP 2 — dev profiles-UPDATE bypass removed by 062', () => {
  it('after 062 (dev policy dropped) a privileged account CANNOT self-escalate its own credits/role', async () => {
    const db = await profilesDb();
    await db.exec(extractPolicy('033', 'Developers update any profile'));
    await db.exec('drop policy if exists "Developers update any profile" on public.profiles;'); // what 062 does
    // Now only the column-locked self policy governs: the WITH CHECK rejects.
    expect(await asPrivileged(db, `update public.profiles set credits = 9999, role='admin' where id='${UID}';`)).toBe('rejected');
    expect(await creditsOf(db, UID)).toBe(0);
    expect(await fieldOf(db, UID, 'role')).toBe('user');
  });

  it('after 062 a privileged account CAN still edit a non-sensitive field on its own profile', async () => {
    const db = await profilesDb();
    await db.exec(extractPolicy('033', 'Developers update any profile'));
    await db.exec('drop policy if exists "Developers update any profile" on public.profiles;');
    expect(await asPrivileged(db, `update public.profiles set display_name='Dev' where id='${UID}';`)).toBe('ok');
    expect(await fieldOf(db, UID, 'display_name')).toBe('Dev');
  });

  it('SENTINEL: under the 033 dev policy (no 062), the privileged SELF-escalation SUCCEEDS', async () => {
    const db = await profilesDb();
    await db.exec(extractPolicy('033', 'Developers update any profile'));
    // The dev policy's permissive `with check (privileged)` = true ORs past the
    // column-locked self policy, so credits/role move — the audit-bypass gap.
    await asPrivileged(db, `update public.profiles set credits = 9999, role='admin' where id='${UID}';`);
    expect(await creditsOf(db, UID)).toBe(9999);
    expect(await fieldOf(db, UID, 'role')).toBe('admin');
  });
});

// ── GAP 3: owner support-ticket UPDATE is column-locked ───────────────────────
async function supportDb(policyMigKey) {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create table public.support_messages (
      id uuid primary key default gen_random_uuid(), user_id uuid not null,
      subject text, message text, status text default 'new', priority text default 'normal',
      assignee uuid, ticket_number text, linked_faq text, metadata jsonb default '{}'::jsonb
    );
    create policy "Users read own support messages" on public.support_messages for select using (auth.uid() = user_id);
    alter table public.support_messages enable row level security;
    alter table public.support_messages force row level security;
    create role nosuperuser nologin;
    grant select, insert, update, delete on public.support_messages to nosuperuser;
  `);
  await db.exec(`insert into public.support_messages (id, user_id, subject, message, status, priority)
    values ('33333333-3333-3333-3333-333333333333', '${UID}', 'Help', 'broken', 'new', 'normal');`);
  await db.exec(extractPolicy(policyMigKey, 'Users update own support ticket'));
  return db;
}
const TID = '33333333-3333-3333-3333-333333333333';
const asOwner = async (db, sql) => {
  try { await db.exec(`set role nosuperuser; set test.uid='${UID}'; ${sql}`); return 'ok'; }
  catch { return 'rejected'; }
  finally { await db.exec('reset role;'); }
};
const ticketField = async (db, col) => { await db.exec('reset role;'); return (await db.query(`select ${col} as v from public.support_messages where id='${TID}'`)).rows[0].v; };

describe.runIf(allExist)('GAP 3 — owner support-ticket UPDATE column-locked by 062', () => {
  let db;
  beforeAll(async () => { db = await supportDb('062'); });
  beforeEach(async () => {
    await db.exec(`reset role; update public.support_messages set status='new', priority='normal', assignee=null, subject='Help' where id='${TID}';`);
  });

  it('owner CAN still add context (edit subject/message)', async () => {
    expect(await asOwner(db, `update public.support_messages set subject='Help (more info)' where id='${TID}';`)).toBe('ok');
    expect(await ticketField(db, 'subject')).toBe('Help (more info)');
  });

  it('owner CANNOT self-resolve (status pinned)', async () => {
    expect(await asOwner(db, `update public.support_messages set status='resolved' where id='${TID}';`)).toBe('rejected');
    expect(await ticketField(db, 'status')).toBe('new');
  });

  it('owner CANNOT queue-jump (priority pinned)', async () => {
    expect(await asOwner(db, `update public.support_messages set priority='urgent' where id='${TID}';`)).toBe('rejected');
    expect(await ticketField(db, 'priority')).toBe('normal');
  });

  it('owner CANNOT reassign the ticket (assignee pinned)', async () => {
    expect(await asOwner(db, `update public.support_messages set assignee='${OTHER}' where id='${TID}';`)).toBe('rejected');
    expect(await ticketField(db, 'assignee')).toBeNull();
  });

  it('owner CANNOT smuggle a status change alongside a legit subject edit', async () => {
    expect(await asOwner(db, `update public.support_messages set subject='x', status='closed' where id='${TID}';`)).toBe('rejected');
    expect(await ticketField(db, 'status')).toBe('new');
    expect(await ticketField(db, 'subject')).toBe('Help');
  });
});

describe.runIf(allExist)('SENTINEL — the owner support-ticket gap reproduces under the 055 policy alone', () => {
  it('under 055 (no column lock) the owner CAN self-resolve their ticket', async () => {
    const db = await supportDb('055');
    await asOwner(db, `update public.support_messages set status='resolved', priority='urgent' where id='${TID}';`);
    expect(await ticketField(db, 'status')).toBe('resolved'); // the gap, reproduced
    expect(await ticketField(db, 'priority')).toBe('urgent');
  });
});
