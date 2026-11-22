/**
 * tests/domain/magicLedger.test.js — P3.3b Stage 3.
 *
 * The conserved magic dial has ONE read-point. Pin: it reads the granular priorityMagic,
 * canonicalizes the band vocabulary (none/low/medium/high — folding legacy rare/moderate/
 * common/pervasive), and — routed into deriveMagical — fixes the vocabulary-mismatch bug where
 * a generated 'medium'-magic settlement contributed ZERO instead of its intended +10.
 */

import { describe, it, expect } from 'vitest';
import { magicLedger } from '../../src/domain/magicLedger.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

describe('magicLedger', () => {
  it('reads the granular priorityMagic dial and bands it canonically', () => {
    expect(magicLedger({ config: { priorityMagic: 80 } }).magicLevel).toBe('high');   // >65
    expect(magicLedger({ config: { priorityMagic: 45 } }).magicLevel).toBe('medium');  // 26-65
    expect(magicLedger({ config: { priorityMagic: 20 } }).magicLevel).toBe('low');     // 1-25
    expect(magicLedger({ config: { priorityMagic: 0 } }).magicLevel).toBe('none');
    expect(magicLedger({ config: { priorityMagic: 45 } }).priorityMagic).toBe(45);
  });

  it('canonicalizes legacy band vocabulary when no dial is present', () => {
    expect(magicLedger({ config: { magicLevel: 'pervasive' } }).magicLevel).toBe('high');
    expect(magicLedger({ config: { magicLevel: 'moderate' } }).magicLevel).toBe('medium');
    expect(magicLedger({ config: { magicLevel: 'common' } }).magicLevel).toBe('medium');
    expect(magicLedger({ config: { magicLevel: 'rare' } }).magicLevel).toBe('low');
  });

  it('treats a dead-magic world as priority 0 / none regardless of the slider', () => {
    const g = magicLedger({ config: { priorityMagic: 90, magicExists: false } });
    expect(g.priorityMagic).toBe(0);
    expect(g.magicLevel).toBe('none');
    expect(g.magicExists).toBe(false);
  });

  it('returns neutral (present:false) for an un-generated settlement', () => {
    expect(magicLedger({}).present).toBe(false);
    expect(magicLedger(null).present).toBe(false);
    expect(magicLedger({ config: {} }).present).toBe(false);
  });
});

// The bug this stage fixes: deriveMagical string-matched 'moderate', but the generator emits
// 'medium' (getMagicLevel of priority 26-65), so a medium-magic town contributed 0 supply.
describe('deriveMagical responds across the full magic range (P3.3b Stage 3)', () => {
  const town = (priorityMagic) => ({
    name: 'T', tier: 'town', population: 2000, config: { priorityMagic, monsterThreat: 'safe' },
    institutions: [], powerStructure: { factions: [] }, activeConditions: [],
  });

  it('a medium-magic town now reads higher magical supply than a low-magic one (was equal)', () => {
    // priority 45 -> 'medium' -> +10 (previously 0, silently missed); priority 20 -> 'low' -> -8.
    expect(deriveCapacityProfile('magical', town(45)).supply)
      .toBeGreaterThan(deriveCapacityProfile('magical', town(20)).supply);
  });

  it('high-magic beats medium beats low, monotonically', () => {
    const hi  = deriveCapacityProfile('magical', town(80)).supply;
    const mid = deriveCapacityProfile('magical', town(45)).supply;
    const lo  = deriveCapacityProfile('magical', town(20)).supply;
    expect(hi).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(lo);
  });

  it('the contributor cites the conserved priorityMagic dial', () => {
    const prof = deriveCapacityProfile('magical', town(45));
    expect(prof.supplyContributors.some(c => c.source === 'config.priorityMagic')).toBe(true);
  });

  it('causal magical_stability still lifts for high magic and limits for low (behaviour-preserved)', () => {
    expect(deriveSystemVariable('magical_stability', town(80)).score)
      .toBeGreaterThan(deriveSystemVariable('magical_stability', town(20)).score);
  });
});
