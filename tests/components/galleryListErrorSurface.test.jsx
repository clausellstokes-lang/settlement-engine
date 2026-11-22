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
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

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

/**
 * One listing row. `totalCount` is the server's own total, which is what
 * fetchPublicGalleryViaRpc turns into `hasMore` — so a single row with a total
 * of 48 offers "Load more" without fabricating 24 tiles.
 */
function listingRow(name, totalCount = 1) {
  return {
    data: [{ id: name, public_slug: name.toLowerCase(), name, tier: 'town', total_count: totalCount }],
    error: null,
  };
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

describe('the gallery list surface — the error state is recoverable and never stale', () => {
  test('a successful page retires the error line a failed page put up', async () => {
    // loadMore's try never cleared `listError`, so ONE failed page left the
    // house line on screen for the rest of the session: every later page could
    // succeed and the reader was still told the gallery could not be loaded.
    mocks.supa.rpc
      .mockResolvedValueOnce(listingRow('Alpha', 48))
      .mockResolvedValueOnce({ data: null, error: { message: 'second page exploded' } })
      .mockResolvedValueOnce(listingRow('Beta', 48));

    render(<GalleryPage onNavigate={() => {}} />);
    expect(await screen.findByText('Alpha')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await findHouseErrorLine()).toBeTruthy();
    // A failed NEXT page keeps the rows it already has: they belong to this
    // same query and are still true. Only a failed query change clears them.
    expect(screen.getByText('Alpha')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByText('Beta')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('a failed query change leaves no rows or count from the query before it', async () => {
    mocks.supa.rpc
      .mockResolvedValueOnce(listingRow('Alpha'))
      .mockResolvedValueOnce({ data: null, error: { message: 'facet query failed' } });

    render(<GalleryPage onNavigate={() => {}} />);
    expect(await screen.findByText('Alpha')).toBeTruthy();
    expect(screen.getByText('1 public settlement')).toBeTruthy();

    // Applying a tier facet is a NEW query — and it fails.
    fireEvent.click(screen.getByRole('button', { name: 'Town' }));
    expect(await findHouseErrorLine()).toBeTruthy();

    // The previous query's tile and count must not stand under the error line
    // as though the facet had been applied and returned them.
    expect(screen.queryByText('Alpha')).toBeNull();
    // ⛔ AND THE COUNT MUST NOT BECOME "0 public settlements". An earlier draft
    // of this test asserted that zero, which blessed the very claim the error
    // work exists to remove: the topbar's always-mounted role=status strip is
    // the one region a screen reader is listening to, and a failed read
    // announcing "0 public settlements" into it says the gallery is EMPTY.
    // The strip is present and says NOTHING; the alert says what happened.
    const countStrip = screen.getByRole('status');
    expect(countStrip.textContent).toBe('');
    expect(screen.queryByText('0 public settlements')).toBeNull();
    expect(screen.queryByText('1 public settlement')).toBeNull();
  });

  test('Try again re-runs the failed query and clears the error line', async () => {
    mocks.supa.rpc
      .mockResolvedValueOnce({ data: null, error: { message: 'first attempt failed' } })
      .mockResolvedValueOnce(listingRow('Alpha'));

    render(<GalleryPage onNavigate={() => {}} />);
    const alert = await findHouseErrorLine();

    // The control is the house's own word, and it sits BESIDE the alert so the
    // alert's whole text stays the house sentence (checked in findHouseErrorLine).
    expect(alert.textContent).toBe(en.gallery.loadError);
    fireEvent.click(screen.getByRole('button', { name: en.gallery.retry }));

    expect(await screen.findByText('Alpha')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(mocks.supa.rpc).toHaveBeenCalledTimes(2);
  });

  test('a repeat failure is a fresh alert, not an unchanged one nobody hears', async () => {
    // `role="alert"` announces on insertion or on a text change. A second
    // identical failure re-rendering the SAME node with the SAME sentence is
    // announced to nobody, and the page reads as frozen. Clearing the error for
    // the duration of the attempt makes the next failure a fresh insertion.
    let releaseSecond;
    mocks.supa.rpc
      .mockResolvedValueOnce({ data: null, error: { message: 'first failure' } })
      .mockImplementationOnce(() => new Promise(resolve => { releaseSecond = resolve; }));

    render(<GalleryPage onNavigate={() => {}} />);
    expect(await findHouseErrorLine()).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: en.gallery.retry }));
    await waitFor(() => { expect(screen.queryByRole('alert')).toBeNull(); });

    releaseSecond({ data: null, error: { message: 'second failure' } });
    expect(await findHouseErrorLine()).toBeTruthy();
  });

  test('Try again never carries the native disabled attribute, and hands focus on', async () => {
    mocks.supa.rpc
      .mockResolvedValueOnce({ data: null, error: { message: 'first attempt failed' } })
      .mockResolvedValueOnce(listingRow('Alpha'));

    render(<GalleryPage onNavigate={() => {}} />);
    await findHouseErrorLine();

    // Button derives the NATIVE disabled attribute from `busy` as well as from
    // `disabled`, and a browser blurs a control the moment it becomes disabled.
    const retry = screen.getByRole('button', { name: en.gallery.retry });
    expect(retry.hasAttribute('disabled')).toBe(false);
    expect(retry.getAttribute('aria-disabled')).toBe('false');

    // The control unmounts with the error line, so focus must be handed on
    // deliberately rather than falling to <body>.
    fireEvent.click(retry);
    await waitFor(() => { expect(document.activeElement).toBe(screen.getByRole('status')); });
    expect(await screen.findByText('Alpha')).toBeTruthy();
    expect(document.body.contains(retry)).toBe(false);
  });

  test('after a failed page, Try again resumes THAT page and keeps what was read', async () => {
    // Re-running the query from the top would throw away four pages of reading
    // to recover the fifth. `page` cannot tell the two failures apart — loadMore
    // leaves it where it was — so the hook records which load failed.
    mocks.supa.rpc
      .mockResolvedValueOnce(listingRow('Alpha', 48))
      .mockResolvedValueOnce({ data: null, error: { message: 'page 2 failed' } })
      .mockResolvedValueOnce(listingRow('Beta', 48));

    render(<GalleryPage onNavigate={() => {}} />);
    expect(await screen.findByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await findHouseErrorLine()).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: en.gallery.retry }));
    expect(await screen.findByText('Beta')).toBeTruthy();
    // The page already read is still on screen, and the retry asked for the
    // FAILED page — not page 0.
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(mocks.supa.rpc).toHaveBeenLastCalledWith(
      'list_gallery_dossiers',
      expect.objectContaining({ page_number: 1 }),
    );
  });
});
