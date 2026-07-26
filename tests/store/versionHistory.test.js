/**
 * versionHistory.test.js — Contract over P133 / E-5 snapshot mutations.
 *
 * Pins the behavior of recordSnapshot + revertToSnapshot so a future
 * refactor (richer kind taxonomy, server-side compression, etc.) can't
 * silently break the version timeline.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

function makeStore() {
  return create(immer((set, get, store) => createSettlementSlice(set, get, store)));
}

describe('version history mutations', () => {
  let useStore;

  beforeEach(() => {
    useStore = makeStore();
    useStore.setState({
      settlement: {
        name: 'Hightower\'s Reach',
        population: 4200,
        tier: 'town',
      },
      savedSettlements: [
        {
          id: 'save-1',
          settlement: { name: 'Hightower\'s Reach', population: 4200, tier: 'town' },
        },
      ],
    });
  });

  it('recordSnapshot appends to the draftVersionHistory sibling when no saveId', () => {
    const snap = useStore.getState().recordSnapshot({ kind: 'manual', label: 'After session 3' });
    const state = useStore.getState();
    // Draft timeline is a SIBLING to the settlement, never inside it.
    expect(state.draftVersionHistory).toHaveLength(1);
    // recordSnapshot returns a Track K §C1 ActionResult envelope; the snapshot
    // id is surfaced on after.snapshotId (the raw snapshot rides in receipts[0]).
    expect(state.draftVersionHistory[0].id).toBe(snap.after.snapshotId);
    expect(state.draftVersionHistory[0].kind).toBe('manual');
    expect(state.draftVersionHistory[0].label).toBe('After session 3');
    expect(state.draftVersionHistory[0].settlement.name).toBe('Hightower\'s Reach');
    // The settlement itself never carries a versionHistory key.
    expect(state.settlement.versionHistory).toBeUndefined();
    // And the snapshot payload never nests its own timeline.
    expect(state.draftVersionHistory[0].settlement.versionHistory).toBeUndefined();
  });

  it('recordSnapshot writes onto the matching save when saveId is given', () => {
    useStore.getState().recordSnapshot({ saveId: 'save-1', kind: 'manual', label: 'pre-session-4' });
    const save = useStore.getState().savedSettlements.find(s => s.id === 'save-1');
    expect(save.versionHistory).toHaveLength(1);
    expect(save.versionHistory[0].label).toBe('pre-session-4');
  });

  it('recordSnapshot uses the saved settlement payload when saveId is given', () => {
    useStore.setState(s => {
      s.settlement.name = 'Different Live Town';
      s.savedSettlements[0].settlement.name = 'Saved Hollowmere';
    });

    useStore.getState().recordSnapshot({ saveId: 'save-1', kind: 'manual', label: 'saved copy' });

    const save = useStore.getState().savedSettlements.find(s => s.id === 'save-1');
    expect(save.versionHistory[0].settlement.name).toBe('Saved Hollowmere');
  });

  it('recordSnapshot defaults to the active saved settlement and snapshots the live payload', () => {
    useStore.setState(s => {
      s.activeSaveId = 'save-1';
      s.settlement.name = 'Edited Live Reach';
      s.savedSettlements[0].settlement.name = 'Stored Reach';
    });

    useStore.getState().recordSnapshot({ kind: 'manual', label: 'active save checkpoint' });

    const save = useStore.getState().savedSettlements.find(s => s.id === 'save-1');
    expect(save.versionHistory).toHaveLength(1);
    expect(save.versionHistory[0].label).toBe('active save checkpoint');
    expect(save.versionHistory[0].settlement.name).toBe('Edited Live Reach');
    expect(useStore.getState().settlement.versionHistory).toBeUndefined();
  });

  it('recordSnapshot freezes a deep copy — later mutations do not bleed into history', () => {
    useStore.getState().recordSnapshot({ kind: 'manual', label: 'Before rename' });
    useStore.setState(s => { s.settlement.name = 'Renamed Town'; });
    const history = useStore.getState().draftVersionHistory;
    expect(history[0].settlement.name).toBe('Hightower\'s Reach');
    expect(useStore.getState().settlement.name).toBe('Renamed Town');
  });

  it('revertToSnapshot restores prior settlement state', () => {
    const snap = useStore.getState().recordSnapshot({ kind: 'manual', label: 'Checkpoint' });
    useStore.setState(s => { s.settlement.name = 'Mutated'; });
    expect(useStore.getState().settlement.name).toBe('Mutated');
    // revertToSnapshot returns a Track K §C1 ActionResult envelope on success.
    const ok = useStore.getState().revertToSnapshot({ snapshotId: snap.after.snapshotId });
    expect(ok.ok).toBe(true);
    expect(useStore.getState().settlement.name).toBe('Hightower\'s Reach');
  });

  it('revertToSnapshot defaults to the active saved settlement timeline', () => {
    useStore.setState(s => {
      s.activeSaveId = 'save-1';
      s.settlement.name = 'Before Active Revert';
      s.savedSettlements[0].versionHistory = [{
        id: 'snap-active',
        kind: 'manual',
        label: 'Active save target',
        settlement: { name: 'Restored Saved Reach', population: 4200, tier: 'town' },
      }];
    });

    const ok = useStore.getState().revertToSnapshot({ snapshotId: 'snap-active' });

    expect(ok.ok).toBe(true);
    expect(useStore.getState().settlement.name).toBe('Restored Saved Reach');
    expect(useStore.getState().savedSettlements[0].settlement.name).toBe('Restored Saved Reach');
  });

  it('revertToSnapshot (draft) is genuinely non-destructive — pre-revert survives and re-revert works', () => {
    // Snapshot A (the state we will roll back TO).
    const snapA = useStore.getState().recordSnapshot({ kind: 'manual', label: 'Checkpoint A' });
    // Mutate the live settlement away from A.
    useStore.setState(s => { s.settlement.name = 'Mutated State'; });

    // Revert to A. This auto-records a pre-revert snapshot of the CURRENT
    // ('Mutated State') settlement into the sibling timeline, then restores A.
    const ok = useStore.getState().revertToSnapshot({ snapshotId: snapA.after.snapshotId });
    expect(ok.ok).toBe(true);
    expect(useStore.getState().settlement.name).toBe('Hightower\'s Reach');

    // The pre-revert snapshot SURVIVES in the sibling timeline (the old bug
    // overwrote the whole object with the target's stale embedded history and
    // discarded it). It captured the mutated state.
    const preRevert = useStore.getState().draftVersionHistory.find(s => s.kind === 'pre-revert');
    expect(preRevert).toBeTruthy();
    expect(preRevert.settlement.name).toBe('Mutated State');
    // Timeline holds both A and the pre-revert entry — nothing was destroyed.
    expect(useStore.getState().draftVersionHistory).toHaveLength(2);

    // Re-revert: rolling forward to the pre-revert snapshot restores the
    // mutated state — proving the revert is reversible, not a dead end.
    const ok2 = useStore.getState().revertToSnapshot({ snapshotId: preRevert.id });
    expect(ok2.ok).toBe(true);
    expect(useStore.getState().settlement.name).toBe('Mutated State');
  });

  it('revertToSnapshot re-derives systemState + persists campaignState — coherent in memory AND across reload (state-lifecycle-2)', () => {
    useStore.setState(s => {
      s.activeSaveId = 'save-1';
      // A STALE systemState reflecting the reverted-AWAY settlement, mirrored into the
      // persisted campaignState (hydrateFromSave prefers cs.systemState on reload).
      s.systemState = { resilience: { value: 99 }, volatility: { value: 99 } };
      s.savedSettlements[0].campaignState = {
        phase: 'draft', eventLog: [], systemState: { resilience: { value: 99 } },
      };
      s.savedSettlements[0].versionHistory = [{
        id: 'snap-x', kind: 'manual', label: 'target',
        settlement: { name: 'Restored', population: 900, tier: 'thorp' },
      }];
    });

    const ok = useStore.getState().revertToSnapshot({ snapshotId: 'snap-x' });
    expect(ok.ok).toBe(true);

    const st = useStore.getState();
    // Live systemState was re-derived from the RESTORED settlement — the stale 99 is gone.
    const expected = deriveSystemState(st.settlement);
    expect(st.systemState).toEqual(expected);
    expect(st.systemState).not.toEqual({ resilience: { value: 99 }, volatility: { value: 99 } });
    // editedAt stamped by the revert.
    expect(typeof st.editedAt).toBe('string');
    // The active save's persisted campaignState.systemState now AGREES with the live
    // view (previously it stayed stale, so the incoherence survived a restart).
    expect(st.savedSettlements[0].campaignState.systemState).toEqual(expected);
    // Reload round-trip: hydrating from the save entry reproduces the coherent state.
    useStore.getState().hydrateFromSave(st.savedSettlements[0]);
    expect(useStore.getState().systemState).toEqual(expected);
  });

  it('draft snapshots grow LINEARLY, never exponentially (anti-2^N regression pin)', () => {
    const N = 12;
    for (let i = 0; i < N; i += 1) {
      useStore.setState(s => { s.settlement.name = `Reach v${i}`; });
      useStore.getState().recordSnapshot({ kind: 'auto-commit', label: `edit ${i}` });
    }
    const history = useStore.getState().draftVersionHistory;
    // Exactly one entry per snapshot — the cap (50) is not hit at N=12.
    expect(history).toHaveLength(N);
    // No entry embeds its own timeline: payloads are pure content, so a
    // snapshot can never contain prior snapshots (the 2^N nesting bug).
    for (const entry of history) {
      expect(entry.settlement.versionHistory).toBeUndefined();
    }
    // Per-entry byte cost is bounded by the fixture content, so total size is
    // ~N × per-entry (LINEAR). Under the old nesting bug entry k embedded the
    // k-1 prior entries, so total ≈ base × 2^N — orders of magnitude larger.
    const perEntryBound = JSON.stringify(history[0]).length + 64; // + label/id slack
    const totalLen = JSON.stringify(history).length;
    expect(totalLen).toBeLessThan(N * perEntryBound);
  });

  it('revertToSnapshot returns false on an unknown snapshotId', () => {
    expect(useStore.getState().revertToSnapshot({ snapshotId: 'nope' })).toBe(false);
  });

  it('revertToSnapshot returns false when version history is empty', () => {
    expect(useStore.getState().revertToSnapshot({ snapshotId: 'any' })).toBe(false);
  });

  it('commitPendingEdits checkpoints before apply and exposes a working undo token', async () => {
    // Queue a rename-settlement edit
    await useStore.getState().queueEdit('rename-settlement', { newName: 'New Name' });
    expect(useStore.getState().pendingEditsQueue).toHaveLength(1);
    await useStore.getState().commitPendingEdits();
    // Queue is empty
    expect(useStore.getState().pendingEditsQueue).toHaveLength(0);
    // Settlement renamed
    expect(useStore.getState().settlement.name).toBe('New Name');
    // Auto-snapshot exists in the sibling draft timeline (no active save) and
    // contains the PRE-COMMIT value, not the already-renamed value.
    const history = useStore.getState().draftVersionHistory || [];
    const autoSnap = history.find(s => s.kind === 'auto-commit');
    expect(autoSnap).toBeTruthy();
    expect(autoSnap.settlement.name).toBe('Hightower\'s Reach');
    // Version labels are user-facing; internal operation tokens must not leak
    // into the dossier timeline.
    expect(autoSnap.label).toBe('Dossier change');
    // The commit's auto-snapshot never nests a timeline into its payload.
    expect(autoSnap.settlement.versionHistory).toBeUndefined();

    const receipt = useStore.getState().pendingEditReceipts.at(-1);
    expect(receipt.undoToken).toEqual({
      kind: 'snapshot',
      snapshotId: autoSnap.id,
      saveId: null,
    });
    const reverted = useStore.getState().revertToSnapshot({
      snapshotId: receipt.undoToken.snapshotId,
    });
    expect(reverted.ok).toBe(true);
    expect(useStore.getState().settlement.name).toBe('Hightower\'s Reach');
  });
});
