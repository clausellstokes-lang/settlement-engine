/**
 * stressPriority.test.js — the canonical stress-severity ordering, pinned.
 *
 * Five history/narrative sites carried byte-identical copies of this list; a
 * stress type added to one copy and missed in another would silently change
 * which crisis a settlement reads as dominant. They now all import
 * resolvePrimaryStress from stressPriority.js — this pins the canonical order
 * (verified identical to all five pre-unification copies, so the unification
 * is provably output-neutral) and asserts the inline copies stay dead.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { STRESS_PRIORITY, resolvePrimaryStress } from '../../src/generators/stressPriority.js';

describe('STRESS_PRIORITY — canonical order', () => {
  it('is the exact pre-unification list (all five copies matched this)', () => {
    expect([...STRESS_PRIORITY]).toEqual([
      'under_siege', 'occupied', 'famine', 'plague_onset', 'politically_fractured',
      'recently_betrayed', 'succession_void', 'indebted', 'infiltrated',
      'monster_pressure', 'insurgency', 'mass_migration', 'wartime',
      'religious_conversion', 'slave_revolt',
    ]);
    expect(Object.isFrozen(STRESS_PRIORITY)).toBe(true);
  });

  it('resolvePrimaryStress: priority find, first-listed fallback, null when empty', () => {
    expect(resolvePrimaryStress(['wartime', 'famine'])).toBe('famine');
    expect(resolvePrimaryStress(['custom_haunting'])).toBe('custom_haunting');
    expect(resolvePrimaryStress([])).toBeNull();
    expect(resolvePrimaryStress(undefined)).toBeNull();
  });
});

describe('the inline copies stay dead (source scan)', () => {
  it('no generator re-grows a private under_siege→slave_revolt priority array', () => {
    for (const rel of ['narrativeGenerator.js', 'historyGenerator.js']) {
      const src = readFileSync(resolve(process.cwd(), 'src', 'generators', rel), 'utf-8');
      // The old copies were recognizable by the full literal sequence.
      const inlineCopy = /'under_siege',[\s\S]{0,400}?'slave_revolt',\s*\]\.find/;
      expect(inlineCopy.test(src), `${rel} regrew an inline stress-priority copy`).toBe(false);
    }
  });
});
