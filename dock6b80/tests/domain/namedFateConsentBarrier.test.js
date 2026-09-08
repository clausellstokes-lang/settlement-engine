/**
 * namedFateConsentBarrier.test.js — Wave R-1 (atlas queue #2): the THREE paths
 * that delete a NAMED character now pass the identity-consent barrier.
 *
 * The doctrine ("never resolve a named character's fate" — the engine/AI must
 * not; the DM may) is served by ONE mechanism: ops flagged CANON_IDENTITY are
 * inert in review without an explicit `consented: true` (interpretReview.js).
 * The atlas found three deletion paths outside it:
 *
 *   PATH 1 — EXPOSE_CORRUPTION against a corrupt NPC: exposeCorruptNpc ousts the
 *            named character and installs a generated successor (a roster
 *            deletion hidden in a verb chosen for another purpose).
 *   PATH 2 — remove_npc (party arm): drops the named NPC's roster row outright;
 *            the party vocabulary never rode the identity guard at all.
 *   PATH 3 — party-caused KILL_NPC/KILL_LEADER: the world-pulse linkage
 *            (settlementSlice.applyEvent → mapEventToPartyImpact) escalates a
 *            consented tombstone-kill into a roster deletion; the consent copy
 *            now DISCLOSES that escalation (identityConsentNote).
 *
 * The flags are computed twice on purpose — edge-side (interpretCore.ts
 * flagProtected, from the posted vocabulary) and client-side
 * (applyIdentityConsentFlags, a union-only hardening) — so the barrier holds
 * even against a deployed edge that predates the party-arm rule.
 */

import { describe, it, expect } from 'vitest';
import {
  buildOpVocabulary, IDENTITY_EVENT_TYPES, IDENTITY_PARTY_KINDS,
  PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES,
  CANON_IDENTITY_FLAG, applyIdentityConsentFlags, identityConsentNote,
} from '../../src/domain/intent/opVocabulary.js';
import { reviewInterpretation } from '../../src/domain/intent/interpretReview.js';
import { dispatchAcceptedOps } from '../../src/domain/intent/applyDispatch.js';
import { flagProtected } from '../../supabase/functions/interpret-session/interpretCore.ts';
import { EVENT_TYPES } from '../../src/domain/events/registry.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import { PARTY_LINKED_EVENT_TYPES } from '../../src/domain/events/partyEventLinkage.js';

function op(overrides = {}) {
  return {
    family: 'canon_event', opType: 'ADD_NPC', params: {}, label: 'inferred',
    protectedFlags: [], rationale: '', sourced: true, ...overrides,
  };
}

describe('vocabulary — the deleting verbs are identity-guarded', () => {
  it('EXPOSE_CORRUPTION is an identity event type (registered, so it survives the drift filter)', () => {
    expect(IDENTITY_EVENT_TYPES).toContain('EXPOSE_CORRUPTION');
    expect(EVENT_TYPES).toContain('EXPOSE_CORRUPTION');
    expect(buildOpVocabulary().identityEventTypes).toContain('EXPOSE_CORRUPTION');
  });

  it('the phase-independent identity list holds exactly the deleting canon verbs, all registered', () => {
    // R-1 MUST-FIX 2: EXPOSE_CORRUPTION deletes its target in draft exactly as in
    // canon, so its consent is not phase-gated. KILL_NPC is deliberately NOT here
    // (a draft kill leaves a tombstone — an authorial edit, not a deletion).
    expect([...PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES]).toEqual(['EXPOSE_CORRUPTION']);
    for (const t of PHASE_INDEPENDENT_IDENTITY_EVENT_TYPES) {
      expect(IDENTITY_EVENT_TYPES, `${t} must also be on the identity list`).toContain(t);
    }
  });

  it('the party arm has its own identity list and remove_npc is on it', () => {
    expect(IDENTITY_PARTY_KINDS).toEqual(['remove_npc']);
    expect(buildOpVocabulary().identityPartyKinds).toEqual(['remove_npc']);
    for (const kind of IDENTITY_PARTY_KINDS) {
      expect(Object.keys(PARTY_IMPACT_KINDS), `${kind} must be a registered party kind`).toContain(kind);
    }
  });

  it('the linkage vocabulary that drives PATH 3 still maps the two kill verbs', () => {
    expect(PARTY_LINKED_EVENT_TYPES).toContain('KILL_NPC');
    expect(PARTY_LINKED_EVENT_TYPES).toContain('KILL_LEADER');
  });
});

describe('PATH 1 — EXPOSE_CORRUPTION passes the consent barrier', () => {
  const expose = op({ opType: 'EXPOSE_CORRUPTION', params: { targetId: 'npc-3' } });

  it('is flagged under a canonized phase (client hardening)', () => {
    const hardened = applyIdentityConsentFlags({ ops: [expose] }, { identityLockedPhase: true });
    expect(hardened.ops[0].protectedFlags).toContain(CANON_IDENTITY_FLAG);
  });

  it('unconsented dispatch is refused; consented dispatch proceeds', () => {
    const interp = applyIdentityConsentFlags({ ops: [expose] }, { identityLockedPhase: true });
    const refused = reviewInterpretation(interp, { 0: { action: 'approve' } });
    expect(refused.accepted).toEqual([]);
    expect(refused.blocked).toEqual([{ index: 0, reason: 'needs_consent' }]);
    const consented = reviewInterpretation(interp, { 0: { action: 'approve', consented: true } });
    expect(consented.blocked).toEqual([]);
    expect(consented.accepted.map(a => a.op.opType)).toEqual(['EXPOSE_CORRUPTION']);
  });

  it('is flagged in DRAFT too — the verb DELETES its target, so consent is phase-independent (R-1 MUST-FIX 2)', () => {
    // Executed probe (R-1 verification): draft-phase applyEvent EXPOSE_CORRUPTION
    // deleted a named NPC with ok:true, veto:null, protectedFlags:[] — the old
    // draft-scoping pin protected a hole, not a behavior. Flipped, not narrowed:
    // a deletion is never an authorial draft edit.
    const hardened = applyIdentityConsentFlags({ ops: [expose] }, { identityLockedPhase: false });
    expect(hardened.ops[0].protectedFlags).toContain(CANON_IDENTITY_FLAG);
  });

  it('draft-phase unconsented dispatch is refused; consented proceeds', () => {
    const interp = applyIdentityConsentFlags({ ops: [expose] }, { identityLockedPhase: false });
    const refused = reviewInterpretation(interp, { 0: { action: 'approve' } });
    expect(refused.accepted).toEqual([]);
    expect(refused.blocked).toEqual([{ index: 0, reason: 'needs_consent' }]);
    const consented = reviewInterpretation(interp, { 0: { action: 'approve', consented: true } });
    expect(consented.blocked).toEqual([]);
    expect(consented.accepted.map(a => a.op.opType)).toEqual(['EXPOSE_CORRUPTION']);
  });

  it('the authorial-edit scoping survives ONLY for the tombstone kills: draft KILL_NPC stays unflagged', () => {
    // Narrowed from the old blanket draft pin: KILL_NPC leaves a tombstone (the
    // NPC row survives, marked dead) — genuinely different from a roster deletion.
    const kill = op({ opType: 'KILL_NPC', params: { targetId: 'npc-2' } });
    const hardened = applyIdentityConsentFlags({ ops: [kill] }, { identityLockedPhase: false });
    expect(hardened.ops[0].protectedFlags).toEqual([]);
  });

  it('EDGE-SIDE: flagProtected mirrors the phase-independent branch (repo copy; deploy = T5 owner-gated)', () => {
    const vocab = buildOpVocabulary();
    // No identityLockedPhase in ctx (draft) — EXPOSE_CORRUPTION still flags…
    expect(flagProtected('canon_event', 'EXPOSE_CORRUPTION', {}, vocab, {})).toContain('canon_identity');
    // …while draft KILL_NPC stays freely approvable, and canon KILL_NPC still flags.
    expect(flagProtected('canon_event', 'KILL_NPC', {}, vocab, {})).toEqual([]);
    expect(flagProtected('canon_event', 'KILL_NPC', {}, vocab, { identityLockedPhase: true })).toContain('canon_identity');
  });
});

describe('PATH 2 — remove_npc (party arm) passes the consent barrier', () => {
  const removal = op({ family: 'party_impact', opType: 'remove_npc', params: { npcId: 'npc-7' } });

  it('is flagged regardless of phase (party impacts always address a canonized world)', () => {
    for (const identityLockedPhase of [true, false]) {
      const hardened = applyIdentityConsentFlags({ ops: [removal] }, { identityLockedPhase });
      expect(hardened.ops[0].protectedFlags).toContain(CANON_IDENTITY_FLAG);
    }
  });

  it('unconsented dispatch is refused; consented dispatch routes to recordPartyImpact', () => {
    const interp = applyIdentityConsentFlags({ ops: [removal] }, {});
    const refused = reviewInterpretation(interp, { 0: { action: 'approve' } });
    expect(refused.blocked).toEqual([{ index: 0, reason: 'needs_consent' }]);
    const consented = reviewInterpretation(interp, { 0: { action: 'approve', consented: true } });
    const { intents, unroutable } = dispatchAcceptedOps(consented.accepted, { campaignId: 'c1' });
    expect(unroutable).toEqual([]);
    expect(intents).toHaveLength(1);
    expect(intents[0].target).toBe('recordPartyImpact');
    expect(intents[0].action).toMatchObject({ kind: 'remove_npc', npcId: 'npc-7' });
  });

  it('the consent copy names the roster deletion', () => {
    expect(identityConsentNote(removal)).toMatch(/removes the named character/i);
  });

  it('EDGE-SIDE: flagProtected flags the party identity kind from the posted vocabulary', () => {
    const vocab = buildOpVocabulary();
    expect(flagProtected('party_impact', 'remove_npc', {}, vocab, {})).toContain('canon_identity');
    // A non-identity party kind stays freely approvable.
    expect(flagProtected('party_impact', 'bolster_faction', {}, vocab, {})).toEqual([]);
  });
});

describe('PATH 3 — party-caused KILL consents cover the linkage deletion', () => {
  const partyKill = op({ opType: 'KILL_NPC', params: { targetId: 'npc-2', partyCaused: true } });

  it('a party-caused KILL_NPC is flagged under canon and inert without consent', () => {
    const interp = applyIdentityConsentFlags({ ops: [partyKill] }, { identityLockedPhase: true });
    expect(interp.ops[0].protectedFlags).toContain(CANON_IDENTITY_FLAG);
    const refused = reviewInterpretation(interp, { 0: { action: 'approve' } });
    expect(refused.blocked).toEqual([{ index: 0, reason: 'needs_consent' }]);
  });

  it('consented dispatch proceeds and carries partyCaused into the applyEvent intent (the linkage input)', () => {
    const interp = applyIdentityConsentFlags({ ops: [partyKill] }, { identityLockedPhase: true });
    const consented = reviewInterpretation(interp, { 0: { action: 'approve', consented: true } });
    const { intents } = dispatchAcceptedOps(consented.accepted, { saveId: 's1' });
    expect(intents[0].target).toBe('applyEvent');
    expect(intents[0].event).toMatchObject({ type: 'KILL_NPC', partyCaused: true });
  });

  it('the consent copy DISCLOSES the roster deletion for party-caused kills only', () => {
    expect(identityConsentNote(partyKill)).toMatch(/roster entry is removed/i);
    expect(identityConsentNote(op({ opType: 'KILL_LEADER', params: { partyCaused: true } })))
      .toMatch(/roster entry is removed/i);
    // A plain (non-party) kill leaves the tombstone — no deletion disclosure.
    expect(identityConsentNote(op({ opType: 'KILL_NPC', params: { targetId: 'npc-2' } }))).toBeNull();
    // Non-deleting identity verbs carry no note at all.
    expect(identityConsentNote(op({ opType: 'PROMOTE_NPC' }))).toBeNull();
  });
});

describe('hardening discipline — union-only and idempotent', () => {
  it('never removes an edge-computed flag and never duplicates its own', () => {
    const preFlagged = op({
      family: 'party_impact', opType: 'remove_npc',
      protectedFlags: ['authored_target', CANON_IDENTITY_FLAG],
    });
    const hardened = applyIdentityConsentFlags({ ops: [preFlagged] }, {});
    expect(hardened.ops[0].protectedFlags).toEqual(['authored_target', CANON_IDENTITY_FLAG]);
  });

  it('non-identity ops pass through untouched (same reference, no flag churn)', () => {
    const benign = op({ opType: 'ADD_NPC' });
    const hardened = applyIdentityConsentFlags({ ops: [benign] }, { identityLockedPhase: true });
    expect(hardened.ops[0]).toBe(benign);
  });

  it('tolerates a missing/garbage interpretation (pure + total)', () => {
    expect(applyIdentityConsentFlags(null, {})).toBeNull();
    expect(applyIdentityConsentFlags({ ops: null }, {})).toEqual({ ops: null });
  });
});
