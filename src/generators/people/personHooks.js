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
 * through to the other pools in `dryPoolWalk`'s order (representatives.js); where every true line is
 * held, a held one is taken (a repeat beats no hook); a card no pool can serve keeps none.
 *
 * A HELD ROSTER IS NOT RE-WRITTEN (the same gate as storeTrueHooksOnly): the caller skips it.
 *
 * PURE over its inputs; copies only the cards it changes.
 */

import { hookTruthViolations, settlementHookFacts } from '../../domain/coherence/hookTruth.js';
import { HOOK_POOLS } from './poolMap.js';
import { dryPoolWalk, spareHookLine, titlePoolName } from './representatives.js';
import { plotHookText as textOf } from '../../lib/proseSeams.js';
import { ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER, NPC_FACTION_LOYALTY } from '../../data/npcData.js';

/**
 * FAULTS-PEOPLE (14e; BRIEF-FAULTS, the seat FAULTS-PEOPLE, 2026-11-18): A TRADE'S HOOK ON A SOLDIER. The economy pool's
 * lines presume a trade (`npcData.js :: ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER` names the six that do not), and the crisis bias
 * deals them to any card (`npcGenerator.js :: generatePlotHook`). The fact is the card's own house AND seats, and the
 * seats land after the draw, so the reading is here: a card whose house is a standing force's (a Defense house of the
 * military's priority: a watch, a garrison, a citadel, a militia, a barracks) that hires out for no coin (a free company,
 * a mercenary quarter or a hireling hall hires for coin: a customers hook is true of it), and that sits on no power of
 * trade (an `economy` or `crafts` power: C5328, C5358, a castellan and a watch commander on the merchant oligarchy, keep
 * theirs), keeps no trade: a trade line is refused for it and the card redraws from its own pool below, draw-free.
 */
/** whether a text is a line of the economy pool that presumes a trade (a row of the pool not named true of any holder) @param {string} text */
const isTradeLine = (text) => text !== '' && NPC_FACTION_LOYALTY.economy.some((l) => (typeof l === 'string' ? l : l.text) === text && !ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER.has(l));
/** the houses that hire out for coin (catalogue ids) */
const HIRED_FOR_COIN = new Set(['free_company_hall', 'mercenary_quarter', 'hireling_hall']);
/** the powers of trade, by the power's category */
const TRADE_POWERS = new Set(['economy', 'crafts']);

/**
 * Whether a card keeps no trade: its house is a standing force's and none of its seats is a power of trade.
 * @param {Record<string, any>} npc @param {ReadonlyArray<Record<string, any>>} institutions
 * @param {ReadonlyMap<string, unknown>} powerKind a power's name -> its category
 */
function keepsNoTrade(npc, institutions, powerKind) {
  const key = npc?.institution?.key;
  if (typeof key !== 'string' || key === '') return false;
  const house = institutions.find((h) => h?.name === key);
  if (!house || house.category !== 'Defense' || house.priorityCategory !== 'military' || HIRED_FOR_COIN.has(house.catalogId)) return false;
  const seats = Array.isArray(npc.memberships) ? npc.memberships : [];
  return !seats.some((m) => TRADE_POWERS.has(/** @type {string} */ (powerKind.get(String(m?.power ?? '')))));
}

/**
 * The record with every card carrying exactly one hook the record does not contradict: a card
 * whose hook was refused (none left, or a false one still stored) takes the next true line of
 * its own pool. Returns the SAME array when no card changes.
 * @template {Record<string, any>} T
 * @param {{ npcs?: T[], [key: string]: unknown }} settlement the assembled record (after the truth check)
 * @param {'none' | 'maritime' | 'river' | null | undefined} portKind the world law's port kind (the wet line's declared sibling, CENSUS-1c)
 * @returns {T[] | undefined}
 */
export function truePersonHooks(settlement, portKind) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || npcs.length === 0) return npcs;
  const facts = settlementHookFacts(settlement);
  const isTrue = (/** @type {string} */ text) => text.trim() !== '' && hookTruthViolations(text, facts).length === 0;
  // FAULTS-PEOPLE (14e): a trade's line is false of a card that keeps no trade (above)
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const factions = /** @type {{ powerStructure?: { factions?: unknown } }} */ (settlement)?.powerStructure?.factions;
  const powerKind = new Map((Array.isArray(factions) ? factions : []).flatMap((f) => [f?.name, f?.faction].filter((n) => typeof n === 'string').map((n) => [n, f?.category])));
  const trueOf = (/** @type {Record<string, any>} */ npc) => {
    if (!keepsNoTrade(npc, institutions, powerKind)) return isTrue;
    return (/** @type {string} */ text) => isTrue(text) && !isTradeLine(text.trim());
  };
  const held = new Set(npcs.flatMap((npc) => (Array.isArray(npc?.plotHooks) ? npc.plotHooks.map(textOf) : [])).map((t) => t.trim()));
  let changed = false;
  const next = npcs.map((npc) => {
    if (!npc || typeof npc !== 'object') return npc;
    const hooks = Array.isArray(npc.plotHooks) ? npc.plotHooks : [];
    const isTrueOfCard = trueOf(npc);
    if (hooks.length === 1 && isTrueOfCard(textOf(hooks[0]))) return npc;
    const own = HOOK_POOLS.includes(npc.category) ? npc.category : 'other';
    // W7 HOOKS (WAVE-RULINGS item 15): the card's own title pool first, then the category walk.
    const pools = [titlePoolName(npc.title), ...dryPoolWalk(own)];
    const key = String(npc.id ?? npc.name ?? '');
    // an unheld true line first; where every true line is held, a held one (a repeat beats none)
    const place = { worldLaw: { portKind }, institutions: Array.isArray(settlement?.institutions) ? settlement.institutions : [], tier: typeof settlement?.tier === 'string' ? settlement.tier : undefined }; // MERGE-CAR: the declared rows' facts
    const line = spareHookLine(pools, held, key, place, isTrueOfCard) ?? spareHookLine(pools, new Set(), key, place, isTrueOfCard);
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
