/**
 * @vitest-environment jsdom
 *
 * tests/hooks/partyLinkRedirect.test.jsx — THE OWNER'S REDIRECT (SW-B7a row (f)).
 *
 * The owner's word (2026-11-09): "If the DM is logged in that owns the settlement
 * they simply go the the normal library view of it." A party link the signed-in
 * viewer owns routes to /settlements/<id> with the history entry REPLACED; the
 * server's is_owner first, the viewer's saves matched by id as the fallback, never
 * by slug; another user and a signed-out viewer get the players' page; signing in
 * from it re-resolves and redirects; the public listing page is not redirected.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';

const SLUG = 'u'.repeat(42);
const mocks = vi.hoisted(() => ({
  gallery: {
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
  storeState: {},
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

function viewer(userId, savedSettlements = []) {
  Object.assign(mocks.storeState, {
    auth: userId ? { user: { id: userId } } : { user: null },
    savedSettlements,
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: userId,
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
  });
}
const partyLink = (over = {}) => ({ id: 'set-1', slug: SLUG, name: 'Saltmoor', settlement: {}, unlisted: true, isOwner: false, ...over });
const libraryCalls = () => mocks.nav.navigate.mock.calls.filter(([view]) => view === 'settlements');

beforeEach(() => {
  for (const k of Object.keys(mocks.storeState)) delete mocks.storeState[k];
  mocks.gallery.fetchPublicGallery.mockResolvedValue({ items: [], total: 0, hasMore: false });
  mocks.gallery.fetchUnlistedCampaign.mockResolvedValue(null);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("the owner's redirect on a party link (row (f))", () => {
  test('owner → the library route, history replaced; the players\' page never renders', async () => {
    viewer('owner-1');
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink({ isOwner: true }));
    const { result } = renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(libraryCalls()).toHaveLength(1));
    expect(libraryCalls()[0]).toEqual(['settlements', { params: { id: 'set-1' }, replace: true }]);
    expect(result.current.dossier).toBeNull();
  });

  test('another signed-in user → the players\' page', async () => {
    viewer('other-1', [{ id: 'some-other-town' }]);
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink());
    const { result } = renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(result.current.dossier?.id).toBe('set-1'));
    expect(libraryCalls()).toHaveLength(0);
  });

  test('signed out → the players\' page', async () => {
    viewer(null);
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink());
    const { result } = renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(result.current.dossier?.id).toBe('set-1'));
    expect(libraryCalls()).toHaveLength(0);
  });

  test('the fallback: the viewer\'s save matched by id routes the owner home', async () => {
    viewer('owner-1', [{ id: 'set-1' }]);
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink());
    renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(libraryCalls()).toHaveLength(1));
    expect(libraryCalls()[0]).toEqual(['settlements', { params: { id: 'set-1' }, replace: true }]);
  });

  test('never by slug: a save whose public_slug equals the link does not redirect', async () => {
    viewer('other-1', [{ id: 'another-town', public_slug: SLUG, unlisted_slug: SLUG }]);
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink());
    const { result } = renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(result.current.dossier?.id).toBe('set-1'));
    expect(libraryCalls()).toHaveLength(0);
  });

  test('the public listing page is not redirected, even for its owner', async () => {
    viewer('owner-1', [{ id: 'set-1', public_slug: 'highkeep01' }]);
    mocks.gallery.fetchPublicDossier.mockResolvedValue({ id: 'set-1', slug: 'highkeep01', name: 'Highkeep', settlement: {} });
    const { result } = renderHook(() => useGalleryPageState('highkeep01'));
    await waitFor(() => expect(result.current.dossier?.id).toBe('set-1'));
    expect(libraryCalls()).toHaveLength(0);
  });

  test('signing in from the players\' page re-resolves the slug and redirects the owner', async () => {
    viewer(null);
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink());
    const { result, rerender } = renderHook(() => useGalleryPageState(SLUG));
    await waitFor(() => expect(result.current.dossier?.id).toBe('set-1'));
    expect(libraryCalls()).toHaveLength(0);

    viewer('owner-1');
    mocks.gallery.fetchPublicDossier.mockResolvedValue(partyLink({ isOwner: true }));
    rerender();
    await waitFor(() => expect(libraryCalls()).toHaveLength(1));
    expect(mocks.gallery.fetchPublicDossier).toHaveBeenCalledTimes(2);
    expect(libraryCalls()[0][1]).toEqual({ params: { id: 'set-1' }, replace: true });
  });
});
