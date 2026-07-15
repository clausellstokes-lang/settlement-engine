/**
 * systemConfigPublicRead.pglite.test.js — EXECUTION test of the system_config
 * public-read ALLOWLIST (review B16 finding #15, migration 058).
 *
 * THE PROBLEM 058 FIXES
 *   002 created system_config with `for select using (true)` — EVERY row is
 *   world-readable by any anonymous visitor. The moment an operator drops a
 *   sensitive key (feature flag, internal threshold) into the table it leaks. 058
 *   replaces the blanket policy with a KEY ALLOWLIST: only the explicitly public
 *   keys (currently `support_enabled`) are anon-readable; every other key is
 *   private by default. Migration 058 had NO test, so a reverted/loosened policy
 *   could ship green — this RUNS the real 058 policy DDL and asserts the boundary.
 *
 * REALISM
 *   PostgREST reads run as the anon/authenticated role with RLS in force. pglite's
 *   default connection is a SUPERUSER (bypasses RLS), so we `force row level
 *   security` and `set role` to a non-superuser for the public reads — the faithful
 *   representation of an anon/authenticated PostgREST select.
 *
 * Loads the real "Public reads scoped to safe config keys" policy verbatim from
 * migration 058.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_058 = resolve(process.cwd(), 'supabase', 'migrations', '058_scope_system_config_public_read.sql');
const present = existsSync(MIG_058);

// Hard-fail (not a silent vacuous skip) if migration 058 moves/renames.
describe('system_config pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 058 is present (a moved migration must fail loudly)', () => {
    expect(present, '058_scope_system_config_public_read.sql is missing — allowlist coverage dropped').toBe(true);
  });
});

/** Extract the allowlist SELECT policy verbatim from migration 058. */
function extractPolicy() {
  const src = readFileSync(MIG_058, 'utf-8');
  const m = src.match(/create policy "Public reads scoped to safe config keys"[\s\S]*?;\s*\n/i);
  if (!m) throw new Error('could not extract the allowlist policy from migration 058');
  return m[0];
}

let db;
const asAnon = async (sql) => {
  await db.exec(`set role nosuperuser; ${sql ?? ''}`);
};
const readKeys = async () => {
  await db.exec('set role nosuperuser;');
  const { rows } = await db.query('select key from public.system_config order by key');
  return rows.map((r) => r.key);
};

describe.runIf(present)('system_config public-read allowlist — executed against 058 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create table public.system_config (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      );
      -- The original 002 blanket policy this migration replaces; 058 drops it.
      create policy "Anyone can read system config" on public.system_config
        for select using (true);
      alter table public.system_config enable row level security;
      alter table public.system_config force row level security; -- required for pglite to enforce RLS
    `);
    // Apply the REAL 058 statements: it DROPs the blanket policy and CREATEs the
    // scoped allowlist. We replay the drop + the extracted create so the net state
    // matches production.
    await db.exec(`drop policy if exists "Anyone can read system config" on public.system_config;`);
    await db.exec(`drop policy if exists "Public reads scoped to safe config keys" on public.system_config;`);
    await db.exec(extractPolicy());
    // anon/authenticated PostgREST roles get SELECT on the table (RLS still gates
    // WHICH rows). No insert/update policy — writes are service_role-only.
    await db.exec(`
      create role nosuperuser nologin;
      grant select on public.system_config to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role;
      truncate public.system_config;
      insert into public.system_config (key, value) values
        ('support_enabled', 'true'::jsonb),
        ('internal_threshold', '42'::jsonb),
        ('secret_feature_flag', '"beta"'::jsonb);
    `);
  });

  it('a public reader sees ONLY the allowlisted support_enabled key', async () => {
    expect(await readKeys()).toEqual(['support_enabled']);
  });

  it('a public reader CANNOT read a non-allowlisted key directly', async () => {
    await db.exec('set role nosuperuser;');
    const { rows } = await db.query(
      `select value from public.system_config where key = 'internal_threshold'`,
    );
    // RLS filters the row out entirely — not an error, just an empty result.
    expect(rows).toEqual([]);
  });

  it('a NEW key added later is PRIVATE by default (not in the allowlist)', async () => {
    await db.exec(`reset role; insert into public.system_config (key, value) values ('new_operational_key', '"x"'::jsonb);`);
    const visible = await readKeys();
    expect(visible).not.toContain('new_operational_key');
    expect(visible).toEqual(['support_enabled']);
  });

  it('the superuser/service path still sees every key (RLS is for the public read only)', async () => {
    await db.exec('reset role;');
    const { rows } = await db.query('select key from public.system_config order by key');
    expect(rows.map((r) => r.key)).toEqual(
      ['internal_threshold', 'secret_feature_flag', 'support_enabled'],
    );
  });

  // Sentinel: with the OLD blanket `using (true)` policy a public reader would see
  // EVERY key — proving the allowlist test above is not vacuously green.
  it('sentinel: the old blanket policy would have leaked every key', async () => {
    await db.exec(`reset role; drop policy "Public reads scoped to safe config keys" on public.system_config;`);
    await db.exec(`reset role; create policy "blanket" on public.system_config for select using (true);`);
    const leaked = await readKeys();
    expect(leaked).toEqual(['internal_threshold', 'secret_feature_flag', 'support_enabled']);
    // Restore the real allowlist policy for any subsequent run.
    await db.exec(`reset role; drop policy "blanket" on public.system_config;`);
    await db.exec(extractPolicy());
  });
});
