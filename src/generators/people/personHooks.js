/**
 * people/personHooks.js — ONE TRUE HOOK PER CARD AT BIRTH (the people car, PEOPLE-3 HOOKS,
 * 2026-11-07; the owner: "one plot hook per NPC rather than multiple").
 *
 * A card draws exactly one hook on its own fork (people/representatives.js :: drawCardHooks).
 * The record's truth check (domain/coherence/hookTruthRecord.js :: storeTrueHooksOnly) drops a
 * stored hook the record contradicts ("three guards have gone missing" where no force stands)
 * and, before the one-hook rule, the card's second hook was the list's "next candidate". With
 * one hook, a refusal would leave the card with none — so the refused card REDRAWS (HK-LAW-1:
 * "drop or redraw, never rewrite"): the next line of its OWN pool (its card category, the key
 * the pool map gave it — poolMap.js :: hookPoolFor) that the record does not contradict and no
 * other card holds, walked in authored order from an offset keyed by the card's id. DRAW-FREE:
 * no stream is read, so nothing after it moves. A pool with no true unheld line left falls
 * through to the generic pools (`other`, then the small settlement's); where every true line is
 * held, a held one is taken (a repeat beats no hook); a card no pool can serve keeps none.
 *
 * A HELD ROSTER IS NOT RE-WRITTEN (the same gate as storeTrueHooksOnly): the caller skips it.
 *
 * PURE over its inputs; copies only the cards it changes.
 */

import { hookTruthViolations, settlementHookFacts } from '../../domain/coherence/hookTruth.js';
import { HOOK_POOLS } from './poolMap.js';
import { spareHookLine } from './representatives.js';

/** @param {unknown} hook @returns {string} */
function textOf(hook) {
  if (typeof hook === 'string') return hook;
  const entry = /** @type {{ hook?: unknown, text?: unknown }} */ (hook);
  return typeof entry?.hook === 'string' ? entry.hook : typeof entry?.text === 'string' ? entry.text : '';
}

/**
 * The record with every card carrying exactly one hook the record does not contradict: a card
 * whose hook was refused (none left, or a false one still stored) takes the next true line of
 * its own pool. Returns the SAME array when no card changes.
 * @template {Record<string, any>} T
 * @param {{ npcs?: T[], [key: string]: unknown }} settlement the assembled record (after the truth check)
 * @param {string | null | undefined} portKind the world law's port kind (F5: the wet line's inland twin)
 * @returns {T[] | undefined}
 */
export function truePersonHooks(settlement, portKind) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || npcs.length === 0) return npcs;
  const facts = settlementHookFacts(settlement);
  const isTrue = (/** @type {string} */ text) => text.trim() !== '' && hookTruthViolations(text, facts).length === 0;
  const held = new Set(npcs.flatMap((npc) => (Array.isArray(npc?.plotHooks) ? npc.plotHooks.map(textOf) : [])).map((t) => t.trim()));
  let changed = false;
  const next = npcs.map((npc) => {
    if (!npc || typeof npc !== 'object') return npc;
    const hooks = Array.isArray(npc.plotHooks) ? npc.plotHooks : [];
    if (hooks.length === 1 && isTrue(textOf(hooks[0]))) return npc;
    const own = HOOK_POOLS.includes(npc.category) ? npc.category : 'other';
    const pools = [own, 'other', 'small_settlement'];
    const key = String(npc.id ?? npc.name ?? '');
    // an unheld true line first; where every true line is held, a held one (a repeat beats none)
    const line = spareHookLine(pools, held, key, portKind, isTrue) ?? spareHookLine(pools, new Set(), key, portKind, isTrue);
    if (line !== null) {
      held.add(line.trim());
      changed = true;
      return { ...npc, plotHooks: [line] };
    }
    if (hooks.length <= 1) return npc;
    changed = true;
    return { ...npc, plotHooks: hooks.slice(0, 1) };
  });
  return changed ? next : npcs;
}
