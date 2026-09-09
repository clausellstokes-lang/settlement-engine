/** WR-5 amendment H: war decisions organize, but do not guarantee, internal opposition. */
import { describe, expect, it } from 'vitest';

import {
  applyWarDecisionPolitics,
  warDemandForInstaller,
} from '../../src/domain/worldPulse/warPoliticalLoop.js';
import {
  evaluateFactionRules,
  factionCompetitionId,
} from '../../src/domain/worldPulse/factionCompetition.js';

function item(factions) {
  return {
    id: 'a', name: 'Aster',
    settlement: {
      name: 'Aster',
      powerStructure: { factions },
    },
  };
}

function snapshot(entry) {
  return { settlements: [entry], byId: new Map([['a', entry]]) };
}

function world() {
  return {
    tick: 12,
    calendar: { elapsedWeeks: 30 },
    simulationRules: {
      warLayerEnabled: true,
      warTerminationEnabled: true,
      factionCompetitionEnabled: true,
      memoryWeaveEnabled: true,
    },
  };
}

const crown = { id: 'fac.crown', faction: 'Crown', category: 'civic', power: 55, isGoverning: true };
const merchants = { id: 'fac.merchants', faction: 'Merchant League', category: 'merchant', power: 45 };
const host = { id: 'fac.host', faction: 'Banner Host', category: 'military', power: 45 };

describe('WR-5 war political loop', () => {
  it('reaches both polarities and writes nothing for an aligned faction', () => {
    const peaceOpposition = item([crown, merchants]);
    const againstWar = applyWarDecisionPolitics({
      worldState: world(), snapshot: snapshot(peaceOpposition),
      actorId: 'a', targetId: 'b', actualAction: 'continue',
      decisionId: 'decision.refuse', tick: 12,
    });
    expect(againstWar.deposits).toEqual([expect.objectContaining({
      factionId: 'a:fac_merchants', desiredAction: 'peace', actualAction: 'continue',
    })]);

    const warOpposition = item([crown, host]);
    const againstPeace = applyWarDecisionPolitics({
      worldState: world(), snapshot: snapshot(warOpposition),
      actorId: 'a', targetId: 'b', actualAction: 'peace',
      decisionId: 'decision.sue', tick: 12,
    });
    expect(againstPeace.deposits).toEqual([expect.objectContaining({
      factionId: 'a:fac_host', desiredAction: 'continue', actualAction: 'peace',
    })]);

    const aligned = applyWarDecisionPolitics({
      worldState: world(), snapshot: snapshot(peaceOpposition),
      actorId: 'a', targetId: 'b', actualAction: 'peace',
      decisionId: 'decision.accept', tick: 12,
    });
    expect(aligned.deposits).toEqual([]);
    expect(aligned.worldState).toBeDefined();
    expect(aligned.worldState.factionPairStates).toBeUndefined();
  });

  it('dedupes a retried decision and recovers the installer demand as a typed subset', () => {
    const settlement = item([crown, merchants]);
    const first = applyWarDecisionPolitics({
      worldState: world(), snapshot: snapshot(settlement),
      actorId: 'a', targetId: 'b', actualAction: 'continue',
      decisionId: 'decision.refuse', tick: 12,
    });
    const second = applyWarDecisionPolitics({
      worldState: first.worldState, snapshot: snapshot(settlement),
      actorId: 'a', targetId: 'b', actualAction: 'continue',
      decisionId: 'decision.refuse', tick: 12,
    });
    expect(second.deposits).toEqual([]);
    expect(second.worldState).toBe(first.worldState);
    expect(warDemandForInstaller(
      first.worldState,
      settlement.settlement,
      'a',
      'a:fac_merchants',
    )).toEqual({
      actorId: 'a', targetId: 'b', decisionId: 'decision.refuse', desiredAction: 'peace',
    });
  });

  it('writes the exact settlement-scoped ids the faction challenger later consumes', () => {
    const settlement = item([crown, merchants]);
    const written = applyWarDecisionPolitics({
      worldState: world(), snapshot: snapshot(settlement),
      actorId: 'a', targetId: 'b', actualAction: 'continue',
      decisionId: 'decision.refuse', tick: 12,
    });
    const crownId = factionCompetitionId('a', crown, 0);
    const merchantId = factionCompetitionId('a', merchants, 1);
    expect(Object.keys(written.worldState.factionPairStates)).toEqual([
      [crownId, merchantId].sort().join('|'),
    ]);

    const politicalWorld = {
      ...written.worldState,
      factionStates: {
        [merchantId]: {
          factionId: merchantId,
          settlementId: 'a',
          name: merchants.faction,
          archetype: 'merchant',
          governmentPreference: 'merchant_charter',
          powerBases: ['wealth'],
          controlledInstitutions: [],
          suppressedInstitutions: [],
          lawPreferences: ['contract_priority'],
          rivals: [],
          legitimacyClaim: 0.5,
          riskTolerance: 0.6,
          momentum: 0.3,
          exhaustion: 0,
        },
      },
    };
    const candidates = evaluateFactionRules({
      ...snapshot(settlement),
      worldState: politicalWorld,
    }, {
      get(_id, kind) {
        return { score: kind === 'legitimacy' ? 0.7 : 0 };
      },
    }, { tick: 13 });
    expect(candidates).toEqual(expect.arrayContaining([
      expect.objectContaining({
        candidateType: 'faction_government_challenge',
        factionId: merchantId,
        metadata: expect.objectContaining({ warDecisionOpposition: true }),
      }),
    ]));
  });

  it('stays dark without the existing faction and memory machinery', () => {
    const settlement = item([crown, merchants]);
    const dark = world();
    delete dark.simulationRules.memoryWeaveEnabled;
    const result = applyWarDecisionPolitics({
      worldState: dark, snapshot: snapshot(settlement),
      actorId: 'a', targetId: 'b', actualAction: 'continue',
      decisionId: 'decision.refuse', tick: 12,
    });
    expect(result.worldState).toBe(dark);
    expect(result.deposits).toEqual([]);
  });
});
