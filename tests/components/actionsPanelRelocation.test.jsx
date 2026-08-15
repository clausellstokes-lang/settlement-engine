/**
 * @vitest-environment jsdom
 *
 * actionsPanelRelocation.test.jsx — owner order (2026-07-22): the saved-view
 * header verbs move into the renamed "Actions" panel (NextActionRail), and the
 * free-tier export pitch becomes a popup (ExportUnlockDialog) instead of an
 * always-visible card.
 *
 * The load-bearing pins:
 *  · useNextActionRailHandlers wires the relocated verbs (Session Mode / Export
 *    Image / Share) and routes Export by entitlement + Edit by premium.
 *  · NextActionRail renders under the "Actions" kicker and carries those rungs.
 *  · ExportUnlockDialog shows the $2.99 title + explainer only when opened.
 *  · BuyThisDossier's unpurchased state renders NO static explainer paragraph —
 *    the explainer lives in the popup the button opens.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
// Keep the checkout inert — the popup's confirm must not touch the network.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(() => Promise.resolve()) }));

import { useNextActionRailHandlers } from '../../src/components/settlementDetail/useNextActionRailHandlers.js';
import NextActionRail from '../../src/components/settlement/NextActionRail.jsx';
import ExportUnlockDialog from '../../src/components/dossier/ExportUnlockDialog.jsx';
import BuyThisDossier from '../../src/components/BuyThisDossier.jsx';

const baseDeps = {
  saveId: 'save-1', phase: 'draft', editMode: false, narrated: false, canNarrate: true,
  toggleEditMode: () => {}, canonize: () => {}, setConfirmCanonizeOpen: () => {}, openExportSheet: () => {},
};
const handlers = (over) => renderHook(() => useNextActionRailHandlers({ ...baseDeps, ...over })).result.current.railHandlers;

describe('useNextActionRailHandlers — relocated verbs + routing', () => {
  test('the relocated verbs are wired from their openers', () => {
    const openSessionMode = vi.fn(), exportImage = vi.fn(), openShare = vi.fn();
    const h = handlers({ canEdit: true, openSessionMode, exportImage, openShare });
    expect(h.onSessionMode).toBe(openSessionMode);
    expect(h.onExportImage).toBe(exportImage);
    expect(h.onShare).toBe(openShare);
  });

  test('Export routes by entitlement — sheet for entitled, popup for free', () => {
    const openExportSheet = vi.fn(), openExportUnlock = vi.fn();
    const entitled = handlers({ canEdit: true, exportAllowed: true, openExportSheet, openExportUnlock });
    expect(entitled.onExport).toBe(openExportSheet);
    const free = handlers({ canEdit: false, exportAllowed: false, openExportSheet, openExportUnlock });
    expect(free.onExport).toBe(openExportUnlock);
  });

  test('Edit stays a premium upsell for a free owner — opens the purchase modal', () => {
    const setPurchaseModalOpen = vi.fn();
    const h = handlers({ canEdit: false, setPurchaseModalOpen });
    expect(typeof h.onEdit).toBe('function');
    h.onEdit();
    expect(setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });
});

describe('NextActionRail — the "Actions" panel census', () => {
  test('renders under the Actions kicker with the relocated verb rungs', () => {
    storeRef.current = { phase: 'draft', eventLog: [], aiSettlement: null, aiDailyLife: null };
    const rail = {
      onCanonize: vi.fn(), onSessionMode: vi.fn(), onExportImage: vi.fn(),
      onShare: vi.fn(), onEdit: vi.fn(), onExport: vi.fn(),
    };
    render(<NextActionRail settlement={{ name: 'X' }} save={{}} handlers={rail} canEdit={false} galleryPublished={false} />);
    expect(screen.getByText('Actions')).toBeTruthy();
    // Session Mode + the premium-gated Edit rung are present (Edit shows the lock label).
    expect(screen.getByRole('button', { name: 'Session Mode' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Edit (Premium)' })).toBeTruthy();
    // Export Image + Share may sit under "Show more" (5-item cap) — reveal them.
    const more = screen.queryByRole('button', { name: /show \d+ more/i });
    if (more) fireEvent.click(more);
    expect(screen.getByRole('button', { name: 'Export Image' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Share to Gallery' })).toBeTruthy();
  });
});

describe('ExportUnlockDialog — the export-unlock popup', () => {
  test('shows the $2.99 title + explainer only when open', () => {
    const { rerender } = render(<ExportUnlockDialog open={false} saveId="s-1" onClose={() => {}} />);
    expect(screen.queryByText(/Unlock all exports for this settlement/i)).toBeNull();
    rerender(<ExportUnlockDialog open saveId="s-1" onClose={() => {}} />);
    expect(screen.getByText(/Unlock all exports for this settlement · \$2\.99/i)).toBeTruthy();
    expect(screen.getByText(/A one-time purchase unlocks every export/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /continue to checkout/i })).toBeTruthy();
  });
});

describe('BuyThisDossier — the unpurchased pitch is a popup, not a static caption', () => {
  test('renders no static explainer paragraph; the button opens the popup', () => {
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false,      // free-export gate OFF ⇒ not export-capable
      canSave: () => true,
      dossierEntitlements: {},      // no durable right ⇒ the 'unpurchased' rung
      refreshDossierEntitlement: () => {},
      setActiveSaveId: () => {},
    };
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId="save-1" />);
    // The explainer is NOT on the surface as a static block before any click.
    expect(screen.queryByText(/A one-time purchase unlocks every export/i)).toBeNull();
    // The unlock button IS present…
    const btn = screen.getByRole('button', { name: /Unlock all exports for this settlement/i });
    // …and clicking it surfaces the explainer inside the popup.
    fireEvent.click(btn);
    expect(screen.getByText(/A one-time purchase unlocks every export/i)).toBeTruthy();
  });

  test('the unsaved save-first state renders no static export-pitch caption (order-6 extension)', () => {
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false,   // not export-capable ⇒ the gate is on
      canSave: () => true,      // can save ⇒ the save-first (not at-cap) rung
      dossierEntitlements: {},
      refreshDossierEntitlement: () => {},
      setActiveSaveId: () => {},
    };
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId={null} />);
    // The save-first CTA button is present…
    expect(screen.getByRole('button', { name: /save this settlement to unlock its exports/i })).toBeTruthy();
    // …but the static save-first export-pitch explainer renders nowhere.
    expect(screen.queryByText(/Export rights attach to a saved settlement/i)).toBeNull();
  });
});
