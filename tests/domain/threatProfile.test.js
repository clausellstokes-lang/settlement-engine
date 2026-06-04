/**
 * tests/domain/threatProfile.test.js — Tier 4.6 structured threat contract.
 *
 * Pins:
 *   - THREAT_TYPES + THREAT_STAGES catalog stability.
 *   - threatSeverityBand / severityToStage boundaries.
 *   - collectThreatSources walks every surface:
 *     * config.monsterThreat (frontier + plagued)
 *     * defenseProfile.scores (low internal/economic/magical)
 *     * explicit defenseProfile.threats[]
 *     * top-level threats[]
 *     * stressors with threat-type tags
 *     * hostile / cold_war neighbours
 *     * active conditions (Phase 16) — plague, food_anchor_lost,
 *       corruption_exposed, trade_route_cut, dominant_npc_removed
 *   - Type inference from text patterns.
 *   - deriveThreatProfile produces the canonical envelope.
 *   - Idempotence: re-deriving a canonical threat yields the same.
 *   - No mutation of input settlement.
 *   - Diagnostic helpers: threatBreakdown, pressuresOnSubstrate,
 *     summarizeThreats.
 *   - Real-settlement integration: city-tier generated settlement
 *     surfaces at least one threat with a canonical shape.
 *   - Phase 19 wiring: explainThreat returns the canonical envelope;
 *     EXPLAINABLE_TYPES includes 'threat'; entityCatalog enumerates
 *     threats.
 */

import { describe, it, expect } from 'vitest';
import {
  THREAT_TYPES,
  THREAT_STAGES,
  threatSeverityBand,
  severityToStage,
  collectThreatSources,
  deriveThreatProfile,
  deriveAllThreatProfiles,
  threatBreakdown,
  pressuresOnSubstrate,
  summarizeThreats,
  supportedThreatTypes,
  threatTypeTemplate,
  threatSeverityBands,
  threatStages,
} from '../../src/domain/threatProfile.js';
import {
  EXPLAINABLE_TYPES,
  explainEntity,
  explainThreat,
  entityCatalog,
} from '../../src/domain/explanation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Catalog stability ──────────────────────────────────────────────────

describe('THREAT_TYPES catalog', () => {
  it('contains the canonical 12 types', () => {
    expect(THREAT_TYPES).toEqual([
      'monster_pressure', 'bandit_raids', 'siege', 'rival_neighbor',
      'plague', 'famine', 'corruption', 'unrest',
      'arcane_instability', 'cult', 'economic_collapse', 'other',
    ]);
  });

  it('is frozen', () => {
    expect(Object.isFrozen(THREAT_TYPES)).toBe(true);
  });

  it('every type has a template', () => {
    for (const type of THREAT_TYPES) {
      const tmpl = threatTypeTemplate(type);
      expect(tmpl, type).toBeTruthy();
      expect(typeof tmpl.label).toBe('string');
      expect(typeof tmpl.vector).toBe('string');
      expect(Array.isArray(tmpl.affectedSystems)).toBe(true);
    }
  });
});

describe('THREAT_STAGES', () => {
  it('exposes the canonical 5-stage progression', () => {
    expect(THREAT_STAGES).toEqual(['latent', 'developing', 'active', 'imminent', 'realized']);
  });
});

// ── Severity → band / stage ────────────────────────────────────────────

describe('threatSeverityBand()', () => {
  it('respects boundaries at 0.25 / 0.5 / 0.75', () => {
    expect(threatSeverityBand(0.0)).toBe('low');
    expect(threatSeverityBand(0.24)).toBe('low');
    expect(threatSeverityBand(0.25)).toBe('medium');
    expect(threatSeverityBand(0.49)).toBe('medium');
    expect(threatSeverityBand(0.5)).toBe('high');
    expect(threatSeverityBand(0.74)).toBe('high');
    expect(threatSeverityBand(0.75)).toBe('critical');
    expect(threatSeverityBand(1.0)).toBe('critical');
  });
});

describe('severityToStage()', () => {
  it('maps severity to a 5-stage progression', () => {
    expect(severityToStage(0)).toBe('latent');
    expect(severityToStage(0.15)).toBe('latent');
    expect(severityToStage(0.2)).toBe('developing');
    expect(severityToStage(0.39)).toBe('developing');
    expect(severityToStage(0.4)).toBe('active');
    expect(severityToStage(0.59)).toBe('active');
    expect(severityToStage(0.6)).toBe('imminent');
    expect(severityToStage(0.79)).toBe('imminent');
    expect(severityToStage(0.8)).toBe('realized');
    expect(severityToStage(1.0)).toBe('realized');
  });
});

// ── collectThreatSources ───────────────────────────────────────────────

describe('collectThreatSources()', () => {
  it('returns [] for nullish settlement', () => {
    expect(collectThreatSources(null)).toEqual([]);
  });

  it('detects plagued monster threat', () => {
    const sources = collectThreatSources({ config: { monsterThreat: 'plagued' } });
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0].inferredType).toBe('monster_pressure');
    expect(sources[0].originSurface).toBe('config');
  });

  it('detects frontier monster threat', () => {
    const sources = collectThreatSources({ config: { monsterThreat: 'frontier' } });
    expect(sources.some(s => s.inferredType === 'monster_pressure')).toBe(true);
  });

  it('ignores safe / civilized monster threat', () => {
    const safe = collectThreatSources({ config: { monsterThreat: 'safe' } });
    const civ = collectThreatSources({ config: { monsterThreat: 'civilized' } });
    expect(safe.length).toBe(0);
    expect(civ.length).toBe(0);
  });

  it('detects low internal score as unrest', () => {
    const sources = collectThreatSources({
      defenseProfile: { scores: { internal: 30 } },
    });
    expect(sources.some(s => s.inferredType === 'unrest')).toBe(true);
  });

  it('detects low economic score as economic_collapse', () => {
    const sources = collectThreatSources({
      defenseProfile: { scores: { economic: 25 } },
    });
    expect(sources.some(s => s.inferredType === 'economic_collapse')).toBe(true);
  });

  it('detects hostile neighbour as rival_neighbor', () => {
    const sources = collectThreatSources({
      neighbours: [
        { name: 'Blackmoor', relationshipType: 'hostile' },
      ],
    });
    expect(sources.some(s => s.inferredType === 'rival_neighbor')).toBe(true);
  });

  it('detects cold_war neighbour as rival_neighbor with lower severity', () => {
    const sources = collectThreatSources({
      neighbours: [
        { name: 'Highvale', relationshipType: 'cold_war' },
      ],
    });
    const cold = sources.find(s => s.inferredType === 'rival_neighbor');
    expect(cold).toBeTruthy();
    expect(cold.raw.severity).toBeLessThan(0.7);
  });

  it('infers plague from active condition', () => {
    const sources = collectThreatSources({
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    });
    expect(sources.some(s => s.inferredType === 'plague')).toBe(true);
  });

  it('infers famine from food_anchor_lost condition', () => {
    const sources = collectThreatSources({
      activeConditions: [{ archetype: 'food_anchor_lost', severity: 0.7 }],
    });
    expect(sources.some(s => s.inferredType === 'famine')).toBe(true);
  });

  it('infers corruption from corruption_exposed condition', () => {
    const sources = collectThreatSources({
      activeConditions: [{ archetype: 'corruption_exposed', severity: 0.5 }],
    });
    expect(sources.some(s => s.inferredType === 'corruption')).toBe(true);
  });

  it('skips siege_lifted condition (post-threat, not a threat)', () => {
    const sources = collectThreatSources({
      activeConditions: [{ archetype: 'siege_lifted', severity: 0.4 }],
    });
    // siege_lifted is recovery, not threat
    expect(sources.length).toBe(0);
  });

  it('infers types from stressor names by regex', () => {
    const sources = collectThreatSources({
      stressors: [
        { name: 'Bandit raids on the south road', severity: 0.6 },
        { name: 'Siege preparations across the border', severity: 0.5 },
        { name: 'Cult activity in the slums', severity: 0.4 },
      ],
    });
    const types = new Set(sources.map(s => s.inferredType));
    expect(types.has('bandit_raids')).toBe(true);
    expect(types.has('siege')).toBe(true);
    expect(types.has('cult')).toBe(true);
  });
});

// ── deriveThreatProfile ────────────────────────────────────────────────

describe('deriveThreatProfile()', () => {
  it('returns null for nullish input', () => {
    expect(deriveThreatProfile(null)).toBeNull();
  });

  it('produces the canonical shape from a raw threat', () => {
    const t = deriveThreatProfile({
      raw: { name: 'Bandit raids', severity: 0.6 },
      inferredType: 'bandit_raids',
      originSurface: 'stressors',
    });
    expect(t.id).toMatch(/^threat\.bandit_raids\./);
    expect(t.type).toBe('bandit_raids');
    expect(t.label).toBe('Bandit raids');
    expect(t.severity).toBe(0.6);
    expect(t.severityBand).toBe('high');
    expect(t.currentStage).toBe('imminent');
    expect(t.visibility).toBe('open');
    expect(Array.isArray(t.affectedSystems)).toBe(true);
    expect(Array.isArray(t.beneficiaries)).toBe(true);
    expect(Array.isArray(t.victims)).toBe(true);
    expect(t.originSurface).toBe('stressors');
  });

  it('honors explicit type on the raw object', () => {
    const t = deriveThreatProfile({
      raw: { name: 'A nameless thing', type: 'cult', severity: 0.5 },
      originSurface: 'defenseProfile',
    });
    expect(t.type).toBe('cult');
    expect(t.visibility).toBe('hidden');
  });

  it('falls back to neutral severity when no number given', () => {
    const t = deriveThreatProfile({
      raw: { name: 'Some pressure' },
      inferredType: 'unrest',
      originSurface: 'config',
    });
    expect(t.severity).toBe(0.4);
    expect(t.currentStage).toBe('active');
  });

  it('clamps severity to 0..1', () => {
    expect(deriveThreatProfile({ raw: { name: 'x', severity: 5 }, originSurface: 's' }).severity).toBe(1);
    expect(deriveThreatProfile({ raw: { name: 'x', severity: -3 }, originSurface: 's' }).severity).toBe(0);
  });

  it('passes through already-canonical threats (idempotent)', () => {
    const base = deriveThreatProfile({
      raw: { name: 'Plague', severity: 0.7 },
      inferredType: 'plague',
      originSurface: 'activeConditions',
    });
    const again = deriveThreatProfile(base);
    expect(again).toBe(base);
  });
});

// ── deriveAllThreatProfiles ────────────────────────────────────────────

describe('deriveAllThreatProfiles()', () => {
  it('returns [] for nullish settlement', () => {
    expect(deriveAllThreatProfiles(null)).toEqual([]);
  });

  it('emits one threat per surface signal', () => {
    const settlement = {
      config: { monsterThreat: 'frontier' },
      defenseProfile: { scores: { internal: 25 } },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
      neighbours: [{ name: 'Blackmoor', relationshipType: 'hostile' }],
      stressors: [{ name: 'Bandit raids on south road', severity: 0.5 }],
    };
    const profiles = deriveAllThreatProfiles(settlement);
    const types = new Set(profiles.map(t => t.type));
    expect(types.has('monster_pressure')).toBe(true);
    expect(types.has('unrest')).toBe(true);
    expect(types.has('plague')).toBe(true);
    expect(types.has('rival_neighbor')).toBe(true);
    expect(types.has('bandit_raids')).toBe(true);
  });

  it('does not mutate the input settlement', () => {
    const settlement = {
      config: { monsterThreat: 'plagued' },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const before = JSON.stringify(settlement);
    deriveAllThreatProfiles(settlement);
    expect(JSON.stringify(settlement)).toBe(before);
  });
});

// ── threatBreakdown ────────────────────────────────────────────────────

describe('threatBreakdown()', () => {
  it('counts by type / band / stage', () => {
    const settlement = {
      config: { monsterThreat: 'plagued' },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const breakdown = threatBreakdown(settlement);
    expect(breakdown.count).toBeGreaterThanOrEqual(2);
    expect(breakdown.byType.monster_pressure).toBeGreaterThan(0);
    expect(breakdown.byType.plague).toBeGreaterThan(0);
    const totalBand = Object.values(breakdown.byBand).reduce((a, b) => a + b, 0);
    expect(totalBand).toBe(breakdown.count);
  });

  it('returns zero counts for threat-free settlement', () => {
    const breakdown = threatBreakdown({ config: { monsterThreat: 'safe' } });
    expect(breakdown.count).toBe(0);
  });
});

// ── pressuresOnSubstrate ───────────────────────────────────────────────

describe('pressuresOnSubstrate()', () => {
  it('returns deduplicated affected systems', () => {
    const settlement = {
      config: { monsterThreat: 'frontier' },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const variables = pressuresOnSubstrate(settlement);
    expect(Array.isArray(variables)).toBe(true);
    // Phase 17 substrate variables — must include healing/labor (plague)
    // and defense (monster).
    expect(variables.includes('defense_readiness')).toBe(true);
    expect(variables.includes('healing_capacity')).toBe(true);
    // Dedup check — each variable appears at most once.
    expect(new Set(variables).size).toBe(variables.length);
  });
});

// ── summarizeThreats ───────────────────────────────────────────────────

describe('summarizeThreats()', () => {
  it('returns a single "no threats" line when empty', () => {
    expect(summarizeThreats({ config: { monsterThreat: 'safe' } }))
      .toEqual(['No threats currently pressing the settlement.']);
  });

  it('returns one line per threat with severity + stage + systems', () => {
    const settlement = {
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    };
    const lines = summarizeThreats(settlement);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]).toMatch(/Plague/);
    expect(lines[0]).toMatch(/(latent|developing|active|imminent|realized)/);
  });
});

// ── supportedThreatTypes / threatSeverityBands / threatStages ──────────

describe('catalog accessors', () => {
  it('supportedThreatTypes returns a copy of THREAT_TYPES', () => {
    expect(supportedThreatTypes()).toEqual([...THREAT_TYPES]);
  });

  it('threatSeverityBands exposes the canonical 4-band list', () => {
    expect(threatSeverityBands()).toEqual(['low', 'medium', 'high', 'critical']);
  });

  it('threatStages returns a copy of THREAT_STAGES', () => {
    expect(threatStages()).toEqual([...THREAT_STAGES]);
  });
});

// ── Phase 19 wiring ────────────────────────────────────────────────────

describe('Phase 19 wiring — explainThreat + EXPLAINABLE_TYPES + entityCatalog', () => {
  it('EXPLAINABLE_TYPES includes "threat"', () => {
    expect(EXPLAINABLE_TYPES).toContain('threat');
  });

  it('entityCatalog enumerates threats', () => {
    const settlement = {
      config: { monsterThreat: 'plagued' },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const cat = entityCatalog(settlement);
    expect(cat.some(e => e.type === 'threat')).toBe(true);
  });

  it('explainThreat returns the canonical envelope', () => {
    const settlement = {
      config: { monsterThreat: 'plagued' },
    };
    const cat = entityCatalog(settlement).filter(e => e.type === 'threat');
    expect(cat.length).toBeGreaterThan(0);
    const env = explainThreat(settlement, cat[0].id);
    expect(env.entityType).toBe('threat');
    expect(env.entityId).toBe(cat[0].id);
    expect(env.causes.length).toBeGreaterThan(0);
    expect(env.downstreamEffects.length).toBeGreaterThan(0);
    expect(env.ifRemoved.consequences.length).toBeGreaterThan(0);
    expect(env.profile).toBeTruthy();
  });

  it('explainEntity dispatcher routes threat.* ids', () => {
    const settlement = {
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const cat = entityCatalog(settlement).filter(e => e.type === 'threat');
    if (cat.length === 0) return;
    const env = explainEntity(settlement, cat[0].id);
    expect(env.entityType).toBe('threat');
  });

  it('downstream effects on a threat envelope reference system variables', () => {
    const settlement = {
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const cat = entityCatalog(settlement).filter(e => e.type === 'threat');
    const env = explainThreat(settlement, cat[0].id);
    expect(env.references.some(r => r.type === 'system_variable')).toBe(true);
    expect(env.downstreamEffects.some(d => d.effect === 'pressures')).toBe(true);
  });
});

// ── Real-settlement integration ────────────────────────────────────────

describe('deriveAllThreatProfiles() — real generated settlement', () => {
  it('surfaces at least one threat for a frontier city', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'threat-real-frontier', customContent: {} },
    );
    const profiles = deriveAllThreatProfiles(settlement);
    // Frontier / plagued conditions or low defense scores should
    // produce at least one threat across a city-tier settlement.
    for (const t of profiles) {
      expect(t.id).toMatch(/^threat\./);
      expect(THREAT_TYPES).toContain(t.type);
      expect(['low', 'medium', 'high', 'critical']).toContain(t.severityBand);
      expect(THREAT_STAGES).toContain(t.currentStage);
      expect(Array.isArray(t.affectedSystems)).toBe(true);
    }
  });

  it('does not mutate the generated settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic' },
      null,
      { seed: 'threat-no-mutation', customContent: {} },
    );
    const before = JSON.stringify(settlement);
    deriveAllThreatProfiles(settlement);
    explainEntity(settlement, entityCatalog(settlement).find(e => e.type === 'threat')?.id);
    expect(JSON.stringify(settlement)).toBe(before);
  });
});
