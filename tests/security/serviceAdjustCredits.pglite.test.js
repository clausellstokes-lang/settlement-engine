/**
 * serviceAdjustCredits.pglite.test.js — EXECUTION-level tests for migration 103
 * (service_adjust_credits + the recreated service_set_credits).
 *
 * The low-severity audit finding: the admin grant_credits edge action was a
 * read-modify-write race — it read profiles.credits in TypeScript, computed
 * next = prev + delta, and called the ABSOLUTE-set service_set_credits(next);
 * a concurrent user spend between the read and write was silently clobbered,
 * and service_set_credits derived its ledger row from the LEGACY
 * profiles.credits cache rather than the ledger truth (018's
 * get_credit_balance).
 *
 * Following the creditLedger.pglite harness: the REAL, NET-CURRENT function
 * bodies (_assert_service_admin_actor from 017, get_credit_balance from 018,
 * both 103 functions) run in in-process Postgres. auth.role() is a settable GUC
 * stub; tables are minimal mirrors (no auth.users FK).
 *
 * LIMITATION (same as the sibling): pglite is single-connection, so the FOR
 * UPDATE serialization can't be raced here — instead its LOGICAL effect is
 * pinned: both functions compute their delta from the ledger truth at execution
 * time, so a spend that lands before the adjustment is never clobbered, and the
 * presence of the row lock in the shipped SQL is asserted textually.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '017': resolve(dir, '017_fix_credit_auth_integrity.sql'),
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '103': resolve(dir, '103_service_adjust_credits.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames.
describe('103 pglite targets exist (guards against silent vacuous skip)', () => {
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

const ADMIN = '11111111-1111-1111-1111-111111111111';
const TARGET = '22222222-2222-2222-2222-222222222222';

let db;
const asRole = (role) => db.exec(`set test.role = '${role}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = async (uid) => (await scalar(`select public.get_credit_balance('${uid}') as b`)).b;
const cachedOf = async (uid) => (await scalar(`select credits from public.profiles where id = '${uid}'`)).credits;
const grant = (uid, amount) =>
  db.query(`insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'grant',$2,'purchase')`, [uid, amount]);
const adjust = (delta, target = TARGET) =>
  scalar(`select public.service_adjust_credits('${ADMIN}', '${target}', ${delta}, 'test') as r`).then((x) => x.r);
const setTo = (n, target = TARGET) =>
  scalar(`select public.service_set_credits('${ADMIN}', '${target}', ${n}, 'test') as r`).then((x) => x.r);

describe.runIf(allExist)('103 service_adjust_credits / service_set_credits — execution (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated')
      $fn$;
      create table public.profiles (
        id uuid primary key, role text, tier text,
        credits integer not null default 0, updated_at timestamptz default now()
      );
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null check (kind in ('grant','spend')),
        amount integer not null check (amount > 0), source text not null,
        metadata jsonb not null default '{}'::jsonb,
        expires_at timestamptz, created_at timestamptz not null default now()
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
      create table public.admin_actions (
        id uuid primary key default gen_random_uuid(),
        actor_id uuid not null, target_id uuid, action text not null,
        before_value jsonb, after_value jsonb, reason text,
        created_at timestamptz not null default now()
      );
    `);
    // The REAL, net-current bodies.
    await db.exec(extractFn('017', '_assert_service_admin_actor'));
    await db.exec(extractFn('018', 'get_credit_balance'));
    await db.exec(extractFn('103', 'service_adjust_credits'));
    await db.exec(extractFn('103', 'service_set_credits'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.credit_spend_allocations, public.credit_ledger, public.credit_transactions, public.admin_actions, public.profiles cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${ADMIN}', 'admin', 0), ('${TARGET}', 'user', 0);`);
    await asRole('service_role');
  });

  it('applies a positive delta through the LEDGER and refreshes the cache', async () => {
    await grant(TARGET, 10);
    const r = await adjust(5);
    expect(r).toMatchObject({ prev: 10, next: 15, delta: 5 });
    expect(await balanceOf(TARGET)).toBe(15);
    expect(await cachedOf(TARGET)).toBe(15);
    const row = await scalar(`select kind, amount, source from public.credit_ledger where source = 'admin_adjust'`);
    expect(row).toMatchObject({ kind: 'grant', amount: 5, source: 'admin_adjust' });
    const audit = await scalar(`select action from public.admin_actions`);
    expect(audit.action).toBe('admin_adjust_credits');
  });

  it('clamps a negative delta at zero (the edge Math.max(0, …) behavior, kept)', async () => {
    await grant(TARGET, 3);
    const r = await adjust(-10);
    expect(r).toMatchObject({ prev: 3, next: 0, delta: -3, requested_delta: -10 });
    expect(await balanceOf(TARGET)).toBe(0);
    const row = await scalar(`select kind, amount from public.credit_ledger where source = 'admin_adjust'`);
    expect(row).toMatchObject({ kind: 'spend', amount: 3 });
  });

  it('a fully-clamped adjustment is a NO-OP: no ledger row, no audit row', async () => {
    const r = await adjust(-5); // balance is 0
    expect(r).toMatchObject({ prev: 0, next: 0, delta: 0 });
    expect((await db.query(`select 1 from public.credit_ledger`)).rows.length).toBe(0);
    expect((await db.query(`select 1 from public.admin_actions`)).rows.length).toBe(0);
  });

  it('computes prev from the LEDGER truth, not the drifted profiles.credits cache', async () => {
    await grant(TARGET, 10);
    await db.exec(`update public.profiles set credits = 999 where id = '${TARGET}'`); // drifted cache
    const r = await adjust(5);
    expect(r).toMatchObject({ prev: 10, next: 15 }); // NOT 999/1004
    expect(await cachedOf(TARGET)).toBe(15); // cache self-heals to ledger truth
  });

  it('the recreated service_set_credits writes the TRUE delta even when the cache drifted', async () => {
    await grant(TARGET, 10);
    await db.exec(`update public.profiles set credits = 999 where id = '${TARGET}'`);
    const r = await setTo(25);
    // Under the 017 body prev came from the cache: delta 25-999 = a SPEND of 974
    // against a 10-credit ledger. Ledger-truth prev makes it a +15 grant.
    expect(r).toMatchObject({ prev: 10, next: 25, delta: 15 });
    const row = await scalar(`select kind, amount from public.credit_ledger where source = 'admin_set'`);
    expect(row).toMatchObject({ kind: 'grant', amount: 15 });
    expect(await balanceOf(TARGET)).toBe(25);
    expect(await cachedOf(TARGET)).toBe(25);
  });

  it('rejects a non-service caller and a non-privileged actor (017 gate intact)', async () => {
    await asRole('authenticated');
    await expect(adjust(5)).rejects.toThrow(/service role required/);
    await asRole('service_role');
    await db.exec(`update public.profiles set role = 'user' where id = '${ADMIN}'`);
    await expect(adjust(5)).rejects.toThrow(/actor is not privileged/);
  });

  it('rejects a missing target profile and over-limit deltas', async () => {
    await expect(adjust(5, '33333333-3333-3333-3333-333333333333')).rejects.toThrow(/target profile not found/);
    await expect(adjust(0)).rejects.toThrow(/non-zero/);
    await expect(adjust(100001)).rejects.toThrow(/per-call limit/);
  });

  // pglite can't run two connections, so the FOR UPDATE serialization is pinned
  // textually: both shipped bodies must take the profiles row lock BEFORE
  // reading the balance (spend_credits takes the same lock first — 018).
  it('both 103 bodies lock the profiles row FOR UPDATE before the balance read', () => {
    for (const fn of ['service_adjust_credits', 'service_set_credits']) {
      const body = extractFn('103', fn);
      const lock = body.search(/from\s+public\.profiles\s+where\s+id\s*=\s*target_user\s+for\s+update/i);
      const read = body.search(/get_credit_balance\(target_user\)/i);
      expect(lock, `${fn} must FOR UPDATE the profiles row`).toBeGreaterThan(-1);
      expect(read, `${fn} must read the ledger balance`).toBeGreaterThan(-1);
      expect(lock).toBeLessThan(read);
    }
  });
});
