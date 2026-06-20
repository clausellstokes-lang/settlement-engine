/**
 * accountStatusGate.pglite.test.js — EXECUTION test of the account ban/disable/
 * soft-delete enforcement at the DB write boundary (review B16 finding #1).
 *
 * 053 added profiles.banned_at / disabled_at and 054 added deleted_at, but NOTHING
 * enforced them: a banned/disabled/anonymised user kept full write access with a
 * still-valid JWT. Migration 057 adds account_is_active(uid) and gates the two
 * write RPCs (spend_credits, mutate_settlement_batch) on it. This RUNS the real
 * net-current SQL against in-process Postgres (pglite) and asserts a flagged
 * account is actually cut off — that the moderation flags are no longer cosmetic.
 *
 * Loads: account_is_active + spend_credits + mutate_settlement_batch from 057,
 * get_credit_balance from 018. auth.uid() / current_user_is_privileged are GUC
 * stubs; the credit/settlement tables are minimal mirrors.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '057': resolve(dir, '057_enforce_account_status_writes.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames.
describe('account-status gate pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
});

/** Extract a function definition verbatim: from `create or replace function
 *  public.<name>` to the first `$$;`. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration ${migKey}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const scalar = async (q) => (await db.query(q)).rows[0];

describe.runIf(allExist)('account-status write gate — execution against 057 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated')
      $fn$;
      create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
      $fn$;

      create table public.profiles (
        id uuid primary key, role text, tier text,
        credits integer not null default 0, is_founder boolean not null default false,
        display_name text, updated_at timestamptz default now(),
        banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz
      );
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null check (kind in ('grant','spend')),
        amount integer not null check (amount > 0), source text not null,
        metadata jsonb not null default '{}'::jsonb,
        expires_at timestamptz, reversed_by uuid, created_at timestamptz not null default now()
      );
      create table public.credit_transactions (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        amount integer not null, reason text not null, created_at timestamptz not null default now()
      );
      create table public.credit_spend_allocations (
        spend_id uuid not null references public.credit_ledger(id) on delete cascade,
        grant_id uuid not null references public.credit_ledger(id) on delete cascade,
        amount integer not null check (amount > 0),
        created_at timestamptz not null default now(),
        primary key (spend_id, grant_id)
      );
      create table public.settlements (
        id uuid primary key, user_id uuid not null,
        name text, tier text, data jsonb, config jsonb, toggles jsonb, seed text,
        neighbour_links jsonb, ai_data jsonb default '{}'::jsonb,
        campaign_state jsonb, version_history jsonb,
        access_state text not null default 'active'
      );
    `);
    await db.exec(extractFn('018', 'get_credit_balance'));
    await db.exec(extractFn('057', 'account_is_active'));
    await db.exec(extractFn('057', 'spend_credits'));
    await db.exec(extractFn('057', 'mutate_settlement_batch'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_ledger, public.credit_transactions, public.settlements cascade;');
    await db.exec(`insert into public.profiles (id, role, tier, credits) values ('${UID}', 'user', 'free', 0);`);
    // A healthy grant so spend would otherwise succeed (proving the gate, not lack of funds).
    await db.query(`insert into public.credit_ledger (user_id, kind, amount, source) values ('${UID}','grant',10,'purchase')`);
    await db.exec(`set test.privileged = 'false'; set test.role = 'authenticated';`);
    await asUser(UID);
  });

  const flag = (col) => db.exec(`update public.profiles set ${col} = now() where id = '${UID}';`);
  const clearFlags = () => db.exec(`update public.profiles set banned_at = null, disabled_at = null, deleted_at = null where id = '${UID}';`);

  // ── account_is_active predicate ──────────────────────────────────────────────
  it('account_is_active is true for a clean account and false for each flag', async () => {
    expect((await scalar(`select public.account_is_active('${UID}') as a`)).a).toBe(true);
    for (const col of ['banned_at', 'disabled_at', 'deleted_at']) {
      await flag(col);
      expect((await scalar(`select public.account_is_active('${UID}') as a`)).a, col).toBe(false);
      await clearFlags();
    }
  });

  it('account_is_active is false (fail-closed) for an unknown profile', async () => {
    expect((await scalar(`select public.account_is_active('22222222-2222-2222-2222-222222222222') as a`)).a).toBe(false);
  });

  // ── spend_credits gate ───────────────────────────────────────────────────────
  it('an ACTIVE account can spend (baseline — funds + gate both pass)', async () => {
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    expect(r.ok).toBe(true);
    expect(r.balance).toBe(7);
  });

  it('a BANNED account cannot spend (despite a valid JWT and sufficient funds)', async () => {
    await flag('banned_at');
    await expect(db.query("select public.spend_credits('narrative')")).rejects.toThrow(/account is not active/i);
    // No spend row was written.
    expect((await scalar(`select count(*)::int n from public.credit_ledger where kind='spend'`)).n).toBe(0);
  });

  it('a DISABLED account cannot spend', async () => {
    await flag('disabled_at');
    await expect(db.query("select public.spend_credits('narrative')")).rejects.toThrow(/account is not active/i);
  });

  it('a SOFT-DELETED account cannot spend', async () => {
    await flag('deleted_at');
    await expect(db.query("select public.spend_credits('narrative')")).rejects.toThrow(/account is not active/i);
  });

  // ── mutate_settlement_batch gate ─────────────────────────────────────────────
  const createBatch = (id) =>
    db.query(
      `select public.mutate_settlement_batch('[]'::jsonb, '{}'::uuid[], $1::jsonb)`,
      [JSON.stringify([{ id, name: 'Town', tier: 'free' }])],
    );

  it('an ACTIVE account can create a settlement (baseline)', async () => {
    await createBatch('33333333-3333-3333-3333-333333333333');
    expect((await scalar(`select count(*)::int n from public.settlements`)).n).toBe(1);
  });

  it('a BANNED account cannot mutate settlements (no write happens)', async () => {
    await flag('banned_at');
    await expect(createBatch('44444444-4444-4444-4444-444444444444')).rejects.toThrow(/account is not active/i);
    expect((await scalar(`select count(*)::int n from public.settlements`)).n).toBe(0);
  });

  it('a DISABLED account cannot mutate settlements', async () => {
    await flag('disabled_at');
    await expect(createBatch('55555555-5555-5555-5555-555555555555')).rejects.toThrow(/account is not active/i);
  });

  it('a SOFT-DELETED account cannot mutate settlements', async () => {
    await flag('deleted_at');
    await expect(createBatch('66666666-6666-6666-6666-666666666666')).rejects.toThrow(/account is not active/i);
  });
});
