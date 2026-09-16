/**
 * neutralConnectedDefault.test.js — THE NEUTRAL-CONNECTED DEFAULT at the seam
 * (realm directive 2 / judgment J-D2, 2026-07-31).
 *
 * Owner intent: "campaign members start as neutral but connected neighbors unless
 * explicitly told otherwise." J-D2 fixes the default edge as diplomatic KNOWN +
 * minimal route awareness — NOT a trade route, no resource flow — shipped DARK
 * behind the virtual `neutralNeighborsEnabled`.
 *
 * The minter's own contract is pinned in tests/domain/neutralNeighbourEdges.test.js.
 * This file pins the four seam properties the directive is judged on, all through
 * the REAL buildWorldSnapshot / simulateCampaignWorldPulse pipeline:
 *
 *   1. DORMANCY — flag absent ⇒ buildWorldSnapshot hands back the SAME regional-graph
 *      OBJECT it was given (identity, not equality), so the wire cannot perturb any
 *      dark world; and a driven dark pulse commits a graph with zero default edges.
 *   2. EXPLICIT BEATS DEFAULT — an authored edge survives the lit path untouched by
 *      the default, in either orientation.
 *   3. PERSISTENCE — the default edges survive a JSON round-trip of the campaign with
 *      their provenance intact, and the next advance re-derives them IDEMPOTENTLY
 *      (no duplicate pair, no growth).
 *   4. INTERACTION DENSITY — the point of the directive. A four-settlement flagged
 *      world produces STRICTLY MORE cross-settlement (relationship-family) candidates
 *      over a seeded five-year pulse than its unflagged twin. Anchored: the unflagged
 *      twin carries an authored tie and must itself produce a non-zero count, so the
 *      comparison can never be "live pipeline vs dead pipeline".
 */
import { describe, it, expect } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { isNeutralDefaultEdge } from '../../src/domain/region/neutralNeighbourEdges.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['ashford', 'brightmoor', 'crowfen', 'dunmoor'];
/** Every unordered pair of the four members — the fully-connected target. */
const PAIR_COUNT = (IDS.length * (IDS.length - 1)) / 2;

function nnSettlement(name, { tier = 'town', population = 2400 } = {}) {
  return {
    name, tier, population,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
    neighbourNetwork: [],
  };
}

const nnSave = (id, name, patch) => ({
  id, name, phase: 'canon',
  settlement: nnSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * The fixture realm: four canon settlements, ONE authored tie (Ashford ↔ Brightmoor,
 * trade partners). The authored tie is the liveness anchor — it keeps the relationship
 * pipeline demonstrably alive in the UNFLAGGED twin, so the density comparison measures
 * added density rather than "something vs nothing". The other five pairs are the
 * habitat the neutral default fills.
 * @param {string} seed @param {boolean} lit
 */
function makeWorld(seed, lit) {
  const saves = [
    nnSave('ashford', 'Ashford', { tier: 'town', population: 3100 }),
    nnSave('brightmoor', 'Brightmoor', { tier: 'city', population: 12000 }),
    nnSave('crowfen', 'Crowfen', { tier: 'village', population: 700 }),
    nnSave('dunmoor', 'Dunmoor', { tier: 'town', population: 2200 }),
  ];
  const campaign = {
    id: 'neutral-connected', name: 'Neutral Connected', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      simulationRules: { ...(lit ? { neutralNeighborsEnabled: true } : {}) },
      calendar: { elapsedWeeks: 30 },
    },
    regionalGraph: ensureRegionalGraph({
      updatedAt: NOW,
      edges: [{ id: 'edge.ashford.brightmoor', from: 'ashford', to: 'brightmoor', relationshipType: 'trade_partner' }],
    }, { now: NOW }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive `ticks` real pulses, folding settlement + world + graph state forward. */
function drive(seed, lit, ticks, interval) {
  let { campaign, saves } = makeWorld(seed, lit);
  let relationshipCandidates = 0;
  let relationshipOutcomes = 0;
  const pairsTouched = new Set();
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const c of r.candidates || []) {
      if (c?.ruleFamily !== 'relationship') continue;
      relationshipCandidates += 1;
      if (c.relationshipKey) pairsTouched.add(String(c.relationshipKey));
    }
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      if (o?.relationshipKey || o?.proposalPayload?.relationshipKey) relationshipOutcomes += 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, relationshipCandidates, relationshipOutcomes, pairsTouched };
}

const defaultEdges = (graph) => (graph?.edges || []).filter(isNeutralDefaultEdge);
const edgeIds = (graph) => (graph?.edges || []).map((e) => e.id).sort();

describe('neutral-connected default — DORMANCY (flag absent ⇒ the wire cannot be observed)', () => {
  it('buildWorldSnapshot returns the SAME regional-graph object when the flag is absent', () => {
    const { campaign, saves } = makeWorld('nn-dormant', false);
    const snapshot = buildWorldSnapshot({ campaign, saves });
    // Object IDENTITY, not deep equality: the dark path adds no allocation and no key,
    // so the snapshot every kernel reads is the pre-wire snapshot exactly.
    expect(snapshot.regionalGraph).toBe(campaign.regionalGraph);
    expect(snapshot.relationships).toBe(campaign.regionalGraph.edges);
  });

  it('NEGATIVE CONTROL: the same fixture with the flag LIT produces a different, larger graph', () => {
    const { campaign, saves } = makeWorld('nn-dormant', true);
    const snapshot = buildWorldSnapshot({ campaign, saves });
    expect(snapshot.regionalGraph === campaign.regionalGraph).toBe(false);
    expect(snapshot.regionalGraph.edges.length).toBe(PAIR_COUNT);
    expect(defaultEdges(snapshot.regionalGraph).length).toBe(PAIR_COUNT - 1);
  });

  it('a driven dark pulse commits a graph with ZERO default edges (authored tie anchors it)', () => {
    const { campaign } = drive('nn-dark', false, 4, 'one_month');
    const committed = campaign.regionalGraph;
    // Liveness anchor: the authored tie is still there, so "no defaults" is a real
    // exclusion rather than an empty graph.
    expect(edgeIds(committed).includes('edge.ashford.brightmoor')).toBe(true);
    expect(defaultEdges(committed).length).toBe(0);
  }, 120_000);
});

describe('neutral-connected default — EXPLICIT BEATS DEFAULT (through the real pulse)', () => {
  it('the authored tie keeps its own type and provenance; only the un-linked pairs default', () => {
    const { campaign } = drive('nn-explicit', true, 3, 'one_month');
    const committed = campaign.regionalGraph;
    const authored = committed.edges.find((e) => e.id === 'edge.ashford.brightmoor');
    expect(isNeutralDefaultEdge(authored)).toBe(false);
    expect(defaultEdges(committed).map((e) => e.id).sort()).toEqual([
      'edge.ashford.crowfen',
      'edge.ashford.dunmoor',
      'edge.brightmoor.crowfen',
      'edge.brightmoor.dunmoor',
      'edge.crowfen.dunmoor',
    ]);
  }, 120_000);

  it('an authored tie recorded in the REVERSE orientation still suppresses its default', () => {
    const { campaign, saves } = makeWorld('nn-reverse', true);
    const reversed = {
      ...campaign,
      regionalGraph: ensureRegionalGraph({
        updatedAt: NOW,
        edges: [{ id: 'edge.brightmoor.ashford', from: 'brightmoor', to: 'ashford', relationshipType: 'vassal' }],
      }, { now: NOW }),
    };
    const snapshot = buildWorldSnapshot({ campaign: reversed, saves });
    const authored = snapshot.regionalGraph.edges.find((e) => e.id === 'edge.brightmoor.ashford');
    expect(authored.relationshipType).toBe('vassal');
    expect(snapshot.regionalGraph.edges.length).toBe(PAIR_COUNT);
    expect(defaultEdges(snapshot.regionalGraph).length).toBe(PAIR_COUNT - 1);
  });
});

describe('neutral-connected default — PERSISTENCE (JSON round-trip + idempotent re-derivation)', () => {
  it('default edges survive a campaign JSON round-trip with provenance, and never duplicate', () => {
    const first = drive('nn-persist', true, 2, 'one_month');
    const beforeIds = edgeIds(first.campaign.regionalGraph);
    expect(defaultEdges(first.campaign.regionalGraph).length).toBe(PAIR_COUNT - 1);

    // The lifecycle path that matters: the campaign is serialized to storage and
    // rehydrated (which strips the ensure brand, so the graph is fully re-normalized).
    const rehydratedCampaign = JSON.parse(JSON.stringify(first.campaign));
    const rehydratedSaves = JSON.parse(JSON.stringify(first.saves));
    expect(edgeIds(rehydratedCampaign.regionalGraph)).toEqual(beforeIds);
    expect(defaultEdges(rehydratedCampaign.regionalGraph).length).toBe(PAIR_COUNT - 1);

    // ...and the NEXT advance re-derives idempotently: the pairs are already connected,
    // so the minter's strict no-op fires and the edge set does not grow.
    const next = simulateCampaignWorldPulse({
      campaign: rehydratedCampaign, saves: rehydratedSaves, interval: 'one_month', now: NOW,
    });
    expect(edgeIds(next.regionalGraph)).toEqual(beforeIds);
    expect(defaultEdges(next.regionalGraph).length).toBe(PAIR_COUNT - 1);
  }, 120_000);

  it('the default edges carry NO channels — known, not trading (J-D2)', () => {
    const { campaign } = drive('nn-channels', true, 2, 'one_month');
    for (const edge of defaultEdges(campaign.regionalGraph)) {
      expect(edge.channelIds).toEqual([]);
    }
    // Anti-vacuity: there ARE default edges to check.
    expect(defaultEdges(campaign.regionalGraph).length).toBe(PAIR_COUNT - 1);
  }, 120_000);
});

describe('neutral-connected default — INTERACTION DENSITY (the purpose of the directive)', () => {
  it('a flagged five-year world produces strictly more cross-settlement candidates than its twin', () => {
    const SEED = 'nn-density';
    const TICKS = 60;               // 60 × one_month = five game years
    const dark = drive(SEED, false, TICKS, 'one_month');
    const lit = drive(SEED, true, TICKS, 'one_month');

    // LIVENESS ANCHOR: the unflagged twin's relationship pipeline is demonstrably
    // alive end to end — its authored Ashford↔Brightmoor tie both GENERATES
    // candidates and lands OUTCOMES — so the comparison below measures ADDED
    // density, never a dead-vs-live pipeline.
    expect(dark.relationshipCandidates).toBeGreaterThan(0);
    expect(dark.relationshipOutcomes).toBeGreaterThan(0);
    expect(dark.pairsTouched.size).toBe(1);

    expect(lit.relationshipCandidates).toBeGreaterThan(dark.relationshipCandidates);
    expect(lit.relationshipOutcomes).toBeGreaterThan(dark.relationshipOutcomes);
    // Density is spread across the realm, not piled onto the one authored tie.
    expect(lit.pairsTouched.size).toBeGreaterThan(dark.pairsTouched.size);
  }, 300_000);
});
