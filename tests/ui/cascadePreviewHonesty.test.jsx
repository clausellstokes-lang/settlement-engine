/** @vitest-environment jsdom */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const storeState = {
  settlement: null,
  activeSaveId: null,
  pendingEditsQueue: [],
  savedSettlements: [],
};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(storeState),
}));

import CascadePreviewPanel from '../../src/components/dossier/CascadePreviewPanel.jsx';
import { buildEdit } from '../../src/domain/pendingEdits.js';

function draftIntent(edit, settlementId) {
  return {
    ...edit,
    ownerRef: {
      scope: 'draft',
      id: `draft:${settlementId}`,
      saveId: null,
    },
  };
}

beforeEach(() => {
  cleanup();
  storeState.settlement = null;
  storeState.activeSaveId = null;
  storeState.pendingEditsQueue = [];
  storeState.savedSettlements = [];
});

describe('CascadePreviewPanel preview honesty', () => {
  test('shows each canceling structural intent and calls the result balanced', () => {
    storeState.settlement = {
      id: 'town-a',
      name: 'Alderwatch',
      npcs: [],
      factions: [],
      institutions: [],
    };
    storeState.pendingEditsQueue = [
      draftIntent(
        buildEdit('add-institution', { id: 'new-guild', label: 'New Guild' }, 1),
        'town-a',
      ),
      draftIntent(
        buildEdit('remove-institution', { id: 'old-abbey', label: 'Old Abbey' }, 2),
        'town-a',
      ),
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    expect(screen.getByText(/Exactly 2 queued changes in this review/i)).toBeTruthy();
    expect(screen.getByText('Would add institution: New Guild')).toBeTruthy();
    expect(screen.getByText('Would remove institution: Old Abbey')).toBeTruthy();
    expect(screen.getByText(/every named addition and removal remains part of the queued batch/i)).toBeTruthy();
    expect(screen.getByText('Expected effect')).toBeTruthy();
    expect(screen.getByText('Known scope')).toBeTruthy();
    expect(screen.getAllByText('Expected change')).toHaveLength(2);
    expect(screen.getByRole('dialog').getAttribute('data-preview-class')).toBe('bounded_projection');
    expect(screen.getByText(/commit has not run/i)).toBeTruthy();
    expect(screen.queryByText(/No structural effect is projected/i)).toBeNull();
  });

  test('renders unavailable as unavailable, never as a zero-effect preview', () => {
    storeState.pendingEditsQueue = [
      buildEdit('add-institution', { id: 'new-guild', label: 'New Guild' }, 1),
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    expect(screen.getByText('Preview unavailable')).toBeTruthy();
    expect(screen.getByRole('dialog').getAttribute('data-preview-class')).toBe('unavailable');
    expect(screen.getByText(/no effect claim is made/i)).toBeTruthy();
    expect(screen.getAllByText(/settlement is unavailable/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/No structural effect is projected/i)).toBeNull();
    expect(screen.queryByText(/NPCs, .*factions/i)).toBeNull();
  });

  test('keeps mixed exact rows while naming table-event effects unassessed', () => {
    storeState.settlement = {
      id: 'town-a',
      name: 'Alderwatch',
      npcs: [],
      factions: [],
      institutions: [],
    };
    storeState.pendingEditsQueue = [
      draftIntent(
        buildEdit('add-institution', { id: 'new-guild', label: 'New Guild' }, 1),
        'town-a',
      ),
      draftIntent(
        buildEdit('remove-institution', { id: 'old-abbey', label: 'Old Abbey' }, 2),
        'town-a',
      ),
      draftIntent(
        buildEdit('table-event', {
          record: { kind: 'obligation' },
          directive: {
            dispatch: 'applyEvent',
            event: { type: 'APPLY_STRESSOR', payload: { type: 'debt', severity: 0.5 } },
          },
        }, 3),
        'town-a',
      ),
    ];

    render(<CascadePreviewPanel onClose={() => {}} onCommit={() => {}} />);

    expect(screen.getByText('Partial preview')).toBeTruthy();
    expect(screen.getByRole('dialog').getAttribute('data-preview-class')).toBe('partial_projection');
    expect(screen.getByText(/typed consequences.*does not simulate/i)).toBeTruthy();
    expect(screen.getByText('Would add institution: New Guild')).toBeTruthy();
    expect(screen.getByText('Would remove institution: Old Abbey')).toBeTruthy();
    expect(screen.queryByText(/No structural effect is projected/i)).toBeNull();
    expect(screen.queryByText(/every named addition and removal above still applies/i)).toBeNull();
  });
});
