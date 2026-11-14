/**
 * display/governingModifierWords.js — THE GOVERNING POWER'S MODIFIER, IN PLAIN WORDS, WHERE THE TOWN BEARS IT OUT
 * (POWERS-13, the bar's HIGH row #272 and P4.8's ww#639, ww#980, pf#1, pf#23).
 *
 * The ruling power's record carries a modifier (`powerStructure.factions[].modifier`, written by
 * `generators/power/rulingStructure.js`): an identifier such as 'mage-advised', drawn from the priority sliders, not
 * from the town's houses. The Power tab printed it raw ("Elder Council (significant) mage-advised") in a village with
 * no mage and no magic house. THE RULING (the chair's brief, 2026-11-14): an identifier is never printed; a modifier
 * prints in plain words only where the town's own record bears it out, else nothing.
 *
 * Each modifier key belongs to one family, and each family names the fact that bears it out, read through the one
 * canonical reader of that fact:
 *   - arcane (arcane-advised, mage-advised): magic functions here and an arcane house stands on the live roster
 *     (the magic homes: `facts/magic.js :: magicOf`, `magicReliance.js :: practisingInstitutions`);
 *   - force (military-dominated, defended, arms-backed): a watch, garrison, militia or hired company stands
 *     (`factsOf(...).guardPresence`);
 *   - faith (theocratic-aligned, church-guided): a sacred house stands (`factsOf(...).sacredHouse`) and the faith's
 *     power does not answer to the seat (no `subordinate` relationship from the ruling power to a religious one);
 *   - commerce (commerce-driven, merchant-led): a live market or a guild stands (`factsOf(...).market`, `.guild`);
 *   - crime (corruption-riddled, compromised): the HALL is in criminal hands, read from the hall's own rung (the stored
 *     `powerStructure.criminalCaptureState`, the rung the Power tab's "Criminal capture" badge and the DM view's hall
 *     line both read: `domain/people/patronage.js :: hallOf`): corrupted or capture. POWERS-15 (REVIEW-POWERS-5 A5, the
 *     chair's ruling of 2026-11-14: two lines on one page read one fact): the town's crime STRUCTURE is not the hall's
 *     standing, and the chip said "criminal sway" beside "Nobody at the head of ... answers to a criminal house". At
 *     none, adversarial and equilibrium the chip is silent (an equilibrium hall with a lesser agent gives the criminals
 *     "a voice": silence beside it is no false sentence, and the chip is never the tell of a hidden allegiance).
 * A key of no family (a key a later writer adds) prints nothing: an identifier is never printed.
 *
 * Read-only; no draw, no write. The stored modifier is left as it is (nothing else reads it but the pages).
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { factsOf } from '../facts/factsOf.js';
import { magicOf } from '../facts/magic.js';
import { practisingInstitutions } from '../magicReliance.js';

/** @typedef {'arcane'|'force'|'faith'|'commerce'|'crime'} ModifierFamily */

/** The writer's modifier keys, each to its family and its plain words. @type {Readonly<Record<string, { family: ModifierFamily, words: string }>>} */
const MODIFIER_WORDS = Object.freeze({
  'arcane-advised': { family: 'arcane', words: 'mage counsel' },
  'mage-advised': { family: 'arcane', words: 'mage counsel' },
  'military-dominated': { family: 'force', words: 'armed sway' },
  defended: { family: 'force', words: 'armed backing' },
  'arms-backed': { family: 'force', words: 'armed backing' },
  'theocratic-aligned': { family: 'faith', words: 'church sway' },
  'church-guided': { family: 'faith', words: 'church guidance' },
  'commerce-driven': { family: 'commerce', words: 'merchant sway' },
  'merchant-led': { family: 'commerce', words: 'merchant sway' },
  'corruption-riddled': { family: 'crime', words: 'criminal sway' },
  compromised: { family: 'crime', words: 'criminal sway' },
});

/** The hall's rungs at which the criminals sway the ruler (dmPowerLines.js :: CAPTURE_RUNG_LABELS: "Partly in criminal hands", "Run by the criminals"). */
const HALL_IN_CRIMINAL_HANDS = new Set(['corrupted', 'capture']);

/** The families' keys, for the guard and the census. @type {ReadonlyArray<string>} */
export const GOVERNING_MODIFIER_KEYS = Object.freeze(Object.keys(MODIFIER_WORDS));

/**
 * Whether the faith's power answers to the seat: a `subordinate` relationship from the ruling power to a religious
 * power (the writer's pair is [the ruling power, the other], `factionDynamics.js`).
 * @param {any} settlement @param {string} rulerName
 */
function faithAnswersToSeat(settlement, rulerName) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const religious = new Set(factions.filter((/** @type {any} */ f) => String(f?.category || '') === 'religious').map(nameOf).filter(Boolean));
  const rels = Array.isArray(ps.factionRelationships) ? ps.factionRelationships : [];
  return rels.some((/** @type {any} */ r) => r?.type === 'subordinate' && Array.isArray(r.pair)
    && r.pair[0] === rulerName && religious.has(r.pair[1]));
}

/**
 * Whether the town's record bears out a family of modifier for its ruling power.
 * @param {any} settlement @param {ModifierFamily} family @param {string} rulerName
 * @returns {boolean}
 */
export function modifierBorneOut(settlement, family, rulerName) {
  const facts = factsOf(settlement);
  if (family === 'arcane') return magicOf(settlement).functions === true && practisingInstitutions(settlement).length > 0;
  if (family === 'force') return Boolean(facts.guardPresence);
  if (family === 'faith') return Boolean(facts.sacredHouse) && !faithAnswersToSeat(settlement, rulerName);
  if (family === 'commerce') return Boolean(facts.market) || Boolean(facts.guild);
  if (family === 'crime') return HALL_IN_CRIMINAL_HANDS.has(String(settlement?.powerStructure?.criminalCaptureState || 'none'));
  return false;
}

/**
 * THE ONE DISPLAY READ: the ruling power's modifier in plain words, or '' where it has none, its key belongs to no
 * family, or the town's record does not bear it out.
 * @param {any} settlement
 * @returns {string}
 */
export function governingModifierWordsOf(settlement) {
  const ruler = governingFactionOf(settlement);
  const key = String(/** @type {any} */ (ruler)?.modifier || '');
  const entry = Object.hasOwn(MODIFIER_WORDS, key) ? MODIFIER_WORDS[key] : null;
  if (!entry) return '';
  return modifierBorneOut(settlement, entry.family, String(nameOf(ruler) || '')) ? entry.words : '';
}

/**
 * The family of a writer's modifier key, or null (for the census of what is stored).
 * @param {unknown} key
 * @returns {ModifierFamily | null}
 */
export function modifierFamilyOf(key) {
  const k = String(key || '');
  return Object.hasOwn(MODIFIER_WORDS, k) ? MODIFIER_WORDS[k].family : null;
}
