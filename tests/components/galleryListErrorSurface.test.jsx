/** @vitest-environment jsdom */
/**
 * tests/components/galleryListErrorSurface.test.jsx — "no rows" is not "the read failed".
 *
 * THE DEFECT. Every gallery LIST fetcher swallowed its Supabase `{ error }` and
 * returned an empty shape: fetchPublicGalleryViaRpc returned null (laundered into
 * an empty result by fetchPublicGallery), fetchMyGallery and fetchFeaturedGallery
 * consoled and returned empties, and fetchMyUnlistedDossiers did the same in
 * galleryUnlisted.js. An unreachable database therefore rendered as an EMPTY
 * GALLERY — "0 public settlements · Be the first to publish one" — and the house
 * error line the copy register had carried all along was unreachable from the page.
 *
 * WHY THIS FILE RATHER THAN ANOTHER CASE IN galleryPage.test.jsx. That file mocks
 * src/lib/gallery.js — the very seam that was lying — so a swallowing fetcher is
 * invisible to it by construction: its rejection case proves only that GalleryList
 * draws the house line WHEN the hook is handed an error, never that a failed read
 * produces one. This file mocks SUPABASE instead and drives the real gallery.js,
 * the real useGalleryPageState and the real GalleryList, which is the whole path a
 * reader travels.
 *
 * THE FOUR FACTS the page must keep apart:
 *   an RPC that resolves `{ error }` → the house line, role=alert  (the swallowed case)
 *   a call that throws               → the house line, role=alert
 *   an UNCONFIGURED client           → the empty state — local mode legitimately has
 *                                      no gallery, and 'Supabase not configured' is a
 *                                      diagnostic that must never reach a reader
 *   a successful EMPTY listing       → the empty state
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { en } from '../../src/copy/en.js';

const mocks = vi.hoisted(() => ({
  // `configured` is read through a GETTER on the mocked module (below) so one
  // test can run local mode without re-importing the graph: a vi.resetModules()
  // round trip would hand this file a second React instance and break hooks.
  supa: { configured: true, rpc: vi.fn() },
  saves: { list: vi.fn() },
  nav: { navigate: vi.fn() },
  storeState: {
    auth: { user: { id: 'user-1' } },
    // The owner-card hydration seam is not what these tests exercise; start it
    // already hydrated so no save listing fires.
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: 'user-1',
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
  },
}));

// The ONE seam under test: the real gallery.js runs against this client.
vi.mock('../../src/lib/supabase.js', () => ({
  get isConfigured() { return mocks.supa.configured; },
  supabase: { rpc: (...args) => mocks.supa.rpc(...args), from: vi.fn() },
  setSessionPersistence: vi.fn(),
  hasActiveRecoveryFlow: () => false,
  consumeRecoveryFlow: () => null,
}));
vi.mock('../../src/lib/saves.js', () => ({ saves: mocks.saves }));
vi.mock('../../src/hooks/useRoute.js', () => mocks.nav);
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    selector => selector(mocks.storeState),
    { getState: () => mocks.storeState },
  ),
}));
// The detail reader drags the whole output renderer; the list is what is on trial.
vi.mock('../../src/components/PublicDossierView.jsx', () => ({
  default: () => <div data-testid="public-dossier" />,
}));

import GalleryPage from '../../src/components/GalleryPage.jsx';

let consoleError;

beforeEach(() => {
  // The hook consoles the raw diagnostic for whoever has to fix it. Silence it
  // for legible output, and assert on it where the diagnostic is the point.
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  mocks.supa.configured = true;
  mocks.supa.rpc.mockReset();
  // The empty-gallery invitation is dismissible through the sf:guidance store;
  // clear it so every test starts from an un-dismissed page.
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  consoleError.mockRestore();
  vi.clearAllMocks();
});

/** The house error line, exactly as the reader sees it. */
async function findHouseErrorLine() {
  const alert = await screen.findByRole('alert');
  expect(alert.textContent).toBe(en.gallery.loadError);
  return alert;
}

/** The empty-gallery panel, identified by its community-voice invitation. */
async function findEmptyGalleryPanel() {
  return screen.findByText(en.gallery.emptyBody);
}

describe('the gallery list surface — a failed read is not an empty gallery', () => {
  test('an RPC that resolves { error } draws the house error line, not the invitation', async () => {
    // THE SWALLOWED CASE, in the shape a real outage actually takes: supabase-js
    // resolves `{ data: null, error }` for a PostgREST/transport failure rather
    // than throwing, and that resolved error is what every list fetcher discarded.
    mocks.supa.rpc.mockResolvedValue({
      data: null,
      error: { message: 'FetchError: request to https://db.example/rest/v1/ failed, reason: ECONNREFUSED' },
    });

    render(<GalleryPage onNavigate={() => {}} />);

    const alert = await findHouseErrorLine();
    expect(alert).toBeTruthy();
    // The failure must not be told as an empty gallery: the alert IS on screen
    // (above), and the invitation that stood in for it is gone.
    expect(screen.queryByText(en.gallery.emptyBody)).toBeNull();
    // The raw transport string is a diagnostic (P10/P11): the console, never the page.
    expect(screen.queryByText(/ECONNREFUSED/)).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('[gallery] list fetch failed', expect.any(Error));
  });

  test('a list call that throws draws the same house error line', async () => {
    mocks.supa.rpc.mockRejectedValue(new Error('network down'));

    render(<GalleryPage onNavigate={() => {}} />);

    const alert = await findHouseErrorLine();
    expect(alert).toBeTruthy();
    expect(screen.queryByText(en.gallery.emptyBody)).toBeNull();
  });

  test('an UNCONFIGURED client is the empty gallery, and never reaches the network', async () => {
    // Local mode legitimately has no gallery. It reads as empty, not broken, and
    // the raw 'Supabase not configured' string never reaches a reader.
    mocks.supa.configured = false;

    render(<GalleryPage onNavigate={() => {}} />);

    const invitation = await findEmptyGalleryPanel();
    expect(invitation).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    // Also the canary for this file's own mock: an unconfigured client returns
    // before the RPC, so a call here would mean `isConfigured` was read once at
    // import time and this test is proving nothing.
    expect(mocks.supa.rpc).not.toHaveBeenCalled();
  });

  test('a successful EMPTY listing is the empty gallery, not an error', async () => {
    mocks.supa.rpc.mockResolvedValue({ data: [], error: null });

    render(<GalleryPage onNavigate={() => {}} />);

    const invitation = await findEmptyGalleryPanel();
    expect(invitation).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    // The zero rows are a real answer from the server, not a skipped call.
    expect(mocks.supa.rpc).toHaveBeenCalledWith(
      'list_gallery_dossiers',
      expect.objectContaining({ page_number: 0 }),
    );
  });
});
