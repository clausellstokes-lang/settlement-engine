/**
 * holderTitleForms.test.js — TAIL-TITLES K-C (RECORD-MEASURE-2 k; the chair's ruling of 2026-11-15 00:50 UTC): A PERSON'S
 * TITLE IS THE HOUSE'S FACE IN ITS HOLDER'S FORM. The face was minted with no reading of the drawn sex: a man titled "the
 * district madam", "the foundling-mother"; a woman "the ferryman", "the boat-headman" (268 of the census's 720 at
 * 866041da5). One leaf (data/holderTitleForms.js :: titleForHolder), read at both mints after the hook draw, gives the
 * title AND the role the holder's form (M-1b kept: a representative's role is its institution's title, one word); the
 * card's `institution.title` keeps the face, which the honorific, hook and goal tables, the senior cleric's rank and the
 * structural ladder's cut key (`faceOfRole`). An office's title (Lord Marshal, Lord Mayor) stays the office's.
 *
 * Births through the census's births (DEFAULT_CONFIG and the browser's dials, the calm r2r seeds); every expected word a
 * literal. MOVE: the card's title, role and every row end that names it must NOT read the face; each names what prints
 * instead. KEEP: a holder of the face's own sex, the owner's veto ("the midwife" for a man) and an office keep their word.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** @type {Map<string, any>} */
const births = new Map();
/** The census's calm seed r2r-<size>-<i>, born once. @param {string} seed */
function born(seed) {
  if (!births.has(seed)) {
    const m = seed.match(/^r2r-(\w+)-\d+$/);
    if (!m) throw new Error(seed);
    births.set(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} }));
  }
  return births.get(seed);
}
/** The card of `name` and the words its row ends print. @param {string} seed @param {string} name */
function cardOf(seed, name) {
  const s = born(seed);
  const card = (s.npcs || []).find((/** @type {any} */ c) => c.name === name) || null;
  const ends = card ? (s.relationships || []).flatMap((/** @type {any} */ r) => [r.from === card.id ? r.npc1Role : null, r.to === card.id ? r.npc2Role : null]).filter(Boolean) : [];
  return { card, ends };
}

/** [seed, name, gender, the face (must not print as the title or role), what prints instead, the role where an office holds it]. */
const MOVE = Object.freeze([
  ['r2r-thorp-3', 'Borchigid Kiyad', 'female', 'the boat-headman', 'the boat-master', 'Elder'],
  ['r2r-thorp-41', 'Tianmei Yang', 'female', 'the camp foreman', 'the camp overseer', null],
  ['r2r-hamlet-1', 'Alexei Volkov', 'male', 'the alewife', 'the brewster', null],
  ['r2r-hamlet-43', 'Indira Chatterjee', 'female', 'the headman', 'the chief', null],
  ['r2r-village-2', 'Cveta Klimov', 'female', 'the ferryman', 'the ferry keeper', null],
  ['r2r-town-12', 'Shahd al-Kindi', 'female', 'the front man', 'the nominal owner', null],
  ['r2r-town-15', 'Kyriake Limniotes', 'female', 'the lord', 'the lady', null],
  ['r2r-town-15', 'Alexandros Kurtikios', 'male', 'the madam', 'the keeper of the house', null],
  ['r2r-town-19', 'Bayarmaa Mangghud', 'female', 'the abbot', 'the abbess', null],
  ['r2r-city-2', 'Dong Wu', 'male', 'the district madam', 'the keeper of the houses', null],
  ['r2r-city-3', 'Komnenou Kamytzes', 'female', 'the senior abbot', 'the senior abbess', null],
  ['r2r-city-3', 'Emmanuel Chrysoberges', 'male', 'the foundling-mother', 'the foundling-keeper', null],
]);
/** [seed, name, gender, the title that still prints, the role]. */
const KEEP = Object.freeze([
  ['r2r-village-2', 'Boris Bykov', 'male', 'the midwife', 'the midwife'], // the owner's veto: the word names the work
  ['r2r-village-5', 'Jassim al-Farabi', 'male', 'the ferryman', 'the ferryman'],
  ['r2r-village-27', 'Radbot Klein', 'male', 'the lord', 'the lord'],
  ['r2r-town-19', 'Bayarmaa Önggirad', 'female', 'the madam', 'the madam'],
  ['r2r-hamlet-11', 'Valeria Cicero', 'female', 'the alewife', 'the alewife'],
  ['r2r-city-1', "Ide O'Flaherty", 'female', 'the watch commander', 'Lord Marshal'], // an office's title is the office's
]);

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('TAIL-TITLES K-C · a title in its holder\'s form, on births', () => {
  it('MOVE: the face never prints as the title, the role or a row end of a holder of the other sex', () => {
    const wrong = MOVE.flatMap(([seed, name, gender, face, instead, office]) => {
      const { card, ends } = cardOf(seed, name);
      if (!card) return [`${seed} ${name}: no card`];
      const role = office ?? instead;
      const out = [];
      if (card.gender !== gender) out.push(`${seed} ${name}: gender ${card.gender}`);
      if (card.title !== instead) out.push(`${seed} ${name}: title "${card.title}", not "${instead}"`);
      if (card.role !== role) out.push(`${seed} ${name}: role "${card.role}", not "${role}"`);
      if (card.institution?.title !== face) out.push(`${seed} ${name}: the face "${card.institution?.title}", not "${face}"`);
      for (const word of ends) if (word === face) out.push(`${seed} ${name}: a row end reads "${word}"`);
      return out;
    });
    expect(wrong).toEqual([]);
  }, 300000);
  it('KEEP: a holder of the face\'s own sex, the owner\'s veto and an office keep their word', () => {
    const wrong = KEEP.flatMap(([seed, name, gender, title, role]) => {
      const { card } = cardOf(seed, name);
      if (!card) return [`${seed} ${name}: no card`];
      return card.gender === gender && card.title === title && card.role === role ? [] : [`${seed} ${name}: ${card.gender} "${card.title}" / "${card.role}"`];
    });
    expect(wrong).toEqual([]);
  }, 300000);
});
