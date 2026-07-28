/** @vitest-environment jsdom */
/**
 * librarySettlementDestroy.test.jsx — the Library's type-the-name destruction
 * control (dead-op dispositions, wiring half: `destroySavedSettlement`).
 *
 * WHAT THIS HOLDS. Wave R-1 gave `destroySavedSettlement` a confirm gate at the
 * ACTION boundary precisely because the operations registry was that lane's only
 * surface — the registry advertised a one-way canon act no player could reach.
 * tests/store/destroyConfirmGate.test.js pins the gate; this pins the door, and it
 * drives the REAL store action rather than a spy, so a gate change reds here too.
 *
 * Properties:
 *   1. The affordance exists on a canonized Library row, and NOT on a draft (whose
 *      campaign timeline the act would silently open) or on a settlement the canon
 *      already records as destroyed.
 *   2. Confirming with the exact name performs the destruction: status flips and
 *      the DESTROY_SETTLEMENT row lands in the save's event log with the cause the
 *      GM typed.
 *   3. A non-matching name cannot be submitted, and a refusal from the action
 *      itself renders as text instead of a silent no-op.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { SettlementCard } from '../../src/components/settlements/SettlementCard.jsx';
import { useStore } from '../../src/store/index.js';

const baseProps = {
  allModifiers: new Map(),
  onView: vi.fn(),
  deleteId: null,
  setDeleteId: vi.fn(),
  deleteConfirmed: vi.fn(),
  campaigns: [],
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  onCanonize: vi.fn(),
  currentCampaignId: null,
};

/** A canonized Library row whose settlement name differs from the save name. */
function canonSave(overrides = {}) {
  return {
    id: 's-doom',
    name: 'The Doomed Save',
    tier: 'town',
    timestamp: Date.now(),
    campaignState: { phase: 'canon', eventLog: [] },
    settlement: { name: 'Ashford', tier: 'town', institutions: [], npcs: [] },
    ...overrides,
  };
}

function seedStore(save) {
  useStore.setState({ savedSettlements: save ? [structuredClone(save)] : [] });
}

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'More actions' }));

beforeEach(() => { seedStore(null); });
afterEach(() => { cleanup(); seedStore(null); });

describe('the destruction affordance appears only where the act is coherent', () => {
  test('a canonized, standing settlement offers it', () => {
    const save = canonSave();
    seedStore(save);
    render(<SettlementCard s={save} {...baseProps} />);
    openMenu();
    expect(screen.getByRole('button', { name: /Record its destruction/ })).toBeTruthy();
  });

  test('a draft does not (the act would open a canon timeline behind the GM)', () => {
    const save = canonSave({ campaignState: { phase: 'draft', eventLog: [] } });
    seedStore(save);
    render(<SettlementCard s={save} {...baseProps} />);
    openMenu();
    expect(screen.queryByRole('button', { name: /Record its destruction/ })).toBeNull();
  });

  test('an already-destroyed settlement does not (no destroying it twice)', () => {
    const save = canonSave();
    save.settlement.status = 'destroyed';
    seedStore(save);
    render(<SettlementCard s={save} {...baseProps} />);
    openMenu();
    expect(screen.queryByRole('button', { name: /Record its destruction/ })).toBeNull();
  });
});

describe('the control drives the real confirm-gated action', () => {
  async function openConfirm(save) {
    render(<SettlementCard s={save} {...baseProps} />);
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: /Record its destruction/ }));
    return waitFor(() => screen.getByRole('button', { name: 'Record the destruction' }));
  }

  test('the SETTLEMENT name is what must be typed, not the save row name', async () => {
    const save = canonSave();
    seedStore(save);
    const confirmButton = await openConfirm(save);
    expect(confirmButton.disabled).toBe(true);

    // The save row is called "The Doomed Save"; the gate wants "Ashford".
    fireEvent.change(screen.getByLabelText(/^Type Ashford to confirm/), {
      target: { value: 'The Doomed Save' },
    });
    expect(screen.getByRole('button', { name: 'Record the destruction' }).disabled).toBe(true);

    fireEvent.change(screen.getByLabelText(/^Type Ashford to confirm/), { target: { value: 'Ashford' } });
    expect(screen.getByRole('button', { name: 'Record the destruction' }).disabled).toBe(false);
  });

  test('confirming records the destruction with the cause the GM gave', async () => {
    const save = canonSave();
    seedStore(save);
    await openConfirm(save);
    fireEvent.change(screen.getByLabelText(/^Type Ashford to confirm/), { target: { value: 'Ashford' } });
    fireEvent.change(screen.getByLabelText('What destroyed it'), { target: { value: 'a winter siege' } });
    fireEvent.click(screen.getByRole('button', { name: 'Record the destruction' }));

    const stored = useStore.getState().savedSettlements[0];
    expect(stored.settlement.status).toBe('destroyed');
    expect(stored.settlement.destroyedReason).toBe('a winter siege');
    const log = stored.campaignState.eventLog;
    expect(log[log.length - 1].type).toBe('DESTROY_SETTLEMENT');
    // The row closes on success; the confirm is gone.
    expect(screen.queryByRole('button', { name: 'Record the destruction' })).toBeNull();
  });

  test('a refusal from the action renders instead of vanishing', async () => {
    // The row is on screen but the store no longer holds that save (a stale list,
    // or a sibling surface deleted it). The action returns its not-found envelope.
    const save = canonSave();
    seedStore(canonSave({ id: 'some-other-save' }));
    await openConfirm(save);
    fireEvent.change(screen.getByLabelText(/^Type Ashford to confirm/), { target: { value: 'Ashford' } });
    fireEvent.click(screen.getByRole('button', { name: 'Record the destruction' }));

    expect(screen.getByRole('alert').textContent).toMatch(/nothing about this settlement changed/i);
    expect(useStore.getState().savedSettlements[0].settlement.status).toBeUndefined();
  });
});
