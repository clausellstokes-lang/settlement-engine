/** @vitest-environment jsdom */
/**
 * galleryPostingFree.test.jsx - POSTING TO THE GALLERY AND ITS VISIBILITY EDITOR ARE FREE.
 *
 * THE OWNER (2026-11-04, verbatim): "To clarify, posting to the gallery and the visibility
 * editor for gallery is not gated by paywall."
 *
 * Read with the launch access rule (X-54: every non-staff account is the free account until
 * launch) and the export word (X-53: exports outside the gallery say "Available at launch"):
 * sharing a saved dossier to the gallery, the unlisted party link, and the gallery's
 * visibility editing (the per-member overrides, "Curate for visitors", Snapshot or Live,
 * "Reveal DM-private content", "Allow others to import") are the FREE account's, in a closed
 * build, with no launch skin, no pill and no dialog. The one paid gallery feature is IMPORT
 * (migration 120; galleryImportSettlement.js), which is not on this surface.
 *
 * The sibling pin exportGalleryException.test.jsx runs with a PREMIUM non-staff account; this
 * one runs with a FREE account whose canExport answers false, so a tier read anywhere on the
 * surface would show. The last arm pins the stronger fact: the rendered tree is byte-identical
 * across the free and premium tiers.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within, fireEvent, cleanup, act } from '@testing-library/react';

const { storeRef, published } = vi.hoisted(() => ({ storeRef: { current: {} }, published: { ids: [] } }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  useStore.subscribe = () => () => {};
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/gallery.js', () => ({
  publishSettlement: vi.fn(async (id) => { published.ids.push(id); return 'slug'; }),
  unpublishSettlement: vi.fn(),
  updateGalleryMetadata: vi.fn(async (_id, metadata) => metadata),
  shareSettlementUnlisted: vi.fn(async () => 'unlisted-slug'),
  rotateSettlementUnlistedSlug: vi.fn(async () => 'unlisted-slug-2'),
  revokeSettlementUnlisted: vi.fn(async () => {}),
}));

import { purchasesOpen } from '../../src/lib/launchGate.js';
import ShareToGallery from '../../src/components/ShareToGallery.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); published.ids.length = 0; });

/** The free account: not staff, no export right — the only account before launch (X-54). */
const FREE = () => ({
  auth: { tier: 'free', user: { id: 'u1' } },
  isElevated: () => false, canExport: () => false,
  savedSettlements: [], campaigns: [], updateSavedSettlement: vi.fn(),
});
const PREMIUM = () => ({ ...FREE(), auth: { tier: 'premium', user: { id: 'u1' } }, canExport: () => true });

const SETTLEMENT = () => ({
  id: 's1', name: 'Stoneford',
  npcs: [
    { id: 'n1', name: 'Mara Hollin', role: 'Reeve' },
    { id: 'n2', name: 'Tobin Ash', role: 'Miller' },
  ],
});
const CANON = () => ({ phase: 'canon', eventLog: [], locks: {} });

/** Nothing on the surface wears the launch skin, the pill or the gate. */
function expectNoLaunchGate(container) {
  expect(container.querySelector('[data-skin="launch"]')).toBeNull();
  expect(container.querySelector('[data-launch-gate]')).toBeNull();
  expect((container.textContent || '').trim().length).toBeGreaterThan(0);
  expect(container.textContent).not.toContain('Available at launch'); // anchored: the line above proves the surface rendered text, so an empty render cannot pass
  expect(screen.queryByRole('dialog', { name: 'Available at launch' })).toBeNull();
}

describe('posting to the gallery, FREE account, before launch', () => {
  it('the build under test is closed (so the arms below are not vacuous)', () => {
    expect(purchasesOpen()).toBe(false);
  });

  it('"Export to gallery" and "Unlisted link" are enabled and ungated, and the export publishes', async () => {
    storeRef.current = FREE();
    const { container } = render(<ShareToGallery saveId="s1" campaignState={CANON()} settlement={SETTLEMENT()} />);
    const exportControl = screen.getByRole('button', { name: /Export to gallery/ });
    const unlistedControl = screen.getByRole('button', { name: /Unlisted link/ });
    for (const control of [exportControl, unlistedControl]) {
      expect(control.disabled).toBe(false);
      expect(control.getAttribute('data-skin')).toBeNull();
      expect(control.getAttribute('aria-describedby')).toBeNull();
      expect(control.closest('[data-launch-gate]')).toBeNull();
    }
    expectNoLaunchGate(container);
    fireEvent.click(exportControl);
    await act(async () => {});
    expect(screen.queryByRole('dialog', { name: 'Available at launch' })).toBeNull();
    expect(published.ids).toEqual(['s1']);
  });
});

describe('the gallery visibility editor, FREE account, before launch', () => {
  it('the settlement-level visibility toggles and the per-member overrides work, ungated', () => {
    storeRef.current = FREE();
    const { container } = render(<ShareToGallery saveId="s1" campaignState={CANON()} settlement={SETTLEMENT()} />);
    const revealDm = screen.getByRole('checkbox', { name: 'Reveal DM-private content' });
    const allowImport = screen.getByRole('checkbox', { name: 'Allow others to import this settlement' });
    expect(revealDm.disabled).toBe(false);
    expect(allowImport.disabled).toBe(false);
    fireEvent.click(revealDm);
    expect(revealDm.checked).toBe(true);

    // The per-member editor: closed by default, every member following the settlement.
    const perMember = screen.getByRole('button', { name: /Per-member visibility/ });
    expect(perMember.disabled).toBe(false);
    expect(perMember.textContent).toContain('All follow the settlement');
    fireEvent.click(perMember);
    const maraReveal = screen.getByRole('checkbox', { name: 'Reveal DM content for Mara Hollin' });
    const maraImport = screen.getByRole('checkbox', { name: 'Allow import of Mara Hollin' });
    expect(maraReveal.disabled).toBe(false);
    expect(maraImport.disabled).toBe(false);
    expect(maraReveal.checked).toBe(true); // inherits the settlement flag flipped above
    fireEvent.click(maraReveal); // override: hide Mara while the settlement reveals
    expect(maraReveal.checked).toBe(false);
    expect(screen.getByRole('checkbox', { name: 'Reveal DM content for Tobin Ash' }).checked).toBe(true);
    expect(perMember.textContent).toContain('1 customized');
    expectNoLaunchGate(container);
  });

  it('"Manage gallery" opens the curate, snapshot-or-live and remove controls on an exported dossier, ungated', () => {
    storeRef.current = FREE();
    const { container } = render(
      <ShareToGallery saveId="s1" isPublic publicSlug="stoneford" campaignState={CANON()} settlement={SETTLEMENT()} />,
    );
    const manage = screen.getByRole('button', { name: /Manage gallery/ });
    expect(manage.disabled).toBe(false);
    fireEvent.click(manage);
    const region = screen.getByRole('region', { name: 'Manage gallery' });
    const curate = within(region).getByRole('button', { name: /Curate for visitors/ });
    expect(curate.disabled).toBe(false);
    expect(within(region).getByText('Snapshot')).toBeTruthy();
    expect(within(region).getByText('Live')).toBeTruthy();
    expect(within(region).getByRole('button', { name: /Remove from gallery/ }).disabled).toBe(false);
    expectNoLaunchGate(container);
  });

  it('the surface reads no tier: the rendered tree is byte-identical for a free and a premium account', () => {
    const renderFor = (store, props) => {
      storeRef.current = store;
      const { container } = render(<ShareToGallery saveId="s1" campaignState={CANON()} settlement={SETTLEMENT()} {...props} />);
      const html = container.innerHTML;
      cleanup();
      return html;
    };
    for (const props of [{}, { isPublic: true, publicSlug: 'stoneford' }]) {
      const free = renderFor(FREE(), props);
      const premium = renderFor(PREMIUM(), props);
      expect(free.length).toBeGreaterThan(200); // the surface rendered
      expect(free).toBe(premium);
    }
  });
});
