/**
 * tests/lib/interpretApply.test.js — the ACCEPT→MINT executor pins
 * (Surveyor S3→S4 seam, DESIGN_AI_CONTROL_SURFACE §2 stage 3).
 *
 *   PIN A (NEVER-BYPASS): every landed op flows through a registered application
 *     command and its established applyEvent / recordPartyImpact writer.
 *   PIN B (PER-ITEM ISOLATION): one command failure is recorded in `failed`, and the
 *     rest still land (the review is per-item; so is the apply).
 *   PIN C (LANDED-ONLY LOG): the §3 apply record covers what LANDED, not what was proposed.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  mergeCanonEventRecoveryResult,
  runInterpretApply,
} from '../../src/lib/intent/interpretApply.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';

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
