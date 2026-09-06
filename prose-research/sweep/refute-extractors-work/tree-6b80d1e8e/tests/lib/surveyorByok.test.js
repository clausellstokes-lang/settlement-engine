/**
 * surveyorByok.test.js — the PURE client helpers of the BYOK MANAGEMENT SURFACE (#29):
 * the key prefix hint, the est-$ math (shared with the governor's price table), and the
 * usage-meter aggregation. No network — these are the deterministic bits.
 */
import { describe, it, expect } from 'vitest';
import {
  keyPrefixHint, estimateUsd, PROBE_TIERS, probeTierLabel, probeTierSentence, normalizeByokRow,
} from '../../src/lib/surveyorByok.js';
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

// ── THE COMPETENCY PROBE's client half (wave L-3b) ──────────────────────────
// The transport itself needs a Supabase client, so what is pinned here is the pure
// part: the tier vocabulary, the one-sentence reading of a tier, and the row
// normalization that has to survive a database older than migration 191.

describe('probeTierLabel + probeTierSentence — a tier reads as a sentence, never a score', () => {
  it('every tier in the vocabulary has a label and a distinct sentence', () => {
    expect([...PROBE_TIERS]).toEqual(['scout', 'journeyman', 'master']);
    const sentences = new Set();
    for (const tier of PROBE_TIERS) {
      expect(probeTierLabel(tier)).toBeTruthy();
      const sentence = probeTierSentence({ probe_tier: tier });
      expect(sentence.length).toBeGreaterThan(40);
      sentences.add(sentence);
    }
    expect(sentences.size, 'each tier must read differently').toBe(3);
  });

  it('never probed is its own honest state, not the bottom tier', () => {
    expect(probeTierLabel(null)).toBeNull();
    expect(probeTierLabel('grandmaster')).toBeNull();
    const unprobed = probeTierSentence({ probe_tier: null });
    expect(unprobed).toMatch(/has not run a capability check/i);
    expect(unprobed).not.toBe(probeTierSentence({ probe_tier: 'scout' }));
    // total on absent input
    expect(probeTierSentence(null)).toBe(unprobed);
    expect(probeTierSentence(undefined)).toBe(unprobed);
  });

  it('the sentences state what happened in plain words, with no formula and no jargon', () => {
    for (const tier of PROBE_TIERS) {
      const sentence = probeTierSentence({ probe_tier: tier });
      expect(sentence, 'no score arithmetic on the surface').not.toMatch(/\d+\s*\/\s*\d+|%|score|pass rate|tier/i);
      expect(sentence, 'no house shouting').not.toContain('!');
    }
  });
});

describe('normalizeByokRow — a pre-191 database reads as "never probed", never as broken', () => {
  it('an older row with no probe columns normalizes to nulls', () => {
    const row = normalizeByokRow({ provider: 'anthropic', has_key: true, health: 'healthy' });
    expect(row.probe_tier).toBeNull();
    expect(row.probe_checked_at).toBeNull();
    expect(row.probe_model).toBeNull();
    expect(row.probe_version).toBeNull();
    expect(row.probe_profile).toBeNull();
    expect(row.health).toBe('healthy');     // everything else passes through untouched
  });

  it('a PRE-AMENDMENT 191 row keeps its tier and reads the L-7a pair as absent', () => {
    // The second generation of absence: a database carrying an earlier draft of 191
    // returns the tier trio but neither the exam version nor the verdict profile.
    const row = normalizeByokRow({
      probe_tier: 'journeyman', probe_checked_at: '2026-07-27T00:00:00.000Z', probe_model: 'claude-haiku-4-5',
    });
    expect(row.probe_tier).toBe('journeyman');
    expect(row.probe_version).toBeNull();
    expect(row.probe_profile).toBeNull();
  });

  it('a tier outside the vocabulary is refused rather than displayed', () => {
    expect(normalizeByokRow({ probe_tier: 'grandmaster' }).probe_tier).toBeNull();
    expect(normalizeByokRow({ probe_tier: 7 }).probe_tier).toBeNull();
  });

  it('a real row keeps its measured values, and a blank model reads as absent', () => {
    const row = normalizeByokRow({
      probe_tier: 'journeyman', probe_checked_at: '2026-07-27T00:00:00.000Z', probe_model: 'claude-haiku-4-5',
    });
    expect(row.probe_tier).toBe('journeyman');
    expect(row.probe_checked_at).toBe('2026-07-27T00:00:00.000Z');
    expect(row.probe_model).toBe('claude-haiku-4-5');
    expect(normalizeByokRow({ probe_model: '' }).probe_model).toBeNull();
  });

  it('is total: a non-row yields null rather than a half-built object', () => {
    for (const junk of [null, undefined, 'nope', 7]) expect(normalizeByokRow(junk)).toBeNull();
  });

  // ── wave L-7a: the exam receipt (version + verdict profile) ────────────────
  it('the exam version passes through only when it is semver-shaped', () => {
    expect(normalizeByokRow({ probe_version: '1.0.0' }).probe_version).toBe('1.0.0');
    expect(normalizeByokRow({ probe_version: '12.3.45' }).probe_version).toBe('12.3.45');
    for (const bad of ['v1.0.0', '1.0', '', 'the first exam', 1, null]) {
      expect(normalizeByokRow({ probe_version: bad }).probe_version, `${bad}`).toBeNull();
    }
  });

  it('a well-formed verdict profile passes through unchanged', () => {
    const profile = {
      tasks: [
        { key: 'construct', passed: true, reasonClass: null },
        { key: 'interpret', passed: false, reasonClass: 'below_floor' },
      ],
      passes: 1,
      tasksRun: 2,
    };
    expect(normalizeByokRow({ probe_profile: profile }).probe_profile).toEqual(profile);
  });

  it('anything that is not a verdict list reads as absent, never as a thing to render', () => {
    for (const bad of [null, undefined, 'a profile', 7, [], [{ key: 'construct' }], {}, { tasks: 'nope' }, { tasks: null }]) {
      expect(normalizeByokRow({ probe_profile: bad }).probe_profile, JSON.stringify(bad)).toBeNull();
    }
  });
});
