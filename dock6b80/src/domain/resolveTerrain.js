/**
 * domain/resolveTerrain.js — the ONE terrain read.
 *
 * The engine persists resolved terrain as `config.terrainType`
 * (generators/steps/resolveConfig.js). Older saves may instead carry
 * `config.terrainOverride` — but 'auto' is a UI sentinel, not a terrain
 * (resolveConfig persists it verbatim when the route isn't random_trade).
 * `config.terrain` was never written by any generator path; it survives only
 * on hand-built fixtures and imported configs, so it stays as the last link.
 *
 * Canonical vocabulary (getTerrainType + wizard overrides):
 *   plains | hills | forest | riverside | coastal | mountain | desert
 *
 * Every terrain read goes through here. Scattering this chain across call
 * sites is how the simulation layer ended up reading the never-written
 * `config.terrain` for years — the shelter and fortification heuristics
 * silently no-oped for every wizard-generated settlement.
 */

/**
 * Guard a single already-extracted terrain value against the 'auto' UI
 * sentinel. For values that bypass the config chain — e.g. the gallery facet
 * column, whose server snapshot (migrations 063/071) coalesces
 * config.terrainOverride verbatim, so legacy rows can store the sentinel.
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function terrainOrNull(value) {
  return value && value !== 'auto' ? value : null;
}

/**
 * Resolve the terrain of a settlement config. Pure read.
 * Postcondition: never returns the 'auto' sentinel — the engine only writes
 * it to terrainOverride, but imported/hand-built configs can carry it in any
 * leg, so every leg is guarded.
 * @param {{ terrainType?: string|null, terrainOverride?: string|null, terrain?: string|null }|null|undefined} config
 * @returns {string|null} the resolved terrain, or null when the config carries none.
 */
export function resolveTerrain(config) {
  const cfg = config || {};
  return terrainOrNull(cfg.terrainType)
    || terrainOrNull(cfg.terrainOverride)
    || terrainOrNull(cfg.terrain)
    || null;
}

/**
 * Resolve terrain from a settlement OR a snapshot item wrapping one
 * (`{ settlement }`, as worldPulse snapshot items do). Tries the config chain
 * first, then the legacy top-level `terrain` some imported dossiers carry,
 * then the planned-but-unbuilt `geography.terrain` (kept so the normalize
 * migration can land without touching readers).
 * @param {any} settlementOrItem
 * @returns {string|null}
 */
export function resolveSettlementTerrain(settlementOrItem) {
  const s = settlementOrItem?.settlement || settlementOrItem || {};
  return resolveTerrain(s.config)
    || terrainOrNull(s.terrain)
    || terrainOrNull(s.geography?.terrain)
    || null;
}
