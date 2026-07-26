import { describe, expect, test } from 'vitest';

import {
  briefingItems,
  commandViewCounts,
  decisionCaseItems,
  decisionItems,
  filterRealmItems,
  planItems,
  storyItems,
} from '../../src/components/map/heraldCommandSelectors.js';

function realmItem({
  id,
  topic = 'events',
  workflow = 'report',
  epistemic = 'recorded_fact',
  temporal = 'historical',
  resolution = 'resolved',
  attention = 'routine_record',
  significance = 0.2,
  tick = 0,
  settlementId = null,
  sourceClass = null,
}) {
  return {
    id,
    headline: id,
    summary: '',
    tick,
    topic: { primary: topic, tags: [topic] },
    workflow: { kind: workflow },
    epistemic: { class: epistemic },
    temporal: { phase: temporal },
    resolution: { state: resolution },
    attention: { class: attention, significance, reason: `${attention} reason` },
    subjects: settlementId == null ? [] : [{ kind: 'settlement', id: settlementId }],
    affectedEntities: [],
    source: sourceClass == null ? undefined : { primaryClass: sourceClass, classes: [sourceClass] },
  };
}

const proposal = realmItem({
  id: 'proposal',
  topic: 'trade',
  workflow: 'proposal',
  epistemic: 'pending_decision',
  temporal: 'planned',
  resolution: 'unresolved',
  attention: 'blocking_decision',
  significance: 0.9,
  settlementId: 's1',
});
const story = realmItem({
  id: 'war-story',
  topic: 'war',
  attention: 'major_change',
  significance: 0.8,
  tick: 8,
  settlementId: 's1',
});
const routine = realmItem({
  id: 'civic-routine',
  topic: 'events',
  tick: 9,
  settlementId: 's2',
});
const order = realmItem({
  id: 'order',
  topic: 'trade',
  workflow: 'order',
  epistemic: 'staged_order',
  temporal: 'planned',
  resolution: 'unresolved',
  attention: 'lapsed_order',
  significance: 0.4,
  settlementId: 's1',
});
const emerging = realmItem({
  id: 'pressure',
  topic: 'faith',
  temporal: 'emerging',
  attention: 'emerging_pressure',
  significance: 0.5,
});
const items = [proposal, story, routine, order, emerging];

describe('Herald command selectors', () => {
  test('keeps urgency, workflow, topic, and time as independent dimensions', () => {
    expect(briefingItems(items).map(item => item.id)).toEqual([
      'proposal', 'war-story', 'order', 'pressure',
    ]);
    expect(decisionItems(items).map(item => item.id)).toEqual(['proposal']);
    expect(planItems(items).map(item => item.id)).toEqual(['order', 'pressure']);
    expect(storyItems(items).map(item => item.id)).toEqual([
      'civic-routine', 'war-story', 'pressure',
    ]);
  });

  test('keeps terminal cases in Decisions history without inflating the pending badge', () => {
    const resolved = realmItem({
      id: 'resolved-proposal',
      workflow: 'verdict',
      epistemic: 'recorded_fact',
      resolution: 'resolved',
    });
    const decisionSet = [proposal, resolved, story];

    expect(decisionCaseItems(decisionSet).map(item => item.id)).toEqual([
      'proposal',
      'resolved-proposal',
    ]);
    expect(decisionItems(decisionSet).map(item => item.id)).toEqual(['proposal']);
    expect(commandViewCounts(decisionSet).decisions).toBe(1);
  });

  test('topic aliases narrow only Stories and preserve most-recent ordering', () => {
    expect(storyItems(items, 'war').map(item => item.id)).toEqual(['war-story']);
    expect(storyItems(items, 'events').map(item => item.id)).toEqual(['civic-routine']);
  });

  test('focus, structured query, attention, and named significance facets compose', () => {
    const nameById = new Map([['s1', 'Marchwall'], ['s2', 'Aldermoor']]);
    expect(filterRealmItems(items, { focusId: 's1' }).map(item => item.id)).toEqual([
      'proposal', 'war-story', 'order',
    ]);
    expect(filterRealmItems(items, { query: 'Marchwall', nameById }).map(item => item.id)).toEqual([
      'proposal', 'war-story', 'order',
    ]);
    expect(filterRealmItems(items, { attention: true }).map(item => item.id)).not.toContain('civic-routine');
    expect(filterRealmItems(items, { band: 'critical' }).map(item => item.id)).toEqual([
      'proposal', 'war-story',
    ]);
  });

  test('task counts describe projections without duplicating RealmItem identity', () => {
    expect(commandViewCounts(items)).toEqual({
      briefing: 4,
      stories: 3,
      plans: 2,
      decisions: 1,
    });
  });

  test('advance lens keeps current work and only each recorded source family latest tick', () => {
    const recorded = [
      realmItem({ id: 'pulse-old', sourceClass: 'pulse_outcome', tick: 2 }),
      realmItem({ id: 'pulse-latest', sourceClass: 'pulse_digest', tick: 5 }),
      realmItem({ id: 'news-old', sourceClass: 'wizard_news', tick: 1 }),
      realmItem({ id: 'news-latest', sourceClass: 'wizard_news', tick: 3 }),
      realmItem({
        id: 'live-proposal',
        sourceClass: 'proposal',
        workflow: 'proposal',
        epistemic: 'pending_decision',
        temporal: 'planned',
        resolution: 'unresolved',
        attention: 'blocking_decision',
        tick: 1,
      }),
    ];

    expect(filterRealmItems(recorded, { timeLens: 'advance' }).map(item => item.id)).toEqual([
      'pulse-latest',
      'news-latest',
      'live-proposal',
    ]);
    expect(filterRealmItems(recorded, { timeLens: 'campaign' }).map(item => item.id)).toEqual(
      recorded.map(item => item.id),
    );
  });
});
