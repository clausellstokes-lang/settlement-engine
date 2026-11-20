/**
 * economy/viabilityHookPools.js — THE ECONOMY'S OWN HOOKS, FROM TWO DECLARED POOLS (PLACE-2, 2026-11-20; the owner's order to
 * fix the sameness fault; `docs/chair/2026-11-20/content/place/viabilityHooks-MEASURE.md` §D and §F, the 25 rows approved by
 * the chair at 17:38 UTC as written).
 *
 * The Plot Hooks tab's Outlook cards (`economicViability.plotHooks[].hook`) printed the moderate food gap's merchant
 * (`outlookHookSiblings.js :: MODERATE_GAP_TWIN`) in up to 19 of 100 towns, and the three peacetime iron events with their
 * smith twins (`PEACE_IRON_HOOKS`) in up to 17 of 100 cities. The writers (`foodBalance.js`) hold no seed, so the text is
 * re-worded here, once, at the step that does (`steps/generateNarratives.js`, one call line): each such hook draws its text
 * from its pool through `drawDeclared` with `kernel/proseHash.js :: pickVariantMixed`, keyed
 * `${seed}::viabilityHooks::<poolId>` (one draw a pool: a place holds at most one gap hook and one peacetime iron hook);
 * no roll. Only the text moves: the category, the severity and the count are kept (`{ ...h, hook }`), and the composer runs
 * after the writer's grade (`foodBalance.js :: moderateGapGrade`, keyed on the twin's text).
 *
 * Every row is a declared line (`drawDeclared.js`'s shape): its `needs` / `excludes` are atoms of `factVocabulary.js`, read
 * by `factsOf` on the record at the call line. The gap pool stands under the twin's own admission (`food: ≤ pressured`, not
 * deficit, isolated or besieged: the twin is re-worded only where it printed); every iron row refuses the war states, as
 * the six do. No row reads a hideable house or a crime fact (the chair's condition of 16:51 UTC, corrected 17:13 UTC).
 * One declaration beyond §D's table: `gap-desert` also needs `route: road` (its caravan brings food from outside, the
 * presumption walker's `outside` class; every holder of the twin is on a road, measure §C), the row's words unchanged.
 * ROW 0 OF EACH POOL IS TODAY'S TEXT, read from its home (no copied literal), and a FALSY SEED hands every hook back
 * untouched: a seedless caller prints today's text byte for byte.
 */
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { pickVariantMixed } from '../../kernel/proseHash.js';
import { MODERATE_GAP_TWIN, PEACE_IRON_HOOKS } from './outlookHookSiblings.js';

/** A declared row, frozen with its atom lists (written as plain arrays in the row, where the presumption walkers read them). */
const row = (/** @type {{ id: string, text: string, needs?: string[], excludes?: string[] }} */ r) => Object.freeze({
  ...r, ...(r.needs ? { needs: Object.freeze(r.needs) } : {}), ...(r.excludes ? { excludes: Object.freeze(r.excludes) } : {}),
});

/** THE MODERATE GAP (replaces the stored text of `MODERATE_GAP_TWIN` only). */
export const MODERATE_GAP_POOL = Object.freeze([
  row({ id: 'gap-canon', text: MODERATE_GAP_TWIN }),
  row({ id: 'gap-price', text: 'The settlement grows less food than it eats, and what it buys in to make up the rest costs more each month; people are asking who sets the price.' }),
  row({ id: 'gap-keep', text: 'The settlement grows less food than it eats, and the families who grow the most have started keeping it back rather than selling it here.' }),
  row({ id: 'gap-buyer', text: 'The settlement grows less food than it eats, and someone must go out and buy the rest this season; nobody wants the errand, and nobody trusts whoever offers.' }),
  row({ id: 'gap-carters', text: 'The carters who bring food up the road have raised their rates, and the settlement, which grows less than it eats, must pay them or send its own carts.', needs: ['route: road'] }),
  row({ id: 'gap-market', text: 'A stranger bought up most of the grain in the market before the locals could get to it, and the settlement grows too little of its own to shrug it off.', needs: ['market'] }),
  row({ id: 'gap-granary', text: 'The settlement grows less food than it eats, and those who keep the granary are arguing over whether to open it now or hold it against a leaner month.', needs: ['institution: granary'] }),
  row({ id: 'gap-mill', text: 'Less grain reaches the mill each week than it did, and the miller wants to know where the rest is going; the settlement grows too little to lose any of it.', needs: ['institution: mill'] }),
  row({ id: 'gap-tavern', text: 'Travellers at the tavern talk of cheap grain a few days down the road; the settlement grows less than it eats, and someone must decide whether to send for it.', needs: ['institution: tavern', 'route: road'] }),
  row({ id: 'gap-mountain', text: 'Little grows on the slopes around the settlement, and the mule trains that bring up the rest of its food now want paying before they load.', needs: ['terrain: mountain', 'route: road'] }),
  row({ id: 'gap-desert', text: 'Little grows in the dry country here, and the caravan that brings the rest of the settlement\'s food is overdue, with no word sent ahead.', needs: ['terrain: desert', 'route: road'] }),
  row({ id: 'gap-forest', text: 'The clearings here do not grow enough food for the settlement; some want to clear more of the forest, and others will not see it cut.', needs: ['terrain: forest'] }),
]);

const [[PRICE, PRICE_T], [CARTS, CARTS_T], [TOLL, TOLL_T]] = PEACE_IRON_HOOKS;
/** THE PEACETIME IRON EVENTS (replaces the stored text of any of the six `PEACE_IRON_HOOKS`; the branch guarantees an iron import). */
export const IRON_PEACE_POOL = Object.freeze([
  row({ id: 'iron-price', text: PRICE, needs: ['institution: smith'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-price-t', text: PRICE_T, excludes: ['institution: smith', 'war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-carts', text: CARTS, needs: ['institution: smith'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-carts-t', text: CARTS_T, excludes: ['institution: smith', 'war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-toll', text: TOLL, needs: ['institution: smith'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-toll-t', text: TOLL_T, excludes: ['institution: smith', 'war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-slag', text: 'The last iron that came in was poor, brittle and full of slag, and those who paid for it want their money back from whoever sold it.', excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-bidding', text: 'Iron is scarce this season, and two buyers here are bidding against each other for every load that arrives.', excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-river', text: 'The iron barges are late coming up the river, and work here waits on tools nobody can mend.', needs: ['route: river'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-port', text: 'The ship that carries the season\'s iron has not come in, and nobody will say what became of it.', needs: ['route: port'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-crossroads', text: 'Iron that used to be sold here on its way through now goes on to a better buyer, and the place is left short.', needs: ['route: crossroads'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-market', text: 'Iron is sold by the pound in the market now, and the price goes up every week.', needs: ['market'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
  row({ id: 'iron-forge', text: 'The forge here is down to its last good iron, and the work waiting on it grows longer every day.', needs: ['institution: smith'], excludes: ['war: front', 'war: aggressor', 'war: at war'] }),
]);

/** Each of today's texts, the pool that re-words it. */
const POOL_OF = new Map([
  [MODERATE_GAP_TWIN, { id: 'MODERATE_GAP', rows: MODERATE_GAP_POOL }],
  ...PEACE_IRON_HOOKS.flat().map((text) => /** @type {[string, { id: string, rows: typeof IRON_PEACE_POOL }]} */ ([text, { id: 'IRON_PEACE', rows: IRON_PEACE_POOL }])),
]);

/**
 * The economy's hooks with each moderate-gap and peacetime iron hook re-worded from its pool (the text only).
 * @template {{ hook?: unknown }} H
 * @param {H[]} hooks the hooks `viability.js :: generateEconomicViability` returned
 * @param {object} record the record at the call line (`factsOf` reads it, only where a row declares)
 * @param {unknown} seed the birth seed; falsy → the hooks unchanged (canonical at zero)
 * @returns {H[]}
 */
export function viabilityHooksOf(hooks, record, seed) {
  if (!seed || !Array.isArray(hooks)) return hooks;
  /** @type {ReturnType<typeof factsOf> | null} */ let facts = null;
  const factsAtHand = () => (facts ??= factsOf(record));
  return hooks.map((h) => {
    const pool = typeof h?.hook === 'string' ? POOL_OF.get(h.hook) : undefined;
    if (!pool) return h;
    const key = `${String(seed)}::viabilityHooks::${pool.id}`;
    const r = drawDeclared(pool.rows, { draw: (p) => pickVariantMixed(p, key), facts: factsAtHand, key, poolId: `viabilityHooks:${pool.id}`, surface: 'economics', drawKind: 'H' });
    return typeof r.text === 'string' ? { ...h, hook: r.text } : h;
  });
}
