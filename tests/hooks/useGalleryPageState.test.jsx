/**
 * @vitest-environment jsdom
 *
 * tests/hooks/useGalleryPageState.test.jsx — search-debounce contract.
 *
 * The bug: every keystroke updated `search`, which fed `galleryQuery`, which
 * the fetch effect keyed on — so typing fired one fetchPublicGallery per
 * character. The fix debounces search → query (~250ms), while an empty search
 * (clear) still propagates immediately.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  gallery: {
    fetchPublicGallery: vi.fn(),
    fetchPublicDossier: vi.fn(),
    fetchMyGallery: vi.fn(),
    reportGalleryDossier: vi.fn(),
    toggleGalleryVote: vi.fn(),
  },
  saves: { list: vi.fn() },
  nav: { navigate: vi.fn() },
  storeState: {
    auth: { user: { id: 'user-1' } },
    savedSettlementsLoaded: true,
    setSavedSettlements: vi.fn(),
  },
}));

vi.mock('../../src/lib/gallery.js', () => mocks.gallery);
vi.mock('../../src/lib/saves.js', () => ({ saves: mocks.saves }));
vi.mock('../../src/hooks/useRoute.js', () => mocks.nav);
vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(mocks.storeState),
}));

import { useGalleryPageState } from '../../src/hooks/useGalleryPageState.js';

beforeEach(() => {
  vi.useFakeTimers();
  mocks.gallery.fetchPublicGallery.mockResolvedValue({ items: [], total: 0, hasMore: false });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('useGalleryPageState — search debounce', () => {
  test('typing several characters fires a single fetch after the debounce', () => {
    const { result } = renderHook(() => useGalleryPageState());

    // The initial mount fetch (empty query) runs once.
    expect(mocks.gallery.fetchPublicGallery).toHaveBeenCalledTimes(1);

    // Type "fen" one character at a time.
    act(() => { result.current.setSearch('f'); });
    act(() => { result.current.setSearch('fe'); });
    act(() => { result.current.setSearch('fen'); });

    // No new fetch yet — the debounce hasn't elapsed.
    expect(mocks.gallery.fetchPublicGallery).toHaveBeenCalledTimes(1);

    // After the debounce window, exactly one new fetch fires with the settled term.
    act(() => { vi.advanceTimersByTime(300); });
    expect(mocks.gallery.fetchPublicGallery).toHaveBeenCalledTimes(2);
    const lastCall = mocks.gallery.fetchPublicGallery.mock.calls.at(-1)[0];
    expect(lastCall.search).toBe('fen');
  });

  test('clearing the search propagates immediately (no debounce wait)', () => {
    const { result } = renderHook(() => useGalleryPageState());

    // Settle a non-empty search first.
    act(() => { result.current.setSearch('fen'); });
    act(() => { vi.advanceTimersByTime(300); });
    const afterTypeCount = mocks.gallery.fetchPublicGallery.mock.calls.length;

    // Clear to empty — should refetch right away without advancing timers.
    act(() => { result.current.setSearch(''); });
    expect(mocks.gallery.fetchPublicGallery.mock.calls.length).toBe(afterTypeCount + 1);
    const lastCall = mocks.gallery.fetchPublicGallery.mock.calls.at(-1)[0];
    expect(lastCall.search).toBe('');
  });
});
