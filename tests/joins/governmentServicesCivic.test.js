/**
 * governmentServicesCivic.test.js — [data-tables-1].
 *
 * The token-overlap fallback matcher resolved the most common small-settlement
 * governments to absurd service menus: Household elder → Druidic consultation,
 * Village elder → Music lessons, City administration → Grain storage. These are
 * the highest-baseChance anchor institutions at their tiers, so nearly every
 * thorp/village/city dossier advertised register-breaking services. Dedicated
 * civic-register INSTITUTION_SERVICES entries now resolve them exactly.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { getServicesForInstitution } from '../../src/generators/services/institutionServices.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

const GOV = [
  ['Household elder', 'thorp'],
  ['Village headman', 'hamlet'],
  ['Village elder', 'village'],
  ['Town council', 'town'],
  ['City administration', 'city'],
];

// The wrong-register services the fuzzy matcher used to surface.
const ABSURD = ['Druidic consultation', 'Nature arbitration', 'Music and entertainment', 'Grain storage'];

function serviceNames(inst, tier, seed) {
  setActiveRng(createPRNG(seed));
  try {
    const svcs = getServicesForInstitution(inst, tier);
    return (Array.isArray(svcs) ? svcs : Object.keys(svcs || {})).map((s) => s.name || s);
  } finally {
    clearActiveRng();
  }
}

describe('[data-tables-1] government anchors resolve to civic-register services', () => {
  test('each government anchor has a dedicated INSTITUTION_SERVICES entry', () => {
    for (const [inst] of GOV) {
      expect(INSTITUTION_SERVICES[inst], `${inst} should have a dedicated services entry`).toBeTruthy();
    }
  });

  test('no government anchor surfaces the old absurd fuzzy-matched services (any seed)', () => {
    for (const [inst, tier] of GOV) {
      for (const seed of ['g0', 'g1', 'g2', 'g3', 'g4']) {
        const names = serviceNames(inst, tier, seed);
        for (const bad of ABSURD) {
          expect(names, `${inst} @ ${seed}`).not.toContain(bad);
        }
      }
    }
  });

  test('each government anchor surfaces at least one civic service its dedicated entry defines', () => {
    for (const [inst, tier] of GOV) {
      const civicKeys = Object.keys(INSTITUTION_SERVICES[inst]);
      // p:1.0 services always fire, so the dedicated entry always yields ≥1 civic service.
      const names = serviceNames(inst, tier, 'civic-seed');
      expect(names.some((n) => civicKeys.includes(n)), `${inst} civic services`).toBe(true);
    }
  });
});
