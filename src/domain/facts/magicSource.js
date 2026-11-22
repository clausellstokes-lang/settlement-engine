/**
 * domain/facts/magicSource.js — WHERE THE MAGIC THIS PLACE RELIES ON COMES FROM (W2-A-LEAVES, 2026-11-12; census
 * row 3, the chair's ruling: "the Magic tab names where the magic it says the town relies on comes from, read from
 * the leaf; where nothing supplies it, the reliance line does not print").
 *
 * The reliance reading (`magicReliance.js :: deriveMagicReliance`) counts practitioners and dependents; a town
 * can rely on magic with no arcane practitioner on its rolls, because its temples bless the stores or its healers
 * pray. This leaf names the supply, from the record:
 *   • the practitioners (the census `magicPractitioners` reads: `practisingInstitutions`, `isPractisingNpc`), first;
 *   • for each dependent chain that NEEDS magic (`chainNeedsMagic`), the processing houses its row records (the
 *     chain step records only those the roster has);
 *   • for each chain magic HOLDS UP (a `magicNote`, written only by `generators/chainMagicSubstitution.js`), the
 *     houses here of the tradition that wrote the note: `MAGIC_NOTE_TRADITION` classes every note that step can
 *     write, and the tradition's houses are the generator's own table (`data/magicTraditionHouses.js`).
 * Where magic does not work, nothing supplies it.
 *
 * Layer 4 (it reads the cast). Pure: no randomness, no clock, no write.
 */
import { MAGIC_TRADITION_HOUSES } from '../../data/magicTraditionHouses.js';
import { institutionMatchesKeyword } from '../institutions/institutionCategory.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { chainNeedsMagic, isPractisingNpc, magicWorksAt, practisingInstitutions } from '../magicReliance.js';
import { liveHouseOf } from './presence.js';

/** @typedef {'druid'|'divine'|'arcane'|'alchemy'} MagicTradition */

/**
 * Every note `chainMagicSubstitution.js` can write, and the tradition that wrote it (a test reads the step's
 * source and holds this table to every note in it).
 * @type {Readonly<Record<string, MagicTradition>>}
 */
export const MAGIC_NOTE_TRADITION = Object.freeze({
  'Druids call fish and bless the waters': 'druid',
  'Druidic beast-callers attract game to supplement depleted grounds': 'druid',
  'Druidic grain-blessing and water purification sustain brewing': 'druid',
  'Sacred hive-tending and flower-calling maintains honey production': 'druid',
  'Druidic animal husbandry sustains the herd': 'druid',
  'Druidic cultivation supplements depleted farmland': 'druid',
  'Druidic forest management accelerates regrowth and sustainable yield': 'druid',
  'Temple fishing rites improve depleted catch': 'divine',
  'Temple stores supplement grain shortage': 'divine',
  'Blessed stores; divine provision fills the gap': 'divine',
  'Divine healing supplements mundane medicine': 'divine',
  'Conjured game produces fish; minor supplement': 'arcane',
  'Arcane quickening of growth provides minor food supplement': 'arcane',
  'Arcane fabrication provides processed goods from alternative sources': 'arcane',
  'Arcane fabrication and stone-shaping partially offset depleted extraction': 'arcane',
  'Alchemical remedies supplement treatment': 'alchemy',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {});
/** @param {unknown} v @returns {string} */
const str = (v) => (v == null ? '' : String(v).trim());

/**
 * The live houses of one tradition (divine: a house of either of the generator's two divine lists).
 * @param {unknown} settlement @param {MagicTradition} tradition @returns {string[]}
 */
function traditionHouses(settlement, tradition) {
  const keywords = tradition === 'divine'
    ? [...MAGIC_TRADITION_HOUSES.divine, ...MAGIC_TRADITION_HOUSES.divinePriest]
    : MAGIC_TRADITION_HOUSES[tradition];
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .filter((inst) => keywords.some((kw) => institutionMatchesKeyword(/** @type {import('../institutions/institutionCategory.js').InstitutionLike} */ (inst), kw)))
    .map((inst) => str(obj(inst).name))
    .filter(Boolean);
}

/**
 * @typedef {Object} MagicSource
 * @property {string[]} houses  the houses that practise (the practitioner census's houses), then the houses here
 *   that supply a dependent chain's magic, in chain order, once each — every one a ROSTER house's own name (a
 *   chain's catalogue name is resolved to the live house it answers to, `presence.js :: liveHouseOf`, and is
 *   never printed itself: W2-A-LEAVES-2, REVIEW-W2A F2)
 * @property {string[]} people  the people who practise (the practitioner census's people)
 */

/**
 * @param {unknown} settlement the generated record
 * @returns {MagicSource}
 */
export function magicSourceOf(settlement) {
  const rec = obj(settlement);
  if (!settlement || !magicWorksAt({ settlement })) return { houses: [], people: [] };
  const source = /** @type {import('../magicReliance.js').MagicRelianceSource} */ (/** @type {unknown} */ (rec));
  /** @type {string[]} */ const houses = [];
  const add = (/** @type {string} */ name) => { if (name && !houses.includes(name)) houses.push(name); };
  for (const inst of practisingInstitutions(source)) add(str(inst.name) || 'an arcane institution');
  const people = (Array.isArray(rec.npcs) ? rec.npcs : []).filter(isPractisingNpc)
    .map((npc) => str(obj(npc).name) || str(obj(npc).role) || 'a practitioner');
  const chains = obj(rec.economicState).activeChains;
  for (const chain of Array.isArray(chains) ? chains : []) {
    const c = obj(chain);
    if (chainNeedsMagic(c)) {
      // the chain row's own houses: already the matched subset (the chain step records only the processing
      // patterns the roster answers), in the CATALOGUE's words ("Parish churches (10-30)"); each is printed as the
      // roster house it answers to (REVIEW-W2A F2: the catalogue name beside the roster's was one house twice):
      // by name (`presence.js :: liveHouseOf`), else by the catalogue's own keyword join, id-first
      // (`institutionMatchesKeyword`: the pattern "Parish church" is the roster's "Parish churches (2-5)")
      for (const house of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) {
        const here = liveHouseOf(rec, house) || liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (rec))
          .find((inst) => institutionMatchesKeyword(/** @type {import('../institutions/institutionCategory.js').InstitutionLike} */ (inst), str(house)));
        if (here) add(str(obj(here).name));
      }
    }
    const tradition = MAGIC_NOTE_TRADITION[str(c.magicNote)];
    if (tradition) for (const house of traditionHouses(rec, tradition)) add(house);
  }
  return { houses, people };
}
