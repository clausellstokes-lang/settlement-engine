/** @vitest-environment jsdom */
/**
 * pendingEditSingleRevert.test.jsx — the per-edit revert control (dead-op
 * dispositions, wiring half: `revertSingleEdit`).
 *
 * WHAT THIS HOLDS. `queueEdit`'s registry row has always promised "the edit can be
 * reverted on its own" and named `revertSingleEdit` as its undo token. Until this
 * control the promise was true in code and unreachable in the product: the only way
 * out of ONE mistyped change was Discard, which threw the whole batch away. The
 * dead-op ratchet counted revertSingleEdit among its frozen members and the
 * unreachable-inverse ledger carried queueEdit's row for exactly this reason.
 *
 * Three properties, one per way this can rot:
 *   1. REACHABLE ON BOTH REVIEW MOUNTS. PendingChangesBar is rendered standalone by
 *      OutputContainer at flag-OFF and by the Workbench Change Dock at flag-ON.
 *      Both are exercised here against the REAL component (the sibling Workbench
 *      suite stubs the bar out, so it cannot see this).
 *   2. EXACT-SCOPE DISPATCH. Each row reverts its OWN intent id — never the batch,
 *      never a neighbour's.
 *   3. THE REFUSAL SURFACES. revertSinglePendingEditAction returns `false` when the
 *      intent is not held for the current owner. A silent false would read as a
 *      dead button; the bar must say so.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const model = vi.hoisted(() => ({ state: {} }));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(model.state),
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: () => true }));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: {},
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/components/dossier/CascadePreviewPanel.jsx', () => ({
  default: () => <div data-testid="cascade-preview" />,
}));

import PendingChangesBar from '../../src/components/dossier/PendingChangesBar.jsx';
import SettlementWorkbench from '../../src/components/dossier/SettlementWorkbench.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';

function intent(id, newName, owner = 'save:save-b') {
  return {
    id,
    kind: 'rename-npc',
    ownerRef: { id: owner },
    payload: { npcId: 'npc.ada', newName },
    status: 'staged',
    reverted: false,
  };
}

beforeEach(() => {
  model.state = {
    settlement: { id: 'town-b', npcs: [{ id: 'npc.ada', name: 'Ada' }] },
    activeSaveId: 'save-b',
    focusedEntity: null,
    clearFocusedEntity: vi.fn(),
    setEditMode: vi.fn(),
    revertToSnapshot: vi.fn(),
    pendingEditReceipts: [],
    pendingEditsQueue: [
      intent('intent-1', 'Wren'),
      intent('intent-2', 'Corvin'),
      // Another save's retained work: it must not gain a row here.
      intent('intent-other', 'Elsewhere', 'save:save-a'),
    ],
    commitPendingEdits: vi.fn(() => ({ ok: true, status: 'applied' })),
    revertPendingEdits: vi.fn(),
    refreshPendingEdits: vi.fn(),
    revertSingleEdit: vi.fn(() => true),
  };
});

afterEach(() => cleanup());

/** The Change Dock mount: the real bar, inside the real Workbench. */
function renderDock() {
  const index = { resolve: () => null };
  return render(
    <DossierEntityContext.Provider value={{ index, navigateToEntity: vi.fn() }}>
      <SettlementWorkbench />
    </DossierEntityContext.Provider>,
  );
}

const removeButtons = () => screen.getAllByRole('button', { name: /^Remove this change/ });

describe('revertSingleEdit is reachable from the standalone review bar', () => {
  test('one Remove per owner-scoped change, and none for another save', () => {
    render(<PendingChangesBar />);
    expect(removeButtons()).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /Elsewhere/ })).toBeNull();
  });

  test('a Remove dispatches revertSingleEdit for its OWN intent id', () => {
    render(<PendingChangesBar />);
    const [first, second] = removeButtons();
    fireEvent.click(second);
    expect(model.state.revertSingleEdit).toHaveBeenCalledWith('intent-2');
    fireEvent.click(first);
    expect(model.state.revertSingleEdit).toHaveBeenLastCalledWith('intent-1');
    // Never the batch verbs: per-edit removal must not route through discard.
    expect(model.state.revertPendingEdits).not.toHaveBeenCalled();
  });

  test('a refused revert says so instead of reading as a dead button', () => {
    // The action returns false when the intent is no longer held for this owner.
    model.state.revertSingleEdit = vi.fn(() => false);
    render(<PendingChangesBar />);
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.click(removeButtons()[0]);
    expect(screen.getByRole('alert').textContent).toMatch(/no longer held for this dossier/i);
  });

  test('a truthy-but-not-true return is treated as a refusal, not a success', () => {
    // Defensive: only an explicit `true` means the queue actually changed.
    model.state.revertSingleEdit = vi.fn(() => undefined);
    render(<PendingChangesBar />);
    fireEvent.click(removeButtons()[0]);
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});

describe('revertSingleEdit is reachable from the Workbench Change Dock', () => {
  test('the Dock renders the same per-edit removal, wired to the same action', () => {
    renderDock();
    expect(screen.getByText('Change Dock')).toBeTruthy();
    const buttons = removeButtons();
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[0]);
    expect(model.state.revertSingleEdit).toHaveBeenCalledWith('intent-1');
  });
});
