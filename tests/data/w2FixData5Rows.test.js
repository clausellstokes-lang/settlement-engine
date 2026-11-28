/**
 * W2-FIX-DATA-5 (2026-11-13): round three's remaining rows on the data lane's files (ROUND-3-CUT, lane/round-3-cut-2026-11-13
 * at 892904c1d, `ROUND-3-CUT.json`), each reproduced false at ac76a8e40 in the reader's own town, born in the app's shape
 * (REVIEW-R2-STAGES' renderer: DEFAULT_CONFIG, the stress panel with Random off, `_randomizePriorities`), one arm per cause.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when what prints in its
 * place is not the line true there.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A ROUND-3 town (REVIEW-R2-STAGES, `rr2s-<size>-<calm|crises>-<rand|route>-<i>`), as its renderer births it. */
const bornRr2s = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+?)-([a-z_+]+)-([a-z_]+)-(\d+)$/));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** A town of the newer readers' lists (REVIEW-W2-WRITE `rww-*`, REVIEW-POWERS-FU `rpf-*`), as their renderers birth it. */
const bornInc = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r(?:ww|pf)-(\w+?)-([a-z_+]+)-(\d+)$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** A REVIEW-W2A-3 town (`rw3-<size>-<calm|crises>-<i>`), the app's shape. */
const bornRw3 = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+?)-([a-z_+]+)-(\d+)$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const historyText = (/** @type {any} */ s) => JSON.stringify(s.history || {});
const arrivalText = (/** @type {any} */ s) => JSON.stringify(s.arrivalScene || '');
const servicesOf = (/** @type {any} */ s) => /** @type {any[]} */ (Object.values(s.availableServices || {}).flat());
const named = (/** @type {any} */ s, /** @type {string} */ name) => (s.institutions || []).find((/** @type {any} */ i) => i.name === name);

describe('W2-FIX-DATA-5: round three\'s rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  test('#17: a thorp whose people go to a neighbour\'s parish church: its burial ground does not say no clergy is near (rr2s-thorp-calm-rand-1)', () => {
    const town = bornRr2s('rr2s-thorp-calm-rand-1');
    expect(named(town, 'Access to parish church'), 'the thorp holds the access').toBeTruthy();
    const rites = servicesOf(town).filter((v) => v.institution === 'Access to parish church' && v.name === 'Last rites').map((v) => String(v.desc));
    expect(rites, 'the service says the parish priest comes').toEqual(['Funeral rites, said by the parish priest, who comes or is sent for.']);
    const burial = String(named(town, 'Burial ground')?.desc);
    expect(burial).toMatch(/\ba priest\b/i);
    // anchored: the same burial text is shown directly above to name a priest
    expect(burial).not.toMatch(/No clergy|nobody else to say them/);
  }, 60_000);
  test('#331: a village\'s great fire burns no districts, quarters or streets, and names no wharves it lacks (rr2s-village-monster_pressure-rand-1)', () => {
    const town = bornRr2s('rr2s-village-monster_pressure-rand-1');
    expect(town.tier).toBe('village');
    const fires = [...(town.history.historicalEvents || []), ...(town.history.currentTensions || [])].filter((/** @type {any} */ e) => (e.templateType || e.type) === 'great_fire').map((/** @type {any} */ e) => String(e.description));
    expect(fires.length, 'the village keeps its fire').toBeGreaterThan(0);
    expect(fires.filter((t) => /district|quarter|street|warehouse|wharf/i.test(t))).toEqual([]);
  }, 60_000);
  test('ww-25 (HIGH): a thorp\'s history raises no civic buildings or cathedral (rww-thorp-calm-1)', () => {
    const town = bornInc('rww-thorp-calm-1');
    expect(town.tier).toBe('thorp');
    expect(town.history.founding, 'the thorp keeps its founding (its one event was the Great Construction: silence, record 386, 4)').toBeTruthy();
    expect(historyText(town), 'the history text carries the founding kept above').toContain(town.history.founding.foundedBy);
    // anchored: the same history text is shown directly above to carry the thorp's founding
    expect(historyText(town)).not.toMatch(/civic buildings|cathedral|The Great Construction/i);
  }, 60_000);

  test('ww-544 (HIGH): no hook of an ailing or poisoned ruler while the seat stands empty (rww-hamlet-succession_void-1)', () => {
    // RULE8-RESEAT (PAGE-12, 2026-11-22): reseated from rww-hamlet-succession_void-1, whose history no longer prints the would-be
    // heir's hook. The current tension's pool (troubleHooks.js) draws by key since HOOKS-BUILD, by the mixed key since cure C
    // (there the line needs `ruler: lord`; the timeline template's plotHooks 0 needs nothing). rww-hamlet-succession_void-3 is
    // the first of rww-hamlet-succession_void-0..9 where all three expectations hold (3, 7, 8, 9).
    const town = bornInc('rww-hamlet-succession_void-3');
    expect((Array.isArray(town.stress) ? town.stress : [town.stress]).map((/** @type {any} */ x) => x?.type)).toContain('succession_void');
    expect(historyText(town)).toContain('A would-be heir approaches outsiders');
    // anchored: the same history text is shown directly above to print the would-be heir's hook
    expect(historyText(town)).not.toMatch(/ailing ruler wants|poisoning the ruler/);
  }, 60_000);

  test('ww-473 (HIGH): no open, cheerful politics in the arrival under a siege (rww-town-under_siege-1)', () => {
    const town = bornInc('rww-town-under_siege-1');
    expect(arrivalText(town).length).toBeGreaterThan(100);
    // anchored: the same arrival text's length (over 100) is asserted directly above, so the scene printed
    expect(arrivalText(town)).not.toMatch(/argue politics in the open|argue law in the open/);
  }, 60_000);

  test('ww-1157 (HIGH): no forge making for a war in a famine city with no war (rww-city-famine-1)', () => {
    const town = bornInc('rww-city-famine-1');
    // BAR2-CLOSE-SWEEP-B (2026-11-15): BAR2-PLACES batch 2 (166bb4160, C3297) gave "blades being made" `iron at hand`; this famine
    // city has none, so the same slot draws its declared twin, the anchor sibling now.
    // RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K1, R8): the supply rule (BIRTH-3, BR4/BR5) has this city buy its ore in
    // ("Iron ore" on the import list), so its iron is at hand and the same slot draws the line the twin stood for, true here
    // now: the anchor sibling again. The claim (no war's forge in a famine city with no war) is this town's still. The cold
    // forge is borne by no town to key it to: none of the 720, the 150 or 180 famine towns of this family (rww-<town|city|
    // metropolis>-famine-0..59) prints it.
    expectAbsentWithAnchor(arrivalText(town), 'making something meant for a war', 'and most of it is the sound of blades being made', 'rww-city-famine-1 arrival');
  }, 60_000);

  test('ww-494 (HIGH): the fair\'s trading under a siege says no merchant can reach it (rww-town-under_siege-1)', () => {
    const town = bornInc('rww-town-under_siege-1');
    const rows = servicesOf(town).filter((v) => v.institution === 'Annual fair' && v.name === 'Seasonal trading').map((v) => String(v.desc));
    expect(rows).toEqual(['The yearly fair that draws merchants from across the region. None can reach it while the roads are held.']);
  }, 60_000);
  test('R2 #973, #238: under a siege the fair\'s merchants and the toll bridge\'s steady fees are not claimed (rw3-town-under_siege-1, rw3-metropolis-under_siege-1)', () => {
    const fair = named(bornRw3('rw3-town-under_siege-1'), 'Annual fair');
    expect(String(fair?.desc)).toMatch(/roads are held|siege holds the roads/);
    // anchored: the same fair text is shown directly above to say the roads are held
    expect(String(fair?.desc)).not.toMatch(/Merchants from across the region, and luxuries|Luxury goods available|fine goods on offer/);
    const bridge = named(bornRw3('rw3-metropolis-under_siege-1'), 'Toll bridge');
    expect(String(bridge?.desc)).toMatch(/roads were cut|roads held|closed the roads/);
    // anchored: the same bridge text is shown directly above to say the roads were cut
    expect(String(bridge?.desc)).not.toMatch(/never fails|but steady|steady revenue/);
  }, 60_000);
});
