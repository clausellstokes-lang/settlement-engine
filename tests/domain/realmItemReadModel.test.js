/**
 * G-3 RealmItem contract pins.
 *
 * These fixtures test the architectural laws rather than a particular Herald
 * card: source records remain authoritative, dimensions remain independent,
 * identity is source-specific, deduplication requires proof, and presentation
 * state never leaks back into campaign truth.
 */
import { describe, expect, it } from 'vitest';

import {
  buildRealmItemReadModel,
  rankRealmItems,
  realmItemReadState,
} from '../../src/domain/realm/realmItemReadModel.js';
import {
  realmSourceFingerprint,
  stableRealmClone,
} from '../../src/domain/realm/realmItemIdentity.js';
import { operationFor } from '../../src/store/operationRegistry.js';

function campaignWith(worldState = {}, extra = {}) {
  return {
    id: 'realm-a',
    settlementIds: ['ashford', 'brookmere'],
    worldState: { tick: 12, ...worldState },
    ...extra,
  };
}

function itemFrom(model, sourceClass) {
  return model.items.find(item => item.source.classes.includes(sourceClass));
}

describe('RealmItem source identity and immutability', () => {
  it('fingerprints equivalent records independently of object-key insertion order', () => {
    const left = { id: 'same', nested: { b: 2, a: 1 }, tags: ['war', 'current'] };
    const right = { tags: ['war', 'current'], nested: { a: 1, b: 2 }, id: 'same' };

    expect(realmSourceFingerprint(left)).toBe(realmSourceFingerprint(right));
    expect(stableRealmClone(left)).toEqual(stableRealmClone(right));
  });

  it('scopes otherwise identical source identities to their owning campaign', () => {
    const source = { proposals: [{ id: 'shared-id', status: 'pending' }] };
    const first = buildRealmItemReadModel({ id: 'realm-one', worldState: source }).items[0];
    const second = buildRealmItemReadModel({ id: 'realm-two', worldState: source }).items[0];

    expect(first.id).not.toBe(second.id);
    expect(first.identity.owner).toEqual({ kind: 'campaign', id: 'realm-one' });
    expect(second.identity.owner).toEqual({ kind: 'campaign', id: 'realm-two' });
  });

  it('accounts for every pilot source without freezing or mutating campaign truth', () => {
    const campaign = campaignWith({
      pulseHistory: [{
        id: 'pulse-12',
        tick: 12,
        selectedOutcomes: [{ id: 'outcome-a', candidateType: 'field_battle', headline: 'The ford was contested.' }],
        impactDigest: [{ id: 'digest-a', impactKind: 'route_disruption', headline: 'The east road closed.' }],
        resolvedStressors: [{ id: 'resolved-a', type: 'famine', label: 'The lean season ended.' }],
      }],
      stressors: [{ id: 'live-a', type: 'siege', label: 'Walls under pressure', severity: 0.8 }],
      proposals: [{ id: 'proposal-a', status: 'pending', outcome: { candidateType: 'treaty_signed' } }],
      pausedAdvance: { pendingMajors: [{ id: 'paused-only', candidateType: 'government_change' }] },
      pendingEvents: [{ queueId: 'queue-a', saveId: 'ashford', event: { type: 'OPENED_TRADE_ROUTE' } }],
    }, {
      wizardNews: {
        entries: [{ id: 'news-a', kind: 'applied', impactKind: 'import_shortage', headline: 'Imports dwindled.' }],
      },
    });
    const before = structuredClone(campaign);

    const model = buildRealmItemReadModel(campaign);

    expect(model.counts.total).toBe(8);
    expect(model.counts.bySource).toEqual({
      docket_order: 1,
      live_stressor: 1,
      paused_major: 1,
      proposal: 1,
      pulse_digest: 1,
      pulse_outcome: 1,
      pulse_resolved_stressor: 1,
      wizard_news: 1,
    });
    expect(campaign).toEqual(before);
    expect(Object.isFrozen(campaign)).toBe(false);
    expect(Object.isFrozen(model)).toBe(true);
    expect(Object.isFrozen(model.items)).toBe(true);
    expect(model.items.every(item => Object.isFrozen(item) && Object.isFrozen(item.source.records[0].record))).toBe(true);
    expect(itemFrom(model, 'pulse_outcome').source.records[0].record)
      .not.toBe(campaign.worldState.pulseHistory[0].selectedOutcomes[0]);
  });

  it('accounts for malformed pilot inputs as explicit exclusions instead of dropping them silently', () => {
    const model = buildRealmItemReadModel(campaignWith({
      pulseHistory: { not: 'an array' },
      stressors: [null],
      proposals: { id: 'not-an-array' },
    }));

    expect(model.items).toHaveLength(0);
    expect(model.exclusions).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourceClass: 'pulse', reason: 'Pulse history is not an array.' }),
      expect.objectContaining({ sourceClass: 'live_stressor', index: 0, reason: 'Source entry is not a record.' }),
      expect.objectContaining({ sourceClass: 'proposal', reason: 'Source collection is not an array.' }),
    ]));
  });
});

describe('RealmItem independent dimensions and provenance', () => {
  it('represents one source as Trade + emerging + blocking proposal without duplication (HER-04)', () => {
    const campaign = campaignWith({
      proposals: [{
        id: 'trade-verdict',
        status: 'pending',
        settlementId: 'ashford',
        outcome: {
          candidateType: 'trade_embargo_declared',
          stressor: { lifecycleStage: 'emerging' },
          severity: 0.62,
        },
      }],
    });

    const model = buildRealmItemReadModel(campaign, {
      saves: [{ id: 'ashford', settlement: { id: 'ashford', name: 'Ashford' } }],
    });
    const [item] = model.items;

    expect(model.items).toHaveLength(1);
    expect(item.topic.primary).toBe('trade');
    expect(item.temporal.phase).toBe('emerging');
    expect(item.resolution.state).toBe('unresolved');
    expect(item.workflow.kind).toBe('proposal');
    expect(item.epistemic.class).toBe('pending_decision');
    expect(item.attention).toMatchObject({
      class: 'blocking_decision',
      blocking: true,
      urgency: 1,
    });
    expect(model.counts.blocking).toBe(1);
    expect(model.counts.byAttention.blocking_decision).toBe(1);
    expect(item.compatibility.heraldSection).toBe('adjudication');
    expect(item.subjects[0]).toMatchObject({
      kind: 'settlement',
      id: 'ashford',
      name: 'Ashford',
      routeable: true,
    });
  });

  it('keeps distinct anonymous, same-kind, same-tick identities stable across reorder (HER-06)', () => {
    const east = { candidateType: 'hostile_raid', headline: 'Raiders crossed the east border.' };
    const west = { candidateType: 'hostile_raid', headline: 'Raiders crossed the west border.' };
    const forward = campaignWith({
      pulseHistory: [{
        tick: 12,
        selectedOutcomes: [east, west],
        impactDigest: [],
      }],
    });
    const reversed = campaignWith({
      pulseHistory: [{
        tick: 12,
        selectedOutcomes: [west, east],
        impactDigest: [],
      }],
    });

    const forwardItems = buildRealmItemReadModel(forward).items;
    const reversedItems = buildRealmItemReadModel(reversed).items;
    const idsByHeadline = items => Object.fromEntries(items.map(item => [item.headline, item.id]));

    expect(forwardItems).toHaveLength(2);
    expect(new Set(forwardItems.map(item => item.id)).size).toBe(2);
    expect(idsByHeadline(reversedItems)).toEqual(idsByHeadline(forwardItems));
    expect(forwardItems.every(item => item.diagnostics.some(d => d.code === 'fallback_source_identity'))).toBe(true);
  });

  it('preserves each Wizard News entry authored tick instead of stamping the feed current tick', () => {
    const campaign = campaignWith({}, {
      wizardNews: {
        currentTick: 12,
        entries: [
          { id: 'old-news', tick: 4, kind: 'applied', impactKind: 'route_disruption' },
          { id: 'latest-news', tick: 12, kind: 'applied', impactKind: 'import_shortage' },
          { id: 'legacy-news', kind: 'resolved', impactKind: 'service_disruption' },
        ],
      },
    });

    const newsItems = buildRealmItemReadModel(campaign).items
      .filter(item => item.source.classes.includes('wizard_news'));
    const ticksById = Object.fromEntries(newsItems.map(item => [item.source.originKey, item.tick]));

    expect(ticksById).toEqual({
      'wizard_news:latest-news': 12,
      'wizard_news:legacy-news': 12,
      'wizard_news:old-news': 4,
    });
  });

  it('preserves indistinguishable anonymous collisions only as visibly degraded projections', () => {
    const identical = {
      candidateType: 'hostile_raid',
      headline: 'Raiders crossed the border.',
      settlementId: 'ashford',
    };
    const campaign = campaignWith({
      pulseHistory: [{
        tick: 12,
        selectedOutcomes: [{ ...identical }, { ...identical }],
        impactDigest: [],
      }],
    });

    const model = buildRealmItemReadModel(campaign, {
      saves: [{ id: 'ashford', settlement: { id: 'ashford', name: 'Ashford' } }],
    });

    expect(model.items).toHaveLength(2);
    expect(new Set(model.items.map(item => item.id)).size).toBe(1);
    expect(new Set(model.items.map(item => item.presentationKey)).size).toBe(2);
    expect(model.items.every(item => item.identity.state === 'degraded_collision')).toBe(true);
    expect(model.items.every(item => item.identity.interactive === false)).toBe(true);
    expect(model.items.every(item => item.subjects[0].routeable === false)).toBe(true);
    expect(model.items.every(item => item.diagnostics.some(d => d.code === 'anonymous_identity_collision'))).toBe(true);
    expect(model.diagnostics.some(d => d.code === 'anonymous_identity_collision')).toBe(true);
  });

  it('merges proposal and paused-verdict projections only when a shared origin ID proves identity (HER-05)', () => {
    const campaign = campaignWith({
      proposals: [{
        id: 'major-a',
        status: 'pending',
        headline: 'The council may fall.',
        outcome: { candidateType: 'government_change', settlementId: 'ashford' },
      }],
      pausedAdvance: {
        id: 'advance-12',
        pendingMajors: [{
          id: 'major-a',
          headline: 'The council may fall.',
          outcome: { candidateType: 'government_change', settlementId: 'ashford' },
        }],
      },
    });

    const model = buildRealmItemReadModel(campaign);
    const [item] = model.items;

    expect(model.items).toHaveLength(1);
    expect(item.id).toBe('realm-item:realm-a:decision:major-a');
    expect(item.source.classes).toEqual(['paused_major', 'proposal']);
    expect(item.source.records).toHaveLength(2);
    expect(item.workflow.kind).toBe('verdict');
    expect(item.attention.blocking).toBe(true);
    expect(item.legalActions.map(action => action.actionId)).toEqual([
      'keep-paused-major',
      'dismiss-paused-major',
    ]);
    expect(model.counts.bySource).toMatchObject({ proposal: 1, paused_major: 1 });
  });

  it('retains conflicting reuse of one source ID as two items and emits diagnostics', () => {
    const first = { id: 'collision', status: 'pending', headline: 'First', outcome: { candidateType: 'treaty_signed' } };
    const second = { id: 'collision', status: 'pending', headline: 'Second', outcome: { candidateType: 'field_battle' } };
    const campaign = campaignWith({ proposals: [first, second] });

    const model = buildRealmItemReadModel(campaign);
    const reversed = buildRealmItemReadModel(campaignWith({ proposals: [second, first] }));
    const orderedProjection = result => result.map(item => [item.presentationKey, item.headline]);

    expect(model.items).toHaveLength(2);
    expect(new Set(model.items.map(item => item.id)).size).toBe(1);
    expect(new Set(model.items.map(item => item.presentationKey)).size).toBe(2);
    expect(model.items.every(item => item.identity.state === 'degraded_collision')).toBe(true);
    expect(model.items.every(item => item.legalActions.every(action => action.availability.available === false))).toBe(true);
    expect(model.diagnostics.some(diagnostic => diagnostic.code === 'source_identity_collision')).toBe(true);
    expect(model.items.every(item => item.diagnostics.some(diagnostic => diagnostic.code === 'source_identity_collision'))).toBe(true);
    expect(orderedProjection(reversed.items)).toEqual(orderedProjection(model.items));
    expect(orderedProjection(reversed.ranked)).toEqual(orderedProjection(model.ranked));
  });

  it('never fabricates a cause and visibly degrades a deleted settlement subject (HER-07 model contract)', () => {
    const campaign = campaignWith({
      stressors: [
        { id: 'orphan', type: 'plague', settlementId: 'deleted-save' },
        { id: 'dangling-cause', type: 'famine', sourceEventId: 'missing-receipt' },
      ],
    });

    const model = buildRealmItemReadModel(campaign, { saves: [] });
    const orphan = model.items.find(item => item.source.originKey.endsWith(':orphan'));
    const dangling = model.items.find(item => item.source.originKey.endsWith(':dangling-cause'));

    expect(orphan.cause).toMatchObject({
      state: 'unavailable',
      available: false,
      rootRecordId: null,
      receiptId: null,
      reason: 'No recorded cause receipt is available for this source.',
      inWorldTick: 12,
      provenance: {
        sourceClass: 'live_stressor',
        sourceOriginKey: 'live_stressor:orphan',
      },
    });
    expect(orphan.subjects[0]).toMatchObject({
      routeable: false,
      fallbackLabel: 'A settlement no longer in this campaign',
    });
    expect(orphan.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'missing_settlement_subject', subjectId: 'deleted-save' }),
    ]));
    expect(dangling.cause).toMatchObject({
      state: 'degraded',
      available: false,
      rootRecordId: 'missing-receipt',
      receiptId: 'missing-receipt',
    });
  });

  it('exposes an indexed pulse story as a traceable partial root, but not an unindexed record', () => {
    const campaign = campaignWith({
      pulseHistory: [{
        id: 'pulse-12',
        tick: 12,
        selectedOutcomes: [{ id: 'indexed-root', candidateType: 'field_battle' }],
        impactDigest: [],
      }],
      stressors: [{ id: 'unindexed-record', type: 'siege' }],
    });

    const model = buildRealmItemReadModel(campaign);
    const indexed = model.items.find(item => item.source.originKey.endsWith(':indexed-root'));
    const unindexed = model.items.find(item => item.source.originKey.endsWith(':unindexed-record'));

    expect(indexed.cause).toMatchObject({
      state: 'partial',
      available: true,
      rootRecordId: 'indexed-root',
      receiptId: 'indexed-root',
      reason: 'The pulse story is indexed, but the ledger records no deeper cause edge.',
    });
    expect(unindexed.cause).toMatchObject({
      state: 'unavailable',
      available: false,
      rootRecordId: null,
      receiptId: null,
    });
  });

  it('does not expose a mechanical audit root as a public recorded cause edge', () => {
    const model = buildRealmItemReadModel(campaignWith({
      stressors: [{
        id: 'public-stressor',
        type: 'siege',
        sourceEventId: 'mechanical.population.ashford.12',
      }],
      spatialLedgers: {
        provenance: {
          'mechanical.population.ashford.12': {
            parents: [],
            type: 'population_growth',
            tick: 12,
            receiptClass: 'mechanical',
          },
        },
      },
    }));
    const item = model.items.find(entry =>
      entry.source.originKey.endsWith(':public-stressor'));
    expect(item.cause).toMatchObject({
      state: 'degraded',
      available: false,
      rootRecordId: 'mechanical.population.ashford.12',
      receiptId: 'mechanical.population.ashford.12',
    });
  });
});

describe('RealmItem actions, operational truth, attention, and read state', () => {
  it('treats a terminally refused proposal as resolved rather than asking twice', () => {
    const model = buildRealmItemReadModel(campaignWith({
      proposals: [{
        id: 'proposal-refused',
        status: 'refused',
        headline: 'The order met a legal refusal.',
      }],
    }));
    const [item] = model.items;

    expect(item.resolution.state).toBe('resolved');
    expect(item.workflow.kind).toBe('verdict');
    expect(item.attention.class).not.toBe('blocking_decision');
    expect(item.legalActions).toEqual([]);
  });

  it('links command descriptors to the existing operation census', () => {
    const model = buildRealmItemReadModel(campaignWith({
      proposals: [{ id: 'proposal-1', status: 'pending', headline: 'Choose.' }],
    }));
    const commandActions = model.items
      .flatMap(item => item.legalActions)
      .filter(action => action.actionType === 'command');

    expect(commandActions.length).toBeGreaterThan(0);
    for (const action of commandActions) {
      expect(action.operationId).toBeTruthy();
      expect(operationFor(action.operationId)).not.toBeNull();
    }
  });

  it('marks a staged order with a missing target as lapsed and exposes typed, revalidated actions', () => {
    const campaign = campaignWith({
      pendingEvents: [{
        queueId: 'queue-orphan',
        saveId: 'deleted-save',
        event: { type: 'OPENED_TRADE_ROUTE', targetId: 'brookmere' },
      }],
    });

    const model = buildRealmItemReadModel(campaign, { saves: [], canUseCustom: false });
    const [item] = model.items;

    expect(item.operational).toMatchObject({ state: 'lapsed', assessed: true });
    expect(item.attention).toMatchObject({ class: 'lapsed_order', blocking: false });
    expect(item.legalActions).toEqual([
      expect.objectContaining({
        actionId: 'edit-docket-order',
        actionType: 'navigation',
        adapterKey: 'realmDocket.openSettlementComposer',
        operationId: null,
        revalidateOnInvoke: true,
      }),
      expect.objectContaining({
        actionId: 'cancel-docket-order',
        actionType: 'command',
        adapterKey: 'cancelQueuedEvent',
        operationId: 'cancelQueuedEvent',
        revalidateOnInvoke: true,
      }),
    ]);
  });

  it('ranks deterministically from independent attention facts, never source array order', () => {
    const campaign = campaignWith({
      pulseHistory: [{
        id: 'pulse',
        tick: 11,
        selectedOutcomes: [
          { id: 'routine', candidateType: 'tradition_change', severity: 0.2 },
          { id: 'major', candidateType: 'field_battle', severity: 0.9 },
        ],
        impactDigest: [],
      }],
      stressors: [
        { id: 'emerging', type: 'famine', lifecycleStage: 'emerging', severity: 0.5 },
        { id: 'critical', type: 'siege', lifecycleStage: 'active', severity: 0.82 },
      ],
      proposals: [{ id: 'blocking', status: 'pending', outcome: { candidateType: 'government_change' } }],
      pendingEvents: [{ queueId: 'lapsed', saveId: 'missing', event: { type: 'OPENED_TRADE_ROUTE' } }],
    });
    const options = { saves: [], canUseCustom: false };

    const model = buildRealmItemReadModel(campaign, options);
    const classes = model.ranked.map(item => item.attention.class);
    const reversedRank = rankRealmItems([...model.items].reverse()).map(item => item.id);

    expect(classes).toEqual([
      'blocking_decision',
      'lapsed_order',
      'critical_condition',
      'major_change',
      'emerging_pressure',
      'routine_record',
    ]);
    expect(reversedRank).toEqual(model.ranked.map(item => item.id));
  });

  it('keeps session-local read state outside canonical envelopes', () => {
    const model = buildRealmItemReadModel(campaignWith({
      pulseHistory: [{
        id: 'pulse',
        tick: 12,
        selectedOutcomes: [{ id: 'one', candidateType: 'tradition_change' }],
        impactDigest: [{ id: 'two', impactKind: 'route_disruption' }],
      }],
    }));
    const before = structuredClone(model.items);
    const state = realmItemReadState(model.items, [model.items[0].id]);

    expect(state[model.items[0].id]).toEqual({ read: true });
    expect(state[model.items[1].id]).toEqual({ read: false });
    expect(Object.isFrozen(state)).toBe(true);
    expect(model.items).toEqual(before);
    expect(model.items.every(item => !Object.prototype.hasOwnProperty.call(item, 'read'))).toBe(true);
  });
});
