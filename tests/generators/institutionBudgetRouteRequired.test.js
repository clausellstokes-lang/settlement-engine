/**
 * X-46 car 3 — THE ROUTE-REQUIRED EXEMPTION (the chair's ruling, 2026-11-04, on the rung-1 pins'
 * unit 2): if the density factor can starve a port-route city of its docks or its harbour master,
 * that is a defect of the budget. A row the catalogue marks `tradeRouteRequired` or
 * `terrainRequired` is the place's definition where its route or terrain admits it, and is exempt
 * from the factor like the required and fabric rows (`institutionBudget.js :: isDensityExempt`).
 *
 * Red-first (at e87de86, before the exemption): the port-route city below rolled no Harbour
 * master's office (its 5,000-odd people put d well under 1 and the 0.4 row starved), and its d ≡ 1
 * roll seats both rows. The sixty control cells admit no marked row (mountain terrain on a road,
 * crossroads, isolated or mountain route), so they are byte-identical across the exemption: their
 * digests were read at e87de86 by this file's own loop.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import { isDensityExempt } from '../../src/data/institutionBudget.js';
import { institutionalCatalog, isFabricRow } from '../../src/data/institutionalCatalog.js';
import { configForIndex } from '../../scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
const ROUTES = ['road', 'crossroads', 'isolated', 'mountain_pass', 'mountain_road'];

/** The non-fabric rows the catalogue marks route- or terrain-required, by tier (read 2026-11-04). */
const ROUTE_REQUIRED = Object.freeze([
  'thorp|Fishing community', 'thorp|Shepherd collective', "thorp|Woodcutter's camp",
  "hamlet|Fisher's landing", "hamlet|Woodcutter's camp", 'hamlet|Caravanserai',
  "village|Fisher's landing", "village|Woodcutter's camp", 'village|Salt works', 'village|Caravanserai', 'village|River ferry', 'village|River boatyard',
  ...['town', 'city', 'metropolis'].flatMap((t) => ['Salt works', 'Caravanserai', 'River ferry', 'River boatyard', 'Docks/port facilities', "Harbour master's office"].map((n) => `${t}|${n}`)),
]);

const CONTROL_BEFORE = Object.freeze([
  '40e81269aa5f7fda', // 0
  'c62475a754354711', // 1
  '0e1d397722b421b3', // 2
  '16ae5a608b21dbc9', // 3
  'b060a0e0ac618b63', // 4
  'd9163f5035cf8f1f', // 5
  '3f635468c7d6ac59', // 6
  '8e5f03c79016fb15', // 7
  'a031a4f7187595d1', // 8
  '014d239dc65206dc', // 9
  '01b9ebc12faabd51', // 10
  '45163ac6e98d2fd4', // 11
  '02a8d6b7c52efb58', // 12
  'b45c18aa57409715', // 13
  '537806b4e58c9cca', // 14
  '20bd2db2622bfe83', // 15
  '42efb3bc2e2771f4', // 16
  'd9054e9d8bebceaa', // 17
  '1ce1c9c498989129', // 18
  '0b052e5a6b6f918d', // 19
  '88d379c2bc024456', // 20
  'df1083ea5a53800c', // 21
  '8ed5e983a8c56fc9', // 22
  '5c2841b9055830cb', // 23
  '474b864a48304676', // 24
  '558bd46bb7d85fb2', // 25
  '87f4ed1ca6ed6dd3', // 26
  '4803fcd9042e712a', // 27
  '35b25570ef236e7a', // 28
  'fa63cc5841be464e', // 29
  'bf5a2c97acffd00b', // 30
  '63fd521f39217799', // 31
  '700fc4883255511b', // 32
  '8ce754884e76b7b6', // 33
  '6d7ec77872c8cd29', // 34
  '69edf42613b0cc28', // 35
  '4dc2e460135861f7', // 36
  '0407f9d71cf219a0', // 37
  '24cead73928d2fd8', // 38
  '507386bdc9b8e43a', // 39
  '4d69be648feeee47', // 40
  '84242bc884bef978', // 41
  '42e12ed580541e6c', // 42
  '8dd7f9f333fdf523', // 43
  '53939e8751e14303', // 44
  '90f6f0bbe961f7b9', // 45
  '53b0b43d44826715', // 46
  '90159565f4adb01d', // 47
  '35ad70e754f1c615', // 48
  'c63118a972af0c98', // 49
  'a89b9772ec0f104c', // 50
  '3b115c93cd6203bc', // 51
  '7e07409f4cd1c7a5', // 52
  '94b0f6f0a4e8b89f', // 53
  '559fe101c33bfb22', // 54
  'b5dff84e263f4ed3', // 55
  '8fd0c8e9bd1619db', // 56
  'f817fa49e0b0a591', // 57
  '819d8041a96a42a4', // 58
  '22cbd04d3cd3fcb2', // 59
]);

describe('X-46 car 3 — the route-required rows are exempt from the density factor', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('exempts exactly the fabric and the rows the catalogue marks tradeRouteRequired / terrainRequired', () => {
    const exempt = [];
    for (const [tier, block] of Object.entries(institutionalCatalog)) {
      for (const group of Object.values(block)) {
        for (const [name, row] of Object.entries(group)) {
          if (isFabricRow(tier, name)) { expect(isDensityExempt(tier, name), `${tier}|${name} (fabric)`).toBe(true); continue; }
          if (row.required) continue;
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

  it('sixty cells that admit no marked row are byte-identical across the exemption', () => {
    const moved = [];
    for (let i = 0; i < 60; i += 1) {
      const config = { ...configForIndex(i), terrainOverride: 'mountain', tradeRouteAccess: ROUTES[i % 5] };
      const h = hashOf(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...config }), null, { seed: `x46-route-control-${i}` }));
      if (h !== CONTROL_BEFORE[i]) moved.push(i);
    }
    expect(CONTROL_BEFORE).toHaveLength(60);
    expect(moved).toEqual([]);
  }, 240_000);
});
