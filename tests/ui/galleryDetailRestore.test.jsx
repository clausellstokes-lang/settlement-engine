/** @vitest-environment jsdom */
/**
 * tests/ui/galleryDetailRestore.test.jsx — RESTORATION #13 pins.
 *
 * The composite dropped GalleryDetail's mobile DesktopOnlyGate listing-editor
 * deferral and the "forge your own" next-step CTA. These pin both back. The
 * realmArcSummary block is deliberately NOT restored — it was relocated to the
 * Campaigns tab (GalleryCampaigns renders d.realmArcSummary), not lost.
 * Heavy children are stubbed so the pin isolates GalleryDetail's own chrome.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

let mobile = false;
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mobile }));
vi.mock('../../src/lib/seoDossier.js', () => ({ setSharedDossierMeta: vi.fn() }));
vi.mock('../../src/components/PublicDossierView.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryComments.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryMoreByCreator.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryImage.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReactionChips.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReportDialog.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/VoteButton.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/AlivenessBadge.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/ShareToGallery.jsx', () => ({ default: () => <div data-testid="share-to-gallery" /> }));

const state = { savedSettlements: [] };
vi.mock('../../src/store/index.js', () => {
  function useStore(sel) { return sel(state); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => state;
  return { useStore };
});

const baseDossier = {
  id: 'd1', slug: 'x', name: 'Xtown',
  settlement: { name: 'Xtown', population: 500, config: { terrain: 'forest' } },
  tags: [], importable: false, netVotes: 0, viewCount: 0, commentCount: 0,
  voteState: {}, reactionState: {},
};

afterEach(() => { cleanup(); mobile = false; state.savedSettlements = []; });

describe('GalleryDetail — restored affordances (RESTORATION #13)', () => {
  test('offers a "forge your own" next-step when the viewer cannot import', async () => {
    mobile = false;
    const GalleryDetail = (await import('../../src/components/gallery/GalleryDetail.jsx')).default;
    render(<GalleryDetail dossier={baseDossier} auth={{ user: { id: 'u1' }, tier: 'anon' }} onNavigate={vi.fn()} onVote={vi.fn()} />);
    expect(screen.getByRole('button', { name: /forge your own/i })).toBeTruthy();
  });

  test('defers the owner listing editor to desktop on mobile', async () => {
    mobile = true;
    state.savedSettlements = [{ id: 's1', public_slug: 'x', is_public: true, settlement: { name: 'Xtown' } }];
    const GalleryDetail = (await import('../../src/components/gallery/GalleryDetail.jsx')).default;
    render(<GalleryDetail dossier={baseDossier} auth={{ user: { id: 'u1' }, tier: 'premium' }} onNavigate={vi.fn()} onVote={vi.fn()} onOpen={vi.fn()} />);

    expect(screen.getByText(/Edit your listing on a larger screen/i)).toBeTruthy();
    // The full authoring form is gated away on mobile.
    expect(screen.queryByTestId('share-to-gallery')).toBeNull();
  });
});
