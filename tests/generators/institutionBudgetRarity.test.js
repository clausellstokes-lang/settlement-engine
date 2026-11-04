/**
 * X-46 car 3 — THE RARITY EXEMPTION (the chair's addendum to the rung-1 pins, 2026-11-04): a row
 * whose chance the catalogue authored as a RARITY is exempt from the density factor exactly as the
 * required, fabric and route-required rows are (`institutionBudget.js :: isDensityExempt`). The mark
 * is the registry key `rare: true` (`institutionalCatalog.js :: isRareRow`), like the guards and the
 * fabric: it never rides onto a row or a save. Tagged: the metropolis 'Dragon resident' (0.06, "a
 * resident dragon stays occasional", chair ruling round 3 item 2).
 *
 * Red-first (at 03c6395, before the mark): under the factor, high-magic metropolises at d up to 4
 * drew the 0.06 dragon in 19 of 60 (terrainPoolsDragonLicence) — the authored rarity scaled away.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { isDensityExempt } from '../../src/data/institutionBudget.js';
import { institutionalCatalog, isRareRow, rareRows } from '../../src/data/institutionalCatalog.js';
import { configForIndex } from '../../scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
const born = (config, seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...config }), null, { seed });

/** The pipeline with the rarity mark withdrawn from the exemption (fabric and route-required only). */
async function pipelineWithoutRarity() {
  vi.resetModules();
  vi.doMock('../../src/data/institutionBudget.js', async (importOriginal) => {
    const actual = /** @type {Record<string, any>} */ (await importOriginal());
    const catalog = await import('../../src/data/institutionalCatalog.js');
    return { ...actual, isDensityExempt: (tier, name) => actual.isDensityExempt(tier, name) && !catalog.isRareRow(tier, name) };
  });
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const pipeline = await import('../../src/generators/generateSettlementPipeline.js');
  const store = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  vi.doUnmock('../../src/data/institutionBudget.js');
  return (config, seed) => pipeline.generateSettlementPipeline(boundary.birthConfig({ ...store.DEFAULT_CONFIG, ...config }), null, { seed });
}

describe('X-46 car 3 — rows with an authored rarity are exempt from the density factor', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('marks exactly the metropolis Dragon resident, registry-only, and exempts it', () => {
    expect(rareRows().map(({ tier, name }) => `${tier}|${name}`)).toEqual(['metropolis|Dragon resident']);
    expect(isRareRow('metropolis', 'Dragon resident')).toBe(true);
    expect(isRareRow('metropolis', 'Auction house')).toBe(false);
    expect(isDensityExempt('metropolis', 'Dragon resident')).toBe(true);
    for (const block of Object.values(institutionalCatalog)) {
      for (const group of Object.values(block)) for (const row of Object.values(group)) expect(Object.hasOwn(row, 'rare')).toBe(false);
    }
  });

  it('80 high-magic metropolises keep the dragon occasional: at most 16 draw it', () => {
    let n = 0;
    for (let i = 0; i < 80; i += 1) {
      const s = born({ settType: 'metropolis', magicExists: true, priorityMagic: 80 }, `x46-rare-dragon-${i}`);
      if (s.institutions.some((x) => x.name === 'Dragon resident')) n += 1;
    }
    expect(n).toBeGreaterThan(0); // anchored: the dragon still rolls where magic works
    expect(n).toBeLessThanOrEqual(16);
  }, 300_000);

  it('sixty low-magic seeds are byte-identical with the mark in force and withdrawn (and a high-magic one is not)', async () => {
    const without = await pipelineWithoutRarity();
    const moved = [];
    for (let i = 0; i < 60; i += 1) {
      const config = { ...configForIndex(i), magicExists: false };
      const seed = `x46-rare-control-${i}`;
      if (hashOf(born(config, seed)) !== hashOf(without(config, seed))) moved.push(i);
    }
    expect(moved).toEqual([]);
    // anchored: the two arms part on a high-magic metropolis whose dragon the mark kept away
    let parted = 0;
    for (let i = 0; i < 80 && parted === 0; i += 1) {
      const config = { settType: 'metropolis', magicExists: true, priorityMagic: 80 };
      const has = (s) => s.institutions.some((x) => x.name === 'Dragon resident');
      if (has(without(config, `x46-rare-dragon-${i}`)) !== has(born(config, `x46-rare-dragon-${i}`))) parted += 1;
    }
    expect(parted).toBe(1);
  }, 300_000);
});
