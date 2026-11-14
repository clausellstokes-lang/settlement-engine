/**
 * R3-TABS, the second seat (the chair's ruling of 2026-11-14, "the port's two homes"): the route is the home of
 * "this is a port" and of which water it stands on. The defence desk's naval rung (DS-DEF-6,
 * `defenseStateProse.js :: defenseSupportingProse` → `navalDefensePoolKey`) was keyed by the roster's docks
 * (`compound.hasPort`), so river towns read "… has a harbour and nothing to hold it with; any vessel that wants the
 * sea approaches has them" (24 of the 720), "The port is …'s living and its open door" (17) and "You can sail into …
 * unchallenged; nobody watches the harbour mouth" (16). Every naval pool speaks of the sea; none is true of a river
 * landing. The line is now offered only where the route is the sea; elsewhere the desk is silent.
 *
 * RED-FIRST at 2dc3fe61b: the three guard towns (a river route on forest, a river route on coastal terrain, a
 * crossroads on a riverside) drew a naval line. The sea port draws its line before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { defenseSupportingProse } from '../../src/domain/display/stateProse/defenseStateProse.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}
const GUARDS = [
  { seed: 'r2r-town-17', route: 'river', terrain: 'forest' },
  { seed: 'r2r-town-3', route: 'river', terrain: 'coastal' },
  { seed: 'r2s-mass_migration-metropolis-2', route: 'crossroads', terrain: 'riverside' },
];
const SEA = { seed: 'r2r-town-4', route: 'port', terrain: 'coastal' };

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const g of [...GUARDS, SEA]) towns[g.seed] = censusBirth(g.seed);
}, 240000);

describe('a naval line is offered only where the route is the sea', () => {
  for (const g of GUARDS) {
    test(`${g.seed} (${g.route} on ${g.terrain}): docks on the roster, no sea route, no naval line`, () => {
      const s = towns[g.seed];
      expect([s.config.tradeRouteAccess, s.config.terrainType, s.economicState.compound.inst.hasPort]).toEqual([g.route, g.terrain, true]);
      const drawn = defenseSupportingProse(s, { seed: g.seed, audience: 'dm', tierNoun: s.tier });
      expect(Object.keys(drawn)).toEqual(['logistics', 'naval']);
      expect(drawn.naval).toBeNull();
    });
  }
  test(`${SEA.seed} (the sea port): its naval line still prints`, () => {
    const s = towns[SEA.seed];
    expect([s.config.tradeRouteAccess, s.config.terrainType, s.economicState.compound.inst.hasPort]).toEqual([SEA.route, SEA.terrain, true]);
    const drawn = defenseSupportingProse(s, { seed: SEA.seed, audience: 'dm', tierNoun: s.tier });
    expect(drawn.naval?.sentence).toMatch(/harbour|sea|vessel|ship|port/i);
    expect(drawn.naval.provenance.blockId).toBe('DS-DEF-6');
  });
  test('a record with no config reads as before (A-11): the docks alone still give the port line', () => {
    const s = { name: 'Saltmere', economicState: { compound: { inst: { hasPort: true } } } };
    expect(defenseSupportingProse(s, { seed: 'harbour-noconfig' }).naval).not.toBeNull();
  });
});
