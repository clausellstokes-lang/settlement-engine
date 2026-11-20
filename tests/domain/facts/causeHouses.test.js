/**
 * PAGE-7, CAUSES-DATA (the brief at 9e4ba24b6; the chair's rulings of 15:18): THE HOUSES A TROUBLE'S CAUSE NAMES
 * (`src/domain/facts/causeHouses.js`).
 *   - each group's copy of the catalogue is the catalogue's own houses, both ways: every name it holds is a catalogue
 *     name, and every catalogue name the measure's pattern (`measures/page-5/sim.mjs :: inst`) found is held;
 *   - THE LIVE ROSTER: a ruined, removed, destroyed or remnant house is no cause;
 *   - A CUSTOM HOUSE IS NEVER MATCHED BY ITS NAME: a DM's own "Black Market Tavern", stamped or not, is no black market.
 */
import { describe, expect, it } from 'vitest';
import { institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import { CAUSE_HOUSES, CAUSE_HOUSE_GROUPS, causeHouseStands } from '../../../src/domain/facts/causeHouses.js';

/** sim.mjs's patterns, the measure each group was read from (the ruled predicates of 14:21 and 14:33). */
const MEASURED = Object.freeze({
  thievesGuild: /thieves'? guild/i,
  smuggling: /smuggl/i,
  underground: /underground/i,
  assassins: /assassin|contract killer/i,
  blackMarket: /black market/i,
  whisperMarket: /whisper market/i,
  outlaws: /fence|outlaw|bandit/i,
  caravans: /caravan/i,
  fair: /annual fair/i,
  exchange: /international trade center|auction house|money changers/i,
  luxuryQuarter: /luxury goods quarter/i,
});

const CATALOGUE_NAMES = (() => {
  /** @type {Set<string>} */ const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) for (const shelf of Object.values(tier)) for (const n of Object.keys(shelf)) names.add(n);
  return [...names];
})();

/** @param {string} name @param {Record<string, unknown>} [extra] */
const house = (name, extra = {}) => ({ name, category: 'Criminal', ...extra });

describe('each group is the catalogue\'s own houses, both ways', () => {
  it('the groups are the measured ones', () => {
    expect([...CAUSE_HOUSE_GROUPS].sort()).toEqual(Object.keys(MEASURED).sort());
  });
  it('each group holds exactly the catalogue names its measured pattern finds', () => {
    const expected = Object.fromEntries(Object.keys(MEASURED).map((g) => [g, CATALOGUE_NAMES.filter((n) => MEASURED[g].test(n)).map((n) => n.toLowerCase()).sort()]));
    for (const g of Object.keys(MEASURED)) expect(expected[g].length, g).toBeGreaterThan(0);
    expect(Object.fromEntries(Object.keys(MEASURED).map((g) => [g, [...CAUSE_HOUSES[g]].sort()]))).toEqual(expected);
  });
});

describe('the reader', () => {
  it('each catalogue house of each group stands, in any case of its name', () => {
    const missed = Object.keys(MEASURED).flatMap((group) => CATALOGUE_NAMES.filter((x) => MEASURED[group].test(x))
      .filter((n) => !causeHouseStands({ institutions: [house(n)] }, group) || !causeHouseStands({ institutions: [house(n.toUpperCase())] }, group))
      .map((n) => `${group}: ${n}`));
    expect(missed).toEqual([]);
  });
  it('the live roster: a ruined, removed, destroyed or remnant house is no cause', () => {
    expect(causeHouseStands({ institutions: [house('Black market')] }, 'blackMarket')).toBe(true);
    for (const status of ['ruined', 'removed', 'destroyed', 'remnant']) {
      expect(causeHouseStands({ institutions: [house('Black market', { status })] }, 'blackMarket'), status).toBe(false);
    }
    expect(causeHouseStands({ institutions: [house('Black market', { _worldPulseInactive: true })] }, 'blackMarket')).toBe(false);
  });
  it('a custom house is never matched by its name: "Black Market Tavern" is no black market', () => {
    expect(causeHouseStands({ institutions: [house('Black Market Tavern', { isCustom: true })] }, 'blackMarket')).toBe(false);
    expect(causeHouseStands({ institutions: [house('Black Market Tavern')] }, 'blackMarket')).toBe(false);
    expect(causeHouseStands({ institutions: [house('Black market', { source: 'custom' })] }, 'blackMarket')).toBe(false);
    expect(causeHouseStands({ institutions: [house('Black market', { customDefinitionId: 'dm-1' })] }, 'blackMarket')).toBe(false);
  });
  it('an absent roster holds nothing; an unknown group throws', () => {
    expect(causeHouseStands(null, 'fair')).toBe(false);
    expect(causeHouseStands({}, 'fair')).toBe(false);
    expect(() => causeHouseStands({ institutions: [] }, 'docks')).toThrow(/unknown house group/);
  });
});
