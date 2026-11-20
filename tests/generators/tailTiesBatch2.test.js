/**
 * tests/generators/tailTiesBatch2.test.js — TAIL-TIES batch 2 (the chair's ruling (T3) of 2026-11-14, vetoable by the owner),
 * collected on births: a loyalty hook (`npcData.js :: NPC_FACTION_LOYALTY`) whose traveller arrives or passes needs open
 * roads (no siege, no quarantine); goods that arrive need an open route (no siege, not isolated); drinks need a tavern;
 * "their street" a village or larger; the guard captain a watch; the armoury a garrison; the district the middling band;
 * the dead dispute-settler an open seat; "at sea" a coast (the cargo line's twin, `NPC_HOOK_SIBLINGS`). A refused row
 * resolves within its own pool (the draw's own resolution); every card keeps its hook.
 * Two lines are reworded (for the owner's veto): the criminal "one of their fronts" and the theatre manager's nightly house.
 * NOT pairs: each printed at f663a2699 (the 720 census, by record) and is false there by the fact named.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTiesBatch2.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed); // the census's r2s arm (seedcfg.mjs), verbatim
  if (r2s) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};

/** @type {Map<string, any>} */ const births = new Map();
const of = (/** @type {string} */ seed) => { if (!births.has(seed)) births.set(seed, born(seed)); return births.get(seed); };
/** every person's stored hook text in the town @param {string} seed @returns {string[]} */
const hooks = (seed) => (of(seed).npcs || []).flatMap((/** @type {any} */ n) => n.plotHooks || []);

const L = {
  traveller: 'A traveller passed through asking which nights', cousin: 'A cousin has arrived to stay without warning',
  drinks: 'started paying for drinks with new silver', customer: 'has started avoiding their street', petition: 'gathered names from half their street',
  suppliers: 'One of their most reliable suppliers has gone dark', provenance: 'A supplier is providing goods of uncertain provenance',
  shipment: "A shipment they weren't expecting arrived", fronts: 'Someone tried to rob one of their fronts', captain: 'The guard captain has a file',
  district: 'Three guards have gone missing in the same district', armoury: 'Weapons from the armoury have been disappearing',
  sea: 'A valuable cargo was reported lost at sea', road: 'A valuable cargo was reported lost on its way here' /* TAIL-TIES-4 (T18), re-keyed by identity: the twin reworded */, quarrel: 'The person who settled every quarrel here has died',
  theatre: 'and the house is full every night',
};
/** [seed, line, the fact that makes it false there] */
const NOT = [
  ['r2r-city-19', 'traveller', 'plague or siege'], ['r2r-metropolis-14', 'traveller', 'siege'], ['r2r-town-37', 'traveller', 'plague or siege'],
  ['r2r-city-19', 'cousin', 'plague or siege'], ['r2s-plague_onset-city-0', 'cousin', 'quarantine'],
  ['r2r-hamlet-20', 'drinks', 'no tavern'], ['r2r-hamlet-21', 'drinks', 'no tavern'], ['r2r-thorp-41', 'drinks', 'no tavern'],
  ['r2r-thorp-58', 'customer', 'a thorp'], ['r2s-religious_conversion-hamlet-2', 'customer', 'a hamlet'],
  ['r2r-thorp-29', 'petition', 'a thorp'], ['r2r-thorp-34', 'petition', 'a thorp'], ['r2s-occupied-hamlet-0', 'petition', 'a hamlet'],
  ['r2r-city-20', 'suppliers', 'isolated'], ['r2r-city-48', 'suppliers', 'isolated'], ['r2s-under_siege-city-1', 'suppliers', 'siege'],
  ['r2r-metropolis-44', 'provenance', 'isolated'], ['r2r-metropolis-56', 'provenance', 'isolated'],
  ['r2r-city-48', 'shipment', 'isolated'], ['r2r-metropolis-44', 'shipment', 'isolated'], ['r2s-under_siege-city-1', 'shipment', 'siege'],
  ['r2r-city-32', 'fronts', 'no front on the roster'], ['r2r-city-4', 'fronts', 'no front on the roster'],
  ['r2r-thorp-16', 'captain', 'no watch (a household levy)'],
  // r2s-occupied-town-2 (a town of 310) is NAMED, not cured: the population is not settled at the hook draw (the band reads the tier)
  ['r2s-politically_fractured-village-0', 'district', 'the small band'],
  ['r2r-town-23', 'armoury', 'no garrison'], ['r2r-town-37', 'armoury', 'no garrison'], ['r2r-town-48', 'armoury', 'no garrison'],
  ['r2r-city-22', 'sea', 'no coast'], ['r2r-city-35', 'sea', 'no coast'], ['r2r-city-55', 'sea', 'no coast'],
  ['r2r-hamlet-11', 'quarrel', 'the seat is held'], ['r2r-hamlet-27', 'quarrel', 'the seat is held'],
  ['r2s-occupied-metropolis-0', 'theatre', 'an occupation curfew'], ['r2s-occupied-metropolis-2', 'theatre', 'an occupation curfew'],
];
/** [seed, line] a true print at the base */
const KEEP = [
  ['r2r-city-1', 'traveller'], ['r2r-city-1', 'cousin'], ['r2r-city-1', 'drinks'], ['r2r-city-1', 'customer'], ['r2r-city-1', 'petition'],
  ['r2r-city-11', 'suppliers'], ['r2r-city-1', 'shipment'], ['r2r-city-1', 'captain'], ['r2r-city-1', 'district'], ['r2r-city-1', 'armoury'],
  ['r2r-city-16', 'sea'], ['r2s-succession_void-hamlet-0', 'quarrel'],
];

describe('TAIL-TIES batch 2: a hook presumes only what the town holds (T3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT: the line is gone where the town makes it false, and every titled person there still holds a hook (the civic stand-ins of a crisis hold none by design, at the base too)', () => {
    const failures = collectSeedFailures(NOT, ([seed, key, why]) => {
      expect(hooks(seed).filter((h) => h.includes(L[key])), `${seed}: ${key} (${why})`).toEqual([]);
      expect((of(seed).npcs || []).filter((/** @type {any} */ n) => n.title !== undefined && !(n.plotHooks || []).length).map((/** @type {any} */ n) => n.name), `${seed}: a mute card`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'the line is gone where the town makes it false, and every titled person holds a hook');
  });

  it('INSTEAD: a cargo lost inland is lost on its way here (the sea line\'s twin keeps the draw)', () => {
    const failures = collectSeedFailures(['r2r-city-22', 'r2r-city-35', 'r2r-city-55'], (seed) => { expect(hooks(seed).some((h) => h.includes(L.road)), seed).toBe(true); });
    expectNoSeedFailures(failures, 'a cargo lost inland is lost on its way here');
  });

  it('KEEP: where the town holds the fact, the line still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, key]) => { expect(hooks(seed).some((h) => h.includes(L[key])), `${seed}: ${key}`).toBe(true); });
    expectNoSeedFailures(failures, 'where the town holds the fact, the line still prints');
  });
});
