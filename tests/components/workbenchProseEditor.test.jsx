/** @vitest-environment jsdom */
/**
 * WorkbenchProseEditor contract (R-2 authored-prose wiring, flag-off).
 *
 * Pins the producer half of the edit-prose spine: the panel offers EXACTLY the
 * queue-wired paths (lockstep with QUEUE_WIRED_PROSE_PATHS), routes every save
 * through queueEdit('edit-prose', …) with a resolved stable target, refuses to
 * guess on ambiguous identity, and stays desktop/edit-capable-only inside the
 * inspector. Plus the flag gate: the whole Workbench mounts nothing when the
 * settlementWorkbench flag is down, so this surface is invisible until owner
 * promotion.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  state: {},
  mobile: false,
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

import WorkbenchProseEditor, { PROSE_FIELD_LABELS } from '../../src/components/dossier/WorkbenchProseEditor.jsx';
import SettlementWorkbench from '../../src/components/dossier/SettlementWorkbench.jsx';
import SettlementWorkbenchMount from '../../src/components/dossier/SettlementWorkbenchMount.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { QUEUE_WIRED_PROSE_PATHS } from '../../src/store/settlementPendingEdits.js';

function fixtureSettlement() {
  return {
    id: 'town.bridgeford',
    name: 'Bridgeford',
    arrivalScene: 'A stone bridge across the river.',
    pressureSentence: 'Levies are rising.',
    settlementReason: ['Founded at the ford.'],
    prominentRelationship: { phrasing: 'The reeve owes the smith.' },
    history: {
      historicalCharacter: 'Steady.',
      founding: { reason: 'Ford trade.', initialChallenge: 'Floods.', overcoming: 'Levees.', stressNote: null, foundedBy: 'River clans.' },
      historicalEvents: [],
      currentTensions: [],
    },
    economicViability: { summary: 'Solvent.' },
    economicState: { safetyProfile: { safetyDesc: 'Quiet.', guardEffectivenessDesc: 'Adequate.', economicDragDesc: 'Low.' } },
    institutions: [{ id: 'inst.market', name: 'Market', desc: 'A daily market.' }],
    powerStructure: {
      factions: [{ faction: 'Merchant Guild', desc: 'Old money.' }],
      conflicts: [],
    },
    npcs: [],
  };
}

function factionEntry(settlement) {
  return {
    id: 'merchant_guild',
    type: 'faction',
    label: 'Merchant Guild',
    currentName: 'Merchant Guild',
    identity: { interactive: true },
    raw: settlement.powerStructure.factions[0],
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

// The owner namespace pendingEditOwnerScope() derives for the fixture: no
// activeSaveId, so the draft key is built from the settlement id. Records
// stamped with any other owner are filtered out of the Dock by design, which is
// exactly why the seed has to name this one.
const DOCK_OWNER_KEY = 'draft:town.bridgeford';

/**
 * The minimum state under which ChangeDock actually renders: one un-reverted
 * queued edit (drives the PendingChangesBar half) and one applied receipt with a
 * snapshot undo token (drives the recent-results half). Shared verbatim by the
 * free and premium Dock cases so the only difference between them is the tier.
 */
const DOCK_SEED = {
  pendingEditsQueue: [{
    id: 'intent-dock-1',
    kind: 'edit-prose',
    ownerRef: { id: DOCK_OWNER_KEY },
    target: { entityKind: 'faction', entityIndex: 0, path: 'desc' },
    value: 'They answer to no crown.',
  }],
  pendingEditReceipts: [{
    id: 'receipt-dock-1',
    intentId: 'intent-dock-1',
    status: 'applied',
    ownerRef: { id: DOCK_OWNER_KEY },
    undoToken: { kind: 'snapshot', snapshotId: 'snap-1', saveId: null },
  }],
  revertToSnapshot: vi.fn(),
};

afterEach(() => cleanup());
beforeEach(() => { mocks.mobile = false; });

describe('field roster stays in lockstep with the queue-wired registry', () => {
  test('PROSE_FIELD_LABELS offers exactly QUEUE_WIRED_PROSE_PATHS, kind for kind', () => {
    expect(Object.keys(PROSE_FIELD_LABELS).sort())
      .toEqual(Object.keys(QUEUE_WIRED_PROSE_PATHS).sort());
    for (const [kind, fields] of Object.entries(PROSE_FIELD_LABELS)) {
      expect(fields.map(f => f.path)).toEqual([...QUEUE_WIRED_PROSE_PATHS[kind]]);
      for (const field of fields) {
        expect(field.label, `${kind}.${field.path} has a human label`).toBeTruthy();
      }
    }
  });
});

describe('authoring routes through the queue with a resolved target', () => {
  test('a faction description is queued as edit-prose with entityIndex resolved by reference', async () => {
    const settlement = fixtureSettlement();
    setState(settlement);
    render(<WorkbenchProseEditor entry={factionEntry(settlement)} />);

    expect(screen.getByText('Old money.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Write your own' }));
    const box = screen.getByLabelText('Description text');
    fireEvent.change(box, { target: { value: 'They answer to no crown.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Queue this text' }));

    await waitFor(() => {
      expect(mocks.state.queueEdit).toHaveBeenCalledWith('edit-prose', {
        entityKind: 'faction',
        entityIndex: 0,
        path: 'desc',
        value: 'They answer to no crown.',
      });
    });
    expect(await screen.findByText(/Queued for review/)).toBeTruthy();
  });

  test('a refused queue result reports honestly instead of pretending', async () => {
    const settlement = fixtureSettlement();
    setState(settlement, { queueEdit: vi.fn(() => Promise.resolve(null)) });
    render(<WorkbenchProseEditor entry={factionEntry(settlement)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Write your own' }));
    fireEvent.change(screen.getByLabelText('Description text'), { target: { value: 'New text.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Queue this text' }));

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText(/Not queued/)).toBeTruthy();
  });

  test('the settlement entry offers all 14 root fields', () => {
    const settlement = fixtureSettlement();
    setState(settlement);
    render(
      <WorkbenchProseEditor
        entry={{ id: 'town.bridgeford', type: 'settlement', label: 'Bridgeford', currentName: 'Bridgeford', raw: settlement }}
      />,
    );
    for (const field of PROSE_FIELD_LABELS.settlement) {
      expect(screen.getByText(field.label), field.path).toBeTruthy();
    }
  });

  test('an authored field shows its hand-written state and restore goes through the registered revert', () => {
    const settlement = fixtureSettlement();
    settlement.powerStructure.factions[0]._userEdits = {
      desc: { value: 'Old money.', originalValue: 'Generated.', editedAt: 'ts' },
    };
    settlement.powerStructure.factions[0]._authored = true;
    setState(settlement);
    render(<WorkbenchProseEditor entry={factionEntry(settlement)} />);

    expect(screen.getByText('Hand-written')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Restore generated' }));
    expect(mocks.state.revertUserEditAction).toHaveBeenCalledWith('faction', 0, 'desc');
  });

  test('an entity that cannot be uniquely matched gets a refusal note, never a guess', () => {
    const settlement = fixtureSettlement();
    // Duplicate display names and a foreign raw reference: no unique match.
    settlement.powerStructure.factions = [
      { faction: 'Merchant Guild', desc: 'One.' },
      { faction: 'Merchant Guild', desc: 'Two.' },
    ];
    setState(settlement);
    render(
      <WorkbenchProseEditor
        entry={{ ...factionEntry(settlement), raw: { faction: 'Merchant Guild', desc: 'Stale copy.' } }}
      />,
    );
    expect(screen.getByText(/cannot be uniquely matched/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Write your own' })).toBeNull();
  });
});

describe('inspector gating', () => {
  function renderInspector(entry, props = {}) {
    setState(fixtureSettlement(), { focusedEntity: { id: entry.id, ts: 1 } });
    const index = { resolve: id => (entry.id === id ? entry : null) };
    return render(
      <DossierEntityContext.Provider value={{ index, navigateToEntity: vi.fn() }}>
        <SettlementWorkbench {...props} />
      </DossierEntityContext.Provider>,
    );
  }

  test('a focused faction exposes the authoring panel on desktop', async () => {
    const settlement = fixtureSettlement();
    const entry = factionEntry(settlement);
    setState(settlement, { focusedEntity: { id: entry.id, ts: 1 } });
    render(
      <DossierEntityContext.Provider value={{ index: { resolve: id => (entry.id === id ? entry : null) }, navigateToEntity: vi.fn() }}>
        <SettlementWorkbench />
      </DossierEntityContext.Provider>,
    );
    expect(await screen.findByRole('heading', { name: 'Write your own' })).toBeTruthy();
  });

  test('readOnly hides authoring', async () => {
    const settlement = fixtureSettlement();
    const entry = factionEntry(settlement);
    setState(settlement, { focusedEntity: { id: entry.id, ts: 1 } });
    render(
      <DossierEntityContext.Provider value={{ index: { resolve: id => (entry.id === id ? entry : null) }, navigateToEntity: vi.fn() }}>
        <SettlementWorkbench readOnly />
      </DossierEntityContext.Provider>,
    );
    // The inspector itself renders; the authoring section must not.
    expect(screen.getByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  test('mobile hides authoring (commit review is a desktop surface)', () => {
    mocks.mobile = true;
    const settlement = fixtureSettlement();
    const entry = factionEntry(settlement);
    setState(settlement, { focusedEntity: { id: entry.id, ts: 1 } });
    render(
      <DossierEntityContext.Provider value={{ index: { resolve: id => (entry.id === id ? entry : null) }, navigateToEntity: vi.fn() }}>
        <SettlementWorkbench />
      </DossierEntityContext.Provider>,
    );
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  test('an npc entry gets no prose panel (its authoring lives on the card path)', () => {
    const entry = {
      id: 'npc_1', type: 'npc', label: 'Aldis', currentName: 'Aldis',
      identity: { interactive: true }, raw: { id: 'npc_1', name: 'Aldis' },
    };
    renderInspector(entry);
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  test('flag down: the Workbench mount renders nothing at all', () => {
    const { container } = render(<SettlementWorkbenchMount enabled={false} readOnly={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('premium-gate parity at the mount (R-2 MUST-FIX 3)', () => {
  // The Create flow chain (GenerateWizard → OutputContainer readOnly=false →
  // SettlementWorkbenchMount) carries no tier check of its own, so the mount
  // must hold the sibling authority (SettlementDetail canEdit: premium /
  // founder / elevated) before any authoring lever renders. The upstream
  // readOnly prop must still win, so the Library mount's closure is unchanged.
  function renderMount({ entryType = 'faction', readOnly = false, auth, elevated = false, dockSeed = false } = {}) {
    const settlement = fixtureSettlement();
    const entry = entryType === 'npc'
      ? {
          id: 'npc_1', type: 'npc', label: 'Aldis', currentName: 'Aldis',
          identity: { interactive: true }, raw: { id: 'npc_1', name: 'Aldis' },
        }
      : factionEntry(settlement);
    setState(settlement, {
      focusedEntity: { id: entry.id, ts: 1 },
      auth,
      ...(elevated ? { isElevated: () => true } : {}),
      ...(dockSeed ? DOCK_SEED : {}),
    });
    const index = { resolve: id => (entry.id === id ? entry : null) };
    return render(
      <DossierEntityContext.Provider value={{ index, navigateToEntity: vi.fn() }}>
        <SettlementWorkbenchMount enabled readOnly={readOnly} />
      </DossierEntityContext.Provider>,
    );
  }

  test('free tier on the Create flow gets the read-only inspector and NO prose editor', async () => {
    renderMount({ auth: { tier: 'free' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  test('anon (no auth state at all) fails closed the same way', async () => {
    renderMount({ auth: undefined });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  test('premium on the Create flow gets the prose editor', async () => {
    renderMount({ auth: { tier: 'premium' } });
    expect(await screen.findByRole('heading', { name: 'Write your own' })).toBeTruthy();
  });

  test('founder holds the same authority as the Library canEdit', async () => {
    renderMount({ auth: { tier: 'founder' } });
    expect(await screen.findByRole('heading', { name: 'Write your own' })).toBeTruthy();
  });

  test('an elevated role holds the authority regardless of tier', async () => {
    renderMount({ auth: { tier: 'free' }, elevated: true });
    expect(await screen.findByRole('heading', { name: 'Write your own' })).toBeTruthy();
  });

  test('NPC-path parity: premium keeps Edit NPC details; free loses it', async () => {
    renderMount({ entryType: 'npc', auth: { tier: 'premium' } });
    expect(await screen.findByRole('button', { name: 'Edit NPC details' })).toBeTruthy();
    cleanup();
    renderMount({ entryType: 'npc', auth: { tier: 'free' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Edit NPC details' })).toBeNull();
  });

  test('the upstream readOnly prop still wins for a premium viewer (Library closure intact)', async () => {
    renderMount({ readOnly: true, auth: { tier: 'premium' } });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Write your own' })).toBeNull();
  });

  // ── THE DOCK PIN (R-4; the R-3 verify note's half-vacuity cure) ─────────────
  // The gate's SUPPRESSION half was untestable above: with an empty
  // pendingEditsQueue and no receipts, ChangeDock returns null for every tier,
  // so "free tier sees no Dock" proved nothing. These two cases run the SAME
  // seeded state — one staged edit plus one applied receipt in the mount's own
  // owner scope, the exact state under which the Dock DOES render — and differ
  // only in tier. The premium case is the positive control: if the Dock stopped
  // rendering for reasons unrelated to the gate, it reds too and the absence
  // assertion below can never quietly become vacuous again.
  test('free tier is denied the Change Dock even with staged work the Dock would show', async () => {
    renderMount({ auth: { tier: 'free' }, dockSeed: true });
    expect(await screen.findByText('Entity Inspector', { exact: false })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
    expect(screen.queryByTestId('pending-review')).toBeNull();
  });

  test('premium sees the Change Dock under that identical seed (the positive control)', async () => {
    renderMount({ auth: { tier: 'premium' }, dockSeed: true });
    expect(await screen.findByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByTestId('pending-review')).toBeTruthy();
    expect(screen.getByText(/Applied/)).toBeTruthy();
  });
});
