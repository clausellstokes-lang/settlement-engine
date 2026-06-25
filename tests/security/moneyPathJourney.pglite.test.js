/**
 * moneyPathJourney.pglite.test.js — the COMPOSED revenue-path integration test.
 *
 * The audit's testing gap: every individual money RPC is exercised in isolation
 * (creditLedger.pglite.test.js — grant, spend, refund, allowance each on its
 * own), and the live browser journey (e2e/flow-b-auth-credits-ai.spec.js) needs
 * real Stripe+Supabase secrets so it cannot run in CI. Nothing asserted that the
 * RPCs COMPOSE correctly across the real revenue journey — a webhook grant, then
 * an AI spend, then a downstream-failure refund, then a re-spend, then a monthly
 * allowance, with Stripe's at-least-once REDELIVERY interleaved at each grant.
 *
 * This runs that whole journey against the SAME real PL/pgSQL bodies (via the
 * shared pglite harness) in ONE database, asserting the balance and ledger are
 * exactly consistent at every hop. It is the CI-executing coverage of the
 * composed checkout→webhook→credit-grant→AI-spend→decrement→refund chain that
 * the live Playwright spec documents but cannot run without secrets.
 *
 * Mirrors what the production handlers actually call:
 *   - stripe-webhook checkout.session.completed → system_grant_credits(source
 *     'purchase', metadata.stripe_session_id)  [grantCreditsForSessionOnce]
 *   - stripe-webhook invoice.paid → system_grant_credits('monthly_allowance',
 *     metadata.stripe_invoice_id)              [grantMonthlyAllowanceIfNeeded]
 *   - generate-narrative success → spend_credits(feature)
 *   - generate-narrative failure → refund_credits(spend_id)  [refund on failure]
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { makeCreditLedgerDb, allMigrationsExist } from './creditLedgerHarness.js';

const UID = '11111111-1111-1111-1111-111111111111';

let db;
const asRole = (role) => db.exec(`set test.role = '${role}';`);
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const setPrivileged = (v) => db.exec(`set test.privileged = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = async (uid) => (await scalar(`select public.get_credit_balance('${uid}') as b`)).b;
const grantCount = async () => (await scalar("select count(*)::int n from public.credit_ledger where kind='grant'")).n;
const spendCount = async () => (await scalar("select count(*)::int n from public.credit_ledger where kind='spend'")).n;

/** stripe-webhook checkout grant (idempotent on stripe_session_id). */
const webhookPurchase = (amount, sessionId) => {
  asRole('service_role');
  return db.query('select public.system_grant_credits($1,$2,$3,$4::jsonb) as b', [
    UID, amount, 'purchase', `{"stripe_session_id":"${sessionId}"}`,
  ]);
};
/** stripe-webhook monthly allowance grant (idempotent on stripe_invoice_id). */
const webhookAllowance = (amount, invoiceId) => {
  asRole('service_role');
  return db.query('select public.system_grant_credits($1,$2,$3,$4::jsonb) as b', [
    UID, amount, 'monthly_allowance', `{"stripe_invoice_id":"${invoiceId}"}`,
  ]);
};
/** generate-narrative spend, as the authenticated user. */
const aiSpend = async (feature) => {
  asRole('authenticated');
  asUser(UID);
  return (await scalar(`select public.spend_credits('${feature}') as r`)).r;
};
/** generate-narrative refund-on-failure, by the owning user. */
const aiRefund = (spendId) => {
  asRole('authenticated');
  asUser(UID);
  return db.query(`select public.refund_credits('${spendId}', 'ai_generation_failed')`);
};

describe.runIf(allMigrationsExist)('money-path journey — composed revenue chain (pglite)', () => {
  beforeAll(async () => {
    db = await makeCreditLedgerDb();
  });

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_grant_idempotency, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0);`);
    await setPrivileged(false);
    await asRole('authenticated');
    await asUser(UID);
  });

  it('runs the full journey to an exactly-consistent balance, replay-safe at every grant', async () => {
    // 0. New account: zero balance.
    expect(await balanceOf(UID)).toBe(0);

    // 1. Stripe checkout completes → webhook grants a 25-credit pack.
    await webhookPurchase(25, 'cs_pack');
    expect(await balanceOf(UID)).toBe(25);

    // 2. Stripe redelivers the SAME checkout event (at-least-once). MUST NOT double-grant.
    await webhookPurchase(25, 'cs_pack');
    expect(await balanceOf(UID)).toBe(25);
    expect(await grantCount()).toBe(1);

    // 3. User runs an AI narrative (cost 3) → balance 22.
    const s1 = await aiSpend('narrative');
    expect(s1.ok).toBe(true);
    expect(await balanceOf(UID)).toBe(22);

    // 4. The AI call fails downstream → generate-narrative refunds the spend → back to 25.
    await aiRefund(s1.spend_id);
    expect(await balanceOf(UID)).toBe(25);

    // 5. The refund is idempotent: a duplicate failure handler cannot double-credit.
    await expect(aiRefund(s1.spend_id)).rejects.toThrow(/already refunded/i);
    expect(await balanceOf(UID)).toBe(25);

    // 6. User retries; this AI run succeeds (cost 3) → 22, spend stands.
    const s2 = await aiSpend('narrative');
    expect(s2.ok).toBe(true);
    expect(await balanceOf(UID)).toBe(22);

    // 7. Monthly subscription invoice pays → webhook grants the 30-credit allowance → 52.
    await webhookAllowance(30, 'inv_jan');
    expect(await balanceOf(UID)).toBe(52);

    // 8. The invoice webhook is redelivered → still 52 (idempotent on invoice id).
    await webhookAllowance(30, 'inv_jan');
    expect(await balanceOf(UID)).toBe(52);

    // 9. A second AI feature (progression, cost 5) → 47.
    const s3 = await aiSpend('progression');
    expect(s3.ok).toBe(true);
    expect(await balanceOf(UID)).toBe(47);

    // Final invariant: 2 grants (pack + allowance) + 1 refund-grant; 3 spends; one
    // refunded. Balance = 25 + 30 + 3(refund) − 3 − 3 − 5 = 47, and it ties out.
    expect(await balanceOf(UID)).toBe(47);
    expect(await grantCount()).toBe(3); // pack, allowance, refund-as-grant
    expect(await spendCount()).toBe(3); // s1 (refunded), s2, s3
    // Exactly one idempotency claim per distinct delivery key (session + invoice).
    expect((await scalar('select count(*)::int n from public.credit_grant_idempotency')).n).toBe(2);
    // The refunded spend correlates to a refund grant; the others do not.
    expect((await scalar("select count(*)::int n from public.credit_ledger where source='refund'")).n).toBe(1);
  });

  it('a refund cannot resurrect spend the user never paid for (cross-spend refund is rejected)', async () => {
    await webhookPurchase(10, 'cs_a');
    const s = await aiSpend('narrative'); // balance 7
    expect(await balanceOf(UID)).toBe(7);
    // A forged refund of a non-existent spend id must fail, leaving balance intact.
    await expect(aiRefund('33333333-3333-3333-3333-333333333333')).rejects.toThrow(/spend row not found/i);
    expect(await balanceOf(UID)).toBe(7);
    // The real refund still works exactly once.
    await aiRefund(s.spend_id);
    expect(await balanceOf(UID)).toBe(10);
  });

  it('the unique-index backstop blocks a duplicate refund even if it bypasses the function (087)', async () => {
    await webhookPurchase(10, 'cs_idx');
    const s = await aiSpend('narrative'); // balance 7
    await aiRefund(s.spend_id);           // legitimate refund → balance 10
    expect(await balanceOf(UID)).toBe(10);
    // A direct INSERT that bypasses refund_credits' check-then-insert guard (the
    // concurrent-redelivery race) must still be rejected by the partial unique
    // index ux_credit_ledger_one_refund_per_spend — one refund grant per spend.
    await expect(
      db.query(
        `insert into public.credit_ledger (user_id, kind, amount, source, metadata)
         values ('${UID}', 'grant', 3, 'refund', jsonb_build_object('refund_of', '${s.spend_id}'))`,
      ),
    ).rejects.toThrow(/duplicate key|unique|ux_credit_ledger_one_refund_per_spend/i);
    expect(await balanceOf(UID)).toBe(10); // balance unchanged — no double-credit
  });

  it('an overspend mid-journey is rejected and leaves the ledger untouched', async () => {
    await webhookPurchase(4, 'cs_small'); // 4 credits
    const ok = await aiSpend('narrative'); // cost 3 → 1
    expect(ok.ok).toBe(true);
    const over = await aiSpend('narrative'); // cost 3 > 1 remaining
    expect(over.ok).toBe(false);
    expect(over.reason).toBe('insufficient_funds');
    expect(await balanceOf(UID)).toBe(1);
    expect(await spendCount()).toBe(1); // the rejected spend wrote nothing
  });
});
