/**
 * GR-4b-ii-W2 acceptance battery: exactly one straight-line suite and A1-A8.
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

import { ensureRegionalGraph, appendWizardNewsEntries } from '../../src/domain/region/index.js';
import { advanceTreaties, TERM_CATALOG, treatyPairKey } from '../../src/domain/worldPulse/peaceTerms.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';
import {
  dismissSuccessionQuestionWithVoice,
} from '../../src/domain/worldPulse/treatySuccessionReaffirmedVoice.js';
import { resolveSuccessionQuestions } from '../../src/domain/worldPulse/treatySuccessionDecision.js';
import {
  resolveSuccessionQuestionsWithOpeningVoice,
} from '../../src/domain/worldPulse/treatySuccessionOpeningVoice.js';
import { expireStaleActorMajors } from '../../src/domain/worldPulse/actorMajorApproval.js';
import { upsertProposal, updateProposalStatus } from '../../src/domain/worldPulse/worldState.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 20;
const KEY = treatyPairKey('crown', 'march');
const KIND = 'reaffirmed';
const CAMPAIGN_ID = 'camp-gr4b-ii-w2';
const RULES = Object.freeze({
  warLayerEnabled: true,
  peaceEngineEnabled: true,
  oathHolderEnabled: true,
  routineMajorApproval: true,
});
const copy = (value) => JSON.parse(JSON.stringify(value));

function term(burden01 = 0.9, overrides = {}) {
  const spec = TERM_CATALOG.tribute;
  return {
    type: 'tribute', family: spec.family, magnitude: 0.4, mintedTick: 0,
    expiresTick: 60, weightSpent: spec.weight, complianceState: 'honored',
    trueState: 'honored', burden01, receipt: 'tribute term',
    deliveredToVictor: 0, extractedFromLoser: 0, ...overrides,
  };
}

function treaty({ key = KEY, burden01 = 0.9, loserName = 'March', ...rest } = {}) {
  return [key, {
    parties: ['crown', 'march'], victorId: 'crown', loserId: 'march',
    victorName: 'Crown', loserName, mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'], terms: [term(burden01)],
    sworn: { march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 } },
    ...rest,
  }];
}

function world({ burden01 = 0.9, key = KEY, rules = RULES, treaties = null,
  proposals = null, loserName = 'March', tick = TICK, record = null } = {}) {
  const [treatyKey, built] = treaty({ key, burden01, loserName });
  return {
    rngSeed: 'gr4b-ii-w2', tick, simulationRules: { ...rules },
    calendar: { elapsedWeeks: tick }, deployments: {}, relationshipStates: {},
    ...(proposals ? { proposals } : {}),
    spatialLedgers: {
      treaties: treaties || { [treatyKey]: record ? { ...built, ...record } : built },
      npcLadder: {
        march: { factions: {}, npcs: {}, seatTransitions: [{
          id: 'seat.1', fromRulerId: 'npc_old', toRulerId: 'npc_new', cause: 'coup', tick,
        }] },
      },
    },
  };
}

/** One pending, validated succession question standing on the fixture treaty. */
function pending(options = {}) {
  const tick = options.tick ?? TICK;
  const opened = resolveSuccessionQuestions(world(options), tick, NOW);
  const row = (opened.worldState.proposals || []).find(
    (proposal) => proposal.outcome?.proposalPayload?.kind === 'succession_question',
  );
  return { worldState: opened.worldState, row, tick };
}

/** Dismiss that question through the leaf and return everything the case needs. */
function dismiss(options = {}) {
  const { worldState, row, tick } = pending(options);
  const result = dismissSuccessionQuestionWithVoice(worldState, row?.id, tick, NOW);
  return { worldState, row, tick, result, entries: result.newsEntries };
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

const campaignOf = (store) => store.getState().campaigns[0];
const feedOf = (store) => campaignOf(store).wizardNews.entries;

/**
 * JSON with the status writer's own wall-clock `updatedAt` normalized out. The byte-identity
 * claim below is "this road writes what BASE wrote", and base's writer stamps
 * `wallClockNow()` whenever the caller supplies no `updatedAt` — so two independent
 * invocations legitimately differ by a millisecond in that ONE field and in nothing else.
 * Comparing raw would be a test that passes or fails on clock granularity.
 */
const stableJson = (value) => JSON.stringify(
  value, (key, raw) => (key === 'updatedAt' ? '<wall-clock>' : raw),
);

/** The ordinary, non-succession proposal every dark and negative case dismisses. */
const ORDINARY = Object.freeze({
  id: 'ordinary', status: 'pending', tick: 0, updatedAt: NOW,
  outcome: { candidateType: 'strategy_deploy', targetSaveId: 'crown' },
});

const ROW = GRAMMAR_KIND_REGISTRY.find((entry) => entry.kind === KIND);

describe('GR-4b-ii-W2 — the reaffirmed voice', () => {
  beforeEach(() => localStorageStub());

  it('dismissing a validated succession question mints exactly one fully addressed beat', () => {
    const { worldState, row, result, entries } = dismiss();
    expect(row).toMatchObject({ status: 'pending' });
    expect(entries).toHaveLength(1);
    const [beat] = entries;
    // THE FULL ADDRESS CHAIN (news address law): an id, a typed action, the affected
    // settlements BY NAME, and the recorded reason read back off the row.
    expect(beat).toMatchObject({
      id: `wizard_news.${TICK}.reaffirmed.${stablePart(row.outcome.id)}`,
      kind: KIND, impactKind: KIND, tick: TICK, scope: 'regional',
      significance: 'notable', audience: 'public', section: 'trade',
      severity: 0.56, score: 58, ending: KIND,
      settlementIds: ['march', 'crown'], settlementNames: ['March', 'Crown'],
      parties: ['crown', 'march'],
      headline: "March's new seat keeps the oath sworn to Crown",
    });
    expect(beat.reasons).toEqual(row.outcome.reasons);
    expect(beat.reasons.length).toBeGreaterThan(0);
    // The summary is an exact member of the seven CORRECTED families, rendered through the
    // registry the annex walker re-derives from the corpus on every run.
    const rendered = ROW.pool.map((variant) => (typeof variant === 'function'
      ? variant({ settlement: 'March', counterpart: 'Crown', npc: 'Old March' })
      : String(variant)));
    expect(rendered.map((line) => line.charAt(0).toUpperCase() + line.slice(1)))
      .toContain(beat.summary);
    expect(beat.familyId.startsWith(`${KIND}.`)).toBe(true);
    // The instrument itself is READ, never written: ledger, terms and oath stamp are
    // byte-identical across the transition.
    expect(JSON.stringify(result.worldState.spatialLedgers.treaties))
      .toBe(JSON.stringify(worldState.spatialLedgers.treaties));
    const dismissed = result.worldState.proposals.find((p) => p.id === row.id);
    expect(dismissed).toMatchObject({ status: 'dismissed', dismissedAt: NOW });
  });

  it('all seven annex-verbatim families and slot vectors are reachable', () => {
    expect(ROW.pool).toHaveLength(7);
    const seen = new Map();
    // Real outcome identities, one per tick — the seed is the validated outcome id, so a
    // different question deterministically reaches a different family.
    for (let tick = 12; tick <= 56 && seen.size < 7; tick += 1) {
      const { entries } = dismiss({ tick });
      if (entries.length) seen.set(entries[0].familyId, entries[0].summary);
    }
    expect(seen.size, 'a corrected family is unreachable from any real question').toBe(7);
    for (const [familyId, summary] of seen) {
      expect(familyId.startsWith(`${KIND}.`)).toBe(true);
      // THE LIVENESS PIN for every exclusion below: each summary is a real, terminally
      // punctuated authored sentence of real length. Without it a bare `not.toContain`
      // would pass just as happily on an empty string as on a correctly excluded one.
      expect(summary).toMatch(/[.?]$/);
      expect(summary.length).toBeGreaterThan(20);
      // anchored: summary is pinned non-empty and terminally punctuated two lines above, so `{npc}` bound to the FALLEN holder rather than the successor.
      expect(summary).not.toContain('npc_new');
      // anchored: same liveness pin above — the successor's NAME is absent from a live sentence, not from a vanished one.
      expect(summary).not.toContain('New March');
      // anchored: same liveness pin; asserted DIRECTLY because all four voiceMechanics arms are banked and would absorb a new em-dash tell.
      expect(summary).not.toContain('—');
      // anchored: same liveness pin; the banked arms would absorb a new exclamation tell too.
      expect(summary).not.toContain('!');
      // anchored: same liveness pin — a live sentence carries no digit, residual token or undefined slot.
      expect(summary).not.toMatch(/\d|\{|\}|\bundefined\b|\bNaN\b/);
    }
    // NON-VACUITY: the fallen holder's name really does reach the rendered prose, so the
    // successor exclusions above are read against sentences that name somebody.
    expect([...seen.values()].some((line) => line.includes('Old March'))).toBe(true);
    // ⭐ THE DECOY STAMP, and it is what makes the fallen-holder claim non-vacuous. With a
    // single stamp on the parchment "the first stamp" and "the stamp naming this holder"
    // are the same row, so a composer that simply took stamp[0] would render identically
    // and every assertion above would pass. A SECOND stamp, written first, separates them.
    const npcFamilies = ROW.requiredSlots
      .map((slots, index) => (slots.includes('npc') ? `${KIND}.${index + 1}` : null))
      .filter(Boolean);
    expect(npcFamilies.length).toBeGreaterThan(0);
    let decoyBeat = null;
    for (let tick = 12; tick <= 56 && !decoyBeat; tick += 1) {
      const decoyed = pending({ tick });
      decoyed.worldState.spatialLedgers.treaties[KEY].sworn = {
        crown: { npcId: 'npc_crown', name: 'Crown Elder', swornTick: 1 },
        march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 },
      };
      const [beat] = dismissSuccessionQuestionWithVoice(
        decoyed.worldState, decoyed.row.id, tick, NOW,
      ).newsEntries;
      expect(beat, `tick ${tick}: the decoy world must still mint`).toBeTruthy();
      // anchored: the beat is pinned truthy on the line above, so the decoy holder is absent from a sentence that really rendered.
      expect(beat.summary).not.toContain('Crown Elder');
      if (npcFamilies.includes(beat.familyId)) decoyBeat = beat;
    }
    // The holder-naming family really was reached WITH the decoy present, and it named the
    // stamp that matches the question rather than the stamp that comes first.
    expect(decoyBeat, 'no npc-bearing family was reachable in the decoy world').toBeTruthy();
    expect(decoyBeat.summary).toContain('Old March');
    // …and the exact-match reader is proven to discriminate: asked for a holder the
    // parchment does not name, it mints nothing rather than falling back to the decoy.
    const wrongHolder = pending();
    wrongHolder.worldState.spatialLedgers.treaties[KEY].sworn = {
      crown: { npcId: 'npc_crown', name: 'Crown Elder', swornTick: 1 },
      march: { npcId: 'npc_old', name: '', swornTick: 2 },
    };
    expect(dismissSuccessionQuestionWithVoice(
      wrongHolder.worldState, wrongHolder.row.id, TICK, NOW,
    ).newsEntries).toEqual([]);
    // The declared slot vectors are the registry's own, and every pool keeps a slotless
    // sibling so a nameless world still has an honest authored sentence.
    expect(ROW.requiredSlots.map((slots) => [...slots])).toEqual([
      ['npc'], ['settlement'], ['settlement', 'counterpart'], [], [], [], ['npc'],
    ]);
    expect(ROW.contexts.every((context) => context === null)).toBe(true);
  });

  it('a dark mechanism leaves the store byte-identical', () => {
    const dark = [
      { warLayerEnabled: true, peaceEngineEnabled: true, oathHolderEnabled: true },
      { ...RULES, routineMajorApproval: false },
      { ...RULES, oathHolderEnabled: false },
      { ...RULES, peaceEngineEnabled: false },
    ];
    for (const rules of dark) {
      const source = world({ rules });
      // Driven through the REAL late-treaty stage, because the three gates sit at three
      // different depths: `peaceCausal` fences `advanceTreaties` itself, while
      // `routineMajorApproval` and the oath holder fence the decision inside it. Calling
      // the inner resolver directly would step over the outermost gate and prove less.
      const staged = advanceTreaties({
        snapshot: { settlements: [], byId: new Map(), regionalGraph: { edges: [] } },
        worldState: copy(source), settlementUpdates: [], graph: { edges: [] },
        pIndex: null, tick: TICK, now: NOW,
      });
      const questions = (staged.worldState.proposals || []).filter(
        (proposal) => proposal.outcome?.proposalPayload?.kind === 'succession_question',
      );
      expect(questions, `${JSON.stringify(rules)}: a pending row exists in the dark`).toEqual([]);
      expect(staged.newsEntries.filter((entry) => entry.kind === KIND)).toEqual([]);
      // The leaf is never reached, so the campaign it produces is the one BASE produced:
      // the status write alone, computed independently through the same writer.
      const seeded = { ...source, proposals: [{ ...ORDINARY }] };
      const result = dismissSuccessionQuestionWithVoice(seeded, ORDINARY.id, TICK, NOW);
      expect(result.newsEntries).toEqual([]);
      expect(stableJson(result.worldState)).toBe(stableJson(
        updateProposalStatus(seeded, ORDINARY.id, 'dismissed', { dismissedAt: NOW }),
      ));
      // …and the wall-clock field base stamps really is stamped, so normalizing it out
      // above hides a difference in ONE known field rather than an absent write.
      expect(result.worldState.proposals[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
    // …and through the real store, the feed is untouched BY REFERENCE.
    const store = storeWith({ ...world({ rules: { ...RULES, routineMajorApproval: false } }), proposals: [{ ...ORDINARY }] });
    const before = campaignOf(store).wizardNews;
    return store.getState().dismissWorldPulseProposal(CAMPAIGN_ID, ORDINARY.id).then(() => {
      expect(campaignOf(store).wizardNews).toBe(before);
      expect(feedOf(store)).toEqual([]);
    });
  });

  it('a non-succession, terminal, or duplicate dismissal writes status and mints nothing', () => {
    const { worldState, row } = pending();
    // An ORDINARY actor-major dismissal: the status write is byte-identical to base, and
    // no beat is minted.
    const ordinaryWorld = { ...worldState, proposals: [...worldState.proposals, { ...ORDINARY }] };
    const ordinary = dismissSuccessionQuestionWithVoice(ordinaryWorld, ORDINARY.id, TICK, NOW);
    expect(ordinary.newsEntries).toEqual([]);
    expect(stableJson(ordinary.worldState)).toBe(stableJson(
      updateProposalStatus(ordinaryWorld, ORDINARY.id, 'dismissed', { dismissedAt: NOW }),
    ));
    // Every TERMINAL status is a total no-op: no re-write, no timestamp move, no beat.
    for (const status of ['dismissed', 'applied', 'expired']) {
      const terminalRow = { ...row, status, dismissedAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z' };
      const terminalWorld = { ...worldState, proposals: [terminalRow] };
      const result = dismissSuccessionQuestionWithVoice(terminalWorld, row.id, TICK, NOW);
      expect(result.newsEntries, `${status}: minted a beat`).toEqual([]);
      expect(result.worldState, `${status}: rewrote a terminal row`).toBe(terminalWorld);
      expect(result.worldState.proposals[0]).toEqual(terminalRow);
    }
    // Malformed, truncated, mismatched and foreign payloads each mint nothing while the
    // dismissal still lands.
    const broken = [
      { ...row, outcome: null },
      { ...row, outcome: { ...row.outcome, id: 'not-the-derived-identity' } },
      { ...row, outcome: { ...row.outcome, proposalPayload: null } },
      { ...row, outcome: { ...row.outcome, proposalPayload: { ...row.outcome.proposalPayload, kind: 'foreign_kind' } } },
      { ...row, outcome: { ...row.outcome, proposalPayload: { ...row.outcome.proposalPayload, question: {} } } },
      { ...row, outcome: { ...row.outcome, reasons: [] } },
    ];
    for (const [index, candidate] of broken.entries()) {
      const brokenWorld = { ...worldState, proposals: [candidate] };
      const result = dismissSuccessionQuestionWithVoice(brokenWorld, row.id, TICK, NOW);
      expect(result.newsEntries, `broken[${index}]: minted a beat`).toEqual([]);
      expect(result.worldState.proposals[0].status, `broken[${index}]: no status write`).toBe('dismissed');
    }
    // An absent proposal id and a non-array proposals field are no-ops, not throws.
    expect(dismissSuccessionQuestionWithVoice(worldState, 'no-such-id', TICK, NOW).newsEntries).toEqual([]);
    expect(dismissSuccessionQuestionWithVoice({ proposals: null }, row.id, TICK, NOW).newsEntries).toEqual([]);
  });

  it('an ineligible or unaddressable instrument mints nothing, never a partial beat', () => {
    const { worldState, row } = pending();
    const withTreaty = (record) => {
      const next = copy(worldState);
      if (record === null) next.spatialLedgers.treaties = {};
      else next.spatialLedgers.treaties[KEY] = { ...next.spatialLedgers.treaties[KEY], ...record };
      return next;
    };
    const cases = [
      ['pruned ledger', withTreaty(null)],
      ['repudiation breach', withTreaty({ breachType: 'repudiation' })],
      ['defaulted compliance', withTreaty({ complianceState: 'defaulted' })],
      ['no live term', withTreaty({ terms: [term(0.9, { expiresTick: 1 })] })],
      ['unresolved court name', withTreaty({ victorName: '', loserName: '' })],
      ['id echoed as a name', withTreaty({ victorName: 'crown', loserName: 'march' })],
      ['absent oath stamp', withTreaty({ sworn: {} })],
      ['half-written oath stamp', withTreaty({ sworn: { march: { npcId: 'npc_old' } } })],
      ['stamp names another holder', withTreaty({ sworn: { march: { npcId: 'npc_other', name: 'Someone Else', swornTick: 2 } } })],
      ['parties missing a court', withTreaty({ parties: ['crown'] })],
    ];
    for (const [label, state] of cases) {
      const result = dismissSuccessionQuestionWithVoice(state, row.id, TICK, NOW);
      expect(result.newsEntries, `${label}: minted a beat`).toEqual([]);
      // ⭐ THE DISMISSAL STILL LANDS. Presentation never vetoes, delays or alters mechanics.
      const written = result.worldState.proposals.find((p) => p.id === row.id);
      expect(written, `${label}: the status write was vetoed`).toMatchObject({
        status: 'dismissed', dismissedAt: NOW,
      });
    }
    // NON-VACUITY: the SAME row on the untouched instrument does mint, so every silence
    // above is the named defect and not a fixture that could never speak.
    expect(dismissSuccessionQuestionWithVoice(worldState, row.id, TICK, NOW).newsEntries)
      .toHaveLength(1);
  });

  it('the transition fires at most once and the feed never doubles', () => {
    const { row, result, entries } = dismiss();
    expect(entries).toHaveLength(1);
    // The second call sees a non-pending row: a TOTAL no-op, by reference.
    const again = dismissSuccessionQuestionWithVoice(result.worldState, row.id, TICK, NOW);
    expect(again.newsEntries).toEqual([]);
    expect(again.worldState).toBe(result.worldState);
    // Two distinct questions mint two distinct beats, so the guard above is exactly-once
    // and not never-twice-at-all.
    const second = dismiss({ tick: 31 });
    expect(second.entries).toHaveLength(1);
    expect(second.entries[0].id).not.toBe(entries[0].id);
    // …and the canonical feed append collapses two entries sharing one id into one.
    const once = appendWizardNewsEntries({ currentTick: TICK, entries: [] }, entries, { now: NOW });
    const twice = appendWizardNewsEntries(once, [...entries], { now: NOW });
    expect(once.entries).toHaveLength(1);
    expect(twice.entries).toHaveLength(1);
    expect(twice.entries[0].id).toBe(entries[0].id);
  });

  it('the leaf is byte-stable, draws nothing, writes nothing, and reads no clock', () => {
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('the reaffirmed voice must not draw');
    });
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('the reaffirmed voice must not read the clock');
    });
    const { worldState, row } = pending();
    const before = JSON.stringify(worldState);
    const first = dismissSuccessionQuestionWithVoice(copy(worldState), row.id, TICK, NOW);
    const second = dismissSuccessionQuestionWithVoice(
      JSON.parse(JSON.stringify(copy(worldState))), row.id, TICK, NOW,
    );
    expect(stableJson(first)).toBe(stableJson(second));
    // The composed beat is byte-identical outright — it carries no wall-clock field at all.
    expect(JSON.stringify(first.newsEntries)).toBe(JSON.stringify(second.newsEntries));
    // No input is mutated.
    expect(JSON.stringify(worldState)).toBe(before);
    expect(random).not.toHaveBeenCalled();
    expect(clock).not.toHaveBeenCalled();
    // The tick is the caller's, off the normalized world — never a wall clock.
    expect(first.newsEntries[0].tick).toBe(TICK);
    expect(dismissSuccessionQuestionWithVoice(copy(worldState), row.id, 41, NOW)
      .newsEntries[0].tick).toBe(41);
    // Nothing qualifies ⇒ the CALLER'S OWN reference comes back, not a rebuilt clone.
    const inert = { ...worldState, proposals: [] };
    expect(dismissSuccessionQuestionWithVoice(inert, row.id, TICK, NOW).worldState).toBe(inert);
    random.mockRestore();
    clock.mockRestore();
  });

  it('a real GR-4d docket dismissal reaches the feed and no other surface', async () => {
    // A real late-treaty-stage run opens the docket and emits the landed OPENING beat.
    const staged = advanceTreaties({
      snapshot: { settlements: [], byId: new Map(), regionalGraph: { edges: [] } },
      worldState: world(), settlementUpdates: [], graph: { edges: [] },
      pIndex: null, tick: TICK, now: NOW,
    });
    const opened = (staged.worldState.proposals || []).find(
      (proposal) => proposal.outcome?.proposalPayload?.kind === 'succession_question',
    );
    expect(opened).toMatchObject({ status: 'pending' });
    expect(staged.newsEntries.filter((entry) => entry.kind === 'succession_question_opened'))
      .toHaveLength(1);
    // ⛔ The treaty stage itself mints NO terminal voice.
    expect(staged.newsEntries.filter((entry) => entry.kind === KIND)).toEqual([]);

    // The store's REAL dismiss road emits exactly one reaffirmed entry into wizardNews.
    const store = storeWith(staged.worldState);
    expect(await store.getState().dismissWorldPulseProposal(CAMPAIGN_ID, opened.id)).toBeTruthy();
    const feed = feedOf(store);
    expect(feed.filter((entry) => entry.impactKind === KIND)).toHaveLength(1);
    expect(feed).toHaveLength(1);
    // THE BEAT COUNT EQUALS THE DISMISSAL COUNT: a second click is a store-side no-op.
    expect(await store.getState().dismissWorldPulseProposal(CAMPAIGN_ID, opened.id)).toBeFalsy();
    expect(feedOf(store).filter((entry) => entry.impactKind === KIND)).toHaveLength(1);

    // Replaying the treaty stage over the DISMISSED world still mints nothing — the landed
    // silence pin's surviving claim, re-asserted from this side of the seam.
    const dismissedWorld = campaignOf(store).worldState;
    expect(resolveSuccessionQuestionsWithOpeningVoice(dismissedWorld, TICK, NOW).newsEntries)
      .toEqual([]);

    // The apply, expiry, overflow and undo roads remain silent on this kind.
    const applyStore = storeWith(staged.worldState);
    const applied = await applyStore.getState().applyWorldPulseProposal(CAMPAIGN_ID, opened.id);
    expect(applied.newsEntries.map((entry) => entry.kind)).toEqual(['disavowed_by_succession']);
    expect(await applyStore.getState().undoLastProposalApply(CAMPAIGN_ID)).toBe(true);
    expect(feedOf(applyStore).filter((entry) => entry.impactKind === KIND)).toEqual([]);
    const aged = {
      ...staged.worldState,
      proposals: staged.worldState.proposals.map((proposal) => (
        proposal.id === opened.id ? { ...proposal, tick: 0 } : proposal
      )),
    };
    const expired = expireStaleActorMajors(aged, TICK + 6, NOW, 1);
    expect(expired.proposals.find((p) => p.id === opened.id).status).toBe('expired');
    expect(resolveSuccessionQuestionsWithOpeningVoice(expired, TICK, NOW).newsEntries).toEqual([]);
    const flood = Array.from({ length: 80 }, (_, index) => (
      index === 0 ? opened : { ...ORDINARY, id: `ordinary.${index}` }
    ));
    const overflow = upsertProposal(
      { ...staged.worldState, proposals: flood }, { ...ORDINARY, id: 'ordinary.new' },
    );
    expect(overflow.proposals.find((p) => p.id === opened.id)).toMatchObject({
      status: 'expired', evictionReason: 'ring_overflow',
    });
    expect(resolveSuccessionQuestionsWithOpeningVoice(overflow, TICK, NOW).newsEntries).toEqual([]);
  });
});
