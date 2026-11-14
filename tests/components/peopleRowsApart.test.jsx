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

// ── WHO RUNS — the DM view's rows add a person's title only where the person's name does not already carry it (the
// chair's ruling; CENSUS-2 kind d: "Tserenpuntsag Jalayir (the workhouse master), the workhouse master", r2r-metropolis-7).
// The rows are read from a fixed view (the panel's one reader, dmPowerViewOf, is mocked), page and PDF alike.
const DM_VIEW = vi.hoisted(() => ({
  tierNoun: 'city', ruler: null,
  rulingThree: [
    { id: 'npc_r1', rank: 1, name: 'Toghan Arlat (the master of granaries)', title: 'the master of granaries', openPowers: [], lends: [], answersTo: null },
    { id: 'npc_r2', rank: 2, name: 'Alda Reeve', title: 'the reeve', openPowers: [], lends: [], answersTo: null },
  ],
  answers: [{
    guild: 'Thieves guild', boss: { id: 'npc_b', name: 'Orm Lordsson', title: 'Lord' },
    handlers: [{
      id: 'npc_h', name: 'Kunhild Ihle (the pawnbroker)', title: 'the pawnbroker', house: null,
      agents: [
        { id: 'npc_a1', name: 'Tserenpuntsag Jalayir (the workhouse master)', title: 'the workhouse master', house: null, brings: 'coin', tie: null },
        { id: 'npc_a2', name: 'Bran Smith', title: 'the smith', house: null, brings: 'tools', tie: null },
      ],
    }],
  }],
  fronts: [], hall: { label: 'The hall', line: 'It keeps its own counsel.' }, boosts: [],
}));
vi.mock('../../src/domain/people/patronage.js', async (orig) => ({ ...(await orig()), dmPowerViewOf: () => DM_VIEW }));
import WhoRunsThisTownPanel from '../../src/components/new/tabs/WhoRunsThisTownPanel.jsx';
import { WhoRunsThisTown } from '../../src/pdf/sections/WhoRunsThisTown.jsx';

/** Every string a react-pdf element tree prints, in order (components are not called: their children are walked). */
const pdfText = (node) => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node)
  : Array.isArray(node) ? node.map(pdfText).join('\n') : pdfText(node.props?.children));

describe('WHO RUNS — a title is added only where the name does not carry it', () => {
  const twice = ['the master of granaries), the master of granaries', 'the pawnbroker), the pawnbroker', 'the workhouse master), the workhouse master'];
  test('the page: no title printed twice; a title the name lacks still prints', () => {
    const text = render(<WhoRunsThisTownPanel settlement={{ id: 'x' }} />).container.textContent;
    for (const t of twice) expectAbsentWithAnchor(text, t, 'Tserenpuntsag Jalayir (the workhouse master)', 'a title printed twice');
    expect(text).toContain('Tserenpuntsag Jalayir (the workhouse master) · brings coin');
    expect(text).toContain('Bran Smith, the smith');
    expect(text).toContain('Alda Reeve, the reeve');
    // a title inside a longer word of the name is not carried by it
    expect(text).toContain('Orm Lordsson, Lord');
  });
  test('the PDF twin: the same rows', () => {
    const text = pdfText(WhoRunsThisTown({ dm: DM_VIEW }));
    for (const t of twice) expectAbsentWithAnchor(text, t, 'Tserenpuntsag Jalayir (the workhouse master)', 'a title printed twice');
    expect(text).toContain('Tserenpuntsag Jalayir (the workhouse master) · brings coin');
    expect(text).toContain('Bran Smith, the smith');
    expect(text).toContain('Second · Alda Reeve, the reeve');
    expect(text).toContain('led by Orm Lordsson, Lord');
  });
});
