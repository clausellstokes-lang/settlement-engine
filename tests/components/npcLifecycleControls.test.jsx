/** @vitest-environment jsdom */
/**
 * NPC lifecycle authoring-surface tests.
 *
 * The controls translate owner actions into pending edits; they do not mutate
 * the simulation directly. The suite pins both sides of that boundary: hostage
 * actions stay available outside facet-edit mode, while reader-facing labels
 * never leak internal operation tokens.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  mobile: false,
  workbench: false,
  queueEdit: vi.fn(),
  focusEntity: vi.fn(),
  state: {
    queueEdit: null,
    focusEntity: null,
    editMode: false,
    applyUserEditAction: vi.fn(),
    revertUserEditAction: vi.fn(),
    savedSettlements: [],
    settlement: {
      npcs: [
        { id: 'npc-1', name: 'Mara' },
      ],
    },
  },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(mocks.state),
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => mocks.mobile,
}));
vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => name === 'settlementWorkbench' && mocks.workbench,
}));

import NpcLifecycleControls, {
  hasNpcLifecycleAction,
} from '../../src/components/new/NpcLifecycleControls.jsx';
import {
  describePendingEdit,
} from '../../src/components/dossier/PendingChangesBar.jsx';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';

beforeEach(() => {
  cleanup();
  mocks.mobile = false;
  mocks.workbench = false;
  mocks.queueEdit.mockReset();
  mocks.focusEntity.mockReset();
  mocks.state.applyUserEditAction.mockReset();
  mocks.state.revertUserEditAction.mockReset();
  mocks.state.queueEdit = mocks.queueEdit;
  mocks.state.focusEntity = mocks.focusEntity;
  mocks.state.editMode = false;
  mocks.state.settlement = {
    npcs: [
      { id: 'npc-1', name: 'Mara' },
    ],
  };
});

describe('NPC lifecycle actions', () => {
  test('hostage decisions remain available outside edit mode and queue a reviewable edit', () => {
    const npc = {
      id: 'npc-1',
      name: 'Mara',
      whereabouts: { state: 'hostage' },
    };

    expect(hasNpcLifecycleAction(npc)).toBe(true);
    render(
      <NpcLifecycleControls
        npc={npc}
        canAuthorNpc
        showEditor={false}
      />,
    );

    expect(screen.queryByRole('combobox')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /pay the ransom/i }));
    expect(mocks.queueEdit).toHaveBeenCalledWith('ransom-npc', { npcId: 'npc-1' });
  });

  test('facet and availability options use reader-facing labels', () => {
    render(
      <NpcLifecycleControls
        npc={{ id: 'npc-1', name: 'Mara' }}
        canAuthorNpc
        showEditor
      />,
    );

    expect(screen.getByRole('option', { name: 'Lawful good' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Away on a journey' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'In seclusion' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: /set role archetype/i })).toBeTruthy();
    expect(screen.queryByText('lawful_good')).toBeNull();
    expect(screen.queryByText(/edit \(bank\)/i)).toBeNull();
  });

  test('mobile exposes an honest disabled state and cannot enqueue an urgent action', () => {
    mocks.mobile = true;
    const npc = {
      id: 'npc-1',
      name: 'Mara',
      whereabouts: { state: 'hostage' },
    };

    render(
      <NpcLifecycleControls
        npc={npc}
        canAuthorNpc
        showEditor={false}
      />,
    );

    const ransom = screen.getByRole('button', { name: /pay the ransom/i });
    expect(ransom.disabled).toBe(true);
    expect(screen.getByRole('note').textContent).toMatch(/reviewed and applied.*desktop/i);
    fireEvent.click(ransom);
    expect(mocks.queueEdit).not.toHaveBeenCalled();
  });

  test('mobile guards facet enqueue even when an edit-mode control receives a synthetic change', () => {
    mocks.mobile = true;
    render(
      <NpcLifecycleControls
        npc={{ id: 'npc-1', name: 'Mara' }}
        canAuthorNpc
        showEditor
      />,
    );

    const goal = screen.getByRole('combobox', { name: /set goal/i });
    expect(goal.disabled).toBe(true);
    fireEvent.change(goal, { target: { value: 'restore_order' } });
    expect(mocks.queueEdit).not.toHaveBeenCalled();
  });

  test('desktop facet changes enqueue the durable NPC id, never a roster index', () => {
    render(
      <NpcLifecycleControls
        npc={{ id: 'npc-1', name: 'Mara' }}
        canAuthorNpc
        showEditor
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: /set goal/i }), {
      target: { value: 'restore_order' },
    });

    expect(mocks.queueEdit).toHaveBeenCalledWith('edit-npc', {
      npcId: 'npc-1',
      facetKind: 'goal',
      value: 'restore_order',
    });
  });

  test('a legacy NPC without a stable id is explicitly read-only', () => {
    render(
      <NpcLifecycleControls
        npc={{ name: 'Mara' }}
        canAuthorNpc
        showEditor
      />,
    );

    const goal = screen.getByRole('combobox', { name: /set goal/i });
    expect(goal.disabled).toBe(true);
    expect(screen.getByRole('note').textContent).toMatch(/no stable identity/i);
    fireEvent.change(goal, { target: { value: 'restore_order' } });
    expect(mocks.queueEdit).not.toHaveBeenCalled();
  });
});

describe('NPC facet presentation', () => {
  test('keeps the rich role while showing the declared archetype and translated goal', () => {
    const npc = {
      id: 'npc-1',
      name: 'Mara',
      role: 'Harbourmistress',
      category: 'civic',
      influence: 'high',
      facets: { role: 'military', goal: 'restore_order' },
      goal: { short: 'restore_order' },
    };
    mocks.state.settlement = { name: 'Stoneford', npcs: [npc], relationships: [] };

    render(
      <NPCsTab
        npcs={[npc]}
        settlement={mocks.state.settlement}
        canAuthorNpc
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Mara/i }));

    expect(screen.getByText(/Harbourmistress · Military archetype/)).toBeTruthy();
    expect(screen.getAllByText(/Restore order/).length).toBeGreaterThan(0);
    expect(screen.queryByText('restore_order')).toBeNull();
    expect(screen.queryByRole('button', { name: /inspect person/i })).toBeNull();
  });

  test('the flagged workbench route selects the stable NPC identity', () => {
    const npc = {
      id: 'npc-1',
      name: 'Mara',
      role: 'Harbourmistress',
      category: 'civic',
      influence: 'high',
    };
    mocks.workbench = true;
    mocks.state.settlement = { name: 'Stoneford', npcs: [npc], relationships: [] };

    render(
      <NPCsTab
        npcs={[npc]}
        settlement={mocks.state.settlement}
        canAuthorNpc
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Mara/i }));
    fireEvent.click(screen.getByRole('button', { name: /inspect person/i }));

    expect(mocks.focusEntity).toHaveBeenCalledWith('npc-1');
  });

  test('prose authoring resolves the live NPC by stable id after roster reordering', () => {
    const mara = {
      id: 'npc-1',
      name: 'Mara',
      role: 'Harbourmistress',
      category: 'civic',
      influence: 'high',
      secret: { what: 'She controls the old ferry.' },
    };
    const otto = {
      id: 'npc-2',
      name: 'Otto',
      role: 'Miller',
      category: 'civic',
      influence: 'low',
    };
    mocks.state.editMode = true;
    // The rendered projection and live store deliberately disagree on order.
    // The authoring callback must recover Mara's current index from her id.
    mocks.state.settlement = { name: 'Stoneford', npcs: [otto, mara], relationships: [] };

    render(
      <NPCsTab
        npcs={[mara]}
        settlement={{ ...mocks.state.settlement, npcs: [mara] }}
        canAuthorNpc
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Mara/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Secret for Mara' }));
    const editor = screen.getByRole('textbox', { name: 'Secret for Mara' });
    fireEvent.change(editor, { target: { value: 'She controls both ferries.' } });
    fireEvent.keyDown(editor, { key: 'Enter' });

    expect(mocks.state.applyUserEditAction).toHaveBeenCalledWith(
      'npc',
      1,
      'secret.what',
      'She controls both ferries.',
    );
  });

  test('duplicate-name legacy NPC secrets are honest read-only text, never index-routed edits', () => {
    const first = {
      name: 'Mara',
      role: 'Harbourmistress',
      category: 'civic',
      influence: 'high',
      secret: { what: 'She controls the old ferry.' },
      _userEdits: {
        'secret.what': {
          originalValue: 'She avoids the old ferry.',
          value: 'She controls the old ferry.',
        },
      },
    };
    const second = {
      name: 'Mara',
      role: 'Miller',
      category: 'civic',
      influence: 'low',
      secret: { what: 'She owns the east granary.' },
    };
    mocks.state.editMode = true;
    mocks.state.settlement = { name: 'Stoneford', npcs: [first, second], relationships: [] };

    render(
      <NPCsTab
        npcs={[first, second]}
        settlement={mocks.state.settlement}
        canAuthorNpc
      />,
    );
    for (const card of screen.getAllByRole('button', { name: /Mara/i })) {
      fireEvent.click(card);
    }

    const secrets = screen.getAllByLabelText('Secret for Mara');
    expect(secrets).toHaveLength(2);
    for (const secret of secrets) {
      fireEvent.click(secret);
      fireEvent.keyDown(secret, { key: 'Enter' });
    }

    expect(screen.queryByRole('textbox', { name: 'Secret for Mara' })).toBeNull();
    expect(screen.queryByTitle(/Revert to:/i)).toBeNull();
    expect(screen.getAllByRole('note')).toHaveLength(2);
    expect(screen.getAllByRole('note').every(note => (
      /no stable identity/i.test(note.textContent)
    ))).toBe(true);
    expect(mocks.state.applyUserEditAction).not.toHaveBeenCalled();
    expect(mocks.state.revertUserEditAction).not.toHaveBeenCalled();
  });
});

describe('pending-change language', () => {
  test('translates NPC operation tokens and resolves the NPC name', () => {
    expect(describePendingEdit(
      { kind: 'stasis-npc', payload: { npcId: 'npc-1', reason: 'sequestered' } },
      mocks.state.settlement,
    )).toBe('set Mara aside (sequestered)');
    expect(describePendingEdit(
      { kind: 'recall-npc', payload: { npcId: 'npc-1' } },
      mocks.state.settlement,
    )).toBe('recalled Mara');
  });

  test('never exposes an unknown internal operation token', () => {
    expect(describePendingEdit({ kind: 'future-internal-op', payload: {} }, mocks.state.settlement))
      .toBe('queued dossier change');
  });
});
