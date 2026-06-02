import { describe, expect, test } from 'vitest';

import {
  buildChronicleGrounding,
  isWorldAuthoredCondition,
  worldAuthoredConditions,
  preserveWorldConditions,
} from '../../src/domain/worldPulse/index.js';

describe('AI chronicle grounding', () => {
  test('builds a PII-free grounding payload for a tick', () => {
    const wizardNews = {
      entries: [
        { tick: 4, headline: 'The Great Hunger grips the realm', summary: 'Famine spreads.', scope: 'realm', significance: 'major', settlementIds: ['a', 'b', 'c'], reasons: ['3 settlements'] },
        { tick: 4, headline: 'Ashford faction challenge', scope: 'settlement', significance: 'notable', settlementIds: ['a'] },
        { tick: 3, headline: 'Old news', scope: 'settlement', significance: 'notable', settlementIds: ['b'] },
      ],
    };
    const worldState = { tick: 4, calendar: { year: 2, season: 'winter' }, stressors: [
      { type: 'famine', label: 'Famine', severity: 0.7, lifecycleStage: 'active', affectedSettlementIds: ['a', 'b', 'c'] },
    ] };
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', activeConditions: [{ archetype: 'famine', label: 'Famine', severity: 0.7 }] }] };

    const g = buildChronicleGrounding({ wizardNews, worldState, snapshot, tick: 4 });
    expect(g.tick).toBe(4);
    expect(g.headlines).toHaveLength(2); // only tick 4
    expect(g.majorHeadlines).toContain('The Great Hunger grips the realm');
    expect(g.realmArcs.some(a => /Hunger/.test(a.headline))).toBe(true);
    expect(g.settlements[0].name).toBe('Ashford');
    expect(g.stressors[0].type).toBe('famine');
    expect(typeof g.intent).toBe('string');
  });
});

describe('pulse ↔ local reconciliation', () => {
  const prior = {
    activeConditions: [
      { archetype: 'regional_import_shortage', severity: 0.6, triggeredAt: { tick: 3, sourceEventType: 'WORLD_PULSE', sourceEventTargetId: 'a' } },
      { archetype: 'plague', severity: 0.5 }, // local, no world provenance
    ],
  };

  test('identifies world/party-authored conditions by provenance', () => {
    expect(worldAuthoredConditions(prior).map(c => c.archetype)).toEqual(['regional_import_shortage']);
    expect(isWorldAuthoredCondition({ triggeredAt: { sourceEventType: 'PARTY_ACTION' } })).toBe(true);
    expect(isWorldAuthoredCondition({ archetype: 'plague' })).toBe(false);
  });

  test('preserveWorldConditions carries world conditions across a regeneration but not local ones', () => {
    const regenerated = { name: 'Ashford', activeConditions: [{ archetype: 'corruption_exposed', severity: 0.4 }] };
    const merged = preserveWorldConditions(regenerated, prior);
    const archetypes = merged.activeConditions.map(c => c.archetype);
    expect(archetypes).toContain('regional_import_shortage'); // world-authored survives
    expect(archetypes).toContain('corruption_exposed');       // freshly regenerated kept
    expect(archetypes).not.toContain('plague');               // prior LOCAL condition dropped
  });
});
