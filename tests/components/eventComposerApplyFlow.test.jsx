/**
 * @vitest-environment jsdom
 *
 * tests/components/eventComposerApplyFlow.test.jsx — the change-queue apply
 * flow, pinned.
 *
 * Apply no longer COMMITS on click — it STAGES the assembled event on the
 * per-settlement change-queue (queueChange). The queue's "Save N changes"
 * commit (covered in tests/store/changeQueueSlice.test.js) replays each staged
 * event through applyEvent and persists atomically. The staleness modal moved
 * to that commit seam (SettlementDetail), so it no longer renders here.
 *
 * What this file now pins:
 *   1. Apply is always offered — preview is an optional look-ahead, not a gate.
 *      Applying STAGES the form as built (queueChange), and does NOT call
 *      applyEvent directly. The DESTROY_SETTLEMENT type-the-name gate still
 *      blocks staging until it matches.
 *   2. The staged event is byte-identical to what a direct apply would build
 *      (ADD_NPC trait payload, the previewed event under a pending preview).
 *   3. No StaleNarrativeModal renders in the composer (it is a commit-time
 *      concern now). Batch "Apply all" stages one order per staged event.
 */

import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import EventComposer from '../../src/components/settlement/EventComposer.jsx';
import { EVENT_REGISTRY } from '../../src/domain/events/registry.js';

// EventComposer reads the store through a selector; a selector-over-plain-object
// stub keeps the real store (persist, supabase, analytics) out of the render.
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
    dismissPreview: vi.fn(),
    pendingPreview: null,
    previewEventBatch: vi.fn(),
    pendingBatchPreview: null,
    dismissBatchPreview: vi.fn(),
    // The new apply path: Apply stages via queueChange instead of committing.
    queueChange: vi.fn(() => 'ord_1'),
    customContent: {},
    activeSaveId: 'save-1',
    campaigns: [],
    savedSettlements: [],
    ...overrides,
  };
}

/** Pick an event type in the composer's Event dropdown (the first select). */
function pickEventType(container, type) {
  fireEvent.change(container.querySelector('select'), { target: { value: type } });
}

/** The single event staged by the most recent queueChange call. */
function lastStagedEvent() {
  const calls = state.queueChange.mock.calls;
  return calls[calls.length - 1][1].payload.event;
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventComposer — Apply stages onto the change-queue', () => {
  test('Apply honors canSubmit, then STAGES the built event (no immediate commit)', () => {
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

    // Staged (not committed): one queueChange for this save, carrying the event.
    expect(state.queueChange).toHaveBeenCalledTimes(1);
    expect(state.queueChange.mock.calls[0][0]).toBe('save-1');
    const order = state.queueChange.mock.calls[0][1];
    expect(order.type).toBe('event');
    expect(order.payload.event.type).toBe('ADD_NPC');
    expect(order.payload.event.targetId).toBe('Mira the Bold');
    expect(order.humanLabel).toBeTruthy();
    // No Cancel button without a preview to dismiss; no staleness modal here.
    expect(screen.queryByRole('button', { name: /Cancel/ })).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('ADD_NPC stages the authored descriptive traits in the event payload', () => {
    state = baseState();
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'Mira the Bold' } },
    );
    fireEvent.change(screen.getByLabelText('Flaw'),        { target: { value: 'Reckless under pressure' } });
    fireEvent.change(screen.getByLabelText('Temperament'), { target: { value: 'Hot-tempered' } });
    fireEvent.change(screen.getByLabelText('Goals'),       { target: { value: 'Reclaim her family name' } });
    fireEvent.change(screen.getByLabelText('Constraint'),  { target: { value: 'Bound by an old debt' } });
    fireEvent.change(screen.getByLabelText('Secret'),      { target: { value: 'Funds the smugglers' } });

    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));

    expect(state.queueChange).toHaveBeenCalledTimes(1);
    const applied = lastStagedEvent();
    expect(applied.type).toBe('ADD_NPC');
    expect(applied.targetId).toBe('Mira the Bold');
    expect(applied.payload).toMatchObject({
      flaw: 'Reckless under pressure',
      temperament: 'Hot-tempered',
      goal: 'Reclaim her family name',
      constraint: 'Bound by an old debt',
      secret: 'Funds the smugglers',
    });
  });

  test('ADD_NPC omits trait keys from the staged payload when left blank', () => {
    state = baseState();
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'Plain NPC' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));

    const applied = lastStagedEvent();
    expect(applied.payload).not.toHaveProperty('flaw');
    expect(applied.payload).not.toHaveProperty('temperament');
    expect(applied.payload).not.toHaveProperty('goal');
    expect(applied.payload).not.toHaveProperty('constraint');
    expect(applied.payload).not.toHaveProperty('secret');
  });

  test('DESTROY_SETTLEMENT gates staging behind the type-the-name confirm', () => {
    state = baseState();
    const { container } = render(<EventComposer />);

    pickEventType(container, 'DESTROY_SETTLEMENT');
    const confirmInput = screen.getByPlaceholderText('Type "Greenhollow" to confirm');
    const destroyBtn = screen.getByRole('button', { name: /Destroy settlement/ });
    expect(destroyBtn.disabled).toBe(true);

    fireEvent.change(confirmInput, { target: { value: 'Wrongname' } });
    expect(screen.getByRole('button', { name: /Destroy settlement/ }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Destroy settlement/ }));
    // Mismatch: nothing staged.
    expect(state.queueChange).not.toHaveBeenCalled();

    fireEvent.change(confirmInput, { target: { value: 'Greenhollow' } });
    expect(screen.getByRole('button', { name: /Destroy settlement/ }).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /Destroy settlement/ }));
    expect(state.queueChange).toHaveBeenCalledTimes(1);
    expect(lastStagedEvent().type).toBe('DESTROY_SETTLEMENT');
  });

  test('with a preview pending, Apply stages exactly the previewed event (byte-identity) and dismisses', () => {
    const previewedEvent = { id: 'ev_1', type: 'KILL_NPC', targetId: 'mira' };
    state = baseState({
      pendingPreview: {
        event: previewedEvent,
        deltas: [], factionResponses: [], warnings: [],
        narrativeSummary: 'Mira dies.',
      },
    });
    render(<EventComposer />);

    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));
    expect(state.queueChange).toHaveBeenCalledTimes(1);
    // The staged event IS the previewed event object (preview==apply invariant).
    expect(lastStagedEvent()).toBe(previewedEvent);
    // The pending preview is dismissed once staged.
    expect(state.dismissPreview).toHaveBeenCalledTimes(1);
  });
});

describe('EventComposer — no staleness modal in the composer', () => {
  function stageAddNpc(container, name = 'Mira the Bold') {
    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: name } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline|^Apply$/ }));
  }

  test('staging never raises a dialog, even on a narrated save (modal is commit-time now)', () => {
    state = baseState({ aiSettlement: { thesis: 'old prose' } });
    const { container } = render(<EventComposer />);
    stageAddNpc(container);
    expect(state.queueChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('batch "Apply all" stages one order per staged event', () => {
    state = baseState({ phase: 'draft' });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    const targetInput = () => screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt);
    fireEvent.change(targetInput(), { target: { value: 'First Person' } });
    fireEvent.click(screen.getByText('+ Add to batch'));
    fireEvent.change(targetInput(), { target: { value: 'Second Person' } });
    fireEvent.click(screen.getByText('+ Add to batch'));

    expect(screen.getByText('Staged changes (2)')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Apply all \(2\)/ }));

    // One queueChange per staged event, in order.
    expect(state.queueChange).toHaveBeenCalledTimes(2);
    expect(state.queueChange.mock.calls[0][1].payload.event.targetId).toBe('First Person');
    expect(state.queueChange.mock.calls[1][1].payload.event.targetId).toBe('Second Person');
    // No modal; the cart cleared on stage.
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('Staged changes (2)')).toBeNull();
  });
});
