/**
 * @vitest-environment jsdom
 *
 * tests/components/eventComposerApplyFlow.test.jsx — the owner-requested
 * apply-flow change, pinned:
 *
 *   1. Apply is always offered — preview is an optional look-ahead, not a
 *      gate. Applying without a preview commits the form as built (and the
 *      DESTROY_SETTLEMENT type-the-name confirm gate still applies).
 *   2. THE STALENESS LAW (Composer V2 §5, W-COMPOSER-1): the old
 *      apply-prefers-pendingPreview bypass is RETIRED. Apply ALWAYS builds
 *      from the current form — a stale stored preview can never commit, and
 *      a pending preview no longer bypasses canSubmit.
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
import { EVENT_REGISTRY } from '../../src/domain/events/registryFull.js';

// Both EventComposer and StaleNarrativeModal read the same zustand entry
// point; a selector-over-plain-object stub keeps the real store (persist,
// supabase, analytics) out of the render. Reassigned per test via baseState.
let state;
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(state);
  // The live-preview effect reads the freshest pendingPreview off the store.
  useStore.getState = () => state;
  return { useStore };
});

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
    dismissPreview: vi.fn(),
    pendingPreview: null,
    previewEventBatch: vi.fn(),
    applyEventBatch: vi.fn(() => ({ ok: true, warnings: [], logEntries: [] })),
    pendingBatchPreview: null,
    dismissBatchPreview: vi.fn(),
    customContent: {},
    activeSaveId: 'save-1',
    // W5.7 EventComposer field modules read these selectors.
    canUseCustomContent: () => false,
    setPurchaseModalOpen: vi.fn(),
    savedSettlements: [],
    campaigns: [],
    requestNarrative: vi.fn(),
    aiSettlement: null,
    aiDailyLife: null,
    // Composer V2 surfaces.
    composerIntent: null,
    stageComposerIntent: vi.fn(),
    isSettlementClockBound: () => false,
    ...overrides,
  };
}

/** Pick an event type in the composer's Event dropdown (by accessible name —
 *  the ComposerNavigator renders its own selects before it). */
function pickEventType(container, type) {
  fireEvent.change(screen.getByLabelText('Event type'), { target: { value: type } });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventComposer — Apply without a preview', () => {
  test('a clock-bound preview names its isolated scope and intervening-world boundary', () => {
    state = baseState({
      isSettlementClockBound: () => true,
      pendingPreview: {
        event: { id: 'ev_clock', type: 'ADD_NPC', targetId: 'Mira' },
        deltas: [],
        factionResponses: [],
        warnings: [],
        narrativeSummary: 'Mira arrives.',
      },
    });

    render(<EventComposer />);

    expect(screen.getAllByText(/applying this change stages it for the next World Pulse/i)).toHaveLength(2);
    expect(screen.getByText(/Isolated-scope review/i)).toBeTruthy();
    expect(screen.getAllByText(/earlier queued orders.*intervening world changes/i)).toHaveLength(2);
  });

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

  test('STALENESS LAW: a pending preview no longer bypasses canSubmit — a stale preview cannot commit', () => {
    // A stored preview for a DIFFERENT event than the (incomplete) form: under
    // the retired bypass this enabled Apply and committed the stale event.
    state = baseState({
      pendingPreview: {
        event: { id: 'ev_1', type: 'KILL_NPC', targetId: 'mira' },
        deltas: [], factionResponses: [], warnings: [],
        narrativeSummary: 'Mira dies.',
        _previewKey: 'stale-key', _forSettlement: null,
      },
    });
    render(<EventComposer />);

    // The form (ADD_INSTITUTION, no target) does not submit — and the stored
    // preview must NOT re-enable Apply.
    const apply = screen.getByRole('button', { name: /Apply to Timeline/ });
    expect(apply.disabled).toBe(true);
    fireEvent.click(apply);
    expect(state.applyEvent).not.toHaveBeenCalled();
    // The pane renders the stored preview as visibly STALE.
    expect(screen.getByText(/Preview is stale/)).toBeTruthy();
    // Cancel (dismiss the stale pane) is still offered.
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeTruthy();
  });

  test('STALENESS LAW: with a stale preview pending, Apply commits the EDITED form event, never the stored one', () => {
    state = baseState({
      pendingPreview: {
        event: { id: 'ev_1', type: 'KILL_NPC', targetId: 'mira' },
        deltas: [], factionResponses: [], warnings: [],
        narrativeSummary: 'Mira dies.',
        _previewKey: 'stale-key', _forSettlement: null,
      },
    });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'Fresh Person' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));
    expect(state.applyEvent).toHaveBeenCalledTimes(1);
    const applied = state.applyEvent.mock.calls[0][0];
    expect(applied.type).toBe('ADD_NPC');           // the FORM event…
    expect(applied.targetId).toBe('Fresh Person');
    expect(applied.id).not.toBe('ev_1');            // …never the stale preview's
  });

  test('a veto refusal blocks: no reset, the refusal renders, nothing logs stale-modal', () => {
    state = baseState({
      aiSettlement: { thesis: 'old prose' }, // narrated — but a veto must NOT raise the modal
      applyEvent: vi.fn(() => ({ ok: false, veto: { code: 'npc_not_found', message: 'No NPC "X" to remove.' } })),
    });
    const { container } = render(<EventComposer />);
    pickEventType(container, 'ADD_NPC');
    fireEvent.change(
      screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt),
      { target: { value: 'Mira the Bold' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Apply to Timeline/ }));
    expect(screen.getByText(/The world refuses/)).toBeTruthy();
    // The form was NOT reset (the DM retargets rather than retyping).
    expect(screen.getByPlaceholderText(EVENT_REGISTRY.ADD_NPC.targetPrompt).value).toBe('Mira the Bold');
    expect(screen.queryByRole('dialog')).toBeNull();
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

describe('EventComposer — a staged intent on a settlement-less render', () => {
  // The intent effect is registered on EVERY render, including the ones that
  // take the `if (!settlement) return null` early return, so everything it
  // touches must be declared ABOVE that return. When the setters bag sat below
  // it, `{ ...composerSetters }` read a const in its temporal dead zone and the
  // effect threw `Cannot access 'composerSetters' before initialization`.
  test('consumes and clears the intent instead of throwing on the setters bag', () => {
    state = baseState({
      settlement: null,
      composerIntent: { type: 'ADD_NPC', target: 'Mira the Bold', fields: { importance: 'major' } },
    });

    const { container } = render(<EventComposer />);

    // The settlement-less render itself is empty…
    expect(container.firstChild).toBeNull();
    // …but the intent was consumed into the form and cleared at the source, so
    // it cannot re-fire (the effect's only dep is the intent object).
    expect(state.stageComposerIntent).toHaveBeenCalledTimes(1);
    expect(state.stageComposerIntent).toHaveBeenCalledWith(null);
  });
});

describe('EventComposer — ADD_FACTION offers Compendium factions (the FactionEventBanner promise)', () => {
  // Guards the manifest's factions.name + factions.description "eventComposer"
  // consumer evidence: a Compendium faction must be PICKABLE here, and its
  // authored description must prefill the editable Description field (the only
  // channel to the created faction — event.description → addFaction). If this
  // flow is ever removed, prune those consumers rather than deleting this test.
  test('a Compendium faction is pickable under Custom and prefills Description', () => {
    state = baseState({
      customContent: {
        factions: [{ id: 'cf1', name: 'The Gilded Quill', description: 'Scribes with sharp knives.' }],
      },
    });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_FACTION');
    const factionSelect = screen.getByLabelText('Faction');
    // The Custom optgroup carries the authored faction.
    const customGroup = within(factionSelect).getByRole('group', { name: 'Custom' });
    expect(within(customGroup).getByRole('option', { name: 'The Gilded Quill' })).toBeTruthy();

    fireEvent.change(factionSelect, { target: { value: 'The Gilded Quill' } });
    // Description prefilled (still editable), and the event is stageable.
    expect(screen.getByLabelText('Description').value).toBe('Scribes with sharp knives.');
    expect(screen.getByRole('button', { name: /Apply to Timeline/ }).disabled).toBe(false);
  });

  test('a built-in pick leaves a typed Description alone', () => {
    state = baseState({
      customContent: { factions: [{ id: 'cf1', name: 'The Gilded Quill', description: 'Scribes.' }] },
    });
    const { container } = render(<EventComposer />);

    pickEventType(container, 'ADD_FACTION');
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'my own note' } });
    fireEvent.change(screen.getByLabelText('Faction'), { target: { value: 'The Trade Compact' } });
    expect(screen.getByLabelText('Description').value).toBe('my own note');
  });
});
