/**
 * TAIL-DISPLAY-CIVIC-4 · V11 (the chair's ruling V4 of 2026-11-15 03:17 UTC, carried as V11; vetoable by the owner): A
 * RESOURCE'S NAME HAS ONE HOME. The Foundry journal's "Nearby resources" / "Depleted" rows and the PDF's nearby-resource
 * tags printed the key through a formatter ("Defended Pass", in towns that hold no defence); each now reads the catalogue's
 * label (`resourceDisplayName.js :: RESOURCE_DISPLAY_LABELS`, which the Resources tab prints): "Mountain Pass". A key the
 * table does not hold keeps the old words. Births of the census's own seeds; the cured pair red at 6cf555801.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

const ROOT = join(__dirname, '..', '..');
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
/** @type {string} */
let journal = '';

beforeAll(async () => {
  await loadGenerationLawPayloads();
  const town = generateSettlementPipeline(cfgFor('r2r-city-20'), null, { seed: 'r2r-city-20', customContent: {} });
  const vm = buildViewModel({ settlement: town });
  journal = buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Resources & Production')?.markdown || '';
}, 900000);

describe('V11: the exports name a nearby resource by the catalogue\'s label', () => {
  test('r2r-city-20: the journal prints "Mountain Pass", never "Defended Pass"', () => {
    const row = journal.split('\n').find((l) => /Nearby resources/.test(l)) || '';
    expectAbsentWithAnchor(row, 'Defended Pass', 'Mountain Pass');
  });
  test('kept: the journal still prints its nearby-resources row', () => {
    expect(journal).toMatch(/Nearby resources/);
  });
  test('the PDF\'s nearby tags read the same table', () => {
    const src = readFileSync(join(ROOT, 'src/pdf/sections/ResourcesProduction.jsx'), 'utf8');
    expect(src).toMatch(/Object\.hasOwn\(RESOURCE_DISPLAY_LABELS, it\) \? RESOURCE_DISPLAY_LABELS\[it\]/);
  });
});
