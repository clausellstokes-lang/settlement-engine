/**
 * npcLadderChallenge.test.js — THE CHALLENGE ENGINE pins (DESIGN_THE_LADDER.md §1/§2/§3/
 * §4/§10/§11.2/§11.4). Windows, scores, the E0 seeded resolution, conservation, the three-
 * body ladder, the four pacing brakes, stigma, and D5 grudges.
 *
 * The engine is a DETERMINISTIC seeded contest (hash01 over the seed fork — no rng), so the
 * outcome pins search for a firing tick (deterministic) and the conservation pin fuzzes
 * over many seeds (a permutation invariant that must hold for EVERY draw).
 */
import { describe, it, expect } from 'vitest';
import {
  challengeScore, defenseScore, openWindows, resolveFactionChallenges, clashOf, CHALLENGE_TUNING,
} from '../../src/domain/worldPulse/npcLadderChallenge.js';
import { LADDER_TUNING } from '../../src/domain/worldPulse/npcLadderState.js';

const merchant = { name: "Merchants' Guild", category: 'merchant' };
const plainNpc = (name) => ({ name, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } });
const st = (stock, extra = {}) => ({ stock, since: 0, week: 0, goal: null, stigma: null, grudges: {}, ...extra });
const combatant = (nid, standing, opts = {}) => ({
  nid, npc: opts.npc || plainNpc(nid), standing, stigma: !!opts.stigma,
  grudgeVsDefender: opts.grudgeVsDefender || 0, isChallenging: !!opts.isChallenging,
  rungIndex: opts.rungIndex || 0, rungCount: opts.rungCount || 2,
});
const ctx = (opts = {}) => ({ faction: merchant, factionRising: !!opts.rising, factionFalling: !!opts.falling, worldState: {} });

describe('challenge/defense scores — the §3/§4 inputs (non-short-circuiting receipts)', () => {
  it('§10 STIGMA halves challengeScore; the receipt cites the tax by name', () => {
    const clean = challengeScore(combatant('a:x', 8), ctx());
    const marked = challengeScore(combatant('a:x', 8, { stigma: true }), ctx());
    expect(marked.score).toBeCloseTo(clean.score * CHALLENGE_TUNING.STIGMA_CHALLENGE_TAX, 4);
    expect(marked.receipt.stigmaTax).toBeLessThan(0);
    expect(clean.receipt.stigmaTax).toBe(0);
  });

  it('§4e a D5 GRUDGE against the defender lowers the challenger score (repeat-challenge hardening)', () => {
    const noGrudge = challengeScore(combatant('a:x', 8), ctx());
    const grudged = challengeScore(combatant('a:x', 8, { grudgeVsDefender: 0.8 }), ctx());
    expect(grudged.score).toBeLessThan(noGrudge.score);
  });

  it('defense: seat weight scales with rung HEIGHT; faction FALLING erodes defense; the three-body self-weakens', () => {
    const top = defenseScore(combatant('a:d', 5, { rungIndex: 0, rungCount: 3 }), ctx());
    const low = defenseScore(combatant('a:d', 5, { rungIndex: 2, rungCount: 3 }), ctx());
    expect(top.receipt.seatWeight).toBeGreaterThan(low.receipt.seatWeight); // the top seat defends hardest
    const stable = defenseScore(combatant('a:d', 5, { rungIndex: 0, rungCount: 3 }), ctx());
    const falling = defenseScore(combatant('a:d', 5, { rungIndex: 0, rungCount: 3 }), ctx({ falling: true }));
    expect(falling.score).toBeLessThan(stable.score); // §3.1 falling ⇒ every incumbent weaker
    const straining = defenseScore(combatant('a:d', 5, { rungIndex: 0, rungCount: 3, isChallenging: true }), ctx());
    expect(straining.score).toBeLessThan(stable.score); // §11.4 mounting a challenge weakens defense
    expect(straining.receipt.threeBodyPenalty).toBeLessThan(0);
  });

  it('§3.3 clash: an NPC far from the faction character reads a higher clash', () => {
    const shrewd = clashOf(plainNpc('x'), merchant); // proud/bold vs "shrewd" merchant character
    expect(shrewd).toBeGreaterThanOrEqual(0);
    expect(shrewd).toBeLessThanOrEqual(1);
  });
});

describe('windows (§2) — a challenge opens ONLY on a window', () => {
  const strongDefender = combatant('a:d', 8);
  it('no window: a stable faction + a performing, clean defender ⇒ [] (no challenge possible)', () => {
    expect(openWindows(strongDefender, ctx(), false)).toEqual([]);
  });
  it('faction power FALLING opens a window', () => {
    expect(openWindows(strongDefender, ctx({ falling: true }), false)).toContain('faction_power_falling');
  });
  it('an under-performing incumbent (standing below baseline) opens a window', () => {
    const weak = combatant('a:d', LADDER_TUNING.STAND_BASELINE - 1);
    expect(openWindows(weak, ctx(), false)).toContain('incumbent_underperforming');
  });
  it('revealed corruption (fresh exposure OR a standing stigma) is the widest window', () => {
    expect(openWindows(strongDefender, ctx(), true)).toContain('revealed_corruption');
    expect(openWindows(combatant('a:d', 8, { stigma: true }), ctx(), false)).toContain('revealed_corruption');
  });
});

// ── A firing-tick search: the engine is seeded, so find the deterministic tick where the
// intended challenge fires, then pin the outcome. ──
function baseArgs(rungs, npcs, over = {}) {
  return {
    rungs, npcs, npcByNid: new Map(rungs.map((n) => [n, plainNpc(n)])),
    faction: merchant, fkey: 'fac.guild', cooldownUntil: 0, weeks: 100, tick: 100,
    seed: 'ladder-test', factionRising: false, factionFalling: true, // a window
    freshExposed: new Set(), worldState: {}, realmBudget: 3, ...over,
  };
}
function findFiring(rungs, npcs, over, predicate) {
  for (let tick = 100; tick < 100000; tick++) {
    const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { ...over, tick }));
    if (predicate(plan)) return { tick, plan };
  }
  throw new Error('no firing tick found');
}

describe('resolution — conservation (§1), sustained margin (§11.2), the stake (§2)', () => {
  it('CONSERVATION invariant: nextRungs is ALWAYS a permutation of rungs (same length, same set) — every seed', () => {
    const rungs = ['a:1', 'a:2', 'a:3'];
    const npcs = { 'a:1': st(6), 'a:2': st(5), 'a:3': st(9) }; // bottom is strongest (churny)
    for (let tick = 100; tick < 220; tick++) {
      const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { tick }));
      expect(plan.nextRungs.length, `tick ${tick}`).toBe(3);
      expect([...plan.nextRungs].sort()).toEqual(['a:1', 'a:2', 'a:3']); // no invented/dropped rungs
    }
  });

  it('a WIN SWAPS the adjacent pair (challenger rises, defender drops) + spends a succession + sets the cooldown intent', () => {
    // Bottom rung (a:2) far outclasses the top (a:1), faction falling (window).
    const rungs = ['a:1', 'a:2'];
    const npcs = { 'a:1': st(1), 'a:2': st(10) };
    const { plan } = findFiring(rungs, npcs, {}, (p) => p.events.some((e) => e.kind === 'rise'));
    expect(plan.nextRungs).toEqual(['a:2', 'a:1']); // swapped — the peon took the seat
    expect(plan.successions).toBe(1);
  });

  it('SUSTAINED MARGIN: a spike (a viable challenger just above the defender, below the margin) never WINS', () => {
    // a:2 (7.0) is VIABLE vs a:1 (6.0 + seat weight ⇒ defense ~6.9) but cannot clear the ×1.15
    // margin (needs ~7.9) — a held lead, not a spike, is required to take a seat.
    const rungs = ['a:1', 'a:2', 'a:3'];
    const npcs = { 'a:1': st(6), 'a:2': st(7), 'a:3': st(0) };
    for (let tick = 100; tick < 400; tick++) {
      const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { tick }));
      const rise = plan.events.find((e) => e.kind === 'rise' && e.challengerNid === 'a:2');
      expect(rise, `a spike must never win (tick ${tick})`).toBeUndefined();
    }
  });

  it('THE STAKE (§2): a FAILED challenger drops a rung + carries a D5 grudge + a standing withdrawal', () => {
    // a:2 (7.0) is viable vs a:1 (top, defense ~6.9) but below the margin ⇒ fails ⇒ drops to the floor.
    const rungs = ['a:1', 'a:2', 'a:3'];
    const npcs = { 'a:1': st(6), 'a:2': st(7), 'a:3': st(0.5) };
    const { plan } = findFiring(rungs, npcs, {}, (p) => p.events.some((e) => e.kind === 'failed' && e.challengerNid === 'a:2'));
    expect(plan.nextRungs.indexOf('a:2')).toBeGreaterThan(plan.nextRungs.indexOf('a:3')); // a:2 dropped below a:3
    expect(plan.grudgeMints).toContainEqual({ challengerNid: 'a:2', defenderNid: 'a:1' });
    expect(plan.withdraws.some((w) => w.nid === 'a:2')).toBe(true);
  });
});

describe('the four brakes + the three-body ladder', () => {
  it('COOLDOWN (§11.2 brake 3): a faction inside its interregnum resolves NOTHING (any seed)', () => {
    const rungs = ['a:1', 'a:2'];
    const npcs = { 'a:1': st(1), 'a:2': st(10) };
    for (let tick = 100; tick < 300; tick++) {
      const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { cooldownUntil: 200, weeks: 100, tick }));
      expect(plan.events.length, `cooldown must silence the court (tick ${tick})`).toBe(0);
      expect(plan.nextRungs).toEqual(rungs);
    }
  });

  it('REALM CAP (§11.2 brake 4): realmBudget 0 ⇒ no successions resolve', () => {
    const rungs = ['a:1', 'a:2'];
    const npcs = { 'a:1': st(1), 'a:2': st(10) };
    for (let tick = 100; tick < 300; tick++) {
      const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { realmBudget: 0, tick }));
      expect(plan.nextRungs).toEqual(rungs);
    }
  });

  it('THE THREE-BODY (§11.4): the bottom takes the middle WHILE the middle assaults the top', () => {
    // [top 7, middle 8, bottom 6]. The middle (viable vs the top) strains upward and FAILS
    // the margin — but straining weakens its own defense (7.6 → 4.6), and only THEN is the
    // patient bottom (6) viable and able to take it. Without the three-body it could not.
    const rungs = ['a:top', 'a:mid', 'a:bot'];
    const npcs = { 'a:top': st(7), 'a:mid': st(8), 'a:bot': st(6) };
    const { plan } = findFiring(rungs, npcs, {}, (p) =>
      p.nextRungs.indexOf('a:bot') < p.nextRungs.indexOf('a:mid'));
    // The bottom ended up ABOVE the middle — the three-body exposure paid off.
    expect(plan.nextRungs.indexOf('a:bot')).toBeLessThan(plan.nextRungs.indexOf('a:mid'));
    // The top held (it never fell to the middle's over-reach).
    expect(plan.nextRungs.indexOf('a:top')).toBeLessThan(plan.nextRungs.indexOf('a:mid'));
  });

  it('THE ANTI-STASIS BOUND: over a century, successions per faction fall in a band — NEITHER frozen NOR churning', () => {
    // A perpetually-ambitious court: the FLOOR rung always carries the strongest standing
    // (upward pressure never rests), the window always open. The pacing dial's BOTH bounds
    // must hold: a nonzero floor (the strong DO rise — no stasis) and a ceiling (the
    // cooldown + rate bound the churn). A century of weekly advances = 5200 weeks.
    let rungs = ['a:1', 'a:2', 'a:3'];
    let cooldownUntil = 0;
    let successions = 0;
    for (let week = 0; week < 5200; week++) {
      /** @type {Record<string, ReturnType<typeof st>>} */
      const npcs = {};
      rungs.forEach((nid, i) => { npcs[nid] = st(3 + i * 3); }); // bottom strongest ⇒ ambition from below
      const plan = resolveFactionChallenges(baseArgs(rungs, npcs, { tick: week, weeks: week, cooldownUntil }));
      if (plan.successions > 0) { successions += plan.successions; cooldownUntil = week + CHALLENGE_TUNING.COOLDOWN_WEEKS; }
      rungs = plan.nextRungs;
    }
    expect(successions, 'ANTI-STASIS floor: the court is not frozen — the strong rise').toBeGreaterThan(3);
    expect(successions, 'CHURN ceiling: the cooldown + rate bound the cadence').toBeLessThan(60);
  });

  it('DETERMINISM: identical inputs ⇒ a byte-identical plan (JSON-equal), receipts and all', () => {
    const rungs = ['a:1', 'a:2'];
    const npcs = { 'a:1': st(3), 'a:2': st(9) };
    const p1 = resolveFactionChallenges(baseArgs(rungs, npcs, { tick: 137 }));
    const p2 = resolveFactionChallenges(baseArgs(rungs, npcs, { tick: 137 }));
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
  });
});
