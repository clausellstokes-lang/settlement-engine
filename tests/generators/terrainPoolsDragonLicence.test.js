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
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const dragons = (magicExists, priorityMagic = 50) => {
  let n = 0;
  for (let i = 0; i < 60; i += 1) {
    const config = birthConfig({ ...DEFAULT_CONFIG, settType: 'metropolis', magicExists, priorityMagic });
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
  // Chair ruling, round 3, 2: the licence joined the exotic scaler (×1.8 at magic ≥ 66), so the
  // row's draw is 0.1 / 1.8 ≈ 0.06; at magic 80, 60 seeds gave 16 dragons at 0.1 and give 11 now.
  it('the row draws at 0.06, and a high-magic metropolis keeps the dragon occasional', () => {
    const row = Object.values(institutionalCatalog.metropolis || {})
      .map((group) => group?.['Dragon resident']).find(Boolean);
    expect(row?.baseChance).toBe(0.06);
    expect(dragons(true, 80)).toBeLessThanOrEqual(12);
  }, 300000);
});
