/** @vitest-environment jsdom */
/**
 * THE REVIEW-BLACKOUT MATRIX — SettlementWorkbenchMount.
 *
 * At flag-ON the Workbench Change Dock is the only pending-edit review surface
 * (OutputContainer renders the standalone bar only while the flag is OFF), so
 * a saved dossier that arrives readOnly used to strand the very intents
 * hydrateFromSave deliberately preserves: staged, owner-scoped, and invisible.
 * The cure decouples the two questions. Authoring stays gated by the upstream
 * readOnly plumbing; REVIEW is an entitlement question and derives from the one
 * authoring-authority predicate, src/lib/viewerAuthority.js `viewerCanAuthor`.
 *
 * These render the REAL chain — mount, the lazy Workbench, the real
 * PendingChangesBar — so the matrix pins behaviour rather than prop echoes.
 * Row M3 is the negative control that keeps the Wave R-5b free/anon closure:
 * an unentitled viewer holding queued work still sees no review surface.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

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

import SettlementWorkbenchMount from '../../src/components/dossier/SettlementWorkbenchMount.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';

const npc = {
  id: 'npc.ada',
  type: 'npc',
  label: 'Ada',
  currentName: 'Ada',
  raw: { id: 'npc.ada', name: 'Ada', role: 'Harbourmistress' },
};

function stagedIntent(id, owner) {
  return {
    id,
    kind: 'rename-npc',
    ownerRef: { id: owner },
    payload: { npcId: 'npc.ada', newName: 'Ada Vance' },
    status: 'staged',
    reverted: false,
  };
}

/**
 * @param {{ tier?: string|null, elevated?: boolean, queue?: object[],
 *   focused?: boolean }} [options]
 */
function seedState({ tier = null, elevated = false, queue = [], focused = false } = {}) {
  model.state = {
    auth: tier == null ? null : { tier },
    isElevated: () => elevated,
    settlement: { id: 'town-a', npcs: [{ id: 'npc.ada', name: 'Ada' }] },
    activeSaveId: 'save-a',
    pendingEditsQueue: queue,
    pendingEditReceipts: [],
    focusedEntity: focused ? { id: npc.id, ts: 1 } : null,
    clearFocusedEntity: vi.fn(),
    setEditMode: vi.fn(),
    revertToSnapshot: vi.fn(),
    commitPendingEdits: vi.fn(() => ({ ok: true, status: 'applied' })),
    revertPendingEdits: vi.fn(),
    refreshPendingEdits: vi.fn(() => ({ ok: true, status: 'refreshed', refreshed: [], failed: [] })),
  };
}

function renderMount({ enabled = true, readOnly = false } = {}) {
  const index = { resolve: id => (id === npc.id ? npc : null) };
  return render(
    <DossierEntityContext.Provider value={{ index, navigateToEntity: vi.fn() }}>
      <SettlementWorkbenchMount enabled={enabled} readOnly={readOnly} />
    </DossierEntityContext.Provider>,
  );
}

/** The lazy Workbench resolves on a microtask; wait for a stable settled frame. */
async function settled() {
  await waitFor(() => {
    expect(screen.queryByText(/Opening settlement tools/i)).toBeNull();
  });
}

beforeEach(() => seedState());
afterEach(() => cleanup());

describe('the entitled readOnly matrix', () => {
  test('M1 — an entitled viewer on a readOnly dossier reviews staged work without regaining a staging lever', async () => {
    seedState({
      tier: 'premium',
      queue: [stagedIntent('intent-a', 'save:save-a')],
      focused: true,
    });
    renderMount({ readOnly: true });
    await settled();

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Commit' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeTruthy();
    expect(
      screen.getByText(/Editing is closed on this view/i).textContent,
    ).toMatch(/review, commit, or discard the changes you staged earlier/i);

    // The review lane is not an authoring lane: the staging controls the
    // upstream readOnly closes stay closed.
    expect(screen.queryByRole('button', { name: 'Edit NPC details' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Ada' })).toBeTruthy();
  });

  test('M2 — review entitlement adds no permanent chrome to an empty queue', async () => {
    seedState({ tier: 'premium' });
    renderMount({ readOnly: true });
    await settled();

    expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
    expect(screen.queryByText(/Editing is closed on this view/i)).toBeNull();
  });

  test('M3 — an unentitled viewer holding queued work still sees no review surface', async () => {
    for (const tier of ['free', null]) {
      seedState({ tier, queue: [stagedIntent('intent-a', 'save:save-a')] });
      renderMount({ readOnly: false });
      await settled();

      expect(screen.queryByRole('heading', { name: 'Change Dock' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Commit' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Discard' })).toBeNull();
      expect(screen.queryByText(/Editing is closed on this view/i)).toBeNull();
      cleanup();
    }
  });

  test('M4 — an entitled viewer with authoring open keeps the full surface and no review-mode note', async () => {
    seedState({
      tier: 'premium',
      queue: [stagedIntent('intent-a', 'save:save-a')],
      focused: true,
    });
    renderMount({ readOnly: false });
    await settled();

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Edit NPC details' })).toBeTruthy();
    expect(screen.queryByText(/Editing is closed on this view/i)).toBeNull();
  });

  test('M5 — a disabled mount renders nothing at all', () => {
    seedState({ tier: 'premium', queue: [stagedIntent('intent-a', 'save:save-a')] });
    const { container } = renderMount({ enabled: false, readOnly: true });

    expect(container.innerHTML).toBe('');
  });

  test('M6 — review-mode Commit and Discard route through the existing owner-scoped actions', async () => {
    seedState({
      tier: 'premium',
      queue: [
        stagedIntent('intent-a', 'save:save-a'),
        stagedIntent('intent-other-save', 'save:save-b'),
      ],
    });
    renderMount({ readOnly: true });
    await settled();

    fireEvent.click(screen.getByRole('button', { name: 'Commit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));

    expect(model.state.commitPendingEdits).toHaveBeenCalledWith({
      intentIds: ['intent-a'],
    });
    expect(model.state.revertPendingEdits).toHaveBeenCalledWith({
      intentIds: ['intent-a'],
    });
  });

  test('review mode inherits the per-edit removal control without inventing a write path', async () => {
    // revertSingleEdit is a discard-class queue removal, owner-scoped and with
    // no engine write, so the review lane carries it exactly as the authoring
    // lane does. This keeps the dead-op wiring that put it on both mounts.
    seedState({
      tier: 'premium',
      queue: [stagedIntent('intent-a', 'save:save-a')],
    });
    model.state.revertSingleEdit = vi.fn(() => true);
    renderMount({ readOnly: true });
    await settled();

    fireEvent.click(screen.getByRole('button', { name: /^Remove this change:/ }));
    expect(model.state.revertSingleEdit).toHaveBeenCalledWith('intent-a');
  });

  test('review authority is the authoring predicate itself, not a tier literal', async () => {
    // An elevated role carries no entitled tier. It opens review anyway,
    // which is only true while canReview reads viewerCanAuthor.
    seedState({
      tier: 'free',
      elevated: true,
      queue: [stagedIntent('intent-a', 'save:save-a')],
    });
    renderMount({ readOnly: true });
    await settled();

    expect(screen.getByRole('heading', { name: 'Change Dock' })).toBeTruthy();
    expect(screen.getByText(/Editing is closed on this view/i)).toBeTruthy();
  });
});
