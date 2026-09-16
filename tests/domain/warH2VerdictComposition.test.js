/** WR-5 literal composition pin: organic exposure -> H2 -> successor -> termination. */
import { describe, expect, it } from 'vitest';

import {
  appendObservedWizardNewsEntries,
  projectWizardNewsForAudience,
} from '../../src/domain/region/wizardNews.js';
import { applyNpcVerdict } from '../../src/domain/worldPulse/npcVerdictApply.js';
import { applyOrganicNpcVerdicts } from '../../src/domain/worldPulse/npcVerdictPulse.js';
import { readWarTerminations } from '../../src/domain/worldPulse/warTermination.js';
import { warAuthorityVerdictsForPulse } from '../../src/domain/worldPulse/warAuthorityVerdict.js';
import { verdictDissolutionRulingEvidence } from '../../src/domain/worldPulse/warRulingsEvidence.js';

const RULES = Object.freeze({
  npcConsequencesEnabled: true,
  warLayerEnabled: true,
  warTerminationEnabled: true,
  infoMode: 'unreliable',
  momentumEnabled: true,
});

const NOW = '2026-08-02T00:00:00.000Z';

function oldRuler() {
  return {
    id: 'old',
    name: 'Magistrate Vey',
    role: 'Magistrate',
    importance: 'pillar',
    influence: 'High',
    power: 60,
    dots: 4,
    structuralRank: 'dominant',
    factionAffiliation: 'Crown',
    linkedFactionIds: ['fac.crown'],
    institutionId: 'inst.court',
    corrupt: true,
    timesExposed: 1,
    personality: { dominant: 'shrewd', flaw: 'greedy', modifier: 'proud' },
  };
}

function actorSettlement(ruler) {
  return {
    name: 'Aster',
    tier: 'town',
    population: 2000,
    config: {},
    institutions: [{ id: 'inst.gaol', name: 'Small prison' }],
    npcs: ruler ? [ruler] : [],
    factions: [{ id: 'fac.crown', name: 'Crown', members: ruler ? [ruler] : [] }],
    powerStructure: {
      publicLegitimacy: { score: 8 },
      factions: [{
        id: 'fac.crown',
        faction: 'Crown',
        category: 'civic',
        power: 100,
        isGoverning: true,
        members: ruler ? [ruler] : [],
      }],
    },
  };
}

function item(id, name, settlement) {
  return { id, name, settlement };
}

function pressure() {
  return { get() { return null; }, strongest() { return null; } };
}

function reason(type, score = 0.8) {
  return {
    type,
    score,
    sinceTick: 1,
    tick: 10,
    receipt: `The ${type} quarrel remains live.`,
  };
}

function world({ tick, rulerId, pulseHistory = [], founding = ['corruption_exposed'] }) {
  return {
    tick,
    spatialCanonVersion: 1,
    simulationRules: { ...RULES },
    deployments: {
      a: {
        targetId: 'b',
        sinceTick: 1,
        maxStartStrength: 100,
        currentEffectiveStrength: 100,
        casusReasons: founding.map((type) => ({
          type,
          score: 0.8,
          receipt: `The ${type} quarrel raised the banners.`,
          atTick: 1,
        })),
      },
    },
    warExhaustion: { a: 0 },
    pulseHistory,
    spatialLedgers: {
      warReasons: {
        'a>b': {
          updatedTick: tick,
          reasons: Object.fromEntries(founding.map((type) => [type, reason(type)])),
        },
      },
      npcLadder: {
        a: {
          factions: { 'fac.crown': { rungs: [rulerId] } },
          npcs: { [rulerId]: { stock: 1 } },
        },
      },
      commitments: {
        'a>war:b': {
          stock: 10,
          sinceTick: 1,
          lastDepositTick: tick,
          deposits: [{ tick, kind: 'siege', mag: 1 }],
        },
      },
    },
  };
}

function read(worldState, actor) {
  const target = item('b', 'Briar', {
    name: 'Briar', tier: 'town', population: 2000, config: {}, npcs: [],
    powerStructure: { factions: [] },
  });
  const snapshot = {
    settlements: [actor, target],
    byId: new Map([['a', actor], ['b', target]]),
    regionalGraph: { edges: [], channels: [] },
  };
  return readWarTerminations({
    worldState,
    snapshot,
    pIndex: pressure(),
    tick: worldState.tick,
  }).byAttacker.get('a');
}

function deterministicSuccessorRng() {
  const rng = {
    pick(values) { return values[0]; },
    randInt() { return 123456; },
    fork() { return rng; },
  };
  return rng;
}

function composedFixture({ founding = ['corruption_exposed'] } = {}) {
  const old = oldRuler();
  const beforeSettlement = actorSettlement(old);
  const beforeWorld = world({ tick: 8, rulerId: 'a:old', founding });
  const beforeRead = read(beforeWorld, item('a', 'Aster', beforeSettlement));
  expect(beforeRead.receipt.rulerId).toBe('a:old');

  const exposure = {
    npcId: 'a:old',
    settlementId: 'a',
    name: old.name,
    kind: 'ousted',
    criminalInstitution: null,
    homeInstitution: 'Crown',
  };
  const composition = applyOrganicNpcVerdicts({
    worldState: { ...beforeWorld, tick: 9 },
    settlement: beforeSettlement,
    exposures: [exposure],
    settlementSeed: 'seed-aster',
    settlementId: 'a',
    settlementName: 'Aster',
    tick: 9,
    successorRng: deterministicSuccessorRng(),
  });
  const authorityVerdict = composition.authorityVerdicts[0];
  expect(authorityVerdict).toMatchObject({
    id: composition.newsEntries[0].id,
    kind: 'npc_verdict',
    source: 'applyNpcVerdict',
    settlementId: 'a',
    npcId: 'a:old',
    rosterId: 'old',
    exposureKind: 'ousted',
    tick: 9,
  });

  const successor = composition.settlement.npcs[0];
  const afterSettlement = composition.settlement;
  expect(successor).toMatchObject({
    id: 'npc.successor_123456',
    factionAffiliation: 'Crown',
    importance: 'pillar',
    power: 60,
    replacedNpc: old.name,
  });
  expect(afterSettlement.factions[0].members[0]).toMatchObject({
    id: 'old',
    factionAffiliation: '',
    importance: 'minor',
    power: 0,
  });

  const authorityVerdicts = warAuthorityVerdictsForPulse(RULES, [authorityVerdict]);
  const pulseHistory = [{
    tick: 9,
    warAuthorityVerdicts: authorityVerdicts,
    // The tick-9 termination read precedes ladder reconciliation, so it still
    // records the authority that H2 removed during the same pulse.
    warTerminationReads: [{ ...beforeRead.receipt, tick: 9 }],
  }];
  const afterWorld = {
    ...composition.worldState,
    ...world({
      tick: 10,
      rulerId: `a:${successor.id}`,
      pulseHistory,
      founding,
    }),
  };
  return {
    verdict: { authorityVerdict },
    authorityVerdicts,
    afterWorld,
    afterActor: item('a', 'Aster', afterSettlement),
  };
}

describe('WR-5 H2 verdict provenance composition', () => {
  it('normalizes covert turncoat news with typed actor provenance and hides it from players', () => {
    const old = oldRuler();
    const exposure = {
      npcId: 'a:old',
      settlementId: 'a',
      name: old.name,
      kind: 'ousted',
      foreign: true,
      homeInstitution: 'Crown',
    };
    const composition = applyOrganicNpcVerdicts({
      worldState: world({ tick: 9, rulerId: 'a:old' }),
      settlement: actorSettlement(old),
      exposures: [exposure],
      settlementSeed: 'turncoat-2',
      settlementId: 'a',
      settlementName: 'Aster',
      tick: 9,
      successorRng: deterministicSuccessorRng(),
    });
    const authorityVerdict = composition.authorityVerdicts[0];
    const rawNews = composition.newsEntries[0];

    expect(authorityVerdict).toMatchObject({
      kind: 'npc_verdict',
      source: 'applyNpcVerdict',
      npcId: 'a:old',
      verdict: 'turncoat',
    });
    expect(rawNews).toMatchObject({
      id: authorityVerdict.id,
      candidateType: 'npc_verdict',
      kind: 'applied',
      impactKind: 'npc_verdict',
      sourceEventId: authorityVerdict.id,
      audience: 'dm-only',
      covert: true,
      npcIds: ['a:old'],
      factionIds: ['a:fac_crown'],
    });

    const receiptSink = [];
    const feed = appendObservedWizardNewsEntries({}, [rawNews], { now: NOW }, receiptSink);
    expect(receiptSink).toEqual([rawNews]);
    expect(feed.entries[0]).toMatchObject({
      kind: 'applied',
      impactKind: 'npc_verdict',
      sourceEventId: authorityVerdict.id,
      audience: 'dm-only',
      covert: true,
      npcIds: ['a:old'],
      factionIds: ['a:fac_crown'],
    });
    expect(projectWizardNewsForAudience(feed, 'player').entries).toEqual([]);
    expect(projectWizardNewsForAudience(feed, 'public').entries).toEqual([]);
    expect(projectWizardNewsForAudience(feed, 'dm')).toBe(feed);
  });

  it('is homed only behind both war flags and rejects raw organic ousters', () => {
    const { verdict } = composedFixture();
    const event = verdict.authorityVerdict;
    expect(warAuthorityVerdictsForPulse(RULES, [event])).toEqual([event]);
    expect(warAuthorityVerdictsForPulse({ ...RULES, warLayerEnabled: false }, [event])).toEqual([]);
    expect(warAuthorityVerdictsForPulse({ ...RULES, warTerminationEnabled: false }, [event])).toEqual([]);
    expect(warAuthorityVerdictsForPulse(RULES, [{
      settlementId: 'a', npcId: 'a:old', kind: 'ousted', tick: 9,
    }])).toEqual([]);

    const old = oldRuler();
    const wrongExposureKind = applyNpcVerdict({
      worldState: world({ tick: 9, rulerId: 'a:old' }),
      settlement: actorSettlement(old),
      npc: old,
      exposure: {
        npcId: 'a:old', settlementId: 'a', name: old.name, kind: 'demoted',
      },
      settlementSeed: 'seed-aster',
      settlementId: 'a',
      settlementName: 'Aster',
      tick: 9,
    });
    expect(wrongExposureKind.authorityVerdict).toBeNull();
  });

  it('carries the exact applyNpcVerdict receipt through succession and dissolves that founding cause', () => {
    const { verdict, afterWorld, afterActor } = composedFixture();
    const after = read(afterWorld, afterActor);
    expect(after.receipt).toMatchObject({
      momentumBroken: true,
      authorityChangeKind: 'corruption_verdict',
      authorityVerdictId: verdict.authorityVerdict.id,
      causeState: 'dissolved',
      dissolvedCauseTypes: ['corruption_exposed'],
      authorityDissolvedCauseTypes: ['corruption_exposed'],
    });
    expect(verdictDissolutionRulingEvidence(after.receipt)).toEqual([
      expect.objectContaining({
        kind: 'war_dissolved_by_verdict',
        settlementId: 'a',
        counterpartId: 'b',
      }),
    ]);

    // The authority dissolution rides the next read, so the still-decaying live
    // corruption reason cannot resurrect this deployment's consumed cause.
    const carriedWorld = {
      ...afterWorld,
      tick: 11,
      pulseHistory: [{ tick: 10, warTerminationReads: [{ ...after.receipt, tick: 10 }] }],
    };
    const carried = read(carriedWorld, afterActor);
    expect(carried.receipt.momentumBroken).toBe(false);
    expect(carried.receipt.causeState).toBe('dissolved');
    expect(carried.receipt.authorityDissolvedCauseTypes).toEqual(['corruption_exposed']);
  });

  it('does not dissolve on an organic ouster without the exact H2 receipt', () => {
    const { afterWorld, afterActor } = composedFixture();
    const organicOnly = {
      ...afterWorld,
      pulseHistory: afterWorld.pulseHistory.map((pulse) => ({
        tick: pulse.tick,
        warTerminationReads: pulse.warTerminationReads,
        corruptionEvents: [{
          settlementId: 'a',
          npcId: 'a:old',
          name: 'Magistrate Vey',
          kind: 'ousted',
        }],
      })),
    };
    const after = read(organicOnly, afterActor);
    expect(after.receipt.momentumBroken).toBe(true);
    expect(after.receipt.authorityChangeKind).toBeUndefined();
    expect(after.receipt.authorityVerdictId).toBeUndefined();
    expect(after.receipt.causeState).toBe('live');
    expect(after.receipt.dissolvedCauseTypes).toBeUndefined();
    expect(verdictDissolutionRulingEvidence(after.receipt)).toEqual([]);
  });

  it('retires corruption_exposed without dissolving an independent live founding cause', () => {
    const { verdict, afterWorld, afterActor } = composedFixture({
      founding: ['corruption_exposed', 'grievance'],
    });
    const after = read(afterWorld, afterActor);
    expect(after.receipt.authorityVerdictId).toBe(verdict.authorityVerdict.id);
    expect(after.receipt.causeState).toBe('live');
    expect(after.receipt.dissolvedCauseTypes).toEqual(['corruption_exposed']);
    expect(after.receipt.authorityDissolvedCauseTypes).toEqual(['corruption_exposed']);
    expect(afterWorld.spatialLedgers.warReasons['a>b'].reasons.grievance).toBeTruthy();
    expect(verdictDissolutionRulingEvidence(after.receipt)).toEqual([]);
  });
});
