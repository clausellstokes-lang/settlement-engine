/**
 * staleSuitRetiresAtWarPeace1.test.js — CURE LANE FP-PEACE-1, unit U1 (the chair's ruling FP-17,
 * vetoable; findings/FP-PEACE-SUIT.md §0 item 2 and §5 arm CFX):
 *
 *   In 4 of the 5 wars whose war-time suit the DM docket refused, one of the suing court's three
 *   minor slots was its OWN peacetime suit, proposed at t1..t5 before any war and never answered.
 *
 * A peacetime suit is a question asked while the two courts were at peace. Once a war opens against
 * the suing court, that question's premise is dead: a war-time peace goes through the war-time offer
 * (WR-5's bilateral evaluator), never through a label step asked in peacetime. The docket therefore
 * RETIRES the stale row at the war's opening, through its own row-lifecycle writer
 * (proposalAdmission.js :: retireWarOvertakenPeaceSuits, composed into the tick's one docket-row
 * supersession seam, candidateEvents.js :: supersedeLegacyRecordModeProposals), and the docket's
 * read (buildProposalDocket) stops counting it in the same tick, so the court's lane frees at the
 * war's opening. The receipt is the estate's receipt for a retired proposal: the terminal
 * 'superseded' row with its stamp and reason, and its queued question leaving the feed
 * (worldPulseFeedCuration.js :: reconcileSupersededProposalNews). The exemption list
 * (ONE_SHOT_VERDICT_RULE_IDS) is untouched.
 *
 * The fixture is worldPulseSiegeInitiationDefer.test.js's: a mobilized city hostile to a village
 * opens a fresh siege on the real tick.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
// A namespace import, so the pin reds BY TITLE on the pre-cure tree (a missing named export would
// fail the whole file at link time and hide which arm the cure owes).
import * as admission from '../../src/domain/worldPulse/proposalAdmission.js';

const { buildProposalDocket, ONE_SHOT_VERDICT_RULE_IDS } = admission;

const NOW = '2026-01-01T00:00:00.000Z';

function fortifiedCity(name) {
  return {
    name, tier: 'city', population: 60000,
    config: { tradeRouteAccess: 'road', priorityMilitary: 40 },
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Forged Weapons' }], primaryImports: [], foodSecurity: { storageMonths: 9, resilienceScore: 85 } },
    powerStructure: {
      publicLegitimacy: { score: 88, label: 'Stable' },
      factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

function weakVillage(name) {
  return {
    name, tier: 'village', population: 280,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 24, label: 'Fragile' },
      factions: [
        { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
        { faction: 'Hedge Wardens', category: 'military', power: 18 },
      ],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const SAVES = [save('strong', 'Ironhold', fortifiedCity('Ironhold')), save('weak', 'Thornmere', weakVillage('Thornmere'))];
const EDGE = 'edge.strong.weak';

/** The chooser's peacetime suit, in the shape settlementStrategy.js's emitter gives it (no bilateral keys). */
function peacetimeSuit(sId, tick) {
  return {
    id: `candidate.strategy.sue_for_peace.${sId}.${tick}`,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: sId,
    severity: 0.9,
    probability: 1,
    applyMode: 'proposal',
    headline: `${sId} sues for peace`,
    summary: 'War-weary and economically drained, the court seeks to wind the conflict down.',
    reasons: ['The court can no longer pay for the quarrel it keeps.'],
    metadata: { settlementId: sId, strategyMove: 'sue_for_peace' },
    conflictTags: [`strategy:${sId}`, `label:${EDGE}`],
    generatedAtTick: tick,
    relationshipKey: EDGE,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: { kind: 'relationship_label_change', relationshipKey: EDGE, fromType: 'hostile', toType: 'cold_war', reason: 'The court sued for peace.' },
  };
}

/** Mint the suits as PENDING docket rows through the real proposal arm (record-identical rows + queued news). */
function mintRows(outcomes, tick) {
  const graph = ensureRegionalGraph({ edges: [{ id: EDGE, from: 'strong', to: 'weak', relationshipType: 'hostile' }], channels: [] });
  const worldState = {
    rngSeed: 'siege-init-seed', tick,
    relationshipStates: { [EDGE]: { relationshipType: 'hostile' } },
    warPosture: { strong: { state: 'mobilized', progress: 1, sinceTick: 0 } },
    simulationRules: { warLayerEnabled: true },
    proposals: [],
  };
  const minted = applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: SAVES.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement })) },
    worldState, regionalGraph: graph, wizardNews: { currentTick: tick, entries: [] },
    settlementMap: new Map(SAVES.map((s) => [s.id, { saveId: s.id, save: s, settlement: s.settlement }])),
    outcomes, tick, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules,
  });
  return { worldState: minted.worldState, regionalGraph: minted.regionalGraph, wizardNews: minted.wizardNews };
}

/** One real weekly tick from `tick`: the mobilized city opens a fresh siege on the village. */
function warTick(minted, tick) {
  const campaign = {
    id: 'peace1-stale-suit', settlementIds: ['strong', 'weak'],
    worldState: { ...minted.worldState, tick },
    regionalGraph: minted.regionalGraph,
    wizardNews: minted.wizardNews,
  };
  return { before: campaign.worldState, after: simulateCampaignWorldPulse({ campaign, saves: SAVES, interval: 'one_week', now: NOW }) };
}

const rowFor = (worldState, outcomeId) => (worldState.proposals || []).find((p) => p.outcome?.id === outcomeId);
const queuedFor = (feed, outcomeId) => (Array.isArray(feed) ? feed : feed?.entries || [])
  .filter((e) => e.kind === 'queued' && String(e.sourceEventId) === outcomeId);

describe('FP-17 — a peacetime suit retires when a war opens against its court, and the court\'s lane frees', () => {
  it('a court with a stale peacetime suit goes to war and its lane count drops by one', () => {
    const suit = peacetimeSuit('strong', 2);
    const minted = mintRows([suit], 2);
    expect(queuedFor(minted.wizardNews, suit.id), 'the suit\'s question is on the feed before the war').toHaveLength(1);
    const { before, after } = warTick(minted, 4);
    expect(rowFor(before, suit.id)?.status, 'the peacetime suit waits on the docket before the war').toBe('pending');
    expect(buildProposalDocket(before).bySettlement.strong).toEqual({ minor: 1, major: 0 });
    // The real tick opened the war: the city's army is in the field against the village.
    expect(after.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', sinceTick: 5 });
    const retired = rowFor(after.worldState, suit.id);
    expect(retired).toMatchObject({
      status: 'superseded',
      supersessionReason: 'peacetime_suit_overtaken_by_war',
      supersededAtTick: 5,
      supersededAt: NOW,
    });
    expect(admission.WAR_OVERTAKEN_PEACE_SUIT_REASON).toBe('peacetime_suit_overtaken_by_war');
    expect(buildProposalDocket(after.worldState).bySettlement.strong?.minor ?? 0,
      'the court\'s minor lane counts one row fewer').toBe(0);
    // anchored: the same outcome id's queued entry was counted as one before the tick, so this zero is the reconcile's.
    expect(queuedFor(after.wizardNews, suit.id)).toHaveLength(0);
  });

  it('the besieged court\'s own peacetime suit retires too: both courts are now at war with each other', () => {
    const suit = peacetimeSuit('weak', 3);
    const { after } = warTick(mintRows([suit], 3), 4);
    expect(after.worldState.deployments?.strong).toMatchObject({ targetId: 'weak', sinceTick: 5 });
    expect(rowFor(after.worldState, suit.id)).toMatchObject({ status: 'superseded', supersessionReason: 'peacetime_suit_overtaken_by_war' });
  });

  it('the opening tick\'s admission already sees the freed lane (the docket read skips the dead row before the writer runs)', () => {
    const suit = peacetimeSuit('strong', 2);
    const { worldState } = mintRows([suit], 2);
    const atWar = { ...worldState, tick: 5, deployments: { strong: { targetId: 'weak', sinceTick: 5, role: 'siege' } } };
    expect(admission.peacetimeSuitOvertakenByWar?.(rowFor(atWar, suit.id), atWar)).toBe(true);
    // anchored: the same row is counted as one minor in the peacetime world on the next line.
    expect(buildProposalDocket(atWar).bySettlement.strong?.minor ?? 0).toBe(0);
    expect(buildProposalDocket(worldState).bySettlement.strong).toEqual({ minor: 1, major: 0 });
  });

  it('a war-time suit, a bilateral offer, a court at peace and a non-suit question all keep their places', () => {
    const war = { targetId: 'weak', sinceTick: 5, role: 'siege' };
    const warTime = peacetimeSuit('strong', 5); // proposed in the war's own opening tick (the WR-1-dark war-time suit)
    const bilateral = {
      ...peacetimeSuit('strong', 2),
      id: 'candidate.strategy.sue_for_peace.strong.bilateral',
      proposalPayload: { ...peacetimeSuit('strong', 2).proposalPayload, peaceOffer: true, offererId: 'strong', targetId: 'weak', peaceFrontOwnerId: 'strong', peaceFrontSinceTick: 1 },
    };
    const atPeace = { ...peacetimeSuit('far', 2), metadata: { settlementId: 'far', strategyMove: 'sue_for_peace' } };
    const crime = { id: 'candidate.condition.crime.strong.2', type: 'condition', candidateType: 'crime_pressure', targetSaveId: 'strong', applyMode: 'proposal', severity: 0.8, probability: 1, headline: 'Criminal pressure may take hold', summary: 'Crime.', reasons: [] };
    const rows = [warTime, bilateral, atPeace, crime].map((outcome, i) => ({
      id: `row.${i}`, status: 'pending', recordModeVersion: 4, tick: Number(outcome.generatedAtTick ?? 2), outcome,
    }));
    const world = { tick: 6, deployments: { strong: war }, proposals: rows };
    for (const row of rows) {
      // anchored: the retiring arm is witnessed true on the real tick above; each of these four rows is outside the ruling.
      expect(admission.peacetimeSuitOvertakenByWar(row, world), row.outcome.id).toBe(false);
    }
    expect(admission.retireWarOvertakenPeaceSuits(world, { tick: 6, now: NOW }), 'nothing to retire ⇒ the same reference').toBe(world);
    expect(buildProposalDocket(world).bySettlement.strong).toEqual({ minor: 3, major: 0 });
  });

  it('dark or at peace, the writer is the identity: no deployment ⇒ the same world reference', () => {
    const { worldState } = mintRows([peacetimeSuit('strong', 2)], 2);
    expect(admission.retireWarOvertakenPeaceSuits(worldState, { tick: 3, now: NOW })).toBe(worldState);
    expect(admission.retireWarOvertakenPeaceSuits({ ...worldState, deployments: {} }, { tick: 3, now: NOW }).proposals).toBe(worldState.proposals);
  });

  it('the docket\'s exemption list is untouched: the one-shot verdicts stay the whole bypass', () => {
    expect([...ONE_SHOT_VERDICT_RULE_IDS]).toEqual(['coup_verdict_fall', 'coup_verdict_hold']);
  });
});
