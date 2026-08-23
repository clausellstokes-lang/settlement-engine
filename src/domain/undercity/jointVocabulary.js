/**
 * undercity/jointVocabulary.js — THE CLOSED JOINT VOCABULARY of the underground layer, as DATA.
 *
 * ODQ §311.9.2(iii): a cross-posture link takes the stricter side's TYPED JOINT — "grate, stair,
 * sealed door, sluice, breach — the portal vocabulary extended underground". The vocabulary is
 * UC-5's LAW (the connectivity graph), but its data module is minted by UC-0, the first car of
 * the train (charter J-R2-2, ratified ODQ §445.2): every component row from UC-3 onward carries
 * a geometry-free `surfaceJoins[]` (ODQ §441.5(b) — a joint kind + the anchoring SURFACE feature
 * it joins through: church stair, well-house, sewer grate, cellar door), and UC-5 lands LAST.
 * One data module, imported everywhere, so no car hardcodes the strings (a second truth) and no
 * car depends on an unbuilt one.
 *
 * TEMPERAMENTS is the other closed enum every component row carries (§311.8.2, §441.5(b)): the
 * four temperaments are closed vocabulary — STATIC terrain fact · MONOTONE excavation ·
 * SURFACE_COUPLED infrastructure · DEMAND_DRIVEN colonization. "Every future component declares
 * one temperament."
 *
 * FINITE SEMANTICS: frozen, closed, no logic beyond membership. Zero-import. PURITY: no clock, no
 * ambient randomness, no locale read; nothing here is drawn, dated or tuned. Geometry (the DRAWN
 * joint) is D3a/D5 fabric work — not this module.
 */

/** @typedef {'grate'|'stair'|'sealed_door'|'sluice'|'breach'} JointKind */
/** @typedef {'STATIC'|'MONOTONE'|'SURFACE_COUPLED'|'DEMAND_DRIVEN'} Temperament */

/** The five typed joints, in the doctrine's own order. @type {ReadonlyArray<JointKind>} */
export const JOINT_KINDS = Object.freeze(/** @type {JointKind[]} */ (['grate', 'stair', 'sealed_door', 'sluice', 'breach']));

/** The four temperaments, in the doctrine's own order (§311.8.2 a–d). @type {ReadonlyArray<Temperament>} */
export const TEMPERAMENTS = Object.freeze(/** @type {Temperament[]} */ (['STATIC', 'MONOTONE', 'SURFACE_COUPLED', 'DEMAND_DRIVEN']));

/** Membership test for the closed joint vocabulary. @param {unknown} v @returns {v is JointKind} */
export function isJointKind(v) {
  return typeof v === 'string' && JOINT_KINDS.includes(/** @type {JointKind} */ (v));
}

/** Membership test for the closed temperament vocabulary. @param {unknown} v @returns {v is Temperament} */
export function isTemperament(v) {
  return typeof v === 'string' && TEMPERAMENTS.includes(/** @type {Temperament} */ (v));
}
