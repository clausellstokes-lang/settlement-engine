/**
 * w0WriterAgreement.test.js — THE WRITERS THE CONSTRUCTION WAVE PRESUMES (lane WIRING-W0, 2026-11-07; the chair's
 * rulings R-W7 (a)–(c), docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md). A sentence over a fact the record can
 * contradict is refused by the census law, so before the wave's lanes say these facts, each has ONE writer, and this
 * file holds them to it over a slice of the golden master's own corpus (every fifteenth of the 525, 35 births).
 *
 *   - ONE IMPORT SHARE (R-W7 c, cause 4a): `foodSecurity.importPct` is the writer and the food record's
 *     `normalImportPct` reads it. Red at 76febf9b0 (415 of the 525 disagreed), green after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

/** @type {Array<{ key: string, s: any }>} */
const births = [];

beforeAll(() => {
  goldenCorpus().forEach((config, i) => {
    if (i % 15 !== 0) return;
    const { _seed, ...cfg } = config;
    births.push({ key: keyOf(config), s: generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }) });
  });
}, 240_000);

describe('ONE IMPORT SHARE (R-W7 c, cause 4a)', () => {
  it('the slice is not vacuous: a share above zero is carried somewhere', () => {
    expect(births).toHaveLength(35);
    expect(births.some(({ s }) => s.economicState.foodSecurity.importPct > 0)).toBe(true);
  });

  it('foodSecurity.importPct and foodRecord.normalImportPct are one figure on every birth', () => {
    const disagree = births
      .filter(({ s }) => s.economicState.foodSecurity.importPct !== s.economicState.foodSecurity.foodRecord.normalImportPct)
      .map(({ key, s }) => `${key}: ${s.economicState.foodSecurity.importPct} vs ${s.economicState.foodSecurity.foodRecord.normalImportPct}`);
    expect(disagree).toEqual([]);
  });
});
