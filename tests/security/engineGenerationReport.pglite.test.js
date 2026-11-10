/**
 * engineGenerationReport.pglite.test.js — migration 204's report, executed (ENGINE-5 unit 4).
 *
 * `report_engine_generations()` reads the engine service's cost log (the `engine_generate`
 * rows engine-generate writes to public.analytics_events) and answers today's and this month's
 * counts by op and outcome. Run here on PGlite over the real migration file, against the
 * columns of 036's analytics_events it reads: it counts only `engine_generate` rows, splits
 * them by props.op / props.outcome, keeps today inside this month, leaves last month out, and
 * is executable by service_role only.
 *
 * The privilege pin models a hosted Supabase project's DEFAULT PRIVILEGES (new functions in
 * `public` granted EXECUTE to anon and authenticated BY NAME): `revoke … from public` alone
 * leaves those grants standing (the pre-deploy review of 2026-11-10, finding 8), so 204 names
 * the two roles as migration 113 does.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_204 = resolve(process.cwd(), 'supabase/migrations/204_engine_generation_report.sql');

let db;
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role service_role;
    create role anon;
    create role authenticated;
    -- The hosted project's default privileges, modelled (finding 8 of the 2026-11-10 review).
    alter default privileges in schema public grant execute on functions to anon, authenticated;
    create table public.analytics_events (
      id bigint generated always as identity primary key,
      event text not null,
      props jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
  `);
  await db.exec(readFileSync(MIG_204, 'utf8'));
  const insert = (event, props, at) => db.query(
    'insert into public.analytics_events (event, props, created_at) values ($1, $2::jsonb, ' + at + ')',
    [event, JSON.stringify(props)],
  );
  // Today: two generate ok, one derive ok, one generate rate_limited.
  await insert('engine_generate', { op: 'generate', outcome: 'ok' }, 'now()');
  await insert('engine_generate', { op: 'generate', outcome: 'ok' }, 'now()');
  await insert('engine_generate', { op: 'derive', outcome: 'ok' }, 'now()');
  await insert('engine_generate', { op: 'generate', outcome: 'rate_limited' }, 'now()');
  // Yesterday (this month unless today is the 1st), and last month (never counted).
  await insert('engine_generate', { op: 'regenSection', outcome: 'failed' }, "date_trunc('day', now()) - interval '1 minute'");
  await insert('engine_generate', { op: 'generate', outcome: 'ok' }, "date_trunc('month', now()) - interval '1 minute'");
  // Another event today (never counted).
  await insert('generation_completed', { op: 'generate', outcome: 'ok' }, 'now()');
}, 120_000);

describe('report_engine_generations (migration 204)', () => {
  it('counts engine_generate rows today and this month by op and outcome', async () => {
    const [{ first }] = await rows("select date_trunc('day', now()) = date_trunc('month', now()) as first");
    const got = (await rows('select * from public.report_engine_generations()'))
      .map((r) => [r.op, r.outcome, Number(r.generations_today), Number(r.generations_month)]);
    const expected = [
      ['derive', 'ok', 1, 1],
      ['generate', 'ok', 2, 2],
      ['generate', 'rate_limited', 1, 1],
      ...(first ? [] : [['regenSection', 'failed', 0, 1]]),
    ].sort((a, b) => `${a[0]}|${a[1]}`.localeCompare(`${b[0]}|${b[1]}`));
    expect(got).toEqual(expected);
  });

  it('is executable by service_role and not by anon or authenticated, even under the hosted default privileges (the 199 posture; 113 idiom)', async () => {
    const [{ svc, anon, authd }] = await rows(`
      select has_function_privilege('service_role', 'public.report_engine_generations()', 'execute') as svc,
             has_function_privilege('anon', 'public.report_engine_generations()', 'execute') as anon,
             has_function_privilege('authenticated', 'public.report_engine_generations()', 'execute') as authd`);
    expect(svc).toBe(true);
    expect(anon).toBe(false);
    expect(authd).toBe(false);
  });
});
