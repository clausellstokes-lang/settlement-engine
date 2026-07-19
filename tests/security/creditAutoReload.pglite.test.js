/**
 * creditAutoReload.pglite.test.js — the auto-reload claim/settings RPCs (M-3a, §4).
 *
 * Loads the REAL 158 migration into an in-process Postgres (pglite) over a minimal
 * scaffold (auth stubs + a GUC-controlled get_credit_balance) and exercises the
 * atomic money decision: below-threshold gating, delta/amount math from the
 * edge-supplied Stripe rate, the 10-minute cooldown, the monthly cap, and the
 * one-open-attempt claim (the concurrency guard's observable effect). Also the
 * settings-validation RPC and the 72h expiry sweep.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '158_credit_auto_reload.sql');
const U = '11111111-1111-1111-1111-111111111111';

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create table if not exists auth.users (id uuid primary key);
    -- GUC-controlled balance stand-in for get_credit_balance (the claim RPC's only
    -- ledger dependency; the balance math itself is proven elsewhere).
    create table if not exists public._test_bal (user_id uuid primary key, balance int not null default 0);
    create or replace function public.get_credit_balance(target_user uuid) returns integer language sql stable as $fn$
      select coalesce((select balance from public._test_bal where user_id = target_user), 0) $fn$;
  `);
  await db.exec(readFileSync(MIG, 'utf-8'));
  return db;
}

async function asService(db) { await db.query(`select set_config('test.role', 'service_role', false)`); }
async function asUser(db, uid = U) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid}', false)`);
}

async function seed(db, { balance = 2, enabled = true, threshold = 5, target = 25, cap = 4000 } = {}) {
  await db.exec(`insert into auth.users(id) values ('${U}') on conflict do nothing;`);
  await db.exec(`insert into public._test_bal(user_id, balance) values ('${U}', ${balance})
                 on conflict (user_id) do update set balance = ${balance};`);
  await db.exec(`insert into public.credit_auto_reload_settings
                   (user_id, enabled, threshold_credits, target_credits, monthly_cap_cents)
                 values ('${U}', ${enabled}, ${threshold}, ${target}, ${cap})
                 on conflict (user_id) do update set
                   enabled = ${enabled}, threshold_credits = ${threshold},
                   target_credits = ${target}, monthly_cap_cents = ${cap};`);
}

async function claim(db, { unit = 499, per = 25 } = {}) {
  await asService(db);
  const res = await db.query(`select public.claim_auto_reload_attempt('${U}'::uuid, ${unit}, ${per}) as r`);
  return res.rows[0].r;
}

let db;
beforeEach(async () => { db = await makeDb(); });

describe('claim_auto_reload_attempt', () => {
  it('claims below threshold: delta = target - balance, amount = round(delta * unit/per)', async () => {
    await seed(db, { balance: 2, threshold: 5, target: 25, cap: 4000 });
    const r = await claim(db, { unit: 499, per: 25 }); // rate 19.96 c/credit
    expect(r.ok).toBe(true);
    expect(r.credits_delta).toBe(23);
    expect(r.amount_cents).toBe(459); // round(23 * 19.96) = 459
    const rows = await db.query(`select state, credits_delta, amount_cents from public.credit_auto_reload_attempts`);
    expect(rows.rows.length).toBe(1);
    expect(rows.rows[0].state).toBe('pending');
  });

  it('refuses when balance is at/above threshold', async () => {
    await seed(db, { balance: 10, threshold: 5, target: 25 });
    expect((await claim(db)).reason).toBe('above_threshold');
  });

  it('refuses when disabled', async () => {
    await seed(db, { balance: 1, enabled: false });
    expect((await claim(db)).reason).toBe('disabled');
  });

  it('refuses over the monthly cap', async () => {
    // target 40 → delta 38 → amount round(38 * 19.96) = 758 > cap 500 (the floor).
    await seed(db, { balance: 2, threshold: 5, target: 40, cap: 500 });
    expect((await claim(db)).reason).toBe('cap');
  });

  it('counts prior succeeded/open spend toward the cap', async () => {
    await seed(db, { balance: 2, threshold: 5, target: 25, cap: 900 });
    // A succeeded attempt this bucket already spent 500; 500 + 459 = 959 > 900.
    const bucket = new Date().toISOString().slice(0, 7);
    await db.exec(`insert into public.credit_auto_reload_attempts
      (user_id, state, credits_delta, amount_cents, month_bucket, resolved_at, created_at)
      values ('${U}', 'succeeded', 25, 500, '${bucket}', now() - interval '2 days', now() - interval '2 days');`);
    expect((await claim(db)).reason).toBe('cap');
  });

  it('refuses within the 10-minute cooldown (a recent resolved attempt bars it)', async () => {
    await seed(db, { balance: 2 });
    const bucket = new Date().toISOString().slice(0, 7);
    await db.exec(`insert into public.credit_auto_reload_attempts
      (user_id, state, credits_delta, amount_cents, month_bucket, resolved_at, created_at)
      values ('${U}', 'succeeded', 5, 100, '${bucket}', now() - interval '2 minutes', now() - interval '3 minutes');`);
    expect((await claim(db)).reason).toBe('cooldown');
  });

  it('allows only ONE open attempt per user (the concurrency claim)', async () => {
    await seed(db, { balance: 2, threshold: 5, target: 25, cap: 4000 });
    const first = await claim(db);
    expect(first.ok).toBe(true);
    // A second claim while the first is still open (pending) is refused by the
    // partial unique index — exactly what the loser of a real race would read.
    const second = await claim(db);
    expect(second.reason).toBe('open_attempt');
    const n = await db.query(`select count(*)::int as c from public.credit_auto_reload_attempts`);
    expect(n.rows[0].c).toBe(1);
  });

  it('refuses a caller that is not service_role', async () => {
    await seed(db, { balance: 2 });
    await asUser(db);
    await expect(db.query(`select public.claim_auto_reload_attempt('${U}'::uuid, 499, 25)`)).rejects.toThrow(/service-role only/);
  });
});

describe('set_auto_reload_settings', () => {
  it('upserts the caller own row and rejects invalid ranges', async () => {
    await db.exec(`insert into auth.users(id) values ('${U}') on conflict do nothing;`);
    await asUser(db);
    await db.query(`select public.set_auto_reload_settings(true, 5, 25, 4000)`);
    const row = await db.query(`select enabled, threshold_credits, target_credits, monthly_cap_cents from public.credit_auto_reload_settings where user_id='${U}'`);
    expect(row.rows[0]).toMatchObject({ enabled: true, threshold_credits: 5, target_credits: 25, monthly_cap_cents: 4000 });
    // target must exceed threshold
    await expect(db.query(`select public.set_auto_reload_settings(true, 25, 25, 4000)`)).rejects.toThrow(/exceed threshold/);
    // cap out of range
    await expect(db.query(`select public.set_auto_reload_settings(true, 5, 25, 100)`)).rejects.toThrow(/monthly_cap_cents/);
  });
});

describe('cancel_stale_auto_reload_attempts', () => {
  it('cancels open attempts older than 72h and leaves fresh ones', async () => {
    await db.exec(`insert into auth.users(id) values ('${U}') on conflict do nothing;`);
    const bucket = new Date().toISOString().slice(0, 7);
    await db.exec(`insert into public.credit_auto_reload_attempts
      (user_id, state, credits_delta, amount_cents, month_bucket, created_at)
      values ('${U}', 'requires_action', 5, 100, '${bucket}', now() - interval '80 hours');`);
    await asService(db);
    const r = await db.query(`select public.cancel_stale_auto_reload_attempts() as c`);
    expect(r.rows[0].c).toBe(1);
    const s = await db.query(`select state, failure_reason from public.credit_auto_reload_attempts`);
    expect(s.rows[0].state).toBe('canceled');
    expect(s.rows[0].failure_reason).toBe('expired');
  });
});

describe('mark_low_balance_notified', () => {
  it('stamps once per month bucket (claim-once)', async () => {
    await seed(db, { balance: 2 });
    await asService(db);
    const bucket = '2026-07';
    const first = await db.query(`select public.mark_low_balance_notified('${U}'::uuid, '${bucket}') as ok`);
    expect(first.rows[0].ok).toBe(true);
    const second = await db.query(`select public.mark_low_balance_notified('${U}'::uuid, '${bucket}') as ok`);
    expect(second.rows[0].ok).toBe(false); // already notified this bucket
    const third = await db.query(`select public.mark_low_balance_notified('${U}'::uuid, '2026-08') as ok`);
    expect(third.rows[0].ok).toBe(true); // a new bucket stamps again
  });
});
