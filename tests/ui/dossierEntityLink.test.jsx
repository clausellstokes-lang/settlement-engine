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
