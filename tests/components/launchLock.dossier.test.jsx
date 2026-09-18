/** @vitest-environment jsdom */
/**
 * launchLock.dossier.test.jsx - the pre-launch lockout over the dossier export and
 * edit purchase controls.
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts but temporarily, all buttons for purchase
 * including subscriptions are to have a pill that says available at launch."
 *
 * purchasesOpen() (src/lib/launchGate.js) is NOT mocked here, so this test build is
 * CLOSED: every dossier purchase control below must render disabled with the
 * "Available at launch" pill inside it (inside the rail row, for the Actions rail),
 * and a click on it must do nothing. Supabase is mocked CONFIGURED, so a disabled
 * control is disabled by the launch gate and not by a missing payments setup.
 *
 * The gate is scoped, not blanket, and the same closed build pins that: the ladder's
 * create-account rung, the signed-in save-first rung, a premium owner's Edit Dossier
 * and Export Dossier, a free owner's Export once a durable right is held, the popup's
 * Not now and the rail's Polish with AI all stay live with no pill.
 *
 * The open (post-launch) behavior stays pinned by the components' own suites, which
 * mock the gate open (dossierLadderModal, buyThisDossierSaveFirst,
 * actionsPanelRelocation). The render setups here are the ones those suites use.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); mobile.value = false; });

const { storeRef, mobile } = vi.hoisted(() => ({ storeRef: { current: {} }, mobile: { value: false } }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
// Inert checkout: a locked confirm must never reach it, and nothing touches the network.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(() => Promise.resolve()) }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mobile.value }));

import { startCheckout } from '../../src/lib/stripe.js';
import { purchasesOpen } from '../../src/lib/launchGate.js';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import BuyThisDossier from '../../src/components/BuyThisDossier.jsx';
import DossierLadderModal from '../../src/components/dossier/DossierLadderModal.jsx';
import ExportUnlockDialog from '../../src/components/dossier/ExportUnlockDialog.jsx';
import DossierSessionNotices from '../../src/components/dossier/DossierSessionNotices.jsx';
import NextActionRail from '../../src/components/settlement/NextActionRail.jsx';
import SettlementDetailActions from '../../src/components/settlementDetail/SettlementDetailActions.jsx';

const PILL = 'Available at launch';

/** The control is a disabled button and the pill sits INSIDE it. */
function expectLockedWithPill(button) {
  expect(button.tagName).toBe('BUTTON');
  expect(button.disabled).toBe(true);
  expect(within(button).getByText(PILL)).toBeTruthy();
  expect(button.querySelector('[data-launch-pill]')?.textContent).toBe(PILL);
}

/** A non-purchase control stays live and wears no pill. */
function expectLiveWithoutPill(button) {
  expect(button.tagName).toBe('BUTTON');
  expect(button.disabled).toBe(false);
  expect(button.querySelector('[data-launch-pill]')).toBeNull();
}

/** A free (wanderer) account: no export gate, no durable right unless given. */
function freeOwnerStore(overrides = {}) {
  return {
    phase: 'draft', eventLog: [], aiSettlement: null, aiDailyLife: null,
    auth: { tier: 'wanderer' },
    isElevated: () => false,
    canExport: () => false,
    canSave: () => true,
    dossierEntitlements: {},
    refreshDossierEntitlement: () => {},
    setActiveSaveId: () => {},
    ...overrides,
  };
}

describe('launch lock (dossier): the build under test is closed', () => {
  it('purchasesOpen() is false here, so every assertion below measures the closed state', () => {
    expect(purchasesOpen()).toBe(false);
    expect(AVAILABLE_AT_LAUNCH).toBe(PILL);
  });
});

describe('launch lock (dossier): BuyThisDossier', () => {
  it('the anonymous "Buy this dossier" button is disabled, wears the pill, and a click opens no ladder', () => {
    storeRef.current = freeOwnerStore({ auth: { tier: 'anon' }, canSave: () => false });
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'anon' }} saveId={null} />);
    const buy = screen.getByRole('button', { name: /buy this dossier for \$2\.99/i });
    expectLockedWithPill(buy);
    // The label text comes first, so the button still reads as the buy action.
    expect(buy.textContent.startsWith('Buy this dossier for $2.99')).toBe(true);
    fireEvent.click(buy);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the signed-in "Unlock all exports" button is disabled, wears the pill, and a click opens no popup', () => {
    storeRef.current = freeOwnerStore();
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId="save-1" />);
    const unlock = screen.getByRole('button', { name: /unlock all exports for this settlement · \$2\.99/i });
    expectLockedWithPill(unlock);
    fireEvent.click(unlock);
    expect(screen.queryByText(/A one-time purchase unlocks every export/i)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('on a phone the locked buy button lets the pill wrap below its label; on desktop it stays one line', () => {
    storeRef.current = freeOwnerStore();
    mobile.value = true;
    const { unmount } = render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId="save-1" />);
    const phoneButton = screen.getByRole('button', { name: /unlock all exports/i });
    expectLockedWithPill(phoneButton);
    expect(phoneButton.style.flexWrap).toBe('wrap');
    unmount();
    mobile.value = false;
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId="save-1" />);
    const desktopButton = screen.getByRole('button', { name: /unlock all exports/i });
    expectLockedWithPill(desktopButton);
    expect(desktopButton.style.flexWrap).toBe('');
  });

  it('the save-first rung is a save, not a purchase: it stays live with no pill', () => {
    storeRef.current = freeOwnerStore();
    render(<BuyThisDossier settlement={{ name: 'Testburg', tier: 'wanderer' }} saveId={null} />);
    expectLiveWithoutPill(screen.getByRole('button', { name: /save this settlement to unlock its exports/i }));
  });
});

describe('launch lock (dossier): DossierLadderModal', () => {
  it('the Cartographer and one-time rungs are locked with the pill; the create-account rung stays live', () => {
    const handlers = { onClose: vi.fn(), onCreateAccount: vi.fn(), onCartographer: vi.fn(), onOneTime: vi.fn() };
    const { container } = render(<DossierLadderModal {...handlers} />);
    const rung = (id) => container.querySelector(`[data-rung="${id}"]`);

    expectLockedWithPill(rung('cartographer'));
    expectLockedWithPill(rung('oneTime'));
    fireEvent.click(rung('cartographer'));
    fireEvent.click(rung('oneTime'));
    expect(handlers.onCartographer).toHaveBeenCalledTimes(0);
    expect(handlers.onOneTime).toHaveBeenCalledTimes(0);

    expectLiveWithoutPill(rung('account'));
    fireEvent.click(rung('account'));
    expect(handlers.onCreateAccount).toHaveBeenCalledTimes(1);
  });
});

describe('launch lock (dossier): ExportUnlockDialog', () => {
  it('"Continue to checkout" is disabled with the pill and never starts a checkout; Not now stays live', () => {
    const onClose = vi.fn();
    render(<ExportUnlockDialog open saveId="save-1" onClose={onClose} />);
    const checkout = screen.getByRole('button', { name: /continue to checkout/i });
    expectLockedWithPill(checkout);
    fireEvent.click(checkout);
    expect(startCheckout).toHaveBeenCalledTimes(0);

    const notNow = screen.getByRole('button', { name: 'Not now' });
    expectLiveWithoutPill(notNow);
    fireEvent.click(notNow);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('launch lock (dossier): DossierSessionNotices', () => {
  it('the credits error keeps its notice, but "View plans" is disabled with the pill and opens nothing', () => {
    const openCreditsMoment = vi.fn();
    render(
      <DossierSessionNotices
        showNarrative={false}
        aiError="You are out of credits."
        aiErrorIsCredits
        openCreditsMoment={openCreditsMoment}
        regenDelta={null}
      />,
    );
    expect(screen.getByRole('alert').textContent).toContain('You are out of credits.');
    const viewPlans = screen.getByRole('button', { name: /^View plans/ });
    expectLockedWithPill(viewPlans);
    fireEvent.click(viewPlans);
    expect(openCreditsMoment).toHaveBeenCalledTimes(0);
  });
});

describe('launch lock (dossier): NextActionRail', () => {
  it('a free owner: "Edit (Cartographer)" and "Export Dossier" are locked with the pill; Polish with AI stays live', () => {
    storeRef.current = freeOwnerStore();
    const handlers = { onEdit: vi.fn(), onExport: vi.fn(), onPolishAi: vi.fn() };
    render(<NextActionRail settlement={{ name: 'X' }} save={{ id: 'save-1' }} handlers={handlers} canEdit={false} />);

    const edit = screen.getByRole('button', { name: 'Edit (Cartographer)' });
    const exportRung = screen.getByRole('button', { name: 'Export Dossier' });
    expectLockedWithPill(edit);
    expectLockedWithPill(exportRung);
    // The pill is announced with the row: it sits in the hint the row is described by.
    expect(document.getElementById(exportRung.getAttribute('aria-describedby')).textContent).toBe(PILL);
    expect(document.getElementById(edit.getAttribute('aria-describedby')).textContent)
      .toBe(`Manual editing is a Cartographer feature. Click to upgrade.${PILL}`);
    expect(exportRung.getAttribute('title')).toBe(PILL);
    fireEvent.click(edit);
    fireEvent.click(exportRung);
    expect(handlers.onEdit).toHaveBeenCalledTimes(0);
    expect(handlers.onExport).toHaveBeenCalledTimes(0);

    const polish = screen.getByRole('button', { name: 'Polish with AI' });
    expectLiveWithoutPill(polish);
    fireEvent.click(polish);
    expect(handlers.onPolishAi).toHaveBeenCalledTimes(1);
  });

  it('a premium owner: Edit Dossier and Export Dossier are not purchases, so both stay live with no pill', () => {
    storeRef.current = freeOwnerStore({ auth: { tier: 'premium' }, canExport: () => true });
    const handlers = { onEdit: vi.fn(), onExport: vi.fn() };
    render(<NextActionRail settlement={{ name: 'X' }} save={{ id: 'save-1' }} handlers={handlers} canEdit />);

    const edit = screen.getByRole('button', { name: 'Edit Dossier' });
    const exportRung = screen.getByRole('button', { name: 'Export Dossier' });
    expectLiveWithoutPill(edit);
    expectLiveWithoutPill(exportRung);
    fireEvent.click(exportRung);
    expect(handlers.onExport).toHaveBeenCalledTimes(1);
  });

  it('a free owner holding the durable right for this save: Export stays live, Edit (Cartographer) stays locked', () => {
    storeRef.current = freeOwnerStore({ dossierEntitlements: { 'save-1': true } });
    const handlers = { onEdit: vi.fn(), onExport: vi.fn() };
    render(<NextActionRail settlement={{ name: 'X' }} save={{ id: 'save-1' }} handlers={handlers} canEdit={false} />);

    const exportRung = screen.getByRole('button', { name: 'Export Dossier' });
    expectLiveWithoutPill(exportRung);
    fireEvent.click(exportRung);
    expect(handlers.onExport).toHaveBeenCalledTimes(1);
    expectLockedWithPill(screen.getByRole('button', { name: 'Edit (Cartographer)' }));
  });
});

describe('launch lock (dossier): SettlementDetailActions', () => {
  const baseProps = {
    settlement: { name: 'Testburg', tier: 'wanderer' }, saveId: 'save-1',
    editMode: true, toggleEditMode: vi.fn(),
    sessionModeEnabled: false, onOpenSession: vi.fn(),
    exporting: false, onOpenExportSheet: vi.fn(),
    imageExporting: false, onExportImage: vi.fn(),
    shareOpen: false, onToggleShare: vi.fn(), galleryPublished: false,
  };

  it('a non-premium owner: "Edit (Cartographer)" is locked with the pill and opens no pricing modal; the buy rung is locked too', () => {
    storeRef.current = freeOwnerStore();
    const setPurchaseModalOpen = vi.fn();
    render(<SettlementDetailActions {...baseProps} canEdit={false} setPurchaseModalOpen={setPurchaseModalOpen} exportAllowed={false} />);

    const edit = screen.getByRole('button', { name: /^Edit \(Cartographer\)/ });
    expectLockedWithPill(edit);
    fireEvent.click(edit);
    expect(setPurchaseModalOpen).toHaveBeenCalledTimes(0);
    // The non-entitled export branch is BuyThisDossier's unlock button.
    expectLockedWithPill(screen.getByRole('button', { name: /unlock all exports for this settlement/i }));
  });

  it('a premium editor: Stop Editing and Export Dossier stay live with no pill', () => {
    storeRef.current = freeOwnerStore({ auth: { tier: 'premium' }, canExport: () => true });
    const toggleEditMode = vi.fn();
    render(<SettlementDetailActions {...baseProps} canEdit toggleEditMode={toggleEditMode} setPurchaseModalOpen={vi.fn()} exportAllowed />);

    const stop = screen.getByRole('button', { name: 'Stop Editing' });
    expectLiveWithoutPill(stop);
    fireEvent.click(stop);
    expect(toggleEditMode).toHaveBeenCalledTimes(1);
    expectLiveWithoutPill(screen.getByRole('button', { name: 'Export Dossier' }));
  });
});
