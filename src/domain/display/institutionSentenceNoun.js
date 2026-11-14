/**
 * domain/display/institutionSentenceNoun.js — an institution's catalogue name as a noun
 * that can sit inside a sentence. A pure leaf over the label seam
 * (institutionDisplayName.js), which it calls so a print still goes through the seam.
 * Read by the pulse's power-move lines (worldPulse/factionCompetition.js ::
 * POWER_ACTION_SUMMARY's `{target}`).
 */
import { institutionDisplayName } from './institutionDisplayName.js';

/**
 * An institution's catalogue name as a noun that can sit inside a sentence.
 * ⛔ A CATALOGUE KEY IS NOT A NOUN PHRASE (VISIBLE-BUGS item 3a, 2026-11-12). The power-move
 * lines used to drop the raw key in, first letter lowered: "Control of Cnocby's multiple water
 * sources is passing to Elder Council", "…'s dwellings (15-100)", "…'s parish church" (the last
 * past the label seam every print must go through). Measured on the landing region, seeds
 * lf-001..040: 47 of 121 capture/suppression lines. The noun is now the seam's label, without
 * its count or condition in brackets, without a leading "multiple"/"massive", and the first of
 * a slashed pair ("docks/port facilities" → "docks"); first letter lowered as before. A
 * trade-person key ("Potter") still reads as the person, not their workshop: that table lives
 * with the generators (goals.js PERSON_HOUSE_PLACE) and is reported, not copied.
 * @param {unknown} name the catalogue name @returns {string}
 * @enforced-by tests/domain/worldPulseInstitutionNoun.test.js
 */
export function institutionSentenceNoun(name) {
  const raw = String(name ?? '');
  const noun = String(institutionDisplayName(raw) || raw)
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/^(multiple|massive)\s+/i, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim();
  const said = noun || raw;
  return `${said.charAt(0).toLowerCase()}${said.slice(1)}`;
}
