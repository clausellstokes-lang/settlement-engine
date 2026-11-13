/**
 * W2-FIX-DATA-3 (2026-11-13), the chair's ruling on the round's first cut (REVIEW-W2A-3, twenty fresh towns read cold at
 * 817980b33, `docs/chair/2026-11-13/REVIEW-W2A-3-COLD-LIST.json` on lane/review-w2a-2026-11-12): three HIGH lines in
 * this lane's data files, each reproduced false at 1e93f4d11 in its town, in the app's configuration shape (the
 * reviewer's: DEFAULT_CONFIG, the stress panel with Random off, `_randomizePriorities`).
 *
 * THIS FILE REDS WHEN a small place prints one of them again, or when the place it is true in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CULTURE_PROFILES, CULTURE_LINE_SIBLINGS } from '../../src/data/cultureProfiles.js';
import { atomHolds, declarationOf } from '../../src/domain/facts/factVocabulary.js';

/** A REVIEW-W2A-3 town in the app's shape (its seed names its size and the crises chosen in the panel). */
const born = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+?)-(.+)-(\d+)$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** Every string of a record, joined, so a fragment anywhere in it (identity, notes, the arrival scene) is found. */
const everyString = (/** @type {any} */ o) => { const out = []; const walk = (/** @type {any} */ v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k]); }; walk(o); return out.join('\n'); };
/** Is a row refused at this tier, by the vocabulary's own reader? */
const refusedAt = (/** @type {unknown} */ row, /** @type {string} */ tier) => {
  const d = declarationOf(row);
  return d.needs.some((a) => atomHolds(a, { tier }) === false) || d.excludes.some((a) => atomHolds(a, { tier }) === true);
};

describe('W2-FIX-DATA-3: the round\'s high lines in this lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  test('a ceremonial precinct over a busy plaza is a town\'s; a small place has its own line (rw3-thorp-calm-2)', () => {
    const PRECINCT = 'a raised ceremonial precinct overlooks a broad and busy open plaza';
    const row = CULTURE_PROFILES.mesoamerican.architecturalDetails.find((r) => (typeof r === 'string' ? r : r.text) === PRECINCT);
    for (const tier of ['thorp', 'hamlet', 'village']) expect(refusedAt(row, tier), tier).toBe(true);
    for (const tier of ['town', 'city', 'metropolis']) expect(refusedAt(row, tier), tier).toBe(false);
    const twin = (CULTURE_LINE_SIBLINGS[PRECINCT] || []).find((l) => typeof l.twinOf === 'string');
    expect(twin, 'the small place has a line of its own').toBeTruthy();
    for (const tier of ['thorp', 'hamlet', 'village']) expect(refusedAt(twin, tier), tier).toBe(false);
    const text = everyString(born('rw3-thorp-calm-2'));
    expect(text).toContain(String(twin?.text));
    expect(text.split('\n').filter((t) => t.toLowerCase().includes('ceremonial precinct'))).toEqual([]);
  }, 60_000);
});
