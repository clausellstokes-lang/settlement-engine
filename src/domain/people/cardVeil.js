/**
 * people/cardVeil.js — THE VEIL BIT'S ONE SOURCE (FIX-PUBLIC-VEIL, 2026-11-07; the chair's ruling,
 * shape (a): "one source for the fact"). Whether a face's house may be named on a public card.
 *
 * The predicate lives HERE and nowhere else: the house classes the gallery veil hides whole (X-21e:
 * criminal by the classifier, clandestine by a declared facet, an illegal brokerage by the catalog —
 * moved byte for byte from `display/galleryVeil.js`, which imports them back) and the powers a minted
 * face may not name (a `hidden` power — the stress infiltrator, "Its presence is not known to the
 * settlement" — or a criminal one). Every writer of a card's `institution` stamps
 * `institution.veiled: true | false` from it AT BIRTH: the representative generator (the house faces
 * and the seat mint), the seam's `other` mints (`generators/people/castPowers.js`), the v1 -> v2 save
 * migration where it builds an `institution`, and the edit layer's reassignment. THE SAME LAW PER
 * ENTRY (the chair's second ruling): every writer of a card's `memberships` — the cast's backing
 * memberships and the mints' (`castPowers.js :: join`), the v1 -> v2 migration, the reassignment —
 * stamps `memberships[].veiled` from the predicate applied to THAT power. The public sanitizer
 * (migration 206) and its client twin (`display/publicSafe.js`) READ the bits and never re-derive them:
 * where `institution.veiled` is false the card's `institution`, `title`, `role` and the memberships
 * stamped false are public; where it is true or ABSENT (a card born before this fix) they are all
 * stripped, and so is every membership whose own bit is true or absent — fail-closed.
 *
 * Pure, draw-free, total over any input.
 */
import { facetOf } from '../spatial/cohesionWeave.js';
import { brokerageLegalityOf } from '../../data/informationBrokerageTuning.js';
import { nameOf } from '../rulingPower.js';
import { sha256Hex } from '../content/contentFingerprint.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {unknown} v @returns {Rec} */
const recordOf = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});

/**
 * Criminal by the classifier: the house's `category` or `priorityCategory` is `criminal`.
 * @param {Rec} inst @returns {boolean}
 */
export function isCriminalInstitution(inst) {
  return str(inst.category).toLowerCase() === 'criminal' || str(inst.priorityCategory).toLowerCase() === 'criminal';
}

/**
 * The declared clandestine/hidden flags the data carries, read through the ONE facet
 * chokepoint (cohesionWeave.js facetOf): the catalog's `clandestine` kind, the custom
 * `institutionFunction: 'clandestine'` spelling, and the `subterranean` kind (the
 * catalog's underground network, catacomb sanctuary and black-market bazaar rows).
 * @param {Rec} inst @returns {boolean}
 */
export function isClandestineInstitution(inst) {
  return facetOf(inst, 'clandestine') === 'clandestine'
    || facetOf(inst, 'institutionFunction') === 'clandestine'
    || facetOf(inst, 'subterranean') === 'subterranean';
}

/**
 * X-21e: the one class of house that may be hidden whole. Criminal by the classifier
 * category, clandestine by a declared facet, or an illegal brokerage by the catalog.
 * @param {Rec} inst @returns {boolean}
 */
export function isHideableHouse(inst) {
  return isCriminalInstitution(inst) || isClandestineInstitution(inst) || brokerageLegalityOf(inst) === 'illegal';
}

/**
 * A power a minted face may not name publicly: `hidden: true` (the stress infiltrator) or criminal.
 * @param {unknown} power @returns {boolean}
 */
export function isVeiledPower(power) {
  const p = recordOf(power);
  return p.hidden === true || str(p.category).toLowerCase() === 'criminal';
}

/**
 * The veil bit of a card's `institution` against the record that carries it: a house face is veiled
 * when its roster row is hideable, a minted face when its power is veiled. A house or power the record
 * does not hold is veiled (fail-closed: nothing is known to make it public).
 * @param {unknown} institution the card's `{ kind, key, ... }`
 * @param {unknown} settlement anything carrying `institutions` and `powerStructure.factions`
 * @returns {boolean}
 */
export function veiledOfInstitution(institution, settlement) {
  const inst = recordOf(institution);
  const key = str(inst.key);
  const s = recordOf(settlement);
  if (inst.kind === 'house') {
    const rows = Array.isArray(s.institutions) ? s.institutions : [];
    const row = rows.find((r) => str(recordOf(r).name) === key);
    return row ? isHideableHouse(recordOf(row)) : true;
  }
  if (inst.kind === 'power') {
    const powers = recordOf(s.powerStructure).factions;
    const row = (Array.isArray(powers) ? powers : []).find((f) => nameOf(f) === key);
    return row ? isVeiledPower(row) : true;
  }
  return true;
}

/**
 * The veil bit of one MEMBERSHIP (the chair's ruling of 2026-11-07, the same law per entry): the
 * predicate applied to THAT power on the record. A power the record does not hold is veiled.
 * @param {unknown} power the power's name @param {unknown} settlement @returns {boolean}
 */
export function veiledOfPower(power, settlement) {
  const powers = recordOf(recordOf(settlement).powerStructure).factions;
  const row = (Array.isArray(powers) ? powers : []).find((f) => nameOf(f) === str(power));
  return row ? isVeiledPower(row) : true;
}

/**
 * A card's memberships, each with its veil bit stamped (new objects; `veiled` last). Not an array:
 * returned as it is.
 * @template T @param {T} memberships @param {unknown} settlement @returns {T}
 */
export function stampMembershipsVeil(memberships, settlement) {
  if (!Array.isArray(memberships)) return memberships;
  return /** @type {T} */ (memberships.map((m) => {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return m;
    const { veiled: _old, ...rest } = /** @type {Rec} */ (m);
    return { ...rest, veiled: veiledOfPower(rest.power, settlement) };
  }));
}

/**
 * The card's `institution` with its veil bit stamped (a new object; `veiled` last). A non-record
 * (null, a DM's person) is returned as it is: there is no house to veil.
 * @template T @param {T} institution @param {unknown} settlement @returns {T}
 */
export function stampVeil(institution, settlement) {
  if (!institution || typeof institution !== 'object' || Array.isArray(institution)) return institution;
  const { veiled: _old, ...rest } = /** @type {Rec} */ (institution);
  return /** @type {T} */ ({ ...rest, veiled: veiledOfInstitution(institution, settlement) });
}

/** The prefix of a veiled face's opaque card id (FIX-PUBLIC-VEIL, the second seat). */
export const VEILED_CARD_PREFIX = 'npc_veiled_';

/**
 * A VEILED face's card id, minted at birth (the chair's ruling of 2026-11-08, option (B)): the house's
 * slug would name the house on every public payload (`npc_thieves_guild_chapter`), so a face this
 * module veils is born `npc_veiled_` + 16 hex of sha256(`<record seed>|<slug>`). The salt is the
 * record's `_seed`, which every public projection denies (publicSafe.js, the SQL allowlist), so the
 * digest cannot be reversed by hashing the catalogue's slugs. Stable for a seed: a regeneration of
 * the same seed reproduces it. The caller's uniqueness guard suffixes a collision, as for any id.
 * @param {unknown} seed the record's `_seed` @param {string} slug the house's (or power's) slug
 * @returns {string}
 */
export function veiledCardIdFor(seed, slug) {
  return `${VEILED_CARD_PREFIX}${sha256Hex(`${String(seed ?? '')}|${slug}`).slice(0, 16)}`;
}

// THE READER lives beside the card's house reader in cardPowers.js (the leaf the public projection
// imports); re-exported here so the predicate's module names every veil fact.
export { cardInstitutionVeilOf, isHousePublic, publicMembershipsOf } from './cardPowers.js';
