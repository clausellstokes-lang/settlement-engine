/** @vitest-environment jsdom */
/**
 * NPC authoring is a dossier capability, not a consequence of the global
 * editMode bit. These rendered regressions deliberately leave editMode stale
 * while mounting reader surfaces, then traverse the real OutputContainer tab
 * routing into the real NPC card.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  queueEdit: vi.fn(),
  applyUserEditAction: vi.fn(),
  revertUserEditAction: vi.fn(),
  focusEntity: vi.fn(),
  store: {},
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));
vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => name === 'settlementWorkbench',
}));
vi.mock('../../src/components/dossier/SettlementWorkbench.jsx', () => ({
  default: ({ readOnly }) => (
    <div data-testid="workbench-mode">{readOnly ? 'read-only' : 'authoring'}</div>
  ),
}));

import OutputContainer from '../../src/components/OutputContainer.jsx';

const npc = {
  id: 'npc-1',
  name: 'Mara',
  role: 'Harbourmistress',
  category: 'civic',
  influence: 'high',
  factionAffiliation: 'Harbour Council',
  secret: { what: 'She controls the old ferry.' },
  whereabouts: { state: 'hostage' },
};
const settlement = {
  id: 'settlement-1',
  name: 'Stoneford',
  tier: 'town',
  population: 1200,
  npcs: [npc],
  relationships: [],
  powerStructure: {
    factions: [{ faction: 'Harbour Council', category: 'civic' }],
  },
};

function freshStore() {
  return {
    settlement,
    aiSettlement: null,
    setAiSettlement: vi.fn(),
    clearAiSettlement: vi.fn(),
    regenSection: vi.fn(),
    requestNarrative: vi.fn(),
    requestDailyLife: vi.fn(),
    getCost: vi.fn(() => 0),
    creditBalance: 0,
    aiLoading: false,
    aiRegenerating: false,
    aiError: null,
    aiProgress: '',
    aiPartialFailure: null,
    aiViolations: null,
    clearAiViolations: vi.fn(),
    lastRegenerationDelta: null,
    clearLastRegenerationDelta: vi.fn(),
    showNarrative: false,
    setShowNarrative: vi.fn(),
    savedSettlements: [{ id: 'save-1', settlement }],
    pinNpc: vi.fn(),
    unpinNpc: vi.fn(),
    queueEdit: mocks.queueEdit,
    applyUserEditAction: mocks.applyUserEditAction,
    revertUserEditAction: mocks.revertUserEditAction,
    focusEntity: mocks.focusEntity,
    editMode: true,
    phase: 'draft',
    auth: { tier: 'premium' },
    isElevated: () => false,
    isSettlementClockBound: () => false,
    trackTabExplored: vi.fn(),
    userPrefs: { tableViewOpen: false },
    setUserPref: vi.fn(),
  };
}

beforeEach(() => {
  mocks.queueEdit.mockReset();
  mocks.applyUserEditAction.mockReset();
  mocks.revertUserEditAction.mockReset();
  mocks.focusEntity.mockReset();
  mocks.store = freshStore();
});
afterEach(cleanup);

async function openMara() {
  fireEvent.click(screen.getByRole('tab', { name: 'World' }));
  const card = await screen.findByRole('button', { name: /Mara/i });
  fireEvent.click(card);
  expect(await screen.findByText('She controls the old ferry.')).toBeTruthy();
}

function expectNoNpcWriters() {
  expect(screen.queryByRole('combobox')).toBeNull();
  expect(screen.queryByLabelText('Secret for Mara')).toBeNull();
  expect(screen.queryByRole('button', { name: /pay the ransom/i })).toBeNull();
  expect(screen.queryByRole('button', { name: /stage a rescue/i })).toBeNull();
  expect(screen.queryByRole('button', { name: /inspect person/i })).toBeNull();
  expect(screen.queryByRole('button', { name: /reroll/i })).toBeNull();
  expect(mocks.queueEdit).not.toHaveBeenCalled();
  expect(mocks.applyUserEditAction).not.toHaveBeenCalled();
  expect(mocks.revertUserEditAction).not.toHaveBeenCalled();
  expect(mocks.focusEntity).not.toHaveBeenCalled();
}

describe('OutputContainer NPC authoring scope', () => {
  test('a public dossier denies writers even when editMode and the caller capability are stale', async () => {
    render(
      <OutputContainer
        settlement={settlement}
        readOnly
        canAuthorNpc
        publicChronicle={[]}
      />,
    );

    await openMara();
    fireEvent.click(screen.getByText('She controls the old ferry.'));
    expectNoNpcWriters();
  });

  test('a player view denies writers even when it carries a save id and permissive capability', async () => {
    render(
      <OutputContainer
        settlement={settlement}
        playerView
        saveId="save-1"
        canAuthorNpc
      />,
    );

    await openMara();
    fireEvent.click(screen.getByText('She controls the old ferry.'));
    expectNoNpcWriters();
  });

  test('a saved read-only dossier without current owner scope is fail-closed', async () => {
    render(
      <OutputContainer
        settlement={settlement}
        readOnly
        saveId="save-1"
        mapCanEdit
      />,
    );

    await openMara();
    expect(screen.getByTestId('workbench-mode').textContent).toBe('read-only');
    expectNoNpcWriters();
  });

  test('an authorized saved owner retains secret, lifecycle, and inspector authoring', async () => {
    render(
      <OutputContainer
        settlement={settlement}
        readOnly
        saveId="save-1"
        mapCanEdit
        canAuthorNpc
      />,
    );

    await openMara();
    expect(screen.getByTestId('workbench-mode').textContent).toBe('authoring');
    expect(screen.getByRole('combobox', { name: /set goal/i })).toBeTruthy();
    expect(screen.getByLabelText('Secret for Mara')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /pay the ransom/i }));
    fireEvent.click(screen.getByRole('button', { name: /inspect person/i }));
    expect(mocks.queueEdit).toHaveBeenCalledWith('ransom-npc', { npcId: 'npc-1' });
    expect(mocks.focusEntity).toHaveBeenCalledWith('npc-1');
  });

  test('the live draft remains an intentional owner authoring surface', async () => {
    render(<OutputContainer settlement={settlement} />);

    await openMara();
    expect(screen.getByRole('combobox', { name: /set goal/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /inspect person/i })).toBeTruthy();
  });
});
