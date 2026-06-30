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
  // A linkable sibling save (different id, not in the settlement's network) so the
  // folded LINK_NEIGHBOUR entry can appear when an onLink handler is supplied.
  savedSettlements: [{ id: 'save-2', name: 'Westford', tier: 'village' }],
  campaigns: [],
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

  test('SHIFT_TIER is now authorable in the dropdown and reveals the folded Direction field', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    render(<EventComposer />);
    // The standalone "Settlement Size" card was folded into the event dropdown.
    expect(screen.getByRole('option', { name: 'Promote or demote tier' })).toBeTruthy();
    const eventSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(eventSelect, { target: { value: 'SHIFT_TIER' } });
    // The folded picker shows a Direction field with a real move (not an empty event).
    expect(screen.getByText('Direction')).toBeTruthy();
    expect(screen.getByRole('option', { name: /Promote to|Demote to/ })).toBeTruthy();
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

describe('SHIFT_TIER fold — assembled event + direction clamp', () => {
  const baseForm = {
    type: 'SHIFT_TIER', target: '', effectiveTarget: '',
    settlement: { tier: 'town', config: {}, population: 3000 },
    phase: 'canon', addCategory: '', severity: 0.7, dimension: 'legitimacy',
    importance: 'notable', role: '', institutionId: '',
    npcFlaw: '', npcTemperament: '', npcGoals: '', npcConstraint: '', npcSecret: '',
    quality: 'competent', relationshipType: '', criminalOrg: '', criminalOrgs: [], corruptScope: 'individual',
    stressorPick: null, powerCause: 'coup',
    tradeDirection: 'export', tradeEntrepot: false, swapWithNpcId: '', tierDirection: 'promotion',
    isWarStressor: false, isInfiltrationStressor: false, instigatorNeighbour: '', instigatorRelationship: 'rival', tradeTarget: '',
    partyCaused: false, description: '',
  };

  test('buildEvent assembles a real { direction } payload (never an empty event) with no target', async () => {
    const { buildEvent } = await import('../../src/components/settlement/eventComposer/buildEvent.js');
    const promote = buildEvent({ ...baseForm, tierDirection: 'promotion' });
    expect(promote.type).toBe('SHIFT_TIER');
    expect(promote.payload).toEqual({ direction: 'promotion' });
    expect(promote.targetId).toBeNull();
    const demote = buildEvent({ ...baseForm, tierDirection: 'demotion' });
    expect(demote.payload).toEqual({ direction: 'demotion' });
  });

  test('clampTierDirection respects a legal choice but pins to the only move at the cap/floor', async () => {
    const { clampTierDirection } = await import('../../src/components/settlement/eventComposer/EventComposerTierField.jsx');
    // mid-range: the DM's choice stands
    expect(clampTierDirection({ tier: 'town' }, 'promotion')).toBe('promotion');
    expect(clampTierDirection({ tier: 'town' }, 'demotion')).toBe('demotion');
    // cap (metropolis): demotion is the only legal move
    expect(clampTierDirection({ tier: 'metropolis' }, 'promotion')).toBe('demotion');
    // floor (thorp): promotion is the only legal move
    expect(clampTierDirection({ tier: 'thorp' }, 'demotion')).toBe('promotion');
  });
});

describe('Deity fold — staged SET_PRIMARY_DEITY / IMPOSE_CULT', () => {
  // Same custom-deity fixture the map path (assignDeityFromMap) uses, so the
  // composer-staged snapshot is provably byte-identical to the store-action one.
  const DEITY = { id: 'deit_1', localUid: 'lu_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'war', isCustom: true };
  const customContent = { deities: [DEITY] };
  const REF = 'custom:lu_vael';
  const form = (over) => ({
    type: 'SET_PRIMARY_DEITY', target: '', effectiveTarget: '',
    settlement: { tier: 'village', config: {} },
    phase: 'canon', addCategory: '', severity: 0.7, dimension: 'legitimacy',
    importance: 'notable', role: '', institutionId: '',
    npcFlaw: '', npcTemperament: '', npcGoals: '', npcConstraint: '', npcSecret: '',
    quality: 'competent', relationshipType: '', criminalOrg: '', criminalOrgs: [], corruptScope: 'individual',
    stressorPick: null, powerCause: 'coup',
    tradeDirection: 'export', tradeEntrepot: false, swapWithNpcId: '', tierDirection: 'promotion',
    customContent, deityRef: REF, deityMode: 'assign', cultRemoveRef: '',
    isWarStressor: false, isInfiltrationStressor: false, instigatorNeighbour: '', instigatorRelationship: 'rival', tradeTarget: '',
    partyCaused: false, description: '',
    ...over,
  });

  test('SET_PRIMARY_DEITY assign resolves the frozen snapshot from customContent', async () => {
    const { buildEvent } = await import('../../src/components/settlement/eventComposer/buildEvent.js');
    const ev = buildEvent(form());
    expect(ev.type).toBe('SET_PRIMARY_DEITY');
    expect(ev.targetId).toBe(REF);
    expect(ev.payload.deityRef).toBe(REF);
    expect(ev.payload.snapshot).toMatchObject({ name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'war' });
  });

  test('SET_PRIMARY_DEITY remove clears the patron (null snapshot, null target)', async () => {
    const { buildEvent } = await import('../../src/components/settlement/eventComposer/buildEvent.js');
    const ev = buildEvent(form({ deityMode: 'remove' }));
    expect(ev.targetId).toBeNull();
    expect(ev.payload).toEqual({ deityRef: null, snapshot: null });
  });

  test('IMPOSE_CULT carries the resolved snapshot on add; drops the named cult on remove', async () => {
    const { buildEvent } = await import('../../src/components/settlement/eventComposer/buildEvent.js');
    const add = buildEvent(form({ type: 'IMPOSE_CULT' }));
    expect(add.targetId).toBe(REF);
    expect(add.payload.snapshot).toMatchObject({ name: 'Vael' });
    const rem = buildEvent(form({ type: 'IMPOSE_CULT', deityMode: 'remove', deityRef: '', cultRemoveRef: REF }));
    expect(rem.targetId).toBe(REF);
    expect(rem.payload).toEqual({ deityRef: REF, snapshot: null });
  });

  test('canStageDeityEvent gates the premium wall and refuses no-op removals', async () => {
    const { canStageDeityEvent } = await import('../../src/components/settlement/eventComposer/EventComposerDeityField.jsx');
    const cfg = (config) => ({ tier: 'village', config });
    // premium wall
    expect(canStageDeityEvent({ type: 'SET_PRIMARY_DEITY', settlement: cfg({}), deityRef: REF, deityMode: 'assign', customContent, canUseCustom: false })).toBe(false);
    // assign with a resolvable deity
    expect(canStageDeityEvent({ type: 'SET_PRIMARY_DEITY', settlement: cfg({}), deityRef: REF, deityMode: 'assign', customContent, canUseCustom: true })).toBe(true);
    // remove with no patron present → no-op, refused
    expect(canStageDeityEvent({ type: 'SET_PRIMARY_DEITY', settlement: cfg({}), deityMode: 'remove', customContent, canUseCustom: true })).toBe(false);
    // remove with a patron present → allowed
    expect(canStageDeityEvent({ type: 'SET_PRIMARY_DEITY', settlement: cfg({ primaryDeitySnapshot: { name: 'X' } }), deityMode: 'remove', customContent, canUseCustom: true })).toBe(true);
  });

  test('SET_PRIMARY_DEITY is authorable in the dropdown and renders the folded deity field', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    render(<EventComposer />);
    const eventSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(eventSelect, { target: { value: 'SET_PRIMARY_DEITY' } });
    // The smoke stub is non-premium (no canUseCustomContent), so the field shows the upsell.
    expect(screen.getByText(/Upgrade to premium/i)).toBeTruthy();
  });
});

describe('Link-neighbour fold — folded "Link a neighbour" entry delegates to onLink', () => {
  test('appears only with an onLink handler + a linkable sibling, and Apply calls onLink', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    // Without onLink, the entry must not appear (no link handler wired).
    const noHandler = render(<EventComposer />);
    expect(noHandler.queryByRole('option', { name: 'Link a neighbour' })).toBeNull();
    noHandler.unmount();

    const onLink = vi.fn();
    render(<EventComposer onLink={onLink} />);
    const eventSelect = screen.getAllByRole('combobox')[0];
    expect(screen.getByRole('option', { name: 'Link a neighbour' })).toBeTruthy();
    fireEvent.change(eventSelect, { target: { value: 'LINK_NEIGHBOUR' } });
    // Partner select (2nd combobox) lists the sibling save; pick it.
    expect(screen.getByRole('option', { name: /Westford/ })).toBeTruthy();
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'save-2' } });
    fireEvent.click(screen.getByRole('button', { name: /Link a neighbour/i }));
    expect(onLink).toHaveBeenCalledTimes(1);
    expect(onLink.mock.calls[0][0]).toMatchObject({ id: 'save-2', name: 'Westford' });
    expect(onLink.mock.calls[0][1]).toBe('neutral');
  });
});
