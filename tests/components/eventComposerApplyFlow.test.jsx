/**
 * @vitest-environment jsdom
 *
 * tests/components/eventComposerApplyFlow.test.jsx — the owner-requested
 * apply-flow change, pinned:
 *
 *   1. Apply is always offered — preview is an optional look-ahead, not a
 *      gate. Applying without a preview commits the form as built (and the
 *      DESTROY_SETTLEMENT type-the-name confirm gate still applies).
 *   2. With a preview pending, Apply still commits exactly the previewed
 *      event (the audit's preview==apply invariant).
 *   3. A successful apply on a NARRATED save raises StaleNarrativeModal
 *      (the prose was written against the previous state). Raw saves get
 *      no modal. "Continue with raw simulation" closes without any AI
 *      call and without un-applying; "Regenerate narrative" calls
 *      requestNarrative(activeSaveId). A batch apply fires the modal
 *      ONCE for the whole batch, labelled "N changes".
 */

import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import EventComposer from '../../src/components/settlement/EventComposer.jsx';
import { EVENT_REGISTRY } from '../../src/domain/events/registry.js';

// Both EventComposer and StaleNarrativeModal read the same zustand entry
// point; a selector-over-plain-object stub keeps the real store (persist,
// supabase, analytics) out of the render. Reassigned per test via baseState.
let state;
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(state),
}));

function baseState(overrides = {}) {
  return {
    phase: 'canon',
    settlement: {
      name: 'Greenhollow',
      institutions: [],
      npcs: [],
      powerStructure: { factions: [] },
      config: {},
    },
    previewEvent: vi.fn(),
    applyEvent: vi.fn((event) => ({ event })),
    applyPendingPreview: vi.fn(() => ({ event: {} })),
    dismissPreview: vi.fn(),
    pendingPreview: null,
    previewEventBatch: vi.fn(),
    applyEventBatch: vi.fn(() => ({ ok: true, warnings: [], logEntries: [] })),
    pendingBatchPreview: null,
    dismissBatchPreview: vi.fn(),
    customContent: {},
    activeSaveId: 'save-1',
    requestNarrative: vi.fn(),
    aiSettlement: null,
    aiDailyLife: null,
    ...overrides,
  };
}

/** Pick an event type in the composer's Event dropdown (the first select). */
function pickEventType(container, type) {
  fireEvent.change(container.querySelector('select'), { target: { value: type } });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventComposer — Apply without a preview', () => {
  test('Apply renders with no pending preview, honors canSubmit, and commits the built event', () => {
    state = baseState();
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    const apply = screen.getByRole('button', { name: /Apply to Timeline/ });
    // requiresTarget event with an empty target: visible but disabled.
    expect(apply.disabled).toBe(true);

    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'Mira the Bold' } },
    );
    expect(screen.getByRole('button', { name: /Apply to Timeline/ }).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));

    expect(state.applyEvent).toHaveBeenCalledTimes(1);
    const applied = state.applyEvent.mock.calls[0][0];
    expect(applied.type).toBe('ADD_NPC');
    expect(applied.targetId).toBe('Mira the Bold');
    // Direct apply, not the preview path.
    expect(state.applyPendingPreview).not.toHaveBeenCalled();
    // No Cancel button without a preview to dismiss.
    expect(screen.queryByRole('button', { name: /Cancel/ })).toBeNull();
    // Raw save (no narrative): nothing can go stale, so no modal.
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('DESTROY_SETTLEMENT shows the type-the-name gate without a preview and blocks until it matches', () => {
    state = baseState();
    const { container } = render(<EventComposer />);

    pickEventType(container, 'DESTROY_SETTLEMENT');
    const confirmInput = screen.getByPlaceholderText('Type "Greenhollow" to confirm');
    const destroyBtn = screen.getByRole('button', { name: /Destroy settlement/ });
    expect(destroyBtn.disabled).toBe(true);

    fireEvent.change(confirmInput, { target: { value: 'Wrongname' } });
    expect(screen.getByRole('button', { name: /Destroy settlement/ }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Destroy settlement/ }));
    expect(state.applyEvent).not.toHaveBeenCalled();

    fireEvent.change(confirmInput, { target: { value: 'Greenhollow' } });
    expect(screen.getByRole('button', { name: /Destroy settlement/ }).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /Destroy settlement/ }));
    expect(state.applyEvent).toHaveBeenCalledTimes(1);
    expect(state.applyEvent.mock.calls[0][0].type).toBe('DESTROY_SETTLEMENT');
  });

  test('with a preview pending, Apply commits the previewed event (audit invariant) and Cancel is offered', () => {
    state = baseState({
      pendingPreview: {
        event: { id: 'ev_1', type: 'KILL_NPC', targetId: 'mira' },
        deltas: [], factionResponses: [], warnings: [],
        narrativeSummary: 'Mira dies.',
      },
    });
    render(<EventComposer />);

    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));
    expect(state.applyPendingPreview).toHaveBeenCalledTimes(1);
    expect(state.applyEvent).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeTruthy();
  });
});

describe('EventComposer — post-apply staleness modal', () => {
  function applyAddNpc(container, name = 'Mira the Bold') {
    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: name } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline|^Apply$/ }));
  }

  test('appears after a successful apply when narrated; Continue closes with no AI call and no un-apply', () => {
    state = baseState({ aiSettlement: { thesis: 'old prose' } });
    const { container } = render(<EventComposer />);

    applyAddNpc(container);
    expect(state.applyEvent).toHaveBeenCalledTimes(1);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('The narrative is now out of date.')).toBeTruthy();
    // The applied change is named in the header sub-label. (Scoped to the
    // dialog — "Add NPC" also exists as an <option> in the Event dropdown.)
    expect(within(dialog).getByText('Add NPC')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue with raw simulation'));
    expect(screen.queryByRole('dialog')).toBeNull();
    // No AI call, and the event stays applied (no further store calls).
    expect(state.requestNarrative).not.toHaveBeenCalled();
    expect(state.applyEvent).toHaveBeenCalledTimes(1);
  });

  test('Regenerate calls requestNarrative with the active save id and closes', () => {
    state = baseState({ aiDailyLife: { dawn: 'old prose' } });
    const { container } = render(<EventComposer />);

    applyAddNpc(container);
    fireEvent.click(screen.getByText('Regenerate narrative'));
    expect(state.requestNarrative).toHaveBeenCalledTimes(1);
    expect(state.requestNarrative).toHaveBeenCalledWith('save-1');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('absent when the save is not narrated', () => {
    state = baseState();
    const { container } = render(<EventComposer />);
    applyAddNpc(container);
    expect(state.applyEvent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('absent when the apply did not commit', () => {
    state = baseState({
      aiSettlement: { thesis: 'old prose' },
      applyEvent: vi.fn(() => null),
    });
    const { container } = render(<EventComposer />);
    applyAddNpc(container);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('batch apply fires the modal once, labelled "N changes", in draft phase too', () => {
    state = baseState({ phase: 'draft', aiSettlement: { thesis: 'old prose' } });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    const targetInput = () => screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt);
    fireEvent.change(targetInput(), { target: { value: 'First Person' } });
    fireEvent.click(screen.getByText('+ Add to batch'));
    fireEvent.change(targetInput(), { target: { value: 'Second Person' } });
    fireEvent.click(screen.getByText('+ Add to batch'));

    expect(screen.getByText('Staged changes (2)')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Apply all \(2\)/ }));

    expect(state.applyEventBatch).toHaveBeenCalledTimes(1);
    expect(state.applyEventBatch.mock.calls[0][0]).toHaveLength(2);
    // Exactly ONE modal for the whole batch.
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByText('2 changes')).toBeTruthy();
    // The cart cleared on success.
    expect(screen.queryByText('Staged changes (2)')).toBeNull();
  });

  test('a failed batch apply raises no modal and keeps the cart', () => {
    state = baseState({
      phase: 'draft',
      aiSettlement: { thesis: 'old prose' },
      applyEventBatch: vi.fn(() => ({ ok: false, warnings: [], logEntries: [] })),
    });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'First Person' } },
    );
    fireEvent.click(screen.getByText('+ Add to batch'));
    fireEvent.click(screen.getByRole('button', { name: /Apply all \(1\)/ }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Staged changes (1)')).toBeTruthy();
  });
});
