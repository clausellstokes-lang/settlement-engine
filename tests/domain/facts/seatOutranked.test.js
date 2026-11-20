/**
 * tests/domain/facts/seatOutranked.test.js — BAR5-POWERS, THE CHAIR'S RULING SO1 of 2026-11-16: the fourth atom of the power
 * family, `seat outranked` (`src/domain/facts/seatOutranked.js`), through the vocabulary's own door (`factVocabulary.js`,
 * `factsOf.js`, `factLayers.js`), and its one declaring line (DS-POW-4 › Holding v3, "no rival yet outweighs"). The real
 * row is the control: the census's r2s-under_siege-city-1, its Ecclesiastical Council (Significant) under a Military/Guard
 * rated Strong, the line printed there at 600b7683a (REVIEW-BAR-5's C38889 is the same shape under an occupation).
 *
 * @enforced-by npx vitest run tests/domain/facts/seatOutranked.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STANDING_LADDER, seatOutrankedOf } from '../../../src/domain/facts/seatOutranked.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { LEAVES } from '../../../src/domain/facts/factLayers.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../src/data/dossierStateProse/power.generated.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const power = (faction, powerLabel, isGoverning) => ({ faction, powerLabel, ...(isGoverning === undefined ? {} : { isGoverning }) });
const rec = (...factions) => ({ powerStructure: { factions } });
const outranked = rec(power('Ecclesiastical Council', 'Significant', true), power('Military/Guard', 'Strong'));
const level = rec(power('Elder Council', 'Strong', true), power('Merchant Guilds', 'Strong'), power('Craft Guilds', 'Minor'));
const above = rec(power('Elder Council', 'Dominant', true), power('Merchant Guilds', 'Significant'));

/** the variant that declares the atom, found by its own declaration (computed, never a literal sentence) */
const declaring = () => {
  /** @type {any[]} */ const found = [];
  const walk = (/** @type {any} */ o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (Array.isArray(o.marks) && o.marks.includes('no seat outranked')) found.push(o); Object.values(o).forEach(walk); } };
  walk(DOSSIER_STATE_PROSE_POWER);
  return found;
};

/** the control: the census's town where the line printed beside an outranked seat at 600b7683a (CENSUS-3's r2s- shape) */
const CONTROL = 'r2s-under_siege-city-1';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {any} */ let controlTown = null;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  controlTown = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: ['under_siege'], selectedStressesRandom: false, settType: 'city' }), null, { seed: CONTROL, customContent: {} });
}, 300000);

describe('the home: a power above the seat, by its own standing', () => {
  it('reads a power rated above the governing one as outranking it; level or below as not', () => {
    expect(STANDING_LADDER).toEqual(['Suppressed', 'Minor', 'Significant', 'Strong', 'Dominant']);
    expect(seatOutrankedOf(outranked)).toBe(true);
    expect(seatOutrankedOf(level)).toBe(false);
    expect(seatOutrankedOf(above)).toBe(false);
  });
  it('is UNANSWERED where the record holds no power list or no governing power with a standing (fail-closed)', () => {
    expect(seatOutrankedOf({})).toBeUndefined();
    expect(seatOutrankedOf(null)).toBeUndefined();
    expect(seatOutrankedOf(rec(power('Merchant Guilds', 'Strong')))).toBeUndefined();
  });
});

describe('the word, through the vocabulary\'s door', () => {
  it('is a declarable presence atom, homed in factsOf and in the layer table', () => {
    expect(V.assertDeclarable('seat outranked').dimension).toBe('seat outranked');
    expect(V.FACT_DIMENSIONS['seat outranked']).toMatchObject({ shape: 'presence', home: 'seatOutranked' });
    expect(LEAVES.seatOutranked).toMatchObject({ layer: 3, reads: ['powerStructure'] });
  });
  it('holds, refuses and stays unanswered as the record does', () => {
    expect(V.atomHolds('seat outranked', factsOf(outranked))).toBe(true);
    expect(V.atomHolds('seat outranked', factsOf(level))).toBe(false);
    expect(V.atomHolds('seat outranked', factsOf({}))).toBeUndefined();
  });
});

describe('its one declaring line: DS-POW-4 › Holding v3', () => {
  it('declares no seat outranked (and no occupation), and is the only line that does (no other line re-keyed this round)', () => {
    const lines = declaring();
    expect(lines.length).toBe(1);
    expect(lines[0].text).toMatch(/no rival yet outweighs \{faction\}/);
    expect(lines[0].marks).toEqual(expect.arrayContaining(['no seat outranked', 'no crisis: occupied']));
  });
  it(`control ${CONTROL}: the seat stands under a power the page rates higher, so the line is refused there`, () => {
    expect(seatOutrankedOf(controlTown)).toBe(true);
    const line = { line: () => '', excludes: ['seat outranked'] };
    expect(V.declarationAdmits(V.declarationOf(line), factsOf(controlTown)).admitted).toBe(false);
    expect(V.declarationAdmits(V.declarationOf(line), factsOf(level)).admitted).toBe(true);
  });
});
