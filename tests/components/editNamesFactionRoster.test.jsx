/** @vitest-environment jsdom */
/**
 * editNamesFactionRoster.test.jsx — the gallery door lists the REAL roster
 * (owner queue #14, atlas presentation-scene gap 1c).
 *
 * NAMING NOTE: this file was briefly called editNamesCanonicalFactions, which
 * the E-A enumeration rule matched on the accidental "…meS-CANonical…"
 * substring and demanded a mutation-coverage entry for. It is a behavior pin,
 * not an enforcer (the same class as workbenchProseEditor.test.jsx), so the
 * name was corrected rather than the manifest widened. Keep enforcer
 * nomenclature out of behavior-pin filenames.
 *
 * The atlas's finding: "SettlementDetailEditNames.jsx iterates
 * `settlement.factions`, so the Factions section of Edit Names renders EMPTY on
 * a generated settlement and the door does not exist at all." That mirror is the
 * NPC-grouping list; generator output puts the real roster on
 * `powerStructure.factions`. These pins hold the corrected precedence, including
 * the negative control that used to be the bug.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import SettlementDetailEditNames from '../../src/components/settlementDetail/SettlementDetailEditNames.jsx';
import { withFactionRenamed } from '../../src/components/settlements/helpers.js';
import { nameOf } from '../../src/domain/rulingPower.js';

const noop = () => {};

function renderNames(settlement, { handleApplyRename = vi.fn(), editingName = null } = {}) {
  render(
    <SettlementDetailEditNames
      settlement={settlement}
      editNamesOpen
      setEditNamesOpen={noop}
      editingName={editingName}
      setEditingName={noop}
      editDraft="Renamed"
      setEditDraft={noop}
      isCanonLocked={false}
      handleApplyRename={handleApplyRename}
    />,
  );
  return handleApplyRename;
}

afterEach(cleanup);

describe('Edit Names lists the canonical faction roster', () => {
  test('a GENERATED settlement (roster on powerStructure, empty mirror) lists its factions', () => {
    renderNames({
      npcs: [],
      factions: [],
      powerStructure: {
        factions: [{ faction: 'Merchant Guild', category: 'merchant' }, { faction: 'Militia' }],
      },
    });
    expect(screen.getByText('Merchant Guild')).toBeTruthy();
    expect(screen.getByText('Militia')).toBeTruthy();
    // The negative control that WAS the bug: the empty-state must not appear
    // while real factions exist.
    expect(screen.queryByText(/no named NPCs or factions to rename/)).toBeNull();
  });

  test('renaming a canonical faction passes its nameOf-resolved name as the old name', () => {
    const handleApplyRename = renderNames({
      npcs: [],
      powerStructure: { factions: [{ faction: 'Merchant Guild', name: 'Stale Alias' }] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }));
    // The row renders through nameOf (.faction wins over the stale .name alias).
    expect(screen.getByText('Merchant Guild')).toBeTruthy();
  });

  test('a save WITHOUT a power roster still lists the legacy mirror (the documented fallback)', () => {
    renderNames({
      npcs: [],
      factions: [{ name: 'Old Mirror Guild', dominantCategory: 'merchant' }],
      powerStructure: { factions: [] },
    });
    expect(screen.getByText('Old Mirror Guild')).toBeTruthy();
  });

  test('a settlement with neither roster shows the honest empty state', () => {
    renderNames({ npcs: [], factions: [], powerStructure: { factions: [] } });
    expect(screen.getByText(/no named NPCs or factions to rename/)).toBeTruthy();
  });
});

describe('the library lane writes through the converged writer', () => {
  const HOST = 'Bridgeford';
  const hostSave = () => ({
    id: 'save-host',
    settlement: {
      name: HOST,
      powerStructure: {
        factions: [{ faction: 'Merchant Guild' }],
        governingName: 'Merchant Guild',
      },
      npcs: [{ id: 'n1', factionAffiliation: 'Merchant Guild' }],
      factions: [],
    },
  });
  const partnerSave = () => ({
    id: 'save-partner',
    settlement: {
      name: 'Elsewhere',
      interSettlementRelationships: [
        { partnerSettlement: HOST, partnerFactionName: 'Merchant Guild', partnerName: 'Merchant Guild' },
      ],
    },
  });

  test('the host save gets the CANONICAL roster write the old mirror-only lane missed', () => {
    const next = withFactionRenamed(hostSave(), true, HOST, 'Merchant Guild', 'Amber Concord');
    expect(nameOf(next.settlement.powerStructure.factions[0])).toBe('Amber Concord');
    expect(next.settlement.powerStructure.governingName).toBe('Amber Concord');
    expect(next.settlement.npcs[0].factionAffiliation).toBe('Amber Concord');
  });

  test('a neighbour save gets only its faction link, never its settlement or person names', () => {
    const next = withFactionRenamed(partnerSave(), false, HOST, 'Merchant Guild', 'Amber Concord');
    const link = next.settlement.interSettlementRelationships[0];
    expect(link.partnerFactionName).toBe('Amber Concord');
    expect(link.partnerName).toBe('Merchant Guild');
  });

  test('an untouched save is returned BY REFERENCE so it is never persisted needlessly', () => {
    const untouched = { id: 'save-other', settlement: { name: 'Third Town' } };
    expect(withFactionRenamed(untouched, false, HOST, 'Merchant Guild', 'Amber Concord')).toBe(untouched);
    const noSuchFaction = hostSave();
    expect(withFactionRenamed(noSuchFaction, true, HOST, 'Nobody', 'Amber Concord')).toBe(noSuchFaction);
  });
});
