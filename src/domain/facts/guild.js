/**
 * domain/facts/guild.js — THE GUILD PRESENCE (CENSUS-4b, the chair's answer 4 to CENSUS-4's
 * question 4: "`institution: guild` is YOURS to home: one composite presence atom `guild` defined
 * ONCE in `factsOf.js`").
 *
 * IS THERE A GUILD HERE? A guild-type institution stands on the LIVE roster, or a guild power sits
 * in the power structure. The two readings are the existing ones, delegated:
 *   - the roster: the live roster (`institutions/institutionRoster.js :: liveInstitutions`,
 *     ruin-filtered, access-only rows excluded) read by THE ONE GUILD READER,
 *     `institutions/institutionCategory.js :: isCommerceGuild` — the same function that drives the
 *     generator's guild master (CENSUS-4c, the chair's answer 3: the regex this home first carried
 *     was a second reader of one fact; the detector moved into the domain and the generator
 *     re-exports it). Byte-identity: the atom agrees with the regex home on all 525 golden
 *     configurations and the soak's sixty (303 of 585 hold a guild; 0 disagree);
 *   - the power structure: the faction names the record already carries
 *     (`powerStructure.factions[].faction`, `factions[].name`), the reading A-14 makes.
 * A criminal guild (a thieves', assassins', beggars' or smugglers' guild) is NEITHER: that is the
 * `organised crime` atom, CENSUS-3b's getter (R-E). The catalogue's `guild` TAG is read, because
 * the guild-master generator reads it: one definition, the house the generator crews as a guild.
 *
 * Pure: no randomness, no clock.
 */
import { ACCESS_ONLY } from './institutions.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { isCommerceGuild } from '../institutions/institutionCategory.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';

/** The word a guild POWER is named by (the power structure carries names, not catalogue rows). */
const GUILD_RE = /\bguilds?\b/i;
/** A criminal guild power is the crime atom's, never this one. */
const CRIMINAL_GUILD_RE = /\b(?:thie(?:f|ves)|assassin|beggar|smuggler|criminal)/i;

/** @param {unknown} name @returns {boolean} */
const namesGuild = (name) => typeof name === 'string' && GUILD_RE.test(name) && !CRIMINAL_GUILD_RE.test(name);

/**
 * THE ONE READER.
 * @param {{
 *   institutions?: unknown,
 *   powerStructure?: { factions?: unknown } | null,
 * } | null | undefined} record a settlement record
 * @returns {boolean}
 */
export function guildOf(record) {
  const roster = liveInstitutions(record)
    .filter((/** @type {unknown} */ inst) => !ACCESS_ONLY.test(String(nativeSemanticName(inst) || '')));
  if (roster.some(isCommerceGuild)) return true;
  // MERGE-CAR: the powers alone — the NPC grouping `record.factions` is no longer built (PEOPLE-LAND M-2, the
  // shim out), and its names were the powers' own, so reading the powers reads every name it held.
  const factions = Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : [];
  return factions.some((/** @type {{ faction?: unknown, name?: unknown } | null | undefined} */ f) => namesGuild(f?.faction) || namesGuild(f?.name));
}
