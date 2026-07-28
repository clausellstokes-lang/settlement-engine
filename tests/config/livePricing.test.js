import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { rpc },
}));

import {
  _resetLivePricingCache,
  fetchLivePricing,
  resolveLiveAiCost,
  resolveLiveStandardCost,
} from '../../src/config/livePricing.js';
import { getAiCost, getAiCostForModel } from '../../src/config/pricing.js';

const payload = {
  updatedAt: '2026-07-28T12:00:00Z',
  creditCosts: {
    anthropic_claude_opus_4_8: { narrative: 6, dailyLife: 5, progression: 7 },
    anthropic_claude_haiku_4_5: { narrative: 3, dailyLife: 4, progression: 5 },
  },
};

describe('live AI pricing', () => {
  beforeEach(() => {
    rpc.mockReset();
    _resetLivePricingCache();
  });

  it('memoizes one RPC read and warms synchronous quote/preflight accessors', async () => {
    rpc.mockResolvedValue({ data: payload, error: null });

    expect(await fetchLivePricing()).toEqual(payload);
    expect(await fetchLivePricing()).toEqual(payload);
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('get_ai_pricing');

    expect(getAiCost('narrative')).toBe(6);
    expect(getAiCostForModel('progression', 'anthropic_claude_opus_4_8')).toBe(7);
    expect(getAiCostForModel('narrative', 'anthropic_claude_haiku_4_5')).toBe(3);
  });

  it('validates every live cell and falls back to shipped prices on failure or malformed data', async () => {
    rpc.mockResolvedValue({
      data: {
        creditCosts: {
          anthropic_claude_opus_4_8: { narrative: 0, dailyLife: 5.5, progression: 99 },
        },
      },
      error: null,
    });
    const live = await fetchLivePricing();

    expect(resolveLiveStandardCost('narrative', live)).toBe(5);
    expect(resolveLiveAiCost('dailyLife', null, live)).toBe(4);
    expect(resolveLiveAiCost('progression', null, live)).toBe(6);

    _resetLivePricingCache();
    rpc.mockRejectedValue(new Error('offline'));
    expect(await fetchLivePricing()).toBeNull();
    expect(getAiCostForModel('narrative', 'anthropic_claude_opus_4_8')).toBe(5);
  });
});
