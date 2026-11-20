// PLACE-1 · viabilityHooks MEASURE, section D: THE CANDIDATE COMPOSER, scratch only (never src/). Two pools, each row the
// house's declared shape `{ id, text, needs?, excludes? }` (`src/domain/facts/drawDeclared.js`), atoms from
// `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS` only. Row 0 of each pool is today's text (CANONICAL-AT-ZERO).
//
// The draw is the house's, simulated: drawn = pool[fnv1a32(key) % pool.length] (`kernel/proseHash.js :: pickVariant`,
// non-falsy seed); refused -> the argmax of `hashKey(key::id)` over the admitted rows (`drawDeclared.js`, step 2). No roll.
// Key: `${seed}::viabilityHooks::${poolId}`.

/** The war states a peacetime iron event refuses (outlookHookSiblings.js :: WAR_STATES_REFUSED, copied). */
const PEACE = ['war: front', 'war: aggressor', 'war: at war'];

/**
 * MODERATE_GAP: replaces the stored text of `outlookHookSiblings.js :: MODERATE_GAP_TWIN` only (the starving set's twin:
 * it is reached where the food band is Import-Dependent or Pressured, the route not isolated and no siege, and the
 * record's route there is always `road`: 78 of 78). Pool-level admission is the twin's own (needs `food: ≤ pressured`,
 * excludes `food: ≤ deficit`, `route: isolated`, `crisis: under_siege`), already met wherever the twin stands.
 */
export const MODERATE_GAP = [
  { id: 'gap-canon', text: 'The settlement grows less food than it eats, and a merchant has offered to make up the difference for a price that is not paid in coin.' },
  { id: 'gap-price', text: 'The settlement grows less food than it eats, and what it buys in to make up the rest costs more each month; people are asking who sets the price.' },
  { id: 'gap-keep', text: 'The settlement grows less food than it eats, and the families who grow the most have started keeping it back rather than selling it here.' },
  { id: 'gap-buyer', text: 'The settlement grows less food than it eats, and someone must go out and buy the rest this season; nobody wants the errand, and nobody trusts whoever offers.' },
  { id: 'gap-carters', needs: ['route: road'], text: 'The carters who bring food up the road have raised their rates, and the settlement, which grows less than it eats, must pay them or send its own carts.' },
  { id: 'gap-market', needs: ['market'], text: 'A stranger bought up most of the grain in the market before the locals could get to it, and the settlement grows too little of its own to shrug it off.' },
  { id: 'gap-granary', needs: ['institution: granary'], text: 'The settlement grows less food than it eats, and those who keep the granary are arguing over whether to open it now or hold it against a leaner month.' },
  { id: 'gap-mill', needs: ['institution: mill'], text: 'Less grain reaches the mill each week than it did, and the miller wants to know where the rest is going; the settlement grows too little to lose any of it.' },
  { id: 'gap-tavern', needs: ['institution: tavern', 'route: road'], text: 'Travellers at the tavern talk of cheap grain a few days down the road; the settlement grows less than it eats, and someone must decide whether to send for it.' },
  { id: 'gap-mountain', needs: ['terrain: mountain', 'route: road'], text: 'Little grows on the slopes around the settlement, and the mule trains that bring up the rest of its food now want paying before they load.' },
  { id: 'gap-desert', needs: ['terrain: desert'], text: 'Little grows in the dry country here, and the caravan that brings the rest of the settlement\'s food is overdue, with no word sent ahead.' },
  { id: 'gap-forest', needs: ['terrain: forest'], text: 'The clearings here do not grow enough food for the settlement; some want to clear more of the forest, and others will not see it cut.' },
];

/**
 * IRON_PEACE: replaces the stored text of any peacetime iron hook (`outlookHookSiblings.js :: PEACE_IRON_HOOKS`, the three
 * events and their three smith twins). The branch already guarantees the record imports iron (`warIronHook.js ::
 * ironHookStands`) and holds the peace; every row refuses the war states, as the six rows do today.
 */
export const IRON_PEACE = [
  { id: 'iron-price', needs: ['institution: smith'], excludes: PEACE, text: 'Iron has doubled in price this season, and tools are being mended with scrap. Work slows, and people are starting to complain.' },
  { id: 'iron-price-t', excludes: ['institution: smith', ...PEACE], text: 'Iron has doubled in price this season, and metal for tools and repairs is hard to come by. Work slows, and people are starting to complain.' },
  { id: 'iron-carts', needs: ['institution: smith'], excludes: PEACE, text: 'The iron carts are three weeks late and the carters will not say why. What iron there is goes out in rations, and work waits on mended tools.' },
  { id: 'iron-carts-t', excludes: ['institution: smith', ...PEACE], text: 'The iron carts are three weeks late and the carters will not say why. Broken tools stay broken, and work waits.' },
  { id: 'iron-toll', needs: ['institution: smith'], excludes: PEACE, text: 'A new toll on the iron road has made metal dear. People blame whoever set it, and the tools still need mending.' },
  { id: 'iron-toll-t', excludes: ['institution: smith', ...PEACE], text: 'A new toll on the iron road has made metal dear. Nobody will say who set it, and the tools still need mending.' },
  { id: 'iron-slag', excludes: PEACE, text: 'The last iron that came in was poor, brittle and full of slag, and those who paid for it want their money back from whoever sold it.' },
  { id: 'iron-bidding', excludes: PEACE, text: 'Iron is scarce this season, and two buyers here are bidding against each other for every load that arrives.' },
  { id: 'iron-river', needs: ['route: river'], excludes: PEACE, text: 'The iron barges are late coming up the river, and work here waits on tools nobody can mend.' },
  { id: 'iron-port', needs: ['route: port'], excludes: PEACE, text: 'The ship that carries the season\'s iron has not come in, and nobody will say what became of it.' },
  { id: 'iron-crossroads', needs: ['route: crossroads'], excludes: PEACE, text: 'Iron that used to be sold here on its way through now goes on to a better buyer, and the place is left short.' },
  { id: 'iron-market', needs: ['market'], excludes: PEACE, text: 'Iron is sold by the pound in the market now, and the price goes up every week.' },
  { id: 'iron-forge', needs: ['institution: smith'], excludes: PEACE, text: 'The forge here is down to its last good iron, and the work waiting on it grows longer every day.' },
];

/** The houses each row needs (the chair's 17:13 condition, part 2), for the security reader. */
export const HOUSES = { market: 'market', 'institution: granary': 'granary', 'institution: mill': 'mill', 'institution: tavern': 'tavern', 'institution: smith': 'smith' };

/**
 * One atom against one fact row (measure.mjs :: factRow). Unanswered (null/undefined) refuses, as a conservative stand-in.
 * @param {any} f @param {string} atom @returns {boolean}
 */
export function holds(f, atom) {
  const [dim, key] = atom.split(/:\s*/);
  if (dim === 'route') return f.route === key;
  if (dim === 'terrain') return f.terrain === key;
  if (dim === 'war') return f.war === key;
  if (dim === 'institution') return f.inst?.[key] === true;
  if (dim === 'market') return f.market === true;
  if (dim === 'guild') return f.guild === true;
  throw new Error(`composer: no evaluator for the atom ${atom}`);
}
/** @param {any} f @param {any} row */
export const admits = (f, row) => (row.needs || []).every((a) => holds(f, a)) && !(row.excludes || []).some((a) => holds(f, a));

/** Which pool a stored hook's template draws from. */
export const POOL_OF = { 'S1t.moderateGapTwin': ['moderateGap', MODERATE_GAP], 'I2.price': ['ironPeace', IRON_PEACE], 'I3.carts': ['ironPeace', IRON_PEACE], 'I4.toll': ['ironPeace', IRON_PEACE] };

/**
 * The composed text for one stored hook of one place. `k` carries the house's two hashes (fnv1a32, hashKey).
 * @returns {{ text: string, id: string|null, how: string }}
 */
export function compose(k, place, hook, drop = []) {
  const p = POOL_OF[hook.template];
  if (!p) return { text: hook.masked, id: null, how: 'untouched' };
  const [poolId, all] = p;
  if (drop.includes(poolId)) return { text: hook.masked, id: null, how: `${poolId}:pool-dropped` }; // e.g. `ironPeace`: the gap pool alone
  const pool = all.filter((r) => !(r.needs || []).some((a) => drop.includes(a.split(':')[0])));
  const f = place.atWriter.facts; // the facts at the proposed call line (equal to the final record's but `guild`: section C)
  const key = `${place.seed}::viabilityHooks::${poolId}`;
  const drawn = pool[k.fnv1a32(key) % pool.length];
  if (admits(f, drawn)) return { text: drawn.text, id: drawn.id, how: `${poolId}:drawn` };
  let best = null; let bestKey = -1;
  for (const r of pool) { if (!admits(f, r)) continue; const h = k.hashKey(`${key}::${r.id}`); if (h > bestKey) { best = r; bestKey = h; } }
  if (best) return { text: best.text, id: best.id, how: `${poolId}:argmax` };
  return { text: hook.masked, id: 'kept', how: `${poolId}:none-admitted` };
}
