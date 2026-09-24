/**
 * offerEnvoyReadPeace1.test.js — CURE LANE FP-PEACE-1, unit U3 (C4; findings/FP-PEACE-SUIT.md §0 item 6c, §5 arm
 * CFS and §6 C4):
 *
 *   With the four envoy keys lit and the route network installed, every accepted organic suit (3 of 3) died in the
 *   envoy check with `invalid_acceptance`.
 *
 * An organic war-time offer carries the chooser's compact read of its own court's WR-1 books
 * (settlementStrategy.js :: compactWarRulingRead), and WR-5 hands exactly that stored read to the envoy as the
 * offerer's read (warPeaceDecision.js :: readWarPeaceDecision, `storedOffererRead`). The compact read dropped the
 * receipt's `kind` and `settlementIds`, and envoyErrandOffer.js :: normalizeEnvoyAcceptance requires both of the
 * offerer's read ('war_termination_read', and the pair in offerer-then-target order). The offer's writer now keeps
 * the two identity fields; no control value joins them.
 *
 * The offer is the REAL chooser's (evaluateSettlementStrategyRules) over settlementStrategy.test.js's hostile pair,
 * fed the REAL WR-1 read of the besieger (readWarTerminationForParty) with its pressure raised to certainty, as that
 * suite does, so the chooser's canonical pick is the suit.
 */
import { describe, expect, it } from 'vitest';

import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { readWarTerminationForParty } from '../../src/domain/worldPulse/warTermination.js';
import { readWarPeaceDecision } from '../../src/domain/worldPulse/warPeaceDecision.js';
import { ENVOY_REQUIRED_RULES, mintEnvoyErrand, normalizeEnvoyAcceptance } from '../../src/domain/worldPulse/envoyErrand.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const LIT = Object.freeze({
  settlementStrategyEnabled: true,
  ...Object.fromEntries(ENVOY_REQUIRED_RULES.map((key) => [key, true])),
});

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

const save = (id, name, patch) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

const SAVES = [
  save('strong', 'Ironhold', {
    tier: 'city', population: 45000,
    activeConditions: [
      { archetype: 'war_drain', severity: 0.95, label: 'War drain' },
      { archetype: 'war_drain', severity: 0.95, label: 'War drain 2' },
    ],
  }),
  save('weak', 'Thornmere', {
    tier: 'village', population: 280, legitimacy: 24,
    factions: [
      { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
      { faction: 'Hedge Wardens', category: 'military', power: 22 },
    ],
  }),
];

/** settlementStrategy.test.js's hostile pair at war: the city besieges the village, the village is spent. */
function warWorld() {
  const campaign = {
    id: 'peace1-envoy-read', name: 'Peace1 Envoy Read', settlementIds: ['strong', 'weak'],
    worldState: {
      rngSeed: 'peace1-envoy-read', tick: 6,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      simulationRules: { ...LIT },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [] } },
      warExhaustion: { weak: 1 },
      spatialLedgers: { warReasons: {} },
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }], channels: [] }),
    wizardNews: { currentTick: 6, entries: [] },
  };
  const snap = buildWorldSnapshot({ campaign, saves: SAVES, worldState: campaign.worldState });
  return { snap, pIdx: pressureIndex(deriveSettlementPressures(snap)) };
}

/** The chooser's organic offer: the REAL WR-1 read of the besieger, raised to certainty so the canonical pick is the suit. */
function organicOffer() {
  const { snap, pIdx } = warWorld();
  const termination = readWarTerminationForParty({ worldState: snap.worldState, snapshot: snap, pIndex: pIdx, tick: 6, actorId: 'strong', opponentId: 'weak' });
  expect(termination?.receipt?.kind, 'the real WR-1 read carries its identity fields').toBe('war_termination_read');
  const out = evaluateSettlementStrategyRules(snap, pIdx, {
    tick: 6,
    simulationRules: snap.worldState.simulationRules,
    warTerminationByAttacker: new Map([['strong', { ...termination, suePressure01: 1 }]]),
  });
  const offer = out.find((c) => c.targetSaveId === 'strong' && c.candidateType === 'strategy_sue_for_peace');
  return { snap, pIdx, termination, offer };
}

/** envoyErrand.test.js's departure picture and route plan: the only inputs the errand writer takes besides the ruling. */
const DEPARTURE_PICTURE = Object.freeze({
  storesBand: 'thin', strengthBand: 'ready', moraleExhaustionBand: 'present', foundingCauseStatus: 'live', believedRatioBand: 'matched',
});
const ROUTE_PLAN = Object.freeze({
  legs: [{ fromId: 'strong', toId: 'weak', departTick: 6, arrivalTick: 8 }],
  expectedReturnTick: 14,
  routeRef: { id: 'road.north', name: 'North Road' },
});

describe('C4 — the organic offer carries the two identity fields the envoy check needs', () => {
  it('with the envoy keys lit, the chooser\'s organic offer passes the envoy check and its errand is minted', () => {
    const { snap, pIdx, termination, offer } = organicOffer();
    expect(offer?.proposalPayload?.peaceOffer, 'the chooser wrote a war-time bilateral offer').toBe(true);
    const stored = offer.metadata.warRulingRead;
    expect(stored, 'the offer carries the chooser\'s compact read').toBeTruthy();

    const decision = readWarPeaceDecision({ worldState: snap.worldState, snapshot: snap, pIndex: pIdx, outcome: offer, tick: 6 });
    expect(decision?.accepted, 'the spent village takes the offer').toBe(true);
    expect(decision.offererRead, 'WR-5 hands the envoy the STORED read, not a fresh one').toEqual(stored);
    // The acceptance exactly as envoyDiplomacy.js :: dispatchAcceptedPeaceEnvoy builds it for the errand writer.
    const acceptance = { ...decision, offererInheritedDemand: offer.metadata.inheritedWarDemand };
    const minted = mintEnvoyErrand({
      worldState: { ...snap.worldState }, outcome: offer, acceptance,
      npcId: 'npc.reeve', npcName: 'Reeve Ironhold', fromName: 'Ironhold', toName: 'Thornmere',
      snapshot: DEPARTURE_PICTURE, purpose: 'sue', routePlan: ROUTE_PLAN, tick: 6,
    });
    expect(minted.reason ?? 'minted', 'the measured failure: the envoy check refused the organic ruling').not.toBe('invalid_acceptance');
    expect(minted.changed).toBe(true);
    expect(minted.errand).toBeTruthy();
    expect(normalizeEnvoyAcceptance(acceptance, offer), 'the envoy check accepts the organic ruling').not.toBeNull();
    // The two identity fields the check reads, in the receipt's own order.
    expect(stored).toMatchObject({ id: termination.receipt.id, kind: 'war_termination_read', attackerId: 'strong', targetId: 'weak' });
    expect(stored.settlementIds).toEqual(['strong', 'weak']);
  });

  it('the stored read stays compact: the two fields are identity, and no control value rides with them', () => {
    const { offer } = organicOffer();
    const keys = Object.keys(offer.metadata.warRulingRead);
    expect(keys).toEqual(expect.arrayContaining(['kind', 'settlementIds']));
    // anchored: the two identity keys are asserted present on the line above, so the read is a live object here.
    expect(keys).not.toContain('suePressure01');
  });
});
