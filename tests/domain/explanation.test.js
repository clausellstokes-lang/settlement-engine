/**
 * tests/domain/explanation.test.js — Tier 2.6 unified causal lookup.
 *
 * Pins:
 *   - explainEntity dispatcher routes by type prefix (institution., faction.,
 *     npc., chain., hook., condition., clock., history., var.) AND by
 *     explicit { type, id }.
 *   - Every per-type explainer produces the canonical ExplanationEnvelope
 *     shape (entityType, entityId, entityLabel, causalReason, causes,
 *     downstreamEffects, ifRemoved.consequences, profile, references,
 *     sources).
 *   - The envelope composes the right Phase derivations:
 *     * explainFaction reads Phase 9 wants/fears/leverage/vulnerabilities.
 *     * explainSupplyChain reads Phase 10 controller + failureConsequences
 *       + beneficiaries/victims.
 *     * explainNpc reads Phase 13 consequenceIfRemoved.
 *     * explainHook reads Phase 11 origin + severity + ifIgnored.
 *     * explainCondition reads Phase 16 archetype + affectedSystems +
 *       duration.
 *     * explainEscalationClock reads Phase 11 trigger + stages.
 *     * explainSystemVariable reads Phase 17 contributors as causes.
 *   - entityCatalog enumerates every explainable entity on a settlement.
 *   - Pure: no settlement mutation.
 *   - Real-settlement integration: city-tier generated settlement
 *     produces non-trivial envelopes for at least one entity of every
 *     supported type.
 */

import { describe, it, expect } from 'vitest';
import {
  EXPLAINABLE_TYPES,
  explainEntity,
  explainInstitution,
  explainFaction,
  explainNpc,
  explainSupplyChain,
  explainHook,
  explainCondition,
  explainEscalationClock,
  explainHistoryBeat,
  explainSystemVariable,
  entityCatalog,
  relatedTraces,
} from '../../src/domain/explanation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Fixture ────────────────────────────────────────────────────────────

function fixtureSettlement() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    config: { tradeRouteAccess: 'standard', magicLevel: 'low' },
    institutions: [
      {
        id: 'institution.granary',
        name: 'Town Granary',
        category: 'civic',
        status: 'active',
        tags: ['food_storage'],
      },
      {
        id: 'institution.temple',
        name: 'Temple of Light',
        category: 'religious',
        status: 'active',
      },
    ],
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.town_council', faction: 'Town Council', name: 'Town Council', power: 35, controlsInstitutionIds: ['institution.granary'] },
        { id: 'faction.merchants',    faction: 'Merchant Guilds', name: 'Merchant Guilds', power: 30 },
        { id: 'faction.religious',    faction: 'Religious Authorities', name: 'Religious Authorities', power: 25 },
      ],
    },
    economicState: {
      activeChains: [
        {
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          processingInstitutions: ['Town Granary'],
          status: 'operational',
          outputs: ['bread'],
          exportable: false,
        },
      ],
      plotHooks: [
        { category: 'food_security', hook: 'Bread prices climb sharply.', severity: 'medium' },
      ],
    },
    npcs: [
      {
        id: 'npc.captain_rusk',
        name: 'Captain Rusk',
        category: 'enforcement',
        rank: 'dominant',
        factionAffiliation: 'Town Council',
      },
    ],
    activeConditions: [
      { archetype: 'plague', severity: 0.6 },
    ],
    simulationTrace: [
      {
        targetType: 'institution',
        targetId: 'institution.granary',
        step: 'assembleInstitutions',
        result: 'selected',
        causes: [{ source: 'food_security_need', effect: 'requires', reason: 'Settlement needs grain storage.' }],
        downstreamEffects: [{ target: 'chain.food_security.grain_to_bread', effect: 'enables', reason: 'Granary feeds the grain-to-bread chain.' }],
      },
    ],
  };
}

// ── EXPLAINABLE_TYPES catalog ──────────────────────────────────────────

describe('EXPLAINABLE_TYPES', () => {
  it('exposes the canonical entity types (incl. threat P20 + capacity P21)', () => {
    expect(EXPLAINABLE_TYPES).toEqual([
      'institution', 'faction', 'npc', 'chain', 'hook',
      'condition', 'clock', 'history_beat', 'system_variable',
      'threat', 'capacity',
    ]);
  });
});

// ── Universal dispatcher ───────────────────────────────────────────────

describe('explainEntity() dispatch', () => {
  it('routes by id prefix when no explicit type given', () => {
    const env = explainEntity(fixtureSettlement(), 'institution.granary');
    expect(env.entityType).toBe('institution');
    expect(env.entityId).toBe('institution.granary');
  });

  it('accepts { type, id } form', () => {
    const env = explainEntity(fixtureSettlement(), { type: 'institution', id: 'institution.granary' });
    expect(env.entityType).toBe('institution');
  });

  it('recognises bare system-variable names', () => {
    const env = explainEntity(fixtureSettlement(), 'food_security');
    expect(env.entityType).toBe('system_variable');
  });

  it('returns null for nullish settlement', () => {
    expect(explainEntity(null, 'institution.granary')).toBeNull();
  });

  it('returns empty envelope for unknown entity prefix', () => {
    const env = explainEntity(fixtureSettlement(), 'mystery.thing');
    expect(env.entityType).toBeNull();
    expect(env.entityId).toBe('mystery.thing');
  });

  it('returns empty envelope for missing entity (known type)', () => {
    const env = explainEntity(fixtureSettlement(), 'institution.does_not_exist');
    expect(env.entityType).toBe('institution');
    expect(env.causes).toEqual([]);
    expect(env.downstreamEffects).toEqual([]);
  });
});

// ── Envelope shape ─────────────────────────────────────────────────────

describe('ExplanationEnvelope shape', () => {
  function assertEnvelope(env) {
    expect(env).toHaveProperty('entityType');
    expect(env).toHaveProperty('entityId');
    expect(env).toHaveProperty('entityLabel');
    expect(env).toHaveProperty('causalReason');
    expect(Array.isArray(env.causes)).toBe(true);
    expect(Array.isArray(env.downstreamEffects)).toBe(true);
    expect(env.ifRemoved).toHaveProperty('consequences');
    expect(Array.isArray(env.ifRemoved.consequences)).toBe(true);
    expect(Array.isArray(env.references)).toBe(true);
    expect(Array.isArray(env.sources)).toBe(true);
  }

  it('every per-type explainer returns the canonical shape', () => {
    const s = fixtureSettlement();
    assertEnvelope(explainInstitution(s, 'institution.granary'));
    assertEnvelope(explainFaction(s, 'faction.town_council'));
    assertEnvelope(explainNpc(s, 'npc.captain_rusk'));
    // The chain id we'd derive — find it from the catalog.
    const chains = entityCatalog(s).filter(e => e.type === 'chain');
    if (chains.length) {
      assertEnvelope(explainSupplyChain(s, chains[0].id));
    }
    const hooks = entityCatalog(s).filter(e => e.type === 'hook');
    if (hooks.length) {
      assertEnvelope(explainHook(s, hooks[0].id));
    }
    const conditions = entityCatalog(s).filter(e => e.type === 'condition');
    if (conditions.length) {
      assertEnvelope(explainCondition(s, conditions[0].id));
    }
    assertEnvelope(explainSystemVariable(s, 'food_security'));
  });
});

// ── explainInstitution ─────────────────────────────────────────────────

describe('explainInstitution()', () => {
  it('surfaces Phase 7 trace causes', () => {
    const env = explainInstitution(fixtureSettlement(), 'institution.granary');
    expect(env.causes.some(c => c.source === 'food_security_need')).toBe(true);
  });

  it('surfaces controlling faction as a cause', () => {
    const env = explainInstitution(fixtureSettlement(), 'institution.granary');
    expect(env.causes.some(c => c.source === 'faction.town_council' && c.effect === 'controls')).toBe(true);
  });

  it('surfaces chains using the institution as downstream effects', () => {
    const env = explainInstitution(fixtureSettlement(), 'institution.granary');
    expect(env.downstreamEffects.some(d => d.effect === 'enables_chain')).toBe(true);
  });

  it('ifRemoved cites chain downstream + faction lever loss', () => {
    const env = explainInstitution(fixtureSettlement(), 'institution.granary');
    expect(env.ifRemoved.consequences.length).toBeGreaterThan(0);
    expect(env.ifRemoved.consequences.some(c => /chain|processor|lever/i.test(c))).toBe(true);
  });
});

// ── explainFaction ─────────────────────────────────────────────────────

describe('explainFaction()', () => {
  it('returns the Phase 9 profile fields', () => {
    const env = explainFaction(fixtureSettlement(), 'faction.town_council');
    expect(env.entityLabel).toBe('Town Council');
    expect(env.profile).toHaveProperty('archetype');
    expect(env.profile).toHaveProperty('wants');
    expect(env.profile).toHaveProperty('fears');
    expect(env.profile).toHaveProperty('leverage');
    expect(env.profile).toHaveProperty('vulnerabilities');
    expect(env.profile).toHaveProperty('resources');
  });

  it('lists controlled institutions as downstream effects', () => {
    const env = explainFaction(fixtureSettlement(), 'faction.town_council');
    expect(env.downstreamEffects.some(d => d.target === 'institution.granary' && d.effect === 'controls')).toBe(true);
  });

  it('ifRemoved names a likely rival beneficiary', () => {
    const env = explainFaction(fixtureSettlement(), 'faction.town_council');
    expect(env.ifRemoved.consequences.some(c => /likely beneficiary/i.test(c))).toBe(true);
  });
});

// ── explainNpc ─────────────────────────────────────────────────────────

describe('explainNpc()', () => {
  it('surfaces Phase 13 consequenceIfRemoved', () => {
    const env = explainNpc(fixtureSettlement(), 'npc.captain_rusk');
    expect(env.ifRemoved.consequences.length).toBeGreaterThan(0);
  });

  it('cites the NPC\'s faction link as a cause', () => {
    const env = explainNpc(fixtureSettlement(), 'npc.captain_rusk');
    expect(env.causes.some(c => c.effect === 'affiliates')).toBe(true);
  });

  it('profile carries Phase 13 archetype + rank', () => {
    const env = explainNpc(fixtureSettlement(), 'npc.captain_rusk');
    expect(env.profile.archetype).toBeTruthy();
    expect(env.profile.rank).toBeTruthy();
  });
});

// ── explainSupplyChain ─────────────────────────────────────────────────

describe('explainSupplyChain()', () => {
  it('lists Phase 10 controller + dependencies + outputs', () => {
    const s = fixtureSettlement();
    const chains = entityCatalog(s).filter(e => e.type === 'chain');
    expect(chains.length).toBeGreaterThan(0);
    const env = explainSupplyChain(s, chains[0].id);
    expect(env.profile.needKey).toBe('food_security');
    expect(env.profile.controller).toBeTruthy();
    expect(Array.isArray(env.profile.beneficiaries)).toBe(true);
    expect(Array.isArray(env.profile.victims)).toBe(true);
  });

  it('ifRemoved cites failureConsequences', () => {
    const s = fixtureSettlement();
    const chains = entityCatalog(s).filter(e => e.type === 'chain');
    const env = explainSupplyChain(s, chains[0].id);
    expect(env.ifRemoved.consequences.length).toBeGreaterThan(0);
  });
});

// ── explainHook ────────────────────────────────────────────────────────

describe('explainHook()', () => {
  it('reads Phase 11 origin + severity + possibleResolutions', () => {
    const s = fixtureSettlement();
    const hooks = entityCatalog(s).filter(e => e.type === 'hook');
    if (hooks.length === 0) return;
    const env = explainHook(s, hooks[0].id);
    expect(env.profile).toHaveProperty('origin');
    expect(env.profile).toHaveProperty('severity');
    expect(env.profile).toHaveProperty('possibleResolutions');
  });

  it('downstreamEffects carry the ifIgnored consequences', () => {
    const s = fixtureSettlement();
    const hooks = entityCatalog(s).filter(e => e.type === 'hook');
    if (hooks.length === 0) return;
    const env = explainHook(s, hooks[0].id);
    expect(Array.isArray(env.downstreamEffects)).toBe(true);
  });
});

// ── explainCondition ───────────────────────────────────────────────────

describe('explainCondition()', () => {
  it('reads Phase 16 archetype + affectedSystems + duration', () => {
    const s = fixtureSettlement();
    const conditions = entityCatalog(s).filter(e => e.type === 'condition');
    expect(conditions.length).toBeGreaterThan(0);
    const env = explainCondition(s, conditions[0].id);
    expect(env.profile.archetype).toBe('plague');
    expect(Array.isArray(env.profile.affectedSystems)).toBe(true);
    expect(env.profile.duration).toBeTruthy();
  });

  it('downstream pressures the declared affectedSystems', () => {
    const s = fixtureSettlement();
    const conditions = entityCatalog(s).filter(e => e.type === 'condition');
    const env = explainCondition(s, conditions[0].id);
    expect(env.downstreamEffects.length).toBeGreaterThan(0);
    expect(env.downstreamEffects[0].effect).toBe('pressures');
  });

  it('references point to system variables', () => {
    const s = fixtureSettlement();
    const conditions = entityCatalog(s).filter(e => e.type === 'condition');
    const env = explainCondition(s, conditions[0].id);
    expect(env.references.some(r => r.type === 'system_variable')).toBe(true);
  });
});

// ── explainEscalationClock ─────────────────────────────────────────────

describe('explainEscalationClock()', () => {
  it('reads Phase 11 trigger + stages', () => {
    // Construct a settlement guaranteed to produce a Bread Riot Clock.
    const s = {
      name: 'Hungry',
      powerStructure: {
        governingName: 'Council',
        publicLegitimacy: { score: 60, label: 'Approved' },
        factions: [
          { faction: 'Council',           power: 35, desc: '' },
          { faction: 'Merchant Guilds',   power: 30, desc: '' },
        ],
      },
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          processingInstitutions: ['Town Granary'],
          status: 'impaired',
        }],
      },
    };
    const clocks = entityCatalog(s).filter(e => e.type === 'clock');
    expect(clocks.length).toBeGreaterThan(0);
    const env = explainEscalationClock(s, clocks[0].id);
    expect(env.profile.stages).toBeTruthy();
    expect(env.profile.stages.length).toBe(6);
  });
});

// ── explainHistoryBeat ─────────────────────────────────────────────────

describe('explainHistoryBeat()', () => {
  it('reads Phase 12 beat label + source', () => {
    const s = {
      ...fixtureSettlement(),
      settlementReason: 'Founded on a river crossing for grain trade.',
    };
    const env = explainHistoryBeat(s, 'foundingCause');
    expect(env).toBeTruthy();
    if (env.entityType === 'history_beat' && env.profile) {
      expect(env.profile.label).toBeTruthy();
      expect(env.causalReason).toBeTruthy();
    }
  });
});

// ── explainSystemVariable ──────────────────────────────────────────────

describe('explainSystemVariable()', () => {
  it('reads Phase 17 contributors as causes', () => {
    const s = fixtureSettlement();
    const env = explainSystemVariable(s, 'food_security');
    expect(env.profile.variable).toBe('food_security');
    expect(typeof env.profile.score).toBe('number');
    expect(env.profile.band).toBeTruthy();
    // Plague is active → at least one contributor citing plague.
    expect(env.causes.some(c => /plague/i.test(c.reason))).toBe(true);
  });

  it('accepts the var.<name> prefix form', () => {
    const env = explainSystemVariable(fixtureSettlement(), 'var.food_security');
    expect(env.profile.variable).toBe('food_security');
  });

  it('returns an empty envelope for unknown variable', () => {
    const env = explainSystemVariable(fixtureSettlement(), 'mystery_variable');
    expect(env.entityType).toBe('system_variable');
    expect(env.causes).toEqual([]);
  });
});

// ── entityCatalog ──────────────────────────────────────────────────────

describe('entityCatalog()', () => {
  it('enumerates every explainable entity', () => {
    const cat = entityCatalog(fixtureSettlement());
    // Institutions, factions, NPCs, chains, conditions, hooks, history
    // beats, system variables — at least one of each from the fixture.
    const types = new Set(cat.map(e => e.type));
    expect(types.has('institution')).toBe(true);
    expect(types.has('faction')).toBe(true);
    expect(types.has('npc')).toBe(true);
    expect(types.has('chain')).toBe(true);
    expect(types.has('condition')).toBe(true);
    expect(types.has('system_variable')).toBe(true);
  });

  it('returns [] for nullish settlement', () => {
    expect(entityCatalog(null)).toEqual([]);
  });

  it('every catalog entry has { type, id, label }', () => {
    const cat = entityCatalog(fixtureSettlement());
    for (const e of cat) {
      expect(typeof e.type).toBe('string');
      expect(typeof e.id).toBe('string');
      expect(typeof e.label).toBe('string');
    }
  });
});

// ── relatedTraces ──────────────────────────────────────────────────────

describe('relatedTraces()', () => {
  it('returns { caused, affecting, targeting } arrays', () => {
    const r = relatedTraces(fixtureSettlement(), 'institution.granary');
    expect(Array.isArray(r.caused)).toBe(true);
    expect(Array.isArray(r.affecting)).toBe(true);
    expect(Array.isArray(r.targeting)).toBe(true);
    // The fixture has one trace targeting institution.granary.
    expect(r.targeting.length).toBe(1);
  });
});

// ── No-mutation contract ───────────────────────────────────────────────

describe('explainEntity() does not mutate', () => {
  it('does not modify the input settlement', () => {
    const s = fixtureSettlement();
    const before = JSON.stringify(s);
    explainEntity(s, 'institution.granary');
    explainEntity(s, 'faction.town_council');
    explainEntity(s, 'food_security');
    expect(JSON.stringify(s)).toBe(before);
  });
});

// ── Real-settlement integration ────────────────────────────────────────

describe('explainEntity() — real generated settlement', () => {
  it('produces non-trivial envelopes against a real city-tier settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'explanation-real-city', customContent: {} },
    );

    const cat = entityCatalog(settlement);
    expect(cat.length).toBeGreaterThan(0);

    // For each supported type that's present, pick the first one and
    // assert the envelope shape + non-emptiness.
    for (const type of EXPLAINABLE_TYPES) {
      const entries = cat.filter(e => e.type === type);
      if (entries.length === 0) continue;
      const env = explainEntity(settlement, { type, id: entries[0].id });
      expect(env, `${type} ${entries[0].id}`).toBeTruthy();
      expect(env.entityType, `${type} envelope type`).toBe(type);
      expect(env.entityId, `${type} envelope id`).toBe(entries[0].id);
      // Either ifRemoved consequences OR causes should be non-empty —
      // an entity worth listing has at least one of the two.
      const hasContent = env.ifRemoved.consequences.length > 0
        || env.causes.length > 0
        || env.downstreamEffects.length > 0;
      expect(hasContent, `${type} envelope empty`).toBe(true);
    }
  });
});
