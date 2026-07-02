/** @vitest-environment jsdom */
/**
 * changeQueueCascadeClockBound.test.jsx — the clock-bound half of the link /
 * unlink staging contract (the lost-action fix).
 *
 * Phase 4b widened SettlementsPanel's queueActiveForOpenDetail to ANY open
 * settlement — including clock-bound canon campaign members — but a member's
 * OTHER edits (EventComposer events, header renames) apply IMMEDIATELY, and
 * before this fix its queued link/unlink orders had no reachable commit. The
 * hook now checks clock-bound status LIVE against the store at click time:
 *   • CLOCK-BOUND member + queueActiveForOpenDetail=true (what the panel
 *     actually passes) → the cascade applies + persists NOW, nothing queues —
 *     an order can never strand.
 *   • STANDALONE (same prop, no canonized campaign) → stages as before.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { useChangeQueueCascade } from '../../src/components/settlementDetail/useChangeQueueCascade.js';
import { useStore } from '../../src/store/index.js';

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
    // What SettlementsPanel passes for ANY open detail since Phase 4b —
    // INCLUDING a clock-bound campaign member. The clock-bound short-circuit
    // must come from the hook's own live store check, not this prop.
    queueActiveForOpenDetail: true,
    flushDeferRef: { current: false },
    flushAffectedRef: { current: new Set() },
    ...overrides,
  };
}

/** Bind save_1 to a canonized campaign clock (isSettlementClockBound → true). */
function seedClockBoundCampaign() {
  useStore.setState({
    campaigns: [{
      id: 'camp_1',
      name: 'The March',
      settlementIds: ['save_1'],
      worldState: { canonizedAt: '2026-01-01T00:00:00Z', tick: 3 },
    }],
  });
}

afterEach(() => {
  useStore.setState({ campaigns: [] });
  cleanup();
});

describe('useChangeQueueCascade — clock-bound member applies immediately (never strands)', () => {
  it('link Apply on a clock-bound member applies + persists NOW even though queueActiveForOpenDetail is true', () => {
    seedClockBoundCampaign();
    const ctx = makeCtx();
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.handleLink(partner, 'ally');
    // NOT staged — a member's queue panel treats edits as immediate, so a
    // queued order here would be uncommittable (the lost-action bug).
    expect(ctx.queueChange).not.toHaveBeenCalled();
    // The immediate cascade ran and persisted BOTH rows now.
    expect(ctx.setSaves).toHaveBeenCalled();
    expect(ctx.persistBatch).toHaveBeenCalledTimes(1);
    const [, ids] = ctx.persistBatch.mock.calls[0];
    expect(new Set(ids.map(String))).toEqual(new Set(['save_1', 'save_2']));
  });

  it('unlink Apply on a clock-bound member applies + persists NOW (no queue)', () => {
    seedClockBoundCampaign();
    const ctx = makeCtx();
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.removeNeighbour(0);
    expect(ctx.queueChange).not.toHaveBeenCalled();
    expect(ctx.setSaves).toHaveBeenCalled();
    expect(ctx.persistBatch).toHaveBeenCalledTimes(1);
    const [, ids] = ctx.persistBatch.mock.calls[0];
    expect(new Set(ids.map(String))).toEqual(new Set(['save_1', 'save_2']));
  });

  it('standalone (no canonized campaign) still STAGES with the same prop — regression guard', () => {
    const ctx = makeCtx();
    const { result } = renderHook(() => useChangeQueueCascade(ctx));
    result.current.handleLink(partner, 'ally');
    expect(ctx.queueChange).toHaveBeenCalledTimes(1);
    const [saveId, order] = ctx.queueChange.mock.calls[0];
    expect(saveId).toBe('save_1');
    expect(order.type).toBe('link');
    expect(ctx.persistBatch).not.toHaveBeenCalled();
  });
});
