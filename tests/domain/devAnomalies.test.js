/**
 * tests/domain/devAnomalies.test.js - Tier 3.11 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  ANOMALY_TYPES,
  ANOMALY_SEVERITIES,
  detectDevAnomalies,
  anomalyBreakdown,
  supportedAnomalyTypes,
  supportedAnomalySeverities,
} from '../../src/domain/devAnomalies.js';

describe('catalogs', () => {
  it('exposes severities + types', () => {
    expect(ANOMALY_SEVERITIES).toEqual(['info', 'warning', 'error']);
    expect(supportedAnomalyTypes()).toEqual([...ANOMALY_TYPES]);
    expect(supportedAnomalySeverities()).toEqual([...ANOMALY_SEVERITIES]);
  });
});

describe('detectDevAnomalies()', () => {
  it('returns { anomalies, count } envelope', () => {
    const r = detectDevAnomalies({});
    expect(r).toHaveProperty('anomalies');
    expect(r).toHaveProperty('count');
    expect(Array.isArray(r.anomalies)).toBe(true);
  });

  it('returns empty for nullish settlement', () => {
    const r = detectDevAnomalies(null);
    expect(r.count).toBe(0);
  });

  it('detects faction referencing missing institution', () => {
    const r = detectDevAnomalies({
      institutions: [{ id: 'institution.granary' }],
      powerStructure: {
        factions: [
          { id: 'faction.council', faction: 'Council', controlsInstitutionIds: ['institution.unknown'] },
        ],
      },
    });
    expect(r.anomalies.some(a => a.type === 'faction_references_missing_institution')).toBe(true);
  });

  it('does NOT flag faction with valid institution ref', () => {
    const r = detectDevAnomalies({
      institutions: [{ id: 'institution.granary' }],
      powerStructure: {
        factions: [
          { faction: 'Council', controlsInstitutionIds: ['institution.granary'] },
        ],
      },
    });
    expect(r.anomalies.some(a => a.type === 'faction_references_missing_institution')).toBe(false);
  });

  it('detects chain with missing processor', () => {
    const r = detectDevAnomalies({
      institutions: [{ name: 'Granary' }],
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          processingInstitutions: ['Granary', 'Phantom Mill'],
          status: 'operational',
        }],
      },
    });
    expect(r.anomalies.some(a => a.type === 'chain_missing_processor')).toBe(true);
  });

  it('detects NPC referencing missing faction', () => {
    const r = detectDevAnomalies({
      powerStructure: { factions: [{ faction: 'Council' }] },
      npcs: [{ id: 'npc.x', name: 'Mystery', factionAffiliation: 'Dragon Cult' }],
    });
    expect(r.anomalies.some(a => a.type === 'npc_references_missing_faction')).toBe(true);
  });

  it('detects trace missing core fields', () => {
    const r = detectDevAnomalies({
      simulationTrace: [{ step: 'x' }],  // missing targetType, targetId, result
    });
    expect(r.anomalies.some(a => a.type === 'trace_missing_core_fields' && a.severity === 'error')).toBe(true);
  });

  it('detects unconsumed stressor', () => {
    const r = detectDevAnomalies({
      stressors: [{ type: 'mystery_thing' }],
      activeConditions: [],
    });
    expect(r.anomalies.some(a => a.type === 'stressor_unconsumed')).toBe(true);
  });

  it('clean settlement produces no anomalies', () => {
    const r = detectDevAnomalies({
      institutions: [{ id: 'institution.granary', name: 'Granary' }],
      powerStructure: { factions: [{ faction: 'Council', controlsInstitutionIds: ['institution.granary'] }] },
      npcs: [{ id: 'npc.x', name: 'Reeve', factionAffiliation: 'Council' }],
      simulationTrace: [
        { step: 'x', targetType: 'institution', targetId: 'i.1', result: 'selected' },
      ],
      stressors: [],
    });
    expect(r.count).toBe(0);
  });
});

describe('anomalyBreakdown()', () => {
  it('counts by severity', () => {
    const s = {
      institutions: [{ id: 'institution.granary' }],
      powerStructure: {
        factions: [{ faction: 'Council', controlsInstitutionIds: ['institution.x'] }],
      },
      simulationTrace: [{ step: 'x' }],
    };
    const b = anomalyBreakdown(s);
    expect(b.warning).toBeGreaterThan(0);
    expect(b.error).toBeGreaterThan(0);
    expect(b.total).toBe(b.info + b.warning + b.error);
  });
});

describe('purity', () => {
  it('does not mutate settlement', () => {
    const s = {
      institutions: [{ id: 'institution.x' }],
      powerStructure: { factions: [{ controlsInstitutionIds: ['institution.y'] }] },
    };
    const before = JSON.stringify(s);
    detectDevAnomalies(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});
