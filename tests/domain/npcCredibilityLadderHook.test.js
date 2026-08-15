/**
 * npcCredibilityLadderHook.test.js — DEEP COUPLINGS D-2c pins (design §6 — the ladder hook).
 *
 * The deposit-and-consume: statecraft deposits a lieExposure marker in spatialLedgers
 * .npcCredibility; the ladder's own writer (maintainMarks) consumes it ONE tick later, mints
 * the SAME stigma shape (sev band-scaled), pays the SAME STIGMA_CHALLENGE_TAX (the stigma
 * feeds it), opens the exposed_liar window, and stamps lastLieSeen (consume-once). A
 * REPUTATION cost, never a fate: the NPC keeps his rung, marked.
 */
import { describe, it, expect } from 'vitest';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { LADDER_TUNING } from '../../src/domain/worldPulse/npcLadderState.js';
import { openWindows } from '../../src/domain/worldPulse/npcLadderChallenge.js';

const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
const npc = (id, name, importance) => ({ id, name, role: name, importance, factionAffiliation: "Merchants' Guild", personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } });
const court = (npcs) => ({ name: 'Ashford', tier: 'city', population: 9000, powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } }, npcs, institutions: [], activeConditions: [] });

/** Drive one lit ladder advance with an injected npcCredibility ledger + optional prior ladder. */
function advance({ npcCredibility = null, priorLadder = null, ladderLit = true, weeks = 260, tick = 260 } = {}) {
  const npcs = [npc('n_master', 'Guildmaster Aldric', 'pillar'), npc('n_factor', 'Factor Maera', 'key')];
  const settlement = court(npcs);
  /** @type {Record<string, unknown>} */
  const spatialLedgers = {};
  if (npcCredibility) spatialLedgers.npcCredibility = npcCredibility;
  if (priorLadder) spatialLedgers.npcLadder = priorLadder;
  const worldState = {
    simulationRules: { ...(ladderLit ? { npcLadderEnabled: true } : {}), npcCredibilityEnabled: true },
    calendar: { elapsedWeeks: weeks },
    ...(Object.keys(spatialLedgers).length ? { spatialLedgers } : {}),
  };
  const item = { id: 'a', name: 'Ashford', settlement };
  const snapshot = { settlements: [item], byId: new Map([['a', item]]) };
  const r = advanceNpcLadder({ snapshot, worldState, settlementUpdates: [{ saveId: 'a', settlement }], tick, now: null });
  return { result: r, rec: r.worldState?.spatialLedgers?.npcLadder?.a || null, worldState: r.worldState };
}

// A lie fronted by the guildmaster, exposed at tick 100 (magnitude band 4 — a whopper).
const depositFor = (nid, tick, band) => ({ [nid]: { score: -6.5, lastUpdateTick: tick, lieExposure: { tick, band } } });

describe('D-2c — the lie-stigma is minted through the ladder\'s own writer', () => {
  it('a fresh lie-exposure deposit stigmatizes the mouthpiece (sev band-scaled) and latches lastLieSeen', () => {
    const { rec } = advance({ npcCredibility: depositFor('a:n_master', 100, 4) });
    const st = rec.npcs['a:n_master'];
    expect(st.stigma, 'the caught liar wears the stigma').toBeTruthy();
    // band 4 ⇒ full mark (LIE_STIGMA_SEV_FLOOR + (1-floor)*1 == 1.0).
    expect(st.stigma.sev).toBe(1.0);
    expect(st.lastLieSeen).toBe(100); // consume-once latch
  });
  it('the sev is band-scaled (a smaller lie stings less, but still stings — the floor)', () => {
    const { rec } = advance({ npcCredibility: depositFor('a:n_master', 100, 2) });
    const expected = LADDER_TUNING.LIE_STIGMA_SEV_FLOOR + (1 - LADDER_TUNING.LIE_STIGMA_SEV_FLOOR) * (2 / 4);
    expect(rec.npcs['a:n_master'].stigma.sev).toBeCloseTo(expected, 4);
  });
  it('ONE-TICK LAG: a deposit stamped THIS tick does NOT fire (the scandal takes a week)', () => {
    const { rec } = advance({ npcCredibility: depositFor('a:n_master', 260, 4), tick: 260, weeks: 260 });
    expect(rec.npcs['a:n_master'].stigma).toBeFalsy();
    expect(rec.npcs['a:n_master'].lastLieSeen).toBeUndefined();
  });
  it('CONSUME-ONCE: an already-stigmatized deposit does not re-fire on a later advance', () => {
    const first = advance({ npcCredibility: depositFor('a:n_master', 100, 4) });
    // Re-drive with the SAME deposit + the prior ladder (lastLieSeen already 100).
    const second = advance({ npcCredibility: depositFor('a:n_master', 100, 4), priorLadder: first.worldState.spatialLedgers.npcLadder, weeks: 264, tick: 264 });
    // The stigma decays but is NOT re-minted at full — lastLieSeen stays 100, sev < 1.0.
    expect(second.rec.npcs['a:n_master'].lastLieSeen).toBe(100);
    expect(second.rec.npcs['a:n_master'].stigma.sev).toBeLessThan(1.0);
  });
});

describe('D-2c — gating + the exposed_liar window', () => {
  it('LADDER-DARK: npcLadderEnabled absent ⇒ the ladder no-ops even with a live deposit (byte-identical)', () => {
    const { rec, result } = advance({ npcCredibility: depositFor('a:n_master', 100, 4), ladderLit: false });
    expect(rec).toBeNull();
    expect(result.changed).toBe(false);
  });
  it('CREDIBILITY-DARK: no npcCredibility ledger ⇒ no stigma (the hook is inert)', () => {
    const { rec } = advance({}); // no deposit
    expect(rec.npcs['a:n_master']?.stigma).toBeFalsy();
    expect(rec.npcs['a:n_master']?.lastLieSeen).toBeUndefined();
  });
  it('openWindows: a fresh lie-exposure opens exposed_liar (sibling of revealed_corruption)', () => {
    const d = { nid: 'a:x', standing: 8, stigma: false, rungIndex: 0, rungCount: 3 };
    const ctx = { factionFalling: false };
    expect(openWindows(d, ctx, false, false, false)).toEqual([]);
    expect(openWindows(d, ctx, false, false, true)).toContain('exposed_liar');
    // NEVER removes the soul: the window is an invitation to challengers, not a fate.
    expect(openWindows(d, ctx, false, false, true)).not.toContain('revealed_corruption');
  });
});
