/**
 * @vitest-environment jsdom
 *
 * tests/components/partyLinkShareDialog.test.jsx — the share dialog's party link
 * (SW-B7a).
 *
 * (e) The unlisted button's copy says what the link does: the same link for the
 *     settlement's life, its changes shown through it, Rotate for a new one.
 * (g) Both at once: the link is independent of the listing — sharing a listed town
 *     by link keeps it listed, a listed-and-linked town shows both controls, and
 *     the copy says a town may be listed and linked at once.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
const storeState = { auth: { user: { id: 'u1' } }, savedSettlements: [], campaigns: [], updateSavedSettlement: vi.fn() };
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));
const gallery = vi.hoisted(() => ({}));
vi.mock('../../src/lib/gallery.js', () => Object.assign(gallery, {
  publishSettlement: vi.fn(async () => 'pub-slug'),
  unpublishSettlement: vi.fn(async () => {}),
  updateGalleryMetadata: vi.fn(async (_id, m) => m),
  shareSettlementUnlisted: vi.fn(async () => 'u'.repeat(42)),
  rotateSettlementUnlistedSlug: vi.fn(async () => 'r'.repeat(42)),
  revokeSettlementUnlisted: vi.fn(async () => {}),
}));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const SETTLEMENT = { name: 'Saltmoor', tier: 'town', npcs: [] };
const CANON = { phase: 'canon', eventLog: [], locks: {} };

async function renderDialog(props) {
  const { default: ShareToGallery } = await import('../../src/components/ShareToGallery.jsx');
  return render(<ShareToGallery saveId="s1" settlement={SETTLEMENT} campaignState={CANON} {...props} />);
}

describe('the share dialog — the party link (row (e))', () => {
  test('the unlisted button says the link lasts the settlement\'s life, shows its changes, and Rotate makes a new one', async () => {
    await renderDialog({ isPublic: false });
    expect(screen.getByRole('button', { name: /unlisted link/i }).getAttribute('title')).toMatch(/private link for your players/i);
    const copy = screen.getByText(/An unlisted link is for your players/);
    expect(copy.textContent).toMatch(/stays the same for as long as this settlement exists/);
    expect(copy.textContent).toMatch(/always shows your latest changes/);
    expect(copy.textContent).toMatch(/Rotate it to get a new link/);
  });
});

describe('the share dialog — listed and linked at once (row (g))', () => {
  test('share unlisted keeps the listing: the Public controls stand beside the party link', async () => {
    await renderDialog({ isPublic: true, publicSlug: 'highkeep01' });
    fireEvent.click(screen.getByRole('button', { name: /unlisted link/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /copy party link/i })).toBeTruthy());
    expect(gallery.shareSettlementUnlisted).toHaveBeenCalledWith('s1');
    expect(screen.getByText('Public')).toBeTruthy();
    expect(screen.getByRole('button', { name: /^copy link$/i })).toBeTruthy();
    const patch = storeState.updateSavedSettlement.mock.calls.at(-1)[1];
    expect(patch).toEqual({ visibility: 'unlisted', unlisted_slug: 'u'.repeat(42) });
    expect('is_public' in patch).toBe(false);
  });

  test('a listed-and-linked town shows both controls on mount; a private linked town keeps Export', async () => {
    await renderDialog({ isPublic: true, publicSlug: 'highkeep01', visibility: 'unlisted', unlistedSlug: 'u'.repeat(42) });
    expect(screen.getByText('Public')).toBeTruthy();
    expect(screen.getByRole('button', { name: /copy party link/i })).toBeTruthy();
    expect(screen.getByText(/listed in the gallery and have an unlisted link at the same time/)).toBeTruthy();
    cleanup();
    await renderDialog({ isPublic: false, unlistedSlug: 'u'.repeat(42) });
    expect(screen.getByRole('button', { name: /export to gallery/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /copy party link/i })).toBeTruthy();
    expect(screen.getByText(/listed in the gallery and have an unlisted link at the same time/)).toBeTruthy();
  });
});
