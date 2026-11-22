/** WR-5 integration: the two books stay inside WR-1's four terms. */
import { describe, expect, it } from 'vitest';

import { MOMENTUM_TUNING } from '../../src/domain/worldPulse/momentum.js';
import { readWarTerminations } from '../../src/domain/worldPulse/warTermination.js';
import { verdictDissolutionRulingEvidence } from '../../src/domain/worldPulse/warRulingsEvidence.js';

const RULES = Object.freeze({ warLayerEnabled: true, warTerminationEnabled: true });

function ruler(kind, id = 'r') {
  if (kind === 'war') {
    return {
      id, name: 'Marshal Vey', importance: 'pillar', factionAffiliation: 'Crown',
      personality: { dominant: 'ruthless', flaw: 'vengeful', modifier: 'proud' },
      facets: { alignment: 'chaotic_evil', goal: 'punish_rivals' },
    };
  }
  return {
    id, name: 'Lady Arin', importance: 'pillar', factionAffiliation: 'Crown',
    personality: { dominant: 'merciful', flaw: 'patient', modifier: 'diplomatic' },
    facets: { alignment: 'lawful_good', goal: 'survive_crisis' },
  };
}

function item(id, name, population, rulerNpc, { rival = false } = {}) {
  const factions = [
    { id: 'fac.crown', faction: 'Crown', category: 'civic', power: 15, isGoverning: true },
    { id: 'fac.rival', faction: 'Rival Host', category: 'military', power: 85 },
  ];
  return {
    id, name,
    settlement: {
      name, tier: 'town', population, config: {}, npcs: rulerNpc ? [rulerNpc] : [],
      powerStructure: {
        publicLegitimacy: { score: 8 }, factions,
        ...(rival ? { factionRelationships: [{ pair: ['Crown', 'Rival Host'], type: 'competitive', direction: 'escalating' }] } : {}),
      },
    },
  };
}

function pressure(score) {
  return {
    get(id, kind) { return id === 'a' && ['economy', 'trade'].includes(kind) ? { score } : null; },
    strongest() { return null; },
  };
}

function state({ rulerId = 'a:r', exhaustion = 0, pulseHistory = [], momentum = false } = {}) {
  return {
    tick: 9,
    spatialCanonVersion: momentum ? 1 : undefined,
    simulationRules: {
      ...RULES,
      ...(momentum ? { infoMode: 'unreliable', momentumEnabled: true } : {}),
    },
    deployments: {
      a: { targetId: 'b', sinceTick: 1, maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [] },
    },
    warExhaustion: { a: exhaustion },
    pulseHistory,
    spatialLedgers: {
      warReasons: {},
      npcLadder: { a: { factions: { 'fac.crown': { rungs: [rulerId] } }, npcs: { [rulerId]: { stock: 1 } } } },
      ...(momentum ? {
        commitments: {
          'a>war:b': {
            stock: MOMENTUM_TUNING.STOCK_MAX,
            sinceTick: 1,
            lastDepositTick: 9,
            deposits: [{ tick: 9, kind: 'siege', mag: 1 }],
          },
        },
      } : {}),
    },
  };
}

function read(actor, target, worldState, p = pressure(0), tick = 9) {
  const snapshot = {
    settlements: [actor, target],
    byId: new Map([[actor.id, actor], [target.id, target]]),
    regionalGraph: { edges: [], channels: [] },
  };
  return readWarTerminations({ worldState, snapshot, pIndex: p, tick }).byAttacker.get('a');
}

describe('WR-5 books inside war termination', () => {
  it('reaches a ruinous war continued for an insecure ruler while the rulerless realm would sue', () => {
    const target = item('b', 'Briar', 10000, null);
    const realmActor = item('a', 'Aster', 1000, null);
    const realmState = state({ exhaustion: 1 });
    realmState.spatialLedgers.npcLadder = {};
    const realm = read(realmActor, target, realmState, pressure(1));

    const seatActor = item('a', 'Aster', 1000, ruler('war'));
    const seat = read(seatActor, target, state({ exhaustion: 1 }), pressure(1));
    expect(realm.suePressure01).toBeGreaterThanOrEqual(0.5);
    expect(seat.suePressure01).toBeLessThan(0.5);
    expect(seat.receipt.booksInterest).toBe('seat');
    expect(seat.receipt.booksDirection).toBe('continue');
    expect(Object.keys(seat.bands).sort()).toEqual(['cause', 'cost_to_continue', 'cost_to_stop', 'momentum']);
  });

  it('reaches a winning war ended for the seat, with explicit rival-triumph evidence', () => {
    const target = item('b', 'Briar', 500, null);
    const realmActor = item('a', 'Aster', 20000, null);
    const realmState = state();
    realmState.spatialLedgers.npcLadder = {};
    const realm = read(realmActor, target, realmState);

    const seatActor = item('a', 'Aster', 20000, ruler('peace'), { rival: true });
    const seat = read(seatActor, target, state());
    expect(realm.suePressure01).toBeLessThan(0.5);
    expect(seat.suePressure01).toBeGreaterThanOrEqual(0.5);
    expect(seat.receipt.rivalTriumphBand).toBe('pressing');
    expect(seat.receipt.booksDirection).toBe('peace');
  });

  it('discounts only momentum after a semantic authority change', () => {
    const actor = item('a', 'Aster', 2000, ruler('peace'));
    const target = item('b', 'Briar', 2000, null);
    const first = read(actor, target, state({ momentum: true }));
    const prior = { ...first.receipt, tick: 8 };

    const same = read(actor, target, state({ momentum: true, pulseHistory: [{ warTerminationReads: [prior] }] }));
    const changed = read(actor, target, state({ momentum: true, pulseHistory: [{ warTerminationReads: [{ ...prior, authoritySignature: 'authority:old' }] }] }));
    expect(same.receipt.momentumBroken).toBe(false);
    expect(changed.receipt.momentumBroken).toBe(true);
    expect(changed.bands.momentum).not.toBe(same.bands.momentum);
    expect(changed.bands.cause).toBe(same.bands.cause);
    expect(changed.bands.cost_to_continue).toBe(same.bands.cost_to_continue);
    expect(changed.bands.cost_to_stop).toBe(same.bands.cost_to_stop);
  });

  it('an authority verdict permanently dissolves its founding corruption quarrel', () => {
    const actor = item('a', 'Aster', 2000, ruler('peace', 'a:new'));
    const target = item('b', 'Briar', 2000, null);
    const liveState = state({ rulerId: 'a:new', momentum: true });
    liveState.deployments.a.casusReasons = [{
      type: 'corruption_exposed', score: 0.8, receipt: 'The foreign rot stands exposed.', atTick: 1,
    }];
    liveState.spatialLedgers.warReasons = {
      'a>b': {
        updatedTick: 9,
        reasons: {
          corruption_exposed: {
            type: 'corruption_exposed', score: 0.8, sinceTick: 1, tick: 9,
            receipt: 'The foreign rot stands exposed.',
          },
        },
      },
    };

    const live = read(actor, target, liveState);
    expect(live.receipt.causeState).toBe('live');
    const afterVerdict = read(actor, target, {
      ...liveState,
      pulseHistory: [{
        tick: 8,
        warAuthorityVerdicts: [{
          id: 'npcverdict:a:wnpc-removed:8',
          kind: 'npc_verdict',
          source: 'applyNpcVerdict',
          settlementId: 'a',
          npcId: 'a:removed-officeholder',
          rosterId: 'removed-officeholder',
          verdict: 'jailed',
          exposureKind: 'ousted',
          tick: 8,
        }],
        warTerminationReads: [{
          ...live.receipt,
          tick: 8,
          authoritySignature: 'authority:removed-officeholder',
          rulerId: 'a:removed-officeholder',
        }],
      }],
    });
    expect(afterVerdict.receipt).toMatchObject({
      momentumBroken: true,
      causeState: 'dissolved',
      dissolvedCauseTypes: ['corruption_exposed'],
      authorityDissolvedCauseTypes: ['corruption_exposed'],
    });
    expect(verdictDissolutionRulingEvidence(afterVerdict.receipt)).toEqual([
      expect.objectContaining({ kind: 'war_dissolved_by_verdict', settlementId: 'a', counterpartId: 'b' }),
    ]);

    // The exposure ledger can still be decaying, but this deployment belongs to
    // the former authority. Its casus cannot revive on the following pulse.
    const carried = read(actor, target, {
      ...liveState,
      tick: 10,
      pulseHistory: [{ warTerminationReads: [{ ...afterVerdict.receipt, tick: 9 }] }],
    }, pressure(0), 10);
    expect(carried.receipt.momentumBroken).toBe(false);
    expect(carried.receipt.causeState).toBe('dissolved');
    expect(carried.receipt.authorityDissolvedCauseTypes).toEqual(['corruption_exposed']);
  });
});
