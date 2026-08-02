/** CW-0 seed: WR-3's POP→WAR row is pure, closed, and same-evidence. */
import { describe, expect, test } from 'vitest';

import {
  COUPLING_REGISTRY,
  COUPLING_REGISTRY_SCHEMA_VERSION,
  WR3_LINEAGE_COUPLING,
  couplingRowFor,
} from '../../src/domain/certification/couplingRegistry.js';

describe('CW-0 coupling registry seed', () => {
  test('WR-3 owns the one seeded CPL-3 POP→WAR row', () => {
    expect(COUPLING_REGISTRY_SCHEMA_VERSION).toBe(1);
    expect(COUPLING_REGISTRY).toEqual([WR3_LINEAGE_COUPLING]);
    expect(WR3_LINEAGE_COUPLING).toEqual({
      pairId: 'CPL-3',
      direction: 'POP→WAR',
      read: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.lineageClaimOf',
      receiptField: 'lineageClaimOf(...).suppression.receipt',
      counterforce: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.kinshipBondOf',
      flags: [
        'demographicsEnabled',
        'lineageClaimEnabled',
        'peaceEngineEnabled',
        'warLayerEnabled',
      ],
      owningVolume: 'WAR',
      owningWave: 'WR-3',
      intendedDesk: 'war',
    });
  });

  test('the claim and counterforce resolve through one evidence factory', () => {
    const targetOf = (address) => address.split('#')[0];
    const factoryOf = (address) => address.split('#')[1].split('.')[0];
    expect(targetOf(WR3_LINEAGE_COUPLING.read)).toBe(targetOf(WR3_LINEAGE_COUPLING.counterforce));
    expect(factoryOf(WR3_LINEAGE_COUPLING.read)).toBe('makeLineageClaimRead');
    expect(factoryOf(WR3_LINEAGE_COUPLING.counterforce)).toBe('makeLineageClaimRead');
    expect(WR3_LINEAGE_COUPLING.receiptField).toContain('suppression.receipt');
  });

  test('lookup is deterministic, fail-closed, and the registry cannot be mutated', () => {
    expect(Object.isFrozen(COUPLING_REGISTRY)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING.flags)).toBe(true);
    expect(couplingRowFor('CPL-3', 'POP→WAR')).toBe(WR3_LINEAGE_COUPLING);
    expect(couplingRowFor('CPL-3', 'WAR→POP')).toBeNull();
    expect(couplingRowFor('CPL-99', 'POP→WAR')).toBeNull();
    expect(couplingRowFor(null, null)).toBeNull();
  });
});
