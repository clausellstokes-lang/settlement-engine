/** CW-0: independently-owned cross-layer reads remain pure and same-evidence. */
import { describe, expect, test } from 'vitest';

import {
  COUPLING_REGISTRY,
  COUPLING_REGISTRY_SCHEMA_VERSION,
  WR3_LINEAGE_COUPLING,
  WR4_BELIEF_TRAJECTORY_COUPLING,
  WR4_HANDS_HOME_FRONT_COUPLING,
  WR4_INSTITUTION_HOME_FRONT_COUPLING,
  WR4_TRADE_HOME_FRONT_COUPLING,
  WR4_WAR_COST_COUPLINGS,
  couplingRowFor,
  couplingRowsFor,
} from '../../src/domain/certification/couplingRegistry.js';

describe('CW-0 coupling registry', () => {
  test('schema v2 preserves the WR-3 row and appends WR-4 in coupling-map order', () => {
    expect(COUPLING_REGISTRY_SCHEMA_VERSION).toBe(2);
    expect(WR4_WAR_COST_COUPLINGS).toEqual([
      WR4_TRADE_HOME_FRONT_COUPLING,
      WR4_HANDS_HOME_FRONT_COUPLING,
      WR4_BELIEF_TRAJECTORY_COUPLING,
      WR4_INSTITUTION_HOME_FRONT_COUPLING,
    ]);
    expect(COUPLING_REGISTRY).toEqual([
      WR3_LINEAGE_COUPLING,
      ...WR4_WAR_COST_COUPLINGS,
    ]);
    expect(WR3_LINEAGE_COUPLING).toEqual({
      couplingId: 'CPL-3.POP_TO_WAR.WR-3.lineage',
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

  test('records all four WR-4 foreign reads with same-evidence counterforces', () => {
    expect(WR4_WAR_COST_COUPLINGS.map((row) => [row.pairId, row.direction, row.intendedDesk]))
      .toEqual([
        ['CPL-1', 'TRADE→WAR', 'trade'],
        ['CPL-3', 'POP→WAR', 'events'],
        ['CPL-4', 'INFO→WAR', 'war'],
        ['CPL-6', 'INTERIOR→WAR', 'events'],
      ]);
    expect(WR4_TRADE_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.{roads,markets}.{band,stateRead}');
    expect(WR4_HANDS_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.hands.{band,stateRead}');
    expect(WR4_BELIEF_TRAJECTORY_COUPLING.receiptField)
      .toContain('believedBalanceBand,truthBalanceBand,trajectory,trajectoryMisread');
    expect(WR4_INSTITUTION_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.institutions.{band,stateRead}');

    for (const row of WR4_WAR_COST_COUPLINGS) {
      expect(row.read, row.couplingId).toBe(row.counterforce);
      expect(row.flags, row.couplingId).toEqual(['warLayerEnabled', 'warTerminationEnabled']);
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-4');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
    expect(WR4_INSTITUTION_HOME_FRONT_COUPLING.intendedDesk).not.toBe('adjudication');
  });

  test('every schema-v2 row has one stable unique identity and a closed shape', () => {
    const expectedKeys = [
      'couplingId', 'pairId', 'direction', 'read', 'receiptField',
      'counterforce', 'flags', 'owningVolume', 'owningWave', 'intendedDesk',
    ].sort();
    expect(new Set(COUPLING_REGISTRY.map((row) => row.couplingId)).size)
      .toBe(COUPLING_REGISTRY.length);
    for (const row of COUPLING_REGISTRY) {
      expect(Object.keys(row).sort(), row.couplingId).toEqual(expectedKeys);
      expect(row.couplingId).toMatch(/^CPL-\d+\.[A-Z_]+\.WR-\d+\.[a-z_]+$/);
    }
  });

  test('multi-row lookup preserves the legacy first-row result and fails closed', () => {
    expect(Object.isFrozen(COUPLING_REGISTRY)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING.flags)).toBe(true);
    const popWar = couplingRowsFor('CPL-3', 'POP→WAR');
    expect(popWar).toEqual([WR3_LINEAGE_COUPLING, WR4_HANDS_HOME_FRONT_COUPLING]);
    expect(Object.isFrozen(popWar)).toBe(true);
    expect(couplingRowFor('CPL-3', 'POP→WAR')).toBe(WR3_LINEAGE_COUPLING);
    expect(couplingRowsFor('CPL-1', 'TRADE→WAR')).toEqual([WR4_TRADE_HOME_FRONT_COUPLING]);
    expect(couplingRowFor('CPL-4', 'INFO→WAR')).toBe(WR4_BELIEF_TRAJECTORY_COUPLING);
    expect(couplingRowFor('CPL-6', 'INTERIOR→WAR')).toBe(WR4_INSTITUTION_HOME_FRONT_COUPLING);
    expect(couplingRowFor('CPL-3', 'WAR→POP')).toBeNull();
    expect(couplingRowFor('CPL-99', 'POP→WAR')).toBeNull();
    expect(couplingRowFor(null, null)).toBeNull();
    const missing = couplingRowsFor('CPL-99', 'POP→WAR');
    expect(missing).toEqual([]);
    expect(Object.isFrozen(missing)).toBe(true);
    expect(couplingRowsFor(null, null)).toBe(missing);
  });
});
