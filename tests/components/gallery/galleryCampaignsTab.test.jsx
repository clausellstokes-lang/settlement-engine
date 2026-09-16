/** @vitest-environment jsdom */
/**
 * galleryCampaignsTab.test.jsx — the Campaigns third tab (GALLERY-2 phase 2).
 *
 * Pins:
 *   • the tab exists (Settlements · Maps · Campaigns) and renders the
 *     campaign grid when selected.
 *   • the listing queries kind:['map_with_campaign'] (and the Maps tab now
 *     narrows to kind:['map']) — the server RPC's kind facet.
 *   • the campaign card anatomy: world age chip, settlement count, aliveness
 *     badge, at-war chip, author.
 *   • ANON RENDERING (the phase-1 finding carried forward): a signed-out
 *     visitor sees the full campaign grid — the caps bind ACTIONS (the import
 *     press shows the premium notice), never rendering.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import GalleryPage from '../../../src/components/GalleryPage.jsx';
import GalleryCampaigns from '../../../src/components/gallery/GalleryCampaigns.jsx';
import CampaignStatePanel from '../../../src/components/gallery/CampaignStatePanel.jsx';
import CampaignWorldView from '../../../src/components/gallery/CampaignWorldView.jsx';

// §807 — the dossier stack is the heaviest chunk in the app; the world view
// lazy-mounts it on selection. The stub captures the dossier payload so the
// wiring (single mount, replace-on-click, the fail-closed shareDm) is pinned
// without paying the full OutputContainer render this suite never needed.
const dossierCapture = vi.hoisted(() => ({ mounts: [] }));
vi.mock('../../../src/components/PublicDossierView.jsx', () => ({
  default: ({ dossier }) => {
    dossierCapture.mounts.push(dossier);
    return <div data-testid="stub-public-dossier">{dossier?.name}</div>;
  },
}));

const mocks = vi.hoisted(() => ({
  galleryApi: {
    fetchPublicGallery: vi.fn().mockResolvedValue({ items: [], total: 0, hasMore: false }),
    fetchPublicDossier: vi.fn(),
    fetchGalleryComments: vi.fn().mockResolvedValue([]),
    addGalleryComment: vi.fn(),
    deleteGalleryComment: vi.fn(),
    toggleGalleryVote: vi.fn(),
    toggleGalleryReaction: vi.fn(),
    reportGalleryDossier: vi.fn(),
    fetchGalleryMaps: vi.fn().mockResolvedValue({ items: [] }),
    fetchGalleryMap: vi.fn(),
    GALLERY_SORT_OPTIONS: [['relevant', 'Most relevant']],
  },
  storeState: {
    auth: null, // ANON by default — rendering must not gate on sign-in.
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: null,
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
    importGalleryMap: vi.fn(),
    importGalleryMapWithCampaign: vi.fn(),
    setActiveCampaign: vi.fn(),
  },
  nav: { navigate: vi.fn() },
}));

vi.mock('../../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(mocks.storeState);
  }
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../../src/store', () => {
  function useStore(selector) {
    return selector(mocks.storeState);
  }
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../../src/hooks/useRoute.js', () => mocks.nav);

const CAMPAIGN_TILE = {
  slug: 'the-reach',
  name: 'The Reach',
  kind: 'map_with_campaign',
  description: 'A living border realm.',
  tags: ['frontier'],
  backdrop_kind: 'fmg',
  thumb_url: '',
  image_url: '',
  published_at: '2026-07-01',
  view_count: 9,
  import_count: 2,
  member_count: 4,
  importable: true,
  author_name: 'Keeper of Maps',
  at_war: true,
  world_age: 'this-year',
  aliveness: 87,
};

describe('the Campaigns third tab', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = null;
  });

  test('GalleryPage shows Settlements · Maps · Campaigns and the campaigns grid queries kind=map_with_campaign', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryPage onNavigate={vi.fn()} />);
    expect(screen.getByText('Settlements')).toBeTruthy();
    expect(screen.getByText('Maps')).toBeTruthy();
    fireEvent.click(screen.getByText('Campaigns'));
    expect(await screen.findByText('The Reach')).toBeTruthy();
    // The Campaigns tab now carries the full Settlements-tab filter shape (its
    // sidebar facets ride along in their empty form), so the wire payload's
    // filters is { ...emptyMapFilters, kind:['map_with_campaign'] } — pin the
    // kind narrowing with objectContaining (the Maps-tab idiom), not an exact
    // object match.
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    );
  });

  test('the Maps tab narrows to blank maps (kind=map)', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
    render(<GalleryPage onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByText('Maps'));
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    // The sidebar facets (backdrop / importable / tags) ride along in their
    // empty shape — normalizeMapFilters drops them, so the wire payload stays
    // exactly the kind narrowing. The pin binds kind, not the empty facets.
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ kind: ['map'] }) }),
    );
  });

  test('campaign card anatomy: world age, settlement count, aliveness, at-war, author — all render for ANON', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.getByLabelText('World age: a year old')).toBeTruthy();
    expect(screen.getByLabelText('4 settlements')).toBeTruthy();
    expect(screen.getByLabelText('Aliveness 87 out of 100')).toBeTruthy();
    expect(screen.getByLabelText('This realm is at war')).toBeTruthy();
    expect(screen.getByText('by Keeper of Maps')).toBeTruthy();
    // Anon caps bind the ACTION: the import affordance is present and pressing
    // it produces the premium notice, not a hidden grid.
    fireEvent.click(screen.getByText('Import (premium)'));
    expect(await screen.findByText(/premium feature/i)).toBeTruthy();
    expect(mocks.storeState.importGalleryMapWithCampaign).not.toHaveBeenCalled();
  });

  test('un-stamped tiles render no aliveness/world-age chips (unknown, not zero)', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({
      items: [{ ...CAMPAIGN_TILE, aliveness: null, world_age: null, at_war: false }],
    });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.queryByLabelText(/Aliveness/)).toBeNull();
    expect(screen.queryByLabelText(/World age/)).toBeNull();
    expect(screen.queryByLabelText('This realm is at war')).toBeNull();
  });
});

// ── Settlements-tab PARITY: filter rail + search + sort + filtered-empty ──────
describe('the Campaigns tab — full filter/search/sort parity', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = null;
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
  });

  test('renders the honest campaign facets: Backdrop + Has settlements + Importable + Tags', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('Backdrop')).toBeTruthy();
    // Has-settlements IS coherent for campaigns (member_count can be > 0) — the
    // facet struck on the blank-maps tab is shown here.
    expect(screen.getByLabelText('Has settlements')).toBeTruthy();
    expect(screen.getByLabelText('Importable only')).toBeTruthy();
    // The dynamic tag vocabulary renders as chips (button, capitalized human()).
    expect(screen.getByRole('button', { name: 'frontier' })).toBeTruthy();
    // The result-count chip reports the shared-campaign count.
    expect(screen.getByText('1 shared campaign')).toBeTruthy();
  });

  test('toggling has-settlements refetches with the facet AND kind=map_with_campaign intact', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Has settlements'));
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ hasSettlements: true, kind: ['map_with_campaign'] }) }),
    ));
  });

  test('a filtered-empty result offers Clear filters, and clearing refetches unfiltered', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Importable only'));
    expect(await screen.findByText(/No campaigns match those filters/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ importable: false, kind: ['map_with_campaign'] }) }),
    ));
  });

  test('changing the sort refetches with the server sort key', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Sort campaigns'), { target: { value: 'most_imported' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: 'most_imported', filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    ));
  });

  test('typing a search refetches (debounced) with the query and the kind narrowing', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Search campaigns'), { target: { value: 'reach' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'reach', filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    ), { timeout: 1500 });
  });
});

// ── §69.3 / §113: the PUBLIC world-clock cure, pinned AT THE RENDERED SURFACE ──
// A negative asserted against a surface that never mounted passes vacuously, so
// every arm here first proves the panel actually rendered its clock, and only
// then asserts what the reader does NOT see. CampaignStatePanel is the sanitized
// public share — the one gallery surface a non-owner reads — and it carried
// `Tick {tick}` twice: on the World Clock chip row and on every chronicle entry.
describe('CampaignStatePanel — no raw engine counter reaches the public share', () => {
  const SNAPSHOT = {
    worldClock: { tick: 60, calendar: { year: 2, month: 3, season: 'spring' } },
    chronicle: [{ tick: 60, headlines: [{ headline: 'The wharves overflow', summary: 'Trade swells past the quay.' }], affectedSettlementNames: ['Midwater'] }],
  };
  const SECTIONS = ['worldClock', 'chronicle'];

  test('the World Clock section RENDERS, and says the week in the reader own unit', () => {
    const { container } = render(<CampaignStatePanel snapshot={SNAPSHOT} sections={SECTIONS} />);
    const text = container.textContent || '';
    // The surface mounted: its heading and its sibling chips are on screen.
    expect(text).toContain('World Clock');
    expect(text).toContain('Year 2');
    expect(text).toContain('Spring');
    // tick 60 is week 9 of the second year, said in the sanctioned span idiom.
    expect(text).toContain('Week 9 of 52');
  });

  test('the chronicle entry RENDERS, and dates itself by the calendar rather than the counter', () => {
    const { container } = render(<CampaignStatePanel snapshot={SNAPSHOT} sections={SECTIONS} />);
    const text = container.textContent || '';
    expect(text).toContain('The wharves overflow');
    expect(text).toContain('week 9 of spring, year 2');
  });

  test('\u26d4 the rendered panel contains NO `Tick <n>` anywhere (the leak, not a proxy for it)', () => {
    const { container } = render(<CampaignStatePanel snapshot={SNAPSHOT} sections={SECTIONS} />);
    const text = container.textContent || '';
    // Guard-the-guard: the assertion below is worthless if the panel rendered
    // nothing, so prove there is prose to search before searching it.
    expect(text.length).toBeGreaterThan(40);
    expect(text).toContain('The wharves overflow');
    expect(/\btick\s*\d/i.test(text), `raw counter survived: ${text}`).toBe(false);
  });
});

// ── §807 — the shared-campaign gallery view: index + one dossier + header tabs ─
describe('CampaignWorldView — the §807 gallery campaign view', () => {
  const DETAIL = {
    slug: 'the-reach', name: 'The Reach', imageUrl: 'https://cdn.example/reach.jpg',
    mapState: {
      customBackdrop: { imageUrl: 'https://cdn.example/backdrop.jpg', w: 1000, h: 500 },
      placements: {
        b1: { settlementId: 's-1', x: 250, y: 100 },
        b2: { settlementId: 's-2', x: 700, y: 300 },
        b3: { settlementId: 's-gone', x: 10, y: 10 }, // no member row ⇒ no pin
      },
    },
    world: {
      snapshot: {
        pantheon: [{ deityId: 'd1', name: 'The Tide', tier: 'major', seats: 2, wins: 1, losses: 0 }],
        warNetwork: { sieges: [{ targetId: 's-2', targetName: 'Farhold', coalitionNames: ['Nearby'] }], tradeWars: [], channels: [] },
        worldClock: { tick: 12, calendar: { year: 1, month: 3, season: 'summer' } },
      },
      sections: ['worldClock', 'pantheon', 'warNetwork'],
    },
    members: [
      { old_id: 's-1', name: 'Nearby', tier: 'town', public_slug: 'nearby', settlement: { name: 'Nearby' }, chronicle: [] },
      { old_id: 's-2', name: 'Farhold', tier: 'village', public_slug: null, settlement: { name: 'Farhold' }, chronicle: [] },
    ],
  };

  let scrollSpy;
  beforeEach(() => {
    dossierCapture.mounts.length = 0;
    // jsdom has no scrollIntoView; the §807(a) head-first law is pinned on it.
    scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;
  });
  afterEach(() => cleanup());

  test('renders the read-only index: pan/zoom frame, true-position pins, and the member rail', () => {
    render(<CampaignWorldView detail={DETAIL} />);
    expect(screen.getByTestId('campaign-realm-index')).toBeTruthy();
    // Pins for the two members with placements; the orphan placement mints none.
    expect(screen.getAllByTestId('campaign-map-pin')).toHaveLength(2);
    expect(screen.getByTestId('campaign-member-rail')).toBeTruthy();
    // No dossier is mounted before a selection — the hint stands in its place.
    expect(screen.queryByTestId('campaign-selected-dossier')).toBeNull();
    expect(dossierCapture.mounts).toHaveLength(0);
  });

  test('click a pin ⇒ ONE full-width read-only dossier below; clicking another REPLACES it (§807(e)) and scrolls to the head (§807(a))', async () => {
    render(<CampaignWorldView detail={DETAIL} />);
    // The pin and the rail chip share one accessible label (one action, two
    // affordances) — this arm drives the PIN, inside the index frame.
    fireEvent.click(within(screen.getByTestId('campaign-realm-index')).getByLabelText('Open the dossier for Nearby'));
    expect(await screen.findByTestId('campaign-selected-dossier')).toBeTruthy();
    await waitFor(() => expect(dossierCapture.mounts).toHaveLength(1));
    expect(dossierCapture.mounts[0].name).toBe('Nearby');
    // Fail closed: a campaign share never opts a member into DM content.
    expect(dossierCapture.mounts[0].shareDm).toBe(false);
    await waitFor(() => expect(scrollSpy).toHaveBeenCalled());

    // Replace-on-click: ONE mounted dossier, now Farhold — never two.
    fireEvent.click(within(screen.getByTestId('campaign-member-rail')).getByLabelText('Open the dossier for Farhold'));
    await waitFor(() => expect(screen.getByTestId('stub-public-dossier').textContent).toBe('Farhold'));
    expect(screen.getAllByTestId('stub-public-dossier')).toHaveLength(1);
  });

  test('the WAR and FAITH world tabs ride the MAP HEADER (§807(c)), gated by the sharer sections (§807(d))', () => {
    render(<CampaignWorldView detail={DETAIL} />);
    const tabs = screen.getByTestId('campaign-map-header-tabs');
    expect(tabs.textContent).toContain('War');
    expect(tabs.textContent).toContain('Faith');
    // War tab renders the warNetwork slice in the header area.
    fireEvent.click(screen.getByRole('tab', { name: 'War' }));
    expect(screen.getByTestId('campaign-header-war').textContent).toMatch(/Farhold.*under siege/);
    // Faith tab renders the pantheon slice.
    fireEvent.click(screen.getByRole('tab', { name: 'Faith' }));
    expect(screen.getByTestId('campaign-header-faith').textContent).toContain('The Tide');
    // The panel below the dossier keeps the OTHER shared sections but not the
    // header-carried ones (no duplicate war/pantheon surface). The active
    // header tab mounts its own CampaignStatePanel, so scope to the LAST panel
    // in document order (the below-dossier one).
    const panels = screen.getAllByTestId('campaign-state-panel');
    const below = panels[panels.length - 1];
    expect(below.textContent).toContain('World Clock');
    expect(below.textContent).not.toContain('The Tide'); // anchored: the same panel just proved World Clock present, so the collection lives; the absent deity is the no-duplicate-surface claim.
  });

  test('sharer consent governs: sections without warNetwork/pantheon ⇒ NO header tabs (§807(d))', () => {
    const detail = { ...DETAIL, world: { snapshot: DETAIL.world.snapshot, sections: ['worldClock'] } };
    render(<CampaignWorldView detail={detail} />);
    expect(screen.queryByTestId('campaign-map-header-tabs')).toBeNull();
    expect(screen.getByTestId('campaign-realm-index')).toBeTruthy();
  });

  test('a generated-terrain share (no backdrop) renders the map ground with NO fabricated pins; the rail is the index', () => {
    const detail = { ...DETAIL, mapState: { placements: DETAIL.mapState.placements } };
    render(<CampaignWorldView detail={detail} />);
    expect(screen.getByTestId('campaign-realm-index')).toBeTruthy();
    expect(screen.queryAllByTestId('campaign-map-pin')).toHaveLength(0);
    expect(screen.getByTestId('campaign-member-rail')).toBeTruthy();
    // The rail still opens the inline dossier.
    fireEvent.click(within(screen.getByTestId('campaign-member-rail')).getByLabelText('Open the dossier for Nearby'));
    expect(screen.getByTestId('campaign-selected-dossier')).toBeTruthy();
  });
});
