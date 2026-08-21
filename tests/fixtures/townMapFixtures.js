/**
 * tests/fixtures/townMapFixtures.js — the V3 fabric corpus.
 *
 * Fixtures are BUILT, not captured: a captured settlement blob would drift the moment the
 * generator moved, and these suites must pin the FABRIC's behaviour rather than a
 * generator snapshot. Each factory names the law it exists to exercise.
 */

/** A plain, unforced town: the fabric's ordinary case. */
export function makeTownFixture(overrides = {}) {
  return {
    _seed: 'fixture-town-01',
    name: 'Fixture',
    tier: 'town',
    population: 3500,
    config: { terrainType: 'riverside', tradeRouteAccess: 'moderate' },
    economicState: { prosperity: 'Moderate', tradeCommodity: 'grain' },
    powerStructure: {
      governingName: 'Council', stability: 'Stable',
      publicLegitimacy: { score: 62 },
      factions: [{ name: 'Council', power: 55, category: 'government' }, { name: 'Guilds', power: 45, category: 'economy' }],
    },
    history: { founding: { kind: 'charter', age: 180 } },
    // ⭐ A MULTI-QUARTER fixture, and the reason is the locality pin. The district set is
    // derived from `spatialLayout.quarters`; without it a fixture collapses to the single
    // 'hamlet-cluster' district, and "every OTHER organism is unchanged" becomes vacuously
    // false (there are no others) rather than true. A locality property needs somewhere
    // for the locality to be.
    spatialLayout: {
      quarters: [
        { name: 'Market Quarter', location: 'Central', desc: 'Bustling center with merchant stalls and crowds', landmarks: ['Market square'] },
        { name: 'Religious Quarter', location: 'Eastern district', desc: 'Churches, quiet streets with priests', landmarks: ['Parish church'] },
        { name: 'Craft Quarter', location: 'Western district', desc: 'Workshops, forges and yards', landmarks: ['Blacksmith'] },
        { name: 'Tanners Row', location: 'Downwind edge', desc: 'Tanning pits and dye vats by the water', landmarks: ['Tannery'] },
      ],
    },
    institutions: [
      { name: 'Town hall', catalogId: 'town-hall', priorityCategory: 'government' },
      { name: 'Parish church', catalogId: 'parish-church', priorityCategory: 'religion' },
      { name: 'Market square', catalogId: 'market', priorityCategory: 'economy' },
      { name: 'Tannery', catalogId: 'tannery', priorityCategory: 'government' },  // MIS-KEYED at head
      { name: 'Blacksmith', catalogId: 'blacksmith', priorityCategory: 'crafts' },
      { name: 'Town granary', catalogId: 'granary', priorityCategory: 'economy' },
      { name: 'Inn', catalogId: 'inn', priorityCategory: 'economy' },
      { name: 'Warehouse', catalogId: 'warehouse', priorityCategory: 'economy' },
      { name: 'Barracks', catalogId: 'barracks', priorityCategory: 'military' },
      { name: 'Courthouse', catalogId: 'courthouse', priorityCategory: 'government' },
      { name: 'Wayside shrine', catalogId: 'shrine', priorityCategory: 'religion' },
      // ⚠ The roster is deliberately sized so that adding ONE institution does NOT cross a
      // MEMBER BAND boundary. The bands exist precisely so small roster drift cannot resize
      // a quarter (the inertia law); testing locality across a band EDGE would be testing
      // the band's threshold, not the locality property, and would red for the right reason
      // in the wrong test.
    ],
    ...overrides,
  };
}

/** §5.-1c: a FORCED fact combination — mountain + ocean + port. Must reconcile to a fjord. */
export function makeForcedFjordFixture() {
  return makeTownFixture({
    _seed: 'fixture-fjord-01',
    config: { terrainType: 'mountain', tradeRouteAccess: 'port' },
    economicState: { prosperity: 'Comfortable', tradeCommodity: 'fish' },
  });
}

/** §161m / §15.7: a WALLED settlement. The plain town fixture carries no defenseProfile, so
 * `model.meta.hasWalls` is false and the wall member returns an empty circuit list — which
 * makes every wall pin vacuous rather than red. A wall pin needs a wall. */
export function makeWalledFixture(overrides = {}) {
  return makeTownFixture({
    _seed: 'fixture-walled-01',
    tier: 'city',
    population: 20000,
    defenseProfile: { walls: 'stone', defensiveTerrain: 'fortified' },
    ...overrides,
  });
}

/** §161f/§161g: a stored tier ABOVE the population's own tier — a recorded demotion. */
export function makeDemotedFixture() {
  return makeTownFixture({ _seed: 'fixture-demoted-01', tier: 'city', population: 3500 });
}

/** §161m: maximum chaos — every civic-order signal stripped, so the lawfulness dial is 0. */
export function makeChaoticFixture() {
  return makeTownFixture({
    _seed: 'fixture-chaos-01',
    powerStructure: { stability: 'Volatile', publicLegitimacy: { score: 0 }, factions: [] },
  });
}
