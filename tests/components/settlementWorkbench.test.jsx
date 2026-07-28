/** @vitest-environment jsdom */
/**
 * SettlementWorkbench proof-slice contract.
 *
 * These tests pin the migration boundary rather than visual decoration: the
 * inspector reads the existing stable dossier index, missing causes stay honest,
 * authoring routes through existing actions, and the dock projects the one queue
 * instead of creating a second mutation store.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  state: {},
  mobile: false,
  navigateToEntity: vi.fn(),
  clearFocusedEntity: vi.fn(),
  setEditMode: vi.fn(),
  revertToSnapshot: vi.fn(),
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(mocks.state),
}));

vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => mocks.mobile,
}));

vi.mock('../../src/components/dossier/PendingChangesBar.jsx', () => ({
  default: () => <div data-testid="pending-review">Pending review</div>,
}));

import SettlementWorkbench from '../../src/components/dossier/SettlementWorkbench.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';

function renderWorkbench(entry, state = {}, props = {}, indexOverride = null) {
  mocks.state = {
    focusedEntity: entry ? { id: entry.id, ts: 1 } : null,
    clearFocusedEntity: mocks.clearFocusedEntity,
    setEditMode: mocks.setEditMode,
    revertToSnapshot: mocks.revertToSnapshot,
    pendingEditsQueue: [],
    pendingEditReceipts: [],
    ...state,
  };
  const index = indexOverride || { resolve: id => (entry?.id === id ? entry : null) };
  return render(
    <DossierEntityContext.Provider value={{ index, navigateToEntity: mocks.navigateToEntity }}>
      <SettlementWorkbench {...props} />
    </DossierEntityContext.Provider>,
  );
}

beforeEach(() => {
  mocks.mobile = false;
  mocks.navigateToEntity.mockReset();
  mocks.clearFocusedEntity.mockReset();
  mocks.setEditMode.mockReset();
  mocks.revertToSnapshot.mockReset();
});

afterEach(() => cleanup());

describe('Entity Inspector', () => {
  const npc = {
    id: 'npc.mara',
    type: 'npc',
    label: 'Mara',
    currentName: 'Mara',
    raw: {
      id: 'npc.mara',
      name: 'Mara',
      role: 'Guildmaster',
      factionAffiliation: 'River Guild',
    },
  };

  test('uses the stable dossier entry and names unavailable cause evidence honestly', () => {
    renderWorkbench(npc);

    expect(screen.getByRole('heading', { name: 'Mara' })).toBeTruthy();
    expect(screen.getByText(/No recorded cause is attached/i)).toBeTruthy();
    expect(screen.getByText('River Guild')).toBeTruthy();
  });

  test('routes authoring and navigation through the existing dossier actions', () => {
    renderWorkbench(npc);

    fireEvent.click(screen.getByRole('button', { name: 'Edit NPC details' }));
    expect(mocks.setEditMode).toHaveBeenCalledWith(true);
    expect(mocks.navigateToEntity).toHaveBeenCalledWith('npc.mara');

    fireEvent.click(screen.getByRole('button', { name: 'Close Entity Inspector' }));
    expect(mocks.clearFocusedEntity).toHaveBeenCalledTimes(1);
  });

  test('links only a connection with one proven stable dossier target', () => {
    const faction = {
      id: 'faction.river_guild',
      type: 'faction',
      label: 'River Guild',
      currentName: 'River Guild',
      raw: { faction: 'River Guild' },
    };
    const index = {
      byId: new Map([
        [npc.id, npc],
        [faction.id, faction],
      ]),
      resolve: id => (id === npc.id ? npc : id === faction.id ? faction : null),
    };
    renderWorkbench(npc, {}, {}, index);

    fireEvent.click(screen.getByRole('button', { name: 'Go to River Guild' }));
    expect(mocks.navigateToEntity).toHaveBeenCalledWith(faction.id);
  });

  // MATRIX ROW M7 — a readOnly caller that passes NO canReview gets no dock.
  //
  // WHY THE QUEUE IS SEEDED HERE. This row was VACUOUS until 2026-07-28: the
  // harness defaults pendingEditsQueue/pendingEditReceipts to EMPTY, and
  // ChangeDock returns null on its own emptiness branch before `canReview` is
  // consulted at all. The dock was therefore absent for a reason that had
  // nothing to do with the entitlement default, and flipping that default to
  // true left this row green. Staging real owner-scoped work (no ownerRef, so
  // it passes the owner-scope filter exactly as the Change Dock rows below
  // stage it) makes the absence attributable to the default and nothing else.
  // Refutation executed: with `canReview = true` in the signature this row
  // fails on the Change Dock heading.
  test('keeps inspection available without exposing authoring to a read-only owner', () => {
    renderWorkbench(npc, {
      pendingEditsQueue: [{
        id: 'edit-1',
        kind: 'rename-settlement',
        payload: { newName: 'Newhaven' },
        reverted: false,
      }],
      pendingEditReceipts: [{
        intentId: 'edit-0',
        status: 'applied',
        summary: 'NPC goal changed',
      }],
    }, { readOnly: true });

    expect(screen.getByRole('heading', { name: 'Mara' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Edit NPC details' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
  });

  // The signature half of M7, pinned at the source so the two halves fail for
  // DIFFERENT reasons: the render row above proves the behaviour, this proves
  // the declared default that produces it. A render-only pin can be silenced by
  // an unrelated change to what the dock chooses to render; this one cannot.
  test('the SettlementWorkbench signature defaults canReview to false', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/dossier/SettlementWorkbench.jsx'),
      'utf-8',
    );
    const signature = source.match(/export default function SettlementWorkbench\(([^)]*)\)/);
    expect(signature, 'the default export signature moved — re-point this pin').toBeTruthy();
    expect(
      signature[1],
      'canReview must DECLARE its false default: an entitlement that defaults open '
      + 'hands the review surface to every standalone readOnly render.',
    ).toMatch(/canReview\s*=\s*false/);
  });

  test('keeps mobile inspection readable without advertising a dead-end authoring path', () => {
    mocks.mobile = true;
    renderWorkbench(npc);

    expect(screen.getByRole('heading', { name: 'Mara' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Edit NPC details' })).toBeNull();
    expect(screen.getByRole('note').textContent).toMatch(/authoring remains available.*desktop/i);
  });

  test('moves focus into the inspector and Escape closes back to the invoking control', async () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Open Mara';
    document.body.append(trigger);
    trigger.focus();

    renderWorkbench(npc);

    const dialog = screen.getByRole('dialog', { name: 'Mara' });
    expect(document.activeElement).toBe(dialog);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mocks.clearFocusedEntity).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    trigger.remove();
  });
});

describe('Change Dock', () => {
  const savedSettlement = {
    settlement: { id: 'town-a', name: 'A' },
    activeSaveId: 'save-a',
  };

  function appliedReceipt(intentId, overrides = {}) {
    return {
      intentId,
      ownerRef: { id: 'save:save-a', saveId: 'save-a' },
      status: 'applied',
      summary: `${intentId} applied`,
      undoToken: {
        kind: 'snapshot',
        snapshotId: 'snapshot-before-batch',
        saveId: 'save-a',
      },
      ...overrides,
    };
  }

  test('projects staged work and recent results from the existing queue state', () => {
    renderWorkbench(null, {
      pendingEditsQueue: [{
        id: 'edit-1',
        kind: 'rename-settlement',
        payload: { newName: 'Newhaven' },
        reverted: false,
      }],
      pendingEditReceipts: [{
        intentId: 'edit-0',
        status: 'applied',
        summary: 'NPC goal changed',
      }],
    });

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByTestId('pending-review')).toBeTruthy();
    expect(screen.getByText(/Applied/)).toBeTruthy();
    expect(screen.getByText(/NPC goal changed/)).toBeTruthy();
  });

  test('renders recorded outcome and explanation as separate facts', () => {
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [{
        intentId: 'edit-failed',
        ownerRef: { id: 'save:save-a', saveId: 'save-a' },
        status: 'failed',
        summary: 'No settlement write committed',
        reason: 'source_changed',
      }],
    });

    expect(screen.getByText('Outcome')).toBeTruthy();
    expect(screen.getByText(/Failed: No settlement write committed/)).toBeTruthy();
    expect(screen.getByText('Explanation')).toBeTruthy();
    expect(screen.getByText(/source changed/i)).toBeTruthy();
  });

  test('does not turn a receipt with no outcome status into a fabricated failure', () => {
    renderWorkbench(null, {
      pendingEditReceipts: [{
        intentId: 'legacy-receipt',
        summary: 'Legacy receipt retained',
      }],
    });

    expect(screen.getByText(/Recorded: Legacy receipt retained/)).toBeTruthy();
    expect(screen.queryByText(/Failed: Legacy receipt retained/)).toBeNull();
    expect(screen.queryByText('Explanation')).toBeNull();
  });

  test('adds no permanent chrome when there is no staged work or receipt', () => {
    renderWorkbench(null);
    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
  });

  test('does not project another save’s retained intent or receipt', () => {
    renderWorkbench(null, {
      settlement: { id: 'town-b', name: 'B' },
      activeSaveId: 'save-b',
      pendingEditsQueue: [{
        id: 'edit-a',
        kind: 'rename-settlement',
        ownerRef: { id: 'save:save-a' },
        payload: { newName: 'Only A' },
      }],
      pendingEditReceipts: [{
        intentId: 'edit-a',
        ownerRef: { id: 'save:save-a' },
        status: 'applied',
        summary: 'Only A result',
      }],
    });

    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
    expect(screen.queryByText(/Only A result/)).toBeNull();
  });

  test('offers one batch-level undo for successful receipts sharing an active-save snapshot', () => {
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [
        appliedReceipt('edit-1'),
        appliedReceipt('edit-2'),
      ],
    });

    expect(screen.getAllByRole('button', { name: 'Undo last batch' })).toHaveLength(1);
  });

  test('does not invent undo for a missing token or another owner’s token', () => {
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [
        appliedReceipt('edit-without-token', { undoToken: null }),
        appliedReceipt('edit-for-b', {
          ownerRef: { id: 'save:save-b', saveId: 'save-b' },
          undoToken: {
            kind: 'snapshot',
            snapshotId: 'snapshot-for-b',
            saveId: 'save-b',
          },
        }),
      ],
    });

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Undo/i })).toBeNull();
  });

  test('reverts through the authoritative snapshot action once and confirms success', async () => {
    mocks.revertToSnapshot.mockResolvedValue({ ok: true });
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [appliedReceipt('edit-1')],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Undo last batch' }));

    await waitFor(() => {
      expect(mocks.revertToSnapshot).toHaveBeenCalledWith({
        saveId: 'save-a',
        snapshotId: 'snapshot-before-batch',
      });
      expect(screen.getByRole('status').textContent).toMatch(/last applied batch was undone/i);
    });

    const completedButton = screen.getByRole('button', { name: 'Undone' });
    expect(completedButton.disabled).toBe(true);
    fireEvent.click(completedButton);
    expect(mocks.revertToSnapshot).toHaveBeenCalledTimes(1);
  });

  // REVIEW-ONLY MODE. `canReview` is the entitlement half of the gate, threaded
  // from the mount's single viewerCanAuthor read; `readOnly` remains the
  // authoring half. The default-false pin (matrix row M7) lives above, now in
  // two halves — the render row 'keeps inspection available without exposing
  // authoring to a read-only owner', which stages a NON-EMPTY queue so the
  // dock's absence is attributable to the default, and the source-level
  // signature row beside it. Mount-level behaviour, including the free/anon
  // negative control, is pinned in settlementWorkbenchMount.test.jsx.
  test('opens the staged queue for review when a read-only viewer holds review authority', () => {
    renderWorkbench(null, {
      pendingEditsQueue: [{
        id: 'edit-1',
        kind: 'rename-settlement',
        payload: { newName: 'Newhaven' },
        reverted: false,
      }],
    }, { readOnly: true, canReview: true });

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByTestId('pending-review')).toBeTruthy();
    expect(screen.getByRole('note').textContent)
      .toMatch(/Editing is closed on this view.*review, commit, or discard/is);
  });

  test('review authority alone adds no dock when the queue and receipts are empty', () => {
    renderWorkbench(null, {}, { readOnly: true, canReview: true });

    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
    expect(screen.queryByText(/Editing is closed on this view/i)).toBeNull();
  });

  test('does not narrate a closed editor to a viewer whose editor is open', () => {
    renderWorkbench(null, {
      pendingEditsQueue: [{
        id: 'edit-1',
        kind: 'rename-settlement',
        payload: { newName: 'Newhaven' },
        reverted: false,
      }],
    }, { readOnly: false, canReview: true });

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.queryByText(/Editing is closed on this view/i)).toBeNull();
  });

  test('keeps post-commit receipts and Undo reachable in review-only mode', () => {
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [appliedReceipt('edit-1')],
    }, { readOnly: true, canReview: true });

    // Recorded JUDGMENT: the receipts branch is deliberately NOT gated on
    // !readOnly, so committing in review mode does not delete the surface
    // carrying its own result note and Undo. Veto = one condition here.
    expect(screen.getByText(/edit-1 applied/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Undo last batch' })).toBeTruthy();
  });

  test('keeps the recorded result and offers a truthful retry when revert fails', async () => {
    mocks.revertToSnapshot.mockResolvedValue(false);
    renderWorkbench(null, {
      ...savedSettlement,
      pendingEditReceipts: [appliedReceipt('edit-1')],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Undo last batch' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/result remains on record/i);
    });
    expect(screen.getByRole('button', { name: 'Try Undo again' }).disabled).toBe(false);
  });
});
