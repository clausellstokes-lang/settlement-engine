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
import { newRepairUsage, runWithRepair } from '../../supabase/functions/_shared/repairLoop.ts';

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

// ── wave L-6: the formative loop lives INSIDE the callModel window ────────────
// The repair loop turns one credited call into one-to-N provider round-trips. The whole
// point of putting it inside `callModel` is that the seven invariants above cannot see it:
// one reserve, one rate-limit consume, ONE spend, one meter, one release, and a refund
// only on failure, no matter how many times the provider was asked. These pins drive the
// real orchestrator with the real loop and assert exactly that.

/** A surface-shaped callModel: the repair loop wrapped in the shape creditFlow expects. */
function loopedCallModel({ answers, maxRounds, throwOnCall = 0 }) {
  const usage = newRepairUsage();
  const state = { providerCalls: 0 };
  const callModel = async () => {
    const result = await runWithRepair({
      basePrompt: 'BASE PROMPT',
      maxRounds,
      usage,
      callModel: () => {
        state.providerCalls += 1;
        if (state.providerCalls === throwOnCall) throw new Error('Anthropic 500');
        const text = answers[Math.min(state.providerCalls - 1, answers.length - 1)];
        return Promise.resolve({ answerText: text, usage: { input: 100, output: 10 } });
      },
      parse: (text) => ({ items: String(text).split(',').map((s) => s.trim()).filter(Boolean) }),
      validate: (parsed) => parsed.items
        .filter((i) => !i.startsWith('ok:'))
        .map((subject) => ({ code: 'invalid_value', subject })),
      merge: ({ accepted, repaired }) => ({
        items: [...accepted.items.filter((i) => i.startsWith('ok:')), ...repaired.items],
      }),
    });
    return { ok: !!result.parsed, answerText: result.answerText, usage: null };
  };
  return { callModel, state, usage };
}

describe('creditFlow x the formative loop (wave L-6) - the 7 invariants are untouched', () => {
  it('THREE provider round-trips still make exactly ONE spend, ONE meter, ONE release', async () => {
    const looped = loopedCallModel({ answers: ['bad', 'still-bad', 'ok:fixed'], maxRounds: 2 });
    const { fx, trace, counts } = harness();
    fx.callModel = async () => { trace.push('callModel'); return looped.callModel(); };

    const out = await runCreditedCall(fx, 'custom content compile failed');

    expect(looped.state.providerCalls).toBe(3);            // the loop really did repair twice
    expect(out.outcome).toBe('ok');
    // The money trace is BYTE-IDENTICAL to the single-call success trace above.
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'callModel', 'meter:ok', 'release:res-1']);
    expect(trace.filter((t) => t === 'spend')).toHaveLength(1);
    expect(trace.filter((t) => t === 'reserve')).toHaveLength(1);
    expect(trace.filter((t) => t === 'rateLimit')).toHaveLength(1);
    expect(counts.realRefunds).toBe(0);                    // never refund a successful paid call
    // The provider tokens of all three rounds land on ONE ledger, for ONE COGS row.
    expect(looped.usage.calls).toBe(3);
    expect(looped.usage.inputTokens).toBe(300);
    expect(looped.usage.outputTokens).toBe(30);
  });

  it('a provider failure on a REPAIR round refunds exactly once (no per-round refunds)', async () => {
    const looped = loopedCallModel({ answers: ['bad', 'bad'], maxRounds: 2, throwOnCall: 2 });
    const { fx, trace, counts } = harness();
    fx.callModel = async () => { trace.push('callModel'); return looped.callModel(); };

    const out = await runCreditedCall(fx, 'custom content compile failed');

    expect(looped.state.providerCalls).toBe(2);
    expect(out.outcome).toBe('model_failed');
    expect(out.refunded).toBe(true);
    expect(counts.realRefunds).toBe(1);                    // ONE refund for ONE spend
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'callModel', 'meter:fail', 'refund:spend-1:real', 'release:res-1']);
    // The first round's tokens survive the throw, so the COGS row is not silently zeroed.
    expect(looped.usage.inputTokens).toBe(100);
  });

  it('INERT: with zero rounds the loop makes ONE provider call and the trace is unchanged', async () => {
    const looped = loopedCallModel({ answers: ['bad'], maxRounds: 0 });
    const { fx, trace, counts } = harness();
    fx.callModel = async () => { trace.push('callModel'); return looped.callModel(); };

    const out = await runCreditedCall(fx, 'x');

    expect(looped.state.providerCalls).toBe(1);
    expect(out.outcome).toBe('ok');
    expect(trace).toEqual(['reserve', 'rateLimit', 'spend', 'callModel', 'meter:ok', 'release:res-1']);
    expect(counts.realRefunds).toBe(0);
  });

  it('a capped or rate-limited request never reaches the loop at all (no provider calls)', async () => {
    for (const over of [{ reserve: { allowed: false, reservationId: null } }, { rateLimit: { allowed: false } }]) {
      const looped = loopedCallModel({ answers: ['bad'], maxRounds: 2 });
      const { fx } = harness(over);
      fx.callModel = () => looped.callModel();
      await runCreditedCall(fx, 'x');
      expect(looped.state.providerCalls).toBe(0);
    }
  });
});
