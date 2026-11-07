/**
 * tests/domain/facts/declaredMoves.test.js — CENSUS-1b unit A: THE DECLARED-MOVE UNIT.
 *
 * CENSUS-1 measured four correct re-points and withdrew them under the old byte-identity law
 * (`docs/CENSUS_1_LANE_2026-11-04.md`, "What was NOT re-pointed", items 1, 2, 3 and 9). The
 * chair's ruling on CENSUS-1's questions 1 and 2: they are made now, each red-first, each counted
 * by cause — "the home's truth over the retired reader". The births each one moves are counted
 * in `docs/CENSUS_1B_LANE_2026-11-04.md`, never re-recorded.
 *
 * @enforced-by npx vitest run tests/domain/facts/declaredMoves.test.js
 */
import { describe, expect, it } from 'vitest';
import { generateSafetyProfile } from '../../../src/generators/safetyProfile.js';
import { generalStateProse, marketPoolKey } from '../../../src/domain/display/stateProse/generalStateProse.js';
import { generateEconomicViability } from '../../../src/generators/economy/viability.js';
import { holdsMarket } from '../../../src/generators/narrative/arrivalScene.js';
import { marketOf } from '../../../src/domain/facts/market.js';

const CALM = { monsterThreat: 'civilized' };

describe('unit A (a): the safety profile reads the militia atom from the home', () => {
  it('RED-FIRST: a ruined militia patrols nothing; a household levy is a militia', () => {
    const levy = generateSafetyProfile(CALM, 'village', [{ name: 'Household levy', category: 'Defense' }]);
    expect(levy.safetyDesc).toMatch(/militia/i);
    const live = generateSafetyProfile(CALM, 'village', [{ name: 'Citizen militia', category: 'Defense' }]);
    expect(live.safetyDesc).toMatch(/militia/i);
    const ruined = generateSafetyProfile(CALM, 'village', [{ name: 'Citizen militia', category: 'Defense', status: 'ruined' }]);
    // anchored: the same desc prints the militia for a live row and a levy above; only the ruin differs
    expect(ruined.safetyDesc).not.toMatch(/militia/i);
  });
});

describe("unit A (b): DS-GEN-17's PROVISIONED reads the hospital atom from the home", () => {
  const keyFor = (institutions, inst) => generalStateProse(
    { name: 'Ashford', tier: 'village', institutions }, { inst, institutions, tier: 'village' },
  ).overview.institutions?.provenance?.poolKey;

  it('RED-FIRST: a monastery is not a hospital; a ruined hospital provisions nothing', () => {
    // The birth flag bag (`economicState.compound.inst`) folds hospital | monastery | healer | friary.
    expect(keyFor([{ name: 'Monastery or friary', category: 'Religious' }], { hasHospital: true })).toBe('BARE');
    expect(keyFor([{ name: 'Hospital', category: 'Religious', status: 'ruined' }], { hasHospital: true })).toBe('BARE');
    expect(keyFor([{ name: 'Hospital', category: 'Religious' }], { hasHospital: true })).toBe('PROVISIONED');
    // the granary arm is untouched
    expect(keyFor([{ name: 'Village granary', category: 'Economy' }], { hasGranary: true })).toBe('PROVISIONED');
  });
});

describe('unit A (c): the viability water-dependency check reads waterAccessKind through the home', () => {
  const waterWarnings = (terrainType, tradeRouteAccess) => generateEconomicViability(
    { tier: 'town', population: 3000, institutions: [{ name: 'Tannery', category: 'Crafts' }], economicState: {}, config: { terrainType, tradeRouteAccess } },
    terrainType, [],
  ).dependencies.filter((w) => w.category === 'Water Dependency');

  it('RED-FIRST: a port on hills is not dry', () => {
    expect(waterWarnings('hills', 'port')).toEqual([]);
    expect(waterWarnings('plains', 'river')).toEqual([]);
    expect(waterWarnings('coastal', 'road')).toEqual([]);
    expect(waterWarnings('hills', 'road')).toHaveLength(1);
  });
});

describe("unit A (d): the arrival scene's market and DS-GEN-13's key are homed together on the market fact", () => {
  const key = (institutions) => marketPoolKey({ institutions, tradeRouteAccess: 'road' });

  it('RED-FIRST: a black market is no market; an annual fair is one (both readers, one answer)', () => {
    expect(key([{ name: 'Black market', category: 'Criminal' }])).toBe('NO-MARKET');
    expect(holdsMarket([{ name: 'Black market', category: 'Criminal' }])).toBe(false);
    expect(key([{ name: 'Annual fair', category: 'Economy' }])).not.toBe('NO-MARKET');
    expect(holdsMarket([{ name: 'Annual fair', category: 'Economy' }])).toBe(true);
    for (const institutions of [[{ name: 'Weekly market' }], [{ name: 'Weekly market', status: 'ruined' }], [{ name: 'Shambles' }], []]) {
      expect(holdsMarket(institutions)).toBe(marketOf({ institutions }));
      expect(key(institutions) !== 'NO-MARKET').toBe(marketOf({ institutions }));
    }
  });
});
