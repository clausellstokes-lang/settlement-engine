/**
 * worldSimMetrics.pglite.test.js — EXECUTION test for migration 196, in the house
 * pglite pattern: load the REAL migration SQL into an in-process Postgres and prove
 * it BEHAVES (ODQ §117a, §120.2).
 *
 * Four guarantees, none of them read out of the grant text:
 *   1. the table exists and the four forbidden columns are ABSENT — a planted
 *      `ALTER TABLE … ADD COLUMN actor_id` is shown to be catchable by the same walk;
 *   2. `anon` and `authenticated` hold ZERO privileges, asserted by EXECUTING a
 *      privilege query rather than by matching the REVOKE lines;
 *   3. the loader RPC writes what the emitter emits, and refuses a non-array payload;
 *   4. `rollup_sim_metrics` returns the 038/133 EAV shape.
 *
 * ⚠ The whole-sequence control (`migrationSequenceAll.pglite.test.js`) applies every
 * migration in order and must stay green — that is the executed negative control the
 * migration-train discipline demands, and it is already wired.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { emitRows } from '../../scripts/telemetry/simMetricEmitter.mjs';
import { buildLoadPayload } from '../../scripts/telemetry/loadSimMetrics.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_196 = join(MIGRATIONS_DIR, '196_world_sim_metrics.sql');
const MIG_196_SQL = existsSync(MIG_196) ? readFileSync(MIG_196, 'utf8') : null;
const FIXTURE = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/simSoakReceiptFixture.json'), 'utf8'));

/** The four the schema must never grow. */
const FORBIDDEN_COLUMNS = ['actor_id', 'session_id', 'country', 'consent_tier'];

const SCAFFOLD = `
  do $$ begin
    if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
    if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  end $$;
`;

let db;

describe('migration 196 exists (guards against silent vacuous skip)', () => {
  it('196_world_sim_metrics.sql is present (renamed/dropped must fail loudly)', () => {
    expect(existsSync(MIG_196), `missing: ${MIG_196}`).toBe(true);
    expect(MIG_196_SQL && MIG_196_SQL.length, '196 is empty').toBeTruthy();
  });
});

describe('migration 196 — world_sim_metrics behaves', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SCAFFOLD);
    await db.exec(MIG_196_SQL);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('declares the run identity and NONE of the four forbidden columns', async () => {
    const { rows } = await db.query(
      "select column_name from information_schema.columns where table_name = 'world_sim_metrics'",
    );
    const columns = rows.map((row) => row.column_name).sort();
    expect(columns).toEqual([
      'dims', 'epoch_index', 'epoch_kind', 'horizon', 'metric', 'profile',
      'recorded_at', 'run_id', 'scale', 'schema_version', 'seed_family',
      'source_fingerprint', 'value',
    ]);
    expect(columns.filter((column) => FORBIDDEN_COLUMNS.includes(column))).toEqual([]);
    // CONTROL: the walk is a real gate — a planted column IS visible to it.
    await db.exec('alter table public.world_sim_metrics add column actor_id uuid');
    const after = await db.query(
      "select column_name from information_schema.columns where table_name = 'world_sim_metrics'",
    );
    expect(after.rows.map((row) => row.column_name).filter((c) => FORBIDDEN_COLUMNS.includes(c))).toEqual(['actor_id']);
    await db.exec('alter table public.world_sim_metrics drop column actor_id');
  });

  it('grants anon and authenticated ZERO privileges, and keeps RLS on with no policy', async () => {
    const { rows } = await db.query(`
      select grantee, privilege_type from information_schema.role_table_grants
      where table_name = 'world_sim_metrics' and grantee in ('anon', 'authenticated')
    `);
    expect(rows).toEqual([]);
    const service = await db.query(`
      select privilege_type from information_schema.role_table_grants
      where table_name = 'world_sim_metrics' and grantee = 'service_role' order by privilege_type
    `);
    expect(service.rows.map((row) => row.privilege_type)).toEqual(['INSERT', 'SELECT']);
    const rls = await db.query("select relrowsecurity from pg_class where relname = 'world_sim_metrics'");
    expect(rls.rows[0].relrowsecurity).toBe(true);
    const policies = await db.query("select policyname from pg_policies where tablename = 'world_sim_metrics'");
    expect(policies.rows).toEqual([]);
  });

  it('loads exactly what the emitter emits, and refuses a payload that is not an array', async () => {
    const rows = emitRows(FIXTURE.clean, { runId: 'run-pglite', sourceSha: 'b'.repeat(40), profile: 'cert30' });
    const payload = buildLoadPayload(rows.map((row) => JSON.stringify(row)).join('\n'));
    expect(payload.length).toBe(rows.length);
    const loaded = await db.query('select public.load_sim_metrics($1::jsonb) as written', [JSON.stringify(payload)]);
    expect(Number(loaded.rows[0].written)).toBe(rows.length);
    const stored = await db.query("select count(*)::int as n from public.world_sim_metrics where run_id = 'run-pglite'");
    expect(stored.rows[0].n).toBe(rows.length);
    const kinds = await db.query(
      "select distinct epoch_kind from public.world_sim_metrics where run_id = 'run-pglite' order by epoch_kind",
    );
    expect(kinds.rows.map((row) => row.epoch_kind)).toEqual(['run', 'year']);
    await expect(db.query("select public.load_sim_metrics('7'::jsonb)")).rejects.toThrow(/jsonb array/);
    // The epoch vocabulary is a CHECK, so a third value is a schema act.
    await expect(db.query(`
      insert into public.world_sim_metrics
        (run_id, seed_family, scale, horizon, profile, source_fingerprint, schema_version,
         metric, epoch_kind, epoch_index, dims, value)
      values ('x','x',1,1,'x','x',5,'sim_finding','decade',0,'{}'::jsonb,1)
    `)).rejects.toThrow(/epoch_kind_check/);
  });

  it('rolls a run up into the 038/133 EAV shape', async () => {
    const { rows } = await db.query("select * from public.rollup_sim_metrics('run-pglite')");
    expect(rows.length).toBeGreaterThan(0);
    expect(Object.keys(rows[0]).sort()).toEqual(['dims', 'metric', 'value']);
    const tempo = rows.filter((row) => row.metric === 'sim_event_tempo'
      && JSON.parse(typeof row.dims === 'string' ? row.dims : JSON.stringify(row.dims)).measure === 'events');
    expect(tempo.length).toBe(1);
    // The fold really sums across epochs: three fixture years of eventCount 13/14/15.
    expect(Number(tempo[0].value)).toBe(13 + 14 + 15);
    const empty = await db.query("select * from public.rollup_sim_metrics('no-such-run')");
    expect(empty.rows).toEqual([]);
  });
});
