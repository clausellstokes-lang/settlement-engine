/**
 * npcLadderHeirs.test.js — VISION WAVE V-7 HEIRS-LITE pins (DESIGN_VISION_WAVE §V-7).
 *
 * The governing seat gains a designated heir + inherited memory on the EXISTING succession
 * events. The pins:
 *   • DARK CONTROL (heirsEnabled absent): a coup DEFERS exactly as §7 today — rungs untouched,
 *     no inheritance, no investiture beat (heirs-dark byte-identity, the dormancy-golden twin).
 *   • LIT (heirsEnabled + a fresh coup): the DESIGNATED HEIR (strongest bond toward the seat)
 *     takes the seat; the rungs stay a PERMUTATION (conservation); the heir inherits the
 *     predecessor's bonds/grudges at a bounded ≤0.4 fraction, marked inherited; an investiture
 *     beat fires (impactKind npc_ladder — no new succession trigger, no death).
 *   • The pure helpers: designateHeir (strongest bond, codepoint tie-break), swapIntoSeat (a
 *     permutation), inheritSeatMemory (bounded + marked + skip-existing/self).
 */
import { describe, it, expect } from 'vitest';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import {
  designateHeir, swapIntoSeat, inheritSeatMemory, ladderFactionKey, LADDER_TUNING,
} from '../../src/domain/worldPulse/npcLadderState.js';

const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
function npc(id, name, importance, dots, rank) {
  return { id, name, role: name, importance, dots, structuralRank: rank, factionAffiliation: "Merchants' Guild", personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } };
}
const roster = () => [
  npc('n_a', 'Aldric', 'pillar', 3, 'dominant'),
  npc('n_b', 'Bevin', 'key', 2, 'subordinate'),
  npc('n_c', 'Cael', 'notable', 1, 'minor'),
];
function coupTown(extra = {}) {
  return {
    name: 'Ashford', tier: 'city',
    powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
    npcs: roster(), institutions: [],
    activeConditions: [{ archetype: 'government_overthrown', triggeredAt: { tick: 260 } }],
    ...extra,
  };
}
const fkey = ladderFactionKey(guild);

// A prior ladder ledger where n_b is the most-bonded lieutenant to the seat (n_a), and the seat
// carries a grudge + a bond toward n_c — the memory the heir should inherit, dampened. Weeks are
// pinned to 260 so nothing decays over the zero-elapsed advance.
function priorLedgerWithBonds() {
  const st = (stock, grudges = {}, bonds) => ({
    stock, since: 200, week: 260, goal: null, stigma: null, grudges, ...(bonds ? { bonds } : {}),
  });
  return {
    a: {
      factions: { [fkey]: { rungs: ['a:n_a', 'a:n_b', 'a:n_c'] } },
      npcs: {
        'a:n_a': st(6, { 'a:n_c': { sev: 0.5, week: 260 } }, { 'a:n_c': { sev: 0.6, week: 260, kind: 'loyalty' } }),
        'a:n_b': st(4, {}, { 'a:n_a': { sev: 0.8, week: 260, kind: 'loyalty' } }),
        'a:n_c': st(3, {}, { 'a:n_a': { sev: 0.3, week: 260, kind: 'loyalty' } }),
      },
    },
  };
}

function advance(settlement, rules) {
  const worldState = {
    simulationRules: rules,
    calendar: { elapsedWeeks: 260 },
    spatialLedgers: { npcLadder: priorLedgerWithBonds() },
  };
  const item = { id: 'a', name: 'Ashford', settlement };
  const snapshot = { settlements: [item] };
  const r = advanceNpcLadder({ snapshot, worldState, settlementUpdates: [{ saveId: 'a', settlement }], tick: 260, now: null });
  return { rec: r.worldState?.spatialLedgers?.npcLadder?.a || null, news: r.newsEntries };
}

describe('V-7 HEIRS-LITE — dark control (heirsEnabled absent ⇒ the §7 coup defers, byte-identical)', () => {
  it('a coup leaves the rungs untouched, mints no inheritance, emits no investiture beat', () => {
    const { rec, news } = advance(coupTown(), { npcLadderEnabled: true });
    expect(rec.factions[fkey].rungs).toEqual(['a:n_a', 'a:n_b', 'a:n_c']); // §7 defer — the seat holds
    // n_b has no grudges at all when dark (the empty grudges map drops on serialize).
    expect(rec.npcs['a:n_b'].grudges?.['a:n_c'], 'no inherited grudge when dark').toBeUndefined();
    expect(rec.npcs['a:n_b'].bonds?.['a:n_c'], 'no inherited bond when dark').toBeUndefined();
    expect(news.some((n) => n.tags?.includes('investiture')), 'no investiture beat when dark').toBe(false);
  });
});

describe('V-7 HEIRS-LITE — lit (a fresh coup seats the heir + carries the dampened memory)', () => {
  it('the DESIGNATED HEIR (strongest bond toward the seat) takes the seat; the rungs stay a permutation', () => {
    const { rec } = advance(coupTown(), { npcLadderEnabled: true, heirsEnabled: true });
    const rungs = rec.factions[fkey].rungs;
    expect(rungs[0], 'the most-bonded lieutenant (n_b, sev 0.8) takes the seat').toBe('a:n_b');
    // CONSERVATION: the SET is invariant (a permutation) — no rung created or destroyed.
    expect([...rungs].sort()).toEqual(['a:n_a', 'a:n_b', 'a:n_c']);
    expect(rungs.length).toBe(3);
  });

  it('the heir inherits the predecessor bonds/grudges at a bounded ≤0.4 fraction, marked inherited', () => {
    const { rec } = advance(coupTown(), { npcLadderEnabled: true, heirsEnabled: true });
    const heir = rec.npcs['a:n_b'];
    // Inherited grudge toward n_c: 0.5 × 0.4 = 0.2, marked, ≤ the fraction.
    expect(heir.grudges['a:n_c'].inherited).toBe(true);
    expect(heir.grudges['a:n_c'].sev).toBeCloseTo(0.2, 6);
    expect(heir.grudges['a:n_c'].sev).toBeLessThanOrEqual(LADDER_TUNING.HEIR_INHERIT_FRACTION);
    // Inherited bond toward n_c: 0.6 × 0.4 = 0.24, marked. The heir's OWN bond (to n_a) is untouched.
    expect(heir.bonds['a:n_c'].inherited).toBe(true);
    expect(heir.bonds['a:n_c'].sev).toBeCloseTo(0.24, 6);
    expect(heir.bonds['a:n_a'].sev).toBeCloseTo(0.8, 6);
    expect(heir.bonds['a:n_a'].inherited, 'the heir\'s own bond is not marked inherited').toBeUndefined();
  });

  it('an investiture beat fires (impactKind npc_ladder — a reused, registered kind)', () => {
    const { news } = advance(coupTown(), { npcLadderEnabled: true, heirsEnabled: true });
    const beat = news.find((n) => n.tags?.includes('investiture'));
    expect(beat, 'the investiture beat is present').toBeTruthy();
    expect(beat.impactKind).toBe('npc_ladder');
    expect(beat.tags).toContain('coup');
  });
});

describe('V-7 HEIRS-LITE — the pure helpers', () => {
  it('designateHeir picks the strongest bond toward the seat, codepoint tie-break', () => {
    const bonded = (sev) => ({ bonds: { s: { sev } } });
    expect(designateHeir(['s', 'b', 'c'], { b: bonded(0.8), c: bonded(0.9) })).toBe('c');
    // Tie ⇒ codepoint-lowest wins.
    expect(designateHeir(['s', 'b', 'c'], { b: bonded(0.5), c: bonded(0.5) })).toBe('b');
    // No one below the seat ⇒ null.
    expect(designateHeir(['s'], {})).toBe(null);
    expect(designateHeir([], {})).toBe(null);
  });

  it('swapIntoSeat is a permutation (a no-op when the heir is absent or already the seat)', () => {
    expect(swapIntoSeat(['a', 'b', 'c'], 'b')).toEqual(['b', 'a', 'c']);
    expect(swapIntoSeat(['a', 'b', 'c'], 'a')).toEqual(['a', 'b', 'c']); // already the seat
    expect(swapIntoSeat(['a', 'b', 'c'], 'z')).toEqual(['a', 'b', 'c']); // absent
    // The set is invariant.
    expect([...swapIntoSeat(['a', 'b', 'c'], 'c')].sort()).toEqual(['a', 'b', 'c']);
  });

  it('inheritSeatMemory bounds ≤0.4, marks inherited, skips existing ties and self', () => {
    const heir = { grudges: {}, bonds: { x: { sev: 0.9, week: 260, kind: 'loyalty' } } };
    const pred = {
      grudges: { y: { sev: 1.0, week: 260 }, heir: { sev: 1.0, week: 260 } },
      bonds: { x: { sev: 1.0, week: 260, kind: 'friendship' }, z: { sev: 0.5, week: 260, kind: 'loyalty' } },
    };
    const out = inheritSeatMemory(heir, pred, 'heir', 260);
    // Grudge y inherited (1.0×0.4=0.4, ≤ fraction, marked); the self-grudge toward 'heir' is skipped.
    expect(out.grudges.y.sev).toBeCloseTo(0.4, 6);
    expect(out.grudges.y.inherited).toBe(true);
    expect(out.grudges.heir, 'never inherit a tie toward the heir themselves').toBeUndefined();
    // Bond x is skipped (heir already bonded); bond z inherited (0.2, marked).
    expect(out.bonds.x.sev).toBeCloseTo(0.9, 6); // the heir's own bond, untouched
    expect(out.bonds.x.inherited).toBeUndefined();
    expect(out.bonds.z.sev).toBeCloseTo(0.2, 6);
    expect(out.bonds.z.inherited).toBe(true);
    // Every inherited mark is bounded by the fraction.
    for (const g of Object.values(out.grudges)) if (g.inherited) expect(g.sev).toBeLessThanOrEqual(LADDER_TUNING.HEIR_INHERIT_FRACTION);
    for (const b of Object.values(out.bonds)) if (b.inherited) expect(b.sev).toBeLessThanOrEqual(LADDER_TUNING.HEIR_INHERIT_FRACTION);
  });

  it('inheritSeatMemory with no predecessor returns the heir standing unchanged', () => {
    const heir = { grudges: {}, bonds: { x: { sev: 0.5, week: 260, kind: 'loyalty' } } };
    expect(inheritSeatMemory(heir, null, 'heir', 260)).toBe(heir);
  });

  it('a negligible predecessor mark (below the prune epsilon after dampening) is not inherited', () => {
    const heir = { grudges: {}, bonds: {} };
    const pred = { grudges: { y: { sev: 0.1, week: 260 } }, bonds: {} }; // 0.1×0.4 = 0.04 < 0.05
    const out = inheritSeatMemory(heir, pred, 'heir', 260);
    expect(out.grudges.y, 'a mark that dampens below the prune epsilon is dropped').toBeUndefined();
  });
});
