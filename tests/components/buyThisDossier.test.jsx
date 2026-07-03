/** @vitest-environment jsdom */
/**
 * buyThisDossier.test.jsx — the four states of the export-ladder purchase CTA
 * (migration 108) and its checkout threading.
 *
 *   1. reason 'tier' | 'entitled' → renders NOTHING.
 *   2. reason 'anon'             → shows the Buy button; clicking opens the LADDER
 *      popup (does NOT jump straight to Stripe).
 *   3. reason 'unpurchased'      → shows the $2.99 durable CTA; clicking calls
 *      startCheckout('single_dossier', { saveId }) — the save id is threaded.
 *   4. reason 'unsaved'          → shows the save-first CTA; clicking opens the
 *      auth flow (never a checkout).
 *
 * The access hook is mocked so each case drives ONE branch deterministically;
 * stripe + the stashes are mocked to assert threading without a network call.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  access: { allowed: false, reason: 'anon' },
  startCheckout: vi.fn(() => Promise.resolve({ redeemNotice: null })),
  stashPendingDossier: vi.fn(() => true),
  stashDossierClaim: vi.fn(() => true),
  setAuthModalOpen: vi.fn(),
  isElevated: false,
  canSave: true,
}));

vi.mock('../../src/hooks/useDossierExportAccess.js', () => ({
  useDossierExportAccess: () => mocks.access,
}));
vi.mock('../../src/lib/stripe.js', () => ({
  startCheckout: (...a) => mocks.startCheckout(...a),
}));
vi.mock('../../src/lib/pendingDossier.js', () => ({
  createDossierCheckoutToken: () => 'tok_abcdefghijklmnopqrstuvwx',
  stashPendingDossier: (...a) => mocks.stashPendingDossier(...a),
}));
vi.mock('../../src/lib/dossierClaimStash.js', () => ({
  stashDossierClaim: (...a) => mocks.stashDossierClaim(...a),
}));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
vi.mock('../../src/store/index.js', () => {
  const state = {
    isElevated: () => mocks.isElevated,
    canSave: () => mocks.canSave,
    setAuthModalOpen: (...a) => mocks.setAuthModalOpen(...a),
  };
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import BuyThisDossier from '../../src/components/BuyThisDossier.jsx';

const SETTLEMENT = { name: 'Stoneford', _seed: 'seed-1' };

afterEach(() => {
  cleanup();
  mocks.access = { allowed: false, reason: 'anon' };
  mocks.startCheckout.mockClear();
  mocks.stashPendingDossier.mockClear();
  mocks.stashDossierClaim.mockClear();
  mocks.setAuthModalOpen.mockClear();
  mocks.isElevated = false;
  mocks.canSave = true;
});

describe('BuyThisDossier — the four ladder states', () => {
  test('renders nothing when access is already allowed (tier / entitled)', () => {
    mocks.access = { allowed: true, reason: 'tier' };
    const { container } = render(<BuyThisDossier settlement={SETTLEMENT} saveId="s1" />);
    expect(container.textContent).toBe('');
  });

  test('renders nothing for an elevated role', () => {
    mocks.isElevated = true;
    mocks.access = { allowed: false, reason: 'unpurchased' };
    const { container } = render(<BuyThisDossier settlement={SETTLEMENT} saveId="s1" />);
    expect(container.textContent).toBe('');
  });

  test('anon: clicking Buy opens the ladder popup instead of going straight to Stripe', () => {
    mocks.access = { allowed: false, reason: 'anon' };
    render(<BuyThisDossier settlement={SETTLEMENT} />);
    fireEvent.click(screen.getByRole('button', { name: /Buy this dossier/i }));
    // The ladder dialog is now open; no checkout has fired yet.
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(mocks.startCheckout).not.toHaveBeenCalled();
  });

  test('unpurchased (free + saved): clicking threads saveId into the durable checkout', () => {
    mocks.access = { allowed: false, reason: 'unpurchased' };
    render(<BuyThisDossier settlement={SETTLEMENT} saveId="save-42" />);
    fireEvent.click(screen.getByRole('button', { name: /Keep the PDF/i }));
    expect(mocks.startCheckout).toHaveBeenCalledTimes(1);
    const [product, options] = mocks.startCheckout.mock.calls[0];
    expect(product).toBe('single_dossier');
    expect(options.saveId).toBe('save-42');
  });

  test('unsaved (free + no save): clicking opens the auth flow, never a checkout', () => {
    mocks.access = { allowed: false, reason: 'unsaved' };
    render(<BuyThisDossier settlement={SETTLEMENT} saveId={null} />);
    fireEvent.click(screen.getByRole('button', { name: /Save this settlement/i }));
    expect(mocks.setAuthModalOpen).toHaveBeenCalledWith(true);
    expect(mocks.startCheckout).not.toHaveBeenCalled();
  });
});
