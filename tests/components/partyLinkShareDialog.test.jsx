/**
 * @vitest-environment jsdom
 *
 * tests/components/partyLinkShareDialog.test.jsx — the share dialog's party link
 * (SW-B7a).
 *
 * (e) The unlisted button's copy says what the link does: the same link for the
 *     settlement's life, its changes shown through it, Rotate for a new one.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
const storeState = { auth: { user: { id: 'u1' } }, savedSettlements: [], campaigns: [], updateSavedSettlement: vi.fn() };
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));
vi.mock('../../src/lib/gallery.js', () => ({
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
