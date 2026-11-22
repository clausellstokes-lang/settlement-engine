/**
 * warTimeSuitAdmittedPeace2.test.js — CURE UNIT FP-PEACE-2, unit U2 (the chair's ruling FP-22, taken under the
 * owner's word of 2026-09-24, "Again, I leave all judgment to you"; findings/FP-PEACE-SUIT.md §0 item 2, §3 rung
 * R7, §6 C1):
 *
 *   The courts chose the suit on 11 of 46 attacking-court ticks in 5 of the 6 lit wars, and the DM docket refused
 *   all 11 at the suing court's own minor lane, full at 3 of 3 (proposalAdmission.js :: proposalDocketAllows,
 *   refused at candidateEvents.js :: rollCandidates).
 *
 * The docket's exemption list gains its second member, made under the owner's 2026-09-24 word OVER the owner's
 * 2026-07-30 ruling that set it: a WAR-TIME PEACE SUIT (the chooser's bilateral offer, which the one offer writer
 * marks only while its court holds a live front against the court it sues) is exempt from the PER-COURT MINOR-LANE
 * cap. THE REALM LANE CAP IS NOT LIFTED. The list's first member, the one-shot verdicts, is untouched and still
 * lifts every cap in the guaranteed mouth; the suit is a stochastic candidate, so its member is read where the
 * refusal was taken.
 *
 * The world is sueForPeaceOfferPeace1.test.js's: Ember besieges Vale over a hostile edge, the war rulings lit.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { rollCandidates } from '../../src/domain/worldPulse/candidateEvents.js';
import { peaceSuitCandidate } from '../../src/domain/worldPulse/settlementStrategy.js';
import { isBilateralPeaceOffer } from '../../src/domain/worldPulse/warPeaceDecision.js';
import { readWarTerminationForParty } from '../../src/domain/worldPulse/warTermination.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
// A namespace import, so the pin reds BY TITLE on the pre-cure tree (the predicate's export is this unit's).
import * as admission from '../../src/domain/worldPulse/proposalAdmission.js';

const { buildProposalDocket, ONE_SHOT_VERDICT_RULE_IDS, PROPOSAL_DOCKET_POLICY } = admission;

const NOW = '2026-01-01T00:00:00.000Z';
const KEY = 'edge.offerer.target';
const EDGE = { id: KEY, from: 'offerer', to: 'target', relationshipType: 'hostile' };
const WR1_LIT = { warLayerEnabled: true, warTerminationEnabled: true, peaceEngineEnabled: true };
const WR1_DARK = { warLayerEnabled: true, peaceEngineEnabled: true };
const TICK = 12;

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

/** Ember's army at Vale's walls since t3 when `atWar`; the same two courts at peace otherwise. */
function world(rules, { atWar = true } = {}) {
  const campaign = {
    id: 'peace2-war-time-suit', settlementIds: ['offerer', 'target'],
    worldState: {
      rngSeed: 'peace2-war-time-suit', tick: TICK,
      simulationRules: { ...rules },
      relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
      deployments: atWar
        ? { offerer: { targetId: 'target', sinceTick: 3, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [] } }
        : {},
      warExhaustion: { target: 1 },
      spatialLedgers: { warReasons: {} },
      proposals: [],
    },
    regionalGraph: ensureRegionalGraph({ edges: [EDGE], channels: [] }, { now: NOW }),
    wizardNews: { currentTick: TICK, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves: SAVES, worldState: campaign.worldState });
}

/** The court's suit, through the ONE offer writer (settlementStrategy.js :: peaceSuitCandidate). */
function suitFrom(snap) {
  const atWar = !!snap.worldState.deployments?.offerer;
  const termination = atWar
    ? readWarTerminationForParty({ worldState: snap.worldState, snapshot: snap, pIndex: pressureIndex(deriveSettlementPressures(snap)), tick: TICK, actorId: 'offerer', opponentId: 'target' })
    : null;
  return peaceSuitCandidate({ sId: 'offerer', name: 'Ember', target: 'target', snapshot: snap, tick: TICK, worldState: snap.worldState, termination });
}

/** A routine minor question of a court's own peace, shaped like a condition producer's. */
function routine(kind, sId, n = 0) {
  return {
    id: `candidate.condition.${kind}.${sId}.${n}`, type: 'condition', candidateType: kind, ruleFamily: 'condition',
    targetSaveId: sId, severity: 0.5, probability: 1, applyMode: 'proposal',
    headline: `Unrest may gather in ${sId}`, summary: 'A question for the table.', reasons: [],
  };
}

const row = (outcome, i) => ({ id: `row.${i}`, status: 'pending', recordModeVersion: 4, tick: 2, outcome });
/** The suing court's own minor lane full at three of three, the realm lane with room. */
const COURT_FULL = { tick: TICK, proposals: ['crime_pressure', 'faction_unrest', 'food_pressure'].map((k, i) => row(routine(k, 'offerer'), i)) };
/** The realm's minor lane full at twelve of twelve across other courts, the suing court's lane empty. */
const REALM_FULL = { tick: TICK, proposals: Array.from({ length: 12 }, (_, i) => row(routine('crime_pressure', `court-${i}`, i), i)) };

const pass = { random: () => 0 };
const roll = (candidates, docket) => rollCandidates(candidates, pass, { maxAuto: 5, maxProposals: 5, proposalDocket: docket });
const ids = (result) => result.selected.map((c) => c.id);

describe('FP-22 U2 — a war-time peace suit is exempt from the per-court minor-lane cap; the realm lane cap is not lifted', () => {
  it('a court with a full minor lane sues in war and the suit is admitted, while its routine question still waits', () => {
    const suit = suitFrom(world(WR1_LIT));
    expect(suit?.proposalPayload, 'the one offer writer marked the war-time offer').toMatchObject({ peaceOffer: true, offererId: 'offerer', targetId: 'target', peaceFrontSinceTick: 3 });
    const docket = buildProposalDocket(COURT_FULL, 2);
    expect(docket.bySettlement.offerer).toEqual({ minor: PROPOSAL_DOCKET_POLICY.perSettlementMinorPending, major: 0 });
    const question = routine('crime_pressure', 'offerer', 9);
    const result = roll([question, suit], docket);
    expect(ids(result)).toEqual([suit.id]);
    // The suit records its occupancy: the court's lane carries it above its cap, as a verdict is carried.
    expect(result.proposalDocket.bySettlement.offerer).toEqual({ minor: 4, major: 0 });
    expect(result.proposalDocket.counts.minor).toBe(4);
  });

  it('the same suit in peacetime is refused: the one offer writer does not mark it, and the full lane binds it', () => {
    const suit = suitFrom(world(WR1_LIT, { atWar: false }));
    expect(suit?.candidateType).toBe('strategy_sue_for_peace');
    expect(suit.proposalPayload.peaceOffer, 'a peacetime suit carries no war-time marker').toBeUndefined();
    // anchored: the war-time twin above is admitted from this same docket, so this empty roll is the court's cap.
    expect(roll([suit], buildProposalDocket(COURT_FULL, 2)).selected).toEqual([]);
    expect(ids(roll([suit], buildProposalDocket({ tick: TICK, proposals: [] }, 2))), 'with room, the peacetime suit is admissible').toEqual([suit.id]);
  });

  it('the realm lane cap is NOT lifted: a war-time suit waits when the realm\'s minor lane is full', () => {
    const suit = suitFrom(world(WR1_LIT));
    const realmFull = buildProposalDocket(REALM_FULL, 2);
    expect(realmFull.counts.minor).toBe(PROPOSAL_DOCKET_POLICY.baseMinorPending);
    // anchored: the same suit is admitted past the court's full lane in the first arm, so this empty roll is the realm cap's.
    expect(roll([suit], realmFull).selected).toEqual([]);
    const both = buildProposalDocket({ tick: TICK, proposals: [...REALM_FULL.proposals, ...COURT_FULL.proposals] }, 2);
    // anchored: the first arm admits this suit, so refusing it here is the realm lane binding it.
    expect(roll([suit], both).selected).toEqual([]);
  });

  it('dark: with the war rulings dark the one offer writer marks nothing, so the court\'s cap binds the suit as before', () => {
    const snap = world(WR1_DARK);
    const suit = peaceSuitCandidate({ sId: 'offerer', name: 'Ember', target: 'target', snapshot: snap, tick: TICK, worldState: snap.worldState, termination: null });
    expect(suit.proposalPayload.peaceOffer, 'no bilateral marker when WR-1 is dark').toBeUndefined();
    // anchored: the lit war-time suit from the same court is admitted past this same docket in the first arm.
    expect(roll([suit], buildProposalDocket(COURT_FULL, 2)).selected).toEqual([]);
  });

  it('the list\'s second member lifts only the court\'s minor lane: the one-shot list is untouched, and the predicate is the bilateral reader\'s', () => {
    expect([...ONE_SHOT_VERDICT_RULE_IDS]).toEqual(['coup_verdict_fall', 'coup_verdict_hold']);
    const war = suitFrom(world(WR1_LIT));
    const peace = suitFrom(world(WR1_LIT, { atWar: false }));
    expect(admission.isOneShotVerdictOutcome(war), 'a war-time suit is not a verdict: its war re-derives it').toBe(false);
    const forms = [
      war, peace, routine('crime_pressure', 'offerer'),
      { ...war, proposalPayload: { ...war.proposalPayload, kind: 'siege_initiation' } },
      { ...war, candidateType: 'strategy_deploy' },
      { ...peace, proposalPayload: { ...peace.proposalPayload, peaceOffer: 'true' } },
      null, {},
    ];
    for (const form of forms) {
      expect(admission.isWarTimePeaceSuit?.(form), JSON.stringify(form?.proposalPayload ?? form)).toBe(isBilateralPeaceOffer(form));
    }
    expect(admission.isWarTimePeaceSuit(war)).toBe(true);
    // The exemption is the court's MINOR lane only (FP-22's letter): a marked suit the classifier read as a MAJOR
    // (here by the structural marker decisionTier.js reads) still meets the court's one major place.
    const heldMajor = { ...routine('faction_government_challenge', 'offerer'), candidateType: 'faction_government_challenge', proposalPayload: { kind: 'government_change' } };
    const docket = buildProposalDocket({ tick: TICK, proposals: [row(heldMajor, 0)] }, 2);
    expect(docket.bySettlement.offerer).toEqual({ minor: 0, major: 1 });
    const markedMajor = { ...war, id: 'marked.major', type: 'power_transfer', powerTransfer: { cause: 'coup' } };
    expect(admission.isWarTimePeaceSuit(markedMajor)).toBe(true);
    // anchored: the same docket admits the minor war-time suit on the next line, so this refusal is the major lane's own cap.
    expect(admission.proposalDocketAllows(docket, markedMajor)).toBe(false);
    expect(admission.proposalDocketAllows(docket, war)).toBe(true);
  });

  it('the exemption list\'s own comment records the addition once, as made under the 2026-09-24 word over the 2026-07-30 ruling', () => {
    const source = readFileSync(new URL('../../src/domain/worldPulse/proposalAdmission.js', import.meta.url), 'utf8');
    const listComment = source.slice(source.lastIndexOf('/**', source.indexOf('export const ONE_SHOT_VERDICT_RULE_IDS')), source.indexOf('export const ONE_SHOT_VERDICT_RULE_IDS'));
    expect(listComment).toContain('OWNER RULING 2026-07-30');
    expect(listComment.split('FP-22').length - 1, 'the addition is recorded exactly once in the list\'s comment').toBe(1);
    expect(listComment).toContain('Again, I leave all judgment to you');
    expect(listComment).toContain('THE REALM LANE CAP IS NOT LIFTED');
  });
});
