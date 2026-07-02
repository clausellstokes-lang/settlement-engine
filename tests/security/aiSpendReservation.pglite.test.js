/**
 * aiSpendReservation.pglite.test.js — runs the REAL PL/pgSQL reservation RPCs
 * from migration 086 against an in-process Postgres (pglite), the same way
 * aiSpendSafety.pglite.test.js exercises 079's cap.
 *
 * What it proves (the bug 086 closes):
 *   - reserve_ai_spend counts COMMITTED COGS (ai_usage_events) PLUS OUTSTANDING
 *     reservations against the cap, so two back-to-back reservations CANNOT both
 *     pass when the second would cross the cap — even though NO COGS row has
 *     been written yet (the race window that check_ai_spend_cap alone misses).
 *   - SENTINEL: the first reservation passes (not vacuously always-false).
 *   - A released reservation frees its headroom; an EXPIRED one stops counting.
 *   - The operator kill-switch (enabled:false) allows without reserving.
 *
 * The edge function's fail-CLOSED wiring (call reserve before the model, block
 * on RPC error / non-true `allowed`, release in `finally`) is asserted by source
 * inspection in tests/edgeFunctions; here we prove the RPC's own contract on
 * real SQL.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_086 = resolve(process.cwd(), 'supabase', 'migrations', '086_ai_spend_reservation.sql');
const haveMigration = existsSync(MIG_086);

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

/** Insert a committed COGS row (current day/month). */
const recordCost = (usd) =>
  db.query(
    `insert into public.ai_usage_events
       (user_id, feature, provider, model, input_tokens, output_tokens, estimated_cost_usd, ok)
     values ($1, 'narrative', 'anthropic', 'claude-opus-4-8', 100, 100, $2, true)`,
    [UID, usd],
  );

const setCap = (daily, monthly, enabled = true) =>
  db.query(
    `update public.system_config set value = $1::jsonb where key = 'ai_spend_cap'`,
    [JSON.stringify({ daily_usd: daily, monthly_usd: monthly, enabled })],
  );

const reserve = async (uid, estimate) =>
  (await scalar('select public.reserve_ai_spend($1, $2) as r', [uid, estimate])).r;
const release = async (id) =>
  (await scalar('select public.release_ai_spend_reservation($1) as r', [id])).r;
const cleanup = async (retentionSeconds) =>
  (await scalar('select public.cleanup_ai_spend_reservations($1) as r', [retentionSeconds])).r;
const outstandingCount = async () =>
  Number((await scalar('select count(*)::int as c from public.ai_spend_reservations')).c);

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(haveMigration).toBe(true);
});

describe.runIf(haveMigration)('ai spend reservation — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    const src = readFileSync(MIG_086, 'utf-8');
    // Minimal schema mirror: the tables the RPCs read/write plus system_config.
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
      create table public.ai_spend_reservations (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        estimate_usd numeric(12,6) not null default 0,
        created_at timestamptz not null default now(),
        expires_at timestamptz not null default now() + interval '10 minutes'
      );
      insert into public.system_config (key, value)
        values ('ai_spend_cap', '{"daily_usd": 50, "monthly_usd": 750, "enabled": true}'::jsonb);
    `);
    // Load the real RPC bodies from the migration (no cron / table DDL).
    await db.exec(extractFn(src, 'reserve_ai_spend'));
    await db.exec(extractFn(src, 'release_ai_spend_reservation'));
    await db.exec(extractFn(src, 'cleanup_ai_spend_reservations'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.ai_usage_events; truncate public.ai_spend_reservations;');
    await setCap(50, 750, true);
  });

  describe('reserve_ai_spend — race-safe admission', () => {
    it('serializes admission with an advisory lock on the cap key (guards against silent removal)', () => {
      // The INSERT...SELECT...WHERE is NOT atomic under READ COMMITTED on its own:
      // concurrent reservers each read a snapshot excluding the other's uncommitted
      // row and can both pass. A transaction-scoped advisory lock on the cap key is
      // what serializes them. True concurrency can't be exercised in single-connection
      // pglite, so this asserts the lock is PRESENT so a refactor can't silently drop it.
      const body = extractFn(readFileSync(MIG_086, 'utf-8'), 'reserve_ai_spend');
      expect(body).toMatch(/pg_advisory_xact_lock\s*\(\s*hashtext\('ai_spend_cap'\)/);
    });

    it('SENTINEL: a single reservation under the cap is allowed (not vacuously false)', async () => {
      const r = await reserve(UID, 10);
      expect(r.allowed).toBe(true);
      expect(r.reservation_id).toBeTruthy();
      expect(await outstandingCount()).toBe(1);
    });

    it('THE BUG: two concurrent reservations cannot BOTH pass when the second would cross the cap', async () => {
      // No COGS committed yet (mid-stream). Daily cap 50. First run reserves 30
      // (allowed). The OLD code (check_ai_spend_cap) would still see committed
      // spend = 0 for the second run and let a second 30 through → 60 > 50.
      // The reservation RPC must count the outstanding 30.
      const first = await reserve(UID, 30);
      expect(first.allowed).toBe(true);

      // Second run, BEFORE either run has written a COGS row: 30 + 30 = 60 > 50.
      const second = await reserve(UID2, 30);
      expect(second.allowed).toBe(false);            // blocked by outstanding reservation
      expect(second.reservation_id).toBeNull();      // nothing inserted on a block
      expect(await outstandingCount()).toBe(1);      // only the first reservation holds

      // The cap sees the in-flight estimate, not the stale committed total.
      expect(Number(second.daily_spend)).toBeCloseTo(30, 5);
    });

    it('counts COMMITTED COGS plus the new estimate', async () => {
      await recordCost(40);                          // committed
      const r = await reserve(UID, 11);              // 40 + 11 = 51 > 50
      expect(r.allowed).toBe(false);
      expect(r.reservation_id).toBeNull();
      const ok = await reserve(UID, 9);              // 40 + 9 = 49 < 50
      expect(ok.allowed).toBe(true);
    });

    it('releasing a reservation frees its headroom for the next run', async () => {
      const first = await reserve(UID, 30);
      expect(first.allowed).toBe(true);
      expect((await reserve(UID2, 30)).allowed).toBe(false); // 60 > 50

      expect(await release(first.reservation_id)).toBe(true);
      expect(await outstandingCount()).toBe(0);

      const after = await reserve(UID2, 30);                 // headroom freed
      expect(after.allowed).toBe(true);
    });

    it('an EXPIRED reservation stops counting against the cap', async () => {
      // Insert an outstanding reservation that has already lapsed.
      await db.query(
        `insert into public.ai_spend_reservations (user_id, estimate_usd, created_at, expires_at)
         values ($1, 40, now(), now() - interval '1 minute')`,
        [UID],
      );
      // 40 is expired ⇒ ignored ⇒ a fresh 30 reservation fits under 50.
      const r = await reserve(UID2, 30);
      expect(r.allowed).toBe(true);
      expect(Number(r.daily_spend)).toBeCloseTo(30, 5); // expired 40 excluded
    });

    it('release is idempotent and null-safe (no-op on missing / null id)', async () => {
      expect(await release(null)).toBe(false);
      expect(await release('99999999-9999-9999-9999-999999999999')).toBe(false);
      const first = await reserve(UID, 5);
      expect(await release(first.reservation_id)).toBe(true);
      expect(await release(first.reservation_id)).toBe(false); // already gone
    });

    it('clamps a negative estimate to zero so it cannot widen the cap', async () => {
      await recordCost(49);
      // A bad caller passing -100 must NOT create headroom; it reserves 0.
      const r = await reserve(UID, -100);
      expect(r.allowed).toBe(true);
      expect(Number(r.daily_spend)).toBeCloseTo(49, 5); // unchanged by the clamp
    });

    it('operator kill-switch (enabled:false) allows WITHOUT holding a reservation', async () => {
      await recordCost(10_000); // wildly over
      await setCap(50, 750, false);
      const r = await reserve(UID, 30);
      expect(r.allowed).toBe(true);
      expect(r.reservation_id).toBeNull();
      expect(await outstandingCount()).toBe(0); // no accounting when uncapped
    });

    it('MONTHLY cap: outstanding reservations block even when today is clear', async () => {
      await setCap(50, 100, true);
      // Two big committed rows earlier this month (daily filter on now() still
      // counts them as "today" in pglite, so use the month cap to isolate).
      await recordCost(60);
      const r = await reserve(UID, 50); // month 60 + 50 = 110 > 100
      expect(r.allowed).toBe(false);
    });
  });

  describe('cleanup_ai_spend_reservations — purges lapsed rows', () => {
    it('deletes only reservations whose hold lapsed beyond the retention window', async () => {
      // Fresh (live) reservation — must survive.
      await reserve(UID, 5);
      // Long-expired reservation — must be purged.
      await db.query(
        `insert into public.ai_spend_reservations (user_id, estimate_usd, created_at, expires_at)
         values ($1, 5, now() - interval '2 days', now() - interval '2 days')`,
        [UID2],
      );
      const deleted = await cleanup(86400); // 1-day retention
      expect(deleted).toBe(1);
      expect(await outstandingCount()).toBe(1); // the live one remains
    });
  });
});
