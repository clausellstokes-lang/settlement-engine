/**
 * tests/generators/arrivalSceneRoster.test.js — R2-CODE-A-4, CENSUS-2's writers in this lane's files
 * (`narrativeData.js :: ARRIVAL_SCENES`, drawn by `arrivalScene.js :: drawAdmitted`): kind a, a house or a role the town
 * lacks — "A merchant argues with a carter on the road into X … This is clearly a daily occurrence." in 6 towns with no
 * market (ordinary[4]); "…the knock of boats against a jetty…" in 3 river towns whose roster holds no landing
 * (river[2], declared on the mill alone). Record 386 (3): each reads the roster, the market atom and the docks atom.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { ARRIVAL_SCENES } from '../../src/data/narrativeData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

describe('the arrival scenes read the roster', () => {
  it('the merchant needs a market; the jetty needs a landing', () => {
    expect(/** @type {any} */ (ARRIVAL_SCENES.ordinary[4]).needs).toEqual(['market']);
    expect(/** @type {any} */ (ARRIVAL_SCENES.river[2]).needs).toEqual(['institution: mill', 'institution: docks']);
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('the line the roster refuses does not print (every row)', () => {
    for (const [seed, settType, refused] of [['r2r-hamlet-22', 'hamlet', /A merchant argues with a carter/], ['r2r-town-20', 'town', /against a jetty/]]) {
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType }), null, { seed, customContent: {} }));
      expect(typeof s.arrivalScene, `${seed}: an arrival scene`).toBe('string');
      expect(refused.test(s.arrivalScene), `${seed}: ${s.arrivalScene}`).toBe(false);
    }
  });
});
