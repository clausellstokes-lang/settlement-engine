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
  mocks.gallery.fetchPublicDossier.mockResolvedValue({ id: 'd-1', slug: 'fen-hollow' });
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
});

describe('useGalleryPageState — map share deep-link is kind-aware', () => {
  test('a ?slug that resolves to a map (dossier null, map row) surfaces the map detail, not a dead-end', async () => {
    // A published map's "Copy link" emits /gallery?slug=<mapSlug>. That slug is a
    // map, so the settlement dossier fetch returns null. Before the fix the link
    // dead-ended: dossier stayed null with no fallback. Now openDossier falls back
    // to fetchGalleryMap and surfaces the map row as mapDetail.
    mocks.gallery.fetchPublicDossier.mockResolvedValue(null);
    mocks.gallery.fetchGalleryMap.mockResolvedValue({ slug: 'tide-reach', name: 'Tide Reach', kind: 'map_only' });

    const { result } = renderHook(() => useGalleryPageState());

    await act(async () => { await result.current.openDossier('tide-reach'); });

    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledWith('tide-reach');
    expect(mocks.gallery.fetchGalleryMap).toHaveBeenCalledWith('tide-reach');
    expect(result.current.mapDetail).toEqual({ slug: 'tide-reach', name: 'Tide Reach', kind: 'map_only' });
    expect(result.current.dossier).toBeNull();
    // Not a dead-end: the settlement "not available" message is suppressed when a
    // map matched.
    expect(result.current.dossierError).toBeNull();
    expect(result.current.activeSlug).toBe('tide-reach');
  });

  test('a settlement slug resolves to the dossier and never reaches the map fallback', async () => {
    mocks.gallery.fetchPublicDossier.mockResolvedValue({ id: 'd-1', slug: 'fen-hollow' });

    const { result } = renderHook(() => useGalleryPageState());

    await act(async () => { await result.current.openDossier('fen-hollow'); });

    expect(result.current.dossier).toEqual({ id: 'd-1', slug: 'fen-hollow' });
    expect(result.current.mapDetail).toBeNull();
    // The map fetch is a fallback only — a live settlement never triggers it.
    expect(mocks.gallery.fetchGalleryMap).not.toHaveBeenCalled();
  });

  test('a slug that matches neither a dossier nor a map keeps the not-available message', async () => {
    mocks.gallery.fetchPublicDossier.mockResolvedValue(null);
    mocks.gallery.fetchGalleryMap.mockResolvedValue(null);

    const { result } = renderHook(() => useGalleryPageState());

    await act(async () => { await result.current.openDossier('ghost-slug'); });

    expect(result.current.dossier).toBeNull();
    expect(result.current.mapDetail).toBeNull();
    expect(result.current.dossierError).toBe('This settlement is not available.');
  });

  test('opening a settlement after a map clears the stale mapDetail', async () => {
    mocks.gallery.fetchPublicDossier.mockResolvedValueOnce(null);
    mocks.gallery.fetchGalleryMap.mockResolvedValueOnce({ slug: 'tide-reach', name: 'Tide Reach', kind: 'map_only' });

    const { result } = renderHook(() => useGalleryPageState());

    await act(async () => { await result.current.openDossier('tide-reach'); });
    expect(result.current.mapDetail).not.toBeNull();

    mocks.gallery.fetchPublicDossier.mockResolvedValueOnce({ id: 'd-2', slug: 'fen-hollow' });
    await act(async () => { await result.current.openDossier('fen-hollow'); });

    expect(result.current.dossier).toEqual({ id: 'd-2', slug: 'fen-hollow' });
    expect(result.current.mapDetail).toBeNull();
  });
});
