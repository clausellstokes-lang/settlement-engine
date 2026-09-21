/**
 * staffUnlockSurveyorEntitlement.pglite.test.js — THE SERVER HALF OF §934.28.
 *
 * THE DEFECT. The §934.28 recon measured the staff bypass end to end and found
 * the server already near-total (36 SQL sites spell the two-role membership test
 * and 54 more call public.current_user_is_privileged()) with ONE hole:
 * public.has_surveyor_entitlement() (139) asked only whether an entitlement ROW
 * existed. That function is the AI layer's gate — NINE edge functions call it
 * (ai-analyst, construct-realm, construct-settlement, custom-content,
 * interpret-session, interview, parley, surveyor-autonomy, surveyor-byok), as
 * does surveyor_byok_set (159) on the SQL side.
 *
 * Meanwhile the CLIENT's Surveyor predicate has always admitted developer/admin.
 * So staff SAW the Surveyor door and the server answered 403 — the client
 * showing what the server refuses, which is the fail-closed law inverted, and
 * which made the whole AI layer untestable for the very accounts the owner
 * ordered it opened to.
 *
 * Migration 201 cures it at that ONE function rather than in nine edge
 * functions. This applies the REAL 018 + 139 + 201 SQL into pglite and measures
 * all four populations, in both directions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_139 = resolve(dir, '139_surveyor_entitlement_and_byok.sql');
const MIG_201 = resolve(dir, '201_staff_unlock_surveyor_entitlement.sql');

const MEMBER    = '11111111-1111-1111-1111-111111111111'; // role user, no entitlement
const SUBSCRIBER = '22222222-2222-2222-2222-222222222222'; // role user, ACTIVE entitlement
const DEVELOPER = '33333333-3333-3333-3333-333333333333';
const ADMIN     = '44444444-4444-4444-4444-444444444444';

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create table if not exists auth.users (id uuid primary key);
    -- The profiles shape 018's predicate reads, with 002's role CHECK verbatim so
    -- a role this product cannot mint cannot be planted by the fixture either.
    create table if not exists public.profiles (
      id uuid primary key,
      is_founder boolean default false,
      role text not null default 'user' check (role in ('user','developer','admin'))
    );
    insert into auth.users(id) values
      ('${MEMBER}'), ('${SUBSCRIBER}'), ('${DEVELOPER}'), ('${ADMIN}') on conflict do nothing;
    insert into public.profiles(id, role) values
      ('${MEMBER}', 'user'), ('${SUBSCRIBER}', 'user'),
      ('${DEVELOPER}', 'developer'), ('${ADMIN}', 'admin') on conflict do nothing;
    -- 018's staff predicate, VERBATIM from the migration's body (the whole 018
    -- file carries billing/credit DDL this fixture does not need).
    create or replace function public.current_user_is_privileged()
    returns boolean language sql stable security definer set search_path = public
    as $fn$
      select exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('developer', 'admin')
      );
    $fn$;
  `);
  await db.exec(readFileSync(MIG_139, 'utf-8'));
  // The SUBSCRIBER's real, paid entitlement row — the control that proves the
  // function still answers its original question.
  await db.exec(`
    insert into public.surveyor_entitlements (user_id, status)
    values ('${SUBSCRIBER}', 'active') on conflict do nothing;
  `);
  return db;
}

async function asUser(db, uid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid}', false)`);
}
async function asAnon(db) {
  await db.query(`select set_config('test.role', 'anon', false)`);
  await db.query(`select set_config('test.uid', '', false)`);
}
async function entitled(db) {
  const { rows } = await db.query('select public.has_surveyor_entitlement() as v');
  return rows[0].v;
}

let db;

/**
 * Wall-clock ceiling for the hook that boots PGlite. A hook timeout here is a
 * DEADLOCK GUARD, not a performance budget — the inherited 10000ms default sits
 * on pglite's boot-noise band under gate load, so an untimed hook goes flaky red
 * and the tests it feeds never execute. Generous is the point; kept in step with
 * the sibling suites (surveyorProvisioning.pglite.test.js).
 */
beforeEach(async () => { db = await makeDb(); }, 60000);

describe('has_surveyor_entitlement — BEFORE migration 201 (the measured defect)', () => {
  it('refuses staff, which is why the AI layer 403-ed the accounts the client admitted', async () => {
    // ⛔ THIS IS THE BUG, EXECUTED. Without it the cure below could be passing
    // because the function was already permissive, and the whole migration would
    // be ceremony. 139's body is applied and nothing else.
    await asUser(db, DEVELOPER);
    expect(await entitled(db)).toBe(false);
    await asUser(db, ADMIN);
    expect(await entitled(db)).toBe(false);
    // …while the paying subscriber passed all along (liveness anchor).
    await asUser(db, SUBSCRIBER);
    expect(await entitled(db)).toBe(true);
  });
});

describe('has_surveyor_entitlement — AFTER migration 201', () => {
  beforeEach(async () => { await db.exec(readFileSync(MIG_201, 'utf-8')); });

  it('admits developer and admin with NO entitlement row', async () => {
    for (const uid of [DEVELOPER, ADMIN]) {
      await asUser(db, uid);
      expect(await entitled(db), `${uid} is staff`).toBe(true);
    }
  });

  it('grants the unlock WITHOUT minting an entitlement row', async () => {
    // A staff pass must never look like a purchase: the ledger is the record of
    // who paid, and a fiction in it would survive the unlock's revocation.
    const { rows } = await db.query('select user_id from public.surveyor_entitlements');
    const holders = rows.map((r) => r.user_id);
    expect(holders).toEqual([SUBSCRIBER]);
  });

  it('NEGATIVE CONTROL: an ordinary member is still refused', async () => {
    await asUser(db, MEMBER);
    expect(await entitled(db)).toBe(false);
  });

  it('NEGATIVE CONTROL: an anonymous caller is still refused', async () => {
    await asAnon(db);
    expect(await entitled(db)).toBe(false);
  });

  it('the paying subscriber is unaffected — the original question still answers', async () => {
    await asUser(db, SUBSCRIBER);
    expect(await entitled(db)).toBe(true);
  });

  it('a REVOKED entitlement still reads false for a non-staff holder', async () => {
    await db.exec(`update public.surveyor_entitlements set status = 'revoked' where user_id = '${SUBSCRIBER}'`);
    await asUser(db, SUBSCRIBER);
    expect(await entitled(db)).toBe(false);
    // …and revoking a row cannot touch a staff pass, which never depended on one.
    await asUser(db, ADMIN);
    expect(await entitled(db)).toBe(true);
  });

  it('a user cannot self-promote: the role is the profile row, not the caller claim', async () => {
    // The fixture's auth.uid() is settable (that is how the harness impersonates),
    // so the meaningful proof is that the ANSWER follows the profiles row and
    // nothing else. In production 018's UPDATE policy pins `role is not distinct
    // from` the stored value, so a client cannot write the row this reads.
    await asUser(db, MEMBER);
    expect(await entitled(db)).toBe(false);
    await db.exec(`update public.profiles set role = 'developer' where id = '${MEMBER}'`);
    expect(await entitled(db)).toBe(true);
    await db.exec(`update public.profiles set role = 'user' where id = '${MEMBER}'`);
    expect(await entitled(db)).toBe(false);
  });

  it('the grant is EXECUTE-restricted exactly as 139 left it', async () => {
    // 201 re-issues the revoke/grant pair; a `create or replace` that dropped
    // them would silently widen who may call the gate.
    const { rows } = await db.query(`
      select has_function_privilege('authenticated', 'public.has_surveyor_entitlement()', 'execute') as auth_ok,
             has_function_privilege('anon', 'public.has_surveyor_entitlement()', 'execute') as anon_ok
    `);
    expect(rows[0].auth_ok).toBe(true);
    expect(rows[0].anon_ok).toBe(false);
  });
});
