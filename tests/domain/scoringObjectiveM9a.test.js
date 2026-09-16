/**
 * scoringObjectiveM9a.test.js — Phase 5.5 M9a, component (2): OBJECTIVE-
 * PARAMETERIZED SCORING (VI.1's two-step completion).
 *
 * The scorer reads a per-archetype objective descriptor. The BINDING contract:
 *   - a DEFAULT (or unmapped-archetype) objective reduces the enumeration EXACTLY
 *     to Wave A's byte-identical move set (no levers, same base-4 scores);
 *   - a merchant / church / warlord objective re-tunes the war/peace balance AND
 *     enumerates its own non-war levers (reroute/embargo/credit; missionize/
 *     legitimacy; prestige/opportunity).
 */
import { describe, it, expect } from 'vitest';

import {
  DEFAULT_SCORING_OBJECTIVE, SCORING_OBJECTIVES, objectiveForArchetype, leverNamesOf,
} from '../../src/domain/worldPulse/scoringObjective.js';
import { enumerateMoves } from '../../src/domain/worldPulse/settlementStrategy.js';

// A strength lookup: the actor 's' is strong; a hostile weaker target 'x'.
const strengthFor = (id) => (String(id) === 's' ? 0.8 : String(id) === 'x' ? 0.3 : 0.5);
const ctxWithTarget = { homeBesieged: false, hostileTargets: ['x'], vassalIds: [], vassalBesieged: false, besieging: [] };
const movesMap = (rows) => Object.fromEntries(rows.map((r) => [r.move, r.score]));

describe('M9a scoring — objectiveForArchetype selection', () => {
  it('unmapped / null archetypes reduce to the DEFAULT descriptor (reference-identical)', () => {
    for (const a of [null, undefined, '', 'government', 'noble', 'civic', 'craft', 'labor', 'arcane', 'other']) {
      expect(objectiveForArchetype(a)).toBe(DEFAULT_SCORING_OBJECTIVE);
    }
  });
  it('the overriding archetypes each return their own set', () => {
    expect(objectiveForArchetype('merchant')).toBe(SCORING_OBJECTIVES.merchant);
    expect(objectiveForArchetype('religious')).toBe(SCORING_OBJECTIVES.religious);
    expect(objectiveForArchetype('military')).toBe(SCORING_OBJECTIVES.military);
  });
  it('the DEFAULT carries NO levers; every override carries at least one', () => {
    expect(leverNamesOf(DEFAULT_SCORING_OBJECTIVE)).toEqual([]);
    expect(leverNamesOf(SCORING_OBJECTIVES.merchant)).toEqual(['credit', 'embargo', 'reroute']);
    expect(leverNamesOf(SCORING_OBJECTIVES.religious)).toEqual(['legitimacy', 'missionize']);
    expect(leverNamesOf(SCORING_OBJECTIVES.military)).toEqual(['opportunity', 'prestige']);
  });
});

describe('M9a scoring — reduces to Wave A default byte-identically', () => {
  const args = { sId: 's', ctx: ctxWithTarget, aggressiveness: 1.1, strengthFor, exhaustion: 0.2 };
  it('the DEFAULT objective (explicit) === no-objective (Wave A path), byte-for-byte', () => {
    const waveA = enumerateMoves({ ...args });                                   // default param
    const explicit = enumerateMoves({ ...args, objective: DEFAULT_SCORING_OBJECTIVE });
    const unmapped = enumerateMoves({ ...args, objective: objectiveForArchetype('government') });
    expect(JSON.stringify(explicit)).toBe(JSON.stringify(waveA));
    expect(JSON.stringify(unmapped)).toBe(JSON.stringify(waveA));
  });
  it('the DEFAULT move set is EXACTLY the four war moves — no lever leaks in', () => {
    const rows = enumerateMoves({ ...args });
    expect(rows.map((r) => r.move).sort()).toEqual(['defend', 'deploy', 'hold', 'sue_for_peace']);
  });
});

describe('M9a scoring — per-archetype sets change the ranking + enumerate the levers', () => {
  const args = { sId: 's', ctx: ctxWithTarget, aggressiveness: 1.15, strengthFor, exhaustion: 0.25 };

  it('a WARLORD out-ranks deploy above a MERCHANT on the same field (the political shift)', () => {
    const merchant = movesMap(enumerateMoves({ ...args, objective: objectiveForArchetype('merchant') }));
    const warlord = movesMap(enumerateMoves({ ...args, objective: objectiveForArchetype('military') }));
    // Same inputs, opposite dispositions: the warlord scores deploy strictly higher.
    expect(warlord.deploy).toBeGreaterThan(merchant.deploy);
    // And the merchant reaches for a non-war lever over a march: its top score is a
    // lever or a de-escalation, never deploy.
    const merchantTop = Object.entries(merchant).sort((a, b) => b[1] - a[1])[0][0];
    expect(merchantTop).not.toBe('deploy');
  });

  it('the MERCHANT levers enumerate (reroute/embargo/credit) with finite 0..1 scores', () => {
    const rows = enumerateMoves({ ...args, objective: objectiveForArchetype('merchant') });
    const names = rows.map((r) => r.move);
    for (const lever of ['reroute', 'embargo', 'credit']) expect(names).toContain(lever);
    for (const r of rows) expect(r.score).toBeGreaterThanOrEqual(0), expect(r.score).toBeLessThanOrEqual(1);
  });

  it('the CHURCH levers enumerate (missionize/legitimacy); the WARLORD levers enumerate (prestige/opportunity)', () => {
    const church = enumerateMoves({ ...args, objective: objectiveForArchetype('religious') }).map((r) => r.move);
    const warlord = enumerateMoves({ ...args, objective: objectiveForArchetype('military') }).map((r) => r.move);
    expect(church).toEqual(expect.arrayContaining(['missionize', 'legitimacy']));
    expect(warlord).toEqual(expect.arrayContaining(['prestige', 'opportunity']));
  });

  it('the returned rows stay codepoint-sorted with the levers folded in (order-free)', () => {
    const rows = enumerateMoves({ ...args, objective: objectiveForArchetype('merchant') });
    const keys = rows.map((r) => r.move);
    expect(keys).toEqual([...keys].sort());
  });

  it('a warlord OPPORTUNITY rises with a bigger strength margin (an opportunistic lever)', () => {
    const near = enumerateMoves({ sId: 's', ctx: ctxWithTarget, aggressiveness: 1.1, strengthFor: (id) => (id === 's' ? 0.55 : 0.5), exhaustion: 0.2, objective: objectiveForArchetype('military') });
    const wide = enumerateMoves({ sId: 's', ctx: ctxWithTarget, aggressiveness: 1.1, strengthFor: (id) => (id === 's' ? 0.9 : 0.2), exhaustion: 0.2, objective: objectiveForArchetype('military') });
    expect(movesMap(wide).opportunity).toBeGreaterThan(movesMap(near).opportunity);
  });
});
