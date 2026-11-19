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
/** The iron line where the record holds no war: [original (needs a smith), twin]. TAIL-CRISIS (the chair's ruling K9; READ-ALL
 * 22079 22080 20908): no plural "smiths" where one forge stands, and no "iron merchants" the record does not hold; the three
 * originals reworded in foodBalance.js in the same commit, by exception. The iron carts' CONDITION (20893) is DEFECON's. */
export const PEACE_IRON_HOOKS = Object.freeze([
  Object.freeze(['Iron has doubled in price this season, and tools are being mended with scrap. Work slows, and people are starting to complain.',
    'Iron has doubled in price this season, and metal for tools and repairs is hard to come by. Work slows, and people are starting to complain.']),
  Object.freeze(['The iron carts are three weeks late and the carters will not say why. What iron there is goes out in rations, and work waits on mended tools.',
    'The iron carts are three weeks late and the carters will not say why. Broken tools stay broken, and work waits.']),
  Object.freeze(['A new toll on the iron road has made metal dear. People blame whoever set it, and the tools still need mending.',
    'A new toll on the iron road has made metal dear. Nobody will say who set it, and the tools still need mending.']),
]);
export { WAR_IRON_HOOK };
/** The war states a peacetime event refuses (domain/facts/warState.js :: WAR_STATES, less the peace). */
const WAR_STATES_REFUSED = Object.freeze(['war: front', 'war: aggressor', 'war: at war']);
/** COHERENCE-AGREE: the timber line's second event (foodBalance.js prints it), so no one line carries the pool. */
export const TIMBER_RAFT_HOOK = 'The timber rafts stopped coming a month ago, and the shipwrights and builders are bidding against each other for what is left in the yards.';
// BAR4-CORPUS-ECO (C47622, left by BAR3-DEFECON-2): "a price the settlement cannot pay in coin" beside a Strong economic resilience
// (5 of the 31 towns of the census's 720 that print the twin at 8aef8e7d4 score 72 to 100): the price is still not coin, which
// is the hook; whether the town could pay coin is no longer said.
export const MODERATE_GAP_TWIN = 'The settlement grows less food than it eats, and a merchant has offered to make up the difference for a price that is not paid in coin.';
const STARVING_HOOK = 'The settlement is starving. Its hungriest are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';
/** Where no merchant can come: an isolated route, or a siege on the roads (R3-CODE-C-2, CENSUS-2 kind a). */
const NO_MERCHANT_COMES = Object.freeze(['route: isolated', 'crisis: under_siege']);
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
  // R3-CODE-C-2 (CENSUS-2, kind a: "a merchant" in 45 of 720 towns, read town by town): a merchant who
  // offers food must be able to come. Where the route is isolated or a siege holds the roads, both
  // merchant lines are refused; a famine there reads the merchant-free twin, and a moderate gap
  // there has no hook (the moderate grade is keyed on MODERATE_GAP_TWIN alone, foodBalance.js).
  // (STARVING_SHUT_TWIN is named a twin for what it answers; it is declared as a member.)
  [STARVING_HOOK]: Object.freeze([
    Object.freeze({ text: STARVING_HOOK, needs: Object.freeze(['food: ≤ deficit']), excludes: NO_MERCHANT_COMES }),
    Object.freeze({
      text: MODERATE_GAP_TWIN,
      twinOf: STARVING_HOOK, excludes: Object.freeze(['food: ≤ deficit', ...NO_MERCHANT_COMES]), needs: Object.freeze(['food: ≤ pressured']),
    }),
    // not a twin: drawDeclared tries one twin, then the admitted members; this one is reached only when both refuse.
    // The famine line where no merchant can come: the same famine, no merchant in it. Its text stands in the member
    // that declares it (R3-CODE-C-6: the presumed-things walker credits a declaration only around its literal).
    // TAIL-CRISIS (READ-ALL 21965): banditry wants someone on the roads to rob; under a siege nothing comes in by road, so a
    // besieged famine reads the fourth member, the same famine with no road in it.
    Object.freeze({ text: 'The settlement is starving, and its hungriest are turning to banditry.', needs: Object.freeze(['food: ≤ deficit']), excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: 'The settlement is starving, and its hungriest steal what food they can find.', needs: Object.freeze(['food: ≤ deficit', 'crisis: under_siege']) }),
  ]),
});
/** The famine line where no merchant can come (the starving set's third member, read from where it is declared). */
export const STARVING_SHUT_TWIN = OUTLOOK_HOOK_SIBLINGS[STARVING_HOOK][2].text;

/**
 * BAR3-DEFECON-2 (the wide read's C48585, "The timber carts stopped coming a month ago…" where the trade record imports no
 * timber and the page's need row says timber is needed and not brought in). The timber line's two events (the rafts, and the
 * carts its `navigable` twin names) say a supply that came by road or river has stopped: each needs the record's own import
 * of timber (`foodBalance.js :: importHeld`, the iron hooks' rule, TAIL-DEFECON-3 D8). Where the import list holds none the
 * slot keeps its draw (`pick`, no roll) and prints this twin, which names no carts and no rafts. Measured on the census's
 * 720 at 7a4b48a84: the carts 18 of 30 false, the rafts 1 of 16; the forest line prints in none.
 */
export const TIMBER_SHORT_HOOK = 'Timber is short this season, and the builders are bidding against each other for what is left in the yards.';
/** A timber import on the record's import list ("Timber", "Lumber", "Shipbuilding wood"…). */
export const TIMBER_IMPORT = /timber|lumber|\bwood\b/i;
