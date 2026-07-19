/**
 * singleSession.pglite.test.js — the single-session gate RPCs (161, M-9a, §7.1).
 * Applies the REAL 161 migration into pglite and pins last-login-wins + THE
 * ROLLOUT-SAFETY LAW: a MISSING row returns TRUE from is_current_session (sessions
 * minted before the deploy are adopted lazily, never mass-evicted), and a token
 * with no session_id claim ALLOWS. Only a PRESENT row whose session id differs
 * rejects.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_161 = resolve(dir, '161_single_session.sql');
const U = '11111111-1111-1111-1111-111111111111';
const S1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const S2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

let db;

async function ctx(uid, sid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid ?? ''}', false)`);
  await db.query(`select set_config('test.jwt', '${sid ? `{"session_id":"${sid}"}` : ''}', false)`);
}
async function scalar(sql) { return (await db.query(sql)).rows[0]; }

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select nullif(current_setting('test.jwt', true), '')::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key);
    insert into auth.users(id) values ('${U}') on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_161, 'utf-8'));
});

beforeEach(async () => { await db.query(`truncate public.current_account_session`); });

describe('claim_current_session — last claim wins', () => {
  it('upserts the caller row and a later claim supersedes the earlier session', async () => {
    await ctx(U, S1);
    expect((await scalar(`select public.claim_current_session('Chrome / macOS') as r`)).r).toBe(true);
    let row = await scalar(`select session_id, device_label from public.current_account_session where user_id='${U}'`);
    expect(row.session_id).toBe(S1);
    expect(row.device_label).toBe('Chrome / macOS');
    // A new sign-in (new session id) supersedes.
    await ctx(U, S2);
    await scalar(`select public.claim_current_session('Safari / iOS')`);
    row = await scalar(`select session_id from public.current_account_session where user_id='${U}'`);
    expect(row.session_id).toBe(S2);
  });

  it('returns false (does not brick sign-in) when the token has no session_id claim', async () => {
    await ctx(U, null);
    expect((await scalar(`select public.claim_current_session(null) as r`)).r).toBe(false);
    expect((await scalar(`select count(*)::int as c from public.current_account_session`)).c).toBe(0);
  });
});

describe('is_current_session — THE ROLLOUT-SAFETY LAW', () => {
  it('a MISSING row ALLOWS (true) — sessions predating the deploy are adopted, not evicted', async () => {
    await ctx(U, S1);
    expect((await scalar(`select public.is_current_session() as r`)).r).toBe(true);
  });

  it('a matching session id is current; a superseded one is not', async () => {
    await ctx(U, S1);
    await scalar(`select public.claim_current_session(null)`);
    expect((await scalar(`select public.is_current_session() as r`)).r).toBe(true);   // same session
    await ctx(U, S2);
    expect((await scalar(`select public.is_current_session() as r`)).r).toBe(false);  // superseded
  });

  it('a token with no session_id claim ALLOWS (never brick an unexpected shape)', async () => {
    await ctx(U, S1);
    await scalar(`select public.claim_current_session(null)`);
    await ctx(U, null);   // same user, token missing session_id
    expect((await scalar(`select public.is_current_session() as r`)).r).toBe(true);
  });

  it('no user context ALLOWS (service-role / anon has no session to enforce)', async () => {
    await ctx(null, null);
    expect((await scalar(`select public.is_current_session() as r`)).r).toBe(true);
  });
});

describe('assert_current_session — the DB belt', () => {
  it('raises session_superseded only when a present row mismatches', async () => {
    await ctx(U, S1);
    // missing row → no raise
    await scalar(`select public.assert_current_session()`);
    await scalar(`select public.claim_current_session(null)`);
    // matching → no raise
    await scalar(`select public.assert_current_session()`);
    // superseded → raises
    await ctx(U, S2);
    await expect(db.query(`select public.assert_current_session()`)).rejects.toThrow(/session_superseded/);
  });
});
