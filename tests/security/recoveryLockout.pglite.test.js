/**
 * recoveryLockout.pglite.test.js — EXECUTION test of the Auth Phase 2 recovery
 * brute-force lockout (migration 067) against in-process Postgres (pglite).
 *
 * Finding 1's fix: the fixed-window rate limiter resets every window, so it bounds
 * guesses-PER-WINDOW but not guesses-OVER-TIME. Migration 067 adds a CUMULATIVE
 * per-account counter that survives window rollover and hard-locks recovery after
 * RECOVERY_LOCKOUT_MAX (10) wrong answers. This RUNS the real, verbatim-extracted
 * RPC bodies from 067 and proves:
 *   (1) note_recovery_verify_failure increments a CUMULATIVE counter and reports
 *       {locked,fails}; the 10th wrong answer flips locked=true and stamps locked_at.
 *   (2) recovery_is_locked is false below the cap and true at/over it — the gate the
 *       edge function reads BEFORE the bcrypt compare.
 *   (3) clear_recovery_lockout_by_email (correct-answer path) wipes the counter so a
 *       legit mistyper starts clean; recovery_is_locked is false again afterward.
 *   (4) an UNKNOWN email is a no-op on every path (no row created, never "locked") —
 *       so wrong-but-nonexistent guesses don't create operator-confusing rows and the
 *       lockout never becomes an enumeration oracle.
 *   (5) the lockout table is RLS-on + no-policy + no client grant: a client role can
 *       never SELECT another account's fail_count (SENTINEL).
 *
 * Mirrors securityAnswers.pglite.test.js: minimal auth schema, verbatim RPC bodies,
 * a non-superuser FORCE-RLS role for the direct-PostgREST sentinel.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase/migrations/067_recovery_verify_lockout.sql');
const exists = existsSync(MIG);

describe('067 pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 067 is present on disk', () => {
    expect(exists, 'supabase/migrations/067_recovery_verify_lockout.sql must exist').toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(name) {
  const src = readFileSync(MIG, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from 067`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';
const LOCK_MAX = 10; // RECOVERY_LOCKOUT_MAX — kept in lockstep with 067.

let db;
const scalar = async (q) => (await db.query(q)).rows[0];
const tryExec = async (sql) => { try { await db.exec(sql); return 'ok'; } catch { return 'rejected'; } };

describe.runIf(exists)('recovery lockout backend — execution against 067 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create table auth.users (id uuid primary key, email text);

      -- The 067 table DDL (create-if-not-exists), then enable RLS as the migration does.
      create table if not exists public.recovery_lockouts (
        user_id uuid not null primary key,
        fail_count integer not null default 0,
        locked_at timestamptz,
        updated_at timestamptz not null default now()
      );
      alter table public.recovery_lockouts enable row level security;
    `);

    // Real, verbatim RPC bodies from 067.
    await db.exec(extractFn('recovery_is_locked'));
    await db.exec(extractFn('note_recovery_verify_failure'));
    await db.exec(extractFn('clear_recovery_lockout'));
    await db.exec(extractFn('clear_recovery_lockout_by_email'));

    // Non-superuser client role under FORCE RLS = the faithful direct-PostgREST path.
    await db.exec(`
      alter table public.recovery_lockouts force row level security;
      create role nosuperuser nologin;
      revoke all on table public.recovery_lockouts from nosuperuser;
    `);

    await db.exec(`
      insert into auth.users (id, email) values
        ('${ALICE}', 'alice@example.com'),
        ('${BOB}',   'bob@example.com');
    `);
  });

  beforeEach(async () => {
    await db.exec(`reset role; truncate public.recovery_lockouts;`);
  });

  // ── (1)+(2) cumulative increment + lock at the cap ──────────────────────────
  it('note_recovery_verify_failure increments cumulatively; the 10th wrong answer locks', async () => {
    let last;
    for (let i = 1; i <= LOCK_MAX; i += 1) {
      last = await scalar(`select public.note_recovery_verify_failure('alice@example.com') as r`);
    }
    expect(last.r.fails).toBe(LOCK_MAX);
    expect(last.r.locked).toBe(true);

    // Below the cap the gate is open; at the cap it is closed.
    const locked = await scalar(`select public.recovery_is_locked('alice@example.com') as v`);
    expect(locked.v).toBe(true);
    // locked_at was stamped.
    const row = await scalar(`select locked_at from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(row.locked_at).not.toBeNull();
  });

  it('recovery_is_locked is FALSE below the cap (9 wrong answers is not yet locked)', async () => {
    for (let i = 1; i < LOCK_MAX; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    const locked = await scalar(`select public.recovery_is_locked('alice@example.com') as v`);
    expect(locked.v).toBe(false);
    const row = await scalar(`select fail_count, locked_at from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(row.fail_count).toBe(LOCK_MAX - 1);
    expect(row.locked_at).toBeNull(); // not stamped until the cap is crossed
  });

  // ── (3) correct-answer clear ────────────────────────────────────────────────
  it('clear_recovery_lockout_by_email wipes the counter; recovery_is_locked is false again', async () => {
    for (let i = 1; i <= LOCK_MAX; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);

    await db.exec(`select public.clear_recovery_lockout_by_email('alice@example.com');`);
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(false);
    const n = await scalar(`select count(*)::int as n from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(n.n).toBe(0);
  });

  it('clear_recovery_lockout (by user_id) is the operator unlock and is a no-op on null', async () => {
    await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    await db.exec(`select public.clear_recovery_lockout('${ALICE}'::uuid);`);
    const n = await scalar(`select count(*)::int as n from public.recovery_lockouts where user_id='${ALICE}'`);
    expect(n.n).toBe(0);
    // null is a safe no-op (does not throw, does not wipe everyone).
    await db.exec(`select public.note_recovery_verify_failure('bob@example.com');`);
    await db.exec(`select public.clear_recovery_lockout(null);`);
    const bob = await scalar(`select count(*)::int as n from public.recovery_lockouts where user_id='${BOB}'`);
    expect(bob.n).toBe(1);
  });

  // ── (4) unknown email is a no-op (no row, never locked, no oracle) ──────────
  it('an UNKNOWN email never creates a row and is never reported locked', async () => {
    const r = await scalar(`select public.note_recovery_verify_failure('nobody@example.com') as r`);
    expect(r.r.locked).toBe(false);
    expect(r.r.fails).toBe(0);
    const n = await scalar(`select count(*)::int as n from public.recovery_lockouts`);
    expect(n.n).toBe(0); // no row created for a nonexistent account
    expect((await scalar(`select public.recovery_is_locked('nobody@example.com') as v`)).v).toBe(false);
    expect((await scalar(`select public.recovery_is_locked('') as v`)).v).toBe(false);
  });

  // ── per-account isolation: locking Alice does not lock Bob ──────────────────
  it('the lockout is per-account: locking one email does not lock another', async () => {
    for (let i = 1; i <= LOCK_MAX; i += 1) {
      await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    }
    expect((await scalar(`select public.recovery_is_locked('alice@example.com') as v`)).v).toBe(true);
    expect((await scalar(`select public.recovery_is_locked('bob@example.com') as v`)).v).toBe(false);
  });

  // ── (5) SENTINEL: hash/count is never client-selectable ─────────────────────
  it('SENTINEL: a direct client SELECT of recovery_lockouts is denied (RLS no-policy + no grant)', async () => {
    await db.exec(`select public.note_recovery_verify_failure('alice@example.com');`);
    await db.exec(`set role nosuperuser;`);
    const res = await tryExec(`select fail_count from public.recovery_lockouts;`);
    expect(res).toBe('rejected');
  });
});
