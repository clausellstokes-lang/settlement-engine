/**
 * domain/facts/terrain.js — THE TERRAIN-CLASS HOME (CENSUS-1 wave 0, fact 13; the design's §1 row
 * "terrain class": a raw field read through two different fallback chains).
 *
 * ONE chain: `config.terrainType` (the resolved terrain the pipeline writes, `resolveConfig.js`)
 * → `config.terrainOverride` (the panel's key) → a top-level `terrain` (legacy records) →
 * `resourceAnalysis.terrain`. The trade route is read beside it: `config.tradeRouteAccess` → a
 * top-level `tradeRouteAccess`. Both are the strings the record carries, lower-cased, '' when
 * absent.
 *
 * Pure: no randomness, no clock.
 */

/**
 * The fields the terrain and trade-route chains read; every leaf is a string the record may carry.
 * @typedef {{
 *   config?: { terrainType?: unknown, terrainOverride?: unknown, tradeRouteAccess?: unknown } | null,
 *   terrain?: unknown,
 *   resourceAnalysis?: { terrain?: unknown } | null,
 *   tradeRouteAccess?: unknown,
 * } | null | undefined} TerrainRecord
 */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.toLowerCase() : '');

/**
 * THE ONE READER of the terrain class.
 * @param {TerrainRecord} record a settlement record
 * @returns {string} e.g. 'plains' · 'hills' · 'forest' · 'riverside' · 'coastal' · 'mountain' · 'desert', or ''
 */
export function terrainClassOf(record) {
  return str(record?.config?.terrainType ?? record?.config?.terrainOverride ?? record?.terrain ?? record?.resourceAnalysis?.terrain);
}

/**
 * The record's trade route, the same way.
 * @param {TerrainRecord} record
 * @returns {string} e.g. 'road' · 'river' · 'port' · 'crossroads' · 'isolated' · 'mountain_pass', or ''
 */
export function tradeRouteOf(record) {
  return str(record?.config?.tradeRouteAccess ?? record?.tradeRouteAccess);
}
