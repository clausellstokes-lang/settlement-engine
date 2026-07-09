/**
 * hookVariety.js — the anti-repetition draw registry (Wave E, batch E2).
 *
 * A settlement's plot hooks are drawn from small authored pools (an NPC loyalty
 * pool is ~11 strings). When several NPCs of the same category each take a naive
 * random pick, two of them collide and the DM reads the same "secret" twice —
 * the measured 8.19% corpus / 35% worst-settlement repeat rate the distribution
 * envelopes pin.
 *
 * The fix is a DRAW REGISTRY: a per-source, settlement-scoped Set of family ids
 * that have already been emitted. Each authored template IS its own family (the
 * string is the family id for a bare-string pool), so "the same family never
 * emits twice" reduces to "prefer a pool element we haven't used yet". Where a
 * source would repeat, it draws its next unused variant instead — variety WITHOUT
 * dropping a hook (the count the DM sees is preserved).
 *
 * DETERMINISM: every roll goes through the active seeded RNG (rngContext), never
 * a new ambient Math.random(). A `drawUnique` call consumes exactly ONE roll —
 * the same budget the naive `pick(pool)` it replaces consumed — so wiring it in
 * does not perturb the surrounding RNG stream beyond the selected element itself.
 * The aggregator (collectPlotHooks) owns the final cross-source guarantee; this
 * registry owns within-source variety at generation time.
 */

import { random as _rng } from '../kernel/rngContext.js';

/**
 * Draw one element from `pool` whose family id is not already in `used`, using
 * the active seeded RNG, and register the chosen family id in `used`.
 *
 * When every family in the pool has already been emitted (the pool is exhausted
 * for this settlement), an unavoidable repeat is accepted: a plain seeded pick is
 * returned and nothing new is registered. This keeps the draw total-count stable
 * for large populations while still eliminating every AVOIDABLE repeat.
 *
 * @template T
 * @param {T[]} pool - candidate templates (authored constants)
 * @param {Set<string>} [used] - settlement-scoped registry of emitted family ids
 * @param {(x: T) => string} [keyFn] - family id for a template (defaults to the value itself)
 * @returns {T | undefined}
 */
export function drawUnique(pool, used, keyFn = (x) => /** @type {string} */ (x)) {
  if (!pool || pool.length === 0) return undefined;
  // No registry supplied → behave exactly like a plain seeded pick.
  if (!used) return pool[Math.floor(_rng() * pool.length)];
  // Candidates not yet emitted, in stable pool order (deterministic index space).
  const fresh = pool.filter((x) => !used.has(keyFn(x)));
  if (fresh.length === 0) {
    // Pool exhausted for this settlement — accept the unavoidable repeat.
    return pool[Math.floor(_rng() * pool.length)];
  }
  const chosen = fresh[Math.floor(_rng() * fresh.length)];
  used.add(keyFn(chosen));
  return chosen;
}
