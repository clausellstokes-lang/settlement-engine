/**
 * data/dailyLife/foodCulture.js — THE `food_culture` POOLS (DAILY-1 `lines/L2/LINES-2.md` § 1, revised by
 * `lines/L2/LINES-2b.md` § 5 and § 7, as the chair ruled: 18:47 (ruling 14: surplus 8, adequate 11 and critical 0
 * reworded; strained 0 "Loaves shrink each month …" cut, a time word at index 0) and 18:56 (ruling 11: every line declared
 * in the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `FOOD_CULTURE`: one frozen array a branch, keyed by the food band (`capacity.food_production`, as today): `surplus`,
 * `adequate`, `strained`, `critical`, `collapsed`; a surplus place under a famine or a siege threat takes
 * `surplus.wanting` (today's twin rule, BAR5-WORLD). Today's chain sub-branches are folded into their band (they printed
 * a chain's own output and name, an engine label). A line is a whole sentence, `{ id, text, needs, excludes? }` as in
 * `childWarnings.js`; the id is the line's number in LINES-2 § 1. What people eat is said from the food record
 * (`grain`, `fish`, `game`, `livestock`: `factsOf(r).foodSources`), so a line naming a food needs that source; "the
 * wealthier streets" and "the better-off" need a place larger than a hamlet (`tier: ≥ village`); "what can be bought"
 * needs a market. No line names a house by its roster name (they name kinds: "temple kitchens" needs a sacred house).
 * The deriver (`domain/dailyLife.js :: deriveFoodCulture`) hands the branch's lines to `facts/drawDeclared.js ::
 * filterDeclared` and picks one by `kernel/proseHash.js :: pickVariantMixed` keyed
 * `<record.name>::dailyLife.food_culture::<branch>`. No line needs a hideable house or a crime atom
 * (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * NOT BUILT (a need with no atom, ruling 10; `dailyLifeAtoms.test.js :: NOT_GRANTED`): `millSource` (the food record's
 * mill key): surplus #10 "Flour from the mill is never short, and nobody goes without bread." and adequate #13 "Flour
 * comes from the mill, and the bread made from it is the backbone of most suppers.". A line with no true need is not
 * eligible; each branch keeps the rest.
 *
 * THE CHAIR'S LINES OF B3 F1 (06:17 and E56 of 2026-11-22, `DAILY-3-HANDBACK.md` § 2 items 4 and 5, verbatim): adequate
 * #4 and #12 as the chair reworded them (the style law struck "rather than"), and strained #9 and critical #5 on `grain`
 * (the chair's ruling for `grainHeld`: a line that says bread needs grain in the food record).
 *
 * STRICTER NEEDS THAN LINES-2 WROTE (the walkers' own cure, a line declares what it presumes; wordings unchanged):
 * surplus #2 and #3 ("Food is plentiful …") and strained #4 ("Most households get by, but few have anything to spare …")
 * exclude `famine` (the food record's famine: the presumption-classes walker reads plentiful and to spare as the
 * `plenty` class, which the band this pool is keyed by does not answer); collapsed #0 ("temple kitchens") needs `church`
 * beside the sacred house (the presumed-things walker's `temple`: a wayside shrine keeps no temple kitchen).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string>, readonly excludes?: ReadonlyArray<string> }} FoodLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[], excludes?: string[] }>} lines @returns {ReadonlyArray<FoodLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}) })));

/** The pools by branch (the deriver's food band → its lines). */
export const FOOD_CULTURE = Object.freeze({
  /** a surplus band under a famine or a siege threat: what the stores still give (today's twin rule). */
  'surplus.wanting': frozen([
    { id: 'W0', text: 'The stores still hold: bread and broth reach most tables, and the households count what is left.', needs: ['grain', 'stores: > 0'] },
    { id: 'W1', text: 'There is still enough in store for now, but every household is careful with what it has.', needs: ['stores: > 0'] },
    { id: 'W2', text: 'The place still eats from what was put by, and nobody wastes a crumb of it.', needs: ['stores: > 0'] },
    { id: 'W3', text: 'Food is not short yet, but people eat as if it soon might be.', needs: [] },
    { id: 'W4', text: 'Most households still eat their fill, though talk always turns to how long that will last.', needs: [] },
  ]),
  surplus: frozen([
    { id: 'S0', text: 'Bread and broth are plentiful; few households go to bed hungry.', needs: ['grain'] },
    { id: 'S1', text: 'There is more than enough to eat, and nobody here goes to bed hungry.', needs: [] },
    { id: 'S2', text: 'Food is plentiful, and a guest is fed without anyone counting the cost.', needs: [], excludes: ['famine'] },
    { id: 'S3', text: 'Plain food is plentiful here, and second helpings are not begrudged.', needs: [], excludes: ['famine'] },
    { id: 'S4', text: 'Most households eat well, and what is left over is shared or put by.', needs: [] },
    { id: 'S5', text: 'The place grows more than it eats, and it shows in every household.', needs: ['food surplus'] },
    { id: 'S6', text: 'Fish is eaten fresh most days, and there is plenty of it.', needs: ['fish'] },
    { id: 'S7', text: 'There is fresh bread every day, and plenty of it to go round.', needs: ['grain'] },
    { id: 'S8', text: 'Meat is common fare here, and there is no shortage of it.', needs: ['livestock'] },
    { id: 'S9', text: 'The hunters bring in more than enough, and game is often in the pot.', needs: ['game'] },
    { id: 'S11', text: 'The place eats well and can afford to; even an ordinary supper has something extra in it.', needs: ['prosperity: ≥ comfortable'] },
    { id: 'S12', text: 'Money is not plentiful here, but food is, and nobody goes short.', needs: ['prosperity: ≤ poor'] },
  ]),
  adequate: frozen([
    { id: 'A0', text: 'Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets.', needs: ['grain', 'livestock', 'tier: ≥ village'] },
    { id: 'A1', text: 'There is enough to eat, if nobody asks for much more than the day needs.', needs: [] },
    { id: 'A2', text: 'Meals are plain and filling, and little goes to waste.', needs: [] },
    { id: 'A3', text: 'Most households eat simply, and they eat enough.', needs: [] },
    { id: 'A4', text: 'Food is steady here, if not generous, and every household has enough with little left over.', needs: [] },
    { id: 'A5', text: 'The everyday fare is a simple stew and whatever else the day provides.', needs: [] },
    { id: 'A6', text: 'A pot of stew over the fire is the usual supper, and there is usually enough to go round.', needs: [] },
    { id: 'A7', text: 'Nobody here goes hungry, though few eat richly.', needs: ['prosperity: < comfortable'] },
    { id: 'A8', text: 'Fish, fresh or dried, is the mainstay of most meals.', needs: ['fish'] },
    { id: 'A9', text: 'Bread is the mainstay of the table, with whatever else the household can add to it.', needs: ['grain'] },
    { id: 'A10', text: 'What the hunters bring home goes into the common pot, and it stretches a long way.', needs: ['game'] },
    { id: 'A11', text: 'What the herds give fills out plain meals.', needs: ['livestock'] },
    { id: 'A12', text: 'The grain is bought in, not grown here, so bread is never wasted.', needs: ['grain imported'] },
    { id: 'A14', text: 'The better-off eat well, and the rest eat plainly but enough.', needs: ['tier: ≥ village'] },
    { id: 'A15', text: 'Ordinary suppers here have a little more in them than plain fare elsewhere.', needs: ['prosperity: ≥ comfortable'] },
    { id: 'A16', text: 'Money is short, so meals are plain, but nobody goes without.', needs: ['prosperity: ≤ poor'] },
  ]),
  strained: frozen([
    { id: 'T1', text: 'Food is tighter than it should be, and households stretch what they have.', needs: [] },
    { id: 'T2', text: 'There is less to eat than people would like, and nothing is thrown away.', needs: [] },
    { id: 'T3', text: 'Portions are small, and the stew is often thinner than anyone would like.', needs: [] },
    { id: 'T4', text: 'Most households get by, but few have anything to spare at the end of the day.', needs: [], excludes: ['famine'] },
    { id: 'T5', text: 'People make do with plain stew and whatever can be found to put in it.', needs: [] },
    { id: 'T6', text: 'There is enough to keep going, but not enough to feel easy.', needs: [] },
    { id: 'T7', text: 'Food costs more than most people can comfortably pay, so they buy less of it.', needs: ['market'] },
    { id: 'T8', text: 'The catch does not go as far as it needs to, and fish is eaten sparingly.', needs: ['fish'] },
    { id: 'T9', text: 'Bread is eaten carefully, and not even the heel of the loaf is wasted.', needs: ['grain'] },
    { id: 'T10', text: 'Even in comfortable households, the cooks count what goes into the pot.', needs: ['prosperity: ≥ comfortable'] },
    { id: 'T11', text: 'Families here have little money, and they eat less than they would like.', needs: ['prosperity: ≤ poor'] },
  ]),
  critical: frozen([
    { id: 'C0', text: 'Rations are tight, and the poor eat watered stew.', needs: [] },
    { id: 'C1', text: 'Food is short, and many households go to bed hungry.', needs: [] },
    { id: 'C2', text: 'Every meal is measured out, and the poorest eat least.', needs: [] },
    { id: 'C3', text: 'There is not enough food to go round, and everyone knows it.', needs: [] },
    { id: 'C4', text: 'Most households eat less than they need, and the children are fed first.', needs: [] },
    { id: 'C5', text: 'The stew is thin and the bread is thinner.', needs: ['grain'] },
    { id: 'C6', text: 'Food is short, and what can be bought costs more than most can pay.', needs: ['market'] },
    { id: 'C7', text: 'The catch is too small to feed everyone, and fish is shared out carefully.', needs: ['fish'] },
  ]),
  collapsed: frozen([
    { id: 'X0', text: 'Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived.', needs: ['sacredHouse', 'church', 'route open'] },
    { id: 'X1', text: 'Hunger is everywhere, and every household is looking for its next meal.', needs: [] },
    { id: 'X2', text: 'There is almost nothing left to eat, and the whole place is hungry.', needs: [] },
    { id: 'X3', text: 'Food has all but run out, and people eat whatever they can find.', needs: [] },
  ]),
});

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 */
export const FOOD_CULTURE_DOES = Object.freeze({
  'surplus.wanting': Object.freeze({ states: 'food:surplus' }),
  surplus: Object.freeze({ states: 'food:surplus' }),
  adequate: Object.freeze({ states: 'food:adequate' }),
  strained: Object.freeze({ states: 'food:want' }),
  critical: Object.freeze({ states: 'food:want' }),
  collapsed: Object.freeze({ states: 'food:want' }),
});
