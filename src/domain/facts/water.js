/**
 * domain/facts/water.js — THE WATER HOME (CENSUS-1 wave 0, fact 4; the design's §1 row "water",
 * Appendix A competing reading 7: five readings, none of them the domain reader).
 *
 * Every reading of "does this place sit on water a boat or a net could use" goes through
 * `tradeRouteSemantics.js :: waterAccessKind(terrain, route)` — the world law's own rule — over the
 * terrain home's chain (`facts/terrain.js`). The answers:
 *   kind      'maritime' (coast, or a port route off a riverside) · 'river' (river route or
 *             riverside) · 'none'
 *   navigable kind !== 'none'
 *   coast / river  the two kinds as booleans
 * A docks institution is not water: it is the institution-presence fact (11).
 *
 * Pure: no randomness, no clock.
 */
import { waterAccessKind } from '../tradeRouteSemantics.js';
import { terrainClassOf, tradeRouteOf } from './terrain.js';

/**
 * THE ONE READER.
 * @param {import('./terrain.js').TerrainRecord} record a settlement record
 * @returns {Readonly<{ kind: 'maritime'|'river'|'none', navigable: boolean, coast: boolean, river: boolean }>}
 */
export function waterOf(record) {
  return waterOfKind(waterAccessKind(terrainClassOf(record), tradeRouteOf(record) || null));
}

/**
 * The answers for a kind the world law already computed with the same rule (a birth in progress:
 * `generationContext.js :: createGenerationWorldLaw`'s `portKind`).
 * @param {'maritime'|'river'|'none'} kind
 * @returns {Readonly<{ kind: 'maritime'|'river'|'none', navigable: boolean, coast: boolean, river: boolean }>}
 */
export function waterOfKind(kind) {
  return Object.freeze({ kind, navigable: kind !== 'none', coast: kind === 'maritime', river: kind === 'river' });
}
