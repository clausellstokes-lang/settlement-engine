/** @vitest-environment jsdom */
/**
 * peopleRowsApart.test.jsx — R2-CODE-B-5: the people surfaces print two things as two things, and a separator only
 * between two of them. No word changes.
 *
 *   HEADER — the NPCs tab's tally prints "1 high influence" alone, never "1 high influence ·" with nothing after it
 *            (the increment's rpf-hamlet-succession_void-13).
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { useStore } from '../../src/store/index.js';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';

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

