/**
 * tests/domain/regionalNeighbourSeam.test.js — Regional wave R3: the
 * neighbour seam (H10/H11/H12) + the delegated decisions (curation-grade
 * bundle re-confirm, vassal cascade Wizard News).
 *
 * Pins:
 *  H12 — 'trade_partner' is the canonical label. A LEGACY save carrying the
 *    plural 'trade_partners' still mints the full 4-channel trade bundle,
 *    reads as a trade_partner edge at the graph boundary, and counts in the
 *    stressor ally checks. (The producer-side pin — the Opened Trade Route
 *    event writes the singular — lives in tests/domain/events/
 *    relationshipEvents.test.js next to the mutation it pins.)
 *  H11 — a pulse relationship label outcome writes back to BOTH settlements'
 *    neighbourNetwork links (with updatedByPulse provenance); a pair with an
 *    un-saved end leaves neighbourNetwork untouched; the threat profile (a
 *    read-only consumer) reads the new label.
 *  H10 — deriveRegionalGraphFromSaves refreshes an existing edge's
 *    relationshipType from the live link on rebuild (the saves'
 *    neighbourNetwork is the canonical relationship source); unchanged links
 *    are identity no-ops; edges for pairs no longer linked are preserved
 *    as-is (pinned existing behavior, not new semantics).
 *  Decisions — a relationship label change is CURATION: the bundle
 *    re-confirms its OWN dormant channel ids on re-establishment, DM
 *    'disabled' survives label changes outright, and Discover still
 *    resurrects nothing; a vassalage apply with cascade changes emits one
 *    Wizard News entry per flipped third-party edge, naming both settlements
 *    and the flip.
 */

import { describe, expect, it } from 'vitest';

import {
  addRegionalChannels,
  canonicalRelationshipLabel,
  deriveRegionalGraphFromSaves,
  relationshipChannelBundle,
  setRegionalChannelStatus,
  syncRelationshipChannelBundle,
} from '../../src/domain/region/index.js';
import {
  applyWorldPulseOutcomes,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/index.js';
import { counterforceAssessment } from '../../src/domain/worldPulse/stressorDynamics.js';
import { collectThreatSources } from '../../src/domain/threatProfile.js';
// RN-A1's identity pin reads BOTH resolvers at their own modules rather than through a
// barrel, because one of the things it asserts is referential identity.
import {
  RELATIONSHIP_TYPE_ALIASES,
  normalizeRelationshipType,
  normalizeType,
} from '../../src/domain/worldPulse/relationshipState.js';
import { RELATIONSHIP_PLANE_ALIASES } from '../../src/domain/relationships/canonicalRelationship.js';
// RN-B1's moved reads are pinned through their PUBLIC paths.
import { QUALIFYING_KINDS, normalizeBondKind } from '../../src/domain/spatial/generosityGate.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { discoverDependencyCandidates } from '../../src/domain/region/discoverDependencyCandidates.js';

const NOW = '2026-06-11T00:00:00.000Z';
const T1 = '2026-06-01T00:00:00.000Z';
const T2 = '2026-06-05T00:00:00.000Z';
const T3 = '2026-06-09T00:00:00.000Z';

// ── fixtures ──────────────────────────────────────────────────────────────

function dossierSave(id, name, neighbourNetwork = []) {
  return {
    id,
    name,
    tier: 'town',
    settlement: {
      id: `settlement.${id}`,
      name,
      tier: 'town',
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
      neighbourNetwork,
      activeConditions: [],
    },
  };
}

function netLink(otherId, otherName, relationshipType, linkId) {
  return { id: otherId, linkId, name: otherName, neighbourName: otherName, relationshipType };
}

function pulseSettlement(name, neighbourNetwork = []) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    activeConditions: [],
    npcs: [],
    neighbourNetwork,
  };
}

function pulseItem(id, settlement) {
  return {
    id,
    name: settlement.name || id,
    settlement,
    activeConditions: [],
    causal: { scores: {} },
    system: { resourcePressure: { value: 50 } },
  };
}

function labelOutcome({ key, fromType, toType, id = `candidate.relationship.label.${key}.4` }) {
  return {
    id,
    type: 'relationship',
    candidateType: 'label_change',
    relationshipKey: key,
    relationshipPatch: { proposedRelationshipType: toType },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: key,
      fromType,
      toType,
      reason: 'Pulse-applied label change.',
    },
    severity: 0.6,
  };
}

// ── H12: legacy plural canonicalization ───────────────────────────────────

describe('H12 — trade_partners canonicalization (legacy shim)', () => {
  // ⚠ THE TITLE BELOW IS STALE AND STAYS STALE, DELIBERATELY (ODQ §64.5).
  // `canonicalRelationshipLabel` maps ELEVEN spellings, not "only the legacy plural" —
  // the regional table also folds trade/ally/alliance/allies/overlord/suzerain/liege/
  // smuggling/coldwar/cold-war. The title is a CENSUS KEY read by
  // tests/lint/sovereigntyLightingContract.walker.test.js, so renaming it moves a
  // census figure; the ruling corrects the description here, in-arm, and dockets the
  // rename to whichever act next re-records that census. The RN-A1 identity pin at the
  // foot of this file is what actually holds all eleven.
  it('canonicalRelationshipLabel maps only the legacy plural', () => {
    expect(canonicalRelationshipLabel('trade_partners')).toBe('trade_partner');
    expect(canonicalRelationshipLabel('Trade_Partners')).toBe('trade_partner');
    expect(canonicalRelationshipLabel('trade_partner')).toBe('trade_partner');
    expect(canonicalRelationshipLabel('hostile')).toBe('hostile');
    expect(canonicalRelationshipLabel(null)).toBe('');
  });

  it('a legacy plural link still mints the full 4-channel trade bundle', () => {
    const edge = { id: 'edge.a.b', from: 'a', to: 'b' };
    const plural = relationshipChannelBundle(edge, 'trade_partners', { now: NOW });
    const singular = relationshipChannelBundle(edge, 'trade_partner', { now: NOW });
    expect(plural).toHaveLength(4);
    expect(plural.filter(c => c.type === 'trade_route')).toHaveLength(2);
    expect(plural.filter(c => c.type === 'information_flow')).toHaveLength(2);
    expect(plural.map(c => c.id).sort()).toEqual(singular.map(c => c.id).sort());
    expect(plural.every(c => c.relationshipType === 'trade_partner')).toBe(true);
  });

  it('a legacy plural link enters the regional graph as a trade_partner edge', () => {
    const saves = [
      dossierSave('a', 'Aford', [netLink('b', 'Bton', 'trade_partners', 'link_a_b')]),
      dossierSave('b', 'Bton', [netLink('a', 'Aford', 'trade_partners', 'link_a_b')]),
    ];
    const graph = deriveRegionalGraphFromSaves(saves, null, { now: T1 });
    expect(graph.edges.find(e => e.id === 'edge.a.b')?.relationshipType).toBe('trade_partner');
  });

  it('a legacy plural edge counts in the stressor trade-partner ally check', () => {
    const snapshotWith = edges => ({
      byId: new Map([['a', { settlement: { institutions: [] }, causal: { scores: {} } }]]),
      regionalGraph: { edges, channels: [] },
    });
    const stressor = { type: 'market_shock', affectedSettlementIds: ['a'] };
    const plural = counterforceAssessment(stressor, snapshotWith([
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partners' },
    ]));
    const singular = counterforceAssessment(stressor, snapshotWith([
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
    ]));
    const none = counterforceAssessment(stressor, snapshotWith([]));
    expect(plural.score).toBe(singular.score);
    expect(plural.score).toBeGreaterThan(none.score);
  });
});

// ── H11: pulse → neighbourNetwork write-back ──────────────────────────────

describe('H11 — pulse label outcomes write back to neighbourNetwork', () => {
  function pulsePair({ aRel, bRel, edgeType }) {
    const a = pulseItem('a', pulseSettlement('Ashford', [netLink('b', 'Briarwatch', aRel, 'link_a_b')]));
    const b = pulseItem('b', pulseSettlement('Briarwatch', [netLink('a', 'Ashford', bRel, 'link_a_b')]));
    const worldState = {
      tick: 4,
      relationshipStates: { 'edge.a.b': { relationshipType: edgeType } },
      simulationRules: normalizeSimulationRules(),
    };
    const snapshot = {
      worldState,
      regionalGraph: { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: edgeType }], channels: [] },
      settlements: [a, b],
      byId: new Map([['a', a], ['b', b]]),
    };
    return { a, b, worldState, snapshot };
  }

  it('a hostile -> cold_war label change updates BOTH settlements\' links with provenance', () => {
    const { a, b, worldState, snapshot } = pulsePair({ aRel: 'hostile', bRel: 'hostile', edgeType: 'hostile' });
    const result = applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([
        ['a', { saveId: 'a', settlement: a.settlement }],
        ['b', { saveId: 'b', settlement: b.settlement }],
      ]),
      outcomes: [labelOutcome({ key: 'edge.a.b', fromType: 'hostile', toType: 'cold_war' })],
      tick: 4,
      now: NOW,
    });

    const updated = new Map(result.settlementUpdates.map(u => [u.saveId, u.settlement]));
    const linkOnA = updated.get('a').neighbourNetwork.find(n => n.id === 'b');
    const linkOnB = updated.get('b').neighbourNetwork.find(n => n.id === 'a');
    for (const link of [linkOnA, linkOnB]) {
      expect(link.relationshipType).toBe('cold_war');
      expect(link.displayRelationshipType).toBe('cold_war');
      expect(link.updatedByPulse).toBe(4);
    }
    expect(linkOnA.relationshipFrom).toBe('a');
    expect(linkOnA.relationshipTo).toBe('b');
    // The graph edge moved with it — the two substrates agree.
    expect(result.regionalGraph.edges.find(e => e.id === 'edge.a.b').relationshipType).toBe('cold_war');
  });

  it('leaves neighbourNetwork untouched when one end is not a saved settlement', () => {
    const { a, worldState, snapshot } = pulsePair({ aRel: 'hostile', bRel: 'hostile', edgeType: 'hostile' });
    const result = applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([['a', { saveId: 'a', settlement: a.settlement }]]),
      outcomes: [labelOutcome({ key: 'edge.a.b', fromType: 'hostile', toType: 'cold_war' })],
      tick: 4,
      now: NOW,
    });

    const updatedA = result.settlementUpdates.find(u => u.saveId === 'a').settlement;
    expect(updatedA.neighbourNetwork).toBe(a.settlement.neighbourNetwork);
    expect(updatedA.neighbourNetwork[0].relationshipType).toBe('hostile');
    expect(updatedA.neighbourNetwork[0].updatedByPulse).toBeUndefined();
    // The graph edge still moves — only the dossier write-back is gated.
    expect(result.regionalGraph.edges.find(e => e.id === 'edge.a.b').relationshipType).toBe('cold_war');
  });

  it('the threat profile reads the written-back label (read-only consumer probe)', () => {
    const { a, b, worldState, snapshot } = pulsePair({ aRel: 'neutral', bRel: 'neutral', edgeType: 'neutral' });
    expect(collectThreatSources(a.settlement).some(s => s.originSurface === 'neighbours')).toBe(false);

    const result = applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([
        ['a', { saveId: 'a', settlement: a.settlement }],
        ['b', { saveId: 'b', settlement: b.settlement }],
      ]),
      outcomes: [labelOutcome({ key: 'edge.a.b', fromType: 'neutral', toType: 'hostile' })],
      tick: 4,
      now: NOW,
    });

    const updatedA = result.settlementUpdates.find(u => u.saveId === 'a').settlement;
    const threats = collectThreatSources(updatedA);
    expect(threats.some(s => s.originSurface === 'neighbours' && s.inferredType === 'rival_neighbor')).toBe(true);
  });
});

// ── H10: edge relationshipType refresh on rebuild ─────────────────────────

describe('H10 — rebuild refreshes edge relationshipType from the live link', () => {
  const linkedSaves = rel => [
    dossierSave('a', 'Aford', [netLink('b', 'Bton', rel, 'link_a_b')]),
    dossierSave('b', 'Bton', [netLink('a', 'Aford', rel, 'link_a_b')]),
  ];

  it('a dossier link change refreshes the existing edge instead of freezing the first build', () => {
    const first = deriveRegionalGraphFromSaves(linkedSaves('trade_partner'), null, { now: T1 });
    expect(first.edges.find(e => e.id === 'edge.a.b').relationshipType).toBe('trade_partner');

    const rebuilt = deriveRegionalGraphFromSaves(linkedSaves('hostile'), first, { now: T2 });
    const edge = rebuilt.edges.find(e => e.id === 'edge.a.b');
    expect(edge.relationshipType).toBe('hostile');
    expect(edge.updatedAt).toBe(T2);
    expect(edge.evidence.some(ev => ev.source === 'neighbourNetwork' && /hostile/.test(ev.reason))).toBe(true);
    expect(edge.evidence.some(ev => /trade_partner/.test(ev.reason || ''))).toBe(false);
    // Refresh, not duplicate: still one edge for the pair.
    expect(rebuilt.edges.filter(e => e.id === 'edge.a.b')).toHaveLength(1);
    expect(rebuilt.edges).toHaveLength(first.edges.length);
  });

  it('an unchanged link is an identity no-op (no updatedAt churn)', () => {
    const first = deriveRegionalGraphFromSaves(linkedSaves('hostile'), null, { now: T1 });
    const again = deriveRegionalGraphFromSaves(linkedSaves('hostile'), first, { now: T3 });
    expect(again.edges.find(e => e.id === 'edge.a.b').updatedAt).toBe(T1);
  });

  it('preserves the edge as-is when the pair is no longer linked (pinned existing behavior)', () => {
    const first = deriveRegionalGraphFromSaves(linkedSaves('hostile'), null, { now: T1 });
    const unlinked = [dossierSave('a', 'Aford'), dossierSave('b', 'Bton')];
    const rebuilt = deriveRegionalGraphFromSaves(unlinked, first, { now: T3 });
    const edge = rebuilt.edges.find(e => e.id === 'edge.a.b');
    expect(edge).toBeTruthy();
    expect(edge.relationshipType).toBe('hostile');
    expect(edge.updatedAt).toBe(T1);
  });
});

// ── Decision: curation-grade bundle re-confirm ────────────────────────────

describe('decision — label re-establishment re-confirms the bundle\'s own dormant channels', () => {
  const edge = { id: 'edge.a.b', from: 'a', to: 'b' };

  function warmedThenCooled() {
    let graph = syncRelationshipChannelBundle(null, edge, 'trade_partner', { now: NOW });
    const tradeIds = graph.channels.filter(c => c.type === 'trade_route').map(c => c.id);
    graph = syncRelationshipChannelBundle(graph, edge, 'hostile', { now: NOW });
    return { graph, tradeIds };
  }

  it('a label change parks superseded bundle channels dormant (unchanged behavior)', () => {
    const { graph, tradeIds } = warmedThenCooled();
    for (const id of tradeIds) {
      expect(graph.channels.find(c => c.id === id).status).toBe('dormant');
    }
    expect(graph.channels.some(c => c.type === 'war_front' && c.status === 'confirmed')).toBe(true);
  });

  it('re-warming re-confirms dormant bundle channels; DM disabled stays disabled', () => {
    let { graph, tradeIds } = warmedThenCooled();
    graph = setRegionalChannelStatus(graph, tradeIds[0], 'disabled', { now: NOW });

    graph = syncRelationshipChannelBundle(graph, edge, 'trade_partner', { now: NOW });
    expect(graph.channels.find(c => c.id === tradeIds[0]).status).toBe('disabled');
    expect(graph.channels.find(c => c.id === tradeIds[1]).status).toBe('confirmed');
    // The hostile bundle parks dormant in turn.
    expect(graph.channels.filter(c => c.type === 'war_front').every(c => c.status === 'dormant')).toBe(true);
  });

  it('a DM-disabled channel survives the label change itself (never parked dormant)', () => {
    let graph = syncRelationshipChannelBundle(null, edge, 'trade_partner', { now: NOW });
    const tradeId = graph.channels.find(c => c.type === 'trade_route').id;
    graph = setRegionalChannelStatus(graph, tradeId, 'disabled', { now: NOW });
    graph = syncRelationshipChannelBundle(graph, edge, 'hostile', { now: NOW });
    expect(graph.channels.find(c => c.id === tradeId).status).toBe('disabled');
  });

  it('Discover still resurrects nothing: a dormant bundle channel stays dormant on rediscovery', () => {
    const { graph, tradeIds } = warmedThenCooled();
    const rediscovered = addRegionalChannels(graph, [
      { type: 'trade_route', from: 'a', to: 'b', strength: 0.9 },
    ], { now: NOW });
    expect(rediscovered.channels.find(c => c.id === tradeIds[0]).status).toBe('dormant');
  });
});

// ── Decision: vassal cascade emits Wizard News ────────────────────────────

describe('decision — vassalage cascade changes emit one news entry per flipped edge', () => {
  it('names both settlements and the flip, and writes the flip back to the dossier links', () => {
    const conqueror = pulseItem('c', pulseSettlement('Crownhold'));
    const vassal = pulseItem('a', pulseSettlement('Ashford', [netLink('b', 'Briarwatch', 'allied', 'link_a_b')]));
    const ally = pulseItem('b', pulseSettlement('Briarwatch', [netLink('a', 'Ashford', 'allied', 'link_a_b')]));
    const worldState = {
      tick: 4,
      relationshipStates: {
        'edge.c.a': { relationshipType: 'hostile', resentment: 0.86, fear: 0.74, leverage: 0.78, dependency: 0.62 },
        'edge.a.b': { relationshipType: 'allied', trust: 0.82, pactStrength: 0.84, tradeBalance: 0.6 },
        'edge.b.c': { relationshipType: 'hostile', resentment: 0.8, fear: 0.7 },
      },
      simulationRules: normalizeSimulationRules(),
    };
    const snapshot = {
      worldState,
      regionalGraph: {
        edges: [
          { id: 'edge.c.a', from: 'c', to: 'a', relationshipType: 'hostile' },
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
        ],
        channels: [],
      },
      settlements: [conqueror, vassal, ally],
      byId: new Map([['c', conqueror], ['a', vassal], ['b', ally]]),
    };

    const result = applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([
        ['c', { saveId: 'c', settlement: conqueror.settlement }],
        ['a', { saveId: 'a', settlement: vassal.settlement }],
        ['b', { saveId: 'b', settlement: ally.settlement }],
      ]),
      outcomes: [labelOutcome({ key: 'edge.c.a', fromType: 'hostile', toType: 'vassal' })],
      tick: 4,
      now: NOW,
    });

    // One flipped third-party edge (a-b allied -> hostile) => exactly one entry.
    const cascadeEntries = result.newsEntries.filter(e => e.impactKind === 'hierarchy_cascade');
    expect(cascadeEntries).toHaveLength(1);
    const [entry] = cascadeEntries;
    expect(entry.headline).toContain('Ashford');
    expect(entry.headline).toContain('Briarwatch');
    expect(entry.headline).toContain('allied becomes hostile');
    expect(entry.significance).toBe('major');
    expect(entry.settlementIds.sort()).toEqual(['a', 'b']);
    expect(entry.tick).toBe(4);
    // The flip also lands in the feed, not just the transient list.
    expect(result.wizardNews.entries.some(e => e.impactKind === 'hierarchy_cascade')).toBe(true);

    // H11 rides the cascade: both dossier links record the forced hostility.
    const updated = new Map(result.settlementUpdates.map(u => [u.saveId, u.settlement]));
    expect(updated.get('a').neighbourNetwork.find(n => n.id === 'b').relationshipType).toBe('hostile');
    expect(updated.get('b').neighbourNetwork.find(n => n.id === 'a').relationshipType).toBe('hostile');
    expect(updated.get('a').neighbourNetwork.find(n => n.id === 'b').updatedByPulse).toBe(4);
  });
});

// ── H16 (R3 must-fix): the apply seam honors the seniority stamps ──────────
// relationshipChannelBundle and the neighbourNetwork writeback both read raw
// edge orientation ('edge.from is the overlord') — but a pulse subjugation
// stamps the senior side onto STATE. Accepting a reversed-authored
// subjugation must not mint channels asserting the conquered village rules
// the city, nor write the village as localRole=overlord in both dossiers.

describe('H16 — accepted subjugation orients channels and dossiers by the stamped roles', () => {
  const HIERARCHY_CHANNELS = ['political_authority', 'military_protection', 'tax_obligation'];

  function subjugationApply(edge) {
    const city = pulseItem('o', pulseSettlement('Overcity', [netLink('v', 'Vasthorp', 'hostile', 'link_o_v')]));
    const village = pulseItem('v', pulseSettlement('Vasthorp', [netLink('o', 'Overcity', 'hostile', 'link_o_v')]));
    const worldState = {
      tick: 5,
      relationshipStates: {
        [edge.id]: { relationshipType: 'hostile', resentment: 0.6, fear: 0.4, leverage: 0.5 },
      },
      simulationRules: normalizeSimulationRules(),
    };
    const snapshot = {
      worldState,
      regionalGraph: { edges: [edge], channels: [] },
      settlements: [city, village],
      byId: new Map([['o', city], ['v', village]]),
    };
    const outcome = {
      ...labelOutcome({ key: edge.id, fromType: 'hostile', toType: 'vassal' }),
      // The subjugation stamps the senior side onto the STATE: city 'o'
      // subjugates village 'v' whichever way the save authored the edge.
      relationshipPatch: { overlordSaveId: 'o', vassalSaveId: 'v', trajectory: 'subjugating' },
    };
    return applyWorldPulseOutcomes({
      snapshot,
      worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: new Map([
        ['o', { saveId: 'o', settlement: city.settlement }],
        ['v', { saveId: 'v', settlement: village.settlement }],
      ]),
      outcomes: [outcome],
      tick: 5,
      now: NOW,
    });
  }

  function seamView(result) {
    const channels = result.regionalGraph.channels
      .filter(c => HIERARCHY_CHANNELS.includes(c.type))
      .map(c => `${c.type}:${c.from}->${c.to}`)
      .sort();
    const updated = new Map(result.settlementUpdates.map(u => [u.saveId, u.settlement]));
    const pick = link => ({
      relationshipType: link.relationshipType,
      localRelationshipRole: link.localRelationshipRole,
      relationshipFrom: link.relationshipFrom,
      relationshipTo: link.relationshipTo,
    });
    return {
      channels,
      linkOnCity: pick(updated.get('o').neighbourNetwork.find(n => n.id === 'v')),
      linkOnVillage: pick(updated.get('v').neighbourNetwork.find(n => n.id === 'o')),
    };
  }

  const EXPECTED = {
    channels: [
      'military_protection:o->v',
      'political_authority:o->v',
      'tax_obligation:v->o',
    ],
    linkOnCity: { relationshipType: 'vassal', localRelationshipRole: 'overlord', relationshipFrom: 'o', relationshipTo: 'v' },
    linkOnVillage: { relationshipType: 'vassal', localRelationshipRole: 'vassal', relationshipFrom: 'o', relationshipTo: 'v' },
  };

  it('a REVERSED-authored subjugation (edge v->o) mints overlord-first channels and correct dossier roles', () => {
    const view = seamView(subjugationApply({ id: 'edge.pair', from: 'v', to: 'o', relationshipType: 'hostile' }));
    expect(view).toEqual(EXPECTED);
  });

  it('a FORWARD-authored subjugation (edge o->v) is untouched by the role orientation (pre-fix behavior)', () => {
    const view = seamView(subjugationApply({ id: 'edge.pair', from: 'o', to: 'v', relationshipType: 'hostile' }));
    expect(view).toEqual(EXPECTED);
  });
});

// ── RN-A1: THE IDENTITY PIN (ODQ §64.1, J-RNC-2) ──────────────────────────

/**
 * RN-A1 made `canonicalRelationship.js` the single HOME for relationship spelling
 * knowledge: the relationship plane's table moved there and `relationshipState.js`
 * became a pure re-exporter. The member's whole claim is that this moved NOTHING.
 *
 * ⛔ THIS TABLE IS A PRE-FEATURE GOLDEN. Every row was generated by executing both
 * resolvers against a `git archive` of the verified base `cf12c976` — the tree as it
 * stood BEFORE the cure — and pasted here verbatim. It is not a transcription of what
 * the code now does, so it cannot mirror the cure: that is the whole point of building
 * it from the archive rather than from the working tree.
 *
 * ⛔⛔ RN-B1 THEN MOVED SIX ROWS OF IT, AND THAT MOTION IS THE DELIVERABLE — DECLARED,
 * NOT DISCOVERED. B1 is the SIGNED persisted-world read cure (ODQ §48.4, §64.2). Each
 * moved row is marked `⬅ RN-B1 MOVED` and every one is a LEGACY-LIVE spelling that used
 * to resolve to a label with no RELATIONSHIP_DEFAULTS row, and so silently received
 * `neutral`'s numbers under its own contradicting label:
 *
 *     trade_partners     'trade_partners'  → 'trade_partner'
 *     Trade_Partners     'trade_partners'  → 'trade_partner'
 *     overlord           'overlord'        → 'vassal'
 *     smuggling          'smuggling'       → 'criminal_network'
 *     smuggling_partner  'smuggling_partner' → 'criminal_network'
 *     Hostile rival      'hostile rival'   → 'hostile'
 *
 * ⭐ THE REGIONAL COLUMN DID NOT MOVE AT ALL — only the state plane's. And SAME-SEED
 * GENERATION IS UNMOVED, proved rather than argued: the full golden suite (87 files /
 * 623 tests) is byte-identical after this shift, because nothing in `src/` can PRODUCE
 * any of these spellings; they arrive only from an already-saved world.
 *
 * ⚠ `smuggling_partner` newly DIVERGES where it used to agree. That is correct and
 * deliberate: the REGIONAL plane keeps it as a first-class structural type, while the
 * state plane collapses the smuggling family onto the defaults row it has always meant.
 *
 * Columns: [input, canonicalRelationshipLabel(input), normalizeRelationshipType(input)]
 */
const RN_A1_RESOLUTION_GOLDEN = Object.freeze([
  ['trade_partners', 'trade_partner', 'trade_partner'],   // ⬅ RN-B1 MOVED
  ['allies', 'allied', 'allies'],
  ['overlord', 'vassal', 'vassal'],                       // ⬅ RN-B1 MOVED
  ['suzerain', 'vassal', 'suzerain'],
  ['liege', 'vassal', 'liege'],
  ['smuggling', 'smuggling_partner', 'criminal_network'], // ⬅ RN-B1 MOVED
  ['coldwar', 'cold_war', 'coldwar'],
  ['cold-war', 'cold_war', 'cold-war'],
  ['war', 'war', 'hostile'],
  ['enemy', 'enemy', 'hostile'],
  ['subject', 'subject', 'vassal'],
  ['tributary', 'tributary', 'vassal'],
  ['criminal_corridor', 'criminal_corridor', 'criminal_network'],
  ['trade', 'trade_partner', 'trade_partner'],
  ['ally', 'allied', 'allied'],
  ['alliance', 'allied', 'allied'],
  ['neutral', 'neutral', 'neutral'],
  ['trade_partner', 'trade_partner', 'trade_partner'],
  ['allied', 'allied', 'allied'],
  ['rival', 'rival', 'rival'],
  ['cold_war', 'cold_war', 'cold_war'],
  ['hostile', 'hostile', 'hostile'],
  ['criminal_network', 'criminal_network', 'criminal_network'],
  ['patron', 'patron', 'patron'],
  ['client', 'client', 'client'],
  ['vassal', 'vassal', 'vassal'],
  ['smuggling_partner', 'smuggling_partner', 'criminal_network'], // ⬅ RN-B1 MOVED
  ['other', 'other', 'other'],
  ['channel_inferred', 'channel_inferred', 'channel_inferred'],
  ['friendly', 'friendly', 'friendly'],
  ['cordial', 'cordial', 'cordial'],
  ['kinship', 'kinship', 'kinship'],
  ['defensive_pact', 'defensive_pact', 'defensive_pact'],
  ['protectorate', 'protectorate', 'protectorate'],
  ['', '', 'neutral'],
  ['  ', '', ''],
  ['Trade_Partners', 'trade_partner', 'trade_partner'],   // ⬅ RN-B1 MOVED
  ['HOSTILE', 'HOSTILE', 'hostile'],
  ['Hostile rival', 'Hostile rival', 'hostile'],          // ⬅ RN-B1 MOVED
  ['tense', 'tense', 'tense'],
]);

/** The nullish arm, kept separate because `null`/`undefined` are not table keys. */
const RN_A1_NULLISH_GOLDEN = Object.freeze([
  [null, '', 'neutral'],
  [undefined, '', 'neutral'],
]);

/** The divergence count the two planes are REQUIRED to keep. */
const RN_A1_EXPECTED_DIVERGENCE = 15;

describe('RN-A1 — one home, one writer: the resolvers did not move', () => {
  it('the 40-corpus resolutions match the pre-feature base except B1\'s six declared rows', () => {
    const actual = RN_A1_RESOLUTION_GOLDEN.map(([input]) => [
      input, canonicalRelationshipLabel(input), normalizeRelationshipType(input),
    ]);
    expect(
      actual,
      'a relationship spelling resolves differently than this table records. The six rows'
      + ' marked `⬅ RN-B1 MOVED` are the SIGNED persisted-read cure and are expected; any'
      + ' OTHER movement means a table was merged or a per-plane policy was unified, both'
      + ' of which are owner-gated and both of which move generated output.',
    ).toEqual(RN_A1_RESOLUTION_GOLDEN.map((row) => [...row]));
  });

  it('the nullish arm keeps its per-plane Axis-3 policy', () => {
    const actual = RN_A1_NULLISH_GOLDEN.map(([input]) => [
      input, canonicalRelationshipLabel(input), normalizeRelationshipType(input),
    ]);
    expect(actual).toEqual(RN_A1_NULLISH_GOLDEN.map((row) => [...row]));
  });

  it('⛔ the two planes still DIVERGE on exactly 15 of 40 — the pin\'s negative control', () => {
    // Without this arm the golden above would still pass if a cure converged the two
    // resolvers onto ONE table and the golden had been re-recorded from the cured tree.
    // The count is the property that makes accidental convergence loud.
    const divergent = RN_A1_RESOLUTION_GOLDEN
      .filter(([input]) => canonicalRelationshipLabel(input) !== normalizeRelationshipType(input))
      .map(([input]) => input);
    expect(
      divergent.length,
      'the regional and relationship-state planes converged. They disagree ON PURPOSE:'
      + ' the regional plane keeps war/subject/tributary as structural types while the'
      + ' state plane collapses them onto RELATIONSHIP_DEFAULTS rows. Converging them'
      + ` moves generated output. Diverging inputs now: ${JSON.stringify(divergent)}`,
    ).toBe(RN_A1_EXPECTED_DIVERGENCE);
  });

  it('⛔ normalizeType is REFERENTIALLY identical to normalizeRelationshipType', () => {
    // ensureRelationshipState calls both spellings in one expression. Two separately
    // constructed functions would satisfy every value test above and break this.
    expect(normalizeType).toBe(normalizeRelationshipType);
  });

  it('the plane table is re-exported from the home, not copied beside it', () => {
    // The single-writer law is enforced by the source scan in
    // tests/lint/implicitNeutralSingleSource.test.js; this is its runtime half, and it
    // is what makes the fork in RN-A1 §3 detectable if it were ever taken silently.
    expect(RELATIONSHIP_TYPE_ALIASES).toBe(RELATIONSHIP_PLANE_ALIASES);
    expect(Object.isFrozen(RELATIONSHIP_PLANE_ALIASES)).toBe(true);
    expect(Object.keys(RELATIONSHIP_PLANE_ALIASES)).toHaveLength(13);
  });
});

// ── RN-B1: THE MOVED READS (ODQ §48.4 / §64.2 / §66.2, SIGNED) ────────────

/**
 * The three routings B1 lands, each pinned through its PUBLIC path rather than at a
 * module-private helper, so the pin fails if the repair stops reaching real callers.
 *
 * ⛔ EVERY ONE IS A PERSISTED-WORLD READ REPAIR AND THE SHIFT IS DECLARED: a saved
 * campaign carrying one of these legacy spellings reads differently after this commit.
 * That is the deliverable — the label always claimed the reading it now gets, and
 * leaving it preserved a misreading rather than lived history. No same-seed generation
 * cell moves, because nothing in src/ can produce these spellings.
 *
 * The before-states below were MEASURED against a `git archive` of the arm-C terminal
 * `196b256a`, not remembered.
 */
describe('RN-B1 — the moved reads', () => {
  const infiltrationBase = (rel) => ({
    name: 'Home',
    neighbourNetwork: [
      { id: 'n1', name: 'Stonehaven', relationshipType: rel },
      { id: 'n2', name: 'Irontown', relationshipType: 'trade_partner' },
    ],
  });
  const infiltrated = (instigatorRelationship) => ({
    id: 'ev-rn-b1', type: 'APPLY_STRESSOR', targetId: 'infiltrated',
    payload: {
      stressorType: 'infiltrated', label: 'infiltrated', severity: 0.5,
      instigatorNeighbour: 'Stonehaven', instigatorRelationship,
    },
  });
  const relAfterInfiltration = (persisted, target) =>
    mutateSettlement({ settlement: infiltrationBase(persisted), event: infiltrated(target) })
      .neighbourNetwork.find((n) => n.name === 'Stonehaven')?.relationshipType;

  it('G2 — the five legacy bond spellings now QUALIFY for the generosity gate', () => {
    // §66.2 named three; the measured population is FIVE. Each used to normalize to
    // itself, miss QUALIFYING_KINDS, and so never even be ASKED the generosity question.
    const cured = { ally: 'allied', allies: 'allied', trade: 'trade_partner', liege: 'vassal', overlord: 'vassal' };
    for (const [persisted, canonical] of Object.entries(cured)) {
      expect(normalizeBondKind(persisted), `${persisted} should read as ${canonical}`).toBe(canonical);
      expect(QUALIFYING_KINDS.has(normalizeBondKind(persisted)), `${persisted} must now qualify`).toBe(true);
    }
  });

  it('G2 — the pre-existing fold survives and the KINDS are not widened', () => {
    // The hand-rolled `trade_partners` fold was REPLACED by the router, not dropped.
    expect(normalizeBondKind('trade_partners')).toBe('trade_partner');
    expect(normalizeBondKind('allied')).toBe('allied');
    expect(normalizeBondKind('ALLIED')).toBe('allied');
    expect(normalizeBondKind('')).toBe('');
    // The cure widens which SPELLINGS are recognised, never which KINDS qualify.
    expect(QUALIFYING_KINDS.has(normalizeBondKind('hostile'))).toBe(false);
    expect(QUALIFYING_KINDS.has(normalizeBondKind('rival'))).toBe(false);
  });

  it('G3 — a persisted coldwar edge is no longer DOWNGRADED by a rival infiltration', () => {
    // MEASURED at 196b256a: 'coldwar' + a rival infiltration returned 'rival' — the rank
    // read took the label raw, ranked it 0, and the no-downgrade guard "escalated" a cold
    // war into a rivalry, the exact motion the guard exists to forbid.
    expect(relAfterInfiltration('coldwar', 'rival')).toBe('coldwar');
    expect(relAfterInfiltration('cold-war', 'rival')).toBe('cold-war');
    // The canonical spelling was always correct — it is the control that proves the pin
    // is reading the guard and not merely asserting that nothing ever changes.
    expect(relAfterInfiltration('cold_war', 'rival')).toBe('cold_war');
    // ...and a genuinely milder edge still ESCALATES, so the guard was repaired, not disabled.
    expect(relAfterInfiltration('neutral', 'rival')).toBe('rival');
  });

  it('⚠ G3 — `enemy` is EXPECTED-DEAD, not cured, and that is the ruling', () => {
    // Curing `enemy` needs a SPECULATIVE spelling merged into the canonical table, which
    // §64.3 refuses. It was downgradeable before and still is, DELIBERATELY (§101.3).
    // Pinned so the gap stays a recorded decision rather than an unnoticed hole.
    expect(canonicalRelationshipLabel('enemy')).toBe('enemy');
    expect(relAfterInfiltration('enemy', 'rival')).toBe('rival');
  });

  it('relationBetween — a legacy plural link is finally VISIBLE to dependency discovery', () => {
    // MEASURED at 196b256a: 'trade_partners' produced ZERO candidates because the reader
    // returned the label RAW and every downstream comparison used canonical spellings.
    const save = (id, links) => ({
      id, name: id,
      settlement: {
        id, name: id, neighbourNetwork: links, institutions: [], activeConditions: [],
        config: {}, economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
      },
    });
    const withRel = (t) => save('a', [{ id: 'b', name: 'b', neighbourName: 'b', relationshipType: t }]);
    const target = save('b', []);
    const plural = discoverDependencyCandidates(withRel('trade_partners'), target);
    const singular = discoverDependencyCandidates(withRel('trade_partner'), target);
    expect(plural.length).toBeGreaterThan(0);
    expect(plural.map((c) => c.type).sort()).toEqual(singular.map((c) => c.type).sort());
    // An unknown label still passes through verbatim — the resolver widens nothing.
    expect(discoverDependencyCandidates(withRel('protector'), target)).toEqual([]);
  });

  it('⚠ `tense` is NOT merged — the one target no ruling determined', () => {
    // The fifth LEGACY-LIVE spelling the cure names. `rival`, `cold_war` and `hostile` are
    // all defensible targets carrying materially different trust/resentment/fear numbers,
    // so choosing one here would INVENT owner-gated content rather than execute it. It
    // stays unmapped — the same neutral numbers it reads today — and is an open chair
    // question. Adding it later is a one-row diff with a signed target.
    expect(normalizeRelationshipType('tense')).toBe('tense');
    expect(canonicalRelationshipLabel('tense')).toBe('tense');
  });
});
