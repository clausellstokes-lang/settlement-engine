/**
 * people/cardDoor.js — THE NPC CARD'S DOOR BACK AND THE FACE'S HONORIFIC (PEOPLE-6 LINKS, the owner's word of 2026-11-07:
 * "that NPC card also has a link to the institution card the NPC belongs to"). Kept apart from
 * cardPowers.js so the print surfaces that read the power line do not take the dossier's id
 * module into their closure: only the web NPC card imports this. Pure, draw-free, total.
 */
import { cardInstitutionOf } from './cardPowers.js';
import { entityIdFor } from '../dossier/entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';
import { honorificOfTitle } from '../../data/faceHonorifics.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
const recordOf = (v) => (v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v) : {});

/**
 * THE CARD'S DOOR BACK (PEOPLE-6 LINKS): where the NPC card's institution line leads, by the
 * dossier's own ids (`entityIdFor('institution', row)` — the id the Institutions card focuses
 * on — and `factionIdFromName(power)` — the id the Power card focuses on). A house face leads to
 * its roster row's card; a MINTED face (kind 'power', no row) leads to its power's card; a card
 * with no institution (a DM's person) has no door. A house whose row the roster no longer holds
 * keeps its name with no target (the link degrades to plain text, as EntityLink does).
 * @param {unknown} card @param {unknown} settlement
 * @returns {{ type: 'institution' | 'faction', id: string, name: string } | null}
 */
export function cardInstitutionDoorOf(card, settlement) {
  const inst = cardInstitutionOf(card);
  if (!inst) return null;
  if (inst.kind === 'power') return { type: 'faction', id: factionIdFromName(inst.name) || '', name: inst.name };
  const roster = recordOf(settlement).institutions;
  const row = (Array.isArray(roster) ? roster : []).find((r) => r && typeof r === 'object' && String(r.name || '') === inst.name);
  return { type: 'institution', id: row ? entityIdFor('institution', row) : '', name: inst.name };
}

/**
 * THE CARD'S HONORIFIC (PEOPLE-6 LINKS step 2): its institution's title through the registry
 * (`src/data/faceHonorifics.js`), the pool's form picked by `<card id>::<institution key>` (stable,
 * zero-draw, the same on every surface), by the card's gender; '' for a card with no institution (a DM's
 * person) — and for a card whose institution the veil or the public projection removed, so the
 * honorific goes wherever the house goes and is never resolved from anything else.
 * @param {unknown} card @returns {string}
 */
export function cardHonorificOf(card) {
  const inst = cardInstitutionOf(card);
  if (!inst) return '';
  const c = recordOf(card);
  return honorificOfTitle(inst.title, c.gender, `${String(c.id || c.name || '')}::${inst.name}`);
}

/**
 * THE FACE'S NAME AS THE INSTITUTION CARD PRINTS IT: "Pastor Robert Thomas" (the honorific, then
 * the full name); the bare name where the card has no honorific.
 * @param {unknown} card @returns {string}
 */
export function faceNameOf(card) {
  const name = String(recordOf(card).name || '');
  const honorific = cardHonorificOf(card);
  return honorific && name ? `${honorific} ${name}` : name;
}
