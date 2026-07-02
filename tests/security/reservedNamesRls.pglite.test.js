/**
 * reservedNamesRls.pglite.test.js — proves migration 095 actually enables RLS on
 * public.reserved_external_names (the last deny-by-default gap). Runs the REAL 095
 * statements against pglite over a minimal table and asserts relrowsecurity flips.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_095 = resolve(process.cwd(), 'supabase', 'migrations', '095_reserved_external_names_rls.sql');
const have = existsSync(MIG_095);
const SRC = have ? readFileSync(MIG_095, 'utf-8') : '';

// Vacuity guard (runs unconditionally): a rename/removal of 095 must fail loudly,
// not silently skip the runIf suite with zero assertions.
it('migration 095 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('095 reserved_external_names RLS (pglite)', () => {
  /** @type {any} */
  let db;
  const rlsEnabled = async () =>
    (await db.query(
      `select relrowsecurity from pg_class where oid = 'public.reserved_external_names'::regclass`,
    )).rows[0]?.relrowsecurity;

  beforeAll(async () => {
    db = new PGlite();
    // Platform roles the REVOKE targets, + the table 075 creates.
    await db.exec(`
      do $$ begin
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      end $$;
      create table if not exists public.reserved_external_names (name text primary key);
    `);
  });

  it('starts with RLS OFF, then 095 turns it ON', async () => {
    expect(await rlsEnabled()).toBe(false);
    // Apply the real migration statements verbatim.
    await db.exec(SRC);
    expect(await rlsEnabled()).toBe(true);
  });

  it('is idempotent (re-applying 095 keeps RLS on, no error)', async () => {
    await db.exec(SRC);
    expect(await rlsEnabled()).toBe(true);
  });
});
