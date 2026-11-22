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
    fetchGalleryMap: vi.fn(),
    fetchPublicGallery: vi.fn(),
    fetchPublicDossier: vi.fn(),
    fetchMyGallery: vi.fn(),
    fetchMyUnlistedDossiers: vi.fn(),
    fetchFeaturedGallery: vi.fn(),
    fetchUnlistedCampaign: vi.fn(),
    reportGalleryDossier: vi.fn(),
    toggleGalleryVote: vi.fn(),
    toggleGalleryReaction: vi.fn(),
  },
  saves: { list: vi.fn() },
  nav: { navigate: vi.fn() },
  storeState: {
    auth: { user: { id: 'user-1' } },
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: 'user-1',
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
  },
}));

vi.mock('../../src/lib/gallery.js', () => mocks.gallery);
vi.mock('../../src/lib/saves.js', () => ({ saves: mocks.saves }));
vi.mock('../../src/hooks/useRoute.js', () => mocks.nav);
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    selector => selector(mocks.storeState),
    { getState: () => mocks.storeState },
  ),
}));

import { useGalleryPageState } from '../../src/hooks/useGalleryPageState.js';

beforeEach(() => {
  vi.useFakeTimers();
  mocks.gallery.fetchPublicGallery.mockResolvedValue({ items: [], total: 0, hasMore: false });
  mocks.gallery.fetchPublicDossier.mockResolvedValue({ id: 'd-1', slug: 'fen-hollow' });
  mocks.gallery.fetchUnlistedCampaign.mockResolvedValue(null);
  mocks.gallery.fetchGalleryMap.mockResolvedValue(null);
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

describe('useGalleryPageState — card click does not double-fetch the dossier', () => {
  test('an initial hard deep link fetches its dossier exactly once', async () => {
    const dossier = { id: 'd-deep', slug: 'fen-hollow' };
    mocks.gallery.fetchPublicDossier.mockResolvedValue(dossier);

    const { result } = renderHook(() => useGalleryPageState('fen-hollow'));
    expect(result.current.activeSlug).toBe('fen-hollow');
    expect(result.current.dossierLoading).toBe(true);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(1);
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledWith('fen-hollow');
    expect(result.current.dossier).toEqual(dossier);
    expect(result.current.dossierLoading).toBe(false);
  });

  test('openDossier + the route-sync rerender fetch the dossier exactly once', async () => {
    // A card click calls openDossier(slug) (fetch #1) and navigate(); the real
    // router then re-renders Gallery with routeSlug=slug, re-running the
    // route-sync effect. Without an already-open guard that effect fires a
    // second identical fetchPublicDossier. Model that rerender here.
    const { result, rerender } = renderHook(
      ({ slug }) => useGalleryPageState(slug),
      { initialProps: { slug: null } },
    );

    await act(async () => { await result.current.openDossier('fen-hollow'); });
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(1);

    // navigate() landed us on /gallery/fen-hollow → routeSlug now mirrors it.
    rerender({ slug: 'fen-hollow' });
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    // Still one fetch — the open dossier was reused, not re-fetched.
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(1);
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledWith('fen-hollow');
  });

  test('a different routeSlug after open still fetches the new dossier', async () => {
    const { result, rerender } = renderHook(
      ({ slug }) => useGalleryPageState(slug),
      { initialProps: { slug: null } },
    );

    await act(async () => { await result.current.openDossier('fen-hollow'); });
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(1);

    // Deep-link / route change to a genuinely different slug must re-fetch.
    rerender({ slug: 'salt-marsh' });
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(2);
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenLastCalledWith('salt-marsh');
  });

  test('a stale success and finally cannot overwrite or unlock a newer request', async () => {
    let resolveA;
    let resolveB;
    const pendingA = new Promise(resolve => {
      resolveA = resolve;
    });
    const pendingB = new Promise(resolve => {
      resolveB = resolve;
    });
    mocks.gallery.fetchPublicDossier.mockImplementation(slug =>
      slug === 'fen-hollow' ? pendingA : pendingB);

    const { result } = renderHook(() => useGalleryPageState());
    let openA;
    let openB;
    act(() => {
      openA = result.current.openDossier('fen-hollow');
    });
    act(() => {
      openB = result.current.openDossier('salt-marsh');
    });

    await act(async () => {
      resolveA({ id: 'd-a', slug: 'fen-hollow' });
      await openA;
    });

    expect(result.current.activeSlug).toBe('salt-marsh');
    expect(result.current.dossier).toBeNull();
    expect(result.current.dossierLoading).toBe(true);

    const dossierB = { id: 'd-b', slug: 'salt-marsh' };
    await act(async () => {
      resolveB(dossierB);
      await openB;
    });

    expect(result.current.dossier).toEqual(dossierB);
    expect(result.current.dossierError).toBeNull();
    expect(result.current.dossierLoading).toBe(false);
  });

  test('a stale rejection and finally cannot error or unlock a newer request', async () => {
    let rejectA;
    let resolveB;
    const pendingA = new Promise((_resolve, reject) => {
      rejectA = reject;
    });
    const pendingB = new Promise(resolve => {
      resolveB = resolve;
    });
    mocks.gallery.fetchPublicDossier.mockImplementation(slug =>
      slug === 'fen-hollow' ? pendingA : pendingB);

    const { result } = renderHook(() => useGalleryPageState());
    let openA;
    let openB;
    act(() => {
      openA = result.current.openDossier('fen-hollow');
    });
    act(() => {
      openB = result.current.openDossier('salt-marsh');
    });

    await act(async () => {
      rejectA(new Error('stale network failure'));
      await openA;
    });

    expect(result.current.dossierError).toBeNull();
    expect(result.current.dossierLoading).toBe(true);

    const dossierB = { id: 'd-b', slug: 'salt-marsh' };
    await act(async () => {
      resolveB(dossierB);
      await openB;
    });

    expect(result.current.dossier).toEqual(dossierB);
    expect(result.current.dossierError).toBeNull();
    expect(result.current.dossierLoading).toBe(false);
  });
});

// LINEAGE NOTE (master merge W6): the `map share deep-link is kind-aware`
// describe block (mapDetail / fetchGalleryMap fallback) was removed. It pins the
// fenced master-only MapGalleryDetail viewer — openDossier's fetchGalleryMap
// fallback and the `mapDetail` state are master architecture not carried onto
// this lineage. The debounce + double-fetch-guard fixes above ARE ported.
