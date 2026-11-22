/**
 * realmHeraldGate.js — has this campaign's realm clock ever moved?
 *
 * THE OWNER'S ORDER (2026-09-17): "The herald should only appear after the first
 * advanced time on the map." The Herald (the desktop Realm Inspector panel, its
 * toolbar toggle, and the flagged phone companion) is therefore withheld from a
 * campaign whose world has never advanced, and offered from the first advance on.
 *
 * The answer is DERIVED from the persisted world clock; no field is added for it.
 *   - `worldState.tick` is the canonical counter: 0 on a fresh world
 *     (createDefaultWorldState), bumped by one per week on every clock-moving path
 *     (pulseKernel: a single tick, an interval, the tick a paused interval commits,
 *     the autonomous catch-up). It survives a reload through campaign hydration.
 *   - `calendar.elapsedWeeks` (and the raw legacy `elapsedMonths`) cover an old
 *     months-only save, which normalizes to tick 0 with weeks already elapsed.
 * Undo restores the pre-advance world wholesale, so undoing a realm's only advance
 * returns it to never-advanced, and the Herald waits again (a declared edge).
 *
 * A zero-import leaf under src/lib so the Realm's lazy chunks can read it without
 * pulling theme or store code (the typecheck ratchet's theme hazard).
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function positive(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

/**
 * @param {any} campaign the campaign record (or null)
 * @returns {boolean} true once the campaign's realm clock has advanced at least once
 */
export function realmHasAdvanced(campaign) {
  const worldState = campaign?.worldState;
  if (!worldState || typeof worldState !== 'object') return false;
  if (positive(worldState.tick)) return true;
  const calendar = worldState.calendar;
  if (!calendar || typeof calendar !== 'object') return false;
  return positive(calendar.elapsedWeeks) || positive(calendar.elapsedMonths);
}
