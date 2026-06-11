import { describe, expect, test } from 'vitest';

import {
  deriveSettlementPressures,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

// H5 pins: conditions feed pressures by archetype id ONLY. Label/description
// prose must never score ('Warehouse collapse' is not a war), custom_crisis
// contributes via its catalog affectedSystems, and reason strings name the
// real matched archetypes.

function item(id, activeConditions = [], scores = {}) {
  return { id, name: id, activeConditions, causal: { scores } };
}

function indexFor(items, regionalGraph = { edges: [], channels: [] }) {
  const snapshot = {
    worldState: { calendar: { season: 'summer' }, relationshipStates: {} },
    regionalGraph,
    settlements: items,
    byId: new Map(items.map(entry => [String(entry.id), entry])),
  };
  return pressureIndex(deriveSettlementPressures(snapshot));
}

const KINDS = ['food', 'disease', 'conflict', 'trade', 'economy', 'legitimacy', 'defense', 'crime'];

describe('pressure model — condition matching by archetype id', () => {
  test('label/description prose never scores: a Warehouse collapse is not a war', () => {
    const prose = item('prose', [{
      archetype: 'stressor_residual',
      label: 'Warehouse collapse',
      description: 'Everyone is afraid of war, siege, famine, plague, corruption and criminal routes.',
    }]);
    const idx = indexFor([item('bare'), prose]);

    for (const kind of KINDS) {
      expect(idx.get('prose', kind).score).toBeCloseTo(idx.get('bare', kind).score, 10);
    }
    // No fabricated reason string reaches the DM-facing surfaces.
    for (const kind of KINDS) {
      expect(idx.get('prose', kind).reasons.join(' ')).not.toMatch(/active condition/);
    }
  });

  test('a real war archetype boosts conflict and defense, and the reason names it', () => {
    const idx = indexFor([item('bare'), item('war', [{ archetype: 'war_pressure' }])]);

    expect(idx.get('war', 'conflict').score).toBeCloseTo(idx.get('bare', 'conflict').score + 0.18, 10);
    expect(idx.get('war', 'conflict').reasons.join(' ')).toContain('war_pressure');
    expect(idx.get('war', 'defense').score).toBeCloseTo(idx.get('bare', 'defense').score + 0.16, 10);
    expect(idx.get('war', 'defense').reasons.join(' ')).toContain('war_pressure');
  });

  test('siege_lifted is a recovery condition — it must not read as an active siege', () => {
    const idx = indexFor([item('bare'), item('lifted', [{ archetype: 'siege_lifted' }])]);

    for (const kind of KINDS) {
      expect(idx.get('lifted', kind).score).toBeCloseTo(idx.get('bare', kind).score, 10);
    }
  });

  test('custom_crisis contributes through its affectedSystems, never its prose', () => {
    const foodCrisis = item('foodCrisis', [{
      archetype: 'custom_crisis',
      label: 'The war of the granaries', // prose must stay inert
      affectedSystems: ['food_security'],
    }]);
    const trustCrisis = item('trustCrisis', [{
      archetype: 'custom_crisis',
      affectedSystems: ['social_trust'],
    }]);
    const idx = indexFor([item('bare'), foodCrisis, trustCrisis]);

    expect(idx.get('foodCrisis', 'food').score).toBeCloseTo(idx.get('bare', 'food').score + 0.18, 10);
    expect(idx.get('foodCrisis', 'food').reasons.join(' ')).toContain('custom_crisis');
    expect(idx.get('foodCrisis', 'conflict').score).toBeCloseTo(idx.get('bare', 'conflict').score, 10);
    expect(idx.get('trustCrisis', 'food').score).toBeCloseTo(idx.get('bare', 'food').score, 10);
  });

  test('vassal_extraction is commerce, not war: trade/economy pressure rises, conflict stays flat', () => {
    // R3 decision: tribute drains wealth — the vassal_extraction archetype
    // joins the economy/trade pressure class and must never read as conflict.
    const idx = indexFor([item('bare'), item('vassal', [{ archetype: 'vassal_extraction' }])]);

    expect(idx.get('vassal', 'trade').score).toBeCloseTo(idx.get('bare', 'trade').score + 0.16, 10);
    expect(idx.get('vassal', 'economy').score).toBeCloseTo(idx.get('bare', 'economy').score + 0.14, 10);
    // The reason strings name the real archetype.
    expect(idx.get('vassal', 'trade').reasons.join(' ')).toContain('vassal_extraction');
    expect(idx.get('vassal', 'economy').reasons.join(' ')).toContain('vassal_extraction');
    // Zero conflict (and defense) pressure: tribute is not a war.
    expect(idx.get('vassal', 'conflict').score).toBeCloseTo(idx.get('bare', 'conflict').score, 10);
    expect(idx.get('vassal', 'defense').score).toBeCloseTo(idx.get('bare', 'defense').score, 10);
  });

  test('a trade-dependency supplier is in a food crisis only by archetype', () => {
    const supplier = item('s', [{ archetype: 'famine' }]);
    const proseSupplier = item('p', [{
      archetype: 'stressor_residual',
      label: 'Famine remembrance feast',
      description: 'famine import_shortage food_anchor',
    }]);
    const dependent = item('d');
    const proseDependent = item('pd');
    const idx = indexFor([supplier, proseSupplier, dependent, proseDependent], {
      edges: [],
      channels: [
        { type: 'trade_dependency', from: 's', to: 'd', status: 'confirmed' },
        { type: 'trade_dependency', from: 'p', to: 'pd', status: 'confirmed' },
      ],
    });

    expect(idx.get('d', 'food').score).toBeCloseTo(idx.get('pd', 'food').score + 0.12, 10);
    expect(idx.get('d', 'food').reasons.join(' ')).toContain('supplier is in a food crisis');
    expect(idx.get('pd', 'food').reasons.join(' ')).not.toContain('supplier is in a food crisis');
  });
});
