/**
 * envoyRansomWiring.test.js — WR-7d REACHABILITY THROUGH THE LIVE PULSE.
 *
 * `ransomClaimWr7d.test.js` proves the arithmetic in isolation. These pins prove
 * it is actually reached from `advanceEnvoyDiplomacyPulse`: a real envoy is
 * really taken, WR-7b's hold ledger really opens, the dwell really matures, and
 * a claim against the man's OWN home is really minted with both message legs
 * priced as a pair.
 *
 * THE STAGE-NEUTER NEGATIVE CONTROL is the dwell itself: the SAME world one
 * tick after custody mints nothing (`dwell_too_short`), and the same world once
 * the dwell has matured mints a claim. A stage that priced on custody alone
 * would make the two ticks agree, and this pair is what would then fail.
 */
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { advanceEnvoyDiplomacyPulse } from '../../src/domain/worldPulse/envoyPulse.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { createNegotiationPicture } from '../../src/domain/worldPulse/negotiationPictures.js';
import { envoyErrandsOf, envoyOfferEpisodeKey } from '../../src/domain/worldPulse/envoyErrand.js';
import { foreignGuestHoldsOf } from '../../src/domain/worldPulse/foreignGuestHold.js';
import {
  RANSOM_CLAIM_KIND,
  RANSOM_SUBJECT_KIND,
  RANSOM_TUNING,
} from '../../src/domain/worldPulse/ransomClaim.js';
import {
  openRansomClaims,
  ransomWorthBandFromErrand,
} from '../../src/domain/worldPulse/envoyRansomStage.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import {
  PROVENANCE_GENERATED,
  routeEdge,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

const NOW = '2026-08-03T00:00:00.000Z';
const EDGE = { id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' };
const KEY = relationshipKeyFromEdge(EDGE);
const RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
});

function save(id, name, population, npcs = []) {
  return {
    id,
    name,
    settlement: {
      id,
      name,
      seed: `seed.${id}`,
      tier: 'town',
      population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs,
      activeConditions: [],
    },
  };
}

function offer() {
  return {
    id: 'candidate.strategy.sue_for_peace.offerer.12',
    generatedAtTick: 12,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: 'offerer',
    severity: 0.72,
    probability: 1,
    applyMode: 'auto',
    headline: 'Ember sues for peace',
    summary: 'Ember offers terms.',
    reasons: [],
    relationshipKey: KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: KEY,
      fromType: 'hostile',
      toType: 'cold_war',
      peaceOffer: true,
      offererId: 'offerer',
      targetId: 'target',
      peaceFrontOwnerId: 'offerer',
      peaceFrontSinceTick: 3,
      reason: 'Ember offered peace.',
    },
  };
}

function fixture() {
  const saves = [
    save('offerer', 'Ember', 1000, [{
      id: 'npc.mara', name: 'Mara Vale', role: 'Chancellor', importance: 'notable', status: 'active',
    }]),
    save('target', 'Vale', 12000),
  ];
  const graph = ensureRegionalGraph({ edges: [EDGE], channels: [] }, { now: NOW });
  const roadId = routeEdgeId('offerer', 'target', 'land');
  const worldState = {
    tick: 12,
    simulationRules: { ...RULES },
    relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
    deployments: {
      offerer: {
        targetId: 'target', sinceTick: 3, role: 'siege',
        maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [],
      },
    },
    warExhaustion: { target: 1 },
    spatialLedgers: {
      warReasons: {},
      routeNetwork: {
        edges: {
          [roadId]: routeEdge({
            a: 'offerer', b: 'target', grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  const settlements = saves.map((row) => ({
    id: row.id, name: row.name, save: row, settlement: row.settlement,
  }));
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((row) => [row.id, row])),
    regionalGraph: graph,
    worldState,
    campaign: {},
  };
  const settlementUpdates = saves.map((row) => ({
    saveId: row.id, save: row, settlement: row.settlement,
  }));
  return { graph, worldState, snapshot, settlementUpdates };
}

/** A third-party column with a singular IMPRISON goal, on the envoy's own node. */
function reavers({ node, departTick, capturedTick }) {
  return {
    armyId: 'army.reavers',
    role: 'march',
    originId: 'target',
    destId: 'offerer',
    path: [node, 'offerer'],
    departTick,
    arrivalTick: departTick + 20,
    position01: 0,
    strength: 100,
    readiness: 0.6,
    supplyQuality: 0.9,
    funding: 0.6,
    beliefStaleness: 0,
    lastTick: departTick,
    commandPicture: createNegotiationPicture({
      id: 'army-picture.army.reavers',
      carrier: { kind: 'army', id: 'army.reavers' },
      partyId: 'target',
      counterpartId: 'offerer',
      relationshipKey: KEY,
      episodeKey: envoyOfferEpisodeKey(offer()),
      frontOwnerId: 'offerer',
      frontSinceTick: 3,
      capturedTick,
      causeStatus: 'live',
      subjects: [
        { settlementId: 'target', strengthBand: 'strong', storesBand: 'stocked' },
        { settlementId: 'offerer', strengthBand: 'ready', storesBand: 'thin' },
      ],
      evidenceIds: [],
    }),
    envoyIntent: {
      kind: 'private_goal',
      intentId: 'reavers.imprison',
      privateGoals: ['imprison'],
    },
  };
}

function pulse(f, worldState, tick) {
  return advanceEnvoyDiplomacyPulse({
    worldState,
    snapshot: { ...f.snapshot, worldState, regionalGraph: f.graph },
    regionalGraph: f.graph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementUpdates: f.settlementUpdates,
    tick,
    now: NOW,
    season: null,
    simulationRules: worldState.simulationRules,
  });
}

/** Drive the real arc all the way into custody, and return the held world. */
function inCustody() {
  const f = fixture();
  const applied = applyWorldPulseOutcomes({
    snapshot: { ...f.snapshot, worldState: f.worldState, regionalGraph: f.graph },
    worldState: f.worldState,
    regionalGraph: f.graph,
    wizardNews: { currentTick: 12, entries: [] },
    settlementMap: new Map(f.settlementUpdates.map((row) => [row.saveId, row])),
    outcomes: [offer()],
    tick: 12,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: f.worldState.simulationRules,
  });
  const errand = envoyErrandsOf(applied.worldState)[0];
  expect(errand, 'a real errand must exist before anyone is taken').toBeTruthy();
  const arrival = Number(errand.legs[0].arrivalTick);
  const seeded = {
    ...applied.worldState,
    spatialLedgers: {
      ...applied.worldState.spatialLedgers,
      armyTransit: { 'army.reavers': reavers({ node: 'target', departTick: arrival, capturedTick: arrival }) },
    },
  };
  const collided = pulse(f, seeded, arrival);
  const custody = pulse(f, collided.worldState, arrival + 1);
  return { f, state: custody.worldState, heldTick: arrival + 1, result: custody };
}

describe('WR-7d ransom reaches the pulse over WR-7b custody', () => {
  it('opens a real hold, waits out the dwell, then prices a claim and BOTH legs', () => {
    const { f, state, heldTick, result } = inCustody();
    // Positive facts FIRST: the man is really held, through the real writer.
    const holds = Object.values(foreignGuestHoldsOf(state));
    expect(holds, 'WR-7b custody must actually open a hold').toHaveLength(1);
    expect(holds[0]).toMatchObject({ captorId: 'target', cause: 'private_imprisonment' });
    expect(Number(holds[0].heldSinceTick)).toBe(heldTick);

    // THE NEGATIVE CONTROL, and it is the dwell: on the tick custody opened,
    // nothing is priced. A stage that charged on capture would mint here.
    expect(result.ransomClaims, 'a captor does not price a man the day he takes him')
      .toHaveLength(0);
    expect(result.ransomSkipped).toHaveLength(1);
    expect(result.ransomSkipped[0]).toMatchObject({ reason: 'dwell_too_short', dwellTicks: 0 });

    // Now let the dwell mature through the SAME live pulse.
    const matured = heldTick + Number(RANSOM_TUNING.DWELL_CUTS[0]);
    const later = pulse(f, state, matured);
    expect(later.ransomClaims, 'a matured hold must actually price').toHaveLength(1);
    const row = later.ransomClaims[0];

    // THE DEBTOR IS THE MAN'S OWN HOME, never the enemy.
    expect(row.homeId).toBe('offerer');
    expect(row.captorId).toBe('target');
    expect(row.claim).toMatchObject({
      kind: RANSOM_CLAIM_KIND,
      claimantId: 'target',
      debtorId: 'offerer',
      atTick: matured,
    });
    expect(row.claim.subject).toMatchObject({
      kind: RANSOM_SUBJECT_KIND,
      npcId: String(holds[0].npcId),
      dwellBand: 'settled',
    });
    expect(Number(row.claim.claim01)).toBeGreaterThan(0);
    expect(Number(row.claim.claim01)).toBeLessThanOrEqual(RANSOM_TUNING.CLAIM_CEILING_01);

    // BOTH HALVES TRAVEL, AS A PAIR, and the answer cannot precede the demand.
    expect(row.demandLeg).toMatchObject({ fromId: 'target', toId: 'offerer', departTick: matured });
    expect(row.answerLeg).toMatchObject({ fromId: 'offerer', toId: 'target' });
    expect(Number(row.demandLeg.arrivalTick)).toBeGreaterThan(matured);
    expect(Number(row.answerLeg.departTick)).toBe(Number(row.demandLeg.arrivalTick));
    expect(Number(row.answerDueTick)).toBe(Number(row.answerLeg.arrivalTick));
    expect(Number(row.answerDueTick)).toBeGreaterThan(Number(row.demandLeg.arrivalTick));
  });

  it('prices nothing at all when no one is held', () => {
    const f = fixture();
    const result = pulse(f, f.worldState, 12);
    expect(result.ransomClaims).toEqual([]);
    expect(result.ransomSkipped).toEqual([]);
  });

  it('reads the captor\'s belief about a man off the errand, and only off it', () => {
    // One argument. There is no world through which a real importance could
    // enter this derivation, which is the same enforcement CR-WIRE-A uses.
    expect(ransomWorthBandFromErrand.length).toBe(1);
    expect(ransomWorthBandFromErrand({ purpose: 'sue', termSheet: { id: 'ts.1' } })).toBe('principal');
    expect(ransomWorthBandFromErrand({ purpose: 'sue' })).toBe('notable');
    expect(ransomWorthBandFromErrand({ purpose: 'self_parlay' })).toBe('common');
    expect(ransomWorthBandFromErrand(null)).toBe('common');
  });

  it('shuts the gate when the man\'s own errand cannot be produced', () => {
    const { state, heldTick } = inCustody();
    const matured = heldTick + Number(RANSOM_TUNING.DWELL_CUTS[0]);
    // Positive fact first: the same world at the same tick DOES price.
    const priced = openRansomClaims({ worldState: state, tick: matured });
    expect(priced.claims, 'the control must actually price before it is broken')
      .toHaveLength(1);

    // The errand names the man's home and what he was carrying. Without it a
    // demand has no addressee, so the hold is SKIPPED and receipted — never
    // priced from defaults against a home nobody can name.
    const orphaned = { ...state };
    delete orphaned.envoyErrands;
    const read = openRansomClaims({ worldState: orphaned, tick: matured });
    expect(read.claims).toHaveLength(0);
    expect(read.skipped).toHaveLength(1);
    expect(read.skipped[0]).toMatchObject({ reason: 'unreadable_errand' });
  });
});

describe('THE DORMANCY LAW — the ransom stage is invisible while the flag is dark', () => {
  it('returns every input by reference and prices nothing', () => {
    const f = fixture();
    const dark = { ...f.worldState, simulationRules: { ...RULES, envoyDiplomacyEnabled: false } };
    const result = pulse(f, dark, 12);
    expect(result.worldState).toBe(dark);
    expect(result.ransomClaims).toEqual([]);
    expect(result.ransomSkipped).toEqual([]);
  });
});
