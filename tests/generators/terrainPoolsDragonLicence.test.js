/**
 * DRAGON RESIDENT NEEDS MAGIC (chair ruling 2, 2026-11-04): "a dragon is a creature of magic in
 * this world; magic off is the historical mode." The catalog row carries the Exotic shelf's
 * magic licence, so the world law's magic gate (licence at least 'low') keeps it off a
 * magic-off roster; with magic on it rolls at the row's own chance.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { institutionCatalogMagicLicence } from '../../src/domain/arcaneInstitutionIdentity.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const dragons = (magicExists) => {
  let n = 0;
  for (let i = 0; i < 60; i += 1) {
    const config = birthConfig({ ...DEFAULT_CONFIG, settType: 'metropolis', magicExists, priorityMagic: 50 });
    const s = generateSettlementPipeline(config, null, { seed: `dragon-licence-${i}` });
    if ((s.institutions || []).some((x) => x?.name === 'Dragon resident')) n += 1;
  }
  return n;
};

describe('Dragon resident and the magic gate', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('declares a licence the magic gate reads', () => {
    expect(institutionCatalogMagicLicence('Dragon resident')).toBe('high');
  });
  it('a magic-off metropolis over 60 seeds holds no dragon', () => {
    expect(dragons(false)).toBe(0);
  }, 300000);
  it('a magic-on metropolis still rolls dragons', () => {
    expect(dragons(true)).toBeGreaterThan(0);
  }, 300000);
});
