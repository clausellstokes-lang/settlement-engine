/**
 * tests/helpers/townCartographyFixture.js — the TC-2 corpus builder.
 *
 * Every cartography pin runs against the REAL producers: `buildSceneTerrain` and
 * `buildSceneRoads` from the townScene compiler build the raster and the boundary
 * conditions exactly as the compile pipeline does. A hand-written terrain literal
 * would be a second settlement truth living in the test suite, and the first time
 * the terrain profile table changed, the pins would keep passing against a raster
 * the product no longer produces.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer -- see tests/helpers/dormancyOracle.js for the incident).
 */
import {
  buildSceneRoads,
  buildSceneTerrain,
} from '../../src/domain/townScene/sceneTerrainNetwork.js';
import { sceneDigest } from '../../src/domain/townScene/stableScene.js';

/** The site kinds the terrain profile table actually distinguishes. */
export const FIXTURE_SITES = Object.freeze([
  'plain', 'river', 'coast', 'mountain', 'marsh', 'woodland', 'desert',
]);

/** The governance postures the A-10 chain is asserted against. */
export const GOVERNANCE_ORDERED = Object.freeze({
  legitimacy: 0.92,
  factions: [{ power: 70 }, { power: 15 }, { power: 15 }],
  drift: 0.08,
  conditions: [],
});

export const GOVERNANCE_CHAOTIC = Object.freeze({
  legitimacy: 0.12,
  factions: [{ power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }],
  drift: 0.93,
  conditions: [
    { id: 'cond:graft', archetype: 'corruption_ring', severity: 0.9 },
    { id: 'cond:unrest', archetype: 'civil_unrest', severity: 0.85 },
  ],
});

/**
 * A townMapModel-shaped input for the two real scene builders.
 * @param {{ site?: string, withWater?: boolean, withRoads?: boolean }} [options]
 */
function fixtureModel(options = {}) {
  const site = options.site || 'river';
  const withWater = options.withWater !== false;
  const withRoads = options.withRoads !== false;
  return {
    meta: { siteKind: site },
    frame: {
      water: withWater
        ? {
          kind: site === 'coast' ? 'coast' : 'river',
          path: [[0, 640], [300, 596], [620, 664], [1000, 612]],
        }
        : {},
      roads: withRoads
        ? [
          { id: 'route:north', from: [500, 0], to: [500, 470], weight: 3 },
          { id: 'route:east', from: [1000, 500], to: [540, 505], weight: 2 },
          { id: 'route:southwest', from: [0, 940], to: [430, 560], weight: 1 },
        ]
        : [],
    },
    skeleton: { streets: [] },
  };
}

/**
 * One corpus row: the compiled raster, the compiled boundary conditions, the
 * projected settlement, and the digest that roots the seeded fork family.
 *
 * @param {object} [options]
 * @param {string} [options.tier]
 * @param {string} [options.seedKey] the settlement identity the digest is taken of
 * @param {string} [options.site]
 * @param {boolean} [options.withWater]
 * @param {boolean} [options.withRoads]
 * @param {Record<string, unknown>} [options.governance] one of the postures above
 * @param {number|null} [options.age]
 * @param {Record<string, number>|null} [options.stocks]
 */
export function cartographyFixture(options = {}) {
  const tier = options.tier || 'city';
  const seedKey = options.seedKey || 'ashford-1';
  const governance = options.governance || GOVERNANCE_ORDERED;
  const model = fixtureModel(options);
  const digest = sceneDigest({ seedKey, tier, site: options.site || 'river' });
  const terrain = buildSceneTerrain(model, digest);
  const roads = buildSceneRoads(model, 50, () => []);
  const stocks = options.stocks === undefined
    ? { market: 0.62, craft: 0.48, civic: 0.55 }
    : options.stocks;
  const settlement = {
    name: seedKey,
    tier,
    population: 9000,
    powerStructure: {
      legitimacy: governance.legitimacy,
      factions: governance.factions,
    },
    economicState: { prosperity: 'Prosperous' },
    activeConditions: governance.conditions,
    urbanFabric: stocks === null
      ? { drift: governance.drift }
      : { drift: governance.drift, stocks },
    age: options.age === undefined ? 1400 : options.age,
  };
  return { terrain, roads, settlement, digest, model };
}

/**
 * THE SEED FAMILY. Sixteen distinct settlement identities crossed over the site
 * kinds, so a determinism pin measures a FAMILY rather than one lucky seed. A
 * single-seed restriction pin is vacuous by construction (wave-E hazard class).
 * @returns {Array<{ seedKey: string, tier: string, site: string }>}
 */
export function cartographySeedFamily() {
  const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  /** @type {Array<{ seedKey: string, tier: string, site: string }>} */
  const rows = [];
  for (let i = 0; i < 16; i += 1) {
    rows.push({
      seedKey: `seed-${i}`,
      tier: tiers[i % tiers.length],
      site: FIXTURE_SITES[i % FIXTURE_SITES.length],
    });
  }
  return rows;
}
