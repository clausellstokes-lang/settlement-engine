/**
 * tests/domain/foundingTraditionsKeepTheId.test.js — POINT 124, unit K1b (the chair's rulings K1-1 (iii) and K1b-1): AN
 * IMPORTED COPY HOLDS THE OWNER's TRADITIONS.
 *
 * The founding traditions (`traditions/genesis.js :: deriveFoundingTraditions`, the set the Traditions tab previews and the
 * world tick mints at a settlement's first lit tick) drew on `_seed ?? id ?? identity.seed`. Every road out of the owner's
 * library (the JSON import, the share, the gallery import) drops `_seed`, so an imported copy founded OTHER traditions. For
 * a record born at or after 0.10.0 (`bornAtOrAfter`, the literal floor `NEEDS_SINCE` and `FIELD_RITE_SINCE` use) the draw's
 * root key is the town's id, through `domain/display/pickKey.js :: pickKeyOf`; an earlier engine's record, or one with no
 * stamp, draws on the chain it drew on before, byte for byte.
 *   (a) a born (0.10.0) town and its copy without `_seed` found the same set, show the same set, and share the same rows;
 *   (b) a record re-stamped 0.9.0, and one with no stamp, never read the id: their set is the same with the id removed.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { shownTraditionsOf, sharedTraditionRowsOf } from '../../src/domain/traditions/shownTraditions.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const HEAVY = 600_000;
/** @param {unknown} v */ const clone = (v) => JSON.parse(JSON.stringify(v));
/** @param {any} s */ const seedless = (s) => { const c = clone(s); delete c._seed; if (c.config) delete c.config._seed; delete c._config; return c; };
/** @param {any} s */ const idless = (s) => { const c = clone(s); delete c.id; return c; };

/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    const seed = `founding-keeps-${size}-0`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, HEAVY);

describe('(a) a 0.10.0 town and its copy without `_seed` found, show and share the same traditions', () => {
  it('the drawn set, the shown set and the shared rows are the owner\'s', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      expect(rec.generatorVersion, `${seed}: born at 0.10.0`).toBe('0.10.0');
      const copy = seedless(rec);
      expect(deriveFoundingTraditions(copy), `${seed}: the drawn set`).toEqual(deriveFoundingTraditions(rec));
      expect(shownTraditionsOf(copy, []), `${seed}: the shown set`).toEqual(shownTraditionsOf(rec, []));
      expect(sharedTraditionRowsOf(copy), `${seed}: the shared rows`).toEqual(sharedTraditionRowsOf(rec));
    });
    expectNoSeedFailures(failures, 'a copy without `_seed` founds, shows and shares the owner\'s traditions');
  }, HEAVY);
});

describe('(b) an earlier engine\'s record, and a stampless one, draw on the chain they drew on before', () => {
  it('re-stamped 0.9.0, or with no stamp, the set does not read the id', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      for (const [form, r] of /** @type {Array<[string, any]>} */ ([['0.9.0', { ...clone(rec), generatorVersion: '0.9.0' }], ['stampless', (() => { const c = clone(rec); delete c.generatorVersion; return c; })()]])) {
        expect(deriveFoundingTraditions(idless(r)), `${seed} ${form}`).toEqual(deriveFoundingTraditions(r));
        // anchored: without `_seed`, the old chain falls to the id, so the set the copy draws is NOT the owner's (the defect kept)
        expect(deriveFoundingTraditions(seedless(r)).map((x) => x.name), `${seed} ${form}: the old chain`).not.toEqual(deriveFoundingTraditions(r).map((x) => x.name));
      }
    });
    expectNoSeedFailures(failures, 'an earlier engine\'s record and a stampless one draw on the old chain');
  }, HEAVY);
});
