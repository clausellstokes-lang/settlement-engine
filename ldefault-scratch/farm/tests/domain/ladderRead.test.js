/**
 * ladderRead.test.js — THE LADDER READ API contract (townMap/ladderRead.js).
 *
 * The pure, zero-engine-import reader every ladder consumer uses. The load-bearing
 * contract is EMPTY-WHEN-DARK: an absent/dark mirror yields empty values everywhere,
 * and the §8 modifier reads return NULL (null ≠ 1.0 — absence is not neutrality), so a
 * dark world stays byte-identical at every consumption site.
 */
import { describe, it, expect } from 'vitest';
import {
  ladderFactionsOf, ladderRungsOf, ladderPowerModifierOf, ladderLegitimacyModifierOf,
  ladderInstabilityOf, ladderGoalOf, hasLadder, ladderEffectivePowerFactor,
} from '../../src/domain/townMap/ladderRead.js';
import { ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';

describe('ladderRead — empty-when-dark contract', () => {
  const darkCases = [undefined, null, {}, { npcLadder: null }, { npcLadder: undefined }, { npcLadder: 'nonsense' }, { npcLadder: [] }];

  it('every reader returns its empty value on an absent/dark mirror', () => {
    for (const s of darkCases) {
      expect(ladderFactionsOf(s)).toEqual({});
      expect(ladderRungsOf(s, 'fac.guild')).toEqual([]);
      expect(ladderInstabilityOf(s, 'fac.guild')).toBe(0);
      expect(ladderGoalOf(s, 'a:n_master')).toBeNull();
      expect(hasLadder(s)).toBe(false);
    }
  });

  it('the §8 modifier reads return NULL (not 1.0) when absent — absence is not neutrality', () => {
    for (const s of darkCases) {
      expect(ladderPowerModifierOf(s, 'fac.guild')).toBeNull();
      expect(ladderLegitimacyModifierOf(s, 'fac.guild')).toBeNull();
    }
  });

  it('reads a populated mirror correctly (rungs, modifiers, instability, goals)', () => {
    const settlement = {
      npcLadder: {
        factions: {
          'fac.guild': {
            rungs: [
              { npcId: 'a:n_master', name: 'Guildmaster Aldric', standing: 0.8 },
              { npcId: 'a:n_second', name: 'Factor Maera', standing: 0.5 },
            ],
            powerModifier: 1.12,
            legitimacyModifier: 0.9,
            instability: 0.25,
          },
        },
        goals: { 'a:n_master': { rung: 0, goal: 'hold the tithe share', stakes: 1.4 } },
      },
    };
    expect(Object.keys(ladderFactionsOf(settlement))).toEqual(['fac.guild']);
    const rungs = ladderRungsOf(settlement, 'fac.guild');
    expect(rungs.length).toBe(2);
    expect(rungs[0]).toEqual({ npcId: 'a:n_master', name: 'Guildmaster Aldric', standing: 0.8 });
    expect(ladderPowerModifierOf(settlement, 'fac.guild')).toBe(1.12);
    expect(ladderLegitimacyModifierOf(settlement, 'fac.guild')).toBe(0.9);
    expect(ladderInstabilityOf(settlement, 'fac.guild')).toBe(0.25);
    expect(ladderGoalOf(settlement, 'a:n_master')).toEqual({ rung: 0, goal: 'hold the tithe share', stakes: 1.4 });
    expect(hasLadder(settlement)).toBe(true);
    // Unknown faction / npc ⇒ empty, modifiers null.
    expect(ladderRungsOf(settlement, 'fac.unknown')).toEqual([]);
    expect(ladderPowerModifierOf(settlement, 'fac.unknown')).toBeNull();
    expect(ladderGoalOf(settlement, 'a:nobody')).toBeNull();
  });

  it('§8 read-side: ladderEffectivePowerFactor is EXACTLY 1.0 when dark (byte-identical), lit when populated', () => {
    const faction = { name: "Merchants' Guild" };
    // DARK: no mirror ⇒ factor exactly 1.0 (the consumer gates on === 1 for byte-identity).
    for (const s of [undefined, null, {}, { npcLadder: null }]) {
      expect(ladderEffectivePowerFactor(s, faction)).toBe(1);
    }
    // LIT: the write side keys the mirror by ladderFactionKey — the read must find it (the
    // key cross-check). A well-led faction reads ABOVE 1; churn erodes it below.
    const fkey = ladderFactionKey(faction);
    const wellLed = { npcLadder: { factions: { [fkey]: { rungs: [{ npcId: 'a:x', name: 'X', standing: 0.9 }], powerModifier: 1.1 } } } };
    expect(ladderEffectivePowerFactor(wellLed, faction)).toBeCloseTo(1.1, 6);
    const churning = { npcLadder: { factions: { [fkey]: { rungs: [{ npcId: 'a:x', name: 'X', standing: 0.5 }], powerModifier: 1.1, instability: 0.5 } } } };
    expect(ladderEffectivePowerFactor(churning, faction), 'churn erodes effective power').toBeLessThan(1.1);
    // A faction id (when present) keys directly.
    const byId = { npcLadder: { factions: { 'fac.custom': { rungs: [{ npcId: 'a:x', name: 'X', standing: 0.9 }], powerModifier: 1.05 } } } };
    expect(ladderEffectivePowerFactor(byId, { id: 'fac.custom', name: 'Ignored' })).toBeCloseTo(1.05, 6);
  });

  it('clamps standing to 0..1 and tolerates malformed rung entries', () => {
    const settlement = {
      npcLadder: {
        factions: { 'fac.x': { rungs: [
          { npcId: 'a:one', name: 'One', standing: 1.7 },
          { npcId: '', name: 'nameless', standing: 0.4 },
          { name: 'no id', standing: 0.4 },
          { npcId: 'a:two', standing: -3 },
        ] } },
      },
    };
    const rungs = ladderRungsOf(settlement, 'fac.x');
    expect(rungs).toEqual([
      { npcId: 'a:one', name: 'One', standing: 1 },
      { npcId: 'a:two', name: 'a:two', standing: 0 },
    ]);
  });
});
