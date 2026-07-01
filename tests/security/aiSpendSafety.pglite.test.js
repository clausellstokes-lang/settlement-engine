/**
 * aiSpendSafety.pglite.test.js — runs the REAL PL/pgSQL safety RPCs from
 * migration 079 against an in-process Postgres (pglite), the same way the
 * credit-ledger suites exercise the real money RPCs.
 *
 * What it proves (the spec's required safety assertions):
 *   - check_ai_spend_cap FAILS CLOSED: once recorded COGS in ai_usage_events
 *     crosses the daily (or monthly) cap, `allowed` flips to false — AND a
 *     SENTINEL case proves it WOULD pass when spend is under the cap (so the
 *     test isn't vacuously always-false).
 *   - consume_ai_generate_rate_limit rejects past the per-user limit and counts
 *     every attempt atomically.
 *
 * The edge function's fail-CLOSED behaviour (block on RPC error / non-true) is
 * asserted by source inspection in tests/edgeFunctions/aiProviderAbstraction
 * .test.js; here we prove the RPC's own contract on real SQL.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_079 = resolve(process.cwd(), 'supabase', 'migrations', '079_ai_spend_safety.sql');
const haveMigration = existsSync(MIG_079);

const UID = '11111111-1111-1111-1111-111111111111';
const UID2 = '22222222-2222-2222-2222-222222222222';

/** Extract a `create or replace function public.<name>` body verbatim. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
const scalar = async (q, params) => (await db.query(q, params)).rows[0];

/** Insert a COGS row with a given cost + timestamp offset (days into the past). */
const recordCost = (usd, daysAgo = 0) =>
  db.query(
    `insert into public.ai_usage_events
       (user_id, feature, provider, model, input_tokens, output_tokens, estimated_cost_usd, ok, created_at)
     values ($1, 'narrative', 'anthropic', 'claude-opus-4-8', 100, 100, $2, true, now() - ($3 || ' days')::interval)`,
    [UID, usd, String(daysAgo)],
  );

const setCap = (daily, monthly, enabled = true) =>
  db.query(
    `update public.system_config set value = $1::jsonb where key = 'ai_spend_cap'`,
    [JSON.stringify({ daily_usd: daily, monthly_usd: monthly, enabled })],
  );

const checkCap = async () => (await scalar('select public.check_ai_spend_cap() as r')).r;
const consumeRl = async (uid, limit) =>
  (await scalar('select public.consume_ai_generate_rate_limit($1, 86400, $2) as r', [uid, limit])).r;

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(haveMigration).toBe(true);
});

describe.runIf(haveMigration)('ai spend safety — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    const src = readFileSync(MIG_079, 'utf-8');
    // Minimal schema mirror: the two tables the RPCs read/write plus system_config.
    await db.exec(`
      create table public.system_config (key text primary key, value jsonb not null);
      create table public.ai_usage_events (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        feature text not null,
        phase text,
        provider text not null,
        model text not null,
        model_preference text,
        input_tokens integer not null default 0,
        output_tokens integer not null default 0,
        tokens_estimated boolean not null default false,
        estimated_cost_usd numeric(12,6) not null default 0,
        ok boolean not null default true,
        fellback boolean not null default false,
        duration_ms integer not null default 0,
        spend_id uuid,
        created_at timestamptz not null default now()
      );
      create table public.ai_generate_rate_limits (
        user_key text not null,
        window_start timestamptz not null,
        count integer not null default 0,
        primary key (user_key, window_start)
      );
      insert into public.system_config (key, value)
        values ('ai_spend_cap', '{"daily_usd": 50, "monthly_usd": 750, "enabled": true}'::jsonb);
    `);
    // Load the real RPC bodies from the migration (no cron / table DDL).
    await db.exec(extractFn(src, 'check_ai_spend_cap'));
    await db.exec(extractFn(src, 'consume_ai_generate_rate_limit'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.ai_usage_events; truncate public.ai_generate_rate_limits;');
    await setCap(50, 750, true);
  });

  describe('check_ai_spend_cap — FAIL CLOSED', () => {
    it('SENTINEL: allows when spend is under the cap (proves not vacuously false)', async () => {
      await recordCost(10); // well under the 50/day cap
      const r = await checkCap();
      expect(r.allowed).toBe(true);
      expect(Number(r.daily_spend)).toBeCloseTo(10, 5);
    });

    it('BLOCKS once daily spend reaches the daily cap', async () => {
      await recordCost(49.99);
      expect((await checkCap()).allowed).toBe(true); // still a hair under
      await recordCost(0.02); // now 50.01 > 50
      const r = await checkCap();
      expect(r.allowed).toBe(false);
      expect(Number(r.daily_spend)).toBeGreaterThan(Number(r.daily_cap));
    });

    it('BLOCKS once MONTHLY spend reaches the monthly cap (even if today is clear)', async () => {
      // Spend that lands earlier this month but not today: daily clear, month over.
      await setCap(50, 100, true);
      await recordCost(60, 5);  // 5 days ago, same month
      await recordCost(50, 6);  // 6 days ago, same month → month total 110 > 100
      const r = await checkCap();
      expect(Number(r.daily_spend)).toBeCloseTo(0, 5); // nothing today
      expect(r.allowed).toBe(false);                   // but month cap blocks
    });

    it('respects the operator kill-switch: enabled:false disables the cap', async () => {
      await recordCost(10_000); // wildly over
      await setCap(50, 750, false);
      expect((await checkCap()).allowed).toBe(true);
    });

    it('falls back to conservative defaults when the config row is missing', async () => {
      await db.exec(`delete from public.system_config where key = 'ai_spend_cap'`);
      await recordCost(60); // over the DEFAULT 50/day
      const r = await checkCap();
      expect(r.allowed).toBe(false); // missing config must NOT mean "no cap"
      expect(Number(r.daily_cap)).toBe(50);
    });
  });

  describe('consume_ai_generate_rate_limit — rejects past the limit', () => {
    it('allows up to the limit then rejects, counting every attempt', async () => {
      const limit = 3;
      expect((await consumeRl(UID, limit)).allowed).toBe(true);  // 1
      expect((await consumeRl(UID, limit)).allowed).toBe(true);  // 2
      const third = await consumeRl(UID, limit);
      expect(third.allowed).toBe(true);                          // 3 == limit
      expect(third.count).toBe(3);
      const fourth = await consumeRl(UID, limit);
      expect(fourth.allowed).toBe(false);                        // 4 > limit
      expect(fourth.count).toBe(4);
    });

    it('isolates counters per user', async () => {
      const limit = 1;
      expect((await consumeRl(UID, limit)).allowed).toBe(true);
      expect((await consumeRl(UID, limit)).allowed).toBe(false); // UID over
      expect((await consumeRl(UID2, limit)).allowed).toBe(true); // UID2 fresh
    });
  });
});
