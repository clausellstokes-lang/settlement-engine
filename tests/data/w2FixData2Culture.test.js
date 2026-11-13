/**
 * W2-FIX-DATA-2 item 4 (2026-11-13) — the culture lines the cold list read too big for the place (REVIEW-W2B,
 * `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json` on lane/review-w2b-2026-11-13): "stone streets" (rows 253, 298),
 * "the older quarter" (268) and "a fortified high precinct" (2, 17) in thorps, hamlets and villages.
 *
 * `cultureProfiles.js :: materializeCulturalIdentity` now takes what the configuration answers before the roster
 * exists — the tier (`resolveConfig.js :: knownAtResolve`) — and a pick it refuses resolves draw-free to its small-place
 * twin (`CULTURE_LINE_SIBLINGS`), else the next row of its list. The greek detail is reworded to presume nothing (the
 * arrival scene's redraw reads the detail lists; a declared row would leave a small market-less place no line there).
 *
 * THIS FILE REDS WHEN: a materialized line declares a size the tier refuses; a town loses a line its tier admits; the
 * one pick over a list moves (the twin must stand outside it); an atom the configuration cannot answer (walls, a
 * market) is read as a refusal at the materializer; or a fixture town prints its false words anywhere in its record.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { CULTURE_LINE_SIBLINGS, CULTURE_PROFILES, CULTURE_PROFILE_KEYS, materializeCulturalIdentity } from '../../src/data/cultureProfiles.js';
import { atomHolds, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LISTS = /** @type {const} */ (['builtForm', 'civicPattern', 'exchangePattern', 'foodways', 'sacredLife', 'defensePattern', 'socialTexture', 'architecturalDetails']);
const FIELD = { architecturalDetails: 'architecturalDetail' };

/** The materializer's known facts for a tier, written from the vocabulary's own reader (as resolveConfig writes it). */
const known = (/** @type {string} */ tier) => ({
  refuses: (/** @type {unknown} */ row) => {
    const d = declarationOf(row);
    return d.needs.some((a) => atomHolds(a, { tier }) === false) || d.excludes.some((a) => atomHolds(a, { tier }) === true);
  },
});

/** A seeded pick double: always the i-th row, so every drawn index of every list is walked. */
const at = (/** @type {number} */ i) => ({ pick: (/** @type {readonly unknown[]} */ v) => v[i % v.length] });

describe('W2-FIX-DATA-2 item 4: the materializer takes the tier', () => {
  it('no materialized line declares a size its tier refuses (every culture, list, drawn index and tier)', () => {
    const bad = [];
    for (const key of CULTURE_PROFILE_KEYS) for (const tier of TIERS) for (let i = 0; i < 3; i++) {
      const id = materializeCulturalIdentity(key, at(i), known(tier));
      for (const list of LISTS) {
        const printed = String(id[FIELD[list] || list]);
        const row = [...CULTURE_PROFILES[key][list], ...Object.values(CULTURE_LINE_SIBLINGS).flat()].find((r) => textOf(r) === printed);
        if (row && known(tier).refuses(row)) bad.push(`${key} ${tier} #${i} ${list}: ${printed}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('a town keeps every line its tier admits: at town size and above the materializer is the base\'s', () => {
    for (const key of CULTURE_PROFILE_KEYS) for (const tier of ['town', 'city', 'metropolis']) for (let i = 0; i < 3; i++) {
      expect(materializeCulturalIdentity(key, at(i), known(tier)), `${key} ${tier} #${i}`).toEqual(materializeCulturalIdentity(key, at(i)));
    }
  });

  it('the twins stand outside the lists, so the one pick over a list is unchanged', () => {
    const twins = new Set(Object.values(CULTURE_LINE_SIBLINGS).flat().filter((l) => 'twinOf' in l).map((l) => l.text));
    for (const key of CULTURE_PROFILE_KEYS) for (const list of LISTS) {
      expect(CULTURE_PROFILES[key][list].filter((r) => twins.has(textOf(r))), `${key}.${list}`).toEqual([]);
    }
  });

  it('an atom the configuration cannot answer is not a refusal at the materializer (walls, a market)', () => {
    expect(known('thorp').refuses({ text: 'x', needs: ['market'] })).toBe(false);
    expect(known('thorp').refuses({ text: 'x', needs: ['walls'] })).toBe(false);
    expect(known('thorp').refuses({ text: 'x', needs: ['tier: ≥ town'] })).toBe(true);
    expect(known('town').refuses({ text: 'x', needs: ['tier: ≥ town'] })).toBe(false);
  });

  it('every twin is a small place\'s line and answers an original that declares a town', () => {
    for (const [original, set] of Object.entries(CULTURE_LINE_SIBLINGS)) {
      const twin = set.find((l) => 'twinOf' in l);
      expect(twin?.twinOf).toBe(original);
      expect(known('thorp').refuses(twin)).toBe(false);
      expect(known('town').refuses(twin)).toBe(true);
      expect(known('thorp').refuses(set.find((l) => !('twinOf' in l)))).toBe(true);
    }
  });
});

const CALM = { selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] };
const FIXTURE = [
  { id: 'c01-thorp-none', seed: 'review-w2b-1', config: { settType: 'thorp', ...CALM }, rows: [2], words: /fortified high precinct/i },
  { id: 'c11-village-none', seed: 'review-w2b-11', config: { settType: 'village', ...CALM }, rows: [17], words: /fortified high precinct/i },
  { id: 'c09-hamlet-none', seed: 'review-w2b-9', config: { settType: 'hamlet', ...CALM }, rows: [253], words: /stone streets/i },
  { id: 'c14-village-none', seed: 'review-w2b-14', config: { settType: 'village', ...CALM }, rows: [268], words: /older quarter/i },
  { id: 'c05-thorp-random', seed: 'review-w2b-5', config: { settType: 'thorp' }, rows: [298], words: /stone streets/i },
];

describe('W2-FIX-DATA-2 item 4: the fixture towns, re-born, read whole', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  for (const t of FIXTURE) {
    it(`${t.id} (row ${t.rows.join(', ')}): the words are nowhere in the record, and the arrival still shows the place`, () => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...t.config }), null, { seed: t.seed, customContent: {} });
      expect(JSON.stringify(s).match(t.words)).toBeNull();
      expect(String(s.arrivalScene).split(/(?<=\.)\s+/).length).toBeGreaterThanOrEqual(4);
      expect(String(s.culturalIdentity.architecturalDetail).length).toBeGreaterThan(0);
    }, 60_000);
  }
});
