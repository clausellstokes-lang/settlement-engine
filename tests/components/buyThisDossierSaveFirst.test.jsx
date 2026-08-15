/**
 * @vitest-environment jsdom
 *
 * tests/components/buyThisDossierSaveFirst.test.jsx — the "save it first" rung
 * routes to the SAVE flow, not the sign-in bounce (finding components-commerce-5).
 *
 * THE BUG THIS CATCHES: the signed-in, unsaved-draft rung ('unsaved') rendered a
 * "Save this settlement to buy its PDF" CTA whose onClick was `goSignIn` — sending
 * an ALREADY signed-in user to the sign-in page, which redirects any non-anon user
 * to /create. The save the copy promised never happened. The rung is dormant today
 * (the free-export gate is on) but activates the instant that gate flips.
 *
 * THE PINS: resolveExportAccess classifies every rung; the 'unsaved' CTA calls the
 * save handler (never sign-in); the 'anon' CTA still opens the ladder whose
 * create-account rung is the only path that reaches sign-in.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

afterEach(cleanup);

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));
// Light stub of the anon ladder so we can drive its create-account rung.
vi.mock('../../src/components/dossier/DossierLadderModal.jsx', () => ({
  default: ({ onCreateAccount }) => (
    <button type="button" onClick={onCreateAccount}>ladder-create-account</button>
  ),
}));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

import BuyThisDossier, { resolveExportAccess } from '../../src/components/BuyThisDossier.jsx';

describe('resolveExportAccess classification', () => {
  test('export-capable tier renders nothing', () => {
    expect(resolveExportAccess({ tier: 'cartographer', canExportFreely: true, saveId: null, entitled: false }))
      .toEqual({ allowed: true, reason: 'tier' });
  });
  test('anonymous visitor → anon (ladder)', () => {
    expect(resolveExportAccess({ tier: 'anon', canExportFreely: false, saveId: null, entitled: false }))
      .toEqual({ allowed: false, reason: 'anon' });
  });
  test('signed-in unsaved draft → unsaved (save first)', () => {
    expect(resolveExportAccess({ tier: 'wanderer', canExportFreely: false, saveId: null, entitled: false }))
      .toEqual({ allowed: false, reason: 'unsaved' });
  });
  test('signed-in saved + entitled → allowed', () => {
    expect(resolveExportAccess({ tier: 'wanderer', canExportFreely: false, saveId: 's1', entitled: true }))
      .toEqual({ allowed: true, reason: 'entitled' });
  });
  test('signed-in saved, not entitled → unpurchased', () => {
    expect(resolveExportAccess({ tier: 'wanderer', canExportFreely: false, saveId: 's1', entitled: false }))
      .toEqual({ allowed: false, reason: 'unpurchased' });
  });
});

describe('BuyThisDossier "save first" rung', () => {
  test("signed-in unsaved CTA triggers save, NOT sign-in navigation", async () => {
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false, // free-export gate OFF ⇒ the 'unsaved' rung renders
      canSave: () => true,
      dossierEntitlements: {},
      refreshDossierEntitlement: () => {},
    };
    const onSaveFirst = vi.fn();
    const onSignIn = vi.fn();
    render(
      <BuyThisDossier
        settlement={{ name: 'Testburg', tier: 'wanderer' }}
        saveId={null}
        onSaveFirst={onSaveFirst}
        onSignIn={onSignIn}
      />,
    );

    const cta = screen.getByRole('button', { name: /save this settlement to unlock its exports/i });
    fireEvent.click(cta);

    await waitFor(() => expect(onSaveFirst).toHaveBeenCalledTimes(1));
    expect(onSignIn).not.toHaveBeenCalled();
  });

  test('anonymous CTA opens the ladder whose create-account rung reaches sign-in', async () => {
    storeRef.current = {
      auth: { tier: 'anon' },
      isElevated: () => false,
      canExport: () => false,
      canSave: () => false,
      dossierEntitlements: {},
      refreshDossierEntitlement: () => {},
    };
    const onSaveFirst = vi.fn();
    const onSignIn = vi.fn();
    render(
      <BuyThisDossier
        settlement={{ name: 'Testburg', tier: 'anon' }}
        saveId={null}
        onSaveFirst={onSaveFirst}
        onSignIn={onSignIn}
      />,
    );

    // Anonymous path shows the ladder-opening "Buy" button, never the save rung.
    const buy = screen.getByRole('button', { name: /buy this dossier for/i });
    fireEvent.click(buy);
    const createAccount = await screen.findByRole('button', { name: /ladder-create-account/i });
    fireEvent.click(createAccount);

    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onSaveFirst).not.toHaveBeenCalled();
  });
});
