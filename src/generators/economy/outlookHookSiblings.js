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
export const MODERATE_GAP_TWIN = 'The settlement grows less food than it eats, and a merchant has offered to make up the difference at a price the settlement cannot pay in coin.';
const STARVING_HOOK = 'The settlement is starving. Its hungriest are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';
export const OUTLOOK_HOOK_SIBLINGS = Object.freeze({
  "Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it. Find another supplier, or find out what is in those woods?": declaredSet(
    "Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it. Find another supplier, or find out what is in those woods?", ['navigable'],
    "Something is killing the forest the timber comes from, and the settlement's building trades stall without it. Find another supplier, or find out what is in those woods?"),
  'War has taken the iron: the metal suppliers sell to the armies first, and the smiths have nothing to mend tools with. Work slows, and people are starting to complain.': declaredSet(
    'War has taken the iron: the metal suppliers sell to the armies first, and the smiths have nothing to mend tools with. Work slows, and people are starting to complain.', ['institution: smith'],
    'War has taken the iron: the metal suppliers sell to the armies first, and the iron for tools and repairs stops arriving. Work slows, and people are starting to complain.'),
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
