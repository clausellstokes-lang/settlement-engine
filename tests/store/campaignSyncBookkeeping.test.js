import { describe, expect, test, vi } from 'vitest';
import {
  createCampaignSyncBookkeeping,
} from '../../src/store/campaignSyncBookkeeping.js';

describe('campaign sync bookkeeping cold seam', () => {
  test('clears through one memoized lazy tool load without changing sync return semantics', async () => {
    const clearCampaignSync = vi.fn();
    const load = vi.fn(async () => ({ clearCampaignSync }));
    const bookkeeping = createCampaignSyncBookkeeping(load);

    expect(bookkeeping.clearCampaignSyncBookkeeping()).toBeUndefined();
    expect(bookkeeping.clearCampaignSyncBookkeeping()).toBeUndefined();
    await bookkeeping.loadCampaignSyncTools();
    await Promise.resolve();

    expect(load).toHaveBeenCalledTimes(1);
    expect(clearCampaignSync).toHaveBeenCalledTimes(2);
  });

  test('a lazy-tool rejection is absorbed at auth and the next load retries', async () => {
    const clearCampaignSync = vi.fn();
    const load = vi.fn()
      .mockRejectedValueOnce(new Error('chunk unavailable'))
      .mockResolvedValueOnce({ clearCampaignSync });
    const bookkeeping = createCampaignSyncBookkeeping(load);

    expect(bookkeeping.clearCampaignSyncBookkeeping()).toBeUndefined();
    await bookkeeping.loadCampaignSyncTools().catch(() => {});
    await Promise.resolve();

    await expect(bookkeeping.loadCampaignSyncTools()).resolves.toEqual({ clearCampaignSync });
    expect(load).toHaveBeenCalledTimes(2);
  });
});
