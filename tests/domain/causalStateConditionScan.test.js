/**
 * causalStateConditionScan.test.js — the applyConditions consolidation pins.
 *
 * The 15 condition-reading causal derivers (of the 16 total — infrastructure_
 * condition reads no conditions) each hand-rolled the active-condition scan, and
 * the SAME polarity bug (a recovery lift read as a pressure) appeared
 * independently in three of them (food, trade, ruling_authority) because each
 * copy was written by hand. The scans are now one shared helper — applyConditions
 * — and this file makes the duplication class STRUCTURALLY impossible to recreate:
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
import { deriveSystemVariable, SYSTEM_VARIABLES } from '../../src/domain/causalState.js';

const SRC = readFileSync(resolve(process.cwd(), 'src/domain/causalState.js'), 'utf-8');
const SYSTEMS = new Set(SYSTEM_VARIABLES);

// Fresh object per call — causalState memoizes derivations on settlement identity.
const town = (activeConditions = []) => ({
  name: 'T', tier: 'town', population: 2000,
  config: { monsterThreat: 'safe', terrain: 'plain' },
  institutions: [],
  powerStructure: { factions: [] },
  activeConditions,
});

// Landed W2b causalState wave — needs causalState applyConditions condition-scan re-port
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

// Landed W2b causalState wave — needs causalState applyConditions condition-scan re-port
describe('applyConditions system literals are joined-safe (source pin)', () => {
  // Each deriver passes its system name to applyConditions as a bare STRING
  // literal — applyConditions matches it against cond.affectedSystems.includes
  // exactly, so the literal must (a) be a real SYSTEM_VARIABLE and (b) match the
  // DERIVERS key the deriver is registered under. A copy-paste that leaves a
  // stale literal (e.g. a new deriver cloned from food_security but still passing
  // 'food_security') silently scores THAT variable's conditions against the wrong
  // system — the deriver would read another system's pressures.

  // Map DERIVERS key → the deriver function name it points at.
  const deriversBlock = SRC.slice(SRC.indexOf('const DERIVERS = Object.freeze({'));
  const deriversBody = deriversBlock.slice(0, deriversBlock.indexOf('});') + 1);
  const KEY_TO_FN = {};
  for (const m of deriversBody.matchAll(/(\w+)\s*:\s*(derive\w+)\s*,/g)) {
    KEY_TO_FN[m[2]] = m[1]; // fnName -> DERIVERS key
  }

  // Slice the source into per-function bodies at each top-level deriver.
  const fnStarts = [...SRC.matchAll(/^function (derive\w+)\s*\(/gm)].map((m) => ({
    fn: m[1],
    start: m.index,
  }));

  it('DERIVERS keys and deriver functions were both parsed', () => {
    expect(Object.keys(KEY_TO_FN).length).toBe(16);
    expect(fnStarts.length).toBe(16);
  });

  it('every applyConditions(..., <literal>) is a SYSTEM_VARIABLE equal to its deriver’s DERIVERS key', () => {
    const violations = [];
    let literalsSeen = 0;
    for (let i = 0; i < fnStarts.length; i++) {
      const { fn, start } = fnStarts[i];
      const end = i + 1 < fnStarts.length ? fnStarts[i + 1].start : SRC.indexOf('const DERIVERS = Object.freeze({');
      const body = SRC.slice(start, end);
      const call = body.match(/applyConditions\(\s*s\s*,\s*contributors\s*,\s*['"]([^'"]+)['"]/);
      if (!call) continue; // infrastructure_condition reads no conditions — no call, by design
      literalsSeen++;
      const literal = call[1];
      const registeredKey = KEY_TO_FN[fn];
      if (!SYSTEMS.has(literal)) {
        violations.push(`${fn}: applyConditions '${literal}' is not a SYSTEM_VARIABLE`);
      } else if (literal !== registeredKey) {
        violations.push(`${fn}: applyConditions '${literal}' ≠ its DERIVERS key '${registeredKey}' (stale copy-paste)`);
      }
    }
    // 15 of the 16 derivers scan conditions (infrastructure_condition does not).
    expect(literalsSeen, 'The applyConditions literal count moved — a deriver was added/removed').toBe(15);
    expect(violations, 'A deriver scans another system’s conditions').toEqual([]);
  });
});

describe('applyConditions behaviour (through real derivers)', () => {
  // Landed W2b causalState wave — needs causalState lift-polarity re-port (signed applyConditions mode)
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

  // Landed W2b causalState wave — needs causalState applyConditions zero-magnitude skip
  it('zero-magnitude conditions are skipped uniformly — no phantom zero-delta contributors', () => {
    // severity 0.01 rounds to 0 at every scale in use (12–20). The normalizer
    // regenerates condition ids from the archetype, so match by that.
    const v = deriveSystemVariable('trade_connectivity',
      town([{ archetype: 'famine', severity: 0.01, affectedSystems: ['trade_connectivity'] }]));
    expect(v.contributors.some(c => String(c.source).includes('famine'))).toBe(false);
  });

  // Landed W2b causalState wave — needs causalState economic_capacity system variable
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
