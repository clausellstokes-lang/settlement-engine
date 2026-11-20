/**
 * tests/domain/facts/magic.test.js — CENSUS-1 wave 0, fact 7: THE MAGIC HOME.
 *
 * RED-FIRST. The soak's feature table printed a missing `magicExists` as 'off' while every engine
 * reader (`magicLedger`, `magicWorksAt`, the 58 raw `!== false` reads) treats it as ON. Red at the
 * window tip through `chainFacts` alone.
 *
 * @enforced-by npx vitest run tests/domain/facts/magic.test.js
 */
import { describe, expect, it } from 'vitest';
import { chainFacts } from '../../../scripts/audit/soak-review/features.mjs';

describe('the magic home (CENSUS-1 fact 7)', () => {
  it('RED-FIRST: the feature table reads a missing magicExists as on', () => {
    const facts = chainFacts({ tier: 'town', config: { priorityMagic: 40 } }, { findings: [] });
    expect(facts['chain.magicScenario']).toBe('on/40');
    expect(chainFacts({ tier: 'town', config: { magicExists: false, priorityMagic: 40 } }, { findings: [] })['chain.magicScenario']).toBe('off/40');
  });

  it('the one reader: functions by magicWorksAt, the level folded by the ledger', async () => {
    const { magicOf } = await import('../../../src/domain/facts/magic.js');
    expect(magicOf({ config: {} }).functions).toBe(true);
    expect(magicOf({ config: { magicExists: false, priorityMagic: 80 } })).toMatchObject({ functions: false, level: 'none', priority: 0 });
    expect(magicOf({ settlement: { config: { magicExists: false, priorityMagic: 10 } } }).functions).toBe(false);
    // the engine's rule: off only where a magic axis backs it (`magicWorksAt`)
    expect(magicOf({ config: { magicExists: false } }).functions).toBe(true);
  });
});
