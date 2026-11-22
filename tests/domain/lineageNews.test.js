/**
 * WR-3 — lineage reason transitions reach Wizard News once, in their governed
 * voice, with a complete reader address and no engine prose leakage.
 */

import { describe, expect, it } from 'vitest';

import {
  appendWizardNewsEntries,
  ensureRegionalGraph,
} from '../../src/domain/region/index.js';
import { projectWizardNewsForAudience } from '../../src/domain/region/wizardNews.js';
import { WAR_LINEAGE_KINDS, lineageReceipt } from '../../src/domain/worldPulse/eventProse.js';
import { advancePeaceReasons } from '../../src/domain/worldPulse/peaceReasons.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { advanceWarReasons, warReasonsFor } from '../../src/domain/worldPulse/warReasons.js';

const EDGE = Object.freeze({
  id: 'edge.parent.child',
  from: 'parent',
  to: 'child',
  relationshipType: 'neutral',
  status: 'active',
});
const RULES = Object.freeze({
  warLayerEnabled: true,
  peaceEngineEnabled: true,
  lineageClaimEnabled: true,
});

function member(id, { tier, population, parentRef = null, house = '', populationHistory = [] }) {
  const name = id === 'parent' ? 'Elderwall' : 'Newbridge';
  return {
    id,
    name,
    settlement: {
      name,
      tier,
      population,
      config: { tier },
      populationHistory,
      ...(house ? { powerStructure: { governingName: house } } : {}),
      ...(parentRef ? { parentRef } : {}),
    },
  };
}

function lineagePair({
  parentTier = 'town',
  parentPopulation = 1800,
  childTier = 'village',
  childPopulation = 700,
  foundingTier = 'village',
  foundingPopulation = 700,
  house = 'House Rowan',
  foundingSupport = false,
} = {}) {
  const evidence = [
    { tick: 8, delta: -20, outcomeId: 'lifecycle.grow.sat.parent.1.8' },
    { tick: 18, delta: -30, outcomeId: 'lifecycle.grow.sat.parent.1.18' },
  ];
  const parent = member('parent', {
    tier: parentTier,
    population: parentPopulation,
    populationHistory: foundingSupport ? evidence : [],
  });
  const child = member('child', {
    tier: childTier,
    population: childPopulation,
    house,
    parentRef: {
      parentId: 'parent',
      liveEdgeId: EDGE.id,
      foundingTier,
      foundingPopulation,
      graduationTier: foundingTier,
      graduationPopulation: foundingPopulation,
      foundedTick: 4,
      graduatedTick: 20,
      birthId: 'lineage.birth.parent.child',
      sourceSatelliteId: 'sat.parent.1',
      ...(foundingSupport ? {
        provisioningRecord: {
          id: 'lineage.provisioning.child',
          kind: 'founding_support',
          fromId: 'parent',
          evidenceIds: evidence.map((row) => row.outcomeId),
        },
      } : {}),
    },
  });
  const settlements = [parent, child];
  return {
    snapshot: {
      settlements,
      byId: new Map(settlements.map((row) => [row.id, row])),
      regionalGraph: { edges: [EDGE] },
    },
    graph: { edges: [EDGE] },
  };
}

function world(extra = {}) {
  return {
    simulationRules: { ...RULES },
    relationshipStates: {
      [EDGE.id]: { relationshipType: 'neutral', trust: 0.5, resentment: 0 },
    },
    ...extra,
  };
}

function readerText(entry) {
  return [entry.headline, entry.summary, ...(entry.reasons || [])].join(' ');
}

function oneLineageEntry(result, kind) {
  const entries = result.newsEntries.filter((entry) => entry.impactKind === kind);
  expect(entries).toHaveLength(1);
  return entries[0];
}

function pulseSave(id, name, tier, population, parentRef = null) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier,
      population,
      config: { tier, tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 30 },
      institutions: [],
      economicState: {
        prosperity: 'Stable', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 6, resilienceScore: 60 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        governingName: id === 'child' ? 'House Rowan' : 'The Elder Council',
        factions: [],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
      ...(parentRef ? { parentRef } : {}),
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

describe('WR-3 lineage transition news', () => {
  it('emits both claim directions once and keeps the reason records in the governed pools', () => {
    const fallen = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const parentClaim = advanceWarReasons({
      snapshot: fallen.snapshot,
      worldState: world(),
      graph: fallen.graph,
      tick: 30,
    });
    const parentBeat = oneLineageEntry(parentClaim, 'casus_lineage_claim_parent');
    expect(parentBeat).toMatchObject({
      significance: 'major', audience: 'public', section: 'war',
      settlementIds: ['parent', 'child'],
      settlementNames: ['Elderwall', 'Newbridge'],
    });
    expect(parentBeat.familyId).toMatch(/^casus_lineage_claim_parent\.[1-5]$/);
    expect(parentBeat.sourceEventId).toBeTruthy();
    expect(readerText(parentBeat)).not.toMatch(/\d|%|×|edge\.parent\.child|sat\.parent/);
    expect(warReasonsFor(parentClaim.worldState, 'parent', 'child').reasons.lineage_claim.receipt)
      .toBe(lineageReceipt(
        'casus_lineage_claim_parent',
        'reason:parent:child:parent_to_child',
        { settlement: 'Elderwall', counterpart: 'Newbridge', band: 'well', house: 'House Rowan' },
      ).line);
    expect(advanceWarReasons({
      snapshot: fallen.snapshot,
      worldState: parentClaim.worldState,
      graph: fallen.graph,
      tick: 31,
    }).newsEntries.filter((entry) => entry.impactKind === 'casus_lineage_claim_parent')).toEqual([]);

    const outgrown = lineagePair({
      parentTier: 'village', parentPopulation: 700,
      childTier: 'town', childPopulation: 1400,
    });
    const childClaim = advanceWarReasons({
      snapshot: outgrown.snapshot,
      worldState: world(),
      graph: outgrown.graph,
      tick: 30,
    });
    const childBeat = oneLineageEntry(childClaim, 'casus_lineage_claim_child');
    expect(childBeat).toMatchObject({
      significance: 'major', audience: 'public', section: 'war',
      settlementIds: ['child', 'parent'],
      settlementNames: ['Newbridge', 'Elderwall'],
    });
    expect(childBeat.familyId).toMatch(/^casus_lineage_claim_child\.[1-5]$/);
    expect(readerText(childBeat)).not.toMatch(/\d|%|×|edge\.parent\.child|sat\.parent/);
    expect(warReasonsFor(childClaim.worldState, 'child', 'parent').reasons.lineage_claim.receipt)
      .toBe(lineageReceipt(
        'casus_lineage_claim_child',
        'reason:parent:child:child_to_parent',
        { settlement: 'Newbridge', counterpart: 'Elderwall', band: 'well', house: 'House Rowan' },
      ).line);
  });

  it('dedupes the two directed peace reasons into one kinship story', () => {
    const pair = lineagePair();
    const first = advancePeaceReasons({
      snapshot: pair.snapshot,
      worldState: world({ deployments: { child: { targetId: 'parent' } } }),
      graph: pair.graph,
      tick: 30,
    });
    const beat = oneLineageEntry(first, 'mirror_kinship_bond');
    expect(first.newsEntries.filter((entry) => entry.impactKind === 'mirror_kinship_bond')).toHaveLength(1);
    expect(beat).toMatchObject({
      significance: 'notable', audience: 'public', section: 'events',
      settlementIds: ['parent', 'child'],
      settlementNames: ['Elderwall', 'Newbridge'],
    });
    expect(beat.familyId).toMatch(/^mirror_kinship_bond\.[1-5]$/);
    expect(readerText(beat)).not.toMatch(/\d|%|×|edge\.parent\.child|sat\.parent/);
    expect(advancePeaceReasons({
      snapshot: pair.snapshot,
      worldState: first.worldState,
      graph: pair.graph,
      tick: 31,
    }).newsEntries.filter((entry) => entry.impactKind === 'mirror_kinship_bond')).toEqual([]);
  });

  it('records an old founding-support counterforce at the later inversion and emits it privately once', () => {
    const pair = lineagePair({
      childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800,
      foundingSupport: true,
    });
    const first = advanceWarReasons({
      snapshot: pair.snapshot,
      worldState: world(),
      graph: pair.graph,
      tick: 40,
    });
    const beat = oneLineageEntry(first, 'lineage_claim_suppressed');
    expect(beat).toMatchObject({
      significance: 'routine', audience: 'dm-only', section: 'war', covert: true,
      settlementIds: ['parent', 'child'],
      settlementNames: ['Elderwall', 'Newbridge'],
    });
    expect(beat.familyId).toMatch(/^lineage_claim_suppressed\.[1-5]$/);
    expect(readerText(beat)).not.toMatch(/\d|%|×|edge\.parent\.child|sat\.parent|lineage\./);
    expect(warReasonsFor(first.worldState, 'parent', 'child')).toMatchObject({
      reasons: {},
      memo: { lineageSuppressionSinceTick: 40 },
    });

    const repeated = advanceWarReasons({
      snapshot: pair.snapshot,
      worldState: first.worldState,
      graph: pair.graph,
      tick: 41,
    });
    expect(repeated.newsEntries.filter((entry) => entry.impactKind === 'lineage_claim_suppressed')).toEqual([]);
    expect(warReasonsFor(repeated.worldState, 'parent', 'child').memo.lineageSuppressionSinceTick).toBe(40);

    const feed = appendWizardNewsEntries({}, first.newsEntries, { now: '2026-01-01T00:00:00.000Z' });
    expect(feed.entries[0]).toMatchObject({ audience: 'dm-only', section: 'war', covert: true });
    expect(projectWizardNewsForAudience(feed, 'public').entries).toEqual([]);
  });

  it('is silent behind the exact-true lineage gate', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const dark = world({ simulationRules: { warLayerEnabled: true, peaceEngineEnabled: true } });
    const war = advanceWarReasons({ snapshot: pair.snapshot, worldState: dark, graph: pair.graph, tick: 30 });
    const peace = advancePeaceReasons({
      snapshot: pair.snapshot,
      worldState: { ...dark, deployments: { parent: { targetId: 'child' } } },
      graph: pair.graph,
      tick: 30,
    });
    expect(war.newsEntries.filter((entry) => WAR_LINEAGE_KINDS.includes(entry.impactKind))).toEqual([]);
    expect(peace.newsEntries.filter((entry) => WAR_LINEAGE_KINDS.includes(entry.impactKind))).toEqual([]);
  });

  it('threads reason news through the full pulse into both the feed and audit sink', () => {
    const childRef = {
      parentId: 'parent',
      liveEdgeId: EDGE.id,
      foundingTier: 'village',
      foundingPopulation: 800,
      graduationTier: 'village',
      graduationPopulation: 800,
      foundedTick: 4,
      graduatedTick: 20,
      birthId: 'lineage.birth.parent.child',
      sourceSatelliteId: 'sat.parent.1',
    };
    const saves = [
      pulseSave('parent', 'Elderwall', 'town', 1800),
      pulseSave('child', 'Newbridge', 'hamlet', 250, childRef),
    ];
    const campaign = {
      id: 'lineage-news-pulse',
      name: 'Lineage News Pulse',
      settlementIds: ['parent', 'child'],
      regionalGraph: ensureRegionalGraph({ edges: [EDGE] }, { now: '2026-01-01T00:00:00.000Z' }),
      wizardNews: { currentTick: 29, entries: [] },
      worldState: {
        rngSeed: 'lineage-news-pulse-seed',
        tick: 29,
        simulationRules: { ...RULES },
        relationshipStates: {
          [EDGE.id]: { relationshipType: 'neutral', trust: 0.5, resentment: 0 },
        },
      },
    };
    const receipts = [];
    const result = simulateCampaignWorldPulse({
      campaign,
      saves,
      interval: 'one_week',
      now: '2026-01-01T00:00:00.000Z',
      newsReceiptSink: receipts,
    });
    expect(result.wizardNews.entries.some((entry) => entry.impactKind === 'casus_lineage_claim_parent')).toBe(true);
    expect(receipts.some((entry) => entry.impactKind === 'casus_lineage_claim_parent')).toBe(true);
  });

  it('reaches every governed family deterministically through the live reason movers', () => {
    const seen = new Map([
      ['casus_lineage_claim_parent', new Set()],
      ['casus_lineage_claim_child', new Set()],
      ['mirror_kinship_bond', new Set()],
      ['lineage_claim_suppressed', new Set()],
    ]);
    for (let tick = 1; tick <= 160; tick += 1) {
      const fallen = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
      const parent = advanceWarReasons({ snapshot: fallen.snapshot, worldState: world(), graph: fallen.graph, tick });
      seen.get('casus_lineage_claim_parent').add(oneLineageEntry(parent, 'casus_lineage_claim_parent').familyId);

      const outgrown = lineagePair({
        parentTier: 'village', parentPopulation: 700,
        childTier: 'town', childPopulation: 1400,
      });
      const child = advanceWarReasons({ snapshot: outgrown.snapshot, worldState: world(), graph: outgrown.graph, tick });
      seen.get('casus_lineage_claim_child').add(oneLineageEntry(child, 'casus_lineage_claim_child').familyId);

      const healthy = lineagePair();
      const peace = advancePeaceReasons({
        snapshot: healthy.snapshot,
        worldState: world({ deployments: { parent: { targetId: 'child' } } }),
        graph: healthy.graph,
        tick,
      });
      seen.get('mirror_kinship_bond').add(oneLineageEntry(peace, 'mirror_kinship_bond').familyId);

      const supported = lineagePair({
        childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800,
        foundingSupport: true,
      });
      const suppression = advanceWarReasons({
        snapshot: supported.snapshot,
        worldState: world(),
        graph: supported.graph,
        tick,
      });
      seen.get('lineage_claim_suppressed').add(oneLineageEntry(suppression, 'lineage_claim_suppressed').familyId);
    }
    for (const [kind, families] of seen) {
      expect(families, kind).toEqual(new Set(Array.from({ length: 5 }, (_, index) => `${kind}.${index + 1}`)));
    }
  });
});
