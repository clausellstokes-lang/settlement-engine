/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 1 — A HOUSE NAMED AS A LABEL CARRIES NO CATALOGUE MACHINERY (the cold list
 * REVIEW-W2A-3, f385d487b: MEDIUM #140 "Dream parlors (high magic) · member of Arcane Orders",
 * #960 "Merchant guilds (15-40) · member of Merchant Guilds" on the NPC card; #269 #444 "Craft
 * guilds (5-15) · Bowyers & fletchers (guild)" on a metropolis chain card whose roster holds
 * "Craft guilds (100-150+)").
 *
 * One home: institutionDisplayName.js :: institutionHouseLabel (the seam's label without a count
 * range or a catalogue gate). Its readers: the NPC card's house door, the chain card's houses
 * (domain/display/chainHouses.js, read by SupplyChainsPanel.jsx :: chainFlowFacts and the PDF's
 * chain card). The roster keeps the catalogue name it has always printed (ODQ §934.13).
 */
import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, within } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { chainHousesOf } from '../../src/domain/display/chainHouses.js';
import { chainFlowFacts } from '../../src/components/new/SupplyChainsPanel.jsx';
import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { useStore } from '../../src/store/index.js';

const GUILDSMAN = {
  id: 'npc_guild', name: 'Ada Vell', role: 'the guildmaster', title: 'the guildmaster', category: 'economy',
  institution: { kind: 'house', key: 'Merchant guilds (15-40)', family: 'merchant guilds', title: 'the guildmaster', veiled: false },
  memberships: [{ power: 'Merchant Guilds', rank: 2 }],
};
const DREAMER = {
  id: 'npc_dream', name: 'Ilse Moor', role: 'the dream-seller', title: 'the dream-seller', category: 'magic',
  institution: { kind: 'house', key: 'Dream parlors (high magic)', family: 'dream parlors', title: 'the dream-seller', veiled: false },
  memberships: [{ power: 'Arcane Orders', rank: 2 }],
};
const SETTLEMENT = {
  id: 'settlement.vell', name: 'Vellhaven', tier: 'city', population: 12000,
  institutions: [
    { name: 'Merchant guilds (15-40)', category: 'Economy', desc: 'Guild halls.' },
    { name: 'Dream parlors (high magic)', category: 'Magic', desc: 'Dreams sold.' },
    { name: 'Craft guilds (100-150+)', category: 'Crafts', desc: 'Guilds of every craft.' },
  ],
  npcs: [GUILDSMAN, DREAMER],
  powerStructure: { factions: [{ faction: 'Merchant Guilds', category: 'economy', power: 40 }, { faction: 'Arcane Orders', category: 'magic', power: 20 }] },
  availableServices: {},
};
const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'npcs' }, { id: 'power' }];
function Dossier({ settlement, children }) {
  const value = useDossierEntityNav(settlement, vi.fn(), TABS, {});
  return <DossierEntityContext.Provider value={value}>{children}</DossierEntityContext.Provider>;
}

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
beforeEach(() => { act(() => { useStore.setState({ settlement: SETTLEMENT }); }); });
afterEach(cleanup);

describe('the one home: institutionHouseLabel', () => {
  test('each catalogue name reads its house label', () => {
    const TABLE = [
      ['Merchant guilds (15-40)', 'Merchant guilds'],
      ['Craft guilds (100-150+)', 'Craft guilds'],
      ['Dream parlors (high magic)', 'Dream parlors'],
      ['Cathedral (10,000+ only)', 'Cathedral'],
      ['Parish churches (2-5)', 'Houses of worship'],
      ['Bowyers & fletchers (guild)', 'Bowyers & fletchers (guild)'],
      ['Resident smith (part-time)', 'Resident smith (part-time)'],
      ['Stormwatch Keep', 'Stormwatch Keep'],
    ];
    for (const [raw, label] of TABLE) expect(institutionHouseLabel(raw), raw).toBe(label);
  });
});

describe('the NPC card names its house without the catalogue\'s count or gate', () => {
  test('resolved links: the guild\'s count and the parlour\'s gate leave the card line', () => {
    for (const [npc, label, machinery] of [[GUILDSMAN, 'Merchant guilds', /\(15-40\)/], [DREAMER, 'Dream parlors', /high magic/]]) {
      const { getByTestId } = render(<Dossier settlement={SETTLEMENT}><NPCInlineCard npc={npc} /></Dossier>);
      const door = getByTestId('npc-institution-door');
      expect(door.textContent).toBe(label);
      expect(within(door).getByRole('button')).toBeTruthy();
      // anchored: the door inside this line is asserted to read its label just above
      expect(door.closest('[data-testid="npc-card-line"]').textContent).not.toMatch(machinery);
      cleanup();
    }
  });
  test('an unresolved door (no dossier index) prints the same label as plain text', () => {
    const { getByTestId } = render(<NPCInlineCard npc={GUILDSMAN} />);
    expect(getByTestId('npc-institution-door').textContent).toBe('Merchant guilds');
  });
});

describe('a chain card names the houses, never a rank the roster does not hold', () => {
  const names = SETTLEMENT.institutions.map((i) => i.name);
  test('the pattern "Craft guilds (5-15)" over a roster of "Craft guilds (100-150+)" reads "Craft guilds"', () => {
    const facts = chainFlowFacts({ processingInstitutions: ['Craft guilds (5-15)', 'Bowyers & fletchers (guild)'] }, names);
    expect(facts.institutions.map((h) => h.name)).toEqual(['Craft guilds', 'Bowyers & fletchers (guild)']);
    expect(facts.institutions[0].present).toBe(true);
  });
  test('two ranks of one house are one house', () => {
    expect(chainHousesOf(['Merchant guilds (3-8)', 'Merchant guilds (15-40)', 'Annual fair'], names).map((h) => h.name))
      .toEqual(['Merchant guilds', 'Annual fair']);
  });
});
