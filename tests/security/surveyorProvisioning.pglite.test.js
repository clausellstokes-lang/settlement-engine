/**
 * surveyorProvisioning.pglite.test.js — the Surveyor provisioning RPCs (M-4a, §5).
 * Applies the REAL 139 + 159 migrations into pglite and exercises the grant/revoke
 * round-trip, the stale-sub-safe by-subscription revoke, and the surveyor_byok_set
 * entitlement-gate RIDER (refused without an entitlement/founder; passes with).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_139 = resolve(dir, '139_surveyor_entitlement_and_byok.sql');
const MIG_159 = resolve(dir, '159_surveyor_provisioning.sql');
const U = '22222222-2222-2222-2222-222222222222';
const F = '33333333-3333-3333-3333-333333333333'; // a founder

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
    create table if not exists public.profiles (id uuid primary key, is_founder boolean default false);
    insert into auth.users(id) values ('${U}'), ('${F}') on conflict do nothing;
    insert into public.profiles(id, is_founder) values ('${U}', false), ('${F}', true) on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_139, 'utf-8'));
  await db.exec(readFileSync(MIG_159, 'utf-8'));
  return db;
}

async function asService(db) { await db.query(`select set_config('test.role', 'service_role', false)`); }
async function asUser(db, uid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid}', false)`);
}

let db;
beforeEach(async () => { db = await makeDb(); }, 180_000 /* pglite cold boot exceeds the 10s hookTimeout default under load — deadlock guard, not a perf budget */);

describe('grant / revoke round-trip', () => {
  it('grants an active entitlement recording the sub id, and re-grant reactivates a revoked row', async () => {
    await asService(db);
    await db.query(`select public.grant_surveyor_entitlement('${U}'::uuid, 'subscription', 'sub_1', 'cus_1')`);
    let row = (await db.query(`select status, source, stripe_subscription_id, stripe_customer_id from public.surveyor_entitlements where user_id='${U}'`)).rows[0];
    expect(row).toMatchObject({ status: 'active', source: 'subscription', stripe_subscription_id: 'sub_1', stripe_customer_id: 'cus_1' });
    // the entitlement gate reads as true for the holder
    await asUser(db, U);
    expect((await db.query(`select public.has_surveyor_entitlement() as e`)).rows[0].e).toBe(true);

    // revoke, then re-grant reactivates (revoked_at cleared)
    await asService(db);
    expect((await db.query(`select public.revoke_surveyor_entitlement('${U}'::uuid, 'test') as r`)).rows[0].r).toBe(true);
    row = (await db.query(`select status, revoked_at from public.surveyor_entitlements where user_id='${U}'`)).rows[0];
    expect(row.status).toBe('revoked');
    expect(row.revoked_at).not.toBeNull();
    await db.query(`select public.grant_surveyor_entitlement('${U}'::uuid, 'subscription', 'sub_1', 'cus_1')`);
    row = (await db.query(`select status, revoked_at from public.surveyor_entitlements where user_id='${U}'`)).rows[0];
    expect(row.status).toBe('active');
    expect(row.revoked_at).toBeNull();
  });

  it('revoke_by_subscription revokes only the row recording that sub, and is safe for an unknown sub', async () => {
    await asService(db);
    await db.query(`select public.grant_surveyor_entitlement('${U}'::uuid, 'subscription', 'sub_live', 'cus_1')`);
    // an unknown/stale sub revokes nothing
    expect((await db.query(`select public.revoke_surveyor_entitlement_by_subscription('sub_stale') as r`)).rows[0].r).toBe(false);
    expect((await db.query(`select status from public.surveyor_entitlements where user_id='${U}'`)).rows[0].status).toBe('active');
    // the recorded sub revokes exactly that row
    expect((await db.query(`select public.revoke_surveyor_entitlement_by_subscription('sub_live') as r`)).rows[0].r).toBe(true);
    expect((await db.query(`select status from public.surveyor_entitlements where user_id='${U}'`)).rows[0].status).toBe('revoked');
  });

  it('rejects a non-service-role caller', async () => {
    await asUser(db, U);
    await expect(db.query(`select public.grant_surveyor_entitlement('${U}'::uuid, 'subscription', null, null)`)).rejects.toThrow(/service-role only/);
  });
});

describe('surveyor_byok_set entitlement gate (RIDER)', () => {
  it('refuses a caller with no entitlement and not a founder', async () => {
    await asUser(db, U);
    await expect(db.query(`select public.surveyor_byok_set('anthropic', 'sk-test')`)).rejects.toThrow(/Surveyor entitlement is required/);
  });

  it('passes the gate for an entitled caller (fails later only on the vault crypto, not the gate)', async () => {
    await asService(db);
    await db.query(`select public.grant_surveyor_entitlement('${U}'::uuid, 'subscription', 'sub_1', 'cus_1')`);
    await asUser(db, U);
    let err = null;
    try { await db.query(`select public.surveyor_byok_set('anthropic', 'sk-test')`); } catch (e) { err = e; }
    // The gate did NOT raise — the only failure is the pgcrypto/secret path, absent in pglite.
    expect(String(err?.message ?? err ?? '')).not.toMatch(/Surveyor entitlement is required/);
  });

  it('passes the gate for a founder even without an entitlement', async () => {
    await asUser(db, F);
    let err = null;
    try { await db.query(`select public.surveyor_byok_set('anthropic', 'sk-test')`); } catch (e) { err = e; }
    expect(String(err?.message ?? err ?? '')).not.toMatch(/Surveyor entitlement is required/);
  });
});
