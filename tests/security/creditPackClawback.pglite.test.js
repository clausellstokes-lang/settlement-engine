/**
 * creditPackClawback.pglite.test.js — EXECUTION-level tests for migration 190
 * (system_clawback_credits, CYCLE-3 Wave 8 M2).
 *
 * The gap: grantCreditsForSessionOnce mints pack credits on checkout.session.
 * completed (system_grant_credits, source 'purchase', delivery key = session id),
 * but the charge.refunded / charge.dispute.created arm never reversed them — a
 * refunded pack kept its credits. Neither existing RPC could express the ruling
 * (2026-07-26): system_grant_credits rejects amount <= 0, service_adjust_credits
 * clamps at zero and takes no per-session claim.
 *
 * These pin 190's contract against the REAL, NET-CURRENT bodies (the shared
 * creditLedgerHarness loads get_credit_balance/018 + system_grant_credits/024;
 * 190's body is extracted here):
 *   - a granted-then-refunded session claws back EXACTLY the granted amount;
 *   - the balance MAY go negative, and a future grant nets against the debt;
 *   - claim-once per session key (a redelivery reads already_clawed_back and
 *     deducts nothing) mirroring the grant's own delivery claim;
 *   - a session that never granted a pack no-ops (no claim row, no ledger row);
 *   - service-role-only; and the FOR UPDATE lock precedes the balance read.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { makeCreditLedgerDb, allMigrationsExist } from './creditLedgerHarness.js';

const MIG_190 = resolve(process.cwd(), 'supabase', 'migrations', '190_credit_pack_clawback.sql');
const allExist = allMigrationsExist && existsSync(MIG_190);

/** Extract 190's function definition verbatim: `create or replace function
 *  public.system_clawback_credits` to the first `$$;` (the harness idiom). */
function extract190() {
  const src = readFileSync(MIG_190, 'utf-8');
  // ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form also matches header
  // prose quoting the statement (see tests/security/moneyRpcNetCurrentGuards.test.js).
  const m = src.match(/^create\s+or\s+replace\s+function\s+public\.system_clawback_credits\b[\s\S]*?\$\$;/im);
  if (!m) throw new Error('could not extract system_clawback_credits from migration 190');
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';

let db;
const asRole = (role) => db.exec(`set test.role = '${role}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = async (uid) => (await scalar(`select public.get_credit_balance('${uid}') as b`)).b;
const cachedOf = async (uid) => (await scalar(`select credits from public.profiles where id = '${uid}'`)).credits;
/** The webhook's pack grant (system_grant_credits, source 'purchase', session key). */
const packGrant = (amount, sessionId) => {
  asRole('service_role');
  return db.query('select public.system_grant_credits($1,$2,$3,$4::jsonb) as b', [
    UID, amount, 'purchase', `{"stripe_session_id":"${sessionId}"}`,
  ]);
};
/** The webhook's reversal (190). */
const clawback = async (sessionId, reason = 'full_refund') =>
  (await scalar(`select public.system_clawback_credits('${sessionId}', '${reason}') as r`)).r;

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the runIf suite below silently runs ZERO assertions while
// reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allMigrationsExist, 'harness migrations missing').toBe(true);
  expect(existsSync(MIG_190), '190_credit_pack_clawback.sql missing').toBe(true);
});

describe.runIf(allExist)('190 system_clawback_credits — credit-pack refund clawback (pglite)', () => {
  beforeAll(async () => {
    db = await makeCreditLedgerDb();
    await db.exec(extract190());
  }, 30000); // PGlite WASM cold-start is ~20s under parallel/loaded runs; match the sibling harnesses.

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_grant_idempotency, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0);`);
    await asRole('service_role');
  });

  it('a granted-then-refunded session claws back EXACTLY the granted amount', async () => {
    await packGrant(50, 'cs_pack');
    expect(await balanceOf(UID)).toBe(50);

    const r = await clawback('cs_pack', 'full_refund');
    expect(r).toMatchObject({ ok: true, user_id: UID, amount: 50, prev: 50, next: 0 });
    expect(await balanceOf(UID)).toBe(0);
    expect(await cachedOf(UID)).toBe(0);

    // The reversal row: full amount, unallocated 'spend', reason carries the class.
    const row = await scalar(`select kind, amount, metadata from public.credit_ledger where source = 'purchase_clawback'`);
    expect(row.kind).toBe('spend');
    expect(row.amount).toBe(50);
    expect(row.metadata.stripe_session_id).toBe('cs_pack');
    expect(row.metadata.reason).toBe('full_refund');
    // The legacy mirror records the NEGATIVE movement.
    const tx = await scalar(`select amount from public.credit_transactions where reason = 'purchase_clawback'`);
    expect(tx.amount).toBe(-50);
    // Grant claim + reversal claim sit side by side on the same key.
    expect((await scalar(`select count(*)::int n from public.credit_grant_idempotency where idempotency_key = 'cs_pack'`)).n).toBe(2);
  });

  it('the balance MAY go negative, and a future grant nets against the debt (ruling 2026-07-26)', async () => {
    await packGrant(50, 'cs_neg');
    // The user spends 30 before the refund lands (unallocated spend, the
    // legacy_spends shape get_credit_balance subtracts without a clamp).
    await db.query(
      `insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'spend',30,'narrative')`,
      [UID],
    );
    expect(await balanceOf(UID)).toBe(20);

    const r = await clawback('cs_neg');
    expect(r).toMatchObject({ ok: true, amount: 50, prev: 20, next: -30 });
    expect(await balanceOf(UID)).toBe(-30);   // a DEBT, not a zero-clamp
    expect(await cachedOf(UID)).toBe(-30);    // the cache mirrors ledger truth

    // A future pack purchase nets against the debt.
    await packGrant(40, 'cs_later');
    expect(await balanceOf(UID)).toBe(10);
    expect(await cachedOf(UID)).toBe(10);
  });

  it('claim-once per session: a redelivered reversal reads already_clawed_back and deducts NOTHING', async () => {
    await packGrant(25, 'cs_replay');
    const first = await clawback('cs_replay');
    expect(first.ok).toBe(true);
    expect(await balanceOf(UID)).toBe(0);

    const second = await clawback('cs_replay');
    expect(second).toMatchObject({ ok: false, reason: 'already_clawed_back' });
    expect(await balanceOf(UID)).toBe(0);     // NOT -25 — no double deduction
    expect((await scalar(`select count(*)::int n from public.credit_ledger where source = 'purchase_clawback'`)).n).toBe(1);
    expect((await scalar(`select count(*)::int n from public.credit_transactions where reason = 'purchase_clawback'`)).n).toBe(1);
  });

  it('a session that never granted a pack no-ops: no claim row, no ledger row', async () => {
    await packGrant(25, 'cs_other');          // an unrelated pack stays untouched
    const r = await clawback('cs_never_granted');
    expect(r).toMatchObject({ ok: false, reason: 'no_pack_grant' });
    expect(await balanceOf(UID)).toBe(25);
    expect((await scalar(`select count(*)::int n from public.credit_ledger where source = 'purchase_clawback'`)).n).toBe(0);
    // The no-op returns BEFORE the claim insert — a later real reversal of a
    // colliding key is never blocked by a phantom claim.
    expect((await scalar(`select count(*)::int n from public.credit_grant_idempotency where source = 'purchase_clawback'`)).n).toBe(0);
  });

  it('only a full-refund-equivalent reverses: a non-purchase grant with the same session key is untouched', async () => {
    // A redeem_code grant keyed on the same session (the redeem path shares the
    // session id) must NOT be swept up — the clawback targets source 'purchase'.
    asRole('service_role');
    await db.query('select public.system_grant_credits($1,$2,$3,$4::jsonb)', [
      UID, 15, 'redeem_code', '{"stripe_session_id":"cs_redeem"}',
    ]);
    const r = await clawback('cs_redeem');
    expect(r).toMatchObject({ ok: false, reason: 'no_pack_grant' });
    expect(await balanceOf(UID)).toBe(15);
  });

  it('is service-role only and requires a session id', async () => {
    await packGrant(10, 'cs_gate');
    await asRole('authenticated');
    await expect(clawback('cs_gate')).rejects.toThrow(/service-role only/);
    await asRole('service_role');
    await expect(clawback('   ')).rejects.toThrow(/session id is required/);
    expect(await balanceOf(UID)).toBe(10);    // nothing moved
  });

  // pglite is single-connection, so the FOR UPDATE serialization is pinned
  // textually (the 103-suite idiom): the shipped body must take the profiles
  // row lock BEFORE the balance read, and the claim must be ON CONFLICT-atomic.
  it('the shipped body locks the profiles row FOR UPDATE before the balance read, claim is conflict-atomic', () => {
    const body = extract190();
    const lock = body.search(/from\s+public\.profiles\s+where\s+id\s*=\s*v_user\s+for\s+update/i);
    const read = body.search(/get_credit_balance\(v_user\)/i);
    expect(lock, 'must FOR UPDATE the profiles row').toBeGreaterThan(-1);
    expect(read, 'must read the ledger balance').toBeGreaterThan(-1);
    expect(lock).toBeLessThan(read);
    expect(body).toMatch(/on\s+conflict\s+do\s+nothing/i);
  });
});
