/**
 * domain/normalizeSettlement.js — Compatibility adapter between the
 * legacy settlement shape and the canonical schema in settlement.schema.js.
 *
 * Design contract:
 *
 *   - Pure function. No mutation of input. Returns a new object.
 *   - Idempotent: normalize(normalize(s)) === normalize(s) for all valid s.
 *   - Tolerant: missing fields default to safe values; unknown fields pass
 *     through untouched (forward compatibility).
 *   - Lossless on round-trip with `denormalizeSettlement`: any field that
 *     gets renamed in `normalize` is restored to its legacy alias by the
 *     reverse adapter, so legacy consumers keep reading the same field.
 *   - Cheap. This runs at save / load / PDF / AI boundaries. O(n) over
 *     settlement size, no deep traversal of nested generator output.
 *
 * Current behavior:
 *
 *   1. Stamps version fields if absent (schemaVersion, simulationVersion,
 *      generatorVersion). Existing values are preserved — never overwritten.
 *
 *   2. Stamps `id` if absent. Deterministic from `_seed` when available
 *      (so the same seed always produces the same id); falls back to a
 *      random uuid-like for non-seeded settlements.
 *
 *   3. Resolves duplicate field names (FIELD_ALIASES from the schema
 *      file). For `stressors`, reads from any of `stressors / stress /
 *      stresses` and writes the unified value to `stressors`. Legacy
 *      aliases are PRESERVED, not deleted, so any code still reading the
 *      old name keeps working. `stressTypes` is DELIBERATELY NOT an alias
 *      — it holds type STRINGS, not stressor objects; see the exclusion
 *      rationale on FIELD_ALIASES in settlement.schema.js. Do not add it.
 *
 *   4. Defaults canonical containers that future consumers expect:
 *      `activeConditions`, `simulationTrace`, `aiOverlays` default to
 *      empty arrays if absent. `userCanon` defaults to {}.
 *
 *   5. Does NOT yet restructure into the nested target shape
 *      (`identity`, `geography`, etc.). That migration is deferred until
 *      consumers are ready in a future iteration. Today the adapter is
 *      purely additive — every legacy field stays where it is.
 *
 * Future behavior (deferred):
 *   - Lift name/tier/culture/genre into `identity` substructure.
 *   - Promote `spatialLayout.terrain`, `resourceAnalysis.terrain`, and
 *     `config.terrain` into a unified `geography`.
 *   - Schema-version-aware migrations for v1→v2 etc.
 */

import {
  SCHEMA_VERSION,
  SIMULATION_VERSION,
  GENERATOR_VERSION,
  FIELD_ALIASES,
} from './settlement.schema.js';
import { migrateSettlementToLatest } from './settlementMigrations.js';

/**
 * Hash a seed string into a stable, opaque id. Same seed → same id.
 * Not cryptographically strong — just a deterministic short identifier
 * that survives reruns of the same seed.
 * @param {any} seed
 */
function idFromSeed(seed) {
  const s = String(seed);
  let h1 = 0x811c9dc5; // FNV-1a 32-bit offset basis
  for (let i = 0; i < s.length; i++) {
    h1 ^= s.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  // 8 hex chars from h1, then mix forward for 8 more so collisions are rare.
  let h2 = h1 ^ 0xdeadbeef;
  for (let i = 0; i < s.length; i++) {
    h2 ^= s.charCodeAt(i) << ((i % 4) * 8);
    h2 = Math.imul(h2, 0x01000193) >>> 0;
  }
  const part1 = h1.toString(16).padStart(8, '0');
  const part2 = h2.toString(16).padStart(8, '0');
  return `s_${part1}${part2}`;
}

// Deterministic fallback id for settlements lacking BOTH an id and a _seed (rare —
// imported / mock data). Derived from identifying content via idFromSeed so the same
// settlement always normalizes to the same id. Math.random here produced a fresh id
// on every load, violating this file's idempotency contract
// (normalize(normalize(s)) === normalize(s)).
/** @param {any} settlement */
function contentId(settlement) {
  return idFromSeed(JSON.stringify({
    name: settlement?.name ?? null,
    tier: settlement?.tier ?? null,
    population: settlement?.population ?? null,
  }));
}

/**
 * Resolve a canonical field value by checking the canonical key first,
 * then each declared alias. Returns the first defined value found.
 * @param {any} settlement
 * @param {any} canonicalKey
 */
function resolveAliased(settlement, canonicalKey) {
  if (settlement[canonicalKey] !== undefined) return settlement[canonicalKey];
  const aliases = /** @type {Record<string, string[]>} */ (FIELD_ALIASES)[canonicalKey] || [];
  for (const alias of aliases) {
    if (settlement[alias] !== undefined) return settlement[alias];
  }
  return undefined;
}

/**
 * Convert a settlement (any shape — legacy, partially-canonical, fully
 * canonical) into a canonical settlement.
 *
 * @param {any} settlement
 * @returns {Object} New object — input is not mutated.
 */
export function normalizeSettlement(settlement) {
  if (!settlement || typeof settlement !== 'object') {
    // Defensive — callers should never pass nullish, but if they do we
    // return a minimal valid canonical shape rather than crashing.
    return {
      schemaVersion:     SCHEMA_VERSION,
      simulationVersion: SIMULATION_VERSION,
      generatorVersion:  GENERATOR_VERSION,
      id:                contentId(settlement),
      activeConditions:  [],
      simulationTrace:   [],
      aiOverlays:        [],
      userCanon:         {},
    };
  }

  const out = { ...settlement };

  // ── 1. Version stamps ─────────────────────────────────────────────────
  // Do NOT pre-stamp schemaVersion: a versionless legacy save must enter the
  // migration chain at version 0 (currentVersion() treats missing/null as 0) so
  // every from:0 migration runs. The chain assigns the final schemaVersion in
  // step 5; stamping it here would make migrateSettlementToLatest skip all
  // migrations. simulation/generator versions are unrelated to migrations.
  if (out.simulationVersion == null) out.simulationVersion = SIMULATION_VERSION;
  if (out.generatorVersion  == null) out.generatorVersion  = GENERATOR_VERSION;

  // ── 2. Stable id ──────────────────────────────────────────────────────
  if (!out.id) {
    out.id = out._seed ? idFromSeed(out._seed) : contentId(out);
  }

  // ── 3. Resolve aliased fields ─────────────────────────────────────────
  // For every alias group, write to the canonical key (if any alias has
  // a value). Aliases are PRESERVED on the output so legacy consumers
  // still read the same field they always did.
  for (const canonical of Object.keys(FIELD_ALIASES)) {
    const resolved = resolveAliased(out, canonical);
    if (resolved !== undefined && out[canonical] === undefined) {
      out[canonical] = resolved;
    }
  }

  // ── 4. Default canonical containers ───────────────────────────────────
  // Future consumers (trace layer, AI overlays, active conditions)
  // expect these to exist. Defaulting here means no consumer needs a
  // `settlement.activeConditions || []` guard.
  if (!Array.isArray(out.activeConditions)) out.activeConditions = [];
  if (!Array.isArray(out.simulationTrace))  out.simulationTrace  = [];
  if (!Array.isArray(out.aiOverlays))       out.aiOverlays       = [];
  if (out.userCanon == null || typeof out.userCanon !== 'object') out.userCanon = {};

  // ── 5. Apply schema migrations ─────────────────────────────
  // Older saved settlements may carry a lower schemaVersion than the
  // current SCHEMA_VERSION constant. Walk the migration chain so the
  // returned object matches the current shape regardless of when it
  // was generated.
  return migrateSettlementToLatest(out);
}

/**
 * Whether a settlement appears to have been normalized at least once
 * (has version stamps and a stable id). Useful for short-circuiting
 * repeated normalize calls in hot paths.
 * @param {any} settlement
 */
export function isNormalized(settlement) {
  return Boolean(
    settlement
    && settlement.schemaVersion != null
    && settlement.id
  );
}
