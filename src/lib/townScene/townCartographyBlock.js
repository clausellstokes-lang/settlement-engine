/**
 * townScene/townCartographyBlock.js — THE CARTOGRAPHY MANIFEST SEAM (TC-5b-i).
 *
 * Makes a compiled `manifest.cartography` block reachable from a non-3D, non-worker
 * caller, headlessly. It mounts nothing, renders nothing, and has ZERO production
 * importers by design — TC-5b-ii's painter is the first consumer.
 *
 * ── WHY THIS IS A MAIN-THREAD COMPILE, AND WHY THAT IS BOUNDED ───────────────
 * This is the shape that already ships: townSceneExport.js reads the same flag
 * through the same predicate, dynamically imports NAMING_DATA only when lit, and
 * calls compileTownSceneManifest synchronously behind a user's click. This module
 * is that precedent minus the raster/GLB half. The compile is off the render path,
 * runs once per input identity, and is reachable ONLY for a reader who lit the
 * virtual `townCartographyEnabled` rule — which has no DEFAULT_SIMULATION_RULES
 * entry, so every existing world is dark by construction.
 *
 * ── THE COMPILER IS REACHED BY ITS DIRECT SPECIFIER, NEVER THE BARREL ────────
 * `../../domain/townScene/index.js` would drag the whole townScene family in. The
 * direct specifier is also the one townScene.worker.js uses, which is what lets
 * Rollup share a single compileTownSceneManifest chunk when TC-5b-ii gives this
 * seam its first importer — the bounded-artifact arm pins that chunk count at
 * exactly one, and a second chunk would red it.
 *
 * ── FAILURE IS THE HOOK'S, NOT OURS ─────────────────────────────────────────
 * This module does NOT catch. A compiler throw — a malformed settlement, the
 * CR-TC3A-1 naming-pool premise, a validator error — propagates as a rejected
 * promise. One failure home is the point; a try/catch here would be a second one.
 *
 * Pure and headless apart from the one dynamic import: no React, no DOM, no store,
 * no clock, no randomness, no module-scope mutable state, no cache, no while/do.
 *
 * @enforced-by tests/lib/townCartographyBlock.test.js
 */
import { compileTownSceneManifest } from '../../domain/townScene/compileTownSceneManifest.js';
import {
  TOWN_CARTOGRAPHY_MANIFEST_KEY,
  townCartographyActive,
} from '../../domain/townScene/cartographyContract.js';

/**
 * @typedef {{ status: 'ready', block: Record<string, unknown>, planExtent: number }
 *          | { status: 'unavailable', block: null, planExtent: null }} TownCartographyBlockResult
 */

/**
 * Compile the cartography block for one settlement, or report that there is none.
 *
 * @param {{ settlement: unknown, worldState?: unknown,
 *           regionalGraph?: unknown, audience?: 'dm'|'player'|'public' }} input
 * @returns {Promise<TownCartographyBlockResult>}
 */
export async function compileTownCartographyBlock(input) {
  // The dark path must be FREE: no naming pools fetched, nothing compiled.
  if (!townCartographyActive(
    /** @type {{ simulationRules?: unknown }} */ (input.worldState)?.simulationRules,
  )) {
    return { status: 'unavailable', block: null, planExtent: null };
  }

  // CR-TC3A-1: the pools are INJECTED across the lazy edge, never imported by the
  // compiler. A lit compile without them throws a named TypeError at the seam.
  const { NAMING_DATA } = await import('../../data/namingData.js');

  const manifest = /** @type {Record<string, any>} */ (compileTownSceneManifest(
    {
      settlement: input.settlement,
      // Deliberate and load-bearing: projectSettlementForScene reads
      // settlement.mapEdits itself when this is null, so the seam compiles against
      // the reader's own persisted edits with no import and no second normalizer.
      mapEdits: null,
      worldState: input.worldState ?? null,
      regionalGraph: input.regionalGraph ?? null,
      // Passed through EXACTLY as received, including undefined. normalizeSceneAudience
      // already lands an absent audience on 'public', the narrowest projection; a
      // default here would silently WIDEN it, so this seam declares none.
      audience: input.audience,
    },
    { namingPools: NAMING_DATA },
  ));

  // Absence of the key IS the dark signal, by attachTownCartographyLayers's own
  // contract (dark returns the manifest by reference, with no cartography key).
  const block = manifest?.[TOWN_CARTOGRAPHY_MANIFEST_KEY] ?? null;
  if (block === null) {
    return { status: 'unavailable', block: null, planExtent: null };
  }

  return { status: 'ready', block, planExtent: manifest.space.planExtent };
}
