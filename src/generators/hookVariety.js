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
 *
 * WAVE HK-3 — THE SECOND REGISTRY (docs/DESIGN_HOOK_NONREDUNDANCY.md §3 HK-3).
 * The family registry above stops a settlement emitting the same STRING twice.
 * It cannot see the case the owner named: two DIFFERENT authored strings telling
 * the SAME BEAT, worn by two different actors. HK-1 gave every authored template
 * a theme from a closed vocabulary, and this module now accepts a SECOND
 * settlement-scoped Set — of themes already spoken — so the draw prefers a beat
 * this settlement has not told yet. It is the source-side arm of the same cure
 * HK-2 applies at the projection, and it is the owner's preferred arm: a redraw
 * stays inside the SAME authored, context-scoped pool, so plausibility is
 * structural (HK-LAW-1 — DROP OR REDRAW, NEVER REWRITE).
 *
 * HK-LAW-6 — THE ROLL BUDGET IS INVARIANT. The theme registry changes the
 * CANDIDATE SET and nothing else: every branch below still spends exactly ONE
 * `_rng()` call, so a settlement generated with the theme registry draws the
 * same NUMBER of rolls as one generated without it and the surrounding stream
 * cannot shift. Which TEMPLATE a roll lands on does change — that is the
 * disclosed same-seed shift HK-3 carries, ruled in §3 and re-recorded in the
 * wave's own commit.
 *
 * HK-LAW-3 — FREE PROSE IS NEVER THEME-JUDGED. `themeOfFn` is expected to answer
 * `UNTYPED` for anything that is not an authored template; an untyped candidate
 * is never BLOCKED by the theme registry and never REGISTERS a theme, so a pool
 * this module has not been taught degrades to exactly the pre-HK-3 behaviour
 * rather than to a wrong one.
 */

import { random as _rng } from '../kernel/rngContext.js';
import { UNTYPED } from '../domain/hookThemes.js';

/**
 * The theme a candidate BLOCKS, or null when it blocks nothing. `UNTYPED`, an
 * empty answer and a non-string answer all mean "this candidate is not theme-
 * judged" (HK-LAW-3). Imported rather than re-spelled: one spelling of the
 * sentinel is what keeps this module and hookThemes.js from drifting apart
 * (the writer/reader payload-spelling class).
 * @param {(x: unknown) => unknown} themeOfFn
 * @param {unknown} candidate
 * @returns {string | null}
 */
function blockingTheme(themeOfFn, candidate) {
  const theme = themeOfFn(candidate);
  return typeof theme === 'string' && theme !== '' && theme !== UNTYPED ? theme : null;
}

/**
 * Draw one element from `pool` whose family id is not already in `used`, using
 * the active seeded RNG, and register the chosen family id in `used`.
 *
 * When every family in the pool has already been emitted (the pool is exhausted
 * for this settlement), an unavoidable repeat is accepted: a plain seeded pick is
 * returned and nothing new is registered. This keeps the draw total-count stable
 * for large populations while still eliminating every AVOIDABLE repeat.
 *
 * CANDIDATE PREFERENCE (§3 HK-3), applied in order and stopping at the first
 * non-empty tier, so a stricter tier NEVER costs a hook:
 *   1. unused family AND unused theme — the beat is new to this settlement;
 *   2. unused family — the string is new even though the beat is not;
 *   3. the whole pool — every family is spent, the repeat is unavoidable.
 * Tier 1 is skipped entirely when no theme registry is supplied, which is what
 * makes the theme arm opt-in per call site rather than a global behaviour change.
 *
 * @template T
 * @param {T[]} pool - candidate templates (authored constants)
 * @param {Set<string>} [used] - settlement-scoped registry of emitted family ids
 * @param {(x: T) => string} [keyFn] - family id for a template (defaults to the value itself)
 * @param {Set<string>} [themes] - settlement-scoped registry of themes already spoken (HK-3)
 * @param {(x: T) => string} [themeOfFn] - theme for a template; answers UNTYPED for free prose
 * @returns {T | undefined}
 */
export function drawUnique(pool, used, keyFn = (x) => /** @type {string} */ (x), themes, themeOfFn) {
  if (!pool || pool.length === 0) return undefined;
  // No registry supplied → behave exactly like a plain seeded pick.
  if (!used) return pool[Math.floor(_rng() * pool.length)];
  // Candidates not yet emitted, in stable pool order (deterministic index space).
  const fresh = pool.filter((x) => !used.has(keyFn(x)));
  if (fresh.length === 0) {
    // Pool exhausted for this settlement — accept the unavoidable repeat.
    return pool[Math.floor(_rng() * pool.length)];
  }
  // The theme arm is live only when BOTH a registry and a classifier arrive; a
  // half-wired call site degrades to the pre-HK-3 family behaviour, never to a
  // silent crash and never to a wrong preference.
  const themed = themes instanceof Set && typeof themeOfFn === 'function' ? themeOfFn : null;
  let candidates = fresh;
  if (themed) {
    const unspoken = fresh.filter((x) => {
      const theme = blockingTheme(themed, x);
      return theme === null || !themes.has(theme);
    });
    if (unspoken.length > 0) candidates = unspoken;
  }
  // THE ONE ROLL (HK-LAW-6). Every branch above only decided WHICH set it lands on.
  const chosen = candidates[Math.floor(_rng() * candidates.length)];
  used.add(keyFn(chosen));
  if (themed) {
    const theme = blockingTheme(themed, chosen);
    if (theme !== null) themes.add(theme);
  }
  return chosen;
}

// THE REGISTRY-AWARE TWIN (CENSUS-3e's `freshAdmittedTwin`) moved to `drawDeclared`'s `registry`
// option (R-AJ, CENSUS-1g unit 3): one resolver for every site that draws through `drawUnique`.
/**
 * REVIEW-INTAKE-4 (the chair's ruling, 2026-11-07) — A DRAW THAT REFUSES WHAT THE ROSTER HOLDS.
 * One named figure's secret or goal is never a text another figure of the same roster already
 * carries. The seeded roll lands on the SAME index a plain `pick(pool)` lands on (one roll,
 * nothing more, so a roster with no collision is byte-identical to before); when that row's key
 * is already held, the draw falls through the pool IN SEED ORDER — the next row, wrapping — to
 * the first row nobody holds, with no further roll. A pool whose every row is held answers
 * `undefined`: the figure goes without one from this writer rather than repeating (unlike
 * `drawUnique`, which accepts the repeat). The caller registers what it keeps.
 *
 * @template T
 * @param {T[]} pool
 * @param {Set<string> | null | undefined} held - the texts the rest of the roster carries
 * @param {(x: T) => string} [keyFn] - the text a row would put on the figure
 * @returns {T | undefined}
 */
export function drawRefusingHeld(pool, held, keyFn = (x) => /** @type {string} */ (x)) {
  return drawRefusingHeldThrough([pool], held, keyFn);
}

/**
 * `drawRefusingHeld` over a CHAIN of pools, the writer's own fallback order (a role's goals, then
 * its category's, then the generic pool): the ONE roll picks the start index in the FIRST
 * non-empty pool exactly as `pick` would; when every row of a pool is held, the SAME roll
 * re-scales onto the next pool and walks it in seed order. No pool spends a second roll, so a
 * roster with no collision is byte-identical to a plain pick of the first pool; every pool
 * exhausted answers `undefined`.
 *
 * @template T
 * @param {ReadonlyArray<ReadonlyArray<T> | null | undefined>} pools
 * @param {Set<string> | null | undefined} held
 * @param {(x: T) => string} [keyFn]
 * @returns {T | undefined}
 */
export function drawRefusingHeldThrough(pools, held, keyFn = (x) => /** @type {string} */ (x)) {
  const live = pools.filter((pool) => Array.isArray(pool) && pool.length > 0);
  if (live.length === 0) return undefined;
  const u = _rng(); // THE ONE ROLL: on the first pool, rngContext.pick's own index
  for (const pool of live) {
    const start = Math.floor(u * pool.length);
    if (!held || held.size === 0) return pool[start];
    for (let k = 0; k < pool.length; k++) {
      const row = pool[(start + k) % pool.length];
      if (!held.has(String(keyFn(row) ?? '').trim())) return row;
    }
  }
  return undefined;
}

/**
 * The texts the REST of a roster carries for one field, trimmed, for `drawRefusingHeld` and for
 * a rewriter that must not hand a figure a text another already holds.
 * @param {ReadonlyArray<unknown>} texts - one entry per figure, in roster order
 * @param {number} self - the figure being written (excluded)
 * @returns {Set<string>}
 */
export function heldByOthers(texts, self) {
  const held = new Set();
  texts.forEach((text, k) => {
    if (k === self || typeof text !== 'string') return;
    const t = text.trim();
    if (t) held.add(t);
  });
  return held;
}
