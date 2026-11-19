/** @vitest-environment jsdom */
/**
 * ROUND THREE item 3 (the cut's #967 #968 #1097 and #389; ROUND-3-CUT at fe6d5b741):
 *   - "Hidden allegiance answers to Whisper market, through Achilles Melissenos" where Achilles is the Black market's
 *     black marketeer (rr2s-city-under_siege+famine-rand-1): the card names the handler only where the record puts the
 *     handler in the house or power the person answers to (the handler's own house, or a standing in that power);
 *   - the copied text of the card's badge and line, and of a conflict card's pill and parties, keeps them apart
 *     ("Hidden allegianceanswers to …", "Moderate tensionMilitary Council vs …").
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ConflictCard, NPCCategoryGroup } from '../../src/components/new/npcComponents.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

afterEach(cleanup);

/** Render one person's card, opened, in a town; the allegiance line's text. @param {any} npc @param {any} town */
function allegianceLineOf(npc, town) {
  render(<NPCCategoryGroup category="civic" label="Civic" group={[npc]} settlement={town} />);
  const toggles = screen.getAllByRole('button', { expanded: false });
  fireEvent.click(toggles[toggles.length - 1]);
  const row = [...document.querySelectorAll('div')].find((d) => /^Hidden allegiance/.test((d.textContent || '').trim()) && d.children.length >= 2);
  const text = (row?.textContent || '').replace(/\s+/g, ' ').trim();
  cleanup();
  return text;
}
const agent = { id: 'a1', name: 'Pavlos Kyriadotes', allegiance: { power: null, house: 'Whisper market', vector: 'greed', via: 'retainer', handler: 'h1', share: 0.15, veiled: true, covert: true } };
/** @param {string} key @param {string[]} [powers] */
const townWithHandler = (key, powers = []) => ({ npcs: [agent, { id: 'h1', name: 'Achilles Melissenos', institution: { kind: 'house', key }, memberships: powers.map((power) => ({ power, rank: 3 })) }] });

describe('ROUND THREE · the hidden allegiance names a handler of that house only', () => {
  test('a handler of another house is not named: the line says whom the person answers to', () => {
    expect(allegianceLineOf(agent, townWithHandler('Black market', ['Grain Holders']))).toBe('Hidden allegiance answers to Whisper market');
  });
  test('GUARD: a handler of the house itself, or with a standing in it, is still named', () => {
    expect(allegianceLineOf(agent, townWithHandler('Whisper market'))).toBe('Hidden allegiance answers to Whisper market, through Achilles Melissenos');
    expect(allegianceLineOf(agent, townWithHandler('Black market', ['Whisper market']))).toBe('Hidden allegiance answers to Whisper market, through Achilles Melissenos');
  });
  test('a conflict card\'s pill and its parties print apart in the copied text', () => {
    const { container } = render(<ConflictCard conflict={{ intensity: 'moderate', parties: ['Military Council', 'Merchant Guilds'], issue: 'A ruling one power refuses to obey' }} />);
    expect((container.textContent || '').replace(/\s+/g, ' ')).toContain('Moderate tension Military Council vs Merchant Guilds');
  });
});

describe('ROUND THREE · the reader\'s town (rr2s-city-under_siege+famine-rand-1, born in the reader\'s shape)', () => {
  /** @type {any} */
  let town;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    const seed = 'rr2s-city-under_siege+famine-rand-1';
    town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city', selectedStressesRandom: false, selectedStresses: ['under_siege', 'famine'], _randomizePriorities: true }), null, { seed, customContent: {} });
  }, 300000);
  test('every allegiance line that names a handler names one of that house; the two the reader read name none', () => {
    const agents = town.npcs.filter((n) => n.allegiance && (n.allegiance.house || n.allegiance.power));
    expect(agents.length).toBeGreaterThan(3);
    const lines = agents.map((n) => ({ n, line: allegianceLineOf(n, town) }));
    for (const { n, line } of lines) {
      const house = n.allegiance.power || n.allegiance.house;
      expect(line, n.name).toMatch(new RegExp(`^Hidden allegiance answers to ${house.replace(/[()]/g, '\\$&')}`));
      const handler = town.npcs.find((x) => x.id === n.allegiance.handler);
      const ofHouse = !!handler && (handler.institution?.key === house || (handler.memberships || []).some((m) => m.power === house));
      expect(line.includes(', through '), `${n.name}: ${line}`).toBe(ofHouse);
    }
    const pavlos = lines.find(({ n }) => n.name === 'Pavlos Kyriadotes');
    expect(pavlos?.line).toBe('Hidden allegiance answers to Whisper market');
  }, 300000);
});
