/**
 * recoveryLockoutSelfheal.pglite.test.js — EXECUTION test of the SELF-HEALING
 * recovery lockout (migration 068) against in-process Postgres (pglite).
 *
 * Finding #2's fix: 067 made the lockout cumulative and NON-EXPIRING
 * (recovery_is_locked = fail_count >= 10), so a paced attacker who knows only an
 * email could permanently DoS an account's only self-service recovery — the edge
 * function gates on recovery_is_locked() BEFORE it ever runs verify/clear, so the
 * correct answer could never reach the clear path.
 *
 * 068 replaces the lock predicate with a TIME-BOUNDED, exponentially backed-off
 * window (recovery_is_locked = now() < locked_until). This RUNS the real,
 * verbatim-extracted RPC bodies from 068 and proves the two invariants:
 *   (1) crossing the per-cycle threshold OPENS a lock (brute-force stays bounded);
 *   (2) once locked_until passes the lock AUTO-EXPIRES (no permanent DoS) — the
 *       correct answer becomes reachable again;
 *   (3) a correct answer (clear_recovery_lockout_by_email) wipes the row;
 *   (4) the lock is NOT permanent: even after many cycles it always expires.
 *
 * The time-expiry cases are exercised WITHOUT sleeping by backdating locked_until
 * directly (the same row the RPC sets), which is the exact condition now() < until
 * evaluates against.
 *
 * Mirrors recoveryLockout.pglite.test.js: minimal auth schema, verbatim RPC bodies.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase/migrations/068_recovery_lockout_selfheal.sql');
const exists = existsSync(MIG);

describe('068 pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 068 is present on disk', () => {
    expect(exists, 'supabase/migrations/068_recovery_lockout_selfheal.sql must exist').toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(name) {
  const src = readFileSync(MIG, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from 068`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';
const CYCLE_THRESHOLD = 5; // RECOVERY_CYCLE_THRESHOLD — kept in lockstep with 068.

let db;
const scalar = async (q) => (await db.query(q)).rows[0];

describe.runIf(exists)('recovery lockout self-heal — execution against 068 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create table auth.users (id uuid primary key, email text);

      -- Table as it stands AFTER 067, then the 068 additive columns, so the test
      -- faithfully exercises the "alter table add column if not exists" upgrade.
      create table if not exists public.recovery_lockouts (
        user_id uuid not null primary key,
        fail_count integer not null default 0,
        locked_at timestamptz,
        updated_at timestamptz not null default now()
      );
      alter table public.recovery_lockouts enable row level security;
      alter table public.recovery_lockouts add column if not exists cycle        integer     not null default 0;
      alter table public.recovery_lockouts add column if not exists cycle_fails  integer     not null default 0;
      alter table public.recovery_lockouts add column if not exists locked_until timestamptz;
    `);

    // Real, verbatim RPC bodies from 068.
    await db.exec(extractFn('recovery_is_locked'));
    await db.exec(extractFn('note_recovery_verify_failure'));
    await db.exec(extractFn('clear_recovery_lockout'));
    await db.exec(extractFn('clear_recovery_lockout_by_email'));

    await db.exec(`
      insert into auth.users (id, email) values
        ('${ALICE}', 'alice@example.com'),
        ('${BOB}',   'bob@example.com');
    `);
  });

  beforeEach(async () => {
    await db.exec(`truncate public.recovery_lockouts;`);
  });

  // ── (1) crossing the per-cycle threshold opens a lock ───────────────────────
  it('crossing the per-cycle threshold LOCKS and stamps locked_until in the future', async () => {
    let last;
    for (let i = 1; i <= CYCLE_THRESHOLD; i += 1) {
      last = await scalar(`select public.note_recovery_verify_failure('alice@example.com') as r`);
    }
    expect(last.r.locked).toBe(true);
    expect(last.r.fails).toBe(CYCLE_THRESHOLD);

    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);

    const row = await scalar(
      `select cycle, cycle_fails, locked_until, locked_at from public.recovery_lockouts where user_id='${ALICE}'`,
    );
    expect(row.cycle).toBe(1);          // first window opened
    expect(row.cycle_fails).toBe(0);    // per-cycle counter reset for the next window
    expect(row.locked_until).not.toBeNull();
    expect(row.locked_at).not.toBeNull();
    // locked_until is in the future (the ~15m window for cycle 1).
    const fut = await scalar(`select locked_until > now() as v from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(fut.v).toBe(true);
  });

  it('below the per-cycle threshold the gate stays OPEN', async () => {
    for (let i = 1; i < CYCLE_THRESHOLD; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(false);
    const row = await scalar(`select cycle, locked_until from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(row.cycle).toBe(0);
    expect(row.locked_until).toBeNull();
  });

  // ── (2)+(4) THE FIX: the lock AUTO-EXPIRES — it is NOT permanent ─────────────
  it('after locked_until passes the lock AUTO-UNLOCKS (no permanent DoS)', async () => {
    for (let i = 1; i <= CYCLE_THRESHOLD; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);

    // Simulate the window elapsing by backdating locked_until into the past — the
    // exact condition now() < locked_until evaluates against. (This is what real
    // wall-clock time would do after the 15m window.)
    await db.exec(
      `update public.recovery_lockouts set locked_until = now() - interval '1 second' where user_id='${ALICE}';`,
    );
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(false);
  });

  it('the lock is NEVER permanent: even after the deepest (24h) backoff cycle it still expires', async () => {
    // Drive enough wrong answers to reach the capped 24h window (cycle 4+).
    for (let i = 0; i < CYCLE_THRESHOLD * 4; i += 1) {
      // After each lock opens, expire it so the next batch keeps accumulating.
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
      await db.exec(
        `update public.recovery_lockouts set locked_until = locked_until - interval '48 hours'
           where user_id='${ALICE}' and locked_until is not null;`,
      );
    }
    const row = await scalar(`select cycle from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(row.cycle).toBeGreaterThanOrEqual(4); // reached the capped backoff tier
    // With the windows expired, the account is reachable again — not permanently dead.
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(false);
  });

  // ── (3) a correct answer clears the whole row (legit mistyper starts clean) ──
  it('a correct answer (clear_recovery_lockout_by_email) wipes the lock entirely', async () => {
    for (let i = 1; i <= CYCLE_THRESHOLD; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);

    await db.exec(`select public.clear_recovery_lockout_by_email('alice@example.com');`);
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(false);
    const n = await scalar(`select count(*)::int as n from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(n.n).toBe(0); // cycles + counters reset to zero
  });

  // ── unknown email is still a no-op (no row, never locked, no oracle) ─────────
  it('an UNKNOWN email never creates a row and is never reported locked', async () => {
    const r = await scalar(`select public.note_recovery_verify_failure('nobody@example.com') as r`);
    expect(r.r.locked).toBe(false);
    expect(r.r.fails).toBe(0);
    expect((await scalar(`select count(*)::int as n from public.recovery_lockouts`)).n).toBe(0);
    expect((await scalar(`select public.recovery_is_locked('nobody@example.com') as v`)).v).toBe(false);
    expect((await scalar(`select public.recovery_is_locked('') as v`)).v).toBe(false);
  });

  // ── per-account isolation: locking Alice does not lock Bob ──────────────────
  it('the lockout is per-account: locking one email does not lock another', async () => {
    for (let i = 1; i <= CYCLE_THRESHOLD; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);
    expect((await scalar(`select public.recovery_is_locked('bob@example.com') as v`)).v).toBe(false);
  });
});
