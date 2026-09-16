/**
 * analyticsV2Rollups.pglite.test.js — EXECUTION test for the Analytics v2 rollup
 * layer (migration 133), in the house gallerySanitize.pglite pattern: load the REAL
 * migration SQL into an in-process Postgres (pglite) and prove it BEHAVES.
 *
 * Two guarantees:
 *   1. rollup_analytics_v2_daily folds the §1.2-1.5 groupings into
 *      analytics_daily_rollups (idempotent; correct dims/values).
 *   2. The sellable market reports enforce the §4 HARD LINES: the market-plane +
 *      production-corpus filter, and the k-anonymity floors (k=50 users / 200
 *      campaigns) — cells below EITHER floor are suppressed; a cell clearing BOTH is
 *      emitted. (Floors are lowered to small test values via CREATE OR REPLACE so the
 *      suppress/emit boundary is exercisable without inserting thousands of rows — the
 *      LOGIC under test is the HAVING, not the specific constant.)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_133 = join(MIGRATIONS_DIR, '133_analytics_v2_rollups.sql');
const MIG_133_SQL = existsSync(MIG_133) ? readFileSync(MIG_133, 'utf8') : null;

// Minimal scaffold: the two tables migration 133 reads/writes, matching the real
// columns (analytics_events per 036 + the 132 market/corpus columns; the EAV rollup
// table per 038), plus the service_role role its GRANTs target.
const SCAFFOLD = `
  do $$ begin
    if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
  end $$;
  create table public.analytics_events (
    id           bigint generated always as identity primary key,
    event        text not null,
    actor_id     uuid,
    subject_id   uuid,
    props        jsonb not null default '{}'::jsonb,
    consent_tier text not null default 'product',
    corpus       text,
    market_opt_in boolean not null default false,
    created_at   timestamptz not null default now()
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

describe('migration 133 exists (guards against silent vacuous skip)', () => {
  it('133_analytics_v2_rollups.sql is present (renamed/dropped must fail loudly)', () => {
    expect(existsSync(MIG_133), `missing: ${MIG_133}`).toBe(true);
    expect(MIG_133_SQL && MIG_133_SQL.length, '133 is empty').toBeTruthy();
  });
});

describe.runIf(!!MIG_133_SQL)('Analytics v2 rollups (pglite execution)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SCAFFOLD);
    await db.exec(MIG_133_SQL); // the REAL migration functions
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the migration installed the v2 rollup + market functions', async () => {
    const { rows } = await db.query(`
      select proname from pg_proc
      where proname in ('rollup_analytics_v2_daily','report_market_archetype_popularity',
                        'report_market_preset_adoption','market_k_min_users','market_k_min_campaigns')
      order by proname`);
    expect(rows.map(r => r.proname)).toEqual([
      'market_k_min_campaigns', 'market_k_min_users',
      'report_market_archetype_popularity', 'report_market_preset_adoption',
      'rollup_analytics_v2_daily',
    ]);
  });

  it('the k-anonymity floors default to 50 users / 200 campaigns', async () => {
    const u = (await db.query('select public.market_k_min_users() as k')).rows[0].k;
    const c = (await db.query('select public.market_k_min_campaigns() as k')).rows[0].k;
    expect(Number(u)).toBe(50);
    expect(Number(c)).toBe(200);
  });

  it('rollup_analytics_v2_daily folds the §1.2-1.5 groupings into analytics_daily_rollups', async () => {
    const day = '2026-06-01';
    // §1.2 construction: 3 martial-town generations, 1 a regeneration.
    await db.exec(`
      insert into public.analytics_events (event, actor_id, props, created_at) values
        ('generation_completed', gen_random_uuid(), '{"config_archetype":"martial","tier":"town","is_regeneration":false}'::jsonb, '${day}T10:00:00Z'),
        ('generation_completed', gen_random_uuid(), '{"config_archetype":"martial","tier":"town","is_regeneration":false}'::jsonb, '${day}T10:01:00Z'),
        ('generation_completed', gen_random_uuid(), '{"config_archetype":"martial","tier":"town","is_regeneration":true}'::jsonb,  '${day}T10:02:00Z');
    `);
    // §1.3 realm + §1.5 movers: two advances under the 'siege' preset with flags/movers.
    await db.exec(`
      insert into public.analytics_events (event, actor_id, props, created_at) values
        ('world_pulse_advanced', gen_random_uuid(),
          '{"sim_config":{"preset_id":"siege","flags_on":["seasons","warLayer"]},"movers_active":["embattlement","caravans"]}'::jsonb, '${day}T11:00:00Z'),
        ('world_pulse_advanced', gen_random_uuid(),
          '{"sim_config":{"preset_id":"siege","flags_on":["seasons"]},"movers_active":["embattlement"]}'::jsonb, '${day}T11:05:00Z');
    `);
    // §1.3 realm topology + §1.4 approval decisions.
    await db.exec(`
      insert into public.analytics_events (event, actor_id, props, created_at) values
        ('world_canonized', gen_random_uuid(), '{"topology_class":"hub-and-spoke","settlement_count_band":"5_9"}'::jsonb, '${day}T12:00:00Z'),
        ('world_pulse_proposal_applied',   gen_random_uuid(), '{"proposal_type":"war_declaration"}'::jsonb, '${day}T13:00:00Z'),
        ('world_pulse_proposal_applied',   gen_random_uuid(), '{"proposal_type":"war_declaration"}'::jsonb, '${day}T13:01:00Z'),
        ('world_pulse_proposal_dismissed', gen_random_uuid(), '{"proposal_type":"war_declaration"}'::jsonb, '${day}T13:02:00Z');
    `);

    const n = (await db.query(`select public.rollup_analytics_v2_daily('${day}'::date) as n`)).rows[0].n;
    expect(Number(n)).toBeGreaterThan(0);

    const q = async (metric, dims) =>
      Number((await db.query(
        `select value from public.analytics_daily_rollups where day = $1 and metric = $2 and dims = $3::jsonb`,
        [day, metric, JSON.stringify(dims)],
      )).rows[0]?.value ?? -1);

    expect(await q('construction_archetype', { archetype: 'martial', tier: 'town' })).toBe(3);
    expect(await q('construction_mode', { is_regeneration: 'true' })).toBe(1);
    expect(await q('construction_mode', { is_regeneration: 'false' })).toBe(2);
    expect(await q('realm_preset_adoption', { preset_id: 'siege' })).toBe(2);
    expect(await q('realm_flag_adoption', { flag: 'seasons' })).toBe(2);   // both advances
    expect(await q('realm_flag_adoption', { flag: 'warLayer' })).toBe(1);  // one advance
    expect(await q('realm_topology', { topology_class: 'hub-and-spoke', settlement_count_band: '5_9' })).toBe(1);
    expect(await q('tuning_mover_adoption', { mover: 'embattlement' })).toBe(2);
    expect(await q('approval_decision', { proposal_type: 'war_declaration', decision: 'applied' })).toBe(2);
    expect(await q('approval_decision', { proposal_type: 'war_declaration', decision: 'dismissed' })).toBe(1);
  });

  it('rollup is idempotent — re-running the same day overwrites, never doubles', async () => {
    const day = '2026-06-02';
    await db.exec(`insert into public.analytics_events (event, actor_id, props, created_at) values
      ('generation_completed', gen_random_uuid(), '{"config_archetype":"pious","tier":"city","is_regeneration":false}'::jsonb, '${day}T10:00:00Z');`);
    await db.query(`select public.rollup_analytics_v2_daily('${day}'::date)`);
    await db.query(`select public.rollup_analytics_v2_daily('${day}'::date)`); // re-run
    const v = Number((await db.query(
      `select value from public.analytics_daily_rollups where day = $1 and metric = 'construction_archetype' and dims = $2::jsonb`,
      [day, JSON.stringify({ archetype: 'pious', tier: 'city' })],
    )).rows[0].value);
    expect(v).toBe(1); // NOT 2 — the on-conflict overwrite held
  });

  it('market reports enforce the plane filter + both k-anonymity floors', async () => {
    // Shrink the floors so the suppress/emit boundary is testable with a few rows —
    // the LOGIC (the HAVING on users AND campaigns) is what's under test.
    await db.exec(`
      create or replace function public.market_k_min_users() returns integer
        language sql immutable set search_path = public, pg_temp as $$ select 5 $$;
      create or replace function public.market_k_min_campaigns() returns integer
        language sql immutable set search_path = public, pg_temp as $$ select 8 $$;
    `);
    const from = '2026-07-01', to = '2026-07-31';
    const seed = async (archetype, users, campaigns, opts = {}) => {
      const optIn = opts.market === false ? 'false' : 'true';
      const corpus = opts.corpus || 'production';
      // `n = max(users, campaigns)` rows; actor cycles over `users`, subject over `campaigns`,
      // so distinct users = min(n,users) and distinct campaigns = min(n,campaigns).
      const n = Math.max(users, campaigns);
      await db.exec(`
        insert into public.analytics_events (event, actor_id, subject_id, props, market_opt_in, corpus, created_at)
        select 'generation_completed',
               ('00000000-0000-4000-8000-' || lpad(((i % ${users}) + 1)::text, 12, '0'))::uuid,
               ('00000000-0000-4000-9000-' || lpad(((i % ${campaigns}) + 1)::text, 12, '0'))::uuid,
               '{"config_archetype":"${archetype}","tier":"town"}'::jsonb,
               ${optIn}, ${corpus === 'null' ? 'null' : `'${corpus}'`},
               '2026-07-10T10:00:00Z'
        from generate_series(0, ${n - 1}) as g(i);
      `);
    };

    // (a) clears BOTH floors (6 users ≥ 5, 10 campaigns ≥ 8) → EMITTED.
    await seed('emitted', 6, 10);
    // (b) enough campaigns but too few users (3 < 5) → suppressed on the USER floor.
    await seed('few_users', 3, 12);
    // (c) enough users but too few campaigns (4 < 8) → suppressed on the CAMPAIGN floor.
    await seed('few_campaigns', 9, 4);
    // (d) clears floors but NOT opted into the market plane → excluded by the filter.
    await seed('not_opted', 6, 10, { market: false });
    // (e) clears floors + opted in, but DOGFOOD corpus → excluded by the filter.
    await seed('dogfood', 6, 10, { corpus: 'dogfood' });

    const rows = (await db.query(
      `select archetype, distinct_users, distinct_campaigns from public.report_market_archetype_popularity($1::date, $2::date)`,
      [from, to],
    )).rows;
    const byArchetype = Object.fromEntries(rows.map(r => [r.archetype, r]));

    expect(Object.keys(byArchetype)).toEqual(['emitted']); // ONLY the cell clearing every gate
    expect(Number(byArchetype.emitted.distinct_users)).toBeGreaterThanOrEqual(5);
    expect(Number(byArchetype.emitted.distinct_campaigns)).toBeGreaterThanOrEqual(8);
    expect(byArchetype.few_users).toBeUndefined();
    expect(byArchetype.few_campaigns).toBeUndefined();
    expect(byArchetype.not_opted).toBeUndefined();
    expect(byArchetype.dogfood).toBeUndefined();
  });

  it('report_market_preset_adoption forms cells once world_pulse_advanced carries subject_id (A3 capture stamp)', async () => {
    // The A2 deferral is closed by A3: world_pulse_advanced now stamps the campaign uuid as
    // subject_id (src/store/campaignAdvanceSession.js), so the preset-adoption report's
    // k=campaigns floor can finally form cells. Floors are already 5 users / 8 campaigns from
    // the previous test (shared db). This proves the "cells populate once stamped" seam on the
    // SQL side; the client half (capture → envelope.subjectId) is pinned in
    // tests/lib/analyticsQueue.test.js.
    const from = '2026-08-01', to = '2026-08-31';
    const seedPulse = async (preset, users, campaigns) => {
      const n = Math.max(users, campaigns);
      await db.exec(`
        insert into public.analytics_events (event, actor_id, subject_id, props, market_opt_in, corpus, created_at)
        select 'world_pulse_advanced',
               ('00000000-0000-4000-8000-' || lpad(((i % ${users}) + 1)::text, 12, '0'))::uuid,
               ('00000000-0000-4000-9000-' || lpad(((i % ${campaigns}) + 1)::text, 12, '0'))::uuid,
               '{"sim_config":{"preset_id":"${preset}"}}'::jsonb,
               true, 'production', '2026-08-10T10:00:00Z'
        from generate_series(0, ${n - 1}) as g(i);
      `);
    };
    await seedPulse('siege', 6, 10);   // clears BOTH floors (6 users ≥ 5, 10 campaigns ≥ 8) → EMITTED
    await seedPulse('bucolic', 9, 4);  // enough users but too few campaigns (4 < 8) → suppressed

    const rows = (await db.query(
      `select preset_id, distinct_users, distinct_campaigns from public.report_market_preset_adoption($1::date, $2::date)`,
      [from, to],
    )).rows;
    const byPreset = Object.fromEntries(rows.map(r => [r.preset_id, r]));
    expect(Object.keys(byPreset)).toEqual(['siege']);            // only the cell clearing the campaign floor
    expect(Number(byPreset.siege.distinct_campaigns)).toBeGreaterThanOrEqual(8);
    expect(byPreset.bucolic).toBeUndefined();                    // suppressed on the campaign floor
  });
});
