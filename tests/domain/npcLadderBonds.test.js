/**
 * npcLadderBonds.test.js — DEEP COUPLINGS D-7e pins (design §10.5, the positive-bond ruling).
 *
 * THE PERSON-BOND SYMMETRY: the ladder-grudge structure gains its TWIN — a bonds map
 * (loyalty/gratitude/friendship) with the SAME D5-band decay, additive stacking, a bounded
 * cap, the SAME single writer, and the SAME deliberate succession reset (a bond dies with the
 * standing record — NEVER a parallel NPC-pair graph). THE DORMANCY CONTRACT: bonds are
 * additive-optional and drop-when-empty ⇒ a dark / bond-free record carries ZERO bonds keys
 * (byte-identical). NO parallel graph; the mirror never projects bonds (grudge parity).
 */
import { describe, it, expect } from 'vitest';
import {
  LADDER_TUNING, BOND_KINDS, mintBond, normalizeBonds, bondSevToward, strongestBond,
  maintainMarks, normalizeStanding, sortedRecord, mirrorOf,
} from '../../src/domain/worldPulse/npcLadderState.js';

const T = LADDER_TUNING;

describe('D-7e mintBond — additive stacking, bounded cap, kind', () => {
  it('deposits a fresh bond of the given kind (a NEW map — never mutates)', () => {
    const before = {};
    const after = mintBond(before, 'npc:b', 'gratitude', T.BOND_MINT_SEV, 20);
    expect(after['npc:b']).toEqual({ sev: T.BOND_MINT_SEV, week: 20, kind: 'gratitude' });
    expect(before).toEqual({}); // purity
    expect([...BOND_KINDS]).toEqual(['loyalty', 'gratitude', 'friendship']);
  });
  it('STACKS additively on repeat, bounded by BOND_MAX_SEV; the latest formation sets the kind', () => {
    let bonds = mintBond(undefined, 'npc:b', 'loyalty', 0.5, 10);
    bonds = mintBond(bonds, 'npc:b', 'friendship', 0.5, 20);
    expect(bonds['npc:b'].sev).toBe(1.0); // 0.5 + 0.5
    expect(bonds['npc:b'].kind).toBe('friendship'); // latest wins
    bonds = mintBond(bonds, 'npc:b', 'gratitude', 0.9, 30);
    expect(bonds['npc:b'].sev).toBe(T.BOND_MAX_SEV); // capped, not 1.9
  });
  it('a bad kind coerces to friendship (the generic tie)', () => {
    const bonds = mintBond({}, 'npc:b', 'nonsense', 0.5, 5);
    expect(bonds['npc:b'].kind).toBe('friendship');
  });
});

describe('D-7e queries — bondSevToward / strongestBond', () => {
  const st = { stock: 5, since: 0, week: 0, goal: null, stigma: null, grudges: {}, bonds: { 'npc:a': { sev: 0.3, week: 0, kind: 'loyalty' }, 'npc:c': { sev: 0.8, week: 0, kind: 'friendship' } } };
  it('reads the bond toward a specific NPC (0 when none / no bonds)', () => {
    expect(bondSevToward(st, 'npc:c')).toBe(0.8);
    expect(bondSevToward(st, 'npc:z')).toBe(0);
    expect(bondSevToward({ grudges: {} }, 'npc:c')).toBe(0);
  });
  it('finds the strongest bond (codepoint-stable), null when none', () => {
    expect(strongestBond(st)).toEqual({ nid: 'npc:c', sev: 0.8, kind: 'friendship' });
    expect(strongestBond({ grudges: {} })).toBe(null);
  });
});

describe('D-7e maintainMarks — bonds decay like grudges, drop-when-empty', () => {
  const npc = {};
  it('decays a bond on the BOND half-life clock and prunes when spent', () => {
    const st = normalizeStanding({ stock: 5, since: 0, week: 0, grudges: {}, bonds: { 'npc:b': { sev: 1.0, week: 0, kind: 'loyalty' } } }, 0);
    // One half-life later ⇒ ~0.5 (band 1.0).
    const half = maintainMarks(st, npc, 1, T.BOND_HALF_LIFE_WEEKS, T.BOND_HALF_LIFE_WEEKS).st;
    expect(half.bonds['npc:b'].sev).toBeCloseTo(0.5, 2);
    // Many half-lives later ⇒ pruned below epsilon ⇒ the bonds field DROPS entirely.
    const gone = maintainMarks(st, npc, 1, T.BOND_HALF_LIFE_WEEKS * 20, T.BOND_HALF_LIFE_WEEKS * 20).st;
    expect(gone.bonds).toBeUndefined();
  });
  it('a record with NO bonds never gains a bonds field (dark ⇒ byte-identical)', () => {
    const st = normalizeStanding({ stock: 5, since: 0, week: 0, grudges: {} }, 0);
    expect('bonds' in st).toBe(false);
    const out = maintainMarks(st, npc, 1, 52, 52).st;
    expect('bonds' in out).toBe(false);
  });
});

describe('D-7e persistence — round-trip + the drop-when-empty dormancy contract', () => {
  it('bonds round-trip through normalize → sortedRecord (byte-stable, kind carried)', () => {
    const rec = normalizeStanding({ stock: 5, since: 0, week: 3, grudges: {}, bonds: { 'npc:b': { sev: 0.7, week: 3, kind: 'gratitude' } } }, 3);
    const persisted = sortedRecord({ factions: {}, npcs: { 'npc:a': rec } });
    expect(persisted.npcs['npc:a'].bonds['npc:b']).toEqual({ kind: 'gratitude', sev: 0.7, week: 3 });
  });
  it('an empty / bond-free record persists ZERO bonds keys (the dormancy contract)', () => {
    const rec = normalizeStanding({ stock: 5, since: 0, week: 3, grudges: {} }, 3);
    const persisted = sortedRecord({ factions: {}, npcs: { 'npc:a': rec } });
    expect('bonds' in persisted.npcs['npc:a']).toBe(false);
  });
  it('the compact mirror NEVER projects bonds (grudge parity — bonds are court-internal)', () => {
    const rec = { factions: { 'fac.x': { rungs: ['npc:a'], cooldownUntil: 0, lastPower: 0, instability: 0, week: 0 } }, npcs: { 'npc:a': normalizeStanding({ stock: 5, since: 0, week: 0, grudges: {}, bonds: { 'npc:b': { sev: 1, week: 0, kind: 'loyalty' } } }, 0) } };
    const mirror = mirrorOf(rec, new Map([['npc:a', 'Alia']]), new Map());
    expect(JSON.stringify(mirror)).not.toMatch(/bond/);
  });
});

describe('D-7e succession reset — a bond dies with the standing record', () => {
  it('normalizeBonds ignores a spent (sev 0) entry; a dropped record carries no bonds', () => {
    expect(normalizeBonds({ 'npc:b': { sev: 0, week: 1, kind: 'loyalty' } })).toEqual({});
    // A record that is pruned (drops from rec.npcs) takes its bonds with it — there is no
    // parallel NPC-pair graph to outlive it. Proven structurally: bonds live under the standing.
    const persisted = sortedRecord({ factions: {}, npcs: {} });
    expect(persisted).toBe(null); // an emptied court persists nothing — no orphan bonds
  });
});
