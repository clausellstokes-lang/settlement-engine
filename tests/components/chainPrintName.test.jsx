/** @vitest-environment jsdom */
/**
 * F1 (COHERENCE-AGREE-6, REVIEW-AGREE-2; the chair's ruling of 2026-11-12: the rename at print time). The crossroads
 * toll runs on every hub access, and its name says the access: a river town's card reads "River Toll — River
 * traffic", a port's "Harbour Dues — Harbour traffic", a crossroads town's "Strategic Crossroads Toll — Strategic
 * Crossroads". The RECORD keeps the catalogue's strings; the page asks `domain/display/chainPrintName.js`, which reads
 * the resource's own row (`RESOURCE_DATA[resourceKey].requires`) and the chain's catalogue entry (`namesByAccess`).
 * Each seed below printed "Strategic Crossroads Toll" off a crossroads at 8866a0ddd.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TOLL = { label: 'Strategic Crossroads Toll', resource: 'Strategic Crossroads', resourceKey: 'crossroads_position', needKey: 'trade_entrepot', chainId: 'crossroads_trade' };
/** seed → [access, the label printed, the source printed] */
const SEEDS = {
  'r2read-village-1': ['river', 'River Toll', 'River traffic'],
  'r2r-city-14': ['river', 'River Toll', 'River traffic'],
  'r2read-metropolis-2': ['port', 'Harbour Dues', 'Harbour traffic'],
  'r2r-village-2': ['port', 'Harbour Dues', 'Harbour traffic'],
  'r2r-town-14': ['crossroads', 'Strategic Crossroads Toll', 'Strategic Crossroads'],
};

describe('F1: the leaf prints the toll under the town\'s access', () => {
  test('river and port print their own names; a crossroads prints the catalogue\'s; a chain with no access law is untouched', () => {
    expect(chainPrintName(TOLL, 'river')).toEqual({ label: 'River Toll', resource: 'River traffic' });
    expect(chainPrintName(TOLL, { config: { tradeRouteAccess: 'port' } })).toEqual({ label: 'Harbour Dues', resource: 'Harbour traffic' });
    expect(chainPrintName(TOLL, 'crossroads')).toEqual({ label: TOLL.label, resource: TOLL.resource });
    // an access the chain's entry does not name keeps the record's strings (the toll never runs on a road)
    expect(chainPrintName(TOLL, 'road')).toEqual({ label: TOLL.label, resource: TOLL.resource });
    const grain = { label: 'Grain & Bread', resource: 'Grain Fields', resourceKey: 'grain_fields', needKey: 'food_security', chainId: 'grain' };
    expect(chainPrintName(grain, 'river')).toEqual({ label: grain.label, resource: grain.resource });
  });
  test('the names are the chain\'s own datum: the catalogue entry carries the one table the leaf reads', async () => {
    const { SUPPLY_CHAIN_NEEDS } = await import('../../src/data/supplyChainData.js');
    const { CHAIN_NAMES_BY_ACCESS } = await import('../../src/data/chainAccessNames.js');
    const entry = SUPPLY_CHAIN_NEEDS.trade_entrepot.chains.find((c) => c.id === 'crossroads_trade');
    expect(entry.namesByAccess).toBe(CHAIN_NAMES_BY_ACCESS.crossroads_trade);
    // every access the table names is one the resource's own row refuses (the table never renames a crossroads)
    const { RESOURCE_DATA } = await import('../../src/data/resourceData.js');
    expect(Object.keys(entry.namesByAccess).filter((a) => RESOURCE_DATA.crossroads_position.requires.includes(a))).toEqual([]);
  });
});

describe('F1: the fixed seeds of each access print the toll\'s true name, and the record keeps the catalogue\'s', () => {
  const births = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const seed of Object.keys(SEEDS)) {
      births[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });
    }
  }, 120000);
  afterEach(cleanup);
  for (const [seed, [access, label, resource]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): the card reads "${label}" from ${resource}`, () => {
      const s = births[seed];
      expect(s.config.tradeRouteAccess).toBe(access);
      const toll = s.economicState.activeChains.find((c) => c.chainId === 'crossroads_trade');
      expect(toll, 'anchored: the seed runs the toll').toBeTruthy();
      expect({ label: toll.label, resource: toll.resource }, 'the record keeps the catalogue\'s strings').toEqual({ label: TOLL.label, resource: TOLL.resource });
      expect(chainPrintName(toll, s)).toEqual({ label, resource });
      const { container } = render(<EconomicsTab economicState={s.economicState} settlement={s} />);
      const toggle = [...container.querySelectorAll('[aria-expanded]')].find((b) => /Economic Flows/.test(b.textContent || ''));
      if (toggle && toggle.getAttribute('aria-expanded') === 'false') fireEvent.click(toggle);
      const text = container.textContent || '';
      expect(text).toContain(label);
      expect(text).toContain(resource);
      // anchored: the same text was just held to carry the printed label and source, so it is the live card
      if (access !== 'crossroads') expect(text, 'the page names no crossroads off a crossroads').not.toMatch(/Strategic Crossroads/);
      const access_ = s.generationCoherenceReceipt.checks.find((c) => c.id === 'resource_truth').findings
        .filter((f) => /prints a resource whose row refuses/.test(f.detail));
      expect(access_).toEqual([]);
    });
  }
});
