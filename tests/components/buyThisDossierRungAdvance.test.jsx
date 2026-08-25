/**
 * @vitest-environment jsdom
 *
 * BuyThisDossier "save it first" → rung advance (finding
 * components-shell-commerce-2, W-R2-TRUST).
 *
 * THE BUG THIS CATCHES: the fallback runSaveFirst persisted via savesService.save
 * but never stamped store identity, so access.reason stayed 'unsaved' — the
 * save-first button kept re-rendering and each click inserted another row.
 *
 * THE PINS: after a successful fallback save the component holds the returned id
 * locally, calls setActiveSaveId exactly once, and advances off the 'unsaved'
 * rung (the save-first CTA disappears) — so there is no button left to
 * double-insert with.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef, saveMock } = vi.hoisted(() => ({
  storeRef: { current: {} },
  saveMock: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
// Dynamic import target of runSaveFirst — intercept so no network is touched.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: (...a) => saveMock.fn(...a) },
}));
// Save-moment side effects are fire-and-forget; stub so the dynamic import resolves.
vi.mock('../../src/store/saveMoments.js', () => ({
  recordSaveMomentForActiveSave: vi.fn(() => Promise.resolve({ fired: false })),
}));

import BuyThisDossier from '../../src/components/BuyThisDossier.jsx';

describe('BuyThisDossier save-first rung advance', () => {
  test('fallback save stamps identity once and leaves the unsaved rung', async () => {
    const setActiveSaveId = vi.fn();
    saveMock.fn = vi.fn(() => Promise.resolve('s-new'));
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false,   // free-export gate OFF ⇒ the 'unsaved' rung renders
      canSave: () => true,
      dossierEntitlements: {},   // no durable right ⇒ post-save rung is 'unpurchased'
      refreshDossierEntitlement: () => {},
      setActiveSaveId,
    };

    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId={null} />);

    // Starts on the 'unsaved' rung (no onSaveFirst prop ⇒ internal fallback runs).
    const cta = screen.getByRole('button', { name: /save this settlement to buy its pdf/i });
    fireEvent.click(cta);

    // The id was stamped exactly once with the returned save id.
    await waitFor(() => expect(setActiveSaveId).toHaveBeenCalledTimes(1));
    expect(setActiveSaveId).toHaveBeenCalledWith('s-new');
    expect(saveMock.fn).toHaveBeenCalledTimes(1);

    // The rung advanced: the save-first CTA is gone (nothing left to double-click).
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /save this settlement to buy its pdf/i })).toBeNull());
  });
});
