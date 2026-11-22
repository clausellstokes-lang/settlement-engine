/**
 * sueForPeaceOfferPeace1.test.js — CURE LANE FP-PEACE-1, unit U4 (the chair's ruling FP-19, vetoable: a
 * DM-facing behaviour change recorded for the owner's veto; findings/FP-PEACE-SUIT.md §0 item 5, §4 and §6 C5):
 *
 *   The DM's SUE_FOR_PEACE was issued 6 times on live wars; all 6 were applied, and all 6 only recalled the
 *   army. No relationship incident, no label step, no treaty; the war started again in 2 of the 4 seeds.
 *
 * The verb's executor (realmVerbExecution.js, case SUE_FOR_PEACE) now also writes the peace offer the tick's
 * own suit would write, through the ONE offer writer (settlementStrategy.js :: peaceSuitCandidate, which the
 * chooser's emitMove now calls too), and hands it to the apply mouth as the order's substitute outcome, the
 * precedent the lifecycle verbs set. The standing lanes then answer it: with WR-1 lit, WR-5's target court
 * decides (a yes steps the label and writes the incident the one treaty writer reads; a no is priced); with
 * WR-1 dark, the approval IS the peace, exactly as an approved organic suit is. The recall stays.
 *
 * The world is warPeaceDecision.test.js's: Ember besieges Vale over a hostile edge.
 */
import { describe, expect, it } from 'vitest';

import { mintRealmVerbProposal, applyWorldPulseProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
// A namespace import, so the pin reds BY TITLE on the pre-cure tree (the writer's export is this unit's).
import * as strategy from '../../src/domain/worldPulse/settlementStrategy.js';
import { readWarTerminationForParty } from '../../src/domain/worldPulse/warTermination.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';
const KEY = 'edge.offerer.target';
const EDGE = { id: KEY, from: 'offerer', to: 'target', relationshipType: 'hostile' };
const WR1_LIT = { warLayerEnabled: true, warTerminationEnabled: true, peaceEngineEnabled: true };
const WR1_DARK = { warLayerEnabled: true, peaceEngineEnabled: true };

function save(id, name, population) {
  return {
    id, name, phase: 'canon',
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
    settlement: {
      name, tier: 'town', population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
  };
}

const SAVES = [save('offerer', 'Ember', 1000), save('target', 'Vale', 12000)];

/** Ember's army at Vale's walls since t3; `spent` makes Vale's court take a peace (its WR-1 pressure over ACCEPT_AT). */
function campaign(rules, { spent = true, edges = [EDGE] } = {}) {
  return {
    id: 'peace1-verb-offer', settlementIds: ['offerer', 'target'],
    worldState: {
      rngSeed: 'peace1-verb-offer', tick: 12,
      simulationRules: { ...rules },
      relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
      deployments: {
        offerer: { targetId: 'target', sinceTick: 3, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [] },
      },
      warExhaustion: { target: spent ? 1 : 0 },
      spatialLedgers: { warReasons: {} },
      proposals: [],
    },
    regionalGraph: ensureRegionalGraph({ edges, channels: [] }, { now: NOW }),
    wizardNews: { currentTick: 12, entries: [] },
  };
}

/** The DM's order through the product's two roads: the realm-verb mint, then the Apply button path. */
function sueByDecree(base) {
  const minted = mintRealmVerbProposal({ campaign: base, saves: SAVES, verb: 'SUE_FOR_PEACE', args: { partyId: 'offerer' }, now: NOW });
  expect(minted.ok, 'the order is staged').toBe(true);
  const staged = { ...base, worldState: minted.result.worldState, wizardNews: minted.result.wizardNews };
  const applied = applyWorldPulseProposal({ campaign: staged, saves: SAVES, proposalId: minted.proposalId, now: NOW });
  const after = { ...staged, worldState: applied.worldState, regionalGraph: applied.regionalGraph || staged.regionalGraph, wizardNews: applied.wizardNews };
  return { applied, after, proposalId: minted.proposalId };
}

/** One real weekly pulse after the answer: the war layer resolves the recall, the one treaty writer mints. */
const nextWeek = (after) => simulateCampaignWorldPulse({ campaign: after, saves: SAVES, interval: 'one_week', now: NOW });
const offerOf = (applied) => (applied.autoApplied || []).find((o) => o.candidateType === 'strategy_sue_for_peace');
const treatiesOf = (worldState) => Object.keys(worldState?.spatialLedgers?.treaties || {});

describe('FP-19 — the DM\'s SUE_FOR_PEACE is a real peace offer, and the recall stays', () => {
  it('the verb on a live war yields the court\'s offer from the one offer writer, and when the target answers yes, a treaty', () => {
    const { applied, after, proposalId } = sueByDecree(campaign(WR1_LIT));
    const offer = offerOf(applied);
    expect(offer, 'the order carried the court\'s offer into the apply').toBeTruthy();
    expect(offer).toMatchObject({
      id: 'candidate.strategy.sue_for_peace.offerer.12',
      targetSaveId: 'offerer',
      proposalPayload: { kind: 'relationship_label_change', fromType: 'hostile', toType: 'cold_war', peaceOffer: true, offererId: 'offerer', targetId: 'target', peaceFrontSinceTick: 3 },
    });
    expect(offer.metadata?.peaceDecision?.decision, 'WR-5\'s target court answered').toBe('accept');
    expect(after.worldState.relationshipStates[KEY].relationshipType, 'the accepted peace stepped the label').toBe('cold_war');
    expect((after.worldState.relationshipStates[KEY].recentIncidents || []).some((i) => /sue_for_peace/.test(String(i?.type))),
      'the incident the one treaty writer reads').toBe(true);
    expect(after.worldState.deployments.offerer.recalled?.cause, 'the recall stays the decree\'s').toBe('sue_for_peace_decree');
    expect(after.worldState.proposals.find((p) => p.id === proposalId)?.status).toBe('applied');

    const week = nextWeek(after);
    expect(treatiesOf(week.worldState).length, 'the treaty writer fired within its window').toBe(1);
    // anchored: the army stood at the walls with its recall stamped on the line checked above, so its absence is the withdrawal.
    expect(week.worldState.deployments?.offerer).toBeUndefined();
  });

  it('a court that answers no prices the refusal, keeps its war label, and the recall still stands', () => {
    const { applied, after } = sueByDecree(campaign(WR1_LIT, { spent: false }));
    const refusal = (applied.autoApplied || []).find((o) => o.candidateType === 'peace_refused');
    expect(refusal?.metadata?.peaceDecision?.decision, 'WR-5 priced a no').toBe('refuse');
    expect(after.worldState.relationshipStates[KEY].relationshipType).toBe('hostile');
    expect(after.worldState.deployments.offerer.recalled?.cause).toBe('sue_for_peace_decree');
    // anchored: the accepting twin above mints one treaty from this world; a refusal leaves the pair hostile, which the writer skips.
    expect(treatiesOf(nextWeek(after).worldState)).toHaveLength(0);
  });

  it('WR-1 dark: the order is the approved suit itself, as an approved organic suit is, and the treaty follows', () => {
    const { applied, after } = sueByDecree(campaign(WR1_DARK));
    const offer = offerOf(applied);
    expect(offer?.proposalPayload?.peaceOffer, 'no bilateral marker when WR-1 is dark').toBeUndefined();
    expect(after.worldState.relationshipStates[KEY].relationshipType).toBe('cold_war');
    expect(after.worldState.deployments.offerer.recalled?.cause).toBe('sue_for_peace_decree');
    expect(treatiesOf(nextWeek(after).worldState).length).toBe(1);
  });

  it('WR-1 lit but the front has no clock: the order never speaks for the other court, and keeps its recall', () => {
    const base = campaign(WR1_LIT);
    base.worldState.deployments.offerer = { ...base.worldState.deployments.offerer, sinceTick: null };
    const { applied, after } = sueByDecree(base);
    // anchored: the first arm above finds the offer by this same finder, so its absence here is the refused bilateral form.
    expect(offerOf(applied)).toBeUndefined();
    expect(after.worldState.relationshipStates[KEY].relationshipType, 'no label step without the other court').toBe('hostile');
    expect(after.worldState.deployments.offerer.recalled?.cause).toBe('sue_for_peace_decree');
  });

  it('with no edge to step down, the order keeps its recall-only path: no offer, no refusal code', () => {
    const { applied, after } = sueByDecree(campaign(WR1_LIT, { edges: [] }));
    // anchored: the first arm above finds the offer by this same finder, so its absence here is the missing edge's.
    expect(offerOf(applied)).toBeUndefined();
    expect(after.worldState.deployments.offerer.recalled?.cause).toBe('sue_for_peace_decree');
    // anchored: the order's own news is present on the next line, so an absent refusal is the order's success.
    expect((applied.newsEntries || []).some((n) => n.impactKind === 'realm_verb_refused')).toBe(false);
    expect((applied.newsEntries || []).some((n) => /ordered home/.test(String(n.summary)))).toBe(true);
  });

  it('the one offer writer: the chooser\'s organic suit is peaceSuitCandidate\'s, field for field', () => {
    const base = campaign(WR1_LIT);
    const snap = buildWorldSnapshot({ campaign: base, saves: SAVES, worldState: base.worldState });
    const pIdx = pressureIndex(deriveSettlementPressures(snap));
    const termination = readWarTerminationForParty({ worldState: snap.worldState, snapshot: snap, pIndex: pIdx, tick: 12, actorId: 'offerer', opponentId: 'target' });
    const certain = { ...termination, suePressure01: 1 };
    const organic = evaluateSettlementStrategyRules(snap, pIdx, {
      tick: 12, simulationRules: { ...WR1_LIT, settlementStrategyEnabled: true }, warTerminationByAttacker: new Map([['offerer', certain]]),
    }).find((c) => c.targetSaveId === 'offerer' && c.candidateType === 'strategy_sue_for_peace');
    expect(organic?.proposalPayload?.peaceOffer).toBe(true);
    expect(strategy.peaceSuitCandidate?.({
      sId: 'offerer', name: 'Ember', target: 'target', snapshot: snap, tick: 12, worldState: snap.worldState, termination: certain,
    })).toEqual(organic);
  });
});
