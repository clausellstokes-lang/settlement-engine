/**
 * @vitest-environment jsdom
 *
 * tests/ui/powerTabAssociatedInstitutions.test.jsx
 *
 * The Power tab's per-faction expansion shows TWO labeled lists in one format:
 *   - "Associated NPCs"        — the existing sub-faction member list (relabeled);
 *   - "Associated Institutions"— NEW: the institutions this power touches,
 *                                 derived from its members' category→institution
 *                                 affinity, each a rename-safe EntityLink.
 *
 * Covered:
 *   - both labels render verbatim on an expanded faction;
 *   - the institutions match the members' inferred institutions, deduped;
 *   - an institution entry is an EntityLink (navigates to the institution card);
 *   - a faction whose members imply no institution renders a quiet "None".
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within, cleanup, act } from '@testing-library/react';
import { useStore } from '../../src/store/index.js';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { factionIdFromName } from '../../src/lib/entities.js';

afterEach(() => {
  cleanup();
  act(() => { useStore.getState().clearFocusedEntity?.(); });
});

// A settlement whose Watch faction has two `military` members (collapsing to the
// one garrison institution) and a Wharf faction whose `economy` member has NO
// matching institution (so its institution list is empty -> "None").
function makeSettlement() {
  return {
    id: 'settlement.ashford',
    name: 'Ashford',
    institutions: [
      { name: 'The Iron Garrison' }, // matches the military hint (garrison)
    ],
    npcs: [
      { id: 'npc_1', name: 'Mara Voss',  role: 'Captain',  category: 'military' },
      { id: 'npc_2', name: 'Dorn Hale',  role: 'Sergeant', category: 'military' },
      { id: 'npc_3', name: 'Pell Quist', role: 'Broker',   category: 'economy'  },
    ],
    // Sub-faction groups (s.factions) keyed to a power faction by powerFactionName.
    factions: [
      {
        name: 'The Watch Cohort',
        powerFactionName: 'City Watch',
        members: [
          { id: 'npc_1', name: 'Mara Voss', role: 'Captain',  category: 'military' },
          { id: 'npc_2', name: 'Dorn Hale', role: 'Sergeant', category: 'military' },
        ],
      },
      {
        name: 'The Wharf Bloc',
        powerFactionName: 'Free Wharf',
        members: [
          { id: 'npc_3', name: 'Pell Quist', role: 'Broker', category: 'economy' },
        ],
      },
    ],
    powerStructure: {
      factions: [
        { faction: 'City Watch', power: 60, desc: 'The militia that holds the wall.' },
        { faction: 'Free Wharf', power: 40, desc: 'The dockers who run the quay.' },
      ],
    },
  };
}

const ALL_TABS = [{ id: 'npcs' }, { id: 'power' }, { id: 'overview' }];

function renderPowerTab(settlement) {
  function Harness() {
    const value = useDossierEntityNav(settlement, () => {}, ALL_TABS);
    return (
      <DossierEntityContext.Provider value={value}>
        <PowerTab
          powerStructure={settlement.powerStructure}
          settlement={settlement}
          narrativeNote={null}
        />
      </DossierEntityContext.Provider>
    );
  }
  return render(<Harness />);
}

describe('PowerTab — Associated NPCs + Associated Institutions', () => {
  it('shows both labeled lists when a faction is expanded', () => {
    const settlement = makeSettlement();
    renderPowerTab(settlement);

    // Open the City Watch row via its faction focus (the open-one-card affordance).
    act(() => { useStore.getState().focusEntity(factionIdFromName('City Watch')); });

    expect(screen.getByText('Associated NPCs')).toBeTruthy();
    expect(screen.getByText('Associated Institutions')).toBeTruthy();
  });

  it('lists the members\' inferred institution, deduped, as an EntityLink', () => {
    const settlement = makeSettlement();
    renderPowerTab(settlement);
    act(() => { useStore.getState().focusEntity(factionIdFromName('City Watch')); });

    // Both military members imply the same garrison -> a SINGLE deduped link.
    const links = screen.getAllByRole('button', { name: 'Go to The Iron Garrison' });
    expect(links).toHaveLength(1);
    // It is a genuine EntityLink (navigates), not plain text.
    expect(links[0].getAttribute('data-entity-type')).toBe('institution');
  });

  it('renders a quiet "None" when no member implies an institution', () => {
    const settlement = makeSettlement();
    renderPowerTab(settlement);
    act(() => { useStore.getState().focusEntity(factionIdFromName('Free Wharf')); });

    // The Wharf has the label but no resolvable institution -> "None", no link.
    expect(screen.getByText('Associated Institutions')).toBeTruthy();
    expect(screen.getByText('None')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Go to The Iron Garrison/ })).toBeNull();
  });

  it('keeps the Associated Institutions list scoped to its own faction', () => {
    const settlement = makeSettlement();
    renderPowerTab(settlement);
    // Expand the Wharf only — the garrison belongs to the Watch, not here.
    act(() => { useStore.getState().focusEntity(factionIdFromName('Free Wharf')); });

    const dockers = screen.getByText('The dockers who run the quay.');
    // The garrison link must not appear under the Wharf's expanded block.
    expect(within(dockers.closest('div')).queryByText('The Iron Garrison')).toBeNull();
  });
});
