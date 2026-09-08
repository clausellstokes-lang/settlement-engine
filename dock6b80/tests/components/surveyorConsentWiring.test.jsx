/** @vitest-environment jsdom */
/**
 * surveyorConsentWiring.test.jsx — Wave R-1 (atlas queue #2): the panel-level
 * wiring that makes the protected-consent barrier LIVE.
 *
 * The barrier was fully built at both ends and disconnected in the middle:
 * `buildProtectedContext` had ZERO production callers, so compileInterpretation
 * POSTed `protectedContext: null` and the edge's flagProtected could never flag
 * anything — no AUTHORED_TARGET, no CANON_IDENTITY, no consent tick, ever.
 *
 * PINS:
 *   A. compile POSTs a real protected context (identityLockedPhase from the
 *      lifecycle phase; protectedTargets from authored/locked entities).
 *   B. STALE-EDGE HARDENING: an identity op returned WITHOUT flags (the shape a
 *      deployed edge that predates the party-arm rule produces) still renders
 *      the consent tick — applyIdentityConsentFlags unions the flag client-side.
 *   C. the deleting verbs' consent copy carries the deletion disclosure.
 *   D. (R-1 MUST-FIX 2) draft-phase EXPOSE_CORRUPTION demands the consent tick —
 *      the verb DELETES its target (oust + successor), so its consent is
 *      phase-INDEPENDENT — and a consented one proceeds through applyEvent,
 *      while draft KILL_NPC (tombstone) keeps its unflagged authorial scoping.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

const { storeRef, compileRef, analyticsRef, canonAuthorityRef } = vi.hoisted(() => ({
  storeRef: { current: {} }, compileRef: { fn: null },
  analyticsRef: { fn: null }, canonAuthorityRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = selector => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'chronicle', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileInterpretation: (...a) => compileRef.fn(...a) }));
// The PIN-D apply click walks the real review + command path; only the
// transport-adjacent seams are mocked (the sibling panel test's idiom).
vi.mock('../../src/lib/canonEventCommandPersistence.js', () => ({
  readCanonEventCommandAuthority: (...args) => canonAuthorityRef.fn(...args),
}));
vi.mock('../../src/lib/analytics.js', () => ({
  EVENTS: {
    AI_INTERPRET_CORRECTION: 'ai_interpret_correction',
    SURVEYOR_ADOPTION: 'surveyor_adoption',
  },
  track: (...args) => analyticsRef.fn(...args),
}));

import InterpretApplyPanel from '../../src/components/surveyor/InterpretApplyPanel.jsx';

// A stale-edge-shaped response: identity ops arrive with EMPTY protectedFlags.
const STALE_EDGE_INTERPRETATION = {
  ops: [
    { opType: 'remove_npc', family: 'party_impact', params: { npcId: 'npc-7' }, label: 'inferred', protectedFlags: [] },
    { opType: 'KILL_NPC', family: 'canon_event', params: { targetId: 'npc-2', partyCaused: true }, label: 'inferred', protectedFlags: [] },
    { opType: 'ADD_NPC', family: 'canon_event', params: { name: 'Bram' }, label: 'optional', protectedFlags: [] },
    { opType: 'EXPOSE_CORRUPTION', family: 'canon_event', params: { targetId: 'npc-9' }, label: 'inferred', protectedFlags: [] },
  ],
};

beforeEach(() => {
  storeRef.current = {
    phase: 'canon',
    settlement: {
      id: 's1',
      npcs: [{ id: 'npc-2', name: 'Mira', _authored: true }],
      institutions: [], factions: [],
    },
    savedSettlements: [], campaigns: [{ id: 'camp-1', worldState: { tick: 3 } }],
    activeCampaignId: 'camp-1', selectedSettlementId: 's1', activeSaveId: 'save-1', creditBalance: 25,
    applyEvent: vi.fn(() => ({ ok: true })), recordPartyImpact: vi.fn(async () => ({ ok: true })),
  };
  analyticsRef.fn = vi.fn();
  canonAuthorityRef.fn = vi.fn();
  compileRef.fn = vi.fn(async () => ({
    ok: true, interpretation: STALE_EDGE_INTERPRETATION, seed: 'seed-w', interpretRef: 'ref-w', musings: [],
  }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function interpret() {
  render(<InterpretApplyPanel />);
  fireEvent.change(screen.getByLabelText(/paste the session recap/i), { target: { value: 'the party removed the captain' } });
  fireEvent.click(screen.getByRole('button', { name: /^interpret$/i }));
}

describe('consent wiring — the barrier is connected end to end', () => {
  it('PIN A: compile POSTs the protected context (phase + authored targets)', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    expect(compileRef.fn).toHaveBeenCalledTimes(1);
    const posted = compileRef.fn.mock.calls[0][0];
    expect(posted.protectedContext).toEqual({
      protectedTargets: ['npc-2'],
      identityLockedPhase: true,
    });
  });

  it('PIN B: identity ops from a stale edge still raise the consent tick (client hardening)', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    // remove_npc (party arm) and the party-caused KILL_NPC are both hardened…
    expect(screen.getByLabelText(/consent to the protected op .*remove/i)).toBeTruthy();
    expect(screen.getByTestId('op-0').textContent).toMatch(/protected/i);
    expect(screen.getByTestId('op-1').textContent).toMatch(/protected/i);
    // …while the benign ADD_NPC stays freely approvable.
    expect(screen.getByTestId('op-2').textContent).not.toMatch(/protected/i);
  });

  it('PIN C: the deleting verbs disclose the roster deletion in the consent line', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    expect(screen.getByTestId('op-0').textContent).toMatch(/removes the named character/i);
    expect(screen.getByTestId('op-1').textContent).toMatch(/roster entry is removed/i);
  });

  it('draft phase posts identityLockedPhase:false and leaves the TOMBSTONE kill unflagged', async () => {
    storeRef.current = { ...storeRef.current, phase: 'draft' };
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    const posted = compileRef.fn.mock.calls[0][0];
    expect(posted.protectedContext.identityLockedPhase).toBe(false);
    // The party-arm deletion is phase-independent; the canon KILL (tombstone —
    // narrowed from the old blanket canon-kills claim, R-1 MUST-FIX 2) is not.
    expect(screen.getByTestId('op-0').textContent).toMatch(/protected/i);
    expect(screen.getByTestId('op-1').textContent).not.toMatch(/protected/i);
  });

  it('PIN D: draft-phase EXPOSE_CORRUPTION demands the consent tick; consented, it proceeds', async () => {
    storeRef.current = { ...storeRef.current, phase: 'draft' };
    interpret();
    await waitFor(() => screen.getByTestId('op-3'));
    // The deleting canon verb is protected even in DRAFT and says what is at stake.
    expect(screen.getByTestId('op-3').textContent).toMatch(/protected/i);
    expect(screen.getByTestId('op-3').textContent).toMatch(/ousted and replaced/i);
    const consentTick = screen.getByLabelText(/consent to the protected op .*corruption/i);
    // Approved WITHOUT the tick: the barrier blocks it and the writer never runs.
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[3]);
    fireEvent.click(screen.getByRole('button', { name: /apply accepted ops/i }));
    await waitFor(() => screen.getByTestId('apply-result'));
    expect(screen.getByTestId('apply-result').textContent).toMatch(/1 blocked/i);
    expect(storeRef.current.applyEvent).not.toHaveBeenCalled();
    // Ticked: the consented deletion proceeds through applyEvent.
    fireEvent.click(consentTick);
    fireEvent.click(screen.getByRole('button', { name: /apply accepted ops/i }));
    await waitFor(() => expect(storeRef.current.applyEvent).toHaveBeenCalledTimes(1));
    expect(storeRef.current.applyEvent.mock.calls[0][0]).toMatchObject({ type: 'EXPOSE_CORRUPTION' });
    await waitFor(() => expect(screen.getByTestId('apply-result').textContent).toMatch(/applied 1/i));
  });
});
