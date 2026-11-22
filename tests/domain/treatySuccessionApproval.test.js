import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({ saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false } }));
vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: { loadCached: vi.fn(() => []), cache: vi.fn(), list: vi.fn(() => Promise.resolve([])), upsert: vi.fn(() => Promise.resolve()), delete: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async (importOriginal) => ({ ...(await importOriginal()), track: vi.fn() }));

import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { advanceTreaties, TERM_CATALOG, treatyBlocksWar, treatyPairKey } from '../../src/domain/worldPulse/peaceTerms.js';
import { answerSuccessionQuestions, repudiableTreatyPairs } from '../../src/domain/worldPulse/treatyBreach.js';
import {
  resolveSuccessionQuestions, successionQuestionKey,
  SUCCESSION_QUESTION_PAYLOAD_KIND,
} from '../../src/domain/worldPulse/treatySuccessionDecision.js';
import { claimsSuccessionQuestionNamespace } from '../../src/domain/worldPulse/treatySuccessionProposalApply.js';
import { applyWorldPulseProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { autoAdjudicateAdvanceProposals } from '../../src/domain/worldPulse/autoAdjudication.js';
import {
  ACTOR_INITIATED_MAJOR_TYPES, ACTOR_MAJOR_TERMINALS, SUCCESSION_QUESTION_TERMINALS, actorMajorTerminalFor,
  expireStaleActorMajors, pendingActorMajorFor,
} from '../../src/domain/worldPulse/actorMajorApproval.js';
import { ensureWorldState, upsertProposal, updateProposalStatus } from '../../src/domain/worldPulse/worldState.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { scoreTreatyDefault } from '../../src/domain/worldPulse/warReasons.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 20;
const KEY = treatyPairKey('crown', 'march');
const RULES = { warLayerEnabled: true, peaceEngineEnabled: true, oathHolderEnabled: true, routineMajorApproval: true };
const copy = value => JSON.parse(JSON.stringify(value));
const reversedRecord = value => Object.fromEntries(Object.entries(value).reverse());

function term(burden01 = 0.9, type = 'tribute') {
  const spec = TERM_CATALOG[type];
  return { type, family: spec.family, magnitude: 0.4, mintedTick: 0, expiresTick: 60,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01,
    receipt: 'tribute term', deliveredToVictor: 0, extractedFromLoser: 0 };
}

function treaty({ burden01 = 0.9, key = KEY, parties = ['crown', 'march'] } = {}) {
  return [key, { parties, victorId: 'crown', loserId: 'march', victorName: 'Crown', loserName: 'March',
    mintedTick: 0, believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'], terms: [term(burden01)],
    sworn: { march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 } } }];
}

function world({ burden01 = 0.9, rules = RULES, treaties = null, proposals = null } = {}) {
  const [key, record] = treaty({ burden01 });
  return {
    rngSeed: 'gr4d', tick: TICK, simulationRules: { ...rules }, calendar: { elapsedWeeks: TICK },
    deployments: {}, relationshipStates: {}, ...(proposals ? { proposals } : {}),
    spatialLedgers: {
      treaties: treaties || { [key]: record },
      npcLadder: { march: { factions: {}, npcs: {}, seatTransitions: [{ id: 'seat.1', fromRulerId: 'npc_old', toRulerId: 'npc_new', cause: 'coup', tick: TICK }] } },
    },
  };
}

function queued(source = world()) { return resolveSuccessionQuestions(source, TICK, NOW).worldState; }
function saves() {
  return [
    { id: 'crown', name: 'Crown', phase: 'canon', settlement: { name: 'Crown', tier: 'city', population: 60000, institutions: [], npcs: [], activeConditions: [], powerStructure: { factions: [] } }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    { id: 'march', name: 'March', phase: 'canon', settlement: { name: 'March', tier: 'town', population: 1800, institutions: [], npcs: [], activeConditions: [], powerStructure: { factions: [] } }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
  ];
}
function campaign(worldState) {
  return { id: 'camp-gr4d', settlementIds: ['crown', 'march'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }), wizardNews: { currentTick: TICK, entries: [] } };
}
function proposalOf(state) { return state.proposals.find(row => row.outcome?.proposalPayload?.kind === SUCCESSION_QUESTION_PAYLOAD_KIND); }
function brokenTreaty(state) { return getSpatialLedger(state, 'treaties')[KEY]; }
function localStorageStub() {
  const data = new Map();
  globalThis.localStorage = { getItem: key => data.get(String(key)) ?? null, setItem: (key, value) => data.set(String(key), String(value)), removeItem: key => data.delete(String(key)), clear: () => data.clear() };
}
function storeWith(state) {
  const stub = { savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft', eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null };
  const store = create(immer((...args) => ({ ...stub, ...createCampaignSlice(...args), ...createCampaignWorldPulseSlice(...args) })));
  store.setState(draft => { draft.savedSettlements = saves(); draft.campaigns = [campaign(state)]; });
  return store;
}

describe('GR-4d — the lit succession decision', () => {
  beforeEach(() => localStorageStub());

  it('lit routine mode queues one plain succession decision and leaves the oath untouched', () => {
    const source = world();
    const result = resolveSuccessionQuestions(source, TICK, NOW);
    const row = proposalOf(result.worldState);
    expect(row).toMatchObject({ status: 'pending', recordModeVersion: 4, tick: TICK, createdAt: NOW, updatedAt: NOW });
    expect(row.outcome).toMatchObject({ id: row.outcome.candidateId, candidateType: 'treaty_breached', type: 'treaty', applyMode: 'proposal', targetSaveId: 'march', affectedSettlementIds: ['march', 'crown'], openedTick: TICK });
    expect(row.outcome.proposalPayload).toEqual({ kind: 'succession_question', schemaVersion: 1, openedTick: TICK,
      questionKey: successionQuestionKey(row.outcome.proposalPayload.question, TICK), question: row.outcome.proposalPayload.question,
      terminals: { applied: 'disavow', dismissed: 'honor', expired: 'honor' } });
    expect(result.newsEntries).toEqual([]);
    expect(brokenTreaty(result.worldState)).toMatchObject({ complianceState: 'honored', terms: brokenTreaty(source).terms, sworn: brokenTreaty(source).sworn });
    expect(brokenTreaty(result.worldState).breachType).toBeUndefined();
    expect(result.worldState.rngSeed).toBe(source.rngSeed);
    const withoutDocket = state => { const value = copy(state); delete value.proposals; return value; };
    expect(withoutDocket(result.worldState)).toEqual(withoutDocket(ensureWorldState(source)));
  });

  it('hand Apply and engine-auto mean DISAVOW and speak the act exactly once', () => {
    const docket = queued();
    const row = proposalOf(docket);
    const hand = applyWorldPulseProposal({ campaign: campaign(docket), saves: saves(), proposalId: row.id, now: NOW });
    expect(brokenTreaty(hand.worldState)).toMatchObject({ breachType: 'succession_repudiation', defaultSeverity01: 0.35, defaultedBy: 'march' });
    expect(hand.newsEntries.filter(entry => entry.impactKind === 'disavowed_by_succession')).toHaveLength(1);
    expect(hand.newsEntries).toHaveLength(1);
    expect(proposalOf(hand.worldState).status).toBe('applied');
    expect(proposalOf(hand.worldState).adjudicatedBy).toBeUndefined();
    const auto = autoAdjudicateAdvanceProposals({ campaign: campaign(world()), saves: saves(), now: NOW,
      result: { ok: true, worldState: docket, regionalGraph: campaign(docket).regionalGraph, wizardNews: campaign(docket).wizardNews, proposals: [row], settlementUpdates: [], autoApplied: [], newsEntries: [] } });
    expect(brokenTreaty(auto.worldState)).toEqual(brokenTreaty(hand.worldState));
    expect(auto.newsEntries.filter(entry => entry.impactKind === 'disavowed_by_succession')).toHaveLength(1);
    expect(proposalOf(auto.worldState)).toMatchObject({ status: 'applied', adjudicatedBy: 'engine_auto' });
    expect(repudiableTreatyPairs(world(), TICK)).toEqual([]);
    const effectsSource = world({ rules: { ...RULES, infoStatecraftEnabled: true, infoMode: 'unreliable' } });
    effectsSource.spatialCanonVersion = 1;
    brokenTreaty(effectsSource).terms.push(term(0.9, 'non_aggression'));
    expect(treatyBlocksWar(effectsSource, 'crown', 'march', TICK)).toBe(true);
    const effectsDocket = queued(effectsSource);
    const effectsRow = proposalOf(effectsDocket);
    const effects = applyWorldPulseProposal({ campaign: campaign(effectsDocket), saves: saves(), proposalId: effectsRow.id, now: NOW });
    expect(treatyBlocksWar(effects.worldState, 'crown', 'march', TICK)).toBe(false);
    expect(scoreTreatyDefault({ treaties: [brokenTreaty(effects.worldState)], fromId: 'crown', toId: 'march' }, 'gr4d').score).toBe(0.35);
    expect(getSpatialLedger(effects.worldState, 'credibility').march.score).toBeLessThan(0);
  });

  it('Dismiss and six-week expiry mean HONOR while another actor-major still declines', async () => {
    expect(Array.isArray(ACTOR_INITIATED_MAJOR_TYPES)).toBe(true);
    expect(Object.isFrozen(ACTOR_INITIATED_MAJOR_TYPES)).toBe(true);
    expect(Object.isFrozen(SUCCESSION_QUESTION_TERMINALS)).toBe(true);
    expect(Object.isFrozen(ACTOR_MAJOR_TERMINALS)).toBe(true);
    const docket = queued();
    const row = proposalOf(docket);
    const store = storeWith(docket);
    await store.getState().dismissWorldPulseProposal('camp-gr4d', row.id);
    const dismissed = proposalOf(store.getState().campaigns[0].worldState);
    expect(dismissed.status).toBe('dismissed');
    expect(actorMajorTerminalFor(dismissed.outcome.proposalPayload.kind, dismissed.status)).toBe('honor');
    expect(brokenTreaty(store.getState().campaigns[0].worldState)).toEqual(brokenTreaty(docket));
    const ordinary = { id: 'ordinary', status: 'pending', tick: 0, updatedAt: NOW, outcome: { candidateType: 'strategy_deploy', targetSaveId: 'crown' } };
    const aged = expireStaleActorMajors({ ...docket, proposals: [{ ...row, tick: 0 }, ordinary] }, 6, NOW, 1);
    expect(actorMajorTerminalFor(proposalOf(aged).outcome.proposalPayload.kind, proposalOf(aged).status)).toBe('honor');
    expect(actorMajorTerminalFor(null, aged.proposals.find(p => p.id === 'ordinary').status)).toBe('decline');
    const flood = Array.from({ length: 80 }, (_, index) => index === 0 ? row : ({ ...ordinary, id: `ordinary.${index}` }));
    const overflow = upsertProposal({ ...docket, proposals: flood }, { ...ordinary, id: 'ordinary.new', updatedAt: NOW });
    const evicted = proposalOf(overflow);
    expect(evicted).toMatchObject({ status: 'expired', evictionReason: 'ring_overflow' });
    expect(actorMajorTerminalFor(evicted.outcome.proposalPayload.kind, evicted.status)).toBe('honor');
  });

  it('dark scoring, lit below-band HONOR, and absent or false gates remain byte-identical', () => {
    const oathDark = world({ rules: { ...RULES, oathHolderEnabled: false } });
    expect(resolveSuccessionQuestions(oathDark, TICK, NOW)).toEqual({ worldState: oathDark, newsEntries: [] });
    expect(resolveSuccessionQuestions(oathDark, TICK, NOW).worldState).toBe(oathDark);
    const oathAbsent = world(); delete oathAbsent.simulationRules.oathHolderEnabled;
    expect(resolveSuccessionQuestions(oathAbsent, TICK, NOW).worldState).toBe(oathAbsent);
    const directSource = world({ rules: { ...RULES, routineMajorApproval: false } });
    const direct = resolveSuccessionQuestions(copy(directSource), TICK, NOW);
    const landed = answerSuccessionQuestions(copy(directSource), TICK);
    expect(direct).toEqual(landed);
    const routineAbsent = world(); delete routineAbsent.simulationRules.routineMajorApproval;
    expect(resolveSuccessionQuestions(copy(routineAbsent), TICK, NOW)).toEqual(answerSuccessionQuestions(copy(routineAbsent), TICK));
    const honor = world({ burden01: 0.2 });
    const honored = resolveSuccessionQuestions(honor, TICK, NOW);
    expect(honored.worldState).toBe(honor);
    expect(honored.newsEntries).toEqual([]);
  });

  it('question identity is order-stable, per instrument, and terminal rows do not reopen', () => {
    const first = treaty({ key: 'instrument.a' });
    const second = treaty({ key: 'instrument.b' });
    const random = vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('GR-4d must not draw'); });
    const forward = queued(world({ treaties: { [first[0]]: first[1], [second[0]]: second[1] } }));
    const reverse = queued(world({ treaties: { [second[0]]: second[1], [first[0]]: first[1] } }));
    random.mockRestore();
    expect(forward.proposals.map(p => p.id)).toEqual(reverse.proposals.map(p => p.id));
    expect(new Set(forward.proposals.map(p => p.id)).size).toBe(2);
    const generic = { id: 'generic', status: 'pending', outcome: { candidateType: 'treaty_breached', targetSaveId: 'march' } };
    const coexist = queued(world({ proposals: [generic] }));
    expect(coexist.proposals).toHaveLength(2);
    expect(pendingActorMajorFor(coexist, 'treaty_breached', 'march')).toBe(true);
    const successionOnly = { ...coexist, proposals: [proposalOf(coexist)] };
    expect(pendingActorMajorFor(successionOnly, 'treaty_breached', 'march')).toBe(false);
    const malformedWar = { ...coexist, proposals: [{ id: 'war', status: 'pending', outcome: { candidateType: 'strategy_deploy', targetSaveId: 'march', proposalPayload: { kind: 'succession_question' } } }] };
    expect(pendingActorMajorFor(malformedWar, 'strategy_deploy', 'march')).toBe(true);
    for (const status of ['applied', 'dismissed', 'expired', 'refused', 'superseded']) {
      const terminal = updateProposalStatus(coexist, proposalOf(coexist).id, status, { updatedAt: NOW });
      expect(resolveSuccessionQuestions(terminal, TICK, NOW).worldState).toBe(terminal);
    }
    const row = proposalOf(coexist);
    const keyCollision = { ...coexist, proposals: [{ ...row, id: `${row.id}.tampered` }] };
    expect(resolveSuccessionQuestions(keyCollision, TICK, NOW).worldState).toBe(keyCollision);
    const malformedKeyCollision = copy(keyCollision);
    delete proposalOf(malformedKeyCollision).outcome.proposalPayload.terminals;
    expect(resolveSuccessionQuestions(malformedKeyCollision, TICK, NOW).worldState).toBe(malformedKeyCollision);
    const idCollision = copy(coexist); idCollision.proposals.find(p => p.id === row.id).outcome.proposalPayload.questionKey = 'wrong';
    expect(resolveSuccessionQuestions(idCollision, TICK, NOW).worldState).toBe(idCollision);
    const idMissingKey = copy(coexist); delete idMissingKey.proposals.find(p => p.id === row.id).outcome.proposalPayload.questionKey;
    expect(resolveSuccessionQuestions(idMissingKey, TICK, NOW).worldState).toBe(idMissingKey);
  });

  it('the pending descriptor survives JSON and malformed or stale payloads fail closed', () => {
    const docket = queued();
    const row = proposalOf(docket);
    expect(copy(row)).toEqual(row);
    expect(claimsSuccessionQuestionNamespace(row.outcome.proposalPayload)).toBe(true);
    const reordered = copy(docket);
    const reorderedRow = proposalOf(reordered);
    reorderedRow.outcome.proposalPayload.question = reversedRecord(reorderedRow.outcome.proposalPayload.question);
    reorderedRow.outcome.proposalPayload.terminals = reversedRecord(reorderedRow.outcome.proposalPayload.terminals);
    reorderedRow.outcome.proposalPayload = reversedRecord(reorderedRow.outcome.proposalPayload);
    reorderedRow.outcome = reversedRecord(reorderedRow.outcome);
    const reorderedApply = applyWorldPulseProposal({ campaign: campaign(reordered), saves: saves(), proposalId: row.id, now: NOW });
    expect(proposalOf(reorderedApply.worldState).status).toBe('applied');
    expect(brokenTreaty(reorderedApply.worldState).breachType).toBe('succession_repudiation');
    const mutations = [
      state => { delete proposalOf(state).outcome.proposalPayload.schemaVersion; },
      state => { proposalOf(state).outcome.proposalPayload.extra = true; },
      state => { proposalOf(state).outcome.proposalPayload.schemaVersion = 2; },
      state => { proposalOf(state).outcome.proposalPayload.questionKey = 'wrong'; },
      state => { const duplicate = copy(proposalOf(state)); duplicate.id = `${duplicate.id}.collision`; delete duplicate.outcome.proposalPayload.terminals; state.proposals.push(duplicate); },
      state => { const duplicate = copy(proposalOf(state)); duplicate.outcome.proposalPayload.questionKey = 'wrong'; state.proposals.push(duplicate); },
      state => { proposalOf(state).outcome.id = `${proposalOf(state).outcome.id}.wrong`; },
      state => { proposalOf(state).outcome.candidateId = `${proposalOf(state).outcome.candidateId}.wrong`; },
      state => { delete proposalOf(state).outcome.proposalPayload.terminals.expired; },
      state => { proposalOf(state).outcome.proposalPayload.terminals.extra = true; },
      state => { proposalOf(state).outcome.proposalPayload.terminals.expired = 'decline'; },
      state => { proposalOf(state).outcome.severity = 0.99; },
      state => { proposalOf(state).outcome.proposalPayload.question.severity01 = 0.99; },
      state => { proposalOf(state).outcome.proposalPayload.question.pressure01 = 0.1; },
      state => { delete proposalOf(state).outcome.proposalPayload.question.cause; },
      state => { proposalOf(state).outcome.proposalPayload.question.extra = true; },
      state => { delete proposalOf(state).outcome.summary; },
      state => { proposalOf(state).outcome.populationDeltas = [{ saveId: 'march', amount: 99 }]; },
      state => { proposalOf(state).tick += 1; },
      state => { proposalOf(state).recordModeVersion = 3; },
      state => { brokenTreaty(state).parties = ['crown', 'elsewhere']; },
      state => { state.simulationRules.oathHolderEnabled = false; },
      state => { delete state.spatialLedgers.treaties[KEY]; },
      state => { brokenTreaty(state).complianceState = 'defaulted'; },
      state => { brokenTreaty(state).terms[0].expiresTick = TICK; },
    ];
    for (const mutate of mutations) {
      const stale = copy(docket); mutate(stale);
      const applied = applyWorldPulseProposal({ campaign: campaign(stale), saves: saves(), proposalId: row.id, now: NOW });
      expect(applied.proposalDisposition).toBe('superseded');
      expect(proposalOf(applied.worldState)).toMatchObject({ status: 'superseded', supersessionReason: 'succession_question_lapsed' });
      expect(applied.newsEntries).toEqual([]);
      expect(getSpatialLedger(applied.worldState, 'treaties')?.[KEY]).toEqual(getSpatialLedger(stale, 'treaties')?.[KEY]);
    }
  });

  it('proposal undo restores the exact open question and unbroken oath', async () => {
    const docket = queued();
    const row = proposalOf(docket);
    const before = copy(docket);
    const store = storeWith(docket);
    const applied = await store.getState().applyWorldPulseProposal('camp-gr4d', row.id);
    expect(applied).toBeTruthy();
    expect(proposalOf(store.getState().campaigns[0].worldState).status).toBe('applied');
    expect(brokenTreaty(store.getState().campaigns[0].worldState).breachType).toBe('succession_repudiation');
    expect(store.getState().proposalUndoStack).toHaveLength(1);
    expect(store.getState().pulseUndoStack || []).toHaveLength(0);
    expect(await store.getState().undoLastProposalApply('camp-gr4d')).toBe(true);
    expect(store.getState().campaigns[0].worldState).toEqual(before);
    expect(proposalOf(store.getState().campaigns[0].worldState).status).toBe('pending');
    expect(brokenTreaty(store.getState().campaigns[0].worldState).breachType).toBeUndefined();
  });

  it('a real organic ladder succession reaches the late treaty-stage queue', () => {
    const guild = { id: 'guild.ashford', name: 'Ashford Guild', isGoverning: true, power: 60 };
    const person = (id, status) => ({ id, name: id, role: id, importance: id === 'old' ? 'pillar' : 'key', dots: id === 'old' ? 3 : 2,
      structuralRank: id === 'old' ? 'dominant' : 'subordinate', factionAffiliation: guild.name,
      personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' }, ...(status ? { status } : {}) });
    const town = npcs => ({ name: 'Ashford', tier: 'city', population: 9000, powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } }, npcs, institutions: [], activeConditions: [] });
    const drive = (settlement, worldState, tick) => advanceNpcLadder({ snapshot: { settlements: [{ id: 'a', name: 'Ashford', settlement }] },
      worldState: { ...worldState, simulationRules: { ...RULES, npcLadderEnabled: true, warTerminationEnabled: true }, calendar: { elapsedWeeks: tick } },
      settlementUpdates: [{ saveId: 'a', settlement }], tick, now: NOW });
    const first = drive(town([person('old'), person('heir')]), {}, 10);
    const pair = treatyPairKey('a', 'crown');
    const seeded = copy(first.worldState);
    seeded.spatialLedgers.treaties = { [pair]: { ...treaty()[1], parties: ['crown', 'a'], victorId: 'crown', loserId: 'a', loserName: 'Ashford', sworn: { a: { npcId: 'a:old', name: 'Old Master', swornTick: 2 } } } };
    const second = drive(town([person('old', 'dead'), person('heir')]), seeded, 11);
    expect(second.worldState.spatialLedgers.npcLadder.a.seatTransitions.at(-1)).toMatchObject({ fromRulerId: 'a:old', toRulerId: 'a:heir', cause: 'succession', tick: 11 });
    const result = advanceTreaties({ snapshot: { settlements: [{ id: 'a', name: 'Ashford', settlement: town([]) }, ...saves().map(save => ({ id: save.id, name: save.name, settlement: save.settlement }))], byId: new Map(), regionalGraph: { edges: [] } },
      worldState: second.worldState, settlementUpdates: [], graph: { edges: [] }, pIndex: null, tick: 11, now: NOW });
    expect(result.worldState.proposals.find(row => row.outcome?.proposalPayload?.question?.treatyKey === pair)).toMatchObject({ status: 'pending', tick: 11 });
  });
});
