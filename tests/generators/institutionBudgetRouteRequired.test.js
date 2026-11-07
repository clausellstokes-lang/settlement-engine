/**
 * X-46 car 3 — THE ROUTE-REQUIRED EXEMPTION (the chair's ruling, 2026-11-04, on the rung-1 pins'
 * unit 2): if the density factor can starve a port-route city of its docks or its harbour master,
 * that is a defect of the budget. A row the catalogue marks `tradeRouteRequired` or
 * `terrainRequired` is the place's definition where its route or terrain admits it, and is exempt
 * from the factor like the required and fabric rows (`institutionBudget.js :: isDensityExempt`).
 *
 * Red-first (at e87de86, before the exemption): the port-route city below rolled no Harbour
 * master's office (the 0.4 row starved under the factor), and its d ≡ 1 roll seats both rows. The
 * sixty control cells admit no marked row (mountain terrain on a road, crossroads, isolated or
 * mountain route), so they are byte-identical with the exemption in force and withdrawn.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { isDensityExempt } from '../../src/data/institutionBudget.js';
import { institutionalCatalog, isFabricRow, isRareRow } from '../../src/data/institutionalCatalog.js';
import { configForIndex } from '../../scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** The pipeline with the route-required exemption withdrawn (fabric and rare rows stay exempt). */
async function pipelineWithoutExemption() {
  vi.resetModules();
  vi.doMock('../../src/data/institutionBudget.js', async (importOriginal) => {
    const actual = /** @type {Record<string, unknown>} */ (await importOriginal());
    const catalog = await import('../../src/data/institutionalCatalog.js');
    return { ...actual, isDensityExempt: (tier, name) => catalog.isFabricRow(tier, name) || catalog.isRareRow(tier, name) };
  });
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const pipeline = await import('../../src/generators/generateSettlementPipeline.js');
  const store = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  vi.doUnmock('../../src/data/institutionBudget.js');
  return (config, seed) => pipeline.generateSettlementPipeline(boundary.birthConfig({ ...store.DEFAULT_CONFIG, ...config }), null, { seed });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
const ROUTES = ['road', 'crossroads', 'isolated', 'mountain_pass', 'mountain_road'];

/** The non-fabric rows the catalogue marks route- or terrain-required, by tier (read 2026-11-04). */
const ROUTE_REQUIRED = Object.freeze([
  'thorp|Fishing community', 'thorp|Shepherd collective', "thorp|Woodcutter's camp",
  "hamlet|Fisher's landing", "hamlet|Woodcutter's camp", 'hamlet|Caravanserai',
  "village|Fisher's landing", "village|Woodcutter's camp", 'village|Salt works', 'village|Caravanserai', 'village|River ferry', 'village|River boatyard',
  ...['town', 'city', 'metropolis'].flatMap((t) => ['Salt works', 'Caravanserai', 'River ferry', 'River boatyard', 'Docks/port facilities', "Harbour master's office"].map((n) => `${t}|${n}`)),
]);


describe('X-46 car 3 — the route-required rows are exempt from the density factor', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('exempts exactly the fabric and the rows the catalogue marks tradeRouteRequired / terrainRequired', () => {
    const exempt = [];
    for (const [tier, block] of Object.entries(institutionalCatalog)) {
      for (const group of Object.values(block)) {
        for (const [name, row] of Object.entries(group)) {
          if (isFabricRow(tier, name)) { expect(isDensityExempt(tier, name), `${tier}|${name} (fabric)`).toBe(true); continue; }
          // the authored rarity is its own exemption (institutionBudgetRarity.test.js), added 2026-11-04
          if (row.required || isRareRow(tier, name)) continue;
          if (isDensityExempt(tier, name)) exempt.push(`${tier}|${name}`);
        }
      }
    }
    expect(exempt.sort()).toEqual([...ROUTE_REQUIRED].sort());
    // a row that names only terrainAccess is scaled (the Barge company is a river house, not the river's definition)
    expect(isDensityExempt('city', 'Barge and river transport company')).toBe(false);
    expect(isDensityExempt('nowhere', 'Docks/port facilities')).toBe(false);
  });

  it('a port-route city keeps its docks and its harbour master under the factor (the subsumption seed)', () => {
    const port = generateSettlementPipeline({ settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' }, null, { seed: 'joins-subsumption-0', customContent: {} });
    const names = port.institutions.map((i) => i.name);
    expect(port.population).toBeGreaterThan(2000);
    expect(names).toContain("Harbour master's office");
    expect(names).toContain('Docks/port facilities');
  });

  // Re-keyed 2026-11-04 (rung-1 pins, unit 3): the first form froze sixty digests read at e87de86;
  // the 60,000 anchor's move (120 → 93) moved the metropolis cells by design. The control now
  // generates each cell twice in one run — the exemption in force and withdrawn — so it proves the
  // byte-identity itself and does not go stale with the budget's other dials.
  it('sixty cells that admit no marked row are byte-identical across the exemption (and a port cell is not)', async () => {
    const withExemption = (config, seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...config }), null, { seed });
    const withoutExemption = await pipelineWithoutExemption();
    const moved = [];
    for (let i = 0; i < 60; i += 1) {
      const config = { ...configForIndex(i), terrainOverride: 'mountain', tradeRouteAccess: ROUTES[i % 5] };
      const seed = `x46-route-control-${i}`;
      if (hashOf(withExemption(config, seed)) !== hashOf(withoutExemption(config, seed))) moved.push(i);
    }
    expect(moved).toEqual([]);
    // anchored: the two arms do part where a marked row is in reach (the port city above)
    const port = { settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' };
    const names = (s) => s.institutions.map((x) => x.name);
    // Re-keyed 2026-11-04 (window branch, composing RUNG1B-F6; the DOORS rule): F6's net target set X = 0 on the
    // without-exemption arm, so d rose 0.3349 -> 0.3645 and the Harbour master's office draws on joins-subsumption-0
    // even without the exemption. Re-seeded on the premise (a port city whose harbour master drops without the
    // exemption under the new d): joins-subsumption-9, the only seed of joins-subsumption-0..39 that carries it.
    expect(names(withExemption(port, 'joins-subsumption-9'))).toContain("Harbour master's office");
    expect(names(withoutExemption(port, 'joins-subsumption-9'))).not.toContain("Harbour master's office"); // anchored: the line above finds the office through the same names() on the same seed with the exemption
  }, 240_000);
});
