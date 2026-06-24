/** @vitest-environment jsdom */
/**
 * changeQueueCascade.test.jsx — the panel-side staging contract for Phase 4a.2.
 *
 * useChangeQueueCascade owns the Apply→queue-or-apply decision for link / unlink
 * cascades. These pin the standalone-vs-clock-bound behaviour the "Save N
 * pending changes" honesty rests on:
 *   • Link Apply on a STANDALONE settlement QUEUES an order — it does NOT apply
 *     or persist on the click (the commit is the queue flush).
 *   • Unlink Apply on a standalone settlement QUEUES by STABLE linkId, not the
 *     neighbour array index.
 *   • On a CLOCK-BOUND campaign member the queue is inactive, so Apply runs the
 *     cascade immediately (persistBatch fires now) — the pre-queue behaviour.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { useChangeQueueCascade } from '../../src/components/settlementDetail/useChangeQueueCascade.js';

const partner = { id: 'save_2', name: 'Mossbridge', tier: 'town', settlement: { name: 'Mossbridge', neighbourNetwork: [], interSettlementRelationships: [] } };

function makeCtx(overrides = {}) {
  const detail = {
    saveData: { id: 'save_1', name: 'Stoneford', tier: 'town' },
    settlement: {
      name: 'Stoneford', tier: 'town',
      neighbourNetwork: [{ id: 'save_2', linkId: 'link_save_1_save_2', name: 'Mossbridge' }],
      interSettlementRelationships: [],
    },
  };
  return {
    saves: [{ id: 'save_1', name: 'Stoneford', settlement: detail.settlement }, partner],
    setSaves: vi.fn(),
    savesRef: { current: [] },
    detail,
    setDetail: vi.fn(),
    setLinking: vi.fn(),
    setNetworkVersion: vi.fn(),
    persistBatch: vi.fn().mockResolvedValue(true),
    applyCosmeticRename: vi.fn(),
    queueChange: vi.fn(),
    queueActiveForOpenDetail: true,
    flushDeferRef: { current: false },
    flushAffectedRef: { current: new Set() },
    ...overrides,
  };
}

afterEach(cleanup);

describe('useChangeQueueCascade — standalone staging', () => {
  it('link Apply QUEUES an order and does NOT apply or persist on click', () => {
    const ctx = makeCtx();
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.handleLink(partner, 'ally');
    // One queued link order, captured by partner SAVE ID + stable linkId.
    expect(ctx.queueChange).toHaveBeenCalledTimes(1);
    const [saveId, order] = ctx.queueChange.mock.calls[0];
    expect(saveId).toBe('save_1');
    expect(order.type).toBe('link');
    expect(order.payload.partnerSaveId).toBe('save_2');
    expect(order.payload.linkId).toBe('link_save_1_save_2');
    // Nothing applied: no persist, no saves mutation on this click.
    expect(ctx.persistBatch).not.toHaveBeenCalled();
    expect(ctx.setSaves).not.toHaveBeenCalled();
  });

  it('unlink Apply QUEUES by STABLE linkId (not the array index)', () => {
    const ctx = makeCtx();
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.removeNeighbour(0);
    expect(ctx.queueChange).toHaveBeenCalledTimes(1);
    const [, order] = ctx.queueChange.mock.calls[0];
    expect(order.type).toBe('unlink');
    // The stable linkId is captured, NOT the index 0.
    expect(order.payload.linkId).toBe('link_save_1_save_2');
    expect(order.payload.partnerId).toBe('save_2');
    expect(ctx.persistBatch).not.toHaveBeenCalled();
  });
});

describe('useChangeQueueCascade — clock-bound (queue inactive) applies immediately', () => {
  it('link Apply on a clock-bound settlement applies + persists NOW (no queue)', () => {
    const ctx = makeCtx({ queueActiveForOpenDetail: false });
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.handleLink(partner, 'ally');
    // No staging — the immediate cascade ran and persisted both rows now.
    expect(ctx.queueChange).not.toHaveBeenCalled();
    expect(ctx.setSaves).toHaveBeenCalled();
    expect(ctx.persistBatch).toHaveBeenCalledTimes(1);
    const [, ids] = ctx.persistBatch.mock.calls[0];
    expect(new Set(ids.map(String))).toEqual(new Set(['save_1', 'save_2']));
  });
});
