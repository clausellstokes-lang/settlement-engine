// PLACE-1 MEASURE, safetyDesc: THE CANDIDATE COMPOSER, simulated here (scratch; nothing under src/ changes).
// The pools are the proposal's section D, row for row (a builder would move them, unchanged, to their own data file).
// Every wording is a declared row `{ text, needs?, excludes? }` (the drawDeclared shape); index 0 of every pool is
// TODAY's sentence, declaring only what its branch already guarantees, so a falsy seed (every seedless unit test)
// prints today's line byte for byte (proseHash.js's CANONICAL-AT-ZERO law).
//
// The selection is the house's own: drawDeclared over the FULL pool with pickVariant as the draw (one hash modulus,
// no roll), a refused winner resolving to the admitted argmax (drawDeclared.js), keyed
//   `${seed}::safetyProfile:safetyDesc:<slot>`
// where `seed` is the active stream's seed at the writer (getActiveRng()?.seed, the key voiceOf already uses in the same file).

/** @param {string} text @param {string[]} [needs] @param {string[]} [excludes] */
const row = (text, needs = [], excludes = []) => Object.freeze({ text, ...(needs.length ? { needs: Object.freeze(needs) } : {}), ...(excludes.length ? { excludes: Object.freeze(excludes) } : {}) });

// ── Moderate, thorp and hamlet (today: TINY_MODERATE_LINE) ──
export const TINY_MODERATE = Object.freeze([
  row('The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of.'),
  row('Everyone here knows everyone, so what trouble there is is hard to hide.'),
  row('In a place this small, a wrong done is known to all by nightfall.'),
  row('Order here rests with the neighbours: little happens that someone does not see.'),
  row('The households look out for one another, and a quarrel or a theft is soon talked of.'),
  row('Strangers are noticed here, and so is anything that goes missing.'),
  row('People here watch over one another\'s doors, and word of any trouble travels fast.'),
  row('If real trouble comes, the militia turns out; day to day, the neighbours watch one another.', ['militia']),
  row('Few strangers come this far, and the neighbours keep an eye on one another.', ['route: isolated']),
  row('A place this size has few secrets, and what trouble there is soon comes out.'),
]);

// ── Moderate, village and larger: the four sentence slots ──
export const MIXED_OPENING = Object.freeze([
  row('A mix of safer and more exposed areas.'),
  row('Some parts of the place are safer than others.'),
  row('Safety here depends on where you are, and when.'),
  row('Most of the place is safe enough, though not all of it.'),
  row('The busy ways are safe enough; the edges less so.'),
  row('Some quarters are safer than others.', ['tier: ≥ town']),
  row('The market and the busy streets are safe enough; other parts less so.', ['market', 'tier: ≥ village']),
  row('Order holds in most of the place, but not everywhere.'),
]);

/** The force slot, by the branch's force (the writer's `lawRef` order: garrison, watch, militia, none). */
export const MIXED_FORCE = Object.freeze({
  garrison: Object.freeze([
    row('The garrison patrols the main paths; quieter spots after dark carry genuine risk.', ['garrison']),
    row('The garrison patrols the main streets; the quiet ones after dark carry real risk.', ['garrison', 'tier: ≥ village']),
    row('Soldiers of the garrison walk the main streets; the back ways are riskier after dark.', ['garrison', 'tier: ≥ village']),
    row('The garrison keeps the main thoroughfares; away from them, after dark, the risk is real.', ['garrison']),
    row('The garrison and the watch share the main streets; the quiet ones after dark are less safe.', ['garrison', 'watch', 'tier: ≥ village']),
    row('The garrison holds the gates and patrols the main streets; quieter spots after dark carry real risk.', ['garrison', 'gate', 'tier: ≥ village']),
    row('By day the garrison is seen on every main street; after dark, the quieter spots carry genuine risk.', ['garrison', 'force walks by day', 'tier: ≥ village']),
    row('The garrison patrols the market and the main streets; elsewhere, after dark, there is genuine risk.', ['garrison', 'market', 'tier: ≥ village']),
  ]),
  watch: Object.freeze([
    row('The watch covers the main paths; quieter spots after dark carry genuine risk.', ['watch']),
    row('The watch covers the main streets; the quiet ones after dark carry real risk.', ['watch', 'tier: ≥ village']),
    row('The watch keeps to the main streets; the side lanes after dark are another matter.', ['watch', 'tier: ≥ village']),
    row('Watchmen walk the main streets; away from them, after dark, the risk is real.', ['watch', 'tier: ≥ village']),
    row('The watch walks the main streets by night; even so, the quieter spots after dark carry genuine risk.', ['watch', 'tier: ≥ village'], ['force walks by day']),
    row('The watch holds the gates and walks the main streets; quieter spots after dark carry real risk.', ['watch', 'gate', 'tier: ≥ village']),
    row('The watch is seen on the main streets by day; quieter spots after dark carry genuine risk.', ['watch', 'force walks by day', 'tier: ≥ village']),
    row('The watch keeps an eye on the market and the main streets; quieter spots after dark carry genuine risk.', ['watch', 'market', 'tier: ≥ village']),
  ]),
  militia: Object.freeze([
    row('Militia volunteers patrol the main paths; quieter spots after dark carry genuine risk.', ['militia']),
    row('Volunteers of the militia walk the main paths; the quieter spots after dark are riskier.', ['militia']),
    row('The militia keeps an eye on the main paths; away from them, after dark, the risk is real.', ['militia']),
    row('Militia volunteers look out along the main paths; quieter spots after dark carry real risk.', ['militia']),
  ]),
  none: Object.freeze([
    row('Locals watch over the main paths; quieter spots after dark carry genuine risk.'),
    row('Neighbours look out along the main paths; away from them, after dark, there is real risk.'),
    row('The people who live along the main paths watch them; quieter spots after dark are less safe.'),
    row('Locals watch over the main ways themselves; after dark, the quieter spots carry genuine risk.'),
    row('The villagers keep an eye on the main paths; the quiet spots after dark carry real risk.', ['tier: village']),
    row('Stallholders and neighbours keep an eye on the market and the main paths; quieter spots after dark carry genuine risk.', ['market']),
    row('Locals keep an eye on the road through and the main paths; quieter spots after dark carry real risk.', ['route: road']),
    row('Locals keep an eye on the crossroads and the main paths; quieter spots after dark carry real risk.', ['route: crossroads']),
  ]),
});

export const MIXED_CORNERS = Object.freeze([
  row('Residents know which corners to avoid.'),
  row('People who live here know where not to go.'),
  row('Locals know which lanes to keep out of.', ['tier: ≥ village']),
  row('Those who live here soon learn where not to linger.'),
  row('Most people here know where trouble is likely, and keep clear of it.'),
  row('The people here know their own streets, and which to keep away from.', ['tier: ≥ village']),
  row('Residents give the worst corners a wide berth.'),
  row('Anyone who lives here can say which ways are best avoided.'),
]);

/** The Moderate wall note, in both branches (today: ' The walls keep the trouble inside, off the roads beyond.'). */
export const MODERATE_WALLS = Object.freeze([
  row(' The walls keep the trouble inside, off the roads beyond.', ['walls']),
  row(' The palisade keeps out what comes from beyond; what trouble there is starts within.', ['palisade']),
  row(' Behind the palisade, what trouble there is comes from within.', ['palisade']),
  row(' The walls see to what comes from outside; what trouble there is starts at home.', ['walls']),
  row(' The stone walls keep the outside out; the trouble there is starts within.', ['walls'], ['palisade']),
  row(' The gates are watched, so trouble from outside rarely gets in; what there is starts within.', ['gate', 'guardPresence']),
  row(' The walls see to the approaches; the risk that remains is within.', ['walls']),
  row(' Whoever comes in passes the gates; the trouble that remains is the place\'s own.', ['gate']),
  row(' The garrison keeps the walls; within them, the risk is the place\'s own.', ['walls', 'garrison']),
]);

// ── Unsafe (today: "Crime is a persistent and visible problem. <force> <advice><walls>") ──
export const UNSAFE_OPENING = Object.freeze([
  row('Crime is a persistent and visible problem.'),
  row('Crime here is common, and nobody pretends otherwise.'),
  row('Crime here is common and out in the open.'),
  row('Crime here is steady and out in the open.'),
]);
export const UNSAFE_GARRISON = Object.freeze([
  row('The garrison is overwhelmed or corrupt.', ['garrison']),
  row('The garrison cannot keep up with it, or has stopped trying.', ['garrison']),
  row('The garrison is too stretched, or too easily bought, to stop it.', ['garrison']),
  row('Neither the garrison nor the watch keeps pace with it.', ['garrison', 'watch']),
]);
export const UNSAFE_ADVICE = Object.freeze([
  row('Travelers are advised to move in groups and keep valuables hidden.', [], ['crisis: siege']),
  row('Visitors are told to keep together and keep their purses out of sight.', [], ['crisis: siege']),
  row('Newcomers learn quickly to go about in company and show nothing worth taking.', [], ['crisis: siege']),
  row('In the market, people keep a hand on their purses and go in company.', ['market'], ['crisis: siege']),
]);
export const UNSAFE_WALLS = Object.freeze([
  row(" Walls slow entry but don't solve what happens inside them.", ['walls']),
  row(' The walls keep out what comes from beyond, not what is already within.', ['walls']),
  row(' The gates are kept, but the trouble is already inside.', ['gate', 'guardPresence']),
]);

/**
 * Compose the line for the branches above the bar, at the writer. Returns null for any other branch (the line stays
 * as written). `deps` are the repo's own modules (drawDeclared, pickVariant, factsOf), handed in by the caller.
 * @param {{ label: string, tier: string, institutions: unknown[], config: any, seed: string | null | undefined, stresses: string[] }} at
 * @param {{ drawDeclared: Function, pickVariant: Function, factsOf: Function, defenceOf: Function }} deps
 */
export function composeSafetyDesc(at, deps) {
  const { drawDeclared, pickVariant, factsOf, defenceOf } = deps;
  const d = defenceOf({ institutions: at.institutions });
  const tiny = ['thorp', 'hamlet'].includes(at.tier);
  const facts = () => factsOf({ institutions: at.institutions, tier: at.tier, config: at.config, stress: (at.stresses || []).map((type) => ({ type })) });
  const pick = (slot, pool) => {
    const key = `${at.seed ?? ''}::safetyProfile:safetyDesc:${slot}`;
    const r = drawDeclared(pool, { draw: (p) => pickVariant(p, at.seed ? key : null), facts, key, poolId: `safetyDesc:${slot}`, surface: 'defense', drawKind: 'H' });
    if (Array.isArray(at.chosen)) at.chosen.push({ slot, line: r.line, resolvedBy: r.resolvedBy });
    return String(r.text ?? pool[0].text);
  };
  if (at.label === 'Moderate') {
    const walls = d.walls ? pick('walls', MODERATE_WALLS) : '';
    if (tiny) return `${pick('tiny', TINY_MODERATE)}${walls}`;
    const force = d.garrison ? 'garrison' : d.watch ? 'watch' : d.militia ? 'militia' : 'none';
    return `${pick('opening', MIXED_OPENING)} ${pick(`force.${force}`, MIXED_FORCE[force])} ${pick('corners', MIXED_CORNERS)}${walls}`;
  }
  if (at.label === 'Unsafe' && d.garrison && !(at.stresses || []).includes('under_siege')) {
    const walls = d.walls ? pick('unsafe.walls', UNSAFE_WALLS) : '';
    return `${pick('unsafe.opening', UNSAFE_OPENING)} ${pick('unsafe.garrison', UNSAFE_GARRISON)} ${pick('unsafe.advice', UNSAFE_ADVICE)}${walls}`;
  }
  return null;
}

/** Every pool, by name (for the register checks in project.mjs). */
export const POOLS = Object.freeze({ TINY_MODERATE, MIXED_OPENING, ...Object.fromEntries(Object.entries(MIXED_FORCE).map(([k, v]) => [`MIXED_FORCE.${k}`, v])), MIXED_CORNERS, MODERATE_WALLS, UNSAFE_OPENING, UNSAFE_GARRISON, UNSAFE_ADVICE, UNSAFE_WALLS });
