/**
 * npcDisplayNames.js
 *
 * Draw-free display-identity reconciliation for generated NPC rosters.
 */

import { cardInstitutionVeilOf } from '../domain/people/cardPowers.js';

/**
 * THE VEILED CARD'S EPITHETS (FIX-PUBLIC-VEIL, the chair's ruling of 2026-11-08, finding (b); the
 * lane's one authored token, written in its record for the OWNER'S VETO). A veiled card's house is
 * not public, so its name may not carry its title as the collision qualifier ("Christophoros Laskaris
 * (the network's head)" printed the hidden house's title on every public tie and sentence that names
 * him). A veiled card that collides takes an AGE EPITHET instead, by its rank among the colliding
 * cards in BIRTH ORDER (a generated card holds no age) — appended where the title was: two take "the Elder" / "the Younger"; three or more "the Eldest", "the Elder", "the
 * Younger", then "the Younger II", "the Younger III", …. An unveiled card keeps its title qualifier.
 */
export const VEILED_NAME_EPITHETS = Object.freeze(['the Eldest', 'the Elder', 'the Younger']);

/**
 * The epithet of the card at `rank` (0 = eldest) among `size` colliding cards.
 * @param {number} rank @param {number} size @returns {string}
 */
export function veiledEpithetFor(rank, size) {
  if (size <= 2) return rank === 0 ? VEILED_NAME_EPITHETS[1] : VEILED_NAME_EPITHETS[2];
  if (rank < 3) return VEILED_NAME_EPITHETS[rank];
  return `${VEILED_NAME_EPITHETS[2]} ${ROMAN_ORDINALS[rank - 2] || String(rank - 1)}`;
}

/** @param {unknown} npc @returns {boolean} a card whose house record is veiled (stamped true or unstamped) */
const isVeiledCard = (npc) => cardInstitutionVeilOf(npc) === 'veiled';

const ROMAN_ORDINALS = [
  'I', 'II', 'III', 'IV', 'V',
  'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV',
  'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
];

/**
 * Make duplicate NPC display names unambiguous without drawing another random
 * name or removing either character.
 *
 * Exact name collisions are rare but consequential: relationship prose and
 * entity pickers otherwise present two different IDs as the same person. A
 * role qualifier is both human-readable and stable. When colliding characters
 * also share a role (for example, two rival Council Members), Roman ordinals
 * keep every display name distinct.
 */
export const disambiguateNPCDisplayNames = npcs => {
  const normalizedName = npc => String(npc?.name || '').trim().toLowerCase();
  const normalizedRole = npc => String(npc?.role || 'local figure').trim().toLowerCase();
  const nameCounts = new Map();
  const roleCountsByName = new Map();

  for (const npc of npcs || []) {
    const nameKey = normalizedName(npc);
    const roleKey = normalizedRole(npc);
    nameCounts.set(nameKey, (nameCounts.get(nameKey) || 0) + 1);
    if (!roleCountsByName.has(nameKey)) roleCountsByName.set(nameKey, new Map());
    const roleCounts = roleCountsByName.get(nameKey);
    roleCounts.set(roleKey, (roleCounts.get(roleKey) || 0) + 1);
  }

  // FIX-PUBLIC-VEIL: each colliding card's rank among its namesakes, for the veiled card's epithet. The
  // chair ruled "by the two cards' ages where the record holds them, else by birth order"; a generated card
  // holds no age (measured: no `age` on any card of the 525 or the 1,000), so the rank is BIRTH ORDER.
  /** @type {Map<string, unknown[]>} */
  const groups = new Map();
  for (const npc of npcs || []) {
    const nameKey = normalizedName(npc);
    if ((nameCounts.get(nameKey) || 0) < 2) continue;
    if (!groups.has(nameKey)) groups.set(nameKey, []);
    groups.get(nameKey).push(npc);
  }
  /** @type {Map<unknown, number>} */
  const rankOf = new Map();
  for (const group of groups.values()) {
    group.forEach((n, rank) => rankOf.set(n, rank));
  }

  const roleOccurrences = new Map();
  return (npcs || []).map(npc => {
    const nameKey = normalizedName(npc);
    if ((nameCounts.get(nameKey) || 0) < 2) return npc;
    if (isVeiledCard(npc)) {
      return { ...npc, name: `${String(npc.name).trim()} ${veiledEpithetFor(rankOf.get(npc) ?? 0, nameCounts.get(nameKey) || 2)}` };
    }

    const role = String(npc.role || 'Local Figure').trim() || 'Local Figure';
    const roleKey = normalizedRole(npc);
    const occurrenceKey = `${nameKey}::${roleKey}`;
    const occurrence = (roleOccurrences.get(occurrenceKey) || 0) + 1;
    roleOccurrences.set(occurrenceKey, occurrence);

    const repeatedRole = (roleCountsByName.get(nameKey)?.get(roleKey) || 0) > 1;
    const ordinal = ROMAN_ORDINALS[occurrence - 1] || String(occurrence);
    const qualifier = repeatedRole ? `${role} ${ordinal}` : role;
    return { ...npc, name: `${String(npc.name).trim()} (${qualifier})` };
  });
};
