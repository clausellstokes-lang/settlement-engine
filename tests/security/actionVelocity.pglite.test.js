/**
 * actionVelocity.pglite.test.js — EXECUTION-level tests for the per-user
 * velocity guards (migration 125, the Wave-1 rebuild of our former 052).
 *
 * The Phase-3 re-grade held SECURITY at A- on exactly this gap: toggle_gallery_
 * vote / add_gallery_comment were economically- or auth-gated only, with no
 * independent RATE ceiling — an authenticated account could flood comments /
 * toggle-vote at wire speed.
 *
 * WAVE-1 RECONCILIATION (fusion spec C) pinned here:
 *   • The velocity guards are folded into THEIR 059 bodies, so the RPCs now carry
 *     the account_is_active() banned-account gate AHEAD of the velocity guard. The
 *     audit flagged that a verbatim-052 port would silently DELETE that gate; this
 *     file pins that BOTH the account gate AND the velocity ceiling are live.
 *   • consume_narrate_rate_limit was DROPPED (their consume_ai_generate_rate_limit
 *     is the narrate limiter). Its tests are removed and a pin asserts it no longer
 *     exists anywhere in the chain.
 *
 * These pins load the ACTUAL, NET-CURRENT function bodies from migration 125 into
 * in-process Postgres (pglite) and drive them until the ceiling bites, so a
 * regression in the guard (a later migration dropping it, an off-by-one in the
 * limit) can't ship green. auth.uid() + account_is_active() are settable-GUC
 * stubs; the gallery / counter tables are minimal mirrors (no auth.users FK).
 * Everything else is the real PL/pgSQL, including the atomic upsert counter.
 *
 * LIMITATION: pglite is single-connection, so TRUE concurrent races can't be
 * exercised; the atomic guard is verified by its logical effect (the Nth call
 * over the limit raises). Genuine race testing still needs `supabase test db`.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_125 = resolve(dir, '125_action_velocity_guards.sql');
const allExist = existsSync(MIG_125);

/** Extract a function definition verbatim: from `create or replace function
 *  public.<name>` to the first `$$;`. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration 125`);
  return m[0];
}

/** The net-current definition of a public function across ALL migrations in file
 *  order (the LAST create-or-replace wins) — used for the drift pins below. */
function netCurrentFn(name) {
  const files = readdirSync(dir).filter(f => /^\d.*\.sql$/.test(f)).sort();
  let last = null;
  for (const f of files) {
    const src = readFileSync(resolve(dir, f), 'utf-8');
    const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
    let m;
    while ((m = re.exec(src)) !== null) last = m[0];
  }
  return last;
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const SETTLEMENT = '33333333-3333-3333-3333-333333333333';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const setActive = (v) => db.exec(`set test.active = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];

// Anti-vacuity ([tests-3]/[test-quality-2]): if migration 125 is renamed/renumbered
// (the master-merge reconciliation risk), both describe.runIf blocks below would
// silently skip and vitest would stay green. This UNCONDITIONAL assert fails loudly.
describe('action-velocity migration fixture exists (guards against silent vacuous skip)', () => {
  it('125_action_velocity_guards.sql is present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_125), `migration 125 missing: ${MIG_125}`).toBe(true);
    expect(allExist).toBe(true);
  });
});

describe.runIf(allExist)('action velocity guards — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    const src = readFileSync(MIG_125, 'utf-8');
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- account_is_active (057) stub — the 059 bodies fused into 125 gate on it.
      -- Settable GUC (default true) so a test can exercise the banned-account gate.
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.active', true), '')::boolean, true)
      $fn$;

      -- Minimal mirrors of the tables the gallery RPCs touch (no auth.users FK).
      create table public.settlements (
        id uuid primary key,
        is_public boolean not null default false,
        user_id uuid
      );
      create table public.gallery_votes (
        settlement_id uuid not null,
        user_id uuid not null,
        created_at timestamptz not null default now(),
        primary key (settlement_id, user_id)
      );
      create table public.gallery_comments (
        id uuid primary key default gen_random_uuid(),
        settlement_id uuid not null,
        user_id uuid not null,
        body text not null,
        created_at timestamptz not null default now(),
        deleted_at timestamptz
      );
    `);
    // The counter table + the real function bodies from migration 125.
    await db.exec(`
      create table public.user_action_rate_limits (
        user_key     uuid        not null,
        action       text        not null,
        window_start timestamptz not null,
        count        integer     not null default 0,
        primary key (user_key, action, window_start)
      );
    `);
    await db.exec(extractFn(src, '_consume_action_rate_limit'));
    await db.exec(extractFn(src, 'toggle_gallery_vote'));
    await db.exec(extractFn(src, 'add_gallery_comment'));
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load — beyond the 10s default.

  beforeEach(async () => {
    await db.exec('truncate public.settlements, public.gallery_votes, public.gallery_comments, public.user_action_rate_limits cascade;');
    await db.exec(`insert into public.settlements (id, is_public, user_id) values ('${SETTLEMENT}', true, '${OTHER}');`);
    await asUser(UID);
    await setActive('true');
  });

  // ── toggle_gallery_vote — 60/hour ────────────────────────────────────────────
  it('allows 60 vote-toggles then throttles the 61st', async () => {
    for (let i = 0; i < 60; i++) {
      await db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`); // toggles on/off, always succeeds
    }
    await expect(db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`))
      .rejects.toThrow(/voting too quickly/i);
    // The counter rests at the ceiling: the over-limit call raises, which rolls
    // back its own increment (the whole function transaction), so the persisted
    // count reflects ACCEPTED actions and every further call re-trips + rolls back.
    const row = await scalar(`select count from public.user_action_rate_limits where user_key='${UID}' and action='gallery_vote'`);
    expect(row.count).toBe(60);
    // Still blocked on the next attempt (the ceiling holds for the window).
    await expect(db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`))
      .rejects.toThrow(/voting too quickly/i);
  });

  // ── add_gallery_comment — 20/hour ────────────────────────────────────────────
  it('allows 20 comments then throttles the 21st', async () => {
    for (let i = 0; i < 20; i++) {
      await db.query(`select public.add_gallery_comment('${SETTLEMENT}', 'comment ${i}')`);
    }
    expect((await scalar(`select count(*)::int n from public.gallery_comments`)).n).toBe(20);
    await expect(db.query(`select public.add_gallery_comment('${SETTLEMENT}', 'one too many')`))
      .rejects.toThrow(/commenting too quickly/i);
    // The throttled attempt inserted no row.
    expect((await scalar(`select count(*)::int n from public.gallery_comments`)).n).toBe(20);
  });

  // ── Per-(user, action) isolation ─────────────────────────────────────────────
  it('votes and comments draw from separate counters, and each user is independent', async () => {
    // Exhaust UID's vote budget…
    for (let i = 0; i < 60; i++) await db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`);
    await expect(db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`)).rejects.toThrow(/voting too quickly/i);
    // …UID can still comment (separate action counter)…
    await expect(db.query(`select public.add_gallery_comment('${SETTLEMENT}', 'still fine')`)).resolves.toBeTruthy();
    // …and OTHER's vote budget is untouched.
    await asUser(OTHER);
    await expect(db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`)).resolves.toBeTruthy();
  });

  // ── 059 account-status gate SURVIVES the velocity fusion (audit surprise #3) ──
  // A verbatim-052 port would have dropped this gate. Both gallery RPCs must still
  // reject a banned/disabled/soft-deleted account BEFORE any velocity accounting.
  it('rejects a non-active (banned) account on BOTH gallery RPCs, ahead of the counter', async () => {
    await setActive('false');
    await expect(db.query(`select public.toggle_gallery_vote('${SETTLEMENT}')`))
      .rejects.toThrow(/account is not active/i);
    await expect(db.query(`select public.add_gallery_comment('${SETTLEMENT}', 'nope')`))
      .rejects.toThrow(/account is not active/i);
    // The banned attempts never touched the velocity counter.
    expect((await scalar(`select count(*)::int n from public.user_action_rate_limits`)).n).toBe(0);
  });
});

// ── Drift pins: the guards cannot silently disappear, and the narrate limiter
// is gone for good (fusion C decision). ──────────────────────────────────────
describe.runIf(allExist)('velocity-guard drift pin', () => {
  it('the net-current gallery RPCs still call the velocity counter', () => {
    expect(netCurrentFn('toggle_gallery_vote')).toMatch(/_consume_action_rate_limit\(\s*auth\.uid\(\)\s*,\s*'gallery_vote'/);
    expect(netCurrentFn('add_gallery_comment')).toMatch(/_consume_action_rate_limit\(\s*auth\.uid\(\)\s*,\s*'gallery_comment'/);
  });

  it('the net-current gallery RPCs still carry the 059 account_is_active gate', () => {
    expect(netCurrentFn('toggle_gallery_vote')).toMatch(/account_is_active\(\s*auth\.uid\(\)\s*\)/);
    expect(netCurrentFn('add_gallery_comment')).toMatch(/account_is_active\(\s*auth\.uid\(\)\s*\)/);
  });

  it('consume_narrate_rate_limit was dropped — no definition anywhere in the chain', () => {
    // Fusion C retired the parallel hourly narrate ceiling in favour of
    // consume_ai_generate_rate_limit (079/087). It must not reappear.
    expect(netCurrentFn('consume_narrate_rate_limit')).toBeNull();
  });
});
