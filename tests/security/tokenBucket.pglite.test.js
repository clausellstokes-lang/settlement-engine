/**
 * tokenBucket.pglite.test.js — pins the cross-instance smooth-refill token bucket
 * public.consume_token_bucket (migration 156_ai_ip_token_bucket.sql), the substrate
 * for the Wave-D per-IP AI burst gate (_shared/rateLimit.ts → checkAiIpRate).
 *
 * Runs the REAL PL/pgSQL against pglite (same harness as ingestCheckRate /
 * rateLimitConfig), so a change to the refill math, the capacity cap, the atomic
 * refill-then-consume, or the blank-key coalesce fails loudly.
 *
 * What it pins:
 *   - a fresh key starts FULL: the first `capacity` requests are allowed, the next
 *     is denied (the burst ceiling);
 *   - denial does NOT go negative and stays denied while empty;
 *   - REFILL: after advancing the bucket's updated_at into the past, elapsed *
 *     refill_per_sec tokens become available again (capped at capacity);
 *   - distinct keys keep independent buckets (no cross-key leakage — the property
 *     the `aiip:<ip>` keys rely on);
 *   - a blank/whitespace key coalesces to a single shared 'anon' bucket;
 *   - `allowed` is returned as a real boolean and tokens never exceed capacity.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_156 = resolve(process.cwd(), 'supabase', 'migrations', '156_ai_ip_token_bucket.sql');
const have = existsSync(MIG_156);

/** Extract a single `create or replace function ... $$;` block by name. */
function extractFn(src, name) {
  const m = src.match(
    new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'),
  );
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
/** Consume one token; returns the RPC's jsonb verdict object. */
const consume = async (key, capacity = 3, refillPerSec = 0, cost = 1) =>
  (
    await db.query('select public.consume_token_bucket($1, $2, $3, $4) as r', [key, capacity, refillPerSec, cost])
  ).rows[0].r;

// Vacuity guard: if 156 is renamed/removed, `have` goes false and the runIf block
// would silently pass zero assertions. Fail loud.
it('migration 156 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('consume_token_bucket — smooth-refill token bucket (pglite, 156)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Minimal scaffold: just the bucket table the RPC upserts into.
    await db.exec(`
      create table public.token_buckets (
        bucket_key text not null primary key,
        tokens     double precision not null,
        updated_at timestamptz not null default now()
      );
    `);
    await db.exec(extractFn(readFileSync(MIG_156, 'utf-8'), 'consume_token_bucket'));
  }, 60000); // PGlite WASM cold-start can exceed the 10s default when this file runs alone.

  beforeEach(async () => {
    await db.exec('truncate public.token_buckets;');
  });

  it('a fresh key starts FULL: admits `capacity` requests, then denies (no refill)', async () => {
    // capacity 3, refill 0 → a pure burst bucket.
    expect((await consume('aiip:1.1.1.1', 3, 0)).allowed).toBe(true);  // 3 → 2
    expect((await consume('aiip:1.1.1.1', 3, 0)).allowed).toBe(true);  // 2 → 1
    expect((await consume('aiip:1.1.1.1', 3, 0)).allowed).toBe(true);  // 1 → 0
    const over = await consume('aiip:1.1.1.1', 3, 0);
    expect(over.allowed).toBe(false);                                   // 0 → denied
    expect(over.tokens).toBeGreaterThanOrEqual(0);                      // never goes negative
    expect((await consume('aiip:1.1.1.1', 3, 0)).allowed).toBe(false);  // stays denied
  });

  it('never exceeds capacity and returns a real boolean allowed', async () => {
    const r = await consume('aiip:cap', 5, 0);
    expect(typeof r.allowed).toBe('boolean');
    expect(Number(r.tokens)).toBeLessThanOrEqual(5);
    expect(Number(r.capacity)).toBe(5);
  });

  it('REFILLS over elapsed time (capped at capacity)', async () => {
    // Drain a capacity-2 bucket, then rewind updated_at 100s into the past with a
    // 1 token/sec refill → the bucket refills to the cap and admits again.
    await consume('aiip:refill', 2, 1); // 2 → 1
    await consume('aiip:refill', 2, 1); // 1 → 0
    expect((await consume('aiip:refill', 2, 1)).allowed).toBe(false); // empty
    // Simulate 100 seconds passing since the last touch.
    await db.query(`update public.token_buckets set updated_at = now() - interval '100 seconds' where bucket_key = 'aiip:refill'`);
    const refilled = await consume('aiip:refill', 2, 1); // refill min(2, 0 + 100*1) = 2, consume 1
    expect(refilled.allowed).toBe(true);
    expect(Number(refilled.tokens)).toBeLessThanOrEqual(2); // capped, not 100
  });

  it('keeps distinct keys in independent buckets (no cross-key leakage)', async () => {
    expect((await consume('aiip:a', 1, 0)).allowed).toBe(true);  // a: 1 → 0
    expect((await consume('aiip:a', 1, 0)).allowed).toBe(false); // a empty
    // A different IP's bucket is unaffected.
    expect((await consume('aiip:b', 1, 0)).allowed).toBe(true);
  });

  it('coalesces a blank / whitespace key into a single shared "anon" bucket', async () => {
    expect((await consume('', 1, 0)).allowed).toBe(true);      // anon: 1 → 0
    expect((await consume('   ', 1, 0)).allowed).toBe(false);  // same anon bucket, empty
  });
});
