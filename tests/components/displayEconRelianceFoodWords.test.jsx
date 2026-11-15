/** @vitest-environment jsdom */
/**
 * displayEconRelianceFoodWords.test.jsx — TAIL-DISPLAY-ECON-2 batch 2 (the READ-ALL worklist DISPLAY-ECON; the chair's
 * rulings X10, X11 and X12, 2026-11-15), births of the census's own seeds (r2r-/r2s-, the SECOND-WAVE-CENSUS dials):
 *   · X10 (15124): the one reliance reading (`magicReliance.js :: deriveMagicReliance`) counts the food supply a
 *     dependent where the food record's own provision feeds the town (`foodMagicShare`, the one reader, now defined
 *     beside the reading and re-exported by `magicProvisionShown.js`): no "Reliance on magic: None", no "Nothing
 *     structural ... depends on arcane work" beside a provision;
 *   · X12 (00600, 12888): the food sentence's shares are of the need, and say so ("of what it needs");
 *   · 12961: under a siege that stopped the trade, the short clause says hunger is here (the famine's twin);
 *   · 12560, 12562: a chain card's need names "gate control" only where a gate or a wall stands;
 *   · 05779, 05780: a card the crisis stopped (its record state working, its printed state impaired) claims no share of
 *     the income now (since TAIL-DISPLAY-ECON-4, X25.1: where the crisis leaf marks the share the card names).
 * Each NOT pair is red at the batch's base (6e36000a4); each KEEP pair is green before and after.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { foodMagicShare } from '../../src/domain/display/magicProvisionShown.js';
import { deriveMagicReliance, foodMagicShare as relianceFoodShare } from '../../src/domain/magicReliance.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own birth (CENSUS-3 seedcfg.mjs, its r2r-/r2s- arms). @param {string} seed */
const birth = (seed) => {
  const calm = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  const crisis = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (crisis)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (crisis)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, birth(seed)); return towns.get(seed); };
/** @param {any} t @param {'economics'|'magic'} tab @returns {string} */
const textOf = (t, tab) => {
  const { container, unmount } = render(tab === 'economics' ? <EconomicsTab settlement={t} narrativeNote={null} /> : <MagicTab settlement={t} />);
  const out = container.textContent || '';
  unmount();
  return out;
};

/** [seed, tab, the line that must NOT print, what prints instead (or the slot's silence by design), the liveness anchor:
 *  a line the same text prints on the same path (the twin or keep where the test claims one; else a sibling card's share)] */
const NOT = /** @type {const} */ ([
  ['r2s-occupied-thorp-1', 'magic', 'Reliance on magic: None', 'Reliance on magic: Relied upon (a third of the need by provision)', 'Reliance on magic: Relied upon'],
  ['r2s-occupied-thorp-1', 'magic', 'Nothing structural at Amarkota depends on arcane work.', 'the desk\'s relied-upon reading', 'Reliance on magic: Relied upon'],
  ['r2r-thorp-54', 'magic', 'Reliance on magic: None', 'Reliance on magic: Relied upon', 'Reliance on magic: Relied upon'],
  ['r2r-hamlet-16', 'economics', 'Oxteha grows about two parts in five of what it eats', 'Oxteha grows about two parts in five of what it needs', 'Oxteha grows about two parts in five of what it needs'],
  ['r2r-thorp-54', 'economics', 'Magical provision makes up about a quarter of what it eats.', 'Magical provision makes up about a quarter of what it needs.', 'Magical provision makes up about a quarter of what it needs.'],
  ['r2s-under_siege-hamlet-2', 'economics', 'Many households go short, and a bad season would bring real hunger.', 'Many households go short, and hunger is already here.', 'Many households go short, and hunger is already here.'],
  ['r2s-famine-town-2', 'economics', 'Law enforcement, patrol and gate control here depend on iron', 'Law enforcement and patrol here depend on iron (no gate, no wall)', 'Law enforcement and patrol here depend on iron'],
  ['r2s-under_siege-town-1', 'economics', 'Law enforcement, patrol and gate control here depend on iron from outside', 'Law enforcement and patrol here depend on iron from outside', 'Law enforcement and patrol here depend on iron from outside'],
  ['r2s-under_siege-town-0', 'economics', 'Contributes to Entrepôt Trade - 11% of income', 'silent: the siege stopped the card', 'Contributes to Iron & Metalwork'],
  ['r2s-famine-town-1', 'economics', 'Contributes to Grain Sales - 4% of income', 'silent: the famine failed the grain', 'Contributes to Entrepôt Trade - 13% of income'],
]);
/** [seed, tab, the twin true in the state that made the old line false] (new or newly reached lines: red at the base by design) */
const TWIN = /** @type {const} */ ([
  ['r2s-occupied-thorp-1', 'magic', 'Reliance on magic: Relied upon'],
  ['r2r-hamlet-16', 'economics', 'Oxteha grows about two parts in five of what it needs'],
  ['r2r-thorp-54', 'economics', 'Magical provision makes up about a quarter of what it needs.'],
  ['r2s-under_siege-hamlet-2', 'economics', 'Many households go short, and hunger is already here.'],
  ['r2s-famine-town-2', 'economics', 'Law enforcement and patrol here depend on iron'],
]);
/** [seed, tab, the true sibling that must still print] (green before and after) */
const KEEP = /** @type {const} */ ([
  ['r2r-thorp-0', 'magic', 'Reliance on magic: None'],
  ['r2r-village-25', 'magic', 'Reliance on magic: Relied upon'],
  ['r2s-famine-town-2', 'economics', 'Many households go short, and hunger is already here.'],
  ['r2r-town-6', 'economics', 'Law enforcement, patrol and gate control here depend on iron brought in'],
  ['r2s-famine-town-1', 'economics', 'Contributes to Entrepôt Trade - 14% of income'], // re-keyed by identity (TAIL-DISPLAY-ECON-5): the same card; the record's share moved 13 -> 14 by the economy family's DECLARED MOVES on the joined line (TAIL-DEFECON-2 5f67f382d, TAIL-DEFECON-3 2ac50c55d),
  // RE-KEYED BY IDENTITY (TAIL-DISPLAY-ECON-4, the chair's ruling X25.1): batch 2's silence gave way to the crisis leaf
  // (`crisisStoppedRow.js`), whose table holds the forge and the mine at work under a siege ("Iron & Metalwork": NONE);
  // the Income Sources row prints the same share unmarked. The same town, the same line: it prints again.
  ['r2s-under_siege-town-1', 'economics', 'Contributes to Iron & Metalwork - 8% of income'],
]);

afterEach(cleanup);

describe('TAIL-DISPLAY-ECON-2 batch 2: the reliance reading counts the food provision; the food sentence\'s shares are of the need', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('one reader: the tabs\' food share is the reliance reading\'s own', () => {
    expect(foodMagicShare).toBe(relianceFoodShare);
  });

  test('the anchors: the food record\'s provision where each pair says, and the reading it gives', () => {
    expect(foodMagicShare(town('r2s-occupied-thorp-1'))).toBeGreaterThan(0.2);
    expect(deriveMagicReliance(town('r2s-occupied-thorp-1')).reading).toBe('relied-upon');
    expect(foodMagicShare(town('r2r-thorp-0')), 'no provision: "None" stands').toBe(0);
  }, 120000);

  test.each(NOT)('%s (%s) does not print "%s"; instead: %s', (seed, tab, line, _instead, anchor) => {
    expectAbsentWithAnchor(textOf(town(seed), tab), line, anchor, `${seed} (${tab})`);
  }, 120000);

  test.each(TWIN)('%s (%s) prints the twin "%s"', (seed, tab, line) => {
    expect(textOf(town(seed), tab)).toContain(line);
  }, 120000);

  test.each(KEEP)('%s (%s) still prints "%s"', (seed, tab, line) => {
    expect(textOf(town(seed), tab)).toContain(line);
  }, 120000);
});
