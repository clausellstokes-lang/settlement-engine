/**
 * campaignChronicle.test.js — correctness-2 regression pin (helper totality).
 *
 * requestCampaignChronicle must ALWAYS resolve to a { chronicle? , error? }
 * object and never reject — buildChronicleGrounding and supabase.auth.getSession
 * both run inside the try now. A rejection previously propagated to the panel's
 * bare await and left the paid Chronicle button stuck busy forever.
 */
import { describe, it, expect, vi } from 'vitest';

// grounding builder: keep it inert so the test isolates the auth/session limb.
vi.mock('../../src/domain/worldPulse/chronicle.js', () => ({
  buildChronicleGrounding: () => ({ grounded: true }),
}));

// supabase: configured, but getSession REJECTS (a network/transport failure).
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getSession: () => Promise.reject(new Error('offline')) },
    functions: { invoke: () => Promise.resolve({ data: {}, error: null }) },
  },
}));

const { requestCampaignChronicle } = await import('../../src/lib/campaignChronicle.js');

describe('requestCampaignChronicle — total (correctness-2)', () => {
  it('resolves with an error object instead of rejecting when getSession throws', async () => {
    const result = await requestCampaignChronicle({ campaign: {}, snapshot: {} });
    expect(result).toBeTruthy();
    expect(typeof result.error).toBe('string');
    expect(result.chronicle).toBeUndefined();
  });

  it('never rejects (the promise settles fulfilled)', async () => {
    await expect(requestCampaignChronicle({ campaign: {}, snapshot: {} })).resolves.toBeDefined();
  });
});
