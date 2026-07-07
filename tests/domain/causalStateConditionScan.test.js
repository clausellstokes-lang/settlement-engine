/**
 * causalStateConditionScan.test.js — the applyConditions consolidation pins.
 *
 * The 15 causal derivers each hand-rolled the active-condition scan, and the
 * SAME polarity bug (a recovery lift read as a pressure) appeared independently
 * in three of them (food, trade, ruling_authority) because each copy was
 * written by hand. The scans are now one shared helper — applyConditions — and
 * this file makes the duplication class STRUCTURALLY impossible to recreate:
 *
 *   1. SOURCE PIN: causalState.js contains exactly ONE
 *      `affectedSystems.includes` occurrence (inside applyConditions). A new
 *      deriver that hand-rolls the join reds this gate.
 *   2. BEHAVIOUR: the three modes (signed / drain / gain) and the war_spoils
 *      `special` seam produce the exact shapes the hand-written scans did —
 *      signed lifts RAISE, drains subtract, gains add, zero-magnitude
 *      conditions are skipped uniformly (no phantom zero-delta contributors).
 *
 * (The lift-polarity regression pins live in causalStateWallsAndLiftPolarity;
 * this file pins the CONSOLIDATION itself.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

const SRC = readFileSync(resolve(process.cwd(), 'src/domain/causalState.js'), 'utf-8');

// Fresh object per call — causalState memoizes derivations on settlement identity.
const town = (activeConditions = []) => ({
  name: 'T', tier: 'town', population: 2000,
  config: { monsterThreat: 'safe', terrain: 'plain' },
  institutions: [],
  powerStructure: { factions: [] },
  activeConditions,
});

describe('the condition scan is ONE implementation (source pin)', () => {
  it('causalState.js contains exactly one affectedSystems.includes — inside applyConditions', () => {
    const hits = SRC.match(/affectedSystems\.includes/g) || [];
    expect(
      hits.length,
      'A deriver is hand-rolling the condition scan again. Route it through applyConditions — ' +
      'the hand-written copies are how the lift-polarity bug class was born (three times).',
    ).toBe(1);
    // And that one occurrence lives in the helper, not a deriver.
    const helperBody = SRC.slice(SRC.indexOf('function applyConditions'), SRC.indexOf('function applyConditions') + 2500);
    expect(helperBody).toMatch(/affectedSystems\.includes/);
  });

  it('every deriver-side scan is an applyConditions call (no bare cachedActiveConditions loops over affectedSystems)', () => {
    // The only for-loop over cachedActiveConditions allowed is the helper's own.
    const loops = SRC.match(/for \(const \w+ of cachedActiveConditions\(/g) || [];
    expect(loops.length, 'A new hand-written condition loop appeared — use applyConditions').toBe(1);
  });
});

describe('applyConditions behaviour (through real derivers)', () => {
  it('signed mode: a lift RAISES and a pressure LOWERS the same variable', () => {
    const base = deriveSystemVariable('food_security', town());
    const lift = deriveSystemVariable('food_security',
      town([{ archetype: 'siege_lifted', severity: 0.3, affectedSystems: ['food_security'] }]));
    const pressure = deriveSystemVariable('food_security',
      town([{ archetype: 'famine', severity: 0.3, affectedSystems: ['food_security'] }]));
    expect(lift.score).toBeGreaterThan(base.score);
    expect(pressure.score).toBeLessThan(base.score);
  });

  it('drain mode always subtracts; gain mode always adds (even for the same condition)', () => {
    const cond = [{ archetype: 'plague', severity: 0.4, affectedSystems: ['healing_capacity', 'criminal_opportunity'] }];
    const baseHeal = deriveSystemVariable('healing_capacity', town());
    const baseCrime = deriveSystemVariable('criminal_opportunity', town());
    expect(deriveSystemVariable('healing_capacity', town(cond)).score).toBeLessThan(baseHeal.score);
    expect(deriveSystemVariable('criminal_opportunity', town(cond)).score).toBeGreaterThan(baseCrime.score);
  });

  it('zero-magnitude conditions are skipped uniformly — no phantom zero-delta contributors', () => {
    // severity 0.01 rounds to 0 at every scale in use (12–20). The normalizer
    // regenerates condition ids from the archetype, so match by that.
    const v = deriveSystemVariable('trade_connectivity',
      town([{ archetype: 'famine', severity: 0.01, affectedSystems: ['trade_connectivity'] }]));
    expect(v.contributors.some(c => String(c.source).includes('famine'))).toBe(false);
  });

  it('the war_spoils special seam still ADDS to economic_capacity while ordinary conditions drain it', () => {
    const base = deriveSystemVariable('economic_capacity', town());
    const spoils = deriveSystemVariable('economic_capacity',
      town([{ archetype: 'war_spoils', severity: 0.5, affectedSystems: [] }]));
    const drain = deriveSystemVariable('economic_capacity',
      town([{ archetype: 'war_drain', severity: 0.5, affectedSystems: ['economic_capacity'] }]));
    expect(spoils.score).toBeGreaterThan(base.score);
    expect(spoils.contributors.find(c => String(c.source).includes('war_spoils'))?.effect).toBe('spoils');
    expect(drain.score).toBeLessThan(base.score);
    expect(drain.contributors.find(c => String(c.source).includes('war_drain'))?.effect).toBe('drain');
  });
});
