/**
 * denyAllRlsCensus.pglite.test.js — pins the DENY-ALL (RLS-on + zero-policy) wall
 * on the tables that must never be reachable by anon/authenticated directly, only
 * through service-role paths. REAL BUT UNPINNED (Wave-D wall census):
 *   - public.world_pulse_effects        (041) — raw system-mutation capture
 *   - public.analytics_identity_links   (036) — the real-identity ↔ random-actor map
 *   - public.analytics_device_links     (036) — the device ↔ actor correlation map
 *
 * The "deny all" is the RLS-ON-with-NO-POLICY default (Postgres denies every row to
 * a non-owner when RLS is enabled and no policy grants access). This suite pins BOTH
 * halves so a future edit cannot silently weaken it:
 *   1. FUNCTIONAL (pglite): the migration's `enable row level security` flips
 *      relrowsecurity ON, and the migration adds ZERO policies for the table.
 *   2. SOURCE: the migration file enables RLS on the table AND contains no
 *      `create policy … on <table>` — the deny-all is by design, not an oversight a
 *      later "add a read policy" edit could quietly turn into an allow.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = (n, name) => resolve(process.cwd(), 'supabase', 'migrations', `${n}_${name}.sql`);
const M_041 = MIG('041', 'system_mutation_capture');
const M_036 = MIG('036', 'analytics_core');
const have = [M_041, M_036].every(existsSync);
const SRC_041 = have ? readFileSync(M_041, 'utf-8') : '';
const SRC_036 = have ? readFileSync(M_036, 'utf-8') : '';

/** The deny-all targets: [table, migration-source]. */
const TARGETS = [
  ['world_pulse_effects', () => SRC_041],
  ['analytics_identity_links', () => SRC_036],
  ['analytics_device_links', () => SRC_036],
];

/** Pull the `alter table public.<t> enable row level security;` statement. */
function extractRlsEnable(src, table) {
  const m = src.match(new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security\\s*;`, 'i'));
  if (!m) throw new Error(`could not find RLS-enable for ${table}`);
  return m[0];
}

let db;
const relrowsecurity = async (table) =>
  (await db.query(`select relrowsecurity from pg_class where oid = 'public.${table}'::regclass`)).rows[0]?.relrowsecurity;
const policyCount = async (table) =>
  (await db.query(`select count(*)::int c from pg_policies where schemaname = 'public' and tablename = $1`, [table])).rows[0].c;

it('migrations 041 / 036 are present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('deny-all RLS census (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Minimal stand-ins for each table (RLS applies to the table, not its columns).
    await db.exec(`
      create table public.world_pulse_effects (id bigint primary key generated always as identity);
      create table public.analytics_identity_links (user_id uuid primary key, actor_id uuid not null);
      create table public.analytics_device_links (device_key text primary key, actor_id uuid not null);
    `);
  }, 60000);

  for (const [table, getSrc] of TARGETS) {
    describe(table, () => {
      it('starts RLS OFF, then the migration turns RLS ON', async () => {
        expect(await relrowsecurity(table)).toBe(false);
        await db.exec(extractRlsEnable(getSrc(), table));
        expect(await relrowsecurity(table)).toBe(true);
      });

      it('has ZERO policies (RLS-on + no-policy = deny all)', async () => {
        expect(await policyCount(table)).toBe(0);
      });

      it('the migration SOURCE enables RLS and defines NO policy for it', () => {
        const src = getSrc();
        expect(new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`, 'i').test(src)).toBe(true);
        // No `create policy … on public.<table>` anywhere in the migration.
        expect(new RegExp(`create\\s+policy[\\s\\S]*?on\\s+public\\.${table}\\b`, 'i').test(src)).toBe(false);
      });
    });
  }
});
