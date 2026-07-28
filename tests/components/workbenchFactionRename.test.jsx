/** @vitest-environment jsdom */
/**
 * WorkbenchFactionRename contract — THE DOOR (owner queue #14).
 *
 * The atlas's finding was not "the rename is buggy", it was "there is no door":
 * the cured store action had zero callers and the one exposed surface listed a
 * list that is empty on generated saves. So these pins hold the door open AND
 * hold it shut in the right places:
 *
 *   • the control renders on a faction entry inside the Entity Inspector;
 *   • it stages through queueEdit('rename-faction', …) with the index resolved
 *     against the CANONICAL roster by reference, never by guess;
 *   • an ambiguous or absent match disables renaming instead of guessing;
 *   • a refused queue result reports honestly;
 *   • the premium gate closes it for free and anonymous viewers, and the
 *     positive control proves the absence assertions are not vacuous.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ state: {}, mobile: false }));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(mocks.state),
}));

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mocks.mobile }));

vi.mock('../../src/components/dossier/PendingChangesBar.jsx', () => ({
  default: () => <div data-testid="pending-review">Pending review</div>,
}));

import WorkbenchFactionRename, {
  resolveFactionIndex,
} from '../../src/components/dossier/WorkbenchFactionRename.jsx';
import SettlementWorkbenchMount from '../../src/components/dossier/SettlementWorkbenchMount.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';

function fixtureSettlement() {
  return {
    id: 'town.bridgeford',
    name: 'Bridgeford',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', desc: 'Old money.' },
        { faction: 'Militia' },
      ],
      governingName: 'Merchant Guild',
      conflicts: [],
    },
    npcs: [],
  };
}

function factionEntry(settlement, index = 0) {
  const raw = settlement.powerStructure.factions[index];
  return {
    id: `faction_${index}`,
    type: 'faction',
    label: raw.faction,
    currentName: raw.faction,
    identity: { interactive: true },
    raw,
  };
}

function setState(settlement, extra = {}) {
  mocks.state = {
    settlement,
    queueEdit: vi.fn(() => Promise.resolve({ id: 'intent-1' })),
    revertUserEditAction: vi.fn(),
    focusedEntity: null,
    clearFocusedEntity: vi.fn(),
    setEditMode: vi.fn(),
    pendingEditsQueue: [],
    pendingEditReceipts: [],
    ...extra,
  };
}

afterEach(() => cleanup());
beforeEach(() => { mocks.mobile = false; });

describe('the rename control stages through the ONE queue spine', () => {
  test('a faction rename is queued with the index resolved by reference', async () => {
    const settlement = fixtureSettlement();
    setState(settlement);
    render(<WorkbenchFactionRename entry={factionEntry(settlement, 1)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Rename this faction' }));
    fireEvent.change(screen.getByLabelText('New faction name'), {
      target: { value: 'The Amber Concord' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Queue this name' }));

    await waitFor(() => {
      expect(mocks.state.queueEdit).toHaveBeenCalledWith('rename-faction', {
        factionIndex: 1,
        newName: 'The Amber Concord',
      });
    });
    expect(await screen.findByText(/Queued for review/)).toBeTruthy();
  });

  test('the control writes no domain state itself (queueEdit is the only store call)', () => {
    const settlement = fixtureSettlement();
    setState(settlement, { renameFaction: vi.fn() });
    render(<WorkbenchFactionRename entry={factionEntry(settlement)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Rename this faction' }));
    fireEvent.change(screen.getByLabelText('New faction name'), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Queue this name' }));
    expect(mocks.state.renameFaction).not.toHaveBeenCalled();
  });

  test('a refused queue result reports honestly instead of pretending', async () => {
    const settlement = fixtureSettlement();
    setState(settlement, { queueEdit: vi.fn(() => Promise.resolve(null)) });
    render(<WorkbenchFactionRename entry={factionEntry(settlement)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Rename this faction' }));
    fireEvent.change(screen.getByLabelText('New faction name'), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Queue this name' }));

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText(/Not queued/)).toBeTruthy();
  });
});

describe('identity resolution refuses to guess', () => {
  test('reference identity wins, and a unique name match is the only fallback', () => {
    const settlement = fixtureSettlement();
    expect(resolveFactionIndex(settlement, factionEntry(settlement, 1))).toBe(1);
    // A detached entry (no raw reference) still resolves by unique name.
    expect(resolveFactionIndex(settlement, { currentName: 'Militia' })).toBe(1);
  });

  test('an ambiguous or absent match resolves to null and disables the control', () => {
    const settlement = fixtureSettlement();
    settlement.powerStructure.factions.push({ faction: 'Militia' });
    expect(resolveFactionIndex(settlement, { currentName: 'Militia' })).toBeNull();
    expect(resolveFactionIndex(settlement, { currentName: 'Nobody' })).toBeNull();

    setState(settlement);
    render(<WorkbenchFactionRename entry={{ type: 'faction', currentName: 'Militia' }} />);
    expect(screen.getByRole('note').textContent).toMatch(/cannot be uniquely matched/);
    expect(screen.queryByRole('button', { name: 'Rename this faction' })).toBeNull();
  });
});

describe('the premium gate holds the door', () => {
  function renderMount({ readOnly = false, auth, elevated = false } = {}) {
    const settlement = fixtureSettlement();
    const entry = factionEntry(settlement);
    setState(settlement, {
      focusedEntity: { id: entry.id, ts: 1 },
      auth,
      ...(elevated ? { isElevated: () => true } : {}),
    });
    const index = { resolve: id => (entry.id === id ? entry : null) };
    return render(
      <DossierEntityContext.Provider value={{ index, navigateToEntity: vi.fn() }}>
        <SettlementWorkbenchMount enabled readOnly={readOnly} />
      </DossierEntityContext.Provider>,
    );
  }

  test('premium sees the rename control (the positive control)', async () => {
    renderMount({ auth: { tier: 'premium' } });
    expect(await screen.findByRole('button', { name: 'Rename this faction' })).toBeTruthy();
  });

  test('free tier gets the read-only inspector and NO rename control', async () => {
    renderMount({ auth: { tier: 'free' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Rename this faction' })).toBeNull();
  });

  test('anon (no auth state at all) fails closed the same way', async () => {
    renderMount({ auth: undefined });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Rename this faction' })).toBeNull();
  });

  test('an elevated role holds the authority regardless of tier', async () => {
    renderMount({ auth: { tier: 'free' }, elevated: true });
    expect(await screen.findByRole('button', { name: 'Rename this faction' })).toBeTruthy();
  });

  test('the upstream readOnly prop still wins for a premium viewer', async () => {
    renderMount({ readOnly: true, auth: { tier: 'premium' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Rename this faction' })).toBeNull();
  });

  test('mobile keeps the door shut, matching the sibling authoring surfaces', async () => {
    mocks.mobile = true;
    renderMount({ auth: { tier: 'premium' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Rename this faction' })).toBeNull();
  });
});
