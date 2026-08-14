/**
 * GR-4b-iii-a acceptance battery: exactly one straight-line suite and A1–A8.
 * Loops are assertions inside registered cases; no test registration is data-driven.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: (campaign) => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    loadCached: vi.fn(() => []), cache: vi.fn(), list: vi.fn(() => Promise.resolve([])),
    upsert: vi.fn(() => Promise.resolve()), delete: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async (importOriginal) => ({
  ...(await importOriginal()), track: vi.fn(),
}));

import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import {
  advanceTreaties, TERM_CATALOG, treatyPairKey,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';
import {
  resolveSuccessionQuestionsWithOpeningVoice,
} from '../../src/domain/worldPulse/treatySuccessionOpeningVoice.js';
import { resolveSuccessionQuestions } from '../../src/domain/worldPulse/treatySuccessionDecision.js';
import {
  expireStaleActorMajors,
} from '../../src/domain/worldPulse/actorMajorApproval.js';
import { upsertProposal, updateProposalStatus } from '../../src/domain/worldPulse/worldState.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 20;
const KEY = treatyPairKey('crown', 'march');
const KIND = 'succession_question_opened';
const CAMPAIGN_ID = 'camp-gr4b-iiia';
const RULES = Object.freeze({
  warLayerEnabled: true,
  peaceEngineEnabled: true,
  oathHolderEnabled: true,
  routineMajorApproval: true,
});
const copy = (value) => JSON.parse(JSON.stringify(value));

function term(burden01 = 0.9) {
  const spec = TERM_CATALOG.tribute;
  return {
    type: 'tribute', family: spec.family, magnitude: 0.4, mintedTick: 0,
    expiresTick: 60, weightSpent: spec.weight, complianceState: 'honored',
    trueState: 'honored', burden01, receipt: 'tribute term',
    deliveredToVictor: 0, extractedFromLoser: 0,
  };
}

function treaty({ key = KEY, burden01 = 0.9, loserName = 'March' } = {}) {
  return [key, {
    parties: ['crown', 'march'], victorId: 'crown', loserId: 'march',
    victorName: 'Crown', loserName, mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'], terms: [term(burden01)],
    sworn: { march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 } },
  }];
}

function world({ burden01 = 0.9, key = KEY, rules = RULES, treaties = null,
  proposals = null, loserName = 'March', tick = TICK } = {}) {
  const [treatyKey, record] = treaty({ key, burden01, loserName });
  return {
    rngSeed: 'gr4b-iiia', tick, simulationRules: { ...rules },
    calendar: { elapsedWeeks: tick }, deployments: {}, relationshipStates: {},
    ...(proposals ? { proposals } : {}),
    spatialLedgers: {
      treaties: treaties || { [treatyKey]: record },
      npcLadder: {
        march: { factions: {}, npcs: {}, seatTransitions: [{
          id: 'seat.1', fromRulerId: 'npc_old', toRulerId: 'npc_new', cause: 'coup', tick,
        }] },
      },
    },
  };
}

function resolve(source, tick = TICK) {
  return resolveSuccessionQuestionsWithOpeningVoice(source, tick, NOW);
}

function proposalsOf(result) {
  return (result.worldState.proposals || []).filter(
    (row) => row.outcome?.proposalPayload?.kind === 'succession_question',
  );
}

function beatsOf(result) {
  return result.newsEntries.filter((entry) => entry.kind === KIND);
}

function treatyOf(state, key = KEY) {
  return getSpatialLedger(state, 'treaties')[key];
}

function saves() {
  return [
    { id: 'crown', name: 'Crown', phase: 'canon', settlement: { name: 'Crown', tier: 'city', population: 60000, institutions: [], npcs: [], activeConditions: [], powerStructure: { factions: [] } }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    { id: 'march', name: 'March', phase: 'canon', settlement: { name: 'March', tier: 'town', population: 1800, institutions: [], npcs: [], activeConditions: [], powerStructure: { factions: [] } }, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
  ];
}

function campaign(worldState) {
  return {
    id: CAMPAIGN_ID, settlementIds: ['crown', 'march'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
    wizardNews: { currentTick: TICK, entries: [] },
  };
}

function localStorageStub() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: (key) => data.delete(String(key)), clear: () => data.clear(),
  };
}

function storeWith(worldState) {
  const stub = {
    savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
    eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null,
    lastExportAt: null,
  };
  const store = create(immer((...args) => ({
    ...stub, ...createCampaignSlice(...args), ...createCampaignWorldPulseSlice(...args),
  })));
  store.setState((draft) => {
    draft.savedSettlements = saves();
    draft.campaigns = [campaign(worldState)];
  });
  return store;
}

function campaignWorld(store) {
  return store.getState().campaigns[0].worldState;
}

const EXPECTED_LINES = Object.freeze([
  'The old seat swore it; the new seat must choose.',
  'Old March left an oath standing at March; the new seat has taken the chair while the parchment remains unanswered.',
  'The court of Crown is waiting on one word from March, and the market is trading on which word it will be.',
  'The oath Old March swore is a question this week, and the clerks have set its parchment before the new seat.',
  'Nothing has been broken. Nothing has been confirmed either.',
  'The clerks in March have laid the unanswered oath on the council table, with room beneath it for one word.',
  'Whatever the new seat decides, the oath Old March swore will be remembered longer than its terms.',
]);

describe('GR-4b-iii-a — the question-opening voice', () => {
  beforeEach(() => localStorageStub());

  it('a newly inserted proposal emits exactly one opening beat', () => {
    const source = world();
    const oathBefore = copy(treatyOf(source).sworn);
    const direct = resolveSuccessionQuestions(copy(source), TICK, NOW);
    const result = resolve(copy(source));
    const [proposal] = proposalsOf(result);
    const [beat] = beatsOf(result);
    expect(result.worldState).toEqual(direct.worldState);
    expect(proposal).toEqual(proposalsOf(direct)[0]);
    expect(proposalsOf(result)).toHaveLength(1);
    expect(proposal).toMatchObject({ status: 'pending', tick: TICK });
    expect(beatsOf(result)).toHaveLength(1);
    expect(beat).toMatchObject({
      id: `wizard_news.${TICK}.${KIND}.${stablePart(proposal.outcome.id)}`,
      kind: KIND, impactKind: KIND, significance: 'notable', severity: 0.56,
      score: 58, tick: TICK, scope: 'regional',
      headline: "March's new seat weighs the oath sworn to Crown",
      reasons: ['A successor must decide whether to own the fallen holder\'s oath.'],
      settlementIds: ['march', 'crown'], settlementNames: ['March', 'Crown'],
      parties: ['crown', 'march'], sourceEventId: proposal.outcome.id,
      audience: 'public', section: 'trade',
      tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
    });
    expect(beat.ending).toBeUndefined();
    expect(treatyOf(result.worldState).sworn).toEqual(oathBefore);
    expect(treatyOf(result.worldState).breachType).toBeUndefined();
    const unresolvedSource = world({ loserName: 'march' });
    const unresolvedDirect = resolveSuccessionQuestions(copy(unresolvedSource), TICK, NOW);
    const unresolved = resolve(copy(unresolvedSource));
    expect(unresolved.worldState).toEqual(unresolvedDirect.worldState);
    expect(proposalsOf(unresolved)).toHaveLength(1);
    expect(beatsOf(unresolved)).toEqual([]);
    expect(treatyOf(unresolved.worldState).sworn).toEqual(treatyOf(unresolvedSource).sworn);
  });

  it('all seven annex-verbatim families and slot vectors are reachable', () => {
    const row = GRAMMAR_KIND_REGISTRY.find((candidate) => candidate.kind === KIND);
    expect(row.requiredSlots).toEqual([
      [], ['npc', 'settlement'], ['counterpart', 'settlement'], ['npc'], [],
      ['settlement'], ['npc'],
    ]);
    const reached = new Map();
    for (let index = 0; index < 500 && reached.size < 7; index += 1) {
      const result = resolve(world({ key: `instrument.${index}` }));
      const [proposal] = proposalsOf(result);
      const [beat] = beatsOf(result);
      expect(proposal).toBeTruthy();
      expect(beat.sourceEventId).toBe(proposal.outcome.id);
      reached.set(beat.familyId, beat.summary);
    }
    expect([...reached.keys()].sort())
      .toEqual(Array.from({ length: 7 }, (_, index) => `${KIND}.${index + 1}`));
    expect([...reached.values()].sort()).toEqual([...EXPECTED_LINES].sort());
    expect([...reached.values()].some((line) => line.includes('Old March'))).toBe(true);
    expect([...reached.values()].every((line) => !line.includes('npc_new'))).toBe(true);
    // anchored: seven exact reached families are pinned before this forbidden-slot check.
    expect(JSON.stringify([...reached.values()])).not.toContain('{band}');
  });

  it('absent or false gates, direct handling, and HONOR emit no opening beat', () => {
    const absentOath = world();
    delete absentOath.simulationRules.oathHolderEnabled;
    const falseOath = world({ rules: { ...RULES, oathHolderEnabled: false } });
    for (const source of [absentOath, falseOath]) {
      const result = resolve(copy(source));
      const direct = resolveSuccessionQuestions(copy(source), TICK, NOW);
      expect(result).toEqual(direct);
      expect(beatsOf(result)).toEqual([]);
    }
    const absentRoutine = world();
    delete absentRoutine.simulationRules.routineMajorApproval;
    const falseRoutine = world({ rules: { ...RULES, routineMajorApproval: false } });
    for (const source of [absentRoutine, falseRoutine]) {
      const result = resolve(copy(source));
      const direct = resolveSuccessionQuestions(copy(source), TICK, NOW);
      expect(result).toEqual(direct);
      expect(beatsOf(result)).toEqual([]);
      expect(result.newsEntries.filter((entry) => entry.kind === 'disavowed_by_succession'))
        .toHaveLength(1);
      expect(treatyOf(result.worldState).breachType).toBe('succession_repudiation');
    }
    const honored = resolve(world({ burden01: 0.2 }));
    expect(proposalsOf(honored)).toEqual([]);
    expect(beatsOf(honored)).toEqual([]);
    expect(treatyOf(honored.worldState).breachType).toBeUndefined();
  });

  it('duplicates, retained terminals, and collisions emit no second opening beat', () => {
    const first = resolve(world());
    const [row] = proposalsOf(first);
    expect(beatsOf(first)).toHaveLength(1);
    expect(beatsOf(resolve(first.worldState))).toEqual([]);
    for (const status of ['pending', 'applied', 'dismissed', 'expired', 'refused', 'superseded']) {
      const retained = updateProposalStatus(first.worldState, row.id, status, { updatedAt: NOW });
      expect(beatsOf(resolve(retained))).toEqual([]);
    }
    const keyCollision = copy(first.worldState);
    keyCollision.proposals[0].id = `${row.id}.other`;
    const keyCollisionResult = resolve(keyCollision);
    expect(beatsOf(keyCollisionResult)).toEqual([]);
    expect(proposalsOf(keyCollisionResult)).toHaveLength(1);
    const malformedKeyCollision = copy(keyCollision);
    delete malformedKeyCollision.proposals[0].outcome.proposalPayload.terminals;
    expect(beatsOf(resolve(malformedKeyCollision))).toEqual([]);
    const idCollision = copy(first.worldState);
    idCollision.proposals[0].outcome.proposalPayload.questionKey = 'wrong';
    expect(beatsOf(resolve(idCollision))).toEqual([]);
  });

  it('two instruments get distinct identities and reverse enumeration stays stable', () => {
    const first = treaty({ key: 'instrument.a' });
    const second = treaty({ key: 'instrument.b' });
    const forward = resolve(world({ treaties: { [first[0]]: first[1], [second[0]]: second[1] } }));
    const reverse = resolve(world({ treaties: { [second[0]]: second[1], [first[0]]: first[1] } }));
    expect(beatsOf(forward)).toHaveLength(2);
    expect(new Set(beatsOf(forward).map((beat) => beat.id)).size).toBe(2);
    expect(new Set(beatsOf(forward).map((beat) => beat.sourceEventId)).size).toBe(2);
    expect(proposalsOf(reverse)).toEqual(proposalsOf(forward));
    expect(beatsOf(reverse)).toEqual(beatsOf(forward));
  });

  it('the same input is byte-stable and draws no randomness', () => {
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('question-opening voice must not draw');
    });
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('question-opening voice must not read the clock');
    });
    const source = world();
    const before = JSON.stringify(source);
    const first = resolve(copy(source));
    const second = resolve(copy(JSON.parse(JSON.stringify(source))));
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(source)).toBe(before);
    expect(random).not.toHaveBeenCalled();
    expect(clock).not.toHaveBeenCalled();
    random.mockRestore();
    clock.mockRestore();
  });

  it('apply, dismiss, expiry, overflow, undo, and replay never mint terminal or duplicate opening voice', async () => {
    const opening = resolve(world());
    const [row] = proposalsOf(opening);
    expect(beatsOf(opening)).toHaveLength(1);

    const applyStore = storeWith(opening.worldState);
    const applied = await applyStore.getState().applyWorldPulseProposal(CAMPAIGN_ID, row.id);
    expect(applied.newsEntries.map((entry) => entry.kind))
      .toEqual(['disavowed_by_succession']);
    const appliedWorld = campaignWorld(applyStore);
    expect(proposalsOf({ worldState: appliedWorld })[0].status).toBe('applied');

    expect(await applyStore.getState().undoLastProposalApply(CAMPAIGN_ID)).toBe(true);
    const undoneWorld = campaignWorld(applyStore);
    expect(proposalsOf({ worldState: undoneWorld })[0].status).toBe('pending');

    const dismissStore = storeWith(opening.worldState);
    expect(await dismissStore.getState().dismissWorldPulseProposal(CAMPAIGN_ID, row.id))
      .toBeTruthy();
    const dismissedWorld = campaignWorld(dismissStore);
    expect(proposalsOf({ worldState: dismissedWorld })[0].status).toBe('dismissed');

    const aged = {
      ...opening.worldState,
      proposals: opening.worldState.proposals.map((proposal) => (
        proposal.id === row.id ? { ...proposal, tick: 0 } : proposal
      )),
    };
    const expiredWorld = expireStaleActorMajors(aged, 6, NOW, 1);
    expect(proposalsOf({ worldState: expiredWorld })[0].status).toBe('expired');

    const ordinary = {
      id: 'ordinary', status: 'pending', tick: 0, updatedAt: NOW,
      outcome: { candidateType: 'strategy_deploy', targetSaveId: 'crown' },
    };
    const flood = Array.from({ length: 80 }, (_, index) => (
      index === 0 ? row : { ...ordinary, id: `ordinary.${index}` }
    ));
    const overflowWorld = upsertProposal(
      { ...opening.worldState, proposals: flood },
      { ...ordinary, id: 'ordinary.new' },
    );
    expect(proposalsOf({ worldState: overflowWorld })[0]).toMatchObject({
      status: 'expired', evictionReason: 'ring_overflow',
    });

    for (const state of [appliedWorld, undoneWorld, dismissedWorld, expiredWorld, overflowWorld]) {
      const replay = resolve(state);
      expect(replay.newsEntries).toEqual([]);
    }
  });

  it('a real organic ladder succession reaches the late treaty stage and emits one fully addressed public beat', () => {
    const guild = { id: 'guild.ashford', name: 'Ashford Guild', isGoverning: true, power: 60 };
    const person = (id, status) => ({
      id, name: id, role: id, importance: id === 'old' ? 'pillar' : 'key',
      dots: id === 'old' ? 3 : 2, structuralRank: id === 'old' ? 'dominant' : 'subordinate',
      factionAffiliation: guild.name,
      personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
      ...(status ? { status } : {}),
    });
    const town = (npcs) => ({
      name: 'Ashford', tier: 'city', population: 9000,
      powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
      npcs, institutions: [], activeConditions: [],
    });
    const drive = (settlement, worldState, tick) => advanceNpcLadder({
      snapshot: { settlements: [{ id: 'a', name: 'Ashford', settlement }] },
      worldState: {
        ...worldState,
        simulationRules: { ...RULES, npcLadderEnabled: true, warTerminationEnabled: true },
        calendar: { elapsedWeeks: tick },
      },
      settlementUpdates: [{ saveId: 'a', settlement }], tick, now: NOW,
    });
    const first = drive(town([person('old'), person('heir')]), {}, 10);
    const pair = treatyPairKey('a', 'crown');
    const seeded = copy(first.worldState);
    seeded.spatialLedgers.treaties = { [pair]: {
      ...treaty()[1], parties: ['crown', 'a'], victorId: 'crown', loserId: 'a',
      loserName: 'Ashford', sworn: { a: { npcId: 'a:old', name: 'Old Master', swornTick: 2 } },
    } };
    const second = drive(town([person('old', 'dead'), person('heir')]), seeded, 11);
    expect(second.worldState.spatialLedgers.npcLadder.a.seatTransitions.at(-1)).toMatchObject({
      fromRulerId: 'a:old', toRulerId: 'a:heir', cause: 'succession', tick: 11,
    });
    const oathBefore = copy(treatyOf(second.worldState, pair).sworn);
    const direct = resolveSuccessionQuestions(copy(second.worldState), 11, NOW);
    const directProposal = direct.worldState.proposals.find(
      (candidate) => candidate.outcome?.proposalPayload?.question?.treatyKey === pair,
    );
    const result = advanceTreaties({
      snapshot: {
        settlements: [{ id: 'a', name: 'Ashford', settlement: town([]) }],
        byId: new Map(), regionalGraph: { edges: [] },
      },
      worldState: second.worldState, settlementUpdates: [], graph: { edges: [] },
      pIndex: null, tick: 11, now: NOW,
    });
    const proposal = result.worldState.proposals.find(
      (candidate) => candidate.outcome?.proposalPayload?.question?.treatyKey === pair,
    );
    const [beat] = beatsOf(result);
    expect(proposal).toMatchObject({ status: 'pending', tick: 11 });
    expect(proposal).toEqual(directProposal);
    expect(beatsOf(result)).toHaveLength(1);
    expect(beat).toMatchObject({
      headline: "Ashford's new seat weighs the oath sworn to Crown",
      settlementIds: ['a', 'crown'], settlementNames: ['Ashford', 'Crown'],
      parties: ['crown', 'a'], sourceEventId: proposal.outcome.id,
      audience: 'public', section: 'trade',
    });
    expect(beat.summary).toBeTruthy();
    expect(beat.ending).toBeUndefined();
    expect(treatyOf(result.worldState, pair).sworn).toEqual(oathBefore);
    expect(treatyOf(result.worldState, pair).breachType).toBeUndefined();
  });
});
