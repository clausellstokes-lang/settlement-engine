/**
 * domain/facts/guild.js — THE GUILD PRESENCE (CENSUS-4b, the chair's answer 4 to CENSUS-4's
 * question 4: "`institution: guild` is YOURS to home: one composite presence atom `guild` defined
 * ONCE in `factsOf.js`").
 *
 * IS THERE A GUILD HERE? A guild-type institution stands on the LIVE roster, or a guild power sits
 * in the power structure. The two readings are the existing ones, delegated:
 *   - the roster: the institution home's live native names (`institutions.js ::
 *     liveInstitutionNames`, ruin-filtered, access-only rows excluded) read by the word the
 *     generator's own guild detector backstops on (`generators/roleCategory.js :: isCommerceGuild`,
 *     its `institutionMatchesKeyword(inst, 'guild')`; the domain may not import a generator);
 *   - the power structure: the faction names the record already carries
 *     (`powerStructure.factions[].faction`, `factions[].name`), the reading A-14 makes.
 * A criminal guild (a thieves', assassins', beggars' or smugglers' guild) is NEITHER: that is the
 * `organised crime` atom, CENSUS-3b's getter (R-E). The catalogue's `guild` TAG is not read: it
 * marks a trade function (a town crier, a mint, a village scribe), not a guild standing.
 *
 * Pure: no randomness, no clock.
 */
import { liveInstitutionNames, ACCESS_ONLY } from './institutions.js';

/** The word a guild is named by. */
const GUILD_RE = /\bguilds?\b/i;
/** A criminal guild is the crime atom's, never this one. */
const CRIMINAL_GUILD_RE = /\b(?:thie(?:f|ves)|assassin|beggar|smuggler|criminal)/i;

/** @param {unknown} name @returns {boolean} */
const namesGuild = (name) => typeof name === 'string' && GUILD_RE.test(name) && !CRIMINAL_GUILD_RE.test(name);

/**
 * THE ONE READER.
 * @param {any} record a settlement record
 * @returns {boolean}
 */
export function guildOf(record) {
  if (liveInstitutionNames(record).some((n) => !ACCESS_ONLY.test(n) && namesGuild(n))) return true;
  const factions = [
    ...(Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : []),
    ...(Array.isArray(record?.factions) ? record.factions : []),
  ];
  return factions.some((/** @type {any} */ f) => namesGuild(f?.faction) || namesGuild(f?.name));
}
