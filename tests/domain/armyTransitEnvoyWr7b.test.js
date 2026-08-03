import { describe, expect, it } from 'vitest';

import {
  armyRecordOf,
  armyTransitLedger,
  normalizeArmyEnvoyIntent,
} from '../../src/domain/spatial/armyTransit.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import {
  adaptArmyCommandPictureToEnvoyEpisode,
  advanceArmyTransit,
  applyArmyCommandPictureEvidence,
  applyArmyEnvoyIntent,
  applyEnvoyInterceptionDecision,
  armyNegotiationEpisodeKey,
  deriveArmyEnvoyIntent,
  projectArmiesForEnvoyEncounters,
  projectArmyForEnvoyEncounter,
} from '../../src/domain/worldPulse/armyTransitKernel.js';
import { envoyOfferEpisodeKey } from '../../src/domain/worldPulse/envoyErrand.js';
import {
  createNegotiationPicture,
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
} from '../../src/domain/worldPulse/negotiationPictures.js';

const LIT = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
  infoMode: 'omniscient',
});

function digest() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['a', 'm', 'b'],
    gates: [
      { between: ['a', 'm'], cost: 100 },
      { between: ['m', 'b'], cost: 100 },
    ],
    distanceMatrix: {
      a: { m: 100, b: 200 },
      m: { a: 100, b: 100 },
      b: { m: 100, a: 200 },
    },
    tiers: {
      a: { m: 1, b: 1 },
      m: { a: 1, b: 1 },
      b: { m: 1, a: 1 },
    },
  };
}

function item(id, category, military, exports = []) {
  return {
    id,
    name: id.toUpperCase(),
    settlement: {
      name: id.toUpperCase(),
      defenseProfile: {
        scores: { military, monster: 50, internal: 50, economic: 50, magical: 50 },
        readiness: { score: military },
      },
      economicState: { exports },
      powerStructure: {
        factions: [{ id: `${id}.court`, name: `${id} court`, category, power: 70, isGoverning: true }],
      },
      npcs: [],
    },
  };
}

function snapshot() {
  const rows = [item('a', 'merchant', 78, ['grain']), item('b', 'military', 42, ['iron'])];
  return { settlements: rows, byId: new Map(rows.map((row) => [row.id, row])) };
}

function graph() {
  return { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], channels: [] };
}

function picture() {
  return createNegotiationPicture({
    id: 'army.picture.a.b.0',
    carrier: { kind: 'army', id: 'a' },
    partyId: 'a',
    counterpartId: 'b',
    relationshipKey: 'edge.a.b',
    episodeKey: 'episode.a.b.0',
    frontOwnerId: 'a',
    frontSinceTick: 0,
    capturedTick: 0,
    causeStatus: 'live',
    subjects: [
      { settlementId: 'a', strengthBand: 'strong', governingArchetype: 'merchant', alignmentPressBand: 'measured' },
      { settlementId: 'b', strengthBand: 'strained', governingArchetype: 'military', alignmentPressBand: 'hard' },
    ],
    evidenceIds: ['hall.a.0'],
  });
}

function record(patch = {}) {
  return armyRecordOf({
    armyId: 'a',
    role: 'march',
    originId: 'a',
    destId: 'b',
    path: ['a', 'm', 'b'],
    departTick: 0,
    arrivalTick: 4,
    position01: 0,
    strength: 80,
    readiness: 0.7,
    supplyQuality: 0.8,
    funding: 0.6,
    beliefStaleness: 0,
    lastTick: 0,
    commandPicture: picture(),
    envoyIntent: {
      kind: 'war_continue',
      intentId: 'intent.a.b.0',
    },
    ...patch,
  });
}

function whiteSheet() {
  return normalizeParlayTermSheet({
    schemaVersion: 1,
    id: 'sheet.errand.1',
    errandId: 'errand.1',
    encounterId: 'encounter.1',
    episodeKey: 'episode.a.b.0',
    relationshipKey: 'edge.a.b',
    parties: ['a', 'b'],
    proposerId: 'a',
    responderId: 'b',
    victorId: 'a',
    loserId: 'b',
    agreedTick: 3,
    pictureIds: { proposer: 'picture.a', responder: 'picture.b' },
    clauses: [],
    budgetSpent: 0,
    valuations: [
      { partyId: 'a', pictureId: 'picture.a', role: 'proposer', decision: 'accept' },
      { partyId: 'b', pictureId: 'picture.b', role: 'responder', decision: 'accept' },
    ],
  });
}

function peaceOffer() {
  return {
    id: 'peace.offer.a.3',
    generatedAtTick: 3,
    severity: 0.5,
    candidateType: 'strategy_sue_for_peace',
    targetSaveId: 'a',
    relationshipKey: 'edge.a.b',
    relationshipPatch: { proposedRelationshipType: 'cold_war' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: 'edge.a.b',
      fromType: 'hostile',
      toType: 'cold_war',
      peaceOffer: true,
      offererId: 'a',
      targetId: 'b',
      peaceFrontOwnerId: 'a',
      peaceFrontSinceTick: 0,
      reason: 'A seeks peace.',
    },
  };
}

function worldWithRecord(row = record()) {
  return setSpatialLedger({
    spatialCanonVersion: 1,
    simulationRules: { ...LIT },
    deployments: { a: { targetId: 'b', sinceTick: 0 } },
  }, 'armyTransit', { a: row });
}

describe('WR-7b aggregate army picture and intent', () => {
  it('keeps the legacy transit row unchanged in shape while the six-law gate is dark', () => {
    const worldState = {
      spatialCanonVersion: 1,
      simulationRules: { warLayerEnabled: true, infoMode: 'omniscient' },
      deployments: {
        a: { targetId: 'b', sinceTick: 0, currentEffectiveStrength: 80, readiness: 0.7, supplyIntegrity: 0.8 },
      },
    };
    const out = advanceArmyTransit({ snapshot: snapshot(), worldState, digest: digest(), graph: graph(), rng: null, tick: 0 });
    const row = armyTransitLedger(out.worldState).a;
    // The liveness anchor: the row really is written and really is populated, so
    // the four absences below are a dark gate withholding its fields rather than
    // a ledger that produced no row at all.
    expect(Object.keys(row).length).toBeGreaterThan(0);
    expect(row).not.toHaveProperty('commandPicture'); // anchored: row proven populated above
    expect(row).not.toHaveProperty('envoyIntent'); // anchored: row proven populated above
    expect(row).not.toHaveProperty('carriedTermSheet'); // anchored: row proven populated above
    expect(row).not.toHaveProperty('interceptionDecision'); // anchored: row proven populated above
  });

  it('freezes one complete scalar-free command picture and an ordinary typed intent at genesis', () => {
    const worldState = {
      spatialCanonVersion: 1,
      simulationRules: { ...LIT },
      deployments: {
        a: { targetId: 'b', sinceTick: 0, currentEffectiveStrength: 80, readiness: 0.7, supplyIntegrity: 0.8 },
      },
    };
    const out = advanceArmyTransit({ snapshot: snapshot(), worldState, digest: digest(), graph: graph(), rng: null, tick: 0 });
    const row = armyTransitLedger(out.worldState).a;
    expect(normalizeNegotiationPicture(row.commandPicture)).toEqual(row.commandPicture);
    expect(row.commandPicture).toMatchObject({
      carrier: { kind: 'army', id: 'a' },
      partyId: 'a',
      counterpartId: 'b',
      relationshipKey: 'edge.a.b',
      frontOwnerId: 'a',
      frontSinceTick: 0,
    });
    expect(row.commandPicture.episodeKey).toBe(envoyOfferEpisodeKey(peaceOffer()));
    expect(row.commandPicture.episodeKey).toBe(armyNegotiationEpisodeKey({
      relationshipKey: 'edge.a.b',
      offererId: 'a',
      targetId: 'b',
      frontOwnerId: 'a',
      frontSinceTick: 0,
    }));
    expect(row.envoyIntent).toMatchObject({ kind: 'war_continue' });
    const targetSubject = row.commandPicture.subjects.find((subject) => subject.settlementId === 'b');
    expect(targetSubject).toMatchObject({
      governingArchetype: 'unknown',
      exportKnowledge: 'unknown',
      exports: [],
    });
    for (const subject of row.commandPicture.subjects) {
      for (const [key, value] of Object.entries(subject)) {
        if (key === 'exports') expect(value.every((entry) => typeof entry === 'string')).toBe(true);
        else expect(typeof value, key).toBe('string');
      }
    }
  });

  it('derives only one bounded private goal and never fabricates a plant target or lineage', () => {
    const base = { armyId: 'a', targetId: 'b', frontSinceTick: 2 };
    const terms = deriveArmyEnvoyIntent({
      ...base,
      books: { authoritySignature: 'seat.a', seatWeight01: 0.7, peaceBias01: 0.85, continueBias01: 0.1, malice01: 0.2 },
    });
    expect(terms.privateGoals).toEqual(['terms_shop']);
    const prison = deriveArmyEnvoyIntent({
      ...base,
      books: { authoritySignature: 'seat.a', patronWeight01: 0.7, peaceBias01: 0.1, continueBias01: 0.85, malice01: 0.9 },
    });
    expect(prison.privateGoals).toEqual(['imprison']);
    const ordinary = deriveArmyEnvoyIntent({ ...base, books: { settlementWeight01: 1 } });
    expect(ordinary).toMatchObject({ kind: 'war_continue' });
    expect(JSON.stringify([terms, prison, ordinary])).not.toContain('plantLineageId'); // anchored: all three intents asserted present above
    expect(deriveArmyEnvoyIntent({
      ...base,
      authoredIntent: { kind: 'private_goal', intentId: 'bad', privateGoals: ['plant', 'imprison'] },
    })).toBeNull();
  });

  it('round-trips and detaches strict sidecars from their authored aliases', () => {
    const sourcePicture = picture();
    const sourceIntent = { kind: 'war_continue', intentId: 'intent.a.b.0' };
    const row = armyRecordOf({ ...record(), commandPicture: sourcePicture, envoyIntent: sourceIntent });
    sourcePicture.subjects[0].strengthBand = 'spent';
    sourceIntent.kind = 'private_goal';
    expect(row.commandPicture.subjects[0].strengthBand).not.toBe('spent');
    expect(row.envoyIntent.kind).toBe('war_continue');
    const worldState = setSpatialLedger({ spatialCanonVersion: 1 }, 'armyTransit', { a: row });
    expect(armyTransitLedger(JSON.parse(JSON.stringify(worldState))).a).toEqual(row);
  });

  it('rejects malformed imported picture and multi-goal intent instead of refreshing or choosing a fallback', () => {
    const malformed = {
      ...record(),
      commandPicture: { ...picture(), leakedScalar: 0.42 },
      envoyIntent: { kind: 'private_goal', intentId: 'intent.bad', privateGoals: ['plant', 'imprison'] },
    };
    const worldState = setSpatialLedger({
      spatialCanonVersion: 1,
      simulationRules: { ...LIT },
      deployments: {
        a: { targetId: 'b', sinceTick: 0, currentEffectiveStrength: 80, readiness: 0.7, supplyIntegrity: 0.8 },
      },
    }, 'armyTransit', { a: malformed });
    const out = advanceArmyTransit({ snapshot: snapshot(), worldState, digest: digest(), graph: graph(), rng: null, tick: 1 });
    const row = armyTransitLedger(out.worldState).a;
    // Same anchor: the surviving row is real, so these absences prove the
    // malformed cargo was STRIPPED rather than the row having vanished with it.
    expect(Object.keys(row).length).toBeGreaterThan(0);
    expect(row).not.toHaveProperty('commandPicture'); // anchored: row proven populated above
    expect(row).not.toHaveProperty('envoyIntent'); // anchored: row proven populated above
  });
});

describe('WR-7b army picture evidence and temporal projection', () => {
  it('moves exactly one rung once per exact battle source and leaves unknown untouched', () => {
    const before = record();
    const after = applyArmyCommandPictureEvidence(before, {
      sourceId: 'battle.a.b.4',
      kind: 'battle',
      tick: 4,
      subjectId: 'b',
      field: 'strengthBand',
      direction: 'rise',
    });
    expect(after.commandPicture.subjects.find((subject) => subject.settlementId === 'b').strengthBand).toBe('ready');
    expect(after.commandPicture.mutations).toHaveLength(1);
    expect(applyArmyCommandPictureEvidence(after, {
      sourceId: 'battle.a.b.4',
      kind: 'battle',
      tick: 4,
      subjectId: 'b',
      field: 'strengthBand',
      direction: 'rise',
    })).toBe(after);
    const unknownPicture = createNegotiationPicture({
      ...picture(),
      id: 'army.picture.unknown',
      subjects: [{ settlementId: 'a' }, { settlementId: 'b' }],
      evidenceIds: [],
    });
    const unknown = record({ commandPicture: unknownPicture });
    expect(applyArmyCommandPictureEvidence(unknown, {
      sourceId: 'hall.a.5', kind: 'hall', tick: 5, subjectId: 'b', field: 'strengthBand', direction: 'rise',
    })).toBe(unknown);
  });

  it('projects the current node from the requested pre-mutation tick without advancing the persisted row', () => {
    const before = record();
    const projected = projectArmyForEnvoyEncounter(before, 2, {
      venueRef: { id: 'm', kind: 'field_node' },
    });
    expect(projected).toMatchObject({
      armyId: 'a', actorId: 'a', targetId: 'b', nodeId: 'm',
      projectedTick: 2, projectionPhase: 'pre_mutation',
      venueRef: { id: 'm', kind: 'field_node' },
      intent: { kind: 'war_continue', intentId: 'intent.a.b.0' },
    });
    expect(projected.routeId).toContain('army_route:');
    expect(before.position01).toBe(0);
    const state = worldWithRecord(before);
    expect(projectArmiesForEnvoyEncounters(state, 2, {
      venueRefFor: (nodeId) => ({ id: nodeId, kind: 'field_node' }),
    })).toEqual([projected]);
    expect(projectArmiesForEnvoyEncounters({ ...state, simulationRules: { warLayerEnabled: true } }, 2)).toEqual([]);
  });

  it('re-addresses a responder column to the exact envoy episode without refreshing its bands', () => {
    const sourcePicture = createNegotiationPicture({
      id: 'army.picture.b.a.1',
      carrier: { kind: 'army', id: 'b' },
      partyId: 'b',
      counterpartId: 'a',
      relationshipKey: 'edge.a.b',
      episodeKey: armyNegotiationEpisodeKey({
        relationshipKey: 'edge.a.b', offererId: 'b', targetId: 'a', frontOwnerId: 'b', frontSinceTick: 1,
      }),
      frontOwnerId: 'b',
      frontSinceTick: 1,
      capturedTick: 1,
      causeStatus: 'live',
      subjects: [
        { settlementId: 'a', strengthBand: 'strong' },
        { settlementId: 'b', strengthBand: 'strained', governingArchetype: 'military', alignmentPressBand: 'hard' },
      ],
      evidenceIds: ['hall.b.1'],
    });
    const responder = armyRecordOf({
      ...record(),
      armyId: 'b', originId: 'b', destId: 'a', path: ['b', 'm', 'a'],
      departTick: 1, arrivalTick: 5, lastTick: 2,
      commandPicture: sourcePicture,
      envoyIntent: { kind: 'war_continue', intentId: 'intent.b.a.1' },
    });
    const adapted = adaptArmyCommandPictureToEnvoyEpisode(responder, {
      relationshipKey: 'edge.a.b',
      offererId: 'a',
      targetId: 'b',
      frontOwnerId: 'a',
      frontSinceTick: 0,
      adaptedTick: 4,
    });
    expect(adapted.episodeKey).toBe(envoyOfferEpisodeKey(peaceOffer()));
    expect(adapted.partyId).toBe('b');
    expect(adapted.counterpartId).toBe('a');
    expect(adapted.subjects).toEqual(sourcePicture.subjects);
    expect(adapted.evidenceIds).toEqual([sourcePicture.id]);
    expect(adapted.capturedTick).toBe(4);
  });

  it('feeds a resolved field battle into each eligible frozen picture once', () => {
    let worldState = {
      spatialCanonVersion: 1,
      simulationRules: { ...LIT },
      deployments: {
        a: { targetId: 'b', sinceTick: 0, currentEffectiveStrength: 70, readiness: 0.7, supplyIntegrity: 0.8 },
        b: { targetId: 'a', sinceTick: 0, currentEffectiveStrength: 60, readiness: 0.6, supplyIntegrity: 0.8 },
      },
    };
    const rng = { fork: () => ({ random: () => 0 }) };
    worldState = advanceArmyTransit({ snapshot: snapshot(), worldState, digest: digest(), graph: graph(), rng, tick: 0 }).worldState;
    const out = advanceArmyTransit({ snapshot: snapshot(), worldState, digest: digest(), graph: graph(), rng, tick: 1 });
    expect(out.newsEntries).toHaveLength(1);
    const rows = armyTransitLedger(out.worldState);
    for (const row of Object.values(rows)) {
      const sources = row.commandPicture.mutations.map((mutation) => mutation.sourceId);
      expect(new Set(sources).size).toBe(sources.length);
      expect(row.commandPicture.mutations.some((mutation) => mutation.kind === 'battle')).toBe(true);
    }
    const newestA = rows.a.commandPicture.mutations.at(-1);
    const newestB = rows.b.commandPicture.mutations.at(-1);
    expect(newestA.sourceId).toBe(newestB.sourceId);
  });
});

describe('WR-7b interceptor dilemma on the aggregate column', () => {
  it('carry_terms stores the exact sheet and pays the existing deployment-recall cost', () => {
    const state = worldWithRecord();
    const expected = armyTransitLedger(state).a;
    const sheet = whiteSheet();
    const out = applyEnvoyInterceptionDecision({
      worldState: state,
      armyId: 'a',
      expectedRecord: expected,
      decision: { kind: 'carry_terms', encounterId: 'encounter.1', errandId: 'errand.1', termSheet: sheet },
      tick: 4,
    });
    expect(out).toMatchObject({ changed: true, reason: 'applied' });
    expect(out.worldState.deployments.a.recalled).toEqual({ cause: 'envoy_terms_carried_home', tick: 4 });
    const carried = armyTransitLedger(out.worldState).a;
    expect(carried.carriedTermSheet).toEqual(sheet);
    expect(carried.interceptionDecision).toMatchObject({
      kind: 'carry_terms', encounterId: 'encounter.1', errandId: 'errand.1', termSheetId: sheet.id,
    });
    sheet.parties[0] = 'poison';
    expect(armyTransitLedger(out.worldState).a.carriedTermSheet.parties).toEqual(['a', 'b']);
    const advanced = advanceArmyTransit({
      snapshot: snapshot(), worldState: out.worldState, digest: digest(), graph: graph(), rng: null, tick: 5,
    });
    expect(armyTransitLedger(advanced.worldState).a.carriedTermSheet.id).toBe('sheet.errand.1');
    expect(armyTransitLedger(advanced.worldState).a.interceptionDecision.termSheetId).toBe('sheet.errand.1');
    const stale = applyEnvoyInterceptionDecision({
      worldState: out.worldState,
      armyId: 'a',
      expectedRecord: expected,
      decision: { kind: 'hold_mission', encounterId: 'encounter.2', errandId: 'errand.2' },
      tick: 5,
    });
    expect(stale.worldState).toBe(out.worldState);
    expect(stale.reason).toBe('stale_record');
  });

  it('hold_mission records provenance while leaving the column and deployment mission untouched', () => {
    const state = worldWithRecord();
    const expected = armyTransitLedger(state).a;
    const out = applyEnvoyInterceptionDecision({
      worldState: state,
      armyId: 'a',
      expectedRecord: expected,
      decision: { kind: 'hold_mission', encounterId: 'encounter.hold', errandId: 'errand.hold' },
      tick: 4,
    });
    expect(out).toMatchObject({ changed: true, reason: 'applied' });
    const next = armyTransitLedger(out.worldState).a;
    const { interceptionDecision: _nextDecision, ...nextMission } = next;
    expect(nextMission).toEqual(expected);
    expect(next.interceptionDecision.kind).toBe('hold_mission');
    expect(out.worldState.deployments).toEqual(state.deployments);
  });

  it('accepts a real targeted plant only through the strict aggregate intent writer', () => {
    const state = worldWithRecord();
    const expected = armyTransitLedger(state).a;
    const intent = normalizeArmyEnvoyIntent({
      kind: 'private_goal',
      intentId: 'intent.plant.a.1',
      privateGoals: ['plant'],
      plantEligible: true,
      plantLineageId: 'plant.lineage.1',
      plantTargetErrandId: 'errand.1',
    });
    const out = applyArmyEnvoyIntent({ worldState: state, armyId: 'a', expectedRecord: expected, intent });
    expect(out).toMatchObject({ changed: true, reason: 'applied' });
    expect(projectArmiesForEnvoyEncounters(out.worldState, 1)[0].intent).toEqual(intent);
    const malformed = applyArmyEnvoyIntent({
      worldState: state,
      armyId: 'a',
      expectedRecord: expected,
      intent: { ...intent, privateGoals: ['plant', 'imprison'] },
    });
    expect(malformed.worldState).toBe(state);
    expect(malformed.changed).toBe(false);
  });
});
