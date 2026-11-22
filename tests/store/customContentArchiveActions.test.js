/**
 * @vitest-environment jsdom
 */

import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const service = vi.hoisted(() => ({
  exportArchive: vi.fn(),
  importArchive: vi.fn(),
  list: vi.fn(),
  isConfigured: true,
}));

vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: service,
}));

import {
  createCustomContentSlice,
} from '../../src/store/customContentSlice.js';

function makeStore({ premium = true } = {}) {
  return create(immer((set, get) => ({
    ...createCustomContentSlice(set, get),
    auth: {
      user: { id: 'archive-owner' },
      tier: premium ? 'premium' : 'free',
      role: 'user',
    },
    canUseCustomContent: () => premium,
    loadCustomContentFromCloud: vi.fn().mockResolvedValue(undefined),
    loadArchivedCustomContent: vi.fn().mockResolvedValue({}),
  })));
}

describe('custom-content archive store actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.isConfigured = true;
  });

  test('exports owned constitutional data without a premium entitlement gate', async () => {
    const archive = {
      format: 'settlementforge.custom-content-ledger',
      archiveFingerprint: 'a'.repeat(64),
    };
    service.exportArchive.mockResolvedValue(archive);
    const store = makeStore({ premium: false });

    await expect(store.getState().exportCustomContentArchive())
      .resolves.toBe(archive);
    expect(service.exportArchive).toHaveBeenCalledWith({
      ownerId: 'archive-owner',
    });
  });

  test('imports once, refreshes projections, and retains the durable receipt', async () => {
    const receipt = {
      ok: true,
      status: 'applied',
      persistence: {
        state: 'confirmed',
        authority: 'supabase-transaction',
      },
      identityMap: { definitionIds: [] },
      counts: { definitions: 0 },
    };
    service.importArchive.mockResolvedValue(receipt);
    const store = makeStore();

    const result = await store.getState().importCustomContentArchive(
      { archiveFingerprint: 'a'.repeat(64) },
      { purpose: 'account-import' },
    );

    expect(result).toBe(receipt);
    expect(service.importArchive).toHaveBeenCalledWith(
      { archiveFingerprint: 'a'.repeat(64) },
      {
        purpose: 'account-import',
        ownerId: 'archive-owner',
      },
    );
    expect(store.getState().loadCustomContentFromCloud).toHaveBeenCalledTimes(1);
    expect(store.getState().loadArchivedCustomContent).toHaveBeenCalledTimes(1);
    expect(store.getState().customContentLastCommandReceipt).toBe(receipt);
  });

  test('keeps archive mutation premium-gated', async () => {
    const store = makeStore({ premium: false });
    const result = await store.getState().importCustomContentArchive({});

    expect(result).toMatchObject({
      ok: false,
      reason: 'custom_content_requires_premium',
    });
    expect(service.importArchive).not.toHaveBeenCalled();
  });

  test('does not hydrate from an unconfirmed success-shaped receipt', async () => {
    service.importArchive.mockResolvedValue({
      ok: true,
      status: 'reconcile-required',
      persistence: {
        state: 'unconfirmed',
        authority: 'supabase-transaction',
      },
    });
    const store = makeStore();

    const result = await store.getState().importCustomContentArchive({});

    expect(result).toMatchObject({
      ok: true,
      status: 'reconcile-required',
    });
    expect(store.getState().loadCustomContentFromCloud)
      .not.toHaveBeenCalled();
    expect(store.getState().loadArchivedCustomContent)
      .not.toHaveBeenCalled();
  });
});
