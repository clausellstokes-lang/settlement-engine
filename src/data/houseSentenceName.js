/**
 * data/houseSentenceName.js — A HOUSE'S LABEL AS IT SITS INSIDE A SENTENCE (BAR7-DESKS, LAW 5's `5x.slash` of BRIEF-BAR7
 * item 8; the REVIEW-BAR-6 row C25601; vetoable by the owner, the words the owner's). A pure leaf (no imports), the
 * sibling of `data/people/powerSentenceName.js` (the powers' prose forms, POWERS-16): the roster's label is untouched;
 * a sentence that names the house takes its prose form.
 *
 * WHY. The economy desk fills `{institution}` with the roster label as stored, so a slash label stood as a sentence's
 * subject beside a singular verb and "its" ("Jómsmo's Weavers/Textile workers can offer less the longer its supplies stay
 * short", 38 instances in the census's 720). EVERY FORM IS SINGULAR AND TAKES A CAPITAL, so the desk's own verbs ("is
 * open", "can offer less", "has what it needs") and its pronoun ("its supplies") agree with it, and the desk's proper
 * fill (`economyStateProse.js :: properFill`) still reads it as a name.
 *
 * THE TWELVE: every slash label the estate authors (the static half of BAR7-AUDIT-I, `I.static.txt`, and its writers):
 * `data/institutionalCatalog.js` (four houses), `generators/steps/cascadePass.js` (the docks), `data/resourceData.js`
 * (three), `data/economicData.js` (two), `data/geographyData.js` (one), `generators/power/stressFactions.js` (one). A label
 * that is not a house's never reaches `{institution}` today; it takes a form all the same, so a writer that one day hands
 * it there prints a name, never a slash.
 * @enforced-by tests/domain/bar7DesksLines.test.js
 */

/** @type {Readonly<Record<string, string>>} */
export const HOUSE_PROSE_FORMS = Object.freeze({
  'Weavers/Textile workers': 'Weaving house',
  'Palace/government complex': 'Palace',
  'Small prison/stocks': 'Prison',
  'Colosseum/arena': 'Arena',
  'Docks/port facilities': 'Harbour',
  'Sage/library': 'Library',
  'Spa/healing house': 'Healing house',
  'Hot Springs / Healing Waters': 'Healing spring',
  'Livestock / game': 'Livestock',
  'Wool / flax': 'Wool',
  'Desert/Arid': 'Desert',
  'Monster Hunters / Adventurers': "Hunters' lodge",
});

/**
 * The house's name as a sentence takes it: its prose form where the label is one of the twelve, else the label as given.
 * @param {unknown} label @returns {string}
 */
export function houseSentenceName(label) {
  const raw = String(label ?? '').trim();
  return Object.hasOwn(HOUSE_PROSE_FORMS, raw) ? HOUSE_PROSE_FORMS[raw] : raw;
}
