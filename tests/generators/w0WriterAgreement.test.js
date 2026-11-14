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
 *   - LEGACY ANNOTATIONS DATED AT BIRTH (R-W7 d, cause 5): each annotation's text says it is as of the founding
 *     survey, so no reader is told a frozen fact as live; the text is the date's one home (no field beside it, which
 *     nothing read). Red at 3d1df12d7 (1,277 undated annotations over the 525), green after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { NO_FOOD_CHAINS_LINE, OWN_PLOTS_LINE } from '../../src/generators/foodLand.js';

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
    // With no source type the note is the declared pair's (COHERENCE-AGREE-3, Part B (i), e4a897c2a): its own plots
    // where the roster works its own land, else no chains. COHERENCE-AGREE-6 (REVIEW-AGREE-2 F7, the chair's ruling of
    // 2026-11-12): the expectation is a LITERAL per fixed row, never a call into the writer's own predicate
    // (`foodLand.js :: foodLandOf(...).worksOwnLand`), so a wrong predicate reddens it. Taken at the generator of
    // COHERENCE-AGREE-6's item 5; a row whose food sources move is re-keyed here with its cause.
    const NOTE = [null, 'single food source', 'two food source types', 'three food source types', 'highly diversified diet'];
    const ZERO_NOTE = {
      'thorp|norse|forest|isolated|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'thorp|greek|mountain|road|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'hamlet|germanic|desert|road|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'hamlet|mesoamerican|forest|isolated|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'village|latin|mountain|road|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'village|arabic|desert|road|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'village|greek|forest|isolated|civilized|golden-master-v3': OWN_PLOTS_LINE,
      'town|east_asian|desert|road|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'city|latin|forest|isolated|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'city|steppe|desert|road|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'metropolis|germanic|plains|road|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'metropolis|celtic|hills|road|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'metropolis|norse|forest|isolated|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
      'metropolis|greek|mountain|road|civilized|golden-master-v3': NO_FOOD_CHAINS_LINE,
    };
    const zeroKeys = births.filter(({ s }) => typesOf(s.economicState.foodSecurity.foodRecord.foodSources).size === 0).map(({ key }) => key);
    expect(zeroKeys.sort(), 'the rows with no food source are the literal table\'s rows').toEqual(Object.keys(ZERO_NOTE).sort());
    const zeroNote = (key) => ZERO_NOTE[key];
    const noteCount = (line) => births.filter(({ s }) => s.economicState.foodSecurity.diversityNote === line).length;
    expect(noteCount(OWN_PLOTS_LINE), 'the slice carries the own-plots twin').toBeGreaterThan(0);
    expect(noteCount(NO_FOOD_CHAINS_LINE), 'and the no-chains line, so the zero arm reads both').toBeGreaterThan(0);
    const disagree = births.filter(({ key, s }) => {
      const fs = s.economicState.foodSecurity;
      const n = typesOf(fs.foodRecord.foodSources).size;
      return fs.activeChainsCount !== n
        || fs.activeChains.length !== n
        || fs.diversityNote !== (n === 0 ? zeroNote(key) : NOTE[Math.min(n, 4)])
        || fs.chains['Trade & imports'] !== false;
    }).map(({ key, s }) => `${key}: ${s.economicState.foodSecurity.activeChainsCount} vs ${s.economicState.foodSecurity.foodRecord.foodSources.join('+')}`);
    expect(disagree).toEqual([]);
  });
});

describe('LEGACY ANNOTATIONS DATED AT BIRTH (R-W7 d, cause 5)', () => {
  it('every legacy annotation says it is as of the founding survey, in its text, its one home', () => {
    const all = births.flatMap(({ key, s }) => (s.history?.legacyAnnotations || []).map((a) => ({ key, a })));
    expect(all.length).toBeGreaterThan(30);
    const undated = all
      .filter(({ a }) => !a.annotation.startsWith('As of the founding survey, ') || Object.hasOwn(a, 'asOf'))
      .map(({ key, a }) => `${key}: ${a.annotation.slice(0, 60)}`);
    expect(undated).toEqual([]);
  });
});

describe('THE ROSTER-READ FLAGS AND SCORES ARE THE FINAL ROSTER\'S (R-W7 a, b; causes 2 and 3, a pin)', () => {
  // MEASURED, NOT CURED: over the golden 525 and the soak 1,000 (flags firing on 179), safetyProfile.flags,
  // economicState.compound (inst and the five scores) and safetyProfile.compound recomputed over the FINAL roster
  // equal the stored ones on every birth (0 of 1,525): the economy is re-derived after the roster's last pass
  // (steps/economyReconcilePass.js). This pins it, so a later pass that trims the roster after the economy reds here.
  // On ADVANCE they go stale (economicState.js, the "RAW ROSTER, STAMPED ONCE" note): the simulation's, after FPZ.
  it('every birth\'s stored flags, compound.inst and influence scores equal a recompute over its final roster', async () => {
    const { getInstFlags, getStressFlags } = await import('../../src/generators/priorityHelpers.js');
    const stale = births.filter(({ s }) => {
      const eco = s.economicState;
      const inst = getInstFlags(s.config, s.institutions);
      return JSON.stringify(eco.safetyProfile.flags) !== JSON.stringify(getStressFlags(s.config, s.institutions))
        || JSON.stringify(eco.compound) !== JSON.stringify(inst)
        || JSON.stringify(eco.safetyProfile.compound) !== JSON.stringify(inst);
    }).map(({ key }) => key);
    expect(stale).toEqual([]);
  });
});
