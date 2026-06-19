/**
 * customContentDeities.pglite.test.js — EXECUTION-level tests for migration 049
 * (Feature D / R1: the deities custom-content bucket).
 *
 * Loads the REAL 004 + 049 DDL into an in-process Postgres (pglite) and exercises
 * the constraints that actually protect the bucket:
 *
 *   1. The widened `custom_content_category_check` ADMITS `deities` AND the three
 *      drifted categories (`services`/`factions`/`supplyChains`) that 004 never
 *      allowed — and still REJECTS a genuinely unknown category.
 *   2. The new `custom_content_deity_axes_check` REJECTS a deity row with a bad
 *      axis (mirroring validateDeity) and ACCEPTS a valid one. NON-deity rows are
 *      unaffected by the axis check.
 *
 * Owner-scoped RLS is asserted SEPARATELY (static): pglite is single-connection
 * and does not enforce RLS role grants, so — exactly like creditLedger.pglite —
 * the owner read/write + premium-write policy DDL is asserted by scanning the
 * net migration SQL (004 establishes owner scoping; 017 tightens writes to
 * premium; 049 inherits both, table-level, unchanged).
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG004 = resolve(dir, '004_custom_content.sql');
const MIG017 = resolve(dir, '017_fix_credit_auth_integrity.sql');
const MIG049 = resolve(dir, '049_custom_content_deities.sql');
const allExist = [MIG004, MIG017, MIG049].every(existsSync);

const UID = '11111111-1111-1111-1111-111111111111';

/** Extract just the two ALTER TABLE ... custom_content ... CHECK statements from
 *  049 (skip the COMMENT, which references nothing pglite needs). We run the
 *  whole file; it's pure DDL on the table 004 created. */
function loadSql(path) {
  return readFileSync(path, 'utf-8');
}

let db;
const insert = (category, data) =>
  db.query(
    `insert into public.custom_content (user_id, category, data) values ($1, $2, $3::jsonb)`,
    [UID, category, JSON.stringify(data)],
  );

const VALID_DEITY = { name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' };

describe.runIf(allExist)('migration 049 — deities bucket constraints (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Minimal auth schema so 004's RLS DDL (auth.uid()) parses. The CHECK
    // constraints we exercise don't need auth; RLS is not enforced single-conn.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- gen_random_uuid() is native to pglite (used by the table's id default).
      -- Minimal auth.users so 004's user_id FK resolves, plus a seed row for the
      -- owner UID we insert as.
      create table auth.users (id uuid primary key);
      insert into auth.users (id) values ('${UID}');
      -- minimal profiles table so 004's developer-read policy DDL parses.
      create table public.profiles (id uuid primary key, role text);
    `);
    // 004 creates the table + the original CHECK + RLS. 049 widens the CHECK and
    // adds the deity-axes CHECK. Run both in order.
    await db.exec(loadSql(MIG004));
    await db.exec(loadSql(MIG049));
    await db.exec(`set test.uid = '${UID}';`);
  });

  beforeEach(async () => {
    await db.exec('truncate public.custom_content cascade;');
  });

  // ── Category CHECK ─────────────────────────────────────────────────────────
  it('admits the new deities category', async () => {
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
    const { rows } = await db.query(`select count(*)::int as n from public.custom_content where category = 'deities'`);
    expect(rows[0].n).toBe(1);
  });

  it('backfills the three drifted categories (services / factions / supplyChains)', async () => {
    await expect(insert('services', { name: 'Healer' })).resolves.toBeTruthy();
    await expect(insert('factions', { name: 'Guild' })).resolves.toBeTruthy();
    await expect(insert('supplyChains', { name: 'Iron line' })).resolves.toBeTruthy();
  });

  it('still rejects a genuinely unknown category', async () => {
    await expect(insert('wibble', { name: 'Nope' })).rejects.toThrow(/custom_content_category_check/);
  });

  // ── Deity axes CHECK ───────────────────────────────────────────────────────
  it('accepts a deity with all three valid axes', async () => {
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
  });

  it('rejects a deity with a bad alignment axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, alignmentAxis: 'lawful' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity with a bad temperament axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, temperamentAxis: 'sleepy' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity with a bad rank axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, rankAxis: 'demigod' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity missing an axis entirely', async () => {
    await expect(insert('deities', { name: 'Axeless' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('the axes check does NOT constrain non-deity rows', async () => {
    // A faction row with a "bad axis"-looking field is fine — the check is
    // short-circuited to TRUE for every non-deity category.
    await expect(insert('factions', { name: 'Guild', alignmentAxis: 'lawful' })).resolves.toBeTruthy();
  });
});

// ── Owner-scoped + premium-write RLS (static contract) ───────────────────────
describe.runIf(allExist)('migration 049 — RLS is owner-scoped + premium-gated (inherited, static)', () => {
  const sql004 = loadSql(MIG004);
  const sql017 = loadSql(MIG017);

  it('004 enables RLS and scopes read/write to the owner', () => {
    expect(sql004).toMatch(/alter table public\.custom_content enable row level security/i);
    expect(sql004).toMatch(/users read own custom content[\s\S]*auth\.uid\(\) = user_id/i);
    expect(sql004).toMatch(/users delete own custom content[\s\S]*auth\.uid\(\) = user_id/i);
  });

  it('017 tightens writes to premium accounts (the server gate deities inherit)', () => {
    expect(sql017).toMatch(/premium users insert own custom content[\s\S]*profile_has_premium_access/i);
    expect(sql017).toMatch(/premium users update own custom content[\s\S]*profile_has_premium_access/i);
    expect(sql017).toMatch(/premium users delete own custom content[\s\S]*profile_has_premium_access/i);
  });

  it('049 adds NO tier predicate of its own (premium gate stays the inherited one — D.0)', () => {
    const sql049 = loadSql(MIG049);
    expect(sql049).not.toMatch(/profile_has_premium_access/i);
    expect(sql049).not.toMatch(/create policy/i);
  });
});
