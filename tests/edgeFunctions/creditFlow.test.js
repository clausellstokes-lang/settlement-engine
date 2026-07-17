/**
 * tests/edgeFunctions/creditFlow.test.js — the CREDITS RESERVE/REFUND ROUND-TRIP pin
 * (S1 commercial). Drives the SAME pure orchestrator the ai-analyst edge shell runs
 * (supabase/functions/ai-analyst/creditFlow.ts) with fake effects, and asserts the
 * money-boundary invariants generalized from generate-chronicle:
 *
 *   - RESERVE before SPEND; fail-closed on cap.
 *   - a rate-limit reject RELEASES the reservation (no spend, no model call).
 *   - insufficient credits RELEASE the reservation (no model call, no refund).
 *   - a model FAILURE meters the failure, REFUNDS the exact spend, and RELEASES.
 *   - a model SUCCESS RELEASES and NEVER refunds.
 *   - ELEVATED spends are never really refunded.
 *   - the reservation is RELEASED on EVERY post-reserve exit.
 */
import { describe, it, expect } from 'vitest';
import { runCreditedCall } from '../../supabase/functions/ai-analyst/creditFlow.ts';

/** Build a recording effect harness with overridable behaviour. */
function harness(over = {}) {
  const trace = [];
  const counts = { realRefunds: 0 };
  const fx = {
    async reserve() { trace.push('reserve'); return over.reserve ?? { allowed: true, reservationId: 'res-1' }; },
    async rateLimit() { trace.push('rateLimit'); return over.rateLimit ?? { allowed: true }; },
    async spend() {
      trace.push('spend');
      if (over.spendThrows) throw new Error('rpc down');
      return over.spend ?? { ok: true, spendId: 'spend-1', elevated: false, balance: 7 };
    },
    async callModel() {
      trace.push('callModel');
      if (over.modelThrows) throw new Error('anthropic 500');
      return over.model ?? { ok: true, answerText: 'Thornwall dominates. [faction:spheres]', usage: null };
    },
    async refund(spendId, reason, elevated) {
      trace.push(`refund:${spendId}:${elevated ? 'elevated' : 'real'}`);
      if (!elevated) counts.realRefunds += 1; // mirrors the real refund_credits no-op-on-elevated
    },
    async release(id) { trace.push(`release:${id ?? 'null'}`); },
    async meter(ok) { trace.push(`meter:${ok ? 'ok' : 'fail'}`); },
  };
  return { fx, trace, counts };
}

describe('creditFlow — reserve/refund round-trip', () => {
  it('SUCCESS: reserve → rateLimit → spend → model → meter(ok) → release; no refund', async () => {
    const { fx, trace, counts } = harness();
    const out = await runCreditedCall(fx, 'analyst failed');
    expect(out.outcome).toBe('ok');
    expect(out.status).toBe(200);
    expect(out.balance).toBe(7);
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'callModel', 'meter:ok', 'release:res-1']);
    expect(counts.realRefunds).toBe(0); // NEVER refund a successful paid call
    // reserve strictly precedes spend
    expect(trace.indexOf('reserve')).toBeLessThan(trace.indexOf('spend'));
  });

  it('CAP: reserve denied ⇒ 503, nothing else runs (no spend, no model, no release)', async () => {
    const { fx, trace } = harness({ reserve: { allowed: false, reservationId: null } });
    const out = await runCreditedCall(fx, 'x');
    expect(out).toEqual({ outcome: 'cap', status: 503 });
    expect(trace).toEqual(['reserve']);
  });

  it('RATE LIMIT: reject releases the reservation, no spend, no model', async () => {
    const { fx, trace } = harness({ rateLimit: { allowed: false } });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('rate_limited');
    expect(out.status).toBe(429);
    expect(trace).toEqual(['reserve', 'rateLimit', 'release:res-1']);
    expect(trace).not.toContain('spend');
    expect(trace).not.toContain('callModel');
  });

  it('INSUFFICIENT: spend ok:false releases the reservation, no model, no refund', async () => {
    const { fx, trace, counts } = harness({ spend: { ok: false, spendId: null, elevated: false, balance: 1, reason: 'insufficient_funds' } });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('insufficient');
    expect(out.status).toBe(402);
    expect(out.reason).toBe('insufficient_funds');
    expect(out.balance).toBe(1);
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'release:res-1']);
    expect(trace).not.toContain('callModel');
    expect(counts.realRefunds).toBe(0);
  });

  it('SPEND RPC ERROR: releases the reservation and returns 402, no model call', async () => {
    const { fx, trace } = harness({ spendThrows: true });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('insufficient');
    expect(out.status).toBe(402);
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'release:res-1']);
  });

  it('MODEL FAILURE: meter(fail) → refund(exact spend) → release; refunded:true', async () => {
    const { fx, trace, counts } = harness({ modelThrows: true });
    const out = await runCreditedCall(fx, 'analyst failed');
    expect(out.outcome).toBe('model_failed');
    expect(out.status).toBe(502);
    expect(out.refunded).toBe(true);
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'callModel', 'meter:fail', 'refund:spend-1:real', 'release:res-1']);
    expect(counts.realRefunds).toBe(1);
  });

  it('EMPTY ANSWER is a model failure and refunds', async () => {
    const { fx, counts } = harness({ model: { ok: true, answerText: '', usage: null } });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('model_failed');
    expect(counts.realRefunds).toBe(1);
  });

  it('ELEVATED: a model failure never REALLY refunds (dev/admin never charged)', async () => {
    const { fx, trace, counts } = harness({ spend: { ok: true, spendId: 'spend-e', elevated: true, balance: -2 }, modelThrows: true });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('model_failed');
    expect(out.refunded).toBe(false); // elevated ⇒ nothing to refund
    expect(trace).toContain('refund:spend-e:elevated');
    expect(counts.realRefunds).toBe(0); // the elevated refund is a no-op
  });

  it('ELEVATED success surfaces the sentinel balance as unlimited (999999), not -2', async () => {
    const { fx } = harness({ spend: { ok: true, spendId: 'spend-e', elevated: true, balance: -2 } });
    const out = await runCreditedCall(fx, 'x');
    expect(out.outcome).toBe('ok');
    expect(out.balance).toBe(999999);
  });
});
