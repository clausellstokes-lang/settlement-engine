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
 * the superseded 009 counter version), get_credit_balance from 110 (the IDOR-
 * guarded net-current reader), refund_credits from the Wave-1 fused 123 (FOR
 * UPDATE + elevated-skip from 087 + no-op idempotency + ledger-recompute counter),
 * admin_grant_credits from 009 — into an in-process Postgres (pglite) and
 * exercises them. auth.uid() /
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
  '110': resolve(dir, '110_restrict_get_credit_balance_to_owner.sql'),
  '123': resolve(dir, '123_money_and_public_projection_hardening.sql'),
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
/** Drive the caller role the refund_credits service-role branch reads via
 *  `coalesce(current_setting('request.jwt.claim.role', true), auth.role())`.
 *  request.jwt.claim.role is a Supabase-set 3-dot GUC that pglite can't set,
 *  so the auth.role() fallback (stubbed off `test.role`) is the driveable seam. */
const asRole = (role) => db.exec(`set test.role = '${role}';`);
const asService = async () => { await asRole('service_role'); await db.exec(`set test.uid = '';`); };
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
      create or replace function auth.role() returns text language sql stable as $fn$
        select nullif(current_setting('test.role', true), '')
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
    // Structural refund idempotency — the APPLIED backstop index (087, re-asserted
    // by the fused 123): at most one refund grant per spend row, keyed on the
    // refund_of correlation field, predicate source='refund'. The 123 refund body's
    // unique_violation catch fires on THIS index, so the scaffold mirrors it exactly.
    await db.exec(`
      create unique index if not exists ux_credit_ledger_one_refund_per_spend
        on public.credit_ledger ((metadata->>'refund_of'))
        where source = 'refund';
    `);
    // Load the REAL, net-current function bodies. refund_credits comes from the
    // Wave-1 fused 123 (FOR UPDATE + elevated-skip from 087 + recompute-from-ledger
    // counter + idempotent no-op on the ux_ index), NOT the superseded 085/087 body
    // (incremental `credits + amount` drift + raise-on-duplicate) or 009 (F1 raise).
    // get_credit_balance is the net-current 110 (IDOR-guarded).
    await db.exec(extractFn('110', 'get_credit_balance'));
    await db.exec(extractFn('024', 'spend_credits'));
    await db.exec(extractFn('123', 'refund_credits'));
    await db.exec(extractFn('009', 'admin_grant_credits'));
  }, 30000); // PGlite WASM cold-start is ~8s in CI/dev — beyond the 10s hook default.

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0), ('${OTHER}', 'user', 0);`);
    await setPrivileged(false);
    await asRole('authenticated');
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

  it('is idempotent — a second refund of the same spend is a NO-OP (one ledger row, no double-credit)', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);
    // 123: a duplicate refund no longer RAISES — it returns the current balance.
    const second = await scalar(`select public.refund_credits('${r.spend_id}', null) as b`);
    expect(second.b).toBe(10);
    expect(await balanceOf(UID)).toBe(10);
    // Exactly ONE refund grant + ONE legacy mirror row survived the no-op path.
    expect((await scalar(`select count(*)::int n from public.credit_ledger where source='refund'`)).n).toBe(1);
    expect((await scalar(`select count(*)::int n from public.credit_transactions where reason='refund'`)).n).toBe(1);
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

  // ── F1 REGRESSION GUARD: the edge functions call refund_credits via the
  //    service-role client, where auth.uid() is NULL. The superseded 009 body
  //    raised 'not authenticated' on that path, so EVERY automatic refund of a
  //    failed paid generation failed in production. This is the test the prior
  //    suite lacked (it only ever refunded as the authenticated owner).
  it('refunds under the service-role client even though auth.uid() is null (F1)', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // spent by UID, cost 3
    expect(await balanceOf(UID)).toBe(7);
    await asService(); // auth.uid() null, role service_role — exactly the edge-fn context
    await db.query(`select public.refund_credits('${r.spend_id}', 'generation failed mid-stream')`);
    expect(await balanceOf(UID)).toBe(10);
    const g = await scalar(`select * from public.credit_ledger where source='refund'`);
    expect(g.metadata.refund_of).toBe(r.spend_id);
    expect(g.user_id).toBe(UID); // credited the SPEND owner, not the (null) caller
  });

  it('still rejects an unauthenticated NON-service caller (auth.uid() null, no service role)', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await asUser('');       // auth.uid() null
    await asRole('anon');   // not service_role
    await expect(db.query(`select public.refund_credits('${r.spend_id}', null)`)).rejects.toThrow(/not authenticated/i);
    expect(await balanceOf(UID)).toBe(7); // untouched
  });

  it('structural idempotency: the unique index is the real guarantee behind the no-op', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r");
    await asService();
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);
    // Second refund catches the unique_violation internally and returns balance.
    const second = await scalar(`select public.refund_credits('${r.spend_id}', null) as b`);
    expect(second.b).toBe(10);
    // Prove the index itself would reject a direct duplicate insert too — the
    // structural guarantee the function's exception handler relies on.
    await expect(db.query(
      `insert into public.credit_ledger (user_id, kind, amount, source, metadata)
       values ('${UID}','grant',3,'refund', jsonb_build_object('refund_of','${r.spend_id}'))`,
    )).rejects.toThrow(/duplicate key|unique/i);
    expect(await balanceOf(UID)).toBe(10);
  });

  // ── COUNTER RECOMPUTE (F1 residue): profiles.credits must track the ledger.
  //    085/087 bumped it with incremental `credits + amount`; 123 recomputes from
  //    get_credit_balance() like spend/grant. Pin that the counter equals the
  //    ledger sum after spend → refund → refund (the duplicate is a no-op).
  it('recomputes profiles.credits from the ledger after spend then refund (no drift)', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // cost 3 → counter 7
    expect((await scalar(`select credits from public.profiles where id='${UID}'`)).credits).toBe(7);
    await asService();
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);        // → counter 10
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);        // no-op, still 10
    const counter = (await scalar(`select credits from public.profiles where id='${UID}'`)).credits;
    expect(counter).toBe(10);
    expect(counter).toBe(await balanceOf(UID)); // counter == ledger truth
  });

  // Even if the stored counter has DRIFTED (a torn legacy write), a refund
  // reconciles it to the ledger rather than carrying the drift forward.
  it('a refund heals a pre-drifted profiles.credits counter (recompute, not increment)', async () => {
    await grant(UID, 10);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // counter now 7, ledger 7
    await db.query(`update public.profiles set credits = 999 where id='${UID}'`); // simulate drift
    await asService();
    await db.query(`select public.refund_credits('${r.spend_id}', null)`);
    // Incremental arithmetic would have produced 1002; recompute yields 10.
    expect((await scalar(`select credits from public.profiles where id='${UID}'`)).credits).toBe(10);
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
