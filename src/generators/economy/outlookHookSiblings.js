/**
 * economy/outlookHookSiblings.js — the outlook hooks' declared sibling sets, carried beside the
 * branches of `foodBalance.js :: deriveSupplyRiskAnalysis` that print them. Moved VERBATIM out of
 * foodBalance.js (LANDING-R2, the chair's ruling under ODQ §934.105: the module ceiling is cured by
 * a split, never raised); foodBalance.js re-exports OUTLOOK_HOOK_SIBLINGS, so every importer keeps
 * its path, and keeps the moderate-gap twin's grade (`moderateGapGrade`), which prints, beside it.
 */

/**
 * One declared sibling set: the original `needs` its atoms; its twin (when the slot needs one)
 * `excludes` them. @param {string} text @param {string[]} needs @param {string} [twin]
 */
const declaredSet = (text, needs, twin) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze(needs) }),
  ...(twin === undefined ? [] : [Object.freeze({ text: twin, twinOf: text, excludes: Object.freeze(needs) })]),
]);

/**
 * THE OUTLOOK HOOKS' DECLARED SIBLINGS, CARRIED (CENSUS-3d unit 6, 2026-11-05;
 * `docs/DESIGN_POOL_CENSUS.md` §3.1, the chair's ruling R-C). `deriveSupplyRiskAnalysis` prints its
 * hooks from inline T branches; a branch is the mechanism lane's to route through
 * `drawDeclared.js :: resolveSibling` (Appendix B item 23), so the declarations stand HERE, keyed
 * by the printed text, and no consumer reads them yet (byte-identical). A branch's own key is not
 * re-declared: the dam (route river), the blockade (route port, coastal), the bandits (route road).
 * Measured on soak1k-0..199 before the change, printed / false by the final record: the timber
 * 33 / 16 (`navigable`: the reader:hook-pools `[sea]` class, "shipbuilding" on plains and desert
 * roads), the iron 38 / 3 (`institution: smith`), the starving 8 / 0 (re-read by CENSUS-3g once R-AM
 * ledgered the kept-refused original: 162 of 1,000 false, reworded and twinned below). The three
 * twins are the chair's rulings (R-G), recorded in `docs/CENSUS_3_LANE_2026-11-04.md`.
 */
const WAR_IRON_HOOK = 'War has taken the iron: the metal suppliers sell to the armies first, and the smiths have nothing to mend tools with. Work slows, and people are starting to complain.';
/** The iron line where the record holds no war: [original (needs a smith), twin]. */
export const PEACE_IRON_HOOKS = Object.freeze([
  Object.freeze(['The iron merchants have doubled their price this season, and the smiths are mending tools with scrap. Work slows, and people are starting to complain.',
    'The iron merchants have doubled their price this season, and iron for tools and repairs is hard to come by. Work slows, and people are starting to complain.']),
  Object.freeze(['The iron carts are three weeks late and the carters will not say why. The smiths are rationing what they have, and work waits on mended tools.',
    'The iron carts are three weeks late and the carters will not say why. Broken tools stay broken, and work waits.']),
  Object.freeze(['A new toll on the iron road has made metal dear. The smiths blame whoever set it, and the tools still need mending.',
    'A new toll on the iron road has made metal dear. Nobody will say who set it, and the tools still need mending.']),
]);
export { WAR_IRON_HOOK };
/** The war states a peacetime event refuses (domain/facts/warState.js :: WAR_STATES, less the peace). */
const WAR_STATES_REFUSED = Object.freeze(['war: front', 'war: aggressor', 'war: at war']);
/** COHERENCE-AGREE: the timber line's second event (foodBalance.js prints it), so no one line carries the pool. */
export const TIMBER_RAFT_HOOK = 'The timber rafts stopped coming a month ago, and the shipwrights and builders are bidding against each other for what is left in the yards.';
export const MODERATE_GAP_TWIN = 'The settlement grows less food than it eats, and a merchant has offered to make up the difference at a price the settlement cannot pay in coin.';
const STARVING_HOOK = 'The settlement is starving. Its hungriest are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';
export const OUTLOOK_HOOK_SIBLINGS = Object.freeze({
  "Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it. Find another supplier, or find out what is in those woods?": declaredSet(
    "Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it. Find another supplier, or find out what is in those woods?", ['navigable'],
    "Something is killing the forest the timber comes from, and the settlement's building trades stall without it. Find another supplier, or find out what is in those woods?"),
  // COHERENCE-AGREE (the chair's ruling on hooks, 2026-11-11): the war line asserts a war, so it
  // excludes peace; its twin answers the smith, as every twin answers its original's needs.
  [WAR_IRON_HOOK]: Object.freeze([
    Object.freeze({ text: WAR_IRON_HOOK, needs: Object.freeze(['institution: smith']), excludes: Object.freeze(['war: peace']) }),
    Object.freeze({
      text: 'War has taken the iron: the metal suppliers sell to the armies first, and the iron for tools and repairs stops arriving. Work slows, and people are starting to complain.',
      // COHERENCE-AGREE-3 (F4): the twin asserts the war too, so it declares the peace it refuses.
      twinOf: WAR_IRON_HOOK, excludes: Object.freeze(['institution: smith', 'war: peace']), // the site prints either war line only where the record holds a war
    }),
  ]),
  [TIMBER_RAFT_HOOK]: declaredSet(TIMBER_RAFT_HOOK, ['navigable'],
    'The timber carts stopped coming a month ago, and the builders are bidding against each other for what is left in the yards.'),
  // In peace the iron line opens an event of its own (a price, a late cart, a toll), drawn by the
  // place's size with no roll (foodBalance.js prints all three), each with its smith twin.
  // COHERENCE-AGREE-3 (F4): each presumes the peace, so each, and its twin, refuses every war state; the site
  // prints them only where the record holds the peace.
  ...Object.fromEntries(PEACE_IRON_HOOKS.map(([text, twin]) => [text, Object.freeze([
    Object.freeze({ text, needs: Object.freeze(['institution: smith']), excludes: WAR_STATES_REFUSED }),
    Object.freeze({ text: twin, twinOf: text, excludes: Object.freeze(['institution: smith', ...WAR_STATES_REFUSED]) }),
  ])])),
  // CENSUS-3g unit 5 (R-AM read; R-U, R-G — the chair's rulings recorded in the lane doc): the
  // original presumes only the famine band ("Villagers" left the text: its `tier` read false on 110
  // of the 1,000); the moderate gap (Import-Dependent / Pressured, the chair's ruling 1 of
  // 2026-11-03) takes one twin with no famine words; a fed place DROPS the refused original at the
  // site (R-AU, CENSUS-1h; the hook-truth pass stays as defence in depth).
  [STARVING_HOOK]: Object.freeze([
    Object.freeze({ text: STARVING_HOOK, needs: Object.freeze(['food: ≤ deficit']) }),
    Object.freeze({
      text: MODERATE_GAP_TWIN,
      twinOf: STARVING_HOOK, excludes: Object.freeze(['food: ≤ deficit']), needs: Object.freeze(['food: ≤ pressured']),
    }),
  ]),
});
