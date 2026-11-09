/**
 * surveyorPremiumOnly.pglite.test.js — THE SERVER HALF OF "THE SURVEYOR IS PREMIUM ONLY"
 * (the owner, 2026-11-09: "Premium only"; lane TIER-PARITY-FIX, migration 209).
 *
 * public.has_surveyor_entitlement() is the AI layer's ONE gate: the nine AI-control edge
 * functions (ai-analyst, construct-realm, construct-settlement, custom-content,
 * interpret-session, interview, parley, surveyor-autonomy, surveyor-byok) and the BYOK RPCs
 * (159, 191) call it, so driving the function IS driving their gate. This applies the REAL
 * 139 + 201 + 209 SQL into pglite, with 018's and 024's resolvers verbatim, and measures every
 * population on both sides of 209:
 *   premium admitted · a Founder admitted · staff admitted · a free member refused ·
 *   a staff GRANT ('grant') on a free account honoured · a purchased 'subscription' row on a
 *   free account no longer access · anon refused.
 * Red at 201 (the base): the Cartographer and the Founder are refused, the free subscriber
 * admitted.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_139 = resolve(dir, '139_surveyor_entitlement_and_byok.sql');
const MIG_201 = resolve(dir, '201_staff_unlock_surveyor_entitlement.sql');
const MIG_209 = resolve(dir, '209_surveyor_premium_only.sql');

const FREE       = '11111111-1111-1111-1111-111111111111';
const PREMIUM    = '22222222-2222-2222-2222-222222222222';
const FOUNDER    = '33333333-3333-3333-3333-333333333333';
const DEVELOPER  = '44444444-4444-4444-4444-444444444444';
const GRANTED    = '55555555-5555-5555-5555-555555555555'; // free tier, a staff grant row
const PURCHASED  = '66666666-6666-6666-6666-666666666666'; // free tier, a 'subscription' row

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
    create table if not exists public.profiles (
      id uuid primary key,
      tier text not null default 'free',
      is_founder boolean default false,
      role text not null default 'user' check (role in ('user','developer','admin'))
    );
    insert into auth.users(id) values
      ('${FREE}'), ('${PREMIUM}'), ('${FOUNDER}'), ('${DEVELOPER}'), ('${GRANTED}'), ('${PURCHASED}') on conflict do nothing;
    insert into public.profiles(id, tier, is_founder, role) values
      ('${FREE}', 'free', false, 'user'), ('${PREMIUM}', 'premium', false, 'user'),
      ('${FOUNDER}', 'premium', true, 'user'), ('${DEVELOPER}', 'free', false, 'developer'),
      ('${GRANTED}', 'free', false, 'user'), ('${PURCHASED}', 'free', false, 'user') on conflict do nothing;
    -- 018's staff predicate, VERBATIM from the migration's body.
    create or replace function public.current_user_is_privileged()
    returns boolean language sql stable security definer set search_path = public
    as $fn$
      select exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('developer', 'admin')
      );
    $fn$;
    -- 024's premium resolver, VERBATIM from the migration's body.
    create or replace function public.current_user_has_premium_access()
    returns boolean language sql stable security definer set search_path = public
    as $fn$
      select exists (
        select 1 from public.profiles
        where id = auth.uid()
          and (tier = 'premium' or is_founder = true or role in ('developer', 'admin'))
      );
    $fn$;
  `);
  await db.exec(readFileSync(MIG_139, 'utf-8'));
  await db.exec(`
    insert into public.surveyor_entitlements (user_id, status, source) values
      ('${GRANTED}', 'active', 'grant'), ('${PURCHASED}', 'active', 'subscription') on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_201, 'utf-8'));
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
beforeEach(async () => { db = await makeDb(); }, 60000);

describe('has_surveyor_entitlement at 201 — the measured defect (the base)', () => {
  it('refuses the Cartographer and the Founder, and admits a free account holding a purchased row', async () => {
    await asUser(db, PREMIUM);
    expect(await entitled(db)).toBe(false);
    await asUser(db, FOUNDER);
    expect(await entitled(db)).toBe(false);
    await asUser(db, PURCHASED);
    expect(await entitled(db)).toBe(true);
  });
});

describe('has_surveyor_entitlement after 209 — premium only', () => {
  beforeEach(async () => { await db.exec(readFileSync(MIG_209, 'utf-8')); });

  const CASES = [
    ['a Cartographer premium', PREMIUM, true],
    ['a Founder (lifetime premium)', FOUNDER, true],
    ['staff', DEVELOPER, true],
    ['a free account with a STAFF grant', GRANTED, true],
    ['a free account with a purchased row', PURCHASED, false],
    ['a free member', FREE, false],
  ];
  for (const [who, uid, expected] of CASES) {
    it(`${who}: ${expected ? 'admitted' : 'refused'}`, async () => {
      await asUser(db, uid);
      expect(await entitled(db)).toBe(expected);
    });
  }

  it('an anonymous caller is refused', async () => {
    await asAnon(db);
    expect(await entitled(db)).toBe(false);
  });

  it('a downgrade takes the Surveyor with the tier', async () => {
    await asUser(db, PREMIUM);
    expect(await entitled(db)).toBe(true);
    await db.exec(`update public.profiles set tier = 'free' where id = '${PREMIUM}'`);
    expect(await entitled(db)).toBe(false);
  });

  it('mints and deletes no rows', async () => {
    const { rows } = await db.query('select user_id from public.surveyor_entitlements order by user_id');
    expect(rows.map((r) => r.user_id)).toEqual([GRANTED, PURCHASED]);
  });

  it('the EXECUTE grant stays as 139 and 201 left it', async () => {
    const { rows } = await db.query(`
      select has_function_privilege('authenticated', 'public.has_surveyor_entitlement()', 'execute') as auth_ok,
             has_function_privilege('anon', 'public.has_surveyor_entitlement()', 'execute') as anon_ok
    `);
    expect(rows[0].auth_ok).toBe(true);
    expect(rows[0].anon_ok).toBe(false);
  });
});
