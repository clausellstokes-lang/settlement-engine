/** @vitest-environment jsdom */
/**
 * PendingChangesBar owner-scope and recovery pins.
 *
 * Save-local work may remain in the session, but the visible bar must never
 * summarize or select another save's intents. Retained stale work also has an
 * explicit re-review path before retry.
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

function intent(id, owner, newName, status = 'staged') {
  return {
    id,
    kind: 'rename-npc',
    ownerRef: { id: owner },
    payload: { npcId: 'npc.ada', newName },
    status,
    reverted: false,
  };
}

beforeEach(() => {
  model.state = {
    settlement: { id: 'town-b', npcs: [{ id: 'npc.ada', name: 'Ada' }] },
    activeSaveId: 'save-b',
    pendingEditsQueue: [
      intent('intent-a', 'save:save-a', 'Prior A'),
      intent('intent-b', 'save:save-b', 'Current B'),
    ],
    commitPendingEdits: vi.fn(() => ({ ok: true, status: 'applied' })),
    revertPendingEdits: vi.fn(),
    refreshPendingEdits: vi.fn(() => ({
      ok: true,
      status: 'refreshed',
      refreshed: ['intent-b'],
      failed: [],
    })),
  };
});

afterEach(() => cleanup());

describe('PendingChangesBar — save-local projection', () => {
  test('displays and selects only the active save, then recovers A when switching back', () => {
    render(<PendingChangesBar />);
    expect(screen.getByText(/1 unsaved change/i)).toBeTruthy();
    expect(screen.getByText(/Current B/)).toBeTruthy();
    expect(screen.queryByText(/Prior A/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Commit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(model.state.commitPendingEdits).toHaveBeenCalledWith({
      intentIds: ['intent-b'],
    });
    expect(model.state.revertPendingEdits).toHaveBeenCalledWith({
      intentIds: ['intent-b'],
    });

    cleanup();
    model.state.activeSaveId = 'save-a';
    model.state.settlement = {
      id: 'town-a',
      npcs: [{ id: 'npc.ada', name: 'Ada' }],
    };
    render(<PendingChangesBar />);
    expect(screen.getByText(/Prior A/)).toBeTruthy();
    expect(screen.queryByText(/Current B/)).toBeNull();
  });

  test('offers exact-scope Review again for stale work before retry', async () => {
    model.state.pendingEditsQueue[1].status = 'stale';
    render(<PendingChangesBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Review again' }));

    expect(model.state.refreshPendingEdits).toHaveBeenCalledWith({
      intentIds: ['intent-b'],
    });
    expect((await screen.findByRole('alert')).textContent).toMatch(/Preview again/i);
  });
});
