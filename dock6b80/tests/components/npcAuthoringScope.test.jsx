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
  // NPCsTab is a deliberate per-tab lazy chunk. The first test in this file is
  // its cold import and can sit just beyond Testing Library's 1s default under
  // the full corpus; later cases are warm. Preserve the production split and
  // give the real lazy boundary an honest component-test budget.
  const card = await screen.findByRole('button', { name: /Mara/i }, { timeout: 5000 });
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

/**
 * WAVE R-5b — npcAuthoringAllowed reads viewerCanAuthor (owner-authorized
 * 2026-07-27; docs/CAPABILITY_REMEDIATION_PLAN.md Wave R-5b).
 *
 * DECLARED BEHAVIOUR SHIFT: on the Create flow (readOnly=false) the gate used to
 * admit EVERY tier, so a free or anon viewer saw NpcLifecycleControls and could
 * queueEdit intents the Workbench Change Dock — gated on the same authority —
 * would never let them review or commit. They now see the reader surface only.
 *
 * These are the per-tier pins. The entitled half is NOT redundant with the tests
 * above: without it, a gate that denied everyone would pass just as happily.
 */
describe('R-5b — Create-flow NPC authoring follows the viewerCanAuthor authority', () => {
  function renderCreateFlow(auth, isElevated = () => false) {
    mocks.store.auth = auth;
    mocks.store.isElevated = isElevated;
    render(<OutputContainer settlement={settlement} />);
  }

  const DENIED = [
    ['an anonymous viewer', { tier: 'anon' }],
    ['a free tier', { tier: 'free' }],
    // Fail-closed input: the predicate refuses anything short of an explicit
    // entitled tier or a live elevated role.
    ['a viewer with no tier', {}],
    // A wholly absent `auth` is NOT pinned here on purpose. authSlice.js:103
    // always seeds `auth` as an object, and sibling dossier components rely on
    // that (WelcomeCreditCard.jsx:54 reads `s.auth.tier` unguarded and throws on
    // null), so the fixture would assert against an unreachable store shape and
    // fail inside an unrelated component. viewerCanAuthor's own null-state
    // fail-closed behaviour is pinned at the chokepoint instead.
  ];

  for (const [label, auth] of DENIED) {
    test(`${label} gets the reader surface, no authoring levers`, async () => {
      renderCreateFlow(auth);
      await openMara();
      expectNoNpcWriters();
    });
  }

  test('an unentitled tier is denied even with a truthy non-boolean isElevated', async () => {
    // The chokepoint demands `isElevated() === true`; a truthy non-boolean
    // cannot widen the gate, and that must hold through this consumer too.
    renderCreateFlow({ tier: 'free' }, () => 'yes');
    await openMara();
    expectNoNpcWriters();
  });

  const ALLOWED = [
    ['premium', { tier: 'premium' }, () => false],
    ['founder', { tier: 'founder' }, () => false],
    ['an elevated role on a free tier', { tier: 'free' }, () => true],
  ];

  for (const [label, auth, isElevated] of ALLOWED) {
    test(`${label} keeps the Create-flow authoring levers`, async () => {
      renderCreateFlow(auth, isElevated);
      await openMara();
      expect(screen.getByRole('combobox', { name: /set goal/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /inspect person/i })).toBeTruthy();
    });
  }
});

/**
 * The Library (saved, readOnly) mount is UNCHANGED by the alignment. Not an
 * assumption: `canAuthorNpc` is computed in SettlementDetail as `canEdit && …`
 * where `canEdit = useStore(viewerCanAuthor)`, so it is a strict narrowing of
 * the new conjunct and cannot subtract from it. These pin that for every tier
 * that can actually produce canAuthorNpc=true.
 */
describe('R-5b — the Library authoring arm is unchanged', () => {
  for (const [label, auth, isElevated] of [
    ['premium', { tier: 'premium' }, () => false],
    ['founder', { tier: 'founder' }, () => false],
    ['an elevated role on a free tier', { tier: 'free' }, () => true],
  ]) {
    test(`${label}: an authorized saved owner still authors`, async () => {
      mocks.store.auth = auth;
      mocks.store.isElevated = isElevated;
      render(
        <OutputContainer settlement={settlement} readOnly saveId="save-1" mapCanEdit canAuthorNpc />,
      );

      await openMara();
      expect(screen.getByTestId('workbench-mode').textContent).toBe('authoring');
      expect(screen.getByRole('combobox', { name: /set goal/i })).toBeTruthy();
      expect(screen.getByLabelText('Secret for Mara')).toBeTruthy();
    });
  }

  test('a saved read-only dossier is still fail-closed without owner scope', async () => {
    // The unentitled combination cannot arise upstream (canAuthorNpc implies the
    // authority), so this arm only ever loses cases that were already denied.
    mocks.store.auth = { tier: 'free' };
    render(<OutputContainer settlement={settlement} readOnly saveId="save-1" mapCanEdit />);

    await openMara();
    expect(screen.getByTestId('workbench-mode').textContent).toBe('read-only');
    expectNoNpcWriters();
  });
});
