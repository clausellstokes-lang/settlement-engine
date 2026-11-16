/**
 * domain/facts/sovereign.js — THE SOVEREIGN HOME (BAR6-HOUSES, THE CHAIR'S RULING SV1 of 2026-11-16: "THE SOVEREIGN WORDS
 * HAVE ONE ATOM"; vetoable by the owner; new vocabulary). ONE atom, `sovereign`: the record gives the town a sovereign over
 * it, a lord, a liege, an overlord, a crown or a noble's oversight. A line that names one ("Collects the lord's dues", "a
 * charter from crown or lord") presumes it; a free commune, a merchant council or a town that rules itself gives none.
 *
 * WHAT GIVES ONE (SV1's own list; the same words the page law's detector reads, `tests/helpers/pageLaws/law6.mjs ::
 * SOV_FACT`, whole words, so "making" holds no king):
 *   the government (its label and its name), a power (a faction's name), a house (a LIVE house's name: a ruined one gives
 *   nothing), a person (a role or a title), or the founding (the history's founding record);
 *   or a war or an occupation, which supplies the realm's (the second check ruled a war's "crown" true).
 *
 *   sovereignOf(record)   THE ONE READER: true where any of these gives a sovereign; false where none does; `undefined`
 *                         where there is no record object (unanswered: fail-closed)
 *
 * ⚠ READ IT AT THE SETTLED RECORD for a line whose sovereign may come from the powers, the cast or the history (they are
 * born late): a house description is resolved by the late re-read (`institutionDescVariants.js :: DESC_LATE_SIBLINGS`). At
 * a birth draw the record holds its houses and its crisis only, so a declaration drawn there is true only where the line's
 * own house gives the sovereign (a lord's steward's own services).
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/sovereign.test.js
 */
import { activeCrisisTypes, crisisKindOf } from './crisisKind.js';
import { liveInstitutionNames } from './liveInstitutionNames.js';

/** The words that give a sovereign, whole words (the page law's `SOV_FACT`, spelled once here for the source). */
export const SOVEREIGN_WORDS = /\b(lords?|lord's|lordship|noble|nobles|nobility|feudal|baron\w*|duke|duchess|duchy|ducal|crown|royal|king|kings|kingdom|queen|prince|princess|manor|appointee|gentry|liege|seigneur\w*|vassal\w*|steward|castellan|earl|jarl|margrav\w*|governor|reeve|imperial|empire|realm)\b/i;

/** The crisis kinds that supply the realm's sovereign from outside (SV1: "a war or an occupation"). */
export const SOVEREIGN_CRISES = Object.freeze(['wartime', 'occupied']);

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? JSON.stringify(v) : '');

/**
 * THE ONE READER of `sovereign`.
 * @param {any} record a settlement record (at a birth draw: its houses and its crisis; settled: the whole)
 * @returns {boolean | undefined}
 */
export function sovereignOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  if (activeCrisisTypes(record).some((t) => SOVEREIGN_CRISES.includes(String(crisisKindOf(t) ?? t)))) return true;
  const ps = record.powerStructure && typeof record.powerStructure === 'object' ? record.powerStructure : {};
  const sources = [
    text(ps.government), text(ps.governingName),
    ...(Array.isArray(ps.factions) ? ps.factions.map((/** @type {any} */ f) => text(f?.faction)) : []),
    ...liveInstitutionNames(record),
    ...(Array.isArray(record.npcs) ? record.npcs.flatMap((/** @type {any} */ n) => [text(n?.role), text(n?.title)]) : []),
    text(record.history?.founding),
  ];
  return sources.some((s) => s !== '' && SOVEREIGN_WORDS.test(s));
}
