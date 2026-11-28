/**
 * tests/domain/close7Mirror.test.js — CLOSE-7, THE MIRROR (the chair's RULING-R24 R24d of 2026-11-24, its words; the
 * brief `close-7/briefs/MIRROR.md`): A PRINTED FAMINE OVER FULL FIELDS.
 *
 * A2 held one cell: the page prints Famine and the place's own production band is adequate or surplus (C 4, V 3). Its fare
 * read the production band, so the page said the place ate enough beside an Active Famine. R24d: the printed band bounds
 * the fare (Famine: critical..collapsed), and in that cell the lines that say the source failed (the fare's C7, Dawn Work's
 * F6) give way to the chair's (K2, K1), each declared in the pool's own form: they need the vocabulary's
 * `food production: ≥ adequate` (`facts/foodProduction.js`, read off the capacity profile the deriver hands), and C7 and F6
 * exclude it, so they STAY where the source did fail.
 *
 *   (a) RED FIRST, BY NAME: the cell's seven places print a fare line of a fed band beside "Famine" (the battery row FEDFARE
 *       reads it off the place's own Daily Life); after, each reads the critical fare and the row reads nothing.
 *   (b) THE WORDS AND THEIR CONDITIONS: K2 and K1 verbatim, each appended after the line it stands in for, with that
 *       line's needs and the atom; C7 and F6 exclude the atom; the atom is fail-closed without a profile.
 *   (c) WHERE THEY PRINT: K1 on the cell places whose Dawn Work draws it (D13 STABLE-PICKS, point 120: the rendezvous over the
 *       lines' ids, so C dp-village-76, C dp-village-54, V dp-hamlet-100); no cell place prints C7 or F6. K2 prints on no
 *       place of C or V: no cell place holds fish.
 *   (d) C7 AND F6 STAY where the source did fail: V dp-thorp-70 (Famine over strained production) keeps C7 and F6, and
 *       C dp-village-52 (the same cell of C) keeps F6 (each record under a stated other name: see (d)).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js';
import { FOOD_CULTURE } from '../../src/data/dailyLife/foodCulture.js';
import { DAWN_WORK } from '../../src/data/dailyLife/dawnWork.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { pageCensusFindings } from '../../src/domain/coherence/pageCensusFindings.js';

const K2 = 'Every fish that comes in is counted, and the shares are measured out house by house.';
const K1 = 'Every hand that can be spared is out at first light, and what comes in is counted before it is eaten.';
const ATOM = 'food production: ≥ adequate';
/** @param {string} branch @param {string} id */
const lineOf = (branch, id) => /** @type {any} */ (FOOD_CULTURE)[branch]?.find((/** @type {{ id: string }} */ l) => l.id === id);
/** @param {string} id */
const dawnOf = (id) => DAWN_WORK.food.find((l) => l.id === id);

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}
/** @param {unknown} s */
const slotsOf = (s) => deriveDailyLife(/** @type {any} */ (s), { audience: 'owner' }).slots;
/** The fare branch the food line came from (its pool), or null. @param {string} t */
const fareBranchOf = (t) => Object.entries(FOOD_CULTURE).find(([, lines]) => lines.some((l) => t.includes(l.text)))?.[0] ?? null;

/** THE CELL (R24d; A2's table at d447ee31e): printed Famine over production adequate (C 3, V 3) or surplus (C 1). */
const CELL = /** @type {const} */ ([
  ['C', 'dp-hamlet-117', 'adequate'], ['C', 'dp-village-51', 'adequate'], ['C', 'dp-village-76', 'adequate'], ['C', 'dp-village-54', 'surplus'],
  ['V', 'dp-hamlet-100', 'adequate'], ['V', 'dp-hamlet-139', 'adequate'], ['V', 'dp-village-76', 'adequate'],
]);
/** The cell's places whose Dawn Work stands on F6's index of the food branch (measured: `close-7/mirror/`). */
// point 124 (the pick keys on the town's id, no longer its name), measured: the K1 drawers under the id are C dp-hamlet-117,
// C dp-village-51, V dp-hamlet-100 and V dp-hamlet-139 (they were C dp-village-76, C dp-village-54 and V dp-hamlet-100 by name)
const K1_PLACES = new Set(['C dp-hamlet-117', 'C dp-village-51', 'V dp-hamlet-100', 'V dp-hamlet-139']); // D13 STABLE-PICKS: the K1 drawers under the rendezvous

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('(a) red first, by name: no fare line of a fed band beside a printed Famine', () => {
  for (const [corpus, seed, production] of CELL) {
    it(`${corpus} ${seed}: Famine over production ${production} reads the critical fare, and the row FEDFARE reads nothing`, () => {
      const s = birth(seed, corpus);
      const capacities = deriveAllCapacities(s);
      expect(atomHolds('food: = famine', factsOf(s)), seed).toBe(true);
      expect(capacities.capacities.food_production.band, seed).toBe(production);
      const fare = String(slotsOf(s).food_culture?.text || '');
      expect({ seed, branch: fareBranchOf(fare) }).toEqual({ seed, branch: 'critical' });
      expect(pageCensusFindings(s, { 'World/Daily Life': [fare] }).filter((f) => f.row === 'FEDFARE')).toEqual([]);
      expect(atomHolds(ATOM, factsOf(s), { capacities }), seed).toBe(true);
    }, 120000);
  }
});

describe('(b) the words, and their declared conditions (R24d)', () => {
  it('K2 is the chair\'s words, after C7, with C7\'s need and the atom; C7 excludes the atom', () => {
    const ids = FOOD_CULTURE.critical.map((l) => l.id);
    expect(ids.indexOf('K2')).toBe(ids.indexOf('C7') + 1);
    expect(lineOf('critical', 'K2')).toEqual({ id: 'K2', text: K2, needs: ['fish', ATOM] });
    expect(lineOf('critical', 'C7').excludes).toEqual([ATOM]);
  });
  it('K1 is the chair\'s words, after F6, with F6\'s needs and the atom; F6 excludes the atom', () => {
    const ids = DAWN_WORK.food.map((l) => l.id);
    expect(ids.indexOf('K1')).toBe(ids.indexOf('F6') + 1);
    expect(dawnOf('K1')).toEqual({ id: 'K1', text: K1, needs: [...(dawnOf('F6')?.needs || []), ATOM] });
    expect(dawnOf('F6')?.excludes).toEqual([ATOM]);
  });
  it('the ids are free in their pools: K2 once in the fare, K1 once in Dawn Work', () => {
    expect(Object.values(FOOD_CULTURE).flat().filter((l) => l.id === 'K2').length).toBe(1);
    expect(Object.values(DAWN_WORK).flat().filter((l) => l.id === 'K1').length).toBe(1);
  });
  it('the atom parses, reads the handed profile, and is unanswered (so refused) with none', () => {
    expect(parseAtom(ATOM)).toMatchObject({ dimension: 'food production', op: '≥', value: 'adequate' });
    const facts = factsOf({});
    const at = (/** @type {string} */ band) => atomHolds(ATOM, facts, { capacities: { capacities: { food_production: { band } } } });
    expect(['collapsed', 'critical', 'strained', 'adequate', 'surplus'].map(at)).toEqual([false, false, false, true, true]);
    expect(atomHolds(ATOM, facts)).toBeUndefined();
    expect(atomHolds(ATOM, facts, { capacities: null })).toBeUndefined();
  });
});

describe('(c) where the chair\'s lines print', () => {
  for (const [corpus, seed] of CELL) {
    const key = `${corpus} ${seed}`;
    it(`${key}: ${K1_PLACES.has(key) ? 'Dawn Work prints K1' : 'Dawn Work prints neither F6 nor K1'}; the fare prints neither C7 nor K2`, () => {
      const slots = slotsOf(birth(seed, corpus));
      const dawn = String(slots.dawn_work?.text || ''); const fare = String(slots.food_culture?.text || '');
      expect(dawn.includes(K1), key).toBe(K1_PLACES.has(key));
      expect(dawn.includes(String(dawnOf('F6')?.text)), key).toBe(false);
      expect(fare.includes(String(lineOf('critical', 'C7')?.text)) || fare.includes(K2), key).toBe(false);
    }, 120000);
  }
  // THE VACUOUS ROW (RULING-R, the eleventh chair, 2026-11-27; R-MEASURE): no cell place of C or V holds fish, so the rows
  // above could not tell C7 from K2. The measure's hand-set record: V dp-hamlet-139 with fish its one food source stays in the
  // cell (Famine, production adequate, the atom `fish`), and under the stated id 'frostdale-36' (the pick is keyed by the
  // town's ID since point 124, its NAME before: found by the key's hash) it draws K2 and K1, so a deriver that lets C7 back in,
  // or loses K2, reds here.
  it('V dp-hamlet-139 with fish, under the stated id frostdale-36: the fare prints K2 and not C7; Dawn Work prints K1 and not F6', () => {
    const born = birth('dp-hamlet-139', 'V');
    const food = born.economicState.foodSecurity;
    const s = { ...born, id: 'frostdale-36', name: 'Frostdale', economicState: { ...born.economicState, foodSecurity: { ...food, foodRecord: { ...food.foodRecord, foodSources: ['fish'] } } } };
    expect(atomHolds('food: = famine', factsOf(s))).toBe(true);
    expect(deriveAllCapacities(s).capacities.food_production.band).toBe('adequate');
    expect(atomHolds('fish', factsOf(s))).toBe(true);
    const slots = slotsOf(s);
    const dawn = String(slots.dawn_work?.text || ''); const fare = String(slots.food_culture?.text || '');
    expect(fare).toContain(K2);
    expect(fare.includes(String(lineOf('critical', 'C7')?.text))).toBe(false); // anchored: K2 above is the same slot's line
    expect(dawn).toContain(K1);
    expect(dawn.includes(String(dawnOf('F6')?.text))).toBe(false); // anchored: K1 above is the same slot's line
  }, 120000);
});

describe('(d) C7 and F6 stay where the source did fail', () => {
  it('V dp-thorp-70: Famine over strained production keeps C7 and F6', () => {
    // D13 STABLE-PICKS (point 120): the pick is keyed by the town's ID since point 124 (its NAME before), and under the rendezvous
    // the record's own id draws neither C7 nor F6, though both are admitted. The SAME record under the stated id 'ashfield-18' draws
    // C7 and F6 (found by the keys' hashes), so a deriver that drops C7 or F6 where the source failed reds this row.
    const s = { ...birth('dp-thorp-70', 'V'), id: 'ashfield-18', name: 'Ashfield' };
    expect(atomHolds('food: = famine', factsOf(s))).toBe(true);
    expect(deriveAllCapacities(s).capacities.food_production.band).toBe('strained');
    const slots = slotsOf(s);
    expect(String(slots.food_culture?.text)).toContain(String(lineOf('critical', 'C7')?.text));
    expect(String(slots.dawn_work?.text)).toContain(String(dawnOf('F6')?.text));
  }, 120000);
  it('C dp-village-52: Famine over strained production keeps F6', () => {
    // D13 STABLE-PICKS: keyed by the town's id since point 124, the record's own id draws F6 (measured; the stated name 'Ashby'
    // drew it while the name was the key, and it no longer steers the pick), so a deriver that drops F6 where the source failed reds this row
    const s = { ...birth('dp-village-52', 'C'), name: 'Ashby' };
    expect(atomHolds('food: = famine', factsOf(s))).toBe(true);
    expect(deriveAllCapacities(s).capacities.food_production.band).toBe('strained');
    expect(String(slotsOf(s).dawn_work?.text)).toContain(String(dawnOf('F6')?.text));
  }, 120000);
});
