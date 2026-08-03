import { describe, expect, test } from 'vitest';

import {
  censusEnvoyEncounterCandidates,
  censusProactiveSelfParlays,
  ENVOY_PROJECTION_PHASE,
  selectEnvoyEncounters,
  selfParlayEpisodeId,
  selfParlayPairId,
} from '../../src/domain/worldPulse/envoyEncounter.js';
import {
  coalitionCallIdFor,
  independentLiveWarCauseTypes,
} from '../../src/domain/worldPulse/warCoalitionLedger.js';

const TICK = 12;

function envoy(overrides = {}) {
  return {
    errandId: 'errand-a',
    npcId: 'npc-envoy-a',
    fromId: 'sender',
    toId: 'target',
    relationshipKey: 'edge.sender.target',
    episodeKey: 'episode-a',
    nodeId: 'crossroads',
    journey: 'outbound',
    projectedTick: TICK,
    projectionPhase: ENVOY_PROJECTION_PHASE,
    routeId: 'route-envoy',
    venueRef: { id: 'crossroads', kind: 'field_node' },
    ...overrides,
  };
}

function army(overrides = {}) {
  return {
    armyId: 'army-target',
    actorId: 'target',
    targetId: 'sender',
    nodeId: 'crossroads',
    projectedTick: TICK,
    projectionPhase: ENVOY_PROJECTION_PHASE,
    routeId: 'route-army',
    venueRef: { id: 'crossroads', kind: 'field_node' },
    ...overrides,
  };
}

function selected(envoys, armies, extra = {}) {
  return selectEnvoyEncounters({
    projectedEnvoys: envoys,
    projectedArmies: armies,
    tick: TICK,
    ...extra,
  });
}

describe('WR-7b pure encounter census', () => {
  test('only exact same-node, same-tick, pre-mutation projections collide', () => {
    expect(selected([envoy()], [army()])).toHaveLength(1);
    expect(selected([envoy()], [army({ nodeId: 'next-crossroads' })]),
      'a shared route and future crossing are not co-location').toEqual([]);
    expect(selected([envoy({ projectedTick: TICK - 1 })], [army()]),
      'mixed ticks cannot enter the census').toEqual([]);
    expect(selected([envoy()], [army({ projectionPhase: 'already_moved' })]),
      'mixed mutation phases cannot enter the census').toEqual([]);
  });

  test('enumerates target field parlay and typed third-party war continuation', () => {
    const candidates = censusEnvoyEncounterCandidates({
      projectedEnvoys: [envoy()],
      projectedArmies: [
        army(),
        army({
          armyId: 'army-third', actorId: 'third', targetId: 'target',
          intent: { kind: 'war_continue', intentId: 'books.third.continue' },
        }),
      ],
      tick: TICK,
    });
    expect(candidates.map((row) => row.kind)).toEqual(['field_parlay', 'war_continue']);
    expect(candidates[1].provenance.intentId).toBe('books.third.continue');
  });

  test.each(['imprison', 'terms_shop'])('enumerates the singular %s private goal', (privateGoal) => {
    const [encounter] = selected([envoy()], [army({
      armyId: `army-${privateGoal}`,
      actorId: 'third',
      intent: { kind: 'private_goal', privateGoals: [privateGoal] },
    })]);
    expect(encounter).toMatchObject({ kind: 'private_goal', privateGoal });
  });

  test('the plant arm is conditional, targeted, and carries exact lineage', () => {
    const plant = army({
      armyId: 'army-plant',
      actorId: 'third',
      intent: {
        kind: 'private_goal',
        privateGoals: ['plant'],
        plantEligible: true,
        plantLineageId: 'plant-lineage-7',
        plantTargetErrandId: 'errand-a',
      },
    });
    expect(selected([envoy()], [{
      ...plant,
      intent: { ...plant.intent, plantEligible: false },
    }])).toEqual([]);
    expect(selected([envoy()], [{
      ...plant,
      intent: { ...plant.intent, plantTargetErrandId: undefined },
    }])).toEqual([]);
    expect(selected([envoy()], [{
      ...plant,
      intent: { ...plant.intent, plantTargetErrandId: 'another-errand' },
    }])).toEqual([]);
    expect(selected([envoy()], [plant])).toEqual([
      expect.objectContaining({
        kind: 'private_goal',
        privateGoal: 'plant',
        plantEligibility: 'confirmed',
        plantLineageId: 'plant-lineage-7',
      }),
    ]);
  });

  test('malformed multiple or unknown private goals fail closed', () => {
    const malformed = [
      ['plant', 'imprison'],
      ['unknown_goal'],
      [],
    ].map((privateGoals, index) => army({
      armyId: `army-malformed-${index}`,
      actorId: `third-${index}`,
      intent: { kind: 'private_goal', privateGoals },
    }));
    expect(selected([envoy()], malformed)).toEqual([]);
    expect(selected([envoy()], [army({
      armyId: 'army-untagged',
      actorId: 'third',
      intent: { kind: 'private_goal', privateGoal: 'imprison' },
    })])).toEqual([]);
  });

  test('private goal outranks target army, which outranks war continuation', () => {
    const continuation = army({
      armyId: 'army-a-continue', actorId: 'a-third', targetId: 'target',
      intent: { kind: 'war_continue' },
    });
    const field = army({ armyId: 'army-a-field', actorId: 'target' });
    const privateGoal = army({
      armyId: 'army-z-private', actorId: 'z-third', targetId: 'target',
      intent: { kind: 'private_goal', privateGoals: ['imprison'] },
    });
    expect(selected([envoy()], [continuation, field])[0].kind).toBe('field_parlay');
    expect(selected([envoy()], [continuation, field, privateGoal])[0])
      .toMatchObject({ kind: 'private_goal', privateGoal: 'imprison' });
  });

  test('actor, army, and envoy codepoint ties are permutation and RNG independent', () => {
    const envoys = [
      envoy({ errandId: 'errand-z', npcId: 'npc-z', episodeKey: 'episode-z' }),
      envoy({ errandId: 'errand-a', npcId: 'npc-a', episodeKey: 'episode-a' }),
    ];
    const armies = [
      army({
        armyId: 'army-z', actorId: 'schemer-b',
        intent: { kind: 'private_goal', privateGoals: ['terms_shop'] },
      }),
      army({
        armyId: 'army-b', actorId: 'schemer-a',
        intent: { kind: 'private_goal', privateGoals: ['terms_shop'] },
      }),
      army({
        armyId: 'army-a', actorId: 'schemer-a',
        intent: { kind: 'private_goal', privateGoals: ['terms_shop'] },
      }),
    ];
    const forward = selected(envoys, armies, { rng: { random: () => 0 } });
    const reverse = selected([...envoys].reverse(), [...armies].reverse(), {
      rng: { random: () => 0.999999 },
    });
    expect(reverse).toEqual(forward);
    expect(forward.map((row) => row.errandId)).toEqual(['errand-a', 'errand-z']);
    expect(forward.every((row) => row.actorId === 'schemer-a' && row.armyId === 'army-a')).toBe(true);
  });

  test('one selected encounter keeps stable exact node, route, venue, and temporal provenance', () => {
    const [encounter] = selected([envoy()], [army()]);
    const [replayed] = selected([envoy()], [army()]);
    expect(replayed).toEqual(encounter);
    expect(encounter).toMatchObject({
      kind: 'field_parlay',
      nodeId: 'crossroads',
      routeId: 'route-envoy',
      venueRef: { id: 'crossroads', kind: 'field_node' },
      provenance: {
        temporalCut: { projectedTick: TICK, projectionPhase: 'pre_mutation' },
        envoyPosition: { nodeId: 'crossroads', routeId: 'route-envoy' },
        armyPosition: { nodeId: 'crossroads', routeId: 'route-army' },
      },
    });
    expect(selected([envoy()], [army(), army({ armyId: 'army-target-z' })])).toHaveLength(1);
  });

  test('conflicting aliases for an envoy or army id fail closed', () => {
    expect(selected(
      [envoy(), envoy({
        nodeId: 'forged-node',
        venueRef: { id: 'forged-node', kind: 'field_node' },
      })],
      [army()],
    )).toEqual([]);
    expect(selected(
      [envoy()],
      [army(), army({ actorId: 'forged-actor' })],
    )).toEqual([]);
  });
});

function joinedAnchor(partyId = 'ally') {
  const callerDeploymentSinceTick = 3;
  return {
    callId: coalitionCallIdFor({
      callerId: 'caller',
      partyId,
      enemyId: 'enemy',
      callerDeploymentSinceTick,
    }),
    partyId,
    callerId: 'caller',
    enemyId: 'enemy',
    joinedTick: 7,
    callerDeploymentSinceTick,
    originAttackerId: 'caller',
    originSinceTick: callerDeploymentSinceTick,
    allianceRelationshipKey: 'edge.ally.caller',
    sourceCauseTypes: ['grievance'],
    cause: 'alliance_obligation',
  };
}

function joinedWorld(extraReasons = {}) {
  const anchor = joinedAnchor();
  return {
    deployments: {
      ally: {
        targetId: 'enemy',
        sinceTick: 7,
        casusReasons: [{ type: 'alliance_obligation', score: 1 }],
        joinLedger: [anchor],
      },
    },
    spatialLedgers: {
      warReasons: {
        'ally>enemy': {
          reasons: {
            alliance_obligation: { type: 'alliance_obligation', score: 1 },
            ...extraReasons,
          },
        },
      },
    },
  };
}

describe('WR-7b proactive self-parlay correction', () => {
  const relationshipRows = [{
    partyId: 'ally',
    targetId: 'enemy',
    relationshipKey: 'edge.ally.enemy',
  }];

  test('a valid joined edge with only borrowed obligation opens without any collision', () => {
    const [candidate] = censusProactiveSelfParlays({
      worldState: joinedWorld(),
      relationshipRows,
    });
    expect(candidate).toMatchObject({
      kind: 'self_parlay',
      genesis: 'proactive',
      partyId: 'ally',
      targetId: 'enemy',
      callerId: 'caller',
      joinedTick: 7,
      relationshipKey: 'edge.ally.enemy',
      frontSinceTick: 7,
      pairId: selfParlayPairId('ally', 'enemy'),
    });
    expect(candidate.episodeId).toBe(selfParlayEpisodeId({
      partyId: 'ally',
      targetId: 'enemy',
      frontSinceTick: 7,
      joinCallId: joinedAnchor().callId,
    }));
    // anchored: the candidate's own id/episode fields are asserted above, so it
    // is demonstrably a real self-parlay row — these absences prove a proactive
    // genesis carries no collision cargo, not that the census returned nothing.
    expect(candidate).not.toHaveProperty('armyId'); // anchored: candidate proven populated above
    expect(candidate).not.toHaveProperty('nodeId'); // anchored: candidate proven populated above
    expect(candidate).not.toHaveProperty('encounterId'); // anchored: candidate proven populated above
  });

  test('a positive independent directed cause blocks self-parlay; borrowed obligation does not', () => {
    const borrowed = joinedWorld();
    expect(independentLiveWarCauseTypes(borrowed, 'ally', 'enemy', {
      deployment: borrowed.deployments.ally,
      requireJoinAnchor: true,
    })).toEqual([]);

    const owned = joinedWorld({
      grievance: { type: 'grievance', score: 0.4 },
      opportunism: { type: 'opportunism', score: 0 },
    });
    expect(independentLiveWarCauseTypes(owned, 'ally', 'enemy', {
      deployment: owned.deployments.ally,
      requireJoinAnchor: true,
    })).toEqual(['grievance']);
    expect(censusProactiveSelfParlays({ worldState: owned, relationshipRows })).toEqual([]);
  });

  test('stale episodes, malformed anchors, recalls, and ambiguous relationship keys fail closed', () => {
    const stale = joinedWorld();
    expect(independentLiveWarCauseTypes(stale, 'ally', 'enemy', {
      deployment: { ...stale.deployments.ally, sinceTick: 6 },
      requireJoinAnchor: true,
    })).toEqual([]);

    const malformed = joinedWorld();
    malformed.deployments.ally = {
      ...malformed.deployments.ally,
      joinLedger: [{ ...joinedAnchor(), callId: 'forged' }],
    };
    expect(censusProactiveSelfParlays({ worldState: malformed, relationshipRows })).toEqual([]);

    const recalled = joinedWorld();
    recalled.deployments.ally = { ...recalled.deployments.ally, recalled: { tick: 8 } };
    expect(censusProactiveSelfParlays({ worldState: recalled, relationshipRows })).toEqual([]);

    expect(censusProactiveSelfParlays({
      worldState: joinedWorld(),
      relationshipRows: [
        ...relationshipRows,
        { ...relationshipRows[0], relationshipKey: 'edge.forged' },
      ],
    })).toEqual([]);
  });

  test('root callers retain founding-cause intersection while using the canonical reader', () => {
    const root = {
      deployments: {
        caller: {
          targetId: 'enemy',
          sinceTick: 3,
          casusReasons: [{ type: 'grievance' }],
        },
      },
      spatialLedgers: {
        warReasons: {
          'caller>enemy': {
            reasons: {
              grievance: { type: 'grievance', score: 0.7 },
              opportunism: { type: 'opportunism', score: 0.6 },
            },
          },
        },
      },
    };
    expect(independentLiveWarCauseTypes(root, 'caller', 'enemy'))
      .toEqual(['grievance', 'opportunism']);
    expect(independentLiveWarCauseTypes(root, 'caller', 'enemy', {
      deployment: root.deployments.caller,
      foundingOnly: true,
    })).toEqual(['grievance']);
  });
});
