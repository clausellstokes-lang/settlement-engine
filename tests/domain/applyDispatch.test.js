/**
 * tests/domain/applyDispatch.test.js — the ACCEPT→MINT dispatcher pins
 * (Surveyor S3→S4 seam, DESIGN_AI_CONTROL_SURFACE §2 stage 3 accept→mint wiring).
 *
 *   PIN A (ROUTING): a party_impact op routes to recordPartyImpact with an { kind, ...params }
 *     action; a canon_event op routes to applyEvent with a { type, ...params } event — the SAME
 *     shapes the manual UI feeds those verbs (one vocabulary, manual + AI).
 *   PIN B (HONEST UNROUTABLE): an op naming no dispatchable family is collected in `unroutable`,
 *     never silently dropped (the schema-wall discipline at the apply mouth).
 *   PIN C (SHAPE TOLERANCE): both the reviewInterpretation {index,op} entries and bare ops route.
 *   PIN D (APPLY-SIDE aiOperationLog): the record carries ENGINE VERSION + SEED + counts +
 *     the compile ref — and NEVER params, prose, or PII (§3 determinism/audit, no-content law).
 */
import { describe, it, expect } from 'vitest';
import {
  APPLY_FAMILIES, ENGINE_VERSION, intentForOp, dispatchAcceptedOps, interpretApplyLogRecord,
} from '../../src/domain/intent/applyDispatch.js';
import { GENERATOR_VERSION, SIMULATION_VERSION } from '../../src/domain/settlement.schema.js';

const party = (o = {}) => ({ family: 'party_impact', opType: 'resolve_stressor', params: { stressorId: 's1' }, label: 'required', ...o });
const canon = (o = {}) => ({ family: 'canon_event', opType: 'KILL_NPC', params: { npcId: 'n1' }, label: 'inferred', ...o });

describe('applyDispatch — routing (PIN A)', () => {
  it('a party_impact op routes to recordPartyImpact with a { kind, ...params } action', () => {
    const intent = intentForOp(party(), { campaignId: 'c1', saveId: 'sv1' });
    expect(intent).toMatchObject({
      family: 'party_impact', target: 'recordPartyImpact', opType: 'resolve_stressor',
      campaignId: 'c1', saveId: null, action: { kind: 'resolve_stressor', stressorId: 's1' },
    });
    expect(intent.event).toBeUndefined();
  });

  it('a canon_event op routes to applyEvent with a { type, ...params } event', () => {
    const intent = intentForOp(canon(), { campaignId: 'c1', saveId: 'sv1' });
    expect(intent).toMatchObject({
      family: 'canon_event', target: 'applyEvent', opType: 'KILL_NPC',
      saveId: 'sv1', event: { type: 'KILL_NPC', npcId: 'n1' },
    });
    expect(intent.action).toBeUndefined();
  });

  it('APPLY_FAMILIES is the frozen family set', () => {
    expect(APPLY_FAMILIES).toEqual(['canon_event', 'party_impact']);
    expect(Object.isFrozen(APPLY_FAMILIES)).toBe(true);
  });
});

describe('applyDispatch — honest unroutable (PIN B)', () => {
  it('an op with an unknown family is collected in unroutable, never routed', () => {
    const { intents, unroutable } = dispatchAcceptedOps([
      party(), canon(), { family: 'ruleset_change', opType: 'SET_LAW' }, { opType: '' },
    ], { campaignId: 'c1', saveId: 'sv1' });
    expect(intents).toHaveLength(2);
    expect(unroutable).toEqual([{ opType: 'SET_LAW' }]);
  });

  it('intentForOp returns null for a garbage op', () => {
    expect(intentForOp(null)).toBeNull();
    expect(intentForOp({ opType: 'X', family: 'nope' })).toBeNull();
    expect(intentForOp({ family: 'canon_event' })).toBeNull();
  });
});

describe('applyDispatch — shape tolerance (PIN C)', () => {
  it('accepts both {index, op} review entries and bare ops', () => {
    const fromReview = dispatchAcceptedOps([{ index: 0, op: party() }, { index: 1, op: canon() }], { campaignId: 'c1', saveId: 'sv1' });
    const fromBare = dispatchAcceptedOps([party(), canon()], { campaignId: 'c1', saveId: 'sv1' });
    expect(fromReview.intents).toHaveLength(2);
    expect(fromBare.intents).toHaveLength(2);
    expect(fromReview.intents[0].target).toBe('recordPartyImpact');
    expect(fromReview.intents[1].target).toBe('applyEvent');
  });
});

describe('applyDispatch — apply-side aiOperationLog (PIN D)', () => {
  it('ENGINE_VERSION is a stable string derived from the schema versions', () => {
    expect(ENGINE_VERSION).toBe(`gen-${GENERATOR_VERSION}/sim-${SIMULATION_VERSION}`);
    expect(typeof ENGINE_VERSION).toBe('string');
  });

  it('the record carries engine version + seed + counts + compile ref', () => {
    const { intents } = dispatchAcceptedOps([party(), canon(), canon({ opType: 'ADD_NPC', label: 'optional' })], { campaignId: 'c1', saveId: 'sv1' });
    const rec = interpretApplyLogRecord({
      intents, seed: 12345, interpretRef: 'abc123',
      corrections: [{ class: 'wrong_magnitude' }], blocked: [{}, {}], now: '2026-07-17T00:00:00.000Z',
    });
    expect(rec).toMatchObject({
      kind: 'interpret_apply', engineVersion: ENGINE_VERSION, seed: '12345', interpretRef: 'abc123',
      appliedCount: 3, canonEventCount: 2, partyImpactCount: 1, correctionCount: 1, blockedCount: 2,
      at: '2026-07-17T00:00:00.000Z',
    });
    expect(rec.byLabel).toEqual({ required: 1, inferred: 1, optional: 1 });
  });

  it('the record carries NO params, prose, or PII — only counts/enums/seed/ref', () => {
    const { intents } = dispatchAcceptedOps([party({ params: { stressorId: 'SECRET_ID', note: 'a private thing' } })], { campaignId: 'c1' });
    const rec = interpretApplyLogRecord({ intents, seed: 'seed-x', interpretRef: 'h' });
    const blob = JSON.stringify(rec);
    expect(blob).not.toContain('SECRET_ID');
    expect(blob).not.toContain('a private thing');
    expect(blob).not.toContain('stressorId');
  });

  it('a null seed / missing ref degrade cleanly (never a throw)', () => {
    const rec = interpretApplyLogRecord({});
    expect(rec.seed).toBeNull();
    expect(rec.interpretRef).toBeNull();
    expect(rec.appliedCount).toBe(0);
    expect(rec.engineVersion).toBe(ENGINE_VERSION);
  });
});
