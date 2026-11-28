/**
 * domain/voices/cardIds.js — A CARD'S STABLE ID, the one spelling the plan and every surface's slot share (S-G1; the
 * chair's ruling E28 point 7). A person `npc.id`; the crisis its page section's id (`crisis.<type>`); an institution its
 * catalogue id where it has one, else its name; a power its roster key; a tension its `type`; a tradition its stored id
 * once the town is lit, else its element and act. A light leaf: a surface's card may import it on the first paint.
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */
import { factionIdFromName } from '../../lib/entities.js';

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.trim() : '');

/** @param {{ catalogId?: unknown, name?: unknown } | null | undefined} inst @returns {string} */
export const institutionCardId = (inst) => str(inst?.catalogId) || str(inst?.name);
/** @param {unknown} name the power's roster name @returns {string} */
export const powerCardId = (name) => (str(name) ? factionIdFromName(str(name)) || str(name) : '');
/** @param {{ type?: unknown } | null | undefined} tension @returns {string} */
export const tensionCardId = (tension) => str(tension?.type);
/**
 * @param {{ id?: unknown, coreMotif?: { element?: unknown, act?: unknown } | null } | null | undefined} rec
 * @param {boolean} lit the town's traditions are its lit mirror (not the founding preview)
 * @returns {string}
 */
export const traditionCardId = (rec, lit) => (lit && str(rec?.id) ? str(rec?.id) : `${str(rec?.coreMotif?.element)}.${str(rec?.coreMotif?.act)}`);
/** @param {{ id?: unknown } | null | undefined} section a crisis page section @returns {string} */
export const crisisCardId = (section) => str(section?.id);
/** @param {{ id?: unknown } | null | undefined} npc @returns {string} */
export const personCardId = (npc) => str(npc?.id);
