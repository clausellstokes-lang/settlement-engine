/**
 * tests/lib/interpretApply.test.js — the ACCEPT→MINT executor pins
 * (Surveyor S3→S4 seam, DESIGN_AI_CONTROL_SURFACE §2 stage 3).
 *
 *   PIN A (NEVER-BYPASS): every landed op flows through a registered store verb — the
 *     executor calls applyEvent / recordPartyImpact, never writes state itself.
 *   PIN B (PER-ITEM ISOLATION): one op's verb failure is recorded in `failed`, and the
 *     rest still land (the review is per-item; so is the apply).
 *   PIN C (LANDED-ONLY LOG): the §3 apply record covers what LANDED, not what was proposed.
 */
import { describe, it, expect, vi } from 'vitest';
import { runInterpretApply } from '../../src/lib/intent/interpretApply.js';

const party = (o = {}) => ({ family: 'party_impact', opType: 'resolve_stressor', params: { stressorId: 's1' }, label: 'required', ...o });
const canon = (o = {}) => ({ family: 'canon_event', opType: 'KILL_NPC', params: { npcId: 'n1' }, label: 'inferred', ...o });

describe('interpretApply executor — never-bypass (PIN A)', () => {
  it('lands each accepted op through its registered store verb', async () => {
    const applyEvent = vi.fn();
    const recordPartyImpact = vi.fn().mockResolvedValue({ ok: true });
    const out = await runInterpretApply({
      accepted: [{ op: party() }, { op: canon() }],
      campaignId: 'c1', saveId: 'sv1', seed: 42, interpretRef: 'ref1',
      actions: { applyEvent, recordPartyImpact },
    });
    expect(recordPartyImpact).toHaveBeenCalledWith('c1', { kind: 'resolve_stressor', stressorId: 's1' });
    expect(applyEvent).toHaveBeenCalledWith({ type: 'KILL_NPC', npcId: 'n1' });
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

  it('an unroutable op is surfaced, not applied', async () => {
    const out = await runInterpretApply({
      accepted: [{ family: 'ruleset_change', opType: 'SET_LAW' }],
      campaignId: 'c1', actions: { applyEvent: vi.fn(), recordPartyImpact: vi.fn() },
    });
    expect(out.unroutable).toEqual([{ opType: 'SET_LAW' }]);
    expect(out.applied).toEqual([]);
  });
});
