/**
 * src/data/safetyDescLines.js — THE SAFETY LINE'S POOLS (PLACE-1's first unit, 2026-11-20; the owner's order to fix the
 * sameness fault; `docs/chair/2026-11-20/content/place/safetyDesc-MEASURE.md` §D, approved by the chair at 16:47 UTC with
 * the build brief's amendments: the watch's night row dropped, no new atom, the city's Unsafe line in, walls row 4 reworded).
 * The chair's read of 18:36 UTC added 21 rows (TINY_MODERATE 10–15, MIXED_OPENING 8–10, MIXED_FORCE.garrison 8–9, .watch 7–8,
 * .none 8–10, MIXED_CORNERS 8–12; `safetyDesc-VILLAGE-LINES.md`) and the threat-family declarations (`excludes: ['crisis: threat']`)
 * on the three "safe enough" openings and on the Travelers advice: the branches run only where no threat-family crisis stands.
 *
 * The Defense tab's safety line (`economicState.safetyProfile.safetyDesc`) printed one sentence in up to 73 of 100 places a
 * size. Each sentence slot of the branches above the bar draws from its pool here, through
 * `safetyProfile.js :: generateSafetyProfile` (`drawDeclared` with `kernel/proseHash.js :: pickVariantMixed`, keyed
 * `${seed}::safetyProfile:safetyDesc:<slot>`; no roll). Every row is a declared line (`drawDeclared.js`'s shape): its
 * `needs` / `excludes` are atoms of `factVocabulary.js`, read at the writer by `factsOf({ institutions, tier, config })`;
 * no row reads a hideable fact (the chair's condition of 16:51 UTC: the line prints on player and public pages).
 * INDEX 0 IS TODAY'S SENTENCE, declaring only what its branch guarantees: a falsy seed prints today's line byte for byte.
 * A wall note keeps its leading space (it is appended to the line).
 *
 * Pure data: the rows and their pool names, nothing else.
 */

/** Moderate, thorp and hamlet (the whole line before the wall note). */
export const TINY_MODERATE = Object.freeze([
  Object.freeze({ text: 'The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of.' }),
  Object.freeze({ text: 'Everyone here knows everyone, so what trouble there is is hard to hide.' }),
  Object.freeze({ text: 'In a place this small, a wrong done is known to all by nightfall.' }),
  Object.freeze({ text: 'Order here rests with the neighbours: little happens that someone does not see.' }),
  Object.freeze({ text: 'The households look out for one another, and a quarrel or a theft is soon talked of.' }),
  Object.freeze({ text: 'Strangers are noticed here, and so is anything that goes missing.' }),
  Object.freeze({ text: 'People here watch over one another\'s doors, and word of any trouble travels fast.' }),
  Object.freeze({ text: 'If real trouble comes, the militia turns out; day to day, the neighbours watch one another.', needs: ['militia'] }),
  Object.freeze({ text: 'Few strangers come this far, and the neighbours keep an eye on one another.', needs: ['route: isolated'] }),
  Object.freeze({ text: 'A place this size has few secrets, and what trouble there is soon comes out.' }),
  Object.freeze({ text: 'A wrong done here is a wrong done to neighbours, and it is not soon forgotten.' }),
  Object.freeze({ text: 'Every household knows the others\' business, which keeps most quarrels small.' }),
  Object.freeze({ text: 'Little here goes unnoticed for long; the neighbours see to that.' }),
  Object.freeze({ text: 'Trouble here is settled among neighbours, mostly before it grows.' }),
  Object.freeze({ text: 'Folk here look in on one another, and what one household sees, the next soon hears.' }),
  Object.freeze({ text: 'There are few places here to do wrong unseen.' }),
]);

/** Moderate, village and larger: the opening sentence. */
export const MIXED_OPENING = Object.freeze([
  Object.freeze({ text: 'A mix of safer and more exposed areas.' }),
  Object.freeze({ text: 'Some parts of the place are safer than others.' }),
  Object.freeze({ text: 'Safety here depends on where you are, and when.' }),
  Object.freeze({ text: 'Most of the place is safe enough, though not all of it.', excludes: ['crisis: threat'] }),
  Object.freeze({ text: 'The busy ways are safe enough; the edges less so.', excludes: ['crisis: threat'] }),
  Object.freeze({ text: 'Some quarters are safer than others.', needs: ['tier: ≥ town'] }),
  Object.freeze({ text: 'The market and the busy streets are safe enough; other parts less so.', needs: ['market', 'tier: ≥ village'], excludes: ['crisis: threat'] }),
  Object.freeze({ text: 'Order holds in most of the place, but not everywhere.' }),
  Object.freeze({ text: 'It is safer here by day than by night.' }),
  Object.freeze({ text: 'The well-used parts of the place are the better kept; the outskirts less so.' }),
  Object.freeze({ text: 'Most trouble here keeps to the edges and the late hours.' }),
]);

/** Moderate, village and larger: the force sentence, by the branch's force (the writer's order: garrison, watch, militia, none). */
export const MIXED_FORCE = Object.freeze({
  garrison: Object.freeze([
    Object.freeze({ text: 'The garrison patrols the main paths; quieter spots after dark carry genuine risk.', needs: ['garrison'] }),
    Object.freeze({ text: 'The garrison patrols the main streets; the quiet ones after dark carry real risk.', needs: ['garrison', 'tier: ≥ village'] }),
    Object.freeze({ text: 'Soldiers of the garrison walk the main streets; the back ways are riskier after dark.', needs: ['garrison', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The garrison keeps the main thoroughfares; away from them, after dark, the risk is real.', needs: ['garrison'] }),
    Object.freeze({ text: 'The garrison and the watch share the main streets; the quiet ones after dark are less safe.', needs: ['garrison', 'watch', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The garrison holds the gates and patrols the main streets; quieter spots after dark carry real risk.', needs: ['garrison', 'gate', 'tier: ≥ village'] }),
    Object.freeze({ text: 'By day the garrison is seen on every main street; after dark, the quieter spots carry genuine risk.', needs: ['garrison', 'force walks by day', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The garrison patrols the market and the main streets; elsewhere, after dark, there is genuine risk.', needs: ['garrison', 'market', 'tier: ≥ village'] }),
    Object.freeze({ text: 'Garrison soldiers keep to the main streets; the side lanes after dark are riskier.', needs: ['garrison', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The garrison\'s presence is felt on the main ways; off them, after dark, the risk is real.', needs: ['garrison'] }),
  ]),
  watch: Object.freeze([
    Object.freeze({ text: 'The watch covers the main paths; quieter spots after dark carry genuine risk.', needs: ['watch'] }),
    Object.freeze({ text: 'The watch covers the main streets; the quiet ones after dark carry real risk.', needs: ['watch', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The watch keeps to the main streets; the side lanes after dark are another matter.', needs: ['watch', 'tier: ≥ village'] }),
    Object.freeze({ text: 'Watchmen walk the main streets; away from them, after dark, the risk is real.', needs: ['watch', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The watch holds the gates and walks the main streets; quieter spots after dark carry real risk.', needs: ['watch', 'gate', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The watch is seen on the main streets by day; quieter spots after dark carry genuine risk.', needs: ['watch', 'force walks by day', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The watch keeps an eye on the market and the main streets; quieter spots after dark carry genuine risk.', needs: ['watch', 'market', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The watch makes its rounds of the main streets; past them, after dark, the risk is real.', needs: ['watch', 'tier: ≥ village'] }),
    Object.freeze({ text: 'The main ways are the watch\'s; the lanes beside them after dark are not.', needs: ['watch'] }),
  ]),
  militia: Object.freeze([
    Object.freeze({ text: 'Militia volunteers patrol the main paths; quieter spots after dark carry genuine risk.', needs: ['militia'] }),
    Object.freeze({ text: 'Volunteers of the militia walk the main paths; the quieter spots after dark are riskier.', needs: ['militia'] }),
    Object.freeze({ text: 'The militia keeps an eye on the main paths; away from them, after dark, the risk is real.', needs: ['militia'] }),
    Object.freeze({ text: 'Militia volunteers look out along the main paths; quieter spots after dark carry real risk.', needs: ['militia'] }),
  ]),
  none: Object.freeze([
    Object.freeze({ text: 'Locals watch over the main paths; quieter spots after dark carry genuine risk.' }),
    Object.freeze({ text: 'Neighbours look out along the main paths; away from them, after dark, there is real risk.' }),
    Object.freeze({ text: 'The people who live along the main paths watch them; quieter spots after dark are less safe.' }),
    Object.freeze({ text: 'Locals watch over the main ways themselves; after dark, the quieter spots carry genuine risk.' }),
    Object.freeze({ text: 'The villagers keep an eye on the main paths; the quiet spots after dark carry real risk.', needs: ['tier: village'] }),
    Object.freeze({ text: 'Stallholders and neighbours keep an eye on the market and the main paths; quieter spots after dark carry genuine risk.', needs: ['market'] }),
    Object.freeze({ text: 'Locals keep an eye on the road through and the main paths; quieter spots after dark carry real risk.', needs: ['route: road'] }),
    Object.freeze({ text: 'Locals keep an eye on the crossroads and the main paths; quieter spots after dark carry real risk.', needs: ['route: crossroads'] }),
    Object.freeze({ text: 'Most comings and goings on the main paths are seen by someone; the quieter spots after dark are less safe.' }),
    Object.freeze({ text: 'Doors and windows face the main paths, and someone is usually looking out; the dark spots off them are another matter.' }),
    Object.freeze({ text: 'By day little passes on the main paths unseen; after dark, the quieter spots carry real risk.' }),
  ]),
});

/** Moderate, village and larger: the corners sentence. */
export const MIXED_CORNERS = Object.freeze([
  Object.freeze({ text: 'Residents know which corners to avoid.' }),
  Object.freeze({ text: 'People who live here know where not to go.' }),
  Object.freeze({ text: 'Locals know which lanes to keep out of.', needs: ['tier: ≥ village'] }),
  Object.freeze({ text: 'Those who live here soon learn where not to linger.' }),
  Object.freeze({ text: 'Most people here know where trouble is likely, and keep clear of it.' }),
  Object.freeze({ text: 'The people here know their own streets, and which to keep away from.', needs: ['tier: ≥ village'] }),
  Object.freeze({ text: 'Residents give the worst corners a wide berth.' }),
  Object.freeze({ text: 'Anyone who lives here can say which ways are best avoided.' }),
  Object.freeze({ text: 'Locals can tell a newcomer which places to steer clear of.' }),
  Object.freeze({ text: 'Those born here know which turnings to leave alone after dark.' }),
  Object.freeze({ text: 'Residents keep to the places they know once night falls.' }),
  Object.freeze({ text: 'Ask anyone who lives here, and they will name the spots to avoid.' }),
  Object.freeze({ text: 'Long-time residents know the risky spots, and keep away from them.' }),
]);

/** The Moderate wall note, both branches (printed where the walls stand). */
export const MODERATE_WALLS = Object.freeze([
  Object.freeze({ text: ' The walls keep the trouble inside, off the roads beyond.', needs: ['walls'] }),
  Object.freeze({ text: ' The palisade keeps out what comes from beyond; what trouble there is starts within.', needs: ['palisade'] }),
  Object.freeze({ text: ' Behind the palisade, what trouble there is comes from within.', needs: ['palisade'] }),
  Object.freeze({ text: ' The walls see to what comes from outside; what trouble there is starts at home.', needs: ['walls'] }),
  Object.freeze({ text: ' The walls keep the outside out; the trouble there is starts within.', needs: ['walls'], excludes: ['palisade'] }),
  Object.freeze({ text: ' The gates are watched, so trouble from outside rarely gets in; what there is starts within.', needs: ['gate', 'guardPresence'] }),
  Object.freeze({ text: ' The walls see to the approaches; the risk that remains is within.', needs: ['walls'] }),
  Object.freeze({ text: ' Whoever comes in passes the gates; the trouble that remains is the place\'s own.', needs: ['gate'] }),
  Object.freeze({ text: ' The garrison keeps the walls; within them, the risk is the place\'s own.', needs: ['walls', 'garrison'] }),
]);

/** Unsafe with a garrison: the opening sentence. */
export const UNSAFE_OPENING = Object.freeze([
  Object.freeze({ text: 'Crime is a persistent and visible problem.' }),
  Object.freeze({ text: 'Crime here is common, and nobody pretends otherwise.' }),
  Object.freeze({ text: 'Crime here is common and out in the open.' }),
  Object.freeze({ text: 'Crime here is steady and out in the open.' }),
]);

/** Unsafe with a garrison: the garrison sentence. */
export const UNSAFE_GARRISON = Object.freeze([
  Object.freeze({ text: 'The garrison is overwhelmed or corrupt.', needs: ['garrison'] }),
  Object.freeze({ text: 'The garrison cannot keep up with it, or has stopped trying.', needs: ['garrison'] }),
  Object.freeze({ text: 'The garrison is too stretched, or too easily bought, to stop it.', needs: ['garrison'] }),
  Object.freeze({ text: 'Neither the garrison nor the watch keeps pace with it.', needs: ['garrison', 'watch'] }),
]);

/** Unsafe: the advice (no travellers come in under a siege: every row excludes it). */
export const UNSAFE_ADVICE = Object.freeze([
  Object.freeze({ text: 'Travelers are advised to move in groups and keep valuables hidden.', excludes: ['crisis: threat'] }), // the threat family (siege among it): the outside class's families, the branch's guarantee
  Object.freeze({ text: 'Visitors are told to keep together and keep their purses out of sight.', excludes: ['crisis: siege'] }),
  Object.freeze({ text: 'Newcomers learn quickly to go about in company and show nothing worth taking.', excludes: ['crisis: siege'] }),
  Object.freeze({ text: 'In the market, people keep a hand on their purses and go in company.', needs: ['market'], excludes: ['crisis: siege'] }),
]);

/** Unsafe: the wall note (printed where the walls stand). */
export const UNSAFE_WALLS = Object.freeze([
  Object.freeze({ text: ' Walls slow entry but don\'t solve what happens inside them.', needs: ['walls'] }),
  Object.freeze({ text: ' The walls keep out what comes from beyond, not what is already within.', needs: ['walls'] }),
  Object.freeze({ text: ' The gates are kept, but the trouble is already inside.', needs: ['gate', 'guardPresence'] }),
]);
