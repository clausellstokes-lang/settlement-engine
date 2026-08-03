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
  WR5_BILATERAL_PEACE_COUPLING,
  WR5_REFUSAL_PRICE_COUPLING,
  WR5_SEAT_ACCEPTANCE_COUPLING,
  WR5_SEAT_BOOKS_COUPLING,
  WR5_WAR_DECISION_GRIEVANCE_COUPLING,
  WR5_WAR_RULING_COUPLINGS,
  WR6_ALLIANCE_RISK_COUPLING,
  WR6_COALITION_BOOKS_COUPLING,
  WR6_COALITION_RELATIONSHIP_COUPLING,
  WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
  WR6_PAIRWISE_SETTLEMENT_COUPLING,
  WR6_PEOPLE_EXPENDITURE_COUPLING,
  WR6_TRADE_EXPENDITURE_COUPLING,
  WR6_WAR_COALITION_COUPLINGS,
  WR7_ENVOY_COUPLINGS,
  WR7_HOME_DELIVERY_COUPLING,
  WR7_MOVING_PICTURE_COUPLING,
  WR7_PEACE_DISPATCH_COUPLING,
  WR7_SILENCE_INFERENCE_COUPLING,
  couplingRowFor,
  couplingRowsFor,
} from '../../src/domain/certification/couplingRegistry.js';

describe('CW-0 coupling registry', () => {
  test('schema v2 preserves prior waves and appends later waves in decision-flow order', () => {
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
      ...WR5_WAR_RULING_COUPLINGS,
      ...WR6_WAR_COALITION_COUPLINGS,
      ...WR7_ENVOY_COUPLINGS,
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

  test('records exactly five WR-5 reads against their live receipt surfaces', () => {
    expect(WR5_WAR_RULING_COUPLINGS).toEqual([
      {
        couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-5.seat_books',
        pairId: 'CPL-6',
        direction: 'INTERIOR→WAR',
        read: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
        receiptField: 'pulseRecord.warTerminationReads[].{authoritySignature,booksInterest,booksDirection,rulerSecurityBand,rulerLawfulnessBand,rulerMoralityBand,booksReason,booksPublicReason}',
        counterforce: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'war',
      },
      {
        couplingId: 'CPL-6.WAR_TO_INTERIOR.WR-5.war_decision_grievance',
        pairId: 'CPL-6',
        direction: 'WAR→INTERIOR',
        read: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
        receiptField: 'worldState.factionPairStates[...].incidents[].{type,context.{decisionId,actualAction,desiredAction}}',
        counterforce: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
        flags: [
          'warLayerEnabled',
          'warTerminationEnabled',
          'factionCompetitionEnabled',
          'memoryWeaveEnabled',
        ],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-5.bilateral_peace',
        pairId: 'CPL-5',
        direction: 'WAR→GRAMMAR',
        read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,decidingTerm,bands,reason}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.WR-5.seat_acceptance',
        pairId: 'CPL-21',
        direction: 'INTERIOR→GRAMMAR',
        read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,booksDirection,booksInterest,interestServed,inheritedDemand,booksPublicReason}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price',
        pairId: 'CPL-21',
        direction: 'GRAMMAR→INTERIOR',
        read: 'src/domain/worldPulse/warPeaceRefusal.js#applyWarPeaceRefusal',
        receiptField: 'applyWarPeaceRefusal(...).evidence[].{kind,id,settlementId,counterpartId,thirdPartyId,decision,interestServed}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
    ]);
    expect(Object.isFrozen(WR5_WAR_RULING_COUPLINGS)).toBe(true);
    for (const row of WR5_WAR_RULING_COUPLINGS) {
      expect(Object.isFrozen(row), row.couplingId).toBe(true);
      expect(Object.isFrozen(row.flags), row.couplingId).toBe(true);
    }
  });

  test('records the seven WR-6 reads from alliance risk through pairwise settlement', () => {
    expect(WR6_WAR_COALITION_COUPLINGS).toEqual([
      WR6_ALLIANCE_RISK_COUPLING,
      WR6_COALITION_BOOKS_COUPLING,
      WR6_PEOPLE_EXPENDITURE_COUPLING,
      WR6_TRADE_EXPENDITURE_COUPLING,
      WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
      WR6_COALITION_RELATIONSHIP_COUPLING,
      WR6_PAIRWISE_SETTLEMENT_COUPLING,
    ]);
    expect(WR6_WAR_COALITION_COUPLINGS.map((row) => [row.pairId, row.direction]))
      .toEqual([
        ['CPL-4', 'INFO→WAR'],
        ['CPL-6', 'INTERIOR→WAR'],
        ['CPL-3', 'POP→WAR'],
        ['CPL-1', 'TRADE→WAR'],
        ['CPL-1', 'WAR→TRADE'],
        ['CPL-6', 'WAR→INTERIOR'],
        ['CPL-5', 'WAR→GRAMMAR'],
    ]);
    for (const row of WR6_WAR_COALITION_COUPLINGS) {
      expect(row.flags).toEqual([
        'warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled',
      ]);
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-6');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
  });

  test('records both WR-7a transport directions and both belief directions under the exact conjunction', () => {
    expect(WR7_ENVOY_COUPLINGS).toEqual([
      WR7_PEACE_DISPATCH_COUPLING,
      WR7_HOME_DELIVERY_COUPLING,
      WR7_MOVING_PICTURE_COUPLING,
      WR7_SILENCE_INFERENCE_COUPLING,
    ]);
    expect(WR7_ENVOY_COUPLINGS.map((row) => [row.pairId, row.direction, row.intendedDesk]))
      .toEqual([
        ['CPL-5', 'WAR→GRAMMAR', 'adjudication'],
        ['CPL-5', 'GRAMMAR→WAR', 'adjudication'],
        ['CPL-19', 'INFO→GRAMMAR', 'events'],
        ['CPL-19', 'GRAMMAR→INFO', 'divination'],
      ]);
    for (const row of WR7_ENVOY_COUPLINGS) {
      expect(row.flags, row.couplingId).toEqual([
        'warLayerEnabled',
        'warTerminationEnabled',
        'peaceEngineEnabled',
        'envoyDiplomacyEnabled',
        'npcConsequencesEnabled',
        'routeLifecycleEnabled',
      ]);
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-7');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
    expect(WR7_PEACE_DISPATCH_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#dispatchAcceptedPeaceEnvoy');
    expect(WR7_HOME_DELIVERY_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#envoyReturnAcceptance');
    expect(WR7_MOVING_PICTURE_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#envoyRumorPatchFor');
    expect(WR7_SILENCE_INFERENCE_COUPLING.read)
      .toBe('src/domain/worldPulse/beliefMap.js#applyEnvoySilenceInference');
    expect(WR7_SILENCE_INFERENCE_COUPLING.counterforce)
      .toBe('src/domain/worldPulse/beliefMap.js#clearEnvoySilenceInference');
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
    expect(popWar).toEqual([
      WR3_LINEAGE_COUPLING,
      WR4_HANDS_HOME_FRONT_COUPLING,
      WR6_PEOPLE_EXPENDITURE_COUPLING,
    ]);
    expect(Object.isFrozen(popWar)).toBe(true);
    expect(couplingRowFor('CPL-3', 'POP→WAR')).toBe(WR3_LINEAGE_COUPLING);
    expect(couplingRowsFor('CPL-1', 'TRADE→WAR')).toEqual([
      WR4_TRADE_HOME_FRONT_COUPLING,
      WR6_TRADE_EXPENDITURE_COUPLING,
    ]);
    expect(couplingRowFor('CPL-4', 'INFO→WAR')).toBe(WR4_BELIEF_TRAJECTORY_COUPLING);
    const interiorWar = couplingRowsFor('CPL-6', 'INTERIOR→WAR');
    expect(interiorWar).toEqual([
      WR4_INSTITUTION_HOME_FRONT_COUPLING,
      WR5_SEAT_BOOKS_COUPLING,
      WR6_COALITION_BOOKS_COUPLING,
    ]);
    expect(Object.isFrozen(interiorWar)).toBe(true);
    expect(couplingRowFor('CPL-6', 'INTERIOR→WAR')).toBe(WR4_INSTITUTION_HOME_FRONT_COUPLING);
    expect(couplingRowsFor('CPL-6', 'WAR→INTERIOR'))
      .toEqual([WR5_WAR_DECISION_GRIEVANCE_COUPLING, WR6_COALITION_RELATIONSHIP_COUPLING]);
    expect(couplingRowFor('CPL-5', 'WAR→GRAMMAR')).toBe(WR5_BILATERAL_PEACE_COUPLING);
    expect(couplingRowsFor('CPL-5', 'WAR→GRAMMAR'))
      .toEqual([
        WR5_BILATERAL_PEACE_COUPLING,
        WR6_PAIRWISE_SETTLEMENT_COUPLING,
        WR7_PEACE_DISPATCH_COUPLING,
      ]);
    expect(couplingRowsFor('CPL-5', 'GRAMMAR→WAR'))
      .toEqual([WR7_HOME_DELIVERY_COUPLING]);
    expect(couplingRowsFor('CPL-19', 'INFO→GRAMMAR'))
      .toEqual([WR7_MOVING_PICTURE_COUPLING]);
    expect(couplingRowsFor('CPL-19', 'GRAMMAR→INFO'))
      .toEqual([WR7_SILENCE_INFERENCE_COUPLING]);
    expect(couplingRowsFor('CPL-1', 'WAR→TRADE'))
      .toEqual([WR6_COALITION_SETTLEMENT_TRADE_COUPLING]);
    expect(couplingRowFor('CPL-21', 'INTERIOR→GRAMMAR')).toBe(WR5_SEAT_ACCEPTANCE_COUPLING);
    expect(couplingRowFor('CPL-21', 'GRAMMAR→INTERIOR')).toBe(WR5_REFUSAL_PRICE_COUPLING);
    expect(couplingRowFor('CPL-3', 'WAR→POP')).toBeNull();
    expect(couplingRowFor('CPL-99', 'POP→WAR')).toBeNull();
    expect(couplingRowFor(null, null)).toBeNull();
    const missing = couplingRowsFor('CPL-99', 'POP→WAR');
    expect(missing).toEqual([]);
    expect(Object.isFrozen(missing)).toBe(true);
    expect(couplingRowsFor(null, null)).toBe(missing);
  });
});
