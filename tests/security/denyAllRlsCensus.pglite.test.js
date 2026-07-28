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
// security-1: the money-wave PII/money tables that were unpinned (verified postures).
const M_160 = MIG('160', 'founder_transfer_cases');
const M_081 = MIG('081', 'client_error_events');
const M_157 = MIG('157', 'money_events');
const M_137 = MIG('137', 'founder_seats');
const have = [M_041, M_036, M_160, M_081, M_157, M_137].every(existsSync);
const rd = (f) => (existsSync(f) ? readFileSync(f, 'utf-8') : '');
const SRC_041 = rd(M_041);
const SRC_036 = rd(M_036);
const SRC_160 = rd(M_160);
const SRC_081 = rd(M_081);
const SRC_157 = rd(M_157);
const SRC_137 = rd(M_137);

/** The deny-all targets: [table, migration-source]. RLS-on + zero policies = deny-all. */
const TARGETS = [
  ['world_pulse_effects', () => SRC_041],
  ['analytics_identity_links', () => SRC_036],
  ['analytics_device_links', () => SRC_036],
  // Money-wave deny-all tables (security-1) — reachable only through service-role paths.
  // founder_transfer_* store to_email_lower nominee emails; client_error_events stores
  // crash payloads. All four are RLS-on with NO policy (the deny-all default).
  ['founder_transfer_cases', () => SRC_160],
  ['founder_transfer_events', () => SRC_160],
  ['founder_transfer_challenges', () => SRC_160],
  ['client_error_events', () => SRC_081],
];

/** Owner-SELECT targets: [table, migration-source]. RLS-on + EXACTLY ONE owner-scoped
 *  SELECT policy (auth.uid() = user_id) and NO write policy — the account panel reads a
 *  user's own rows; the webhook/definer-RPCs (service-role) are the only writers. */
const OWNER_SELECT = [
  ['money_events', () => SRC_157],
  ['founder_seat_buybacks', () => SRC_137],
];

/** Pull the `alter table public.<t> enable row level security;` statement. */
function extractRlsEnable(src, table) {
  const m = src.match(new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security\\s*;`, 'i'));
  if (!m) throw new Error(`could not find RLS-enable for ${table}`);
  return m[0];
}

/** Pull the `create policy … on public.<t> … ;` statement (table-scoped, single-statement:
 *  [^;] between `create policy` and the table can't span a statement boundary). */
function extractCreatePolicy(src, table) {
  const m = src.match(new RegExp(`^create\\s+policy[^;]*?on\\s+public\\.${table}\\b[\\s\\S]*?;`, 'im'));
  if (!m) throw new Error(`could not find create policy for ${table}`);
  return m[0];
}

let db;
const relrowsecurity = async (table) =>
  (await db.query(`select relrowsecurity from pg_class where oid = 'public.${table}'::regclass`)).rows[0]?.relrowsecurity;
const policyCount = async (table) =>
  (await db.query(`select count(*)::int c from pg_policies where schemaname = 'public' and tablename = $1`, [table])).rows[0].c;

it('all census migrations (041/036/160/081/157/137) are present (suite is not vacuous)', () => {
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
      create table public.founder_transfer_cases (id bigint primary key generated always as identity);
      create table public.founder_transfer_events (id bigint primary key generated always as identity);
      create table public.founder_transfer_challenges (id bigint primary key generated always as identity);
      create table public.client_error_events (id bigint primary key generated always as identity);
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
        // DELIBERATELY UNANCHORED (negative-presence): must catch a future re-creation at
        // ANY indentation — this corpus legally mints indented policies/triggers (005:69
        // DO-block EXECUTE; 003:65/004:49 DO-block DDL). Pinned in
        // netCurrentExtractorAnchor.walker FROZEN_UNANCHORED — do not "fix".
        expect(new RegExp(`create\\s+policy[\\s\\S]*?on\\s+public\\.${table}\\b`, 'i').test(src)).toBe(false);
      });
    });
  }
});

// security-1: the owner-scoped money tables. Unlike the deny-all wall, these carry ONE
// SELECT policy so a user can read their OWN rows in the account panel. This block runs
// the REAL policy DDL from the migration and proves it is a read-only, owner-only lens:
// the owner sees only their row, an intruder sees nothing, and a client write is denied.
describe.runIf(have)('owner-SELECT money tables (pglite — the real policy executes)', () => {
  let odb;
  const A = '11111111-1111-1111-1111-111111111111';
  const B = '22222222-2222-2222-2222-222222222222';
  const C = '33333333-3333-3333-3333-333333333333'; // an intruder / unrelated identity

  beforeAll(async () => {
    odb = await new PGlite();
    // Supabase policies key on auth.uid(); stand it up as a settable GUC so the test can
    // switch "who is asking" and the REAL policy DDL from the migration executes verbatim.
    // Superusers/owners BYPASS RLS even under FORCE, so we query as an unprivileged role
    // (app_user) — only then does the policy actually gate what a client would see.
    await odb.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('test.uid', true), '')::uuid $$;
      create role app_user nologin;
      grant usage on schema auth, public to app_user;
    `);
    for (const [table, getSrc] of OWNER_SELECT) {
      await odb.exec(`create table public.${table} (id bigint primary key generated always as identity, user_id uuid);`);
      // Seed BEFORE RLS is enabled (in prod the webhook / definer-RPCs — service-role — write).
      await odb.query(`insert into public.${table} (user_id) values ($1), ($2)`, [A, B]);
      await odb.exec(extractRlsEnable(getSrc(), table));
      await odb.exec(`alter table public.${table} force row level security;`);
      await odb.exec(extractCreatePolicy(getSrc(), table));
      // The client role holds table privileges — so a denial below is RLS, not GRANT.
      await odb.exec(`grant select, insert on public.${table} to app_user;`);
    }
  }, 60000);

  /** Run a statement AS the unprivileged client with a given auth.uid() (null = anon). */
  async function asUser(uid, sql) {
    await odb.exec(`set role app_user; set test.uid = '${uid ?? ''}';`);
    try {
      return await odb.query(sql);
    } finally {
      await odb.exec('reset role; reset test.uid;');
    }
  }

  for (const [table] of OWNER_SELECT) {
    describe(table, () => {
      const rowsAs = async (uid) =>
        (await asUser(uid, `select user_id from public.${table} order by user_id`)).rows.map((r) => r.user_id);

      it('carries EXACTLY one policy, and it is a SELECT policy (no write policy)', async () => {
        const cmds = (await odb.query(
          `select cmd from pg_policies where schemaname = 'public' and tablename = $1`, [table],
        )).rows.map((r) => r.cmd);
        expect(cmds).toEqual(['SELECT']);
      });

      it('the owner reads ONLY their own row; another user reads only theirs', async () => {
        expect(await rowsAs(A)).toEqual([A]);
        expect(await rowsAs(B)).toEqual([B]);
      });

      it('an unrelated identity (and anon) sees nothing (default-deny)', async () => {
        expect(await rowsAs(C)).toEqual([]);
        expect(await rowsAs(null)).toEqual([]);
      });

      it('a client write is denied — no INSERT policy under RLS (service-role only)', async () => {
        await expect(
          asUser(A, `insert into public.${table} (user_id) values ('${A}')`),
        ).rejects.toThrow();
      });
    });
  }
});
