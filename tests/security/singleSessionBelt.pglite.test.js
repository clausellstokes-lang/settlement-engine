/**
 * singleSessionBelt.pglite.test.js — THE spend_credits DB BELT (161/§7.2, M-9c).
 * Applies the REAL 161 migration (which recreates spend_credits with an
 * assert_current_session() at the top) into pglite with minimal credit-path stubs
 * and pins: a SUPERSEDED session can never move credits (raises session_superseded
 * before any spend), while a matching / MISSING session spends normally (the
 * missing-row-allows semantics keeps existing creditFlow pins green).
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
async function scalar(sql) { return (await db.query(sql)).rows[0]; }
async function ctx(uid, sid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid ?? ''}', false)`);
  await db.query(`select set_config('test.jwt', '${sid ? `{"session_id":"${sid}"}` : ''}', false)`);
}

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
    -- Minimal credit-path scaffold so spend_credits reaches (and passes/blocks at) the belt.
    create table if not exists public.profiles (id uuid primary key, role text default 'free', credits int default 0, updated_at timestamptz default now());
    insert into public.profiles(id, role) values ('${U}', 'free') on conflict do nothing;
    create or replace function public.account_is_active(p_uid uuid) returns boolean language sql stable as $fn$ select true $fn$;
    create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$ select false $fn$;
    create or replace function public.get_credit_balance(p_uid uuid) returns int language sql stable as $fn$ select 0 $fn$;
  `);
  await db.exec(readFileSync(MIG_161, 'utf-8'));
});

beforeEach(async () => { await db.query(`truncate public.current_account_session`); });

describe('spend_credits belt — a superseded session cannot spend', () => {
  it('raises session_superseded BEFORE any credit movement when the session is superseded', async () => {
    await ctx(U, S1);
    await scalar(`select public.claim_current_session(null)`); // current session = S1
    await ctx(U, S2);                                          // caller now carries the OLD/other session
    await expect(db.query(`select public.spend_credits('narrative')`)).rejects.toThrow(/session_superseded/);
  });

  it('a MATCHING session spends normally (belt allows; returns insufficient_funds at balance 0)', async () => {
    await ctx(U, S1);
    await scalar(`select public.claim_current_session(null)`);
    const { r } = await scalar(`select public.spend_credits('narrative') as r`);
    expect(r).toMatchObject({ ok: false, reason: 'insufficient_funds' }); // passed the belt, no session error
  });

  it('a MISSING session row ALLOWS the spend (rollout safety keeps creditFlow pins green)', async () => {
    await ctx(U, S1); // no row claimed this test (truncated in beforeEach)
    const { r } = await scalar(`select public.spend_credits('narrative') as r`);
    expect(r).toMatchObject({ ok: false, reason: 'insufficient_funds' }); // reached the credit path, not blocked
  });
});
