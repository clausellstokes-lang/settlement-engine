/**
 * tests/domain/interviewHistoryAudienceGate.test.js — the CLIENT side of the interview
 * audience gate (secrets-seam, fix wave 5).
 *
 * The transport (src/lib/interview.js) retains the multi-hop THREAD and posts prior turns
 * as follow-up context. A DM asked hop 1 under the DM audience (the answer named a
 * secret), then flipped to Player-safe for hop 2. `projectHistoryForAudience` is the
 * client chokepoint that must NOT carry that DM answer into a player-audience request —
 * mirroring the server backstop (interviewCore.buildPriorExchange). The server re-enforces
 * authoritatively; this proves the client does not leak on the wire in the first place.
 */
import { describe, it, expect, vi } from 'vitest';

// interview.js pulls the supabase client singleton + analytics + the slice selector at
// module load; none are needed to exercise the pure history projection, so stub them so
// the import doesn't spin up a real Supabase client (createClient throws on empty env).
vi.mock('../../src/lib/supabase.js', () => ({ supabase: { functions: { invoke: vi.fn() } }, isConfigured: true }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), EVENTS: {} }));
vi.mock('../../src/domain/ai/index.js', () => ({ selectSlices: vi.fn() }));

import { projectHistoryForAudience } from '../../src/lib/interview.js';

const DM_SECRET = 'the reeve is secretly poisoning the town well';
const DM_QUESTION = 'who is the hidden traitor?';
const PLAYER_FACT = 'the market is busiest on market day';
const history = [
  { question: DM_QUESTION, answer: DM_SECRET, audience: 'dm' },
  { question: 'when is the market?', answer: PLAYER_FACT, audience: 'player' },
];

describe('projectHistoryForAudience — the client audience gate across hops', () => {
  it('drops a DM-audience prior turn under a player-safe follow-up (the leak)', () => {
    const out = projectHistoryForAudience(history, 'player');
    // FAILS against pre-fix code: priorTurns kept every prior answer regardless of audience.
    expect(out.some((t) => t.answer === DM_SECRET || t.question === DM_QUESTION)).toBe(false);
    // … but keeps the prior PLAYER-audience turn (no over-blocking) and tags it.
    expect(out).toEqual([{ question: 'when is the market?', answer: PLAYER_FACT, audience: 'player' }]);
  });

  it('carries all prior turns under a DM follow-up (DM sees the full thread)', () => {
    const out = projectHistoryForAudience(history, 'dm');
    expect(out).toHaveLength(2);
    expect(out.some((t) => t.answer === DM_SECRET)).toBe(true);
    expect(out.some((t) => t.answer === PLAYER_FACT)).toBe(true);
  });

  it('FAIL CLOSED: an untagged prior turn is dropped under player, kept under DM', () => {
    const untagged = [{ question: 'q', answer: DM_SECRET }]; // no audience tag
    expect(projectHistoryForAudience(untagged, 'player')).toEqual([]);
    expect(projectHistoryForAudience(untagged, 'dm')).toEqual([{ question: 'q', answer: DM_SECRET, audience: 'dm' }]);
  });

  it('caps to the last six eligible turns and coerces missing fields to strings', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ question: `q${i}`, answer: `a${i}`, audience: 'player' }));
    const out = projectHistoryForAudience(many, 'player');
    expect(out).toHaveLength(6);
    expect(out[0].question).toBe('q3'); // last six kept (q3..q8)
    const coerced = projectHistoryForAudience([{ question: 'q', audience: 'player' }], 'player');
    expect(coerced).toEqual([{ question: 'q', answer: '', audience: 'player' }]);
  });
});
