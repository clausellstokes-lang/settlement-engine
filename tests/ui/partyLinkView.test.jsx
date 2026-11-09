/** @vitest-environment jsdom */
/**
 * tests/ui/partyLinkView.test.jsx — SW-B7 row (b), THE PLAYERS' PAGE.
 *
 * The owner's word (2026-11-09): the party link's page carries none of the
 * gallery's vote and comment chrome. A `dossier.unlisted` dossier renders
 * PartyLinkView: the title, the author's name, the dossier and a quiet Report —
 * and NO votes, comments, reactions, view count, share-to-social, Import or
 * "more by this creator". The listed dossier's page keeps its chrome (control).
 * Heavy children are stubbed with markers so absence is observable.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/seoDossier.js', () => ({ setSharedDossierMeta: vi.fn() }));
vi.mock('../../src/components/PublicDossierView.jsx', () => ({ default: () => <div data-testid="dossier-body" /> }));
vi.mock('../../src/components/gallery/GalleryComments.jsx', () => ({ default: () => <div data-testid="comments" /> }));
vi.mock('../../src/components/gallery/GalleryMoreByCreator.jsx', () => ({ default: () => <div data-testid="more-by-creator" /> }));
vi.mock('../../src/components/gallery/GalleryImage.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReactionChips.jsx', () => ({ default: () => <div data-testid="reactions" /> }));
vi.mock('../../src/components/gallery/GalleryReportDialog.jsx', () => ({ default: () => <button type="button">Report</button> }));
vi.mock('../../src/components/gallery/VoteButton.jsx', () => ({ default: () => <div data-testid="vote" /> }));
vi.mock('../../src/components/gallery/AlivenessBadge.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/ShareToGallery.jsx', () => ({ default: () => <div data-testid="share-to-gallery" /> }));

const state = { savedSettlements: [] };
vi.mock('../../src/store/index.js', () => {
  function useStore(sel) { return sel(state); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => state;
  return { useStore };
});

const listed = {
  id: 'd1', slug: 'pub-slug', name: 'Saltmoor',
  settlement: { name: 'Saltmoor', population: 500 },
  tags: [], importable: true, netVotes: 3, viewCount: 41, commentCount: 2,
  voteState: {}, reactionState: {}, moreByCreator: [],
};
const partyLink = { ...listed, slug: 'u'.repeat(42), unlisted: true, authorName: 'The Owner' };

afterEach(() => { cleanup(); state.savedSettlements = []; });

async function renderDetail(dossier) {
  const GalleryDetail = (await import('../../src/components/gallery/GalleryDetail.jsx')).default;
  render(<GalleryDetail dossier={dossier} auth={{ user: { id: 'u1' }, tier: 'premium' }}
    onNavigate={vi.fn()} onVote={vi.fn()} onOpen={vi.fn()} onReport={vi.fn()} />);
}

describe("the players' page (party link) carries no social chrome", () => {
  test('keeps the title, the author, the dossier and a Report link', async () => {
    await renderDetail(partyLink);
    expect(await screen.findByTestId('party-link-view')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Saltmoor' })).toBeTruthy();
    expect(screen.getByText(/Shared with the players by The Owner/)).toBeTruthy();
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Report' })).toBeTruthy();
  });

  test('renders no votes, comments, reactions, views, share, Import or more-by-creator', async () => {
    await renderDetail(partyLink);
    await screen.findByTestId('party-link-view');
    for (const id of ['vote', 'comments', 'reactions', 'more-by-creator', 'share-to-gallery']) {
      expect(screen.queryByTestId(id), id).toBeNull();
    }
    expect(screen.queryByText(/\bviews?\b/i)).toBeNull();
    expect(screen.queryByText(/\bcomments?\b/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /^share$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /import/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /forge your own/i })).toBeNull();
  });

  test('control: the listed dossier page keeps its gallery chrome', async () => {
    await renderDetail(listed);
    expect(screen.queryByTestId('party-link-view')).toBeNull();
    expect(screen.getByTestId('vote')).toBeTruthy();
    expect(screen.getByTestId('comments')).toBeTruthy();
    expect(screen.getByTestId('reactions')).toBeTruthy();
    expect(screen.getByText(/41 views/)).toBeTruthy();
  });
});
