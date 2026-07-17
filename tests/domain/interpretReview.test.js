/**
 * tests/domain/interpretReview.test.js — the S3 REVIEW-side pins
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 3 / §2c point 5 / §9 correction typology).
 *
 *   PIN A (PER-ITEM FLOW): approve / edit / reject each op independently; only accepted
 *     ops flow onward; an edit re-shapes the op; a pending op is inert.
 *   PIN B (PROTECTED-CONSENT BARRIER): a protected-flagged op is NEVER accepted without an
 *     explicit consent — "never silently approvable" by construction.
 *   PIN C (CORRECTION TYPOLOGY LIVE): every edit/reject classifies into a §9 SURVEYOR class;
 *     correctionRate is the interpret eval metric.
 *   PIN D (VOCABULARY): the client tool-schema builder enumerates the real registries and
 *     the identity guard references only real registered types.
 */
import { describe, it, expect } from 'vitest';
import {
  REVIEW_ACTIONS, reviewInterpretation, correctionRate, resolveCorrectionClass,
  addedOpCorrection, isInterpretCorrectionClass,
} from '../../src/domain/intent/interpretReview.js';
import { buildOpVocabulary, buildProtectedContext, IDENTITY_EVENT_TYPES } from '../../src/domain/intent/opVocabulary.js';
import { SURVEYOR_CLASSES } from '../../src/domain/intent/correctionTypology.js';
import { EVENT_TYPES } from '../../src/domain/events/registry.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';

function op(overrides = {}) {
  return { family: 'canon_event', opType: 'ADD_NPC', params: { name: 'Bram' }, label: 'required', protectedFlags: [], rationale: '', sourced: true, ...overrides };
}

// ── PIN A: per-item flow ───────────────────────────────────────────────────────

describe('interpret review — per-item flow (PIN A)', () => {
  const interp = {
    ops: [
      op({ opType: 'ADD_NPC' }),
      op({ opType: 'KILL_NPC', params: { npcId: 'n1' }, label: 'inferred' }),
      op({ opType: 'DAMAGE_INSTITUTION', params: { instId: 'i1', magnitude: 3 }, label: 'optional' }),
    ],
    unsupported: [],
  };

  it('only approved/edited ops are accepted; pending + rejected are not', () => {
    const { accepted } = reviewInterpretation(interp, {
      0: { action: 'approve' },
      1: { action: 'reject' },
      2: { action: 'pending' },
    });
    expect(accepted.map((a) => a.op.opType)).toEqual(['ADD_NPC']);
  });

  it('an edit re-shapes the op params/type and marks it edited', () => {
    const { accepted } = reviewInterpretation(interp, {
      2: { action: 'edit', editedParams: { instId: 'i1', magnitude: 1 } },
    });
    expect(accepted).toHaveLength(1);
    expect(accepted[0].op.params).toEqual({ instId: 'i1', magnitude: 1 });
    expect(accepted[0].op.edited).toBe(true);
  });

  it('an empty / all-pending interpretation accepts nothing and corrects nothing', () => {
    expect(reviewInterpretation({ ops: [] }, {})).toEqual({ accepted: [], blocked: [], corrections: [] });
    const r = reviewInterpretation(interp, {});
    expect(r.accepted).toEqual([]);
    expect(r.corrections).toEqual([]);
  });

  it('REVIEW_ACTIONS is the frozen action set', () => {
    expect([...REVIEW_ACTIONS]).toEqual(['approve', 'edit', 'reject', 'pending']);
  });
});

// ── PIN B: the protected-consent barrier ───────────────────────────────────────

describe('interpret review — protected-consent barrier (PIN B)', () => {
  const interp = { ops: [op({ opType: 'KILL_NPC', params: { npcId: 'n1' }, protectedFlags: ['authored_target'] })], unsupported: [] };

  it('a protected-flagged op approved WITHOUT consent is BLOCKED, never accepted', () => {
    const r = reviewInterpretation(interp, { 0: { action: 'approve' } });
    expect(r.accepted).toEqual([]);
    expect(r.blocked).toEqual([{ index: 0, reason: 'needs_consent' }]);
  });

  it('the same op WITH explicit consent is accepted', () => {
    const r = reviewInterpretation(interp, { 0: { action: 'approve', consented: true } });
    expect(r.accepted.map((a) => a.op.opType)).toEqual(['KILL_NPC']);
    expect(r.blocked).toEqual([]);
  });

  it('an edit of a protected op ALSO requires consent', () => {
    const r = reviewInterpretation(interp, { 0: { action: 'edit', editedParams: { npcId: 'n1' } } });
    expect(r.accepted).toEqual([]);
    expect(r.blocked).toHaveLength(1);
  });
});

// ── PIN C: the correction typology goes live ───────────────────────────────────

describe('interpret review — correction typology (PIN C)', () => {
  it('every default class is one of the six §9 Surveyor classes', () => {
    // reject a required op → misread_requirement
    expect(resolveCorrectionClass({}, op({ label: 'required' }), 'reject')).toBe('misread_requirement');
    // reject an inferred/optional op → over_inference
    expect(resolveCorrectionClass({}, op({ label: 'optional' }), 'reject')).toBe('over_inference');
    // edit params only → wrong_magnitude
    expect(resolveCorrectionClass({ editedParams: {} }, op({ opType: 'DAMAGE_INSTITUTION' }), 'edit')).toBe('wrong_magnitude');
    // edit that changes the type → wrong_mechanism
    expect(resolveCorrectionClass({ editedType: 'IMPAIR_INSTITUTION' }, op({ opType: 'DAMAGE_INSTITUTION' }), 'edit')).toBe('wrong_mechanism');
    // a protected graze always classifies as protected_constraint_graze
    expect(resolveCorrectionClass({}, op({ protectedFlags: ['authored_target'] }), 'reject')).toBe('protected_constraint_graze');
    // an explicit valid class wins
    expect(resolveCorrectionClass({ correctionClass: 'under_inference' }, op(), 'reject')).toBe('under_inference');
    // an explicit INVALID class falls back to the default
    expect(resolveCorrectionClass({ correctionClass: 'not_a_class' }, op({ label: 'required' }), 'reject')).toBe('misread_requirement');
    for (const cls of SURVEYOR_CLASSES) expect(isInterpretCorrectionClass(cls)).toBe(true);
    expect(isInterpretCorrectionClass('unclassified_manual')).toBe(false); // the pre-Surveyor class is not live here
    expect(addedOpCorrection()).toEqual({ class: 'under_inference' });
  });

  it('correctionRate is corrections / total ops (the interpret eval metric)', () => {
    const interp = { ops: [op(), op({ opType: 'KILL_NPC', params: { npcId: 'n1' } }), op({ opType: 'PROMOTE_NPC' }), op({ opType: 'ADD_INSTITUTION' })] };
    // 1 reject + 1 edit of 4 ops → 0.5
    const decisions = { 0: { action: 'approve' }, 1: { action: 'reject' }, 2: { action: 'edit', editedParams: {} }, 3: { action: 'pending' } };
    expect(correctionRate(interp, decisions)).toBe(0.5);
    expect(correctionRate({ ops: [] }, {})).toBe(0);
    const { corrections } = reviewInterpretation(interp, decisions);
    expect(corrections.map((c) => c.class).sort()).toEqual(['misread_requirement', 'wrong_magnitude']);
  });
});

// ── PIN D: the client tool-schema builder ──────────────────────────────────────

describe('interpret review — op vocabulary builder (PIN D)', () => {
  it('the vocabulary enumerates the real registries (40 canon types + 12 party kinds)', () => {
    const v = buildOpVocabulary();
    expect(v.canonEventTypes).toEqual([...EVENT_TYPES]);
    expect(v.canonEventTypes.length).toBe(40);
    expect(v.partyImpactKinds).toEqual(Object.keys(PARTY_IMPACT_KINDS));
    expect(v.partyImpactKinds.length).toBe(12);
  });

  it('every identity-guard type is a REAL registered canon type (no stale guard)', () => {
    const canon = new Set(EVENT_TYPES);
    for (const t of IDENTITY_EVENT_TYPES) expect(canon.has(t), `${t} missing from registry`).toBe(true);
    expect(buildOpVocabulary().identityEventTypes).toEqual([...IDENTITY_EVENT_TYPES]);
  });

  it('protected context collects _authored/locked/pinned entity ids + the canon phase', () => {
    const settlement = {
      npcs: [{ id: 'n1', _authored: true }, { id: 'n2' }, { id: 'n3', locked: true }],
      institutions: [{ id: 'i1', pinned: true }, { id: 'i2' }],
      factions: [{ id: 'f1' }],
    };
    const draft = buildProtectedContext(settlement, 'draft');
    expect(draft.protectedTargets.sort()).toEqual(['i1', 'n1', 'n3']);
    expect(draft.identityLockedPhase).toBe(false);
    expect(buildProtectedContext(settlement, 'canon').identityLockedPhase).toBe(true);
    expect(buildProtectedContext(null, 'draft')).toEqual({ protectedTargets: [], identityLockedPhase: false });
  });
});
