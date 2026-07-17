/**
 * surveyorByok.test.js — the PURE client helpers of the BYOK MANAGEMENT SURFACE (#29):
 * the key prefix hint, the est-$ math (shared with the governor's price table), and the
 * usage-meter aggregation. No network — these are the deterministic bits.
 */
import { describe, it, expect } from 'vitest';
import { keyPrefixHint, estimateUsd } from '../../src/lib/surveyorByok.js';
import { aggregateUsage } from '../../src/components/account/AiUsageDashboard.jsx';

describe('keyPrefixHint — a hint, never a block', () => {
  it('warns when an Anthropic key lacks the sk-ant- prefix', () => {
    expect(keyPrefixHint('anthropic', 'wrong-looking-key')).toMatch(/sk-ant-/);
  });
  it('no warning for a well-formed key or an empty field', () => {
    expect(keyPrefixHint('anthropic', 'sk-ant-abc123')).toBeNull();
    expect(keyPrefixHint('anthropic', '')).toBeNull();
    expect(keyPrefixHint('anthropic', '   ')).toBeNull();
  });
});

describe('estimateUsd — tokens × the maintained price table', () => {
  const prices = { anthropic: { default: { in: 5, out: 25 }, 'claude-opus-4-8': { in: 5, out: 25 } } };
  it('sums input/output token cost per model', () => {
    const events = [{ model: 'claude-opus-4-8', input_tokens: 200000, output_tokens: 40000 }];
    // 0.2 * 5 + 0.04 * 25 = 1.0 + 1.0 = 2.0
    expect(estimateUsd(events, prices, 'anthropic')).toBeCloseTo(2, 6);
  });
  it('falls back to the default bucket for an unlisted model', () => {
    const events = [{ model: 'mystery', input_tokens: 1000000, output_tokens: 0 }];
    expect(estimateUsd(events, prices, 'anthropic')).toBeCloseTo(5, 6);
  });
  it('is 0 for no events / no prices', () => {
    expect(estimateUsd([], prices, 'anthropic')).toBe(0);
    expect(estimateUsd([{ model: 'x', input_tokens: 1e6, output_tokens: 0 }], {}, 'anthropic')).toBe(0);
  });
});

describe('aggregateUsage — the meter views', () => {
  it('totals tokens and breaks down by task and model, with a 14-day byDay spine', () => {
    const nowIso = new Date().toISOString();
    const events = [
      { feature: 'analysis', model: 'claude-opus-4-8', input_tokens: 100, output_tokens: 50, created_at: nowIso },
      { feature: 'analysis', model: 'claude-haiku-4-5', input_tokens: 10, output_tokens: 5, created_at: nowIso },
      { feature: 'brief', model: 'claude-opus-4-8', input_tokens: 200, output_tokens: 100, created_at: nowIso },
    ];
    const a = aggregateUsage(events);
    expect(a.requests).toBe(3);
    expect(a.totalTokens).toBe(100 + 50 + 10 + 5 + 200 + 100);
    expect(a.byDay).toHaveLength(14);                 // always a 14-day spine
    expect(a.byDay[13].tokens).toBe(a.totalTokens);   // all today
    // task breakdown, sorted desc — brief (300) leads analysis (165)
    expect(a.byTask[0].key).toBe('brief');
    const analysis = a.byTask.find((t) => t.key === 'analysis');
    const brief = a.byTask.find((t) => t.key === 'brief');
    expect(analysis.tokens).toBe(165);
    expect(brief.tokens).toBe(300);
    // model breakdown present
    expect(a.byModel.map((m) => m.key)).toEqual(expect.arrayContaining(['claude-opus-4-8', 'claude-haiku-4-5']));
  });
  it('empty input is safe (zeros + a 14-day spine)', () => {
    const a = aggregateUsage([]);
    expect(a.totalTokens).toBe(0);
    expect(a.requests).toBe(0);
    expect(a.byDay).toHaveLength(14);
    expect(a.byTask).toEqual([]);
  });
});
