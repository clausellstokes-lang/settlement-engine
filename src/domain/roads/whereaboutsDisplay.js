/**
 * roads/whereaboutsDisplay.js — THE DOSSIER WHEREABOUTS LINE (§12). Pure display formatter
 * over the npc.whereabouts mirror: one line + one short badge label.
 *
 * SECRET BY CONSTRUCTION (§15): npc.whereabouts is never added to any public/gallery
 * allowlist, so this line only has data to render in an owner surface — it ships nowhere.
 *
 * FIRST-PAINT LAW: a ZERO-IMPORT LAZY LEAF (imports nothing, no store/theme/copy), read
 * only from lazy dossier surfaces. Pure, total, deterministic.
 *
 * @enforced-by tests/domain/roadsWhereaboutsDisplay.test.js
 */

/** @param {string} id @param {((id: string) => string|null|undefined)} [resolveName] @returns {string} */
function placeOf(id, resolveName) {
  const resolved = resolveName ? resolveName(String(id || '')) : null;
  return String(resolved || id || 'the road');
}

const PURPOSE_LABEL = Object.freeze({
  observance: 'a tradition', trade: 'trade business', diplomacy: 'a diplomatic errand', ladder: 'a personal matter',
  embassy: 'a peace embassy', dominion: 'a dominion inspection', verification: 'confirming a rumour',
});

/**
 * The ONE dossier line for a whereabouts mirror, or null when absent/unreadable. Pure.
 * @param {unknown} whereabouts  npc.whereabouts
 * @param {(id: string) => (string|null|undefined)} [resolveName]  optional id→name resolver
 * @returns {string|null}
 */
export function whereaboutsLine(whereabouts, resolveName) {
  const w = whereabouts && typeof whereabouts === 'object' ? /** @type {Record<string, unknown>} */ (whereabouts) : null;
  if (!w || !w.state) return null;
  const place = placeOf(String(w.placeId || ''), resolveName);
  const purpose = (/** @type {Record<string, string>} */ (PURPOSE_LABEL))[String(w.purposeKind || '')] || 'business abroad';
  switch (w.state) {
    case 'hostage': return `Held in ${place} — the ransom is being raised.`;
    case 'returning': return `On the road home from ${place}.`;
    case 'visiting': return `Away in ${place}, on ${purpose}.`;
    case 'traveling': return `On the road to ${place}, on ${purpose}.`;
    default: return null;
  }
}

/** A short badge label for a whereabouts state ('Held' | 'Away' | 'Returning' | 'Traveling'),
 *  or null when absent. Pure. @param {unknown} whereabouts @returns {string|null} */
export function whereaboutsBadge(whereabouts) {
  const w = whereabouts && typeof whereabouts === 'object' ? /** @type {Record<string, unknown>} */ (whereabouts) : null;
  switch (w && w.state) {
    case 'hostage': return 'Held';
    case 'returning': return 'Returning';
    case 'visiting': return 'Away';
    case 'traveling': return 'Traveling';
    default: return null;
  }
}

/** Is this NPC a roads hostage (the dossier gates the intervention affordance on it)? Pure.
 *  @param {unknown} npc @returns {boolean} */
export function npcIsHostage(npc) {
  const w = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc).whereabouts : null;
  return !!(w && typeof w === 'object' && /** @type {Record<string, unknown>} */ (w).state === 'hostage');
}
