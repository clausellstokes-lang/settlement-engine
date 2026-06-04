/**
 * tests/domain/trace.test.js — Causal trace API contract.
 *
 * The trace layer becomes load-bearing for every Tier 2+ feature
 * (faction profiles, supply-chain visibility, AI grounded-in-trace,
 * district simulation). Pin its semantics tight: recording mutates ctx,
 * reading never does, queries are exhaustive against the test fixture.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  recordTrace, recordTraces,
  getTraces, tracesFor, tracesByStep, tracesByType,
  tracesCausedBy, tracesAffecting,
  summarizeTrace,
} from '../../src/domain/trace.js';

function sampleTrace(over = {}) {
  return {
    targetType: 'institution',
    targetId:   'institution.town_watch',
    step:       'assembleInstitutions',
    result:     'selected',
    causes: [
      { source: 'threat.banditry', effect: '+30% likelihood', reason: 'Bandit pressure.' },
    ],
    downstreamEffects: [
      { target: 'publicOrder', effect: 'improved' },
    ],
    ...over,
  };
}

describe('recordTrace()', () => {
  it('initializes simulationTrace if absent', () => {
    const ctx = {};
    recordTrace(ctx, sampleTrace());
    expect(Array.isArray(ctx.simulationTrace)).toBe(true);
    expect(ctx.simulationTrace.length).toBe(1);
  });

  it('appends to existing simulationTrace', () => {
    const ctx = { simulationTrace: [{ targetId: 'pre-existing' }] };
    recordTrace(ctx, sampleTrace());
    expect(ctx.simulationTrace.length).toBe(2);
  });

  it('auto-stamps ts when absent', () => {
    const ctx = {};
    const before = Date.now();
    const t = recordTrace(ctx, sampleTrace());
    expect(typeof t.ts).toBe('number');
    expect(t.ts).toBeGreaterThanOrEqual(before);
  });

  it('preserves explicit ts when provided', () => {
    const ctx = {};
    const t = recordTrace(ctx, sampleTrace({ ts: 12345 }));
    expect(t.ts).toBe(12345);
  });

  it('defaults causes and downstreamEffects to empty arrays', () => {
    const ctx = {};
    const t = recordTrace(ctx, {
      targetType: 'institution', targetId: 'x', step: 's', result: 'r',
    });
    expect(t.causes).toEqual([]);
    expect(t.downstreamEffects).toEqual([]);
  });

  it('returns the recorded trace', () => {
    const ctx = {};
    const t = recordTrace(ctx, sampleTrace());
    expect(t).toBe(ctx.simulationTrace[0]);
  });

  it('is a no-op on nullish ctx', () => {
    expect(recordTrace(null, sampleTrace())).toBeNull();
    expect(recordTrace(undefined, sampleTrace())).toBeNull();
  });

  it('warns on missing required fields (dev mode)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ctx = {};
    recordTrace(ctx, { /* empty */ });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('recordTraces()', () => {
  it('appends a batch of traces', () => {
    const ctx = {};
    recordTraces(ctx, [sampleTrace({ targetId: 'a' }), sampleTrace({ targetId: 'b' })]);
    expect(ctx.simulationTrace.length).toBe(2);
  });

  it('is a no-op on non-array input', () => {
    const ctx = {};
    recordTraces(ctx, null);
    recordTraces(ctx, 'string');
    expect(ctx.simulationTrace).toBeUndefined();
  });
});

describe('read-only helpers', () => {
  // Single fixture used across the read suite. Built once so any cross-
  // query test sees the same data.
  function buildFixture() {
    return {
      simulationTrace: [
        sampleTrace({ targetId: 'institution.town_watch', step: 'assembleInstitutions' }),
        sampleTrace({
          targetType: 'faction', targetId: 'faction.temple',
          step: 'generatePower', result: 'promoted',
          causes: [{ source: 'condition.plague', effect: 'legitimacy +', reason: 'Plague relief.' }],
          downstreamEffects: [{ target: 'public_legitimacy', effect: 'rises' }],
        }),
        sampleTrace({
          targetType: 'supply_chain', targetId: 'chain.flour',
          step: 'generateEconomy', result: 'strained',
          causes: [{ source: 'condition.plague', effect: '-labor', reason: 'Labor shortage.' }],
          downstreamEffects: [{ target: 'foodSecurity', effect: 'falls' }],
        }),
      ],
    };
  }

  it('getTraces returns all traces', () => {
    const s = buildFixture();
    expect(getTraces(s).length).toBe(3);
  });

  it('getTraces is tolerant of missing settlement', () => {
    expect(getTraces(null)).toEqual([]);
    expect(getTraces({})).toEqual([]);
  });

  it('tracesFor filters by targetId', () => {
    const s = buildFixture();
    expect(tracesFor(s, 'institution.town_watch').length).toBe(1);
    expect(tracesFor(s, 'nonexistent').length).toBe(0);
  });

  it('tracesByStep filters by step name', () => {
    const s = buildFixture();
    expect(tracesByStep(s, 'generatePower').length).toBe(1);
    expect(tracesByStep(s, 'assembleInstitutions').length).toBe(1);
  });

  it('tracesByType filters by targetType', () => {
    const s = buildFixture();
    expect(tracesByType(s, 'faction').length).toBe(1);
    expect(tracesByType(s, 'supply_chain').length).toBe(1);
    expect(tracesByType(s, 'institution').length).toBe(1);
  });

  it('tracesCausedBy follows reverse causality', () => {
    const s = buildFixture();
    // The plague is cited as a cause on BOTH the faction promotion and
    // the supply-chain strain.
    expect(tracesCausedBy(s, 'condition.plague').length).toBe(2);
    expect(tracesCausedBy(s, 'threat.banditry').length).toBe(1);
  });

  it('tracesAffecting follows forward causality', () => {
    const s = buildFixture();
    // The temple promotion declares public_legitimacy as downstream.
    expect(tracesAffecting(s, 'public_legitimacy').length).toBe(1);
    expect(tracesAffecting(s, 'foodSecurity').length).toBe(1);
    expect(tracesAffecting(s, 'nonexistent').length).toBe(0);
  });

  it('helpers tolerate empty / nullish inputs', () => {
    expect(tracesFor(null, 'x')).toEqual([]);
    expect(tracesByStep({}, 'x')).toEqual([]);
    expect(tracesByType({}, '')).toEqual([]);
  });
});

describe('summarizeTrace()', () => {
  it('produces a headline, causes, and downstream lines', () => {
    const out = summarizeTrace(sampleTrace());
    expect(out.headline).toBe('institution.town_watch selected');
    expect(out.causes).toEqual(['threat.banditry (+30% likelihood) — Bandit pressure.']);
    expect(out.downstreamEffects).toEqual(['publicOrder: improved']);
  });

  it('handles traces with no causes', () => {
    const out = summarizeTrace(sampleTrace({ causes: [] }));
    expect(out.causes).toEqual([]);
  });

  it('returns null for nullish input', () => {
    expect(summarizeTrace(null)).toBeNull();
  });
});
