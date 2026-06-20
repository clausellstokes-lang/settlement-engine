/** @vitest-environment jsdom */
/**
 * tests/components/galleryPageErrorBoundary.test.jsx — UI-resilience lane.
 *
 * Proves the FeatureErrorBoundary is actually WIRED INTO GalleryPage (not just
 * unit-tested in isolation). It mocks the page-state hook to a stable state and
 * replaces the gallery child panels with ones that THROW on render, then asserts
 * GalleryPage renders the recoverable fallback (role=alert) instead of letting
 * the throw escape to the app root. This test would FAIL if the boundary wrapper
 * were removed from GalleryPage (the throw would propagate out of render).
 *
 * Both the list view and the detail view (activeSlug set) are covered.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/errorReporter.js', () => ({ reportError: vi.fn() }));

// Child panels throw so any unwrapped render path would crash the page.
vi.mock('../../src/components/gallery/GalleryList.jsx', () => ({
  default: () => { throw new Error('list payload malformed'); },
}));
vi.mock('../../src/components/gallery/GalleryDetail.jsx', () => ({
  default: () => { throw new Error('dossier payload malformed'); },
}));
vi.mock('../../src/components/gallery/GalleryMaps.jsx', () => ({
  default: () => <div data-testid="gallery-maps" />,
}));

// Page-state hook: a mutable holder so each test sets activeSlug.
let pageState;
vi.mock('../../src/hooks/useGalleryPageState.js', () => ({
  EMPTY_GALLERY_FILTERS: {},
  useGalleryPageState: () => pageState,
}));

import GalleryPage from '../../src/components/GalleryPage.jsx';

function baseState(overrides = {}) {
  return {
    auth: { user: null },
    items: [], total: 0, hasMore: false,
    listLoading: false, listError: null,
    sort: 'new', setSort: () => {},
    search: '', setSearch: () => {},
    filters: {},
    activeSlug: null,
    dossier: null, dossierLoading: false, dossierError: null,
    voteBusyId: null, reportBusyId: null, importBusyId: null,
    importedSlugs: new Set(), actionError: null, actionNotice: null,
    loadMore: () => {}, openDossier: () => {}, backToList: () => {},
    toggleArrayFilter: () => {}, toggleBoolFilter: () => {}, clearFilters: () => {},
    voteOn: () => {}, reportOn: () => {}, importDossier: () => {},
    setDossierCommentCount: () => {},
    ...overrides,
  };
}

let errorSpy;
beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  errorSpy.mockRestore();
  cleanup();
});

describe('GalleryPage — feature error boundary wiring', () => {
  test('a throwing list panel degrades to the recoverable fallback', () => {
    pageState = baseState();
    render(<GalleryPage onNavigate={() => {}} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('The gallery couldn');
  });

  test('a throwing detail panel degrades to the recoverable fallback', () => {
    pageState = baseState({ activeSlug: 'hightower', dossier: { slug: 'hightower' } });
    render(<GalleryPage onNavigate={() => {}} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('gallery dossier couldn');
  });
});
