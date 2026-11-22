/**
 * interiorFixtures.js — deterministic synthetic corpus for the KEYED SCALE (interiors)
 * golden + unit suites (DOOR 3). Everything is a pure function of its parameters (no
 * Math.random), so each fixture is the determinism the interior golden demands.
 *
 * The institution roster spans the eight interior KINDs by NAME (so facetOf infers the
 * nature — the byte-identical inference path) plus one DECLARED-facet custom (the
 * counterpart criterion) and the two corruption exposures (revealed + covert).
 */

// Tier → a representative population inside its band (mirrors townMapFixtures).
const TIER_POP = Object.freeze({
  thorp: 40, hamlet: 220, village: 650, town: 2400, city: 12000, metropolis: 48000,
});

/** The canonical eight-kind roster — names chosen so cohesionWeave.facetOf INFERS the
 *  intended nature (no declared facet), exercising the byte-identical inference path. */
const ROSTER = Object.freeze([
  { name: 'Temple of the Dawn', catalogId: 'temple_dawn' },       // → faith
  { name: 'The Garrison Barracks', catalogId: 'garrison' },       // → security
  { name: 'Merchant Guild Exchange', catalogId: 'merchant_guild' }, // → trade
  { name: 'The Ironmonger Forge', catalogId: 'forge' },           // → craft
  { name: 'The Grand Library', catalogId: 'library' },            // → learning
  { name: 'The Sailor Tavern', catalogId: 'tavern' },             // → vice
  { name: 'Town Hall', catalogId: 'town_hall' },                  // → civic
  { name: "Old Pete's Place", catalogId: 'old_pete' },            // → generic (infers nothing)
]);

/** Quarters spanning several district categories (so the town model places buildings in
 *  distinct districts → distinct footprint orientations). */
const QUARTERS = Object.freeze([
  { name: 'Temple Ward', location: 'central', desc: 'shrines and cloisters', landmarks: ['Cathedral'] },
  { name: 'Market Row', location: 'center', desc: 'bazaar and exchange', landmarks: ['Bazaar'] },
  { name: 'Garrison Quarter', location: 'north gate', desc: 'barracks and watch', landmarks: ['Barracks'] },
  { name: 'Forge District', location: 'east', desc: 'smiths and workshops', landmarks: ['Guild Forge'] },
  { name: 'Council Green', location: 'center', desc: 'court and chancery', landmarks: ['Town Hall'] },
]);

/**
 * A complete, deterministic settlement carrying the canonical roster.
 * @param {string} seed @param {string} tier @param {'prosperous'|'modest'|'poor'} [prosperity]
 * @returns {any}
 */
export function makeInteriorSettlement(seed, tier = 'town', prosperity = 'modest') {
  return {
    _seed: seed,
    id: `interior-fixture-${seed}`,
    name: `Fixture ${seed}`,
    tier,
    population: TIER_POP[tier] ?? 2400,
    config: { terrainType: 'plains', tradeRouteAccess: 'road' },
    economicState: { prosperity, exports: ['ale', 'iron'] },
    spatialLayout: { quarters: QUARTERS.map((q) => ({ ...q })) },
    defenseProfile: { walls: true, wallType: 'stone' },
    institutions: ROSTER.map((r) => ({ ...r })),
  };
}

/** The institution object for a KIND in the canonical roster (by array index). */
export const ROSTER_BY_KIND = Object.freeze({
  faith: ROSTER[0], security: ROSTER[1], trade: ROSTER[2], craft: ROSTER[3],
  learning: ROSTER[4], vice: ROSTER[5], civic: ROSTER[6], generic: ROSTER[7],
});

export { ROSTER, TIER_POP };
