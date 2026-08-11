/**
 * ingestCheckRate.pglite.test.js — pins the generic keyed limiter
 * public.ingest_check_rate (migration 036_analytics_core.sql), the fixed-window
 * counter that ingest-events + account-actions already depend on and that the
 * Wave-D rate-limit hardening now ALSO builds on (the _shared/rateLimit.ts
 * checkUserIpRate helper + the create-customer-portal gate + the item-4 bot-wave
 * velocity family all key off this RPC's behavior).
 *
 * It was previously UNPINNED (Wave-D wall census: "REAL BUT UNPINNED"). This runs
 * the REAL PL/pgSQL against pglite (the same way rateLimitConfig / actionVelocity
 * do), so a change to the increment-and-compare logic, the current-window math,
 * or the empty-key coalesce fails loudly.
 *
 * What it pins:
 *   - the (p_max + 1)th call in a window is OVER (returns false); calls up to
 *     p_max are UNDER (true) — the fixed-window boundary;
 *   - distinct keys keep independent buckets (no cross-key leakage — the property
 *     the function-scoped `ccp:`/`ip:`/`u:` prefixes in rateLimit.ts rely on);
 *   - an empty/whitespace key coalesces to a single 'anon' bucket (does not mint
 *     a fresh unlimited bucket per blank key);
 *   - a null/sub-1 p_window_seconds is clamped to the 3600s default.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_036 = resolve(process.cwd(), 'supabase', 'migrations', '036_analytics_core.sql');
const have = existsSync(MIG_036);

/** Extract a single `create or replace function ... $$;` block by name. */
function extractFn(src, name) {
  const m = src.match(
    new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'),
  );
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
const check = async (key, max = 3, windowSeconds = 3600) =>
  (
    await db.query('select public.ingest_check_rate($1, $2, $3) as r', [key, max, windowSeconds])
  ).rows[0].r;

// Vacuity guard (runs unconditionally): if 036 is renamed/removed, `have` goes
// false and the runIf block below would silently pass zero assertions. Fail loud.
it('migration 036 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('ingest_check_rate — fixed-window counter (pglite, 036)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Minimal scaffold: just the bucket table the RPC upserts into.
    await db.exec(`
      create table public.ingest_rate_buckets (
        bucket_key   text not null,
        window_start timestamptz not null,
        count        integer not null default 0,
        primary key (bucket_key, window_start)
      );
    `);
    await db.exec(extractFn(readFileSync(MIG_036, 'utf-8'), 'ingest_check_rate'));
  }, 60000); // DEADLOCK GUARD, not a perf budget — never tune it to a measured
  // boot (see tests/security/pgliteHookTimeoutRatchet.test.js).
  //
  // ⚠ CORRECTED 2026-08-11. This budget previously carried the claim that "in the
  // full suite an earlier pglite test warms it". That is FALSE and it is the kind
  // of false premise that talks the next reader into LOWERING the guard: vitest's
  // forks pool runs each test file in its own isolated process, so no earlier
  // pglite suite can warm anything and this file pays a full cold WASM boot in
  // EVERY run. MEASURED at HEAD ffc85a90, both figures captured by this lane:
  // inside a real full-suite PARALLEL gate run (machine load average peaking near
  // 200, 4.5 GB of swap in use) this hook cost 4484 ms, and it was the SLOWEST of
  // the five pglite suites probed — the opposite of what warming would produce;
  // SERIALIZED (--no-file-parallelism) the whole file, boot included, took 1054 ms.
  // So contention costs this hook roughly 4x, and 4484 ms still sits ~13x inside
  // this guard. The guard is therefore not the constraint on this suite; it exists
  // only to turn a genuine deadlock into a bounded failure instead of a hung
  // worker, which is why it must never be re-derived from either number above.

  beforeEach(async () => {
    await db.exec('truncate public.ingest_rate_buckets;');
  });

  it('admits up to p_max then rejects the (p_max + 1)th call in the window', async () => {
    // p_max = 3: three admits, then over.
    expect(await check('k:a', 3)).toBe(true); // count 1
    expect(await check('k:a', 3)).toBe(true); // count 2
    expect(await check('k:a', 3)).toBe(true); // count 3 (== max, still under-or-equal)
    expect(await check('k:a', 3)).toBe(false); // count 4 > 3 → over
    expect(await check('k:a', 3)).toBe(false); // stays over
  });

  it('keeps distinct keys in independent buckets (no cross-key leakage)', async () => {
    expect(await check('u:alice', 1)).toBe(true); // alice count 1 (<=1)
    expect(await check('u:alice', 1)).toBe(false); // alice count 2 > 1
    // A different key is unaffected by alice's exhausted bucket.
    expect(await check('u:bob', 1)).toBe(true);
    expect(await check('ip:1.2.3.4', 1)).toBe(true);
  });

  it('coalesces an empty / whitespace key into a single "anon" bucket', async () => {
    // Both blank keys land in the SAME 'anon' bucket, so the second is over a
    // max of 1 — they do NOT each mint a fresh unlimited bucket.
    expect(await check('', 1)).toBe(true); // anon count 1
    expect(await check('   ', 1)).toBe(false); // same anon bucket, count 2 > 1
  });

  it('clamps a null or sub-1 window to the 3600s default (still counts)', async () => {
    // A degenerate window must not divide-by-zero or mint per-call buckets; it
    // clamps to 3600 and behaves like a normal window.
    expect(await check('k:w', 1, 0)).toBe(true); // count 1
    expect(await check('k:w', 1, 0)).toBe(false); // count 2 > 1 in the same clamped window
    const r = await db.query('select public.ingest_check_rate($1, $2, $3) as r', ['k:wn', 1, null]);
    expect(r.rows[0].r).toBe(true);
  });
});
