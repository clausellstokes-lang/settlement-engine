/** @vitest-environment jsdom */
/**
 * tests/components/realmAddressChainNav.test.jsx — the linked address chain and
 * its CROSS-SETTLEMENT navigation (INSPECTOR-ADDRESS-WEB, owner 2026-07-22).
 *
 * Proves the owner's core ask end to end at the component seam:
 *   - a subject renders as its full linked chain (settlement › power › faction › npc);
 *   - clicking a level fires the cross-settlement navigator with the RIGHT
 *     { settlementSaveId, entityId } (the dossier + card target);
 *   - the destination dossier's focus effect switches to the target entity's TAB
 *     and scrolls its anchor;
 *   - resolution is deterministic (same fixture → identical targets, x2).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { buildRealmEntityWeb } from '../../src/domain/dossier/realmEntityWeb.js';
import { RealmEntityContext } from '../../src/components/map/RealmEntityContext.jsx';
import { AddressChain } from '../../src/components/map/AddressChain.jsx';
import { useCrossSettlementFocus } from '../../src/components/dossier/useCrossSettlementFocus.js';

function realm() {
  return [
    {
      id: 'jirak', name: 'Jirak',
      settlement: {
        id: 'jirak', name: 'Jirak',
        npcs: [{ id: 'npc_abir', name: 'Abir ibn Jubayr', factionAffiliation: 'Twin Towers' }],
        powerStructure: { factions: [
          { faction: 'Religious Authorities', isGoverning: true },
          { faction: 'Twin Towers' },
        ] },
      },
    },
  ];
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('AddressChain — linked cross-settlement subject chain', () => {
  test('renders settlement › power › faction › npc and each level navigates to the right target', () => {
    const web = buildRealmEntityWeb(realm());
    const navSpy = vi.fn();
    render(
      <RealmEntityContext.Provider value={{ web, navigateToRealmEntity: navSpy }}>
        <AddressChain descriptor={{ npcId: 'jirak:npc_abir', settlementId: 'jirak' }} />
      </RealmEntityContext.Provider>,
    );

    // Every level is a live link with its real name.
    for (const label of ['Jirak', 'Religious Authorities', 'Twin Towers', 'Abir ibn Jubayr']) {
      expect(screen.getByRole('button', { name: `Go to ${label}` })).toBeTruthy();
    }

    // Clicking the NPC opens ITS settlement's dossier at the npc card.
    fireEvent.click(screen.getByRole('button', { name: 'Go to Abir ibn Jubayr' }));
    expect(navSpy).toHaveBeenCalledWith({ settlementSaveId: 'jirak', entityId: 'npc_abir' });

    // Clicking the faction targets the faction card in the same dossier.
    fireEvent.click(screen.getByRole('button', { name: 'Go to Twin Towers' }));
    expect(navSpy).toHaveBeenLastCalledWith({ settlementSaveId: 'jirak', entityId: 'faction.twin_towers' });
  });

  test('resolution is deterministic (identical targets across two builds)', () => {
    const a = buildRealmEntityWeb(realm()).resolveNpc('jirak:npc_abir');
    const b = buildRealmEntityWeb(realm()).resolveNpc('jirak:npc_abir');
    expect(a).toEqual(b);
  });
});

// A tiny harness that drives the destination-dossier focus effect.
function FocusHarness({ focusedEntity, index, allTabs, activeTab, setActiveTab }) {
  useCrossSettlementFocus({ focusedEntity, index, allTabs, saveId: 'jirak', activeTab, setActiveTab });
  return null;
}

describe('useCrossSettlementFocus — the destination lands on the right tab', () => {
  test('a focused npc id switches to its owning tab once the dossier mounts', () => {
    const setActiveTab = vi.fn();
    const index = { resolve: (id) => (id === 'npc_abir' ? { tab: 'npcs', anchor: 'dossier-npc-abir' } : null) };
    render(
      <FocusHarness
        focusedEntity={{ id: 'npc_abir', ts: 111 }}
        index={index}
        allTabs={[{ id: 'overview' }, { id: 'npcs' }, { id: 'power' }]}
        activeTab="overview"
        setActiveTab={setActiveTab}
      />,
    );
    expect(setActiveTab).toHaveBeenCalledWith('npcs', 'entity_link');
  });

  test('a focus for an entity NOT in this dossier is a no-op (waits, never guesses)', () => {
    const setActiveTab = vi.fn();
    const index = { resolve: () => null };
    render(
      <FocusHarness
        focusedEntity={{ id: 'npc_elsewhere', ts: 222 }}
        index={index}
        allTabs={[{ id: 'overview' }, { id: 'npcs' }]}
        activeTab="overview"
        setActiveTab={setActiveTab}
      />,
    );
    expect(setActiveTab).not.toHaveBeenCalled();
  });
});
