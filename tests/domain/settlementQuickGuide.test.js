/**
 * Contract for the compact 1 / 3 / 1 / 3 / 1 settlement read-model.
 *
 * This is intentionally independent of the presentation surfaces. The same
 * immutable selection must drive Summary, Table View, Session Mode, and PDF.
 */

import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeSettlementQuickGuide } from '../../src/domain/summary/settlementQuickGuide.js';

function completeSettlement() {
  return generateSettlementPipeline(
    {
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      priorityEconomy: 70,
    },
    null,
    { seed: 'settlement-quick-guide', customContent: {} },
  );
}

describe('composeSettlementQuickGuide', () => {
  it('composes one identity, three truths, one pressure, three people, and one entry point', () => {
    const guide = composeSettlementQuickGuide(completeSettlement());

    expect(guide.version).toBe(1);
    expect(guide.identitySentence).toMatch(/\.$/);
    expect(guide.definingTruths.map((truth) => truth.id)).toEqual([
      'foundation',
      'authority',
      'material_life',
    ]);
    expect(guide.immediatePressure.id).toBe('immediate_pressure');
    expect(guide.importantPeople).toHaveLength(3);
    expect(guide.entryPoint.id).toBe('entry_point');

    for (const item of [
      ...guide.definingTruths,
      guide.immediatePressure,
      ...guide.importantPeople,
      guide.entryPoint,
    ]) {
      expect(item.sourcePath).toBeTruthy();
    }
  });

  it('is deterministic and never mutates the generated settlement', () => {
    const settlement = completeSettlement();
    const before = JSON.stringify(settlement);

    const first = composeSettlementQuickGuide(settlement);
    const second = composeSettlementQuickGuide(settlement);

    expect(second).toEqual(first);
    expect(JSON.stringify(settlement)).toBe(before);
  });

  it('uses final power and canonical hook rankings rather than roster order', () => {
    const guide = composeSettlementQuickGuide({
      name: 'Hollowmere',
      tier: 'village',
      npcs: [
        { id: 'low', name: 'Low', power: 2, role: 'Miller', plotHooks: ['A quiet request'] },
        { id: 'high', name: 'High', power: 9, role: 'Reeve', plotHooks: ['The levy vanished'] },
        { id: 'mid', name: 'Mid', power: 5, role: 'Priest' },
      ],
      conflicts: [{
        intensity: 'high',
        parties: ['Guild', 'Council'],
        plotHooks: ['The council chamber is occupied before dawn'],
      }],
    });

    expect(guide.importantPeople.map((person) => person.name)).toEqual([
      'High',
      'Mid',
      'Low',
    ]);
    expect(guide.entryPoint.text).toContain('council chamber');
  });

  it('degrades honestly for sparse and legacy records', () => {
    const guide = composeSettlementQuickGuide({ name: 'Barebones' });

    expect(guide.identitySentence).toBe('Barebones is a settlement.');
    expect(guide.definingTruths).toHaveLength(3);
    expect(guide.importantPeople).toEqual([]);
    expect(guide.immediatePressure.text).toContain('currently recorded');
    expect(guide.entryPoint.text).toContain('currently recorded');
  });

  it('recognizes the actual conflict prose keys when pressureSentence is absent', () => {
    const guide = composeSettlementQuickGuide({
      conflicts: [{ desc: 'The guild has barricaded the counting house.' }],
    });

    expect(guide.immediatePressure.text).toBe(
      'The guild has barricaded the counting house.',
    );
    expect(guide.immediatePressure.sourcePath).toBe('conflicts[0]');
  });
});
