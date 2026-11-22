/**
 * tests/domain/regionalGraphImpactRetention.test.js — performance-scale-1 pin.
 *
 * queuedImpacts used to only ever STATUS-FLIP, never be removed, so terminal
 * (applied/ignored/expired/resolved) rows accumulated forever — per-tick cost and
 * persisted size grew with campaign age. ensureRegionalGraph now runs a retention
 * pass: QUEUED rows always survive; TERMINAL rows are capped at
 * REGIONAL_TERMINAL_IMPACT_LIMIT, oldest-dropped, order preserved.
 */
import { describe, expect, it } from 'vitest';
import { ensureRegionalGraph, REGIONAL_TERMINAL_IMPACT_LIMIT } from '../../src/domain/region/graph.js';

const impact = (id, status) => ({ id, status, severity: 0.4, confidence: 0.5, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' });

describe('performance-scale-1 — queuedImpacts retention', () => {
  it('below the cap: every impact survives, order + bytes unchanged', () => {
    const impacts = [];
    for (let i = 0; i < 20; i++) impacts.push(impact(`imp-${i}`, i % 2 ? 'resolved' : 'queued'));
    const g = ensureRegionalGraph({ queuedImpacts: impacts }, { now: '2026-01-01T00:00:00.000Z' });
    expect(g.queuedImpacts.length).toBe(20);
    expect(g.queuedImpacts.map(x => x.id)).toEqual(impacts.map(x => x.id));
  });

  it('above the cap: queued rows ALL survive; terminal capped at the limit; oldest terminal dropped', () => {
    const impacts = [];
    // 400 terminal (resolved) + 5 queued interleaved. Terminal count (400) exceeds
    // the cap, so exactly (400 - LIMIT) oldest terminal rows drop; all 5 queued stay.
    for (let i = 0; i < 400; i++) impacts.push(impact(`term-${String(i).padStart(3, '0')}`, 'resolved'));
    for (let i = 0; i < 5; i++) impacts.splice(i * 80, 0, impact(`queued-${i}`, 'queued'));

    const g = ensureRegionalGraph({ queuedImpacts: impacts }, { now: '2026-01-01T00:00:00.000Z' });
    const kept = g.queuedImpacts;
    const keptQueued = kept.filter(x => x.status === 'queued');
    const keptTerminal = kept.filter(x => x.status !== 'queued');

    // No pending row is ever lost.
    expect(keptQueued.length).toBe(5);
    // Terminal backlog is bounded exactly at the cap.
    expect(keptTerminal.length).toBe(REGIONAL_TERMINAL_IMPACT_LIMIT);
    // The SURVIVING terminal rows are the NEWEST (highest-index) — oldest dropped.
    expect(keptTerminal[0].id).toBe(`term-${String(400 - REGIONAL_TERMINAL_IMPACT_LIMIT).padStart(3, '0')}`);
    expect(keptTerminal[keptTerminal.length - 1].id).toBe('term-399');
    // Total is bounded, and the survivors keep their relative order.
    expect(kept.length).toBe(REGIONAL_TERMINAL_IMPACT_LIMIT + 5);
    const ids = kept.map(x => x.id);
    const sortedByOriginal = [...ids].sort((a, b) => impacts.findIndex(x => x.id === a) - impacts.findIndex(x => x.id === b));
    expect(ids).toEqual(sortedByOriginal);
  });

  it('idempotent: re-normalizing an already-capped graph is a no-op (byte-stable)', () => {
    const impacts = [];
    for (let i = 0; i < 400; i++) impacts.push(impact(`term-${String(i).padStart(3, '0')}`, 'expired'));
    const once = ensureRegionalGraph({ queuedImpacts: impacts }, { now: '2026-01-01T00:00:00.000Z' });
    const twice = ensureRegionalGraph(once, { now: '2026-01-01T00:00:00.000Z' });
    expect(JSON.stringify(twice.queuedImpacts)).toBe(JSON.stringify(once.queuedImpacts));
    expect(twice.queuedImpacts.length).toBe(REGIONAL_TERMINAL_IMPACT_LIMIT);
  });
});
