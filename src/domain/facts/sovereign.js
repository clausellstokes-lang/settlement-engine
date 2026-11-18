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
 * @enforced-by tests/domain/bar6HousesSovereign.test.js
 */
// IMPORT-FREE ON PURPOSE (the chair's EG1): factsOf reaches this leaf, and the build places it in eager engine-core, so
// it imports nothing: crisisKind.js is pinned lazy and liveInstitutionNames.js is excised to a lazy chunk (a fresh build
// read its import as an engine-core -> lazy edge, tests/build/vendorPdfLazy.test.js). The two readings are spelled here as
// their homes spell them: the stress container (`canonicalAccessors.js :: canonStressors`) and the live roster's native
// names (`liveInstitutionNames.js`, `institutionRoster.js :: isLiveInstitution`, `customContentSemanticAuthority.js`).
/**
 * The record's slices this home reads, as stored (each read defensively; CLOSE-SWEEP S1, the any-casts typed):
 * @typedef {{
 *   stressors?: unknown, stress?: unknown, stresses?: unknown, institutions?: unknown, npcs?: unknown,
 *   powerStructure?: { government?: unknown, governingName?: unknown, factions?: unknown } | null,
 *   history?: { founding?: unknown } | null,
 * }} SovereignRecord
 * @typedef {{ type?: unknown } | string | number | boolean | null | undefined} StressEntry an entry of the stress container (a stored value; an object is read for its type)
 * @typedef {{ name?: unknown, status?: unknown, _worldPulseInactive?: unknown, isCustom?: unknown, custom?: unknown, source?: unknown, customDefinitionId?: unknown, customDefinitionCategory?: unknown }} RosterHouse a house of the record's `institutions`
 * @typedef {{ faction?: unknown } | null | undefined} SovereignPower a power of `powerStructure.factions`
 * @typedef {{ role?: unknown, title?: unknown } | null | undefined} SovereignPerson a person of the record's `npcs`
 */
/** The words that give a sovereign, whole words (the page law's `SOV_FACT`, spelled once here for the source). */
export const SOVEREIGN_WORDS = /\b(lords?|lord's|lordship|noble|nobles|nobility|feudal|baron\w*|duke|duchess|duchy|ducal|crown|royal|king|kings|kingdom|queen|prince|princess|manor|appointee|gentry|liege|seigneur\w*|vassal\w*|steward|castellan|earl|jarl|margrav\w*|governor|reeve|imperial|empire|realm)\b/i;

/** The crisis kinds that supply the realm's sovereign from outside (SV1: "a war or an occupation"). */
export const SOVEREIGN_CRISES = Object.freeze(['wartime', 'occupied']);
/** Those kinds as the stress container may type them: the kind, or its pulse type (`stressorPicker.js :: GEN_TO_PULSE_TYPE`). */
const SOVEREIGN_TYPES = Object.freeze([...SOVEREIGN_CRISES, 'occupation']);

/** The stress container as stored (`canonStressors`'s order). @param {SovereignRecord} r @returns {StressEntry[]} */
const stressorsOf = (r) => {
  for (const c of [r.stressors, r.stress, r.stresses]) if (Array.isArray(c)) return c;
  if (r.stressors && typeof r.stressors === 'object') return [r.stressors];
  if (r.stress && typeof r.stress === 'object') return [r.stress];
  return [];
};
/** A ruined, removed, destroyed or remnant house gives nothing (`isLiveInstitution`). */
const INACTIVE_STATUS = new Set(['ruined', 'removed', 'destroyed', 'remnant']);
/** The live roster's native names: a custom house names nothing native (`nativeSemanticName`). @param {SovereignRecord} r @returns {string[]} */
const liveNamesOf = (r) => (Array.isArray(r.institutions) ? r.institutions : [])
  .filter((/** @type {RosterHouse | null | undefined} */ i) => !!i && typeof i === 'object' && i._worldPulseInactive !== true && !INACTIVE_STATUS.has(String(i.status || 'active').toLowerCase()))
  .filter((/** @type {RosterHouse} */ i) => !(i.isCustom === true || i.custom === true || i.source === 'custom' || typeof i.customDefinitionId === 'string' || typeof i.customDefinitionCategory === 'string'))
  .map((/** @type {RosterHouse} */ i) => String(i.name || '')).filter(Boolean);

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? JSON.stringify(v) : '');

/**
 * THE ONE READER of `sovereign`.
 * @param {SovereignRecord | null | undefined} record a settlement record (at a birth draw: its houses and its crisis; settled: the whole)
 * @returns {boolean | undefined}
 */
export function sovereignOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  if (stressorsOf(record).some((/** @type {StressEntry} */ e) => !!e && typeof e === 'object' && SOVEREIGN_TYPES.includes(String(e.type)))) return true;
  const ps = record.powerStructure && typeof record.powerStructure === 'object' ? record.powerStructure : {};
  const sources = [
    text(ps.government), text(ps.governingName),
    ...(Array.isArray(ps.factions) ? ps.factions.map((/** @type {SovereignPower} */ f) => text(f?.faction)) : []),
    ...liveNamesOf(record),
    ...(Array.isArray(record.npcs) ? record.npcs.flatMap((/** @type {SovereignPerson} */ n) => [text(n?.role), text(n?.title)]) : []),
    text(record.history?.founding),
  ];
  return sources.some((s) => s !== '' && SOVEREIGN_WORDS.test(s));
}
