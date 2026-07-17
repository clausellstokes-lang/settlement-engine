/**
 * surveyorUsageGovernors.pglite.test.js — runs the REAL PL/pgSQL from migration 145
 * (BYOK MANAGEMENT SURFACE usage governors) against in-process Postgres (pglite).
 *
 * What it proves:
 *   - surveyor_settings_get returns sane defaults with no row (uncapped, warn 80, unpaused).
 *   - surveyor_settings_set clamps: non-positive caps ⇒ null (uncapped), warn_pct ⇒ 1..100,
 *     patch-merges (untouched keys survive), and pause is a plain boolean.
 *   - surveyor_usage_precheck is the enforcement door: token caps, est-$ caps (via the
 *     price table), the per-task cap, the PAUSE hard-stop, and the warn threshold — all
 *     computed from ai_usage_events windows. No settings row ⇒ allowed (fail-open).
 *   - SENTINELS so a cap test can't pass vacuously (an under-cap call is allowed).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_145 = resolve(process.cwd(), 'supabase', 'migrations', '145_surveyor_usage_governors.sql');
const haveMigration = existsSync(MIG_145);

const UID = '11111111-1111-1111-1111-111111111111';

function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
const scalar = async (q, params) => (await db.query(q, params)).rows[0];
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const getSettings = async () => (await scalar('select * from public.surveyor_settings_get()')).surveyor_settings_get ?? (await db.query('select * from public.surveyor_settings_get()')).rows[0];
const setSettings = async (patch) => (await db.query('select * from public.surveyor_settings_set($1::jsonb)', [JSON.stringify(patch)])).rows[0];
const precheck = async (feature = 'analysis') => (await scalar('select public.surveyor_usage_precheck($1,$2,$3) as r', [UID, 'anthropic', feature])).r;
const recordUsage = (feature, model, inTok, outTok) =>
  db.query(
    `insert into public.ai_usage_events (user_id, feature, provider, model, input_tokens, output_tokens, estimated_cost_usd, ok)
     values ($1, $2, 'anthropic', $3, $4, $5, 0, true)`,
    [UID, feature, model, inTok, outTok],
  );

it('targeted migration present (suite not vacuous)', () => {
  expect(haveMigration).toBe(true);
});

describe.runIf(haveMigration)('surveyor usage governors — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    const src = readFileSync(MIG_145, 'utf-8');
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.account_is_active(p_uid uuid) returns boolean language sql stable as $fn$
        select true
      $fn$;
      create table public.system_config (key text primary key, value jsonb not null);
      create table public.ai_usage_events (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, feature text not null, phase text,
        provider text not null, model text not null, model_preference text,
        input_tokens integer not null default 0, output_tokens integer not null default 0,
        tokens_estimated boolean not null default false,
        estimated_cost_usd numeric(12,6) not null default 0,
        ok boolean not null default true, fellback boolean not null default false,
        duration_ms integer not null default 0, spend_id uuid,
        created_at timestamptz not null default now()
      );
      create table public.surveyor_user_settings (
        user_id uuid primary key, provider text not null default 'anthropic',
        model_prefs jsonb not null default '{}'::jsonb,
        daily_token_cap bigint, weekly_token_cap bigint,
        daily_usd_cap numeric(12,4), weekly_usd_cap numeric(12,4),
        per_task_caps jsonb not null default '{}'::jsonb,
        warn_pct integer not null default 80 check (warn_pct between 1 and 100),
        paused boolean not null default false, updated_at timestamptz not null default now()
      );
      insert into public.system_config (key, value) values ('surveyor_price_estimates',
        '{"anthropic":{"default":{"in":5,"out":25},"claude-opus-4-8":{"in":5,"out":25}}}'::jsonb);
    `);
    await db.exec(extractFn(src, 'surveyor_price_estimates'));
    await db.exec(extractFn(src, 'surveyor_settings_get'));
    await db.exec(extractFn(src, 'surveyor_settings_set'));
    await db.exec(extractFn(src, 'surveyor_usage_precheck'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.ai_usage_events; truncate public.surveyor_user_settings;');
    await asUser(UID);
  });

  describe('surveyor_settings_get / set', () => {
    it('defaults with no row: uncapped, unpaused, warn 80', async () => {
      const s = (await db.query('select * from public.surveyor_settings_get()')).rows[0];
      expect(s.daily_token_cap).toBeNull();
      expect(s.paused).toBe(false);
      expect(s.warn_pct).toBe(80);
    });

    it('clamps non-positive caps to null and warn_pct into 1..100; patch-merges', async () => {
      await setSettings({ daily_token_cap: 1000, warn_pct: 250 });
      let s = (await db.query('select * from public.surveyor_user_settings where user_id = $1', [UID])).rows[0];
      expect(Number(s.daily_token_cap)).toBe(1000);
      expect(s.warn_pct).toBe(100);                       // clamped
      // a second patch touching only paused must NOT wipe the cap (patch-merge)
      await setSettings({ paused: true, daily_token_cap: 0 });
      s = (await db.query('select * from public.surveyor_user_settings where user_id = $1', [UID])).rows[0];
      expect(s.paused).toBe(true);
      expect(s.daily_token_cap).toBeNull();               // 0 ⇒ uncapped
      expect(s.warn_pct).toBe(100);                       // untouched key survives
    });
  });

  describe('surveyor_usage_precheck', () => {
    it('no settings row ⇒ allowed (fail-open; the global cap still applies)', async () => {
      const r = await precheck();
      expect(r.allowed).toBe(true);
      expect(r.paused).toBe(false);
    });

    it('SENTINEL: under a token cap is allowed; at/above it is refused with reason cap', async () => {
      await setSettings({ daily_token_cap: 1000 });
      await recordUsage('analysis', 'claude-opus-4-8', 300, 300); // 600 < 1000
      const under = await precheck();
      expect(under.allowed).toBe(true);
      expect(Number(under.daily_tokens)).toBe(600);

      await recordUsage('analysis', 'claude-opus-4-8', 300, 200); // +500 ⇒ 1100 ≥ 1000
      const over = await precheck();
      expect(over.allowed).toBe(false);
      expect(over.reason_class).toBe('cap');
      expect(over.breached).toBe('daily_tokens');
    });

    it('enforces an est-$ cap via the price table', async () => {
      // opus: $5/Mtok in, $25/Mtok out. 200k in + 40k out = $1.0 + $1.0 = $2.00.
      await setSettings({ daily_usd_cap: 2 });
      await recordUsage('analysis', 'claude-opus-4-8', 200000, 40000);
      const r = await precheck();
      expect(Number(r.daily_usd)).toBeCloseTo(2, 4);
      expect(r.allowed).toBe(false);              // 2.0 ≥ 2 cap
      expect(r.breached).toBe('daily_usd');
    });

    it('PAUSE is the hard stop (allowed=false, reason paused) regardless of usage', async () => {
      await setSettings({ paused: true });
      const r = await precheck();
      expect(r.allowed).toBe(false);
      expect(r.paused).toBe(true);
      expect(r.reason_class).toBe('paused');
    });

    it('warns at/above warn_pct% of a cap while still allowed', async () => {
      await setSettings({ daily_token_cap: 1000, warn_pct: 80 });
      await recordUsage('analysis', 'claude-opus-4-8', 500, 300); // 800 = 80%
      const r = await precheck();
      expect(r.allowed).toBe(true);
      expect(r.warn).toBe(true);
    });

    it('enforces a per-task-class cap independent of the global cap', async () => {
      await setSettings({ per_task_caps: { analysis: { daily_tokens: 500 } } });
      await recordUsage('analysis', 'claude-opus-4-8', 300, 300); // 600 ≥ 500 for analysis
      await recordUsage('brief', 'claude-opus-4-8', 100, 100);    // other task, irrelevant
      const r = await precheck('analysis');
      expect(r.allowed).toBe(false);
      expect(r.breached).toBe('task_daily_tokens');
      // a different task class is unaffected
      const rb = await precheck('brief');
      expect(rb.allowed).toBe(true);
    });
  });

  describe('surveyor_price_estimates', () => {
    it('returns the maintained estimate table', async () => {
      const r = (await scalar('select public.surveyor_price_estimates() as r')).r;
      expect(r.anthropic['claude-opus-4-8'].in).toBe(5);
    });
  });
});
