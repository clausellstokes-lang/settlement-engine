/**
 * clericalCareNeedsClergy.test.js — W2-C-LEAVES item 3 (2026-11-13; the cold list REVIEW-W2A-3 #56, HIGH).
 *
 * The Defense tab's Medical Readiness card (and the PDF's, one derivation: `defenseDisplay.js ::
 * deriveSupportingCapabilities`) printed "Clergy care" and "Clerical care. Basic wound and disease management." in a
 * thorp whose Burial ground reads "No clergy lives near enough" and whose Faith reads "no church of its own": the row
 * read `compound.inst.hasChurch`, a name test that a Wayside shrine and an "Access to parish church" row both pass. The
 * home of "clergy live here" is the faith's (`dossier/faithReading.js :: faithReadingOf`): a church of the place's own
 * (never a shrine, never access to a neighbour's), or a cleric on its roster. Where neither, the row says what the
 * place has: "No healer is kept here; the sick are tended by their own families." (the row's own words, unchanged).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { deriveSupportingCapabilities } from '../../../src/domain/display/defenseDisplay.js';
import { faithReadingOf } from '../../../src/domain/dossier/faithReading.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** @param {any} town */
const medical = (town) => /** @type {{ status: string, note: string }} */ (deriveSupportingCapabilities(town).find((c) => c.label === 'Medical Readiness'));
/** The app's own shape, as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  return generateSettlementPipeline(configOf({ size: parts.at(-2), crisis: null }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
const NONE_NOTE = 'No healer is kept here; the sick are tended by their own families.';

describe('clerical care is said only where clergy live (item 3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a shrine or access to a neighbour\'s church is no clergy; a church or a cleric on the roster is', () => {
    const town = (/** @type {string[]} */ names, /** @type {object[]} */ npcs = []) => ({
      institutions: names.map((name) => ({ name })), npcs, economicState: { compound: { inst: { hasChurch: true } } },
    });
    expect(medical(town(['Wayside shrine', 'Access to parish church']))).toMatchObject({ status: 'None', note: NONE_NOTE });
    expect(medical(town(['Parish church']))).toMatchObject({ status: 'Clergy care', note: 'Clerical care. Basic wound and disease management.' });
    expect(medical(town(['Access to parish church'], [{ name: 'Brother Aldo', role: 'Priest' }]))).toMatchObject({ status: 'Clergy care' });
  });

  test('the cold list\'s thorp (rw3-thorp-calm-2, the app\'s shape): a wayside shrine and access to a church, no clergy', () => {
    const town = birthApp('rw3-thorp-calm-2');
    const faith = faithReadingOf(town);
    expect(faith.accessOnly && !faith.hasChurch && faith.seniorCleric === null, 'anchored: the faith home reads no clergy here').toBe(true);
    expect(medical(town)).toMatchObject({ status: 'None', note: NONE_NOTE });
  }, 60000);

  test('the census\'s thorps with access only say no clergy; its villages with a parish church keep clerical care', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-0', 'r2r-thorp-4', 'r2r-thorp-5', 'r2r-village-0', 'r2r-village-1'], (seed) => {
      const town = birthCensus(seed);
      const faith = faithReadingOf(town);
      const clergy = faith.hasChurch || faith.seniorCleric !== null;
      expect(medical(town).status, seed).toBe(clergy ? 'Clergy care' : 'None');
      expect(seed.includes('village') ? clergy : !clergy, `anchored: ${seed} reads as its kind`).toBe(true);
    }), 'clerical care said where no clergy live, or lost where they do');
  }, 180000);
});
