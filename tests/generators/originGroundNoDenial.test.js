/**
 * tests/generators/originGroundNoDenial.test.js — R2-CODE-A-4, round three's #237 (`settlementOriginProse.js ::
 * ORIGIN_POOLS.ground`): rr2s-village-calm-port-1, "It stands on the shore; ask for the docks and you are told there
 * are none." beside a page whose header says "port" and whose Economics says "Trade port". RULED (the chair's,
 * vetoable): THE ROUTE IS THE HOME OF "THIS IS A PORT"; THE ROSTER IS THE HOME OF WHAT STANDS THERE. The ground arm
 * (a port route with no docks house) keeps its arm and loses its denial: no row denies a wharf or docks, none names
 * one as standing.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { ORIGIN_POOLS } from '../../src/generators/narrative/settlementOriginProse.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DENIAL = /no wharf|never had a wharf|ever built a wharf|there are none|no docks/i;
const STANDING = /\bwharf|\bdocks?\b|\bharbou?r|\bquay|\bshipyard/i;

describe('the ground arm under a port route', () => {
  it('no row denies the docks, and none names them as standing', () => {
    for (const row of ORIGIN_POOLS.ground) {
      expect(DENIAL.test(row), row).toBe(false);
      expect(STANDING.test(row), row).toBe(false);
    }
  });
});

describe("the reader's town, born as the app births it", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rr2s-village-calm-port-1: the origin states the shore and denies nothing', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'port', settType: 'village', selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true }), null, { seed: 'rr2s-village-calm-port-1', customContent: {} }));
    expect(s.config.tradeRouteAccess).toBe('port');
    expect(ORIGIN_POOLS.ground.map((r) => r.split('{ground}').join('on the shore'))).toContain(s.settlementReason[0]);
    expect(DENIAL.test(s.settlementReason.join(' ')), s.settlementReason[0]).toBe(false);
  });
});
