/**
 * @vitest-environment jsdom
 */

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import {
  cleanup,
  renderHook,
  waitFor,
} from '@testing-library/react';

import useCustomContentCloudSync from '../../src/hooks/useCustomContentCloudSync.js';

afterEach(cleanup);

function props(overrides = {}) {
  return {
    authTier: 'premium',
    authUserId: 'owner-a',
    authLoading: false,
    isElevated: false,
    migrateLocalCustomContentToCloud: vi.fn().mockResolvedValue({
      ok: true,
      status: 'applied',
      persistence: {
        state: 'confirmed',
        authority: 'no-local-content',
      },
    }),
    loadCustomContentFromCloud: vi.fn().mockResolvedValue(undefined),
    clearCloudCustomContent: vi.fn(),
    ...overrides,
  };
}

describe('custom-content cloud sync transition', () => {
  test('hydrates when the cutover found no local graph', async () => {
    const input = props();
    renderHook(() => useCustomContentCloudSync(input));

    await waitFor(() => {
      expect(input.loadCustomContentFromCloud).toHaveBeenCalledTimes(1);
    });
  });

  test('does not duplicate hydration already completed by an upload', async () => {
    const input = props({
      migrateLocalCustomContentToCloud: vi.fn().mockResolvedValue({
        ok: true,
        status: 'applied',
        persistence: {
          state: 'confirmed',
          authority: 'supabase-transaction',
        },
      }),
    });
    renderHook(() => useCustomContentCloudSync(input));

    await waitFor(() => {
      expect(input.migrateLocalCustomContentToCloud)
        .toHaveBeenCalledTimes(1);
    });
    expect(input.loadCustomContentFromCloud).not.toHaveBeenCalled();
  });

  test('keeps an ambiguous cutover error visible by skipping cloud hydration', async () => {
    const input = props({
      migrateLocalCustomContentToCloud: vi.fn().mockResolvedValue({
        ok: false,
        status: 'reconcile-required',
        reason: 'network_response_ambiguous',
      }),
    });
    renderHook(() => useCustomContentCloudSync(input));

    await waitFor(() => {
      expect(input.migrateLocalCustomContentToCloud)
        .toHaveBeenCalledTimes(1);
    });
    expect(input.loadCustomContentFromCloud).not.toHaveBeenCalled();
  });

  test('returns to the anonymous local projection on sign-out', () => {
    const input = props({
      authTier: 'anon',
      authUserId: null,
    });
    renderHook(() => useCustomContentCloudSync(input));

    expect(input.clearCloudCustomContent).toHaveBeenCalledTimes(1);
    expect(input.migrateLocalCustomContentToCloud).not.toHaveBeenCalled();
  });
});
