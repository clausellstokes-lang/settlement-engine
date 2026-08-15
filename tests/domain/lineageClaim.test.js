/**
 * WR-3 — the pure lineage_claim ↔ kinship_bond slice.
 *
 * These pins deliberately use campaign-member snapshot rows, not wave-E
 * satellite ledger rows: the claim is reachable only after a real child save
 * carries parentRef and a live regional edge joins the two members.
 */

import { describe, expect, it } from 'vitest';

import {
  LINEAGE_CLAIM_TUNING,
  lineageClaimActive,
  makeLineageClaimRead,
} from '../../src/domain/worldPulse/lineageClaim.js';
import {
  advanceWarReasons,
  warReasonsFor,
} from '../../src/domain/worldPulse/warReasons.js';
import {
  advancePeaceReasons,
  peaceReasonsFor,
} from '../../src/domain/worldPulse/peaceReasons.js';

const EDGE = { id: 'edge.parent.child', from: 'parent', to: 'child', relationshipType: 'neutral', status: 'active' };
const RULES = { warLayerEnabled: true, peaceEngineEnabled: true, lineageClaimEnabled: true };

function member(id, { tier = 'town', population = 1500, parentRef = null, lifecycleStatus = '' } = {}) {
  return {
    id,
    name: id === 'parent' ? 'Elderwall' : 'Newbridge',
    settlement: {
      name: id === 'parent' ? 'Elderwall' : 'Newbridge',
      tier,
      population,
      config: { tier },
      ...(parentRef ? { parentRef } : {}),
      ...(lifecycleStatus ? { lifecycleStatus } : {}),
    },
  };
}

function lineagePair({
  parentTier = 'town', parentPopulation = 1800,
  childTier = 'village', childPopulation = 700,
  foundingTier = 'village', foundingPopulation = 700,
  childLifecycleStatus = '',
} = {}) {
  const parent = member('parent', { tier: parentTier, population: parentPopulation });
  const child = member('child', {
    tier: childTier,
    population: childPopulation,
    lifecycleStatus: childLifecycleStatus,
    parentRef: {
      parentId: 'parent',
      liveEdgeId: EDGE.id,
      foundingTier,
      foundingPopulation,
      graduationTier: foundingTier,
      graduationPopulation: foundingPopulation,
      foundedTick: 4,
      graduatedTick: 12,
      sourceSatelliteId: 'sat.parent.1',
      sourceEventId: 'lineage.parent.child.12',
    },
  });
  const settlements = [parent, child];
  return {
    parent,
    child,
    snapshot: { settlements, byId: new Map(settlements.map((row) => [row.id, row])), regionalGraph: { edges: [EDGE] } },
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

describe('WR-3 lineage read — one edge, both directions', () => {
  it('is an exact-true virtual gate; absent, false, and truthy impostors are silent', () => {
    expect(lineageClaimActive({ simulationRules: { lineageClaimEnabled: true } })).toBe(true);
    for (const value of [undefined, false, 1, 'true']) {
      const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250 });
      const ws = { simulationRules: value === undefined ? {} : { lineageClaimEnabled: value } };
      const before = JSON.stringify(ws);
      const read = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: ws, graph: pair.graph });
      expect(read.lit).toBe(false);
      expect(read.lineageClaimOf('parent', 'child')).toEqual({ score: 0, receipt: '' });
      expect(read.kinshipBondOf('parent', 'child')).toEqual({ score: 0, receipt: '' });
      expect(JSON.stringify(ws), 'the pure dark read writes no bytes').toBe(before);
    }
  });

  it('parent -> child requires the child to have fallen below its frozen founding baseline', () => {
    const fallen = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingTier: 'village', foundingPopulation: 800 });
    const read = makeLineageClaimRead({ snapshot: fallen.snapshot, worldState: world(), graph: fallen.graph });
    const claim = read.lineageClaimOf('parent', 'child');
    expect(claim.score).toBeGreaterThan(0);
    expect(claim.score).toBeLessThanOrEqual(LINEAGE_CLAIM_TUNING.CLAIM_WEIGHT_CAP);
    expect(claim.receipt).toBeTruthy();
    expect(claim.receipt).not.toMatch(/\d|edge\.parent\.child|sat\.parent/);
    expect(claim.evidence.parentDirection).toBe(1);

    const healthy = lineagePair({ childTier: 'village', childPopulation: 800, foundingTier: 'village', foundingPopulation: 800 });
    const healthyRead = makeLineageClaimRead({ snapshot: healthy.snapshot, worldState: world(), graph: healthy.graph });
    expect(healthyRead.lineageClaimOf('parent', 'child')).toEqual({ score: 0, receipt: '' });
    expect(healthyRead.kinshipBondOf('parent', 'child').score).toBeGreaterThan(0);
  });

  it('child -> parent requires the child to outgrow the elder seat by tier or the named population margin', () => {
    const tierInversion = lineagePair({ parentTier: 'village', parentPopulation: 700, childTier: 'town', childPopulation: 1400 });
    const tierRead = makeLineageClaimRead({ snapshot: tierInversion.snapshot, worldState: world(), graph: tierInversion.graph });
    const tierClaim = tierRead.lineageClaimOf('child', 'parent');
    expect(tierClaim.score).toBeGreaterThan(0);
    expect(tierClaim.receipt).toBeTruthy();
    expect(tierClaim.receipt).not.toMatch(/\d|edge\.parent\.child|sat\.parent/);
    expect(tierClaim.evidence.parentDirection).toBe(0);

    const populationInversion = lineagePair({
      parentTier: 'town', parentPopulation: 1000,
      childTier: 'town', childPopulation: 1300,
      foundingTier: 'village', foundingPopulation: 700,
    });
    const popRead = makeLineageClaimRead({ snapshot: populationInversion.snapshot, worldState: world(), graph: populationInversion.graph });
    expect(popRead.lineageClaimOf('child', 'parent').score).toBeGreaterThan(0);

    const belowMargin = lineagePair({
      parentTier: 'town', parentPopulation: 1000,
      childTier: 'town', childPopulation: 1100,
      foundingTier: 'village', foundingPopulation: 700,
    });
    const quiet = makeLineageClaimRead({ snapshot: belowMargin.snapshot, worldState: world(), graph: belowMargin.graph });
    expect(quiet.lineageClaimOf('child', 'parent')).toEqual({ score: 0, receipt: '' });
    expect(quiet.kinshipBondOf('child', 'parent').score).toBeGreaterThan(0);
  });

  it('requires both a surviving parentRef and a live direct graph edge between non-remnants', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const noEdge = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: world(), graph: { edges: [] } });
    expect(noEdge.lineageClaimOf('parent', 'child').score).toBe(0);

    const wrongEdge = makeLineageClaimRead({
      snapshot: pair.snapshot,
      worldState: world(),
      graph: { edges: [{ ...EDGE, id: 'edge.unrelated.same-pair' }] },
    });
    expect(wrongEdge.lineageClaimOf('parent', 'child').score).toBe(0);

    const severedGraph = makeLineageClaimRead({
      snapshot: pair.snapshot,
      worldState: world(),
      graph: { edges: [{ ...EDGE, status: 'severed' }] },
    });
    expect(severedGraph.lineageClaimOf('parent', 'child').score).toBe(0);

    const remnant = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800, childLifecycleStatus: 'relic_ruin' });
    const deadRead = makeLineageClaimRead({ snapshot: remnant.snapshot, worldState: world(), graph: remnant.graph });
    expect(deadRead.lineageClaimOf('parent', 'child').score).toBe(0);
    expect(deadRead.kinshipBondOf('parent', 'child').score).toBe(0);

    const severedRef = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    severedRef.child.settlement.parentRef = { ...severedRef.child.settlement.parentRef, severed: true };
    const refRead = makeLineageClaimRead({ snapshot: severedRef.snapshot, worldState: world(), graph: severedRef.graph });
    expect(refRead.lineageClaimOf('parent', 'child').score).toBe(0);
  });

  it('keeps historical parentRef but excludes both actual irreversible-destruction shapes', () => {
    const destroyedChild = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const childRef = destroyedChild.child.settlement.parentRef;
    destroyedChild.child.settlement.status = 'destroyed';
    destroyedChild.child.settlement.config._destroyed = true;
    const childRead = makeLineageClaimRead({
      snapshot: destroyedChild.snapshot,
      worldState: world(),
      graph: destroyedChild.graph,
    });
    expect(childRead.lineageClaimOf('parent', 'child').score).toBe(0);
    expect(childRead.kinshipBondOf('parent', 'child').score).toBe(0);
    expect(destroyedChild.child.settlement.parentRef).toBe(childRef);

    const destroyedParent = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const parentRef = destroyedParent.child.settlement.parentRef;
    destroyedParent.parent.settlement.status = 'destroyed';
    destroyedParent.parent.settlement.config._destroyed = true;
    const parentRead = makeLineageClaimRead({
      snapshot: destroyedParent.snapshot,
      worldState: world(),
      graph: destroyedParent.graph,
    });
    expect(parentRead.lineageClaimOf('parent', 'child').score).toBe(0);
    expect(parentRead.kinshipBondOf('parent', 'child').score).toBe(0);
    expect(destroyedParent.child.settlement.parentRef).toBe(parentRef);
  });
});

describe('WR-3 coherence counterforce — corroborated provisioning wins', () => {
  function provisionedWorld() {
    return world({
      relationshipStates: {
        [EDGE.id]: {
          relationshipType: 'neutral', trust: 0.8, resentment: 0,
          recentIncidents: [{ type: 'trade_warmth', tick: 20, severity: 0.5 }],
        },
      },
      spatialLedgers: {
        tradeOverture: {
          'parent:child': { warmth: 0.8, sinceTick: 4, lastTick: 20, initiated: true },
        },
      },
      pulseHistory: [{
        tick: 20,
        impactDigest: [{
          impactKind: 'generosity_trade_overture',
          settlementIds: ['parent', 'child'],
          tick: 20,
        }],
      }],
    });
  }

  it('returns exact-zero claim plus structured evidence naming the contradicting record', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingTier: 'village', foundingPopulation: 800 });
    const read = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: provisionedWorld(), graph: pair.graph });
    const claim = read.lineageClaimOf('parent', 'child');
    expect(claim.score).toBe(0);
    expect(claim.suppressed).toBe(true);
    expect(claim.suppression).toMatchObject({
      recordKind: 'trade_overture',
      recordTick: 20,
      relationshipKey: EDGE.id,
      chronicleKind: 'generosity_trade_overture',
    });
    expect(claim.receipt).toMatch(/trade-overture record.*chronicle.*Elderwall provisioning Newbridge.*claim is stayed/i);
    expect(claim.evidence).toMatchObject({ lineageEdge: 1, provisioningContradiction: 1 });

    const bond = read.kinshipBondOf('parent', 'child');
    expect(bond.score).toBe(LINEAGE_CLAIM_TUNING.CLAIM_WEIGHT_CAP);
    expect(bond.evidence.provisioningContradiction).toBe(1);
    expect(bond.receipt).toBeTruthy();
    expect(bond.receipt).not.toMatch(/\d|edge\.parent\.child|sat\.parent/);
  });

  it('does not suppress on an uncorroborated ledger, chronicle, or lone gift', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const ledgerOnly = provisionedWorld();
    delete ledgerOnly.pulseHistory;
    expect(makeLineageClaimRead({ snapshot: pair.snapshot, worldState: ledgerOnly, graph: pair.graph })
      .lineageClaimOf('parent', 'child').score).toBeGreaterThan(0);

    const chronicleOnly = provisionedWorld();
    delete chronicleOnly.spatialLedgers;
    chronicleOnly.relationshipStates[EDGE.id].recentIncidents = [];
    expect(makeLineageClaimRead({ snapshot: pair.snapshot, worldState: chronicleOnly, graph: pair.graph })
      .lineageClaimOf('parent', 'child').score).toBeGreaterThan(0);

    const loneGift = world({
      relationshipStates: {
        [EDGE.id]: { relationshipType: 'neutral', recentIncidents: [{ type: 'relief_given', tick: 20 }] },
      },
      pulseHistory: [{ tick: 20, impactDigest: [{ impactKind: 'generosity_relief', settlementIds: ['parent', 'child'] }] }],
    });
    expect(makeLineageClaimRead({ snapshot: pair.snapshot, worldState: loneGift, graph: pair.graph })
      .lineageClaimOf('parent', 'child').score).toBeGreaterThan(0);
  });

  it('accepts a repeatedly renewed, non-predatory grain-relief obligation only with matching history', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const relieved = world({
      relationshipStates: {
        [EDGE.id]: {
          relationshipType: 'neutral',
          recentIncidents: [
            { type: 'relief_given', tick: 8 },
            { type: 'relief_given', tick: 18 },
          ],
        },
      },
      spatialLedgers: {
        obligations: {
          'child:parent:grain_relief': {
            from: 'child', to: 'parent', kind: 'grain_relief',
            magnitude: 0.7, mintTick: 8, lastTick: 18,
          },
        },
      },
      pulseHistory: [8, 18].map((tick) => ({
        tick,
        impactDigest: [{ impactKind: 'generosity_relief', settlementIds: ['parent', 'child'], tick }],
      })),
    });
    const suppressed = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: relieved, graph: pair.graph })
      .lineageClaimOf('parent', 'child');
    expect(suppressed).toMatchObject({
      score: 0,
      suppressed: true,
      suppression: { recordKind: 'grain_relief_obligation', recordTick: 18 },
    });

    relieved.spatialLedgers.obligations['child:parent:grain_relief'].predatory = true;
    const predatory = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: relieved, graph: pair.graph })
      .lineageClaimOf('parent', 'child');
    // The actual ledger calls the aid predatory, so generic warm history may
    // not launder it into the kinship counterforce.
    expect(predatory.score).toBeGreaterThan(0);
    expect(predatory.suppressed).toBeUndefined();
  });

  it('corroborates the graduation seam founding-support record against the parent population chronicle', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    pair.parent.settlement.populationHistory = [
      { tick: 8, delta: -20, outcomeId: 'lifecycle.grow.sat.parent.1.8' },
      { tick: 18, delta: -30, outcomeId: 'lifecycle.grow.sat.parent.1.18' },
    ];
    pair.child.settlement.parentRef.provisioningRecord = {
      id: 'lineage.provisioning.child',
      kind: 'founding_support',
      fromId: 'parent',
      evidenceIds: [
        'lifecycle.grow.sat.parent.1.8',
        'lifecycle.grow.sat.parent.1.18',
      ],
    };
    const claim = makeLineageClaimRead({ snapshot: pair.snapshot, worldState: world(), graph: pair.graph })
      .lineageClaimOf('parent', 'child');
    expect(claim).toMatchObject({
      score: 0,
      suppressed: true,
      suppression: {
        recordKind: 'founding_support',
        recordTick: 18,
        chronicleKind: 'population_history',
      },
    });
    expect(claim.receipt).toMatch(/founding-support record.*population chronicle.*Elderwall provisioning Newbridge/i);
  });
});

describe('WR-3 mover wiring', () => {
  it('folds lineage_claim into the war ledger and kinship_bond into the live-war peace ledger', () => {
    const fallen = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const war = advanceWarReasons({ snapshot: fallen.snapshot, worldState: world(), graph: fallen.graph, tick: 30 });
    expect(warReasonsFor(war.worldState, 'parent', 'child')?.reasons?.lineage_claim?.score).toBeGreaterThan(0);

    const healthy = lineagePair();
    const peaceWorld = world({ deployments: { parent: { targetId: 'child' } } });
    const peace = advancePeaceReasons({ snapshot: healthy.snapshot, worldState: peaceWorld, graph: healthy.graph, tick: 30 });
    expect(peaceReasonsFor(peace.worldState, 'parent', 'child')?.reasons?.kinship_bond?.score).toBeGreaterThan(0);
    expect(peaceReasonsFor(peace.worldState, 'child', 'parent')?.reasons?.kinship_bond?.score).toBeGreaterThan(0);
  });

  it('keeps lineage absent from both ledgers when its flag is absent', () => {
    const pair = lineagePair({ childTier: 'hamlet', childPopulation: 250, foundingPopulation: 800 });
    const darkRules = { warLayerEnabled: true, peaceEngineEnabled: true };
    const war = advanceWarReasons({
      snapshot: pair.snapshot,
      worldState: world({ simulationRules: darkRules }),
      graph: pair.graph,
      tick: 30,
    });
    expect(warReasonsFor(war.worldState, 'parent', 'child')?.reasons?.lineage_claim).toBeUndefined();

    const peace = advancePeaceReasons({
      snapshot: pair.snapshot,
      worldState: world({ simulationRules: darkRules, deployments: { parent: { targetId: 'child' } } }),
      graph: pair.graph,
      tick: 30,
    });
    expect(peaceReasonsFor(peace.worldState, 'parent', 'child')?.reasons?.kinship_bond).toBeUndefined();
  });
});
