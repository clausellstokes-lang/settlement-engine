import { describe, expect, it } from 'vitest';

import { buildRegionalMapOverlay } from '../../src/lib/regionalMapOverlay.js';
import { ensureRegionalGraph, normalizeGoodsList } from '../../src/domain/region/index.js';

describe('buildRegionalMapOverlay()', () => {
  it('projects confirmed channels and regional impacts onto settlement placements', () => {
    const campaign = {
      regionalGraph: ensureRegionalGraph({
        nodes: [
          { id: 'a', name: 'Aford' },
          { id: 'b', name: 'Bristle' },
        ],
        channels: [{
          id: 'channel.trade_dependency.a.b.grain',
          type: 'trade_dependency',
          from: 'a',
          to: 'b',
          status: 'confirmed',
          goods: normalizeGoodsList(['Grain']),
        }],
        queuedImpacts: [{
          id: 'regional_impact.a',
          kind: 'import_shortage',
          sourceSettlementId: 'a',
          targetSettlementId: 'b',
          channelId: 'channel.trade_dependency.a.b.grain',
          severity: 0.7,
          status: 'queued',
        }],
      }),
    };
    const placements = {
      one: { settlementId: 'a', x: 10, y: 20 },
      two: { settlementId: 'b', x: 30, y: 40 },
    };

    const overlay = buildRegionalMapOverlay({ campaign, placements });

    expect(overlay.channels).toHaveLength(1);
    expect(overlay.channels[0].fromPoint).toEqual({ x: 10, y: 20 });
    expect(overlay.channels[0].toPoint).toEqual({ x: 30, y: 40 });
    expect(overlay.impacts).toHaveLength(1);
    expect(overlay.impacts[0].point).toEqual({ x: 30, y: 40 });
  });

  it('can hide GM-only channels while keeping public channels visible', () => {
    const campaign = {
      regionalGraph: ensureRegionalGraph({
        channels: [
          { id: 'public', type: 'trade_route', from: 'a', to: 'b', status: 'confirmed', visibility: 'public' },
          { id: 'gm', type: 'criminal_corridor', from: 'a', to: 'c', status: 'confirmed', visibility: 'gm' },
        ],
      }),
    };
    const placements = {
      one: { settlementId: 'a', x: 0, y: 0 },
      two: { settlementId: 'b', x: 10, y: 0 },
      three: { settlementId: 'c', x: 20, y: 0 },
    };

    const overlay = buildRegionalMapOverlay({ campaign, placements, includeGm: false });

    expect(overlay.channels.map(c => c.id)).toEqual(['public']);
  });

  it('filters regional channels and impacts by type, status, and severity', () => {
    const campaign = {
      regionalGraph: ensureRegionalGraph({
        channels: [
          { id: 'trade', type: 'trade_route', from: 'a', to: 'b', status: 'confirmed', visibility: 'public' },
          { id: 'war', type: 'war_front', from: 'a', to: 'c', status: 'confirmed', visibility: 'public' },
        ],
        queuedImpacts: [
          { id: 'queued-low', kind: 'route_disruption', sourceSettlementId: 'a', targetSettlementId: 'b', severity: 0.3, status: 'queued' },
          { id: 'applied-high', kind: 'conflict_pressure', sourceSettlementId: 'a', targetSettlementId: 'c', severity: 0.8, status: 'applied' },
          { id: 'resolved-high', kind: 'conflict_pressure', sourceSettlementId: 'a', targetSettlementId: 'c', severity: 0.9, status: 'resolved' },
        ],
      }),
    };
    const placements = {
      one: { settlementId: 'a', x: 0, y: 0 },
      two: { settlementId: 'b', x: 10, y: 0 },
      three: { settlementId: 'c', x: 20, y: 0 },
    };

    const overlay = buildRegionalMapOverlay({
      campaign,
      placements,
      channelTypes: ['war_front'],
      impactStatuses: ['applied'],
      minSeverity: 0.7,
    });

    expect(overlay.channels.map(c => c.id)).toEqual(['war']);
    expect(overlay.impacts.map(i => i.id)).toEqual(['applied-high']);
  });
});
