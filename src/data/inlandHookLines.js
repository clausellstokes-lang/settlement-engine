/**
 * inlandHookLines.js — the inland twin of every NPC hook-pool line that speaks of the sea, the
 * docks, a harbour, ships or the tide (`npcData.js :: NPC_FACTION_GOALS`, `NPC_FACTION_LOYALTY`,
 * `NPC_SECRETS`, `NPC_CRIMINAL_SECRETS`, `NPC_WANTS`), used ONLY where the record's water fact
 * (`domain/tradeRouteSemantics.js :: waterAccessKind`) is 'none' — TERRAIN-POOLS' rule for
 * institution descriptions (`inlandDescriptions.js`), applied to hooks (lane F5, 2026-11-04, on
 * rung 1B's soak1k-105). Keyed by the pool line's own text; the twin is taken after the draw, so
 * no roll moves and only the persisted string varies.
 *
 * Neither pool line has an inland line of its own, so each twin is the smallest plain rewrite
 * that keeps the line's beat. VETOABLE (the chair's or the owner's wording call):
 *  - the Guard Captain's goal drops "dock-side": three unsolved killings, anywhere;
 *  - the economy loyalty hook's cargo is lost "on the road", not "at sea".
 */

/** A pool line's water words (the A-11 vocabulary plus the sea and the tide). */
export const WET_HOOK_WORD = /\b(?:sea|seas|dock-side|dockside|docks?|harbou?rs?|ships?|shipping|shipwrights?|tides?|tidal|wharf|wharves|quays?|sailors?|fleet|boats?|fishermen|fishing)\b/i;

/** @type {Readonly<Record<string, string>>} */
export const INLAND_HOOK_LINES = Object.freeze({
  'Find the person responsible for three unsolved dock-side killings':
    'Find the person responsible for three unsolved killings',
  'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.':
    'A valuable cargo was reported lost on the road. The manifest has reappeared in a market two settlements away.',
});

/**
 * A drawn hook-pool line as the place can speak it: its inland twin where there is no water.
 * A non-string (a pool's object entry, an absent goal) is handed back untouched.
 * @template T
 * @param {T} line
 * @param {'maritime'|'river'|'none'|string|null|undefined} portKind the world law's water fact
 * @returns {T}
 */
export function inlandHookLine(line, portKind) {
  if (portKind !== 'none' || typeof line !== 'string') return line;
  const twin = INLAND_HOOK_LINES[line];
  return twin === undefined ? line : /** @type {T} */ (/** @type {unknown} */ (twin));
}
