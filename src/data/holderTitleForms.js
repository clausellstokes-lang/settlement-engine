/**
 * data/holderTitleForms.js — TAIL-TITLES K-C (RECORD-MEASURE-2 k): THE FORM OF A FACE'S WORD BY ITS HOLDER'S DRAWN SEX.
 * A face whose word names a sex ("the ferryman", "the abbot", "the foundling-mother") takes, for a holder of the other
 * sex, the form below: the plain neutral word a reader would not notice where one exists, a pair only where both words
 * are ordinary ("the lord" / "the lady"). A face not listed, and a holder of the face's own sex, keep the face as it is.
 * An office's title (officeTitles.js: Lord Marshal, Lord Mayor …) is the office's, never listed here.
 * Read once, at the mints (people/representatives.js, people/castPowers.js), after every draw the face keys: the card's
 * `title` AND `role` take the form (M-1b: a representative's role IS its institution's title, one word); the card's
 * `institution.title` keeps the registry face, which the honorific, hook and goal tables and the structural ladder key
 * (`faceOfRole`). Pure data, no draw.
 */

/** face → { female?: string, male?: string } the holder's form. @type {Readonly<Record<string, Readonly<{ female?: string, male?: string }>>>} */
export const HOLDER_TITLE_FORMS = Object.freeze({
  // a man's word, for a woman: the neutral word
  'the ferryman': Object.freeze({ female: 'the ferry keeper' }),
  'the boat-headman': Object.freeze({ female: 'the boat-master' }),
  'the headman': Object.freeze({ female: 'the chief' }),
  'the camp foreman': Object.freeze({ female: 'the camp overseer' }),
  'the front man': Object.freeze({ female: 'the nominal owner' }),
  "the newcomers' spokesman": Object.freeze({ female: "the newcomers' speaker" }),
  // a pair, both words ordinary
  'the lord': Object.freeze({ female: 'the lady' }),
  'the abbot': Object.freeze({ female: 'the abbess' }),
  'the senior abbot': Object.freeze({ female: 'the senior abbess' }),
  'the high priest': Object.freeze({ female: 'the high priestess' }),
  // a woman's word, for a man: the neutral word
  'the foundling-mother': Object.freeze({ male: 'the foundling-keeper' }),
  'the alewife': Object.freeze({ male: 'the brewster' }),
  'the madam': Object.freeze({ male: 'the keeper of the house' }),
  'the district madam': Object.freeze({ male: 'the keeper of the houses' }),
});

/** The title a holder of `gender` bears for the face `title`. @param {unknown} title @param {unknown} gender @returns {any} */
export function titleForHolder(title, gender) {
  if (typeof title !== 'string') return title;
  const forms = Object.hasOwn(HOLDER_TITLE_FORMS, title) ? HOLDER_TITLE_FORMS[title] : null;
  const form = forms && (gender === 'female' ? forms.female : gender === 'male' ? forms.male : undefined);
  return form || title;
}

/**
 * The word a role-keyed reader keys on: the card's FACE (`institution.title`) where its role is that face's holder
 * form, else the role as it stands (an office's title on a dual-hat leader, a pool's role). The readers' key is
 * unmoved by the holder's form. @param {unknown} card @returns {any}
 */
export function faceOfRole(card) {
  const c = /** @type {Record<string, any> | null} */ (card && typeof card === 'object' ? card : null);
  const role = c?.role;
  const face = c?.institution?.title;
  if (typeof face !== 'string' || typeof role !== 'string' || role === face) return role;
  const forms = Object.hasOwn(HOLDER_TITLE_FORMS, face) ? HOLDER_TITLE_FORMS[face] : null;
  return forms && (forms.female === role || forms.male === role) ? face : role;
}
