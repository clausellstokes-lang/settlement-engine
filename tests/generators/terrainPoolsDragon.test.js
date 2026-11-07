/**
 * THE DRAGON LINE WITH MAGIC OFF (soak 1000 row 19, battery class A-04): "No raiding force
 * approaches a settlement with a visible dragon." printed in magic-off metropolises from the
 * Dragon resident's "Aerial deterrence" row. The row now carries the world law's explicit
 * magic metadata, so a magic-off world's `allowsService` drops it.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { getServicesForInstitution } from '../../src/generators/services/institutionServices.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const DRAGON = { name: 'Dragon resident' };
const offered = (config) => {
  const law = createGenerationWorldLaw(config);
  const prev = setActiveRng(createPRNG('dragon-metropolis'));
  try {
    return getServicesForInstitution(DRAGON, 'metropolis', {})
      .filter((service) => law.allowsService(service, DRAGON, 'employment'))
      .map((service) => service.name);
  } finally { clearActiveRng(prev); }
};

describe('a magic-off metropolis with a dragon resident (hand-built)', () => {
  it('prints no aerial deterrence', () => {
    expect(offered({ magicExists: false, priorityMagic: 50 })).not.toContain('Aerial deterrence'); // anchored: the next test drives the same offered() with magic on and finds it (the twin)
  });
  it('keeps it where magic works', () => {
    expect(offered({ magicExists: true, priorityMagic: 50 })).toContain('Aerial deterrence');
  });
});

describe('the soak seeds that printed the dragon line with magic off', () => {
  beforeAll(async () => { await ensureLaws(); });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (a magic-off metropolis; the dragon itself no longer arises with magic off, the licence cure): was 65, 89.
  it.each([41, 47])('soak1k-%i offers no aerial deterrence', (i) => {
    const { settlement: s } = birth(i);
    expect(s.config.magicExists).toBe(false);
    const all = Object.values(s.availableServices || {}).flat().map((x) => x?.name);
    expect(all.length).toBeGreaterThan(0);
    expect(all).not.toContain('Aerial deterrence'); // anchored: the line above proves the services are live
  });
});
