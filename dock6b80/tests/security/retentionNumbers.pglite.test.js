/**
 * Migration 198 execution contract — the concrete retention numbers (§359.7,
 * chair-signed at ODQ §402 C2).
 *
 * WHAT THIS PINS, and why it has to be executed rather than reviewed. 198 is the
 * first migration in the train whose risk is what it DELETES. Three couplings decide
 * whether the deletions are safe, and each one is invisible in a diff:
 *
 *   1. THE ENABLING ORDER. 038's mv_retention_cohorts recomputes first_seen from RAW
 *      analytics_events at every refresh, so shortening the raw window truncates every
 *      cohort curve at the window and re-mints phantom cohorts for old actors. The
 *      shortened prune is therefore GATED on the durable table being non-empty. A3/A6
 *      prove both halves: the window really does shorten, and the aggregate really
 *      does outlive its source rows.
 *   2. THE RECEIPT. The research plane prunes only what an export receipt covers.
 *      038's export_cursors already IS that receipt — one writer (the analytics-export
 *      edge function), and 037's research views pass the base tables' own id through,
 *      so `id <= last_id` means "exported". A4 is the fail-closed arm (no receipt, no
 *      prune) and A5 the covered arm, including the row the receipt CANNOT cover.
 *   3. THE COHORT DAY AFTER THE PRUNE. The append reads each actor's first-contact day
 *      from 036's link tables, not from raw events, because raw events are exactly
 *      what the 90-day window discards. A1 proves the append is exact and idempotent.
 *
 * SEQUENCING IS DELIBERATE AND LOAD-BEARING. The arms run in file order against one
 * database, because the property under test is a LIFECYCLE: history accumulates, the
 * migration applies, days pass, and only then does a prune run. Every state the later
 * arms depend on is captured in beforeAll (mvRows/backfilledRows) so no assertion
 * reads a value a previous prune could have moved.
 *
 * CANNOT-CATCH, stated: this proves the SQL, not the schedule (039's cron block is
 * environmental in pglite), and not `supabase db push`, which stays the owner's step.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BOOT_TIMEOUT = 180_000;
const MIG_038 = resolve(process.cwd(), 'supabase/migrations/038_analytics_rollups.sql');
const MIG_198 = resolve(process.cwd(), 'supabase/migrations/198_retention_numbers.sql');
const have = existsSync(MIG_038) && existsSync(MIG_198);

/** Actors. A0 is the one whose raw history the 90-day window destroys. */
const A0 = '00000000-0000-4000-8000-000000000000'; // first contact 200d ago
const A1 = '11111111-1111-4111-8111-111111111111'; // first contact 10d ago
const A2 = '22222222-2222-4222-8222-222222222222'; // first contact 8d ago
const A3 = '33333333-3333-4333-8333-333333333333'; // first contact yesterday
const A4 = '44444444-4444-4444-8444-444444444444'; // NO link row — the fail-soft population

let db;
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;
const one = async (sql, params = []) => (await rows(sql, params))[0];
const count = async (table, where = 'true') =>
  Number((await one(`select count(*)::int n from ${table} where ${where}`)).n);

/** The cohort table as a comparable, ordered plain-object list. */
const cohortRows = async () => (await rows(
  `select to_char(cohort_day, 'YYYY-MM-DD') as cohort_day, day_offset, actors::int as actors
     from public.analytics_retention_cohorts order by cohort_day, day_offset`,
));
const mvRowsNow = async () => (await rows(
  `select to_char(cohort_day, 'YYYY-MM-DD') as cohort_day, day_offset, actors::int as actors
     from public.mv_retention_cohorts order by cohort_day, day_offset`,
));

/** The net-current bodies of the two functions 198 makes destructive. Sliced rather
 *  than scanning the whole file ON PURPOSE: 198's header names world_sim_metrics to
 *  RE-AFFIRM its indefinite retention, and a whole-file scan would both false-positive
 *  on that and tempt a future editor to delete the honest sentence instead of the
 *  offending statement. */
function functionBody(source, name) {
  const m = source.match(new RegExp(
    `^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`,
    'im',
  ));
  if (!m) throw new Error(`could not slice public.${name} out of migration 198`);
  return m[0];
}

/** Captured in beforeAll so no later prune can move what A2 compares. */
let mvAtApply;
let backfilledAtApply;

it('migrations 038 and 198 are both present (the suite cannot vacate silently)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('migration 198 — the retention numbers, executed', () => {
  beforeAll(async () => {
    db = new PGlite();

    // ── scaffold: the Supabase roles and the raw tables 038's views read ──────
    await db.exec(`
      do $roles$ begin
        if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
        if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
        if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if;
      end $roles$;
      create schema if not exists research;

      create table public.analytics_events (
        id bigint generated always as identity primary key,
        event text not null default 'homepage_view',
        actor_id uuid,
        created_at timestamptz not null default now()
      );
      create table public.settlement_snapshots (
        id bigint generated always as identity primary key,
        actor_id uuid,
        capture_point text, tier text, population_band text, prosperity text,
        legitimacy numeric, food_resilience numeric,
        condition_archetypes text[] not null default '{}',
        consent_tier text not null default 'research',
        created_at timestamptz not null default now()
      );
      create table public.edit_events (
        id bigint generated always as identity primary key,
        actor_id uuid,
        kind text, target_kind text, reverted boolean not null default false,
        edit_seq integer,
        created_at timestamptz not null default now()
      );
      create table public.ingest_rate_buckets (
        bucket_key text not null, window_start timestamptz not null,
        count integer not null default 0, primary key (bucket_key, window_start)
      );
      -- 036's mapping tables: the cohort-day source 198 reads instead of minting one.
      create table public.analytics_device_links (
        device_key text primary key, actor_id uuid not null,
        created_at timestamptz not null default now()
      );
      create table public.analytics_identity_links (
        user_id uuid primary key, actor_id uuid not null unique,
        created_at timestamptz not null default now()
      );
      -- 196's PII-free-by-schema table: A7's survivor.
      create table public.world_sim_metrics (
        run_id text not null, metric text not null, value numeric not null,
        recorded_at timestamptz not null default now()
      );
      -- 133/134's nightly rollups, stubbed: 198's maintenance function must still
      -- CALL them (dropping a prior job is the failure 134's header warns about),
      -- and this suite is about the retention half, not about what they compute.
      create or replace function public.rollup_analytics_v2_daily() returns void
        language plpgsql as $stub$ begin return; end $stub$;
      create or replace function public.rollup_intent_atlas_daily() returns void
        language plpgsql as $stub$ begin return; end $stub$;
      -- SIMULATE Supabase's default privileges, so 198's revoke has something real to
      -- remove. Without this the grant arm below passes vacuously in a bare Postgres,
      -- which is precisely the hole migration 100 existed to close for 038's views.
      alter default privileges in schema public grant select on tables to anon, authenticated;
    `);

    // ── the real 038: dashboard views, the retention MV, report_retention ─────
    await db.exec(readFileSync(MIG_038, 'utf8'));

    // ── history, as it stands the moment before the migration applies ─────────
    await db.exec(`
      insert into public.analytics_device_links (device_key, actor_id, created_at) values
        ('d-a0', '${A0}', now() - interval '200 days'),
        ('d-a1', '${A1}', now() - interval '10 days'),
        ('d-a2', '${A2}', now() - interval '8 days');
      insert into public.analytics_events (actor_id, created_at) values
        ('${A0}', now() - interval '200 days'),
        ('${A0}', now() - interval '150 days'),
        ('${A1}', now() - interval '10 days'),
        ('${A1}', now() - interval '8 days'),
        ('${A2}', now() - interval '8 days');
      refresh materialized view public.mv_retention_cohorts;
    `);
    mvAtApply = await mvRowsNow();

    // ── THE MIGRATION UNDER TEST ──────────────────────────────────────────────
    await db.exec(readFileSync(MIG_198, 'utf8'));
    backfilledAtApply = await cohortRows();

    // ── days pass: yesterday's activity, and the fixtures the prune arms need ─
    await db.exec(`
      insert into public.analytics_identity_links (user_id, actor_id, created_at)
        values ('${A3}', '${A3}', now() - interval '1 day');
      insert into public.analytics_events (actor_id, created_at) values
        ('${A1}', now() - interval '1 day'),
        ('${A3}', now() - interval '1 day'),
        -- A4 has NO link row: the documented fail-soft population. It must never
        -- reach the cohort table, and it is also the 90-day boundary fixture.
        ('${A4}', now() - interval '89 days'),
        ('${A4}', now() - interval '91 days'),
        ('${A4}', now() - interval '401 days');
      insert into public.ingest_rate_buckets (bucket_key, window_start) values
        ('b-old', now() - interval '3 days'), ('b-new', now() - interval '1 day');
      -- the research plane: ages either side of the 400-day ceiling, both tiers
      insert into public.edit_events (actor_id, kind, edit_seq, created_at) values
        ('${A0}', 'rename-npc', 1, now() - interval '401 days'),
        ('${A0}', 'rename-npc', 2, now() - interval '100 days');
      insert into public.settlement_snapshots (actor_id, capture_point, tier, consent_tier, created_at) values
        ('${A0}', 'saved', 'free', 'research', now() - interval '401 days'),
        ('${A0}', 'saved', 'free', 'research', now() - interval '100 days'),
        ('${A0}', 'saved', 'free', 'product',  now() - interval '401 days');
      insert into public.world_sim_metrics (run_id, metric, value, recorded_at)
        values ('soak-1', 'population', 1200, now() - interval '900 days');
    `);
  }, BOOT_TIMEOUT);

  // ── A2 first: it reads only what beforeAll captured, and it is the proof the
  //    charter makes a precondition of everything below. ─────────────────────
  it('A2 — the backfilled table equals the MV row-for-row (the parity proof)', () => {
    expect(mvAtApply.length).toBeGreaterThan(0); // guard-the-guard: not a vacuous match
    expect(backfilledAtApply).toEqual(mvAtApply);
    // …and it is the RIGHT set: A0's two rows are the ones the 90-day window is
    // about to make underivable, so their presence here is the whole enabling act.
    expect(backfilledAtApply.map((r) => r.day_offset)).toEqual([0, 50, 0, 2, 0]);
    expect(backfilledAtApply.every((r) => r.actors === 1)).toBe(true);
  });

  it('A1 — the append adds exactly yesterday\'s (cohort_day, day_offset) rows, and is idempotent', async () => {
    const before = await cohortRows();
    expect(before).toEqual(backfilledAtApply); // nothing has drifted since apply

    const appended = Number((await one(`select public.append_retention_cohorts((now()::date - 1)) as n`)).n);
    expect(appended).toBe(2);
    const after = await cohortRows();

    // EXACT SET, not a count: A1 returning yesterday means offset 9 on A1's own
    // 10-day-old cohort, and A3 minting a fresh cohort at offset 0. A4 has events
    // yesterday-adjacent but no link row, so it contributes NOTHING — a full-refresh
    // rewrite of this function would pull A4 in from raw and red here.
    const added = after.filter((r) => !before.some(
      (b) => b.cohort_day === r.cohort_day && b.day_offset === r.day_offset,
    ));
    expect(added.map((r) => [r.day_offset, r.actors])).toEqual([[9, 1], [0, 1]]);
    expect(after.length).toBe(before.length + 2);

    // Idempotence: the same day, again, changes nothing at all.
    await db.query(`select public.append_retention_cohorts((now()::date - 1))`);
    expect(await cohortRows()).toEqual(after);

    // And the wiring: the nightly job is what actually calls it in production, and
    // it must still call every job 134 had. Delete yesterday's two rows and let the
    // scheduled entry point put them back.
    await db.exec(`delete from public.analytics_retention_cohorts
                    where day_offset = 9 or cohort_day = (now()::date - 1)`);
    expect((await cohortRows()).length).toBe(before.length);
    await db.query(`select public.analytics_nightly_maintenance()`);
    expect(await cohortRows()).toEqual(after);
  });

  it('A3 — the raw window shortens to 90 days, and 89-day rows survive (both sides)', async () => {
    expect(await count('public.analytics_retention_cohorts')).toBeGreaterThan(0); // the gate is open
    expect(await count('public.analytics_events', `created_at < now() - interval '90 days'`)).toBe(4);

    const deleted = Number((await one(`select public.analytics_monthly_prune() as n`)).n);
    expect(deleted).toBe(4); // A0's two, plus A4's 91-day and 401-day rows

    expect(await count('public.analytics_events', `created_at < now() - interval '90 days'`)).toBe(0);
    expect(await count('public.analytics_events', `actor_id = '${A4}'`)).toBe(1); // the 89-day row
    expect(await count('public.analytics_events', `actor_id = '${A0}'`)).toBe(0);
    // the 2-day bucket rule is unchanged by this migration
    expect(await count('public.ingest_rate_buckets')).toBe(1);
  });

  it('A6 — the cohort rows outlive the raw events they were computed from', async () => {
    // A0's events are gone (A3 above). Its cohort rows must still be there, because
    // that is the entire reason the aggregate was made durable first.
    expect(await count('public.analytics_events', `actor_id = '${A0}'`)).toBe(0);
    const a0 = (await cohortRows()).filter((r) => r.day_offset === 0 || r.day_offset === 50);
    expect(a0.length).toBeGreaterThanOrEqual(2);
    expect(await cohortRows()).toEqual(expect.arrayContaining(backfilledAtApply));
    // report_retention() reads the durable table now, with its return type and its
    // service-role-only grant untouched (a CREATE OR REPLACE, never a drop).
    const reported = await rows(`select * from public.report_retention()`);
    expect(reported.length).toBe((await cohortRows()).length);
  });

  it('A4 — research rows with NO covering export receipt survive the prune (fail closed)', async () => {
    // The prune in A3 ran with export_cursors EMPTY. Nothing in the research plane
    // may have moved, however old the rows are.
    expect(await count('public.export_cursors')).toBe(0);
    expect(await count('public.edit_events')).toBe(2);
    expect(await count('public.settlement_snapshots')).toBe(3);
    expect(await count('public.edit_events', `created_at < now() - interval '400 days'`)).toBe(1);
  });

  it('A5 — a covering receipt prunes >400d research rows and spares the rest', async () => {
    const maxEdit = Number((await one(`select max(id)::int m from public.edit_events`)).m);
    const maxSnap = Number((await one(`select max(id)::int m from public.settlement_snapshots`)).m);
    await db.exec(`
      insert into public.export_cursors (name, last_id) values
        ('research_edits', ${maxEdit}), ('research_snapshots', ${maxSnap});
      -- a row that arrives AFTER the receipt: older than the ceiling, uncovered,
      -- and therefore untouchable. This is the arm a "delete everything old" mutant
      -- cannot pass.
      insert into public.edit_events (actor_id, kind, edit_seq, created_at)
        values ('${A0}', 'rename-npc', 3, now() - interval '402 days');
    `);
    const uncovered = Number((await one(`select max(id)::int m from public.edit_events`)).m);

    await db.query(`select public.analytics_monthly_prune()`);

    // covered AND past the ceiling → gone; covered but inside it → kept
    expect(await count('public.edit_events', `id <= ${maxEdit} and created_at < now() - interval '400 days'`)).toBe(0);
    expect(await count('public.edit_events', `id <= ${maxEdit}`)).toBe(1);
    // uncovered and past the ceiling → KEPT, because the receipt does not reach it
    expect(await count('public.edit_events', `id = ${uncovered}`)).toBe(1);

    expect(await count('public.settlement_snapshots', `consent_tier = 'research' and created_at < now() - interval '400 days'`)).toBe(0);
    expect(await count('public.settlement_snapshots', `consent_tier = 'research'`)).toBe(1);
    // THE SOUNDNESS LIMIT, pinned so it cannot be "tidied" into a fail-open: a
    // product-tier snapshot is structurally absent from research.snapshots, so the
    // receipt never covers it and the prune must leave it alone even at 401 days.
    expect(await count('public.settlement_snapshots', `consent_tier = 'product'`)).toBe(1);
  });

  it('A7 — no prune or maintenance statement names world_sim_metrics, and the rows survive', async () => {
    const src = readFileSync(MIG_198, 'utf8');
    for (const fn of ['analytics_monthly_prune', 'analytics_nightly_maintenance', 'append_retention_cohorts']) {
      const body = functionBody(src, fn);
      expect(body.length).toBeGreaterThan(200); // guard-the-guard: the slice is real
      // anchored: the line above proves the slice is a real, non-trivial function body, so an empty or mis-sliced slice cannot make this negative pass vacuously.
      expect(body).not.toMatch(/world_sim_metrics/i);
    }
    // …and executed, not only scanned: a 900-day-old metric row is still there.
    expect(await count('public.world_sim_metrics')).toBe(1);
  });

  it('A8 — 198 adds no actor-keyed store, so the existing deletion paths stay complete', async () => {
    // The charter's non-goal is that account deletion is NOT rewritten. That is only
    // honest if this migration adds nothing purge_analytics_for_user() (036) would
    // have to learn about. The one table it creates is counts-only — the 196 idiom —
    // so there is no per-actor row in it to delete, and the cohort-day source it
    // reads (036's two link tables) is ALREADY erased by that function.
    const cols = (await rows(
      `select column_name from information_schema.columns
        where table_schema = 'public' and table_name = 'analytics_retention_cohorts'
        order by column_name`,
    )).map((r) => r.column_name);
    expect(cols).toEqual(['actors', 'cohort_day', 'day_offset', 'updated_at']);
    const created = [...readFileSync(MIG_198, 'utf8')
      .matchAll(/^create\s+table\s+(?:if\s+not\s+exists\s+)?public\.([a-z0-9_]+)/gim)]
      .map((m) => m[1]);
    expect(created).toEqual(['analytics_retention_cohorts']);
    // The executed re-run of the existing deletion suites is the other half of A8 and
    // lives outside this file, exactly as the charter requires: those tests are
    // re-run, never rewritten.
  });

  it('the new table keeps the house posture: RLS on, zero policies, API roles revoked', async () => {
    const rls = (await one(
      `select relrowsecurity from pg_class where oid = 'public.analytics_retention_cohorts'::regclass`,
    )).relrowsecurity;
    expect(rls).toBe(true);
    expect(await count('pg_policies', `schemaname = 'public' and tablename = 'analytics_retention_cohorts'`)).toBe(0);
    const apiGrants = (name) => rows(
      `select distinct grantee from information_schema.role_table_grants
        where table_schema = 'public' and table_name = '${name}'
          and grantee in ('anon', 'authenticated', 'PUBLIC') order by grantee`,
    );
    // POSITIVE CONTROL FIRST. An empty grant list means nothing unless a table made
    // the same way in the same schema DOES pick the grant up — otherwise this arm is
    // just measuring that plain Postgres has no Supabase default privileges.
    await db.exec(`create table public.zz_grant_control (id int primary key);`);
    expect((await apiGrants('zz_grant_control')).map((r) => r.grantee)).toEqual(['anon', 'authenticated']);
    expect(await apiGrants('analytics_retention_cohorts')).toEqual([]);
  });
});
