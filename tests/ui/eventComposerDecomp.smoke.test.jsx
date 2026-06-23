/**
 * @vitest-environment jsdom
 *
 * tests/ui/eventComposerDecomp.smoke.test.jsx — second decomposition lock-in.
 *
 * A further behavior-preserving split moved the per-event-type "Target" control
 * (the big `{(() => { ... })()}` block) into
 * src/components/settlement/eventComposer/EventComposerTargetField.jsx, and the
 * module-scope data + style constants into
 * src/components/settlement/eventComposer/EventComposerConstants.js.
 *
 * This is a pure code-movement, so the regression net is: the composer still
 * MOUNTS (render(), not "is a function") so a removed-but-still-referenced
 * import would throw — eslint-plugin-react is not loaded, so mounting is the
 * only check that catches it. We also flip the event type through several of
 * the TargetField branches to exercise the extracted component end-to-end.
 *
 * NB: a sibling test (tests/ui/eventComposer.smoke.test.jsx) already covers the
 * first decomposition wave; this file is the additive net for the second wave
 * and uses a separate filename so it does not overwrite that test on a
 * case-insensitive filesystem.
 *
 * The store is a selector-over-plain-object stub (same shape as the existing
 * apply-flow test) so the real store (persist, supabase, analytics) stays out
 * of the render. A minimal settlement with empty collections is enough for the
 * composer to render its form.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Selector-over-plain-object store stub. Every selector the composer reads is
// served from this single object; no zustand, no network.
const storeState = {
  phase: 'canon',
  settlement: {
    name: 'Greenhollow',
    institutions: [{ id: 'temple', name: 'Temple of Dawn' }],
    npcs: [{ id: 'mira', name: 'Mira', importance: 'key' }],
    factions: [],
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
};

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

describe('EventComposer — second decomposition smoke (TargetField + constants)', () => {
  test('mounts without throwing and renders the composer chrome', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    const { container } = render(<EventComposer />);
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText('Make Changes')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Preview/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Apply to Timeline/ })).toBeTruthy();
  });

  test('the extracted TargetField renders the default ADD_INSTITUTION picker', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    render(<EventComposer />);
    // ADD_INSTITUTION is the initial type → the catalog-picker "Institution"
    // Field from EventComposerTargetField is shown.
    expect(screen.getByText('Institution')).toBeTruthy();
  });

  test('switching event type re-renders the TargetField branch (KILL_NPC → dossier select)', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    render(<EventComposer />);
    // The Event <select> is the first combobox; switch to KILL_NPC, which routes
    // through the TargetField dossier-entity branch (a "Target" select of NPCs).
    const eventSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(eventSelect, { target: { value: 'KILL_NPC' } });
    // The NPC option from the stubbed dossier appears in the target dropdown.
    expect(screen.getByRole('option', { name: 'Mira' })).toBeTruthy();
  });

  test('Expose Corruption is hidden when no NPC is corrupt (the action would no-op)', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    render(<EventComposer />);
    // The stub roster (Mira) has no corrupt NPC, so the event must not be offered.
    expect(screen.queryByRole('option', { name: 'Expose corruption' })).toBeNull();
  });
});

describe('eventComposer helpers — corruptNpcOptions', () => {
  test('offers only corrupt, not-ousted NPCs and labels them', async () => {
    const { corruptNpcOptions } = await import('../../src/components/settlement/eventComposer/helpers.js');
    const settlement = {
      npcs: [
        { id: 'a', name: 'Captain Vex', corrupt: true },
        { id: 'b', name: 'Honest Mira', corrupt: false },
        { id: 'c', name: 'Former Stooge', corrupt: false, ousted: true },
        { id: 'd', name: 'Spent Mole', corrupt: true, ousted: true }, // turned but ousted — excluded
      ],
    };
    const opts = corruptNpcOptions(settlement);
    expect(opts).toEqual([{ id: 'a', name: 'Captain Vex (corrupt)' }]);
  });

  test('returns an empty list when no NPC is corrupt', async () => {
    const { corruptNpcOptions } = await import('../../src/components/settlement/eventComposer/helpers.js');
    expect(corruptNpcOptions({ npcs: [{ id: 'a', name: 'Clean', corrupt: false }] })).toEqual([]);
    expect(corruptNpcOptions({ npcs: [] })).toEqual([]);
    expect(corruptNpcOptions(null)).toEqual([]);
  });
});
