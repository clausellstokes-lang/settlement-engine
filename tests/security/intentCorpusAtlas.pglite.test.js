/**
 * intentCorpusAtlas.pglite.test.js — EXECUTION test for the §9 pre-Surveyor intent
 * atlas (migration 134), in the house gallerySanitize.pglite / analyticsV2Rollups
 * pattern: load the REAL migration SQL into an in-process Postgres (pglite) and prove
 * it BEHAVES.
 *
 * Guarantees:
 *   1. rollup_intent_atlas_daily folds the manual op-cluster ATLAS (recurring hand-built
 *      op clusters = macro candidates) + the pre-Surveyor CORRECTION signal (per-kind
 *      total + reverted counts) into analytics_daily_rollups.
 *   2. Distinct edit kinds collapse into a single cluster SIGNATURE (a repeated kind does
 *      not inflate the signature or op_count).
 *   3. The rollup is idempotent (re-running a day overwrites, never doubles).
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_134 = join(MIGRATIONS_DIR, '134_intent_corpus_atlas.sql');
const MIG_134_SQL = existsSync(MIG_134) ? readFileSync(MIG_134, 'utf8') : null;

// Minimal scaffold: the two tables migration 134 reads/writes (edit_events per 036 —
// only the columns the rollup touches; the EAV rollup table per 038), plus service_role.
const SCAFFOLD = `
  do $$ begin
    if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
  end $$;
  create table public.edit_events (
    id              bigint generated always as identity primary key,
    actor_id        uuid,
    session_id      uuid,
    settlement_uuid uuid not null,
    kind            text not null,
    reverted        boolean not null default false,
    created_at      timestamptz not null default now()
  );
  create table public.analytics_daily_rollups (
    day    date not null,
    metric text not null,
    dims   jsonb not null default '{}'::jsonb,
    value  bigint not null default 0,
    primary key (day, metric, dims)
  );
`;

let db;

describe('migration 134 exists (guards against silent vacuous skip)', () => {
  it('134_intent_corpus_atlas.sql is present (renamed/dropped must fail loudly)', () => {
    expect(existsSync(MIG_134), `missing: ${MIG_134}`).toBe(true);
    expect(MIG_134_SQL && MIG_134_SQL.length, '134 is empty').toBeTruthy();
  });
});

describe.runIf(!!MIG_134_SQL)('Intent atlas rollup (pglite execution)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SCAFFOLD);
    await db.exec(MIG_134_SQL); // the REAL migration function
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the migration installed the intent-atlas rollup fn', async () => {
    const { rows } = await db.query(
      `select proname from pg_proc where proname = 'rollup_intent_atlas_daily'`);
    expect(rows.map(r => r.proname)).toEqual(['rollup_intent_atlas_daily']);
  });

  it('folds manual op-clusters + the correction signal into analytics_daily_rollups', async () => {
    const day = '2026-06-10';
    const u1 = '00000000-0000-4000-8000-000000000001';
    const u2 = '00000000-0000-4000-8000-000000000002';
    const u3 = '00000000-0000-4000-8000-000000000003';
    const s1 = '00000000-0000-4000-9000-000000000001';
    const s2 = '00000000-0000-4000-9000-000000000002';
    const s3 = '00000000-0000-4000-9000-000000000003';
    // Cluster A (session s1 / settlement u1): {add-institution ×2, rename-npc} — the
    // duplicate add-institution must collapse in the signature (DISTINCT). rename-npc reverted.
    // Cluster B (session s2 / settlement u2): {add-institution, rename-npc} — SAME signature
    // as A → a RECURRING cluster (the macro candidate).
    // Cluster C (session s3 / settlement u3): {edit-prose} — a lone signature.
    await db.exec(`
      insert into public.edit_events (session_id, actor_id, settlement_uuid, kind, reverted, created_at) values
        ('${s1}', gen_random_uuid(), '${u1}', 'add-institution', false, '${day}T10:00:00Z'),
        ('${s1}', gen_random_uuid(), '${u1}', 'add-institution', false, '${day}T10:01:00Z'),
        ('${s1}', gen_random_uuid(), '${u1}', 'rename-npc',      true,  '${day}T10:02:00Z'),
        ('${s2}', gen_random_uuid(), '${u2}', 'add-institution', false, '${day}T11:00:00Z'),
        ('${s2}', gen_random_uuid(), '${u2}', 'rename-npc',      false, '${day}T11:01:00Z'),
        ('${s3}', gen_random_uuid(), '${u3}', 'edit-prose',      false, '${day}T12:00:00Z');
    `);

    const n = (await db.query(`select public.rollup_intent_atlas_daily('${day}'::date) as n`)).rows[0].n;
    expect(Number(n)).toBeGreaterThan(0);

    const q = async (metric, dims) =>
      Number((await db.query(
        `select value from public.analytics_daily_rollups where day = $1 and metric = $2 and dims = $3::jsonb`,
        [day, metric, JSON.stringify(dims)],
      )).rows[0]?.value ?? -1);

    // Two clusters share the {add-institution, rename-npc} signature → a recurring cluster.
    expect(await q('intent_manual_cluster', { signature: 'add-institution,rename-npc', op_count: 2 })).toBe(2);
    // The lone edit-prose cluster.
    expect(await q('intent_manual_cluster', { signature: 'edit-prose', op_count: 1 })).toBe(1);
    // Correction signal: rename-npc — 2 total, 1 reverted (revert rate 1/2).
    expect(await q('intent_op_kind_total', { kind: 'rename-npc' })).toBe(2);
    expect(await q('intent_op_kind_reverted', { kind: 'rename-npc' })).toBe(1);
    // add-institution appears 3× (twice in A, once in B), none reverted.
    expect(await q('intent_op_kind_total', { kind: 'add-institution' })).toBe(3);
    expect(await q('intent_op_kind_reverted', { kind: 'add-institution' })).toBe(-1); // no reverted row emitted
  });

  it('rollup is idempotent — re-running the same day overwrites, never doubles', async () => {
    const day = '2026-06-11';
    const u = '00000000-0000-4000-8000-0000000000aa';
    const s = '00000000-0000-4000-9000-0000000000aa';
    await db.exec(`insert into public.edit_events (session_id, actor_id, settlement_uuid, kind, created_at) values
      ('${s}', gen_random_uuid(), '${u}', 'add-stressor', '${day}T10:00:00Z');`);
    await db.query(`select public.rollup_intent_atlas_daily('${day}'::date)`);
    await db.query(`select public.rollup_intent_atlas_daily('${day}'::date)`); // re-run
    const v = Number((await db.query(
      `select value from public.analytics_daily_rollups where day = $1 and metric = 'intent_op_kind_total' and dims = $2::jsonb`,
      [day, JSON.stringify({ kind: 'add-stressor' })],
    )).rows[0].value);
    expect(v).toBe(1); // NOT 2 — the on-conflict overwrite held
  });
});
