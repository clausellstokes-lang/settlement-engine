/**
 * @vitest-environment jsdom
 *
 * tests/ui/dossierEntityLink.test.jsx
 *
 * Phase A dossier hyperlinks, end to end against the REAL store + navigator:
 *   - EntityLink renders an entity's current name and is rename-safe;
 *   - a broken id degrades to plain text, not a dead link;
 *   - clicking an EntityLink runs navigateToEntity -> switches to the entity's
 *     tab + sets focusedEntity (the selected-entity source of truth);
 *   - the PILOT round-trip: an NPC's faction link lands the Power tab on that
 *     faction's expanded row (the open-one-card affordance).
 */
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { useStore } from '../../src/store/index.js';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import EntityLink from '../../src/components/primitives/EntityLink.jsx';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { factionIdFromName } from '../../src/lib/entities.js';

afterEach(() => {
  cleanup();
  act(() => { useStore.getState().clearFocusedEntity?.(); });
});

function makeSettlement() {
  return {
    id: 'settlement.ashford',
    name: 'Ashford',
    npcs: [
      { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', factionAffiliation: 'Iron Guild' },
    ],
    powerStructure: {
      factions: [
        { faction: 'Iron Guild', power: 60, desc: 'The metalworkers who hold the forge.' },
        { faction: 'Free Wharf', power: 40, desc: 'The dockers who run the quay.' },
      ],
    },
  };
}

// A tiny harness that builds the REAL navigator over a settlement and exposes a
// spy for the tab the navigator selects.
function Harness({ settlement, tabs, setActiveTab, children }) {
  const value = useDossierEntityNav(settlement, setActiveTab, tabs);
  return (
    <DossierEntityContext.Provider value={value}>
      {children}
    </DossierEntityContext.Provider>
  );
}

const ALL_TABS = [{ id: 'npcs' }, { id: 'power' }, { id: 'overview' }];

describe('EntityLink', () => {
  it('renders the entity current name and is rename-safe', () => {
    const settlement = makeSettlement();
    const setActiveTab = vi.fn();
    const id = factionIdFromName('Iron Guild');

    const { rerender } = render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={setActiveTab}>
        <EntityLink id={id} type="faction" fallback="the guild" />
      </Harness>
    );
    expect(screen.getByRole('button', { name: 'Go to Iron Guild' })).toBeTruthy();

    // Rename the faction on the raw object and rebuild the navigator (new
    // settlement identity). The link must show the NEW name.
    const renamed = makeSettlement();
    renamed.powerStructure.factions[0].faction = 'The Iron Guild';
    rerender(
      <Harness settlement={renamed} tabs={ALL_TABS} setActiveTab={setActiveTab}>
        <EntityLink id={factionIdFromName('The Iron Guild')} type="faction" fallback="the guild" />
      </Harness>
    );
    expect(screen.getByRole('button', { name: 'Go to The Iron Guild' })).toBeTruthy();
  });

  it('renders fallback as plain text (not a link) for an unknown id', () => {
    const settlement = makeSettlement();
    render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={vi.fn()}>
        <EntityLink id="faction.ghost" type="faction" fallback="a vanished cabal" />
      </Harness>
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('a vanished cabal')).toBeTruthy();
  });

  it('renders an ambiguous legacy identity as plain text instead of choosing a sibling', () => {
    const settlement = {
      ...makeSettlement(),
      npcs: [
        { id: 'npc_shared', name: 'First survivor' },
        { id: 'npc_shared', name: 'Second survivor' },
      ],
    };
    render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={vi.fn()}>
        <EntityLink id="npc_shared" type="npc" fallback="a surviving witness" />
      </Harness>
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('a surviving witness')
      .getAttribute('data-entity-identity')).toBe('degraded_collision');
  });

  it('navigateToEntity switches to the target tab and sets focusedEntity', () => {
    const settlement = makeSettlement();
    const setActiveTab = vi.fn();
    const id = factionIdFromName('Iron Guild');

    render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={setActiveTab}>
        <EntityLink id={id} type="faction" fallback="the guild" />
      </Harness>
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Go to Iron Guild' }));
    });

    expect(setActiveTab).toHaveBeenCalledWith('power', 'entity_link');
    expect(useStore.getState().focusedEntity?.id).toBe(id);
  });

  it('no-ops when the target tab is gated out of this settlement', () => {
    const settlement = makeSettlement();
    const setActiveTab = vi.fn();
    const id = factionIdFromName('Iron Guild');

    render(
      <Harness settlement={settlement} tabs={[{ id: 'npcs' }]} setActiveTab={setActiveTab}>
        <EntityLink id={id} type="faction" fallback="the guild" />
      </Harness>
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Go to Iron Guild' }));
    });
    expect(setActiveTab).not.toHaveBeenCalled();
  });
});

describe('EntityLink — verbatim (pronoun) links', () => {
  it('renders the wrapped WORD, not the entity name, and still links to the entity', () => {
    const settlement = makeSettlement();
    const setActiveTab = vi.fn();
    const id = factionIdFromName('Iron Guild');

    render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={setActiveTab}>
        <EntityLink id={id} type="faction" fallback="they" verbatim />
      </Harness>
    );
    // A resolved pronoun link shows "they" (the word), never "Iron Guild"…
    const btn = screen.getByRole('button', { name: 'Go to Iron Guild' });
    expect(btn.textContent).toBe('they');
    expect(screen.queryByText('Iron Guild')).toBeNull();
    // …and clicking it navigates to the entity's card.
    act(() => { fireEvent.click(btn); });
    expect(setActiveTab).toHaveBeenCalledWith('power', 'entity_link');
    expect(useStore.getState().focusedEntity?.id).toBe(id);
  });

  it('degrades a broken pronoun link to the bare word (plain text, no link)', () => {
    const settlement = makeSettlement();
    render(
      <Harness settlement={settlement} tabs={ALL_TABS} setActiveTab={vi.fn()}>
        <EntityLink id="faction.ghost" type="faction" fallback="it" verbatim />
      </Harness>
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('it')).toBeTruthy();
  });
});

describe('PILOT round-trip: NPC faction link -> Power tab opens that faction', () => {
  it('expands the focused faction row in PowerTab', () => {
    const settlement = makeSettlement();
    const id = factionIdFromName('Iron Guild');

    // PowerTab reads focusedEntity from the real store. The "Iron Guild" desc is
    // hidden until its row is expanded, so its presence proves the open-one-card
    // affordance fired for the focused faction (and not the other one).
    render(<PowerTab powerStructure={settlement.powerStructure} settlement={settlement} narrativeNote={null} />);

    expect(screen.queryByText('The metalworkers who hold the forge.')).toBeNull();

    act(() => { useStore.getState().focusEntity(id); });

    expect(screen.getByText('The metalworkers who hold the forge.')).toBeTruthy();
    // The OTHER faction stays collapsed.
    expect(screen.queryByText('The dockers who run the quay.')).toBeNull();
  });
});

describe('X-20 (c): the focus convention on every card type (useEntityFocus)', () => {
  it('an NPC card, an institution card and a history event card each open and scroll on focus', async () => {
    const { NPCInlineCard } = await import('../../src/components/new/npcComponents.jsx');
    const { InstitutionCard } = await import('../../src/components/new/tabs/InstitutionsTab.jsx');
    const { HistoryEventCard } = await import('../../src/components/new/tabs/HistoryTab.jsx');
    const { entityIdFor, eventIdFor } = await import('../../src/domain/dossier/entityLinks.js');
    const scrolled = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoView() { scrolled.push(this.id); };
    try {
      const npc = { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', structuralPosition: 'Holds the reeve seat by habit.' };
      const inst = { name: 'Granary', category: 'Economy', desc: 'Grain in, grain out.' };
      const evt = { id: 'evt_fire', name: 'The Great Fire', type: 'disaster', yearsAgo: 40, description: 'Half the quay burned.', lastingEffects: ['A stone quay replaced the timber one'] };
      function EventHost() {
        const [open, setOpen] = React.useState(false);
        return <HistoryEventCard evt={evt} h={{ historicalEvents: [evt] }} isExp={open} onToggle={() => setOpen((v) => !v)} />;
      }
      render(<>
        <NPCInlineCard npc={npc} />
        <InstitutionCard inst={inst} category="Economy" label="Granary" services={[]} sets={{ impaired: new Set(), degraded: new Set(), vulnerable: new Set() }} />
        <EventHost />
      </>);
      expect(screen.queryByText('Holds the reeve seat by habit.')).toBeNull();
      expect(screen.queryByText('A stone quay replaced the timber one')).toBeNull();

      act(() => { useStore.getState().focusEntity(entityIdFor('npc', npc)); });
      expect(screen.getByText('Holds the reeve seat by habit.')).toBeTruthy();
      expect(scrolled).toContain('dossier-npc-npc-1');

      act(() => { useStore.getState().focusEntity(entityIdFor('institution', inst)); });
      expect(scrolled).toContain('dossier-institution-granary');

      act(() => { useStore.getState().focusEntity(eventIdFor(evt)); });
      expect(screen.getByText('A stone quay replaced the timber one')).toBeTruthy();
      expect(scrolled).toContain('dossier-event-evt-fire');
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });

  it('a focus on one card leaves its siblings closed, and a repeat click re-fires', async () => {
    const { NPCInlineCard } = await import('../../src/components/new/npcComponents.jsx');
    render(<>
      <NPCInlineCard npc={{ id: 'npc_1', name: 'Mara Voss', structuralPosition: 'Mara sits the bench.' }} />
      <NPCInlineCard npc={{ id: 'npc_2', name: 'Odo Penn', structuralPosition: 'Odo keeps the forge.' }} />
    </>);
    act(() => { useStore.getState().focusEntity('npc_1'); });
    expect(screen.getByText('Mara sits the bench.')).toBeTruthy();
    expect(screen.queryByText('Odo keeps the forge.')).toBeNull();
    // The reader collapses the card, then follows the same link again: it opens again.
    fireEvent.click(screen.getAllByRole('button', { expanded: true })[0]);
    expect(screen.queryByText('Mara sits the bench.')).toBeNull();
    act(() => { useStore.getState().focusEntity('npc_1'); });
    expect(screen.getByText('Mara sits the bench.')).toBeTruthy();
  });
});
