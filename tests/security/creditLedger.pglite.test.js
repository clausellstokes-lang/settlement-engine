/**
 * creditLedger.pglite.test.js — EXECUTION-level tests for the credit RPCs.
 *
 * The audit's #1 finding: the spend/refund/grant money math was only ever
 * asserted statically (regex over the migration SQL), never RUN — so a balance,
 * expiry, or refund-correlation regression could ship green on a real revenue
 * path. The project's intended exec path is `supabase test db` + Docker, which
 * isn't available in this dev env.
 *
 * This closes that gap WITHOUT Docker: it loads the ACTUAL, NET-CURRENT function
 * bodies — spend_credits from migration 024 (the ledger-allocation rewrite, NOT
 * the superseded 009 counter version), get_credit_balance + credit_spend_
 * allocations from 018, refund_credits + admin_grant_credits from 009 — into an
 * in-process Postgres (pglite) and exercises them. auth.uid() /
 * current_user_is_privileged are settable GUC stubs; _audit_action is a no-op;
 * the credit tables are minimal mirrors (no auth.users FK). Everything else is
 * the real PL/pgSQL, including FIFO grant allocation and expiry filtering.
 *
 * LIMITATION: pglite is single-connection, so TRUE concurrent transactions
 * can't be exercised here. The atomic balance guard is verified by its logical
 * effect (sequential spends stop exactly at the floor); genuine race testing
 * still needs `supabase test db`.
 *
 * GRANTS: the EXECUTE-grant hardening (migration 033 makes refund_credits
 * service_role-only — the audit's #1 CRITICAL: any authenticated user could
 * refund) is DDL, not executable behavior, and single-connection pglite does
 * not enforce role grants. So it is asserted SEPARATELY below by scanning every
 * migration for the NET-CURRENT grant state of refund_credits — which catches a
 * later migration silently re-granting it to `authenticated`.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/** Compute the NET-CURRENT set of roles holding EXECUTE on a public function,
 *  by replaying every migration's grant/revoke in file order. Implicit PUBLIC
 *  default-grants aren't tracked (Supabase revokes function EXECUTE from PUBLIC
 *  at the platform level); this pins the EXPLICIT grants the migrations manage. */
function netExecuteGrants(fnName) {
  const files = readdirSync(dir).filter(f => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`(grant|revoke)\\s+execute\\s+on\\s+function\\s+public\\.${fnName}\\b[\\s\\S]*?\\b(?:to|from)\\s+(\\w+)`, 'i');
  const roles = new Set();
  for (const f of files) {
    for (const stmt of readFileSync(resolve(dir, f), 'utf-8').split(';')) {
      const m = stmt.match(re);
      if (!m) continue;
      if (/grant/i.test(m[1])) roles.add(m[2].toLowerCase());
      else roles.delete(m[2].toLowerCase());
    }
  }
  return roles;
}

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '009': resolve(dir, '009_profile_security.sql'),
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '024': resolve(dir, '024_billing_retention_and_atomic_mutations.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

/** Extract a function definition verbatim from a migration file: from
 *  `create or replace function public.<name>` to the first `$$;`. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration ${migKey}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const setPrivileged = (v) => db.exec(`set test.privileged = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = async (uid) => (await scalar(`select public.get_credit_balance('${uid}') as b`)).b;
/** Seed a grant ledger row (the spendable unit in the ledger model). */
const grant = (uid, amount, { source = 'purchase', expiresAt = null } = {}) =>
  db.query(
    `insert into public.credit_ledger (user_id, kind, amount, source, expires_at) values ($1,'grant',$2,$3,$4)`,
    [uid, amount, source, expiresAt],
  );

describe.runIf(allExist)('credit RPCs — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
      $fn$;
      create or replace function public._audit_action(
        p_actor_id uuid, p_target_id uuid, p_action text, p_before jsonb, p_after jsonb, p_reason text
      ) returns void language plpgsql as $fn$ begin return; end $fn$;

      create table public.profiles (
        id uuid primary key, role text, tier text,
        credits integer not null default 0, is_founder boolean not null default false,
        display_name text, updated_at timestamptz default now()
      );
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null check (kind in ('grant','spend')),
        amount integer not null check (amount > 0), source text not null,
        metadata jsonb not null default '{}'::jsonb,
        expires_at timestamptz, reversed_by uuid, created_at timestamptz not null default now()
      );
      create table public.credit_transactions (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        amount integer not null, reason text not null, created_at timestamptz not null default now()
      );
      create table public.credit_spend_allocations (
        spend_id uuid not null references public.credit_ledger(id) on delete cascade,
        grant_id uuid not null references public.credit_ledger(id) on delete cascade,
        amount integer not null check (amount > 0),
        created_at timestamptz not null default now(),
        primary key (spend_id, grant_id)
      );
    `);
    // Load the REAL, net-current function bodies.
    await db.exec(extractFn('018', 'get_credit_balance'));
    await db.exec(extractFn('024', 'spend_credits'));
    await db.exec(extractFn('009', 'refund_credits'));
    await db.exec(extractFn('009', 'admin_grant_credits'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0), ('${OTHER}', 'user', 0);`);
    await setPrivileged(false);
    await asUser(UID);
  });

  // ── get_credit_balance / expiry ──────────────────────────────────────────────
  it('balance sums only non-expired grants (post-expiry balance is correct)', async () => {
    await grant(UID, 5, { source: 'promo', expiresAt: '2000-01-01T00:00:00Z' }); // long expired
    await grant(UID, 5, { source: 'purchase' });                                 // active, never expires
    expect(await balanceOf(UID)).toBe(5); // the expired 5 is NOT counted
  });

  // ── spend_credits (024 ledger-allocation version) ────────────────────────────
  it('debits the feature cost from active grants and records an allocation', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // cost 3
    expect(r.ok).toBe(true);
    expect(r.balance).toBe(7);
    expect(await balanceOf(UID)).toBe(7);
    expect((await scalar(`select count(*)::int n from public.credit_spend_allocations`)).n).toBe(1);
  });

  it('rejects an overspend and writes no spend row', async () => {
    await grant(UID, 2);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // cost 3 > 2
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('insufficient_funds');
    expect(await balanceOf(UID)).toBe(2);
    expect((await scalar(`select count(*)::int n from public.credit_ledger where kind='spend'`)).n).toBe(0);
  });

  it('cannot spend expired credits', async () => {
    await grant(UID, 5, { source: 'promo', expiresAt: '2000-01-01T00:00:00Z' }); // expired
    await grant(UID, 5, { source: 'purchase' });                                 // active
    expect((await scalar("select public.spend_credits('narrative') as r")).r.ok).toBe(true);  // 5 -> 2 from active
    expect((await scalar("select public.spend_credits('narrative') as r")).r.ok).toBe(false); // only 2 active left < 3
    expect(await balanceOf(UID)).toBe(2);
  });

  it('sequential spends stop exactly at the balance floor (atomic guard)', async () => {
    await grant(UID, 7);
    expect((await scalar("select public.spend_credits('narrative') as r")).r.ok).toBe(true);  // 7 -> 4
    expect((await scalar("select public.spend_credits('narrative') as r")).r.ok).toBe(true);  // 4 -> 1
    expect((await scalar("select public.spend_credits('narrative') as r")).r.ok).toBe(false); // 1 < 3
    expect(await balanceOf(UID)).toBe(1);
  });

  it('rejects an unknown feature', async () => {
    await grant(UID, 10);
    await expect(db.query("select public.spend_credits('not_a_feature')")).rejects.toThrow(/unknown feature/i);
  });

  // ── refund_credits ───────────────────────────────────────────────────────────
  it('restores the balance and writes a grant correlated to the spend', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await db.query(`select public.refund_credits('${r.spend_id}', 'oops')`);
    expect(await balanceOf(UID)).toBe(10);
    const g = await scalar(`select * from public.credit_ledger where source='refund'`);
    expect(g.metadata.refund_of).toBe(r.spend_id);
    expect(g.amount).toBe(3);
  });

  it('is idempotent — a second refund of the same spend is rejected and does not double-credit', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);
    await expect(db.query(`select public.refund_credits('${r.spend_id}', null)`)).rejects.toThrow(/already refunded/i);
    expect(await balanceOf(UID)).toBe(10);
  });

  it('refuses to refund a non-spend ledger row', async () => {
    const gid = (await scalar(`insert into public.credit_ledger (user_id, kind, amount, source) values ('${UID}','grant',5,'promo') returning id`)).id;
    await expect(db.query(`select public.refund_credits('${gid}', null)`)).rejects.toThrow(/spend row not found/i);
  });

  it('rejects a refund from a non-owner who is not privileged', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // spent by UID
    await asUser(OTHER);
    await expect(db.query(`select public.refund_credits('${r.spend_id}', null)`)).rejects.toThrow(/not authorized/i);
  });

  it('allows a privileged caller to refund another user\'s spend', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await asUser(OTHER);
    await setPrivileged(true);
    await db.query(`select public.refund_credits('${r.spend_id}', 'support')`);
    expect(await balanceOf(UID)).toBe(10);
  });

  // ── admin_grant_credits ──────────────────────────────────────────────────────
  it('requires privilege, enforces the cap and positivity, and credits the target', async () => {
    await expect(db.query(`select public.admin_grant_credits('${OTHER}', 100, 'x')`)).rejects.toThrow(/not authorized/i);
    await setPrivileged(true);
    await expect(db.query(`select public.admin_grant_credits('${OTHER}', 20000, 'x')`)).rejects.toThrow(/per-call limit/i);
    await expect(db.query(`select public.admin_grant_credits('${OTHER}', 0, 'x')`)).rejects.toThrow(/must be positive/i);
    await db.query(`select public.admin_grant_credits('${OTHER}', 50, 'support')`);
    expect(await balanceOf(OTHER)).toBe(50);
  });

  // ── full round-trip ──────────────────────────────────────────────────────────
  it('spend then refund returns the account to its exact starting balance', async () => {
    await grant(UID, 12);
    const { r } = await scalar("select public.spend_credits('progression') as r"); // cost 5
    expect(await balanceOf(UID)).toBe(7);
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);
    expect(await balanceOf(UID)).toBe(12);
  });

  // ── net-current EXECUTE grants (the audit's #1 CRITICAL) ──────────────────────
  it('refund_credits is service_role-only across all migrations (033 hardening not reverted)', () => {
    const roles = netExecuteGrants('refund_credits');
    // 009 granted it to `authenticated` (the bug); 033 revoked authenticated+anon
    // and granted service_role. The net of every migration must be service-role-only.
    expect(roles.has('service_role')).toBe(true);
    expect(roles.has('authenticated')).toBe(false);
    expect(roles.has('anon')).toBe(false);
  });
});
