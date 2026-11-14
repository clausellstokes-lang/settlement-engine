/** @vitest-environment jsdom */
/**
 * peopleRowsApart.test.jsx — R2-CODE-B-5: the people surfaces print two things as two things, and a separator only
 * between two of them. No word changes.
 *
 *   HEADER — the NPCs tab's tally prints "1 high influence" alone, never "1 high influence ·" with nothing after it
 *            (the increment's rpf-hamlet-succession_void-13).
 *   CHIPS  — the card's trait chips are two things: the copied text keeps a space between them ("Flaw: vain
 *            Temperament: clever", never "Flaw: vainTemperament: clever"; the third seat's note).
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { useStore } from '../../src/store/index.js';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';
import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';

const townOf = (npcs) => ({
  id: 'town-1',
  name: 'Testford',
  npcs,
  relationships: [],
  powerStructure: { factions: [{ faction: 'Council', category: 'civic' }], conflicts: [] },
  history: { age: 140, founding: null, historicalCharacter: '', eventsTimeline: [], currentTensions: [], historicalEvents: [] },
});
const person = (id, name, influence) => ({ id, name, role: 'reeve', influence, memberships: [{ power: 'Council', rank: 1 }] });
const headerOf = (npcs) => {
  const town = townOf(npcs);
  const { container } = render(<NPCsTab npcs={town.npcs} settlement={town} narrativeNote={null} pinnedIds={new Set()} />);
  const tally = [...container.querySelectorAll('span')].map((s) => s.textContent).find((t) => /^\d+ (high influence|moderate)/.test(t)) ?? '';
  return { tally, text: container.textContent };
};

beforeEach(() => { useStore.setState({ settlement: null, savedSettlements: [], editMode: false }); });
afterEach(cleanup);

describe('HEADER — the tally\'s separator stands only between two counts', () => {
  test('high influence and nothing moderate: the count alone, no dangling separator', () => {
    const { tally, text } = headerOf([person('npc_0', 'Alda Reeve', 'high'), person('npc_1', 'Bran Smith', 'low')]);
    expect(tally).toBe('1 high influence');
    expectAbsentWithAnchor(text, '1 high influence ·', '1 high influence', 'a separator with nothing after it');
  });
  test('both counts: one separator between them, as before', () => {
    const { tally } = headerOf([person('npc_0', 'Alda Reeve', 'high'), person('npc_1', 'Bran Smith', 'moderate')]);
    expect(tally).toBe('1 high influence · 1 moderate');
  });
  test('moderate alone: the count alone', () => {
    const { tally } = headerOf([person('npc_1', 'Bran Smith', 'moderate')]);
    expect(tally).toBe('1 moderate');
  });
});

describe('CHIPS — two trait chips are two things', () => {
  const openCard = (npc) => {
    const { container } = render(<NPCInlineCard npc={npc} pinnedIds={new Set()} />);
    fireEvent.click(container.querySelector('button[aria-expanded]'));
    return container.textContent;
  };
  test('a flaw and a temperament: a space the copied text keeps between them', () => {
    const text = openCard({ id: 'npc_0', name: 'Alda Reeve', role: 'reeve', influence: 'low', personality: { flaw: 'vain', dominant: 'clever' } });
    expect(text).toContain('Flaw: vain Temperament: clever');
    expectAbsentWithAnchor(text, 'vainTemperament', 'Flaw: vain', 'two chips run together');
  });
  test('one chip: no space added before it', () => {
    const text = openCard({ id: 'npc_1', name: 'Bran Smith', role: 'smith', influence: 'low', personality: { flaw: 'proud' } });
    expect(text).toContain('Flaw: proud');
    expectAbsentWithAnchor(text, ' Flaw: proud', 'Flaw: proud', 'a space before the first chip');
  });
});
