/**
 * purgeSparesPaidEntitlement.pglite.test.js — EXECUTION proof of the downgrade-
 * audit P0 fix (migration 162) against in-process Postgres (pglite).
 *
 * THE BUG (024): purge_expired_plan_inactive_assets() blind-DELETEs expired
 * inactive settlements; dossier_entitlements.save_id is ON DELETE CASCADE (108),
 * so the purge silently destroyed the owner's PURCHASED export right. 162 spares
 * any settlement whose owner holds a live (status='active') entitlement.
 *
 * WHAT THIS PROVES (each a revert-detector)
 *   1. an expired inactive settlement with an ACTIVE entitlement SURVIVES the purge
 *      (and so does the entitlement) — the paid right is not destroyed.
 *   2. an expired inactive settlement with a CLAWED_BACK entitlement IS purged — a
 *      refunded right does not spare.
 *   3. an expired inactive settlement with NO entitlement IS purged (024 behaviour
 *      unchanged), and the returned settlements count reflects exactly the purged.
 *   4. an ACTIVE-state settlement is never touched regardless of entitlement.
 *   5. saved_maps still purge on the same window (that DELETE is 024-verbatim).
 *
 * The migration file is applied VERBATIM, so an edit to 162 is what this exercises.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '162_purge_spares_paid_entitlements.sql');
const have = existsSync(MIG);
const SRC = have ? readFileSync(MIG, 'utf-8') : '';

it('migration 162 present (suite not vacuous)', () => {
  expect(have).toBe(true);
});

let db;
const purge = async () =>
  (await (async () => { await db.exec('reset role;'); return db.query('select public.purge_expired_plan_inactive_assets() as r'); })()).rows[0].r;
const count = async (table) =>
  Number((await db.query(`select count(*)::int as n from public.${table}`)).rows[0].n);

/** Seed one settlement; returns its id. */
const seedSettlement = async (state, expiresSql) =>
  (await db.query(
    `insert into public.settlements (user_id, name, access_state, retention_expires_at)
       values (gen_random_uuid(), 'Town', $1, ${expiresSql}) returning id`,
    [state],
  )).rows[0].id;

const seedEntitlement = async (saveId, status) =>
  db.query(`insert into public.dossier_entitlements (save_id, user_id, status) values ($1, gen_random_uuid(), $2)`, [saveId, status]);

describe.runIf(have)('purge_expired_plan_inactive_assets spares live paid entitlements (162)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
      end $do$;
      create table if not exists public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        name text not null,
        access_state text not null default 'active',
        retention_expires_at timestamptz
      );
      create table if not exists public.saved_maps (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        access_state text not null default 'active',
        retention_expires_at timestamptz
      );
      create table if not exists public.dossier_entitlements (
        id uuid primary key default gen_random_uuid(),
        save_id uuid not null references public.settlements(id) on delete cascade,
        user_id uuid not null,
        status text not null default 'active'
      );
    `);
    // The real migration 162, verbatim (the function + revoke/grant).
    await db.exec(SRC);
  }, 60000);

  beforeEach(async () => {
    await db.exec('reset role; truncate public.dossier_entitlements, public.settlements, public.saved_maps cascade;');
  });

  it('SPARES an expired inactive settlement whose owner holds a live paid entitlement', async () => {
    const save = await seedSettlement('inactive_plan', "now() - interval '1 day'");
    await seedEntitlement(save, 'active');
    const r = await purge();
    expect(r.settlements).toBe(0);          // the paid settlement was NOT purged
    expect(await count('settlements')).toBe(1);
    expect(await count('dossier_entitlements')).toBe(1); // the paid right survives
  });

  it('PURGES an expired inactive settlement whose entitlement was clawed back', async () => {
    const save = await seedSettlement('inactive_plan', "now() - interval '1 day'");
    await seedEntitlement(save, 'clawed_back');
    const r = await purge();
    expect(r.settlements).toBe(1);          // a refunded right does not spare
    expect(await count('settlements')).toBe(0);
    expect(await count('dossier_entitlements')).toBe(0); // cascade removed it
  });

  it('PURGES an expired inactive settlement with no entitlement (024 behaviour unchanged)', async () => {
    await seedSettlement('inactive_plan', "now() - interval '1 day'");
    await seedSettlement('pending_delete', "now() - interval '1 hour'");
    const r = await purge();
    expect(r.settlements).toBe(2);
    expect(await count('settlements')).toBe(0);
  });

  it('never touches an ACTIVE-state settlement, entitlement or not', async () => {
    await seedSettlement('active', "now() - interval '5 days'");
    const withEnt = await seedSettlement('active', "now() - interval '5 days'");
    await seedEntitlement(withEnt, 'active');
    const r = await purge();
    expect(r.settlements).toBe(0);
    expect(await count('settlements')).toBe(2);
  });

  it('still purges expired inactive saved_maps (that DELETE is 024-verbatim)', async () => {
    await db.query(
      `insert into public.saved_maps (user_id, access_state, retention_expires_at)
         values (gen_random_uuid(), 'inactive_plan', now() - interval '1 day')`,
    );
    const r = await purge();
    expect(r.campaigns).toBe(1);
    expect(await count('saved_maps')).toBe(0);
  });
});
