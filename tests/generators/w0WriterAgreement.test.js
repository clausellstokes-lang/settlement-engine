/**
 * w0WriterAgreement.test.js — THE WRITERS THE CONSTRUCTION WAVE PRESUMES (lane WIRING-W0, 2026-11-07; the chair's
 * rulings R-W7 (a)–(c), docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md). A sentence over a fact the record can
 * contradict is refused by the census law, so before the wave's lanes say these facts, each has ONE writer, and this
 * file holds them to it over a slice of the golden master's own corpus (every fifteenth of the 525, 35 births).
 *
 *   - ONE IMPORT SHARE (R-W7 c, cause 4a): `foodSecurity.importPct` is the writer and the food record's
 *     `normalImportPct` reads it. Red at 76febf9b0 (415 of the 525 disagreed), green after.
 *   - ONE FOOD-SOURCE COUNT (R-W7 c, cause 4b): the food chains, their count and the diversity note are the TYPES of
 *     the record's `foodSources` (FOOD-3; grain and the mill one type). Red at c99531cf9 (the count disagreed on
 *     every one of the 525), green after.
 *   - LEGACY ANNOTATIONS DATED AT BIRTH (R-W7 d, cause 5): each annotation says it is as of the founding survey, in
 *     its text and as a field, so no reader is told a frozen fact as live. Red at 3d1df12d7 (1,277 undated
 *     annotations over the 525), green after.
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

describe('ONE FOOD-SOURCE COUNT (R-W7 c, cause 4b)', () => {
  /** The food chain a FOOD-3 source belongs to: grain and the mill are one type. */
  const TYPE_OF = { grain: 'grain', mill: 'grain', livestock: 'livestock', fish: 'fish', game: 'game' };
  const typesOf = (sources) => new Set(sources.map((x) => TYPE_OF[x]));

  it('the slice is not vacuous: places with none, one and several source types are born', () => {
    const counts = new Set(births.map(({ s }) => typesOf(s.economicState.foodSecurity.foodRecord.foodSources).size));
    expect(counts.has(0) || counts.has(1)).toBe(true);
    expect([...counts].some((n) => n >= 2)).toBe(true);
  });

  it('activeChainsCount, the chains it marks live and the diversity note are the record foodSources\' own types', () => {
    const NOTE = ['no established food chains', 'single food source', 'two food source types', 'three food source types', 'highly diversified diet'];
    const disagree = births.filter(({ s }) => {
      const fs = s.economicState.foodSecurity;
      const n = typesOf(fs.foodRecord.foodSources).size;
      return fs.activeChainsCount !== n
        || fs.activeChains.length !== n
        || fs.diversityNote !== NOTE[Math.min(n, 4)]
        || fs.chains['Trade & imports'] !== false;
    }).map(({ key, s }) => `${key}: ${s.economicState.foodSecurity.activeChainsCount} vs ${s.economicState.foodSecurity.foodRecord.foodSources.join('+')}`);
    expect(disagree).toEqual([]);
  });
});

describe('LEGACY ANNOTATIONS DATED AT BIRTH (R-W7 d, cause 5)', () => {
  it('every legacy annotation says it is as of the founding survey, in its text and as a field', () => {
    const all = births.flatMap(({ key, s }) => (s.history?.legacyAnnotations || []).map((a) => ({ key, a })));
    expect(all.length).toBeGreaterThan(30);
    const undated = all
      .filter(({ a }) => a.asOf !== 'founding-survey' || !a.annotation.startsWith('As of the founding survey, '))
      .map(({ key, a }) => `${key}: ${a.annotation.slice(0, 60)}`);
    expect(undated).toEqual([]);
  });
});
