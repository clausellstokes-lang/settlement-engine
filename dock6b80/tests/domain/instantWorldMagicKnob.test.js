/**
 * tests/domain/instantWorldMagicKnob.test.js — MG-1 pins for THE FOURTH KNOB
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4).
 *
 * The knob joins the seed's input surface, so its normalization has to be total
 * (garbage in → the shipped default, never undefined) and its arrival must not
 * perturb a single seeded roll of the three knobs that came before it — the plan
 * is the composer's determinism substrate (MG-LAW-5).
 */
import { describe, test, expect } from 'vitest';
import {
  MAGIC_CHOICES,
  DEFAULT_MAGIC,
  isMagicChoice,
  normalizeBasicConfig,
  deriveWorldPlan,
} from '../../src/domain/instantWorld/worldPlan.js';

describe('MG-1 — the magic knob normalizes totally', () => {
  test('the vocabulary is the binary the design ruled, with magic as the default', () => {
    expect(MAGIC_CHOICES.map(m => m.id)).toEqual(['yes', 'no']);
    expect(DEFAULT_MAGIC).toBe('yes');
    // Every choice carries the copy the modal renders — an id with no label
    // would render a bare token as the DM's question (legibility law).
    for (const choice of MAGIC_CHOICES) {
      expect(choice.label.length).toBeGreaterThan(0);
      expect(choice.blurb.length).toBeGreaterThan(0);
    }
  });

  test('the predicate discriminates rather than accepting everything', () => {
    expect(isMagicChoice('yes')).toBe(true);
    expect(isMagicChoice('no')).toBe(true);
    expect(isMagicChoice('maybe')).toBe(false);
    expect(isMagicChoice('')).toBe(false);
    expect(isMagicChoice(true)).toBe(false);
    expect(isMagicChoice(null)).toBe(false);
    expect(isMagicChoice(undefined)).toBe(false);
  });

  test.each([
    ['omitted', {}],
    ['unknown', { magic: 'sometimes' }],
    ['a boolean', { magic: false }],
    ['null', { magic: null }],
  ])('a %s magic knob resolves to the shipped default', (_label, input) => {
    expect(normalizeBasicConfig(input).magic).toBe('yes');
  });

  test('an explicit mundane answer survives normalization', () => {
    expect(normalizeBasicConfig({ magic: 'no' }).magic).toBe('no');
  });
});

describe('MG-1 — the knob draws no randomness (MG-LAW-5)', () => {
  test('the plan echoes the stance beside the tone preset', () => {
    expect(deriveWorldPlan({ seed: 's', basicConfig: { magic: 'no' } }).magic).toBe('no');
    expect(deriveWorldPlan({ seed: 's' }).magic).toBe('yes');
  });

  test('flipping the knob leaves every seeded draw of the plan identical', () => {
    const magical = deriveWorldPlan({ seed: 'knob-purity', basicConfig: { realmSize: 'medium' } });
    const mundane = deriveWorldPlan({ seed: 'knob-purity', basicConfig: { realmSize: 'medium', magic: 'no' } });
    // Everything the RNG produced — the resolved map template and the whole
    // placement scatter — must be byte-identical across the flip. A knob that
    // consumed a draw would shift the sites and silently fork the realm.
    expect(mundane.mapKind).toBe(magical.mapKind);
    expect(JSON.stringify(mundane.sites)).toBe(JSON.stringify(magical.sites));
    expect(mundane.mapSeed).toBe(magical.mapSeed);
    // Positive control: the flip IS observable, so the equality above is not
    // measuring two identical plans.
    expect(mundane.magic).not.toBe(magical.magic);
  });
});
