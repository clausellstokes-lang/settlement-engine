/**
 * tests/lib/interpretApply.test.js — the ACCEPT→MINT executor pins
 * (Surveyor S3→S4 seam, DESIGN_AI_CONTROL_SURFACE §2 stage 3).
 *
 *   PIN A (NEVER-BYPASS): every landed op flows through a registered application
 *     command and its established applyEvent / recordPartyImpact writer.
 *   PIN B (PER-ITEM ISOLATION): one command failure is recorded in `failed`, and the
 *     rest still land (the review is per-item; so is the apply).
 *   PIN C (LANDED-ONLY LOG): the §3 apply record covers what LANDED, not what was proposed.
 *   PIN D (EM-D4, THE SURVEYOR BRIDGE): the review's accepted proposals stage as
 *     `addedBy: 'surveyor'` decrees with their `surveyorCredit` through EM-C1's OWN
 *     `stage`, and the consent barrier is rendered in EM-C2's OWN guard vocabulary.
 *     Both producers are IMPORTED here rather than re-typed (the anti-vacuity rule): the
 *     bridge injects its writer and re-spells its two vocabulary words, so a renamed
 *     export or a withdrawn kind reds in this file instead of drifting silently.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  consentGuardsFor,
  mergeCanonEventRecoveryResult,
  runInterpretApply,
  stageSurveyorDecrees,
  surveyorDecreeId,
} from '../../src/lib/intent/interpretApply.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';
import { DECREE_AUTHORS, stage } from '../../src/domain/edit/registry.js';
import { GUARD_KINDS, GUARD_OFFERS } from '../../src/domain/edit/guards.js';

const party = (o = {}) => ({ family: 'party_impact', opType: 'resolve_stressor', params: { stressorId: 's1' }, label: 'required', ...o });
const canon = (o = {}) => ({ family: 'canon_event', opType: 'KILL_NPC', params: { npcId: 'n1' }, label: 'inferred', ...o });

beforeEach(() => {
  clearSessionCommandJournal();
});

describe('interpretApply executor — never-bypass (PIN A)', () => {
  it('lands each accepted op through its registered command adapter', async () => {
    const applyEvent = vi.fn();
    const recordPartyImpact = vi.fn().mockResolvedValue({ ok: true });
    const out = await runInterpretApply({
      accepted: [{ op: party() }, { op: canon() }],
      campaignId: 'c1', saveId: 'sv1', seed: 42, interpretRef: 'ref1',
      actions: { applyEvent, recordPartyImpact },
    });
    expect(recordPartyImpact).toHaveBeenCalledWith('c1', { kind: 'resolve_stressor', stressorId: 's1' });
    expect(applyEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: 'KILL_NPC',
      npcId: 'n1',
      id: expect.stringMatching(/^event:canon-event-apply:/),
    }));
    expect(out.applied).toEqual([
      { opType: 'resolve_stressor', family: 'party_impact' },
      { opType: 'KILL_NPC', family: 'canon_event' },
    ]);
    expect(out.failed).toEqual([]);
  });
});

describe('interpretApply executor — per-item isolation (PIN B)', () => {
  it('a thrown verb is recorded in failed; siblings still land', async () => {
    const applyEvent = vi.fn(() => { throw new Error('boom'); });
    const recordPartyImpact = vi.fn().mockResolvedValue({ ok: true });
    const out = await runInterpretApply({
      accepted: [party(), canon()],
      campaignId: 'c1', saveId: 'sv1',
      actions: { applyEvent, recordPartyImpact },
    });
    expect(out.applied).toEqual([{ opType: 'resolve_stressor', family: 'party_impact' }]);
    expect(out.failed).toEqual([{ opType: 'KILL_NPC', family: 'canon_event', reason: 'boom' }]);
  });

  it('a party verb returning { ok:false } is a recorded failure (guard refusals honoured)', async () => {
    const recordPartyImpact = vi.fn().mockResolvedValue({ ok: false, reason: 'advance_paused' });
    const out = await runInterpretApply({
      accepted: [party()], campaignId: 'c1', actions: { recordPartyImpact },
    });
    expect(out.applied).toEqual([]);
    expect(out.failed).toEqual([{ opType: 'resolve_stressor', family: 'party_impact', reason: 'advance_paused' }]);
  });

  it('a missing verb / missing campaign is a recorded failure, never a throw', async () => {
    const out = await runInterpretApply({ accepted: [party(), canon()], saveId: 'sv1', actions: {} });
    expect(out.failed.map((f) => f.reason)).toEqual(['no_verb', 'no_verb']);
    const noCampaign = await runInterpretApply({ accepted: [party()], actions: { recordPartyImpact: vi.fn() } });
    expect(noCampaign.failed).toEqual([{ opType: 'resolve_stressor', family: 'party_impact', reason: 'no_campaign' }]);
  });
});

describe('interpretApply executor — landed-only log (PIN C)', () => {
  it('the apply record counts only what landed', async () => {
    const applyEvent = vi.fn(() => { throw new Error('nope'); });
    const recordPartyImpact = vi.fn().mockResolvedValue({ ok: true });
    const out = await runInterpretApply({
      accepted: [party(), canon()],
      campaignId: 'c1', saveId: 'sv1', seed: 7, interpretRef: 'r',
      actions: { applyEvent, recordPartyImpact },
    });
    expect(out.log.appliedCount).toBe(1);
    expect(out.log.partyImpactCount).toBe(1);
    expect(out.log.canonEventCount).toBe(0);
    expect(out.log.seed).toBe('7');
  });

  it('correlates duplicate op types by proposal id, never family+type coincidence', async () => {
    const applyEvent = vi.fn()
      .mockReturnValueOnce({ ok: true, receipts: [] })
      .mockReturnValueOnce({ ok: false, veto: { code: 'second_refused' } });
    const out = await runInterpretApply({
      accepted: [
        { index: 2, op: canon() },
        { index: 7, op: canon() },
      ],
      saveId: 'sv1',
      interpretRef: 'duplicate-compile',
      actions: { applyEvent },
    });

    expect(applyEvent).toHaveBeenCalledTimes(2);
    expect(out.applied).toEqual([{ opType: 'KILL_NPC', family: 'canon_event' }]);
    expect(out.failed).toEqual([{
      opType: 'KILL_NPC',
      family: 'canon_event',
      reason: 'second_refused',
    }]);
    expect(out.log.appliedCount).toBe(1);
    expect(out.commandResults.map((entry) => entry.proposalIndex)).toEqual([2, 7]);
    expect(new Set(out.commandResults.map((entry) => entry.commandId)).size).toBe(2);
  });

  it('merges recovery into the matching duplicate command result only', () => {
    const prior = {
      applied: [],
      failed: [
        { opType: 'CUT_TRADE_ROUTE', family: 'canon_event', reason: 'first' },
        { opType: 'CUT_TRADE_ROUTE', family: 'canon_event', reason: 'second' },
      ],
      commandResults: [
        {
          commandId: 'cmd:first',
          proposalIndex: 2,
          opType: 'CUT_TRADE_ROUTE',
          family: 'canon_event',
          status: 'reconcile-required',
          receipt: { status: 'reconcile-required', reason: 'first' },
        },
        {
          commandId: 'cmd:second',
          proposalIndex: 7,
          opType: 'CUT_TRADE_ROUTE',
          family: 'canon_event',
          status: 'reconcile-required',
          receipt: { status: 'reconcile-required', reason: 'second' },
        },
      ],
      log: { appliedCount: 0 },
    };
    const merged = mergeCanonEventRecoveryResult(prior, 'cmd:second', {
      status: 'applied',
      recovered: true,
      receipt: { status: 'applied', replayed: false },
    });

    expect(merged.applied).toEqual([{
      opType: 'CUT_TRADE_ROUTE',
      family: 'canon_event',
    }]);
    expect(merged.failed).toEqual([{
      opType: 'CUT_TRADE_ROUTE',
      family: 'canon_event',
      reason: 'first',
    }]);
    expect(merged.commandResults.map(item => item.status))
      .toEqual(['reconcile-required', 'applied']);
    expect(merged.log.appliedCount).toBe(1);
  });

  it('replays the same reviewed proposal without invoking its writer again', async () => {
    const applyEvent = vi.fn(() => ({ ok: true, receipts: [] }));
    const request = {
      accepted: [{ index: 3, op: canon() }],
      saveId: 'sv1',
      interpretRef: 'replay-compile',
      actions: { applyEvent },
    };
    const first = await runInterpretApply(request);
    const replay = await runInterpretApply(request);
    expect(first.commandResults[0].replayed).toBe(false);
    expect(replay.commandResults[0].replayed).toBe(true);
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  it('chains save revisions across one review and reconstructs that chain on replay', async () => {
    let revision = 'rev-1';
    let applyCount = 0;
    const applyEvent = vi.fn(() => {
      applyCount += 1;
      revision = `rev-${applyCount + 1}`;
      return {
        ok: true,
        receipts: [],
        after: { appliedAt: revision },
        persistenceOps: [{ saveId: 'sv1' }],
      };
    });
    const request = {
      accepted: [
        { index: 2, op: canon({ params: { npcId: 'n1' } }) },
        { index: 7, op: canon({ params: { npcId: 'n2' } }) },
      ],
      targetContext: {
        saveId: 'sv1',
        saveRevision: 'rev-1',
      },
      currentContext: {
        saveId: 'sv1',
        saveRevision: 'rev-1',
      },
      readCurrentContext: () => ({
        saveId: 'sv1',
        saveRevision: revision,
      }),
      reviewRef: 'revision-chain-review',
      actions: { applyEvent },
    };

    const first = await runInterpretApply(request);
    expect(first.commandResults.map(({ status }) => status))
      .toEqual(['applied', 'applied']);
    expect(applyEvent).toHaveBeenCalledTimes(2);
    const originalIds = first.commandResults.map(({ commandId }) => commandId);

    // The live save is now at the final revision. Replaying starts from the
    // review's original base, then recovers rev-2 from the first stored receipt;
    // it must find both original command ids rather than minting a new sibling.
    const replay = await runInterpretApply(request);
    expect(replay.commandResults.map(({ commandId }) => commandId))
      .toEqual(originalIds);
    expect(replay.commandResults.map(({ replayed }) => replayed))
      .toEqual([true, true]);
    expect(applyEvent).toHaveBeenCalledTimes(2);
  });

  it('does not conflate separate reviews when the server provides no compile ref', async () => {
    const applyEvent = vi.fn(() => ({ ok: true, receipts: [] }));
    const base = {
      accepted: [{ index: 3, op: canon() }],
      saveId: 'sv1',
      actions: { applyEvent },
    };
    const first = await runInterpretApply({ ...base, reviewRef: 'review-1' });
    const laterReview = await runInterpretApply({ ...base, reviewRef: 'review-2' });
    expect(first.commandResults[0].commandId)
      .not.toBe(laterReview.commandResults[0].commandId);
    expect(first.commandResults[0].replayed).toBe(false);
    expect(laterReview.commandResults[0].replayed).toBe(false);
    expect(applyEvent).toHaveBeenCalledTimes(2);
  });

  it('refuses a proposal when the active target changed during review', async () => {
    const applyEvent = vi.fn();
    const out = await runInterpretApply({
      accepted: [{ index: 0, op: canon() }],
      targetContext: {
        ownerId: 'owner-1',
        saveId: 'save-1',
        saveRevision: 'rev-1',
      },
      currentContext: {
        ownerId: 'owner-1',
        saveId: 'save-2',
        saveRevision: 'rev-1',
      },
      interpretRef: 'stale-target',
      actions: { applyEvent },
    });
    expect(out.applied).toEqual([]);
    expect(out.failed).toEqual([{
      opType: 'KILL_NPC',
      family: 'canon_event',
      reason: 'save_changed',
    }]);
    expect(out.commandResults[0].status).toBe('stale');
    expect(applyEvent).not.toHaveBeenCalled();
  });

  it('an unroutable op is surfaced, not applied', async () => {
    const out = await runInterpretApply({
      accepted: [{ family: 'ruleset_change', opType: 'SET_LAW' }],
      campaignId: 'c1', actions: { applyEvent: vi.fn(), recordPartyImpact: vi.fn() },
    });
    expect(out.unroutable).toEqual([{ opType: 'SET_LAW' }]);
    expect(out.applied).toEqual([]);
  });
});

describe('interpretApply — the Surveyor bridge (PIN D, EM-D4)', () => {
  const REVIEW = 'review:9f1b0a2c-0000-4000-8000-000000000001';
  const STAMP = '2026-09-23T09:30:00.000Z';
  const CREDIT = 5;

  /** The review's own output shape: `accepted` rows carry their review index. */
  const bridgeIo = (over = {}) => ({
    accepted: [{ index: 0, op: canon() }, { index: 1, op: party() }],
    blocked: [],
    ops: [canon(), party()],
    registry: [],
    reviewRef: REVIEW,
    surveyorCredit: CREDIT,
    orderedAt: STAMP,
    stageDecree: stage,
    ...over,
  });

  it('EM-D4 (1): an accepted proposal stages a decree with addedBy surveyor and its surveyorCredit through EM-C1 own stage, folded so the registry is that leaf\'s value and never a second writer\'s', () => {
    const out = stageSurveyorDecrees(bridgeIo());

    expect(out.registry.map((entry) => entry.addedBy),
      'ARCH §2 Decree.addedBy: BOTH entries are the Surveyor\'s, and the word is the'
      + ' registry\'s own third author rather than a string this bridge invented')
      .toEqual([DECREE_AUTHORS[2], DECREE_AUTHORS[2]]);
    expect(out.registry.map((entry) => entry.surveyorCredit),
      'and each carries the credit the compile that proposed it cost — the caller\'s'
      + ' number, quoted by the panel from config/pricing.js, never re-priced here')
      .toEqual([CREDIT, CREDIT]);
    expect(out.registry.map((entry) => [entry.status, entry.orderIndex, entry.orderedAt]),
      'PENDING, at the end of the DM\'s list, with the CALLER\'s stamp: the bridge reads'
      + ' no clock (HZ-STAMP) and mints no order of its own')
      .toEqual([['pending', 0, STAMP], ['pending', 1, STAMP]]);
    expect(out.registry.map((entry) => entry.op),
      'the compiled op rides verbatim as { type, target, payload }; target is null because'
      + ' a compiled proposal names no EntityRef — its payload addresses its own subject')
      .toEqual([
        { type: 'KILL_NPC', target: null, payload: { npcId: 'n1' } },
        { type: 'resolve_stressor', target: null, payload: { stressorId: 's1' } },
      ]);
    expect(out.staged.map((row) => [row.proposalIndex, row.opType]),
      'and the receipt names what landed, by the review index the DM decided on')
      .toEqual([[0, 'KILL_NPC'], [1, 'resolve_stressor']]);

    // THE ONE-WRITER PROOF: the same two entries reached by calling EM-C1's `stage` by
    // hand are byte-equal to the bridge's fold, so the bridge adds no key, drops none,
    // and cannot be a second writer of `decrees` dressed as one.
    const byHand = stage(
      stage([], { type: 'KILL_NPC', target: null, payload: { npcId: 'n1' } },
        { id: surveyorDecreeId(REVIEW, 0), orderedAt: STAMP, addedBy: 'surveyor', surveyorCredit: CREDIT }),
      { type: 'resolve_stressor', target: null, payload: { stressorId: 's1' } },
      { id: surveyorDecreeId(REVIEW, 1), orderedAt: STAMP, addedBy: 'surveyor', surveyorCredit: CREDIT },
    );
    expect(JSON.stringify(out.registry)).toBe(JSON.stringify(byHand));
  });

  it('EM-D4 (1b): every accepted proposal stages, including one the dispatcher calls unroutable, and a retry of one review re-derives the same ids so stage refuses the duplicates', () => {
    const unroutable = { family: 'ruleset_change', opType: 'SET_LAW', params: {} };
    const first = stageSurveyorDecrees(bridgeIo({
      accepted: [{ index: 0, op: canon() }, { index: 2, op: unroutable }],
      ops: [canon(), party(), unroutable],
    }));
    expect(first.staged.map((row) => row.opType),
      'the registry is the DM\'s list of what the table decided, not the dispatcher\'s list'
      + ' of what it can land today (design §3); binding the event catalogues into the'
      + ' decree vocabulary is EM-E6\'s row')
      .toEqual(['KILL_NPC', 'SET_LAW']);

    const retry = stageSurveyorDecrees(bridgeIo({
      accepted: [{ index: 0, op: canon() }, { index: 2, op: unroutable }],
      ops: [canon(), party(), unroutable],
      registry: first.registry,
    }));
    expect(retry.registry.length, 'a second Apply of ONE review adds nothing: the ids are'
      + ' derived from the review artifact, and stage refuses an id already in the registry')
      .toBe(2);
    expect(retry.staged, 'and the receipt says so rather than claiming a second landing').toEqual([]);
  });

  it('EM-D4 (2): consent renders as a guard kind\'s offer — one Guard per blocked proposal, its kind a GUARD_KINDS member and every offer a GUARD_OFFERS member, addressed to the entry it would become', () => {
    const out = stageSurveyorDecrees(bridgeIo({
      accepted: [{ index: 0, op: canon() }],
      blocked: [{ index: 1, reason: 'needs_consent' }],
      ops: [canon(), canon({ opType: 'EXPOSE_CORRUPTION', protectedFlags: ['canon_identity'] })],
    }));

    expect(out.guards.length, 'one guard for the one blocked proposal').toBe(1);
    const [guard] = out.guards;
    expect(GUARD_KINDS.includes(guard.kind),
      'THE KIND IS EM-C2\'s OWN: consent is a thing that must be true FIRST, so it wears the'
      + ' prerequisite kind; a withdrawn or renamed kind reds here rather than drifting')
      .toBe(true);
    expect(guard.kind).toBe('prerequisite');
    expect(guard.offers.filter((offer) => !GUARD_OFFERS.includes(offer)),
      'and every offer is a member of the seven design §2.7/§2.7a declare — this is the full'
      + ' offender list').toEqual([]);
    expect([...guard.offers], 'the DM\'s own hand, then the explicit tick; proceeding on a'
      + ' consent guard IS the consent, which is why the barrier is not weakened by carrying'
      + ' design §2.7\'s never-refuse offer').toEqual(['self', 'proceed']);
    expect(guard.entryId, 'the guard addresses the decree the blocked proposal WOULD become,'
      + ' so consenting stages that exact id and the guard never re-points')
      .toBe(surveyorDecreeId(REVIEW, 1));
    expect(guard.message, 'the herald\'s voice, naming the verb at stake')
      .toMatch(/^EXPOSE_CORRUPTION is protected — /);
    expect(out.registry.length, 'and a BLOCKED proposal stages nothing: the barrier is'
      + ' reviewInterpretation\'s, and this bridge renders it rather than judging it again')
      .toBe(1);
    expect(Object.keys(guard).sort(),
      'the Guard EM-C2 mints, key for key, so a registry page cannot tell a consent guard'
      + ' from an engine one').toEqual([
      'entryId', 'fulfil', 'id', 'kind', 'message', 'offers', 'overridden', 'relatedEntryId', 'ruleId',
    ]);
  });

  it('EM-D4 (4): the review artifact is the decree\'s identity and its shape is untouched — two reviews of one text give different ids, a malformed blocked row is skipped, and the bridge refuses without a writer, an artifact or a stamp', () => {
    const later = stageSurveyorDecrees(bridgeIo({ reviewRef: 'review:9f1b0a2c-0000-4000-8000-000000000002' }));
    // anchored: the two ids above are both non-empty strings from the same accepted op, so a
    // vacuous read would have to produce two equal ids, which is the very thing refuted.
    expect(later.staged[0].id).not.toBe(surveyorDecreeId(REVIEW, 0));
    expect(surveyorDecreeId(REVIEW, 0), 'the artifact is carried verbatim into the id, so the'
      + ' compile that proposed an entry is readable off the entry').toBe(`decree:${REVIEW}:0`);

    expect(consentGuardsFor([{ reason: 'needs_consent' }, null, 7], { reviewRef: REVIEW, ops: [] }),
      'design §9\'s tie-break: a row with no review index is skipped at the narrowest scope'
      + ' that can skip it, never guessed at').toEqual([]);

    const registry = [];
    for (const missing of [{ stageDecree: null }, { reviewRef: null }, { orderedAt: null }]) {
      const out = stageSurveyorDecrees(bridgeIo({ registry, ...missing }));
      expect(out.registry, 'each is the caller\'s to supply, and a decree minted without one'
        + ' would carry a made-up identity or a made-up time').toBe(registry);
      expect(out.staged).toEqual([]);
    }
    expect(stageSurveyorDecrees().staged, 'and the bridge is TOTAL: no argument at all is an'
      + ' empty fold, never a throw').toEqual([]);
  });
});
