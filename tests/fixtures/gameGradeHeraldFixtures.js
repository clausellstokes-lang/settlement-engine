/**
 * Named Game Grade fixtures for rendered Herald acceptance tests.
 *
 * These are read-model fixtures, not simulation goldens. They deliberately
 * exercise the command shell at the boundary it consumes: immutable RealmItem
 * projections with stable identities, typed attention, and explicit settlement
 * references. No fixture value is fed back into generation or tuning.
 */

function realmItem({
  id,
  headline,
  settlementId,
  tick,
  attentionClass = 'routine_record',
  significance = 0.2,
  topic = 'events',
  workflow = 'report',
  epistemicClass = 'recorded_fact',
  temporalPhase = 'historical',
  resolutionState = 'resolved',
}) {
  const blocking = attentionClass === 'blocking_decision';
  return Object.freeze({
    id,
    presentationKey: id,
    identity: Object.freeze({ state: 'authored', interactive: true }),
    source: Object.freeze({
      primaryClass: epistemicClass === 'recorded_fact' ? 'pulse_outcome' : 'proposal',
      classes: Object.freeze([
        epistemicClass === 'recorded_fact' ? 'pulse_outcome' : 'proposal',
      ]),
    }),
    headline,
    summary: `${headline} Recorded at ${settlementId}.`,
    tick,
    topic: Object.freeze({ primary: topic, tags: Object.freeze([topic]) }),
    temporal: Object.freeze({ phase: temporalPhase }),
    resolution: Object.freeze({ state: resolutionState }),
    operational: Object.freeze({ state: 'active' }),
    workflow: Object.freeze({ kind: workflow }),
    epistemic: Object.freeze({ class: epistemicClass }),
    attention: Object.freeze({
      class: attentionClass,
      blocking,
      urgency: blocking ? 1 : 0.1,
      significance,
      reason: blocking
        ? 'A recorded realm decision is unresolved and awaits the GM.'
        : attentionClass === 'routine_record'
          ? 'Recorded for reference; no immediate GM action is required.'
          : 'The recorded source marks a consequential current change.',
    }),
    subjects: Object.freeze([Object.freeze({
      kind: 'settlement',
      id: settlementId,
      name: `Settlement ${settlementId}`,
      routeable: true,
    })]),
    affectedEntities: Object.freeze([]),
    cause: Object.freeze({
      state: 'unavailable',
      available: false,
      rootRecordId: null,
      receiptId: null,
      reason: 'No recorded cause receipt is available for this source.',
    }),
    legalActions: Object.freeze([]),
    compatibility: Object.freeze({ heraldSection: topic }),
    payload: Object.freeze({ sourceRecord: Object.freeze({ id }) }),
  });
}

export function peacefulHeraldFixture() {
  const quietRecord = realmItem({
    id: 'peaceful:road-ledger',
    headline: 'The roads remain quiet',
    settlementId: 'peace-01',
    tick: 12,
  });
  return Object.freeze({
    name: 'peaceful-realm',
    settlementCount: 24,
    realmModel: Object.freeze({
      items: Object.freeze([quietRecord]),
      ranked: Object.freeze([quietRecord]),
    }),
  });
}

export function largeHistoryHeraldFixture({
  settlementCount = 24,
  historyCount = 640,
} = {}) {
  const history = Array.from({ length: historyCount }, (_, index) => realmItem({
    id: `history:${String(index).padStart(4, '0')}`,
    headline: `Recorded realm change ${String(index).padStart(4, '0')}`,
    settlementId: `settlement-${index % settlementCount}`,
    tick: index + 1,
    topic: ['war', 'faith', 'trade', 'events'][index % 4],
  }));
  const expectedTopThree = Object.freeze([
    realmItem({
      id: 'attention:01:blocking',
      headline: 'The northern council awaits a ruling',
      settlementId: 'settlement-01',
      tick: historyCount + 3,
      attentionClass: 'blocking_decision',
      significance: 0.96,
      topic: 'trade',
      workflow: 'proposal',
      epistemicClass: 'pending_decision',
      temporalPhase: 'planned',
      resolutionState: 'unresolved',
    }),
    realmItem({
      id: 'attention:02:lapsed',
      headline: 'The southern levy order has lapsed',
      settlementId: 'settlement-02',
      tick: historyCount + 2,
      attentionClass: 'lapsed_order',
      significance: 0.9,
      topic: 'war',
      workflow: 'order',
      epistemicClass: 'staged_order',
      temporalPhase: 'planned',
      resolutionState: 'unresolved',
    }),
    realmItem({
      id: 'attention:03:critical',
      headline: 'The western granaries face a critical shortage',
      settlementId: 'settlement-03',
      tick: historyCount + 1,
      attentionClass: 'critical_condition',
      significance: 0.88,
      topic: 'trade',
      temporalPhase: 'current',
      resolutionState: 'unresolved',
    }),
  ]);
  return Object.freeze({
    name: 'twenty-four-settlement-large-history',
    settlementCount,
    historyCount,
    archiveCount: historyCount + expectedTopThree.filter(
      item => item.epistemic.class === 'recorded_fact',
    ).length,
    expectedTopThreeIds: Object.freeze(expectedTopThree.map(item => item.id)),
    realmModel: Object.freeze({
      items: Object.freeze([...expectedTopThree, ...history]),
      ranked: Object.freeze([...expectedTopThree, ...history]),
    }),
  });
}
