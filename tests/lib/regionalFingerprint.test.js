/**
 * regionalFingerprint.test.js — privacy guarantee + signal for the regional /
 * intersettlement capture (Wave 2). Same canary posture: a graph/impact/channel/
 * arc loaded with settlement names + prose is fed through every extractor, and
 * none of those strings may survive.
 */

import { describe, it, expect } from 'vitest';
import {
  extractRegionalGraphSnapshot, extractRegionalImpactDecision,
  extractRegionalChannelChange, extractRegionalArcs, extractRegionalPropagation,
  extractNeighbourGenerated,
} from '../../src/lib/regionalFingerprint.js';
import { stableStringify } from '../../src/lib/structuralFingerprint.js';

const SENSITIVE = [
  'Blackmire Hollow',            // settlement name (on impacts / arcs)
  'famine struck the granary',   // impact explanation prose
  'The Great Hunger',            // arc headline prose
  'secret trade pact',           // channel evidence prose
];

const graph = {
  nodes: [{ id: 's1' }, { id: 's2' }, { id: 's3' }],
  edges: [{ from: 's1', to: 's2', relationshipType: 'allied' }],
  channels: [
    { id: 'c1', from: 's1', to: 's2', type: 'trade_dependency', status: 'confirmed', visibility: 'public', strength: 0.8, confidence: 0.7, relationshipType: 'allied', evidence: { reason: 'secret trade pact' } },
    { id: 'c2', from: 's1', to: 's3', type: 'political_authority', status: 'suggested', visibility: 'gm', relationshipType: 'channel_inferred' },
  ],
  queuedImpacts: [
    { id: 'i1', kind: 'import_shortage', channelType: 'trade_dependency', severity: 0.6, status: 'queued', waveDepth: 0, delayTicks: 1, sourceSettlementName: 'Blackmire Hollow', targetSettlementName: 'Blackmire Hollow', explanation: 'famine struck the granary', sourceChange: { kind: 'depleted' } },
  ],
};

const result = {
  tick: 5,
  wizardNews: {
    entries: [
      { kind: 'realm', impactKind: 'realm_famine', scope: 'realm', severity: 0.7, settlementIds: ['s1', 's2', 's3'], tick: 5, headline: 'The Great Hunger', summary: 'Blackmire Hollow starves' },
      { kind: 'queued', impactKind: 'import_shortage', tick: 5, headline: 'x' }, // non-arc → ignored
      { kind: 'compound', impactKind: 'compound_starving_city', scope: 'regional', severity: 0.5, settlementIds: ['s1', 's2'], tick: 5 },
      { kind: 'realm', impactKind: 'realm_old', tick: 3, settlementIds: ['s1'] }, // wrong tick → ignored
    ],
  },
};

function assertNoLeak(obj) {
  const json = stableStringify(obj);
  for (const s of SENSITIVE) expect(json, `leaked: ${s}`).not.toContain(s);
  return json;
}

describe('regionalFingerprint — redaction canary', () => {
  it('graph snapshot leaks nothing', () => assertNoLeak(extractRegionalGraphSnapshot(graph)));
  it('impact decision leaks nothing', () => assertNoLeak(extractRegionalImpactDecision(graph.queuedImpacts[0], 'applied', true)));
  it('channel change leaks nothing', () => assertNoLeak(extractRegionalChannelChange(graph.channels[0], 'suggested', 'confirmed', true)));
  it('arcs leak nothing', () => assertNoLeak(extractRegionalArcs(result)));
  it('propagation leaks nothing', () => assertNoLeak(extractRegionalPropagation({
    impacts: graph.queuedImpacts, changes: [{ kind: 'depleted', detail: 'famine struck the granary' }],
    genesis: 'canon_edit', maxDepth: 2,
  })));
});

describe('regionalFingerprint — signal is captured', () => {
  it('graph topology', () => {
    const s = extractRegionalGraphSnapshot(graph);
    expect(s).toMatchObject({
      node_count: 3, edge_count: 1, channel_count: 2,
      queued_impact_count: 1, max_channels_per_settlement: 2, topology_size_band: 'small',
    });
    expect(s.channels_by_type).toEqual({ trade_dependency: 1, political_authority: 1 });
    expect(s.channels_by_status).toEqual({ confirmed: 1, suggested: 1 });
    expect(s.channels_by_visibility).toEqual({ public: 1, gm: 1 });
    expect(s.impacts_by_kind).toEqual({ import_shortage: 1 });
  });

  it('impact decision', () => {
    expect(extractRegionalImpactDecision(graph.queuedImpacts[0], 'applied', true)).toMatchObject({
      resolution: 'applied', was_dm_action: true, impact_kind: 'import_shortage',
      channel_type: 'trade_dependency', severity_band: 'high', wave_depth: 0, source_change_kind: 'depleted',
    });
  });

  it('channel change with provenance + bands', () => {
    const a = extractRegionalChannelChange(graph.channels[0], 'suggested', 'confirmed', true);
    expect(a).toMatchObject({
      channel_type: 'trade_dependency', from_status: 'suggested', to_status: 'confirmed',
      visibility: 'public', strength_band: 'b4', provenance: 'relationship_bundle', relationship_type: 'allied', was_dm_action: true,
    });
    // an inferred channel is provenance 'channel_inferred'
    expect(extractRegionalChannelChange(graph.channels[1], 'suggested', 'confirmed', false).provenance).toBe('channel_inferred');
  });

  it('only this-tick realm/compound arcs', () => {
    const arcs = extractRegionalArcs(result);
    expect(arcs).toHaveLength(2); // realm_famine + compound (the tick-3 + the non-arc dropped)
    expect(arcs.find(a => a.signature_key === 'realm_famine')).toMatchObject({
      arc_kind: 'realm', scope: 'realm', severity_band: 'high', settlement_count: 3,
    });
    expect(arcs.find(a => a.signature_key === 'compound_starving_city')).toMatchObject({ arc_kind: 'compound', settlement_count: 2 });
  });

  it('propagation summary: genesis + direct/wave split + bands', () => {
    const p = extractRegionalPropagation({
      impacts: [
        { kind: 'import_shortage', channelType: 'trade_dependency', severity: 0.6, waveDepth: 0 },
        { kind: 'regional_wave', channelType: 'trade_dependency', severity: 0.3, waveDepth: 1 },
      ],
      changes: [{ kind: 'depleted' }, { kind: 'tier_demotion' }],
      genesis: 'world_pulse', maxDepth: 2,
    });
    expect(p).toMatchObject({
      trigger_genesis: 'world_pulse', max_depth: 2, impact_count: 2,
      direct_impact_count: 1, wave_impact_count: 1, severity_band_max: 'high', wave_depth_max: 1,
    });
    expect(p.impact_kinds).toEqual({ import_shortage: 1, regional_wave: 1 });
    expect(p.change_kinds).toEqual({ depleted: 1, tier_demotion: 1 });
  });

  it('propagation is null when nothing propagated', () => {
    expect(extractRegionalPropagation({ impacts: [], genesis: 'canon_edit' })).toBeNull();
  });

  it('neighbour-generated: bias axes + relationship, no name leak', () => {
    const settlement = {
      neighborRelationship: { name: 'Blackmire Hollow', tier: 'city', relationshipType: 'rival' },
      simulationTrace: [
        { targetId: 'neighbour.Blackmire Hollow.rival', targetType: 'condition', downstreamEffects: [
          { target: 'economicState', effect: 'neighbour econ bias applied' },
          { target: 'effectiveScores', effect: 'relationship modifies military/economy scores' },
        ] },
      ],
    };
    const n = extractNeighbourGenerated(settlement);
    expect(n).toMatchObject({ relationship_type: 'rival', neighbour_tier: 'city', had_mechanical_effect: true });
    expect(n.bias_axes.sort()).toEqual(['economicState', 'effectiveScores']);
    expect(stableStringify(n)).not.toContain('Blackmire Hollow');
    // a no-bias neighbour reports had_mechanical_effect false
    const inert = extractNeighbourGenerated({ neighborRelationship: { relationshipType: 'neutral', tier: 'town' },
      simulationTrace: [{ targetId: 'neighbour.X.neutral', downstreamEffects: [{ target: 'generation', effect: 'no mechanical bias' }] }] });
    expect(inert.had_mechanical_effect).toBe(false);
    expect(extractNeighbourGenerated({})).toBeNull();
  });

  it('handles null graph / empty result', () => {
    expect(extractRegionalGraphSnapshot(null)).toBeNull();
    expect(extractRegionalArcs({})).toEqual([]);
  });
});
